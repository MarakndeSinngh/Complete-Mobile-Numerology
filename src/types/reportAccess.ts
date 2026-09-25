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
