import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export const MANDATORY_WELLNESS_DISCLAIMER =
  'यह केवल Traditional Numerology Wellness Interpretation है। यह medical diagnosis, medical treatment या professional healthcare का विकल्प नहीं है। किसी भी शारीरिक या चिकित्सीय समस्या के लिए हमेशा योग्य डॉक्टर (Medical Doctor) से परामर्श लें।';

export const MANDATORY_MEDICAL_WELLNESS_DISCLAIMER = MANDATORY_WELLNESS_DISCLAIMER;

export interface TraditionalWellnessProfile {
  digit: number;
  planetaryRuler: string;
  ayurvedicDosha: 'Pitta (Fire)' | 'Kapha (Water/Earth)' | 'Vata (Air/Ether)' | 'Pitta-Vata' | 'Kapha-Pitta';
  organResonance: string;
  traditionalProneSensitivities: string;
  traditionalBalancingFoods: string[];
  traditionalFastingPractices: string;
  lifestylePractices: string[];
  mindfulnessGuideline: string;
}

export const WELLNESS_DEFINITIONS: Record<number, TraditionalWellnessProfile> = {
  1: {
    digit: 1,
    planetaryRuler: 'सूर्य (Sun / Surya)',
    ayurvedicDosha: 'Pitta (Fire)',
    organResonance: 'हृदय, रक्त परिसंचरण (Blood Circulation), सौर चक्र (Solar Plexus) एवं नेत्र ज्योति',
    traditionalProneSensitivities: 'अधिक तनाव में शरीर में आंतरिक गर्मी, ब्लड प्रेशर में उतार-चढ़ाव और आंखों में थकान की संभावना।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: भीगे हुए बादाम', 'पारंपरिक उपाय: ताजा अनार का रस', 'पारंपरिक उपाय: शीतल नारियल पानी', 'पारंपरिक उपाय: जौ का पानी (Barley Water)'],
    traditionalFastingPractices: 'पारंपरिक उपाय: रविवार को सात्विक अल्पाहार, सायंकाल में अत्यधिक नमक का त्याग सूर्य ऊर्जा को संतुलित करता है।',
    lifestylePractices: ['प्रातःकाल उगते सूर्य के सम्मुख टहलें', 'नियमित 5-7 चक्र सूर्य नमस्कार (Surya Namaskar)', 'दोपहर की तेज धूप में पर्याप्त पानी पिएं'],
    mindfulnessGuideline: 'तनावपूर्ण परिस्थितियों में शीतली प्राणायाम (Sheetali Pranayama) करें और आंतरिक शांति बनाए रखें।'
  },
  2: {
    digit: 2,
    planetaryRuler: 'चंद्रमा (Moon / Chandra)',
    ayurvedicDosha: 'Kapha (Water/Earth)',
    organResonance: 'शरीर का जल संतुलन (Fluid Balance), पेट, पाचन तंत्र एवं भावनात्मक तंत्रिका तंत्र',
    traditionalProneSensitivities: 'मौसम बदलने पर कफ-जुकाम, जल संचय (Water Retention) और नींद में असंतुलन से मानसिक चिंता।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: सौंठ (Dry Ginger) युक्त गुनगुना पानी', 'पारंपरिक उपाय: हरी सब्जियों का हल्का सूप', 'पारंपरिक उपाय: रात को भीगी हुई किशमिश'],
    traditionalFastingPractices: 'पारंपरिक उपाय: सोमवार को दूध, फल अथवा हल्के सात्विक आहार का सेवन मन को शांत और एकाग्र रखता है।',
    lifestylePractices: ['शुद्ध चांदी के पात्र में रखा जल पिएं', 'सोने और जागने का नियमित समय निर्धारित करें', 'पूर्णिमा के समय देर रात तक जागने से बचें'],
    mindfulnessGuideline: 'चंद्र भेदन प्राणायाम द्वारा भावनात्मक उतार-चढ़ाव को शांत करें और मानसिक स्थिरता लाएं।'
  },
  3: {
    digit: 3,
    planetaryRuler: 'बृहस्पति / गुरु (Jupiter / Guru)',
    ayurvedicDosha: 'Kapha-Pitta',
    organResonance: 'लिवर (यकृत) मेटाबॉलिज्म, धमनियां, जंघाएं एवं रक्त शर्करा (Blood Sugar)',
    traditionalProneSensitivities: 'भारी या गरिष्ठ भोजन से सुस्त पाचन, वजन बढ़ना और कोलेस्ट्रॉल या शुगर असंतुलन की प्रवृत्ति।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: ताजी हल्दी की हर्बल चाय', 'पारंपरिक उपाय: उबली हुई पीली मूंग दाल', 'पारंपरिक उपाय: मेथी दाना का गुनगुना पानी', 'पारंपरिक उपाय: आंवला रस'],
    traditionalFastingPractices: 'पारंपरिक उपाय: गुरुवार को पीले सात्विक खाद्य पदार्थों (चना दाल, बेसन, पपीता) का सेवन उत्तम माना गया है।',
    lifestylePractices: ['प्रतिदिन 30 मिनट तेज गति से पैदल चलें', 'अधिक मीठे और भारी डेयरी उत्पादों से परहेज रखें', 'रात का भोजन शाम 8 बजे से पहले करें'],
    mindfulnessGuideline: 'प्रतिदिन 10 मिनट ॐ (OM) या गायत्री मंत्र का शांत जप करें जिससे बौद्धिक तनाव दूर होता है।'
  },
  4: {
    digit: 4,
    planetaryRuler: 'राहु (Rahu)',
    ayurvedicDosha: 'Vata (Air/Ether)',
    organResonance: 'केंद्रीय तंत्रिका तंत्र (Nervous System), श्वास गति, घुटने एवं त्वचा स्वास्थ्य',
    traditionalProneSensitivities: 'अचानक घबराहट, अकारण भविष्य की चिंता, अनिद्रा (Insomnia) और मांसपेशियों में जकड़न।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: रात को जायफल युक्त गुनगुना दूध', 'पारंपरिक उपाय: तिल के तेल में पकी जड़ वाली सब्जियां', 'पारंपरिक उपाय: अश्वगंधा का हल्का काढ़ा'],
    traditionalFastingPractices: 'पारंपरिक उपाय: शनिवार को सात्विक निराहार या हल्का खिचड़ी आहार मानसिक भटकाव को शांत करता है।',
    lifestylePractices: ['सोने से कम से कम 1 घंटा पहले मोबाइल/स्क्रीन बंद करें', 'रात को पैरों के तलवों पर तिल के तेल की मालिश करें', 'हरी घास पर नंगे पैर 15 मिनट टहलें'],
    mindfulnessGuideline: 'गहरा अनुलोम-विलोम और नाड़ी शोधन प्राणायाम करें जिससे चंचल तंत्रिका तंत्र स्थिर होता है।'
  },
  5: {
    digit: 5,
    planetaryRuler: 'बुध (Mercury / Budha)',
    ayurvedicDosha: 'Vata (Air/Ether)',
    organResonance: 'वाणी तंत्र (Vocal Cords), श्वासनलियां, हाथ-कलाई एवं न्यूरोलॉजिकल सिग्नल',
    traditionalProneSensitivities: 'अत्यधिक मल्टीटास्किंग से मानसिक थकान, बेचैनी, तेज बोलने से गले में खिंचाव और संवेदनशील आंतें।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: ताजा हरी सब्जियों का जूस', 'पारंपरिक उपाय: उबली हुई हरी पत्तेदार सब्जियां', 'पारंपरिक उपाय: भीगी हुई हरी मूंग', 'पारंपरिक उपाय: पुदीना और सौंफ का काढ़ा'],
    traditionalFastingPractices: 'पारंपरिक उपाय: बुधवार को हल्के फलों या मूंग की दाल के सूप का सेवन आंतों को आराम देता है।',
    lifestylePractices: ['भोजन को बिना फोन देखे शांत वातावरण में चबाकर खाएं', 'प्रतिदिन हल्के कंठ व श्वास व्यायाम करें', 'सप्ताह में प्रकृति व हरियाली के बीच समय बिताएं'],
    mindfulnessGuideline: 'दिन में कम से कम 10 मिनट मौन (Mauna) रहकर विचारों की गति को धीमा करें।'
  },
  6: {
    digit: 6,
    planetaryRuler: 'शुक्र (Venus / Shukra)',
    ayurvedicDosha: 'Kapha (Water/Earth)',
    organResonance: 'किडनी (गुर्दे), गला, हार्मोनल संतुलन एवं त्वचा की प्राकृतिक चमक',
    traditionalProneSensitivities: 'अत्यधिक मिठाइयों व तले भोजन से वजन बढ़ना, डिहाइड्रेशन और गले में खराश की संभावना।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: दिन भर पर्याप्त शुद्ध जल का सेवन', 'पारंपरिक उपाय: गुलाब की पंखुड़ियों की हर्बल चाय', 'पारंपरिक उपाय: खीरा, ककड़ी और तरबूज', 'पारंपरिक उपाय: छोटी इलायची के दाने'],
    traditionalFastingPractices: 'पारंपरिक उपाय: शुक्रवार को सफेद सात्विक खाद्य पदार्थ (मखाना, दूध, साबूदाना) ग्रहण करना शुभकारी है।',
    lifestylePractices: ['दैनिक 2.5 से 3 लीटर पानी का नियमित सेवन', 'वक्ताओं व गायकों के लिए नियमित कंठ रियाज', 'प्राकृतिक एवं सौम्य स्किनकेयर का उपयोग'],
    mindfulnessGuideline: 'हल्के शास्त्रीय संगीत या शांत राग (जैसे राग यमन या भैरवी) सुनकर हृदय की धड़कनों को शांत रखें।'
  },
  7: {
    digit: 7,
    planetaryRuler: 'केतु (Ketu)',
    ayurvedicDosha: 'Pitta-Vata',
    organResonance: 'पीनियल ग्रंथि, अंतर्मन व स्वप्न अवस्था, रीढ़ की हड्डी एवं सूक्ष्म तंत्रिकाएं',
    traditionalProneSensitivities: 'अचानक एलर्जी, अत्यधिक संवेदनशीलता, भीड़भाड़ से मानसिक थकान और पेट की गैस।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: तुलसी और काली मिर्च की चाय', 'पारंपरिक उपाय: गर्म मिश्रित सब्जियों का सूप', 'पारंपरिक उपाय: मस्तिष्क बल हेतु भीगे अखरोट'],
    traditionalFastingPractices: 'पारंपरिक उपाय: मंगलवार को हल्का सुपाच्य भोजन, अत्यधिक मिर्च-मसालों व उत्तेजक पदार्थों का परहेज।',
    lifestylePractices: ['शांत और स्वच्छ कक्ष में प्रतिदिन एकांत ध्यान करें', 'रीढ़ की हड्डी हेतु भुजंगासाना व मार्जरी आसन करें', 'प्रकृति और प्रदूषण-मुक्त वातावरण में समय बिताएं'],
    mindfulnessGuideline: 'त्राटक (Trataka - दीपक की लौ पर दृष्टि केंद्रित करना) द्वारा मन की चंचलता को शांत करें।'
  },
  8: {
    digit: 8,
    planetaryRuler: 'शनि (Saturn / Shani)',
    ayurvedicDosha: 'Vata (Air/Ether)',
    organResonance: 'अस्थि तंत्र (Bones & Joints), घुटने, दांत, पिंडलियां एवं बड़ी आंत',
    traditionalProneSensitivities: 'जोड़ों में अकड़न, त्वचा का रूखापन, कब्ज (Constipation) और ठंड के प्रति अधिक संवेदनशीलता।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: काला नमक व अजवाइन युक्त गुनगुना पानी', 'पारंपरिक उपाय: सर्दियों में तिल और गुड़ का सेवन', 'पारंपरिक उपाय: फाइबर युक्त पकी सब्जियां व मुनक्का'],
    traditionalFastingPractices: 'पारंपरिक उपाय: शनिवार को उड़द दाल की खिचड़ी अथवा सात्विक फलाहार शनि संतुलन में सहायक है।',
    lifestylePractices: ['घुटनों व जोड़ों पर नियमित गर्म तिल के तेल की मालिश करें', 'लंबे समय तक अत्यधिक ठंडे AC में बैठने से बचें', 'सुबह नियमित रूप से मध्यम गति से टहलें'],
    mindfulnessGuideline: 'मूलाधार चक्र (Root Chakra) पर ध्यान केंद्रित करके मन में स्थिरता और सुरक्षा का अनुभव करें।'
  },
  9: {
    digit: 9,
    planetaryRuler: 'मंगल (Mars / Mangal)',
    ayurvedicDosha: 'Pitta (Fire)',
    organResonance: 'मांसपेशियां, हीमोग्लोबिन व रक्त परिसंचरण, सिर व मस्तिष्क, पित्त अग्नि',
    traditionalProneSensitivities: 'शरीर में अतिरिक्त गर्मी, एसिडिटी, अत्यधिक क्रोध से सिरदर्द और मांसपेशियों में खिंचाव।',
    traditionalBalancingFoods: ['पारंपरिक उपाय: मीठे पके फल (पपीता, मीठा सेब)', 'पारंपरिक उपाय: धनिया के बीजों का शीतल जल', 'पारंपरिक उपाय: ताजा नारियल पानी', 'पारंपरिक उपाय: भीगे हुए सब्जा बीज'],
    traditionalFastingPractices: 'पारंपरिक उपाय: मंगलवार को मीठे सात्विक भोजन (गुड़, हलवा) का सेवन और खट्टे-तीखे मसालों का त्याग।',
    lifestylePractices: ['अतिरिक्त ऊर्जा को संतुलित करने के लिए नियमित व्यायाम या खेलकूद', 'शारीरिक श्रम के बाद शीतल जल से स्नान', 'सड़क के तले-भुने व अत्यधिक मिर्च वाले भोजन से दूरी'],
    mindfulnessGuideline: 'शवासन (Shavasana) और गहरी उदर श्वसन (Belly Breathing) से मांसपेशियों के तनाव और क्रोध को शांत करें।'
  }
};

// Register wellness in methodology registry
Object.values(WELLNESS_DEFINITIONS).forEach((well) => {
  const rule: MethodologyRule = {
    id: `WELLNESS_ARCHETYPE_${well.digit}`,
    category: 'WELLNESS',
    ruleName: `Traditional Wellness & Lifestyle Balance for Digit ${well.digit} (${well.planetaryRuler})`,
    system: 'LEOFAMILY',
    source: SOURCES.LEOFAMILY_MEDICAL_NUMEROLOGY_PDF,
    description: `Digit ${well.digit} lifestyle reflection. Resonates with ${well.ayurvedicDosha} dosha.`,
    interpretation: `${MANDATORY_WELLNESS_DISCLAIMER} Organ resonance: ${well.organResonance}.`,
    confidence: 85,
    safetyLevel: 'MANDATORY_DISCLAIMER',
    details: well
  };
  methodologyRegistry.registerRule(rule);
});
