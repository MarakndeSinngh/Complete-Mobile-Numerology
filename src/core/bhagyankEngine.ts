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
    title: `भाग्यांक (Bhagyank) ${bhagyank} — ${profile.grahaHi} जीवन पथ एवं भाग्य`,
    graha: profile.grahaHi,
    element: profile.element,
    lifeDirection: profile.bhagyankMeaning,
    longTermThemes: [
      `${profile.grahaHi} के सर्वश्रेष्ठ गुणों का विकास: ${profile.positiveTraits.slice(0, 3).join(', ')}`,
      `स्वभाव की संभावित कमजोरियों पर नियंत्रण: ${profile.shadowTraits.slice(0, 2).join(', ')}`,
      `${profile.career.slice(0, 2).join(' और ')} में विशेषज्ञता व सेवा का भाव`
    ],
    majorOpportunities: [
      `${profile.grahaHi} द्वारा शासित वर्षों व समय में स्वाभाविक उन्नति`,
      `${profile.decisionMaking} द्वारा मान-सम्मान व पहचान`,
      `${profile.wealth} के माध्यम से आर्थिक स्थिरता व विस्तार`
    ],
    responsibilities: [
      `पारिवारिक और सामाजिक उत्तरदायित्वों का अनुशासन के साथ निर्वहन`,
      `${profile.balancedExpression} द्वारा दूसरों का मार्गदर्शन`
    ],
    careerDirection: profile.career,
    financialEvolution: profile.wealth,
    relationshipLessons: profile.relationships,
    growthThemes: [
      `दैनिक इच्छाओं और दीर्घकालिक जीवन ध्येय (Dharma) में संतुलन`,
      `${profile.element} तत्व की ऊर्जा का सामंजस्य`
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

  const instinctiveNature = `मूलांक ${mulank} (${pMulank.grahaHi}): आपका स्वाभाविक स्वभाव ${pMulank.positiveTraits.slice(0, 3).join(', ')} के साथ कार्य करने का है। दैनिक जीवन में आप ${pMulank.thinkingStyle.toLowerCase()} के साथ आगे बढ़ते हैं।`;
  const destinyTrajectory = `भाग्यांक ${bhagyank} (${pBhagyank.grahaHi}): आपका जीवन पथ आपको ऐसे अवसरों की ओर ले जाता है जहां ${pBhagyank.positiveTraits.slice(0, 3).join(', ')} की आवश्यकता होती है। दीर्घकालिक सफलता ${pBhagyank.bhagyankMeaning.toLowerCase()} से मिलती है।`;

  let dynamicTension = '';
  let integrationAdvice = '';

  if (relationship === 'harmonious') {
    dynamicTension = 'उत्कृष्ट प्राकृतिक तालमेल: आपकी स्वाभाविक इच्छाएं और आपका भाग्य एक ही दिशा में साथ-साथ चलते हैं।';
    integrationAdvice = `${pMulank.grahaHi} और ${pBhagyank.grahaHi} की सम्मिलित ऊर्जा को बड़े और दूरदर्शी प्रोजेक्ट्स में लगाएं।`;
  } else if (relationship === 'supportive') {
    dynamicTension = 'रचनात्मक सहयोग: व्यक्तिगत इच्छाओं और बाहरी परिस्थितियों के बीच थोड़े से तालमेल की आवश्यकता होती है।';
    integrationAdvice = `मूलांक ${mulank} के उत्साह को धैर्यपूर्वक भाग्यांक ${bhagyank} के मुख्य लक्ष्यों की पूर्ति में लगाएं।`;
  } else if (relationship === 'challenging') {
    dynamicTension = `${pMulank.grahaHi} (मूलांक/ड्राइवर) और ${pBhagyank.grahaHi} (भाग्यांक/कंडक्टर) के बीच ऊर्जा का अंतर। कभी-कभी मन की इच्छा और जीवन की परिस्थितियों में द्वंद्व महसूस हो सकता है।`;
    integrationAdvice = `ध्यान रखें कि मूलांक (${mulank}) आपका वाहन है और भाग्यांक (${bhagyank}) आपकी मंजिल। दोनों में सामंजस्य बनाए रखें और संतुलित मार्ग चुनें।`;
  } else {
    dynamicTension = 'बहुआयामी ऊर्जा: व्यक्तिगत सक्रियता और समय की चाल के बीच संतुलन बनाए रखने की आवश्यकता।';
    integrationAdvice = `लचीला रुख अपनाएं; ${pMulank.grahaHi} के उत्साह और ${pBhagyank.grahaHi} की सीख का सुंदर समन्वय करें।`;
  }

  const relLabel = relationship === 'harmonious' ? 'मित्रवत व शुभ' : relationship === 'supportive' ? 'सहयोगात्मक' : relationship === 'challenging' ? 'संवेदनशील व चुनौतीपूर्ण' : 'मिश्रित';
  const summary = `LeoFamily वैदिक अंकशास्त्र के अनुसार, आपका मूलांक ${mulank} (${pMulank.grahaHi}) और भाग्यांक ${bhagyank} (${pBhagyank.grahaHi}) आपस में ${relLabel} (${score}/100) संबंध साझा करते हैं।`;

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
