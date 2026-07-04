import { DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { getCompoundDetails, CompoundInterpretation } from './compoundDatabase';
import { computeLoshuAnalysis } from './loshuEngine';
import { calculateAdvancedCompatibility, AdvancedCompatibilityReport } from './compatibilityKnowledgeBase';

export interface FullConsultationReport {
  summary: string;
  birthDetailNotes: string;
  driverConductorSync: string;
  compoundFrequencies: string;
  loshuGridAudit: string;
  arrowsInsight: string;
  missingNumbersRemedies: string;
  destinedCareerPath: string;
  financialVastuVibe: string;
  gemstoneRecommendation: string;
  remedyActionPlan: string;
  longTermForecast: string;
  consultantClosingNotes: string;
}

export function generateFullConsultationReport(
  name: string,
  dob: string,
  mobile: string
): FullConsultationReport {
  // Pre-calculations
  const parts = dob.split('-');
  const year = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  // Reduced parts
  const d1 = Math.floor(day / 10);
  const d2 = day % 10;

  // Roots
  let rDay = day;
  while (rDay > 9) {
    rDay = rDay.toString().split('').reduce((acc, x) => acc + parseInt(x, 10), 0);
  }

  const cleanDob = dob.replace(/[^0-9]/g, '');
  let rCond = cleanDob.split('').reduce((acc, x) => acc + parseInt(x, 10), 0);
  while (rCond > 9) {
    rCond = rCond.toString().split('').reduce((acc, x) => acc + parseInt(x, 10), 0);
  }

  // Get compound details
  const compDetails = getCompoundDetails(day);
  const lGrid = computeLoshuAnalysis(dob, name);

  // Derive driver & conductor planetary names
  const planets: Record<number, string> = {
    1: 'Sun (सूर्य) - Power, Authority, Leadership, Sovereign Soul',
    2: 'Moon (चंद्र) - Emotion, Partnership, Intuitive Creative Pulse',
    3: 'Jupiter (गुरु) - Wisdom, Councils, Academic Expansion, Devotion',
    4: 'Rahu (राहु) - Sudden Vision, Material Tactics, Unorthodox Speed',
    5: 'Mercury (बुध) - Smart Commerce, Public Relations, Multi-tasking Speed',
    6: 'Venus (शुक्र) - Luxury, Brand Magnetism, Fine Arts, Domestic Bliss',
    7: 'Ketu (केतु) - Analytical Depth, Astrological Eye, Detachment',
    8: 'Saturn (शनि) - Systematic Execution, Legacy Structuring, Delays',
    9: 'Mars (मंगल) - Fire Dynamics, Direct Courage, Surgical Precision'
  };

  const drPlanet = planets[rDay] || 'Sun (सूर्य)';
  const coPlanet = planets[rCond] || 'Jupiter (गुरु)';

  // 1. SUMMARY
  const summary = `Professional Indian Numerology blueprint crafted on the 22nd of June, 2026. This comprehensive evaluation is personalized for scholar ${name}, born on Day ${day} (Compound Day ${day} reducing to Driver ${rDay}) with Conductor (Bhagyank) ${rCond}. Your core vibration is ruled by the ${drPlanet} acting as your Active Driver and guided by ${coPlanet} as your Conductor (Bhagyank). This forms an authoritative, highly customized matrix that dictates your administrative prowess, private relationship habits, and monetary capacity.`;

  // 2. BIRTH DETAIL NOTES
  const birthDetailNotes = `Based on traditional Chaldean standards, your physical birth date is ${day}. Traditional Indian calculations show that you are influenced heavily by Compound Number ${day}. ${
    day > 9 
      ? `Because your Birth Day is a double-digit compound (${day}), you cannot be rated simply as standard Root ${rDay}. Your life is highly governed by the mixture of digit ${d1} and digit ${d2}. Every physical action you take works through this double-digit portal, presenting distinct opportunities before consolidating as Root Number ${rDay}.`
      : `Since you are born on a single-digit day (${day}), your planetary focus is pristine and unblended. You manifest the pure, unfiltered attributes of your ruling planet ${drPlanet} in all operational areas of your daily routines.`
  } This birth blueprint highlights a designated mental vibration path that provides massive competitive edges if aligned with your correct signature stroke and name spellings.`;

  // 3. DRIVER CONDUCTOR SYNC
  const syncs: Record<number, Record<number, string>> = {
    1: {
      1: 'Sun-Sun Union: Extreme administrative sovereignty. Hard to accept partner advice. Prompts independent ownership.',
      5: 'Sun-Mercury Synergy: Magnificent business and corporate communications flow. Effortless wealth traction.',
      8: 'Sun-Saturn Opposition: Severe delays, legal property disputes, friction with authority. Demands mustard oil remedies.',
    },
    5: {
      6: 'Mercury-Venus Harmony: Absolute luxury, premium textile design success, high public recognition.',
      9: 'Mercury-Mars Neutrality: Energetic sales speech. Watch against quick temper flares.'
    }
  };

  const syncText = syncs[rDay]?.[rCond] || 
    `Active Synastry between Driver ${rDay} and Conductor ${rCond} forms an average cooperative stream. Your Driver ${rDay} steers daily immediate reactions while Conductor ${rCond} governs long-term career outcomes. Working together, they direct your trajectory towards stable maturation around age 34.`;

  // 4. COMPOUND FREQUENCIES
  const compoundFrequencies = `Reviewing your birth date Compound Number ${day} reveals a highly personalized profile. According to the Traditional Chaldean Master Database:
  - Title: ${compDetails.title}
  - Core Essence: ${compDetails.meaning}
  - Future Trajectory Forecast: ${compDetails.prediction}
  - Major Talents: ${compDetails.positiveTraits.join(', ')}
  - Risks to Avoid: ${compDetails.negativeTraits.join(', ')}`;

  // 5. LOS HU GRID AUDIT
  const gridDigits = Object.values(lGrid.loshuGrid).filter(box => box.count > 0).map(box => box.digit);
  const presentNums = gridDigits.join(', ');
  const loshuGridAudit = `Your Lo Shu Grid map displays active numbers: [${presentNums}]. Key placements indicate:
  ${gridDigits.includes(4) && gridDigits.includes(9) && gridDigits.includes(2) ? '✓ Present Mental Plane (4,9,2): Pristine memory, strong logical calculations, strategic organization.' : '✗ Missing fully active Mental Plane: Relies heavily on practical notebooks to maintain detail accuracy.'}
  ${gridDigits.includes(3) && gridDigits.includes(5) && gridDigits.includes(7) ? '✓ Present Emotional Plane (3,5,7): Exceptional intuitive depth, heart-driven sales magnetic charm, deep empathy.' : '✗ Missing fully active Emotional Plane: Prompts emotional detachment; prefers structured logic over raw sentiment.'}
  ${gridDigits.includes(8) && gridDigits.includes(1) && gridDigits.includes(6) ? '✓ Present Practical Plane (8,1,6): High mechanical skills, robust commercial habits, physical execution power.' : '✗ Missing fully active Practical Plane: Needs disciplined schedule alarms to translate ideas to physical targets.'}`;

  // 6. ARROWS INSIGHT
  const arrowInsightText = lGrid.strengthArrows.length > 0
    ? `Your Lo Shu Grid has successfully formed ${lGrid.strengthArrows.length} majestic arrows of cosmic alignment: ${lGrid.strengthArrows.map(a => a.name).join(', ')}. In Indian Numerology, these represent dynamic strength pipelines that guarantee consistent public recognition. For example, ${lGrid.strengthArrows[0]?.description || 'balanced energy'}.`
    : `Your Lo Shu Grid does not form standard primary arrows. Instead, you are guided by dynamic single-axis grids, indicating that you learn major life lessons through direct personal grit and versatile experimental transitions rather than predictable family models.`;

  // 7. MISSING NUMBERS REMEDIES
  const missingDigits = lGrid.missingNumbers.map(item => item.digit);
  const missingString = missingDigits.join(', ');
  const missingDetails = lGrid.missingNumbers.map(item => {
    const n = item.digit;
    const missReds: Record<number, string> = {
      2: 'Missing 2 (Moon): Triggers sudden emotional loneliness. Remedy: Drink water in silver vessels and perform full-moon meditative walks.',
      3: 'Missing 3 (Jupiter): Limits administrative guidance. Remedy: Keep saffron tilak on forehead on yellow Thursdays.',
      4: 'Missing 4 (Rahu): Causes sudden financial delays. Remedy: Put a solid wooden square block on your office desktop.',
      5: 'Missing 5 (Mercury): Causes business calculation hiccups. Remedy: Feed fresh green grass to cows on Wednesdays.',
      6: 'Missing 6 (Venus): Retards luxury accumulation. Remedy: Spray light sandalwood mist at the main door of the house.',
      7: 'Missing 7 (Ketu): Limits analytical support. Remedy: Feed sesame bread to street dogs on Tuesdays.',
      8: 'Missing 8 (Saturn): Delays property assets acquisition. Remedy: Light sesame oil lamps under a Peepal tree on Saturdays.',
      9: 'Missing 9 (Mars): Reduces raw operational spark. Remedy: Keep a small copper ring or red silk thread on your right wrist.'
    };
    return missReds[n] || `Missing ${n}: Practice quiet mantra chanting.`;
  }).join('\n  ');

  const missingNumbersRemedies = `Your grid reveals empty nodes for numbers: [${missingString}]. In the Indian system, missing frequencies represent areas where your energy body is less naturally shielded:
  ${missingDetails}`;

  // 8. ALIGNED CAREER PATH
  const destinedCareerPath = `Aligning your Driver ${rDay} (psychic impulse) with Conductor (Bhagyank) ${rCond} reveals outstanding success in:
  - Primary Sector: ${compDetails.careerImpact}
  - Secondary Sector: ${rDay === 1 || rCond === 1 ? 'Government projects, corporate leadership, public services' : 
                          rDay === 5 || rCond === 5 ? 'Global trade, software applications, trading, PR, media relations' :
                          rDay === 6 || rCond === 6 ? 'Aesthetic hospitality, premium jewelry curation, real estate designs' :
                          'Industrial manufacturing, educational advisor, system security audits'}`;

  // 9. FINANCIAL VASTU VIBE
  const financialVastuVibe = `To optimize the wealth vibration of your workspace or residence according to traditional Vastu:
  - Primary Wealth Corner: South-East (ruled by Venus) and North (ruled by Kubera and Mercury). Keep this zone completely free of heavy clutter or red trash bins.
  - Active Support Direction: ${compDetails.luckyElements.direction}. Face this vector during high-profile client negotiation calls.
  - Safe Office Desk Decor: Keep a dynamic multi-leaf green plant in the North zone to multiply customer conversions.`;

  // 10. GEMSTONE ENGINE
  const primaryGem = getPrimaryGemstone(rDay);
  const secondaryGem = getSecondaryGemstone(rCond);
  const gemstoneRecommendation = `As a Grand Master Numerology prescription, your celestial gemstones are:
  - Primary Gemstone: ${primaryGem.name} (Acts as your aura shield)
    * When to wear: ${primaryGem.whenWear}
    * Key Benefit: ${primaryGem.benefit}
    * Precaution: ${primaryGem.warning}
  - Secondary Gemstone: ${secondaryGem.name} (Smooths destiny blockages)
    * When to wear: ${secondaryGem.whenWear}
    * Key Benefit: ${secondaryGem.benefit}`;

  // 11. REMEDY ACTION PLAN
  const remedyActionPlan = `Your 30-Day Spiritual Action Plan includes:
  1. Priority Color Scheme: Incorporate ${compDetails.luckyElements.color} in your daily wardrobe during critical sales or contract sign meetings.
  2. Signature Restructuring: Sign at a continuous fifteen-degree rising angle. Underline once to signify unyielding ambition, and NEVER end your name flow with a terminal dot.
  3. Weekly Fasting: Complete an evening light diet on ${compDetails.luckyElements.day}s to align with your ruling planet's vibrations.
  4. Core Mantras: Recite the planetary mantra of ${getPlanetName(rDay)} 108 times at sunrise daily.`;

  // 12. LONG-TERM FORECAST
  const longTermForecast = `Your personal cycles show that Personal Year 2026 is a phase of construction and deep networking. Your career will experience substantial acceleration, culminating in a pristine milestone around late 2027. Avoid long-distance commercial travel on Saturday evening intervals and prioritize partnerships with entities whose birth compound sums to 1, 5, or 6.`;

  // 13. CONSULTANT CLOSING NOTES
  const consultantClosingNotes = `Grand Master Advice: Remember that numbers do not bind your soul, they merely map current planetary highways. By correcting your name spelling Chaldean sum to match a friendly Mercury (5) or Venus (6) vibration, you can bypass 90% of inherited birth delays. May you rise to absolute victory, abundance, and peace!`;

  return {
    summary,
    birthDetailNotes,
    driverConductorSync: syncText,
    compoundFrequencies,
    loshuGridAudit,
    arrowsInsight: arrowInsightText,
    missingNumbersRemedies,
    destinedCareerPath,
    financialVastuVibe,
    gemstoneRecommendation,
    remedyActionPlan,
    longTermForecast,
    consultantClosingNotes
  };
}

function getPlanetName(num: number): string {
  const ps: Record<number, string> = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
  };
  return ps[num] || 'Sovereign';
}

function getPrimaryGemstone(root: number): { name: string; benefit: string; whenWear: string; warning: string } {
  const gems: Record<number, { name: string; benefit: string; whenWear: string; warning: string }> = {
    1: { name: 'Ruby (Manik - 4.5 Carats in Gold ring)', benefit: 'Amplifies leadership courage, removes optical issues, brings high authority.', whenWear: 'Sunday mornings during rising Sun hours on index finger.', warning: 'Do not wear with Blue Sapphire or Diamond.' },
    2: { name: 'Natural Pearl (Moti - 5 Carats in Silver ring)', benefit: 'Stabilizes emotional mood swings, brings mental peace, calms sleep cycle.', whenWear: 'Monday mornings on little finger of right hand.', warning: 'Avoid during severe lung congestion.' },
    3: { name: 'Yellow Sapphire (Pukhraj - 5 Carats in Gold)', benefit: 'Secures high academic gains, expands spiritual wisdom, guarantees helpful mentors.', whenWear: 'Thursday mornings on index finger of right hand.', warning: 'Ensure no black spots exist on the stone.' },
    4: { name: 'Hessonite (Gomedh - 4 Carats in Silver)', benefit: 'Bypasses sudden electronic delays, clears digital confusion, provides overnight rise.', whenWear: 'Saturday evening after sunset on middle finger.', warning: 'Avoid if driver number is 9.' },
    5: { name: 'Emerald (Panna - 4 Carats in Gold)', benefit: 'Exceptional speech clarity, multiplies market calculations, smooths trading partnerships.', whenWear: 'Wednesday mornings on little finger.', warning: 'Always clean it with pure milk before first use.' },
    6: { name: 'Diamond or Opal (0.5 Carat in White Gold)', benefit: 'Attracts rich brand equity, multiplies luxury home assets, brings romantic luck.', whenWear: 'Friday mornings during sunrise on ring finger.', warning: 'Do not wear if you suffer from aggressive vanity loops.' },
    7: { name: 'Cat’s Eye (Lehsuniya - 4 Carats in Silver)', benefit: 'Protects from hidden enemies, multiplies metaphysical focus, prevents vehicle damage.', whenWear: 'Tuesday late evening on middle finger.', warning: 'Do not wear with Red Coral or Ruby.' },
    8: { name: 'Blue Sapphire (Neelam - 3 Carats in Panchdhatu)', benefit: 'Extremely fast vehicle protection, constructs heavy real estate gains, guarantees lawful discipline.', whenWear: 'Saturday sunset hours on middle finger.', warning: 'CRITICAL: Test under pillow for 3 days before wearing.' },
    9: { name: 'Red Coral (Moonga - 6 Carats in Copper ring)', benefit: 'Boosts energetic blood defense, removes laziness, gives absolute command on fields.', whenWear: 'Tuesday mornings during sunrise on ring finger.', warning: 'Avoid if suffering from severe vascular pressure.' }
  };
  return gems[root] || gems[1];
}

function getSecondaryGemstone(root: number): { name: string; benefit: string; whenWear: string } {
  const gems: Record<number, { name: string; benefit: string; whenWear: string }> = {
    1: { name: 'Red Garnet', benefit: 'Increases local physical stamina and active professional confidence.', whenWear: 'Sunday mornings' },
    2: { name: 'Moonstone', benefit: 'Calms internal nervous tension and boosts feminine intuition waves.', whenWear: 'Monday mornings' },
    3: { name: 'Yellow Topaz', benefit: 'Provides stable passive profits and guards financial files.', whenWear: 'Thursday mornings' },
    4: { name: 'Amber', benefit: 'Maintains nervous coordinate speeds on long travels.', whenWear: 'Saturdays' },
    5: { name: 'Green Jade', benefit: 'Assures brilliant calculation stability and retail sales luck.', whenWear: 'Wednesday mornings' },
    6: { name: 'White Zircon', benefit: 'Boosts attractive visual presentations during grand brand launches.', whenWear: 'Friday sunrise' },
    7: { name: 'Tiger Eye', benefit: 'Sharpens physical focus and provides instant grounding protection.', whenWear: 'Tuesdays' },
    8: { name: 'Iolite', benefit: 'Cleanses legacy delays and stabilizes lower heel joints.', whenWear: 'Saturday sunset' },
    9: { name: 'Carnelian', benefit: 'Floods the cellular system with robust stamina and courage.', whenWear: 'Tuesday sunrise' }
  };
  return gems[root] || gems[5];
}
