/**
 * SUPABASE SERVER AUTHENTICATION & JWT VERIFICATION ENGINE
 * Phase 16C.3: Supabase Auth Passwordless Email OTP Verification
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseUrl = (): string => {
  return (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://placeholder-leofamily.supabase.co'
  );
};

const getSupabaseKey = (): string => {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'placeholder-anon-key'
  );
};

export const isSupabaseServerConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return (
    !!url &&
    !url.includes('placeholder') &&
    !url.includes('[YOUR-') &&
    !!key &&
    !key.includes('placeholder')
  );
};

let serverSupabaseClient: SupabaseClient | null = null;

export const getServerSupabaseClient = (): SupabaseClient => {
  if (serverSupabaseClient) return serverSupabaseClient;
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  serverSupabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return serverSupabaseClient;
};

export interface AuthenticatedSupabaseUser {
  supabaseUserId: string;
  email: string;
  emailVerified: boolean;
}

/**
 * Validate Supabase Auth JWT and resolve authenticated Supabase User
 */
export async function verifySupabaseToken(
  token: string | undefined | null
): Promise<AuthenticatedSupabaseUser | null> {
  if (!token || typeof token !== 'string') return null;

  const cleanToken = token.startsWith('Bearer ') ? token.substring(7).trim() : token.trim();
  if (!cleanToken) return null;

  if (isSupabaseServerConfigured()) {
    try {
      const client = getServerSupabaseClient();
      const { data, error } = await client.auth.getUser(cleanToken);
      if (error || !data.user) {
        return null;
      }
      return {
        supabaseUserId: data.user.id,
        email: data.user.email || '',
        emailVerified: !!(data.user.email_confirmed_at || data.user.confirmed_at),
      };
    } catch {
      return null;
    }
  }

  return null;
}
