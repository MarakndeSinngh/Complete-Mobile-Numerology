import { NUMBER_PROFILES } from './numberMeaningEngine';
import { EnhancedLoshuGridResult } from './enhancedLoshuEngine';
import { MulankBhagyankSynthesis } from './bhagyankEngine';

export interface DomainInterpretation {
  domain: string;
  score: number;
  headline: string;
  detailedAnalysis: string;
  strengths: string[];
  growthAreas: string[];
  actionableGuidance: string[];
}

export interface ComprehensiveInterpretationReport {
  personality: DomainInterpretation;
  career: DomainInterpretation;
  wealth: DomainInterpretation;
  relationships: DomainInterpretation;
  healthWellness: DomainInterpretation;
  spirituality: DomainInterpretation;
  synthesisSummary: string;
}

export function generateDomainInterpretations(
  mulank: number,
  bhagyank: number,
  synthesis: MulankBhagyankSynthesis,
  enhancedGrid: EnhancedLoshuGridResult
): ComprehensiveInterpretationReport {
  const pMulank = NUMBER_PROFILES[mulank] || NUMBER_PROFILES[1];
  const pBhagyank = NUMBER_PROFILES[bhagyank] || NUMBER_PROFILES[1];

  const personality: DomainInterpretation = {
    domain: 'Personality & Identity',
    score: 85,
    headline: `${pMulank.grahaHi} Archetype with ${pBhagyank.grahaHi} Destiny Horizon`,
    detailedAnalysis: `Your core individuality is expressed through the vibrant traits of ${pMulank.grahaEn}. ${pMulank.personality} In day-to-day choices, ${synthesis.instinctiveNature}`,
    strengths: pMulank.positiveTraits.slice(0, 4),
    growthAreas: pMulank.shadowTraits.slice(0, 3),
    actionableGuidance: [
      `Anchor your personal presence in ${pMulank.balancedExpression.toLowerCase()}`,
      `Consciously balance ${pMulank.element} elemental currents with regular grounding.`
    ]
  };

  const career: DomainInterpretation = {
    domain: 'Career & Professional Destiny',
    score: 88,
    headline: `Strategic Executive & Commercial Evolution`,
    detailedAnalysis: `Professionally, your path is shaped by the confluence of ${pMulank.grahaEn} (initiation) and ${pBhagyank.grahaEn} (destination). You excel in roles requiring ${pBhagyank.decisionMaking.toLowerCase()}`,
    strengths: [...new Set([...pMulank.career.slice(0, 3), ...pBhagyank.career.slice(0, 3)])],
    growthAreas: ['Balancing rapid personal initiative with institutional patience'],
    actionableGuidance: [
      `Focus on industries directly aligned with your chart: ${pBhagyank.career.slice(0, 3).join(', ')}.`,
      `Leverage personal years governed by ${pBhagyank.grahaEn} for career transitions.`
    ]
  };

  const wealth: DomainInterpretation = {
    domain: 'Wealth & Material Prosperity',
    score: 82,
    headline: `Sustained Asset Creation & Strategic Compounding`,
    detailedAnalysis: `Your wealth psychology reflects ${pMulank.wealth} Supported by ${pBhagyank.business}`,
    strengths: ['Long-term asset creation', 'Commercial acumen', 'Protective family reserves'],
    growthAreas: ['Impulsive investments during volatile market phases'],
    actionableGuidance: [
      `Cultivate wealth through ethical, disciplined compounding.`,
      `Keep financial ledgers organized, especially if digit 4 or 8 is missing.`
    ]
  };

  const relationships: DomainInterpretation = {
    domain: 'Relationships & Family Dynamics',
    score: 80,
    headline: `Loyal Commitment & Mutual Honor`,
    detailedAnalysis: `${pMulank.relationships} Your deeper relational growth lesson is: ${pBhagyank.relationships}`,
    strengths: ['Emotional loyalty', 'Family stewardship', 'Protective generosity'],
    growthAreas: ['Over-protectiveness or expecting partners to mirror your exact pace'],
    actionableGuidance: [
      `Practice open, non-judgmental communication to maintain domestic harmony.`,
      `Honor the sacred space of partners and close collaborators.`
    ]
  };

  const healthWellness: DomainInterpretation = {
    domain: 'Wellness & Energy Vitality',
    score: 78,
    headline: `Holistic Elemental Balance & Vitality`,
    detailedAnalysis: `Symbolically governed by ${pMulank.healthSymbolism}. Sustaining high performance requires rhythmic self-care and respecting bodily limits.`,
    strengths: ['Resilient recuperative reserves', 'Natural vitality'],
    growthAreas: ['Stress accumulation during high-pressure work sprints'],
    actionableGuidance: [
      `Integrate mindful breathing and hydration into daily routines.`,
      `Consult healthcare professionals for any medical needs; use numerology for reflection only.`
    ]
  };

  const spirituality: DomainInterpretation = {
    domain: 'Spiritual Growth & Higher Consciousness',
    score: 90,
    headline: `Inner Light Awakening & Karmic Realization`,
    detailedAnalysis: `${pBhagyank.spirituality} Your spiritual evolution bridges active worldly duty (Karma Yoga) with contemplative realization.`,
    strengths: ['Intuitive discernment', 'Reverence for cosmic order', 'Generous humanitarian spirit'],
    growthAreas: ['Spiritual bypass or cynicism during challenging karmic phases'],
    actionableGuidance: [
      `Engage in daily silent meditation or mantra japa: ${pMulank.remedialTheme}`,
      `Engage in selfless service (Seva) on your planetary day.`
    ]
  };

  const synthesisSummary = `Within the LeoFamily numerology framework, your chart demonstrates a ${synthesis.relationship.toUpperCase()} alignment between Driver ${mulank} and Destiny ${bhagyank}, with ${enhancedGrid.effectivePresentDigits.length} active vibrational coordinates in your enhanced Lo Shu grid.`;

  return {
    personality,
    career,
    wealth,
    relationships,
    healthWellness,
    spirituality,
    synthesisSummary
  };
}
