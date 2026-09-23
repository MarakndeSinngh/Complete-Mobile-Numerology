import { generateMedicalNumerologyReport, MedicalReport } from '../services/medicalNumerologyEngine';
import {
  MANDATORY_MEDICAL_WELLNESS_DISCLAIMER,
  MANDATORY_WELLNESS_DISCLAIMER
} from './methodology/wellnessDefinitions';
import {
  analyzeVedicMedicalNumerology,
  CompleteVedicDashaAndMedicalAnalysis,
  DayLordAnalysisResult,
  AyurvedicDoshicConstitution,
  VedicMahadashaStep,
  VedicAntardashaInfo,
  VedicRepeatedNumberDetail
} from './vedicDashaEngine';
import { DashaCompatibilityResult } from './methodology/medicalDefinitions';

export interface MedicalNumerologyAnalysis extends MedicalReport {
  mandatoryDisclaimer: string;
  wellnessSymbolism: {
    planetaryVibration: string;
    elementalBalance: string;
    reflectionPrompts: string[];
  };
  dosha: {
    primary: string;
    secondary: string;
    balanceScore: number;
  };
  dietaryAdvice: string[];
  lifestyleAdvice: string[];

  // Phase 3 Course Additions
  vedicDashaAnalysis: CompleteVedicDashaAndMedicalAnalysis;
  dayLord: DayLordAnalysisResult;
  ayurvedicConstitution: AyurvedicDoshicConstitution;
  mahadashaTimeline: VedicMahadashaStep[];
  currentMahadasha: VedicMahadashaStep;
  upcomingMahadasha: VedicMahadashaStep;
  currentAntardasha: VedicAntardashaInfo;
  dashaCompatibility: DashaCompatibilityResult;
  vedicGridRepeatedNumbers: VedicRepeatedNumberDetail[];
  planetaryBodyParts: CompleteVedicDashaAndMedicalAnalysis['planetaryBodyPartAndDiseases'];
  remediesDietPlan: CompleteVedicDashaAndMedicalAnalysis['remediesDietPlan'];
  vedicRemedies: CompleteVedicDashaAndMedicalAnalysis['vedicRemedies'];
}

export function analyzeMedicalNumerology(dob: string, name?: string): MedicalNumerologyAnalysis {
  const baseReport = generateMedicalNumerologyReport(dob, name || '');
  const vedicDashaAnalysis = analyzeVedicMedicalNumerology(dob, name || '');

  const reflectionPrompts = [
    `आप अपनी दैनिक दिनचर्या में ${vedicDashaAnalysis.ayurvedicConstitution.constitutionTypeHi} को संतुलित करने हेतु शांत लयबद्धता कैसे ला सकते हैं?`,
    `क्या आप अग्नि और वायु तत्वों को संतुलित रखने के लिए पर्याप्त जल (${baseReport.dietRecommendations?.recommendedWaterMl || 2500} मिलीलीटर) पी रहे हैं?`,
    `अपने जन्म वार स्वामी (${vedicDashaAnalysis.dayLord.dayLordPlanetHi} - ${vedicDashaAnalysis.dayLord.birthDayOfWeekHi}) पर सौम्य, शांत प्रकृति-सैर और सात्विक आहार का पालन करें।`
  ];

  return {
    ...baseReport,
    mandatoryDisclaimer: MANDATORY_MEDICAL_WELLNESS_DISCLAIMER,
    wellnessSymbolism: {
      planetaryVibration: `मुख्य रूप से ${vedicDashaAnalysis.dayLord.dayLordPlanetHi} वार स्वामी एवं मूलांक ${vedicDashaAnalysis.mulank} ग्रहीय ऊर्जा द्वारा संचालित।`,
      elementalBalance: `पारंपरिक आयुर्वेदिक ऊर्जा प्रोफ़ाइल: ${vedicDashaAnalysis.ayurvedicConstitution.constitutionTypeHi}।`,
      reflectionPrompts
    },
    dosha: {
      primary: vedicDashaAnalysis.ayurvedicConstitution.compoundDosha,
      secondary: baseReport.secondaryDosha || 'Pitta',
      balanceScore: baseReport.scores.healthScore
    },
    dietaryAdvice: [
      `अनुशंसित सात्विक खाद्य: ${vedicDashaAnalysis.remediesDietPlan.foodsHi.join(', ')}।`,
      `साप्ताहिक उपवास / व्रत: ${vedicDashaAnalysis.remediesDietPlan.fastingHi}`,
      `सावधानी / सुझाव: ${vedicDashaAnalysis.remediesDietPlan.precautionsHi[0] || 'सात्विक आहार लें।'}`,
      `दैनिक जल आवश्यकता: लगभग ${baseReport.dietRecommendations.recommendedWaterMl || 2500} मिलीलीटर शुद्ध जल।`
    ],
    lifestyleAdvice: [
      `सद्कर्म (Good Karma): ${vedicDashaAnalysis.vedicRemedies.goodKarmasHi}`,
      `सजीव ग्रह सेवा (Living Planets): ${vedicDashaAnalysis.vedicRemedies.livingPlanetsHi}`,
      `दैनिक वैदिक उपाय: ${vedicDashaAnalysis.vedicRemedies.remediesHi[0] || 'नियमित ध्यान करें।'}`,
      `प्राणायाम व योग: ${vedicDashaAnalysis.remediesDietPlan.precautionsHi[1] || 'नियमित योग व ध्यान करें।'}`
    ],
    vedicDashaAnalysis,
    dayLord: vedicDashaAnalysis.dayLord,
    ayurvedicConstitution: vedicDashaAnalysis.ayurvedicConstitution,
    mahadashaTimeline: vedicDashaAnalysis.mahadashaTimeline,
    currentMahadasha: vedicDashaAnalysis.currentMahadasha,
    upcomingMahadasha: vedicDashaAnalysis.upcomingMahadasha,
    currentAntardasha: vedicDashaAnalysis.currentAntardasha,
    dashaCompatibility: vedicDashaAnalysis.dashaCompatibility,
    vedicGridRepeatedNumbers: vedicDashaAnalysis.repeatedNumbers,
    planetaryBodyParts: vedicDashaAnalysis.planetaryBodyPartAndDiseases,
    remediesDietPlan: vedicDashaAnalysis.remediesDietPlan,
    vedicRemedies: vedicDashaAnalysis.vedicRemedies
  };
}

export { MANDATORY_MEDICAL_WELLNESS_DISCLAIMER };

