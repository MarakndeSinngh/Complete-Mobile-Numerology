import { NumerologyProfile, PlaneAnalysis, ArrowAnalysis } from './types';
import { calculateDriver, calculateBhagyank } from './numerologyEngine';
import { calculateBirthGrid, calculateEnhancedGrid } from './loshuEngine';
import { calculatePlanes } from './planeEngine';
import { calculateArrows } from './arrowEngine';
import { calculateMobileAnalysis } from './mobileEngine';
import { calculateRemedies } from './recommendationEngine';
import { generateExplanations } from './explanationEngine';
import { validateNumerologyCalculation } from './validationEngine';
import { formatReportForPdf, generateExecutiveSummary } from './reportEngine';

// Import existing robust engines to reuse rich descriptions without duplication
import { computeLoshuMasterReport } from '../services/loshuMasterEngine';
import { generateLeoConsultation } from '../services/LeoConsultationEngine';
import {
  analyzeVehicleNumerology,
  analyzeHouseNumerology,
  analyzeBusinessNumerology
} from '../services/premiumModules';
import { calculateAdvancedCompatibility } from '../services/advancedCompatibilityEngine';

// Global cache for calculated profiles
const profileCache = new Map<string, NumerologyProfile>();

export interface CompleteProfileInput {
  dob: string;
  name: string;
  mobile?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  marriageDob?: string;
  vehicleNumber?: string;
  houseNumber?: string;
  businessName?: string;
}

export function generateCompleteNumerologyProfile(input: CompleteProfileInput): NumerologyProfile {
  const {
    dob,
    name,
    mobile = '',
    gender = 'MALE',
    marriageDob = '',
    vehicleNumber = '',
    houseNumber = '',
    businessName = ''
  } = input;

  // Compute a deterministic cache key
  const cacheKey = `${dob || ''}|${name || ''}|${mobile}|${gender}|${marriageDob}|${vehicleNumber}|${houseNumber}|${businessName}`;
  if (profileCache.has(cacheKey)) {
    return profileCache.get(cacheKey)!;
  }

  // 1. Calculate Core Numerology values
  const driver = calculateDriver(dob);
  const bhagyank = calculateBhagyank(dob);
  const birthGrid = calculateBirthGrid(dob);
  const enhancedGrid = calculateEnhancedGrid(dob, name, gender);

  // 2. Reuse rich master report for cohesive profiles
  const masterReport = computeLoshuMasterReport(dob, name, gender, mobile);
  const consultation = generateLeoConsultation(dob, name, gender, mobile);

  // 3. Compute Planes and Arrows
  const planes = calculatePlanes(enhancedGrid, birthGrid, driver, bhagyank);
  const arrows = calculateArrows(enhancedGrid);

  // 4. Calculate present, missing, and repeated digits
  const missingNumbers = Object.keys(birthGrid)
    .map(Number)
    .filter(d => (enhancedGrid[d] || 0) === 0);

  const repeatedNumbers = Object.entries(birthGrid)
    .map(([digit, count]) => ({ digit: parseInt(digit, 10), count }))
    .filter(item => item.count > 1);

  // 5. Mobile analysis
  const mobileData = calculateMobileAnalysis(mobile);

  // 6. Profile structures
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
    suitableIndustries: ['Technology', 'E-commerce', 'Civil Services', 'Real Estate', 'Consultancy'],
    careerPathDetails: masterReport.profiling.thinkingStyle + ' ' + masterReport.profiling.learningStyle,
    strengths: masterReport.gridAnalysis.present.map(d => `Digit ${d} vibrational strength`),
    weaknesses: masterReport.gridAnalysis.missing.map(d => `Missing node ${d}`)
  };

  const finance = {
    wealthCreationStyle: masterReport.wealthPsychology.moneyMindset,
    financialDisciplineScore: masterReport.wealthPsychology.financialDisciplineScore,
    wealthPotentialScore: masterReport.wealthPsychology.wealthPotentialScore,
    moneyBlockages: masterReport.wealthPsychology.spendingBehaviour,
    financialRemedies: masterReport.wealthPsychology.riskTakingBehaviour,
    businessMindset: masterReport.wealthPsychology.moneyMindset,
    businessSuitability: 'Excellent for trade and partnerships matching planetary support.'
  };

  const health = {
    dosha: masterReport.healthAnalysis.primaryDosha,
    secondaryDosha: masterReport.healthAnalysis.secondaryDosha || 'Pitta',
    healthScore: masterReport.healthAnalysis.healthScore,
    stressScore: masterReport.healthAnalysis.stressScore,
    energyScore: masterReport.healthAnalysis.vitalityScore || 75,
    dietaryAdvice: masterReport.healthAnalysis.dietPlan,
    organStrengths: 'High kidney and heart coordination based on current water-metal presence.',
    chakraVibrations: 'Manipura (Solar Plexus) and Anahata (Heart) vibrate at primary frequencies.'
  };

  const relationship = {
    loveLanguage: masterReport.relationshipBehaviour.loveLanguage,
    emotionalNeeds: masterReport.relationshipBehaviour.emotionalNeeds,
    commitmentStyle: masterReport.relationshipBehaviour.commitmentStyle,
    compatibilityAdvice: masterReport.relationshipBehaviour.emotionalCompatibilityStyle,
    harmonyTips: masterReport.relationshipBehaviour.growthSuggestions
  };

  // 7. Core scores block
  const scores = {
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
  const weakPlanes = planes.filter(p => p.status !== 'FULL').map(p => p.name);
  const remedies = calculateRemedies(missingNumbers, weakPlanes, driver, bhagyank);

  // 9. Explanations block
  const explanation = generateExplanations(scores, enhancedGrid, driver, bhagyank);

  // 10. Optional calculations (Marriage, Vehicle, House, Business)
  let compatibility = null;
  if (marriageDob) {
    compatibility = calculateAdvancedCompatibility(
      { name, dob, mobile },
      { name: 'Partner', dob: marriageDob }
    );
  }

  const premiumModules = {
    vehicle: vehicleNumber ? analyzeVehicleNumerology(vehicleNumber, driver) : null,
    house: houseNumber ? analyzeHouseNumerology(houseNumber) : null,
    business: businessName ? analyzeBusinessNumerology(businessName, driver) : null
  };

  // 11. Metadata
  const metadata = {
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    id: `num_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  const profile: Omit<NumerologyProfile, 'pdfData'> & { pdfData: any } = {
    birthGrid,
    enhancedGrid,
    driver,
    bhagyank,
    mobile: mobileData,
    planes,
    arrows,
    missingNumbers,
    repeatedNumbers,
    personality,
    career,
    finance,
    health,
    relationship,
    remedies,
    consultation,
    explanation,
    scores,
    annualForecast: masterReport.reasons, // Matches forecasted year reasons
    compatibility,
    pdfData: null, // Populated below
    metadata,
    // Store premium modules inside the profile object to prevent recalculating
    ...premiumModules
  };

  // Validate the calculated data to safeguard outputs
  validateNumerologyCalculation({
    driver,
    bhagyank,
    birthGrid,
    enhancedGrid,
    planesCount: planes.length,
    arrowsCount: arrows.length,
    scores
  });

  // 12. Format PDF and Report templates
  profile.pdfData = formatReportForPdf(profile);

  // Save to cache
  profileCache.set(cacheKey, profile as NumerologyProfile);

  return profile as NumerologyProfile;
}

export function clearProfileCache() {
  profileCache.clear();
}
