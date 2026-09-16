import { reduceToDigit } from './numerologyEngine';
import { calculateChaldeanEntitySum } from './chaldeanEngine';
import { generateNumeroVaastuReport, NumeroVaastuReport } from '../services/numeroVaastuEngine';

export interface VastuInputs {
  dob: string;
  mulank?: number;
  bhagyank?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  houseNumber?: string;
  flatNumber?: string;
  floor?: string | number;
  entranceNumber?: string;
  facingDirection?: string;
  buildingNumber?: string;
  mobileNumber?: string;
  vehicleNumber?: string;
}

export interface DirectionCategory {
  direction: string;
  element: string;
  influence: string;
  score: number;
}

export interface UnifiedVastuAnalysis {
  methodology: string;
  kuaNumber: number;
  groupType: 'EAST_GROUP' | 'WEST_GROUP';
  groupDescription: string;
  compatibleDirections: DirectionCategory[];
  supportiveDirections: DirectionCategory[];
  neutralDirections: DirectionCategory[];
  cautionDirections: DirectionCategory[];
  houseNumberVibration?: {
    raw: string;
    compound: number;
    root: number;
    harmony: string;
    description: string;
  };
  entranceVibration?: {
    raw: string;
    root: number;
    description: string;
  };
  facingDirectionAnalysis?: {
    facing: string;
    isAuspicious: boolean;
    recommendation: string;
  };
  balanceRecommendations: string[];
  traditionalRemedySuggestions: string[];
  zonesReport: NumeroVaastuReport['zonesReport'];
  colourCorrection: NumeroVaastuReport['colourCorrection'];
}

export function analyzeNumeroVastu(inputs: VastuInputs): UnifiedVastuAnalysis {
  const {
    dob,
    gender = 'MALE',
    houseNumber = '',
    flatNumber = '',
    entranceNumber = '',
    facingDirection = 'North',
    mobileNumber = '',
    vehicleNumber = ''
  } = inputs;

  const vaastuReport = generateNumeroVaastuReport(dob, (gender as 'MALE' | 'FEMALE') || 'MALE', '');

  // Parse directional groups based on Kua Group
  const isEast = vaastuReport.groupType === 'EAST_GROUP';

  // East Group auspicious: North, South, East, South-East
  // West Group auspicious: North-West, South-West, North-East, West
  const eastDirs = ['North', 'East', 'South-East', 'South'];
  const westDirs = ['North-East', 'North-West', 'South-West', 'West'];

  const auspiciousDirs = isEast ? eastDirs : westDirs;
  const inauspiciousDirs = isEast ? westDirs : eastDirs;

  const compatibleDirections: DirectionCategory[] = auspiciousDirs.slice(0, 2).map(dir => ({
    direction: dir,
    element: dir.includes('East') || dir === 'East' ? 'Wood' : (dir === 'North' ? 'Water' : (dir === 'South' ? 'Fire' : 'Earth')),
    influence: 'High magnetic resonance for prosperity, vital health, and family longevity.',
    score: 95
  }));

  const supportiveDirections: DirectionCategory[] = auspiciousDirs.slice(2).map(dir => ({
    direction: dir,
    element: dir.includes('Metal') || dir === 'West' ? 'Metal' : 'Earth',
    influence: 'Harmonious secondary alignment for personal development and creative flow.',
    score: 82
  }));

  const neutralDirections: DirectionCategory[] = [inauspiciousDirs[0]].map(dir => ({
    direction: dir,
    element: 'Neutralizing Earth/Space',
    influence: 'Acceptable with standard spatial remedies and energetic balancing.',
    score: 65
  }));

  const cautionDirections: DirectionCategory[] = inauspiciousDirs.slice(1).map(dir => ({
    direction: dir,
    element: 'Opposing Cosmic Influx',
    influence: 'May introduce subtle financial delays or restlessness if uncorrected.',
    score: 42
  }));

  // House Number vibration
  let houseNumberVibration = undefined;
  const targetHouse = flatNumber || houseNumber;
  if (targetHouse) {
    const { compound, root } = calculateChaldeanEntitySum(targetHouse);
    houseNumberVibration = {
      raw: targetHouse,
      compound,
      root,
      harmony: root === 1 || root === 3 || root === 5 || root === 6 ? 'Highly Harmonious' : 'Requires Energetic Balancing',
      description: `House number vibration reduces to ${root} (compound ${compound}), channeling architectural energy associated with planetary root ${root}.`
    };
  }

  // Entrance vibration
  let entranceVibration = undefined;
  if (entranceNumber) {
    const root = reduceToDigit(parseInt(entranceNumber.replace(/[^0-9]/g, ''), 10) || 1);
    entranceVibration = {
      raw: entranceNumber,
      root,
      description: `Main entrance node ${root} sets the primary threshold frequency for Chi entry.`
    };
  }

  // Facing direction analysis
  let facingDirectionAnalysis = undefined;
  if (facingDirection) {
    const isAuspicious = auspiciousDirs.some(d => d.toLowerCase() === facingDirection.toLowerCase());
    facingDirectionAnalysis = {
      facing: facingDirection,
      isAuspicious,
      recommendation: isAuspicious
        ? `Your property facing direction (${facingDirection}) perfectly matches your ${vaastuReport.groupType.replace('_', ' ')} energy flow.`
        : `Your facing direction (${facingDirection}) invites an opposing energy stream; place a brass Swastika or lead pyramid at the foyer threshold.`
    };
  }

  return {
    methodology: 'LeoFamily Numero Vastu incorporates classical Vedic directional deities combined with Eight Mansions Kua harmonics and Chaldean numerical vibrations.',
    kuaNumber: vaastuReport.kuaNumber,
    groupType: vaastuReport.groupType,
    groupDescription: vaastuReport.groupDescription,
    compatibleDirections,
    supportiveDirections,
    neutralDirections,
    cautionDirections,
    houseNumberVibration,
    entranceVibration,
    facingDirectionAnalysis,
    balanceRecommendations: [
      `Decorate key living areas with recommended tones: ${vaastuReport.colourCorrection.luckyColours.join(', ')}.`,
      `Place primary study or workspace in the ${compatibleDirections[0]?.direction || 'North'} zone to boost focus.`,
      `Ensure the Brahmasthan (center) remains free of heavy clutter to preserve natural equilibrium.`
    ],
    traditionalRemedySuggestions: vaastuReport.remedyPlan.remedyCards.slice(0, 3).map(r => `${r.zoneName}: ${r.directionRemedy}`),
    zonesReport: vaastuReport.zonesReport,
    colourCorrection: vaastuReport.colourCorrection
  };
}
