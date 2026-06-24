import { reduceToSingleDigit } from './numerologyEngine';

export interface DashaPeriod {
  planet: number;
  planetName: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  healthImpact: string;
  careerImpact: string;
  relationshipImpact: string;
  financialImpact: string;
  generalInfluence: string;
}

export interface AntardashaPeriod {
  subPlanet: number;
  subPlanetName: string;
  durationYears: number;
  ageOfInfluence: number;
  calendarYear: number;
  forecast: string;
}

export interface DashaAnalysisReport {
  birthYear: number;
  currentAge: number;
  currentYear: number;
  mahadashasList: DashaPeriod[];
  currentMahadasha: DashaPeriod;
  currentAntardasha: AntardashaPeriod;
  personalYearNumber: number;
  personalYearForecast: string;
}

const PLANET_NAMES: Record<number, string> = {
  1: 'Sun (सूर्य - Energy, Fame, Authority)',
  2: 'Moon (चन्द्र - Peace, Fluidity, Creativity)',
  3: 'Jupiter (गुरु - Wisdom, Counsel, Wealth)',
  4: 'Rahu (राहु - Ambition, Mystery, sudden turns)',
  5: 'Mercury (बुध - Logic, Business, Speed)',
  6: 'Venus (शुक्र - Luxury, Romance, Fine Arts)',
  7: 'Ketu (केतु - Analysis, Spiritual detached eye)',
  8: 'Saturn (शनि - Discipline, Legacy, delays)',
  9: 'Mars (मंगल - Fire, Direct Courage, Muscle)'
};

const PLANET_DASHA_DESCS: Record<number, {
  general: string;
  health: string;
  career: string;
  relationship: string;
  financial: string;
}> = {
  1: {
    general: 'A highly radiant solar era. Prompts intense self-confidence, recognition, and vertical career elevations.',
    health: 'Generally excellent health vitality. Beware of minor eye strains or heat-related acidity spikes.',
    career: 'Outstanding leadership phase. Perfect for starting independent corporate ventures or government contract works.',
    relationship: 'Ego conflicts are possible if partner advice is completely shut off. Maintain humility.',
    financial: 'Stable financial gains from royal assets or high executive promotions; luxury spend increases.'
  },
  2: {
    general: 'An emotional lunar period focusing on creative intuition, alliances, and home renovations.',
    health: 'Sensitive digestive cycles. Susceptibility to coughs, chest congestions, or minor mood fluctuations.',
    career: 'Success in fluid fields like hospitality, food imports, writing, marketing, or design alliances.',
    relationship: 'Deep sentimental and emotional connection. High marital matching possibilities.',
    financial: 'Fluctuating cash velocity. Good gains from liquid assets but avoid bulk hasty cash speculative investments.'
  },
  3: {
    general: 'The golden Jupiter cycle of wisdom expansion, spiritual focus, learning, and steady financial building.',
    health: 'Good general physical wellness. Avoid heavy sugary diets to protect hepatic and pancreatic balances.',
    career: 'Promotions to advisor, administrative supervisor, or educational consultant roles.',
    relationship: 'Deep respect and values alignment with family. Auspicious period for childbirth or marriages.',
    financial: 'Generous, reliable, long-term wealth growth, real estate accumulation, and highly secure returns.'
  },
  4: {
    general: 'A chaotic, fast-moving Rahu period. Expect unexpected business opportunities and global travel.',
    health: 'Nervous tension, deep-seated unexplained back pains, or skin sensitivities. Rest is crucial.',
    career: 'High gains in software, digital platforms, defense, or sudden speculative trades. Keep plans private.',
    relationship: 'Sudden romantic attachments or unexpected disagreements. Guard family stability closely.',
    financial: 'Highly erratic, sudden massive profits alternate with sudden overhead expenses. Keep assets locked.'
  },
  5: {
    general: 'A business-accelerating Mercury period. Prompts quick mathematical reasoning, marketing success, and travel.',
    health: 'High mental energy. Prevent nervous head exhaustion by keeping regular sleeping hours.',
    career: 'Perfect for trading, writing software coding, counseling, brokerage, or major public relations roles.',
    relationship: 'Light, playful, conversational interactions. New intellectual friendships flourish.',
    financial: 'Rapid cash rotation. Multiple streams of small trading incomes; excellent for commercial growth.'
  },
  6: {
    general: 'The luxury Venus epoch. Brings brand fame, aesthetic comforts, material vehicles, and massive love vibrations.',
    health: 'Good recovery. Keep urinary tracts flushed, avoiding high sugary luxury desserts containing artificial dyes.',
    career: 'Brilliant for cosmetic imports, fashion designs, high retail, jewelry, fine dining, or architecture.',
    relationship: 'Extreme romantic harmony, domestic happiness, and luxury marriage activities.',
    financial: 'Sovereign spending power. Fortunate asset purchases (such as matching household luxury or vehicles).'
  },
  7: {
    general: 'An introspective, analytical Ketu phase. Encourages spiritual studies, research projects, and mental detachment.',
    health: 'Unexplained bodily allergies. Daily pranayama and natural detox diets offer profound relief.',
    career: 'Outstanding for technical research, research auditing, astrology, medical diagnostic labs, or philosophy writing.',
    relationship: 'Desire for quiet isolation or deep mutual spiritual journeys; avoids loud family arguments.',
    financial: 'Moderate material accumulation. High inner wealth development. Avoid giving bulk cash borrowings.'
  },
  8: {
    general: 'The testing but highly rewarding Saturn era. Demands systematic hard work, patient building, and total honesty.',
    health: 'Joint pains, dry skin, or slower digestion. Daily intake of warm mustard/sesame oil foods is helpful.',
    career: 'Gradual, highly secure progress. Heavy corporate tasks, manufacturing, iron trades, or law.',
    relationship: 'Demands absolute duty and elder parenting responsibility. Strong bonds consolidated slowly.',
    financial: 'Delayed but rock-solid assets creation. Real estate investments are profitable over 7+ years.'
  },
  9: {
    general: 'The energetic Mars period. Gives explosive working drive, competitive combat, and raw mechanical stamina.',
    health: 'High blood circulation. Prone to minor muscular sprains, head rushes, or accidental heat bruises. Stay calm.',
    career: 'Success in industrial operations, security, land developing, athletics, surgery, or defense.',
    relationship: 'Highly protective, direct feelings. Possible verbal sparring due to rapid short temper.',
    financial: 'Rapid capital investments. Profitable deals in brick-kiln properties, farming lands, or raw copper holdings.'
  }
};

export function calculateDashaAndYearForecast(dobStr: string, currentCalYear: number = 2026): DashaAnalysisReport {
  const parts = dobStr.split('-');
  const bYear = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  const currentAge = currentCalYear - bYear;

  // Single reduction helpers
  const p1 = reduceToSingleDigit(day);
  const cleanStr = dobStr.replace(/[^0-9]/g, '');
  const dSum = cleanStr.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  const p2 = reduceToSingleDigit(dSum);

  // Generate 9 distinct major Mahadasha blocks
  const driver = p1;
  const conductor = p2;

  const planetSeq = [
    driver,
    conductor,
    reduceToSingleDigit(driver + conductor),
    reduceToSingleDigit(day),
    reduceToSingleDigit(month),
    reduceToSingleDigit(bYear),
    reduceToSingleDigit(driver * 2),
    reduceToSingleDigit(conductor * 2),
    9
  ].map(p => p === 0 ? 9 : p);

  // Eliminate adjacent duplicate planets to ensure diversity
  const uniquePlanetSeq: number[] = [];
  planetSeq.forEach(p => {
    if (uniquePlanetSeq.length === 0 || uniquePlanetSeq[uniquePlanetSeq.length - 1] !== p) {
      uniquePlanetSeq.push(p);
    }
  });
  // Fill back up to 9 with missing numbers if we collapsed duplicates
  for (let i = 1; i <= 9; i++) {
    if (uniquePlanetSeq.length < 9 && !uniquePlanetSeq.includes(i)) {
      uniquePlanetSeq.push(i);
    }
  }
  // If still under 9, fill with sequential backups
  while (uniquePlanetSeq.length < 9) {
    uniquePlanetSeq.push((uniquePlanetSeq[uniquePlanetSeq.length - 1] % 9) + 1);
  }

  const dashaList: DashaPeriod[] = [];
  let trackingYear = bYear;

  for (let idx = 0; idx < 9; idx++) {
    const pl = uniquePlanetSeq[idx];
    const sAge = idx * 9;
    const eAge = (idx + 1) * 9 - 1;
    const sYear = trackingYear;
    const eYear = trackingYear + 8;

    const descSet = PLANET_DASHA_DESCS[pl] || PLANET_DASHA_DESCS[1];

    dashaList.push({
      planet: pl,
      planetName: PLANET_NAMES[pl] || 'Unknown',
      startAge: sAge,
      endAge: eAge,
      startYear: sYear,
      endYear: eYear,
      healthImpact: descSet.health,
      careerImpact: descSet.career,
      relationshipImpact: descSet.relationship,
      financialImpact: descSet.financial,
      generalInfluence: descSet.general
    });

    trackingYear += 9;
  }

  // Find current running Mahadasha
  let currentMahadasha = dashaList[0];
  for (const ds of dashaList) {
    if (currentCalYear >= ds.startYear && currentCalYear <= ds.endYear) {
      currentMahadasha = ds;
      break;
    }
  }

  // If age exceeds largest block, default to last
  if (currentCalYear > dashaList[8].endYear) {
    currentMahadasha = dashaList[8];
  }

  // Compute Antardasha inside current Mahadasha (9 subperiods of 1 year each)
  const dashaElapsedYears = currentCalYear - currentMahadasha.startYear;
  // Sub period index: 0 to 8
  const subIdx = Math.max(0, Math.min(8, dashaElapsedYears));

  // Antardashas are ruled by sub planets sequencing starting from the Mahadasha planet
  const subPlanet = ((currentMahadasha.planet + subIdx - 1) % 9) + 1;

  const antardashaForecasts: Record<number, string> = {
    1: 'Sun Sub-period adds immense administrative spotlight. Ideal for clearing out corporate delays, securing senior endorsements, and showcasing creative works.',
    2: 'Moon Sub-period calms the mind. Prompts beautiful domestic changes, real estate decoration, and deep emotional bonding. Protect against sudden cold waves.',
    3: 'Jupiter Sub-period brings auspicious guidance. Solves complex financial knots, expands learning and study opportunities, and attracts highly reliable mentors.',
    4: 'Rahu Sub-period is a sudden wild card. Be alert for sudden foreign deals or technology breakthroughs. Avoid any haste, locking in important contracts safely.',
    5: 'Mercury Sub-period favors business speed. Outstanding for website launches, public relations scripts, billing audits, and writing clean computer codes.',
    6: 'Venus Sub-period brings luxurious relaxation. Excellent cash flows, social status rises, asset additions, and deep marital matching sync.',
    7: 'Ketu Sub-period is ideal for deep-dive technical research and spiritual detox plans. Highly intuitive dreams will protect you.',
    8: 'Saturn Sub-period tests your discipline. Demands structured patience, long hours of dedicated coding, and checking physical joint health regularly.',
    9: 'Mars Sub-period injects high physical stamina and decisive action-taking powers. Perfect for executing tough, backlogged files and leading land projects.'
  };

  const currentAntardasha: AntardashaPeriod = {
    subPlanet,
    subPlanetName: PLANET_NAMES[subPlanet] || 'Unknown',
    durationYears: 1,
    ageOfInfluence: currentMahadasha.startAge + subIdx,
    calendarYear: currentCalYear,
    forecast: antardashaForecasts[subPlanet] || 'Supportive planetary sub-frequency coordinates.'
  };

  // Personal Year Calculations
  // PY = reduceToSingleDigit(Day + Month + CurrentYear)
  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const calYearReduced = reduceToSingleDigit(currentCalYear);
  const personalYearNumber = reduceToSingleDigit(dayReduced + monthReduced + calYearReduced);

  const pyForecasts: Record<number, string> = {
    1: 'Vaidic Personal Year 1 (Sūryāṅk - New Dawn): A year of dynamic beginnings, clean leadership targets, and establishing new brand directions. Face East and begin bold independent initiatives with supreme conviction.',
    2: 'Vaidic Personal Year 2 (Somāṅk - Harmonious Union): Focus is fully on team coordination, joint accounts, writing scripts, and liquid cash stabilization. Drink water from silver cups to keep emotional waves balanced.',
    3: 'Vaidic Personal Year 3 (Gurvāṅk - Wisdom Harvest): An exceptionally lucky, growth-oriented period for publishing, financial consulting, higher studies, and teaching. Seek paternal blessings and wear saffron gold colors.',
    4: 'Vaidic Personal Year 4 (Rahuāṅk - Unorthodox Expansion): Expect unexpected global travel and high tech opportunities. Guard against impulsive, sudden business ventures. Keep a solid wooden block on your work desk.',
    5: 'Vaidic Personal Year 5 (Budhāṅk - Mercantile Acceleration): The ultimate business communication and PR year. Quick sales, multiple micro-incomes, script code deployments, and rapid network builds. Feed green grass to cows.',
    6: 'Vaidic Personal Year 6 (Shukrāṅk - Domestic Splendor): The year of luxury, wedding drapes, automobile purchases, and high creative recognition. Use light sandalwood fragrances to invite extreme luxury.',
    7: 'Vaidic Personal Year 7 (Ketuāṅk - Introspective Wisdom): A deeper year of core analytical research, meditation, and physical detoxification. Avoid loaning massive cash sums. Keep standard bird grains on windows.',
    8: 'Vaidic Personal Year 8 (Shaniāṅk - Systematic Consolidation): A year of extreme real estate planning, ancestral duties, and grinding labor. Light mustard oil lamps under Peepal trees on Saturdays to clear delays.',
    9: 'Vaidic Personal Year 9 (Maṅgalāṅk - Karmic Completion): A vibrant fire year of ending old bad habits, cleaning your office clutter, and preparing for the next 9-year loop. Do daily charity work with absolute humbleness.'
  };

  const personalYearForecast = pyForecasts[personalYearNumber] || 'Supportive numeric transit influences.';

  return {
    birthYear: bYear,
    currentAge,
    currentYear: currentCalYear,
    mahadashasList: dashaList,
    currentMahadasha,
    currentAntardasha,
    personalYearNumber,
    personalYearForecast
  };
}
