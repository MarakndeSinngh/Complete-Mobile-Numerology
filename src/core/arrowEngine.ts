import { ArrowAnalysis } from './types';

const inactiveArrowsData: Record<string, {
  meaning: string;
  strength: string;
  risk: string;
  careerImpact: string;
  relationshipImpact: string;
  remedy: string;
}> = {
  'Arrow of Determination': {
    meaning: 'Latent resolve. You may find yourself starting tasks with high enthusiasm but struggling to maintain single-minded commitment when obstacles arise.',
    strength: 'Flexible approach; willing to adapt your goals rather than blindly fighting brick walls.',
    risk: 'Prone to self-doubt, easily discouraged by sudden delays, looks for external motivation.',
    careerImpact: 'Thrives in collaborative teams where others provide the structural drive and push.',
    relationshipImpact: 'Requires constant reassurance and partner encouragement to stay aligned on long-term goals.',
    remedy: 'Light a red candle or ghee lamp in the South direction every evening to activate raw solar willpower.'
  },
  'Arrow of Intellect': {
    meaning: 'Latent mental plane. Rather than relying on pure memory or academic theories, you learn best through visual experience and repetitive practical lessons.',
    strength: 'Intuitive thinking; avoids analysis paralysis by relying on real-world feedback loops.',
    risk: 'May struggle with heavy data analysis, abstract mathematical modeling, or long theoretical study.',
    careerImpact: 'Succeeds in hands-on operations, physical trading, or direct sales over academic research.',
    relationshipImpact: 'Prefers simple, honest, and action-oriented communication over intellectual debate.',
    remedy: 'Keep a copper pen or a green aventurine crystal on your study table to boost concentration.'
  },
  'Arrow of Planning': {
    meaning: 'Latent planning plane. You are a spontaneous action-taker who prefers executing first and fixing errors on the fly rather than over-analyzing beforehand.',
    strength: 'Rapid response rate; highly agile and ready to pivot instantly in fluid scenarios.',
    risk: 'Prone to disorganized schedules, poor time estimation, and lack of preventative backup systems.',
    careerImpact: 'Succeeds in fast-paced startup roles, customer service, or crisis mitigation where rigid plans fail.',
    relationshipImpact: 'Spontaneous partner who loves surprise plans, but may occasionally miss important family dates.',
    remedy: 'Maintain a physical daily journal; wear a wooden-bead bracelet to cultivate structured grounding.'
  },
  'Arrow of Practicality': {
    meaning: 'Latent practicality plane. You are guided by abstract ideas and creative visions rather than mundane materialistic or physical tasks.',
    strength: 'High creative sensitivity, unique artistic visions, and ability to think beyond pure utility.',
    risk: 'Struggles with physical organization, routine paperwork, tax compliance, or manual labor.',
    careerImpact: 'Excels in strategic consulting, digital designs, and creative conceptualization.',
    relationshipImpact: 'Provides rich emotional and romantic gestures, but may struggle with practical domestic chores.',
    remedy: 'Walk barefoot on clean soil or grass for 5 minutes daily to absorb stabilizing earth energies.'
  },
  'Arrow of Emotional Balance': {
    meaning: 'Latent emotional plane. Your emotional state may experience high fluctuations, shifting rapidly between absolute enthusiasm and quiet detachment.',
    strength: 'Deep emotional empathy when fully engaged; highly expressive when they feel safe.',
    risk: 'Mood swings, holding onto past emotional hurts, and tendency to suppress personal desires.',
    careerImpact: 'Works best in low-stress environments where performance pressure is consistent rather than sporadic.',
    relationshipImpact: 'Needs a stable, emotionally mature partner who can anchor their fluctuating feelings.',
    remedy: 'Drink water from a silver cup and wear a flawless white pearl pendant set in silver.'
  },
  'Arrow of Spirituality': {
    meaning: 'Latent spiritual plane. You rely heavily on physical evidence, logical analysis, and tangible assets rather than abstract philosophical beliefs.',
    strength: 'Grounded realism; not easily deceived by fake gurus or speculative mystical promises.',
    risk: 'Skeptical of unseen energies, struggles to find inner peace during severe professional failures.',
    careerImpact: 'Excellent in commercial trade, hard sciences, and corporate finance where facts rule.',
    relationshipImpact: 'Very realistic expectations; seeks practical and stable family commitments.',
    remedy: 'Meditate with a small amethyst geode or dedicate 10 minutes of silent gratitude every sunrise.'
  },
  'Arrow of Activity': {
    meaning: 'Latent activity plane. You prefer a calm, quiet, and reflective lifestyle rather than continuous physical movement or high-speed events.',
    strength: 'Excellent capacity for deep, quiet research, deliberate contemplation, and stress-free rest.',
    risk: 'Prone to physical lethargy, delay in starting exercises, and resistance to sudden travel changes.',
    careerImpact: 'Thrives in remote administrative, writing, or analytical roles requiring low travel.',
    relationshipImpact: 'Enjoys peaceful, slow-paced dates and cozy evenings at home over loud crowded parties.',
    remedy: 'Wear a small red carnelian bead or keep a copper pyramid in your active workspace.'
  },
  'Arrow of Frustration': {
    meaning: 'The Arrow of Frustration is inactive. Your diagonal plane of dynamic energy is well-supported, shielding you from chronic friction.',
    strength: 'Natural mental patience; accepts delays without feeling personally targeted by destiny.',
    risk: 'No major risk; baseline resilience remains highly stable under standard stress.',
    careerImpact: 'Builds stable, long-term tenure in organisations without feeling the urge to run away.',
    relationshipImpact: 'Keeps arguments healthy and avoids projecting personal career failures onto the spouse.',
    remedy: 'No major remedy needed. Maintain standard gratitude practices.'
  },
  'Arrow of Weak Will': {
    meaning: 'The Arrow of Weak Will is inactive. Your willpower plane is active or balanced, giving you strong self-belief.',
    strength: 'High self-determination; capable of making independent life-changing decisions.',
    risk: 'Can border on obstinacy if your opinions are not validated by trusted associates.',
    careerImpact: 'Thrives in entrepreneurship, leadership, or high-autonomy professional roles.',
    relationshipImpact: 'Clear boundary-setter; ensures mutual respect in partnership.',
    remedy: 'No corrective remedy needed. Share your strength by mentoring younger colleagues.'
  },
  'Arrow of Isolation': {
    meaning: 'The Arrow of Isolation is inactive. Your emotional/spiritual coordinates are well-linked, keeping you socially integrated.',
    strength: 'Strong social intelligence, natural networking skill, and ability to form meaningful bonds.',
    risk: 'Can occasionally overcommit to social events at the expense of personal quiet hours.',
    careerImpact: 'Thrives in public relations, client management, team leadership, and marketing.',
    relationshipImpact: 'Warm, expressive, and easily connected; shares inner secrets with complete trust.',
    remedy: 'Donate milk to the needy on Mondays to keep your social channels aligned and clean.'
  },
  'Arrow of Impatience': {
    meaning: 'The Arrow of Impatience is inactive. You possess a patient, steady approach to physical and professional compounding.',
    strength: 'Outstanding capacity for long-term investments, detail-oriented work, and waiting for natural results.',
    risk: 'Might stay too long in low-growth scenarios due to high tolerance for routine.',
    careerImpact: 'Highly reliable in banking, structural engineering, and deep research roles.',
    relationshipImpact: 'Nurturing, slow-to-anger partner who resolves disputes through quiet dialogue.',
    remedy: 'No corrective remedy needed. Keep your workspace illuminated with warm yellow light.'
  },
  'Arrow of Confusion': {
    meaning: 'The Arrow of Confusion is inactive. Your mental clarity coordinates are sound, ensuring clear thinking and rapid decisions.',
    strength: 'Excellent cognitive logic; quickly filters out noisy speculations or false rumors.',
    risk: 'Can become overly cynical or demanding of perfect proof before acting.',
    careerImpact: 'Highly effective in stock trading, forensic auditing, and legal representation.',
    relationshipImpact: 'Clear, direct, and unambiguous in communicating relationship boundaries.',
    remedy: 'Maintain a silver coin in your wallet to preserve this high-frequency mental purity.'
  }
};

const arrowsList = [
  { name: 'Arrow of Determination', digits: [9, 5, 1], type: 'STRENGTH' as const },
  { name: 'Arrow of Intellect', digits: [9, 5, 1], type: 'STRENGTH' as const },
  { name: 'Arrow of Planning', digits: [4, 3, 8], type: 'STRENGTH' as const },
  { name: 'Arrow of Practicality', digits: [8, 1, 6], type: 'STRENGTH' as const },
  { name: 'Arrow of Emotional Balance', digits: [3, 5, 7], type: 'STRENGTH' as const },
  { name: 'Arrow of Spirituality', digits: [2, 5, 8], type: 'STRENGTH' as const },
  { name: 'Arrow of Activity', digits: [2, 7, 6], type: 'STRENGTH' as const },
  { name: 'Arrow of Frustration', digits: [4, 5, 6], type: 'WEAKNESS' as const },
  { name: 'Arrow of Weak Will', digits: [9, 5, 1], type: 'WEAKNESS' as const },
  { name: 'Arrow of Isolation', digits: [2, 5, 8], type: 'WEAKNESS' as const },
  { name: 'Arrow of Impatience', digits: [8, 1, 6], type: 'WEAKNESS' as const },
  { name: 'Arrow of Confusion', digits: [9, 5, 1], type: 'WEAKNESS' as const }
];

export function calculateArrows(enhancedGrid: Record<number, number>): ArrowAnalysis[] {
  return arrowsList.map(arr => {
    let isActive = false;
    if (arr.type === 'STRENGTH') {
      isActive = arr.digits.every(d => (enhancedGrid[d] || 0) > 0);
    } else {
      isActive = arr.digits.every(d => (enhancedGrid[d] || 0) === 0);
    }

    const fallback = inactiveArrowsData[arr.name] || {
      meaning: `No major active link for this plane.`,
      strength: `Latent capabilities; waiting to be unlocked.`,
      risk: `Low focus in this category.`,
      careerImpact: `Normal operations; use manual checklists.`,
      relationshipImpact: `Requires effort and compromise.`,
      remedy: `Carry standard protection crystals.`
    };

    let meaning = fallback.meaning;
    let strength = fallback.strength;
    let risk = fallback.risk;
    let careerImpact = fallback.careerImpact;
    let relationshipImpact = fallback.relationshipImpact;
    let remedy = fallback.remedy;

    if (isActive) {
      if (arr.name === 'Arrow of Determination') {
        meaning = "Unstoppable inner resolve. Challenges are viewed as immediate stepping stones.";
        strength = "Will power, aggressive target completion, leadership initiative.";
        risk = "Overbearing attitude, stubbornness, neglects team feedback.";
        careerImpact = "Successful as startup founders, project heads, and crisis administrators.";
        relationshipImpact = "Extremely protective; demands transparency and single-pointed focus.";
        remedy = "Perform 10 minutes of deep meditation daily; wear a copper coin.";
      } else if (arr.name === 'Arrow of Intellect') {
        meaning = "Vast memory retention, rapid academic wisdom, logical problem solvers.";
        strength = "Mental sharpness, structural strategy, abstract ideas processing.";
        risk = "Arrogance of knowledge, easily bored by daily physical work.";
        careerImpact = "Successful in tech architecture, complex asset calculations, and authorship.";
        relationshipImpact = "Needs rich intellectual banter; avoids simple small talk.";
        remedy = "Teach children for free on Thursdays; keep green study lamps.";
      } else if (arr.name === 'Arrow of Planning') {
        meaning = "Excellent systemic planners, masters of structure, blueprints, and future projections.";
        strength = "Microscopic detailing, foresight, preventative security measures.";
        risk = "Analysis paralysis; easily delayed trying to find perfect variables.";
        careerImpact = "Highly suitable for structural design, architectural planning, database layouts.";
        relationshipImpact = "Prefers systematic relationship plans; values timeline discipline.";
        remedy = "Sit facing North-East; light green incense sticks on Wednesdays.";
      } else if (arr.name === 'Arrow of Practicality') {
        meaning = "Grounded physical workhorses. Believes only in what can be built or verified.";
        strength = "Hard work, manual trade dexterity, realistic commercial expectations.";
        risk = "Slightly cynical; dismisses intuitive suggestions without testing.";
        careerImpact = "Highly valuable in operations, physical stock trade, civil engineering.";
        relationshipImpact = "Very realistic; expresses warmth through building assets.";
        remedy = "Wear steel jewelry or carry high-grade iron keys.";
      } else if (arr.name === 'Arrow of Emotional Balance') {
        meaning = "High emotional stability; remains unperturbed by critical social reviews.";
        strength = "Calmness under pressure, high psychological counseling skills.";
        risk = "Can appear emotionally distant or cold to over-expressive peers.";
        careerImpact = "Suited for customer relations, human resources, conflict resolution.";
        relationshipImpact = "Very steady; handles arguments without shouting.";
        remedy = "Chant lunar mantras 'OM SOM SOMA_YAE NAMAH' on Mondays.";
      } else if (arr.name === 'Arrow of Spirituality') {
        meaning = "Deep spiritual awareness; natural interest in mystical sciences.";
        strength = "Inner peace, meditation discipline, somatic healing capacities.";
        risk = "Can escape into philosophical thoughts; ignores daily budgeting chores.";
        careerImpact = "Thrives as spiritual mentors, occult sciences researchers, yoga guides.";
        relationshipImpact = "Seeks high soul conjunctions; values silent mutual presence.";
        remedy = "Meditate with small amethyst geodes or clear quartz spheres.";
      } else if (arr.name === 'Arrow of Activity') {
        meaning = "Hyper-active physical engine. Constantly executing commercial actions.";
        strength = "Rapid response speeds, high energy, athletic and traveling prowess.";
        risk = "Prone to sudden physical fatigue due to overworking.";
        careerImpact = "Successful in rapid sales campaigns, onsite audits, defense administration.";
        relationshipImpact = "Energetic partner; loves outdoor dates and sports activity.";
        remedy = "Carry small red carnelian gemstones or wear copper rings.";
      } else if (arr.name === 'Arrow of Frustration') {
        meaning = "All three diagonal numbers (4-5-6) missing. Prone to constant friction.";
        strength = "Adaptive patience under delayed systems.";
        risk = "Chronic frustration when goals do not compound linearly.";
        careerImpact = "Should avoid highly speculative trading roles.";
        relationshipImpact = "Requires extreme patience; avoid projecting work delays.";
        remedy = "Keep active golden pyramids in your South-East corner.";
      } else if (arr.name === 'Arrow of Weak Will') {
        meaning = "Willpower plane numbers (9-5-1) missing. Struggles to sustain raw drive.";
        strength = "High flexibility; takes external guidance beautifully.";
        risk = "Easily swayed by group opinions; high self-doubt rates.";
        careerImpact = "Perform best in structured teams with strict timelines.";
        relationshipImpact = "Requires gentle partners who support their micro decisions.";
        remedy = "Wear single-bead Rudraksha and perform Sunday sun prayers.";
      } else if (arr.name === 'Arrow of Isolation') {
        meaning = "Emotional/spiritual numbers (2-5-8) missing. Feels isolated or misunderstood.";
        strength = "Deep independence; self-contained mental fortress.";
        risk = "Struggles to voice emotional vulnerabilities to family members.";
        careerImpact = "Works beautifully in quiet analytical, testing, or research roles.";
        relationshipImpact = "Takes a very long time to share absolute trust.";
        remedy = "Donate yellow grain seeds to birds on Thursday mornings.";
      } else if (arr.name === 'Arrow of Impatience') {
        meaning = "Practical plane numbers (8-1-6) missing. Prone to intense impatience.";
        strength = "Rapid initiation speeds; quickly starts new projects.";
        risk = "Abandons plans too early if physical compounding is slow.";
        careerImpact = "Should partner with operational specialists who execute details.";
        relationshipImpact = "May rush partners into quick life-altering choices.";
        remedy = "Walk barefoot on natural green grass for 5 minutes daily.";
      } else if (arr.name === 'Arrow of Confusion') {
        meaning = "Clarity plane numbers (9-5-1) missing. Prone to persistent confusion.";
        strength = "Multi-perspective thinker; evaluates multiple paths.";
        risk = "Deep hesitation; misses hot market opportunities.";
        careerImpact = "Thrives in slow structural roles with zero emergency calls.";
        relationshipImpact = "Struggles to state boundaries clearly; needs patient listeners.";
        remedy = "Maintain silver coins in your active wallet space.";
      }
    }

    return {
      name: arr.name,
      digits: arr.digits,
      type: arr.type,
      isActive,
      status: isActive ? 'ACTIVE' : 'INACTIVE',
      meaning,
      strength,
      risk,
      careerImpact,
      relationshipImpact,
      remedy
    };
  });
}
