import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface DashaPeriod {
  year: number;
  periodStart: string;
  periodEnd: string;
  mahadashaLord: number;
  antardashaLord: number;
  theme: string;
  careerFocus: string;
  relationshipFocus: string;
  wellnessCaution: string;
  recommendedPractice: string;
}

export interface PersonalYearProfile {
  personalYear: number;
  title: string;
  theme: string;
  career: string;
  finance: string;
  relationship: string;
  learning: string;
  remedy: string;
}

export const PERSONAL_YEAR_DEFINITIONS: Record<number, PersonalYearProfile> = {
  1: {
    personalYear: 1,
    title: 'Year of New Beginnings & Pioneering Ventures (Sun Year)',
    theme: 'Planting seeds, embarking on fresh career trajectories, asserting independence, and personal rebranding.',
    career: 'Start new businesses, launch independent ventures, seek leadership roles, and take bold initiatives.',
    finance: 'Invest in foundational assets and skills; early outlays bring compounded long-term returns.',
    relationship: 'Focus on personal autonomy; establish healthy self-respect and boundaries in romance.',
    learning: 'Learn leadership, public speaking, and executive decision-making.',
    remedy: 'Offer morning water to the Sun; wear gold or ruby red accents on Sundays.'
  },
  2: {
    personalYear: 2,
    title: 'Year of Patience, Diplomacy & Cooperation (Moon Year)',
    theme: 'Nurturing relationships, emotional patience, collaborative alliances, and waiting for seeds to sprout.',
    career: 'Focus on partnerships, teamwork, diplomacy, client retention, and background research rather than aggressive expansion.',
    finance: 'Save liquid capital; avoid impulsive speculative risks; partner with trusted allies.',
    relationship: 'Deep emotional bonding; potential for marriage or healing lingering conflicts.',
    learning: 'Study psychology, interpersonal communication, and meditation.',
    remedy: 'Drink water from a silver tumbler; avoid emotional arguments during full moon phases.'
  },
  3: {
    personalYear: 3,
    title: 'Year of Creative Expansion, Learning & Social Joy (Jupiter Year)',
    theme: 'Social visibility, creative expression, academic achievements, writing, and optimism.',
    career: 'Publish work, take on training or speaking engagements, expand marketing reach, and launch creative campaigns.',
    finance: 'Income expands through knowledge work, media, and consulting; monitor social expenditures.',
    relationship: 'Joyful, communicative, and celebratory; exciting social circle expansion.',
    learning: 'Pursue certifications, deep philosophy, languages, and artistic crafts.',
    remedy: 'Wear yellow on Thursdays; apply saffron/turmeric tilak; support students with books.'
  },
  4: {
    personalYear: 4,
    title: 'Year of Foundation Building, Hard Work & Discipline (Rahu Year)',
    theme: 'System building, disciplined labor, attention to health, legal compliance, and laying permanent bedrock.',
    career: 'Organize operations, streamline tech infrastructure, complete pending backlogs, and secure legal contracts.',
    finance: 'Budget strictly; build emergency savings; invest in tangible systems and tools.',
    relationship: 'Demands patience and practical duty; avoid hasty emotional confrontations.',
    learning: 'Master technical software, data management, and operational mechanics.',
    remedy: 'Feed stray dogs on Saturdays; chant OM RAHAVE NAMAH; organize your work desk.'
  },
  5: {
    personalYear: 5,
    title: 'Year of Dynamic Change, Freedom & Exploration (Mercury Year)',
    theme: 'Rapid transitions, unexpected travel, networking breakthroughs, commercial agility, and versatility.',
    career: 'Pivot career strategy, explore international markets, engage in high-velocity trading, and embrace media.',
    finance: 'High liquidity and sudden commercial gains; stay alert against impulsive speculative gambles.',
    relationship: 'Exciting, spontaneous encounters; needs personal space and intellectual stimulation.',
    learning: 'Learn digital marketing, new languages, and negotiation techniques.',
    remedy: 'Feed green grass to cows on Wednesdays; keep indoor plants in your study.'
  },
  6: {
    personalYear: 6,
    title: 'Year of Family, Domestic Harmony, Luxury & Service (Venus Year)',
    theme: 'Domestic bliss, marriage, renovating the home, caring for family, and aesthetic indulgence.',
    career: 'Excel in design, hospitality, customer relations, healthcare, and creative arts.',
    finance: 'Expenditures on home luxury and family assets; steady compounding of beautiful possessions.',
    relationship: 'Ideal year for marriage, family expansion, and deepening romantic devotion.',
    learning: 'Study interior styling, culinary arts, relationship psychology, and music.',
    remedy: 'Wear clean, fragrant clothes; donate white sweets to young girls on Fridays.'
  },
  7: {
    personalYear: 7,
    title: 'Year of Introspection, Research & Spiritual Awakening (Ketu Year)',
    theme: 'Solitary contemplation, deep R&D, spiritual seeking, sabbatical, and metaphysical insight.',
    career: 'Focus on in-depth research, writing, patent development, and technical diagnostics rather than aggressive sales.',
    finance: 'Maintain conservative investments; avoid unverified speculative joint ventures.',
    relationship: 'Desires quiet emotional companionship; avoid unnecessary social drama.',
    learning: 'Study ancient philosophy, occult sciences, meditation, and advanced analytical research.',
    remedy: 'Worship Lord Ganesha; feed stray animals; practice daily 20-minute meditation.'
  },
  8: {
    personalYear: 8,
    title: 'Year of Material Harvest, Karmic Justice & Executive Power (Saturn Year)',
    theme: 'Harvesting rewards of previous 7 years, executive authority, real estate transactions, and karmic accountability.',
    career: 'Assume senior executive responsibilities, direct large enterprises, negotiate major property deals.',
    finance: 'Major wealth accumulation through long-term investments; strictly uphold financial ethics.',
    relationship: 'Demands mutual maturity, responsibility, and emotional steadfastness.',
    learning: 'Master corporate governance, asset portfolio management, and institutional law.',
    remedy: 'Serve laborers and elderly workers on Saturdays; light mustard oil lamp under Peepal tree.'
  },
  9: {
    personalYear: 9,
    title: 'Year of Completion, Release & Humanitarian Transformation (Mars Year)',
    theme: 'Clearing out old baggage, finishing multi-year projects, forgiveness, charitable giving, and rebirth.',
    career: 'Wrap up stagnant endeavors; resolve pending disputes; prepare clean slate for the next 9-year cycle.',
    finance: 'Settle old debts; clear loans; engage in generous philanthropy.',
    relationship: 'Release toxic ties gracefully; deepen forgiveness and unconditional love with family.',
    learning: 'Practice yoga, forgiveness meditations, and humanitarian service.',
    remedy: 'Recite Hanuman Chalisa; donate red lentils or blankets to homeless shelters on Tuesdays.'
  }
};

// Birthday Anniversary Rule from Course Reference
export function getReferenceYearForDasha(dobDay: number, dobMonth: number, currentYear: number, currentDate: Date = new Date()): number {
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // If birthday in current year has passed
  if (currentMonth > dobMonth || (currentMonth === dobMonth && currentDay >= dobDay)) {
    return currentYear;
  }
  // If birthday has not yet arrived, use previous year's birthday as Dasha origin
  return currentYear - 1;
}

// Register Dasha in methodology registry
methodologyRegistry.registerRule({
  id: 'DASHA_ANNIVERSARY_METHODOLOGY',
  category: 'DASHA',
  ruleName: 'LeoFamily Birthday Anniversary Dasha Transition Rule',
  system: 'LEOFAMILY',
  source: SOURCES.LEOFAMILY_MEDICAL_NUMEROLOGY_PDF,
  description: 'Dasha shifts occur on the native’s actual birthday anniversary rather than arbitrary January 1st calendar shifts.',
  interpretation: 'Aligns planetary Mahadasha/Antardasha cycles with the native’s biological solar cycle.',
  confidence: 95,
  safetyLevel: 'SAFE'
});
