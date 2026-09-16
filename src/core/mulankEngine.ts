import { NUMBER_PROFILES, ComprehensiveNumberProfile } from './numberMeaningEngine';
import { calculateMulank } from './numerologyEngine';

export interface MulankAnalysis {
  mulank: number;
  title: string;
  graha: string;
  element: string;
  naturalPersonality: string;
  instinctiveBehaviour: string;
  leadershipStyle: string;
  relationshipApproach: string;
  communicationStyle: string;
  careerAptitude: string[];
  businessMindset: string;
  wealthOrientation: string;
  emotionalExpression: string;
  keyStrengths: string[];
  possibleChallenges: string[];
  suitableEnvironments: string[];
  traditionalSupportivePractices: string[];
}

export function analyzeMulank(mulankOrDob: number | string): MulankAnalysis {
  const mulank = typeof mulankOrDob === 'string' ? calculateMulank(mulankOrDob) : mulankOrDob;
  const profile: ComprehensiveNumberProfile = NUMBER_PROFILES[mulank] || NUMBER_PROFILES[1];

  return {
    mulank,
    title: `Mulank ${mulank} — ${profile.grahaHi} Sovereign Impulse`,
    graha: profile.grahaHi,
    element: profile.element,
    naturalPersonality: profile.personality,
    instinctiveBehaviour: `Instinctively acts with ${profile.positiveTraits.slice(0, 3).join(', ')}. Tends to respond to challenges via ${profile.thinkingStyle.toLowerCase()}`,
    leadershipStyle: profile.leadership,
    relationshipApproach: profile.relationships,
    communicationStyle: profile.communication,
    careerAptitude: profile.career,
    businessMindset: profile.business,
    wealthOrientation: profile.wealth,
    emotionalExpression: profile.emotionalStyle,
    keyStrengths: profile.positiveTraits,
    possibleChallenges: profile.shadowTraits,
    suitableEnvironments: [
      `High-autonomy spaces aligned with ${profile.element} element`,
      `Collaborative arenas that honor ${profile.grahaEn}'s natural leadership rhythm`,
      `Professional sectors such as ${profile.career.slice(0, 2).join(', ')}`
    ],
    traditionalSupportivePractices: [
      profile.remedialTheme,
      `Chant planetary mantra during the active hour of ${profile.grahaEn}`,
      `Align key initiatives with planetary day: ${NUMBER_PROFILES[mulank].travel}`
    ]
  };
}
