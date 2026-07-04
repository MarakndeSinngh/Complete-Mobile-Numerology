import { calculateDriver, calculateBhagyank } from './numerologyEngine';

export function calculateBirthGrid(dob: string): Record<number, number> {
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  if (!dob) return grid;
  const digits = dob.replace(/[^0-9]/g, '');
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    if (digit >= 1 && digit <= 9) {
      grid[digit]++;
    }
  }
  return grid;
}

export function calculateEnhancedGrid(dob: string, name: string, gender: string = 'MALE'): Record<number, number> {
  const birthGrid = calculateBirthGrid(dob);
  const driver = calculateDriver(dob);
  const conductor = calculateBhagyank(dob);

  const enhanced = { ...birthGrid };

  // Conditional additions as per the custom Lo Shu rules:
  // Add driver if it's not already in birthGrid, or increment
  if (driver >= 1 && driver <= 9) {
    if (enhanced[driver] === 0) {
      enhanced[driver] = 1;
    }
  }

  // Add conductor if it's not already in enhanced
  if (conductor >= 1 && conductor <= 9) {
    if (enhanced[conductor] === 0) {
      enhanced[conductor] = 1;
    }
  }

  return enhanced;
}
