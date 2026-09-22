/**
 * LEOFAMILY KARMIC NUMBER ENGINE
 * Identifies Karmic Debt Numbers (13, 14, 16, 19) and Karmic Lessons
 * Stored distinctly from missing numbers.
 */

export interface KarmicDebtPattern {
  number: number;
  title: string;
  source: string; // e.g. 'जन्म दिवस 13' | 'संयुक्त मूलांक 14'
  lesson: string;
  behaviour: string;
  growthOpportunity: string;
  practicalAction: string;
  traditionalRemedy: string;
  pastLifeInfluence: string;
  behavioralManifestation: string;
  practicalActionPlan: string;
}

export interface KarmicAnalysisResult {
  hasKarmicDebt: boolean;
  karmicDebts: KarmicDebtPattern[];
  debts: KarmicDebtPattern[];
  karmicNumbersPresent: number[];
  karmicLessons: string[];
  summary: string;
}

const KARMIC_DEBT_DEFINITIONS: Record<number, Omit<KarmicDebtPattern, 'source' | 'pastLifeInfluence' | 'behavioralManifestation' | 'practicalActionPlan'>> = {
  13: {
    number: 13,
    title: 'कार्मिक ऋण 13/4: निरंतर लगन एवं धैर्य की परीक्षा (Focused Perseverance)',
    lesson: 'बिना शॉर्टकट अपनाए अनुशासित प्रयास, दैनिक व्यवस्था और नींव को मजबूत बनाना सीखना।',
    behaviour: 'यह भावना कि साथियों की तुलना में समान परिणाम पाने के लिए दोगुना परिश्रम करना पड़ रहा है, जिससे कभी-कभी झुंझलाहट होती है।',
    growthOpportunity: 'अडिग आत्म-अनुशासन, दैनिक कार्यों में सूक्ष्म बारीकियों पर ध्यान और अटूट एकाग्रता विकसित करना।',
    practicalAction: 'किसी भी कार्य को बीच में अधूरा न छोड़ें; आरंभ किए गए प्रत्येक प्रोजेक्ट को व्यवस्थित रूप से पूर्ण करें।',
    traditionalRemedy: 'शनिवार को बेजुबान पशु-पक्षियों या कुत्तों को भोजन कराएं; ॐ राहवे नमः का जप करें और कार्यक्षेत्र को सुव्यवस्थित रखें।'
  },
  14: {
    number: 14,
    title: 'कार्मिक ऋण 14/5: स्वतंत्रता एवं आत्म-संयम की परीक्षा (Temperance & Freedom)',
    lesson: 'व्यक्तिगत स्वतंत्रता के साथ आत्म-नियंत्रण का संतुलन; आवेगपूर्ण निर्णयों व अति-उत्साह से बचना।',
    behaviour: 'मन में बेचैनी, जीवन की प्राथमिकताओं में अचानक बदलाव और तनाव के समय दिनचर्या से पलायन की प्रवृत्ति।',
    growthOpportunity: 'भावनात्मक स्थिरता, स्थिर प्रतिबद्धता (Commitment) और नियमित संयमित दिनचर्या का निर्माण।',
    practicalAction: 'प्रतिदिन सुबह 10 मिनट मौन ध्यान करें और जीवन में बिना सोचे-समझे अचानक बड़े बदलाव करने से बचें।',
    traditionalRemedy: 'बुधवार को गौमाता को हरी घास या पालक खिलाएं; भोजन करते समय मौन व सजगता (Mindfulness) का अभ्यास करें।'
  },
  16: {
    number: 16,
    title: 'कार्मिक ऋण 16/7: अहंकार मुक्ति एवं आत्म-बोध की जागृति (Awakening from Ego)',
    lesson: 'दिखावे, बौद्धिक अहंकार या अत्यधिक नियंत्रण की प्रवृत्ति को त्यागकर वास्तविक आत्मिक सत्य को पहचानना।',
    behaviour: 'जीवन में अचानक अप्रत्याशित उतार-चढ़ाव जो झूठे अभिमान को तोड़कर अंतर्मुखी आत्म-चिंतन की ओर प्रेरित करते हैं।',
    growthOpportunity: 'गहरी विनम्रता, दूसरों के प्रति सच्ची सहानुभूति और अटूट आध्यात्मिक आस्था का विकास।',
    practicalAction: 'जीवन के अप्रत्याशित परिवर्तनों को सहजता से स्वीकारें; दूसरों के साथ बिना शर्त आदर और सौहार्द का व्यवहार करें।',
    traditionalRemedy: 'भगवान गणेश की आराधना करें; प्रतिदिन मौन प्रार्थना करें और अनामिका अंगुली में शुद्ध चांदी का छल्ला धारण करें।'
  },
  19: {
    number: 19,
    title: 'कार्मिक ऋण 19/1: सहयोगात्मक नेतृत्व एवं विनम्रता की परीक्षा (Interdependent Leadership)',
    lesson: 'दूसरों से सहायता मांगना और स्वीकार करना सीखना; अकेले सब कुछ कर लेने के भ्रम से मुक्त होना।',
    behaviour: 'सहायता मांगने में झिझक, अकेले ही सारा बोझ उठाने की जिद और सहयोगियों द्वारा स्वयं को उपेक्षित समझना।',
    growthOpportunity: 'एक ऐसे प्रेरक एवं उदार लीडर के रूप में उभरना जो अपनी पूरी टीम को साथ लेकर आगे बढ़ता है।',
    practicalAction: 'कार्यों और जिम्मेदारियों को दूसरों में बांटें (Delegate); सहयोगियों के योगदान की खुले दिल से प्रशंसा करें।',
    traditionalRemedy: 'प्रातःकाल उगते सूर्य को तांबे के लोटे से जल (अर्घ्य) अर्पित करें; रविवार को जरूरतमंद वृद्धजनों की सेवा करें।'
  }
};

export function analyzeKarmicPatterns(day: number, compoundDay: number, compoundDOB: number): KarmicAnalysisResult {
  const karmicDebts: KarmicDebtPattern[] = [];

  // Check day of birth
  if (day in KARMIC_DEBT_DEFINITIONS) {
    const def = KARMIC_DEBT_DEFINITIONS[day];
    karmicDebts.push({
      ...def,
      source: `जन्म दिवस (${day})`,
      pastLifeInfluence: def.lesson,
      behavioralManifestation: def.behaviour,
      practicalActionPlan: def.practicalAction
    });
  }

  // Check compound DOB sum
  if (compoundDOB in KARMIC_DEBT_DEFINITIONS && !karmicDebts.some(k => k.number === compoundDOB)) {
    const def = KARMIC_DEBT_DEFINITIONS[compoundDOB];
    karmicDebts.push({
      ...def,
      source: `संपूर्ण जन्मतिथि संयुक्त योग (${compoundDOB})`,
      pastLifeInfluence: def.lesson,
      behavioralManifestation: def.behaviour,
      practicalActionPlan: def.practicalAction
    });
  }

  const karmicNumbersPresent = karmicDebts.map(k => k.number);
  const karmicLessons: string[] = karmicDebts.map(k => k.lesson);
  if (karmicDebts.length === 0) {
    karmicLessons.push('चार्ट में कोई प्राथमिक कार्मिक ऋण (13, 14, 16, 19) उपस्थित नहीं है। जीवन पथ संतुलित मूलांक-भाग्यांक समन्वय द्वारा संचालित है।');
  }

  const summary = karmicDebts.length > 0
    ? `आपकी जन्म कुंडली में ${karmicDebts.length} सक्रिय कार्मिक ऋण चक्र (#${karmicNumbersPresent.join(', #')}) उपस्थित हैं। इनके प्रति जागरूक रहकर और सरल वैदिक उपायों का पालन करके आप असाधारण आत्मिक परिपक्वता और सफलता प्राप्त कर सकते हैं।`
    : 'आपकी जन्म कुंडली क्लासिकल कार्मिक ऋणों (13, 14, 16, 19) से सर्वथा मुक्त है। आपका जीवन पथ शुद्ध ग्रहीय संतुलन और सकारात्मक विकास के अनुकूल है।';

  return {
    hasKarmicDebt: karmicDebts.length > 0,
    karmicDebts,
    debts: karmicDebts,
    karmicNumbersPresent,
    karmicLessons,
    summary
  };
}
