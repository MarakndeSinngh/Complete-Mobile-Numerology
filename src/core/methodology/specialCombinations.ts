export interface SpecialGoalCombination {
  goalId: string;
  goalName: string;
  hindiTitle: string;
  patterns: string[];
  description: string;
  traditionalInterpretation: string;
  source: string;
}

export const SPECIAL_GOAL_COMBINATIONS: Record<string, SpecialGoalCombination> = {
  married_life: {
    goalId: 'GOAL_MARRIED_LIFE',
    goalName: 'Good Married Life & Domestic Bliss',
    hindiTitle: 'सुखी दांपत्य जीवन',
    patterns: ['2567', '5666', '5667'],
    description: 'Brings lunar emotional understanding (2), mercurial communication (5), venusian love (6), and ketu spiritual bond (7).',
    traditionalInterpretation: 'Configurations with 2567 or triple 6 flanked by 5 foster enduring marital warmth, mutual loyalty, and domestic elegance.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  education: {
    goalId: 'GOAL_EDUCATION',
    goalName: 'Higher Education & Academic Excellence',
    hindiTitle: 'उच्च शिक्षा और शैक्षणिक सफलता',
    patterns: ['6555', '3569'],
    description: 'Combines Venusian focus (6), triple Mercury (555) for mental calculation, Jupiter (3) for wisdom, and Mars (9) for competitive focus.',
    traditionalInterpretation: 'Auspicious for students pursuing demanding board exams, university admissions, and scholarly research.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  foreign_travel: {
    goalId: 'GOAL_FOREIGN_TRAVEL',
    goalName: 'Foreign Travel & Overseas Opportunities',
    hindiTitle: 'विदेश यात्रा और अंतरराष्ट्रीय अवसर',
    patterns: ['3567', '1113', '3579', '2756'],
    description: 'Unlocks planetary mobility through combinations bridging Jupiter (3), Mercury (5), Venus (6), Ketu (7), and Mars (9).',
    traditionalInterpretation: 'Attracts international work permits, cross-border business expansion, and global relocation.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  health: {
    goalId: 'GOAL_HEALTH',
    goalName: 'Vitality & Traditional Wellness Harmony',
    hindiTitle: 'आरोग्य और जीवन शक्ति',
    patterns: ['3569'],
    description: 'Synthesizes Guru (3) cellular wisdom, Budha (5) nervous agility, Shukra (6) rejuvenation, and Mangal (9) physical stamina.',
    traditionalInterpretation: 'Supports physical stamina and holistic wellness routines. (Traditional supportive symbolism, not a medical cure).',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  relationships: {
    goalId: 'GOAL_RELATIONSHIPS',
    goalName: 'Harmonious Relationships & Social Support',
    hindiTitle: 'मधुर संबंध और सामाजिक सहयोग',
    patterns: ['3567'],
    description: 'Jupiter (3), Mercury (5), Venus (6), and Ketu (7) create a magnetic field of empathy, fair communication, and goodwill.',
    traditionalInterpretation: 'Dissolves social friction, attracting reliable mentors and supportive friends.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  promotion: {
    goalId: 'GOAL_PROMOTION',
    goalName: 'Career Promotion & Corporate Elevation',
    hindiTitle: 'पदोन्नति और करियर में प्रगति',
    patterns: ['4368'],
    description: 'Connects Rahu (4) breakthroughs, Jupiter (3) managerial advice, Venus (6) corporate goodwill, and Saturn (8) executive tenure.',
    traditionalInterpretation: 'Aids candidates aspiring to senior managerial promotions and corporate appraisals.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  luck_factor: {
    goalId: 'GOAL_LUCK_FACTOR',
    goalName: 'Luck Factor & Auspicious Synchronicity',
    hindiTitle: 'भाग्य वृद्धि और शुभ संयोग',
    patterns: ['4566'],
    description: 'Integrates Rahu (4) sudden windfalls, Mercury (5) commercial timing, and Double Venus (66) luxury fortune.',
    traditionalInterpretation: 'Enhances timely opportunities, sudden favors from decision-makers, and smooth project approvals.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  will_power: {
    goalId: 'GOAL_WILL_POWER',
    goalName: 'Will Power, Resolve & Unyielding Focus',
    hindiTitle: 'दृढ़ इच्छाशक्ति और आत्मबल',
    patterns: ['1159'],
    description: 'Combines Double Sun (11) executive determination, Mercury (5) tactical planning, and Mars (9) fearless follow-through.',
    traditionalInterpretation: 'Eliminates procrastination and establishes formidable self-discipline.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  court_case: {
    goalId: 'GOAL_COURT_CASE',
    goalName: 'Legal Defense & Court Case Settlement',
    hindiTitle: 'विधिक रक्षा और न्यायालयीन विवाद निपटारा',
    patterns: ['4488'],
    description: 'Double Rahu (44) strategic acumen coupled with Double Saturn (88) endurance for courtroom litigation.',
    traditionalInterpretation: 'Strengthens stamina during prolonged legal proceedings and complex institutional disputes.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  money_attraction: {
    goalId: 'GOAL_MONEY_ATTRACTION',
    goalName: 'Money Attraction & Financial Abundance',
    hindiTitle: 'धन आकर्षण और वित्तीय समृद्धि',
    patterns: ['3467'],
    description: 'Connects Jupiter (3) wealth wisdom, Rahu (4) large-scale transactions, Venus (6) liquid cash, and Ketu (7) retention.',
    traditionalInterpretation: 'Stimulates revenue streams, lucrative client conversions, and financial liquidity.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  property: {
    goalId: 'GOAL_PROPERTY',
    goalName: 'Property Acquisition & Real Estate Wealth',
    hindiTitle: 'भूमि-भवन और अचल संपत्ति लाभ',
    patterns: ['2588'],
    description: 'Moon (2) residential home comfort, Mercury (5) clean title deeds, and Double Saturn (88) massive earth/land holdings.',
    traditionalInterpretation: 'Classic signature for buying residential land, commercial properties, and immovable estates.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  govt_job: {
    goalId: 'GOAL_GOVT_JOB',
    goalName: 'Government Job & Public Sector Authority',
    hindiTitle: 'सरकारी सेवा और प्रशासनिक अधिकार',
    patterns: ['1458'],
    description: 'Sun (1) sovereign state authority, Rahu (4) competitive exams, Mercury (5) paperwork/interviews, Saturn (8) permanent tenure.',
    traditionalInterpretation: 'Supports aspirants targeting civil services, state commissions, and public sector undertakings.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  construction_house: {
    goalId: 'GOAL_CONSTRUCTION_HOUSE',
    goalName: 'Construction of House & Infrastructure Building',
    hindiTitle: 'गृह निर्माण और भवन विस्तार',
    patterns: ['4568'],
    description: 'Rahu (4) architectural blueprints, Mercury (5) approvals, Venus (6) interior beauty, and Saturn (8) bricks/steel execution.',
    traditionalInterpretation: 'Helps overcome delays in starting, erecting, and completing residential or commercial buildings.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  business_growth: {
    goalId: 'GOAL_BUSINESS_GROWTH',
    goalName: 'Business Growth & Commercial Expansion',
    hindiTitle: 'व्यापार वृद्धि और व्यावसायिक विस्तार',
    patterns: ['1159', '1559'],
    description: 'Sun-Mercury-Mars engines engineered to scale customer acquisition, product turnover, and market dominance.',
    traditionalInterpretation: 'Accelerates trading volumes, dealership networks, and business revenue growth.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  politics: {
    goalId: 'GOAL_POLITICS',
    goalName: 'Political Influence & Mass Leadership',
    hindiTitle: 'राजनीतिक प्रभाव और जनसमर्थन',
    patterns: ['1348'],
    description: 'Sun (1) command, Jupiter (3) party manifesto, Rahu (4) mass crowd mobilization, Saturn (8) electoral perseverance.',
    traditionalInterpretation: 'Aids public candidates, civic activists, and political strategists.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  prosperity: {
    goalId: 'GOAL_PROSPERITY',
    goalName: 'Overall Prosperity & Auspicious Lifestyle',
    hindiTitle: 'समग्र समृद्धि और ऐश्वर्य',
    patterns: ['1668'],
    description: 'Sun (1) status, Double Venus (66) supreme comfort and luxury assets, Saturn (8) permanent stability.',
    traditionalInterpretation: 'Establishes generational family wealth, luxurious residences, and prestigious status.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  peace_of_mind: {
    goalId: 'GOAL_PEACE_OF_MIND',
    goalName: 'Peace of Mind & Mental Tranquility',
    hindiTitle: 'मानसिक शांति और सौहार्द',
    patterns: ['4556', '5151'],
    description: 'Stabilizes the nervous system through harmonious Mercury-Venus balances and rhythmic solar-mercurial pulses.',
    traditionalInterpretation: 'Reduces anxiety, fosters restful sleep, and restores peaceful domestic tranquility.',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  }
};
