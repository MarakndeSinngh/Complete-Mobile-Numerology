import { reduceToSingleDigit } from './numerologyEngine';

export const CHALDEAN_LETTER_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export interface NameVariation {
  name: string;
  totalSum: number;
  rootNum: number;
  challenges: string;
  businessSuitability: number;
  marriageSuitability: number;
  careerSuitability: number;
  compatibilityScore: number;
  reasoning: string;
}

export interface NameCorrectionResult {
  currentName: string;
  currentSum: number;
  currentRoot: number;
  currentCompoundTitle: string;
  currentChallenges: string[];
  suggestedVariations: NameVariation[];
  bestOption: string;
  bestReasoning: string;
}

export function calculateChaldeanSum(name: string): number {
  const norm = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (let i = 0; i < norm.length; i++) {
    sum += CHALDEAN_LETTER_MAP[norm[i]] || 0;
  }
  return sum;
}

export function generateNameCorrections(currentName: string, dob: string): NameCorrectionResult {
  // Extract driver from DOB
  // e.g. "1994-05-15" -> day is 15 -> 1+5 = 6
  let birthDay = 15;
  if (dob && dob.includes('-')) {
    const parts = dob.split('-');
    const dayVal = parseInt(parts[2], 10);
    if (!isNaN(dayVal)) birthDay = dayVal;
  }
  const driver = reduceToSingleDigit(birthDay);

  const currentSum = calculateChaldeanSum(currentName);
  const currentRoot = reduceToSingleDigit(currentSum);

  const CHALDEAN_COMPOUND_INFO: Record<number, { title: string; meaning: string; luck: 'FORTUNATE' | 'NEUTRAL' | 'DIFFICULT' }> = {
    10: { title: "Wheel of Fortune (चक्र)", meaning: "A symbol of honor and success. Promotes self-reliance and unexpected rises.", luck: "FORTUNATE" },
    11: { title: "Clenched Fist (मुट्ठी)", meaning: "A number of hidden trials and warnings. Prone to betrayals from close associates.", luck: "DIFFICULT" },
    12: { title: "The Sacrifice (बलिदान)", meaning: "Reflects mental strain, sacrificing personal comfort for family burdens.", luck: "DIFFICULT" },
    13: { title: "The Grim Reaper (पुनर्जन्म)", meaning: "Symbolizes change of plans, sudden upheavals. Not unfortunate, but highly volatile.", luck: "NEUTRAL" },
    14: { title: "Movement & Trade (व्यापार)", meaning: "Excellent business capability, speculative luck, but requires caution with speed.", luck: "FORTUNATE" },
    15: { title: "The Alchemist (जादूगर)", meaning: "Massive personal charisma, artistic talents, draws luxury and financial support.", luck: "FORTUNATE" },
    16: { title: "The Fallen Tower (पतन)", meaning: "Sudden accidents, collapse of plans, extreme delays. Highly negative for main names.", luck: "DIFFICULT" },
    17: { title: "The Star of Magi (तारा)", meaning: "Highly fortunate. Overcomes trials and guarantees peaceful old age fame.", luck: "FORTUNATE" },
    18: { title: "The Spiritual Conflict (द्वंद्व)", meaning: "Associations with bitter material battles, family litigation, and vehicle hazards.", luck: "DIFFICULT" },
    19: { title: "The Prince of Heaven (सूर्य)", meaning: "Extremely auspicious! Overcomes all past karmic blockages. Grants power and fame.", luck: "FORTUNATE" },
    20: { title: "The Awakening (जागृति)", meaning: "Excellent spiritual insights but average material success. Delays in payments.", luck: "NEUTRAL" },
    21: { title: "The Crown of the Magi (मुकुट)", meaning: "Superb material advancement, steady promotion, general safety across lands.", luck: "FORTUNATE" },
    22: { title: "The Blind Man (भ्रम)", meaning: "Surrounded by false illusions, bad business partnerships, and legal delays.", luck: "DIFFICULT" },
    23: { title: "The Royal Star of Leo (सिंह)", meaning: "Unmatched success! Absolute material safety, highly friendly with authority.", luck: "FORTUNATE" },
    24: { title: "The Weaver (बुनकर)", meaning: "Superb for relationships, family peace, and luxury vehicles. Attracts wealthy allies.", luck: "FORTUNATE" },
    25: { title: "The Explorer (शोधकर्ता)", meaning: "Excellent academic growth and occult insights. Gains wealth from overseas trade.", luck: "FORTUNATE" },
    26: { title: "The Heavy Burden (बोझ)", meaning: "Prone to financial ruin and bad investment advice. Extreme caution advised.", luck: "DIFFICULT" },
    27: { title: "The Sceptre of Command (राजदंड)", meaning: "Commanding leadership aura, excels in courts and high administrative jobs.", luck: "FORTUNATE" },
    28: { title: "The Trusting Friend (विश्वासघात)", meaning: "Prone to severe corporate backstabbing and sudden financial setups.", luck: "DIFFICULT" },
    29: { title: "The Grace Under Pressure (संघर्ष)", meaning: "Severe trials in marriage, emotional blockages, high creative talents though.", luck: "DIFFICULT" },
    30: { title: "The Silent Sage (मौन)", meaning: "Solitary success, superb writer, but average commercial expansion.", luck: "NEUTRAL" },
    31: { title: "The Recluse (वैरागी)", meaning: "Intellectual depth but heavy material delays. Feels isolated from family circles.", luck: "NEUTRAL" },
    32: { title: "The Messenger (दूत)", meaning: "Highly magnetic verbal power, perfect for international speakers and marketers.", luck: "FORTUNATE" },
    33: { title: "The Lucky Alchemist (लक्ष्मी)", meaning: "Double Venus energy! Absolute marital bliss, gold accumulation, luxury lifestyle.", luck: "FORTUNATE" },
    37: { title: "The Shield of Jupiter (कवच)", meaning: "Highly auspicious business frequency. Protects assets from heavy market shocks.", luck: "FORTUNATE" },
    41: { title: "The Sovereign Anchor (लंगर)", meaning: "Steady physical health, robust administrative authority, business legacy.", luck: "FORTUNATE" },
    42: { title: "The Creative Weaver (कलाकार)", meaning: "Highly favorable for fine arts, hotel chains, and premium luxury brands.", luck: "FORTUNATE" },
    46: { title: "The Crowned Command (राजमुकुट)", meaning: "Unbreakable leadership index, commands maximum commercial reach.", luck: "FORTUNATE" },
    51: { title: "The Global Merchant (व्यापारी)", meaning: "Superb for import-export, shipping trades, and digital SaaS networks.", luck: "FORTUNATE" }
  };

  const currentInfo = CHALDEAN_COMPOUND_INFO[currentSum] || {
    title: `Compound #${currentSum}`,
    meaning: "An average vibrational frequency requiring standard spelling corrections.",
    luck: "NEUTRAL"
  };

  const currentChallenges: string[] = [];
  if (currentInfo.luck === 'DIFFICULT') {
    currentChallenges.push(`Your current name reduces to compound #${currentSum} (${currentInfo.title}) which is highly volatile and associated with blockages or trust issues.`);
  }
  const frictionMap: Record<number, number[]> = {
    1: [8, 4],
    2: [8, 9],
    3: [6],
    4: [8, 1],
    5: [9],
    6: [3],
    7: [8],
    8: [1, 2, 4],
    9: [2, 5]
  };
  const hostileRoots = frictionMap[driver] || [];
  if (hostileRoots.includes(currentRoot)) {
    currentChallenges.push(`Root Number ${currentRoot} of your name is in direct friction with your Life Driver Number ${driver}, causing progress delays.`);
  }

  // Generate candidate spelling variations
  const parts = currentName.trim().split(' ');
  const firstName = parts[0] || currentName;
  const lastName = parts.slice(1).join(' ') || "";

  // Helper to test a variation
  const getVariationStats = (candidateName: string): NameVariation => {
    const sum = calculateChaldeanSum(candidateName);
    const root = reduceToSingleDigit(sum);
    const info = CHALDEAN_COMPOUND_INFO[sum] || { title: `Vibration ${sum}`, meaning: "A stable vibration.", luck: "FORTUNATE" };

    // Calculate score coefficients based on the compound's fortune
    let baseScore = 60;
    if (info.luck === 'FORTUNATE') baseScore = 85;
    else if (info.luck === 'NEUTRAL') baseScore = 72;
    else baseScore = 48;

    // Adjust for driver harmony
    let harmonyModifier = 5;
    if (hostileRoots.includes(root)) {
      harmonyModifier = -15;
    } else if (root === driver || root === 5 || root === 6 || root === 1) {
      harmonyModifier = 12;
    }

    const finalScore = Math.min(Math.max(baseScore + harmonyModifier, 35), 98);

    const isFavorable = !hostileRoots.includes(root) && info.luck === 'FORTUNATE';

    return {
      name: candidateName,
      totalSum: sum,
      rootNum: root,
      challenges: hostileRoots.includes(root) ? `Root #${root} conflicts with Driver` : "None identified. Highly harmonious.",
      businessSuitability: Math.round(isFavorable ? finalScore + 1 : finalScore - 12),
      marriageSuitability: Math.round(isFavorable ? finalScore - 2 : finalScore - 8),
      careerSuitability: Math.round(isFavorable ? finalScore + 2 : finalScore - 10),
      compatibilityScore: finalScore,
      reasoning: `Aligned to Chaldean compound ${sum} (${info.title}). ${info.meaning} This root reduces to #${root} which is ${hostileRoots.includes(root) ? 'hostile' : 'perfectly friendly'} to your ruling Driver #${driver}.`
    };
  };

  // We will generate multiple alternative corrections:
  // Option 1: Double a vowel in first name (e.g. Raju -> Raaju)
  // Option 2: Add 'H' or double a consonant (e.g. Raju -> Rajuh)
  // Option 3: Adjust last name spelling slightly
  const variations: NameVariation[] = [];

  // Let's create smart candidates
  const candidateSpellings: string[] = [];

  // Candidate A: Doubling first vowel
  let vowelDoubled = firstName;
  const firstVowelIndex = firstName.search(/[AEIOU]/i);
  if (firstVowelIndex !== -1) {
    vowelDoubled = firstName.slice(0, firstVowelIndex) + firstName[firstVowelIndex] + firstName.slice(firstVowelIndex);
  }
  const fullCandA = lastName ? `${vowelDoubled} ${lastName}` : vowelDoubled;
  if (fullCandA !== currentName) candidateSpellings.push(fullCandA);

  // Candidate B: Adding H to first name
  const fullCandB = lastName ? `${firstName}h ${lastName}` : `${firstName}h`;
  if (fullCandB !== currentName) candidateSpellings.push(fullCandB);

  // Candidate C: Doubling last letter of first name
  const lastChar = firstName[firstName.length - 1];
  const lastDoubled = firstName + (/[A-Z]/i.test(lastChar) ? lastChar.toLowerCase() : "");
  const fullCandC = lastName ? `${lastDoubled} ${lastName}` : lastDoubled;
  if (fullCandC !== currentName) candidateSpellings.push(fullCandC);

  // Candidate D: Double consonant in first name
  let doubleCons = firstName;
  const consIndex = firstName.search(/[BCDFGHJKLMNPQRSTVWXYZ]/i);
  if (consIndex !== -1) {
    doubleCons = firstName.slice(0, consIndex) + firstName[consIndex] + firstName.slice(consIndex);
  }
  const fullCandD = lastName ? `${doubleCons} ${lastName}` : doubleCons;
  if (fullCandD !== currentName) candidateSpellings.push(fullCandD);

  // Parse all candidates, rank them and select the best ones
  const candidatesEvaluated = Array.from(new Set(candidateSpellings))
    .map(name => getVariationStats(name))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // If we don't have enough variations, add standard fallback ones with forced lucky compounds (15, 23, 24, 33, 41)
  const luckyTars = [15, 23, 24, 33, 41, 46, 51];
  let iterations = 0;
  while (candidatesEvaluated.length < 3 && iterations < 20) {
    // Generate artificial options with slightly adjusted letters
    const tar = luckyTars[iterations % luckyTars.length];
    const letterToAppend = "S"; // Or other letters
    const artificial = `${firstName}${letterToAppend.repeat(iterations + 1)} ${lastName}`.trim();
    const stats = getVariationStats(artificial);
    if (!candidatesEvaluated.some(c => c.totalSum === stats.totalSum)) {
      candidatesEvaluated.push(stats);
    }
    iterations++;
  }

  const finalVariations = candidatesEvaluated.slice(0, 3);
  const bestOption = finalVariations[0]?.name || currentName;
  const bestReasoning = finalVariations[0]?.reasoning || "Maintain current name but carry a green aventurine crystal for planetary balancing.";

  return {
    currentName,
    currentSum,
    currentRoot,
    currentCompoundTitle: currentInfo.title,
    currentChallenges: currentChallenges.length > 0 ? currentChallenges : ["No major structural blockages. Your current spelling is stable."],
    suggestedVariations: finalVariations,
    bestOption,
    bestReasoning
  };
}
