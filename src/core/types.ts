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
  status: 'FULL' | 'EMPTY' | 'PARTIAL' | 'Complete' | 'Partial' | 'Weak' | 'Missing';
  completionPercentage: number;
  presentDigits: number[];
  missingDigits: number[];
  meaning: string;
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

export interface NumerologyProfile {
  birthGrid: Record<number, number>;
  enhancedGrid: Record<number, number>;
  driver: number;
  bhagyank: number;
  mobile: any; // Mobile analysis object
  planes: PlaneAnalysis[];
  arrows: ArrowAnalysis[];
  missingNumbers: number[];
  repeatedNumbers: { digit: number; count: number }[];
  personality: PersonalityProfile;
  career: CareerProfile;
  finance: FinanceProfile;
  health: HealthProfile;
  relationship: RelationshipProfile;
  remedies: RemedyDetails;
  consultation: any; // Leo Consultation details
  explanation: Record<string, ExplanationDetail>;
  scores: ScoreCard;
  annualForecast: any;
  compatibility: any;
  pdfData: any;
  metadata: {
    timestamp: string;
    version: string;
    id: string;
  };
}
