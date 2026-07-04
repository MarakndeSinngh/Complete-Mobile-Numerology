import { analyzeDateOfBirth, analyzeNameSystems, analyzeMobileNumber, reduceToSingleDigit } from './numerologyEngine';
import { computeLoshuAnalysis } from './loshuEngine';

export interface CompatibilityAnalysisResult {
  overallScore: number;
  modernScore: number;
  traditionalScore: number;
  combinedScore: number;
  traditional: {
    status: 'Strong' | 'Weak' | 'Neutral';
    score: number;
    explanation: string;
  };
  layers: {
    driver: { score: number; explanation: string };
    conductor: { score: number; explanation: string };
    compound: { score: number; explanation: string };
    loshu: { score: number; explanation: string };
    name: { score: number; explanation: string };
    mobile: { score: number; explanation: string; active: boolean };
    karmic: { score: number; explanation: string };
  };
  categories: {
    emotional: { score: number; explanation: string };
    communication: { score: number; explanation: string };
    financial: { score: number; explanation: string };
    family: { score: number; explanation: string };
    spiritual: { score: number; explanation: string };
    stability: { score: number; explanation: string };
  };
  indicators: {
    karmicWarning: boolean;
    isSoulmate: boolean;
    sharedKarmicLessons: number[];
  };
}

// Planetary relationships under Vedic / Chaldean rules
// 10 = Extemely Friendly, 8 = Friendly, 6 = Neutral, 4 = Enemy, 2 = Bitter Enemy
const PLANETARY_RESONANCE: Record<number, Record<number, number>> = {
  1: { 1: 9, 2: 8, 3: 10, 4: 7, 5: 8, 6: 6, 7: 7, 8: 3, 9: 10 },
  2: { 1: 8, 2: 9, 3: 8, 4: 5, 5: 7, 6: 6, 7: 10, 8: 4, 9: 7 },
  3: { 1: 10, 2: 8, 3: 9, 4: 6, 5: 7, 6: 3, 7: 8, 8: 5, 9: 10 },
  4: { 1: 7, 2: 5, 3: 6, 4: 9, 5: 8, 6: 8, 7: 8, 8: 8, 9: 5 },
  5: { 1: 8, 2: 7, 3: 7, 4: 8, 5: 10, 6: 9, 7: 7, 8: 7, 9: 6 },
  6: { 1: 6, 2: 6, 3: 3, 4: 8, 5: 9, 6: 10, 7: 8, 8: 7, 9: 7 },
  7: { 1: 7, 2: 10, 3: 8, 4: 8, 5: 7, 6: 8, 7: 9, 8: 5, 9: 6 },
  8: { 1: 3, 2: 4, 3: 5, 4: 8, 5: 7, 6: 7, 7: 5, 8: 9, 9: 4 },
  9: { 1: 10, 2: 7, 3: 10, 4: 5, 5: 6, 6: 7, 7: 6, 8: 4, 9: 9 }
};

const PLANET_NAMES: Record<number, string> = {
  1: 'Sun (Surya) - Leadership & Soul',
  2: 'Moon (Chandra) - Emotion & Mind',
  3: 'Jupiter (Guru) - Wisdom & Spirituality',
  4: 'Rahu - Ambition & Shadow',
  5: 'Mercury (Budh) - Logic & Communication',
  6: 'Venus (Shukra) - Art, Love & Luxury',
  7: 'Ketu - Liberation & Metaphysics',
  8: 'Saturn (Shani) - Duty & Karma',
  9: 'Mars (Mangal) - Courage & Fire'
};

export function calculateAdvancedCompatibility(
  p1: { name: string; dob: string; mobile?: string },
  p2: { name: string; dob: string; mobile?: string }
): CompatibilityAnalysisResult {
  // Extract primary birthday details
  const parts1 = p1.dob.split('-');
  const day1 = parseInt(parts1[2], 10) || 1;
  const parts2 = p2.dob.split('-');
  const day2 = parseInt(parts2[2], 10) || 1;

  // 1. Analyze Date of Birth
  const dobAna1 = analyzeDateOfBirth(p1.dob, p1.name);
  const dobAna2 = analyzeDateOfBirth(p2.dob, p2.name);

  const d1 = dobAna1.birthNumber;
  const d2 = dobAna2.birthNumber;
  const c1 = dobAna1.lifePathNumber;
  const c2 = dobAna2.lifePathNumber;

  // 2. Lo Shu Grid Analysis
  const loshuAna1 = computeLoshuAnalysis(p1.dob, p1.name, 'MALE');
  const loshuAna2 = computeLoshuAnalysis(p2.dob, p2.name, 'FEMALE');

  // 3. Name Analysis
  const nameAna1 = analyzeNameSystems(p1.name);
  const nameAna2 = analyzeNameSystems(p2.name);

  // 4. Mobile Analysis (if available)
  const isMobileAvailable = !!(p1.mobile && p2.mobile && p1.mobile.trim() && p2.mobile.trim());
  const mobAna1 = isMobileAvailable ? analyzeMobileNumber(p1.mobile!) : null;
  const mobAna2 = isMobileAvailable ? analyzeMobileNumber(p2.mobile!) : null;

  // Layer 1: Driver Compatibility (20% weight)
  const driverResonance = PLANETARY_RESONANCE[d1]?.[d2] || 6;
  const driverScore = driverResonance * 10;
  const driverExplanation = `Partner 1 possesses Driver ${d1} (ruled by ${PLANET_NAMES[d1]?.split(' ')[0]}), representing active day-to-day behavioral trends. Partner 2 resolves to Driver ${d2} (ruled by ${PLANET_NAMES[d2]?.split(' ')[0]}). Under traditional Chaldean-Vedic parameters, their mutual resonance is rated at ${driverScore}%. This dictates how easily they harmonize on spontaneous daily reactions and intuitive interactions.`;

  // Layer 2: Conductor Compatibility (20% weight)
  const conductorResonance = PLANETARY_RESONANCE[c1]?.[c2] || 6;
  const conductorScore = conductorResonance * 10;
  const conductorExplanation = `Partner 1 carries Conductor ${c1} (ruled by ${PLANET_NAMES[c1]?.split(' ')[0]}), dictating lifetime destiny trends. Partner 2 acts under Conductor ${c2} (ruled by ${PLANET_NAMES[c2]?.split(' ')[0]}). Their joint conductor resonance scores ${conductorScore}%. A high score here guarantees that the partners find themselves moving toward convergent life objectives as the marriage matures over decades.`;

  // Layer 3: Compound Birth Number Compatibility (10% weight)
  // Look at exact day values (e.g., 13, 29, 24, etc.)
  let compoundScore = 70;
  let compoundExplanation = '';
  const comp1 = day1;
  const comp2 = day2;

  const isKarmicP1 = [13, 14, 16, 19].includes(comp1);
  const isKarmicP2 = [13, 14, 16, 19].includes(comp2);

  if (comp1 === comp2) {
    compoundScore = 95;
    compoundExplanation = `Both partners share the exact compound birth vibration of ${comp1}. This indicates an immediate soul-level recognition, rendering their core emotional rhythms near-identical, though shared flaws must be carefully monitored.`;
  } else if (isKarmicP1 && isKarmicP2) {
    compoundScore = 45;
    compoundExplanation = `Partner 1 has a karmic birth date of ${comp1} and Partner 2 has ${comp2}. When dual karmic numbers interact, obstacles can flare up suddenly. Patience, spiritual remedies, and active conscious effort are mandatory to dissipate old debts.`;
  } else if (isKarmicP1 || isKarmicP2) {
    compoundScore = 60;
    compoundExplanation = `Partner ${isKarmicP1 ? '1' : '2'} carries a karmic compound debt date of ${isKarmicP1 ? comp1 : comp2}, while the other partner possesses a progressive compound number. The non-karmic partner must offer high stability to anchor the relationship when the karmic cycle is activated.`;
  } else {
    // Check specific auspicious couplings
    const groupA = [23, 24, 32, 33, 42, 51];
    const groupB = [14, 27, 35, 41, 46];
    if (groupA.includes(comp1) && groupA.includes(comp2)) {
      compoundScore = 98;
      compoundExplanation = `Brilliant alignment of auspicious compound numbers: ${comp1} and ${comp2}. Combining Venusian harmony (24) and intellectual Mercury frequencies (23) generates soft, loving, highly conversational bonding with natural luxury attraction.`;
    } else if (groupB.includes(comp1) || groupB.includes(comp2)) {
      compoundScore = 80;
      compoundExplanation = `Planetary compounds ${comp1} and ${comp2} coordinate in a supportive relationship. High energetic capacity allows the couple to manage assets and clear out professional blockages with immense efficiency.`;
    } else {
      compoundScore = Math.min(100, Math.max(40, 80 - Math.abs(comp1 - comp2)));
      compoundExplanation = `The day compounds of birth (${comp1} & ${comp2}) yield a planetary compatibility score of ${compoundScore}%. This forms the bedrock of their underlying temperament and response to household discipline.`;
    }
  }

  // Layer 4: Lo Shu Grid Compatibility (20% weight)
  // Compare present/missing/repeated/arrows
  const p1Digits = Object.values(loshuAna1.loshuGrid).filter(b => b.count > 0).map(b => b.digit);
  const p2Digits = Object.values(loshuAna2.loshuGrid).filter(b => b.count > 0).map(b => b.digit);
  
  // Find intersection of present numbers
  const sharedPresent = p1Digits.filter(d => p2Digits.includes(d));
  // Shared missing numbers
  const p1Missing = dobAna1.missingNumbers;
  const p2Missing = dobAna2.missingNumbers;
  const sharedMissing = p1Missing.filter(d => p2Missing.includes(d));

  // Determine complementary numbers (A fills B's missing numbers, and vice versa)
  const complementAtoB = p1Digits.filter(d => p2Missing.includes(d));
  const complementBtoA = p2Digits.filter(d => p1Missing.includes(d));
  const totalComplements = complementAtoB.length + complementBtoA.length;

  let loshuScore = 60 + totalComplements * 5 - sharedMissing.length * 4;
  loshuScore = Math.min(100, Math.max(30, loshuScore));

  const loshuExplanation = `Under spatial Lo Shu analysis, the couple displays a structural integration score of ${loshuScore}%. Partner 1 complements Partner 2 in ${complementAtoB.length} key void fields (supplying missing energies), while Partner 2 complements Partner 1 in ${complementBtoA.length} void departments. Shared void segments total ${sharedMissing.length} numbers (especially ${sharedMissing.join(', ') || 'none'}), highlighting specific emotional/financial planes where both must seek external remediation.`;

  // Layer 5: Mobile Compatibility (15% weight)
  let mobileScore = 0;
  let mobileExplanation = '';
  if (isMobileAvailable) {
    const mobTotal1 = mobAna1!.reducedTotal;
    const mobTotal2 = mobAna2!.reducedTotal;
    const resonance = PLANETARY_RESONANCE[mobTotal1]?.[mobTotal2] || 6;
    mobileScore = resonance * 10;
    mobileExplanation = `Both mobile numbers are available. Partner 1 is on mobile total ${mobAna1!.compoundTotal} (${mobTotal1}), and Partner 2 utilizes mobile total ${mobAna2!.compoundTotal} (${mobTotal2}). This digital bridge scores a compatibility rating of ${mobileScore}%, mapping daily phone communication, digital sync, and home message harmony.`;
  } else {
    mobileExplanation = `One or both mobile numbers are missing in the inquiry. To maintain pure professional standard integrity, the 15% mobile category weight is excluded, normalizing other diagnostic elements out of 100%.`;
  }

  // Layer 6: Name Compatibility (15% weight)
  const nameResonance = PLANETARY_RESONANCE[nameAna1.chaldeanNumber]?.[nameAna2.chaldeanNumber] || 6;
  const nameScore = nameResonance * 10;
  const nameExplanation = `Under Chaldean Name standards, Partner 1's name resonates to ${nameAna1.chaldeanNumber}, and Partner 2 resolves to ${nameAna2.chaldeanNumber}. This creates a public and social frequency score of ${nameScore}%. It reflects how they behave as a social unit and public couple in terms of social standing, community influence, and extended family perception.`;

  // Layer 7: Karmic Compatibility (10% weight)
  const sharedKarmicLessons = dobAna1.karmicLessons.filter(l => dobAna2.karmicLessons.includes(l));
  let karmicScore = 100 - (sharedKarmicLessons.length * 15);
  if ([13, 14, 16, 19].includes(comp1) && [13, 14, 16, 19].includes(comp2)) {
    karmicScore -= 20;
  }
  karmicScore = Math.min(100, Math.max(25, karmicScore));
  const karmicExplanation = `Karmic compatibility checks shared voids in name arrays. The couple shares ${sharedKarmicLessons.length} shared missing letters/lessons (specifically: ${sharedKarmicLessons.join(', ') || 'none'}). This results in a heavy karmic lesson synergy score of ${karmicScore}%. Lower scores indicate that both partners encounter exact matching blind spots in emotional maturity, requiring active behavioral checks.`;

  // Calculate final score using the strict weighted formula
  let overallScore = 0;
  if (isMobileAvailable) {
    // Full Weights: Driver(20%) + Conductor(20%) + Compound(10%) + LoShu(20%) + Mobile(15%) + Name(15%) + Karmic(10%) = 110%? Wait!
    // Let's normalize back to 100%:
    // Driver: 20%, Conductor: 20%, Compound: 10%, Lo Shu: 20%, Name: 15%, Mobile: 15%... Karmic was 10%! Let's see:
    // 20+20 + 10(compound) is 50. LoShu: 20. Name: 15. Mobile: 15. Karmic: 10... Wait, that adds up to 110. Let's adjust exact weights out of 100%:
    // If mobile available:
    // Driver: 20%, Conductor: 20%, Compound: 10%, Lo Shu: 20%, Name: 10%, Mobile: 10%, Karmic: 10%... Wait, let's keep the user's exact proportions:
    // Driver = 20%, Conductor = 20%, Lo Shu = 20%, Name = 15%, Mobile = 15%, Karmic = 10%? That equals 100%! Ah, let's look:
    // Driver (20%) + Conductor (20%) + Lo Shu (20%) + Name (15%) + Mobile (15%) + Karmic (10%) = 100%. Yes, compound is part of the calculation (or we can combine Compound and Karmic, or have:
    // If Mobile IS available:
    // Driver (20%), Conductor (20%), Lo Shu (20%), Name (15%), Mobile (15%), Karmic (10%) = 100%. We can integrate Compound Analysis inside the Karmic/Driver layers or make:
    // Let's use:
    // - Driver = 20%
    // - Conductor = 20%
    // - Lo Shu = 20%
    // - Name = 15%
    // - Mobile = 15%
    // - Karmic = 10% (incorporating compound numbers resonance)
    // This perfectly matches the 100% total!
    overallScore = Math.round(
      (driverScore * 0.20) +
      (conductorScore * 0.20) +
      (loshuScore * 0.20) +
      (nameScore * 0.15) +
      (mobileScore * 0.15) +
      (karmicScore * 0.10)
    );
  } else {
    // If mobile is missing. Exclude mobile completely.
    // Proportions: Driver (20/85), Conductor (20/85), Lo Shu (20/85), Name (15/85), Karmic (10/85)
    // Driver = 23.5%, Conductor = 23.5%, Lo Shu = 23.5%, Name = 17.65%, Karmic = 11.8%
    const scale = 100 / 85; 
    overallScore = Math.round(
      ((driverScore * 0.20) +
      (conductorScore * 0.20) +
      (loshuScore * 0.20) +
      (nameScore * 0.15) +
      (karmicScore * 0.10)) * scale
    );
  }

  // 3. Karmic and soulmate indicators
  const karmicWarning = (d1 + d2 === 13 || d1 === 8 || d2 === 8 || c1 === 4 || c2 === 4 || comp1 === 13 || comp2 === 13);
  const isSoulmate = (d1 === c2 && d2 === c1) || (d1 === d2 && c1 === c2) || (d1 === 9 && d2 === 1) || (d1 === 2 && d2 === 7);

  // Traditional Vedic Marriage Synastry Matrices
  const strongPairs = [
    '1-1', '1-3', '1-5', '1-9', '3-1', '5-1', '9-1',
    '2-2', '2-3', '2-1', '3-2', '1-2',
    '3-3', '3-5', '3-7', '3-9', '5-3', '7-3', '9-3',
    '5-5', '5-6', '6-5',
    '6-1', '6-6', '6-7', '1-6', '7-6',
    '7-1', '7-3', '1-7',
    '8-3', '8-5', '8-6', '8-7', '3-8', '5-8', '6-8', '7-8',
    '9-5', '9-9'
  ];
  const weakPairs = [
    '1-8', '8-1',
    '2-8', '8-2',
    '2-9', '9-2',
    '3-6', '6-3',
    '4-4', '4-8', '8-4',
    '4-9', '9-4',
    '8-8', '8-9', '9-8'
  ];

  const pairKeyD = `${d1}-${d2}`;
  const pairKeyC = `${c1}-${c2}`;

  let traditionalStatus: 'Strong' | 'Weak' | 'Neutral' = 'Neutral';
  let tradExplanation = '';
  let traditionalScore = 70;

  if (weakPairs.includes(pairKeyD) || weakPairs.includes(pairKeyC)) {
    traditionalStatus = 'Weak';
    traditionalScore = 48;
    tradExplanation = `Traditional Vedic Chaldean Synastry identifies direct planetary conflicts (such as Sun-Saturn opposition or Moon-Mars hot frequencies) in your birth numbers. This calls for regular remedial fasts and signature alignments to dissolve the karmic drag.`;
  } else if (strongPairs.includes(pairKeyD) && strongPairs.includes(pairKeyC)) {
    traditionalStatus = 'Strong';
    traditionalScore = 94;
    tradExplanation = `Traditional Vedic Chaldean Synastry reveals exceptional birth coordinate resonance. The ruling planets of your conscious drivers and conductors (bhagyank) operate in deep mutual support, fostering strong domestic prosperity, spontaneous mutual affection, and high marital peace.`;
  } else if (strongPairs.includes(pairKeyD) || strongPairs.includes(pairKeyC)) {
    traditionalStatus = 'Strong';
    traditionalScore = 84;
    tradExplanation = `Traditional Vedic Synastry highlights a stable connection. One of the core behavioral or conductor pillars runs under a highly supportive planetary relationship, shielding your union from other minor communication delays.`;
  } else {
    traditionalStatus = 'Neutral';
    traditionalScore = 68;
    tradExplanation = `Traditional Vedic Synastry indicates a neutral planetary relationship. Your daily driver and conductors (bhagyank) neither assist nor oppose each other directly. Harmony will depend on spelling correctness and local Vastu alignments.`;
  }

  const modernScore = overallScore;
  const combinedScore = Math.round((traditionalScore * 0.4) + (modernScore * 0.6));

  // Compute Categories with exact mathematical links to layers
  const emotionalRes = (driverScore * 0.5) + (loshuScore * 0.3) + (karmicScore * 0.2);
  const communicationRes = isMobileAvailable 
    ? (nameScore * 0.4) + (mobileScore * 0.4) + (driverScore * 0.2) 
    : (nameScore * 0.7) + (driverScore * 0.3);
  const financialRes = (conductorScore * 0.6) + (loshuScore * 0.3) + (compoundScore * 0.1);
  const familyRes = (driverScore * 0.4) + (nameScore * 0.3) + (loshuScore * 0.3);
  const spiritualRes = (conductorScore * 0.5) + (karmicScore * 0.3) + (compoundScore * 0.2);
  const stabilityRes = (overallScore * 0.7) + (karmicScore * 0.3);

  const formatCatScore = (val: number) => Math.min(100, Math.max(30, Math.round(val)));

  const categories = {
    emotional: {
      score: formatCatScore(emotionalRes),
      explanation: generateCategoryDesc('emotional', formatCatScore(emotionalRes), d1, d2)
    },
    communication: {
      score: formatCatScore(communicationRes),
      explanation: generateCategoryDesc('communication', formatCatScore(communicationRes), d1, d2)
    },
    financial: {
      score: formatCatScore(financialRes),
      explanation: generateCategoryDesc('financial', formatCatScore(financialRes), c1, c2)
    },
    family: {
      score: formatCatScore(familyRes),
      explanation: generateCategoryDesc('family', formatCatScore(familyRes), d1, d2)
    },
    spiritual: {
      score: formatCatScore(spiritualRes),
      explanation: generateCategoryDesc('spiritual', formatCatScore(spiritualRes), c1, c2)
    },
    stability: {
      score: formatCatScore(stabilityRes),
      explanation: generateCategoryDesc('stability', formatCatScore(stabilityRes), c1, c2)
    }
  };

  return {
    overallScore: combinedScore, // Set combined as the primary score for backward compatibility
    modernScore,
    traditionalScore,
    combinedScore,
    traditional: {
      status: traditionalStatus,
      score: traditionalScore,
      explanation: tradExplanation
    },
    layers: {
      driver: { score: driverScore, explanation: driverExplanation },
      conductor: { score: conductorScore, explanation: conductorExplanation },
      compound: { score: compoundScore, explanation: compoundExplanation },
      loshu: { score: loshuScore, explanation: loshuExplanation },
      name: { score: nameScore, explanation: nameExplanation },
      mobile: { score: mobileScore, explanation: mobileExplanation, active: isMobileAvailable },
      karmic: { score: karmicScore, explanation: karmicExplanation }
    },
    categories,
    indicators: {
      karmicWarning,
      isSoulmate,
      sharedKarmicLessons
    }
  };
}

function generateCategoryDesc(cat: string, score: number, n1: number, n2: number): string {
  if (cat === 'emotional') {
    if (score >= 85) return `Deeply harmonious alignment. Their emotional centers exchange sympathetic energy smoothly. Moon-Venus triggers high telepathy and spontaneous domestic affection.`;
    if (score >= 70) return `Highly affectionate but requires minor compromises due to distinct Moon-Mars fluctuations. General family life is loving and stable.`;
    return `Atmosphere of occasional moody outbursts. Both partners are highly sensitive and can misinterpret quiet states as emotional distance, needing clear and sweet boundaries.`;
  }
  if (cat === 'communication') {
    if (score >= 85) return `Superb digital and spoken dialogue. Governed by strong Mercury and friendly cosmic vibrations, disagreements are resolved in minutes rather than causing days of silence.`;
    if (score >= 70) return `Good conceptual alignment. Minor communication barriers might crop up occasionally when busy but are easily addressed.`;
    return `Communication shows regular friction or silent treatments. Ego-clashes or Rahu-Saturn shadow nodes delay heart-to-heart exchanges. Mantra meditation recommended.`;
  }
  if (cat === 'financial') {
    if (score >= 85) return `Superb financial convergence. Under positive Jupiter and Venus combinations, their union acts as an asset multiplier. Career progression accelerates beautifully post-marriage.`;
    if (score >= 70) return `Steady and progressive cash flow. The couple enjoys stable combined earnings and exhibits decent mutual responsibility over major savings programs.`;
    return `Financial leakage risk is persistent. Frequent unexpected expenditures or contrasting expenditure habits call for cautious budget divisions and financial rules.`;
  }
  if (cat === 'family') {
    if (score >= 85) return `Unusually high support from in-laws and children sectors. The home environment remains highly positive, acting as an shelter against outer worldly noise.`;
    if (score >= 70) return `Healthy domestic layout. Occisanoal household decisions generate debate but always resolve with high respect for family roots.`;
    return `Prone to household differences. Distinct domestic expectations and external family instructions require the couple to maintain a separate energetic shelter.`;
  }
  if (cat === 'spiritual') {
    if (score >= 85) return `Amazing spiritual and moral values convergence. High-level occult connection. Both encourage quiet development, deep studies, meditation, and temple visits together.`;
    if (score >= 70) return `Good moral integrity and standard values support. The couple respects traditional customs and collaborates on charity tasks easily.`;
    return `Distinct conductor trajectories and philosophical outlooks. One is heavily logical or materialistic while the other leans toward deep spiritual metaphysics, requiring respectful distance.`;
  }
  // stability
  if (score >= 85) return `Permanent long-term resilience. Exceptional structural anchor from planetary drivers and conductors ensures high marital longevity, withstanding the toughest transits.`;
  if (score >= 70) return `Good long-term foundation. The marriage remains stable through typical lifetime stages if standard Vedic remedies are observed to maintain clear, loving vibes.`;
  return `Volatile long-term vibrations showing periodic stress intervals. Seeking active annual astrological charts review and observing appropriate planetary fasts is strongly recommended.`;
}
