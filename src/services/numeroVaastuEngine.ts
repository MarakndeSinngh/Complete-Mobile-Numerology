import { reduceToSingleDigit } from './numerologyEngine';
import { computeLoshuAnalysis } from './loshuEngine';

export interface VaastuDirectionDetails {
  direction: string;
  degreeRange: string;
  element: string;
  dynamicInfluence: string;
  description?: string;
}

export interface NumeroVaastuReport {
  kuaNumber: number;
  groupType: 'EAST_GROUP' | 'WEST_GROUP';
  groupDescription: string;
  rulingElement?: string;
  remedies?: any;
  loShuVaastuRemedies?: any;
  directions: {
    success: VaastuDirectionDetails;
    health: VaastuDirectionDetails;
    family: VaastuDirectionDetails;
    personalDev: VaastuDirectionDetails;
    business: VaastuDirectionDetails;
    career: VaastuDirectionDetails;
    wealth: VaastuDirectionDetails;
    luckyList: string[];
    avoidList: string[];
  };
  colourCorrection: {
    luckyColours: string[];
    balanceColours: string[];
    antiColours: string[];
    homeColourSuggestions: string;
    officeColourSuggestions: string;
    bedroomColourSuggestions: string;
    vehicleColourSuggestions: string;
  };
  zonesReport: {
    careerZone: { status: string; element: string; details: string; enhancement: string };
    moneyZone: { status: string; element: string; details: string; enhancement: string };
    relationshipZone: { status: string; element: string; details: string; enhancement: string };
    healthZone: { status: string; element: string; details: string; enhancement: string };
    educationZone: { status: string; element: string; details: string; enhancement: string };
    spiritualZone: { status: string; element: string; details: string; enhancement: string };
  };
  remedyPlan: {
    targetMissingNodes: string[];
    remedyCards: {
      number: number;
      zoneName: string;
      flawDetails: string;
      directionRemedy: string;
      colourRemedy: string;
      placementRemedy: string;
      energyCorrection: string;
      actionItem: string;
    }[];
  };
}

export type NumeroVaastuResult = NumeroVaastuReport;


export function calculateKuaNumber(year: number, gender: 'MALE' | 'FEMALE' | 'OTHER' = 'MALE'): number {
  let sum = Math.abs(year).toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  let kua = 0;
  if (gender === 'FEMALE') {
    if (year >= 2000) {
      kua = sum + 6;
    } else {
      kua = sum + 4;
    }
  } else {
    if (year >= 2000) {
      kua = 9 - sum;
    } else {
      kua = 11 - sum;
    }
  }
  while (kua > 9) {
    kua = kua.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  if (kua <= 0) {
    kua = 9;
  }

  if (kua === 5) {
    kua = gender === 'FEMALE' ? 8 : 2;
  }
  return kua;
}

export function generateNumeroVaastuReport(dobStr: string, gender: 'MALE' | 'FEMALE' | 'OTHER' = 'MALE', name: string = ''): NumeroVaastuReport {
  const parts = dobStr.split('-');
  const year = parseInt(parts[0], 10) || 1990;

  const kuaNumber = calculateKuaNumber(year, gender);
  const groupType = [1, 3, 4, 9].includes(kuaNumber) ? 'EAST_GROUP' : 'WEST_GROUP';
  const groupDescription = groupType === 'EAST_GROUP' 
    ? `ईस्ट ग्रुप (East Group): आपकी ऊर्जा पूर्व, आग्नेय (दक्षिण-पूर्व), उत्तर और दक्षिण दिशाओं के साथ गहरा सामंजस्य रखती है। अपने वर्कस्पेस और मुख्य द्वार को इन दिशाओं के अनुकूल रखने से कार्य में गति और समृद्धि मिलती है।`
    : `वेस्ट ग्रुप (West Group): आपकी ऊर्जा पश्चिम, वायव्य (उत्तर-पश्चिम), नैऋत्य (दक्षिण-पश्चिम) और ईशान (उत्तर-पूर्व) दिशाओं के साथ अनुकूल है। रुकावटों से बचने और स्थिरता पाने के लिए अपने बैठने और कार्य करने का स्थान इन्हीं दिशाओं में रखें।`;

  // Eight Mansions mapping
  const groupDirections: Record<number, {
    success: VaastuDirectionDetails;
    health: VaastuDirectionDetails;
    family: VaastuDirectionDetails;
    personalDev: VaastuDirectionDetails;
    business: VaastuDirectionDetails;
    career: VaastuDirectionDetails;
    wealth: VaastuDirectionDetails;
    luckyList: string[];
    avoidList: string[];
  }> = {
    1: {
      success: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'व्यापार में तीव्र वृद्धि, समृद्धि और धन प्राप्ति के नए अवसर आकर्षित करता है।' },
      health: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'शीघ्र शारीरिक स्वास्थ्य लाभ, गहरी नींद और उत्तम स्फूर्ति प्रदान करता है।' },
      family: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'पारिवारिक सौहार्द, वैवाहिक सुख और बच्चों की पढ़ाई में उन्नति बनाए रखता है।' },
      personalDev: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'आत्म-अनुशासन, मानसिक शांति और ध्यान व एकाग्रता को मजबूत करता है।' },
      business: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'अपनी बिलिंग या मुख्य कार्यकुर्सी पर बैठते समय इस दिशा की ओर मुख करना सर्वोत्तम है।' },
      career: { direction: 'North', degreeRange: 'N', element: 'Water', dynamicInfluence: 'करियर में त्वरित पदोन्नति के लिए कंप्यूटर टेबल इस दिशा में उत्तर मुखी रखें।' },
      wealth: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'अपनी तिजोरी या कैश बॉक्स को हरे आधार के साथ इस क्षेत्र में स्थापित करें।' },
      luckyList: ['Southeast', 'East', 'South', 'North'],
      avoidList: ['Southwest', 'Northeast', 'Northwest', 'West']
    },
    2: {
      success: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'शिक्षा, गहन शोध और कॉर्पोरेट रणनीतिक निर्णयों में सफलता दिलाता है।' },
      health: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'शारीरिक शक्ति, श्वसन प्रणाली और मजबूत रोग प्रतिरोधक क्षमता का विकास करता है।' },
      family: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'सच्चे मार्गदर्शक, मददगार मित्र और ग्राहकों से अनुकूल संबंध आकर्षित करता है।' },
      personalDev: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'मानसिक ठहराव, स्मरण शक्ति और भावनात्मक नियंत्रण को सुदृढ़ करता है।' },
      business: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'कॉर्पोरेट मीटिंग या बोर्डरूम की व्यवस्था के लिए यह दिशा अत्यंत शुभ है।' },
      career: { direction: 'Northwest', degreeRange: 'NW', element: 'Metal', dynamicInfluence: 'व्यापारिक संचार उपकरण या फोन चार्जर इस क्षेत्र में रखना लाभकारी है।' },
      wealth: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'इस क्षेत्र में सुनहरी रेत से भरा मिट्टी का कलश या पिरामिड स्थापित करें।' },
      luckyList: ['Northeast', 'West', 'Northwest', 'Southwest'],
      avoidList: ['North', 'South', 'East', 'Southeast']
    },
    3: {
      success: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'सामाजिक प्रतिष्ठा, ब्रांड विस्तार और व्यापारिक बिक्री में तीव्र गति लाता है।' },
      health: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'मानसिक तनाव कम करता है और तंत्रिका तंत्र को शांति प्रदान करता है।' },
      family: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'रिश्तेदारों से मधुर संबंध और घरेलू विवादों से सुरक्षा प्रदान करता है।' },
      personalDev: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'गहन स्मरण शक्ति और योग-साधना में एकाग्रता विकसित करता है।' },
      business: { direction: 'South', degreeRange: 'S', element: 'Fire', dynamicInfluence: 'महत्वपूर्ण बैठकों में नेतृत्व क्षमता और प्रभाव बनाए रखने हेतु दक्षिण मुखी बैठें।' },
      career: { direction: 'East', degreeRange: 'E', element: 'Wood', dynamicInfluence: 'अपने प्रमाण पत्र और उपलब्धियों की तस्वीरें पूर्व दिशा की दीवार पर लगाएं।' },
      wealth: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'नकद प्रवाह सक्रिय करने हेतु इस क्षेत्र में लकड़ी की विंड चाइम लगाएं।' },
      luckyList: ['South', 'North', 'Southeast', 'East'],
      avoidList: ['West', 'Northwest', 'Southwest', 'Northeast']
    },
    4: {
      success: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'करियर के नए अवसर, वेतन वृद्धि और व्यावसायिक पूछताछ को कई गुना बढ़ाता है।' },
      health: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'हृदय स्वास्थ्य और शरीर के तापमान व ऊर्जा का उचित संतुलन बनाए रखता है।' },
      family: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'पारिवारिक सदस्यों और जीवनसाथी के बीच गहरा प्रेम व विश्वास बढ़ाता है।' },
      personalDev: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'रचनात्मक सोच और नई योजनाओं की रूपरेखा बनाने में मदद करता है।' },
      business: { direction: 'North', degreeRange: 'N', element: 'Water', dynamicInfluence: 'व्यापारिक कैटलॉग और महत्वपूर्ण फाइलें रखने के लिए सर्वोत्तम स्थान।' },
      career: { direction: 'Southeast', degreeRange: 'SE', element: 'Wood', dynamicInfluence: 'इस दिशा में बैठकर हरे रंग की कलम से अपनी व्यावसायिक डायरी या योजनाएं लिखें।' },
      wealth: { direction: 'North', degreeRange: 'N', element: 'Water', dynamicInfluence: 'इस क्षेत्र में स्वच्छ जल से भरा एक सुंदर कांच का पात्र रखें।' },
      luckyList: ['North', 'South', 'East', 'Southeast'],
      avoidList: ['Northeast', 'Southwest', 'West', 'Northwest']
    },
    6: {
      success: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'स्थिर नकदी प्रवाह, प्रोजेक्ट्स में सफलता और संपत्ति निर्माण को गति देता है।' },
      health: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'मानसिक स्थिरता और स्नायु तंत्र की मजबूती को सुरक्षित रखता है।' },
      family: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'वैवाहिक सहयोग और सहकर्मियों से वफादारी व निष्ठा प्राप्त कराता है।' },
      personalDev: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'विश्लेषणात्मक दृष्टि बढ़ाता है और सटीक ऑडिट व निर्णय में सहायक है।' },
      business: { direction: 'West', degreeRange: 'W', element: 'Metal', dynamicInfluence: 'नकद रसीदें या धातु का पैमाना (Metal Scale) इस क्षेत्र में रखें।' },
      career: { direction: 'Northwest', degreeRange: 'NW', element: 'Metal', dynamicInfluence: 'विदेश व्यापार, वीजा दस्तावेज या विदेशी क्लाइंट्स से संवाद के लिए उत्तम क्षेत्र।' },
      wealth: { direction: 'West', degreeRange: 'W', element: 'Metal', dynamicInfluence: 'इस क्षेत्र में धातु के पात्र में एक चांदी का सिक्का रखें।' },
      luckyList: ['West', 'Northeast', 'Southwest', 'Northwest'],
      avoidList: ['Southeast', 'East', 'North', 'South']
    },
    7: {
      success: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'धन संचय और रणनीतिक निवेशों से लाभ प्राप्ति में तेजी लाता है।' },
      health: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'पाचन तंत्र को मजबूत करता है और अज्ञात पेट संबंधी विकारों से बचाता है।' },
      family: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'परिवार के वरिष्ठ सदस्यों के साथ आदरपूर्ण व मधुर संबंध स्थापित करता है।' },
      personalDev: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'आत्मज्ञान की प्रेरणा देता है और मानसिक अवसाद से सुरक्षा प्रदान करता है।' },
      business: { direction: 'West', degreeRange: 'W', element: 'Metal', dynamicInfluence: 'बड़े निवेशकों या पार्टनर्स से बैठक करने के लिए उत्तम दिशा।' },
      career: { direction: 'Northwest', degreeRange: 'NW', element: 'Metal', dynamicInfluence: 'अपनी कॉर्पोरेट रणनीति या बिजनेस मैप को उत्तर-पश्चिम दीवार पर लगाएं।' },
      wealth: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'इस क्षेत्र में एक छोटा पीला क्रिस्टल पिरामिड स्थापित करें।' },
      luckyList: ['West', 'Southwest', 'Northeast', 'Northwest'],
      avoidList: ['Southeast', 'East', 'North', 'South']
    },
    8: {
      success: { direction: 'Southwest (नैऋत्य - SW)', degreeRange: '202.5° to 247.5°', element: 'Earth', dynamicInfluence: 'मजबूत व्यापारिक साझेदारी और व्यावसायिक अधिकार स्थापित करता है।' },
      health: { direction: 'Northwest (वायव्य - NW)', degreeRange: '292.5° to 337.5°', element: 'Metal', dynamicInfluence: 'गहरी आरामदायक नींद और शारीरिक ऊर्जा की पुनर्प्राप्ति में सहायक।' },
      family: { direction: 'West (पश्चिम - W)', degreeRange: '247.5° to 292.5°', element: 'Metal', dynamicInfluence: 'दीर्घकालिक सामाजिक तालमेल और पारिवारिक सहयोग सुनिश्चित करता है।' },
      personalDev: { direction: 'Northeast (ईशान - NE)', degreeRange: '22.5° to 67.5°', element: 'Earth', dynamicInfluence: 'प्रशासनिक स्पष्टता और गंभीर कार्यों में गहन एकाग्रता लाता है।' },
      business: { direction: 'Southwest', degreeRange: 'SW', element: 'Earth', dynamicInfluence: 'भारी अलमारियां, रिकॉर्ड्स या महत्वपूर्ण बहीखाते यहां स्थापित करें।' },
      career: { direction: 'Northeast', degreeRange: 'NE', element: 'Earth', dynamicInfluence: 'एकाग्रता और मानसिक स्पष्टता के लिए पूर्व/उत्तर-पूर्व की ओर मुख करके बैठें।' },
      wealth: { direction: 'Southwest', degreeRange: 'SW', element: 'Earth', dynamicInfluence: 'सोने के आभूषण या संपत्ति के कागजात दक्षिण-पश्चिम की तिजोरी में रखें।' },
      luckyList: ['Southwest', 'Northwest', 'West', 'Northeast'],
      avoidList: ['Southeast', 'East', 'South', 'North']
    },
    9: {
      success: { direction: 'East (पूर्व - E)', degreeRange: '67.5° to 112.5°', element: 'Wood', dynamicInfluence: 'उच्च महत्वाकांक्षा, व्यापारिक बिक्री और बाजार में दबदबा कायम करता है।' },
      health: { direction: 'Southeast (आग्नेय - SE)', degreeRange: '112.5° to 157.5°', element: 'Wood', dynamicInfluence: 'हृदय और मेटाबॉलिज्म की कार्यप्रणाली को संतुलित रखता है।' },
      family: { direction: 'North (उत्तर - N)', degreeRange: '337.5° to 22.5°', element: 'Water', dynamicInfluence: 'भावनात्मक सौहार्द और पड़ोसियों व परिजनों से मधुर संबंध सुनिश्चित करता है।' },
      personalDev: { direction: 'South (दक्षिण - S)', degreeRange: '157.5° to 202.5°', element: 'Fire', dynamicInfluence: 'साहस, शारीरिक संकल्प और योगिक ऊर्जा को गहरा करता है।' },
      business: { direction: 'East', degreeRange: 'E', element: 'Wood', dynamicInfluence: 'मार्केटिंग टीम और मुख्य वर्कस्टेशन स्थापित करने के लिए उत्कृष्ट दिशा।' },
      career: { direction: 'South', degreeRange: 'S', element: 'Fire', dynamicInfluence: 'अपनी डेस्क के पीछे पुरस्कार, शील्ड और अग्नि तत्व के प्रतीक प्रदर्शित करें।' },
      wealth: { direction: 'East', degreeRange: 'E', element: 'Wood', dynamicInfluence: 'इस दिशा में पानी के बर्तन में तेजी से बढ़ने वाला बांस का पौधा (Bamboo Plant) रखें।' },
      luckyList: ['East', 'Southeast', 'North', 'South'],
      avoidList: ['Northwest', 'West', 'Northeast', 'Southwest']
    }
  };

  const currentDirections = groupDirections[kuaNumber] || groupDirections[1];

  // Colour Correction Engine
  const colourEngine: Record<number, {
    luckyColours: string[];
    balanceColours: string[];
    antiColours: string[];
    homeColourSuggestions: string;
    officeColourSuggestions: string;
    bedroomColourSuggestions: string;
    vehicleColourSuggestions: string;
  }> = {
    1: {
      luckyColours: ['Emerald Green', 'Light Lime', 'Mint'],
      balanceColours: ['Lemon Yellow', 'Soft Blue', 'Charcoal'],
      antiColours: ['Pink', 'Deep Ruby Red', 'Gold'],
      homeColourSuggestions: 'लिविंग रूम की मुख्य दीवारों पर हल्का पेस्टल हरा या वार्म बेज (Beige) रंग कराएं ताकि आग्नेय कोण (Southeast) के काष्ठ तत्व को पोषण मिले और समृद्धि बढ़े।',
      officeColourSuggestions: 'ऑफिस के बैकग्राउंड स्क्रीन या फाइल फोल्डर एमराल्ड ग्रीन (Emerald Green) टोन में रखें ताकि वित्तीय लेनदेन में गति बनी रहे।',
      bedroomColourSuggestions: 'बेडरूम में सुखद क्रीम और पेस्टल ग्रीन कॉटन बेडशीट का उपयोग करें जिससे मानसिक शांति और गहरी नींद मिले।',
      vehicleColourSuggestions: 'सफर में सुरक्षा और अनुकूलता के लिए पर्ल व्हाइट, मैटेलिक सिल्वर या स्लेट ग्रीन रंग के वाहन को प्राथमिकता दें।'
    },
    2: {
      luckyColours: ['Soft Gold', 'Lemon Yellow', 'Warm Sand', 'Clay Beige'],
      balanceColours: ['Diamond White', 'Dull Silver', 'Warm Ivory'],
      antiColours: ['Bright Forest Green', 'Dark Emerald Decor'],
      homeColourSuggestions: 'घर के प्रवेश द्वार पर वार्म सैंडी येलो या आइवरी टोन का प्रयोग करें। दक्षिण-पश्चिम कोने में टेराकोटा क्ले की कलाकृतियां रखें।',
      officeColourSuggestions: 'कारोबारी बातचीत और सौदों में स्थिरता लाने के लिए भारी लकड़ी के फर्नीचर और सैंड-कलर लेदर सीटिंग का उपयोग करें।',
      bedroomColourSuggestions: 'दक्षिण-पश्चिम (SW) की ऊर्जा संतुलित करने के लिए हल्के क्रीम, लाइट पीच या वार्म बेज पर्दों और तकियों का इस्तेमाल करें।',
      vehicleColourSuggestions: 'सर्वोत्तम सुरक्षा और सकारात्मक ऊर्जा के लिए गोल्डन ब्रॉन्ज, सैंड बेज या सफेद रंग के वाहन चुनें।'
    },
    3: {
      luckyColours: ['Vermilion Red', 'Deep Orange', 'Warm Saffron', 'Coral'],
      balanceColours: ['Forest Green', 'Ivory', 'Gold'],
      antiColours: ['Midnight Black', 'Deep Indigo Blue'],
      homeColourSuggestions: 'सामाजिक मान-सम्मान और यश में वृद्धि हेतु दक्षिण (South) लिविंग रूम में वार्म टेराकोटा या केसरिया रंग के शोपीस रखें।',
      officeColourSuggestions: 'ऑफिस रिसेप्शन दीवार पर महोगनी टेक्सचर या एनर्जेटिक केसरिया लोगो और शेड्स का उपयोग करें।',
      bedroomColourSuggestions: 'आपसी प्रेम, समझ और भावनात्मक जुड़ाव बढ़ाने के लिए हल्के कोरल पिंक या लाइट ऑरेंज बेडशीट का प्रयोग करें।',
      vehicleColourSuggestions: 'गाड़ी के लिए मैटेलिक रेड, केसरिया या गोल्डन रंग उत्तम है। डार्क ब्लू या जेट ब्लैक से परहेज करें।'
    },
    4: {
      luckyColours: ['Light Blue', 'Ocean Turquoise', 'Deep Teal'],
      balanceColours: ['Sandalwood White', 'Lime and Mint Green'],
      antiColours: ['Saffron Ivory', 'Bright Lemon Yellow', 'Gold'],
      homeColourSuggestions: 'करियर में ग्रोथ के लिए उत्तर (North) दिशा को हल्के ओशन ब्लू वॉलपेपर या लाइट फिरोजी कुशन से सजाएं।',
      officeColourSuggestions: 'कार्यस्थल पर गहरे नीले रंग के पेन स्टैंड या छोटे वाटर फाउंटेन के साथ लाइटिंग रखें।',
      bedroomColourSuggestions: 'अत्यधिक मानसिक विचारों को शांत करने के लिए पाउडर ब्लू और हल्के क्रीम रंग के फैब्रिक का उपयोग करें।',
      vehicleColourSuggestions: 'यात्रा में सुरक्षा और शांति के लिए नेवी ब्लू, डार्क टील या क्लासिक सिल्वर रंग के वाहन चुनें।'
    },
    6: {
      luckyColours: ['Classic Silver', 'Steel Grey', 'Snow White'],
      balanceColours: ['Lemon Yellow', 'Warm Clay Beige'],
      antiColours: ['Fiery Red', 'Hot Cherry Pink'],
      homeColourSuggestions: 'पश्चिम (West) दिशा की समृद्धि के लिए सफेद सीलिंग के साथ सुंदर प्यूटर मेटल के सजावटी कटोरे या शोपीस रखें।',
      officeColourSuggestions: 'त्वरित और सटीक निर्णयों के लिए ऑफिस में ब्रश्ड स्टील डेस्क या क्रोम लैंप का उपयोग करें।',
      bedroomColourSuggestions: 'शांत और आरामदायक नींद के वातावरण के लिए हल्के ग्रे और स्नो-व्हाइट चादरों का चयन करें।',
      vehicleColourSuggestions: 'रॉयल सिल्वर, ग्लॉसी ग्रे या सफेद रंग की गाड़ी चुनें। तेज लाल रंग से बचें।'
    },
    7: {
      luckyColours: ['Charcoal Grey', 'Pewter Grey', 'Pure White'],
      balanceColours: ['Pastel Yellow', 'Ivory Cream'],
      antiColours: ['Orange', 'Fiery Mars Red'],
      homeColourSuggestions: 'उत्तर-पश्चिम (NW) दिशा में चारकोल हाइलाइट्स और समर्थन व सहयोग पाने के लिए एलाबास्टर फूलदान का प्रयोग करें।',
      officeColourSuggestions: 'हाई-कंट्रास्ट मोनोक्रोम लेआउट अपनाएं (सफेद डेस्क के साथ ग्रे कलर की फाइलें व एक्सेसरीज)।',
      bedroomColourSuggestions: 'सुखद सपनों और मानसिक शांति के लिए हल्के ग्रे और वैनिला रंग के पर्दों का प्रयोग करें।',
      vehicleColourSuggestions: 'सुरक्षित यात्रा के लिए पर्ल ग्रेफाइट, स्पेस ग्रे या सैटिन सिल्वर वाहन को प्राथमिकता दें।'
    },
    8: {
      luckyColours: ['Pale Ochre', 'Terracotta', 'Saffron Yellow'],
      balanceColours: ['Brushed Platinum', 'Chrome', 'Pure White'],
      antiColours: ['Leaf Green', 'Teal Green', 'Mint'],
      homeColourSuggestions: 'निवेश को सुरक्षित और स्थिर रखने के लिए दक्षिण-पश्चिम (SW) में वार्म सैंड, टेराकोटा टाइल्स या हल्का पीला रंग चुनें।',
      officeColourSuggestions: 'टीम में स्थिरता बनाए रखने के लिए भारी मार्बल डेस्क, सेरेमिक मग और वार्म गोल्डन लाइटिंग का इस्तेमाल करें।',
      bedroomColourSuggestions: 'नींद के चक्र को स्थिर और गहरा करने के लिए सॉफ्ट मस्टर्ड, हल्का पीला या ऑर्गेनिक सैंड रंग की चादरें प्रयोग करें।',
      vehicleColourSuggestions: 'डेजर्ट सैंड, शैंपेन गोल्ड या पर्ल व्हाइट रंग की गाड़ी चुनें। गहरे हरे रंग से बचें।'
    },
    9: {
      luckyColours: ['Emerald Green', 'Lime Green', 'Warm Saffron'],
      balanceColours: ['Coral Red', 'Peach Pink', 'Pure Ivory'],
      antiColours: ['Metallic Charcoal', 'Platinum Grey'],
      homeColourSuggestions: 'पूर्व (East) दिशा में लकड़ी के गमलों में हरे पौधे लगाएं या दीवारों पर हल्का मिंट ग्रीन पेंट कराएं।',
      officeColourSuggestions: 'अपनी डेस्क पर गहरे हरे रंग के एग्जीक्यूटिव फोल्डर या जेड स्टोन (Jade Stone) पेपरवेट रखें।',
      bedroomColourSuggestions: 'मंगल की ऊर्जा और विलासिता में संतुलन के लिए सॉफ्ट पीच पिंक और बैम्बू ग्रीन लिनन का उपयोग करें।',
      vehicleColourSuggestions: 'मैटेलिक केसरिया, एमराल्ड ग्रीन या पर्ल व्हाइट रंग की गाड़ी चुनें। गहरे स्लेटी रंग से बचें।'
    }
  };

  const currentColours = colourEngine[kuaNumber] || colourEngine[1];

  // Zones Report (Traditional Vastu 16 Zones condensed to 6 Core Zones)
  // We can customize the zones based on Kua number or general Vastu alignments
  const zonesReport = {
    careerZone: {
      status: [1, 4, 9].includes(kuaNumber) ? 'अत्यंत सक्रिय व शुभ' : 'सामान्य (सक्रिय करने की आवश्यकता)',
      element: 'Water (North)',
      details: 'यह क्षेत्र आपके करियर, पेशेवर पदोन्नति, नए क्लाइंट्स के अनुबंध और जीवन की दिशा को नियंत्रित करता है।',
      enhancement: 'कंप्यूटर टेबल पर नीले रंग के धातु के फूलदान में जल रखें या काला ग्लास रखें। यहां भारी मिट्टी के गमले या लाल डस्टबिन रखने से बचें।'
    },
    moneyZone: {
      status: [1, 3, 9].includes(kuaNumber) ? 'सशक्त धन प्रवाह' : 'संवेदनशील (उपाय आवश्यक)',
      element: 'Wood (Southeast)',
      details: 'यह क्षेत्र निरंतर नकदी प्रवाह (Liquid Cash), व्यापारिक सौदों में लाभ और धन संचय की गति तय करता है।',
      enhancement: 'आग्नेय (SE) की खिड़की पर कांच की बोतल में हरा मनी प्लांट लगाएं। इस क्षेत्र में चमकीला हरा पायदान रखें।'
    },
    relationshipZone: {
      status: [2, 6, 8].includes(kuaNumber) ? 'स्थिर व मधुर पारिवारिक संबंध' : 'नाजुक (सामंजस्य की आवश्यकता)',
      element: 'Earth (Southwest)',
      details: 'यह वैवाहिक सुख, आपसी समझ, पार्टनरशिप और पारिवारिक स्थिरता का प्रमुख केंद्र है।',
      enhancement: 'दक्षिण-पश्चिम (SW) कोने में मिट्टी का शोपीस या सैंड पिरामिड रखें। गोल्डन फ्रेम में माता-पिता या जीवनसाथी की मुस्कुराती तस्वीर लगाएं।'
    },
    healthZone: {
      status: [1, 2, 3].includes(kuaNumber) ? 'उत्तम स्वास्थ्य व सकारात्मक ऊर्जा' : 'ऊर्जा ह्रास संभव (सक्रिय करें)',
      element: 'Earth/Air (Northeast & East)',
      details: 'यह क्षेत्र शारीरिक स्वास्थ्य, मानसिक शांति और शरीर में नई ऊर्जा के संचार को बनाए रखता है।',
      enhancement: 'ईशान कोण (NE) को पूरी तरह साफ, हल्का और खुला रखें। रात भर तांबे के बर्तन में रखा जल सुबह पिएं। यहां कोई भारी मशीनरी न रखें।'
    },
    educationZone: {
      status: [2, 3, 8].includes(kuaNumber) ? 'उच्च बौद्धिक एकाग्रता' : 'एकाग्रता बढ़ाने की आवश्यकता',
      element: 'Earth/Metal (Northeast/West)',
      details: 'यह बच्चों की एकाग्रता, पढ़ाई में मन लगना, परीक्षा में सफलता और तार्किक क्षमता को बढ़ाता है।',
      enhancement: 'स्टडी टेबल पर किताबें व्यवस्थित रखें। पीतल का एक छोटा ग्लोब रखें और पढ़ाई शुरू करने से पहले इसे तीन बार घुमाएं।'
    },
    spiritualZone: {
      status: [3, 7, 8].includes(kuaNumber) ? 'गहरा आत्मिक जुड़ाव' : 'मध्यम (नियमित ध्यान आवश्यक)',
      element: 'Water/Earth (Northeast/West)',
      details: 'यह ध्यान की गहराई, अंतर्ज्ञान (Intuition), मानसिक संतुलन और ईश्वरीय कृपा का संचालन करता है।',
      enhancement: 'ईशान कोण (NE) में पूजा घर या ध्यान स्थल बनाएं। शुद्ध चंदन की सुगंध और गाय के घी का दीपक जलाकर सकारात्मक ऊर्जा आकर्षित करें।'
    }
  };

  // Lo Shu + Vaastu integration remedies
  const lGrid = computeLoshuAnalysis(dobStr, name);
  const targetMissingNodes = lGrid.missingNumbers.map(n => n.toString());

  const possibleRemedies: Record<number, {
    number: number;
    zoneName: string;
    flawDetails: string;
    directionRemedy: string;
    colourRemedy: string;
    placementRemedy: string;
    energyCorrection: string;
    actionItem: string;
  }> = {
    8: {
      number: 8,
      zoneName: 'South-West (नैऋत्य) - Earth Stability Zone',
      flawDetails: 'Lo Shu में 8 नंबर (शनि) मिसिंग होने से प्रॉपर्टी बनने में रुकावट, पैसों का अटकना और मानसिक असंतोष हो सकता है।',
      directionRemedy: 'व्यापारिक फैसलों और निवेश की समीक्षा करते समय दक्षिण-पश्चिम (SW) दिशा की ओर मुख करें।',
      colourRemedy: 'इन कोनों में गेरुआ, पीला, टेराकोटा या मिट्टी के भूरे रंग के पर्दे और पायदान अपनाएं।',
      placementRemedy: 'शनि की ऊर्जा स्थिर करने के लिए दक्षिण-पश्चिम में सुनहरी रेत से भरे मिट्टी के भारी गमले रखें।',
      energyCorrection: 'शनिवार की शाम सूर्यास्त के समय दक्षिण-पश्चिम की खिड़की पर तिल के तेल या सरसों के तेल का दीपक जलाएं।',
      actionItem: 'शनिवार को जरूरतमंदों को काले चने, भोजन या कंबल का दान करें।'
    },
    5: {
      number: 5,
      zoneName: 'Brahmasthan (ब्रह्मस्थान) - Centre Zone of Absolute Balance',
      flawDetails: 'Lo Shu में 5 नंबर (बुध/ब्रह्मस्थान) मिसिंग होने से व्यापारिक निर्णयों में चूक, अनुबंधों में अस्थिरता और संवाद में गलतफहमियां होती हैं।',
      directionRemedy: 'महत्वपूर्ण बिजनेस कॉल्स करते समय घर के ठीक केंद्र (ब्रह्मस्थान) में खड़े होकर उत्तर दिशा की ओर मुख करें।',
      colourRemedy: 'लिविंग रूम के केंद्रीय क्षेत्र में हल्का हरा, मिंट या एमराल्ड ग्रीन रंग का प्रयोग करें।',
      placementRemedy: 'घर के केंद्र में पीतल या कांसे की थाली में ग्रीन जेड (Jade) क्रिस्टल या हरा पौधा रखें।',
      energyCorrection: 'ब्रह्मस्थान को भारी लोहे के बीम, गंदगी या टॉयलेट से पूरी तरह मुक्त और खुला रखें।',
      actionItem: 'प्रत्येक बुधवार सुबह गाय को ताजी हरी घास या पालक खिलाएं।'
    },
    6: {
      number: 6,
      zoneName: 'North-West (वायव्य) - Metal Support & Venus Luxury Zone',
      flawDetails: 'Lo Shu में 6 नंबर (शुक्र) मिसिंग होने से सुख-सुविधाओं और वाहन प्राप्ति में विलंब, रिश्तों में आकर्षण की कमी और संकट में मित्रों का सहयोग न मिलना होता है।',
      directionRemedy: 'उत्तर-पश्चिम (NW) दिशा को विदेश व्यापार, नेटवर्किंग और महत्वपूर्ण बैठकों के लिए उपयोग करें।',
      colourRemedy: 'उत्तर-पश्चिम में सफेद, आइवरी, क्रीम या रॉयल सिल्वर रंग के फैब्रिक का उपयोग करें।',
      placementRemedy: 'उत्तर-पश्चिम कोने में 6 रॉड वाली धातु की विंड चाइम या चांदी का सिक्का रखें।',
      energyCorrection: 'प्रतिदिन दक्षिण-पश्चिम और उत्तर-पश्चिम कोनों में गुलाब या चंदन का सुगंधित इत्र छिड़कें।',
      actionItem: 'शुक्रवार दोपहर 9 वर्ष से छोटी कन्याओं को दूध की मिठाई या सफेद खीर खिलाएं।'
    },
    2: {
      number: 2,
      zoneName: 'South-West (नैऋत्य) - Moon Emotional & Maternal Zone',
      flawDetails: 'Lo Shu में 2 नंबर (चन्द्र) मिसिंग होने से अत्यधिक मूड स्विंग्स, भावनात्मक असुरक्षा और माता के स्वास्थ्य या संबंधों में तनाव हो सकता है।',
      directionRemedy: 'सोते समय सिर पूर्व या दक्षिण की ओर रखें और चंद्रमा की ऊर्जा शांत करने के लिए उत्तर-पश्चिम का ध्यान रखें।',
      colourRemedy: 'घर की साज-सज्जा में मोतिया सफेद, ऑफ-व्हाइट, आइवरी या सिल्वर शेड्स का प्रयोग करें।',
      placementRemedy: 'माता-पिता की तस्वीर चांदी के फ्रेम में लगाएं, या कांच के कटोरे में जल और सफेद फूल रखें।',
      energyCorrection: 'विशेष रूप से रात्रि के समय चांदी के गिलास में रखा शुद्ध जल पिएं।',
      actionItem: 'सोमवार का व्रत रखें या जरूरतमंदों को दूध, सफेद चावल या चीनी का दान करें।'
    },
    3: {
      number: 3,
      zoneName: 'East (पूर्व) - Jupiter Wisdom & Family Growth Zone',
      flawDetails: 'Lo Shu में 3 नंबर (बृहस्पति) मिसिंग होने से एकाग्रता की कमी, गुरुजनों या मेंटर का मार्गदर्शन न मिलना और ज्ञान में रुकावट आती है।',
      directionRemedy: 'पढ़ाई करते समय या महत्वपूर्ण मीटिंग्स में हमेशा पूर्व (East) दिशा की ओर मुख करके बैठें।',
      colourRemedy: 'पूर्व की दीवारों पर केसरिया, हल्दी पीला या सुनहरा पीला रंग इस्तेमाल करें।',
      placementRemedy: 'पूर्व दिशा की शेल्फ पर भगवान श्री गणेश या अपने गुरुदेव की पीतल की सुंदर मूर्ति स्थापित करें।',
      energyCorrection: 'प्रतिदिन स्नान के बाद अपने माथे और कंठ पर केसर या हल्दी का तिलक लगाएं।',
      actionItem: 'गुरुवार के दिन अनाथालय या मंदिर में चने की दाल और पीले केले दान करें।'
    },
    4: {
      number: 4,
      zoneName: 'South-East (आग्नेय) - Rahu Financial Velocity & Direct Vision Zone',
      flawDetails: 'Lo Shu में 4 नंबर (राहु) मिसिंग होने से अचानक धन हानि, फंसा हुआ पैसा मिलने में देरी और पार्टनर चुनने में जल्दबाजी हो सकती है।',
      directionRemedy: 'निवेश संबंधी फैसले और डिजिटल लेनदेन करते समय उत्तर या आग्नेय (SE) की ओर मुख करें।',
      colourRemedy: 'कार्यस्थल पर स्लेटी (Grey), चारकोल या नेवी ब्लू रंग के एक्सेसरीज रखें।',
      placementRemedy: 'आग्नेय (SE) टेबल पर ठोस चौकोर लकड़ी का ब्लॉक या हरे फ्रेम में बांस के पौधे का चित्र लगाएं।',
      energyCorrection: 'आग्नेय कोण को हमेशा सूखा रखें। किसी भी नल या पाइप से पानी का रिसाव न होने दें।',
      actionItem: 'शनिवार को पक्षियों और कुत्तों को भोजन दें तथा जरूरतमंदों को सहयोग करें।'
    },
    7: {
      number: 7,
      zoneName: 'West (पश्चिम) - Ketu Research & Children Skill Node',
      flawDetails: 'Lo Shu में 7 नंबर (केतु) मिसिंग होने से मानसिक भटकाव, स्किन एलर्जी और आंतरिक अंतर्ज्ञान (Intuition) कमजोर होता है।',
      directionRemedy: 'योग, प्राणायाम या ध्यान करते समय पश्चिम (West) या उत्तर-पश्चिम की ओर मुख करें।',
      colourRemedy: 'अपने कार्य या ध्यान कक्ष में सफेद, स्मोक ग्रे या प्यूटर रंग के पर्दों का प्रयोग करें।',
      placementRemedy: 'पश्चिम की शेल्फ पर एक नेचुरल क्लियर क्वार्ट्ज क्रिस्टल पिरामिड स्थापित करें।',
      energyCorrection: 'पश्चिम की खिड़की पर पक्षियों के लिए रोज स्वच्छ दाना-पानी रखें।',
      actionItem: 'मंगलवार शाम को काले कुत्ते को सरसों के तेल से चुपड़ी मीठी रोटी खिलाएं।'
    },
    9: {
      number: 9,
      zoneName: 'South (दक्षिण) - Mars Energy & Command Zone',
      flawDetails: 'Lo Shu में 9 नंबर (मंगल) मिसिंग होने से शारीरिक साहस की कमी, पहल करने में संकोच और मान-सम्मान पाने में संघर्ष होता है।',
      directionRemedy: 'योजना बनाते समय या महत्वपूर्ण निर्णय लेते समय दक्षिण (South) दिशा की ओर मुख करें।',
      colourRemedy: 'दक्षिण दिशा के कमरों में कोरल रेड, केसरिया या चटक संतरी रंग का प्रयोग करें।',
      placementRemedy: 'दक्षिण की दीवार पर तांबे का पिरामिड या उगते हुए सुनहरे सूर्य का चित्र लगाएं।',
      energyCorrection: 'प्रतिदिन सूर्यास्त के समय दक्षिण दिशा में 20 मिनट के लिए लाल मोमबत्ती या पीतल का दीपक जलाएं।',
      actionItem: 'मंगलवार दोपहर को श्रमिकों या जरूरतमंदों को लाल मसूर की दाल या लाल वस्त्र दान करें।'
    },
    1: {
      number: 1,
      zoneName: 'North (उत्तर) - Sun Public Fame & Career Entrance Zone',
      flawDetails: 'Lo Shu में 1 नंबर (सूर्य) मिसिंग होने से करियर की शुरुआत में बाधा, पिता या अधिकारियों से मतभेद और आत्मविश्वास की कमी हो सकती है।',
      directionRemedy: 'प्रातःकाल सूर्योदय के समय पूर्व या उत्तर की ओर मुख करके नियमित रूप से सूर्य देव को जल अर्पित करें।',
      colourRemedy: 'उत्तर कार्यालय क्षेत्र में मैटेलिक गोल्डन, रूबी रेड या तांबे के रंग के सजावटी सामान रखें।',
      placementRemedy: 'पूर्व की दीवार पर चमकते हुए सूर्य देव की तांबे की प्लेट या तस्वीर लगाएं।',
      energyCorrection: 'सुबह जल्दी उठें और घर के मुख्य प्रवेश द्वार (विशेषकर उत्तर) को पूरी तरह स्वच्छ रखें।',
      actionItem: 'रविवार को पक्षियों को गेहूं के दाने और जल दें तथा पिता व बड़ों का आशीर्वाद लें।'
    }
  };

  const remedyCards: any[] = [];
  lGrid.missingNumbers.forEach(item => {
    const n = item.digit;
    if (possibleRemedies[n]) {
      remedyCards.push(possibleRemedies[n]);
    }
  });

  return {
    kuaNumber,
    groupType,
    groupDescription,
    directions: currentDirections,
    colourCorrection: currentColours,
    zonesReport,
    remedyPlan: {
      targetMissingNodes,
      remedyCards
    }
  };
}
