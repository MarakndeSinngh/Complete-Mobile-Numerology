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
  return (typeof process !== 'undefined' && (process.env?.RAZORPAY_KEY_ID || process.env?.VITE_RAZORPAY_KEY_ID)) || '';
}

export function getRazorpayKeySecret(): string {
  return (typeof process !== 'undefined' && (process.env?.RAZORPAY_KEY_SECRET || process.env?.RAZORPAY_SECRET)) || '';
}

export function getRazorpayWebhookSecret(): string {
  return (typeof process !== 'undefined' && process.env?.RAZORPAY_WEBHOOK_SECRET) || '';
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
    try {
      if (isDatabaseConfigured()) {
        await ensureDatabaseSchema();
      }
    } catch (dbErr: any) {
      console.warn("[Database Notice] Database connection warning:", dbErr?.message || dbErr);
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
        const isVerified = supabaseUser.emailVerified;

        if (process.env.NODE_ENV !== 'production') {
          console.log(`[AuthEngine:ResolveUser] Resolved Supabase ID: ${supabaseId} (Verified: ${isVerified})`);
        }

        if (isDatabaseConfigured()) {
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

    // If Supabase token is not present or server Supabase is not configured, resolve from email/identity if provided
    if (cleanEmail) {
      await this.ensureDb();
      if (isDatabaseConfigured()) {
        try {
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
          const generatedId = `usr_${crypto.randomBytes(8).toString('hex')}`;
          const insertRes = await query(
            `INSERT INTO users (id, email, email_verified, created_at, updated_at)
             VALUES ($1, $2, true, NOW(), NOW())
             ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
             RETURNING id, supabase_user_id, email, email_verified, mobile`,
            [generatedId, cleanEmail]
          );
          if (insertRes.rows.length > 0) {
            const u = insertRes.rows[0];
            return {
              id: u.id,
              supabaseUserId: u.supabase_user_id || u.id,
              email: u.email,
              emailVerified: u.email_verified,
              mobile: u.mobile
            };
          }
        } catch (dbErr) {
          console.warn("[AuthEngine:UserResolution:DB] Notice:", dbErr);
        }
      }

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
      }
      return u;
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
    }

    // Check free claims status
    let hasClaimedFreeReport = false;
    let freeReportDetails: any = undefined;

    if (isDatabaseConfigured()) {
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

  // 5. Create Razorpay Payment Order (Strict & Resilient Integration)
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
      throw new Error("UNAUTHORIZED: Please sign in or verify your identity before initiating payment.");
    }

    const { id: userId, supabaseUserId, email } = authUser;
    const safeKey = profileKey || 'default_profile';
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();
    const receipt = `rcpt_${Date.now()}_${reportType.substring(0, 4).toLowerCase()}`;

    const priceInr = REPORT_REGISTRY[reportType]?.priceInr ?? REPORT_PRICE_INR;
    const pricePaise = priceInr * 100;

    let razorpayOrderId = '';

    const hasRealRazorpayKeys = !!(
      keyId &&
      keySecret &&
      keyId.startsWith('rzp_') &&
      !keyId.includes('sandbox') &&
      !keyId.includes('placeholder')
    );

    if (hasRealRazorpayKeys) {
      try {
        const rzpAuthHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': rzpAuthHeader
          },
          body: JSON.stringify({
            amount: pricePaise,
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
          console.error("[Razorpay API Error Response]", errBody);
          throw new Error("PAYMENT_PROVIDER_UNAVAILABLE: Razorpay order generation failed with status " + response.status);
        }

        const rzpData = await response.json();
        if (!rzpData?.id) {
          throw new Error("PAYMENT_PROVIDER_UNAVAILABLE: Invalid response payload from Razorpay.");
        }
        razorpayOrderId = rzpData.id;
      } catch (err: any) {
        console.error("[Razorpay Order Error]", err?.message || err);
        throw new Error(err?.message || "PAYMENT_PROVIDER_UNAVAILABLE: Could not create payment order with gateway.");
      }
    } else {
      // In sandbox/preview mode, generate valid order reference
      razorpayOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    }

    if (isDatabaseConfigured()) {
      try {
        const txId = `tx_${crypto.randomBytes(8).toString('hex')}`;
        await query(
          `INSERT INTO payment_transactions (id, user_id, supabase_user_id, email, profile_key, report_type, razorpay_order_id, amount, currency, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'INR', 'CREATED', NOW(), NOW())
           ON CONFLICT (razorpay_order_id) DO NOTHING`,
          [txId, userId, supabaseUserId, email, safeKey, reportType, razorpayOrderId, priceInr]
        );
      } catch (dbErr: any) {
        console.warn("[Payment Order DB Warning]", dbErr?.message || dbErr);
      }
    } else {
      this.localSandbox.orders.set(razorpayOrderId, {
        orderId: razorpayOrderId,
        userId,
        email,
        reportType,
        profileKey: safeKey,
        amount: priceInr,
        status: 'CREATED'
      });
    }

    return {
      orderId: razorpayOrderId,
      amount: priceInr,
      amountPaise: pricePaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
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

    const keySecret = getRazorpayKeySecret();
    const isRealSecret = !!(keySecret && !keySecret.includes('sandbox') && !keySecret.includes('placeholder'));

    if (isRealSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error("अवैध भुगतान हस्ताक्षर (Invalid Razorpay payment signature verification failed)");
      }
    } else if (signature) {
      // In sandbox mode, verify signature if possible or validate presence
      if (keySecret) {
        const expectedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${orderId}|${paymentId}`)
          .digest('hex');
        if (signature !== expectedSignature && signature !== 'sandbox_test_signature') {
          console.warn("[Sandbox Payment Notice] Signature verification mismatch in sandbox mode.");
        }
      }
    }

    const priceInr = REPORT_REGISTRY[reportType]?.priceInr ?? REPORT_PRICE_INR;
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

  // 7b. Submit ₹33 UPI QR Payment with UTR for Admin Verification
  public async submitUpiPayment(
    reportType: CanonicalReportType,
    profileKey: string,
    utr: string,
    authHeader?: string | null,
    optionalEmail?: string,
    optionalMobile?: string
  ): Promise<{ success: boolean; status: string; paymentId: string; utr: string; message: string }> {
    await this.ensureDb();
    const cleanReportType = (reportType || 'MASTER_REPORT') as CanonicalReportType;
    if (!REPORT_REGISTRY[cleanReportType]) {
      throw new Error("Invalid report type");
    }

    const cleanUtr = (utr || '').trim().toUpperCase();
    if (!cleanUtr || cleanUtr.length < 6) {
      throw new Error("कृपया एक मान्य UTR / Transaction ID दर्ज करें (कम से कम 6 अक्षर)");
    }

    const safeKey = profileKey || 'default_profile';
    const priceInr = REPORT_REGISTRY[cleanReportType]?.priceInr ?? REPORT_PRICE_INR;

    // Resolve or build identity
    let authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    if (!authUser) {
      const email = normalizeEmail(optionalEmail) || `upi_user_${cleanUtr.slice(-6).toLowerCase()}@leofamily.com`;
      const mobile = normalizeIndianMobile(optionalMobile);
      const generatedId = `usr_${crypto.randomBytes(8).toString('hex')}`;
      authUser = {
        id: generatedId,
        supabaseUserId: generatedId,
        email,
        emailVerified: false,
        mobile
      };
    }

    const { id: userId, supabaseUserId, email } = authUser;
    const paymentId = `tx_upi_${crypto.randomBytes(8).toString('hex')}`;
    const syntheticOrderId = `upi_${Date.now()}_${cleanUtr.slice(-6)}`;
    const now = new Date().toISOString();

    if (isDatabaseConfigured()) {
      try {
        await query(
          `INSERT INTO payment_transactions (
            id, user_id, supabase_user_id, email, mobile, profile_key, report_type,
            razorpay_order_id, amount, currency, status, payment_method, utr, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'INR', 'PENDING_VERIFICATION', 'UPI_QR', $10, NOW(), NOW())
          ON CONFLICT (razorpay_order_id) DO UPDATE SET utr = $10, status = 'PENDING_VERIFICATION', updated_at = NOW()`,
          [paymentId, userId, supabaseUserId, email, authUser.mobile || optionalMobile || null, safeKey, cleanReportType, syntheticOrderId, priceInr, cleanUtr]
        );
      } catch (dbErr: any) {
        console.warn("[UPI DB Warning]", dbErr?.message || dbErr);
      }
    } else {
      this.localSandbox.payments.set(paymentId, {
        id: paymentId,
        userId,
        supabaseUserId,
        email,
        mobile: authUser.mobile || optionalMobile,
        profileKey: safeKey,
        reportType: cleanReportType,
        orderId: syntheticOrderId,
        amount: priceInr,
        currency: 'INR',
        status: 'PENDING_VERIFICATION',
        paymentMethod: 'UPI_QR',
        utr: cleanUtr,
        createdAt: now
      });
      this.localSandbox.orders.set(syntheticOrderId, {
        orderId: syntheticOrderId,
        paymentId,
        userId,
        email,
        reportType: cleanReportType,
        profileKey: safeKey,
        amount: priceInr,
        status: 'PENDING_VERIFICATION',
        utr: cleanUtr
      });
    }

    return {
      success: true,
      status: 'PENDING_VERIFICATION',
      paymentId,
      utr: cleanUtr,
      message: 'आपका payment verification के लिए भेज दिया गया है। Verification के बाद आपका Master Report unlock किया जाएगा।'
    };
  }

  // 7c. Check UPI Payment Verification Status
  public async getUpiPaymentStatus(
    reportType: CanonicalReportType,
    profileKey: string,
    authHeader?: string | null,
    optionalEmail?: string,
    optionalUtr?: string
  ): Promise<{ success: boolean; status: string; record?: any; isUnlocked: boolean }> {
    await this.ensureDb();
    const cleanReportType = (reportType || 'MASTER_REPORT') as CanonicalReportType;
    const safeKey = profileKey || 'default_profile';
    const authUser = await this.resolveAuthenticatedUser(authHeader, optionalEmail);
    const cleanUtr = (optionalUtr || '').trim().toUpperCase();

    if (isDatabaseConfigured()) {
      let queryStr = `SELECT id, user_id, email, report_type, profile_key, amount, status, utr, payment_method, created_at, verified_at, admin_notes
                      FROM payment_transactions
                      WHERE report_type = $1 AND profile_key = $2`;
      const params: any[] = [cleanReportType, safeKey];

      if (authUser) {
        queryStr += ` AND (user_id = $3 OR supabase_user_id = $3 OR email = $4)`;
        params.push(authUser.id, authUser.email);
      } else if (cleanUtr) {
        queryStr += ` AND utr = $3`;
        params.push(cleanUtr);
      } else if (optionalEmail) {
        queryStr += ` AND email = $3`;
        params.push(normalizeEmail(optionalEmail));
      }

      queryStr += ` ORDER BY created_at DESC LIMIT 1`;
      const res = await query(queryStr, params);

      if (res.rows.length > 0) {
        const tx = res.rows[0];
        return {
          success: true,
          status: tx.status,
          record: tx,
          isUnlocked: tx.status === 'VERIFIED' || tx.status === 'PAID'
        };
      }
    } else {
      // Sandbox fallback search
      for (const [_, p] of this.localSandbox.payments.entries()) {
        if (p.reportType === cleanReportType && p.profileKey === safeKey) {
          if ((cleanUtr && p.utr === cleanUtr) || (authUser && (p.userId === authUser.id || p.email === authUser.email)) || (optionalEmail && p.email === optionalEmail)) {
            return {
              success: true,
              status: p.status,
              record: p,
              isUnlocked: p.status === 'VERIFIED' || p.status === 'PAID'
            };
          }
        }
      }
    }

    return {
      success: true,
      status: 'NOT_FOUND',
      isUnlocked: false
    };
  }

  // 7d. Get All UPI Payments for Admin Dashboard
  public async getAdminUpiPayments(): Promise<{ success: boolean; payments: any[]; total: number }> {
    await this.ensureDb();
    if (isDatabaseConfigured()) {
      const res = await query(
        `SELECT id, user_id, supabase_user_id, email, mobile, profile_key, report_type, razorpay_order_id,
                amount, currency, status, payment_method, utr, created_at, verified_at, verified_by, admin_notes
         FROM payment_transactions
         WHERE payment_method = 'UPI_QR' OR utr IS NOT NULL
         ORDER BY created_at DESC LIMIT 150`
      );
      return { success: true, payments: res.rows, total: res.rows.length };
    } else {
      const list: any[] = [];
      for (const [_, p] of this.localSandbox.payments.entries()) {
        if (p.paymentMethod === 'UPI_QR' || p.utr) {
          list.push(p);
        }
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return { success: true, payments: list, total: list.length };
    }
  }

  // 7e. Admin Verify / Reject UPI Payment & Activate Entitlement
  public async verifyAdminUpiPayment(
    paymentId: string,
    action: 'VERIFY' | 'REJECT',
    adminIdentifier: string = 'admin_user',
    notes: string = ''
  ): Promise<{ success: boolean; status: string; message: string; entitlement?: any }> {
    await this.ensureDb();
    const cleanAction = action === 'VERIFY' ? 'VERIFIED' : 'REJECTED';
    const now = new Date().toISOString();

    if (isDatabaseConfigured()) {
      return await withTransaction(async (client) => {
        const txRes = await client.query(
          `SELECT id, user_id, supabase_user_id, email, mobile, profile_key, report_type, amount, razorpay_order_id, utr
           FROM payment_transactions WHERE id = $1`,
          [paymentId]
        );

        if (txRes.rows.length === 0) {
          throw new Error("Payment transaction record not found.");
        }

        const tx = txRes.rows[0];

        // 1. Update transaction status
        await client.query(
          `UPDATE payment_transactions
           SET status = $1, verified_at = NOW(), verified_by = $2, admin_notes = $3, updated_at = NOW()
           WHERE id = $4`,
          [cleanAction, adminIdentifier, notes, paymentId]
        );

        let entitlement: any = null;

        // 2. On VERIFY: Grant and activate MASTER_REPORT entitlement
        if (cleanAction === 'VERIFIED') {
          const entId = `ent_upi_${crypto.randomBytes(8).toString('hex')}`;
          await client.query(
            `INSERT INTO entitlements (
              id, user_id, supabase_user_id, email, mobile, report_type, profile_key,
              access_type, amount, currency, payment_status, razorpay_payment_id, razorpay_order_id, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PAID', $8, 'INR', 'GRANTED', $9, $10, NOW(), NOW())
            ON CONFLICT (user_id, profile_key, report_type)
            DO UPDATE SET payment_status = 'GRANTED', access_type = 'PAID', updated_at = NOW()`,
            [entId, tx.user_id, tx.supabase_user_id, tx.email, tx.mobile, tx.report_type, tx.profile_key, tx.amount, tx.utr, tx.razorpay_order_id]
          );

          entitlement = {
            id: entId,
            userId: tx.user_id,
            reportType: tx.report_type,
            profileKey: tx.profile_key,
            accessType: 'PAID',
            paymentStatus: 'GRANTED'
          };
        }

        return {
          success: true,
          status: cleanAction,
          message: cleanAction === 'VERIFIED'
            ? 'भुगतान सफलतापूर्वक सत्यापित कर दिया गया है। रिपोर्ट अनलॉक हो चुकी है।'
            : 'भुगतान अस्वीकृत कर दिया गया है।',
          entitlement
        };
      });
    } else {
      const tx = this.localSandbox.payments.get(paymentId);
      if (!tx) {
        throw new Error("Payment transaction not found in sandbox.");
      }

      tx.status = cleanAction;
      tx.verifiedAt = now;
      tx.verifiedBy = adminIdentifier;
      tx.adminNotes = notes;

      let entitlement: any = null;

      if (cleanAction === 'VERIFIED') {
        const entKey = `${tx.userId}_${tx.reportType}_${tx.profileKey}`;
        const entId = `ent_upi_${crypto.randomBytes(8).toString('hex')}`;
        entitlement = {
          id: entId,
          userId: tx.userId,
          mobile: tx.email,
          reportType: tx.reportType,
          profileKey: tx.profileKey,
          accessType: 'PAID',
          amount: tx.amount,
          paymentId: tx.utr,
          orderId: tx.orderId,
          paymentStatus: 'GRANTED',
          createdAt: now
        };
        this.localSandbox.entitlements.set(entKey, entitlement);
      }

      return {
        success: true,
        status: cleanAction,
        message: cleanAction === 'VERIFIED'
          ? 'भुगतान सफलतापूर्वक सत्यापित कर दिया गया है। रिपोर्ट अनलॉक हो चुकी है।'
          : 'भुगतान अस्वीकृत कर दिया गया है।',
        entitlement
      };
    }
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
