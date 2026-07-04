import { reduceToSingleDigit } from './numerologyEngine';
import { LEOFAMILY_PLANES } from '../core/planeDefinitions';

export function calculateLoShuGrid(dob: string) {
  // Extract digits from the date. We parse DD-MM-YYYY or YYYY-MM-DD
  const parts = dob.split(/[-/.\s]+/);
  let year = 1990;
  let month = 1;
  let day = 1;

  if (parts.length >= 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else if (parts[2].length === 4) {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } else {
      year = parseInt(parts[0], 10) || 1990;
      month = parseInt(parts[1], 10) || 1;
      day = parseInt(parts[2], 10) || 1;
    }
  } else {
    const digitsOnly = dob.replace(/[^0-9]/g, '');
    if (digitsOnly.length === 8) {
      const first4 = parseInt(digitsOnly.slice(0, 4), 10);
      const last4 = parseInt(digitsOnly.slice(4), 10);
      if (first4 >= 1800 && first4 <= 2100) {
        year = first4;
        month = parseInt(digitsOnly.slice(4, 6), 10);
        day = parseInt(digitsOnly.slice(6, 8), 10);
      } else if (last4 >= 1800 && last4 <= 2100) {
        day = parseInt(digitsOnly.slice(0, 2), 10);
        month = parseInt(digitsOnly.slice(2, 4), 10);
        year = last4;
      }
    }
  }

  // Format exactly as YYYYMMDD to extract digits
  const yStr = year.toString().padStart(4, '0');
  const mStr = month.toString().padStart(2, '0');
  const dStr = day.toString().padStart(2, '0');
  const yyyymmdd = `${yStr}${mStr}${dStr}`;

  // Extract digits from YYYYMMDD
  const digits = yyyymmdd.split('').map(d => parseInt(d, 10));

  // Filter out zeros
  const nonZeroDigits = digits.filter(d => d !== 0);

  // Unique set of DOB digits
  const uniqueDigits = Array.from(new Set(nonZeroDigits));

  // Calculate Conductor (Bhagyank) from YYYYMMDD digits sum
  let sum = digits.reduce((acc, val) => acc + val, 0);
  while (sum > 9) {
    sum = sum.toString().split('').map(d => parseInt(d, 10)).reduce((acc, val) => acc + val, 0);
  }
  const conductor = sum;

  // Include Conductor (Bhagyank) in the unique set of digits, but ensure other derived numbers are excluded
  if (conductor >= 1 && conductor <= 9) {
    if (!uniqueDigits.includes(conductor)) {
      uniqueDigits.push(conductor);
    }
  }

  // Sort present digits
  uniqueDigits.sort((a, b) => a - b);

  // Missing digits from 1 to 9
  const missingDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !uniqueDigits.includes(d));

  return {
    present: uniqueDigits,
    missing: missingDigits,
    conductor,
    yyyymmdd
  };
}

export interface LoshuGridBox {
  digit: number;
  representedDigit: number; // e.g. 4, 9, 2, etc.
  count: number;
  sources: ('DOB' | 'MULANK' | 'BHAGYANK')[];
  meaning: string;
  element: string;
  direction: string;
  lifeArea: string;
  isDriverReinforced?: boolean;
  isDriverLayer?: boolean;
  isDestinyReinforced?: boolean;
  isDestinyLayer?: boolean;
  dobCount?: number;
}

export interface LoshuPlane {
  name: string;
  type: 'HORIZONTAL' | 'VERTICAL' | 'DIAGONAL';
  digits: number[];
  presentDigits: number[];
  status: 'FULL' | 'PARTIAL' | 'EMPTY';
  strengthScore: number; // 0, 33, 66, 100
  title: string;
  description: string;
  remedy?: string;
}

export interface DashaPeriod {
  planet: string;
  rulerNumber: number;
  durationYears: number;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  meaning: string;
  isCurrent: boolean;
  antardashas: AntardashaPeriod[];
}

export interface AntardashaPeriod {
  rulerNumber: number;
  planet: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  meaning: string;
  isCurrent: boolean;
}

export interface LoshuAnalysisResult {
  personalDetails: {
    name: string;
    dob: string;
    gender: string;
  };
  mulank: number; // Psychic
  bhagyank: number; // Conductor (Bhagyank)
  loshuGrid: Record<number, LoshuGridBox>;
  missingNumbers: {
    digit: number;
    element: string;
    meaning: string;
    remedy: string;
  }[];
  repeatedNumbers: {
    digit: number;
    count: number;
    meaning: string;
  }[];
  strengthArrows: LoshuPlane[];
  weaknessArrows: LoshuPlane[];
  personalYear: {
    number: number;
    title: string;
    description: string;
    forecast: string;
  };
  pinnacles: {
    pinnacle: number;
    cycle: number;
    ageRange: string;
    meaning: string;
  }[];
  challenges: {
    challenge: number;
    cycle: number;
    meaning: string;
  }[];
  mahadashas: DashaPeriod[];
  currentMahadasha: DashaPeriod | null;
  currentAntardasha: AntardashaPeriod | null;
  luckyDetails: {
    numbers: number[];
    colors: string[];
    gemstones: string[];
    remedies: string[];
  };
  chaldeanMulank?: {
    compound: number;
    reduced: number;
    title: string;
    ruler: string;
    description: string;
  };
  chaldeanBhagyank?: {
    compound: number;
    reduced: number;
    title: string;
    ruler: string;
    description: string;
  };
  rawJSON: string;
}

// Elemental properties
const ELEMENT_MAP: Record<number, { element: string; direction: string; lifeArea: string; gridMeaning: string }> = {
  1: { element: 'Water', direction: 'North', lifeArea: 'Career & Conductor Path', gridMeaning: 'Communication & Planning' },
  2: { element: 'Earth', direction: 'Southwest', lifeArea: 'Marriage, Love & Partnerships', gridMeaning: 'Relationships & Sensitivity' },
  3: { element: 'Wood', direction: 'East', lifeArea: 'Family & Health', gridMeaning: 'Growth & Wisdom' },
  4: { element: 'Wood', direction: 'Southeast', lifeArea: 'Wealth & Prosperity', gridMeaning: 'Discipline & Organization' },
  5: { element: 'Earth', direction: 'Center', lifeArea: 'Stability & Balance', gridMeaning: 'Mental Stability & Communication' },
  6: { element: 'Metal', direction: 'Northwest', lifeArea: 'Helpful Friends & Travel', gridMeaning: 'Luxury & Support' },
  7: { element: 'Metal', direction: 'West', lifeArea: 'Children & Creativity', gridMeaning: 'Analytical Power & Intellect' },
  8: { element: 'Earth', direction: 'Northeast', lifeArea: 'Education & Knowledge', gridMeaning: 'Material Wealth & Asset Accumulation' },
  9: { element: 'Fire', direction: 'South', lifeArea: 'Fame & Reputation', gridMeaning: 'Enthusiasm & Courage' }
};

// Plane definitions
const PLANE_TEMPLATES = LEOFAMILY_PLANES.map(p => ({
  name: p.name,
  type: p.type as 'HORIZONTAL' | 'VERTICAL' | 'DIAGONAL',
  digits: p.coordinates,
  title: p.title,
  description: p.meaning
}));

interface ChaldeanCompound {
  title: string;
  ruler: string;
  description: string;
}

const CHALDEAN_COMPOUNDS: Record<number, ChaldeanCompound> = {
  1: { title: "सूर्य शक्ति (The Solar Core)", ruler: "Sun (सूर्य)", description: "Creative willpower, highly independent leadership, and raw drive." },
  2: { title: "चन्द्र आभा (The Lunar Balance)", ruler: "Moon (चन्द्र)", description: "Harmony, emotional depth, sensitivity, and cooperative design." },
  3: { title: "गुरु बल (The Jovian Scepter)", ruler: "Jupiter (गुरु)", description: "Spiritual mastery, natural expansion, wisdom, and strict order." },
  4: { title: "उग्र चक्र (The Uranian Axis)", ruler: "Rahu (राहू)", description: "Rebellious structural designs, dynamic shifts, and sudden ideas." },
  5: { title: "बुध चेतना (The Mercurial Fire)", ruler: "Mercury (बुध)", description: "Rapid communications, commercial strategy, and versatile intellect." },
  6: { title: "शुक्र वैभव (The Venusian Halo)", ruler: "Venus (शुक्र)", description: "Luxury, cosmetic or artistic values, high beauty, and attraction." },
  7: { title: "अतीन्द्रिय केतु (The Mystic Anchor)", ruler: "Ketu (केतु)", description: "Inward research, solitary wisdom, high gut-intuition, and analysis." },
  8: { title: "शनि अनुशासन (The Saturnian Pillar)", ruler: "Saturn (शनि)", description: "Karmic tests, extreme physical stamina, and long-term material gains." },
  9: { title: "मंगल शौर्य (The Martial Spear)", ruler: "Mars (मंगल)", description: "Dynamic courage, leadership execute focus, and fiery energy." },
  10: { title: "भाग्य चक्र (The Wheel of Fortune)", ruler: "Sun (सूर्य)", description: "Highly auspicious. Indicates rise in power, honor, and success in trade." },
  11: { title: "संघर्ष (The Clashing Fists)", ruler: "Moon (चन्द्र)", description: "Double-mindedness; warns of hidden competitors and emotional trials." },
  12: { title: "त्याग और ज्ञान (The Sacrifice)", ruler: "Jupiter (गुरु)", description: "Accomplishment through persistent mental development and voluntary sacrifice." },
  13: { title: "परिवर्तन (The Change)", ruler: "Rahu (राहू)", description: "Denotes sudden transitions, change of workspace or plans, and fresh visions." },
  14: { title: "गतिशीलता (The Magnetic Movement)", ruler: "Mercury (बुध)", description: "Highly propitious for trading, investments, and public speech dynamics." },
  15: { title: "आकर्षण (The Alchemist)", ruler: "Venus (शुक्र)", description: "Generates superb charisma, strong support from public, and artistic luck." },
  16: { title: "भंग शिखर (The Falling Citadel)", ruler: "Ketu (केतु)", description: "Warns of sudden changes in pride. Suggests keeping a highly humble outlook to trigger deep spiritual security." },
  17: { title: "जादूगर का तारा (The Star of the Magi)", ruler: "Saturn (शनि)", description: "Excellent financial safety. Indicates rise above early childhood limitations." },
  18: { title: "कलह चक्र (The Bitter Conflict)", ruler: "Mars (मंगल)", description: "Warns of legal disputes, sudden hot arguments, or electric energy shocks." },
  19: { title: "स्वर्ग का राजकुमार (The Prince of Heaven)", ruler: "Sun (सूर्य)", description: "Vantglorious success. Brings high respect, social glory, and abundance." },
  20: { title: "जागृति (The Awakening)", ruler: "Moon (चन्द्र)", description: "Call to professional action. Focuses the mind on spiritual or artistic tasks." },
  21: { title: "मुकुट और विजय (The Crown of the Magi)", ruler: "Jupiter (गुरु)", description: "Guarantees complete target fulfillment and honors after a long trial." },
  22: { title: "भ्रमित यात्री (The Blind Fold)", ruler: "Rahu (राहू)", description: "A warning against blind reliance on false business partners or speculations." },
  23: { title: "सिंह का तारा (The Royal Star on High)", ruler: "Mercury (बुध)", description: "Promises support from authorities and outstanding success in commerce." },
  24: { title: "शुक्र वरदान (The Divine Helper)", ruler: "Venus (शुक्र)", description: "Fosters peaceful domestic relationships, wealthy patrons, and safety." },
  25: { title: "आंतरिक खोज (The Spiritual Meditation)", ruler: "Ketu (केतु)", description: "Auspicious for intellectual fields, analytical research, and metaphysics." },
  26: { title: "कठोर दायित्व (The Lead Collar)", ruler: "Saturn (शनि)", description: "Expect early duties and hard trials; advises caution in heavy partnership deals." },
  27: { title: "राजदण्ड (The Sovereign Scepter)", ruler: "Mars (मंगल)", description: "Grants command, execution powers, and excellent protective shielding." },
  28: { title: "मित्रता और परीक्षा (The Trusting Companion)", ruler: "Sun (सूर्य)", description: "Highlights stable commercial success but advises checking contracts twice." },
  29: { title: "कठिन परीक्षा (The Trial under Fire)", ruler: "Moon (चन्द्र)", description: "Great trials of patience followed by long-term administrative capability." },
  30: { title: "मौन साधक (The Silent Thinker)", ruler: "Jupiter (गुरु)", description: "Exceptional intelligence in writing, academic study, and quiet meditation." },
  31: { title: "एकांत चिंतन (The Solitary Path)", ruler: "Rahu (राहू)", description: "Fosters deep independent mindset; warns against social isolation." },
  32: { title: "सहमति और गठबंधन (The Covenant)", ruler: "Mercury (बुध)", description: "Superb for travel, media, foreign agreements, and community communication." },
  33: { title: "पवित्र गुरु (The Archway of Love)", ruler: "Venus (शुक्र)", description: "Brings outstanding marital comfort, general lucky stars, and spiritual joy." },
  34: { title: "परिश्रम फल (The Silent Forge)", ruler: "Ketu (केतु)", description: "Rewards after initial delays. Denotes strong engineering or analytical skills." },
  35: { title: "हिलता सिंहासन (The Shaking Throne)", ruler: "Moon (चन्द्र)", description: "High financial safety but warns of health fluctuations. Keep stable habits." },
  36: { title: "विजयी योद्धा (The Conquering Soldier)", ruler: "Mars (मंगल)", description: "Grants persistent courage to beat rivals and secure administrative ranks." },
  37: { title: "तेजस्वी राजदण्ड (The Bright Scepter)", ruler: "Sun (सूर्य)", description: "Commanding luck. Fosters rapid business fame and perfect health vibrations." },
  38: { title: "शांत धारा (The Peaceful River)", ruler: "Moon (चन्द्र)", description: "Promotes peaceful joint ventures, emotional healing, and artistic goals." },
  39: { title: "बुद्धिजीवी (The Rational Mind)", ruler: "Jupiter (गुरु)", description: "Exceptional capabilities in debate, legal support, and teaching others." },
  40: { title: "स्वर्ण लंगर (The Golden Anchor)", ruler: "Rahu (राहू)", description: "Brings safe property investments; warns against material greed or speculation." },
  41: { title: "लिखित आदेश (The Written Command)", ruler: "Mercury (बुध)", description: "Excellent for writers, publications, print businesses, and trade contracts." },
  42: { title: "सहानुभूति (The Gentle Guide)", ruler: "Venus (शुक्र)", description: "Grants deep domestic warmth, loyalty from friends, and comfortable lifestyle." },
  43: { title: "सुरक्षा कवच (The Star-lit Shield)", ruler: "Mars (मंगल)", description: "Protects from unexpected physical harms; advises calm, deliberate speaking." },
  44: { title: "मजबूत नींव (The Iron Anvil)", ruler: "Saturn (शनि)", description: "Long-term legacy building through massive willpower and physical stamina." },
  45: { title: "महान मुुकुट (The Celestial Canopy)", ruler: "Jupiter (गुरु)", description: "Generates long-term peace, high moral code, and recognition from elders." },
  46: { title: "चतुर राजनयिक (The Master Diplomat)", ruler: "Sun (सूर्य)", description: "Fosters excellent tactical negotiations and control of public relations." },
  47: { title: "रहस्यमयी दर्शन (The Dream Weaver)", ruler: "Moon (चन्द्र)", description: "Propitious for artistic writing, creative concepts, and maritime exports." },
  48: { title: "अटल कमान (The Steel Pillar)", ruler: "Saturn (शनि)", description: "Indicates huge duties in commercial organizations; unmatched patience." },
  49: { title: "रणनीतिकार (The Supreme General)", ruler: "Mars (मंगल)", description: "Outstanding strategic execution; defeats any legal or operational hurdles." },
  50: { title: "यात्रा और नवाचार (The Voyager)", ruler: "Mercury (बुध)", description: "Gives high luck in foreign traveling, digital businesses, and creative shifts." },
  51: { title: "शाही ध्वज (The Royal Star of Glory)", ruler: "Sun (सूर्य)", description: "Propels the person to peak status or political fame; commands true devotion." },
  52: { title: "संरक्षित मार्ग (The Blessed Highway)", ruler: "Moon (चन्द्र)", description: "High protection from feminine alignment; intuitive and psychic depth." },
  53: { title: "आदेश चक्र (The High Command)", ruler: "Jupiter (गुरु)", description: "Denotes peak administrative capabilities, judicial command, or spiritual guru roles." },
  54: { title: "रण सुरक्षा (The Guardian Spear)", ruler: "Mars (मंगल)", description: "Provides outstanding protection, military bravery, and physical stability." },
  55: { title: "सूर्य मुकुट (The Zenith Solar)", ruler: "Sun (सूर्य)", description: "Superb financial command, authority, and public respect." },
  56: { title: "समन्वय (The Master Harmonizer)", ruler: "Venus (शुक्र)", description: "Denotes beautiful partnerships, social fame, and family harmony." },
  57: { title: "गूढ़ साधक (The Esoteric Whisperer)", ruler: "Ketu (केतु)", description: "Brings strong talent in occult search, deep analysis, and writing secrets." },
  58: { title: "दृढ़ कोट (The Fortress)", ruler: "Saturn (शनि)", description: "Outstanding perseverance; success in minerals, heavy industries, or land development." },
  59: { title: "सक्रिय सेनापति (The Vanguard Commander)", ruler: "Mars (मंगल)", description: "Fosters great physical speed, high reaction focus, and mechanical skills." }
};

export function computeLoshuAnalysis(dobStr: string, name: string, gender: string = 'MALE'): LoshuAnalysisResult {
  const parts = dobStr.split('-');
  const bYear = parseInt(parts[0], 10) || 1990;
  const bMonth = parseInt(parts[1], 10) || 1;
  const bDay = parseInt(parts[2], 10) || 1;

  // Calcul Mulank & Bhagyank
  const mulank = reduceToSingleDigit(bDay);
  const dobDigitsStr = dobStr.replace(/[^0-9]/g, '');
  const chaldeanBhagyankCompound = dobDigitsStr.split('').map(d => parseInt(d, 10)).reduce((acc, v) => acc + v, 0);
  const bhagyank = reduceToSingleDigit(chaldeanBhagyankCompound);

  // Chaldean psychic / destiny calculations
  const chaldeanMulankCompound = bDay;
  const chaldeanMulankReduced = mulank;
  const chaldeanBhagyankReduced = bhagyank;

  const mComp = CHALDEAN_COMPOUNDS[chaldeanMulankCompound] || {
    title: `मूलांक ${chaldeanMulankCompound} कम्पाउंड`,
    ruler: mulank === 1 ? "Sun (सूर्य)" : mulank === 2 ? "Moon (चन्द्र)" : mulank === 3 ? "Jupiter (गुरु)" : mulank === 4 ? "Rahu (राहू)" : mulank === 5 ? "Mercury (बुध)" : mulank === 6 ? "Venus (शुक्र)" : mulank === 7 ? "Ketu (केतु)" : mulank === 8 ? "Saturn (शनि)" : "Mars (मंगल)",
    description: `Highly energetic vibrational focus aligning with ruler frequencies.`
  };

  const bComp = CHALDEAN_COMPOUNDS[chaldeanBhagyankCompound] || {
    title: `भाग्यांक ${chaldeanBhagyankCompound} कम्पाउंड`,
    ruler: chaldeanBhagyankReduced === 1 ? "Sun (सूर्य)" : chaldeanBhagyankReduced === 2 ? "Moon (चन्द्र)" : chaldeanBhagyankReduced === 3 ? "Jupiter (गुरु)" : chaldeanBhagyankReduced === 4 ? "Rahu (राहू)" : chaldeanBhagyankReduced === 5 ? "Mercury (बुध)" : chaldeanBhagyankReduced === 6 ? "Venus (शुक्र)" : chaldeanBhagyankReduced === 7 ? "Ketu (केतु)" : chaldeanBhagyankReduced === 8 ? "Saturn (शनि)" : "Mars (मंगल)",
    description: `Defines critical cosmic pathways supporting overall lifetime missions.`
  };
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const sourcesMap: Record<number, ('DOB' | 'MULANK' | 'BHAGYANK')[]> = {};

  for (let i = 1; i <= 9; i++) {
    sourcesMap[i] = [];
  }

  // Add DOB digits
  for (let i = 0; i < dobDigitsStr.length; i++) {
    const d = parseInt(dobDigitsStr[i], 10);
    if (d >= 1 && d <= 9) {
      counts[d] = (counts[d] || 0) + 1;
      if (!sourcesMap[d].includes('DOB')) {
        sourcesMap[d].push('DOB');
      }
    }
  }

  // Compile Loshu Grid
  const loshuGrid: Record<number, LoshuGridBox> = {};
  for (let d = 1; d <= 9; d++) {
    const dobCount = counts[d] || 0;
    const isBirthLayer = dobCount > 0;
    const isDriver = mulank === d;
    const isDestiny = bhagyank === d;

    let isDriverLayer = false;
    let isDriverReinforced = false;
    if (isDriver) {
      if (isBirthLayer) {
        isDriverReinforced = true;
      } else {
        isDriverLayer = true;
      }
    }

    const existsAfterDriver = isBirthLayer || isDriverLayer;

    let isDestinyLayer = false;
    let isDestinyReinforced = false;
    if (isDestiny) {
      if (existsAfterDriver) {
        isDestinyReinforced = true;
      } else {
        isDestinyLayer = true;
      }
    }

    // Determine final enhanced count
    let enhancedCount = 0;
    if (isBirthLayer) {
      enhancedCount = dobCount;
    } else if (isDriverLayer || isDestinyLayer) {
      enhancedCount = 1;
    }

    const sources: ('DOB' | 'MULANK' | 'BHAGYANK')[] = [];
    if (isBirthLayer) {
      sources.push('DOB');
    }
    if (isDriver) {
      sources.push('MULANK');
    }
    if (isDestiny) {
      sources.push('BHAGYANK');
    }

    loshuGrid[d] = {
      digit: d,
      representedDigit: d,
      count: enhancedCount,
      dobCount: dobCount,
      sources: sources,
      meaning: ELEMENT_MAP[d].gridMeaning,
      element: ELEMENT_MAP[d].element,
      direction: ELEMENT_MAP[d].direction,
      lifeArea: ELEMENT_MAP[d].lifeArea,
      isDriverReinforced,
      isDriverLayer,
      isDestinyReinforced,
      isDestinyLayer
    };
  }

  // Missing Numbers
  const missingNumbers: { digit: number; element: string; meaning: string; remedy: string }[] = [];
  const missingRemedies: Record<number, string> = {
    1: 'Wear red/orange threads, keep small metal artifacts in the North zone, carry silver coins.',
    2: 'Wear natural pearl beads, decorate southwest corners with earthen pots or yellow salt lamps.',
    3: 'Keep a green wooden bracelet, plant leafy tulsi or ficus in the East sector of your room.',
    4: 'Keep wooden wind-chimes or carry a green aventurine crystal. Introduce structural bamboo lines.',
    5: 'Wear a pure copper coin around the chest, keep brass pyramids/discs at workplace.',
    6: 'Wear shiny steel or automatic wristwatches. Place metal ornaments in the Northwest corner.',
    7: 'Introduce steel accessories, light small oil lamps on Saturdays, keep a brass/silver Ganesha statuette.',
    8: 'Wear an amethyst or black tourmaline crystal bracelet. Maintain earthy/clay pottery in Northeast.',
    9: 'Light a red wax candle in the South zone daily for 15 mins. Wear scarlet threads or small rubies.'
  };

  const missingMeanings: Record<number, string> = {
    1: 'Difficulties with career path and clarity. Lacks solid independent expression.',
    2: 'High relationship adjustments, lack of sensitivity, impatient mindset.',
    3: 'Lack of elders blessing. Struggles with consistent wisdom, wisdom or focus.',
    4: 'Erratic savings. High financial vulnerability and lack of systemic discipline.',
    5: 'Lacks personal stabilizing center. Struggles with core communication and decision loops.',
    6: 'Lacks helper agents or corporate friends. Difficulties getting support in crucial hours.',
    7: 'Lack of patience and deep analytical focus. Prone to immediate disappointments.',
    8: 'Slower asset accumulation. Struggles planning long term real estate expansions.',
    9: 'Faint fame. Struggling with recognition and low driving courage.'
  };

  for (let d = 1; d <= 9; d++) {
    if (loshuGrid[d].count === 0) {
      missingNumbers.push({
        digit: d,
        element: ELEMENT_MAP[d].element,
        meaning: missingMeanings[d],
        remedy: missingRemedies[d]
      });
    }
  }

  // Repeated Numbers
  const repeatedNumbers: { digit: number; count: number; meaning: string }[] = [];
  const repeatedMeanings: Record<number, Record<number, string>> = {
    1: {
      1: 'Indicates good independent voice but difficulty speaking out deep personal concerns.',
      2: 'Auspicous! Diplomatic, highly balanced, outstanding expression, great communication.',
      3: 'Vocal, expressive but extremely talkative. Prone to speak out secrets.',
      4: 'Highly egocentric voice. Extremely stubborn and hard to align in compromise.'
    },
    2: {
      1: 'Sensitive, cooperative, intuitive.',
      2: 'Over-intuitive but highly subject to sudden mood escalations and anxiety.',
      3: 'Hypersensitive. Prone to taking everything too personally, fragile heart.',
      4: 'Subject to continuous mood slides, anxiety loops, unstable relationship patterns.'
    },
    3: {
      1: 'Good academic sense, creative, respectable behavior.',
      2: 'Superlative intelligence, highly creative planer, deep researching mind.',
      3: 'Overly academic, disconnected from simple practical reality, over-talker.',
      4: 'Vain, rejects expert consultation or advice, faces frequent blocks.'
    },
    4: {
      1: 'Thoroughly practical, neat, highly systematic.',
      2: 'Obsessively meticulous, gets lost in microscopic details, hard to satisfy.',
      3: 'Extreme workaholic, lacks social joy or leisure interests.',
      4: 'High stubbornness, OCD traits, suffers sudden legal/authority friction.'
    },
    5: {
      1: 'Self-driven, business minded, excellent communication.',
      2: 'Immense confidence, quick mathematical decisions, loves trading structures.',
      3: 'Extravagant spender, severe risk attractor, highly unstable home routine.',
      4: 'Erratic cash flows, loses money in speculative bubbles, high nervous fatigue.'
    },
    6: {
      1: 'Caring teacher, loves artistic decors, close family connection.',
      2: 'Luxurious expectations, creative design skills, protective family values.',
      3: 'Entangled in domestic debts or luxury expenditures. High relatives stress.',
      4: 'Prone to luxury excesses, marital alignments delays, family separations.'
    },
    7: {
      1: 'Philosophical, gains massive depth via experience, intuitive.',
      2: 'Prone to frequent betrayals from close associates, analytical mind.',
      3: 'Underwent massive emotional setbacks in career/marriage, leading to ascetic turns.',
      4: 'Deeply self-isolated. Absolute solitary thinker, distrusts world.'
    },
    8: {
      1: 'Practical, meticulous, financial intelligence, gradual gains.',
      2: 'Dual Saturn force: deep planning but slow asset realization. Heavy responsibilities.',
      3: 'Massive, sudden volatility in fortunes. Alternate wealth blocks.',
      4: 'Severely laborious path, legal cases, delayed rewards but final profound wisdom.'
    },
    9: {
      1: 'Selfless, courageous, high energetic drive.',
      2: 'Aggressive competitor, highly energetic, quick verbal reactions.',
      3: 'Hyper-vocal temper outbreaks, surgery risks, sharp bone injuries.',
      4: 'Impulsive actions, disputes with authorities, extreme inner volatility.'
    }
  };

  for (let d = 1; d <= 9; d++) {
    const cnt = loshuGrid[d].count;
    if (cnt > 0) {
      const clampedCount = Math.min(cnt, 4);
      repeatedNumbers.push({
        digit: d,
        count: cnt,
        meaning: repeatedMeanings[d][clampedCount] || 'Excess representation triggers mild vibrational hurdles.'
      });
    }
  }

  // Compute Planes / Arrows
  const strengthArrows: LoshuPlane[] = [];
  const weaknessArrows: LoshuPlane[] = [];

  PLANE_TEMPLATES.forEach(p => {
    const present = p.digits.filter(d => loshuGrid[d].count > 0);
    const presentCount = present.length;
    let status: 'FULL' | 'PARTIAL' | 'EMPTY' = 'PARTIAL';
    let strengthScore = 0;

    if (presentCount === 3) {
      status = 'FULL';
      strengthScore = 100;
    } else if (presentCount === 0) {
      status = 'EMPTY';
      strengthScore = 0;
    } else {
      status = 'PARTIAL';
      strengthScore = Math.round((presentCount / 3) * 100);
    }

    const planeObj: LoshuPlane = {
      name: p.name,
      type: p.type,
      digits: p.digits,
      presentDigits: present,
      status,
      strengthScore,
      title: p.title,
      description: p.description
    };

    if (status === 'FULL') {
      strengthArrows.push(planeObj);
    } else if (status === 'EMPTY') {
      planeObj.remedy = p.digits.map(d => `${d}: ${missingRemedies[d]}`).join(' | ');
      weaknessArrows.push(planeObj);
    }
  });

  // Personal Year
  const currentYear = 2026;
  const pYearNum = reduceToSingleDigit(reduceToSingleDigit(bDay) + reduceToSingleDigit(bMonth) + reduceToSingleDigit(currentYear));
  const personalYearTitles: Record<number, string> = {
    1: 'New Beginnings & Leadership Initiatives (वर्ष 1: नव निर्माण)',
    2: 'Patience, Partnerships & Balance (वर्ष 2: धैर्य एवं सहकार्यता)',
    3: 'Expansion, Expressions & Knowledge (वर्ष 3: ज्ञान एवं विस्तार)',
    4: 'Foundation, Work & Organization (वर्ष 4: कठिन परिश्रम एवं नियम)',
    5: 'Dynamic Change, Freedom & Public Relation (वर्ष 5: परिवर्तन एवं संचार)',
    6: 'Domestic Peace, Luxury & Health (वर्ष 6: परिवार एवं सुख समृद्धि)',
    7: 'Self Reflection, Spiritual Study & Solitude (वर्ष 7: अध्यात्म एवं चिंतन)',
    8: 'Material Abundance, Business Growth & Assets (वर्ष 8: कर्म फल एवं विजय)',
    9: 'Completion, Detoxification & Philanthropy (वर्ष 9: विसर्जन एवं नया मार्ग)'
  };
  const personalYearForecasts: Record<number, string> = {
    1: 'The perfect time to plant seeds. Launch new business endeavors, switch roles, or declare independent tracks. High support from Sun solar cycles.',
    2: 'A year of slow water-like flow. Deepen partnerships, avoid sudden friction. Excellent for team bonding, marriage considerations, and mediation.',
    3: 'Jupiter-backed mental blooming. Enroll in certification programs, write materials, or advisor programs. Social expressions expand swiftly.',
    4: 'Solid ground creation. Work hours increase, delayed outcomes test patience. Focus on brick and mortar security, systemic audits, or gold savings.',
    5: 'A fast progressive breeze. Expect multi-city travels, public speeches, and quick financial agreements. Keep your grounding active.',
    6: 'Sovereign luxury, domestic happiness, purchase of elegant cars, or home renovation. Relationships get heavy investment and mature gracefully.',
    7: 'Ketu reigns. Lessen commercial noise, engage in yoga, meditation, occult science research. Avoid launching mega speculative ventures.',
    8: 'Saturn harvest year. Long pending files clear up, outstanding balances materialize, real estate is acquired. Deliver justice in relationships.',
    9: 'Wash away old unnecessary structures. Finish lagging cases, declutter your home. Do not start giant 10-year lock plans, let cycle clear.'
  };

  // Pinnacle Cycles
  const pin1 = reduceToSingleDigit(reduceToSingleDigit(bDay) + reduceToSingleDigit(bMonth));
  const pin2 = reduceToSingleDigit(reduceToSingleDigit(bDay) + reduceToSingleDigit(bYear));
  const pin3 = reduceToSingleDigit(pin1 + pin2);
  const pin4 = reduceToSingleDigit(reduceToSingleDigit(bMonth) + reduceToSingleDigit(bYear));
  const pinnacleMeanings = [
    'Youth development, seeking individual path and learning structures.',
    'Expansion of career, building families, stabilizing social profile.',
    'Harvest of mature actions, advisor roles, financial authority peak.',
    'Eldership, mentoring family circles, spiritual deep dive, legacy works.'
  ];

  const pinnaclesList = [
    { pinnacle: pin1, cycle: 1, ageRange: `0 to ${36 - bhagyank} Years`, meaning: pinnacleMeanings[0] },
    { pinnacle: pin2, cycle: 2, ageRange: `${36 - bhagyank + 1} to ${36 - bhagyank + 9} Years`, meaning: pinnacleMeanings[1] },
    { pinnacle: pin3, cycle: 3, ageRange: `${36 - bhagyank + 10} to ${36 - bhagyank + 18} Years`, meaning: pinnacleMeanings[2] },
    { pinnacle: pin4, cycle: 4, ageRange: `After ${36 - bhagyank + 19} Years`, meaning: pinnacleMeanings[3] }
  ];

  // Challenge Numbers
  const ch1 = Math.abs(reduceToSingleDigit(bDay) - reduceToSingleDigit(bMonth));
  const ch2 = Math.abs(reduceToSingleDigit(bDay) - reduceToSingleDigit(bYear));
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(reduceToSingleDigit(bMonth) - reduceToSingleDigit(bYear));
  const challengeMeanings = [
    'Avoiding excessive emotional fluctuation, learning stable planning.',
    'Establishing independent authority, avoiding subservience traps.',
    'Balancing extreme patience against frustration during delayed intervals.',
    'Managing wealth allocations with utmost caution against speculation.'
  ];

  const challengesList = [
    { challenge: ch1, cycle: 1, meaning: challengeMeanings[0] },
    { challenge: ch2, cycle: 2, meaning: challengeMeanings[1] },
    { challenge: ch3, cycle: 3, meaning: challengeMeanings[2] },
    { challenge: ch4, cycle: 4, meaning: challengeMeanings[3] }
  ];

  // Mahadashas & Antardashas Sequence
  const planetRulers: Record<number, { name: string; dashaLength: number; element: string }> = {
    1: { name: 'Sun (सूर्य)', dashaLength: 6, element: 'Fire' },
    2: { name: 'Moon (चंद्र)', dashaLength: 10, element: 'Water' },
    3: { name: 'Jupiter (गुरु)', dashaLength: 16, element: 'Wood' },
    4: { name: 'Rahu (राहू)', dashaLength: 18, element: 'Shadow Earth' },
    5: { name: 'Mercury (बुध)', dashaLength: 17, element: 'Wood' },
    6: { name: 'Venus (शुक्र)', dashaLength: 20, element: 'Metal' },
    7: { name: 'Ketu (केतु)', dashaLength: 7, element: 'Shadow Metal' },
    8: { name: 'Saturn (शनि)', dashaLength: 19, element: 'Earth' },
    9: { name: 'Mars (मंगल)', dashaLength: 9, element: 'Fire' }
  };

  const mahadashas: DashaPeriod[] = [];
  let currentStartAge = 0;
  let currentStartYear = bYear;

  // Start with Mulank's planet
  let activeRuler = mulank >= 1 && mulank <= 9 ? mulank : 1;

  // Let's compute a 100-year mahadasha lifespan timeline
  for (let cycle = 1; cycle <= 10; cycle++) {
    const template = planetRulers[activeRuler];
    const duration = template.dashaLength;
    const endAge = currentStartAge + duration;
    const endYear = currentStartYear + duration;

    // Generate Antardashas for this Mahadasha
    const antardashas: AntardashaPeriod[] = [];
    let antardashaRuler = activeRuler;
    let runningMonths = 0;
    const totalDashaMonths = duration * 12;

    for (let sub = 1; sub <= 9; sub++) {
      const subTemplate = planetRulers[antardashaRuler];
      // Antardasha duration in months proportional to Vimshottari ratios: (MahadashaLength * SubDashaLength)/120 * 12
      const durationMonths = Math.max(1, Math.round(((duration * subTemplate.dashaLength) / 120) * 12));
      
      const subStartMonthOffset = runningMonths;
      const subEndMonthOffset = runningMonths + durationMonths;

      // Antardasha years/months dates bounds
      const subStartYear = currentStartYear + Math.floor(subStartMonthOffset / 12);
      const subStartMonth = (bMonth + (subStartMonthOffset % 12)) % 12 || 12;
      const subEndYear = currentStartYear + Math.floor(subEndMonthOffset / 12);
      const subEndMonth = (bMonth + (subEndMonthOffset % 12)) % 12 || 12;

      antardashas.push({
        rulerNumber: antardashaRuler,
        planet: subTemplate.name,
        durationMonths,
        startDate: `${subStartYear}-${subStartMonth.toString().padStart(2, '0')}-01`,
        endDate: `${subEndYear}-${subEndMonth.toString().padStart(2, '0')}-01`,
        meaning: `Deep micro-influence of ${subTemplate.name} focusing the mind towards ${ELEMENT_MAP[antardashaRuler]?.lifeArea.toLowerCase() || 'general goals'}.`,
        isCurrent: false
      });

      runningMonths += durationMonths;
      // move to next ruler
      antardashaRuler = antardashaRuler + 1 > 9 ? 1 : antardashaRuler + 1;
    }

    mahadashas.push({
      planet: template.name,
      rulerNumber: activeRuler,
      durationYears: duration,
      startAge: currentStartAge,
      endAge,
      startYear: currentStartYear,
      endYear,
      meaning: `Major life focus governed by the sovereign energy of ${template.name}, manifesting in key transitions related to ${ELEMENT_MAP[activeRuler]?.lifeArea}.`,
      isCurrent: false,
      antardashas
    });

    currentStartAge = endAge;
    currentStartYear = endYear;

    // move to next ruler
    activeRuler = activeRuler + 1 > 9 ? 1 : activeRuler + 1;
    if (endAge > 105) break;
  }

  // Find currently running Mahadasha based on year 2026 or real current calendar year
  const activeYear = new Date().getFullYear(); // 2026 inside this environment
  let currentMahadasha: DashaPeriod | null = null;
  let currentAntardasha: AntardashaPeriod | null = null;

  mahadashas.forEach(m => {
    if (activeYear >= m.startYear && activeYear <= m.endYear) {
      m.isCurrent = true;
      currentMahadasha = m;
      
      // Look for active sub-period
      const currentMonth = new Date().getMonth() + 1;
      const formattedCurrentDate = `${activeYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      
      m.antardashas.forEach(a => {
        if (formattedCurrentDate >= a.startDate && formattedCurrentDate <= a.endDate) {
          a.isCurrent = true;
          currentAntardasha = a;
        }
      });

      // fallback to first if not matches perfectly
      if (!currentAntardasha && m.antardashas.length > 0) {
        m.antardashas[0].isCurrent = true;
        currentAntardasha = m.antardashas[0];
      }
    }
  });

  // Lucky Details
  const colorsMap: Record<number, string[]> = {
    1: ['Ruby Red', 'Orange', 'Saffron Yellow'],
    2: ['Milky White', 'Silver Accent', 'Cream'],
    3: ['Golden Yellow', 'Deep Mustard', 'Saffron'],
    4: ['Electric Wood-Green', 'Khaki', 'Turquoise'],
    5: ['Emerald Green', 'Light Parrot Green', 'Jade'],
    6: ['Opal/Diamond White', 'Champagne Pink', 'Glittery Cream'],
    7: ['Chalky White', 'Muted Grey', 'Light Saffron'],
    8: ['Indigo Blue', 'Teal', 'Muted Sage Green'],
    9: ['Scarlet Red', 'Light Saffron', 'Coral Coral']
  };

  const gemstoneMap: Record<number, string[]> = {
    1: ['Ruby (Manik)', 'Red Garnet'],
    2: ['Pure Natural Pearl (Moti)', 'Moonstone'],
    3: ['Yellow Sapphire (Pukhraj)', 'Golden Heliodor'],
    4: ['Gomedh (Hessonite)', 'Rutile Quartz'],
    5: ['Emerald (Panna)', 'Peridot'],
    6: ['Diamond (Heera)', 'Natural White Opal'],
    7: ['Cats Eye (Lehsuniya)', 'Tiger Eye Quartz'],
    8: ['Blue Sapphire (Neelam)', 'Midnight Amethyst'],
    9: ['Red Coral (Moonga)', 'Jasper Red carnelian']
  };

  const remediesMap: Record<number, string[]> = {
    1: ['Chant Aditya Hrudaya Stotra on Sundays.', 'Offer copper water to Sun facing East.'],
    2: ['Avoid high milk intake late at Mondays night.', 'Respect mother figures, donate white items.'],
    3: ['Apply yellow saffron tilak on center forehead.', 'Offer bananas or chickpea sweets to educators.'],
    4: ['Observe bird-feeding early Wednesdays.', 'Keep clear water bowls in Southeast balconies.'],
    5: ['Donate whole green gram lentils on Wednesdays.', 'Perform plant watering routines.'],
    6: ['Wear highly clean, naturally scented attire.', 'Avoid taking heavy credit loans for fashion.'],
    7: ['Meditate daily, Ganesha mantra cycles.', 'Offer food bowls to street dogs on Saturdays.'],
    8: ['Donate sesame oils to poor layout laborers.', 'Respect construction workers, perform hard physical cleaning.'],
    9: ['Carry small copper items.', 'Donate red blood or offer support to police/defense centers.']
  };

  const luckyDetails = {
    numbers: [mulank, bhagyank, 5, 1, 6],
    colors: colorsMap[mulank] || colorsMap[1],
    gemstones: gemstoneMap[mulank] || gemstoneMap[1],
    remedies: remediesMap[mulank] || remediesMap[1]
  };

  // Structured JSON
  const outputObj = {
    name,
    dob: dobStr,
    gender,
    mulank,
    bhagyank,
    loshuGridStructure: Object.values(loshuGrid).map(g => ({
      digit: g.digit,
      represented: g.digit,
      count: g.count,
      sources: g.sources,
      element: g.element,
      direction: g.direction
    })),
    planesAnalysis: PLANE_TEMPLATES.map(p => {
      const pCount = p.digits.filter(d => loshuGrid[d].count > 0).length;
      return {
        name: p.name,
        digits: p.digits,
        strength: pCount === 3 ? 'FULL' : pCount === 0 ? 'EMPTY' : 'PARTIAL'
      };
    }),
    personalYear: pYearNum,
    pinnacles: pinnaclesList,
    challenges: challengesList,
    luckyColors: luckyDetails.colors,
    luckyGemstones: luckyDetails.gemstones
  };

  return {
    personalDetails: { name, dob: dobStr, gender },
    mulank,
    bhagyank,
    loshuGrid,
    missingNumbers,
    repeatedNumbers,
    strengthArrows,
    weaknessArrows,
    personalYear: {
      number: pYearNum,
      title: personalYearTitles[pYearNum] || 'Auspicious Progress Year',
      description: `Your Personal Year code is #${pYearNum} resolving to elements aligned with your core paths.`,
      forecast: personalYearForecasts[pYearNum] || 'Expect highly progressive changes aligned with destiny plans.'
    },
    pinnacles: pinnaclesList,
    challenges: challengesList,
    mahadashas,
    currentMahadasha,
    currentAntardasha,
    luckyDetails,
    chaldeanMulank: {
      compound: chaldeanMulankCompound,
      reduced: chaldeanMulankReduced,
      title: mComp.title,
      ruler: mComp.ruler,
      description: mComp.description
    },
    chaldeanBhagyank: {
      compound: chaldeanBhagyankCompound,
      reduced: chaldeanBhagyankReduced,
      title: bComp.title,
      ruler: bComp.ruler,
      description: bComp.description
    },
    rawJSON: JSON.stringify(outputObj, null, 2)
  };
}

export interface CompatibilityAnalysisResult {
  score: number;
  grade: 'EXCELLENT' | 'VERY GOOD' | 'AVERAGE' | 'CHALLENGING';
  verdict: string;
  grid1: Record<number, number>;
  grid2: Record<number, number>;
  overlapPlanes: string[];
  mutualStrengths: string[];
  partnershipForecast: string;
}

export function performLoshuCompatibility(dob1: string, name1: string, dob2: string, name2: string): CompatibilityAnalysisResult {
  const ana1 = computeLoshuAnalysis(dob1, name1);
  const ana2 = computeLoshuAnalysis(dob2, name2);

  const m1 = ana1.mulank;
  const b1 = ana1.bhagyank;
  const m2 = ana2.mulank;
  const b2 = ana2.bhagyank;

  // Multi-step core resonance logic
  let baseScore = 60;

  // Grid element overlaps
  const overlapPlanes: string[] = [];
  const mutualStrengths: string[] = [];

  // If both have Mental/Mind plane full
  const mentalObj1 = ana1.strengthArrows.find(s => s.name === 'Mental Plane' || s.name === 'Mind Plane');
  const mentalObj2 = ana2.strengthArrows.find(s => s.name === 'Mental Plane' || s.name === 'Mind Plane');
  if (mentalObj1 && mentalObj2) {
    overlapPlanes.push('Dual Cognitive Power (Mutual Mental Plane)');
    baseScore += 8;
  }

  // Emotional plane check
  const emoObj1 = ana1.strengthArrows.find(s => s.name === 'Emotional Plane');
  const emoObj2 = ana2.strengthArrows.find(s => s.name === 'Emotional Plane');
  if (emoObj1 && emoObj2) {
    overlapPlanes.push('Infinite Heart Connection (Mutual Emotional Plane)');
    baseScore += 10;
  }

  // Prosperity plane overlap
  const pros1 = ana1.strengthArrows.find(s => s.name === 'Golden Prosperity Plane');
  const pros2 = ana2.strengthArrows.find(s => s.name === 'Golden Prosperity Plane');
  if (pros1 && pros2) {
    overlapPlanes.push('Massive Fortune Doubler (Mutual Golden Plane)');
    baseScore += 12;
  }

  // Traditional psychic-destiny friendship matrix
  const friendlyPairs: Record<number, number[]> = {
    1: [1, 3, 5, 9, 2],
    2: [1, 3, 5],
    3: [1, 2, 3, 7, 9, 5],
    4: [5, 6, 7, 1],
    5: [1, 5, 6, 2, 3],
    6: [5, 6, 7],
    7: [1, 3, 5, 6],
    8: [3, 5, 6],
    9: [1, 3, 9, 5]
  };

  const isM_friendly = friendlyPairs[m1]?.includes(m2) || false;
  const isB_friendly = friendlyPairs[reduceToSingleDigit(b1)]?.includes(reduceToSingleDigit(b2)) || false;

  if (isM_friendly && isB_friendly) {
    baseScore += 15;
    mutualStrengths.push('Planetary Driver & Conductor Alignment (Highly Friendly)');
  } else if (isM_friendly || isB_friendly) {
    baseScore += 8;
    mutualStrengths.push('Selective Astrological Affinity');
  } else {
    baseScore -= 6;
    mutualStrengths.push('Opposition Vibrational Frequencies (Requires Remedies)');
  }

  // Keep bounds
  baseScore = Math.max(30, Math.min(99, baseScore));

  let grade: 'EXCELLENT' | 'VERY GOOD' | 'AVERAGE' | 'CHALLENGING' = 'AVERAGE';
  let verdict = '';
  let partnershipForecast = '';

  if (baseScore >= 88) {
    grade = 'EXCELLENT';
    verdict = 'Excellent Cosmic Harmony (सर्वश्रेष्ठ भौतिक एवं मानसिक संबंध)';
    partnershipForecast = 'Highly supportive, double fortune dynamics. They easily compensate each other’s missing grids. Prone to deep long-term growth and stable real estate and marital peace.';
  } else if (baseScore >= 72) {
    grade = 'VERY GOOD';
    verdict = 'Auspicous Alignment (अति शुभ योग संबंध)';
    partnershipForecast = 'Strong creative team spirit, balanced conversations, stable cash flow structures, though slight efforts are needed to prevent ego locks on Saturn days.';
  } else if (baseScore >= 55) {
    grade = 'AVERAGE';
    verdict = 'Moderate Compatibility (सामान्य अनुकूलता)';
    partnershipForecast = 'Expect fluctuating emotional states. Regular communication remedies and applying appropriate color threads on negotiation sessions are advised to bypass grid holes.';
  } else {
    grade = 'CHALLENGING';
    verdict = 'Vibrational Stress (चुनौतीपूर्ण योग - सुधारात्मक उपाय आवश्यक)';
    partnershipForecast = 'Prone to rapid communication friction and mutual delay impacts. Essential to use personalized gemstones, avoid starting corporate actions on hostile lunar hours, and do name spelling corrections.';
  }

  // Compile base grids
  const grid1: Record<number, number> = {};
  const grid2: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) {
    grid1[d] = ana1.loshuGrid[d].count;
    grid2[d] = ana2.loshuGrid[d].count;
  }

  return {
    score: baseScore,
    grade,
    verdict,
    grid1,
    grid2,
    overlapPlanes,
    mutualStrengths,
    partnershipForecast
  };
}
