export interface PersonalDetails {
  name: string;
  dob: string; // YYYY-MM-DD
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  mobile: string;
  email?: string;
}

export interface DOBAnalysis {
  lifePathNumber: number;
  birthNumber: number;
  birthNumberCompound: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  maturityNumber: number;
  attitudeNumber: number;
  pinnacles: number[];
  challenges: number[];
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  missingNumbers: number[];
  karmicDebtNumbers: number[];
  karmicLessons: number[];
}

export interface NameAnalysis {
  chaldeanNumber: number;
  pythagoreanNumber: number;
  indianNumber: number;
  missingNumbers: number[];
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  traits: {
    positive: string[];
    negative: string[];
    careers: string[];
  };
}

export interface MobileAnalysis {
  mobileNumber: string;
  modifiedNumber: string; // Zeros replaced with previous
  compoundTotal: number;
  reducedTotal: number;
  rating: 'EXCELLENT' | 'GOOD' | 'AVOID' | 'CAN GO' | 'OK';
  score: number;
  positionsAudit: { position: number; heading: string; digit: number; description: string }[];
  repeatingAlarms: { digit: number; count: number; meaning: string }[];
  negativePairsAvoid: string[];
  hostileRelationships: { pair: string; title: string; meaning: string }[];
}

export interface CompatibilityReport {
  score: number;
  relationship: string;
  marriage: string;
  friendship: string;
  business: string;
  longTermPotential: string;
}

export interface remediesAdvice {
  colors: string[];
  gemstones: string[];
  nameCorrection: string;
  mobileEndings: string[];
  signatureAdvice: string;
  luckyDates: number[];
  luckyDays: string[];
}
