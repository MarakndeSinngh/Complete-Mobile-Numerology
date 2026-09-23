import { reduceToDigit, reduceWithMaster } from './numerologyEngine';
import { getCompoundDetails } from '../services/compoundDatabase';

/**
 * ============================================================================
 * LEOFAMILY PHASE 5: NAME NUMEROLOGY + CHALDEAN + PYTHAGOREAN ENGINE
 * ============================================================================
 * Strict Separation:
 * - INDIAN / CHALDEAN (Ancient Vedic & Mesopotamian phonetic system, 1 to 8, 9 sacred)
 * - WESTERN / PYTHAGOREAN (Sequential Western alphabet system, 1 to 9)
 *
 * All explanations follow the LeoFamily Hindi-first tone (70-80% simple Hindi, 20-30% numerology terms).
 */

// 1. Classical Chaldean Mapping (1-8, 9 is excluded from single letters as sacred)
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

// 2. Western Pythagorean Mapping (1-9 sequential)
export const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export const STANDARD_VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export interface LetterBreakdownItem {
  letter: string;
  chaldeanValue: number;
  pythagoreanValue: number;
  isVowel: boolean;
  planet: string;
}

export interface FirstLetterAnalysis {
  letter: string;
  chaldeanValue: number;
  pythagoreanValue: number;
  planet: string;
  traditionalMeaning: string;
  personalityInfluenceHi: string;
  communicationInfluenceHi: string;
  careerInfluenceHi: string;
  element: string;
  soundVibration: string;
}

export interface VowelHeartAnalysis {
  vowelsPresent: string[];
  vowelCount: number;
  chaldeanTotal: number;
  chaldeanCompound: number;
  chaldeanRoot: number;
  heartSoulMeaningHi: string;
  innerMotivationHi: string;
  emotionalPreferenceHi: string;
  standardExplanation: string;
}

export interface ConsonantPersonalityAnalysis {
  consonantsPresent: string[];
  consonantCount: number;
  chaldeanTotal: number;
  chaldeanCompound: number;
  chaldeanRoot: number;
  personalityMeaningHi: string;
  outerImpressionHi: string;
  socialDemeanorHi: string;
}

export interface RepeatedNameNumberPattern {
  number: number;
  count: number;
  letters: string[];
  influenceHi: string;
  positiveExpressionHi: string;
  possibleExcessHi: string;
  balancingSuggestionHi: string;
}

export interface NameDobCompatibility {
  nameRoot: number;
  nameCompound: number;
  mulank: number;
  bhagyank: number;
  status: 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';
  ratingLabel: string;
  mulankHarmonicsHi: string;
  bhagyankHarmonicsHi: string;
  loshuGridSynergyHi: string;
  comprehensiveReasonWhyHi: string;
}

export interface NameMobileCompatibility {
  nameRoot: number;
  nameCompound: number;
  mobileRoot: number;
  mobileCompound: number;
  mulank: number;
  bhagyank: number;
  status: 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';
  compatibilitySummaryHi: string;
  synergyDetailsHi: string;
}

export interface NameCorrectionSuggestion {
  currentName: string;
  currentChaldeanCompound: number;
  currentChaldeanRoot: number;
  suggestedName: string;
  suggestedChaldeanCompound: number;
  suggestedChaldeanRoot: number;
  differenceScore: string;
  mulankCompatibility: string;
  bhagyankCompatibility: string;
  benefitsDescriptionHi: string;
  standardDisclaimer: string;
}

export interface ChaldeanNameDetailedAnalysis {
  system: 'INDIAN_CHALDEAN';
  fullName: string;
  firstName: string;
  middleName?: string;
  surname: string;
  fullSum: number;
  compoundNumber: number;
  rootNumber: number;
  nameBreakdown: LetterBreakdownItem[];
  destinyExpressionNumber: number;
  destinyMeaningHi: string;
  talentNumber: number;
  talentMeaningHi: string;
  heartSoulNumber: number;
  personalityNumber: number;
  habitNumber: number;
  habitMeaningHi: string;
  compoundTitle: string;
  compoundInterpretationHi: string;
  rootInterpretationHi: string;
  careerSuggestions: {
    domainHi: string;
    favorableRoles: string[];
    traditionalFrameworkNote: string;
  };
  relationshipStyle: {
    communicationToneHi: string;
    emotionalExpressivenessHi: string;
    socialBehaviourHi: string;
  };
  luckyInfo: {
    luckyNumbers: number[];
    luckyColours: string[];
    supportiveDays: string[];
    professionThemes: string[];
    label: string;
  };
}

export interface PythagoreanNameDetailedAnalysis {
  system: 'WESTERN_PYTHAGOREAN';
  name: string;
  totalSum: number;
  compoundNumber: number;
  rootNumber: number;
  expressionNumber: number;
  masterNumber?: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  letterBreakdown: { letter: string; value: number }[];
  pythagoreanGrid: Record<number, number>; // 1-9 count in name
  repeatedNumbers: { digit: number; count: number }[];
  missingNumbers: number[]; // Karmic Lessons
  traditionalInterpretationHi: string;
  label: string;
}

export interface PronologyAnalysis {
  firstSound: string;
  vowelConsonantRatio: string;
  energyFlowHi: string;
  pronunciationQualityHi: string;
  phoneticVibrationHi: string;
}

export interface ComprehensiveNameAnalysis {
  fullName: string;
  firstName: string;
  middleName?: string;
  surname: string;
  chaldean: ChaldeanNameDetailedAnalysis;
  pythagorean: PythagoreanNameDetailedAnalysis;
  firstLetter: FirstLetterAnalysis;
  vowels: VowelHeartAnalysis;
  consonants: ConsonantPersonalityAnalysis;
  talent: { number: number; meaningHi: string };
  heart: { number: number; meaningHi: string };
  personality: { number: number; meaningHi: string };
  habit: { number: number; meaningHi: string };
  dobCompatibility: NameDobCompatibility;
  mobileCompatibility?: NameMobileCompatibility;
  repeatedNameNumbers: RepeatedNameNumberPattern[];
  pronology: PronologyAnalysis;
  recommendations: {
    spellingAssessmentHi: string;
    suggestedAdjustments: NameCorrectionSuggestion[];
    disclaimer: string;
  };
  comparison: {
    chaldeanRoot: number;
    pythagoreanRoot: number;
    differenceExplanationHi: string;
  };
  sourceTraceability: {
    sourceDocument: string;
    topic: string;
    methodology: string;
  };
}

// 3. First Letter Astrological & Vedic Character Database
const FIRST_LETTER_DATABASE: Record<string, {
  planet: string;
  meaning: string;
  personality: string;
  communication: string;
  career: string;
  element: string;
  sound: string;
}> = {
  A: {
    planet: 'Sun (सूर्य)',
    meaning: 'Pioneering Leader, Alpha energy, strong self-will',
    personality: 'आत्मविश्वासी, स्वतंत्र सोच और पहल करने वाले स्वभाव को दर्शाता है। किसी के अधीन काम करने में सहजता नहीं होती।',
    communication: 'प्रत्यक्ष, स्पष्ट और आदेशात्मक शैली। बात को बिना घुमाए सीधे रखना पसंद करते हैं।',
    career: 'नेतृत्व, व्यवसाय प्रशासन, सरकारी पद और स्वतंत्र उद्यमिता के लिए अत्यधिक अनुकूल।',
    element: 'Fire (अग्नि)',
    sound: 'Open, expressive vowel vibration'
  },
  B: {
    planet: 'Moon (चंद्र)',
    meaning: 'Emotional Harmony, Empathy, Sensitive Collaborator',
    personality: 'संवेदनशील, मिलनसार और भावनात्मक रूप से गहरे व्यक्ति। रिश्तों और शांति को प्राथमिकता देते हैं।',
    communication: 'विनम्र, सौम्य और दूसरों की भावनाओं का आदर करने वाली शैली।',
    career: 'कला, परामर्श, आतिथ्य (Hospitality), शिक्षण और जनसंपर्क।',
    element: 'Water (जल)',
    sound: 'Soft, grounded bilabial sound'
  },
  C: {
    planet: 'Jupiter (बृहस्पति)',
    meaning: 'Creative Expression, Wisdom, Optimism and Social warmth',
    personality: 'सकारात्मक सोच, बहुमुखी प्रतिभा और ज्ञान की गहरी जिज्ञासा। समाज में स्वतः लोकप्रियता पाते हैं।',
    communication: 'रोचक, ज्ञानवर्धक और उत्साहवर्धक वाणी। अपनी बातों से दूसरों को प्रेरित करते हैं।',
    career: 'मीडिया, लेखन, परामर्श, शिक्षण, डिजाइनिंग और कानूनी सलाह।',
    element: 'Ether (आकाश)',
    sound: 'Velar, crisp intellectual resonance'
  },
  D: {
    planet: 'Rahu (राहु) / Uranus',
    meaning: 'Practical Builder, Grounded, Methodical and Determined',
    personality: 'मेहनती, अनुशासित और व्यावहारिक दृष्टिकोण। कोई भी काम पूरी योजना और ठोस आधार के साथ करते हैं।',
    communication: 'तथ्यात्मक, स्पष्ट और काम की बात पर केंद्रित। अनावश्यक बातों से बचते हैं।',
    career: 'इंजीनियरिंग, वित्त, रियल एस्टेट, सिस्टम आर्किटेक्चर और प्रबंधन।',
    element: 'Earth (पृथ्वी)',
    sound: 'Dental, firm anchoring sound'
  },
  E: {
    planet: 'Mercury (बुध)',
    meaning: 'Versatile Communicator, Freedom Lover, Quick Thinker',
    personality: 'फुर्तीला दिमाग, परिवर्तनशील और नए विचारों को तुरंत अपनाने वाला स्वभाव। बोरियत से दूर भागते हैं।',
    communication: 'तेज, प्रभावी, तर्कसंगत और बहुआयामी बातचीत की कला में निपुण।',
    career: 'मार्केटिंग, सेल्स, टेक्नोलॉजी, मीडिया, यात्रा और ट्रेडिंग।',
    element: 'Air (वायु)',
    sound: 'High-frequency vibrant tone'
  },
  F: {
    planet: 'Saturn / Venus (शनि/शुक्र)',
    meaning: 'Responsible Caregiver, Nurturer, Moral Pillar',
    personality: 'जिम्मेदार, कर्तव्यनिष्ठ और परिवार व समाज की देखभाल में आगे रहने वाला चरित्र।',
    communication: 'शांत, मार्गदर्शक और भरोसेमंद अंदाज। लोग अपनी समस्याएं साझा करना पसंद करते हैं।',
    career: 'सामाजिक कार्य, स्वास्थ्य सेवा, शिक्षा, संस्थागत प्रशासन और संगीत।',
    element: 'Earth/Water (पृथ्वी-जल)',
    sound: 'Fricative, soothing breath sound'
  },
  G: {
    planet: 'Jupiter / Ketu (गुरु/केतु)',
    meaning: 'Mystic Thinker, Analytical Scholar, Deep Visionary',
    personality: 'गंभीर, शोधकर्ता प्रवृत्ति और आध्यात्मिक या तार्किक गहराई से भरे हुए। सतही बातों से दूर रहते हैं।',
    communication: 'कम बोलने वाले लेकिन सटीक और वजनी बातें रखने वाले।',
    career: 'रिसर्च, डेटा साइंस, आध्यात्म, दर्शनशास्त्र, कानून और रणनीति निर्माण।',
    element: 'Ether (आकाश)',
    sound: 'Deep guttural resonance'
  },
  H: {
    planet: 'Mercury / Saturn (बुध/शनि)',
    meaning: 'Ambitious Planner, Material Manifestor, Self-Disciplined',
    personality: 'ऊंचे लक्ष्य साधने वाले और व्यावहारिक रूप से धन व प्रतिष्ठा अर्जित करने के प्रति जागरूक।',
    communication: 'मापा-तुला, व्यावसायिक और गरिमापूर्ण संवाद।',
    career: 'बैंकिंग, रियल एस्टेट, उद्योग, कॉर्पोरेट लीडरशिप और निवेश प्रबंधन।',
    element: 'Earth (पृथ्वी)',
    sound: 'Aspirated breath-force tone'
  },
  I: {
    planet: 'Sun (सूर्य)',
    meaning: 'Idealistic, Pure Creative Fire, High Standards',
    personality: 'सिद्धांतवादी, मानवीय संवेदनाओं से युक्त और रचनात्मक कार्यों में विशिष्टता चाहने वाले।',
    communication: 'गंभीर, प्रभावशाली और सत्यनिष्ठ वाणी।',
    career: 'कला, साहित्य, मानवीय संगठन, उच्च अध्ययन और स्वतंत्र व्यवसाय।',
    element: 'Fire (अग्नि)',
    sound: 'High vowel clarity'
  },
  J: {
    planet: 'Sun (सूर्य)',
    meaning: 'Self-Starter, Resilient Pioneer, Determined Striver',
    personality: 'दृढ़ निश्चयी, किसी भी चुनौती से न घबराने वाले और अपना रास्ता खुद बनाने वाले।',
    communication: 'प्रेरणादायक, निर्णायक और आत्मविश्वास से भरपूर।',
    career: 'प्रबंधन, स्टार्टअप्स, खेल, रक्षा और प्रशासनिक नेतृत्व।',
    element: 'Fire (अग्नि)',
    sound: 'Dynamic plosive strike'
  },
  K: {
    planet: 'Moon / Mars (चंद्र/मंगल)',
    meaning: 'Intuitive Force, Charismatic, High Energy Dynamo',
    personality: 'तीव्र अंतर्ज्ञान और चुंबकीय व्यक्तित्व। अक्सर भीड़ में अलग पहचान बना लेते हैं।',
    communication: 'उत्तेजक, गहरी और भावनात्मक रूप से जोड़ने वाली शैली।',
    career: 'मनोरंजन, जनसंचार, ब्रांडिंग, खेल और मनोचिकित्सा।',
    element: 'Fire/Water (अग्नि-जल)',
    sound: 'Sharp explosive cadence'
  },
  L: {
    planet: 'Jupiter (बृहस्पति)',
    meaning: 'Loving, Intellectual, Artistic, Generous Mindset',
    personality: 'सहानुभूतिपूर्ण, सीखने के प्रति उत्सुक और सौंदर्य व नैतिकता के प्रति समर्पित।',
    communication: 'मधुर, तार्किक और सबको साथ लेकर चलने वाली शैली।',
    career: 'अध्यापन, कानून, प्रकाशन, डिजाइनिंग और सार्वजनिक सेवा।',
    element: 'Air/Ether (वायु-आकाश)',
    sound: 'Liquid flow vibration'
  },
  M: {
    planet: 'Rahu / Moon (राहु/चंद्र)',
    meaning: 'Practical Worker, Endurance, Grounded Builder',
    personality: 'कठिन परिश्रम करने वाले, सहनशील और परिवार के लिए मजबूत स्तंभ की तरह खड़े रहने वाले।',
    communication: 'सरल, व्यावहारिक और विश्वसनीय। कथनी से ज्यादा करनी पर विश्वास।',
    career: 'मैन्युफैक्चरिंग, कृषि, वित्त, निर्माण और लॉजिस्टिक्स।',
    element: 'Earth (पृथ्वी)',
    sound: 'Nasal grounding hum'
  },
  N: {
    planet: 'Mercury (बुध)',
    meaning: 'Intuitive Communicator, Adaptable, Creative Thinker',
    personality: 'कल्पनाशील, नए अनुभवों के खोजी और हर परिस्थिति में ढल जाने का हुनर रखने वाले।',
    communication: 'चतुर, वाकपटु और हास्य-व्यंग्य में निपुण।',
    career: 'पत्रकारिता, पीआर, ई-कॉमर्स, लेखन और संचार।',
    element: 'Air (वायु)',
    sound: 'Sonorant resonance'
  },
  O: {
    planet: 'Ketu / Venus (केतु/शुक्र)',
    meaning: 'Deep Heart, Family Centered, Protective & Loyal',
    personality: 'नैतिक मूल्यों के पक्के, पारिवारिक सुरक्षा को सर्वोपरि रखने वाले और निष्ठावान।',
    communication: 'स्नेहपूर्ण, गंभीर और विचारशील संवाद।',
    career: 'चिकित्सा, नर्सिंग, एनजीओ, आंतरिक सज्जा और शिक्षा।',
    element: 'Water (जल)',
    sound: 'Rounded full tone'
  },
  P: {
    planet: 'Saturn / Mars (शनि/मंगल)',
    meaning: 'Philosophical Mind, Focused Perfectionist, Dignified',
    personality: 'गंभीर अध्येता, एकांतप्रिय और अपने कार्य में सर्वोच्च गुणवत्ता चाहने वाले।',
    communication: 'शांत, बुद्धिमत्तापूर्ण और सटीक शब्दों का प्रयोग करने वाले।',
    career: 'शोध, साइंटिफिक राइटिंग, आर्किटेक्चर, साइकोलॉजी और उच्च परामर्श।',
    element: 'Air (वायु)',
    sound: 'Crisp labial stop'
  },
  Q: {
    planet: 'Sun / Rahu (सूर्य/राहु)',
    meaning: 'Unique Innovator, Unorthodox, Mystery & Wealth Magnet',
    personality: 'रहस्यमयी, लीक से हटकर सोचने वाले और अप्रत्याशित वित्तीय सफलता पाने वाले।',
    communication: 'प्रभावशाली, गहन और कभी-कभी गोपनीय।',
    career: 'गुप्त अन्वेषण, अनूठे व्यवसाय, ट्रेडिंग और नवोन्मेषी तकनीक।',
    element: 'Fire/Air (अग्नि-वायु)',
    sound: 'Complex velar burst'
  },
  R: {
    planet: 'Moon / Mars (चंद्र/मंगल)',
    meaning: 'Action-Oriented Humanitarian, Resilient Striver',
    personality: 'ऊर्जावान, दूसरों की मदद के लिए सदैव तत्पर और कठिन समय से तेजी से उबरने वाले।',
    communication: 'उत्साही, स्पष्टवादी और दिल की बात खुलकर कहने वाले।',
    career: 'समाज कल्याण, प्रबंधन, प्रेरक वक्ता और परामर्शदाता।',
    element: 'Fire (अग्नि)',
    sound: 'Trilled energetic pulse'
  },
  S: {
    planet: 'Jupiter / Sun (बृहस्पति/सूर्य)',
    meaning: 'Charismatic Starlight, Emotionally Deep, High Achiever',
    personality: 'आकर्षक, स्वाभिमानी, महत्वाकांक्षी और अपने क्षेत्र में चमकने की असीम चाहत रखने वाले।',
    communication: 'प्रभावशाली, भावना प्रधान और चुंबकीय वक्तृत्व कला।',
    career: 'कला, अभिनय, राजनीति, व्यवसाय प्रबंधन और रचनात्मक उद्योग।',
    element: 'Fire/Air (अग्नि-वायु)',
    sound: 'Sibilant continuous hiss'
  },
  T: {
    planet: 'Rahu (राहु)',
    meaning: 'Dynamic Striver, Rapid Executioner, High Tension Power',
    personality: 'सक्रिय, तीव्र गति से परिणाम चाहने वाले और बड़े संगठनात्मक कार्यों को संभालने वाले।',
    communication: 'सीधी, काम पर केंद्रित और तीव्र।',
    career: 'परियोजना प्रबंधन, आईटी, टेलीकॉम, ट्रांसपोर्ट और कूटनीति।',
    element: 'Air (वायु)',
    sound: 'Sharp dental strike'
  },
  U: {
    planet: 'Venus (शुक्र)',
    meaning: 'Lucky Receiver, Creative, Joyful, Artistic Grace',
    personality: 'भाग्यशाली, कला-प्रेमी, मिलनसार और जीवन का आनंद लेने की सहज इच्छा रखने वाले।',
    communication: 'मधुर, मनोरंजक और सुनने वालों को सहज महसूस कराने वाली शैली।',
    career: 'फैशन, इंटीरियर, फिल्म, संगीत और इवेंट मैनेजमेंट।',
    element: 'Water (जल)',
    sound: 'Deep vowel resonance'
  },
  V: {
    planet: 'Venus (शुक्र)',
    meaning: 'Master Builder of Wealth, Practical Visionary',
    personality: 'बड़ी योजनाओं को धरातल पर उतारने वाले, धैर्यवान और दीर्घकालिक समृद्धि के निर्माता।',
    communication: 'वजनी, आत्मविश्वास से भरी और अधिकारपूर्ण।',
    career: 'रियल एस्टेट, भारी उद्योग, बैंकिंग और बड़े व्यावसायिक प्रोजेक्ट्स।',
    element: 'Earth (पृथ्वी)',
    sound: 'Voiced fricative grounding'
  },
  W: {
    planet: 'Venus / Mercury (शुक्र/बुध)',
    meaning: 'Multi-Tasker, Dynamic Explorer, Social Catalyst',
    personality: 'सदा सक्रिय, यात्रा और बदलाव पसंद, लोगों को जोड़ने में माहिर।',
    communication: 'रोचक, बहुमुखी और हर वर्ग के व्यक्ति से तालमेल बिठाने वाली।',
    career: 'टूरिज्म, ग्लोबल बिजनेस, जनसंचार और आयात-निर्यात।',
    element: 'Air/Water (वायु-जल)',
    sound: 'Glide frequency flow'
  },
  X: {
    planet: 'Mercury / Ketu (बुध/केतु)',
    meaning: 'Multi-Talented, Rapid Adaptor, Secretive Intellect',
    personality: 'अनेक कलाओं में निपुण, त्वरित निर्णय क्षमता और अपने राज छुपाकर रखने वाले।',
    communication: 'तार्किक, गुप्त और बहुभाषी अनुकूलन।',
    career: 'कोडिंग, डेटा एनालिसिस, वित्तीय विश्लेषण और साइबर सुरक्षा।',
    element: 'Air (वायु)',
    sound: 'Dual sound click'
  },
  Y: {
    planet: 'Sun / Mercury (सूर्य/बुध)',
    meaning: 'Independent Mystic, Freedom Seeker, Discerning Mind',
    personality: 'एकांतप्रिय, गहरी परख रखने वाले और किसी के दबाव में न आने वाले व्यक्तित्व।',
    communication: 'चुनिंदा, सोच-समझकर और गहरा अर्थ रखने वाली बातचीत।',
    career: 'शोध, दर्शनशास्त्र, स्वतंत्र परामर्श, लेखन और कला।',
    element: 'Ether (आकाश)',
    sound: 'Semi-vocalic lift'
  },
  Z: {
    planet: 'Ketu / Saturn (केतु/शनि)',
    meaning: 'High Endurance, Optimistic Realist, Wisdom Master',
    personality: 'संघर्षों से सोना बनकर निखरने वाले, अनुभवी और गहरी सूझबूझ के धनी।',
    communication: 'शांत, व्यावहारिक और जीवन के गहरे अनुभवों से भरपूर।',
    career: 'प्रशासन, रणनीतिक सलाह, वित्तीय पुनर्निर्माण और न्याय।',
    element: 'Earth (पृथ्वी)',
    sound: 'Buzzing grounding resonance'
  }
};

/**
 * 4. Helper: Chaldean Sum & Breakdown Calculator
 */
export function calculateChaldeanBreakdown(str: string): {
  sum: number;
  compound: number;
  root: number;
  breakdown: LetterBreakdownItem[];
} {
  if (!str) return { sum: 0, compound: 0, root: 0, breakdown: [] };
  const clean = str.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  const breakdown: LetterBreakdownItem[] = [];

  for (let i = 0; i < clean.length; i++) {
    const letter = clean[i];
    const cVal = CHALDEAN_MAP[letter] || 0;
    const pVal = PYTHAGOREAN_MAP[letter] || 0;
    const isVowel = STANDARD_VOWELS.has(letter);
    const letterMeta = FIRST_LETTER_DATABASE[letter] || { planet: 'Mercury' };

    sum += cVal;
    breakdown.push({
      letter,
      chaldeanValue: cVal,
      pythagoreanValue: pVal,
      isVowel,
      planet: letterMeta.planet
    });
  }

  const compound = sum;
  const root = reduceToDigit(sum);
  return { sum, compound, root, breakdown };
}

/**
 * 5. Helper: Pythagorean Sum & Breakdown Calculator
 */
export function calculatePythagoreanBreakdown(str: string): {
  totalSum: number;
  compound: number;
  root: number;
  letterBreakdown: { letter: string; value: number }[];
  grid: Record<number, number>;
  vowelSum: number;
  consonantSum: number;
} {
  if (!str) {
    return {
      totalSum: 0,
      compound: 0,
      root: 0,
      letterBreakdown: [],
      grid: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
      vowelSum: 0,
      consonantSum: 0
    };
  }

  const clean = str.toUpperCase().replace(/[^A-Z]/g, '');
  let totalSum = 0;
  let vowelSum = 0;
  let consonantSum = 0;
  const letterBreakdown: { letter: string; value: number }[] = [];
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  for (let i = 0; i < clean.length; i++) {
    const letter = clean[i];
    const val = PYTHAGOREAN_MAP[letter] || 0;
    totalSum += val;
    letterBreakdown.push({ letter, value: val });
    if (val >= 1 && val <= 9) {
      grid[val] = (grid[val] || 0) + 1;
    }

    if (STANDARD_VOWELS.has(letter)) {
      vowelSum += val;
    } else {
      consonantSum += val;
    }
  }

  const compound = totalSum;
  const root = reduceToDigit(totalSum);
  return { totalSum, compound, root, letterBreakdown, grid, vowelSum, consonantSum };
}

/**
 * 6. Primary Master Name Analysis Function
 */
export function analyzeComprehensiveName(input: {
  name: string;
  dob?: string;
  mulank?: number;
  bhagyank?: number;
  mobile?: string;
  birthGrid?: Record<number, number>;
  enhancedGrid?: Record<number, number>;
}): ComprehensiveNameAnalysis {
  const rawName = (input.name || 'Vibrations Seeker').trim();
  const cleanName = rawName.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ');
  const nameParts = cleanName.split(' ');

  const firstName = nameParts[0] || 'Seeker';
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : undefined;
  const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const mulank = input.mulank || 1;
  const bhagyank = input.bhagyank || 1;

  // A. Chaldean Full Computation
  const fullChaldean = calculateChaldeanBreakdown(cleanName.replace(/\s/g, ''));
  const compoundDetails = getCompoundDetails(fullChaldean.compound);

  // Vowels and Consonants separation (Chaldean)
  const vowelLetters: string[] = [];
  const consonantLetters: string[] = [];
  let chaldeanVowelTotal = 0;
  let chaldeanConsonantTotal = 0;

  fullChaldean.breakdown.forEach(item => {
    if (item.isVowel) {
      vowelLetters.push(item.letter);
      chaldeanVowelTotal += item.chaldeanValue;
    } else {
      consonantLetters.push(item.letter);
      chaldeanConsonantTotal += item.chaldeanValue;
    }
  });

  const heartSoulRoot = reduceToDigit(chaldeanVowelTotal);
  const personalityRoot = reduceToDigit(chaldeanConsonantTotal);
  const talentNumber = reduceToDigit(mulank + fullChaldean.root);
  const cleanLettersCount = cleanName.replace(/\s/g, '').length;
  const habitNumber = reduceToDigit(cleanLettersCount);

  // First Letter Analysis
  const firstLetterChar = (cleanName[0] || 'A').toUpperCase();
  const firstLetterMeta = FIRST_LETTER_DATABASE[firstLetterChar] || FIRST_LETTER_DATABASE['A'];
  const firstLetterData: FirstLetterAnalysis = {
    letter: firstLetterChar,
    chaldeanValue: CHALDEAN_MAP[firstLetterChar] || 1,
    pythagoreanValue: PYTHAGOREAN_MAP[firstLetterChar] || 1,
    planet: firstLetterMeta.planet,
    traditionalMeaning: firstLetterMeta.meaning,
    personalityInfluenceHi: firstLetterMeta.personality,
    communicationInfluenceHi: firstLetterMeta.communication,
    careerInfluenceHi: firstLetterMeta.career,
    element: firstLetterMeta.element,
    soundVibration: firstLetterMeta.sound
  };

  // Vowel / Heart Analysis
  const heartMeanings: Record<number, string> = {
    1: 'स्वतंत्रता, स्वाभिमान और खुद के दम पर पहचान बनाने की गहरी आंतरिक इच्छा।',
    2: 'शांति, भावनात्मक सुरक्षा, प्रेम और सौहार्दपूर्ण वातावरण की चाह।',
    3: 'रचनात्मक अभिव्यक्ति, ज्ञान का विस्तार और समाज में सराहना पाने की आंतरिक प्रेरणा।',
    4: 'सुरक्षा, स्थिरता, सुव्यवस्थित जीवन और विश्वसनीय आधार बनाने की इच्छा।',
    5: 'रोमांच, व्यक्तिगत स्वतंत्रता, नए अनुभव और बंधनों से मुक्ति की गहरी प्यास।',
    6: 'परिवार की सेवा, सुंदर वातावरण, उत्तरदायित्व और अपनों को खुश रखने का भाव।',
    7: 'सत्य की खोज, बौद्धिक गहराई, एकांत चिंतन और आध्यात्मिक शांति की प्रेरणा।',
    8: 'भौतिक सफलता, अधिकार, व्यवस्था का निर्माण और बड़े पैमाने पर प्रभाव डालने की इच्छा।',
    9: 'सार्वभौमिक कल्याण, मानवता की सेवा और महान कार्यों को पूर्ण करने की भावना।'
  };

  const vowelsData: VowelHeartAnalysis = {
    vowelsPresent: vowelLetters,
    vowelCount: vowelLetters.length,
    chaldeanTotal: chaldeanVowelTotal,
    chaldeanCompound: chaldeanVowelTotal,
    chaldeanRoot: heartSoulRoot,
    heartSoulMeaningHi: heartMeanings[heartSoulRoot] || heartMeanings[1],
    innerMotivationHi: `यह व्यक्ति भीतर से अंक ${heartSoulRoot} की ऊर्जा से संचालित होता है, जो इन्हें आंतरिक संतोष प्रदान करता है।`,
    emotionalPreferenceHi: `भावनात्मक मामलों में यह ${heartSoulRoot === 2 || heartSoulRoot === 6 ? 'अत्यधिक संवेदनशील व सहयोगी' : heartSoulRoot === 1 || heartSoulRoot === 8 ? 'स्पष्ट व आत्मविश्वासी' : 'स्वतंत्र व तार्किक'} दृष्टिकोण रखते हैं।`,
    standardExplanation: 'Name ke vowels ko traditional numerology mein inner motivation/ emotional preference samajhne ke liye dekha jata hai.'
  };

  // Consonant / Personality Analysis
  const personalityMeanings: Record<number, string> = {
    1: 'बाहरी दुनिया में एक साहसी, आत्मनिर्भर और अधिकारपूर्ण व्यक्ति के रूप में देखे जाते हैं।',
    2: 'सहयोगी, शालीन और सहज रूप से लोगों से जुड़ने वाले सौम्य व्यक्तित्व की छाप छोड़ते हैं।',
    3: 'उत्साही, आकर्षक वक्ता और सकारात्मक ऊर्जा से भरपूर व्यक्ति के रूप में प्रभाव डालते हैं।',
    4: 'भरोसेमंद, अनुशासित, व्यावहारिक और जमीनी व्यक्ति के रूप में पहचाने जाते हैं।',
    5: 'स्मार्ट, मिलनसार, आधुनिक सोच वाले और आकर्षक बातचीत करने वाले के रूप में दिखते हैं।',
    6: 'आत्मीय, गरिमापूर्ण, सुरुचिपूर्ण और जिम्मेदार व्यक्तित्व का आभास देते हैं।',
    7: 'गंभीर, रहस्यमयी, दार्शनिक और ज्ञानी व्यक्ति के रूप में जाने जाते हैं।',
    8: 'सक्षम, प्रभावशाली, दृढ़ निश्चयी और नेतृत्व क्षमता से युक्त प्रतीत होते हैं।',
    9: 'उदार, साहसी, ऊर्जावान और मदद के लिए तत्पर व्यक्तित्व के रूप में उभरते हैं।'
  };

  const consonantsData: ConsonantPersonalityAnalysis = {
    consonantsPresent: consonantLetters,
    consonantCount: consonantLetters.length,
    chaldeanTotal: chaldeanConsonantTotal,
    chaldeanCompound: chaldeanConsonantTotal,
    chaldeanRoot: personalityRoot,
    personalityMeaningHi: personalityMeanings[personalityRoot] || personalityMeanings[1],
    outerImpressionHi: `अंक ${personalityRoot} के अनुसार लोग पहली मुलाकात में इन्हें एक सक्षम व संतुलित व्यक्ति मानते हैं।`,
    socialDemeanorHi: `सामाजिक संपर्क में अंक ${personalityRoot} की शैली के अनुरूप यह गरिमा और स्पष्टता बनाए रखते हैं।`
  };

  // Repeated numbers in Chaldean letter values
  const chaldeanValueCounts: Record<number, string[]> = {};
  fullChaldean.breakdown.forEach(item => {
    if (!chaldeanValueCounts[item.chaldeanValue]) chaldeanValueCounts[item.chaldeanValue] = [];
    chaldeanValueCounts[item.chaldeanValue].push(item.letter);
  });

  const repeatedPatterns: RepeatedNameNumberPattern[] = [];
  const numberRepetitionInfo: Record<number, { pos: string; excess: string; balance: string }> = {
    1: {
      pos: 'मजबूत आत्मबल, नेतृत्व और स्पष्ट दृष्टि।',
      excess: 'अहंकार, अति-स्वाभिमान या दूसरों की बात न सुनने की प्रवृत्ति।',
      balance: 'सूर्य को जल दें और दूसरों के सुझावों का सम्मान करें।'
    },
    2: {
      pos: 'गहरी संवेदनशीलता, कलात्मक समझ और सहयोग।',
      excess: 'मूड स्विंग्स, अत्यधिक भावनात्मक निर्भरता।',
      balance: 'चांदी का आभूषण पहनें और मेडिटेशन करें।'
    },
    3: {
      pos: 'विद्वत्ता, बेहतरीन संप्रेषण और रचनात्मकता।',
      excess: 'ऊर्जा का बिखराव, एक समय में कई काम शुरू कर देना।',
      balance: 'पीले रंग का उपयोग करें और कार्य प्राथमिकता तय करें।'
    },
    4: {
      pos: 'कठिन परिश्रम, संरचना और व्यावहारिक समझ।',
      excess: 'अचानक रुकावटें, जिद्दीपन या तनाव।',
      balance: 'शनिवार को जरूरतमंदों की सेवा करें और दिनचर्या व्यवस्थित रखें।'
    },
    5: {
      pos: 'तीव्र बुद्धि, अनुकूलनशीलता और व्यापारिक सोच।',
      excess: 'अस्थिरता, बेचैनी या जल्दबाजी में निर्णय।',
      balance: 'प्राणायाम करें और तुलसी के पौधे की सेवा करें।'
    },
    6: {
      pos: 'आकर्षण, सौंदर्यबोध और पारिवारिक प्रेम।',
      excess: 'अति-आरामपसंदगी या दिखावे पर अधिक व्यय।',
      balance: 'सफेद वस्त्रों का संतुलन रखें और सुगंधित इत्र का प्रयोग करें।'
    },
    7: {
      pos: 'गहरा अंतर्ज्ञान, विश्लेषणात्मक शक्ति और शोध क्षमता।',
      excess: 'अति-सोचना (Overthinking) या अकेलापन।',
      balance: 'आध्यात्मिक स्वाध्याय करें और प्रकृति के बीच समय बिताएं।'
    },
    8: {
      pos: 'दीर्घकालिक दृष्टि, संगठन क्षमता और न्यायप्रियता।',
      excess: 'कार्यों में अत्यधिक देरी या मानसिक दबाव।',
      balance: 'कर्मठ रहें, तिल के तेल का दीपक शनिवार को प्रज्वलित करें।'
    }
  };

  Object.entries(chaldeanValueCounts).forEach(([numStr, letters]) => {
    const num = parseInt(numStr, 10);
    if (letters.length >= 2) {
      const meta = numberRepetitionInfo[num] || {
        pos: 'संतुलित प्रभाव।',
        excess: 'ऊर्जा का अतिरेक।',
        balance: 'नियमित ध्यान करें।'
      };
      repeatedPatterns.push({
        number: num,
        count: letters.length,
        letters,
        influenceHi: `नाम में अंक ${num} के अक्षर (${letters.join(', ')}) ${letters.length} बार आए हैं।`,
        positiveExpressionHi: meta.pos,
        possibleExcessHi: meta.excess,
        balancingSuggestionHi: meta.balance
      });
    }
  });

  // Name + DOB Compatibility Check
  const friendlyCombos: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3, 5],
    3: [1, 2, 3, 5, 9],
    4: [1, 5, 6, 7, 8],
    5: [1, 2, 3, 5, 6, 8],
    6: [1, 5, 6, 7],
    7: [1, 4, 5, 6],
    8: [3, 5, 6],
    9: [1, 3, 5, 9]
  };

  const enemyCombos: Record<number, number[]> = {
    1: [6, 8],
    2: [8, 9],
    3: [6],
    4: [2, 4, 9],
    5: [],
    6: [1, 3, 9],
    7: [9],
    8: [1, 2, 4, 8, 9],
    9: [2, 6, 7, 8]
  };

  const nameRoot = fullChaldean.root;
  let dobStatus: 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION' = 'SUPPORTIVE';
  let ratingLabel = 'अत्यधिक अनुकूल (Highly Supportive)';
  let mulankHarmonics = '';
  let bhagyankHarmonics = '';
  let gridSynergy = '';
  let comprehensiveReason = '';

  const mulankFriends = friendlyCombos[mulank] || [1, 5];
  const mulankEnemies = enemyCombos[mulank] || [];
  const bhagyankFriends = friendlyCombos[bhagyank] || [1, 5];
  const bhagyankEnemies = enemyCombos[bhagyank] || [];

  const isMulankFriendly = mulankFriends.includes(nameRoot) || nameRoot === mulank;
  const isMulankHostile = mulankEnemies.includes(nameRoot);
  const isBhagyankFriendly = bhagyankFriends.includes(nameRoot) || nameRoot === bhagyank;
  const isBhagyankHostile = bhagyankEnemies.includes(nameRoot);

  if (isMulankFriendly && isBhagyankFriendly) {
    dobStatus = 'SUPPORTIVE';
    ratingLabel = 'अत्यधिक अनुकूल (Highly Supportive)';
    comprehensiveReason = `आपके नाम का Chaldean रूट अंक ${nameRoot} आपके मूलांक (${mulank}) और भाग्यांक (${bhagyank}) दोनों के साथ प्राकृतिक मित्रता रखता है। यह जीवन में अवसरों को सहज बनाने में मदद करता है।`;
  } else if (isMulankHostile || isBhagyankHostile) {
    dobStatus = 'NEEDS_ATTENTION';
    ratingLabel = 'ध्यान देने योग्य (Needs Attention)';
    comprehensiveReason = `आपके नाम का अंक ${nameRoot} आपके ${isMulankHostile ? `मूलांक ${mulank}` : `भाग्यांक ${bhagyank}`} के साथ कुछ विरोधाभासी ऊर्जा उत्पन्न कर सकता है, जिससे कभी-कभी प्रयासों के परिणाम में देरी महसूस हो सकती है।`;
  } else {
    dobStatus = 'NEUTRAL';
    ratingLabel = 'मध्यम / तटस्थ (Neutral Resonance)';
    comprehensiveReason = `नाम का अंक ${nameRoot} आपके जन्म अंकों के साथ सामान्य सामंजस्य में है। यह न तो रुकावट डालता है और न ही अत्यधिक तेजी देता है।`;
  }

  mulankHarmonics = isMulankFriendly
    ? `मूलांक ${mulank} के साथ नाम अंक ${nameRoot} का तालमेल उत्तम है। यह व्यक्तित्व में आत्मविश्वास भरता है।`
    : isMulankHostile
    ? `मूलांक ${mulank} और नाम अंक ${nameRoot} में थोड़ा मतभेद संभव है, जिसे संतुलित करना हितकर है।`
    : `मूलांक ${mulank} के साथ नाम अंक ${nameRoot} का प्रभाव तटस्थ है।`;

  bhagyankHarmonics = isBhagyankFriendly
    ? `भाग्यांक ${bhagyank} के साथ नाम अंक ${nameRoot} का मिलन भाग्य के द्वार खोलने में सहायक माना जाता है।`
    : isBhagyankHostile
    ? `भाग्यांक ${bhagyank} और नाम अंक ${nameRoot} के बीच घर्षण से बचने के लिए नाम में शुभ अक्षरों का जोड़ उपयोगी हो सकता है।`
    : `भाग्यांक ${bhagyank} के साथ यह संयोजन सामान्य प्रगति देता है।`;

  gridSynergy = input.enhancedGrid && input.enhancedGrid[nameRoot]
    ? `लो शू ग्रिड में अंक ${nameRoot} पहले से उपस्थित है, अतः नाम इसे अतिरिक्त बल प्रदान करता है।`
    : `लो शू ग्रिड में अंक ${nameRoot} की अनुपस्थिति को यह नाम अंक सुंदरता से संतुलित कर रहा है।`;

  const dobCompatibility: NameDobCompatibility = {
    nameRoot,
    nameCompound: fullChaldean.compound,
    mulank,
    bhagyank,
    status: dobStatus,
    ratingLabel,
    mulankHarmonicsHi: mulankHarmonics,
    bhagyankHarmonicsHi: bhagyankHarmonics,
    loshuGridSynergyHi: gridSynergy,
    comprehensiveReasonWhyHi: comprehensiveReason
  };

  // Name + Mobile Compatibility Check
  let mobileCompatibility: NameMobileCompatibility | undefined = undefined;
  if (input.mobile) {
    const cleanMob = input.mobile.replace(/[^0-9]/g, '');
    let mobCompound = 0;
    for (let i = 0; i < cleanMob.length; i++) mobCompound += parseInt(cleanMob[i], 10);
    const mobRoot = reduceToDigit(mobCompound);

    const isMobFriendly = (friendlyCombos[mobRoot] || []).includes(nameRoot) || mobRoot === nameRoot;
    const isMobHostile = (enemyCombos[mobRoot] || []).includes(nameRoot);

    const mobStatus: 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION' = isMobFriendly ? 'SUPPORTIVE' : isMobHostile ? 'NEEDS_ATTENTION' : 'NEUTRAL';

    mobileCompatibility = {
      nameRoot,
      nameCompound: fullChaldean.compound,
      mobileRoot: mobRoot,
      mobileCompound: mobCompound,
      mulank,
      bhagyank,
      status: mobStatus,
      compatibilitySummaryHi: isMobFriendly
        ? `मोबाइल कुल अंक ${mobRoot} (कंपाउंड ${mobCompound}) और नाम अंक ${nameRoot} के बीच उत्तम मित्रता है।`
        : isMobHostile
        ? `मोबाइल कुल अंक ${mobRoot} और नाम अंक ${nameRoot} में थोड़ा मतभेद देखा जा सकता है।`
        : `मोबाइल अंक ${mobRoot} और नाम अंक ${nameRoot} सामान्य ऊर्जा स्तर पर कार्य करते हैं।`,
      synergyDetailsHi: `पारंपरिक अंकज्योतिष में जब व्यक्ति का नाम और रोजमर्रा का मोबाइल नंबर एक ही ग्रहीय मित्र-वर्ग (Friendly Harmonic Class) में होते हैं, तो संचार और सौदों में अनुकूलता बढ़ती है।`
    };
  }

  // Name Correction Recommendations Module
  const currentCompound = fullChaldean.compound;
  const auspiciousCompounds = [19, 21, 23, 24, 27, 32, 33, 37, 41, 42, 45, 46, 50, 51, 55, 59, 60, 65, 73];
  const suggestedAdjustments: NameCorrectionSuggestion[] = [];

  // Generate 2-3 potential spelling adjustments if current compound is not in top auspicious list or needs enhancement
  const testModifications = [
    { suffix: 'A', addVal: 1, desc: 'एक अतिरिक्त "A" (सूर्य/1) जोड़कर' },
    { suffix: 'E', addVal: 5, desc: 'एक अतिरिक्त "E" (बुध/5) जोड़कर' },
    { suffix: 'I', addVal: 1, desc: 'एक अतिरिक्त "I" (सूर्य/1) जोड़कर' },
    { suffix: 'R', addVal: 2, desc: 'एक अतिरिक्त "R" (चंद्र/2) जोड़कर' }
  ];

  testModifications.forEach(mod => {
    const testCompound = currentCompound + mod.addVal;
    const testRoot = reduceToDigit(testCompound);
    const testName = `${firstName}${mod.suffix}${surname ? ' ' + surname : ''}`;

    if (auspiciousCompounds.includes(testCompound) || (friendlyCombos[mulank] || []).includes(testRoot)) {
      suggestedAdjustments.push({
        currentName: rawName,
        currentChaldeanCompound: currentCompound,
        currentChaldeanRoot: nameRoot,
        suggestedName: testName,
        suggestedChaldeanCompound: testCompound,
        suggestedChaldeanRoot: testRoot,
        differenceScore: `+${mod.addVal} Frequencies`,
        mulankCompatibility: (friendlyCombos[mulank] || []).includes(testRoot) ? 'उच्च अनुकूलता (95%)' : 'संतुलित (80%)',
        bhagyankCompatibility: (friendlyCombos[bhagyank] || []).includes(testRoot) ? 'उत्कृष्ट सामंजस्य (98%)' : 'मध्यम (75%)',
        benefitsDescriptionHi: `${mod.desc} कुल योग ${testCompound} (रूट ${testRoot}) बनता है, जो कि व्यापार, संचार और प्रतिष्ठा के लिए पारंपरिक रूप से अत्यंत शुभ माना गया है।`,
        standardDisclaimer: 'Traditional numerology ke according yeh combination zyada supportive mana ja sakta hai.'
      });
    }
  });

  // Pronology & Sound Vibration
  const vowelRatio = Math.round((vowelLetters.length / Math.max(1, cleanLettersCount)) * 100);
  const pronology: PronologyAnalysis = {
    firstSound: firstLetterChar,
    vowelConsonantRatio: `${vowelLetters.length} Vowels (${vowelRatio}%) / ${consonantLetters.length} Consonants`,
    energyFlowHi: vowelRatio >= 35 && vowelRatio <= 50
      ? 'नाम में स्वरों और व्यंजनों का संतुलन आदर्श है, जिससे उच्चारण में मधुरता और स्पष्ट प्रभाव उत्पन्न होता है।'
      : vowelRatio < 35
      ? 'नाम में व्यंजनों की अधिकता व्यावहारिक और ठोस ऊर्जा देती है, किंतु उच्चारण में सौम्यता बनाए रखने की आवश्यकता है।'
      : 'नाम में स्वरों की अधिकता भावनात्मक और रचनात्मक ऊर्जा का तेज प्रवाह दर्शाती है।',
    pronunciationQualityHi: `पहला अक्षर '${firstLetterChar}' (${firstLetterMeta.planet}) की ध्वनि के साथ शुरू होता है, जो श्रोताओं पर त्वरित प्रभाव छोड़ता है।`,
    phoneticVibrationHi: `Chaldean ध्वनिविज्ञान के आधार पर यह नाम ${fullChaldean.root <= 3 ? 'अग्नि व ज्ञान' : fullChaldean.root <= 6 ? 'व्यापार व आकर्षण' : 'अनुसंधान व कर्म'} की तरंगों को सक्रिय करता है।`
  };

  // Career Suggestions
  const careerThemesByRoot: Record<number, { domain: string; roles: string[]; note: string }> = {
    1: {
      domain: 'प्रशासन, उद्यमिता व उच्च प्रबंधन (Leadership & Executive)',
      roles: ['Chief Executive / Founder', 'सरकारी प्रशासनिक अधिकारी', 'राजनीतिक सलाहकार', 'स्वतंत्र व्यवसाय निदेशक'],
      note: 'Traditional numerology framework mein अंक 1 स्वतंत्र निर्णय और अधिकारपूर्ण भूमिकाओं में सर्वोत्तम प्रदर्शन देता है।'
    },
    2: {
      domain: 'परामर्श, कला, आतिथ्य व मध्यस्थता (Diplomacy & Creativity)',
      roles: ['कूटनीतिज्ञ (Diplomat)', 'मानव संसाधन (HR) निदेशक', 'मनोवैज्ञानिक / काउंसलर', 'लक्जरी ब्रांड सलाहकार'],
      note: 'Traditional numerology framework mein अंक 2 सहयोगात्मक और मानवीय संबंधों से जुड़े कार्यों में विशेष सफलता दिलाता है।'
    },
    3: {
      domain: 'शिक्षा, मीडिया, कानून व ज्ञान प्रसार (Advisory & Communications)',
      roles: ['प्रोफेसर / शिक्षक', 'कानूनी सलाहकार (Advocate)', 'लेखक / पत्रकार', 'आध्यात्मिक व वित्तीय वक्ता'],
      note: 'Traditional numerology framework mein अंक 3 गुरु बृहस्पति के प्रभाव से ज्ञान और संप्रेषण के क्षेत्रों में प्रतिष्ठा प्रदान करता है।'
    },
    4: {
      domain: 'इंजीनियरिंग, आईटी, आर्किटेक्चर व सिस्टम निर्माण (Technical & Structural)',
      roles: ['सॉफ्टवेयर आर्किटेक्ट', 'सिविल इंजीनियर', 'वित्तीय अंकेक्षक (Auditor)', 'परियोजना प्रबंधक'],
      note: 'Traditional numerology framework mein अंक 4 व्यावहारिक, तकनीकी और संरचनात्मक निर्माण में दृढ़ता देता है।'
    },
    5: {
      domain: 'मार्केटिंग, ट्रेडिंग, पब्लिक रिलेशंस व डिजिटल बिजनेस (Commerce & Versatility)',
      roles: ['मार्केटिंग प्रमुख', 'स्टॉक व कमोडिटी ट्रेडर', 'इन्वेस्टमेंट बैंकर', 'ट्रेवल / ई-कॉमर्स उद्यमी'],
      note: 'Traditional numerology framework mein अंक 5 तीव्र वाणिज्यिक बुद्धि और तेज बदलाव को भुनाने की क्षमता देता है।'
    },
    6: {
      domain: 'डिजाइन, ग्लैमर, आतिथ्य, रियल एस्टेट व उपचार (Luxury & Harmony)',
      roles: ['इंटीरियर डिजाइनर', 'फैशन / लक्जरी कंसलटेंट', 'हॉस्पिटैलिटी डायरेक्टर', 'वेलनेस व हीलिंग एक्सपर्ट'],
      note: 'Traditional numerology framework mein अंक 6 शुक्र के आशीर्वाद से सौंदर्य, आराम और सेवा उद्योग में उन्नति कराता है।'
    },
    7: {
      domain: 'रिसर्च, डेटा साइंस, आध्यात्म व अनुसंधान (Research & Occult)',
      roles: ['डेटा वैज्ञानिक / रिसर्च स्कॉलर', 'अंकशास्त्री / ज्योतिषी', 'साइबर एनालिस्ट', 'दार्शनिक / अन्वेषक'],
      note: 'Traditional numerology framework mein अंक 7 सतही बातों से परे जाकर गूढ़ तथ्यों को उजागर करने में अद्वितीय क्षमता देता है।'
    },
    8: {
      domain: 'कॉर्पोरेट मैनेजमेंट, भारी उद्योग, वित्त व कानून (Executive Authority & Law)',
      roles: ['प्रबंध निदेशक (MD)', 'रियल एस्टेट डेवलपर', 'वरिष्ठ न्यायाधीश / अधिवक्ता', 'फाइनेंशियल पोर्टफोलियो मैनेजर'],
      note: 'Traditional numerology framework mein अंक 8 शनि के प्रभाव से बड़े पैमाने पर संगठनात्मक व भौतिक प्रबंधन में शक्ति देता है।'
    },
    9: {
      domain: 'रक्षा, सुरक्षा, सर्जरी, खेल व सामाजिक नेतृत्व (Defense & Humanitarian)',
      roles: ['रक्षा अधिकारी (Defense/Police)', 'सर्जन / आपातकालीन चिकित्सक', 'खेल कोच / एथलीट', 'एनजीओ डायरेक्टर'],
      note: 'Traditional numerology framework mein अंक 9 मंगल के शौर्य और मानवतावादी दृष्टिकोण के साथ नेतृत्व प्रदान करता है।'
    }
  };

  const careerSuggestions = careerThemesByRoot[fullChaldean.root] || careerThemesByRoot[1];

  // Relationship Style
  const relationshipStylesByRoot: Record<number, { comm: string; emo: string; social: string }> = {
    1: {
      comm: 'प्रत्यक्ष, स्पष्टवादी और स्वाभिमानी शैली। साथी से सत्यनिष्ठा की अपेक्षा रखते हैं।',
      emo: 'अंदर से अत्यधिक समर्पित, किंतु अपनी भावनाएं प्रकट करने में संयम बरतते हैं।',
      social: 'आत्मविश्वासी और नेतृत्वकारी सामाजिक उपस्थिति।'
    },
    2: {
      comm: 'अत्यंत सौम्य, सहानुभूतिपूर्ण और सुनने की गहरी क्षमता रखने वाले।',
      emo: 'भावनात्मक सुरक्षा और निकटता को सर्वोपरि मानते हैं।',
      social: 'मिलनसार, शांतिदूत और सभी के साथ तालमेल बिठाने वाले।'
    },
    3: {
      comm: 'रोचक, ज्ञानवर्धक, हास्य-विनोद से भरपूर और जीवंत संवाद।',
      emo: 'उत्साही और खुले दिल से अपनी भावनाएं व्यक्त करने वाले।',
      social: 'समाज और मित्रों के बीच केंद्र बिंदु बने रहने वाले।'
    },
    4: {
      comm: 'तथ्यात्मक, व्यावहारिक और वादों को निभाने वाले।',
      emo: 'धीरे-धीरे भरोसा करने वाले लेकिन एक बार जुड़ने पर अटूट संबंध निभाने वाले।',
      social: 'चयनित और विश्वसनीय मित्रों का छोटा समूह पसंद करते हैं।'
    },
    5: {
      comm: 'वाकपटु, गतिशील, आधुनिक और प्रेरक बातचीत।',
      emo: 'संबंधों में घुटन नापसंद, स्वतंत्रता और व्यक्तिगत स्पेस की कद्र करते हैं।',
      social: 'अत्यंत लोकप्रिय, विशाल नेटवर्क और नए संपर्कों के प्रति उत्सुक।'
    },
    6: {
      comm: 'स्नेहपूर्ण, मार्गदर्शक और आत्मीयता से भरी शैली।',
      emo: 'परिवार और साथी की भलाई के लिए पूरी तरह समर्पित रहने वाले।',
      social: 'मेजबान के रूप में बेहतरीन, सुरुचिपूर्ण और प्रतिष्ठित।'
    },
    7: {
      comm: 'गंभीर, सोच-समझकर बोलने वाले और व्यर्थ बातचीत से दूर।',
      emo: 'आत्मिक और बौद्धिक स्तर पर जुड़ने वाले, अत्यधिक संवेदनशील।',
      social: 'एकांतप्रिय और केवल गहरे विचारों वाले लोगों से संपर्क रखने वाले।'
    },
    8: {
      comm: 'वजनी, स्पष्ट और भरोसेमंद। दिखावटी बातों से परहेज।',
      emo: 'शब्दों से ज्यादा कर्मों से प्रेम और सुरक्षा जताने वाले।',
      social: 'सम्मानजनक, गरिमापूर्ण और प्रभावशाली व्यक्तित्व।'
    },
    9: {
      comm: 'उत्साही, निडर और सच्चाई का पक्ष लेने वाले।',
      emo: 'उदार हृदय, क्षमाशील और बड़े पैमाने पर प्रेम बांटने वाले।',
      social: 'समाज सेवी, प्रेरक और अन्याय के खिलाफ खड़े होने वाले।'
    }
  };

  const relationshipStyle = relationshipStylesByRoot[fullChaldean.root] || relationshipStylesByRoot[1];

  // Lucky Info
  const luckyInfoByRoot: Record<number, { numbers: number[]; colours: string[]; days: string[]; themes: string[] }> = {
    1: { numbers: [1, 3, 5, 9], colours: ['सुनहरा (Gold)', 'पीला (Yellow)', 'नारंगी (Orange)'], days: ['रविवार (Sunday)', 'गुरुवार (Thursday)'], themes: ['लीडरशिप', 'प्रशासन', 'सरकारी अनुबंध', 'स्टार्टअप'] },
    2: { numbers: [1, 2, 3, 5], colours: ['सफेद (White)', 'क्रीम (Cream)', 'हल्का हरा (Light Green)'], days: ['सोमवार (Monday)', 'शुक्रवार (Friday)'], themes: ['काउंसलिंग', 'लक्जरी आतिथ्य', 'रचनात्मक कला', 'मानव संसाधन'] },
    3: { numbers: [1, 2, 3, 9], colours: ['पीला (Bright Yellow)', 'केसरिया (Saffron)', 'गुलाबी (Pink)'], days: ['गुरुवार (Thursday)', 'रविवार (Sunday)'], themes: ['अध्यापन', 'कानूनी सलाह', 'प्रकाशन', 'आध्यात्मिक मार्गदर्शन'] },
    4: { numbers: [1, 5, 6, 7], colours: ['नीला (Royal Blue)', 'खाकी (Khaki)', 'ग्रे (Grey)'], days: ['शनिवार (Saturday)', 'बुधवार (Wednesday)'], themes: ['आईटी इन्फ्रास्ट्रक्चर', 'सिविल प्रोजेक्ट्स', 'ऑडिटिंग', 'सिस्टम्स'] },
    5: { numbers: [1, 5, 6, 8], colours: ['हरा (Emerald Green)', 'हल्का फिरोजा (Turquoise)', 'सफेद (White)'], days: ['बुधवार (Wednesday)', 'शुक्रवार (Friday)'], themes: ['ट्रेडिंग', 'डिजिटल मार्केटिंग', 'मीडिया', 'ग्लोबल ई-कॉमर्स'] },
    6: { numbers: [5, 6, 7], colours: ['चमकीला सफेद (Diamond White)', 'हल्का नीला (Sky Blue)', 'गुलाबी (Rose Pink)'], days: ['शुक्रवार (Friday)', 'बुधवार (Wednesday)'], themes: ['डिजाइनिंग', 'फैशन', 'हॉस्पिटैलिटी', 'लक्जरी एस्टेट'] },
    7: { numbers: [1, 4, 5, 7], colours: ['हल्का पीला (Pale Yellow)', 'सफेद (White)', 'हल्का हरा (Light Green)'], days: ['गुरुवार (Thursday)', 'सोमवार (Monday)'], themes: ['अनुसंधान', 'डेटा एनालिसिस', 'आध्यात्म', 'उच्च परामर्श'] },
    8: { numbers: [3, 5, 6], colours: ['गहरा नीला (Dark Blue)', 'बैंगनी (Purple)', 'काला (Black - संयमित)'], days: ['शनिवार (Saturday)', 'शुक्रवार (Friday)'], themes: ['रियल एस्टेट', 'कॉर्पोरेट मैनेजमेंट', 'वित्तीय प्रबंधन', 'कानून'] },
    9: { numbers: [1, 3, 5, 9], colours: ['लाल (Ruby Red)', 'केसरिया (Saffron)', 'गुलाबी (Rose)'], days: ['मंगलवार (Tuesday)', 'रविवार (Sunday)'], themes: ['रक्षा सेवाएं', 'चिकित्सा/सर्जरी', 'खेल', 'सामाजिक आंदोलन'] }
  };

  const luckyInfo = {
    luckyNumbers: luckyInfoByRoot[fullChaldean.root]?.numbers || [1, 5],
    luckyColours: luckyInfoByRoot[fullChaldean.root]?.colours || ['सुनहरा', 'सफेद'],
    supportiveDays: luckyInfoByRoot[fullChaldean.root]?.days || ['रविवार', 'बुधवार'],
    professionThemes: luckyInfoByRoot[fullChaldean.root]?.themes || ['प्रशासन', 'व्यापार'],
    label: 'Traditional Numerology Suggestions'
  };

  // Chaldean Object Assembly
  const chaldeanAnalysis: ChaldeanNameDetailedAnalysis = {
    system: 'INDIAN_CHALDEAN',
    fullName: rawName,
    firstName,
    middleName,
    surname,
    fullSum: fullChaldean.sum,
    compoundNumber: fullChaldean.compound,
    rootNumber: fullChaldean.root,
    nameBreakdown: fullChaldean.breakdown,
    destinyExpressionNumber: fullChaldean.root,
    destinyMeaningHi: `नाम का भाग्य/अभिव्यक्ति अंक ${fullChaldean.root} है, जो इस बात का संकेत है कि जीवन में आपकी स्वाभाविक प्रतिभा किस दिशा में प्रकट होगी।`,
    talentNumber,
    talentMeaningHi: `मूलांक (${mulank}) और नाम रूट (${fullChaldean.root}) के संयोग से टैलेंट अंक ${talentNumber} बनता है, जो आपके जन्मजात कौशल को दर्शाता है।`,
    heartSoulNumber: heartSoulRoot,
    personalityNumber: personalityRoot,
    habitNumber,
    habitMeaningHi: `नाम में कुल ${cleanLettersCount} अक्षर हैं, जिनका रूट अंक ${habitNumber} है। यह आपकी दैनिक कार्यप्रणाली और आदतों को दर्शाता है।`,
    compoundTitle: compoundDetails.title,
    compoundInterpretationHi: compoundDetails.meaning,
    rootInterpretationHi: `रूट अंक ${fullChaldean.root} का आधिपत्य ${compoundDetails.ruler} के पास है।`,
    careerSuggestions: {
      domainHi: careerSuggestions.domain,
      favorableRoles: careerSuggestions.roles,
      traditionalFrameworkNote: careerSuggestions.note
    },
    relationshipStyle: {
      communicationToneHi: relationshipStyle.comm,
      emotionalExpressivenessHi: relationshipStyle.emo,
      socialBehaviourHi: relationshipStyle.social
    },
    luckyInfo
  };

  // B. Pythagorean Full Computation (Fully Separated)
  const fullPythagorean = calculatePythagoreanBreakdown(cleanName.replace(/\s/g, ''));
  const pythExpr = fullPythagorean.root;
  const pythMaster = reduceWithMaster(fullPythagorean.totalSum);
  const isMaster = [11, 22, 33].includes(pythMaster) ? pythMaster : undefined;

  const pythSoulUrge = reduceToDigit(fullPythagorean.vowelSum);
  const pythPersonality = reduceToDigit(fullPythagorean.consonantSum);

  const pythMissing: number[] = [];
  const pythRepeated: { digit: number; count: number }[] = [];
  for (let d = 1; d <= 9; d++) {
    const cnt = fullPythagorean.grid[d] || 0;
    if (cnt === 0) {
      pythMissing.push(d);
    } else if (cnt >= 2) {
      pythRepeated.push({ digit: d, count: cnt });
    }
  }

  const pythagoreanMeanings: Record<number, string> = {
    1: 'Pythagorean Expression 1: The Natural Leader & Pioneer. Originality, independent vision, and executive initiative.',
    2: 'Pythagorean Expression 2: The Diplomat & Peacemaker. Empathy, cooperation, bridge-building, and subtle persuasion.',
    3: 'Pythagorean Expression 3: The Creative Communicator & Optimist. Artistic talent, joy, verbal mastery, and inspiration.',
    4: 'Pythagorean Expression 4: The Master Builder & Systematizer. Discipline, order, durability, and practical loyalty.',
    5: 'Pythagorean Expression 5: The Free Spirit & Catalyst. Resourcefulness, adaptability, progressive change, and curiosity.',
    6: 'Pythagorean Expression 6: The Nurturer & Harmonizer. Responsibility, service, domestic elegance, and healing protection.',
    7: 'Pythagorean Expression 7: The Analytical Scholar & Seeker. Philosophical depth, research, intuition, and spiritual truth.',
    8: 'Pythagorean Expression 8: The Executive Authority & Manifestor. Big-picture vision, material stewardship, and legacy.',
    9: 'Pythagorean Expression 9: The Global Humanitarian. Universal compassion, completion of karmic cycles, and broad vision.'
  };

  const pythagoreanAnalysis: PythagoreanNameDetailedAnalysis = {
    system: 'WESTERN_PYTHAGOREAN',
    name: rawName,
    totalSum: fullPythagorean.totalSum,
    compoundNumber: fullPythagorean.compound,
    rootNumber: pythExpr,
    expressionNumber: pythExpr,
    masterNumber: isMaster,
    soulUrgeNumber: pythSoulUrge,
    personalityNumber: pythPersonality,
    letterBreakdown: fullPythagorean.letterBreakdown,
    pythagoreanGrid: fullPythagorean.grid,
    repeatedNumbers: pythRepeated,
    missingNumbers: pythMissing,
    traditionalInterpretationHi: pythagoreanMeanings[pythExpr] || pythagoreanMeanings[1],
    label: 'WESTERN / PYTHAGOREAN'
  };

  // C. Comparison & Differences
  const comparison = {
    chaldeanRoot: fullChaldean.root,
    pythagoreanRoot: pythExpr,
    differenceExplanationHi: 'दोनों systems की calculation अलग है, इसलिए दोनों numbers अलग आ सकते हैं। Chaldean प्रणाली प्राचीन ध्वनि तरंगों (Phonetics 1-8) पर आधारित है जबकि Pythagorean वर्णमाला के अनुक्रम (Alphabetical sequence 1-9) का अनुसरण करती है।'
  };

  return {
    fullName: rawName,
    firstName,
    middleName,
    surname,
    chaldean: chaldeanAnalysis,
    pythagorean: pythagoreanAnalysis,
    firstLetter: firstLetterData,
    vowels: vowelsData,
    consonants: consonantsData,
    talent: { number: talentNumber, meaningHi: chaldeanAnalysis.talentMeaningHi },
    heart: { number: heartSoulRoot, meaningHi: vowelsData.heartSoulMeaningHi },
    personality: { number: personalityRoot, meaningHi: consonantsData.personalityMeaningHi },
    habit: { number: habitNumber, meaningHi: chaldeanAnalysis.habitMeaningHi },
    dobCompatibility,
    mobileCompatibility,
    repeatedNameNumbers: repeatedPatterns,
    pronology,
    recommendations: {
      spellingAssessmentHi: `वर्तमान नाम का कुल Chaldean योग ${fullChaldean.compound} और रूट ${fullChaldean.root} है।`,
      suggestedAdjustments: suggestedAdjustments.slice(0, 3),
      disclaimer: 'Traditional numerology ke according yeh combination zyada supportive mana ja sakta hai.'
    },
    comparison,
    sourceTraceability: {
      sourceDocument: 'Cheiro Language of Numbers & Raajeev Singh Chauhann Vedic Compendium',
      topic: 'Name Vibrational Harmonics, Phonology & Cross-System Verification',
      methodology: 'Strict Dual Chaldean-Pythagorean Segregation Engine'
    }
  };
}
