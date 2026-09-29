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
  phone: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  authProvider: string;
  emailVerified: boolean;
  phoneVerified: boolean;
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
      const u = data.user;
      const meta = u.user_metadata || {};
      const appMeta = u.app_metadata || {};
      
      const provider = appMeta.provider || (u.phone ? 'whatsapp' : 'google');
      const fullName = meta.full_name || meta.name || [meta.first_name, meta.last_name].filter(Boolean).join(' ') || '';
      const parts = fullName.split(' ');
      const firstName = meta.first_name || parts[0] || '';
      const lastName = meta.last_name || parts.slice(1).join(' ') || '';
      const avatarUrl = meta.avatar_url || meta.picture || '';

      return {
        supabaseUserId: u.id,
        email: u.email || '',
        phone: u.phone || '',
        fullName,
        firstName,
        lastName,
        avatarUrl,
        authProvider: provider,
        emailVerified: !!(u.email_confirmed_at || u.confirmed_at),
        phoneVerified: !!(u.phone_confirmed_at || (u.phone && (u.confirmed_at || meta.phone_verified))),
      };
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Express Middleware / Authorization Validator
 */
export async function requireAuthenticatedUser(
  authHeader: string | undefined | null
): Promise<AuthenticatedSupabaseUser> {
  const user = await verifySupabaseToken(authHeader);
  if (!user || !user.supabaseUserId) {
    throw new Error("UNAUTHORIZED: Valid Supabase authentication token is required.");
  }
  return user;
}
