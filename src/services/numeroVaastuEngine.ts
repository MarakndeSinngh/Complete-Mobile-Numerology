import { reduceToSingleDigit } from './numerologyEngine';
import { computeLoshuAnalysis } from './loshuEngine';

export interface VaastuDirectionDetails {
  direction: string;
  degreeRange: string;
  element: string;
  dynamicInfluence: string;
}

export interface NumeroVaastuReport {
  kuaNumber: number;
  groupType: 'EAST_GROUP' | 'WEST_GROUP';
  groupDescription: string;
  directions: {
    success: VaastuDirectionDetails;
    health: VaastuDirectionDetails;
    family: VaastuDirectionDetails;
    personalDev: VaastuDirectionDetails;
    business: VaastuDirectionDetails;
    career: VaastuDirectionDetails;
    wealth: VaastuDirectionDetails;
    luckyList: string[];
    avoidList: string[];
  };
  colourCorrection: {
    luckyColours: string[];
    balanceColours: string[];
    antiColours: string[];
    homeColourSuggestions: string;
    officeColourSuggestions: string;
    bedroomColourSuggestions: string;
    vehicleColourSuggestions: string;
  };
  zonesReport: {
    careerZone: { status: string; element: string; details: string; enhancement: string };
    moneyZone: { status: string; element: string; details: string; enhancement: string };
    relationshipZone: { status: string; element: string; details: string; enhancement: string };
    healthZone: { status: string; element: string; details: string; enhancement: string };
    educationZone: { status: string; element: string; details: string; enhancement: string };
    spiritualZone: { status: string; element: string; details: string; enhancement: string };
  };
  remedyPlan: {
    targetMissingNodes: string[];
    remedyCards: {
      number: number;
      zoneName: string;
      flawDetails: string;
      directionRemedy: string;
      colourRemedy: string;
      placementRemedy: string;
      energyCorrection: string;
      actionItem: string;
    }[];
  };
}

export function calculateKuaNumber(year: number, gender: 'MALE' | 'FEMALE' | 'OTHER' = 'MALE'): number {
  const lastTwo = year % 100;
  let sum = lastTwo.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  let kua = 0;
  if (gender === 'FEMALE') {
    if (year >= 2000) {
      kua = sum + 6;
    } else {
      kua = sum + 4;
    }
  } else {
    if (year >= 2000) {
      kua = 9 - sum;
    } else {
      kua = 11 - sum;
    }
  }
  while (kua > 9) {
    kua = kua.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  if (kua <= 0) {
    kua = 9;
  }

  if (kua === 5) {
    kua = gender === 'FEMALE' ? 8 : 2;
  }
  return kua;
}

export function generateNumeroVaastuReport(dobStr: string, gender: 'MALE' | 'FEMALE' | 'OTHER' = 'MALE', name: string = ''): NumeroVaastuReport {
  const parts = dobStr.split('-');
  const year = parseInt(parts[0], 10) || 1990;

  const kuaNumber = calculateKuaNumber(year, gender);
  const groupType = [1, 3, 4, 9].includes(kuaNumber) ? 'EAST_GROUP' : 'WEST_GROUP';
  const groupDescription = groupType === 'EAST_GROUP' 
    ? `East Mansion Group. Your energetic sheath resonates with East, Southeast, North, and South frequencies. Placing your workspace and primary doors facing these vectors aligns you with solar and planetary transits.`
    : `West Mansion Group. Your energetic core responds beautifully to West, Northwest, Southwest, and Northeast vectors. To avoid domestic delays and professional drain, align your focus seats towards these coordinates.`;

  // Eight Mansions mapping
  const groupDirections: Record<number, {
    success: VaastuDirectionDetails;
    health: VaastuDirectionDetails;
    family: VaastuDirectionDetails;
    personalDev: VaastuDirectionDetails;
    business: VaastuDirectionDetails;
    career: VaastuDirectionDetails;
    wealth: VaastuDirectionDetails;
    luckyList: string[];
    avoidList: string[];
  }> = {
    1: {
      success: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'Attracts swift business growth, prosperity, and wealth creation opportunities.' },
      health: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'Facilitates fast physical healing, high recovery, and deep sleep.' },
      family: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'Maintains absolute marital harmony, children academic progress, and family unity.' },
      personalDev: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'Enhances self-discipline, inner wisdom growth, and meditation capabilities.' },
      business: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'Optimal direction to face while sitting inside your billing or CEO chair.' },
      career: { direction: 'North', degreeRange: 'N', element: 'Water', dynamicInfluence: 'Place your computer desk here facing North to trigger quick promotions.' },
      wealth: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'Locate your safe locker or cash box here with a green base.' },
      luckyList: ['Southeast', 'East', 'South', 'North'],
      avoidList: ['Southwest', 'Northeast', 'Northwest', 'West']
    },
    2: {
      success: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'Fosters scholastic achievements, research depth, and corporate strategic wins.' },
      health: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'Boosts structural bone strength, deep lung aeration, and immune shield.' },
      family: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'Draws helpful patrons, mentor guidance, and friendly client connections.' },
      personalDev: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'Sustains peace, grounding, memory storage, and emotional control.' },
      business: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'Excellent direction to place the corporate boardroom setup.' },
      career: { direction: 'Northwest', degreeRange: 'NW', element: 'Metal', dynamicInfluence: 'Place phone charger or business communication router in this sector.' },
      wealth: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'Install a heavy clay pot filled with golden sand in this zone.' },
      luckyList: ['Northeast', 'West', 'Northwest', 'Southwest'],
      avoidList: ['North', 'South', 'East', 'Southeast']
    },
    3: {
      success: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'Accelerates public fame, brand expansion, and explosive sales ratios.' },
      health: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'Relieves chronic body stress, calming nervous system impulses.' },
      family: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'Supports robust relative relationships and prevents domestic legal disputes.' },
      personalDev: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'Imparts intense memory retention, deep yoga execution powers.' },
      business: { direction: 'South', degreeRange: 'S', element: 'Fire', dynamicInfluence: 'Face South to maintain extreme executive charisma during conferences.' },
      career: { direction: 'East', degreeRange: 'E', element: 'Wood', dynamicInfluence: 'Keep certificates and graduation pictures on the East wall.' },
      wealth: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'Hang a 10-rod wooden wind chime here to activate cash velocity.' },
      luckyList: ['South', 'North', 'Southeast', 'East'],
      avoidList: ['West', 'Northwest', 'Southwest', 'Northeast']
    },
    4: {
      success: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'Multiplies professional opportunities, salary hikes, and trade inquiries.' },
      health: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'Maintains extreme heart vitality and highly balanced pitta temperature.' },
      family: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'Promotes deep loving attachment between siblings and spouse.' },
      personalDev: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'Unlocks high artistic creativity, layout visualization skills.' },
      business: { direction: 'North', degreeRange: 'N', element: 'Water', dynamicInfluence: 'Optimal location for placing business catalog and trade portfolios.' },
      career: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'Sit here and write your daily business diary with green ink.' },
      wealth: { direction: 'North', degreeRange: 'N', element: 'Water', dynamicInfluence: 'Place a dynamic glass bowl filled with clear moving water here.' },
      luckyList: ['North', 'South', 'East', 'Southeast'],
      avoidList: ['Northeast', 'Southwest', 'West', 'Northwest']
    },
    6: {
      success: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'Secures high cash flows, project success, and swift asset creation.' },
      health: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'Safeguards cartilage health and brain neural transmission stability.' },
      family: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'Provides marital support, emotional loyalty from staff members.' },
      personalDev: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'Broadens analytical vision, supporting advanced corporate audits.' },
      business: { direction: 'West', degreeRange: 'W', element: 'Metal', dynamicInfluence: 'Keep cash receipts or active metal scale rulers in this sector.' },
      career: { direction: 'Northwest', degreeRange: 'NW', element: 'Metal', dynamicInfluence: 'Best sector to handle visa papers, export deals, or foreign emails.' },
      wealth: { direction: 'West', degreeRange: 'W', element: 'Metal', dynamicInfluence: 'Keep a heavy silver coin inside a metallic bowl in this zone.' },
      luckyList: ['West', 'Northeast', 'Southwest', 'Northwest'],
      avoidList: ['Southeast', 'East', 'North', 'South']
    },
    7: {
      success: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'Boosts immediate wealth accumulation and strategic investment returns.' },
      health: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'Enhances stomach defense lining, reducing mystery digestive aches.' },
      family: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'Fosters outstanding relationship bonding with family elders.' },
      personalDev: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'Promotes rapid self-enlightenment, shielding against depression.' },
      business: { direction: 'West', degreeRange: 'W', element: 'Metal', dynamicInfluence: 'Excellent direction to meet high-profile angel investors.' },
      career: { direction: 'Northwest', degreeRange: 'NW', element: 'Metal', dynamicInfluence: 'Display corporate strategy maps on the Northwest wall.' },
      wealth: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'Place a small yellow crystal pyramid inside this sector.' },
      luckyList: ['West', 'Southwest', 'Northeast', 'Northwest'],
      avoidList: ['Southeast', 'East', 'North', 'South']
    },
    8: {
      success: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'Establishes rock-solid corporate partnerships and commercial mastery.' },
      health: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'Promotes deep sound sleep and cellular repair processes.' },
      family: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'Implements long-term social compatibility and family backing.' },
      personalDev: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'Triggers vast administrative clarity and deep Vedic focus.' },
      business: { direction: 'Southwest', degreeRange: 'SW', element: 'Earth', dynamicInfluence: 'Locate the heavy storage cabinets or active ledger records here.' },
      career: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'Sit here facing East/Northeast to optimize focus while writing code.' },
      wealth: { direction: 'Southwest', degreeRange: 'SW', element: 'Earth', dynamicInfluence: 'Store high-value gold jewelry or property papers in SW safe.' },
      luckyList: ['Southwest', 'Northwest', 'West', 'Northeast'],
      avoidList: ['Southeast', 'East', 'South', 'North']
    },
    9: {
      success: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'Drives high ambition, explosive business sales, and dynamic market capture.' },
      health: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'Stabilizes heart and liver metabolic performance indices.' },
      family: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'Secures high emotional harmony and friendly neighborhood relationships.' },
      personalDev: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'Deepens courage, physical determination, and yogic energy structures.' },
      business: { direction: 'East', degreeRange: 'E', element: 'Wood', dynamicInfluence: 'Excellent direction to place the primary team marketing workstations.' },
      career: { direction: 'South', degreeRange: 'S', element: 'Fire', dynamicInfluence: 'Display awards, trophies, and active fire symbols behind your desk.' },
      wealth: { direction: 'East', degreeRange: 'E', element: 'Wood', dynamicInfluence: 'Keep a fast-growing bamboo plant in water in this sector.' },
      luckyList: ['East', 'Southeast', 'North', 'South'],
      avoidList: ['Northwest', 'West', 'Northeast', 'Southwest']
    }
  };

  const currentDirections = groupDirections[kuaNumber] || groupDirections[1];

  // Colour Correction Engine
  const colourEngine: Record<number, {
    luckyColours: string[];
    balanceColours: string[];
    antiColours: string[];
    homeColourSuggestions: string;
    officeColourSuggestions: string;
    bedroomColourSuggestions: string;
    vehicleColourSuggestions: string;
  }> = {
    1: {
      luckyColours: ['Emerald Green', 'Light Lime', 'Mint'],
      balanceColours: ['Lemon Yellow', 'Soft Blue', 'Charcoal'],
      antiColours: ['Pink', 'Deep Ruby Red', 'Gold'],
      homeColourSuggestions: 'Paint primary living room walls in soft pastel green or warm beige with white trims to nourish the Wood element of Southeast success.',
      officeColourSuggestions: 'Keep office background screens or files in Emerald Green tones to stimulate financial transactions.',
      bedroomColourSuggestions: 'Use soothing cream and pastel green cotton linen to promote muscle relaxation and quick recuperation.',
      vehicleColourSuggestions: 'Prefer Pearl White, Metallic Silver, or Slate Green paint structures to optimize peaceful transits.'
    },
    2: {
      luckyColours: ['Soft Gold', 'Lemon Yellow', 'Warm Sand', 'Clay Beige'],
      balanceColours: ['Diamond White', 'Dull Silver', 'Warm Ivory'],
      antiColours: ['Bright Forest Green', 'Dark Emerald Decor'],
      homeColourSuggestions: 'Utilize rich sandy yellow or ivory tones for the foyer. Incorporate direct warm terracotta clay artifacts in Southwest corners.',
      officeColourSuggestions: 'Employ heavy wooden furniture with sand-colored leather seating to ground business negotiations.',
      bedroomColourSuggestions: 'Nourish Southwest energy using soft cream, light peach, or warm beige curtains and pillows.',
      vehicleColourSuggestions: 'Opt for Golden Bronze, Sand Beige, or White paint finishes for highest protection scores.'
    },
    3: {
      luckyColours: ['Vermilion Red', 'Deep Orange', 'Warm Saffron', 'Coral'],
      balanceColours: ['Forest Green', 'Ivory', 'Gold'],
      antiColours: ['Midnight Black', 'Deep Indigo Blue'],
      homeColourSuggestions: 'Incorporate highlights of warm terracotta and saffron in your South living room to attract high fame and recognition.',
      officeColourSuggestions: 'Style the main reception wall under energetic red-tinted mahogany textures or corporate saffron logos.',
      bedroomColourSuggestions: 'Use soft coral pink or light orange sheets to trigger positive emotional bonding and deep empathy.',
      vehicleColourSuggestions: 'Excellent styling choice is Metallic Red, Saffron, or Gold. Strictly avoid dark blue or jet black.'
    },
    4: {
      luckyColours: ['Light Blue', 'Ocean Turquoise', 'Deep Teal'],
      balanceColours: ['Sandalwood White', 'Lime and Mint Green'],
      antiColours: ['Saffron Ivory', 'Bright Lemon Yellow', 'Gold'],
      homeColourSuggestions: 'Nourish the North zone using soft ocean blue wallpaper or light turquoise accent cushions to boost career luck.',
      officeColourSuggestions: 'Maintain deep-blue metallic pen display panels or subtle water fountain lighting effects.',
      bedroomColourSuggestions: 'Use powder blue and light cream textures to cooling Pitta and calming busy planning thoughts.',
      vehicleColourSuggestions: 'Prefer Navy Blue, Dark Teal, or Classic Silver to guarantee high traveling safety scores.'
    },
    6: {
      luckyColours: ['Classic Silver', 'Steel Grey', 'Snow White'],
      balanceColours: ['Lemon Yellow', 'Warm Clay Beige'],
      antiColours: ['Fiery Red', 'Hot Cherry Pink'],
      homeColourSuggestions: 'Maximize West prosperity using crisp white ceilings paired with beautiful pewter metal decoration bowls.',
      officeColourSuggestions: 'Utilize brushed steel desks or chrome lamps to activate executive decision sharpness.',
      bedroomColourSuggestions: 'Adopt elegant light grey and snow-white sheets for a cool, restorative sleep environment.',
      vehicleColourSuggestions: 'Strictly opt for Royal Silver, Glossy Grey, or White. Protect against sudden fiery red paints.'
    },
    7: {
      luckyColours: ['Charcoal Grey', 'Pewter Grey', 'Pure White'],
      balanceColours: ['Pastel Yellow', 'Ivory Cream'],
      antiColours: ['Orange', 'Fiery Mars Red'],
      homeColourSuggestions: 'Incorporate charcoal highlights on Northwest features. Use standard alabaster vases to root support structures.',
      officeColourSuggestions: 'Utilize high-contrast monochrome layouts (crisp white desk with graphite-grey organizational files).',
      bedroomColourSuggestions: 'Surround with soft grey and soft vanilla curtains to facilitate peaceful dreams and mental healing.',
      vehicleColourSuggestions: 'Prefer Pearl Graphite, Space Grey, or Satin Silver for pristine travel security.'
    },
    8: {
      luckyColours: ['Pale Ochre', 'Terracotta', 'Saffron Yellow'],
      balanceColours: ['Brushed Platinum', 'Chrome', 'Pure White'],
      antiColours: ['Leaf Green', 'Teal Green', 'Mint'],
      homeColourSuggestions: 'Select warm sand, terracotta tiles, or pale yellow walls in Southwest zones to solidify investments.',
      officeColourSuggestions: 'Use heavy marble desktops, ceramic mugs, and golden lighting schemes to anchor team stability.',
      bedroomColourSuggestions: 'Use soft mustard, light yellow or organic sand duvet covers to stabilize sleep rhythms.',
      vehicleColourSuggestions: 'Opt for Desert Sand, Champagne Gold, or Pearl White. Strictly avoid leaf green.'
    },
    9: {
      luckyColours: ['Emerald Green', 'Lime Green', 'Warm Saffron'],
      balanceColours: ['Coral Red', 'Peach Pink', 'Pure Ivory'],
      antiColours: ['Metallic Charcoal', 'Platinum Grey'],
      homeColourSuggestions: 'Nourish the East success zone with vibrant green plants growing in wooden boxes, or paint walls pale mint.',
      officeColourSuggestions: 'Drape deep green executive folder sleeves or keep a jade stone paperweight on your layout desk.',
      bedroomColourSuggestions: 'Use soft peach pink paired with bamboo-green linens to balance Mars fire with Venusian luxury.',
      vehicleColourSuggestions: 'Opt for Metallic Saffron, Emerald Green, or Pearl White. Strictly avoid dark grey.'
    }
  };

  const currentColours = colourEngine[kuaNumber] || colourEngine[1];

  // Zones Report (Traditional Vastu 16 Zones condensed to 6 Core Zones)
  // We can customize the zones based on Kua number or general Vastu alignments
  const zonesReport = {
    careerZone: {
      status: [1, 4, 9].includes(kuaNumber) ? 'Highly Active & Blessed' : 'Neutral (Requires Activation)',
      element: 'Water (North)',
      details: 'Governs your professional promotions, client contract inflow, and career path clarity.',
      enhancement: 'Place a blue metallic vase with water, or a black glass sheet on your computer table. Minimize presence of heavy dry clay pots or red trash bins here.'
    },
    moneyZone: {
      status: [1, 3, 9].includes(kuaNumber) ? 'Vibrant Financial Resonance' : 'Vulnerable (Requires Safeguards)',
      element: 'Wood (Southeast)',
      details: 'Dictates the speed of continuous liquid cash flows, business conversions, and luxury savings.',
      enhancement: 'Hang a healthy green money plant in a water-filled glass bottle on Southeast window handles. Keep a bright green mat at this zone.'
    },
    relationshipZone: {
      status: [2, 6, 8].includes(kuaNumber) ? 'Stable Family Harmony' : 'Delicate (Needs Healing Care)',
      element: 'Earth (Southwest)',
      details: 'Governs marital attachment, partner understanding, business team coordination, and family legacy.',
      enhancement: 'Keep a heavy natural solid clay showpiece or sand pyramid in the Southwest corner. Hang a smiling picture of parents or spouse in a golden frame.'
    },
    healthZone: {
      status: [1, 2, 3].includes(kuaNumber) ? 'Nourishing Healing Vibration' : 'Prone to Drain (Needs Activation)',
      element: 'Earth/Air (Northeast & East)',
      details: 'Sustains physical healing rates, emotional calm, and body toxic clearings.',
      enhancement: 'Ensure Northeast is completely neat and light-weighted. Store therapeutic copper jars with drinking water here overnight. No heavy machinery.'
    },
    educationZone: {
      status: [2, 3, 8].includes(kuaNumber) ? 'High Intellectual Concentration' : 'Needs Focus Catalysts',
      element: 'Earth/Metal (Northeast/West)',
      details: 'Governs children retention rates, exam preparation output, and systematic research skills.',
      enhancement: 'Keep study books upright in this sector. Install a small pure brass desk globe and rotate it three times daily before beginning tasks.'
    },
    spiritualZone: {
      status: [3, 7, 8].includes(kuaNumber) ? 'Deep Cosmic Connection' : 'Average (Requires Sacred Focus)',
      element: 'Water/Earth (Northeast/West)',
      details: 'Controls meditation depth, subconscious dreams, intuitive guidance, and religious devotion.',
      enhancement: 'Establish your sacred Mandir or meditation alter in the Northeast. Use light sandalwood fragrances and white ghee lamps to draw in holy deities.'
    }
  };

  // Lo Shu + Vaastu integration remedies
  const lGrid = computeLoshuAnalysis(dobStr, name);
  const targetMissingNodes = lGrid.missingNumbers.map(n => n.toString());

  const possibleRemedies: Record<number, {
    number: number;
    zoneName: string;
    flawDetails: string;
    directionRemedy: string;
    colourRemedy: string;
    placementRemedy: string;
    energyCorrection: string;
    actionItem: string;
  }> = {
    8: {
      number: 8,
      zoneName: 'South-West (नैऋत्य) - Earth Stability Zone',
      flawDetails: 'Missing 8 under Saturn rules disables stable property gains, causes cash blockage, and increases marital disagreement frequency.',
      directionRemedy: 'Face the Southwest direction directly during major business project investment audits.',
      colourRemedy: 'Adopt Ochre Yellow, Terracotta, or Clay Brown curtains and footmats in these corners.',
      placementRemedy: 'Place heavy terracotta clay pots filled with golden sand and solid lead metal blocks here to ground Saturn.',
      energyCorrection: 'Light a sesame oil or mustard oil lamp on SW windows on Saturday evenings during sunset periods.',
      actionItem: 'Donate black chickpea salad (Chana dhal) and dark blankets to labor groups on Saturdays.'
    },
    5: {
      number: 5,
      zoneName: 'Brahmasthan (ब्रह्मस्थान) - Centre Zone of Absolute Balance',
      flawDetails: 'Missing 5 Mercury node causes heavy business calculation errors, instability in corporate contracts, and communication misunderstandings.',
      directionRemedy: 'Stand in the exact Centre of your house and face the North direction during key business calls.',
      colourRemedy: 'Add pastel green, mint, or soft emerald green highlights in the central living room features.',
      placementRemedy: 'Place a dynamic brass or bronze metal plate containing green jade crystals or natural unheated emeralds in the Centre.',
      energyCorrection: 'Clean the Brahmasthan zone of any heavy metallic beams, dark clutter or toilets. Keep it airy and free.',
      actionItem: 'Feed a portion of fresh green spinach or grass to street cows every Wednesday morning before sunrise.'
    },
    6: {
      number: 6,
      zoneName: 'North-West (वायव्य) - Metal Support & Venus Luxury Zone',
      flawDetails: 'Missing 6 retards accumulation of luxury vehicles, delays marital matching, and stops helper/patrons support during critical business crises.',
      directionRemedy: 'Focus your Northwest corner activities towards global export, visa deals, or networking calls.',
      colourRemedy: 'Adopt Diamond White, Ivory, Cream, or Royal Silver textures for Northwest bedding and drapes.',
      placementRemedy: 'Hang a robust six-rod hollow metallic wind chime or place a heavy silver plated coin frame here.',
      energyCorrection: 'Spray soothing light Rose or Sandalwood mist around the Southwest and Northwest corners daily.',
      actionItem: 'Distribute sweet milk desserts or white sugar kheer to girls under age 9 on Friday afternoons.'
    },
    2: {
      number: 2,
      zoneName: 'South-West (नैऋत्य) - Moon Emotional & Maternal Zone',
      flawDetails: 'Missing 2 Moon node triggers extreme mood swings, continuous digestive fluid instability, cold extremities, and relative friction with mother.',
      directionRemedy: 'Face Northwest while sleeping (with head pointing East or South) to calm lunar pathways.',
      colourRemedy: 'Adopt Pearly White, Off-white, Ivory, or Cosmic Cosmic Silver home upholstery.',
      placementRemedy: 'Hang a double-ring silver photo frame containing pictures of parents, or keep a crystal glass bowl with water and white flowers.',
      energyCorrection: 'Drink pure drinking water stored in a solid Silver glass, especially during the moonlit hours.',
      actionItem: 'Keep a fast on Mondays. Donate fresh milk, white rice, or white sugar to temple priests after sunset.'
    },
    3: {
      number: 3,
      zoneName: 'East (पूर्व) - Jupiter Wisdom & Family Growth Zone',
      flawDetails: 'Missing 3 limits administrative focus, delays children progress, and blocks financial mentorship.',
      directionRemedy: 'Face East while reading books, preparing exams, or sitting in corporate administrative meetings.',
      colourRemedy: 'Incorporate Saffron Gold, Turmeric Yellow, or Ochre Saffron paint colors on East walls.',
      placementRemedy: 'Install a beautiful, solid brass statue of Lord Ganesha or Gurudeva on the East shelf. No heavy iron pieces.',
      energyCorrection: 'Apply a fragrant Saffron (Kesar) paste tilak on your forehead and throat daily after shower.',
      actionItem: 'Donate yellow split chickpeas (Chana Dhal) and yellow bananas to ashrams on Thursdays.'
    },
    4: {
      number: 4,
      zoneName: 'South-East (आग्नेय) - Rahu Financial Velocity & Direct Vision Zone',
      flawDetails: 'Missing 4 Rahu node causes sudden cash leaks, delays in getting due back payments, and bad choices in partners.',
      directionRemedy: 'Face North or Southeast while checking investment graphs or processing digital transactions.',
      colourRemedy: 'Incorporate Slate Grey, Charcoal, or Ocean Navy Blue frames or mousepads on your work table.',
      placementRemedy: 'Place a neat solid square wooden blocks on Southeast tables. Hang a picture of vertical bamboo shoots in green wood frames.',
      energyCorrection: 'Keep the Southeast corner completely dry. No leakage on pipes or faucets to prevent money leaks.',
      actionItem: 'Feed small dogs or stray crows on Saturdays. Donate dark copper kitchen untensils.'
    },
    7: {
      number: 7,
      zoneName: 'West (पश्चिम) - Ketu Research & Children Skill Node',
      flawDetails: 'Missing 7 Ketu frequency triggers sudden analytical blocks, skin allergy problems, and limits internal intuition.',
      directionRemedy: 'Face West or Northwest while performing profound spiritual yoga or deep breathing meditation.',
      colourRemedy: 'Use White, Smoke Grey, or Pewter curtains inside your working or meditation room.',
      placementRemedy: 'Place a premium multi-pointed clear quartz crystal pyramid on the West shelf to reflect morning Sun.',
      energyCorrection: 'Keep a clean container filled with multi-color grains on West windows to feed birds daily.',
      actionItem: 'Feed a piece of sweet bread smeared with pure mustard oil to black dogs on Tuesday evenings.'
    },
    9: {
      number: 9,
      zoneName: 'South (दक्षिण) - Mars Energy & Command Zone',
      flawDetails: 'Missing 9 Mars node triggers low physical courage, lack of initiative, throat throat vulnerabilities, and fear of high risks.',
      directionRemedy: 'Face South while analyzing sports routines, planning battles, or making direct cold calls.',
      colourRemedy: 'Incorporate Coral Red, Saffron, or bright Saffron Orange highlight features inside Southern rooms.',
      placementRemedy: 'Display copper accessories, copper pyramids, or pictures of a rising golden Sun on South walls.',
      energyCorrection: 'Burn a clean red wax candle or brass oil lamp inside the Southern zone for 20 minutes daily during sunset.',
      actionItem: 'Donate red copper vessels, lentils (Masoor dhal), or red clothes to labor workers on Tuesday afternoons.'
    },
    1: {
      number: 1,
      zoneName: 'North (उत्तर) - Sun Public Fame & Career Entrance Zone',
      flawDetails: 'Missing 1 Sun node limits career entry, causes disputes with government officials or father, and drains personal energy.',
      directionRemedy: 'Face East or North during sunrise, offering water to the rising Sun daily.',
      colourRemedy: 'Adopt Metallic Golden, Ruby Red, or light copper features inside North office zones.',
      placementRemedy: 'Hang a premium solid copper plate showing the face of a rising radiant Sun on the East wall.',
      energyCorrection: 'Wake up early during the morning crimson twilight (5:30 AM). Keep North entrance free and spotless.',
      actionItem: 'Offer wheat grains and water to solar birds on Sundays. Seek maternal blessings.'
    }
  };

  const remedyCards: any[] = [];
  lGrid.missingNumbers.forEach(item => {
    const n = item.digit;
    if (possibleRemedies[n]) {
      remedyCards.push(possibleRemedies[n]);
    }
  });

  return {
    kuaNumber,
    groupType,
    groupDescription,
    directions: currentDirections,
    colourCorrection: currentColours,
    zonesReport,
    remedyPlan: {
      targetMissingNodes,
      remedyCards
    }
  };
}
