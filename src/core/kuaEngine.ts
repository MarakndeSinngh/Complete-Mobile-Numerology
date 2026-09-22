/**
 * LEOFAMILY KUA / DIRECTIONAL HARMONY ENGINE
 * Calculates Kua Number and Directional Alignments
 * Never called "Angel Number" — strictly identified as Kua Number.
 */

export interface KuaDirectionItem {
  direction: string;
  name: string;
  category: string;
  description: string;
  optimalUse?: string;
  advice?: string;
}

export interface KuaProfile {
  kuaNumber: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  group: 'EAST_GROUP' | 'WEST_GROUP';
  element: string;
  trigram: string;
  favourableDirections: {
    shengChi: string; // Wealth & Success
    tianYi: string;   // Health & Vitality
    yanNian: string;  // Love & Relationships
    fuWei: string;    // Personal Growth & Stability
  };
  unfavourableDirections: {
    huoHai: string;   // Obstacles
    wuGui: string;    // Five Ghosts / Disagreements
    liuSha: string;   // Six Killings / Legal / Scandals
    jueMing: string;  // Total Loss / Extreme Caution
  };
  favorableDirections: KuaDirectionItem[];
  unfavorableDirections: KuaDirectionItem[];
  summary: string;
}

export function calculateKuaNumber(birthYear: number, gender: 'MALE' | 'FEMALE' | 'OTHER'): KuaProfile {
  // Sum digits of birth year to single digit
  const yearSum = String(birthYear)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  let reducedYear = yearSum;
  while (reducedYear > 9) {
    reducedYear = String(reducedYear)
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
  }

  let kua = 0;
  const isPost2000 = birthYear >= 2000;

  if (gender === 'FEMALE') {
    kua = isPost2000 ? reducedYear + 6 : reducedYear + 5;
  } else {
    // MALE or OTHER default
    kua = isPost2000 ? 9 - reducedYear : 10 - reducedYear;
  }

  while (kua > 9) {
    kua = String(kua)
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  if (kua <= 0) kua = 9;

  // If Kua is 5, adjust based on gender: Male becomes 2, Female becomes 8
  if (kua === 5) {
    kua = gender === 'FEMALE' ? 8 : 2;
  }

  const isEastGroup = [1, 3, 4, 9].includes(kua);
  const group: KuaProfile['group'] = isEastGroup ? 'EAST_GROUP' : 'WEST_GROUP';

  const KUA_CONFIGS: Record<number, { 
    element: string; 
    trigram: string; 
    fav: KuaProfile['favourableDirections']; 
    unfav: KuaProfile['unfavourableDirections'];
    favorableList: KuaDirectionItem[];
    unfavorableList: KuaDirectionItem[];
  }> = {
    1: {
      element: 'जल तत्व (Water)',
      trigram: 'कान (Kan)',
      fav: { shengChi: 'दक्षिण-पूर्व (South-East)', tianYi: 'पूर्व (East)', yanNian: 'दक्षिण (South)', fuWei: 'उत्तर (North)' },
      unfav: { huoHai: 'पश्चिम (West)', wuGui: 'उत्तर-पूर्व (North-East)', liuSha: 'उत्तर-पश्चिम (North-West)', jueMing: 'दक्षिण-पश्चिम (South-West)' },
      favorableList: [
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'शेंग ची (Sheng Chi)', category: 'धन एवं समृद्धि', description: 'वित्तीय प्रगति, व्यावसायिक सफलता और मान-सम्मान में वृद्धि की प्रमुख दिशा।', optimalUse: 'मुख्य कार्यक्षेत्र डेस्क, कार्यालय प्रवेश द्वार या तिजोरी की दिशा।' },
        { direction: 'पूर्व (East)', name: 'तियान यी (Tian Yi)', category: 'स्वास्थ्य एवं जीवन शक्ति', description: 'शारीरिक आरोग्य, मानसिक शांति और दीर्घायु हेतु अत्यंत अनुकूल ऊर्जा।', optimalUse: 'शयनकक्ष में सिरहाने की दिशा अथवा योग-ध्यान क्षेत्र।' },
        { direction: 'दक्षिण (South)', name: 'यान नियान (Yan Nian)', category: 'संबंध एवं सद्भाव', description: 'पारिवारिक प्रेम, वैवाहिक सौहार्द और सामाजिक प्रतिष्ठा में मधुरता लाती है।', optimalUse: 'बैठक कक्ष (लिविंग रूम) अथवा पारिवारिक संवाद का स्थान।' },
        { direction: 'उत्तर (North)', name: 'फू वेई (Fu Wei)', category: 'व्यक्तिगत विकास एवं स्थिरता', description: 'मानसिक एकाग्रता, आंतरिक शांति और शैक्षणिक अध्ययन हेतु स्थिरता प्रदान करती है।', optimalUse: 'अध्ययन कक्ष, पूजा स्थल या ध्यान केंद्र।' }
      ],
      unfavorableList: [
        { direction: 'पश्चिम (West)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'दैनिक कार्यों में अप्रत्याशित देरी और अनावश्यक उलझनें पैदा हो सकती हैं।', advice: 'इस दिशा में महत्वपूर्ण व्यावसायिक बैठकें या समझौते करने से बचें।' },
        { direction: 'उत्तर-पूर्व (North-East)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व कलह', description: 'गलतफहमियां, सहकर्मियों के साथ मतभेद और मानसिक अशांति का जोखिम।', advice: 'इस क्षेत्र को स्वच्छ और शांत रखें, भारी सामान न रखें।' },
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'लिउ शा (Liu Sha)', category: 'कानूनी व संबंध तनाव', description: 'वैधानिक अड़चनें, कागजी कार्यों में रुकावट और रिश्तों में खटास।', advice: 'महत्वपूर्ण वित्तीय दस्तावेज या अनुबंध इस दिशा में न रखें।' },
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'ऊर्जा का तीव्र ह्रास और महत्वपूर्ण निर्णयों में भारी नुकसान की संभावना।', advice: 'इस दिशा की ओर मुख करके महत्वपूर्ण कार्य या शयन न करें।' }
      ]
    },
    2: {
      element: 'पृथ्वी तत्व (Earth)',
      trigram: 'कुन (Kun)',
      fav: { shengChi: 'उत्तर-पूर्व (North-East)', tianYi: 'पश्चिम (West)', yanNian: 'उत्तर-पश्चिम (North-West)', fuWei: 'दक्षिण-पश्चिम (South-West)' },
      unfav: { huoHai: 'पूर्व (East)', wuGui: 'दक्षिण-पूर्व (South-East)', liuSha: 'दक्षिण (South)', jueMing: 'उत्तर (North)' },
      favorableList: [
        { direction: 'उत्तर-पूर्व (North-East)', name: 'शेंग ची (Sheng Chi)', category: 'धन एवं समृद्धि', description: 'सफलता, व्यापार में लाभ और बौद्धिक विस्तार के लिए सर्वोच्च अनुकूल दिशा।', optimalUse: 'कार्यक्षेत्र डेस्क का मुख और मुख्य वित्तीय योजनाएं।' },
        { direction: 'पश्चिम (West)', name: 'तियान यी (Tian Yi)', category: 'स्वास्थ्य एवं जीवन शक्ति', description: 'शारीरिक रोगों से मुक्ति, सकारात्मक ऊर्जा और मानसिक आरोग्य।', optimalUse: 'शयनकक्ष और विश्राम स्थल।' },
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'यान नियान (Yan Nian)', category: 'संबंध एवं सद्भाव', description: 'दीर्घकालिक पारिवारिक सद्भाव, नेतृत्व सहयोग और मित्रों का समर्थन।', optimalUse: 'बैठक कक्ष या सहयोगी बातचीत का स्थान।' },
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'फू वेई (Fu Wei)', category: 'व्यक्तिगत विकास एवं स्थिरता', description: 'आत्म-विश्वास, व्यक्तिगत अनुशासन और मानसिक एकाग्रता का विकास।', optimalUse: 'अध्ययन कक्ष अथवा आध्यात्मिक साधना स्थल।' }
      ],
      unfavorableList: [
        { direction: 'पूर्व (East)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'ऊर्जा में बिखराव और छोटे-मोटे विवादों की संभावना।', advice: 'इस दिशा की ओर मुख करके महत्वपूर्ण निर्णय न लें।' },
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व कलह', description: 'सहयोगियों से अचानक मतभेद या आर्थिक असमंजस।', advice: 'इस क्षेत्र को व्यवस्थित व हल्का रखें।' },
        { direction: 'दक्षिण (South)', name: 'लिउ शा (Liu Sha)', category: 'प्रतिष्ठा संवेदनशीलता', description: 'सार्वजनिक छवि या संबंधों में तनाव की संभावना।', advice: 'यहां महत्वपूर्ण गोपनीय दस्तावेज न रखें।' },
        { direction: 'उत्तर (North)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'ऊर्जा का असंतुलन और स्वास्थ्य में उतार-चढ़ाव।', advice: 'इस दिशा में मुख्य प्रवेश द्वार या बिस्तर का सिरहाना न रखें।' }
      ]
    },
    3: {
      element: 'काष्ठ तत्व (Wood)',
      trigram: 'झेन (Zhen)',
      fav: { shengChi: 'दक्षिण (South)', tianYi: 'उत्तर (North)', yanNian: 'दक्षिण-पूर्व (South-East)', fuWei: 'पूर्व (East)' },
      unfav: { huoHai: 'दक्षिण-पश्चिम (South-West)', wuGui: 'उत्तर-पश्चिम (North-West)', liuSha: 'उत्तर-पूर्व (North-East)', jueMing: 'पश्चिम (West)' },
      favorableList: [
        { direction: 'दक्षिण (South)', name: 'शेंग ची (Sheng Chi)', category: 'धन एवं प्रसिद्धि', description: 'सामाजिक मान-सम्मान, व्यावसायिक तरक्की और धन लाभ की मुख्य दिशा।', optimalUse: 'कार्यक्षेत्र डेस्क का मुख और सार्वजनिक प्रस्तुतियां।' },
        { direction: 'उत्तर (North)', name: 'तियान यी (Tian Yi)', category: 'स्वास्थ्य एवं जीवन शक्ति', description: 'मानसिक स्फूर्ति, उत्तम स्वास्थ्य और तनाव मुक्ति हेतु शुभ ऊर्जा।', optimalUse: 'शयनकक्ष और ध्यान क्षेत्र।' },
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'यान नियान (Yan Nian)', category: 'संबंध एवं समृद्धि', description: 'पारिवारिक प्रेम, दांपत्य मधुरता और साझेदारी में दीर्घकालिक लाभ।', optimalUse: 'लिविंग रूम और पारिवारिक बैठक।' },
        { direction: 'पूर्व (East)', name: 'फू वेई (Fu Wei)', category: 'व्यक्तिगत विकास एवं स्थिरता', description: 'आत्म-साक्षात्कार, शैक्षणिक सफलता और आंतरिक शांति।', optimalUse: 'अध्ययन कक्ष व पूजा स्थल।' }
      ],
      unfavorableList: [
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'अनावश्यक देरी और पारिवारिक बातचीत में खिंचाव।', advice: 'इस दिशा में महत्वपूर्ण सौदे तय न करें।' },
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व कलह', description: 'वरिष्ठ अधिकारियों या मार्गदर्शकों के साथ असहमति।', advice: 'इस क्षेत्र में लाल या गहरे रंग का प्रयोग कम करें।' },
        { direction: 'उत्तर-पूर्व (North-East)', name: 'लिउ शा (Liu Sha)', category: 'कानूनी व संबंध तनाव', description: 'निर्णय लेने में असमंजस और वैधानिक विलंब।', advice: 'इस कोने को हमेशा साफ-सुथरा रखें।' },
        { direction: 'पश्चिम (West)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'ऊर्जा में गिरावट और आर्थिक नुकसान की संभावना।', advice: 'इस दिशा में शयन या कार्य न करें।' }
      ]
    },
    4: {
      element: 'काष्ठ तत्व (Wood)',
      trigram: 'शुन (Xun)',
      fav: { shengChi: 'उत्तर (North)', tianYi: 'दक्षिण (South)', yanNian: 'पूर्व (East)', fuWei: 'दक्षिण-पूर्व (South-East)' },
      unfav: { huoHai: 'उत्तर-पश्चिम (North-West)', wuGui: 'दक्षिण-पश्चिम (South-West)', liuSha: 'पश्चिम (West)', jueMing: 'उत्तर-पूर्व (North-East)' },
      favorableList: [
        { direction: 'उत्तर (North)', name: 'शेंग ची (Sheng Chi)', category: 'करियर एवं धन वृद्धि', description: 'करियर में नई संभावनाएं, व्यावसायिक प्रगति और आर्थिक स्थिरता।', optimalUse: 'कार्यक्षेत्र डेस्क का मुख और मुख्य आय के स्रोत।' },
        { direction: 'दक्षिण (South)', name: 'तियान यी (Tian Yi)', category: 'आरोग्य एवं प्रसिद्धि', description: 'शारीरिक ऊर्जा में वृद्धि, अच्छा स्वास्थ्य और सकारात्मक सामाजिक पहचान।', optimalUse: 'शयनकक्ष और विश्राम स्थल।' },
        { direction: 'पूर्व (East)', name: 'यान नियान (Yan Nian)', category: 'पारिवारिक सौहार्द', description: 'माता-पिता, बच्चों और जीवनसाथी के साथ मधुर व अटूट संबंध।', optimalUse: 'पारिवारिक डाइनिंग या बैठक क्षेत्र।' },
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'फू वेई (Fu Wei)', category: 'ज्ञान एवं मानसिक स्थिरता', description: 'विद्या, रचनात्मक विचार और आध्यात्मिक शांति की दिशा।', optimalUse: 'अध्ययन कक्ष व साधना स्थल।' }
      ],
      unfavorableList: [
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'कामों में विलंब और सहकर्मियों से असहयोग।', advice: 'इस दिशा की ओर मुख करके कार्य न करें।' },
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'वू गुई (Wu Gui)', category: 'संबंध कलह', description: 'रिश्तों में गलतफहमी और मानसिक अशांति।', advice: 'इस क्षेत्र को हल्का और खुला रखें।' },
        { direction: 'पश्चिम (West)', name: 'लिउ शा (Liu Sha)', category: 'कानूनी तनाव', description: 'वित्तीय विवाद और कागजी अड़चनें।', advice: 'इस दिशा में तिजोरी या लॉकर न रखें।' },
        { direction: 'उत्तर-पूर्व (North-East)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'मानसिक तनाव और अचानक बाधाओं की संभावना।', advice: 'इस दिशा में मुख्य शयनकक्ष न बनाएं।' }
      ]
    },
    6: {
      element: 'धातु तत्व (Metal)',
      trigram: 'चियान (Qian)',
      fav: { shengChi: 'पश्चिम (West)', tianYi: 'उत्तर-पूर्व (North-East)', yanNian: 'दक्षिण-पश्चिम (South-West)', fuWei: 'उत्तर-पश्चिम (North-West)' },
      unfav: { huoHai: 'दक्षिण-पूर्व (South-East)', wuGui: 'पूर्व (East)', liuSha: 'उत्तर (North)', jueMing: 'दक्षिण (South)' },
      favorableList: [
        { direction: 'पश्चिम (West)', name: 'शेंग ची (Sheng Chi)', category: 'धन एवं संतान सुख', description: 'व्यापारिक समृद्धि, निवेश में लाभ और संतान की प्रगति हेतु अत्यंत शुभ।', optimalUse: 'व्यावसायिक डेस्क और वित्तीय निर्णय।' },
        { direction: 'उत्तर-पूर्व (North-East)', name: 'तियान यी (Tian Yi)', category: 'स्वास्थ्य एवं ज्ञान', description: 'आरोग्य, मानसिक स्पष्टता और आध्यात्मिक मार्गदर्शक ऊर्जा।', optimalUse: 'पूजा स्थल या अध्ययन क्षेत्र।' },
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'यान नियान (Yan Nian)', category: 'दांपत्य एवं स्थिरता', description: 'वैवाहिक जीवन में स्थिरता, आपसी सम्मान और अटूट प्रेम।', optimalUse: 'मास्टर बेडरूम (शयनकक्ष)।' },
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'फू वेई (Fu Wei)', category: 'नेतृत्व एवं अधिकार', description: 'प्रशासनिक क्षमता, सामाजिक अधिकार और व्यक्तिगत गरिमा।', optimalUse: 'कार्यालय की मुख्य कुर्सी व ध्यान कक्ष।' }
      ],
      unfavorableList: [
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'आर्थिक लेन-देन में छोटी अड़चनें और व्यर्थ के खर्चे।', advice: 'यहां नकदी या वित्तीय दस्तावेज न रखें।' },
        { direction: 'पूर्व (East)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व कलह', description: 'पारिवारिक असहमति और ऊर्जा में असंतुलन।', advice: 'इस क्षेत्र में भारी कबाड़ न जमा होने दें।' },
        { direction: 'उत्तर (North)', name: 'लिउ शा (Liu Sha)', category: 'करियर बाधाएं', description: 'नौकरी या व्यवसाय में अचानक बाधाओं की संभावना।', advice: 'इस दिशा में काम करते समय सावधानी बरतें।' },
        { direction: 'दक्षिण (South)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'अत्यधिक ऊर्जा व्यय और प्रतिष्ठा हानि का जोखिम।', advice: 'इस दिशा में सिर करके सोने से बचें।' }
      ]
    },
    7: {
      element: 'धातु तत्व (Metal)',
      trigram: 'दुई (Dui)',
      fav: { shengChi: 'उत्तर-पश्चिम (North-West)', tianYi: 'दक्षिण-पश्चिम (South-West)', yanNian: 'उत्तर-पूर्व (North-East)', fuWei: 'पश्चिम (West)' },
      unfav: { huoHai: 'उत्तर (North)', wuGui: 'दक्षिण (South)', liuSha: 'दक्षिण-पूर्व (South-East)', jueMing: 'पूर्व (East)' },
      favorableList: [
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'शेंग ची (Sheng Chi)', category: 'मार्गदर्शन एवं धन', description: 'प्रभावशाली व्यक्तियों से सहयोग, धन लाभ और व्यापारिक सफलता।', optimalUse: 'कार्यक्षेत्र डेस्क का मुख और मुख्य बैठकें।' },
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'तियान यी (Tian Yi)', category: 'आरोग्य एवं मातृत्व', description: 'उत्तम स्वास्थ्य, भावनात्मक सुरक्षा और तनाव से मुक्ति।', optimalUse: 'शयनकक्ष और शांति क्षेत्र।' },
        { direction: 'उत्तर-पूर्व (North-East)', name: 'यान नियान (Yan Nian)', category: 'प्रेम एवं सौहार्द', description: 'रिश्तों में मधुरता, बौद्धिक आकर्षण और सामाजिक प्रतिष्ठा।', optimalUse: 'लिविंग रूम और पारिवारिक समय।' },
        { direction: 'पश्चिम (West)', name: 'फू वेई (Fu Wei)', category: 'रचनात्मकता एवं शांति', description: 'कलात्मक अभिव्यक्ति, आंतरिक आनंद और एकाग्रता।', optimalUse: 'अध्ययन कक्ष व रचनात्मक कार्यस्थल।' }
      ],
      unfavorableList: [
        { direction: 'उत्तर (North)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'संवाद में गलतफहमी और कार्यों में देरी।', advice: 'इस दिशा की ओर बैठकर महत्वपूर्ण सौदे न करें।' },
        { direction: 'दक्षिण (South)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व विवाद', description: 'व्यर्थ की बहस और क्रोध में निर्णय लेने का जोखिम।', advice: 'इस क्षेत्र में अग्नि तत्व को नियंत्रित रखें।' },
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'लिउ शा (Liu Sha)', category: 'कानूनी तनाव', description: 'संपत्ति संबंधी विवाद और मानसिक बेचैनी।', advice: 'इस दिशा में महत्वपूर्ण कागजात न रखें।' },
        { direction: 'पूर्व (East)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'स्वास्थ्य और ऊर्जा का तीव्र नुकसान।', advice: 'इस दिशा में मुख्य प्रवेश द्वार या बिस्तर न रखें।' }
      ]
    },
    8: {
      element: 'पृथ्वी तत्व (Earth)',
      trigram: 'गेन (Gen)',
      fav: { shengChi: 'दक्षिण-पश्चिम (South-West)', tianYi: 'उत्तर-पश्चिम (North-West)', yanNian: 'पश्चिम (West)', fuWei: 'उत्तर-पूर्व (North-East)' },
      unfav: { huoHai: 'दक्षिण (South)', wuGui: 'उत्तर (North)', liuSha: 'पूर्व (East)', jueMing: 'दक्षिण-पूर्व (South-East)' },
      favorableList: [
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'शेंग ची (Sheng Chi)', category: 'स्थिर धन एवं सत्ता', description: 'अचल संपत्ति, दीर्घकालिक धन संचय और उच्च प्रतिष्ठा हेतु सर्वोत्तम दिशा।', optimalUse: 'मास्टर ऑफिस डेस्क और दीर्घकालिक निवेश योजनाएं।' },
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'तियान यी (Tian Yi)', category: 'स्वास्थ्य एवं संरक्षण', description: 'दीर्घकालिक शारीरिक स्वास्थ्य, रोग मुक्ति और वरिष्ठों का आशीर्वाद।', optimalUse: 'शयनकक्ष और विश्राम स्थल।' },
        { direction: 'पश्चिम (West)', name: 'यान नियान (Yan Nian)', category: 'संबंध एवं सुख', description: 'वैवाहिक स्थिरता, बच्चों का सुख और सामाजिक प्रतिष्ठा।', optimalUse: 'पारिवारिक बैठक और सौहार्दपूर्ण संवाद।' },
        { direction: 'उत्तर-पूर्व (North-East)', name: 'फू वेई (Fu Wei)', category: 'ज्ञान एवं आध्यात्मिक चेतना', description: 'गहन अध्ययन, आध्यात्मिक साधना और आंतरिक स्पष्टता।', optimalUse: 'पूजा स्थल, अध्ययन कक्ष व ध्यान केंद्र।' }
      ],
      unfavorableList: [
        { direction: 'दक्षिण (South)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'योजनाओं में अप्रत्याशित देरी और मानसिक उतावलापन।', advice: 'इस दिशा में महत्वपूर्ण व्यावसायिक बैठकें न करें।' },
        { direction: 'उत्तर (North)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व कलह', description: 'करियर में अनपेक्षित बदलाव और सहकर्मियों से तनाव।', advice: 'इस क्षेत्र को स्वच्छ और संतुलित रखें।' },
        { direction: 'पूर्व (East)', name: 'लिउ शा (Liu Sha)', category: 'पारिवारिक तनाव', description: 'पारिवारिक मतभेद और कागजी उलझनें।', advice: 'इस कोने में भारी वजनदार अलमारियां न रखें।' },
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'वित्तीय अस्थिरता और ऊर्जा की हानि।', advice: 'इस दिशा में सोने या कार्य करने से पूर्ण परहेज करें।' }
      ]
    },
    9: {
      element: 'अग्नि तत्व (Fire)',
      trigram: 'ली (Li)',
      fav: { shengChi: 'पूर्व (East)', tianYi: 'दक्षिण-पूर्व (South-East)', yanNian: 'उत्तर (North)', fuWei: 'दक्षिण (South)' },
      unfav: { huoHai: 'उत्तर-पूर्व (North-East)', wuGui: 'पश्चिम (West)', liuSha: 'दक्षिण-पश्चिम (South-West)', jueMing: 'उत्तर-पश्चिम (North-West)' },
      favorableList: [
        { direction: 'पूर्व (East)', name: 'शेंग ची (Sheng Chi)', category: 'धन एवं नया आरंभ', description: 'नए व्यावसायिक अवसर, निरंतर धन प्रवाह और उच्च सामाजिक मान-सम्मान।', optimalUse: 'कार्यक्षेत्र डेस्क का मुख और नए अनुबंध।' },
        { direction: 'दक्षिण-पूर्व (South-East)', name: 'तियान यी (Tian Yi)', category: 'स्वास्थ्य एवं समृद्धि', description: 'शारीरिक शक्ति, मानसिक ताजगी और धन संचय में वृद्धि।', optimalUse: 'शयनकक्ष और विश्राम स्थल।' },
        { direction: 'उत्तर (North)', name: 'यान नियान (Yan Nian)', category: 'करियर एवं संबंध', description: 'व्यावसायिक नेटवर्किंग, मधुर दांपत्य और दीर्घकालिक साझेदारी।', optimalUse: 'बैठक कक्ष या संवाद क्षेत्र।' },
        { direction: 'दक्षिण (South)', name: 'फू वेई (Fu Wei)', category: 'ख्याति एवं आत्म-विश्वास', description: 'नेतृत्व क्षमता, व्यक्तिगत पहचान और आंतरिक प्रकाश।', optimalUse: 'अध्ययन कक्ष व ध्यान स्थल।' }
      ],
      unfavorableList: [
        { direction: 'उत्तर-पूर्व (North-East)', name: 'हुओ हाई (Huo Hai)', category: 'छोटी रुकावटें', description: 'निर्णय लेने में असमंजस और अनावश्यक विलंब।', advice: 'इस दिशा में महत्वपूर्ण कार्य करते समय धैर्य रखें।' },
        { direction: 'पश्चिम (West)', name: 'वू गुई (Wu Gui)', category: 'मतभेद व विवाद', description: 'अचानक प्रतिद्वंद्विता और संबंधों में तीखापन।', advice: 'इस क्षेत्र को हल्का और शांत रखें।' },
        { direction: 'दक्षिण-पश्चिम (South-West)', name: 'लिउ शा (Liu Sha)', category: 'पारिवारिक चिंता', description: 'घरेलू सुख में कमी और मन में अशांति।', advice: 'इस दिशा में तिजोरी या वित्तीय कागजात न रखें।' },
        { direction: 'उत्तर-पश्चिम (North-West)', name: 'ज्यू मिंग (Jue Ming)', category: 'पूर्ण सावधानी क्षेत्र', description: 'ऊर्जा में भारी गिरावट और असफलता का जोखिम।', advice: 'इस दिशा में मुख्य शयन या कार्यस्थल न बनाएं।' }
      ]
    }
  };

  const config = KUA_CONFIGS[kua] || KUA_CONFIGS[1];
  const groupNameHi = isEastGroup ? 'पूर्वी समूह (East Group - जल, काष्ठ, अग्नि)' : 'पश्चिमी समूह (West Group - पृथ्वी, धातु)';

  const summary = `आपका कुआ (Kua) अंक ${kua} है, जो ${groupNameHi} से संबंधित है। इसका मुख्य तत्व ${config.element} और त्रिग्राम ${config.trigram} है। आपके लिए सर्वोच्च धन, सफलता एवं समृद्धि की दिशा ${config.fav.shengChi} है।`;

  return {
    kuaNumber: kua,
    gender,
    group,
    element: config.element,
    trigram: config.trigram,
    favourableDirections: config.fav,
    unfavourableDirections: config.unfav,
    favorableDirections: config.favorableList,
    unfavorableDirections: config.unfavorableList,
    summary
  };
}
