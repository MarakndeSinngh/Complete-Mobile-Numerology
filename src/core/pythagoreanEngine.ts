import { reduceToDigit, reduceWithMaster } from './numerologyEngine';

/**
 * Phase 19: Pythagorean Numerology Engine (Western System)
 * Letters mapped 1 to 9 sequentially:
 * 1: A, J, S
 * 2: B, K, T
 * 3: C, L, U
 * 4: D, M, V
 * 5: E, N, W
 * 6: F, O, X
 * 7: G, P, Y
 * 8: H, Q, Z
 * 9: I, R
 */
export const PYTHAGOREAN_LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export interface PythagoreanNameAnalysis {
  system: 'PYTHAGOREAN';
  name: string;
  totalSum: number;
  expressionNumber: number;
  masterNumber?: number;
  letterBreakdown: { letter: string; value: number }[];
  vowelSum: number; // Soul Urge / Heart's Desire
  consonantSum: number; // Personality Number
  description: string;
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export function calculatePythagoreanName(name: string): PythagoreanNameAnalysis {
  if (!name) {
    return {
      system: 'PYTHAGOREAN',
      name: '',
      totalSum: 0,
      expressionNumber: 0,
      letterBreakdown: [],
      vowelSum: 0,
      consonantSum: 0,
      description: 'Empty name provided.'
    };
  }

  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let totalSum = 0;
  let vowelTotal = 0;
  let consonantTotal = 0;
  const letterBreakdown: { letter: string; value: number }[] = [];

  for (let i = 0; i < clean.length; i++) {
    const letter = clean[i];
    const val = PYTHAGOREAN_LETTER_VALUES[letter] || 0;
    totalSum += val;
    letterBreakdown.push({ letter, value: val });

    if (VOWELS.has(letter)) {
      vowelTotal += val;
    } else {
      consonantTotal += val;
    }
  }

  const expressionNumber = reduceToDigit(totalSum);
  const masterCheck = reduceWithMaster(totalSum);
  const masterNumber = [11, 22, 33].includes(masterCheck) ? masterCheck : undefined;

  const vowelSum = reduceToDigit(vowelTotal);
  const consonantSum = reduceToDigit(consonantTotal);

  const descriptions: Record<number, string> = {
    1: 'Expression 1: The Natural Leader and Pioneer driven by originality and independence.',
    2: 'Expression 2: The Diplomat and Peacemaker who builds bridges through empathy and collaboration.',
    3: 'Expression 3: The Creative Communicator and Optimist endowed with artistic expression.',
    4: 'Expression 4: The Master Builder and Systematizer who builds solid, durable structures.',
    5: 'Expression 5: The Free Spirit and Catalyst of Progressive Change.',
    6: 'Expression 6: The Nurturer, Healer, and Protector of community and aesthetic harmony.',
    7: 'Expression 7: The Seeker of Truth, Philosopher, and Analytical Scholar.',
    8: 'Expression 8: The Executive Authority, Visionary Investor, and Manifestor of abundance.',
    9: 'Expression 9: The Global Humanitarian and Compassionate Completer of Cycles.'
  };

  return {
    system: 'PYTHAGOREAN',
    name,
    totalSum,
    expressionNumber,
    masterNumber,
    letterBreakdown,
    vowelSum,
    consonantSum,
    description: descriptions[expressionNumber] || descriptions[1]
  };
}
