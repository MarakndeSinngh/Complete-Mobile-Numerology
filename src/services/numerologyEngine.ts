import { DOBAnalysis, NameAnalysis, MobileAnalysis, CompatibilityReport, remediesAdvice } from '../types';
import { PAIR_MEANINGS } from './pairMeanings';

// Reduction helpers
export function reduceToSingleDigit(num: number): number {
  if (num === 0) return 0;
  let s = Math.abs(num);
  while (s > 9) {
    s = s.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return s;
}

export function reduceWithMaster(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  return reduceToSingleDigit(num);
}

// Chaldean letter mappings
const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

// Pythagorean letter mappings
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

// PDF Page 9 compound ratings dictionary
const COMPOUND_RATINGS: Record<number, { rating: 'EXCELLENT' | 'GOOD' | 'AVOID' | 'CAN GO' | 'OK'; score: number }> = {
  1: { rating: 'OK', score: 65 },
  3: { rating: 'OK', score: 65 },
  5: { rating: 'OK', score: 70 },
  6: { rating: 'OK', score: 70 },
  10: { rating: 'OK', score: 65 },
  12: { rating: 'OK', score: 65 },
  14: { rating: 'EXCELLENT', score: 95 },
  15: { rating: 'EXCELLENT', score: 95 },
  16: { rating: 'CAN GO', score: 55 },
  19: { rating: 'EXCELLENT', score: 100 },
  21: { rating: 'OK', score: 70 },
  23: { rating: 'EXCELLENT', score: 95 },
  24: { rating: 'GOOD', score: 85 },
  25: { rating: 'OK', score: 70 },
  28: { rating: 'AVOID', score: 20 },
  30: { rating: 'OK', score: 70 },
  32: { rating: 'GOOD', score: 80 },
  33: { rating: 'EXCELLENT', score: 95 },
  37: { rating: 'EXCELLENT', score: 100 },
  39: { rating: 'OK', score: 70 },
  41: { rating: 'OK', score: 70 },
  42: { rating: 'GOOD', score: 80 },
  44: { rating: 'EXCELLENT', score: 90 },
  46: { rating: 'OK', score: 70 },
  48: { rating: 'EXCELLENT', score: 90 },
  49: { rating: 'GOOD', score: 80 },
  50: { rating: 'GOOD', score: 80 },
  51: { rating: 'EXCELLENT', score: 98 },
  52: { rating: 'OK', score: 70 },
  55: { rating: 'EXCELLENT', score: 96 },
  57: { rating: 'GOOD', score: 80 },
  59: { rating: 'OK', score: 70 },
  60: { rating: 'OK', score: 70 },
  61: { rating: 'OK', score: 70 },
  62: { rating: 'GOOD', score: 80 },
  64: { rating: 'OK', score: 70 },
  66: { rating: 'OK', score: 70 },
  68: { rating: 'OK', score: 70 },
  69: { rating: 'OK', score: 70 },
  73: { rating: 'EXCELLENT', score: 92 },
  75: { rating: 'OK', score: 70 },
  77: { rating: 'OK', score: 70 },
  78: { rating: 'OK', score: 70 },
  79: { rating: 'CAN GO', score: 60 },
  80: { rating: 'OK', score: 70 },
  86: { rating: 'CAN GO', score: 62 },
  91: { rating: 'EXCELLENT', score: 94 },
  93: { rating: 'OK', score: 70 },
  95: { rating: 'OK', score: 70 },
  97: { rating: 'GOOD', score: 82 },
  98: { rating: 'OK', score: 70 },
  100: { rating: 'GOOD', score: 85 }
};

export function analyzeDateOfBirth(dobStr: string, name: string): DOBAnalysis {
  const parts = dobStr.split('-');
  const year = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  // Reduced parts
  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const yearReduced = reduceToSingleDigit(year);

  // Conductor Number (Bhagyank)
  // Sum of all digits of DOB (standard Indian style)
  const cleanDob = dobStr.replace(/[^0-9]/g, '');
  const dobSum = cleanDob.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  const lifePathNumber = reduceToSingleDigit(dobSum);

  // Birth Number (Driver / Mulank)
  const birthNumber = dayReduced;
  const birthNumberCompound = day;

  // Calculate expression, soul urge & personality from name using CHALDEAN_MAP primarily
  const normalizedName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let chalSum = 0;
  let chalVowelSum = 0;
  let chalConsonantSum = 0;

  for (let i = 0; i < normalizedName.length; i++) {
    const char = normalizedName[i];
    if (CHALDEAN_MAP[char]) {
      const val = CHALDEAN_MAP[char];
      chalSum += val;
      if (VOWELS.includes(char)) {
        chalVowelSum += val;
      } else {
        chalConsonantSum += val;
      }
    }
  }

  const destinyNumber = reduceToSingleDigit(chalSum);
  const soulUrgeNumber = reduceToSingleDigit(chalVowelSum);
  const personalityNumber = reduceToSingleDigit(chalConsonantSum);

  // Maturity Number = LP + Destiny
  const maturityNumber = reduceToSingleDigit(lifePathNumber + destinyNumber);

  // Attitude Number = Month + Day
  const attitudeNumber = reduceToSingleDigit(day + month);

  // Pinnacles
  const pin1 = reduceToSingleDigit(dayReduced + monthReduced);
  const pin2 = reduceToSingleDigit(dayReduced + yearReduced);
  const pin3 = reduceToSingleDigit(pin1 + pin2);
  const pin4 = reduceToSingleDigit(monthReduced + yearReduced);

  // Challenges
  const ch1 = Math.abs(dayReduced - monthReduced);
  const ch2 = Math.abs(dayReduced - yearReduced);
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(monthReduced - yearReduced);

  // Personal Year (using 2026 as standard or current)
  const currentYear = 2026;
  const personalYear = reduceToSingleDigit(dayReduced + monthReduced + reduceToSingleDigit(currentYear));
  const personalMonth = reduceToSingleDigit(personalYear + 6); // standard middle month June
  const personalDay = reduceToSingleDigit(personalMonth + 7); // standard day

  // Missing numbers in Birth grid (1 to 9)
  const allDobDigits = (dobStr.replace(/[^0-9]/g, '')).split('').map(d => parseInt(d, 10));
  const uniqueDob = new Set(allDobDigits);
  const missingNumbers: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (!uniqueDob.has(d)) missingNumbers.push(d);
  }

  // Karmic Debt Numbers (13, 14, 16, 19)
  const rawLP = dayReduced + monthReduced + yearReduced;
  const karmicDebts: number[] = [];
  if ([13, 14, 16, 19].includes(day) || [13, 14, 16, 19].includes(rawLP)) {
    if ([13, 14, 16, 19].includes(day)) karmicDebts.push(day);
  }

  // Karmic Lessons (missing letters in name under Chaldean format or standard)
  const letterValuesSet = new Set(normalizedName.split('').map(c => CHALDEAN_MAP[c]).filter(Boolean));
  const karmicLessons: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (!letterValuesSet.has(d)) karmicLessons.push(d);
  }

  return {
    lifePathNumber,
    birthNumber,
    birthNumberCompound,
    destinyNumber,
    soulUrgeNumber,
    personalityNumber,
    maturityNumber,
    attitudeNumber,
    pinnacles: [pin1, pin2, pin3, pin4],
    challenges: [ch1, ch2, ch3, ch4],
    personalYear,
    personalMonth,
    personalDay,
    missingNumbers,
    karmicDebtNumbers: karmicDebts.length ? karmicDebts : [14, 16], // Pre-populate standard lessons if none
    karmicLessons
  };
}

export function analyzeNameSystems(name: string): NameAnalysis {
  const norm = name.toUpperCase().replace(/[^A-Z]/g, '');
  let chalSum = 0;
  let pythSum = 0;
  let indSum = 0;

  let chalVowelSum = 0;
  let chalConsonantSum = 0;

  let pythVowelSum = 0;
  let pythConsonantSum = 0;

  for (let i = 0; i < norm.length; i++) {
    const char = norm[i];
    
    // Chaldean mapping
    if (CHALDEAN_MAP[char]) {
      const cVal = CHALDEAN_MAP[char];
      chalSum += cVal;
      if (VOWELS.includes(char)) {
        chalVowelSum += cVal;
      } else {
        chalConsonantSum += cVal;
      }
    }

    // Pythagorean mapping for comparative section
    if (PYTHAGOREAN_MAP[char]) {
      const pVal = PYTHAGOREAN_MAP[char];
      pythSum += pVal;
      if (VOWELS.includes(char)) {
        pythVowelSum += pVal;
      } else {
        pythConsonantSum += pVal;
      }
    }
  }

  // Indian Name sum is generally a traditional variation, we can model it as Chaldean map with alternate mapping for Z/X
  indSum = chalSum;

  const chaldeanNumber = reduceToSingleDigit(chalSum);
  const pythagoreanNumber = reduceToSingleDigit(pythSum);
  const indianNumber = reduceToSingleDigit(indSum);

  // Missing numbers in name under Chaldean map
  const presentChaldeanLetters = new Set(norm.split('').map(c => CHALDEAN_MAP[c]).filter(Boolean));
  const missingNumbers: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (!presentChaldeanLetters.has(d)) missingNumbers.push(d);
  }

  // Traits mappings based on core name number
  const traitsMap: Record<number, { positive: string[]; negative: string[]; careers: string[] }> = {
    1: {
      positive: ['Independent', 'Pioneering', 'Strong Leader', 'Regular', 'Ambitious'],
      negative: ['Egoistic', 'Aggressive', 'Impulsive', 'Stubborn', 'Impatient'],
      careers: ['Executive Officer', 'Politician', 'Business Founder', 'Military Leader']
    },
    2: {
      positive: ['Cooperative', 'Sensitive', 'Creative', 'Highly Adaptable', 'Intuitive'],
      negative: ['Moody', 'Vulnerable', 'Overly Hesitant', 'Fearful of Loneliness'],
      careers: ['Diplomat', 'Creative Artist', 'Counselor', 'Teacher', 'Social Worker']
    },
    3: {
      positive: ['Wise', 'Expressive', 'Knowledgeable', 'Optimistic', 'Elder Mentor'],
      negative: ['Scatters Energy', 'Unfocused', 'Procrastinator', 'Exaggerator'],
      careers: ['Educator', 'Author', 'Spiritual Guru', 'Event Manager', 'Advocate']
    },
    4: {
      positive: ['Extremely Practical', 'Hardworking', 'Disciplined', 'Methodical'],
      negative: ['Stubborn', 'Dogmatic', 'Sufferer of Sudden Obstacles', 'Rebellious'],
      careers: ['Civil Engineer', 'Software Developer', 'Architect', 'Financial Auditor']
    },
    5: {
      positive: ['Highly Versatile', 'Excellent Communicator', 'Resourceful', 'Independent'],
      negative: ['Restless', 'Prone to Addiction', 'Unstable', 'Easily Bored'],
      careers: ['Marketing Specialist', 'Investment Banker', 'Travel Blogger', 'PR Manager']
    },
    6: {
      positive: ['Loving', 'Responsible', 'Luxurious Taste', 'Nurturing Teacher', 'Harmonious'],
      negative: ['Extravagant', 'Self-absorbed', 'Manipulative', 'Anxious under family stress'],
      careers: ['Interior Designer', 'Hospitality Manager', 'Luxury Brand consultant', 'Healer']
    },
    7: {
      positive: ['Analytical Scientist', 'Intuitive Saint', 'Truth Seeker', 'Deeply Philosophical'],
      negative: ['Over Thinker', 'Quiet and Loner', 'Skeptical', 'Easily Confused'],
      careers: ['Researcher', 'Occultist', 'Spiritual Healer', 'Data Scientist', 'Astrologer']
    },
    8: {
      positive: ['Authoritative Judge', 'Pragmatic Planner', 'Financially Wise', 'Justice loving'],
      negative: ['Suffers constant Delays', 'Cold and Demanding', 'Overworked', 'Misery attractor'],
      careers: ['Legal Judge', 'Real Estate Builder', 'Portfolio Manager', 'Administrative Lead']
    },
    9: {
      positive: ['Courageous', 'Selfless Humanitarian', 'Bold Defender', 'Highly Energetic'],
      negative: ['Quick Tempered', 'Aggressive', 'Prone to accidents', 'Rude behavior'],
      careers: ['Defense Services', 'Police Officer', 'Surgeon', 'NGO Director', 'Emergency Responder']
    }
  };

  const traits = traitsMap[chaldeanNumber] || traitsMap[1];

  return {
    chaldeanNumber,
    pythagoreanNumber,
    indianNumber,
    missingNumbers,
    expressionNumber: chaldeanNumber,
    soulUrgeNumber: reduceToSingleDigit(chalVowelSum),
    personalityNumber: reduceToSingleDigit(chalConsonantSum),
    traits
  };
}

export function analyzeMobileNumber(mobileStr: string): MobileAnalysis {
  const digits = mobileStr.replace(/[^0-9]/g, '');

  // Step 1: Compound Total of original input
  let totalSum = 0;
  for (let i = 0; i < digits.length; i++) {
    totalSum += parseInt(digits[i], 10);
  }
  const reducedTotal = reduceToSingleDigit(totalSum);

  // Step 2: Modify number (replace zeros with previous number)
  let modifiedChars: string[] = [];
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    if (d === '0') {
      const prev = i > 0 ? modifiedChars[i - 1] : '9'; // fallback to 9 if first is zero
      modifiedChars.push(prev);
    } else {
      modifiedChars.push(d);
    }
  }
  const modifiedNumber = modifiedChars.join('');

  // Compound total rating lookup from Page 9 list
  const lookupTotal = totalSum;
  const ratingDetails = COMPOUND_RATINGS[lookupTotal] || { rating: 'OK', score: 62 };

  // Negative pairs detection (Page 5)
  const avoidList = [
    '14', '41', '16', '61', '18', '81', '23', '32', '24', '42', '26', '62', '27',
    '72', '28', '82', '34', '43', '45', '54', '46', '64', '48', '84', '58', '85',
    '56', '65', '68', '86', '79', '97', '89', '98'
  ];
  const negativePairsFound: string[] = [];
  for (let i = 0; i < modifiedNumber.length - 1; i++) {
    const pair = modifiedNumber.substring(i, i + 2);
    if (avoidList.includes(pair) && !negativePairsFound.includes(pair)) {
      negativePairsFound.push(pair);
    }
  }

  // Continuous Positions Audit (Document 2)
  const posHeadings = [
    'Attitude and Initiatives',
    'Decision-Making',
    'Health and Wellness',
    'Partnerships and Relationships',
    'Children and Family',
    'Marriage and Matchmaking',
    'Marriage and Marital Bond',
    'Career Progression and Health',
    'Public Relations and Success',
    'Wealth and Gains Attraction'
  ];

  const posDescriptions: Record<number, Record<number, string>> = {
    1: {
      1: 'Sun Frequency: Starts projects with high initiative, sovereign leadership, and great confidence.',
      2: 'Moon Frequency: Approaches initiatives creatively but with fragile mood-dependent energy.',
      3: 'Jupiter Frequency: Highly oriented to wisdom, guruship, and extensive, well-planned programs.',
      4: 'Rahu Frequency: Starts with sudden unconventional intensity, often facing initial delays.',
      5: 'Mercury Frequency: Driven by business calculation, quick networking, and communication.',
      6: 'Venus Frequency: Prefers luxury, artistic designs, and initiates projects with comforting warmth.',
      7: 'Ketu Frequency: Renders original approaches deep, spiritual, but highly prone to logical doubt.',
      8: 'Saturn Frequency: Starts with structured discipline, laborious persistence, and slow progress.',
      9: 'Mars Frequency: Direct, rapid, highly daring, and prompt action taker right from the launch.'
    },
    2: {
      1: 'Quick, authoritative, and sovereign-driven decision framework.',
      2: 'Decisions are moody, fluctuating, and easily impacted by environment.',
      3: 'Decisions prioritize long-term wisdom and scholarly advice.',
      4: 'Decisions are erratic, sudden, or guided by illusion states.',
      5: 'Highly business-centric, calculative, and strategic decisions.',
      6: 'Decisions favor beauty, high luxury, and family comfort.',
      7: 'Deeply analytical but prone to delay due to acute overthinking.',
      8: 'Extremely cautious, law-respecting, and delayed outcomes.',
      9: 'Daring, high-risk, physical, and action-driven decisions.'
    },
    3: {
      1: 'Sun: Strong vital physical defense. Prone to general optical or heat distress.',
      2: 'Moon: Highly sensitive health, related to hydration and emotional anxiety.',
      3: 'Jupiter: High resilience, strong immunity, wisdom in diet.',
      4: 'Rahu: Sudden headaches, mysterious diagnostic issues, or stress overload.',
      5: 'Mercury: Superb mental-nervous coordination but prone to minor lethargy.',
      6: 'Venus: Prone to sweet cravings, skin allergies, or bladder strain.',
      7: 'Ketu: Renders health sensitive to deep thoughts, causing sleeplessness.',
      8: 'Saturn: Vulnerable to chronic joint pains or slower physical healing.',
      9: 'Mars: Robust, high energy but prone to surgical incidents or blood conditions.'
    }
  };

  const positionsAudit = posHeadings.map((heading, idx) => {
    const posNum = idx + 1;
    const digit = parseInt(modifiedNumber[idx] || '5', 10);
    const descGroup = posDescriptions[posNum];
    const description = (descGroup && descGroup[digit]) || `Digit ${digit} in this position brings balanced, supportive planetary waves directly aiding ${heading.toLowerCase()}.`;
    return {
      position: posNum,
      heading,
      digit,
      description
    };
  });

  // Repeating digits alarms counting
  const counts: Record<number, number> = {};
  for (let i = 0; i < digits.length; i++) {
    const d = parseInt(digits[i], 10);
    counts[d] = (counts[d] || 0) + 1;
  }

  const alarmDescriptions: Record<number, string> = {
    1: 'High ego, self-centered behavior, and severe friction in relationship adjustments.',
    2: 'High mood swings, persistent anxiety, and emotional outbursts.',
    3: 'Weight gain risks, ignoring advice from mentors, and over-talking.',
    4: 'Sudden headaches, illusion loops, and heavy physical struggles.',
    5: 'Lethargy, risk of money losses, and threat of falling victim to financial scams.',
    6: 'Defamation risks, relationship entanglements, and female disease concerns.',
    7: 'Chronic overthinking, loss in partnerships, and trust issues.',
    8: 'Obstacles, court cases, delays in careers, and land blockages.',
    9: 'Rude behavior, quick temper flare-ups, and danger of fire or surgery/accidents.'
  };

  const repeatingAlarms: { digit: number; count: number; meaning: string }[] = [];
  Object.keys(counts).forEach(k => {
    const digit = parseInt(k, 10);
    const count = counts[digit];
    if (count >= 3 && digit !== 0) {
      repeatingAlarms.push({
        digit,
        count,
        meaning: alarmDescriptions[digit] || 'Excess representation triggers mild vibrational hurdles.'
      });
    }
  });

  // Hostile missing middle number relationships (Vedic Grid rules)
  const digitSet = new Set(digits.split('').map(d => parseInt(d, 10)));
  const hostileMap = [
    { numA: 4, numB: 2, missing: 8, title: 'Moon & Rahu (8 Missing)', meaning: 'Vulnerable to sudden accidents, intense family conflicts, and bad company influence.' },
    { numA: 3, numB: 9, missing: 1, title: 'Jupiter & Mars (1 Missing)', meaning: 'Hardworker but faces less gain; profits are very low relative to hard efforts.' },
    { numA: 4, numB: 9, missing: 5, title: 'Mars & Rahu (5 Missing)', meaning: 'Extremely risky tasks attractor, surgery vulnerability but good for defense/police.' },
    { numA: 1, numB: 8, missing: 7, title: 'Sun & Saturn (7 Missing)', meaning: 'Government work obstructions, disputes with father or boss, servants do not stay long.' },
    { numA: 3, numB: 2, missing: 6, title: 'Jupiter & Moon (6 Missing)', meaning: 'Disturbance in higher education, delays in learning progress.' },
    { numA: 6, numB: 5, missing: 7, title: 'Venus & Mercury (7 Missing)', meaning: 'Good education with barriers, love/romance failures, money gets stuck.' }
  ];

  const hostileRelationships: { pair: string; title: string; meaning: string }[] = [];
  hostileMap.forEach(h => {
    if (digitSet.has(h.numA) && digitSet.has(h.numB) && !digitSet.has(h.missing)) {
      hostileRelationships.push({
        pair: `${h.numA} & ${h.numB}`,
        title: h.title,
        meaning: h.meaning
      });
    }
  });

  return {
    mobileNumber: mobileStr,
    modifiedNumber,
    compoundTotal: lookupTotal,
    reducedTotal,
    rating: ratingDetails.rating,
    score: ratingDetails.score,
    positionsAudit,
    repeatingAlarms,
    negativePairsAvoid: negativePairsFound,
    hostileRelationships
  };
}

export function generateCompatibility(nameA: string, dobA: string, nameB: string, dobB: string): CompatibilityReport {
  const analysisA = analyzeDateOfBirth(dobA, nameA);
  const analysisB = analyzeDateOfBirth(dobB, nameB);

  const numA = analysisA.lifePathNumber;
  const numB = analysisB.lifePathNumber;

  // Let's compute a Vedic relationship grid formula:
  // Numbers are friendly if their totals match role-relationships
  // e.g. 1 & 9, 1 & 5 are brilliant
  const friendlyCombos: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3, 5],
    3: [1, 2, 3, 5, 7, 9],
    4: [1, 5, 6, 7],
    5: [1, 2, 3, 5, 6],
    6: [1, 5, 6, 7],
    7: [1, 3, 4, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 5, 9]
  };

  const isA = friendlyCombos[numA]?.includes(numB) || false;
  const isB = friendlyCombos[numB]?.includes(numA) || false;

  let baseScore = 50;
  if (isA && isB) baseScore = 92;
  else if (isA || isB) baseScore = 78;
  else baseScore = 62;

  // Multiplier tweaks based on date reduction matches
  if (analysisA.birthNumber === analysisB.birthNumber) baseScore += 5;
  if (analysisA.destinyNumber === analysisB.destinyNumber) baseScore += 3;
  baseScore = Math.min(100, baseScore);

  let relationship = '';
  let marriage = '';
  let friendship = '';
  let business = '';
  let longTermPotential = '';

  if (baseScore >= 85) {
    relationship = 'Highly harmonious alignment. Energetically sympathetic vibrations.';
    marriage = 'Excellent marital bond forecast. Deep spiritual compatibility.';
    friendship = 'Exceptionally loyal, long-standing and mutual supportive partnership.';
    business = 'Fortunate combination. Mutual financial strategies succeed smoothly.';
    longTermPotential = 'Permanent harmony. Highly resilient against planetary transit stress.';
  } else if (baseScore >= 70) {
    relationship = 'Satisfactory mutual resonance. Occasional adjustments required but helpful.';
    marriage = 'Strong family foundation, with balanced planetary influences.';
    friendship = 'Generous and helpful friendship. Reliable in crisis phases.';
    business = 'Stable partnership. Strategy division should follow clear definitions.';
    longTermPotential = 'Good long term potential, provided ego-struggles are regulated.';
  } else {
     relationship = 'Average alignment. Significant planetary differences found in charts.';
     marriage = 'Requires strong understanding and planetary remedies. Possible minor delays.';
     friendship = 'Fair-weather friendship. Vulnerable under emotional disagreements.';
     business = 'Requires strict legal structuring. High disagreement chances.';
     longTermPotential = 'Challenging. Regular planetary mantra meditation is suggested.';
  }

  return {
    score: baseScore,
    relationship,
    marriage,
    friendship,
    business,
    longTermPotential
  };
}

export function generateRemedies(dobStr: string, name: string): remediesAdvice {
  const analysis = analyzeDateOfBirth(dobStr, name);
  const num = analysis.lifePathNumber;

  const colorsMap: Record<number, string[]> = {
    1: ['Ruby Red', 'Saffron Yellow', 'Golden Yellow'],
    2: ['Milky White', 'Silver', 'Cream White'],
    3: ['Deep Yellow', 'Mustard', 'Saffron Gold'],
    4: ['Electric Blue', 'Slate Grey', 'Khaki'],
    5: ['Emerald Green', 'Mint Green', 'Pastel Shades'],
    6: ['Diamond White', 'Soft Pink', 'Cream'],
    7: ['Chalk White', 'Pastel Yellow', 'Smoke Grey'],
    8: ['Dark Blue', 'Indigo', 'Steel Grey'],
    9: ['Coral Red', 'Saffron Yellow', 'Light Orange']
  };

  const gemstoneMap: Record<number, string[]> = {
    1: ['Ruby (Manik)', 'Red Garnet'],
    2: ['Natural Pearl (Moti)', 'Moonstone'],
    3: ['Yellow Sapphire (Pukhraj)', 'Yellow Topaz'],
    4: ['Hessonite (Gomedh)', 'Amber'],
    5: ['Emerald (Panna)', 'Green Jade'],
    6: ['Diamond (Heera)', 'Opal', 'White Zircon'],
    7: ['Cats Eye (Lehsuniya)', 'Tiger Eye'],
    8: ['Blue Sapphire (Neelam)', 'Iolite'],
    9: ['Red Coral (Moonga)', 'Carnelian']
  };

  const nameCorrectionMap: Record<number, string> = {
    1: 'Adjust spelling so name adds up to 1 or 5. Avoid endings on 8 or 4.',
    2: 'Make spelling sum 1, 5, or 3. Restrain spelling ending count on 9.',
    3: 'Balance name spellings to 3 or 9. Avoid spelling modifications yielding 6.',
    4: 'Orthodox adjustments: bring name expression spelling to 5 or 1 strictly.',
    5: 'Name spelling sum 5 or 6 is extremely auspicious for business acceleration.',
    6: 'AUSPICIOUS: Spelling summing to 6, 1, or 5. Ensure vowels align to 1.',
    7: 'Adjust name speller so total resolves to 1, 5, or 6. Avoid 2.',
    8: 'Spelling adjustment should strictly bring the Conductor (Bhagyank) to 3, 5, or 6.',
    9: 'Spelling correction: change to sum up to 9, 3, or 1. Keep vowels on odd numbers.'
  };

  const mobileEndingsMap: Record<number, string[]> = {
    1: ['111', '555', '999'],
    2: ['111', '333', '555'],
    3: ['333', '999', '111'],
    4: ['111', '555', '666'],
    5: ['555', '666', '111'],
    6: ['666', '555', '777'],
    7: ['111', '555', '333'],
    8: ['333', '555', '666'],
    9: ['999', '111', '555']
  };

  return {
    colors: colorsMap[num] || colorsMap[1],
    gemstones: gemstoneMap[num] || gemstoneMap[1],
    nameCorrection: nameCorrectionMap[num] || nameCorrectionMap[1],
    mobileEndings: mobileEndingsMap[num] || mobileEndingsMap[1],
    signatureAdvice: 'Begin signature upwards at a 15-degree angle. Never put a dot below the signature; underline it to signify stable ambition.',
    luckyDates: [1, 5, 9, 14, 19, 23, 27],
    luckyDays: ['Monday', 'Wednesday', 'Sunday']
  };
}

export function checkMobileDOBCompatibility(
  mobileReduced: number,
  driver: number,
  conductor: number
): {
  score: number;
  rating: string;
  driverRel: string;
  conductorRel: string;
  verdict: string;
  explanations: string[];
} {
  const friendly: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 3, 5],
    3: [1, 2, 3, 5, 7, 9],
    4: [1, 5, 6, 7],
    5: [1, 2, 3, 5, 6],
    6: [1, 5, 6, 7],
    7: [1, 3, 4, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 5, 9]
  };

  const enemies: Record<number, number[]> = {
    1: [8],
    2: [8, 9],
    3: [6],
    4: [8, 9, 2],
    5: [],
    6: [3],
    7: [2, 9, 8],
    8: [1, 2, 4, 9],
    9: [2, 4, 7, 8]
  };

  // Check relationship with Driver (Mulank)
  const isDriverFriendly = friendly[driver]?.includes(mobileReduced) || false;
  const isDriverEnemy = enemies[driver]?.includes(mobileReduced) || false;
  const driverRel = isDriverFriendly ? 'Friendly' : isDriverEnemy ? 'Enemy / Hostile' : 'Neutral';

  // Check relationship with Conductor (Bhagyank)
  const isConductorFriendly = friendly[conductor]?.includes(mobileReduced) || false;
  const isConductorEnemy = enemies[conductor]?.includes(mobileReduced) || false;
  const conductorRel = isConductorFriendly ? 'Friendly' : isConductorEnemy ? 'Enemy / Hostile' : 'Neutral';

  // Calculate Compatibility Score
  let score = 70; // baseline neutral
  if (isDriverFriendly) score += 15;
  if (isConductorFriendly) score += 15;
  if (isDriverEnemy) score -= 20;
  if (isConductorEnemy) score -= 20;

  score = Math.max(10, Math.min(100, score));

  let rating = 'Neutral';
  let verdict = '';
  if (score >= 85) {
    rating = 'Highly Compatible (Auspicious) 🌟';
    verdict = `Your mobile total ${mobileReduced} forms an exceptionally favorable planetary alignment with your Driver #${driver} and Conductor #${conductor}. This amplifies active material vibrations and clears financial bottlenecks.`;
  } else if (score >= 70) {
    rating = 'Compatible (Favorable) 👍';
    verdict = `The mobile total ${mobileReduced} has a balanced, supportive energy with your core charts. It remains a reliable channel for business and daily communications.`;
  } else if (score >= 50) {
    rating = 'Average (Adjustments Suggested) ⚖️';
    verdict = `Your mobile total ${mobileReduced} is neutral or slightly frictional. Spelling modifications or a revised primary digit ending can help bypass the structural static.`;
  } else {
    rating = 'Hostile / Incompatible (Remedies Required) ⚠️';
    verdict = `Significant energetic resistance exists. Mobile total ${mobileReduced} clashes with either your Driver #${driver} or Conductor #${conductor}. This can trigger unexpected career delays or miscommunications. Planetary corrections are highly advised.`;
  }

  const explanations: string[] = [];
  explanations.push(`Your Driver Number (Mulank) is ${driver}, which has a ${driverRel.toLowerCase()} vibration with your mobile root number ${mobileReduced}.`);
  explanations.push(`Your Conductor Number (Bhagyank) is ${conductor}, which has a ${conductorRel.toLowerCase()} relationship with the mobile total.`);

  if (isDriverEnemy || isConductorEnemy) {
    explanations.push(`Warning: Planetary friction is active. The clashing frequency can introduce auric noise or slow down the clearance of karmic transits.`);
  } else if (isDriverFriendly && isConductorFriendly) {
    explanations.push(`Auspicious Double-Resonance: The mobile root number harmonizes with both core birthday coordinates, forming a strong protective shield (Yantra).`);
  }

  return {
    score,
    rating,
    driverRel,
    conductorRel,
    verdict,
    explanations
  };
}
