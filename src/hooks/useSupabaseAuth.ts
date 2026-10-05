/**
 * SUPABASE AUTHENTICATION HOOK & STATE MANAGER
 * Phase 16: Production Supabase Auth (Google OAuth & WhatsApp Phone OTP)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ReportAccessService } from '../services/reportAccessService';
import { UserSession, UserProfileData } from '../types/reportAccess';

export interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  appUser: UserSession | null;
  profile: UserProfileData | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  otpSent: boolean;
  targetPhone: string;
  cooldownSeconds: number;
  canResend: boolean;
  error: string | null;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithWhatsApp: (phone: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyWhatsAppOtp: (phone: string, token: string) => Promise<{ success: boolean; session?: any; error?: string }>;
  resendWhatsAppOtp: () => Promise<{ success: boolean; message?: string; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
  resetOtpFlow: () => void;
  refreshSession: () => Promise<Session | null>;
}

const COOLDOWN_DURATION = 60; // 60 seconds countdown between WhatsApp OTP requests

// Formats phone to international E.164 standard (e.g. +919876543210)
export function formatToE164(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.substring(1)}`;
  }
  if (digits.startsWith('91')) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<UserSession | null>(() => ReportAccessService.getStoredUser());
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [targetPhone, setTargetPhone] = useState<string>('');
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSendingRef = useRef<boolean>(false);
  const isVerifyingRef = useRef<boolean>(false);
  const activePhoneRef = useRef<string>('');
  const isConfigured = isSupabaseConfigured();

  const clearCooldownTimer = useCallback(() => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }, []);

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

  useEffect(() => {
    return () => {
      clearCooldownTimer();
    };
  }, [clearCooldownTimer]);

  // Sync session with backend
  const syncWithBackend = useCallback(async (currentSession: Session | null) => {
    if (!currentSession?.access_token) return;
    try {
      const syncRes = await ReportAccessService.syncSession(currentSession.access_token);
      if (syncRes.success && syncRes.user) {
        const stored = ReportAccessService.getStoredUser();
        if (stored) {
          setAppUser(stored);
        }
        if (syncRes.profile) {
          setProfile(syncRes.profile);
        }
      }
    } catch (err) {
      console.warn('[useSupabaseAuth] Backend sync notice:', err);
    }
  }, []);

  // Initialize session & Auth state listener
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
            ReportAccessService.setCurrentSession(initialSession);
            await syncWithBackend(initialSession);
          }
        }
      } catch (err: any) {
        console.warn('[useSupabaseAuth] Init error:', err?.message || err);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setAppUser(ReportAccessService.getStoredUser());
        }
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        ReportAccessService.setCurrentSession(currentSession);

        if (event === 'SIGNED_OUT') {
          setAppUser(null);
          setProfile(null);
          ReportAccessService.clearSession();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentSession) {
            await syncWithBackend(currentSession);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured, syncWithBackend]);

  // 1. Google OAuth Sign In
  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      if (!isConfigured) {
        throw new Error('Supabase Authentication is not configured. Please check environment variables.');
      }

      const redirectUrl =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'https://complete-mobile-numerology.vercel.app';

      const { error: sbError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (sbError) {
        throw sbError;
      }

      return { success: true };
    } catch (err: any) {
      console.error('[useSupabaseAuth] Google Sign-In error:', err);
      const msg = err?.message || 'Google login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, [isConfigured]);

  // 2. WhatsApp Phone OTP Sign In
  const signInWithWhatsApp = useCallback(async (
    rawPhone: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const formattedPhone = formatToE164(rawPhone);
    const digitsOnly = formattedPhone.replace(/\D/g, '');

    if (!formattedPhone || digitsOnly.length < 10) {
      const msg = 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें (Please enter a valid mobile number)';
      setError(msg);
      return { success: false, error: msg };
    }

    if (isSendingRef.current) {
      return { success: false, error: 'OTP request already in progress...' };
    }

    isSendingRef.current = true;
    setIsSendingOtp(true);
    setError(null);

    activePhoneRef.current = formattedPhone;

    try {
      if (!isConfigured) {
        throw new Error('Supabase Authentication is not configured.');
      }

      // Send OTP via Supabase Phone Auth with WhatsApp channel
      const { error: sbError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'whatsapp',
          shouldCreateUser: true,
        },
      });

      if (sbError) {
        throw sbError;
      }

      setOtpSent(true);
      setTargetPhone(formattedPhone);
      startCooldown(COOLDOWN_DURATION);

      return {
        success: true,
        message: `WhatsApp verification code sent to ${formattedPhone}. Please check your WhatsApp messages.`,
      };
    } catch (err: any) {
      console.error('[useSupabaseAuth] WhatsApp OTP send error:', err);
      let msg = err?.message || 'Unable to send WhatsApp code. Please check your phone number and try again.';
      if (err?.status === 429 || msg.toLowerCase().includes('rate')) {
        msg = 'Too many attempts. Please wait a minute before requesting another code.';
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      isSendingRef.current = false;
      setIsSendingOtp(false);
    }
  }, [isConfigured, startCooldown]);

  // 3. Verify WhatsApp OTP
  const verifyWhatsAppOtp = useCallback(async (
    rawPhone: string,
    token: string
  ): Promise<{ success: boolean; session?: any; error?: string }> => {
    const formattedPhone = formatToE164(rawPhone || activePhoneRef.current || targetPhone);
    const cleanToken = (token || '').replace(/[\s-]/g, '').trim();

    if (!formattedPhone) {
      const msg = 'Phone number is required';
      setError(msg);
      return { success: false, error: msg };
    }

    if (!cleanToken || cleanToken.length < 4) {
      const msg = 'कृपया व्हाट्सएप पर प्राप्त सत्यापन कोड दर्ज करें (Please enter the WhatsApp verification code)';
      setError(msg);
      return { success: false, error: msg };
    }

    if (isVerifyingRef.current) {
      return { success: false, error: 'Verification in progress...' };
    }

    isVerifyingRef.current = true;
    setIsVerifyingOtp(true);
    setError(null);

    try {
      if (!isConfigured) {
        throw new Error('Supabase Authentication is not configured.');
      }

      // Verify OTP with Supabase Auth Phone API
      const { data, error: sbError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: cleanToken,
        type: 'sms', // Standard Supabase type for phone verification
      });

      if (sbError) {
        const rawMsg = sbError.message || '';
        if (rawMsg.toLowerCase().includes('expired') || rawMsg.toLowerCase().includes('invalid')) {
          throw new Error('यह WhatsApp कोड अमान्य है या समाप्त हो चुका है। कृपया नवीनतम कोड दर्ज करें (Invalid or expired code).');
        }
        throw sbError;
      }

      const verifiedSession = data.session;
      const verifiedUser = data.user;
      const accessToken = verifiedSession?.access_token || '';

      if (!verifiedSession || !accessToken) {
        throw new Error('Supabase authentication completed without valid session token.');
      }

      setSession(verifiedSession);
      setUser(verifiedUser);

      // Sync verified user profile with PostgreSQL backend
      await syncWithBackend(verifiedSession);

      clearCooldownTimer();
      setCooldownSeconds(0);

      return {
        success: true,
        session: verifiedSession,
      };
    } catch (err: any) {
      console.error('[useSupabaseAuth] verifyWhatsAppOtp error:', err);
      const msg = err?.message || 'Verification failed. Please check the code and retry.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      isVerifyingRef.current = false;
      setIsVerifyingOtp(false);
    }
  }, [clearCooldownTimer, isConfigured, syncWithBackend, targetPhone]);

  // 4. Resend WhatsApp OTP
  const resendWhatsAppOtp = useCallback(async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (cooldownSeconds > 0) {
      return {
        success: false,
        error: `Please wait ${cooldownSeconds} seconds before requesting a new code.`,
      };
    }
    const phoneToResend = activePhoneRef.current || targetPhone;
    if (!phoneToResend) {
      return {
        success: false,
        error: 'No phone number available to resend code.',
      };
    }
    return await signInWithWhatsApp(phoneToResend);
  }, [cooldownSeconds, signInWithWhatsApp, targetPhone]);

  // 5. Sign Out
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
      setSession(null);
      setAppUser(null);
      setProfile(null);
      setOtpSent(false);
      setTargetPhone('');
      activePhoneRef.current = '';
      setError(null);
      clearCooldownTimer();
      setCooldownSeconds(0);
    }
  }, [clearCooldownTimer, isConfigured]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetOtpFlow = useCallback(() => {
    setOtpSent(false);
    setTargetPhone('');
    activePhoneRef.current = '';
    setError(null);
    clearCooldownTimer();
    setCooldownSeconds(0);
  }, [clearCooldownTimer]);

  const refreshSession = useCallback(async (): Promise<Session | null> => {
    try {
      if (isConfigured) {
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        setSession(freshSession);
        setUser(freshSession?.user ?? null);
        if (freshSession) {
          await syncWithBackend(freshSession);
        }
        return freshSession;
      }
    } catch (err) {
      console.warn('[useSupabaseAuth] refreshSession notice:', err);
    }
    return null;
  }, [isConfigured, syncWithBackend]);

  const isAuthenticated = !!(user || session || appUser?.token);
  const accessToken = session?.access_token || appUser?.token || null;
  const canResend = otpSent && cooldownSeconds === 0;

  return {
    user,
    session,
    appUser,
    profile,
    accessToken,
    isAuthenticated,
    isLoading,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    targetPhone,
    cooldownSeconds,
    canResend,
    error,
    isConfigured,
    signInWithGoogle,
    signInWithWhatsApp,
    verifyWhatsAppOtp,
    resendWhatsAppOtp,
    signOut,
    clearError,
    resetOtpFlow,
    refreshSession,
  };
}
