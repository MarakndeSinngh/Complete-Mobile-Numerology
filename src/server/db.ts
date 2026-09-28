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
      // 1. Users table & indexes
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          supabase_user_id VARCHAR(64),
          email VARCHAR(255),
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          mobile VARCHAR(15),
          mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(64);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_verified BOOLEAN NOT NULL DEFAULT FALSE;
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile_unique ON users(mobile) WHERE mobile IS NOT NULL AND mobile != '';
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_supabase_id_unique ON users(supabase_user_id) WHERE supabase_user_id IS NOT NULL;
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