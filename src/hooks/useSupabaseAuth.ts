/**
 * SUPABASE AUTH HOOK
 * Manages Supabase Auth session state, email OTP delivery, verification, and cooldown workflows.
 * Hardened for single-use OTP validation, duplicate request prevention, and JWT Bearer session synchronization.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ReportAccessService } from '../services/reportAccessService';
import { UserSession } from '../types/reportAccess';

export interface SupabaseAuthState {
  user: User | null;
  appUser: UserSession | null;
  session: Session | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  otpSent: boolean;
  targetEmail: string;
  cooldownSeconds: number;
  canResend: boolean;
  error: string | null;
  isConfigured: boolean;
}

export interface UseSupabaseAuthReturn extends SupabaseAuthState {
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; session?: any; error?: string }>;
  resendOtp: () => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
  resetOtpFlow: () => void;
  refreshSession: () => Promise<Session | null>;
}

const COOLDOWN_DURATION = 60; // 60 seconds cooldown between OTP requests

// Helper to safely mask email in debug logs
function maskEmail(email: string): string {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : '***';
  return `${maskedName}@${domain}`;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<UserSession | null>(() => ReportAccessService.getStoredUser());
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [targetEmail, setTargetEmail] = useState<string>('');
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSendingRef = useRef<boolean>(false);
  const isVerifyingRef = useRef<boolean>(false);
  const activeEmailRef = useRef<string>('');
  const activeRequestIdRef = useRef<string>('');
  const isConfigured = isSupabaseConfigured();

  // Clear cooldown interval helper
  const clearCooldownTimer = useCallback(() => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }, []);

  // Start cooldown countdown
  const startCooldown = useCallback((duration: number = COOLDOWN_DURATION) => {
    clearCooldownTimer();
    setCooldownSeconds(duration);
    cooldownTimerRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearCooldownTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearCooldownTimer]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      clearCooldownTimer();
    };
  }, [clearCooldownTimer]);

  // Initial session check and auth state listener
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isConfigured) {
          const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn('[useSupabaseAuth] getSession notice:', sessionError.message);
          }
          if (mounted && initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
        }
      } catch (err: any) {
        console.warn('[useSupabaseAuth] Initialization error:', err?.message || err);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setAppUser(ReportAccessService.getStoredUser());
        }
      }
    }

    initAuth();

    // Subscribe to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_OUT') {
          setAppUser(null);
          ReportAccessService.clearSession();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentSession?.user?.email) {
            const existing = ReportAccessService.getStoredUser();
            if (existing) {
              setAppUser(existing);
            }
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  // 1. Send OTP to email with strict deduplication
  const sendOtp = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      const msg = 'Please enter a valid email address';
      setError(msg);
      return { success: false, message: msg };
    }

    // Strict in-flight guard to prevent duplicate calls from double clicks
    if (isSendingRef.current) {
      return { success: false, message: 'OTP request already in progress' };
    }

    isSendingRef.current = true;
    setIsSendingOtp(true);
    setError(null);

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    activeRequestIdRef.current = requestId;
    activeEmailRef.current = cleanEmail;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SupabaseAuth] Requesting OTP [ID: ${requestId}] for ${maskEmail(cleanEmail)} at ${new Date().toISOString()}`);
    }

    try {
      if (isConfigured) {
        const redirectOrigin =
          typeof window !== 'undefined' && window.location?.origin
            ? window.location.origin
            : 'https://complete-mobile-numerology.vercel.app';

        const { error: sbError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectOrigin,
          },
        });

        if (sbError) {
          throw sbError;
        }
      } else {
        // Fallback: Call backend proxy endpoint
        const res = await fetch('/api/auth/send-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to send OTP');
        }
      }

      setOtpSent(true);
      setTargetEmail(cleanEmail);
      startCooldown(COOLDOWN_DURATION);

      return {
        success: true,
        message: `OTP sent successfully to ${cleanEmail}. Please check your inbox and spam folder.`,
      };
    } catch (err: any) {
      console.error('[useSupabaseAuth] sendOtp error:', err);
      let errorMsg = err?.message || 'Failed to send OTP. Please check your email and try again.';
      if (err?.status === 429 || errorMsg.toLowerCase().includes('rate')) {
        errorMsg = 'Too many requests. Please wait a minute before requesting another OTP.';
      }
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      isSendingRef.current = false;
      setIsSendingOtp(false);
    }
  }, [isConfigured, startCooldown]);

  // 2. Verify OTP with single-use consumption safeguard & backend sync
  const verifyOtp = useCallback(async (
    email: string,
    token: string
  ): Promise<{ success: boolean; session?: any; error?: string }> => {
    const cleanEmail = (email || activeEmailRef.current || targetEmail || '').trim().toLowerCase();
    const cleanToken = (token || '').replace(/[\s-]/g, '').trim();

    if (!cleanEmail) {
      const msg = 'Email address is required';
      setError(msg);
      return { success: false, error: msg };
    }

    if (!cleanToken || cleanToken.length < 4) {
      const msg = 'Please enter the verification code received on your email';
      setError(msg);
      return { success: false, error: msg };
    }

    // In-flight guard
    if (isVerifyingRef.current) {
      return { success: false, error: 'Verification in progress...' };
    }

    isVerifyingRef.current = true;
    setIsVerifyingOtp(true);
    setError(null);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SupabaseAuth] Verifying OTP [Length: ${cleanToken.length}] for ${maskEmail(cleanEmail)}`);
    }

    try {
      let verifiedSession: Session | null = null;
      let verifiedUser: User | null = null;
      let accessToken = '';

      if (isConfigured) {
        // Step 1: Verify directly with Supabase Auth client
        const { data, error: sbError } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'email',
        });

        if (sbError) {
          const rawMsg = sbError.message || '';
          if (rawMsg.toLowerCase().includes('expired') || rawMsg.toLowerCase().includes('invalid')) {
            throw new Error('यह OTP मान्य नहीं है या समाप्त हो चुका है। कृपया नवीनतम कोड दर्ज करें (Invalid or expired OTP).');
          }
          throw sbError;
        }

        verifiedSession = data.session;
        verifiedUser = data.user;
        accessToken = verifiedSession?.access_token || '';

        if (!verifiedSession || !accessToken) {
          throw new Error('Supabase authentication completed without valid session token.');
        }

        setSession(verifiedSession);
        setUser(verifiedUser);

        // Step 2: Synchronize with backend using the validated JWT Bearer Token
        const syncRes = await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ email: cleanEmail }),
        });

        if (!syncRes.ok) {
          const syncErrData = await syncRes.json().catch(() => ({}));
          throw new Error(syncErrData.error || 'Backend session synchronization failed. Please retry.');
        }

        const syncData = await syncRes.json();
        if (!syncData.success || !syncData.user) {
          throw new Error('Failed to resolve authenticated user profile from backend.');
        }

        const appUserSession: UserSession = {
          userId: syncData.user.id,
          supabaseUserId: syncData.user.supabaseUserId || verifiedUser?.id,
          email: cleanEmail,
          emailVerified: true,
          mobile: syncData.user.mobile || '',
          mobileVerified: !!syncData.user.mobile,
          token: accessToken,
          hasClaimedFreeReport: !!syncData.user.hasClaimedFreeReport,
          freeReportDetails: syncData.user.freeReportDetails,
        };

        ReportAccessService.saveSession(appUserSession);
        setAppUser(appUserSession);
        clearCooldownTimer();
        setCooldownSeconds(0);

        return {
          success: true,
          session: appUserSession,
        };
      } else {
        // Fallback for local development environment without client-side Supabase keys: Verify via backend endpoint
        const backendRes = await fetch('/api/auth/verify-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            token: cleanToken,
          }),
        });

        const backendData = await backendRes.json();
        if (!backendRes.ok || !backendData.success) {
          const rawErr = backendData.error || 'Invalid or expired OTP';
          if (rawErr.toLowerCase().includes('expired') || rawErr.toLowerCase().includes('invalid')) {
            throw new Error('यह OTP मान्य नहीं है या समाप्त हो चुका है। कृपया नवीनतम कोड दर्ज करें (Invalid or expired OTP).');
          }
          throw new Error(rawErr);
        }

        const userObj = backendData.user;
        const sessionObj = backendData.session;
        if (!userObj || !sessionObj?.access_token) {
          throw new Error('Server did not return a valid authentication session.');
        }
        accessToken = sessionObj.access_token;

        const appUserSession: UserSession = {
          userId: userObj.id,
          supabaseUserId: userObj.supabaseUserId || userObj.id,
          email: cleanEmail,
          emailVerified: true,
          mobile: userObj.mobile || '',
          mobileVerified: !!userObj.mobile,
          token: accessToken,
          hasClaimedFreeReport: !!userObj.hasClaimedFreeReport,
          freeReportDetails: userObj.freeReportDetails,
        };

        ReportAccessService.saveSession(appUserSession);
        setAppUser(appUserSession);
        clearCooldownTimer();
        setCooldownSeconds(0);

        return {
          success: true,
          session: appUserSession,
        };
      }
    } catch (err: any) {
      console.error('[useSupabaseAuth] verifyOtp error:', err);
      const errorMsg = err?.message || 'Verification failed. Please check your OTP code and retry.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      isVerifyingRef.current = false;
      setIsVerifyingOtp(false);
    }
  }, [clearCooldownTimer, isConfigured, targetEmail]);

  // 3. Resend OTP to the active email
  const resendOtp = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (cooldownSeconds > 0) {
      return {
        success: false,
        message: `Please wait ${cooldownSeconds} seconds before requesting a new code.`,
      };
    }
    const emailToResend = activeEmailRef.current || targetEmail;
    if (!emailToResend) {
      return {
        success: false,
        message: 'No email address available to resend code.',
      };
    }
    return await sendOtp(emailToResend);
  }, [cooldownSeconds, sendOtp, targetEmail]);

  // 4. Sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      if (isConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[useSupabaseAuth] Sign out notice:', err);
    } finally {
      ReportAccessService.clearSession();
      setUser(null);
      setAppUser(null);
      setSession(null);
      setOtpSent(false);
      setTargetEmail('');
      activeEmailRef.current = '';
      setError(null);
      clearCooldownTimer();
      setCooldownSeconds(0);
    }
  }, [clearCooldownTimer, isConfigured]);

  // 5. Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 6. Reset OTP flow
  const resetOtpFlow = useCallback(() => {
    setOtpSent(false);
    setTargetEmail('');
    activeEmailRef.current = '';
    setError(null);
    clearCooldownTimer();
    setCooldownSeconds(0);
  }, [clearCooldownTimer]);

  // 7. Refresh current session
  const refreshSession = useCallback(async (): Promise<Session | null> => {
    try {
      if (isConfigured) {
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        setSession(freshSession);
        setUser(freshSession?.user ?? null);
        return freshSession;
      }
    } catch (err) {
      console.warn('[useSupabaseAuth] refreshSession notice:', err);
    }
    return null;
  }, [isConfigured]);

  const isAuthenticated = !!(user || appUser || session);
  const accessToken = session?.access_token || appUser?.token || null;
  const canResend = otpSent && cooldownSeconds === 0;

  return {
    user,
    appUser,
    session,
    accessToken,
    isAuthenticated,
    isLoading,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    targetEmail,
    cooldownSeconds,
    canResend,
    error,
    isConfigured,
    sendOtp,
    verifyOtp,
    resendOtp,
    signOut,
    clearError,
    resetOtpFlow,
    refreshSession,
  };
}
