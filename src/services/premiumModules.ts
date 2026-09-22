import { reduceToSingleDigit, analyzeNameSystems } from './numerologyEngine';

export interface VehicleReport {
  plateNumber: string;
  totalSum: number;
  reducedTotal: number;
  rulerPlanet: string;
  suitability: 'EXCELLENT' | 'NEUTRAL' | 'AVOID';
  businessUsageScore: number;
  travelLuckScore: number;
  protectionEnergyScore: number;
  accidentRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  theftRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  mechanicalBreakdownRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  meaning: string;
  vulnerability: string;
  remedy: string;
  luckyColors: string[];
  luckyServiceDays: string[];
  luckyTravelDays: string[];
  prediction: string;
  ownershipAnalysis: string;
}

export interface HouseReport {
  houseNumber: string;
  totalSum: number;
  reducedTotal: number;
  energyVibration: string;
  vibe: 'PEACE' | 'EXPANSION' | 'SPIRITUAL' | 'WORK' | 'VIBRANT';
  wealthPotential: number;
  familyHarmony: number;
  spiritualEnergy: number;
  businessSuitability: string;
  meaning: string;
  advice: string;
  remedy: string;
  predictions: string;
  luckyDirections: string[];
  luckyColors: string[];
}

export interface BusinessReport {
  businessName: string;
  chaldeanTotal: number;
  reducedTotal: number;
  brandStrengthScore: number;
  marketingEnergy: 'HIGH' | 'MEDIUM' | 'LOW';
  customerAttractionScore: number;
  financialStrength: number;
  growthPotential: number;
  leadershipStrength: number;
  suitability: 'POOR' | 'MODERATE' | 'OUTSTANDING';
  industrySuitability: string;
  meaning: string;
  expansionTip: string;
  businessRemedies: string[];
  suggestedCorrections: string;
  longTermForecast: string;
}

export interface SignatureReport {
  directionStyle: string;
  endingStroke: string;
  nameFlow: string;
  planetaryEnergy: string;
  careerImpact: string;
  financialImpact: string;
  publicRecognitionScore: number;
  corrections: string[];
  recommendations: string;
}

export interface ChildReport {
  birthDriver: number;
  birthConductor: number;
  startingAlphabets: string[];
  suggestedPlanets: string[];
  cautionaryAlphabets: string[];
  careerPrecedence: string;
  learningStyle: string;
  educationStrength: string;
  creativity: string;
  communication: string;
  parentingGuidance: string;
  remedies: string[];
  luckyActivities: string[];
}

export interface LuckyDatesSuite {
  businessDates: number[];
  marriageDates: number[];
  travelDates: number[];
  investmentDates: number[];
  propertyDates: number[];
  examDates: number[];
  interviewDates: number[];
}

// 1. VEHICLE NUMEROLOGY PRO ENGINE
export function analyzeVehicleNumerology(plateStr: string, driver: number): VehicleReport {
  const clean = plateStr.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let chaldeanSum = 0;
  
  const mapping: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/[0-9]/.test(char)) {
      chaldeanSum += parseInt(char, 10);
    } else if (mapping[char]) {
      chaldeanSum += mapping[char];
    }
  }

  const reducedTotal = reduceToSingleDigit(chaldeanSum) || 5;

  const friendlyNodes: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 3, 5, 7],
    3: [1, 2, 3, 5, 7, 9],
    4: [5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 7],
    7: [3, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 9]
  };

  const isFriendly = friendlyNodes[driver]?.includes(reducedTotal) || false;
  const isHostile = [8, 4].includes(reducedTotal) && driver !== 5 && driver !== 6;

  let suitability: VehicleReport['suitability'] = 'NEUTRAL';
  if (isFriendly) suitability = 'EXCELLENT';
  else if (isHostile) suitability = 'AVOID';

  // Ruler Planets
  const planetNames: Record<number, string> = {
    1: 'Sun (सूर्य) - राजसी प्रतिष्ठा व गति',
    2: 'Moon (चंद्र) - शांति व भावनात्मक गतिशीलता',
    3: 'Jupiter (गुरु) - ज्ञान, सुरक्षा व समृद्धि',
    4: 'Rahu (राहु) - अप्रत्याशित व तकनीकी ऊर्जा',
    5: 'Mercury (बुध) - तीव्र गति व व्यापारिक संचार',
    6: 'Venus (शुक्र) - विलासिता, ऐश्वर्य व आराम',
    7: 'Ketu (केतु) - एकांत, शोध व शांत यात्रा',
    8: 'Saturn (शनि) - ठोस, मजबूत व अनुशासित निर्माण',
    9: 'Mars (मंगल) - तेज गति, साहस व ऊर्जा'
  };

  // Scores based on planet rules
  const businessUsageScore = reducedTotal === 5 || reducedTotal === 1 ? 95 : [4, 8].includes(reducedTotal) ? 45 : 75;
  const travelLuckScore = [3, 5, 6].includes(reducedTotal) ? 92 : reducedTotal === 9 ? 85 : 70;
  const protectionEnergyScore = [1, 3].includes(reducedTotal) ? 96 : reducedTotal === 8 ? 80 : 65;

  const accidentRisk = reducedTotal === 9 ? 'HIGH' : [4, 8].includes(reducedTotal) ? 'MEDIUM' : 'LOW';
  const theftRisk = [4, 7].includes(reducedTotal) ? 'HIGH' : reducedTotal === 1 ? 'LOW' : 'MEDIUM';
  const mechanicalBreakdownRisk = reducedTotal === 4 ? 'HIGH' : reducedTotal === 8 ? 'MEDIUM' : 'LOW';

  const meaningsMap: Record<number, string> = {
    1: 'Sun का प्रभाव। यह नंबर वाहन को राजसी पहचान, प्रशासनिक प्रतिष्ठा, आकर्षण और लंबी यात्राओं में उत्कृष्ट सुरक्षा ऊर्जा प्रदान करता है।',
    2: 'Moon का प्रभाव। यात्रा में आरामदायक और शांत अनुभव देता है, पर ईंधन खपत में उतार-चढ़ाव और मूड के अनुसार यात्रा गति का योग बनता है।',
    3: 'Jupiter का प्रभाव। अत्यंत सुरक्षित, ज्ञानवर्धक व शुभ नंबर। पारिवारिक, शैक्षणिक व धार्मिक यात्राओं के लिए बेहद भरोसेमंद और मंगलकारी।',
    4: 'Rahu का प्रभाव। अचानक इलेक्ट्रॉनिक सेंसर, वायरिंग या अप्रत्याशित रुकावटों का जोखिम रह सकता है; नियमित सर्विसिंग और देखभाल आवश्यक है।',
    5: 'Mercury का प्रभाव। अत्यंत फुर्तीला, व्यापारिक यात्राओं, सेल्स व मार्केटिंग कार्यों के लिए सर्वोत्तम वाहन नंबर।',
    6: 'Venus का प्रभाव। विलासिता, उत्तम सस्पेंशन, बेहतरीन म्यूजिक सिस्टम और शानदार कॉस्मेटिक फिनिश का सुखद अनुभव।',
    7: 'Ketu का प्रभाव। शांत, सुरक्षित और स्वतंत्र यात्राओं के लिए उत्तम; एकांत प्रिय शोधकर्ताओं और लंबी शांत यात्राओं हेतु अनुकूल।',
    8: 'Saturn का प्रभाव। भारी, मजबूत और टिकाऊ बॉडी। शुरुआत में गति धीमी लग सकती है परंतु लंबे समय में यह बेहद विश्वसनीय रहता है।',
    9: 'Mars का प्रभाव। साहसी, उच्च पिकअप और दमदार इंजन; तेज गति में सावधानी रखें और सुरक्षा नियमों का कड़ाई से पालन करें।'
  };

  const vulnerabilityMap: Record<number, string> = {
    4: 'सेंसर व हेडलाइट की खराबी; अचानक इलेक्ट्रिक स्पार्क या वायरिंग की समस्या।',
    8: 'टायर पंचर, गियर ट्रांसमिशन में रुकावट या अधिक गंदगी/कीचड़ जमा होना।',
    9: 'बंपर पर खरोंच या तेज गति के कारण हीटिंग की समस्या।'
  };

  const remedyMap: Record<number, string> = {
    4: 'डैशबोर्ड या ग्लव बॉक्स में छोटा तांबे का पिरामिड या लकड़ी का टुकड़ा रखें।',
    8: 'ड्राइवर मैट के नीचे काले कपड़े में लोहे का सिक्का रखें और शनिवार को सरसों के तेल का दान करें।',
    9: 'रियर-व्यू मिरर के पास तांबे का धागा या भगवान हनुमान जी का चित्र/पेंडेंट लगाएं।'
  };

  const luckyColorsMap: Record<number, string[]> = {
    1: ['Golden Yellow', 'Pure White', 'Saffron'],
    2: ['Milky White', 'Light Silver', 'Sea Blue'],
    3: ['Mustard Yellow', 'Cream', 'Bright Gold'],
    4: ['Electric Blue', 'Slate Grey', 'Mint Green'],
    5: ['Jade Green', 'Pastel White', 'Light Ash'],
    6: ['Diamond Off-White', 'Blush Pink', 'Light Blue'],
    7: ['Chalk White', 'Smoke Grey', 'Black Accents'],
    8: ['Dark Indigo', 'Steel Grey', 'Matte Black'],
    9: ['Coral Red', 'Bright Orange', 'Saffron Red']
  };

  const daysMap: Record<number, string[]> = {
    1: ['Sunday', 'Thursday'],
    2: ['Monday', 'Friday'],
    3: ['Thursday', 'Sunday'],
    4: ['Wednesday', 'Saturday'],
    5: ['Wednesday', 'Friday'],
    6: ['Friday', 'Wednesday'],
    7: ['Thursday', 'Tuesday'],
    8: ['Saturday', 'Friday'],
    9: ['Tuesday', 'Sunday']
  };

  return {
    plateNumber: plateStr,
    totalSum: chaldeanSum,
    reducedTotal,
    rulerPlanet: planetNames[reducedTotal] || 'Active cosmic vector',
    suitability,
    businessUsageScore,
    travelLuckScore,
    protectionEnergyScore,
    accidentRisk,
    theftRisk,
    mechanicalBreakdownRisk,
    meaning: meaningsMap[reducedTotal] || 'दैनिक आवागमन के लिए सकारात्मक और सहयोगी ऊर्जा उत्पन्न करता है।',
    vulnerability: vulnerabilityMap[reducedTotal] || 'ड्राइवर चार्ट के अनुसार कोई गंभीर संरचनात्मक दोष नहीं पाया गया।',
    remedy: remedyMap[reducedTotal] || 'वाहन की विंडशील्ड को हमेशा साफ रखें और माह में एक बार नींबू के रस से सफाई करें।',
    luckyColors: luckyColorsMap[reducedTotal] || ['White', 'Silver'],
    luckyServiceDays: daysMap[reducedTotal] || ['Wednesday'],
    luckyTravelDays: daysMap[reducedTotal] || ['Monday'],
    prediction: `वाहन नंबर ${plateStr} आपके यात्रा भाग्य को दिशा देता है। मूलांक ${reducedTotal} के प्रभाव से यह विशेष रूप से उत्तर-पूर्व दिशा की यात्राओं में करियर लाभ के नए रास्ते खोलता है। यदि अनुकूलता कमजोर हो तो सुरक्षा हेतु बताए गए उपाय करें।`,
    ownershipAnalysis: `दीर्घकालिक विश्लेषण के अनुसार यह वाहन आपको लंबे समय तक उत्तम सेवा और अच्छी रीसेल वैल्यू देगा। यह पारिवारिक यात्राओं में सुखद यादें और सुरक्षा प्रदान करता है।`
  };
}

// 2. HOUSE NUMEROLOGY PRO ENGINE
export function analyzeHouseNumerology(houseStr: string): HouseReport {
  const clean = houseStr.toUpperCase().replace(/[^0-9]/g, '');
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    sum += parseInt(clean[i], 10);
  }
  const reducedTotal = reduceToSingleDigit(sum) || 5;

  let vibe: HouseReport['vibe'] = 'EXPANSION';
  let meaning = '';
  let advice = '';
  let remedy = '';
  let businessSuitability = '';
  let energyVibration = '';

  const directionsMap: Record<number, string[]> = {
    1: ['East', 'North-East'],
    2: ['North-West', 'North'],
    3: ['North-East', 'East'],
    4: ['South-West', 'North-West'],
    5: ['North', 'East'],
    6: ['South-East', 'North-West'],
    7: ['North-East', 'West'],
    8: ['West', 'South-West'],
    9: ['South', 'East']
  };

  const colorsMap: Record<number, string[]> = {
    1: ['Golden Yellow', 'Gold Saffron', 'Ruby Red'],
    2: ['Milky White', 'Silver Cream', 'Soft Blue'],
    3: ['Bright Mustard', 'Warm Amber', 'Saffron'],
    4: ['Electric Blue', 'Mint Green', 'Slate Grey'],
    5: ['Emerald Green', 'Pastel Ash', 'Teal'],
    6: ['Diamond Off-white', 'Pastel Pink', 'Champagne Gold'],
    7: ['Chalk White', 'Light Lavender', 'Dove Grey'],
    8: ['Dark Slate Blue', 'Warm Tan', 'Charcoal'],
    9: ['Crimson Red', 'Light Terracotta', 'Rust Orange']
  };

  const vibeMap: Record<number, HouseReport['vibe']> = {
    1: 'VIBRANT', 2: 'PEACE', 3: 'PEACE', 4: 'WORK', 5: 'EXPANSION', 6: 'PEACE', 7: 'SPIRITUAL', 8: 'WORK', 9: 'VIBRANT'
  };

  const energyVibs: Record<number, string> = {
    1: 'Sun ऊर्जा केंद्र। नेतृत्व क्षमता, आत्म-विश्वास, प्रशासनिक उपलब्धियों और मान-सम्मान के विकास के लिए उत्तम।',
    2: 'Moon सौहार्द केंद्र। शांतिपूर्ण प्रकाश, कलात्मक साज-सज्जा और पारिवारिक भोजन कक्ष में आपसी प्रेम व तालमेल का वास।',
    3: 'Guru ज्ञान धाम। अध्ययन कक्ष, विस्तृत पुस्तकालय और आध्यात्मिक साधना के लिए श्रेष्ठ; घर में सुरक्षात्मक आभा फैलाता है।',
    4: 'Rahu व्यवस्था केंद्र। तकनीकी कार्यक्षेत्र, सख्त अनुशासन और आधुनिक सुरक्षा उपकरणों से युक्त स्थान।',
    5: 'Mercury संचार केंद्र। जीवंत सामाजिक माहौल, तेज इंटरनेट, मेहमानों का आना-जाना और त्वरित व्यावसायिक विचार।',
    6: 'Venus समृद्धि मंदिर। सुरुचिपूर्ण इंटीरियर, आरामदायक बैठक, सुगंधित वातावरण और सुख-सुविधाओं की प्रचुरता।',
    7: 'Ketu शांत आश्रम। गहन शांति, कम शोरगुल, योग-ध्यान कक्ष और आध्यात्मिक स्वाध्याय के लिए आदर्श वातावरण।',
    8: 'Saturn ठोस दुर्ग। मजबूत निर्माण, स्थायी लकड़ी का फर्नीचर, पारिवारिक विरासत और निरंतर स्थिर प्रगति।',
    9: 'Mars पराक्रम स्थल। ऊर्जावान माहौल, फिटनेस उपकरण, भरपूर प्राकृतिक रोशनी और साहसिक लक्ष्यों की प्राप्ति।'
  };

  vibe = vibeMap[reducedTotal];
  energyVibration = energyVibs[reducedTotal];

  const wealthPotential = reducedTotal === 6 || reducedTotal === 5 ? 95 : [1, 3, 8].includes(reducedTotal) ? 85 : 70;
  const familyHarmony = [2, 3, 6].includes(reducedTotal) ? 92 : [4, 9].includes(reducedTotal) ? 68 : 80;
  const spiritualEnergy = [3, 7].includes(reducedTotal) ? 96 : reducedTotal === 2 ? 88 : 60;

  if ([1, 5, 6].includes(reducedTotal)) {
    businessSuitability = 'अत्यंत अनुशंसित। वैश्विक व्यापार, डिजाइन शोरूम, कॉर्पोरेट कोचिंग व वित्तीय परामर्श के लिए सर्वोत्तम।';
  } else if ([3, 7].includes(reducedTotal)) {
    businessSuitability = 'शोध कार्य, सॉफ्टवेयर कोडिंग, हीलिंग और दूरस्थ शिक्षा (Education) के लिए अत्यंत श्रेष्ठ।';
  } else {
    businessSuitability = 'प्रशासनिक रिकॉर्ड्स, लॉजिस्टिक्स योजना, इन्वेंट्री प्रबंधन और स्थानीय संचालन के लिए उपयुक्त।';
  }

  const meaningsMap: Record<number, string> = {
    1: 'नेतृत्व और आत्मनिर्भरता को बढ़ावा देता है। कॉर्पोरेट अधिकारियों, स्वतंत्र उद्यमियों और राजनेताओं के लिए अनुकूल।',
    2: 'गहरे पारिवारिक रिश्ते, वैवाहिक सौहार्द, रचनात्मक सोच और भावनात्मक शांति प्रदान करता है।',
    3: 'सुरक्षात्मक और ज्ञानवर्धक माहौल। कानूनी विवादों से रक्षा करता है और ईश्वरीय आशीर्वाद आकर्षित करता है।',
    4: 'अनुशासित जीवनशैली और तकनीकी विकास को प्रेरित करता है; बिजली की वायरिंग और Vastu संतुलन का ध्यान रखें।',
    5: 'सक्रिय व्यापारिक केंद्र। त्वरित वित्तीय लेनदेन, लगातार यात्राएं और व्यावसायिक अवसरों का निरंतर प्रवाह।',
    6: 'अपार धन-समृद्धि, वाहन सुख, कलात्मक सफलता और पारिवारिक मांगलिक उत्सवों का केंद्र।',
    7: 'गहन एकाग्रता और विश्लेषणात्मक क्षमता बढ़ाता है। सॉफ्टवेयर विकास, पुस्तक लेखन व गूढ़ विधाओं हेतु श्रेष्ठ।',
    8: 'दीर्घकालिक स्थायी संपत्ति का निर्माण करता है। निरंतर मेहनत और मजबूत वित्तीय सुरक्षा प्रदान करता है।',
    9: 'शारीरिक स्फूर्ति, दृढ़ संकल्प और बड़े लक्ष्यों को समय से पूर्व पूरा करने का साहस देता है।'
  };

  const adviceMap: Record<number, string> = {
    1: 'मुख्य प्रवेश द्वार पर पीतल की हल्की रोशनी लगाएं और पूर्व दिशा के गलियारों को साफ व खुला रखें।',
    2: 'उत्तर दिशा में चांदी के बर्तन में स्वच्छ जल और सफेद ताजे फूल रखें।',
    3: 'अध्ययन कक्ष में केसरिया/पीला तिलक रखें और पूर्व की ओर मुख करके महत्वपूर्ण कार्य करें।',
    4: 'घर के मुख्य बिजली वितरण बॉक्स के पास तांबे का छोटा पिरामिड स्थापित करें।',
    5: 'आय बढ़ाने के लिए उत्तर दिशा में ताजा मनी प्लांट या हरे पौधे लगाएं।',
    6: 'शाम के समय मुख्य प्रवेश द्वार पर गुलाब या चंदन की सुगंधित अगरबत्ती/धूप लगाएं।',
    7: 'अध्ययन कक्ष में एमेथिस्ट (Amethyst) क्रिस्टल रखें और घर में अनावश्यक शोरगुल से बचें।',
    8: 'शनिवार की शाम पश्चिम दिशा में सरसों के तेल का पीतल का दीपक जलाएं।',
    9: 'रसोई घर को हमेशा साफ और सूखा रखें और दक्षिण दिशा में व्यवस्था सुदृढ़ रखें।'
  };

  const remedyMap: Record<number, string> = {
    1: 'प्रतिदिन सूर्योदय के समय सूर्य देव को जल अर्पित करें और कार्य मेज पर तांबे का पात्र रखें।',
    2: 'घर के बुजुर्गों और माता का सम्मान करें; सुनिश्चित करें कि रसोई में कोई नल टपकता न हो।',
    3: 'गुरुवार को पीले फल/मिठाई का दान करें और मुख्य द्वार पर लकड़ी का ॐ प्रतीक लगाएं।',
    4: 'मुख्य द्वार पर पीतल की घंटी लगाएं जिससे नकारात्मक ऊर्जा दूर हो।',
    5: 'बुधवार की सुबह गाय को हरा चारा या हरी सब्जियां खिलाएं।',
    6: 'प्रवेश द्वार को ताजे सफेद फूलों या रोज क्वार्ट्ज क्रिस्टल से सजाएं।',
    7: 'बालकनी या उत्तर-पूर्व क्षेत्र में छोटा जल फव्वारा स्थापित करें।',
    8: 'पीपल के वृक्ष के पास तिल के तेल का दीपक जलाएं और बालकनी में कबाड़ लोहा न रखें।',
    9: 'कार्य मेज पर तांबे का सामान रखें और संध्या समय हनुमान चालीसा का पाठ करें।'
  };

  const predictions = `मूलांक ${reducedTotal} के प्रभाव से यह घर निरंतर स्थिर प्रगति का संकेत देता है। वास्तु नियमों के पालन के साथ इस घर में रहने वाले परिवार को करियर व आर्थिक क्षेत्र में महत्वपूर्ण तरक्की प्राप्त होगी। यदि मूलांक 4 या 8 हो तो प्रवेश द्वार पर बताए गए उपाय अवश्य करें।`;

  return {
    houseNumber: houseStr,
    totalSum: sum,
    reducedTotal,
    energyVibration,
    vibe,
    wealthPotential,
    familyHarmony,
    spiritualEnergy,
    businessSuitability,
    meaning: meaningsMap[reducedTotal] || 'संतुलित व सुरक्षात्मक ऊर्जा क्षेत्र स्थापित करता है।',
    advice: adviceMap[reducedTotal] || 'घर में स्वच्छ हवा और प्रकाश का प्रवाह बनाए रखें।',
    remedy: remedyMap[reducedTotal] || 'नियमित रूप से सकारात्मक मंत्रों का उच्चारण करें।',
    predictions,
    luckyDirections: directionsMap[reducedTotal] || ['East'],
    luckyColors: colorsMap[reducedTotal] || ['Cream', 'Soft Yellow']
  };
}

// 3. BUSINESS NUMEROLOGY PRO ENGINE
export function analyzeBusinessNumerology(nameStr: string, driver: number): BusinessReport {
  const nameAna = analyzeNameSystems(nameStr);
  const cSum = nameAna.chaldeanNumber;

  const friendlyNodes: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 3, 5],
    3: [1, 2, 3, 5, 7, 9],
    4: [5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 7],
    7: [3, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 9]
  };

  const friendly = friendlyNodes[driver]?.includes(cSum) || false;
  const poor = [8, 4].includes(cSum) && driver !== 5 && driver !== 6;

  let suitability: BusinessReport['suitability'] = 'MODERATE';
  if (friendly) suitability = 'OUTSTANDING';
  else if (poor) suitability = 'POOR';

  let industrySuitability = 'सामान्य कंसल्टिंग, गतिशील सेवाएं और प्रशासनिक लॉजिस्टिक्स।';
  if (cSum === 5 || cSum === 6) {
    industrySuitability = 'प्रीमियम फैशन रिटेल, कॉस्मेटिक ब्रांडिंग, डिजिटल मीडिया पोर्टल, ग्लोबल इम्पोर्ट-एक्सपोर्ट और हॉस्पिटैलिटी नेटवर्क्स के लिए अत्यंत अनुशंसित।';
  } else if (cSum === 1 || cSum === 3) {
    industrySuitability = 'कॉर्पोरेट प्रशासनिक सलाहकार, सरकारी कॉन्ट्रैक्ट्स, कानूनी मध्यस्थता, उच्च शिक्षण संस्थान और चिकित्सा उपकरण आपूर्ति के लिए श्रेष्ठ।';
  } else if (cSum === 8 || cSum === 4) {
    industrySuitability = 'भारी औद्योगिक मशीनरी निर्माण, धातु विज्ञान (Metallurgy), खनन और विशेष तकनीकी व सॉफ्टवेयर एन्क्रिप्शन सेवाओं के लिए उपयुक्त।';
  }

  const meaningMap: Record<number, string> = {
    1: 'The Solar Command (1): मजबूत ब्रांड प्रतिष्ठा, उत्कृष्ट कॉर्पोरेट विश्वसनीयता और बाजार में अग्रणी स्थान दिलाता है।',
    2: 'The Lunar Grace (2): आत्मीय व भावनात्मक जुड़ाव; डिजाइन, काउंसलिंग, मातृत्व/शिशु उत्पाद और वेलनेस के लिए उत्तम।',
    3: 'The Chancellor Citadel (3): ग्राहकों का उच्च विश्वास, कानूनी अनुपालन और वित्तीय सलाहकारों व पब्लिकेशन हाउसेस हेतु श्रेष्ठ।',
    4: 'The Unorthodox Disruptor (4): तकनीकी सॉफ्टवेयर विकास, आधुनिक डिजिटल प्रोडक्ट्स और बाजार में तेजी से नया ट्रेंड स्थापित करने की क्षमता।',
    5: 'The Merchant Sovereign (5): सर्वोच्च व्यापारिक कुल योग। इन्वेंट्री का त्वरित रोटेशन, निर्बाध धन प्रवाह और निरंतर सक्रिय संवाद।',
    6: 'The Luxury Palace (6): सौंदर्यपरक परिष्कार, प्रीमियम पैकेजिंग और समृद्ध, उच्च-भुगतान वाले ग्राहकों को आकर्षित करने की अद्भुत शक्ति।',
    7: 'The Deep Hermitage (7): रिसर्च एवं डायग्नोस्टिक्स लैब, आयुर्वेदिक व हर्बल उत्पाद, ज्योतिष/गूढ़ विज्ञान और विशेष डेटा कंसल्टेंसी।',
    8: 'The Steel Monument (8): कड़ी मेहनत और पूर्ण कानूनी अनुपालन की मांग करता है। शुरुआत में धीमा पर दीर्घकालिक विशाल साम्राज्य स्थापित करता है।',
    9: 'The Strategic Shield (9): कंस्ट्रक्शन, रियल एस्टेट, सुरक्षा तंत्र और साहसिक खेल या शारीरिक प्रशिक्षण संस्थानों के लिए उपयुक्त।'
  };

  // Generate pro metrics
  const brandStrengthScore = cSum === 1 || cSum === 5 ? 95 : [4, 8].includes(cSum) ? 55 : 78;
  const marketingEnergy = [1, 5, 6].includes(cSum) ? 'HIGH' : cSum === 3 ? 'MEDIUM' : 'LOW';
  const customerAttractionScore = cSum === 6 || cSum === 5 ? 98 : cSum === 3 ? 82 : 68;
  const financialStrength = [3, 5, 8].includes(cSum) ? 90 : 70;
  const growthPotential = cSum === 5 || cSum === 1 ? 95 : 72;
  const leadershipStrength = cSum === 1 || cSum === 9 ? 96 : 74;

  const businessRemedies = [
    `नाम वर्तनी सुधार: कंपनी के नाम की स्पेलिंग को समायोजित करके Chaldean कुल योग ${cSum === 8 ? 5 : cSum === 4 ? 6 : cSum} पर लाएं।`,
    `ब्रांडिंग रंग: Mercury 5 कुल योग हेतु गहरे हरे रंग, या Venus 6 कुल योग हेतु शैम्पेन सिल्वर/क्रीम रंगों का प्रयोग करें।`,
    `मुख्य प्रवेश: व्यावसायिक परिसर के मुख्य द्वार के ठीक सामने कचरा या कबाड़ न रखें।`
  ];

  const suggestedCorrections = cSum === 8 
    ? 'शनि जनित देरी को दूर करने के लिए नाम में एक अतिरिक्त अक्षर (जैसे वोवेल) जोड़कर Chaldean योग को 5 या 6 पर लाने की अत्यधिक सलाह दी जाती है।' 
    : 'किसी बड़े स्पेलिंग संशोधन की आवश्यकता नहीं है। आपका वर्तमान Chaldean कुल योग सकारात्मक ग्रहों के साथ सुसंगत है।';

  const longTermForecast = `आगामी दशक में, वर्तमान Chaldean कुल ${cSum} के तहत यह ब्रांड मजबूत स्थानीय बाजार प्रतिष्ठा हासिल करेगा। यदि कुल योग मित्रवत है, तो निर्यात और व्यापार विस्तार में सुगमता रहेगी। यदि कुल योग कमजोर है, तो वित्तीय रिकॉर्ड्स में पूर्ण पारदर्शिता रखें।`;

  return {
    businessName: nameStr,
    chaldeanTotal: cSum,
    reducedTotal: nameAna.expressionNumber,
    brandStrengthScore,
    marketingEnergy,
    customerAttractionScore,
    financialStrength,
    growthPotential,
    leadershipStrength,
    suitability,
    industrySuitability,
    meaning: meaningMap[nameAna.expressionNumber] || 'Chaldean गुणों के साथ संरेखित मानक व्यावसायिक ऊर्जा।',
    expansionTip: `वैश्विक ग्राहकों को आकर्षित करने के लिए ${cSum === 5 ? 'प्रीमियम ग्रीन कार्ड्स डिजाइन (Mercury)' : 'वॉर्म गोल्डन लाइट्स (Sun)'} अपनाएं।`,
    businessRemedies,
    suggestedCorrections,
    longTermForecast
  };
}

// 4. SIGNATURE NUMEROLOGY ENGINE (NEW PRO MODULE)
export function analyzeSignatureStyle(styleId: string): SignatureReport {
  let directionStyle = 'Neutral';
  let endingStroke = 'Stable';
  let nameFlow = 'Balanced';
  let planetaryEnergy = 'Mercury (फुर्तीला व संतुलित)';
  let careerImpact = 'सामान्य वृद्धि बनाए रखता है।';
  let financialImpact = 'स्थिर और सामान्य वित्तीय प्रवाह।';
  let publicRecognitionScore = 70;
  let corrections: string[] = [];
  let recommendations = '';

  if (styleId === 'RISING_UNDERLINE') {
    directionStyle = '15-डिग्री ऊपर की ओर झुकाव (Ascending)';
    endingStroke = 'मजबूत, स्पष्ट आगे बढ़ता हुआ स्ट्रोक';
    nameFlow = 'निरंतर, आपस में जुड़े हुए सुंदर अक्षर';
    planetaryEnergy = 'Sun और Jupiter - असीम महत्वाकांक्षा व प्रगति';
    careerImpact = 'कॉर्पोरेट पदोन्नति में तेजी लाता है, सामाजिक मान-सम्मान बढ़ाता है और स्वतंत्र नेतृत्व शक्ति प्रदान करता है।';
    financialImpact = 'धन सुरक्षा कवच प्रदान करता है, प्रतिकूल समय में भी वित्तीय लीकेज को रोकता है।';
    publicRecognitionScore = 96;
    corrections = [
      'सुनिश्चित करें कि नीचे की रेखा g, j, p, y जैसे लूप वाले अक्षरों को न काटे।',
      'हस्ताक्षर का पहला अक्षर बाकी अक्षरों की तुलना में स्पष्ट रूप से बड़ा रखें।'
    ];
    recommendations = 'यह सफल दिग्गजों की हस्ताक्षर शैली है! उद्यमियों, वकीलों और प्रशासनिक लीडर्स के लिए अत्यंत लाभकारी। इस ऊपर उठती संरचना को हमेशा बनाए रखें।';
  } else if (styleId === 'TRAILING_DOT_BELOW') {
    directionStyle = 'समतल क्षैतिज (Flat Horizon)';
    endingStroke = 'अंत में भारी पूर्णविराम (Dot)';
    nameFlow = 'पहला अक्षर बड़ा, बाकी अक्षर दबे हुए';
    planetaryEnergy = 'Rahu और Saturn - रुकावट चक्र';
    careerImpact = 'प्रोजेक्ट्स में अप्रत्याशित ठहराव, सहकर्मियों से राजनीति और अकारण देरी लाता है।';
    financialImpact = 'अचानक अनचाहे खर्चों का योग। धन आता अच्छा है पर अप्रत्याशित रिपेयर या स्वास्थ्य में निकल जाता है।';
    publicRecognitionScore = 48;
    corrections = [
      'नाम के अंत से तुरंत पूर्णविराम (Dot) को हटा दें।',
      'हस्ताक्षर के कोण को समतल से बदलकर 15 डिग्री ऊपर की ओर उठाएं।'
    ];
    recommendations = 'हस्ताक्षर के नीचे या अंत में डॉट ऊर्जा प्रवाह को रोक देता है। आज ही डॉट हटाएं और नीचे एक सीधी सुंदर अंडरलाइन लगाएं।';
  } else if (styleId === 'FALLING_LINE') {
    directionStyle = 'नीचे की ओर ढलान वाला (Downward Sloping)';
    endingStroke = 'धुंधला गिरता हुआ स्ट्रोक';
    nameFlow = 'अंदर की ओर मुड़े हुए अक्षर';
    planetaryEnergy = 'Ketu - संशय और एकाकीपन';
    careerImpact = 'उच्चाधिकारियों के साथ विश्वास में कमी, घटता आत्मविश्वास और कार्यस्थल पर निराशा की स्थिति।';
    financialImpact = 'सट्टा या जोखिम भरे निवेशों में नुकसान का जोखिम; रिटर्न अपेक्षा से कम रहना।';
    publicRecognitionScore = 32;
    corrections = [
      'हस्ताक्षर को सीढ़ियों की तरह ऊपर की ओर चढ़ने का अभ्यास करें।',
      'सुनिश्चित करें कि हस्ताक्षर का अंतिम अक्षर पहले अक्षर से ऊंचाई पर समाप्त हो।'
    ];
    recommendations = 'नीचे झुकता हस्ताक्षर घटती ऊर्जा का प्रतीक है। अपने करियर पर पूर्ण नियंत्रण पाने के लिए आज ही इसे ऊपर की ओर उठाएं।';
  } else {
    // DOUBLE_UNDERLINE or default
    directionStyle = 'सटीक क्षैतिज रेखा (Horizontal Line)';
    endingStroke = 'नीचे दो समानांतर मजबूत रेखाएं';
    nameFlow = 'समान दूरी पर लिखे गए स्पष्ट अक्षर';
    planetaryEnergy = 'Saturn और Venus - मजबूत आधार व स्थिरता';
    careerImpact = 'अत्यंत स्थिर। प्रशासनिक अधिकारियों, अधिवक्ताओं, बैंकिंग सलाहकारों व सरकारी कर्मियों के लिए श्रेष्ठ।';
    financialImpact = 'संपत्ति और बचत को सुरक्षित रखता है। दोहरी रेखा पैतृक व संचित संपत्ति को स्थिरता देती है।';
    publicRecognitionScore = 86;
    corrections = [
      'दोनों अंडरलाइन रेखाओं को बिल्कुल समानांतर और साफ रखें।',
      'रेखाएं किसी भी अक्षर को काटनी नहीं चाहिए।'
    ];
    recommendations = 'वित्तीय स्थिरता और पारिवारिक संतुलन के लिए अत्यंत उत्तम। सुरक्षित और गैर-जोखिम भरा करियर मार्ग प्रदान करता है।';
  }

  return {
    directionStyle,
    endingStroke,
    nameFlow,
    planetaryEnergy,
    careerImpact,
    financialImpact,
    publicRecognitionScore,
    corrections,
    recommendations
  };
}

// 5. CHILD NUMEROLOGY ENGINE
export function generateChildNumerology(dobStr: string): ChildReport {
  const parts = dobStr.split('-');
  const day = parseInt(parts[2], 10) || 1;
  const dayReduced = reduceToSingleDigit(day);

  const cleanDob = dobStr.replace(/[^0-9]/g, '');
  const dobSum = cleanDob.split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  const conductor = reduceToSingleDigit(dobSum);

  let startingAlphabets: string[] = [];
  let suggestedPlanets: string[] = [];
  let cautionaryAlphabets: string[] = [];
  let careerPrecedence = '';
  let learningStyle = '';
  let educationStrength = '';
  let creativity = '';
  let communication = '';
  let parentingGuidance = '';
  let remedies: string[] = [];
  let luckyActivities: string[] = [];

  if (dayReduced === 1) {
    startingAlphabets = ['A', 'I', 'Y', 'J', 'Q', 'E', 'H', 'N'];
    suggestedPlanets = ['Sun (1)', 'Mercury (5)', 'Jupiter (3)'];
    cautionaryAlphabets = ['B', 'K', 'R', 'F', 'P'];
    careerPrecedence = 'स्वतंत्र नेतृत्व, प्रशासनिक अधिकारी, चिकित्सा विज्ञान शोध, स्वतंत्र ब्रांड फाउंडर या उच्च सिविल सेवाएं।';
    learningStyle = 'दृश्य (Visual) और अत्यधिक स्वतंत्र शिक्षार्थी। दूसरों के अत्यधिक नियंत्रण की बजाय अपनी गति से सीखना पसंद करते हैं।';
    educationStrength = 'उत्कृष्ट तार्किक क्षमता, स्वाभाविक क्लास लीडरशिप और गणित में तीव्र एकाग्रता।';
    creativity = 'नवाचारी ग्राफिक विचार, डिजिटल गेमिंग संरचना और नेतृत्वकारी पटकथा लेखन।';
    communication = 'स्पष्ट, आत्मविश्वासी, सीधा और प्रभावशाली संवाद कौशल।';
    parentingGuidance = 'स्वतंत्र सोच को बढ़ावा दें पर साथियों के साथ सहयोग भी सिखाएं। सार्वजनिक डांट से बचें, शांत तर्क से समझाएं।';
    remedies = ['रविवार की सुबह पक्षियों को तांबे के पात्र से स्वच्छ जल दें।', 'बच्चे के अध्ययन कक्ष में सफेद/हल्की रोशनी रखें।'];
    luckyActivities = ['शतरंज (Chess)', 'वाद-विवाद प्रतियोगिता (Debate)', 'एथलेटिक्स व ट्रैक स्पोर्ट्स'];
  } else if (dayReduced === 2) {
    startingAlphabets = ['C', 'G', 'L', 'S', 'F', 'P'];
    suggestedPlanets = ['Moon (2)', 'Jupiter (3)', 'Venus (6)'];
    cautionaryAlphabets = ['M', 'T', 'D'];
    careerPrecedence = 'कलात्मक डिजाइन, बाल साहित्य लेखन, परामर्श मनोविज्ञान (Counseling) और राजनयिक शांति मिशन।';
    learningStyle = 'भावनात्मक और संवेदनशील शिक्षार्थी। सौम्य, सकारात्मक और संगीत से भरे वातावरण में सबसे अच्छा सीखते हैं।';
    educationStrength = 'रचनात्मक कविता लेखन, वनस्पति विज्ञान, भाषा विज्ञान और बाल मनोविज्ञान।';
    creativity = 'जल-रंग (Water Color) पेंटिंग, वाद्य यंत्र वादन और कलात्मक साज-सज्जा।';
    communication = 'मधुर, सहानुभूतिपूर्ण, आत्मीय और दूसरों को संबल देने वाली संवाद शैली।';
    parentingGuidance = 'अत्यधिक हिंसक दृश्यों से इनके संवेदनशील मन को बचाएं। तैराकी या पारिवारिक खेलों से आत्मविश्वास बढ़ाएं।';
    remedies = ['अध्ययन की दराज में क्रीम सिल्क में चांदी का चौकोर/गोल टुकड़ा रखें।', 'सोमवार को पक्षियों को मीठे चावल की खीर दें।'];
    luckyActivities = ['शास्त्रीय संगीत व कीबोर्ड', 'तैराकी (Swimming)', 'मिट्टी की कलाकृतियां (Clay Modeling)'];
  } else if (dayReduced === 3) {
    startingAlphabets = ['A', 'I', 'Y', 'U', 'V', 'W'];
    suggestedPlanets = ['Jupiter (3)', 'Sun (1)', 'Venus (6)'];
    cautionaryAlphabets = ['E', 'H', 'N'];
    careerPrecedence = 'उच्च शैक्षणिक संस्थान प्रमुख, न्यायाधीश, वित्तीय सलाहकार और आध्यात्मिक मार्गदर्शक।';
    learningStyle = 'गहन अध्ययनशील। पुस्तकालय, विश्वकोश और ज्ञानवर्धक ग्रंथों में विशेष रुचि।';
    educationStrength = 'इतिहास, न्यायशास्त्र (Law), जटिल ऑडिटिंग और दार्शनिक अध्ययन।';
    creativity = 'प्रभावशाली वक्तव्य कला (Oratory), पवित्र ज्यामितीय कला और संस्थागत समन्वय।';
    communication = 'अत्यंत स्पष्ट, ज्ञानपूर्ण, समृद्ध शब्दावली और सटीक परामर्श क्षमता।';
    parentingGuidance = 'इनकी बौद्धिक जिज्ञासा को विज्ञान और दर्शन की अच्छी किताबों से संतुष्ट करें। इनके परिपक्व विचारों का सम्मान करें।';
    remedies = ['गुरुवार को तुलसी के पौधे की सेवा करें।', 'गुरुवार को स्नान के जल में चुटकी भर हल्दी मिलाएं।'];
    luckyActivities = ['पुस्तक पठन प्रतियोगिताएं', 'विज्ञान मॉडल निर्माण', 'सामाजिक सेवा क्लब'];
  } else {
    // Falls to Mercury / Venus agile defaults for 4, 5, 6, 7, 8, 9
    startingAlphabets = ['A', 'I', 'E', 'H', 'N', 'X', 'U', 'V', 'W'];
    suggestedPlanets = ['Mercury (5)', 'Venus (6)', 'Jupiter (3)'];
    cautionaryAlphabets = ['F', 'P', 'R'];
    careerPrecedence = 'सक्रिय बिजनेस कंसल्टिंग, टेलीकॉम ट्रेडिंग, विजुअल ब्रांडिंग और लॉजिस्टिक्स ऑपरेशंस।';
    learningStyle = 'प्रायोगिक और व्यावहारिक (Hands-on)। सॉफ्टवेयर कोडिंग, डिजिटल ऐप्स और इंटरैक्टिव स्क्रीन के माध्यम से तेजी से सीखते हैं।';
    educationStrength = 'कंप्यूटर साइंस, विदेशी भाषाएं और वैश्विक व्यापार भूगोल।';
    creativity = 'ग्राफिक एनिमेशन, लेगो आर्किटेक्चर और डिजिटल म्यूजिक मिक्सिंग।';
    communication = 'अत्यंत त्वरित, बहु-आयामी (Multitasking) बातचीत की गति और बहुभाषी दक्षता।';
    parentingGuidance = 'इनकी तीव्र मानसिक ऊर्जा को दैनिक खेलकूद, जिम्नास्टिक या योग में लगाएं जिससे रात में अच्छी नींद आए।';
    remedies = ['अध्ययन की मेज पर हरे-भरे पौधे रखें।', 'संध्या समय एक बार गायत्री मंत्र का साथ में जाप करें।'];
    luckyActivities = ['कंप्यूटर कोडिंग कैंप्स', 'डिजाइन वर्कशॉप्स', 'फुटबॉल व चपलता वाले खेल'];
  }

  return {
    birthDriver: dayReduced,
    birthConductor: conductor,
    startingAlphabets,
    suggestedPlanets,
    cautionaryAlphabets,
    careerPrecedence,
    learningStyle,
    educationStrength,
    creativity,
    communication,
    parentingGuidance,
    remedies,
    luckyActivities
  };
}

// 6. LUCKY DATE GENERATOR PRO
export function generateLuckyDatesSuite(driver: number, conductor: number): LuckyDatesSuite {
  const friendlyNodes: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 3, 5, 7],
    3: [1, 2, 3, 5, 7, 9],
    4: [5, 6, 7],
    5: [1, 5, 6],
    6: [5, 6, 7],
    7: [3, 5, 6],
    8: [3, 5, 6, 7],
    9: [1, 3, 9]
  };

  const drFriendly = friendlyNodes[driver] || [1, 5, 6];
  const cdFriendly = friendlyNodes[conductor] || [1, 5, 6];

  // Algorithmic filters for different activity categories (always avoiding 8 and 4 sums for traditional reasons)
  const extractDates = (filter: (reduced: number) => boolean) => {
    const dates: number[] = [];
    for (let d = 1; d <= 31; d++) {
      const red = reduceToSingleDigit(d);
      if (drFriendly.includes(red) && cdFriendly.includes(red) && red !== 8 && red !== 4 && filter(red)) {
        dates.push(d);
      }
    }
    // Fallback if super strict
    if (dates.length === 0) {
      for (let d = 1; d <= 31; d++) {
        const red = reduceToSingleDigit(d);
        if ([1, 5, 6].includes(red) && filter(red)) {
          dates.push(d);
        }
      }
    }
    return dates.slice(0, 5);
  };

  return {
    businessDates: extractDates(r => r === 5 || r === 1),
    marriageDates: extractDates(r => r === 6 || r === 3 || r === 2),
    travelDates: extractDates(r => r === 5 || r === 3),
    investmentDates: extractDates(r => r === 6 || r === 1),
    propertyDates: extractDates(r => r === 3 || r === 1),
    examDates: extractDates(r => r === 1 || r === 5),
    interviewDates: extractDates(r => r === 5 || r === 3)
  };
}

// Utility range date list
export function generateLuckyDatesForMonth(driver: number, conductor: number, month: number, year: number): number[] {
  const suite = generateLuckyDatesSuite(driver, conductor);
  return Array.from(new Set([...suite.businessDates, ...suite.marriageDates, ...suite.travelDates])).sort((a,b)=>a-b).slice(0,10);
}
