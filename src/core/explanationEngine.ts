import { ExplanationDetail } from './types';

export function generateExplanations(
  scores: any,
  enhancedGrid: Record<number, number>,
  driver: number,
  bhagyank: number
): Record<string, ExplanationDetail> {
  const presentDigits = Object.entries(enhancedGrid)
    .filter(([_, count]) => count > 0)
    .map(([digit]) => parseInt(digit, 10));

  const explanationMap: Record<string, ExplanationDetail> = {
    mentalStrength: {
      score: scores.mentalStrength,
      reason: `Based on your present digits in Mental Plane 951: ${[9, 5, 1].filter(d => enhancedGrid[d] > 0).join(', ') || 'none'}. Mentally agile, sharp visualization capabilities.`,
      formulaUsed: 'Math.max(35, Math.round((mentalCount / 3) * 100))',
      numbersUsed: [9, 5, 1].filter(d => enhancedGrid[d] > 0),
      source: 'Mental Plane 951 Presence Frequencies'
    },
    emotionalStrength: {
      score: scores.emotionalStrength,
      reason: `Calculated from your middle Emotional Plane 357: ${[3, 5, 7].filter(d => enhancedGrid[d] > 0).join(', ') || 'none'}. Reflects intuitive empathy ratios.`,
      formulaUsed: 'Math.max(35, Math.round((emotionalCount / 3) * 100))',
      numbersUsed: [3, 5, 7].filter(d => enhancedGrid[d] > 0),
      source: 'Emotional Plane 357 Presence Frequencies'
    },
    practicalStrength: {
      score: scores.practicalStrength,
      reason: `Calculated from your Practical Plane 816: ${[8, 1, 6].filter(d => enhancedGrid[d] > 0).join(', ') || 'none'}. Governs action readiness.`,
      formulaUsed: 'Math.max(35, Math.round((practicalCount / 3) * 100))',
      numbersUsed: [8, 1, 6].filter(d => enhancedGrid[d] > 0),
      source: 'Practical Plane 816 Presence Frequencies'
    },
    leadershipScore: {
      score: scores.leadershipScore,
      reason: `Propelled by Plane 951 (Will/Mental) and Plane 276 (Action) alignments with driver planet #${driver}. Strong Sun (1) and Mars (9) presence adds heavy command force.`,
      formulaUsed: '30 + Math.round(score951 * 35) + Math.round(score276 * 15) + (driver === 1 || driver === 9 ? 15 : 0)',
      numbersUsed: [9, 5, 1, 2, 7, 6].filter(d => enhancedGrid[d] > 0),
      source: 'Will Plane 951 & Action Plane 276 alignment'
    },
    communicationScore: {
      score: scores.communicationScore,
      reason: `Derived from Plane 951 and Plane 357 alignments in the flat map, managed by Mercury/Sun. Central stabilizer (5) ensures high speech clarity.`,
      formulaUsed: '30 + Math.round(score951 * 30) + Math.round(score357 * 20) + (driver === 5 || conductor === 5 ? 15 : 0)',
      numbersUsed: [9, 5, 1, 3, 7].filter(d => enhancedGrid[d] > 0),
      source: 'Mercury Stabilizer 5 & Plane 357'
    },
    spiritualScore: {
      score: scores.spiritualScore,
      reason: `Governed by Plane 357 (Intuition) and Plane 258 (Spirituality) levels. Strongly influenced by Occult Ketu (7) and Wisdom Jupiter (3).`,
      formulaUsed: '30 + Math.round(score357 * 30) + Math.round(score258 * 20) + (driver/conductor === 7 || 3 ? 15 : 0)',
      numbersUsed: [3, 5, 7, 2, 8].filter(d => enhancedGrid[d] > 0),
      source: 'Spirituality Plane 258 & Intuition Plane 357'
    },
    relationshipScore: {
      score: scores.relationshipScore,
      reason: `Measures affinity from Plane 357 and Plane 276 which manage partnership harmony. Supported heavily by Moon (2) and Venus (6).`,
      formulaUsed: '30 + Math.round(score357 * 25) + Math.round(score276 * 25) + (driver/conductor === 2 || 6 ? 15 : 0)',
      numbersUsed: [3, 5, 7, 2, 6].filter(d => enhancedGrid[d] > 0),
      source: 'Venus Harmony 6 & Moon Empathy 2'
    },
    careerPotentialScore: {
      score: scores.careerPotentialScore,
      reason: `Synthesis of administrative leadership drive, communications effectiveness, and physical plane execution alignment.`,
      formulaUsed: 'Math.round((leadershipScore + communicationScore + practicalStrength) / 3)',
      numbersUsed: [9, 5, 1, 8, 6].filter(d => enhancedGrid[d] > 0),
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
