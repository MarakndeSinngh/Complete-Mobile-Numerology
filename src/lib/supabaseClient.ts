/**
 * SUPABASE CLIENT CONFIGURATION (Supabase Auth Email OTP)
 * Phase 16C.3: Official Supabase Auth Client for Passwordless Email OTP
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve Supabase project URL and anon public key safely from Vite environment
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const procEnv = typeof process !== 'undefined' ? process.env : undefined;

const supabaseUrl =
  metaEnv?.VITE_SUPABASE_URL ||
  procEnv?.VITE_SUPABASE_URL ||
  procEnv?.SUPABASE_URL ||
  'https://placeholder-leofamily.supabase.co';

const supabaseAnonKey =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  procEnv?.VITE_SUPABASE_ANON_KEY ||
  procEnv?.SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !supabaseUrl.includes('placeholder-leofamily') &&
    !supabaseUrl.includes('[YOUR-') &&
    !!supabaseAnonKey &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
