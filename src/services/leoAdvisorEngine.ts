import { DOBAnalysis, NameAnalysis, MobileAnalysis } from '../types';

export interface LeoAdvice {
  career: {
    title: string;
    description: string;
    remedy: string;
  };
  relationship: {
    title: string;
    description: string;
    remedy: string;
  };
  health: {
    title: string;
    description: string;
    remedy: string;
  };
}

export function generateLeoAdvisorActions(
  dobData: DOBAnalysis,
  nameData: NameAnalysis,
  mobileData: MobileAnalysis
): LeoAdvice {
  const driver = dobData.birthNumber;
  const conductor = dobData.lifePathNumber;

  // Career Recommendations based on Driver Number (1-9)
  const careerMap: Record<number, { title: string; description: string; remedy: string }> = {
    1: {
      title: "Solar Leadership Initiation",
      description: "Take absolute charge of your primary professional projects. Avoid passive dependency on peers or waiting for consensus; the celestial transits favor bold, independent executive decisions.",
      remedy: "Sign all important agreements or launch premium campaign directories on Wednesdays or Sundays after 10:00 AM, facing strictly East."
    },
    2: {
      title: "Harmonious Strategic Partnerships",
      description: "This is a cycle for synergistic collaboration rather than solo drives. Build diplomatic bridges with key stakeholder groups and align client expectations through gentle, empathetic negotiations.",
      remedy: "Schedule critical partnership briefs or contract closures on Mondays. Wear soft cream or white colors during negotiations."
    },
    3: {
      title: "Wisdom-Driven System Expansion",
      description: "Your intellectual capacity is at an all-time high. Focus on knowledge-sharing, systemizing standard operating procedures, training subordinates, or drafting core expansion strategies.",
      remedy: "Place a small yellow crystal or keep your notebooks in the North-East sector. Do not take speculative or high-risk loans on Thursdays."
    },
    4: {
      title: "Rahu Out-of-the-Box Breakthroughs",
      description: "Sudden technology, digital optimization, or speculative opportunities are arriving. Challenge outdated operational structures, but protect against hasty investments that seem too good to be true.",
      remedy: "Keep your workspace clutter-free and avoid signing long-term lock-in service level agreements on Saturdays."
    },
    5: {
      title: "Mercurial Brand & Trade Acceleration",
      description: "Your verbal magnetism is highly active. Pitch brand corrections, renegotiate commercial rates, update product communications, or launch marketing campaigns with high confidence.",
      remedy: "Verify that your primary digital name spelling sums to Chaldean #5 or #6 before pushing public announcements. Do important presentations on Wednesdays."
    },
    6: {
      title: "Venus Aesthetic & Premium Styling",
      description: "Upgrade your public-facing brand aesthetics, portfolio styling, or customer experience. High-quality visual representation attracts wealthy, high-ticket clients during this Venus transit.",
      remedy: "Wear mild floral fragrance before pitching. Keep a fresh white flower vase in the South-East zone of your desk."
    },
    7: {
      title: "Deep System Audit & Product Refinement",
      description: "A superb month for analytical research, system testing, or code refactoring. Pause outward marketing noise and focus on resolving latent errors in your product's core engine.",
      remedy: "Write down your key operational roadblocks on paper and burning them in a clay vessel on Tuesday evenings to trigger mental clarity."
    },
    8: {
      title: "Saturn Structured Operational Sprints",
      description: "Success will not come from shortcuts but from raw, disciplined, structured hard work. Tackle the deepest backlogs, reorganize messy files, and stick to a strict daily timeline.",
      remedy: "Donate dry foods or black sesame seeds to manual laborers on Saturday mornings. This satisfying karmic act clears stagnant project delays."
    },
    9: {
      title: "Martial Execution & Backlog Clearance",
      description: "Your physical execution energy is soaring. This month is for crushing heavy backlogs, resolving delayed logistics, and eliminating blocking issues with high assertiveness.",
      remedy: "Initiate your toughest operational sprints on Tuesdays before sunset. Keep a small raw copper coin or tiger-eye crystal on your right desk corner."
    }
  };

  // Relationship Recommendations based on Conductor Number (1-9)
  const relationshipMap: Record<number, { title: string; description: string; remedy: string }> = {
    1: {
      title: "Ego Dissolution & Supporting Aspirations",
      description: "In your close bonds, practice active ego dissolution. Dedicate quality hours to listen and support your partner's individual career aspirations without imposing your personal opinion or authority.",
      remedy: "Avoid carrying professional laptops or arguments into the master bedroom. Keep an active lamp in the North sector of your home."
    },
    2: {
      title: "Empathetic Cleansing of Silent Gaps",
      description: "This month demands high emotional empathy. Avoid building internal walls or falling into silent treatment patterns. Gentle, reassuring communications resolve old unexpressed doubts.",
      remedy: "Place two rose quartz hearts or a pair of pink clay candles in the South-West bedroom corner to cleanse stagnant relational energy."
    },
    3: {
      title: "Philosophy-First Peaceful Dialogue",
      description: "Seek long-term compatibility based on shared values and philosophies rather than winning daily domestic debates. Choose your battles carefully; respect differences in opinion.",
      remedy: "Avoid debating family finances on Thursday nights. Serve warm sweets to elders or family members to harmonize Jupiter vibrations."
    },
    4: {
      title: "Boundary Management & Communication Clarity",
      description: "Unexpected Rahu vibrations can trigger sudden relationship misunderstandings or hasty assumptions. Double-check your facts before reacting to third-party family rumors.",
      remedy: "Establish complete, honest transparency on digital devices with your partner. Keep a small piece of natural camphor in your drawer."
    },
    5: {
      title: "Playful Connection & Mutual Rejuvenation",
      description: "Inject fun, lightweight, and social energy into your relationship. Plan spontaneous road trips, organize double-dates, or start a collaborative hobby to break the routine monotony.",
      remedy: "Adopt green accents or gift a small indoor succulent to your partner on a Wednesday afternoon to promote fresh, growth-oriented vibes."
    },
    6: {
      title: "Venus Sensual Harmony & Aesthetic Dates",
      description: "A highly fortunate month for romance and domestic upgrade. Dedicate time to pampering your partner, beautifying your mutual living space, or arranging candlelit culinary dates.",
      remedy: "Avoid wearing dark gray or black bedsheets. Spray natural sandalwood or jasmine essence in your bedroom post sunset."
    },
    7: {
      title: "Supporting Spiritual & Personal Space",
      description: "Your partner or family members may need quiet moments of introspection. Avoid over-scheduling social gatherings. Support their inner peace and spiritual retreats.",
      remedy: "Share a silent walk or practice mindfulness exercises together. Avoid aggressive interrogation of minor domestic details."
    },
    8: {
      title: "Concrete Commitments & Practical Devotion",
      description: "Words of love mean very little this month without concrete, reliable acts of support. Take over domestic chores, assist in sorting their logistics, or complete long-delayed family duties.",
      remedy: "Honor all promises precisely. Make a joint visit to a calm temple or peaceful sanctuary on Saturdays facing West."
    },
    9: {
      title: "Fiery Emotion Management & Tonal Softness",
      description: "High emotional friction or sudden outbursts can occur due to Mars transits. Transform competitive physical energy into creative projects together. Speak with deliberate tonal softness.",
      remedy: "Avoid discussing sensitive familial topics after intense physical work or post sunset on Tuesdays. Share a glass of honeyed water."
    }
  };

  // Health & Wellness Recommendations based on Driver-Conductor combinations or Driver fallback
  const healthMap: Record<number, { title: string; description: string; remedy: string }> = {
    1: {
      title: "Solar Plexus Vitality & Cardiac Care",
      description: "Focus on solar plexus optimization. Guard against morning sluggishness, acidity spikes, and spinal stiffness by stabilizing your early morning routines.",
      remedy: "Drink a glass of warm water infused with a slice of fresh ginger at sunrise. Practice 10 minutes of yogic breathwork facing East."
    },
    2: {
      title: "Hydration Equilibrium & Emotional Peace",
      description: "Your mental state deeply impacts your physical digestions. Keep a check on fluid retention, emotional over-eating, respiratory congestion, or high stress-induced anxiety.",
      remedy: "Avoid cold liquids or ice creams post sunset. Store drinking water in a clean clay or glass pitcher under moon rays to absorb calm energy."
    },
    3: {
      title: "Hepatic & Digestive Optimization",
      description: "Jupiter rules the liver and metabolic digestive fire. Avoid eating heavy, oily meals or highly processed carbohydrates, especially after dark.",
      remedy: "Incorporate natural turmeric, lemon water, and herbal tea into your daily wellness regimen. Maintain a light fast on Thursdays if possible."
    },
    4: {
      title: "Nervous System Grounding",
      description: "Rahu transits can trigger sudden sleep cycle disruptions, high nervous over-excitation, or headaches from excessive screen time.",
      remedy: "Walk barefoot on natural green grass or damp soil for 15 minutes daily. Perform a strict screen-free digital detox 30 minutes before sleep."
    },
    5: {
      title: "Adrenal Calm & Thyroid Balance",
      description: "Mercury governs the thyroid and general nervous circuits. Your high-paced cognitive communication style can cause mental burnout and throat dryness.",
      remedy: "Practice deep silence (Mauna) for 15 minutes post sunset. Consume warm basil (Tulsi) water to soothe your vocal cords and lungs."
    },
    6: {
      title: "Kidney Care & Skin Hydration",
      description: "Venus influences the lower abdomen, kidneys, and skin quality. Prioritize high hydration, reduce sodium intake, and support dermal regeneration.",
      remedy: "Massage your soles with warm sesame or coconut oil before sleeping. Maintain optimal alkaline water levels throughout the day."
    },
    7: {
      title: "Intuitive Subconscious Detoxification",
      description: "Excellent cycle for deep mental detoxification, cellular regeneration, and resolving deep-rooted chronic patterns.",
      remedy: "Engage in deep yogic stretching or professional massage therapies. Dedicate 15 minutes to mindful meditation before sunrise."
    },
    8: {
      title: "Joint Strength & Bone Health",
      description: "Saturn rules structural bone density, joint lubrications, and overall posture. Avoid static sitting posture for extended hours.",
      remedy: "Apply warm herbal mustard or sesame oil to joint areas. Practice daily mild core strengthening exercises to stabilize your spine."
    },
    9: {
      title: "Muscle Recovery & Blood Cooling",
      description: "Mars rules muscle mass, blood pressure, and inflammatory reactions. Keep a check on internal heat spikes, minor physical cuts, or burns.",
      remedy: "Avoid extremely spicy or hyper-acidic foods. Drink cooling fennel seed water (Saunf water) and get ample, deep muscle sleep."
    }
  };

  // Fallback to driver/conductor numbers (handling 1-9 safety)
  const dNum = (driver >= 1 && driver <= 9) ? driver : 1;
  const cNum = (conductor >= 1 && conductor <= 9) ? conductor : 5;
  const hNum = ((driver + conductor) % 9) || 9; // dynamic composite wellness index

  return {
    career: careerMap[dNum] || careerMap[1],
    relationship: relationshipMap[cNum] || relationshipMap[5],
    health: healthMap[hNum] || healthMap[5]
  };
}
