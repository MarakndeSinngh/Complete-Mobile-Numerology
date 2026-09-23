import { analyzeMobileNumberAdvanced, MobileAnalysisNew } from '../services/AdvancedMobileEngine';
import { reduceToDigit, sumDigits } from './numerologyEngine';
import {
  applyZeroReplacement,
  extractAdjacentPairs,
  MOBILE_COMPOUND_DATABASE,
  getMobileCompoundData,
  MOBILE_POSITIONS,
  MOBILE_PAIR_DATABASE,
  MULTIPLE_REPETITION_CAUTIONS,
  REPEATED_DIGIT_HEALTH_CAUTIONS,
  PROFESSION_NUMBER_MAPPINGS,
  SPECIAL_PIN_COMBINATIONS,
  PLANETARY_ROLES_AND_COMPATIBILITY,
  MobilePositionalMeaning,
  MobileCompoundClassification,
  MobilePairRule,
  ProfessionNumberMapping,
  SpecialPinCombination,
  RepeatedDigitHealthCaution
} from './methodology/mobileDefinitions';
import { SOURCES, SourceCitation } from './methodology/sourceRegistry';

export interface MobilePairDetail extends MobilePairRule {
  rawPair: string;
  isNegativeToAvoid: boolean;
  positionIndex: number;
}

export interface MobilePositionalReport {
  positionKey: string;
  positionNumber: number | string;
  digitOrPair: string;
  name: string;
  domain: string;
  influence: string;
  guideline: string;
  source: SourceCitation;
}

export interface MobileRepetitionReport {
  digit: number;
  originalCount: number;
  modifiedCount: number;
  isTwoTimesPair: boolean;
  isThreeTimesAllowed: boolean;
  isFourPlusRepetition: boolean;
  twoTimeMeaning?: string;
  fourPlusCaution?: {
    pattern: string;
    hindiMeaning: string;
    englishMeaning: string;
    traditionalCaution: string;
    source: SourceCitation;
  };
  healthCaution?: {
    issues: string[];
    traditionalCautionHindi: string;
    source: SourceCitation;
  };
}

export interface MobileVedicGridResult {
  matrix: number[][];
  counts: Record<number, number>;
  activePlanes: { name: string; numbers: number[]; status: string; description: string }[];
  hostileRelations: { name: string; pair: string; missing: number; status: string; description: string }[];
  fourthAspects: { name: string; pair: string; missingTwo: number[]; status: string; description: string }[];
}

export interface MissingNumberCompensation {
  missingInDob: number;
  presentInMobile: boolean;
  mobileCount: number;
  supportDescription: string;
}

export interface UnifiedMobileAnalysis extends MobileAnalysisNew {
  number: string;
  originalNumber: string;
  modifiedNumber: string;
  digitSum: number;
  rootNumber: number;
  compoundNumber: number;
  compoundClassification: MobileCompoundClassification;
  digitFrequency: Record<number, number>;
  originalFrequency: Record<number, number>;
  modifiedFrequency: Record<number, number>;
  missingDigits: number[];
  repeatedDigits: { digit: number; count: number }[];
  adjacentPairsOriginal: string[];
  adjacentPairsModified: string[];
  pairsAnalysis: MobilePairDetail[];
  positionAnalysis: MobilePositionalReport[];
  repetitionAnalysis: MobileRepetitionReport[];
  professionMatches: { profession: ProfessionNumberMapping; matchedDigits: number[]; matchPercentage: number }[];
  specialPinMatches: { item: SpecialPinCombination; matchedPin: string }[];
  mobileVedicGrid: MobileVedicGridResult;
  missingNumberCompensation: MissingNumberCompensation[];
  mulankRoleData?: {
    role: string;
    roleHindi: string;
    planet: string;
    isFriend: boolean;
    isEnemy: boolean;
    isNeutral: boolean;
  };
  bhagyankRoleData?: {
    role: string;
    roleHindi: string;
    planet: string;
    isFriend: boolean;
    isEnemy: boolean;
    isNeutral: boolean;
  };
  dobCompatibility: { score: number; status: string; description: string };
  mulankCompatibility: { score: number; status: string; description: string };
  bhagyankCompatibility: { score: number; status: string; description: string };
  overallScore: number;
  strengths: string[];
  concerns: string[];
  recommendation: string;
  sourcesUsed: SourceCitation[];
}

export function analyzeMobileNumerology(
  mobileNumber: string,
  mulank: number = 1,
  bhagyank: number = 1,
  enhancedGridDigits: number[] = [],
  birthGridDigits: number[] = []
): UnifiedMobileAnalysis {
  const originalNumber = (mobileNumber || '').replace(/[^0-9]/g, '');
  const cleanDigits = originalNumber;
  const advancedResult = analyzeMobileNumberAdvanced(cleanDigits);

  // 1. Modified Number Calculation (Zero Replacement Rule from Day 1 PDF)
  const modifiedNumber = applyZeroReplacement(originalNumber);

  // 2. Sum and Roots
  const digitSum = sumDigits(originalNumber);
  const compoundNumber = digitSum;
  const rootNumber = reduceToDigit(digitSum);

  // 3. Compound Classification from Day 3 PDF (Page 19) / Day 4 PDF (Page 9)
  const compoundClassification = getMobileCompoundData(compoundNumber);

  // 4. Frequencies
  const originalFrequency: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const ch of originalNumber) {
    const d = parseInt(ch, 10);
    if (!isNaN(d)) originalFrequency[d]++;
  }

  const modifiedFrequency: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const ch of modifiedNumber) {
    const d = parseInt(ch, 10);
    if (!isNaN(d)) modifiedFrequency[d]++;
  }

  const digitFrequency = originalFrequency;

  // 5. Missing & Repeated in Original
  const missingDigits: number[] = [];
  const repeatedDigits: { digit: number; count: number }[] = [];
  for (let d = 1; d <= 9; d++) {
    if (originalFrequency[d] === 0) {
      missingDigits.push(d);
    } else if (originalFrequency[d] > 1) {
      repeatedDigits.push({ digit: d, count: originalFrequency[d] });
    }
  }

  // 6. Adjacent Pairs (from Modified Number as per Day 1 Course PDF)
  const adjacentPairsOriginal = extractAdjacentPairs(originalNumber);
  const adjacentPairsModified = extractAdjacentPairs(modifiedNumber);

  const pairsAnalysis: MobilePairDetail[] = adjacentPairsModified.map((pair, idx) => {
    const dbRule = MOBILE_PAIR_DATABASE[pair];
    if (dbRule) {
      return {
        ...dbRule,
        rawPair: pair,
        isNegativeToAvoid: dbRule.severity <= 45,
        positionIndex: idx + 1
      };
    }
    // Fallback if not directly in dictionary
    const d1 = parseInt(pair[0], 10);
    const d2 = parseInt(pair[1], 10);
    const pairSum = (d1 + d2) % 9 || 9;
    return {
      pair,
      rawPair: pair,
      meaning: `अंक जोड़ी ${pair} (सक्रिय ऊर्जा)`,
      positive: `अंक ${d1} और ${d2} का संयोजन संतुलित ऊर्जा उत्पन्न करता है।`,
      negative: 'नियमित रूप से अपने विचारों में स्पष्टता रखें।',
      career: 'व्यावहारिक प्रयासों और संवाद में निरंतरता बनाए रखें।',
      wealth: 'आर्थिक प्रबंधन पर ध्यान दें।',
      relationship: 'आपसी तालमेल और मधुर संवाद बनाए रखें।',
      wellness: 'संतुलित दिनचर्या का पालन करें।',
      area: 'General',
      severity: 70,
      isNegativeToAvoid: false,
      positionIndex: idx + 1,
      source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
    };
  });

  // 7. Positional Analysis (from Day 4 PDF)
  const positionAnalysis: MobilePositionalReport[] = [];
  const targetChars = modifiedNumber.length >= 10 ? modifiedNumber : modifiedNumber.padEnd(10, '0');

  // Pos 1
  if (MOBILE_POSITIONS['1']) {
    positionAnalysis.push({
      positionKey: '1',
      positionNumber: 1,
      digitOrPair: targetChars[0] || '',
      ...MOBILE_POSITIONS['1']
    });
  }
  // Pos 2
  if (MOBILE_POSITIONS['2']) {
    positionAnalysis.push({
      positionKey: '2',
      positionNumber: 2,
      digitOrPair: targetChars[1] || '',
      ...MOBILE_POSITIONS['2']
    });
  }
  // Pos 3
  if (MOBILE_POSITIONS['3']) {
    positionAnalysis.push({
      positionKey: '3',
      positionNumber: 3,
      digitOrPair: targetChars[2] || '',
      ...MOBILE_POSITIONS['3']
    });
  }
  // Pos 4
  if (MOBILE_POSITIONS['4']) {
    positionAnalysis.push({
      positionKey: '4',
      positionNumber: 4,
      digitOrPair: targetChars[3] || '',
      ...MOBILE_POSITIONS['4']
    });
  }
  // Pos 5
  if (MOBILE_POSITIONS['5']) {
    positionAnalysis.push({
      positionKey: '5',
      positionNumber: 5,
      digitOrPair: targetChars[4] || '',
      ...MOBILE_POSITIONS['5']
    });
  }
  // Pos 6+7
  if (MOBILE_POSITIONS['6_7']) {
    positionAnalysis.push({
      positionKey: '6_7',
      positionNumber: '6+7',
      digitOrPair: (targetChars[5] || '') + (targetChars[6] || ''),
      ...MOBILE_POSITIONS['6_7']
    });
  }
  // Pos 8
  if (MOBILE_POSITIONS['8']) {
    positionAnalysis.push({
      positionKey: '8',
      positionNumber: 8,
      digitOrPair: targetChars[7] || '',
      ...MOBILE_POSITIONS['8']
    });
  }
  // Pos 9
  if (MOBILE_POSITIONS['9']) {
    positionAnalysis.push({
      positionKey: '9',
      positionNumber: 9,
      digitOrPair: targetChars[8] || '',
      ...MOBILE_POSITIONS['9']
    });
  }
  // Pos 9+10
  if (MOBILE_POSITIONS['9_10']) {
    positionAnalysis.push({
      positionKey: '9_10',
      positionNumber: '9+10',
      digitOrPair: (targetChars[8] || '') + (targetChars[9] || ''),
      ...MOBILE_POSITIONS['9_10']
    });
  }

  // 8. Repetition Analysis & Health Cautions (Day 1 PDF Pages 3-4, 44-46)
  const repetitionAnalysis: MobileRepetitionReport[] = [];
  for (let d = 1; d <= 9; d++) {
    const oCount = originalFrequency[d];
    const mCount = modifiedFrequency[d];
    if (oCount > 0 || mCount > 0) {
      const isTwoTimesPair = (mCount === 2) || adjacentPairsModified.includes(`${d}${d}`);
      const isThreeTimesAllowed = (d === 1 || d === 5 || d === 6 || d === 3) && mCount <= 3;
      const isFourPlusRepetition = mCount >= 4;

      const twoPairRule = MOBILE_PAIR_DATABASE[`${d}${d}`];
      const fourPlusCaution = MULTIPLE_REPETITION_CAUTIONS[d];
      const healthRule = REPEATED_DIGIT_HEALTH_CAUTIONS.find(h => h.digit === d && mCount >= h.minCount);

      repetitionAnalysis.push({
        digit: d,
        originalCount: oCount,
        modifiedCount: mCount,
        isTwoTimesPair,
        isThreeTimesAllowed,
        isFourPlusRepetition,
        twoTimeMeaning: twoPairRule ? twoPairRule.meaning : undefined,
        fourPlusCaution: isFourPlusRepetition ? fourPlusCaution : undefined,
        healthCaution: healthRule ? {
          issues: healthRule.traditionalHealthIssues,
          traditionalCautionHindi: healthRule.traditionalCautionHindi,
          source: healthRule.source
        } : undefined
      });
    }
  }

  // 9. Profession Match Checks (Day 1 PDF Pages 42-43)
  const professionMatches: { profession: ProfessionNumberMapping; matchedDigits: number[]; matchPercentage: number }[] = [];
  const modifiedDigitList = modifiedNumber.split('').map(c => parseInt(c, 10)).filter(n => !isNaN(n));

  Object.values(PROFESSION_NUMBER_MAPPINGS).forEach(prof => {
    const matched = prof.requiredDigits.filter(req => modifiedDigitList.includes(req));
    const matchPercentage = Math.round((matched.length / prof.requiredDigits.length) * 100);
    if (matchPercentage >= 60) {
      professionMatches.push({
        profession: prof,
        matchedDigits: matched,
        matchPercentage
      });
    }
  });

  // 10. Special 4-Digit PIN Matches (Day 1 PDF Pages 46-47)
  const specialPinMatches: { item: SpecialPinCombination; matchedPin: string }[] = [];
  SPECIAL_PIN_COMBINATIONS.forEach(spec => {
    spec.numbers.forEach(pin => {
      const cleanPin = pin.replace(/[^0-9]/g, '');
      if (cleanPin.length === 4 && (originalNumber.includes(cleanPin) || modifiedNumber.includes(cleanPin))) {
        specialPinMatches.push({ item: spec, matchedPin: cleanPin });
      }
    });
  });

  // 11. Mobile Vedic Grid (3x3: [3,1,9], [6,7,5], [2,8,4])
  const vedicMatrix = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];
  const vedicCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let d = 1; d <= 9; d++) {
    vedicCounts[d] = modifiedFrequency[d];
  }

  // Active Planes
  const activePlanes = [
    {
      name: 'धर्म त्रिकोण (3-1-9 Axis)',
      numbers: [3, 1, 9],
      status: [3, 1, 9].every(n => vedicCounts[n] > 0) ? 'Full Active' : [3, 1, 9].some(n => vedicCounts[n] > 0) ? 'Partial' : 'Inactive',
      description: 'ज्ञान (3), नेतृत्व (1) और पराक्रम (9) का त्रि-आयामी समन्वय।'
    },
    {
      name: 'अर्थ त्रिकोण (6-7-5 Axis)',
      numbers: [6, 7, 5],
      status: [6, 7, 5].every(n => vedicCounts[n] > 0) ? 'Full Active' : [6, 7, 5].some(n => vedicCounts[n] > 0) ? 'Partial' : 'Inactive',
      description: 'व्यापार (5), विलासिता (6) और अंतर्दृष्टि (7) का वित्तीय संतुलन।'
    },
    {
      name: 'काम-मोक्ष त्रिकोण (2-8-4 Axis)',
      numbers: [2, 8, 4],
      status: [2, 8, 4].every(n => vedicCounts[n] > 0) ? 'Full Active' : [2, 8, 4].some(n => vedicCounts[n] > 0) ? 'Partial' : 'Inactive',
      description: 'कल्पना (2), अनुशासन (8) और दूरदर्शिता (4) का रूपांतरण चक्र।'
    }
  ];

  // Hostile Relations (Middle missing: 1&8 missing 7, 9&4 missing 5, 3&2 missing 6, 3&9 missing 1, 6&5 missing 7, 2&4 missing 8)
  const hostileChecks = [
    { name: 'सूर्य-शनि शत्रुता (1 & 8)', pair: '1 & 8', missing: 7, d1: 1, d2: 8 },
    { name: 'मंगल-राहु शत्रुता (9 & 4)', pair: '9 & 4', missing: 5, d1: 9, d2: 4 },
    { name: 'गुरु-चंद्र संबंध (3 & 2)', pair: '3 & 2', missing: 6, d1: 3, d2: 2 },
    { name: 'गुरु-मंगल संबंध (3 & 9)', pair: '3 & 9', missing: 1, d1: 3, d2: 9 },
    { name: 'शुक्र-बुध संबंध (6 & 5)', pair: '6 & 5', missing: 7, d1: 6, d2: 5 },
    { name: 'चंद्र-राहु संबंध (2 & 4)', pair: '2 & 4', missing: 8, d1: 2, d2: 4 }
  ];
  const hostileRelations = hostileChecks
    .filter(h => vedicCounts[h.d1] > 0 && vedicCounts[h.d2] > 0 && vedicCounts[h.missing] === 0)
    .map(h => ({
      name: h.name,
      pair: h.pair,
      missing: h.missing,
      status: 'Middle Number Missing',
      description: `मोबाइल में ${h.d1} और ${h.d2} दोनों उपस्थित हैं परन्तु मध्य अंक ${h.missing} अनुपस्थित है, जिसे कोर्स के अनुसार मध्यस्थता संतुलन की आवश्यकता के रूप में देखा जाता है।`
    }));

  // 4th Aspect (Chauthi Drishti: middle two missing in anti-clockwise)
  const fourthAspectChecks = [
    { name: '3 और 8 की 4th दृष्टि', pair: '3 & 8', missingTwo: [6, 2], d1: 3, d2: 8 },
    { name: '6 और 4 की 4th दृष्टि', pair: '6 & 4', missingTwo: [2, 8], d1: 6, d2: 4 },
    { name: '2 और 5 की 4th दृष्टि', pair: '2 & 5', missingTwo: [8, 4], d1: 2, d2: 5 },
    { name: '8 और 9 की 4th दृष्टि', pair: '8 & 9', missingTwo: [4, 5], d1: 8, d2: 9 },
    { name: '4 और 1 की 4th दृष्टि', pair: '4 & 1', missingTwo: [5, 9], d1: 4, d2: 1 },
    { name: '5 और 3 की 4th दृष्टि', pair: '5 & 3', missingTwo: [9, 1], d1: 5, d2: 3 },
    { name: '9 और 6 की 4th दृष्टि', pair: '9 & 6', missingTwo: [1, 3], d1: 9, d2: 6 },
    { name: '1 और 2 की 4th दृष्टि', pair: '1 & 2', missingTwo: [3, 6], d1: 1, d2: 2 }
  ];
  const fourthAspects = fourthAspectChecks
    .filter(f => vedicCounts[f.d1] > 0 && vedicCounts[f.d2] > 0 && f.missingTwo.every(m => vedicCounts[m] === 0))
    .map(f => ({
      name: f.name,
      pair: f.pair,
      missingTwo: f.missingTwo,
      status: '4th Aspect Active',
      description: `मोबाइल ग्रिड में ${f.d1} और ${f.d2} के बीच मध्य दो अंक ${f.missingTwo.join(', ')} अनुपस्थित हैं (4th Aspect)।`
    }));

  const mobileVedicGrid: MobileVedicGridResult = {
    matrix: vedicMatrix,
    counts: vedicCounts,
    activePlanes,
    hostileRelations,
    fourthAspects
  };

  // 12. Missing Number Compensation / "Mobile Support"
  // Note: We DO NOT alter the DOB Enhanced Grid or DOB Birth Grid. We only evaluate whether the mobile presence provides vibrational support.
  const dobMissingList: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (enhancedGridDigits.length > 0) {
      if (!enhancedGridDigits.includes(d)) dobMissingList.push(d);
    } else if (birthGridDigits.length > 0) {
      if (!birthGridDigits.includes(d)) dobMissingList.push(d);
    }
  }

  const missingNumberCompensation: MissingNumberCompensation[] = dobMissingList.map(m => {
    const inMobile = modifiedFrequency[m] > 0;
    return {
      missingInDob: m,
      presentInMobile: inMobile,
      mobileCount: modifiedFrequency[m],
      supportDescription: inMobile
        ? `जन्म कुण्डली में अंक ${m} अनुपस्थित है, परन्तु आपके मोबाइल नंबर में अंक ${m} (${modifiedFrequency[m]} बार) उपस्थित होने से यह दैनिक संपर्कों में पारंपरिक रूप से सहायक सहारा (Mobile Support) प्रदान करता है।`
        : `जन्म कुण्डली एवं मोबाइल दोनों में अंक ${m} अनुपस्थित है; इसके लिए संबंधित रंग व मंत्र के पारंपरिक उपाय किए जा सकते हैं।`
    };
  });

  // 13. Planetary Roles & Mulank/Bhagyank Alignment from Day 1 PDF Matrix
  const mulankRole = PLANETARY_ROLES_AND_COMPATIBILITY[mulank];
  const isMulankFriend = mulankRole?.friends.includes(rootNumber) || rootNumber === mulank;
  const isMulankEnemy = mulankRole?.enemies.includes(rootNumber) && rootNumber !== mulank;
  const isMulankNeutral = mulankRole?.neutrals.includes(rootNumber) && !isMulankFriend && !isMulankEnemy;

  const bhagyankRole = PLANETARY_ROLES_AND_COMPATIBILITY[bhagyank];
  const isBhagyankFriend = bhagyankRole?.friends.includes(rootNumber) || rootNumber === bhagyank;
  const isBhagyankEnemy = bhagyankRole?.enemies.includes(rootNumber) && rootNumber !== bhagyank;
  const isBhagyankNeutral = bhagyankRole?.neutrals.includes(rootNumber) && !isBhagyankFriend && !isBhagyankEnemy;

  const mulankRoleData = mulankRole ? {
    role: mulankRole.role,
    roleHindi: mulankRole.roleHindi,
    planet: mulankRole.planetHindi,
    isFriend: !!isMulankFriend,
    isEnemy: !!isMulankEnemy,
    isNeutral: !!isMulankNeutral
  } : undefined;

  const bhagyankRoleData = bhagyankRole ? {
    role: bhagyankRole.role,
    roleHindi: bhagyankRole.roleHindi,
    planet: bhagyankRole.planetHindi,
    isFriend: !!isBhagyankFriend,
    isEnemy: !!isBhagyankEnemy,
    isNeutral: !!isBhagyankNeutral
  } : undefined;

  // Scores
  let mulankScore = isMulankFriend ? 92 : isMulankNeutral ? 68 : 45;
  let bhagyankScore = isBhagyankFriend ? 90 : isBhagyankNeutral ? 65 : 42;
  if (compoundClassification.rating === 'EXCELLENT') {
    mulankScore = Math.min(100, mulankScore + 5);
    bhagyankScore = Math.min(100, bhagyankScore + 5);
  } else if (compoundClassification.rating === 'AVOID') {
    mulankScore = Math.max(20, mulankScore - 20);
    bhagyankScore = Math.max(20, bhagyankScore - 20);
  }

  const dobScore = Math.round((mulankScore + bhagyankScore) / 2);

  const mulankCompatibility = {
    score: mulankScore,
    status: isMulankFriend ? 'मित्र (Friendly & Harmonious)' : isMulankEnemy ? 'शत्रु / तनाव (Enemy Vibration)' : 'सम / तटस्थ (Neutral)',
    description: isMulankFriend
      ? `मोबाइल का मूलांक ${rootNumber} आपके मूलांक ${mulank} (${mulankRole?.roleHindi || 'Driver'}) का मित्र है, जो आपके व्यक्तित्व और प्राथमिक पहलों में सामंजस्य स्थापित करता है।`
      : isMulankEnemy
      ? `मोबाइल का मूलांक ${rootNumber} आपके मूलांक ${mulank} का पारंपरिक शत्रु अंक माना जाता है; संवाद में संयम रखें।`
      : `मोबाइल का मूलांक ${rootNumber} आपके मूलांक ${mulank} के साथ तटस्थ ऊर्जा साझा करता है।`
  };

  const bhagyankCompatibility = {
    score: bhagyankScore,
    status: isBhagyankFriend ? 'अनुकूल (Supportive)' : isBhagyankEnemy ? 'चुनौतीपूर्ण (Challenging)' : 'तटस्थ (Neutral)',
    description: isBhagyankFriend
      ? `मोबाइल का मूलांक ${rootNumber} आपके भाग्यांक ${bhagyank} (${bhagyankRole?.roleHindi || 'Destiny'}) के साथ अनुकूल संबंध रखता है और दीर्घकालिक लक्ष्यों में सहायक है।`
      : isBhagyankEnemy
      ? `मोबाइल का मूलांक ${rootNumber} आपके भाग्यांक ${bhagyank} के साथ घर्षण उत्पन्न कर सकता है।`
      : `मोबाइल का मूलांक ${rootNumber} आपके भाग्यांक ${bhagyank} के साथ सामान्य संतुलन बनाए रखता है।`
  };

  const dobCompatibility = {
    score: dobScore,
    status: dobScore >= 80 ? 'अत्यंत अनुकूल (Highly Auspicious)' : dobScore >= 60 ? 'संतुलित (Moderate)' : 'सावधानी अपेक्षित (Requires Caution)',
    description: `जन्मतिथि एवं मोबाइल सामंजस्य स्कोर: ${dobScore}/100 (मूलांक ${mulank} व भाग्यांक ${bhagyank} के साथ पारंपरिक गणना के आधार पर)।`
  };

  // Strengths and Concerns
  const strengths: string[] = [];
  if (compoundClassification.rating === 'EXCELLENT' || compoundClassification.rating === 'GOOD') {
    strengths.push(`उत्कृष्ट यौगिक योग ${compoundNumber} (${compoundClassification.title}) — ${compoundClassification.rating}`);
  }
  if (isMulankFriend) {
    strengths.push(`मूलांक ${mulank} (${mulankRole?.planetHindi || 'ग्रह'}) के साथ मित्रवत संबंध`);
  }
  if (isBhagyankFriend) {
    strengths.push(`भाग्यांक ${bhagyank} के साथ दीर्घकालिक सामंजस्य`);
  }
  if ([1, 5, 6, 3].includes(rootNumber)) {
    strengths.push(`शुभ मूलांक योग (${rootNumber}) जो अंकशास्त्र में मोबाइल कुल के लिए सबसे अनुकूल माना जाता है`);
  }
  if (strengths.length === 0) {
    strengths.push('दैनिक व्यावहारिक उपयोग के लिए स्थिर ऊर्जा');
  }

  const concerns: string[] = [];
  if (compoundClassification.rating === 'AVOID') {
    concerns.push(`यौगिक संख्या ${compoundNumber} (${compoundClassification.title}) को इस कोर्स के अनुसार अवॉइड (AVOID) श्रेणी में रखा गया है`);
  }
  if (modifiedFrequency[4] > 2 || modifiedFrequency[8] > 2) {
    concerns.push('अंक 4 या 8 का अत्यधिक दोहराव (कोर्स के अनुसार 4 और 8 के दोहराव से बचने का सुझाव दिया जाता है)');
  }
  if (isMulankEnemy) {
    concerns.push(`मोबाइल मूलांक ${rootNumber} आपके मूलांक ${mulank} का विरोधी अंक है`);
  }
  if (isBhagyankEnemy) {
    concerns.push(`मोबाइल मूलांक ${rootNumber} आपके भाग्यांक ${bhagyank} का विरोधी अंक है`);
  }

  let recommendation = '';
  if (dobScore >= 80 && compoundClassification.rating !== 'AVOID') {
    recommendation = 'यह मोबाइल नंबर आपके व्यक्तिगत, व्यापारिक एवं वित्तीय संचार के लिए पारंपरिक रूप से अत्यंत शुभ और अनुकूल है।';
  } else if (dobScore >= 55) {
    recommendation = 'यह मोबाइल नंबर सामान्य व्यावसायिक एवं दैनिक उपयोग के लिए उपयुक्त है; शुभ वॉलपेपर व अनुकूल रंगों के प्रयोग से इसकी ऊर्जा को और बढ़ाया जा सकता है।';
  } else {
    recommendation = 'दीर्घकालिक लाभ और समृद्धि के लिए भविष्य में 1, 5 या 6 के यौगिक योग वाले तथा मूलांक/भाग्यांक के मित्र अंक वाले मोबाइल नंबर के चयन पर विचार किया जा सकता है।';
  }

  const sourcesUsed: SourceCitation[] = [
    SOURCES.LEOFAMILY_MOBILE_PDF_D1,
    SOURCES.LEOFAMILY_MOBILE_PDF_D2,
    SOURCES.LEOFAMILY_MOBILE_PDF_D3,
    SOURCES.LEOFAMILY_MOBILE_PDF_D4
  ];

  return {
    ...advancedResult,
    number: cleanDigits,
    originalNumber,
    modifiedNumber,
    digitSum,
    rootNumber,
    compoundNumber,
    compoundClassification,
    digitFrequency,
    originalFrequency,
    modifiedFrequency,
    missingDigits,
    repeatedDigits,
    adjacentPairsOriginal,
    adjacentPairsModified,
    pairsAnalysis,
    positionAnalysis,
    repetitionAnalysis,
    professionMatches,
    specialPinMatches,
    mobileVedicGrid,
    missingNumberCompensation,
    mulankRoleData,
    bhagyankRoleData,
    dobCompatibility,
    mulankCompatibility,
    bhagyankCompatibility,
    overallScore: Math.round((advancedResult.score * 0.4) + (dobScore * 0.6)),
    strengths,
    concerns,
    recommendation,
    sourcesUsed
  };
}

export const analyzeMobileNumber = analyzeMobileNumerology;
