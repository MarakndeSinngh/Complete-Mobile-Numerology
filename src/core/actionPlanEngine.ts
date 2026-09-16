/**
 * LEOFAMILY 90-DAY STRUCTURED ACTION PLAN ENGINE
 * Three-phase developmental progression:
 * - Days 1–30: Preparation (Audit, grounding, environmental decluttering)
 * - Days 31–60: Remediation (Targeted vibrational harmonization & behavioral adjustments)
 * - Days 61–90: Observation (Monitoring qualitative progress & long-term maintenance)
 */

export interface ActionPlanPhase {
  phase: 'DAYS_1_30' | 'DAYS_31_60' | 'DAYS_61_90';
  title: string;
  focusTheme: string;
  milestones: string[];
  dailyPractices: string[];
  weeklyReviewTarget: string;
}

export interface NinetyDayActionPlan {
  title: string;
  objective: string;
  phases: {
    preparation: ActionPlanPhase;
    remediation: ActionPlanPhase;
    observation: ActionPlanPhase;
  };
  keyHabits: string[];
  cautionAdvice: string;
}

export function generate90DayActionPlan(params: {
  mulank: number;
  bhagyank: number;
  missingNumbers: number[];
  repeatedNumbers: number[];
  weakPlanes: string[];
}): NinetyDayActionPlan {
  const { mulank, bhagyank, missingNumbers, repeatedNumbers } = params;

  const preparation: ActionPlanPhase = {
    phase: 'DAYS_1_30',
    title: 'Phase 1 (Days 1–30): Foundation & Environmental Preparation',
    focusTheme: 'Decluttering workspace, establishing physical sleep/wake rhythm, and baseline self-audit.',
    milestones: [
      'Complete comprehensive workspace and bedroom decluttering (particularly North and East zones).',
      'Audit current mobile contacts and daily screen time; note moments of energy depletion.',
      'Establish a fixed morning wake-up routine aligned with Mulank/Bhagyank planetary rhythms.',
      'Begin daily 10-minute quiet reflection journal tracking decisions and emotional triggers.'
    ],
    dailyPractices: [
      'Morning hydration with room-temperature water before looking at mobile screens.',
      '5 minutes of conscious diaphragmatic breathing (Nadi Shodhana or Sheetali).',
      'Review daily task list and organize by single highest-leverage priority first.'
    ],
    weeklyReviewTarget: 'Sunday evening review: assess weekly mental clarity and eliminate lingering non-essential commitments.'
  };

  const remediation: ActionPlanPhase = {
    phase: 'DAYS_31_60',
    title: 'Phase 2 (Days 31–60): Active Planetary Remediation & Habit Alignment',
    focusTheme: 'Conscious behavioral integration for developmental numbers and targeted lifestyle practices.',
    milestones: [
      missingNumbers.length > 0
        ? `Implement developmental practices for missing digit(s): ${missingNumbers.join(', ')}.`
        : 'Deepen core professional leadership strengths.',
      repeatedNumbers.length > 0
        ? `Incorporate balancing cooling practices for repeated vibration(s): ${repeatedNumbers.join(', ')}.`
        : 'Strengthen collaborative communication in team settings.',
      'Align residential desk or bed orientation toward supportive cardinal directions.',
      'Perform designated weekly charitable acts (e.g. feeding birds/animals or supporting community workers).'
    ],
    dailyPractices: [
      `Recitation of primary harmonizing mantra for Mulank ${mulank} or Bhagyank ${bhagyank}.`,
      'Midday 5-minute pause for posture check, hydration, and vocal relaxation.',
      'Conscious practice of active listening in all family and client conversations.'
    ],
    weeklyReviewTarget: 'Evaluate relationship harmony, financial discipline, and workplace composure.'
  };

  const observation: ActionPlanPhase = {
    phase: 'DAYS_61_90',
    title: 'Phase 3 (Days 61–90): Qualitative Observation & Sustainable Integration',
    focusTheme: 'Consolidating gains, evaluating behavioral shifts, and embedding lifelong practices.',
    milestones: [
      'Review tangible improvements in emotional composure and decision-making speed.',
      'Audit financial cash flow and savings patterns since implementing structured budgeting.',
      'Formalize long-term creative or business projects with clear 12-month roadmaps.',
      'Synthesize personal insights into an updated personal mission statement.'
    ],
    dailyPractices: [
      'Maintain continuous morning mindfulness and physical exercise routine.',
      'Evening gratitude reflection noting 3 constructive progress points of the day.',
      'Sustained clean digital hygiene and evening non-screen buffer before sleep.'
    ],
    weeklyReviewTarget: 'Monthly milestone audit: calibrate remaining year goals with current Personal Year vibrations.'
  };

  return {
    title: 'LeoFamily 90-Day Structured Developmental Roadmap',
    objective: 'To systematically align daily habits, emotional balance, environmental space, and professional focus with your core astro-numerological blueprint.',
    phases: {
      preparation,
      remediation,
      observation
    },
    keyHabits: [
      'Consistent morning wake-up and grounding hydration',
      'Daily 10-minute mindfulness and breath calibration',
      'Clutter-free directional desk alignment',
      'Ethical, purposeful communication in professional transactions'
    ],
    cautionAdvice: 'Traditional numerological framework designed for personal reflection and disciplined habit building. Real progress arises through consistent daily effort, patience, and realistic application rather than passive expectations.'
  };
}
