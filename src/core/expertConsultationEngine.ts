import { CompleteNumerologyProfile } from './types';
import { calculateKuaNumber } from './kuaEngine';
import { parseIndianDate } from '../utils/dateUtils';
import { getCompoundDetails } from '../services/compoundDatabase';

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

export function deriveExpertConsultationDossier(
  profile: CompleteNumerologyProfile
): ExpertConsultationDossier {
  const { coreNumbers, identity, loshu, vedicDasha } = profile;
  const mulank = coreNumbers.mulank || 1;
  const bhagyank = coreNumbers.bhagyank || 1;

  const dobValue = identity.dob || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const parsed = parseIndianDate(dobValue);
  const day = parsed?.day || 1;
  const month = parsed?.month || 1;
  const year = parsed?.year || new Date().getFullYear();

  const rDay = reduceDigit(day);
  const rMonth = reduceDigit(month);
  const rYear = reduceDigit(year);

  // 1. PINNACLES (Classical Indian / Western Synthesis)
  const pin1Val = reduceDigit(rMonth + rDay);
  const pin2Val = reduceDigit(rDay + rYear);
  const pin3Val = reduceDigit(pin1Val + pin2Val);
  const pin4Val = reduceDigit(rMonth + rYear);

  const p1EndAge = Math.max(27, 36 - bhagyank);
  const p2EndAge = p1EndAge + 9;
  const p3EndAge = p2EndAge + 9;

  const pinnacles: PinnaclePhase[] = [
    {
      phaseNumber: 1,
      name: 'प्रथम शिखर (Foundation Pinnacle)',
      ageSpan: `जन्म से ${p1EndAge} वर्ष की आयु तक`,
      pinnacleNumber: pin1Val,
      planet: PLANET_NAMES[pin1Val] || 'शुभ ग्रह',
      themeHi: `प्रारंभिक शिक्षा, संस्कार, पारिवारिक वातावरण और मूल प्रतिभा की पहचान।`,
      guidanceHi: `इस चरण में ज्ञान अर्जन और बौद्धिक नींव को मजबूत करना सर्वोच्च प्राथमिकता रही।`
    },
    {
      phaseNumber: 2,
      name: 'द्वितीय शिखर (Expansion Pinnacle)',
      ageSpan: `${p1EndAge + 1} से ${p2EndAge} वर्ष की आयु तक`,
      pinnacleNumber: pin2Val,
      planet: PLANET_NAMES[pin2Val] || 'शुभ ग्रह',
      themeHi: `करियर की स्थापना, व्यावसायिक प्रयास, पहचान और स्वतंत्र निर्णय लेने का समय।`,
      guidanceHi: `अपने पेशेवर कौशल को निखारें और नए व्यापारिक या कार्यक्षेत्र के अवसरों को अपनाएं।`
    },
    {
      phaseNumber: 3,
      name: 'तृतीय शिखर (Maturity Pinnacle)',
      ageSpan: `${p2EndAge + 1} से ${p3EndAge} वर्ष की आयु तक`,
      pinnacleNumber: pin3Val,
      planet: PLANET_NAMES[pin3Val] || 'शुभ ग्रह',
      themeHi: `सामाजिक प्रतिष्ठा, आर्थिक स्थिरता, नेतृत्व और पारिवारिक जिम्मेदारियों का शिखर।`,
      guidanceHi: `दीर्घकालिक परिसंपत्ति निर्माण और नेतृत्वकारी भूमिकाओं में मार्गदर्शन प्रदान करें।`
    },
    {
      phaseNumber: 4,
      name: 'चतुर्थ शिखर (Wisdom & Legacy Pinnacle)',
      ageSpan: `${p3EndAge + 1} वर्ष की आयु के बाद`,
      pinnacleNumber: pin4Val,
      planet: PLANET_NAMES[pin4Val] || 'शुभ ग्रह',
      themeHi: `आध्यात्मिक शांति, परामर्श, स्थायी संपत्ति और संचित अनुभवों का समाज को दान।`,
      guidanceHi: `आंतरिक शांति, परोपकार और समाज में सम्मानित मार्गदर्शक के रूप में सक्रिय रहें।`
    }
  ];

  // 2. CHALLENGES
  const ch1Val = Math.abs(rMonth - rDay);
  const ch2Val = Math.abs(rDay - rYear);
  const ch3Val = Math.abs(ch1Val - ch2Val);
  const ch4Val = Math.abs(rMonth - rYear);

  const challenges: LifeChallenge[] = [
    {
      challengeNumber: 1,
      name: 'प्रारंभिक जीवन चुनौती (Early Life Challenge)',
      value: ch1Val,
      planet: PLANET_NAMES[ch1Val] || 'संतुलन ऊर्जा',
      areaHi: 'आत्मविश्वास एवं व्यक्तिगत स्वतंत्रता',
      lessonHi: 'दूसरों पर अत्यधिक निर्भर रहने के बजाय अपनी व्यक्तिगत क्षमताओं पर विश्वास करना सीखें।',
      remedyHi: 'प्रातःकाल उगते सूर्य को अर्घ्य दें और अपने विचारों को स्पष्ट रूप से व्यक्त करें।'
    },
    {
      challengeNumber: 2,
      name: 'मध्य जीवन चुनौती (Productive Years Challenge)',
      value: ch2Val,
      planet: PLANET_NAMES[ch2Val] || 'संतुलन ऊर्जा',
      areaHi: 'धैर्य, सहयोग एवं कार्यक्षेत्र संतुलन',
      lessonHi: 'जल्दबाजी में निर्णय लेने से बचें और साझेदारों व सहयोगियों के साथ संवाद स्पष्ट रखें।',
      remedyHi: 'कार्यों में लिखित समझौते रखें और बुधवार को गाय को हरा चारा अथवा पक्षियों को दाना डालें।'
    },
    {
      challengeNumber: 3,
      name: 'प्रमुख मुख्य चुनौती (Core Life Lesson)',
      value: ch3Val,
      planet: PLANET_NAMES[ch3Val] || 'संतुलन ऊर्जा',
      areaHi: 'आंतरिक संतुलन एवं भावनात्मक दृढ़ता',
      lessonHi: 'अति-विचार (overthinking) से दूर रहें और अपने ज्ञान को व्यावहारिक क्रियान्वयन में बदलें।',
      remedyHi: 'प्रतिदिन 10 मिनट मौन ध्यान अथवा ॐ का उच्चारण मानसिक स्थिरता प्रदान करता है।'
    },
    {
      challengeNumber: 4,
      name: 'उत्तर जीवन चुनौती (Maturity Challenge)',
      value: ch4Val,
      planet: PLANET_NAMES[ch4Val] || 'संतुलन ऊर्जा',
      areaHi: 'आध्यात्मिक संतुष्टि एवं अनासक्ति',
      lessonHi: 'परिणामों के प्रति अत्यधिक आसक्ति के बिना निष्काम भाव से अपने उत्तरदायित्व निभाएं।',
      remedyHi: 'धार्मिक व परोपकारी कार्यों में यथाशक्ति सहयोग करें।'
    }
  ];

  // 3. EVENT WINDOWS
  const currentAge = new Date().getFullYear() - year;
  const eventWindows: EventWindow[] = [
    {
      age: Math.max(23, 23 + (mulank % 4)),
      calendarYear: year + Math.max(23, 23 + (mulank % 4)),
      type: 'CAREER_SURGE',
      titleHi: 'करियर की आधारशिला एवं प्रथम बड़ी प्रगति',
      descriptionHi: 'पेशेवर जीवन में नई पहचान, महत्वपूर्ण अवसर या उच्च शिक्षा/कौशल का व्यावहारिक प्रारंभ।',
      planetarySupportHi: `${PLANET_NAMES[mulank]} का सकारात्मक प्रभाव`
    },
    {
      age: Math.max(32, 32 + (bhagyank % 3)),
      calendarYear: year + Math.max(32, 32 + (bhagyank % 3)),
      type: 'TRANSFORMATION',
      titleHi: 'जीवन का महत्वपूर्ण मोड़ (Destiny Shift Window)',
      descriptionHi: 'भाग्यांक की ऊर्जा का पूर्ण सक्रियण। कार्यक्षेत्र में स्वतंत्र दायित्व, नई दिशा या महत्वपूर्ण पदोन्नति।',
      planetarySupportHi: `${PLANET_NAMES[bhagyank]} की महादशात्मक रश्मियां`
    },
    {
      age: Math.max(41, 41 + ((mulank + bhagyank) % 5)),
      calendarYear: year + Math.max(41, 41 + ((mulank + bhagyank) % 5)),
      type: 'FINANCIAL_STABILITY',
      titleHi: 'आर्थिक संचय एवं स्थायी परिसंपत्ति निर्माण काल',
      descriptionHi: 'अचल संपत्ति, व्यापारिक विस्तार या महत्वपूर्ण पारिवारिक उत्तरदायित्वों की सफलता का शुभ चरण।',
      planetarySupportHi: `गुरु एवं शुक्र का संयुक्त ऊर्जा सहयोग`
    },
    {
      age: Math.max(50, 50 + (bhagyank % 4)),
      calendarYear: year + Math.max(50, 50 + (bhagyank % 4)),
      type: 'MATURITY_MILESTONE',
      titleHi: 'सम्मान, सामाजिक प्रतिष्ठा एवं नेतृत्व की पराकाष्ठा',
      descriptionHi: 'समाज एवं उद्योग जगत में विशेषज्ञ या मार्गदर्शक के रूप में स्थायी पहचान की स्थापना।',
      planetarySupportHi: `सूर्य एवं शनि के शुभ गोचर का प्रभाव`
    }
  ];

  // 4. TITHI & COMPOUND ANK ANALYSIS
  const comp = getCompoundDetails(day);

  // 5. PERSONAL YEAR NARRATIVE
  const py = reduceDigit(rDay + rMonth + reduceDigit(new Date().getFullYear()));
  const currentCalendarYear = new Date().getFullYear();

  const pyNarratives: Record<number, PersonalYearNarrative> = {
    1: {
      year: currentCalendarYear,
      personalYear: 1,
      theme: 'नया शुभारंभ, नई योजनाएं, नेतृत्व एवं स्वतंत्र पहल (Year of New Beginnings)',
      career: 'नई नौकरी, स्वतंत्र प्रोजेक्ट या व्यवसाय शुरू करने के लिए अत्यंत अनुकूल वर्ष।',
      finance: 'दीर्घकालिक निवेशों की शुरुआत करें। आत्मविश्वास के साथ नए वित्तीय स्रोत बनाएं।',
      relationships: 'आत्म-पहचान को मजबूत करें, लेकिन रिश्तों में अहंकार और हठधर्मिता से बचें।',
      family: 'परिवार में आपके निर्णयों को प्राथमिकता मिलेगी। माता-पिता के स्वास्थ्य का ध्यान रखें।',
      travel: 'काम और नए अवसरों के सिलसिले में कई छोटी-बड़ी यात्राओं के योग।',
      opportunities: 'नेतृत्व के पद, नए अनुबंध और समाज में नई पहचान।',
      caution: 'अति-उत्साह में बिना जांचे-परखे बड़े जोखिम न लें।',
      recommendedFocus: 'नवाचार, आत्म-अनुशासन और स्पष्ट कार्ययोजना पर ध्यान केंद्रित करें।'
    },
    2: {
      year: currentCalendarYear,
      personalYear: 2,
      theme: 'साझेदारी, धैर्य, शांति एवं कूटनीतिक सहयोग (Year of Patience & Harmony)',
      career: 'टीम वर्क और सहयोगियों के साथ सामंजस्य से कार्य आगे बढ़ेंगे। अकेले संघर्ष से बचें।',
      finance: 'स्थिरता बनाए रखें। जल्दबाजी में भारी पूंजी न फंसाएं; नियमित बचत पर ध्यान दें।',
      relationships: 'प्रेम और दांपत्य जीवन में मधुरता बढ़ेगी। भावनात्मक संवाद को प्राथमिकता दें।',
      family: 'पारिवारिक सौहार्द और घरेलू सुख-सुविधाओं में वृद्धि।',
      travel: 'जल स्थलों या शांत स्थानों की विश्रामदायक यात्राएं।',
      opportunities: 'मजबूत साझेदारियां, मध्यस्थता और रचनात्मक अनुबंध।',
      caution: 'भावुकता में आकर कोई बड़ा व्यावसायिक निर्णय न लें।',
      recommendedFocus: 'धैर्य, कूटनीति और आपसी विश्वास को मजबूत करना।'
    },
    3: {
      year: currentCalendarYear,
      personalYear: 3,
      theme: 'ज्ञान विस्तार, रचनात्मकता, सामाजिक दायरा एवं अभिव्यक्ति (Year of Self-Expression)',
      career: 'सलाहकार, शिक्षण, मीडिया, लेखन और जनसंपर्क में शानदार उपलब्धियां।',
      finance: 'आर्थिक स्थिति में सुधार होगा। रचनात्मक कार्यों से अतिरिक्त आय के स्रोत बनेंगे।',
      relationships: 'सामाजिक दायरा बढ़ेगा। मित्रों और सहकर्मियों के साथ उत्सव और मेलजोल।',
      family: 'परिवार में मांगलिक कार्य या शुभ समाचार के योग।',
      travel: 'अध्ययन, तीर्थाटन और सांस्कृतिक यात्राएं लाभकारी रहेंगी।',
      opportunities: 'सार्वजनिक मंचों पर सम्मान, नई बौद्धिक योजनाएं और नेटवर्किंग।',
      caution: 'कई कामों को एक साथ शुरू करके अपनी ऊर्जा को बिखरने न दें।',
      recommendedFocus: 'अपनी रचनात्मक प्रतिभा और संवाद कौशल को निखारें।'
    },
    4: {
      year: currentCalendarYear,
      personalYear: 4,
      theme: 'कठिन परिश्रम, संरचना, अनुशासन एवं व्यवस्था निर्माण (Year of Hard Work & Foundation)',
      career: 'व्यवस्थित काम करने से भविष्य के लिए मजबूत आधार बनेगा। नियमों का पालन करें।',
      finance: 'बजट पर नियंत्रण रखें। अचल संपत्ति या सुरक्षित फंड्स में पूंजी लगाएं।',
      relationships: 'व्यावहारिकता जरूरी है। काम के दबाव का असर निजी रिश्तों पर न पड़ने दें।',
      family: 'घर की मरम्मत, सुरक्षा या पारिवारिक जिम्मेदारियों को पूरा करने का समय।',
      travel: 'काम से संबंधित व्यावहारिक यात्राएं।',
      opportunities: 'दीर्घकालिक परियोजनाओं की मजबूत नींव और प्रशासनिक कौशल की सराहना।',
      caution: 'आलस्य और शॉर्टकट से बचें; कानूनी मामलों में पूर्ण सावधानी बरतें।',
      recommendedFocus: 'समय प्रबंधन, कार्य कुशलता और स्वास्थ्य की नियमित देखभाल।'
    },
    5: {
      year: currentCalendarYear,
      personalYear: 5,
      theme: 'परिवर्तन, गतिशीलता, व्यापारिक लाभ एवं बहुआयामी विस्तार (Year of Freedom & Dynamic Change)',
      career: 'व्यापार, मार्केटिंग, संचार और नौकरी में सकारात्मक बदलाव के प्रबल योग।',
      finance: 'नकदी प्रवाह (Cash Flow) में तेजी आएगी। व्यापारिक सौदे लाभकारी रहेंगे।',
      relationships: 'नए लोगों से परिचय होगा। रिश्तों में खुलापन और संवाद ताजगी लाएगा।',
      family: 'पारिवारिक जीवन में चहल-पहल और नए बदलावों का स्वागत होगा।',
      travel: 'व्यावसायिक एवं दर्शनीय यात्राओं के अनेक शुभ अवसर।',
      opportunities: 'नए बाजारों तक पहुंच, डिजिटल विस्तार और त्वरित निर्णय लेने का लाभ।',
      caution: 'अस्थिरता और बिना योजना के अनावश्यक बदलावों से बचें।',
      recommendedFocus: 'लचीलापन, मार्केटिंग और अपने संपर्कों को सक्रिय रखना।'
    },
    6: {
      year: currentCalendarYear,
      personalYear: 6,
      theme: 'घरेलू सुख, प्रेम, दांपत्य, जिम्मेदारी एवं सौंदर्य (Year of Love, Family & Responsibility)',
      career: 'ब्रांडिंग, डिजाइन, हॉस्पिटैलिटी, कला और जनसेवा में सफलता।',
      finance: 'घर की सुख-सुविधाओं और वाहन या साज-सज्जा पर व्यय, साथ ही स्थिर लाभ।',
      relationships: 'विवाह, प्रेम संबंधों में प्रगाढ़ता और पारिवारिक सामंजस्य का स्वर्णिम समय।',
      family: 'परिवार की सेवा और बच्चों की उन्नति में आनंद की प्राप्ति।',
      travel: 'पारिवारिक छुट्टियां और आरामदायक पर्यटन।',
      opportunities: 'घरेलू सुख, रिश्तों का पुनर्निर्माण और सामाजिक सम्मान।',
      caution: 'अति-आदर्शवादी बनने या दूसरों के मामलों में बिना मांगे अधिक हस्तक्षेप से बचें।',
      recommendedFocus: 'घर में प्रेम, सौहार्द और सौंदर्य का वातावरण बनाए रखना।'
    },
    7: {
      year: currentCalendarYear,
      personalYear: 7,
      theme: 'आत्म-चिंतन, शोध, आंतरिक शांति एवं आध्यात्मिक उन्नति (Year of Introspection & Spiritual Growth)',
      career: 'रिसर्च, डेटा विश्लेषण, योजना निर्माण और गुप्त रणनीतियों के लिए सर्वोत्तम समय।',
      finance: 'सावधानीपूर्वक निवेश करें। सट्टेबाजी या त्वरित लाभ के प्रलोभनों से बिल्कुल दूर रहें।',
      relationships: 'गहन भावनात्मक समझ की आवश्यकता। कुछ समय एकांत में बिताना लाभकारी होगा।',
      family: 'शांतिपूर्ण वातावरण रखें और परिवार के साथ गहरी समझ विकसित करें।',
      travel: 'प्राकृतिक, शांत और आध्यात्मिक स्थलों की यात्राएं ऊर्जा को शुद्ध करेंगी।',
      opportunities: 'गहन ज्ञान, तकनीकी विशेषज्ञता और अंतर्दृष्टि की जागृति।',
      caution: 'अकेलेपन या अवसाद से बचें; नकारात्मक विचारों को मन में न पनपने दें।',
      recommendedFocus: 'ध्यान, स्वाध्याय, स्वास्थ्य संवर्धन और जीवन के लक्ष्यों का पुनर्मूल्यांकन।'
    },
    8: {
      year: currentCalendarYear,
      personalYear: 8,
      theme: 'कर्म फल, अधिकार, धन संचय, न्याय एवं उच्च उपलब्धि (Year of Power & Manifestation)',
      career: 'उच्च पद, कार्यक्षेत्र में दबदबा, बड़ा व्यापारिक विस्तार और अधिकार प्राप्ति।',
      finance: 'महत्वपूर्ण वित्तीय लाभ, बड़े लेन-देन और संपत्ति में निवेश का शुभ समय।',
      relationships: 'व्यावहारिकता और मान-सम्मान का ध्यान रखें। साथी के योगदान की कद्र करें।',
      family: 'परिवार की वित्तीय स्थिति सुदृढ़ होगी और समाज में प्रतिष्ठा बढ़ेगी।',
      travel: 'अधिकार और व्यापार से संबंधित उच्चस्तरीय यात्राएं।',
      opportunities: 'बड़े अनुबंध, नेतृत्व और पिछले कई वर्षों की मेहनत का प्रत्यक्ष फल।',
      caution: 'घमंड, अत्यधिक कार्यभार और सहयोगियों के प्रति कठोरता से बचें।',
      recommendedFocus: 'न्यायपूर्ण व्यवहार, दूरदर्शी प्रबंधन और वित्तीय अनुशासन।'
    },
    9: {
      year: currentCalendarYear,
      personalYear: 9,
      theme: 'पूर्णता, विसर्जन, परोपकार एवं आगामी चक्र की तैयारी (Year of Completion & Humanitarian Spirit)',
      career: 'पुरानी अधूरी योजनाओं को समाप्त करें और नए 9-वर्षीय चक्र की तैयारी करें।',
      finance: 'उधार चुकाएं, अनावश्यक खर्च रोकें और भविष्य की बचत सुरक्षित करें।',
      relationships: 'पुरानी गलतफहमियों को क्षमा करें और नकारात्मक संबंधों से शांतिपूर्वक विदा लें।',
      family: 'पारिवारिक सहयोग और समाज सेवा में भागीदारी।',
      travel: 'दूरस्थ स्थानों या तीर्थ स्थलों की यात्राएं।',
      opportunities: 'मानवीय सहयोग, वैश्विक दृष्टिकोण और पुराने बोझों से मुक्ति।',
      caution: 'अनावश्यक भावुकता या अतीत की कड़वाहट को पकड़कर न रखें।',
      recommendedFocus: 'क्षमा, दान, आत्म-शुद्धि और नई शुरुआत के लिए मानसिक स्थान बनाना।'
    }
  };

  const selectedPYNarrative = pyNarratives[py] || pyNarratives[5];

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

  const monthlyForecasts: MonthlyDashaYog[] = monthNames.map((m, idx) => {
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
  });

  // 7. GRAH DRISHTI & PLANETARY SYNERGY
  const grahDrishti: GrahDrishtiAnalysis = {
    driverPlanet: PLANET_NAMES[mulank] || 'बुध (Mercury)',
    conductorPlanet: PLANET_NAMES[bhagyank] || 'केतु (Ketu)',
    relationshipType: mulank === bhagyank ? 'HARMONIOUS' : (mulank + bhagyank) % 2 === 0 ? 'FRIENDLY' : 'HARMONIOUS',
    relationshipLabelHi: `मूलांक स्वामी ${PLANET_NAMES[mulank]} एवं भाग्यांक स्वामी ${PLANET_NAMES[bhagyank]} का सौहार्दपूर्ण योग`,
    synergyNarrativeHi: `आपके जन्मांक में मूलांक #${mulank} (${PLANET_NAMES[mulank]}) की त्वरित बौद्धिक सोच और भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) की गहरी अंतर्दृष्टि का अद्भुत संतुलन है। यह योग आपको सतह से ऊपर उठकर गहराई से स्थितियों का मूल्यांकन करने और सही समय पर सटीक निर्णय लेने की योग्यता प्रदान करता है।`,
    dominantAspects: [
      {
        planetPair: `${PLANET_NAMES[mulank]} ↔ ${PLANET_NAMES[bhagyank]}`,
        vibeHi: 'बौद्धिक रणनीति एवं आध्यात्मिक अंतर्ज्ञान (Intellectual Intuition)',
        lifeImpactHi: 'व्यापारिक फैसलों में तार्किक समझ और छठी इंद्री (intuition) का उत्तम तालमेल।'
      },
      {
        planetPair: `सूर्य (1) ↔ गुरु (3)`,
        vibeHi: 'प्रशासनिक प्रभाव एवं ज्ञान विस्तार (Executive Authority & Wisdom)',
        lifeImpactHi: 'समाज एवं कार्यक्षेत्र में परामर्शदाता व सम्माननीय मार्गदर्शक के रूप में पहचान।'
      },
      {
        planetPair: `शुक्र (6) ↔ बुध (5)`,
        vibeHi: 'व्यापारिक आकर्षण, समृद्धि एवं संवाद कौशल (Commerce & Magnetism)',
        lifeImpactHi: 'आर्थिक संचय और नए संपर्कों के माध्यम से निरंतर धन आगमन के अवसर।'
      }
    ]
  };

  return {
    consultantSnapshot: {
      title: 'LeoFamily Expert Dossier Snapshot',
      coreVerdictHi: `जातक ${identity.fullName || 'विशेष व्यक्ति'} का चार्ट मूलांक #${mulank} (${PLANET_NAMES[mulank]}) की स्वाभाविक गतिशीलता और भाग्यांक #${bhagyank} (${PLANET_NAMES[bhagyank]}) के शोधपरक दृष्टिकोण से युक्त एक अत्यंत प्रभावशाली और संतुलित ब्लूप्रिंट है।`,
      dominantEnergyHi: `बुद्धिमत्ता, त्वरित संप्रेषण, विश्लेषणात्मक दृष्टि एवं स्वतंत्र निर्णय क्षमता।`,
      bestAvenueHi: `रणनीतिक प्रबंधन, व्यापार, वित्तीय परामर्श, तकनीक, शिक्षा एवं शोधपरक विश्लेषण।`,
      strategicCautionHi: `अति-विचार (over-analysis) से बचें और अपने विचारों को समयबद्ध क्रियान्वयन में बदलें।`
    },
    tithiAnkAnalysis: {
      birthDate: day,
      compoundTitle: comp.title,
      compoundMeaning: comp.meaning,
      tithiNatureHi: day > 9 
        ? `चूँकि आपकी जन्म तारीख ${day} एक दोहरा अंक है, आपके व्यक्तित्व पर अंक ${Math.floor(day/10)} और अंक ${day%10} की संयुक्त ऊर्जा का दोहरा आशीर्वाद है।`
        : `चूँकि आपका जन्म एकल अंक ${day} के दिन हुआ है, आपका ग्रह प्रभाव अत्यंत प्रत्यक्ष, केंद्रित और मौलिक है।`,
      numericalFrequencyHi: `कम्पाउंड अंक #${day} आपको समाज में प्रभावशाली संपर्क, सम्मान और विशिष्ट अवसरों की प्राप्ति कराता है।`
    },
    characteristicsProfile: {
      thinkingStyle: 'तथ्य-आधारित, विश्लेषणात्मक एवं दूरदर्शी योजना निर्माण।',
      emotionalResponse: 'शांत, संतुलित और परिस्थितियों को वस्तुनिष्ठ रूप से समझने की क्षमता।',
      workHabit: 'उच्च गुणवत्ता, परिशुद्धता और समयबद्ध कार्य निष्पादन।',
      socialConduct: 'गरिमापूर्ण, कूटनीतिक और बौद्धिक रूप से समृद्ध संवाद।',
      leadershipTrait: 'आदेश देने के बजाय प्रेरणा और तार्किक रणनीति द्वारा नेतृत्व।'
    },
    lifePinnacles: pinnacles,
    lifeChallenges: challenges,
    eventWindows,
    educationAnalysis: {
      learningStyle: 'अवधारणात्मक और व्यावहारिक (Conceptual & Analytical Learning)।',
      academicStrengths: ['रणनीतिक विश्लेषण', 'गणितीय एवं तार्किक सोच', 'प्रभावी भाषा व संचार', 'शोध एवं नवाचार'],
      suitableDisciplines: ['प्रबंधन एवं वाणिज्य (Commerce & MBA)', 'आईटी एवं डेटा साइंस', 'वित्तीय अर्थशास्त्र', 'कानून एवं जनसंपर्क'],
      studyDirection: 'उत्तर-पूर्व (ईशान कोण) अथवा उत्तर दिशा की ओर मुख करके अध्ययन करना सर्वोच्च एकाग्रता प्रदान करता है।'
    },
    careerDeepDive: {
      primaryAvenues: [
        'कॉर्पोरेट रणनीति एवं व्यवसाय प्रबंधन',
        'वित्तीय परामर्श, बैंकिंग एवं निवेश विश्लेषण',
        'सूचना प्रौद्योगिकी, सॉफ्टवेयर एवं डिजिटल प्लेटफॉर्म्स',
        'शिक्षा, प्रशिक्षण, लेखक एवं शोध संस्थान'
      ],
      entrepreneurialFit: 'उच्च (स्वतंत्र व्यवसाय, कंसल्टेंसी या पार्टनरशिप में उत्कृष्ट संभावनाएं)।',
      workplaceRole: 'रणनीतिकार, मुख्य परामर्शदाता या स्वतंत्र विभाग प्रमुख।',
      successStrategy: 'नैतिक मूल्यों पर अडिग रहें, नए संपर्कों का विस्तार करें और कार्यों का स्पष्ट लिखित रिकॉर्ड रखें।'
    },
    financeBehaviour: {
      moneyMindset: 'सुरक्षित, दीर्घकालिक संचय एवं रणनीतिक परिसंपत्ति निर्माण।',
      wealthAccumulationPattern: 'मध्यम आयु के बाद निरंतर बढ़ती हुई वित्तीय स्थिरता और अचल संपत्ति के योग।',
      investmentSuitability: 'दीर्घकालिक सुरक्षित म्यूचुअल फंड्स, वाणिज्यिक संपत्ति और ठोस व्यवसाय।',
      financialCaution: 'अपरिचित लोगों के साथ जल्दबाजी में बिना लिखा-पढ़ी के भारी वित्तीय लेन-देन न करें।'
    },
    relationshipFamilyDynamics: {
      relationshipPattern: 'पारस्परिक बौद्धिक संवाद, स्वतंत्रता का आदर और निष्ठा पर आधारित प्रगाढ़ संबंध।',
      familyRole: 'परिवार के मुख्य मार्गदर्शक, संकटमोचक और दूरदर्शी स्तंभ।',
      communicationAdvice: 'घरेलू संवाद में तर्क के स्थान पर स्नेह और भावनात्मक समझ को प्राथमिकता दें।',
      harmonyKey: 'जीवनसाथी के साथ समय बिताएं और मिलकर भविष्य की योजनाएं बनाएं।'
    },
    uniqueAboutYou: {
      cosmicSignature: `मूलांक #${mulank} + भाग्यांक #${bhagyank} का 'ज्ञान-वाणिज्य-शोध' संगम`,
      hiddenGift: 'जटिल परिस्थितियों में भी शांत रहकर तुरंत सबसे व्यावहारिक समाधान ढूंढ निकालना।',
      distinctiveAura: 'सम्मानजनक, गंभीर और स्वाभाविक रूप से लोगों को आकर्षित करने वाला आभा-मंडल।'
    },
    numeroVastuInterpretation: {
      loShuZoneHarmonyHi: 'उत्तर दिशा (बुध/जल तत्व) एवं उत्तर-पूर्व (ईशान) क्षेत्र का संतुलन आपके बौद्धिक विकास एवं आर्थिक स्थिरता के लिए सर्वोपरि है।',
      residenceEntranceDynamicsHi: 'उत्तर अथवा पूर्व दिशा का मुख्य द्वार आपके मूलांक एवं भाग्यांक के साथ प्राकृतिक तालमेल बनाकर निरंतर शुभ अवसर आकर्षित करता है।',
      suggestedVastuRemedies: [
        'उत्तर दिशा में कुबेर स्थान को जल तत्व (जैसे ताजे जल का पात्र) से संवर्धित करें।',
        'ईशान कोण (North-East) को हमेशा स्वच्छ, भारमुक्त और प्रकाशमान रखें।',
        'दक्षिण-पश्चिम (नैऋत्य) में भारी फर्नीचर रखकर स्थिरता ऊर्जा को सुदृढ़ बनाएं।'
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
      dailyRoutineHi: 'प्रातःकाल 6:00 बजे से पूर्व उठें, 15 मिनट प्राणायाम करें और दिन की प्राथमिकताओं को निर्धारित करें।',
      dietaryGuidelineHi: 'हल्का, ताजा और सात्विक आहार लें। हरी पत्तेदार सब्जियां, नारियल पानी और पर्याप्त जलपान ऊर्जा को संतुलित रखते हैं।',
      mindfulnessPracticeHi: 'संध्याकाल में 10 मिनट का मौन ध्यान मानसिक तनाव को दूर करता है।',
      favorableTimingHi: 'महत्वपूर्ण निर्णय, मीटिंग्स और हस्ताक्षर दिन के प्रथम पहर में करना अत्यंत शुभ रहता है।'
    },
    personalYearNarrative: selectedPYNarrative,
    monthlyDashaForecast: monthlyForecasts,
    balancingRemedies: {
      primaryYantraHi: 'श्री बुध यंत्र अथवा कुबेर यंत्र को उत्तर दिशा में स्थापित करें।',
      sacredMantraHi: 'ॐ बुं बुधाय नमः अथवा ॐ नमो भगवते वासुदेवाय (नित्य 11 या 108 बार जाप)।',
      luckyColorsHi: ['हल्का हरा (Light Green)', 'सफेद (White)', 'क्रीम / हल्का पीला (Cream / Light Yellow)'],
      avoidColorsHi: ['गहरा काला (Deep Black)', 'गहरा लाल (Deep Red/Dark Crimson)'],
      crystalRecommendationHi: 'ग्रीन एवेंट्यूरिन (Green Aventurine) अथवा स्फटिक (Clear Quartz) ब्रेसलेट।',
      planetaryCharityHi: 'बुधवार को गौशाला में हरा चारा दान करें अथवा पक्षियों को मूंग दाल अर्पित करें।',
      signatureRecommendationHi: 'हस्ताक्षर को हमेशा नीचे से ऊपर की ओर 15 डिग्री के कोण पर सीधा और स्पष्ट करें; अंत में कभी पूर्णविराम (dot) न लगाएं।'
    },
    expertSummary: {
      strongestTrait: `मूलांक #${mulank} एवं भाग्यांक #${bhagyank} का सामंजस्य - त्वरित विश्लेषण क्षमता, नवाचार एवं नेतृत्व।`,
      developmentArea: 'अति-विचार (Over-thinking) से बचना और दीर्घकालिक रणनीतिक धैर्य बनाए रखना।',
      careerDirection: 'प्रबंधन, वित्तीय परामर्श, बौद्धिक अनुसंधान, प्रौद्योगिकी एवं स्वतंत्र व्यवसाय।',
      relationshipGuidance: 'खुला और आत्मीय संवाद बनाए रखें; व्यावसायिक व्यस्तता के बीच पारिवारिक समय सुरक्षित करें।',
      primaryRemedy: 'उत्तर दिशा (कुबेर स्थान) को स्वच्छ रखें, हल्के हरे व सफेद रंगों का प्राथमिकता से उपयोग करें।',
      timeCycleGuidance: `वर्तमान व्यक्तिगत वर्ष (PY #${py}) आपके लिए नई ऊर्जा, योजनाओं के कार्यान्वयन और प्रगति का कालखंड है।`,
      masterAdvice: 'अंक आपके आंतरिक सामर्थ्य का मानचित्र हैं; सही दिशा में अनुशासित कर्म ही आपकी सफलता की कुंजी है।'
    },
    finalSummaryNotes: {
      pinnacleVerdictHi: `आपका अंकशास्त्रीय ढांचा जीवन के मध्य और उत्तरार्ध में उच्च सफलता, सामाजिक प्रतिष्ठा और आंतरिक शांति के स्पष्ट संकेत देता है।`,
      keyTakeawaysHi: [
        `1. अपने मूलांक #${mulank} की बौद्धिक और व्यापारिक पहल को निरंतर सक्रिय रखें।`,
        `2. भाग्यांक #${bhagyank} के शोध और अंतर्ज्ञान का उपयोग महत्वपूर्ण जीवन निर्णयों में करें।`,
        `3. Personal Year #${py} के अनुकूल व्यापारिक और बौद्धिक विस्तार की योजनाओं को प्राथमिकता दें।`,
        `4. वास्तु में उत्तर-पूर्व (ईशान) को स्वच्छ रखें और अध्ययन/कार्य की बैठक अपनी शुभ दिशा में रखें।`,
        `5. 15° ऊपर की ओर हस्ताक्षर और शुभ रंगों का नियमित उपयोग आपके प्रयासों को गति देगा।`
      ],
      closingBlessingHi: `ईश्वर आपको उत्तम स्वास्थ्य, अटूट समृद्धि, पारिवारिक आनंद और दीर्घायु प्रदान करें। कर्म ही पूजा है, अंक आपके शुभ मार्गदर्शक हैं।`
    }
  };
}
