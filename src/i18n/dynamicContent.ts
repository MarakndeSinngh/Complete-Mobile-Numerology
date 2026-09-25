import { CompleteNumerologyProfile } from '../core/types';
import { SupportedLanguage } from './types';
import { parseIndianDate } from '../utils/dateUtils';
import { getCompoundDetails } from '../services/compoundDatabase';

// Utility for template string variable replacement
export function interpolate(template: string, vars: Record<string, string | number>): string {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : `{${key}}`;
  });
}

// Language resolver fallback: selected -> en -> hi
export function resolveDynamicText<T extends Record<string, any>>(
  localizedMap: Record<SupportedLanguage, T>,
  lang: SupportedLanguage
): T {
  if (localizedMap[lang]) return localizedMap[lang];
  if (localizedMap.en) return localizedMap.en;
  return localizedMap.hi;
}

// 1. LOCALIZED PLANET NAMES
export const LOCALIZED_PLANETS: Record<number, Record<SupportedLanguage, string>> = {
  1: {
    hi: 'सूर्य (Sun)',
    en: 'Sun (Surya)',
    mr: 'सूर्य (Sun)',
    bn: 'সূর্য (Sun)',
    gu: 'સૂર્ય (Sun)'
  },
  2: {
    hi: 'चंद्र (Moon)',
    en: 'Moon (Chandra)',
    mr: 'चंद्र (Moon)',
    bn: 'চন্দ্র (Moon)',
    gu: 'ચંદ્ર (Moon)'
  },
  3: {
    hi: 'बृहस्पति / गुरु (Jupiter)',
    en: 'Jupiter (Brihaspati / Guru)',
    mr: 'बृहस्पति / गुरू (Jupiter)',
    bn: 'বৃহস্পতি / গুরু (Jupiter)',
    gu: 'ગુરુ / બૃહસ્પતિ (Jupiter)'
  },
  4: {
    hi: 'राहु (Rahu)',
    en: 'Rahu (North Node)',
    mr: 'राहू (Rahu)',
    bn: 'রাহু (Rahu)',
    gu: 'રાહુ (Rahu)'
  },
  5: {
    hi: 'बुध (Mercury)',
    en: 'Mercury (Budh)',
    mr: 'बुध (Mercury)',
    bn: 'বুধ (Mercury)',
    gu: 'બુધ (Mercury)'
  },
  6: {
    hi: 'शुक्र (Venus)',
    en: 'Venus (Shukra)',
    mr: 'शुक्र (Venus)',
    bn: 'শুক্র (Venus)',
    gu: 'શુક્ર (Venus)'
  },
  7: {
    hi: 'केतु (Ketu)',
    en: 'Ketu (South Node)',
    mr: 'केतू (Ketu)',
    bn: 'কেতু (Ketu)',
    gu: 'કેતુ (Ketu)'
  },
  8: {
    hi: 'शनि (Saturn)',
    en: 'Saturn (Shani)',
    mr: 'शनी (Saturn)',
    bn: 'শনি (Saturn)',
    gu: 'શનિ (Saturn)'
  },
  9: {
    hi: 'मंगल (Mars)',
    en: 'Mars (Mangal)',
    mr: 'मंगळ (Mars)',
    bn: 'মঙ্গল (Mars)',
    gu: 'મંગળ (Mars)'
  }
};

export function getPlanetName(num: number, lang: SupportedLanguage): string {
  const reduced = ((Math.abs(num) - 1) % 9) + 1;
  return LOCALIZED_PLANETS[reduced]?.[lang] || LOCALIZED_PLANETS[reduced]?.hi || `Planet #${reduced}`;
}

// 2. LOCALIZED MONTH NAMES
export const LOCALIZED_MONTHS: Record<SupportedLanguage, string[]> = {
  hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  mr: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  gu: ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર']
};

// 3. NUMBER MEANINGS (1-9) IN 5 LANGUAGES
export interface LocalizedNumberMeaning {
  title: string;
  energy: string;
  nature: string;
  element: string;
  luckyColor: string;
  mantra: string;
  crystal: string;
  remedy: string;
}

export const NUMBER_MEANINGS: Record<number, Record<SupportedLanguage, LocalizedNumberMeaning>> = {
  1: {
    hi: {
      title: 'सूर्य की नेतृत्व एवं सृजनात्मक ऊर्जा',
      energy: 'आत्मविश्वास, नवोन्मेष, स्वावलंबन और अग्रणी सोच।',
      nature: 'अग्नि तत्व प्रधान, स्वतंत्र और दृढ़ निश्चयी।',
      element: 'अग्नि (Fire)',
      luckyColor: 'लाल, नारंगी, सुनहरा पीला',
      mantra: 'ॐ घृणिः सूर्याय नमः',
      crystal: 'माणिक्य (Ruby) अथवा सनस्टोन (Sunstone)',
      remedy: 'प्रातःकाल सूर्य को तांबे के लोटे से अर्घ्य दें और पिता का सम्मान करें।'
    },
    en: {
      title: 'Solar Leadership & Creative Vitality',
      energy: 'Confidence, innovation, self-reliance, and pioneering ambition.',
      nature: 'Fire-element dominant, sovereign, and resolute.',
      element: 'Fire',
      luckyColor: 'Red, Orange, Golden Yellow',
      mantra: 'Om Ghrinih Suryaya Namah',
      crystal: 'Ruby or Sunstone bracelet',
      remedy: 'Offer water to the rising Sun in a copper vessel and respect paternal elders.'
    },
    mr: {
      title: 'सूर्याची नेतृत्व आणि सर्जनशील ऊर्जा',
      energy: 'आत्मविश्वास, नाविन्यता, स्वावलंबन आणि अग्रगण्य विचार.',
      nature: 'अग्नी तत्व प्रधान, स्वतंत्र आणि दृढनिश्चयी.',
      element: 'अग्नी (Fire)',
      luckyColor: 'लाल, नारंगी, सोनेरी पिवळा',
      mantra: 'ॐ घृणिः सूर्याय नमः',
      crystal: 'माणिक (Ruby) किंवा सनस्टोन (Sunstone)',
      remedy: 'सकाळी उगवत्या सूर्याला तांब्याच्या पात्रातून अर्घ्य द्या आणि वडिलांचा आदर करा.'
    },
    bn: {
      title: 'সূর্যের নেতৃত্ব ও সৃজনশীল শক্তি',
      energy: 'আত্মবিশ্বাস, উদ্ভাবন, স্বাবলম্বন এবং দূরদর্শী চিন্তা।',
      nature: 'অগ্নি উপাদান প্রধান, স্বাধীন ও দৃঢ়প্রতিজ্ঞ।',
      element: 'অগ্নি (Fire)',
      luckyColor: 'লাল, কমলা, সোনালী হলুদ',
      mantra: 'ওঁ ঘৃণিঃ সূর্যায় নমঃ',
      crystal: 'চুনি (Ruby) বা সানস্টোন (Sunstone)',
      remedy: 'সকালে তামার পাত্রে সূর্যকে জল অর্পণ করুন এবং পিতার আশীর্বাদ নিন।'
    },
    gu: {
      title: 'સૂર્યની નેતૃત્વ અને સર્જનાત્મક ઉર્જા',
      energy: 'આત્મવિશ્વાસ, નવીનતા, સ્વાવલંબન અને અગ્રણી વિચારસરણી.',
      nature: 'અગ્નિ તત્વ પ્રધાન, સ્વતંત્ર અને દૃઢનિશ્ચયી.',
      element: 'અગ્નિ (Fire)',
      luckyColor: 'લાલ, કેસરી, સોનેરી પીળો',
      mantra: 'ૐ ઘૃણિઃ સૂર્યાય નમઃ',
      crystal: 'માણેક (Ruby) અથવા સનસ્ટોન (Sunstone)',
      remedy: 'પ્રાતઃકાળે તાંબાના પાત્રથી સૂર્યને અર્ધ્ય અર્પણ કરો અને પિતાનું સન્માન કરો.'
    }
  },
  2: {
    hi: {
      title: 'चंद्रमा की सौम्य, भावनात्मक एवं कूटनीतिक ऊर्जा',
      energy: 'शांति, संवेदनशीलता, अंतर्ज्ञान और सहयोग भावना।',
      nature: 'जल तत्व प्रधान, कल्पनाशील और कलात्मक।',
      element: 'जल (Water)',
      luckyColor: 'सफेद, क्रीम, हल्का हरा',
      mantra: 'ॐ सों सोमाय नमः',
      crystal: 'मोती (Pearl) अथवा मूनस्टोन (Moonstone)',
      remedy: 'चांदी के पात्र से जल पिएं और माता का आशीर्वाद लें।'
    },
    en: {
      title: 'Lunar Intuition, Harmony & Diplomatic Grace',
      energy: 'Peace, emotional sensitivity, intuition, and cooperative spirit.',
      nature: 'Water-element dominant, imaginative, and artistic.',
      element: 'Water',
      luckyColor: 'White, Cream, Light Green',
      mantra: 'Om Som Somaya Namah',
      crystal: 'Natural Pearl or Moonstone bracelet',
      remedy: 'Drink water from a silver cup and seek maternal blessings regularly.'
    },
    mr: {
      title: 'चंद्राची सौम्य, भावनिक आणि मुत्सद्दी ऊर्जा',
      energy: 'शांतता, संवेदनशीलता, अंतर्ज्ञान आणि सहकार्याची भावना.',
      nature: 'जल तत्व प्रधान, कल्पक आणि कलात्मक.',
      element: 'जल (Water)',
      luckyColor: 'पांढरा, क्रीम, हलका हिरवा',
      mantra: 'ॐ सों सोमाय नमः',
      crystal: 'मोती (Pearl) किंवा मूनस्टोन (Moonstone)',
      remedy: 'चांदीच्या भांड्यातून पाणी प्या आणि आईचा आशीर्वाद घ्या.'
    },
    bn: {
      title: 'চন্দ্রের সৌম্য, আবেগীয় ও কূটনৈতিক শক্তি',
      energy: 'শান্তি, সংবেদনশীলতা, অন্তর্দৃষ্টি এবং সহযোগিতার মনোভাব।',
      nature: 'জল উপাদান প্রধান, কল্পনাপ্রবণ এবং শৈল্পিক।',
      element: 'জল (Water)',
      luckyColor: 'সাদা, ক্রিম, হালকা সবুজ',
      mantra: 'ওঁ সোঁ সোমায় নমঃ',
      crystal: 'মুক্তা (Pearl) বা মুনস্টোন (Moonstone)',
      remedy: 'রূপার পাত্রে জল পান করুন এবং মায়ের আশীর্বাদ গ্রহণ করুন।'
    },
    gu: {
      title: 'ચંદ્રની સૌમ્ય, ભાવનાત્મક અને કૂટનીતિક ઉર્જા',
      energy: 'શાંતિ, સંવેદનશીલતા, અંતર્જ્ઞાન અને સહયોગની ભાવના.',
      nature: 'જળ તત્વ પ્રધાન, કલ્પનાશીલ અને કલાત્મક.',
      element: 'જળ (Water)',
      luckyColor: 'સફેદ, ક્રીમ, આછો લીલો',
      mantra: 'ૐ સોં સોમાય નમઃ',
      crystal: 'મોતી (Pearl) અથવા મૂનસ્ટોન (Moonstone)',
      remedy: 'ચાંદીના પાત્રમાંથી પાણી પીવો અને માતાના આશીર્વાદ લો.'
    }
  },
  3: {
    hi: {
      title: 'देवगुरु बृहस्पति की ज्ञान, विस्तार एवं परामर्श ऊर्जा',
      energy: 'विद्वता, अभिव्यक्ति, नैतिकता, अध्यात्म और विस्तार।',
      nature: 'आकाश तत्व प्रधान, आशावादी और उपदेशक।',
      element: 'आकाश (Ether / Space)',
      luckyColor: 'पीला, केसरिया, सुनहरा',
      mantra: 'ॐ बृं बृहस्पतये नमः',
      crystal: 'पुखराज (Yellow Sapphire) अथवा सिट्रीन (Citrine)',
      remedy: 'गुरुजनों का सम्मान करें और गुरुवार को केसर अथवा हल्दी का तिलक लगाएं।'
    },
    en: {
      title: 'Jupiterian Wisdom, Knowledge & Advisory Elevation',
      energy: 'Erudition, articulation, ethics, mentorship, and creative expansion.',
      nature: 'Ether-element dominant, philosophical, and optimistic.',
      element: 'Space / Ether',
      luckyColor: 'Yellow, Saffron, Golden Ochre',
      mantra: 'Om Brim Brihaspataye Namah',
      crystal: 'Yellow Sapphire or Citrine gemstone',
      remedy: 'Respect teachers and apply saffron or turmeric tilak on Thursdays.'
    },
    mr: {
      title: 'देवगुरू बृहस्पतीची ज्ञान, विस्तार आणि मार्गदर्शन ऊर्जा',
      energy: 'विद्वत्ता, अभिव्यक्ती, नैतिकता, अध्यात्म आणि विस्तार.',
      nature: 'आकाश तत्व प्रधान, आशावादी आणि उपदेशक.',
      element: 'आकाश (Space)',
      luckyColor: 'पिवळा, केशरी, सोनेरी',
      mantra: 'ॐ बृं बृहस्पतये नमः',
      crystal: 'पुष्कराज (Yellow Sapphire) किंवा सिट्रीन (Citrine)',
      remedy: 'गुरूंचा आदर करा आणि गुरुवारी केशर किंवा हळदीचा टिळा लावा.'
    },
    bn: {
      title: 'বৃহস্পতির জ্ঞান, বিস্তার ও উপদেশক শক্তি',
      energy: 'পাণ্ডিত্য, অভিব্যক্তি, নৈতিকতা, আধ্যাত্মিকতা এবং সম্প্রসারণ।',
      nature: 'আকাশ উপাদান প্রধান, আশাবাদী এবং পথপ্রদর্শক।',
      element: 'আকাশ (Space)',
      luckyColor: 'হলুদ, জাফরান, সোনালী',
      mantra: 'ওঁ বৃং বৃহস্পতয়ে নমঃ',
      crystal: 'পোখরাজ (Yellow Sapphire) বা সিট্রিন (Citrine)',
      remedy: 'শিক্ষকদের সম্মান করুন এবং বৃহস্পতিবার চন্দনের তিলক পরুন।'
    },
    gu: {
      title: 'દેવગુરુ બૃહસ્પતિની જ્ઞાન, વિસ્તરણ અને પરામર્શ ઉર્જા',
      energy: 'વિદ્વત્તા, અભિવ્યક્તિ, નૈતિકતા, આધ્યાત્મ અને વિકાસ.',
      nature: 'આકાશ તત્વ પ્રધાન, આશાવાદી અને માર્ગદર્શક.',
      element: 'આકાશ (Space)',
      luckyColor: 'પીળો, કેસરી, સોનેરી',
      mantra: 'ૐ બૃં બૃહસ્પતયે નમઃ',
      crystal: 'પોખરાજ (Yellow Sapphire) અથવા સિટ્રીન (Citrine)',
      remedy: 'ગુરુજનોનું સન્માન કરો અને ગુરુવારે કેસર કે હળદરનું તિલક કરો.'
    }
  },
  4: {
    hi: {
      title: 'राहु की संरचना, तकनीकी बुद्धि एवं अनुशासन ऊर्जा',
      energy: 'कठिन परिश्रम, व्यावहारिक योजना, स्थिरता और तकनीकी महारत।',
      nature: 'पृथ्वी/वायु तत्व प्रधान, तार्किक और संगठित।',
      element: 'पृथ्वी / वायु (Earth / Air)',
      luckyColor: 'नीला, भूरा, स्लेटी',
      mantra: 'ॐ रां राहवे नमः',
      crystal: 'गोमेद (Hessonite) अथवा लापिस लाजुली (Lapis Lazuli)',
      remedy: 'पक्षियों को दाना डालें और कार्यस्थल को व्यवस्थित व स्वच्छ रखें।'
    },
    en: {
      title: 'Rahu Structure, Technical Intellect & Pragmatism',
      energy: 'Diligence, structural planning, unconventional wisdom, and tech prowess.',
      nature: 'Earth/Air dominant, analytical, and process-oriented.',
      element: 'Earth / Air',
      luckyColor: 'Blue, Earthy Brown, Grey',
      mantra: 'Om Ram Rahave Namah',
      crystal: 'Hessonite Garnet or Lapis Lazuli',
      remedy: 'Feed wild birds and keep your workspace meticulously organized.'
    },
    mr: {
      title: 'राहूची रचना, तांत्रिक बुद्धी आणि शिस्त ऊर्जा',
      energy: 'कठोर परिश्रम, व्यावहारिक नियोजन, स्थिरता आणि तांत्रिक नैपुण्य.',
      nature: 'पृथ्वी/वायु तत्व प्रधान, तार्किक आणि संघटित.',
      element: 'पृथ्वी / वायू (Earth / Air)',
      luckyColor: 'निळा, तपकिरी, राखाडी',
      mantra: 'ॐ रां राहवे नमः',
      crystal: 'गोमेद (Hessonite) किंवा लॅपिस लाझुली (Lapis Lazuli)',
      remedy: 'पक्ष्यांना दाणे टाका आणि कार्यस्थळ स्वच्छ व व्यवस्थित ठेवा.'
    },
    bn: {
      title: 'রাহুর কাঠামো, প্রযুক্তিগত বুদ্ধি ও শৃঙ্খলা শক্তি',
      energy: 'কঠোর পরিশ্রম, বাস্তববাদী পরিকল্পনা, স্থিতিশীলতা এবং প্রযুক্তিগত দক্ষতা।',
      nature: 'পৃথিবী/বায়ু উপাদান প্রধান, যৌক্তিক ও সুসংগঠিত।',
      element: 'পৃথিবী / বায়ু (Earth / Air)',
      luckyColor: 'নীল, বাদামী, ধূসর',
      mantra: 'ওঁ রাং রাহবে নমঃ',
      crystal: 'গোমেদ (Hessonite) বা ল্যাপিস লাজুলি (Lapis Lazuli)',
      remedy: 'পাখিদের খাদ্য দিন এবং কর্মক্ষেত্র পরিপাটি রাখুন।'
    },
    gu: {
      title: 'રાહુની સંરચના, તકનીકી બુદ્ધિ અને શિસ્ત ઉર્જા',
      energy: 'કઠિન પરિશ્રમ, વ્યવહારિક આયોજન, સ્થિરતા અને તકનીકી નિપુણતા.',
      nature: 'પૃથ્વી/વાયુ તત્વ પ્રધાન, તાર્કિક અને વ્યવસ્થિત.',
      element: 'પૃથ્વી / વાયુ (Earth / Air)',
      luckyColor: 'વાદળી, કથ્થઈ, રાખોડી',
      mantra: 'ૐ રાં રાહવે નમઃ',
      crystal: 'ગોમેદ (Hessonite) અથવા લેપિસ લાઝુલી (Lapis Lazuli)',
      remedy: 'પક્ષીઓને ચણ નાખો અને કાર્યસ્થળને વ્યવસ્થિત રાખો.'
    }
  },
  5: {
    hi: {
      title: 'बुध की वाणिज्य, संचार, बुद्धिमत्ता एवं गतिशीलता',
      energy: 'त्वरित निर्णय, व्यापारिक चातुर्य, संवाद और बहुमुखी प्रतिभा।',
      nature: 'पृथ्वी/जल तत्व प्रधान, अनुकूलनीय और मिलनसार।',
      element: 'पृथ्वी (Earth)',
      luckyColor: 'हरा, हल्का हरा, पन्ना रंग',
      mantra: 'ॐ बुं बुधाय नमः',
      crystal: 'पन्ना (Emerald) अथवा ग्रीन एवेंट्यूरिन (Green Aventurine)',
      remedy: 'गौशाला में हरा चारा दान करें और 15° ऊपर की ओर हस्ताक्षर करें।'
    },
    en: {
      title: 'Mercurial Commerce, Communication & Dynamic Agility',
      energy: 'Swift decision-making, commercial flair, versatility, and sharp articulation.',
      nature: 'Earth/Water balance, adaptable, and networking-oriented.',
      element: 'Earth',
      luckyColor: 'Emerald Green, Mint Green, Ivory',
      mantra: 'Om Bum Budhaya Namah',
      crystal: 'Emerald or Green Aventurine bracelet',
      remedy: 'Donate green fodder to cows and sign documents with a +15° ascending stroke.'
    },
    mr: {
      title: 'बुधाचे व्यापार, संवाद, बुद्धिमत्ता आणि गतिशीलता',
      energy: 'जलद निर्णय, व्यापारी कौशल्य, संवाद आणि बहुआयामी प्रतिभा.',
      nature: 'पृथ्वी/जल तत्व प्रधान, परिस्थितीशी जुळवून घेणारा.',
      element: 'पृथ्वी (Earth)',
      luckyColor: 'हिरवा, हलका हिरवा, पाचू रंग',
      mantra: 'ॐ बुं बुधाय नमः',
      crystal: 'पाचू (Emerald) किंवा ग्रीन एव्हेंच्युरीन (Green Aventurine)',
      remedy: 'गोशाळेत हिरवा चारा दान करा आणि १५° वरच्या बाजूला स्वाक्षरी करा.'
    },
    bn: {
      title: 'বুধের বাণিজ্য, যোগাযোগ, বুদ্ধিমত্তা ও গতিশীলতা',
      energy: 'দ্রুত সিদ্ধান্ত, বাণিজ্যিক চাতুর্য, সংলাপ এবং বহুমুখী প্রতিভা।',
      nature: 'পৃথিবী/জল উপাদান প্রধান, অভিযোজনশীল ও সামাজিক।',
      element: 'পৃথিবী (Earth)',
      luckyColor: 'সবুজ, হালকা সবুজ, পান্না রঙ',
      mantra: 'ওঁ বুং বুধায় নমঃ',
      crystal: 'পান্না (Emerald) বা গ্রিন অ্যাভেনচুরিন (Green Aventurine)',
      remedy: 'গরুকে সবুজ ঘাস খাওয়ান এবং ১৫° ঊর্ধ্বমুখী স্বাক্ষর করার অভ্যাস করুন।'
    },
    gu: {
      title: 'બુધની વાણિજ્ય, સંચાર, બુદ્ધિમત્તા અને ગતિશીલતા',
      energy: 'ત્વરિત નિર્ણય, વેપાર ચતુરતા, સંવાદ અને બહુમુખી પ્રતિભા.',
      nature: 'પૃથ્વી/જળ તત્વ પ્રધાન, અનુકૂલનશીલ અને મિલનસાર.',
      element: 'પૃથ્વી (Earth)',
      luckyColor: 'લીલો, આછો લીલો, પાના રંગ',
      mantra: 'ૐ બું બુધાય નમઃ',
      crystal: 'પન્ના (Emerald) અથવા ગ્રીન એવેન્ટ્યુરીન (Green Aventurine)',
      remedy: 'ગૌશાળામાં લીલો ચારો દાન કરો અને ૧૫° ઉપરની તરફ હસ્તાક્ષર કરો.'
    }
  },
  6: {
    hi: {
      title: 'शुक्र की सौंदर्य, समृद्धि, प्रेम एवं दांपत्य ऊर्जा',
      energy: 'आकर्षण, कलात्मकता, भौतिक संपन्नता, सौहार्द और उत्तरदायित्व।',
      nature: 'जल तत्व प्रधान, परिष्कृत और उदार।',
      element: 'जल (Water)',
      luckyColor: 'सफेद, क्रीम, गुलाबी, हल्का नीला',
      mantra: 'ॐ शुं शुक्राय नमः',
      crystal: 'हीरा (Diamond), ओपल (Opal) अथवा स्फटिक (Clear Quartz)',
      remedy: 'सुगंधी इत्र का प्रयोग करें और शुक्रवार को मीठा दान करें।'
    },
    en: {
      title: 'Venusian Harmony, Prosperity, Aesthetics & Love',
      energy: 'Magnetism, artistic appreciation, marital bliss, and luxury affinity.',
      nature: 'Water-element dominant, refined, and gracious.',
      element: 'Water',
      luckyColor: 'White, Cream, Soft Pink, Sky Blue',
      mantra: 'Om Shum Shukraya Namah',
      crystal: 'Diamond, Australian Opal, or Clear Quartz',
      remedy: 'Wear pleasant fragrances and share sweets on Fridays.'
    },
    mr: {
      title: 'शुक्राचे सौंदर्य, समृद्धी, प्रेम आणि वैवाहिक ऊर्जा',
      energy: 'आकर्षण, कलात्मकता, भौतिक समृद्धी, सौहार्द आणि जबाबदारी.',
      nature: 'जल तत्व प्रधान, सुसंस्कृत आणि उदार.',
      element: 'जल (Water)',
      luckyColor: 'पांढरा, क्रीम, गुलाबी, हलका निळा',
      mantra: 'ॐ शुं शुक्राय नमः',
      crystal: 'हिरा (Diamond), ओपल (Opal) किंवा स्फटिक (Clear Quartz)',
      remedy: 'सुगंधी अत्तर वापरा आणि शुक्रवारी गोड पदार्थांचे दान करा.'
    },
    bn: {
      title: 'শুক্রের সৌন্দর্য, সমৃদ্ধি, প্রেম ও বৈবাহিক শক্তি',
      energy: 'আকর্ষণ, শৈল্পিক ভাব, বৈষয়িক প্রাচুর্য, সম্প্রীতি ও দায়িত্বশীলতা।',
      nature: 'জল উপাদান প্রধান, মার্জিত এবং উদার।',
      element: 'জল (Water)',
      luckyColor: 'সাদা, ক্রিম, গোলাপী, হালকা নীল',
      mantra: 'ওঁ শুং শুক্রায় নমঃ',
      crystal: 'হীরা (Diamond), ওপাল (Opal) বা স্ফটিক (Clear Quartz)',
      remedy: 'সুগন্ধি ব্যবহার করুন এবং শুক্রবারে মিষ্টি দান করুন।'
    },
    gu: {
      title: 'શુક્રની સૌંદર્ય, સમૃદ્ધિ, પ્રેમ અને દાંપત્ય ઉર્જા',
      energy: 'આકર્ષણ, કલાત્મકતા, ભૌતિક સંપન્નતા, સૌહાર્દ અને જવાબદારી.',
      nature: 'જળ તત્વ પ્રધાન, સંસ્કારી અને ઉદાર.',
      element: 'જળ (Water)',
      luckyColor: 'સફેદ, ક્રીમ, ગુલાબી, આછો વાદળી',
      mantra: 'ૐ શું શુક્રાય નમઃ',
      crystal: 'હીરો (Diamond), ઓપલ (Opal) અથવા સ્ફટિક (Clear Quartz)',
      remedy: 'સુગંધી અત્તરનો ઉપયોગ કરો અને શુક્રવારે મીઠાઈનું દાન કરો.'
    }
  },
  7: {
    hi: {
      title: 'केतु की शोध, अंतर्ज्ञान, वैराग्य एवं आध्यात्मिक गहराई',
      energy: 'गूढ़ विश्लेषण, सत्य की खोज, छठी इंद्री और मौलिक विचार।',
      nature: 'अग्नि/जल तत्व प्रधान, शांत और रहस्यमयी।',
      element: 'जल / अग्नि (Water / Fire)',
      luckyColor: 'हल्का पीला, सफेद, हल्का नीला, चितकबरा',
      mantra: 'ॐ कें केतवे नमः',
      crystal: 'लहसुनिया (Cat’s Eye) अथवा अमेथिस्ट (Amethyst)',
      remedy: 'श्वान (कुत्ते) को रोटी खिलाएं और नित्य 10 मिनट मौन ध्यान करें।'
    },
    en: {
      title: 'Ketu Depth, Research Intuition & Spiritual Intellect',
      energy: 'Profound analysis, truth seeking, intuition, and independent reflection.',
      nature: 'Water/Fire blend, introspective, and contemplative.',
      element: 'Water / Fire',
      luckyColor: 'Pale Yellow, White, Light Grey, Lavender',
      mantra: 'Om Kem Ketave Namah',
      crystal: 'Chrysoberyl Cat’s Eye or Amethyst',
      remedy: 'Feed stray dogs with bread/roti and practice 10 minutes of silent meditation daily.'
    },
    mr: {
      title: 'केतूचे संशोधन, अंतर्ज्ञान, वैराग्य आणि आध्यात्मिक खोली',
      energy: 'सखोल विश्लेषण, सत्याचा शोध, अंतःप्रेरणा आणि मूळ विचार.',
      nature: 'अग्नी/जल तत्व प्रधान, शांत आणि गूढ.',
      element: 'जल / अग्नी (Water / Fire)',
      luckyColor: 'हलका पिवळा, पांढरा, हलका निळा',
      mantra: 'ॐ कें केतवे नमः',
      crystal: 'लसण्या (Cat’s Eye) किंवा अ‍ॅमेथिस्ट (Amethyst)',
      remedy: 'कुत्र्याला पोळी खायला द्या आणि दररोज १० मिनिटे ध्यान करा.'
    },
    bn: {
      title: 'কেতুর গবেষণা, অন্তর্দৃষ্টি, বৈরাগ্য ও আধ্যাত্মিক গভীরতা',
      energy: 'গভীর বিশ্লেষণ, সত্যের সন্ধান, ষষ্ঠ ইন্দ্রিয় এবং অনন্য দৃষ্টিভঙ্গি।',
      nature: 'অগ্নি/জল উপাদান প্রধান, শান্ত ও চিন্তাশীল।',
      element: 'জল / অগ্নি (Water / Fire)',
      luckyColor: 'হালকা হলুদ, সাদা, হালকা নীল, ধূসর',
      mantra: 'ওঁ কেং কেতবে নমঃ',
      crystal: 'ক্যাটস আই (Cat’s Eye) বা অ্যামেথিস্ট (Amethyst)',
      remedy: 'কুকুরকে রুটি খাওয়ান এবং প্রতিদিন ১০ মিনিট ধ্যান করুন।'
    },
    gu: {
      title: 'કેતુની શોધ, અંતર્જ્ઞાન, વૈરાગ્ય અને આધ્યાત્મિક ઊંડાણ',
      energy: 'ગૂઢ વિશ્લેષણ, સત્યની શોધ, છઠ્ઠી ઇન્દ્રિય અને મૌલિક વિચાર.',
      nature: 'અગ્નિ/જળ તત્વ પ્રધાન, શાંત અને રહસ્યમયી.',
      element: 'જળ / અગ્નિ (Water / Fire)',
      luckyColor: 'આછો પીળો, સફેદ, આછો વાદળી',
      mantra: 'ૐ કેં કેતવે નમઃ',
      crystal: 'લહસુનિયા (Cat’s Eye) અથવા એમેથિસ્ટ (Amethyst)',
      remedy: 'કૂતરાને રોટલી ખવડાવો અને દરરોજ ૧૦ મિનિટ મૌન ધ્યાન કરો.'
    }
  },
  8: {
    hi: {
      title: 'शनि की न्याय, कर्म, दीर्घकालिक संपत्ति एवं अधिकार ऊर्जा',
      energy: 'अनुशासन, धैर्य, संगठनात्मक क्षमता, न्यायप्रियता और दृढ़ता।',
      nature: 'वायु तत्व प्रधान, गंभीर और परिणाम-उन्मुख।',
      element: 'वायु (Air)',
      luckyColor: 'गहरा नीला, नेवी ब्लू, काला, स्लेटी',
      mantra: 'ॐ शं शनैश्चराय नमः',
      crystal: 'नीलम (Blue Sapphire) अथवा अमेथिस्ट (Amethyst)',
      remedy: 'शनिवार को जरूरतमंदों की सहायता करें और पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं।'
    },
    en: {
      title: 'Saturnian Justice, Manifestation & Structural Mastery',
      energy: 'Patience, endurance, institutional authority, and karmic manifestation.',
      nature: 'Air-element dominant, austere, and resilient.',
      element: 'Air',
      luckyColor: 'Deep Blue, Navy, Charcoal Grey',
      mantra: 'Om Sham Shanaishcharaya Namah',
      crystal: 'Blue Sapphire or Black Tourmaline / Amethyst',
      remedy: 'Assist underprivileged workers on Saturdays and maintain high ethical standards.'
    },
    mr: {
      title: 'शनीचे न्याय, कर्म, दीर्घकालीन संपत्ती आणि अधिकार ऊर्जा',
      energy: 'शिस्त, संयम, संघटनात्मक कौशल्य, न्यायप्रियता आणि चिकाटी.',
      nature: 'वायू तत्व प्रधान, गंभीर आणि परिणामाभिमुख.',
      element: 'वायू (Air)',
      luckyColor: 'गडद निळा, नेव्ही ब्लू, काळा, राखाडी',
      mantra: 'ॐ शं शनैश्चराय नमः',
      crystal: 'नीलम (Blue Sapphire) किंवा अ‍ॅमेथिस्ट (Amethyst)',
      remedy: 'शनिवारी गरजूंना मदत करा आणि पिंपळाच्या झाडाखाली मोहरीच्या तेलाचा दिवा लावा.'
    },
    bn: {
      title: 'শনির ন্যায়, কর্ম, দীর্ঘমেয়াদী স্থায়িত্ব ও কর্তৃত্ব শক্তি',
      energy: 'শৃঙ্খলা, ধৈর্য, প্রাতিষ্ঠানিক দক্ষতা, ন্যায়পরায়ণতা এবং অধ্যবসায়।',
      nature: 'বায়ু উপাদান প্রধান, গম্ভীর এবং বাস্তববাদী।',
      element: 'বায়ু (Air)',
      luckyColor: 'গাঢ় নীল, নেভি ব্লু, ধূসর',
      mantra: 'ওঁ শং শনৈশ্চরায় নমঃ',
      crystal: 'নীলা (Blue Sapphire) বা ব্ল্যাক ট্যুরমালাইন',
      remedy: 'শনিবার অভাবী মানুষকে সাহায্য করুন এবং সততা বজায় রাখুন।'
    },
    gu: {
      title: 'શનિની ન્યાય, કર્મ, દીર્ઘકાલીન સંપત્તિ અને અધિકાર ઉર્જા',
      energy: 'શિસ્ત, ધીરજ, સંગઠનાત્મક ક્ષમતા, ન્યાયપ્રિયતા અને દૃઢતા.',
      nature: 'વાયુ તત્વ પ્રધાન, ગંભીર અને પરિણામલક્ષી.',
      element: 'વાયુ (Air)',
      luckyColor: 'ઘેરો વાદળી, નેવી બ્લૂ, કાળો, રાખોડી',
      mantra: 'ૐ શં શનૈશ્ચરાય નમઃ',
      crystal: 'નીલમ (Blue Sapphire) અથવા એમેથિસ્ટ (Amethyst)',
      remedy: 'શનિવારે જરૂરિયાતમંદોની સહાય કરો અને પીપળાના વૃક્ષ નીચે સરસવના તેલનો દીવો કરો.'
    }
  },
  9: {
    hi: {
      title: 'मंगल की साहस, पराक्रम, गति एवं मानवतावादी ऊर्जा',
      energy: 'ऊर्जा, उत्साह, नेतृत्व, परोपकार और अदम्य साहस।',
      nature: 'अग्नि तत्व प्रधान, गतिशील और निष्ठावान।',
      element: 'अग्नि (Fire)',
      luckyColor: 'लाल, नारंगी, सिंदूरी, गुलाबी',
      mantra: 'ॐ अं अंगारकाय नमः',
      crystal: 'मूंगा (Red Coral) अथवा कार्नेलियन (Carnelian)',
      remedy: 'मंगलवार को हनुमान चालीसा का पाठ करें और भाई-बहनों का सहयोग करें।'
    },
    en: {
      title: 'Martian Courage, Humanitarian Spirit & High Dynamism',
      energy: 'Vitality, executive drive, philanthropy, justice, and valor.',
      nature: 'Fire-element dominant, vigorous, and benevolent.',
      element: 'Fire',
      luckyColor: 'Crimson Red, Coral Orange, Warm Rose',
      mantra: 'Om Am Angarakaya Namah',
      crystal: 'Red Coral or Carnelian bracelet',
      remedy: 'Read Hanuman Chalisa on Tuesdays and support charitable humanitarian causes.'
    },
    mr: {
      title: 'मंगळाचे धाडस, पराक्रम, गती आणि मानवतावादी ऊर्जा',
      energy: 'ऊर्जा, उत्साह, नेतृत्व, परोपकार आणि अफाट धाडस.',
      nature: 'अग्नी तत्व प्रधान, गतिशील आणि एकनिष्ठ.',
      element: 'अग्नी (Fire)',
      luckyColor: 'लाल, नारंगी, शेंदूरी, गुलाबी',
      mantra: 'ॐ अं अंगारकाय नमः',
      crystal: 'पोवळे (Red Coral) किंवा कार्नेलियन (Carnelian)',
      remedy: 'मंगळवारी हनुमान चालीसा म्हणा आणि भावंडांना सहकार्य करा.'
    },
    bn: {
      title: 'মঙ্গলের সাহস, পরাক্রম, গতি ও মানবতাবাদী শক্তি',
      energy: 'শক্তি, উদ্দীপনা, নেতৃত্ব, পরোপকার এবং অদম্য সাহস।',
      nature: 'অগ্নি উপাদান প্রধান, গতিশীল ও বিশ্বস্ত।',
      element: 'অগ্নি (Fire)',
      luckyColor: 'লাল, কমলা, সিঁদুরে লাল',
      mantra: 'ওঁ অং অঙ্গারকায় নমঃ',
      crystal: 'রক্ত প্রবাল (Red Coral) বা কার্নেলিয়ান',
      remedy: 'মঙ্গলবার হনুমান চালিসা পাঠ করুন এবং সমাজসেবায় অংশ নিন।'
    },
    gu: {
      title: 'મંગળની સાહસ, પરાક્રમ, ગતિ અને માનવતાવાદી ઉર્જા',
      energy: 'ઉર્જા, ઉત્સાહ, નેતૃત્વ, પરોપકાર અને અદમ્ય સાહસ.',
      nature: 'અગ્નિ તત્વ પ્રધાન, ગતિશીલ અને નિષ્ઠાવાન.',
      element: 'અગ્નિ (Fire)',
      luckyColor: 'લાલ, કેસરી, સિંદૂરી, ગુલાબી',
      mantra: 'ૐ અં અંગારકાય નમઃ',
      crystal: 'પરવાળું (Red Coral) અથવા કાર્નેલિયન (Carnelian)',
      remedy: 'મંગળવારે હનુમાન ચાલીસાનો પાઠ કરો અને ભાઈ-બહેનોને સહયોગ આપો.'
    }
  }
};

export function getLocalizedNumberMeaning(num: number, lang: SupportedLanguage): LocalizedNumberMeaning {
  const reduced = ((Math.abs(num) - 1) % 9) + 1;
  return NUMBER_MEANINGS[reduced]?.[lang] || NUMBER_MEANINGS[reduced]?.hi;
}

// 4. LOCALIZED 81 YOGAS ENGINE
export interface Localized81Yoga {
  code: string;
  planetaryPair: string;
  title: string;
  positiveMeaning: string;
  challengeMeaning: string;
  careerMeaning: string;
  wealthMeaning: string;
  relationshipMeaning: string;
  spiritualMeaning: string;
  remedy: string;
}

export function getLocalized81Yoga(mulank: number, bhagyank: number, lang: SupportedLanguage): Localized81Yoga {
  const code = `${mulank}-${bhagyank}`;
  const p1 = getPlanetName(mulank, lang);
  const p2 = getPlanetName(bhagyank, lang);
  const pair = `${p1} ↔ ${p2}`;

  const titles: Record<SupportedLanguage, string> = {
    hi: `मूलांक ${mulank} एवं भाग्यांक ${bhagyank} (${pair}) समन्वय योग`,
    en: `Mulank ${mulank} & Bhagyank ${bhagyank} (${pair}) Synergy Combination`,
    mr: `मूलांक ${mulank} आणि भाग्यांक ${bhagyank} (${pair}) समन्वय योग`,
    bn: `মূলাঙ্ক ${mulank} এবং ভাগ্যাঙ্ক ${bhagyank} (${pair}) সমন্বয় যোগ`,
    gu: `મૂળાંક ${mulank} અને ભાગ્યાંક ${bhagyank} (${pair}) સમન્વય યોગ`
  };

  const positiveMeanings: Record<SupportedLanguage, string> = {
    hi: `मूलांक #${mulank} (${p1}) की स्वाभाविक गतिशीलता और भाग्यांक #${bhagyank} (${p2}) की उद्देश्यपूर्ण दिशा का शुभ संगम। यह योग स्वतंत्र नेतृत्व, बौद्धिक स्पष्टता और समाज में विशिष्ट पहचान का मार्ग प्रशस्त करता है।`,
    en: `A harmonious alignment of Mulank #${mulank} (${p1}) initiative with Bhagyank #${bhagyank} (${p2}) destiny trajectory. This grants visionary leadership, intellectual acumen, and distinctive reputation.`,
    mr: `मूलांक #${mulank} (${p1}) ची नैसर्गिक गतिशीलता आणि भाग्यांक #${bhagyank} (${p2}) ची उद्दिष्टपूर्ण दिशा यांचा शुभ संगम. हा योग नेतृत्व आणि बुद्धिमत्तेला चालना देतो.`,
    bn: `মূলাঙ্ক #${mulank} (${p1}) এর স্বাভাবিক গতিশীলতা এবং ভাগ্যাঙ্ক #${bhagyank} (${p2}) এর সুনির্দিষ্ট লক্ষ্যের শুভ মিলন। এটি নেতৃত্বের গুণ ও সামাজিক প্রতিষ্ঠা প্রদান করে।`,
    gu: `મૂળાંક #${mulank} (${p1}) ની સ્વાભાવિક ગતિશીલતા અને ભાગ્યાંક #${bhagyank} (${p2}) ની ઉદ્દેશ્યપૂર્ણ દિશાનો શુભ સંગમ. આ યોગ નેતૃત્વ અને પ્રતિષ્ઠા અપાવે છે.`
  };

  const challengeMeanings: Record<SupportedLanguage, string> = {
    hi: `यदि मूलांक की त्वरित सोच और भाग्यांक की दीर्घकालिक कर्म-दिशा में तालमेल न हो, तो कभी-कभी मन में असमंजस या तनाव आ सकता है।`,
    en: `When the immediate drive of Mulank clashes with the long-term karmic lessons of Bhagyank, momentary hesitation or overthinking may occur.`,
    mr: `जर मूलांकाचे विचार आणि भाग्यांकाची कर्म-दिशा यामध्ये समन्वय नसेल, तर कधीकधी गोंधळ किंवा तणाव निर्माण होऊ शकतो.`,
    bn: `যদি মূলাঙ্কের তাৎক্ষণিক চিন্তা এবং ভাগ্যাঙ্কের দীর্ঘমেয়াদী কর্মের মধ্যে ভারসাম্যের অভাব হয়, তবে সাময়িক বিভ্রান্তি দেখা দিতে পারে।`,
    gu: `જો મૂળાંકના ત્વરિત વિચારો અને ભાગ્યાંકની દીર્ઘકાલીન કર્મ-દિશા વચ્ચે તાલમેલ ન હોય, તો ક્યારેક મનમાં અસમંજસ આવી શકે છે.`
  };

  const careerMeanings: Record<SupportedLanguage, string> = {
    hi: `${p1} की ऊर्जा और ${p2} की कार्यकुशलता के मेल से प्रबंधन, व्यापार, परामर्श या स्वतंत्र कार्यक्षेत्र में निरंतर उन्नति के योग हैं।`,
    en: `Synthesis of ${p1} vitality and ${p2} mastery creates thriving avenues in strategic management, enterprise, consultancy, and innovation.`,
    mr: `${p1} ची ऊर्जा आणि ${p2} ची कार्यक्षमता यांच्या मिलाफामुळे व्यवस्थापन, व्यापार किंवा स्वतंत्र कार्यक्षेत्रात प्रगती होते.`,
    bn: `${p1} এর শক্তি এবং ${p2} এর দক্ষতার সমন্বয়ে পরিচালনা, ব্যবসা, পরামর্শদান বা স্বাধীন কর্মক্ষেত্রে ধারাবাহিক উন্নতি ঘটে।`,
    gu: `${p1} ની ઉર્જા અને ${p2} ની કાર્યકુશળતાના મેળથી મેનેજમેન્ટ, વેપાર, કન્સલ્ટન્સી કે સ્વતંત્ર ક્ષેત્રમાં ઉત્કૃષ્ટ પ્રગતિ થાય છે.`
  };

  const wealthMeanings: Record<SupportedLanguage, string> = {
    hi: `योजनाबद्ध बचत, सुरक्षित निवेश और सही दिशा में निरंतर प्रयासों से जीवन के मध्य और उत्तरार्ध में स्थायी धन लाभ प्राप्त होता है।`,
    en: `Disciplined wealth accumulation, strategic investment prudence, and persistent execution yield solid financial security.`,
    mr: `नियोजनबद्ध बचत आणि योग्य दिशेने केलेल्या प्रयत्नांमुळे आयुष्याच्या मध्यावर आणि नंतर स्थिर संपत्ती प्राप्त होते.`,
    bn: `পরিকল্পিত সঞ্চয় ও সঠিক বিনিয়োগের মাধ্যমে জীবনের মধ্য ও পরবর্তী পর্যায়ে দীর্ঘস্থায়ী আর্থিক সমৃদ্ধি অর্জিত হয়।`,
    gu: `આયોજનબદ્ધ બચત અને સુરક્ષિત રોકાણ દ્વારા જીવનના મધ્ય અને ઉત્તરાર્ધમાં સ્થાયી સંપત્તિનું નિર્માણ થાય છે.`
  };

  const relationshipMeanings: Record<SupportedLanguage, string> = {
    hi: `संबंधों में सत्यनिष्ठा, पारस्परिक सम्मान और एक-दूसरे के व्यक्तिगत विकास में सहयोग को सर्वोच्च प्राथमिकता देते हैं।`,
    en: `Relationships flourish upon mutual respect, authentic dialogue, and celebrating each other's individuality.`,
    mr: `नात्यांमध्ये सत्यनिष्ठा, परस्पर आदर आणि एकमेकांच्या विकासात सहकार्य यांना सर्वोच्च प्राधान्य दिले जाते.`,
    bn: `সম্পর্কের ক্ষেত্রে পারস্পরিক শ্রদ্ধা, স্বচ্ছতা এবং পরস্পরের উন্নতিতে সহযোগিতাকে অগ্রাধিকার দিন।`,
    gu: `સંબંધોમાં નિષ્ઠા, પરસ્પર સન્માન અને એકબીજાના વિકાસમાં સહયોગને સર્વોચ્ચ પ્રાથમિકતા આપો.`
  };

  const spiritualMeanings: Record<SupportedLanguage, string> = {
    hi: `व्यक्तिगत संकल्प को अपने कर्म के साथ जोड़कर आत्मिक संतुलन एवं आंतरिक शांति की प्राप्ति होती है।`,
    en: `Harmonizing personal will with righteous duty unlocks profound inner equilibrium and spiritual peace.`,
    mr: `वैयक्तिक संकल्प आपल्या कर्माशी जोडून आत्मिक संतुलन आणि मानसिक शांती प्राप्त होते.`,
    bn: `ব্যক্তিগত ইচ্ছাশক্তিকে সৎ কর্মের সাথে যুক্ত করে আত্মিক প্রশান্তি ও সন্তুষ্টি লাভ করা যায়।`,
    gu: `વ્યક્તિગત સંકલ્પને કર્મ સાથે જોડીને આત્મિક સંતુલન અને માનસિક શાંતિ પ્રાપ્ત થાય છે.`
  };

  const remedies: Record<SupportedLanguage, string> = {
    hi: `प्रातःकाल शांत चित्त से ध्यान करें, सूर्य को जल दें, बड़ों का सम्मान करें और शुभ रंगों का उपयोग करें।`,
    en: `Practice morning mindfulness, offer water to the Sun, honor elders, and incorporate your auspicious colors into daily life.`,
    mr: `सकाळी शांत चित्ताने ध्यान करा, सूर्याला अर्घ्य द्या, ज्येष्ठांचा आदर करा आणि शुभ रंगांचा वापर करा.`,
    bn: `সকালে শান্ত মনে ধ্যান করুন, সূর্যকে জল দিন, গুরুজনদের শ্রদ্ধা করুন এবং শুভ রঙ ব্যবহার করুন।`,
    gu: `પ્રાતઃકાળે શાંત ચિત્તે ધ્યાન કરો, સૂર્યને જળ અર્પણ કરો, વડીલોનું સન્માન કરો અને શુભ રંગોનો ઉપયોગ કરો.`
  };

  return {
    code,
    planetaryPair: pair,
    title: titles[lang] || titles.hi,
    positiveMeaning: positiveMeanings[lang] || positiveMeanings.hi,
    challengeMeaning: challengeMeanings[lang] || challengeMeanings.hi,
    careerMeaning: careerMeanings[lang] || careerMeanings.hi,
    wealthMeaning: wealthMeanings[lang] || wealthMeanings.hi,
    relationshipMeaning: relationshipMeanings[lang] || relationshipMeanings.hi,
    spiritualMeaning: spiritualMeanings[lang] || spiritualMeanings.hi,
    remedy: remedies[lang] || remedies.hi
  };
}

// 5. LOCALIZED PLANES & ARROWS
export interface LocalizedPlaneResult {
  name: string;
  statusText: string;
  description: string;
  guidance: string;
}

export function getLocalizedPlane(planeId: string, isPresent: boolean, lang: SupportedLanguage): LocalizedPlaneResult {
  const planeDict: Record<string, Record<SupportedLanguage, { name: string; present: string; missing: string; advice: string }>> = {
    MENTAL: {
      hi: {
        name: 'मानसिक तल (Mental Plane: 4-9-2)',
        present: 'तीक्ष्ण स्मृति, तार्किक विश्लेषण, दूरदर्शिता एवं बौद्धिक प्रखरता का सशक्त संतुलन।',
        missing: 'व्यावहारिक विश्लेषण पर अधिक ध्यान दें और महत्वपूर्ण निर्णयों को लिखकर तय करें।',
        advice: 'प्रतिदिन प्राणायाम करें और उत्तर दिशा की ओर मुख करके अध्ययन व योजना बनाएं।'
      },
      en: {
        name: 'Mental Plane (4-9-2)',
        present: 'Sharp memory, rigorous analytical logic, visionary retention, and intellectual clarity.',
        missing: 'Strengthen systematic evaluation by writing down key strategic checkpoints before deciding.',
        advice: 'Practice daily pranayama and face North during strategic planning sessions.'
      },
      mr: {
        name: 'मानसिक स्तर (Mental Plane: 4-9-2)',
        present: 'उत्कृष्ट स्मरणशक्ती, तार्किक विश्लेषण आणि बौद्धिक स्पष्टता.',
        missing: 'व्यावहारिक विश्लेषणावर अधिक भर द्या आणि महत्त्वाचे निर्णय लिहून ठेवा.',
        advice: 'दररोज प्राणायाम करा आणि उत्तरेकडे तोंड करून अभ्यास करा.'
      },
      bn: {
        name: 'মানসিক স্তর (Mental Plane: 4-9-2)',
        present: 'তীক্ষ্ণ স্মৃতিশক্তি, যৌক্তিক বিশ্লেষণ ও মেধার অসাধারণ প্রকাশ।',
        missing: 'ব্যবহারিক বিশ্লেষণে মনোযোগ দিন এবং গুরুত্বপূর্ণ সিদ্ধান্ত লিখে রাখুন।',
        advice: 'প্রতিদিন প্রাণায়াম করুন এবং উত্তর দিকে মুখ করে কাজ করুন।'
      },
      gu: {
        name: 'માનસિક સ્તર (Mental Plane: 4-9-2)',
        present: 'તીક્ષ્ણ સ્મૃતિ, તાર્કિક વિશ્લેષણ, દૂરદર્શિતા અને બૌદ્ધિક પ્રખરતાનું સંતુલન.',
        missing: 'વ્યવહારિક વિશ્લેષણ પર વધુ ધ્યાન આપો અને મહત્વપૂર્ણ નિર્ણયો લખીને નક્કી કરો.',
        advice: 'દરરોજ પ્રાણાયામ કરો અને ઉત્તર દિશા તરફ મુખ રાખીને અભ્યાસ કરો.'
      }
    },
    EMOTIONAL: {
      hi: {
        name: 'भावनात्मक तल (Emotional Plane: 3-5-7)',
        present: 'प्रगाढ़ अंतर्ज्ञान, संवेदनशीलता, मानवीय सहानुभूति और उच्च आंतरिक शांति।',
        missing: 'भावनाओं को संतुलित रखें; अति-संवेदनशीलता या अत्यधिक वैराग्य से बचें।',
        advice: 'हल्के हरे और सफेद रंगों का प्रयोग करें और पारिवारिक संवाद को मधुर रखें।'
      },
      en: {
        name: 'Emotional / Spiritual Plane (3-5-7)',
        present: 'Profound intuition, spiritual perception, empathetic resonance, and inner composure.',
        missing: 'Cultivate emotional equilibrium without tilting into emotional detachment.',
        advice: 'Incorporate soft green and white hues, prioritizing open dialogue at home.'
      },
      mr: {
        name: 'भावनिक स्तर (Emotional Plane: 3-5-7)',
        present: 'सखोल अंतर्ज्ञान, संवेदनशीलता, सहानुभूती आणि आत्मिक शांती.',
        missing: 'भावनांचे संतुलन राखा; अति-संवेदनशीलता टाळा.',
        advice: 'हलक्या हिरव्या आणि पांढऱ्या रंगांचा वापर करा आणि कौटुंबिक संवाद जपा.'
      },
      bn: {
        name: 'আবেগীয় স্তর (Emotional Plane: 3-5-7)',
        present: 'গভীর অন্তর্দৃষ্টি, সংবেদনশীলতা, মানবিক সহানুভূতি ও আত্মিক শান্তি।',
        missing: 'আবেগের ভারসাম্য বজায় রাখুন; অতিরিক্ত সংবেদনশীলতা এড়িয়ে চলুন।',
        advice: 'হালকা সবুজ ও সাদা রঙ ব্যবহার করুন এবং পরিবারের সাথে সুন্দর সম্পর্ক রাখুন।'
      },
      gu: {
        name: 'ભાવનાત્મક સ્તર (Emotional Plane: 3-5-7)',
        present: 'ઊંડું અંતર્જ્ઞાન, સંવેદનશીલતા, માનવીય સહાનુભૂતિ અને આંતરિક શાંતિ.',
        missing: 'લાગણીઓને સંતુલિત રાખો; અતિ-સંવેદનશીલતાથી બચો.',
        advice: 'આછા લીલા અને સફેદ રંગોનો ઉપયોગ કરો અને પારિવારિક સંવાદ મધુર રાખો.'
      }
    },
    PRACTICAL: {
      hi: {
        name: 'व्यावहारिक तल (Practical Plane: 8-1-6)',
        present: 'उत्कृष्ट संगठन, भौतिक संचय, अनुशासन, क्रियान्वयन और प्रशासनिक दक्षता।',
        missing: 'दैनिक कार्यों में अनुशासन और वित्तीय प्रबंधन के स्पष्ट नियम बनाएं।',
        advice: 'शनिवार को जरूरतमंदों की सेवा करें और घर के नैऋत्य कोण में स्थिरता बनाए रखें।'
      },
      en: {
        name: 'Practical / Action Plane (8-1-6)',
        present: 'Superb execution discipline, tangible asset manifestation, and executive resilience.',
        missing: 'Institute structured daily schedules and solid financial budget protocols.',
        advice: 'Support service staff and reinforce structural grounding in the South-West sector.'
      },
      mr: {
        name: 'व्यावहारिक स्तर (Practical Plane: 8-1-6)',
        present: 'उत्कृष्ट संघटन, भौतिक संचय, शिस्त आणि प्रशासकीय कौशल्य.',
        missing: 'दैनिक कामात शिस्त ठेवा आणि आर्थिक व्यवस्थापनाचे नियम पाळा.',
        advice: 'गरजूंना मदत करा आणि घराचा नैऋत्य कोपरा व्यवस्थित ठेवा.'
      },
      bn: {
        name: 'ব্যবহারিক স্তর (Practical Plane: 8-1-6)',
        present: 'চমৎকার সংগঠন, সম্পদ অর্জন, শৃঙ্খলা ও প্রশাসনিক দক্ষতা।',
        missing: 'দৈনন্দিন কাজে শৃঙ্খলা আনুন এবং আর্থিক ব্যবস্থাপনার নিয়ম মেনে চলুন।',
        advice: 'অসহায় মানুষদের সাহায্য করুন এবং দক্ষিণ-পশ্চিম কোণ সুরক্ষিত রাখুন।'
      },
      gu: {
        name: 'વ્યવહારિક સ્તર (Practical Plane: 8-1-6)',
        present: 'ઉત્કૃષ્ટ સંગઠન, ભૌતિક સંચય, શિસ્ત અને વહીવટી કાર્યક્ષમતા.',
        missing: 'દૈનિક કાર્યોમાં શિસ્ત અને નાણાકીય વ્યવસ્થાપનના સ્પષ્ટ નિયમો બનાવો.',
        advice: 'જરૂરિયાતમંદોની સેવા કરો અને ઘરના નૈઋત્ય ખૂણામાં સ્થિરતા જાળવો.'
      }
    },
    GOLDEN_RAJ_YOG: {
      hi: {
        name: 'स्वर्ण राजयोग (Golden Raj Yog: 4-5-6)',
        present: 'संपत्ति, वाणिज्य, भाग्य और सामाजिक प्रतिष्ठा का परम शुभ महायोग।',
        missing: 'राहु, बुध और शुक्र के संतुलन हेतु गाय को चारा दें और कुबेर स्थान को संवर्धित करें।',
        advice: 'उत्तर और दक्षिण-पूर्व दिशाओं को स्वच्छ रखें और 15° ऊपर हस्ताक्षर करें।'
      },
      en: {
        name: 'Golden Raj Yog (4-5-6 Property & Wealth Axis)',
        present: 'The premier cosmic axis for tangible prosperity, business elevation, and enduring fortune.',
        missing: 'Harmonize Rahu, Mercury, and Venus through mindful enterprise and balancing remedies.',
        advice: 'Keep North and South-East sectors energized; sign with an ascending baseline.'
      },
      mr: {
        name: 'सुवर्ण राजयोग (Golden Raj Yog: 4-5-6)',
        present: 'संपत्ती, व्यापार, भाग्य आणि सामाजिक प्रतिष्ठेचा अत्यंत शुभ योग.',
        missing: 'राहू, बुध आणि शुक्राच्या संतुलनासाठी कुबेर स्थानाची काळजी घ्या.',
        advice: 'उत्तर आणि आग्नेय दिशा स्वच्छ ठेवा आणि १५° वरच्या बाजूला स्वाक्षरी करा.'
      },
      bn: {
        name: 'স্বর্ণ রাজযোগ (Golden Raj Yog: 4-5-6)',
        present: 'সম্পদ, বাণিজ্য, সৌভাগ্য ও সামাজিক সম্মানের পরম শুভ মহাযোগ।',
        missing: 'রাহু, বুধ ও শুক্রের ভারসাম্যের জন্য প্রতিকারমূলক ব্যবস্থা নিন।',
        advice: 'উত্তর ও দক্ষিণ-পূর্ব দিক পরিষ্কার রাখুন এবং ঊর্ধ্বমুখী স্বাক্ষর করুন।'
      },
      gu: {
        name: 'સુવર્ણ રાજયોગ (Golden Raj Yog: 4-5-6)',
        present: 'સંપત્તિ, વાણિજ્ય, ભાગ્ય અને સામાજિક પ્રતિષ્ઠાનો પરમ શુભ મહાયોગ.',
        missing: 'રાહુ, બુધ અને શુક્રના સંતુલન માટે ગૌસેવા કરો અને કુબેર સ્થાન સંવર્ધિત કરો.',
        advice: 'ઉત્તર અને અગ્નિ દિશાઓ સ્વચ્છ રાખો અને ૧૫° ઉપર હસ્તાક્ષર કરો.'
      }
    },
    SILVER_RAJ_YOG: {
      hi: {
        name: 'रजत राजयोग (Silver Raj Yog: 2-5-8)',
        present: 'भू-संपत्ति, धैर्य, निरंतर स्थिरता और अचल संपत्ति प्राप्ति का शुभ योग।',
        missing: 'भूमि तत्व के संतुलन हेतु पीले रंग और स्फटिक का प्रयोग करें।',
        advice: 'ईशान एवं नैऋत्य कोण को भारी व संतुलित रखें।'
      },
      en: {
        name: 'Silver Raj Yog (2-5-8 Earth & Stability Axis)',
        present: 'The grounded Earth axis governing real estate, steady endurance, and property accumulation.',
        missing: 'Ground earth frequencies using crystals, earthy tones, and steadfast routines.',
        advice: 'Maintain balance in the North-East and South-West energy centers.'
      },
      mr: {
        name: 'रजत राजयोग (Silver Raj Yog: 2-5-8)',
        present: 'जमीन-जुमला, संयम, सातत्यपूर्ण स्थिरता आणि संपत्तीचा शुभ योग.',
        missing: 'पृथ्वी तत्वाच्या संतुलनासाठी पिवळा रंग आणि स्फटिकाचा वापर करा.',
        advice: 'ईशान्य आणि नैऋत्य कोपरे संतुलित ठेवा.'
      },
      bn: {
        name: 'রজত রাজযোগ (Silver Raj Yog: 2-5-8)',
        present: 'ভূমি-সম্পত্তি, ধৈর্য, ধারাবাহিক স্থায়িত্ব ও বাড়ি-গাড়ির শুভ যোগ।',
        missing: 'মাটির উপাদানের ভারসাম্যের জন্য হলুদ রঙ ও স্ফটিক ব্যবহার করুন।',
        advice: 'ঈশান ও নৈঋত কোণ পরিচ্ছন্ন ও ভারমুক্ত রাখুন।'
      },
      gu: {
        name: 'રજત રાજયોગ (Silver Raj Yog: 2-5-8)',
        present: 'જમીન-સંપત્તિ, ધીરજ, નિરંતર સ્થિરતા અને અચલ સંપત્તિનો શુભ યોગ.',
        missing: 'પૃથ્વી તત્વના સંતુલન માટે પીળો રંગ અને સ્ફટિકનો ઉપયોગ કરો.',
        advice: 'ઈશાન અને નૈઋત્ય ખૂણાને સંતુલિત રાખો.'
      }
    }
  };

  const current = planeDict[planeId] || planeDict.MENTAL;
  const langData = current[lang] || current.hi;

  return {
    name: langData.name,
    statusText: isPresent ? (lang === 'en' ? 'Active / Complete' : lang === 'mr' ? 'सक्रिय / पूर्ण' : lang === 'bn' ? 'সক্রিয় / সম্পূর্ণ' : lang === 'gu' ? 'સક્રિય / પૂર્ણ' : 'सक्रिय / पूर्ण') : (lang === 'en' ? 'Incomplete / Balancing Needed' : lang === 'mr' ? 'अपूर्ण / उपाय आवश्यक' : lang === 'bn' ? 'অসম্পূর্ণ / প্রতিকার প্রয়োজন' : lang === 'gu' ? 'અપૂર્ણ / ઉપાય જરૂરી' : 'अपूर्ण / संतुलन आवश्यक'),
    description: isPresent ? langData.present : langData.missing,
    guidance: langData.advice
  };
}

// 6. LOCALIZED PERSONAL YEAR FORECAST (1-9)
export interface LocalizedPersonalYear {
  year: number;
  personalYear: number;
  theme: string;
  career: string;
  finance: string;
  relationships: string;
  family: string;
  travel: string;
  opportunities: string;
  caution: string;
  recommendedFocus: string;
}

export function getLocalizedPersonalYear(py: number, year: number, lang: SupportedLanguage): LocalizedPersonalYear {
  const safePY = ((Math.abs(py) - 1) % 9) + 1;

  const pyData: Record<number, Record<SupportedLanguage, Omit<LocalizedPersonalYear, 'year' | 'personalYear'>>> = {
    1: {
      hi: {
        theme: 'नया शुभारंभ, नई योजनाएं, नेतृत्व एवं स्वतंत्र पहल (Year of New Beginnings)',
        career: 'नई नौकरी, स्वतंत्र प्रोजेक्ट या व्यवसाय शुरू करने के लिए अत्यंत अनुकूल वर्ष।',
        finance: 'दीर्घकालिक निवेशों की शुरुआत करें। नए वित्तीय स्रोत बनाएं।',
        relationships: 'आत्म-पहचान को मजबूत करें, लेकिन अहंकार से बचें।',
        family: 'परिवार में आपके निर्णयों को प्राथमिकता मिलेगी।',
        travel: 'काम और नए अवसरों के सिलसिले में यात्राओं के योग।',
        opportunities: 'नेतृत्व के पद, नए अनुबंध और समाज में नई पहचान।',
        caution: 'अति-उत्साह में बिना जांचे-परखे बड़े जोखिम न लें।',
        recommendedFocus: 'नवाचार, आत्म-अनुशासन और स्पष्ट कार्ययोजना पर ध्यान केंद्रित करें।'
      },
      en: {
        theme: 'Year of New Beginnings, Leadership & Pioneering Initiatives',
        career: 'Exceptional year to launch new ventures, accept promotions, or initiate independent projects.',
        finance: 'Seed long-term investments; build innovative income channels with calculated confidence.',
        relationships: 'Fortify self-respect while avoiding ego clashes in close bonds.',
        family: 'Your counsel will be sought for key family milestones.',
        travel: 'Strategic journeys connected with career growth and expansion.',
        opportunities: 'Executive leadership roles, new commercial contracts, and fresh recognition.',
        caution: 'Avoid impulsive gambles without due diligence.',
        recommendedFocus: 'Focus on clear structured goal execution and personal discipline.'
      },
      mr: {
        theme: 'नवीन सुरुवात, नवीन योजना, नेतृत्व आणि पुढाकार (Year of New Beginnings)',
        career: 'नवीन नोकरी किंवा व्यवसाय सुरू करण्यासाठी अत्यंत अनुकूल वर्ष.',
        finance: 'दीर्घकालीन गुंतवणुकीची सुरुवात करा आणि नवीन उत्पन्नाचे स्रोत शोधा.',
        relationships: 'नात्यांमध्ये अहंकाराला थारा देऊ नका.',
        family: 'कुटुंबात तुमच्या निर्णयांना मान दिला जाईल.',
        travel: 'कामाच्या आणि नवीन संधींच्या संदर्भात प्रवासाचे योग.',
        opportunities: 'नेतृत्व पदे आणि समाजात नवी ओळख.',
        caution: 'अति-उत्साहात घाईघाईने मोठे निर्णय घेऊ नका.',
        recommendedFocus: 'नवनिर्मिती, शिस्त आणि स्पष्ट कार्ययोजनेवर भर द्या.'
      },
      bn: {
        theme: 'নতুন সূচনা, নতুন পরিকল্পনা, নেতৃত্ব ও উদ্যোগ (Year of New Beginnings)',
        career: 'নতুন চাকরি বা ব্যবসা শুরু করার জন্য অত্যন্ত শুভ বছর।',
        finance: 'দীর্ঘমেয়াদী বিনিয়োগ শুরু করুন এবং আয়ের নতুন পথ তৈরি করুন।',
        relationships: 'সম্পর্কে অহংকার পরিহার করুন ও পারস্পরিক সম্মান রাখুন।',
        family: 'পরিবারে আপনার সিদ্ধান্তের গুরুত্ব বৃদ্ধি পাবে।',
        travel: 'কাজের সূত্রে ও নতুন সুযোগের জন্য ভ্রমণের সম্ভাবনা।',
        opportunities: 'নেতৃত্বের স্থান, নতুন চুক্তি ও সামাজিক সম্মান।',
        caution: 'অতিরিক্ত উত্তেজনায় অপরিকল্পিত ঝুঁকি নেবেন না।',
        recommendedFocus: 'উদ্ভাবন, আত্মনিয়ন্ত্রণ এবং সুনির্দিষ্ট কর্মপরিকল্পনায় মনোযোগ দিন।'
      },
      gu: {
        theme: 'નવો પ્રારંભ, નવી યોજનાઓ, નેતૃત્વ અને સ્વતંત્ર પહેલ (Year of New Beginnings)',
        career: 'નવી નોકરી કે વેપાર શરૂ કરવા માટે અત્યંત અનુકૂળ વર્ષ.',
        finance: 'દીર્ઘકાલીન રોકાણની શરૂઆત કરો અને નવા આવકના સ્ત્રોત બનાવો.',
        relationships: 'સંબંધોમાં અહંકારથી બચો અને પરસ્પર સન્માન રાખો.',
        family: 'પરિવારમાં તમારા નિર્ણયોને પ્રાથમિકતા મળશે.',
        travel: 'કામ અને નવી તકોના સંદર્ભમાં પ્રવાસના યોગ.',
        opportunities: 'નેતૃત્વ પદ, નવા કરારો અને સમાજમાં નવી ઓળખ.',
        caution: 'અતિ-ઉત્સાહમાં ઉતાવળા નિર્ણયો ન લો.',
        recommendedFocus: 'નવીનતા, શિસ્ત અને સ્પષ્ટ કાર્યયોજના પર ધ્યાન કેન્દ્રિત કરો.'
      }
    },
    5: {
      hi: {
        theme: 'परिवर्तन, गतिशीलता, व्यापारिक लाभ एवं बहुआयामी विस्तार (Year of Dynamic Change)',
        career: 'व्यापार, मार्केटिंग, संचार और नौकरी में सकारात्मक बदलाव के प्रबल योग।',
        finance: 'नकदी प्रवाह (Cash Flow) में तेजी आएगी। व्यापारिक सौदे लाभकारी रहेंगे।',
        relationships: 'नए लोगों से परिचय होगा। रिश्तों में खुलापन ताजगी लाएगा।',
        family: 'पारिवारिक जीवन में चहल-पहल और नए बदलावों का स्वागत होगा।',
        travel: 'व्यावसायिक एवं दर्शनीय यात्राओं के अनेक शुभ अवसर।',
        opportunities: 'नए बाजारों तक पहुंच, डिजिटल विस्तार और त्वरित लाभ।',
        caution: 'अस्थिरता और बिना योजना के अनावश्यक बदलावों से बचें।',
        recommendedFocus: 'लचीलापन, मार्केटिंग और संपर्कों को सक्रिय रखना।'
      },
      en: {
        theme: 'Year of Freedom, Dynamic Transition & Commercial Expansion',
        career: 'High-momentum phase for commerce, digital expansion, promotion, and marketing.',
        finance: 'Accelerated cash flow and profitable mercantile transactions.',
        relationships: 'Expansive networking, exciting encounters, and revitalized communication.',
        family: 'Welcoming dynamic home transitions and positive domestic shifts.',
        travel: 'Frequent fruitful journeys for business networking and recreation.',
        opportunities: 'Market penetration, quick negotiation victories, and public reach.',
        caution: 'Guard against scattered focus and impulsive restlessness.',
        recommendedFocus: 'Agility, proactive marketing, and nurturing strategic partnerships.'
      },
      mr: {
        theme: 'बदल, गतिशीलता, व्यापारी नफा आणि बहुआयामी विस्तार (Year of Dynamic Change)',
        career: 'व्यापार, मार्केटिंग आणि नोकरीत सकारात्मक बदलांचे प्रबळ योग.',
        finance: 'कॅश फ्लो चांगला राहील आणि सौदे फायदेशीर ठरतील.',
        relationships: 'नवीन ओळखी होतील आणि नात्यांमध्ये ताजेतवानेपणा येईल.',
        family: 'कौटुंबिक जीवनात नवीन बदलांचे स्वागत होईल.',
        travel: 'व्यावसायिक आणि पर्यटन प्रवासाचे शुभ योग.',
        opportunities: 'नवीन बाजारपेठांमध्ये प्रवेश आणि त्वरित लाभ.',
        caution: 'अस्थिरता आणि विनाकारण बदल करणे टाळा.',
        recommendedFocus: 'लवचिकता आणि आपले संपर्क सक्रिय ठेवण्यावर भर द्या.'
      },
      bn: {
        theme: 'পরিবর্তন, গতিশীলতা, বাণিজ্যিক লাভ ও বহুমুখী বিস্তার (Year of Dynamic Change)',
        career: 'ব্যবসা, মার্কেটিং ও কর্মক্ষেত্রে ইতিবাচক পরিবর্তনের চমৎকার যোগ।',
        finance: 'নগদ অর্থের প্রবাহ বাড়বে ও বাণিজ্যিক চুক্তি লাভজনক হবে।',
        relationships: 'নতুন মানুষের সাথে পরিচয় হবে ও সম্পর্কে নতুন মাত্রা যোগ হবে।',
        family: 'পারিবারিক জীবনে আনন্দদায়ক পরিবর্তনের সূচনা।',
        travel: 'ব্যবসা ও আনন্দের জন্য অনুকূল ভ্রমণের সুযোগ।',
        opportunities: 'নতুন বাজারে বিস্তার, ডিজিটাল প্রবৃদ্ধি ও দ্রুত সিদ্ধান্তের সুফল।',
        caution: 'অস্থিরতা ও লক্ষ্যহীন ঘোরাঘুরি পরিহার করুন।',
        recommendedFocus: 'নমনীয়তা, মার্কেটিং এবং যোগাযোগ বৃদ্ধি।'
      },
      gu: {
        theme: 'પરિવર્તન, ગતિશીલતા, વેપારિક લાભ અને બહુઆયામી વિસ્તરણ (Year of Dynamic Change)',
        career: 'વેપાર, માર્કેટિંગ, સંચાર અને નોકરીમાં સકારાત્મક પરિવર્તનના પ્રબળ યોગ.',
        finance: 'કેશ ફ્લો ઝડપી બનશે અને વેપારિક સોદાઓ લાભદાયી રહેશે.',
        relationships: 'નવા લોકો સાથે પરિચય થશે અને સંબંધોમાં તાજગી આવશે.',
        family: 'પારિવારિક જીવનમાં ખુશીઓ અને નવા પરિવર્તનો આવશે.',
        travel: 'વ્યવસાયિક અને મનોરંજક યાત્રાઓના શુભ અવસર.',
        opportunities: 'નવા બજારો સુધી પહોંચ અને ત્વરિત નિર્ણયોનો લાભ.',
        caution: 'અસ્થિરતા અને યોજના વિનાના ફેરફારોથી બચો.',
        recommendedFocus: 'લવચીકતા, માર્કેટિંગ અને સંપર્કોને સક્રિય રાખવા.'
      }
    }
  };

  const selected = pyData[safePY] || pyData[5];
  const langNarrative = selected[lang] || selected.hi;

  return {
    year,
    personalYear: safePY,
    ...langNarrative
  };
}

// 7. LOCALIZED EXPERT DOSSIER BUILDER
export function buildLocalizedExpertDossier(
  profile: CompleteNumerologyProfile,
  lang: SupportedLanguage
) {
  const mulank = profile.coreNumbers.mulank || 1;
  const bhagyank = profile.coreNumbers.bhagyank || 1;
  const p1 = getPlanetName(mulank, lang);
  const p2 = getPlanetName(bhagyank, lang);
  const mulankInfo = getLocalizedNumberMeaning(mulank, lang);
  const bhagyankInfo = getLocalizedNumberMeaning(bhagyank, lang);
  const yoga81 = getLocalized81Yoga(mulank, bhagyank, lang);

  const dobValue = profile.identity.dob || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const parsed = parseIndianDate(dobValue);
  const day = parsed?.day || 1;
  const year = parsed?.year || new Date().getFullYear();

  const currentYear = new Date().getFullYear();
  const rDay = ((day - 1) % 9) + 1;
  const rMonth = (((parsed?.month || 11) - 1) % 9) + 1;
  const rYear = ((year - 1) % 9) + 1;
  const py = (((rDay + rMonth + (((currentYear - 1) % 9) + 1) - 1) % 9) + 1);

  const pyNarrative = getLocalizedPersonalYear(py, currentYear, lang);

  // Month forecast in active language
  const months = LOCALIZED_MONTHS[lang] || LOCALIZED_MONTHS.hi;
  const monthlyForecast = months.map((mName, idx) => {
    const mNum = idx + 1;
    const pm = (((py + mNum - 1) % 9) + 1);
    const pmPlanet = getPlanetName(pm, lang);
    return {
      monthIndex: idx,
      monthNameHi: LOCALIZED_MONTHS.hi[idx],
      monthNameEn: LOCALIZED_MONTHS.en[idx],
      monthNameActive: mName,
      py,
      pm,
      mahadashaPlanet: p2,
      antardashaPlanet: p1,
      primaryTheme: lang === 'en'
        ? `Month influenced by Root #${pm} (${pmPlanet}). Focus on execution and strategic priority.`
        : lang === 'mr'
        ? `महिन्याचा प्रभाव अंक #${pm} (${pmPlanet}) द्वारे संचालित आहे. योजनाबद्ध कामावर भर द्या.`
        : lang === 'bn'
        ? `মাসের প্রভাব সংখ্যা #${pm} (${pmPlanet}) দ্বারা পরিচালিত। কর্মে ধারাবাহিকতা রাখুন।`
        : lang === 'gu'
        ? `મહિનાનો પ્રભાવ અંક #${pm} (${pmPlanet}) દ્વારા સંચાલિત છે. યોજનાબદ્ધ કાર્ય કરો.`
        : `माह का प्रभाव अंक #${pm} (${pmPlanet}) द्वारा संचालित है। योजनाबद्ध ढंग से कार्य करें।`,
      career: lang === 'en' ? 'Keep priorities aligned with structured teamwork.' : lang === 'mr' ? 'सहकाऱ्यांशी समन्वय ठेवून काम करा.' : lang === 'bn' ? 'সহকর্মীদের সাথে সমন্বয় রেখে কাজ করুন।' : lang === 'gu' ? 'સહયોગીઓ સાથે તાલમેલ રાખીને કામ કરો.' : 'सहयोगियों के साथ सामंजस्य बनाकर कार्य करें।',
      finance: lang === 'en' ? 'Maintain balanced cashflow and budget control.' : lang === 'mr' ? 'आर्थिक संतुलन राखा आणि अनावश्यक खर्च टाळा.' : lang === 'bn' ? 'আর্থিক ভারসাম্য বজায় রাখুন ও অপব্যয় এড়িয়ে চলুন।' : lang === 'gu' ? 'નાણાકીય સંતુલન જાળવો અને બિનજરૂરી ખર્ચ ટાળો.' : 'वित्तीय संतुलन बनाए रखें और अनावश्यक व्यय से बचें।',
      relationship: lang === 'en' ? 'Foster empathetic dialogue with family.' : lang === 'mr' ? 'परस्पर समंजसपणा आणि सकारात्मक संवाद ठेवा.' : lang === 'bn' ? 'পারস্পরিক বোঝাপড়া ও ইতিবাচক সংলাপ বজায় রাখুন।' : lang === 'gu' ? 'પરસ્પર સમજણ અને સકારાત્મક સંવાદ રાખો.' : 'पारस्परिक समझ और सकारात्मक संवाद का अभ्यास करें।',
      caution: lang === 'en' ? 'Avoid impulsive hasty decisions.' : lang === 'mr' ? 'घाईगडबडीत किंवा भावनेच्या भरात निर्णय घेऊ नका.' : lang === 'bn' ? 'তাড়াহুড়ো বা আবেগে কোনো সিদ্ধান্ত নেবেন না।' : lang === 'gu' ? 'ઉતાવળમાં કે લાગણીવશ થઈને નિર્ણયો ન લો.' : 'जल्दबाजी या भावुकता में निर्णय न लें।',
      action: lang === 'en' ? 'Practice daily discipline and morning grounding.' : lang === 'mr' ? 'दैनंदिन शिस्त आणि कामांचे पूर्व-नियोजन करा.' : lang === 'bn' ? 'দৈনন্দিন শৃঙ্খলা ও কাজের পূর্ব-পরিকল্পনা বজায় রাখুন।' : lang === 'gu' ? 'દૈનિક શિસ્ત અને કાર્યોનું પૂર્વ આયોજન કરો.' : 'दैनिक अनुशासन और कार्यों की पूर्व-तैयारी रखें।'
    };
  });

  // Localized Tithi Ank
  const tithiNature = lang === 'en'
    ? `Root Frequency #${day} combines the vibrational essence of ${p1} and destiny lessons.`
    : lang === 'mr'
    ? `जन्म तारीख #${day} ही ${p1} ची वैश्विक ऊर्जा आणि कर्म-दिशा यांचे शुभ प्रकटीकरण आहे.`
    : lang === 'bn'
    ? `জন্ম তারিখ #${day} হলো ${p1} এর মহাজাগতিক শক্তি ও কর্ম-পথের শুভ প্রকাশ।`
    : lang === 'gu'
    ? `જન્મ તારીખ #${day} એ ${p1} ની વૈશ્વિક ઉર્જા અને કર્મ-દિશાનું શુભ પ્રગટીકરણ છે.`
    : `जन्म तारीख #${day} आपके व्यक्तित्व में ${p1} की ऊर्जा और स्वाभाविक गुणों का संचार करती है।`;

  const numericalFrequency = lang === 'en'
    ? `Vibrational synergy: Day #${day} reduces to Root #${mulank} (${p1}), governing your initial spark and cognitive approach.`
    : lang === 'mr'
    ? `कंपन समन्वय: तारीख #${day} चे मूलांक #${mulank} (${p1}) मध्ये रूपांतर होते, जे तुमचा स्वभाव आणि निर्णयक्षमता दर्शवते.`
    : lang === 'bn'
    ? `কম্পন সমন্বয়: তারিখ #${day} থেকে মূলাঙ্ক #${mulank} (${p1}) তৈরি হয়, যা আপনার স্বভাব ও বুদ্ধিমত্তা প্রকাশ করে।`
    : lang === 'gu'
    ? `કંપન સમન્વય: તારીખ #${day} નું મૂળાંક #${mulank} (${p1}) માં રૂપાંતર થાય છે, જે તમારા સ્વભાવ અને નિર્ણયોને સંચાલિત કરે છે.`
    : `कंपन समन्वय: तारीख #${day} का मूलांक #${mulank} (${p1}) में रूपांतरण होता है, जो आपकी प्रारंभिक विचार शैली और निर्णयों को दिशा देता है।`;

  // Localized Unique About You
  const uniqueAboutYou = {
    cosmicSignature: lang === 'en'
      ? `Dynamic synthesis of Mulank #${mulank} initiative and Bhagyank #${bhagyank} analytical vision.`
      : lang === 'mr'
      ? `मूलांक #${mulank} चा पुढाकार आणि भाग्यांक #${bhagyank} चा दूरदर्शी दृष्टिकोन यांचा सुरेख संगम.`
      : lang === 'bn'
      ? `মূলাঙ্ক #${mulank} এর উদ্যোগ এবং ভাগ্যাঙ্ক #${bhagyank} এর দূরদর্শী দৃষ্টিভঙ্গির চমৎকার মিলন।`
      : lang === 'gu'
      ? `મૂળાંક #${mulank} નો પુરાતત્વ ઉત્સાહ અને ભાગ્યાંક #${bhagyank} નો દીર્ઘદ્રષ્ટા દૃષ્ટિકોણ.`
      : `मूलांक #${mulank} की अग्रणी ऊर्जा और भाग्यांक #${bhagyank} के शोधपरक दृष्टिकोण का अद्वितीय संगम।`,
    hiddenGift: lang === 'en'
      ? `Natural aptitude for strategic discernment, innovative problem-solving, and impactful communication.`
      : lang === 'mr'
      ? `रणनीतिक समज, नाविन्यपूर्ण समस्या निवारण आणि प्रभावी संवाद साधण्याची उपजत देणगी.`
      : lang === 'bn'
      ? `কৌশলগত অন্তর্দৃষ্টি, উদ্ভাবনী সমস্যা সমাধান এবং শক্তিশালী যোগাযোগের সহজাত ক্ষমতা।`
      : lang === 'gu'
      ? `રણનીતિક સમજ, નવીન સમસ્યા નિવારણ અને પ્રભાવશાળી સંવાદની કુદરતી ક્ષમતા.`
      : `रणनीतिक अंतर्दृष्टि, नए समाधान खोजने की क्षमता और प्रभावशाली परामर्श कौशल।`,
    distinctiveAura: lang === 'en'
      ? `Magnetic intellectual aura radiating confidence, balance, and composed resilience.`
      : lang === 'mr'
      ? `आत्मविश्वास, संतुलन आणि संयम पसरवणारे प्रभावी व्यक्तिमत्त्व.`
      : lang === 'bn'
      ? `আত্মবিশ্বাস, ভারসাম্য এবং সংযম বিকিরণকারী আকর্ষণীয় ব্যক্তিত্ব।`
      : lang === 'gu'
      ? `આત્મવિશ્વાસ, સંતુલન અને સંયમ પ્રસારિત કરતું આકર્ષક વ્યક્તિત્વ.`
      : `आत्मविश्वास, संतुलन और संयम से युक्त एक विशिष्ट व विश्वसनीय आभा-मंडल।`
  };

  // Localized Life Challenges
  const lifeChallenges = [
    {
      name: lang === 'en' ? 'First Life Challenge' : lang === 'mr' ? 'पहिले जीवन आव्हान' : lang === 'bn' ? 'প্রথম জীবন চ্যালেঞ্জ' : lang === 'gu' ? 'પ્રથમ જીવન પડકાર' : 'प्रथम जीवन चुनौती',
      value: Math.abs(rDay - rMonth),
      planet: p1,
      area: lang === 'en' ? 'Self-assertion vs Patience' : lang === 'mr' ? 'आत्मविश्वास आणि संयम' : lang === 'bn' ? 'আত্মবিশ্বাস ও ধৈর্য' : lang === 'gu' ? 'આત્મવિશ્વાસ અને ધીરજ' : 'आत्म-अभिव्यक्ति एवं संयम',
      lesson: lang === 'en' ? 'Cultivate deliberate patience before taking massive leaps.' : lang === 'mr' ? 'मोठे निर्णय घेताना संयम बाळगणे शिका.' : lang === 'bn' ? 'বড় পদক্ষেপ নেওয়ার আগে ধৈর্য অভ্যাস করুন।' : lang === 'gu' ? 'મોટા નિર્ણયો લેતા પહેલા ધીરજ રાખવી શીખો.' : 'बड़े निर्णय लेते समय धैर्य और दूरदर्शिता का अभ्यास करें।',
      remedy: mulankInfo.remedy
    },
    {
      name: lang === 'en' ? 'Main Karmic Challenge' : lang === 'mr' ? 'मुख्य कार्मिक आव्हान' : lang === 'bn' ? 'প্রধান কার্মিক চ্যালেঞ্জ' : lang === 'gu' ? 'મુખ્ય કાર્મિક પડકાર' : 'मुख्य कार्मिक चुनौती',
      value: Math.abs(rDay - rYear),
      planet: p2,
      area: lang === 'en' ? 'Long-term Focus & Discipline' : lang === 'mr' ? 'दीर्घकालीन एकाग्रता आणि शिस्त' : lang === 'bn' ? 'দীর্ঘমেয়াদী লক্ষ্য ও শৃঙ্খলা' : lang === 'gu' ? 'દીર્ઘકાલીન એકાગ્રતા અને શિસ્ત' : 'दीर्घकालिक लक्ष्य एवं अनुशासन',
      lesson: lang === 'en' ? 'Maintain consistency even during plateau phases of life.' : lang === 'mr' ? 'जीवनाच्या चढ-उतारात कामात सातत्य ठेवा.' : lang === 'bn' ? 'জীবনের প্রতিটি পর্যায়ে কর্মে ধারাবাহিকতা রাখুন।' : lang === 'gu' ? 'જીવનના દરેક તબક્કે કાર્યમાં સાતત્ય રાખો.' : 'कठिन परिस्थितियों में भी अपने मूल सिद्धांतों पर अडिग रहें।',
      remedy: bhagyankInfo.remedy
    }
  ];

  // Localized Characteristics Profile
  const characteristicsProfile = {
    thinkingStyle: lang === 'en'
      ? `Analytical, intuitive, and future-focused with structured logic.`
      : lang === 'mr'
      ? `तार्किक, अंतर्ज्ञानी आणि भविष्याभिमुख विचारपद्धती.`
      : lang === 'bn'
      ? `যৌক্তিক, স্বজ্ঞাত এবং দূরদর্শী চিন্তাভাবনা।`
      : lang === 'gu'
      ? `તાર્કિક, અંતર્જ્ઞાની અને ભવિષ્યલક્ષી વિચારશૈલી.`
      : `तार्किक, अंतर्ज्ञानी और भविष्योन्मुखी विचार शैली।`,
    emotionalResponse: lang === 'en'
      ? `Composed, empathetic, yet values personal space and dignified boundaries.`
      : lang === 'mr'
      ? `संयमी, संवेदनशील आणि वैयक्तिक स्वातंत्र्याला महत्त्व देणारा स्वभाव.`
      : lang === 'bn'
      ? `সংযমী, সহানুভূতিশীল এবং ব্যক্তিগত মর্যাদাকে গুরুত্ব দেওয়ার মানসিকতা।`
      : lang === 'gu'
      ? `સંયમી, સંવેદનશીલ અને વ્યક્તિગત મર્યાદાઓને માન આપતો સ્વભાવ.`
      : `संयमित, संवेदनशील और गरिमापूर्ण सीमाएं बनाए रखने वाला स्वभाव।`,
    workHabit: lang === 'en'
      ? `Methodical, self-directed, and motivated by tangible excellence.`
      : lang === 'mr'
      ? `पद्धतशीर, स्वयं-प्रेरित आणि उत्कृष्टतेला प्राधान्य देणारी कार्यशैली.`
      : lang === 'bn'
      ? `পদ্ধতিগত, স্ব-প্রণোদিত এবং শ্রেষ্ঠত্ব অর্জনে বিশ্বাসী কর্মপদ্ধতি।`
      : lang === 'gu'
      ? `પદ્ધતિસર, સ્વ-પ્રેરિત અને ઉત્કૃષ્ટતાને પ્રાથમિકતા આપતી કાર્યશૈલી.`
      : `व्यवस्थित, स्व-प्रेरित और गुणवत्ता को प्राथमिकता देने वाली कार्यशैली।`,
    socialConduct: lang === 'en'
      ? `Courteous, selective in friendships, highly respected in intellectual circles.`
      : lang === 'mr'
      ? `सभ्य, निवडक मित्रमंडळी आणि विद्वान वर्गात आदरणीय.`
      : lang === 'bn'
      ? `ভদ্র, বাছাই করা বন্ধুত্ব এবং গুণী সমাজে সমাদৃত।`
      : lang === 'gu'
      ? `નમ્ર, પસંદગીના મિત્રો અને બૌદ્ધિક વર્તુળોમાં આદરણીય.`
      : `सभ्य, प्रबुद्ध मित्रों की संगति पसंद करने वाला और सामाजिक रूप से सम्मानित।`,
    leadershipTrait: lang === 'en'
      ? `Visionary leadership through mentorship, strategic planning, and meritocracy.`
      : lang === 'mr'
      ? `मार्गदर्शन, रणनीतिक नियोजन आणि गुणवत्तेच्या आधारे नेतृत्व.`
      : lang === 'bn'
      ? `পরামর্শদান, কৌশলগত পরিকল্পনা এবং যোগ্যতার ভিত্তিতে নেতৃত্ব।`
      : lang === 'gu'
      ? `માર્ગદર્શન, રણનીતિક આયોજન અને યોગ્યતાના આધારે નેતૃત્વ.`
      : `मार्गदर्शन, स्पष्ट रणनीति और योग्यता पर आधारित दूरदर्शी नेतृत्व।`
  };

  // Localized Education Analysis
  const educationAnalysis = {
    learningStyle: lang === 'en'
      ? 'Conceptual comprehension combined with practical execution and deep inquiry.'
      : lang === 'mr'
      ? 'संकल्पनात्मक समज आणि प्रत्यक्ष अनुभूतीवर आधारित अध्ययन.'
      : lang === 'bn'
      ? 'ধারণাগত বোঝাপড়া এবং বাস্তব প্রয়োগের মাধ্যমে শেখা।'
      : lang === 'gu'
      ? 'સંકલ્પનાત્મક સમજ અને પ્રાયોગિક અનુભવ આધારિત અધ્યયન.'
      : 'अवधारणात्मक समझ और व्यावहारिक अनुप्रयोग पर आधारित अध्ययन शैली।',
    studyDirection: lang === 'en' ? 'North / North-East' : lang === 'mr' ? 'उत्तर / ईशान्य' : lang === 'bn' ? 'উত্তর / উত্তর-পূর্ব' : lang === 'gu' ? 'ઉત્તર / ઈશાન' : 'उत्तर / ईशान दिशा',
    academicStrengths: lang === 'en'
      ? ['Strategic Analysis', 'Communication', 'Research & Logic', 'System Architecture']
      : lang === 'mr'
      ? ['रणनीतिक विश्लेषण', 'प्रभावी संवाद', 'संशोधन व तर्क', 'प्रणाली रचना']
      : lang === 'bn'
      ? ['কৌশলগত বিশ্লেষণ', 'যোগাযোগ দক্ষতা', 'গবেষণা ও যুক্তি', 'সিস্টেম ডিজাইন']
      : lang === 'gu'
      ? ['રણનીતિક વિશ્લેષણ', 'સંચાર કૌશલ્ય', 'સંશોધન અને તર્ક', 'સિસ્ટમ ડિઝાઇન']
      : ['रणनीतिक विश्लेषण', 'संवाद कौशल', 'शोध व तर्क', 'सिस्टम आर्किटेक्चर'],
    suitableDisciplines: lang === 'en'
      ? ['Management & Strategy', 'Commerce & Finance', 'Technology & Systems', 'Consulting & Advisory']
      : lang === 'mr'
      ? ['व्यवस्थापन व धोरण', 'वाणिज्य व वित्त', 'तंत्रज्ञान', 'सल्लागार व मार्गदर्शन']
      : lang === 'bn'
      ? ['ব্যবস্থাপনা ও কৌশল', 'বাণিজ্য ও অর্থায়ন', 'প্রযুক্তি', 'পরামর্শদান']
      : lang === 'gu'
      ? ['મેનેજમેન્ટ અને રણનીતિ', 'વાણિજ્ય અને નાણાં', 'ટેકનોલોજી', 'કન્સલ્ટન્સી']
      : ['प्रबंधन एवं रणनीति', 'वाणिज्य व वित्त', 'सूचना प्रौद्योगिकी', 'परामर्श व मार्गदर्शन']
  };

  // Localized Career Deep Dive
  const careerDeepDive = {
    primaryAvenues: lang === 'en'
      ? ['Executive Management & Strategic Advisory', 'Technology & Systems Architecture', 'Commercial Enterprises & Consulting', 'Research, Analytics & Policy Planning']
      : lang === 'mr'
      ? ['कार्यकारी व्यवस्थापन आणि धोरणात्मक सल्ला', 'माहिती तंत्रज्ञान आणि प्रणाली रचना', 'व्यापार, वाणिज्य आणि कन्सल्टिंग', 'संशोधन आणि विश्लेषणात्मक नियोजन']
      : lang === 'bn'
      ? ['কার্যনির্বাহী ব্যবস্থাপনা ও কৌশলগত পরামর্শ', 'তথ্য প্রযুক্তি ও সিস্টেম আর্কিটেকচার', 'ব্যবসা, বাণিজ্য ও পরামর্শদান', 'গবেষণা ও বিশ্লেষণমূলক পরিকল্পনা']
      : lang === 'gu'
      ? ['કાર્યકારી મેનેજમેન્ટ અને રણનીતિક સલાહ', 'માહિતી તકનીકી અને સિસ્ટમ આર્કિટેક્ચર', 'વેપાર, વાણિજ્ય અને કન્સલ્ટિંગ', 'સંશોધન અને વિશ્લેષણાત્મક આયોજન']
      : ['कार्यकारी प्रबंधन एवं रणनीतिक सलाहकार', 'सूचना प्रौद्योगिकी एवं सिस्टम आर्किटेक्चर', 'व्यापार, वाणिज्य एवं कंसल्टिंग', 'शोध, विश्लेषण एवं नीति निर्माण'],
    entrepreneurialFit: lang === 'en' ? 'Very High (Visionary Builder)' : lang === 'mr' ? 'अत्यंत अनुकूल (दूरदर्शी उद्योजक)' : lang === 'bn' ? 'অত্যন্ত উচ্চ (দূরদর্শী উদ্যোক্তা)' : lang === 'gu' ? 'અત્યંત અનુકૂળ (દીર્ઘદ્રષ્ટા ઉદ્યોગસાહસિક)' : 'अत्यंत अनुकूल (स्वतंत्र व दूरदर्शी उद्यमी)',
    workplaceRole: lang === 'en' ? 'Strategic Leader / Chief Architect / Specialist Mentor' : lang === 'mr' ? 'धोरणात्मक नेता / मुख्य रचनाकार / मार्गदर्शक' : lang === 'bn' ? 'কৌশলগত নেতা / প্রধান পরিকল্পনাকারী / উপদেষ্টা' : lang === 'gu' ? 'રણનીતિક નેતા / મુખ્ય આર્કિટેક્ટ / માર્ગદર્શક' : 'रणनीतिक मार्गदर्शक / मुख्य वास्तुकार / वरिष्ठ सलाहकार',
    successStrategy: lang === 'en' ? 'Lead through clear processes, delegate operational routine, and protect focus time.' : lang === 'mr' ? 'स्पष्ट कार्यप्रणालीने नेतृत्व करा आणि आपल्या वेळेचे योग्य नियोजन करा.' : lang === 'bn' ? 'স্পষ্ট কর্মপদ্ধতির মাধ্যমে নেতৃত্ব দিন এবং নিজের সময়কে সুরক্ষিত রাখুন।' : lang === 'gu' ? 'સ્પષ્ટ કાર્યપદ્ધતિ દ્વારા નેતૃત્વ કરો અને તમારા સમયનું આયોજન કરો.' : 'स्पष्ट कार्ययोजना बनाएं, दैनिक कार्यों का सही विभाजन करें और मुख्य रणनीतिक लक्ष्यों पर अडिग रहें।'
  };

  // Localized Finance Behaviour
  const financeBehaviour = {
    wealthAccumulationPattern: lang === 'en'
      ? 'Steady compounding through structured investments and calculated entrepreneurial moves.'
      : lang === 'mr'
      ? 'पद्धतशीर गुंतवणूक आणि नियोजित पावलांद्वारे संपत्तीत सातत्यपूर्ण वाढ.'
      : lang === 'bn'
      ? 'পদ্ধতিগত বিনিয়োগ এবং সুপরিকল্পিত পদক্ষেপের মাধ্যমে স্থিতিশীল সম্পদ বৃদ্ধি।'
      : lang === 'gu'
      ? 'પદ્ધતિસરના રોકાણ અને આયોજિત પગલાં દ્વારા સંપત્તિમાં વૃદ્ધિ.'
      : 'अनुशासित निवेश, संतुलित जोखिम और सतत योजना से पूंजी संचय।',
    investmentSuitability: lang === 'en'
      ? 'Diversified portfolio: balanced mix of index assets, tangible property, and growth equity.'
      : lang === 'mr'
      ? 'विविध क्षेत्रांत गुंतवणूक: जमीन, सुरक्षित फंड आणि व्यवसाय विस्तार.'
      : lang === 'bn'
      ? 'বৈচিত্র্যময় পোর্টফোলিও: স্থাবর সম্পত্তি, নিরাপদ তহবিল এবং ব্যবসা সম্প্রসারণ।'
      : lang === 'gu'
      ? 'વિવિધ ક્ષેત્રોમાં રોકાણ: જમીન-મિલકત, સુરક્ષિત ફંડ અને વ્યવસાય વૃદ્ધિ.'
      : 'विविधीकृत पोर्टफोलियो: रियल एस्टेट, सुरक्षित फंड्स और संतुलित विकास योजनाएं।',
    financialCaution: lang === 'en'
      ? 'Avoid emotionally driven quick-return schemes; maintain minimum 6 months liquidity buffer.'
      : lang === 'mr'
      ? 'घाईघाईत झटपट नफ्याच्या योजनांपासून सावध राहा; किमान ६ महिन्यांचा आपत्कालीन निधी ठेवा.'
      : lang === 'bn'
      ? 'দ্রুত লাভের প্রলোভনে ঝুঁকিপূর্ণ বিনিয়োগ এড়িয়ে চলুন; সর্বদা তরল তহবিল বজায় রাখুন।'
      : lang === 'gu'
      ? 'ઝડપી નફાની લાલચથી બચો; હંમેશા સુરક્ષિત ફંડ અનામત રાખો.'
      : 'अति-उत्साह या सुनी-सुनाई बातों पर त्वरित निवेश से बचें; आकस्मिक निधि हमेशा सुरक्षित रखें।'
  };

  // Localized Relationship & Family Dynamics
  const relationshipFamilyDynamics = {
    relationshipPattern: lang === 'en'
      ? 'Deep loyalty, respectful intellectual bonding, and mutual growth mindset.'
      : lang === 'mr'
      ? 'खोल निष्ठा, परस्पर आदर आणि बौद्धिक संवाद.'
      : lang === 'bn'
      ? 'গভীর আনুগত্য, পারস্পরিক শ্রদ্ধা এবং বৌদ্ধিক বোঝাপড়া।'
      : lang === 'gu'
      ? 'ગાઢ નિષ્ઠા, પરસ્પર આદર અને બૌદ્ધિક જોડાણ.'
      : 'गहरी निष्ठा, सम्मानजनक बौद्धिक संवाद और सहयोग की भावना।',
    familyRole: lang === 'en'
      ? 'Pillar of stability, trusted decision-maker, and protector of family heritage.'
      : lang === 'mr'
      ? 'कुटुंबाचा आधारस्तंभ, विश्वासाचे केंद्र आणि मार्गदर्शक.'
      : lang === 'bn'
      ? 'পরিবারের মূল ভিত্তি, নির্ভরযোগ্য সিদ্ধান্ত গ্রহণকারী ও অভিভাবক।'
      : lang === 'gu'
      ? 'પરિવારનો આધારસ્તંભ, વિશ્વાસુ નિર્ણયકર્તા અને માર્ગદર્શક.'
      : 'परिवार का मजबूत स्तंभ, विश्वसनीय सलाहकार और संरक्षक।',
    harmonyKey: lang === 'en'
      ? 'Open, active listening and setting aside work-related stress during domestic hours.'
      : lang === 'mr'
      ? 'शांतपणे ऐकून घेणे आणि कौटुंबिक वेळेत कामाचा तणाव बाजूला ठेवणे.'
      : lang === 'bn'
      ? 'ধৈর্য সহকারে কথা শোনা এবং পারিবারিক সময়ে কাজের চাপ দূরে রাখা।'
      : lang === 'gu'
      ? 'શાંતિપૂર્વક સાંભળવું અને પારિવારિક સમયમાં કામના તણાવથી દૂર રહેવું.'
      : 'नियमित संवाद, दूसरों के दृष्टिकोण का सम्मान और पारिवारिक समय में कार्य का तनाव न लाना।'
  };

  // Localized NumeroVastu
  const numeroVastuInterpretation = {
    loShuZoneHarmony: lang === 'en'
      ? `North (${getPlanetName(1, lang)}) and East (${getPlanetName(3, lang)}) sectors bring maximum vitality and mental clarity.`
      : lang === 'mr'
      ? `उत्तर (${getPlanetName(1, lang)}) आणि पूर्व (${getPlanetName(3, lang)}) दिशा तुमच्यासाठी मानसिक स्पष्टता आणि समृद्धी आणतात.`
      : lang === 'bn'
      ? `উত্তর (${getPlanetName(1, lang)}) এবং পূর্ব (${getPlanetName(3, lang)}) দিক আপনার জন্য মানসিক স্বচ্ছতা ও সমৃদ্ধি প্রদান করে।`
      : lang === 'gu'
      ? `ઉત્તર (${getPlanetName(1, lang)}) અને પૂર્વ (${getPlanetName(3, lang)}) દિશાઓ તમારા માટે માનસિક સ્પષ્ટતા અને સમૃદ્ધિ લાવે છે.`
      : `उत्तर (${getPlanetName(1, lang)}) एवं पूर्व (${getPlanetName(3, lang)}) क्षेत्र ऊर्जा प्रवाह व मानसिक स्पष्टता के लिए सर्वोत्तम हैं।`,
    residenceEntranceDynamics: lang === 'en'
      ? 'East or North-East entrances enhance positive vibrational resonance for your core numbers.'
      : lang === 'mr'
      ? 'पूर्व किंवा ईशान्य प्रवेशद्वार तुमच्या मूलांक आणि भाग्यांकासाठी अत्यंत शुभ ऊर्जा निर्माण करते.'
      : lang === 'bn'
      ? 'পূর্ব বা উত্তর-পূর্ব প্রবেশদ্বার আপনার মূল সংখ্যার জন্য অত্যন্ত অনুকূল।'
      : lang === 'gu'
      ? 'પૂર્વ કે ઈશાન પ્રવેશદ્વાર તમારા અંકો સાથે સુમેળભરી સકારાત્મક ઉર્જા આપે છે.'
      : 'पूर्व अथवा ईशान मुखी प्रवेश द्वार आपके मूलांक व भाग्यांक के साथ सर्वोत्तम सामंजस्य बनाता है।',
    suggestedVastuRemedies: lang === 'en'
      ? [
          'Keep the North-East zone clutter-free and place a copper/brass bowl with fresh water.',
          'Position your primary workstation facing East or North for peak concentration.',
          'Introduce subtle indoor greenery (money plant/tulsi) in the North or East quadrant.'
        ]
      : lang === 'mr'
      ? [
          'ईशान्य कोपरा स्वच्छ ठेवा आणि तिथे तांब्याच्या पात्रात स्वच्छ पाणी ठेवा.',
          'अभ्यास किंवा कामाची जागा पूर्व किंवा उत्तर दिशेकडे तोंड करून ठेवा.',
          'उत्तर किंवा पूर्व दिशेला हिरवे रोप (तुळस) लावा.'
        ]
      : lang === 'bn'
      ? [
          'উত্তর-পূর্ব কোণ পরিষ্কার রাখুন এবং সেখানে তামার পাত্রে জল রাখুন।',
          'কাজের টেবিল পূর্ব বা উত্তরমুখী করে বসুন।',
          'উত্তর বা পূর্ব অংশে তুলসী বা সবুজ গাছপালা রাখুন।'
        ]
      : lang === 'gu'
      ? [
          'ઈશાન ખૂણો હંમેશા સ્વચ્છ રાખો અને ત્યાં તાંબાના પાત્રમાં પાણી રાખો.',
          'કામ કરવાની બેઠક પૂર્વ કે ઉત્તર દિશા તરફ મુખ રાખીને ગોઠવો.',
          'ઉત્તર અથવા પૂર્વ દિશામાં તુલસી કે હરિયાળી રાખો.'
        ]
      : [
          'ईशान कोण को हमेशा स्वच्छ, हल्का व पवित्र रखें; वहां तांबे के पात्र में जल रखें।',
          'कार्यस्थल पर बैठते समय मुख पूर्व या उत्तर दिशा की ओर रखना सर्वोत्तम है।',
          'उत्तर या पूर्व क्षेत्र में तुलसी या मनी प्लांट रखकर प्राकृतिक ऊर्जा का संचार करें।'
        ]
  };

  // Localized Life Changing Windows
  const lifeChangingWindows = [
    {
      window: `${year + 28} - ${year + 32}`,
      catalyst: 'Surge Cycle',
      theme: lang === 'en' ? 'Professional Rise & Foundational Milestone' : lang === 'mr' ? 'व्यावसायिक प्रगती आणि पायाभरणी' : lang === 'bn' ? 'পেশাগত অগ্রগতি ও ভিত্তি স্থাপন' : lang === 'gu' ? 'વ્યાવસાયિક પ્રગતિ અને પાયો' : 'व्यावसायिक उत्थान एवं आधारशिला निर्माण',
      advice: lang === 'en' ? 'Period of consolidating reputation and establishing long-term authority.' : lang === 'mr' ? 'प्रतिष्ठा आणि दीर्घकालीन अधिकार मजबूत करण्याचा काळ.' : lang === 'bn' ? 'সম্মান ও দীর্ঘমেয়াদী প্রতিষ্ঠা অর্জনের সময়।' : lang === 'gu' ? 'પ્રતિષ્ઠા અને દીર્ઘકાલીન અધિકાર મજબૂત કરવાનો સમય.' : 'प्रतिष्ठा और सामाजिक पहचान को सुदृढ़ करने का महत्वपूर्ण समय।'
    },
    {
      window: `${year + 40} - ${year + 45}`,
      catalyst: 'Transformation',
      theme: lang === 'en' ? 'Mastery, Expansion & Strategic Expansion' : lang === 'mr' ? 'अनुभव, विस्तार आणि रणनीतिक यश' : lang === 'bn' ? 'অভিজ্ঞতা, বিস্তার ও কৌশলগত সাফল্য' : lang === 'gu' ? 'અનુભવ, વિસ્તરણ અને રણનીતિક સફળતા' : 'अनुभव, विस्तार एवं रणनीतिक सफलता',
      advice: lang === 'en' ? 'Golden window to lead major initiatives, advisory roles, and financial maturity.' : lang === 'mr' ? 'मोठ्या योजनांचे नेतृत्व आणि आर्थिक स्थैर्याचा सुवर्णकाळ.' : lang === 'bn' ? 'বড় উদ্যোগের নেতৃত্ব ও আর্থিক স্থায়িত্বের সুবর্ণ সুযোগ।' : lang === 'gu' ? 'મોટી યોજનાઓનું નેતૃત્વ અને નાણાકીય સ્થિરતાનો સુવર્ણ સમય.' : 'प्रमुख योजनाओं के नेतृत्व और वित्तीय स्थिरता का श्रेष्ठ कालखंड।'
    }
  ];

  // Localized Life Pinnacles
  const lifePinnacles = [
    {
      name: lang === 'en' ? 'Pinnacle 1 (Foundation)' : lang === 'mr' ? 'शिखर १ (पायाभरणी)' : lang === 'bn' ? 'শিখর ১ (ভিত্তি)' : lang === 'gu' ? 'શિખર ૧ (પાયો)' : 'प्रथम शिखर (आधार)',
      pinnacleNumber: ((rDay + rMonth - 1) % 9) + 1,
      ageSpan: `0 – ${36 - mulank}`,
      planet: p1,
      theme: lang === 'en' ? 'Identity formation and core skill acquisition.' : lang === 'mr' ? 'व्यक्तिमत्त्व विकास आणि कौशल्य प्राप्ती.' : lang === 'bn' ? 'ব্যক্তিত্ব গঠন ও মৌলিক দক্ষতা অর্জন।' : lang === 'gu' ? 'વ્યક્તિત્વ નિર્માણ અને કૌશલ્ય પ્રાપ્તિ.' : 'व्यक्तित्व निर्माण और बुनियादी कौशलों का विकास।',
      guidance: lang === 'en' ? 'Build discipline and intellectual versatility.' : lang === 'mr' ? 'शिस्त आणि ज्ञान समृद्ध करा.' : lang === 'bn' ? 'শৃঙ্খলা ও জ্ঞান বৃদ্ধি করুন।' : lang === 'gu' ? 'શિસ્ત અને જ્ઞાન સમૃદ્ધ કરો.' : 'अनुशासन और ज्ञान संचय पर ध्यान दें।'
    },
    {
      name: lang === 'en' ? 'Pinnacle 2 (Production)' : lang === 'mr' ? 'शिखर २ (उत्पादन)' : lang === 'bn' ? 'শিখর ২ (कर्म)' : lang === 'gu' ? 'શિખર ૨ (ઉત્પાદન)' : 'द्वितीय शिखर (उत्थान)',
      pinnacleNumber: ((rDay + rYear - 1) % 9) + 1,
      ageSpan: `${36 - mulank + 1} – ${36 - mulank + 9}`,
      planet: p2,
      theme: lang === 'en' ? 'Career building, family expansion, and social impact.' : lang === 'mr' ? 'कारकीर्द उभारणी, कौटुंबिक विस्तार आणि सामाजिक प्रभाव.' : lang === 'bn' ? 'কর্মজীবন গঠন, পারিবারিক বিস্তার ও সামাজিক প্রভাব।' : lang === 'gu' ? 'કારકિર્દી નિર્માણ, પારિવારિક વિકાસ અને સામાજિક પ્રભાવ.' : 'करियर निर्माण, पारिवारिक विस्तार और सामाजिक प्रभाव।',
      guidance: lang === 'en' ? 'Focus on excellence, commercial acumen, and networking.' : lang === 'mr' ? 'उत्कृष्ट कामगिरी आणि नेटवर्किंगवर भर द्या.' : lang === 'bn' ? 'কাজে শ্রেষ্ঠত্ব এবং নেটওয়ার্কিং বাড়ান।' : lang === 'gu' ? 'ઉત્કૃષ્ટ કામગીરી અને નેટવર્કિંગ પર ભાર મૂકો.' : 'कार्य में कुशलता और संपर्कों का सही उपयोग करें।'
    }
  ];

  // Localized Lifestyle Suggestions
  const lifestyleSuggestions = {
    dailyRoutine: lang === 'en'
      ? 'Early sunrise alignment; begin mornings with 10 minutes of silent meditation and goal charting.'
      : lang === 'mr'
      ? 'सूर्योदयापूर्वी उठा; सकाळी १० मिनिटे शांत ध्यान आणि दिवसाचे नियोजन करा.'
      : lang === 'bn'
      ? 'সূর্যোদয়ের সাথে দিন শুরু করুন; সকালে ১০ মিনিট নীরব ধ্যান ও দিনের পরিকল্পনা করুন।'
      : lang === 'gu'
      ? 'સૂર્યોદય સમયે જાગો; સવારે ૧૦ મિનિટ શાંત ધ્યાન અને દિવસનું આયોજન કરો.'
      : 'प्रातःकाल सूर्योदय के समय उठें; 10 मिनट मौन ध्यान एवं दैनिक प्राथमिकताओं की सूची बनाएं।',
    dietaryGuideline: lang === 'en'
      ? 'Fresh, sattvic nourishment rich in seasonal fruits, soaked almonds, and adequate hydration.'
      : lang === 'mr'
      ? 'ताजे, सात्त्विक अन्न, फळे, भिजवलेले बदाम आणि पुरेसे पाणी प्या.'
      : lang === 'bn'
      ? 'তাজা, সাত্ত্বিক খাবার, ঋতুভিত্তিক ফল, ভেজানো বাদাম এবং পর্যাপ্ত জল পান।'
      : lang === 'gu'
      ? 'તાજો, સાત્ત્વિક આહાર, મોસમી ફળો, પલાળેલી બદામ અને પૂરતું પાણી પીવો.'
      : 'ताजा व सात्विक आहार, मौसमी फल, भीगे हुए बादाम और प्रचुर मात्रा में जल का सेवन करें।',
    mindfulnessPractice: lang === 'en'
      ? 'Deep breathing (Pranayama) and conscious gratitude journaling at dusk.'
      : lang === 'mr'
      ? 'प्राणायाम आणि संध्याकाळी मनःशांतीसाठी कृतज्ञता व्यक्त करा.'
      : lang === 'bn'
      ? 'প্রাণায়াম এবং সন্ধ্যায় মনঃশান্তির জন্য কৃতজ্ঞতা প্রকাশ করুন।'
      : lang === 'gu'
      ? 'પ્રાણાયામ અને સાંજે મનની શાંતિ માટે કૃતજ્ઞતા વ્યક્ત કરો.'
      : 'नियमित प्राणायाम (अनुलोम-विलोम) एवं सायंकाल 5 मिनट आत्म-अवलोकन व शांति अभ्यास।',
    favorableTiming: lang === 'en'
      ? 'Morning hours (07:00 AM – 11:00 AM) are optimal for decisive meetings and high-leverage tasks.'
      : lang === 'mr'
      ? 'सकाळची वेळ (०७:०० ते ११:००) महत्त्वाच्या बैठका आणि कामांसाठी सर्वोत्तम आहे.'
      : lang === 'bn'
      ? 'সকালের সময় (সকাল ০৭:০০ – ১১:০০) গুরুত্বপূর্ণ মিটিং ও সিদ্ধান্তের জন্য সবচেয়ে উপযুক্ত।'
      : lang === 'gu'
      ? 'સવારનો સમય (૦૭:૦૦ થી ૧૧:૦૦) મહત્વપૂર્ણ નિર્ણયો અને બેઠકો માટે ઉત્તમ છે.'
      : 'प्रातः 07:00 से 11:00 बजे का समय महत्वपूर्ण बैठकों और मुख्य निर्णयों के लिए सर्वाधिक फलदायी है।'
  };

  return {
    consultantSnapshot: {
      title: lang === 'en' ? 'LeoFamily Expert Dossier Snapshot' : lang === 'mr' ? 'लियोफॅमिली तज्ज्ञ सल्लागार सारांश' : lang === 'bn' ? 'লিওফ্যামিলি বিশেষজ্ঞ পরামর্শ সারাংশ' : lang === 'gu' ? 'લિયોફેમિલી નિષ્ણાત પરામર્શ સારાંશ' : 'लियोफैमिली विशेषज्ञ परामर्श सारांश',
      coreVerdict: lang === 'en'
        ? `The blueprint of ${profile.identity.fullName || 'the seeker'} combines Mulank #${mulank} (${p1}) dynamic vitality with Bhagyank #${bhagyank} (${p2}) analytical depth, creating a powerful life matrix.`
        : lang === 'mr'
        ? `जातक ${profile.identity.fullName || 'विशेष व्यक्ती'} चा चार्ट मूलांक #${mulank} (${p1}) आणि भाग्यांक #${bhagyank} (${p2}) चा एक अत्यंत प्रभावी व संतुलित ब्लूप्रिंट आहे.`
        : lang === 'bn'
        ? `জাতক ${profile.identity.fullName || 'বিশেষ ব্যক্তি'} এর চার্ট মূলাঙ্ক #${mulank} (${p1}) এবং ভাগ্যাঙ্ক #${bhagyank} (${p2}) এর একটি অত্যন্ত শক্তিশালী ও ভারসাম্যপূর্ণ ব্লুপ্রিন্ট।`
        : lang === 'gu'
        ? `જાતક ${profile.identity.fullName || 'વિશેષ વ્યક્તિ'} નો ચાર્ટ મૂળાંક #${mulank} (${p1}) અને ભાગ્યાંક #${bhagyank} (${p2}) નો એક અત્યંત પ્રભાવશાળી અને સંતુલિત બ્લુપ્રિન્ટ છે.`
        : `जातक ${profile.identity.fullName || 'विशेष व्यक्ति'} का चार्ट मूलांक #${mulank} (${p1}) की स्वाभाविक गतिशीलता और भाग्यांक #${bhagyank} (${p2}) के शोधपरक दृष्टिकोण से युक्त एक अत्यंत प्रभावशाली और संतुलित ब्लूप्रिंट है।`,
      dominantEnergy: mulankInfo.energy,
      bestAvenue: yoga81.careerMeaning,
      strategicCaution: yoga81.challengeMeaning
    },
    tithiAnkAnalysis: {
      birthDate: day,
      compoundTitle: `${day}`,
      tithiNature,
      numericalFrequency
    },
    uniqueAboutYou,
    lifeChallenges,
    characteristicsProfile,
    educationAnalysis,
    careerDeepDive,
    financeBehaviour,
    relationshipFamilyDynamics,
    numeroVastuInterpretation,
    lifeChangingWindows,
    lifePinnacles,
    grahDrishti: {
      driverPlanet: p1,
      conductorPlanet: p2,
      relationshipLabel: yoga81.title,
      synergyNarrative: yoga81.positiveMeaning
    },
    personalYearNarrative: pyNarrative,
    monthlyDashaForecast: monthlyForecast,
    lifestyleSuggestions,
    balancingRemedies: {
      primaryYantra: lang === 'en' ? `Shri ${p1.split(' ')[0]} Yantra or Kuber Yantra in the auspicious sector.` : `श्री ${p1.split(' ')[0]} यंत्र अथवा कुबेर यंत्र को शुभ दिशा में स्थापित करें।`,
      sacredMantra: mulankInfo.mantra,
      luckyColors: [mulankInfo.luckyColor],
      crystalRecommendation: mulankInfo.crystal,
      planetaryCharity: mulankInfo.remedy,
      signatureRecommendation: lang === 'en' ? 'Sign upward at +15 degrees with a clear baseline stroke; avoid trailing dots.' : 'हस्ताक्षर को हमेशा नीचे से ऊपर की ओर 15 डिग्री के कोण पर सीधा और स्पष्ट करें; अंत में कभी डॉट न लगाएं।'
    },
    expertSummary: {
      strongestTrait: yoga81.positiveMeaning,
      developmentArea: yoga81.challengeMeaning,
      careerDirection: yoga81.careerMeaning,
      relationshipGuidance: yoga81.relationshipMeaning,
      primaryRemedy: mulankInfo.remedy,
      timeCycleGuidance: `${pyNarrative.theme} — ${pyNarrative.recommendedFocus}`,
      masterAdvice: lang === 'en' ? 'Numbers are the cosmic blueprint of your inner potential; disciplined action is the key to manifest success.' : 'अंक आपके आंतरिक सामर्थ्य का मानचित्र हैं; सही दिशा में अनुशासित कर्म ही आपकी सफलता की कुंजी है।'
    }
  };
}
