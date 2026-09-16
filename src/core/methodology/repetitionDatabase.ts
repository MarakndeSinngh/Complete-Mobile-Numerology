export interface DetailedRepetitionEntry {
  number: number;
  count: number; // 1, 2, 3, 4, 5+
  level: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUADRUPLE_PLUS';
  meaning: string;
  strengthenedQualities: string;
  possibleExcess: string;
  practicalExpression: string;
  careerExpression: string;
  relationshipExpression: string;
  traditionalWellnessReflection: string;
  balancingRecommendation: string;
  source: string;
}

export const REPETITION_DETAILED_DATABASE: Record<number, Record<number, DetailedRepetitionEntry>> = {
  1: {
    1: {
      number: 1,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced solar individuality; healthy self-reliance, steady communicative clarity, dignified presence.',
      strengthenedQualities: 'Clarity of mind, self-respect, objective decision-making, natural leadership.',
      possibleExcess: 'Minimal; steady ego boundaries without arrogance.',
      practicalExpression: 'Expresses opinions constructively while respecting alternative viewpoints.',
      careerExpression: 'Dependable individual contributor or balanced team lead.',
      relationshipExpression: 'Self-sufficient partner capable of healthy emotional intimacy.',
      traditionalWellnessReflection: 'Balanced solar plexus, steady cardiac rhythm, regular vitality.',
      balancingRecommendation: 'Spend 10 minutes in morning sunlight; stay hydrated.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 1,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Heightened charisma, persuasive speech, authoritative command, and ambitious vision.',
      strengthenedQualities: 'Rapid executive execution, strong vocal projection, magnetic leadership.',
      possibleExcess: 'Occasional impatience when others hesitate or fail to meet deadlines.',
      practicalExpression: 'Takes charge of group deliberations with confidence and initiative.',
      careerExpression: 'Executive management, entrepreneurship, public speaking, administrative roles.',
      relationshipExpression: 'Assertive, deeply protective, and devoted; expects mutual respect.',
      traditionalWellnessReflection: 'Mild vascular tension or tendency to run warm; monitor caffeine intake.',
      balancingRecommendation: 'Practice active listening; drink water stored in copper vessel during daytime.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 1,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Fierce independence, intense personal momentum, high ambition, and dominance.',
      strengthenedQualities: 'Unyielding perseverance, single-minded focus, pioneering courage.',
      possibleExcess: 'Authoritarian demeanor, impatience with team consensus, verbal bluntness.',
      practicalExpression: 'Prefers working independently rather than waiting for bureaucratic approval.',
      careerExpression: 'Founder, sole-proprietor visionary, high-stakes turnaround specialist.',
      relationshipExpression: 'Can inadvertently dominate family discussions; needs conscious softness.',
      traditionalWellnessReflection: 'Elevated internal heat, cranial tension, neck/shoulder stiffness under stress.',
      balancingRecommendation: 'Sheetali (cooling) pranayama; practice silent reflection before responding.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 1,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Excessive solar combustion; traditional classical markers identify mismanagement, short temper, ego friction, and adjustment challenges.',
      strengthenedQualities: 'Unyielding monumental willpower and relentless personal momentum.',
      possibleExcess: 'Mismanagement, short temper, stress, egoistic stance, resistance to compromise or adjustment.',
      practicalExpression: 'High internal pressure; struggles to delegate tasks effectively due to micro-management.',
      careerExpression: 'Extreme lone-wolf visionary; struggles in cooperative matrix hierarchies.',
      relationshipExpression: 'Friction due to uncompromising ego stances; partner may feel unacknowledged.',
      traditionalWellnessReflection: 'Traditional indicators reflect elevated blood pressure, cervical stiffness, migraine tendencies, and cardiovascular vitality strain. Consult medical professionals.',
      balancingRecommendation: 'Offer water to morning sun (Surya Arghya) with humble heart; practice cooling breathwork; donate wheat or jaggery on Sundays.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  2: {
    1: {
      number: 2,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced lunar empathy; gentle intuition, diplomatic tact, emotional intelligence, and cooperation.',
      strengthenedQualities: 'Patience, receptive listening, compassionate counseling, peace-making.',
      possibleExcess: 'Minimal; healthy balance between emotional sensitivity and personal boundaries.',
      practicalExpression: 'Acts as gentle mediator who de-escalates conflict smoothly.',
      careerExpression: 'Human resources, team facilitation, client relations, healthcare.',
      relationshipExpression: 'Warm, attentive, loyal, and supportive companion.',
      traditionalWellnessReflection: 'Balanced fluid systems, restful sleep, harmonious lymphatic circulation.',
      balancingRecommendation: 'Drink water from clean glass or silver; enjoy quiet evening walks.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 2,
      count: 2,
      level: 'DOUBLE',
      meaning: 'High emotional sensitivity, acute artistic flair, supernatural intuitive radar, and deep empathy.',
      strengthenedQualities: 'Artistic creativity, intuitive pattern recognition, deep counseling capacity.',
      possibleExcess: 'Over-sensitivity to environmental moods; taking neutral criticism personally.',
      practicalExpression: 'Senses subtle emotional dynamics in rooms before words are spoken.',
      careerExpression: 'Psychology, fine arts, creative writing, diplomatic counseling, healthcare.',
      relationshipExpression: 'Deeply romantic and tender; thrives when receiving frequent emotional reassurance.',
      traditionalWellnessReflection: 'Slight vulnerability to fluid retention, sleep rhythm fluctuations, sinus sensitivity.',
      balancingRecommendation: 'Maintain clear emotional boundaries; avoid staying up late near open water.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 2,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Heightened emotional vulnerability, intense empathy, fluctuating moods, and dependency.',
      strengthenedQualities: 'Deep spiritual compassion, profound poetic imagination.',
      possibleExcess: 'Frequent mood swings, indecision, taking on everyone else\'s sorrows.',
      practicalExpression: 'Needs substantial quiet retreat time after social engagements to decompress.',
      careerExpression: 'Deep artistic solitude, specialized therapeutic counseling, hospice care.',
      relationshipExpression: 'Emotionally demanding; vulnerability to feeling abandoned or neglected.',
      traditionalWellnessReflection: 'Tension headaches, emotional digestive distress, low energy slumps.',
      balancingRecommendation: 'Wear light silver jewelry; drink from a silver glass; practice grounding mudras.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 2,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Severe lunar saturation; traditional classical markers identify mood swings, depression tendencies, overthinking, and emotional fragility.',
      strengthenedQualities: 'Uncanny mediumistic intuition and boundless artistic imagination.',
      possibleExcess: 'Chronic mood swings, depressive thoughts, severe overthinking, emotional co-dependency.',
      practicalExpression: 'Paralysis by analysis; second-guessing decisions due to imaginary worst-case scenarios.',
      careerExpression: 'Struggles in competitive or harsh corporate environments; requires gentle, creative spaces.',
      relationshipExpression: 'Severe vulnerability to emotional heartbreak and intense hypersensitivity.',
      traditionalWellnessReflection: 'Traditional indicators reflect anxiety, fear, low blood pressure tendencies, digestive weakness, and cold/respiratory sensitivities. Consult medical professionals.',
      balancingRecommendation: 'Drink water exclusively from a pure silver tumbler; practice gentle pranayama (Anulom Vilom); honor mother; meditate on full moon.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  3: {
    1: {
      number: 3,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Jupiterian wisdom; optimism, educational curiosity, articulate speech, and moral values.',
      strengthenedQualities: 'Intellectual depth, enthusiasm, counseling aptitude, generous spirit.',
      possibleExcess: 'Minimal; healthy balance between sharing knowledge and learning from others.',
      practicalExpression: 'Explains complex ideas simply with cheerful good humor.',
      careerExpression: 'Education, legal advisory, management consultancy, media publishing.',
      relationshipExpression: 'Cultured, encouraging, intellectually stimulating, and joyful partner.',
      traditionalWellnessReflection: 'Healthy metabolic balance, steady liver energy, balanced appetite.',
      balancingRecommendation: 'Read inspiring literature; share knowledge freely.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 3,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Scholarly authority, pedagogical mastery, expansive creativity, and philosophical depth.',
      strengthenedQualities: 'Eloquent public speaking, inspiring mentorship, prolific writing, optimism.',
      possibleExcess: 'Tendency to lecture friends and family; occasional ungrounded idealism.',
      practicalExpression: 'Naturally steps into mentorship and advisory roles across organizations.',
      careerExpression: 'University professor, author, executive coach, senior spiritual counselor.',
      relationshipExpression: 'Generous and nurturing; values deep philosophical discussions at home.',
      traditionalWellnessReflection: 'Tendency to over-indulge in sweets or rich carbohydrate-heavy foods.',
      balancingRecommendation: 'Apply yellow saffron tilak on forehead; fast or eat lightly on Thursdays.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 3,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Expansive intellect, boundless verbal output, excessive idealism, and theoretical detachment.',
      strengthenedQualities: 'Vast intellectual repository, visionary optimism, inspirational eloquence.',
      possibleExcess: 'Incessant talking, difficulty keeping secrets, neglecting practical execution.',
      practicalExpression: 'Can overwhelm listeners with encyclopedic explanations and unsolicited advice.',
      careerExpression: 'Theorist, international keynote speaker, think-tank philosopher.',
      relationshipExpression: 'May neglect mundane household chores in favor of grand philosophical pursuits.',
      traditionalWellnessReflection: 'Weight gain tendencies, sluggish liver/digestive metabolism, physical inertia.',
      balancingRecommendation: 'Practice Maun Vrat (silence) for 1-2 hours on Thursdays; engage in daily physical exercise.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 3,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Excessive Jupiterian expansion; traditional classical markers identify weight gain, talkative habits, and refusal to listen to others.',
      strengthenedQualities: 'Monumental conceptual capacity and endless theoretical knowledge.',
      possibleExcess: 'Weight gain, refusing to listen to anybody, relentless talking, intellectual dogmatism.',
      practicalExpression: 'Monopolizes conversations completely; dismisses feedback from practical peers.',
      careerExpression: 'Struggles in hierarchical teams; insists on absolute autonomy in intellectual theories.',
      relationshipExpression: 'Spouse may feel talked at rather than heard; domestic communication can be one-way.',
      traditionalWellnessReflection: 'Traditional indicators reflect weight accumulation, liver/pancreas overload, blood sugar fluctuations, and physical stagnation. Consult medical professionals.',
      balancingRecommendation: 'Observe strict silence (Maun Vrat) on Thursdays; avoid bananas, excessive ghee, and sweets; donate yellow items or books to poor students.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  4: {
    1: {
      number: 4,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Rahu/Uranus innovation; practical structure, technical skill, out-of-the-box problem solving.',
      strengthenedQualities: 'Methodical persistence, systems thinking, organizational logic.',
      possibleExcess: 'Minimal; healthy skepticism without rigid obstinacy.',
      practicalExpression: 'Builds reliable step-by-step systems that prevent operational failure.',
      careerExpression: 'Software engineering, project architecture, operations management, accounting.',
      relationshipExpression: 'Dependable, loyal, and practical companion who provides solid foundation.',
      traditionalWellnessReflection: 'Stable nervous system, consistent stamina, good bone structure.',
      balancingRecommendation: 'Maintain organized daily schedule; spend time in nature.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 4,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Sharp disruptive intellect, unconventional problem solving, technological mastery, and rapid execution.',
      strengthenedQualities: 'Pioneering technical breakthroughs, pattern decoding, strategic restructuring.',
      possibleExcess: 'Stubborn attachment to particular methods, sudden impatience with traditional rules.',
      practicalExpression: 'Redesigns broken processes with unconventional and highly efficient workflows.',
      careerExpression: 'Cybersecurity, fintech innovation, frontier engineering, corporate restructuring.',
      relationshipExpression: 'Fiercely loyal but requires personal space and unorthodox lifestyle habits.',
      traditionalWellnessReflection: 'Nervous system sensitivity, occasional sleep disturbances under high screen load.',
      balancingRecommendation: 'Place pure sandalwood in living area; feed stray dogs on Saturdays; limit blue light.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 4,
      count: 3,
      level: 'TRIPLE',
      meaning: 'High-voltage mental energy, radical unorthodoxy, hyper-analytical restlessness, and skepticism.',
      strengthenedQualities: 'Genius-level pattern recognition, uncanny technical intuition.',
      possibleExcess: 'Chronic anxiety, unexpected career disruptions, suspicion of allies, insomnia.',
      practicalExpression: 'Obsessively analyzes systems to find minute vulnerabilities and hidden flaws.',
      careerExpression: 'Deep cryptography, forensic intelligence, advanced disruptive tech ventures.',
      relationshipExpression: 'Can be unpredictable and detached; partner needs deep emotional patience.',
      traditionalWellnessReflection: 'Chronic nervous strain, sudden headaches, irregular sleep cycles.',
      balancingRecommendation: 'Keep bedroom terrace clutter-free; walk barefoot on green grass; chant OM RAHAVE NAMAH.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 4,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Extreme Rahu intensity; traditional classical markers identify sudden gains and losses, mental illusions, chronic trust issues, and frequent headaches.',
      strengthenedQualities: 'Mastery of complex virtual, digital, and technological illusions.',
      possibleExcess: 'Sudden erratic swings (financial/weight), living in illusions/paranoia, difficulty trusting anyone, chronic headaches.',
      practicalExpression: 'Suspects hidden motives everywhere; struggles to maintain long-term cooperative partnerships.',
      careerExpression: 'Prone to sudden dramatic career pivot points, legal scrutiny, and extreme high-stakes bets.',
      relationshipExpression: 'Deeply suspicious nature can strain marriages; requires steady, transparent communication.',
      traditionalWellnessReflection: 'Traditional indicators reflect diagnostic ambiguity, chronic headaches, respiratory/nervous strain, and psychosomatic tension. Consult medical professionals.',
      balancingRecommendation: 'Keep terrace and North-East zone spotless; feed stray dogs regularly; keep natural sandalwood nearby; chant Rahu mantra.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  5: {
    1: {
      number: 5,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Mercurial versatility; agile communication, commercial instinct, adaptability, and charm.',
      strengthenedQualities: 'Quick learning, social dexterity, financial sense, witty speech.',
      possibleExcess: 'Minimal; healthy curiosity without superficial scattering.',
      practicalExpression: 'Adapts seamlessly to changing environments and communicates with all social strata.',
      careerExpression: 'Sales, marketing, journalism, retail commerce, public relations, consulting.',
      relationshipExpression: 'Lively, entertaining, communicative, and emotionally flexible partner.',
      traditionalWellnessReflection: 'Healthy nervous agility, balanced vocal cords, smooth speech cadence.',
      balancingRecommendation: 'Keep a clean green plant in workspace; engage in regular social interactions.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 5,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Lightning calculation speed, master networking dexterity, high commercial eloquence, and multitasking.',
      strengthenedQualities: 'Persuasive negotiations, rapid market calculations, prolific networking.',
      possibleExcess: 'Restlessness, starting many ventures simultaneously without seeing them to completion.',
      practicalExpression: 'Juggles multiple deals, calls, and projects with effortless charm.',
      careerExpression: 'International trading, fintech broking, media direction, venture negotiations.',
      relationshipExpression: 'Exciting, spontaneous, and talkative; dislikes domestic boredom and rigid routines.',
      traditionalWellnessReflection: 'Tendency toward nervous fatigue, sensory overstimulation, mental restlessness.',
      balancingRecommendation: 'Feed green grass to cows on Wednesdays; practice digital detox in evenings.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 5,
      count: 3,
      level: 'TRIPLE',
      meaning: 'High-frequency nervous speed, scattered focus, hyperactive communication, and impatience.',
      strengthenedQualities: 'Unmatched speed of thought, verbal wit, agile improvisation.',
      possibleExcess: 'Superficiality, conversational interruption, financial restlessness, impulsive trades.',
      practicalExpression: 'Leaves projects 80% finished to chase the next exciting novelty.',
      careerExpression: 'Rapid algorithmic commerce, day-trading, viral news reporting, freelance brokerage.',
      relationshipExpression: 'Struggles with quiet domestic consistency; requires constant novelty and mental games.',
      traditionalWellnessReflection: 'Insomnia, digestive nervous irritation, rapid speech fatigue, fidgeting.',
      balancingRecommendation: 'Practice calming meditation; worship Tulsi plant; consume green vegetables.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 5,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Severe Mercurial agitation; traditional classical markers identify financial losses, lethargy/laziness alternating with mania, illogical speech, and involvement in scams or shady schemes.',
      strengthenedQualities: 'Extreme linguistic agility and rapid calculation reflex.',
      possibleExcess: 'Money loss, laziness/lethargy, illogical talks, getting enticed into scams, erratic contracts.',
      practicalExpression: 'Jumps between get-rich-quick schemes; speaks incoherently when agitated.',
      careerExpression: 'High risk of sudden business collapses due to rash over-commitments or speculative shortcuts.',
      relationshipExpression: 'Unstable domestic presence; unreliable financial follow-through causing partner friction.',
      traditionalWellnessReflection: 'Traditional indicators reflect chronic restlessness, sleep-wake cycle disruption, skin sensitivities, and neurological/speech strain. Consult medical professionals.',
      balancingRecommendation: 'Feed green grass to cows every Wednesday; water and worship holy Tulsi plant daily; commit to disciplined long-term investing; avoid all speculative gambling.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  6: {
    1: {
      number: 6,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Venusian harmony; aesthetic refinement, domestic loyalty, hospitality, and magnetic charm.',
      strengthenedQualities: 'Artistic appreciation, family responsibility, gentle tact, luxurious comfort.',
      possibleExcess: 'Minimal; healthy enjoyment of fine things without superficial vanity.',
      practicalExpression: 'Creates welcoming, beautiful environments where family and guests feel cherished.',
      careerExpression: 'Interior design, fashion, luxury hospitality, family enterprise, human relations.',
      relationshipExpression: 'Devoted, romantic, generous, and deeply attentive life partner.',
      traditionalWellnessReflection: 'Healthy reproductive balance, radiant skin vitality, smooth circulation.',
      balancingRecommendation: 'Maintain pleasant scents and clean beauty in living space.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 6,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Exceptional artistic taste, supreme luxury attraction, magnetic charisma, and lavish domestic care.',
      strengthenedQualities: 'Creative mastery, high aesthetic standards, hospitality leadership, social elegance.',
      possibleExcess: 'Extravagant expenditures on high-end luxury; reluctance to enforce tough boundaries.',
      practicalExpression: 'Curates premium aesthetic spaces and commands natural admiration in social circles.',
      careerExpression: 'Haute couture, luxury real estate, film arts, aesthetic medicine, culinary curation.',
      relationshipExpression: 'Deeply romantic and lavish; makes the marital sanctuary the emotional center of life.',
      traditionalWellnessReflection: 'Tendency to indulge in sweet or rich foods; watch lifestyle metabolic balance.',
      balancingRecommendation: 'Donate white sweets or clothes to underprivileged girls on Fridays; wear sandalwood.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 6,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Intense luxury indulgence, emotional sensitivity in love affairs, excessive spending, and vanity.',
      strengthenedQualities: 'Exquisite artistic discernment, irresistible charm, social magnetism.',
      possibleExcess: 'Living beyond financial means, emotional jealousy, obsession with external appearances.',
      practicalExpression: 'Spends large sums on vehicles, apparel, and entertainment while ignoring savings.',
      careerExpression: 'High-end celebrity styling, luxury event curation, theatrical entertainment.',
      relationshipExpression: 'Possessive and demanding; needs constant admiration and luxurious pampering.',
      traditionalWellnessReflection: 'Fatigue from rich living, urinary/kidney sensitivity, skin sluggishness.',
      balancingRecommendation: 'Practice fasting or simple eating on Fridays; donate white flowers or camphor.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 6,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Severe Venusian excess; traditional classical markers identify manipulative tendencies, risk of defamation, multiple conflicting relationships, luxury addiction, and surging expenditures.',
      strengthenedQualities: 'Peerless seductive charm, hypnotic aesthetic magnetism, and creative genius.',
      possibleExcess: 'Manipulative behavior, reputation risk/defamation, multiple romantic entanglements, luxury addiction, massive expenditures.',
      practicalExpression: 'Compulsive spending on status symbols; uses emotional manipulation to get personal way.',
      careerExpression: 'Vulnerable to public scandals or controversies in creative or entertainment fields.',
      relationshipExpression: 'Severe marital turbulence, trust betrayals, and complicated relationship dramas.',
      traditionalWellnessReflection: 'Traditional indicators reflect reproductive/lifestyle fatigue, metabolic sluggishness from over-indulgence, and skin strain. Consult medical professionals.',
      balancingRecommendation: 'Uphold strict moral boundaries; honor female family members; donate white sweets, milk, or camphor on Fridays; maintain simple, grounded living.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  7: {
    1: {
      number: 7,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Ketu insight; analytical curiosity, spiritual depth, technical research, and discernment.',
      strengthenedQualities: 'Independent inquiry, quiet observation, scientific mindset, integrity.',
      possibleExcess: 'Minimal; healthy privacy without antisocial aloofness.',
      practicalExpression: 'Investigates root causes of problems thoroughly before accepting standard answers.',
      careerExpression: 'Scientific research, software architecture, specialized forensics, education, psychology.',
      relationshipExpression: 'Loyal, thoughtful, and private partner; values quiet soul-level companionship.',
      traditionalWellnessReflection: 'Good mental calm, balanced sleep, natural interest in clean living.',
      balancingRecommendation: 'Spend quiet time in nature; practice daily prayer or meditation.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 7,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Deep metaphysical intuition, exceptional research mastery, spiritual detachment, and error detection.',
      strengthenedQualities: 'Forensic precision, uncanny intuition, esoteric wisdom, patent research.',
      possibleExcess: 'Tendency to withdraw socially, over-analyzing past emotional disappointments.',
      practicalExpression: 'Discovers hidden bugs, fraudulent data, or deep patterns that others completely overlook.',
      careerExpression: 'Clinical diagnostics, occult sciences, advanced forensics, clinical psychology.',
      relationshipExpression: 'Selective and introspective; requires a partner who respects sacred personal space.',
      traditionalWellnessReflection: 'Vulnerability to nervous overthinking, occasional joint or foot sensitivity.',
      balancingRecommendation: 'Worship Lord Ganesha; keep a silver coin in wallet; maintain clean feet.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 7,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Profound detachment, feeling alien in commercial settings, psychic sensitivity, and skepticism.',
      strengthenedQualities: 'Deep spiritual illumination, supernatural research ability, total non-attachment.',
      possibleExcess: 'Severe social isolation, melancholia, difficulty maintaining commercial contracts.',
      practicalExpression: 'Lives largely in private intellectual and spiritual realms; disdains mundane office politics.',
      careerExpression: 'Spiritual monasticism, solitary scientific authorship, specialized esoteric research.',
      relationshipExpression: 'Struggles with mundane romantic expectations; needs quiet emotional space.',
      traditionalWellnessReflection: 'Sleep disturbances from over-active subconscious, low vitality slumps.',
      balancingRecommendation: 'Donate woolen blankets or clothes to sadhus or needy individuals on Saturdays; chant Ganesha mantra.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 7,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Severe Ketu withdrawal; traditional classical markers identify chronic overthinking, multiple conflicting relationship entanglements, and recurring experiences of being cheated in business, finance, or love.',
      strengthenedQualities: 'Transcendent mystical intuition and absolute penetration into cosmic reality.',
      possibleExcess: 'Chronic overthinking, multiple relationship disappointments, getting cheated in business, finance, or love, severe alienation.',
      practicalExpression: 'Paralyzed by distrust of worldly institutions; repeatedly places trust in unworthy individuals.',
      careerExpression: 'Repeated business betrayals unless operating with ironclad legal contracts or solitary roles.',
      relationshipExpression: 'Emotional disillusionment; feeling repeatedly misunderstood and abandoned.',
      traditionalWellnessReflection: 'Traditional indicators reflect mental fatigue, deep melancholia, foot/joint vulnerability, and metabolic stagnation. Consult medical professionals.',
      balancingRecommendation: 'Worship Lord Ganesha with 21 Durva grass blades on Wednesdays; wash feet before sleep; wear pure silver ring; avoid dwelling on past betrayals; chant OM GUM GANAPATAYE NAMAH.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  8: {
    1: {
      number: 8,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Saturnian discipline; steadfast patience, practical organization, integrity, and endurance.',
      strengthenedQualities: 'Reliability, realistic judgment, administrative perseverance, executive focus.',
      possibleExcess: 'Minimal; healthy realism without chronic pessimism.',
      practicalExpression: 'Executes complex, tedious responsibilities methodically without complaining.',
      careerExpression: 'Corporate finance, civil infrastructure, judicial compliance, heavy management.',
      relationshipExpression: 'Steadfast, trustworthy, and dependable partner who provides lasting stability.',
      traditionalWellnessReflection: 'Strong skeletal structure, steady joint health, resilient stamina.',
      balancingRecommendation: 'Serve elderly workers; maintain clean and orderly workspace.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 8,
      count: 2,
      level: 'DOUBLE',
      meaning: 'Monumental resilience, executive patience, ability to manage massive industrial complexity, and discipline.',
      strengthenedQualities: 'Enduring work ethic, strategic risk management, permanent asset accumulation.',
      possibleExcess: 'Heavy seriousness, difficulty relaxing, delayed gratification to an extreme.',
      practicalExpression: 'Builds long-term institutions and assets brick by brick through years of effort.',
      careerExpression: 'Heavy engineering, mining, judiciary, corporate turnaround, real estate infrastructure.',
      relationshipExpression: 'Extremely loyal and protective; expresses devotion through tangible security.',
      traditionalWellnessReflection: 'Tendency toward bone/joint stiffness, muscular tension, dry constitution.',
      balancingRecommendation: 'Light a mustard oil lamp under Peepal tree on Saturdays; serve manual laborers.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 8,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Heavy karmic burdens, slow delayed rewards, emotional stoicism, and intense labor.',
      strengthenedQualities: 'Iron stamina, total fearlessness in facing hardship, absolute dependability.',
      possibleExcess: 'Pessimism, severe self-criticism, taking on excessive responsibility, rigidity.',
      practicalExpression: 'Feels that nothing comes without monumental struggle; struggles to delegate.',
      careerExpression: 'Crisis management, legal defense, deep industrial operations, restructuring.',
      relationshipExpression: 'Can appear austere and emotionally guarded; requires patient partner.',
      traditionalWellnessReflection: 'Chronic joint aches, dental sensitivity, sluggish digestion, fatigue.',
      balancingRecommendation: 'Donate black sesame and mustard oil on Saturdays; practice gentle yoga stretches.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 8,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Severe Saturnian compression; traditional classical markers identify monumental hurdles, property losses, court visits, and police/legal entanglements.',
      strengthenedQualities: 'Supreme unshakeable stoicism and ability to survive the harshest worldly trials.',
      possibleExcess: 'Endless hurdles, property loss or disputes, repeated court visits, police or bureaucratic disputes, chronic delays.',
      practicalExpression: 'Encounters continuous bureaucratic, institutional, and legal obstacles in ventures.',
      careerExpression: 'Heavy friction in corporate or governmental hierarchies; requires strict legal vetting on all documents.',
      relationshipExpression: 'Domestic life burdened by external legal or financial trials; partner needs iron fortitude.',
      traditionalWellnessReflection: 'Traditional indicators reflect joint/bone stiffness, chronic fatigue, acidity, dental vulnerability, and memory strain. Consult medical professionals.',
      balancingRecommendation: 'Perform regular humble service to manual laborers and sanitation workers; light mustard oil lamp on Saturdays; donate black sesame; chant Shani Gayatri Mantra; avoid unfair shortcuts.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  9: {
    1: {
      number: 9,
      count: 1,
      level: 'SINGLE',
      meaning: 'Balanced Martial courage; energy, humanitarian passion, quick execution, and protective drive.',
      strengthenedQualities: 'Bravery, generosity, high initiative, decisive action, leadership.',
      possibleExcess: 'Minimal; healthy assertiveness without aggressive outbursts.',
      practicalExpression: 'Steps up immediately to protect vulnerable teammates and solve urgent crises.',
      careerExpression: 'Emergency services, defense leadership, medical surgery, athletics, real estate.',
      relationshipExpression: 'Passionate, warm, fiercely protective, and generous life partner.',
      traditionalWellnessReflection: 'Strong muscular tone, active circulation, rapid recovery.',
      balancingRecommendation: 'Engage in daily cardiovascular exercise; channel energy into sports.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 9,
      count: 2,
      level: 'DOUBLE',
      meaning: 'High-octane vitality, explosive courage, humanitarian crusader drive, and commanding energy.',
      strengthenedQualities: 'Rapid crisis execution, inspiring physical bravery, generous philanthropy.',
      possibleExcess: 'Quick temper, impatience with slow compromise, intolerance for weakness.',
      practicalExpression: 'Charges into high-stakes problems fearlessly and gets immediate results.',
      careerExpression: 'Military command, trauma surgery, championship sports, emergency management.',
      relationshipExpression: 'Intensely protective, honorable, and passionate; needs a calming domestic partner.',
      traditionalWellnessReflection: 'High internal heat, propensity for muscular inflammation or minor cuts/burns.',
      balancingRecommendation: 'Recite Hanuman Chalisa; drink water from clay pot; avoid overly spicy food.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 9,
      count: 3,
      level: 'TRIPLE',
      meaning: 'Fiery impulsiveness, explosive temper, confrontational responses, and physical burnout.',
      strengthenedQualities: 'Indomitable bravery, relentless fight for justice, heroic self-sacrifice.',
      possibleExcess: 'Frequent anger flare-ups, driving aggressively, burnouts, marital friction.',
      practicalExpression: 'Can escalate small disagreements into dramatic ideological confrontations.',
      careerExpression: 'Frontline defense, dangerous exploration, high-risk competitive combat.',
      relationshipExpression: 'Tempestuous and demanding; partner must know how to de-escalate tension gently.',
      traditionalWellnessReflection: 'Elevated blood pressure flare-ups, gastric acidity, inflammatory flare-ups.',
      balancingRecommendation: 'Practice Sheetali (cooling) breathwork; donate red lentils on Tuesdays; avoid hot chilies.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 9,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'Severe Martial conflagration; traditional classical markers identify anger issues, rude behavior, risk of surgery/accidents, and debt/loan entanglements.',
      strengthenedQualities: 'Supreme warrior spirit and total readiness to face any physical adversary.',
      possibleExcess: 'Severe anger issues, rude/abrupt behaviour, surgery/injury vulnerability, accident risk, debt and loan entanglements.',
      practicalExpression: 'Acts before thinking; burns bridges in moments of rage; incurs impulsive liabilities.',
      careerExpression: 'High-risk occupations; vulnerable to severe disputes with partners or disciplinary issues.',
      relationshipExpression: 'Explosive domestic arguments; requires conscious commitment to non-violence and patience.',
      traditionalWellnessReflection: 'Traditional indicators reflect blood pressure spikes, gastric acidity, inflammatory flare-ups, muscular strain, and injury proneness. Consult medical professionals.',
      balancingRecommendation: 'Recite Hanuman Chalisa daily with devotion; strictly avoid red meat and ultra-hot spices; donate blood safely once a year; donate sweets to laborers on Tuesdays; practice peaceful cooling breathing.',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  }
};

export function getDetailedRepetitionAnalysis(num: number, count: number): DetailedRepetitionEntry {
  const safeCount = Math.min(Math.max(1, count), 4);
  const numData = REPETITION_DETAILED_DATABASE[num];
  if (numData && numData[safeCount]) {
    return numData[safeCount];
  }
  // Fallback
  return {
    number: num,
    count,
    level: count >= 4 ? 'QUADRUPLE_PLUS' : count === 3 ? 'TRIPLE' : count === 2 ? 'DOUBLE' : 'SINGLE',
    meaning: `Repetition level ${count} of number ${num}`,
    strengthenedQualities: `Amplified resonance of planet ${num}`,
    possibleExcess: count >= 3 ? 'Vulnerability to planetary excess' : 'Minimal excess',
    practicalExpression: `Active expression of ${num} attributes`,
    careerExpression: `Professional execution of ${num}`,
    relationshipExpression: `Domestic balance of ${num}`,
    traditionalWellnessReflection: 'Maintain balanced lifestyle and regular physical checkups.',
    balancingRecommendation: 'Maintain daily meditation and balanced lifestyle.',
    source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
  };
}
