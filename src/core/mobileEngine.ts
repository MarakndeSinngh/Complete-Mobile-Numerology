import { analyzeMobileNumerology, UnifiedMobileAnalysis } from './mobileNumerologyEngine';
export * from './mobileNumerologyEngine';

export function calculateMobileAnalysis(mobileNum: string, mulank: number = 1, bhagyank: number = 1): UnifiedMobileAnalysis {
  return analyzeMobileNumerology(mobileNum, mulank, bhagyank);
}
