/**
 * LEOFAMILY VEHICLE NUMEROLOGY PRO ENGINE
 * Phase 8: Authoritative Vehicle & Registration Numerology Engine
 * 
 * Computes:
 * 1. Safe Alphanumeric Normalization
 * 2. Centralized Chaldean Mapping (Letters 1-8, sacred 9 excluded)
 * 3. Total Compound & Root Number (Alphanumeric and Numeric components)
 * 4. Digit Frequency & Repetition in Vehicle Number
 * 5. Owner Mulank & Bhagyank Compatibility
 * 6. Lo Shu Birth Grid & Missing Number Alignment
 * 7. Name & Mobile Number Cross-Comparison
 * 8. Numero Vastu & Kua Directional Parking Guidance
 * 9. Optional Purchase & Registration Date Personal Cycles
 * 10. Hindi-First Traditional Guidance & Non-Deterministic Safety Disclaimers
 */

import { CHALDEAN_LETTER_VALUES } from './chaldeanEngine';
import { reduceToSingleDigit, reduceToDigit, calculateMulank, calculateBhagyank } from './numerologyEngine';
import { parseIndianDate, formatDateForDisplay } from '../utils/dateUtils';
import { getCompoundDetails } from '../services/compoundDatabase';
import { calculateKuaNumber, KuaProfile } from './kuaEngine';
import { GRAHA_MAPPING } from './methodologyConfig';

export interface VehicleAnalysisInput {
  registrationNumber: string;
  ownerDob: string;
  ownerName?: string;
  vehicleNickname?: string;
  vehicleType?: 'Car' | 'SUV' | 'Motorcycle' | 'Scooter' | 'Commercial Vehicle' | 'Truck' | 'Bus' | 'Other';
  vehiclePurpose?: 'Personal Use' | 'Business Use' | 'Commercial Use' | 'Travel' | 'Family Use';
  purchaseDate?: string;
  registrationDate?: string;
  mobileNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export type CompatibilityStatus = 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';

export interface VehicleChaldeanBreakdown {
  letter: string;
  value: number;
}

export interface VehicleRepeatedDigit {
  digit: number;
  count: number;
  traditionalMeaning: string;
  positiveExpression: string;
  potentialExcess: string;
  cautionHi: string;
}

export interface VehicleNumerologyReport {
  // 1. Vehicle Identification
  originalRegistration: string;
  normalizedRegistration: string;
  vehicleNickname: string;
  vehicleType: string;
  vehiclePurpose: string;

  // 2. Chaldean Alphanumeric Analysis
  chaldean: {
    letterBreakdown: VehicleChaldeanBreakdown[];
    alphabeticSum: number;
    numericSum: number;
    totalCompound: number;
    totalRoot: number;
    planetaryRuler: string;
    planetaryRulerHi: string;
    compoundTitle: string;
    compoundMeaning: string;
    compoundPrediction: string;
  };

  // 3. Numeric Component Analysis (Digits on plate)
  numericAnalysis: {
    numericString: string;
    digitSum: number;
    numericCompound: number;
    numericRoot: number;
    digitFrequencies: Record<number, number>;
    repeatedDigits: VehicleRepeatedDigit[];
    missingDigits: number[];
  };

  // 4. Owner & Profile Compatibility
  ownerProfile: {
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    mulankLord: string;
    bhagyankLord: string;
  };

  compatibility: {
    mulankStatus: CompatibilityStatus;
    mulankStatusHi: string;
    mulankNotesHi: string;

    bhagyankStatus: CompatibilityStatus;
    bhagyankStatusHi: string;
    bhagyankNotesHi: string;

    overallRating: CompatibilityStatus;
    overallRatingHi: string;

    gridSupportNotesHi: string;
    missingNumberActivation: string | null;

    nameCompatibility?: {
      nameCompound: number;
      nameRoot: number;
      status: CompatibilityStatus;
      notesHi: string;
    };

    mobileComparison?: {
      mobileRoot: number;
      status: CompatibilityStatus;
      notesHi: string;
    };
  };

  // 5. Numero Vastu & Kua
  vastuKua: {
    kuaNumber: number;
    kuaGroup: string;
    favourableDirections: {
      shengChi: string;
      tianYi: string;
      yanNian: string;
      fuWei: string;
    };
    parkingAdviceHi: string;
    elementalBalance: string;
    favourableColors: string[];
    dashboardRemediesHi: string[];
  };

  // 6. Optional Timing Analysis
  purchaseDateAnalysis?: {
    purchaseDate: string;
    personalYear: number;
    timingNotesHi: string;
  };

  registrationDateAnalysis?: {
    registrationDate: string;
    dayNumber: number;
    timingNotesHi: string;
  };

  // 7. Purpose Suitability
  purposeAlignment: {
    purpose: string;
    alignmentLevel: 'HIGH' | 'MODERATE' | 'NEEDS_BALANCING';
    notesHi: string;
  };

  // 8. Traditional Guidance & Safeguards
  traditionalGuidance: {
    maintenanceTipHi: string;
    colorPalette: string[];
    dashboardPlacementHi: string;
    travelPrecautionHi: string;
  };

  // 9. Final Executive Summary
  finalSummaryHi: {
    leadStatement: string;
    keyPoints: string[];
    closingAdvice: string;
  };

  // 10. Safety Disclaimer
  safetyDisclaimer: string;

  metadata: {
    calculatedAt: string;
    engineVersion: string;
    methodology: string;
  };
}

// Planetary friendship lookup for Vehicle Root vs Owner Mulank/Bhagyank
const PLANETARY_FRIENDSHIP: Record<number, { friends: number[]; neutral: number[]; enemies: number[] }> = {
  1: { friends: [1, 2, 3, 5, 9], neutral: [4, 7], enemies: [6, 8] },
  2: { friends: [1, 3], neutral: [2, 5, 7, 9], enemies: [4, 6, 8] },
  3: { friends: [1, 2, 3, 9], neutral: [5, 7, 8], enemies: [4, 6] },
  4: { friends: [5, 6, 7, 8], neutral: [1, 3], enemies: [2, 4, 9] },
  5: { friends: [1, 5, 6], neutral: [3, 7, 8, 9], enemies: [2, 4] },
  6: { friends: [4, 5, 6, 7, 8], neutral: [2, 3], enemies: [1, 9] },
  7: { friends: [3, 4, 5, 6], neutral: [1, 8, 9], enemies: [2, 7] },
  8: { friends: [3, 5, 6, 7], neutral: [4], enemies: [1, 2, 8, 9] },
  9: { friends: [1, 2, 3, 9], neutral: [5, 7], enemies: [4, 6, 8] }
};

const PLANET_NAMES_HI: Record<number, string> = {
  1: 'सूर्य (Sun)',
  2: 'चंद्र (Moon)',
  3: 'बृहस्पति / गुरु (Jupiter)',
  4: 'राहु (Rahu)',
  5: 'बुध (Mercury)',
  6: 'शुक्र (Venus)',
  7: 'केतु (Ketu)',
  8: 'शनि (Saturn)',
  9: 'मंगल (Mars)'
};

const REPEATED_DIGIT_KNOWLEDGE: Record<number, { meaning: string; positive: string; excess: string; caution: string }> = {
  0: {
    meaning: 'शून्य (0) अनंत संभावनाओं और ऊर्जा चक्र का प्रतीक है।',
    positive: 'सार्वभौमिक ऊर्जा और लचीलापन।',
    excess: 'कई शून्य होने से ऊर्जा का भटकाव हो सकता है।',
    caution: 'वाहन के कागजात और नियमित सर्विसिंग में पूर्ण स्पष्टता रखें।'
  },
  1: {
    meaning: 'सूर्य का अंक, नेतृत्व, अधिकार और आत्मसम्मान का प्रतीक है।',
    positive: 'राजसी पहचान, स्वतंत्र गति और प्रशासनिक प्रभाव।',
    excess: 'सड़क पर जल्दबाजी या आक्रामक ड्राइविंग की प्रवृत्ति।',
    caution: 'हमेशा धैर्यपूर्वक और संतुलित गति से वाहन चलाएं।'
  },
  2: {
    meaning: 'चंद्रमा का अंक, कोमलता, यात्रा और भावनात्मक सहजता का प्रतीक है।',
    positive: 'शांत, आरामदायक और सुखद पारिवारिक यात्रा।',
    excess: 'मौसम या मनोदशा के अनुसार ड्राइविंग में चंचलता।',
    caution: 'रात में या धुंधले मौसम में अतिरिक्त सतर्कता बरतें।'
  },
  3: {
    meaning: 'गुरु का अंक, ज्ञान, विस्तार, सुरक्षा और शुभता का प्रतीक है।',
    positive: 'अत्यंत सुरक्षित, सम्मानित और मंगलकारी यात्राएं।',
    excess: 'अति-आत्मविश्वास में गति नियमों की अनदेखी।',
    caution: 'पारिवारिक और ज्ञानवर्धक यात्राओं के लिए यह अत्यंत शुभ है।'
  },
  4: {
    meaning: 'राहु का अंक, अप्रत्याशितता, तकनीकी बुद्धिमत्ता और गति का प्रतीक है।',
    positive: 'उन्नत इलेक्ट्रॉनिक गैजेट्स और आधुनिक सस्पेंशन का सुख।',
    excess: 'सेंसर, वायरिंग या इलेक्ट्रॉनिक पार्ट्स में अचानक तकनीकी समस्या।',
    caution: 'नियमित बैटरी और इलेक्ट्रॉनिक डायग्नोस्टिक्स कराते रहें।'
  },
  5: {
    meaning: 'बुध का अंक, व्यापार, गतिशीलता, संचार और संतुलन का प्रतीक है।',
    positive: 'फुर्तीला वाहन, व्यावसायिक यात्राओं और सेल्स-मार्केटिंग में लाभकारी।',
    excess: 'बार-बार लेन बदलने या हड़बड़ी में यात्रा करने की आदत।',
    caution: 'शांत मन से यात्रा शुरू करें और शेड्यूल का पालन करें।'
  },
  6: {
    meaning: 'शुक्र का अंक, विलासिता, सौंदर्य, आराम और आकर्षण का प्रतीक है।',
    positive: 'उत्कृष्ट इंटीरियर, आरामदायक सीटें, उत्तम म्यूजिक सिस्टम।',
    excess: 'रखरखाव और कॉस्मेटिक सजावट में अत्यधिक खर्च।',
    caution: 'वाहन के इंटीरियर को हमेशा स्वच्छ और सुगंधित रखें।'
  },
  7: {
    meaning: 'केतु का अंक, शोध, एकांत, शांत अन्वेषण और सुरक्षा का प्रतीक है।',
    positive: 'लंबी शांत यात्राओं और आध्यात्मिक पर्यटन हेतु अत्यंत अनुकूल।',
    excess: 'अकेलेपन या लंबे रूट पर ध्यान भटकने की संभावना।',
    caution: 'लंबी दूरी की यात्रा में पर्याप्त ब्रेक लें।'
  },
  8: {
    meaning: 'शनि का अंक, मजबूती, स्थायित्व, अनुशासन और धैर्य का प्रतीक है।',
    positive: 'मजबूत बॉडी, टिकाऊ इंजन और भारी-भरकम विश्वसनीयता।',
    excess: 'शुरुआत में गति धीमी या भारीपन महसूस होना।',
    caution: 'टायर प्रेशर, ऑइल लेवल और गियरबॉक्स की समय पर जांच करें।'
  },
  9: {
    meaning: 'मंगल का अंक, उच्च ऊर्जा, त्वरित पिकअप और साहस का प्रतीक है।',
    positive: 'दमदार इंजन, उच्च परफॉर्मेंस और त्वरित गति।',
    excess: 'तेज गति और सड़क पर प्रतिस्पर्धात्मक मनोदशा।',
    caution: 'गति सीमा का कड़ाई से पालन करें और जल्दबाजी से बचें।'
  }
};

/**
 * Main Vehicle Numerology Analysis Engine
 */
export function analyzeVehicleNumerologyPro(input: VehicleAnalysisInput): VehicleNumerologyReport {
  const originalRegistration = input.registrationNumber || '';
  const normalizedRegistration = originalRegistration.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const vehicleNickname = input.vehicleNickname?.trim() || 'My Vehicle';
  const vehicleType = input.vehicleType || 'Car';
  const vehiclePurpose = input.vehiclePurpose || 'Personal Use';

  // 1. Calculate Chaldean letter breakdown & Alphanumeric Compound
  let alphabeticSum = 0;
  let numericSum = 0;
  const letterBreakdown: VehicleChaldeanBreakdown[] = [];
  const digitCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  let numericString = '';

  for (let i = 0; i < normalizedRegistration.length; i++) {
    const char = normalizedRegistration[i];
    if (/[A-Z]/.test(char)) {
      const val = CHALDEAN_LETTER_VALUES[char] || 0;
      alphabeticSum += val;
      letterBreakdown.push({ letter: char, value: val });
    } else if (/[0-9]/.test(char)) {
      const digit = parseInt(char, 10);
      numericSum += digit;
      numericString += char;
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    }
  }

  const totalCompound = alphabeticSum + numericSum;
  const totalRoot = reduceToSingleDigit(totalCompound) || 5;

  // 2. Compound and Root details
  const compoundDetails = getCompoundDetails(totalCompound);
  const planetaryRulerHi = PLANET_NAMES_HI[totalRoot] || `Planet ${totalRoot}`;

  // 3. Numeric Component Analysis
  const numericCompound = numericSum;
  const numericRoot = reduceToSingleDigit(numericCompound) || totalRoot;

  const repeatedDigits: VehicleRepeatedDigit[] = [];
  const missingDigits: number[] = [];

  for (let d = 0; d <= 9; d++) {
    const count = digitCounts[d];
    if (count >= 2) {
      const knowledge = REPEATED_DIGIT_KNOWLEDGE[d] || {
        meaning: `अंक ${d} की पुनरावृत्ति।`,
        positive: 'स्थिर ऊर्जा।',
        excess: 'ऊर्जा का असंतुलन।',
        caution: 'सजगता रखें।'
      };
      repeatedDigits.push({
        digit: d,
        count,
        traditionalMeaning: knowledge.meaning,
        positiveExpression: knowledge.positive,
        potentialExcess: knowledge.excess,
        cautionHi: knowledge.caution
      });
    }
  }

  for (let d = 1; d <= 9; d++) {
    if (digitCounts[d] === 0) {
      missingDigits.push(d);
    }
  }

  // 4. Owner DOB Parsing & Core Numbers
  const parsedOwnerDob = parseIndianDate(input.ownerDob);
  const mulank = calculateMulank(input.ownerDob);
  const bhagyank = calculateBhagyank(input.ownerDob);
  const mulankLord = PLANET_NAMES_HI[mulank] || `Planet ${mulank}`;
  const bhagyankLord = PLANET_NAMES_HI[bhagyank] || `Planet ${bhagyank}`;

  // 5. Evaluate Compatibility
  const mulankFriends = PLANETARY_FRIENDSHIP[mulank]?.friends || [];
  const mulankEnemies = PLANETARY_FRIENDSHIP[mulank]?.enemies || [];

  let mulankStatus: CompatibilityStatus = 'NEUTRAL';
  let mulankStatusHi = 'तटस्थ (Neutral)';
  let mulankNotesHi = '';

  if (mulankFriends.includes(totalRoot)) {
    mulankStatus = 'SUPPORTIVE';
    mulankStatusHi = 'अत्यंत अनुकूल (Supportive)';
    mulankNotesHi = `वाहन का कुल रूट अंक ${totalRoot} (${planetaryRulerHi}) आपके मूलांक ${mulank} (${mulankLord}) का नैसर्गिक मित्र है। यह दैनिक यात्राओं में मानसिक शांति और सकारात्मक ऊर्जा प्रदान करता है।`;
  } else if (mulankEnemies.includes(totalRoot)) {
    mulankStatus = 'NEEDS_ATTENTION';
    mulankStatusHi = 'सावधानी योग्य (Needs Attention)';
    mulankNotesHi = `वाहन का कुल रूट अंक ${totalRoot} और आपका मूलांक ${mulank} विपरीत स्वभाव रखते हैं। पारंपरिक अंकशास्त्र में इसे संतुलित करने हेतु डैशबोर्ड पर शुभ उपाय और अनुशासित ड्राइविंग की सलाह दी जाती है।`;
  } else {
    mulankNotesHi = `वाहन का कुल रूट अंक ${totalRoot} आपके मूलांक ${mulank} के साथ संतुलित और तटस्थ संबंध रखता है। सामान्य उपयोग हेतु यह उपयुक्त है।`;
  }

  const bhagyankFriends = PLANETARY_FRIENDSHIP[bhagyank]?.friends || [];
  const bhagyankEnemies = PLANETARY_FRIENDSHIP[bhagyank]?.enemies || [];

  let bhagyankStatus: CompatibilityStatus = 'NEUTRAL';
  let bhagyankStatusHi = 'तटस्थ (Neutral)';
  let bhagyankNotesHi = '';

  if (bhagyankFriends.includes(totalRoot)) {
    bhagyankStatus = 'SUPPORTIVE';
    bhagyankStatusHi = 'अत्यंत अनुकूल (Supportive)';
    bhagyankNotesHi = `वाहन का रूट ${totalRoot} आपके भाग्यांक ${bhagyank} (${bhagyankLord}) के जीवन-लक्ष्यों व कर्म-क्षेत्र के साथ सामंजस्य बिठाता है। व्यावसायिक एवं पारिवारिक प्रगति में यह सहायक है।`;
  } else if (bhagyankEnemies.includes(totalRoot)) {
    bhagyankStatus = 'NEEDS_ATTENTION';
    bhagyankStatusHi = 'सावधानी योग्य (Needs Attention)';
    bhagyankNotesHi = `भाग्यांक ${bhagyank} और वाहन रूट ${totalRoot} के बीच ऊर्जा का विरोधाभास है। यात्राओं के दौरान संयम और वाहन की नियमित मेंटेनेंस आवश्यक है।`;
  } else {
    bhagyankNotesHi = `भाग्यांक ${bhagyank} के साथ वाहन का संबंध सामान्य और तटस्थ है।`;
  }

  let overallRating: CompatibilityStatus = 'NEUTRAL';
  let overallRatingHi = 'संतुलित (Balanced)';
  if (mulankStatus === 'SUPPORTIVE' && bhagyankStatus === 'SUPPORTIVE') {
    overallRating = 'SUPPORTIVE';
    overallRatingHi = 'सर्वोत्तम एवं अनुकूल (Highly Supportive)';
  } else if (mulankStatus === 'NEEDS_ATTENTION' || bhagyankStatus === 'NEEDS_ATTENTION') {
    overallRating = 'NEEDS_ATTENTION';
    overallRatingHi = 'सावधानी व उपाय युक्त (Needs Attention)';
  } else {
    overallRating = 'NEUTRAL';
    overallRatingHi = 'संतुलित व सामान्य (Neutral / Balanced)';
  }

  // Missing Number Supplement in Owner's Lo Shu Grid
  let missingNumberActivation: string | null = null;
  let gridSupportNotesHi = '';
  if (parsedOwnerDob) {
    const dobDigitsStr = `${parsedOwnerDob.day}${parsedOwnerDob.month}${parsedOwnerDob.year}${mulank}${bhagyank}`;
    const isMissingInGrid = !dobDigitsStr.includes(String(totalRoot));
    if (isMissingInGrid) {
      missingNumberActivation = `अंक ${totalRoot} की सक्रियता`;
      gridSupportNotesHi = `आपके जन्म ग्रिड में अंक ${totalRoot} अनुपस्थित है। यह वाहन संख्या आपके जीवन में ${planetaryRulerHi} के सकारात्मक गुणों (जैसे गति, स्थिरता या समृद्धि) को पूरक रूप से आकर्षित करने में सहायक मानी जाती है।`;
    } else {
      gridSupportNotesHi = `वाहन का अंक ${totalRoot} आपके जन्म ग्रिड में पहले से उपस्थित ऊर्जा को और अधिक सक्रिय एवं गतिशील बनाता है।`;
    }
  }

  // Name Compatibility
  let nameCompatibility: VehicleNumerologyReport['compatibility']['nameCompatibility'];
  if (input.ownerName) {
    let nameCompound = 0;
    const cleanName = input.ownerName.toUpperCase().replace(/[^A-Z]/g, '');
    for (let i = 0; i < cleanName.length; i++) {
      nameCompound += CHALDEAN_LETTER_VALUES[cleanName[i]] || 0;
    }
    const nameRoot = reduceToSingleDigit(nameCompound) || 1;
    const isNameFriend = PLANETARY_FRIENDSHIP[nameRoot]?.friends.includes(totalRoot) || false;
    const isNameEnemy = PLANETARY_FRIENDSHIP[nameRoot]?.enemies.includes(totalRoot) || false;

    nameCompatibility = {
      nameCompound,
      nameRoot,
      status: isNameFriend ? 'SUPPORTIVE' : isNameEnemy ? 'NEEDS_ATTENTION' : 'NEUTRAL',
      notesHi: isNameFriend
        ? `आपके नाम अंक ${nameRoot} और वाहन अंक ${totalRoot} में परस्पर मित्रता है, जो आपकी सामाजिक प्रतिष्ठा के अनुकूल है।`
        : isNameEnemy
        ? `नाम अंक ${nameRoot} और वाहन अंक ${totalRoot} में भिन्न ऊर्जा है। वाहन में नेम-कार्ड या सुगंधित वातावरण से संतुलन रखें।`
        : `नाम अंक ${nameRoot} के साथ वाहन का संबंध सामान्य और तटस्थ है।`
    };
  }

  // Mobile Comparison
  let mobileComparison: VehicleNumerologyReport['compatibility']['mobileComparison'];
  if (input.mobileNumber) {
    const cleanMob = input.mobileNumber.replace(/[^0-9]/g, '');
    let mobSum = 0;
    for (let i = 0; i < cleanMob.length; i++) {
      mobSum += parseInt(cleanMob[i], 10);
    }
    const mobileRoot = reduceToSingleDigit(mobSum) || 5;
    const isMobFriend = PLANETARY_FRIENDSHIP[mobileRoot]?.friends.includes(totalRoot) || false;

    mobileComparison = {
      mobileRoot,
      status: isMobFriend ? 'SUPPORTIVE' : 'NEUTRAL',
      notesHi: isMobFriend
        ? `आपके मोबाइल अंक (${mobileRoot}) और वाहन अंक (${totalRoot}) में सुंदर सामंजस्य है, जो त्वरित संचार और यात्राओं में सहायक है।`
        : `मोबाइल अंक (${mobileRoot}) और वाहन अंक (${totalRoot}) भिन्न ऊर्जा क्षेत्रों में कार्य करते हैं।`
    };
  }

  // 6. Numero Vastu & Kua
  const birthYear = parsedOwnerDob ? parsedOwnerDob.year : 1990;
  const userGender = input.gender || 'MALE';
  const kuaProfile: KuaProfile = calculateKuaNumber(birthYear, userGender);

  const parkingAdviceMap: Record<number, string> = {
    1: 'उत्तर (North) या पूर्व (East) दिशा की ओर मुंह करके पार्क करना जल व सूर्य तत्व को संतुलित रखता है।',
    2: 'उत्तर-पश्चिम (North-West) या दक्षिण-पश्चिम (South-West) दिशा में ठहराव मन को शांति और स्थिरता देता है।',
    3: 'ईशान कोण (North-East) या पूर्व (East) दिशा में वाहन रखना अत्यंत शुभ और सुरक्षाकारी माना जाता है।',
    4: 'दक्षिण-पश्चिम (South-West) या उत्तर (North) दिशा में पार्किंग रखें और वाहन को धूल-मिट्टी से मुक्त रखें।',
    5: 'उत्तर (North) या उत्तर-पूर्व दिशा व्यापारिक यात्राओं और त्वरित संचार के लिए सर्वश्रेष्ठ है।',
    6: 'दक्षिण-पूर्व (South-East) या उत्तर-पश्चिम (North-West) दिशा विलासिता और आकर्षण ऊर्जा को पोषित करती है।',
    7: 'उत्तर-पूर्व (North-East) या पश्चिम (West) दिशा शांत और सुरक्षित यात्राओं के लिए उत्तम है।',
    8: 'पश्चिम (West) या दक्षिण (South) दिशा शनि तत्व के अनुशासन और भारी वाहन की सुरक्षा के लिए आदर्श है।',
    9: 'दक्षिण (South) या पूर्व (East) दिशा मंगल के साहस और उच्च गति को शुभ दिशा में संचालित करती है।'
  };

  const dashboardRemediesMap: Record<number, string[]> = {
    1: ['डैशबोर्ड पर लाल/केसरिया रंग का स्वास्तिक या सूर्य यंत्र रखें', 'ग्लव बॉक्स में थोड़ा सा तांबे का सिक्का रखें'],
    2: ['सफेद स्फटिक की माला या चांदी का छोटा टुकड़ा रखें', 'वाहन में चंदन या मोगरे की हल्की सुगंध का प्रयोग करें'],
    3: ['पीले कपड़े में हल्दी की गांठ या पीतल की छोटी गणेश प्रतिमा रखें', 'गुरु मंत्र का स्मरण करके यात्रा प्रारंभ करें'],
    4: ['डैशबोर्ड पर तांबे का पिरामिड या लकड़ी का टुकड़ा रखें', 'वाहन की खिड़कियां और शीशे हमेशा बिल्कुल साफ रखें'],
    5: ['हरा एवेंट्यूरिन स्टोन या कपूर की छोटी डली रखें', 'डैशबोर्ड पर बुध यंत्र या मोरपंख का स्पर्श रखें'],
    6: ['वाहन में गुलाब/लैवेंडर की प्रीमियम खुशबू और सफेद क्रिस्टल रखें', 'सीट कवर्स और इंटीरियर को हमेशा स्वच्छ और व्यवस्थित रखें'],
    7: ['सात मुखी रुद्राक्ष या छोटा स्फटिक पिरामिड रखें', 'लंबी यात्रा से पूर्व जल ग्रहण करें'],
    8: ['ड्राइवर मैट के नीचे काले कपड़े में लोहे का छोटा छल्ला/सिक्का रखें', 'शनिवार को वाहन की सफाई और प्रकाश व्यवस्था की जांच करें'],
    9: ['रियर-व्यू मिरर पर लाल धागा या श्री हनुमान जी का चित्र लगाएं', 'वाहन में हमेशा एक छोटी फर्स्ट-एड किट और जल बोतल रखें']
  };

  const favourableColorsMap: Record<number, string[]> = {
    1: ['Golden Yellow', 'Bright White', 'Saffron / Light Orange'],
    2: ['Pearl White', 'Silver', 'Light Cream'],
    3: ['Mustard Yellow', 'Cream', 'Golden Amber'],
    4: ['Smoke Grey', 'Metallic Silver', 'Dark Blue'],
    5: ['Emerald Green', 'Pastel Ash', 'Ivory White'],
    6: ['Diamond White', 'Silk Cream', 'Soft Sky Blue'],
    7: ['Light Grey', 'Chalk White', 'Matte Silver'],
    8: ['Dark Navy Blue', 'Steel Grey', 'Titanium Black'],
    9: ['Crimson Red', 'Pure White', 'Metallic Maroon']
  };

  // 7. Purpose Suitability
  let purposeAlignmentLevel: 'HIGH' | 'MODERATE' | 'NEEDS_BALANCING' = 'MODERATE';
  let purposeNotesHi = '';

  if (vehiclePurpose === 'Business Use' || vehiclePurpose === 'Commercial Use') {
    if ([1, 3, 5, 6].includes(totalRoot)) {
      purposeAlignmentLevel = 'HIGH';
      purposeNotesHi = `अंक ${totalRoot} व्यापार, ग्राहक आकर्षण, सेल्स और व्यावसायिक साख के लिए पारंपरिक रूप से अत्यंत अनुकूल माना जाता है।`;
    } else {
      purposeAlignmentLevel = 'MODERATE';
      purposeNotesHi = `व्यावसायिक कार्यों के लिए यह अंक सामान्य है; समय पर इनवॉइसिंग और अनुशासित शेड्यूल से उत्तम परिणाम मिलेंगे।`;
    }
  } else if (vehiclePurpose === 'Family Use') {
    if ([2, 3, 6].includes(totalRoot)) {
      purposeAlignmentLevel = 'HIGH';
      purposeNotesHi = `अंक ${totalRoot} पारिवारिक सुख, आरामदायक यात्रा, सुरक्षा और सौहार्दपूर्ण वातावरण को बढ़ावा देता है।`;
    } else {
      purposeAlignmentLevel = 'MODERATE';
      purposeNotesHi = `पारिवारिक यात्राओं में आराम और धैर्य का ध्यान रखें।`;
    }
  } else {
    // Personal Use / Travel
    purposeAlignmentLevel = 'HIGH';
    purposeNotesHi = `व्यक्तिगत यात्रा और आवागमन हेतु अंक ${totalRoot} की ऊर्जा स्वतंत्र और सक्रिय रूप से सहायक है।`;
  }

  // 8. Optional Purchase / Registration Date Analysis
  let purchaseDateAnalysis: VehicleNumerologyReport['purchaseDateAnalysis'];
  if (input.purchaseDate && parsedOwnerDob) {
    const parsedPurchase = parseIndianDate(input.purchaseDate);
    if (parsedPurchase) {
      // Calculate Personal Year in the year of purchase
      const dobDay = parsedOwnerDob.day;
      const dobMonth = parsedOwnerDob.month;
      const pySum = dobDay + dobMonth + parsedPurchase.year;
      const personalYear = reduceToSingleDigit(pySum) || 1;

      purchaseDateAnalysis = {
        purchaseDate: input.purchaseDate,
        personalYear,
        timingNotesHi: `वाहन क्रय की तिथि आपके पर्सनल ईयर (Personal Year) ${personalYear} चक्र में आती है। पारंपरिक अंकशास्त्र में इसे नई शुरुआत और भौतिक विस्तार का चरण माना जाता है।`
      };
    }
  }

  let registrationDateAnalysis: VehicleNumerologyReport['registrationDateAnalysis'];
  if (input.registrationDate) {
    const parsedReg = parseIndianDate(input.registrationDate);
    if (parsedReg) {
      const regDayNumber = reduceToSingleDigit(parsedReg.day);
      registrationDateAnalysis = {
        registrationDate: input.registrationDate,
        dayNumber: regDayNumber,
        timingNotesHi: `पंजीकरण तिथि का दैनिक अंक ${regDayNumber} है, जो इस वाहन की जन्म ऊर्जा के रूप में कार्य करता है।`
      };
    }
  }

  // 9. Traditional Guidance
  const traditionalGuidance = {
    maintenanceTipHi: 'वाहन की नियमित सर्विसिंग, ब्रेक और टायर अलाइनमेंट को हमेशा प्राथमिकता दें। किसी भी तकनीकी खराबी को तुरंत ठीक कराएं।',
    colorPalette: favourableColorsMap[totalRoot] || ['White', 'Silver', 'Grey'],
    dashboardPlacementHi: dashboardRemediesMap[totalRoot]?.[0] || 'डैशबोर्ड को स्वच्छ और सुगंधित रखें।',
    travelPrecautionHi: 'यात्रा शुरू करने से पूर्व शांत मन से 2 सेकंड ईश्वर का स्मरण करें और सुरक्षित ड्राइविंग के नियमों का पालन करें।'
  };

  // 10. Final Executive Summary
  const leadStatement = `आपके वाहन नंबर "${originalRegistration}" का कुल चालडीन कम्पाउंड अंक ${totalCompound} ("${compoundDetails.title}") और एकल रूट अंक ${totalRoot} (${planetaryRulerHi}) प्राप्त होता है।`;
  
  const keyPoints: string[] = [
    `मुख्य ऊर्जा: यह वाहन ${planetaryRulerHi} के प्रभाव में आता है, जो ${compoundDetails.meaning.slice(0, 110)}... के रूप में व्याख्यायित होता है।`,
    `मूलांक संरेखण: आपके मूलांक ${mulank} के साथ यह संबंध "${mulankStatusHi}" श्रेणी में आता है।`,
    `भाग्यांक संरेखण: आपके भाग्यांक ${bhagyank} के साथ यह "${bhagyankStatusHi}" संरेखण प्रदर्शित करता है।`,
    gridSupportNotesHi,
    `पारंपरिक वास्तु सुझाव: पार्किंग में ${kuaProfile.favourableDirections.shengChi} अथवा ${parkingAdviceMap[totalRoot]} दिशा का ध्यान रखना अनुकूल है।`
  ];

  const closingAdvice = `पारंपरिक अंकशास्त्र के अनुसार इस वाहन की ऊर्जा को सकारात्मक बनाए रखने के लिए डैशबोर्ड पर ${dashboardRemediesMap[totalRoot]?.[0] || 'शुभ प्रतीक'} का प्रयोग करें तथा सुरक्षित, अनुशासित ड्राइविंग का पालन करें।`;

  const safetyDisclaimer = `महत्वपूर्ण सुरक्षा सूचना: यह विश्लेषण पूर्णतः पारंपरिक अंकशास्त्र, चालडीन पद्धति एवं सांस्कृतिक मान्यताओं पर आधारित है। अंकशास्त्र किसी भी सड़क दुर्घटना की रोकथाम, तकनीकी खराबी से सुरक्षा या वित्तीय सफलता की कोई वैज्ञानिक अथवा वैधानिक गारंटी नहीं देता। सड़क पर सुरक्षा केवल सतर्क, अनुशासित ड्राइविंग, यातायात नियमों के पालन और वाहन के नियमित रखरखाव पर निर्भर करती है।`;

  return {
    originalRegistration,
    normalizedRegistration,
    vehicleNickname,
    vehicleType,
    vehiclePurpose,
    chaldean: {
      letterBreakdown,
      alphabeticSum,
      numericSum,
      totalCompound,
      totalRoot,
      planetaryRuler: compoundDetails.ruler || `Planet ${totalRoot}`,
      planetaryRulerHi,
      compoundTitle: compoundDetails.title,
      compoundMeaning: compoundDetails.meaning,
      compoundPrediction: compoundDetails.prediction
    },
    numericAnalysis: {
      numericString,
      digitSum: numericSum,
      numericCompound,
      numericRoot,
      digitFrequencies: digitCounts,
      repeatedDigits,
      missingDigits
    },
    ownerProfile: {
      name: input.ownerName || 'Seeker',
      dob: input.ownerDob,
      mulank,
      bhagyank,
      mulankLord,
      bhagyankLord
    },
    compatibility: {
      mulankStatus,
      mulankStatusHi,
      mulankNotesHi,
      bhagyankStatus,
      bhagyankStatusHi,
      bhagyankNotesHi,
      overallRating,
      overallRatingHi,
      gridSupportNotesHi,
      missingNumberActivation,
      nameCompatibility,
      mobileComparison
    },
    vastuKua: {
      kuaNumber: kuaProfile.kuaNumber,
      kuaGroup: kuaProfile.group === 'EAST_GROUP' ? 'पूर्व समूह (East Group)' : 'पश्चिम समूह (West Group)',
      favourableDirections: kuaProfile.favourableDirections,
      parkingAdviceHi: parkingAdviceMap[totalRoot] || 'उचित और स्वच्छ स्थान पर पार्क करें।',
      elementalBalance: `तत्व संरेखण: ${kuaProfile.element}`,
      favourableColors: favourableColorsMap[totalRoot] || ['White', 'Silver'],
      dashboardRemediesHi: dashboardRemediesMap[totalRoot] || ['डैशबोर्ड को स्वच्छ रखें']
    },
    purchaseDateAnalysis,
    registrationDateAnalysis,
    purposeAlignment: {
      purpose: vehiclePurpose,
      alignmentLevel: purposeAlignmentLevel,
      notesHi: purposeNotesHi
    },
    traditionalGuidance,
    finalSummaryHi: {
      leadStatement,
      keyPoints,
      closingAdvice
    },
    safetyDisclaimer,
    metadata: {
      calculatedAt: new Date().toISOString(),
      engineVersion: 'LeoFamily-VehiclePro-v1.0',
      methodology: 'Traditional Chaldean & Vedic Numero-Vastu System'
    }
  };
}
