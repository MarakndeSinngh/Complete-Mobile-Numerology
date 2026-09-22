import { reduceToSingleDigit } from './numerologyEngine';
import { calculateKuaNumber } from './numeroVaastuEngine';
import { computeLoshuAnalysis } from './loshuEngine';
import { LEOFAMILY_PLANES } from '../core/planeDefinitions';
import { parseIndianDate } from '../utils/dateUtils';
import { getCombination81 } from '../core/methodology/combinationDefinitions';

export interface CombinationResult {
  code: string; // "11" to "99"
  name: string;
  meaning: string;
  strength: string;
  weakness: string;
  careerImpact: string;
  relationshipImpact: string;
  financialImpact: string;
  spiritualImpact: string;
  remedy: string;
}

export interface ArrowMasterResult {
  name: string;
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  meaning: string;
  strength: string;
  risk: string;
  careerImpact: string;
  relationshipImpact: string;
  remedy: string;
}

export interface LoshuMasterReport {
  personal: {
    name: string;
    dob: string;
    gender: string;
    driver: number;
    conductor: number;
  };
  
  // Section 1: Dashboard
  scores: {
    mentalStrength: number;
    emotionalStrength: number;
    practicalStrength: number;
    leadershipScore: number;
    communicationScore: number;
    spiritualScore: number;
    relationshipScore: number;
    careerPotentialScore: number;
    overallLoshuScore: number;
    reasons: Record<string, string>;
  };

  // Section 2: Complete Grid Specs
  gridAnalysis: {
    present: number[];
    missing: number[];
    birthPresent?: number[];
    birthMissing?: number[];
    repeated: { digit: number; count: number }[];
    dominant: number[];
    weak: number[];
    mostInfluential: { digit: number; reason: string };
    leastInfluential: { digit: number; reason: string };
    lifeThemeNum: number;
    lifeThemeText: string;
    corePersonalityNum: number;
    corePersonalityText: string;
  };

  // Section 3: 81 Combinations
  activeCombinations: CombinationResult[];

  // Section 4: Archetype
  archetype: {
    title: string;
    description: string;
    reasoning: string;
    mantra: string;
  };

  // Section 5: Profile
  profiling: {
    thinkingStyle: string;
    decisionMakingStyle: string;
    communicationStyle: string;
    learningStyle: string;
    leadershipStyle: string;
    workStyle: string;
    problemSolvingStyle: string;
    stressResponsePattern: string;
    motivationPattern: string;
    selfDisciplineLevel: string;
    confidenceLevel: string;
    publicImage: string;
    personalGrowthAreas: string;
  };

  // Section 6: Relationships
  relationshipBehaviour: {
    loveLanguage: string;
    emotionalNeeds: string;
    commitmentStyle: string;
    trustPattern: string;
    conflictBehaviour: string;
    marriageExpectations: string;
    partnerExpectations: string;
    emotionalCompatibilityStyle: string;
    strengths: string;
    challenges: string;
    growthSuggestions: string;
  };

  // Section 7: Family Karma
  familyKarma: {
    fatherInfluence: string;
    motherInfluence: string;
    ancestralInfluence: string;
    familyResponsibilities: string;
    inheritedStrengths: string;
    inheritedChallenges: string;
    familyKarmaLessons: string;
    generationalGrowthAreas: string;
  };

  // Section 8: Wealth Psychology
  wealthPsychology: {
    moneyMindset: string;
    riskTakingBehaviour: string;
    spendingBehaviour: string;
    savingBehaviour: string;
    investmentBehaviour: string;
    businessMindset: string;
    wealthCreationStyle: string;
    financialDisciplineScore: number;
    wealthPotentialScore: number;
    moneyBlockages: string;
    financialRemedies: string;
  };

  // Section 9: Career Blueprint
  careerBlueprint: {
    bestCareers: string[];
    governmentJobs: string;
    privateJobs: string;
    businessSuitability: string;
    suitabilityScores: {
      teaching: number;
      technology: number;
      management: number;
      sales: number;
      creative: number;
      spiritual: number;
      leadership: number;
    };
    recommendedCareers: { title: string; explanation: string }[];
  };

  // Section 10: Hidden Talents
  hiddenTalents: {
    naturalGifts: string;
    talents: {
      creative: string;
      communication: string;
      business: string;
      teaching: string;
      leadership: string;
      spiritual: string;
      artistic: string;
      entrepreneurial: string;
    };
    mostPowerfulTalent: string;
  };

  // Section 11: Karmic Lessons
  karmicLessons: {
    digit: number;
    lesson: string;
    lifeChallenge: string;
    growthOpportunity: string;
    practicalAdvice: string;
    developmentStrategy: string;
    personalizedRemedy: string;
  }[];

  // Section 12: Soul Mission
  soulMission: {
    lifePurpose: string;
    soulMissionText: string;
    higherCalling: string;
    societyContribution: string;
    spiritualDirection: string;
    purposeStatement: string;
    legacyPotential: string;
  };

  // Section 13: Arrow Master Analysis
  arrowsAnalysis: ArrowMasterResult[];

  // Section 14: Mobile Fusion
  mobileFusion: {
    checked: boolean;
    mobileNumber: string;
    strengths: string;
    weaknesses: string;
    compensationAnalysis: string;
    supportAnalysis: string;
    conflictAnalysis: string;
    improvements: string;
  };

  // Section 15: Vaastu Fusion
  vaastuFusion: {
    kuaNumber: number;
    groupType: 'EAST_GROUP' | 'WEST_GROUP';
    directionAnalysis: string;
    bestDirections: string[];
    avoidDirections: string[];
    zones: {
      career: string;
      money: string;
      health: string;
      relationship: string;
    };
    homeRemedies: string;
    officeRemedies: string;
  };

  // Section 16: Health and Dosha
  healthAnalysis: {
    healthScore: number;
    stressScore: number;
    energyScore: number;
    emotionalStabilityScore: number;
    mentalStrengthScore: number;
    primaryDosha: 'VATA' | 'PITTA' | 'KAPHA';
    secondaryDosha: 'VATA' | 'PITTA' | 'KAPHA' | 'NONE';
    healthTendencies: string;
    lifestyleRecommendations: string[];
    preventiveWellness: string;
  };

  // Section 17: Forecasts
  forecasts: {
    personalYear: number;
    personalMonth: number;
    personalDay: number;
    career: string;
    money: string;
    relationships: string;
    health: string;
    business: string;
    travel: string;
    spiritualGrowth: string;
    opportunities: string[];
    warnings: string[];
  };

  // Section 18: Professional Remedies
  remedies: {
    luckyNumbers: number[];
    luckyDates: string[];
    luckyDays: string[];
    luckyColours: string[];
    luckyDirections: string[];
    personalRemedies: string[];
    careerRemedies: string[];
    relationshipRemedies: string[];
    financialRemedies: string[];
    spiritualRemedies: string[];
    actionPlan: string;
    plan90Days: {
      days1_30: string;
      days31_60: string;
      days61_90: string;
    };
  };
}

// 81 Combinations Dictionary Generator Helper
const generateCombinationDetails = (x: number, y: number): CombinationResult => {
  const code = `${x}${y}`;
  const comb = getCombination81(x, y);

  return {
    code,
    name: comb.title,
    meaning: comb.positiveMeaning,
    strength: comb.positiveMeaning,
    weakness: comb.negativeMeaning,
    careerImpact: comb.careerMeaning,
    relationshipImpact: comb.relationshipMeaning,
    financialImpact: comb.wealthMeaning,
    spiritualImpact: comb.spiritualMeaning,
    remedy: comb.remedy
  };
};

const inactiveArrowsData: Record<string, {
  meaning: string;
  strength: string;
  risk: string;
  careerImpact: string;
  relationshipImpact: string;
  remedy: string;
}> = {
  'Arrow of Determination': {
    meaning: 'दृढ़ संकल्प का तीर अभी पूरी तरह सक्रिय नहीं है। आप कार्यों को पूरे उत्साह से शुरू करते हैं, परंतु मार्ग में बाधा आने पर निरंतरता बनाए रखने में चुनौती महसूस कर सकते हैं।',
    strength: 'लचीला दृष्टिकोण; परिस्थितियों के अनुसार खुद को ढालने की अच्छी क्षमता।',
    risk: 'आत्म-संदेह और कार्यों में देरी होने पर जल्दी निराश होना।',
    careerImpact: 'सहयोगात्मक टीमों में उत्कृष्ट, जहां अन्य सहयोगी निरंतर प्रेरणा प्रदान करते हैं।',
    relationshipImpact: 'दीर्घकालिक लक्ष्यों पर टिके रहने के लिए साथी के प्रोत्साहन व संबल की आवश्यकता।',
    remedy: 'शाम को दक्षिण दिशा में शुद्ध घी का दीपक या लाल मोमबत्ती जलाएं और तांबे का छल्ला पहनें।'
  },
  'Arrow of Intellect': {
    meaning: 'बौद्धिक तीर सामान्य स्थिति में है। आप केवल किताबी ज्ञान पर निर्भर रहने के बजाय व्यावहारिक अनुभव और वास्तविक जीवन के पाठों से अधिक सीखते हैं।',
    strength: 'सहज और व्यावहारिक सोच; अत्यधिक तार्किक उलझनों में फंसे बिना आगे बढ़ना।',
    risk: 'अत्यधिक जटिल डेटा या अमूर्त गणितीय विश्लेषण में जल्दी ऊब जाना।',
    careerImpact: 'व्यावहारिक संचालन, प्रत्यक्ष व्यापार और सेल्स जैसे क्षेत्रों में शानदार प्रदर्शन।',
    relationshipImpact: 'तार्किक बहसों के स्थान पर सरल, स्पष्ट और ईमानदार संवाद को प्राथमिकता।',
    remedy: 'अध्ययन मेज पर ग्रीन एवेंट्यूरिन रखें और गुरुवार को बच्चों को पठन सामग्री दान करें।'
  },
  'Arrow of Planning': {
    meaning: 'नियोजन तीर सामान्य है। आप पहले से बहुत अधिक योजनाएं बनाने के बजाय सीधे काम शुरू करके रास्ते में सुधार करने वाले व्यक्ति हैं।',
    strength: 'त्वरित निर्णय और बदलती परिस्थितियों में तेजी से बदलाव करने की योग्यता।',
    risk: 'अव्यवस्थित दिनचर्या और बैकअप प्लान न होने से अचानक समस्या का सामना।',
    careerImpact: 'स्टार्टअप्स, फील्ड वर्क और गतिशील भूमिकाओं में जहां सख्त योजनाएं काम नहीं आतीं।',
    relationshipImpact: 'रोमांचक और स्वतःस्फूर्त साथी, लेकिन महत्वपूर्ण तिथियों को याद रखने के लिए रिमाइंडर रखें।',
    remedy: 'दैनिक डायरी लिखें और दाहिने हाथ में तुलसी या रुद्राक्ष का ब्रेसलेट पहनें।'
  },
  'Arrow of Practicality': {
    meaning: 'व्यावहारिक भौतिक तीर सामान्य है। आपका झुकाव भौतिक चीजों से अधिक रचनात्मक विचारों, मानवीय संवेदनाओं और दृष्टि पर रहता है।',
    strength: 'उच्च संवेदनशीलता, रचनात्मक दृष्टि और सामान्य उपयोगिता से आगे सोचने का सामर्थ्य।',
    risk: 'कागजी कार्रवाई, टैक्स या भौतिक रखरखाव में लापरवाही की संभावना।',
    careerImpact: 'रणनीतिक परामर्श, डिजाइनिंग और वैचारिक भूमिकाओं में अत्यधिक सफल।',
    relationshipImpact: 'भावनात्मक व गहरे संबंध बनाते हैं, लेकिन व्यावहारिक घरेलू जिम्मेदारियों में सहयोग बढ़ाएं।',
    remedy: 'प्रतिदिन सुबह हरी घास पर 5 मिनट नंगे पैर टहलें और ईशान कोण को स्वच्छ रखें।'
  },
  'Arrow of Emotional Balance': {
    meaning: 'भावनात्मक संतुलन तीर सामान्य है। आपकी भावनाएं कभी अत्यधिक उत्साहित तो कभी शांत और अलग-थलग हो सकती हैं।',
    strength: 'गहरी सहानुभूति और सुरक्षित महसूस होने पर आत्मीयता से जुड़ना।',
    risk: 'मूड स्विंग्स और पुरानी नकारात्मक बातों को दिल में दबाए रखने की आदत।',
    careerImpact: 'स्थिर और तनावमुक्त माहौल में आपका कार्य-प्रदर्शन सर्वोत्तम रहता है।',
    relationshipImpact: 'एक परिपक्व और समझदार साथी आपके भावनात्मक उतार-चढ़ाव को संतुलित रखता है।',
    remedy: 'चांदी के गिलास में पानी पिएं और गले में चांदी में शुद्ध मोती धारण करें।'
  },
  'Arrow of Spirituality': {
    meaning: 'आध्यात्मिक शांति तीर सामान्य है। आप प्रत्यक्ष प्रमाण, तार्किक विश्लेषण और वास्तविक परिणामों पर अधिक विश्वास करते हैं।',
    strength: 'जमीनी यथार्थवाद; किसी के बहकावे या अंधविश्वास में आसानी से न आना।',
    risk: 'कठिन समय में आंतरिक शांति पाने में कभी-कभी कठिनाई महसूस होना।',
    careerImpact: 'वित्तीय प्रबंधन, विज्ञान और कॉर्पोरेट जगत में तथ्यों के आधार पर उत्कृष्ट निर्णय।',
    relationshipImpact: 'व्यावहारिक अपेक्षाएं और परिवार के प्रति स्पष्ट, स्थायी जिम्मेदारियां।',
    remedy: 'सूर्योदय के समय 10 मिनट मौन ध्यान करें और गुरुवार को चने की दाल का दान करें।'
  },
  'Arrow of Activity': {
    meaning: 'शारीरिक सक्रियता तीर सामान्य है। आप भागदौड़ भरे माहौल के बजाय शांत, चिंतनशील और स्थिर जीवनशैली पसंद करते हैं।',
    strength: 'गहन शोध, एकाग्रता और तनावमुक्त रहकर चिंतन करने की श्रेष्ठ क्षमता।',
    risk: 'शारीरिक व्यायाम शुरू करने में आलस्य या यात्रा योजनाओं में देरी।',
    careerImpact: 'रिमोट कार्य, लेखन, विश्लेषण और शोध जैसे क्षेत्रों में सफलता।',
    relationshipImpact: 'भीड़भाड़ के बजाय घर पर शांतिपूर्ण समय बिताना अधिक पसंद करते हैं।',
    remedy: 'कार्यस्थल पर तांबे का पिरामिड रखें और मंगलवार को हल्का व्यायाम नियमित करें।'
  },
  'Arrow of Frustration': {
    meaning: 'निराशा का तीर (Arrow of Frustration) सक्रिय नहीं है। आपकी ऊर्जा का संतुलन मजबूत है जो आपको निरंतर निराशा से सुरक्षित रखता है।',
    strength: 'स्वाभाविक मानसिक धैर्य; बाधाओं को व्यक्तिगत असफलता माने बिना आगे बढ़ते हैं।',
    risk: 'कोई बड़ा जोखिम नहीं; सामान्य तनाव में भी मानसिक स्थिरता बनी रहती है।',
    careerImpact: 'संस्थानों में लंबे समय तक टिककर स्थायी प्रगति करने की क्षमता।',
    relationshipImpact: 'स्वस्थ संवाद और कार्यस्थल के तनाव को पारिवारिक जीवन पर हावी न होने देना।',
    remedy: 'प्रतिदिन कृतज्ञता का भाव रखें और बड़ों का सम्मान करें।'
  },
  'Arrow of Weak Will': {
    meaning: 'कमजोर इच्छाशक्ति का तीर सक्रिय नहीं है। आपका संकल्प मजबूत है और आप स्वतंत्र निर्णय लेने में सक्षम हैं।',
    strength: 'उच्च आत्मविश्वास और जीवन के बड़े निर्णय स्वयं लेने की शक्ति।',
    risk: 'कभी-कभी अत्यधिक जिद्दीपन से दूसरों के अच्छे सुझाव नजरअंदाज हो सकते हैं।',
    careerImpact: 'नेतृत्व, व्यापार और स्वतंत्र जिम्मेदारी वाले पदों में श्रेष्ठ।',
    relationshipImpact: 'संबंधों में स्पष्ट सीमाएं और आपसी सम्मान सुनिश्चित करते हैं।',
    remedy: 'अपने अनुभव और सकारात्मक ऊर्जा से कनिष्ठ साथियों का मार्गदर्शन करें।'
  },
  'Arrow of Isolation': {
    meaning: 'अकेलेपन का तीर सक्रिय नहीं है। आपकी सामाजिक और भावनात्मक क्षमताएं संतुलित हैं, जिससे आप समाज से जुड़े रहते हैं।',
    strength: 'उत्कृष्ट सामाजिक तालमेल और सार्थक संबंध बनाने की स्वाभाविक कला।',
    risk: 'कभी-कभी सामाजिक व्यस्तताओं के कारण स्वयं के लिए समय न निकाल पाना।',
    careerImpact: 'जनसंपर्क (PR), क्लाइंट मैनेजमेंट, टीम लीडरशिप और मार्केटिंग में सफलता।',
    relationshipImpact: 'स्नेही और खुले दिल वाले साथी; विश्वास के साथ मन की बातें साझा करते हैं।',
    remedy: 'सोमवार को जरूरतमंदों को दूध या चावल का दान करें।'
  },
  'Arrow of Impatience': {
    meaning: 'अधीरता का तीर सक्रिय नहीं है। आपके पास दीर्घकालिक परिणामों के लिए धैर्यपूर्वक प्रतीक्षा करने की परिपक्वता है।',
    strength: 'स्थायी निवेश, बारीक कार्य और समय के साथ प्रगति करने की दृढ़ क्षमता।',
    risk: 'धीमी प्रगति वाले वातावरण में कभी-कभी आवश्यकता से अधिक समय रुक जाना।',
    careerImpact: 'बैंकिंग, इंजीनियरिंग, अनुसंधान और स्थायी व्यवसायों में अत्यंत विश्वसनीय।',
    relationshipImpact: 'शांत और समझदार साथी जो विवादों को प्रेमपूर्वक बातचीत से सुलझाते हैं।',
    remedy: 'कार्यस्थल को हमेशा स्वच्छ और उचित प्रकाशयुक्त रखें।'
  },
  'Arrow of Confusion': {
    meaning: 'भ्रम का तीर सक्रिय नहीं है। आपकी मानसिक स्पष्टता उत्तम है, जिससे आप सही और गलत का त्वरित निर्णय ले पाते हैं।',
    strength: 'तार्किक बुद्धि; अफवाहों और भ्रामक बातों को तुरंत पहचान कर दूर रहना।',
    risk: 'हर बात में पूर्ण प्रमाण मांगने की आदत से कभी-कभी देरी।',
    careerImpact: 'ऑडिटिंग, ट्रेडिंग, कानून और प्रशासनिक कार्यों में अत्यंत प्रभावी।',
    relationshipImpact: 'रिश्तों में स्पष्ट और पारदर्शी संवाद बनाए रखते हैं।',
    remedy: 'पर्स में एक चांदी का सिक्का रखें जिससे मानसिक शांति और स्पष्टता बनी रहे।'
  }
};

export function computeLoshuMasterReport(
  dobStr: string,
  name: string,
  gender: string = 'MALE',
  mobileNum?: string
): LoshuMasterReport {
  const parsed = parseIndianDate(dobStr);
  const parts = dobStr.split('-');
  const bYear = parsed ? parsed.year : (parseInt(parts[0], 10) || 1990);
  const bMonth = parsed ? parsed.month : (parseInt(parts[1], 10) || 1);
  const bDay = parsed ? parsed.day : (parseInt(parts[2], 10) || 1);

  const driver = reduceToSingleDigit(bDay);
  
  // Conductor calculation
  const dobDigitsStr = dobStr.replace(/[^0-9]/g, '');
  const sumAllDigits = dobDigitsStr.split('').map(d => parseInt(d, 10)).reduce((acc, v) => acc + v, 0);
  const conductor = reduceToSingleDigit(sumAllDigits);

  const keyDigits = dobDigitsStr.split('').map(Number).filter(d => d >= 1 && d <= 9);
  // The gridMap must contain ONLY the original Date of Birth digits as per the audit rules.
  // We do NOT add driver or conductor to the grid itself.
  const gridMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  keyDigits.forEach(d => { gridMap[d]++; });

  // Single source of truth 'Present Numbers' set that includes both raw birth digits
  // and the conditionally added Driver/Conductor numbers.
  const loshuAnalysis = computeLoshuAnalysis(dobStr, name, gender);
  const enhancedGridMap: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) {
    enhancedGridMap[d] = loshuAnalysis.loshuGrid[d]?.count || 0;
  }

  const birthPresent: number[] = [];
  const birthMissing: number[] = [];
  const present: number[] = [];
  const missing: number[] = [];
  const repeated: { digit: number; count: number }[] = [];
  
  for (let d = 1; d <= 9; d++) {
    const dobCount = gridMap[d];
    if (dobCount > 0) {
      birthPresent.push(d);
      if (dobCount > 1) {
        repeated.push({ digit: d, count: dobCount });
      }
    } else {
      birthMissing.push(d);
    }

    // LeoFamily Enhanced Grid presence:
    // Present if DOB count > 0 OR driverLayer is true OR destinyLayer is true
    const isEnhancedPresent = dobCount > 0 || loshuAnalysis.loshuGrid[d]?.isDriverLayer || loshuAnalysis.loshuGrid[d]?.isDestinyLayer;
    if (isEnhancedPresent) {
      present.push(d);
    } else {
      missing.push(d);
    }
  }

  // Dominant and weak calculation
  const countsArray = Object.entries(enhancedGridMap).map(([digit, count]) => ({ digit: parseInt(digit, 10), count }));
  const sortedByCount = [...countsArray].sort((a,b) => b.count - a.count);
  const maxCount = sortedByCount[0].count;
  
  const dominant = countsArray.filter(c => c.count === maxCount && c.count > 0).map(c => c.digit);
  const weak = countsArray.filter(c => c.count === 1).map(c => c.digit);

  const mostInfluentialDigit = driver;
  const leastInfluentialDigit = missing.length > 0 ? missing[0] : 8;

  // Archetype logic in natural Indian Hindi
  let archetypeTitle = "रणनीतिकार (The Strategist)";
  let archetypeDesc = "व्यवस्थित योजना और व्यावहारिक मानवीय समझ का संतुलित समन्वय।";
  let archetypeReasoning = `मस्तिष्क विमान का संतुलन और भाग्यांक (Conductor) #${conductor} की दिशा आपको एक स्पष्ट योजनाकार बनाती है।`;
  let archetypeMantra = "OM BRIM BRHASPATAYE NAMAH";

  if (driver === 1 || driver === 9) {
    archetypeTitle = "नेतृत्वकर्ता व प्रशासक (The Leader)";
    archetypeDesc = "स्वाभाविक नेतृत्व क्षमता, नई पहलों को शुरू करने का साहस और लोगों को एक लक्ष्य के साथ आगे ले जाने की कला।";
    archetypeReasoning = `मूलांक #${driver} और भाग्यांक #${conductor} का संयोग आपको ऊर्जावान और स्वतंत्र नेतृत्व की शक्ति देता है।`;
    archetypeMantra = "OM ADITYAYA NAMAH • OM KEM KETAVE NAMAH";
  } else if (driver === 3 || driver === 5) {
    archetypeTitle = "मार्गदर्शक व शिक्षक (The Advisor)";
    archetypeDesc = "ज्ञान, व्यावहारिक समझ और व्यापारिक बुद्धिमत्ता का सुंदर संगम। आप दूसरों को सही सलाह देने में अग्रणी हैं।";
    archetypeReasoning = `विकास के अंक और भाग्यांक #${conductor} मिलकर आपको एक उत्कृष्ट शिक्षक व रणनीतिक सलाहकार बनाते हैं।`;
    archetypeMantra = "OM GURAVE NAMAH";
  } else if (driver === 2 || driver === 7) {
    archetypeTitle = "सहज हीलर व साधक (The Mystic Healer)";
    archetypeDesc = "गहरा अंतर्ज्ञान, मानवीय संवेदनाओं की समझ और सूक्ष्म विषयों में शोध करने की स्वाभाविक क्षमता।";
    archetypeReasoning = `मूलांक व भाग्यांक की ऊर्जा आपको दूसरों की भावनाएं समझने और आध्यात्मिक गहराई की ओर प्रेरित करती है।`;
    archetypeMantra = "OM SOM SOMA_YAE NAMAH";
  } else if (driver === 6) {
    archetypeTitle = "सौंदर्य व कला साधक (The Creative Artist)";
    archetypeDesc = "उत्कृष्ट कलात्मक पसंद, रिश्तों में सौहार्द और जीवन को सुरुचिपूर्ण बनाने की स्वाभाविक कला।";
    archetypeReasoning = "शुक्र का प्रभाव आपकी सोच और जीवनशैली में सुरुचिपूर्ण सौंदर्य व संतुलन लाता है।";
    archetypeMantra = "OM SHUM SHUKRAYAE NAMAH";
  } else if (driver === 4 || driver === 8) {
    archetypeTitle = "कर्मठ निर्माता (The Structural Builder)";
    archetypeDesc = "अथक परिश्रम, अनुशासन और मजबूत नींव तैयार करने की क्षमता। आप दीर्घकालिक स्थायी सफलता में विश्वास रखते हैं।";
    archetypeReasoning = "मजबूत व्यावहारिक तत्व आपको धैर्यवान और जिम्मेदार निर्माता बनाते हैं।";
    archetypeMantra = "OM SHAM SHANAYISHCHARAYAE NAMAH";
  }

  // Section 1: Dashboard Score Generation matching criteria from LEOFAMILY_PLANES
  const mindPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Mind Plane')!;
  const emotionalPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Emotional Plane')!;
  const practicalPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Practical Plane')!;
  const thoughtPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Thought Plane')!;
  const willPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Will Plane')!;
  const actionPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Action Plane')!;
  const goldenSuccessDef = LEOFAMILY_PLANES.find(p => p.name === 'Golden Success Plane')!;
  const silverYogDef = LEOFAMILY_PLANES.find(p => p.name === 'Silver Yog')!;

  const mentalCount = mindPlaneDef.coordinates.filter(d => enhancedGridMap[d] > 0).length;
  const emotionalCount = emotionalPlaneDef.coordinates.filter(d => enhancedGridMap[d] > 0).length;
  const practicalCount = practicalPlaneDef.coordinates.filter(d => enhancedGridMap[d] > 0).length;

  const mentalStrength = Math.max(35, Math.round((mentalCount / 3) * 100));
  const emotionalStrength = Math.max(35, Math.round((emotionalCount / 3) * 100));
  const practicalStrength = Math.max(35, Math.round((practicalCount / 3) * 100));

  const score492 = mentalCount / 3;
  const score357 = emotionalCount / 3;
  const score816 = practicalCount / 3;
  const score276 = actionPlaneDef.coordinates.filter(d => enhancedGridMap[d] > 0).length / 3;
  const score258 = silverYogDef.coordinates.filter(d => enhancedGridMap[d] > 0).length / 3;
  const score951 = willPlaneDef.coordinates.filter(d => enhancedGridMap[d] > 0).length / 3;

  let lScore = 30 + Math.round(score951 * 35) + Math.round(score276 * 15);
  if (driver === 1 || driver === 9) lScore += 15;
  const leadershipScore = Math.min(95, Math.max(40, lScore));

  let cScore = 30 + Math.round(score492 * 30) + Math.round(score357 * 20);
  if (driver === 5 || conductor === 5) cScore += 15;
  const communicationScore = Math.min(95, Math.max(40, cScore));

  let sScore = 30 + Math.round(score357 * 30) + Math.round(score258 * 20);
  if (driver === 7 || conductor === 7 || driver === 3 || conductor === 3) sScore += 15;
  const spiritualScore = Math.min(95, Math.max(40, sScore));

  let rScore = 30 + Math.round(score357 * 25) + Math.round(score276 * 25);
  if (driver === 2 || conductor === 2 || driver === 6 || conductor === 6) rScore += 15;
  const relationshipScore = Math.min(95, Math.max(40, rScore));

  const careerPotentialScore = Math.round((leadershipScore + communicationScore + practicalStrength) / 3);
  const overallLoshuScore = Math.round((mentalStrength + emotionalStrength + practicalStrength + leadershipScore + communicationScore + spiritualScore + relationshipScore) / 7);

  const reasons = {
    mentalStrength: `मस्तिष्क विमान (${mindPlaneDef.coordinates.join('')}) में मौजूद अंक ${mindPlaneDef.coordinates.filter(d => enhancedGridMap[d]>0).join(', ')} के आधार पर। तार्किक सोच और स्मरण शक्ति तीव्र है।`,
    emotionalStrength: `भावनात्मक विमान (${emotionalPlaneDef.coordinates.join('')}) में मौजूद अंक ${emotionalPlaneDef.coordinates.filter(d => enhancedGridMap[d]>0).join(', ')} के आधार पर। यह आपकी संवेदनशीलता और अंतर्ज्ञान को दर्शाता है।`,
    practicalStrength: `व्यावहारिक विमान (${practicalPlaneDef.coordinates.join('')}) में मौजूद अंक ${practicalPlaneDef.coordinates.filter(d => enhancedGridMap[d]>0).join(', ')} के आधार पर। यह कार्य क्षमता और धन प्रबंधन को नियंत्रित करता है।`,
    leadershipScore: `इच्छाशक्ति विमान (${willPlaneDef.coordinates.join('')}) और कर्म विमान (${actionPlaneDef.coordinates.join('')}) का मूलांक #${driver} के साथ सामंजस्य नेतृत्व क्षमता को बढ़ाता है।`,
    communicationScore: `मस्तिष्क विमान (${mindPlaneDef.coordinates.join('')}) और भावनात्मक विमान (${emotionalPlaneDef.coordinates.join('')}) के समन्वय से वाणी में स्पष्टता और प्रभावशीलता आती है।`,
    spiritualScore: `भावनात्मक विमान (${emotionalPlaneDef.coordinates.join('')}) और सिल्वर योग (${silverYogDef.coordinates.join('')}) के संतुलन से आंतरिक शांति और जीवन की गहरी समझ मिलती है।`,
    relationshipScore: `भावनात्मक विमान (${emotionalPlaneDef.coordinates.join('')}) और कर्म विमान (${actionPlaneDef.coordinates.join('')}) का तालमेल रिश्तों में सौहार्द और स्थायित्व बनाए रखता है।`,
    careerPotentialScore: `प्रशासनिक क्षमता, कार्य कौशल और व्यावहारिक धरातल का संतुलित समन्वय।`,
    overallLoshuScore: `समग्र ग्रिड का संयुक्त सूचकांक जो जीवन के सभी क्षेत्रों में ऊर्जा संतुलन को दर्शाता है।`
  };

  // Section 3: 81 Combinations - Select active combinations found in the chart
  const activeCombinations: CombinationResult[] = [];
  // Add driver-conductor primary pair
  activeCombinations.push(generateCombinationDetails(driver, conductor));
  // Add other present key connections from grid
  for (let i = 0; i < present.length; i++) {
    for (let j = i; j < present.length; j++) {
      const code = `${present[i]}${present[j]}`;
      // avoid duplicate with driver-conductor
      if (code !== `${driver}${conductor}` && activeCombinations.length < 5) {
        activeCombinations.push(generateCombinationDetails(present[i], present[j]));
      }
    }
  }

  // Section 13: 12 Master Arrows
  const arrowsList = [
    { name: 'Arrow of Determination', digits: [9, 5, 1], type: 'STRENGTH' },
    { name: 'Arrow of Intellect', digits: [9, 5, 1], type: 'STRENGTH' },
    { name: 'Arrow of Planning', digits: [4, 3, 8], type: 'STRENGTH' },
    { name: 'Arrow of Practicality', digits: [8, 1, 6], type: 'STRENGTH' },
    { name: 'Arrow of Emotional Balance', digits: [3, 5, 7], type: 'STRENGTH' },
    { name: 'Arrow of Spirituality', digits: [2, 5, 8], type: 'STRENGTH' },
    { name: 'Arrow of Activity', digits: [2, 7, 6], type: 'STRENGTH' },
    { name: 'Arrow of Frustration', digits: [4, 5, 6], type: 'WEAKNESS' }, // when all missing
    { name: 'Arrow of Weak Will', digits: [9, 5, 1], type: 'WEAKNESS' },
    { name: 'Arrow of Isolation', digits: [2, 5, 8], type: 'WEAKNESS' },
    { name: 'Arrow of Impatience', digits: [8, 1, 6], type: 'WEAKNESS' },
    { name: 'Arrow of Confusion', digits: [9, 5, 1], type: 'WEAKNESS' }
  ];

  const arrowsAnalysis: ArrowMasterResult[] = arrowsList.map(arr => {
    let isActive = false;
    if (arr.type === 'STRENGTH') {
      isActive = arr.digits.every(d => enhancedGridMap[d] > 0);
    } else {
      isActive = arr.digits.every(d => enhancedGridMap[d] === 0);
    }

    const fallback = inactiveArrowsData[arr.name];
    let meaning = fallback ? fallback.meaning : `इस विमान में कोई मुख्य संयोजन सक्रिय नहीं है।`;
    let strength = fallback ? fallback.strength : `सुप्त क्षमताएं; विशिष्ट उपचारात्मक उपायों द्वारा इन्हें जाग्रत किया जा सकता है।`;
    let risk = fallback ? fallback.risk : `इस क्षेत्र में कम ध्यान; लंबे कार्यों के दौरान कभी-कभी ध्यान भटकना।`;
    let careerImpact = fallback ? fallback.careerImpact : `सामान्य कार्यप्रणाली; अनुशासन बनाए रखने के लिए लिखित सूची बनाकर काम करें।`;
    let relationshipImpact = fallback ? fallback.relationshipImpact : `आपसी समझ और व्यावहारिक समझौते से संबंध संतुलित रहते हैं।`;
    let remedy = fallback ? fallback.remedy : `अनुकूल रत्न या क्रिस्टल पास रखें और नियमित ध्यान करें।`;

    if (isActive) {
      if (arr.name === 'Arrow of Determination') {
        meaning = "अदम्य इच्छाशक्ति और संकल्प। बाधाओं को रुकावट नहीं बल्कि आगे बढ़ने की सीढ़ी मानते हैं।";
        strength = "मजबूत इच्छाशक्ति, आक्रामक लक्ष्य प्राप्ति और स्वाभाविक नेतृत्व क्षमता।";
        risk = "अत्यधिक हठ, दूसरों के फीडबैक को अनदेखा करना और जल्दी अधीर होना।";
        careerImpact = "स्टार्टअप फाउंडर्स, प्रोजेक्ट हेड्स और प्रशासनिक अधिकारियों के रूप में भारी सफलता।";
        relationshipImpact = "अत्यंत सुरक्षात्मक और निष्ठावान साथी; पूर्ण पारदर्शिता की अपेक्षा रखते हैं।";
        remedy = "प्रतिदिन 10 मिनट मौन ध्यान करें और अनामिका में तांबे का छल्ला धारण करें।";
      } else if (arr.name === 'Arrow of Intellect') {
        meaning = "अद्भुत स्मरण शक्ति, तीव्र शैक्षणिक विवेक और जटिल समस्याओं को सुलझाने की तार्किक कला।";
        strength = "मानसिक प्रखरता, रणनीतिक योजना और अमूर्त विचारों का त्वरित विश्लेषण।";
        risk = "ज्ञान का अहंकार और सामान्य शारीरिक या दोहराव वाले कार्यों में जल्दी ऊब जाना।";
        careerImpact = "तकनीकी आर्किटेक्चर, वित्तीय विश्लेषण, कानून और शोध व लेखन में शीर्ष सफलता।";
        relationshipImpact = "बौद्धिक संवाद पसंद करते हैं; सतही या निरर्थक बातों से दूर रहते हैं।";
        remedy = "गुरुवार को विद्यार्थियों को शिक्षा सामग्री दान करें और अध्ययन मेज पर हरा लैंप रखें।";
      } else if (arr.name === 'Arrow of Planning') {
        meaning = "उत्कृष्ट योजनाकार, भविष्य की संभावनाओं और ब्लूप्रिंट्स को सटीक रूप से तैयार करने वाले।";
        strength = "सूक्ष्म बारीकियों पर ध्यान, दूरदर्शिता और सुरक्षात्मक रणनीतियां बनाना।";
        risk = "एनालिसिस पैरालिसिस (अति-विश्लेषण); कभी-कभी काम शुरू करने में अत्यधिक समय लगाना।";
        careerImpact = "प्रोजेक्ट आर्किटेक्चर, फाइनेंस डायरेक्टर्स, डेटा एनालिस्ट और सरकारी योजनाकार।";
        relationshipImpact = "अत्यंत सुरक्षित व योजनाबद्ध साथी; पारिवारिक यात्राओं व भविष्य की सुंदर योजनाएं बनाते हैं।";
        remedy = "ग्रीन टूमलाइन पास रखें और सुबह उठने की व्यवस्थित दिनचर्या बनाएं।";
      } else if (arr.name === 'Arrow of Practicality') {
        meaning = "जमीनी और व्यावहारिक रूप से काम करने वाले। वास्तविक क्रियान्वयन से ही सब कुछ सीखते हैं।";
        strength = "व्यावहारिक कौशल, उच्च शारीरिक क्षमता और यथार्थवादी आकलन।";
        risk = "अमूर्त या आध्यात्मिक मार्गदर्शन को कभी-कभी अनदेखा करना; भौतिकता पर अधिक जोर।";
        careerImpact = "रियल एस्टेट, विनिर्माण, खनिज उद्योग, लॉजिस्टिक्स और बड़े व्यापारिक ऑपरेशंस।";
        relationshipImpact = "स्थायी भौतिक सुरक्षा, गृह निर्माण और वित्तीय स्थिरता से अपना प्रेम व्यक्त करते हैं।";
        remedy = "शनिवार की सुबह हरी घास पर नंगे पैर चलें और मुख्य द्वार को स्वच्छ रखें।";
      } else if (arr.name === 'Arrow of Emotional Balance') {
        meaning = "सहानुभूतिपूर्ण मार्गदर्शक, उत्कृष्ट सहज हीलर और दूसरों के मनोभावों को तुरंत समझने वाले।";
        strength = "अंतर्ज्ञान आधारित परामर्श, स्वाभाविक शांतिदूत और लोगों को तुरंत तनावमुक्त करना।";
        risk = "संवेदनशील स्वभाव; दूसरों की नकारात्मक ऊर्जा से जल्दी प्रभावित होना।";
        careerImpact = "थेरेपी, मनोवैज्ञानिक परामर्श, कला, संगीत और जनसेवा के क्षेत्रों में विशेष सफलता।";
        relationshipImpact = "गहरा आत्मीय जुड़ाव; संबंधों में भावनात्मक सुरक्षा और सम्मान की तलाश।";
        remedy = "चांदी में शुद्ध प्राकृतिक मोती धारण करें और प्राणायाम का अभ्यास करें।";
      } else if (arr.name === 'Arrow of Spirituality') {
        meaning = "गहन दर्शन, शांत अनासक्ति और आंतरिक संतुलन का उच्च स्तर।";
        strength = "आंतरिक स्थिरता, कर्मों के चक्र की गहरी समझ और दूसरों को शांतिपूर्ण मार्गदर्शन।";
        risk = "अचानक सांसारिक कार्यों से विरक्ति या भौतिक लाभ की अनदेखी करना।";
        careerImpact = "योग गुरु, आध्यात्मिक लेखक, हीलर्स और वेलनेस डायरेक्टर्स।";
        relationshipImpact = "अत्यंत वफादार और शांत साथी; पारिवारिक विवादों को समझदारी से सुलझाते हैं।";
        remedy = "गुरुवार को चने की दाल का दान करें और नियमित ध्यान करें।";
      } else if (arr.name === 'Arrow of Activity') {
        meaning = "अत्यधिक शारीरिक सक्रियता; खाली बैठना पसंद नहीं करते और कार्यों को तुरंत पूरा करते हैं।";
        strength = "त्वरित प्रतिक्रिया, यांत्रिक समझ और समस्याओं का तेजी से समाधान।";
        risk = "जल्दबाजी में निर्णय लेना और बिना सोचे काम शुरू कर देना।";
        careerImpact = "मीडिया प्रोडक्शन, निर्यात व्यापार, स्पोर्ट्स कोचिंग और इवेंट मैनेजमेंट।";
        relationshipImpact = "सक्रिय और ऊर्जावान साथी; आउटडोर गतिविधियां और यात्रा पसंद करते हैं।";
        remedy = "मंगलवार को लाल मसूर की दाल दान करें और नियमित शारीरिक व्यायाम करें।";
      } else if (arr.name === 'Arrow of Frustration') {
        meaning = "जब विकर्ण (डायगोनल) रेखा के अंक अनुपस्थित हों। बार-बार अवरोध और निराशा की भावना।";
        strength = "संघर्षों और चुनौतियों से मजबूत होकर पुनः खड़े होने की अद्भुत सहनशक्ति।";
        risk = "जल्दी चिढ़चिढ़ापन और यह महसूस होना कि मेहनत का पूरा श्रेय नहीं मिल रहा।";
        careerImpact = "बार-बार कार्यक्षेत्र बदलना; स्थायी करियर पथ खोजने में समय लगना।";
        relationshipImpact = "कार्यस्थल के तनाव का प्रभाव कभी-कभी जीवनसाथी के संबंधों पर पड़ना।";
        remedy = "पीतल का कड़ा पहनें और लिविंग रूम के केंद्र में पीला हिमालयन सॉल्ट लैंप रखें।";
      } else if (arr.name === 'Arrow of Weak Will') {
        meaning = "जब इच्छाशक्ति की रेखा खाली हो। दूसरों के निर्णयों और अनुमोदन पर अधिक निर्भरता।";
        strength = "सहयोगी और आज्ञाकारी; दिए गए निर्देशों का निष्ठापूर्वक पालन करना।";
        risk = "स्वतंत्र निर्णय लेने में हिचकिचाहट और गलत लोगों के प्रभाव में आना।";
        careerImpact = "जोखिम भरे व्यवसायों के बजाय सुरक्षित वेतनभोगी नौकरियों को प्राथमिकता।";
        relationshipImpact = "ऊपरी शांति बनाए रखने के लिए अपनी इच्छाओं का बार-बार त्याग करना।";
        remedy = "कमरे के दक्षिण क्षेत्र में लाल पिरामिड या लाल वस्त्र/वस्तुएं रखें।";
      } else if (arr.name === 'Arrow of Isolation') {
        meaning = "जब आध्यात्मिक/शांति की रेखा खाली हो। समाज से अलग-थलग या अनसुना महसूस करना।";
        strength = "भावनाओं के बजाय कठोर तार्किक सोच पर निर्भर रहने की कला।";
        risk = "करीबियों पर भी जल्दी भरोसा न करना और अत्यधिक अकेले रहना।";
        careerImpact = "स्वतंत्र तकनीकी परियोजनाओं और व्यक्तिगत कार्यों में श्रेष्ठ प्रदर्शन।";
        relationshipImpact = "अपने दिल की गहरी बातें साझा करने में संकोच और दूरियां बनाना।";
        remedy = "पूर्व दिशा की बालकनी में हरा तुलसी का पौधा लगाएं और प्रतिदिन जल दें।";
      } else if (arr.name === 'Arrow of Impatience') {
        meaning = "जब व्यावहारिक रेखा खाली हो। त्वरित परिणामों की अत्यधिक चाह और अधीरता।";
        strength = "कार्यों को तेजी से आगे बढ़ाने के लिए सहकर्मियों को प्रेरित करना।";
        risk = "कार्यों को अधूरा छोड़ देना और अत्यधिक मानसिक थकान (Burnout)।";
        careerImpact = "दीर्घकालिक योजनाओं के बजाय तुरंत परिणाम देने वाले कार्यों की तलाश।";
        relationshipImpact = "धीमी और गंभीर बातचीत में जल्दी ऊब जाना।";
        remedy = "दाहिने हाथ में ब्लैक टूमलाइन या ओनेक्स का ब्रेसलेट धारण करें।";
      } else if (arr.name === 'Arrow of Confusion') {
        meaning = "जब मस्तिष्क रेखा खाली हो। तेजी से बदलते माहौल में निर्णय लेने में भ्रम।";
        strength = "सहज अंतर्ज्ञान पर भरोसा जो कई बार आश्चर्यजनक रूप से सही सिद्ध होता है।";
        risk = "अनिर्णय की स्थिति और भ्रामक योजनाओं में फंसने का जोखिम।";
        careerImpact = "अत्यधिक कागजी कार्रवाई और गहन डेटा विश्लेषण में असहजता।";
        relationshipImpact = "बातचीत में अस्पष्टता जिससे गलतफहमियां उत्पन्न हो सकती हैं।";
        remedy = "स्नान के बाद माथे पर चंदन/केसर का तिलक लगाएं और शांत मन से निर्णय लें।";
      }
    }

    return {
      name: arr.name,
      isActive,
      status: isActive ? 'ACTIVE' : 'INACTIVE',
      meaning,
      strength,
      risk,
      careerImpact,
      relationshipImpact,
      remedy
    };
  });

  // Section 14: Mobile Fusion calculation
  let mStrengths = "विश्लेषण के लिए कोई मोबाइल नंबर दर्ज नहीं किया गया है।";
  let mWeaknesses = "कृपया अपना 10 अंकों का प्राथमिक मोबाइल नंबर दर्ज करें।";
  let mComp = "लागू नहीं";
  let mSupport = "लागू नहीं";
  let mConflict = "लागू नहीं";
  let mImprovements = "लागू नहीं";

  if (mobileNum) {
    const cleanMob = mobileNum.replace(/[^0-9]/g, '');
    const mobDigits = cleanMob.split('').map(Number);
    const mobSum = mobDigits.reduce((a,b)=>a+b, 0);
    const mobSingle = reduceToSingleDigit(mobSum);

    // Identify values present in mobile but missing in Lo Shu
    const mobPresents = Array.from(new Set(mobDigits)).filter(d => d >= 1 && d <= 9);
    const compensating = mobPresents.filter(d => enhancedGridMap[d] === 0);

    mStrengths = `मोबाइल नंबर का कुल कम्पाउंड योग ग्रह #${mobSingle} से संबंधित है। इसमें सक्रिय अंक ${mobPresents.join(', ')} शामिल हैं।`;
    mWeaknesses = `इस नंबर में अंक ${[1,2,3,4,5,6,7,8,9].filter(d => !mobPresents.includes(d)).join(', ')} की ऊर्जा अनुपस्थित है।`;
    
    if (compensating.length > 0) {
      mComp = `शानदार समन्वय! आपका मोबाइल नंबर ग्रिड में अनुपस्थित अंक ${compensating.join(', ')} की कमी को आंशिक रूप से संतुलित करता है।`;
    } else {
      mComp = `अनुपस्थित अंकों को सीधा सहयोग नहीं मिल रहा है। मोबाइल नंबर ग्रिड में पहले से मौजूद अंकों को ही दोहरा रहा है।`;
    }

    mSupport = `मोबाइल का एकल योग #${mobSingle} आपके मूलांक #${driver} के अनुकूल है, जो व्यावसायिक सफलता में सहायक रहेगा।`;
    mConflict = mobSingle === 8 && driver === 1 ? "सावधानी: मोबाइल का कुल योग (8) मूलांक (1) के साथ विरोधी ऊर्जा बनाता है, जिससे धन लेन-देन में देरी हो सकती है।" : "संतुलित और सकारात्मक सहयोग। कोई गंभीर दोष नहीं है।";
    mImprovements = `धन और व्यापारिक प्रगति को और गति देने के लिए मोबाइल का कुल योग 5 (बुध) या 6 (शुक्र) पर रखना अत्यंत शुभ माना जाता है।`;
  }

  // Section 15: Vaastu Fusion calculation (Kua is calculated)
  const kuaNumber = calculateKuaNumber(bYear, gender as any);
  let groupType: 'EAST_GROUP' | 'WEST_GROUP' = 'EAST_GROUP';

  if ([1,3,4,9].includes(kuaNumber)) {
    groupType = 'EAST_GROUP';
  } else {
    groupType = 'WEST_GROUP';
  }

  const bestDirections = groupType === 'EAST_GROUP' 
    ? ['उत्तर (करियर व धन)', 'पूर्व (स्वास्थ्य व परिवार)', 'दक्षिण (यश व सम्मान)', 'दक्षिण-पूर्व (समृद्धि)']
    : ['उत्तर-पूर्व (ज्ञान व शिक्षा)', 'दक्षिण-पश्चिम (रिश्ते व विवाह)', 'पश्चिम (रचनात्मकता)', 'उत्तर-पश्चिम (सहयोगी मित्र)'];

  const avoidDirections = groupType === 'EAST_GROUP'
    ? ['पश्चिम (West)', 'दक्षिण-पश्चिम (Southwest)', 'उत्तर-पूर्व (Northeast)', 'उत्तर-पश्चिम (Northwest)']
    : ['उत्तर (North)', 'पूर्व (East)', 'दक्षिण (South)', 'दक्षिण-पूर्व (Southeast)'];

  // Section 16: Health Analysis (Calculated based on DOSHA)
  let primaryDosha: 'VATA' | 'PITTA' | 'KAPHA' = 'PITTA';
  let secondaryDosha: 'VATA' | 'PITTA' | 'KAPHA' | 'NONE' = 'VATA';

  const fireCount = (enhancedGridMap[9] || 0);
  const airCount = (enhancedGridMap[4] || 0) + (enhancedGridMap[8] || 0);
  const waterCount = (enhancedGridMap[1] || 0) + (enhancedGridMap[2] || 0);

  if (fireCount >= airCount && fireCount >= waterCount) {
    primaryDosha = 'PITTA';
    secondaryDosha = 'VATA';
  } else if (airCount >= fireCount && airCount >= waterCount) {
    primaryDosha = 'VATA';
    secondaryDosha = 'KAPHA';
  } else {
    primaryDosha = 'KAPHA';
    secondaryDosha = 'PITTA';
  }

  const healthScore = Math.min(96, Math.round(55 + (score357 * 35) + (score258 * 10) - (missing.length * 2)));
  const stressScore = Math.min(95, Math.round(30 + (enhancedGridMap[5] === 0 ? 25 : 0) + (enhancedGridMap[8] > 0 ? 15 : 0) + ((1 - score357) * 20)));
  const energyScore = Math.min(98, Math.round(50 + (score951 * 35) + (enhancedGridMap[1] > 0 ? 15 : 0)));

  // Section 17: Forecast calculation
  const personalYear = reduceToSingleDigit(driver + conductor + 2026); // targeting 2026
  const personalMonth = reduceToSingleDigit(personalYear + 6); // matching current month June
  const personalDay = reduceToSingleDigit(personalMonth + 22); // matching current scale 22

  // Archetype selection based on Driver and Conductor to avoid wealth psychology contradictions
  let wealthArchetype = 'STABLE_PLANNER';
  if ([2, 6].includes(driver) || [2, 6].includes(conductor)) {
    wealthArchetype = 'COMFORT_SPENDER';
  } else if ([1, 9].includes(driver) || [1, 9].includes(conductor)) {
    wealthArchetype = 'BOLD_PROVIDER';
  } else if ([3, 7].includes(driver) || [3, 7].includes(conductor)) {
    wealthArchetype = 'SELECTIVE_SCHOLAR';
  } else {
    wealthArchetype = 'STABLE_PLANNER';
  }

  let moneyMindset = '';
  let spendingBehaviour = '';
  let riskTakingBehaviour = '';
  let financialDisciplineScore = 50;

  if (wealthArchetype === 'COMFORT_SPENDER') {
    moneyMindset = 'सुख-सुविधा और सौंदर्य को महत्व देना। धन को परिवार के लिए एक आरामदायक और सुरुचिपूर्ण जीवनशैली का साधन मानते हैं।';
    spendingBehaviour = 'अच्छी जीवनशैली, सुरुचिपूर्ण यात्रा और गुणवत्तापूर्ण वस्तुओं पर खर्च करना पसंद करते हैं। केवल संचय करने के बजाय अच्छे अनुभवों को प्राथमिकता देते हैं।';
    riskTakingBehaviour = 'मध्यम जोखिम; सुंदर भौतिक संपत्तियों, रियल एस्टेट और भरोसेमंद ब्रांड्स में निवेश अधिक सुरक्षित व पसंदीदा लगता है।';
    financialDisciplineScore = 65;
  } else if (wealthArchetype === 'BOLD_PROVIDER') {
    moneyMindset = 'महत्वाकांक्षी और विस्तारवादी सोच। आय के नए स्रोत बनाने और आगे बढ़कर बड़े वित्तीय निर्णय लेने में विश्वास रखते हैं।';
    spendingBehaviour = 'उदार स्वभाव; परिवार और सहयोगियों के लिए खुले दिल से खर्च करते हैं। कभी-कभी उत्साह में बड़े वित्तीय फैसले ले सकते हैं।';
    riskTakingBehaviour = 'साहसी और प्रगतिशील; नए बिजनेस, शेयर बाजार और विस्तार की संभावना वाले क्षेत्रों में सोच-समझकर जोखिम उठाते हैं।';
    financialDisciplineScore = 75;
  } else if (wealthArchetype === 'SELECTIVE_SCHOLAR') {
    moneyMindset = 'ज्ञान और मानसिक शांति को प्राथमिकता। धन का उपयोग स्वास्थ्य, शिक्षा, अच्छी किताबों और आंतरिक स्वतंत्रता के लिए होना चाहिए।';
    spendingBehaviour = 'सोच-समझकर खर्च करने वाले; दिखावे या अनावश्यक वस्तुओं पर व्यय करने से बचते हैं, लेकिन सीखने और स्वास्थ्य पर खुशी से खर्च करते हैं।';
    riskTakingBehaviour = 'सावधानीपूर्वक और विश्लेषणात्मक; सुरक्षित दीर्घकालिक निवेश, सरकारी योजनाएं या स्थिर रिटर्न वाले माध्यम पसंद करते हैं।';
    financialDisciplineScore = 85;
  } else { // STABLE_PLANNER
    moneyMindset = 'सुरक्षा और स्थिरता को सर्वोच्च प्राथमिकता। किसी भी कदम से पहले बचत और आपातकालीन फंड सुनिश्चित करना पसंद करते हैं।';
    spendingBehaviour = 'अनुशासित और बजट के अनुसार चलने वाले; अनावश्यक खर्चों पर नियंत्रण रखते हैं और बचत को मजबूत बनाते हैं।';
    riskTakingBehaviour = 'गणनायुक्त और सुरक्षित; बैंक फिक्स्ड डिपॉजिट, जमीन और सुरक्षित परिसंपत्तियों में निवेश को प्राथमिकता देते हैं।';
    financialDisciplineScore = 95;
  }

  // Build pristine structural Report
  return {
    personal: {
      name,
      dob: dobStr,
      gender,
      driver,
      conductor
    },
    scores: {
      mentalStrength,
      emotionalStrength,
      practicalStrength,
      leadershipScore,
      communicationScore,
      spiritualScore,
      relationshipScore,
      careerPotentialScore,
      overallLoshuScore,
      reasons
    },
    gridAnalysis: {
      present,
      missing,
      birthPresent,
      birthMissing,
      repeated,
      dominant,
      weak,
      mostInfluential: { digit: mostInfluentialDigit, reason: `यह आपके मूलांक (Driver Number) ग्रह #${driver} का प्रतिनिधित्व करता है।` },
      leastInfluential: { digit: leastInfluentialDigit, reason: `यह अंक आपके 3x3 जन्म ग्रिड में अनुपस्थित है।` },
      lifeThemeNum: conductor,
      lifeThemeText: `भाग्यांक (Conductor Number) #${conductor} द्वारा संचालित। यह आपके जीवन की समग्र दिशा और मुख्य लक्ष्यों को दर्शाता है।`,
      corePersonalityNum: driver,
      corePersonalityText: `मूलांक (Driver Number) #${driver} द्वारा संचालित। यह आपके आंतरिक स्वभाव और स्वाभाविक प्रतिक्रियाओं को दर्शाता है।`
    },
    activeCombinations,
    archetype: {
      title: archetypeTitle,
      description: archetypeDesc,
      reasoning: archetypeReasoning,
      mantra: archetypeMantra
    },
    profiling: {
      thinkingStyle: driver % 2 === 0 ? 'सहज, संवेदनशील और गहरी समझ वाला चिंतन।' : 'अत्यधिक व्यवस्थित, तार्किक और व्यावहारिक रणनीतिक सोच।',
      decisionMakingStyle: enhancedGridMap[5] > 0 ? 'व्यावहारिक विश्लेषण और स्वाभाविक अंतर्ज्ञान का संतुलित निर्णय ढांचा।' : 'महत्वपूर्ण निर्णयों में कभी-कभी असमंजस; बाहरी सलाह पर अधिक निर्भरता।',
      communicationStyle: enhancedGridMap[1] > 1 ? 'स्पष्ट, मुखर और आत्मविश्वास से अपनी बात रखने की शैली।' : 'मधुरभाषी, नपी-तुली और कूटनीतिक बातचीत।',
      learningStyle: enhancedGridMap[3] > 0 ? 'अध्ययनशील पाठक; ज्ञान को गहराई से समझकर लंबे समय तक याद रखने की क्षमता।' : 'व्यावहारिक और प्रयोग-आधारित तरीके से सीखने की आदत।',
      leadershipStyle: enhancedGridMap[9] > 0 ? 'दूरदर्शी नेतृत्व; उदाहरण पेश करके टीम को प्रेरित करने की क्षमता।' : 'सहयोगात्मक मार्गदर्शक; टीम में सामंजस्य बनाकर कार्य पूरा कराना।',
      workStyle: enhancedGridMap[8] > 0 ? 'अथक परिश्रमी; कार्य पूरा होने तक निरंतर समर्पित रहना।' : 'कुशल समन्वयक; कार्यों को सही लोगों में विभाजित कर परिणाम पाना।',
      problemSolvingStyle: enhancedGridMap[7] > 0 ? 'समस्या को गहराई से विश्लेषित कर मूल कारण तक पहुंचने में माहिर।' : 'टीम की सामूहिक राय और सहयोग से समाधान निकालना।',
      stressResponsePattern: primaryDosha === 'PITTA' ? 'दबाव में कभी-कभी शीघ्र उत्तेजना या चिड़चिड़ापन।' : 'भीतर मानसिक चिंता और विचारों की अत्यधिक उथल-पुथल।',
      motivationPattern: `मूलांक #${driver} के प्रभाव से आत्म-सम्मान और स्वयं की पहचान बनाने की गहरी प्रेरणा।`,
      selfDisciplineLevel: enhancedGridMap[4] > 0 ? 'नियमित दिनचर्या, व्यवस्थित कार्यशैली और समय की पाबंदी।' : 'रचनात्मक सोच, लेकिन दैनिक दिनचर्या में कभी-कभी अनियमितता।',
      confidenceLevel: enhancedGridMap[5] > 0 ? 'मजबूत आंतरिक आत्मविश्वास; दूसरों की आलोचना से अप्रभावित रहना।' : 'आस-पास के लोगों के फीडबैक और माहौल के अनुसार बदलता हुआ।',
      publicImage: `समाज में एक गंभीर, गरिमामय और भरोसेमंद व्यक्ति के रूप में पहचान।`,
      personalGrowthAreas: `अनुपस्थित अंक (${missing.join(', ')}) के संतुलन से जीवन में स्थिरता और स्पष्टता बढ़ाएं।`
    },
    relationshipBehaviour: {
      loveLanguage: driver === 6 || driver === 2 ? 'सराहना के प्यारे शब्द, उपहार और भावनात्मक अपनापन।' : 'मददगार स्वभाव और जीवनसाथी को व्यावहारिक सुरक्षा देना।',
      emotionalNeeds: `पारिवारिक शांति, सम्मान और बिना किसी अनावश्यक तनाव के आरामदायक माहौल।`,
      commitmentStyle: `एक बार भरोसा बन जाने के बाद अत्यंत निष्ठावान और दीर्घकालिक समर्पण।`,
      trustPattern: `भरोसा धीरे-धीरे बनता है; गहराई से परखने के बाद ही अपना दिल खोलते हैं।`,
      conflictBehaviour: `कटु विवाद से बचने के लिए कुछ समय शांत रहना और बात टालना पसंद करते हैं।`,
      marriageExpectations: `जीवन में पूर्ण संतुलन, आपसी सम्मान और साथ मिलकर पारिवारिक समृद्धि बढ़ाना।`,
      partnerExpectations: `सुलझा हुआ स्वभाव, बौद्धिक समझ और एक-दूसरे के प्रति गहरा आदर।`,
      emotionalCompatibilityStyle: `अनुकूल तत्व और मित्र ग्रहों वाले अंकों के साथ स्वाभाविक सामंजस्य।`,
      strengths: `गहरी संवेदनशीलता और परिवार के प्रति अटूट निष्ठा।`,
      challenges: `वित्तीय या काम के तनाव के समय जरूरत से ज्यादा आलोचनात्मक हो जाना।`,
      growthSuggestions: `मन की बात दबाने के बजाय जीवनसाथी के साथ खुलकर साझा करें।`
    },
    familyKarma: {
      fatherInfluence: `सूर्य-शनि के प्रभाव से पिता अथवा परिवार के वरिष्ठों के प्रति महत्वपूर्ण जिम्मेदारियों का योग।`,
      motherInfluence: `चंद्र-शुक्र के समन्वय से माता का गहरा भावनात्मक संबल और आशीर्वाद प्राप्त होता है।`,
      ancestralInfluence: `पारिवारिक ज्ञान, धैर्य और स्थायी संपत्ति के मामलों में पूर्वजों का आशीर्वाद।`,
      familyResponsibilities: `पारिवारिक संपत्तियों और महत्वपूर्ण निर्णयों में मुख्य सलाहकार की भूमिका निभाना।`,
      inheritedStrengths: `अथक धैर्य, दूरदर्शिता और परिवार को जोड़े रखने की क्षमता।`,
      inheritedChallenges: `पुरानी पारिवारिक संपत्तियों या मामलों में कभी-कभी अप्रत्याशित देरी।`,
      familyKarmaLessons: `पुराने मतभेदों को भुलाकर रिश्तों में सौहार्द बनाए रखना धन-मार्ग को प्रशस्त करता है।`,
      generationalGrowthAreas: `केवल पैतृक साधनों पर निर्भर रहने के बजाय अपनी स्वतंत्र संपत्ति और पहचान बनाएं।`
    },
    wealthPsychology: {
      moneyMindset,
      riskTakingBehaviour,
      spendingBehaviour,
      savingBehaviour: `उपायों के बाद योजनाबद्ध तरीके से नियमित बचत और वेल्थ कम्पाउंडिंग।`,
      investmentBehaviour: `जमीन, रियल एस्टेट, सुरक्षित फिक्स्ड डिपॉजिट और ठोस संपत्तियों में निवेश।`,
      businessMindset: enhancedGridMap[5] > 0 ? 'व्यापारिक सोच में दक्ष; बाजार के रुझानों को तेजी से भांपने की क्षमता।' : 'सलाहकार और रणनीतिक भूमिका; साझेदारी में कार्य करना अधिक फलदायी।',
      wealthCreationStyle: `स्थिर और सुरक्षित संचय; अनुकूल महादशा में धन में तेजी से वृद्धि।`,
      financialDisciplineScore,
      wealthPotentialScore: Math.min(99, Math.round(40 + (score951 * 15) + (score357 * 15) + (score816 * 15) + (score276 * 10))),
      moneyBlockages: `दक्षिण-पश्चिम (South-West) में पृथ्वी तत्व की कमी से कभी-कभी धन अटकने की संभावना।`,
      financialRemedies: `दक्षिण-पूर्व (SE) में हरे पौधे और मध्य क्षेत्र (Brahmasthan) में पीला लैंप स्थापित करें।`
    },
    careerBlueprint: {
      bestCareers: ['Engineering', 'Systemic Planning', 'Financial Audits', 'Technology Architectures'],
      governmentJobs: driver === 1 || driver === 9 ? 'अत्यंत अनुकूल; सूर्य-मंगल का प्रभाव प्रशासनिक व सरकारी क्षेत्रों में सफलता दिलाता है।' : 'मध्यम अनुकूल; सलाहकार या तकनीकी पदों के लिए बेहतर।',
      privateJobs: `कॉर्पोरेट कंसल्टेंसी, मैनेजमेंट और आधुनिक टेक्नोलॉजी सेक्टर के लिए अत्यंत उपयुक्त।`,
      businessSuitability: enhancedGridMap[5] > 0 ? 'स्वतंत्र व्यावसायिक उद्यमों और ट्रेडिंग के लिए उच्च अनुकूलता।' : 'पार्टनरशिप और रणनीतिक सहयोग के साथ काम करना श्रेष्ठ रहेगा।',
      suitabilityScores: {
        teaching: enhancedGridMap[3] ? 95 : 55,
        technology: enhancedGridMap[4] || enhancedGridMap[7] ? 90 : 60,
        management: enhancedGridMap[9] || enhancedGridMap[1] ? 92 : 58,
        sales: enhancedGridMap[5] ? 94 : 50,
        creative: enhancedGridMap[6] ? 96 : 55,
        spiritual: enhancedGridMap[7] || enhancedGridMap[2] ? 95 : 60,
        leadership: enhancedGridMap[1] ? 94 : 60
      },
      recommendedCareers: [
        { title: "Systems Designer", explanation: "व्यवस्थित और तार्किक सोच से बड़े प्रोजेक्ट्स की रूपरेखा तैयार करने में माहिर।" },
        { title: "Corporate Consultant", explanation: "व्यावसायिक समस्याओं को पहचानकर सही मार्गदर्शन देने की उत्कृष्ट क्षमता।" },
        { title: "Financial Arbitrator", explanation: "वित्तीय ऑडिट, कानूनी समीक्षा और बैलेंस शीट विश्लेषण के लिए श्रेष्ठ।" },
        { title: "Occult Researcher", explanation: "अंकशास्त्र, ज्योतिष और गूढ़ विद्याओं के रहस्यों को समझने का स्वाभाविक योग।" },
        { title: "Real Estate Arbitrageur", explanation: "शनि का प्रभाव जमीन और अचल संपत्तियों के सौदों में अनुकूलता देता है।" },
        { title: "Digital Communication Expert", explanation: "बुध का प्रभाव विचारों को स्पष्ट संदेश में बदलकर प्रभावशाली संवाद स्थापित करता है।" },
        { title: "Hospitality Manager", explanation: "शुक्र का प्रभाव अतिथियों को उत्कृष्ट अनुभव और सुरुचिपूर्ण सुविधाएं देने में सहायक है।" },
        { title: "Project Manager", explanation: "टीम और वित्तीय संसाधनों के बीच समन्वय बनाकर समय पर लक्ष्य हासिल करना।" },
        { title: "Education Specialist", explanation: "गुरु (बृहस्पति) का आशीर्वाद ज्ञान को सरल तरीके से दूसरों तक पहुंचाने में मदद करता है।" },
        { title: "Logistics Analyst", explanation: "तार्किक गणनाओं के माध्यम से सप्लाई चेन और संचालन को अधिक प्रभावी बनाना।" }
      ]
    },
    hiddenTalents: {
      naturalGifts: `तीव्र अंतर्ज्ञान, व्यवस्थित योजना और मानवीय संवेदनाओं को तुरंत भांपने की कला।`,
      talents: {
        creative: `सुरुचिपूर्ण सौंदर्य दृष्टि और स्थान सजावट की स्वाभाविक समझ।`,
        communication: `प्रभावशाली वाणी; लोगों को लक्ष्य के प्रति प्रेरित करने की क्षमता।`,
        business: `पूंजी के प्रवाह और व्यापारिक अवसरों को समय से पहले पहचानना।`,
        teaching: `कठिन और गूढ़ विषयों को सरल नोट्स में समझा देने का हुनर।`,
        leadership: `संकट प्रबंधन; कठिन समय में भी शांत रहकर सही निर्णय लेना।`,
        spiritual: `ऊर्जा स्कैनिंग और जन्म ग्रिड के अनुरूप सूक्ष्म संकेतों को समझना।`,
        artistic: `उत्कृष्ट कला, रत्न, सुरुचिपूर्ण वस्त्र और डिजाइन की गहरी परख।`,
        entrepreneurial: `सीमित संसाधनों से भी नए स्टार्टअप और प्रोजेक्ट्स की सफल शुरुआत करना।`
      },
      mostPowerfulTalent: `सहज रणनीतिक योजना: तार्किक सोच और मानवीय मनोविज्ञान का अद्भुत संगम।`
    },
    karmicLessons: missing.map(digit => {
      const lessonsMap: Record<number, { lesson: string; challenge: string; growth: string; advice: string; strategy: string; remedy: string }> = {
        1: {
          lesson: "दूसरों की मंजूरी के बिना अपने स्वतंत्र विचारों को व्यक्त करने में संकोच।",
          challenge: "सार्वजनिक मंचों पर खुलकर बोलने में झिझक या अपनी क्षमता पर संदेह होना।",
          growth: "आत्मनिर्भरता और आंतरिक साहस को जाग्रत करना; स्वयं की सीमाएं तय करना।",
          advice: "दूसरों के कहने की प्रतीक्षा न करें; पहल करें और आत्मविश्वास से आगे बढ़ें।",
          strategy: "हर महीने बिना किसी की अनुमति की प्रतीक्षा किए एक छोटा प्रोजेक्ट स्वयं पूरा करें।",
          remedy: "प्रातःकाल सूर्य को तांबे के लोटे से जल अर्पित करें; दाहिनी कलाई पर लाल या नारंगी कलावा बांधें।"
        },
        2: {
          lesson: "अत्यधिक भावुकता और मूड में आने वाले उतार-चढ़ाव को संतुलित करना।",
          challenge: "छोटी-छोटी बातों को दिल से लगा लेना; दूसरों की नकारात्मक ऊर्जा से जल्दी प्रभावित होना।",
          growth: "भावनात्मक स्थिरता विकसित करना और अपनी भावनाओं को दूसरों के विचारों से अलग रखना।",
          advice: "अत्यधिक भावुकता या गुस्से के समय कोई भी बड़ा निर्णय लेने से बचें।",
          strategy: "पर्याप्त नींद लें, पानी भरपूर पिएं और पूर्णिमा के समय शांत ध्यान का अभ्यास करें।",
          remedy: "चांदी का छल्ला या मोती धारण करें; दक्षिण-पश्चिम (SW) में पीली मिट्टी की वस्तुएं रखें।"
        },
        3: {
          lesson: "अध्ययन और ज्ञान को एकाग्रता के साथ पूरा करना; गुरु या मेंटर के मार्गदर्शन का अभाव।",
          challenge: "कई काम एक साथ शुरू करना लेकिन अंत तक पूरा न करना; वरिष्ठों की सलाह को अनदेखा करना।",
          growth: "ज्ञान को व्यवस्थित करना और दीर्घकालिक अध्ययन में निरंतरता बनाए रखना।",
          advice: "योग्य मेंटर्स और गुरुओं का सम्मान करें; किसी भी विषय को धैर्यपूर्वक पूरा पढ़ें।",
          strategy: "प्रति सप्ताह कम से कम 2 घंटे स्वाध्याय या ज्ञानवर्धक ग्रंथों के अध्ययन में लगाएं।",
          remedy: "गुरुवार को शिक्षकों या बुजुर्गों को पीले फल अर्पित करें; अपनी अध्ययन मेज साफ रखें।"
        },
        4: {
          lesson: "कठोर अनुशासन, नियमित दिनचर्या और धन की व्यवस्थित बचत की आवश्यकता।",
          challenge: "अनियमित दिनचर्या; कानूनी या दस्तावेजी कार्यों में ढिलाई; बजट न बनाना।",
          growth: "जीवन में ठोस नींव तैयार करना और हर काम में व्यवस्थित नियम अपनाना।",
          advice: "दैनिक खर्चों का हिसाब रखें और अपने घर व दफ्तर की अलमारियों को सुव्यवस्थित रखें।",
          strategy: "सुबह उठने का एक निश्चित समय तय करें और टू-डू लिस्ट बनाकर काम पूरा करें।",
          remedy: "दक्षिण-पूर्व (SE) में लकड़ी की विंड चाइम लगाएं; हरा एवेंच्यूरिन ब्रेसलेट पहनें।"
        },
        5: {
          lesson: "मानसिक स्थिरता और व्यापारिक संतुलन को मजबूत करना।",
          challenge: "मन का बार-बार भटकना; व्यापार या बातचीत में सही शर्तें तय न कर पाना।",
          growth: "आंतरिक संतुलन, स्पष्ट संवाद और व्यावसायिक बातचीत में निपुणता हासिल करना।",
          advice: "जल्दबाजी में फैसले न लें; किसी भी बड़े कदम से पहले अच्छी तरह सोच-विचार करें।",
          strategy: "नाभि केंद्रित श्वास प्राणायाम करें; काम की मेज पर पीतल का छोटा पिरामिड रखें।",
          remedy: "कनिष्ठिका उंगली में पन्ना (Emerald) धारण करें या बुधवार को हरी मूंग दान करें।"
        },
        6: {
          lesson: "दूसरों से सहयोग और पारिवारिक स्नेह को सहर्ष स्वीकार करना।",
          challenge: "कठिन समय में अकेलापन महसूस करना; स्वयं के आराम और घर के सौंदर्य की उपेक्षा करना।",
          growth: "अच्छे मित्रों का दायरा बढ़ाना और जीवन में सुख-समृद्धि को आकर्षित करना।",
          advice: "दूसरों की निस्वार्थ मदद करें और बदले में प्रेम व सहयोग का आदर करें।",
          strategy: "पारिवारिक मिलनसार डिनर आयोजित करें; उत्तर-पश्चिम (NW) दिशा को सुरुचिपूर्ण सजाएं।",
          remedy: "सफेद ओपल या जरकन पहनें; स्नान के पानी में गुलाब जल का प्रयोग करें।"
        },
        7: {
          lesson: "धैर्यपूर्वक शोध और गहरी समझ विकसित करना; विश्वासघात से बचना।",
          challenge: "बिना सोचे-समझे जल्दी विश्वास कर लेना; अपनी गुप्त बातें आसानी से साझा करना।",
          growth: "गहन विश्लेषणात्मक दृष्टि और आध्यात्मिक अंतर्दृष्टि को जाग्रत करना।",
          advice: "तथ्यों की दो बार पुष्टि करें; महत्वपूर्ण योजनाएं हर किसी से साझा न करें।",
          strategy: "प्रतिदिन 20 मिनट मौन रहकर ध्यान करें और अपने अनुभवों की डायरी लिखें।",
          remedy: "भगवान गणेश के मंत्रों का जाप करें; बेजुबान जानवरों या कुत्तों को भोजन कराएं।"
        },
        8: {
          lesson: "स्थायी संपत्ति निर्माण में धैर्य और भौतिक अनुशासन की आवश्यकता।",
          challenge: "कड़े परिश्रम में जल्दी ऊब जाना; कानूनी व सरकारी फाइलों में अप्रत्याशित देरी।",
          growth: "दीर्घकालिक वित्तीय योजना, धैर्य और शनि के अनुशासनात्मक मूल्यों को अपनाना।",
          advice: "समय की कीमत समझें; जिम्मेदारियों को बोझ मानने के बजाय अवसर समझकर निभाएं।",
          strategy: "शनिवार को घर और कार्यस्थल की अच्छी तरह सफाई करें और व्यवस्थित रखें।",
          remedy: "काली तुलसी या ब्लैक टूमलाइन पास रखें; उत्तर-पूर्व (NE) में मिट्टी के बर्तन रखें।"
        },
        9: {
          lesson: "सामाजिक पहचान, साहस और नेतृत्व भावना को जाग्रत करना।",
          challenge: "समूहों में अपनी उपस्थिति दर्ज न करा पाना; आत्मविश्वास व ऊर्जा में कमी महसूस होना।",
          growth: "साहस, आत्म-सम्मान और नैतिक नेतृत्व की शक्ति को जाग्रत करना।",
          advice: "पीछे न हटें; जब भी नेतृत्व की आवश्यकता हो, आगे आकर जिम्मेदारी संभालें।",
          strategy: "सार्वजनिक बोलने या शारीरिक फिटनेस की गतिविधियों में सक्रिय भाग लें।",
          remedy: "दक्षिण दिशा में लाल लैंप या मोमबत्ती जलाएं; अपने पास लाल रुमाल रखें।"
        }
      };

      const emptyLesson = {
        lesson: "सामान्य ऊर्जा संतुलन की जांच।",
        challenge: "मौलिक तत्वों को समन्वित करें।",
        growth: "ब्रह्मांडीय ऊर्जा को जाग्रत करें।",
        advice: "नियमित ध्यान और प्राणायाम से संतुलन बनाए रखें।",
        strategy: "नियमित व समयबद्ध कार्य करें।",
        remedy: "अनुकूल क्रिस्टल अपने पास रखें।"
      };

      const data = lessonsMap[digit] || emptyLesson;

      return {
        digit,
        lesson: data.lesson,
        lifeChallenge: data.challenge,
        growthOpportunity: data.growth,
        practicalAdvice: data.advice,
        developmentStrategy: data.strategy,
        personalizedRemedy: data.remedy
      };
    }),
    soulMission: {
      lifePurpose: `आंतरिक आध्यात्मिक दृष्टि (मूलांक #${driver}) को एक स्थायी व्यावहारिक धरोहर (भाग्यांक #${conductor}) में बदलना, जो समाज और परिवार के काम आए।`,
      soulMissionText: `आपकी आत्मा ने मुख्य गंतव्य के रूप में भाग्यांक #${conductor} को चुना है। इसके लिए धैर्य, सत्यनिष्ठा और सेवा-भाव के पाठ सीखने होंगे।`,
      higherCalling: `बदलते समय में लोगों के लिए सही मार्गदर्शन, संतुलन और शांति का प्रेरणास्रोत बनना।`,
      societyContribution: `सुरक्षित और व्यवस्थित कार्य वातावरण तैयार करना तथा लोगों को सही जीवन-दिशा देना।`,
      spiritualDirection: `व्यावहारिक सीमाओं का पालन करते हुए आत्म-चिंतन और ध्यान के माध्यम से भीतर की यात्रा करना।`,
      purposeStatement: `मैं अपने मूलांक की इच्छाशक्ति से ऐसे स्थायी कार्य करता हूँ जो मेरे साथ सभी को स्थिरता और समृद्धि दें।`,
      legacyPotential: `अत्यंत प्रभावशाली! बहु-पीढ़ीगत संपत्तियों और सम्मानित पारिवारिक संस्कारों के लिए अनुकूल।`
    },
    arrowsAnalysis,
    mobileFusion: {
      checked: !!mobileNum,
      mobileNumber: mobileNum || "दर्ज नहीं किया गया",
      strengths: mStrengths,
      weaknesses: mWeaknesses,
      compensationAnalysis: mComp,
      supportAnalysis: mSupport,
      conflictAnalysis: mConflict,
      improvements: mImprovements
    },
    vaastuFusion: {
      kuaNumber,
      groupType,
      directionAnalysis: `आपका कुआ अंक ${kuaNumber} है, जो ${groupType === 'EAST_GROUP' ? 'पूर्व समूह (East Group)' : 'पश्चिम समूह (West Group)'} से संबंधित है।`,
      bestDirections,
      avoidDirections,
      zones: {
        career: `उत्तर (North): करियर में प्रगति और नए अवसरों के लिए धातु का फव्वारा या जल तत्व रखें।`,
        money: `दक्षिण-पूर्व (South-East): धन आगमन को निर्बाध रखने के लिए हरे पौधे या लकड़ी की विंड चाइम लगाएं।`,
        health: `पूर्व (East): उत्तम स्वास्थ्य के लिए तुलसी का पौधा लगाएं और पुराना कबाड़ न रखें।`,
        relationship: `दक्षिण-पश्चिम (South-West): वैवाहिक विश्वास और मधुरता के लिए मिट्टी की कलाकृतियां या रोज़ क्वार्ट्ज रखें।`
      },
      homeRemedies: `दक्षिण-पश्चिम बेडरूम से नीला रंग हटाएं; दीवारों पर क्रीम या हल्के बादामी रंग का प्रयोग करें।`,
      officeRemedies: `अनावश्यक कानूनी अड़चनों से बचने के लिए महत्वपूर्ण बैठकों में अनुकूल दिशा ${bestDirections[0]} की ओर मुंह करके बैठें।`
    },
    healthAnalysis: {
      healthScore,
      stressScore,
      energyScore,
      emotionalStabilityScore: Math.round((relationshipScore + practicalStrength) / 2),
      mentalStrengthScore: mentalStrength,
      primaryDosha,
      secondaryDosha,
      healthTendencies: primaryDosha === 'PITTA' 
        ? "अग्नि तत्व की अधिकता से एसिडिटी, त्वचा में जलन और पित्त बढ़ने की प्रवृत्ति। शीतल और सात्विक आहार लाभदायक रहेगा।"
        : "वात तत्व के प्रभाव से जोड़ों में रूखापन, नसों में खिंचाव और पाचन में गैस बनने की प्रवृत्ति। गर्म व पौष्टिक आहार अनुकूल रहेगा।",
      lifestyleRecommendations: primaryDosha === 'PITTA'
        ? ["मीठे, कड़वे और तासीर में ठंडे खाद्य पदार्थों का सेवन करें।", "अत्यधिक तीखे-मसालेदार भोजन और दोपहर की तेज धूप से बचें।", "सोमवार की रात्रि को चंद्र दर्शन या ध्यान का अभ्यास करें।"]
        : ["हल्का गर्म, सुपाच्य और ताजा पका हुआ भोजन लें।", "तिल के तेल से नियमित मालिश का अभ्यास करें।", "धीमी गति वाले प्राणायाम और योगासनों को दिनचर्या में शामिल करें।"],
      preventiveWellness: `सूर्यास्त के बाद तनावपूर्ण बैठकों से बचें; नियमित जल पिएं और शांत निद्रा का ध्यान रखें।`
    },
    forecasts: {
      personalYear,
      personalMonth,
      personalDay,
      career: `ऊर्जा के संकेत करियर में सकारात्मक और स्थायी बदलाव दर्शा रहे हैं। नई पहलों के लिए अनुकूल समय है।`,
      money: `धन प्रवाह स्थिर रहेगा; बचत में क्रमिक वृद्धि होगी। शनिवार के दिन बिना सोचे-समझे जोखिम भरे निवेश से बचें।`,
      relationships: `रिश्तों के लिए संतुलित वर्ष; खुलकर बातचीत करने से पुरानी पारिवारिक गलतफहमियां दूर होंगी।`,
      health: `स्वास्थ्य सूचकांक उत्तम; दिनचर्या नियमित रखें और सुबह गुनगुने पानी या हर्बल चाय का सेवन करें।`,
      business: `व्यापारिक शुरुआत, नए सौदों और कानूनी समझौतों के लिए यह समय अत्यंत अनुकूल है।`,
      travel: `व्यापारिक बातचीत और कार्य के सिलसिले में छोटी दूरी की उपयोगी यात्राओं के योग बन रहे हैं।`,
      spiritualGrowth: `अध्यात्म, योग और ध्यान के अनुभवों में स्वाभाविक गहराई और शांति प्राप्त होगी।`,
      opportunities: [`नया व्यावसायिक उपक्रम या व्यापारिक प्रोजेक्ट शुरू करना।`, `पारिवारिक और सामाजिक संबंधों को मजबूत बनाना।`],
      warnings: [`महत्वपूर्ण दिनों में किसी भी उत्तेजक विवाद से बचें।`, `सट्टा या फर्जी त्वरित-धन वाली योजनाओं से दूर रहें।`]
    },
    remedies: {
      luckyNumbers: [driver, conductor, 5, 1, 6],
      luckyDates: [`${driver} तारीख`, `${conductor} तारीख`, '5 तारीख', '14 तारीख', '23 तारीख'],
      luckyDays: ['बुधवार (Wednesday)', 'गुरुवार (Thursday)', 'शुक्रवार (Friday)'],
      luckyColours: ['पन्ना हरा (Emerald Green)', 'रॉयल ब्लू (Royal Blue)', 'हल्का क्रीम (Champagne Cream)'],
      luckyDirections: bestDirections,
      personalRemedies: [`प्रतिदिन 15 मिनट अपनी सफलता दिशा (${bestDirections[0]}) की ओर मुंह करके ध्यान करें।`, `माता-पिता और बुजुर्गों का नियमित आशीर्वाद लें।`],
      careerRemedies: [`अपने ऑफिस टेबल पर हरा एवेंच्यूरिन क्रिस्टल ट्री रखें।`, `महत्वपूर्ण मीटिंग्स में अपनी अनुकूल दिशा (${bestDirections[0]}) की ओर मुख करके बैठें।`],
      relationshipRemedies: [`घर के दक्षिण-पश्चिम कोने में रोज़ क्वार्ट्ज का जोड़ा रखें।`, `बेडरूम में पुराने बंद पड़े इलेक्ट्रॉनिक्स या टूटी घड़ियां बिल्कुल न रखें।`],
      financialRemedies: [`बुधवार की सुबह हरे-भरे पत्तों वाले पौधे में जल दें।`, `शनिवार को जरूरतमंदों को भोजन या काले तिल का दान करें।`],
      spiritualRemedies: [`अपने आर्केटाइप मंत्र: "${archetypeMantra}" का प्रतिदिन सुबह 27 बार जाप करें।`, `प्रति रविवार 30 मिनट मौन (Mauna) का अभ्यास करें।`],
      actionPlan: `ग्रिड के अनुपस्थित अंकों के संतुलन पर ध्यान दें। संबंधित वास्तु क्षेत्रों में उपयुक्त तत्व स्थापित करें। दिनचर्या नियमित रखें और 90 दिनों की कार्ययोजना का निष्ठापूर्वक पालन करें।`,
      plan90Days: {
        days1_30: "घर और ऑफिस के सभी स्थानों की सफाई करें। बंद घड़ियां और पुराना कबाड़ हटाएं। अपनी सफलता दिशा की ओर मुंह करके बैठें और दैनिक मंत्र जाप शुरू करें।",
        days31_60: "वास्तु उपाय लागू करें (दक्षिण-पूर्व में हरे पौधे, दक्षिण-पश्चिम में मिट्टी का दीपक)। अपने मूलांक ग्रह के अनुकूल दिन पर जरूरतमंदों को अन्न दान करें।",
        days61_90: "दैनिक खर्चों का व्यवस्थित हिसाब रखें। मोबाइल नंबर के सुझावों पर अमल करें। धन के आगमन और मानसिक शांति में क्रमिक वृद्धि का अवलोकन करें।"
      }
    }
  };
}
