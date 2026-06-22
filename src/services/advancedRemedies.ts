import { reduceToSingleDigit } from './numerologyEngine';

export interface AdvancedRemedies {
  luckyNumbers: number[];
  luckyDates: number[];
  luckyDays: string[];
  luckyColors: string[];
  luckyDirections: string[];
  gemstones: {
    primary: { name: string; weight: string; metal: string; finger: string; reason: string };
    secondary: { name: string; weight: string; metal: string; finger: string; reason: string };
    optional: { name: string; weight: string; metal: string; finger: string; reason: string };
  };
  advices: {
    career: string;
    business: string;
    relationship: string;
    spiritual: string;
    house: string;
    signature: string;
  };
}

const COLOR_MAP: Record<number, string[]> = {
  1: ['Ruby Red', 'Golden saffron', 'Bright orange'],
  2: ['Moti White', 'Creamy pearl', 'Silver grey'],
  3: ['Bright Yellow', 'Mustard yellow', 'Saffron'],
  4: ['Light blue', 'Electric blue', 'Grey'],
  5: ['Emerald green', 'Mint green', 'Turquoise'],
  6: ['Cream white', 'Soft pink', 'Silver white'],
  7: ['Light green', 'Smoke grey', 'White'],
  8: ['Dark blue', 'Indigo blue', 'Grey shades'],
  9: ['Blood red', 'Deep orange', 'Saffron']
};

const DAY_MAP: Record<number, string[]> = {
  1: ['Sunday', 'Monday'],
  2: ['Monday', 'Sunday', 'Friday'],
  3: ['Thursday', 'Tuesday'],
  4: ['Sunday', 'Wednesday'],
  5: ['Wednesday', 'Friday'],
  6: ['Friday', 'Wednesday'],
  7: ['Thursday', 'Sunday'],
  8: ['Saturday', 'Friday'],
  9: ['Tuesday', 'Thursday']
};

const DIRECTION_MAP: Record<number, string[]> = {
  1: ['East (Kuber Gates)', 'North'],
  2: ['North-West', 'North'],
  3: ['North-East (Prasad)', 'East'],
  4: ['South-West', 'South'],
  5: ['East', 'North'],
  6: ['South-East (Agni)', 'North-West'],
  7: ['North-East', 'West'],
  8: ['West', 'South-East'],
  9: ['South', 'East']
};

export function generateAdvancedRemedies(
  driver: number,
  conductor: number,
  nameNum: number,
  mobileStr: string,
  missingNumbers: number[]
): AdvancedRemedies {
  
  // 1. Core Gemstone Allocations dynamically
  // Setup standard metal & finger rules
  const gemstones = {
    primary: { name: '', weight: '', metal: '', finger: '', reason: '' },
    secondary: { name: '', weight: '', metal: '', finger: '', reason: '' },
    optional: { name: '', weight: '', metal: '', finger: '', reason: '' }
  };

  if (driver === 1 || conductor === 1) {
    gemstones.primary = {
      name: 'Ruby (Manik)',
      weight: '5.25 to 7.25 Carats',
      metal: '22k Gold or Copper',
      finger: 'Right Ring Finger',
      reason: `As your chart is governed by Sun Energy (1), a premium Ruby aligns your internal leadership nodes and stimulates active career promotions.`
    };
  } else if (driver === 2 || conductor === 2) {
    gemstones.primary = {
      name: 'Natural Pearl (Moti)',
      weight: '7.5 to 9 Carats',
      metal: 'Pure Silver',
      finger: 'Right Little Finger',
      reason: `To anchor your restless, creative Moon energy (2), a natural South Sea Pearl calms emotional fluctuations and brings harmony to partnerships.`
    };
  } else if (driver === 3 || conductor === 3) {
    gemstones.primary = {
      name: 'Yellow Sapphire (Pukhraj)',
      weight: '4.25 to 6.5 Carats',
      metal: 'Auspicious Yellow Gold',
      finger: 'Right Index Finger',
      reason: `Aligned with Guru Jupiter (3), this gemstone unlocks excellent educational fields, wisdom councils, and steady wealth accumulation.`
    };
  } else if (driver === 4 || conductor === 4) {
    gemstones.primary = {
      name: 'Hessonite (Gomedh)',
      weight: '5 to 7 Carats',
      metal: 'Silver or Panchdhatu',
      finger: 'Right Middle Finger',
      reason: `Required to stabilize unconventional Rahu energy (4), reducing sudden health obstructions and calming digital chaos.`
    };
  } else if (driver === 5 || conductor === 5) {
    gemstones.primary = {
      name: 'Emerald (Panna)',
      weight: '4.5 to 6 Carats',
      metal: 'Gold or Brass',
      finger: 'Right Little Finger',
      reason: `Aligned with Budh Mercury (5), an Emerald significantly boosts your public speaking abilities, client negotiations, and trading profits.`
    };
  } else if (driver === 6 || conductor === 6) {
    gemstones.primary = {
      name: 'Opal / White Zircon',
      weight: '6 to 8 Carats',
      metal: 'Pure Platinum or White Gold',
      finger: 'Right Ring/Little Finger',
      reason: `To feed your Venusian frequency (6), Opal strengthens luxury comforts, relationship bonding, and aesthetic brand values.`
    };
  } else if (driver === 7 || conductor === 7) {
    gemstones.primary = {
      name: 'Cat’s Eye (Lehsuniya)',
      weight: '4.5 to 6 Carats',
      metal: 'Sterling Silver',
      finger: 'Right Ring/Middle Finger',
      reason: `Aligned with Ketu (7), a high-dome Cat’s Eye triggers sharp metaphysical insight and prevents sudden business betrayal.`
    };
  } else if (driver === 8 || conductor === 8) {
    gemstones.primary = {
      name: 'Blue Sapphire (Neelam)',
      weight: '3.5 to 5.25 Carats',
      metal: 'Silver or Iron',
      finger: 'Right Middle Finger',
      reason: `Aligned with Saturn (8). Blue Sapphire provides massive long-term defensive shielding, building permanent commercial structures.`
    };
  } else {
    // 9 Mars
    gemstones.primary = {
      name: 'Red Coral (Moonga)',
      weight: '6.5 to 8.25 Carats',
      metal: 'Copper or Gold',
      finger: 'Right Ring Finger',
      reason: `Aligned with Mangal Mars (9), high-density Red Coral boosts structural stamina, blood defense, and defeats legal challenges.`
    };
  }

  // Secondary Gemstone based on missing numbers
  if (missingNumbers.includes(5)) {
    gemstones.secondary = {
      name: 'Green Tourmaline',
      weight: '3.5 to 5 Carats',
      metal: 'Auspicious Silver',
      finger: 'Right Little Finger',
      reason: `Since 5 (stability/Mercury) is missing in your birth charts, a green tourmaline serves as an energetic stable block, securing cash flow.`
    };
  } else if (missingNumbers.includes(6)) {
    gemstones.secondary = {
      name: 'Rose Quartz Crystal',
      weight: 'As a structural desk tree or pendant',
      metal: 'Silver or Copper wire',
      finger: 'Wear on neck or keep on study/billing spot',
      reason: `Your chart lacks luxurious Venus vibration (6). Carrying Rose quartz opens deep support systems, luxury channels, and family harmony.`
    };
  } else {
    // Default supportive secondary gem
    gemstones.secondary = {
      name: 'Ametrine / Amethyst',
      weight: '5 to 7.5 Carats',
      metal: 'Silver',
      finger: 'Middle Finger',
      reason: `Acts as a spiritual amplifier. Promotes deep study patterns and releases stress cycles.`
    };
  }

  // Optional supportive gemstone based on name compatibility
  const nameRoot = reduceToSingleDigit(nameNum);
  if ([5, 6, 1].includes(nameRoot)) {
    gemstones.optional = {
      name: 'White Topaz',
      weight: '4 to 6 Carats',
      metal: 'Silver',
      finger: 'Ring Finger',
      reason: `Supports your friendly name vibration, ensuring that social circles and public reputation remain highly beneficial.`
    };
  } else {
    gemstones.optional = {
      name: 'Tiger Eye Bracelet',
      weight: '10mm beads',
      metal: 'Elastic thread',
      finger: 'Wear on Left Wrist',
      reason: `Increases dynamic focus. Unlocks deep business courage and serves as an evil eye protector.`
    };
  }

  // 2. Personal Advices depending on specific Driver/Conductor and Missing patterns
  let careerAdvice = '';
  let businessAdvice = '';
  let relationshipAdvice = '';
  let spiritualAdvice = '';
  let houseAdvice = '';
  let signatureAdvice = '';

  // Personalized Advice Logic blocks
  if (driver === 1 || conductor === 1) {
    careerAdvice = 'Sovereign roles. Push for administrative executive functions, directorships, or government consultant brackets. Do not work as a junior under hostile bosses.';
    businessAdvice = 'Brand building. Avoid sleeping partners showing planetary totals 8. Run independent branding campaigns with high-quality visual designs.';
  } else if (driver === 3 || conductor === 3) {
    careerAdvice = 'Education, legal boards, consultancy, and policy advisors. Your mental wisdom commands respect. Teach, research, and edit.';
    businessAdvice = 'High knowledge consulting. Form partnerships on Wednesdays or Thursdays. Avoid trading in black garments or materials.';
  } else if (driver === 5 || conductor === 5) {
    careerAdvice = 'Excellent negotiable trading portals, PR director, marketing, or dynamic stock advisory. Your brain operates at high speeds.';
    businessAdvice = 'Rapid commercial inventory. Make your primary business firm name sum up to 5 or 6 to attract continuous client orders.';
  } else {
    careerAdvice = 'Professional functions requiring persistent structure, precision, or creative designing. Keep daily records extremely tidy.';
    businessAdvice = 'Auspicious retail operations. Run deep analytics before making long-term capital investments under Saturn and Rahu hours.';
  }

  // Relationship advice based on Moon/Mars/Venus balances
  if ([2, 7, 9].includes(driver)) {
    relationshipAdvice = 'Highly sensitive temperaments. Avoid bringing workspace debates into the dining room. Practice silent breathing loops during sunset hours.';
  } else {
    relationshipAdvice = 'Ensure that family responsibilities are equally balanced. Give your partner a luxury gift or go on mini-tours during Friday moons.';
  }

  // Spiritual advice based on missing numbers
  if (missingNumbers.includes(7)) {
    spiritualAdvice = 'Perform silent chanting of the Ketu Beej Mantra: "Om Kem Ketave Namah" 108 times at dusk. Read spiritual/scientific texts before sleeping.';
  } else if (missingNumbers.includes(3)) {
    spiritualAdvice = 'Auspicious. Offer water to a banana tree on yellow Thursdays and feed gram lentils to poor children to activate Jupiter.';
  } else {
    spiritualAdvice = 'Chant the Gayatri Mantra 11 times at sunrise to harness strong solar frequencies. Keep a clean copper coin in your travel wallet.';
  }

  if (missingNumbers.includes(2) || missingNumbers.includes(4)) {
    houseAdvice = 'Keep the North-East direction of your house or office completely clear of clutter, toilets, or heavy red cupboards to preserve financial accumulation channels.';
  } else {
    houseAdvice = 'Mount a custom metal windchime or a dynamic copper pyramid near your main entrance to filter incoming electronic fields.';
  }

  signatureAdvice = 'Begin signature upwards at a 15-degree rising angle. Never execute a trailing dot below; instead, underline the signature completely to establish stable confidence.';

  // Lucky parameters
  const dNode = driver;
  const luckyNumbers = [11, 22, 33].includes(dNode) ? [5, 1, 6] : Array.from(new Set([dNode, 5, 6, 1].filter(n => n !== 8)));
  const luckyDates = [1, 5, 6, 10, 14, 15, 19, 23, 24].filter(d => reduceToSingleDigit(d) !== 8);
  const luckyDays = DAY_MAP[dNode] || ['Wednesday', 'Friday'];
  const luckyColors = COLOR_MAP[dNode] || ['Mint Green', 'Cream White'];
  const luckyDirections = DIRECTION_MAP[dNode] || ['North', 'East'];

  return {
    luckyNumbers,
    luckyDates,
    luckyDays,
    luckyColors,
    luckyDirections,
    gemstones,
    advices: {
      career: careerAdvice,
      business: businessAdvice,
      relationship: relationshipAdvice,
      spiritual: spiritualAdvice,
      house: houseAdvice,
      signature: signatureAdvice
    }
  };
}
