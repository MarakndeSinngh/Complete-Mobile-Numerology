/**
 * LEOFAMILY NUMEROLOGY METHODOLOGY CONFIGURATION
 * Single Authoritative Source of Truth for Platform Constants
 */

// Phase 4: Standard Lo Shu Matrix Positions
// 4 9 2
// 3 5 7
// 8 1 6
export const LOSHU_POSITIONS = {
  4: { row: 1, col: 1, element: 'Wood', direction: 'South-East', domain: 'Wealth & Assets' },
  9: { row: 1, col: 2, element: 'Fire', direction: 'South', domain: 'Fame & Reputation' },
  2: { row: 1, col: 3, element: 'Earth', direction: 'South-West', domain: 'Marriage & Relationship' },
  3: { row: 2, col: 1, element: 'Wood', direction: 'East', domain: 'Health & Family' },
  5: { row: 2, col: 2, element: 'Earth', direction: 'Center', domain: 'Stability & Balance' },
  7: { row: 2, col: 3, element: 'Metal', direction: 'West', domain: 'Children & Creativity' },
  8: { row: 3, col: 1, element: 'Earth', direction: 'North-East', domain: 'Knowledge & Intuition' },
  1: { row: 3, col: 2, element: 'Water', direction: 'North', domain: 'Career & Life Path' },
  6: { row: 3, col: 3, element: 'Metal', direction: 'North-West', domain: 'Helpful Friends & Travel' }
} as const;

export type LoshuDigit = keyof typeof LOSHU_POSITIONS;

// Standard Grahas (Planets) Mapping in Indian Numerology
export const GRAHA_MAPPING: Record<number, {
  nameEn: string;
  nameHi: string;
  deity: string;
  element: string;
  day: string;
  color: string;
  gemstone: string;
  mantra: string;
}> = {
  1: {
    nameEn: 'Sun',
    nameHi: 'Surya (सूर्य)',
    deity: 'Surya Deva',
    element: 'Fire',
    day: 'Sunday',
    color: 'Gold / Orange / Ruby Red',
    gemstone: 'Ruby (Manik)',
    mantra: 'OM SURYAYA NAMAH'
  },
  2: {
    nameEn: 'Moon',
    nameHi: 'Chandra (चन्द्र)',
    deity: 'Chandra Deva',
    element: 'Water',
    day: 'Monday',
    color: 'White / Silver / Cream',
    gemstone: 'Pearl (Moti)',
    mantra: 'OM CHANDRAYA NAMAH'
  },
  3: {
    nameEn: 'Jupiter',
    nameHi: 'Guru (बृहस्पति / गुरु)',
    deity: 'Brihaspati Deva',
    element: 'Ether / Fire',
    day: 'Thursday',
    color: 'Yellow / Saffron',
    gemstone: 'Yellow Sapphire (Pukhraj)',
    mantra: 'OM GUM GURAVE NAMAH'
  },
  4: {
    nameEn: 'Rahu',
    nameHi: 'Rahu (राहू - Shadow Planet)',
    deity: 'Rahu Deva',
    element: 'Air / Electricity',
    day: 'Saturday',
    color: 'Smoky Grey / Blue',
    gemstone: 'Hessonite (Gomed)',
    mantra: 'OM RAHAVE NAMAH'
  },
  5: {
    nameEn: 'Mercury',
    nameHi: 'Budha (बुध)',
    deity: 'Budha Deva',
    element: 'Earth',
    day: 'Wednesday',
    color: 'Emerald Green',
    gemstone: 'Emerald (Panna)',
    mantra: 'OM BUDHAYA NAMAH'
  },
  6: {
    nameEn: 'Venus',
    nameHi: 'Shukra (शुक्र)',
    deity: 'Shukra Deva',
    element: 'Water / Metal',
    day: 'Friday',
    color: 'Diamond White / Soft Pink',
    gemstone: 'Diamond (Heera) / Opal',
    mantra: 'OM SHUKRAYA NAMAH'
  },
  7: {
    nameEn: 'Ketu',
    nameHi: 'Ketu (केतु - Shadow Planet)',
    deity: 'Ketu Deva / Lord Ganesha',
    element: 'Metal / Fire',
    day: 'Tuesday',
    color: 'Spotted / Multicolor / Light Grey',
    gemstone: "Cat's Eye (Lehsuniya)",
    mantra: 'OM KETAVE NAMAH'
  },
  8: {
    nameEn: 'Saturn',
    nameHi: 'Shani (शनि)',
    deity: 'Shani Deva',
    element: 'Earth / Air',
    day: 'Saturday',
    color: 'Dark Blue / Black / Charcoal',
    gemstone: 'Blue Sapphire (Neelam)',
    mantra: 'OM SHAM SHANAISCHARAYA NAMAH'
  },
  9: {
    nameEn: 'Mars',
    nameHi: 'Mangal (मंगल)',
    deity: 'Mangala Deva / Lord Hanuman',
    element: 'Fire',
    day: 'Tuesday',
    color: 'Bright Red / Coral',
    gemstone: 'Red Coral (Moonga)',
    mantra: 'OM MANGALAYA NAMAH'
  }
};

// Phase 8: Repetition Level Classifications
export const REPETITION_LEVELS = {
  0: 'Missing',
  1: 'Present',
  2: 'Reinforced',
  3: 'Strongly Reinforced',
  4: 'Highly Dominant'
} as const;

// Phase 17: Mandatory Medical Numerology Disclaimer
export const MEDICAL_NUMEROLOGY_DISCLAIMER =
  "IMPORTANT: This is a traditional numerology interpretation for reflection and wellness awareness only. It is not a medical diagnosis, medical treatment, or substitute for professional healthcare.";

// Platform Methodology Identity
export const LEOFAMILY_METHODOLOGY_VERSION = "3.5.0 (LeoFamily Indian Numerology Architecture)";
