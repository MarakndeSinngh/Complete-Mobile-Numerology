import { reduceToSingleDigit, analyzeNameSystems } from './numerologyEngine';

export interface VehicleReport {
  plateNumber: string;
  totalSum: number;
  reducedTotal: number;
  rulerPlanet: string;
  suitability: 'EXCELLENT' | 'NEUTRAL' | 'AVOID';
  businessUsageScore: number;
  travelLuckScore: number;
  protectionEnergyScore: number;
  accidentRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  theftRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  mechanicalBreakdownRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  meaning: string;
  vulnerability: string;
  remedy: string;
  luckyColors: string[];
  luckyServiceDays: string[];
  luckyTravelDays: string[];
  prediction: string;
  ownershipAnalysis: string;
}

export interface HouseReport {
  houseNumber: string;
  totalSum: number;
  reducedTotal: number;
  energyVibration: string;
  vibe: 'PEACE' | 'EXPANSION' | 'SPIRITUAL' | 'WORK' | 'VIBRANT';
  wealthPotential: number;
  familyHarmony: number;
  spiritualEnergy: number;
  businessSuitability: string;
  meaning: string;
  advice: string;
  remedy: string;
  predictions: string;
  luckyDirections: string[];
  luckyColors: string[];
}

export interface BusinessReport {
  businessName: string;
  chaldeanTotal: number;
  reducedTotal: number;
  brandStrengthScore: number;
  marketingEnergy: 'HIGH' | 'MEDIUM' | 'LOW';
  customerAttractionScore: number;
  financialStrength: number;
  growthPotential: number;
  leadershipStrength: number;
  suitability: 'POOR' | 'MODERATE' | 'OUTSTANDING';
  industrySuitability: string;
  meaning: string;
  expansionTip: string;
  businessRemedies: string[];
  suggestedCorrections: string;
  longTermForecast: string;
}

export interface SignatureReport {
  directionStyle: string;
  endingStroke: string;
  nameFlow: string;
  planetaryEnergy: string;
  careerImpact: string;
  financialImpact: string;
  publicRecognitionScore: number;
  corrections: string[];
  recommendations: string;
}

export interface ChildReport {
  birthDriver: number;
  birthConductor: number;
  startingAlphabets: string[];
  suggestedPlanets: string[];
  cautionaryAlphabets: string[];
  careerPrecedence: string;
  learningStyle: string;
  educationStrength: string;
  creativity: string;
  communication: string;
  parentingGuidance: string;
  remedies: string[];
  luckyActivities: string[];
}

export interface LuckyDatesSuite {
  businessDates: number[];
  marriageDates: number[];
  travelDates: number[];
  investmentDates: number[];
  propertyDates: number[];
  examDates: number[];
  interviewDates: number[];
}

// 1. VEHICLE NUMEROLOGY PRO ENGINE
export function analyzeVehicleNumerology(plateStr: string, driver: number): VehicleReport {
  const clean = plateStr.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let chaldeanSum = 0;
  
  const mapping: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/[0-9]/.test(char)) {
      chaldeanSum += parseInt(char, 10);
    } else if (mapping[char]) {
      chaldeanSum += mapping[char];
    }
  }

  const reducedTotal = reduceToSingleDigit(chaldeanSum) || 5;

  const friendlyNodes: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 3, 5, 7],
    3: [1, 2, 3, 5, 7, 9],
    4: [5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 7],
    7: [3, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 9]
  };

  const isFriendly = friendlyNodes[driver]?.includes(reducedTotal) || false;
  const isHostile = [8, 4].includes(reducedTotal) && driver !== 5 && driver !== 6;

  let suitability: VehicleReport['suitability'] = 'NEUTRAL';
  if (isFriendly) suitability = 'EXCELLENT';
  else if (isHostile) suitability = 'AVOID';

  // Ruler Planets
  const planetNames: Record<number, string> = {
    1: 'Sun (सूर्य) - Sovereign gold speed',
    2: 'Moon (चंद्र) - Emotional white water',
    3: 'Jupiter (गुरु) - Scholar yellow wisdom',
    4: 'Rahu (राहु) - Unorthodox shadow wind',
    5: 'Mercury (बुध) - High agile communication',
    6: 'Venus (शुक्र) - Luxury, silver comfort',
    7: 'Ketu (केतु) - Silent research charcoal',
    8: 'Saturn (शनि) - Systematic iron structure',
    9: 'Mars (मंगल) - Fire red torques'
  };

  // Scores based on planet rules
  const businessUsageScore = reducedTotal === 5 || reducedTotal === 1 ? 95 : [4, 8].includes(reducedTotal) ? 45 : 75;
  const travelLuckScore = [3, 5, 6].includes(reducedTotal) ? 92 : reducedTotal === 9 ? 85 : 70;
  const protectionEnergyScore = [1, 3].includes(reducedTotal) ? 96 : reducedTotal === 8 ? 80 : 65;

  const accidentRisk = reducedTotal === 9 ? 'HIGH' : [4, 8].includes(reducedTotal) ? 'MEDIUM' : 'LOW';
  const theftRisk = [4, 7].includes(reducedTotal) ? 'HIGH' : reducedTotal === 1 ? 'LOW' : 'MEDIUM';
  const mechanicalBreakdownRisk = reducedTotal === 4 ? 'HIGH' : reducedTotal === 8 ? 'MEDIUM' : 'LOW';

  const meaningsMap: Record<number, string> = {
    1: 'Sun ruled total. Prompts great royalty, administrative prestige, high visual attention, outstanding engine performance, and supreme safety indicators on highways.',
    2: 'Moon ruled total. Very comfortable and creative but prone to fuel line fluctuations and mood-dependent travel velocities.',
    3: 'Jupiter ruled total. A highly safe, scholarly number. Extremely reliable for long devotional or educational journeys, bringing blessings and wealth.',
    4: 'Rahu ruled. Brings sudden unexpected optical sensor or electrical wire failures. Highly unorthodox stream; requires consistent oil level audits.',
    5: 'Mercury ruled. Highly agile, fast-paced commercial trading vehicle. Perfect for sales managers and global digital operators.',
    6: 'Venus ruled. Enriched with maximum luxury, high suspension comforts, majestic speaker sound systems, and exquisite cosmetic details.',
    7: 'Ketu ruled. Safe, spiritual but isolated. Perfect for quiet nocturnal travelers and independent researchers.',
    8: 'Saturn ruled. Heavy duty, metal solid, robust construction. Slowly crawls through early years but establishes supreme mechanical durability.',
    9: 'Mars ruled. Brave, high torque, extremely courageous but warns of sudden aggressive acceleration impulses. Wear helmet strictly.'
  };

  const vulnerabilityMap: Record<number, string> = {
    4: 'Sensor and headlamp failures. Sudden electric spark hazards.',
    8: 'Tyre punctures, slow gear transmission lag, or mud accumulation.',
    9: 'Bumper scratches or thermal radiation issues from excessive speeding.'
  };

  const remedyMap: Record<number, string> = {
    4: 'Place a small copper pyramid or a solid wooden sphere inside the dashboard glove tray.',
    8: 'Keep a clean iron coin wrapped in black silk under the driver’s floor mat, and donate mustard seeds.',
    9: 'Hang a natural copper thread or a saffron Lord Hanuman pendant near the rear-view mirror view.'
  };

  const luckyColorsMap: Record<number, string[]> = {
    1: ['Golden Yellow', 'Pure White', 'Saffron'],
    2: ['Milky White', 'Light Silver', 'Sea Blue'],
    3: ['Mustard Yellow', 'Cream', 'Bright Gold'],
    4: ['Electric Blue', 'Slate Grey', 'Mint Green'],
    5: ['Jade Green', 'Pastel White', 'Light Ash'],
    6: ['Diamond Off-White', 'Blush Pink', 'Light Blue'],
    7: ['Chalk White', 'Smoke Grey', 'Black Accents'],
    8: ['Dark Indigo', 'Steel Grey', 'Matte Black'],
    9: ['Coral Red', 'Bright Orange', 'Saffron Red']
  };

  const daysMap: Record<number, string[]> = {
    1: ['Sunday', 'Thursday'],
    2: ['Monday', 'Friday'],
    3: ['Thursday', 'Sunday'],
    4: ['Wednesday', 'Saturday'],
    5: ['Wednesday', 'Friday'],
    6: ['Friday', 'Wednesday'],
    7: ['Thursday', 'Tuesday'],
    8: ['Saturday', 'Friday'],
    9: ['Tuesday', 'Sunday']
  };

  return {
    plateNumber: plateStr,
    totalSum: chaldeanSum,
    reducedTotal,
    rulerPlanet: planetNames[reducedTotal] || 'Active cosmic vector',
    suitability,
    businessUsageScore,
    travelLuckScore,
    protectionEnergyScore,
    accidentRisk,
    theftRisk,
    mechanicalBreakdownRisk,
    meaning: meaningsMap[reducedTotal] || 'Generates progressive, supportive vibrations for active commuting.',
    vulnerability: vulnerabilityMap[reducedTotal] || 'No critical structural vulnerability flagged under driver chart.',
    remedy: remedyMap[reducedTotal] || 'Keep the windshield completely pristine and spray lemon oil monthly.',
    luckyColors: luckyColorsMap[reducedTotal] || ['White', 'Silver'],
    luckyServiceDays: daysMap[reducedTotal] || ['Wednesday'],
    luckyTravelDays: daysMap[reducedTotal] || ['Monday'],
    prediction: `This vehicle plate ${plateStr} holds the secret key to your travel growth. Under the rule of root ${reducedTotal}, it is predicted to open major career pipelines, particularly when commuting towards North-East directions. If suitability is AVOID, perform remedies to shield your travels.`,
    ownershipAnalysis: `Long term analysis suggests this car/bike will remain in your service with excellent resale equity. It brings highly stable family weekend laughter and locks in your physical safety under major stellar planetary transitions.`
  };
}

// 2. HOUSE NUMEROLOGY PRO ENGINE
export function analyzeHouseNumerology(houseStr: string): HouseReport {
  const clean = houseStr.toUpperCase().replace(/[^0-9]/g, '');
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    sum += parseInt(clean[i], 10);
  }
  const reducedTotal = reduceToSingleDigit(sum) || 5;

  let vibe: HouseReport['vibe'] = 'EXPANSION';
  let meaning = '';
  let advice = '';
  let remedy = '';
  let businessSuitability = '';
  let energyVibration = '';

  const directionsMap: Record<number, string[]> = {
    1: ['East', 'North-East'],
    2: ['North-West', 'North'],
    3: ['North-East', 'East'],
    4: ['South-West', 'North-West'],
    5: ['North', 'East'],
    6: ['South-East', 'North-West'],
    7: ['North-East', 'West'],
    8: ['West', 'South-West'],
    9: ['South', 'East']
  };

  const colorsMap: Record<number, string[]> = {
    1: ['Golden Yellow', 'Gold Saffron', 'Ruby Red'],
    2: ['Milky White', 'Silver Cream', 'Soft Blue'],
    3: ['Bright Mustard', 'Warm Amber', 'Saffron'],
    4: ['Electric Blue', 'Mint Green', 'Slate Grey'],
    5: ['Emerald Green', 'Pastel Ash', 'Teal'],
    6: ['Diamond Off-white', 'Pastel Pink', 'Champagne Gold'],
    7: ['Chalk White', 'Light Lavender', 'Dove Grey'],
    8: ['Dark Slate Blue', 'Warm Tan', 'Charcoal'],
    9: ['Crimson Red', 'Light Terracotta', 'Rust Orange']
  };

  const vibeMap: Record<number, HouseReport['vibe']> = {
    1: 'VIBRANT', 2: 'PEACE', 3: 'PEACE', 4: 'WORK', 5: 'EXPANSION', 6: 'PEACE', 7: 'SPIRITUAL', 8: 'WORK', 9: 'VIBRANT'
  };

  const energyVibs: Record<number, string> = {
    1: 'Solar Authority Force. Perfect for dynamic display of personal accolades, boosting self-reliance, and driving executive speed.',
    2: 'Lunar Cozy Harmony. Focuses on peaceful soft lighting, decorative art frames, and family dining tables, creating absolute mutual empathy.',
    3: 'Scholarly Guru Sanctum. Best suited for study altars, massive book reading chambers, and spiritual chanting, spreading peaceful protective aura.',
    4: 'Structured Rahu Fort. High systematic physical discipline, customized technical workspaces, and extreme security alarms protection.',
    5: 'Agile Mercury Lounge. Multi-communal space, highly active high-speed mobile routers, constant guests visits, and bright smart decorations.',
    6: 'Venus Luxury Temple. Outstanding brand layout, high leather cushion details, aromatic candles, and premium clothing collections storage.',
    7: 'Quiet Ketu Ashram. Deep tranquil silence, minimal electronic noise, massive yoga cushions, and excellent metaphysical books catalog.',
    8: 'Saturn Iron Fortress. Heavy robust brickwork, dark stable wood structures, solid family legacy building, and powerful slow achievements.',
    9: 'Martial Mars Arena. Highly active, containing fitness gyms, sports gear, bright natural lights, and fearless administrative ambitions.'
  };

  vibe = vibeMap[reducedTotal];
  energyVibration = energyVibs[reducedTotal];

  const wealthPotential = reducedTotal === 6 || reducedTotal === 5 ? 95 : [1, 3, 8].includes(reducedTotal) ? 85 : 70;
  const familyHarmony = [2, 3, 6].includes(reducedTotal) ? 92 : [4, 9].includes(reducedTotal) ? 68 : 80;
  const spiritualEnergy = [3, 7].includes(reducedTotal) ? 96 : reducedTotal === 2 ? 88 : 60;

  if ([1, 5, 6].includes(reducedTotal)) {
    businessSuitability = 'Highly Recommended. Perfect for global trading consultancies, design showrooms, or public relations coaching.';
  } else if ([3, 7].includes(reducedTotal)) {
    businessSuitability = 'Excellent for independent research work, software programming, healing, or remote education development.';
  } else {
    businessSuitability = 'Suited for administrative system logs, logistical planning, heavy inventory audits, and local operations.';
  }

  const meaningsMap: Record<number, string> = {
    1: 'Fosters extreme leadership development. Highly recommended for corporate bosses, politicians, and master brand promoters.',
    2: 'Nurtures deep relationships, marital fidelity, creative songwriting, and emotional healing.',
    3: 'Highly protective scholarly environment. Guards against sudden legal errors and invites divine ancestral guidance.',
    4: 'Forces systematic lifestyle and software development. Prone to sudden electronic circuit trips; requires perfect Vastu wiring.',
    5: 'Active commercial hub. Rapid change cycles, constant travel suitcase packings, and swift monetary turnover patterns.',
    6: 'Brings immense financial prosperity, luxury vehicle upgrades, artistic masteries, and joyful celebration events.',
    7: 'Increases introverted analytical focus. Excellent for software debugging, publishing books, and mystical healing.',
    8: 'Constructs massive permanent physical assets. Promotes persistent hard work, stable slow growth, and outstanding long-term security.',
    9: 'Inspires deep athletic stamina, physical defense command, and extreme willpower to complete major targets ahead of schedule.'
  };

  const adviceMap: Record<number, string> = {
    1: 'Install bright brass warm lights in the front entry and keep clutter out of the eastern hallways.',
    2: 'Keep a clean silver bowl with freshwater and white jasmines in the North sector.',
    3: 'Maintain a yellow mustard tilak bottle in your study desk and read philosophic files facing East.',
    4: 'Place a small copper pyramid block near the core electric distribution box of the house.',
    5: 'Keep fresh mint leaf pots or bright money plants in the North corner to speed up income.',
    6: 'Spray high-taste rose sandalwood mists around your entry foyers at sunsets daily.',
    7: 'Introduce an amethyst crystal cluster near your study laptop and minimize violent media noise.',
    8: 'Light a traditional mustard oil brass lamp on Saturday sunsets in the West patio.',
    9: 'Store kitchen equipment clean and dry daily, and decorative and functional sports gear nicely.'
  };

  const remedyMap: Record<number, string> = {
    1: 'Pray daily facing Sunrise, and keep a clean copper plate on the master workspace table.',
    2: 'Respect maternal elders, and make sure no water fittings drip continuously in the kitchen.',
    3: 'Gift yellow sweets to local scholars, and keep a wooden OM symbol on the entry door.',
    4: 'Hang a brass bell at the main entry point to dissolve sudden stagnant Rahu sound vibrations.',
    5: 'Feed fresh green vegetables to street cows on Wednesday mornings.',
    6: 'Adorn your entry space with fresh white lilies or rose quartz crystals.',
    7: 'Place a small clean water fountain in the North-East zone of the balcony.',
    8: 'Light a sesame oil lamp near a Peepal tree and avoid hoarding scrap iron on the balcony.',
    9: 'Keep fresh copper items on your desk, and chant Hanuman Chalisa once at dusk.'
  };

  const predictions = `Under the rule of Root number ${reducedTotal}, this house has a destined forecast of highly steady progression. It is predicted that the primary occupant will receive major corporate elevations within months of moving in, provided Vastu coordinates are followed. If reduced total is 4 or 8, perform standard entry bells remedy to bypass local delays.`;

  return {
    houseNumber: houseStr,
    totalSum: sum,
    reducedTotal,
    energyVibration,
    vibe,
    wealthPotential,
    familyHarmony,
    spiritualEnergy,
    businessSuitability,
    meaning: meaningsMap[reducedTotal] || 'Establishes a highly protective, balanced energetic dome.',
    advice: adviceMap[reducedTotal] || 'Maintain clean ventilation pathways.',
    remedy: remedyMap[reducedTotal] || 'Chant positive mantras daily.',
    predictions,
    luckyDirections: directionsMap[reducedTotal] || ['East'],
    luckyColors: colorsMap[reducedTotal] || ['Cream', 'Soft Yellow']
  };
}

// 3. BUSINESS NUMEROLOGY PRO ENGINE
export function analyzeBusinessNumerology(nameStr: string, driver: number): BusinessReport {
  const nameAna = analyzeNameSystems(nameStr);
  const cSum = nameAna.chaldeanNumber;

  const friendlyNodes: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 3, 5],
    3: [1, 2, 3, 5, 7, 9],
    4: [5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 7],
    7: [3, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 9]
  };

  const friendly = friendlyNodes[driver]?.includes(cSum) || false;
  const poor = [8, 4].includes(cSum) && driver !== 5 && driver !== 6;

  let suitability: BusinessReport['suitability'] = 'MODERATE';
  if (friendly) suitability = 'OUTSTANDING';
  else if (poor) suitability = 'POOR';

  let industrySuitability = 'General consulting, dynamic services, and administrative logistics.';
  if (cSum === 5 || cSum === 6) {
    industrySuitability = 'Highly recommended for premium fashion retail, cosmetic branding, digital media portals, global import trading, and high-frequency hospitality networks.';
  } else if (cSum === 1 || cSum === 3) {
    industrySuitability = 'Outstanding for administrative corporate advisory, state contracts, legal court arbitrations, higher academic colleges, and medical surgery logistics.';
  } else if (cSum === 8 || cSum === 4) {
    industrySuitability = 'Perfect for heavy industrial machinery fabrication, metallurgy, coal mining sites, and specialized digital encryption code design services.';
  }

  const meaningMap: Record<number, string> = {
    1: 'The Solar Command (1): Promotes high brand authority, majestic corporate confidence, and unmatched customer trust recall on public boards.',
    2: 'The Lunar Grace (2): Empathy-driven, highly suited for design aesthetics, psychological councils, maternal goods imports, and wellness.',
    3: 'The Chancellor Citadel (3): Multiplies client trust, high compliance rating, perfect for finance advisors, legal cells, and publishing houses.',
    4: 'The Unorthodox Disruptor (4): Tech software developer suitability, dynamic crypto coding, sudden market sweeps capability.',
    5: 'The Merchant Sovereign (5): The ultimate commercial total. Speeds up retail inventory turnover, opens fluid money gates, and ensures active public communication.',
    6: 'The Luxury Palace (6): Aesthetic refinement, beautiful premium box mockups, highly magnetic attraction to elite, high-paying corporate partners.',
    7: 'The Deep Hermitage (7): Research diagnostics labs, custom herbal formulations, occult science platforms, and niche database consultancies.',
    8: 'The Steel Monument (8): Demands intense mechanical labor and absolute corporate compliance. Slow in early stages but secures infinite asset legacy.',
    9: 'The Strategic Shield (9): Direct mechanical construction command, real estate works, security grids, and brave physical training institutions.'
  };

  // Generate pro metrics
  const brandStrengthScore = cSum === 1 || cSum === 5 ? 95 : [4, 8].includes(cSum) ? 55 : 78;
  const marketingEnergy = [1, 5, 6].includes(cSum) ? 'HIGH' : cSum === 3 ? 'MEDIUM' : 'LOW';
  const customerAttractionScore = cSum === 6 || cSum === 5 ? 98 : cSum === 3 ? 82 : 68;
  const financialStrength = [3, 5, 8].includes(cSum) ? 90 : 70;
  const growthPotential = cSum === 5 || cSum === 1 ? 95 : 72;
  const leadershipStrength = cSum === 1 || cSum === 9 ? 96 : 74;

  const businessRemedies = [
    `Spelling tuning: Modify corporate letters to resolve strictly to Chaldean Sum ${cSum === 8 ? 5 : cSum === 4 ? 6 : cSum}.`,
    `Branding design: Use deep green colors for Mercury 5 total, or champagne silver for Venus 6 total.`,
    `Main Entry: Do not place a large garbage container directly adjacent to the commercial gate.`
  ];

  const suggestedCorrections = cSum === 8 
    ? 'Highly suggested to add a letter (e.g. duplicating a vowel) to shift the Chaldean name total to 5 or 6, which completely removes Saturn delays.' 
    : 'No severe spelling modifications required. Your current Chaldean total aligns cleanly with positive planetary aspects.';

  const longTermForecast = `For the next decade, under current Chaldean total ${cSum}, this brand is forecasted to capture massive local market respect. If total is friendly, expect easy expansion into international export lines. If total is poor, maintain clean corporate record filing to prevent legal penalties during Saturn transits.`;

  return {
    businessName: nameStr,
    chaldeanTotal: cSum,
    reducedTotal: nameAna.expressionNumber,
    brandStrengthScore,
    marketingEnergy,
    customerAttractionScore,
    financialStrength,
    growthPotential,
    leadershipStrength,
    suitability,
    industrySuitability,
    meaning: meaningMap[nameAna.expressionNumber] || 'Standard commercial portal aligned with Chaldean properties.',
    expansionTip: `Adopt premium green cards design (Mercury) if total is 5 or warm golden lights (Sun) if total is 1, targeting elite global clients.`,
    businessRemedies,
    suggestedCorrections,
    longTermForecast
  };
}

// 4. SIGNATURE NUMEROLOGY ENGINE (NEW PRO MODULE)
export function analyzeSignatureStyle(styleId: string): SignatureReport {
  let directionStyle = 'Neutral';
  let endingStroke = 'Stable';
  let nameFlow = 'Balanced';
  let planetaryEnergy = 'Mercury (Agile)';
  let careerImpact = 'Maintains standard growth.';
  let financialImpact = 'Fluid but standard.';
  let publicRecognitionScore = 70;
  let corrections: string[] = [];
  let recommendations = '';

  if (styleId === 'RISING_UNDERLINE') {
    directionStyle = '15-Degree Eastward Ascent';
    endingStroke = 'Strong, clean forward stroke';
    nameFlow = 'Continuous, connected lettering';
    planetaryEnergy = 'Sun & Jupiter - Infinite ambition alignment';
    careerImpact = 'Accelerates executive corporate promotions, commands public respect, and brings fast independent brand ownership.';
    financialImpact = 'Provides high asset shield, preventing leakage of funds under negative planetary transits.';
    publicRecognitionScore = 96;
    corrections = [
      'Ensure the underline does not cut any lower loop letters like g, j, p, y.',
      'Begin the first letter of your name significantly larger than the rest.'
    ];
    recommendations = 'This is the signature style of Grandmasters! Highly helpful for entrepreneurs, lawyers, and administrative leaders. Maintain this ascending structure always.';
  } else if (styleId === 'TRAILING_DOT_BELOW') {
    directionStyle = 'Flat Horizon';
    endingStroke = 'Heavy terminal dot';
    nameFlow = 'First letter large, rest highly cluttered';
    planetaryEnergy = 'Rahu & Saturn - Disruption loop';
    careerImpact = 'Brings persistent unexplainable corporate project halts and constant peer politics hurdles.';
    financialImpact = 'Unexpected expenditure bursts. Money enters nicely but leaks through unexpected medical or vehicle repairs.';
    publicRecognitionScore = 48;
    corrections = [
      'IMMEDIATELY remove the terminal full-stop dot from the bottom of your name.',
      'Shift the signature angle from flat to 15 degrees rising upward.'
    ];
    recommendations = 'A terminal dot serves as a cosmic barrier, stopping the flow of commercial ideas. Erase the dot today and replace with a clean single solid underline.';
  } else if (styleId === 'FALLING_LINE') {
    directionStyle = 'Downward Sloping Westward';
    endingStroke = 'Faded lower stroke';
    nameFlow = 'Inwardly curled letters';
    planetaryEnergy = 'Ketu - Deep skepticism and isolation';
    careerImpact = 'Triggers severe trust deficits with authorities, falling executive confidence levels, and workspace depression cycles.';
    financialImpact = 'Losses in stock speculation networks. S&P or index holdings underperform.';
    publicRecognitionScore = 32;
    corrections = [
      'Force your handwriting to climb upwards like an ascending staircase.',
      'Ensure the last letter of the signature is higher than the first letter.'
    ];
    recommendations = 'Downward signatures indicate falling cellular energies. Correct this script today to reclaim active control over your career outcomes.';
  } else {
    // DOUBLE_UNDERLINE or default
    directionStyle = 'Perfect Horizontal Line';
    endingStroke = 'Double bold lines below';
    nameFlow = 'Evenly spaced, clean font script';
    planetaryEnergy = 'Saturn & Venus - Support structures';
    careerImpact = 'Highly stable. Superb for administrative clerks, legal attorneys, banking consultants, and government staff.';
    financialImpact = 'Continuous caging of money assets. The double line serves as a structural cushion protecting generational holdings.';
    publicRecognitionScore = 86;
    corrections = [
      'Keep the underline lines exactly parallel and neat.',
      'Do not let the lines intersect the name letters at any point.'
    ];
    recommendations = 'Superb for high financial stability and family harmony. Provides a steady, safe, non-volatile career path.';
  }

  return {
    directionStyle,
    endingStroke,
    nameFlow,
    planetaryEnergy,
    careerImpact,
    financialImpact,
    publicRecognitionScore,
    corrections,
    recommendations
  };
}

// 5. CHILD NUMEROLOGY ENGINE
export function generateChildNumerology(dobStr: string): ChildReport {
  const parts = dobStr.split('-');
  const day = parseInt(parts[2], 10) || 1;
  const dayReduced = reduceToSingleDigit(day);

  const cleanDob = dobStr.replace(/[^0-9]/g, '');
  const dobSum = cleanDob.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  const conductor = reduceToSingleDigit(dobSum);

  let startingAlphabets: string[] = [];
  let suggestedPlanets: string[] = [];
  let cautionaryAlphabets: string[] = [];
  let careerPrecedence = '';
  let learningStyle = '';
  let educationStrength = '';
  let creativity = '';
  let communication = '';
  let parentingGuidance = '';
  let remedies: string[] = [];
  let luckyActivities: string[] = [];

  if (dayReduced === 1) {
    startingAlphabets = ['A', 'I', 'Y', 'J', 'Q', 'E', 'H', 'N'];
    suggestedPlanets = ['Sun (1)', 'Mercury (5)', 'Jupiter (3)'];
    cautionaryAlphabets = ['B', 'K', 'R', 'F', 'P'];
    careerPrecedence = 'Sovereign leadership, solar executive command, medical science research, independent brand startups, or elite civil operations.';
    learningStyle = 'Visual and highly independent. Prefers self-paced books and projects rather than micro-managed schedules.';
    educationStrength = 'Excellent logical reasoning, natural class mentor capabilities, and strong math concentration.';
    creativity = 'Pioneering structural graphic concepts, digital gaming setups, and leadership scriptwriting talent.';
    communication = 'Loud, highly confident, direct, and authoritative speech delivery.';
    parentingGuidance = 'Encourage independent thought but teach mutual cooperative tolerance with peers. Avoid harsh public rebukes; instead, use calm logic.';
    remedies = ['Offer clean copper vessel water to birds on Sunday mornings.', 'Keep white light shades in the child\'s study foyer.'];
    luckyActivities = ['Corporate chess clubs', 'Public debate speaking', 'Dynamic track athletics'];
  } else if (dayReduced === 2) {
    startingAlphabets = ['C', 'G', 'L', 'S', 'F', 'P'];
    suggestedPlanets = ['Moon (2)', 'Jupiter (3)', 'Venus (6)'];
    cautionaryAlphabets = ['M', 'T', 'D'];
    careerPrecedence = 'Splendid artistic design, children literature creation, counseling psychology, and global diplomatic peace missions.';
    learningStyle = 'Aura-sensitive and highly emotional learner. Excels under gentle, highly encouraging teachers with positive music patterns.';
    educationStrength = 'Creative poetry writing, botanical studies, language sciences, and child psychology.';
    creativity = 'Exquisite canvas drawing watercolor talents, instrumental play, and soft interior decorations design.';
    communication = 'Soft, highly empathetic, conversational, and highly comforting tone.';
    parentingGuidance = 'Support their sensitive nervous heart from violent media structures. Build stable physical courage through regular family water swimming sessions.';
    remedies = ['Keep a round silver bar wrapped in cream silk near their study drawer.', 'Offer sweet white rice pudding to birds on Mondays.'];
    luckyActivities = ['Classical music keyboard play', 'Creative water swimming', 'Clay molding arts'];
  } else if (dayReduced === 3) {
    startingAlphabets = ['A', 'I', 'Y', 'U', 'V', 'W'];
    suggestedPlanets = ['Jupiter (3)', 'Sun (1)', 'Venus (6)'];
    cautionaryAlphabets = ['E', 'H', 'N'];
    careerPrecedence = 'Higher academic chancellorships, legal supreme judges, state finance advising, and traditional spiritual mentors.';
    learningStyle = 'Highly scholarly. Enjoys deep research library environments, encyclopedia directories, and wisdom files.';
    educationStrength = 'Ancient history, jurisprudence, complex auditing, and philosophical world translations.';
    creativity = 'Oratorical master speeches, sacred geometric sand play, and administrative club coordination.';
    communication = 'Extremely clear, wise, containing rich vocabulary, excellent advisory capability.';
    parentingGuidance = 'Nurture their active intellectual hunger with rich science and philosophical papers. Respect their mature outlook from an early age.';
    remedies = ['Plant a clean tulsi herb on a yellow Thursday morning.', 'Add a tiny pinch of saffron in water baths on Thursdays.'];
    luckyActivities = ['Scholarly reading tournaments', 'Creative science camps', 'Social charity clubs'];
  } else {
    // Falls to Mercury / Venus agile defaults for 4, 5, 6, 7, 8, 9
    startingAlphabets = ['A', 'I', 'E', 'H', 'N', 'X', 'U', 'V', 'W'];
    suggestedPlanets = ['Mercury (5)', 'Venus (6)', 'Jupiter (3)'];
    cautionaryAlphabets = ['F', 'P', 'R'];
    careerPrecedence = 'Agile business consulting, telecom trading, premium visual brand architectures, and logistical operations planning.';
    learningStyle = 'Highly experimental, hands-on, leveraging coding software applications and dynamic screen presentations.';
    educationStrength = 'Digital computer sciences, foreign language arts, global geography trade tracks.';
    creativity = 'Brilliant graphic animations, dynamic Lego architecture building, and digital music mixing.';
    communication = 'Extremely prompt, multitasking conversation speeds, multilingual dexterity.';
    parentingGuidance = 'Channels their immense mental speeds into daily physical gymnastics or yoga to prevent midnight restless sleep patterns.';
    remedies = ['Keep green plants on their study desks.', 'Chant Gayatri Mantra once together before sunset.'];
    luckyActivities = ['Coding computer program camps', 'Sovereign design workshops', 'Agility football sports'];
  }

  return {
    birthDriver: dayReduced,
    birthConductor: conductor,
    startingAlphabets,
    suggestedPlanets,
    cautionaryAlphabets,
    careerPrecedence,
    learningStyle,
    educationStrength,
    creativity,
    communication,
    parentingGuidance,
    remedies,
    luckyActivities
  };
}

// 6. LUCKY DATE GENERATOR PRO
export function generateLuckyDatesSuite(driver: number, conductor: number): LuckyDatesSuite {
  const friendlyNodes: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 3, 5, 7],
    3: [1, 2, 3, 5, 7, 9],
    4: [5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 7],
    7: [3, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 9]
  };

  const drFriendly = friendlyNodes[driver] || [1, 5, 6];
  const cdFriendly = friendlyNodes[conductor] || [1, 5, 6];

  // Algorithmic filters for different activity categories (always avoiding 8 and 4 sums for traditional reasons)
  const extractDates = (filter: (reduced: number) => boolean) => {
    const dates: number[] = [];
    for (let d = 1; d <= 31; d++) {
      const red = reduceToSingleDigit(d);
      if (drFriendly.includes(red) && cdFriendly.includes(red) && red !== 8 && red !== 4 && filter(red)) {
        dates.push(d);
      }
    }
    // Fallback if super strict
    if (dates.length === 0) {
      for (let d = 1; d <= 31; d++) {
        const red = reduceToSingleDigit(d);
        if ([1, 5, 6].includes(red) && filter(red)) {
          dates.push(d);
        }
      }
    }
    return dates.slice(0, 5);
  };

  return {
    businessDates: extractDates(r => r === 5 || r === 1),
    marriageDates: extractDates(r => r === 6 || r === 3 || r === 2),
    travelDates: extractDates(r => r === 5 || r === 3),
    investmentDates: extractDates(r => r === 6 || r === 1),
    propertyDates: extractDates(r => r === 3 || r === 1),
    examDates: extractDates(r => r === 1 || r === 5),
    interviewDates: extractDates(r => r === 5 || r === 3)
  };
}

// Utility range date list
export function generateLuckyDatesForMonth(driver: number, conductor: number, month: number, year: number): number[] {
  const suite = generateLuckyDatesSuite(driver, conductor);
  return Array.from(new Set([...suite.businessDates, ...suite.marriageDates, ...suite.travelDates])).sort((a,b)=>a-b).slice(0,10);
}
