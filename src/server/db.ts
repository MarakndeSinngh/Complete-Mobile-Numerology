/**
 * DURABLE SUPABASE / POSTGRESQL DATABASE PERSISTENCE LAYER
 * Phase 16C.2/16C.5: Enterprise PostgreSQL Client, ACID Transactions & Serverless Connection Resilience
 */

import pg from 'pg';
const { Pool } = pg;

// Detect database connection URL from environment variables
export function getDatabaseConnectionString(): string | null {
  if (typeof process === 'undefined' || !process.env) return null;
  const candidates = [
    process.env.SUPABASE_DB_URL,
    process.env.POSTGRES_URL,
    process.env.SUPABASE_POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL
  ];

  for (const url of candidates) {
    if (!url || typeof url !== 'string') continue;
    const trimmed = url.trim();

    // Must be a valid postgres protocol
    if (!trimmed.startsWith('postgres://') && !trimmed.startsWith('postgresql://')) {
      continue;
    }

    // Filter out unpopulated placeholders from .env.example
    if (
      trimmed.includes('[YOUR-') ||
      trimmed.includes('YOUR-PROJECT-REF') ||
      trimmed.includes('[YOUR-PASSWORD]') ||
      trimmed.includes('example.com')
    ) {
      continue;
    }

    return trimmed;
  }

  return null;
}

// Check whether a durable database is configured
export function isDatabaseConfigured(): boolean {
  return !!getDatabaseConnectionString();
}

let poolInstance: pg.Pool | null = null;
let schemaInitPromise: Promise<void> | null = null;
let schemaInitialized = false;

export function getDatabasePool(): pg.Pool {
  if (poolInstance) {
    return poolInstance;
  }

  const connectionString = getDatabaseConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED: PostgreSQL connection string is missing in environment variables.");
  }

  const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  poolInstance = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    max: 3, // Serverless-friendly low connection footprint
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });

  poolInstance.on('error', (err) => {
    console.error('[PostgreSQL Pool Notice] Idle client error:', err?.message || err);
  });

  return poolInstance;
}

/**
 * Execute parameterized query safely with structured timeout handling
 */
export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<pg.QueryResult<T>> {
  const pool = getDatabasePool();
  return await pool.query<T>(text, params);
}

/**
 * Execute a function within a dedicated ACID PostgreSQL transaction
 */
export async function withTransaction<T>(
  callback: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const pool = getDatabasePool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.warn('[PostgreSQL Transaction] Rollback notice:', rollbackErr);
    }
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Ensure durable database tables and constraints exist (Idempotent Migration)
 * Cached in a single Promise to prevent race conditions during serverless cold starts.
 */
export async function ensureDatabaseSchema(): Promise<void> {
  if (schemaInitialized || !isDatabaseConfigured()) {
    return;
  }

  if (schemaInitPromise) {
    return await schemaInitPromise;
  }

  schemaInitPromise = (async () => {
    try {
      // 1. Users & Profiles table & indexes
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          mobile VARCHAR(20),
          mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_verified BOOLEAN NOT NULL DEFAULT FALSE;
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile_unique ON users(mobile) WHERE mobile IS NOT NULL AND mobile != '';
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_supabase_id_unique ON users(supabase_user_id) WHERE supabase_user_id IS NOT NULL;

        CREATE TABLE IF NOT EXISTS profiles (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          email TEXT,
          phone TEXT,
          full_name TEXT,
          first_name TEXT,
          last_name TEXT,
          avatar_url TEXT,
          preferred_language TEXT DEFAULT 'hi',
          country_code TEXT DEFAULT 'IN',
          auth_provider TEXT,
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          last_login_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'hi';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'IN';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();
        CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id_unique ON profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

        CREATE TABLE IF NOT EXISTS numerology_profiles (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          full_name TEXT,
          date_of_birth DATE,
          dob_string VARCHAR(32),
          mobile_number TEXT,
          email TEXT,
          gender TEXT,
          language TEXT DEFAULT 'hi',
          birth_day INTEGER,
          birth_month INTEGER,
          birth_year INTEGER,
          mulank INTEGER,
          bhagyank INTEGER,
          kua_number INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE numerology_profiles ADD COLUMN IF NOT EXISTS dob_string VARCHAR(32);
        ALTER TABLE numerology_profiles ADD COLUMN IF NOT EXISTS kua_number INTEGER;
        CREATE INDEX IF NOT EXISTS idx_num_profiles_user ON numerology_profiles(user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_num_profiles_user_unique ON numerology_profiles(user_id);

        CREATE TABLE IF NOT EXISTS report_runs (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          profile_id VARCHAR(64),
          profile_name TEXT,
          dob_string VARCHAR(32),
          report_type VARCHAR(64) NOT NULL,
          report_key VARCHAR(128),
          language VARCHAR(16) DEFAULT 'hi',
          status VARCHAR(32) DEFAULT 'generated',
          metadata JSONB DEFAULT '{}'::jsonb,
          generated_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_report_runs_user ON report_runs(user_id);
        CREATE INDEX IF NOT EXISTS idx_report_runs_type ON report_runs(report_type);
        CREATE INDEX IF NOT EXISTS idx_report_runs_generated_at ON report_runs(generated_at);

        CREATE TABLE IF NOT EXISTS user_activity (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          event_type VARCHAR(64) NOT NULL,
          page VARCHAR(128),
          report_type VARCHAR(64),
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
      `);

      // 2. Free claims table
      await query(`
        CREATE TABLE IF NOT EXISTS free_claims (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(15),
          report_type VARCHAR(64) NOT NULL,
          profile_key VARCHAR(128) NOT NULL,
          claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE free_claims ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE free_claims ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE free_claims ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_free_claims_user_unique ON free_claims(user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_free_claims_supabase_unique ON free_claims(supabase_user_id) WHERE supabase_user_id IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_free_claims_email ON free_claims(email);
      `);

      // 3. Entitlements table
      await query(`
        CREATE TABLE IF NOT EXISTS entitlements (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(15),
          report_type VARCHAR(64) NOT NULL,
          profile_key VARCHAR(128) NOT NULL,
          access_type VARCHAR(32) NOT NULL,
          amount INT NOT NULL DEFAULT 0,
          currency VARCHAR(8) NOT NULL DEFAULT 'INR',
          payment_status VARCHAR(32) NOT NULL DEFAULT 'GRANTED',
          razorpay_order_id VARCHAR(128),
          razorpay_payment_id VARCHAR(128),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        CREATE INDEX IF NOT EXISTS idx_entitlements_supabase ON entitlements(supabase_user_id);
        CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements(email);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_entitlements_user_profile_report_unique ON entitlements(user_id, profile_key, report_type);
        CREATE INDEX IF NOT EXISTS idx_entitlements_rzp_pay ON entitlements(razorpay_payment_id);
      `);

      // 4. Payment transactions table
      await query(`
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(15),
          profile_key VARCHAR(128) NOT NULL,
          report_type VARCHAR(64) NOT NULL,
          razorpay_order_id VARCHAR(128) NOT NULL,
          razorpay_payment_id VARCHAR(128),
          amount INT NOT NULL,
          currency VARCHAR(8) NOT NULL DEFAULT 'INR',
          status VARCHAR(32) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        CREATE INDEX IF NOT EXISTS idx_tx_user ON payment_transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_tx_supabase ON payment_transactions(supabase_user_id);
        CREATE INDEX IF NOT EXISTS idx_tx_email ON payment_transactions(email);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_order_id_unique ON payment_transactions(razorpay_order_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_payment_id_unique ON payment_transactions(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL AND razorpay_payment_id != '';
      `);

      // 5. Webhook events table
      await query(`
        CREATE TABLE IF NOT EXISTS payment_webhook_events (
          id VARCHAR(64) PRIMARY KEY,
          event_id VARCHAR(128) NOT NULL UNIQUE,
          event_type VARCHAR(64) NOT NULL,
          processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON payment_webhook_events(event_id);
      `);

      // 6. UPI UTR Submissions table for manual / admin QR verification
      await query(`
        CREATE TABLE IF NOT EXISTS upi_submissions (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          mobile VARCHAR(20),
          user_name TEXT,
          report_type VARCHAR(64) NOT NULL,
          profile_key VARCHAR(128) NOT NULL,
          utr_number VARCHAR(64) NOT NULL,
          upi_id VARCHAR(128),
          amount INT NOT NULL DEFAULT 33,
          currency VARCHAR(8) NOT NULL DEFAULT 'INR',
          status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
          rejection_reason TEXT,
          verified_by VARCHAR(64),
          verified_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_upi_sub_user ON upi_submissions(user_id);
        CREATE INDEX IF NOT EXISTS idx_upi_sub_supabase ON upi_submissions(supabase_user_id);
        CREATE INDEX IF NOT EXISTS idx_upi_sub_status ON upi_submissions(status);
        CREATE INDEX IF NOT EXISTS idx_upi_sub_utr ON upi_submissions(utr_number);
      `);

      schemaInitialized = true;
      console.log("[PostgreSQL] Durable database schema initialized successfully.");
    } catch (err: any) {
      console.error("[PostgreSQL] Schema initialization warning:", err?.message || err);
      // Do not leave schemaInitPromise in broken state
    } finally {
      schemaInitPromise = null;
    }
  })();

  return await schemaInitPromise;
}