import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export const MANDATORY_WELLNESS_DISCLAIMER =
  'Traditional numerology/wellness interpretation only. This is not medical diagnosis or medical advice. Consult a licensed medical practitioner for all physical, physiological, or psychiatric concerns. Never discontinue or alter prescribed medical treatments based on numerological interpretations.';

export interface TraditionalWellnessProfile {
  digit: number;
  planetaryRuler: string;
  ayurvedicDosha: 'Pitta (Fire)' | 'Kapha (Water/Earth)' | 'Vata (Air/Ether)' | 'Pitta-Vata' | 'Kapha-Pitta';
  organResonance: string;
  traditionalProneSensitivities: string;
  traditionalBalancingFoods: string[];
  traditionalFastingPractices: string;
  lifestylePractices: string[];
  mindfulnessGuideline: string;
}

export const WELLNESS_DEFINITIONS: Record<number, TraditionalWellnessProfile> = {
  1: {
    digit: 1,
    planetaryRuler: 'Sun (Surya)',
    ayurvedicDosha: 'Pitta (Fire)',
    organResonance: 'Solar plexus, cardiovascular vitality, general physical stamina',
    traditionalProneSensitivities: 'Traditional caution regarding internal body heat, blood pressure sensitivity, and eye fatigue during high stress.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Soaked almonds', 'TRADITIONAL PRACTICE: Fresh pomegranate', 'TRADITIONAL PRACTICE: Cooling coconut water', 'TRADITIONAL PRACTICE: Barley water'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Light Sunday fasting (avoiding excess salt in evening) for solar vitality.',
    lifestylePractices: ['Brisk morning walk facing rising sun', 'Surya Namaskar (Sun Salutations)', 'Adequate hydration in peak sunlight hours'],
    mindfulnessGuideline: 'Cultivate inner calm and practice cooling breathing exercises (Sheetali Pranayama) when under deadline pressure.'
  },
  2: {
    digit: 2,
    planetaryRuler: 'Moon (Chandra)',
    ayurvedicDosha: 'Kapha (Water/Earth)',
    organResonance: 'Fluid balance, stomach, lymphatic circulation, emotional nervous system',
    traditionalProneSensitivities: 'Traditional caution regarding water retention, seasonal respiratory phlegm, and mood anxiety linked with sleep cycles.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Warm water infused with dry ginger', 'TRADITIONAL PRACTICE: Light vegetable broths', 'TRADITIONAL PRACTICE: Soaked raisins'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Light Monday fasting with milk, fruits, or water for mental tranquility.',
    lifestylePractices: ['Drinking water kept in a clean silver cup', 'Regular sleep schedules', 'Avoid staying up past midnight during full moon'],
    mindfulnessGuideline: 'Practice Chandra Bhedana breathing to soothe emotional turbulence and balance intuitive faculties.'
  },
  3: {
    digit: 3,
    planetaryRuler: 'Jupiter (Guru)',
    ayurvedicDosha: 'Kapha-Pitta',
    organResonance: 'Liver metabolism, arterial system, thigh muscles, hip joints',
    traditionalProneSensitivities: 'Traditional caution regarding sluggish hepatic metabolism, dietary indulgence, and blood sugar balance.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Fresh turmeric tea', 'TRADITIONAL PRACTICE: Boiled yellow lentils', 'TRADITIONAL PRACTICE: Soaked fenugreek seeds (Methi)', 'TRADITIONAL PRACTICE: Amla (Indian gooseberry)'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Thursday observance consuming yellow foods and avoiding non-vegetarian meals.',
    lifestylePractices: ['Daily brisk walks of at least 30 minutes', 'Limiting refined sugars and heavy dairy', 'Early dinners before 8:00 PM'],
    mindfulnessGuideline: 'Practice peaceful chanting of Om or Gayatri mantra to harmonize intellectual energy and release mental worry.'
  },
  4: {
    digit: 4,
    planetaryRuler: 'Rahu',
    ayurvedicDosha: 'Vata (Air/Ether)',
    organResonance: 'Central nervous system, breath rhythms, knee joints, skin vitality',
    traditionalProneSensitivities: 'Traditional caution regarding nervous restlessness, unexplained phantom worries, sleep irregularities, and sudden fatigue.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Warm spiced milk with nutmeg before bed', 'TRADITIONAL PRACTICE: Cooked root vegetables with sesame oil', 'TRADITIONAL PRACTICE: Ashwagandha warm tonic'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Saturday light fasting consuming simple vegetarian food for mental grounding.',
    lifestylePractices: ['Strict digital screen curfew at least 1 hour before sleep', 'Daily foot massage with warm sesame oil (Padabhyanga)', 'Walking barefoot on natural soil/lawn'],
    mindfulnessGuideline: 'Practice deep Nadi Shodhana (Alternate Nostril Breathing) to ground electric nervous energy.'
  },
  5: {
    digit: 5,
    planetaryRuler: 'Mercury (Budha)',
    ayurvedicDosha: 'Vata (Air/Ether)',
    organResonance: 'Speech organs, bronchial passages, hands and wrists, cognitive sensory pathways',
    traditionalProneSensitivities: 'Traditional caution regarding nervous exhaustion from multitasking, rapid speech strain, and delicate gut digestion.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Fresh green juices', 'TRADITIONAL PRACTICE: Steamed leafy vegetables', 'TRADITIONAL PRACTICE: Soaked green gram (Moong)', 'TRADITIONAL PRACTICE: Mint and fennel herbal tea'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Wednesday light fruit or vegetable fast to reset intestinal flora.',
    lifestylePractices: ['Mindful chewing of meals in quiet environments without phones', 'Gentle vocal exercises', 'Regular quiet breaks in greenery'],
    mindfulnessGuideline: 'Engage in 10 minutes of silent contemplation (Mauna) during midday transitions.'
  },
  6: {
    digit: 6,
    planetaryRuler: 'Venus (Shukra)',
    ayurvedicDosha: 'Kapha (Water/Earth)',
    organResonance: 'Renal kidneys, throat and vocal chords, endocrine balance, skin hydration',
    traditionalProneSensitivities: 'Traditional caution regarding over-indulgence in rich sweets, kidney hydration balance, and throat irritation.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Adequate pure drinking water', 'TRADITIONAL PRACTICE: Rose petal herbal tea', 'TRADITIONAL PRACTICE: Cucumber and watermelon in season', 'TRADITIONAL PRACTICE: Cardamom seeds'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Friday fasting consuming pure white foods or fruit juices.',
    lifestylePractices: ['Maintaining optimal daily hydration (2.5-3 liters)', 'Regular vocal warm-ups for speakers', 'Natural non-synthetic skincare'],
    mindfulnessGuideline: 'Listen to harmonious classical ragas (such as Raga Bhairavi or Yaman) to soothe heart rhythms.'
  },
  7: {
    digit: 7,
    planetaryRuler: 'Ketu',
    ayurvedicDosha: 'Pitta-Vata',
    organResonance: 'Pineal gland, psychic sensitivity, subconscious dream states, spinal column',
    traditionalProneSensitivities: 'Traditional caution regarding subtle allergies, heightened sensory sensitivity, and mental fatigue from introversion.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Herbal tea with Tulsi (Holy Basil)', 'TRADITIONAL PRACTICE: Warm vegetable soups with black pepper', 'TRADITIONAL PRACTICE: Soaked walnuts for brain health'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Tuesday simple diet avoiding heavy garlic, onions, or stimulants.',
    lifestylePractices: ['Daily silent meditation in a peaceful, clutter-free room', 'Gentle spinal stretches (Bhujangasana, Marjariasana)', 'Spending regular time in unpolluted nature'],
    mindfulnessGuideline: 'Practice Trataka (gentle candle gazing meditation) to strengthen focus and release subconscious tension.'
  },
  8: {
    digit: 8,
    planetaryRuler: 'Saturn (Shani)',
    ayurvedicDosha: 'Vata (Air/Ether)',
    organResonance: 'Skeletal system, bone joints, dental enamel, lower legs and ankles',
    traditionalProneSensitivities: 'Traditional caution regarding joint stiffness, dry skin, constipation tendencies, and cold sensitivity.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Warm water infused with a pinch of black salt and ajwain', 'TRADITIONAL PRACTICE: Sesame seeds (Til) with jaggery in winter', 'TRADITIONAL PRACTICE: Cooked fibrous vegetables and stewed prunes'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Saturday fasting consuming khichdi with black lentils (Urad) or fruit juices.',
    lifestylePractices: ['Daily warm sesame oil massage for knees and joints', 'Avoiding prolonged sitting in frozen air-conditioned rooms', 'Regular gentle walking'],
    mindfulnessGuideline: 'Grounding meditation focusing on the Muladhara (Root) chakra to instill stability and release anxiety.'
  },
  9: {
    digit: 9,
    planetaryRuler: 'Mars (Mangal)',
    ayurvedicDosha: 'Pitta (Fire)',
    organResonance: 'Muscular system, hemoglobin and blood vitality, head and forehead, liver fire',
    traditionalProneSensitivities: 'Traditional caution regarding excess internal body heat, acid reflux, skin eruptions, and sports strain.',
    traditionalBalancingFoods: ['TRADITIONAL PRACTICE: Sweet ripe fruits (papaya, sweet apples)', 'TRADITIONAL PRACTICE: Cooling coriander seed infusion', 'TRADITIONAL PRACTICE: Tender coconut water', 'TRADITIONAL PRACTICE: Soaked sabja (sweet basil) seeds'],
    traditionalFastingPractices: 'TRADITIONAL PRACTICE: Tuesday observance with sweet foods (like jaggery) and avoiding sour/pungent spices.',
    lifestylePractices: ['Regular aerobic physical exercise to burn excess adrenaline', 'Cooling showers after physical exertion', 'Avoiding excessively spicy or fried street food'],
    mindfulnessGuideline: 'Practice Shavasana and deep diaphragmatic belly breathing to release muscular tightness and anger.'
  }
};

// Register wellness in methodology registry
Object.values(WELLNESS_DEFINITIONS).forEach((well) => {
  const rule: MethodologyRule = {
    id: `WELLNESS_ARCHETYPE_${well.digit}`,
    category: 'WELLNESS',
    ruleName: `Traditional Wellness & Lifestyle Balance for Digit ${well.digit} (${well.planetaryRuler})`,
    system: 'LEOFAMILY',
    source: SOURCES.LEOFAMILY_MEDICAL_NUMEROLOGY_PDF,
    description: `Traditional lifestyle reflection for digit ${well.digit}. Resonates with ${well.ayurvedicDosha} dosha.`,
    interpretation: `${MANDATORY_WELLNESS_DISCLAIMER} Organ resonance: ${well.organResonance}.`,
    confidence: 85,
    safetyLevel: 'MANDATORY_DISCLAIMER',
    details: well
  };
  methodologyRegistry.registerRule(rule);
});
