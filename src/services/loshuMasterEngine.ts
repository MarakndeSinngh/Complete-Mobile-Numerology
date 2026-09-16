import { reduceToSingleDigit } from './numerologyEngine';
import { calculateKuaNumber } from './numeroVaastuEngine';
import { computeLoshuAnalysis } from './loshuEngine';
import { LEOFAMILY_PLANES } from '../core/planeDefinitions';
import { parseIndianDate } from '../utils/dateUtils';

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
  const sum = reduceToSingleDigit(x + y);

  const planetaryRulers: Record<number, string> = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
    6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
  };

  const rulerX = planetaryRulers[x];
  const rulerY = planetaryRulers[y];

  // Specific Names & Details for key combinations
  let name = `The ${rulerX}-${rulerY} Amalgam`;
  let meaning = `Vibrational resonance linking the power of the ${rulerX} with the wisdom of the ${rulerY}. Accentuates Conductor path ${sum}.`;
  let strength = `A balanced alignment facilitating high execution drive, creative expression, and intellectual curiosity.`;
  let weakness = `Potential internal conflicts where the motivations of ${rulerX} override the strategic requirements of ${rulerY}.`;
  let careerImpact = `Highly positive for positions demanding intellectual depth, advising, or leadership execution.`;
  let relationshipImpact = `Requires clear, open verbal agreements. Empathetic alignment ensures deep long-term stability.`;
  let financialImpact = `Best suited for structured long-term assets and systematic cash placements rather than volatile speculation.`;
  let spiritualImpact = `Encourages self-reflection and alignment with high-vibration mentorship.`;
  let remedy = `Perform focused visual meditations or carry matching elemental crystals representing number ${sum}.`;

  if (x === 1 && y === 1) {
    name = "Independent Thinker (सूर्य-सूर्य एकाग्रता)";
    meaning = "Double Sun power. Unmatched willpower, pioneer essence, extremely individualized perspective.";
    strength = "Raw determination, high moral standing, natural initiator, self-reliant.";
    weakness = "Prone to ego-conflict, resistance to external guidance, occasional loneliness.";
    careerImpact = "Best suited for executive leadership, independent business operations, or pioneering inventions.";
    relationshipImpact = "Needs a partner who respects personal boundaries and values deep intellectual independence.";
    financialImpact = "Strong capacity to earn independently; must avoid impulsive financial acquisitions.";
    spiritualImpact = "Finding the sacred inner light; learning humility is the highest target.";
    remedy = "Offer water to the East facing morning Sun. Meditate on the solar-plexus chakra.";
  } else if (x === 1 && y === 2) {
    name = "Emotional Learner (सूर्य-चन्द्र सामंजस्य)";
    meaning = "Union of Sun (force) and Moon (intuition). Represents creative balance and diplomatic intelligence.";
    strength = "High emotional intelligence, empathetic planning, gentle persuasion abilities.";
    weakness = "Moody hesitation, torn between logic and emotional values, sensitive to public opinions.";
    careerImpact = "Outstanding in human resource development, public relations, design, and teaching.";
    relationshipImpact = "Extremely romantic and protective, but easily hurt by cold communication.";
    financialImpact = "Vibrant fluctuation; gains money via creative partnerships and real estate.";
    spiritualImpact = "Unlocking divine equilibrium; balancing masculine (Ida) and feminine (Pingala) energies.";
    remedy = "Drink water from silver utensils; respect maternal figures unconditionally.";
  } else if (x === 1 && y === 3) {
    name = "Transformation Energy (ज्ञान-सूर्य संगम)";
    meaning = "Sun (power) paired with Jupiter (wisdom). The celestial guru-leader compound yielding vast mental growth.";
    strength = "Broad advisory vision, massive educational potential, ethical leadership style, high optimism.";
    weakness = "Overly didactic, struggles to execute simple details, prone to intellectual pride.";
    careerImpact = "Top-tier career in consultancy, corporate coaching, judicial affairs, and academic administration.";
    relationshipImpact = "Brings high loyalty, expects family respect, values deep ethical alignments.";
    financialImpact = "Excellent wealth potential; accumulation happens via mentoring and intellectual properties.";
    spiritualImpact = "Acts as a bridge of knowledge; easily grasps Vedic or spiritual guidelines.";
    remedy = "Apply yellow saffron tilak on the forehead/throat daily; support public libraries.";
  } else if (x === 1 && y === 4) {
    name = "Change and Adaptability (सूर्य-राहू क्रांतियोग)";
    meaning = "Sun with Rahu. A combination representing sudden architectural changes, rebellion, and unique execution paths.";
    strength = "Unconventional analytical skills, out-of-the-box strategy, magnetic charisma, handles massive scale.";
    weakness = "Sudden reputational hurdles, internal stress, struggles with conventional authorities.";
    careerImpact = "Best in technology innovation, media disruptors, systemic auditing, research, and design.";
    relationshipImpact = "Attracts unique, unconventional relationships; requires partners who understand creative chaos.";
    financialImpact = "High risk, sudden massive windfalls accompanied by unexpected structural updates.";
    spiritualImpact = "Demands transcending worldly illusions; mastering shadows to find true cosmic light.";
    remedy = "Feed wild birds on Wednesday mornings. Carry a green aventurine crystal.";
  } else if (x === 1 && y === 5) {
    name = "Attraction and Magnetism (सूर्य-बुध बुधादित्य)";
    meaning = "Sun combined with Mercury. The classic highly auspicious 'Budhaditya Yoga' of pristine commerce intellect.";
    strength = "Superb mercantile intelligence, rapid calculation, high verbal expression, instant problem solving.";
    weakness = "Nervous speed, quick burnouts, highly critical of slow-moving teammates.";
    careerImpact = "Highly suitable for strategic consulting, complex trade, finance brokerage, and public communication.";
    relationshipImpact = "Humorous, engaging companion. Demands dynamic, talkative partnerships and community activities.";
    financialImpact = "Outstanding commercial fortunes; multiplies capital quickly via retail or digital businesses.";
    spiritualImpact = "Awakens intellectual awareness, converting high knowledge into practical daily actions.";
    remedy = "Keep a clean green plant on your workspace desk; donate green lentils on Wednesdays.";
  } else if (x === 1 && y === 6) {
    name = "Luxury Manifestation (शाही वैभव योग)";
    meaning = "Sun meeting Venus. High standard of living, appreciation of aesthetics, and premium worldly comfort.";
    strength = "Excellent taste, artistic appreciation, strong visual eye, attractive social presence.";
    weakness = "Pompous spendings, high cost of living, prone to superficial relationship judgments.";
    careerImpact = "Superb for high-end hospitality, luxury design, gemstone trade, and entertainment sector management.";
    relationshipImpact = "Seeks high romance and material comfort; loves visual presentation and social gatherings.";
    financialImpact = "Gains wealth via premium products, luxury assets, and corporate friendships.";
    spiritualImpact = "Learning that true luxury is internal peace; converting beauty into devotion (Bhakti).";
    remedy = "Wear a splash of sandalwood mist or pleasant natural perfume daily; carry a clear quartz.";
  } else if (x === 1 && y === 7) {
    name = "Fame and Recognition (सूर्य-केतु संधान)";
    meaning = "Sun paired with Ketu. Fosters mysterious deep research, introspective analysis, and quiet fame.";
    strength = "Supernatural focus, analytical persistence, identifies hidden errors, unaffected by social gossip.";
    weakness = "Self-isolator, sudden spiritual detachments, difficult for others to read or comprehend.";
    careerImpact = "Top-tier research engineer, forensic accountant, occult investigator, or deep software architect.";
    relationshipImpact = "Needs a companion comfortable with quiet hours and deep, silent emotional support.";
    financialImpact = "Prone to financial indifference; gains money through specialized secret advisory assignments.";
    spiritualImpact = "Ultimate search for the hidden self; highly conductive to advanced dhyana (meditation).";
    remedy = "Support homeless shelters or donate woolen clothes to those in need on Saturdays.";
  } else if (x === 1 && y === 8) {
    name = "Karmic Struggles & Mastery (सूर्य-शनि द्वंद्व)";
    meaning = "Sun (light) confronting Saturn (darkness). A combination demands high resilience, patience, and absolute justice.";
    strength = "Immensely hard-working, deep physical and mental endurance, strict justice principles, long-term legacy builders.";
    weakness = "Delays in recognition, high initial duties, friction with early family or father figures.";
    careerImpact = "Excellent in legal arbitration, structural engineering, raw asset mining, and governmental administration.";
    relationshipImpact = "Takes long to trust; demands absolute commitment, loyalty, and practical realism.";
    financialImpact = "Slow, gradual capital growth; highly secure wealth accumulation in real properties.";
    spiritualImpact = "Cleanses deep family karma; learns surrender to divine timing and cosmic laws.";
    remedy = "Respect construction laborers and help them. Light a sesame oil lamp in the West on Saturdays.";
  } else if (x === 1 && y === 9) {
    name = "Leadership Success (सूर्य-मंगल शौर्यराज)";
    meaning = "Sun with Mars. High-energy, explosive drive, commanding field authority, and execution focus.";
    strength = "Vast courage, quick reflex execution, leads teams with absolute authority, champion spirit.";
    weakness = "Hot temper, impatient with micro management, prone to physical burns or stress.";
    careerImpact = "Successful in military command, police enforcement, heavy business start-ups, and active surgery.";
    relationshipImpact = "Highly protective and passionate parent/partner, but struggles with hot-headed arguments.";
    financialImpact = "Aggressive earner; multiplies capital via fast-expanding corporate trades.";
    spiritualImpact = "Transforming physical drive into selfless service (Karma Yoga).";
    remedy = "Maintain a copper coin in your pocket. Perform regular cardio exercises.";
  } else if (x === 2 && y === 2) {
    name = "Highly Intuitive Empath (चन्द्र-चन्द्र गहनता)";
    meaning = "Double Moon presence. Deep psychic abilities, fluid adaptation, and highly-charged emotional compass.";
    strength = "Exceptional empathetic resonance, artistically genius, comforting presence to all.";
    weakness = "Extreme mood swings, psychological fatigue from carrying others' pain, fear of rejection.";
    careerImpact = "Ideal in psychiatric therapy, creative writing, painting, culinary arts, or maritime commerce.";
    relationshipImpact = "Requires absolute unconditional security, deep comfort, and emotional validation.";
    financialImpact = "Fluctuates like sea tides; must rely on rigid wealth managers rather than mood investments.";
    spiritualImpact = "Accessing deep spiritual realms; highly capable of dream work and somatic meditation.";
    remedy = "Meditate near water bodies or keep a silver bowl of clean river water in your Northeast zone.";
  } else if (x === 5 && y === 5) {
    name = "The Master Mercantilist (बुध-बुध व्यापारिक)";
    meaning = "Double Mercury. Peerless trading brain, hyper-functional communications, mathematical calculation depth.";
    strength = "Instant arithmetic calculation, witty logic, superb public speaker, identifies arbitrage opportunities.";
    weakness = "High nervous tension, erratic focus, tendency to overanalyze simple life elements.";
    careerImpact = "Finance trading, algorithmic software development, public relations, brokerage, and tech startups.";
    relationshipImpact = "Needs continuous intellectual stimulation, witty banter, and freedom to travel.";
    financialImpact = "Outstanding growth engine; multiplies money via smart cash rotation and public stocks.";
    spiritualImpact = "Transforms logic into divine discrimination (Viveka); masters pranayama.";
    remedy = "Practice deep daily breathwork (Anulom Vilom); wear organic shades of green on Wednesdays.";
  } else if (x === 9 && y === 9) {
    name = "The Fiery Crusader (मंगल-मंगल उग्रता)";
    meaning = "Double Mars. Blazing courage, unstoppable physical energy, warrior mindset.";
    strength = "Fearless, high physical speed, defends the weak, overcomes hurdles with sheer willpower.";
    weakness = "Aggressive tone, impatient with details, vulnerable to physical injury and sudden burns.";
    careerImpact = "Defense command, active surgery, high-stakes trade, emergency response management.";
    relationshipImpact = "Protective protector but needs a very calm, grounded partner who diffuses fire.";
    financialImpact = "High gains through risk-filled ventures; must build structured assets to anchor cash.";
    spiritualImpact = "Burning away absolute ego-impurities through intensive self-discipline.";
    remedy = "Donate blood regularly; practice daily cooling meditation (Sheetali Pranayama).";
  }

  return {
    code,
    name,
    meaning,
    strength,
    weakness,
    careerImpact,
    relationshipImpact,
    financialImpact,
    spiritualImpact,
    remedy
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

  // Archetype logic
  let archetypeTitle = "The Strategist";
  let archetypeDesc = "Combining systematic planning with intuitive human understanding.";
  let archetypeReasoning = "Driven by a balanced mental plane and a firm Conductor path (Bhagyank).";
  let archetypeMantra = "OM BRIM BRHASPATAYE NAMAH";

  if (driver === 1 || driver === 9) {
    archetypeTitle = "The Leader (शासक)";
    archetypeDesc = "An organic initiator of structures, motivating public crowds towards singular vision paths.";
    archetypeReasoning = `Formulated by Driver Number (Mulank) #${driver} and Conductor Number (Bhagyank) #${conductor}. Indicates fire-water structural force.`;
    archetypeMantra = "OM ADITYAYA NAMAH • OM KEM KETAVE NAMAH";
  } else if (driver === 3 || driver === 5) {
    archetypeTitle = "The Teacher & Advisor (गुरु)";
    archetypeDesc = "Brings academic study, advisors skills, and deep systemic balance to growing systems.";
    archetypeReasoning = `Active growth numbers are present in core quadrants with a Conductor Number (Bhagyank) #${conductor}.`;
    archetypeMantra = "OM GURAVE NAMAH";
  } else if (driver === 2 || driver === 7) {
    archetypeTitle = "The Mystic Healer (योगी)";
    archetypeDesc = "A conduit for esoteric occurrences, deep somatic intelligence, and emotional counseling.";
    archetypeReasoning = `Ruler digits suggest moon-ketu balance which opens high psychic pathways.`;
    archetypeMantra = "OM SOM SOMA_YAE NAMAH";
  } else if (driver === 6) {
    archetypeTitle = "The Creative Artist (कलाकार)";
    archetypeDesc = "Injecting design aesthetics, deep consumer warmth, and luxury dynamics into physical creations.";
    archetypeReasoning = "Venusian frequencies dictate first reaction parameters, aligning beautifully with team designs.";
    archetypeMantra = "OM SHUM SHUKRAYAE NAMAH";
  } else if (driver === 4 || driver === 8) {
    archetypeTitle = "The Structural Builder (शिल्पी)";
    archetypeDesc = "Persistent determination, unmatched brick-and-mortar execution stamina, high organizational discipline.";
    archetypeReasoning = `Heavy earth and metal channels operate within the grid coordinates.`;
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
    mentalStrength: `Based on your present digits in Mind Plane ${mindPlaneDef.coordinates.join('')}: ${mindPlaneDef.coordinates.filter(d => enhancedGridMap[d]>0).join(', ')}. Mentally agile, sharp visualization capabilities.`,
    emotionalStrength: `Calculated from your middle Emotional Plane ${emotionalPlaneDef.coordinates.join('')}: ${emotionalPlaneDef.coordinates.filter(d => enhancedGridMap[d]>0).join(', ')}. Reflects intuitive empathy ratios.`,
    practicalStrength: `Calculated from your Practical Plane ${practicalPlaneDef.coordinates.join('')}: ${practicalPlaneDef.coordinates.filter(d => enhancedGridMap[d]>0).join(', ')}. Governs action readiness and money management.`,
    leadershipScore: `Propelled by Will Plane ${willPlaneDef.coordinates.join('')} and Action Plane ${actionPlaneDef.coordinates.join('')} alignments with driver planet #${driver}.`,
    communicationScore: `Derived from Mind Plane ${mindPlaneDef.coordinates.join('')} and Emotional Plane ${emotionalPlaneDef.coordinates.join('')} alignments in the flat map, managed by Mercury/Sun.`,
    spiritualScore: `Governed by Emotional Plane ${emotionalPlaneDef.coordinates.join('')} and Silver Yog ${silverYogDef.coordinates.join('')} levels.`,
    relationshipScore: `Measures affinity from Emotional Plane ${emotionalPlaneDef.coordinates.join('')} and Action Plane ${actionPlaneDef.coordinates.join('')} which manage partnership harmony.`,
    careerPotentialScore: `Synthesis of administrative drive and material plane alignment.`,
    overallLoshuScore: `Cumulative matrix value representing total vibrational balance.`
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
    let meaning = fallback ? fallback.meaning : `No major active link for this plane.`;
    let strength = fallback ? fallback.strength : `Latent capabilities; waiting to be unlocked by specific remedial actions.`;
    let risk = fallback ? fallback.risk : `Low focus in this category; easily distracted during lengthy transactions.`;
    let careerImpact = fallback ? fallback.careerImpact : `Normal operations; must create manual checklists to stay disciplined.`;
    let relationshipImpact = fallback ? fallback.relationshipImpact : `Requires effort and practical compromises.`;
    let remedy = fallback ? fallback.remedy : `Carry standard protection crystals with you.`;

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
  let mStrengths = "No mobile number provided to analyze.";
  let mWeaknesses = "Please submit your primary 10-digit mobile number.";
  let mComp = "N/A";
  let mSupport = "N/A";
  let mConflict = "N/A";
  let mImprovements = "N/A";

  if (mobileNum) {
    const cleanMob = mobileNum.replace(/[^0-9]/g, '');
    const mobDigits = cleanMob.split('').map(Number);
    const mobSum = mobDigits.reduce((a,b)=>a+b, 0);
    const mobSingle = reduceToSingleDigit(mobSum);

    // Identify values present in mobile but missing in Lo Shu
    const mobPresents = Array.from(new Set(mobDigits)).filter(d => d >= 1 && d <= 9);
    const compensating = mobPresents.filter(d => enhancedGridMap[d] === 0);

    mStrengths = `Overall mobile compound vibration relates to Planet #${mobSingle}. It contains active numbers: ${mobPresents.join(', ')}.`;
    mWeaknesses = `Lacks frequencies of digits: ${[1,2,3,4,5,6,7,8,9].filter(d => !mobPresents.includes(d)).join(', ')}.`;
    
    if (compensating.length > 0) {
      mComp = `Excellent compensation! Your mobile introduces missing frequencies of digits: ${compensating.join(', ')}. This partially stabilizes communication loops.`;
    } else {
      mComp = `No direct support for missing digits. Your mobile reinforces already congested digits inside your grid.`;
    }

    mSupport = `The mobile single sum #${mobSingle} is friendly with your driver planet #${driver}. Enhances business conversion rates.`;
    mConflict = mobSingle === 8 && driver === 1 ? "WARNING: Your mobile sum (8) is hostile with Driver (1), causing delays in cash clearances." : "Dynamic neutral support. No fatal conflicts.";
    mImprovements = `To unlock peak wealth, shift your mobile number so that the sum totals to 5 (Business) or 6 (Luxury).`;
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
    ? ['North (Career)', 'East (Health)', 'South (Fame)', 'Southeast (Success)']
    : ['Northeast (Education)', 'Southwest (Marriage)', 'West (Creativity)', 'Northwest (Helpful Friends)'];

  const avoidDirections = groupType === 'EAST_GROUP'
    ? ['West', 'Southwest', 'Northeast', 'Northwest']
    : ['North', 'East', 'South', 'Southeast'];

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
    moneyMindset = 'Luxury and comfort-oriented. Views wealth as a beautiful medium to experience fine comforts and build an aesthetic, nourishing lifestyle.';
    spendingBehaviour = 'Loves spending on premium luxury, comfortable travel, and stylish apparel. Values experiences and high-frequency environments over strict penny-pinching savings.';
    riskTakingBehaviour = 'Moderate; prefers investments in beautiful physical assets, luxury properties, creative brands, and artistic ventures rather than dry speculative bonds.';
    financialDisciplineScore = 65;
  } else if (wealthArchetype === 'BOLD_PROVIDER') {
    moneyMindset = 'Ambitious, growth-oriented, and highly expansionist. Believes in making larger financial plays and scaling income channels aggressively.';
    spendingBehaviour = 'Generous spender, loves acting as a royal provider for family and associates. Prone to proud impulsive purchases but backed by solid income drives.';
    riskTakingBehaviour = 'Bold and high-stakes. Confidently invests in equity, direct businesses, and high-growth sectors, managing high levels of systemic stress.';
    financialDisciplineScore = 75;
  } else if (wealthArchetype === 'SELECTIVE_SCHOLAR') {
    moneyMindset = 'Knowledge-driven and spiritually selective. Believes wealth should fund peace, books, health, and deep inner freedom rather than simple public showing off.';
    spendingBehaviour = 'Highly selective spender. Happy to pay heavily for education, wellness retreats, or premium quality tools, but completely frugal with superficial fast-fashion or sensory clutter.';
    riskTakingBehaviour = 'Cautious and analytical. Prefers low-volatility long-term deposits, medical shares, or educational assets that compound peacefully over time.';
    financialDisciplineScore = 85;
  } else { // STABLE_PLANNER
    moneyMindset = 'Strict, security-first calculator. Believes in meticulous cash flow planning and building a bulletproof emergency shield before taking any action.';
    spendingBehaviour = 'Highly disciplined and budget-conscious. Tracks expenditures carefully, avoids unnecessary subscriptions, and values structural safety above all else.';
    riskTakingBehaviour = 'Calculated and systematic. Prefers government bonds, secure bank savings, land, or blue-chip investments with clear mathematical histories.';
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
      mostInfluential: { digit: mostInfluentialDigit, reason: `Matches your birth Driver Number (Mulank) planet #${driver}.` },
      leastInfluential: { digit: leastInfluentialDigit, reason: `Completely missing node inside the 3x3 birth grid.` },
      lifeThemeNum: conductor,
      lifeThemeText: `Governed by Conductor Number (Bhagyank) #${conductor}. Indicates structural movement toward target growth.`,
      corePersonalityNum: driver,
      corePersonalityText: `Governed by Driver Number (Mulank) #${driver}. Denotes default emotional reactions.`
    },
    activeCombinations,
    archetype: {
      title: archetypeTitle,
      description: archetypeDesc,
      reasoning: archetypeReasoning,
      mantra: archetypeMantra
    },
    profiling: {
      thinkingStyle: driver % 2 === 0 ? 'Empathetic, intuitive and multi-sensory thinking pattern.' : 'Highly structured, analytical and logical strategic flow.',
      decisionMakingStyle: enhancedGridMap[5] > 0 ? 'Balanced decision framework using both commercial logical analysis and gut feel.' : 'Prone to sudden hesitation; highly reliant on external consultations.',
      communicationStyle: enhancedGridMap[1] > 1 ? 'Vocal, hyper-expressive and bold with commands.' : 'Diplomatic, calculated and soft-spoken.',
      learningStyle: enhancedGridMap[3] > 0 ? 'Classic academic reader; retains massive structural knowledge.' : 'Practical, hands-on apprentice format.',
      leadershipStyle: enhancedGridMap[9] > 0 ? 'Pioneering leader, sets visual benchmarks for execution.' : 'Quiet coordinator, works via team agreements.',
      workStyle: enhancedGridMap[8] > 0 ? 'Workaholic, operates until the final block is clean.' : 'Smart coordinator, delegates heavy physical trade.',
      problemSolvingStyle: enhancedGridMap[7] > 0 ? 'Breaks systems down into microscopic parts; excellent debugger.' : 'Solves cases through collective team consensus.',
      stressResponsePattern: primaryDosha === 'PITTA' ? 'Hot outbursts, quick irritation under workload.' : 'Internal anxiety and nervous hyper-movement.',
      motivationPattern: `Driven by the realization of Driver #${driver} frequencies which desire personal recognition.`,
      selfDisciplineLevel: enhancedGridMap[4] > 0 ? 'Meticulous, neat, lives by strict routine guidelines.' : 'Highly creative but chaotic daily timeline structures.',
      confidenceLevel: enhancedGridMap[5] > 0 ? 'Superb internal self-reliance; untroubled by social criticism.' : 'Variables based on immediate feedback from friends.',
      publicImage: `Seen as a reliable, dignified candidate ruled by planetary destiny.`,
      personalGrowthAreas: `Enhance communication flow by bridging missing nodes: ${missing.join(', ')}.`
    },
    relationshipBehaviour: {
      loveLanguage: driver === 6 || driver === 2 ? 'Words of affirmation and elegant gift exchanges.' : 'Acts of service and protective support.',
      emotionalNeeds: `Needs absolute comfort and family stability without loud dramatic outbursts.`,
      commitmentStyle: `Highly stable once trust conditions are established.`,
      trustPattern: `Slow to build; audits candidate history before opening up.`,
      conflictBehaviour: `Prefers quiet holding hours to avoid direct verbal hurts.`,
      marriageExpectations: `Wants absolute balance and supportive joint asset expansions.`,
      partnerExpectations: `Seeks high hygiene, intellectual sharpness, and mutual respect.`,
      emotionalCompatibilityStyle: `Resonates with numbers that match complementary elemental groups.`,
      strengths: `Deep empathy and complete family devotion.`,
      challenges: `Overly critical during times of financial delay.`,
      growthSuggestions: `Avoid mind-reading; write down clear mutual domestic goals.`
    },
    familyKarma: {
      fatherInfluence: `Sun-Saturn relationship rules indicate significant responsibility of parent figures onto you.`,
      motherInfluence: `Moon-Venus guidelines show deep internal emotional support system through mother.`,
      ancestralInfluence: `High inheritance of physical wisdom and real estate luck.`,
      familyResponsibilities: `Expected to act as the primary structural advisor during family property updates.`,
      inheritedStrengths: `Intense patience and structural design vision.`,
      inheritedChallenges: `Carrying karmic delays of family real estates.`,
      familyKarmaLessons: `Release old sibling argument patterns to clear financial blocks.`,
      generationalGrowthAreas: `Initiate independent family assets instead of completely relying on ancestors.`
    },
    wealthPsychology: {
      moneyMindset,
      riskTakingBehaviour,
      spendingBehaviour,
      savingBehaviour: `Systematic compounding once missing remedies are active.`,
      investmentBehaviour: `Property land purchases and government bonds.`,
      businessMindset: enhancedGridMap[5] > 0 ? 'Natural merchant, identifies retail trade loops.' : 'Advisor structure, works best inside partnerships.',
      wealthCreationStyle: `Slow secure accumulations with major multipliers in running Mahadashas.`,
      financialDisciplineScore,
      wealthPotentialScore: Math.min(99, Math.round(40 + (score951 * 15) + (score357 * 15) + (score816 * 15) + (score276 * 10))),
      moneyBlockages: `Blocked funds in South-West zones due to missing Earth elements.`,
      financialRemedies: `Keep wooden windchimes in South-East and yellow salt lamps in Center zones.`
    },
    careerBlueprint: {
      bestCareers: ['Engineering', 'Systemic Planning', 'Financial Audits', 'Technology Architectures'],
      governmentJobs: driver === 1 || driver === 9 ? 'Highly suitable; Sun-Mars forces assist administrative success in civil lines.' : 'Moderate; advisor positions only.',
      privateJobs: `Highly suited for corporate consultancy and high-tech planning sectors.`,
      businessSuitability: enhancedGridMap[5] > 0 ? 'High suitability for independent commercial enterprises.' : 'Partner-driven alliances suit you best.',
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
        { title: "Systems Designer", explanation: "Calculated structural vision assists logical blueprint creations." },
        { title: "Corporate Consultant", explanation: "Advisory strengths help businesses identify flow blocks." },
        { title: "Financial Arbitrator", explanation: "Excellent for legal reviews, tax and balance auditing." },
        { title: "Occult Researcher", explanation: "Mystic elements unlock secrets of numbers and stars." },
        { title: "Real Estate Arbitrageur", explanation: "Saturnian aspects support spatial acquisitions." },
        { title: "Digital Communication Expert", explanation: "Mercurial power translates concepts into swift public copies." },
        { title: "Hospitality Manager", explanation: "Venusian aspects facilitate elite guest experiences." },
        { title: "Project Manager", explanation: "Bridges technical builders with high financial owners, maintaining limits." },
        { title: "Education specialist", explanation: "Jupiter aspect helps pass down legacy practices cleanly." },
        { title: "Logistics Analyst", explanation: "Optimizes structural cargo flow maps using mathematical indices." }
      ]
    },
    hiddenTalents: {
      naturalGifts: `Gut intuition, systemic tracking, and immediate human empathy.`,
      talents: {
        creative: `High aesthetic eye and spatial decoration sense.`,
        communication: `Expressive command tone; drives people towards visual operations.`,
        business: `Calculates capital rotation and trade loopholes.`,
        teaching: `Translates abstract complex theories into direct friendly notes.`,
        leadership: `Crisis management; maintains cool composure under severe timeline stress.`,
        spiritual: `Aura scanning and esoteric reading matching birthday blueprints.`,
        artistic: `Appreciation of fine frequencies, premium cosmetics, jewelry, and gems.`,
        entrepreneurial: `Finds structural startup paths from minimal seed elements.`
      },
      mostPowerfulTalent: `Intuitive structural planning: combining logical blueprints with a natural gut feel for people.`
    },
    karmicLessons: missing.map(digit => {
      const lessonsMap: Record<number, { lesson: string; challenge: string; growth: string; advice: string; strategy: string; remedy: string }> = {
        1: {
          lesson: "Struggling to express independent desires without validation.",
          challenge: "Fear of speaking out your real thoughts; feeling ungrounded in public arenas.",
          growth: "Awaken the inner pillar of self-reliance; build personal boundary limits.",
          advice: "Do not wait for others to crown you. Speak first, execute independently.",
          strategy: "Lead at least one small self-driven project monthly without asking for approvals.",
          remedy: "Pour clean fresh water to morning Sun; wear orange threads on your right wrist."
        },
        2: {
          lesson: "Struggles with emotional vulnerability and mood containment.",
          challenge: "Fragile domestic boundaries; taking comments from acquaintances too personally.",
          growth: "Mastering somatic stability, learning to differentiate your feelings from others.",
          advice: "Avoid immediate reactive steps during high/low mood tides.",
          strategy: "Engage in swimming or water meditations. Maintain strict sleep timings.",
          remedy: "Wear silver ornaments or carry natural pearls. Keep yellow clay objects in South-West."
        },
        3: {
          lesson: "Struggles keeping focused on dry academic files; lacks mentor advice.",
          challenge: "Starting multiple research lines but finishing none; rejecting guru directions.",
          growth: "Systemizing knowledge; building long-term study concentration.",
          advice: "Approach established mentors; study classic texts with complete patience.",
          strategy: "Spend 2 hours weekly learning classical arts or ancestral texts.",
          remedy: "Offer yellow fruits to educators on Thursdays; maintain clean bookshelves."
        },
        4: {
          lesson: "Struggles with rigid discipline, organization, and cash savings.",
          challenge: "Erratic daily timelines; ignoring legal structures; chaotic savings accounts.",
          growth: "Building absolute brick-and-mortar foundation systems.",
          advice: "Maintain a daily budget log. Keep your closets clean.",
          strategy: "Adopt a strict morning checklist routine. Use physical alarm clocks.",
          remedy: "Keep wooden windchimes in South-East. Carry a green aventurine crystal."
        },
        5: {
          lesson: "Lacks central mental stability and grounding.",
          challenge: "Feeling scattered mentally; struggles negotiating business terms.",
          growth: "Mastering central focal points, solid balance, and verbal negotiations.",
          advice: "Do not rush. Stabilize your center before launching heavy operations.",
          strategy: "Perform core-stabilising exercises. Keep brass pyramids on desks.",
          remedy: "Wear emerald or peridot on your little finger. Donate green lentils."
        },
        6: {
          lesson: "Struggles receiving external support and family warmth.",
          challenge: "Feeling lonely in times of crisis; neglecting personal luxury and home decor.",
          growth: "Opening up channels for helpful friendships and cooperative designs.",
          advice: "Be supportive to others first; learn to receive love gracefully.",
          strategy: "Host clean warm family dinners. Decorate North-West sectors with metal.",
          remedy: "Wear diamond/white opal or use rose essential mists in morning baths."
        },
        7: {
          lesson: "Struggles with deep patient analysis; prone to direct betrayals.",
          challenge: "Prone to instant superficial beliefs; lacks inner protective shield.",
          growth: "Developing persistent analytical research and occulic understanding.",
          advice: "Verify facts twice. Do not share core secrets with casual friends.",
          strategy: "Spend 1 hour in absolute silence daily. Maintain a personal journal.",
          remedy: "Meditate on Ganesha mantras; donate food bowls to street dogs."
        },
        8: {
          lesson: "Slower asset accumulation and material wealth blockages.",
          challenge: "Lacking persistence in heavy physical labor; delayed corporate files.",
          growth: "Learning deep material planning, corporate arbitration, and long-term security.",
          advice: "Respect time and Saturn's values. Accept early hard duties with joy.",
          strategy: "Perform deep cleaning tasks in your home every Saturday.",
          remedy: "Wear black tourmaline. Keep earthy pottery items in North-East."
        },
        9: {
          lesson: "Low public recognition and driving courage.",
          challenge: "Feeling invisible in social groups; low dynamic vitality.",
          growth: "Awakening raw courage, self-worth, and high ethical fame.",
          advice: "Do not hide. Step into the spotlight when systems require your hand.",
          strategy: "Engage in public speaking or physical active challenges.",
          remedy: "Light a red candle in South bedrooms daily. Wear scarlet accessories."
        }
      };

      const emptyLesson = {
        lesson: "General balance check.",
        challenge: "Integrate default elements.",
        growth: "Unlock cosmic coordinates.",
        advice: "Maintain balance with daily meditation.",
        strategy: "Perform regular actions.",
        remedy: "Carry standard crystals."
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
      lifePurpose: `To translate deep inner spiritual vision (Driver #${driver}) into an active structural legacy (Conductor #${conductor}) that supports societal progress.`,
      soulMissionText: `Your soul selected path #${conductor} as its primary destination. This requires mastering lessons of patience, structural integrity, and divine trade.`,
      higherCalling: `To act as a beacon of advice and grounding balance during times of rapid geopolitical shifts.`,
      societyContribution: `Designing structured, safe spaces for team operations and providing clean planetary advice.`,
      spiritualDirection: `Moving inward via standard occult studies while maintaining pristine commercial boundaries.`,
      purposeStatement: `I manifest my driver willpower to build long-term legacy structures that stabilize everyone around me.`,
      legacyPotential: `Highly profound! Marked by massive multi-generational real estates and ethical family codes.`
    },
    arrowsAnalysis,
    mobileFusion: {
      checked: !!mobileNum,
      mobileNumber: mobileNum || "Not provided",
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
      directionAnalysis: `Your Kua Number is ${kuaNumber} belonging to the ${groupType === 'EAST_GROUP' ? 'East Mansion (पूर्व समूह)' : 'West Mansion (पश्चिम समूह)'}.`,
      bestDirections,
      avoidDirections,
      zones: {
        career: `North (उत्तर): Place metal fountain structures to multiply career path files.`,
        money: `South-East (दक्षिण-पूर्व): Keep green plants or wooden windchimes to clear blocked cash flows.`,
        health: `East (पूर्व): Place healthy Tulsi plants and avoid storing old metallic junk.`,
        relationship: `South-West (दक्षिण-पश्चिम): Keep solid heavy clay or pink crystal pairs to cement marital trust.`
      },
      homeRemedies: `Remove any blue paint from South-West bedrooms; introduce soft off-white or cream tiles.`,
      officeRemedies: `Always sit facing your favorable direction ${bestDirections[0]} to prevent legal hazards.`
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
        ? "Prone to warm hyper-acidity, skin eruptions, and liver heat. Requires cool leafy diets."
        : "Tendencies toward cold dry joints, neural blockages, and dry digestive tracts. Requires warm oily structures.",
      lifestyleRecommendations: primaryDosha === 'PITTA'
        ? ["Consume sweet, bitter and cooling food items.", "Avoid extremely spicy meals and direct noon sun.", "Practice moon-gazing on Monday nights."]
        : ["Eat warm, moist, heavy and sweet food profiles.", "Introduce warm sesame oil massages daily.", "Engage in slow, grounding yoga formats."],
      preventiveWellness: `Practice intermittent hydration under Moon skies; avoid high-stress meetings post sunset.`
    },
    forecasts: {
      personalYear,
      personalMonth,
      personalDay,
      career: `Vibrational indicators show positive structural adjustments in career paths. Excellent for initiating new tasks.`,
      money: `Steady flow; assets compound smoothly. Avoid sudden risky investments on Saturn days.`,
      relationships: `Balanced year; deep communication helps resolve old structural family delays.`,
      health: `Strong wellness index; ensure regular sleep and warm morning tea routines.`,
      business: `Highly favorable for commercial startups and legal agreements.`,
      travel: `Opportunities for short-distance travels for business negotiations are active.`,
      spiritualGrowth: `Occult insights and cosmic meditation experiences deepen swiftly.`,
      opportunities: [`Launch a new digital platform or trade project.`, `Strengthen ancestral relationships.`],
      warnings: [`Avoid loud verbal arguments during moon days.`, `Ignore fake speculative stock channels.`]
    },
    remedies: {
      luckyNumbers: [driver, conductor, 5, 1, 6],
      luckyDates: [`${driver}th`, `${conductor}th`, '5th', '14th', '23rd'],
      luckyDays: ['Wednesday', 'Thursday', 'Friday'],
      luckyColours: ['Emerald Green', 'Royal Blue', 'Champagne Cream'],
      luckyDirections: bestDirections,
      personalRemedies: [`Meditate daily for 15 minutes facing your success direction: ${bestDirections[0]}.`, `Respect maternal and paternal figures unconditionally.`],
      careerRemedies: [`Keep a green aventurine tree on your office table.`, `Always face ${bestDirections[0]} during important corporate calls.`],
      relationshipRemedies: [`Keep a pair of rose quartz hearts in the South-West corner of your flat.`, `Avoid storing broken metals or old clocks under marital beds.`],
      financialRemedies: [`Water a leafy green plant daily of Wednesday morning.`, `Donate black sesame seeds to down-and-out construction workers on Saturdays.`],
      spiritualRemedies: [`Chant your archetype mantra: ${archetypeMantra} 27 times every morning.`, `Practice absolute silence (Mauna) for 30 minutes every Sunday.`],
      actionPlan: `Cast your attention onto resolving missing grid nodes. Introduce corresponding elements in the designated Vastu sectors. Maintain an organic, high-hydration sleep routine and perform your 90-day plan without delays.`,
      plan90Days: {
        days1_30: "Audit all physical spaces. Clear old broken clocks and metallic junk. Sit facing your success direction and start your weekly chant routines.",
        days31_60: "Introduce elemental Vastu corrections (plants in SE, clay lamps in SW). Perform weekly food donations matching your Driver profile planets on designated days.",
        days61_90: "Establish a strict daily budget logger. Review mobile improvements. Note down the subtle enhancements in cash collections and sleep depth parameters."
      }
    }
  };
}
