/**
 * LEOFAMILY KNOWLEDGE SOURCE REGISTRY
 * 
 * Hierarchy:
 * LEVEL A: LeoFamily approved methodology
 * LEVEL B: Explicit rules contained in supplied LeoFamily/Raajeev Singh Chauhann course/reference PDFs
 * LEVEL C: General Indian numerology conventions
 * LEVEL D: External reference material
 */

export type KnowledgeLevel = 'LEVEL_A' | 'LEVEL_B' | 'LEVEL_C' | 'LEVEL_D';

export interface SourceCitation {
  sourceDocument: string;
  author?: string;
  page?: number | string;
  topic: string;
  rule: string;
  level: KnowledgeLevel;
}

export const SOURCES: Record<string, SourceCitation> = {
  LEOFAMILY_CORE: {
    sourceDocument: 'LeoFamily Official Numerology Manual v3.5',
    author: 'LeoFamily / Raajeev Singh Chauhann',
    topic: 'Core Architecture and Calculations',
    rule: 'Deterministic Mulank, Bhagyank, and 3-Layer Enhanced Lo Shu Grid',
    level: 'LEVEL_A'
  },
  LEOFAMILY_LOSHU_PDF: {
    sourceDocument: 'Loshu Grdi(1).pdf',
    author: 'LeoFamily / Raajeev Singh Chauhann',
    topic: 'Master Lo Shu Grid Blueprint, 81 Combinations, 12 Arrows, Psychological Profiling, Karmic Lessons & 90-Day Remedial Altar',
    rule: 'Complete Lo Shu Master Report Analysis, 81 Combinations, Karmic Lessons, 12 Arrows, Generational Karma, Numero Vastu, and 90-Day Remedial Action Plan',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MOBILE_PDF_D1: {
    sourceDocument: 'LeoFamily Mobile Numerology Course — Day 1',
    author: 'Raajeev Singh Chauhann',
    page: 12,
    topic: '10-Digit Mobile Compound Sum & Zero-Replacement Transformation',
    rule: 'Sum 10 digits without country code; replace each 0 with previous digit for modified analysis',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MOBILE_PDF_D2: {
    sourceDocument: 'LeoFamily Mobile Numerology Course — Day 2',
    author: 'Raajeev Singh Chauhann',
    page: 18,
    topic: 'Adjacent 2-Digit Mobile Pair Matrix & Positional Roles',
    rule: 'Positional influences: 1 (Attitude), 4 (Partnership), 5 (Children), 8 (Career/Health), 9 (PR), 9+10 (Wealth)',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MOBILE_PDF_D3: {
    sourceDocument: 'LeoFamily Mobile Numerology Course — Day 3',
    author: 'Raajeev Singh Chauhann',
    page: 24,
    topic: 'Mobile Compound Number Classifications & Repetitions',
    rule: 'Classify compounds into Excellent, Good, OK, Can Go, Avoid; repetitiveness cautions',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MOBILE_PDF_D4: {
    sourceDocument: 'LeoFamily Mobile Numerology Course — Day 4',
    author: 'Raajeev Singh Chauhann',
    page: 31,
    topic: 'Special Purpose Number Combinations & Pairing Remedies',
    rule: 'Targeted combinations for Wealth, Health, Property, Promotion, Court, Govt Job, Politics',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MEDICAL_NUMEROLOGY_PDF: {
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    author: 'Raajeev Singh Chauhann',
    page: 1,
    topic: 'Ayurvedic Tridosha, Planetary Resonances & Vedic Mahadasha Calculation',
    rule: 'Ayurvedic Doshas (Pitta, Kapha, Vata), Body Parts, Planetary Diseases, and Mulank-based Vedic Mahadasha progression',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MEDICAL_NUMEROLOGY_D1_PDF: {
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    author: 'Raajeev Singh Chauhann',
    page: 1,
    topic: 'Ayurveda Tridosha, Single/Bi/Tri-Doshic Analysis, Body Parts, Diseases & Vedic Mahadasha Grid Calculation',
    rule: 'Number 1-9 Dosha mapping (1 Pitta, 2 Kapha, 3 Kapha, 4 Vata, 5 Vata, 6 Kapha, 7 Kapha, 8 Vata, 9 Pitta); Vedic 3x3 Grid [3,1,9][6,7,5][2,8,4]; Mahadasha sequence from Mulank',
    level: 'LEVEL_B'
  },
  LEOFAMILY_MEDICAL_NUMEROLOGY_D2_PDF: {
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    author: 'Raajeev Singh Chauhann',
    page: 1,
    topic: 'Day Lord Mapping, Dasha of Day Formula, Dasha Start-Date Rule, Remedies Diet Plan & Vedic Remedies',
    rule: 'Day Lord (Sun 1, Mon 2, Tue 9, Wed 5, Thu 3, Fri 6, Sat 8); Dasha formula: Day + Month + Year + Day Lord; Birthday Anniversary rule; Diet plans & Good karma remedies for 1-9',
    level: 'LEVEL_B'
  },
  LEOFAMILY_NUMERO_VASTU_PDF: {
    sourceDocument: 'LeoFamily Numero Vastu & Directional Balance Reference',
    author: 'Raajeev Singh Chauhann',
    page: 5,
    topic: 'Directional Elemental Alignment & Residential Number Harmony',
    rule: 'Align house/flat compound and root numbers with 8 cardinal directions and central Brahma sthan',
    level: 'LEVEL_B'
  },
  INDIAN_CLASSICAL_VEDIC: {
    sourceDocument: 'Classical Indian Vedic Astro-Numerology Traditions',
    topic: 'Graha Rulerships, Mahadasha, and Birthday Anniversary Dasha Transitions',
    rule: 'Nine grahas (Surya, Chandra, Guru, Rahu, Budha, Shukra, Ketu, Shani, Mangal)',
    level: 'LEVEL_C'
  },
  CHALDEAN_CHEYRO: {
    sourceDocument: 'Chaldean Sound Vibration & Compound Symbolism',
    topic: 'Numbers 10-52 Archetypes and Letter Values 1-8 (9 sacred)',
    rule: 'Phonetic vibration calculations with compound interpretations',
    level: 'LEVEL_D'
  },
  PYTHAGOREAN_WESTERN: {
    sourceDocument: 'Western Pythagorean Numerology',
    topic: 'Sequential 1-9 Alphabet Matrix and Life Path Calculations',
    rule: 'A-Z letter values 1-9 strictly labeled as Western/Pythagorean',
    level: 'LEVEL_D'
  }
};
