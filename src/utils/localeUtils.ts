import { SupportedLanguage } from '../i18n/types';

export const LOCALE_MAP: Record<SupportedLanguage, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
};

/**
 * Parses input into a safe Date object
 */
export function toSafeDate(dateInput: Date | string | number | undefined | null): Date {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? new Date() : dateInput;
  }
  if (typeof dateInput === 'string') {
    // Handle DD/MM/YYYY string if present
    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) return d;
      }
    }
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? new Date() : d;
  }
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Formats a localized date (e.g. "24 सितंबर 2026", "24 September 2026")
 */
export function formatLocalizedDate(
  dateInput: Date | string | number,
  lang: SupportedLanguage = 'hi',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
  const date = toSafeDate(dateInput);
  const locale = LOCALE_MAP[lang] || 'hi-IN';
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (err) {
    return date.toLocaleDateString(locale, options);
  }
}

/**
 * Formats localized time (e.g. "15:30", "3:30 अपराह्न")
 */
export function formatLocalizedTime(
  dateInput: Date | string | number,
  lang: SupportedLanguage = 'hi',
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
): string {
  const date = toSafeDate(dateInput);
  const locale = LOCALE_MAP[lang] || 'hi-IN';
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (err) {
    return date.toLocaleTimeString(locale, options);
  }
}

/**
 * Formats localized combined date and time
 */
export function formatLocalizedDateTime(
  dateInput: Date | string | number,
  lang: SupportedLanguage = 'hi',
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const date = toSafeDate(dateInput);
  const locale = LOCALE_MAP[lang] || 'hi-IN';
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (err) {
    return date.toLocaleString(locale, options);
  }
}

/**
 * Returns localized month name (monthIndex: 0 for Jan ... 11 for Dec, or 1-12)
 */
export function getLocalizedMonthName(
  monthIndexOr1Based: number,
  lang: SupportedLanguage = 'hi',
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  const zeroBasedIndex = monthIndexOr1Based > 11 ? monthIndexOr1Based - 1 : (monthIndexOr1Based < 0 ? 0 : monthIndexOr1Based);
  const sampleDate = new Date(2026, zeroBasedIndex, 15);
  const locale = LOCALE_MAP[lang] || 'hi-IN';
  try {
    return new Intl.DateTimeFormat(locale, { month: format }).format(sampleDate);
  } catch (e) {
    return sampleDate.toLocaleString(locale, { month: format });
  }
}

/**
 * Returns localized weekday name (dayIndex: 0 for Sunday ... 6 for Saturday)
 */
export function getLocalizedWeekdayName(
  dayIndex: number,
  lang: SupportedLanguage = 'hi',
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  // 2026-09-20 is a Sunday (0)
  const normalizedIndex = Math.max(0, Math.min(6, dayIndex));
  const sampleDate = new Date(2026, 8, 20 + normalizedIndex);
  const locale = LOCALE_MAP[lang] || 'hi-IN';
  try {
    return new Intl.DateTimeFormat(locale, { weekday: format }).format(sampleDate);
  } catch (e) {
    return sampleDate.toLocaleString(locale, { weekday: format });
  }
}

/**
 * Formats DOB into Indian DD/MM/YYYY numeric format strictly
 * Maintains 05/08/1983 format standard
 */
export function formatIndianDOB(dobStr?: string): string {
  if (!dobStr || dobStr.trim() === '') return '';
  const clean = dobStr.trim();
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    }
    return clean;
  }
  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD/MM/YYYY
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      }
      return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    }
  }
  return clean;
}

/**
 * Generates a deterministic, normalized profile key for user data isolation
 */
export function getProfileIsolationKey(identity?: { fullName?: string; name?: string; dob?: string; mobile?: string; gender?: string } | null): string {
  if (!identity) return 'unassigned_guest_profile';
  const rawName = (identity.fullName || identity.name || '').trim().toLowerCase().replace(/\s+/g, '_');
  const rawDob = (identity.dob || '').trim().replace(/[^0-9]/g, '');
  const rawMobile = (identity.mobile || '').trim().replace(/[^0-9]/g, '');
  const rawGender = (identity.gender || '').trim().toLowerCase();
  
  if (!rawName && !rawDob && !rawMobile) {
    return 'unassigned_guest_profile';
  }
  return `leo_prof_${rawName}_${rawDob}_${rawMobile}${rawGender ? `_${rawGender}` : ''}`;
}
