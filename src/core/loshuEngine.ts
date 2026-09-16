import { calculateDOBDigitCounts } from './numerologyEngine';
import { LOSHU_POSITIONS } from './methodologyConfig';

/**
 * Phase 5: Standard 3x3 Birth Grid
 * Contains ONLY the actual digits from day + month + year. Zeros are ignored.
 * Does NOT modify Birth Counts using Mulank or Bhagyank.
 */
export function buildBirthGrid(dob: string): Record<number, number> {
  return calculateDOBDigitCounts(dob);
}

/**
 * Backwards compatibility alias
 */
export const calculateBirthGrid = buildBirthGrid;

/**
 * Legacy enhanced grid function maintained for compatibility with earlier callers.
 * For full LeoFamily 3-layer methodology, use enhancedLoshuEngine.ts.
 */
export function calculateEnhancedGrid(dob: string, name?: string, gender: string = 'MALE'): Record<number, number> {
  const birthGrid = buildBirthGrid(dob);
  // Import calculateMulank and calculateBhagyank dynamically to prevent circular dependencies
  const { calculateMulank, calculateBhagyank } = require('./numerologyEngine');
  const driver = calculateMulank(dob);
  const conductor = calculateBhagyank(dob);

  const enhanced = { ...birthGrid };
  if (driver >= 1 && driver <= 9 && enhanced[driver] === 0) {
    enhanced[driver] = 1;
  }
  if (conductor >= 1 && conductor <= 9 && enhanced[conductor] === 0) {
    enhanced[conductor] = 1;
  }
  return enhanced;
}

export { LOSHU_POSITIONS };
