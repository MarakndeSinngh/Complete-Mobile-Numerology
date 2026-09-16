import { NumerologyProfile } from './types';
import { formatDateIndian } from '../utils/dateUtils';

export function formatReportForPdf(profile: Omit<NumerologyProfile, 'pdfData'>) {
  return {
    title: `Premium Numerology Consultation - ${profile.personality.title}`,
    recipient: profile.personality.publicImage,
    generatedDate: formatDateIndian(new Date()),
    driver: profile.driver,
    bhagyank: profile.bhagyank,
    scores: profile.scores,
    primaryArchetype: profile.personality.title,
    primaryMantra: profile.personality.mantra,
    remediesText: profile.remedies.remedyText,
    missingDigits: profile.missingNumbers,
    remedyDays: profile.remedies.luckyDays,
    remedyGems: profile.remedies.gemstones
  };
}

export function generateExecutiveSummary(profile: Omit<NumerologyProfile, 'pdfData'>) {
  return {
    cardTitle: `${profile.personality.title} (Mulank ${profile.driver} • Bhagyank ${profile.bhagyank})`,
    overallBalance: `${profile.scores.overallLoshuScore}% Overall Alignment`,
    summaryText: profile.personality.description,
    primaryAdvice: profile.remedies.remedyText
  };
}
