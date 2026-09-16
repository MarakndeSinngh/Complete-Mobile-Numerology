import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';
import { PLANET_DEFINITIONS } from './planetMappings';

export interface RepetitionLevelInterpretation {
  level: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUADRUPLE_PLUS';
  countDesc: string;
  strengthenedQualities: string;
  possibleExcess: string;
  practicalExpression: string;
  careerExpression: string;
  relationshipExpression: string;
  balancingRecommendation: string;
}

export interface MissingNumberInterpretation {
  traditionalMeaning: string;
  developmentalTheme: string;
  behaviouralManifestation: string;
  practicalDevelopment: string;
  relationshipImpact: string;
  careerImpact: string;
  traditionalRemedy: string;
}

export interface NumberProfileDefinition {
  number: number;
  planet: string;
  element: string;
  positiveTraits: string[];
  shadowTraits: string[];
  personality: string;
  communication: string;
  career: string;
  business: string;
  wealth: string;
  relationships: string;
  family: string;
  learning: string;
  leadership: string;
  creativity: string;
  spirituality: string;
  repetitionMeaning: Record<'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUADRUPLE_PLUS', RepetitionLevelInterpretation>;
  missingMeaning: MissingNumberInterpretation;
  mulankMeaning: string;
  bhagyankMeaning: string;
  traditionalRemedies: {
    behavioural: string;
    lifestyle: string;
    charitable: string;
    mantra: string;
    color: string;
    directional: string;
  };
}

export const NUMBER_DEFINITIONS: Record<number, NumberProfileDefinition> = {
  1: {
    number: 1,
    planet: 'Sun (Surya)',
    element: 'Fire',
    positiveTraits: ['Independent', 'Ambitious', 'Visionary', 'Self-reliant', 'Authoritative', 'Original'],
    shadowTraits: ['Ego-centric', 'Impatient', 'Domineering', 'Isolated', 'Inflexible'],
    personality: 'Natural initiator with high sovereign confidence, commanding presence, and innate executive instinct.',
    communication: 'Direct, clear, authoritative; prefers brevity and decisive outcomes.',
    career: 'Executive leadership, administrative governance, civil services, pioneering startups, corporate direction.',
    business: 'Thrives in sole proprietorship or as principal visionary; resists subordination in partnerships.',
    wealth: 'Generates wealth through high-level authority, brand equity, and sovereign command.',
    relationships: 'Fiercely protective and loyal, yet demands mutual respect and personal autonomy.',
    family: 'Acts as family pillar and anchor; expects discipline and shared ambition.',
    learning: 'Learns through independent discovery, trial by fire, and direct executive responsibility.',
    leadership: 'Inspirational, charismatic, and visionary; leads from the front lines.',
    creativity: 'Pioneering and innovative; originates brand concepts and architectural frameworks.',
    spirituality: 'Solar consciousness; aligned with solar plexus vitality and righteous dharma.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Healthy self-confidence and articulate self-expression.',
        possibleExcess: 'Minimal risk; balanced executive presence.',
        practicalExpression: 'Able to articulate individual opinions while listening to others.',
        careerExpression: 'Dependable professional and respected team lead.',
        relationshipExpression: 'Balanced mutual communication.',
        balancingRecommendation: 'Maintain daily morning sunlight exposure.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Enhanced charisma, persuasive speech, and high creative output.',
        possibleExcess: 'Occasional stubbornness when decisions are questioned.',
        practicalExpression: 'Quick to take charge of complex group projects.',
        careerExpression: 'Rapid ascent to managerial and executive responsibilities.',
        relationshipExpression: 'Assertive yet deeply committed partner.',
        balancingRecommendation: 'Practice active listening in emotional dialogues.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Fierce independence, boundless initiative, intense drive.',
        possibleExcess: 'Impatience with slower rhythms; risk of verbal bluntness.',
        practicalExpression: 'Prefers working independently rather than waiting for consensus.',
        careerExpression: 'Top-tier sole leadership or independent consultancy.',
        relationshipExpression: 'May inadvertently dominate household dynamics.',
        balancingRecommendation: 'Cultivate cooling breathing exercises (Sheetali pranayama).'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Monolithic willpower and unstoppable personal momentum.',
        possibleExcess: 'Severe ego clash vulnerability, isolation, burnout.',
        practicalExpression: 'Intense mental focus requiring deliberate grounding breaks.',
        careerExpression: 'Supreme commander or visionary; needs supportive administrative lieutenants.',
        relationshipExpression: 'Requires partner with strong patience and clear emotional grounding.',
        balancingRecommendation: 'Water charity on Sundays; grounding meditation.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Surya vibration indicates an area requiring conscious development in sovereign self-assertion and verbal self-expression.',
      developmentalTheme: 'Developing self-worth, verbal clarity, and independent initiative without seeking external validation.',
      behaviouralManifestation: 'Hesitation to state personal opinions openly or reliance on others for initial momentum.',
      practicalDevelopment: 'Take small daily leadership responsibilities and practice clear, concise verbal articulation.',
      relationshipImpact: 'Tendency to over-compromise boundaries to maintain peace.',
      careerImpact: 'May shy away from public spotlight despite possessing deep competence.',
      traditionalRemedy: 'Offer fresh water to the rising morning Sun (Surya Arghya); wear clean gold or orange accents.'
    },
    mulankMeaning: 'As Mulank 1, your core nature is guided by the Sun. You are an organic initiator who needs autonomy, dignity, and room to lead.',
    bhagyankMeaning: 'As Bhagyank 1, your cosmic life purpose calls you toward pioneering achievements, sovereign governance, and breaking ancestral molds.',
    traditionalRemedies: {
      behavioural: 'Practice active validation of colleagues and allow team members space to contribute.',
      lifestyle: 'Rise before sunrise and take morning solar walks.',
      charitable: 'Donate wheat, jaggery, or copper utensils to needy elders on Sundays.',
      mantra: 'OM SURYAYA NAMAH (108 times at dawn).',
      color: 'Warm Gold, Saffron, Ruby Red.',
      directional: 'East (Indra/Surya zone) of living space should remain well-lit and clutter-free.'
    }
  },
  2: {
    number: 2,
    planet: 'Moon (Chandra)',
    element: 'Water',
    positiveTraits: ['Empathetic', 'Intuitive', 'Diplomatic', 'Cooperative', 'Gentle', 'Perceptive'],
    shadowTraits: ['Hypersensitive', 'Indecisive', 'Moody', 'Co-dependent', 'Easily hurt'],
    personality: 'Receptive, reflective peacemaker with profound emotional radar and innate understanding of human psychology.',
    communication: 'Soft, tactful, empathetic, supportive; seeks harmony over confrontation.',
    career: 'Counseling, psychology, diplomatic services, nursing, HR mediation, fine visual arts, fluid logistics.',
    business: 'Excels in partnerships, collaborative joint ventures, and client retention roles.',
    wealth: 'Builds steady wealth through partnership alliances, recurring client goodwill, and prudent liquid assets.',
    relationships: 'Deeply devoted, affectionate, and romantic; seeks soul-level emotional reciprocity.',
    family: 'The nurturing emotional heart of the home; keeps family harmony intact.',
    learning: 'Learns through intuitive assimilation, stories, emotional connection, and group discussions.',
    leadership: 'Servant leadership; builds consensus and fosters safe, high-trust team environments.',
    creativity: 'Poetic, lyrical, imaginative; channels subtle moods into expressive art.',
    spirituality: 'Devotional and mystic; aligned with the sacral and third-eye intuitive centers.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Sensitive, balanced emotional awareness.',
        possibleExcess: 'Minimal; steady emotional equilibrium.',
        practicalExpression: 'Listens well and offers balanced counsel.',
        careerExpression: 'Team player who smooths over workplace tension.',
        relationshipExpression: 'Thoughtful and considerate partner.',
        balancingRecommendation: 'Stay hydrated with clean drinking water.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Heightened intuition and telepathic empathy.',
        possibleExcess: 'Prone to absorbing other people’s emotional anxieties.',
        practicalExpression: 'Can read emotional undertones in meetings instantly.',
        careerExpression: 'Gifted negotiator, psychologist, or artistic creator.',
        relationshipExpression: 'Deeply affectionate; needs regular reassurance.',
        balancingRecommendation: 'Practice energetic boundary setting.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Profound artistic sensitivity and psychic receptivity.',
        possibleExcess: 'Frequent mood swings aligned with lunar cycles; over-analyzing remarks.',
        practicalExpression: 'Highly creative but vulnerable to sensory overload.',
        careerExpression: 'Brilliant artist or healer who needs quiet work environments.',
        relationshipExpression: 'Can feel vulnerable if partner is emotionally detached.',
        balancingRecommendation: 'Avoid staying awake late on full moon nights; drink water from silver vessel.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Intense psychic antenna and oceanic empathy.',
        possibleExcess: 'Severe emotional vulnerability, worry, and difficulty setting boundaries.',
        practicalExpression: 'Needs serene, quiet nature retreats to reset.',
        careerExpression: 'Spiritual counselor or niche artist requiring dedicated manager.',
        relationshipExpression: 'Needs an anchor partner who provides unwavering emotional security.',
        balancingRecommendation: 'Chandra Beej mantra and grounding earth activities.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Chandra vibration marks an area requiring conscious development in emotional patience, empathy, and intuitive listening.',
      developmentalTheme: 'Developing genuine emotional vulnerability and tolerance for other people’s emotional nuances.',
      behaviouralManifestation: 'Relying purely on rigid logic, dismissing emotional cues, or impatience with indecisiveness.',
      practicalDevelopment: 'Practice pause-and-reflect listening exercises; keep an emotional journal.',
      relationshipImpact: 'Partner may perceive emotional distance or clinical reactions.',
      careerImpact: 'May struggle in high-touch human resources or public diplomacy.',
      traditionalRemedy: 'Honor mother figures; drink water from a clean silver tumbler; wear pearl or silver ring.'
    },
    mulankMeaning: 'As Mulank 2, your core nature is guided by the Moon. You are intuitive, diplomatic, and deeply responsive to emotional harmony.',
    bhagyankMeaning: 'As Bhagyank 2, your life journey calls you to master peace-building, emotional intelligence, and diplomatic unification.',
    traditionalRemedies: {
      behavioural: 'Refrain from taking off-hand comments personally; maintain healthy personal boundaries.',
      lifestyle: 'Incorporate calming moonlit walks and mindful hydration.',
      charitable: 'Donate milk, rice, or white sweets to underprivileged mothers on Mondays.',
      mantra: 'OM CHANDRAYA NAMAH (108 times on Monday evening).',
      color: 'Pearl White, Cream, Soft Silver.',
      directional: 'North-West (Vayu/Moon zone) should have gentle airflow and soft lighting.'
    }
  },
  3: {
    number: 3,
    planet: 'Jupiter (Guru)',
    element: 'Wood / Ether',
    positiveTraits: ['Wise', 'Scholarly', 'Optimistic', 'Generous', 'Articulate', 'Inspiring'],
    shadowTraits: ['Preachy', 'Scattered', 'Over-optimistic', 'Opinionated', 'Extravagant'],
    personality: 'Grand intellectual mentor with expansive philosophical outlook, magnetic verbal flair, and thirst for knowledge.',
    communication: 'Articulate, pedagogical, uplifting, storytelling; loves explaining grand concepts.',
    career: 'Higher education, law/judiciary, spiritual teaching, corporate training, management advisory, publishing.',
    business: 'Thrives in knowledge consulting, educational franchises, legal practices, and publishing houses.',
    wealth: 'Attracts prosperity through wisdom capital, scholarly advisory, and ethical value creation.',
    relationships: 'Generous, optimistic, seeking intellectual companionship and shared spiritual growth.',
    family: 'The wise mentor and guide who prioritizes values, education, and philosophical heritage.',
    learning: 'Lifelong scholar; assimilates complex literature and philosophical systems effortlessly.',
    leadership: 'Mentorship leadership; coaches and elevates others to realize their full latent potential.',
    creativity: 'Prolific writer, lecturer, curriculum designer, and philosophical synthesizer.',
    spirituality: 'Expansive and devotional; aligned with the third eye and crown spiritual dimensions.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Clear intellectual grasp and optimistic perspective.',
        possibleExcess: 'Minimal risk; well-balanced mental curiosity.',
        practicalExpression: 'Communicates concepts with clarity and good humor.',
        careerExpression: 'Skilled educator, writer, or analytical professional.',
        relationshipExpression: 'Encouraging and intellectually stimulating.',
        balancingRecommendation: 'Read wisdom literature regularly.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Exceptional verbal charisma and teaching capability.',
        possibleExcess: 'Tendency to lecture others or dominate discussions.',
        practicalExpression: 'Quick to inspire large audiences or teams with vision.',
        careerExpression: 'Outstanding professor, consultant, or keynote speaker.',
        relationshipExpression: 'Generous and supportive of partner’s dreams.',
        balancingRecommendation: 'Listen attentively without jumping in with advice.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Vast intellectual horizon and philosophical breadth.',
        possibleExcess: 'Scattering energy across too many academic or creative pursuits.',
        practicalExpression: 'Can envision monumental projects but may neglect routine details.',
        careerExpression: 'Grand theoretician, philosopher, or multi-book author.',
        relationshipExpression: 'Idealistic expectations from close partners.',
        balancingRecommendation: 'Complete one major project before initiating the next.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Encyclopedic knowledge base and visionary eloquence.',
        possibleExcess: 'Intellectual restlessness, dogmatism, detachment from physical tasks.',
        practicalExpression: 'Needs structured physical grounding routines.',
        careerExpression: 'Academic institution dean or high-level philosophical thought leader.',
        relationshipExpression: 'Needs partner who values intellect and intellectual freedom.',
        balancingRecommendation: 'Ground yourself with physical gardening and silence (Maun Vrata).'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Guru vibration indicates an area requiring conscious development in structured self-expression, systematic learning, and optimism.',
      developmentalTheme: 'Developing confidence in one’s creative voice, seeking mentor guidance, and embracing higher knowledge.',
      behaviouralManifestation: 'Hesitation in public speaking or skepticism toward philosophical/spiritual growth.',
      practicalDevelopment: 'Commit to continuous structured reading and express thoughts through writing or presentations.',
      relationshipImpact: 'May struggle to articulate deeper feelings or future vision clearly.',
      careerImpact: 'Under-leveraging personal expertise due to self-doubt.',
      traditionalRemedy: 'Honor teachers and spiritual elders; apply a small saffron/haldi tilak; wear yellow accents on Thursday.'
    },
    mulankMeaning: 'As Mulank 3, your core nature is guided by Jupiter. You possess natural wisdom, infectious optimism, and a talent for teaching and guidance.',
    bhagyankMeaning: 'As Bhagyank 3, your life path unfolds as an educator, counselor, or philosophical beacon guiding collective evolution.',
    traditionalRemedies: {
      behavioural: 'Share your wisdom with humility; avoid speaking in a patronizing tone.',
      lifestyle: 'Keep yellow stationery or study tools on your desk.',
      charitable: 'Donate yellow gram pulse (Chana Dal), turmeric, or books to students on Thursdays.',
      mantra: 'OM GUM GURAVE NAMAH (108 times on Thursday morning).',
      color: 'Saffron, Bright Yellow, Goldenrod.',
      directional: 'North-East (Ishan/Guru zone) must remain clean, water-blessed, and serene.'
    }
  },
  4: {
    number: 4,
    planet: 'Rahu',
    element: 'Wood / Air / Electricity',
    positiveTraits: ['Methodical', 'Practical', 'Technological', 'Breakthrough Thinker', 'Organized', 'Disruptive'],
    shadowTraits: ['Rigid', 'Obsessive', 'Skeptical', 'Abrupt', 'Workaholic'],
    personality: 'Pragmatic system architect capable of taking unconventional angles, structuring complex frameworks, and delivering breakthroughs.',
    communication: 'Analytical, factual, focused on logistics, feasibility, and structured proof.',
    career: 'Information technology, data engineering, software architecture, aviation, civil planning, strategic security.',
    business: 'Excels in operations, tech-enabled automation, manufacturing supply chains, and complex logistics.',
    wealth: 'Creates wealth through unconventional technological systems, patents, long-term discipline, and sudden leaps.',
    relationships: 'Loyal, grounded, reliable; shows love through practical deeds, security, and consistent duty.',
    family: 'Provides structural order, financial safety nets, and architectural protection.',
    learning: 'Learns through deconstructing systems, reverse engineering, and empirical hands-on trials.',
    leadership: 'Operational leadership; ensures execution precision, risk mitigation, and systemic scalability.',
    creativity: 'Technological invention, procedural design, and pioneering digital platforms.',
    spirituality: 'Tantric insight, piercing illusions, uncovering hidden cosmic mechanics.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Practical, disciplined, systematic organization.',
        possibleExcess: 'Minimal risk; dependable execution.',
        practicalExpression: 'Completes chores and assignments with structured dependability.',
        careerExpression: 'Solid project manager, analyst, or engineer.',
        relationshipExpression: 'Consistent and realistic in commitments.',
        balancingRecommendation: 'Keep living space orderly.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'High-level architectural acumen and meticulous attention to detail.',
        possibleExcess: 'Inflexibility when standard plans deviate; occasional frustration with messiness.',
        practicalExpression: 'Engineers comprehensive systems and contingency protocols.',
        careerExpression: 'Outstanding systems architect, director of operations, or data lead.',
        relationshipExpression: 'Deeply reliable provider; needs occasional reminders to relax.',
        balancingRecommendation: 'Incorporate spontaneous creative hobbies.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Extreme technical mastery and relentless work capacity.',
        possibleExcess: 'Tendency toward workaholism, hyper-skepticism, and anxiety over minor flaws.',
        practicalExpression: 'Demands absolute precision from self and subordinates.',
        careerExpression: 'Specialized cyber security, advanced aerospace, or deep algorithmic coding.',
        relationshipExpression: 'May neglect emotional spontaneity in favor of duty and tasks.',
        balancingRecommendation: 'Strictly enforce non-screen leisure hours.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Obsessive technical focus and unconventional breakthrough capability.',
        possibleExcess: 'Severe rigidity, social detachment, and sudden temperamental flare-ups.',
        practicalExpression: 'Needs structured physical outlets to discharge nervous tension.',
        careerExpression: 'Niche disruptive inventor or deep infrastructure mastermind.',
        relationshipExpression: 'Requires patient partner who respects solitary analytical time.',
        balancingRecommendation: 'Regular barefoot walks on dewy morning grass; Rahu mantra.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Rahu vibration marks an area requiring conscious development in operational discipline, patience, and organized routine.',
      developmentalTheme: 'Developing structure, follow-through on routine details, and financial budgeting.',
      behaviouralManifestation: 'Starting numerous projects without finishing, resistance to schedules or spreadsheets.',
      practicalDevelopment: 'Use structured calendar reminders, keep financial registers, and set clear milestones.',
      relationshipImpact: 'Partner may feel burdened by managing practical household logistics.',
      careerImpact: 'Great conceptual ideas may stumble during execution phases.',
      traditionalRemedy: 'Keep a small solid sandalwood block or wooden pen; declutter electronics; chant OM RAHAVE NAMAH.'
    },
    mulankMeaning: 'As Mulank 4, your core nature is guided by Rahu. You are a strategic thinker, practical problem-solver, and unconventional builder who challenges the status quo.',
    bhagyankMeaning: 'As Bhagyank 4, your destined life mission centers on building enduring systems, modern technological infrastructure, and reliable societal foundations.',
    traditionalRemedies: {
      behavioural: 'Embrace flexibility when circumstances deviate from initial plans.',
      lifestyle: 'Maintain orderly desk drawers and remove non-functional electronic cables.',
      charitable: 'Feed stray dogs or donate black sesame and blankets on Saturdays.',
      mantra: 'OM RAHAVE NAMAH (108 times on Saturday evening).',
      color: 'Smoky Grey, Steel Blue, Earth Browns.',
      directional: 'South-East (Agni/Wealth zone in Lo Shu) should have orderly wood accents.'
    }
  },
  5: {
    number: 5,
    planet: 'Mercury (Budha)',
    element: 'Earth',
    positiveTraits: ['Adaptable', 'Dynamic', 'Commercial', 'Versatile', 'Witty', 'Balancing'],
    shadowTraits: ['Restless', 'Inconsistent', 'Impulsive', 'Superficial', 'Over-stretched'],
    personality: 'The master stabilizer and versatile communicator who bridges disparate worlds, negotiates deals, and thrives on variety.',
    communication: 'Witty, persuasive, quick-thinking, multi-lingual, engaging.',
    career: 'Trading, e-commerce, journalism, PR, media broadcasting, sales, corporate mediation, consulting.',
    business: 'Natural dealmaker, serial entrepreneur, international trader, and market innovator.',
    wealth: 'Generates fluid wealth through smart arbitrage, high-velocity commerce, and networking agility.',
    relationships: 'Charming, exciting, and social; requires conversational stimulation and personal space.',
    family: 'Keeps household lively, organizes family travels, and bridges inter-generational gaps.',
    learning: 'Fast learner through hands-on interaction, modern multimedia, and rapid contextual switching.',
    leadership: 'Agile leadership; excels at crisis pivoting, market repositioning, and cross-functional alignment.',
    creativity: 'Versatile storyteller, creative marketer, and media presenter.',
    spirituality: 'Spiritual equilibrium; balanced central earth energy aligning root with crown chakras.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Good emotional balance, adaptability, and social grace.',
        possibleExcess: 'Minimal risk; steady central equilibrium.',
        practicalExpression: 'Navigates sudden life changes with composure.',
        careerExpression: 'Resourceful professional capable of multi-tasking.',
        relationshipExpression: 'Harmonious and engaging company.',
        balancingRecommendation: 'Spend quiet time in nature to recharge.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Remarkable verbal flair, commercial instinct, and persuasive agility.',
        possibleExcess: 'Restlessness; difficulty staying committed to routine projects.',
        practicalExpression: 'Thrives in fast-moving environments where no two days are alike.',
        careerExpression: 'Outstanding business development manager, media personality, or venture trader.',
        relationshipExpression: 'Fun-loving and vibrant; needs a partner who appreciates spontaneity.',
        balancingRecommendation: 'Establish a non-negotiable daily morning routine.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Lightning-fast intellect, extraordinary sales flair, and boundless networking energy.',
        possibleExcess: 'Scattered attention span, risk of speculative gambles, nervous tension.',
        practicalExpression: 'Constantly seeking new stimuli, trips, and intellectual challenges.',
        careerExpression: 'High-stakes speculative trader, international travel executive, or serial entrepreneur.',
        relationshipExpression: 'May feel confined by overly predictable partner dynamics.',
        balancingRecommendation: 'Engage in grounding breathwork and avoid excess caffeine.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Hyper-versatility and chameleon-like adaptability.',
        possibleExcess: 'Extreme restlessness, lack of grounding, difficulty sticking with one career path.',
        practicalExpression: 'Needs physical grounding exercises daily.',
        careerExpression: 'Freelance innovator or global consultant who cannot be placed in a standard box.',
        relationshipExpression: 'Requires an ultra-flexible partner with high personal independence.',
        balancingRecommendation: 'Walk barefoot on damp soil; chant Budha mantra; keep a green jade stone.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Budha vibration marks an area requiring conscious development in stability, adaptability, and public communication.',
      developmentalTheme: 'Developing personal center, grounding emotions, and embracing calculated changes without panic.',
      behaviouralManifestation: 'Resistance to unexpected transitions, feeling easily shaken by external disruption.',
      practicalDevelopment: 'Practice public speaking, learn basic sales psychology, and cultivate adaptability.',
      relationshipImpact: 'May struggle to voice needs spontaneously in moments of tension.',
      careerImpact: 'Tendency to remain in stagnant job roles due to fear of change.',
      traditionalRemedy: 'Feed green grass/vegetables to cows on Wednesdays; wear emerald or peridot; keep green plants in the center/study.'
    },
    mulankMeaning: 'As Mulank 5, your core nature is guided by Mercury. You are agile, witty, commercially astute, and born to bridge communities and ideas.',
    bhagyankMeaning: 'As Bhagyank 5, your destined path is one of progressive expansion, global networking, and bringing equilibrium and progressive ideas to the world.',
    traditionalRemedies: {
      behavioural: 'Develop patience to finish projects before jumping to new shiny opportunities.',
      lifestyle: 'Keep indoor plants on your work desk; practice grounding yoga poses.',
      charitable: 'Feed green fodder or spinach to cows on Wednesday mornings.',
      mantra: 'OM BUDHAYA NAMAH (108 times on Wednesday morning).',
      color: 'Emerald Green, Mint, Jade.',
      directional: 'Center of home (Brahmasthan) should remain open, light, and free of heavy furniture.'
    }
  },
  6: {
    number: 6,
    planet: 'Venus (Shukra)',
    element: 'Metal / Water',
    positiveTraits: ['Harmonious', 'Magnetic', 'Aesthetic', 'Generous', 'Romantic', 'Diplomatic'],
    shadowTraits: ['Indulgent', 'Possessive', 'Superficial', 'Avoids Confrontation', 'Over-idealistic'],
    personality: 'The embodiment of charm, elegance, and aesthetic taste; naturally attracts luxury, artistic refinement, and social harmony.',
    communication: 'Graceful, pleasing, diplomatic, warm, persuasive.',
    career: 'Luxury goods, interior architecture, film/fashion, cosmetics, hospitality, relationship advisory, fine dining.',
    business: 'Brilliant in premium branding, lifestyle agencies, high-end hospitality, and design studios.',
    wealth: 'Attracts substantial material wealth, luxury assets, and high-net-worth patrons through magnetism and refined presentation.',
    relationships: 'Devoted, deeply romantic, affectionate; values domestic beauty, loyalty, and mutual admiration.',
    family: 'The aesthetic creator and protector of domestic bliss, comfort, and gracious hospitality.',
    learning: 'Learns through visual art, design principles, hands-on aesthetic creation, and human connection.',
    leadership: 'Charismatic leadership; inspires through elegance, shared prosperity, and harmonious culture.',
    creativity: 'Haute couture, interior styling, artistic design, culinary mastery, visual aesthetics.',
    spirituality: 'Bhakti yoga, beauty as a manifestation of the divine, heart chakra expansion.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Strong sense of responsibility, good aesthetic eye, and domestic care.',
        possibleExcess: 'Minimal risk; healthy family and social orientation.',
        practicalExpression: 'Maintains an inviting, harmonious personal environment.',
        careerExpression: 'Respected colleague with good taste and collaborative skills.',
        relationshipExpression: 'Loving, supportive, and dependable companion.',
        balancingRecommendation: 'Enjoy quality arts and cultural performances.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Exceptional creative talent, magnetic charm, and eye for luxury.',
        possibleExcess: 'Tendency to spend heavily on comforts, clothes, or decorative luxuries.',
        practicalExpression: 'Naturally transforms any workspace or home into a showpiece.',
        careerExpression: 'Flourishes in luxury design, creative direction, or hospitality.',
        relationshipExpression: 'Deeply romantic and devoted; expects equal aesthetic standards.',
        balancingRecommendation: 'Practice mindful financial budgeting on luxury purchases.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Irresistible personal magnetism, high artistic brilliance, and indulgence in beauty.',
        possibleExcess: 'Over-protectiveness, susceptibility to flattery, escapism into sensory pleasures.',
        practicalExpression: 'Can become overly consumed with external appearance and prestige.',
        careerExpression: 'Celebrity stylist, film producer, luxury hotelier, or top couturier.',
        relationshipExpression: 'Demands intense devotion and glamour in romance.',
        balancingRecommendation: 'Cultivate inner spiritual beauty alongside material aesthetics.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Supercharged Venusian magnetism and artistic passion.',
        possibleExcess: 'Sensory overload, emotional entanglements, and financial over-extension.',
        practicalExpression: 'Needs simple, non-indulgent retreats to regain balance.',
        careerExpression: 'High-profile lifestyle icon or creative artist.',
        relationshipExpression: 'Needs an emotionally grounded partner to anchor domestic life.',
        balancingRecommendation: 'Practice voluntary simplicity on Fridays; chant Shukra mantra.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Shukra vibration marks an area requiring conscious development in self-care, domestic harmony, and aesthetic appreciation.',
      developmentalTheme: 'Developing appreciation for refined surroundings, warmth in social relations, and healthy indulgence in life joys.',
      behaviouralManifestation: 'Overly utilitarian outlook, neglecting personal grooming or living space aesthetics, difficulty relaxing.',
      practicalDevelopment: 'Invest time into curating your living space, cultivate artistic hobbies, and practice self-appreciation.',
      relationshipImpact: 'Partner may desire more romantic warmth, compliments, and shared celebratory moments.',
      careerImpact: 'May under-value the immense role of branding and aesthetic presentation in business.',
      traditionalRemedy: 'Wear clean, well-ironed clothes with pleasing fragrance; wear white or soft pink on Fridays; donate white sweets to girls.'
    },
    mulankMeaning: 'As Mulank 6, your core nature is guided by Venus. You are gifted with aesthetic sensitivity, charm, and an innate instinct to create harmony and beauty.',
    bhagyankMeaning: 'As Bhagyank 6, your destined path is to bring elegance, luxury, emotional well-being, and gracious service to humanity.',
    traditionalRemedies: {
      behavioural: 'Practice unconditional generosity without expecting immediate compliments.',
      lifestyle: 'Use mild, natural sandalwood or rose fragrances; keep living spaces pristine.',
      charitable: 'Donate white clothing, rice, or sugar to young underprivileged girls or elderly women on Fridays.',
      mantra: 'OM SHUKRAYA NAMAH (108 times on Friday morning).',
      color: 'Diamond White, Soft Cream, Pastel Pink.',
      directional: 'North-West (Helpful Friends zone in Lo Shu) should have graceful metallic or crystal accents.'
    }
  },
  7: {
    number: 7,
    planet: 'Ketu',
    element: 'Metal / Fire',
    positiveTraits: ['Intuitive', 'Analytical', 'Philosophical', 'Spiritual Seeker', 'Deep Thinker', 'Discerning'],
    shadowTraits: ['Aloof', 'Cynical', 'Secretive', 'Melancholic', 'Detached'],
    personality: 'The mystical researcher and deep truth-seeker who looks beneath surface appearances to comprehend ultimate reality.',
    communication: 'Thoughtful, concise, introspective, enigmatic; speaks when true insight warrants.',
    career: 'Scientific research, cyber forensics, occult studies, astrology, surgery, philosophy, software diagnostics.',
    business: 'Specialized deep-tech R&D, boutique diagnostic services, independent research labs, spiritual publishing.',
    wealth: 'Generates wealth through specialized unique expertise, unexpected windfalls, and intellectual patents.',
    relationships: 'Requires intellectual depth, personal space, and emotional authenticity; distrusts superficiality.',
    family: 'Quiet, observant family member who offers profound counsel in pivotal crises.',
    learning: 'Learns through solitary study, meditation, investigative research, and esoteric inquiry.',
    leadership: 'Thought leadership; commands quiet authority through depth of insight and unshakeable expertise.',
    creativity: 'Esoteric literature, metaphysical art, mathematical elegance, abstract scientific hypotheses.',
    spirituality: 'Moksha-oriented; aligned with the crown chakra and detachment from mundane illusions.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Sound intuition, analytical depth, and spiritual inclination.',
        possibleExcess: 'Minimal risk; healthy balance of introspection and engagement.',
        practicalExpression: 'Approaches problems with a thoughtful, questioning mindset.',
        careerExpression: 'Skillful analyst, researcher, or independent specialist.',
        relationshipExpression: 'Loyal and understanding companion.',
        balancingRecommendation: 'Maintain a daily meditation practice.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Profound intuitive radar, philosophical wisdom, and research talent.',
        possibleExcess: 'Tendency toward introversion, aloofness, or over-analyzing motives.',
        practicalExpression: 'Uncovers hidden facts and anomalies others miss.',
        careerExpression: 'Outstanding investigative journalist, forensic scientist, or spiritual teacher.',
        relationshipExpression: 'Values solitude; needs partner who respects quiet contemplation.',
        balancingRecommendation: 'Engage in open social conversations without judgment.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Deep mystical perception, psychic lucidity, and detachment from material vanity.',
        possibleExcess: 'Cynicism, feeling misunderstood, emotional isolation from family.',
        practicalExpression: 'Can become deeply absorbed in esoteric or analytical puzzles.',
        careerExpression: 'World-class researcher, monk, philosopher, or cryptographic genius.',
        relationshipExpression: 'Requires immense patience and shared spiritual values in love.',
        balancingRecommendation: 'Ground yourself with practical community service.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Extreme transcendent perception and esoteric genius.',
        possibleExcess: 'Severe detachment from daily material responsibilities; social alienation.',
        practicalExpression: 'Needs structured physical habits to stay connected to daily reality.',
        careerExpression: 'Visionary mystic, recluse researcher, or profound occult teacher.',
        relationshipExpression: 'Best suited with an independent, spiritually oriented partner.',
        balancingRecommendation: 'Chant Ketu mantra; feed stray dogs; practice grounding physical exercise.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Ketu vibration marks an area requiring conscious development in deeper research, patience, and spiritual introspection.',
      developmentalTheme: 'Developing depth of thought, verifying facts before accepting claims, and cultivating inner stillness.',
      behaviouralManifestation: 'Accepting claims at face value, restlessness when alone, avoidance of introspective silence.',
      practicalDevelopment: 'Read foundational philosophy books, practice daily 15-minute silent contemplation, and double-check research.',
      relationshipImpact: 'May overlook partner’s subtle emotional undercurrents.',
      careerImpact: 'Risk of jumping into deals without reading fine print or examining data integrity.',
      traditionalRemedy: 'Worship Lord Ganesha; feed stray dogs on Tuesdays; keep a multi-colored thread or cat’s eye gemstone.'
    },
    mulankMeaning: 'As Mulank 7, your core nature is guided by Ketu. You are an introspective thinker, spiritual seeker, and analytical mind who seeks the deeper truth behind appearances.',
    bhagyankMeaning: 'As Bhagyank 7, your destined life mission centers on uncovering hidden knowledge, spiritual awakening, and guiding others out of ignorance.',
    traditionalRemedies: {
      behavioural: 'Avoid unnecessary cynicism; balance critical inquiry with open-hearted trust.',
      lifestyle: 'Dedicate 20 minutes every evening to quiet contemplative walking or meditation.',
      charitable: 'Feed stray dogs or donate blankets/warm clothes to shelter homes on Tuesdays.',
      mantra: 'OM KETAVE NAMAH (108 times on Tuesday evening).',
      color: 'Ash Grey, Multi-colored patterns, Smoky hues.',
      directional: 'West (Creativity/Children zone in Lo Shu) should have reflective, peaceful accents.'
    }
  },
  8: {
    number: 8,
    planet: 'Saturn (Shani)',
    element: 'Earth',
    positiveTraits: ['Disciplined', 'Tenacious', 'Judicial', 'Authoritative', 'Enduring', 'Fair'],
    shadowTraits: ['Rigid', 'Pessimistic', 'Harsh', 'Overly cautious', 'Materialistic'],
    personality: 'The master of karmic balance, patience, and endurance; builds massive enduring legacies through relentless perseverance.',
    communication: 'Measured, serious, prudent, economical with words, highly credible.',
    career: 'Real estate, heavy infrastructure, corporate governance, judiciary/law, mining, venture capital, large administration.',
    business: 'Excels in large-scale asset building, long-horizon investing, manufacturing, and industrial operations.',
    wealth: 'Builds permanent wealth through compounding assets, real estate holdings, and unshakeable financial discipline.',
    relationships: 'Fiercely committed, protective, and dependable; shows loyalty through lifelong security.',
    family: 'The steadfast protector who shoulders burdens quietly to guarantee multi-generational security.',
    learning: 'Learns through real-world struggle, hard-won experience, and mastering complex practical systems.',
    leadership: 'Karmic leadership; commands unwavering respect through personal endurance, fairness, and justice.',
    creativity: 'Monumental architecture, timeless institutional design, large-scale industrial projects.',
    spirituality: 'Karma yoga; self-realization through selfless duty, service to the needy, and enduring patience.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Sound financial discipline, patience, and capacity for sustained effort.',
        possibleExcess: 'Minimal risk; balanced sense of duty and fairness.',
        practicalExpression: 'Takes obligations seriously and honors promises.',
        careerExpression: 'Trustworthy administrator, financial analyst, or engineer.',
        relationshipExpression: 'Reliable and steadfast partner.',
        balancingRecommendation: 'Take time to celebrate small milestones.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Massive perseverance, executive endurance, and ability to handle high pressure.',
        possibleExcess: 'Tendency to shoulder too many burdens alone; sternness with subordinates.',
        practicalExpression: 'Thrives in managing complex, high-stakes organizational crises.',
        careerExpression: 'Supreme operational head, senior judge, infrastructure mogul, or CFO.',
        relationshipExpression: 'Deeply loyal provider; may occasionally seem serious or stressed.',
        balancingRecommendation: 'Schedule regular relaxation and laughter with family.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Unyielding iron willpower, monumental patience, and karmic resilience.',
        possibleExcess: 'Severe pessimism, excessive caution, or harsh self-criticism.',
        practicalExpression: 'Refuses to abandon any endeavor, regardless of difficulty.',
        careerExpression: 'High-level judicial authority, institutional builder, or restructuring expert.',
        relationshipExpression: 'Needs a warm, cheerful partner who brings lightness into the home.',
        balancingRecommendation: 'Perform regular charity for underprivileged workers on Saturdays.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Supreme resilience and capacity to carry immense karmic weight.',
        possibleExcess: 'Severe rigidity, burden of responsibility, and tendency to isolate in silence.',
        practicalExpression: 'Needs active emotional outlets and supportive companions.',
        careerExpression: 'Monumental enterprise titan or legal reformer.',
        relationshipExpression: 'Requires an understanding partner who provides warm, non-demanding solace.',
        balancingRecommendation: 'Light mustard oil lamp under Peepal tree on Saturdays; chant Shani mantra.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Shani vibration marks an area requiring conscious development in patience, financial prudence, and long-term stamina.',
      developmentalTheme: 'Developing steady endurance, respecting practical limitations, and managing money conservatively.',
      behaviouralManifestation: 'Impatience with slow developmental cycles, seeking fast shortcuts to wealth.',
      practicalDevelopment: 'Commit to long-term investment horizons, maintain disciplined daily habits, and honor deadlines.',
      relationshipImpact: 'May struggle with the mundane, repetitive responsibilities of long-term partnership.',
      careerImpact: 'Risk of abandoning promising careers too soon before harvesting compounded rewards.',
      traditionalRemedy: 'Serve laborers and elderly workers; light a mustard oil lamp on Saturday evenings; wear dark blue/black on Saturday.'
    },
    mulankMeaning: 'As Mulank 8, your core nature is guided by Saturn. You are born to endure, build lasting legacy, and master karmic duty and financial resilience.',
    bhagyankMeaning: 'As Bhagyank 8, your cosmic destiny calls you to manage substantial resources, uphold justice, and construct durable social and economic institutions.',
    traditionalRemedies: {
      behavioural: 'Infuse your leadership with warmth and encouragement; celebrate small steps.',
      lifestyle: 'Maintain regular sleep and meal schedules; avoid skipping breakfast.',
      charitable: 'Donate mustard oil, black sesame seeds, iron pans, or shoes to laborers on Saturdays.',
      mantra: 'OM SHAM SHANAISCHARAYA NAMAH (108 times on Saturday evening).',
      color: 'Navy Blue, Charcoal, Deep Black.',
      directional: 'North-East (Knowledge/Intuition zone in Lo Shu) and West should be organized and uncluttered.'
    }
  },
  9: {
    number: 9,
    planet: 'Mars (Mangal)',
    element: 'Fire',
    positiveTraits: ['Courageous', 'Dynamic', 'Humanitarian', 'Decisive', 'Protective', 'Passionate'],
    shadowTraits: ['Aggressive', 'Impulsive', 'Short-tempered', 'Reckless', 'Confrontational'],
    personality: 'The dynamic humanitarian warrior driven by courage, high vitality, righteous indignation against injustice, and bold action.',
    communication: 'Passionate, forthright, vigorous, energetic; pulls no punches.',
    career: 'Defense forces, emergency medicine/surgery, sports athletics, fire protection, civil engineering, non-profit crusades.',
    business: 'Excels in competitive fast-turnaround industries, real estate development, emergency logistics, and pioneering ventures.',
    wealth: 'Generates wealth through high-energy initiative, bold investments, and courageous entrepreneurial actions.',
    relationships: 'Fervently passionate, generous, protective; expects absolute loyalty and energy reciprocity.',
    family: 'The fearless champion and defender who protects loved ones at any cost.',
    learning: 'Learns through physical demonstration, high-stakes competition, and trial by combat.',
    leadership: 'Heroic leadership; rallies followers during acute crises through sheer boldness.',
    creativity: 'Dynamic choreography, heroic literature, monumental sculpture, inspiring motivational addresses.',
    spirituality: 'Karma yoga of heroic service; purifying inner impurities through courageous righteous actions.',
    repetitionMeaning: {
      SINGLE: {
        level: 'SINGLE',
        countDesc: '1 time in chart',
        strengthenedQualities: 'Healthy courage, good physical vitality, and ambition.',
        possibleExcess: 'Minimal risk; balanced enthusiasm.',
        practicalExpression: 'Acts promptly when duty or opportunity arises.',
        careerExpression: 'Energetic, goal-oriented performer and dependable leader.',
        relationshipExpression: 'Affectionate, protective, and passionate companion.',
        balancingRecommendation: 'Channel energy through regular athletic workouts.'
      },
      DOUBLE: {
        level: 'DOUBLE',
        countDesc: '2 times in chart',
        strengthenedQualities: 'Exceptional drive, quick reflexes, and fierce humanitarian zeal.',
        possibleExcess: 'Quick temper when faced with bureaucratic delays; impatience.',
        practicalExpression: 'Cuts through red tape and gets things executed rapidly.',
        careerExpression: 'Outstanding team captain, surgeon, defense officer, or crisis leader.',
        relationshipExpression: 'Intensely loyal and fiery; needs honest communication.',
        balancingRecommendation: 'Practice cooling deep breathing (Pranayama) before responding.'
      },
      TRIPLE: {
        level: 'TRIPLE',
        countDesc: '3 times in chart',
        strengthenedQualities: 'Explosive courage, tireless physical engine, and unstoppable momentum.',
        possibleExcess: 'Risk of confrontational arguments, recklessness, burnout.',
        practicalExpression: 'Needs challenging physical and athletic outlets daily.',
        careerExpression: 'Elite defense personnel, top competitive athlete, or emergency crusader.',
        relationshipExpression: 'Requires an understanding partner who doesn’t provoke unnecessary arguments.',
        balancingRecommendation: 'Chant Hanuman Chalisa; channel energy into sports and philanthropy.'
      },
      QUADRUPLE_PLUS: {
        level: 'QUADRUPLE_PLUS',
        countDesc: '4+ times in chart',
        strengthenedQualities: 'Monumental martial vitality and warrior conviction.',
        possibleExcess: 'Severe anger volatility, headstrong decisions, vulnerability to accidents.',
        practicalExpression: 'Requires strict discipline and peaceful mindfulness routines.',
        careerExpression: 'Heroic visionary, martial leader, or pioneering crisis savior.',
        relationshipExpression: 'Needs a calming, water-nature partner to provide balance.',
        balancingRecommendation: 'Avoid red meat; donate jaggery on Tuesdays; practice daily meditation.'
      }
    },
    missingMeaning: {
      traditionalMeaning: 'Missing Mangal vibration marks an area requiring conscious development in courage, humanitarian advocacy, and physical vitality.',
      developmentalTheme: 'Developing assertiveness, decisive action, and willingness to stand up for one’s rights.',
      behaviouralManifestation: 'Procrastinating on urgent confrontations, reluctance to take bold risks.',
      practicalDevelopment: 'Engage in competitive sports, set decisive deadlines, and practice asserting boundaries.',
      relationshipImpact: 'May absorb unfair treatment rather than addressing issues directly.',
      careerImpact: 'May hesitate to negotiate for promotions or push back against aggressive peers.',
      traditionalRemedy: 'Recite Hanuman Chalisa on Tuesdays; donate jaggery or red lentils (Masoor Dal); wear bright coral or red accents.'
    },
    mulankMeaning: 'As Mulank 9, your core nature is guided by Mars. You are a passionate warrior, courageous protector, and humanitarian leader.',
    bhagyankMeaning: 'As Bhagyank 9, your destined path is one of broad humanitarian service, fighting for justice, and leaving the world elevated by your courage.',
    traditionalRemedies: {
      behavioural: 'Pause for 10 seconds before reacting in moments of irritation; transform anger into physical exercise.',
      lifestyle: 'Maintain regular cardiovascular exercise and drink sufficient water.',
      charitable: 'Donate jaggery, red lentils (Masoor Dal), or sweets to workers on Tuesday afternoons.',
      mantra: 'OM MANGALAYA NAMAH (108 times on Tuesday morning).',
      color: 'Crimson Red, Vermilion, Coral.',
      directional: 'South (Fame/Mars zone in Lo Shu) should be vibrant, clean, and accented with warm lighting.'
    }
  }
};

// Register all rules in the methodology registry
Object.values(NUMBER_DEFINITIONS).forEach((def) => {
  const rule: MethodologyRule = {
    id: `NUMBER_ARCHETYPE_${def.number}`,
    category: 'NUMBER',
    ruleName: `Comprehensive Archetype & Behavioral Dynamics for Digit ${def.number}`,
    system: 'LEOFAMILY',
    source: SOURCES.LEOFAMILY_CORE,
    description: `Complete positive, shadow, personality, career, wealth, and relationship profile for Number ${def.number} (${def.planet}).`,
    interpretation: def.personality,
    confidence: 100,
    safetyLevel: 'SAFE',
    details: def
  };
  methodologyRegistry.registerRule(rule);
});

export { REPETITION_DETAILED_DATABASE, getDetailedRepetitionAnalysis } from './repetitionDatabase';
export type { DetailedRepetitionEntry } from './repetitionDatabase';
