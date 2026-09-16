/**
 * LEOFAMILY VEDIC GRID / ADVANCED KUNDALI GRID ENGINE
 * Classical Indian Astro-Numerology Vedic Grid
 * Layout:
 * 3  1  9
 * 6  7  5
 * 2  8  4
 * Kept strictly separate from the standard Lo Shu Grid.
 */

export const VEDIC_GRID_POSITIONS: Record<number, { row: number; col: number; graha: string; domain: string }> = {
  3: { row: 1, col: 1, graha: 'Jupiter (Guru)', domain: 'Knowledge & Wisdom' },
  1: { row: 1, col: 2, graha: 'Sun (Surya)', domain: 'Soul & Authority' },
  9: { row: 1, col: 3, graha: 'Mars (Mangal)', domain: 'Courage & Action' },
  6: { row: 2, col: 1, graha: 'Venus (Shukra)', domain: 'Luxury & Creativity' },
  7: { row: 2, col: 2, graha: 'Ketu', domain: 'Spirituality & Liberation' },
  5: { row: 2, col: 3, graha: 'Mercury (Budha)', domain: 'Intellect & Trade' },
  2: { row: 3, col: 1, graha: 'Moon (Chandra)', domain: 'Mind & Emotions' },
  8: { row: 3, col: 2, graha: 'Saturn (Shani)', domain: 'Discipline & Karma' },
  4: { row: 3, col: 3, graha: 'Rahu', domain: 'Illusion & Material Ambition' }
};

export interface VedicGridAnalysis {
  matrix: number[][];
  digitCounts: Record<number, number>;
  presentDigits: number[];
  missingDigits: number[];
  aspects: {
    name: string;
    description: string;
    status: 'ACTIVE' | 'PARTIAL' | 'ABSENT';
  }[];
  vedicSynthesis: string;
}

export function buildVedicGrid(dobDigits: number[]): VedicGridAnalysis {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  dobDigits.forEach(d => {
    if (d >= 1 && d <= 9) {
      counts[d] = (counts[d] || 0) + 1;
    }
  });

  const presentDigits = Object.keys(counts).map(Number).filter(d => counts[d] > 0);
  const missingDigits = Object.keys(counts).map(Number).filter(d => counts[d] === 0);

  const matrix = [
    [counts[3] > 0 ? 3 : 0, counts[1] > 0 ? 1 : 0, counts[9] > 0 ? 9 : 0],
    [counts[6] > 0 ? 6 : 0, counts[7] > 0 ? 7 : 0, counts[5] > 0 ? 5 : 0],
    [counts[2] > 0 ? 2 : 0, counts[8] > 0 ? 8 : 0, counts[4] > 0 ? 4 : 0]
  ];

  // Vedic Triad Aspects
  const aspects = [
    {
      name: 'Dharma / Spiritual Axis (3-1-9)',
      description: 'Top horizontal row representing higher wisdom (3), sovereign authority (1), and courageous action (9).',
      status: (counts[3] > 0 && counts[1] > 0 && counts[9] > 0) ? ('ACTIVE' as const) : (counts[3] > 0 || counts[1] > 0 || counts[9] > 0) ? ('PARTIAL' as const) : ('ABSENT' as const)
    },
    {
      name: 'Artha / Wealth & Material Axis (6-7-5)',
      description: 'Central horizontal row representing artistic luxury (6), intuitive research (7), and commercial intelligence (5).',
      status: (counts[6] > 0 && counts[7] > 0 && counts[5] > 0) ? ('ACTIVE' as const) : (counts[6] > 0 || counts[7] > 0 || counts[5] > 0) ? ('PARTIAL' as const) : ('ABSENT' as const)
    },
    {
      name: 'Kama & Moksha / Grounding Axis (2-8-4)',
      description: 'Bottom horizontal row representing emotional mind (2), karmic discipline (8), and unorthodox expansion (4).',
      status: (counts[2] > 0 && counts[8] > 0 && counts[4] > 0) ? ('ACTIVE' as const) : (counts[2] > 0 || counts[8] > 0 || counts[4] > 0) ? ('PARTIAL' as const) : ('ABSENT' as const)
    }
  ];

  return {
    matrix,
    digitCounts: counts,
    presentDigits,
    missingDigits,
    aspects,
    vedicSynthesis: `Vedic chart reflects ${presentDigits.length} active planetary centers with prominent emphasis on ${presentDigits.slice(0, 3).map(d => VEDIC_GRID_POSITIONS[d]?.graha || d).join(', ')}.`
  };
}
