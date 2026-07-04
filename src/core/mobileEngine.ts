import { analyzeMobileNumberAdvanced } from '../services/AdvancedMobileEngine';

export { analyzeMobileNumberAdvanced };

export function calculateMobileAnalysis(mobileNum: string) {
  if (!mobileNum) {
    return {
      mobileNumber: '',
      modifiedNumber: '',
      compoundTotal: 0,
      reducedTotal: 0,
      rating: 'OK' as const,
      score: 50,
      compoundDetails: {
        compound: 0,
        root: 0,
        title: 'No Data',
        compoundMeaning: 'Enter mobile number for detailed diagnostics.',
        rootMeaning: '',
        combinedMeaning: ''
      },
      pairs: [],
      triples: [],
      frequencies: [],
      dominantPlenaryName: 'None',
      harmony: {
        friendlyCount: 0,
        neutralCount: 0,
        enemyCount: 0,
        friendlyList: [],
        enemyList: [],
        harmonyScore: 50
      },
      categories: {
        wealth: 50,
        career: 50,
        relationships: 50,
        health: 50,
        spiritual: 50
      }
    };
  }
  return analyzeMobileNumberAdvanced(mobileNum);
}
