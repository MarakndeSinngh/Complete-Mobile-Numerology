/**
 * LEOFAMILY REPORT ACCESS CONTROL & MONETIZATION TYPE DEFINITIONS
 * Phase 16: ₹33 Per-Report Access & First-Free-Report Entitlement Architecture
 */

export type CanonicalReportType =
  | 'MOBILE_NUMEROLOGY'
  | 'LOSHU'
  | 'MASTER_REPORT'
  | 'NAME_NUMEROLOGY'
  | 'SIGNATURE_AUDIT'
  | 'MEDICAL_NUMEROLOGY'
  | 'VASTU'
  | 'KUA'
  | 'HOUSE_FLAT'
  | 'VEHICLE'
  | 'BUSINESS'
  | 'MARRIAGE'
  | 'CHILD_NAMES'
  | 'LUCKY_DATES'
  | 'DASHA'
  | 'YEAR_FORECAST';

export interface ReportTypeDefinition {
  type: CanonicalReportType;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  titleBn: string;
  titleGu: string;
  descriptionEn: string;
  descriptionHi: string;
  isFree: boolean; // True ONLY for MOBILE_NUMEROLOGY
  priceInr: number; // 0 for Mobile, 33 for others
}

export const REPORT_REGISTRY: Record<CanonicalReportType, ReportTypeDefinition> = {
  MOBILE_NUMEROLOGY: {
    type: 'MOBILE_NUMEROLOGY',
    titleEn: 'Mobile Numerology & 81 Pair Vibration Analysis',
    titleHi: 'मोबाइल अंकशास्त्र एवं 81 युगल कंपन विश्लेषण',
    titleMr: 'मोबाईल अंकशास्त्र आणि 81 जोडी कंपन विश्लेषण',
    titleBn: 'মোবাইল সংখ্যাতত্ত্ব ও ৮১ জোড়া কম্পন বিশ্লেষণ',
    titleGu: 'મોબાઇલ અંકશાસ્ત્ર અને 81 જોડી કંપન વિશ્લેષણ',
    descriptionEn: 'Full Chaldean and Vedic mobile number analysis (Permanently 100% Free).',
    descriptionHi: 'सम्पूर्ण चालडीन एवं वैदिक मोबाइल नंबर विश्लेषण (स्थायी रूप से 100% मुफ़्त)।',
    isFree: true,
    priceInr: 0,
  },
  LOSHU: {
    type: 'LOSHU',
    titleEn: 'Complete Lo Shu Grid & Planes Analysis',
    titleHi: 'सम्पूर्ण लो शू ग्रिड एवं प्लेन विश्लेषण',
    titleMr: 'संपूर्ण लो शू ग्रिड आणि प्लेन विश्लेषण',
    titleBn: 'সম্পূর্ণ লো শু গ্রিড ও প্লেন বিশ্লেষণ',
    titleGu: 'સંપૂર્ણ લો શૂ ગ્રીડ અને પ્લેન વિશ્લેષણ',
    descriptionEn: 'Comprehensive 3x3 magic square and 8 master planes diagnostic report.',
    descriptionHi: 'विस्तृत 3x3 ग्रिड एवं 8 महा-तलों का संपूर्ण विश्लेषणात्मक परामर्श।',
    isFree: false,
    priceInr: 33,
  },
  MASTER_REPORT: {
    type: 'MASTER_REPORT',
    titleEn: '32-Section Master Consultation Dossier',
    titleHi: '32-अध्याय महा-परामर्श संपूर्ण रिपोर्ट',
    titleMr: '32-प्रकरणांचा महा-सल्लागार संपूर्ण अहवाल',
    titleBn: '৩২-অধ্যায় মহা-পরামর্শ সম্পূর্ণ রিপোর্ট',
    titleGu: '32-પ્રકરણોનો મહા-પરામર્શ સંપૂર્ણ રિપોર્ટ',
    descriptionEn: 'All-inclusive 32-chapter client dossier with deep synthesis and PDF export.',
    descriptionHi: 'सभी 32 अध्यायों का विस्तृत विश्लेषणात्मक दस्तावेज व प्रिंटेबल PDF।',
    isFree: false,
    priceInr: 33,
  },
  NAME_NUMEROLOGY: {
    type: 'NAME_NUMEROLOGY',
    titleEn: 'Name Numerology & Spell Balancing',
    titleHi: 'नाम अंकशास्त्र एवं स्पेलिंग संतुलन',
    titleMr: 'नाव अंकशास्त्र आणि स्पेलिंग संतुलन',
    titleBn: 'নাম সংখ্যাতত্ত্ব ও বানান ভারসাম্য',
    titleGu: 'નામ અંકશાસ્ત્ર અને સ્પેલિંગ સંતુલન',
    descriptionEn: 'Chaldean & Pythagorean compound frequency and letter harmony report.',
    descriptionHi: 'चालडीन व पाइथागोरियन संयुक्त आवृत्ति एवं अक्षरों का सूक्ष्म विश्लेषण।',
    isFree: false,
    priceInr: 33,
  },
  SIGNATURE_AUDIT: {
    type: 'SIGNATURE_AUDIT',
    titleEn: 'Signature & Handwriting Energy Audit',
    titleHi: 'हस्ताक्षर व ऑटोग्राफ ऊर्जा विश्लेषण',
    titleMr: 'स्वाक्षरी आणि हस्ताक्षर ऊर्जा विश्लेषण',
    titleBn: 'স্বাক্ষর ও হস্তাক্ষর শক্তি বিশ্লেষণ',
    titleGu: 'હસ્તાક્ષર અને સહી ઊર્જા વિશ્લેષણ',
    descriptionEn: 'Stroke, slant, underscore, and planetary alignment signature analysis.',
    descriptionHi: 'हस्ताक्षर स्ट्रोक, झुकाव और अधोरेखा का सूक्ष्म अंकशास्त्रीय ऑडिट।',
    isFree: false,
    priceInr: 33,
  },
  MEDICAL_NUMEROLOGY: {
    type: 'MEDICAL_NUMEROLOGY',
    titleEn: 'Medical Numerology & Vedic Wellness',
    titleHi: 'वैदिक स्वास्थ्य एवं न्यूमेरोलॉजी परामर्श',
    titleMr: 'वैदिक आरोग्य आणि न्यूमरोलॉजी सल्ला',
    titleBn: 'বৈদিক স্বাস্থ্য ও নিউমেরোলজি পরামর্শ',
    titleGu: 'વૈદિક સ્વાસ્થ્ય અને ન્યૂમરોલોજી પરામર્શ',
    descriptionEn: 'Planetary anatomy, elemental vulnerabilities, and holistic wellness guidance.',
    descriptionHi: 'ग्रह-अंग संबंध, त्रिदोष संतुलन और पारंपरिक आयुर्वेदिक जीवनशैली सुझाव।',
    isFree: false,
    priceInr: 33,
  },
  VASTU: {
    type: 'VASTU',
    titleEn: 'NumeroVastu & 8-Directional Matrix',
    titleHi: 'न्यूमेरो वास्तु एवं 8-दिशा ऊर्जा संतुलन',
    titleMr: 'न्यूमेरो वास्तु आणि 8-दिशा ऊर्जा संतुलन',
    titleBn: 'নিউমেরো বাস্তু ও ৮-দিক শক্তি ভারসাম্য',
    titleGu: 'ન્યૂમેરો વાસ્તુ અને 8-દિશા ઊર્જા સંતુલન',
    descriptionEn: 'Directional deities, home energy grids, and non-demolition remedies.',
    descriptionHi: 'दिशानिर्देशित ऊर्जा, आवास सामंजस्य एवं बिना तोड़-फोड़ के सरल उपाय।',
    isFree: false,
    priceInr: 33,
  },
  KUA: {
    type: 'KUA',
    titleEn: 'Kua Number & 8 Mansions Harmonics',
    titleHi: 'कुआ अंक एवं अष्ट दिशा शुभ-अशुभ चक्र',
    titleMr: 'कुआ अंक आणि अष्ट दिशा शुभ-अशुभ चक्र',
    titleBn: 'কুয়া নম্বর ও অষ্ট দিক শুভ-অশুভ চক্র',
    titleGu: 'કુઆ અંક અને અષ્ટ દિશા શુભ-અશુભ ચક્ર',
    descriptionEn: 'Eight Mansions Sheng Chi, Tien Yi, and personal spatial orientation.',
    descriptionHi: 'व्यक्तिगत शुभ-अशुभ दिशाएं एवं कार्यक्षेत्र ऊर्जा अभिविन्यास।',
    isFree: false,
    priceInr: 33,
  },
  HOUSE_FLAT: {
    type: 'HOUSE_FLAT',
    titleEn: 'House & Flat Number Numerology',
    titleHi: 'मकान व फ्लैट नंबर अंकशास्त्रीय विश्लेषण',
    titleMr: 'घर आणि फ्लॅट नंबर अंकशास्त्रीय विश्लेषण',
    titleBn: 'বাড়ি ও ফ্ল্যাট নম্বর সংখ্যাতাত্ত্বিক বিশ্লেষণ',
    titleGu: 'મકાન અને ફ્લેટ નંબર અંકશાસ્ત્રીય વિશ્લેષણ',
    descriptionEn: 'Residential compound vibration and resident alignment diagnostic.',
    descriptionHi: 'आवासीय परिसर अंक कंपन एवं परिवार के सदस्यों के साथ तालमेल।',
    isFree: false,
    priceInr: 33,
  },
  VEHICLE: {
    type: 'VEHICLE',
    titleEn: 'Vehicle Numerology & Owner Compatibility',
    titleHi: 'वाहन अंकशास्त्र एवं स्वामी अनुकूलता',
    titleMr: 'वाहन अंकशास्त्र आणि मालक सुसंगतता',
    titleBn: 'যানবাহন সংখ্যাতত্ত্ব ও মালিক সামঞ্জস্য',
    titleGu: 'વાહન અંકશાસ્ત્ર અને માલિક સુસંગતતા',
    descriptionEn: 'Registration number compound reduction and journey protection audit.',
    descriptionHi: 'वाहन पंजीकरण नंबर, स्वामी अनुकूलता एवं सुरक्षा ऊर्जा विश्लेषण।',
    isFree: false,
    priceInr: 33,
  },
  BUSINESS: {
    type: 'BUSINESS',
    titleEn: 'Business & Corporate Numerology Pro',
    titleHi: 'व्यापार एवं कॉर्पोरेट अंकशास्त्र प्रो',
    titleMr: 'व्यवसाय आणि कॉर्पोरेट अंकशास्त्र प्रो',
    titleBn: 'ব্যবসা ও কর্পোরেট সংখ্যাতত্ত্ব প্রো',
    titleGu: 'વ્યવસાય અને કોર્પોરેટ અંકશાસ્ત્ર પ્રો',
    descriptionEn: 'Firm name, brand harmony, partner synastry, and revenue vibration.',
    descriptionHi: 'फर्म नाम, ट्रेडमार्क कंपन, साझेदार तालमेल एवं व्यापार विस्तार रिपोर्ट।',
    isFree: false,
    priceInr: 33,
  },
  MARRIAGE: {
    type: 'MARRIAGE',
    titleEn: 'Marriage Synastry & Compatibility Pro',
    titleHi: 'विवाह अनुकूलता एवं संबंध मिलान प्रो',
    titleMr: 'विवाह सुसंगतता आणि संबंध जुळणी प्रो',
    titleBn: 'বিবাহ সামঞ্জস্য ও সম্পর্ক মিলন প্রো',
    titleGu: 'લગ્ન સુસંગતતા અને સંબંધ મેળાપ પ્રો',
    descriptionEn: 'Multi-layer synastry, karmic synergy, and lifelong harmony report.',
    descriptionHi: 'द्वि-पक्षीय ग्रिड मिलान, कार्मिक तालमेल एवं वैवाहिक संतुलन मार्गदर्शन।',
    isFree: false,
    priceInr: 33,
  },
  CHILD_NAMES: {
    type: 'CHILD_NAMES',
    titleEn: 'Child Lucky Names & Coordinate Selection',
    titleHi: 'शिशु लकी नाम चयन एवं ग्रिड समन्वय',
    titleMr: 'बाळाचे भाग्यवान नाव निवड आणि ग्रिड समन्वय',
    titleBn: 'শিশুর লাকি নাম নির্বাচন ও গ্রিড সমন্বয়',
    titleGu: 'બાળકના લકી નામ પસંદગી અને ગ્રીડ સંકલન',
    descriptionEn: 'Vedic natal coordinate balancing and curated auspicious name list.',
    descriptionHi: 'जन्मतिथि अनुसार शुभ नामाक्षर, ग्रिड संतुलन एवं चयनित नामों की सूची।',
    isFree: false,
    priceInr: 33,
  },
  LUCKY_DATES: {
    type: 'LUCKY_DATES',
    titleEn: 'Lucky Dates & Auspicious Muhurta Finder',
    titleHi: 'शुभ तिथियां एवं अनुकूल मुहूर्त चयन',
    titleMr: 'शुभ तारखा आणि अनुकूल मुहूर्त निवड',
    titleBn: 'শুভ তারিখ ও অনুকূল মুহূর্ত নির্বাচন',
    titleGu: 'શુભ તારીખો અને અનુકૂળ મુહૂર્ત પસંદગી',
    descriptionEn: 'Personalized date scoring for business, property, surgery, and travel.',
    descriptionHi: 'कार्य के उद्देश्य अनुसार मूलांक, भाग्यांक व वार-ग्रह अनुकूल तिथियां।',
    isFree: false,
    priceInr: 33,
  },
  DASHA: {
    type: 'DASHA',
    titleEn: 'Vedic Mahadasha & Antardasha Time Cycles',
    titleHi: 'वैदिक महादशा एवं अंतर्दशा समय चक्र',
    titleMr: 'वैदिक महादशा आणि अंतर्दशा वेळ चक्र',
    titleBn: 'বৈদিক মহাদশা ও অন্তর্দশা সময় চক্র',
    titleGu: 'વૈદિક મહાદશા અને અંતર્દશા સમય ચક્ર',
    descriptionEn: 'Yearly and monthly planetary dasha transit periods and remedies.',
    descriptionHi: 'वार्षिक एवं मासिक ग्रहीय दशा संक्रमण काल, प्रभाव एवं सिद्ध उपाय।',
    isFree: false,
    priceInr: 33,
  },
  YEAR_FORECAST: {
    type: 'YEAR_FORECAST',
    titleEn: 'Personal Year & Multi-Year Forecast',
    titleHi: 'व्यक्तिगत वर्ष एवं 3-वर्षीय समय चक्र',
    titleMr: 'वैयक्तिक वर्ष आणि 3-वर्षीय वेळ चक्र',
    titleBn: 'ব্যক্তিগত বছর ও ৩-বছরের সময় চক্র',
    titleGu: 'વ્યક્તિગત વર્ષ અને 3-વાર્ષિક સમય ચક્ર',
    descriptionEn: 'Current, upcoming, and long-term annual vibration forecast.',
    descriptionHi: 'वर्तमान, आगामी एवं दीर्घकालिक वार्षिक ऊर्जा कंपन एवं मार्गदर्शन।',
    isFree: false,
    priceInr: 33,
  },
};

export interface UserSession {
  userId: string;
  mobile: string;
  mobileVerified: boolean;
  token: string;
  hasClaimedFreeReport: boolean;
  freeReportDetails?: {
    reportType: CanonicalReportType;
    claimedAt: string;
    profileKey: string;
  };
}

export interface ReportAccessCheckResult {
  allowed: boolean;
  requiresPayment: boolean;
  isFirstFreeReport: boolean;
  isFreeReportType: boolean;
  canClaimFree: boolean;
  price: number; // 0 or 33
  reportType: CanonicalReportType;
  profileKey: string;
  reason?: string;
  accessType?: 'FREE' | 'PAID';
  entitlementId?: string;
}

export interface ReportEntitlementRecord {
  id: string;
  userId: string;
  mobile: string;
  reportType: CanonicalReportType;
  profileKey: string;
  accessType: 'FREE' | 'PAID';
  amount: number; // in INR (0 or 33)
  paymentId?: string;
  orderId?: string;
  paymentStatus: 'GRANTED' | 'PAID';
  createdAt: string;
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number; // in INR e.g. 33
  amountPaise: number; // in paise e.g. 3300
  currency: string; // 'INR'
  keyId: string;
  reportType: CanonicalReportType;
  profileKey: string;
  mobile: string;
  receipt?: string;
}

export interface StoredPaymentRecord {
  internalUserId: string;
  profileKey: string;
  reportType: CanonicalReportType;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  paymentStatus: 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'PAID' | 'FAILED';
  webhookEventId?: string;
  createdAt: string;
}

export interface PaymentWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        notes?: Record<string, any>;
        contact?: string;
        email?: string;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        notes?: Record<string, any>;
      };
    };
  };
  created_at: number;
}

export interface PaymentI18nEntry {
  pay33: string;
  paymentRequired: string;
  paymentProcessing: string;
  paymentSuccessful: string;
  paymentFailed: string;
  paymentCancelled: string;
  reportUnlocked: string;
  retryPayment: string;
  firstReportFree: string;
  firstReportComplimentary: string;
  claimFreeReport: string;
  selectPaymentMethod: string;
  upiOption: string;
  cardOption: string;
  netbankingOption: string;
  verifyMobileTitle: string;
  enterOtpTitle: string;
  changeMobile: string;
  secureTransactionNote: string;
}

export const PAYMENT_I18N: Record<string, PaymentI18nEntry> = {
  hi: {
    pay33: '₹33 का भुगतान करें एवं रिपोर्ट खोलें',
    paymentRequired: 'भुगतान आवश्यक है (₹33)',
    paymentProcessing: 'सुरक्षित भुगतान सत्यापन जारी है...',
    paymentSuccessful: 'भुगतान सफल रहा! रिपोर्ट अनलॉक हो गई',
    paymentFailed: 'भुगतान विफल रहा। कृपया पुनः प्रयास करें।',
    paymentCancelled: 'भुगतान रद्द कर दिया गया।',
    reportUnlocked: 'रिपोर्ट सफलतापूर्वक अनलॉक हो गई!',
    retryPayment: 'पुनः भुगतान का प्रयास करें',
    firstReportFree: 'आपकी पहली रिपोर्ट 100% मुफ़्त है!',
    firstReportComplimentary: 'प्रथम परामर्श निःशुल्क उपहार',
    claimFreeReport: 'निःशुल्क रिपोर्ट अनलॉक करें',
    selectPaymentMethod: 'भुगतान माध्यम चुनें (UPI / Cards / NetBanking)',
    upiOption: 'UPI / GPay / PhonePe / Paytm',
    cardOption: 'डेबिट / क्रेडिट कार्ड',
    netbankingOption: 'नेट बैंकिंग',
    verifyMobileTitle: 'मोबाइल नंबर सत्यापन',
    enterOtpTitle: '6-अंकों का OTP दर्ज करें',
    changeMobile: 'नंबर बदलें',
    secureTransactionNote: '🔒 256-बिट SSL सुरक्षित रेज़रपे भुगतान • वैदिक गोपनीयता गारंटी',
  },
  en: {
    pay33: 'Pay ₹33 & Unlock Report',
    paymentRequired: 'Payment Required (₹33)',
    paymentProcessing: 'Verifying Secure Razorpay Payment...',
    paymentSuccessful: 'Payment Successful! Report Unlocked',
    paymentFailed: 'Payment Failed. Please try again.',
    paymentCancelled: 'Payment Cancelled by user.',
    reportUnlocked: 'Report Access Granted Successfully!',
    retryPayment: 'Retry Payment',
    firstReportFree: 'Your First Report is 100% FREE!',
    firstReportComplimentary: 'Complimentary Welcome Gift',
    claimFreeReport: 'Unlock Free Report Now',
    selectPaymentMethod: 'Select Payment Mode (UPI / Cards / NetBanking)',
    upiOption: 'UPI / GPay / PhonePe / Paytm',
    cardOption: 'Debit / Credit Cards',
    netbankingOption: 'Net Banking',
    verifyMobileTitle: 'Mobile Number Verification',
    enterOtpTitle: 'Enter 6-Digit OTP',
    changeMobile: 'Change Number',
    secureTransactionNote: '🔒 256-Bit SSL Encrypted Razorpay Checkout • 100% Vedic Privacy',
  },
  mr: {
    pay33: '₹33 भरा आणि अहवाल उघडा',
    paymentRequired: 'पेमेंट आवश्यक आहे (₹33)',
    paymentProcessing: 'सुरक्षित पेमेंट पडताळणी सुरू आहे...',
    paymentSuccessful: 'पेमेंट यशस्वी! अहवाल अनलॉक झाला',
    paymentFailed: 'पेमेंट अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.',
    paymentCancelled: 'पेमेंट रद्द केले गेले.',
    reportUnlocked: 'अहवाल यशस्वीरित्या अनलॉक झाला!',
    retryPayment: 'पुन्हा प्रयत्न करा',
    firstReportFree: 'तुमचा पहिला अहवाल 100% विनामूल्य आहे!',
    firstReportComplimentary: 'पहिले मोफत स्वागत भेट',
    claimFreeReport: 'मोफत अहवाल अनलॉक करा',
    selectPaymentMethod: 'पेमेंट पद्धत निवडा (UPI / कार्ड्स / नेटबँकिंग)',
    upiOption: 'UPI / GPay / PhonePe',
    cardOption: 'डेबिट / क्रेडिट कार्ड',
    netbankingOption: 'नेट बँकिंग',
    verifyMobileTitle: 'मोबाईल नंबर पडताळणी',
    enterOtpTitle: '6-अंकी OTP प्रविष्ट करा',
    changeMobile: 'नंबर बदला',
    secureTransactionNote: '🔒 256-बिट सुरक्षित Razorpay पेमेंट • गोपनीयता हमी',
  },
  bn: {
    pay33: '₹৩৩ প্রদান করুন এবং রিপোর্ট খুলুন',
    paymentRequired: 'পেমেন্ট আবশ্যক (₹৩৩)',
    paymentProcessing: 'নিরাপদ পেমেন্ট যাচাইকরণ চলছে...',
    paymentSuccessful: 'পেমেন্ট সফল! রিপোর্ট আনলক হয়েছে',
    paymentFailed: 'পেমেন্ট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    paymentCancelled: 'পেমেন্ট বাতিল করা হয়েছে।',
    reportUnlocked: 'রিপোর্ট সফলভাবে আনলক হয়েছে!',
    retryPayment: 'পুনরায় চেষ্টা করুন',
    firstReportFree: 'আপনার প্রথম রিপোর্ট ১০০% বিনামূল্যে!',
    firstReportComplimentary: 'প্রথম পরামর্শ প্রশংসাসূচক উপহার',
    claimFreeReport: 'বিনামূল্যে রিপোর্ট আনলক করুন',
    selectPaymentMethod: 'পেমেন্ট মাধ্যম বেছে নিন (UPI / কার্ড / নেটব্যাঙ্কিং)',
    upiOption: 'UPI / GPay / PhonePe',
    cardOption: 'ডেবিট / ক্রেডিট কার্ড',
    netbankingOption: 'নেট ব্যাঙ্কিং',
    verifyMobileTitle: 'মোবাইল নম্বর যাচাইকরণ',
    enterOtpTitle: '৬-সংখ্যার OTP লিখুন',
    changeMobile: 'নম্বর পরিবর্তন',
    secureTransactionNote: '🔒 ২৫৬-বিট এনক্রিপ্ট করা Razorpay পেমেন্ট • বৈদিক গোপনীয়তা',
  },
  gu: {
    pay33: '₹33 ચૂકવો અને રિપોર્ટ ખોલો',
    paymentRequired: 'ચૂકવણી જરૂરી છે (₹33)',
    paymentProcessing: 'સુરક્ષિત ચૂકવણી ચકાસણી ચાલુ છે...',
    paymentSuccessful: 'ચૂકવણી સફળ! રિપોર્ટ અનલૉક થયો',
    paymentFailed: 'ચૂકવણી નિષ્ફળ ગઈ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    paymentCancelled: 'ચૂકવણી રદ કરવામાં આવી.',
    reportUnlocked: 'રિપોર્ટ સફળતાપૂર્વક અનલૉક થયો!',
    retryPayment: 'ફરી પ્રયાસ કરો',
    firstReportFree: 'તમારો પ્રથમ રિપોર્ટ 100% મફત છે!',
    firstReportComplimentary: 'પ્રથમ પરામર્શ મફત ભેટ',
    claimFreeReport: 'મફત રિપોર્ટ અનલૉક કરો',
    selectPaymentMethod: 'ચૂકવણી પદ્ધતિ પસંદ કરો (UPI / કાર્ડ / નેટબેંકિંગ)',
    upiOption: 'UPI / GPay / PhonePe',
    cardOption: 'ડેબિટ / ક્રેડિટ કાર્ડ',
    netbankingOption: 'નેટ બેંકિંગ',
    verifyMobileTitle: 'મોબાઇલ નંબર ચકાસણી',
    enterOtpTitle: '6-અંકનો OTP દાખલ કરો',
    changeMobile: 'નંબર બદલો',
    secureTransactionNote: '🔒 256-બીટ સુરક્ષિત Razorpay ચુકવણી • ગોપનીયતા ગેરંટી',
  },
};

export interface UserReportItem {
  id: string;
  userId: string;
  profileKey: string;
  profileName?: string;
  reportType: CanonicalReportType;
  titleHi: string;
  titleEn: string;
  titleMr: string;
  titleBn: string;
  titleGu: string;
  accessType: 'FREE' | 'PAID' | 'ALWAYS_FREE';
  amount: number;
  currency: string;
  status: 'UNLOCKED' | 'PENDING' | 'FAILED';
  paymentId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentHistoryItem {
  id: string;
  userId: string;
  reportType: CanonicalReportType;
  profileKey: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'CAPTURED' | 'FREE' | 'CREATED' | 'FAILED';
  paymentReference: string;
  orderId?: string;
  createdAt: string;
}

export interface UserAccessSummary {
  mobile: string;
  mobileVerified: boolean;
  mobileNumerology: {
    status: 'ALWAYS_FREE';
    price: 0;
  };
  firstNonMobileReport: {
    status: 'AVAILABLE' | 'USED';
    reportType?: CanonicalReportType;
    claimedAt?: string;
    profileKey?: string;
  };
  additionalReports: {
    priceInr: number;
    pricePaise: number;
  };
  totalReportsUnlocked: number;
  totalPaidAmountInr: number;
}

export interface MyReportsI18nEntry {
  myReportsTitle: string;
  myReportsSubtitle: string;
  tabReports: string;
  tabPayments: string;
  tabEntitlements: string;
  searchPlaceholder: string;
  filterAll: string;
  filterFree: string;
  filterPaid: string;
  statusUnlocked: string;
  statusPending: string;
  statusFailed: string;
  viewReportBtn: string;
  downloadPdfBtn: string;
  printBtn: string;
  noReportsYet: string;
  noReportsDesc: string;
  generateFirstFreeBtn: string;
  paymentHistoryTitle: string;
  paymentHistorySubtitle: string;
  entitlementCenterTitle: string;
  entitlementCenterSubtitle: string;
  mobileNumerologyStatus: string;
  firstReportStatus: string;
  firstReportAvailable: string;
  firstReportUsed: string;
  additionalReportsRate: string;
  unlockedReportsCount: string;
  totalSpent: string;
  complimentaryBadge: string;
  paidBadge: string;
  alwaysFreeBadge: string;
  dateCol: string;
  reportCol: string;
  amountCol: string;
  statusCol: string;
  referenceCol: string;
  refreshBtn: string;
  loginRequiredTitle: string;
  loginRequiredDesc: string;
  verifyNowBtn: string;
  loadingHistory: string;
  errorLoading: string;
  retryBtn: string;
}

export const MY_REPORTS_I18N: Record<string, MyReportsI18nEntry> = {
  hi: {
    myReportsTitle: 'मेरे रिपोर्ट्स व परामर्श डॉसियर',
    myReportsSubtitle: 'आपके द्वारा अनलॉक की गई सभी वैदिक रिपोर्ट्स, पेमेंट रसीदें एवं विशेषाधिकार केंद्र।',
    tabReports: 'मेरी रिपोर्ट्स (Reports)',
    tabPayments: 'पेमेंट इतिहास (Payments)',
    tabEntitlements: 'अधिकार केंद्र (Entitlements)',
    searchPlaceholder: 'रिपोर्ट या प्रोफाइल नाम से खोजें...',
    filterAll: 'सभी रिपोर्ट्स',
    filterFree: 'निःशुल्क (Complimentary)',
    filterPaid: 'सशुल्क (Paid ₹33)',
    statusUnlocked: 'अनलॉक (सक्रिय)',
    statusPending: 'प्रक्रियाधीन',
    statusFailed: 'विफल',
    viewReportBtn: 'रिपोर्ट देखें',
    downloadPdfBtn: 'PDF डाउनलोड',
    printBtn: 'प्रिंट करें',
    noReportsYet: 'अभी तक कोई रिपोर्ट अनलॉक नहीं की गई है',
    noReportsDesc: 'अपनी पहली विशेषज्ञ रिपोर्ट का लाभ 100% मुफ़्त प्राप्त करें अथवा मोबाइल स्कैनर का उपयोग करें।',
    generateFirstFreeBtn: 'प्रथम मुफ़्त रिपोर्ट बनाएं',
    paymentHistoryTitle: 'सुरक्षित पेमेंट इतिहास',
    paymentHistorySubtitle: 'Razorpay द्वारा संसाधित सभी लेन-देन एवं रसीद संदर्भ।',
    entitlementCenterTitle: 'रिपोर्ट अधिकार व शुल्क संरचना',
    entitlementCenterSubtitle: 'पारदर्शी एवं निष्पक्ष वैदिक परामर्श अधिकार विवरण।',
    mobileNumerologyStatus: 'मोबाइल अंकशास्त्र: हमेशा 100% मुफ़्त',
    firstReportStatus: 'प्रथम विशेषज्ञ रिपोर्ट',
    firstReportAvailable: 'उपलब्ध (FREE ₹0)',
    firstReportUsed: 'उपयोग हो चुका (Used)',
    additionalReportsRate: 'अतिरिक्त रिपोर्ट्स: ₹33 प्रति रिपोर्ट',
    unlockedReportsCount: 'कुल सक्रिय रिपोर्ट्स',
    totalSpent: 'कुल भुगतान',
    complimentaryBadge: 'निःशुल्क उपहार (Free)',
    paidBadge: 'सशुल्क (Paid ₹33)',
    alwaysFreeBadge: 'सदा मुफ़्त (Always Free)',
    dateCol: 'दिनांक',
    reportCol: 'रिपोर्ट नाम',
    amountCol: 'राशि',
    statusCol: 'स्थिति',
    referenceCol: 'पेमेंट संदर्भ / Order ID',
    refreshBtn: 'ताज़ा करें (Refresh)',
    loginRequiredTitle: 'रिपोर्ट इतिहास देखने हेतु मोबाइल सत्यापन आवश्यक है',
    loginRequiredDesc: 'कृपया अपना 10-अंकीय मोबाइल नंबर OTP द्वारा सत्यापित करें ताकि आपकी पुरानी सभी रिपोर्ट्स स्वतः लोड हो सकें।',
    verifyNowBtn: 'मोबाइल सत्यापित करें (Verify Mobile)',
    loadingHistory: 'सर्वर से रिपोर्ट इतिहास लोड हो रहा है...',
    errorLoading: 'रिपोर्ट लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।',
    retryBtn: 'पुनः प्रयास करें (Retry)',
  },
  en: {
    myReportsTitle: 'My Reports & Consultation Dossiers',
    myReportsSubtitle: 'All your unlocked Vedic reports, verified payment receipts, and entitlement status.',
    tabReports: 'My Reports',
    tabPayments: 'Payment History',
    tabEntitlements: 'Entitlement Center',
    searchPlaceholder: 'Search by report or profile name...',
    filterAll: 'All Reports',
    filterFree: 'Complimentary',
    filterPaid: 'Paid (₹33)',
    statusUnlocked: 'Unlocked (Active)',
    statusPending: 'Pending',
    statusFailed: 'Failed',
    viewReportBtn: 'View Report',
    downloadPdfBtn: 'Download PDF',
    printBtn: 'Print',
    noReportsYet: 'No reports unlocked yet',
    noReportsDesc: 'Claim your first comprehensive specialist report for 100% FREE or explore Mobile Scanner.',
    generateFirstFreeBtn: 'Claim First Free Report',
    paymentHistoryTitle: 'Secure Payment History',
    paymentHistorySubtitle: 'All transactions processed securely via Razorpay with verifiable reference IDs.',
    entitlementCenterTitle: 'Report Access & Pricing Policy',
    entitlementCenterSubtitle: 'Transparent and authentic Vedic consultation access rules.',
    mobileNumerologyStatus: 'Mobile Numerology: Always 100% Free',
    firstReportStatus: 'First Specialist Report',
    firstReportAvailable: 'Available (FREE ₹0)',
    firstReportUsed: 'Consumed (Used)',
    additionalReportsRate: 'Additional Reports: ₹33 per report',
    unlockedReportsCount: 'Active Reports Unlocked',
    totalSpent: 'Total Paid',
    complimentaryBadge: 'Complimentary (Free)',
    paidBadge: 'Paid (₹33)',
    alwaysFreeBadge: 'Always Free',
    dateCol: 'Date',
    reportCol: 'Report Name',
    amountCol: 'Amount',
    statusCol: 'Status',
    referenceCol: 'Payment Ref / Order ID',
    refreshBtn: 'Refresh',
    loginRequiredTitle: 'Mobile Verification Required to Access History',
    loginRequiredDesc: 'Please verify your 10-digit mobile number with OTP to securely retrieve all your previously unlocked reports.',
    verifyNowBtn: 'Verify Mobile Now',
    loadingHistory: 'Retrieving your reports from server...',
    errorLoading: 'Unable to load report history. Please try again.',
    retryBtn: 'Retry',
  },
  mr: {
    myReportsTitle: 'माझे अहवाल आणि सल्लागार डॉसियर',
    myReportsSubtitle: 'सर्व अनलॉक केलेले वैदिक अहवाल, पेमेंट पावत्या आणि अधिकार केंद्र.',
    tabReports: 'माझे अहवाल',
    tabPayments: 'पेमेंट इतिहास',
    tabEntitlements: 'अधिकार केंद्र',
    searchPlaceholder: 'अहवाल किंवा प्रोफाईल नावाने शोधा...',
    filterAll: 'सर्व अहवाल',
    filterFree: 'विनामूल्य (Free)',
    filterPaid: 'सशुल्क (₹33)',
    statusUnlocked: 'अनलॉक (सक्रिय)',
    statusPending: 'प्रलंबित',
    statusFailed: 'अयशस्वी',
    viewReportBtn: 'अहवाल पहा',
    downloadPdfBtn: 'PDF डाउनलोड',
    printBtn: 'प्रिंट करा',
    noReportsYet: 'अद्याप कोणतेही अहवाल अनलॉक केलेले नाहीत',
    noReportsDesc: 'तुमचा पहिला तज्ञ अहवाल 100% विनामूल्य अनलॉक करा.',
    generateFirstFreeBtn: 'पहिला मोफत अहवाल मिळवा',
    paymentHistoryTitle: 'सुरक्षित पेमेंट इतिहास',
    paymentHistorySubtitle: 'Razorpay द्वारे प्रक्रिया केलेले सर्व व्यवहार तपशील.',
    entitlementCenterTitle: 'अहवाल अधिकार आणि शुल्क रचना',
    entitlementCenterSubtitle: 'पारदर्शक आणि निष्पक्ष वैदिक सल्लागार नियम.',
    mobileNumerologyStatus: 'मोबाईल अंकशास्त्र: नेहमी 100% मोफत',
    firstReportStatus: 'पहिला तज्ञ अहवाल',
    firstReportAvailable: 'उपलब्ध (मोफत ₹0)',
    firstReportUsed: 'वापरले गेले (Used)',
    additionalReportsRate: 'अतिरिक्त अहवाल: ₹33 प्रति अहवाल',
    unlockedReportsCount: 'एकूण सक्रिय अहवाल',
    totalSpent: 'एकूण खर्च',
    complimentaryBadge: 'मोफत भेट (Free)',
    paidBadge: 'सशुल्क (₹33)',
    alwaysFreeBadge: 'नेहमी मोफत',
    dateCol: 'तारीख',
    reportCol: 'अहवाल नाव',
    amountCol: 'रक्कम',
    statusCol: 'स्थिती',
    referenceCol: 'पेमेंट संदर्भ / Order ID',
    refreshBtn: 'ताजे करा',
    loginRequiredTitle: 'इतिहास पाहण्यासाठी मोबाईल पडताळणी आवश्यक आहे',
    loginRequiredDesc: 'मागील सर्व अहवाल पाहण्यासाठी कृपया मोबाईल नंबर OTP द्वारे सत्यापित करा.',
    verifyNowBtn: 'मोबाईल सत्यापित करा',
    loadingHistory: 'सर्व्हरवरून अहवाल लोड होत आहेत...',
    errorLoading: 'अहवाल लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.',
    retryBtn: 'पुन्हा प्रयत्न करा',
  },
  bn: {
    myReportsTitle: 'আমার রিপোর্ট ও পরামর্শ ডসিয়ার',
    myReportsSubtitle: 'আপনার সমস্ত আনলক করা বৈদিক রিপোর্ট, পেমেন্ট রসিদ এবং এনটাইটেলমেন্ট সেন্টার।',
    tabReports: 'আমার রিপোর্ট',
    tabPayments: 'পেমেন্ট ইতিহাস',
    tabEntitlements: 'অধিকার কেন্দ্র',
    searchPlaceholder: 'রিপোর্ট বা প্রোফাইল নাম দিয়ে খুঁজুন...',
    filterAll: 'সব রিপোর্ট',
    filterFree: 'বিনামূল্যে (Free)',
    filterPaid: 'পেইড (₹৩৩)',
    statusUnlocked: 'আনলক (সক্রিয়)',
    statusPending: 'প্রক্রিয়াধীন',
    statusFailed: 'ব্যর্থ',
    viewReportBtn: 'রিপোর্ট দেখুন',
    downloadPdfBtn: 'PDF ডাউনলোড',
    printBtn: 'প্রিন্ট করুন',
    noReportsYet: 'এখনও কোনো রিপোর্ট আনলক করা হয়নি',
    noReportsDesc: 'আপনার প্রথম বিশেষজ্ঞ রিপোর্টটি ১০০% বিনামূল্যে আনলক করুন।',
    generateFirstFreeBtn: 'প্রথম ফ্রি রিপোর্ট পান',
    paymentHistoryTitle: 'নিরাপদ পেমেন্ট ইতিহাস',
    paymentHistorySubtitle: 'Razorpay দ্বারা প্রক্রিয়া করা সমস্ত লেনদেন ও রেফারেন্স আইডি।',
    entitlementCenterTitle: 'রিপোর্ট অধিকার ও মূল্য নীতি',
    entitlementCenterSubtitle: 'স্বচ্ছ বৈদিক পরামর্শ নীতি।',
    mobileNumerologyStatus: 'মোবাইল সংখ্যাতত্ত্ব: সর্বদা ১০০% ফ্রি',
    firstReportStatus: 'প্রথম বিশেষজ্ঞ রিপোর্ট',
    firstReportAvailable: 'উপলব্ধ (FREE ₹০)',
    firstReportUsed: 'ব্যবহৃত (Used)',
    additionalReportsRate: 'অতিরিক্ত রিপোর্ট: ₹৩৩ প্রতি রিপোর্ট',
    unlockedReportsCount: 'মোট আনলক রিপোর্ট',
    totalSpent: 'মোট খরচ',
    complimentaryBadge: 'বিনামূল্যে উপহার',
    paidBadge: 'পেইড (₹৩৩)',
    alwaysFreeBadge: 'সর্বদা ফ্রি',
    dateCol: 'তারিখ',
    reportCol: 'রিপোর্টের নাম',
    amountCol: 'পরিমাণ',
    statusCol: 'স্থিতি',
    referenceCol: 'পেমেন্ট রেফারেন্স / Order ID',
    refreshBtn: 'রিফ্রেশ',
    loginRequiredTitle: 'ইতিহাস দেখার জন্য মোবাইল যাচাইকরণ প্রয়োজন',
    loginRequiredDesc: 'আপনার পূর্ববর্তী আনলক করা রিপোর্ট দেখতে অনুগ্রহ করে মোবাইল নম্বর যাচাই করুন।',
    verifyNowBtn: 'মোবাইল যাচাই করুন',
    loadingHistory: 'সার্ভার থেকে রিপোর্ট লোড হচ্ছে...',
    errorLoading: 'রিপোর্ট লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    retryBtn: 'আবার চেষ্টা করুন',
  },
  gu: {
    myReportsTitle: 'મારા રિપોર્ટ્સ અને કન્સલ્ટેશન ડૉસિયર',
    myReportsSubtitle: 'તમારા અનલૉક થયેલા તમામ વૈદિક રિપોર્ટ્સ, પેમેન્ટ રસીદો અને અધિકાર કેન્દ્ર.',
    tabReports: 'મારા રિપોર્ટ્સ',
    tabPayments: 'ચૂકવણી ઇતિહાસ',
    tabEntitlements: 'અધિકાર કેન્દ્ર',
    searchPlaceholder: 'રિપોર્ટ અથવા પ્રોફાઇલ નામથી શોધો...',
    filterAll: 'બધા રિપોર્ટ્સ',
    filterFree: 'મફત (Free)',
    filterPaid: 'સશુલ્ક (₹33)',
    statusUnlocked: 'અનલૉક (સક્રિય)',
    statusPending: 'પ્રક્રિયા હેઠળ',
    statusFailed: 'નિષ્ફળ',
    viewReportBtn: 'રિપોર્ટ જુઓ',
    downloadPdfBtn: 'PDF ડાઉનલોડ',
    printBtn: 'પ્રિન્ટ કરો',
    noReportsYet: 'હજુ સુધી કોઈ રિપોર્ટ અનલૉક થયો નથી',
    noReportsDesc: 'તમારો પ્રથમ નિષ્ણાત રિપોર્ટ 100% મફતમાં મેળવો અથવા મોબાઇલ સ્કેનર અજમાવો.',
    generateFirstFreeBtn: 'પ્રથમ મફત રિપોર્ટ બનાવો',
    paymentHistoryTitle: 'સુરક્ષિત ચૂકવણી ઇતિહાસ',
    paymentHistorySubtitle: 'Razorpay દ્વારા સુરક્ષિત રીતે પ્રોસેસ થયેલ તમામ ટ્રાન્ઝેક્શન્સ.',
    entitlementCenterTitle: 'રિપોર્ટ અધિકાર અને કિંમત નીતિ',
    entitlementCenterSubtitle: 'પારદર્શક વૈદિક કન્સલ્ટેશન નિયમો.',
    mobileNumerologyStatus: 'મોબાઇલ અંકશાસ્ત્ર: હંમેશા 100% મફત',
    firstReportStatus: 'પ્રથમ નિષ્ણાત રિપોર્ટ',
    firstReportAvailable: 'ઉપલબ્ધ (FREE ₹0)',
    firstReportUsed: 'વપરાયેલ (Used)',
    additionalReportsRate: 'વધારાના રિપોર્ટ્સ: ₹33 પ્રતિ રિપોર્ટ',
    unlockedReportsCount: 'કુલ સક્રિય રિપોર્ટ્સ',
    totalSpent: 'કુલ ચૂકવણી',
    complimentaryBadge: 'મફત ભેટ (Free)',
    paidBadge: 'સશુલ્ક (₹33)',
    alwaysFreeBadge: 'હંમેશા મફત',
    dateCol: 'તારીખ',
    reportCol: 'રિપોર્ટ નામ',
    amountCol: 'રકમ',
    statusCol: 'સ્થિતિ',
    referenceCol: 'પેમેન્ટ રેફરન્સ / Order ID',
    refreshBtn: 'રીફ્રેશ',
    loginRequiredTitle: 'ઇતિહાસ જોવા માટે મોબાઇલ ચકાસણી જરૂરી છે',
    loginRequiredDesc: 'તમારા અગાઉના અનલૉક રિપોર્ટ્સ જોવા માટે કૃપા કરીને OTP વડે મોબાઇલ નંબર ચકાસો.',
    verifyNowBtn: 'મોબાઇલ ચકાસો',
    loadingHistory: 'સર્વર પરથી રિપોર્ટ લોડ થઈ રહ્યા છે...',
    errorLoading: 'રિપોર્ટ લોડ કરવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.',
    retryBtn: 'ફરી પ્રયાસ કરો',
  },
};

