/**
 * LEOFAMILY REPORT ACCESS & ₹33 MONETIZATION CLIENT SERVICE
 * Phase 16C.4: Supabase Auth Email OTP & Centralized Entitlement Integration
 * Hardened with safe JSON response parsing to prevent unexpected HTML/text parse exceptions.
 */

import {
  CanonicalReportType,
  REPORT_REGISTRY,
  ReportAccessCheckResult,
  PaymentOrderResponse,
  UserSession,
} from '../types/reportAccess';
import { safeFetchJson } from './safeApiHelper';

const TOKEN_KEY = 'leofamily_auth_token';
const USER_KEY = 'leofamily_auth_user';

export class ReportAccessService {
  // Get currently stored user session token
  public static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  // Get currently stored user data
  public static getStoredUser(): UserSession | null {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignored
    }
    return null;
  }

  // Save authenticated session
  public static saveSession(session: UserSession) {
    try {
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn("Could not save auth session:", e);
    }
  }

  // Clear session
  public static clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      // Ignored
    }
  }

  // Ensure Razorpay SDK is loaded on client
  public static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      if (typeof document !== 'undefined') {
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(true));
          existingScript.addEventListener('error', () => resolve(false));
          if ((window as any).Razorpay) resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      } else {
        resolve(false);
      }
    });
  }

  // 1. Synchronize Supabase Auth session with backend
  public static async syncSession(token?: string, profileData?: any): Promise<{ success: boolean; user?: any; profile?: any }> {
    const authToken = token || this.getToken();
    if (!authToken) {
      throw new Error("No authentication token available to sync");
    }

    const data = await safeFetchJson<{ success: boolean; user?: any; profile?: any; error?: string }>(
      '/api/auth/sync-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileData || {}),
      }
    );

    if (data.success && data.user) {
      const appUser: UserSession = {
        userId: data.user.id,
        supabaseUserId: data.user.supabaseUserId || data.user.id,
        email: data.user.email || '',
        emailVerified: !!data.user.emailVerified,
        phone: data.user.phone || '',
        phoneVerified: !!data.user.phoneVerified,
        fullName: data.user.fullName || '',
        avatarUrl: data.user.avatarUrl || '',
        authProvider: data.user.authProvider || 'supabase',
        mobile: data.user.phone || data.user.mobile || '',
        mobileVerified: !!(data.user.phoneVerified || data.user.mobileVerified),
        token: authToken,
        hasClaimedFreeReport: !!data.user.hasClaimedFreeReport,
        freeReportDetails: data.user.freeReportDetails,
      };
      this.saveSession(appUser);
    }

    return data;
  }

  // 2. Save / Update User Numerology Profile
  public static async saveNumerologyProfile(profileData: {
    fullName: string;
    dateOfBirth: string;
    mobileNumber?: string;
    email?: string;
    gender?: string;
    language?: string;
    mulank?: number;
    bhagyank?: number;
    kuaNumber?: number;
  }): Promise<{ success: boolean; profile?: any }> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<{ success: boolean; profile?: any }>(
      '/api/profiles/save',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(profileData),
      }
    );
  }

  // 3. Get Current User's Saved Numerology Profile
  public static async getCurrentNumerologyProfile(): Promise<{ success: boolean; profile?: any }> {
    const token = this.getToken();
    if (!token) return { success: true, profile: null };

    const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };
    return await safeFetchJson<{ success: boolean; profile?: any }>(
      '/api/profiles/current',
      { headers }
    );
  }

  // 4. Record Report Run
  public static async recordReportRun(reportData: {
    reportType: string;
    profileName?: string;
    dobString?: string;
    reportKey?: string;
    language?: string;
    metadata?: any;
  }): Promise<{ success: boolean; reportRunId?: string }> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<{ success: boolean; reportRunId?: string }>(
      '/api/reports/record-run',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(reportData),
      }
    );
  }

  // 5. Log User Activity
  public static async logActivity(eventType: string, metadata: any = {}): Promise<void> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await safeFetchJson('/api/activity/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({ eventType, metadata }),
      });
    } catch {
      // Ignored
    }
  }

  // 3. Central Report Access Check
  public static async checkAccess(
    reportType: CanonicalReportType,
    profileKey: string,
    mobile?: string
  ): Promise<ReportAccessCheckResult> {
    // 1. Mobile numerology is always permanently free
    if (reportType === 'MOBILE_NUMEROLOGY') {
      return {
        allowed: true,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: true,
        canClaimFree: false,
        price: 0,
        reportType,
        profileKey: profileKey || 'default_profile',
        accessType: 'FREE',
      };
    }

    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const params = new URLSearchParams({
      reportType,
      profileKey: profileKey || 'default_profile',
    });
    if (activeEmail) params.append('email', activeEmail);
    if (activeMobile) params.append('mobile', activeMobile);
    if (token) params.append('token', token);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      return await safeFetchJson<ReportAccessCheckResult>(
        `/api/reports/check-access?${params.toString()}`,
        { headers }
      );
    } catch (err: any) {
      console.warn("API check-access notice:", err.message);
      return {
        allowed: false,
        requiresPayment: true,
        isFirstFreeReport: !storedUser?.hasClaimedFreeReport,
        isFreeReportType: false,
        canClaimFree: !storedUser?.hasClaimedFreeReport,
        price: 33,
        reportType,
        profileKey: profileKey || 'default_profile',
        accessType: 'PAID',
      };
    }
  }

  // 4. Claim First Free Report
  public static async claimFreeReport(
    reportType: CanonicalReportType,
    profileKey: string,
    mobile?: string
  ): Promise<{ success: boolean; allowed: boolean; entitlement: any }> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const data = await safeFetchJson<{ success: boolean; allowed: boolean; entitlement: any }>(
      '/api/reports/claim-free',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reportType,
          profileKey: profileKey || 'default_profile',
          email: activeEmail,
          mobile: activeMobile,
          token,
        }),
      }
    );

    // Update stored session if present
    if (storedUser) {
      storedUser.hasClaimedFreeReport = true;
      storedUser.freeReportDetails = {
        reportType,
        claimedAt: new Date().toISOString(),
        profileKey: profileKey || 'default_profile',
      };
      this.saveSession(storedUser);
    }

    return data;
  }

  // 5. Create ₹33 Payment Order
  public static async createPaymentOrder(
    reportType: CanonicalReportType,
    profileKey: string,
    mobile?: string
  ): Promise<PaymentOrderResponse> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<PaymentOrderResponse>(
      '/api/payments/create-order',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reportType,
          profileKey: profileKey || 'default_profile',
          email: activeEmail,
          mobile: activeMobile,
          token,
        }),
      }
    );
  }

  // 6. Verify Payment & Grant Entitlement
  public static async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
    reportType: CanonicalReportType,
    profileKey: string,
    mobile?: string
  ): Promise<{ success: boolean; accessGranted: boolean; entitlement: any }> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<{ success: boolean; accessGranted: boolean; entitlement: any }>(
      '/api/payments/verify-payment',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          reportType,
          profileKey: profileKey || 'default_profile',
          email: activeEmail,
          mobile: activeMobile,
          token,
        }),
      }
    );
  }

  // 7. Get Customer's Historical Reports (Authoritative Server Query)
  public static async getMyReports(mobile?: string): Promise<any> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const params = new URLSearchParams();
    if (activeEmail) params.append('email', activeEmail);
    if (activeMobile) params.append('mobile', activeMobile);
    if (token) params.append('token', token);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<any>(
      `/api/reports/my-reports?${params.toString()}`,
      { headers }
    );
  }

  // 8. Get Customer's Verified Payment History
  public static async getPaymentHistory(mobile?: string): Promise<any> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const params = new URLSearchParams();
    if (activeEmail) params.append('email', activeEmail);
    if (activeMobile) params.append('mobile', activeMobile);
    if (token) params.append('token', token);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<any>(
      `/api/payments/history?${params.toString()}`,
      { headers }
    );
  }

  // 9. Get Entitlement Access Summary
  public static async getAccessSummary(mobile?: string): Promise<any> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const params = new URLSearchParams();
    if (activeEmail) params.append('email', activeEmail);
    if (activeMobile) params.append('mobile', activeMobile);
    if (token) params.append('token', token);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<any>(
      `/api/reports/access-summary?${params.toString()}`,
      { headers }
    );
  }

  // 10. Get Single Report by ID with Server Entitlement Check
  public static async getReportById(reportId: string, mobile?: string): Promise<any> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const activeMobile = mobile || storedUser?.mobile;
    const activeEmail = storedUser?.email;

    const params = new URLSearchParams();
    if (activeEmail) params.append('email', activeEmail);
    if (activeMobile) params.append('mobile', activeMobile);
    if (token) params.append('token', token);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<any>(
      `/api/reports/${encodeURIComponent(reportId)}?${params.toString()}`,
      { headers }
    );
  }
}
