import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface VastuDirectionZone {
  direction: string;
  hindiName: string;
  rulingPlanet: string;
  element: 'Water' | 'Air' | 'Fire' | 'Earth' | 'Space' | 'Metal' | 'Wood' | string;
  loShuDigit: number;
  lifeDomain: string;
  favorableActivities: string[];
  unfavorableElements: string[];
  remedy: string;
}

export const VASTU_ZONES: Record<string, VastuDirectionZone> = {
  NORTH: {
    direction: 'North',
    hindiName: 'उत्तर (कुबेर स्थान)',
    rulingPlanet: 'Mercury / Sun (Lo Shu 1: Water)',
    element: 'Water',
    loShuDigit: 1,
    lifeDomain: 'करियर के नए अवसर, धन आगमन के स्रोत, कैश फ्लो और व्यावसायिक प्रगति',
    favorableActivities: ['खुला व साफ स्थान', 'पानी का फव्वारा (Water Fountain)', 'उत्तर मुखी तिजोरी / कैश लॉकर', 'उत्तर की ओर मुख करके अध्ययन/कार्य'],
    unfavorableElements: ['रसोई / अग्नि तत्व', 'भारी कबाड़ या गंदगी', 'उत्तर दिशा में सीधा शौचालय (Toilet)'],
    remedy: 'उत्तर दिशा में पीतल के बर्तन में स्वच्छ जल रखें; नीले या हरे रंग का उपयोग करें; पानी में मनी प्लांट लगाएं।'
  },
  NORTH_EAST: {
    direction: 'North-East',
    hindiName: 'ईशान कोण (देव स्थान)',
    rulingPlanet: 'Jupiter (Lo Shu 8: Earth / Wisdom)',
    element: 'Water / Space',
    loShuDigit: 8,
    lifeDomain: 'मानसिक स्पष्टता, आध्यात्मिक उन्नति, ईश्वरीय कृपा और अंतर्ज्ञान (Intuition)',
    favorableActivities: ['पूजा घर / मंदिर', 'ध्यान व मेडिटेशन केंद्र', 'शांत अध्ययन कक्ष', 'भूमिगत जल टैंक (Underground Tank)'],
    unfavorableElements: ['भारी कबाड़ या स्टोर रूम', 'छत पर भारी पानी की टंकी', 'रसोई का चूल्हा', 'शौचालय'],
    remedy: 'क्रिस्टल पिरामिड या तांबे के पात्र में गंगाजल रखें; इस दिशा में अधिकतम प्राकृतिक रोशनी और स्वच्छता सुनिश्चित करें।'
  },
  EAST: {
    direction: 'East',
    hindiName: 'पूर्व (इन्द्र स्थान)',
    rulingPlanet: 'Sun / Jupiter (Lo Shu 3: Wood)',
    element: 'Wood',
    loShuDigit: 3,
    lifeDomain: 'सामाजिक संपर्क, स्वास्थ्य व जीवन शक्ति, पिता का सहयोग और समाज में मान-सम्मान',
    favorableActivities: ['मुख्य प्रवेश द्वार', 'बैठक (Living Room)', 'प्रातःकालीन सूर्य का प्रकाश', 'हरे-भरे इनडोर पौधे'],
    unfavorableElements: ['अंधेरा', 'ऊंची बंद दीवारें', 'कूड़ेदान या कचरा'],
    remedy: 'पूर्व की दीवार पर तांबे का सूर्य यंत्र लगाएं; स्वस्थ हरे पत्तेदार पौधे रखें।'
  },
  SOUTH_EAST: {
    direction: 'South-East',
    hindiName: 'आग्नेय कोण (अग्नि स्थान)',
    rulingPlanet: 'Venus (Lo Shu 4: Wood/Wealth)',
    element: 'Fire',
    loShuDigit: 4,
    lifeDomain: 'नकद तरलता (Cash Liquidity), महिलाओं का स्वास्थ्य, शारीरिक ऊर्जा और रसोई की समृद्धि',
    favorableActivities: ['रसोई घर / गैस चूल्हा', 'इलेक्ट्रिकल पैनल / मीटर', 'इन्वर्टर / जनरेटर', 'हल्का वॉर्म प्रकाश'],
    unfavorableElements: ['पानी का फव्वारा', 'भूमिगत पानी की टंकी', 'मास्टर बेडरूम'],
    remedy: 'आग्नेय कोण में लाल या नारंगी रंग का नाइट बल्ब लगाएं या कपूर डिफ्यूज़र का उपयोग करें; यहाँ नीला या काला रंग न लगाएं।'
  },
  SOUTH: {
    direction: 'South',
    hindiName: 'दक्षिण (यम स्थान)',
    rulingPlanet: 'Mars (Lo Shu 9: Fire)',
    element: 'Fire',
    loShuDigit: 9,
    lifeDomain: 'प्रसिद्धि, सामाजिक प्रतिष्ठा, यश, आत्मविश्वास और कानूनी मामलों में सफलता',
    favorableActivities: ['पुरस्कार और प्रमाण-पत्रों का प्रदर्शन', 'भारी फर्नीचर या अलमारी', 'दक्षिण की ओर सिर करके सोना'],
    unfavorableElements: ['मुख्य जल बोरवेल', 'अत्यधिक खुले कांच के शीशे/खिड़कियां'],
    remedy: 'अपनी उपलब्धियों/सर्टिफिकेशन्स को दक्षिण दीवार पर लगाएं; लाल या सिंदूरी रंग की कलाकृतियां लगाएं; दक्षिण की दीवार को ठोस और ऊंचा रखें।'
  },
  SOUTH_WEST: {
    direction: 'South-West',
    hindiName: 'नैऋत्य कोण (पितृ / स्थिरता स्थान)',
    rulingPlanet: 'Rahu / Saturn (Lo Shu 2: Earth)',
    element: 'Earth',
    loShuDigit: 2,
    lifeDomain: 'पारिवारिक स्थिरता, संबंधों में मधुरता, मुखिया का बेडरूम, निर्णय क्षमता और भूमि लाभ',
    favorableActivities: ['घर के मुखिया का मास्टर बेडरूम', 'भारी पत्थर की कलाकृतियां', 'परिवार की मुख्य तिजोरी'],
    unfavorableElements: ['मुख्य प्रवेश द्वार', 'भूमिगत जल टैंक / बोरवेल', 'बड़ी खुली बालकनी या कटाव'],
    remedy: 'पीतल के भारी सजावटी सामान या पीले रंग का स्टोन रखें; नैऋत्य कोण को घर का सबसे भारी और ऊंचा हिस्सा बनाएं।'
  },
  WEST: {
    direction: 'West',
    hindiName: 'पश्चिम (वरुण स्थान)',
    rulingPlanet: 'Saturn (Lo Shu 7: Metal)',
    element: 'Metal',
    loShuDigit: 7,
    lifeDomain: 'संतान सुख, रचनात्मक क्षमता, निवेश से लाभ और व्यापारिक प्राप्तियां',
    favorableActivities: ['बच्चों का बेडरूम', 'डाइनिंग रूम', 'छत पर रखी पानी की टंकी (Overhead Tank)', 'मेटल विंड चाइम्स'],
    unfavorableElements: ['भूमिगत पानी का गड्ढा', 'खराब या टूटे इलेक्ट्रॉनिक उपकरण'],
    remedy: '6 रॉड वाली धातु की विंड चाइम (Wind Chime) लगाएं; सफेद, स्लेटी या मेटैलिक रंगों का प्रयोग करें।'
  },
  NORTH_WEST: {
    direction: 'North-West',
    hindiName: 'वायव्य कोण (वायु स्थान)',
    rulingPlanet: 'Moon (Lo Shu 6: Metal / Venus)',
    element: 'Air / Metal',
    loShuDigit: 6,
    lifeDomain: 'मददगार मित्र व सहयोगी (Support System), बैंकिंग लोन सहायता, विदेश यात्रा और तैयार माल का व्यापार',
    favorableActivities: ['अतिथि कक्ष (Guest Room)', 'तैयार माल का स्टॉक (Finished Goods)', 'यात्रा व पासपोर्ट दस्तावेज लॉकर', 'गैराज / पार्किंग'],
    unfavorableElements: ['स्थायी भारी कचरा/मलबा', 'अत्यधिक गहरे घुटन भरे रंग'],
    remedy: 'सफेद, चांदी (Silver) या क्रीम रंगों का प्रयोग करें; इस दिशा में ताजी हवा का निरंतर प्रवाह सुनिश्चित करें।'
  },
  CENTER: {
    direction: 'Center (Brahmasthan)',
    hindiName: 'ब्रह्मस्थान (नाभि स्थान)',
    rulingPlanet: 'Mercury (Lo Shu 5: Earth)',
    element: 'Space / Ether',
    loShuDigit: 5,
    lifeDomain: 'समग्र जीवन का संतुलन, घर की मुख्य प्राण ऊर्जा, स्वास्थ्य और पूरे परिवार की सुख-समृद्धि',
    favorableActivities: ['खुला केंद्रीय आंगन', 'हल्का व संतुलित प्रकाश', 'बिल्कुल साफ-सुथरा आवागमन क्षेत्र'],
    unfavorableElements: ['भारी खंभा (Pillar)', 'सीढ़ियां (Staircase)', 'केंद्र में सीधा शौचालय या रसोई का चूल्हा'],
    remedy: 'घर के बिल्कुल केंद्र (नाभि स्थान) को हमेशा खाली, स्वच्छ, हल्का और पवित्र रखें; यहाँ भारी वजन न रखें।'
  }
};

// Register Vastu in methodology registry
methodologyRegistry.registerRule({
  id: 'VASTU_CORE_ZONING',
  category: 'VASTU',
  ruleName: 'LeoFamily Numero-Vastu 8-Directional & Central Matrix',
  system: 'LEOFAMILY',
  source: SOURCES.LEOFAMILY_NUMERO_VASTU_PDF,
  description: 'Integration of Lo Shu matrix numbers with classical Indian Vastu directional zones and elements.',
  interpretation: 'Optimizes residential and commercial spaces without distorting mathematical Lo Shu counts.',
  confidence: 100,
  safetyLevel: 'SAFE',
  details: VASTU_ZONES
});
