import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface PlaneDefinition {
  id: string;
  name: string;
  hindiName: string;
  type: 'HORIZONTAL' | 'VERTICAL' | 'DIAGONAL';
  digits: number[];
  title: string;
  domain: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careerImpact: string;
  relationshipImpact: string;
  financialImpact: string;
  healthImpact: string;
  remedies: string[];
}

export const MASTER_PLANES: PlaneDefinition[] = [
  // Horizontal Planes
  {
    id: 'PLANE_MIND',
    name: 'Mind Plane',
    hindiName: 'मानसिक तल (मस्तिष्क योग)',
    type: 'HORIZONTAL',
    digits: [4, 9, 2],
    title: 'Mental / Intellectual Plane',
    domain: 'Memory, intellectual analysis, strategic thinking, deep logic',
    description: 'Combines Rahu (4), Mars (9), and Moon (2). Governs memory retention, analytical clarity, intellectual creativity, and capacity to envision vast plans.',
    strengths: ['Remarkable memory retention', 'Sharp analytical intellect', 'Rapid comprehension of complex structures', 'Original strategic insight'],
    weaknesses: ['Mental exhaustion if over-analyzing', 'Sleeplessness due to hyperactive thoughts', 'Critical disposition toward others'],
    careerImpact: 'Exceptional in research, law, data science, strategic planning, writing, and higher architecture.',
    relationshipImpact: 'Values stimulating intellectual conversations; requires mental alignment before emotional surrender.',
    financialImpact: 'Designs high-value business architectures; avoids sloppy financial deals through sharp analysis.',
    healthImpact: 'Monitor nervous exhaustion, eye strain, and head tensions under severe deadlines.',
    remedies: ['Perform Brahmi or Shankhpushpi cooling drinks', 'Practice 10 minutes of silent meditation before bed', 'Keep study desk organized in the North-East']
  },
  {
    id: 'PLANE_EMOTIONAL',
    name: 'Emotional Plane',
    hindiName: 'भावनात्मक तल (हृदय योग)',
    type: 'HORIZONTAL',
    digits: [3, 5, 7],
    title: 'Emotional / Spiritual Plane',
    domain: 'Intuition, emotional intelligence, compassion, spiritual wisdom',
    description: 'Combines Jupiter (3), Mercury (5), and Ketu (7). Governs profound intuitive radar, heart-level empathy, psychic sensitivity, and spiritual balance.',
    strengths: ['Extraordinary intuitive empathy', 'Deep compassion and listening skills', 'Natural healing presence', 'Spiritual balance'],
    weaknesses: ['Vulnerability to absorbing others negative energy', 'Emotional hurt if unreciprocated', 'Over-giving'],
    careerImpact: 'Outstanding in counseling, psychology, healthcare, spiritual leadership, teaching, and human diplomacy.',
    relationshipImpact: 'Deeply romantic, caring, and loyal; creates high-trust domestic sanctuaries.',
    financialImpact: 'Wealth flows through authentic goodwill, ethical enterprise, and compassionate mentorship.',
    healthImpact: 'Heart and digestive sensitivity when carrying emotional burdens; cultivate energetic boundaries.',
    remedies: ['Regular grounding walks near natural water or trees', 'Wear silver or pearl accents for emotional stability', 'Keep green leafy plants in living space']
  },
  {
    id: 'PLANE_PRACTICAL',
    name: 'Practical Plane',
    hindiName: 'व्यावहारिक तल (कर्म योग)',
    type: 'HORIZONTAL',
    digits: [8, 1, 6],
    title: 'Practical / Material Plane',
    domain: 'Physical execution, business management, material reality, grounded action',
    description: 'Combines Saturn (8), Sun (1), and Venus (6). Governs execution tenacity, commercial administration, real estate mastery, and luxury grounding.',
    strengths: ['Relentless execution stamina', 'Practical common sense', 'High financial acumen', 'Capacity to convert abstract ideas into physical reality'],
    weaknesses: ['Can become overly materialistic or skeptical of abstract ideas', 'Risk of workaholism', 'Reluctance to delegate'],
    careerImpact: 'Supreme in corporate executive management, large industries, real estate, manufacturing, finance, and luxury commerce.',
    relationshipImpact: 'Dependable, committed, and protective provider; shows love through security and concrete support.',
    financialImpact: 'Exceptional compounding wealth potential; master of tangible assets and sustainable investments.',
    healthImpact: 'Take care of joint flexibility, back posture, and blood pressure under heavy administrative loads.',
    remedies: ['Practice regular stretching and oil massage (Abhyanga)', 'Spend time in leisure with family without devices', 'Donate footwear to laborers on Saturdays']
  },

  // Vertical Planes
  {
    id: 'PLANE_THOUGHT',
    name: 'Thought Plane',
    hindiName: 'विचार तल (योजना योग)',
    type: 'VERTICAL',
    digits: [4, 3, 8],
    title: 'Thought / Planning Plane',
    domain: 'Long-term vision, procedural architecture, foundational foresight',
    description: 'Combines Rahu (4), Jupiter (3), and Saturn (8). Governs vision casting, architectural frameworks, deep wisdom, and generational planning.',
    strengths: ['Magnificent long-range planning', 'Patience to nurture multi-year projects', 'Systemic and legal insight', 'Strategic foresight'],
    weaknesses: ['Analysis paralysis if execution is delayed', 'Stubborn attachment to predefined blueprints', 'Skepticism of rapid shortcuts'],
    careerImpact: 'Master planners, chief strategy officers, urban architects, legal jurists, and policy makers.',
    relationshipImpact: 'Prefers predictable, stable partnerships with shared long-term family goals.',
    financialImpact: 'Builds enduring generational trust, real estate empires, and secure investment portfolios.',
    healthImpact: 'Prone to mental stiffness or digestive sluggishness; ensure daily physical exercise.',
    remedies: ['Engage in dynamic cardio or athletic exercise to balance heavy thinking', 'Use yellow stationery for planning', 'Keep North-East corner pristine']
  },
  {
    id: 'PLANE_WILL',
    name: 'Will Plane',
    hindiName: 'इच्छाशक्ति तल (संकल्प योग)',
    type: 'VERTICAL',
    digits: [9, 5, 1],
    title: 'Will / Determination Plane',
    domain: 'Unshakeable willpower, persistence, resilience, triumph over obstacles',
    description: 'Combines Mars (9), Mercury (5), and Sun (1). Governs relentless determination, perseverance, mental grit, and refusal to surrender.',
    strengths: ['Iron willpower and mental grit', 'Unstoppable momentum in crisis', 'Confidence to overcome setbacks', 'Leadership by personal example'],
    weaknesses: ['Can become fiercely stubborn or argumentative', 'Difficulty admitting miscalculations', 'Impatience with hesitation'],
    careerImpact: 'Crisis turnaround CEOs, defense leaders, competitive entrepreneurs, and surgical pioneers.',
    relationshipImpact: 'Passionate and protective; requires a partner who respects their sovereign drive.',
    financialImpact: 'High earning capacity through aggressive enterprise and relentless pursuit of market goals.',
    healthImpact: 'Watch for excess internal heat (Pitta), acidity, or burnout; hydrate with coconut water.',
    remedies: ['Practice Sheetali pranayama for cooling', 'Take Sunday morning solar walks', 'Drink water stored in a copper vessel']
  },
  {
    id: 'PLANE_ACTION',
    name: 'Action Plane',
    hindiName: 'कर्म तल (क्रिया योग)',
    type: 'VERTICAL',
    digits: [2, 7, 6],
    title: 'Action / Execution Plane',
    domain: 'Spontaneous action, artistic execution, aesthetic presentation, physical movement',
    description: 'Combines Moon (2), Ketu (7), and Venus (6). Governs rapid translation of feeling into artistic deed, social magnetism, and charismatic performance.',
    strengths: ['Quick reflex action', 'Artistic flair and aesthetic dexterity', 'Social charm and spontaneous engagement', 'High creative output'],
    weaknesses: ['Impulsiveness; acting before thinking through long-term consequences', 'Sensory fatigue', 'Restlessness'],
    careerImpact: 'Flourishes in performing arts, luxury marketing, sports, public events, media production, and culinary arts.',
    relationshipImpact: 'Charming, romantic, and playful; thrives in emotionally vibrant partnerships.',
    financialImpact: 'Attracts sudden opportunities and luxury commissions through personal charisma and performance.',
    healthImpact: 'Guard against sensory exhaustion, dehydration, and irregular sleep hours.',
    remedies: ['Establish a calm bedtime routine', 'Wear white sandalwood fragrance', 'Keep North-West zone clean and airy']
  },

  // Diagonal Planes
  {
    id: 'PLANE_GOLDEN',
    name: 'Golden Success Yog',
    hindiName: 'स्वर्ण राजयोग (गोल्डन प्लेन)',
    type: 'DIAGONAL',
    digits: [4, 5, 6],
    title: 'Golden Raj Yog (4-5-6)',
    domain: 'Supreme material wealth, high status, international prosperity, effortless luck',
    description: 'Combines Rahu (4), Mercury (5), and Venus (6). The most celebrated wealth and commercial yog in Indian numerology. Delivers supreme luxury, prosperity, brand equity, and business success.',
    strengths: ['Effortless wealth attraction', 'Magnetic public appeal', 'Outstanding business acumen', 'Global networking flair'],
    weaknesses: ['Can become complacent if wealth arrives too easily', 'Risk of luxury extravagance', 'Envy from competitors'],
    careerImpact: 'Billionaire entrepreneurship, high-end real estate, venture capital, media empire ownership, and multinational trade.',
    relationshipImpact: 'Generous, lavish, and celebratory partner; enjoys sharing prosperity with family.',
    financialImpact: 'Top-tier wealth creation; multiple compounding income streams and international investments.',
    healthImpact: 'Guard against lifestyle diseases resulting from lavish food and sedentary comfort.',
    remedies: ['Engage in humble philanthropy and feed cows on Wednesdays and Fridays', 'Keep central and south-eastern spaces harmonious', 'Wear emerald or diamond']
  },
  {
    id: 'PLANE_SILVER',
    name: 'Silver Yog',
    hindiName: 'रजत योग (सिल्वर प्लेन)',
    type: 'DIAGONAL',
    digits: [2, 5, 8],
    title: 'Silver Raj Yog / Property Yog (2-5-8)',
    domain: 'Real estate, land ownership, emotional stability, permanent property accumulation',
    description: 'Combines Moon (2), Mercury (5), and Saturn (8) - all Earth-related/grounding numbers in Lo Shu. Known as the supreme Property and Real Estate Yog. Guarantees acquisition of lands, buildings, and emotional grounding.',
    strengths: ['Massive property accumulation power', 'Enduring patience and emotional stability', 'Shrewd land valuation instincts', 'Compounding wealth security'],
    weaknesses: ['Slow initial momentum before compounding takes off', 'Over-cautious asset hoarding', 'Resistance to liquid flexibility'],
    careerImpact: 'Real estate developers, property syndicates, architects, civil infrastructure moguls, and institutional asset managers.',
    relationshipImpact: 'Grounding, dependable, and nurturing partner who builds permanent family homes.',
    financialImpact: 'Unshakeable real estate holdings, land appreciation, and physical asset dominance.',
    healthImpact: 'Maintain joint mobility and avoid heavy, sluggish diets; engage in daily walking.',
    remedies: ['Honor mother and elderly laborers', 'Keep the South-West (Earth) corner of home heavy and grounded', 'Keep a yellow or earth-toned crystal (Citrine/Yellow Jasper)']
  }
];

// Register all planes in methodology registry
MASTER_PLANES.forEach((plane) => {
  const rule: MethodologyRule = {
    id: plane.id,
    category: 'PLANE',
    ruleName: `${plane.name} (${plane.hindiName}) [${plane.digits.join('-')}]`,
    system: 'LEOFAMILY',
    source: SOURCES.LEOFAMILY_CORE,
    description: plane.description,
    interpretation: plane.title,
    confidence: 100,
    safetyLevel: 'SAFE',
    details: plane
  };
  methodologyRegistry.registerRule(rule);
});
