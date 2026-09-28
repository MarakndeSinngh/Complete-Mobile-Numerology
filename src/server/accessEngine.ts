/**
 * LEOFAMILY DURABLE POSTGRESQL REPORT ACCESS CONTROL & SUPABASE EMAIL OTP ENGINE
 * Phase 16C.3: Supabase Auth Passwordless Email OTP, PostgreSQL Persistence & Entitlements
 */

import crypto from 'crypto';
import {
  CanonicalReportType,
  REPORT_REGISTRY,
  ReportAccessCheckResult,
  ReportEntitlementRecord,
  PaymentOrderResponse,
  UserReportItem,
  PaymentHistoryItem,
  UserAccessSummary
} from '../types/reportAccess';
import {
  isDatabaseConfigured,
  ensureDatabaseSchema,
  query,
  withTransaction
} from './db';
import {
  isSupabaseServerConfigured,
  getServerSupabaseClient,
  verifySupabaseToken
} from './supabaseServer';

export const REPORT_PRICE_INR = 33;
export const REPORT_PRICE_PAISE = 3300;

// Dynamic check for Serverless runtime
export function isServerlessRuntime(): boolean {
  return !!(
    (typeof process !== 'undefined' && process.env?.VERCEL) ||
    (typeof process !== 'undefined' && process.env?.AWS_LAMBDA_FUNCTION_VERSION) ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production')
  );
}

// Log safe configuration diagnostics without exposing secret values
export function getSafeConfigAudit() {
  const env = (typeof process !== 'undefined' && process.env) || {};
  return {
    AUTH_PROVIDER: 'SUPABASE_EMAIL_OTP',
    SUPABASE_AUTH_CONFIGURED: isSupabaseServerConfigured(),
    SUPABASE_URL_PRESENT: !!(env.SUPABASE_URL || env.VITE_SUPABASE_URL),
    SUPABASE_KEY_PRESENT: !!(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY),
    DATABASE_CONFIGURED: isDatabaseConfigured(),
    RAZORPAY_KEY_PRESENT: !!env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET_PRESENT: !!env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_PRESENT: !!env.RAZORPAY_WEBHOOK_SECRET,
    GEMINI_KEY_PRESENT: !!env.GEMINI_API_KEY,
    IS_SERVERLESS_RUNTIME: isServerlessRuntime()
  };
}

export function getRazorpayKeyId(): string {
  return (typeof process !== 'undefined' && process.env?.RAZORPAY_KEY_ID) || 'rzp_test_leofamily_sandbox';
}

export function getRazorpayKeySecret(): string {
  return (typeof process !== 'undefined' && process.env?.RAZORPAY_KEY_SECRET) || 'sandbox_secret_leofamily_2026';
}

export function getRazorpayWebhookSecret(): string {
  return (typeof process !== 'undefined' && process.env?.RAZORPAY_WEBHOOK_SECRET) || 'sandbox_webhook_secret_leofamily_2026';
}

export function normalizeEmail(rawEmail: string | undefined | null): string {
  if (!rawEmail || typeof rawEmail !== 'string') return '';
  return rawEmail.trim().toLowerCase();
}

// Normalize Indian 10-digit mobile number for numerology profile calculations
export function normalizeIndianMobile(rawMobile: string | undefined | null): string {
  if (!rawMobile) return '';
  const digits = String(rawMobile).replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.substring(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.substring(1);
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export interface AuthenticatedUserIdentity {
  id: string;
  supabaseUserId: string;
  email: string;
  emailVerified: boolean;
  mobile?: string;
}

/**
 * Local Sandbox In-Memory Cache (Only active in local dev when PostgreSQL is not configured)
 */
class LocalSandboxFallback {
  public users = new Map<string, any>();
  public freeClaims = new Map<string, any>();
  public entitlements = new Map<string, any>();
  public orders = new Map<string, any>();
  public payments = new Map<string, any>();
  public processedEvents = new Set<string>();
}

class ReportAccessEngine {
  private localSandbox = new LocalSandboxFallback();

  private async ensureDb() {
    if (isDatabaseConfigured()) {
      await ensureDatabaseSchema();
    } else if (isServerlessRuntime()) {
      throw new Error("DATABASE_UNAVAILABLE: Database connection is required in production environment.");
    }
  }

  /**
   * Cryptographically resolve and authenticate user session from Supabase Bearer Token
   */
  public async resolveAuthenticatedUser(
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<AuthenticatedUserIdentity | null> {
    const cleanEmail = normalizeEmail(optionalEmail);

    if (authHeader) {
      const supabaseUser = await verifySupabaseToken(authHeader);
      if (supabaseUser) {
        await this.ensureDb();
        const userEmail = normalizeEmail(supabaseUser.email) || cleanEmail;
        const supabaseId = supabaseUser.supabaseUserId;

        if (isDatabaseConfigured()) {
          const userRes = await query(
            `SELECT id, supabase_user_id, email, email_verified, mobile FROM users WHERE supabase_user_id = $1 OR email = $2`,
            [supabaseId, userEmail]
          );

          let internalId = '';
          let mobile = '';
          if (userRes.rows.length > 0) {
            internalId = userRes.rows[0].id;
            mobile = userRes.rows[0].mobile || '';
            await query(
              `UPDATE users SET supabase_user_id = $1, email = $2, email_verified = TRUE, updated_at = NOW() WHERE id = $3`,
              [supabaseId, userEmail, internalId]
            );
          } else {
            internalId = `usr_${crypto.randomBytes(8).toString('hex')}`;
            await query(
              `INSERT INTO users (id, supabase_user_id, email, email_verified, created_at, updated_at) VALUES ($1, $2, $3, TRUE, NOW(), NOW())`,
              [internalId, supabaseId, userEmail]
            );
          }

          return {
            id: internalId,
            supabaseUserId: supabaseId,
            email: userEmail,
            emailVerified: true,
            mobile
          };
        } else {
          let user = this.localSandbox.users.get(userEmail) || this.localSandbox.users.get(supabaseId);
          if (!user) {
            const internalId = `usr_${crypto.randomBytes(8).toString('hex')}`;
            user = {
              id: internalId,
              supabaseUserId: supabaseId,
              email: userEmail,
              emailVerified: true
            };
            this.localSandbox.users.set(userEmail, user);
            this.localSandbox.users.set(supabaseId, user);
          }
          return user;
        }
      }
    }

    // In local development sandbox when no Supabase key is configured, allow email-based dev session
    if (!isServerlessRuntime() && cleanEmail) {
      await this.ensureDb();
      if (isDatabaseConfigured()) {
        const userRes = await query(`SELECT id, supabase_user_id, email, email_verified, mobile FROM users WHERE email = $1`, [cleanEmail]);
        if (userRes.rows.length > 0) {
          const u = userRes.rows[0];
          return {
            id: u.id,
            supabaseUserId: u.supabase_user_id || u.id,
            email: u.email,
            emailVerified: u.email_verified,
            mobile: u.mobile
          };
        }
      } else {
        const u = this.localSandbox.users.get(cleanEmail);
        if (u) return u;
      }
    }

    return null;
  }

  // 1. Send Email OTP using Supabase Auth
  public async sendEmailOtp(rawEmail: string): Promise<{ success: boolean; message: string }> {
    const email = normalizeEmail(rawEmail);
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error("कृपया एक मान्य ईमेल पता दर्ज करें (Please enter a valid email address)");
    }

    if (isSupabaseServerConfigured()) {
      const client = getServerSupabaseClient();
      const productionRedirect =
        process.env.APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://complete-mobile-numerology.vercel.app');

      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: productionRedirect,
        }
      });

      if (error) {
        console.error("Supabase Auth sendEmailOtp error:", error);
        throw new Error(`SUPABASE_AUTH_ERROR: ${error.message || 'Unable to send verification email'}`);
      }
    } else {
      console.log(`[Local Development Notice] Supabase Auth Email OTP requested for: ${email}`);
    }

    return {
      success: true,
      message: `OTP sent successfully to ${email}. Please check your inbox and spam folder.`
    };
  }

  // 2. Verify Email OTP using Supabase Auth (or sync verified session)
  public async verifyEmailOtp(
    rawEmail: string,
    token: string,
    authHeader?: string | null
  ): Promise<{ success: boolean; session: any; user: any }> {
    const email = normalizeEmail(rawEmail);
    const cleanToken = (token || '').replace(/[\s-]/g, '').trim();

    // If an authenticated Bearer token is provided or passed as token, resolve via JWT
    if (authHeader || (cleanToken && cleanToken.length > 30)) {
      const header = authHeader || `Bearer ${cleanToken}`;
      const authUser = await this.resolveAuthenticatedUser(header, email);
      if (authUser) {
        return {
          success: true,
          session: {
            access_token: header.replace('Bearer ', '').trim(),
            user: authUser
          },
          user: authUser
        };
      }
    }

    if (!email) {
      throw new Error("Missing email address");
    }
    if (!cleanToken) {
      throw new Error("कृपया ईमेल पर प्राप्त OTP दर्ज करें (Please enter the OTP sent to your email)");
    }

    if (isSupabaseServerConfigured()) {
      const client = getServerSupabaseClient();
      const { data, error } = await client.auth.verifyOtp({
        email,
        token: cleanToken,
        type: 'email'
      });

      if (error || !data.user) {
        console.error("Supabase Auth verifyOtp error:", error);
        throw new Error(`INVALID_OTP: ${error?.message || 'Invalid or expired OTP. Please check and retry.'}`);
      }

      await this.ensureDb();
      const supabaseId = data.user.id;

      if (isDatabaseConfigured()) {
        const userRes = await query(`SELECT id FROM users WHERE supabase_user_id = $1 OR email = $2`, [supabaseId, email]);
        if (userRes.rows.length === 0) {
          const internalId = `usr_${crypto.randomBytes(8).toString('hex')}`;
          await query(
            `INSERT INTO users (id, supabase_user_id, email, email_verified, created_at, updated_at) VALUES ($1, $2, $3, TRUE, NOW(), NOW())`,
            [internalId, supabaseId, email]
          );
        } else {
          await query(
            `UPDATE users SET supabase_user_id = $1, email = $2, email_verified = TRUE, updated_at = NOW() WHERE id = $3`,
            [supabaseId, email, userRes.rows[0].id]
          );
        }
      }

      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } else {
      // Local Sandbox Fallback
      let user = this.localSandbox.users.get(email);
      if (!user) {
        const internalId = `usr_${crypto.randomBytes(8).toString('hex')}`;
        user = {
          id: internalId,
          supabaseUserId: `sub_${internalId}`,
          email,
          emailVerified: true
        };
        this.localSandbox.users.set(email, user);
      }

      return {
        success: true,
        session: { access_token: `dev_token_${user.id}`, user },
        user
      };
    }
  }

  // 2b. Synchronize Authenticated Supabase Session & Ensure User Record Exists
  public async syncSession(
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<{ success: boolean; user: any }> {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Invalid or expired session token");
    }

    // Check user claim status
    let hasClaimedFreeReport = false;
    let freeReportDetails: any = undefined;

    if (isDatabaseConfigured()) {
      const claimRes = await query(
        `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3`,
        [authUser.id, authUser.supabaseUserId, authUser.email]
      );
      if (claimRes.rows.length > 0) {
        hasClaimedFreeReport = true;
        freeReportDetails = {
          reportType: claimRes.rows[0].report_type,
          claimedAt: claimRes.rows[0].claimed_at,
          profileKey: claimRes.rows[0].profile_key,
        };
      }
    } else {
      const fc = this.localSandbox.freeClaims.get(authUser.email);
      if (fc) {
        hasClaimedFreeReport = true;
        freeReportDetails = {
          reportType: fc.reportType,
          claimedAt: fc.claimedAt,
          profileKey: fc.profileKey,
        };
      }
    }

    return {
      success: true,
      user: {
        id: authUser.id,
        supabaseUserId: authUser.supabaseUserId,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        mobile: authUser.mobile || '',
        hasClaimedFreeReport,
        freeReportDetails
      }
    };
  }

  // 3. Central Report Access Check
  public async checkReportAccess(
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<ReportAccessCheckResult> {
    await this.ensureDb();
    const safeKey = profileKey || 'default_profile';

    if (!REPORT_REGISTRY[reportType]) {
      return {
        allowed: false,
        requiresPayment: true,
        isFirstFreeReport: false,
        isFreeReportType: false,
        canClaimFree: false,
        price: REPORT_PRICE_INR,
        reportType,
        profileKey: safeKey,
        reason: 'Invalid report type requested'
      };
    }

    // Mobile Numerology is ALWAYS PERMANENTLY FREE
    if (reportType === 'MOBILE_NUMEROLOGY') {
      return {
        allowed: true,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: true,
        canClaimFree: false,
        price: 0,
        reportType,
        profileKey: safeKey,
        accessType: 'FREE'
      };
    }

    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);

    if (authUser) {
      if (isDatabaseConfigured()) {
        // Check if entitlement exists for this user + profileKey + reportType
        const entRes = await query(
          `SELECT id, access_type, amount FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2 OR email = $3) AND profile_key = $4 AND report_type = $5`,
          [authUser.id, authUser.supabaseUserId, authUser.email, safeKey, reportType]
        );

        if (entRes.rows.length > 0) {
          const ent = entRes.rows[0];
          return {
            allowed: true,
            requiresPayment: false,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: ent.amount,
            reportType,
            profileKey: safeKey,
            accessType: ent.access_type,
            entitlementId: ent.id
          };
        }

        // Check if user has already claimed their first free report
        const claimRes = await query(
          `SELECT id, report_type FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3`,
          [authUser.id, authUser.supabaseUserId, authUser.email]
        );

        if (claimRes.rows.length === 0) {
          return {
            allowed: false,
            requiresPayment: false,
            isFirstFreeReport: true,
            isFreeReportType: false,
            canClaimFree: true,
            price: 0,
            reportType,
            profileKey: safeKey,
            reason: 'Your first specialist report is 100% FREE. Click Claim Free Report to generate.'
          };
        } else {
          return {
            allowed: false,
            requiresPayment: true,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: REPORT_PRICE_INR,
            reportType,
            profileKey: safeKey,
            reason: 'Free report entitlement already consumed. ₹33 required per additional report.'
          };
        }
      } else {
        // Sandbox Fallback
        const entKey = `${authUser.email}_${reportType}_${safeKey}`;
        const ent = this.localSandbox.entitlements.get(entKey);
        if (ent) {
          return {
            allowed: true,
            requiresPayment: false,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: ent.amount,
            reportType,
            profileKey: safeKey,
            accessType: ent.accessType,
            entitlementId: ent.id
          };
        }

        const freeClaim = this.localSandbox.freeClaims.get(authUser.email);
        if (!freeClaim) {
          return {
            allowed: false,
            requiresPayment: false,
            isFirstFreeReport: true,
            isFreeReportType: false,
            canClaimFree: true,
            price: 0,
            reportType,
            profileKey: safeKey,
            reason: 'Your first specialist report is 100% FREE. Click Claim Free Report to generate.'
          };
        } else {
          return {
            allowed: false,
            requiresPayment: true,
            isFirstFreeReport: false,
            isFreeReportType: false,
            canClaimFree: false,
            price: REPORT_PRICE_INR,
            reportType,
            profileKey: safeKey,
            reason: 'Free report entitlement already consumed. ₹33 required per additional report.'
          };
        }
      }
    }

    return {
      allowed: false,
      requiresPayment: false,
      isFirstFreeReport: true,
      isFreeReportType: false,
      canClaimFree: false,
      price: REPORT_PRICE_INR,
      reportType,
      profileKey: safeKey,
      reason: 'Please verify email to access your report.'
    };
  }

  // 4. Claim First Free Report (Atomic ACID Transaction)
  public async claimFreeReport(
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<{ success: boolean; allowed: boolean; entitlement: ReportEntitlementRecord }> {
    await this.ensureDb();
    if (reportType === 'MOBILE_NUMEROLOGY') {
      throw new Error("Mobile Numerology is already permanently free");
    }

    if (!REPORT_REGISTRY[reportType]) {
      throw new Error("Invalid report type");
    }

    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Valid authenticated email session is required to claim free report.");
    }

    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || 'default_profile';
    const now = new Date().toISOString();

    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        // Enforce 1 free claim per verified user
        const existingClaimRes = await client.query(
          `SELECT report_type FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3`,
          [userId, supabaseUserId, email]
        );
        if (existingClaimRes.rows.length > 0) {
          throw new Error(`मुफ़्त रिपोर्ट अधिकार पहले ही ${existingClaimRes.rows[0].report_type} के लिए उपयोग किया जा चुका है। Additional reports are ₹33.`);
        }

        const claimId = `claim_${crypto.randomBytes(8).toString('hex')}`;
        await client.query(
          `INSERT INTO free_claims (id, user_id, supabase_user_id, email, report_type, profile_key, claimed_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [claimId, userId, supabaseUserId, email, reportType, safeKey]
        );

        const entitlementId = `ent_free_${crypto.randomBytes(8).toString('hex')}`;
        await client.query(
          `INSERT INTO entitlements (id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, currency, payment_status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'FREE', 0, 'INR', 'GRANTED', NOW(), NOW())
           ON CONFLICT (user_id, profile_key, report_type) DO NOTHING`,
          [entitlementId, userId, supabaseUserId, email, reportType, safeKey]
        );

        const entitlement: ReportEntitlementRecord = {
          id: entitlementId,
          userId,
          mobile: email,
          reportType,
          profileKey: safeKey,
          accessType: 'FREE',
          amount: 0,
          paymentStatus: 'GRANTED',
          createdAt: now
        };

        return { success: true, allowed: true, entitlement };
      });
    } else {
      if (this.localSandbox.freeClaims.has(email)) {
        throw new Error("मुफ़्त रिपोर्ट अधिकार पहले ही उपयोग किया जा चुका है।");
      }

      this.localSandbox.freeClaims.set(email, {
        userId,
        supabaseUserId,
        email,
        reportType,
        profileKey: safeKey,
        claimedAt: now
      });

      const entitlementId = `ent_free_${crypto.randomBytes(8).toString('hex')}`;
      const entitlement: ReportEntitlementRecord = {
        id: entitlementId,
        userId,
        mobile: email,
        reportType,
        profileKey: safeKey,
        accessType: 'FREE',
        amount: 0,
        paymentStatus: 'GRANTED',
        createdAt: now
      };
      this.localSandbox.entitlements.set(`${email}_${reportType}_${safeKey}`, entitlement);

      return { success: true, allowed: true, entitlement };
    }
  }

  // 5. Create ₹33 Razorpay Payment Order
  public async createPaymentOrder(
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<PaymentOrderResponse> {
    await this.ensureDb();
    if (!REPORT_REGISTRY[reportType]) {
      throw new Error("Invalid report type");
    }

    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Please verify email before initiating payment.");
    }

    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || 'default_profile';
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();
    const receipt = `rcpt_${Date.now()}_${reportType.substring(0, 4).toLowerCase()}`;
    let razorpayOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    if (keyId.startsWith('rzp_') && keySecret && !keyId.includes('sandbox')) {
      try {
        const rzpAuthHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': rzpAuthHeader
          },
          body: JSON.stringify({
            amount: REPORT_PRICE_PAISE,
            currency: 'INR',
            receipt,
            notes: {
              userId,
              supabaseUserId,
              email,
              profileKey: safeKey,
              reportType
            }
          }),
          signal: controller.signal
        }).finally(() => clearTimeout(timeout));

        if (response.ok) {
          const rzpData = await response.json();
          if (rzpData?.id) {
            razorpayOrderId = rzpData.id;
          }
        }
      } catch {
        console.warn("Notice: Razorpay API network fallback used.");
      }
    }

    if (isDatabaseConfigured()) {
      const txId = `tx_${crypto.randomBytes(8).toString('hex')}`;
      await query(
        `INSERT INTO payment_transactions (id, user_id, supabase_user_id, email, profile_key, report_type, razorpay_order_id, amount, currency, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'INR', 'CREATED', NOW(), NOW())
         ON CONFLICT (razorpay_order_id) DO NOTHING`,
        [txId, userId, supabaseUserId, email, safeKey, reportType, razorpayOrderId, REPORT_PRICE_INR]
      );
    } else {
      this.localSandbox.orders.set(razorpayOrderId, {
        orderId: razorpayOrderId,
        userId,
        email,
        reportType,
        profileKey: safeKey,
        amount: REPORT_PRICE_INR,
        status: 'CREATED'
      });
    }

    return {
      orderId: razorpayOrderId,
      amount: REPORT_PRICE_INR,
      amountPaise: REPORT_PRICE_PAISE,
      currency: 'INR',
      keyId,
      reportType,
      profileKey: safeKey,
      mobile: email,
      receipt
    };
  }

  // 6. Verify Razorpay Payment Signature & Grant Entitlement (ACID Transaction)
  public async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<{ success: boolean; accessGranted: boolean; entitlement: ReportEntitlementRecord }> {
    await this.ensureDb();
    if (!orderId || !paymentId) {
      throw new Error("Missing orderId or paymentId");
    }

    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("UNAUTHORIZED: Valid authenticated email session required for payment verification.");
    }

    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || 'default_profile';

    // Verify HMAC signature
    const keySecret = getRazorpayKeySecret();
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isTestMode = getRazorpayKeyId().includes('sandbox') || !process.env.RAZORPAY_KEY_SECRET;
    const isSignatureValid = signature === expectedSignature || (isTestMode && (signature.startsWith('sig_') || signature.length > 8));

    if (!isSignatureValid) {
      throw new Error("अवैध भुगतान हस्ताक्षर (Invalid Razorpay payment signature verification failed)");
    }

    const now = new Date().toISOString();

    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        // Idempotency: check if already granted
        const existingEntRes = await client.query(
          `SELECT id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, created_at FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2 OR email = $3) AND profile_key = $4 AND report_type = $5`,
          [userId, supabaseUserId, email, safeKey, reportType]
        );

        if (existingEntRes.rows.length > 0) {
          const e = existingEntRes.rows[0];
          return {
            success: true,
            accessGranted: true,
            entitlement: {
              id: e.id,
              userId: e.user_id,
              mobile: e.email || e.mobile,
              reportType: e.report_type,
              profileKey: e.profile_key,
              accessType: e.access_type,
              amount: e.amount,
              paymentId,
              orderId,
              paymentStatus: 'PAID',
              createdAt: e.created_at
            }
          };
        }

        // Record payment transaction
        const txId = `tx_${crypto.randomBytes(8).toString('hex')}`;
        await client.query(
          `INSERT INTO payment_transactions (id, user_id, supabase_user_id, email, profile_key, report_type, razorpay_order_id, razorpay_payment_id, amount, currency, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'INR', 'PAID', NOW(), NOW())
           ON CONFLICT (razorpay_payment_id) DO UPDATE SET status = 'PAID', updated_at = NOW()`,
          [txId, userId, supabaseUserId, email, safeKey, reportType, orderId, paymentId, REPORT_PRICE_INR]
        );

        // Grant report entitlement
        const entitlementId = `ent_paid_${crypto.randomBytes(8).toString('hex')}`;
        await client.query(
          `INSERT INTO entitlements (id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, currency, payment_status, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'PAID', $7, 'INR', 'PAID', $8, $9, NOW(), NOW())
           ON CONFLICT (user_id, profile_key, report_type) DO UPDATE SET payment_status = 'PAID', updated_at = NOW()`,
          [entitlementId, userId, supabaseUserId, email, reportType, safeKey, REPORT_PRICE_INR, orderId, paymentId]
        );

        const entitlement: ReportEntitlementRecord = {
          id: entitlementId,
          userId,
          mobile: email,
          reportType,
          profileKey: safeKey,
          accessType: 'PAID',
          amount: REPORT_PRICE_INR,
          paymentId,
          orderId,
          paymentStatus: 'PAID',
          createdAt: now
        };

        return { success: true, accessGranted: true, entitlement };
      });
    } else {
      const entKey = `${email}_${reportType}_${safeKey}`;
      const existing = this.localSandbox.entitlements.get(entKey);
      if (existing) {
        return { success: true, accessGranted: true, entitlement: existing };
      }

      const entitlement: ReportEntitlementRecord = {
        id: `ent_paid_${crypto.randomBytes(8).toString('hex')}`,
        userId,
        mobile: email,
        reportType,
        profileKey: safeKey,
        accessType: 'PAID',
        amount: REPORT_PRICE_INR,
        paymentId,
        orderId,
        paymentStatus: 'PAID',
        createdAt: now
      };

      this.localSandbox.entitlements.set(entKey, entitlement);
      this.localSandbox.payments.set(paymentId, {
        internalUserId: userId,
        email,
        profileKey: safeKey,
        reportType,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: REPORT_PRICE_INR,
        currency: 'INR',
        paymentStatus: 'PAID',
        createdAt: now
      });

      return { success: true, accessGranted: true, entitlement };
    }
  }

  // 7. Webhook processing
  public async processWebhook(
    rawBody: string,
    signatureHeader: string
  ): Promise<{ success: boolean; event: string; status: string; message: string }> {
    await this.ensureDb();
    const webhookSecret = getRazorpayWebhookSecret();

    if (signatureHeader) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isTestMode = webhookSecret.includes('sandbox') || !process.env.RAZORPAY_WEBHOOK_SECRET;
      if (signatureHeader !== expectedSignature && !isTestMode) {
        throw new Error("Invalid Razorpay webhook signature");
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new Error("Invalid webhook JSON payload");
    }

    const eventId = payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || 'unknown';

    if (isDatabaseConfigured()) {
      const existingEvt = await query(`SELECT id FROM payment_webhook_events WHERE event_id = $1`, [eventId]);
      if (existingEvt.rows.length > 0) {
        return {
          success: true,
          event: eventType,
          status: 'ALREADY_PROCESSED',
          message: 'Webhook event already processed (idempotent duplicate).'
        };
      }

      await query(
        `INSERT INTO payment_webhook_events (id, event_id, event_type, processed_at, created_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (event_id) DO NOTHING`,
        [`wevt_${crypto.randomBytes(8).toString('hex')}`, eventId, eventType]
      );

      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;
        const orderId = paymentEntity?.order_id || orderEntity?.id;
        const paymentId = paymentEntity?.id || `pay_wh_${Date.now()}`;

        if (orderId) {
          const txRes = await query(`SELECT user_id, supabase_user_id, email, profile_key, report_type FROM payment_transactions WHERE razorpay_order_id = $1`, [orderId]);
          if (txRes.rows.length > 0) {
            const tx = txRes.rows[0];
            const entId = `ent_paid_${crypto.randomBytes(8).toString('hex')}`;
            await query(
              `INSERT INTO entitlements (id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, currency, payment_status, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, 'PAID', $7, 'INR', 'PAID', $8, $9, NOW(), NOW())
               ON CONFLICT (user_id, profile_key, report_type) DO UPDATE SET payment_status = 'PAID', updated_at = NOW()`,
              [entId, tx.user_id, tx.supabase_user_id, tx.email, tx.report_type, tx.profile_key, REPORT_PRICE_INR, orderId, paymentId]
            );
          }
        }
      }
    } else {
      if (this.localSandbox.processedEvents.has(eventId)) {
        return {
          success: true,
          event: eventType,
          status: 'ALREADY_PROCESSED',
          message: 'Webhook event already processed (idempotent duplicate).'
        };
      }
      this.localSandbox.processedEvents.add(eventId);
    }

    return {
      success: true,
      event: eventType,
      status: 'PROCESSED',
      message: 'Razorpay webhook processed successfully.'
    };
  }

  // 8. Retrieve All Reports for Authenticated Customer
  public async getUserReports(authHeader?: string | null, optionalEmail?: string): Promise<{ success: boolean; reports: UserReportItem[]; total: number }> {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, reports: [], total: 0 };
    }

    const reportItems: UserReportItem[] = [];

    if (isDatabaseConfigured()) {
      const entRes = await query(
        `SELECT id, user_id, profile_key, report_type, access_type, amount, currency, payment_status, razorpay_payment_id, razorpay_order_id, created_at
         FROM entitlements WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId, authUser.email]
      );

      for (const ent of entRes.rows) {
        const def = REPORT_REGISTRY[ent.report_type as CanonicalReportType] || REPORT_REGISTRY.MASTER_REPORT;
        reportItems.push({
          id: ent.id,
          userId: ent.user_id,
          profileKey: ent.profile_key,
          reportType: ent.report_type,
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: ent.access_type,
          amount: ent.amount,
          currency: 'INR',
          status: 'UNLOCKED',
          paymentId: ent.razorpay_payment_id,
          orderId: ent.razorpay_order_id,
          createdAt: ent.created_at,
        });
      }

      // Add Always Free Mobile Numerology
      const mobileDef = REPORT_REGISTRY.MOBILE_NUMEROLOGY;
      reportItems.push({
        id: `perm_mobile_${authUser.id}`,
        userId: authUser.id,
        profileKey: 'mobile_scanner_profile',
        reportType: 'MOBILE_NUMEROLOGY',
        titleHi: mobileDef.titleHi,
        titleEn: mobileDef.titleEn,
        titleMr: mobileDef.titleMr,
        titleBn: mobileDef.titleBn,
        titleGu: mobileDef.titleGu,
        accessType: 'ALWAYS_FREE',
        amount: 0,
        currency: 'INR',
        status: 'UNLOCKED',
        createdAt: new Date().toISOString(),
      });
    } else {
      for (const ent of this.localSandbox.entitlements.values()) {
        if (ent.email === authUser.email || ent.userId === authUser.id) {
          const def = REPORT_REGISTRY[ent.reportType as CanonicalReportType] || REPORT_REGISTRY.MASTER_REPORT;
          reportItems.push({
            id: ent.id,
            userId: ent.userId,
            profileKey: ent.profileKey,
            reportType: ent.reportType,
            titleHi: def.titleHi,
            titleEn: def.titleEn,
            titleMr: def.titleMr,
            titleBn: def.titleBn,
            titleGu: def.titleGu,
            accessType: ent.accessType,
            amount: ent.amount,
            currency: 'INR',
            status: 'UNLOCKED',
            paymentId: ent.paymentId,
            orderId: ent.orderId,
            createdAt: ent.createdAt,
          });
        }
      }

      const mobileDef = REPORT_REGISTRY.MOBILE_NUMEROLOGY;
      reportItems.push({
        id: `perm_mobile_${authUser.id}`,
        userId: authUser.id,
        profileKey: 'mobile_scanner_profile',
        reportType: 'MOBILE_NUMEROLOGY',
        titleHi: mobileDef.titleHi,
        titleEn: mobileDef.titleEn,
        titleMr: mobileDef.titleMr,
        titleBn: mobileDef.titleBn,
        titleGu: mobileDef.titleGu,
        accessType: 'ALWAYS_FREE',
        amount: 0,
        currency: 'INR',
        status: 'UNLOCKED',
        createdAt: new Date().toISOString(),
      });
    }

    reportItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      success: true,
      reports: reportItems,
      total: reportItems.length,
    };
  }

  // 9. Retrieve Verified Payment History for Customer
  public async getUserPaymentHistory(authHeader?: string | null, optionalEmail?: string): Promise<{ success: boolean; payments: PaymentHistoryItem[]; total: number }> {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, payments: [], total: 0 };
    }

    const historyItems: PaymentHistoryItem[] = [];

    if (isDatabaseConfigured()) {
      const claimRes = await query(
        `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3`,
        [authUser.id, authUser.supabaseUserId, authUser.email]
      );
      if (claimRes.rows.length > 0) {
        const fc = claimRes.rows[0];
        historyItems.push({
          id: `claim_${fc.claimed_at}`,
          userId: authUser.id,
          reportType: fc.report_type,
          profileKey: fc.profile_key,
          amount: 0,
          currency: 'INR',
          status: 'FREE',
          paymentReference: 'Complimentary Free Claim (₹0)',
          createdAt: fc.claimed_at,
        });
      }

      const txRes = await query(
        `SELECT id, report_type, profile_key, amount, currency, status, razorpay_order_id, razorpay_payment_id, created_at
         FROM payment_transactions WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId, authUser.email]
      );

      for (const tx of txRes.rows) {
        historyItems.push({
          id: tx.razorpay_payment_id || tx.id,
          userId: authUser.id,
          reportType: tx.report_type,
          profileKey: tx.profile_key,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status === 'PAID' ? 'PAID' : 'CREATED',
          paymentReference: tx.razorpay_payment_id || `Order (${tx.razorpay_order_id})`,
          orderId: tx.razorpay_order_id,
          createdAt: tx.created_at,
        });
      }
    } else {
      const freeClaim = this.localSandbox.freeClaims.get(authUser.email);
      if (freeClaim) {
        historyItems.push({
          id: `claim_${freeClaim.claimedAt}`,
          userId: authUser.id,
          reportType: freeClaim.reportType,
          profileKey: freeClaim.profileKey,
          amount: 0,
          currency: 'INR',
          status: 'FREE',
          paymentReference: 'Complimentary Free Claim (₹0)',
          createdAt: freeClaim.claimedAt,
        });
      }

      for (const p of this.localSandbox.payments.values()) {
        if (p.email === authUser.email || p.internalUserId === authUser.id) {
          historyItems.push({
            id: p.razorpayPaymentId,
            userId: authUser.id,
            reportType: p.reportType,
            profileKey: p.profileKey,
            amount: p.amount,
            currency: p.currency,
            status: 'PAID',
            paymentReference: p.razorpayPaymentId,
            orderId: p.razorpayOrderId,
            createdAt: p.createdAt,
          });
        }
      }
    }

    historyItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      success: true,
      payments: historyItems,
      total: historyItems.length,
    };
  }

  // 10. Retrieve Access & Entitlement Summary
  public async getUserAccessSummary(authHeader?: string | null, optionalEmail?: string): Promise<{ success: boolean; summary: UserAccessSummary }> {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return {
        success: true,
        summary: {
          mobile: '',
          mobileVerified: false,
          mobileNumerology: { status: 'ALWAYS_FREE', price: 0 },
          firstNonMobileReport: { status: 'AVAILABLE' },
          additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
          totalReportsUnlocked: 0,
          totalPaidAmountInr: 0,
        }
      };
    }

    if (isDatabaseConfigured()) {
      const claimRes = await query(`SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR email = $2`, [authUser.id, authUser.email]);
      const freeClaim = claimRes.rows[0];

      const entRes = await query(`SELECT access_type, amount FROM entitlements WHERE user_id = $1 OR email = $2`, [authUser.id, authUser.email]);
      const entitlements = entRes.rows;
      const paidEntitlements = entitlements.filter(e => e.access_type === 'PAID');
      const totalPaidAmount = paidEntitlements.reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        success: true,
        summary: {
          mobile: authUser.email,
          mobileVerified: authUser.emailVerified,
          mobileNumerology: { status: 'ALWAYS_FREE', price: 0 },
          firstNonMobileReport: {
            status: freeClaim ? 'USED' : 'AVAILABLE',
            reportType: freeClaim?.report_type,
            claimedAt: freeClaim?.claimed_at,
            profileKey: freeClaim?.profile_key,
          },
          additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
          totalReportsUnlocked: entitlements.length + 1, // +1 for Mobile Numerology
          totalPaidAmountInr: totalPaidAmount,
        }
      };
    } else {
      const freeClaim = this.localSandbox.freeClaims.get(authUser.email);
      const userEntitlements = Array.from(this.localSandbox.entitlements.values()).filter(e => e.email === authUser.email);
      const paidEntitlements = userEntitlements.filter(e => e.accessType === 'PAID');
      const totalPaidAmount = paidEntitlements.reduce((sum, e) => sum + e.amount, 0);

      return {
        success: true,
        summary: {
          mobile: authUser.email,
          mobileVerified: true,
          mobileNumerology: { status: 'ALWAYS_FREE', price: 0 },
          firstNonMobileReport: {
            status: freeClaim ? 'USED' : 'AVAILABLE',
            reportType: freeClaim?.reportType,
            claimedAt: freeClaim?.claimedAt,
            profileKey: freeClaim?.profileKey,
          },
          additionalReports: { priceInr: REPORT_PRICE_INR, pricePaise: REPORT_PRICE_PAISE },
          totalReportsUnlocked: userEntitlements.length + 1,
          totalPaidAmountInr: totalPaidAmount,
        }
      };
    }
  }

  // 11. Retrieve Single Report by ID with Server Ownership Validation
  public async getReportById(reportId: string, authHeader?: string | null, optionalEmail?: string): Promise<{ success: boolean; allowed: boolean; report: UserReportItem }> {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      throw new Error("Authentication required to access report");
    }

    if (reportId.startsWith('perm_mobile_')) {
      const def = REPORT_REGISTRY.MOBILE_NUMEROLOGY;
      return {
        success: true,
        allowed: true,
        report: {
          id: reportId,
          userId: authUser.id,
          profileKey: 'mobile_scanner_profile',
          reportType: 'MOBILE_NUMEROLOGY',
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: 'ALWAYS_FREE',
          amount: 0,
          currency: 'INR',
          status: 'UNLOCKED',
          createdAt: new Date().toISOString(),
        },
      };
    }

    if (isDatabaseConfigured()) {
      const entRes = await query(`SELECT * FROM entitlements WHERE id = $1`, [reportId]);
      if (entRes.rows.length === 0) {
        throw new Error("Report not found in server registry");
      }
      const ent = entRes.rows[0];

      if (ent.user_id !== authUser.id && ent.supabase_user_id !== authUser.supabaseUserId && ent.email !== authUser.email) {
        throw new Error("Unauthorized: You do not own this report entitlement");
      }

      const def = REPORT_REGISTRY[ent.report_type as CanonicalReportType] || REPORT_REGISTRY.MASTER_REPORT;
      return {
        success: true,
        allowed: true,
        report: {
          id: ent.id,
          userId: ent.user_id,
          profileKey: ent.profile_key,
          reportType: ent.report_type,
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: ent.access_type,
          amount: ent.amount,
          currency: 'INR',
          status: 'UNLOCKED',
          paymentId: ent.razorpay_payment_id,
          orderId: ent.razorpay_order_id,
          createdAt: ent.created_at,
        },
      };
    } else {
      let targetEnt: any = null;
      for (const ent of this.localSandbox.entitlements.values()) {
        if (ent.id === reportId) {
          targetEnt = ent;
          break;
        }
      }

      if (!targetEnt) {
        throw new Error("Report not found in server registry");
      }

      if (targetEnt.userId !== authUser.id && targetEnt.email !== authUser.email) {
        throw new Error("Unauthorized: You do not own this report entitlement");
      }

      const def = REPORT_REGISTRY[targetEnt.reportType as CanonicalReportType] || REPORT_REGISTRY.MASTER_REPORT;
      return {
        success: true,
        allowed: true,
        report: {
          id: targetEnt.id,
          userId: targetEnt.userId,
          profileKey: targetEnt.profileKey,
          reportType: targetEnt.reportType,
          titleHi: def.titleHi,
          titleEn: def.titleEn,
          titleMr: def.titleMr,
          titleBn: def.titleBn,
          titleGu: def.titleGu,
          accessType: targetEnt.accessType,
          amount: targetEnt.amount,
          currency: 'INR',
          status: 'UNLOCKED',
          paymentId: targetEnt.paymentId,
          orderId: targetEnt.orderId,
          createdAt: targetEnt.createdAt,
        },
      };
    }
  }

  // 12. Admin Audit Data
  public async getAdminAuditData() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
      const claimsCount = await query(`SELECT COUNT(*) as count FROM free_claims`);
      const paidCount = await query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_rev FROM entitlements WHERE access_type = 'PAID'`);

      return {
        storageType: 'SUPABASE_POSTGRESQL',
        totalUsers: Number(usersCount.rows[0]?.count || 0),
        totalFreeClaims: Number(claimsCount.rows[0]?.count || 0),
        totalPaidReports: Number(paidCount.rows[0]?.count || 0),
        totalRevenueInr: Number(paidCount.rows[0]?.total_rev || 0),
        configDiagnostics: getSafeConfigAudit(),
      };
    } else {
      return {
        storageType: 'LOCAL_SANDBOX_MEMORY',
        totalUsers: this.localSandbox.users.size,
        totalFreeClaims: this.localSandbox.freeClaims.size,
        totalPaidReports: Array.from(this.localSandbox.entitlements.values()).filter(e => e.accessType === 'PAID').length,
        totalRevenueInr: Array.from(this.localSandbox.entitlements.values()).filter(e => e.accessType === 'PAID').reduce((sum, e) => sum + e.amount, 0),
        configDiagnostics: getSafeConfigAudit(),
      };
    }
  }
}

export const reportAccessEngine = new ReportAccessEngine();
