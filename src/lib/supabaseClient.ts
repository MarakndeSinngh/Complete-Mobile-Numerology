/**
 * SUPABASE CLIENT CONFIGURATION (Supabase Auth Email OTP)
 * Phase 16C.3/16C.5: Official Supabase Auth Client for Passwordless Email OTP
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve Supabase project URL and anon public key directly from Vite / Node environment
// Direct static references allow Vite to inline variables at build time
const viteUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
const viteAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : undefined;
const nodeUrl = nodeEnv?.VITE_SUPABASE_URL || nodeEnv?.SUPABASE_URL;
const nodeAnonKey = nodeEnv?.VITE_SUPABASE_ANON_KEY || nodeEnv?.SUPABASE_ANON_KEY;

const supabaseUrl = (viteUrl || nodeUrl || '').trim();
const supabaseAnonKey = (viteAnonKey || nodeAnonKey || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('[YOUR-') &&
    supabaseUrl.startsWith('https://') &&
    !!supabaseAnonKey &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseAnonKey.length > 20
  );
};

// Safe diagnostic helper (logs presence safely without exposing sensitive tokens)
export const getSupabaseClientConfigAudit = () => {
  return {
    VITE_SUPABASE_URL_PRESENT: !!supabaseUrl,
    VITE_SUPABASE_ANON_KEY_PRESENT: !!supabaseAnonKey,
    isSupabaseConfigured: isSupabaseConfigured(),
  };
};

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder-leofamily.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);
