/**
 * CANONICAL SERVER-SIDE ADMIN / INTERNAL TEST ALLOWLIST
 * Strictly server-side; NEVER exposed to client bundles or public APIs.
 * Supports environment variable override via ADMIN_TEST_EMAILS.
 */

const CANONICAL_ADMIN_TEST_EMAILS: readonly string[] = [
  'affectioncosmos@gmail.com',
  'attractabundance909@gmail.com'
];

export function normalizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export function getAdminEmails(): string[] {
  const set = new Set(CANONICAL_ADMIN_TEST_EMAILS.map(e => e.trim().toLowerCase()));
  const envVal = (typeof process !== 'undefined' && process.env?.ADMIN_TEST_EMAILS) || '';
  if (envVal && typeof envVal === 'string') {
    envVal
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
      .forEach(e => set.add(e));
  }
  return Array.from(set);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return getAdminEmails().includes(normalized);
}

// Aliases for compatibility
export const isInternalAdminTestEmail = isAdminEmail;
