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
    description: 'सटीक डायग्नोसिस और जीवन शक्ति के लिए Sun (1), शल्य चिकित्सा (Surgery) के साहस व औजारों के लिए Mars (9), औषधीय ज्ञान के लिए Jupiter (3) और गहरी क्लिनिकल जांच के लिए Ketu (7) की ऊर्जा आवश्यक है।',
    traditionalInterpretation: 'अंक 1 और 9 रक्त व ऑपरेशन को संभालने का निर्भीक साहस देते हैं; वहीं 3 और 7 रोग निदान (Diagnosis) की अचूक अंतर्दृष्टि प्रदान करते हैं।',
    recommendedEndingPairs: ['19', '91', '37', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  engineer: {
    id: 'PROF_ENGINEER',
    profession: 'Engineer / Technical Architect / Technologist',
    hindiTitle: 'इंजीनियर / तकनीकी विशेषज्ञ',
    requiredNumbers: [1, 9, 3, 7, 5],
    requiredPairs: ['19', '91', '75', '57', '45', '54'],
    description: 'दूरदर्शी सोच (1), तकनीकी निर्माण व निष्पादन (9), सूक्ष्म तकनीकी सटीकता (7) और तार्किक विश्लेषण (5) का शक्तिशाली समन्वय।',
    traditionalInterpretation: 'पेयर 75/57 विश्लेषणात्मक व तकनीकी लॉजिक में दक्षता देता है, जबकि 19/91 व्यावहारिक निर्माण और प्रॉब्लम सॉल्विंग को मजबूत करता है।',
    recommendedEndingPairs: ['19', '75', '57', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  media_glamour: {
    id: 'PROF_MEDIA_GLAMOUR',
    profession: 'Media / Glamour Industry / Film / Modeling / Influencer',
    hindiTitle: 'मीडिया / ग्लैमर उद्योग / अभिनय / फ़िल्म',
    requiredNumbers: [6, 1, 7, 2],
    requiredPairs: ['67', '76', '17', '71', '26', '62', '16', '61'],
    description: 'Venus (6) का आकर्षण व सौंदर्य, Sun (1) की प्रसिद्धि व मान-सम्मान, Ketu (7) का अनूठा स्टाइल और Moon (2) की भावनात्मक अपील का संगम।',
    traditionalInterpretation: 'अंक 6 और 2 कैमरा चार्म व स्क्रीन प्रेजेंस देते हैं; पेयर 17 व्यापक पहचान लाता है और 67 एक अलग व आकर्षक स्टाइलिंग प्रदान करता है।',
    recommendedEndingPairs: ['67', '17', '65', '26'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  teacher: {
    id: 'PROF_TEACHER',
    profession: 'Teacher / Professor / Academic Counselor / Mentor',
    hindiTitle: 'शिक्षक / प्राध्यापक / गुरु',
    requiredNumbers: [3, 1, 7, 5],
    requiredPairs: ['31', '13', '75', '57', '35', '53'],
    description: 'मार्गदर्शन और शिक्षण ज्ञान के लिए Jupiter (3), क्लासरूम नियंत्रण व अधिकार के लिए Sun (1), और शोध व अध्ययन के लिए 75 का तालमेल।',
    traditionalInterpretation: 'पेयर 31 प्रभावशाली व आदरणीय शिक्षण शैली देता है, जबकि 75 विद्यार्थियों को गहराई से समझाने का धैर्य और स्पष्टता प्रदान करता है।',
    recommendedEndingPairs: ['31', '75', '35', '53'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  accounts_banking: {
    id: 'PROF_ACCOUNTS_BANKING',
    profession: 'Accounts / Banking / Chartered Accountant / Audit',
    hindiTitle: 'लेखा / बैंकिंग / सीए / वित्त प्रबंधन',
    requiredNumbers: [8, 5, 7],
    requiredPairs: ['85', '58', '75', '57', '55'],
    description: 'ऑडिटिंग व नियमों के पालन के लिए Saturn (8), तेज मानसिक गणना व वाणिज्यिक बुद्धि के लिए Mercury (5) और त्रुटिहीन मिलान के लिए Ketu (7)।',
    traditionalInterpretation: 'पेयर 85 संस्थागत वित्तीय प्रणालियों को संभालता है, और 75 सूक्ष्म विसंगतियों को पकड़ने व टैक्स संतुलन में मदद करता है।',
    recommendedEndingPairs: ['85', '58', '75', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  lawyer: {
    id: 'PROF_LAWYER',
    profession: 'Lawyer / Advocate / Legal Strategist',
    hindiTitle: 'वकील / अधिवक्ता / विधिक सलाहकार',
    requiredNumbers: [9, 8, 3, 1, 7],
    requiredPairs: ['98', '89', '31', '13', '17', '71'],
    description: 'Mars-Saturn (98) की अदालती जिरह और सहनशक्ति, Jupiter-Sun (31) का संवैधानिक अधिकार, और Ketu (17) की फॉरेंसिक केस जांच क्षमता।',
    traditionalInterpretation: 'पेयर 98 कोर्टरूम में अंत तक डटे रहने की ऊर्जा देता है; 31 कानूनी ज्ञान और प्रभावशाली तर्कशक्ति प्रदान करता है।',
    recommendedEndingPairs: ['31', '17', '98', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  judge: {
    id: 'PROF_JUDGE',
    profession: 'Judge / Magistrate / Arbitrator',
    hindiTitle: 'न्यायाधीश / मजिस्ट्रेट / मध्यस्थ',
    requiredNumbers: [3, 8, 1, 7],
    requiredPairs: ['38', '83', '17', '71', '31', '13'],
    description: 'अटल न्याय और धार्मिक सिद्धांतों के लिए Jupiter-Saturn (38), और निष्पक्ष, पारदर्शी निर्णय के लिए Sun-Ketu (17) का शास्त्रीय योग।',
    traditionalInterpretation: 'पेयर 38 न्यायिक गरिमा का मुख्य आधार है; 17 बिना किसी दबाव के सत्य और निष्पक्ष फैसले की नैतिक शक्ति देता है।',
    recommendedEndingPairs: ['38', '31', '17', '83'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  leader_politician: {
    id: 'PROF_LEADER_POLITICIAN',
    profession: 'Political Leader / Statesperson / High Executive',
    hindiTitle: 'राजनेता / जननायक / वरिष्ठ प्रशासक',
    requiredNumbers: [1, 9, 4, 3],
    requiredPairs: ['19', '91', '31', '13', '14', '41'],
    description: 'Sun (1) का नेतृत्व करिश्मा, Mars (9) का जन-अभियान साहस, Rahu (4) की जनमानस समझ, और Jupiter (3) की वैचारिक गहराई।',
    traditionalInterpretation: 'पेयर 19 समाज पर मजबूत प्रभाव स्थापित करता है; 31 लोक कल्याणकारी नीतियां बनाता है; 4 विशाल जनसमूह को आकर्षित करता है।',
    recommendedEndingPairs: ['19', '31', '51', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  army_police_fire: {
    id: 'PROF_ARMY_POLICE_FIRE',
    profession: 'Army / Police / Armed Forces / Fire & Emergency',
    hindiTitle: 'सेना / पुलिस / सुरक्षा बल / अग्निशमन',
    requiredNumbers: [1, 9, 4],
    requiredPairs: ['19', '91', '94', '49'],
    description: 'Sun (1) का कड़ा अनुशासन, Mars (9) का अदम्य शारीरिक साहस व सुरक्षा तत्परता, और Rahu (4) की रणनीतिक सूझबूझ।',
    traditionalInterpretation: 'पेयर 19 वर्दीधारी सेवाओं में नेतृत्व प्रदान करता है; 94 आपातकालीन परिस्थितियों में तुरंत एक्शन लेने का पराक्रम देता है।',
    recommendedEndingPairs: ['19', '94', '91', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  occult_science: {
    id: 'PROF_OCCULT_SCIENCE',
    profession: 'Occult Sciences / Astrologer / Numerologist / Vastu Expert',
    hindiTitle: 'गूढ़ विद्या / ज्योतिषी / अंकशास्त्री / वास्तुविद्',
    requiredNumbers: [3, 7, 1, 5, 2],
    requiredPairs: ['37', '73', '75', '57', '25', '52', '17', '71'],
    description: 'शास्त्र ज्ञान के लिए Jupiter (3), गूढ़ अंतर्दृष्टि के लिए Ketu (7), प्रभावी परामर्श के लिए Sun (1), और मानवीय समझ के लिए Mercury-Moon (5, 2)।',
    traditionalInterpretation: 'क्रम 371 या पेयर्स 37, 75 और 25 गहरी इंट्यूशन (अंतर्ज्ञान) और सटीक भविष्यवाणियों की क्षमता को जागृत करते हैं।',
    recommendedEndingPairs: ['37', '75', '25', '17'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  hospital_court: {
    id: 'PROF_HOSPITAL_COURT',
    profession: 'Working in Hospital or Court Infrastructure',
    hindiTitle: 'अस्पताल या अदालत से संबद्ध कार्य',
    requiredNumbers: [5, 4, 1, 3, 7, 9],
    requiredPairs: ['54', '45', '13', '31', '17', '71'],
    description: 'तनाव और विवाद भरे माहौल में सुरक्षा के लिए 54 (विवाद प्रबंधन), 13 (प्रशासनिक नियम) और 17 (जांच व्यवस्था) का संतुलन आवश्यक है।',
    traditionalInterpretation: '54, 13, 17 और अंक 9 स्वास्थ्य आपातकाल या कानूनी विवाद वाले संस्थानों में संतुलन व कार्यकुशलता बनाए रखते हैं।',
    recommendedEndingPairs: ['17', '31', '51', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  consultant: {
    id: 'PROF_CONSULTANT',
    profession: 'Strategic Consultant / Business Advisor / Counselor',
    hindiTitle: 'सलाहकार / कंसल्टेंट / रणनीतिक मार्गदर्शक',
    requiredNumbers: [3, 7, 8, 5],
    requiredPairs: ['37', '73', '38', '83', '35', '53'],
    description: 'Jupiter (3) की सलाहकारी क्षमता, Ketu (7) का मूल कारणों का विश्लेषण, और Saturn (8) की व्यावहारिक व्यवहार्यता का संयोजन।',
    traditionalInterpretation: 'पेयर 37 और 38 सलाहकारों को संगठन की कमजोरियों को तुरंत पहचानने और दीर्घकालिक समाधान प्रस्तुत करने की क्षमता देते हैं।',
    recommendedEndingPairs: ['37', '38', '35', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  iron_chemical_construction: {
    id: 'PROF_IRON_CHEMICAL_CONSTRUCTION',
    profession: 'Iron / Chemical / Construction / Mining / Heavy Industry',
    hindiTitle: 'लोहा / रसायन / निर्माण / खनन / भारी उद्योग',
    requiredNumbers: [8],
    requiredPairs: ['85', '58', '89', '98', '84', '48'],
    description: 'Saturn (8) जो लोहा, खनिज और भारी मशीनरी का प्रतिनिधित्व करता है, संतुलित मात्रा (1 या 2 बार) में होना श्रेष्ठ रहता है।',
    traditionalInterpretation: 'अंक 8 भौतिक संसाधनों, रियल एस्टेट और निर्माण सामग्री के क्षेत्र में ठोस महारत और सफलता प्रदान करता है।',
    recommendedEndingPairs: ['85', '58', '15', '56'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  healer: {
    id: 'PROF_HEALER',
    profession: 'Healer / Reiki Master / Physiotherapist / Pranic Healer',
    hindiTitle: 'उपचारक / रेकी / फिजियोथेरेपिस्ट / प्राकृतिक चिकित्सक',
    requiredNumbers: [1, 7, 8, 9, 2],
    requiredPairs: ['17', '71', '78', '87', '92', '29'],
    description: 'Ketu (7) और Sun (1) आध्यात्मिक ऊर्जा प्रवाहित करते हैं; Saturn (8) जोड़ों और शारीरिक पुनर्वास को देखता है; Mars (9) प्राण ऊर्जा देता है।',
    traditionalInterpretation: 'पेयर 17 और 78 के साथ अंक 9 दूसरों के कष्ट से प्रभावित हुए बिना उन्हें प्राकृतिक रूप से स्वस्थ करने की ऊर्जा देते हैं।',
    recommendedEndingPairs: ['17', '78', '37', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  plastic_manufacturing: {
    id: 'PROF_PLASTIC_MANUFACTURING',
    profession: 'Plastic Business / Polymer Manufacturing / Packaging',
    hindiTitle: 'प्लास्टिक व्यापार / पॉलीमर विनिर्माण / पैकेजिंग',
    requiredNumbers: [7, 3, 5, 1, 9],
    requiredPairs: ['73', '37', '51', '15', '95'],
    description: 'Ketu-Jupiter (73) कृत्रिम पदार्थों का ज्ञान, Mercury-Sun (51) थोक वितरण और Mars (9) फैक्ट्री मशीनरी के संचालन में सफलता देता है।',
    traditionalInterpretation: 'पेयर 73 और 51 पॉलीमर, पैकेजिंग और वाणिज्यिक निर्माण उद्योग के प्रबंधन को सुगम बनाते हैं।',
    recommendedEndingPairs: ['73', '51', '15', '56'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  hr_pr: {
    id: 'PROF_HR_PR',
    profession: 'Human Resources (HR) / Public Relations (PR)',
    hindiTitle: 'मानव संसाधन (HR) / जनसंपर्क (PR)',
    requiredNumbers: [5, 7, 2, 6],
    requiredPairs: ['57', '75', '25', '52', '56', '65'],
    description: 'Mercury-Ketu (57) का मनोवैज्ञानिक मूल्यांकन और Moon-Mercury (25) की जनसंवाद व सामंजस्य स्थापित करने की कला।',
    traditionalInterpretation: 'पेयर 57 लोगों के स्वभाव को गहराई से समझने, सही प्रतिभा की पहचान करने और कर्मचारियों की समस्याओं को सुलझाने में दक्ष बनाता है।',
    recommendedEndingPairs: ['57', '75', '56', '51'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  tailoring_garments: {
    id: 'PROF_TAILORING_GARMENTS',
    profession: 'Tailoring / Cloth Related / Garments / Photography',
    hindiTitle: 'सिलाई / वस्त्र व्यापार / परिधान / फोटोग्राफी',
    requiredNumbers: [2, 6],
    requiredPairs: ['26', '62', '25', '52'],
    description: 'कपड़े के स्पर्श व रचनात्मक दृष्टि के लिए Moon (2) अनिवार्य है, साथ ही स्टाइलिंग और डिजाइन के लिए Venus (6) का सहयोग आवश्यक है।',
    traditionalInterpretation: 'वस्त्र उद्योग, ड्रेपिंग, टेक्सटाइल और फोटोग्राफिक लाइट सेंसिटिविटी के लिए अंक 2 अत्यंत महत्वपूर्ण है।',
    recommendedEndingPairs: ['26', '62', '56', '15'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  },
  artist: {
    id: 'PROF_ARTIST',
    profession: 'Artist of Any Kind / Painter / Sculptor / Musician',
    hindiTitle: 'कलाकार / चित्रकार / मूर्तिकार / संगीतकार',
    requiredNumbers: [2, 6, 7, 9],
    requiredPairs: ['67', '76', '69', '96', '26', '62'],
    description: 'Moon (2) की भावुकता, Venus (6) का कलात्मक सौंदर्य, Ketu (7) की मौलिकता, और Mars (9) का रचनात्मक जुनून।',
    traditionalInterpretation: 'अंक 2 के साथ पेयर 67 और 69 दिल को छू लेने वाली, कल्पनाशील और अद्वितीय कलाकृतियों का सृजन कराते हैं।',
    recommendedEndingPairs: ['67', '69', '26', '56'],
    source: 'Course Reference PDF 2 (Pages 42-43)'
  }
};
