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
 * CANONICAL SERVER-SIDE ADMIN / INTERNAL TEST ALLOWLIST (Pre-Phase 10.5)
 * Strictly server-side; NEVER exposed to client bundles or public APIs.
 * Supports environment variable override via ADMIN_TEST_EMAILS.
 */
const CANONICAL_ADMIN_TEST_EMAILS = [
  'affectioncosmos@gmail.com',
  'attractabundance909@gmail.com'
];

export function getAdminTestEmails(): string[] {
  const set = new Set(CANONICAL_ADMIN_TEST_EMAILS.map(e => e.trim().toLowerCase()));
  const envVal = process.env.ADMIN_TEST_EMAILS;
  if (envVal && typeof envVal === 'string') {
    envVal
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
      .forEach(e => set.add(e));
  }
  return Array.from(set);
}

export function isInternalAdminTestEmail(rawEmail: string | undefined | null): boolean {
  if (!rawEmail || typeof rawEmail !== 'string') return false;
  const normalized = normalizeEmail(rawEmail);
  const allowlist = getAdminTestEmails();
  return allowlist.includes(normalized);
}

export function evaluateAdminTestAccess(user: AuthenticatedUserIdentity | null): {
  isAdminTest: boolean;
  accessType?: 'ADMIN_TEST';
} {
  if (!user || !user.email) {
    return { isAdminTest: false };
  }
  const isMatch = isInternalAdminTestEmail(user.email);
  return {
    isAdminTest: isMatch,
    accessType: isMatch ? 'ADMIN_TEST' : undefined
  };
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
      try {
        await ensureDatabaseSchema();
      } catch (err: any) {
        console.warn("[PostgreSQL] ensureDb schema notice:", err?.message || err);
      }
    }
  }

  /**
   * System Runtime Diagnostics (Phase 16 - Step 5 Production Verification)
   * Safely probes each stage without exposing credentials or secrets.
   */
  public async getRuntimeDiagnostics(authHeader?: string | null, email?: string): Promise<{
    success: boolean;
    serverless: string;
    environment: string;
    supabase: string;
    databaseConfig: string;
    databaseConnection: string;
    auth: string;
    adminTestAccess: boolean;
    timestamp: string;
  }> {
    let serverlessStatus = "ok";
    let envStatus = typeof process !== 'undefined' && process.env ? "ok" : "fail";
    let supabaseStatus = isSupabaseServerConfigured() ? "ok" : "not_configured";
    let dbConfigStatus = isDatabaseConfigured() ? "ok" : "not_configured";
    let dbConnStatus = "not_configured";
    let authStatus = "unauthenticated";
    let isAdminTest = false;

    if (isDatabaseConfigured()) {
      try {
        await query("SELECT 1 AS probe");
        dbConnStatus = "ok";
      } catch (e: any) {
        dbConnStatus = `connection_error: ${e?.message || 'timeout'}`;
      }
    }

    try {
      const user = await this.resolveAuthenticatedUser(authHeader, email);
      if (user) {
        authStatus = "ok";
        isAdminTest = isInternalAdminTestEmail(user.email);
      }
    } catch (authErr: any) {
      authStatus = `auth_error: ${authErr?.message || 'failed'}`;
    }

    return {
      success: true,
      serverless: serverlessStatus,
      environment: envStatus,
      supabase: supabaseStatus,
      databaseConfig: dbConfigStatus,
      databaseConnection: dbConnStatus,
      auth: authStatus,
      adminTestAccess: isAdminTest,
      timestamp: new Date().toISOString()
    };
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
        const isVerified = supabaseUser.emailVerified;

        if (process.env.NODE_ENV !== 'production') {
          console.log(`[AuthEngine:ResolveUser] Resolved Supabase ID: ${supabaseId} (Verified: ${isVerified})`);
        }

        if (isDatabaseConfigured()) {
          try {
            const generatedId = `usr_${crypto.randomBytes(8).toString('hex')}`;
            // Atomic UPSERT using ON CONFLICT (supabase_user_id) to eliminate concurrency race conditions
            const upsertRes = await query(
              `INSERT INTO users (id, supabase_user_id, email, email_verified, created_at, updated_at)
               VALUES ($1, $2, $3, $4, NOW(), NOW())
               ON CONFLICT (supabase_user_id) WHERE supabase_user_id IS NOT NULL
               DO UPDATE SET email = EXCLUDED.email, email_verified = EXCLUDED.email_verified, updated_at = NOW()
               RETURNING id, supabase_user_id, email, email_verified, mobile`,
              [generatedId, supabaseId, userEmail, isVerified]
            );

            if (upsertRes.rows.length > 0) {
              const row = upsertRes.rows[0];
              return {
                id: row.id,
                supabaseUserId: row.supabase_user_id || supabaseId,
                email: row.email || userEmail,
                emailVerified: row.email_verified ?? isVerified,
                mobile: row.mobile || undefined
              };
            }
          } catch (dbErr) {
            console.warn('[AuthEngine:ResolveUser] DB user upsert notice:', dbErr);
          }

          // Fallback return for authenticated Supabase user even if DB write was delayed
          return {
            id: `usr_${supabaseId.slice(0, 16)}`,
            supabaseUserId: supabaseId,
            email: userEmail,
            emailVerified: isVerified
          };
        } else {
          let user = this.localSandbox.users.get(supabaseId) || this.localSandbox.users.get(userEmail);
          if (!user) {
            const internalId = `usr_${crypto.randomBytes(8).toString('hex')}`;
            user = {
              id: internalId,
              supabaseUserId: supabaseId,
              email: userEmail,
              emailVerified: isVerified
            };
            this.localSandbox.users.set(supabaseId, user);
            this.localSandbox.users.set(userEmail, user);
          }
          return user;
        }
      }
    }

    // In local development sandbox ONLY when not in production serverless, allow email-based dev session
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
        let u = this.localSandbox.users.get(cleanEmail);
        if (!u) {
          const internalId = `usr_${crypto.randomBytes(8).toString('hex')}`;
          u = {
            id: internalId,
            supabaseUserId: internalId,
            email: cleanEmail,
            emailVerified: true
          };
          this.localSandbox.users.set(cleanEmail, u);
          this.localSandbox.users.set(internalId, u);
        }
        return u;
      }
    }

    return null;
  }

  // 2b. Synchronize Authenticated Supabase Session & Ensure User + Profile Record Exists
  public async syncSession(
    authHeader?: string | null,
    optionalProfile?: any
  ): Promise<{ success: boolean; user: any; profile: any }> {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      throw new Error("UNAUTHORIZED: Invalid or expired session token");
    }

    const userId = supabaseUser.supabaseUserId;
    const email = supabaseUser.email || optionalProfile?.email || '';
    const phone = supabaseUser.phone || optionalProfile?.phone || '';
    const fullName = supabaseUser.fullName || optionalProfile?.fullName || '';
    const firstName = supabaseUser.firstName || optionalProfile?.firstName || '';
    const lastName = supabaseUser.lastName || optionalProfile?.lastName || '';
    const avatarUrl = supabaseUser.avatarUrl || optionalProfile?.avatarUrl || '';
    const authProvider = supabaseUser.authProvider || (phone ? 'whatsapp' : 'google');
    const emailVerified = supabaseUser.emailVerified;
    const phoneVerified = supabaseUser.phoneVerified;
    const lang = optionalProfile?.language || 'hi';

    let userProfile: any = null;

    if (isDatabaseConfigured()) {
      try {
        // 1. Upsert users table
        await query(
          `INSERT INTO users (id, supabase_user_id, email, email_verified, mobile, mobile_verified, created_at, updated_at)
           VALUES ($1, $1, $2, $3, $4, $5, NOW(), NOW())
           ON CONFLICT (supabase_user_id) WHERE supabase_user_id IS NOT NULL
           DO UPDATE SET email = EXCLUDED.email, email_verified = EXCLUDED.email_verified, mobile = COALESCE(EXCLUDED.mobile, users.mobile), mobile_verified = COALESCE(EXCLUDED.mobile_verified, users.mobile_verified), updated_at = NOW()`,
          [userId, email, emailVerified, phone, phoneVerified]
        );

        // 2. Upsert profiles table
        const profRes = await query(
          `INSERT INTO profiles (id, user_id, email, phone, full_name, first_name, last_name, avatar_url, preferred_language, auth_provider, email_verified, phone_verified, last_login_at, created_at, updated_at)
           VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW())
           ON CONFLICT (user_id)
           DO UPDATE SET
             email = COALESCE(EXCLUDED.email, profiles.email),
             phone = COALESCE(EXCLUDED.phone, profiles.phone),
             full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
             avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
             auth_provider = COALESCE(EXCLUDED.auth_provider, profiles.auth_provider),
             email_verified = EXCLUDED.email_verified OR profiles.email_verified,
             phone_verified = EXCLUDED.phone_verified OR profiles.phone_verified,
             last_login_at = NOW(),
             updated_at = NOW()
           RETURNING *`,
          [userId, email, phone, fullName, firstName, lastName, avatarUrl, lang, authProvider, emailVerified, phoneVerified]
        );
        userProfile = profRes.rows[0];

        // 3. Log user activity
        await this.logUserActivity(authHeader, 'login', { provider: authProvider });
      } catch (dbErr: any) {
        console.warn('[syncSession] Database synchronization notice:', dbErr?.message || dbErr);
      }
    }

    // Check free claims status
    let hasClaimedFreeReport = false;
    let freeReportDetails: any = undefined;

    if (isDatabaseConfigured()) {
      try {
        const claimRes = await query(
          `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $1`,
          [userId]
        );
        if (claimRes.rows.length > 0) {
          hasClaimedFreeReport = true;
          freeReportDetails = {
            reportType: claimRes.rows[0].report_type,
            claimedAt: claimRes.rows[0].claimed_at,
            profileKey: claimRes.rows[0].profile_key,
          };
        }
      } catch (dbErr: any) {
        console.warn('[syncSession] Free claims lookup notice:', dbErr?.message || dbErr);
      }
    }

    return {
      success: true,
      user: {
        id: userId,
        supabaseUserId: userId,
        email,
        phone,
        fullName,
        avatarUrl,
        authProvider,
        emailVerified,
        phoneVerified,
        hasClaimedFreeReport,
        freeReportDetails
      },
      profile: userProfile || {
        userId,
        email,
        phone,
        fullName,
        avatarUrl,
        authProvider,
        emailVerified,
        phoneVerified,
        preferredLanguage: lang,
      }
    };
  }

  // 2c. Save/Update Numerology Profile
  public async saveNumerologyProfile(
    authHeader: string | null | undefined,
    profileData: {
      fullName: string;
      dateOfBirth: string;
      mobileNumber?: string;
      email?: string;
      gender?: string;
      language?: string;
      mulank?: number;
      bhagyank?: number;
      kuaNumber?: number;
    }
  ): Promise<{ success: boolean; profile: any }> {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      throw new Error("UNAUTHORIZED: Login required to save numerology profile.");
    }

    const userId = supabaseUser.supabaseUserId;
    const {
      fullName,
      dateOfBirth,
      mobileNumber,
      email,
      gender,
      language = 'hi',
      mulank,
      bhagyank,
      kuaNumber
    } = profileData;

    let dobDate: string | null = null;
    if (dateOfBirth) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        dobDate = dateOfBirth;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
        const [d, m, y] = dateOfBirth.split('/');
        dobDate = `${y}-${m}-${d}`;
      }
    }

    let bDay = 0, bMonth = 0, bYear = 0;
    if (dobDate) {
      const parts = dobDate.split('-');
      bYear = parseInt(parts[0], 10) || 0;
      bMonth = parseInt(parts[1], 10) || 0;
      bDay = parseInt(parts[2], 10) || 0;
    }

    if (isDatabaseConfigured()) {
      const profileId = `np_${crypto.randomBytes(8).toString('hex')}`;
      const res = await query(
        `INSERT INTO numerology_profiles (id, user_id, full_name, date_of_birth, dob_string, mobile_number, email, gender, language, birth_day, birth_month, birth_year, mulank, bhagyank, kua_number, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET
           full_name = EXCLUDED.full_name,
           date_of_birth = EXCLUDED.date_of_birth,
           dob_string = EXCLUDED.dob_string,
           mobile_number = EXCLUDED.mobile_number,
           email = EXCLUDED.email,
           gender = EXCLUDED.gender,
           language = EXCLUDED.language,
           birth_day = EXCLUDED.birth_day,
           birth_month = EXCLUDED.birth_month,
           birth_year = EXCLUDED.birth_year,
           mulank = EXCLUDED.mulank,
           bhagyank = EXCLUDED.bhagyank,
           kua_number = EXCLUDED.kua_number,
           updated_at = NOW()
         RETURNING *`,
        [profileId, userId, fullName, dobDate, dateOfBirth, mobileNumber, email, gender, language, bDay, bMonth, bYear, mulank, bhagyank, kuaNumber]
      );

      await this.logUserActivity(authHeader, 'profile_updated', { fullName, dateOfBirth });

      return { success: true, profile: res.rows[0] };
    }

    return { success: true, profile: { userId, fullName, dateOfBirth, mobileNumber, email, gender } };
  }

  // 2d. Get Current User's Saved Numerology Profile
  public async getNumerologyProfile(authHeader?: string | null): Promise<{ success: boolean; profile: any | null }> {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      return { success: true, profile: null };
    }

    if (isDatabaseConfigured()) {
      const res = await query(`SELECT * FROM numerology_profiles WHERE user_id = $1`, [supabaseUser.supabaseUserId]);
      return { success: true, profile: res.rows[0] || null };
    }

    return { success: true, profile: null };
  }

  // 2e. Record Report Run in report_runs table
  public async recordReportRun(
    authHeader: string | null | undefined,
    reportData: {
      reportType: string;
      profileName?: string;
      dobString?: string;
      reportKey?: string;
      language?: string;
      metadata?: any;
    }
  ): Promise<{ success: boolean; reportRunId: string }> {
    await this.ensureDb();
    const supabaseUser = await verifySupabaseToken(authHeader);
    if (!supabaseUser || !supabaseUser.supabaseUserId) {
      return { success: false, reportRunId: '' };
    }

    const userId = supabaseUser.supabaseUserId;
    const runId = `run_${crypto.randomBytes(8).toString('hex')}`;
    const lang = reportData.language || 'hi';

    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO report_runs (id, user_id, profile_name, dob_string, report_type, report_key, language, status, metadata, generated_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'generated', $8, NOW(), NOW())`,
        [runId, userId, reportData.profileName || '', reportData.dobString || '', reportData.reportType, reportData.reportKey || '', lang, JSON.stringify(reportData.metadata || {})]
      );

      await this.logUserActivity(authHeader, 'report_generated', {
        reportType: reportData.reportType,
        profileName: reportData.profileName
      });
    }

    return { success: true, reportRunId: runId };
  }

  // 2f. Log User Activity
  public async logUserActivity(
    authHeader: string | null | undefined,
    eventType: string,
    metadata: any = {}
  ): Promise<void> {
    try {
      if (!isDatabaseConfigured()) return;
      const supabaseUser = await verifySupabaseToken(authHeader);
      if (!supabaseUser || !supabaseUser.supabaseUserId) return;

      const actId = `act_${crypto.randomBytes(8).toString('hex')}`;
      await query(
        `INSERT INTO user_activity (id, user_id, event_type, report_type, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [actId, supabaseUser.supabaseUserId, eventType, metadata?.reportType || null, JSON.stringify(metadata || {})]
      );
    } catch (e) {
      // Non-blocking telemetry
      console.warn('[ActivityLogger] Notice:', e);
    }
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

    // Public / No-Login Reports: Mobile Numerology and Lo Shu Grid
    if (reportType === 'MOBILE_NUMEROLOGY' || reportType === 'LOSHU') {
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
      // 2b. ADMIN / INTERNAL TEST ACCESS CHECK (Pre-Phase 10.5)
      // Strictly server-authorized: must be authenticated user matching server-only allowlist
      const adminEval = evaluateAdminTestAccess(authUser);
      if (adminEval.isAdminTest) {
        try {
          await this.logUserActivity(authHeader, 'ADMIN_TEST_ACCESS', {
            reportType,
            profileKey: safeKey,
            accessType: 'ADMIN_TEST',
            email: authUser.email
          });
        } catch {
          // best-effort telemetry logging
        }

        return {
          allowed: true,
          requiresPayment: false,
          isFirstFreeReport: false,
          isFreeReportType: false,
          canClaimFree: false,
          price: 0,
          reportType,
          profileKey: safeKey,
          accessType: 'ADMIN_TEST',
          reason: 'Internal Test Access — Authorized test account (No payment required)'
        };
      }

      if (isDatabaseConfigured()) {
        // Strict Entitlement check: tied to authenticated user ID + profileKey + reportType
        const entRes = await query(
          `SELECT id, access_type, amount FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2) AND profile_key = $3 AND report_type = $4`,
          [authUser.id, authUser.supabaseUserId, safeKey, reportType]
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

        // Strict Free claim check: tied to authenticated user
        const claimRes = await query(
          `SELECT id, report_type FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`,
          [authUser.id, authUser.supabaseUserId]
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
        const entKey = `${authUser.id}_${reportType}_${safeKey}`;
        let ent = this.localSandbox.entitlements.get(entKey);
        if (!ent && authUser.email) {
          for (const item of this.localSandbox.entitlements.values()) {
            if ((item.email === authUser.email || item.userId === authUser.id) && item.reportType === reportType && item.profileKey === safeKey) {
              ent = item;
              break;
            }
          }
        }
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

        const freeClaim = this.localSandbox.freeClaims.get(authUser.id) || this.localSandbox.freeClaims.get(authUser.email);
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

  // 4. Claim First Free Report (Atomic ACID Transaction & DB Unique Constraint)
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
          `SELECT report_type FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`,
          [userId, supabaseUserId]
        );
        if (existingClaimRes.rows.length > 0) {
          throw new Error(`मुफ़्त रिपोर्ट अधिकार पहले ही ${existingClaimRes.rows[0].report_type} के लिए उपयोग किया जा चुका है। Additional reports are ₹33.`);
        }

        const claimId = `claim_${crypto.randomBytes(8).toString('hex')}`;
        try {
          await client.query(
            `INSERT INTO free_claims (id, user_id, supabase_user_id, email, report_type, profile_key, claimed_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [claimId, userId, supabaseUserId, email, reportType, safeKey]
          );
        } catch (dbErr: any) {
          if (dbErr?.code === '23505') {
            throw new Error("मुफ़्त रिपोर्ट अधिकार पहले ही उपयोग किया जा चुका है। (Free report entitlement already claimed)");
          }
          throw dbErr;
        }

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
      if (this.localSandbox.freeClaims.has(userId) || this.localSandbox.freeClaims.has(email)) {
        throw new Error("मुफ़्त रिपोर्ट अधिकार पहले ही उपयोग किया जा चुका है।");
      }

      this.localSandbox.freeClaims.set(userId, {
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
      this.localSandbox.entitlements.set(`${userId}_${reportType}_${safeKey}`, entitlement);

      return { success: true, allowed: true, entitlement };
    }
  }

  // 5. Create ₹33 Razorpay Payment Order (Strict Fail-Closed Integration)
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

    if (!keyId || !keySecret) {
      if (isServerlessRuntime()) {
        throw new Error("PAYMENT_CONFIGURATION_ERROR: Razorpay gateway credentials are not configured.");
      }
    }

    let razorpayOrderId = '';

    if (keyId && keySecret && keyId.startsWith('rzp_')) {
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

        if (!response.ok) {
          const errBody = await response.text();
          console.error("Razorpay API order error response:", errBody);
          throw new Error("PAYMENT_PROVIDER_UNAVAILABLE: Razorpay order generation failed.");
        }

        const rzpData = await response.json();
        if (!rzpData?.id) {
          throw new Error("PAYMENT_PROVIDER_UNAVAILABLE: Invalid response from Razorpay.");
        }
        razorpayOrderId = rzpData.id;
      } catch (err: any) {
        console.error("Razorpay order generation error:", err?.message || err);
        throw new Error(err?.message || "PAYMENT_PROVIDER_UNAVAILABLE: Could not create payment order with gateway.");
      }
    } else {
      if (isServerlessRuntime()) {
        throw new Error("PAYMENT_CONFIGURATION_ERROR: Valid Razorpay Key ID and Secret are required in production.");
      }
      // Local dev sandbox only
      razorpayOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
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
    if (!keySecret) {
      throw new Error("PAYMENT_CONFIGURATION_ERROR: RAZORPAY_KEY_SECRET is not configured on server.");
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error("अवैध भुगतान हस्ताक्षर (Invalid Razorpay payment signature verification failed)");
    }

    const now = new Date().toISOString();

    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        // Match trusted server order from database
        const orderRes = await client.query(
          `SELECT user_id, supabase_user_id, report_type, profile_key, amount FROM payment_transactions WHERE razorpay_order_id = $1`,
          [orderId]
        );

        if (orderRes.rows.length === 0) {
          throw new Error("PAYMENT_VERIFICATION_FAILED: Order ID was not generated by LeoFamily server.");
        }

        const txOrder = orderRes.rows[0];
        if (
          (txOrder.user_id !== userId && txOrder.supabase_user_id !== supabaseUserId) ||
          txOrder.report_type !== reportType ||
          txOrder.profile_key !== safeKey ||
          Number(txOrder.amount) !== REPORT_PRICE_INR
        ) {
          throw new Error("PAYMENT_VERIFICATION_FAILED: Order details mismatch (user, profile, reportType, or amount).");
        }

        // Idempotency: check if already granted
        const existingEntRes = await client.query(
          `SELECT id, user_id, supabase_user_id, email, report_type, profile_key, access_type, amount, created_at FROM entitlements WHERE (user_id = $1 OR supabase_user_id = $2) AND profile_key = $3 AND report_type = $4`,
          [userId, supabaseUserId, safeKey, reportType]
        );

        if (existingEntRes.rows.length > 0) {
          const e = existingEntRes.rows[0];
          return {
            success: true,
            accessGranted: true,
            entitlement: {
              id: e.id,
              userId: e.user_id,
              mobile: e.email || email,
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
           ON CONFLICT (razorpay_order_id) DO UPDATE SET razorpay_payment_id = $8, status = 'PAID', updated_at = NOW()`,
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
      const entKey = `${userId}_${reportType}_${safeKey}`;
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
         FROM entitlements WHERE user_id = $1 OR supabase_user_id = $2 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId]
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
        if (ent.userId === authUser.id || ent.email === authUser.email) {
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

    // For authenticated admin test users, inject Master Report internal test item without creating fake payments
    if (isInternalAdminTestEmail(authUser.email)) {
      const masterDef = REPORT_REGISTRY.MASTER_REPORT;
      const alreadyHasMaster = reportItems.some(r => r.reportType === 'MASTER_REPORT');
      if (!alreadyHasMaster) {
        reportItems.unshift({
          id: `admin_test_master_${authUser.id}`,
          userId: authUser.id,
          profileKey: 'default_profile',
          reportType: 'MASTER_REPORT',
          titleHi: `${masterDef.titleHi} (आंतरिक टेस्ट एक्सेस)`,
          titleEn: `${masterDef.titleEn} (Internal Test Access)`,
          titleMr: `${masterDef.titleMr} (प्रशासकीय चाचणी)`,
          titleBn: `${masterDef.titleBn} (অ্যাডমিন টেস্ট অ্যাক্সেস)`,
          titleGu: `${masterDef.titleGu} (એડમિન ટેસ્ટ એક્સેસ)`,
          accessType: 'ADMIN_TEST',
          amount: 0,
          currency: 'INR',
          status: 'UNLOCKED',
          createdAt: new Date().toISOString(),
        });
      }
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
        `SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`,
        [authUser.id, authUser.supabaseUserId]
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
         FROM payment_transactions WHERE user_id = $1 OR supabase_user_id = $2 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId]
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
      const freeClaim = this.localSandbox.freeClaims.get(authUser.id) || this.localSandbox.freeClaims.get(authUser.email);
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
        if (p.internalUserId === authUser.id || p.email === authUser.email) {
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
      const claimRes = await query(`SELECT report_type, profile_key, claimed_at FROM free_claims WHERE user_id = $1 OR supabase_user_id = $2`, [authUser.id, authUser.supabaseUserId]);
      const freeClaim = claimRes.rows[0];

      const entRes = await query(`SELECT access_type, amount FROM entitlements WHERE user_id = $1 OR supabase_user_id = $2`, [authUser.id, authUser.supabaseUserId]);
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
          adminTestAccess: isInternalAdminTestEmail(authUser.email),
        }
      };
    } else {
      const freeClaim = this.localSandbox.freeClaims.get(authUser.id) || this.localSandbox.freeClaims.get(authUser.email);
      const userEntitlements = Array.from(this.localSandbox.entitlements.values()).filter(e => e.userId === authUser.id || e.email === authUser.email);
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
          adminTestAccess: isInternalAdminTestEmail(authUser.email),
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

    if (reportId.startsWith('admin_test_')) {
      if (!isInternalAdminTestEmail(authUser.email)) {
        throw new Error("Unauthorized: Admin test access required");
      }
      const def = REPORT_REGISTRY.MASTER_REPORT;
      return {
        success: true,
        allowed: true,
        report: {
          id: reportId,
          userId: authUser.id,
          profileKey: 'default_profile',
          reportType: 'MASTER_REPORT',
          titleHi: `${def.titleHi} (आंतरिक टेस्ट एक्सेस)`,
          titleEn: `${def.titleEn} (Internal Test Access)`,
          titleMr: `${def.titleMr} (प्रशासकीय चाचणी)`,
          titleBn: `${def.titleBn} (অ্যাডমিন টেস্ট অ্যাক্সেস)`,
          titleGu: `${def.titleGu} (એડમિન ટેસ્ટ એક્સેસ)`,
          accessType: 'ADMIN_TEST',
          amount: 0,
          currency: 'INR',
          status: 'UNLOCKED',
          createdAt: new Date().toISOString(),
        },
      };
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

      if (ent.user_id !== authUser.id && ent.supabase_user_id !== authUser.supabaseUserId) {
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

  // 11b. Authorize PDF Generation (Server-Authoritative)
  public async authorizePdf(
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<{ success: boolean; allowed: boolean; accessType?: string; message?: string }> {
    await this.ensureDb();
    const access = await this.checkReportAccess(reportType, profileKey, authHeader, optionalEmail);
    if (!access.allowed) {
      return {
        success: false,
        allowed: false,
        message: "PDF export requires a verified paid entitlement or authorized admin test access."
      };
    }

    if (access.accessType === 'ADMIN_TEST') {
      try {
        await this.logUserActivity(authHeader, 'ADMIN_TEST_PDF_ACCESS', {
          reportType,
          profileKey
        });
      } catch {
        // best-effort logging
      }
    }

    return {
      success: true,
      allowed: true,
      accessType: access.accessType,
      message: "PDF generation authorized."
    };
  }

  // 12. Admin Audit Data
  public async getAdminAuditData() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
      const claimsCount = await query(`SELECT COUNT(*) as count FROM free_claims`);
      const paidCount = await query(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_rev FROM entitlements WHERE access_type = 'PAID'`);
      const pendingUpi = await query(`SELECT COUNT(*) as count FROM upi_submissions WHERE status = 'PENDING'`);

      return {
        storageType: 'SUPABASE_POSTGRESQL',
        totalUsers: Number(usersCount.rows[0]?.count || 0),
        totalFreeClaims: Number(claimsCount.rows[0]?.count || 0),
        totalPaidReports: Number(paidCount.rows[0]?.count || 0),
        totalRevenueInr: Number(paidCount.rows[0]?.total_rev || 0),
        pendingUpiVerifications: Number(pendingUpi.rows[0]?.count || 0),
        configDiagnostics: getSafeConfigAudit(),
      };
    } else {
      return {
        storageType: 'LOCAL_SANDBOX_MEMORY',
        totalUsers: this.localSandbox.users.size,
        totalFreeClaims: this.localSandbox.freeClaims.size,
        totalPaidReports: Array.from(this.localSandbox.entitlements.values()).filter(e => e.accessType === 'PAID').length,
        totalRevenueInr: Array.from(this.localSandbox.entitlements.values()).filter(e => e.accessType === 'PAID').reduce((sum, e) => sum + e.amount, 0),
        pendingUpiVerifications: 0,
        configDiagnostics: getSafeConfigAudit(),
      };
    }
  }

  // 13. Submit UPI QR Payment with UTR for Admin Verification
  public async submitUpiPayment(
    reportType: CanonicalReportType,
    profileKey: string,
    utrNumber: string,
    upiId?: string,
    userName?: string,
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<{ success: boolean; submissionId: string; status: string; message: string }> {
    await this.ensureDb();
    const cleanUtr = String(utrNumber || '').trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      throw new Error("कृपया एक मान्य UTR (12-अंकीय लेन-देन संख्या) दर्ज करें।");
    }

    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const userId = authUser?.id || `guest_${crypto.randomBytes(6).toString('hex')}`;
    const supabaseUserId = authUser?.supabaseUserId || null;
    const email = authUser?.email || normalizeEmail(optionalEmail) || 'guest@leofamily.online';
    const mobile = authUser?.mobile || '';
    const safeKey = profileKey || 'default_profile';
    const submissionId = `upi_${crypto.randomBytes(8).toString('hex')}`;

    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO upi_submissions (id, user_id, supabase_user_id, email, mobile, user_name, report_type, profile_key, utr_number, upi_id, amount, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING', NOW(), NOW())`,
        [submissionId, userId, supabaseUserId, email, mobile, userName || 'Aspirant', reportType, safeKey, cleanUtr, upiId || 'leofamily@upi', REPORT_PRICE_INR]
      );
    } else {
      (this.localSandbox as any).upiSubmissions = (this.localSandbox as any).upiSubmissions || new Map();
      (this.localSandbox as any).upiSubmissions.set(submissionId, {
        id: submissionId,
        userId,
        supabaseUserId,
        email,
        mobile,
        userName: userName || 'Aspirant',
        reportType,
        profileKey: safeKey,
        utrNumber: cleanUtr,
        upiId: upiId || 'leofamily@upi',
        amount: REPORT_PRICE_INR,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
    }

    return {
      success: true,
      submissionId,
      status: 'PENDING',
      message: 'Payment details submitted successfully. Verification pending by admin.'
    };
  }

  // 14. Retrieve User's UPI Submissions
  public async getUserUpiSubmissions(authHeader?: string | null, optionalEmail?: string) {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      return { success: true, submissions: [] };
    }

    if (isDatabaseConfigured()) {
      const res = await query(
        `SELECT * FROM upi_submissions WHERE user_id = $1 OR supabase_user_id = $2 OR email = $3 ORDER BY created_at DESC`,
        [authUser.id, authUser.supabaseUserId, authUser.email]
      );
      return { success: true, submissions: res.rows };
    } else {
      const subs = Array.from(((this.localSandbox as any).upiSubmissions || new Map()).values()).filter(
        (s: any) => s.userId === authUser.id || s.email === authUser.email
      );
      return { success: true, submissions: subs };
    }
  }

  // 14b. Check UPI Payment Status
  public async getUpiPaymentStatus(
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string,
    utr?: string
  ): Promise<{
    success: boolean;
    status: string;
    isUnlocked: boolean;
    record?: any;
    message?: string;
  }> {
    await this.ensureDb();
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const cleanEmail = normalizeEmail(optionalEmail) || authUser?.email || '';
    const cleanUtr = (utr || '').trim();

    // Check if entitlement is already active
    const accessCheck = await this.checkReportAccess(reportType, profileKey, authHeader, cleanEmail);
    if (accessCheck.allowed) {
      return {
        success: true,
        status: 'VERIFIED',
        isUnlocked: true,
        message: 'Report access is active and unlocked.'
      };
    }

    if (isDatabaseConfigured()) {
      let subQuery = `SELECT * FROM upi_submissions WHERE (report_type = $1 AND profile_key = $2)`;
      const params: any[] = [reportType, profileKey];

      if (cleanUtr) {
        params.push(cleanUtr);
        subQuery += ` AND utr_number = $${params.length}`;
      } else if (cleanEmail) {
        params.push(cleanEmail);
        subQuery += ` AND email = $${params.length}`;
      }

      subQuery += ` ORDER BY created_at DESC LIMIT 1`;
      const res = await query(subQuery, params);

      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          success: true,
          status: row.status,
          isUnlocked: row.status === 'VERIFIED',
          record: {
            id: row.id,
            utr: row.utr_number,
            amount: row.amount,
            status: row.status,
            rejectionReason: row.rejection_reason,
            createdAt: row.created_at
          }
        };
      }
    } else {
      const subs: any[] = Array.from(((this.localSandbox as any).upiSubmissions || new Map()).values());
      const match: any = subs.reverse().find((s: any) => {
        if (s.reportType !== reportType) return false;
        if (cleanUtr && s.utrNumber === cleanUtr) return true;
        if (cleanEmail && s.email === cleanEmail) return true;
        if (s.profileKey === profileKey) return true;
        return false;
      });

      if (match) {
        return {
          success: true,
          status: match.status,
          isUnlocked: match.status === 'VERIFIED',
          record: {
            id: match.id,
            utr: match.utrNumber,
            amount: match.amount,
            status: match.status,
            rejectionReason: match.rejectionReason,
            createdAt: match.createdAt
          }
        };
      }
    }

    return {
      success: true,
      status: 'NOT_FOUND',
      isUnlocked: false,
      message: 'No pending or verified UPI submission found.'
    };
  }

  // 15. Admin: Get all Pending UPI Submissions
  public async getAdminPendingPayments() {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const res = await query(`SELECT * FROM upi_submissions ORDER BY created_at DESC LIMIT 100`);
      return { success: true, submissions: res.rows };
    } else {
      const subs = Array.from(((this.localSandbox as any).upiSubmissions || new Map()).values());
      return { success: true, submissions: subs };
    }
  }

  // Alias for getAdminPendingPayments
  public async getAdminUpiPayments() {
    return this.getAdminPendingPayments();
  }

  // 16. Admin: Verify (Approve / Reject) UPI Payment
  public async verifyAdminUpiPayment(
    submissionId: string,
    action: 'APPROVE' | 'REJECT',
    rejectionReason?: string,
    verifiedBy?: string
  ) {
    await this.ensureDb();
    if (!submissionId) throw new Error("Missing submissionId");

    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        const subRes = await client.query(`SELECT * FROM upi_submissions WHERE id = $1`, [submissionId]);
        if (subRes.rows.length === 0) {
          throw new Error("UPI submission not found");
        }
        const sub = subRes.rows[0];

        if (action === 'APPROVE') {
          await client.query(
            `UPDATE upi_submissions SET status = 'VERIFIED', verified_by = $1, verified_at = NOW(), updated_at = NOW() WHERE id = $2`,
            [verifiedBy || 'admin', submissionId]
          );

          // Create entitlement
          const entId = `ent_upi_${crypto.randomBytes(8).toString('hex')}`;
          await client.query(
            `INSERT INTO entitlements (id, user_id, supabase_user_id, email, mobile, report_type, profile_key, access_type, amount, currency, payment_status, razorpay_payment_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'PAID', $8, 'INR', 'PAID', $9, NOW(), NOW())
             ON CONFLICT (user_id, profile_key, report_type)
             DO UPDATE SET access_type = 'PAID', amount = EXCLUDED.amount, payment_status = 'PAID', razorpay_payment_id = EXCLUDED.razorpay_payment_id, updated_at = NOW()`,
            [entId, sub.user_id, sub.supabase_user_id, sub.email, sub.mobile, sub.report_type, sub.profile_key, sub.amount, sub.utr_number]
          );

          return { success: true, status: 'VERIFIED', message: 'Payment verified and report unlocked successfully' };
        } else {
          await client.query(
            `UPDATE upi_submissions SET status = 'REJECTED', rejection_reason = $1, verified_by = $2, verified_at = NOW(), updated_at = NOW() WHERE id = $3`,
            [rejectionReason || 'UTR verification failed with bank records', verifiedBy || 'admin', submissionId]
          );
          return { success: true, status: 'REJECTED', message: 'Payment submission marked as rejected' };
        }
      });
    } else {
      const map = (this.localSandbox as any).upiSubmissions || new Map();
      const sub = map.get(submissionId);
      if (!sub) throw new Error("Submission not found in sandbox");

      if (action === 'APPROVE') {
        sub.status = 'VERIFIED';
        sub.verifiedAt = new Date().toISOString();
        const entId = `ent_upi_${crypto.randomBytes(8).toString('hex')}`;
        this.localSandbox.entitlements.set(`${sub.userId}_${sub.reportType}_${sub.profileKey}`, {
          id: entId,
          userId: sub.userId,
          email: sub.email,
          mobile: sub.mobile,
          reportType: sub.reportType,
          profileKey: sub.profileKey,
          accessType: 'PAID',
          amount: sub.amount,
          paymentStatus: 'PAID',
          createdAt: new Date().toISOString(),
          paymentId: sub.utrNumber
        });
        return { success: true, status: 'VERIFIED', message: 'Payment verified and report unlocked' };
      } else {
        sub.status = 'REJECTED';
        sub.rejectionReason = rejectionReason || 'Invalid UTR';
        return { success: true, status: 'REJECTED', message: 'Payment marked as rejected' };
      }
    }
  }

  // 17. Submit Consultation Feedback & Quality Ratings (Phase 10)
  public async submitConsultationFeedback(
    feedback: {
      reportType?: string;
      profileKey?: string;
      rating: number;
      clarity?: string;
      actionability?: string;
      feedbackText?: string;
    },
    authHeader?: string | null,
    optionalEmail?: string
  ): Promise<{ success: boolean; feedbackId: string; message: string }> {
    await this.ensureDb();
    const rating = Math.max(1, Math.min(5, Number(feedback.rating) || 5));
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const userId = authUser?.id || `guest_${crypto.randomBytes(6).toString('hex')}`;
    const supabaseUserId = authUser?.supabaseUserId || null;
    const email = authUser?.email || normalizeEmail(optionalEmail) || 'guest@leofamily.online';
    const feedbackId = `fb_${crypto.randomBytes(8).toString('hex')}`;
    const reportType = feedback.reportType || 'MASTER_REPORT';
    const profileKey = feedback.profileKey || 'default_profile';

    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO consultation_feedback (id, user_id, supabase_user_id, email, report_type, profile_key, rating, clarity, actionability, feedback_text, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [feedbackId, userId, supabaseUserId, email, reportType, profileKey, rating, feedback.clarity || '', feedback.actionability || '', feedback.feedbackText || '']
      );
    } else {
      (this.localSandbox as any).consultationFeedback = (this.localSandbox as any).consultationFeedback || [];
      (this.localSandbox as any).consultationFeedback.push({
        id: feedbackId,
        userId,
        supabaseUserId,
        email,
        reportType,
        profileKey,
        rating,
        clarity: feedback.clarity || '',
        actionability: feedback.actionability || '',
        feedbackText: feedback.feedbackText || '',
        createdAt: new Date().toISOString()
      });
    }

    try {
      await this.logUserActivity(authHeader, 'CONSULTATION_FEEDBACK_SUBMITTED', {
        rating,
        reportType,
        clarity: feedback.clarity,
        actionability: feedback.actionability
      });
    } catch {
      // Activity logging best effort
    }

    return {
      success: true,
      feedbackId,
      message: 'आपकी मूल्यवान प्रतिक्रिया सफलतापूर्वक दर्ज की गई है। (Feedback submitted successfully)'
    };
  }

  // 18. Admin: Get Consultation Feedback (Phase 10)
  public async getAdminFeedback(): Promise<{ success: boolean; feedback: any[] }> {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const res = await query(`SELECT * FROM consultation_feedback ORDER BY created_at DESC LIMIT 100`);
      return { success: true, feedback: res.rows };
    } else {
      const list = (this.localSandbox as any).consultationFeedback || [];
      return { success: true, feedback: [...list].reverse() };
    }
  }
}

export const reportAccessEngine = new ReportAccessEngine();
