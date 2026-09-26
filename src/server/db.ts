/**
 * DURABLE SUPABASE / POSTGRESQL DATABASE PERSISTENCE LAYER
 * Phase 16C.2: Enterprise PostgreSQL Client, ACID Transactions & Schema Migrations
 */

import pg from 'pg';
const { Pool } = pg;

// Detect database connection URL from environment variables
export function getDatabaseConnectionString(): string | null {
  if (typeof process === 'undefined' || !process.env) return null;
  return (
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    null
  );
}

// Check whether a durable database is configured
export function isDatabaseConfigured(): boolean {
  return !!getDatabaseConnectionString();
}

let poolInstance: pg.Pool | null = null;
let schemaInitialized = false;

export function getDatabasePool(): pg.Pool {
  if (poolInstance) {
    return poolInstance;
  }

  const connectionString = getDatabaseConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED: PostgreSQL connection string is missing. Please set DATABASE_URL or SUPABASE_DB_URL in environment.");
  }

  const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  poolInstance = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  poolInstance.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
  });

  return poolInstance;
}

/**
 * Execute parameterized query safely
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
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Ensure durable database tables and constraints exist (Auto-Migration)
 */
export async function ensureDatabaseSchema(): Promise<void> {
  if (schemaInitialized || !isDatabaseConfigured()) {
    return;
  }

  try {
    // 1. Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        mobile VARCHAR(15) NOT NULL UNIQUE,
        mobile_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
    `);

    // 2. OTPs table
    await query(`
      CREATE TABLE IF NOT EXISTS otps (
        id VARCHAR(64) PRIMARY KEY,
        mobile VARCHAR(15) NOT NULL,
        otp_hash VARCHAR(128) NOT NULL,
        expires_at BIGINT NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        verified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_otps_mobile ON otps(mobile);
    `);

    // 3. Free claims table (Enforces 1 free report per user)
    await query(`
      CREATE TABLE IF NOT EXISTS free_claims (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        report_type VARCHAR(64) NOT NULL,
        profile_key VARCHAR(128) NOT NULL,
        claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_free_claim_user UNIQUE (user_id),
        CONSTRAINT uq_free_claim_mobile UNIQUE (mobile)
      );
      CREATE INDEX IF NOT EXISTS idx_free_claims_user ON free_claims(user_id);
    `);

    // 4. Entitlements table (Tied to user_id + profile_key + report_type)
    await query(`
      CREATE TABLE IF NOT EXISTS entitlements (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        report_type VARCHAR(64) NOT NULL,
        profile_key VARCHAR(128) NOT NULL,
        access_type VARCHAR(32) NOT NULL,
        amount INT NOT NULL DEFAULT 0,
        currency VARCHAR(8) NOT NULL DEFAULT 'INR',
        payment_status VARCHAR(32) NOT NULL DEFAULT 'GRANTED',
        razorpay_order_id VARCHAR(128),
        razorpay_payment_id VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_user_profile_report UNIQUE (user_id, profile_key, report_type)
      );
      CREATE INDEX IF NOT EXISTS idx_entitlements_user ON entitlements(user_id);
      CREATE INDEX IF NOT EXISTS idx_entitlements_lookup ON entitlements(user_id, profile_key, report_type);
      CREATE INDEX IF NOT EXISTS idx_entitlements_rzp_pay ON entitlements(razorpay_payment_id);
    `);

    // 5. Payment transactions table (Idempotent order & payment recording)
    await query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        profile_key VARCHAR(128) NOT NULL,
        report_type VARCHAR(64) NOT NULL,
        razorpay_order_id VARCHAR(128) NOT NULL,
        razorpay_payment_id VARCHAR(128),
        amount INT NOT NULL,
        currency VARCHAR(8) NOT NULL DEFAULT 'INR',
        status VARCHAR(32) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_tx_rzp_order UNIQUE (razorpay_order_id),
        CONSTRAINT uq_tx_rzp_payment UNIQUE (razorpay_payment_id)
      );
      CREATE INDEX IF NOT EXISTS idx_tx_user ON payment_transactions(user_id);
    `);

    // 6. Webhook events table (Deduplication & idempotency)
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
    console.log("Durable PostgreSQL schema initialized successfully.");
  } catch (err: any) {
    console.error("PostgreSQL schema initialization notice:", err?.message || err);
  }
}
