import { CompleteNumerologyProfile } from './types';
import { calculateKuaNumber } from './kuaEngine';
import { calculatePersonalYearNumber } from './luckyDatesEngine';
import { parseIndianDate } from '../utils/dateUtils';
import { getCompoundDetails } from '../services/compoundDatabase';
import { NUMBER_DEFINITIONS } from './methodology/numberMeanings';
import { PLANET_DEFINITIONS } from './methodology/planetMappings';
import { getCombination81 } from './methodology/combinationDefinitions';
import { PROFESSION_RULES } from './methodology/professionDefinitions';

export interface PinnaclePhase {
  phaseNumber: number;
  name: string;
  ageSpan: string;
  pinnacleNumber: number;
  planet: string;
  themeHi: string;
  guidanceHi: string;
}

export interface LifeChallenge {
  challengeNumber: number;
  name: string;
  value: number;
  planet: string;
  areaHi: string;
  lessonHi: string;
  remedyHi: string;
}

export interface EventWindow {
  age: number;
  calendarYear: number;
  type: 'CAREER_SURGE' | 'TRANSFORMATION' | 'MATURITY_MILESTONE' | 'FINANCIAL_STABILITY' | 'RELATIONSHIP_HARMONY';
  titleHi: string;
  descriptionHi: string;
  planetarySupportHi: string;
}

export interface PersonalYearNarrative {
  year: number;
  personalYear: number;
  theme: string;
  career: string;
  finance: string;
  relationships: string;
  family: string;
  travel: string;
  opportunities: string;
  caution: string;
  recommendedFocus: string;
}

export interface MonthlyDashaYog {
  monthIndex: number;
  monthNameHi: string;
  monthNameEn: string;
  py: number;
  pm: number;
  mahadashaPlanet: string;
  antardashaPlanet: string;
  primaryTheme: string;
  career: string;
  finance: string;
  relationship: string;
  caution: string;
  action: string;
}

export interface GrahDrishtiAnalysis {
  driverPlanet: string;
  conductorPlanet: string;
  relationshipType: 'FRIENDLY' | 'NEUTRAL' | 'CHALLENGING' | 'HARMONIOUS';
  relationshipLabelHi: string;
  synergyNarrativeHi: string;
  dominantAspects: Array<{
    planetPair: string;
    vibeHi: string;
    lifeImpactHi: string;
  }>;
}

export interface ExpertConsultationDossier {
  consultantSnapshot: {
    title: string;
    coreVerdictHi: string;
    dominantEnergyHi: string;
    bestAvenueHi: string;
    strategicCautionHi: string;
  };
  tithiAnkAnalysis: {
    birthDate: number;
    compoundTitle: string;
    compoundMeaning: string;
    tithiNatureHi: string;
    numericalFrequencyHi: string;
  };
  characteristicsProfile: {
    thinkingStyle: string;
    emotionalResponse: string;
    workHabit: string;
    socialConduct: string;
    leadershipTrait: string;
  };
  lifePinnacles: PinnaclePhase[];
  lifeChallenges: LifeChallenge[];
  eventWindows: EventWindow[];
  educationAnalysis: {
    learningStyle: string;
    academicStrengths: string[];
    suitableDisciplines: string[];
    studyDirection: string;
  };
  careerDeepDive: {
    primaryAvenues: string[];
    entrepreneurialFit: string;
    workplaceRole: string;
    successStrategy: string;
  };
  financeBehaviour: {
    moneyMindset: string;
    wealthAccumulationPattern: string;
    investmentSuitability: string;
    financialCaution: string;
  };
  relationshipFamilyDynamics: {
    relationshipPattern: string;
    familyRole: string;
    communicationAdvice: string;
    harmonyKey: string;
  };
  uniqueAboutYou: {
    cosmicSignature: string;
    hiddenGift: string;
    distinctiveAura: string;
  };
  numeroVastuInterpretation: {
    loShuZoneHarmonyHi: string;
    residenceEntranceDynamicsHi: string;
    suggestedVastuRemedies: string[];
  };
  lifeChangingWindows?: Array<{
    window: string;
    catalyst: string;
    themeHi: string;
    adviceHi: string;
  }>;
  pinnacles?: Array<{
    phaseName: string;
    number: number;
    ageSpan: string;
    guidanceHi: string;
  }>;
  grahDrishti: GrahDrishtiAnalysis;
  lifestyleSuggestions: {
    dailyRoutineHi: string;
    dietaryGuidelineHi: string;
    mindfulnessPracticeHi: string;
    favorableTimingHi: string;
  };
  personalYearNarrative: PersonalYearNarrative;
  monthlyDashaForecast: MonthlyDashaYog[];
  balancingRemedies: {
    primaryYantraHi: string;
    sacredMantraHi: string;
    luckyColorsHi: string[];
    avoidColorsHi: string[];
    crystalRecommendationHi: string;
    planetaryCharityHi: string;
    signatureRecommendationHi: string;
  };
  expertSummary: {
    strongestTrait: string;
    developmentArea: string;
    careerDirection: string;
    relationshipGuidance: string;
    primaryRemedy: string;
    timeCycleGuidance: string;
    masterAdvice: string;
  };
  finalSummaryNotes: {
    pinnacleVerdictHi: string;
    keyTakeawaysHi: string[];
    closingBlessingHi: string;
  };
}

function reduceDigit(n: number): number {
  let val = Math.abs(n);
  while (val > 9) {
    val = val.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return val === 0 ? 9 : val;
}

const PLANET_NAMES: Record<number, string> = {
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

const YANTRA_BY_NUMBER: Record<number, string> = {
  1: 'श्री सूर्य यंत्र (Surya Yantra) को पूर्व दिशा में स्थापित करें।',
  2: 'श्री चंद्र यंत्र (Chandra Yantra) अथवा शिव पंचायत को उत्तर-पश्चिम या ईशान में रखें।',
  3: 'श्री गुरु (बृहस्पति) यंत्र को उत्तर-पूर्व (ईशान कोण) में स्थापित करें।',
  4: 'श्री राहु शांति यंत्र अथवा मां सरस्वती चित्र को नैऋत्य/ईशान में रखें।',
  5: 'श्री बुध यंत्र अथवा कुबेर यंत्र को उत्तर दिशा में स्थापित करें।',
  6: 'श्री शुक्र यंत्र अथवा श्री यंत्र को दक्षिण-पूर्व (आग्नेय) या ईशान में रखें।',
  7: 'श्री केतु यंत्र अथवा श्री गणेश यंत्र को ईशान कोण में स्थापित करें।',
  8: 'श्री शनि यंत्र अथवा हनुमान रक्षा कवच को पश्चिम दिशा में रखें।',
  9: 'श्री मंगल यंत्र अथवा हनुमान यंत्र को दक्षिण या पूर्व दिशा में स्थापित करें।'
};

const AVOID_COLORS_BY_NUMBER: Record<number, string[]> = {
  1: ['गहरा काला (Deep Black)', 'गहरा नीला (Dark Navy)'],
  2: ['गहरा काला (Deep Black)', 'गहरा लाल (Dark Crimson)'],
  3: ['गहरा काला (Deep Black)', 'गहरा भूरा (Dark Brown)'],
  4: ['चमकीला लाल (Bright Red)', 'गहरा नारंगी (Fiery Orange)'],
  5: ['गहरा काला (Deep Black)', 'गहरा लाल (Deep Crimson)'],
  6: ['गहरा काला (Deep Black)', 'मटमैला भूरा (Dull Brown)'],
  7: ['गहरा काला (Deep Black)', 'अत्यधिक भड़कीला लाल (Flashy Red)'],
  8: ['चमकीला लाल (Bright Red)', 'तांबे जैसा नारंगी (Copper Orange)'],
  9: ['गहरा काला (Deep Black)', 'गहरा स्लेटी (Dark Grey)']
};

export function deriveExpertConsultationDossier(
  profile: CompleteNumerologyProfile
): ExpertConsultationDossier {
  const { coreNumbers, identity, loshu, vedicDasha } = profile;
  const kuaProfile = profile.kua;
  const mulank = coreNumbers.mulank || 1;
  const bhagyank = coreNumbers.bhagyank || 1;

  const mDef = NUMBER_DEFINITIONS[mulank] || NUMBER_DEFINITIONS[1];
  const bDef = NUMBER_DEFINITIONS[bhagyank] || NUMBER_DEFINITIONS[1];
  const mPlanet = PLANET_DEFINITIONS[mulank] || PLANET_DEFINITIONS[1];
  const bPlanet = PLANET_DEFINITIONS[bhagyank] || PLANET_DEFINITIONS[1];
  const comb81 = getCombination81(mulank, bhagyank);

  const rawDob = (identity?.dob || identity?.standardDOB || '').trim();
  const parsed = parseIndianDate(rawDob);
  const hasValidDob = Boolean(parsed && parsed.isValid);
  const day = hasValidDob ? parsed!.day : 0;
  const month = hasValidDob ? parsed!.month : 0;
  const year = hasValidDob ? parsed!.year : 0;

  const rDay = hasValidDob ? reduceDigit(day) : 0;
  const rMonth = hasValidDob ? reduceDigit(month) : 0;
  const rYear = hasValidDob ? reduceDigit(year) : 0;

  // 1. PINNACLES (Classical Indian / Western Synthesis)
  const pin1Val = hasValidDob ? reduceDigit(rMonth + rDay) : 0;
  const pin2Val = hasValidDob ? reduceDigit(rDay + rYear) : 0;
  const pin3Val = hasValidDob ? reduceDigit(pin1Val + pin2Val) : 0;
  const pin4Val = hasValidDob ? reduceDigit(rMonth + rYear) : 0;

  const p1EndAge = Math.max(27, 36 - bhagyank);
  const p2EndAge = p1EndAge + 9;
  const p3EndAge = p2EndAge + 9;

  const pin1Def = NUMBER_DEFINITIONS[pin1Val] || mDef;
  const pin2Def = NUMBER_DEFINITIONS[pin2Val] || bDef;
  const pin3Def = NUMBER_DEFINITIONS[pin3Val] || mDef;
  const pin4Def = NUMBER_DEFINITIONS[pin4Val] || bDef;

  const pinnacles: PinnaclePhase[] = hasValidDob ? [
    {
      phaseNumber: 1,
      name: 'प्रथम शिखर (Foundation Pinnacle)',
      ageSpan: `जन्म से ${p1EndAge} वर्ष की आयु तक`,
      pinnacleNumber: pin1Val,
      planet: PLANET_NAMES[pin1Val] || 'शुभ ग्रह',
      themeHi: `अंक #${pin1Val} (${PLANET_NAMES[pin1Val]}) का प्रभाव: प्रारंभिक शिक्षा, संस्कार, पारिवारिक वातावरण और ${pin1Def.learning}`,
      guidanceHi: `इस चरण में ${pin1Def.personality} विकास पर बल रहा। अनुशंसित अभ्यास: ${pin1Def.traditionalRemedies.behavioural}`
    },
    {
      phaseNumber: 2,
      name: 'द्वितीय शिखर (Expansion Pinnacle)',
      ageSpan: `${p1EndAge + 1} से ${p2EndAge} वर्ष की आयु तक`,
      pinnacleNumber: pin2Val,
      planet: PLANET_NAMES[pin2Val] || 'शुभ ग्रह',
      themeHi: `अंक #${pin2Val} (${PLANET_NAMES[pin2Val]}) का प्रभाव: करियर की स्थापना, व्यावसायिक प्रयास और ${pin2Def.career}`,
      guidanceHi: `अपने पेशेवर कौशल को निखारें: ${pin2Def.business} अनुशंसित अभ्यास: ${pin2Def.traditionalRemedies.lifestyle}`
    },
    {
      phaseNumber: 3,
      name: 'तृतीय शिखर (Maturity Pinnacle)',
      ageSpan: `${p2EndAge + 1} से ${p3EndAge} वर्ष की आयु तक`,
      pinnacleNumber: pin3Val,
      planet: PLANET_NAMES[pin3Val] || 'शुभ ग्रह',
      themeHi: `अंक #${pin3Val} (${PLANET_NAMES[pin3Val]}) का प्रभाव: सामाजिक प्रतिष्ठा, आर्थिक स्थिरता और ${pin3Def.wealth}`,
      guidanceHi: `नेतृत्व और दीर्घकालिक संचय पर ध्यान दें: ${pin3Def.leadership} अनुशंसित अभ्यास: ${pin3Def.traditionalRemedies.charitable}`
    },
    {
      phaseNumber: 4,
      name: 'चतुर्थ शिखर (Wisdom & Legacy Pinnacle)',
      ageSpan: `${p3EndAge + 1} वर्ष की आयु के बाद`,
      pinnacleNumber: pin4Val,
      planet: PLANET_NAMES[pin4Val] || 'शुभ ग्रह',
      themeHi: `अंक #${pin4Val} (${PLANET_NAMES[pin4Val]}) का प्रभाव: आध्यात्मिक शांति, परामर्श और ${pin4Def.spirituality}`,
      guidanceHi: `आंतरिक शांति और समाज में सम्मानित मार्गदर्शक के रूप में सक्रिय रहें: ${pin4Def.family}`
    }
  ] : [];

  // 2. CHALLENGES
  const ch1Val = hasValidDob ? Math.abs(rMonth - rDay) : 0;
  const ch2Val = hasValidDob ? Math.abs(rDay - rYear) : 0;
  const ch3Val = hasValidDob ? Math.abs(ch1Val - ch2Val) : 0;
  const ch4Val = hasValidDob ? Math.abs(rMonth - rYear) : 0;

  const getChallengeDetails = (val: number, phaseTitle: string) => {
    const safeVal = val >= 1 && val <= 9 ? val : mulank;
    const cDef = NUMBER_DEFINITIONS[safeVal] || mDef;
    return {
      planet: val === 0 ? 'पूर्ण संतुलन (Universal Choice 0)' : (PLANET_NAMES[safeVal] || 'संतुलन ऊर्जा'),
      areaHi: val === 0 ? `${phaseTitle}: सभी अंकों के प्रति समान सजगता और आत्म-चयन` : `${phaseTitle}: अंक #${safeVal} (${PLANET_NAMES[safeVal]}) के गुणों का संतुलन`,
      lessonHi: val === 0
        ? 'चुनौती अंक 0 दर्शाता है कि आपको अपने निर्णय स्वयं लेने की पूर्ण स्वतंत्रता और जिम्मेदारी मिली है; अपनी ऊर्जा को बिखरने न दें।'
        : `${cDef.missingMeaning.developmentalTheme} ${cDef.missingMeaning.practicalDevelopment}`,
      remedyHi: cDef.traditionalRemedies.behavioural + ' ' + cDef.traditionalRemedies.charitable
    };
  };

  const c1Info = getChallengeDetails(ch1Val, 'प्रारंभिक आत्मविश्वास एवं संवाद');
  const c2Info = getChallengeDetails(ch2Val, 'मध्य जीवन कार्यक्षेत्र एवं सहयोग');
  const c3Info = getChallengeDetails(ch3Val, 'जीवन का केंद्रीय आत्म-अनुशासन');
  const c4Info = getChallengeDetails(ch4Val, 'परिपक्वता एवं आध्यात्मिक संतुलन');

  const challenges: LifeChallenge[] = hasValidDob ? [
    {
      challengeNumber: 1,
      name: 'प्रारंभिक जीवन चुनौती (Early Life Challenge)',
      value: ch1Val,
      planet: c1Info.planet,
      areaHi: c1Info.areaHi,
      lessonHi: c1Info.lessonHi,
      remedyHi: c1Info.remedyHi
    },
    {
      challengeNumber: 2,
      name: 'मध्य जीवन चुनौती (Productive Years Challenge)',
      value: ch2Val,
      planet: c2Info.planet,
      areaHi: c2Info.areaHi,
      lessonHi: c2Info.lessonHi,
      remedyHi: c2Info.remedyHi
    },
    {
      challengeNumber: 3,
      name: 'प्रमुख मुख्य चुनौती (Core Life Lesson)',
      value: ch3Val,
      planet: c3Info.planet,
      areaHi: c3Info.areaHi,
      lessonHi: c3Info.lessonHi,
      remedyHi: c3Info.remedyHi
    },
    {
      challengeNumber: 4,
      name: 'उत्तर जीवन चुनौती (Maturity Challenge)',
      value: ch4Val,
      planet: c4Info.planet,
      areaHi: c4Info.areaHi,
      lessonHi: c4Info.lessonHi,
      remedyHi: c4Info.remedyHi
    }
  ] : [];

  // 3. EVENT WINDOWS
  const eventWindows: EventWindow[] = hasValidDob ? [
    {
      age: Math.max(23, 23 + (mulank % 4)),
      calendarYear: year + Math.max(23, 23 + (mulank % 4)),
      type: 'CAREER_SURGE',
      titleHi: `मूलांक #${mulank} सक्रियण: करियर की आधारशिला एवं प्रथम प्रगति`,
      descriptionHi: `पेशेवर जीवन में नई पहचान और स्वतंत्र पहल का प्रारंभ। ${mDef.career}`,
      planetarySupportHi: `${PLANET_NAMES[mulank]} का प्रत्यक्ष प्रभाव`
    },
    {
      age: Math.max(32, 32 + (bhagyank % 3)),
      calendarYear: year + Math.max(32, 32 + (bhagyank % 3)),
      type: 'TRANSFORMATION',
      titleHi: `भाग्यांक #${bhagyank} उदय: जीवन का महत्वपूर्ण मोड़ (Destiny Shift Window)`,
      descriptionHi: `भाग्यांक #${bhagyank} की ऊर्जा का पूर्ण सक्रियण। ${bDef.bhagyankMeaning}`,
      planetarySupportHi: `${PLANET_NAMES[bhagyank]} की भाग्यवर्धक रश्मियां`
    },
    {
      age: Math.max(41, 41 + ((mulank + bhagyank) % 5)),
      calendarYear: year + Math.max(41, 41 + ((mulank + bhagyank) % 5)),
      type: 'FINANCIAL_STABILITY',
      titleHi: 'आर्थिक संचय एवं स्थायी परिसंपत्ति निर्माण काल',
      descriptionHi: `${comb81.wealthMeaning} ${bDef.wealth}`,
      planetarySupportHi: `${PLANET_NAMES[mulank]} एवं ${PLANET_NAMES[bhagyank]} का संयुक्त योग`
    },
    {
      age: Math.max(50, 50 + (bhagyank % 4)),
      calendarYear: year + Math.max(50, 50 + (bhagyank % 4)),
      type: 'MATURITY_MILESTONE',
      titleHi: 'सम्मान, सामाजिक प्रतिष्ठा एवं नेतृत्व की पराकाष्ठा',
      descriptionHi: `समाज एवं कार्यक्षेत्र में अनुभवी मार्गदर्शक के रूप में स्थायी पहचान। ${bDef.spirituality}`,
      planetarySupportHi: `${PLANET_NAMES[pin3Val]} एवं ${PLANET_NAMES[pin4Val]} के शिखर का प्रभाव`
    }
  ] : [];

  // 4. TITHI & COMPOUND ANK ANALYSIS
  const comp = hasValidDob ? getCompoundDetails(day) : {
    title: 'वैध जन्मतिथि आवश्यक (Valid DOB Required)',
    meaning: 'जन्मतिथि (DD/MM/YYYY) उपलब्ध या मान्य न होने के कारण तिथि अंक की गणना स्थगित की गई है।'
  };

  // 5. PERSONAL YEAR NARRATIVE (Authoritative Personal Year Calculation)
  const currentCalendarYear = new Date().getFullYear();
  const py = hasValidDob ? calculatePersonalYearNumber(rawDob, currentCalendarYear) : 0;

  const pyNarratives: Record<number, PersonalYearNarrative> = {
    1: {
      year: currentCalendarYear,
      personalYear: 1,
      theme: 'नया शुभारंभ, नई योजनाएं, नेतृत्व एवं स्वतंत्र पहल (Year of New Beginnings)',
      career: 'नई नौकरी, स्वतंत्र प्रोजेक्ट या व्यवसाय शुरू करने के लिए अत्यंत अनुकूल वर्ष। अपने मूलांक और भाग्यांक की प्राथमिक क्षमताओं को आगे लाएं।',
      finance: 'दीर्घकालिक निवेशों की शुरुआत करें। आत्मविश्वास के साथ नए वित्तीय स्रोत बनाएं और अपनी आर्थिक स्वतंत्रता को सुदृढ़ करें।',
      relationships: 'आत्म-पहचान को मजबूत करें, लेकिन रिश्तों में अहंकार और हठधर्मिता से बचें; जीवनसाथी व परिवार के सुझावों का आदर करें।',
      family: 'परिवार में आपके निर्णयों को प्राथमिकता मिलेगी। माता-पिता के स्वास्थ्य और घर के वरिष्ठ सदस्यों के मार्गदर्शन का ध्यान रखें।',
      travel: 'काम और नए अवसरों के सिलसिले में कई छोटी-बड़ी व्यावसायिक यात्राओं के योग बनेंगे।',
      opportunities: 'नेतृत्व के पद, नए अनुबंध, स्वतंत्र ब्रांड पहचान और समाज में नई प्रतिष्ठा।',
      caution: 'अति-उत्साह में बिना जांचे-परखे बड़े जोखिम न लें और अधैर्य से बचें।',
      recommendedFocus: 'नवाचार, आत्म-अनुशासन और स्पष्ट 9-वर्षीय कार्ययोजना पर ध्यान केंद्रित करें।'
    },
    2: {
      year: currentCalendarYear,
      personalYear: 2,
      theme: 'साझेदारी, धैर्य, शांति एवं कूटनीतिक सहयोग (Year of Patience & Harmony)',
      career: 'टीम वर्क और सहयोगियों के साथ सामंजस्य से कार्य आगे बढ़ेंगे। अकेले संघर्ष करने के बजाय भरोसेमंद नेटवर्क का सहारा लें।',
      finance: 'स्थिरता बनाए रखें। जल्दबाजी में भारी पूंजी न फंसाएं; नियमित बचत और तरल संपत्ति (liquid assets) पर ध्यान दें।',
      relationships: 'प्रेम और दांपत्य जीवन में मधुरता बढ़ेगी। भावनात्मक संवाद और पारस्परिक सहानुभूति को प्राथमिकता दें।',
      family: 'पारिवारिक सौहार्द, माता का आशीर्वाद और घरेलू सुख-सुविधाओं में वृद्धि का समय।',
      travel: 'जल स्थलों या शांत प्राकृतिक स्थानों की विश्रामदायक और मानसिक ऊर्जा बढ़ाने वाली यात्राएं।',
      opportunities: 'मजबूत साझेदारियां, मध्यस्थता, कूटनीतिक समझौते और रचनात्मक अनुबंध।',
      caution: 'अत्यधिक भावुकता या संदेह में आकर कोई बड़ा व्यावसायिक निर्णय न लें।',
      recommendedFocus: 'धैर्य, कूटनीति, भावनात्मक संतुलन और आपसी विश्वास को मजबूत करना।'
    },
    3: {
      year: currentCalendarYear,
      personalYear: 3,
      theme: 'ज्ञान विस्तार, रचनात्मकता, सामाजिक दायरा एवं अभिव्यक्ति (Year of Self-Expression)',
      career: 'सलाहकार, शिक्षण, मीडिया, लेखन, प्रबंधन और जनसंपर्क में शानदार उपलब्धियां और पदोन्नति के अवसर।',
      finance: 'आर्थिक स्थिति में सुधार होगा। बौद्धिक और रचनात्मक कार्यों से अतिरिक्त आय के स्रोत बनेंगे।',
      relationships: 'सामाजिक दायरा बढ़ेगा। मित्रों, विद्वानों और सहकर्मियों के साथ उत्सव और सार्थक मेलजोल रहेगा।',
      family: 'परिवार में मांगलिक कार्य, संतान संबंधी शुभ समाचार या शैक्षिक उन्नति के योग।',
      travel: 'अध्ययन, सेमिनार, तीर्थाटन और सांस्कृतिक यात्राएं लाभकारी रहेंगी।',
      opportunities: 'सार्वजनिक मंचों पर सम्मान, नई बौद्धिक योजनाएं, कौशल विकास और नेटवर्किंग।',
      caution: 'कई कामों को एक साथ शुरू करके अपनी ऊर्जा और धन को बिखरने न दें।',
      recommendedFocus: 'अपनी रचनात्मक प्रतिभा, संवाद कौशल और ज्ञान संवर्धन को निखारें।'
    },
    4: {
      year: currentCalendarYear,
      personalYear: 4,
      theme: 'कठिन परिश्रम, संरचना, अनुशासन एवं व्यवस्था निर्माण (Year of Hard Work & Foundation)',
      career: 'व्यवस्थित और तकनीकी रूप से सटीक काम करने से भविष्य के लिए मजबूत आधार बनेगा। नियमों और प्रक्रियाओं का पालन करें।',
      finance: 'बजट पर कड़ा नियंत्रण रखें। अचल संपत्ति, भूमि या सुरक्षित फंड्स में सोच-समझकर पूंजी लगाएं।',
      relationships: 'व्यावहारिकता जरूरी है। काम के दबाव का असर निजी रिश्तों पर न पड़ने दें और परिवार से संवाद बनाए रखें।',
      family: 'घर की मरम्मत, निर्माण, सुरक्षा या पारिवारिक जिम्मेदारियों को व्यवस्थित रूप से पूरा करने का समय।',
      travel: 'काम और परियोजनाओं के निरीक्षण से संबंधित व्यावहारिक यात्राएं।',
      opportunities: 'दीर्घकालिक परियोजनाओं की मजबूत नींव, सिस्टम निर्माण और प्रशासनिक कौशल की सराहना।',
      caution: 'आलस्य, टालमटोल और शॉर्टकट से बचें; कानूनी व दस्तावेजी मामलों में पूर्ण सावधानी बरतें।',
      recommendedFocus: 'समय प्रबंधन, कार्य कुशलता, दस्तावेजी अनुशासन और स्वास्थ्य की नियमित देखभाल।'
    },
    5: {
      year: currentCalendarYear,
      personalYear: 5,
      theme: 'परिवर्तन, गतिशीलता, व्यापारिक लाभ एवं बहुआयामी विस्तार (Year of Freedom & Dynamic Change)',
      career: 'व्यापार, मार्केटिंग, संचार, आईटी और नौकरी में सकारात्मक बदलाव तथा विस्तार के प्रबल योग।',
      finance: 'नकदी प्रवाह (Cash Flow) में तेजी आएगी। व्यापारिक सौदे और त्वरित निर्णय लाभकारी रहेंगे।',
      relationships: 'नए और प्रभावशाली लोगों से परिचय होगा। रिश्तों में खुलापन और संवाद ताजगी लाएगा।',
      family: 'पारिवारिक जीवन में चहल-पहल, आधुनिक सुख-सुविधाओं और नए बदलावों का स्वागत होगा।',
      travel: 'व्यावसायिक, व्यापारिक एवं दर्शनीय यात्राओं के अनेक शुभ अवसर प्राप्त होंगे।',
      opportunities: 'नए बाजारों तक पहुंच, डिजिटल विस्तार, नेटवर्किंग और बहुआयामी आय के अवसर।',
      caution: 'मानसिक अस्थिरता, जल्दबाजी और बिना योजना के अनावश्यक बदलावों से बचें।',
      recommendedFocus: 'लचीलापन, स्मार्ट मार्केटिंग, संचार कौशल और अपने संपर्कों को सक्रिय रखना।'
    },
    6: {
      year: currentCalendarYear,
      personalYear: 6,
      theme: 'घरेलू सुख, प्रेम, दांपत्य, जिम्मेदारी एवं सौंदर्य (Year of Love, Family & Responsibility)',
      career: 'ब्रांडिंग, डिजाइन, हॉस्पिटैलिटी, कला, परामर्श और जनसेवा से जुड़े क्षेत्रों में विशेष सफलता और सम्मान।',
      finance: 'घर की सुख-सुविधाओं, वाहन, आभूषण या साज-सज्जा पर शुभ व्यय, साथ ही स्थिर आर्थिक लाभ।',
      relationships: 'विवाह, प्रेम संबंधों में प्रगाढ़ता और पारिवारिक सामंजस्य का स्वर्णिम समय।',
      family: 'परिवार की सेवा, मांगलिक उत्सव और बच्चों व जीवनसाथी की उन्नति में आनंद की प्राप्ति।',
      travel: 'पारिवारिक छुट्टियां, सुखद और आरामदायक पर्यटन।',
      opportunities: 'घरेलू सुख, रिश्तों का पुनर्निर्माण, सामाजिक प्रतिष्ठा और भरोसेमंद साझेदारी।',
      caution: 'अति-आदर्शवादी बनने या दूसरों के मामलों में बिना मांगे अधिक हस्तक्षेप से बचें।',
      recommendedFocus: 'घर और कार्यस्थल में प्रेम, सौहार्द, संतुलन और सौंदर्य का वातावरण बनाए रखना।'
    },
    7: {
      year: currentCalendarYear,
      personalYear: 7,
      theme: 'आत्म-चिंतन, शोध, आंतरिक शांति एवं आध्यात्मिक उन्नति (Year of Introspection & Spiritual Growth)',
      career: 'रिसर्च, डेटा विश्लेषण, ऑडिट, लेखन, योजना निर्माण और गहन विशेषज्ञता के लिए सर्वोत्तम समय।',
      finance: 'सावधानीपूर्वक और शोध के बाद ही निवेश करें। सट्टेबाजी या त्वरित लाभ के प्रलोभनों से बिल्कुल दूर रहें।',
      relationships: 'गहन भावनात्मक समझ की आवश्यकता। अपने मन की बात जीवनसाथी से साझा करें ताकि दूरी का भ्रम न हो।',
      family: 'शांतिपूर्ण वातावरण रखें और परिवार के साथ आध्यात्मिक व बौद्धिक समझ विकसित करें।',
      travel: 'प्राकृतिक, शांत और आध्यात्मिक/तीर्थ स्थलों की यात्राएं आपकी ऊर्जा को पुनर्जीवित करेंगी।',
      opportunities: 'गहन ज्ञान, शोध, तकनीकी विशेषज्ञता, गूढ़ विद्या और अंतर्दृष्टि की जागृति।',
      caution: 'अकेलेपन, अति-संदेह या अवसाद से बचें; नकारात्मक विचारों को मन में न पनपने दें।',
      recommendedFocus: 'ध्यान, स्वाध्याय, स्वास्थ्य संवर्धन और जीवन के दीर्घकालिक लक्ष्यों का पुनर्मूल्यांकन।'
    },
    8: {
      year: currentCalendarYear,
      personalYear: 8,
      theme: 'कर्म फल, अधिकार, धन संचय, न्याय एवं उच्च उपलब्धि (Year of Power & Manifestation)',
      career: 'उच्च पद, कार्यक्षेत्र में प्रशासनिक दबदबा, बड़ा व्यापारिक विस्तार और अधिकार प्राप्ति का समय।',
      finance: 'महत्वपूर्ण वित्तीय लाभ, बड़े व्यापारिक लेन-देन और अचल संपत्ति या उद्योग में निवेश का शुभ समय।',
      relationships: 'व्यावहारिकता और मान-सम्मान का ध्यान रखें। कार्य की व्यस्तता के बीच साथी के योगदान की कद्र करें।',
      family: 'परिवार की वित्तीय स्थिति सुदृढ़ होगी, बड़े निर्णय सफल होंगे और समाज में प्रतिष्ठा बढ़ेगी।',
      travel: 'अधिकार, प्रशासन और बड़े व्यापारिक सौदों से संबंधित उच्चस्तरीय यात्राएं।',
      opportunities: 'बड़े अनुबंध, संस्थागत नेतृत्व और पिछले कई वर्षों की ईमानदार मेहनत का प्रत्यक्ष फल।',
      caution: 'अहंकार, अत्यधिक कार्यभार और अधीनस्थ सहयोगियों के प्रति कठोरता से बचें।',
      recommendedFocus: 'न्यायपूर्ण व्यवहार, दूरदर्शी प्रबंधन, कानूनी पारदर्शिता और वित्तीय अनुशासन।'
    },
    9: {
      year: currentCalendarYear,
      personalYear: 9,
      theme: 'पूर्णता, विसर्जन, परोपकार एवं आगामी चक्र की तैयारी (Year of Completion & Humanitarian Spirit)',
      career: 'पुरानी अधूरी योजनाओं को सफलतापूर्वक समाप्त करें और आगामी वर्ष के नए 9-वर्षीय चक्र की रूपरेखा तैयार करें।',
      finance: 'पुराने ऋण या उधार चुकाएं, अनावश्यक खर्च रोकें और भविष्य के लिए बचत को सुरक्षित करें।',
      relationships: 'पुरानी गलतफहमियों को क्षमा करें और सामंजस्यपूर्ण व परोपकारी दृष्टिकोण अपनाएं।',
      family: 'पारिवारिक सहयोग, बड़ों का आशीर्वाद और समाज सेवा में सार्थक भागीदारी।',
      travel: 'दूरस्थ स्थानों, विदेश या तीर्थ स्थलों की प्रेरणादायक यात्राएं।',
      opportunities: 'मानवीय सहयोग, व्यापक सामाजिक सम्मान और पुराने मानसिक बोझों से मुक्ति।',
      caution: 'क्रोध, आवेग या अतीत की कड़वाहट को पकड़कर न रखें; विवादों से दूर रहें।',
      recommendedFocus: 'क्षमा, दान, आत्म-शुद्धि और नई शुरुआत के लिए मानसिक व भौतिक स्थान बनाना।'
    }
  };

  const selectedPYNarrative: PersonalYearNarrative = hasValidDob
    ? (pyNarratives[py] || pyNarratives[1])
    : {
        year: currentCalendarYear,
        personalYear: 0,
        theme: 'मान्य जन्मतिथि आवश्यक (Valid DOB Required for Personal Year Calculation)',
        career: 'जन्मतिथि (DD/MM/YYYY) उपलब्ध या मान्य न होने के कारण व्यक्तिगत वर्ष की गणना नहीं की गई है।',
        finance: 'सटीक वार्षिक आर्थिक चक्र जानने हेतु कृपया वैध जन्मतिथि प्रविष्ट करें।',
        relationships: 'जन्मतिथि उपलब्ध न होने के कारण वार्षिक संबंध चक्र स्थगित है।',
        family: 'पारिवारिक वार्षिक गोचर की गणना हेतु जन्मतिथि आवश्यक है।',
        travel: 'यात्रा एवं स्थान परिवर्तन चक्र हेतु वैध जन्मतिथि आवश्यक है।',
        opportunities: 'वैध जन्मतिथि दर्ज करने पर वार्षिक अवसरों की गणना सक्रिय होगी।',
        caution: 'किसी भी काल्पनिक तारीख के आधार पर भविष्यफल नहीं दिखाया गया है।',
        recommendedFocus: 'कृपया पूर्ण जन्मतिथि (DD/MM/YYYY) दर्ज करें।'
      };

  // 6. MONTHLY DASHA YOG FORECAST (12 MONTHS OF CURRENT CALENDAR YEAR)
  const monthNames = [
    { en: 'January', hi: 'जनवरी' },
    { en: 'February', hi: 'फरवरी' },
    { en: 'March', hi: 'मार्च' },
    { en: 'April', hi: 'अप्रैल' },
    { en: 'May', hi: 'मई' },
    { en: 'June', hi: 'जून' },
    { en: 'July', hi: 'जुलाई' },
    { en: 'August', hi: 'अगस्त' },
    { en: 'September', hi: 'सितंबर' },
    { en: 'October', hi: 'अक्टूबर' },
    { en: 'November', hi: 'नवंबर' },
    { en: 'December', hi: 'दिसंबर' }
  ];

  const currentMahadashaPlanet = vedicDasha?.currentMahadasha?.planetHi || PLANET_NAMES[bhagyank] || 'गुरु (Jupiter)';
  const currentAntardashaPlanet = vedicDasha?.currentAntardasha?.planetHi || PLANET_NAMES[mulank] || 'बुध (Mercury)';

  const monthlyForecasts: MonthlyDashaYog[] = hasValidDob ? monthNames.map((m, idx) => {
    const mNum = idx + 1;
    const pm = reduceDigit(py + mNum);
    const pmPlanet = PLANET_NAMES[pm] || 'शुभ ग्रह';

    let primaryTheme = `माह का प्रभाव अंक #${pm} (${pmPlanet}) द्वारा संचालित है।`;
    let career = 'योजनाबद्ध ढंग से कार्य करें और प्राथमिकताओं को स्पष्ट रखें।';
    let finance = 'वित्तीय संतुलन बनाए रखें और अनावश्यक व्यय से बचें।';
    let relationship = 'पारस्परिक समझ और सकारात्मक संवाद का अभ्यास करें।';
    let caution = 'जल्दबाजी या भावुकता में निर्णय न लें।';
    let action = 'दैनिक अनुशासन और कार्यों की पूर्व-तैयारी रखें।';

    if (pm === 1) {
      primaryTheme = 'नई शुरुआत, सक्रियता एवं प्रशासनिक निर्णय लेने का शुभ समय।';
      career = 'नए प्रोजेक्ट्स की रूपरेखा बनाएं, वरिष्ठ अधिकारियों का सहयोग मिलेगा।';
      finance = 'नए वित्तीय स्रोतों की दिशा में सकारात्मक प्रयास करें।';
      relationship = 'अहंकार को दूर रखकर प्रेमपूर्वक संवाद करें।';
      caution = 'अति-उत्साह में हठधर्मिता से बचें।';
      action = 'प्रातः सूर्य को जल दें और कार्यों की लिखित सूची बनाएं।';
    } else if (pm === 2) {
      primaryTheme = 'धैर्य, सहयोग, साझेदारी एवं मानसिक शांति का माह।';
      career = 'सहकर्मियों के साथ मिलकर काम करें; अकेले दबाव न लें।';
      finance = 'नियमित बचत पर ध्यान दें; जोखिम भरे निवेश टालें।';
      relationship = 'जीवनसाथी के विचारों का सम्मान करें, मधुरता बढ़ेगी।';
      caution = 'छोटी बातों पर भावुक या व्यथित न हों।';
      action = 'चांदी के पात्र से जल पिएं और ध्यान करें।';
    } else if (pm === 3) {
      primaryTheme = 'ज्ञान, बौद्धिक विकास, सलाहकारी कार्य एवं शुभ समाचार।';
      career = 'परामर्श, मार्केटिंग, शिक्षा और जनसंपर्क में उत्कृष्ट प्रगति।';
      finance = 'आय के नए रास्ते खुलेंगे; ज्ञान पर किया गया व्यय लाभकारी रहेगा।';
      relationship = 'पारिवारिक आयोजनों और मित्रों के साथ सौहार्दपूर्ण समय।';
      caution = 'अनावश्यक वादे करने से बचें।';
      action = 'गुरुजनों का सम्मान करें और गुरुवार को पीला तिलक लगाएं।';
    } else if (pm === 4) {
      primaryTheme = 'कठिन परिश्रम, संरचना, स्थिरता एवं कार्य योजना का माह।';
      career = 'लंबित कार्यों को पूरा करें; तकनीकी व व्यवस्थित काम को गति दें।';
      finance = 'बजट पर कड़ी निगरानी रखें; अप्रत्याशित खर्च संभव।';
      relationship = 'पारिवारिक उत्तरदायित्वों को धैर्यपूर्वक निभाएं।';
      caution = 'जल्दबाजी या शॉर्टकट के प्रलोभन से बचें।';
      action = 'कार्यस्थल को साफ रखें और बुधवार को पक्षियों को दाना दें।';
    } else if (pm === 5) {
      primaryTheme = 'गति, व्यापारिक लाभ, यात्राएं एवं बहुआयामी संचार।';
      career = 'व्यापारिक सौदे, मीटिंग्स और नए ग्राहकों से जुड़ने का सर्वश्रेष्ठ माह।';
      finance = 'नकदी प्रवाह में तेजी; व्यापारिक निवेश शुभ फलदायी।';
      relationship = 'रोमांच और ताजगी भरे संवाद; पुराने मित्रों से भेंट।';
      caution = 'चंचलता और ध्यान भटकने से बचें।';
      action = 'हरे वस्त्रों या रुमाल का प्रयोग करें और 15° ऊपर हस्ताक्षर करें।';
    } else if (pm === 6) {
      primaryTheme = 'प्रेम, पारिवारिक सुख, लग्जरी, दांपत्य एवं सद्भाव।';
      career = 'रचनात्मकता, ब्रांडिंग और टीम प्रबंधन में विशेष सम्मान।';
      finance = 'घरेलू साज-सज्जा और वस्त्रों पर सुखद व्यय।';
      relationship = 'दांपत्य जीवन में गहरा सामंजस्य और प्रेम की वृद्धि।';
      caution = 'अति-विलासिता या अनावश्यक दिखावे से बचें।';
      action = 'शुक्रवार को मीठी वस्तु का दान करें अथवा सुगंधी का प्रयोग करें।';
    } else if (pm === 7) {
      primaryTheme = 'आत्म-विश्लेषण, शोध, आंतरिक शांति एवं आध्यात्मिक सजगता।';
      career = 'योजना निर्माण और आंतरिक सुधारों के लिए उत्तम समय।';
      finance = 'पूंजी सुरक्षित रखें; वित्तीय कागजातों की बारीकी से जांच करें।';
      relationship = 'शांत और अर्थपूर्ण संवाद रखें; साथी को स्पेस दें।';
      caution = 'एकांत में नकारात्मक विचार न आने दें।';
      action = 'प्रतिदिन 10 मिनट ध्यान लगाएं और प्राणायाम करें।';
    } else if (pm === 8) {
      primaryTheme = 'अधिकार, कर्म फल, आर्थिक प्रगति एवं बड़ा प्रशासनिक विस्तार।';
      career = 'उच्च पद, महत्वपूर्ण सौदे और व्यावसायिक प्रतिष्ठा में वृद्धि।';
      finance = 'महत्वपूर्ण धन लाभ एवं संपत्ति संबंधी कार्यों में प्रगति।';
      relationship = 'व्यावहारिक समझ बनाए रखें; अहंकार से दूर रहें।';
      caution = 'कार्य के दबाव में स्वास्थ्य की अनदेखी न करें।';
      action = 'शनिवार को जरूरतमंदों को भोजन या काले तिल दान करें।';
    } else if (pm === 9) {
      primaryTheme = 'ऊर्जा, उत्साह, पुराने कार्यों की समाप्ति एवं परोपकार।';
      career = 'अधूरे कार्यों को समाप्त करें; नई ऊर्जा के साथ नेतृत्व करें।';
      finance = 'पुराने बकाए की वसूली करें; व्यर्थ के विवादों से बचें।';
      relationship = 'क्रोध और तीखी वाणी पर नियंत्रण रखना आवश्यक है।';
      caution = 'जल्दबाजी में वाहन न चलाएं और वाद-विवाद टालें।';
      action = 'मंगलवार को हनुमान चालीसा का पाठ करें अथवा लाल फल का सेवन करें।';
    }

    return {
      monthIndex: idx,
      monthNameHi: m.hi,
      monthNameEn: m.en,
      py,
      pm,
      mahadashaPlanet: currentMahadashaPlanet,
      antardashaPlanet: currentAntardashaPlanet,
      primaryTheme,
      career,
      finance,
      relationship,
      caution,
      action
    };
  }) : [];

  // 7. GRAH DRISHTI & PLANETARY SYNERGY (Dynamic based on actual Mulank, Bhagyank & Chart Digits)
  const isFriendly = mPlanet.friendlyNumbers.includes(bhagyank) || bPlanet.friendlyNumbers.includes(mulank);
  const isEnemy = mPlanet.enemyNumbers.includes(bhagyank) || bPlanet.enemyNumbers.includes(mulank);
  const relationshipType: GrahDrishtiAnalysis['relationshipType'] =
    mulank === bhagyank ? 'HARMONIOUS' : isFriendly ? 'FRIENDLY' : isEnemy ? 'CHALLENGING' : 'NEUTRAL';

  const relationshipLabelMap: Record<GrahDrishtiAnalysis['relationshipType'], string> = {
    HARMONIOUS: `मूलांक स्वामी ${PLANET_NAMES[mulank]} एवं भाग्यांक स्वामी ${PLANET_NAMES[bhagyank]} का पूर्ण समरस योग`,
    FRIENDLY: `मूलांक स्वामी ${PLANET_NAMES[mulank]} एवं भाग्यांक स्वामी ${PLANET_NAMES[bhagyank]} का मित्रवत एवं सहयोगी योग`,
    NEUTRAL: `मूलांक स्वामी ${PLANET_NAMES[mulank]} एवं भाग्यांक स्वामी ${PLANET_NAMES[bhagyank]} का संतुलित पूरक योग`,
    CHALLENGING: `मूलांक स्वामी ${PLANET_NAMES[mulank]} एवं भाग्यांक स्वामी ${PLANET_NAMES[bhagyank]} का परिवर्तनकारी संतुलन योग`
  };

  const presentDigits = loshu.repetition && loshu.repetition.length > 0
    ? loshu.repetition.map(r => r.digit)
    : [mulank, bhagyank];
  const secondaryDigit = presentDigits.find(d => d !== mulank && d !== bhagyank) || (rMonth || mulank);
  const tertiaryDigit = presentDigits.find(d => d !== mulank && d !== bhagyank && d !== secondaryDigit) || (rYear || bhagyank);
  const secDef = NUMBER_DEFINITIONS[secondaryDigit] || mDef;
  const terDef = NUMBER_DEFINITIONS[tertiaryDigit] || bDef;

  const grahDrishti: GrahDrishtiAnalysis = {
    driverPlanet: PLANET_NAMES[mulank] || 'सूर्य (Sun)',
    conductorPlanet: PLANET_NAMES[bhagyank] || 'गुरु (Jupiter)',
    relationshipType,
    relationshipLabelHi: relationshipLabelMap[relationshipType],
    synergyNarrativeHi: `${comb81.positiveMeaning} आपके जन्मांक में मूलांक #${mulank} (${PLANET_NAMES[mulank]}) के स्वभाव (${mDef.personality}) और भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) की जीवन दिशा (${bDef.bhagyankMeaning}) का विशिष्ट संयोग है। ${comb81.spiritualMeaning}`,
    dominantAspects: [
      {
        planetPair: `${PLANET_NAMES[mulank]} ↔ ${PLANET_NAMES[bhagyank]}`,
        vibeHi: `${comb81.title} (${comb81.planetaryPair})`,
        lifeImpactHi: `${comb81.careerMeaning} ${comb81.wealthMeaning}`
      },
      {
        planetPair: `${PLANET_NAMES[mulank]} ↔ ${PLANET_NAMES[secondaryDigit]}`,
        vibeHi: 'व्यक्तित्व एवं व्यावहारिक कौशल समन्वय (Personality & Skill Synergy)',
        lifeImpactHi: `मूलांक #${mulank} और चार्ट में उपस्थित अंक #${secondaryDigit} के मेल से: ${secDef.career}`
      },
      {
        planetPair: `${PLANET_NAMES[bhagyank]} ↔ ${PLANET_NAMES[tertiaryDigit]}`,
        vibeHi: 'भाग्य एवं दीर्घकालिक स्थिरता (Destiny & Stability Aspect)',
        lifeImpactHi: `भाग्यांक #${bhagyank} और अंक #${tertiaryDigit} के सहयोग से: ${terDef.wealth}`
      }
    ]
  };

  // Match professions for Mulank and Bhagyank from registered PROFESSION_RULES
  const matchedProfessions = Object.values(PROFESSION_RULES).filter(
    rule => rule.requiredNumbers.includes(mulank) || rule.requiredNumbers.includes(bhagyank)
  );
  const dynamicCareerAvenues = Array.from(new Set([
    ...mPlanet.careerResonances,
    ...bPlanet.careerResonances,
    ...matchedProfessions.map(r => `${r.hindiTitle} (${r.profession})`)
  ])).slice(0, 6);

  const favDir1 = kuaProfile?.favorableDirections?.[0]?.direction || mDef.traditionalRemedies.directional;
  const favDir2 = kuaProfile?.favorableDirections?.[1]?.direction || bDef.traditionalRemedies.directional;

  const luckyColorsList = Array.from(new Set([
    mDef.traditionalRemedies.color,
    bDef.traditionalRemedies.color
  ]));

  return {
    consultantSnapshot: {
      title: 'LeoFamily Expert Dossier Snapshot',
      coreVerdictHi: hasValidDob
        ? `जातक ${identity.fullName || 'विशेष व्यक्ति'} का चार्ट मूलांक #${mulank} (${PLANET_NAMES[mulank]}) और भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) के '${comb81.title}' से युक्त है। ${comb81.positiveMeaning}`
        : 'जन्मतिथि (DD/MM/YYYY) उपलब्ध या मान्य न होने के कारण जन्मतिथि-आधारित गणनाएं स्थगित की गई हैं। किसी भी कृत्रिम या डिफ़ॉल्ट तिथि का प्रयोग नहीं किया गया है।',
      dominantEnergyHi: hasValidDob ? `${mDef.personality} इसके साथ ही ${bDef.personality}` : 'वैध जन्मतिथि प्रविष्ट करने पर मूलांक एवं भाग्यांक ऊर्जा का विश्लेषण उपलब्ध होगा।',
      bestAvenueHi: hasValidDob ? `${comb81.careerMeaning} प्रमुख क्षेत्र: ${mDef.career}` : 'वैध जन्मतिथि आवश्यक (Valid DOB Required)',
      strategicCautionHi: hasValidDob ? `${comb81.negativeMeaning} उपाय: ${comb81.remedy}` : 'कृपया पूर्ण जन्मतिथि (DD/MM/YYYY) दर्ज करें।'
    },
    tithiAnkAnalysis: {
      birthDate: day,
      compoundTitle: comp.title,
      compoundMeaning: comp.meaning,
      tithiNatureHi: !hasValidDob
        ? 'जन्मतिथि अनुपलब्ध या अमान्य होने के कारण किसी कृत्रिम तारीख का प्रयोग नहीं किया गया है। कृपया पूर्ण जन्मतिथि (DD/MM/YYYY) दर्ज करें।'
        : day > 9 
          ? `चूँकि आपकी जन्म तारीख ${day} एक संयुक्त (Compound) अंक है, आपके व्यक्तित्व पर अंक ${Math.floor(day/10)} (${PLANET_NAMES[Math.floor(day/10)] || 'ग्रह'}) और अंक ${day%10} (${day%10 === 0 ? 'पूर्णता शून्य' : PLANET_NAMES[day%10]}) के संयोग से मूलांक #${mulank} (${PLANET_NAMES[mulank]}) की विशिष्ट ऊर्जा निर्मित होती है। ${mDef.mulankMeaning}`
          : `चूँकि आपका जन्म एकल अंक ${day} के दिन हुआ है, आप पर ${PLANET_NAMES[mulank]} का प्रभाव अत्यंत प्रत्यक्ष, शुद्ध, केंद्रित और मौलिक है। ${mDef.mulankMeaning}`,
      numericalFrequencyHi: hasValidDob
        ? `जन्म तिथि अंक #${day} (${comp.title}) आपको ${mDef.leadership} तथा ${mDef.communication} प्रदान करता है।`
        : 'वैध जन्मतिथि प्रविष्ट करने पर तिथि एवं संयुक्त अंक का विश्लेषण उपलब्ध होगा।'
    },
    characteristicsProfile: {
      thinkingStyle: `${mDef.learning} ${bDef.creativity}`,
      emotionalResponse: `${mDef.relationships} ${bDef.relationships}`,
      workHabit: `${mDef.business} ${bDef.career}`,
      socialConduct: `${mDef.communication} ${bDef.communication}`,
      leadershipTrait: `${mDef.leadership} साथ ही ${bDef.leadership}`
    },
    lifePinnacles: pinnacles,
    lifeChallenges: challenges,
    eventWindows,
    educationAnalysis: {
      learningStyle: `${mDef.learning} एवं ${bDef.learning}`,
      academicStrengths: [
        ...mDef.positiveTraits.slice(0, 2).map(t => `${t} (मूलांक #${mulank} गुण)`),
        ...bDef.positiveTraits.slice(0, 2).map(t => `${t} (भाग्यांक #${bhagyank} गुण)`)
      ],
      suitableDisciplines: dynamicCareerAvenues.slice(0, 4),
      studyDirection: `अध्ययन एवं कौशल विकास के लिए आपकी शुभ दिशाएं (${favDir1} तथा ${favDir2}) तथा ईशान कोण (North-East) की ओर मुख करना एकाग्रता और स्मरण शक्ति को बढ़ाता है।`
    },
    careerDeepDive: {
      primaryAvenues: [
        `मूलांक #${mulank} प्रधान क्षेत्र: ${mDef.career}`,
        `भाग्यांक #${bhagyank} प्रधान क्षेत्र: ${bDef.career}`,
        `संयुक्त योग (${mulank}-${bhagyank}): ${comb81.careerMeaning}`,
        `व्यापारिक अनुप्रयोग: ${mDef.business}`
      ],
      entrepreneurialFit: `${mDef.business} साथ ही भाग्यांक #${bhagyank} के अनुसार: ${bDef.business}`,
      workplaceRole: `${mDef.leadership}`,
      successStrategy: `${comb81.remedy} ${mDef.traditionalRemedies.behavioural}`
    },
    financeBehaviour: {
      moneyMindset: `${mDef.wealth}`,
      wealthAccumulationPattern: `${comb81.wealthMeaning} ${bDef.wealth}`,
      investmentSuitability: `भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) के अनुसार दीर्घकालिक योजनाबद्ध संचय, सुरक्षित परिसंपत्ति और अपने अनुभव वाले क्षेत्रों में निवेश अनुकूल रहता है।`,
      financialCaution: `${comb81.negativeMeaning} वित्तीय लेन-देन में हमेशा पारदर्शिता और लिखित अनुबंध रखें।`
    },
    relationshipFamilyDynamics: {
      relationshipPattern: `${comb81.relationshipMeaning} ${mDef.relationships}`,
      familyRole: `${mDef.family} ${bDef.family}`,
      communicationAdvice: `${mDef.communication} घरेलु संवाद में ${mDef.traditionalRemedies.behavioural}`,
      harmonyKey: `${bDef.relationships} जीवनसाथी और परिवार के साथ धैर्य व आत्मीय संवाद बनाए रखें।`
    },
    uniqueAboutYou: {
      cosmicSignature: `मूलांक #${mulank} (${PLANET_NAMES[mulank]}) + भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) — ${comb81.title}`,
      hiddenGift: `${mDef.creativity} ${bDef.spirituality}`,
      distinctiveAura: `${mPlanet.cosmicNature} तथा ${bPlanet.cosmicNature}`
    },
    numeroVastuInterpretation: {
      loShuZoneHarmonyHi: `आपके मूलांक #${mulank} की दिशा (${mDef.traditionalRemedies.directional}) और भाग्यांक #${bhagyank} की दिशा (${bDef.traditionalRemedies.directional}) का वास्तु संतुलन आपके स्वास्थ्य, करियर और मानसिक शांति के लिए सर्वोपरि है।`,
      residenceEntranceDynamicsHi: `कुआ (Kua) संख्या #${kuaProfile?.kuaNumber || mulank} के अनुसार आपकी प्रमुख शुभ दिशाएं ${favDir1} और ${favDir2} हैं। कार्यस्थल व शयन में इन दिशाओं का उपयोग सकारात्मक ऊर्जा का संचार करता है।`,
      suggestedVastuRemedies: [
        `मूलांक दिशा मार्गदर्शन: ${mDef.traditionalRemedies.directional}`,
        `भाग्यांक दिशा मार्गदर्शन: ${bDef.traditionalRemedies.directional}`,
        `ईशान कोण (North-East) और ब्रह्मस्थान को सदैव स्वच्छ, हवादार और भारमुक्त रखें।`
      ]
    },
    lifeChangingWindows: eventWindows.map(w => ({
      window: `Age ${w.age} (${w.calendarYear})`,
      catalyst: w.type.replace('_', ' '),
      themeHi: w.titleHi,
      adviceHi: `${w.descriptionHi} (सहायक ग्रह प्रभाव: ${w.planetarySupportHi})`
    })),
    pinnacles: pinnacles.map(p => ({
      phaseName: p.name,
      number: p.pinnacleNumber,
      ageSpan: p.ageSpan,
      guidanceHi: `${p.themeHi} — ${p.guidanceHi}`
    })),
    grahDrishti,
    lifestyleSuggestions: {
      dailyRoutineHi: `${mDef.traditionalRemedies.lifestyle} साथ ही ${bDef.traditionalRemedies.lifestyle}`,
      dietaryGuidelineHi: `मूलांक #${mulank} (${mDef.element} तत्व) और भाग्यांक #${bhagyank} (${bDef.element} तत्व) के संतुलन हेतु ताजा, सात्विक व ऋतु अनुकूल आहार लें तथा पर्याप्त जल ग्रहण करें।`,
      mindfulnessPracticeHi: `${mDef.spirituality} प्रतिदिन 10-15 मिनट प्राणायाम व ध्यान (${mDef.traditionalRemedies.mantra}) मानसिक स्पष्टता प्रदान करता है।`,
      favorableTimingHi: `आपके लिए ${mPlanet.day} एवं ${bPlanet.day} के दिन तथा प्रातःकाल का समय महत्वपूर्ण निर्णयों के लिए विशेष अनुकूल है।`
    },
    personalYearNarrative: selectedPYNarrative,
    monthlyDashaForecast: monthlyForecasts,
    balancingRemedies: {
      primaryYantraHi: YANTRA_BY_NUMBER[mulank] || YANTRA_BY_NUMBER[5],
      sacredMantraHi: `${mDef.traditionalRemedies.mantra} तथा भाग्यांक मंत्र: ${bDef.traditionalRemedies.mantra}`,
      luckyColorsHi: luckyColorsList,
      avoidColorsHi: AVOID_COLORS_BY_NUMBER[mulank] || ['गहरा काला (Deep Black)'],
      crystalRecommendationHi: `${mPlanet.gemstone} (मूलांक #${mulank} अनुसार) अथवा ${bPlanet.gemstone} (भाग्यांक #${bhagyank} अनुसार — विशेषज्ञ परामर्श से)।`,
      planetaryCharityHi: `${mDef.traditionalRemedies.charitable} इसके अतिरिक्त: ${bDef.traditionalRemedies.charitable}`,
      signatureRecommendationHi: 'हस्ताक्षर को हमेशा नीचे से ऊपर की ओर 15 डिग्री के कोण पर स्पष्ट, पठनीय और बिना काटे करें; अंत में आधार रेखा (underline) के नीचे दो बिंदु या ऊपर की ओर प्रवाह रखें।'
    },
    expertSummary: {
      strongestTrait: `मूलांक #${mulank} (${PLANET_NAMES[mulank]}) एवं भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) का संगम: ${comb81.title}`,
      developmentArea: `${comb81.negativeMeaning}`,
      careerDirection: `${comb81.careerMeaning}`,
      relationshipGuidance: `${comb81.relationshipMeaning}`,
      primaryRemedy: `${comb81.remedy} (${mDef.traditionalRemedies.color})`,
      timeCycleGuidance: `वर्तमान व्यक्तिगत वर्ष (PY #${py} - ${selectedPYNarrative.theme}) में ${selectedPYNarrative.recommendedFocus}`,
      masterAdvice: `अपने मूलांक #${mulank} की स्वाभाविक क्षमता और भाग्यांक #${bhagyank} के जीवन पथ में संतुलन बनाए रखें: ${mDef.traditionalRemedies.behavioural}`
    },
    finalSummaryNotes: {
      pinnacleVerdictHi: `मूलांक #${mulank} और भाग्यांक #${bhagyank} का आपका अंकशास्त्रीय ढांचा (${comb81.title}) निरंतर प्रगति, आत्म-विकास और सम्मानजनक उपलब्धियों का संकेत देता है।`,
      keyTakeawaysHi: [
        `1. मूलांक #${mulank} (${PLANET_NAMES[mulank]}) की शक्ति: ${mDef.personality}`,
        `2. भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) की दिशा: ${bDef.bhagyankMeaning}`,
        `3. संयुक्त प्रभाव (${mulank}-${bhagyank}): ${comb81.careerMeaning}`,
        `4. व्यक्तिगत वर्ष (PY #${py}) मार्गदर्शन: ${selectedPYNarrative.recommendedFocus}`,
        `5. व्यवहारिक एवं पारंपरिक संतुलन: ${comb81.remedy}`
      ],
      closingBlessingHi: `ईश्वर आपको उत्तम स्वास्थ्य, समृद्धि, पारिवारिक सौहार्द और अपने जीवन पथ पर निरंतर सफलता प्रदान करें। अंक आपके सामर्थ्य के मार्गदर्शक हैं, सचेत कर्म आपकी सफलता की कुंजी है।`
    }
  };
}

