import { reduceToDigit, sumDigits, calculateMulank, calculateBhagyank } from './numerologyEngine';
import { buildBirthGrid } from './loshuEngine';
import { buildEnhancedGrid, EnhancedLoshuGridResult } from './enhancedLoshuEngine';
import { calculatePlanes } from './planeEngine';
import { calculateArrows } from './arrowEngine';
import { PlaneAnalysis, ArrowAnalysis } from './types';
import { CHALDEAN_LETTER_VALUES, calculateChaldeanNameSum } from './chaldeanEngine';
import { getCompoundDetails, CompoundData } from '../services/compoundDatabase';
import { parseIndianDate, formatDateForDisplay } from '../utils/dateUtils';

export interface ChildProfileInput {
  childName?: string;
  dob: string; // DD/MM/YYYY or YYYY-MM-DD
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  parentPreferredLetter?: string;
  candidateNames?: string[];
}

export interface WisdomLetterInfo {
  letter: string;
  chaldeanValue: number;
  planet: string;
  planetHi: string;
  element: string;
  elementHi: string;
  status: 'HIGHLY_SUPPORTIVE' | 'SUPPORTIVE_NEUTRAL' | 'CAUTIONARY';
  statusHi: string;
  traditionalThemeHi: string;
  whyConsiderHi: string;
  childProfileConnectionHi: string;
}

export interface CandidateNameAnalysis {
  name: string;
  cleanName: string;
  chaldeanCompound: number;
  chaldeanRoot: number;
  letterBreakdown: { letter: string; value: number; planet: string }[];
  firstLetter: {
    letter: string;
    chaldeanValue: number;
    planet: string;
    soundVibration: string;
    influenceHi: string;
  };
  vowels: {
    letters: string[];
    chaldeanCompound: number;
    chaldeanRoot: number;
    soulUrgeMeaningHi: string;
  };
  consonants: {
    letters: string[];
    chaldeanCompound: number;
    chaldeanRoot: number;
    personalityImpressionHi: string;
  };
  compoundData: CompoundData;
  dobCompatibility: {
    mulank: number;
    bhagyank: number;
    status: 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';
    statusHi: string;
    score: number; // 0-100
    mulankHarmonyHi: string;
    bhagyankHarmonyHi: string;
    whyExplanationHi: string;
  };
  missingNumberSupport: {
    missingInGrid: number[];
    introducedByLetters: number[];
    effectiveSupportHi: string;
    nameOverlayNotesHi: string;
  };
  repeatedNumberCheck: {
    repeatedInName: { digit: number; count: number; letters: string[] }[];
    hasHighRepetition: boolean;
    cautionAdviceHi: string;
  };
  developmentThemes: {
    learningStyleHi: string;
    communicationStyleHi: string;
    confidenceAndDisciplineHi: string;
    creativityAndExpressionHi: string;
    socialBehaviourHi: string;
  };
  careerAndTalentThemes: {
    talentSummaryHi: string;
    recommendedFieldsHi: string[];
    traditionalRoleNoteHi: string;
  };
  parentingAndVastuTips: {
    parentingToneHi: string;
    studyRoomVastuHi: string;
    beneficialColors: string[];
    favorableDays: string[];
  };
  spellingVariants: {
    variantName: string;
    compound: number;
    root: number;
    suitabilityHi: string;
    noteHi: string;
  }[];
}

export interface ChildLuckyNamesReport {
  childInfo: {
    name: string;
    dob: string;
    standardDob: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    mulank: number;
    mulankGraha: string;
    mulankGrahaHi: string;
    bhagyank: number;
    bhagyankGraha: string;
    bhagyankGrahaHi: string;
  };
  gridData: {
    birthGrid: Record<number, number>;
    enhancedGrid: EnhancedLoshuGridResult;
    missingNumbers: number[];
    repeatedNumbers: { digit: number; count: number }[];
    planes: PlaneAnalysis[];
    arrows: ArrowAnalysis[];
  };
  wisdomLetters: {
    highlySupportive: WisdomLetterInfo[];
    supportiveNeutral: WisdomLetterInfo[];
    cautionary: WisdomLetterInfo[];
    allLetters: WisdomLetterInfo[];
  };
  candidateAnalyses: CandidateNameAnalysis[];
  comparisonSummary: {
    names: {
      name: string;
      compound: number;
      root: number;
      compatibilityStatus: string;
      score: number;
      keyStrengthHi: string;
      considerationHi: string;
    }[];
    balancedOverviewHi: string;
  };
  parentGuidelines: {
    rulesHi: string[];
    disclaimerHi: string;
  };
}

// Planet lookup table
const PLANET_DATA: Record<number, { name: string; nameHi: string; element: string; elementHi: string }> = {
  1: { name: 'Sun (Surya)', nameHi: 'सूर्य देव (Sun)', element: 'Fire', elementHi: 'अग्नि तत्व (आत्मबल व नेतृत्व)' },
  2: { name: 'Moon (Chandra)', nameHi: 'चंद्र देव (Moon)', element: 'Water', elementHi: 'जल तत्व (संवेदनशीलता व रचनात्मकता)' },
  3: { name: 'Jupiter (Guru)', nameHi: 'गुरु / बृहस्पति (Jupiter)', element: 'Ether / Wood', elementHi: 'ज्ञान व संस्कार (बुद्धिमत्ता)' },
  4: { name: 'Rahu', nameHi: 'राहु (Rahu)', element: 'Wood / Air', elementHi: 'तकनीकी व नवीन सोच' },
  5: { name: 'Mercury (Budh)', nameHi: 'बुध देव (Mercury)', element: 'Earth', elementHi: 'पृथ्वी तत्व (संतुलन, संवाद व व्यापारिक बुद्धि)' },
  6: { name: 'Venus (Shukra)', nameHi: 'शुक्र देव (Venus)', element: 'Metal', elementHi: 'सौंदर्य, कला, आकर्षण व समृद्धि' },
  7: { name: 'Ketu', nameHi: 'केतु (Ketu)', element: 'Metal', elementHi: 'विश्लेषण, एकाग्रता व शोध वृत्ति' },
  8: { name: 'Saturn (Shani)', nameHi: 'शनि देव (Saturn)', element: 'Earth', elementHi: 'अनुशासन, धैर्य व स्थायी निर्माण' },
  9: { name: 'Mars (Mangal)', nameHi: 'मंगल देव (Mars)', element: 'Fire', elementHi: 'ऊर्जा, साहस, पराक्रम व खेल' }
};

// Friendly relationships in Indian Vedic Numerology
const FRIENDLY_NUMBERS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 5],
  3: [1, 2, 3, 5, 9],
  4: [5, 6, 7],
  5: [1, 5, 6],
  6: [5, 6, 7],
  7: [1, 3, 5, 6],
  8: [3, 5, 6, 7],
  9: [1, 2, 3, 5, 9]
};

const OPPOSING_NUMBERS: Record<number, number[]> = {
  1: [8, 6],
  2: [8, 9, 4],
  3: [6],
  4: [1, 2, 8, 9],
  5: [2],
  6: [1, 3, 9],
  7: [8, 9],
  8: [1, 2, 4, 8, 9],
  9: [2, 4, 6, 8]
};

const VOWEL_SET = new Set(['A', 'E', 'I', 'O', 'U']);

// Generate Wisdom Letters Matrix
export function calculateWisdomLetters(mulank: number, bhagyank: number, missingNumbers: number[]): {
  highlySupportive: WisdomLetterInfo[];
  supportiveNeutral: WisdomLetterInfo[];
  cautionary: WisdomLetterInfo[];
  allLetters: WisdomLetterInfo[];
} {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const friendlyMul = FRIENDLY_NUMBERS[mulank] || [1, 5];
  const friendlyBhag = FRIENDLY_NUMBERS[bhagyank] || [1, 5];
  const oppMul = OPPOSING_NUMBERS[mulank] || [8];
  const oppBhag = OPPOSING_NUMBERS[bhagyank] || [8];

  const allLetters: WisdomLetterInfo[] = letters.map((letter) => {
    const val = CHALDEAN_LETTER_VALUES[letter] || 1;
    const pData = PLANET_DATA[val] || PLANET_DATA[1];

    let status: 'HIGHLY_SUPPORTIVE' | 'SUPPORTIVE_NEUTRAL' | 'CAUTIONARY' = 'SUPPORTIVE_NEUTRAL';
    let statusHi = 'संतुलित / मध्यम अनुकूल';

    const isMulFriend = friendlyMul.includes(val);
    const isBhagFriend = friendlyBhag.includes(val);
    const isMulOpp = oppMul.includes(val);
    const isBhagOpp = oppBhag.includes(val);
    const isMissingSupport = missingNumbers.includes(val) && [1, 3, 5, 6].includes(val);

    if ((isMulFriend && isBhagFriend) || (isMulFriend && isMissingSupport) || (val === 5 || val === 1 || val === 3 || val === 6)) {
      if (!isMulOpp && !isBhagOpp) {
        status = 'HIGHLY_SUPPORTIVE';
        statusHi = 'अत्यंत अनुकूल (Highly Supportive)';
      }
    }

    if (isMulOpp || isBhagOpp || (val === 8 && [1, 2, 9].includes(mulank))) {
      status = 'CAUTIONARY';
      statusHi = 'विशेष ध्यान देने योग्य (Cautionary)';
    }

    let traditionalThemeHi = '';
    let whyConsiderHi = '';
    let childProfileConnectionHi = '';

    switch (val) {
      case 1:
        traditionalThemeHi = 'नेतृत्व, आत्मविश्वास, स्पष्ट विचार और स्वतंत्र प्रगति';
        whyConsiderHi = `अक्षर '${letter}' अंक 1 (सूर्य) से संचालित है, जो बच्चे में स्वावलंबन और आत्मबल का संचार करता है।`;
        childProfileConnectionHi = `मूलांक ${mulank} और भाग्यांक ${bhagyank} के साथ सूर्य का प्रभाव प्रतिष्ठा और स्पष्टता प्रदान करता है।`;
        break;
      case 2:
        traditionalThemeHi = 'संवेदनशीलता, सौम्यता, पारिवारिक स्नेह और कल्पनाशीलता';
        whyConsiderHi = `अक्षर '${letter}' अंक 2 (चंद्रमा) से संबंधित है, जो बच्चे के स्वभाव में कोमलता और भावनात्मक संतुलन लाता है।`;
        childProfileConnectionHi = `यह अक्षर बच्चे में कलात्मक रुचि और सहयोग की भावना को बढ़ावा देता है।`;
        break;
      case 3:
        traditionalThemeHi = 'ज्ञान, संस्कार, उच्च शिक्षा, रचनात्मकता और सकारात्मकता';
        whyConsiderHi = `अक्षर '${letter}' अंक 3 (बृहस्पति) से संचालित है, जो बौद्धिक विकास और श्रेष्ठ संस्कारों का कारक है।`;
        childProfileConnectionHi = `ज्ञान और शिक्षा के लिए गुरु का अंक बच्चे के अध्ययन पथ को सहज बनाता है।`;
        break;
      case 4:
        traditionalThemeHi = 'व्यावहारिक सोच, तकनीकी दृष्टिकोण और लीक से हटकर निर्णय';
        whyConsiderHi = `अक्षर '${letter}' अंक 4 (राहु) से जुड़ा है, जो खोजी प्रवृत्ति और आधुनिक तकनीकी क्षमता का प्रतिनिधित्व करता है।`;
        childProfileConnectionHi = `यदि अंक 4 का उपयोग हो तो अनुशासन और शांत वातावरण का विशेष ध्यान रखें।`;
        break;
      case 5:
        traditionalThemeHi = 'बुद्धि, संतुलन, वाणी का प्रभाव, तीव्र संप्रेषण और व्यापारिक समझ';
        whyConsiderHi = `अक्षर '${letter}' अंक 5 (बुध) से संचालित है, जो सभी अंकों के लिए अत्यंत सौम्य और अनुकूल माना जाता है।`;
        childProfileConnectionHi = `यह अक्षर बच्चे की भाषा, संवाद और जीवन में हर परिस्थिति में ढलने की क्षमता को मजबूत करता है।`;
        break;
      case 6:
        traditionalThemeHi = 'कला, सौंदर्य, पारिवारिक सुख, आकर्षण और सांस्कृतिक संपन्नता';
        whyConsiderHi = `अक्षर '${letter}' अंक 6 (शुक्र) से प्रभावित है, जो प्रेम, शांति और भौतिक-पारिवारिक समृद्धि लाता है।`;
        childProfileConnectionHi = `शुक्र की ऊर्जा बच्चे में सुरुचिपूर्ण व्यक्तित्व और मधुर व्यवहार का विकास करती है।`;
        break;
      case 7:
        traditionalThemeHi = 'एकाग्रता, गहन चिंतन, शोध वृत्ति और आध्यात्मिक गहराई';
        whyConsiderHi = `अक्षर '${letter}' अंक 7 (केतु) से संचालित है, जो एकाग्रचित्त होकर गहराई से अध्ययन करने में सहायक है।`;
        childProfileConnectionHi = `विश्लेषणात्मक व शोध कार्यों में स्वाभाविक रुचि विकसित करने हेतु उत्तम।`;
        break;
      case 8:
        traditionalThemeHi = 'धैर्य, कठोर परिश्रम, गंभीरता और दीर्घकालिक निर्माण';
        whyConsiderHi = `अक्षर '${letter}' अंक 8 (शनि) से जुड़ा है। न्यूमेरोलॉजी में बच्चों के लिए इस अक्षर का चुनाव सोच-समझकर किया जाता है।`;
        childProfileConnectionHi = `यदि मूलांक 1 या 9 हो, तो अंक 8 के अक्षर की जगह 1, 3 या 5 के अक्षर को प्राथमिकता दी जाती है।`;
        break;
      default:
        traditionalThemeHi = 'संतुलित ऊर्जा और स्वाभाविक विकास';
        whyConsiderHi = `सामान्य विकास और सहज जीवन प्रवाह हेतु उपयुक्त।`;
        childProfileConnectionHi = `बच्चे की जन्मतिथि के अनुरूप स्वाभाविक सामंजस्य।`;
    }

    return {
      letter,
      chaldeanValue: val,
      planet: pData.name,
      planetHi: pData.nameHi,
      element: pData.element,
      elementHi: pData.elementHi,
      status,
      statusHi,
      traditionalThemeHi,
      whyConsiderHi,
      childProfileConnectionHi
    };
  });

  const highlySupportive = allLetters.filter(l => l.status === 'HIGHLY_SUPPORTIVE');
  const supportiveNeutral = allLetters.filter(l => l.status === 'SUPPORTIVE_NEUTRAL');
  const cautionary = allLetters.filter(l => l.status === 'CAUTIONARY');

  return { highlySupportive, supportiveNeutral, cautionary, allLetters };
}

// Analyze a single candidate name in deep parent-friendly detail
export function analyzeSingleCandidateName(
  candidateName: string,
  mulank: number,
  bhagyank: number,
  missingInGrid: number[]
): CandidateNameAnalysis {
  const cleanName = candidateName.trim().toUpperCase().replace(/[^A-Z]/g, '');
  const { compound, root, breakdown } = calculateChaldeanNameSum(cleanName);
  const compoundData = getCompoundDetails(compound);

  // Letter breakdown with planetary info
  const letterBreakdown = breakdown.map(item => ({
    letter: item.letter,
    value: item.value,
    planet: PLANET_DATA[item.value]?.nameHi || 'सामान्य'
  }));

  // First letter analysis
  const firstChar = cleanName[0] || 'A';
  const firstCharVal = CHALDEAN_LETTER_VALUES[firstChar] || 1;
  const firstCharPlanet = PLANET_DATA[firstCharVal]?.nameHi || 'सूर्य';
  
  const firstLetter = {
    letter: firstChar,
    chaldeanValue: firstCharVal,
    planet: firstCharPlanet,
    soundVibration: `ध्वनि कंपन ${firstCharVal} (${firstCharPlanet})`,
    influenceHi: `नाम का पहला अक्षर '${firstChar}' बच्चे के प्रारंभिक स्वभाव और तुरंत प्रतिक्रिया देने की शैली पर प्रभाव डालता है। यह ${firstCharPlanet} के गुणों से युक्त है।`
  };

  // Vowels and Consonants
  const vowelsList: string[] = [];
  const consonantsList: string[] = [];
  let vowelSum = 0;
  let consonantSum = 0;

  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    const val = CHALDEAN_LETTER_VALUES[char] || 0;
    if (VOWEL_SET.has(char)) {
      vowelsList.push(char);
      vowelSum += val;
    } else {
      consonantsList.push(char);
      consonantSum += val;
    }
  }

  const vowelCompound = vowelSum;
  const vowelRoot = reduceToDigit(vowelSum) || 1;
  const consonantCompound = consonantSum;
  const consonantRoot = reduceToDigit(consonantSum) || 1;

  const vowels = {
    letters: vowelsList,
    chaldeanCompound: vowelCompound,
    chaldeanRoot: vowelRoot,
    soulUrgeMeaningHi: `स्वरों का कुल योग ${vowelCompound} (${vowelRoot}) बच्चे की आंतरिक इच्छाओं, प्रेरणा और मन की शांति की दिशा को दर्शाता है।`
  };

  const consonants = {
    letters: consonantsList,
    chaldeanCompound: consonantCompound,
    chaldeanRoot: consonantRoot,
    personalityImpressionHi: `व्यंजनों का कुल योग ${consonantCompound} (${consonantRoot}) बच्चे के बाहरी आचरण, दूसरों पर पड़ने वाले प्रभाव और सामाजिक छवि को इंगित करता है।`
  };

  // DOB Compatibility
  const friendlyMul = FRIENDLY_NUMBERS[mulank] || [1, 5];
  const friendlyBhag = FRIENDLY_NUMBERS[bhagyank] || [1, 5];
  const oppMul = OPPOSING_NUMBERS[mulank] || [8];
  const oppBhag = OPPOSING_NUMBERS[bhagyank] || [8];

  let status: 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION' = 'SUPPORTIVE';
  let statusHi = 'अनुकूल व सहयोगी (Supportive)';
  let score = 85;

  const isMulFriend = friendlyMul.includes(root);
  const isBhagFriend = friendlyBhag.includes(root);
  const isMulOpp = oppMul.includes(root);
  const isBhagOpp = oppBhag.includes(root);

  if (isMulFriend && isBhagFriend) {
    status = 'SUPPORTIVE';
    statusHi = 'अत्यंत अनुकूल व शुभ (Highly Supportive)';
    score = 92;
  } else if (isMulOpp || isBhagOpp) {
    status = 'NEEDS_ATTENTION';
    statusHi = 'पुनर्विचार योग्य / ध्यान देने योग्य (Needs Attention)';
    score = 55;
  } else {
    status = 'NEUTRAL';
    statusHi = 'संतुलित व सामान्य (Neutral)';
    score = 72;
  }

  const mulankHarmonyHi = isMulFriend 
    ? `मूलांक ${mulank} के साथ नाम का मूलांक ${root} पूर्ण सामंजस्य में है, जिससे बच्चे के आत्मविश्वास और स्वभाव में संतुलन रहता है।`
    : isMulOpp 
    ? `मूलांक ${mulank} और नाम अंक ${root} में पारंपरिक रूप से कुछ विपरीत ऊर्जा मानी जाती है।`
    : `मूलांक ${mulank} के साथ नाम का अंक ${root} सामान्य और सहज संबंध रखता है।`;

  const bhagyankHarmonyHi = isBhagFriend
    ? `भाग्यांक ${bhagyank} के साथ नाम अंक ${root} भाग्य और जीवन के दीर्घकालिक अवसरों को बल देता है।`
    : isBhagOpp
    ? `भाग्यांक ${bhagyank} के साथ यह अंक कुछ अलग प्राथमिकताएं दर्शाता है।`
    : `भाग्यांक ${bhagyank} के साथ यह संयोजन संतुलित प्रगति का मार्ग प्रशस्त करता है।`;

  const whyExplanationHi = `Traditional numerology के अनुसार, नाम का कुल मूलांक ${root} (संयुक्त संख्या ${compound}) बच्चे के मूलांक ${mulank} और भाग्यांक ${bhagyank} के साथ ${statusHi} संबंध बनाता है। यह नाम ${compoundData.title} की ऊर्जा वहन करता है।`;

  // Missing Number Support (Name Overlay)
  const lettersValues = cleanName.split('').map(c => CHALDEAN_LETTER_VALUES[c] || 0);
  const distinctNameValues = Array.from(new Set(lettersValues)).filter(v => v > 0);
  const supportedMissing = missingInGrid.filter(num => distinctNameValues.includes(num));

  const effectiveSupportHi = supportedMissing.length > 0
    ? `यह नाम बच्चे के जन्म ग्रिड में अनुपस्थित अंक [${supportedMissing.join(', ')}] को नाम अक्षरों के माध्यम से पूरक सहयोग (Name Overlay) प्रदान करता है।`
    : `नाम की ऊर्जा ग्रिड के मौजूदा मजबूत पक्षों को स्थिर बनाए रखती है।`;

  const nameOverlayNotesHi = `ध्यान दें: यह नाम सहयोग केवल ध्वन्यात्मक तरंगों (Sound Waves) का पूरक है; यह जन्मकुंडली या भौतिक बर्थ ग्रिड को बदलता नहीं है बल्कि एक सकारात्मक सुरक्षात्मक वातावरण तैयार करता है।`;

  // Repeated numbers check in name
  const digitCounts: Record<number, { count: number; letters: string[] }> = {};
  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    const val = CHALDEAN_LETTER_VALUES[char];
    if (val) {
      if (!digitCounts[val]) digitCounts[val] = { count: 0, letters: [] };
      digitCounts[val].count += 1;
      digitCounts[val].letters.push(char);
    }
  }

  const repeatedInName = Object.entries(digitCounts)
    .filter(([_, data]) => data.count >= 2)
    .map(([digit, data]) => ({ digit: parseInt(digit, 10), count: data.count, letters: Array.from(new Set(data.letters)) }));

  const hasHighRepetition = repeatedInName.some(r => r.count >= 3);
  const cautionAdviceHi = hasHighRepetition
    ? `नाम में कुछ अक्षरों की आवृत्ति (Repetition) अधिक है। पारंपरिक दृष्टिकोण से इसे संतुलित रखने के लिए बच्चे के पालन-पोषण में विविधता और अभिव्यक्ति की स्वतंत्रता को बढ़ावा दें।`
    : `नाम में अक्षरों का वितरण संतुलित है, जिससे ऊर्जा का प्रवाह सहज रहता है।`;

  // Personality and Development Themes
  const devMap: Record<number, { learning: string; comm: string; conf: string; creat: string; social: string }> = {
    1: {
      learning: 'स्वयं प्रयोग करके सीखने में तेज, स्वतंत्र अध्ययन में विशेष रुचि।',
      comm: 'स्पष्ट, सीधी और आत्मविश्वासी बातचीत।',
      conf: 'उच्च स्वाभिमान, नेतृत्व करने की स्वाभाविक इच्छा।',
      creat: 'नए और मौलिक विचारों को जन्म देने की क्षमता।',
      social: 'समूह में आगे बढ़कर अगुआई करने वाला।'
    },
    2: {
      learning: 'कहानियों, चित्रों और शांत मार्गदर्शन से तेजी से सीखता है।',
      comm: 'मधुर, संवेदनशील और दूसरों की भावनाओं का आदर करने वाली वाणी।',
      conf: 'प्रोत्साहन और स्नेह से आत्मविश्वास बढ़ता है।',
      creat: 'उच्च कल्पनाशीलता, कला और संगीत में गहरी रुचि।',
      social: 'मित्रवत, सहयोगी और शांतिप्रिय स्वभाव।'
    },
    3: {
      learning: 'जिज्ञासु, प्रश्नों के माध्यम से गहराई से समझने वाला।',
      comm: 'अभिव्यक्ति में कुशल, समृद्ध शब्दावली और रोचक संवाद।',
      conf: 'स्वाभाविक ज्ञान और संस्कारों से युक्त।',
      creat: 'साहित्य, लेखन और मौखिक कलाओं में प्रखर।',
      social: 'सदा प्रसन्न, शिक्षक व बुजुर्गों का प्रिय।'
    },
    4: {
      learning: 'चीजों को खोलकर देखने, बनाने और व्यावहारिक ढंग से समझने वाला।',
      comm: 'तार्किक, तथ्यपरक और बिंदुवार बोलने वाला।',
      conf: 'स्पष्ट नियमों और व्यवस्था से आत्मबल प्राप्त होता है।',
      creat: 'डिजाइन, कंस्ट्रक्शन और नवीन गैजेट्स में रुचि।',
      social: 'विश्वसनीय और समर्पित मित्रों का दायरा।'
    },
    5: {
      learning: 'बहुआयामी, एक साथ कई विषयों को तेजी से ग्रहण करने वाला।',
      comm: 'हाजिरजवाब, चंचल और सम्मोहक संवाद शैली।',
      conf: 'नई परिस्थितियों और यात्राओं में तुरंत सहज होना।',
      creat: 'त्वरित समस्या निवारण और बहुमुखी प्रतिभा।',
      social: 'विशाल मित्र मंडली और हर उम्र के लोगों में लोकप्रिय।'
    },
    6: {
      learning: 'सुरुचिपूर्ण, कलात्मक और सामंजस्यपूर्ण माहौल में सर्वोत्तम प्रदर्शन।',
      comm: 'सौम्य, आदरयुक्त और स्नेहपूर्ण बातचीत।',
      conf: 'सकारात्मक प्रशंसा और सुंदर परिवेश से खिलता है।',
      creat: 'रंग संयोजन, शिल्प, संगीत और नाटक में उत्कृष्ट।',
      social: 'परिवार से गहरा लगाव, आतिथ्य सत्कार में निपुण।'
    },
    7: {
      learning: 'एकांत में गहराई से अध्ययन, वैज्ञानिक और तार्किक सोच।',
      comm: 'सोच-समझकर कम बोलने वाला, अर्थपूर्ण संवाद।',
      conf: 'गहन ज्ञान और विषय की पकड़ से आत्मविश्वास।',
      creat: 'गूढ़ रहस्यों, प्रकृति और शोध में रुचि।',
      social: 'चुनिंदा और गहरे मित्रों का संग।'
    },
    8: {
      learning: 'निरंतर अभ्यास, धैर्य और चरणबद्ध तरीके से सीखने वाला।',
      comm: 'गंभीर, परिपक्व और नपे-तुले शब्द।',
      conf: 'मेहनत और ठोस उपलब्धियों से बढ़ता आत्मबल।',
      creat: 'बड़ी योजनाओं और मजबूत ढांचों का निर्माण।',
      social: 'जिम्मेदार और शांत आचरण।'
    },
    9: {
      learning: 'ऊर्जावान, खेलकूद और प्रत्यक्ष अनुभव से सीखने वाला।',
      comm: 'उत्साही, जोशीली और स्पष्ट अभिव्यक्ति।',
      conf: 'साहसी, चुनौतियों का निडरता से सामना करने वाला।',
      creat: 'एक्शन, ड्रामा और सामूहिक गतिविधियों में नेतृत्व।',
      social: 'मददगार, रक्षक और न्यायप्रिय भावना।'
    }
  };

  const devTheme = devMap[root] || devMap[1];

  const developmentThemes = {
    learningStyleHi: devTheme.learning,
    communicationStyleHi: devTheme.comm,
    confidenceAndDisciplineHi: devTheme.conf,
    creativityAndExpressionHi: devTheme.creat,
    socialBehaviourHi: devTheme.social
  };

  // Career and Talent Themes
  const careerMap: Record<number, { summary: string; fields: string[]; roleNote: string }> = {
    1: {
      summary: 'नेतृत्व, प्रशासनिक निर्णय और स्वतंत्र उद्यम के गुण।',
      fields: ['सिविल सर्विसेज / प्रशासन', 'कॉर्पोरेट मैनेजमेंट', 'उद्यमिता (Startup / Business)', 'कानून व नीति निर्माण'],
      roleNote: 'पारंपरिक विधा में इसे उच्च पद, प्रबंधन और निर्णय लेने वाली भूमिकाओं के लिए शुभ माना जाता है।'
    },
    2: {
      summary: 'काउंसलिंग, रचनात्मक कलाएं, जनसंपर्क और देखभाल से जुड़े क्षेत्र।',
      fields: ['मनोविज्ञान व काउंसलिंग', 'कला व डिजाइनिंग', 'हॉस्पिटैलिटी व वेलनेस', 'लेखन व मीडिया'],
      roleNote: 'यह संयोजन संवेदनशीलता और लोगों को जोड़ने वाले कार्यों में सफलता का संकेत देता है।'
    },
    3: {
      summary: 'शिक्षा, मार्गदर्शन, वित्तीय सलाहकार और उच्च बौद्धिक कार्य।',
      fields: ['अध्यापन व प्रोफेसर', 'वित्तीय व कानूनी सलाहकार', 'साहित्य व प्रकाशन', 'धार्मिक व दार्शनिक शोध'],
      roleNote: 'गुरु के प्रभाव से यह अंक ज्ञान के प्रसार और सम्मानजनक सलाहकार भूमिकाओं का कारक है।'
    },
    4: {
      summary: 'सूचना प्रौद्योगिकी, डेटा विश्लेषण, इंजीनियरिंग और आधुनिक नवाचार।',
      fields: ['सॉफ्टवेयर व एआई टेक्नोलॉजी', 'डेटा साइंस व एनालिटिक्स', 'आर्किटेक्चर व सिविल इंजीनियरिंग', 'अनुसंधान व विकास'],
      roleNote: 'आधुनिक युग में यह अंक तकनीकी कौशल और जटिल समस्याओं को हल करने में सहायक माना जाता है।'
    },
    5: {
      summary: 'व्यापार, जनसंचार, डिजिटल मार्केटिंग, बैंकिंग और अंतरराष्ट्रीय संबंध।',
      fields: ['ई-कॉमर्स व बिजनेस मैनेजमेंट', 'पत्रकारिता व मास मीडिया', 'बैंकिंग व स्टॉक मार्केट', 'भाषा विशेषज्ञ व राजदूत'],
      roleNote: 'बुध के प्रभाव से यह अंक तीव्र बुद्धि, नेटवर्किंग और व्यापारिक विस्तार का प्रतीक है।'
    },
    6: {
      summary: 'डिजाइनिंग, सिनेमा, फैशन, विलासिता उत्पाद, होटल प्रबंधन और सौंदर्य उद्योग।',
      fields: ['फैशन व इंटीरियर डिजाइन', 'सिनेमा व परफॉर्मिंग आर्ट्स', 'लक्जरी ब्रांड्स मैनेजमेंट', 'कॉस्मेटिक्स व वेलनेस इंडस्ट्री'],
      roleNote: 'शुक्र का यह अंक जीवन में लोकप्रियता, कलात्मक ऊंचाई और समृद्धि का समर्थन करता है।'
    },
    7: {
      summary: 'वैज्ञानिक अनुसंधान, दर्शन, कोडिंग, फॉरेंसिक और उच्च विश्लेषण।',
      fields: ['वैज्ञानिक अनुसंधान (R&D)', 'साइबर सिक्योरिटी व कोडिंग', 'ज्योतिष व गूढ़ विज्ञान', 'दर्शनशास्त्र व उच्च शिक्षा'],
      roleNote: 'केतु का अंक गहन विश्लेषण, एकाग्रता और खोजपूर्ण क्षेत्रों में विशिष्ट पहचान दिलाता है।'
    },
    8: {
      summary: 'रियल एस्टेट, भारी उद्योग, कानून, न्यायपालिका और बड़े वित्तीय संस्थान।',
      fields: ['ज्यूडिशियरी व वकालत', 'रियल एस्टेट व इंफ्रास्ट्रक्चर', 'मैन्युफैक्चरिंग व मेटल इंडस्ट्री', 'ऑडिटिंग व टैक्स कंसल्टेंसी'],
      roleNote: 'शनि का अंक दीर्घकालिक स्थिरता, बड़े प्रोजेक्ट्स और प्रशासनिक अनुशासन का परिचायक है।'
    },
    9: {
      summary: 'रक्षा सेवाएं, खेलकूद, सर्जरी व चिकित्सा, आपातकालीन सेवाएं और सामाजिक सुधार।',
      fields: ['डिफेंस व पुलिस सर्विसेज', 'स्पोर्ट्स व एथलेटिक्स', 'सर्जरी व आपातकालीन चिकित्सा', 'सोशल रिफॉर्म्स व एनजीओ'],
      roleNote: 'मंगल का अंक साहस, ऊर्जा, मानव सेवा और चुनौतीपूर्ण अभियानों में विजय का कारक है।'
    }
  };

  const cTheme = careerMap[root] || careerMap[1];
  const careerAndTalentThemes = {
    talentSummaryHi: cTheme.summary,
    recommendedFieldsHi: cTheme.fields,
    traditionalRoleNoteHi: cTheme.roleNote
  };

  // Parenting & Vastu Tips
  const parentingAndVastuTips = {
    parentingToneHi: `बच्चे के साथ ${root === 1 ? 'सम्मानजनक व प्रोत्साहनकारी' : root === 2 ? 'अत्यंत सौम्य व भावनात्मक' : root === 3 ? 'ज्ञानवर्धक व चर्चा आधारित' : root === 5 ? 'मित्रवत व संवादात्मक' : root === 6 ? 'प्रसन्नचित्त व सुरुचिपूर्ण' : 'धैर्यपूर्ण व शांत'} दृष्टिकोण अपनाएं।`,
    studyRoomVastuHi: `बच्चे के अध्ययन की मेज पूर्व (East) या उत्तर-पूर्व (North-East) दिशा में रखें, जिससे सकारात्मक ऊर्जा का प्रवाह बना रहे।`,
    beneficialColors: root === 1 ? ['Light Yellow', 'Golden', 'White'] : root === 2 ? ['White', 'Cream', 'Light Green'] : root === 3 ? ['Yellow', 'Saffron', 'Light Blue'] : root === 5 ? ['Light Green', 'Emerald', 'Pastel Shades'] : root === 6 ? ['Pink', 'Cream', 'Silver White'] : ['Blue', 'Green', 'Pastel Yellow'],
    favorableDays: root === 1 ? ['Sunday', 'Thursday'] : root === 2 ? ['Monday', 'Sunday'] : root === 3 ? ['Thursday', 'Tuesday'] : root === 5 ? ['Wednesday', 'Friday'] : root === 6 ? ['Friday', 'Wednesday'] : ['Wednesday', 'Thursday']
  };

  // Generate Subtle Spelling Variants
  const spellingVariants = generateSpellingVariants(cleanName, mulank, bhagyank);

  return {
    name: candidateName,
    cleanName,
    chaldeanCompound: compound,
    chaldeanRoot: root,
    letterBreakdown,
    firstLetter,
    vowels,
    consonants,
    compoundData,
    dobCompatibility: {
      mulank,
      bhagyank,
      status,
      statusHi,
      score,
      mulankHarmonyHi,
      bhagyankHarmonyHi,
      whyExplanationHi
    },
    missingNumberSupport: {
      missingInGrid,
      introducedByLetters: supportedMissing,
      effectiveSupportHi,
      nameOverlayNotesHi
    },
    repeatedNumberCheck: {
      repeatedInName,
      hasHighRepetition,
      cautionAdviceHi
    },
    developmentThemes,
    careerAndTalentThemes,
    parentingAndVastuTips,
    spellingVariants
  };
}

// Generate slight spelling variations (e.g. AMAN -> AMAAN, AAMAN, AMANN)
function generateSpellingVariants(cleanName: string, mulank: number, bhagyank: number): {
  variantName: string;
  compound: number;
  root: number;
  suitabilityHi: string;
  noteHi: string;
}[] {
  const variants: { variantName: string; compound: number; root: number; suitabilityHi: string; noteHi: string }[] = [];
  const baseComp = calculateChaldeanNameSum(cleanName).compound;

  // Add subtle modifications
  const testList: string[] = [];

  // Vowel doubling or 'H' / 'N' adjustment
  if (cleanName.includes('A')) testList.push(cleanName.replace('A', 'AA'));
  if (cleanName.includes('I')) testList.push(cleanName.replace('I', 'EE'));
  if (cleanName.includes('U')) testList.push(cleanName.replace('U', 'OO'));
  if (!cleanName.endsWith('H')) testList.push(cleanName + 'H');
  if (!cleanName.endsWith('N')) testList.push(cleanName + 'N');
  if (cleanName.length > 3) testList.push(cleanName.slice(0, 1) + 'A' + cleanName.slice(1));

  const uniqueTests = Array.from(new Set(testList)).slice(0, 4);

  const friendlyMul = FRIENDLY_NUMBERS[mulank] || [1, 5];
  const friendlyBhag = FRIENDLY_NUMBERS[bhagyank] || [1, 5];

  uniqueTests.forEach(testName => {
    const { compound, root } = calculateChaldeanNameSum(testName);
    if (compound !== baseComp) {
      const isGood = (friendlyMul.includes(root) && friendlyBhag.includes(root)) || [1, 3, 5, 6].includes(root);
      variants.push({
        variantName: testName,
        compound,
        root,
        suitabilityHi: isGood ? 'अनुकूल व शुभ विकल्प' : 'वैकल्पिक रूप',
        noteHi: `संयुक्त संख्या ${compound} (मूलांक ${root}) उत्पन्न करता है।`
      });
    }
  });

  return variants;
}

// Main Public Analysis Function for Child Lucky Names Pro
export function analyzeChildLuckyNamesPro(input: ChildProfileInput): ChildLuckyNamesReport {
  const dobStr = input.dob;
  const standardDob = formatDateForDisplay(dobStr);

  const mulank = calculateMulank(dobStr);
  const bhagyank = calculateBhagyank(dobStr);

  const mulankGraha = PLANET_DATA[mulank]?.name || 'Sun';
  const mulankGrahaHi = PLANET_DATA[mulank]?.nameHi || 'सूर्य देव';
  const bhagyankGraha = PLANET_DATA[bhagyank]?.name || 'Jupiter';
  const bhagyankGrahaHi = PLANET_DATA[bhagyank]?.nameHi || 'बृहस्पति देव';

  // Build Grids
  const birthGrid = buildBirthGrid(dobStr);
  const enhancedGrid = buildEnhancedGrid(birthGrid, mulank, bhagyank);
  const planes = calculatePlanes(enhancedGrid.flatGrid, birthGrid, mulank, bhagyank);
  const arrows = calculateArrows(enhancedGrid.flatGrid);

  // Missing numbers in birth grid
  const missingNumbers: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!birthGrid[i] || birthGrid[i] === 0) {
      missingNumbers.push(i);
    }
  }

  // Repeated numbers in birth grid
  const repeatedNumbers: { digit: number; count: number }[] = [];
  for (let i = 1; i <= 9; i++) {
    if (birthGrid[i] && birthGrid[i] > 1) {
      repeatedNumbers.push({ digit: i, count: birthGrid[i] });
    }
  }

  // Calculate Wisdom Starting Letters
  const wisdomLetters = calculateWisdomLetters(mulank, bhagyank, missingNumbers);

  // Candidate Names to analyze
  const candidateNamesList = input.candidateNames && input.candidateNames.length > 0
    ? input.candidateNames
    : input.childName && input.childName.trim().length > 0
    ? [input.childName.trim()]
    : ['Aarav', 'Ananya', 'Advik'];

  const candidateAnalyses = candidateNamesList.map(name => 
    analyzeSingleCandidateName(name, mulank, bhagyank, missingNumbers)
  );

  // Comparison summary
  const namesSummary = candidateAnalyses.map(ana => ({
    name: ana.name,
    compound: ana.chaldeanCompound,
    root: ana.chaldeanRoot,
    compatibilityStatus: ana.dobCompatibility.statusHi,
    score: ana.dobCompatibility.score,
    keyStrengthHi: ana.compoundData.title || `ऊर्जा अंक ${ana.chaldeanRoot}`,
    considerationHi: ana.dobCompatibility.whyExplanationHi
  }));

  const balancedOverviewHi = `प्रस्तुत सभी नाम विकल्पों का विश्लेषण बच्चे की जन्मतिथि (${standardDob}), मूलांक ${mulank} एवं भाग्यांक ${bhagyank} के आधार पर किया गया है। प्रत्येक नाम अपने विशिष्ट ध्वन्यात्मक गुणों के साथ बच्चे के विकास को सहयोग देता है।`;

  const parentGuidelines = {
    rulesHi: [
      '1. नाम का अर्थ शुभ, प्रेरणादायक और सकारात्मक होना चाहिए।',
      '2. उच्चारण सरल, मधुर और स्पष्ट होना चाहिए ताकि बच्चा और अन्य लोग इसे सरलता से बोल सकें।',
      '3. परिवार की सांस्कृतिक, भाषाई व आध्यात्मिक परंपराओं का सम्मान सर्वोपरि रखें।',
      '4. नाम की संयुक्त संख्या (Chaldean Compound) बच्चे के मूलांक व भाग्यांक से मित्रवत हो।',
      '5. नाम केवल एक सकारात्मक माध्यम है; माता-पिता का सच्चा प्रेम, संस्कार और उत्तम शिक्षा ही बच्चे के उज्ज्वल भविष्य की वास्तविक नींव हैं।'
    ],
    disclaimerHi: 'महत्वपूर्ण सूचना: न्यूमेरोलॉजी विश्लेषण एक प्राचीन प्रतीकात्मक एवं मार्गदर्शक प्रणाली है। यह किसी भी प्रकार के भविष्यफल या सफलता की कोई पूर्ण गारंटी का दावा नहीं करता है।'
  };

  return {
    childInfo: {
      name: input.childName || 'Child',
      dob: dobStr,
      standardDob,
      gender: input.gender || 'OTHER',
      mulank,
      mulankGraha,
      mulankGrahaHi,
      bhagyank,
      bhagyankGraha,
      bhagyankGrahaHi
    },
    gridData: {
      birthGrid,
      enhancedGrid,
      missingNumbers,
      repeatedNumbers,
      planes,
      arrows
    },
    wisdomLetters,
    candidateAnalyses,
    comparisonSummary: {
      names: namesSummary,
      balancedOverviewHi
    },
    parentGuidelines
  };
}

// Rich Baby Name Dictionary for the Name Finder / Generator
export interface BabyNameDictionaryItem {
  name: string;
  gender: 'BOY' | 'GIRL' | 'UNISEX';
  startingLetter: string;
  meaningHi: string;
  meaningEn: string;
  chaldeanCompound: number;
  chaldeanRoot: number;
  focusGoal: 'Knowledge' | 'Confidence' | 'Creativity' | 'Leadership' | 'Prosperity' | 'Harmony' | 'Courage';
}

export const CURATED_BABY_NAMES_LIBRARY: BabyNameDictionaryItem[] = [
  // A
  { name: 'Aarav', gender: 'BOY', startingLetter: 'A', meaningHi: 'शांत, ज्ञानवान व सम्मोहक', meaningEn: 'Peaceful, knowledgeable', chaldeanCompound: 13, chaldeanRoot: 4, focusGoal: 'Knowledge' },
  { name: 'Aaditya', gender: 'BOY', startingLetter: 'A', meaningHi: 'सूर्य देव, प्रकाश व तेज', meaningEn: 'The Sun, radiant', chaldeanCompound: 18, chaldeanRoot: 9, focusGoal: 'Leadership' },
  { name: 'Aadvik', gender: 'BOY', startingLetter: 'A', meaningHi: 'अद्वितीय, अनोखा', meaningEn: 'Unique, matchless', chaldeanCompound: 17, chaldeanRoot: 8, focusGoal: 'Confidence' },
  { name: 'Ananya', gender: 'GIRL', startingLetter: 'A', meaningHi: 'अतुलनीय, देवी पार्वती', meaningEn: 'Incomparable, boundless', chaldeanCompound: 17, chaldeanRoot: 8, focusGoal: 'Creativity' },
  { name: 'Aadhya', gender: 'GIRL', startingLetter: 'A', meaningHi: 'प्रथम शक्ति, देवी दुर्गा', meaningEn: 'First power, Goddess Durga', chaldeanCompound: 16, chaldeanRoot: 7, focusGoal: 'Harmony' },
  { name: 'Anika', gender: 'GIRL', startingLetter: 'A', meaningHi: 'कृपामयी, सौंदर्य व प्रतिभा', meaningEn: 'Grace, brilliance', chaldeanCompound: 15, chaldeanRoot: 6, focusGoal: 'Prosperity' },
  { name: 'Advait', gender: 'BOY', startingLetter: 'A', meaningHi: 'अद्वैत, अद्वितीय', meaningEn: 'Non-dual, unique', chaldeanCompound: 19, chaldeanRoot: 1, focusGoal: 'Leadership' },
  { name: 'Arya', gender: 'UNISEX', startingLetter: 'A', meaningHi: 'श्रेष्ठ, कुलीन, आदरणीय', meaningEn: 'Noble, honorable', chaldeanCompound: 10, chaldeanRoot: 1, focusGoal: 'Leadership' },
  
  // B & C
  { name: 'Bhavin', gender: 'BOY', startingLetter: 'B', meaningHi: 'सुंदर अस्तित्व, विजेता', meaningEn: 'Winner, beautiful being', chaldeanCompound: 21, chaldeanRoot: 3, focusGoal: 'Knowledge' },
  { name: 'Bhavya', gender: 'GIRL', startingLetter: 'B', meaningHi: 'भव्य, कल्याणकारी, विशाल', meaningEn: 'Grand, splendid', chaldeanCompound: 20, chaldeanRoot: 2, focusGoal: 'Creativity' },
  { name: 'Chirag', gender: 'BOY', startingLetter: 'C', meaningHi: 'दीपक, प्रकाश फैलाने वाला', meaningEn: 'Lamp, guiding light', chaldeanCompound: 19, chaldeanRoot: 1, focusGoal: 'Leadership' },
  { name: 'Charvi', gender: 'GIRL', startingLetter: 'C', meaningHi: 'अति सुंदर स्त्री', meaningEn: 'Beautiful woman', chaldeanCompound: 22, chaldeanRoot: 4, focusGoal: 'Harmony' },

  // D & E
  { name: 'Devansh', gender: 'BOY', startingLetter: 'D', meaningHi: 'ईश्वर का अंश', meaningEn: 'Part of God', chaldeanCompound: 30, chaldeanRoot: 3, focusGoal: 'Knowledge' },
  { name: 'Divya', gender: 'GIRL', startingLetter: 'D', meaningHi: 'दिव्य, अलौकिक प्रकाश', meaningEn: 'Divine, radiant light', chaldeanCompound: 17, chaldeanRoot: 8, focusGoal: 'Creativity' },
  { name: 'Dhruv', gender: 'BOY', startingLetter: 'D', meaningHi: 'अटल, ध्रुव तारा', meaningEn: 'Pole star, steadfast', chaldeanCompound: 23, chaldeanRoot: 5, focusGoal: 'Prosperity' },
  { name: 'Eshaan', gender: 'BOY', startingLetter: 'E', meaningHi: 'भगवान शिव, पूर्व दिशा', meaningEn: 'Lord Shiva, ruler', chaldeanCompound: 21, chaldeanRoot: 3, focusGoal: 'Leadership' },
  { name: 'Ekata', gender: 'GIRL', startingLetter: 'E', meaningHi: 'एकता, सद्भाव', meaningEn: 'Unity, harmony', chaldeanCompound: 15, chaldeanRoot: 6, focusGoal: 'Harmony' },

  // G & H
  { name: 'Gaurav', gender: 'BOY', startingLetter: 'G', meaningHi: 'गौरव, सम्मान, प्रतिष्ठा', meaningEn: 'Pride, honor', chaldeanCompound: 25, chaldeanRoot: 7, focusGoal: 'Leadership' },
  { name: 'Gauri', gender: 'GIRL', startingLetter: 'G', meaningHi: 'देवी पार्वती, उज्ज्वल', meaningEn: 'Goddess Parvati, fair', chaldeanCompound: 17, chaldeanRoot: 8, focusGoal: 'Harmony' },
  { name: 'Hrithik', gender: 'BOY', startingLetter: 'H', meaningHi: 'सत्यवादी, दिल से सच्चा', meaningEn: 'From the heart, truthful', chaldeanCompound: 23, chaldeanRoot: 5, focusGoal: 'Prosperity' },
  { name: 'Harshita', gender: 'GIRL', startingLetter: 'H', meaningHi: 'सदा प्रसन्न, हर्षित', meaningEn: 'Joyful, full of cheer', chaldeanCompound: 28, chaldeanRoot: 1, focusGoal: 'Harmony' },

  // I & J & K
  { name: 'Ishaan', gender: 'BOY', startingLetter: 'I', meaningHi: 'सूर्य का तेज, भगवान शिव', meaningEn: 'Radiance, Lord Shiva', chaldeanCompound: 19, chaldeanRoot: 1, focusGoal: 'Leadership' },
  { name: 'Isha', gender: 'GIRL', startingLetter: 'I', meaningHi: 'सुरक्षात्मक देवी, शक्ति', meaningEn: 'Goddess, protective power', chaldeanCompound: 13, chaldeanRoot: 4, focusGoal: 'Creativity' },
  { name: 'Kabir', gender: 'BOY', startingLetter: 'K', meaningHi: 'महान, संत व कवि', meaningEn: 'The Great, famous poet', chaldeanCompound: 13, chaldeanRoot: 4, focusGoal: 'Knowledge' },
  { name: 'Kavya', gender: 'GIRL', startingLetter: 'K', meaningHi: 'कविता, कलात्मक रचना', meaningEn: 'Poetry, artistic expression', chaldeanCompound: 17, chaldeanRoot: 8, focusGoal: 'Creativity' },
  { name: 'Kiaan', gender: 'BOY', startingLetter: 'K', meaningHi: 'ईश्वरीय कृपा, राजा', meaningEn: 'Grace of God, royal', chaldeanCompound: 14, chaldeanRoot: 5, focusGoal: 'Prosperity' },
  { name: 'Kiara', gender: 'GIRL', startingLetter: 'K', meaningHi: 'उज्ज्वल, स्पष्ट', meaningEn: 'Bright, clear', chaldeanCompound: 14, chaldeanRoot: 5, focusGoal: 'Confidence' },

  // L & M & N
  { name: 'Laksh', gender: 'BOY', startingLetter: 'L', meaningHi: 'लक्ष्य, ध्येय', meaningEn: 'Aim, target', chaldeanCompound: 18, chaldeanRoot: 9, focusGoal: 'Courage' },
  { name: 'Lavanya', gender: 'GIRL', startingLetter: 'L', meaningHi: 'सौंदर्य, शालीनता', meaningEn: 'Grace, elegance', chaldeanCompound: 22, chaldeanRoot: 4, focusGoal: 'Harmony' },
  { name: 'Manan', gender: 'BOY', startingLetter: 'M', meaningHi: 'गहन चिंतन, विचार', meaningEn: 'Meditation, deep thought', chaldeanCompound: 19, chaldeanRoot: 1, focusGoal: 'Knowledge' },
  { name: 'Mira', gender: 'GIRL', startingLetter: 'M', meaningHi: 'शांति, भक्त शिरोमणि', meaningEn: 'Peace, ocean, devotee', chaldeanCompound: 11, chaldeanRoot: 2, focusGoal: 'Harmony' },
  { name: 'Navya', gender: 'GIRL', startingLetter: 'N', meaningHi: 'नई, आधुनिक व सराहनीय', meaningEn: 'New, praiseworthy', chaldeanCompound: 19, chaldeanRoot: 1, focusGoal: 'Creativity' },
  { name: 'Neev', gender: 'BOY', startingLetter: 'N', meaningHi: 'मजबूत नींव, आधार', meaningEn: 'Foundation, strong base', chaldeanCompound: 22, chaldeanRoot: 4, focusGoal: 'Confidence' },

  // P & R & S
  { name: 'Pranav', gender: 'BOY', startingLetter: 'P', meaningHi: 'पवित्र ॐ की ध्वनि', meaningEn: 'Sacred sound Om', chaldeanCompound: 27, chaldeanRoot: 9, focusGoal: 'Knowledge' },
  { name: 'Pari', gender: 'GIRL', startingLetter: 'P', meaningHi: 'परी, सुंदर व निर्मल', meaningEn: 'Fairy, pure beauty', chaldeanCompound: 15, chaldeanRoot: 6, focusGoal: 'Harmony' },
  { name: 'Reyansh', gender: 'BOY', startingLetter: 'R', meaningHi: 'सूर्य की पहली किरण', meaningEn: 'First ray of sunlight', chaldeanCompound: 26, chaldeanRoot: 8, focusGoal: 'Leadership' },
  { name: 'Riya', gender: 'GIRL', startingLetter: 'R', meaningHi: 'सुरीला गायन, देवी लक्ष्मी', meaningEn: 'Graceful singer, wealth', chaldeanCompound: 11, chaldeanRoot: 2, focusGoal: 'Creativity' },
  { name: 'Samarth', gender: 'BOY', startingLetter: 'S', meaningHi: 'सक्षम, सामर्थ्यवान', meaningEn: 'Capable, powerful', chaldeanCompound: 26, chaldeanRoot: 8, focusGoal: 'Confidence' },
  { name: 'Saanvi', gender: 'GIRL', startingLetter: 'S', meaningHi: 'देवी लक्ष्मी, ज्ञान व ऐश्वर्य', meaningEn: 'Goddess Lakshmi', chaldeanCompound: 19, chaldeanRoot: 1, focusGoal: 'Prosperity' },
  { name: 'Shourya', gender: 'BOY', startingLetter: 'S', meaningHi: 'शौर्य, वीरता व पराक्रम', meaningEn: 'Bravery, valor', chaldeanCompound: 24, chaldeanRoot: 6, focusGoal: 'Courage' },
  { name: 'Siya', gender: 'GIRL', startingLetter: 'S', meaningHi: 'माता सीता, पवित्रता', meaningEn: 'Goddess Sita, purity', chaldeanCompound: 12, chaldeanRoot: 3, focusGoal: 'Knowledge' },

  // T & V & Y
  { name: 'Tanay', gender: 'BOY', startingLetter: 'T', meaningHi: 'पुत्र, प्रिय', meaningEn: 'Son, beloved', chaldeanCompound: 16, chaldeanRoot: 7, focusGoal: 'Harmony' },
  { name: 'Tara', gender: 'GIRL', startingLetter: 'T', meaningHi: 'चमकता तारा, मार्गदर्शक', meaningEn: 'Star, guiding light', chaldeanCompound: 11, chaldeanRoot: 2, focusGoal: 'Creativity' },
  { name: 'Vihaan', gender: 'BOY', startingLetter: 'V', meaningHi: 'प्रभात, नई सुबह', meaningEn: 'Dawn, morning sunrise', chaldeanCompound: 24, chaldeanRoot: 6, focusGoal: 'Leadership' },
  { name: 'Vanya', gender: 'GIRL', startingLetter: 'V', meaningHi: 'ईश्वर का अनुपम वरदान', meaningEn: 'Gracious gift of God', chaldeanCompound: 17, chaldeanRoot: 8, focusGoal: 'Harmony' },
  { name: 'Yash', gender: 'BOY', startingLetter: 'Y', meaningHi: 'यश, कीर्ति व सफलता', meaningEn: 'Fame, success, glory', chaldeanCompound: 14, chaldeanRoot: 5, focusGoal: 'Leadership' },
  { name: 'Yashvi', gender: 'GIRL', startingLetter: 'Y', meaningHi: 'यशस्वी, सम्मानित', meaningEn: 'Glorious, successful', chaldeanCompound: 21, chaldeanRoot: 3, focusGoal: 'Knowledge' }
];
