import { LOSHU_POSITIONS, GRAHA_MAPPING } from './methodologyConfig';

export interface EnhancedGridCell {
  number: number;
  dobCount: number;
  driverLayer: boolean;
  destinyLayer: boolean;
  driverStatus: 'reinforced' | 'added' | 'none';
  destinyStatus: 'reinforced' | 'added' | 'none';
  totalVisualOccurrences: number;
  effectivePresent: boolean;
  sources: string[];
  status: 'ABSENT' | 'DOB_ONLY' | 'DRIVER_REINFORCED' | 'DESTINY_REINFORCED' | 'DRIVER_ADDED' | 'DESTINY_ADDED' | 'BOTH_REINFORCED' | 'LAYERED' | 'absent' | 'dob_only' | 'driver_reinforced' | 'destiny_reinforced' | 'driver_added' | 'destiny_added' | 'both_reinforced' | 'layered';
  interpretation: string;
  element: string;
  direction: string;
  graha: string;
}

export interface EnhancedLoshuGridResult {
  cells: Record<number, EnhancedGridCell>;
  flatGrid: Record<number, number>; // Effective presence count for plane/arrow calculations
  effectivePresentDigits: number[];
  effectiveMissingDigits: number[];
  physicalDOBCounts: Record<number, number>;
  mulank: number;
  bhagyank: number;
  summary: {
    mulankReinforced: boolean;
    bhagyankReinforced: boolean;
    mulankAdded: boolean;
    bhagyankAdded: boolean;
  };
}

/**
 * Phase 6: LeoFamily Layered Enhanced Grid Engine
 * Implements the 3-layer architecture:
 * Layer 1: DOB digits
 * Layer 2: Driver / Mulank
 * Layer 3: Destiny / Bhagyank
 */
export function buildEnhancedGrid(
  birthGrid: Record<number, number>,
  mulank: number,
  bhagyank: number
): EnhancedLoshuGridResult {
  const cells: Record<number, EnhancedGridCell> = {};
  const flatGrid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const effectivePresentDigits: number[] = [];
  const effectiveMissingDigits: number[] = [];

  const mulankReinforced = (birthGrid[mulank] || 0) > 0;
  const mulankAdded = !mulankReinforced && mulank >= 1 && mulank <= 9;

  const bhagyankReinforced = (birthGrid[bhagyank] || 0) > 0;
  const bhagyankAdded = !bhagyankReinforced && bhagyank >= 1 && bhagyank <= 9;

  for (let num = 1; num <= 9; num++) {
    const dobCount = birthGrid[num] || 0;
    const isDriver = num === mulank;
    const isDestiny = num === bhagyank;

    const driverLayer = isDriver;
    const destinyLayer = isDestiny;

    let driverStatus: 'reinforced' | 'added' | 'none' = 'none';
    let destinyStatus: 'reinforced' | 'added' | 'none' = 'none';

    if (isDriver) {
      driverStatus = dobCount > 0 ? 'reinforced' : 'added';
    }
    if (isDestiny) {
      destinyStatus = dobCount > 0 ? 'reinforced' : 'added';
    }

    const sources: string[] = [];
    if (dobCount > 0) sources.push('DOB');
    if (isDriver) sources.push('MULANK');
    if (isDestiny) sources.push('BHAGYANK');

    // Determine status string
    let status: EnhancedGridCell['status'] = 'ABSENT';
    if (dobCount === 0 && !driverLayer && !destinyLayer) {
      status = 'ABSENT';
    } else if (dobCount > 0 && !driverLayer && !destinyLayer) {
      status = 'DOB_ONLY';
    } else if (driverStatus === 'reinforced' && destinyStatus === 'reinforced') {
      status = 'BOTH_REINFORCED';
    } else if (driverStatus === 'reinforced') {
      status = 'DRIVER_REINFORCED';
    } else if (destinyStatus === 'reinforced') {
      status = 'DESTINY_REINFORCED';
    } else if (driverStatus === 'added') {
      status = 'DRIVER_ADDED';
    } else if (destinyStatus === 'added') {
      status = 'DESTINY_ADDED';
    } else {
      status = 'LAYERED';
    }

    // In the LeoFamily 3-layer Enhanced Grid:
    // Physical DOB count is preserved in physicalDOBCounts.
    // Enhanced grid count includes DOB occurrences + Driver layer + Destiny layer.
    const totalOccurrences = dobCount + (isDriver ? 1 : 0) + (isDestiny ? 1 : 0);
    const effectivePresent = totalOccurrences > 0;
    flatGrid[num] = totalOccurrences;

    if (effectivePresent) {
      effectivePresentDigits.push(num);
    } else {
      effectiveMissingDigits.push(num);
    }

    const pos = LOSHU_POSITIONS[num as keyof typeof LOSHU_POSITIONS];
    const graha = GRAHA_MAPPING[num];

    // Interpretation description
    let interpretation = '';
    const statusNormalized = status.toLowerCase();
    if (statusNormalized === 'absent') {
      interpretation = `Digit ${num} (${graha.nameHi}) is absent in the birth chart; represents an area for conscious development and remedy support.`;
    } else if (statusNormalized === 'driver_reinforced') {
      interpretation = `Digit ${num} (${graha.nameHi}) is naturally present in DOB and strongly reinforced by your Mulank/Driver vibration. Natural core asset.`;
    } else if (statusNormalized === 'destiny_reinforced') {
      interpretation = `Digit ${num} (${graha.nameHi}) is present in DOB and activated as your Bhagyank/Destiny channel. Highly auspicious karmic alignment.`;
    } else if (statusNormalized === 'driver_added') {
      interpretation = `Digit ${num} (${graha.nameHi}) is absent from physical DOB but activated through your Mulank (${mulank}). Supplements the grid through your conscious driving nature.`;
    } else if (statusNormalized === 'destiny_added') {
      interpretation = `Digit ${num} (${graha.nameHi}) is absent from physical DOB but bestowed through your Bhagyank (${bhagyank}). Supplements the grid through destiny evolution.`;
    } else if (statusNormalized === 'both_reinforced') {
      interpretation = `Digit ${num} (${graha.nameHi}) is physical in DOB and reinforced by both Mulank and Bhagyank. A dominant, defining pillar of your chart.`;
    } else {
      interpretation = `Digit ${num} (${graha.nameHi}) is active with ${dobCount} occurrence(s) in your birth kundali.`;
    }

    cells[num] = {
      number: num,
      dobCount,
      driverLayer,
      destinyLayer,
      driverStatus,
      destinyStatus,
      totalVisualOccurrences: dobCount > 0 ? dobCount : (effectivePresent ? 1 : 0),
      effectivePresent,
      sources,
      status,
      interpretation,
      element: pos.element,
      direction: pos.direction,
      graha: graha.nameEn
    };
  }

  return {
    cells,
    flatGrid,
    effectivePresentDigits,
    effectiveMissingDigits,
    physicalDOBCounts: birthGrid,
    mulank,
    bhagyank,
    summary: {
      mulankReinforced,
      bhagyankReinforced,
      mulankAdded,
      bhagyankAdded
    }
  };
}
