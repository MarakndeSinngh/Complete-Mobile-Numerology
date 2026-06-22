import { reduceToSingleDigit, analyzeNameSystems } from './numerologyEngine';

export interface VehicleReport {
  plateNumber: string;
  totalSum: number;
  reducedTotal: number;
  vulnerability: string;
  remedy: string;
  suitability: 'EXCELLENT' | 'NEUTRAL' | 'AVOID';
  meaning: string;
}

export interface HouseReport {
  houseNumber: string;
  totalSum: number;
  reducedTotal: number;
  vibe: 'PEACE' | 'EXPANSION' | 'SPIRITUAL' | 'WORK' | 'VIBRANT';
  meaning: string;
  advice: string;
  remedy: string;
}

export interface BusinessReport {
  businessName: string;
  chaldeanTotal: number;
  reducedTotal: number;
  suitability: 'POOR' | 'MODERATE' | 'OUTSTANDING';
  industrySuitability: string;
  meaning: string;
  expansionTip: string;
}

export interface ChildReport {
  birthDriver: number;
  birthConductor: number;
  startingAlphabets: string[];
  suggestedPlanets: string[];
  cautionaryAlphabets: string[];
  careerPrecedence: string;
}

export function analyzeVehicleNumerology(plateStr: string, driver: number): VehicleReport {
  // Extract digits and alphabetical equivalents under Chaldean
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

  const reducedTotal = reduceToSingleDigit(chaldeanSum);
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

  const meaningsMap: Record<number, string> = {
    1: 'Sun ruled total. Prompts great royalty, administrative prestige, and high safety indicators.',
    2: 'Moon ruled total. Very comfortable and creative but prone to fluid levels and mood-driven speeds.',
    3: 'Jupiter ruled total. A highly safe, scholarly number. Extremely reliable for long journeys.',
    4: 'Rahu ruled. Brings sudden performance or electrical issues. Demands regular servicing.',
    5: 'Mercury ruled. Highly agile, fast-paced trading vehicle. Perfect for commercial operators.',
    6: 'Venus ruled. Full of luxury, beauty, comfortable suspensions, and excellent entertainment.',
    7: 'Ketu ruled. Highly deep, spiritual but isolated. Perfect for quiet writers and meditators.',
    8: 'Saturn ruled. Heavy duty, highly robust but experiences sluggish transits and minor delays.',
    9: 'Mars ruled. Brave, high torque, extremely courageous but warns of quick physical acceleration.'
  };

  const vulnerabilityMap: Record<number, string> = {
    4: 'Prone to sudden sensor/fuse failures and electronic leaks.',
    8: 'Accumulates mud or delay blockages quickly.',
    9: 'Vulnerable to slight accidental scratches due to high speed urges.'
  };

  const remedyMap: Record<number, string> = {
    4: 'Place a small copper pyramid block under your front gear chamber.',
    8: 'Ensure you have a small round silver bar in the glove compartment.',
    9: 'Hang a clean saffron lord Hanuman flag or thread near your review mirror.'
  };

  return {
    plateNumber: plateStr,
    totalSum: chaldeanSum,
    reducedTotal,
    vulnerability: vulnerabilityMap[reducedTotal] || 'Minimal structural vulnerability flagged.',
    remedy: remedyMap[reducedTotal] || 'Keep the front windshield completely crystal clean.',
    suitability,
    meaning: meaningsMap[reducedTotal] || 'Generates a robust supportive cosmic vibration.'
  };
}

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

  if (reducedTotal === 1) {
    vibe = 'VIBRANT';
    meaning = 'Perfect for independent leaders, entrepreneurs, and high power status holders. High sunlight focus.';
    advice = 'Ensures great career ambition. However, avoid hot-headed arguments inside bedrooms.';
    remedy = 'Decorate your main hall with premium saffron and red candles.';
  } else if (reducedTotal === 2) {
    vibe = 'PEACE';
    meaning = 'Full of deep warmth, empathy, beautiful arts, relationships, and tranquil evenings.';
    advice = 'Excellent for newly weds and therapists, but can cause emotional sentimentality.';
    remedy = 'Place a silver bowl containing fresh white jasmines near your living room north window.';
  } else if (reducedTotal === 3) {
    vibe = 'PEACE';
    meaning = 'A deeply spiritual scholarly house. Fosters learning, reading books, and noble discussions.';
    advice = 'Superb for teachers and lawyers. Highly protective boundary from cosmic blockages.';
    remedy = 'Hang a clean framed wooden sacred geometry mandala near your main foyer wall.';
  } else if (reducedTotal === 4) {
    vibe = 'WORK';
    meaning = 'Extremely organized, clean, practical, and systematic. Great for technical professionals.';
    advice = 'Forces high productivity. However, avoid overtalking about corporate politics.';
    remedy = 'Install a brass bell near your entry door to clear stagnant energies.';
  } else if (reducedTotal === 5) {
    vibe = 'EXPANSION';
    meaning = 'Very social, active party house. Constant guests, phone calls, and business networking.';
    advice = 'Splendid for PR and marketing specialists. High movements of mobile devices.';
    remedy = 'Keep fresh mint herbs or green bamboo plants in your north-east corner.';
  } else if (reducedTotal === 6) {
    vibe = 'PEACE';
    meaning = 'Extremely luxurious house. Dedicated to interior beauty, family safety, jewelry, and luxury meals.';
    advice = 'Excellent for financial prosperity. Keeps everyone cozy and content.';
    remedy = 'Light a sweet sandalwood incense or diffuse dynamic jasmine oil at sunsets.';
  } else if (reducedTotal === 7) {
    vibe = 'SPIRITUAL';
    meaning = 'Silent, calm temple-like layout. Fosters deep analytical coding, yoga development, and writer focus.';
    advice = 'Can cause the feeling of absolute isolation. Ensure you host mini dinners occasionally.';
    remedy = 'Place a small water fountain or amethyst crystal geodes on your study desk.';
  } else if (reducedTotal === 8) {
    vibe = 'WORK';
    meaning = 'Structured, heavy materials, solid brickwork. Great for building massive security and savings portfolios.';
    advice = 'Requires continuous hard work. Delayed achievements but very solid permanent results.';
    remedy = 'Light an oil lamp (diya) with black sesame oil near your west courtyard on Saturdays.';
  } else {
    vibe = 'VIBRANT';
    meaning = 'Filled with high physical courage, active movement, exercises, sports gear, and high ambition.';
    advice = 'Prone to fast wear and tear. Ensure kitchen equipment is clean.';
    remedy = 'Keep red coral crystal stones in your southwest safe room.';
  }

  return {
    houseNumber: houseStr,
    totalSum: sum,
    reducedTotal,
    vibe,
    meaning,
    advice,
    remedy
  };
}

export function analyzeBusinessNumerology(nameStr: string, driver: number): BusinessReport {
  const nameAna = analyzeNameSystems(nameStr);
  const cSum = nameAna.chaldeanNumber;
  
  // Calculate suitability based on planetary friendliness
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

  let industrySuitability = 'General consulting and trading activities.';
  if (cSum === 5 || cSum === 6) {
    industrySuitability = 'Highly suitable for premium retail, luxury jewelry, marketing, communications and foreign imports.';
  } else if (cSum === 1 || cSum === 3) {
    industrySuitability = 'Outstanding for civil administration support, management consultancy, and higher educational institutions.';
  } else if (cSum === 8 || cSum === 4) {
    industrySuitability = 'Well-suited for heavy industrial setups, metallurgy, mining, coal, or specialized software architecture.';
  }

  const meaningMap: Record<number, string> = {
    1: 'The Solar Command (1): Radiates absolute confidence, pioneering leadership, and outstanding brand recall value.',
    2: 'The Crescent Pearl (2): Deep support, highly creative, fits customer handling structures, counseling and soft imports.',
    3: 'The Guru Citadel (3): Promotes noble wisdom, high financial prudence, trust factor, and teaching systems suitability.',
    4: 'The Shadow Raider (4): Rapid unconventional disruptions, heavy software coding, electronic sales suitability.',
    5: 'The Merchant Emperor (5): Absolute trading luck. Promotes rapid asset conversions, continuous sales, and flexible communications.',
    6: 'The Luxury Palace (6): Aesthetic design superiority, beautiful packaging success, attracts top-tier clients.',
    7: 'The Hermitage (7): High quality programming, scientific research, mystical studies, and custom healthcare programs.',
    8: 'The Steel Pillar (8): Massive hardwork requirement, creates large infrastructure organizations, delayed but indestructible earnings.',
    9: 'The Iron Shield (9): Active security forces fit, high engineering capability, real estate construction command.'
  };

  return {
    businessName: nameStr,
    chaldeanTotal: nameAna.chaldeanNumber, // standard
    reducedTotal: nameAna.expressionNumber,
    suitability,
    industrySuitability,
    meaning: meaningMap[nameAna.expressionNumber] || 'Standard progressive Chaldean commercial node.',
    expansionTip: `Incorporate more green branding colors (Mercury 5) if your total is 5, or off-white/cream branding if your total is 6, to attract premium high-spending corporate clients.`
  };
}

export function generateChildNumerology(dobStr: string): ChildReport {
  const parts = dobStr.split('-');
  const day = parseInt(parts[2], 10) || 1;
  const dayReduced = reduceToSingleDigit(day);

  // Calculate Conductor
  const cleanDob = dobStr.replace(/[^0-9]/g, '');
  const dobSum = cleanDob.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  const conductor = reduceToSingleDigit(dobSum);

  // Suggest starting alphabetical letters based on Chaldean friendly mappings
  let startingAlphabets: string[] = [];
  let suggestedPlanets: string[] = [];
  let cautionaryAlphabets: string[] = [];
  let careerPrecedence = '';

  if (dayReduced === 1) {
    startingAlphabets = ['A', 'I', 'Y', 'J', 'Q', 'E', 'H', 'N'];
    suggestedPlanets = ['Sun (1)', 'Mercury (5)', 'Jupiter (3)'];
    cautionaryAlphabets = ['B', 'K', 'R', 'F', 'P'];
    careerPrecedence = 'Destined for independent leadership, medical research, entrepreneurship, or defense services.';
  } else if (dayReduced === 2) {
    startingAlphabets = ['C', 'G', 'L', 'S', 'F', 'P'];
    suggestedPlanets = ['Moon (2)', 'Jupiter (3)', 'Venus (6)'];
    cautionaryAlphabets = ['M', 'T', 'D'];
    careerPrecedence = 'Highly creative and empathetic. Fosters talent in writing, creative arts, counseling, and diplomacy.';
  } else if (dayReduced === 3) {
    startingAlphabets = ['A', 'I', 'Y', 'U', 'V', 'W'];
    suggestedPlanets = ['Jupiter (3)', 'Sun (1)', 'Venus (6)'];
    cautionaryAlphabets = ['E', 'H', 'N'];
    careerPrecedence = 'Excellent intellectual capacities. Propels fields of academics, legal affairs, financial councils, and teaching.';
  } else if (dayReduced === 4) {
    startingAlphabets = ['E', 'H', 'N', 'X', 'U', 'V', 'W'];
    suggestedPlanets = ['Mercury (5)', 'Venus (6)'];
    cautionaryAlphabets = ['A', 'I', 'Y', 'O', 'Z'];
    careerPrecedence = 'Great systematic, analytical coding prowess. Ideal for civil architects and tech researchers.';
  } else if (dayReduced === 5) {
    startingAlphabets = ['A', 'I', 'Y', 'E', 'H', 'N', 'X', 'U', 'V', 'W'];
    suggestedPlanets = ['Mercury (5)', 'Venus (6)', 'Sun (1)'];
    cautionaryAlphabets = ['F', 'P'];
    careerPrecedence = 'Astounding communication skills. Perfect fit for marketing corporate portals, media, and heavy trading.';
  } else if (dayReduced === 6) {
    startingAlphabets = ['U', 'V', 'W', 'E', 'H', 'N', 'X'];
    suggestedPlanets = ['Venus (6)', 'Mercury (5)'];
    cautionaryAlphabets = ['C', 'G', 'L', 'S'];
    careerPrecedence = 'Great design assets focus. Excellent for luxury hospitality, jewelry curation, and high-style modeling.';
  } else if (dayReduced === 7) {
    startingAlphabets = ['C', 'G', 'L', 'S', 'U', 'V', 'W'];
    suggestedPlanets = ['Ketu (7)', 'Venus (6)', 'Jupiter (3)'];
    cautionaryAlphabets = ['B', 'K', 'R'];
    careerPrecedence = 'Occult sciences interest. Superb logical systems analyzer, coder, or mental traveler.';
  } else if (dayReduced === 8) {
    startingAlphabets = ['C', 'G', 'L', 'S', 'U', 'V', 'W'];
    suggestedPlanets = ['Jupiter (3)', 'Venus (6)'];
    cautionaryAlphabets = ['A', 'I', 'Y', 'E', 'H', 'N'];
    careerPrecedence = 'Legacy builders. Focuses on real estate planning, legal judgeship, and large structural logistics.';
  } else {
    startingAlphabets = ['A', 'I', 'Y', 'C', 'G', 'L', 'S'];
    suggestedPlanets = ['Mars (9)', 'Sun (1)', 'Jupiter (3)'];
    cautionaryAlphabets = ['E', 'H', 'N', 'F', 'P'];
    careerPrecedence = 'Daring defense leaders. Excel in police force commands, specialized surgeries, and physical engineering.';
  }

  return {
    birthDriver: dayReduced,
    birthConductor: conductor,
    startingAlphabets,
    suggestedPlanets,
    cautionaryAlphabets,
    careerPrecedence
  };
}

export function generateLuckyDatesForMonth(driver: number, conductor: number, month: number, year: number): number[] {
  // A lucky date is friendly with both driver & conductor and reduces to single digits (avoiding 8 and 4)
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

  const results: number[] = [];
  for (let date = 1; date <= 31; date++) {
    const reduced = reduceToSingleDigit(date);
    if (drFriendly.includes(reduced) && cdFriendly.includes(reduced) && reduced !== 8 && reduced !== 4) {
      results.push(date);
    }
  }

  // Backup if too selective
  if (results.length === 0) {
    for (let date = 1; date <= 31; date++) {
      const reduced = reduceToSingleDigit(date);
      if ([1, 5, 6].includes(reduced)) {
        results.push(date);
      }
    }
  }

  return results.slice(0, 12);
}
