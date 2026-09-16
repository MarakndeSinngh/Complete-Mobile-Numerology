import { reduceToSingleDigit } from './numerologyEngine';
import { LEOFAMILY_PLANES } from '../core/planeDefinitions';
import { parseIndianDate } from '../utils/dateUtils';

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

  // Calculate Driver (Mulank) from day sum
  let daySum = day;
  while (daySum > 9) {
    daySum = daySum.toString().split('').map(d => parseInt(d, 10)).reduce((acc, val) => acc + val, 0);
  }
  const driver = daySum;

  // Include Driver (Mulank) and Conductor (Bhagyank) in the unique set of digits for Enhanced Grid
  if (driver >= 1 && driver <= 9) {
    if (!uniqueDigits.includes(driver)) {
      uniqueDigits.push(driver);
    }
  }
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
  birthMissingNumbers: number[];
  enhancedMissingNumbers: number[];
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
  1: { element: 'Water (जल तत्व)', direction: 'उत्तर (North)', lifeArea: 'करियर एवं जीवन दिशा (Career & Life Path)', gridMeaning: 'संवाद एवं योजना (Communication & Planning)' },
  2: { element: 'Earth (पृथ्वी तत्व)', direction: 'दक्षिण-पश्चिम (Southwest)', lifeArea: 'विवाह, प्रेम एवं संबंध (Marriage & Relationships)', gridMeaning: 'संवेदनशीलता एवं साझेदारी (Sensitivity & Partnership)' },
  3: { element: 'Wood (काष्ठ/लकड़ी तत्व)', direction: 'पूर्व (East)', lifeArea: 'परिवार, स्वास्थ्य एवं ज्ञान (Family & Health)', gridMeaning: 'विकास एवं ज्ञान (Growth & Wisdom)' },
  4: { element: 'Wood (काष्ठ तत्व)', direction: 'दक्षिण-पूर्व (Southeast)', lifeArea: 'धन एवं समृद्धि (Wealth & Prosperity)', gridMeaning: 'अनुशासन एवं व्यवस्था (Discipline & Organization)' },
  5: { element: 'Earth (पृथ्वी तत्व)', direction: 'ब्रह्मस्थान / केंद्र (Center)', lifeArea: 'स्थिरता एवं संतुलन (Stability & Balance)', gridMeaning: 'मानसिक संतुलन एवं संवाद (Mental Stability & Communication)' },
  6: { element: 'Metal (धातु तत्व)', direction: 'उत्तर-पश्चिम (Northwest)', lifeArea: 'सहायक मित्र, यात्रा एवं विलासिता (Friends & Luxury)', gridMeaning: 'सुख-सुविधा एवं सहयोग (Luxury & Support)' },
  7: { element: 'Metal (धातु तत्व)', direction: 'पश्चिम (West)', lifeArea: 'संतान, रचनात्मकता एवं शोध (Creativity & Intellect)', gridMeaning: 'विश्लेषण क्षमता एवं अंतर्ज्ञान (Analytical Power & Intuition)' },
  8: { element: 'Earth (पृथ्वी तत्व)', direction: 'उत्तर-पूर्व / ईशान (Northeast)', lifeArea: 'ज्ञान, शिक्षा एवं संपत्ति (Knowledge & Wealth)', gridMeaning: 'भौतिक संपत्ति एवं गंभीरता (Material Wealth & Focus)' },
  9: { element: 'Fire (अग्नि तत्व)', direction: 'दक्षिण (South)', lifeArea: 'प्रसिद्धि, मान-सम्मान एवं ऊर्जा (Fame & Reputation)', gridMeaning: 'साहस, ऊर्जा एवं पहचान (Courage & Recognition)' }
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
  const parsed = parseIndianDate(dobStr);
  const parts = dobStr.split('-');
  const bYear = parsed ? parsed.year : (parseInt(parts[0], 10) || 1990);
  const bMonth = parsed ? parsed.month : (parseInt(parts[1], 10) || 1);
  const bDay = parsed ? parsed.day : (parseInt(parts[2], 10) || 1);

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

    let isDestinyLayer = false;
    let isDestinyReinforced = false;
    if (isDestiny) {
      if (isBirthLayer) {
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
  const birthMissingNumbers: number[] = [];
  const enhancedMissingNumbers: number[] = [];
  const missingNumbers: { digit: number; element: string; meaning: string; remedy: string }[] = [];
  const missingRemedies: Record<number, string> = {
    1: 'उत्तर दिशा में पानी का फव्वारा या जल पात्र रखें, चांदी का सिक्का पास रखें और लाल/नारंगी धागा पहनें।',
    2: 'प्राकृतिक मोती की माला पहनें, दक्षिण-पश्चिम कोने को भारी रखें या मिट्टी के बर्तन/सेंधा नमक लैंप रखें।',
    3: 'हरे रंग का धागा या रुद्राक्ष धारण करें, पूर्व दिशा में तुलसी या हरे पौधे लगाएं और बड़े-बुजुर्गों का आशीर्वाद लें।',
    4: 'लकड़ी की विंड चाइम लगाएं, ग्रीन एवेंट्यूरिन ब्रेसलेट पहनें या पूर्व-दक्षिण में बांस का पौधा रखें।',
    5: 'तांबे का सिक्का या कड़ा पहनें, कार्यस्थल पर पीतल का पिरामिड रखें और घर के केंद्र को साफ व खुला रखें।',
    6: 'चांदी या स्टील की घड़ी पहनें, उत्तर-पश्चिम दिशा में धातु की घंटी या विंड चाइम लगाएं और इत्र का प्रयोग करें।',
    7: 'चांदी की अंगूठी पहनें, शनिवार को दीपक जलाएं, कुत्तों को भोजन दें और गणेश जी की आराधना करें।',
    8: 'एमेथिस्ट या ब्लैक टूमलाइन ब्रेसलेट पहनें, उत्तर-पूर्व दिशा को स्वच्छ रखें और जरूरतमंदों की सहायता करें।',
    9: 'दक्षिण दिशा में लाल दीपक या लाल बल्ब जलाएं, तांबे का छल्ला पहनें और नियमित रूप से सूर्य नमस्कार करें।'
  };

  const missingMeanings: Record<number, string> = {
    1: 'करियर में स्पष्टता की कमी, स्वतंत्रता से निर्णय लेने में संकोच और वाणी अभिव्यक्ति में झिझक।',
    2: 'रिश्तों में तालमेल की कमी, अत्यधिक संवेदनशीलता या दूसरों की भावनाओं को समझने में कठिनाई।',
    3: 'ज्ञान और एकाग्रता में भटकाव, जीवन में गुरु या वरिष्ठों के मार्गदर्शन का अभाव महसूस होना।',
    4: 'धन संचय में उतार-चढ़ाव, अनुशासन और व्यवस्थित दिनचर्या बनाए रखने में कठिनाई।',
    5: 'मानसिक अस्थिरता, निर्णयों में असमंजस और जीवन में संतुलन बनाए रखने में संघर्ष।',
    6: 'जरूरत के समय मित्रों या सहयोगियों से मदद का अभाव, विलासिता और पारिवारिक सुख में कमी।',
    7: 'धैर्य की कमी, मानसिक विश्लेषण में जल्दबाजी और कई बार अपनों से ही धोखा मिलने का डर।',
    8: 'दीर्घकालिक संपत्ति निर्माण में धीमी प्रगति और कार्यों के फल मिलने में देरी।',
    9: 'प्रसिद्धि और पहचान पाने में संघर्ष, ऊर्जा और उत्साह में समय-समय पर कमी आना।'
  };

  for (let d = 1; d <= 9; d++) {
    const dobCount = loshuGrid[d].count;
    if (dobCount === 0) {
      birthMissingNumbers.push(d);
    }
    const isEnhancedPresent = dobCount > 0 || loshuGrid[d].isDriverLayer || loshuGrid[d].isDestinyLayer;
    if (!isEnhancedPresent) {
      enhancedMissingNumbers.push(d);
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
      1: 'संतुलित एवं स्वतंत्र विचार। अपनी बात स्पष्टता से रखने में सक्षम।',
      2: 'अति शुभ! बेहतरीन संवाद शैली, कूटनीति, मधुर वाणी और नेतृत्व क्षमता।',
      3: 'अत्यधिक बातचीत की प्रवृत्ति, बातें साझा करने में जल्दबाजी, कभी-कभी अति-मुखर।',
      4: 'अहंकार और हठ की प्रवृत्ति। दूसरों के सुझाव सुनने में कठिनाई।'
    },
    2: {
      1: 'संवेदनशील, मिलनसार, दूसरों की मदद करने वाला एवं शांत स्वभाव।',
      2: 'गहरी संवेदनशीलता, अंतर्ज्ञान मजबूत, लेकिन मूड स्विंग्स और चिंता की संभावना।',
      3: 'अति-संवेदनशील। छोटी बातों को दिल पर लगाना और भावनात्मक रूप से आहत होना।',
      4: 'अत्यधिक भावनात्मक उतार-चढ़ाव, रिश्तों में असुरक्षा की भावना।'
    },
    3: {
      1: 'उत्कृष्ट रचनात्मकता, ज्ञानवान, बड़ों का सम्मान करने वाला एवं सभ्य स्वभाव।',
      2: 'गहरी बुद्धिमत्ता, रणनीतिक सोच, उच्च बौद्धिक क्षमता और सीखने की तीव्र ललक।',
      3: 'अति-आलोचनात्मक सोच, व्यावहारिक धरातल से कटना, बहुत अधिक उपदेश देने की आदत।',
      4: 'अति-आत्मविश्वास, दूसरों की सलाह को पूरी तरह नकारना और अनावश्यक विवाद।'
    },
    4: {
      1: 'व्यवस्थित, परिश्रमी, व्यावहारिक और नियमों का पालन करने वाला व्यक्ति।',
      2: 'अति-सावधानी, हर छोटी बारीकी में उलझना, आसानी से संतुष्ट न होना।',
      3: 'अत्यधिक कार्य का बोझ लेना, मनोरंजन और आराम से पूरी तरह दूर रहना।',
      4: 'कठोर स्वभाव, बदलाव का विरोध और अचानक कानूनी या प्रशासनिक अड़चनें।'
    },
    5: {
      1: 'आत्मविश्वास से भरपूर, व्यापारिक समझ, चतुर संवाद और नई परिस्थितियों में सहज।',
      2: 'तीव्र बुद्धिमत्ता, त्वरित निर्णय, बहुमुखी प्रतिभा और जोखिम लेने में आगे।',
      3: 'अनावश्यक फिजूलखर्ची, जोखिम भरे निवेश और दिनचर्या में अत्यधिक अस्थिरता।',
      4: 'अनियंत्रित सट्टेबाजी की आदत, अचानक आर्थिक नुकसान और घबराहट।'
    },
    6: {
      1: 'परिवार से गहरा लगाव, कला और सौंदर्य में रुचि, जिम्मेदार और मार्गदर्शक स्वभाव।',
      2: 'विलासिता और उच्च रहन-सहन की चाहत, उत्तम डिज़ाइनर पसंद, पारिवारिक सुरक्षा।',
      3: 'दिखावे और लग्जरी पर अत्यधिक खर्च, पारिवारिक मामलों में तनाव और देनदारियां।',
      4: 'वैवाहिक जीवन में अपेक्षाओं का अत्यधिक बोझ, संबंधों में दूरी और असंतोष।'
    },
    7: {
      1: 'दार्शनिक दृष्टिकोण, अनुभवों से सीखने वाला, आध्यात्मिक रुचि और तीव्र अंतर्दृष्टि।',
      2: 'गहरा विश्लेषणात्मक दिमाग, लेकिन निकट सहयोगियों से धोखे का डर और एकाकीपन।',
      3: 'करियर या रिश्तों में भावनात्मक झटके झेलना, जिसके बाद वैराग्य की ओर झुकाव।',
      4: 'समाज से पूरी तरह अलग-थलग होना, दुनिया पर विश्वास न करना और अकेलापन।'
    },
    8: {
      1: 'व्यावहारिक सोच, वित्तीय अनुशासन, धैर्यवान और धीरे-धीरे स्थायी सफलता।',
      2: 'शनि का दोहरा प्रभाव: गहरी योजना लेकिन परिणाम धीमी गति से। भारी जिम्मेदारियां।',
      3: 'आर्थिक स्थिति में अचानक बड़े उतार-चढ़ाव, धन के रुक-रुक कर आने की समस्या।',
      4: 'कड़ा संघर्ष, कानूनी उलझनें, लेकिन अंततः गहरा अनुभव और स्थायी ज्ञान।'
    },
    9: {
      1: 'साहसी, ऊर्जावान, परोपकारी और नेतृत्व करने में सबसे आगे रहने वाला व्यक्ति।',
      2: 'प्रतिस्पर्धी स्वभाव, अत्यधिक ऊर्जा, त्वरित प्रतिक्रिया और स्पष्टवादी।',
      3: 'अचानक क्रोध आना, वाणी में तल्खी, चोट या सर्जरी की संभावना।',
      4: 'अति-उतावलापन, अधिकारियों से मतभेद और आंतरिक अशांति।'
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
    1: 'वर्ष 1: नव निर्माण एवं नेतृत्व (New Beginnings & Leadership)',
    2: 'वर्ष 2: धैर्य, सहकार्यता एवं संतुलन (Patience & Partnerships)',
    3: 'वर्ष 3: ज्ञान, विस्तार एवं रचनात्मकता (Expansion & Wisdom)',
    4: 'वर्ष 4: कठिन परिश्रम, संगठन एवं नींव (Foundation & Hard Work)',
    5: 'वर्ष 5: परिवर्तन, यात्रा एवं नए अवसर (Change & Opportunities)',
    6: 'वर्ष 6: परिवार, सुख-सुविधा एवं समृद्धि (Family & Luxury)',
    7: 'वर्ष 7: आत्म-मंथन, अध्यात्म एवं शोध (Spiritual Growth & Solitude)',
    8: 'वर्ष 8: कर्म फल, व्यवसाय वृद्धि एवं विजय (Material Success & Harvest)',
    9: 'वर्ष 9: पूर्णता, विसर्जन एवं नवीनीकरण (Completion & Transformation)'
  };
  const personalYearForecasts: Record<number, string> = {
    1: 'नया कार्य, व्यापार या योजना शुरू करने के लिए अत्यंत शुभ वर्ष। सूर्य की ऊर्जा से आत्मविश्वास और स्वतंत्र पहचान में भारी वृद्धि होगी।',
    2: 'जल की तरह शांत और धैर्यवान बने रहने का वर्ष। साझेदारी मजबूत करें, टीम वर्क अपनाएं और विवादों से दूर रहकर आगे बढ़ें।',
    3: 'गुरु बृहस्पति की कृपा से बौद्धिक विकास, नए कौशल सीखने और सामाजिक प्रतिष्ठा बढ़ाने का उत्तम समय है। ज्ञान का विस्तार होगा।',
    4: 'धैर्यपूर्वक मजबूत नींव तैयार करने का समय। मेहनत अधिक होगी परंतु भविष्य के लिए स्थायी सुरक्षा और बचत का निर्माण होगा।',
    5: 'तेज गति और सकारात्मक बदलावों का वर्ष। यात्राएं, नए संपर्क, जनसंपर्क और व्यापार में प्रगति के भरपूर योग हैं।',
    6: 'शुक्र का प्रभाव सुख-समृद्धि, वाहन/गृह निर्माण और पारिवारिक सौहार्द को बढ़ावा देगा। संबंधों में मधुरता और विलासिता बढ़ेगी।',
    7: 'केतु का प्रभाव। बाहरी शोर कम करके आंतरिक ज्ञान, योग, ध्यान और आत्म-विश्लेषण पर ध्यान केंद्रित करने का समय है।',
    8: 'शनि देव का वर्ष। पूर्व के कर्मों और परिश्रम का श्रेष्ठ फल मिलेगा। रुका हुआ धन व संपत्ति के सौदे पूर्ण होंगे।',
    9: 'पुराने अनावश्यक बंधनों और रुकी हुई योजनाओं को समाप्त कर नए चक्र की तैयारी करने का समय। दान-पुण्य और सेवा करें।'
  };

  // Pinnacle Cycles
  const pin1 = reduceToSingleDigit(reduceToSingleDigit(bDay) + reduceToSingleDigit(bMonth));
  const pin2 = reduceToSingleDigit(reduceToSingleDigit(bDay) + reduceToSingleDigit(bYear));
  const pin3 = reduceToSingleDigit(pin1 + pin2);
  const pin4 = reduceToSingleDigit(reduceToSingleDigit(bMonth) + reduceToSingleDigit(bYear));
  const pinnacleMeanings = [
    'प्रारंभिक जीवन का विकास, अपनी पहचान खोजना और मूल संरचनाओं को सीखना।',
    'करियर का तीव्र विस्तार, पारिवारिक उत्तरदायित्व और सामाजिक प्रतिष्ठा का निर्माण।',
    'परिपक्व कर्मों का फल, मार्गदर्शक की भूमिका, आर्थिक व प्रशासनिक शक्ति का शिखर।',
    'वरिष्ठता, परिवार व समाज को मार्गदर्शन, आध्यात्मिक गहराई और स्थायी विरासत।'
  ];

  const pinnaclesList = [
    { pinnacle: pin1, cycle: 1, ageRange: `0 से ${36 - bhagyank} वर्ष`, meaning: pinnacleMeanings[0] },
    { pinnacle: pin2, cycle: 2, ageRange: `${36 - bhagyank + 1} से ${36 - bhagyank + 9} वर्ष`, meaning: pinnacleMeanings[1] },
    { pinnacle: pin3, cycle: 3, ageRange: `${36 - bhagyank + 10} से ${36 - bhagyank + 18} वर्ष`, meaning: pinnacleMeanings[2] },
    { pinnacle: pin4, cycle: 4, ageRange: `${36 - bhagyank + 19} वर्ष के बाद`, meaning: pinnacleMeanings[3] }
  ];

  // Challenge Numbers
  const ch1 = Math.abs(reduceToSingleDigit(bDay) - reduceToSingleDigit(bMonth));
  const ch2 = Math.abs(reduceToSingleDigit(bDay) - reduceToSingleDigit(bYear));
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(reduceToSingleDigit(bMonth) - reduceToSingleDigit(bYear));
  const challengeMeanings = [
    'अत्यधिक भावनात्मक उतार-चढ़ाव से बचना और स्थिर योजना बनाना सीखना।',
    'स्वतंत्र निर्णय क्षमता विकसित करना और दूसरों पर अत्यधिक निर्भरता से बचना।',
    'कार्यों में देरी के दौरान धैर्य बनाए रखना और निराशा से खुद को बचाना।',
    'वित्तीय संतुलन बनाए रखना और जोखिम भरे सट्टेबाजी से बचना।'
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
    1: ['लाल (Ruby Red)', 'नारंगी (Orange)', 'केसरिया (Saffron)'],
    2: ['दूधिया सफेद (Milky White)', 'सिल्वर (Silver)', 'क्रीम (Cream)'],
    3: ['सुनहरा पीला (Golden Yellow)', 'हल्दी पीला (Mustard)', 'केसरिया (Saffron)'],
    4: ['गहरा हरा (Deep Green)', 'खाकी (Khaki)', 'फिरोजी (Turquoise)'],
    5: ['पन्ना हरा (Emerald Green)', 'हल्का हरा (Light Green)', 'पिस्ता (Jade)'],
    6: ['चमकीला सफेद (Opal White)', 'हल्का गुलाबी (Pink)', 'क्रीम (Glittery Cream)'],
    7: ['सफेद (Muted White)', 'धूसर/ग्रे (Grey)', 'हल्का पीला (Light Saffron)'],
    8: ['गहरा नीला (Indigo Blue)', 'नेवी ब्लू (Navy Blue)', 'काला/ग्रे (Muted Sage)'],
    9: ['लाल (Scarlet Red)', 'केसरिया (Saffron)', 'मूंगा लाल (Coral)']
  };

  const gemstoneMap: Record<number, string[]> = {
    1: ['माणिक्य (Ruby / Manik)', 'लाल गार्नेट (Garnet)'],
    2: ['सच्चा मोती (Natural Pearl / Moti)', 'मूनस्टोन (Moonstone)'],
    3: ['पुखराज (Yellow Sapphire / Pukhraj)', 'सुनहला (Golden Topaz)'],
    4: ['गोमेद (Hessonite / Gomedh)', 'रूटाइल क्वार्ट्ज'],
    5: ['पन्ना (Emerald / Panna)', 'पेरिडॉट (Peridot)'],
    6: ['हीरा (Diamond / Heera)', 'सफेद ओपल (White Opal)'],
    7: ['लहसुनिया (Cats Eye / Lehsuniya)', 'टाइगर आई (Tiger Eye)'],
    8: ['नीलम (Blue Sapphire / Neelam)', 'जमुनिया (Amethyst)'],
    9: ['मूंगा (Red Coral / Moonga)', 'लाल अकीक (Red Carnelian)']
  };

  const remediesMap: Record<number, string[]> = {
    1: ['रविवार को सूर्य देव को तांबे के लोटे से जल अर्पित करें और आदित्य हृदय स्तोत्र का पाठ करें।', 'पूर्व दिशा में तांबे का सूर्य लगाएं और पिता का सम्मान करें।'],
    2: ['माता का आशीर्वाद लें, सोमवार को सफेद वस्तुओं या दूध का दान करें।', 'चांदी के गिलास में पानी पिएं और रात्रि में अधिक देर तक जागने से बचें।'],
    3: ['माथे पर नियमित केसर या हल्दी का तिलक लगाएं।', 'गुरुजनों, शिक्षकों का सम्मान करें और गुरुवार को चने की दाल या केले का दान करें।'],
    4: ['पक्षियों को प्रतिदिन दाना-पानी डालें।', 'दक्षिण-पूर्व दिशा में लकड़ी का विंड चाइम लगाएं और घर में अव्यवस्था न रखें।'],
    5: ['बुधवार को साबुत हरी मूंग का दान करें या गाय को हरा चारा खिलाएं।', 'कार्यस्थल पर तुलसी का पौधा रखें और हरे रंग का रुमाल पास रखें।'],
    6: ['साफ-सुथरे व सुगंधित वस्त्र पहनें, इत्र/परफ्यूम का नियमित प्रयोग करें।', 'शुक्रवार को कन्याओं को सफेद मिष्ठान खिलाएं और जीवनसाथी का सम्मान करें।'],
    7: ['प्रतिदिन भगवान गणेश जी की आराधना करें और संकटनाशन स्तोत्र का पाठ करें।', 'शनिवार को काले/सफेद आवारा कुत्तों को रोटी या बिस्कुट खिलाएं।'],
    8: ['शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं।', 'गरीबों, मजदूरों व सफाई कर्मचारियों का सम्मान करें और उन्हें काले चने या तेल का दान करें।'],
    9: ['मंगलवार को हनुमान चालीसा का पाठ करें और सिंदूर का तिलक लगाएं।', 'छोटे भाइयों व मित्रों की सहायता करें, तांबे का छल्ला धारण करें।']
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
    birthMissingNumbers,
    enhancedMissingNumbers,
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
