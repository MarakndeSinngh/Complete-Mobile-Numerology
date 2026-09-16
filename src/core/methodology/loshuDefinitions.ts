import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface LoshuCellDefinition {
  digit: number;
  row: number;
  col: number;
  element: string;
  direction: string;
  domain: string;
  planetEn: string;
  planetHi: string;
}

export const IMMUTABLE_LOSHU_GRID: Record<number, LoshuCellDefinition> = {
  4: { digit: 4, row: 1, col: 1, element: 'Wood', direction: 'South-East', domain: 'Wealth & Assets', planetEn: 'Rahu', planetHi: 'राहू' },
  9: { digit: 9, row: 1, col: 2, element: 'Fire', direction: 'South', domain: 'Fame & Reputation', planetEn: 'Mars', planetHi: 'मंगल' },
  2: { digit: 2, row: 1, col: 3, element: 'Earth', direction: 'South-West', domain: 'Marriage & Relationship', planetEn: 'Moon', planetHi: 'चन्द्र' },
  3: { digit: 3, row: 2, col: 1, element: 'Wood', direction: 'East', domain: 'Health & Family', planetEn: 'Jupiter', planetHi: 'गुरु' },
  5: { digit: 5, row: 2, col: 2, element: 'Earth', direction: 'Center', domain: 'Stability & Balance', planetEn: 'Mercury', planetHi: 'बुध' },
  7: { digit: 7, row: 2, col: 3, element: 'Metal', direction: 'West', domain: 'Children & Creativity', planetEn: 'Ketu', planetHi: 'केतु' },
  8: { digit: 8, row: 3, col: 1, element: 'Earth', direction: 'North-East', domain: 'Knowledge & Intuition', planetEn: 'Saturn', planetHi: 'शनि' },
  1: { digit: 1, row: 3, col: 2, element: 'Water', direction: 'North', domain: 'Career & Life Path', planetEn: 'Sun', planetHi: 'सूर्य' },
  6: { digit: 6, row: 3, col: 3, element: 'Metal', direction: 'North-West', domain: 'Helpful Friends & Travel', planetEn: 'Venus', planetHi: 'शुक्र' }
};

export const STANDARD_LOSHU_MATRIX: number[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
];

export interface EnhancedCellStatus {
  number: number;
  dobCount: number;
  driverLayer: 'ABSENT' | 'REINFORCED' | 'ADDED';
  destinyLayer: 'ABSENT' | 'REINFORCED' | 'ADDED';
  sources: string[];
  status: 'physical_only' | 'driver_added' | 'destiny_added' | 'reinforced' | 'layered' | 'empty';
  effectiveCount: number;
}

// Register standard Lo Shu definition in registry
methodologyRegistry.registerRule({
  id: 'LOSHU_CORE_ARCHITECTURE',
  category: 'LOSHU',
  ruleName: 'LeoFamily Standard Lo Shu Matrix 3x3 Layout',
  system: 'LEOFAMILY',
  source: SOURCES.LEOFAMILY_CORE,
  description: 'Standard 3x3 Magic Square orientation: [4, 9, 2] / [3, 5, 7] / [8, 1, 6] with zero exclusion.',
  interpretation: 'Universal energetic template connecting directional elements and life dimensions.',
  confidence: 100,
  safetyLevel: 'SAFE',
  details: {
    matrix: STANDARD_LOSHU_MATRIX,
    positions: IMMUTABLE_LOSHU_GRID
  }
});
