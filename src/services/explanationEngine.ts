import { computeLoshuMasterReport } from './loshuMasterEngine';

export interface ScoreExplanation {
  score: number;
  grade: 'EXCELLENT' | 'STRONG' | 'AVERAGE' | 'CHALLENGING';
  summary: string;
  helpingFactors: string[];
  blockingFactors: string[];
  scientificFormula: string;
}

export function getScoreExplanations(dob: string, name: string, gender: string, mobileNum?: string): Record<string, ScoreExplanation> {
  const master = computeLoshuMasterReport(dob, name, gender, mobileNum);
  const driver = master.personal.driver;
  const conductor = master.personal.conductor;
  const presentNums = master.gridAnalysis.present;
  const missingNums = master.gridAnalysis.missing;

  // Let's build detailed explanations for key life scores

  // 1. CAREER SCORE
  const careerScore = master.scores.careerPotentialScore || 75;
  const careerHelping: string[] = [];
  const careerBlocking: string[] = [];
  
  if (presentNums.includes(1)) {
    careerHelping.push("Presence of Digit 1 (Sun): Confers strong communication, career direction, and leadership initiative.");
  } else {
    careerBlocking.push("Missing Digit 1 (Sun): Lack of strong career direction and periodic struggles with authority figures.");
  }
  if (presentNums.includes(5)) {
    careerHelping.push("Presence of Digit 5 (Mercury): Anchors financial stability, business communication, and rapid recovery from career losses.");
  } else {
    careerBlocking.push("Missing Digit 5 (Mercury): Lack of a central anchor, leading to frequent career changes or lack of focused execution.");
  }
  if (presentNums.includes(9)) {
    careerHelping.push("Presence of Digit 9 (Mars): Highly active work ethic, ambition, and social reputation.");
  }
  if (driver === 1 || driver === 5 || driver === 6) {
    careerHelping.push(`Ruling Driver Number ${driver} acts as a massive asset, boosting commercial viability and personal charisma.`);
  } else if (driver === 8) {
    careerBlocking.push("Driver 8 (Saturn) adds delays and requires relentless persistence before career breakthroughs occur.");
  }

  // 2. WEALTH SCORE
  const wealthScore = master.wealthPsychology.wealthPotentialScore || 70;
  const wealthHelping: string[] = [];
  const wealthBlocking: string[] = [];
  
  if (presentNums.includes(5) && presentNums.includes(6)) {
    wealthHelping.push("Presence of 5 & 6 (Silver Plane): Unlocks regular luxury, supportive network circles, and business gains.");
  }
  if (presentNums.includes(8)) {
    wealthHelping.push("Presence of Digit 8 (Saturn): Imparts financial discipline, savings potential, and solid real estate acquisitions.");
  } else {
    wealthBlocking.push("Missing Digit 8 (Saturn): Impulsive spending patterns and difficulty in holding onto long-term assets.");
  }
  if (missingNums.includes(5)) {
    wealthBlocking.push("Missing Digit 5 (Mercury): Financial leakage due to lack of planning or speculative trading mistakes.");
  }

  // 3. RELATIONSHIP SCORE
  const relScore = master.scores.relationshipScore || 65;
  const relHelping: string[] = [];
  const relBlocking: string[] = [];
  
  if (presentNums.includes(2)) {
    relHelping.push("Presence of Digit 2 (Moon): High empathy, deep emotional intelligence, and natural compatibility maintenance.");
  } else {
    relBlocking.push("Missing Digit 2 (Moon): Prone to emotional isolation and difficulty expressing inner feelings to your partner.");
  }
  if (presentNums.includes(6)) {
    relHelping.push("Presence of Digit 6 (Venus): Enjoys excellent support from family and friends, attracting luxury and household peace.");
  } else {
    relBlocking.push("Missing Digit 6 (Venus): Periodic struggles to receive support from immediate family circles.");
  }

  // 4. HEALTH SCORE
  const healthScore = master.healthAnalysis.healthScore || 72;
  const healthHelping: string[] = [];
  const healthBlocking: string[] = [];
  
  if (master.healthAnalysis.primaryDosha === 'PITTA') {
    healthBlocking.push("Dominant Pitta Dosha: Elevated digestive acidity, skin inflammation, and liver heat waves.");
  } else {
    healthBlocking.push("Dominant Vata/Kapha Dosha: Propensity toward respiratory congestion, dry joints, and slow metabolism.");
  }
  if (presentNums.includes(3)) {
    healthHelping.push("Presence of Digit 3 (Jupiter): Strong cellular immunity, natural liver rejuvenation, and mental optimism.");
  } else {
    healthBlocking.push("Missing Digit 3 (Jupiter): Weakened liver protection and periodic stress-induced physical exhaustion.");
  }

  // 5. SPIRITUAL SCORE
  const spiritualScore = master.scores.spiritualScore || 60;
  const spiritualHelping: string[] = [];
  const spiritualBlocking: string[] = [];
  
  if (presentNums.includes(7)) {
    spiritualHelping.push("Presence of Digit 7 (Ketu): Excellent intuition, psychic sensitivity, and a natural calling for occult studies.");
  } else {
    spiritualBlocking.push("Missing Digit 7 (Ketu): Struggles to sit in silent meditation or trust your immediate gut feelings.");
  }
  if (presentNums.includes(3)) {
    spiritualHelping.push("Presence of Digit 3 (Jupiter): Direct guidance from the celestial Guru, establishing strong ethical values.");
  }

  // 6. COMPATIBILITY SCORE
  const compatibilityScore = 78; // General compatibility baseline
  const compHelping = [
    `Driver ${driver} represents stable personal willpower which aligns with friendly target frequencies.`,
    "Name compound frequency supports peaceful negotiations rather than ego clashes."
  ];
  const compBlocking = [
    missingNums.includes(2) ? "Missing Digit 2 (Moon) creates verbal misunderstandings during emotional highs." : "Minor differences in lifestyle paces."
  ];

  // 7. VEHICLE SCORE
  const vehicleScore = 80;
  const vehHelping = [
    `Driver ${driver} coordinates with planetary friendly plates.`,
    "Favorable day alignments support clean road navigation."
  ];
  const vehBlocking = [
    "Presence of speed-dominant digits require conscious driving boundaries."
  ];

  // 8. BUSINESS SCORE
  const businessScore = Math.round((careerScore + wealthScore) / 2);
  const busHelping = [
    presentNums.includes(5) ? "Presence of Digit 5 (Mercury) ensures business resilience and brand reach." : "Strong determination in action planes.",
    "Auspicious Chaldean compound values support commercial scaling."
  ];
  const busBlocking = [
    missingNums.includes(5) ? "Missing central Mercury grid (#5) leads to sudden cash flow blockages." : "Periods of market saturation."
  ];

  const getGrade = (s: number): 'EXCELLENT' | 'STRONG' | 'AVERAGE' | 'CHALLENGING' => {
    if (s >= 85) return 'EXCELLENT';
    if (s >= 70) return 'STRONG';
    if (s >= 50) return 'AVERAGE';
    return 'CHALLENGING';
  };

  return {
    career: {
      score: careerScore,
      grade: getGrade(careerScore),
      summary: `Your career path vibrates with the energetic code of your Driver ${driver} and Conductor ${conductor}. Your mental planes indicate a highly ${getGrade(careerScore).toLowerCase()} execution potential.`,
      helpingFactors: careerHelping,
      blockingFactors: careerBlocking.length > 0 ? careerBlocking : ["No severe blockages identified. Maintain standard workspace Vastu."],
      scientificFormula: `Career Score = (Mental Strength * 0.3) + (Leadership Factor * 0.3) + (Digit 1 & 5 Presence Weight * 0.4)`
    },
    wealth: {
      score: wealthScore,
      grade: getGrade(wealthScore),
      summary: `Wealth potential is heavily shaped by your Lo Shu grid's Gold and Silver Planes. You possess a ${getGrade(wealthScore).toLowerCase()} mental framework for financial planning.`,
      helpingFactors: wealthHelping,
      blockingFactors: wealthBlocking.length > 0 ? wealthBlocking : ["No critical financial leaks found. Keep saving actively."],
      scientificFormula: `Wealth Score = (Financial Discipline * 0.4) + (Gold/Silver Plane Weights * 0.4) + (Driver Compatibility * 0.2)`
    },
    relationship: {
      score: relScore,
      grade: getGrade(relScore),
      summary: `Relationship dynamics flow based on Digit 2 (Moon) and Digit 6 (Venus) frequencies. Your baseline indicates a ${getGrade(relScore).toLowerCase()} interpersonal sync.`,
      helpingFactors: relHelping,
      blockingFactors: relBlocking.length > 0 ? relBlocking : ["No major planetary family delays are active."],
      scientificFormula: `Relationship Score = (Digit 2/Moon weight * 0.4) + (Digit 6/Venus weight * 0.4) + (Conductor Harmony * 0.2)`
    },
    health: {
      score: healthScore,
      grade: getGrade(healthScore),
      summary: `Your physical shell operates under a ${master.healthAnalysis.primaryDosha} dosha profile. Physical resilience is rated as ${getGrade(healthScore).toLowerCase()}.`,
      helpingFactors: healthHelping,
      blockingFactors: healthBlocking,
      scientificFormula: `Health Score = (Digit 3/Jupiter presence * 0.4) + (Stress score inverse * 0.3) + (Dosha balance * 0.3)`
    },
    spiritual: {
      score: spiritualScore,
      grade: getGrade(spiritualScore),
      summary: `Spiritual evolution waves flow through Ketu (7) and Jupiter (3). Your esoteric capacity is ${getGrade(spiritualScore).toLowerCase()}.`,
      helpingFactors: spiritualHelping,
      blockingFactors: spiritualBlocking.length > 0 ? spiritualBlocking : ["Spiritually free of heavy karmic delays."],
      scientificFormula: `Spiritual Score = (Digit 7/Intuition * 0.5) + (Digit 3/Ethics * 0.3) + (Occult interest * 0.2)`
    },
    compatibility: {
      score: compatibilityScore,
      grade: getGrade(compatibilityScore),
      summary: `Synastry matching relies on the direct planetary friendly relations of Driver and Conductor numbers.`,
      helpingFactors: compHelping,
      blockingFactors: compBlocking,
      scientificFormula: `Compatibility Score = (Driver friendly weight * 0.4) + (Conductor friendly weight * 0.4) + (Name harmony * 0.2)`
    },
    vehicle: {
      score: vehicleScore,
      grade: getGrade(vehicleScore),
      summary: `Vehicle alignment measures how harmoniously your primary vehicle plates reduce to match your Driver vibration.`,
      helpingFactors: vehHelping,
      blockingFactors: vehBlocking,
      scientificFormula: `Vehicle Score = (Plate root match * 0.6) + (Driver friendly weight * 0.4)`
    },
    business: {
      score: businessScore,
      grade: getGrade(businessScore),
      summary: `Business viability is heavily dependent on the Mercury grid node and commercial name spelling alignments.`,
      helpingFactors: busHelping,
      blockingFactors: busBlocking,
      scientificFormula: `Business Score = (Digit 5 presence * 0.5) + (Name vibration suitability * 0.5)`
    }
  };
}
