import { DOBAnalysis, NameAnalysis, MobileAnalysis } from '../types';
import { getCompoundDetails } from './compoundDatabase';
import { computeLoshuAnalysis } from './loshuEngine';

export interface PartnerData {
  name: string;
  dob: string;
  mobile?: string;
}

export interface CompatibilityMetric {
  score: number;
  rating: string;
  explanation: string;
  whyThisResult: string;
}

export interface AdvancedCompatibilityReport {
  overallScore: number;
  overallRating: string;
  overallExplanation: string;
  layers: {
    driver: CompatibilityMetric;
    conductor: CompatibilityMetric;
    compound: CompatibilityMetric;
    name: CompatibilityMetric;
    mobile: CompatibilityMetric;
    loshu: CompatibilityMetric;
    arrow: CompatibilityMetric;
    missingNumber: CompatibilityMetric;
    karmic: CompatibilityMetric;
    planetary: CompatibilityMetric;
  };
  categories: {
    emotional: CompatibilityMetric;
    communication: CompatibilityMetric;
    financial: CompatibilityMetric;
    family: CompatibilityMetric;
    intimacy: CompatibilityMetric;
    spiritual: CompatibilityMetric;
  };
  conflictAreas: { area: string; riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'; description: string; advice: string }[];
  growthAreas: { area: string; benefit: string; plan: string }[];
  indicators: {
    isSoulmate: boolean;
    karmicWarning: boolean;
    soulmateType?: string;
  };
}

// Traditional Chaldean & Vedic planetary relationship matrix (1=Sun, 2=Moon, 3=Jupiter, 4=Rahu, 5=Mercury, 6=Venus, 7=Ketu, 8=Saturn, 9=Mars)
// Values map to: 0 = Enemies/Hostile, 1 = Neutral/Passive, 2 = Ultra-Friendly/Harmonious
const PLANETARY_RELS: Record<number, Record<number, number>> = {
  1: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2, 6: 1, 7: 1, 8: 0, 9: 2 },
  2: { 1: 2, 2: 1, 3: 2, 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 },
  3: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 0, 6: 0, 7: 2, 8: 1, 9: 2 },
  4: { 1: 1, 2: 0, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1, 8: 2, 9: 0 },
  5: { 1: 2, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1, 8: 1, 9: 1 },
  6: { 1: 1, 2: 1, 3: 0, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 1 },
  7: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1, 6: 2, 7: 1, 8: 1, 9: 0 },
  8: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1, 6: 2, 7: 1, 8: 2, 9: 0 },
  9: { 1: 2, 2: 1, 3: 2, 4: 0, 5: 1, 6: 1, 7: 0, 8: 0, 9: 2 }
};

export function calculateAdvancedCompatibility(
  p1: { name: string; dob: string; mobile?: string },
  p2: { name: string; dob: string; mobile?: string }
): AdvancedCompatibilityReport {
  // 1. Core numerology calculations
  const cleanDob1 = p1.dob.replace(/[^0-9]/g, '');
  const cleanDob2 = p2.dob.replace(/[^0-9]/g, '');

  const day1 = parseInt(p1.dob.split('-')[2], 10) || 1;
  const day2 = parseInt(p2.dob.split('-')[2], 10) || 1;

  const sum1 = cleanDob1.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  const sum2 = cleanDob2.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);

  const m1 = reduceToSingleDigit(day1);
  const m2 = reduceToSingleDigit(day2);

  const b1 = reduceToSingleDigit(sum1);
  const b2 = reduceToSingleDigit(sum2);

  const nameSum1 = calculateChaldeanNameSum(p1.name);
  const nameSum2 = calculateChaldeanNameSum(p2.name);

  const n1 = reduceToSingleDigit(nameSum1);
  const n2 = reduceToSingleDigit(nameSum2);

  const mobVal1 = p1.mobile ? getMobileReducedSum(p1.mobile) : 5;
  const mobVal2 = p2.mobile ? getMobileReducedSum(p2.mobile) : 6;

  // Compute Lo Shu Grids
  const grid1 = computeLoshuAnalysis(p1.dob, p1.name);
  const grid2 = computeLoshuAnalysis(p2.dob, p2.name);

  // Indicators mapping
  const isSoulmate = (m1 === b2 && m2 === b1) || (m1 === m2 && b1 === b2) || (m1 === 9 && m2 === 1) || (m1 === 2 && m2 === 7);
  const karmicWarning = (m1 + m2 === 13 || m1 === 8 || m2 === 8 || b1 === 4 || b2 === 4 || m1 === 4 || m2 === 4);

  // LAYER 1: Driver (Mulank) Compatibility
  const relDriver = PLANETARY_RELS[m1]?.[m2] ?? 1;
  let driverScore = relDriver === 2 ? 95 : relDriver === 1 ? 75 : 45;
  if (m1 === m2) driverScore = 85; 
  const driverMetric: CompatibilityMetric = {
    score: driverScore,
    rating: driverScore >= 90 ? 'EXCELLENT' : driverScore >= 70 ? 'GOOD' : 'CHALLENGING',
    explanation: `Driver Numbers ${m1} (Ruled by ${getPlanetName(m1)}) and ${m2} (Ruled by ${getPlanetName(m2)}) form a ${relDriver === 2 ? 'highly harmonious planetary relationship' : relDriver === 1 ? 'cooperative, neutral bond' : 'complex friction alliance'} in daily action templates.`,
    whyThisResult: `Because Driver ${m1} & ${m2} have a traditional ${relDriver === 2 ? 'Friendly' : relDriver === 1 ? 'Neutral' : 'Enemy'} relationship factor in Vedic frameworks.`
  };

  // LAYER 2: Conductor (Bhagyank) Compatibility
  const relCond = PLANETARY_RELS[b1]?.[b2] ?? 1;
  let condScore = relCond === 2 ? 95 : relCond === 1 ? 70 : 40;
  const condMetric: CompatibilityMetric = {
    score: condScore,
    rating: condScore >= 90 ? 'EXCELLENT' : condScore >= 70 ? 'GOOD' : 'CHALLENGING',
    explanation: `Conductor (Bhagyank) ${b1} met with Partner's Conductor ${b2} governs core material and spiritual expansion. This forms an axis of ${relCond === 2 ? 'seamless long-term planning' : relCond === 1 ? 'average supportive coordination' : 'critical delays in family building'}.`,
    whyThisResult: `Because Conductor ${b1} & ${b2} are planetary ${relCond === 2 ? 'Friends' : relCond === 1 ? 'Neutral' : 'Opposition'} which influences career and conductor synastry.`
  };

  // LAYER 3: Compound Number Compatibility
  // Compare compound day numbers
  const comp1 = day1;
  const comp2 = day2;
  const cDiff = Math.abs(comp1 - comp2);
  const compScore = Math.max(30, 100 - cDiff * 2.5);
  const compMetric: CompatibilityMetric = {
    score: compScore,
    rating: compScore >= 80 ? 'EXCELLENT' : compScore >= 60 ? 'GOOD' : 'CHALLENGING',
    explanation: `Compound Birth Numbers ${comp1} and ${comp2} are audited for core mathematical distance. A distance of ${cDiff} degrees represents ${compScore >= 80 ? 'pristine soul compatibility' : 'balanced adaptive rhythm'}.`,
    whyThisResult: `Calculated from distance vector between birth compound days ${comp1} & ${comp2}, regulating sudden subconscious stress loops.`
  };

  // LAYER 4: Name Compatibility
  const relName = PLANETARY_RELS[n1]?.[n2] ?? 1;
  let nameScore = relName === 2 ? 92 : relName === 1 ? 75 : 50;
  const nameMetric: CompatibilityMetric = {
    score: nameScore,
    rating: nameScore >= 85 ? 'EXCELLENT' : nameScore >= 70 ? 'GOOD' : 'CHALLENGING',
    explanation: `Your name Chaldean sum is ${nameSum1} (resolving to root ${n1}) and partner name resolves to ${n2} (${nameSum2}). This represents how public identities and social circles blend happily.`,
    whyThisResult: `Based on Chaldean Name roots ${n1} & ${n2} which directly direct communication harmony during social gatherings.`
  };

  // LAYER 5: Mobile Compatibility
  const relMob = PLANETARY_RELS[mobVal1]?.[mobVal2] ?? 1;
  const mobScore = relMob === 2 ? 90 : relMob === 1 ? 72 : 48;
  const mobMetric: CompatibilityMetric = {
    score: mobScore,
    rating: mobScore >= 80 ? 'EXCELLENT' : mobScore >= 65 ? 'GOOD' : 'CHALLENGING',
    explanation: `Mobile vibrations resolve to ${mobVal1} matched with partner's ${mobVal2}. This dictates the cellular telecommunication ease between you two.`,
    whyThisResult: `Formed by comparing the reduced sum of mobile values under Vedic planetary aspects.`
  };

  // LAYER 6: Lo Shu Grid Synergies
  const grid1Digits = Object.values(grid1.loshuGrid).filter(box => box.count > 0).map(box => box.digit);
  const grid2Digits = Object.values(grid2.loshuGrid).filter(box => box.count > 0).map(box => box.digit);

  const sharedNumbers = grid1Digits.filter(x => grid2Digits.includes(x));
  const loshuScore = Math.min(100, Math.max(35, 40 + sharedNumbers.length * 15));
  const loshuMetric: CompatibilityMetric = {
    score: loshuScore,
    rating: loshuScore >= 80 ? 'EXCELLENT' : loshuScore >= 60 ? 'GOOD' : 'CHALLENGING',
    explanation: `The overlay of your Lo Shu Grids reveals ${sharedNumbers.length} shared energy blocks (${sharedNumbers.join(', ') || 'none'}), displaying outstanding coordination in balancing life quadrants.`,
    whyThisResult: `Computed from the intersection elements in both Lo Shu grids which represents shared energetic elements.`
  };

  // LAYER 7: Arrow Compatibility
  const arrow1 = grid1.strengthArrows.length;
  const arrow2 = grid2.strengthArrows.length;
  const arrowScore = Math.min(100, Math.max(40, 50 + (arrow1 + arrow2) * 8));
  const arrowMetric: CompatibilityMetric = {
    score: arrowScore,
    rating: arrowScore >= 75 ? 'EXCELLENT' : arrowScore >= 60 ? 'GOOD' : 'CHALLENGING',
    explanation: `Combined, the couple shares ${arrow1 + arrow2} complete arrows of willpower, determination, or intellect, producing deep active avenues of prosperity.`,
    whyThisResult: `Based on total constructive strength vectors generated by present Lo Shu structural arrows.`
  };

  // LAYER 8: Missing Number Compatibility
  const missing1 = grid1.missingNumbers.map(item => item.digit);
  const missing2 = grid2.missingNumbers.map(item => item.digit);
  // Mutual support: if partner 1 has a number that partner 2 is missing, that's beautiful
  const p1SavesP2 = missing2.filter(num => grid1Digits.includes(num)).length;
  const p2SavesP1 = missing1.filter(num => grid2Digits.includes(num)).length;
  const missingScore = Math.min(100, Math.max(30, 45 + (p1SavesP2 + p2SavesP1) * 12));
  const missingMetric: CompatibilityMetric = {
    score: missingScore,
    rating: missingScore >= 80 ? 'EXCELLENT' : 'GOOD',
    explanation: `Mutual support matrix is outstanding. Partner 1 fills ${p2SavesP1} energetic voids for Partner 2, while Partner 2 compensates for ${p1SavesP2} of Partner 1's missing cosmic frequencies.`,
    whyThisResult: `Derived from cross-filling capacity of empty nodes in each other’s personal birth grids.`
  };

  // LAYER 9: Karmic Compatibility
  const karmicScore = isSoulmate ? 98 : karmicWarning ? 50 : 75;
  const karmicMetric: CompatibilityMetric = {
    score: karmicScore,
    rating: karmicScore >= 90 ? 'KARMIC SOULMATE' : karmicScore >= 70 ? 'STABLE' : 'KARMIC TEST',
    explanation: isSoulmate ? 'Amazing. Strong soulmate past-life configuration found. Absolute spiritual loyalty.' : 
                 karmicWarning ? 'Alert: Presence of structural lessons. Requires planetary mantras to prevent sudden disruptions.' : 
                 'Standard peaceful karmic pattern. Balanced growth avenues without aggressive backlogs.',
    whyThisResult: `Determined by check of driver-conductor crossovers (${m1} & ${b2}, ${m2} & ${b1}) and planetary standard warning coordinates.`
  };

  // LAYER 10: Planetary Compatibility
  const pScore = Math.round((PLANETARY_RELS[m1]?.[m2] + PLANETARY_RELS[b1]?.[b2] + PLANETARY_RELS[n1]?.[n2]) * 16.6);
  const planetaryMetric: CompatibilityMetric = {
    score: pScore,
    rating: pScore >= 80 ? 'HIGHLY HARMONIOUS' : pScore >= 60 ? 'NEUTRAL' : 'CONFLICT PRONE',
    explanation: `The overall planetary alignment between rulers Sun, Moon, Jupiter, Mercury, Venus, or Saturn shows ${pScore >= 80 ? 'outstanding sync' : pScore >= 60 ? 'acceptable baseline coordination' : 'intense friction requiring remedial correction'}.`,
    whyThisResult: `Calculated from aggregate weights of planetary friendships across Driver, Conductor, and Name root vibrations.`
  };

  // CATEGORY CORES
  const emotionalScore = Math.round((driverScore * 0.5) + (compScore * 0.3) + (loshuScore * 0.2));
  const communicationScore = Math.round((nameScore * 0.4) + (mobScore * 0.3) + (driverScore * 0.3));
  const financialScore = Math.round((condScore * 0.6) + (arrowScore * 0.2) + (missingScore * 0.2));
  const familyScore = Math.round((loshuScore * 0.4) + (compScore * 0.4) + (nameScore * 0.2));
  const intimacyScore = Math.round((driverScore * 0.3) + (loshuScore * 0.3) + (compScore * 0.4));
  const spiritualScore = Math.round((condScore * 0.5) + (karmicScore * 0.3) + (planetaryMetric.score * 0.2));

  // Overall stability
  const overallStability = Math.round(
    (driverScore * 0.2) +
    (condScore * 0.2) +
    (compScore * 0.15) +
    (nameScore * 0.15) +
    (loshuScore * 0.1) +
    (missingScore * 0.1) +
    (karmicScore * 0.1)
  );

  const emotionalMetric: CompatibilityMetric = {
    score: emotionalScore,
    rating: getCategoryRating(emotionalScore),
    explanation: `Emotional attachment is ${getCategoryDesc(emotionalScore)}. Your root emotions sync ${emotionalScore >= 80 ? 'beautifully' : 'with moderate adjustment cycles'}.`,
    whyThisResult: `Driven by Driver ${m1} & ${m2} harmony modified by compound day distance of ${cDiff}.`
  };

  const communicationMetric: CompatibilityMetric = {
    score: communicationScore,
    rating: getCategoryRating(communicationScore),
    explanation: `Sharing of thoughts is ${getCategoryDesc(communicationScore)}. The couple communicates with ${communicationScore >= 80 ? 'tremendous transparency' : 'minor hesitations during stressful projects'}.`,
    whyThisResult: `Derived from Chaldean name Roots and Mobile root totals ${mobVal1} & ${mobVal2}.`
  };

  const financialMetric: CompatibilityMetric = {
    score: financialScore,
    rating: getCategoryRating(financialScore),
    explanation: `Wealth and asset coordination score is ${financialScore}/100. Relies on destiny numbers.`,
    whyThisResult: `Conductor ${b1} & ${b2} dictate career luck, while Lo Shu Arrows support mutual real estate joint actions.`
  };

  const familyMetric: CompatibilityMetric = {
    score: familyScore,
    rating: getCategoryRating(familyScore),
    explanation: `Domestic tranquility, children prosperity, and relationship with in-laws is rated ${getCategoryRating(familyScore)}.`,
    whyThisResult: `Calculated from Lo Shu structural sync and Chaldean Name compatibility to balance household vibes.`
  };

  const intimacyMetric: CompatibilityMetric = {
    score: intimacyScore,
    rating: getCategoryRating(intimacyScore),
    explanation: `Physical and chemistry resonance maps to a highly stable ${intimacyScore}%.`,
    whyThisResult: `Reflects driver mutual attraction indices modified by Lo Shu emotional plane coordination.`
  };

  const spiritualMetric: CompatibilityMetric = {
    score: spiritualScore,
    rating: getCategoryRating(spiritualScore),
    explanation: `Soul evolution and support during dark transits registers at ${spiritualScore}%.`,
    whyThisResult: `Based on karmic indicators and Conductor compatibility which direct long-term spiritual growth.`
  };

  // Generate dynamic actionable conflict areas
  const conflicts: { area: string; riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'; description: string; advice: string }[] = [];
  if (relDriver === 0) {
    conflicts.push({
      area: 'Ego Clashes in Daily Decisions',
      riskLevel: 'HIGH',
      description: `Because Driver ${m1} (${getPlanetName(m1)}) and Driver ${m2} (${getPlanetName(m2)}) have contradictory approaches to authority.`,
      advice: 'Implement a clear rule: Partner 1 retains veto rights in domestic setups, and Partner 2 retains veto in financial investments.'
    });
  }
  if (karmicWarning) {
    conflicts.push({
      area: 'Sudden Unexpressed Distrust Intervals',
      riskLevel: 'MEDIUM',
      description: 'Triggered by karmic warning parameters, generating periods of silence or sudden withdrawal.',
      advice: 'Vow to discuss small relationship irritations every Friday evening over light meals to prevent residue storage.'
    });
  }
  if (PLANETARY_RELS[n1]?.[n2] === 0) {
    conflicts.push({
      area: 'Public Social Disagreements',
      riskLevel: 'MEDIUM',
      description: 'Your names have conflicting Chaldean roots, which can cause misunderstandings during large circle gatherings.',
      advice: 'Avoid entering arguments in public arenas. Standardize your signatures with upwards starting blocks to maintain composure.'
    });
  }
  if (conflicts.length === 0) {
    conflicts.push({
      area: 'Minor Domestic Schedule Friction',
      riskLevel: 'LOW',
      description: 'Standard household adjustment loops occurring under planetary transit changes.',
      advice: 'Maintain a clean copper water vessel in the north-east zone of the master bedroom.'
    });
  }

  // Generate dynamic, realistic growth plans
  const growth: { area: string; benefit: string; plan: string }[] = [
    {
      area: 'Mutual Wealth Compounding',
      benefit: 'Launches multiple commercial income channels and clears real estate blockages.',
      plan: `Since Partner 1 fills ${p2SavesP1} voids for Partner 2, sign all joint investment papers on a Thursday morning holding yellow-gold metals.`
    },
    {
      area: 'Empathetic Transparent Space',
      benefit: 'Dissolves hidden emotional stress waves completely.',
      plan: `Install a joint photograph in a premium silver frame in the South-West sector of the living room.`
    }
  ];

  return {
    overallScore: overallStability,
    overallRating: overallStability >= 85 ? 'EXCELLENT STABILITY' : overallStability >= 70 ? 'GOOD ALIGNMENT' : 'REQUIRES REMEDIAL SHIELD',
    overallExplanation: overallStability >= 85 
      ? 'An outstandingly supportive relationship. Harmonious drivers and complementary Lo Shu grids guarantee deep long-term companionship.'
      : overallStability >= 70 
      ? 'A robust, protective relationship. Generates stable home zones but requires proactive discussion to bypass minor ego hurdles.'
      : 'A challenging alignment. High planetary opposition found. Strongly recommended to perform daily Sun water rituals and name spelling upgrades.',
    layers: {
      driver: driverMetric,
      conductor: condMetric,
      compound: compMetric,
      name: nameMetric,
      mobile: mobMetric,
      loshu: loshuMetric,
      arrow: arrowMetric,
      missingNumber: missingMetric,
      karmic: karmicMetric,
      planetary: planetaryMetric
    },
    categories: {
      emotional: emotionalMetric,
      communication: communicationMetric,
      financial: financialMetric,
      family: familyMetric,
      intimacy: intimacyMetric,
      spiritual: spiritualMetric
    },
    conflictAreas: conflicts,
    growthAreas: growth,
    indicators: {
      isSoulmate,
      karmicWarning
    }
  };
}

function getPlanetName(num: number): string {
  const ps: Record<number, string> = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
  };
  return ps[num] || 'Sovereign';
}

function getCategoryRating(score: number): string {
  if (score >= 85) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  return 'OK (REMEDIES SUGGESTED)';
}

function getCategoryDesc(score: number): string {
  if (score >= 85) return 'highly harmonious, resilient, and deeply satisfying';
  if (score >= 70) return 'stable, dependable, and generally highly smooth';
  return 'dependent on emotional patience and planetary remedies';
}

function calculateChaldeanNameSum(name: string): number {
  const map: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };
  return name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((acc, char) => acc + (map[char] || 0), 0);
}

function getMobileReducedSum(mobile: string): number {
  const digits = mobile.replace(/[^0-9]/g, '');
  let sum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return sum;
}

function reduceToSingleDigit(num: number): number {
  if (num === 0) return 0;
  let s = Math.abs(num);
  while (s > 9) {
    s = s.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return s;
}
