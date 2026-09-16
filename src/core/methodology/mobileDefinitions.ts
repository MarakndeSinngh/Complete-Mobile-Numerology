import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface MobilePairRule {
  pair: string;
  meaning: string;
  positive: string;
  negative: string;
  career: string;
  wealth: string;
  relationship: string;
  healthCaution: string;
  area: 'Wealth' | 'Career' | 'Relationships' | 'Health' | 'Spiritual' | 'General';
  severity: number;
}

export interface MobilePositionalMeaning {
  position: number | string;
  name: string;
  domain: string;
  influence: string;
  guideline: string;
}

export interface MobileCompoundClassification {
  compound: number;
  root: number;
  title: string;
  rating: 'EXCELLENT' | 'GOOD' | 'OK' | 'CAN GO' | 'AVOID';
  meaning: string;
  suitability: string;
  caution: string;
}

export interface SpecialPurposeCombination {
  name: string;
  category: string;
  recommendedDigits: number[];
  recommendedPairs: string[];
  traditionalMeaning: string;
  suitability: string;
}

// 1. Positional Meanings as defined in LeoFamily Course Day 2
export const MOBILE_POSITIONS: Record<string, MobilePositionalMeaning> = {
  '1': {
    position: 1,
    name: 'Position 1 (Attitude / Initiative)',
    domain: 'Personal initiative, first impressions, self-assertion, starting energy',
    influence: 'Sets the foundational tone for how the user approaches opportunities and initiates projects.',
    guideline: 'Favorable digits: 1, 3, 5, 6. Digits requiring caution: 4, 8 (can cause initial delays or skepticism).'
  },
  '4': {
    position: 4,
    name: 'Position 4 (Partnership / Relationships)',
    domain: 'Business alliances, interpersonal cooperation, marital trust',
    influence: 'Influences how relationships and business partnerships develop and endure.',
    guideline: 'Harmonious digits: 2, 5, 6. Digits requiring caution: 9, 4 (may cause aggressive arguments or suspicion).'
  },
  '5': {
    position: 5,
    name: 'Position 5 (Children / Family / Domestic Harmony)',
    domain: 'Domestic peace, children welfare, family stability',
    influence: 'Reflects household happiness and support from family networks.',
    guideline: 'Favorable digits: 3, 5, 6. Digits requiring caution: 7, 8.'
  },
  '8': {
    position: 8,
    name: 'Position 8 (Career / Health Reflection)',
    domain: 'Sustained career growth, professional endurance, traditional wellness awareness',
    influence: 'Indicates capacity to handle sustained professional pressure. (Traditional numerological caution; not medical diagnosis).',
    guideline: 'Favorable digits: 1, 5, 6. Digits requiring caution: 4, 8, 2 (ensure balance in work routine).'
  },
  '9': {
    position: 9,
    name: 'Position 9 (Public Relations / Success Direction)',
    domain: 'Social standing, public image, societal networking',
    influence: 'Governs how the public perceives the user and their magnetic pull in the external world.',
    guideline: 'Favorable digits: 1, 3, 5, 9.'
  },
  '9_10': {
    position: '9+10',
    name: 'Positions 9 & 10 (Wealth / Net Gains / Culmination)',
    domain: 'Financial accumulation, final outcome of deals, savings retention',
    influence: 'The closing digits govern whether deals translate into retained net wealth or dissipate into leakage.',
    guideline: 'Highly auspicious ending pairs: 15, 51, 56, 65, 35, 53, 19. Avoid ending with 0, 4, 8, or 21.'
  }
};

// 2. Mobile Compound Classifications from Course Day 3
export const MOBILE_COMPOUND_DATABASE: Record<number, MobileCompoundClassification> = {
  10: {
    compound: 10,
    root: 1,
    title: 'The Wheel of Fortune (भाग्य चक्र)',
    rating: 'EXCELLENT',
    meaning: 'Symbol of honor, executive rise, fame, and rapid ascension in public standing.',
    suitability: 'Corporate directors, startup founders, political leaders, pioneers.',
    caution: 'Guard against overwhelming pride or authoritarian impulses.'
  },
  14: {
    compound: 14,
    root: 5,
    title: 'The Movement of Assets (स्थिरता योग)',
    rating: 'EXCELLENT',
    meaning: 'Highly progressive commercial vibration; excels in media, communication, and swift trading.',
    suitability: 'Business owners, stock traders, digital entrepreneurs, journalists.',
    caution: 'Avoid over-extending capital into simultaneous speculative trades.'
  },
  15: {
    compound: 15,
    root: 6,
    title: 'The Magician of Arts (आकर्षण कुलम)',
    rating: 'EXCELLENT',
    meaning: 'Magnetic physical and social appeal, luxury attraction, creative prosperity, and social warmth.',
    suitability: 'Luxury brands, artists, actors, hospitality leaders, counselors.',
    caution: 'Ensure discipline with spending on comforts.'
  },
  19: {
    compound: 19,
    root: 1,
    title: 'The Sovereign Sun (सूर्य प्रताप)',
    rating: 'EXCELLENT',
    meaning: 'Supreme success number, immense vitality, happiness, victory over competitors, and public dignity.',
    suitability: 'CEOs, civil administrators, competitive innovators, statesmen.',
    caution: 'Avoid impatience with colleagues who operate at slower speeds.'
  },
  23: {
    compound: 23,
    root: 5,
    title: 'The Royal Star of the Lion (सिंह चक्र)',
    rating: 'EXCELLENT',
    meaning: 'Promise of supreme success, high assistance from superiors, protection, and commercial triumph.',
    suitability: 'Trade tycoons, executive advisors, high-ranking diplomats, corporate leaders.',
    caution: 'None; one of the most auspicious compounds in Indian numerology.'
  },
  24: {
    compound: 24,
    root: 6,
    title: 'The Fortunate Alliance (सौभाग्य योग)',
    rating: 'EXCELLENT',
    meaning: 'Assistance from people of high rank, lasting marital happiness, luxury, and smooth financial flow.',
    suitability: 'Hospitality, design, family businesses, creative agencies.',
    caution: 'Guard against complacency.'
  },
  27: {
    compound: 27,
    root: 9,
    title: 'The Scepter of Power (शक्ति दंड योग)',
    rating: 'EXCELLENT',
    meaning: 'High authority, courageous leadership, commanding intellect, and humanitarian prominence.',
    suitability: 'Defense leadership, senior executives, high court judges, surgeons.',
    caution: 'Keep temper under control in interpersonal matters.'
  },
  32: {
    compound: 32,
    root: 5,
    title: 'The Magnetic Communicator (वाक् सिद्धि योग)',
    rating: 'EXCELLENT',
    meaning: 'Great popularity, magnetic speaking ability, connection with large public crowds, business agility.',
    suitability: 'Public speakers, media anchors, commercial negotiators, marketers.',
    caution: 'Stay honest to avoid reputational backlash.'
  },
  33: {
    compound: 33,
    root: 6,
    title: 'The Master Healer & Teacher (गुरु-शुक्र संगम योग)',
    rating: 'EXCELLENT',
    meaning: 'Combines supreme wisdom of Jupiter with loving grace of Venus; high spiritual and material honor.',
    suitability: 'Spiritual mentors, educators, philanthropists, medical consultants.',
    caution: 'Protect personal vitality from emotional exhaustion.'
  },
  37: {
    compound: 37,
    root: 1,
    title: 'The Auspicious Friendship (मित्र लाभ योग)',
    rating: 'EXCELLENT',
    meaning: 'Strong partnerships, public affection, success in love, and prosperous collaborations.',
    suitability: 'Partnership businesses, creative alliances, diplomatic ambassadors.',
    caution: 'Ensure clear contractual terms in all business.'
  },
  41: {
    compound: 41,
    root: 5,
    title: 'The Sovereign Intelligence (प्रज्ञा चक्र)',
    rating: 'EXCELLENT',
    meaning: 'Brilliant intellectual agility, rapid business breakthroughs, high administrative command.',
    suitability: 'Tech enterprise, media networks, financial analytics, consulting.',
    caution: 'Avoid mental restlessness.'
  },
  42: {
    compound: 42,
    root: 6,
    title: 'The Harmonious Home (गृह सुख योग)',
    rating: 'EXCELLENT',
    meaning: 'Domestic peace, steady wealth, supportive friendships, and refined luxury.',
    suitability: 'Family commerce, real estate, hospitality, retail management.',
    caution: 'Avoid procrastination in legal paperwork.'
  },
  45: {
    compound: 45,
    root: 9,
    title: 'The Victorious General (विजय योग)',
    rating: 'EXCELLENT',
    meaning: 'Triumph over competition, great stamina, strategic mastery, and public honors.',
    suitability: 'Litigation, defense, high-stakes corporate turnarounds, civil projects.',
    caution: 'Manage stress and ensure balanced rest.'
  },
  46: {
    compound: 46,
    root: 1,
    title: 'The Crowned Merchant (वैभव चक्र)',
    rating: 'EXCELLENT',
    meaning: 'Commercial wealth, aesthetic refinement, social popularity, and executive respect.',
    suitability: 'Global trade, lifestyle brands, film and media empires.',
    caution: 'Guard against over-indulgent lifestyle expenditures.'
  },

  // Can Go / OK / Avoid Compounds
  16: {
    compound: 16,
    root: 7,
    title: 'The Shattered Citadel (पतन चक्र)',
    rating: 'AVOID',
    meaning: 'Traditional warning of sudden disruptions, vulnerability to accidents or pride collapses.',
    suitability: 'Esoteric recluses or occult researchers; not recommended for active business.',
    caution: 'Traditional numerological caution: protect stored capital; maintain humility.'
  },
  18: {
    compound: 18,
    root: 9,
    title: 'The Internal Conflict (अंतर्द्वंद योग)',
    rating: 'AVOID',
    meaning: 'Vibrations of fierce friction, disputes, family misunderstandings, and emotional storms.',
    suitability: 'Defense personnel or emergency surgeons; avoid for ordinary commerce.',
    caution: 'Avoid aggressive arguments; practice emotional de-escalation.'
  },
  28: {
    compound: 28,
    root: 1,
    title: 'The Trusting Soul (विश्वासघात योग)',
    rating: 'AVOID',
    meaning: 'Warns of severe financial leakage, trusting unworthy associates, and litigation.',
    suitability: 'Requires extreme legal oversight.',
    caution: 'Never sign blank documents; avoid unsecured personal loans.'
  },
  29: {
    compound: 29,
    root: 2,
    title: 'The Uncertainty Wave (अनिश्चितता योग)',
    rating: 'AVOID',
    meaning: 'Severe emotional anxiety, recurring self-doubt, deception from partners.',
    suitability: 'Unfavorable for primary business contact lines.',
    caution: 'Guard mental wellness; drink water from silver tumbler.'
  },
  38: {
    compound: 38,
    root: 2,
    title: 'The Hidden Opposition (गुप्त विरोध योग)',
    rating: 'AVOID',
    meaning: 'Friction in joint ventures, suspicion, secret rivalries.',
    suitability: 'Unfavorable for partnership businesses.',
    caution: 'Maintain absolute transparency in corporate transactions.'
  },
  44: {
    compound: 44,
    root: 8,
    title: 'The Double Weight (भारी भार योग)',
    rating: 'AVOID',
    meaning: 'Double Rahu (44) reducing to 8; immense struggle, delays, and heavy mental pressure.',
    suitability: 'Sluggish for fast-turnaround businesses.',
    caution: 'Light mustard oil lamp on Saturdays; practice grounding.'
  }
};

// 3. Special Purpose Number Combinations from Course Day 4
export const SPECIAL_PURPOSE_COMBINATIONS: SpecialPurposeCombination[] = [
  {
    name: 'Wealth Attraction & Fluid Capital',
    category: 'Wealth',
    recommendedDigits: [5, 6, 1],
    recommendedPairs: ['15', '51', '56', '65', '19', '32'],
    traditionalMeaning: 'Activates Mercury-Venus commercial and luxury attraction. Enhances customer retention and profit margins.',
    suitability: 'Traders, e-commerce, business founders, independent consultants.'
  },
  {
    name: 'Property & Real Estate Acquisition',
    category: 'Property',
    recommendedDigits: [2, 5, 8],
    recommendedPairs: ['28', '82', '58', '85', '25', '52'],
    traditionalMeaning: 'Resonates with the Earth element (Lo Shu 2-5-8 Silver Yog). Enhances patience and physical asset ownership.',
    suitability: 'Real estate brokers, land investors, civil builders.'
  },
  {
    name: 'Government Job & Public Prestige',
    category: 'Career',
    recommendedDigits: [1, 3, 9],
    recommendedPairs: ['13', '31', '19', '91', '15'],
    traditionalMeaning: 'Sun-Jupiter-Mars resonance conferring administrative dignity, civil examination success, and societal honor.',
    suitability: 'Civil service aspirants, defense officers, institutional administrators.'
  },
  {
    name: 'Peace of Mind & Holistic Wellness',
    category: 'Wellness',
    recommendedDigits: [2, 3, 7],
    recommendedPairs: ['23', '32', '37', '73', '57'],
    traditionalMeaning: 'Soothes nervous tension and calms hyperactive thoughts. (Traditional wellness reflection only).',
    suitability: 'Meditators, counselors, researchers, teachers.'
  },
  {
    name: 'Promotion & Corporate Career Rise',
    category: 'Career',
    recommendedDigits: [1, 5, 6],
    recommendedPairs: ['14', '15', '17', '23', '37'],
    traditionalMeaning: 'Enhances executive visibility, favorable attention from superiors, and negotiation leverage.',
    suitability: 'Corporate executives, managerial leads, banking personnel.'
  },
  {
    name: 'Will Power & Crisis Turnaround',
    category: 'Personal Power',
    recommendedDigits: [9, 5, 1],
    recommendedPairs: ['19', '91', '95', '59'],
    traditionalMeaning: 'Activates the central Will column. Gives mental grit and refusal to give up under adversity.',
    suitability: 'Entrepreneurs in turnaround phase, athletes, litigators.'
  },
  {
    name: 'Court & Legal Relief',
    category: 'Legal',
    recommendedDigits: [3, 8],
    recommendedPairs: ['38', '83', '17', '71', '45'],
    traditionalMeaning: 'Saturn-Jupiter judicial equilibrium. Assists in bringing fair resolution to protracted disputes.',
    suitability: 'Individuals managing complex legal negotiations or arbitration.'
  },
  {
    name: 'Business Growth & International Expansion',
    category: 'Business',
    recommendedDigits: [5, 6],
    recommendedPairs: ['56', '65', '23', '32', '46'],
    traditionalMeaning: 'Expanding customer networks, smooth logistics, and high brand reputation.',
    suitability: 'Global traders, digital agency owners, franchise builders.'
  },
  {
    name: 'Political Power & Social Leadership',
    category: 'Leadership',
    recommendedDigits: [1, 4, 9],
    recommendedPairs: ['19', '91', '14', '41', '27'],
    traditionalMeaning: 'Sun-Rahu-Mars dynamic commanding mass public appeal, bold strategy, and high stakes.',
    suitability: 'Political candidates, union leaders, large community organizers.'
  }
];

// Helper: Zero-Replacement Transformation (Exact LeoFamily Course PDF Day 1 Rule)
export function applyZeroReplacement(mobileDigits: string): string {
  if (!mobileDigits || mobileDigits.length === 0) return '';
  const chars = mobileDigits.split('');
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === '0') {
      chars[i] = chars[i - 1];
    }
  }
  return chars.join('');
}

// Register mobile definitions in methodology registry
methodologyRegistry.registerRule({
  id: 'MOBILE_ZERO_REPLACEMENT_RULE',
  category: 'MOBILE',
  ruleName: 'LeoFamily Zero-Replacement Analytical Transformation',
  system: 'LEOFAMILY',
  source: SOURCES.LEOFAMILY_MOBILE_PDF_D1,
  description: 'In mobile numbers with zeros, replace each zero with the preceding digit for modified positional analysis.',
  interpretation: 'Reveals hidden underlying frequency currents while preserving the original number for baseline records.',
  confidence: 100,
  safetyLevel: 'SAFE'
});
