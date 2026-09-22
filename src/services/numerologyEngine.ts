import { DOBAnalysis, NameAnalysis, MobileAnalysis, CompatibilityReport, remediesAdvice } from '../types';
import { PAIR_MEANINGS } from './pairMeanings';
import { parseIndianDate } from '../utils/dateUtils';

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
  const parsed = parseIndianDate(dobStr);
  const parts = dobStr.split('-');
  const year = parsed ? parsed.year : (parseInt(parts[0], 10) || 1990);
  const month = parsed ? parsed.month : (parseInt(parts[1], 10) || 1);
  const day = parsed ? parsed.day : (parseInt(parts[2], 10) || 1);

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
      1: 'सूर्य ऊर्जा: उच्च नेतृत्व क्षमता, आत्मविश्वास और संप्रभुता के साथ नए प्रोजेक्ट्स की शुरुआत करते हैं।',
      2: 'चंद्र ऊर्जा: रचनात्मक शुरुआत, लेकिन कार्य में मूड और भावनात्मक ऊर्जा का गहरा प्रभाव रहता है।',
      3: 'गुरु ऊर्जा: ज्ञान, सलाह और सुविचारित दीर्घकालिक योजनाओं के साथ कार्य आरंभ करते हैं।',
      4: 'राहु ऊर्जा: अचानक और अप्रत्याशित तेजी के साथ शुरुआत, हालांकि प्रारंभिक विलंब संभव है।',
      5: 'बुध ऊर्जा: व्यापारिक गणना, त्वरित नेटवर्किंग और स्पष्ट कम्युनिकेशन द्वारा संचालित।',
      6: 'शुक्र ऊर्जा: सुख-सुविधा, कलात्मक सौंदर्य और सौहार्दपूर्ण दृष्टिकोण से प्रोजेक्ट्स शुरू करते हैं।',
      7: 'केतु ऊर्जा: गहरा और आध्यात्मिक नजरिया, लेकिन अत्यधिक संशय व विश्लेषण की संभावना।',
      8: 'शनि ऊर्जा: अनुशासित, कड़ी मेहनत, धैर्य और धीमी किंतु मजबूत प्रगति के साथ शुरुआत।',
      9: 'मंगल ऊर्जा: प्रत्यक्ष, साहसी, तीव्र और तुरंत एक्शन लेने की स्वाभाविक प्रवृत्ति।'
    },
    2: {
      1: 'त्वरित, अधिकारपूर्ण और स्वतंत्र निर्णय लेने की शैली।',
      2: 'भावुक और चंचल निर्णय, जो बाहरी माहौल से जल्दी प्रभावित होते हैं।',
      3: 'दीर्घकालिक ज्ञान, विद्वता और अनुभवी सलाह को प्राथमिकता देने वाले निर्णय।',
      4: 'अनपेक्षित, अप्रत्याशित या कभी-कभी भ्रम की स्थिति में लिए गए निर्णय।',
      5: 'व्यापार-उन्मुख, तार्किक और रणनीतिक गणनाओं पर आधारित निर्णय।',
      6: 'पारिवारिक सुख, सौंदर्य और भौतिक संतुष्टि को महत्व देने वाले निर्णय।',
      7: 'गहन विश्लेषणात्मक, लेकिन ओवरथिंकिंग के कारण निर्णय में देरी।',
      8: 'अत्यंत सतर्क, कानूनी नियमों का पालन करने वाले और धैर्यवान निर्णय।',
      9: 'साहसी, ऊर्जावान और तुरंत क्रियान्वयन को प्राथमिकता देने वाले निर्णय।'
    },
    3: {
      1: 'सूर्य: मजबूत रोग प्रतिरोधक क्षमता; सिरदर्द, आंखों या गर्मी से जुड़े विकार संभव।',
      2: 'चंद्र: संवेदनशील स्वास्थ्य; जल संतुलन, कफ और भावनात्मक चिंता (anxiety) का ध्यान रखें।',
      3: 'गुरु: उत्तम शारीरिक ऊर्जा, मजबूत इम्युनिटी; खानपान में संतुलन आवश्यक।',
      4: 'राहु: अचानक सिरदर्द, अज्ञात स्वास्थ्य समस्याएं या अत्यधिक तनाव से सावधानी।',
      5: 'बुध: बेहतरीन तंत्रिका-मानसिक तालमेल, लेकिन कभी-कभी सुस्ती की संभावना।',
      6: 'शुक्र: त्वचा की संवेदनशीलता, मीठा खाने की आदत या गले से जुड़ी समस्याएं।',
      7: 'केतु: अत्यधिक विचारों के कारण अनिद्रा या मानसिक थकान की प्रवृत्ति।',
      8: 'शनि: जोड़ों के दर्द या धीमी शारीरिक रिकवरी का जोखिम; नियमित योग लाभकारी।',
      9: 'मंगल: उच्च शारीरिक ऊर्जा; चोट, सर्जरी या रक्त से संबंधित विकारों से सावधान रहें।'
    }
  };

  const positionsAudit = posHeadings.map((heading, idx) => {
    const posNum = idx + 1;
    const digit = parseInt(modifiedNumber[idx] || '5', 10);
    const descGroup = posDescriptions[posNum];
    const description = (descGroup && descGroup[digit]) || `इस स्थान पर अंक ${digit} संतुलित ऊर्जा प्रदान करता है, जो ${heading} को सीधा सहयोग देती है।`;
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
    1: 'अहंकार, आत्म-केंद्रित व्यवहार और रिश्तों में तालमेल की कमी का जोखिम।',
    2: 'मूड स्विंग्स, निरंतर चिंता (anxiety) और अत्यधिक भावुकता।',
    3: 'वजन बढ़ने का जोखिम, बड़ों व गुरुजनों की सलाह की अनदेखी और अति-भाषण।',
    4: 'अचानक सिरदर्द, मानसिक भ्रम और जीवन में अप्रत्याशित संघर्ष।',
    5: 'मानसिक अस्थिरता, आर्थिक नुकसान का जोखिम और लेन-देन में सतर्कता की आवश्यकता।',
    6: 'रिश्तों में उलझनें, सामाजिक बदनामी का जोखिम और स्वास्थ्य संबंधी चिंताएं।',
    7: 'अत्यधिक सोचना (Overthinking), साझेदारी में गलतफहमी और विश्वास की कमी।',
    8: 'कार्यों में रुकावटें, कानूनी विवाद, करियर में विलंब और संपत्ति के मामलों में बाधाएं।',
    9: 'गुस्सैल स्वभाव, वाणी में तल्खी और चोट या सर्जरी का जोखिम।'
  };

  const repeatingAlarms: { digit: number; count: number; meaning: string }[] = [];
  Object.keys(counts).forEach(k => {
    const digit = parseInt(k, 10);
    const count = counts[digit];
    if (count >= 3 && digit !== 0) {
      repeatingAlarms.push({
        digit,
        count,
        meaning: alarmDescriptions[digit] || 'अंकों की अधिक पुनरावृत्ति से ऊर्जा में हल्का असंतुलन संभव।'
      });
    }
  });

  // Hostile missing middle number relationships (Vedic Grid rules)
  const digitSet = new Set(digits.split('').map(d => parseInt(d, 10)));
  const hostileMap = [
    { numA: 4, numB: 2, missing: 8, title: 'Moon & Rahu (8 Missing)', meaning: 'अचानक दुर्घटनाओं का जोखिम, परिवार में वैचारिक मतभेद और गलत संगति का प्रभाव।' },
    { numA: 3, numB: 9, missing: 1, title: 'Jupiter & Mars (1 Missing)', meaning: 'कड़ी मेहनत के बावजूद अपेक्षाकृत कम लाभ; प्रयासों की तुलना में परिणाम धीमे।' },
    { numA: 4, numB: 9, missing: 5, title: 'Mars & Rahu (5 Missing)', meaning: 'जोखिम भरे कार्यों की ओर आकर्षण, सर्जरी का योग लेकिन सुरक्षा व पुलिस सेवाओं के लिए अनुकूल।' },
    { numA: 1, numB: 8, missing: 7, title: 'Sun & Saturn (7 Missing)', meaning: 'सरकारी कार्यों में रुकावट, पिता या वरिष्ठ अधिकारियों से मतभेद, अधीनस्थों का साथ न मिलना।' },
    { numA: 3, numB: 2, missing: 6, title: 'Jupiter & Moon (6 Missing)', meaning: 'उच्च शिक्षा में रुकावटें और ज्ञान अर्जन में समय-समय पर विलंब।' },
    { numA: 6, numB: 5, missing: 7, title: 'Venus & Mercury (7 Missing)', meaning: 'शिक्षा में अवरोध, प्रेम संबंधों में चुनौतियां और धन का अटक जाना।' }
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
    relationship = 'अत्यंत सामंजस्यपूर्ण और अनुकूल तालमेल। दोनों की ऊर्जाएं एक-दूसरे को सहज रूप से सहारा देती हैं।';
    marriage = 'उत्कृष्ट वैवाहिक योग। गहरा भावनात्मक व आत्मिक जुड़ाव बना रहता है।';
    friendship = 'अत्यंत वफादार, दीर्घकालिक और एक-दूसरे को आगे बढ़ाने वाली साझेदारी।';
    business = 'शुभ और भाग्यशाली संयोजन। संयुक्त वित्तीय और व्यापारिक रणनीतियों में सहज सफलता।';
    longTermPotential = 'स्थायी सामंजस्य। जीवन के उतार-चढ़ाव में भी आपसी विश्वास अटूट रहता है।';
  } else if (baseScore >= 70) {
    relationship = 'संतोषजनक तालमेल। कभी-कभार छोटे-मोटे समझौते करने होंगे, जो रिश्ते को मजबूत बनाएंगे।';
    marriage = 'मजबूत पारिवारिक नींव और संतुलित ग्रह प्रभाव का सुंदर योग।';
    friendship = 'सच्ची और मददगार मित्रता। संकट के समय एक-दूसरे के काम आते हैं।';
    business = 'स्थिर साझेदारी। जिम्मेदारियों और कार्यक्षेत्र का स्पष्ट विभाजन आवश्यक है।';
    longTermPotential = 'उत्कृष्ट दीर्घकालिक संभावनाएं, बशर्ते अहंकार के टकराव से बचा जाए।';
  } else {
     relationship = 'सामान्य तालमेल। दोनों की कुंडलियों में कुछ प्रमुख ऊर्जा भिन्नताएं हैं।';
     marriage = 'आपसी समझ और धैर्य की आवश्यकता। ग्रहों के संतुलन हेतु उपाय लाभकारी रहेंगे।';
     friendship = 'सामान्य मित्रता। भावनात्मक मतभेदों के समय संयम बनाए रखें।';
     business = 'स्पष्ट कानूनी व लिखित समझौतों के साथ ही कार्य करें; गलतफहमी से बचें।';
     longTermPotential = 'चुनौतीपूर्ण। नियमित ध्यान और अनुकूल मंत्र जाप से शांति बनी रहेगी।';
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
    1: 'नाम की स्पेलिंग को 1 या 5 पर लाएं। 8 या 4 के अंत से बचें।',
    2: 'नाम का जोड़ 1, 5 या 3 पर रखें। 9 पर समाप्त होने वाले नाम से बचें।',
    3: 'नाम की स्पेलिंग को 3 या 9 पर संतुलित करें। 6 पर जाने वाले संशोधनों से बचें।',
    4: 'विशेष संशोधन: नाम का कुल योग केवल 5 या 1 पर ही लाएं।',
    5: 'नाम का योग 5 या 6 होना व्यापार वृद्धि के लिए अत्यंत शुभ और फलदायी है।',
    6: 'अति शुभ: नाम का कुल जोड़ 6, 1 या 5 पर रखें। स्वरों का योग 1 के अनुकूल रखें।',
    7: 'नाम की स्पेलिंग को 1, 5 या 6 पर लाएं। 2 के जोड़ से बचें।',
    8: 'नाम संशोधन द्वारा भाग्यांक (Conductor) को 3, 5 या 6 के अनुकूल बनाएं।',
    9: 'नाम संशोधन: कुल योग 9, 3 या 1 पर लाएं। स्वर विषम अंकों पर रखें।'
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
    signatureAdvice: 'हस्ताक्षर (Signature) को 15 डिग्री के कोण पर ऊपर की ओर शुरू करें। हस्ताक्षर के नीचे कभी भी डॉट (बिंदु) न लगाएं; नीचे सीधी रेखा खींचें जो स्थिर महत्वाकांक्षा को दर्शाती है।',
    luckyDates: [1, 5, 9, 14, 19, 23, 27],
    luckyDays: ['सोमवार (Monday)', 'बुधवार (Wednesday)', 'रविवार (Sunday)']
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

  let rating = 'तटस्थ (Neutral)';
  let verdict = '';
  if (score >= 85) {
    rating = 'अति अनुकूल एवं शुभ (Highly Auspicious) 🌟';
    verdict = `आपका मोबाइल कुल योग ${mobileReduced} आपके मूलांक (Driver) #${driver} और भाग्यांक (Conductor) #${conductor} के साथ अद्भुत ग्रह तालमेल बनाता है। यह वित्तीय अड़चनों को दूर कर भौतिक समृद्धि को आकर्षित करता है।`;
  } else if (score >= 70) {
    rating = 'अनुकूल एवं फलदायी (Favorable) 👍';
    verdict = `मोबाइल कुल योग ${mobileReduced} आपकी जन्मतिथि के साथ संतुलित ऊर्जा साझा करता है। यह व्यापार और दैनिक संवाद के लिए एक विश्वसनीय माध्यम है।`;
  } else if (score >= 50) {
    rating = 'सामान्य (सुधार आवश्यक) ⚖️';
    verdict = `आपका मोबाइल कुल योग ${mobileReduced} तटस्थ या हल्का घर्षणकारी है। स्पेलिंग में सुधार या अंतिम अंकों में सकारात्मक बदलाव से ऊर्जा को अनुकूल बनाया जा सकता है।`;
  } else {
    rating = 'प्रतिकूल / उपाय आवश्यक ⚠️';
    verdict = `ऊर्जा में स्पष्ट प्रतिरोध दिखाई दे रहा है। मोबाइल कुल योग ${mobileReduced} आपके मूलांक #${driver} या भाग्यांक #${conductor} के साथ टकराव पैदा करता है। इससे अनपेक्षित विलंब या संवाद में गलतफहमी हो सकती है। उपाय करना अत्यंत लाभकारी रहेगा।`;
  }

  const explanations: string[] = [];
  explanations.push(`आपका मूलांक (Driver) ${driver} है, जिसकी आपके मोबाइल के मूल अंक ${mobileReduced} के साथ ${driverRel === 'Friendly' ? 'मित्रवत' : driverRel === 'Enemy / Hostile' ? 'शत्रुतापूर्ण' : 'तटस्थ'} ऊर्जा है।`);
  explanations.push(`आपका भाग्यांक (Conductor) ${conductor} है, जिसका मोबाइल कुल योग के साथ ${conductorRel === 'Friendly' ? 'मित्रवत' : conductorRel === 'Enemy / Hostile' ? 'शत्रुतापूर्ण' : 'तटस्थ'} संबंध है।`);

  if (isDriverEnemy || isConductorEnemy) {
    explanations.push(`सावधानी: ग्रहों के बीच ऊर्जा टकराव सक्रिय है। यह असंतुलन कार्यों में रुकावट या मानसिक तनाव उत्पन्न कर सकता है।`);
  } else if (isDriverFriendly && isConductorFriendly) {
    explanations.push(`शुभ दोहरा तालमेल: मोबाइल का मूल अंक जन्मतिथि के दोनों प्रमुख अंकों (मूलांक व भाग्यांक) के साथ पूर्ण सामंजस्य में है, जो एक रक्षात्मक सुरक्षा चक्र बनाता है।`);
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
