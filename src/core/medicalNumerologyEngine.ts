import { generateMedicalNumerologyReport, MedicalReport } from '../services/medicalNumerologyEngine';
import { MEDICAL_NUMEROLOGY_DISCLAIMER } from './methodologyConfig';

export interface MedicalNumerologyAnalysis extends MedicalReport {
  mandatoryDisclaimer: string;
  wellnessSymbolism: {
    planetaryVibration: string;
    elementalBalance: string;
    reflectionPrompts: string[];
  };
}

export function analyzeMedicalNumerology(dob: string, name?: string): MedicalNumerologyAnalysis {
  const baseReport = generateMedicalNumerologyReport(dob, name || '');

  const reflectionPrompts = [
    `How can you integrate more rhythmic calmness into your daily ${baseReport.dominantDosha} routine?`,
    `Are you drinking adequate fluids (${baseReport.dietRecommendations?.recommendedWaterMl || 2500} ml) to balance your elemental fire and air?`,
    `Reflect on gentle, non-strenuous mindful walks during your planetary day (${baseReport.dietRecommendations?.recommendedFastingDay || 'Wednesday'}).`
  ];

  return {
    ...baseReport,
    mandatoryDisclaimer: MEDICAL_NUMEROLOGY_DISCLAIMER,
    wellnessSymbolism: {
      planetaryVibration: `Governed primarily by ${baseReport.rulerPlanet} planetary symbolism and ${baseReport.prakritiType} constitution.`,
      elementalBalance: `Traditional Ayurvedic energetic profile reflects ${baseReport.dominantDosha} dominance supported by ${baseReport.secondaryDosha}.`,
      reflectionPrompts
    }
  };
}

export { MEDICAL_NUMEROLOGY_DISCLAIMER };
