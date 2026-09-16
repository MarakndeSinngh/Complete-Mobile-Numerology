import { parseIndianDate } from '../utils/dateUtils';

/**
 * Reduce any integer to a single digit 1-9.
 * Strictly adheres to Indian/LeoFamily numerology (no master-number exceptions in core driver/conductor).
 */
export function reduceToDigit(num: number): number {
  if (isNaN(num) || num === 0) return 0;
  let current = Math.abs(Math.floor(num));
  while (current > 9) {
    let sum = 0;
    while (current > 0) {
      sum += current % 10;
      current = Math.floor(current / 10);
    }
    current = sum;
  }
  return current;
}

/**
 * Backwards compatibility alias for reduceToDigit
 */
export const reduceToSingleDigit = reduceToDigit;

/**
 * Preserves compound master numbers 11, 22, 33 if requested specifically for Western/Pythagorean checks.
 */
export function reduceWithMaster(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  return reduceToDigit(num);
}

/**
 * Sum all individual digits in a string or number
 */
export function sumDigits(strOrNum: string | number): number {
  const str = String(strOrNum).replace(/[^0-9]/g, '');
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += parseInt(str[i], 10);
  }
  return sum;
}

/**
 * Calculate Mulank (Driver Number): Derived solely from day of birth (1-31) reduced to 1-9.
 * Supports both DD/MM/YYYY and YYYY-MM-DD formats.
 */
export function calculateMulank(dob: string): number {
  if (!dob) return 1;
  const parsed = parseIndianDate(dob);
  if (parsed) {
    return reduceToDigit(parsed.day);
  }
  const clean = dob.trim();
  const parts = clean.split(/[-/]/);
  // If format is YYYY-MM-DD, day is index 2. If DD-MM-YYYY, day is index 0.
  const bDay = parts[0]?.length === 4 ? (parseInt(parts[2], 10) || 1) : (parseInt(parts[0], 10) || 1);
  return reduceToDigit(bDay);
}

/**
 * Backwards-compatibility alias: Driver = Mulank
 */
export const calculateDriver = calculateMulank;

/**
 * Calculate Bhagyank (Conductor / Destiny Number): Sum of all digits in full DOB reduced to 1-9.
 */
export function calculateBhagyank(dob: string): number {
  if (!dob) return 1;
  const dobDigitsStr = dob.replace(/[^0-9]/g, '');
  const sum = sumDigits(dobDigitsStr);
  return reduceToDigit(sum);
}

/**
 * Calculate initial compound number (unreduced sum)
 */
export function calculateCompoundNumber(numOrStr: string | number): number {
  return sumDigits(numOrStr);
}

/**
 * Calculate counts of physical digits 1-9 present in the DOB string.
 * Zeros are ignored for grid placement.
 */
export function calculateDOBDigitCounts(dob: string): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  if (!dob) return counts;
  const digits = dob.replace(/[^0-9]/g, '');
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    if (digit >= 1 && digit <= 9) {
      counts[digit]++;
    }
  }
  return counts;
}
