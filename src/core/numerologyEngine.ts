import { reduceToSingleDigit, reduceWithMaster } from '../services/numerologyEngine';

export { reduceToSingleDigit, reduceWithMaster };

export function calculateDriver(dob: string): number {
  if (!dob) return 1;
  const parts = dob.split('-');
  const bDay = parseInt(parts[2], 10) || 1;
  return reduceToSingleDigit(bDay);
}

export function calculateBhagyank(dob: string): number {
  if (!dob) return 1;
  const dobDigitsStr = dob.replace(/[^0-9]/g, '');
  const sumAllDigits = dobDigitsStr.split('').map(d => parseInt(d, 10)).reduce((acc, v) => acc + v, 0);
  return reduceToSingleDigit(sumAllDigits);
}
