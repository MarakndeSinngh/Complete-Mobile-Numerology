import { GRAHA_MAPPING, REPETITION_LEVELS } from './methodologyConfig';

export interface ComprehensiveNumberProfile {
  number: number;
  grahaEn: string;
  grahaHi: string;
  deity: string;
  element: string;
  positiveTraits: string[];
  shadowTraits: string[];
  personality: string;
  thinkingStyle: string;
  emotionalStyle: string;
  communication: string;
  career: string[];
  business: string;
  wealth: string;
  relationships: string;
  family: string;
  spirituality: string;
  discipline: string;
  decisionMaking: string;
  leadership: string;
  learning: string;
  travel: string;
  creativity: string;
  healthSymbolism: string;
  remedialTheme: string;
  balancedExpression: string;
  excessExpression: string;
  missingNumberMeaning: string;
  repetitionMeaning: Record<number, string>;
  mulankMeaning: string;
  bhagyankMeaning: string;
}

export const NUMBER_PROFILES: Record<number, ComprehensiveNumberProfile> = {
  1: {
    number: 1,
    grahaEn: 'Sun',
    grahaHi: 'Surya (सूर्य)',
    deity: 'Surya Deva',
    element: 'Fire',
    positiveTraits: ['Pioneering', 'Independent', 'Authoritative', 'Visionary', 'Confident', 'Decisive', 'Inspiring'],
    shadowTraits: ['Egoistic', 'Impatient', 'Domineering', 'Isolated', 'Stubborn', 'Intolerant of critique'],
    personality: 'Natural sovereign spirit possessing commanding aura, innate drive to initiate, lead, and establish independent identity.',
    thinkingStyle: 'Original, strategic, top-down executive thinking focused on ultimate objectives rather than minutiae.',
    emotionalStyle: 'Proud, dignified, values respect and loyalty; tends to shield inner vulnerabilities behind a stoic exterior.',
    communication: 'Direct, commanding, concise, articulate, and persuasive; speaks with natural authority.',
    career: ['Leadership / C-Suite', 'Government & Civil Services', 'Politics', 'Pioneering Startups', 'Administration', 'Military & Defense'],
    business: 'Excels as sole founder or majority stakeholder; prefers setting direction rather than following external consensus.',
    wealth: 'Attracts wealth through executive positions, pioneering ventures, and high-status brand associations.',
    relationships: 'Protective, generous, and devoted; thrives when partner offers mutual respect and celebrates their achievements.',
    family: 'Acts as the patriarch/matriarch or central pillar of the family, providing shelter and taking responsibility.',
    spirituality: 'Connects to divinity through solar vitality, Gayatri mantra, inner light meditation, and selfless dharma.',
    discipline: 'Self-motivated and goal-driven, especially when aligned with personal sovereignty and reputation.',
    decisionMaking: 'Rapid, decisive, instinctual; trusts personal judgment over group committees.',
    leadership: 'Inspirational, charismatic, setting bold vision and leading by visible personal example.',
    learning: 'Learns best through direct experimentation, leadership responsibility, and real-world execution.',
    travel: 'Drawn to capital cities, historic monuments, sunlit landscapes, and prestigious luxury destinations.',
    creativity: 'Expressed through original concepts, trailblazing ventures, and high-aesthetic sovereign creations.',
    healthSymbolism: 'Solar vitality, heart, spine, circulation, vitality reserves, and head region.',
    remedialTheme: 'Offering Arghya (water) to Surya at sunrise, chanting OM SURYAYA NAMAH, wearing ruby or copper accents.',
    balancedExpression: 'Confident, benevolent leader who uplifts peers and acts with magnanimity.',
    excessExpression: 'Autocratic, dismissive of others, hyper-sensitive to perceived disrespect.',
    missingNumberMeaning: 'Number 1 is absent from physical birth grid: traditionally interpreted as an invitation to cultivate assertive self-expression, stand independently, and take ownership without seeking external validation.',
    repetitionMeaning: {
      1: 'Balanced individuality, healthy self-confidence, clear speech, and ability to voice opinions without aggression.',
      2: 'Strong assertiveness, sharp verbal clarity, prominent leadership traits, and high competitive spirit.',
      3: 'Intense drive, highly talkative or dominant communication; potential struggle with listening to dissenting views.',
      4: 'Hyper-individualistic, extreme stubbornness, potential tension in teamwork; needs mindful humility practices.'
    },
    mulankMeaning: 'As Mulank 1, your instinctive nature is ambitious, self-driven, and sovereign. You prefer to initiate, command, and carve your own unique path.',
    bhagyankMeaning: 'As Bhagyank 1, your life path unfolds towards sovereign leadership, independence, executive authority, and pioneering achievements.'
  },
  2: {
    number: 2,
    grahaEn: 'Moon',
    grahaHi: 'Chandra (चन्द्र)',
    deity: 'Chandra Deva',
    element: 'Water',
    positiveTraits: ['Empathetic', 'Intuitive', 'Diplomatic', 'Cooperative', 'Nurturing', 'Imaginative', 'Peaceful'],
    shadowTraits: ['Hypersensitive', 'Moody', 'Indecisive', 'Overly dependent', 'Prone to self-doubt', 'Anxious'],
    personality: 'Gentle, intuitive, and diplomatic soul possessing deep emotional empathy and natural capacity for harmony.',
    thinkingStyle: 'Reflective, associative, intuitive, reading between the lines and sensing underlying emotional currents.',
    emotionalStyle: 'Deeply receptive, cyclical like lunar phases, seeks emotional safety and gentle validation.',
    communication: 'Soft-spoken, tactful, persuasive, empathetic; excels in reconciliation and quiet diplomacy.',
    career: ['Counseling & Psychology', 'Diplomacy & Public Relations', 'Healthcare & Nursing', 'Creative Writing', 'Hospitality', 'Arts & Design'],
    business: 'Flourishes in partnerships, advisory roles, client care, and businesses catering to emotional and domestic needs.',
    wealth: 'Wealth flows cyclically through harmonious alliances, collaborative partnerships, and patient accumulation.',
    relationships: 'Deeply romantic, caring, attentive, and devoted; values emotional intimacy and tenderness.',
    family: 'The emotional anchor of the home, fostering comfort, culinary warmth, and harmonious bonding.',
    spirituality: 'Drawn to lunar meditations, water rituals, devotion (Bhakti), and intuitive dream exploration.',
    discipline: 'Fluctuates with emotional moods; best sustained in peaceful, supportive environments.',
    decisionMaking: 'Deliberate, consensus-seeking, weighing relational impacts; requires time to process gut feelings.',
    leadership: 'Empathetic, collaborative, leading behind the scenes with gentle encouragement and moral support.',
    learning: 'Absorbs knowledge through storytelling, emotional resonance, visual arts, and empathetic listening.',
    travel: 'Drawn to coastal shores, tranquil lakes, serene retreats, and heritage cultural cities.',
    creativity: 'Poetic, lyrical, imaginative, capturing subtle human sentiments and visual beauty.',
    healthSymbolism: 'Body fluids, lymphatic system, stomach, digestive flora, and emotional nervous equilibrium.',
    remedialTheme: 'Drinking water from silver vessels, honoring maternal figures, wearing pearl, chanting OM CHANDRAYA NAMAH.',
    balancedExpression: 'Serene, compassionate diplomat who harmonizes conflicting factions effortlessly.',
    excessExpression: 'Over-sensitive, emotionally fragile, fearful of confrontation, prone to over-thinking.',
    missingNumberMeaning: 'Number 2 is absent from physical birth grid: traditionally interpreted as an area to consciously develop emotional sensitivity, patient cooperation, and intuitive listening.',
    repetitionMeaning: {
      1: 'Balanced intuition, polite manners, cooperative attitude, and healthy emotional awareness.',
      2: 'High artistic sensitivity, acute empathy, vivid imagination; may experience occasional mood swings.',
      3: 'Extremely emotional, easily hurt by criticism, prone to daydreaming or melancholy; benefits from grounding.',
      4: 'Intense emotional turbulence, perpetual anxiety or over-dependence; requires strong emotional discipline.'
    },
    mulankMeaning: 'As Mulank 2, your instinctive response is gentle, peace-seeking, and intuitive. You value connection and harmony above conflict.',
    bhagyankMeaning: 'As Bhagyank 2, your life journey teaches mastery of diplomacy, partnership, emotional balance, and collaborative wisdom.'
  },
  3: {
    number: 3,
    grahaEn: 'Jupiter',
    grahaHi: 'Guru (बृहस्पति / गुरु)',
    deity: 'Brihaspati Deva',
    element: 'Ether / Fire',
    positiveTraits: ['Wise', 'Optimistic', 'Expressive', 'Philosophical', 'Generous', 'Scholarly', 'Inspiring'],
    shadowTraits: ['Preachy', 'Scattered', 'Over-optimistic', 'Exaggerative', 'Procrastinating', 'Dogmatic'],
    personality: 'Expansive, optimistic, and scholarly mind with natural gift for advisory, education, and moral guidance.',
    thinkingStyle: 'Holistic, philosophical, synthesis-oriented, seeing the grand cosmic pattern and moral purpose.',
    emotionalStyle: 'Warm, jovial, generous, and resilient; lifts others out of despair with infectious optimism.',
    communication: 'Articulate, inspiring, eloquent, humorous, and educational; natural public orator or teacher.',
    career: ['Education & Academia', 'Law & Judiciary', 'Consulting & Mentorship', 'Publishing', 'Spiritual Guidance', 'Finance & Banking'],
    business: 'Excels in knowledge products, advisory firms, legal practices, educational institutions, and brand expansion.',
    wealth: 'Attracts prosperity through wisdom, advisory honorariums, ethical commerce, and steady organic expansion.',
    relationships: 'Honest, jovial, protective, and morally supportive; values intellectual conversations and shared values.',
    family: 'The wise mentor and moral compass of the household, encouraging education and ethical conduct.',
    spirituality: 'Deep connection to Guru parampara, sacred scriptures, philosophical discourse, and ethical living.',
    discipline: 'Strong in theoretical and moral areas, though can get scattered across too many expansive interests.',
    decisionMaking: 'Principles-based, evaluating long-term ethical implications and broad growth potential.',
    leadership: 'Mentoring leadership, empowering disciples, teaching principles, and upholding righteousness.',
    learning: 'Insatiable appetite for books, philosophy, higher sciences, ancient scriptures, and mentorship.',
    travel: 'Drawn to universities, pilgrimage hubs, ancient libraries, and culturally rich sacred capitals.',
    creativity: 'Linguistic mastery, philosophical writing, comedy, curriculum design, and oratorical arts.',
    healthSymbolism: 'Liver, arterial blood flow, thigh muscles, metabolism, and endocrine balance.',
    remedialTheme: 'Honoring spiritual teachers, wearing yellow, chanting OM GUM GURAVE NAMAH, applying saffron/turmeric tilak.',
    balancedExpression: 'Wise, benevolent counselor who guides others toward truth and honorable prosperity.',
    excessExpression: 'Tendency to lecture, dogmatism, over-promising, neglecting practical details in pursuit of ideals.',
    missingNumberMeaning: 'Number 3 is absent from birth chart: indicates a traditional recommendation to cultivate disciplined study, structured knowledge acquisition, and consistent self-expression.',
    repetitionMeaning: {
      1: 'Clear mental clarity, sharp memory, positive disposition, and good advisory aptitude.',
      2: 'Creative genius, vivid imagination, magnetic speaking voice, and strong academic or philosophical inclination.',
      3: 'Over-intellectualizing, talkative, prone to scattered energy or arrogance in knowledge; requires focus.',
      4: 'Disconnected from practical realities, extreme philosophical speculation, restlessness with daily routine.'
    },
    mulankMeaning: 'As Mulank 3, your instinctive nature is knowledge-seeking, expressive, and optimistic. You naturally counsel and uplift others.',
    bhagyankMeaning: 'As Bhagyank 3, your life path leads toward becoming an authority, counselor, educator, or beacon of wisdom and ethical leadership.'
  },
  4: {
    number: 4,
    grahaEn: 'Rahu',
    grahaHi: 'Rahu (राहू - Shadow Planet)',
    deity: 'Rahu Deva',
    element: 'Air / Electricity',
    positiveTraits: ['Methodical', 'Pragmatic', 'Disciplined', 'Unorthodox', 'Tech-savvy', 'Resilient', 'Organized'],
    shadowTraits: ['Rigid', 'Rebellious', 'Skeptical', 'Sudden anger', 'Workaholic', 'Over-critical'],
    personality: 'Grounded yet unconventional thinker capable of masterminding complex systems and breaking traditional molds.',
    thinkingStyle: 'Architectural, highly analytical, detail-oriented, with unconventional outside-the-box breakthrough capability.',
    emotionalStyle: 'Reserved, self-reliant, guarded; processes feelings through structural analysis and tangible actions.',
    communication: 'Precise, logical, blunt, questioning established orthodoxies with incisive clarity.',
    career: ['Technology & Software', 'Architecture & Engineering', 'Forensic Auditing', 'R&D', 'Real Estate & Construction', 'Data Science'],
    business: 'Excels in scalable technical systems, industrial operations, modern tech disruption, and structural projects.',
    wealth: 'Builds enduring wealth through tangible assets, real estate, breakthrough innovations, and structured discipline.',
    relationships: 'Loyal, dependable, and physically supportive; proves love through practical reliability rather than poetic words.',
    family: 'Builds solid foundations, enforces household security, financial contingencies, and structured routines.',
    spirituality: 'Approaches spirituality through esoteric sciences, astrology, shadow exploration, and Kundalini dynamics.',
    discipline: 'Ironclad when committed; thrives on checklists, deadlines, and orderly physical environments.',
    decisionMaking: 'Empirical, demanding proof, analyzing potential system vulnerabilities before proceeding.',
    leadership: 'Operational master who ensures every component functions reliably under stress.',
    learning: 'Hands-on technical study, reverse-engineering mechanisms, deep blueprint reading, and logical coding.',
    travel: 'Prefers modern engineering marvels, tech metropolises, or isolated nature retreats for deep focus.',
    creativity: 'Expressed through industrial design, systemic architecture, code, and avant-garde solutions.',
    healthSymbolism: 'Respiratory pathways, neurological synapses, electrical nervous signals, and lower limbs.',
    remedialTheme: 'Keeping surroundings clutter-free, feeding birds/stray dogs, wearing hessonite or smoky quartz, chanting OM RAHAVE NAMAH.',
    balancedExpression: 'Brilliant structural architect who transforms chaos into reliable, enduring systems.',
    excessExpression: 'Excessive rigidity, stubborn rebellion against authority, chronic dissatisfaction and work stress.',
    missingNumberMeaning: 'Number 4 is absent from physical birth grid: traditionally interpreted as a prompt to build stronger daily discipline, organizational systems, and practical follow-through.',
    repetitionMeaning: {
      1: 'Methodical habits, practical orientation, grounded thinking, and reliable execution.',
      2: 'Extraordinary technical acumen, deep organizational skill, intense work ethic; watch for stubbornness.',
      3: 'Extreme rigidity, skepticism, sudden shifts in temperament, workaholic burnout tendencies.',
      4: 'Obsessive perfectionism, hyper-critical nature, difficulty adapting to fluid circumstances.'
    },
    mulankMeaning: 'As Mulank 4, your instinctive drive is to build order, challenge outdated systems, and execute with disciplined perseverance.',
    bhagyankMeaning: 'As Bhagyank 4, your life path requires constructing enduring foundations, mastering complex systems, and creating tangible stability.'
  },
  5: {
    number: 5,
    grahaEn: 'Mercury',
    grahaHi: 'Budha (बुध)',
    deity: 'Budha Deva',
    element: 'Earth',
    positiveTraits: ['Adaptable', 'Versatile', 'Charming', 'Witty', 'Commercial', 'Balanced', 'Networking'],
    shadowTraits: ['Restless', 'Impulsive', 'Inconsistent', 'Easily bored', 'Nervous', 'Indulgent'],
    personality: 'Dynamic, versatile, and central communicator who balances the entire grid and navigates change with effortless agility.',
    thinkingStyle: 'Rapid, commercial, multifaceted, connecting disparate ideas and spotting profitable market opportunities.',
    emotionalStyle: 'Light-hearted, adaptable, cheerful, bouncing back rapidly from setbacks with curiosity.',
    communication: 'Witty, engaging, persuasive, multilingual, and magnetic; masters both verbal and written commerce.',
    career: ['Sales & Marketing', 'Media & Journalism', 'Trading & Commerce', 'Public Speaking', 'Travel & Tourism', 'Digital Networking'],
    business: 'Master merchant, dealmaker, and platform builder; thrives in fast-moving commercial environments.',
    wealth: 'Generates wealth through rapid turnover, diversified investments, media ventures, and commercial transactions.',
    relationships: 'Playful, exciting, stimulating; needs intellectual banter, personal freedom, and spontaneity.',
    family: 'The lively social connector who brings fun, outings, and modern progressive viewpoints to the clan.',
    spirituality: 'Finds the divine in communication, sacred geometry, breathwork, and the harmonious center of all paths.',
    discipline: 'Dynamic and sprint-based; works best with variety and autonomy rather than repetitive assembly lines.',
    decisionMaking: 'Fast, calculated, commercial, weighing speed of opportunity and cost-benefit ratios.',
    leadership: 'Inspirational through networking, dynamic negotiations, and agile market pivots.',
    learning: 'Rapid consumer of multimedia, podcasts, quick summaries, and live experiential workshops.',
    travel: 'Passionate globetrotter, constantly exploring new cultures, commercial markets, and trade centers.',
    creativity: 'Commercial copywriting, improvisational comedy, marketing campaigns, and multimedia production.',
    healthSymbolism: 'Central nervous system, vocal cords, speech center, speech organs, and sensory reflexes.',
    remedialTheme: 'Honoring green plants, respecting maternal uncles and peers, wearing emerald, chanting OM BUDHAYA NAMAH.',
    balancedExpression: 'Charming, versatile diplomat who brings stability, commerce, and joy to every room.',
    excessExpression: 'Extreme restlessness, reckless speculation, shallow commitments, scattered focus across too many tabs.',
    missingNumberMeaning: 'Number 5 is absent: traditionally viewed as a sign to cultivate inner balance, speech diplomacy, adaptability, and emotional equilibrium.',
    repetitionMeaning: {
      1: 'Balanced speech, versatile intellect, healthy emotional stability, and commercial awareness.',
      2: 'High verbal charisma, exceptional sales and persuasion skills, rapid wit, magnetic appeal.',
      3: 'Restless mind, rapid speech, impatience, risk of spreading energy too thin or speculative gambling.',
      4: 'Extreme volatility, erratic decision-making, nervous exhaustion; requires disciplined grounding.'
    },
    mulankMeaning: 'As Mulank 5, your instinctive nature is curious, agile, and communicative. You thrive on freedom, variety, and commercial synergy.',
    bhagyankMeaning: 'As Bhagyank 5, your destiny revolves around communication, adaptability, commercial success, and bridging diverse communities.'
  },
  6: {
    number: 6,
    grahaEn: 'Venus',
    grahaHi: 'Shukra (शुक्र)',
    deity: 'Shukra Deva',
    element: 'Water / Metal',
    positiveTraits: ['Harmonious', 'Aesthetic', 'Generous', 'Loving', 'Responsible', 'Luxurious', 'Charismatic'],
    shadowTraits: ['Self-indulgent', 'Possessive', 'Martyr complex', 'Perfectionist in romance', 'Image-obsessed'],
    personality: 'Refined, magnetic, and generous soul endowed with deep aesthetic appreciation, love for luxury, and nurturing responsibility.',
    thinkingStyle: 'Aesthetic, relational, harmonious, synthesizing beauty with practical domestic and social utility.',
    emotionalStyle: 'Affectionate, protective, deeply caring, craving aesthetic harmony and mutual appreciation.',
    communication: 'Gracious, soothing, polished, diplomatic, and aesthetically charming; puts others at immediate ease.',
    career: ['Luxury Goods & Fashion', 'Interior Architecture', 'Hospitality & Gastronomy', 'Cosmetics & Wellness', 'Entertainment & Arts', 'Family Counseling'],
    business: 'Excels in premium lifestyle brands, creative studios, hospitality, wellness clinics, and consumer aesthetics.',
    wealth: 'Attracts luxurious comforts, vehicles, property, and steady high-class client patronage.',
    relationships: 'Deeply devoted, romantic, protective; seeks lifelong domestic bliss and partner elevation.',
    family: 'The ultimate home-maker and caretaker, creating an oasis of aesthetic beauty, comfort, and culinary joy.',
    spirituality: 'Bhakti yoga, sacred arts, sound temple rituals, and honoring the Divine Feminine.',
    discipline: 'Consistent in domestic and aesthetic routines, though can succumb to comfort and luxury indulgence.',
    decisionMaking: 'Considers aesthetics, relational peace, family security, and qualitative elegance.',
    leadership: 'Nurturing, maternal/paternal, inspiring through care, mutual respect, and high standard of presentation.',
    learning: 'Thrives in visually pleasing environments with hands-on artistic, culinary, or design mediums.',
    travel: 'Drawn to scenic mountain resorts, European art capitals, five-star heritage hotels, and tranquil gardens.',
    creativity: 'Fashion, styling, interior decor, music, visual painting, and gourmet culinary creation.',
    healthSymbolism: 'Throat, vocal cords, kidneys, reproductive vitality, skin complexion, and hormonal balance.',
    remedialTheme: 'Wearing clean white or pastel attire, maintaining personal grooming, wearing opal or silver, chanting OM SHUKRAYA NAMAH.',
    balancedExpression: 'Radiant, generous patron of beauty and harmony who creates domestic peace and financial elegance.',
    excessExpression: 'Over-indulgence in sensory pleasures, possessive smothering in love, vain concern with social optics.',
    missingNumberMeaning: 'Number 6 is absent: traditionally interpreted as a prompt to embrace self-care, nurture supportive relationships, and invite aesthetic refinement.',
    repetitionMeaning: {
      1: 'Warm family love, aesthetic appreciation, balanced lifestyle tastes, and genuine domestic responsibility.',
      2: 'Pronounced artistic brilliance, magnetic charm, deep love of fine luxuries and romantic devotion.',
      3: 'Over-protectiveness, excessive expenditure on luxuries, vulnerability to emotional manipulation in love.',
      4: 'Sensory dissipation, relationship entanglements, obsession with superficial appearances.'
    },
    mulankMeaning: 'As Mulank 6, your instinctive drive is guided by love, beauty, harmony, and responsibility toward loved ones and fine aesthetics.',
    bhagyankMeaning: 'As Bhagyank 6, your life direction calls you to create harmony, provide care, achieve material elegance, and uplift family life.'
  },
  7: {
    number: 7,
    grahaEn: 'Ketu',
    grahaHi: 'Ketu (केतु - Shadow Planet)',
    deity: 'Ketu Deva / Lord Ganesha',
    element: 'Metal / Fire',
    positiveTraits: ['Analytical', 'Intuitive', 'Spiritual', 'Research-oriented', 'Introspective', 'Discerning', 'Occult wisdom'],
    shadowTraits: ['Aloof', 'Cynical', 'Secretive', 'Socially detached', 'Overthinking', 'Distrustful'],
    personality: 'Deep, introspective, and scholarly mystic who seeks profound truth beyond mundane surface appearances.',
    thinkingStyle: 'Deeply investigative, philosophical, questioning, peeling back layers to find root cosmic mechanisms.',
    emotionalStyle: 'Introspective, reserved, detached; requires periodic solitude to recharge somatic and spiritual batteries.',
    communication: 'Thoughtful, cryptic, profound, sparing with words; speaks with weight and razor-sharp insight.',
    career: ['Research & Development', 'Data Analysis', 'Spiritual Mentorship', 'Philosophy & Writing', 'Cybersecurity', 'Astrology & Occult Sciences'],
    business: 'Excels in specialized niche consultancies, research labs, IP creation, and deep diagnostic services.',
    wealth: 'Experiences unusual or unexpected wealth trajectories; succeeds when focused on mastery rather than pure greed.',
    relationships: 'Selective, values spiritual and mental communion; needs a partner who respects their private sanctuary.',
    family: 'Often walks a slightly detached or eccentric path, offering profound quiet wisdom during crises.',
    spirituality: 'Natural contemplative mystic, drawn to Moksha, Vipassana, Kundalini, and esoteric metaphysics.',
    discipline: 'Exceptional for solitary study and spiritual sadhana, though resistant to social conformity.',
    decisionMaking: 'Intuitive combined with rigorous private analysis; trusts silent inner gut knowings.',
    leadership: 'Guru-like authority who leads through specialized expertise, deep insight, and uncompromised ethics.',
    learning: 'Voracious reader of deep texts, solitary researcher, experiential seeker of hidden patterns.',
    travel: 'Drawn to ancient temples, monastic caves, misty mountains, isolated research stations, and spiritual sanctuaries.',
    creativity: 'Profound symbolic writing, abstract coding, esoteric diagrams, and contemplative sound compositions.',
    healthSymbolism: 'Pineal gland, psychic nervous sensitivity, lower spine, feet, and subtle energy meridians.',
    remedialTheme: 'Meditation in quietude, offering food to dogs, wearing cat’s eye gemstone, chanting OM KETAVE NAMAH.',
    balancedExpression: 'Wise sage who balances razor-sharp logical analysis with mystical spiritual realization.',
    excessExpression: 'Severe social alienation, nihilistic cynicism, chronic suspiciousness, and paralyzing over-analysis.',
    missingNumberMeaning: 'Number 7 is absent: traditionally viewed as an invitation to cultivate deeper inner peace, spiritual contemplation, and analytical patience.',
    repetitionMeaning: {
      1: 'Strong intuitive hunch, analytical curiosity, intellectual depth, and philosophical inclinations.',
      2: 'Profound research capability, natural occult and healing gifts, deep contemplative mind.',
      3: 'Severe introversion, emotional detachment, intense skepticism, feelings of being misunderstood.',
      4: 'Complete social isolation, vulnerability to melancholy, obsessive rumination; requires grounded social ties.'
    },
    mulankMeaning: 'As Mulank 7, your instinctive nature is introspective, truth-seeking, and intuitive. You analyze deeply before trusting.',
    bhagyankMeaning: 'As Bhagyank 7, your destiny leads toward intellectual mastery, spiritual awakening, research breakthroughs, and higher consciousness.'
  },
  8: {
    number: 8,
    grahaEn: 'Saturn',
    grahaHi: 'Shani (शनि)',
    deity: 'Shani Deva',
    element: 'Earth / Air',
    positiveTraits: ['Perseverant', 'Ambitious', 'Karmic justice', 'Disciplined', 'Strategic', 'Pragmatic', 'Enduring'],
    shadowTraits: ['Pessimistic', 'Harsh', 'Rigid', 'Burdened', 'Vindictive', 'Materialistic delay'],
    personality: 'Resilient, authoritative, and justice-oriented soul destined to master the material realm through rigorous karmic discipline.',
    thinkingStyle: 'Long-range strategic, macro-organizational, weighing risk, endurance, and compound karmic yield.',
    emotionalStyle: 'Grave, sober, deeply responsible, enduring hardships with quiet fortitude without complaining.',
    communication: 'Grounded, authoritative, no-nonsense, measured; promises only what can be concretely delivered.',
    career: ['Heavy Industries & Manufacturing', 'Corporate Governance', 'Judiciary & Law Enforcement', 'Mining & Metallurgy', 'Real Estate Infrastructure', 'Finance & Audit'],
    business: 'Master of large-scale enterprise, complex logistics, enduring corporate conglomerates, and institutional assets.',
    wealth: 'Builds massive long-term wealth through compounding, patience, property acquisition, and enduring equity.',
    relationships: 'Deeply loyal, steadfast, protective; treats commitment as an unbroken sacred contract.',
    family: 'The heavy rock of stability who shoulders family responsibilities, financial burdens, and ancestral duties.',
    spirituality: 'Karma yoga, service to the underprivileged, disciplined daily routines, and surrender to cosmic justice.',
    discipline: 'Legendary endurance, tireless work ethic, ability to withstand prolonged pressure without breaking.',
    decisionMaking: 'Sober, risk-weighted, patient; plans in decades rather than quarters.',
    leadership: 'Institutional commander who establishes durable frameworks, demands accountability, and protects workers.',
    learning: 'Learns through real-world struggle, rigorous case studies, practical experience, and disciplined mentorship.',
    travel: 'Drawn to historic ruins, industrial powerhouses, mountain passes, and ancient stone structures.',
    creativity: 'Expressed in monumental architecture, permanent engineering works, and timeless strategic systems.',
    healthSymbolism: 'Bones, teeth, joints, knees, spine alignment, and chronic longevity mechanisms.',
    remedialTheme: 'Serving the elderly and laborers, lighting mustard oil lamps on Saturdays, chanting OM SHAM SHANAISCHARAYA NAMAH.',
    balancedExpression: 'Fair, just, and unshakeable pillar of society who dispenses justice, manages great wealth, and protects others.',
    excessExpression: 'Cold authoritarianism, chronic pessimism, vindictive grudges, feeling victimized by fate.',
    missingNumberMeaning: 'Number 8 is absent: indicates a traditional recommendation to build greater financial discipline, administrative patience, and long-range stamina.',
    repetitionMeaning: {
      1: 'Practical executive ability, respect for justice, capacity for sustained hard work, and financial sense.',
      2: 'Tremendous resilience, heavy financial ambitions, master strategist; must guard against over-exertion.',
      3: 'Life filled with intense karmic lessons, heavy burdens, delays before success; requires selfless service.',
      4: 'Extreme hardness, perpetual struggle, severe delays; demands profound spiritual surrender and humility.'
    },
    mulankMeaning: 'As Mulank 8, your instinctive nature is tenacious, practical, and ambitious. You are built for resilience and ultimate mastery.',
    bhagyankMeaning: 'As Bhagyank 8, your life destiny unfolds through hard-won achievements, executive authority, karmic balance, and enduring legacy.'
  },
  9: {
    number: 9,
    grahaEn: 'Mars',
    grahaHi: 'Mangal (मंगल)',
    deity: 'Mangala Deva / Lord Hanuman',
    element: 'Fire',
    positiveTraits: ['Courageous', 'Humanitarian', 'Passionate', 'Dynamic', 'Generous', 'Fierce', 'Protective'],
    shadowTraits: ['Hot-tempered', 'Aggressive', 'Impatient', 'Resentful', 'Combative', 'Reckless'],
    personality: 'Dynamic, passionate warrior endowed with boundless vitality, courage, and a humanitarian desire to champion righteous causes.',
    thinkingStyle: 'Action-oriented, urgent, broad-brush, driven by righteous indignation and desire for swift impact.',
    emotionalStyle: 'Intense, fiery, heartfelt, transparent; feels deeply and reacts spontaneously to injustice.',
    communication: 'Passionate, energetic, direct, inspiring, sometimes blunt or fiery when provoked.',
    career: ['Defense & Armed Forces', 'Emergency Medicine & Surgery', 'Sports & Athletics', 'Humanitarian NGOs', 'Engineering & Construction', 'Activism'],
    business: 'Excels in pioneering high-energy ventures, crisis management, physical production, and mission-driven causes.',
    wealth: 'Generates wealth dynamically; generous to a fault, often funding large charitable or communal causes.',
    relationships: 'Passionate, protective, chivalrous; demands wholehearted devotion and shared adventurous vitality.',
    family: 'The passionate protector who will defend family honor and safety at any personal cost.',
    spirituality: 'Hanuman bhakti, protection mantras, social activism as spiritual worship, and fire ceremonies.',
    discipline: 'High physical discipline, thrives in competitive sports, physical challenges, and high-adrenaline tasks.',
    decisionMaking: 'Rapid, courageous, decisive; guided by gut passion and righteous protective instinct.',
    leadership: 'Frontline heroic leader who charges first into battle and inspires followers through raw courage.',
    learning: 'Kinesthetic learner, sports drill master, tactical combat case studies, and rapid experiential training.',
    travel: 'Drawn to volcanic landscapes, adventure sports destinations, battlegrounds, and vibrant cultural festivals.',
    creativity: 'Dynamic stage performance, martial arts choreography, bold visual art, and stirring speeches.',
    healthSymbolism: 'Muscular system, red blood cells, body heat, adrenal glands, and head/forehead.',
    remedialTheme: 'Chanting Hanuman Chalisa, donating blood or supporting youth sports, wearing red coral, chanting OM MANGALAYA NAMAH.',
    balancedExpression: 'Noble, chivalrous warrior who protects the vulnerable and uses boundless energy for universal upliftment.',
    excessExpression: 'Explosive temper, reckless confrontations, burnouts from fighting unnecessary battles.',
    missingNumberMeaning: 'Number 9 is absent: traditionally viewed as a prompt to awaken passionate drive, humanitarian compassion, and active courage.',
    repetitionMeaning: {
      1: 'Healthy courage, humanitarian impulses, dynamic energy, and quick execution.',
      2: 'High physical stamina, passionate determination, competitive brilliance; watch for short temper.',
      3: 'Impulsive reactions, hot temper, restless aggression, struggle with authority; requires cooling sports/mindfulness.',
      4: 'Volatile aggression, tendency toward conflict, reckless risk-taking; demands rigorous calm discipline.'
    },
    mulankMeaning: 'As Mulank 9, your instinctive drive is passionate, action-oriented, and courageous. You react with fierce loyalty and dynamic resolve.',
    bhagyankMeaning: 'As Bhagyank 9, your destiny calls you to champion righteous causes, serve humanity, lead courageously, and complete karmic cycles.'
  }
};

/**
 * Phase 8: Comprehensive Repetition Analysis Engine
 */
export interface RepetitionAnalysisResult {
  digit: number;
  count: number;
  level: string;
  graha: string;
  meaning: string;
  whatIsStrengthened: string[];
  positiveExpression: string;
  possibleExcess: string;
  balanceRecommendation: string;
  interactionWithMulank: string;
  interactionWithBhagyank: string;
}

export function analyzeNumberRepetition(
  birthGrid: Record<number, number>,
  mulank: number,
  bhagyank: number
): RepetitionAnalysisResult[] {
  const results: RepetitionAnalysisResult[] = [];

  for (let d = 1; d <= 9; d++) {
    const count = birthGrid[d] || 0;
    if (count <= 1) continue; // Only analyze actual repetitions (count >= 2)

    const profile = NUMBER_PROFILES[d];
    const levelKey = Math.min(count, 4);
    const levelName = REPETITION_LEVELS[levelKey as keyof typeof REPETITION_LEVELS] || 'Dominant';
    const repMeaning = profile.repetitionMeaning[levelKey] || profile.repetitionMeaning[4];

    results.push({
      digit: d,
      count,
      level: levelName,
      graha: profile.grahaHi,
      meaning: repMeaning,
      whatIsStrengthened: profile.positiveTraits.slice(0, 3),
      positiveExpression: `Enhanced amplification of ${profile.grahaEn}'s positive qualities: ${profile.positiveTraits.slice(0, 4).join(', ')}.`,
      possibleExcess: `Watch out for ${profile.excessExpression.toLowerCase()}`,
      balanceRecommendation: `Maintain balance through ${profile.remedialTheme.toLowerCase()}`,
      interactionWithMulank: d === mulank
        ? `Direct resonance: Your core Mulank (${mulank}) is reinforced, amplifying your instinctive identity.`
        : `Secondary support: Interacts dynamically with your Mulank (${mulank}) nature.`,
      interactionWithBhagyank: d === bhagyank
        ? `Karmic destiny alignment: This repeated frequency directly empowers your Bhagyank (${bhagyank}) life path.`
        : `Complementary vibration to your Bhagyank (${bhagyank}) destiny direction.`
    });
  }

  return results;
}

/**
 * Phase 9: Comprehensive Missing Number Analysis Engine
 */
export interface MissingNumberAnalysisResult {
  digit: number;
  graha: string;
  element: string;
  missingTheme: string;
  possibleLifeArea: string;
  developmentArea: string;
  behaviouralAdvice: string;
  practicalDevelopment: string;
  traditionalRemedyCategory: string;
}

export function analyzeMissingNumbers(
  missingDigits: number[]
): MissingNumberAnalysisResult[] {
  return missingDigits.map(d => {
    const profile = NUMBER_PROFILES[d];
    return {
      digit: d,
      graha: profile.grahaHi,
      element: profile.element,
      missingTheme: profile.missingNumberMeaning,
      possibleLifeArea: `Matters related to ${profile.career.slice(0, 2).join(' and ')}, as well as ${profile.shadowTraits.slice(0, 2).join(' / ')}.`,
      developmentArea: profile.positiveTraits.slice(0, 4).join(', '),
      behaviouralAdvice: `Consciously practice ${profile.balancedExpression.toLowerCase()}`,
      practicalDevelopment: `Engage with activities governed by ${profile.grahaEn}: ${profile.positiveTraits.slice(0, 3).join(', ')}.`,
      traditionalRemedyCategory: profile.remedialTheme
    };
  });
}
