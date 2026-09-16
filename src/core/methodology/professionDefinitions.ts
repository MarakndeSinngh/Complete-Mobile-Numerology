export interface ProfessionRule {
  id: string;
  profession: string;
  hindiTitle: string;
  requiredNumbers: number[];
  requiredPairs: string[];
  description: string;
  traditionalInterpretation: string;
  recommendedEndingPairs: string[];
  source: string;
}

export const PROFESSION_RULES: Record<string, ProfessionRule> = {
  doctor: {
    id: 'PROF_DOCTOR',
    profession: 'Doctor / Medical Surgeon / Physician',
    hindiTitle: 'चिकित्सक / डॉक्टर / सर्जन',
    requiredNumbers: [1, 9, 3, 7],
    requiredPairs: ['19', '91', '13', '31', '17', '71', '37', '73'],
    description: 'Requires Sun (1) for diagnostic vitality, Mars (9) for surgical courage and cutting instruments, Jupiter (3) for medicinal wisdom, and Ketu (7) for deep clinical diagnostics.',
    traditionalInterpretation: 'Numbers 1 and 9 provide courage to handle blood and operations; 3 and 7 bestow curative intuition and diagnostic precision.',
    recommendedEndingPairs: ['19', '91', '37', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  engineer: {
    id: 'PROF_ENGINEER',
    profession: 'Engineer / Technical Architect / Technologist',
    hindiTitle: 'इंजीनियर / तकनीकी विशेषज्ञ',
    requiredNumbers: [1, 9, 3, 7, 5],
    requiredPairs: ['19', '91', '75', '57', '45', '54'],
    description: 'Combines pioneering solar vision (1), martial structural execution (9), technical precision (7), and analytical mercury logic (5).',
    traditionalInterpretation: 'Pair 75/57 provides analytical algorithm mastery, while 19/91 drives execution and structural problem-solving.',
    recommendedEndingPairs: ['19', '75', '57', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  media_glamour: {
    id: 'PROF_MEDIA_GLAMOUR',
    profession: 'Media / Glamour Industry / Film / Modeling / Influencer',
    hindiTitle: 'मीडिया / ग्लैमर उद्योग / अभिनय / फ़िल्म',
    requiredNumbers: [6, 1, 7, 2],
    requiredPairs: ['67', '76', '17', '71', '26', '62', '16', '61'],
    description: 'Powered by Venusian beauty (6), solar fame (1), Ketu uniqueness (7), and lunar emotional appeal (2).',
    traditionalInterpretation: 'Digits 6 and 2 impart camera charm and aesthetic magnetism; pair 17 brings recognition, and 67 creates unique styling.',
    recommendedEndingPairs: ['67', '17', '65', '26'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  teacher: {
    id: 'PROF_TEACHER',
    profession: 'Teacher / Professor / Academic Counselor / Mentor',
    hindiTitle: 'शिक्षक / प्राध्यापक / गुरु',
    requiredNumbers: [3, 1, 7, 5],
    requiredPairs: ['31', '13', '75', '57', '35', '53'],
    description: 'Requires Jupiter (3) for pedagogical wisdom and Sun (1) for classroom command, supported by 75 for research and curriculum mastery.',
    traditionalInterpretation: 'Pair 31 gives authoritative instruction, while 75 gives analytical clarity and student mentoring patience.',
    recommendedEndingPairs: ['31', '75', '35', '53'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  accounts_banking: {
    id: 'PROF_ACCOUNTS_BANKING',
    profession: 'Accounts / Banking / Chartered Accountant / Audit',
    hindiTitle: 'लेखा / बैंकिंग / सीए / वित्त प्रबंधन',
    requiredNumbers: [8, 5, 7],
    requiredPairs: ['85', '58', '75', '57', '55'],
    description: 'Requires Saturn (8) for auditing perseverance and adherence to compliance, with Mercury (5) for rapid mental calculation and Ketu (7) for error-free reconciliation.',
    traditionalInterpretation: 'Pair 85 governs institutional financial systems, and 75 detects microscopic discrepancies and tax balancing.',
    recommendedEndingPairs: ['85', '58', '75', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  lawyer: {
    id: 'PROF_LAWYER',
    profession: 'Lawyer / Advocate / Legal Strategist',
    hindiTitle: 'वकील / अधिवक्ता / विधिक सलाहकार',
    requiredNumbers: [9, 8, 3, 1, 7],
    requiredPairs: ['98', '89', '31', '13', '17', '71'],
    description: 'Demands Mars-Saturn (98) combat stamina and legal persistence, Jupiter-Sun (31) constitutional authority, and Ketu (17) forensic investigation.',
    traditionalInterpretation: 'Pair 98 provides courtroom endurance; 31 confers legal scholarship and persuasive judicial rhetoric.',
    recommendedEndingPairs: ['31', '17', '98', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  judge: {
    id: 'PROF_JUDGE',
    profession: 'Judge / Magistrate / Arbitrator',
    hindiTitle: 'न्यायाधीश / मजिस्ट्रेट / मध्यस्थ',
    requiredNumbers: [3, 8, 1, 7],
    requiredPairs: ['38', '83', '17', '71', '31', '13'],
    description: 'Requires Jupiter-Saturn (38) for unshakeable justice and dharmic law, combined with Sun-Ketu (17) for impartial discerning judgment.',
    traditionalInterpretation: 'Pair 38 is the classic judicial anchor; 17 ensures uncorrupted forensic clarity and moral detachment.',
    recommendedEndingPairs: ['38', '31', '17', '83'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  leader_politician: {
    id: 'PROF_LEADER_POLITICIAN',
    profession: 'Political Leader / Statesperson / High Executive',
    hindiTitle: 'राजनेता / जननायक / वरिष्ठ प्रशासक',
    requiredNumbers: [1, 9, 4, 3],
    requiredPairs: ['19', '91', '31', '13', '14', '41'],
    description: 'Requires Sun (1) sovereign charisma, Mars (9) public campaign drive, Rahu (4) mass crowd psychology, and Jupiter (3) ideological depth.',
    traditionalInterpretation: 'Pair 19 commands societal authority; 31 shapes public vision and policy; 4 harnesses mass media resonance.',
    recommendedEndingPairs: ['19', '31', '51', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  army_police_fire: {
    id: 'PROF_ARMY_POLICE_FIRE',
    profession: 'Army / Police / Armed Forces / Fire & Emergency',
    hindiTitle: 'सेना / पुलिस / सुरक्षा बल / अग्निशमन',
    requiredNumbers: [1, 9, 4],
    requiredPairs: ['19', '91', '94', '49'],
    description: 'Requires Sun (1) command discipline, Mars (9) physical courage and defense readiness, with Rahu (4) tactical warfare strategy.',
    traditionalInterpretation: 'Pair 19 provides leadership in uniform; 94 delivers electric crisis reflex and courage under hostile conditions.',
    recommendedEndingPairs: ['19', '94', '91', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  occult_science: {
    id: 'PROF_OCCULT_SCIENCE',
    profession: 'Occult Sciences / Astrologer / Numerologist / Vastu Expert',
    hindiTitle: 'गूढ़ विद्या / ज्योतिषी / अंकशास्त्री / वास्तुविद्',
    requiredNumbers: [3, 7, 1, 5, 2],
    requiredPairs: ['37', '73', '75', '57', '25', '52', '17', '71'],
    description: 'Requires Jupiter (3) for scriptural decoding, Ketu (7) for esoteric radar, Sun (1) for authoritative consultations, and Mercury-Moon (5, 2) for psychological reading.',
    traditionalInterpretation: 'Sequence 371 or pairs 37, 75, and 25 awaken intuitive sight and accurate symbolic interpretation.',
    recommendedEndingPairs: ['37', '75', '25', '17'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  hospital_court: {
    id: 'PROF_HOSPITAL_COURT',
    profession: 'Working in Hospital or Court Infrastructure',
    hindiTitle: 'अस्पताल या अदालत से संबद्ध कार्य',
    requiredNumbers: [5, 4, 1, 3, 7, 9],
    requiredPairs: ['54', '45', '13', '31', '17', '71'],
    description: 'Environments of stress and dispute require protective combinations like 54 (dispute management), 13 (administrative rules), and 17 (investigative order).',
    traditionalInterpretation: '54, 13, 17, and single 9 harmonize presence in institutional environments dealing with health emergencies or legal settlements.',
    recommendedEndingPairs: ['17', '31', '51', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  consultant: {
    id: 'PROF_CONSULTANT',
    profession: 'Strategic Consultant / Business Advisor / Counselor',
    hindiTitle: 'सलाहकार / कंसल्टेंट / रणनीतिक मार्गदर्शक',
    requiredNumbers: [3, 7, 8, 5],
    requiredPairs: ['37', '73', '38', '83', '35', '53'],
    description: 'Jupiter (3) advisory foundation merged with Ketu (7) forensic root-cause analysis and Saturn (8) structural feasibility.',
    traditionalInterpretation: 'Pairs 37 and 38 allow advisors to see organizational vulnerabilities and deliver durable solutions.',
    recommendedEndingPairs: ['37', '38', '35', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  iron_chemical_construction: {
    id: 'PROF_IRON_CHEMICAL_CONSTRUCTION',
    profession: 'Iron / Chemical / Construction / Mining / Heavy Industry',
    hindiTitle: 'लोहा / रसायन / निर्माण / खनन / भारी उद्योग',
    requiredNumbers: [8],
    requiredPairs: ['85', '58', '89', '98', '84', '48'],
    description: 'Requires Saturn (8) representing iron, earth minerals, and heavy machinery, but should ideally appear once or twice, not in quadruple repetition.',
    traditionalInterpretation: 'Single 8 grants grounded mastery over heavy physical resources, real estate, and construction materials.',
    recommendedEndingPairs: ['85', '58', '15', '56'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  healer: {
    id: 'PROF_HEALER',
    profession: 'Healer / Reiki Master / Physiotherapist / Pranic Healer',
    hindiTitle: 'उपचारक / रेकी / फिजियोथेरेपिस्ट / प्राकृतिक चिकित्सक',
    requiredNumbers: [1, 7, 8, 9, 2],
    requiredPairs: ['17', '71', '78', '87', '92', '29'],
    description: 'Ketu (7) and Sun (1) channel spiritual healing currents; Saturn (8) handles physical rehabilitation and joints; Mars (9) provides vital energy.',
    traditionalInterpretation: 'Pairs 17 and 78 with single 9 support energetic attunement and bodily restoration without taking on client distress.',
    recommendedEndingPairs: ['17', '78', '37', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  plastic_manufacturing: {
    id: 'PROF_PLASTIC_MANUFACTURING',
    profession: 'Plastic Business / Polymer Manufacturing / Packaging',
    hindiTitle: 'प्लास्टिक व्यापार / पॉलीमर विनिर्माण / पैकेजिंग',
    requiredNumbers: [7, 3, 5, 1, 9],
    requiredPairs: ['73', '37', '51', '15', '95'],
    description: 'Ketu-Jupiter (73) synthetic material mastery combined with Mercury-Sun (51) wholesale distribution and Mars (9) factory machinery.',
    traditionalInterpretation: 'Pairs 73 and 51 support polymer chemistry and commercial manufacturing operations.',
    recommendedEndingPairs: ['73', '51', '15', '56'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  hr_pr: {
    id: 'PROF_HR_PR',
    profession: 'Human Resources (HR) / Public Relations (PR)',
    hindiTitle: 'मानव संसाधन (HR) / जनसंपर्क (PR)',
    requiredNumbers: [5, 7, 2, 6],
    requiredPairs: ['57', '75', '25', '52', '56', '65'],
    description: 'Mercury-Ketu (57) psychological assessment paired with Moon-Mercury (25) communication rapport.',
    traditionalInterpretation: 'Pair 57 enables deep interviewing discernment, reading between the lines of resumes and employee issues.',
    recommendedEndingPairs: ['57', '75', '56', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  tailoring_garments: {
    id: 'PROF_TAILORING_GARMENTS',
    profession: 'Tailoring / Cloth Related / Garments / Photography',
    hindiTitle: 'सिलाई / वस्त्र व्यापार / परिधान / फोटोग्राफी',
    requiredNumbers: [2, 6],
    requiredPairs: ['26', '62', '25', '52'],
    description: 'Must include digit 2 (Moon) for fabric tactile sensitivity and creative eye, supported by Venus (6) for styling and cuts.',
    traditionalInterpretation: 'Presence of digit 2 is non-negotiable for cloth drapery, textile feel, and photographic light sensitivity.',
    recommendedEndingPairs: ['26', '62', '56', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  artist: {
    id: 'PROF_ARTIST',
    profession: 'Artist of Any Kind / Painter / Sculptor / Musician',
    hindiTitle: 'कलाकार / चित्रकार / मूर्तिकार / संगीतकार',
    requiredNumbers: [2, 6, 7, 9],
    requiredPairs: ['67', '76', '69', '96', '26', '62'],
    description: 'Requires Moon (2) for raw emotional depth, Venus (6) for aesthetic harmony, Ketu (7) for originality, and Mars (9) for passionate creative fire.',
    traditionalInterpretation: 'Digits 2 with pairs 67 and 69 produce visionary, provocative, and deeply moving creative works.',
    recommendedEndingPairs: ['67', '69', '26', '56'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  }
};
