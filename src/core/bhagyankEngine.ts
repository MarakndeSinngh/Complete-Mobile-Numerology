import { NUMBER_PROFILES, ComprehensiveNumberProfile } from './numberMeaningEngine';
import { calculateBhagyank, calculateMulank } from './numerologyEngine';

export interface BhagyankAnalysis {
  bhagyank: number;
  title: string;
  graha: string;
  element: string;
  lifeDirection: string;
  longTermThemes: string[];
  majorOpportunities: string[];
  responsibilities: string[];
  careerDirection: string[];
  financialEvolution: string;
  relationshipLessons: string;
  growthThemes: string[];
  coreStrengths: string[];
  possibleChallenges: string[];
}

export function analyzeBhagyank(bhagyankOrDob: number | string): BhagyankAnalysis {
  const bhagyank = typeof bhagyankOrDob === 'string' ? calculateBhagyank(bhagyankOrDob) : bhagyankOrDob;
  const profile: ComprehensiveNumberProfile = NUMBER_PROFILES[bhagyank] || NUMBER_PROFILES[1];

  return {
    bhagyank,
    title: `Bhagyank ${bhagyank} — ${profile.grahaHi} Destiny Conduit`,
    graha: profile.grahaHi,
    element: profile.element,
    lifeDirection: profile.bhagyankMeaning,
    longTermThemes: [
      `Cultivating the highest octaves of ${profile.grahaEn}: ${profile.positiveTraits.slice(0, 3).join(', ')}`,
      `Overcoming inherent karmic shadow tendencies: ${profile.shadowTraits.slice(0, 2).join(', ')}`,
      `Mastering authority and service in ${profile.career.slice(0, 2).join(' and ')}`
    ],
    majorOpportunities: [
      `Natural elevation during personal years governed by ${profile.grahaEn}`,
      `Leadership recognition through ${profile.decisionMaking.toLowerCase()}`,
      `Commercial and wealth expansion via ${profile.wealth.toLowerCase()}`
    ],
    responsibilities: [
      `Fulfilling family and social obligations with ${profile.discipline.toLowerCase()}`,
      `Guiding others through your mastery of ${profile.balancedExpression.toLowerCase()}`
    ],
    careerDirection: profile.career,
    financialEvolution: profile.wealth,
    relationshipLessons: profile.relationships,
    growthThemes: [
      `Balancing instinctive desires with long-term destiny dharma`,
      `Integrating ${profile.element} elemental harmony`
    ],
    coreStrengths: profile.positiveTraits,
    possibleChallenges: profile.shadowTraits
  };
}

/**
 * Phase 12: Mulank + Bhagyank Synthesis Engine
 * Classifies relationship as harmonious | supportive | neutral | challenging | mixed
 */
export type CompatibilityClass = 'harmonious' | 'supportive' | 'neutral' | 'challenging' | 'mixed';

export interface MulankBhagyankSynthesis {
  mulank: number;
  bhagyank: number;
  relationship: CompatibilityClass;
  compatibilityScore: number;
  instinctiveNature: string; // How the personality wants to operate (Mulank)
  destinyTrajectory: string; // How the life path tends to develop (Bhagyank)
  dynamicTension: string;
  integrationAdvice: string;
  summary: string;
}

// Vedic planetary friendship matrix
const PLANETARY_FRIENDSHIP: Record<number, { friends: number[]; neutral: number[]; enemies: number[] }> = {
  1: { friends: [1, 2, 3, 9], neutral: [5], enemies: [4, 6, 7, 8] },
  2: { friends: [1, 2, 3], neutral: [4, 7, 8, 9], enemies: [5, 6] },
  3: { friends: [1, 2, 3, 9], neutral: [8], enemies: [4, 5, 6, 7] },
  4: { friends: [5, 6, 7, 8], neutral: [3], enemies: [1, 2, 9] },
  5: { friends: [1, 4, 5, 6], neutral: [3, 7, 8, 9], enemies: [2] },
  6: { friends: [4, 5, 6, 7, 8], neutral: [3, 9], enemies: [1, 2] },
  7: { friends: [4, 5, 6], neutral: [2, 3, 7, 8], enemies: [1, 9] },
  8: { friends: [4, 5, 6, 8], neutral: [3, 7], enemies: [1, 2, 9] },
  9: { friends: [1, 2, 3, 9], neutral: [5], enemies: [4, 6, 7, 8] }
};

export function calculateMulankBhagyankRelationship(
  mulankOrDob: number | string,
  bhagyankOrDob?: number | string
): MulankBhagyankSynthesis {
  let mulank: number;
  let bhagyank: number;

  if (typeof mulankOrDob === 'string' && bhagyankOrDob === undefined) {
    mulank = calculateMulank(mulankOrDob);
    bhagyank = calculateBhagyank(mulankOrDob);
  } else {
    mulank = typeof mulankOrDob === 'string' ? calculateMulank(mulankOrDob) : mulankOrDob;
    bhagyank = typeof bhagyankOrDob === 'string' ? calculateBhagyank(bhagyankOrDob) : (bhagyankOrDob || 1);
  }

  const pMulank = NUMBER_PROFILES[mulank] || NUMBER_PROFILES[1];
  const pBhagyank = NUMBER_PROFILES[bhagyank] || NUMBER_PROFILES[1];

  let relationship: CompatibilityClass = 'neutral';
  let score = 70;

  if (mulank === bhagyank) {
    relationship = 'harmonious';
    score = 95;
  } else {
    const mFriendship = PLANETARY_FRIENDSHIP[mulank] || { friends: [], neutral: [], enemies: [] };
    const isFriend = mFriendship.friends.includes(bhagyank);
    const isNeutral = mFriendship.neutral.includes(bhagyank);
    const isEnemy = mFriendship.enemies.includes(bhagyank);

    if (isFriend) {
      relationship = 'harmonious';
      score = 90;
    } else if (isNeutral) {
      relationship = 'supportive';
      score = 75;
    } else if (isEnemy) {
      relationship = 'challenging';
      score = 55;
    } else {
      relationship = 'mixed';
      score = 65;
    }
  }

  const instinctiveNature = `Driven by Mulank ${mulank} (${pMulank.grahaHi}): Your instinctive impulse is to operate with ${pMulank.positiveTraits.slice(0, 3).join(', ')}. In everyday interactions, you lead with ${pMulank.thinkingStyle.toLowerCase()}`;
  const destinyTrajectory = `Governed by Bhagyank ${bhagyank} (${pBhagyank.grahaHi}): Your broader life path steers you into situations demanding ${pBhagyank.positiveTraits.slice(0, 3).join(', ')}. Long-term success emerges through ${pBhagyank.bhagyankMeaning.toLowerCase()}`;

  let dynamicTension = '';
  let integrationAdvice = '';

  if (relationship === 'harmonious') {
    dynamicTension = 'High natural synergy: Your immediate desires and your ultimate destiny march in lockstep.';
    integrationAdvice = `Channel the combined vitality of ${pMulank.grahaEn} and ${pBhagyank.grahaEn} into decisive, visionary projects.`;
  } else if (relationship === 'supportive') {
    dynamicTension = 'Constructive complement: Minor adjustments required between personal impulse and external circumstances.';
    integrationAdvice = `Allow your Mulank ${mulank} actions to patiently serve your Bhagyank ${bhagyank} overarching objectives.`;
  } else if (relationship === 'challenging') {
    dynamicTension = `Elemental friction between ${pMulank.grahaEn} (Driver) and ${pBhagyank.grahaEn} (Destiny). You may feel internal conflict between what you impulsively desire and where life repeatedly steers you.`;
    integrationAdvice = `Recognize that your Mulank (${mulank}) is the vehicle, but your Bhagyank (${bhagyank}) is the destination. Consciously adopt ${pBhagyank.balancedExpression.toLowerCase()} to avoid friction.`;
  } else {
    dynamicTension = 'Dynamic multi-faceted flow: Balance between rapid personal action and measured karmic pacing.';
    integrationAdvice = `Embrace flexibility; alternate between the active drive of ${pMulank.grahaEn} and the wisdom lessons of ${pBhagyank.grahaEn}.`;
  }

  const summary = `Within the LeoFamily numerology framework, your Mulank ${mulank} (${pMulank.grahaEn}) and Bhagyank ${bhagyank} (${pBhagyank.grahaEn}) share a ${relationship.toUpperCase()} (${score}/100) dynamic alignment.`;

  return {
    mulank,
    bhagyank,
    relationship,
    compatibilityScore: score,
    instinctiveNature,
    destinyTrajectory,
    dynamicTension,
    integrationAdvice,
    summary
  };
}
