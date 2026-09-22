import { reduceToSingleDigit } from './numerologyEngine';

export interface DashaPeriod {
  planet: number;
  planetName: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  healthImpact: string;
  careerImpact: string;
  relationshipImpact: string;
  financialImpact: string;
  generalInfluence: string;
}

export interface AntardashaPeriod {
  subPlanet: number;
  subPlanetName: string;
  durationYears: number;
  ageOfInfluence: number;
  calendarYear: number;
  forecast: string;
}

export interface DashaAnalysisReport {
  birthYear: number;
  currentAge: number;
  currentYear: number;
  mahadashasList: DashaPeriod[];
  currentMahadasha: DashaPeriod;
  currentAntardasha: AntardashaPeriod;
  personalYearNumber: number;
  personalYearForecast: string;
}

const PLANET_NAMES: Record<number, string> = {
  1: 'Sun (सूर्य - Energy, Fame, Authority)',
  2: 'Moon (चन्द्र - Peace, Fluidity, Creativity)',
  3: 'Jupiter (गुरु - Wisdom, Counsel, Wealth)',
  4: 'Rahu (राहु - Ambition, Mystery, sudden turns)',
  5: 'Mercury (बुध - Logic, Business, Speed)',
  6: 'Venus (शुक्र - Luxury, Romance, Fine Arts)',
  7: 'Ketu (केतु - Analysis, Spiritual detached eye)',
  8: 'Saturn (शनि - Discipline, Legacy, delays)',
  9: 'Mars (मंगल - Fire, Direct Courage, Muscle)'
};

const PLANET_DASHA_DESCS: Record<number, {
  general: string;
  health: string;
  career: string;
  relationship: string;
  financial: string;
}> = {
  1: {
    general: 'सूर्य देव की अत्यंत प्रभावशाली महादशा। यह काल आत्मविश्वास, सामाजिक प्रतिष्ठा और करियर में उच्च पदोन्नति प्रदान करता है।',
    health: 'सामान्यतः उत्तम स्वास्थ्य और जीवन शक्ति। आंखों में तनाव, पित्त दोष या गर्मी से होने वाली एसिडिटी से सावधान रहें।',
    career: 'शानदार नेतृत्व और अधिकार का समय। स्वतंत्र व्यापार शुरू करने, सरकारी अनुबंध या प्रशासनिक पदों के लिए सर्वश्रेष्ठ अवधि।',
    relationship: 'अहंकार और हठ से बचें। जीवनसाथी या परिवार के सुझावों को ध्यान से सुनें और विनम्रता बनाए रखें।',
    financial: 'अधिकार और पदोन्नति से मजबूत वित्तीय लाभ। पैतृक संपत्ति में लाभ और विलासिता पर व्यय में वृद्धि।'
  },
  2: {
    general: 'चंद्रमा की कोमल व भावनात्मक महादशा। यह समय रचनात्मक कल्पना, मानसिक शांति, नए सहयोग और गृह निर्माण के लिए श्रेष्ठ है।',
    health: 'पाचन तंत्र और कफ दोष का ध्यान रखें। मौसम परिवर्तन के समय सर्दी-जुकाम और मन में भावनात्मक उतार-चढ़ाव संभव हैं।',
    career: 'हॉस्पिटैलिटी, कला, लेखन, मार्केटिंग, फूड इंडस्ट्री और रचनात्मक साझेदारियों में विशेष सफलता।',
    relationship: 'गहरा भावनात्मक जुड़ाव और संवेदनशीलता। प्रेम संबंधों और विवाह के लिए अत्यंत अनुकूल समय।',
    financial: 'तरल धन (Liquid Cash) का अच्छा प्रवाह रहेगा। सट्टेबाजी या जल्दबाजी में बड़े निवेश से बचें।'
  },
  3: {
    general: 'बृहस्पति (गुरु) का स्वर्ण काल। ज्ञान का विस्तार, आध्यात्मिक प्रगति, उच्च अध्ययन और स्थायी आर्थिक समृद्धि का योग।',
    health: 'शारीरिक स्वास्थ्य उत्तम रहेगा। खान-पान में अत्यधिक मीठे और वसायुक्त भोजन से बचें ताकि लिवर संतुलित रहे।',
    career: 'सलाहकार, शिक्षक, वित्तीय विशेषज्ञ, प्रशासनिक अधिकारी या मेंटर की भूमिका में बड़ी पदोन्नति।',
    relationship: 'पारिवारिक सम्मान और नैतिक मूल्यों में वृद्धि। घर में मांगलिक कार्य, विवाह या संतान सुख के लिए अति शुभ समय।',
    financial: 'सुरक्षित और दीर्घकालिक धन वृद्धि। अचल संपत्ति, भूमि और सुरक्षित निवेशों में निरंतर लाभ।'
  },
  4: {
    general: 'राहु की तीव्र और अप्रत्याशित महादशा। जीवन में अचानक बड़े व्यावसायिक अवसर, तकनीकी लाभ और दूरस्थ यात्राओं के योग।',
    health: 'मानसिक तनाव, अनिद्रा और पीठ या त्वचा की संवेदनशीलता। नियमित ध्यान और पर्याप्त नींद अति आवश्यक है।',
    career: 'सॉफ्टवेयर, डिजिटल प्लेटफॉर्म, मीडिया या विदेशी अनुबंधों में अचानक बड़ी सफलता। योजनाओं को गोपनीय रखें।',
    relationship: 'अचानक नए संबंध बनना या गलतफहमी होना संभव है। पारिवारिक शांति और विश्वास को प्राथमिकता दें।',
    financial: 'अचानक बड़ा धन लाभ, जिसके साथ ही अप्रत्याशित खर्च भी संभव हैं। धन को सुरक्षित संपत्ति में लॉक रखें।'
  },
  5: {
    general: 'बुध ग्रह की तीव्र व्यापारिक महादशा। त्वरित तार्किक बुद्धि, मार्केटिंग में सफलता, संचार कौशल और व्यावसायिक यात्राओं का समय।',
    health: 'मानसिक स्फूर्ति भरपूर रहेगी। दिमाग को शांत रखने के लिए नियमित दिनचर्या और पर्याप्त नींद लें।',
    career: 'ट्रेडिंग, अकाउंट्स, सॉफ्टवेयर कोडिंग, जनसंपर्क, काउंसलिंग और वाणिज्यिक व्यापार के लिए सर्वोत्तम काल।',
    relationship: 'सहज, खुशनुमा और बौद्धिक संवाद। नए प्रभावशाली मित्रों और शुभचिंतकों का दायरा बढ़ेगा।',
    financial: 'तेज कैश फ्लो और व्यापार में त्वरित लाभ। आय के कई छोटे-बड़े स्रोत विकसित होंगे।'
  },
  6: {
    general: 'शुक्र देव का ऐश्वर्यशाली काल। भौतिक सुख-सुविधाएं, ब्रांड प्रसिद्धि, वाहन सुख और प्रेम-सौहार्द की भरपूर वृद्धि।',
    health: 'स्वास्थ्य उत्तम रहेगा। खान-पान में अत्यधिक मीठे और गरिष्ठ भोजन से बचें और जल का प्रचुर सेवन करें।',
    career: 'फैशन, ग्लैमर, आभूषण, इंटीरियर डिजाइन, लग्जरी रिटेल, कला और आर्किटेक्चर में अपार सफलता।',
    relationship: 'रोमांस, दांपत्य सुख और पारिवारिक जीवन में मधुरता। विवाह और नए संबंधों के लिए स्वर्णिम काल।',
    financial: 'शानदार वित्तीय स्थिति। वाहन, आभूषण और घरेलू सुख-सुविधाओं की खरीदारी के लिए अनुकूल समय।'
  },
  7: {
    general: 'केतु की आत्म-विश्लेषणात्मक व आध्यात्मिक महादशा। गूढ़ अध्ययन, शोध कार्य, ध्यान और आंतरिक ज्ञान में गहरी रुचि।',
    health: 'अस्पष्ट शारीरिक संवेदनशीलता या एलर्जी। नियमित प्राणायाम, योग और प्राकृतिक सात्विक आहार से विशेष लाभ।',
    career: 'रिसर्च, ऑडिटिंग, न्यूमरोलॉजी, ज्योतिष, मेडिकल डायग्नोस्टिक्स और शोधपरक लेखन में सर्वोच्च सफलता।',
    relationship: 'शांत और एकांतप्रिय स्वभाव। वाद-विवाद से दूर रहने और परस्पर वैचारिक तालमेल पर जोर रहेगा।',
    financial: 'आंतरिक संतोष और आध्यात्मिक संपदा। किसी को बिना लिखा-पढ़ी के बड़ा उधार देने से बचें।'
  },
  8: {
    general: 'शनि देव की कर्म-प्रधान महादशा। धैर्य, कड़ी मेहनत, ईमानदारी और व्यवस्थित योजना से स्थायी साम्राज्य का निर्माण।',
    health: 'जोड़ों का दर्द, हड्डियों में जकड़न या धीमी पाचन क्रिया। सरसों/तिल के तेल से मालिश और सात्विक आहार लाभप्रद।',
    career: 'स्थायी और सुरक्षित प्रगति। भारी उद्योग, मैन्युफैक्चरिंग, निर्माण कार्य, लोहा-कोयला व्यापार या कानून में बड़ी सफलता।',
    relationship: 'पारिवारिक कर्तव्यों और जिम्मेदारियों का पालन। रिश्ते धीरे-धीरे लेकिन बेहद मजबूत बनते हैं।',
    financial: 'धीमी शुरुआत के बाद चट्टान की तरह मजबूत धन संचय। रियल एस्टेट और जमीन के सौदों में भारी लाभ।'
  },
  9: {
    general: 'मंगल देव की ऊर्जावान महादशा। अदम्य साहस, कार्य करने की तीव्र गति, निर्भीकता और नेतृत्व क्षमता का विकास।',
    health: 'रक्त प्रवाह और शारीरिक ऊर्जा उच्च रहेगी। जल्दबाजी, चोट या मांसपेशियों में खिंचाव से बचने के लिए मन शांत रखें।',
    career: 'सुरक्षा बल, भूमि विकास, इंजीनियरिंग, सर्जरी, खेलकूद या औद्योगिक प्रबंधन में शीर्ष मुकाम।',
    relationship: 'अत्यधिक सुरक्षात्मक और स्पष्टवादी भावना। गुस्से या जल्दबाजी में तीखे शब्दों के प्रयोग से बचें।',
    financial: 'तेज पूंजी निवेश। कृषि भूमि, रियल एस्टेट और व्यावसायिक संपत्तियों में लाभकारी सौदे।'
  }
};

export function calculateDashaAndYearForecast(dobStr: string, currentCalYear: number = 2026): DashaAnalysisReport {
  const parts = dobStr.split('-');
  const bYear = parseInt(parts[0], 10) || 1990;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  const currentAge = currentCalYear - bYear;

  // Single reduction helpers
  const p1 = reduceToSingleDigit(day);
  const cleanStr = dobStr.replace(/[^0-9]/g, '');
  const dSum = cleanStr.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  const p2 = reduceToSingleDigit(dSum);

  // Generate 9 distinct major Mahadasha blocks
  const driver = p1;
  const conductor = p2;

  const planetSeq = [
    driver,
    conductor,
    reduceToSingleDigit(driver + conductor),
    reduceToSingleDigit(day),
    reduceToSingleDigit(month),
    reduceToSingleDigit(bYear),
    reduceToSingleDigit(driver * 2),
    reduceToSingleDigit(conductor * 2),
    9
  ].map(p => p === 0 ? 9 : p);

  // Eliminate adjacent duplicate planets to ensure diversity
  const uniquePlanetSeq: number[] = [];
  planetSeq.forEach(p => {
    if (uniquePlanetSeq.length === 0 || uniquePlanetSeq[uniquePlanetSeq.length - 1] !== p) {
      uniquePlanetSeq.push(p);
    }
  });
  // Fill back up to 9 with missing numbers if we collapsed duplicates
  for (let i = 1; i <= 9; i++) {
    if (uniquePlanetSeq.length < 9 && !uniquePlanetSeq.includes(i)) {
      uniquePlanetSeq.push(i);
    }
  }
  // If still under 9, fill with sequential backups
  while (uniquePlanetSeq.length < 9) {
    uniquePlanetSeq.push((uniquePlanetSeq[uniquePlanetSeq.length - 1] % 9) + 1);
  }

  const dashaList: DashaPeriod[] = [];
  let trackingYear = bYear;

  for (let idx = 0; idx < 9; idx++) {
    const pl = uniquePlanetSeq[idx];
    const sAge = idx * 9;
    const eAge = (idx + 1) * 9 - 1;
    const sYear = trackingYear;
    const eYear = trackingYear + 8;

    const descSet = PLANET_DASHA_DESCS[pl] || PLANET_DASHA_DESCS[1];

    dashaList.push({
      planet: pl,
      planetName: PLANET_NAMES[pl] || 'Unknown',
      startAge: sAge,
      endAge: eAge,
      startYear: sYear,
      endYear: eYear,
      healthImpact: descSet.health,
      careerImpact: descSet.career,
      relationshipImpact: descSet.relationship,
      financialImpact: descSet.financial,
      generalInfluence: descSet.general
    });

    trackingYear += 9;
  }

  // Find current running Mahadasha
  let currentMahadasha = dashaList[0];
  for (const ds of dashaList) {
    if (currentCalYear >= ds.startYear && currentCalYear <= ds.endYear) {
      currentMahadasha = ds;
      break;
    }
  }

  // If age exceeds largest block, default to last
  if (currentCalYear > dashaList[8].endYear) {
    currentMahadasha = dashaList[8];
  }

  // Compute Antardasha inside current Mahadasha (9 subperiods of 1 year each)
  const dashaElapsedYears = currentCalYear - currentMahadasha.startYear;
  // Sub period index: 0 to 8
  const subIdx = Math.max(0, Math.min(8, dashaElapsedYears));

  // Antardashas are ruled by sub planets sequencing starting from the Mahadasha planet
  const subPlanet = ((currentMahadasha.planet + subIdx - 1) % 9) + 1;

  const antardashaForecasts: Record<number, string> = {
    1: 'सूर्य की अंतर्दशा: आत्मविश्वास और नेतृत्व क्षमता में वृद्धि। सरकारी कार्यों, वरिष्ठ अधिकारियों के सहयोग और मान-सम्मान के लिए उत्तम।',
    2: 'चंद्रमा की अंतर्दशा: मन में शांति और रचनात्मकता। पारिवारिक सुख, गृह सज्जा और भावनात्मक संबंधों में प्रगाढ़ता का समय।',
    3: 'बृहस्पति (गुरु) की अंतर्दशा: ज्ञान, विवेक और भाग्य का साथ। जटिल वित्तीय समस्याएं सुलझेंगी और श्रेष्ठ गुरुओं का मार्गदर्शन मिलेगा।',
    4: 'राहु की अंतर्दशा: अप्रत्याशित अवसर और तकनीकी प्रगति। नए अनुबंधों को सोच-समझकर जांचें और जल्दबाजी में जोखिम न लें।',
    5: 'बुध की अंतर्दशा: व्यापार, नेटवर्किंग और संवाद में तेजी। मार्केटिंग, नए व्यावसायिक प्रोजेक्ट्स और वित्तीय प्लानिंग के लिए श्रेष्ठ।',
    6: 'शुक्र की अंतर्दशा: सुख-सुविधाओं और धन का आगमन। सामाजिक प्रतिष्ठा, कलात्मक कार्यों और दांपत्य जीवन में सुखद वातावरण।',
    7: 'केतु की अंतर्दशा: गूढ़ अध्ययन, शोध और आध्यात्मिक शांति। गहन आत्म-मंथन और अंतर्ज्ञान के लिए अत्यंत फलदायी।',
    8: 'शनि की अंतर्दशा: अनुशासन और धैर्य की परीक्षा। निरंतर परिश्रम से लंबे समय तक टिकने वाले स्थायी परिणाम प्राप्त होंगे।',
    9: 'मंगल की अंतर्दशा: ऊर्जा, साहस और त्वरित निर्णय क्षमता। रुके हुए कार्यों को तेजी से पूरा करने और भूमि संबंधी कार्यों के लिए अनुकूल।'
  };

  const currentAntardasha: AntardashaPeriod = {
    subPlanet,
    subPlanetName: PLANET_NAMES[subPlanet] || 'Unknown',
    durationYears: 1,
    ageOfInfluence: currentMahadasha.startAge + subIdx,
    calendarYear: currentCalYear,
    forecast: antardashaForecasts[subPlanet] || 'ग्रहों का अनुकूल सूक्ष्म प्रभाव सक्रिय है।'
  };

  // Personal Year Calculations
  // PY = reduceToSingleDigit(Day + Month + CurrentYear)
  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const calYearReduced = reduceToSingleDigit(currentCalYear);
  const personalYearNumber = reduceToSingleDigit(dayReduced + monthReduced + calYearReduced);

  const pyForecasts: Record<number, string> = {
    1: 'वैदिक Personal Year 1 (सूर्यांक - नई शुरुआत): नए संकल्पों, नेतृत्व और नए कार्यों की शुरुआत का वर्ष। आत्मविश्वास के साथ स्वतंत्र पहल करें और नई दिशा तय करें।',
    2: 'वैदिक Personal Year 2 (सोमांक - सौहार्द और तालमेल): टीम वर्क, साझेदारी, वित्तीय संतुलन और शांत संवाद का वर्ष। जल का सम्मान करें और भावनात्मक संतुलन बनाए रखें।',
    3: 'वैदिक Personal Year 3 (गुर्वांक - ज्ञान और विस्तार): भाग्य और ज्ञान का श्रेष्ठ वर्ष। उच्च अध्ययन, वित्तीय परामर्श, लेखन और आध्यात्मिक प्रगति के लिए अत्यंत शुभ।',
    4: 'वैदिक Personal Year 4 (राह्वंक - संरचना और तकनीकी विस्तार): अप्रत्याशित अवसर, तकनीकी विकास और नए संपर्कों का वर्ष। योजनाओं को व्यवस्थित रखें और जल्दबाजी से बचें।',
    5: 'वैदिक Personal Year 5 (बुधांक - व्यापार और संचार): व्यापारिक प्रगति, जनसंपर्क और त्वरित यात्राओं का वर्ष। नए व्यावसायिक नेटवर्क और संवाद से भारी लाभ।',
    6: 'वैदिक Personal Year 6 (शुक्रांक - सुख और पारिवारिक वैभव): पारिवारिक सुख, सौंदर्य, नए वाहन या गृह सज्जा और भौतिक समृद्धि का श्रेष्ठ वर्ष।',
    7: 'वैदिक Personal Year 7 (केतुक - चिंतन और अनुसंधान): अंतर्मुखी होकर अध्ययन, शोध और स्वास्थ्य सुधार का वर्ष। मानसिक शांति और ध्यान साधना पर बल दें।',
    8: 'वैदिक Personal Year 8 (शन्यंक - कर्म और सुदृढ़ निर्माण): कड़ी मेहनत, संपत्ति निर्माण और दीर्घकालिक लक्ष्यों को हासिल करने का वर्ष। धैर्य और ईमानदारी से काम करें।',
    9: 'वैदिक Personal Year 9 (मंगलांक - समापन और पूर्णता): पुराने रुके कार्यों को पूरा करने, व्यर्थ के बंधनों को समाप्त करने और नए 9-वर्षीय चक्र की तैयारी का वर्ष।'
  };

  const personalYearForecast = pyForecasts[personalYearNumber] || 'अनुकूल संख्या गोचर का प्रभाव सक्रिय है।';

  return {
    birthYear: bYear,
    currentAge,
    currentYear: currentCalYear,
    mahadashasList: dashaList,
    currentMahadasha,
    currentAntardasha,
    personalYearNumber,
    personalYearForecast
  };
}
