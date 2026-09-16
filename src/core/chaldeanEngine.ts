import { reduceToDigit, sumDigits } from './numerologyEngine';
import { getCompoundDetails } from '../services/compoundDatabase';

/**
 * Phase 18: Authoritative Chaldean Numerology Engine
 * Standard Chaldean letter values (1 to 8; 9 is sacred and excluded from single letter assignment)
 */
export const CHALDEAN_LETTER_VALUES: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export interface ChaldeanNameAnalysis {
  name: string;
  compoundNumber: number;
  rootNumber: number;
  letterBreakdown: { letter: string; value: number }[];
  compoundMeaning: string;
  rootMeaning: string;
  title: string;
  prediction: string;
  positiveTraits: string[];
  negativeTraits: string[];
  ruler: string;
  driverCompatibility: {
    driver: number;
    isCompatible: boolean;
    rating: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'CHALLENGING';
    notes: string;
  };
}

export function calculateChaldeanNameSum(name: string): { compound: number; root: number; breakdown: { letter: string; value: number }[] } {
  if (!name) return { compound: 0, root: 0, breakdown: [] };
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let compound = 0;
  const breakdown: { letter: string; value: number }[] = [];

  for (let i = 0; i < clean.length; i++) {
    const letter = clean[i];
    const val = CHALDEAN_LETTER_VALUES[letter] || 0;
    compound += val;
    breakdown.push({ letter, value: val });
  }

  const root = reduceToDigit(compound);
  return { compound, root, breakdown };
}

export function analyzeChaldeanName(name: string, driver?: number): ChaldeanNameAnalysis {
  const { compound, root, breakdown } = calculateChaldeanNameSum(name);
  const compoundData = getCompoundDetails(compound);

  // Driver compatibility check
  const drv = driver || 1;
  let isCompatible = true;
  let rating: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'CHALLENGING' = 'GOOD';
  let notes = '';

  // Standard planetary compatibility for name root vs birth driver
  const friendlyCombos: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3],
    3: [1, 2, 3, 9],
    4: [5, 6, 7, 8],
    5: [1, 5, 6],
    6: [5, 6],
    7: [4, 5, 6],
    8: [5, 6],
    9: [1, 2, 3, 9]
  };

  const friends = friendlyCombos[drv] || [1, 5];
  if (root === drv || friends.includes(root)) {
    isCompatible = true;
    rating = root === drv || root === 1 || root === 5 ? 'EXCELLENT' : 'GOOD';
    notes = `Name vibration root ${root} harmonizes naturally with Driver ${drv}.`;
  } else if ([4, 8].includes(root) && [1, 2, 9].includes(drv)) {
    isCompatible = false;
    rating = 'CHALLENGING';
    notes = `Name vibration ${root} may create friction or delayed compounding with Driver ${drv}.`;
  } else {
    rating = 'NEUTRAL';
    notes = `Name root ${root} operates in a neutral capacity with Driver ${drv}.`;
  }

  return {
    name,
    compoundNumber: compound,
    rootNumber: root,
    letterBreakdown: breakdown,
    compoundMeaning: compoundData.meaning,
    rootMeaning: `Root number ${root} is governed by ${compoundData.ruler}.`,
    title: compoundData.title,
    prediction: compoundData.prediction,
    positiveTraits: compoundData.positiveTraits,
    negativeTraits: compoundData.negativeTraits,
    ruler: compoundData.ruler,
    driverCompatibility: {
      driver: drv,
      isCompatible,
      rating,
      notes
    }
  };
}

/**
 * Chaldean number for vehicle registration, house number, or business entity
 */
export function calculateChaldeanEntitySum(text: string): { compound: number; root: number } {
  if (!text) return { compound: 0, root: 0 };
  const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let compound = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char >= '0' && char <= '9') {
      compound += parseInt(char, 10);
    } else if (CHALDEAN_LETTER_VALUES[char]) {
      compound += CHALDEAN_LETTER_VALUES[char];
    }
  }

  const root = reduceToDigit(compound);
  return { compound, root };
}
