/**
 * LEOFAMILY — LUCKY DATES FINDER PRO (PHASE 12)
 *
 * Comprehensive Vedic & Chaldean Auspicious Date Identification Engine.
 * Synthesizes:
 * - Driver (मूलांक) & Conductor (भाग्यांक)
 * - Date Root Vibration & Compound Number
 * - Personal Year, Personal Month, Personal Day
 * - Weekday Lords (Sun:1, Mon:2, Tue:9, Wed:5, Thu:3, Fri:6, Sat:8)
 * - Transit Matching & Purpose-Specific Harmony
 * - Hindi-First Transparent, Explainable, Non-Sensational Guidance
 */

import { reduceToDigit, sumDigits, calculateMulank, calculateBhagyank } from './numerologyEngine';
import { parseIndianDate, formatDateIndian, formatDateForStorage, getDaysInMonth, ParsedDate } from '../utils/dateUtils';
import { NUMBER_PROFILES } from './numberMeaningEngine';

export type LuckyDatesPurposeKey =
  | 'GENERAL'
  | 'BUSINESS_LAUNCH'
  | 'BUSINESS_MEETING'
  | 'AGREEMENT'
  | 'JOB_CAREER'
  | 'INTERVIEW'
  | 'EDUCATION'
  | 'PROPERTY'
  | 'VEHICLE'
  | 'MARRIAGE'
  | 'TRAVEL'
  | 'NEW_PROJECT'
  | 'OFFICE_OPENING'
  | 'HOUSEWARMING'
  | 'NAME_REGISTRATION'
  | 'OTHER';

export interface PurposeDefinition {
  key: LuckyDatesPurposeKey;
  titleEn: string;
  titleHi: string;
  category: string;
  supportiveRoots: number[];
  supportiveWeekdays: number[]; // 1=Sun, 2=Mon, 3=Thu, 5=Wed, 6=Fri, 8=Sat, 9=Tue
  cautionRoots: number[];
  coreThemeHi: string;
}

export const PURPOSE_DEFINITIONS: Record<LuckyDatesPurposeKey, PurposeDefinition> = {
  GENERAL: {
    key: 'GENERAL',
    titleEn: 'General Important Activity',
    titleHi: 'सामान्य शुभ कार्य व महत्वपूर्ण निर्णय',
    category: 'General',
    supportiveRoots: [1, 3, 5, 6],
    supportiveWeekdays: [1, 3, 5, 6],
    cautionRoots: [8],
    coreThemeHi: 'सकारात्मक शुरुआत, सौहार्द और समग्र ऊर्जा संतुलन'
  },
  BUSINESS_LAUNCH: {
    key: 'BUSINESS_LAUNCH',
    titleEn: 'Business Launch / Venture',
    titleHi: 'नया व्यापार / व्यावसायिक प्रतिष्ठान शुभारंभ',
    category: 'Commercial',
    supportiveRoots: [1, 5, 6],
    supportiveWeekdays: [1, 3, 5, 6],
    cautionRoots: [4, 8],
    coreThemeHi: 'दीर्घकालिक लाभ, ग्राहक आकर्षण व वाणिज्यिक स्थिरता'
  },
  BUSINESS_MEETING: {
    key: 'BUSINESS_MEETING',
    titleEn: 'Business Meeting & Deal',
    titleHi: 'व्यापारिक बैठक, साझेदारी व महत्वपूर्ण डील',
    category: 'Commercial',
    supportiveRoots: [1, 3, 5],
    supportiveWeekdays: [3, 5, 1],
    cautionRoots: [8],
    coreThemeHi: 'प्रभावी संवाद, आपसी सहमति व त्वरित निर्णय'
  },
  AGREEMENT: {
    key: 'AGREEMENT',
    titleEn: 'Agreement & Contract Signing',
    titleHi: 'अनुबंध व एग्रीमेंट हस्ताक्षर (Legal / MOU)',
    category: 'Legal',
    supportiveRoots: [1, 3, 5],
    supportiveWeekdays: [3, 5, 6],
    cautionRoots: [4, 8],
    coreThemeHi: 'कानूनी स्पष्टता, आपसी निष्ठा व दस्तावेजीय सुरक्षा'
  },
  JOB_CAREER: {
    key: 'JOB_CAREER',
    titleEn: 'Job Joining & Career Step',
    titleHi: 'नई नौकरी ज्वाइनिंग व कार्यभार ग्रहण',
    category: 'Career',
    supportiveRoots: [1, 3, 5, 8],
    supportiveWeekdays: [1, 3, 5],
    cautionRoots: [2],
    coreThemeHi: 'अधिकार, पदोन्नति, सम्मान व कार्यक्षेत्र में स्थायित्व'
  },
  INTERVIEW: {
    key: 'INTERVIEW',
    titleEn: 'Job Interview & Pitch',
    titleHi: 'नौकरी साक्षात्कार (Interview) व प्रेजेंटेशन',
    category: 'Career',
    supportiveRoots: [1, 3, 5],
    supportiveWeekdays: [1, 3, 5],
    cautionRoots: [4, 8],
    coreThemeHi: 'आत्मविश्वास, वाणी में आकर्षण व तार्किक प्रभाव'
  },
  EDUCATION: {
    key: 'EDUCATION',
    titleEn: 'Education, Exam & Admissions',
    titleHi: 'उच्च शिक्षा, परीक्षा व शैक्षणिक प्रवेश',
    category: 'Knowledge',
    supportiveRoots: [3, 5, 1, 7],
    supportiveWeekdays: [3, 5, 1],
    cautionRoots: [9],
    coreThemeHi: 'एकाग्रता, तीव्र स्मरण शक्ति व गुरु का आशीर्वाद'
  },
  PROPERTY: {
    key: 'PROPERTY',
    titleEn: 'Property Purchase & Registry',
    titleHi: 'भूमि, भवन व फ्लैट क्रय/रजिस्ट्री',
    category: 'Vastu & Wealth',
    supportiveRoots: [2, 6, 8, 3],
    supportiveWeekdays: [5, 6, 3],
    cautionRoots: [4],
    coreThemeHi: 'वास्तु संतुलन, संचित संपत्ति सुरक्षा व पारिवारिक सुख'
  },
  VEHICLE: {
    key: 'VEHICLE',
    titleEn: 'Vehicle Purchase & Delivery',
    titleHi: 'नवीन वाहन क्रय व डिलीवरी',
    category: 'Asset',
    supportiveRoots: [5, 6, 1],
    supportiveWeekdays: [5, 6, 1],
    cautionRoots: [8, 4],
    coreThemeHi: 'यात्रा सुरक्षा, यांत्रिक सामंजस्य व गतिशीलता'
  },
  MARRIAGE: {
    key: 'MARRIAGE',
    titleEn: 'Marriage & Engagement',
    titleHi: 'विवाह, सगाई (मंगनी) व रोका संस्कार',
    category: 'Family',
    supportiveRoots: [2, 3, 6, 9],
    supportiveWeekdays: [3, 5, 6, 1],
    cautionRoots: [8, 4],
    coreThemeHi: 'दांपत्य प्रेम, पारिवारिक सामंजस्य व अखंड सौभाग्य'
  },
  TRAVEL: {
    key: 'TRAVEL',
    titleEn: 'Auspicious Travel & Foreign Move',
    titleHi: 'शुभ यात्रा, विदेश प्रस्थान व तीर्थाटन',
    category: 'Movement',
    supportiveRoots: [3, 5, 1],
    supportiveWeekdays: [3, 5, 6],
    cautionRoots: [8],
    coreThemeHi: 'निर्विघ्न सफर, सफलता व सकारात्मक अनुभव'
  },
  NEW_PROJECT: {
    key: 'NEW_PROJECT',
    titleEn: 'New Project Initiation',
    titleHi: 'नवीन प्रोजेक्ट व कार्ययोजना का शुभारंभ',
    category: 'Commercial',
    supportiveRoots: [1, 3, 5, 9],
    supportiveWeekdays: [1, 3, 5],
    cautionRoots: [8],
    coreThemeHi: 'ऊर्जा प्रवाह, टीम समन्वय व निरंतर प्रगति'
  },
  OFFICE_OPENING: {
    key: 'OFFICE_OPENING',
    titleEn: 'Office / Shop Inauguration',
    titleHi: 'कार्यालय, दुकान व क्लिनिक उद्घाटन',
    category: 'Commercial',
    supportiveRoots: [1, 5, 6, 3],
    supportiveWeekdays: [3, 5, 6, 1],
    cautionRoots: [4, 8],
    coreThemeHi: 'ग्राहकों का आगमन, धन लाभ व यश'
  },
  HOUSEWARMING: {
    key: 'HOUSEWARMING',
    titleEn: 'Housewarming (Griha Pravesh)',
    titleHi: 'गृह प्रवेश व गृह शांति पूजन',
    category: 'Vastu & Family',
    supportiveRoots: [3, 6, 2, 1],
    supportiveWeekdays: [3, 5, 6, 1],
    cautionRoots: [4, 8],
    coreThemeHi: 'सकारात्मक ऊर्जा का वास, सुख-शांति व समृद्धि'
  },
  NAME_REGISTRATION: {
    key: 'NAME_REGISTRATION',
    titleEn: 'Name Registration / Formal Filing',
    titleHi: 'आधिकारिक नामकरण व सरकारी पंजीयन',
    category: 'Identity',
    supportiveRoots: [1, 3, 5, 6],
    supportiveWeekdays: [1, 3, 5],
    cautionRoots: [8],
    coreThemeHi: 'वैधानिक मान्यता, लोकप्रियता व भाग्य वृद्धि'
  },
  OTHER: {
    key: 'OTHER',
    titleEn: 'Other Significant Endeavor',
    titleHi: 'अन्य विशिष्ट व महत्वपूर्ण कार्य',
    category: 'General',
    supportiveRoots: [1, 3, 5, 6],
    supportiveWeekdays: [1, 3, 5, 6],
    cautionRoots: [8],
    coreThemeHi: 'समग्र वैदिक संतुलन व शुभ मुहूर्त सामंजस्य'
  }
};

// Approved LeoFamily Weekday to Planetary Number mapping
export const WEEKDAY_MAP: Record<number, { nameEn: string; nameHi: string; planetNumber: number; lordHi: string; lordEn: string }> = {
  0: { nameEn: 'Sunday', nameHi: 'रविवार', planetNumber: 1, lordHi: 'सूर्य देव', lordEn: 'Sun (Surya)' },
  1: { nameEn: 'Monday', nameHi: 'सोमवार', planetNumber: 2, lordHi: 'चन्द्र देव', lordEn: 'Moon (Chandra)' },
  2: { nameEn: 'Tuesday', nameHi: 'मंगलवार', planetNumber: 9, lordHi: 'मंगल देव', lordEn: 'Mars (Mangala)' },
  3: { nameEn: 'Wednesday', nameHi: 'बुधवार', planetNumber: 5, lordHi: 'बुध देव', lordEn: 'Mercury (Budha)' },
  4: { nameEn: 'Thursday', nameHi: 'गुरुवार', planetNumber: 3, lordHi: 'बृहस्पति देव', lordEn: 'Jupiter (Brihaspati)' },
  5: { nameEn: 'Friday', nameHi: 'शुक्रवार', planetNumber: 6, lordHi: 'शुक्र देव', lordEn: 'Venus (Shukra)' },
  6: { nameEn: 'Saturday', nameHi: 'शनिवार', planetNumber: 8, lordHi: 'शनि देव', lordEn: 'Saturn (Shani)' }
};

// Friendship grid across numbers 1-9
export const NUMERICAL_FRIENDSHIP_MATRIX: Record<number, { friends: number[]; neutral: number[]; challenges: number[] }> = {
  1: { friends: [1, 2, 3, 5, 9], neutral: [4, 7], challenges: [6, 8] },
  2: { friends: [1, 2, 3, 5], neutral: [6, 7, 9], challenges: [4, 8] },
  3: { friends: [1, 2, 3, 5, 9], neutral: [8], challenges: [4, 6, 7] },
  4: { friends: [1, 4, 5, 6, 7, 8], neutral: [3], challenges: [2, 9] },
  5: { friends: [1, 2, 3, 4, 5, 6], neutral: [7, 8, 9], challenges: [] },
  6: { friends: [4, 5, 6, 7, 8], neutral: [2, 3], challenges: [1, 9] },
  7: { friends: [1, 4, 5, 6, 7], neutral: [2, 8], challenges: [3, 9] },
  8: { friends: [3, 4, 5, 6, 7, 8], neutral: [2], challenges: [1, 9] },
  9: { friends: [1, 2, 3, 5, 9], neutral: [7], challenges: [4, 6, 8] }
};

export type CompatibilityStatus = 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION';

export interface CandidateDateAnalysis {
  dateFormatted: string; // DD/MM/YYYY
  isoDate: string; // YYYY-MM-DD
  day: number;
  month: number;
  year: number;
  weekday: string;
  weekdayHi: string;
  weekdayNumber: number;
  weekdayLord: string;
  dateNumber: number; // Single digit of Day
  compoundNumber: number; // Sum of all digits in DDMMYYYY
  rootNumber: number; // Single digit of date sum
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  personalDayThemeHi: string;
  compatibilityStatus: CompatibilityStatus;
  compatibilityStatusHi: string;
  compatibilityScore: number; // 0 - 100
  purposeScore: number;
  whyThisDateHi: string;
  supportingFactorsHi: string[];
  cautionFactorsHi: string[];
  traditionalGuidanceHi: string;
  transitMatchingAspectHi: string;
}

export interface TransitMatchingGridData {
  driverCompatibilityHi: string;
  conductorCompatibilityHi: string;
  personalYearAlignmentHi: string;
  personalMonthAlignmentHi: string;
  dashaTransitToneHi: string;
}

export interface LuckyDatesFinderReport {
  birthProfile: {
    dob: string;
    standardDob: string;
    mulank: number;
    bhagyank: number;
    mulankGraha: string;
    bhagyankGraha: string;
    name?: string;
  };
  purpose: LuckyDatesPurposeKey;
  purposeHi: string;
  dateRangeSummary: string;
  currentPersonalYear: number;
  currentPersonalYearThemeHi: string;
  currentPersonalMonth: number;
  currentPersonalMonthThemeHi: string;
  candidates: CandidateDateAnalysis[];
  transitMatchingGrid: TransitMatchingGridData;
  topSupportiveDates: CandidateDateAnalysis[];
  generalSupportingFactorsHi: string[];
  generalCautionFactorsHi: string[];
  finalSelectionNotesHi: string;
  mandatoryDisclaimerHi: string;
}

/**
 * Standard Personal Year calculation according to Indian numerology
 */
export function calculatePersonalYearNumber(dob: string, targetYear: number): number {
  const parsed = parseIndianDate(dob);
  if (!parsed) return 1;
  const bDaySum = sumDigits(parsed.day);
  const bMonthSum = sumDigits(parsed.month);
  const tYearSum = sumDigits(targetYear);
  return reduceToDigit(bDaySum + bMonthSum + tYearSum);
}

/**
 * Evaluates a single calendar date for a given user profile & purpose
 */
export function analyzeCandidateDate(
  dateInput: { day: number; month: number; year: number },
  userMulank: number,
  userBhagyank: number,
  userDob: string,
  purposeKey: LuckyDatesPurposeKey = 'GENERAL',
  partnerDob?: string
): CandidateDateAnalysis {
  const { day, month, year } = dateInput;

  // DD/MM/YYYY formatting
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  const yyyy = String(year).padStart(4, '0');
  const dateFormatted = `${dd}/${mm}/${yyyy}`;
  const isoDate = `${yyyy}-${mm}-${dd}`;

  // Date Numbers
  const dateNumber = reduceToDigit(day);
  const dateDigits = `${dd}${mm}${yyyy}`;
  const compoundNumber = sumDigits(dateDigits);
  const rootNumber = reduceToDigit(compoundNumber);

  // Weekday details (Vedic mapping: Sun=1, Mon=2, Tue=9, Wed=5, Thu=3, Fri=6, Sat=8)
  // Construct UTC date to get weekday reliably
  const jsDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayIndex = jsDate.getUTCDay(); // 0=Sunday..6=Saturday
  const weekdayData = WEEKDAY_MAP[dayIndex] || WEEKDAY_MAP[0];

  // Personal Year, Month, Day
  const personalYear = calculatePersonalYearNumber(userDob, year);
  const personalMonth = reduceToDigit(personalYear + month);
  const personalDay = reduceToDigit(personalMonth + dateNumber);

  const purposeDef = PURPOSE_DEFINITIONS[purposeKey] || PURPOSE_DEFINITIONS.GENERAL;

  // Compatibility Calculations
  let score = 50;
  const supportingFactors: string[] = [];
  const cautionFactors: string[] = [];

  const mulankFriends = NUMERICAL_FRIENDSHIP_MATRIX[userMulank]?.friends || [];
  const mulankChallenges = NUMERICAL_FRIENDSHIP_MATRIX[userMulank]?.challenges || [];
  const bhagyankFriends = NUMERICAL_FRIENDSHIP_MATRIX[userBhagyank]?.friends || [];
  const bhagyankChallenges = NUMERICAL_FRIENDSHIP_MATRIX[userBhagyank]?.challenges || [];

  // 1. Mulank Friendliness
  if (mulankFriends.includes(dateNumber)) {
    score += 15;
    supportingFactors.push(`तारीख अंक ${dateNumber} आपके मूलांक ${userMulank} के साथ मित्रवत ऊर्जा साझा करता है।`);
  } else if (mulankChallenges.includes(dateNumber)) {
    score -= 15;
    cautionFactors.push(`तारीख अंक ${dateNumber} आपके मूलांक ${userMulank} के साथ तनावपूर्ण संबंध बना सकता है।`);
  }

  // 2. Bhagyank Friendliness
  if (bhagyankFriends.includes(rootNumber)) {
    score += 15;
    supportingFactors.push(`तारीख का समग्र योग (Root) ${rootNumber} आपके भाग्यांक ${userBhagyank} के अनुकूल है।`);
  } else if (bhagyankChallenges.includes(rootNumber)) {
    score -= 10;
    cautionFactors.push(`समग्र तारीख योग ${rootNumber} भाग्यांक के लिए अधिक प्रयास की मांग करता है।`);
  }

  // 3. Purpose Alignment
  let purposeScore = 60;
  if (purposeDef.supportiveRoots.includes(rootNumber) || purposeDef.supportiveRoots.includes(dateNumber)) {
    score += 15;
    purposeScore += 25;
    supportingFactors.push(`${purposeDef.titleHi} के लिए यह तारीख पारंपरिक रूप से फलदायी मानी जाती है।`);
  }
  if (purposeDef.cautionRoots.includes(rootNumber) || purposeDef.cautionRoots.includes(dateNumber)) {
    score -= 10;
    purposeScore -= 20;
    cautionFactors.push(`इस कार्य के लिए यह अंक पारंपरिक रूप से कुछ विलंब या अतिरिक्त औपचारिकताएं ला सकता है।`);
  }

  // 4. Weekday Lord Alignment
  if (purposeDef.supportiveWeekdays.includes(weekdayData.planetNumber)) {
    score += 10;
    supportingFactors.push(`${weekdayData.nameHi} (${weekdayData.lordHi}) इस कार्य के लिए स्वाभाविक शुभता प्रदान करता है।`);
  }

  // 5. Personal Day Resonance
  const pDayThemes: Record<number, string> = {
    1: 'नई शुरुआत, स्वतंत्र निर्णय व नेतृत्व',
    2: 'सहयोग, समझौता, शांति व संबंध',
    3: 'विस्तार, ज्ञान, रचनात्मकता व अभिव्यक्ति',
    4: 'व्यवस्था, अनुशासन, कड़ी मेहनत व नींव',
    5: 'संवाद, यात्रा, व्यापार व नवीनता',
    6: 'पारिवारिक दायित्व, सौंदर्य व संबंध',
    7: 'चिंतन, शोध, विश्लेषण व आत्म-विकास',
    8: 'प्रशासन, वित्त, दीर्घकालिक निर्णय व कर्म',
    9: 'समापन, परोपकार, ऊर्जा व व्यापक दृष्टि'
  };
  const personalDayThemeHi = pDayThemes[personalDay] || 'संतुलित कार्य निष्पादन';

  if (personalDay === 1 || personalDay === 3 || personalDay === 5 || personalDay === 6) {
    score += 8;
  }

  // Partner analysis if provided and purpose is MARRIAGE or PARTNERSHIP
  if (partnerDob && (purposeKey === 'MARRIAGE' || purposeKey === 'BUSINESS_MEETING')) {
    const partnerMulank = calculateMulank(partnerDob);
    const partnerFriends = NUMERICAL_FRIENDSHIP_MATRIX[partnerMulank]?.friends || [];
    if (partnerFriends.includes(dateNumber) || partnerFriends.includes(rootNumber)) {
      score += 10;
      supportingFactors.push(`पार्टनर के मूलांक (${partnerMulank}) के साथ भी यह तारीख पूर्णतः सामंजस्यपूर्ण है।`);
    }
  }

  // Bound score
  const finalScore = Math.min(98, Math.max(35, score));

  // Determine status
  let compatibilityStatus: CompatibilityStatus = 'NEUTRAL';
  let compatibilityStatusHi = 'संतुलित / सामान्य (Neutral)';

  if (finalScore >= 72) {
    compatibilityStatus = 'SUPPORTIVE';
    compatibilityStatusHi = 'अत्यंत अनुकूल (Supportive)';
  } else if (finalScore < 52 || cautionFactors.length >= 2) {
    compatibilityStatus = 'NEEDS_ATTENTION';
    compatibilityStatusHi = 'विशेष ध्यान योग्य (Needs Attention)';
  }

  // Explanations
  const whyThisDateHi =
    compatibilityStatus === 'SUPPORTIVE'
      ? `यह तारीख आपके मूलांक #${userMulank} एवं व्यक्तिगत वर्ष #${personalYear} के साथ सकारात्मक सामंजस्य रखती है। Personal Day #${personalDay} होने से ${purposeDef.titleHi} के लिए यह समय उत्साहवर्धक सिद्ध हो सकता है।`
      : compatibilityStatus === 'NEUTRAL'
      ? `इस तारीख की ऊर्जा संतुलित है। न तो कोई बड़ा ग्रहीय विरोध है और न ही असाधारण संयोग। सामान्य सतर्कता और अच्छी तैयारी के साथ कार्य किया जा सकता है।`
      : `इस तारीख पर कार्य करते समय अतिरिक्त सावधानी, समय प्रबंधन और दस्तावेजों की दोहरी जांच की सलाह दी जाती है ताकि किसी प्रकार का अनावश्यक विलंब न हो।`;

  const traditionalGuidanceHi =
    compatibilityStatus === 'SUPPORTIVE'
      ? `कार्य का आरंभ अभिजीत मुहूर्त या प्रातः 08:00 से 11:30 के मध्य करें। ${weekdayData.lordHi} का स्मरण कर शुभ रंग के वस्त्र पहनना फलदायी रहेगा।`
      : `महत्वपूर्ण कागजी कार्रवाई दिन के प्रथम पहर में पूर्ण करें और जल्दबाजी में कोई भी मौखिक वादा करने से बचें।`;

  const transitMatchingAspectHi = `Personal Year #${personalYear} • Personal Month #${personalMonth} • Personal Day #${personalDay} (${weekdayData.lordHi} शासित ${weekdayData.nameHi})`;

  return {
    dateFormatted,
    isoDate,
    day,
    month,
    year,
    weekday: weekdayData.nameEn,
    weekdayHi: weekdayData.nameHi,
    weekdayNumber: weekdayData.planetNumber,
    weekdayLord: weekdayData.lordHi,
    dateNumber,
    compoundNumber,
    rootNumber,
    personalYear,
    personalMonth,
    personalDay,
    personalDayThemeHi,
    compatibilityStatus,
    compatibilityStatusHi,
    compatibilityScore: finalScore,
    purposeScore,
    whyThisDateHi,
    supportingFactorsHi: supportingFactors.length > 0 ? supportingFactors : ['सामान्य ग्रहीय संतुलन'],
    cautionFactorsHi: cautionFactors.length > 0 ? cautionFactors : ['अनावश्यक जल्दबाजी से बचें'],
    traditionalGuidanceHi,
    transitMatchingAspectHi
  };
}

/**
 * Scan a date range or full month
 */
export function scanLuckyDates(
  userDob: string,
  purposeKey: LuckyDatesPurposeKey,
  options?: {
    month?: number;
    year?: number;
    startDate?: string; // DD/MM/YYYY or YYYY-MM-DD
    endDate?: string; // DD/MM/YYYY or YYYY-MM-DD
    preferredWeekdays?: number[];
    preferredNumbers?: number[];
    partnerDob?: string;
    userName?: string;
  }
): LuckyDatesFinderReport {
  const parsedDob = parseIndianDate(userDob);
  const mulank = parsedDob ? reduceToDigit(parsedDob.day) : 1;
  const bhagyank = calculateBhagyank(userDob);
  const mulankProfile = NUMBER_PROFILES[mulank] || NUMBER_PROFILES[1];
  const bhagyankProfile = NUMBER_PROFILES[bhagyank] || NUMBER_PROFILES[1];

  const now = new Date();
  const currentYear = options?.year || (parsedDob ? now.getFullYear() : 2026);
  const currentMonth = options?.month || now.getMonth() + 1;

  const currentPersonalYear = calculatePersonalYearNumber(userDob, currentYear);
  const currentPersonalMonth = reduceToDigit(currentPersonalYear + currentMonth);

  const pyThemes: Record<number, string> = {
    1: 'नई पहल, स्वतंत्रता, बीज बोने व नई दिशा का वर्ष',
    2: 'धैर्य, सहयोग, संबंध प्रगाढ़ता व संतुलन का वर्ष',
    3: 'उमंग, सामाजिक सक्रियता, रचनात्मकता व अभिव्यक्ति का वर्ष',
    4: 'कठोर परिश्रम, नियम, संगठन व ठोस नींव का वर्ष',
    5: 'परिवर्तन, नई यात्राएं, व्यापारिक विस्तार व स्वतंत्रता का वर्ष',
    6: 'पारिवारिक दायित्व, विवाह, घर-सज्जा व संबंधों का वर्ष',
    7: 'आत्म-मंथन, शोध, एकांत अध्ययन व आध्यात्मिक उन्नति का वर्ष',
    8: 'आर्थिक उपलब्धि, शक्ति, कर्म फल व भौतिक विस्तार का वर्ष',
    9: 'पूर्णता, निष्कासन, क्षमा व नई शुरुआत की तैयारी का वर्ष'
  };

  const candidates: CandidateDateAnalysis[] = [];

  // Determine range of days to evaluate
  if (options?.startDate && options?.endDate) {
    const startParsed = parseIndianDate(options.startDate);
    const endParsed = parseIndianDate(options.endDate);

    if (startParsed && endParsed) {
      const startUtc = new Date(Date.UTC(startParsed.year, startParsed.month - 1, startParsed.day));
      const endUtc = new Date(Date.UTC(endParsed.year, endParsed.month - 1, endParsed.day));

      const curr = new Date(startUtc);
      let limitCount = 0;
      while (curr <= endUtc && limitCount < 90) {
        const cDay = curr.getUTCDate();
        const cMonth = curr.getUTCMonth() + 1;
        const cYear = curr.getUTCFullYear();

        const analysis = analyzeCandidateDate(
          { day: cDay, month: cMonth, year: cYear },
          mulank,
          bhagyank,
          userDob,
          purposeKey,
          options.partnerDob
        );
        candidates.push(analysis);

        curr.setUTCDate(curr.getUTCDate() + 1);
        limitCount++;
      }
    }
  }

  // Fallback to month scan if range not supplied or empty
  if (candidates.length === 0) {
    const daysInM = getDaysInMonth(currentMonth, currentYear);
    for (let d = 1; d <= daysInM; d++) {
      const analysis = analyzeCandidateDate(
        { day: d, month: currentMonth, year: currentYear },
        mulank,
        bhagyank,
        userDob,
        purposeKey,
        options?.partnerDob
      );
      candidates.push(analysis);
    }
  }

  // Filter candidates if preferences applied
  let filteredCandidates = candidates;
  if (options?.preferredWeekdays && options.preferredWeekdays.length > 0) {
    filteredCandidates = filteredCandidates.filter(c => options.preferredWeekdays!.includes(c.weekdayNumber));
  }
  if (options?.preferredNumbers && options.preferredNumbers.length > 0) {
    filteredCandidates = filteredCandidates.filter(
      c => options.preferredNumbers!.includes(c.dateNumber) || options.preferredNumbers!.includes(c.rootNumber)
    );
  }

  // Top supportive dates
  const topSupportiveDates = candidates
    .filter(c => c.compatibilityStatus === 'SUPPORTIVE')
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 8);

  const purposeDef = PURPOSE_DEFINITIONS[purposeKey] || PURPOSE_DEFINITIONS.GENERAL;

  const transitMatchingGrid: TransitMatchingGridData = {
    driverCompatibilityHi: `मूलांक ${mulank} (${mulankProfile.grahaHi}) के साथ अनुकूल तिथियों का प्रत्यक्ष सामंजस्य`,
    conductorCompatibilityHi: `भाग्यांक ${bhagyank} (${bhagyankProfile.grahaHi}) के साथ तारीख के कुल योग का योगफल`,
    personalYearAlignmentHi: `व्यक्तिगत वर्ष #${currentPersonalYear} (${pyThemes[currentPersonalYear] || 'सक्रिय चक्र'})`,
    personalMonthAlignmentHi: `व्यक्तिगत माह #${currentPersonalMonth} के साथ मासिक ऊर्जा प्रवाह`,
    dashaTransitToneHi: 'शनि एवं राहु के गोचर चक्रों के आधार पर स्थिरता एवं सतर्कता का संतुलन'
  };

  const generalSupportingFactorsHi = [
    `मूलांक #${mulank} एवं भाग्यांक #${bhagyank} की मित्र ग्रहीय रश्मियां`,
    `Personal Year #${currentPersonalYear} की दिशा से तालमेल`,
    `${purposeDef.titleHi} के लिए शुभ ग्रह प्रभाव`,
    `सकारात्मक वार (Weekday) और दिन के अधिष्ठाता देव का सहयोग`
  ];

  const generalCautionFactorsHi = [
    'राहुकाल एवं स्थानीय अशुभ मुहूर्तों से परहेज करें',
    'महत्वपूर्ण वित्तीय व कानूनी अनुबंधों को भली-भांति पढ़कर ही हस्ताक्षर करें',
    'केवल अंकों पर निर्भर न रहें, व्यावहारिक तैयारी को सर्वोच्च प्राथमिकता दें'
  ];

  const finalSelectionNotesHi =
    'तारीख का चयन करते समय अपनी व्यावहारिक सुगमता, परिवार के सदस्यों की सहमति और प्रशासनिक नियमों को भी अनिवार्य रूप से ध्यान में रखें। अंकशास्त्र आपके प्रयास को अनुकूल ऊर्जा प्रदान करने का माध्यम है।';

  const mandatoryDisclaimerHi =
    'यह शुभ तारीख चयन रिपोर्ट पारंपरिक वैदिक एवं अंकशास्त्रीय सिद्धांतों पर आधारित है। यह किसी भी कार्य की शत-प्रतिशत सफलता या निश्चित भविष्यफल की गारंटी नहीं देता है। सच्चा परिणाम कर्म, नीति और सकारात्मक प्रयास पर निर्भर करता है।';

  return {
    birthProfile: {
      dob: userDob,
      standardDob: formatDateIndian(userDob),
      mulank,
      bhagyank,
      mulankGraha: mulankProfile.grahaHi,
      bhagyankGraha: bhagyankProfile.grahaHi,
      name: options?.userName
    },
    purpose: purposeKey,
    purposeHi: purposeDef.titleHi,
    dateRangeSummary:
      options?.startDate && options?.endDate
        ? `${formatDateIndian(options.startDate)} से ${formatDateIndian(options.endDate)}`
        : `${String(currentMonth).padStart(2, '0')}/${currentYear}`,
    currentPersonalYear,
    currentPersonalYearThemeHi: pyThemes[currentPersonalYear] || 'सक्रिय वर्ष',
    currentPersonalMonth,
    currentPersonalMonthThemeHi: `Personal Month #${currentPersonalMonth}`,
    candidates: filteredCandidates,
    transitMatchingGrid,
    topSupportiveDates,
    generalSupportingFactorsHi,
    generalCautionFactorsHi,
    finalSelectionNotesHi,
    mandatoryDisclaimerHi
  };
}
