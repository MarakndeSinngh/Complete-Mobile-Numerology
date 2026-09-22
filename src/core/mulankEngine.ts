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
    title: `मूलांक (Mulank) ${mulank} — ${profile.grahaHi} का स्वाभाविक स्वभाव`,
    graha: profile.grahaHi,
    element: profile.element,
    naturalPersonality: profile.personality,
    instinctiveBehaviour: `मुख्य रूप से ${profile.positiveTraits.slice(0, 3).join(', ')} के साथ कार्य करते हैं। जीवन की चुनौतियों में आपकी सोच ${profile.thinkingStyle.toLowerCase()} की ओर स्वाभाविक रूप से झुकती है।`,
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
      `${profile.element} तत्व के अनुकूल स्वतंत्र और प्रभावशाली वातावरण`,
      `${profile.grahaHi} के स्वाभाविक नेतृत्व और सम्मान के अनुकूल कार्यक्षेत्र`,
      `प्रमुख कार्यक्षेत्र जैसे ${profile.career.slice(0, 2).join(', ')}`
    ],
    traditionalSupportivePractices: [
      profile.remedialTheme,
      `${profile.grahaHi} के अनुकूल समय में वैदिक मंत्र का शांत मन से जप`,
      `महत्वपूर्ण कार्यों में शुभ दिशा और अनुकूल दिन का ध्यान रखना`
    ]
  };
}
