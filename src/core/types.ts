import { EnhancedLoshuGridResult } from './enhancedLoshuEngine';
import { RepetitionAnalysisResult, MissingNumberAnalysisResult } from './numberMeaningEngine';
import { MulankBhagyankSynthesis } from './bhagyankEngine';
import { UnifiedVastuAnalysis } from './vastuEngine';
import { MedicalNumerologyAnalysis } from './medicalNumerologyEngine';
import { CompleteVedicDashaAndMedicalAnalysis } from './vedicDashaEngine';
import { UnifiedMobileAnalysis } from './mobileNumerologyEngine';
import { ComprehensiveInterpretationReport } from './interpretationEngine';
import { ComprehensiveNameAnalysis } from './nameNumerologyEngine';
import { VehicleNumerologyReport } from './vehicleEngine';
import { BusinessNumerologyReport } from './businessEngine';
import { ChildLuckyNamesReport } from './childNumerologyEngine';
import { LuckyDatesFinderReport } from './luckyDatesEngine';

export interface LoshuGridDigit {
  count: number;
  digits: number[];
}

export interface LoshuGrid {
  [digit: number]: LoshuGridDigit;
}

export interface PlaneAnalysis {
  name: string;
  type: 'HORIZONTAL' | 'VERTICAL' | 'DIAGONAL';
  digits: number[];
  title: string;
  description: string;
  strengthScore: number;
  status: 'FULL' | 'EMPTY' | 'PARTIAL' | 'Complete' | 'Partial' | 'Weak' | 'Missing' | 'COMPLETE';
  completionPercentage: number;
  strengthPercentage?: number;
  presentDigits: number[];
  completeNumbers?: number[];
  missingDigits: number[];
  missingNumbers?: number[];
  presentCount?: number;
  meaning: string;
  interpretation?: string;
  practicalMeaning?: string;
  strengths: string[];
  weaknesses: string[];
  careerImpact: string;
  relationshipImpact: string;
  financialImpact: string;
  healthImpact: string;
  recommendedRemedies: string[];
  sources?: string[];
}

export interface ArrowAnalysis {
  name: string;
  digits: number[];
  type: 'STRENGTH' | 'WEAKNESS';
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  meaning: string;
  strength: string;
  risk: string;
  careerImpact: string;
  relationshipImpact: string;
  remedy: string;
}

export interface PersonalityProfile {
  title: string;
  description: string;
  reasoning: string;
  mantra: string;
  thinkingStyle: string;
  decisionMakingStyle: string;
  communicationStyle: string;
  learningStyle: string;
  leadershipStyle: string;
  workStyle: string;
  problemSolvingStyle: string;
  stressResponsePattern: string;
  motivationPattern: string;
  selfDisciplineLevel: string;
  confidenceLevel: string;
  publicImage: string;
  personalGrowthAreas: string;
}

export interface CareerProfile {
  potentialScore: number;
  suitableIndustries: string[];
  careerPathDetails: string;
  strengths: string[];
  weaknesses: string[];
}

export interface FinanceProfile {
  wealthCreationStyle: string;
  financialDisciplineScore: number;
  wealthPotentialScore: number;
  moneyBlockages: string;
  financialRemedies: string;
  businessMindset: string;
  businessSuitability: string;
}

export interface HealthProfile {
  dosha: string;
  secondaryDosha: string;
  healthScore: number;
  stressScore: number;
  energyScore: number;
  dietaryAdvice: string;
  organStrengths: string;
  chakraVibrations: string;
}

export interface RelationshipProfile {
  loveLanguage: string;
  emotionalNeeds: string;
  commitmentStyle: string;
  compatibilityAdvice: string;
  harmonyTips: string;
}

export interface RemedyDetails {
  colors: string[];
  gemstones: string[];
  luckyDates: number[];
  luckyDays: string[];
  remedyText: string;
  yantras: string[];
  mantras: string[];
}

export interface ScoreCard {
  mentalStrength: number;
  emotionalStrength: number;
  practicalStrength: number;
  leadershipScore: number;
  communicationScore: number;
  spiritualScore: number;
  relationshipScore: number;
  careerPotentialScore: number;
  overallLoshuScore: number;
}

export interface ExplanationDetail {
  score: number;
  reason: string;
  formulaUsed: string;
  numbersUsed: number[];
  source: string;
}

/**
 * Phase 24: Standard CompleteNumerologyProfile
 */
export interface CompleteNumerologyProfile {
  identity: {
    fullName: string;
    normalizedName: string;
    dob: string;
    standardDOB: string; // "DD/MM/YYYY"
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    mobile: string;
  };
  coreNumbers: {
    mulank: number;
    bhagyank: number;
    compoundMulank?: number;
    compoundBhagyank?: number;
    mulankGraha: string;
    bhagyankGraha: string;
    synthesis: MulankBhagyankSynthesis;
  };
  loshu: {
    birthGrid: Record<number, number>;
    enhancedGrid: EnhancedLoshuGridResult;
    planes: PlaneAnalysis[];
    arrows: ArrowAnalysis[];
    repetition: RepetitionAnalysisResult[];
    missingNumbers: MissingNumberAnalysisResult[];
    scores: ScoreCard;
  };
  vastu: UnifiedVastuAnalysis;
  medical: MedicalNumerologyAnalysis;
  nameNumerology?: ComprehensiveNameAnalysis;
  nameAnalysis?: ComprehensiveNameAnalysis;
  vedicDasha?: CompleteVedicDashaAndMedicalAnalysis;
  mobileAnalysis?: UnifiedMobileAnalysis;
  vehicleAnalysis?: VehicleNumerologyReport;
  businessAnalysis?: BusinessNumerologyReport;
  childLuckyNames?: ChildLuckyNamesReport;
  luckyDateAnalysis?: LuckyDatesFinderReport;
  interpretations: ComprehensiveInterpretationReport;
  remedies: RemedyDetails;
  consultation: any;
  explanation: Record<string, ExplanationDetail>;
  annualForecast?: any;
  compatibility?: any;
  pdfData?: any;
  combination81?: any;
  karmic?: any;
  kua?: any;
  vedicGrid?: any;
  actionPlan90Day?: any;
  disclaimer?: string;
  metadata: {
    calculatedAt: string;
    engineVersion: string;
    checksum: string;
    id: string;
  };

  // Backwards compatibility surface for existing dashboard views
  driver: number;
  bhagyank: number;
  birthGrid: Record<number, number>;
  enhancedGrid: Record<number, number>;
  mobile: any;
  planes: PlaneAnalysis[];
  arrows: ArrowAnalysis[];
  missingNumbers: number[];
  repeatedNumbers: { digit: number; count: number }[];
  personality: PersonalityProfile;
  career: CareerProfile;
  finance: FinanceProfile;
  health: HealthProfile;
  relationship: RelationshipProfile;
  scores: ScoreCard;
}

export type NumerologyProfile = CompleteNumerologyProfile;
