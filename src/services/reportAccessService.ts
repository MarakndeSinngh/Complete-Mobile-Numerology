/**
 * LEOFAMILY REPORT ACCESS & ₹33 MONETIZATION CLIENT SERVICE
 * Phase 16: Centralized Access Gate & Payment Integration
 */

import {
  CanonicalReportType,
  REPORT_REGISTRY,
  ReportAccessCheckResult,
  PaymentOrderResponse,
  UserSession,
} from '../types/reportAccess';

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

  // 1. Request OTP for Indian mobile number
  public static async requestOtp(mobile: string): Promise<{ success: boolean; message: string; testOtp?: string }> {
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to request OTP');
    }
    return data;
  }

  // 2. Verify OTP & establish session
  public static async verifyOtp(mobile: string, otp: string): Promise<UserSession> {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to verify OTP');
    }

    const session: UserSession = {
      userId: data.user.id,
      mobile: data.user.mobile,
      mobileVerified: true,
      token: data.token,
      hasClaimedFreeReport: data.user.hasClaimedFreeReport,
      freeReportDetails: data.user.freeReportDetails,
    };

    this.saveSession(session);
    return session;
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

    const params = new URLSearchParams({
      reportType,
      profileKey: profileKey || 'default_profile',
    });
    if (activeMobile) params.append('mobile', activeMobile);
    if (token) params.append('token', token);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/reports/check-access?${params.toString()}`, {
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to check report access');
    }
    return data;
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

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/reports/claim-free', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        reportType,
        profileKey: profileKey || 'default_profile',
        mobile: activeMobile,
        token,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to claim free report');
    }

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

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        reportType,
        profileKey: profileKey || 'default_profile',
        mobile: activeMobile,
        token,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create payment order');
    }
    return data;
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

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/payments/verify-payment', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId,
        paymentId,
        signature,
        reportType,
        profileKey: profileKey || 'default_profile',
        mobile: activeMobile,
        token,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Payment verification failed');
    }
    return data;
  }
}
