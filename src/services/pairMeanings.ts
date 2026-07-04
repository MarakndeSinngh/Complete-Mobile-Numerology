export interface PairMeaning {
  meaning: string;
  positive: string;
  negative: string;
  area: 'Wealth' | 'Career' | 'Relationships' | 'Health' | 'Spiritual' | 'General';
  severity: number; // 0 to 100
}

export const PAIR_MEANINGS: Record<string, PairMeaning> = {
  // 1-series
  '11': {
    meaning: 'Leadership and Authority',
    positive: 'Fosters command, confidence, administrative power, and self-esteem.',
    negative: 'Can trigger self-absorption, ego clashes, and stubbornness.',
    area: 'Career',
    severity: 85
  },
  '12': {
    meaning: 'Money Saving Person',
    positive: 'Educated, financially stable, attracts an attractive and helpful partner.',
    negative: 'Slight sensitivity in communications.',
    area: 'Wealth',
    severity: 75
  },
  '21': {
    meaning: 'Sensitive & Financial Leakage',
    positive: 'High creativity and empathy.',
    negative: 'Triggers waste of money and emotional vulnerability.',
    area: 'Wealth',
    severity: 45
  },
  '13': {
    meaning: 'Reputed Work and High Respect',
    positive: 'Good education, works in civil services or public sector, well-respected.',
    negative: 'Can cause ego conflicts with elders or advisors.',
    area: 'Career',
    severity: 90
  },
  '31': {
    meaning: 'Government Connection & Prestige',
    positive: 'Highly respected, works in administration, popular in social circles.',
    negative: 'Slight rigidity in accepting opinions.',
    area: 'Career',
    severity: 90
  },
  '14': {
    meaning: 'Secret Enemies & Defamation',
    positive: 'Brings sudden insights, sharp mind.',
    negative: 'Loss of money, possibility of loans, legal notices, and hidden enemies.',
    area: 'Career',
    severity: 30
  },
  '41': {
    meaning: 'Obstruction & Money Loss Node',
    positive: 'Unorthodox analytical skill.',
    negative: 'Defamation, loss of wealth, legal or government obstacles, bone/spine issues.',
    area: 'Wealth',
    severity: 30
  },
  '15': {
    meaning: 'Success in Exams & Family Support',
    positive: 'Great academic success, support from father, helpful in marital alignment.',
    negative: 'Over-calculation can delay action.',
    area: 'Career',
    severity: 95
  },
  '51': {
    meaning: 'Auspicious Business Commencement',
    positive: 'Highly analytical, supportive parenting structures, success in competitive exams.',
    negative: 'Communicative restlessness.',
    area: 'Career',
    severity: 95
  },
  '16': {
    meaning: 'Money Loss & Career Obstacles',
    positive: 'Creative, aesthetic eye.',
    negative: 'Job/money loss, causes UTI/piles issues, partner health concerns.',
    area: 'Wealth',
    severity: 35
  },
  '61': {
    meaning: 'Financial Slump & Physical Strain',
    positive: 'Luxury-loving, charming.',
    negative: 'Money leakage, marriage challenges, bladder or physical strain.',
    area: 'Wealth',
    severity: 35
  },
  '17': {
    meaning: 'Government Connection & Leadership',
    positive: 'Excellent government connections, strong leadership, good public relations.',
    negative: 'Isolation or detachment from peers.',
    area: 'Career',
    severity: 88
  },
  '71': {
    meaning: 'Public Relations & Government Support',
    positive: 'Good contacts, leadership abilities, aid from state agencies.',
    negative: 'Stubbornness or distance in relationships.',
    area: 'Career',
    severity: 88
  },
  '18': {
    meaning: 'Father-Son Discord & Career Delays',
    positive: 'Highly persistent, deep sense of duty.',
    negative: 'Possibility of father\'s loss, government issues, frequent job changes, arguments with authority, delays in rewards.',
    area: 'Career',
    severity: 25
  },
  '81': {
    meaning: 'Administrative Delays & Friction',
    positive: 'Patient and analytical executor.',
    negative: 'Frequent job switches, clashes with elder family or employer.',
    area: 'Career',
    severity: 25
  },
  '19': {
    meaning: 'Freedom Lover & High Place',
    positive: 'Highly educated, independent worker, always reaches top leadership positions.',
    negative: 'Can face absolute loneliness at the top.',
    area: 'Career',
    severity: 98
  },
  '91': {
    meaning: 'Pioneering Dynamic Leader',
    positive: 'Commanding stature, bold startup creator, freedom-loving, highly active.',
    negative: 'Rude behavior or sudden temper flares.',
    area: 'Career',
    severity: 98
  },

  // 2-series
  '22': {
    meaning: 'Intuitive & Emotional Instability',
    positive: 'High imagination, artistic flow, deep empathy.',
    negative: 'Severe mood swings, anxiety, vulnerability to water retention.',
    area: 'Relationships',
    severity: 55
  },
  '23': {
    meaning: 'Victory Over Enemies & Career Highs',
    positive: 'Wins over competitors, reaches stable administrative placement.',
    negative: 'Vulnerability to extra-marital connections, child progress worries.',
    area: 'Relationships',
    severity: 75
  },
  '32': {
    meaning: 'Competitive Triumph with Domestic Hurdles',
    positive: 'Highly expressive, defeat of litigation rivals, high status.',
    negative: 'May face child support problems or family disputes.',
    area: 'Relationships',
    severity: 75
  },
  '24': {
    meaning: 'Severe Depression & Overthinking',
    positive: 'Active mind, constant processing.',
    negative: 'Criminal or risky mindset, mental sadness, insomnia, 24-hr high brain load.',
    area: 'Health',
    severity: 20
  },
  '42': {
    meaning: 'Moody Mind & Restlessness',
    positive: 'Sharp detection of deception.',
    negative: 'High vulnerability to anxiety, psychological loops, family distress.',
    area: 'Health',
    severity: 20
  },
  '25': {
    meaning: 'Blessed with Magic & Occult Power',
    positive: 'Interested in occult science, healing in hands, frequent air travelling.',
    negative: 'Slightly isolated from normal social activities.',
    area: 'Spiritual',
    severity: 92
  },
  '52': {
    meaning: 'Metaphysical Mastery & Journeying',
    positive: 'Highly mystical, blessed healer, gains from travel or trade.',
    negative: 'Difficulty in grounding mind.',
    area: 'Spiritual',
    severity: 92
  },
  '26': {
    meaning: 'Education Obstruction & Double Marriage',
    positive: 'High charm and customer persuasive capacity.',
    negative: 'Obstructions in education, disputes with mother-in-law, sperm count or semen strains, 2nd marriage.',
    area: 'Relationships',
    severity: 30
  },
  '62': {
    meaning: 'Romantic Friction & Marital Blocks',
    positive: 'Creative and artistic styling.',
    negative: 'Childbirth issues, 2nd marriage tendencies, family/mother-in-law clashes.',
    area: 'Relationships',
    severity: 30
  },
  '27': {
    meaning: 'Wasted Money & Joint Pains',
    positive: 'Strong intuitive signals.',
    negative: 'Gets money but it proves of no use, joint pains, professional stagnation, urine issues.',
    area: 'Wealth',
    severity: 40
  },
  '72': {
    meaning: 'Financial Distress & Health Loads',
    positive: 'Excellent inner intelligence.',
    negative: 'Unusable capital, professional doubts, bladder infections, joint aches.',
    area: 'Health',
    severity: 40
  },
  '28': {
    meaning: 'Depression & Medicine Overspend',
    positive: 'Money flows primarily when doing good Karma/charity projects.',
    negative: 'Mental disorders, suicide tendencies, hospital overspends, family leakages.',
    area: 'Health',
    severity: 15
  },
  '82': {
    meaning: 'Karma Bound Capital & Mental Weight',
    positive: 'Ethical trading, deep inner endurance.',
    negative: 'Partnerships failure, constant medicine expenditures, home leakages / dampness.',
    area: 'Wealth',
    severity: 15
  },
  '29': {
    meaning: 'Excellent Financial Status',
    positive: 'Self-earned money, superb payroll management, insurance and banking growth.',
    negative: 'Overly involved in financial transactions daily.',
    area: 'Wealth',
    severity: 96
  },
  '92': {
    meaning: 'Self-Earned Prosperity & Wealth Flow',
    positive: 'Very strong liquid cash reserves, banking connection, strong savings.',
    negative: 'Can face possessive material anxieties.',
    area: 'Wealth',
    severity: 96
  },

  // 3-series
  '33': {
    meaning: 'Highly Knowledgeable and Respected',
    positive: 'Society will give high respect, might get awards, wise guide.',
    negative: 'Can easily create intellectual superiority complex.',
    area: 'Spiritual',
    severity: 95
  },
  '34': {
    meaning: 'Breathing Issues & Shivering Legs',
    positive: 'Highly stubborn, doesn\'t accept defeat.',
    negative: 'Child leaves parents, heart/leg shivering, paralysis risk, very low self-confidence.',
    area: 'Health',
    severity: 20
  },
  '43': {
    meaning: 'Paralysis Threat & Stubborn Blocks',
    positive: 'Intense research capabilities.',
    negative: 'Cardiovascular worries, stubbornness, child separation nodes, paralysis.',
    area: 'Health',
    severity: 20
  },
  '35': {
    meaning: 'Intelligent Scholar & Home Distancer',
    positive: 'Highly intelligent, analytical wisdom, stellar administrative focus.',
    negative: 'Forces staying away from the first house/native place.',
    area: 'Career',
    severity: 85
  },
  '53': {
    meaning: 'Agile Academic Intelligence',
    positive: 'Brilliant teacher/consultant, rapid calculations, stays away from ancestral home.',
    negative: 'Restless mind.',
    area: 'Career',
    severity: 85
  },
  '36': {
    meaning: 'Multi-Talented & Highly Religious',
    positive: 'Attitude and self-respect are key, good knowledge, obeys rules.',
    negative: 'Can become overly moralistic or preachy.',
    area: 'Spiritual',
    severity: 90
  },
  '63': {
    meaning: 'Creative Scholar & High Moralist',
    positive: 'Follows strict regulations, multi-talented, artistically polished.',
    negative: 'Clash between beauty/luxury and pure spiritual principles.',
    area: 'Spiritual',
    severity: 90
  },
  '37': {
    meaning: 'Top Position in Field & Financial Support',
    positive: 'Brings high executive rank, strong work intentions, good for occult/education.',
    negative: 'Uncompromising demands on subordinates.',
    area: 'Career',
    severity: 96
  },
  '73': {
    meaning: 'Supreme Occult & Professional Rank',
    positive: 'Excellent financial security, highest rank in chosen field, deep esoteric skill.',
    negative: 'Fosters isolation from peers.',
    area: 'Career',
    severity: 96
  },
  '38': {
    meaning: 'Property, Sales & Real Estate Success',
    positive: 'Beneficial in property sales, counselor advice, active mediator.',
    negative: 'Pushes delays in legal documentation.',
    area: 'Wealth',
    severity: 88
  },
  '83': {
    meaning: 'Real Estate Mediator Gains',
    positive: 'Gains from land, iron or chemical commerce, highly practical counselor.',
    negative: 'Slight delays in instant wealth accumulation.',
    area: 'Wealth',
    severity: 88
  },
  '39': {
    meaning: 'Active and Intelligent Social Worker',
    positive: 'Strong intellect, hard worker, excel in NGOs/social service.',
    negative: 'Minimal focus on personal profits.',
    area: 'Spiritual',
    severity: 85
  },
  '93': {
    meaning: 'Dynamic Pragmatic Educator',
    positive: 'Empowers public campaigns, active educational setups, courageous helper.',
    negative: 'Neglects primary capital acquisition.',
    area: 'Spiritual',
    severity: 85
  },

  // 4-series
  '44': {
    meaning: 'Hardworking & Sudden Disruptions',
    positive: 'Raw industrial capacity, practical engineer mentality.',
    negative: 'Illusion states, sudden failures, extreme physical exhaustion.',
    area: 'Career',
    severity: 45
  },
  '45': {
    meaning: 'Wise Scholar with Family Sickness',
    positive: 'Intelligent, wise, sharp strategist.',
    negative: 'Sister or daughter health issues, needs to visit hospitals/courts frequently.',
    area: 'Health',
    severity: 30
  },
  '54': {
    meaning: 'Court and Hospital Frequent Visits',
    positive: 'Stellar forensic analytic mind.',
    negative: 'Frequent visits to legal courts/clinical clinics, female relative sickness.',
    area: 'Health',
    severity: 30
  },
  '46': {
    meaning: 'Skin Diseases & Venereal Affliction',
    positive: 'Unorthodox aesthetic sense.',
    negative: 'Vulnerability to skin diseases, patches in skin, piles, bladder strain.',
    area: 'Health',
    severity: 25
  },
  '64': {
    meaning: 'Afflicted Luxury & Piles Distress',
    positive: 'Unique artistic approach.',
    negative: 'Renders wealth volatile, files/skin rashes, genital or piles issues.',
    area: 'Health',
    severity: 25
  },
  '47': {
    meaning: 'Honest and Clever "Jugadoo"',
    positive: 'Clever personality, strong determination, willpower, brilliant service provider.',
    negative: 'Bypasses conventional routes, risks over-reaching.',
    area: 'Career',
    severity: 92
  },
  '74': {
    meaning: 'Willpower & Pragmatic Craft',
    positive: 'Superb determination, honest strategist, clever crisis solver.',
    negative: 'Difficulty in following standardized paths.',
    area: 'Career',
    severity: 92
  },
  '48': {
    meaning: 'Incurable Problems & Depress Node',
    positive: 'Highly resilient, deep worker.',
    negative: 'Chronic/incurable diseases, sexual dysfunction, blood disease, legal stress.',
    area: 'Health',
    severity: 15
  },
  '84': {
    meaning: 'Legal Obstacles & Deep Stress',
    positive: 'Incredible patience under severe strain.',
    negative: 'Constant hurdles, blood disease, depression, lawsuits active.',
    area: 'Health',
    severity: 15
  },
  '49': {
    meaning: 'Uniform Work & Bold Nature',
    positive: 'Excellent in army, police, or risk jobs; bold, bold ("Dabang") active nature.',
    negative: 'High physical risks, aggressive speech.',
    area: 'Career',
    severity: 85
  },
  '94': {
    meaning: 'Uniform Officer & Risky Success',
    positive: 'Thrives in firefighting or protection roles, success after intense hard labor.',
    negative: 'Prone to bodily injury or structural disputes.',
    area: 'Career',
    severity: 85
  },

  // 5-series
  '55': {
    meaning: 'Excellent Communication & Liquid Wealth',
    positive: 'Brings high money stream, stable retail connections, PR success.',
    negative: 'Fosters rapid nervous fatigue.',
    area: 'Wealth',
    severity: 95
  },
  '56': {
    meaning: 'Stuck Capital & Shy Communicator',
    positive: 'Good education, strong intelligence.',
    negative: 'Cannot ask for their own money as they are very shy, stuck currency, love failure.',
    area: 'Wealth',
    severity: 30
  },
  '65': {
    meaning: 'Love Failure & Blocked Money',
    positive: 'Artistic details, high sensitivity.',
    negative: 'Cannot recover debts from friends, failures in romantic matters.',
    area: 'Wealth',
    severity: 30
  },
  '57': {
    meaning: 'Good Public Speaker & Businessman',
    positive: 'Great writer/astrologer, superb public relations, fortunate startup leader.',
    negative: 'Restless travel demands.',
    area: 'Career',
    severity: 94
  },
  '75': {
    meaning: 'Astrological Writer & Speaker',
    positive: 'Brilliant business intellect, good PR focus, skills in occult/writing.',
    negative: 'Impulsive trading risks.',
    area: 'Career',
    severity: 94
  },
  '58': {
    meaning: 'Complete Financial Obstruction',
    positive: 'Calculated, deep planning mind.',
    negative: 'Sudden financial wreckage, property issues, blocked bank cash.',
    area: 'Wealth',
    severity: 20
  },
  '85': {
    meaning: 'Calculation Lock & Blocked Wealth',
    positive: 'Calculates down to lakhs and crores.',
    negative: 'Vulnerability to scams, wealth frozen in physical land, sudden stagnation.',
    area: 'Wealth',
    severity: 20
  },
  '59': {
    meaning: 'Sharp Minded & Technical Pioneer',
    positive: 'Immense technical knowledge, highly successful businessman, straight forward.',
    negative: 'Can be judged as extremely rude due to absolute straightforwardness.',
    area: 'Career',
    severity: 95
  },
  '95': {
    meaning: 'Straightforward Successful Partner',
    positive: 'Great technical execution, fast startup growth, robust business model.',
    negative: 'Fewer relationships but keeps real ones.',
    area: 'Career',
    severity: 95
  },

  // 6-series
  '66': {
    meaning: 'Supreme Luxury & Family Management',
    positive: 'Highly efficient family care, luxury brand attraction, deep romance options.',
    negative: 'Can trigger self-indulgence or heavy spending guides.',
    area: 'Wealth',
    severity: 96
  },
  '67': {
    meaning: 'Passionate Arts & Troubled Marriage',
    positive: 'Music/luxury lovers, high possibility of love marriage.',
    negative: 'Can trigger severe marriage or household misunderstandings later.',
    area: 'Relationships',
    severity: 65
  },
  '76': {
    meaning: 'Love Connection with Domestic Load',
    positive: 'Highly appealing personality, great aesthetic skill, love interest.',
    negative: 'Vulnerability to marital stress, separation elements.',
    area: 'Relationships',
    severity: 65
  },
  '68': {
    meaning: 'Clinical Expert & Hospital Suitability',
    positive: 'Perfect for surgeons, doctors, health researchers.',
    negative: 'Vulnerability to chest or breast diseases, eye disorders.',
    area: 'Health',
    severity: 70
  },
  '86': {
    meaning: 'Surgical Focus & Health Risks',
    positive: 'Excellent medical service providers, diagnostics acumen.',
    negative: 'Vulnerable to cardiovascular strain, chest or optical weaknesses.',
    area: 'Health',
    severity: 70
  },
  '69': {
    meaning: 'Creative Planner & Event Manager',
    positive: 'Stellar management skills, creative designer, great wedding planner.',
    negative: 'Overspends on luxury decorations.',
    area: 'Career',
    severity: 95
  },
  '96': {
    meaning: 'Master Event Organiser & Designer',
    positive: 'Superb planning qualities, creative and artistic commercial execution.',
    negative: 'Impulsive visual aesthetics expenditures.',
    area: 'Career',
    severity: 95
  },

  // 7-series
  '77': {
    meaning: 'Spiritual Research & Separation',
    positive: 'Over thinker, researcher mind, high intuition.',
    negative: 'Can bring deep disappointment, isolation, and depression.',
    area: 'Spiritual',
    severity: 60
  },
  '78': {
    meaning: 'Spiritual Healer & Social Worker',
    positive: 'Heals others, high occult skills, solves problems by own inner power.',
    negative: 'Can suffer from quiet personal loneliness.',
    area: 'Spiritual',
    severity: 85
  },
  '87': {
    meaning: 'Occult Healer & Solitary Rescuer',
    positive: 'Able to resolve huge personal/professional crises alone, helpful healer.',
    negative: 'Prone to sad or negative thought cycles.',
    area: 'Spiritual',
    severity: 85
  },
  '79': {
    meaning: 'Up-Down Career & Joint Aches',
    positive: 'Highly flexible, fast adjustments.',
    negative: 'Volatile career progress, blood disorders, kidney or joint issues, dome-life disruption.',
    area: 'Career',
    severity: 35
  },
  '97': {
    meaning: 'Domestic Disarray & Joint Spasms',
    positive: 'Highly independent, spiritual traveller.',
    negative: 'Unstable job progression, kidney concerns, domestic life disputes.',
    area: 'Career',
    severity: 35
  },

  // 8-series
  '88': {
    meaning: 'Hurdles and Judgmental States',
    positive: 'High focus, persistent builder, legacy planner.',
    negative: 'Constant mechanical delays, judgmental loops, struggle.',
    area: 'Career',
    severity: 40
  },
  '89': {
    meaning: 'Aggressive Principle Executor',
    positive: 'Works with principles, good for stock brokers, advisors, advocates.',
    negative: 'Highly aggressive, arguments with brothers or close peers.',
    area: 'Career',
    severity: 78
  },
  '98': {
    meaning: 'Aggressive Logical Consultant',
    positive: 'Sharp argumentative logic, highly effective lawyer or financial consultant.',
    negative: 'Arguments with siblings, rude outburst tendencies.',
    area: 'Career',
    severity: 78
  },

  // 9-series
  '99': {
    meaning: 'Energetic, Bold and Active',
    positive: 'Limitless energy, courageous pioneer, dynamic organizer.',
    negative: 'Risks of accidents, blood conditions, or hyper-arguments.',
    area: 'Spiritual',
    severity: 80
  }
};
