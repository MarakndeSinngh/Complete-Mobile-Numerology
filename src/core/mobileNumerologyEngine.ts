import { analyzeMobileNumberAdvanced, MobileAnalysisNew } from '../services/AdvancedMobileEngine';
import { reduceToDigit, sumDigits } from './numerologyEngine';

export interface UnifiedMobileAnalysis extends MobileAnalysisNew {
  number: string;
  digitSum: number;
  rootNumber: number;
  compoundNumber: number;
  digitFrequency: Record<number, number>;
  missingDigits: number[];
  repeatedDigits: { digit: number; count: number }[];
  dobCompatibility: { score: number; status: string; description: string };
  mulankCompatibility: { score: number; status: string; description: string };
  bhagyankCompatibility: { score: number; status: string; description: string };
  overallScore: number;
  strengths: string[];
  concerns: string[];
  recommendation: string;
}

export function analyzeMobileNumerology(
  mobileNumber: string,
  mulank: number = 1,
  bhagyank: number = 1
): UnifiedMobileAnalysis {
  const cleanDigits = (mobileNumber || '').replace(/[^0-9]/g, '');
  const advancedResult = analyzeMobileNumberAdvanced(cleanDigits);

  const digitSum = sumDigits(cleanDigits);
  const compoundNumber = digitSum;
  const rootNumber = reduceToDigit(digitSum);

  // Compute digit frequencies 0-9
  const digitFrequency: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };
  for (let i = 0; i < cleanDigits.length; i++) {
    const d = parseInt(cleanDigits[i], 10);
    if (!isNaN(d)) {
      digitFrequency[d]++;
    }
  }

  const missingDigits: number[] = [];
  const repeatedDigits: { digit: number; count: number }[] = [];
  for (let d = 1; d <= 9; d++) {
    if (digitFrequency[d] === 0) {
      missingDigits.push(d);
    } else if (digitFrequency[d] > 1) {
      repeatedDigits.push({ digit: d, count: digitFrequency[d] });
    }
  }

  // Mulank Compatibility
  const friendlyToMulank: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3],
    3: [1, 2, 3, 9],
    4: [5, 6, 7, 8],
    5: [1, 5, 6],
    6: [5, 6],
    7: [4, 5, 6],
    8: [5, 6],
    9: [1, 2, 3, 9]
  };

  const isMulankFriendly = friendlyToMulank[mulank]?.includes(rootNumber) || rootNumber === mulank;
  const isBhagyankFriendly = friendlyToMulank[bhagyank]?.includes(rootNumber) || rootNumber === bhagyank;

  const mulankScore = isMulankFriendly ? 88 : 55;
  const bhagyankScore = isBhagyankFriendly ? 85 : 52;
  const dobScore = Math.round((mulankScore + bhagyankScore) / 2);

  const mulankCompatibility = {
    score: mulankScore,
    status: isMulankFriendly ? 'Compatible' : 'Neutral / Friction',
    description: isMulankFriendly
      ? `Mobile root ${rootNumber} harmonizes well with your instinctive Mulank ${mulank}.`
      : `Mobile root ${rootNumber} may create subtle conflicting impulses with Mulank ${mulank}.`
  };

  const bhagyankCompatibility = {
    score: bhagyankScore,
    status: isBhagyankFriendly ? 'Supportive' : 'Challenging',
    description: isBhagyankFriendly
      ? `Mobile root ${rootNumber} supports your long-term Bhagyank ${bhagyank} path.`
      : `Mobile root ${rootNumber} presents growth lessons relative to Bhagyank ${bhagyank}.`
  };

  const dobCompatibility = {
    score: dobScore,
    status: dobScore >= 80 ? 'Harmonious' : 'Moderate',
    description: `Overall date-of-birth resonance score: ${dobScore}/100 based on Driver (${mulank}) & Conductor (${bhagyank}) alignments.`
  };

  const strengths: string[] = [];
  if (advancedResult.rating === 'EXCELLENT' || advancedResult.rating === 'GOOD') {
    strengths.push(`Favorable compound sum ${advancedResult.compoundTotal} (${advancedResult.compoundDetails.title})`);
  }
  if (isMulankFriendly) {
    strengths.push(`Direct resonance with Mulank ${mulank}`);
  }
  if (advancedResult.harmony.friendlyCount > advancedResult.harmony.enemyCount) {
    strengths.push('High internal pair friendliness ratio');
  }
  if (strengths.length === 0) {
    strengths.push('Stable everyday utility; grounding frequency');
  }

  const concerns: string[] = [];
  if (digitFrequency[4] > 2 || digitFrequency[8] > 2) {
    concerns.push('Excess presence of intense Saturn (8) or Rahu (4) vibrations');
  }
  if (advancedResult.harmony.enemyCount >= 3) {
    concerns.push('Multiple clashing adjacent digit pairs detected');
  }
  if (!isMulankFriendly && !isBhagyankFriendly) {
    concerns.push(`Root ${rootNumber} does not match either Driver (${mulank}) or Conductor (${bhagyank})`);
  }

  let recommendation = '';
  if (advancedResult.score >= 75 && isMulankFriendly) {
    recommendation = 'Highly recommended for primary personal, business, and financial communication.';
  } else if (advancedResult.score >= 55) {
    recommendation = 'Suitable for standard commercial and secondary communication; consider activating friendly wallpaper/colors.';
  } else {
    recommendation = 'Consider upgrading to a number summing to 1, 5, or 6 that aligns with your Driver and Destiny.';
  }

  return {
    ...advancedResult,
    number: cleanDigits,
    digitSum,
    rootNumber,
    compoundNumber,
    digitFrequency,
    missingDigits,
    repeatedDigits,
    dobCompatibility,
    mulankCompatibility,
    bhagyankCompatibility,
    overallScore: advancedResult.score,
    strengths,
    concerns,
    recommendation
  };
}
