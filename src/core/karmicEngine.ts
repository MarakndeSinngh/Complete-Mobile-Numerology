/**
 * LEOFAMILY KARMIC NUMBER ENGINE
 * Identifies Karmic Debt Numbers (13, 14, 16, 19) and Karmic Lessons
 * Stored distinctly from missing numbers.
 */

export interface KarmicDebtPattern {
  number: number;
  title: string;
  source: string; // e.g. 'Day of Birth 13' | 'Compound Sum 14'
  lesson: string;
  behaviour: string;
  growthOpportunity: string;
  practicalAction: string;
  traditionalRemedy: string;
}

export interface KarmicAnalysisResult {
  hasKarmicDebt: boolean;
  karmicDebts: KarmicDebtPattern[];
  karmicLessons: string[];
  summary: string;
}

const KARMIC_DEBT_DEFINITIONS: Record<number, Omit<KarmicDebtPattern, 'source'>> = {
  13: {
    number: 13,
    title: 'Karmic Debt 13/4: The Test of Focused Perseverance',
    lesson: 'Mastering systematic effort, overcoming the urge to take shortcuts, and building permanent foundations.',
    behaviour: 'Tendency to feel that one works twice as hard as peers for the same recognition, leading to temporary frustration.',
    growthOpportunity: 'Developing supreme personal discipline, attention to routine details, and unwavering focus.',
    practicalAction: 'Do not abandon projects midway; finish every started task with methodical attention.',
    traditionalRemedy: 'Feed stray dogs on Saturdays; chant OM RAHAVE NAMAH; organize your workspace.'
  },
  14: {
    number: 14,
    title: 'Karmic Debt 14/5: The Test of Temperance & Freedom',
    lesson: 'Balancing personal liberty with self-restraint; avoiding sensory extremes or sudden impulses.',
    behaviour: 'Restlessness, sudden changes in life trajectory, vulnerability to escapism or over-indulgence under stress.',
    growthOpportunity: 'Mastering emotional self-regulation, steady commitments, and cultivating consistent routines.',
    practicalAction: 'Maintain an anchored daily meditation and avoid radical impulsive lifestyle pivots.',
    traditionalRemedy: 'Feed green grass to cows on Wednesdays; practice mindfulness during meals.'
  },
  16: {
    number: 16,
    title: 'Karmic Debt 16/7: The Awakening from Ego & Illusion',
    lesson: 'Transcending superficial vanity, intellectual arrogance, or dogmatic control to discover authentic spiritual truth.',
    behaviour: 'Vulnerability to sudden unexpected disruptions that shatter pride, forcing deep inner soul searching.',
    growthOpportunity: 'Developing profound humility, emotional vulnerability, and unshakeable spiritual faith.',
    practicalAction: 'Embrace life transitions with grace; treat others with genuine unconditional empathy.',
    traditionalRemedy: 'Worship Lord Ganesha; practice daily silent prayer; wear silver ring.'
  },
  19: {
    number: 19,
    title: 'Karmic Debt 19/1: The Test of Interdependent Leadership',
    lesson: 'Learning to seek and accept support from others; overcoming the illusion of total self-sufficiency.',
    behaviour: 'Reluctance to ask for assistance, stubborn solitary burden-bearing, feeling misunderstood by subordinates.',
    growthOpportunity: 'Transforming into an inspiring collaborative leader who empowers team members.',
    practicalAction: 'Delegate responsibilities actively; thank colleagues openly and celebrate collective victories.',
    traditionalRemedy: 'Offer fresh water to the rising Sun (Surya Arghya); serve needy elders on Sundays.'
  }
};

export function analyzeKarmicPatterns(day: number, compoundDay: number, compoundDOB: number): KarmicAnalysisResult {
  const karmicDebts: KarmicDebtPattern[] = [];

  // Check day of birth
  if (day in KARMIC_DEBT_DEFINITIONS) {
    const def = KARMIC_DEBT_DEFINITIONS[day];
    karmicDebts.push({
      ...def,
      source: `Birth Day (${day})`
    });
  }

  // Check compound DOB sum
  if (compoundDOB in KARMIC_DEBT_DEFINITIONS && !karmicDebts.some(k => k.number === compoundDOB)) {
    const def = KARMIC_DEBT_DEFINITIONS[compoundDOB];
    karmicDebts.push({
      ...def,
      source: `Compound Destiny Sum (${compoundDOB})`
    });
  }

  const karmicLessons: string[] = karmicDebts.map(k => k.lesson);
  if (karmicDebts.length === 0) {
    karmicLessons.push('No primary karmic debt detected (13, 14, 16, 19). Karmic path is governed by balanced Mulank-Bhagyank progression.');
  }

  return {
    hasKarmicDebt: karmicDebts.length > 0,
    karmicDebts,
    karmicLessons,
    summary: karmicDebts.length > 0
      ? `Chart presents ${karmicDebts.length} active karmic developmental cycle(s) (${karmicDebts.map(k => k.number).join(', ')}). Conscious remediation yields profound maturity.`
      : 'Chart is free from severe classical karmic debts. Evolutionary growth is supported through standard planetary harmony.'
  };
}
