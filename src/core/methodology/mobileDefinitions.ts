import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES, SourceCitation } from './sourceRegistry';

export interface MobilePairRule {
  pair: string;
  meaning: string;
  positive: string;
  negative: string;
  career: string;
  wealth: string;
  relationship: string;
  wellness: string;
  area: 'Wealth' | 'Career' | 'Relationships' | 'Health' | 'Spiritual' | 'General';
  severity: number;
  source: SourceCitation;
}

export interface MobilePositionalMeaning {
  position: number | string;
  name: string;
  domain: string;
  influence: string;
  guideline: string;
  source: SourceCitation;
}

export interface MobileCompoundClassification {
  compound: number;
  root: number;
  title: string;
  rating: 'EXCELLENT' | 'GOOD' | 'OK' | 'CAN GO' | 'AVOID';
  meaning: string;
  suitability: string;
  caution: string;
  source: SourceCitation;
}

export interface ProfessionNumberMapping {
  profession: string;
  numbers: string;
  requiredDigits: number[];
  description: string;
  source: SourceCitation;
}

export interface SpecialPinCombination {
  purpose: string;
  numbers: string[];
  description: string;
  source: SourceCitation;
}

export interface RepeatedDigitHealthCaution {
  digit: number;
  threshold: string;
  minCount: number;
  traditionalHealthIssues: string[];
  traditionalCautionHindi: string;
  source: SourceCitation;
}

// 1. Positional Meanings as defined in LeoFamily Course Day 4
export const MOBILE_POSITIONS: Record<string, MobilePositionalMeaning> = {
  '1': {
    position: 1,
    name: 'प्रथम स्थान: दृष्टिकोण और पहल (Attitude & Initiatives)',
    domain: 'दृष्टिकोण, जीवन के प्रति नजरिया, नई शुरुआत और पहली पहल',
    influence: 'मोबाइल का पहला अंक दर्शाता है कि आप जीवन में चीजों की शुरुआत कैसे करते हैं। मजबूत अंक आत्मविश्वास और नए उद्यम शुरू करने की क्षमता देता है।',
    guideline: 'सकारात्मक अंक आत्मविश्वास और दृढ़ संकल्प को बढ़ाते हैं; कमजोर अंक आलस्य या देरी का कारण बन सकते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 1 }
  },
  '2': {
    position: 2,
    name: 'दूसरा स्थान: निर्णय लेना (Decision-Making)',
    domain: 'निर्णय लेने की क्षमता, स्पष्टता व आत्मविश्वास',
    influence: 'यह स्थिति बताती है कि जीवन में निर्णय सकारात्मकता की ओर झुकते हैं या नकारात्मकता की ओर। सामंजस्यपूर्ण अंक स्पष्टता और सही विकल्प चुनने में मदद करता है।',
    guideline: 'संतुलित अंक स्पष्टता लाता है; असंतुलित अंक भ्रम या आवेग में फैसले करा सकता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 2 }
  },
  '3': {
    position: 3,
    name: 'तीसरा स्थान: स्वास्थ्य और तंदुरुस्ती (Health & Wellness)',
    domain: 'स्वास्थ्य, जीवन शक्ति, प्रतिरक्षा प्रणाली व ऊर्जा स्तर',
    influence: 'तीसरा अंक जीवन शक्ति, लचीलापन और शारीरिक स्वास्थ्य की स्थिरता से जुड़ा है।',
    guideline: 'सहायक अंक तंदुरुस्ती और ऊर्जा देते हैं; चुनौतीपूर्ण अंक स्वास्थ्य के प्रति सतर्क रहने का संकेत देते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 3 }
  },
  '4': {
    position: 4,
    name: 'चतुर्थ भाव: साझेदारियाँ और रिश्ते (Partnerships & Relationships)',
    domain: 'व्यक्तिगत और व्यावसायिक साझेदारियां, टीम वर्क और सहयोग',
    influence: 'यह भाव दर्शाता है कि व्यापारिक गठबंधन और साझेदारियां कितनी सामंजस्यपूर्ण रहेंगी।',
    guideline: 'अनुकूल अंक मजबूत सहयोग और टीम वर्क देते हैं; प्रतिकूल अंक गलतफहमी ला सकते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 4 }
  },
  '5': {
    position: 5,
    name: 'पंचम भाव: बच्चे और परिवार (Children & Family)',
    domain: 'पारिवारिक सुख, बच्चों की भलाई और परिजनों का पालन-पोषण',
    influence: 'पाँचवाँ अंक बच्चों की भलाई और परिवार के साथ गहरे जुड़ाव का प्रतिनिधित्व करता है।',
    guideline: 'सकारात्मक अंक बच्चों के साथ मजबूत बंधन और समग्र पारिवारिक सुख सुनिश्चित करता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 5 }
  },
  '6_7': {
    position: '6+7',
    name: 'छठा और सातवाँ भाव: विवाह और रिश्ते (Marriage & Relationships)',
    domain: 'वैवाहिक स्थिरता, प्रेम, विश्वास और जीवनसाथी से तालमेल',
    influence: 'छठा और सातवाँ भाव वैवाहिक बंधन में स्थिरता, सामंजस्य और प्रेम संबंधों को दर्शाते हैं।',
    guideline: 'सकारात्मक अंक प्रेम, विश्वास और अनुकूलता बढ़ाते हैं; नकारात्मक अंक संवादहीनता से बचने का संकेत देते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 5 }
  },
  '8': {
    position: 8,
    name: 'आठवाँ स्थान: करियर और स्वास्थ्य (Career & Health)',
    domain: 'करियर विकास, पेशेवर सफलता और कार्यक्षमता',
    influence: 'आठवाँ अंक करियर में प्रगति, पेशेवर प्रयासों में सफलता और स्वास्थ्य का संकेत देता है।',
    guideline: 'अनुकूल अंक स्थिर करियर विकास देते हैं; प्रतिकूल अंक ठहराव या बाधाओं से बचने के लिए अनुशासन सिखाते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 6 }
  },
  '9': {
    position: 9,
    name: 'नौवाँ स्थान: जनसंपर्क और सफलता की दिशा (Public Relations & Success Direction)',
    domain: 'सामाजिक प्रतिष्ठा, बाहरी दुनिया से संवाद, करिश्मा और सफलता की दिशा',
    influence: 'नौवाँ अंक दर्शाता है कि आप अपनी ऊर्जा का उपयोग करके बाहरी दुनिया से कैसे जुड़ते हैं।',
    guideline: 'सहायक अंक करिश्मा, मजबूत जनसंपर्क और विकास के अवसरों को बढ़ावा देता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 7 }
  },
  '9_10': {
    position: '9+10',
    name: 'नौवां और दसवां स्थान: धन और लाभ (Wealth & Gains)',
    domain: 'धन संचय, वित्तीय स्थिरता, अंतिम लाभ और प्रचुर अवसर',
    influence: 'नौवें और दसवें अंक का योग वित्तीय लाभ और धन संचय से सीधे संबंधित है।',
    guideline: 'इन स्थानों पर सकारात्मक अंक वित्तीय स्थिरता और प्रचुर अवसरों का आधार बनते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D4, page: 7 }
  }
};

// 2. Centralized Mobile Compound Classification Database (1 to 100 Chart from Day 3 PDF Page 19 / Day 4 PDF Page 9)
export const MOBILE_COMPOUND_DATABASE: Record<number, MobileCompoundClassification> = {
  1: { compound: 1, root: 1, title: 'सूर्य शक्ति (Sun Power)', rating: 'OK', meaning: 'सामान्य सकारात्मक प्रभाव, व्यक्तिगत ऊर्जा का केंद्र।', suitability: 'व्यक्तिगत उपयोग।', caution: 'अहंकार से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  2: { compound: 2, root: 2, title: 'चंद्र शांति (Moon Calm)', rating: 'OK', meaning: 'संवेदनशील ऊर्जा, कल्पनाशीलता।', suitability: 'कला व रचनात्मक कार्य।', caution: 'मूड स्विंग से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  3: { compound: 3, root: 3, title: 'गुरु ज्ञान (Jupiter Wisdom)', rating: 'OK', meaning: 'ज्ञान, शिक्षा और सलाह का प्रभाव।', suitability: 'शिक्षण व परामर्श।', caution: 'अति-बातूनी होने से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  5: { compound: 5, root: 5, title: 'बुध गति (Mercury Agility)', rating: 'OK', meaning: 'व्यापारिक संवाद और त्वरित गति।', suitability: 'व्यापार व वाणिज्य।', caution: 'चंचलता पर नियंत्रण रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  6: { compound: 6, root: 6, title: 'शुक्र आकर्षण (Venus Charm)', rating: 'OK', meaning: 'विलासिता, कला और पारिवारिक प्रेम।', suitability: 'फैशन व लाइफस्टाइल।', caution: 'फिजूलखर्ची से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  10: { compound: 10, root: 1, title: 'The Wheel of Fortune (भाग्य चक्र)', rating: 'OK', meaning: 'मान-सम्मान, उच्च पद, प्रसिद्धि और समाज में तेजी से आगे बढ़ने का उत्तम प्रतीक।', suitability: 'कॉर्पोरेट डायरेक्टर्स, स्टार्टअप फाउंडर्स, राजनेता और स्वतंत्र उद्यमी।', caution: 'अहंकार या अत्यधिक अधिकार जताने की आदत से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  12: { compound: 12, root: 3, title: 'तपस्या चक्र (Sacrifice & Learning)', rating: 'OK', meaning: 'ज्ञानार्जन, बौद्धिक विकास और अनुभव से सीखने का संकेत।', suitability: 'अनुसंधान व शिक्षण।', caution: 'चिंताओं को हावी न होने दें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  14: { compound: 14, root: 5, title: 'The Movement of Assets (व्यापारिक स्थिरता)', rating: 'EXCELLENT', meaning: 'अत्यंत प्रगतिशील व्यापारिक ऊर्जा; मीडिया, संचार, वाणिज्य और त्वरित ट्रेडिंग में श्रेष्ठ सफलता।', suitability: 'व्यापारी, स्टॉक ट्रेडर्स, डिजिटल उद्यमी और पत्रकार।', caution: 'एक साथ कई जोखिम भरे सौदों में पूंजी फंसाने से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  15: { compound: 15, root: 6, title: 'The Magician of Arts (आकर्षण कुलम)', rating: 'EXCELLENT', meaning: 'आकर्षक व्यक्तित्व, विलासिता व ऐश्वर्य का आकर्षण, रचनात्मक समृद्धि और समाज में लोकप्रियता।', suitability: 'लक्जरी ब्रांड्स, कलाकार, अभिनेता, हॉस्पिटैलिटी और सलाहकार।', caution: 'सुख-सुविधाओं और दिखावे पर फिजूलखर्ची पर नियंत्रण रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  16: { compound: 16, root: 7, title: 'The Shattered Citadel (पतन चक्र)', rating: 'CAN GO', meaning: 'अचानक उतार-चढ़ाव या योजनाओं में बदलाव; आध्यात्मिक व गूढ़ ज्ञान के लिए उपयुक्त।', suitability: 'शोधकर्ता, दार्शनिक।', caution: 'अति-आत्मविश्वास से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  19: { compound: 19, root: 1, title: 'The Sovereign Sun (सूर्य प्रताप)', rating: 'EXCELLENT', meaning: 'सर्वोच्च सफलता, अपार जीवन शक्ति, खुशी, प्रतिस्पर्धियों पर विजय और सार्वजनिक प्रतिष्ठा का सूचक।', suitability: 'सीईओ, प्रशासनिक अधिकारी, इनोवेटर्स और जननेता।', caution: 'धीमी गति से काम करने वाले सहयोगियों के प्रति अधीर न हों।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  21: { compound: 21, root: 3, title: 'संवेदनशीलता योग (Sensitivity)', rating: 'OK', meaning: 'रचनात्मकता, संवेदनशीलता और लोगों से जुड़ाव।', suitability: 'सृजनात्मक क्षेत्र।', caution: 'पैसे की बर्बादी से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  23: { compound: 23, root: 5, title: 'The Royal Star of the Lion (सिंह चक्र)', rating: 'EXCELLENT', meaning: 'सर्वोच्च सफलता का वरदान, उच्चाधिकारियों का पूरा सहयोग, सुरक्षा और व्यापारिक विजय।', suitability: 'व्यापारिक दिग्गज, वरिष्ठ सलाहकार, उच्च राजनयिक और कॉर्पोरेट लीडर्स।', caution: 'अंकशास्त्र के सबसे शुभ और सुरक्षित नंबरों में से एक।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  24: { compound: 24, root: 6, title: 'The Fortunate Alliance (सौभाग्य योग)', rating: 'GOOD', meaning: 'उच्च पदस्थ लोगों का सहयोग, सुखद वैवाहिक जीवन, भौतिक ऐश्वर्य और निरंतर धन प्रवाह।', suitability: 'हॉस्पिटैलिटी, फैशन व डिजाइन, फैमिली बिजनेस और क्रिएटिव एजेंसीज।', caution: 'सफलता मिलने पर काम में लापरवाही न आने दें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  25: { compound: 25, root: 7, title: 'गूढ़ ज्ञान योग (Occult & Mystic)', rating: 'OK', meaning: 'गूढ़ विषयों में रुचि, आध्यात्मिक खोज और यात्राएं।', suitability: 'अध्ययन, हीलिंग व शोध।', caution: 'व्यावहारिक बातों की अनदेखी न करें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  28: { compound: 28, root: 1, title: 'The Trusting Soul (विश्वासघात / संघर्ष योग)', rating: 'AVOID', meaning: 'आर्थिक नुकसान की पारंपरिक चेतावनी, गलत लोगों पर अत्यधिक भरोसा और साझेदारी में रुकावटें।', suitability: 'व्यापार हेतु उपयुक्त नहीं माना जाता।', caution: 'बिना सोचे-समझे किसी दस्तावेज पर हस्ताक्षर न करें; साझेदारी में सतर्क रहें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  30: { compound: 30, root: 3, title: 'बौद्धिक विस्तार (Intellectual Growth)', rating: 'OK', meaning: 'ज्ञान, विवेक और बौद्धिक विकास।', suitability: 'शिक्षा व लेखन।', caution: 'आलस्य से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  32: { compound: 32, root: 5, title: 'The Magnetic Communicator (वाक् सिद्धि योग)', rating: 'GOOD', meaning: 'विशाल लोकप्रियता, सम्मोहक संवाद शैली, जनसमूह से जुड़ने की कला और व्यावसायिक चतुराई।', suitability: 'पब्लिक स्पीकर्स, मीडिया एंकर्स, व्यावसायिक वार्ताकार और मार्केटिंग प्रोफेशनल्स।', caution: 'प्रतिष्ठा बनाए रखने के लिए हमेशा सत्य और ईमानदारी का साथ दें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  33: { compound: 33, root: 6, title: 'The Master Healer & Teacher (गुरु-शुक्र संगम योग)', rating: 'EXCELLENT', meaning: 'Jupiter के सर्वोच्च ज्ञान और Venus के प्रेम-सौहार्द का संगम; उच्च आध्यात्मिक व भौतिक सम्मान।', suitability: 'आध्यात्मिक मार्गदर्शक, शिक्षक, परोपकारी और मेडिकल कंसल्टेंट्स।', caution: 'दूसरों की मदद करते हुए अपनी ऊर्जा और स्वास्थ्य का ध्यान रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  37: { compound: 37, root: 1, title: 'The Auspicious Friendship (मित्र लाभ योग)', rating: 'EXCELLENT', meaning: 'मजबूत साझेदारियां, जनता का प्यार, रिश्तों में सफलता और लाभदायक सहयोग।', suitability: 'पार्टनरशिप बिजनेस, रचनात्मक गठबंधन और जनसंपर्क राजदूत।', caution: 'व्यापारिक मामलों में हमेशा लिखित शर्तों का पालन करें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  39: { compound: 39, root: 3, title: 'सक्रिय सेवा योग (Active Service)', rating: 'OK', meaning: 'मेहनती स्वभाव, सामाजिक कार्य, एनजीओ और निरंतर प्रयास।', suitability: 'समाज सेवा, परामर्श व जनहित।', caution: 'अति-श्रम से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  41: { compound: 41, root: 5, title: 'The Sovereign Intelligence (प्रज्ञा चक्र)', rating: 'OK', meaning: 'तीव्र बौद्धिक क्षमता, व्यापार में सफलता और प्रशासनिक नियंत्रण।', suitability: 'तकनीकी उद्योग, मीडिया व विश्लेषण।', caution: 'मानसिक तनाव से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  42: { compound: 42, root: 6, title: 'The Harmonious Home (गृह सुख योग)', rating: 'GOOD', meaning: 'घरेलू शांति, स्थायी धन, मददगार मित्र और सुरुचिपूर्ण जीवनशैली का सुख।', suitability: 'पारिवारिक व्यवसाय, रियल एस्टेट, हॉस्पिटैलिटी और रिटेल प्रबंधन।', caution: 'कागजी कानूनी प्रक्रियाओं में सतर्क रहें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  46: { compound: 46, root: 1, title: 'वैभव चक्र (Prosperous Flow)', rating: 'OK', meaning: 'व्यापारिक समृद्धि, कलात्मक सुरुचि और सामाजिक प्रतिष्ठा।', suitability: 'कला, मीडिया व व्यापार।', caution: 'दिखावे पर नियंत्रण रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  50: { compound: 50, root: 5, title: 'बुध प्रधान संतुलन (Mercurial Balance)', rating: 'GOOD', meaning: 'व्यापारिक चतुरता, यात्राएं, अनुकूलन क्षमता और बौद्धिक संतुलन।', suitability: 'व्यापार, यात्रा व संचार।', caution: 'अति-चंचलता से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  51: { compound: 51, root: 6, title: 'सर्वश्रेष्ठ व्यावसायिक योग (Supreme Business & Prosperity)', rating: 'EXCELLENT', meaning: 'अत्यंत शुभ व्यापारिक ऊर्जा; परीक्षाओं में सफलता, धन प्रवाह, मजबूत संचार और पारिवारिक सुख।', suitability: 'व्यापार, प्रतियोगी परीक्षाएं, कॉर्पोरेट लीडरशिप और स्वतंत्र पेशा।', caution: 'अंकशास्त्र के शीर्षतम शुभ यौगिक अंकों में से एक।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  52: { compound: 52, root: 7, title: 'आध्यात्मिक अन्वेषण (Mystic Insight)', rating: 'OK', meaning: 'गूढ़ विज्ञान, यात्राएं, अंतर्ज्ञान और सीखने की ललक।', suitability: 'शोध व परामर्श।', caution: 'निर्णयों में विलंब से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  55: { compound: 55, root: 1, title: 'The Double Mercury Master (बुध महायोग)', rating: 'EXCELLENT', meaning: 'शानदार संचार कौशल, तीव्र धन प्रवाह, व्यापारिक स्थिरता और बहुमुखी प्रतिभा।', suitability: 'व्यापार, वित्तीय बाजार, मीडिया, मार्केटिंग और कंसल्टेंसी।', caution: 'एक साथ कई दिशाओं में ऊर्जा बिखेरने से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  57: { compound: 57, root: 3, title: 'जनसंपर्क व वक्ता योग (PR & Public Speaker)', rating: 'GOOD', meaning: 'उत्कृष्ट सार्वजनिक वक्ता, अच्छा व्यवसायी, लेखक और जनसंपर्क में सफल।', suitability: 'एचआर (HR), पीआर (PR), लेखक, ज्योतिषी और सलाहकार।', caution: 'अपने विचारों को स्पष्ट और संतुलित रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  59: { compound: 59, root: 5, title: 'तकनीकी व व्यावसायिक स्पष्टता (Technical Sharpness)', rating: 'OK', meaning: 'तेज़ दिमाग, सीधा-सादा व्यवहार, अपार तकनीकी ज्ञान और सफल व्यापार।', suitability: 'इंजीनियरिंग, आईटी व स्वतंत्र व्यवसाय।', caution: 'बातचीत में अत्यधिक तीखेपन से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  60: { compound: 60, root: 6, title: 'शुक्र सौम्यता (Venus Grace)', rating: 'OK', meaning: 'पारिवारिक सुख, शांति, कला और सामाजिक संबंध।', suitability: 'घरेलू व रचनात्मक कार्य।', caution: 'आलस्य न आने दें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  61: { compound: 61, root: 7, title: 'कलात्मक अन्वेषण (Artistic Search)', rating: 'OK', meaning: 'रचनात्मकता, विचारशीलता और कला प्रेम।', suitability: 'कला व लेखन।', caution: 'खर्चों पर ध्यान दें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  64: { compound: 64, root: 1, title: 'व्यावहारिक प्रयास (Practical Effort)', rating: 'OK', meaning: 'मेहनत, व्यावहारिक सोच और नए प्रयोग।', suitability: 'तकनीक व प्रबंधन।', caution: 'स्वास्थ्य का ध्यान रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  66: { compound: 66, root: 3, title: 'पारिवारिक उत्तरदायित्व (Family Care & Luxury)', rating: 'OK', meaning: 'विलासिता, प्रेम और पारिवारिक जिम्मेदारियों को बहुत कुशलता से निभाना।', suitability: 'फैमिली बिजनेस, इंटीरियर, हॉस्पिटैलिटी।', caution: 'भावनात्मक तनाव से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  68: { compound: 68, root: 5, title: 'चिकित्सा व सेवा योग (Hospital & Medical Flow)', rating: 'OK', meaning: 'सर्जन, डॉक्टर और अस्पताल में काम करने वाले लोगों के लिए उपयुक्त।', suitability: 'मेडिकल, सर्जरी, फार्मास्युटिकल।', caution: 'नियमित स्वास्थ्य जांच कराते रहें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  69: { compound: 69, root: 6, title: 'रचनात्मक प्रबंधन (Creative Management)', rating: 'OK', meaning: 'रचनात्मक सोच, उत्कृष्ट प्रबंधन कौशल और योजना निर्माण।', suitability: 'इवेंट मैनेजमेंट, डिजाइनिंग, विवाह योजनाकार।', caution: 'समय प्रबंधन का ध्यान रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  73: { compound: 73, root: 1, title: 'शीर्ष पद व ज्ञान योग (Top Position & Occult)', rating: 'EXCELLENT', meaning: 'संबंधित क्षेत्र में शीर्ष स्थान, वित्तीय सहायता, दृढ़ इरादे और गुप्त विज्ञान में सफलता।', suitability: 'वरिष्ठ अधिकारी, रिसर्चर, प्लास्टिक/मैन्युफैक्चरिंग बिजनेस, सलाहकार।', caution: 'ज्ञान का अहंकार न आने दें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  75: { compound: 75, root: 3, title: 'वक्ता व बौद्धिक प्रतिष्ठा (Speaker & Teacher)', rating: 'OK', meaning: 'अच्छा सार्वजनिक वक्ता, शिक्षक, बैंकर और ज्योतिषी।', suitability: 'शिक्षण, बैंकिंग, जनसंपर्क।', caution: 'नियमित अध्ययन जारी रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  77: { compound: 77, root: 5, title: 'शोधकर्ता व गहन विचारक (Deep Researcher)', rating: 'OK', meaning: 'शोधकर्ता, गहन विश्लेषक और अंतर्मुखी सोच।', suitability: 'अनुसंधान व विश्लेषण।', caution: 'अति-विचार और निराशा से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  78: { compound: 78, root: 6, title: 'आध्यात्मिक उपचारक (Spiritual Healer)', rating: 'OK', meaning: 'आध्यात्मिक उपचार, समाज सेवा और स्वयं के बल पर समस्याओं का समाधान।', suitability: 'हीलिंग, रेकी, फिजियोथेरेपी।', caution: 'सकारात्मक सोच बनाए रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  79: { compound: 79, root: 7, title: 'करियर उतार-चढ़ाव योग (Career Flow)', rating: 'CAN GO', meaning: 'करियर में उतार-चढ़ाव; मेहनत से प्रगति का मार्ग।', suitability: 'स्वतंत्र कार्य।', caution: 'घरेलू शांति बनाए रखें और धैर्य रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  86: { compound: 86, root: 5, title: 'शल्य चिकित्सा व अस्पताल संपर्क (Surgeon & Medical)', rating: 'CAN GO', meaning: 'चिकित्सकों, सर्जनों और अस्पताल से जुड़े लोगों के लिए अनुकूल।', suitability: 'मेडिकल व सेवा क्षेत्र।', caution: 'स्वास्थ्य जागरूकता बनाए रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  91: { compound: 91, root: 1, title: 'उच्च पद व स्वतंत्रता (High Position & Freedom)', rating: 'EXCELLENT', meaning: 'स्वतंत्रता प्रेमी, उच्च शिक्षित, स्वतंत्र कार्यकर्ता और हमेशा उच्च पद पर रहने की क्षमता।', suitability: 'नेता, प्रशासनिक अधिकारी, डॉक्टर, रक्षा सेवा।', caution: 'दूसरों के साथ तालमेल बनाए रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  93: { compound: 93, root: 3, title: 'सक्रिय कर्मठता (Active & Hardworking)', rating: 'OK', meaning: 'सक्रिय, बुद्धिमान, मेहनती और समाज सेवा में रुचि।', suitability: 'एनजीओ, सामाजिक कार्य, प्रबंधन।', caution: 'कार्यभार को संतुलित करें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  95: { compound: 95, root: 5, title: 'तकनीकी दक्षता (Technical Mastery)', rating: 'OK', meaning: 'तेज़ दिमाग, सीधा-सादा व्यवहार, अपार तकनीकी ज्ञान और सफल व्यापार।', suitability: 'आईटी, इंजीनियरिंग व व्यापार।', caution: 'कटु वाणी से बचें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  97: { compound: 97, root: 7, title: 'शोध व अंतर्दृष्टि (Research & Insight)', rating: 'GOOD', meaning: 'गहन चिंतन, शोध क्षमता और स्वतंत्र सोच।', suitability: 'विश्लेषण, अनुसंधान।', caution: 'करियर में निरंतरता बनाए रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } },
  100: { compound: 100, root: 1, title: 'पूर्णता व प्रतिष्ठा (Completeness & Honor)', rating: 'GOOD', meaning: 'पूर्ण चक्र, नई शुरुआत, मान-प्रतिष्ठा और नेतृत्व क्षमता।', suitability: 'प्रशासन, लीडरशिप।', caution: 'सकारात्मक दृष्टिकोण बनाए रखें।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 } }
};

// Fallback helper for compound database
export function getMobileCompoundData(compound: number): MobileCompoundClassification {
  if (MOBILE_COMPOUND_DATABASE[compound]) {
    return MOBILE_COMPOUND_DATABASE[compound];
  }
  const root = compound % 9 === 0 ? 9 : compound % 9;
  return {
    compound,
    root,
    title: `यौगिक संख्या ${compound} (Root ${root})`,
    rating: (root === 1 || root === 5 || root === 6 || root === 3) ? 'OK' : 'CAN GO',
    meaning: `इस यौगिक अंक ${compound} का मूलांक ${root} है, जो जीवन में निरंतर प्रयास और विकास को दर्शाता है।`,
    suitability: 'दैनिक संचार एवं व्यक्तिगत उपयोग।',
    caution: 'संतुलित दृष्टिकोण और नियमित कार्यों में निरंतरता बनाए रखें।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D3, page: 19 }
  };
}

// 3. Complete Adjacent Pair Meanings Database from Day 1 to Day 4 PDFs
export const MOBILE_PAIR_DATABASE: Record<string, MobilePairRule> = {
  '11': {
    pair: '11',
    meaning: 'नेतृत्व और अधिकार (Leadership & Authority)',
    positive: 'आत्मविश्वास, प्रशासनिक क्षमता, पहल करने की शक्ति और मान-प्रतिष्ठा।',
    negative: 'अहंकार, चिड़चिड़ापन, समायोजन की कमी।',
    career: 'उच्च प्रशासनिक पद, स्वतंत्र व्यवसाय, लीडरशिप रोल के लिए अनुकूल।',
    wealth: 'स्वतंत्र रूप से धन कमाने की अच्छी क्षमता।',
    relationship: 'पारस्परिक सम्मान और बौद्धिक स्वतंत्रता की अपेक्षा रखते हैं।',
    wellness: 'तनाव और उच्च रक्तचाप से बचने के लिए ध्यान करें।',
    area: 'Career',
    severity: 85,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D2, page: 2 }
  },
  '12': {
    pair: '12',
    meaning: 'पैसा बचाने वाला व्यक्ति (Money Saving Person)',
    positive: 'शिक्षित और आर्थिक रूप से स्थिर, आकर्षक चेहरा और मददगार जीवनसाथी।',
    negative: 'संवाद में कभी-कभी अत्यधिक संकोच या संवेदनशीलता।',
    career: 'शिक्षा, वित्त, काउंसलिंग और जनसंपर्क में अनुकूल।',
    wealth: 'धन की अच्छी बचत और आर्थिक स्थिरता का योग।',
    relationship: 'मददगार और आकर्षक जीवनसाथी का साथ मिलता है।',
    wellness: 'मानसिक शांति के लिए जल का समुचित सेवन करें।',
    area: 'Wealth',
    severity: 85,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 3 }
  },
  '21': {
    pair: '21',
    meaning: 'संवेदनशील एवं पैसे की बर्बादी (Sensitive & Waste of Money)',
    positive: 'रचनात्मकता, कलात्मक सोच और गहरी संवेदनशीलता।',
    negative: 'पैसे की बर्बादी, भावनात्मक उतार-चढ़ाव और फिजूलखर्ची।',
    career: 'कला, संगीत, डिजाइनिंग में अच्छा; वित्तीय मामलों में सतर्कता आवश्यक।',
    wealth: 'पैसे का बेवजह खर्च या नुकसान हो सकता है; बजट बनाकर चलें।',
    relationship: 'रिश्तों में अत्यधिक भावुक होने से बचें।',
    wellness: 'मूड स्विंग्स और तनाव से बचने के लिए योग करें।',
    area: 'Wealth',
    severity: 40,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  '13': {
    pair: '13',
    meaning: 'प्रतिष्ठित कार्य एवं उच्च सम्मान (Reputed Work & Education)',
    positive: 'व्यक्ति की शिक्षा अच्छी होती है और वह प्रतिष्ठित कार्य करता है। स्वास्थ्य और वैवाहिक जीवन अच्छा, सिविल सेवा में कार्यरत।',
    negative: 'अति-उपदेशात्मक स्वभाव या वरिष्ठों से मतभेद।',
    career: 'सिविल सर्विसेज, शिक्षा, प्रशासनिक सलाहकार और कानूनी क्षेत्र।',
    wealth: 'बौद्धिक योग्यता और प्रतिष्ठा से निरंतर धन लाभ।',
    relationship: 'सुखद वैवाहिक जीवन और पारिवारिक मर्यादा का सम्मान।',
    wellness: 'उत्तम स्वास्थ्य और सकारात्मक जीवन शक्ति।',
    area: 'Career',
    severity: 92,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  '31': {
    pair: '31',
    meaning: 'शिक्षा, प्रतिष्ठा एवं सरकारी योग (Education & Civil Services)',
    positive: 'अपने क्षेत्र में प्रतिष्ठित और लोकप्रिय/विशेष, अधिकांशतः सिविल सेवा में कार्यरत, उत्तम स्वास्थ्य।',
    negative: 'विचारों में कठोरता और दूसरों की राय सुनने में हिचकिचाहट।',
    career: 'सिविल सेवा, शिक्षक, न्यायाधीश, वकील, प्रतिष्ठित सरकारी पद।',
    wealth: 'सम्मानजनक पदों और ज्ञान के माध्यम से स्थायी धन संचय।',
    relationship: 'पारिवारिक मर्यादा और आपसी सम्मान को महत्व देते हैं।',
    wellness: 'सकारात्मक दृष्टिकोण और उत्तम मानसिक स्पष्टता।',
    area: 'Career',
    severity: 92,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  '14': {
    pair: '14',
    meaning: 'गुप्त शत्रु, बदनामी एवं धन हानि (Secret Enemies & Defame)',
    positive: 'अपरंपरागत सोच, लीक से हटकर त्वरित रणनीति।',
    negative: 'गुप्त शत्रु, बदनामी, धन हानि, ऋण, कानूनी नोटिस, स्वास्थ्य समस्याएँ।',
    career: 'अचानक रुकावटें या कानूनी विवाद; सतर्कता आवश्यक।',
    wealth: 'पैसे का अप्रत्याशित नुकसान या कर्ज का बोझ हो सकता है।',
    relationship: 'रिश्तों में गलतफहमी और बदनामी से सावधान रहें।',
    wellness: 'सिरदर्द और तनाव की संभावना; नियमित प्राणायाम करें।',
    area: 'Career',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  '41': {
    pair: '41',
    meaning: 'ऋण, कानूनी नोटिस एवं स्वास्थ्य समस्याएँ (Loan & Legal Notice)',
    positive: 'तीव्र तार्किक सोच और तकनीकी क्षमता।',
    negative: 'गुप्त शत्रु, बदनामी और धन हानि, ऋण, कानूनी नोटिस, स्वास्थ्य समस्याएँ।',
    career: 'सरकारी नोटिस या अचानक कार्यस्थल पर बाधाएँ संभव।',
    wealth: 'अचानक धन की हानि या फंसे हुए पैसे की समस्या।',
    relationship: 'पारिवारिक और सामाजिक प्रतिष्ठा की रक्षा करें।',
    wellness: 'स्वास्थ्य के प्रति नियमित सजगता बनाए रखें।',
    area: 'Wealth',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  '15': {
    pair: '15',
    meaning: 'परीक्षाओं में सफलता व पिता का सहयोग (Exam Success & Father Support)',
    positive: 'परीक्षाओं में सफल, पिता का भरपूर सहयोग, विवाह में मददगार।',
    negative: 'अति-सक्रिय मन, समय पर फैसले न लेना।',
    career: 'प्रतियोगी परीक्षाएं, व्यापार, वाणिज्य और रणनीतिक पद।',
    wealth: 'व्यापारिक सूझबूझ से धन लाभ और पिता से सहयोग।',
    relationship: 'विवाह में सहायक और रिश्तों में मधुरता।',
    wellness: 'सक्रिय और ऊर्जावान स्वास्थ्य।',
    area: 'Career',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '51': {
    pair: '51',
    meaning: 'सफलता, सहयोग एवं विवाह में सहायक (Success & Marriage Help)',
    positive: 'परीक्षाओं में सफलता, पिता का सहयोग, विवाह में मददगार, तेज व्यापारिक बुद्धि।',
    negative: 'अति-चंचलता से बचें।',
    career: 'व्यापार, प्रशासनिक प्रबंधन और प्रतियोगी परीक्षाओं में श्रेष्ठ।',
    wealth: 'प्रचुर धन लाभ और तेजी से आगे बढ़ने के अवसर।',
    relationship: 'वैवाहिक सुख और पारिवारिक सहयोग में सहायक।',
    wellness: 'उत्तम मानसिक संतुलन और सकारात्मक ऊर्जा।',
    area: 'Career',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '16': {
    pair: '16',
    meaning: 'धन व नौकरी का नुकसान (Money & Job Loss / Health Caution)',
    positive: 'कलात्मक दृष्टि और सौंदर्य प्रेम।',
    negative: 'धन और नौकरी का नुकसान, मूत्रमार्ग संबंधी समस्याएँ या बवासीर, जीवनसाथी को स्वास्थ्य समस्या।',
    career: 'नौकरी या व्यवसाय में अचानक बाधा या नुकसान का जोखिम।',
    wealth: 'पैसे का रिसाव और अप्रत्याशित खर्च।',
    relationship: 'जीवनसाथी के स्वास्थ्य का विशेष ध्यान रखें।',
    wellness: 'मूत्रमार्ग या बवासीर से जुड़ी पारंपरिक सावधानी रखें।',
    area: 'Wealth',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '61': {
    pair: '61',
    meaning: 'नौकरी हानि एवं स्वास्थ्य सावधानी (Job Loss & Health Caution)',
    positive: 'विलासिता प्रिय और सुरुचिपूर्ण व्यक्तित्व।',
    negative: 'धन और नौकरी का नुकसान, मूत्रमार्ग संबंधी समस्याएँ या बवासीर, जीवनसाथी को स्वास्थ्य समस्या।',
    career: 'कार्यक्षेत्र में अचानक बदलाव या असुरक्षा की स्थिति।',
    wealth: 'वित्तीय घाटे से बचने के लिए सतर्कता आवश्यक।',
    relationship: 'वैवाहिक जीवन में एक-दूसरे के स्वास्थ्य का ख्याल रखें।',
    wellness: 'खान-पान में स्वच्छता और पर्याप्त जल का सेवन करें।',
    area: 'Wealth',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '17': {
    pair: '17',
    meaning: 'सरकार से जुड़ाव एवं नेतृत्व गुण (Govt Connection & Leadership)',
    positive: 'सरकार से जुड़ाव, नेतृत्व गुण, अच्छे संपर्क, राजनीति व प्रशासनिक कार्यों में सहायक।',
    negative: 'सहकर्मियों से दूरी या एकाकीपन।',
    career: 'सरकारी नौकरी, राजनीति, न्यायाधीश, वकील, हीलर व प्रशासक।',
    wealth: 'सरकारी संपर्कों और प्रतिष्ठा से लाभ।',
    relationship: 'मर्यादित और सम्मानजनक रिश्ते।',
    wellness: 'स्वस्थ और अनुशासित दिनचर्या।',
    area: 'Career',
    severity: 90,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '71': {
    pair: '71',
    meaning: 'सरकारी संपर्क एवं नेतृत्व (Govt Connection & Leadership)',
    positive: 'सरकार से मजबूत जुड़ाव, नेतृत्व गुण, प्रभावशाली सामाजिक संपर्क।',
    negative: 'कभी-कभी अचानक विरक्ति या हठ।',
    career: 'प्रशासनिक सेवा, जनसंपर्क, राजनीति और परामर्श।',
    wealth: 'स्थिर और प्रतिष्ठित स्रोतों से धन लाभ।',
    relationship: 'सम्मान और विश्वास पर आधारित संबंध।',
    wellness: 'आंतरिक शांति और नियमित योग।',
    area: 'Career',
    severity: 90,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '18': {
    pair: '18',
    meaning: 'पिता से मतभेद एवं नौकरी में बदलाव (Father Differences & Job Change)',
    positive: 'कड़ी मेहनत और सहनशक्ति।',
    negative: 'पिता के निधन की संभावना / पिता से जुड़ी समस्याएँ, पिता-पुत्र में समझ की कमी, सरकार से जुड़े मुद्दे, बार-बार नौकरी बदलने की ज़रूरत।',
    career: 'बार-बार नौकरी बदलने की स्थिति या वरिष्ठों से मतभेद।',
    wealth: 'वित्तीय स्थिरता में देरी; सरकारी कार्यों में रुकावटें।',
    relationship: 'पिता और पुत्र एक-दूसरे को समझने में कठिनाई महसूस करते हैं।',
    wellness: 'तनाव और हड्डियों के स्वास्थ्य पर ध्यान दें।',
    area: 'Career',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '81': {
    pair: '81',
    meaning: 'प्रशासनिक विलंब व पिता से मतभेद (Govt Issues & Father Strain)',
    positive: 'अनुशासन और कर्मठता।',
    negative: 'पिता से जुड़ी समस्याएँ, पिता और पुत्र के बीच अनबन, सरकार से जुड़े मुद्दे, बार-बार नौकरी बदलना।',
    career: 'करियर में स्थिरता पाने के लिए अतिरिक्त धैर्य की आवश्यकता।',
    wealth: 'सरकारी कागजी प्रक्रियाओं में सतर्कता रखें।',
    relationship: 'पारिवारिक बड़ों के प्रति आदर और संवाद बनाए रखें।',
    wellness: 'मानसिक तनाव से बचें; शनि-सूर्य शांति हेतु उपाय करें।',
    area: 'Career',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 5 }
  },
  '19': {
    pair: '19',
    meaning: 'स्वतंत्रता प्रेमी व हमेशा उच्च पद (Freedom Lover & High Place)',
    positive: 'स्वतंत्रता प्रेमी, उच्च शिक्षित, स्वतंत्र कार्यकर्ता, हमेशा उच्च पद पर रहने की क्षमता।',
    negative: 'क्रोध और अधीरता पर नियंत्रण आवश्यक।',
    career: 'डॉक्टर, इंजीनियर, राजनेता, सेना, पुलिस, उच्च प्रशासनिक अधिकारी।',
    wealth: 'प्रचुर धन लाभ और स्वतंत्र व्यापार से समृद्धि।',
    relationship: 'आत्म-सम्मान को सर्वोपरि मानते हैं।',
    wellness: 'अत्यधिक ऊर्जावान और साहसी।',
    area: 'Career',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 6 }
  },
  '91': {
    pair: '91',
    meaning: 'उच्च शिक्षित एवं स्वतंत्र कार्यकर्ता (Highly Educated & High Place)',
    positive: 'स्वतंत्रता प्रेमी, उच्च शिक्षित, स्वतंत्र कार्यकर्ता, हमेशा उच्च पद पर।',
    negative: 'जल्दबाजी और अधिकार जताने की प्रवृत्ति।',
    career: 'नेतृत्व के पद, स्वतंत्र उद्यमिता, रक्षा सेवाएं और उच्च प्रबंधन।',
    wealth: 'मजबूत आर्थिक स्थिति और निरंतर प्रगति।',
    relationship: 'सुरक्षात्मक और समर्पित साथी।',
    wellness: 'नियमित व्यायाम और शांत चित्त बनाए रखें।',
    area: 'Career',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 6 }
  },
  '23': {
    pair: '23',
    meaning: 'शत्रुओं पर विजय व उच्च पद (Win Over Enemies & High Place)',
    positive: 'वे अपने शत्रुओं पर विजय प्राप्त करेंगे, हमेशा उच्च पद पर रहेंगे।',
    negative: 'अतिरिक्त वैवाहिक संबंध, संतान सुख में कमी / संतान संबंधी दुःख।',
    career: 'उच्च प्रबंधन, प्रतिस्पर्धी व्यापार और नेतृत्वकारी भूमिकाएं।',
    wealth: 'शत्रुओं और प्रतिस्पर्धियों को पछाड़कर धनार्जन।',
    relationship: 'अतिरिक्त वैवाहिक आकर्षणों से बचें; पारिवारिक निष्ठा रखें।',
    wellness: 'संतान पक्ष से संबंधित स्वास्थ्य चिंता का ध्यान रखें।',
    area: 'Career',
    severity: 70,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 6 }
  },
  '32': {
    pair: '32',
    meaning: 'शत्रु विजय एवं वैवाहिक सावधानी (Victory Over Foes & High Place)',
    positive: 'शत्रुओं पर विजय, हमेशा उच्च पद, तार्किक और बौद्धिक प्रभाव।',
    negative: 'अतिरिक्त वैवाहिक संबंध, संतान सुख की कमी या संतान संबंधी चिंता।',
    career: 'उच्च प्रशासनिक पद, परामर्श और प्रतिस्पर्धी क्षेत्र।',
    wealth: 'निरंतर धन प्रवाह और व्यावसायिक सफलता।',
    relationship: 'वैवाहिक मर्यादा और निष्ठा का पालन करें।',
    wellness: 'पारिवारिक स्वास्थ्य पर ध्यान दें।',
    area: 'Career',
    severity: 70,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 6 }
  },
  '24': {
    pair: '24',
    meaning: 'अवसाद, मूडी एवं 24 घंटे दिमाग चलना (Depression & Moody Thoughts)',
    positive: 'तीव्र बौद्धिक सक्रियता, रात-दिन काम करने की क्षमता।',
    negative: 'अवसाद, मूडी, नकारात्मक विचार, अपराधी मानसिकता, 24 घंटे दिमाग काम करता है।',
    career: 'कुछ हासिल करने के लिए धैर्य रखना आवश्यक है।',
    wealth: 'अस्थिर और जल्दबाजी में किए गए निवेश से बचें।',
    relationship: 'मूड स्विंग्स के कारण रिश्तों में खिंचाव संभव।',
    wellness: 'मानसिक अवसाद और अनिद्रा से बचने के लिए ध्यान और विश्राम करें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 7 }
  },
  '42': {
    pair: '42',
    meaning: 'नकारात्मक विचार एवं मानसिक बेचैनी (Moody & Over-Active Mind)',
    positive: 'जटिल समस्याओं का विश्लेषण।',
    negative: 'अवसाद, मूडी, नकारात्मक विचार, 24 घंटे दिमाग काम करना, धैर्य की कमी।',
    career: 'धैर्य रखकर ही सफलता प्राप्त की जा सकती है।',
    wealth: 'अनियोजित खर्चों पर नियंत्रण रखें।',
    relationship: 'संवाद में मधुरता रखें और नकारात्मक विचारों से बचें।',
    wellness: 'मानसिक शांति हेतु चांदी के गिलास में जल पिएं।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 7 }
  },
  '25': {
    pair: '25',
    meaning: 'गुप्त विज्ञान में रुचि व हवाई यात्रा (Occult Science & Air Travel)',
    positive: 'गुप्त विज्ञान में रुचि, जादुई शक्तियों से संपन्न, हाथ में उपचार (Healing in hand), हवाई यात्रा।',
    negative: 'अति-काल्पनिक सोच या यथार्थ से दूर होना।',
    career: 'गूढ़ विद्या, ऑकल्ट साइंस, हीलिंग, यात्रा व पर्यटन।',
    wealth: 'विशिष्ट ज्ञान और विदेशी यात्राओं से लाभ।',
    relationship: 'सहानुभूतिपूर्ण और आध्यात्मिक साथी।',
    wellness: 'प्राकृतिक हीलिंग क्षमता और स्वस्थ अंतर्ज्ञान।',
    area: 'Spiritual',
    severity: 88,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 7 }
  },
  '52': {
    pair: '52',
    meaning: 'हाथ में उपचार एवं यात्रा योग (Healing Hands & Air Travel)',
    positive: 'गुप्त विज्ञान में रुचि, जादुई शक्तियां, हाथ में उपचार, हवाई यात्रा के अवसर।',
    negative: 'विचारों में अत्यधिक विचलन।',
    career: 'हीलर, ज्योतिषी, ट्रैवल एजेंसी, अंतरराष्ट्रीय व्यापार।',
    wealth: 'परामर्श और गूढ़ सेवाओं से अच्छा धन लाभ।',
    relationship: 'गहरे और आध्यात्मिक संबंध पसंद करते हैं।',
    wellness: 'सकारात्मक ऊर्जा का प्रवाह।',
    area: 'Spiritual',
    severity: 88,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 7 }
  },
  '26': {
    pair: '26',
    meaning: 'शिक्षा में बाधा एवं सास से समस्या (Education Obstruction & In-Law Issues)',
    positive: 'अत्यधिक प्रभावशाली संवाद क्षमता (Super convincing power)।',
    negative: 'शिक्षा में बाधा, महिला: सास से समस्याएँ, पुरुष: धन के पीछे भागना / शुक्राणुओं की कमी, प्रसव समस्याएँ, दूसरी शादी की संभावना।',
    career: 'उत्कृष्ट कन्वेंसिंग पावर; शिक्षा में शुरुआती रुकावटें।',
    wealth: 'पैसा कमाने की तीव्र ललक।',
    relationship: 'महिला हो तो सास से मतभेद, वैवाहिक जीवन में दूसरी शादी या प्रसव संबंधी चिंता।',
    wellness: 'प्रजनन स्वास्थ्य और प्रसव संबंधी पारंपरिक सावधानी रखें।',
    area: 'Relationships',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 8 }
  },
  '62': {
    pair: '62',
    meaning: 'प्रभावशाली वाणी व वैवाहिक घर्षण (Super Convincing & Marital Friction)',
    positive: 'अत्यधिक प्रभावशाली (Super convincing power), आकर्षण।',
    negative: 'शिक्षा में बाधा, सास से समस्याएँ, पुरुषों में शुक्राणुओं की कमी, प्रसव समस्याएँ, दूसरी शादी के योग।',
    career: 'मार्केटिंग और कन्वेंसिंग में आगे; पढ़ाई में बाधाएं संभव।',
    wealth: 'धन के पीछे भागने की प्रवृत्ति।',
    relationship: 'ससुराल पक्ष से सामंजस्य बनाने की आवश्यकता।',
    wellness: 'प्रजनन स्वास्थ्य और तनाव पर ध्यान दें।',
    area: 'Relationships',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 8 }
  },
  '27': {
    pair: '27',
    meaning: 'जोड़ों का दर्द व पेशे में समस्याएँ (Joint Pains & Money of No Use)',
    positive: 'सहज ज्ञान (Intuitive powers)।',
    negative: 'जोड़ों का दर्द, पेशे में समस्याएँ, मूत्र रोग, आपको पैसा तो मिलेगा लेकिन किसी काम का नहीं।',
    career: 'पेशे में बार-बार बाधाएं या असंतोष की स्थिति।',
    wealth: 'पैसा आने के बावजूद उपयोगी न होना या व्यर्थ खर्च होना।',
    relationship: 'भावनात्मक अलगाव से बचें।',
    wellness: 'जोड़ों के दर्द और मूत्र संबंधी रोगों से पारंपरिक बचाव रखें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 8 }
  },
  '72': {
    pair: '72',
    meaning: 'सहज ज्ञान एवं स्वास्थ्य सावधानी (Intuitive Powers & Joint Issues)',
    positive: 'सहज ज्ञान (Intuitive powers) और सूक्ष्म समझ।',
    negative: 'जोड़ों का दर्द, पेशे में समस्याएँ, मूत्र रोग, पैसा किसी काम न आना।',
    career: 'करियर में स्थिरता हेतु निरंतर प्रयास आवश्यक।',
    wealth: 'पैसा सही जगह निवेश करें ताकि व्यर्थ न जाए।',
    relationship: 'रिश्तों में स्पष्टता और विश्वास रखें।',
    wellness: 'जोड़ों की मालिश और पर्याप्त जल का सेवन करें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 8 }
  },
  '28': {
    pair: '28',
    meaning: 'अच्छे कर्मों से धन व अस्पताल खर्च (Karma Wealth & Hospital Expenses)',
    positive: 'अच्छे कर्मों से धन की प्राप्ति होती है।',
    negative: 'अनुचित साझेदारी - हानि, अवसाद / मानसिक विकार / आत्महत्या की प्रवृत्ति, पैसे, दवा और अस्पताल पर खर्च, परिवार में दो शादियाँ, घर में सीलन या रिसाव।',
    career: 'साझेदारी में बड़ा नुकसान; अकेले काम करना बेहतर।',
    wealth: 'धन केवल सत्कर्मों से टिकता है; अस्पताल और दवाइयों पर खर्च का जोखिम।',
    relationship: 'परिवार में दो शादियों के योग (जैसे एक ही परिवार में दो बहनें या एक व्यक्ति की दो शादियाँ)।',
    wellness: 'अवसाद, मानसिक विकार और घर में सीलन/रिसाव से बचाव रखें।',
    area: 'Health',
    severity: 25,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 9 }
  },
  '82': {
    pair: '82',
    meaning: 'साझेदारी हानि एवं मानसिक तनाव (Partnership Loss & Seelan in House)',
    positive: 'सत्कर्मों द्वारा धन लाभ।',
    negative: 'साझेदारी में हानि, अवसाद, दवा व अस्पताल खर्च, घर में सीलन या रिसाव, दो शादियों के योग।',
    career: 'पार्टनरशिप बिजनेस से पूरी तरह बचें।',
    wealth: 'अनावश्यक दवा और अस्पताल खर्चों से बचने के लिए दान-पुण्य करें।',
    relationship: 'पारिवारिक रिश्तों में धैर्य और विश्वास रखें।',
    wellness: 'मानसिक स्वास्थ्य और घर के जल रिसाव को तुरंत ठीक कराएं।',
    area: 'Health',
    severity: 25,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 9 }
  },
  '29': {
    pair: '29',
    meaning: 'बहुत अच्छी वित्तीय स्थिति व स्व-अर्जित धन (Very Good Financial Status)',
    positive: 'बहुत अच्छी वित्तीय स्थिति, स्व-अर्जित धन, धन से जुड़ाव (बैंक / खाते / वेतन प्रबंधन / बीमा)।',
    negative: 'मानसिक चंचलता या काम का भारी दबाव।',
    career: 'बैंकिंग, अकाउंट्स, वेतन प्रबंधन, बीमा और वित्तीय संस्थान।',
    wealth: 'उत्कृष्ट वित्तीय स्थिति और अपनी मेहनत से कमाया हुआ धन।',
    relationship: 'परिवार को आर्थिक सुरक्षा प्रदान करते हैं।',
    wellness: 'स्वस्थ और सक्रिय जीवनशैली।',
    area: 'Wealth',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 9 }
  },
  '92': {
    pair: '92',
    meaning: 'स्व-अर्जित धन एवं वित्तीय मजबूती (Self-Earned Money & Banking)',
    positive: 'बहुत अच्छी वित्तीय स्थिति, स्व-अर्जित धन, बैंक / खाता / वेतन प्रबंधन / बीमा से जुड़ाव।',
    negative: 'कार्यस्थल पर अत्यधिक व्यस्तता।',
    career: 'बैंकिंग, वित्तीय विश्लेषक, बीमा अधिकारी, अकाउंटेंट।',
    wealth: 'स्व-अर्जित धन का प्रचुर प्रवाह और आर्थिक संपन्नता।',
    relationship: 'जिम्मेदार और भरोसेमंद जीवनसाथी।',
    wellness: 'सकारात्मक दृष्टिकोण और मानसिक मजबूती।',
    area: 'Wealth',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 9 }
  },
  '34': {
    pair: '34',
    meaning: 'माता-पिता से दूरी व स्वास्थ्य सावधानी (Child Away from Parents)',
    positive: 'अपरंपरागत सोच और स्वतंत्र जीवनशैली।',
    negative: 'बच्चा माता-पिता के साथ नहीं रहेगा, साँस लेने में तकलीफ, हृदय संबंधी बीमारियाँ / पैरों में कंपकंपी / लकवा, परिवार में किसी को लकवा, आत्मविश्वास में कमी, ज़िद्दी।',
    career: 'माता-पिता से दूर रहकर कार्य करने के योग।',
    wealth: 'वित्तीय फैसलों में अतिरिक्त आत्मविश्वास की आवश्यकता।',
    relationship: 'संतान का माता-पिता से दूर रहना या हठ की स्थिति।',
    wellness: 'साँस, हृदय और पैरों की कंपन/लकवे से जुड़ी पारंपरिक सावधानी रखें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 10 }
  },
  '43': {
    pair: '43',
    meaning: 'हठ, साँस संबंधी तकलीफ व दूरी (Stubborn & Distance from Family)',
    positive: 'कठिन परिस्थितियों में जूझने का जज्बा।',
    negative: 'बच्चा माता-पिता से दूर, साँस की तकलीफ, हृदय रोग, पैरों में कंपकंपी/लकवा, कम आत्मविश्वास, ज़िद्दी।',
    career: 'घर से दूर कार्यक्षेत्र में सफलता।',
    wealth: 'आत्मविश्वास से वित्तीय स्थिति सुधरती है।',
    relationship: 'पारिवारिक दूरियों को संवाद से कम करें।',
    wellness: 'नियमित प्राणायाम करें और फेफड़ों व पैरों का ध्यान रखें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 10 }
  },
  '35': {
    pair: '35',
    meaning: 'बुद्धिमान व्यक्ति (Intelligent Person)',
    positive: 'बुद्धिमान, तीव्र सोच, ज्ञान का सदुपयोग।',
    negative: 'पहले भाव से दूर रहें (Stay away from first house)।',
    career: 'शिक्षा, बौद्धिक परामर्श, व्यापार और योजना निर्माण।',
    wealth: 'बुद्धिमानी से धन संचय।',
    relationship: 'बौद्धिक संवाद पसंद करते हैं।',
    wellness: 'उत्तम मानसिक संतुलन।',
    area: 'Career',
    severity: 85,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 10 }
  },
  '53': {
    pair: '53',
    meaning: 'तीव्र बुद्धि एवं समझदारी (Intelligent Mind)',
    positive: 'बुद्धिमान, तार्किक क्षमता, व्यापारिक समझ।',
    negative: 'पहले भाव से दूर रहें।',
    career: 'सलाहकार, व्यापार, शिक्षा।',
    wealth: 'बौद्धिक योग्यता से लाभ।',
    relationship: 'पारिवारिक तालमेल बनाए रखें।',
    wellness: 'सकारात्मक सोच।',
    area: 'Career',
    severity: 85,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 10 }
  },
  '36': {
    pair: '36',
    meaning: 'बहु-प्रतिभाशाली एवं धार्मिक (Multi-Talented & Religious)',
    positive: 'बहु-प्रतिभाशाली, धार्मिक, दृष्टिकोण और आत्म-सम्मान महत्वपूर्ण है, अच्छा ज्ञान, कठोर नियमों और विनियमों का पालन करता है।',
    negative: 'नियमों को लेकर अत्यधिक कठोरता।',
    career: 'शिक्षक, मार्गदर्शक, कानूनी सलाहकार, धार्मिक व सामाजिक संस्थाएं।',
    wealth: 'नैतिक और ज्ञान आधारित कार्यों से स्थिर धनार्जन।',
    relationship: 'आत्म-सम्मान को सर्वोपरि मानते हैं; निष्ठावान साथी।',
    wellness: 'अनुशासित जीवनशैली और मानसिक शांति।',
    area: 'Career',
    severity: 90,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 11 }
  },
  '63': {
    pair: '63',
    meaning: 'आत्म-सम्मान व कठोर नियम (Self-Respect & Multi-Talented)',
    positive: 'बहु-प्रतिभाशाली, धार्मिक, आत्म-सम्मान, अच्छा ज्ञान, कड़े नियमों का पालन।',
    negative: 'सिद्धांतों को लेकर अत्यधिक समझौता न करने की आदत।',
    career: 'प्रबंधन, शिक्षा, सलाहकार और सांस्कृतिक क्षेत्र।',
    wealth: 'ज्ञान और प्रतिष्ठा से समृद्धि।',
    relationship: 'मर्यादित और नैतिक रिश्ते।',
    wellness: 'सकारात्मक आध्यात्मिक ऊर्जा।',
    area: 'Career',
    severity: 90,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 11 }
  },
  '37': {
    pair: '37',
    meaning: 'शीर्ष स्थान एवं वित्तीय सहायता (Top Position & Financial Support)',
    positive: 'आपको अपने संबंधित क्षेत्र में शीर्ष स्थान पर पहुँचाएँ, वित्तीय सहायता, काम के प्रति दृढ़ इरादे, शिक्षा के लिए अच्छा, गुप्त विज्ञान के लिए अच्छा।',
    negative: 'अति-महत्वाकांक्षा से तनाव।',
    career: 'क्षेत्र में शीर्ष स्थान, उच्च कंसल्टेंसी, गुप्त विज्ञान, शिक्षा।',
    wealth: 'मजबूत वित्तीय सहायता और धन लाभ।',
    relationship: 'मजबूत और सहायक साथी।',
    wellness: 'उत्तम इच्छाशक्ति और मानसिक शक्ति।',
    area: 'Career',
    severity: 96,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 11 }
  },
  '73': {
    pair: '73',
    meaning: 'दृढ़ इरादे एवं गुप्त विज्ञान में सफलता (Strong Intentions & Occult)',
    positive: 'शीर्ष स्थान पर पहुँचना, वित्तीय सहायता, काम के प्रति दृढ़ इरादे, शिक्षा व गुप्त विज्ञान के लिए श्रेष्ठ।',
    negative: 'दूसरों से अत्यधिक अपेक्षा रखना।',
    career: 'कंसल्टेंट, रिसर्चर, प्लास्टिक/मैन्युफैक्चरिंग बिजनेस, प्रशासनिक पद।',
    wealth: 'वित्तीय सहायता और स्थिर धन प्राप्ति।',
    relationship: 'गहरे और विश्वासपात्र संबंध।',
    wellness: 'मजबूत संकल्प शक्ति।',
    area: 'Career',
    severity: 96,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 11 }
  },
  '38': {
    pair: '38',
    meaning: 'रियल एस्टेट एवं परामर्शदाता (Property Sales & Counsellor)',
    positive: 'संपत्ति और बिक्री क्षेत्र लाभदायक होगा, रियल स्टेट, परामर्शदाता, मध्यस्थ।',
    negative: 'न्यायिक मामलों में प्रारंभिक विलंब।',
    career: 'रियल एस्टेट, परामर्शदाता, मध्यस्थ, न्यायाधीश, कंसल्टेंट।',
    wealth: 'संपत्ति और जमीन-जायदाद के सौदों से बड़ा लाभ।',
    relationship: 'मध्यस्थता और समझदारी से रिश्तों को संभालते हैं।',
    wellness: 'कार्य और विश्राम में संतुलन रखें।',
    area: 'Wealth',
    severity: 90,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '83': {
    pair: '83',
    meaning: 'संपत्ति व मध्यस्थता लाभ (Real Estate & Mediator)',
    positive: 'संपत्ति और बिक्री क्षेत्र में लाभ, रियल स्टेट, परामर्शदाता, मध्यस्थ।',
    negative: 'कार्य में अत्यधिक गंभीरता।',
    career: 'जमीन-जायदाद, कानूनी परामर्श, सेल्स व ब्रोकरेज।',
    wealth: 'प्रॉपर्टी निर्माण और बिक्री से प्रचुर लाभ।',
    relationship: 'व्यावहारिक और सुलझे हुए रिश्ते।',
    wellness: 'धैर्य और मानसिक स्थिरता।',
    area: 'Wealth',
    severity: 90,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '39': {
    pair: '39',
    meaning: 'सक्रिय, बुद्धिमान एवं समाज सेवा (Active & NGO Social Service)',
    positive: 'सक्रिय, बुद्धिमान और मेहनती, एनजीओ, समाज सेवा।',
    negative: 'मुनाफे पर ध्यान कम देना।',
    career: 'एनजीओ, सामाजिक कार्यकर्ता, सार्वजनिक कल्याण, शिक्षा।',
    wealth: 'मेहनत के अनुपात में संतोषजनक लाभ।',
    relationship: 'परोपकारी और सहयोगी स्वभाव।',
    wellness: 'शारीरिक रूप से सक्रिय और ऊर्जावान।',
    area: 'Career',
    severity: 85,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '93': {
    pair: '93',
    meaning: 'मेहनती बुद्धिमान कार्यकर्ता (Hard Worker & Social Service)',
    positive: 'सक्रिय, बुद्धिमान और मेहनती, समाज सेवा में अग्रणी।',
    negative: 'दूसरों के काम में अपनी ऊर्जा अत्यधिक खर्च करना।',
    career: 'सामाजिक कार्य, एनजीओ, सार्वजनिक प्रशासन।',
    wealth: 'सेवा और निष्काम कर्म से संतुष्टि।',
    relationship: 'समाज में लोकप्रिय और आदरणीय।',
    wellness: 'ऊर्जावान और समर्पित।',
    area: 'Career',
    severity: 85,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '45': {
    pair: '45',
    meaning: 'बुद्धिमान परंतु अदालत/अस्पताल चक्कर (Wise but Court/Hospital Visits)',
    positive: 'बुद्धिमान और समझदार।',
    negative: 'बहन या बेटी की स्वास्थ्य समस्याएँ, अक्सर अदालत/अस्पताल जाना पड़ता है।',
    career: 'अदालत, अस्पताल या लीगल कंसल्टेंसी से जुड़े कार्य।',
    wealth: 'अचानक कानूनी या मेडिकल खर्च संभव।',
    relationship: 'बहन या बेटी के स्वास्थ्य पर विशेष ध्यान दें।',
    wellness: 'अक्सर अस्पताल जाने की नौबत से बचने के लिए सतर्क रहें।',
    area: 'Health',
    severity: 45,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '54': {
    pair: '54',
    meaning: 'समझदार व्यक्तित्व एवं परिवार स्वास्थ्य (Wise & Family Health)',
    positive: 'बुद्धिमान और समझदार।',
    negative: 'बहन या बेटी की स्वास्थ्य समस्याएँ, अक्सर अदालत/अस्पताल के चक्कर।',
    career: 'अस्पताल/कोर्ट में कार्यरत लोगों के लिए अनुकूल।',
    wealth: 'चिकित्सा व कानूनी खर्चों का प्रबंधन आवश्यक।',
    relationship: 'परिवार की महिला सदस्यों का सहयोग करें।',
    wellness: 'नियमित स्वास्थ्य जांच कराते रहें।',
    area: 'Health',
    severity: 45,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '46': {
    pair: '46',
    meaning: 'त्वचा रोग एवं अतिरिक्त संबंध (Skin Disease & Extra Relationships)',
    positive: 'आकर्षक व्यक्तित्व और तेजी से घुलना-मिलना।',
    negative: 'त्वचा रोग, त्वचा पर चकत्ते और बवासीर, अतिरिक्त संबंध, यूटीआई संक्रमण, अंतरजातीय विवाह, बच्चों के लिए इस संयोजन से बचें।',
    career: 'लाइफस्टाइल या फैशन में आकर्षण; बच्चों के नंबर में न दें।',
    wealth: 'अनावश्यक रिश्तों पर धन का खर्च।',
    relationship: 'अतिरिक्त संबंधों से बचें; वैवाहिक निष्ठा बनाए रखें।',
    wellness: 'त्वचा रोग, चकत्ते, बवासीर व यूटीआई से पारंपरिक सावधानी रखें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '64': {
    pair: '64',
    meaning: 'त्वचा चकत्ते, बवासीर व संबंध सावधानी (Skin Patches & UTI Caution)',
    positive: 'रचनात्मकता और सामाजिक आकर्षण।',
    negative: 'त्वचा रोग, चकत्ते, बवासीर, अतिरिक्त संबंध, यूटीआई संक्रमण, अंतरजातीय विवाह, बच्चों के लिए बचें।',
    career: 'रचनात्मक कार्य; बच्चों के लिए यह जोड़ी वर्जित है।',
    wealth: 'फिजूलखर्ची से बचें।',
    relationship: 'वैवाहिक संबंधों में ईमानदारी रखें।',
    wellness: 'त्वचा और पेट के स्वास्थ्य का ध्यान रखें।',
    area: 'Health',
    severity: 30,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 12 }
  },
  '47': {
    pair: '47',
    meaning: 'चतुर व्यक्तित्व एवं जुगाड़ू प्रतिभा (Clever, Strong Will & Jugadoo)',
    positive: 'चतुर व्यक्तित्व, सेवा प्रदाता, दृढ़ निश्चय और इच्छाशक्ति, ईमानदार, प्रतिभाशाली, जुगाड़ू।',
    negative: 'अति-चालाकी से गलतफहमी।',
    career: 'सेवा प्रदाता, तकनीकी समस्या समाधान, जुगाड़ू इनोवेटर, आईटी।',
    wealth: 'अपनी चातुर्य और मेहनत से कमाई।',
    relationship: 'ईमानदार और समर्पित।',
    wellness: 'मजबूत इच्छाशक्ति और मानसिक दृढ़ता।',
    area: 'Career',
    severity: 88,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 13 }
  },
  '74': {
    pair: '74',
    meaning: 'सेवा प्रदाता एवं दृढ़ इच्छाशक्ति (Service Provider & Will Power)',
    positive: 'चतुर व्यक्तित्व, सेवा प्रदाता, दृढ़ निश्चय और इच्छाशक्ति, ईमानदार, प्रतिभाशाली, जुगाड़ू।',
    negative: 'जिद्दीपन पर नियंत्रण रखें।',
    career: 'सर्विस प्रोवाइडर, टेक्निकल एक्सपर्ट, कंसल्टेंट।',
    wealth: 'निरंतर प्रयासों से धन लाभ।',
    relationship: 'स्पष्टवादी और ईमानदार।',
    wellness: 'मानसिक दृढ़ता।',
    area: 'Career',
    severity: 88,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 13 }
  },
  '48': {
    pair: '48',
    meaning: 'दीर्घकालिक रोग एवं अवसाद (Chronic Disease & Legal Issues)',
    positive: 'गहन सहनशीलता।',
    negative: 'लाइलाज समस्या / दीर्घकालिक रोग, यौन सुख की कमी, रक्त रोग, अवसाद और तनाव, कानूनी मुद्दे।',
    career: 'कानूनी जटिलताएं या कार्यों में रुकावटें।',
    wealth: 'अस्पताल और कानूनी खर्चों का जोखिम।',
    relationship: 'यौन सुख में कमी और वैवाहिक तनाव।',
    wellness: 'रक्त विकार, अवसाद और दीर्घकालिक रोगों से पारंपरिक सावधानी।',
    area: 'Health',
    severity: 20,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 13 }
  },
  '84': {
    pair: '84',
    meaning: 'रक्त रोग, अवसाद एवं कानूनी मुद्दे (Blood Disease & Depression)',
    positive: 'कड़े संघर्ष से जूझने की शक्ति।',
    negative: 'दीर्घकालिक रोग, यौन सुख की कमी, रक्त रोग, अवसाद व तनाव, कानूनी मुद्दे।',
    career: 'कार्यक्षेत्र में भारी संघर्ष और कानूनी सतर्कता।',
    wealth: 'अचानक हानि से बचने के लिए कागजात सुरक्षित रखें।',
    relationship: 'आपसी समझ और संवाद बनाए रखें।',
    wellness: 'रक्त जांच कराएं और तनावमुक्त रहने का अभ्यास करें।',
    area: 'Health',
    severity: 20,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 13 }
  },
  '49': {
    pair: '49',
    meaning: 'जोखिम भरे काम व दबंग स्वभाव (Risky Jobs & Dabang Nature)',
    positive: 'जोखिम भरे काम किए जाते हैं, कड़ी मेहनत के बाद सफलता, समान परिश्रम, साहसी और दबंग स्वभाव।',
    negative: 'क्रोध और जोखिम में अति-उत्साह।',
    career: 'सेना, पुलिस, वर्दी वाले कार्य (Uniform Work), साहसी उद्योग।',
    wealth: 'कड़ी मेहनत और जोखिम उठाकर बड़ा लाभ।',
    relationship: 'दबंग स्वभाव; साथी के साथ कोमलता रखें।',
    wellness: 'चोट-चपेट से सावधान रहें।',
    area: 'Career',
    severity: 80,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 14 }
  },
  '94': {
    pair: '94',
    meaning: 'वर्दी वाले कार्य एवं साहसी स्वभाव (Uniform Work & Bold Nature)',
    positive: 'जोखिम भरे काम, कड़ी मेहनत के बाद सफलता, साहसी और दबंग स्वभाव, वर्दी वाले कार्य।',
    negative: 'अनावश्यक विवाद में पड़ना।',
    career: 'आर्मी, पुलिस, फायर ब्रिगेड, सुरक्षा सेवाएं।',
    wealth: 'परिश्रम से स्थायी सफलता।',
    relationship: 'सुरक्षात्मक स्वभाव।',
    wellness: 'शारीरिक रूप से चुस्त-दुरुस्त।',
    area: 'Career',
    severity: 80,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 14 }
  },
  '56': {
    pair: '56',
    meaning: 'शर्मीले स्वभाव से पैसा फंसना (Shy & Money Stuck in Love)',
    positive: 'बुद्धिमान व्यक्तित्व।',
    negative: 'वे अपना पैसा नहीं मांग सकते क्योंकि वे बहुत शर्मीले होते हैं, हो सकता है कि उनका पैसा फंसा हो, प्यार में असफलता।',
    career: 'व्यापार में उधारी देने से बचें।',
    wealth: 'शर्मीलेपन के कारण अपना ही पैसा मांगने में हिचकिचाहट; धन फंसने का योग।',
    relationship: 'प्रेम में असफलता या निराशा का सामना करना पड़ सकता है।',
    wellness: 'आत्मविश्वास बढ़ाने के लिए ध्यान करें।',
    area: 'Wealth',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 14 }
  },
  '65': {
    pair: '65',
    meaning: 'पैसा फंसना व प्रेम असफलता (Money Stuck & Love Failure)',
    positive: 'बुद्धिमान और संवेदनशील।',
    negative: 'शर्मीले स्वभाव के कारण पैसा न मांग पाना, पैसा फंसना, प्यार में असफलता।',
    career: 'स्पष्ट बातचीत और लिखित शर्तों से व्यापार करें।',
    wealth: 'बाजार में उधारी फंसने का जोखिम; सतर्क रहें।',
    relationship: 'भावनात्मक फैसलों में जल्दबाजी न करें।',
    wellness: 'मानसिक स्पष्टता बनाए रखें।',
    area: 'Wealth',
    severity: 35,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 14 }
  },
  '57': {
    pair: '57',
    meaning: 'अच्छा सार्वजनिक वक्ता व व्यवसायी (Good Public Speaker & Businessman)',
    positive: 'अच्छा सार्वजनिक वक्ता, अच्छा व्यवसायी, लेखक और ज्योतिषी भी हो सकता है, जनसंपर्क (PR) में कुशल।',
    negative: 'अति-विचार में समय गंवाना।',
    career: 'पब्लिक स्पीकर, व्यवसायी, लेखक, ज्योतिषी, एचआर (HR), पीआर (PR)।',
    wealth: 'व्यापार और जनसंपर्क से प्रचुर धनार्जन।',
    relationship: 'मिलनसार और लोकप्रिय साथी।',
    wellness: 'उत्तम मानसिक संतुलन और संवाद शक्ति।',
    area: 'Career',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 14 }
  },
  '75': {
    pair: '75',
    meaning: 'वक्ता, लेखक, ज्योतिषी व पीआर (Speaker, Writer & Astrologer)',
    positive: 'अच्छा सार्वजनिक वक्ता, अच्छा व्यवसायी, लेखक और ज्योतिषी, बेहतरीन जनसंपर्क।',
    negative: 'एकाकीपन की भावना।',
    career: 'लेखक, ज्योतिषी, शिक्षक, बैंकर, इंजीनियर, वकील, कंसल्टेंट।',
    wealth: 'ज्ञान, बैंकिंग और जनसंपर्क से सतत लाभ।',
    relationship: 'बुद्धिमान और आदरणीय व्यक्तित्व।',
    wellness: 'सकारात्मक और शांत मन।',
    area: 'Career',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 15 }
  },
  '58': {
    pair: '58',
    meaning: 'पूर्ण वित्तीय घाटा व धन अवरुद्ध (Complete Financial Loss & Blocked Money)',
    positive: 'गणनाशील दिमाग (Calculated minded), लाखों और करोड़ों की बात करता है।',
    negative: 'पूर्ण वित्तीय घाटा, संपत्ति और धन अवरुद्ध (Money Blocked)।',
    career: 'बड़ी-बड़ी बातें करना लेकिन ठोस योजना में रुकावटें।',
    wealth: 'संपत्ति और पूंजी फंसने का बड़ा जोखिम; सट्टेबाजी व बड़े कर्ज से बचें।',
    relationship: 'आर्थिक तनाव से पारिवारिक अशांति।',
    wellness: 'तनाव और चिंता पर नियंत्रण रखें।',
    area: 'Wealth',
    severity: 25,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 15 }
  },
  '85': {
    pair: '85',
    meaning: 'गणनाशील दिमाग परंतु धन अवरुद्ध (Calculated Mind & Blocked Money)',
    positive: 'गणनाशील (Calculated minded), लाखों-करोड़ों की योजनाएं, बैंकिंग/अकाउंट्स में रुचि।',
    negative: 'पूर्ण वित्तीय घाटा, संपत्ति और धन अवरुद्ध होना।',
    career: 'अकाउंट्स, बैंकिंग में अच्छा; बड़े सट्टेबाजी सौदों से बचें।',
    wealth: 'पैसे के लेन-देन में अत्यंत सावधानी बरतें।',
    relationship: 'व्यावहारिक सोच रखें।',
    wellness: 'मानसिक शांति बनाए रखें।',
    area: 'Wealth',
    severity: 25,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 15 }
  },
  '59': {
    pair: '59',
    meaning: 'तेज़ दिमाग, सीधा स्वभाव व तकनीकी ज्ञान (Sharp Mind & Immense Tech)',
    positive: 'तेज़ दिमाग़ वाले और सीधे-सादे लोग, अत्यधिक तकनीकी ज्ञान, सफल व्यवसायी, कम रिश्ते लेकिन अच्छे रिश्ते।',
    negative: 'सरल-सादे लोग इसलिए असभ्य समझे जाते हैं (Judged as rude)।',
    career: 'सफल व्यवसायी, आईटी, तकनीकी विशेषज्ञ, इंजीनियर।',
    wealth: 'तकनीकी दक्षता और व्यवसाय से बड़ा लाभ।',
    relationship: 'कम रिश्ते लेकिन अत्यंत सच्चे और मजबूत रिश्ते।',
    wellness: 'चुस्त और सक्रिय दिमाग।',
    area: 'Career',
    severity: 92,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 15 }
  },
  '95': {
    pair: '95',
    meaning: 'सफल व्यवसायी एवं तकनीकी विशेषज्ञ (Successful Businessman & Tech)',
    positive: 'तेज़ दिमाग, सीधा स्वभाव, अपार तकनीकी ज्ञान, सफल व्यवसायी, गहरे रिश्ते।',
    negative: 'मुंहफट बोलने के कारण रूखे समझे जाना।',
    career: 'सफल व्यापार, आईटी, सॉफ्टवेयर आर्किटेक्चर, कंसल्टिंग।',
    wealth: 'व्यावसायिक और तकनीकी सफलता से धन लाभ।',
    relationship: 'सीधे और निष्कपट संबंध।',
    wellness: 'शारीरिक व मानसिक ऊर्जा।',
    area: 'Career',
    severity: 92,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 15 }
  },
  '67': {
    pair: '67',
    meaning: 'संगीत, विलासिता व प्रेम विवाह (Music, Luxury & Love Marriage)',
    positive: 'संगीत प्रेमी, विलासिता प्रेमी, प्रेम विवाह के अवसर, वैवाहिक व प्रेम जीवन की समस्याओं में राहत देने वाली जोड़ी।',
    negative: 'दिखावे पर अधिक खर्च।',
    career: 'कला, मीडिया, ग्लैमर, डिजाइनिंग, संगीत उद्योग।',
    wealth: 'लक्जरी, कला और मनोरंजन से धनार्जन।',
    relationship: 'प्रेम विवाह की प्रबल संभावना; वैवाहिक समस्याओं को सुलझाने में सहायक।',
    wellness: 'सुरुचिपूर्ण और तनावमुक्त जीवनशैली।',
    area: 'Relationships',
    severity: 94,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 16 }
  },
  '76': {
    pair: '76',
    meaning: 'विलासिता प्रेमी एवं प्रेम विवाह (Luxury Lover & Love Marriage)',
    positive: 'संगीत प्रेमी, विलासिता प्रेमी, प्रेम विवाह के अवसर, दांपत्य जीवन के सुधार हेतु उत्तम।',
    negative: 'अत्यधिक भौतिकता की ओर झुकाव।',
    career: 'फैशन, ग्लैमर, कला, इवेंट मैनेजमेंट, सलाहकार।',
    wealth: 'कला और ब्रांड्स के माध्यम से प्रचुर धन।',
    relationship: 'रोमांस, प्रेम विवाह और दांपत्य सौहार्द।',
    wellness: 'सकारात्मक सौंदर्यबोध और शांति।',
    area: 'Relationships',
    severity: 94,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 16 }
  },
  '68': {
    pair: '68',
    meaning: 'सर्जन, डॉक्टर एवं स्वास्थ्य सावधानी (Surgeons, Doctors & Eye/Chest)',
    positive: 'सर्जन, डॉक्टर और अस्पताल में काम करने वाले लोगों के लिए उपयुक्त।',
    negative: 'स्वास्थ्य समस्याएँ: आँख, छाती और स्तन संबंधी समस्याएँ।',
    career: 'सर्जन, डॉक्टर, अस्पताल कर्मी, फार्मास्युटिकल।',
    wealth: 'चिकित्सा व्यवसाय से धन लाभ।',
    relationship: 'कार्य के दबाव में परिवार को समय दें।',
    wellness: 'आँख, छाती और स्तन से जुड़ी पारंपरिक स्वास्थ्य सावधानी रखें।',
    area: 'Career',
    severity: 70,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 16 }
  },
  '86': {
    pair: '86',
    meaning: 'चिकित्सा क्षेत्र अनुकूल व स्वास्थ्य जांच (Hospital Work & Health Caution)',
    positive: 'सर्जन, डॉक्टर और अस्पताल में काम करने वालों के लिए उत्तम।',
    negative: 'आँख, छाती और स्तन संबंधी स्वास्थ्य समस्याएँ।',
    career: 'मेडिकल, सर्जरी, नर्सिंग और अस्पताल प्रबंधन।',
    wealth: 'सेवा क्षेत्र से धन प्राप्ति।',
    relationship: 'सहानुभूतिपूर्ण दृष्टिकोण।',
    wellness: 'नियमित स्वास्थ्य जांच कराते रहें।',
    area: 'Career',
    severity: 70,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 16 }
  },
  '69': {
    pair: '69',
    meaning: 'रचनात्मक सोच व उत्कृष्ट प्रबंधन (Creative Mind & Good Management)',
    positive: 'रचनात्मक सोच, उत्कृष्ट प्रबंधन कौशल, उत्कृष्ट योजनाकार, इवेंट मैनेजमेंट, विवाह योजनाकारों, डिज़ाइनरों के लिए उपयुक्त।',
    negative: 'अति-योजना बनाने में समय गंवाना।',
    career: 'इवेंट मैनेजमेंट, विवाह योजनाकार (Wedding Planner), डिजाइनर, कलाकार।',
    wealth: 'रचनात्मक प्रबंधन और डिजाइनिंग से धनार्जन।',
    relationship: 'सौहार्दपूर्ण और सुरुचिपूर्ण वैवाहिक जीवन।',
    wellness: 'सक्रिय और संतुलित दिनचर्या।',
    area: 'Career',
    severity: 94,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 16 }
  },
  '96': {
    pair: '96',
    meaning: 'उत्कृष्ट योजनाकार एवं डिजाइनर (Good Planner & Event Management)',
    positive: 'रचनात्मक सोच, उत्कृष्ट प्रबंधन कौशल, उत्कृष्ट योजनाकार, इवेंट व डिजाइनिंग के लिए श्रेष्ठ।',
    negative: 'जल्दबाजी में निर्णय न लें।',
    career: 'इवेंट प्लानर, डिजाइनर, विवाह आयोजक, क्रिएटिव डायरेक्टर।',
    wealth: 'प्रबंधन और बड़े आयोजनों से लाभ।',
    relationship: 'आकर्षक और समझदार जीवनसाथी।',
    wellness: 'ऊर्जावान और प्रसन्नचित्त।',
    area: 'Career',
    severity: 94,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 17 }
  },
  '78': {
    pair: '78',
    meaning: 'आध्यात्मिक उपचारक व स्वयं समस्या समाधान (Spiritual Healer & Self-Solver)',
    positive: 'आध्यात्मिक उपचारक और सामाजिक कार्यकर्ता, अपनी शक्ति से किसी भी समस्या का समाधान करते हैं।',
    negative: 'नकारात्मक विचार प्रक्रिया वाले लोग, अकेलापन।',
    career: 'आध्यात्मिक हीलर, फिजियोथेरेपिस्ट, रेकी मास्टर, समाजसेवी।',
    wealth: 'स्वयं की मेहनत और हीलिंग सेवाओं से लाभ।',
    relationship: 'एकाकीपन महसूस हो सकता है; सकारात्मक लोगों से जुड़ें।',
    wellness: 'नकारात्मक विचारों से बचें और ध्यान का सहारा लें।',
    area: 'Spiritual',
    severity: 80,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 17 }
  },
  '87': {
    pair: '87',
    meaning: 'समाजसेवी एवं हीलिंग शक्ति (Social Worker & Spiritual Healing)',
    positive: 'आध्यात्मिक उपचारक, समाजसेवी, स्वयं के दम पर समस्याओं का समाधान।',
    negative: 'नकारात्मक विचार प्रक्रिया, अकेलापन।',
    career: 'हीलर, समाज कल्याण, परामर्श।',
    wealth: 'परोपकार और सेवा कार्यों से संतुष्टि।',
    relationship: 'अकेलेपन से बाहर निकलकर संवाद करें।',
    wellness: 'सकारात्मक सोच बनाए रखें।',
    area: 'Spiritual',
    severity: 80,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 17 }
  },
  '79': {
    pair: '79',
    meaning: 'करियर उतार-चढ़ाव व घरेलू अशांति (Career Up-Down & Domestic Disturbance)',
    positive: 'परिवर्तन को स्वीकारने की क्षमता।',
    negative: 'करियर में उतार-चढ़ाव, रक्त संबंधी समस्याएँ / जोड़ों का दर्द / गुर्दे की समस्याएँ, घरेलू जीवन में अशांति।',
    career: 'करियर में बार-बार अस्थिरता; धैर्य रखें।',
    wealth: 'आर्थिक उतार-चढ़ाव संभव।',
    relationship: 'घरेलू जीवन में अशांति से बचने के लिए शांतिपूर्ण संवाद करें।',
    wellness: 'रक्त, जोड़ों के दर्द और गुर्दे (Kidney) से जुड़ी पारंपरिक सावधानी रखें।',
    area: 'Career',
    severity: 28,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 17 }
  },
  '97': {
    pair: '97',
    meaning: 'करियर अस्थिरता एवं स्वास्थ्य सावधानी (Career Fluctuations & Health Caution)',
    positive: 'शोध और अंतर्दृष्टि।',
    negative: 'करियर में उतार-चढ़ाव, रक्त विकार, जोड़ों का दर्द, गुर्दे की समस्या, घरेलू अशांति।',
    career: 'स्थिरता के लिए योजनाबद्ध काम करें।',
    wealth: 'पैसे के प्रवाह में उतार-चढ़ाव संभव।',
    relationship: 'पारिवारिक सौहार्द बनाए रखें।',
    wellness: 'गुर्दे और जोड़ों के स्वास्थ्य पर ध्यान दें।',
    area: 'Career',
    severity: 28,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 17 }
  },
  '89': {
    pair: '89',
    meaning: 'तर्कसंगत, सिद्धांतवादी व भाई से बहस (Logical, Principled & Arguments)',
    positive: 'तर्कसंगत लेकिन तार्किक बिंदुओं पर, सिद्धांत के साथ काम करता है, ज्योतिषी, सलाहकार, सेवा प्रदाता, वकील, शेयर दलाल।',
    negative: 'आक्रामक, भाई के साथ बहस।',
    career: 'वकील, शेयर दलाल, ज्योतिषी, सलाहकार, सेवा प्रदाता।',
    wealth: 'शेयर बाजार और वकालत से अच्छा धन लाभ।',
    relationship: 'भाइयों के साथ अनावश्यक बहस से बचें।',
    wellness: 'क्रोध पर नियंत्रण रखें और रक्तचाप सामान्य रखें।',
    area: 'Career',
    severity: 78,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 18 }
  },
  '98': {
    pair: '98',
    meaning: 'वकील, शेयर दलाल एवं सिद्धांतवादी (Advocate, Stock Broker & Principled)',
    positive: 'तर्कसंगत, सिद्धांतों पर काम करना, ज्योतिषी, सलाहकार, वकील, स्टॉक ब्रोकर।',
    negative: 'आक्रामकता और भाई से मतभेद।',
    career: 'वकील, न्यायाधीश, स्टॉक ब्रोकर, वित्तीय सलाहकार, ज्योतिषी।',
    wealth: 'शेयर ब्रोकरेज और कानूनी सेवाओं से धन लाभ।',
    relationship: 'पारिवारिक बातचीत में विनम्रता रखें।',
    wellness: 'मानसिक शांति हेतु नियमित व्यायाम करें।',
    area: 'Career',
    severity: 78,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 18 }
  },

  // Repetitive Pairs (Two Times) from Day 1 / Day 2 PDFs
  '22': {
    pair: '22',
    meaning: 'सहज, भावुक व मनोदशा में उतार-चढ़ाव (Intuitive, Emotional, Mood Swings)',
    positive: 'सहज, अंतर्ज्ञानी, कलात्मक और संवेदनशील।',
    negative: 'मनोदशा में तीव्र उतार-चढ़ाव (Mood swings), अति-संवेदनशीलता।',
    career: 'काउंसलिंग, कला, रचनात्मक कार्य।',
    wealth: 'स्थिर बचत के साधन अपनाएं।',
    relationship: 'भावनात्मक सुरक्षा की गहरी आवश्यकता।',
    wellness: 'मानसिक शांति हेतु पूर्णिमा के दिन ध्यान करें।',
    area: 'Relationships',
    severity: 75,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '33': {
    pair: '33',
    meaning: 'ज्ञानी एवं समाज में पुरस्कार योग (Knowledgeable & Awards)',
    positive: 'ज्ञानी, समाज सम्मान देगा, पुरस्कार भी मिल सकते हैं।',
    negative: 'ज्ञान का सूक्ष्म अहंकार या उपदेशात्मक रुख।',
    career: 'शिक्षक, आध्यात्मिक गुरु, सलाहकार, लेखक।',
    wealth: 'ज्ञान और पुरस्कारों के माध्यम से प्रतिष्ठा व धन।',
    relationship: 'आदरणीय और प्रतिष्ठित संबंध।',
    wellness: 'वजन प्रबंधन पर ध्यान दें।',
    area: 'Career',
    severity: 92,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '44': {
    pair: '44',
    meaning: 'कड़ी मेहनत, भ्रम व जीवन में अचानकता (Hard Working, Illusion & Suddenness)',
    positive: 'कड़ी मेहनत और तकनीकी क्षमता।',
    negative: 'भ्रम, जीवन में अचानकता (Suddenness in life), सिरदर्द।',
    career: 'तकनीकी क्षेत्र; अचानक लाभ-हानि से बचें।',
    wealth: 'अचानक बड़े खर्चों का सामना हो सकता है।',
    relationship: 'लोगों पर भरोसा करने में कठिनाई महसूस होना।',
    wellness: 'सिरदर्द और मानसिक तनाव की पारंपरिक सावधानी।',
    area: 'Health',
    severity: 40,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '55': {
    pair: '55',
    meaning: 'अच्छा संचार, धन प्रवाह व स्थिरता (Good Communication & Money Flow)',
    positive: 'अच्छा संचार, धन प्रवाह, थोड़ी स्थिरता भी ला सकते हैं।',
    negative: 'एक साथ कई काम शुरू करने की बेचैनी।',
    career: 'व्यापार, मार्केटिंग, जनसंपर्क, वित्तीय ब्रोकरेज।',
    wealth: 'तेज धन प्रवाह और नकद तरलता।',
    relationship: 'रोचक और जीवंत बातचीत।',
    wellness: 'सक्रिय और ऊर्जावान स्वास्थ्य।',
    area: 'Wealth',
    severity: 95,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '66': {
    pair: '66',
    meaning: 'विलासिता, प्रेम व पारिवारिक ज़िम्मेदारी (Luxury, Love & Family Care)',
    positive: 'विलासिता, प्रेम, पारिवारिक ज़िम्मेदारी बहुत कुशलता से निभाते हैं।',
    negative: 'अत्यधिक खर्च और विलासिता में समय गंवाना।',
    career: 'लक्जरी ब्रांड्स, हॉस्पिटैलिटी, इंटीरियर, डिजाइनिंग।',
    wealth: 'भौतिक सुख-सुविधाओं और संपत्तियों में वृद्धि।',
    relationship: 'गहरा प्रेम और पारिवारिक समर्पण।',
    wellness: 'खान-पान में संतुलन बनाए रखें।',
    area: 'Relationships',
    severity: 92,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '77': {
    pair: '77',
    meaning: 'शोधकर्ता, अति विचारक व निराशा योग (Researcher, Over Thinker)',
    positive: 'शोधकर्ता, गहन विश्लेषक, स्वतंत्र सोच।',
    negative: 'अति विचारक (Over thinker), कभी-कभी निराशा ला सकते हैं।',
    career: 'रिसर्च, डेटा एनालिसिस, गूढ़ विद्या, सॉफ्टवेयर।',
    wealth: 'विशेषज्ञता से लाभ।',
    relationship: 'अकेलापन और गलतफहमी से बचें।',
    wellness: 'अति-विचार और अवसाद से बचने के लिए मेडिटेशन करें।',
    area: 'Spiritual',
    severity: 65,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '88': {
    pair: '88',
    meaning: 'बाधाएँ और निर्णयात्मक स्वभाव (Hurdles & Judgmental)',
    positive: 'दृढ़ संकल्प और अथक परिश्रम।',
    negative: 'बाधाएँ, निर्णयात्मक स्वभाव, संपत्ति हानि, अदालती चक्कर।',
    career: 'भारी उद्योग, कानून; सफलता में देरी संभव।',
    wealth: 'धीमी गति से स्थायी संपत्ति निर्माण।',
    relationship: 'अत्यधिक गंभीर और कड़े नियम।',
    wellness: 'जोड़ों का दर्द और पाचन का ध्यान रखें।',
    area: 'Career',
    severity: 45,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  },
  '99': {
    pair: '99',
    meaning: 'ऊर्जावान एवं सक्रिय (Energetic & Active)',
    positive: 'ऊर्जावान, सक्रिय, साहसी और निडर।',
    negative: 'क्रोध संबंधी समस्याएँ, अशिष्ट व्यवहार, दुर्घटनाएँ।',
    career: 'रक्षा सेवाएं, पुलिस, खेलकूद, आपातकालीन सेवाएं।',
    wealth: 'साहसी व्यापारिक फैसलों से लाभ।',
    relationship: 'समर्पित लेकिन गुस्से पर काबू रखना जरूरी।',
    wellness: 'दुर्घटनाओं से बचने के लिए सतर्कता रखें।',
    area: 'Career',
    severity: 80,
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 2 }
  }
};

// 4. Repeated Digits in Multiple Times (4+ Times) from Day 1 PDF Pages 3-4 / Day 3 PDF Page 20
export const MULTIPLE_REPETITION_CAUTIONS: Record<number, {
  pattern: string;
  hindiMeaning: string;
  englishMeaning: string;
  traditionalCaution: string;
  source: SourceCitation;
}> = {
  1: {
    pattern: '1111 (4 या अधिक बार)',
    hindiMeaning: 'कुप्रबंधन, चिड़चिड़ापन, तनाव, अहंकार, समायोजन की कमी',
    englishMeaning: 'Mismanagement, Short Tempered, Stress, Egoistic, No Adjustment',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 1 को 4 से अधिक बार दोहराने से अहंकार और प्रबंधन में तनाव बढ़ सकता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  2: {
    pattern: '2222 (4 या अधिक बार)',
    hindiMeaning: 'मूड स्विंग, अवसाद, ज़्यादा सोचना',
    englishMeaning: 'Mood Swings, Depression, Over Thinking',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 2 का अत्यधिक दोहराव मानसिक चंचलता और अवसाद की संभावना बढ़ा सकता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  3: {
    pattern: '3333 (4 या अधिक बार)',
    hindiMeaning: 'वज़न बढ़ना, किसी की न सुनना, बातूनी',
    englishMeaning: 'Weight Gain, Will Not Listen to Anybody, Talkative',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 3 का अत्यधिक दोहराव वजन प्रबंधन और हठ का संकेत देता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  4: {
    pattern: '4444 (4 या अधिक बार)',
    hindiMeaning: 'अचानक वज़न बढ़ना/घटना, भ्रम, लोगों पर भरोसा करने में कठिनाई, सिरदर्द',
    englishMeaning: 'Sudden Gain / Loss, Illusion, Difficulty Trusting People, Can Cause Headaches',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 4 का 4+ दोहराव जीवन में अप्रत्याशित उतार-चढ़ाव और अविश्वास ला सकता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  5: {
    pattern: '5555 (4 या अधिक बार)',
    hindiMeaning: 'धन हानि, आलसी/सुस्त, अतार्किक बातें, वित्तीय घोटालों में फँसना',
    englishMeaning: 'Money Loss, Lazy / Lethargic, Illogical Talks, Financial Scams Risk',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 5 का अत्यधिक दोहराव सुस्ती और आर्थिक घोटालों में फंसने की चेतावनी देता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  6: {
    pattern: '6666 (4 या अधिक बार)',
    hindiMeaning: 'चालाकी, मानहानि का सामना करना पड़ सकता है, कई रिश्ते, स्त्री रोग, लत, खर्च बढ़ना',
    englishMeaning: 'Manipulative, Might Face Defamation, Multiple Relationships, Addiction, Expenditure Increase',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 6 का अत्यधिक दोहराव अनियंत्रित खर्च और मानहानि का जोखिम बढ़ाता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  7: {
    pattern: '7777 (4 या अधिक बार)',
    hindiMeaning: 'ज़्यादा सोचने वाला, कई रिश्तों में उलझ सकता है, किसी तरह से धोखा खा सकता है (व्यापार-वित्त-रिश्ता-प्रेम)',
    englishMeaning: 'Over Thinker, Multiple Relationships, Might Get Cheated (Business, Finance, Relationships)',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 7 का अत्यधिक दोहराव अति-विचार और व्यापार/प्रेम में धोखा खाने का संकेत देता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  8: {
    pattern: '8888 (4 या अधिक बार)',
    hindiMeaning: 'बाधाएँ, संपत्ति की हानि, अदालती चक्कर, पुलिस मामले',
    englishMeaning: 'Hurdles, Property Loss, Court Visits, Police Cases',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 8 का अत्यधिक दोहराव भारी बाधाओं और अदालती मामलों की चेतावनी देता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  },
  9: {
    pattern: '9999 (4 या अधिक बार)',
    hindiMeaning: 'क्रोध संबंधी समस्याएँ, अशिष्ट व्यवहार, सर्जरी, दुर्घटनाएँ, ऋण/उधार',
    englishMeaning: 'Anger Issues, Rude Behaviour, Surgery, Accidents, Debts / Loans',
    traditionalCaution: 'इस course methodology में इसे traditional caution के रूप में देखा जाता है कि 9 का अत्यधिक दोहराव क्रोध और कर्ज की समस्याओं से बचने का संकेत देता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 4 }
  }
};

// 5. Health Cautions on Repeating Numbers from Day 1 PDF Pages 44-46 (Presented strictly as Traditional Numerology Cautions)
export const REPEATED_DIGIT_HEALTH_CAUTIONS: RepeatedDigitHealthCaution[] = [
  {
    digit: 1,
    threshold: '4 या अधिक बार',
    minCount: 4,
    traditionalHealthIssues: ['उच्च रक्तचाप (High BP)', 'सर्वाइकल (Cervical)', 'माइग्रेन (Migraine)', 'हृदय संबंधी संवेदनशीलता'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 1 का अत्यधिक दोहराव (4+ बार) होने पर उच्च रक्तचाप, माइग्रेन व हृदय संवेदनशीलता से पीड़ित व्यक्तियों को इसे दोहराने से बचने की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 2,
    threshold: '3 या अधिक बार',
    minCount: 3,
    traditionalHealthIssues: ['भय / तनाव (Stress & Anxiety)', 'अवसाद (Depression)', 'निम्न रक्तचाप (Low BP)', 'अपच / अस्थमा'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 2 का 3 या अधिक बार दोहराव होने पर चिंता, अवसाद, निम्न रक्तचाप और अस्थमा से पीड़ित व्यक्तियों को सावधानी बरतने की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 3,
    threshold: 'एकाधिक बार',
    minCount: 3,
    traditionalHealthIssues: ['वजन प्रबंधन (Weight Management)', 'मधुमेह (Diabetes)', 'लिवर / फैटी लिवर', 'तंत्रिका तंत्र समस्याएँ'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 3 के अत्यधिक दोहराव से वजन बढ़ने, मधुमेह व लिवर स्वास्थ्य के प्रति पारंपरिक सजगता रखने की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 4,
    threshold: 'एकाधिक बार',
    minCount: 2,
    traditionalHealthIssues: ['निदान संबंधी समस्याएँ (Diagnostic problems)', 'फेफड़ों की समस्या', 'सिरदर्द'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 4 के दोहराव से फेफड़ों व सिरदर्द से संबंधित पारंपरिक सजगता रखने का सुझाव दिया जाता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 5,
    threshold: 'एकाधिक बार',
    minCount: 4,
    traditionalHealthIssues: ['अनिद्रा (Insomnia)', 'तनाव व सुस्ती (Lethargic)', 'चिंता', 'त्वचा और वाणी संबंधी संवेदनशीलता'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 5 का अत्यधिक दोहराव होने पर अनिद्रा, सुस्ती व त्वचा संवेदनशीलता के प्रति सजग रहने का सुझाव दिया जाता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 6,
    threshold: 'एकाधिक बार',
    minCount: 3,
    traditionalHealthIssues: ['प्रजनन अंग रोग (Genital diseases)', 'गर्भपात संवेदनशीलता', 'यौन समस्याएँ'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 6 के अत्यधिक दोहराव में प्रजनन स्वास्थ्य व दांपत्य सुख के प्रति पारंपरिक सावधानी की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 7,
    threshold: 'एकाधिक बार',
    minCount: 3,
    traditionalHealthIssues: ['अवसाद (Depression)', 'चिंता व भ्रम (Confusion)', 'चयापचय संबंधी समस्याएँ (Metabolism)'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 7 के अत्यधिक दोहराव में भ्रम, चिंता व चयापचय संतुलन बनाए रखने की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 44 }
  },
  {
    digit: 8,
    threshold: 'एकाधिक बार',
    minCount: 2,
    traditionalHealthIssues: ['गठिया (Arthritis)', 'दीर्घकालिक रोग', 'एसिडिटी व दांतों की समस्या', 'आंतों की समस्या व स्मृति विकार'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 8 का दोहराव होने पर गठिया, जोड़ों का दर्द, एसिडिटी व आंतों के स्वास्थ्य के प्रति सतर्क रहने की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 45 }
  },
  {
    digit: 9,
    threshold: 'एकाधिक बार',
    minCount: 3,
    traditionalHealthIssues: ['गैस्ट्रिक समस्याएँ (Gastric)', 'रक्त संबंधी समस्याएँ', 'बार-बार होने वाले संक्रमण व दुर्घटनाएँ'],
    traditionalCautionHindi: 'पारंपरिक अंकशास्त्र के अनुसार 9 के अत्यधिक दोहराव में रक्त स्वास्थ्य, संक्रमण व चोट-चपेट से बचने की पारंपरिक सावधानी बरतने की सलाह दी जाती है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 45 }
  }
];

// 6. Profession-Wise Numbers Mapping from Day 1 PDF Pages 42-43
export const PROFESSION_NUMBER_MAPPINGS: Record<string, ProfessionNumberMapping> = {
  DOCTOR: {
    profession: 'डॉक्टर (Doctor / Medical Professional)',
    numbers: '19, 3, 7',
    requiredDigits: [1, 9, 3, 7],
    description: '19 (सूर्य-मंगल शौर्य व निदान), 3 (गुरु ज्ञान) और 7 (सूक्ष्म शोध) डॉक्टर व सर्जनों के लिए सबसे अनुकूल हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 42 }
  },
  ENGINEER: {
    profession: 'इंजीनियर (Engineer / Tech Specialist)',
    numbers: '19, 3, 75',
    requiredDigits: [1, 9, 3, 7, 5],
    description: '19 (साहस व नवाचार), 3 (ज्ञान) और 75 (तकनीकी व व्यावसायिक समझ) इंजीनियरिंग के लिए उत्तम हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 42 }
  },
  MEDIA_GLAMOUR: {
    profession: 'मीडिया / ग्लैमर उद्योग (Media / Glamour Industry)',
    numbers: '6, 17, 67, 2',
    requiredDigits: [6, 1, 7, 2],
    description: '6 (शुक्र का आकर्षण), 17 (सरकारी व सामाजिक संपर्क), 67 (विलासिता व कला) और 2 (कल्पनाशीलता) मीडिया व ग्लैमर के लिए आदर्श हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 42 }
  },
  TEACHER: {
    profession: 'शिक्षक / प्राध्यापक (Teacher / Educator)',
    numbers: '31, 75',
    requiredDigits: [3, 1, 7, 5],
    description: '31 (गुरु-सूर्य सम्मान) और 75 (ज्ञान व जनसंचार) शिक्षण व अकादमिक पदों के लिए सर्वश्रेष्ठ हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 42 }
  },
  ACCOUNTS_BANKING: {
    profession: 'अकाउंट्स / बैंकिंग (Accounts / Banking / Finance)',
    numbers: '85, 75',
    requiredDigits: [8, 5, 7],
    description: '85 (गणनाशील दिमाग) और 75 (वित्तीय विश्लेषक) बैंकिंग, बीमा व सीए प्रोफेशनल्स के लिए उपयुक्त हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 42 }
  },
  LAWYER: {
    profession: 'वकील / अधिवक्ता (Lawyer / Advocate)',
    numbers: '98, 31, 17',
    requiredDigits: [9, 8, 3, 1, 7],
    description: '98 (तार्किक वकालत), 31 (प्रशासनिक प्रतिष्ठा) और 17 (न्यायिक व सरकारी प्रभाव) वकीलों के लिए शुभ हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 42 }
  },
  JUDGE: {
    profession: 'न्यायाधीश (Judge / Judiciary)',
    numbers: '38, 17, 31',
    requiredDigits: [3, 8, 1, 7],
    description: '38 (न्यायिक संतुलन), 17 (सरकारी अधिकार) और 31 (नैतिक ज्ञान) न्यायाधीशों के लिए श्रेष्ठ संयोजन हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  LEADER_POLITICIAN: {
    profession: 'राजनेता / जननेता (Leader / Politician)',
    numbers: '19, 4, 31',
    requiredDigits: [1, 9, 4, 3],
    description: '19 (प्रचंड सूर्य तेज), 4 (कूटनीति) और 31 (जनसम्मान) राजनीति और सार्वजनिक नेतृत्व में शीर्ष स्थान दिलाते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  ARMY_POLICE_FIRE: {
    profession: 'सेना / पुलिस / रक्षा सेवा (Army / Police / Fire Services)',
    numbers: '19, 94',
    requiredDigits: [1, 9, 4],
    description: '19 (सूर्य-मंगल पराक्रम) और 94 (वर्दी वाले कार्य, साहसी व दबंग स्वभाव) रक्षा बलों के लिए अत्यंत अनुकूल हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  OCCULT_SCIENCE: {
    profession: 'गुप्त विज्ञान / ज्योतिष (Occult Science / Astrologer)',
    numbers: '371, 75, 25',
    requiredDigits: [3, 7, 1, 5, 2],
    description: '371, 75 (ज्योतिषीय ज्ञान) और 25 (जादुई हीलिंग व गुप्त अंतर्ज्ञान) ऑकल्ट रिसर्च में महारत देते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  HOSPITAL_COURT_WORK: {
    profession: 'अस्पताल / अदालत कर्मी (Working in Hospital / Court)',
    numbers: '54, 13, 17, 9',
    requiredDigits: [5, 4, 1, 3, 7, 9],
    description: '54, 13, 17 और 9 अस्पताल व न्यायालय परिसरों में काम करने वाले कर्मचारियों के लिए उपयुक्त हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  CONSULTANT: {
    profession: 'सलाहकार / कंसल्टेंट (Consultant / Advisor)',
    numbers: '37, 38',
    requiredDigits: [3, 7, 8],
    description: '37 (शीर्ष स्थान व प्रज्ञा) और 38 (मध्यस्थ व सलाहकार) स्वतंत्र कंसल्टेंसी में बड़ा मुकाम देते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  IRON_CHEMICAL_CONSTRUCTION: {
    profession: 'लोहा / रसायन / निर्माण (Iron / Chemical / Construction)',
    numbers: '8 (एक बार)',
    requiredDigits: [8],
    description: '8 को केवल एक बार शामिल करना निर्माण, रसायन व लौह उद्योग के लिए लाभकारी रहता है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  HEALER: {
    profession: 'उपचारक / रेकी / फिजियोथेरेपी (Healer / Reiki / Physiotherapy)',
    numbers: '17, 78, 9',
    requiredDigits: [1, 7, 8, 9],
    description: '17 (सकारात्मक संपर्क), 78 (आध्यात्मिक हीलिंग) और 9 (ऊर्जा संचरण) हीलर्स के लिए श्रेष्ठ हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  PLASTIC_MANUFACTURING: {
    profession: 'प्लास्टिक व्यापार / विनिर्माण (Plastic Business / Manufacturing)',
    numbers: '73, 51, 9',
    requiredDigits: [7, 3, 5, 1, 9],
    description: '73 (शीर्ष स्थान), 51 (व्यापारिक सफलता) और 9 (ऊर्जा) प्लास्टिक व मैन्युफैक्चरिंग में वृद्धि करते हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  HR_PR: {
    profession: 'मानव संसाधन / जनसंपर्क (HR / PR / Communications)',
    numbers: '57',
    requiredDigits: [5, 7],
    description: '57 (शानदार वाकपटुता व जनसंपर्क) एचआर और पीआर प्रोफेशनल्स के लिए अत्यंत शुभ है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  TAILORING_PHOTOGRAPHY: {
    profession: 'दर्जी, कपड़ा, परिधान व फोटोग्राफी (Tailoring, Garments, Photography)',
    numbers: '2 (अनिवार्य)',
    requiredDigits: [2],
    description: 'कपड़ा उद्योग, सिलाई, परिधान और फोटोग्राफी के लिए नंबर में 2 का होना अनिवार्य है।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  },
  ARTIST: {
    profession: 'कलाकार / संगीत / अभिनय (Artist / Creative Arts)',
    numbers: '2, 67, 69',
    requiredDigits: [2, 6, 7, 9],
    description: '2 (कल्पना), 67 (संगीत व कला प्रेमी) और 69 (रचनात्मक सोच) हर प्रकार के कलाकारों के लिए शुभ हैं।',
    source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 43 }
  }
};

// 7. Special 4-Digit PIN Numbers / Combinations from Day 1 PDF Pages 46-47
export const SPECIAL_PIN_COMBINATIONS: SpecialPinCombination[] = [
  { purpose: 'सुखी दांपत्य जीवन (Good Married Life)', numbers: ['2567', '5666', '5667'], description: 'पारिवारिक सौहार्द, प्रेम और वैवाहिक मधुरता को बढ़ावा देने वाले शोध आधारित 4-अंकीय पिन।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 46 } },
  { purpose: 'शिक्षा व अनुसंधान (Education & Research)', numbers: ['6555', '3569 (Research Work)'], description: 'उच्च शिक्षा, परीक्षा में एकाग्रता और शोध कार्यों में सफलता के लिए अनुकूल।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 46 } },
  { purpose: 'विदेश यात्रा व सैटलमेंट (Foreign Travel & Settlement)', numbers: ['3567 (Foreign Settlement)', '1113', '3579', '2756'], description: 'अंतरराष्ट्रीय यात्राएं, वीज़ा प्रक्रियाओं में सुगमता और विदेश में बसने के लिए।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 46 } },
  { purpose: 'उत्तम स्वास्थ्य व तंदुरुस्ती (Good Health)', numbers: ['3569'], description: 'जीवन शक्ति, आरोग्य और सकारात्मक ऊर्जा बनाए रखने में सहायक।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'प्रेम व पारिवारिक रिश्ते (Relationships)', numbers: ['3567'], description: 'आपसी तालमेल, समझदारी और पारिवारिक बंधनों को मजबूत करने के लिए।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'पदोन्नति व तरक्की (Promotion)', numbers: ['4368'], description: 'कार्यस्थल पर दृश्यता, वरिष्ठों का ध्यान और पदोन्नति के अवसरों में सहायक।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'भाग्य कारक (Luck Factor)', numbers: ['4566'], description: 'भाग्य और अप्रत्याशित अवसरों के आकर्षण के लिए।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'संकल्प व इच्छाशक्ति (Will Power)', numbers: ['1159'], description: 'कठिन समय में हार न मानने का दृढ़ निश्चय और मानसिक बल।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'अदालती मामलों में राहत (Court Case)', numbers: ['4488'], description: 'न्यायिक विवादों के निष्पक्ष समाधान व तनाव मुक्ति हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'धन आकर्षण (Money Attraction)', numbers: ['3467'], description: 'आर्थिक तरलता, ग्राहकों के प्रवाह और व्यापारिक लाभ हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'संपत्ति निर्माण व जमीन (Property)', numbers: ['2588'], description: 'भूमि, मकान व अचल संपत्ति के निर्माण और खरीद-फरोख्त हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'सरकारी नौकरी (Govt. Job)', numbers: ['1458'], description: 'सरकारी चयन परीक्षाओं, इंटरव्यू और प्रशासनिक पदों में सफलता हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'मकान निर्माण (House Construction)', numbers: ['4568'], description: 'घर का निर्माण शुरू करने और उसे सफलतापूर्वक पूरा करने में सहायक।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'व्यापार वृद्धि (Business Growth)', numbers: ['1159', '1559'], description: 'नए व्यापारिक विस्तार, नकद प्रवाह और ब्रांड प्रतिष्ठा वृद्धि हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'राजनीतिक प्रभाव (Politics)', numbers: ['1348'], description: 'सार्वजनिक संगठन, राजनीतिक प्रभाव और जनसमूह को आकर्षित करने हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'समृद्धि व ऐश्वर्य (Prosperity)', numbers: ['1668'], description: 'दीर्घकालिक वैभव, संपन्नता और भौतिक सुखों की प्राप्ति हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } },
  { purpose: 'मानसिक शांति (Peace of Mind)', numbers: ['4556', '5151'], description: 'अनावश्यक चिंताओं से मुक्ति, आंतरिक शांति और एकाग्रता हेतु।', source: { ...SOURCES.LEOFAMILY_MOBILE_PDF_D1, page: 47 } }
];

// 8. Negative Pairs to Avoid from Day 1 PDF Page 5
export const NEGATIVE_PAIRS_TO_AVOID = [
  '14', '41', '16', '61', '18', '81',
  '23', '32', '24', '42', '26', '62', '27', '72', '28', '82',
  '34', '43', '45', '54', '46', '64', '48', '84',
  '58', '85', '56', '65', '68', '86', '79', '97', '89', '98'
];

// 9. Planetary Role & Friend / Enemy / Neutral Matrix from Day 1 PDF Page 2
export const PLANETARY_ROLES_AND_COMPATIBILITY: Record<number, {
  role: string;
  roleHindi: string;
  planet: string;
  planetHindi: string;
  friends: number[];
  enemies: number[];
  neutrals: number[];
}> = {
  1: { role: 'KING', roleHindi: 'राजा', planet: 'Sun', planetHindi: 'सूर्य', friends: [1, 2, 3, 5, 6, 9], enemies: [8, 4], neutrals: [4, 7] },
  2: { role: 'QUEEN', roleHindi: 'रानी', planet: 'Moon', planetHindi: 'चंद्र', friends: [1, 2, 3, 5], enemies: [8, 4, 9], neutrals: [6, 7, 9] },
  3: { role: 'TEACHER', roleHindi: 'गुरु / शिक्षक', planet: 'Jupiter', planetHindi: 'बृहस्पति', friends: [1, 2, 3, 5, 7], enemies: [6], neutrals: [4, 6, 7, 8, 9] },
  4: { role: 'MYSTERIOUS', roleHindi: 'रहस्यमयी', planet: 'Uranus / Rahu', planetHindi: 'राहु', friends: [1, 5, 6, 7, 4, 8], enemies: [2, 4, 8, 9], neutrals: [3] },
  5: { role: 'PRINCE', roleHindi: 'राजकुमार', planet: 'Mercury', planetHindi: 'बुध', friends: [1, 2, 3, 5, 6], enemies: [9], neutrals: [4, 7, 8, 9] },
  6: { role: 'TEACHER', roleHindi: 'दैत्य गुरु', planet: 'Venus', planetHindi: 'शुक्र', friends: [1, 5, 6, 7], enemies: [3], neutrals: [2, 3, 4, 8, 9] },
  7: { role: 'SAINT', roleHindi: 'संत', planet: 'Neptune / Ketu', planetHindi: 'केतु', friends: [1, 3, 4, 5, 6], enemies: [9], neutrals: [2, 7, 8, 9] },
  8: { role: 'JUDGE', roleHindi: 'न्यायाधीश', planet: 'Saturn', planetHindi: 'शनि', friends: [3, 4, 5, 6, 7, 8], enemies: [1, 2, 4, 8], neutrals: [9] },
  9: { role: 'COMMANDER', roleHindi: 'सेनापति', planet: 'Mars', planetHindi: 'मंगल', friends: [1, 3, 5, 6], enemies: [2, 4], neutrals: [6, 7, 8, 9] }
};

// Helper: Zero-Replacement Transformation (Exact LeoFamily Course PDF Day 1 Rule)
export function applyZeroReplacement(mobileDigits: string): string {
  if (!mobileDigits || mobileDigits.length === 0) return '';
  const clean = mobileDigits.replace(/[^0-9]/g, '');
  const chars = clean.split('');
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === '0') {
      chars[i] = chars[i - 1];
    }
  }
  return chars.join('');
}

// Generate adjacent pairs from a 10-digit number
export function extractAdjacentPairs(numStr: string): string[] {
  const clean = numStr.replace(/[^0-9]/g, '');
  const pairs: string[] = [];
  for (let i = 0; i < clean.length - 1; i++) {
    pairs.push(clean.substring(i, i + 2));
  }
  return pairs;
}

// Register mobile definitions in methodology registry
methodologyRegistry.registerRule({
  id: 'MOBILE_ZERO_REPLACEMENT_RULE',
  category: 'MOBILE',
  ruleName: 'LeoFamily Zero-Replacement Analytical Transformation',
  system: 'LEOFAMILY',
  source: SOURCES.LEOFAMILY_MOBILE_PDF_D1,
  description: 'In mobile numbers with zeros, replace each zero with the preceding digit for modified positional analysis.',
  interpretation: 'Reveals hidden underlying frequency currents while preserving the original number for baseline records.',
  confidence: 100,
  safetyLevel: 'SAFE'
});
