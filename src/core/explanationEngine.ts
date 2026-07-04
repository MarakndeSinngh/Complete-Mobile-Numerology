import { ExplanationDetail } from './types';
import { LEOFAMILY_PLANES } from './planeDefinitions';

export function generateExplanations(
  scores: any,
  enhancedGrid: Record<number, number>,
  driver: number,
  bhagyank: number
): Record<string, ExplanationDetail> {
  const presentDigits = Object.entries(enhancedGrid)
    .filter(([_, count]) => count > 0)
    .map(([digit]) => parseInt(digit, 10));

  const mindPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Mind Plane')!;
  const emotionalPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Emotional Plane')!;
  const practicalPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Practical Plane')!;
  const willPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Will Plane')!;
  const actionPlaneDef = LEOFAMILY_PLANES.find(p => p.name === 'Action Plane')!;
  const silverYogDef = LEOFAMILY_PLANES.find(p => p.name === 'Silver Yog')!;

  const explanationMap: Record<string, ExplanationDetail> = {
    mentalStrength: {
      score: scores.mentalStrength,
      reason: `Based on your present digits in Mind Plane ${mindPlaneDef.coordinates.join('')}: ${mindPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0).join(', ') || 'none'}. Mentally agile, sharp visualization capabilities.`,
      formulaUsed: 'Math.max(35, Math.round((mentalCount / 3) * 100))',
      numbersUsed: mindPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0),
      source: `Mind Plane ${mindPlaneDef.coordinates.join('')} Presence Frequencies`
    },
    emotionalStrength: {
      score: scores.emotionalStrength,
      reason: `Calculated from your middle Emotional Plane ${emotionalPlaneDef.coordinates.join('')}: ${emotionalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0).join(', ') || 'none'}. Reflects intuitive empathy ratios.`,
      formulaUsed: 'Math.max(35, Math.round((emotionalCount / 3) * 100))',
      numbersUsed: emotionalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0),
      source: `Emotional Plane ${emotionalPlaneDef.coordinates.join('')} Presence Frequencies`
    },
    practicalStrength: {
      score: scores.practicalStrength,
      reason: `Calculated from your Practical Plane ${practicalPlaneDef.coordinates.join('')}: ${practicalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0).join(', ') || 'none'}. Governs action readiness and money management.`,
      formulaUsed: 'Math.max(35, Math.round((practicalCount / 3) * 100))',
      numbersUsed: practicalPlaneDef.coordinates.filter(d => enhancedGrid[d] > 0),
      source: `Practical Plane ${practicalPlaneDef.coordinates.join('')} Presence Frequencies`
    },
    leadershipScore: {
      score: scores.leadershipScore,
      reason: `Propelled by Will Plane ${willPlaneDef.coordinates.join('')} and Action Plane ${actionPlaneDef.coordinates.join('')} alignments with driver planet #${driver}. Strong Sun (1) and Mars (9) presence adds heavy command force.`,
      formulaUsed: '30 + Math.round(score951 * 35) + Math.round(score276 * 15) + (driver === 1 || driver === 9 ? 15 : 0)',
      numbersUsed: [...willPlaneDef.coordinates, ...actionPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: `Will Plane ${willPlaneDef.coordinates.join('')} & Action Plane ${actionPlaneDef.coordinates.join('')} alignment`
    },
    communicationScore: {
      score: scores.communicationScore,
      reason: `Derived from Mind Plane ${mindPlaneDef.coordinates.join('')} and Emotional Plane ${emotionalPlaneDef.coordinates.join('')} alignments in the flat map, managed by Mercury/Sun. Central stabilizer (5) ensures high speech clarity.`,
      formulaUsed: '30 + Math.round(score492 * 30) + Math.round(score357 * 20) + (driver === 5 || conductor === 5 ? 15 : 0)',
      numbersUsed: [...mindPlaneDef.coordinates, ...emotionalPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: `Mercury Stabilizer 5 & Emotional Plane ${emotionalPlaneDef.coordinates.join('')}`
    },
    spiritualScore: {
      score: scores.spiritualScore,
      reason: `Governed by Emotional Plane ${emotionalPlaneDef.coordinates.join('')} and Silver Yog ${silverYogDef.coordinates.join('')} levels. Strongly influenced by Occult Ketu (7) and Wisdom Jupiter (3).`,
      formulaUsed: '30 + Math.round(score357 * 30) + Math.round(score258 * 20) + (driver/conductor === 7 || 3 ? 15 : 0)',
      numbersUsed: [...emotionalPlaneDef.coordinates, ...silverYogDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: `Silver Yog ${silverYogDef.coordinates.join('')} & Emotional Plane ${emotionalPlaneDef.coordinates.join('')}`
    },
    relationshipScore: {
      score: scores.relationshipScore,
      reason: `Measures affinity from Emotional Plane ${emotionalPlaneDef.coordinates.join('')} and Action Plane ${actionPlaneDef.coordinates.join('')} which manage partnership harmony. Supported heavily by Moon (2) and Venus (6).`,
      formulaUsed: '30 + Math.round(score357 * 25) + Math.round(score276 * 25) + (driver/conductor === 2 || 6 ? 15 : 0)',
      numbersUsed: [...emotionalPlaneDef.coordinates, ...actionPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: 'Venus Harmony 6 & Moon Empathy 2'
    },
    careerPotentialScore: {
      score: scores.careerPotentialScore,
      reason: `Synthesis of administrative leadership drive, communications effectiveness, and physical plane execution alignment.`,
      formulaUsed: 'Math.round((leadershipScore + communicationScore + practicalStrength) / 3)',
      numbersUsed: [...willPlaneDef.coordinates, ...practicalPlaneDef.coordinates].filter(d => enhancedGrid[d] > 0),
      source: 'Career potential integration index'
    },
    overallLoshuScore: {
      score: scores.overallLoshuScore,
      reason: `Cumulative matrix value representing total vibrational balance across all planes and scores.`,
      formulaUsed: 'Math.round((mental + emotional + practical + leadership + communication + spiritual + relationship) / 7)',
      numbersUsed: presentDigits,
      source: 'Consolidated Numerology Profile score index'
    }
  };

  return explanationMap;
}
