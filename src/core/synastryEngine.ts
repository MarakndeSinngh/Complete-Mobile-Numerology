import { formatDateForDisplay, formatDateForStorage } from './dateUtils';
import { calculateMulank, calculateBhagyank } from './numerologyEngine';
import { buildBirthGrid } from './loshuEngine';
import { buildEnhancedGrid } from './enhancedLoshuEngine';
import { calculatePlanes } from './planeEngine';
import { calculateArrows } from './arrowEngine';
import { analyzeChaldeanName } from './chaldeanEngine';
import { calculatePythagoreanName } from './pythagoreanEngine';
import { NUMBER_PROFILES, ComprehensiveNumberProfile } from './numberMeaningEngine';

export interface SynastryPersonInput {
  name: string;
  dob: string; // "DD/MM/YYYY" or "YYYY-MM-DD"
  mobile?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface PersonProfileSummary {
  name: string;
  dob: string;
  standardDOB: string;
  mulank: number;
  mulankGraha: string;
  bhagyank: number;
  bhagyankGraha: string;
  chaldeanNameNumber: number;
  pythagoreanNameNumber: number;
  birthGrid: Record<number, number>;
  enhancedGrid: Record<number, number>;
  missingNumbers: number[];
  repeatedNumbers: { digit: number; count: number }[];
  activePlanes: string[];
  activeArrows: string[];
  mobileNumber?: string;
  mobileCompound?: number;
  mobileReduced?: number;
}

export interface LayerAnalysis {
  title: string;
  titleHi: string;
  score: number;
  classification: 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING';
  classificationHi: string;
  explanationHi: string;
  explanationEn: string;
  keyInsightsHi: string[];
  practicalTipsHi: string[];
}

export interface CrossSynthesisAnalysis {
  mulankVsBhagyankAtoB: {
    score: number;
    explanationHi: string;
  };
  mulankVsBhagyankBtoA: {
    score: number;
    explanationHi: string;
  };
  synthesisHi: string;
}

export interface LoShuCrossAnalysis {
  gridA: Record<number, number>;
  gridB: Record<number, number>;
  complementaryNumbersAtoB: number[]; // Numbers A has that B is missing
  complementaryNumbersBtoA: number[]; // Numbers B has that A is missing
  sharedStrengths: number[];
  sharedMissing: number[];
  crossGridSynergyHi: string;
  remedialBalanceHi: string;
}

export interface PlaneCrossAnalysis {
  planes: {
    name: string;
    nameHi: string;
    numbers: number[];
    personAActive: boolean;
    personBActive: boolean;
    dynamicHi: string;
  }[];
}

export interface ArrowCrossAnalysis {
  arrows: {
    name: string;
    nameHi: string;
    numbers: number[];
    personAActive: boolean;
    personBActive: boolean;
    resonanceHi: string;
  }[];
}

export interface LifeAspectsAnalysis {
  emotional: LayerAnalysis;
  communication: LayerAnalysis;
  trustAndCommitment: LayerAnalysis;
  conflictStyle: LayerAnalysis;
  marriageExpectations: {
    personAExpectationsHi: string;
    personBExpectationsHi: string;
    alignmentHi: string;
  };
  partnerExpectations: {
    personASeeksHi: string;
    personBSeeksHi: string;
    balanceHi: string;
  };
  familyCompatibility: LayerAnalysis;
  financialCompatibility: LayerAnalysis;
  careerInteraction: LayerAnalysis;
}

export interface RelationshipRemedies {
  dailyRoutinesHi: string[];
  auspiciousColors: string[];
  auspiciousDates: number[];
  communicationRemedyHi: string;
  traditionalVastuHi: string;
  traditionalDaanHi: string;
  gemstoneComplementHi: string;
}

export interface SynastrySummary {
  strongestCommonAreaHi: string;
  complementaryAreaHi: string;
  communicationKeyHi: string;
  emotionalKeyHi: string;
  trustKeyHi: string;
  practicalChallengeHi: string;
  traditionalGuidanceHi: string;
}

export interface MarriageCompatibilityReport {
  id: string;
  calculatedAt: string;
  personA: PersonProfileSummary;
  personB: PersonProfileSummary;
  overallHarmonyScore: number;
  stabilityVerdictHi: string;
  sevenLayers: {
    personality: LayerAnalysis;
    emotional: LayerAnalysis;
    communication: LayerAnalysis;
    trust: LayerAnalysis;
    conflict: LayerAnalysis;
    marriageExpectations: LayerAnalysis;
    overallHarmony: LayerAnalysis;
  };
  mulankAnalysis: LayerAnalysis;
  bhagyankAnalysis: LayerAnalysis;
  crossSynthesis: CrossSynthesisAnalysis;
  nameAnalysis: {
    chaldean: LayerAnalysis;
    pythagorean?: LayerAnalysis;
  };
  loShuAnalysis: LoShuCrossAnalysis;
  planeAnalysis: PlaneCrossAnalysis;
  arrowAnalysis: ArrowCrossAnalysis;
  lifeAspects: LifeAspectsAnalysis;
  remedies: RelationshipRemedies;
  summary: SynastrySummary;
  disclaimer: string;
}

// Planetary affinity table based on classical Vedic & Chaldean numerology
// 10 = Mitra (Highly Supportive), 8 = Friendly, 6 = Neutral (Sama), 4 = Challenging (Shatru), 2 = High Friction
const PLANETARY_SYNASTRY_MATRIX: Record<number, Record<number, number>> = {
  1: { 1: 8.5, 2: 8.0, 3: 9.5, 4: 7.0, 5: 8.0, 6: 6.0, 7: 7.0, 8: 4.5, 9: 9.5 },
  2: { 1: 8.0, 2: 8.5, 3: 8.0, 4: 5.5, 5: 7.0, 6: 7.5, 7: 9.0, 8: 5.0, 9: 7.0 },
  3: { 1: 9.5, 2: 8.0, 3: 9.0, 4: 6.0, 5: 7.5, 6: 5.0, 7: 8.0, 8: 6.0, 9: 9.5 },
  4: { 1: 7.0, 2: 5.5, 3: 6.0, 4: 8.5, 5: 8.0, 6: 8.0, 7: 8.0, 8: 8.0, 9: 5.5 },
  5: { 1: 8.0, 2: 7.0, 3: 7.5, 4: 8.0, 5: 9.5, 6: 9.0, 7: 7.5, 8: 7.0, 9: 6.5 },
  6: { 1: 6.0, 2: 7.5, 3: 5.0, 4: 8.0, 5: 9.0, 6: 9.5, 7: 8.0, 8: 7.5, 9: 7.0 },
  7: { 1: 7.0, 2: 9.0, 3: 8.0, 4: 8.0, 5: 7.5, 6: 8.0, 7: 9.0, 8: 6.0, 9: 6.5 },
  8: { 1: 4.5, 2: 5.0, 3: 6.0, 4: 8.0, 5: 7.0, 6: 7.5, 7: 6.0, 8: 8.5, 9: 5.0 },
  9: { 1: 9.5, 2: 7.0, 3: 9.5, 4: 5.5, 5: 6.5, 6: 7.0, 7: 6.5, 8: 5.0, 9: 9.0 }
};

function getClassification(score: number): { cls: 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING'; clsHi: string } {
  if (score >= 75) return { cls: 'SUPPORTIVE', clsHi: 'अति अनुकूल एवं सहयोगी (Supportive)' };
  if (score >= 55) return { cls: 'NEUTRAL', clsHi: 'संतुलित एवं सामान्य (Neutral / Balanced)' };
  return { cls: 'CHALLENGING', clsHi: 'आपसी समझ एवं प्रयास अपेक्षित (Requires Conscious Effort)' };
}

function extractProfile(input: SynastryPersonInput, defaultGender: 'MALE' | 'FEMALE' = 'MALE'): PersonProfileSummary {
  const stdDOB = formatDateForDisplay(input.dob) || input.dob;
  const mulank = calculateMulank(stdDOB);
  const bhagyank = calculateBhagyank(stdDOB);
  const mulankProf: ComprehensiveNumberProfile = NUMBER_PROFILES[mulank] || NUMBER_PROFILES[1];
  const bhagyankProf: ComprehensiveNumberProfile = NUMBER_PROFILES[bhagyank] || NUMBER_PROFILES[1];
  
  const chaldean = analyzeChaldeanName(input.name);
  const pythagorean = calculatePythagoreanName(input.name);
  
  const birthGrid = buildBirthGrid(stdDOB);
  const enhancedResult = buildEnhancedGrid(birthGrid, mulank, bhagyank);
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => (birthGrid[d] || 0) === 0);
  const repeated = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => (birthGrid[d] || 0) > 1);
  
  const planesResult = calculatePlanes(enhancedResult.flatGrid, birthGrid, mulank, bhagyank);
  const planes = planesResult.filter(p => p.status === 'COMPLETE' || p.status === 'FULL').map(p => p.title);
  const arrowsResult = calculateArrows(enhancedResult.flatGrid);
  const arrows = arrowsResult.filter(a => a.isActive).map(a => a.name);

  return {
    name: input.name || 'Partner',
    dob: input.dob,
    standardDOB: stdDOB,
    mulank,
    mulankGraha: mulankProf.grahaHi,
    bhagyank,
    bhagyankGraha: bhagyankProf.grahaHi,
    chaldeanNameNumber: chaldean.compoundNumber,
    pythagoreanNameNumber: pythagorean.expressionNumber,
    birthGrid,
    enhancedGrid: enhancedResult.flatGrid,
    missingNumbers: missing,
    repeatedNumbers: repeated.map(d => ({ digit: d, count: birthGrid[d] || 2 })),
    activePlanes: planes,
    activeArrows: arrows,
    mobileNumber: input.mobile
  };
}

export function generateSynastryReport(
  personAInput: SynastryPersonInput,
  personBInput: SynastryPersonInput
): MarriageCompatibilityReport {
  const personA = extractProfile(personAInput, 'MALE');
  const personB = extractProfile(personBInput, 'FEMALE');

  const pA_M = personA.mulank;
  const pB_M = personB.mulank;
  const pA_B = personA.bhagyank;
  const pB_B = personB.bhagyank;

  const mProfA: ComprehensiveNumberProfile = NUMBER_PROFILES[pA_M] || NUMBER_PROFILES[1];
  const mProfB: ComprehensiveNumberProfile = NUMBER_PROFILES[pB_M] || NUMBER_PROFILES[1];
  const bProfA: ComprehensiveNumberProfile = NUMBER_PROFILES[pA_B] || NUMBER_PROFILES[1];
  const bProfB: ComprehensiveNumberProfile = NUMBER_PROFILES[pB_B] || NUMBER_PROFILES[1];

  // 1. Mulank Compatibility (Personality / Core Nature)
  const mulankRaw = PLANETARY_SYNASTRY_MATRIX[pA_M]?.[pB_M] || 6.5;
  const mulankScore = Math.round(mulankRaw * 10);
  const mulankCls = getClassification(mulankScore);
  const mulankAnalysis: LayerAnalysis = {
    title: 'Mulank (Driver) Compatibility',
    titleHi: 'मूलांक सामंजस्य (दैनिक स्वभाव एवं व्यक्तित्व)',
    score: mulankScore,
    classification: mulankCls.cls,
    classificationHi: mulankCls.clsHi,
    explanationHi: `${personA.name} का मूलांक ${pA_M} (${personA.mulankGraha}) है और ${personB.name} का मूलांक ${pB_M} (${personB.mulankGraha}) है। मूलांक व्यक्ति के तात्कालिक स्वभाव, आदतों और निर्णय लेने के तरीके को दर्शाता है। इस न्यूमेरोलॉजी प्रणाली के अनुसार, यह संयोजन ${mulankScore}% का स्वाभाविक तालमेल प्रदर्शित करता है। ${
      mulankScore >= 75
        ? 'दोनों के स्वभाव में प्राकृतिक मित्रता और एक-दूसरे के दृष्टिकोण को जल्दी समझने की क्षमता है।'
        : mulankScore >= 55
        ? 'दोनों के कार्य करने के तरीकों में कुछ भिन्नताएं हो सकती हैं, जिन्हें परस्पर बातचीत से आसानी से संतुलित किया जा सकता है।'
        : 'दोनों के प्राथमिक स्वभाव और प्राथमिकताओं में भिन्नता है, इसलिए दैनिक निर्णयों में धैर्य और स्पष्ट संवाद की आवश्यकता होगी।'
    }`,
    explanationEn: `Partner A operates on Mulank ${pA_M} while Partner B operates on Mulank ${pB_M}. This yields a baseline day-to-day behavioral alignment of ${mulankScore}%.`,
    keyInsightsHi: [
      `${personA.name} की स्वाभाविक ऊर्जा: ${mProfA.personality}`,
      `${personB.name} की स्वाभाविक ऊर्जा: ${mProfB.personality}`,
      `संवाद शैली: ${mProfA.communication} बनाम ${mProfB.communication}`
    ],
    practicalTipsHi: [
      'दैनिक निर्णयों में एक-दूसरे के सोचने के तरीके को समय दें और तुरंत प्रतिक्रिया देने से बचें।',
      'एक-दूसरे की स्वतंत्र पसंद और प्राथमिकताओं का आदर करें।'
    ]
  };

  // 2. Bhagyank Compatibility (Destiny / Long-term Direction)
  const bhagyankRaw = PLANETARY_SYNASTRY_MATRIX[pA_B]?.[pB_B] || 6.5;
  const bhagyankScore = Math.round(bhagyankRaw * 10);
  const bhagyankCls = getClassification(bhagyankScore);
  const bhagyankAnalysis: LayerAnalysis = {
    title: 'Bhagyank (Conductor) Compatibility',
    titleHi: 'भाग्यांक सामंजस्य (दीर्घकालिक जीवन दिशा एवं उत्तरदायित्व)',
    score: bhagyankScore,
    classification: bhagyankCls.cls,
    classificationHi: bhagyankCls.clsHi,
    explanationHi: `${personA.name} का भाग्यांक ${pA_B} (${personA.bhagyankGraha}) है तथा ${personB.name} का भाग्यांक ${pB_B} (${personB.bhagyankGraha}) है। भाग्यांक जीवन के बड़े लक्ष्यों, पारिवारिक जिम्मेदारियों और भविष्य के दृष्टिकोण को दर्शाता है। न्यूमेरोलॉजी गणना में इनका तालमेल ${bhagyankScore}% पाया गया है। ${
      bhagyankScore >= 75
        ? 'दीर्घकालिक पारिवारिक योजनाओं और आर्थिक दृष्टिकोण में एक समान दृष्टि और सहयोग रहेगा।'
        : bhagyankScore >= 55
        ? 'जीवन के लक्ष्यों में संतुलित सहयोग संभव है, बशर्ते भविष्य की योजनाओं पर पहले से चर्चा की जाए।'
        : 'भविष्य की प्राथमिकताओं और पारिवारिक उत्तरदायित्वों को लेकर स्पष्ट योजना बनाना दोनों के लिए हितकर रहेगा।'
    }`,
    explanationEn: `Conductor vibration comparison shows ${bhagyankScore}% alignment for long-term trajectory and shared life goals.`,
    keyInsightsHi: [
      `${personA.name} की दीर्घकालिक सोच: ${bProfA.thinkingStyle}`,
      `${personB.name} की दीर्घकालिक सोच: ${bProfB.thinkingStyle}`,
      `पारिवारिक दृष्टिकोण: ${bProfA.family} तथा ${bProfB.family}`
    ],
    practicalTipsHi: [
      'वार्षिक और दीर्घकालिक पारिवारिक योजनाओं को आपसी सहमति से तय करें।',
      'करियर और पारिवारिक जिम्मेदारियों के बीच संतुलन बनाए रखने के लिए समय-समय पर विचार साझा करें।'
    ]
  };

  // 3. Mulank + Bhagyank Cross-Synthesis
  const crossAB = (PLANETARY_SYNASTRY_MATRIX[pA_M]?.[pB_B] || 6.0) * 10;
  const crossBA = (PLANETARY_SYNASTRY_MATRIX[pB_M]?.[pA_B] || 6.0) * 10;
  const crossSynthesis: CrossSynthesisAnalysis = {
    mulankVsBhagyankAtoB: {
      score: Math.round(crossAB),
      explanationHi: `${personA.name} का मूलांक (${pA_M}) ${personB.name} के भाग्यांक (${pB_B}) के साथ ${Math.round(crossAB)}% अनुकूलता रखता है। यह दर्शाता है कि ${personA.name} का दैनिक आचरण ${personB.name} के दीर्घकालिक लक्ष्यों में किस प्रकार सहयोग करता है।`
    },
    mulankVsBhagyankBtoA: {
      score: Math.round(crossBA),
      explanationHi: `${personB.name} का मूलांक (${pB_M}) ${personA.name} के भाग्यांक (${pA_B}) के साथ ${Math.round(crossBA)}% तालमेल बनाता है। यह ${personB.name} के स्वभाव का ${personA.name} के जीवन पथ पर प्रभाव दिखाता है।`
    },
    synthesisHi: `क्रॉस-सिंथेसिस (Cross-Synthesis) विश्लेषण में पाया गया कि दोनों पार्टनर्स के तात्कालिक स्वभाव और दीर्घकालिक जीवन लक्ष्यों के बीच परस्पर अनुकूलता का स्तर ${Math.round((crossAB + crossBA) / 2)}% है। जब दोनों एक-दूसरे की क्षमताओं का सदुपयोग करते हैं, तो गृहस्थ जीवन में स्थिरता और सहयोग बना रहता है।`
  };

  // 4. Name Compatibility (Chaldean by default)
  const chaldeanA = (personA.chaldeanNameNumber % 9) || 9;
  const chaldeanB = (personB.chaldeanNameNumber % 9) || 9;
  const nameRaw = PLANETARY_SYNASTRY_MATRIX[chaldeanA]?.[chaldeanB] || 7.0;
  const nameScore = Math.round(nameRaw * 10);
  const nameCls = getClassification(nameScore);
  const nameAnalysis = {
    chaldean: {
      title: 'Chaldean Name Compatibility',
      titleHi: 'नाम ध्वनि एवं कंपन सामंजस्य (Chaldean Name Vibration)',
      score: nameScore,
      classification: nameCls.cls,
      classificationHi: nameCls.clsHi,
      explanationHi: `${personA.name} का Chaldean संयुक्त नामांक ${personA.chaldeanNameNumber} (मूल ${chaldeanA}) है और ${personB.name} का Chaldean नामांक ${personB.chaldeanNameNumber} (मूल ${chaldeanB}) है। नाम की ध्वनियां समाज, सामाजिक प्रतिष्ठा और आपसी संवाद में एक सकारात्मक स्पंदन उत्पन्न करती हैं। इनका तालमेल ${nameScore}% है।`,
      explanationEn: `Chaldean vibration alignment of names yields ${nameScore}%.`,
      keyInsightsHi: [
        `सामाजिक स्तर पर एक-दूसरे की छवि और प्रतिष्ठा को समर्थन देने की प्रवृत्ति।`,
        `आपसी बोलचाल में आदर और सकारात्मक ऊर्जा का प्रभाव।`
      ],
      practicalTipsHi: [
        'एक-दूसरे को सकारात्मक और सम्मानजनक शब्दों से संबोधित करें।',
        'हस्ताक्षर या नाम प्रयोग में स्पष्टता रखें।'
      ]
    },
    pythagorean: {
      title: 'Pythagorean Name Compatibility',
      titleHi: 'पाइथागोरियन नामांक सामंजस्य',
      score: Math.round(((PLANETARY_SYNASTRY_MATRIX[(personA.pythagoreanNameNumber % 9) || 9]?.[(personB.pythagoreanNameNumber % 9) || 9] || 7.0)) * 10),
      classification: 'NEUTRAL' as const,
      classificationHi: 'संतुलित (Balanced)',
      explanationHi: `पश्चिमी पाइथागोरियन पद्धति के अनुसार अभिव्यक्ति नामांक का तालमेल भी सकारात्मक सामाजिक तालमेल को दर्शाता है।`,
      explanationEn: `Pythagorean expression alignment shows balanced resonance.`,
      keyInsightsHi: ['मानसिक और बौद्धिक स्तर पर विचारों का आदान-प्रदान।'],
      practicalTipsHi: ['विचारों को स्पष्ट और खुलेपन के साथ व्यक्त करें।']
    }
  };

  // 5. Lo Shu Cross-Analysis
  const compAtoB = personA.missingNumbers.filter(n => (personB.birthGrid[n] || 0) > 0);
  const compBtoA = personB.missingNumbers.filter(n => (personA.birthGrid[n] || 0) > 0);
  const sharedStrengths = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    n => (personA.birthGrid[n] || 0) > 0 && (personB.birthGrid[n] || 0) > 0
  );
  const sharedMissing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    n => (personA.birthGrid[n] || 0) === 0 && (personB.birthGrid[n] || 0) === 0
  );

  const loShuAnalysis: LoShuCrossAnalysis = {
    gridA: personA.birthGrid,
    gridB: personB.birthGrid,
    complementaryNumbersAtoB: compAtoB,
    complementaryNumbersBtoA: compBtoA,
    sharedStrengths,
    sharedMissing,
    crossGridSynergyHi: `दोनों के Lo Shu ग्रिड के संयुक्त अध्ययन से ज्ञात होता है कि ${
      compBtoA.length > 0
        ? `${personA.name} के पास अंक [${compBtoA.join(', ')}] उपस्थित हैं जो ${personB.name} के ग्रिड में अनुपस्थित हैं, जिससे ${personA.name} साथी की उन ऊर्जाओं की पूर्ति करते हैं।`
        : 'दोनों ग्रिड अपने-अपने स्तर पर संतुलित हैं।'
    } ${
      compAtoB.length > 0
        ? `इसी प्रकार ${personB.name} के पास अंक [${compAtoB.join(', ')}] हैं जो ${personA.name} को आवश्यक पूरक शक्ति प्रदान करते हैं।`
        : ''
    }`,
    remedialBalanceHi: sharedMissing.length > 0
      ? `दोनों के ग्रिड में संयुक्त रूप से अंक [${sharedMissing.join(', ')}] अनुपस्थित हैं। इन तत्वों (Elements) को घर के वास्तु, रंग और संतुलित आदतों के माध्यम से जागरूक रूप से सशक्त बनाने का सुझाव दिया जाता है।`
      : 'ग्रिड में सभी प्रमुख तत्व एक-दूसरे के सहयोग से पूर्ण होते हैं, जो एक संतुलित ऊर्जा चक्र का निर्माण करता है।'
  };

  // 6. Planes Cross-Analysis
  const planeDefs = [
    { name: 'Mental Plane', nameHi: 'मानसिक तल (Mental Plane)', numbers: [4, 9, 2] },
    { name: 'Emotional Plane', nameHi: 'भावनात्मक तल (Emotional / Heart Plane)', numbers: [3, 5, 7] },
    { name: 'Practical Plane', nameHi: 'व्यावहारिक तल (Practical / Material Plane)', numbers: [8, 1, 6] },
    { name: 'Thought Plane', nameHi: 'विचार तल (Thought Plane)', numbers: [4, 3, 8] },
    { name: 'Will Plane', nameHi: 'इच्छाशक्ति तल (Willpower Plane)', numbers: [9, 5, 1] },
    { name: 'Action Plane', nameHi: 'कर्म तल (Action Plane)', numbers: [2, 7, 6] }
  ];

  const planeAnalysis: PlaneCrossAnalysis = {
    planes: planeDefs.map(pd => {
      const aHas = pd.numbers.every(n => (personA.birthGrid[n] || 0) > 0);
      const bHas = pd.numbers.every(n => (personB.birthGrid[n] || 0) > 0);
      let dynHi = '';
      if (aHas && bHas) {
        dynHi = 'दोनों में यह तल पूर्ण रूप से सक्रिय है, जिससे इस क्षेत्र में अत्यंत मजबूत साझा समझ रहेगी।';
      } else if (aHas || bHas) {
        dynHi = `${aHas ? personA.name : personB.name} में यह तल सक्रिय होकर दूसरे साथी के लिए पूरक प्रेरणा का कार्य करता है।`;
      } else {
        dynHi = 'इस तल की ऊर्जा को दोनों मिलकर साझा प्रयासों और जागरूकता से विकसित कर सकते हैं।';
      }
      return {
        name: pd.name,
        nameHi: pd.nameHi,
        numbers: pd.numbers,
        personAActive: aHas,
        personBActive: bHas,
        dynamicHi: dynHi
      };
    })
  };

  // 7. Arrow Cross-Analysis
  const arrowDefs = [
    { name: 'Arrow of Determination', nameHi: 'दृढ़ निश्चय का योग (9-5-1)', numbers: [9, 5, 1] },
    { name: 'Arrow of Compassion / Spirituality', nameHi: 'आध्यात्मिक एवं संवेदना योग (3-5-7)', numbers: [3, 5, 7] },
    { name: 'Arrow of Intellect', nameHi: 'बुद्धिमत्ता एवं रणनीति योग (4-9-2)', numbers: [4, 9, 2] },
    { name: 'Arrow of Prosperity / Action', nameHi: 'कर्म एवं व्यवहार कुशलता योग (8-1-6)', numbers: [8, 1, 6] }
  ];

  const arrowAnalysis: ArrowCrossAnalysis = {
    arrows: arrowDefs.map(ad => {
      const aPres = ad.numbers.every(n => (personA.birthGrid[n] || 0) > 0);
      const bPres = ad.numbers.every(n => (personB.birthGrid[n] || 0) > 0);
      let resHi = '';
      if (aPres && bPres) {
        resHi = 'दोनों में सक्रिय — इस गुण का साझा लाभ पारिवारिक उन्नति में मिलेगा।';
      } else if (aPres || bPres) {
        resHi = `${aPres ? personA.name : personB.name} में सक्रिय — रिश्ते में संतुलन और सहयोग प्रदान करता है।`;
      } else {
        resHi = 'सामान्य स्थिति — निरंतर अभ्यास से इस ऊर्जा को पुष्ट किया जा सकता है।';
      }
      return {
        name: ad.name,
        nameHi: ad.nameHi,
        numbers: ad.numbers,
        personAActive: aPres,
        personBActive: bPres,
        resonanceHi: resHi
      };
    })
  };

  // 8. Life Aspects & 7-Layer Deep Analysis
  const emotionalScore = Math.min(95, Math.max(50, Math.round((mulankScore * 0.5) + (bhagyankScore * 0.3) + ((personA.birthGrid[2] || personB.birthGrid[2] ? 15 : 5)))));
  const commScore = Math.min(95, Math.max(50, Math.round((nameScore * 0.4) + (mulankScore * 0.4) + ((personA.birthGrid[5] || personB.birthGrid[5] ? 15 : 5)))));
  const trustScore = Math.min(95, Math.max(50, Math.round((bhagyankScore * 0.5) + (mulankScore * 0.3) + ((personA.birthGrid[8] || personB.birthGrid[8] ? 15 : 10)))));
  const conflictScore = Math.min(95, Math.max(45, Math.round((mulankScore * 0.6) + (commScore * 0.4))));
  const familyScore = Math.min(95, Math.max(50, Math.round((bhagyankScore * 0.6) + (trustScore * 0.4))));
  const financialScore = Math.min(95, Math.max(50, Math.round((bhagyankScore * 0.5) + (mulankScore * 0.3) + ((personA.birthGrid[6] || personB.birthGrid[6] ? 15 : 5)))));
  const careerScore = Math.min(95, Math.max(50, Math.round((mulankScore * 0.4) + (bhagyankScore * 0.4) + ((personA.birthGrid[1] || personB.birthGrid[1] ? 15 : 5)))));

  // Overall weighted score
  const overallHarmonyScore = Math.round(
    mulankScore * 0.25 +
    bhagyankScore * 0.25 +
    emotionalScore * 0.15 +
    commScore * 0.15 +
    trustScore * 0.10 +
    financialScore * 0.10
  );

  const overallCls = getClassification(overallHarmonyScore);

  const sevenLayers = {
    personality: mulankAnalysis,
    emotional: {
      title: 'Emotional Needs & Sensitivity',
      titleHi: 'भावनात्मक आवश्यकताएं एवं संवेदनशीलता',
      score: emotionalScore,
      classification: getClassification(emotionalScore).cls,
      classificationHi: getClassification(emotionalScore).clsHi,
      explanationHi: `भावनात्मक स्तर पर ${personA.name} की अभिव्यक्ति ${mProfA.emotionalStyle} है, जबकि ${personB.name} की भावनाएं ${mProfB.emotionalStyle} के रूप में व्यक्त होती हैं। इस न्यूमेरोलॉजी प्रणाली में भावनात्मक सामंजस्य ${emotionalScore}% पाया गया है। ${
        emotionalScore >= 75
          ? 'दोनों एक-दूसरे की संवेदनशीलता और भावनाओं का स्वाभाविक रूप से आदर करते हैं।'
          : 'तनाव के क्षणों में एक-दूसरे को स्पेस देना और बिना जज किए सुनना अत्यंत फलदायी रहेगा।'
      }`,
      explanationEn: `Emotional resonance evaluated at ${emotionalScore}%.`,
      keyInsightsHi: [
        `${personA.name}: भावनात्मक संतुलन एवं सहयोग की चाह।`,
        `${personB.name}: आत्मीयता एवं सुरक्षा की भावना को प्राथमिकता।`
      ],
      practicalTipsHi: [
        'मन की बात को बिना संकोच साझा करने के लिए साप्ताहिक समय निकालें।',
        'कठिन समय में एक-दूसरे को भावनात्मक संबल प्रदान करें।'
      ]
    },
    communication: {
      title: 'Communication & Expression',
      titleHi: 'संवाद शैली एवं विचार अभिव्यक्ति',
      score: commScore,
      classification: getClassification(commScore).cls,
      classificationHi: getClassification(commScore).clsHi,
      explanationHi: `संवाद की दृष्टि से ${personA.name} की शैली (${mProfA.communication}) तथा ${personB.name} की शैली (${mProfB.communication}) का मिलाप ${commScore}% अनुकूलता दर्शाता है। मतभेद के समय स्पष्ट और शांत भाषा का प्रयोग रिश्ते को निरंतर मधुर बनाए रखता है।`,
      explanationEn: `Communication channels score ${commScore}%.`,
      keyInsightsHi: [
        `प्रत्यक्ष और अप्रत्यक्ष संवाद में संतुलन बनाना आवश्यक।`,
        `सुनने और समझने की प्रवृत्ति दोनों के बीच गलतफहमियों को रोकती है।`
      ],
      practicalTipsHi: [
        'विवाद के समय तुरंत बहस करने के बजाय शांत होकर अपनी बात रखें।',
        'संवाद में कटाक्ष या कठोर शब्दों के प्रयोग से बचें।'
      ]
    },
    trust: {
      title: 'Trust & Commitment',
      titleHi: 'विश्वास, प्रतिबद्धता एवं स्थिरता',
      score: trustScore,
      classification: getClassification(trustScore).cls,
      classificationHi: getClassification(trustScore).clsHi,
      explanationHi: `वैवाहिक जीवन में विश्वास और निष्ठा का स्तर ${trustScore}% आंका गया है। भाग्यांक ${pA_B} और ${pB_B} दोनों में परिवार के प्रति जिम्मेदारी की गहरी भावना है। यह साझेदारी को दीर्घकालिक सुरक्षा प्रदान करती है।`,
      explanationEn: `Commitment and stability rated at ${trustScore}%.`,
      keyInsightsHi: [
        'पारिवारिक मर्यादा और आपसी वफादारी के प्रति दोनों समर्पित हैं।',
        'पारदर्शिता और खुलेपन से विश्वास दिन-प्रतिदिन और मजबूत होता है।'
      ],
      practicalTipsHi: [
        'महत्वपूर्ण वित्तीय और पारिवारिक निर्णयों में एक-दूसरे को हमेशा विश्वास में लें।',
        'आपसी वादों और प्रतिबद्धताओं का समय पर पालन करें।'
      ]
    },
    conflict: {
      title: 'Conflict Handling & Patience',
      titleHi: 'मतभेद समाधान एवं तनाव प्रबंधन',
      score: conflictScore,
      classification: getClassification(conflictScore).cls,
      classificationHi: getClassification(conflictScore).clsHi,
      explanationHi: `मतभेद के समय प्रतिक्रिया का स्तर ${conflictScore}% अनुकूल है। मूलांक ${pA_M} और मूलांक ${pB_M} में जब मतभेद हों, तो धैर्य रखना और मुद्दे को व्यक्तिगत न बनाना सबसे कारगर उपाय है।`,
      explanationEn: `Conflict resolution mechanism rated at ${conflictScore}%.`,
      keyInsightsHi: [
        'क्रोध या जल्दबाजी में निर्णय लेने से बचना चाहिए।',
        'समस्या पर ध्यान केंद्रित करें, व्यक्ति पर नहीं।'
      ],
      practicalTipsHi: [
        'विवाद की स्थिति में कुछ देर का मौन धारण कर मन शांत करें।',
        'समाधान-उन्मुख दृष्टिकोण अपनाएं और पुरानी बातों को न दोहराएं।'
      ]
    },
    marriageExpectations: {
      title: 'Marriage & Family Expectations',
      titleHi: 'वैवाहिक जीवन एवं गृहस्थी अपेक्षाएं',
      score: familyScore,
      classification: getClassification(familyScore).cls,
      classificationHi: getClassification(familyScore).clsHi,
      explanationHi: `गृहस्थ जीवन में घर की व्यवस्था, सुख-सुविधा और पारिवारिक प्राथमिकताओं का मिलान ${familyScore}% सहयोग को दर्शाता है। दोनों ही गृहस्थी में सुख, शांति और स्थिरता चाहते हैं।`,
      explanationEn: `Marital lifestyle expectations alignment at ${familyScore}%.`,
      keyInsightsHi: [
        'पारिवारिक जिम्मेदारियों का उचित और परस्पर सम्मानजनक विभाजन।',
        'घर के वातावरण को सात्विक और शांतिपूर्ण बनाए रखने का साझा प्रयास।'
      ],
      practicalTipsHi: [
        'घर के दायित्वों को आपसी सुविधा अनुसार बांटें।',
        'पारिवारिक उत्सवों और परंपराओं में साथ मिलकर भाग लें।'
      ]
    },
    overallHarmony: {
      title: 'Overall Relationship Harmony',
      titleHi: 'समग्र वैवाहिक सामंजस्य एवं मार्गदर्शन',
      score: overallHarmonyScore,
      classification: overallCls.cls,
      classificationHi: overallCls.clsHi,
      explanationHi: `समग्र न्यूमेरोलॉजी गणना में ${personA.name} और ${personB.name} की कुंडलियों का सामंजस्य ${overallHarmonyScore}% है। यह एक ${
        overallHarmonyScore >= 75
          ? 'अत्यंत सामंजस्यपूर्ण और सहयोगी संबंध को दर्शाता है, जहां दोनों साथी एक-दूसरे की उन्नति में सहायक बनते हैं।'
          : overallHarmonyScore >= 60
          ? 'संतुलित और प्रगतिशील संबंध है, जहां आपसी समझ और सहयोग से हर परिस्थिति को अनुकूल बनाया जा सकता है।'
          : 'ऐसा संबंध है जिसमें दोनों को एक-दूसरे की सोच और आदतों को समझने के लिए निरंतर संवाद और धैर्य का अभ्यास करना चाहिए।'
      }`,
      explanationEn: `Composite relationship harmony score is ${overallHarmonyScore}%.`,
      keyInsightsHi: [
        `प्रमुख सामंजस्य बिंदु: दोनों के भाग्यांकों का दीर्घकालिक सहयोग।`,
        `पूरक शक्ति: दोनों के Lo Shu ग्रिड के आपसी संतुलन से ऊर्जा चक्र की पूर्णता।`
      ],
      practicalTipsHi: [
        'दैनिक जीवन में एक-दूसरे के प्रति कृतज्ञता और प्रेम का भाव व्यक्त करें।',
        'पारंपरिक वैदिक उपायों और स्वस्थ जीवनशैली को अपनाएं।'
      ]
    }
  };

  const lifeAspects: LifeAspectsAnalysis = {
    emotional: sevenLayers.emotional,
    communication: sevenLayers.communication,
    trustAndCommitment: sevenLayers.trust,
    conflictStyle: sevenLayers.conflict,
    marriageExpectations: {
      personAExpectationsHi: `${personA.name} गृहस्थ जीवन में ${mProfA.family} की अपेक्षा रखते हैं और स्थिरता को महत्व देते हैं।`,
      personBExpectationsHi: `${personB.name} वैवाहिक संबंध में ${mProfB.family} को प्राथमिकता देते हैं और भावनात्मक सहयोग चाहते हैं।`,
      alignmentHi: 'दोनों की मूल अपेक्षाओं में पारिवारिक सुरक्षा और पारस्परिक सम्मान का साझा आधार विद्यमान है।'
    },
    partnerExpectations: {
      personASeeksHi: `${personA.name} जीवनसाथी में ईमानदारी, प्रेरणा और विचारों के सम्मान की अपेक्षा रखते हैं।`,
      personBSeeksHi: `${personB.name} जीवनसाथी में स्नेह, सुरक्षा और सहानुभूतिपूर्ण समझ को विशेष महत्व देते हैं।`,
      balanceHi: 'एक-दूसरे की आवश्यकताओं को समझने से यह संबंध और अधिक परिपक्व और प्रगाढ़ बनता है।'
    },
    familyCompatibility: {
      title: 'Family & Elder Respect',
      titleHi: 'पारिवारिक संबंध एवं बड़ों का आदर',
      score: familyScore,
      classification: getClassification(familyScore).cls,
      classificationHi: getClassification(familyScore).clsHi,
      explanationHi: `परिवार के प्रति निष्ठा और संयुक्त उत्तरदायित्वों को निभाने में ${familyScore}% तालमेल देखा गया है। बड़ों का आशीर्वाद और पारिवारिक मूल्यों की रक्षा दोनों के लिए महत्वपूर्ण है।`,
      explanationEn: `Family integration score: ${familyScore}%.`,
      keyInsightsHi: ['पारिवारिक समारोहों और परंपराओं में रुचि।', 'माता-पिता और बुजुर्गों के प्रति सम्मान की भावना।'],
      practicalTipsHi: ['पारिवारिक आयोजनों में दोनों मिलकर सक्रिय भूमिका निभाएं।']
    },
    financialCompatibility: {
      title: 'Financial & Wealth Alignment',
      titleHi: 'आर्थिक दृष्टिकोण एवं धन प्रबंधन सामंजस्य',
      score: financialScore,
      classification: getClassification(financialScore).cls,
      classificationHi: getClassification(financialScore).clsHi,
      explanationHi: `आर्थिक दृष्टिकोण से ${personA.name} (${mProfA.wealth}) तथा ${personB.name} (${mProfB.wealth}) का संयुक्त स्कोर ${financialScore}% है। बजट निर्माण और बचत की साझा योजना आर्थिक स्थिरता सुनिश्चित करेगी।`,
      explanationEn: `Financial harmony rated at ${financialScore}%.`,
      keyInsightsHi: ['संयुक्त बचत और सुनियोजित निवेश में रुचि।', 'अनावश्यक खर्चों से बचने के लिए पूर्व सहमति।'],
      practicalTipsHi: ['मासिक बजट और बचत लक्ष्यों पर मिलकर विचार-विमर्श करें।', 'बड़े वित्तीय निर्णयों में दोनों की सहमति आवश्यक रखें।']
    },
    careerInteraction: {
      title: 'Career & Ambition Balance',
      titleHi: 'करियर महत्वाकांक्षा एवं कार्य-जीवन संतुलन',
      score: careerScore,
      classification: getClassification(careerScore).cls,
      classificationHi: getClassification(careerScore).clsHi,
      explanationHi: `करियर के क्षेत्र में दोनों एक-दूसरे की प्रगति और पेशेवर विकास में सहायक बन सकते हैं। अनुकूलता स्कोर ${careerScore}% है। काम और गृहस्थी के बीच समय का सही संतुलन बनाए रखना लाभदायक रहेगा।`,
      explanationEn: `Career alignment evaluated at ${careerScore}%.`,
      keyInsightsHi: ['पेशेवर लक्ष्यों में पारस्परिक सहयोग।', 'समय प्रबंधन द्वारा पारिवारिक शांति की रक्षा।'],
      practicalTipsHi: ['कार्यक्षेत्र की थकान या तनाव को घर के वातावरण पर हावी न होने दें।']
    }
  };

  // Remedies based on birth numbers & missing elements
  const auspiciousDates = Array.from(new Set([
    pA_M, pB_M, pA_B, pB_B, 1, 3, 5, 6, 9
  ])).filter(n => n >= 1 && n <= 9).sort((a, b) => a - b);

  const remedies: RelationshipRemedies = {
    dailyRoutinesHi: [
      'प्रातःकाल साथ मिलकर गायत्री मंत्र अथवा ॐ का 11 बार शांत मन से उच्चारण करें।',
      'प्रतिदिन तुलसी के पौधे में जल अर्पित करें और संध्या समय घी का दीपक प्रज्वलित करें।',
      'सप्ताह में कम से कम एक दिन साथ बैठकर बिना किसी इलेक्ट्रॉनिक गैजेट के शांत वातावरण में भोजन करें।'
    ],
    auspiciousColors: ['क्रीम / हल्का पीला (Cream / Soft Yellow)', 'हल्का गुलाबी (Rose / Peach)', 'ऑफ-व्हाइट (Soft Ivory)'],
    auspiciousDates: auspiciousDates,
    communicationRemedyHi: 'बुधवार के दिन घर के उत्तर या पूर्व दिशा में हरे पौधे रखें और संवाद में मधुरता का संकल्प लें।',
    traditionalVastuHi: 'शयनकक्ष (Bedroom) को दक्षिण-पश्चिम (South-West) दिशा में रखें और उसमें हल्के व सुखद रंगों का प्रयोग करें। दर्पण को बिस्तर के ठीक सामने न लगाएं।',
    traditionalDaanHi: 'शनिवार या गुरुवार को जरूरतमंदों को अन्न, फल या वस्त्र का यथाशक्ति दान करें। यह ग्रहीय शांति में सहायक होता है।',
    gemstoneComplementHi: 'ज्योतिषीय परामर्श अनुसार यदि आवश्यक हो, तो रोज़ क्वार्ट्ज (Rose Quartz) क्रिस्टल को बेडरूम में रखना वैवाहिक प्रेम को संबल देता है।'
  };

  // 5-7 Key Summary Points
  const summary: SynastrySummary = {
    strongestCommonAreaHi: `दीर्घकालिक जीवन दिशा (Bhagyank Alignment ${bhagyankScore}%): दोनों के भविष्य के उद्देश्य और पारिवारिक मूल्य एक-दूसरे के अनुकूल हैं।`,
    complementaryAreaHi: `Lo Shu ऊर्जा चक्र: ${personA.name} और ${personB.name} के जन्म ग्रिड एक-दूसरे की अनुपस्थित ऊर्जाओं को संतुलित करते हैं।`,
    communicationKeyHi: `संवाद सामंजस्य (${commScore}%): खुले दिल से बातचीत करना और मतभेद के समय धैर्य रखना रिश्ते की सबसे बड़ी शक्ति है।`,
    emotionalKeyHi: `भावनात्मक समझ (${emotionalScore}%): एक-दूसरे की संवेदनशीलता का सम्मान करना और समय देना आवश्यक है।`,
    trustKeyHi: `विश्वास एवं स्थिरता (${trustScore}%): पारिवारिक जिम्मेदारियों के प्रति दोनों की प्रतिबद्धता रिश्ते को मजबूत बनाती है।`,
    practicalChallengeHi: `दैनिक प्राथमिकताओं में भिन्नता: मूलांक के अनुसार अलग-अलग कार्यशैली को समझकर एक-दूसरे को स्पेस देना लाभकारी होगा।`,
    traditionalGuidanceHi: `पारंपरिक वैदिक मार्गदर्शन: नियमित प्रार्थना, सात्विक गृहस्थी और आपसी सम्मान के साथ यह वैवाहिक संबंध अत्यंत सुखद और सफल रहेगा।`
  };

  const reportId = `SYN-${Date.now().toString().slice(-6)}`;
  const calculatedAt = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    id: reportId,
    calculatedAt,
    personA,
    personB,
    overallHarmonyScore,
    stabilityVerdictHi: overallCls.clsHi,
    sevenLayers,
    mulankAnalysis,
    bhagyankAnalysis,
    crossSynthesis,
    nameAnalysis,
    loShuAnalysis,
    planeAnalysis,
    arrowAnalysis,
    lifeAspects,
    remedies,
    summary,
    disclaimer: 'यह वैवाहिक सामंजस्य विश्लेषण प्राचीन वैदिक, ला-शू एवं अंकशास्त्र सिद्धांतों पर आधारित एक मार्गदर्शक रिपोर्ट है। यह किसी प्रकार का अंतिम या अचूक दावा नहीं करती; वास्तविक वैवाहिक सुख आपसी प्रेम, समझ, सम्मान और समर्पण पर निर्भर करता है।'
  };
}
