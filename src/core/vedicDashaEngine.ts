import {
  DAY_LORD_MAPPINGS,
  DayLordInfo,
  NUMBER_DOSHA_MAP,
  DOSHA_DETAILS,
  PLANET_BODY_PARTS_DISEASES,
  REMEDIES_DIET_PLANS,
  VEDIC_REMEDIES_MAP,
  getDashaCompatibility,
  DashaCompatibilityResult,
  MANDATORY_MEDICAL_WELLNESS_DISCLAIMER
} from './methodology/medicalDefinitions';
import { reduceToSingleDigit } from './numerologyEngine';
import { parseIndianDate } from './dateUtils';

export interface VedicMahadashaStep {
  cycleIndex: number;
  periodIndex: number;
  lordNumber: number;
  planetEn: string;
  planetHi: string;
  durationYears: number;
  startYear: number;
  endYear: number;
  startDate: string; // DD/MM/YYYY
  endDate: string;   // DD/MM/YYYY
  ageStart: number;
  ageEnd: number;
  calculationFormula: string;
  isCurrent: boolean;
  isUpcoming: boolean;
  themeHi: string;
  sourceDocument: string;
  pageNumber: number;
}

export interface VedicAntardashaInfo {
  lordNumber: number;
  planetEn: string;
  planetHi: string;
  startDate: string;
  endDate: string;
  calculationFormula: string;
  traditionalInterpretationHi: string;
  sourceDocument: string;
  pageNumber: number;
}

export interface VedicRepeatedNumberDetail {
  number: number;
  frequency: number;
  planetHi: string;
  traditionalSignificanceHi: string;
  relevantDashaContextHi: string;
  sourceDocument: string;
  pageNumber: number;
}

export interface AyurvedicDoshicConstitution {
  dayNumber: number;
  digit1?: number;
  digit1Dosha?: string;
  digit2?: number;
  digit2Dosha?: string;
  compoundRoot: number;
  compoundDosha: string;
  constitutionType: 'Single-Doshic' | 'Bi-Doshic' | 'Tri-Doshic';
  constitutionTypeHi: string;
  explanationHi: string;
  balancedQualitiesHi: string[];
  imbalancedSymptomsHi: string[];
  sourceDocument: string;
  pageNumber: number;
}

export interface DayLordAnalysisResult {
  birthDayOfWeek: string;
  birthDayOfWeekHi: string;
  dayLordNumber: number;
  dayLordPlanet: string;
  dayLordPlanetHi: string;
  dayDashaFormula: string;
  dayDashaResultNumber: number;
  dayDashaPlanetHi: string;
  dashaStartRuleLabel: string;
  dashaStartReferenceDate: string;
  sourceDocument: string;
  pageNumber: number;
  methodology: string;
}

export interface CompleteVedicDashaAndMedicalAnalysis {
  mulank: number;
  bhagyank: number;
  standardDOB: string;
  dayLord: DayLordAnalysisResult;
  ayurvedicConstitution: AyurvedicDoshicConstitution;
  vedicMatrix: number[][];
  vedicGridCounts: Record<number, number>;
  repeatedNumbers: VedicRepeatedNumberDetail[];
  mahadashaTimeline: VedicMahadashaStep[];
  currentMahadasha: VedicMahadashaStep;
  upcomingMahadasha: VedicMahadashaStep;
  currentAntardasha: VedicAntardashaInfo;
  dashaCompatibility: DashaCompatibilityResult;
  planetaryBodyPartAndDiseases: typeof PLANET_BODY_PARTS_DISEASES[1];
  remediesDietPlan: typeof REMEDIES_DIET_PLANS[1];
  vedicRemedies: typeof VEDIC_REMEDIES_MAP[1];
  mandatoryDisclaimer: string;
  sourceCitations: {
    dashaSource: string;
    dayLordSource: string;
    ayurvedaSource: string;
    remediesSource: string;
    methodology: string;
  };
}

const PLANET_NAMES_HI: Record<number, string> = {
  1: 'सूर्य (Surya)',
  2: 'चंद्रमा (Chandra)',
  3: 'बृहस्पति / गुरु (Guru)',
  4: 'राहु (Rahu)',
  5: 'बुध (Budha)',
  6: 'शुक्र (Shukra)',
  7: 'केतु (Ketu)',
  8: 'शनि (Shani)',
  9: 'मंगल (Mangal)'
};

const PLANET_NAMES_EN: Record<number, string> = {
  1: 'Sun',
  2: 'Moon',
  3: 'Jupiter',
  4: 'Rahu',
  5: 'Mercury',
  6: 'Venus',
  7: 'Ketu',
  8: 'Saturn',
  9: 'Mars'
};

const DAY_NAMES_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Computes Day Lord & Day Dasha using Course Formula (Day 2 PDF Page 1)
 */
export function calculateDayLordAndDayDasha(dobStr: string, currentDate: Date = new Date()): DayLordAnalysisResult {
  const { day, month, year } = parseStandardDate(dobStr);
  const birthDateObj = new Date(year, month - 1, day);
  const dayOfWeekIndex = birthDateObj.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday

  const dayInfo: DayLordInfo = DAY_LORD_MAPPINGS[dayOfWeekIndex] || DAY_LORD_MAPPINGS[0];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Dasha Start-Date Rule from Course (Day 2 PDF Page 1-2):
  // A. If the birthdate in the current year has already passed (ho gaya), take current year birthdate.
  // B. If the birthdate in the current year is yet to come (aane wala hai), take previous year birthdate.
  const hasPassed = currentMonth > month || (currentMonth === month && currentDay >= day);
  const refYear = hasPassed ? currentYear : currentYear - 1;
  const refDateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${refYear}`;

  // Formula: Day + Month + Year (Without Century) + Day Lord Number
  const yearWithoutCentury = refYear % 100;
  const dayDashaSum = day + month + yearWithoutCentury + dayInfo.number;
  const dayDashaResultNumber = reduceToSingleDigit(dayDashaSum);

  const formulaStr = `${day} + ${month} + ${yearWithoutCentury} (${refYear} without century) + ${dayInfo.number} (${dayInfo.dayNameHi} स्वामी) = ${dayDashaSum} → ${dayDashaResultNumber}`;

  return {
    birthDayOfWeek: DAY_NAMES_EN[dayOfWeekIndex],
    birthDayOfWeekHi: DAY_NAMES_HI[dayOfWeekIndex],
    dayLordNumber: dayInfo.number,
    dayLordPlanet: dayInfo.graha,
    dayLordPlanetHi: dayInfo.grahaHi,
    dayDashaFormula: formulaStr,
    dayDashaResultNumber,
    dayDashaPlanetHi: PLANET_NAMES_HI[dayDashaResultNumber] || 'सूर्य',
    dashaStartRuleLabel: 'SUPPLIED COURSE METHODOLOGY (Birthday Anniversary Transition)',
    dashaStartReferenceDate: refDateStr,
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1,
    methodology: 'Raajeev Singh Chauhann Course Methodology'
  };
}

/**
 * Calculates Single/Bi/Tri-Doshic Ayurvedic constitution from birthdate digits (Day 1 PDF Pages 4-5)
 */
export function calculateAyurvedicConstitution(dayOfBirth: number): AyurvedicDoshicConstitution {
  const rootNumber = reduceToSingleDigit(dayOfBirth);
  const rootDoshaInfo = NUMBER_DOSHA_MAP[rootNumber];

  if (dayOfBirth <= 9 || dayOfBirth === 10 || dayOfBirth === 20 || dayOfBirth === 30) {
    // Single-Doshic
    const dDetails = DOSHA_DETAILS[rootDoshaInfo.dosha];
    return {
      dayNumber: dayOfBirth,
      compoundRoot: rootNumber,
      compoundDosha: rootDoshaInfo.dosha,
      constitutionType: 'Single-Doshic',
      constitutionTypeHi: `एकदोषज (${rootDoshaInfo.dosha} प्रकृति - Single-Doshic)`,
      explanationHi: `जन्म तिथि ${dayOfBirth} सीधे मूल अंक ${rootNumber} (${rootDoshaInfo.planetHi}) से संबंधित है, जो स्पष्ट रूप से ${rootDoshaInfo.doshaHi} की प्रधानता दर्शाती है।`,
      balancedQualitiesHi: dDetails.balancedQualitiesHi,
      imbalancedSymptomsHi: dDetails.imbalancedSymptomsHi,
      sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
      pageNumber: 5
    };
  }

  // Two digits: e.g. 25 -> 2 and 5 -> 7; 28 -> 2 and 8 -> 1
  const d1 = Math.floor(dayOfBirth / 10);
  const d2 = dayOfBirth % 10;
  const d1Info = NUMBER_DOSHA_MAP[d1];
  const d2Info = NUMBER_DOSHA_MAP[d2];

  const uniqueDoshas = new Set<string>();
  if (d1Info) uniqueDoshas.add(d1Info.dosha);
  if (d2Info) uniqueDoshas.add(d2Info.dosha);
  if (rootDoshaInfo) uniqueDoshas.add(rootDoshaInfo.dosha);

  let cType: 'Single-Doshic' | 'Bi-Doshic' | 'Tri-Doshic' = 'Bi-Doshic';
  let cTypeHi = '';
  if (uniqueDoshas.size === 1) {
    cType = 'Single-Doshic';
    cTypeHi = `एकदोषज (${rootDoshaInfo.dosha} प्रकृति - Single-Doshic)`;
  } else if (uniqueDoshas.size === 2) {
    cType = 'Bi-Doshic';
    cTypeHi = `द्विदोषज (${Array.from(uniqueDoshas).join('-')} प्रकृति - Bi-Doshic)`;
  } else {
    cType = 'Tri-Doshic';
    cTypeHi = 'त्रिदोषज (Vata-Pitta-Kapha समधातु - Tri-Doshic)';
  }

  const dDetails = DOSHA_DETAILS[rootDoshaInfo.dosha];
  const explanationHi = `जन्म तिथि ${dayOfBirth}: अंक ${d1} (${d1Info.dosha}) + अंक ${d2} (${d2Info.dosha}) = मूलांक ${rootNumber} (${rootDoshaInfo.dosha})। यह ${cTypeHi} ऊर्जा संतुलन को निर्मित करता है।`;

  return {
    dayNumber: dayOfBirth,
    digit1: d1,
    digit1Dosha: d1Info ? d1Info.dosha : undefined,
    digit2: d2,
    digit2Dosha: d2Info ? d2Info.dosha : undefined,
    compoundRoot: rootNumber,
    compoundDosha: rootDoshaInfo.dosha,
    constitutionType: cType,
    constitutionTypeHi: cTypeHi,
    explanationHi,
    balancedQualitiesHi: dDetails.balancedQualitiesHi,
    imbalancedSymptomsHi: dDetails.imbalancedSymptomsHi,
    sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
    pageNumber: 4
  };
}

/**
 * Generates Vedic Mahadasha Sequence lifelong from birth year based on Mulank (Day 1 PDF Pages 17-18)
 */
export function generateVedicMahadashaTimeline(
  dobStr: string,
  mulank: number,
  currentDate: Date = new Date()
): {
  timeline: VedicMahadashaStep[];
  currentMahadasha: VedicMahadashaStep;
  upcomingMahadasha: VedicMahadashaStep;
  currentAntardasha: VedicAntardashaInfo;
} {
  const { day, month, year: birthYear } = parseStandardDate(dobStr);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const timeline: VedicMahadashaStep[] = [];
  let currentStartYear = birthYear;
  let currentLord = mulank;
  let ageAcc = 0;
  let stepIndex = 0;
  const maxYearsToCover = 100;

  while (currentStartYear - birthYear <= maxYearsToCover) {
    const duration = currentLord; // Duration in years equals the number itself!
    const endYear = currentStartYear + duration;
    const ageStart = ageAcc;
    const ageEnd = ageAcc + duration;

    const startDateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${currentStartYear}`;
    const endDateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${endYear}`;

    const formulaStr = `${currentStartYear} + ${duration} = ${endYear} (महादशा अंक ${currentLord} - अवधि ${duration} वर्ष)`;

    // Check if active as of currentDate
    // Active if currentDate is >= startDate and < endDate
    const startDateObj = new Date(currentStartYear, month - 1, day);
    const endDateObj = new Date(endYear, month - 1, day);
    const isCurrent = currentDate >= startDateObj && currentDate < endDateObj;

    const themeHi = getMahadashaTheme(currentLord);

    timeline.push({
      cycleIndex: Math.floor(stepIndex / 9) + 1,
      periodIndex: stepIndex + 1,
      lordNumber: currentLord,
      planetEn: PLANET_NAMES_EN[currentLord] || 'Sun',
      planetHi: PLANET_NAMES_HI[currentLord] || 'सूर्य',
      durationYears: duration,
      startYear: currentStartYear,
      endYear,
      startDate: startDateStr,
      endDate: endDateStr,
      ageStart,
      ageEnd,
      calculationFormula: formulaStr,
      isCurrent,
      isUpcoming: false, // set below
      themeHi,
      sourceDocument: 'Medical Numerology Day 1 (Eng & Hindi).pdf',
      pageNumber: 17
    });

    currentStartYear = endYear;
    ageAcc += duration;
    currentLord = (currentLord % 9) + 1; // Cycle sequentially 1 -> 2 -> ... -> 9 -> 1
    stepIndex++;
  }

  // Identify current and upcoming Mahadashas
  let currentIndex = timeline.findIndex((t) => t.isCurrent);
  if (currentIndex === -1) {
    // Fallback if current year is before birth or after 100
    currentIndex = 0;
    timeline[0].isCurrent = true;
  }

  const currentMahadasha = timeline[currentIndex];
  let upcomingMahadasha = timeline[currentIndex + 1];
  if (upcomingMahadasha) {
    upcomingMahadasha.isUpcoming = true;
  } else {
    upcomingMahadasha = currentMahadasha;
  }

  // Calculate Current Antardasha / Annual Dasha
  // Course Rule: Dasha of Current Year based on birthday anniversary
  const hasPassedBirthday = currentMonth > month || (currentMonth === month && currentDay >= day);
  const activeAnnualYear = hasPassedBirthday ? currentYear : currentYear - 1;
  const activeAnnualYearEnd = activeAnnualYear + 1;

  // Antardasha Lord calculation: Day + Month + Active Year (sum reduced)
  const annualSum = day + month + activeAnnualYear;
  const antarLord = reduceToSingleDigit(annualSum);

  const antarStartDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${activeAnnualYear}`;
  const antarEndDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${activeAnnualYearEnd}`;
  const antarFormula = `${day} (Day) + ${month} (Month) + ${activeAnnualYear} (Active Year) = ${annualSum} → ${antarLord}`;
  const antarInterpretation = getAntardashaInterpretation(antarLord, currentMahadasha.lordNumber);

  const currentAntardasha: VedicAntardashaInfo = {
    lordNumber: antarLord,
    planetEn: PLANET_NAMES_EN[antarLord] || 'Sun',
    planetHi: PLANET_NAMES_HI[antarLord] || 'सूर्य',
    startDate: antarStartDate,
    endDate: antarEndDate,
    calculationFormula: antarFormula,
    traditionalInterpretationHi: antarInterpretation,
    sourceDocument: 'Medical Numerology Day 2 (Eng & Hindi).pdf',
    pageNumber: 1
  };

  return {
    timeline,
    currentMahadasha,
    upcomingMahadasha,
    currentAntardasha
  };
}

function getMahadashaTheme(lord: number): string {
  const themes: Record<number, string> = {
    1: 'सूर्य महादशा: आत्म-सम्मान, नेतृत्व, नई पहचान, अधिकार विस्तार एवं स्वतंत्र पहलों का काल।',
    2: 'चंद्रमा महादशा: मानसिक शांति, भावनात्मक संतुलन, सहयोग, पारिवारिक संबंध एवं रचनात्मक संवेदनशीलता।',
    3: 'बृहस्पति महादशा: ज्ञान विस्तार, उच्च शिक्षा, गुरु कृपा, बौद्धिक मार्गदर्शन एवं आध्यात्मिक उन्नति।',
    4: 'राहु महादशा: अचानक परिवर्तन, तकनीकी प्रगति, कूटनीति, लीक से हटकर निर्णय एवं अनुशासन की मांग।',
    5: 'बुध महादशा: व्यापारिक गतिशीलता, संचार कौशल, नेटवर्किंग, नए अवसर एवं त्वरित बौद्धिक निर्णय।',
    6: 'शुक्र महादशा: भौतिक सुख-सुविधाएं, आकर्षण, पारिवारिक सौहार्द, कला, विलासिता एवं संबंधों में प्रगाढ़ता।',
    7: 'केतु महादशा: अंतर्मुखी चिंतन, अनुसंधान, आध्यात्मिक खोज, रहस्य विद्याएं एवं आंतरिक जागरण।',
    8: 'शनि महादशा: कर्म फल, कठोर अनुशासन, धैर्य, संपत्ति निर्माण, प्रशासनिक भार एवं दीर्घकालिक सफलता।',
    9: 'मंगल महादशा: साहस, पराक्रम, उच्च ऊर्जा, खेल/भूमि से जुड़े कार्य एवं त्वरित क्रियान्वयन।'
  };
  return themes[lord] || 'संतुलित ग्रहीय प्रभाव एवं कर्म विकास।';
}

function getAntardashaInterpretation(antarLord: number, mahaLord: number): string {
  const planetHi = PLANET_NAMES_HI[antarLord] || 'ग्रह';
  return `वर्तमान अंतर्दशा स्वामी ${planetHi} (अंक ${antarLord}) हैं। महादशा स्वामी अंक ${mahaLord} के साथ मिलकर यह वर्ष विशेष रूप से आपके निजी कौशल, कार्यशैली और निर्णय क्षमता को प्रभावित कर रहा है।`;
}

/**
 * Analyzes Repeated Numbers in 3x3 Vedic Grid [3 1 9 / 6 7 5 / 2 8 4] (Day 2 PDF Page 2)
 */
export function analyzeVedicGridRepeatedNumbers(
  dobDigits: number[],
  currentMahaLord: number
): {
  counts: Record<number, number>;
  repeated: VedicRepeatedNumberDetail[];
  matrix: number[][];
} {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  dobDigits.forEach((d) => {
    if (d >= 1 && d <= 9) counts[d]++;
  });

  const matrix: number[][] = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];

  const repeated: VedicRepeatedNumberDetail[] = [];

  const repMeanings: Record<number, string> = {
    1: 'सूर्य ऊर्जा की अति-सक्रियता: नेतृत्व व आत्मविश्वास बहुत मजबूत, परंतु कभी-कभी अहम् (Ego) व पित्त गर्मी की वृद्धि।',
    2: 'चंद्रमा का दोहराव: अत्यधिक भावनात्मक संवेदनशीलता, अंतर्ज्ञान तीव्र, परंतु मूड स्विंग्स व कफ असंतुलन की प्रवृत्ति।',
    3: 'गुरु तत्व की बहुलता: ज्ञान, सलाह देने की तीव्र इच्छा, मोटापे या भारी भोजन से सुस्ती की संभावना।',
    4: 'राहु का दोहराव: अप्रत्याशित सोच, तीव्र तकनीकी समझ, परंतु अचानक मानसिक तनाव, अनिद्रा या भ्रम से बचाव रखें।',
    5: 'बुध ऊर्जा का दोहराव: त्वरित वाकपटुता व व्यापारिक बुद्धि, परंतु अत्यधिक सोचने से मानसिक थकान (Burnout) की संभावना।',
    6: 'शुक्र ऊर्जा का दोहराव: सुख-सुविधाओं व सौंदर्य की तीव्र चाह, विलासिता व मीठे खान-पान पर संयम आवश्यक।',
    7: 'केतु ऊर्जा का दोहराव: गहन दार्शनिक एकांत, रहस्यमयी विषयों में रुचि, कभी-कभी अकेलापन या जोड़ों में संवेदनशीलता।',
    8: 'शनि ऊर्जा का दोहराव: असाधारण सहनशक्ति व कठोर परिश्रम, परंतु कार्यों में अत्यधिक विलंब, कठोरता व जोड़ों में दर्द की संभावना।',
    9: 'मंगल ऊर्जा का दोहराव: अत्यधिक उत्साह, तीव्र पराक्रम, परंतु क्रोध, अधीरता व रक्तचाप में उतार-चढ़ाव से सतर्क रहें।'
  };

  for (let num = 1; num <= 9; num++) {
    if (counts[num] > 1) {
      const isDashaActive = num === currentMahaLord;
      const dashaContext = isDashaActive
        ? `यह अंक ${num} वर्तमान सक्रिय महादशा का भी स्वामी है, जिससे इसकी ऊर्जा जीवन में इस समय सबसे अधिक प्रभावशाली है।`
        : `वर्तमान में सक्रिय महादशा अंक ${currentMahaLord} के साथ सामंजस्य बनाकर इस अंक के गुणों को संतुलित रखें।`;

      repeated.push({
        number: num,
        frequency: counts[num],
        planetHi: PLANET_NAMES_HI[num] || `अंक ${num}`,
        traditionalSignificanceHi: repMeanings[num] || `वैदिक ग्रिड में अंक ${num} का ${counts[num]} बार दोहराव है।`,
        relevantDashaContextHi: dashaContext,
        sourceDocument: 'Medical Numerology Day 1 & Day 2 (Eng & Hindi).pdf',
        pageNumber: 2
      });
    }
  }

  return { counts, repeated, matrix };
}

/**
 * Complete Master Medical & Vedic Dasha Analysis
 */
export function analyzeVedicMedicalNumerology(
  dobStr: string,
  name: string = '',
  currentDate: Date = new Date()
): CompleteVedicDashaAndMedicalAnalysis {
  const parsed = parseIndianDate(dobStr) || { day: 1, month: 1, year: 1990 };
  const { day, month, year } = parsed;
  const cleanDigits = dobStr.replace(/[^0-9]/g, '').split('').map(Number);
  const mulank = reduceToSingleDigit(day);
  const bhagyank = reduceToSingleDigit(cleanDigits.reduce((a, b) => a + b, 0));

  const standardDOB = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

  // 1. Day Lord & Day Dasha
  const dayLord = calculateDayLordAndDayDasha(dobStr, currentDate);

  // 2. Ayurvedic Doshic Constitution
  const ayurvedicConstitution = calculateAyurvedicConstitution(day);

  // 3. Vedic Mahadasha & Antardasha
  const { timeline, currentMahadasha, upcomingMahadasha, currentAntardasha } = generateVedicMahadashaTimeline(dobStr, mulank, currentDate);

  // 4. Mahadasha + Antardasha Compatibility
  const dashaCompatibility = getDashaCompatibility(currentMahadasha.lordNumber, currentAntardasha.lordNumber);

  // 5. Vedic 3x3 Grid Repeated Numbers
  const { counts, repeated, matrix } = analyzeVedicGridRepeatedNumbers(cleanDigits, currentMahadasha.lordNumber);

  // 6. Medical / Health Resonances (based on Driver / Mulank)
  const planetaryBodyPartAndDiseases = PLANET_BODY_PARTS_DISEASES[mulank] || PLANET_BODY_PARTS_DISEASES[1];
  const remediesDietPlan = REMEDIES_DIET_PLANS[mulank] || REMEDIES_DIET_PLANS[1];
  const vedicRemedies = VEDIC_REMEDIES_MAP[mulank] || VEDIC_REMEDIES_MAP[1];

  return {
    mulank,
    bhagyank,
    standardDOB,
    dayLord,
    ayurvedicConstitution,
    vedicMatrix: matrix,
    vedicGridCounts: counts,
    repeatedNumbers: repeated,
    mahadashaTimeline: timeline,
    currentMahadasha,
    upcomingMahadasha,
    currentAntardasha,
    dashaCompatibility,
    planetaryBodyPartAndDiseases,
    remediesDietPlan,
    vedicRemedies,
    mandatoryDisclaimer: MANDATORY_MEDICAL_WELLNESS_DISCLAIMER,
    sourceCitations: {
      dashaSource: 'Medical Numerology Day 1 (Eng & Hindi).pdf, Pages 17-18',
      dayLordSource: 'Medical Numerology Day 2 (Eng & Hindi).pdf, Pages 1-2',
      ayurvedaSource: 'Medical Numerology Day 1 (Eng & Hindi).pdf, Pages 1-16',
      remediesSource: 'Medical Numerology Day 2 (Eng & Hindi).pdf, Pages 4-28',
      methodology: 'Raajeev Singh Chauhann Advanced Medical Numerology Methodology'
    }
  };
}
