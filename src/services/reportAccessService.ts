/**
 * LEOFAMILY REPORT ACCESS & ₹33 MONETIZATION CLIENT SERVICE
 * Supabase Auth & Centralized Entitlement Integration
 * Hardened with safe JSON response parsing to prevent unexpected HTML/text parse exceptions.
 */

import {
  CanonicalReportType,
  REPORT_REGISTRY,
  ReportAccessCheckResult,
  PaymentOrderResponse,
  UserSession,
  isPublicReport,
} from '../types/reportAccess';
import { safeFetchJson } from './safeApiHelper';
import { supabase } from '../lib/supabaseClient';

export class ReportAccessService {
  // Canonical check for public reports
  public static isPublicReport(reportType: string | CanonicalReportType): boolean {
    return isPublicReport(reportType);
  }

  // Get currently active Supabase session token
  public static getToken(): string | null {
    try {
      // Synchronously retrieve active session token from Supabase Auth storage if present
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed?.access_token) return parsed.access_token;
            }
          }
        }
      }
    } catch {
      // Fallback
    }
    return null;
  }

  // Get currently active authenticated Supabase user profile
  public static getStoredUser(): UserSession | null {
    try {
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              const user = parsed?.user;
              if (user) {
                return {
                  userId: user.id,
                  supabaseUserId: user.id,
                  email: user.email || '',
                  emailVerified: !!user.email_confirmed_at,
                  phone: user.phone || '',
                  phoneVerified: !!user.phone_confirmed_at,
                  fullName: user.user_metadata?.full_name || '',
                  avatarUrl: user.user_metadata?.avatar_url || '',
                  authProvider: user.app_metadata?.provider || 'supabase',
                  mobile: user.phone || '',
                  mobileVerified: !!user.phone_confirmed_at,
                  token: parsed.access_token || '',
                  hasClaimedFreeReport: false,
                };
              }
            }
          }
        }
      }
    } catch {
      // Fallback
    }
    return null;
  }

  // Compatibility no-op methods (Supabase manages session persistence automatically)
  public static saveSession(_session: UserSession): void {
    // Supabase Auth handles its own session persistence
  }

  public static clearSession(): void {
    // Cleared via supabase.auth.signOut()
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
    let authToken = token;
    if (!authToken) {
      const { data } = await supabase.auth.getSession();
      authToken = data?.session?.access_token || this.getToken() || undefined;
    }

    if (!authToken) {
      throw new Error("No authenticated Supabase session available to sync");
    }

    return await safeFetchJson<{ success: boolean; user?: any; profile?: any; error?: string }>(
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
    // 1. Mobile numerology & Lo Shu are always permanently free
    if (isPublicReport(reportType)) {
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
        isFirstFreeReport: true,
        isFreeReportType: false,
        canClaimFree: false,
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

    return await safeFetchJson<{ success: boolean; allowed: boolean; entitlement: any }>(
      '/api/reports/claim-free',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reportType,
          profileKey: profileKey || 'default_profile',
          email: activeEmail,
          mobile: activeMobile,
        }),
      }
    );
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

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<any>(
      `/api/reports/${encodeURIComponent(reportId)}?${params.toString()}`,
      { headers }
    );
  }

  // 11. Submit UPI QR Payment UTR
  public static async submitUpiPayment(
    reportType: CanonicalReportType,
    profileKey: string,
    utrNumber: string,
    upiId?: string,
    userName?: string
  ): Promise<{ success: boolean; submissionId?: string; status?: string; message?: string; error?: string }> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<{ success: boolean; submissionId?: string; status?: string; message?: string; error?: string }>(
      '/api/payments/submit-utr',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reportType,
          profileKey: profileKey || 'default_profile',
          utrNumber,
          upiId: upiId || 'leofamily@upi',
          userName: userName || storedUser?.fullName || 'Seeker',
          email: storedUser?.email,
        }),
      }
    );
  }

  // 12. Get User's UPI Submissions
  public static async getMyUpiSubmissions(emailOrMobile?: string): Promise<{ success: boolean; submissions: any[] }> {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    const params = new URLSearchParams();
    if (emailOrMobile) {
      if (emailOrMobile.includes('@')) {
        params.append('email', emailOrMobile);
      } else {
        params.append('mobile', emailOrMobile);
      }
    } else if (storedUser?.email) {
      params.append('email', storedUser.email);
    }

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return await safeFetchJson<{ success: boolean; submissions: any[] }>(
      `/api/payments/my-upi-submissions?${params.toString()}`,
      { headers }
    );
  }

  // 13. Admin: Get Pending UPI Payments
  public static async getAdminPendingPayments(): Promise<{ success: boolean; submissions: any[] }> {
    return await safeFetchJson<{ success: boolean; submissions: any[] }>('/api/admin/pending-upi-payments');
  }

  // 14. Admin: Verify (Approve / Reject) UPI Payment
  public static async adminVerifyPayment(
    submissionId: string,
    action: 'APPROVE' | 'REJECT',
    rejectionReason?: string
  ): Promise<{ success: boolean; status: string; message: string }> {
    return await safeFetchJson<{ success: boolean; status: string; message: string }>(
      '/api/admin/verify-upi-payment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          action,
          rejectionReason,
          verifiedBy: 'Admin',
        }),
      }
    );
  }

  // Alias for backward compatibility
  public static async verifyUpiPayment(
    submissionId: string,
    status: 'APPROVED' | 'REJECTED',
    adminNotes?: string
  ): Promise<{ success: boolean; status: string; message: string }> {
    return this.adminVerifyPayment(
      submissionId,
      status === 'APPROVED' ? 'APPROVE' : 'REJECT',
      adminNotes
    );
  }
}
