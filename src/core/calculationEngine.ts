import {
  CompleteNumerologyProfile,
  NumerologyProfile,
  PlaneAnalysis,
  ArrowAnalysis,
  ScoreCard
} from './types';
import { calculateMulank, calculateBhagyank } from './numerologyEngine';
import { buildBirthGrid } from './loshuEngine';
import { buildEnhancedGrid, EnhancedLoshuGridResult } from './enhancedLoshuEngine';
import { calculatePlanes } from './planeEngine';
import { calculateArrows } from './arrowEngine';
import { analyzeNumberRepetition, analyzeMissingNumbers } from './numberMeaningEngine';
import { calculateMulankBhagyankRelationship } from './bhagyankEngine';
import { analyzeMobileNumerology } from './mobileNumerologyEngine';
import { analyzeNumeroVastu } from './vastuEngine';
import { analyzeMedicalNumerology } from './medicalNumerologyEngine';
import { analyzeComprehensiveName } from './nameNumerologyEngine';
import { generateDomainInterpretations } from './interpretationEngine';
import { calculateRemedies } from './recommendationEngine';
import { generateExplanations } from './explanationEngine';
import { validateNumerologyCalculation } from './validationEngine';
import { formatReportForPdf } from './reportEngine';
import { formatDateForDisplay, parseIndianDate } from './dateUtils';
import { GRAHA_MAPPING, LEOFAMILY_METHODOLOGY_VERSION } from './methodologyConfig';

import { computeLoshuMasterReport } from '../services/loshuMasterEngine';
import { generateLeoConsultation } from '../services/LeoConsultationEngine';
import {
  analyzeVehicleNumerology,
  analyzeHouseNumerology,
  analyzeBusinessNumerology
} from '../services/premiumModules';
import { calculateAdvancedCompatibility } from '../services/advancedCompatibilityEngine';
import { getCombination81 } from './methodology/combinationDefinitions';
import { MANDATORY_WELLNESS_DISCLAIMER } from './methodology/wellnessDefinitions';
import { analyzeKarmicPatterns } from './karmicEngine';
import { calculateKuaNumber } from './kuaEngine';
import { buildVedicGrid } from './vedicGridEngine';
import { generate90DayActionPlan } from './actionPlanEngine';
import { analyzeVehicleNumerologyPro } from './vehicleEngine';

// Global cache for calculated profiles
const profileCache = new Map<string, CompleteNumerologyProfile>();

export interface CompleteProfileInput {
  dob: string;
  name: string;
  mobile?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  marriageDob?: string;
  vehicleNumber?: string;
  houseNumber?: string;
  businessName?: string;
  facingDirection?: string;
  flatNumber?: string;
  buildingNumber?: string;
  floorNumber?: string | number;
}

export function generateCompleteNumerologyProfile(input: CompleteProfileInput): CompleteNumerologyProfile {
  const {
    dob,
    name,
    mobile = '',
    gender = 'MALE',
    marriageDob = '',
    vehicleNumber = '',
    houseNumber = '',
    businessName = '',
    facingDirection = 'North',
    entranceNumber = ''
  } = input;

  // Compute a deterministic cache key
  const cacheKey = `${dob || ''}|${name || ''}|${mobile}|${gender}|${marriageDob}|${vehicleNumber}|${houseNumber}|${businessName}|${facingDirection}`;
  if (profileCache.has(cacheKey)) {
    return profileCache.get(cacheKey)!;
  }

  // 1. Core Numerology values (strictly Indian/LeoFamily 1-9 reduction)
  const mulank = calculateMulank(dob);
  const bhagyank = calculateBhagyank(dob);
  const driver = mulank;

  // Standardize DOB for display
  const standardDOB = formatDateForDisplay(dob);
  const parsedDate = parseIndianDate(dob);
  const parsedDay = parsedDate.isValid ? parsedDate.day : 1;
  const parsedYear = parsedDate.isValid ? parsedDate.year : 1990;
  const dobDigits = parsedDate.isValid ? parsedDate.digits : [1, 9, 9, 0];
  const compoundDOBSum = dobDigits.reduce((acc, d) => acc + d, 0);

  // 2. Grids
  const birthGrid = buildBirthGrid(dob);
  const enhancedGridResult: EnhancedLoshuGridResult = buildEnhancedGrid(birthGrid, mulank, bhagyank);
  const flatEnhancedGrid = enhancedGridResult.flatGrid;

  // 3. Planes and Arrows (calculated using Enhanced LeoFamily Grid)
  const planes = calculatePlanes(flatEnhancedGrid, birthGrid, mulank, bhagyank);
  const arrows = calculateArrows(flatEnhancedGrid);

  // 4. Repetitions and Missing Numbers
  const repetition = analyzeNumberRepetition(birthGrid, mulank, bhagyank);
  const missingNumbers = analyzeMissingNumbers(enhancedGridResult.effectiveMissingDigits);
  const repeatedNumbers = repetition.map(r => ({ digit: r.digit, count: r.count }));
  const rawMissingNumbers = enhancedGridResult.effectiveMissingDigits;

  // 5. Synthesis & Master profiling
  const synthesis = calculateMulankBhagyankRelationship(mulank, bhagyank);
  const masterReport = computeLoshuMasterReport(dob, name, gender, mobile);
  const consultation = generateLeoConsultation(dob, name, gender, mobile);

  // 6. Dedicated specialized engines
  const vastu = analyzeNumeroVastu({
    dob,
    mulank,
    bhagyank,
    gender,
    houseNumber,
    entranceNumber,
    facingDirection,
    flatNumber: input.flatNumber,
    buildingNumber: input.buildingNumber,
    floor: input.floorNumber,
    mobileNumber: mobile,
    vehicleNumber,
    missingNumbers: rawMissingNumbers
  });

  const medical = analyzeMedicalNumerology(dob, name);
  const mobileAnalysis = mobile ? analyzeMobileNumerology(mobile, mulank, bhagyank, enhancedGridResult.enhancedGridPresence, dobDigits) : undefined;
  const nameNumerology = analyzeComprehensiveName({
    name,
    dob,
    mulank,
    bhagyank,
    mobile,
    birthGrid,
    enhancedGrid: enhancedGridResult.enhancedGridPresence
  });
  const interpretations = generateDomainInterpretations(mulank, bhagyank, synthesis, enhancedGridResult);

  // 7. Profile structural fields
  const personality = {
    title: masterReport.archetype.title,
    description: masterReport.archetype.description,
    reasoning: masterReport.archetype.reasoning,
    mantra: masterReport.archetype.mantra,
    thinkingStyle: masterReport.profiling.thinkingStyle,
    decisionMakingStyle: masterReport.profiling.decisionMakingStyle,
    communicationStyle: masterReport.profiling.communicationStyle,
    learningStyle: masterReport.profiling.learningStyle,
    leadershipStyle: masterReport.profiling.leadershipStyle,
    workStyle: masterReport.profiling.workStyle,
    problemSolvingStyle: masterReport.profiling.problemSolvingStyle,
    stressResponsePattern: masterReport.profiling.stressResponsePattern,
    motivationPattern: masterReport.profiling.motivationPattern,
    selfDisciplineLevel: masterReport.profiling.selfDisciplineLevel,
    confidenceLevel: masterReport.profiling.confidenceLevel,
    publicImage: masterReport.profiling.publicImage,
    personalGrowthAreas: masterReport.profiling.personalGrowthAreas
  };

  const career = {
    potentialScore: masterReport.scores.careerPotentialScore,
    suitableIndustries: interpretations.career.strengths,
    careerPathDetails: interpretations.career.detailedAnalysis,
    strengths: interpretations.career.strengths,
    weaknesses: interpretations.career.growthAreas
  };

  const finance = {
    wealthCreationStyle: masterReport.wealthPsychology.moneyMindset,
    financialDisciplineScore: masterReport.wealthPsychology.financialDisciplineScore,
    wealthPotentialScore: masterReport.wealthPsychology.wealthPotentialScore,
    moneyBlockages: masterReport.wealthPsychology.spendingBehaviour,
    financialRemedies: masterReport.wealthPsychology.riskTakingBehaviour,
    businessMindset: masterReport.wealthPsychology.moneyMindset,
    businessSuitability: 'अनुकूल क्षेत्रों में व्यापारिक और रणनीतिक निवेश के लिए उपयुक्त।'
  };

  const health = {
    dosha: medical.dominantDosha,
    secondaryDosha: medical.secondaryDosha || 'Pitta',
    healthScore: medical.scores.healthScore,
    stressScore: medical.scores.stressScore,
    energyScore: medical.scores.energyScore || 75,
    dietaryAdvice: medical.dietRecommendations.recommendedFoods.slice(0, 3).join(', '),
    organStrengths: medical.healthStrengths.join('; ') || 'संतुलित शारीरिक और जैविक ऊर्जा संचय।',
    chakraVibrations: 'मणिपुर और अनाहत चक्र मुख्य ऊर्जा केंद्रों के रूप में सक्रिय।'
  };

  const relationship = {
    loveLanguage: masterReport.relationshipBehaviour.loveLanguage,
    emotionalNeeds: masterReport.relationshipBehaviour.emotionalNeeds,
    commitmentStyle: masterReport.relationshipBehaviour.commitmentStyle,
    compatibilityAdvice: masterReport.relationshipBehaviour.emotionalCompatibilityStyle,
    harmonyTips: masterReport.relationshipBehaviour.growthSuggestions
  };

  const scores: ScoreCard = {
    mentalStrength: masterReport.scores.mentalStrength,
    emotionalStrength: masterReport.scores.emotionalStrength,
    practicalStrength: masterReport.scores.practicalStrength,
    leadershipScore: masterReport.scores.leadershipScore,
    communicationScore: masterReport.scores.communicationScore,
    spiritualScore: masterReport.scores.spiritualScore,
    relationshipScore: masterReport.scores.relationshipScore,
    careerPotentialScore: masterReport.scores.careerPotentialScore,
    overallLoshuScore: masterReport.scores.overallLoshuScore
  };

  // 8. Remedies
  const weakPlanes = planes.filter(p => p.status !== 'COMPLETE').map(p => p.name);
  const remedies = calculateRemedies(rawMissingNumbers, weakPlanes, mulank, bhagyank);

  // 9. Explanations
  const explanation = generateExplanations(scores, flatEnhancedGrid, mulank, bhagyank);

  // 10. Optional Modules
  let compatibility = null;
  if (marriageDob) {
    compatibility = calculateAdvancedCompatibility(
      { name, dob, mobile },
      { name: 'Partner', dob: marriageDob }
    );
  }

  const karmic = analyzeKarmicPatterns(parsedDay, parsedDay, compoundDOBSum);
  const kua = calculateKuaNumber(parsedYear, gender);
  const vedicGrid = buildVedicGrid(dobDigits);
  const combination81 = getCombination81(mulank, bhagyank);
  const actionPlan90Day = generate90DayActionPlan({
    mulank,
    bhagyank,
    missingNumbers: rawMissingNumbers,
    repeatedNumbers: repeatedNumbers.map(r => r.digit),
    weakPlanes
  });

  const vehicleAnalysis = vehicleNumber ? analyzeVehicleNumerologyPro({
    registrationNumber: vehicleNumber,
    ownerDob: dob,
    ownerName: name,
    mobileNumber: mobile,
    gender
  }) : undefined;

  const premiumModules = {
    vehicle: vehicleNumber ? analyzeVehicleNumerology(vehicleNumber, mulank) : null,
    house: houseNumber ? analyzeHouseNumerology(houseNumber) : null,
    business: businessName ? analyzeBusinessNumerology(businessName, mulank) : null
  };

  // 11. Metadata
  const timestamp = new Date().toISOString();
  const id = `leo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Assemble full CompleteNumerologyProfile
  const profile: CompleteNumerologyProfile = {
    identity: {
      fullName: name,
      normalizedName: name.trim().toUpperCase(),
      dob,
      standardDOB,
      gender,
      mobile
    },
    coreNumbers: {
      mulank,
      bhagyank,
      mulankGraha: GRAHA_MAPPING[mulank]?.nameHi || `Planet ${mulank}`,
      bhagyankGraha: GRAHA_MAPPING[bhagyank]?.nameHi || `Planet ${bhagyank}`,
      synthesis
    },
    loshu: {
      birthGrid,
      enhancedGrid: enhancedGridResult,
      planes,
      arrows,
      repetition,
      missingNumbers,
      scores
    },
    vastu,
    medical,
    nameNumerology,
    nameAnalysis: nameNumerology,
    vedicDasha: medical.vedicDashaAnalysis,
    mobileAnalysis,
    vehicleAnalysis,
    interpretations,
    remedies,
    consultation,
    explanation,
    annualForecast: masterReport.reasons,
    compatibility,
    pdfData: null,
    combination81,
    karmic,
    kua,
    vedicGrid,
    actionPlan90Day,
    disclaimer: MANDATORY_WELLNESS_DISCLAIMER,
    metadata: {
      calculatedAt: timestamp,
      engineVersion: LEOFAMILY_METHODOLOGY_VERSION,
      checksum: `${mulank}-${bhagyank}-${Object.values(birthGrid).join('')}`,
      id
    },

    // Flat compatibility surface for existing dashboard views
    driver: mulank,
    bhagyank,
    birthGrid,
    enhancedGrid: flatEnhancedGrid,
    mobile: mobileAnalysis || masterReport.mobileAnalysis,
    planes,
    arrows,
    missingNumbers: rawMissingNumbers,
    repeatedNumbers,
    personality,
    career,
    finance,
    health,
    relationship,
    scores,
    ...premiumModules
  };

  // Validate calculation data bounds
  validateNumerologyCalculation({
    driver: mulank,
    bhagyank,
    birthGrid,
    enhancedGrid: flatEnhancedGrid,
    planesCount: planes.length,
    arrowsCount: arrows.length,
    scores
  });

  // PDF report formatting
  profile.pdfData = formatReportForPdf(profile);

  // Cache deterministic result
  profileCache.set(cacheKey, profile);

  return profile;
}

export function clearProfileCache() {
  profileCache.clear();
}
