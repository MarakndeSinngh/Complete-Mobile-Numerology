import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface ArrowDefinition {
  id: string;
  name: string;
  hindiName: string;
  digits: number[];
  type: 'STRENGTH' | 'WEAKNESS';
  condition: 'ALL_PRESENT' | 'ALL_ABSENT';
  meaning: string;
  strength: string;
  shadow: string;
  careerImpact: string;
  relationshipImpact: string;
  recommendation: string;
}

export const MASTER_ARROWS: ArrowDefinition[] = [
  // Arrows of Strength (Present)
  {
    id: 'ARROW_DETERMINATION',
    name: 'Arrow of Determination',
    hindiName: 'दृढ़ संकल्प बाण (संकल्प तीर)',
    digits: [9, 5, 1],
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when 9 (Mars), 5 (Mercury), and 1 (Sun) are all present in the grid. Endows unrelenting determination, persistence, and refusal to surrender.',
    strength: 'Iron willpower, unstoppable momentum, ability to bounce back from crushing failure.',
    shadow: 'Can become overly stubborn, impatient with slower collaborators, or unyielding.',
    careerImpact: 'Natural CEO, competitive entrepreneur, crisis turnaround leader, and pioneer.',
    relationshipImpact: 'Protective and dedicated; expects equal commitment and mutual respect.',
    recommendation: 'Channel intensity into constructive milestones; practice active listening.'
  },
  {
    id: 'ARROW_INTELLECT',
    name: 'Arrow of Intellect',
    hindiName: 'बुद्धि बाण (ज्ञान तीर)',
    digits: [4, 9, 2],
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when 4 (Rahu), 9 (Mars), and 2 (Moon) are all present in the grid. Bestows exceptional memory, analytical brilliance, and deep intellectual retention.',
    strength: 'Photographic or strong associative memory, sharp reasoning, quick mental calculations.',
    shadow: 'Can lead to mental burnout, over-analyzing simple situations, or intellectual arrogance.',
    careerImpact: 'Flourishes in scientific research, legal drafting, complex systems engineering, and academia.',
    relationshipImpact: 'Requires deep intellectual companionship and stimulating dialogue.',
    recommendation: 'Take digital detox breaks to avoid cognitive exhaustion.'
  },
  {
    id: 'ARROW_PLANNING',
    name: 'Arrow of Planning',
    hindiName: 'योजना बाण (दूरदर्शिता तीर)',
    digits: [4, 3, 8],
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when 4 (Rahu), 3 (Jupiter), and 8 (Saturn) are all present in the grid. Gives magnificent long-range vision, patience, and systemic foresight.',
    strength: 'Architectural planning, procedural discipline, ability to foresee risks years in advance.',
    shadow: 'Risk of procrastination due to waiting for ideal blueprint conditions.',
    careerImpact: 'Urban planner, strategic consultant, institutional architect, and policy director.',
    relationshipImpact: 'Builds secure, multi-generational family structures.',
    recommendation: 'Balance elaborate planning with immediate daily action steps.'
  },
  {
    id: 'ARROW_PRACTICALITY',
    name: 'Arrow of Practicality',
    hindiName: 'व्यावहारिकता बाण (कर्मठ तीर)',
    digits: [8, 1, 6],
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when 8 (Saturn), 1 (Sun), and 6 (Venus) are all present in the grid. Endows practical execution, grounded business sense, and material mastery.',
    strength: 'Grounded common sense, relentless work ethic, excellent resource management.',
    shadow: 'May dismiss abstract, philosophical, or spiritual dimensions if not immediately tangible.',
    careerImpact: 'Real estate tycoon, manufacturing head, CFO, and large corporate builder.',
    relationshipImpact: 'Deeply reliable provider who expresses love through tangible acts and security.',
    recommendation: 'Infuse practical routines with spiritual reflection and family warmth.'
  },
  {
    id: 'ARROW_EMOTIONAL_BALANCE',
    name: 'Arrow of Emotional Balance',
    hindiName: 'भावनात्मक संतुलन बाण (सौहार्द तीर)',
    digits: [3, 5, 7],
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when 3 (Jupiter), 5 (Mercury), and 7 (Ketu) are all present in the grid. Imparts emotional poise, intuitive wisdom, and profound heart equilibrium.',
    strength: 'Natural healing touch, calm composure during emotional storms, compassionate advisory.',
    shadow: 'Can feel burdened by the emotional baggage of friends or colleagues.',
    careerImpact: 'Psychologist, therapist, spiritual mentor, mediator, and human rights advocate.',
    relationshipImpact: 'Creates deep soul-level emotional bonds with partner and children.',
    recommendation: 'Maintain healthy energetic boundaries to preserve personal vitality.'
  },
  {
    id: 'ARROW_SPIRITUALITY',
    name: 'Arrow of Spirituality',
    hindiName: 'आध्यात्मिक बाण (वैराग्य तीर)',
    digits: [3, 5, 7], // Traditional spiritual axis in classical Indian numerology
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when the spiritual axis is energized. Indicates philosophical detachment, love for divine truth, and awakening beyond mundane illusions.',
    strength: 'Inner peace, profound intuition, reverence for cosmic dharma.',
    shadow: 'Risk of world-weariness or neglect of practical financial obligations.',
    careerImpact: 'Spiritual teacher, philosopher, holistic healer, and humanitarian author.',
    relationshipImpact: 'Values purity and truthfulness above social superficialities.',
    recommendation: 'Ground spiritual insights into practical acts of charitable service.'
  },
  {
    id: 'ARROW_ACTIVITY',
    name: 'Arrow of Activity',
    hindiName: 'सक्रियता बाण (स्फूर्ति तीर)',
    digits: [2, 7, 6],
    type: 'STRENGTH',
    condition: 'ALL_PRESENT',
    meaning: 'Formed when 2 (Moon), 7 (Ketu), and 6 (Venus) are all present in the grid. Endows spontaneous action, physical stamina, athletic grace, and artistic expression.',
    strength: 'Quick physical reflexes, charismatic performance, continuous energetic drive.',
    shadow: 'Impatience with slow meetings; acting before complete deliberation.',
    careerImpact: 'Competitive sports, stage acting, luxury PR, event choreography, and emergency response.',
    relationshipImpact: 'Playful, exciting, and romantic partner who keeps romance fresh.',
    recommendation: 'Incorporate calming seated meditation to balance physical restlessness.'
  },

  // Arrows of Challenge (Absence / Missing)
  {
    id: 'ARROW_FRUSTRATION',
    name: 'Arrow of Frustration',
    hindiName: 'हताशा बाण (संघर्ष रेखा)',
    digits: [4, 5, 6],
    type: 'WEAKNESS',
    condition: 'ALL_ABSENT',
    meaning: 'Occurs when all middle diagonal numbers (4-5-6) are absent. Life presents repeated unexpected delays and feeling that rewards arrive after disproportionate struggle.',
    strength: 'Builds profound inner resilience and character under adversity.',
    shadow: 'Chronic feelings of frustration, dissatisfaction with current progress.',
    careerImpact: 'Requires deliberate perseverance to avoid abandoning careers midway.',
    relationshipImpact: 'Must avoid projecting work frustrations onto personal family members.',
    recommendation: 'Activate Mercury (5) or Venus (6) through green and white remedies; worship Lord Ganesha.'
  },
  {
    id: 'ARROW_WEAK_WILL',
    name: 'Arrow of Weak Will',
    hindiName: 'दुर्बल संकल्प बाण (अनिर्णय रेखा)',
    digits: [9, 5, 1],
    type: 'WEAKNESS',
    condition: 'ALL_ABSENT',
    meaning: 'Occurs when the entire vertical central column (9-5-1) is absent. Points to difficulty with self-assertion, perseverance, and follow-through.',
    strength: 'Gentle, accommodating nature that avoids unnecessary friction.',
    shadow: 'Easily persuaded by others; giving up when facing initial resistance.',
    careerImpact: 'Best suited in structured roles with clear oversight rather than solitary entrepreneurial risk.',
    relationshipImpact: 'Needs an encouraging partner who nurtures their self-belief.',
    recommendation: 'Engage in martial arts or competitive exercise; chant Surya mantra daily at dawn.'
  },
  {
    id: 'ARROW_ISOLATION',
    name: 'Arrow of Isolation',
    hindiName: 'एकाकी बाण (अलगाव रेखा)',
    digits: [3, 5, 7],
    type: 'WEAKNESS',
    condition: 'ALL_ABSENT',
    meaning: 'Occurs when the central horizontal emotional plane (3-5-7) is completely missing. Indicates feelings of emotional misunderstanding or difficulty expressing inner feelings.',
    strength: 'Self-sufficient and emotionally self-contained.',
    shadow: 'Risk of loneliness, withholding affection, or feeling emotionally detached.',
    careerImpact: 'Excels in solitary analytical roles but may feel excluded from office politics.',
    relationshipImpact: 'Requires conscious effort to verbally validate partner and express warmth.',
    recommendation: 'Keep indoor flowering plants; engage in community social service.'
  },
  {
    id: 'ARROW_IMPATIENCE',
    name: 'Arrow of Impatience',
    hindiName: 'अधीरता बाण (जल्दबाजी रेखा)',
    digits: [2, 7, 6],
    type: 'WEAKNESS',
    condition: 'ALL_ABSENT',
    meaning: 'Occurs when the action column (2-7-6) is completely absent. Manifests as hesitation to take prompt physical action or restlessness when tasks take time.',
    strength: 'Deeply reflective and cautious before acting.',
    shadow: 'Missed spontaneous opportunities due to over-contemplation.',
    careerImpact: 'Need clear accountability deadlines to ensure timely project delivery.',
    relationshipImpact: 'May delay initiating difficult but necessary relationship conversations.',
    recommendation: 'Set a 5-second countdown rule for immediate daily decisions; wear silver ring.'
  },
  {
    id: 'ARROW_CONFUSION',
    name: 'Arrow of Confusion / Poor Memory',
    hindiName: 'भ्रम बाण (स्मृति क्षीण रेखा)',
    digits: [4, 9, 2],
    type: 'WEAKNESS',
    condition: 'ALL_ABSENT',
    meaning: 'Occurs when the top mental plane (4-9-2) is completely missing. Indicates an area requiring conscious development in structured memory, logic, and strategic planning.',
    strength: 'Intuitive, heart-led decision making rather than cold cerebral calculation.',
    shadow: 'Absent-mindedness with details; difficulty memorizing abstract theoretical data.',
    careerImpact: 'Thrives in creative, experiential, and relational roles; keep checklists for administrative tasks.',
    relationshipImpact: 'Loving and emotionally warm, though may forget dates or minor logistics.',
    recommendation: 'Maintain a physical written planner; consume soaked almonds daily; chant Saraswati mantra.'
  }
];

// Register all arrows in methodology registry
MASTER_ARROWS.forEach((arrow) => {
  const rule: MethodologyRule = {
    id: arrow.id,
    category: 'ARROW',
    ruleName: `${arrow.name} (${arrow.hindiName}) [${arrow.digits.join('-')}]`,
    system: 'LEOFAMILY',
    source: SOURCES.LEOFAMILY_CORE,
    description: arrow.meaning,
    interpretation: arrow.strength,
    confidence: 100,
    safetyLevel: 'SAFE',
    details: arrow
  };
  methodologyRegistry.registerRule(rule);
});
