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
