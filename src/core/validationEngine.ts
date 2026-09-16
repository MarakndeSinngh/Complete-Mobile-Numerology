import { calculateMulank, calculateBhagyank } from './numerologyEngine';
import { buildBirthGrid } from './loshuEngine';
import { buildEnhancedGrid } from './enhancedLoshuEngine';
import { calculatePlanes } from './planeEngine';

export function validateNumerologyCalculation(data: {
  driver: number;
  bhagyank: number;
  birthGrid: Record<number, number>;
  enhancedGrid: Record<number, number>;
  planesCount: number;
  arrowsCount: number;
  scores: Record<string, number>;
}): void {
  // Validate Driver
  if (typeof data.driver !== 'number' || data.driver < 1 || data.driver > 9) {
    throw new Error(`Validation Failure: Driver Number (${data.driver}) is out of bounds (must be between 1 and 9).`);
  }

  // Validate Bhagyank
  if (typeof data.bhagyank !== 'number' || data.bhagyank < 1 || data.bhagyank > 9) {
    throw new Error(`Validation Failure: Conductor/Bhagyank Number (${data.bhagyank}) is out of bounds (must be between 1 and 9).`);
  }

  // Validate Grids
  for (let d = 1; d <= 9; d++) {
    if (typeof data.birthGrid[d] !== 'number' || data.birthGrid[d] < 0) {
      throw new Error(`Validation Failure: Birth Grid contains invalid frequency count at Digit ${d}.`);
    }
    if (typeof data.enhancedGrid[d] !== 'number' || data.enhancedGrid[d] < 0) {
      throw new Error(`Validation Failure: Enhanced Grid contains invalid frequency count at Digit ${d}.`);
    }
  }

  // Validate Planes and Arrows counts
  if (data.planesCount !== 8) {
    throw new Error(`Validation Failure: Expected exactly 8 horizontal, vertical, and diagonal planes, but found ${data.planesCount}.`);
  }
  if (data.arrowsCount !== 12) {
    throw new Error(`Validation Failure: Expected exactly 12 master arrows, but found ${data.arrowsCount}.`);
  }

  // Validate Scores
  Object.entries(data.scores).forEach(([scoreKey, val]) => {
    if (typeof val !== 'number' || val < 0 || val > 100) {
      throw new Error(`Validation Failure: Score '${scoreKey}' value (${val}) is out of bounds (must be between 0 and 100).`);
    }
  });
}

/**
 * Phase 28: Regression Verification Test
 * Tests against the canonical regression profile:
 * DOB: 05/08/1983
 */
export function runPhase28RegressionTest(): { success: boolean; errors: string[]; report: Record<string, any> } {
  const testDob = '05/08/1983';
  const errors: string[] = [];

  const mulank = calculateMulank(testDob);
  if (mulank !== 5) {
    errors.push(`Mulank mismatch: expected 5, got ${mulank}`);
  }

  const bhagyank = calculateBhagyank(testDob);
  if (bhagyank !== 7) {
    errors.push(`Bhagyank mismatch: expected 7, got ${bhagyank}`);
  }

  const birthGrid = buildBirthGrid(testDob);
  const expectedBirth: Record<number, number> = { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 0, 7: 0, 8: 2, 9: 1 };
  for (let d = 1; d <= 9; d++) {
    if ((birthGrid[d] || 0) !== expectedBirth[d]) {
      errors.push(`Birth grid mismatch at ${d}: expected ${expectedBirth[d]}, got ${birthGrid[d] || 0}`);
    }
  }

  const enhanced = buildEnhancedGrid(birthGrid, mulank, bhagyank);
  const expectedEnhanced: Record<number, number> = { 1: 1, 2: 0, 3: 1, 4: 0, 5: 2, 6: 0, 7: 1, 8: 2, 9: 1 };
  for (let d = 1; d <= 9; d++) {
    if ((enhanced.flatGrid[d] || 0) !== expectedEnhanced[d]) {
      errors.push(`Enhanced grid mismatch at ${d}: expected ${expectedEnhanced[d]}, got ${enhanced.flatGrid[d] || 0}`);
    }
  }

  const planes = calculatePlanes(enhanced.flatGrid, birthGrid, mulank, bhagyank);
  const expectedPlanes: Record<string, string> = {
    'Mind Plane': 'PARTIAL',
    'Emotional Plane': 'COMPLETE',
    'Practical Plane': 'PARTIAL',
    'Thought Plane': 'PARTIAL',
    'Will Plane': 'COMPLETE',
    'Action Plane': 'PARTIAL',
    'Golden Success Yog': 'PARTIAL',
    'Silver Yog': 'PARTIAL'
  };

  planes.forEach(p => {
    const expected = expectedPlanes[p.name];
    if (expected && p.status !== expected) {
      errors.push(`Plane ${p.name} status mismatch: expected ${expected}, got ${p.status}`);
    }
  });

  return {
    success: errors.length === 0,
    errors,
    report: {
      dob: testDob,
      mulank,
      bhagyank,
      birthGrid,
      enhancedGrid: enhanced.flatGrid,
      planesSummary: planes.map(p => ({ name: p.name, status: p.status, present: p.presentDigits }))
    }
  };
}
