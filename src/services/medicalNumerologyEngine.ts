import { reduceToSingleDigit } from './numerologyEngine';

export interface HealthScores {
  healthScore: number;
  digestiveScore: number;
  energyScore: number;
  stressScore: number;
  sleepScore: number;
  immunityScore: number;
  mentalWellnessScore: number;
  overallVibration: string;
  reasoning: {
    health: string;
    digestive: string;
    energy: string;
    stress: string;
    sleep: string;
    immunity: string;
    mental: string;
  };
}

export interface MedicalReport {
  driver: number;
  conductor: number;
  compound: number;
  rulerPlanet: string;
  dominantDosha: string;
  secondaryDosha: string;
  doshaComposition: { vata: number; pitta: number; kapha: number };
  prakritiType: string;
  doshaBalanceAnalysis: string;
  physicalTendencies: string[];
  mentalTendencies: string[];
  emotionalTendencies: string[];
  weakBodySystems: string[];
  healthStrengths: string[];
  scores: HealthScores;
  dietRecommendations: {
    recommendedFoods: string[];
    foodsToAvoid: string[];
    recommendedFruits: string[];
    recommendedVegetables: string[];
    recommendedWaterMl: number;
    recommendedFastingDay: string;
  };
  ayurvedicLifestyle: {
    yogaSuggestions: string[];
    pranayamaSuggestions: string[];
    meditationSuggestions: string[];
    lifestyleSuggestions: string[];
    morningRoutine: string;
    sleepRecommendations: string;
  };
}

// Weights map: [vata, pitta, kapha]
const DIGIT_DOSHA_WEIGHTS: Record<number, [number, number, number]> = {
  1: [10, 75, 15],  // Sun - Pitta dominant
  2: [15, 10, 75],  // Moon - Kapha dominant
  3: [10, 45, 45],  // Jupiter - Kapha-Pitta balanced
  4: [70, 20, 10],  // Rahu - Vata dominant, chaotic
  5: [45, 45, 10],  // Mercury - Vata-Pitta dual
  6: [30, 20, 50],  // Venus - Kapha-Vata dual
  7: [55, 15, 30],  // Ketu - Vata-Kapha dual
  8: [80, 10, 10],  // Saturn - Extreme Vata, cold
  9: [10, 80, 10],  // Mars - Extreme Pitta, fiery
};

const PLANET_NAMES: Record<number, string> = {
  1: 'Sun (सूर्य - Sovereign Life Energy)',
  2: 'Moon (चन्द्र - Fluid Consciousness)',
  3: 'Jupiter (गुरु - Expansion, Liver Balance & Wisdom)',
  4: 'Rahu (राहु - Nervous Matrix & Mystery Stressors)',
  5: 'Mercury (बुध - Neural Speed & Speech Coordination)',
  6: 'Venus (शुक्र - Kidney Vitality & Aesthetic Balance)',
  7: 'Ketu (केतु - Cellular Matrix & Psychological Depth)',
  8: 'Saturn (शनि - Bone Integrity & Chronic Resistance)',
  9: 'Mars (मंगल - Blood Iron Energy & Muscle Vitality)'
};

export function generateMedicalNumerologyReport(dobStr: string, name: string = ''): MedicalReport {
  const parts = dobStr.split('-');
  const year = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  const driver = reduceToSingleDigit(day);
  const cleanDob = dobStr.replace(/[^0-9]/g, '');
  const dobSum = cleanDob.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  const conductor = reduceToSingleDigit(dobSum);
  const compound = day;

  // Compute Dosha Percentages
  const driverWeights = DIGIT_DOSHA_WEIGHTS[driver] || [33, 33, 34];
  const conductorWeights = DIGIT_DOSHA_WEIGHTS[conductor] || [33, 33, 34];

  // Combined weights: 60% Driver, 40% Conductor
  const rawVata = (driverWeights[0] * 0.6) + (conductorWeights[0] * 0.4);
  const rawPitta = (driverWeights[1] * 0.6) + (conductorWeights[1] * 0.4);
  const rawKapha = (driverWeights[2] * 0.6) + (conductorWeights[2] * 0.4);

  const total = rawVata + rawPitta + rawKapha;
  const vata = Math.round((rawVata / total) * 100);
  const pitta = Math.round((rawPitta / total) * 100);
  const kapha = 100 - vata - pitta; // ensures sum is exactly 100

  // Sort to find dominant/secondary
  const sorted: { name: string; val: number }[] = [
    { name: 'Vata (वायु-आकाश)', val: vata },
    { name: 'Pitta (अग्नि-जल)', val: pitta },
    { name: 'Kapha (पृथ्वी-जल)', val: kapha }
  ].sort((a, b) => b.val - a.val);

  const dominantDosha = sorted[0].name;
  const secondaryDosha = sorted[1].name;

  let prakritiType = '';
  if (sorted[0].val - sorted[1].val < 15 && sorted[1].val - sorted[2].val < 15) {
    prakritiType = 'Tri-Doshic (Sama Prakriti - Tridosha)';
  } else if (sorted[0].val - sorted[1].val < 15) {
    const partsName = [sorted[0].name.split(' ')[0], sorted[1].name.split(' ')[0]].sort();
    prakritiType = `Bi-Doshic (${partsName.join('-')} dominant)`;
  } else {
    prakritiType = `Single-Doshic (${sorted[0].name.split(' ')[0]} Prakriti)`;
  }

  // Dynamic Analysis based on Prakriti
  let doshaBalanceAnalysis = '';
  if (prakritiType.includes('Tri-Doshic')) {
    doshaBalanceAnalysis = `Your birth chart reflects a rare Sama Dhatu (Tridosha) cellular setup. Vata, Pitta, and Kapha exist in native alignment. While highly adaptive, any sudden climate or schedule modifications disrupt all three doshas simultaneously, calling for a very balanced, non-extreme dietary profile.`;
  } else if (prakritiType.includes('Vata')) {
    if (prakritiType.includes('Pitta')) {
      doshaBalanceAnalysis = `Vata-Pitta dual prakriti represents high mental acuity paired with physical speed. The wind of Vata tends to fan the flames of Pitta, resulting in rapid digestion but sudden physical exhaustion or acidity spikes if high stakes work deadlines are maintained without cooling fluids.`;
    } else if (prakritiType.includes('Kapha')) {
      doshaBalanceAnalysis = `Vata-Kapha dual constitution combines a creative, sensitive mental screen of Vata with the structural water-retentive habits of Kapha. This results in fluctuating joint lubrication and immediate reactions to cold foods. Deep warmth and thermal spices are essential.`;
    } else {
      doshaBalanceAnalysis = `Vata-dominant constitution is governed by the Ether-Air parameters of Saturn (${driver === 8 || conductor === 8 ? '8' : '4'}). Your cellular nervous sheath reacts directly to high stress, inducing digestive gas, body stiff dryness, and light sleeping cycles. Regular warm sesame oil self-massages (Abhyanga) are highly defensive.`;
    }
  } else if (prakritiType.includes('Pitta')) {
    if (prakritiType.includes('Kapha')) {
      doshaBalanceAnalysis = `Pitta-Kapha dual-doshic energy integrates the structural stamina of Kapha with the sharp fire of Pitta. This allows outstanding recovery powers and muscular density. However, stagnation of damp heat can trigger secondary skin rashes or inflammatory responses if excessive red spices are consumed.`;
    } else {
      doshaBalanceAnalysis = `Pitta-dominant constitution is thoroughly fiery, governed directly by Mars (9) or Sun (1). Your Jatharagni (digestive fire) runs hot, demanding timely meals to prevent the acids from attacking stomach walls. High susceptibility to blood pressure spikes, minor skin heat rashes, and direct sharp anger outbreaks.`;
    }
  } else {
    doshaBalanceAnalysis = `Kapha-dominant constitution is thick and water-grounded, governed mainly by Moon (2) or Jupiter (3). This translates as strong structural memory, slow but highly consistent digestion, and peaceful sleep. However, excess fluid accumulation can cause weight retention, heavy mucus congestion during seasonal turns, and mental lethargy.`;
  }

  // Body tendencies and risk mappings based on Driver/Conductor planet
  const pPhys: Record<number, string[]> = {
    1: ['Strong skeletal structure', 'Warm skin temperature', 'Prone to heart palpitation under heat', 'Vulnerable to eye strain or vision issues'],
    2: ['High cellular fluid levels', 'Cold sensitivity', 'Vulnerable to immediate mucous chest congestions', 'Water retention in limbs'],
    3: ['Active fat metabolism', 'High liver-gall secretion sensitivity', 'Prone to weight accumulation in waistline', 'Good physical endurance'],
    4: ['Highly sensitive nervous system', 'Spasmodic digestive cramps', 'Sudden mystery muscle twitches', 'Dry, cold skin texture'],
    5: ['Insensitive neural signal peaks', 'Weak bronchial sheath', 'Highly fluctuating sleep hormone regulation', 'Skin sensitivity to environmental allergies'],
    6: ['Throat and tonsil sensitivity', 'Vulnerable urinary tract filtration', 'High reproductive tissue health', 'Prone to sweet cravings'],
    7: ['Unpredictable allergy reactions', 'Lower bowel flatulence', 'Sudden cold sweat outbreaks', 'Sensitive skin rashes'],
    8: ['Joint dryness and cracking', 'Slow intestinal peristalsis (chronic constipation)', 'Dental bone density fluctuations', 'Cold extremities'],
    9: ['Highly acidic blood parameters', 'Susceptible to nosebleeds or blood heat', 'Muscular inflammations', 'Prone to rapid fever responses']
  };

  const pMent: Record<number, string[]> = {
    1: ['Natural command-oriented intelligence', 'Prone to ego-fatigue', 'Determined focus targets', 'Dislikes secondary supportive roles'],
    2: ['Highly intuitive and fluctuating emotional thoughts', 'Deep creative empathy', 'Prone to nocturnal melancholy', 'Overly sensitive to public criticism'],
    3: ['Vast scholastic memory', 'Methodical storage of details', 'Generous outlook', 'Can become highly dogmatic under conflict'],
    4: ['Sudden out-of-the-box revolutionary thoughts', 'High nervous pacing', 'Obsessive deep dives', 'Prone to deep futuristic anxieties'],
    5: ['Exceptional rapid communication synapses', 'Constant mental movement', 'Excellent multitasking processing', 'Can trigger nervous burnout easily'],
    6: ['Highly visual aesthetic appreciation', 'Peace-seeking inner mind', 'High expectation from partnerships', 'Prone to luxury indulgence stress'],
    7: ['Frequent analytical detouring', 'Deep subconscious dream state', 'High philosophical detachment', 'Sudden withdrawals from crowd environments'],
    8: ['Highly structured long-term strategy thinking', 'Patient risk-avoidance planning', 'Heavy mental self-burdening', 'Prone to pessimistic feedback loops'],
    9: ['Courageous, crisis-ready mental state', 'Direct objective focus', 'Impatient command structures', 'Prone to immediate aggressive reactions']
  };

  const pEmo: Record<number, string[]> = {
    1: ['Needs consistent recognition', 'Protective family instincts', 'Strong pride', 'Fragile self-image if ignored'],
    2: ['Frequent mood fluctuations matching lunar cycles', 'Maternal caregiving urges', 'Deep security requirements', 'Vulnerable to grief'],
    3: ['Optimistic emotional anchoring', 'Moral counseling outlook', 'Rarely holds long-term petty grudges', 'Feels hurt if wisdom is questioned'],
    4: ['Feels misunderstood by mainstream circles', 'Sudden extreme affection then sudden withdrawal', 'High protective wall around feelings'],
    5: ['Apt to joke or logicize feelings', 'Detached but highly communicative', 'Needs intellectual peer communication to stay emotionally balanced'],
    6: ['Sought-after aesthetic warmth', 'Grounded romantic urges', 'Highly loving but demands absolute physical surrounding beauty'],
    7: ['Deep spiritual or quiet romantic longings', 'Extremely private feelings', 'Prone to psychic absorption of room stress', 'Rarely expresses hurt directly'],
    8: ['Guarded emotional expression', 'Loyalty built slowly over years', 'Fears being dependent on others', 'Quietly carries ancestral duty'],
    9: ['Fiery passion surges', 'Defensive of siblings/allies', 'Extremely honest (sometimes blunt)', 'Prone to sudden reactive flashes of anger']
  };

  const weakSys: Record<number, string[]> = {
    1: ['Cardiovascular System', 'Spinal column bones', 'Right eye (for male), Left eye (for female)', 'Blood Pressure regulation'],
    2: ['Lymphatic and Fluid Circulation', 'Stomach and gastric mucosa', 'Left eye (for male), Right eye (for female)', 'Lungs and breathing passages'],
    3: ['Liver and Biliary passages', 'Pancreas (glucose processing)', 'Hip joints and femora', 'Arterial blood flow'],
    4: ['Central and Peripheral Nervous System', 'Lower digestive tract', 'Sudden erratic heart palpitations', 'Calf muscles'],
    5: ['Vocal cord and thyroid systems', 'Nervous synapses', 'Hands and skin epidermis', 'Outer respiratory passages'],
    6: ['Renal Filtration (Kidneys)', 'Reproductive tissues & hormones', 'Throat, larynx, and vocal cords', 'Dermal hydration levels'],
    7: ['Gastrointestinal Absorption', 'Cellular mitotic system', 'Psychosomatic response matrix', 'Foot bones'],
    8: ['Skeletal structure (Knees and joints)', 'Large intestines (excretory speed)', 'Teeth calcium and jaw stability', 'Hair follicle vital oils'],
    9: ['Blood Composition & Iron channels', 'Bone marrow production', 'Muscular system & tendons', 'Head and skull vessels']
  };

  const strengthsLib: Record<number, string[]> = {
    1: ['High solar vitality and rapid cells recovery', 'Strong core protective field (Ojas)', 'Excellent upright back stamina'],
    2: ['High natural body moisture and tissue lubrication', 'Quick intuitive recognition of health changes', 'Strong fertility parameters'],
    3: ['Generous glandular enzyme secretions', 'Stable cellular resilience against long term strains', 'Excellent hip mobility'],
    4: ['Sudden, immediate healing power during critical moments', 'Highly adaptive muscular reflexes', 'High pain threshold'],
    5: ['Extremely rapid metabolic adaptability', 'Excellent lung capacity when aerated', 'Fast motor-nerve healing speeds'],
    6: ['Excellent toxic discharge capacity via kidneys', 'High throat vocal resonance and deep facial glow (Tejas)', 'Strong immunity against general dry wind'],
    7: ['High resistance to common synthetic medicines', 'Amazing sub-conscious dream-state rejuvenation', 'Intuitive avoidance of toxic food'],
    8: ['Exceptional skeletal endurance and bone longevity', 'High resistance to epidemic diseases due to dry skin field', 'Outstanding long-term survival cellular stamina'],
    9: ['High red blood cell count potential', 'Rapid muscle fiber repair speeds', 'Intense natural competitive sports metabolic output']
  };

  const physicalTendencies = pPhys[driver] || ['General physical balance. Check schedules.'];
  const mentalTendencies = pMent[driver] || ['Balanced conscious thoughts.'];
  const emotionalTendencies = pEmo[driver] || ['Stable emotional coordinates.'];
  const weakBodySystems = weakSys[driver] || ['General vascular checkups recommended.'];
  const healthStrengths = strengthsLib[driver] || ['Good cellular recuperative index.'];

  // Health scores calculations
  let hVal = 75;
  let dVal = 75;
  let eVal = 75;
  let sVal = 75;
  let slVal = 75;
  let iVal = 75;
  let mVal = 75;

  if (driver === 1) { hVal = 88; dVal = 82; eVal = 94; sVal = 70; slVal = 78; iVal = 92; mVal = 80; }
  else if (driver === 2) { hVal = 70; dVal = 65; eVal = 70; sVal = 55; slVal = 85; iVal = 72; mVal = 65; }
  else if (driver === 3) { hVal = 85; dVal = 78; eVal = 82; sVal = 80; slVal = 82; iVal = 85; mVal = 82; }
  else if (driver === 4) { hVal = 62; dVal = 68; eVal = 85; sVal = 48; slVal = 58; iVal = 65; mVal = 60; }
  else if (driver === 5) { hVal = 78; dVal = 72; eVal = 90; sVal = 50; slVal = 68; iVal = 75; mVal = 78; }
  else if (driver === 6) { hVal = 82; dVal = 80; eVal = 78; sVal = 75; slVal = 80; iVal = 80; mVal = 84; }
  else if (driver === 7) { hVal = 68; dVal = 62; eVal = 65; sVal = 58; slVal = 70; iVal = 68; mVal = 70; }
  else if (driver === 8) { hVal = 65; dVal = 58; eVal = 80; sVal = 60; slVal = 72; iVal = 85; mVal = 68; }
  else if (driver === 9) { hVal = 84; dVal = 85; eVal = 95; sVal = 62; slVal = 75; iVal = 88; mVal = 72; }

  // Adjust scores depending on Conductor
  if (conductor === 8 || conductor === 4) {
    hVal -= 3; sVal -= 5; slVal -= 4; iVal += 2;
  }
  if (conductor === 5 || conductor === 1) {
    eVal += 4; dVal += 2; iVal += 3;
  }

  // Ensure normal ranges
  const healthScore = Math.max(30, Math.min(99, hVal));
  const digestiveScore = Math.max(30, Math.min(99, dVal));
  const energyScore = Math.max(30, Math.min(99, eVal));
  const stressScore = Math.max(30, Math.min(99, sVal));
  const sleepScore = Math.max(30, Math.min(99, slVal));
  const immunityScore = Math.max(30, Math.min(99, iVal));
  const mentalWellnessScore = Math.max(30, Math.min(99, mVal));

  let overallVibration = 'Average';
  if (healthScore >= 85) overallVibration = 'Highly Radiant, Tejas Powered';
  else if (healthScore >= 75) overallVibration = 'Balanced, Stable Wellness Vibration';
  else overallVibration = 'Prone to Nervous Drain, Requires Saffron-Tulsi Shields';

  // Ayurvedic diets map
  const recommendedFoodsMap: Record<string, string[]> = {
    Vata: ['Warm cooked rice', 'Steamed split mung dhal', 'Warm milk with nutmeg', 'Ghee unsalted', 'Sweet potato cooked with cumin', 'Toasted sesame soup', 'Cooked oats'],
    Pitta: ['Steamed basmati rice', 'Fresh coconut chunks', 'Cottage cheese (paneer)', 'Cucumber raita with coriander', 'Lentils split green', 'Soaked almond skinless', 'Melons'],
    Kapha: ['Spiced barley soup', 'Spiced boiled quinoa', 'Roasted chickpeas', 'Red lentils (Masoor dhal)', 'Steamed bitter gourd', 'Buttermilk with roasted cumin', 'Ginger infused warm stew']
  };

  const foodsToAvoidMap: Record<string, string[]> = {
    Vata: ['Raw salad greens', 'Cold carbonated drinks', 'Dry corn flakes', 'Uncooked cabbage', 'Ice creams', 'Deep fried dry chips', 'Refined dry flour pastries'],
    Pitta: ['Red chili hot peppers', 'Fermented vinegar', 'Hard sour curd', 'Deep fried garlic chips', 'Mustard oil excess', 'Citrus tomatoes raw', 'Aged salty cheese'],
    Kapha: ['Chilled thick milkshakes', 'Aged red meat', 'Bananas late night', 'Deep fried white sugar sweets', 'Excess table salt refined', 'Cold water right after meals']
  };

  const recFruits: Record<string, string[]> = {
    Vata: ['Soaked raisins', 'Sweet ripe mangoes', 'Fresh figs', 'Sweet papayas', 'Stewed apples in cinnamon'],
    Pitta: ['Watermelons', 'Sweet red cherries', 'Sweet grapes', 'Fully ripe pears', 'Pomegranates (Anar)'],
    Kapha: ['Dry prunes', 'Astringent pomegranates', 'Apples crisp raw', 'Papaya slices', 'Amla (Indian Gooseberry)']
  };

  const recVegs: Record<string, string[]> = {
    Vata: ['Carrots roasted', 'Zucchini stewed', 'Asparagus', 'Cumin pumpkins', 'Cooked beetroots'],
    Pitta: ['Asparagus green', 'Cabbage soft steamed', 'Leafy coriander greens', 'Sweet potato', 'Broccoli florets'],
    Kapha: ['Radish white sections', 'Spinach spiced', 'Bitter melon (Karela)', 'Bell peppers grilled', 'Garlic roasted greens']
  };

  const dKey = dominantDosha.split(' ')[0] as 'Vata' | 'Pitta' | 'Kapha';
  const recommendedFoods = recommendedFoodsMap[dKey] || recommendedFoodsMap.Vata;
  const foodsToAvoid = foodsToAvoidMap[dKey] || foodsToAvoidMap.Vata;
  const recommendedFruits = recFruits[dKey] || recFruits.Vata;
  const recommendedVegetables = recVegs[dKey] || recVegs.Vata;

  const recommendedWaterMl = dKey === 'Pitta' ? 2800 : dKey === 'Vata' ? 2400 : 1800;

  const fastDays: Record<number, string> = {
    1: 'Sunday (Sūryavār - Solar focus, absolute light salt intake)',
    2: 'Monday (Somavār - Lunar liquid fast with milk and fruits)',
    3: 'Thursday (Guruvār - Jupiter light yellow split mung khichdi)',
    4: 'Saturday (Shanivār - Rahu safety charcoal/sesame oil donation, grain-free day)',
    5: 'Wednesday (Budhavār - Budha green mung water soup fast)',
    6: 'Friday (Shukravār - Venus white food milk/paneer fast, no sour items)',
    7: 'Tuesday (Maṅgalavār - Ketu simple fruit pulp fast during sunset)',
    8: 'Saturday (Shanivār - Saturn strict black sesame seeds water fast)',
    9: 'Tuesday (Maṅgalavār - Mars red coral solar sunrise liquid fast)'
  };
  const recommendedFastingDay = fastDays[driver] || 'Thursday';

  // Lifestyle
  const yogaSug: Record<string, string[]> = {
    Vata: ['Slow gentle Sun Salutation (Surya Namaskar)', 'Pawanmuktasana (Wind releasing pose)', 'Shavasana (Deep relaxation)', 'Vrikshasana (Tree pose for balance)'],
    Pitta: ['Sheetali cooling moon sequence', 'Paschimottanasana (Seated forward bend)', 'Bhujangasana (Gentle Cobra)', 'Ardha Matsyendrasana (Spinal twist)'],
    Kapha: ['Dynamic Sun Salutations (12 rounds fast)', 'Virabhadrasana (warrior series)', 'Dhanurasana (Bow pose)', 'Ustrasana (Camel pose for chest openings)']
  };

  const pranayamaSug: Record<string, string[]> = {
    Vata: ['Anulom Vilom (Alternate nostril breathing with slow retention)', 'Nadi Shodhana'],
    Pitta: ['Sheetali Pranayama (Sipping cold air through curled tongue)', 'Chandra Bhedana'],
    Kapha: ['Kapalbhati Pranayama (Active skull-shining exhalations)', 'Bhastrika (Bellows breath)']
  };

  const yogaSuggestions = yogaSug[dKey] || yogaSug.Vata;
  const pranayamaSuggestions = pranayamaSug[dKey] || pranayamaSug.Vata;

  const meditationSuggestions = dKey === 'Vata' ? ['Soothing grounding root sound meditation (OM)', 'Body scan relaxation'] :
                           dKey === 'Pitta' ? ['Compassion and loving-kindness Metta meditation', 'Soma blue light visualization'] :
                           ['Kinetic chanting walking meditation', 'Dynamic bellows breathing focusing on solar plexus'];

  const lifestyleSuggestions = dKey === 'Vata' ? [
    'Maintain absolute consistent sleep and waking hours.',
    'Oil your hair and temples with warm sesame oil before bed.',
    'Minimize hyper-stimulating action-movie viewing or screen time after 8:30 PM.',
    'Protect ears with a cotton sheet under cold direct morning winds.'
  ] : dKey === 'Pitta' ? [
    'Walk bare feet on early morning green grass loaded with natural dew.',
    'Keep your desk well ventilated and sleep under light-weight cotton sheets.',
    'Avoid executing heated business discussions under direct hot noon Sun.',
    'Perform sweet sandalwood body mist sprays after shower sessions.'
  ] : [
    'Wake up early (Brahma Muhurta - around 5:15 AM) to activate static Kapha.',
    'Avoid daytime napping after lunch completely as it accumulates bodily dampness.',
    'Utilize warming dry-brush massages (Udvartana) with herbal powders.',
    'Include active dynamic aerobics, running or brisk sports for 30 minutes daily.'
  ];

  const routines: Record<string, string> = {
    Vata: 'Wake up by 6:00 AM. Drink 2 glasses of lukewarm copper cup water. Perform gentle spinal twists. Apply almond oil inside nasal path (Pratimarsha Nasya). Have a completely warm, sweet cooked spiced oatmeal breakfast.',
    Pitta: 'Wake up by 5:45 AM. Drink fresh coconut water or coriander water cold. Perform cooling sheetali breaths. Avoid hot showers; prefer lukewarm water. Have sweet apples or soaked almond-dates for breakfast.',
    Kapha: 'Wake up by 5:15 AM. Perform active dry skin brushing. Drink hot ginger water with raw honey (only after water cools slightly). Perform rapid sun salutations. Skip heavy breakfast; have highly spiced bitter black tea with 3 dry figs.'
  };
  const morningRoutine = routines[dKey] || routines.Vata;

  const sleepTips: Record<string, string> = {
    Vata: 'Retire strictly by 10:00 PM. Massage the soles of your feet with warm Brahmi Sesame oil. Drink 1/2 cup organic warm milk with cardamom and a pinch of turmeric. Maintain a totally dark quiet warm room.',
    Pitta: 'Retire around 10:30 PM. Apply pure coconut oil to the crown of your head and soles. Keep window slightly open for fresh cool air flow. Avoid using electric blankets or highly heavy thick woolen quilts.',
    Kapha: 'Retire around 11:00 PM. Avoid any fluid intake 1 hr before sleeping. Sleep on a hard mattress with one single light pillow. Do not keep room extra warm; use a light humidifier if air has dryness.'
  };
  const sleepRecommendations = sleepTips[dKey] || sleepTips.Vata;

  // Let's generate professional reasonings for each score
  const reasoning = {
    health: `Your global Health Score ($healthScore/100) is dictated by your Driver ${driver} and Conductor ${conductor}. ${
      driver === 1 || driver === 9 || driver === 3 
        ? `Beneficial planetary vitality from the ${driver === 1 ? 'Sun' : driver === 9 ? 'Mars' : 'Jupiter'} provides high self-regeneration.`
        : `Saturn, Rahu, or Ketu-governed frequencies trigger subtle stress vectors inside tissues, requiring active regular dosha pacification guides.`
    }`,
    digestive: `The Digestive index of $digestiveScore/100 represents your Jatharagni strength. ${
      dKey === 'Pitta' ? 'Fiery Pitta digestion is energetic but susceptible to acidity spikes and acid-refluxes if meals are skipped.' :
      dKey === 'Vata' ? 'Vata wind indices trigger variable digestion (Vishama Agni), inducing periodic bloating, gut coldness and gas.' :
      'Kapha water leads to slow digestive processing (Manda Agni), requiring pungent digestive bitter spices (ginger, black pepper, pipali).'
    }`,
    energy: `Energy index of $energyScore/100 is supported by Conductor ${conductor}. ${
      conductor === 1 || conductor === 5 || conductor === 9
        ? 'High dynamic cellular recharge speed enables long working days with low sleep.'
        : 'Steady but slow lymphatic recharge cycles require natural breaks and avoiding continuous high-intensity cardio.'
    }`,
    stress: `Stress vulnerability metric ($stressScore/100) shows response triggers. ${
      dKey === 'Vata' ? 'Sensitive nervous synapses absorb surrounding emotional noise, leading to muscle tightening or anxiety cycles.' :
      dKey === 'Pitta' ? 'Ambitious fire drives high work pressure, creating impatience, irritability, and heated blood pressure surges.' :
      'Grounded Kapha stamina absorbs substantial environmental stress passively, maintaining mental stability under complex corporate crises.'
    }`,
    sleep: `Sleep Score of $sleepScore/100 tracks melatonin and rapid-eye cycles. ${
      dKey === 'Vata' ? 'Hyper-imaginative brainwaves make sleep shallow and interrupted, especially during wind transits.' :
      dKey === 'Pitta' ? 'Sharp planning thoughts keep the mind active late in the evening. Keep screens closed.' :
      'An exceptional natural deep sleep index allows your system to regenerate thoroughly. Watch against sleeping over 8 hours.'
    }`,
    immunity: `Immunity defense strength is $immunityScore/100. ${
      driver === 1 || driver === 8 || driver === 3
        ? 'A very resilient cellular protection shield (Ojas) successfully repels viral seasonal outbreaks.'
        : 'Lymphatic and mucous node vulnerabilities require daily Tulsi-Turmeric defensive armor drinks.'
    }`,
    mental: `Mental wellness index stands at $mentalWellnessScore/100. ${
      driver === 2 || driver === 7 || driver === 4
        ? 'Highly active spiritual or emotional antenna requires quiet meditation hours to ground fluctuating currents.'
        : 'A highly structured logical system helps you separate personal emotions from professional duties.'
    }`
  };

  // Replace placeholders inside reasoning
  const finalReasoning = {
    health: reasoning.health.replace('$healthScore', healthScore.toString()),
    digestive: reasoning.digestive.replace('$digestiveScore', digestiveScore.toString()),
    energy: reasoning.energy.replace('$energyScore', energyScore.toString()),
    stress: reasoning.stress.replace('$stressScore', stressScore.toString()),
    sleep: reasoning.sleep.replace('$sleepScore', sleepScore.toString()),
    immunity: reasoning.immunity.replace('$immunityScore', immunityScore.toString()),
    mental: reasoning.mental.replace('$mentalWellnessScore', mentalWellnessScore.toString())
  };

  return {
    driver,
    conductor,
    compound,
    rulerPlanet: PLANET_NAMES[driver] || 'Sun',
    dominantDosha,
    secondaryDosha,
    doshaComposition: { vata, pitta, kapha },
    prakritiType,
    doshaBalanceAnalysis,
    physicalTendencies,
    mentalTendencies,
    emotionalTendencies,
    weakBodySystems,
    healthStrengths,
    scores: {
      healthScore,
      digestiveScore,
      energyScore,
      stressScore,
      sleepScore,
      immunityScore,
      mentalWellnessScore,
      overallVibration,
      reasoning: finalReasoning
    },
    dietRecommendations: {
      recommendedFoods,
      foodsToAvoid,
      recommendedFruits,
      recommendedVegetables,
      recommendedWaterMl,
      recommendedFastingDay
    },
    ayurvedicLifestyle: {
      yogaSuggestions,
      pranayamaSuggestions,
      meditationSuggestions,
      lifestyleSuggestions,
      morningRoutine,
      sleepRecommendations
    }
  };
}
