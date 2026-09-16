/**
 * LEOFAMILY MOBILE NUMEROLOGY — DATE STANDARDIZATION (INDIA)
 * 
 * Centralized Date Utilities
 * Standard Display Format: DD/MM/YYYY (Indian Standard)
 * Internal Storage Format: YYYY-MM-DD (ISO 8601)
 */

export const DATE_DISPLAY_FORMAT = "DD/MM/YYYY";
export const DATE_STORAGE_FORMAT = "YYYY-MM-DD";

/**
 * Checks if a year is a leap year in the Gregorian calendar.
 */
export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

/**
 * Gets the number of days in a given month and year.
 * Month is 1-indexed: 1 = January, 12 = December.
 */
export function getDaysInMonth(month: number, year: number): number {
  if (month < 1 || month > 12) return 0;
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

export interface ParsedDate {
  day: number;
  month: number;
  year: number;
}

/**
 * Explicitly and safely parses a date string in Indian DD/MM/YYYY or standard YYYY-MM-DD formats.
 * NEVER relies on non-deterministic browser new Date(string) parsing.
 */
export function parseIndianDate(input: string | undefined | null): ParsedDate | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Case 1: ISO string YYYY-MM-DD (or YYYY/MM/DD)
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/]/);
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (isValidDateComponents(day, month, year)) {
      return { day, month, year };
    }
    return null;
  }

  // Case 2: DD/MM/YYYY or DD-MM-YYYY (or D/M/YYYY or D-M-YYYY or DD.MM.YYYY)
  if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/.]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isValidDateComponents(day, month, year)) {
      return { day, month, year };
    }
    return null;
  }

  // Case 3: Compact 8 digits DDMMYYYY
  if (/^\d{8}$/.test(trimmed)) {
    // Check DDMMYYYY first (Indian default)
    const day = parseInt(trimmed.substring(0, 2), 10);
    const month = parseInt(trimmed.substring(2, 4), 10);
    const year = parseInt(trimmed.substring(4, 8), 10);
    if (isValidDateComponents(day, month, year)) {
      return { day, month, year };
    }
    // Check YYYYMMDD fallback if year is at start
    const yFallback = parseInt(trimmed.substring(0, 4), 10);
    const mFallback = parseInt(trimmed.substring(4, 6), 10);
    const dFallback = parseInt(trimmed.substring(6, 8), 10);
    if (isValidDateComponents(dFallback, mFallback, yFallback)) {
      return { day: dFallback, month: mFallback, year: yFallback };
    }
    return null;
  }

  return null;
}

/**
 * Validates day, month, and year calendar constraints.
 */
export function isValidDateComponents(day: number, month: number, year: number): boolean {
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (year < 1850 || year > 2150) return false;
  if (month < 1 || month > 12) return false;
  const maxDays = getDaysInMonth(month, year);
  if (day < 1 || day > maxDays) return false;
  return true;
}

/**
 * Validates if an Indian date string (DD/MM/YYYY, D/M/YYYY, etc.) or ISO string represents a valid calendar date.
 */
export function isValidIndianDate(input: string | undefined | null): boolean {
  return parseIndianDate(input) !== null;
}

/**
 * Normalizes an Indian date or ISO date into standard padded "DD/MM/YYYY".
 * E.g., "5/8/1983" -> "05/08/1983"
 * E.g., "1983-08-05" -> "05/08/1983"
 * Returns empty string if invalid.
 */
export function normalizeIndianDate(input: string | undefined | null): string {
  const parsed = parseIndianDate(input);
  if (!parsed) return '';
  const dd = String(parsed.day).padStart(2, '0');
  const mm = String(parsed.month).padStart(2, '0');
  const yyyy = String(parsed.year).padStart(4, '0');
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Formats a date for internal storage (YYYY-MM-DD).
 * Accepts DD/MM/YYYY, D/M/YYYY, or already valid YYYY-MM-DD.
 * E.g., "05/08/1983" -> "1983-08-05"
 * E.g., "14/08/1983" -> "1983-08-14"
 * E.g., "02/07/1983" -> "1983-07-02"
 * E.g., "19/02/1980" -> "1980-02-19"
 */
export function formatDateForStorage(input: string | undefined | null): string {
  const parsed = parseIndianDate(input);
  if (!parsed) return '';
  const yyyy = String(parsed.year).padStart(4, '0');
  const mm = String(parsed.month).padStart(2, '0');
  const dd = String(parsed.day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a stored ISO date (YYYY-MM-DD) or other date string into user-facing "DD/MM/YYYY".
 * E.g., "1983-08-05" -> "05/08/1983"
 * E.g., "1983-08-14" -> "14/08/1983"
 * E.g., "1983-07-02" -> "02/07/1983"
 * E.g., "1980-02-19" -> "19/02/1980"
 */
export function formatDateForDisplay(input: string | undefined | null): string {
  return normalizeIndianDate(input);
}

/**
 * Standard universal helper to format any Date object, ISO string, or Indian date string into DD/MM/YYYY.
 * If input is null, undefined, or empty, returns empty string or fallback.
 */
export function formatDateIndian(
  input: string | Date | undefined | null,
  fallback: string = ''
): string {
  if (!input) return fallback;

  if (input instanceof Date) {
    if (isNaN(input.getTime())) return fallback;
    const dd = String(input.getDate()).padStart(2, '0');
    const mm = String(input.getMonth() + 1).padStart(2, '0');
    const yyyy = String(input.getFullYear()).padStart(4, '0');
    return `${dd}/${mm}/${yyyy}`;
  }

  const normalized = normalizeIndianDate(input);
  return normalized || fallback;
}

/**
 * Safely extracts day, month, year numbers from an internal storage ISO string "YYYY-MM-DD"
 * without relying on browser Date timezone shifts.
 */
export function getStorageDateParts(isoStr: string): { year: number; month: number; day: number } | null {
  if (!isoStr || !isoStr.includes('-')) return null;
  const parts = isoStr.split('-');
  if (parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isValidDateComponents(day, month, year)) {
    return { year, month, day };
  }
  return null;
}
