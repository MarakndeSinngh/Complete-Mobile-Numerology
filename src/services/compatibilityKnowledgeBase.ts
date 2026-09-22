import { DOBAnalysis, NameAnalysis, MobileAnalysis } from '../types';
import { getCompoundDetails } from './compoundDatabase';
import { computeLoshuAnalysis } from './loshuEngine';

export interface PartnerData {
  name: string;
  dob: string;
  mobile?: string;
}

export interface CompatibilityMetric {
  score: number;
  rating: string;
  explanation: string;
  whyThisResult: string;
}

export interface AdvancedCompatibilityReport {
  overallScore: number;
  overallRating: string;
  overallExplanation: string;
  layers: {
    driver: CompatibilityMetric;
    conductor: CompatibilityMetric;
    compound: CompatibilityMetric;
    name: CompatibilityMetric;
    mobile: CompatibilityMetric;
    loshu: CompatibilityMetric;
    arrow: CompatibilityMetric;
    missingNumber: CompatibilityMetric;
    karmic: CompatibilityMetric;
    planetary: CompatibilityMetric;
  };
  categories: {
    emotional: CompatibilityMetric;
    communication: CompatibilityMetric;
    financial: CompatibilityMetric;
    family: CompatibilityMetric;
    intimacy: CompatibilityMetric;
    spiritual: CompatibilityMetric;
  };
  conflictAreas: { area: string; riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'; description: string; advice: string }[];
  growthAreas: { area: string; benefit: string; plan: string }[];
  indicators: {
    isSoulmate: boolean;
    karmicWarning: boolean;
    soulmateType?: string;
  };
}

// Traditional Chaldean & Vedic planetary relationship matrix (1=Sun, 2=Moon, 3=Jupiter, 4=Rahu, 5=Mercury, 6=Venus, 7=Ketu, 8=Saturn, 9=Mars)
// Values map to: 0 = Enemies/Hostile, 1 = Neutral/Passive, 2 = Ultra-Friendly/Harmonious
const PLANETARY_RELS: Record<number, Record<number, number>> = {
  1: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2, 6: 1, 7: 1, 8: 0, 9: 2 },
  2: { 1: 2, 2: 1, 3: 2, 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 },
  3: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 0, 6: 0, 7: 2, 8: 1, 9: 2 },
  4: { 1: 1, 2: 0, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1, 8: 2, 9: 0 },
  5: { 1: 2, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 1, 8: 1, 9: 1 },
  6: { 1: 1, 2: 1, 3: 0, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 1 },
  7: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1, 6: 2, 7: 1, 8: 1, 9: 0 },
  8: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1, 6: 2, 7: 1, 8: 2, 9: 0 },
  9: { 1: 2, 2: 1, 3: 2, 4: 0, 5: 1, 6: 1, 7: 0, 8: 0, 9: 2 }
};

export function calculateAdvancedCompatibility(
  p1: { name: string; dob: string; mobile?: string },
  p2: { name: string; dob: string; mobile?: string }
): AdvancedCompatibilityReport {
  // 1. Core numerology calculations
  const cleanDob1 = p1.dob.replace(/[^0-9]/g, '');
  const cleanDob2 = p2.dob.replace(/[^0-9]/g, '');

  const day1 = parseInt(p1.dob.split('-')[2], 10) || 1;
  const day2 = parseInt(p2.dob.split('-')[2], 10) || 1;

  const sum1 = cleanDob1.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  const sum2 = cleanDob2.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);

  const m1 = reduceToSingleDigit(day1);
  const m2 = reduceToSingleDigit(day2);

  const b1 = reduceToSingleDigit(sum1);
  const b2 = reduceToSingleDigit(sum2);

  const nameSum1 = calculateChaldeanNameSum(p1.name);
  const nameSum2 = calculateChaldeanNameSum(p2.name);

  const n1 = reduceToSingleDigit(nameSum1);
  const n2 = reduceToSingleDigit(nameSum2);

  const mobVal1 = p1.mobile ? getMobileReducedSum(p1.mobile) : 5;
  const mobVal2 = p2.mobile ? getMobileReducedSum(p2.mobile) : 6;

  // Compute Lo Shu Grids
  const grid1 = computeLoshuAnalysis(p1.dob, p1.name);
  const grid2 = computeLoshuAnalysis(p2.dob, p2.name);

  // Indicators mapping
  const isSoulmate = (m1 === b2 && m2 === b1) || (m1 === m2 && b1 === b2) || (m1 === 9 && m2 === 1) || (m1 === 2 && m2 === 7);
  const karmicWarning = (m1 + m2 === 13 || m1 === 8 || m2 === 8 || b1 === 4 || b2 === 4 || m1 === 4 || m2 === 4);

  // LAYER 1: Driver (Mulank) Compatibility
  const relDriver = PLANETARY_RELS[m1]?.[m2] ?? 1;
  let driverScore = relDriver === 2 ? 95 : relDriver === 1 ? 75 : 45;
  if (m1 === m2) driverScore = 85; 
  const driverMetric: CompatibilityMetric = {
    score: driverScore,
    rating: driverScore >= 90 ? 'अति उत्तम (EXCELLENT)' : driverScore >= 70 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `मूलांक ${m1} (${getPlanetName(m1)}) और मूलांक ${m2} (${getPlanetName(m2)}) का आपसी संबंध दैनिक जीवन में ${relDriver === 2 ? 'अत्यंत सामंजस्यपूर्ण और सुखद' : relDriver === 1 ? 'सहयोगात्मक व सामान्य' : 'वैचारिक मतभेद वाला'} योग बनाता है।`,
    whyThisResult: `वैदिक अंकशास्त्र के अनुसार मूलांक ${m1} और ${m2} के स्वामी ग्रहों में ${relDriver === 2 ? 'परस्पर मित्रता' : relDriver === 1 ? 'सम भाव (तटस्थ)' : 'शत्रुता/मतभेद'} का संबंध है।`
  };

  // LAYER 2: Conductor (Bhagyank) Compatibility
  const relCond = PLANETARY_RELS[b1]?.[b2] ?? 1;
  let condScore = relCond === 2 ? 95 : relCond === 1 ? 70 : 40;
  const condMetric: CompatibilityMetric = {
    score: condScore,
    rating: condScore >= 90 ? 'अति उत्तम (EXCELLENT)' : condScore >= 70 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `भाग्यांक ${b1} और साथी के भाग्यांक ${b2} का मिलान दीर्घकालिक भौतिक व आध्यात्मिक उन्नति को नियंत्रित करता है। यह संबंध ${relCond === 2 ? 'सहज व दीर्घकालिक उन्नति' : relCond === 1 ? 'संतुलित व सामान्य सहयोग' : 'पारिवारिक निर्णयों में सावधानी'} दर्शाता है।`,
    whyThisResult: `भाग्यांक ${b1} और ${b2} के बीच ${relCond === 2 ? 'मित्रता' : relCond === 1 ? 'सामान्य' : 'विरोधी'} ग्रह संबंध है जो करियर और भविष्य के निर्णयों को प्रभावित करता है।`
  };

  // LAYER 3: Compound Number Compatibility
  // Compare compound day numbers
  const comp1 = day1;
  const comp2 = day2;
  const cDiff = Math.abs(comp1 - comp2);
  const compScore = Math.max(30, 100 - cDiff * 2.5);
  const compMetric: CompatibilityMetric = {
    score: compScore,
    rating: compScore >= 80 ? 'अति उत्तम (EXCELLENT)' : compScore >= 60 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `जन्म तिथि के संयुक्त अंक ${comp1} और ${comp2} का सूक्ष्म विश्लेषण किया गया है। दोनों अंकों का अंतर ${cDiff} है जो ${compScore >= 80 ? 'उत्कृष्ट आत्मिक अनुकूलता' : 'संतुलित व व्यावहारिक तालमेल'} दर्शाता है।`,
    whyThisResult: `जन्म दिवस के संयुक्त अंकों ${comp1} व ${comp2} के गणितीय अंतर पर आधारित, जो भावनात्मक तरंगों को नियंत्रित करता है।`
  };

  // LAYER 4: Name Compatibility
  const relName = PLANETARY_RELS[n1]?.[n2] ?? 1;
  let nameScore = relName === 2 ? 92 : relName === 1 ? 75 : 50;
  const nameMetric: CompatibilityMetric = {
    score: nameScore,
    rating: nameScore >= 85 ? 'अति उत्तम (EXCELLENT)' : nameScore >= 70 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `आपके नाम का चालडियन जोड़ ${nameSum1} (मूलांक ${n1}) और साथी के नाम का जोड़ ${nameSum2} (मूलांक ${n2}) है। यह सामाजिक मेलजोल और सार्वजनिक जीवन में आपसी तालमेल को दर्शाता है।`,
    whyThisResult: `चालडियन नामांक ${n1} और ${n2} के आधार पर, जो बातचीत और सामाजिक संबंधों को निर्धारित करते हैं।`
  };

  // LAYER 5: Mobile Compatibility
  const relMob = PLANETARY_RELS[mobVal1]?.[mobVal2] ?? 1;
  const mobScore = relMob === 2 ? 90 : relMob === 1 ? 72 : 48;
  const mobMetric: CompatibilityMetric = {
    score: mobScore,
    rating: mobScore >= 80 ? 'अति उत्तम (EXCELLENT)' : mobScore >= 65 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `मोबाइल नंबर का एकल अंक ${mobVal1} और साथी के मोबाइल का अंक ${mobVal2} है। यह दैनिक दूरभाषी बातचीत और डिजिटल संवाद की सहजता को दर्शाता है।`,
    whyThisResult: `दोनों मोबाइल नंबरों के योग और वैदिक ग्रह मित्रता के आधार पर गणना।`
  };

  // LAYER 6: Lo Shu Grid Synergies
  const grid1Digits = Object.values(grid1.loshuGrid).filter(box => box.count > 0).map(box => box.digit);
  const grid2Digits = Object.values(grid2.loshuGrid).filter(box => box.count > 0).map(box => box.digit);

  const sharedNumbers = grid1Digits.filter(x => grid2Digits.includes(x));
  const loshuScore = Math.min(100, Math.max(35, 40 + sharedNumbers.length * 15));
  const loshuMetric: CompatibilityMetric = {
    score: loshuScore,
    rating: loshuScore >= 80 ? 'अति उत्तम (EXCELLENT)' : loshuScore >= 60 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `दोनों के लो शू ग्रिड में ${sharedNumbers.length} उभयनिष्ठ अंक (${sharedNumbers.join(', ') || 'कोई नहीं'}) उपस्थित हैं, जो जीवन के विभिन्न पहलुओं में उत्तम तालमेल दर्शाते हैं।`,
    whyThisResult: `दोनों लो शू ग्रिड के उभयनिष्ठ ऊर्जा केंद्रों की उपस्थिति के आधार पर गणना।`
  };

  // LAYER 7: Arrow Compatibility
  const arrow1 = grid1.strengthArrows.length;
  const arrow2 = grid2.strengthArrows.length;
  const arrowScore = Math.min(100, Math.max(40, 50 + (arrow1 + arrow2) * 8));
  const arrowMetric: CompatibilityMetric = {
    score: arrowScore,
    rating: arrowScore >= 75 ? 'अति उत्तम (EXCELLENT)' : arrowScore >= 60 ? 'उत्तम (GOOD)' : 'चुनौतीपूर्ण (CHALLENGING)',
    explanation: `दोनों के चार्ट में मिलकर कुल ${arrow1 + arrow2} पूर्ण योग (इच्छाशक्ति, संकल्प या बुद्धि के तीर) बनते हैं, जो जीवन में प्रगति के मार्ग खोलते हैं।`,
    whyThisResult: `लो शू ग्रिड के सकारात्मक तीरों (Strengths Arrows) के संयुक्त प्रभाव पर आधारित।`
  };

  // LAYER 8: Missing Number Compatibility
  const missing1 = grid1.missingNumbers.map(item => item.digit);
  const missing2 = grid2.missingNumbers.map(item => item.digit);
  // Mutual support: if partner 1 has a number that partner 2 is missing, that's beautiful
  const p1SavesP2 = missing2.filter(num => grid1Digits.includes(num)).length;
  const p2SavesP1 = missing1.filter(num => grid2Digits.includes(num)).length;
  const missingScore = Math.min(100, Math.max(30, 45 + (p1SavesP2 + p2SavesP1) * 12));
  const missingMetric: CompatibilityMetric = {
    score: missingScore,
    rating: missingScore >= 80 ? 'अति उत्तम (EXCELLENT)' : 'उत्तम (GOOD)',
    explanation: `परस्पर ऊर्जा पूर्ति बहुत अच्छी है। पार्टनर 1 पार्टनर 2 के ${p2SavesP1} खाली अंकों की पूर्ति करते हैं, जबकि पार्टनर 2 पार्टनर 1 के ${p1SavesP2} अनुपस्थित अंकों को संतुलित करते हैं।`,
    whyThisResult: `एक-दूसरे के जन्म ग्रिड के खाली ऊर्जा केंद्रों को परस्पर संतुलित करने की क्षमता पर आधारित।`
  };

  // LAYER 9: Karmic Compatibility
  const karmicScore = isSoulmate ? 98 : karmicWarning ? 50 : 75;
  const karmicMetric: CompatibilityMetric = {
    score: karmicScore,
    rating: karmicScore >= 90 ? 'आत्मिक संबंध (KARMIC SOULMATE)' : karmicScore >= 70 ? 'स्थिर (STABLE)' : 'कर्मिक परीक्षा (KARMIC TEST)',
    explanation: isSoulmate ? 'अत्यंत दुर्लभ और शुभ संयोग। पूर्व जन्म का गहरा आत्मिक संबंध और अटूट निष्ठा।' : 
                 karmicWarning ? 'सावधानी: कुछ कर्मिक सबक सीखने की आवश्यकता है। शांति बनाए रखने हेतु दैनिक ग्रह मंत्र व उपाय आवश्यक हैं।' : 
                 'सामान्य व शांतिपूर्ण कर्मिक संबंध। बिना बड़े तनाव के संतुलित जीवन यात्रा।',
    whyThisResult: `मूलांक-भाग्यांक क्रॉसओवर (${m1} व ${b2}, ${m2} व ${b1}) और चेतावनी निर्देशांकों की जांच पर आधारित।`
  };

  // LAYER 10: Planetary Compatibility
  const pScore = Math.round((PLANETARY_RELS[m1]?.[m2] + PLANETARY_RELS[b1]?.[b2] + PLANETARY_RELS[n1]?.[n2]) * 16.6);
  const planetaryMetric: CompatibilityMetric = {
    score: pScore,
    rating: pScore >= 80 ? 'अत्यंत अनुकूल (HARMONIOUS)' : pScore >= 60 ? 'सामान्य (NEUTRAL)' : 'मतभेद की संभावना',
    explanation: `ग्रह स्वामियों (सूर्य, चंद्रमा, गुरु, बुध, शुक्र, शनि आदि) का कुल तालमेल ${pScore >= 80 ? 'उत्कृष्ट' : pScore >= 60 ? 'संतोषजनक व सामान्य' : 'सावधानी व उपाय योग्य'} है।`,
    whyThisResult: `मूलांक, भाग्यांक और नामांक के ग्रह स्वामियों की परस्पर मित्रता के कुल भार पर आधारित।`
  };

  // CATEGORY CORES
  const emotionalScore = Math.round((driverScore * 0.5) + (compScore * 0.3) + (loshuScore * 0.2));
  const communicationScore = Math.round((nameScore * 0.4) + (mobScore * 0.3) + (driverScore * 0.3));
  const financialScore = Math.round((condScore * 0.6) + (arrowScore * 0.2) + (missingScore * 0.2));
  const familyScore = Math.round((loshuScore * 0.4) + (compScore * 0.4) + (nameScore * 0.2));
  const intimacyScore = Math.round((driverScore * 0.3) + (loshuScore * 0.3) + (compScore * 0.4));
  const spiritualScore = Math.round((condScore * 0.5) + (karmicScore * 0.3) + (planetaryMetric.score * 0.2));

  // Overall stability
  const overallStability = Math.round(
    (driverScore * 0.2) +
    (condScore * 0.2) +
    (compScore * 0.15) +
    (nameScore * 0.15) +
    (loshuScore * 0.1) +
    (missingScore * 0.1) +
    (karmicScore * 0.1)
  );

  const emotionalMetric: CompatibilityMetric = {
    score: emotionalScore,
    rating: getCategoryRating(emotionalScore),
    explanation: `भावनात्मक जुड़ाव ${getCategoryDesc(emotionalScore)} है। दोनों के मूल स्वभाव में ${emotionalScore >= 80 ? 'सुंदर तालमेल' : 'थोड़े सामंजस्य के साथ अच्छा समन्वय'} है।`,
    whyThisResult: `मूलांक ${m1} व ${m2} की मित्रता और जन्म दिन के अंतर (${cDiff}) पर आधारित।`
  };

  const communicationMetric: CompatibilityMetric = {
    score: communicationScore,
    rating: getCategoryRating(communicationScore),
    explanation: `विचारों का आदान-प्रदान ${getCategoryDesc(communicationScore)} है। बातचीत में ${communicationScore >= 80 ? 'अत्यंत स्पष्टता और खुलापन' : 'तनाव के समय थोड़ा संकोच'} रह सकता है।`,
    whyThisResult: `चालडियन नामांक और मोबाइल अंकों (${mobVal1} व ${mobVal2}) के आधार पर।`
  };

  const financialMetric: CompatibilityMetric = {
    score: financialScore,
    rating: getCategoryRating(financialScore),
    explanation: `धन और संपत्ति का संयुक्त सूचकांक ${financialScore}/100 है। भाग्यांक की अनुकूलता पर निर्भर करता है।`,
    whyThisResult: `भाग्यांक ${b1} व ${b2} करियर की दिशा तय करते हैं, जबकि लो शू तीर संयुक्त निवेश को समर्थन देते हैं।`
  };

  const familyMetric: CompatibilityMetric = {
    score: familyScore,
    rating: getCategoryRating(familyScore),
    explanation: `पारिवारिक सुख-शांति, संतान समृद्धि और परिजनों के साथ तालमेल की रेटिंग ${getCategoryRating(familyScore)} है।`,
    whyThisResult: `लो शू संरचनात्मक समन्वय और चालडियन नामांक के पारिवारिक प्रभाव पर आधारित।`
  };

  const intimacyMetric: CompatibilityMetric = {
    score: intimacyScore,
    rating: getCategoryRating(intimacyScore),
    explanation: `परस्पर आकर्षण और सामंजस्य का स्तर ${intimacyScore}% पर स्थिर है।`,
    whyThisResult: `मूलांक आकर्षण और लो शू भावनात्मक तल के समन्वय से निर्धारित।`
  };

  const spiritualMetric: CompatibilityMetric = {
    score: spiritualScore,
    rating: getCategoryRating(spiritualScore),
    explanation: `कठिन समय में एक-दूसरे का संबल बनना और आध्यात्मिक उन्नति का स्तर ${spiritualScore}% है।`,
    whyThisResult: `कर्मिक संकेतों और भाग्यांक की अनुकूलता पर आधारित।`
  };

  // Generate dynamic actionable conflict areas
  const conflicts: { area: string; riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'; description: string; advice: string }[] = [];
  if (relDriver === 0) {
    conflicts.push({
      area: 'दैनिक निर्णयों में अहं का टकराव',
      riskLevel: 'HIGH',
      description: `मूलांक ${m1} (${getPlanetName(m1)}) और मूलांक ${m2} (${getPlanetName(m2)}) के नेतृत्व दृष्टिकोण में अंतर के कारण।`,
      advice: 'एक स्पष्ट नियम बनाएं: घरेलू निर्णयों में पार्टनर 1 और वित्तीय निवेश में पार्टनर 2 की राय को प्राथमिकता दें।'
    });
  }
  if (karmicWarning) {
    conflicts.push({
      area: 'कभी-कभार मनमुटाव या चुप्पी',
      riskLevel: 'MEDIUM',
      description: 'कर्मिक चेतावनी के कारण समय-समय पर बातचीत में दूरी आ सकती है।',
      advice: 'प्रत्येक शुक्रवार शाम को साथ बैठकर मन की बात खुलकर साझा करें ताकि गिले-शिकवे न बढ़ें।'
    });
  }
  if (PLANETARY_RELS[n1]?.[n2] === 0) {
    conflicts.push({
      area: 'सामाजिक मुलाकातों में वैचारिक मतभेद',
      riskLevel: 'MEDIUM',
      description: 'नामांक में थोड़ा अंतर होने के कारण सार्वजनिक कार्यक्रमों में राय अलग हो सकती है।',
      advice: 'सार्वजनिक स्थानों पर बहस से बचें और अपने हस्ताक्षर को ऊपर की ओर 15 डिग्री पर करने का अभ्यास करें।'
    });
  }
  if (conflicts.length === 0) {
    conflicts.push({
      area: 'दैनिक दिनचर्या में सामान्य समायोजन',
      riskLevel: 'LOW',
      description: 'ग्रह गोचर के बदलाव के समय होने वाले सामान्य घरेलू समायोजन।',
      advice: 'शयनकक्ष के ईशान कोण (North-East) में तांबे के पात्र में स्वच्छ जल रखें।'
    });
  }

  // Generate dynamic, realistic growth plans
  const growth: { area: string; benefit: string; plan: string }[] = [
    {
      area: 'संयुक्त धन वृद्धि एवं निवेश',
      benefit: 'अतिरिक्त आय के स्रोत खुलते हैं और संपत्ति में रुकावटें दूर होती हैं।',
      plan: `चूंकि पार्टनर 1 पार्टनर 2 के ${p2SavesP1} खाली अंकों को सहारा देते हैं, संयुक्त निवेश के कागजातों पर गुरुवार सुबह हस्ताक्षर करें।`
    },
    {
      area: 'पारस्परिक विश्वास एवं शांति',
      benefit: 'अदृश्य मानसिक तनाव और चिंताएं पूरी तरह समाप्त होती हैं।',
      plan: `लिविंग रूम के दक्षिण-पश्चिम (South-West) कोने में चांदी के फ्रेम में दोनों का संयुक्त चित्र लगाएं।`
    }
  ];

  return {
    overallScore: overallStability,
    overallRating: overallStability >= 85 ? 'अति उत्तम स्थिरता (EXCELLENT STABILITY)' : overallStability >= 70 ? 'उत्तम तालमेल (GOOD ALIGNMENT)' : 'उपायों की आवश्यकता (REQUIRES REMEDIES)',
    overallExplanation: overallStability >= 85 
      ? 'एक अत्यंत अनुकूल और सुखद संबंध। मित्र मूलांक और पूरक लो शू ग्रिड दीर्घकालिक साथी के रूप में उत्तम सुख का संकेत देते हैं।'
      : overallStability >= 70 
      ? 'एक मजबूत और सुरक्षात्मक संबंध। घरेलू स्तर पर स्थिरता देता है, बस कभी-कभार बातचीत से छोटी-मोटी गलतफहमियां दूर करते रहें।'
      : 'थोड़ा चुनौतीपूर्ण संबंध। ग्रहों में मतभेद होने के कारण नियमित सूर्य को अर्घ्य देना और नाम की स्पेलिंग का सही समायोजन लाभकारी रहेगा।',
    layers: {
      driver: driverMetric,
      conductor: condMetric,
      compound: compMetric,
      name: nameMetric,
      mobile: mobMetric,
      loshu: loshuMetric,
      arrow: arrowMetric,
      missingNumber: missingMetric,
      karmic: karmicMetric,
      planetary: planetaryMetric
    },
    categories: {
      emotional: emotionalMetric,
      communication: communicationMetric,
      financial: financialMetric,
      family: familyMetric,
      intimacy: intimacyMetric,
      spiritual: spiritualMetric
    },
    conflictAreas: conflicts,
    growthAreas: growth,
    indicators: {
      isSoulmate,
      karmicWarning
    }
  };
}

function getPlanetName(num: number): string {
  const ps: Record<number, string> = {
    1: 'सूर्य (Sun)', 2: 'चंद्रमा (Moon)', 3: 'बृहस्पति (Jupiter)', 4: 'राहु (Rahu)', 5: 'बुध (Mercury)', 6: 'शुक्र (Venus)', 7: 'केतु (Ketu)', 8: 'शनि (Saturn)', 9: 'मंगल (Mars)'
  };
  return ps[num] || 'स्वामी';
}

function getCategoryRating(score: number): string {
  if (score >= 85) return 'अति उत्तम (EXCELLENT)';
  if (score >= 70) return 'उत्तम (GOOD)';
  return 'सामान्य (उपाय सुझाये गए)';
}

function getCategoryDesc(score: number): string {
  if (score >= 85) return 'अत्यंत सामंजस्यपूर्ण, सुखद और गहरा';
  if (score >= 70) return 'स्थिर, विश्वसनीय और सहज';
  return 'धैर्य और सरल उपायों पर आधारित';
}

function calculateChaldeanNameSum(name: string): number {
  const map: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };
  return name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((acc, char) => acc + (map[char] || 0), 0);
}

function getMobileReducedSum(mobile: string): number {
  const digits = mobile.replace(/[^0-9]/g, '');
  let sum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return sum;
}

function reduceToSingleDigit(num: number): number {
  if (num === 0) return 0;
  let s = Math.abs(num);
  while (s > 9) {
    s = s.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return s;
}
