import { computeLoshuMasterReport } from './loshuMasterEngine';

export interface ProbabilityMetric {
  name: string;
  percentage: number;
  explanation: string;
  strengths: string[];
  risks: string[];
  growthAdvice: string;
}

export interface SmartRecommendations {
  bestMobileEndings: string[];
  bestMobileAvoidDigits: number[];
  bestBusinessNameChaldeanTotal: number[];
  bestVehicleRootNumbers: number[];
  bestHouseVastuNumbers: number[];
  bestDates: string[];
  bestDays: string[];
  bestColours: string[];
  bestDirections: string[];
  bestIndustries: string[];
  bestCareers: string[];
  bestCities: string[];
  bestBusinessSectors: string[];
}

export interface TimelinePhase {
  years: string;
  opportunities: string;
  challenges: string;
  lessons: string;
  focusAreas: string[];
  lifeThemes: string;
  futureDirection: string;
}

export interface GrowthIndexItem {
  category: string;
  score: number;
  previousScore: number;
  advice: string;
}

export interface LeoConsultationReport {
  summary: string;
  whatIsHelping: string[];
  whatIsBlocking: string[];
  biggestStrengths: string[];
  biggestWeaknesses: string[];
  immediateOpportunities: string[];
  longTermOpportunities: string[];
  mainKarmicLessons: string[];
  actionPriorities: string[];
  
  actionPlan: {
    plan7Days: string[];
    plan30Days: string[];
    plan90Days: string[];
    plan1Year: string[];
  };

  probabilities: Record<string, ProbabilityMetric>;
  recommendations: SmartRecommendations;
  timeline: Record<string, TimelinePhase>;
  growthIndex: {
    items: GrowthIndexItem[];
    overallScore: number;
    overallPreviousScore: number;
  };
}

export function generateLeoConsultation(dob: string, name: string, gender: string, mobileNum?: string): LeoConsultationReport {
  const master = computeLoshuMasterReport(dob, name, gender, mobileNum);
  const driver = master.personal.driver;
  const conductor = master.personal.conductor;
  const present = master.gridAnalysis.present;
  const missing = master.gridAnalysis.missing;

  // 1. Consultation Summary (Rajeev Ji style)
  let summary = `आपके संपूर्ण अंकशास्त्रीय चार्ट के विश्लेषण में आपका मूलांक ${driver} और भाग्यांक ${conductor} एक अत्यंत सशक्त और व्यवस्थित योग बनाते हैं। `;
  if (driver === 1 || conductor === 1) {
    summary += "अंक 1 (सूर्य) की ऊर्जा आपको स्वाभाविक नेतृत्व क्षमता, दृढ़ इच्छाशक्ति और समाज में एक विशिष्ट मान-सम्मान व पहचान दिलाती है। ";
  }
  if (driver === 5 || conductor === 5) {
    summary += "चार्ट के केंद्र में स्थित अंक 5 (बुध) सक्रिय होने के कारण आपमें उत्कृष्ट व्यापारिक समझ, त्वरित निर्णय क्षमता और बेहतरीन संवाद कौशल है जो पूरे ग्रिड को स्थिरता देता है। ";
  } else {
    summary += "चूंकि ग्रिड का केंद्रीय अंक 5 (बुध) खाली है, इसलिए जीवन में समय-समय पर स्थिरता और वित्तीय प्रबंधन में थोड़ी चुनौती आ सकती है। इसके लिए नाम की स्पेलिंग का सही समायोजन और नियमित बुध वास्तु उपाय बेहद लाभकारी रहेंगे। ";
  }
  summary += "यह रिपोर्ट पाश्चात्य चालडियन पद्धति, वैदिक गोचर और प्रामाणिक अंकशास्त्र के नियमों का समन्वय करके आपके भविष्य की स्पष्ट रूपरेखा प्रस्तुत करती है। सही उपायों और सकारात्मक कर्म से आप अपने जीवन को नई ऊंचाइयों पर ले जा सकते हैं।";

  const whatIsHelping = [
    `आपका मूलांक #${driver} (इच्छाशक्ति का आधार) दैनिक कार्यों और निर्णयों में आपका मजबूत संबल बनता है।`,
    present.includes(1) ? "सूर्य (अंक 1) की उपस्थिति आपको अधिकार, आत्मविश्वास और स्पष्ट संवाद शक्ति प्रदान करती है।" : "स्वाभाविक विनम्रता आपको हर परिस्थिति में ढलने में मदद करती है।",
    present.includes(6) ? "शुक्र (अंक 6) की ऊर्जा परिवार का सहयोग, सुख-सुविधाएं और आकर्षण आकर्षित करती है।" : "सरल स्वभाव आपको कर्म के प्रति समर्पित और केंद्रित रखता है।"
  ];

  const whatIsBlocking = [
    missing.includes(5) ? "केंद्रीय अंक 5 का न होना कभी-कभी अनपेक्षित खर्च और व्यापारिक फैसलों में जल्दबाजी करा सकता है।" : "संवाद और बातचीत में कभी-कभार होने वाली अप्रत्याशित देरी।",
    missing.includes(8) ? "शनि (अंक 8) की अनुपस्थिति से बचत में कमी या प्रॉपर्टी से जुड़े मामलों में देरी हो सकती है।" : "दूसरों से बहुत ज्यादा अपेक्षाएं रखने से भावनात्मक तनाव होना।",
    missing.includes(2) ? "चंद्रमा (अंक 2) का अभाव कभी-कभार मानसिक बेचैनी और रात में ज्यादा सोचने की आदत देता है।" : "तनाव में कभी-कभी अचानक तेज बोलने की प्रवृत्ति।"
  ];

  const biggestStrengths = [
    `भाग्यांक #${conductor} के मार्ग से मिलने वाली निरंतर ऊर्जा और जुझारूपन।`,
    present.includes(3) ? "बृहस्पति (अंक 3) से प्राप्त उच्च ज्ञान, गहरी समझ और सकारात्मक सोच।" : "बारीकियों को पकड़ने और तार्किक रूप से सोचने की तीव्र बुद्धि।",
    present.includes(9) ? "मंगल (अंक 9) का साहस, सामाजिक प्रतिष्ठा और दूसरों की मदद करने का जज्बा।" : "शांत और सौम्य स्वभाव जो विवादों को आसानी से टाल देता है।"
  ];

  const biggestWeaknesses = [
    missing.includes(2) ? "अत्यधिक संवेदनशीलता और कभी-कभी आत्मविश्वास की कमी महसूस होना।" : "एक साथ बहुत सारे कामों का बोझ अपने सिर ले लेना।",
    missing.includes(6) ? "जरूरत के समय सहकर्मियों या करीबी मित्रों से पूरा सहयोग न मिल पाना।" : "परफेक्शन के चक्कर में काम में गैर-जरूरी देरी करना।",
    "छोटे-मोटे आर्थिक फैसलों में जरूरत से ज्यादा सोच-विचार करना जिससे अच्छे मौके हाथ से निकल जाते हैं।"
  ];

  const immediateOpportunities = [
    "नाम की स्पेलिंग को बुध (अंक 5) या शुक्र (अंक 6) की शुभ वाइब्रेशन पर संतुलित करना।",
    "अपने ऑफिस या स्टडी टेबल को अपने सबसे अनुकूल वास्तु दिशा की ओर मुख करके व्यवस्थित करना।",
    "घर और कार्यस्थल से जंग लगा लोहा, बंद घड़ियां और पुराने खराब इलेक्ट्रॉनिक उपकरण तुरंत हटाना।"
  ];

  const longTermOpportunities = [
    `भाग्यांक #${conductor} के गुणों के आधार पर दीर्घकालिक करियर और पारिवारिक संपत्ति का निर्माण करना।`,
    "सलाहकार, परामर्श, स्वतंत्र व्यापार या ऑनलाइन प्लेटफॉर्म्स के जरिए व्यापक नेटवर्क का विस्तार करना।",
    "भूमि, कृषि या पर्यावरण अनुकूल संपत्तियों में सुनियोजित निवेश कर ग्रिड की पृथ्वी तत्व ऊर्जा को मजबूत करना।"
  ];

  const mainKarmicLessons = [
    `धैर्य और संयम अपनाना: मूलांक ${driver} के प्रभाव में कभी भी गुस्से या जल्दबाजी में निर्णय न लें।`,
    missing.includes(5) ? "वित्तीय अनुशासन: कमाई का एक हिस्सा तुरंत सुरक्षित निवेश या स्वर्ण में लगाएं ताकि बेवजह खर्च न हो।" : "अध्यात्म और दैनिक सांसारिक जिम्मेदारियों के बीच सुंदर संतुलन बनाए रखना।",
    "शनिवार और सोमवार की शाम को किसी भी प्रकार की तीखी बहस या विवाद से पूरी तरह बचना।"
  ];

  const actionPriorities = [
    "मूलांक और भाग्यांक से तालमेल बैठाने के लिए नाम की स्पेलिंग का सही समायोजन करें।",
    "घर के आग्नेय कोण (South-East) में ताजे हरे पौधे या मनी प्लांट लगाएं।",
    "मोबाइल नंबर के अंतिम 4 अंकों में 84, 48, 18, 81 जैसे तनावपूर्ण जोड़ से बचें।"
  ];

  // 2. Dynamic Action Plans (7-day, 30-day, 90-day, 1-year)
  const plan7Days = [
    "सोमवार: शाम को अपने मन के विचारों का अवलोकन करें और चिंता पैदा करने वाली बातों को डायरी में लिखें।",
    "बुधवार सुबह: सूर्योदय के समय अपने मुख्य ग्रह के मंत्र का 27 बार शांत चित्त से जप करें।",
    "गुरुवार: अपने घर या ऑफिस की टेबल को अपनी शुभ दिशा की ओर मुख करके व्यवस्थित करें।",
    "शनिवार: शनि शांति हेतु जरूरतमंदों या श्रमिकों को भोजन या काले तिल का दान करें।",
    "घर से टूटा शीशा, बंद घड़ियां और पुरानी अनुपयोगी दवाइयां तुरंत बाहर निकालें।"
  ];

  const plan30Days = [
    "सप्ताह 1-2: नाम की स्पेलिंग को चालडियन पद्धति के अनुसार अपने सबसे मित्र अंक पर ले आएं।",
    "सप्ताह 2-3: मोबाइल नंबर को शुभ अंक (5, 6 या 1 पर समाप्त होने वाले) पर व्यवस्थित करें।",
    "सप्ताह 3-4: दक्षिण-पश्चिम (SW) दिशा में दांपत्य सुख हेतु रोज क्वार्ट्ज क्रिस्टल रखें।",
    "दैनिक हस्ताक्षर (Signature) को ऊपर की ओर 15 डिग्री के कोण पर बिना रुके करने का अभ्यास करें।"
  ];

  const plan90Days = [
    "माह 1: दैनिक खर्चों और बजट का हिसाब रखें ताकि अनपेक्षित वित्तीय लीकेज रुक सके।",
    "माह 2: शनिवार की सुबह सेवा कार्यों या पक्षियों-पशुओं को दाना-पानी देने का नियम बनाएं।",
    "माह 3: अपनी नींद की गुणवत्ता, ग्राहकों के संपर्क और पारिवारिक शांति में आए बदलावों की समीक्षा करें।",
    "न्यूमरो वास्तु के सिद्धांतों के अनुसार घर के कमरों से क्लटर को पूरी तरह साफ करें।"
  ];

  const plan1Year = [
    "तिमाही 1: अपने अनुकूल क्षेत्रों और उद्योगों के अनुसार करियर व बिजनेस की दिशा तय करें।",
    "तिमाही 2: वाहन का नंबर अपने अनुकूल मूलांक या भाग्यांक के जोड़ पर सुनिश्चित करें।",
    "तिमाही 3: अपने अनुकूल शहरों और क्षेत्रों में व्यावसायिक व सामाजिक संपर्क बढ़ाएं।",
    "तिमाही 4: अपने संपूर्ण ग्रोथ इंडेक्स की समीक्षा करें और 100/100 संतुलन की दिशा में आगे बढ़ें।"
  ];

  // 3. Success Probabilities (Career, Business, Wealth, relationships, etc.)
  const probabilities: Record<string, ProbabilityMetric> = {
    career: {
      name: "करियर सफलता संभावना",
      percentage: master.scores.careerPotentialScore || 78,
      explanation: `मस्तिष्क रेखा की मजबूती और सक्रिय सूर्य/मंगल ऊर्जा पर आधारित। मूलांक ${driver} इसे विशेष गति देता है।`,
      strengths: ["मजबूत नेतृत्व क्षमता", "समाज में स्पष्ट प्रभाव"],
      risks: ["कमजोर गोचर में अधिकारियों से मतभेद", "जल्दबाजी में नौकरी बदलना"],
      growthAdvice: "मुख्य जिम्मेदारियों में स्थिरता बनाए रखें और अनुबंधों पर हस्ताक्षर हमेशा ऊपर की ओर करें।"
    },
    business: {
      name: "व्यापार विस्तार संभावना",
      percentage: present.includes(5) ? 85 : 55,
      explanation: "सीधे तौर पर केंद्रीय बुध (अंक 5) से जुड़ा है, जो व्यापार और वाणिज्य का स्वामी है।",
      strengths: ["त्वरित रिकवरी क्षमता", "स्पष्ट और प्रभावी बातचीत"],
      risks: ["बिना स्पेलिंग सुधार के कार्य करने पर फंसा हुआ धन", "साझेदारों से मतभेद"],
      growthAdvice: "अपनी फर्म या ब्रांड का चालडियन जोड़ 5, 6 या 1 पर सुनिश्चित करें।"
    },
    wealth: {
      name: "धन वृद्धि संभावना",
      percentage: master.wealthPsychology.wealthPotentialScore || 72,
      explanation: "जन्म कुंडली और लो शू ग्रिड के स्वर्ण व रजत योग पर आधारित।",
      strengths: ["संपत्ति जोड़ने की अच्छी क्षमता", "अतिरिक्त आय के स्रोत बनाने का हुनर"],
      risks: ["भावुकता में जरूरत से ज्यादा खर्च", "जोखिम भरे सट्टा निवेश"],
      growthAdvice: "नकद धनराशि को तुरंत सुरक्षित रियल एस्टेट या स्वर्ण में बदलें।"
    },
    relationship: {
      name: "रिश्तों में स्थिरता सूचकांक",
      percentage: master.scores.relationshipScore || 65,
      explanation: "चंद्रमा (2) और शुक्र (6) के संतुलन से निर्धारित होता है, जो पारिवारिक सुख का आधार हैं।",
      strengths: ["गहरी संवेदनशीलता और परवाह", "लंबे समय तक साथ निभाने की निष्ठा"],
      risks: ["मन की बात न कह पाना", "बहस के दौरान अहंकार का टकराव"],
      growthAdvice: "सोमवार को शांत रहें और सूर्यास्त के बाद घरेलू मामलों में तीखी बहस से बचें।"
    },
    marriage: {
      name: "वैवाहिक सुख एवं स्थायित्व",
      percentage: present.includes(2) && present.includes(6) ? 88 : 60,
      explanation: "जन्म तिथि के ग्रिड और वैवाहिक तालमेल के आधार पर गणना।",
      strengths: ["सांस्कृतिक व पारिवारिक मूल्यों का सम्मान", "एक-दूसरे के प्रति समर्पण"],
      risks: ["मनमुटाव में चुप्पी साध लेना", "दक्षिण-पश्चिम कोने में वास्तु असंतुलन"],
      growthAdvice: "घर की पूर्व दिशा में मिट्टी के पात्र में स्वच्छ जल रखें और सौहार्द बढ़ाएं।"
    },
    leadership: {
      name: "नेतृत्व क्षमता सूचकांक",
      percentage: driver === 1 || driver === 9 || present.includes(1) ? 90 : 70,
      explanation: "दबाव के समय टीम का मार्गदर्शन और सटीक निर्णय लेने की योग्यता का आकलन।",
      strengths: ["प्रभावशाली व्यक्तित्व", "संकट के समय तुरंत निर्णय लेने का साहस"],
      risks: ["जरूरत से ज्यादा सख्त दिखना", "दूसरों को काम सौंपने में झिझक"],
      growthAdvice: "बुधवार को टीम के सदस्यों की सराहना करें; कनिष्ठिका उंगली में पन्ना या हरा धागा धारण करें।"
    },
    spiritual: {
      name: "आध्यात्मिक उन्नति संभावना",
      percentage: master.scores.spiritualScore || 75,
      explanation: "केतु (7) और गुरु (3) के सूक्ष्म आध्यात्मिक प्रभाव से जुड़ा हुआ।",
      strengths: ["सटीक अंतर्ज्ञान (Intuition)", "गूढ़ विद्याओं और ग्रंथों में गहरी रुचि"],
      risks: ["कभी-कभी पूरी तरह संशय में आ जाना", "ध्यान में चंचलता"],
      growthAdvice: "प्रतिदिन उत्तर दिशा की ओर मुख करके 15 मिनट प्राणायाम व ध्यान करें।"
    },
    learning: {
      name: "बुद्धि एवं विद्या ग्रहण क्षमता",
      percentage: present.includes(3) && present.includes(5) ? 88 : 68,
      explanation: "बुद्धि के योग (4-9-2 या 3-5-7 तत्वों की उपस्थिति) पर आधारित।",
      strengths: ["उत्कृष्ट याददाश्त", "तार्किक और सटीक समस्या समाधान"],
      risks: ["जरूरत से ज्यादा सोचना (Overthinking)", "मानसिक थकान"],
      growthAdvice: "स्टडी टेबल को हमेशा साफ-सुथरा रखें और हल्के हरे रंग का मैट लगाएं।"
    },
    communication: {
      name: "संवाद एवं वाक् प्रभाव",
      percentage: master.scores.communicationScore || 75,
      explanation: "वाणी की स्पष्टता, समझाने की कला और व्यक्तिगत प्रभाव को मापता है।",
      strengths: ["प्रभावशाली भाषण व अभिव्यक्ति", "लिखित व मौखिक प्रस्तुति में दक्षता"],
      risks: ["अत्यधिक स्पष्टवादिता से सामने वाले को ठेस लगना", "तनाव में ज्यादा बोल जाना"],
      growthAdvice: "महत्वपूर्ण बैठकों में कोई भी बड़ा उत्तर देने से पहले 3 सेकंड का विराम लें।"
    }
  };

  // 4. Personalized Recommendations
  const recommendations: SmartRecommendations = {
    bestMobileEndings: ["55", "66", "15", "51", "61", "16"],
    bestMobileAvoidDigits: [4, 8, 2],
    bestBusinessNameChaldeanTotal: [15, 33, 41, 46, 51],
    bestVehicleRootNumbers: [1, 5, 6, 9],
    bestHouseVastuNumbers: [1, 5, 6],
    bestDates: [`${driver} तारीख`, `${conductor} तारीख`, "5 तारीख", "14 तारीख", "23 तारीख", "6 तारीख", "15 तारीख", "24 तारीख"],
    bestDays: ["बुधवार", "शुक्रवार", "गुरुवार"],
    bestColours: ["एमराल्ड हरा (Emerald Green)", "हल्का नीला (Pastel Blue)", "वार्म क्रीम (Warm Cream)", "शैंपेन गोल्ड (Champagne Gold)"],
    bestDirections: master.vaastuFusion.bestDirections || ["North (उत्तर)", "East (पूर्व)"],
    bestIndustries: ["सूचना प्रौद्योगिकी (IT)", "डिजिटल मीडिया", "रत्न एवं आभूषण", "रियल एस्टेट प्रबंधन", "कॉर्पोरेट कंसल्टिंग"],
    bestCareers: ["रणनीतिक सलाहकार (Strategic Advisor)", "प्रॉपर्टी डेवलपर", "रिसर्चर व विश्लेषक", "वित्तीय पोर्टफोलियो मैनेजर"],
    bestCities: ["बेंगलुरु", "मुंबई", "लंदन", "दुबई", "सिंगापुर"],
    bestBusinessSectors: ["सॉफ्टवेयर व टेक प्लेटफॉर्म", "वास्तु व आर्किटेक्चर", "ऑर्गेनिक फूड्स", "शिक्षा व ट्रेनिंग पोर्टल्स"]
  };

  // 5. Timeline Phases
  const timeline: Record<string, TimelinePhase> = {
    phase1: {
      years: "आयु 0-21 वर्ष (नींव और संस्कार काल)",
      opportunities: "गहन बौद्धिक विकास, पारंपरिक संस्कारों की समझ और उत्तम चरित्र निर्माण।",
      challenges: "वातावरण में बार-बार बदलाव या पढ़ाई के दबाव में थकान।",
      lessons: "आत्मनिर्भर बनना और नियमित अध्ययन की आदत डालना।",
      focusAreas: ["शिक्षा", "शारीरिक स्फूर्ति", "पारिवारिक संबंध"],
      lifeThemes: "माता-पिता के मार्गदर्शन में स्वयं की पहचान और जीवन मूल्यों को स्थापित करना।",
      futureDirection: "निर्भरता से निकलकर आत्मनिर्भरता और स्वतंत्र सोच की ओर अग्रसर होना।"
    },
    phase2: {
      years: "आयु 22-42 वर्ष (करियर शिखर एवं कर्म विस्तार काल)",
      opportunities: "करियर में बड़ी उपलब्धियां, सामाजिक मान-सम्मान और पारिवारिक व आर्थिक समृद्धि।",
      challenges: "केंद्रीय बुध के खाली होने पर अचानक खर्चों या नकदी के उतार-चढ़ाव का सामना।",
      lessons: "वित्तीय समझदारी विकसित करना और गलत साझेदारियों को स्पष्ट 'ना' कहना सीखना।",
      focusAreas: ["करियर वृद्धि", "वैवाहिक स्थिरता", "व्यक्तिगत ब्रांडिंग"],
      lifeThemes: "दृढ़ इच्छाशक्ति से पेशेवर अधिकार स्थापित करना और सामाजिक प्रतिष्ठा मजबूत करना।",
      futureDirection: "दैनिक सामान्य कार्यों से निकलकर रणनीतिक नेतृत्व की भूमिका में आना।"
    },
    phase3: {
      years: "आयु 43-63 वर्ष (स्थिरता एवं संपत्ति निर्माण काल)",
      opportunities: "अचल संपत्ति का निर्माण, राष्ट्रीय/अंतरराष्ट्रीय स्तर पर कंसल्टेंसी और पारिवारिक विरासत सुदृढ़ करना।",
      challenges: "पित्त या पाचन संबंधी संवेदनशीलता और जोड़ों में भारीपन।",
      lessons: "दैनिक संचालन युवा व योग्य टीम को सौंपना और स्वयं मार्गदर्शन देना।",
      focusAreas: ["धन संचय व निवेश", "गहन ज्ञान व अध्यात्म", "परोपकार व समाज सेवा"],
      lifeThemes: "संपत्तियों को संगठित करना, नई पीढ़ी को मेंटर करना और पारिवारिक प्रतिष्ठा को शिखर पर ले जाना।",
      futureDirection: "शांतिपूर्ण दिनचर्या अपनाते हुए मुख्य निर्णयों में मार्गदर्शक की भूमिका निभाना।"
    },
    phase4: {
      years: "आयु 64+ वर्ष (आध्यात्मिक शांति एवं प्रज्ञा काल)",
      opportunities: "गहरी आध्यात्मिक चेतना, प्राचीन विद्याओं पर लेखन या परामर्श और परम शांति।",
      challenges: "शारीरिक ऊर्जा और जोड़ों के लचीलेपन का ध्यान रखना।",
      lessons: "सांसारिक परिणामों से अनासक्त होकर निष्काम भाव से मार्गदर्शन देना।",
      focusAreas: ["सत्संग व साधना", "ट्रस्ट व सामाजिक कार्य", "आत्मिक शांति"],
      lifeThemes: "वरिष्ठ मार्गदर्शक की प्रतिष्ठा पाना और जीवन के अनुभवों से समाज को लाभान्वित करना।",
      futureDirection: "आत्मिक संतोष और ईश्वरीय चेतना में लीन होना।"
    }
  };

  // 6. Personal Growth Index
  const growthIndexItems: GrowthIndexItem[] = [
    { category: "करियर संरेखण (Career Alignment)", score: master.scores.careerPotentialScore || 75, previousScore: Math.max((master.scores.careerPotentialScore || 75) - 8, 45), advice: "अनुबंधों पर हस्ताक्षर ऊपर की ओर करें; अपनी सफलता दिशा की ओर मुख करके बैठें।" },
    { category: "वित्तीय प्रबंधन (Money Mindset)", score: master.wealthPsychology.wealthPotentialScore || 70, previousScore: Math.max((master.wealthPsychology.wealthPotentialScore || 70) - 12, 40), advice: "कमाई को सुरक्षित संपत्तियों में लगाएं; अनावश्यक ऑनलाइन भुगतान ऐप्स को नियंत्रित करें।" },
    { category: "रिश्ते और परिवार (Relationships)", score: master.scores.relationshipScore || 65, previousScore: Math.max((master.scores.relationshipScore || 65) - 6, 45), advice: "दक्षिण-पश्चिम में रोज क्वार्ट्ज का जोड़ा रखें; शाम के समय विवादों से बचें।" },
    { category: "शारीरिक स्वास्थ्य (Physical Health)", score: master.healthAnalysis.healthScore || 72, previousScore: Math.max((master.healthAnalysis.healthScore || 72) - 10, 50), advice: "पित्त शामक सात्विक आहार लें; सूर्योदय के बाद गुनगुना पानी पिएं।" },
    { category: "अध्यात्म और शांति (Spirituality)", score: master.scores.spiritualScore || 60, previousScore: Math.max((master.scores.spiritualScore || 60) - 15, 35), advice: "दैनिक ग्रह मंत्र का 27 बार जप करें; रविवार सुबह मौन का अभ्यास करें।" },
    { category: "आत्मविश्वास (Personal Confidence)", score: master.scores.mentalStrength || 80, previousScore: Math.max((master.scores.mentalStrength || 80) - 5, 55), advice: "महत्वपूर्ण मुलाकातों में अपने मूलांक के अनुकूल रंगों के वस्त्र पहनें।" },
    { category: "नेतृत्व एवं प्रभाव (Leadership)", score: master.scores.leadershipScore || 75, previousScore: Math.max((master.scores.leadershipScore || 75) - 10, 40), advice: "बुधवार को साथियों की प्रशंसा करें; सदैव सीधी रीढ़ के साथ बैठें।" },
    { category: "संवाद प्रभाव (Communication)", score: master.scores.communicationScore || 75, previousScore: Math.max((master.scores.communicationScore || 75) - 8, 45), advice: "ग्राहकों या वरिष्ठों के प्रश्नों का उत्तर देने से पहले 3 सेकंड रुकें।" },
    { category: "अनुशासन एवं क्रियान्वयन (Discipline)", score: master.scores.practicalStrength || 70, previousScore: Math.max((master.scores.practicalStrength || 70) - 12, 38), advice: "दैनिक बजट डायरी शुरू करें और 7 दिवसीय कार्ययोजना का निष्ठा से पालन करें।" }
  ];

  const overallScore = Math.round(growthIndexItems.reduce((acc, item) => acc + item.score, 0) / growthIndexItems.length);
  const overallPreviousScore = Math.round(growthIndexItems.reduce((acc, item) => acc + item.previousScore, 0) / growthIndexItems.length);

  return {
    summary,
    whatIsHelping,
    whatIsBlocking,
    biggestStrengths,
    biggestWeaknesses,
    immediateOpportunities,
    longTermOpportunities,
    mainKarmicLessons,
    actionPriorities,
    actionPlan: {
      plan7Days,
      plan30Days,
      plan90Days,
      plan1Year
    },
    probabilities,
    recommendations,
    timeline,
    growthIndex: {
      items: growthIndexItems,
      overallScore,
      overallPreviousScore
    }
  };
}
