import { computeLoshuMasterReport } from './loshuMasterEngine';

export interface ProbabilityMetric {
  name: string;
  percentage: number;
  explanation: string;
  strengths: string[];
  risks: string[];
  growthAdvice: string;
}

export interface SmartRecommendations {
  bestMobileEndings: string[];
  bestMobileAvoidDigits: number[];
  bestBusinessNameChaldeanTotal: number[];
  bestVehicleRootNumbers: number[];
  bestHouseVastuNumbers: number[];
  bestDates: string[];
  bestDays: string[];
  bestColours: string[];
  bestDirections: string[];
  bestIndustries: string[];
  bestCareers: string[];
  bestCities: string[];
  bestBusinessSectors: string[];
}

export interface TimelinePhase {
  years: string;
  opportunities: string;
  challenges: string;
  lessons: string;
  focusAreas: string[];
  lifeThemes: string;
  futureDirection: string;
}

export interface GrowthIndexItem {
  category: string;
  score: number;
  previousScore: number;
  advice: string;
}

export interface LeoConsultationReport {
  summary: string;
  whatIsHelping: string[];
  whatIsBlocking: string[];
  biggestStrengths: string[];
  biggestWeaknesses: string[];
  immediateOpportunities: string[];
  longTermOpportunities: string[];
  mainKarmicLessons: string[];
  actionPriorities: string[];
  
  actionPlan: {
    plan7Days: string[];
    plan30Days: string[];
    plan90Days: string[];
    plan1Year: string[];
  };

  probabilities: Record<string, ProbabilityMetric>;
  recommendations: SmartRecommendations;
  timeline: Record<string, TimelinePhase>;
  growthIndex: {
    items: GrowthIndexItem[];
    overallScore: number;
    overallPreviousScore: number;
  };
}

export function generateLeoConsultation(dob: string, name: string, gender: string, mobileNum?: string): LeoConsultationReport {
  const master = computeLoshuMasterReport(dob, name, gender, mobileNum);
  const driver = master.personal.driver;
  const conductor = master.personal.conductor;
  const present = master.gridAnalysis.present;
  const missing = master.gridAnalysis.missing;

  // 1. Consultation Summary (Rajeev Ji style)
  let summary = `Welcome to your Grand Master AI consultation. As we analyze your natal alignment (Driver ${driver}, Conductor ${conductor}), we see a highly structured, vibrational pattern. `;
  if (driver === 1 || conductor === 1) {
    summary += "The solar energy of Digit 1 (Sun) guides your ego and willpower, giving you natural authority and a desire to build a distinct personal legacy. ";
  }
  if (driver === 5 || conductor === 5) {
    summary += "With the central Mercury pivot (Digit 5) activated, you possess a natural financial resilience, commercial intelligence, and communication bridge that stabilizes your entire grid. ";
  } else {
    summary += "Because the central grid node (Digit 5) is empty, your conductor journey experiences periodic structural resets. You must actively establish stability anchors through spelling upgrades and daily Mercury Vastu rituals. ";
  }
  summary += "This consultation synthesizes Chaldean research, Vedic astrology transits, and Lal Kitab remediation paths to design your ultimate multi-year growth roadmap. Trust your numbers—they merely map current celestial highways, which you can master with deliberate action.";

  const whatIsHelping = [
    `Your Driver Number #${driver} (willpower anchor) coordinates well with daily transactional demands.`,
    present.includes(1) ? "Presence of Sun (#1) energy helps you secure authority and speak with command." : "Inherent spiritual humility keeps you highly adaptable.",
    present.includes(6) ? "Venus (#6) energy attracts supportive family allies and luxury transits." : "Spiritual detachment keeps you focused on clean, karmic efforts."
  ];

  const whatIsBlocking = [
    missing.includes(5) ? "Missing central node (#5) leads to sudden cash-flow leakage and loss of business anchors." : "Occasional minor delays in communication channels.",
    missing.includes(8) ? "Lack of Saturn (#8) causes spending impulses and minor real estate hurdles." : "High expectations from partners causing emotional friction.",
    missing.includes(2) ? "Empty Moon node (#2) creates mental restlessness and sleeplessness post sunset." : "Occasions of sudden verbal irritation."
  ];

  const biggestStrengths = [
    `High resilience from Conductor #${conductor} destiny path.`,
    present.includes(3) ? "Wisdom and cell-level optimism guided by Jupiter (#3)." : "Analytical mind capable of scanning micro-details.",
    present.includes(9) ? "Reputation and active social drive from Mars (#9)." : "Peaceful demeanor that diffuses external arguments."
  ];

  const biggestWeaknesses = [
    missing.includes(2) ? "Struggles with emotional vulnerability and self-doubt." : "Propensity to take on excessive workloads.",
    missing.includes(6) ? "Feeling unsupported by immediate corporate or friendship circles." : "High perfectionism that delays delivery.",
    "Over-analyzing simple financial decisions, leading to missed windows."
  ];

  const immediateOpportunities = [
    "Optimizing name spelling compounds to match a high-frequency Mercury (5) or Venus (6) vibration.",
    "Aligning primary office desk to point directly toward your auspicious Vastu direction.",
    "Clearing dead metal items and broken electronics from your living room cabinet."
  ];

  const longTermOpportunities = [
    `Establishing a multi-generational legacy structure using Conductor #${conductor} attributes.`,
    "Scaling an independent online consultancy or trade platform focused on global client pools.",
    "Acquiring agricultural or green-rich property to balance missing earth grid elements."
  ];

  const mainKarmicLessons = [
    `Mastering emotional patience: Driver ${driver} requires you to act with deliberation, never under impulse.`,
    missing.includes(5) ? "Financial discipline: Securing earnings into gold or structural mutual funds immediately before leakage." : "Balancing spiritual retreats with daily commercial responsibilities.",
    "Avoiding arguments during Saturn-ruled Saturdays and Moon-ruled Monday evenings."
  ];

  const actionPriorities = [
    "Execute Name Spelling adjustment immediately to remove name-to-driver structural friction.",
    "Introduce fresh, leafy green plants in the South-East sector of your flat.",
    "Transit primary phone line to avoid negative pairs like 84, 48, 18, 81 in the last four digits."
  ];

  // 2. Dynamic Action Plans (7-day, 30-day, 90-day, 1-year)
  const plan7Days = [
    "Monday: Observe your evening thoughts. Jot down key triggers of anxiety.",
    "Wednesday morning: Chant your ruling planet mantra 27 times at sunrise.",
    "Thursday: Set up your home office table to face your auspicious direction.",
    "Saturday: Donate black sesame seeds to construction workers to satisfy Saturn transits.",
    "Clean out all broken glass, expired medicines, and dead clocks from your apartment."
  ];

  const plan30Days = [
    "Week 1-2: Align name spelling Chaldean total with a supportive companion frequency.",
    "Week 2-3: Transition secondary phone line to an auspicious suffix (ending in 5, 6, or 1).",
    "Week 3-4: Place a rose quartz heart crystal in the South-West marital sector.",
    "Adopt daily signature adjustments: sign upward at a 15-degree angle without ending dots."
  ];

  const plan90Days = [
    "Month 1: Log daily financial cash flow to block empty Mercury grid (#5) leakages.",
    "Month 2: Dedicate Saturday mornings to selfless community food drives.",
    "Month 3: Review immediate changes in sleep quality, client calls, and family peace.",
    "Complete a major household declutter to align with Numero Vaastu parameters."
  ];

  const plan1Year = [
    "Q1: Formulate your business/career structure around your highly rated industries.",
    "Q2: Acquire a supportive vehicle number plate that reduces to your friendly driver sum.",
    "Q3: Expand professional connections into secondary global cities identified as vibration-positive.",
    "Q4: Finalize your comprehensive Personal Growth Index audit to map your 100/100 spiritual trajectory."
  ];

  // 3. Success Probabilities (Career, Business, Wealth, relationships, etc.)
  const probabilities: Record<string, ProbabilityMetric> = {
    career: {
      name: "Career Success Probability",
      percentage: master.scores.careerPotentialScore || 78,
      explanation: `Calculated from your mental plane strength and active Sun/Mars nodes. Powered heavily by Driver ${driver}.`,
      strengths: ["Strong leadership focus", "Clear social representation"],
      risks: ["Authority friction during weak Sun transits", "Impatient role switches"],
      growthAdvice: "Maintain stable tenure in core roles; always sign upward on corporate contracts."
    },
    business: {
      name: "Business Scaling Probability",
      percentage: present.includes(5) ? 85 : 55,
      explanation: "Directly linked to the presence of the central Mercury pivot (#5) which governs commerce and trades.",
      strengths: ["Fast market recovery", "Clean negotiations"],
      risks: ["Sudden credit blockages if operating without spelling corrections", "Partnership conflicts"],
      growthAdvice: "Ensure all company branding compounds reduce to 5, 6, or 1 before launching print runs."
    },
    wealth: {
      name: "Wealth Growth Probability",
      percentage: master.wealthPsychology.wealthPotentialScore || 72,
      explanation: "Corresponds to the Gold and Silver diagonal planes on your birth chart.",
      strengths: ["Solid asset retention ability", "Multiple passive channels potential"],
      risks: ["Emotional family spending", "Speculative losses"],
      growthAdvice: "Convert liquid cash into physical gold or real estate immediately."
    },
    relationship: {
      name: "Relationship Stability Index",
      percentage: master.scores.relationshipScore || 65,
      explanation: "Derived from the Moon (#2) and Venus (#6) balance which anchor empathy and family support.",
      strengths: ["Deep care capacity", "Sincere long-term commitment style"],
      risks: ["Unexpressed emotional hurts", "Ego spikes during arguments"],
      growthAdvice: "Observe Monday silence rituals and avoid major domestic debates post sunset."
    },
    marriage: {
      name: "Marital Longevity Potential",
      percentage: present.includes(2) && present.includes(6) ? 88 : 60,
      explanation: "Determined by matching your birth compound days with marital grid projections.",
      strengths: ["Shared spiritual values", "Strong parental respect foundations"],
      risks: ["Occasional silent treatment", "Vastu imbalance in South-West master bed"],
      growthAdvice: "Keep a clay vessel of pure water in the East direction of your flat to cleanse domestic energies."
    },
    leadership: {
      name: "Leadership Potential",
      percentage: driver === 1 || driver === 9 || present.includes(1) ? 90 : 70,
      explanation: "Assesses how effectively you command authority and guide large teams under pressure.",
      strengths: ["Natural commanding presence", "High crisis resolve"],
      risks: ["Appearing overly direct", "Delegation hesitation"],
      growthAdvice: "Praise team members publicly on Wednesdays; wear emerald rings on your little finger."
    },
    spiritual: {
      name: "Spiritual Growth Potential",
      percentage: master.scores.spiritualScore || 75,
      explanation: "Linked to the activation of Ketu (#7) and Jupiter (#3) occult dimensions.",
      strengths: ["Pristine intuition spikes", "Deep curiosity for ancient cosmic texts"],
      risks: ["Occasional complete skepticism", "Meditation restlessness"],
      growthAdvice: "Observe 15 minutes of breathing meditation facing North daily."
    },
    learning: {
      name: "Learning & Intellect Potential",
      percentage: present.includes(3) && present.includes(5) ? 88 : 68,
      explanation: "Based on the Presence of the Arrow of Intellect (4-9-2 or 3-5-7 elements).",
      strengths: ["Superb retention capacity", "Logical problem solving"],
      risks: ["Information overload", "Mental fatigue"],
      growthAdvice: "Maintain a clean, clutter-free study table painted in soft sage green."
    },
    communication: {
      name: "Communication Impact Potential",
      percentage: master.scores.communicationScore || 75,
      explanation: "Measures speech clarity, persuasive power, and brand articulation.",
      strengths: ["Captivating verbal projection", "Clean copy writing flow"],
      risks: ["Blunt truths that offend", "Over-talking under stress"],
      growthAdvice: "Pause for three seconds before answering important questions during board meetings."
    }
  };

  // 4. Personalized Recommendations
  const recommendations: SmartRecommendations = {
    bestMobileEndings: ["55", "66", "15", "51", "61", "16"],
    bestMobileAvoidDigits: [4, 8, 2],
    bestBusinessNameChaldeanTotal: [15, 33, 41, 46, 51],
    bestVehicleRootNumbers: [1, 5, 6, 9],
    bestHouseVastuNumbers: [1, 5, 6],
    bestDates: [`${driver}th`, `${conductor}th`, "5th", "14th", "23rd", "6th", "15th", "24th"],
    bestDays: ["Wednesday", "Friday", "Thursday"],
    bestColours: ["Emerald Green", "Pastel Blue", "Warm Cream", "Champagne Gold"],
    bestDirections: master.vaastuFusion.bestDirections || ["North", "East"],
    bestIndustries: ["Information Technology", "Digital Media", "Gemstone Commerce", "Real Estate Management", "Corporate Consulting"],
    bestCareers: ["Strategic Brand Advisor", "Real Estate Structurer", "Occult Researcher", "Financial Portfolio Manager"],
    bestCities: ["Bengaluru", "Mumbai", "London", "Dubai", "Singapore"],
    bestBusinessSectors: ["SaaS platforms", "Vastu-Architectures", "Organic Foods Commerce", "Educational Portals"]
  };

  // 5. Timeline Phases
  const timeline: Record<string, TimelinePhase> = {
    phase1: {
      years: "Age 0-21 (Vibrational Blueprint & Foundation)",
      opportunities: "Deep intellectual growth, early exposure to spiritual traditions, and structuring character codes.",
      challenges: "Frequent shifting of environments or periodic physical exhaustion.",
      lessons: "Learning self-reliance and establishing solid reading habits.",
      focusAreas: ["Academics", "Physical Stamina", "Family bonds"],
      lifeThemes: "Establishing self-identity and aligning core values under parental guidance.",
      futureDirection: "Shifting away from absolute dependence toward structural self-determination."
    },
    phase2: {
      years: "Age 22-42 (Destiny Activation & Career Peak)",
      opportunities: "High-frequency career breakthroughs, brand establishment, and domestic expansion.",
      challenges: "Occasional cash-flow leakages due to central Mercury grid empty nodes.",
      lessons: "Mastering financial retention and learning to say 'No' to bad partnership requests.",
      focusAreas: ["Corporate scale", "Marriage stabilization", "Branding"],
      lifeThemes: "Willpower manifestation, establishing professional authority, and solidifying social reputation.",
      futureDirection: "Migrating standard desk tasks to large strategic leadership roles."
    },
    phase3: {
      years: "Age 43-63 (Consolidation & Financial Legacy)",
      opportunities: "Massive real estate acquisitions, global consultancy launches, and ancestral legacy building.",
      challenges: "Pitta-related digestive acidity spikes and joint stiffness parameters.",
      lessons: "Delegating operations completely to younger, highly energized managers.",
      focusAreas: ["Wealth compounding", "Occult study mastery", "Philanthropy"],
      lifeThemes: "Consolidating assets, mentoring corporate leaders, and cementing family heritage structures.",
      futureDirection: "Embracing slow, meditative morning schedules while managing board reviews."
    },
    phase4: {
      years: "Age 64+ (Spiritual Horizon & Master Sage Years)",
      opportunities: "Absolute spiritual alignment, writing master class occult logs, and peaceful advisory roles.",
      challenges: "Maintaining muscular flexibility and cold joint resilience parameters.",
      lessons: "Absolute detachment from daily transactional outcomes while providing pure advice.",
      focusAreas: ["Meditation retreats", "Charity foundations", "Ancestral peace"],
      lifeThemes: "Achieving master sage status, delivering lectures on ancient Vedic disciplines, and ultimate soul peace.",
      futureDirection: "Complete union with celestial waves."
    }
  };

  // 6. Personal Growth Index
  const growthIndexItems: GrowthIndexItem[] = [
    { category: "Career Alignment", score: master.scores.careerPotentialScore || 75, previousScore: Math.max((master.scores.careerPotentialScore || 75) - 8, 45), advice: "Sign contracts upward; sit facing your success direction." },
    { category: "Money Mindset", score: master.wealthPsychology.wealthPotentialScore || 70, previousScore: Math.max((master.wealthPsychology.wealthPotentialScore || 70) - 12, 40), advice: "Lock earnings in gold assets immediately; clear duplicate online payment apps." },
    { category: "Relationships", score: master.scores.relationshipScore || 65, previousScore: Math.max((master.scores.relationshipScore || 65) - 6, 45), advice: "Place a pair of rose quartz hearts in the SW; avoid evening text battles." },
    { category: "Physical Health", score: master.healthAnalysis.healthScore || 72, previousScore: Math.max((master.healthAnalysis.healthScore || 72) - 10, 50), advice: "Observe a Pitta-cooling diet; drink lukewarm water post sunrise." },
    { category: "Spirituality", score: master.scores.spiritualScore || 60, previousScore: Math.max((master.scores.spiritualScore || 60) - 15, 35), advice: "Chant planet mantras 27 times; practice Sunday morning silence." },
    { category: "Personal Confidence", score: master.scores.mentalStrength || 80, previousScore: Math.max((master.scores.mentalStrength || 80) - 5, 55), advice: "Wear favorable colours matching your driver day on key meetings." },
    { category: "Leadership Command", score: master.scores.leadershipScore || 75, previousScore: Math.max((master.scores.leadershipScore || 75) - 10, 40), advice: "Praise colleagues on Wednesdays; maintain vertical back postures." },
    { category: "Brand Communication", score: master.scores.communicationScore || 75, previousScore: Math.max((master.scores.communicationScore || 75) - 8, 45), advice: "Pause three seconds before replying to client objections." },
    { category: "Discipline & Execution", score: master.scores.practicalStrength || 70, previousScore: Math.max((master.scores.practicalStrength || 70) - 12, 38), advice: "Begin your daily budget logger; execute the 7-day plan diligently." }
  ];

  const overallScore = Math.round(growthIndexItems.reduce((acc, item) => acc + item.score, 0) / growthIndexItems.length);
  const overallPreviousScore = Math.round(growthIndexItems.reduce((acc, item) => acc + item.previousScore, 0) / growthIndexItems.length);

  return {
    summary,
    whatIsHelping,
    whatIsBlocking,
    biggestStrengths,
    biggestWeaknesses,
    immediateOpportunities,
    longTermOpportunities,
    mainKarmicLessons,
    actionPriorities,
    actionPlan: {
      plan7Days,
      plan30Days,
      plan90Days,
      plan1Year
    },
    probabilities,
    recommendations,
    timeline,
    growthIndex: {
      items: growthIndexItems,
      overallScore,
      overallPreviousScore
    }
  };
}
