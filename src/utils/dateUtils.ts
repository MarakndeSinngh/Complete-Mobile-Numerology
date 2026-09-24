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
  isValid?: boolean;
  digits?: number[];
}

export interface DetailedDateValidation {
  isValid: boolean;
  isComplete: boolean;
  error?: string;
  parsed?: ParsedDate;
  isoDate?: string;
  displayDate?: string;
}

/**
 * Extracts individual digits from day, month, year
 */
function extractDateDigits(day: number, month: number, year: number): number[] {
  const str = `${day}${month}${year}`;
  const digits: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const n = parseInt(str[i], 10);
    if (!isNaN(n)) digits.push(n);
  }
  return digits;
}

/**
 * Universal Smart Date Formatter
 * 
 * Progressively formats digit inputs:
 * "0" -> "0"
 * "05" -> "05"
 * "050" -> "05/0"
 * "0508" -> "05/08"
 * "05081" -> "05/08/1"
 * "050819" -> "05/08/19"
 * "0508198" -> "05/08/198"
 * "05081983" -> "05/08/1983"
 * 
 * Also handles pasted dates with '-', '.', or ISO 'YYYY-MM-DD'.
 */
export function formatSmartDateInput(rawValue: string, prevValue: string = ''): string {
  if (!rawValue) return '';
  const trimmed = rawValue.trim();
  if (!trimmed) return '';

  // Case 1: Pasted ISO date YYYY-MM-DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/]/);
    const y = parts[0].padStart(4, '0');
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${d}/${m}/${y}`;
  }

  // Case 2: Pasted separated date with - or . (e.g. 05-08-1983 or 05.08.1983 or 5-8-1983)
  if (/^\d{1,2}[-.]\d{1,2}[-.]\d{2,4}$/.test(trimmed)) {
    const parts = trimmed.split(/[-.]/);
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    let y = parts[2];
    if (y.length === 2) {
      y = parseInt(y, 10) > 40 ? `19${y}` : `20${y}`;
    }
    return `${d}/${m}/${y}`;
  }

  // Check if user is deleting
  const isDeleting = prevValue.length > rawValue.length;

  // Preserve trailing slashes if explicitly typed forward
  if (!isDeleting) {
    if (/^\d{2}\/$/.test(trimmed)) {
      return trimmed;
    }
    if (/^\d{2}\/\d{2}\/$/.test(trimmed)) {
      return trimmed;
    }
  }

  // Extract digits only (up to 8 digits for DDMMYYYY)
  const digits = trimmed.replace(/\D/g, '').slice(0, 8);
  if (digits.length === 0) return '';

  // 1-2 digits: "0", "05"
  if (digits.length <= 2) {
    if (!isDeleting && (trimmed.endsWith('/') || trimmed.endsWith('-') || trimmed.endsWith('.'))) {
      return `${digits.padStart(2, '0')}/`;
    }
    return digits;
  }

  // 3-4 digits: "05/0", "05/08"
  if (digits.length <= 4) {
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2);
    if (!isDeleting && mm.length === 2 && (trimmed.endsWith('/') || trimmed.endsWith('-') || trimmed.endsWith('.'))) {
      return `${dd}/${mm}/`;
    }
    return `${dd}/${mm}`;
  }

  // 5-8 digits: "05/08/1", "05/08/19", "05/08/198", "05/08/1983"
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4);
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Detailed validation for Indian date format with accurate error diagnostics.
 */
export function validateIndianDateDetails(
  input: string | undefined | null,
  required: boolean = false
): DetailedDateValidation {
  if (!input || !input.trim()) {
    if (required) {
      return { isValid: false, isComplete: false, error: 'Date of Birth is required' };
    }
    return { isValid: true, isComplete: false };
  }

  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 8 && !/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(trimmed) && !/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
    return { isValid: false, isComplete: false, error: 'Please enter a complete date (DD/MM/YYYY)' };
  }

  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;

  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/]/);
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(trimmed)) {
    const parts = trimmed.split(/[-/.]/);
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else if (/^\d{8}$/.test(trimmed)) {
    day = parseInt(trimmed.substring(0, 2), 10);
    month = parseInt(trimmed.substring(2, 4), 10);
    year = parseInt(trimmed.substring(4, 8), 10);
  } else if (digits.length === 8) {
    day = parseInt(digits.substring(0, 2), 10);
    month = parseInt(digits.substring(2, 4), 10);
    year = parseInt(digits.substring(4, 8), 10);
  }

  if (day === null || month === null || year === null || isNaN(day) || isNaN(month) || isNaN(year)) {
    return { isValid: false, isComplete: false, error: 'Invalid date format. Use DD/MM/YYYY (e.g. 05/08/1983)' };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, isComplete: true, error: `Invalid month: ${month} (must be 01–12)` };
  }

  if (year < 1850 || year > 2150) {
    return { isValid: false, isComplete: true, error: 'Year must be between 1850 and 2150' };
  }

  const maxDays = getDaysInMonth(month, year);
  if (day < 1 || day > maxDays) {
    if (month === 2) {
      if (isLeapYear(year)) {
        return { isValid: false, isComplete: true, error: `February ${year} (Leap Year) has only 29 days` };
      } else {
        return { isValid: false, isComplete: true, error: `February ${year} has only 28 days (${year} is not a leap year)` };
      }
    }
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return { isValid: false, isComplete: true, error: `${monthNames[month] || `Month ${month}`} has maximum ${maxDays} days` };
  }

  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  const yyyy = String(year).padStart(4, '0');

  return {
    isValid: true,
    isComplete: true,
    parsed: { day, month, year, isValid: true, digits: extractDateDigits(day, month, year) },
    isoDate: `${yyyy}-${mm}-${dd}`,
    displayDate: `${dd}/${mm}/${yyyy}`,
  };
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
      return { day, month, year, isValid: true, digits: extractDateDigits(day, month, year) };
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
      return { day, month, year, isValid: true, digits: extractDateDigits(day, month, year) };
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
      return { day, month, year, isValid: true, digits: extractDateDigits(day, month, year) };
    }
    // Check YYYYMMDD fallback if year is at start
    const yFallback = parseInt(trimmed.substring(0, 4), 10);
    const mFallback = parseInt(trimmed.substring(4, 6), 10);
    const dFallback = parseInt(trimmed.substring(6, 8), 10);
    if (isValidDateComponents(dFallback, mFallback, yFallback)) {
      return { day: dFallback, month: mFallback, year: yFallback, isValid: true, digits: extractDateDigits(dFallback, mFallback, yFallback) };
    }
    return null;
  }

  return null;
}

/**
 * Parses any date string and guarantees a non-null ParsedDate object with fallback.
 */
export function parseStandardDate(input: string | undefined | null): ParsedDate {
  const parsed = parseIndianDate(input);
  if (!parsed) {
    return { day: 1, month: 1, year: 1980, isValid: false, digits: [1, 9, 8, 0] };
  }
  return parsed;
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
