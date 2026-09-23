import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, Home, Briefcase, FileText, UserPlus, TrendingUp, Calendar, ChevronRight, Sparkles, Award, ShieldAlert, CheckCircle, RefreshCw, Star, ArrowRight, Info, Eye, Clock, User, Heart, Compass, Activity,
  Camera, Upload, X, Check, AlertTriangle, Trash2, FileImage, Shield, Baby
} from 'lucide-react';
import { 
  analyzeVehicleNumerology, 
  analyzeHouseNumerology, 
  analyzeBusinessNumerology, 
  analyzeSignatureStyle,
  generateChildNumerology, 
  generateLuckyDatesSuite,
  VehicleReport, 
  HouseReport, 
  BusinessReport, 
  ChildReport,
  SignatureReport,
  LuckyDatesSuite
} from '../services/premiumModules';
import { generateMedicalNumerologyReport, MedicalNumerologyResult } from '../services/medicalNumerologyEngine';
import { generateNumeroVaastuReport, NumeroVaastuResult } from '../services/numeroVaastuEngine';
import { calculateDashaAndYearForecast, DashaAnalysisReport } from '../services/dashaEngine';
import DateInput from './DateInput';
import { formatDateIndian } from '../utils/dateUtils';
import { VehicleNumerologyDashboard } from './VehicleNumerologyDashboard';
import { BusinessNumerologyDashboard } from './BusinessNumerologyDashboard';
import { ChildLuckyNamesDashboard } from './ChildLuckyNamesDashboard';
import { LuckyDatesDashboard } from './LuckyDatesDashboard';
import { LuckyDatesFinder } from './LuckyDatesFinder';

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export interface PremiumConsultationsProps {
  initialModule?: 'VEHICLE' | 'HOUSE' | 'BUSINESS' | 'SIGNATURE' | 'CHILD' | 'LUCKY_DATES' | 'MEDICAL' | 'VAASTU' | 'DASHA';
}

export default function PremiumConsultations({ initialModule = 'VEHICLE' }: PremiumConsultationsProps = {}) {
  const [activeModule, setActiveModule] = useState<'VEHICLE' | 'HOUSE' | 'BUSINESS' | 'SIGNATURE' | 'CHILD' | 'LUCKY_DATES' | 'MEDICAL' | 'VAASTU' | 'DASHA'>(initialModule);

  React.useEffect(() => {
    if (initialModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule]);

  React.useEffect(() => {
    const handleSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setActiveModule(detail);
      }
    };
    window.addEventListener('switch-premium-module', handleSwitch);
    return () => {
      window.removeEventListener('switch-premium-module', handleSwitch);
    };
  }, []);

  // Load saved profiles from localStorage and handle camera cleanup on unmount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('leo_saved_consultation_profiles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProfiles(parsed);
          setSelectedProfileIndex(0);
          setSigName(parsed[0].name || '');
          setSigDob(parsed[0].dob || '');
        }
      }
    } catch (e) {
      console.error("Error loading saved consultation profiles:", e);
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Input States
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleDriver, setVehicleDriver] = useState<number>(1);
  const [vehicleResult, setVehicleResult] = useState<VehicleReport | null>(null);

  const [houseNumber, setHouseNumber] = useState('');
  const [houseResult, setHouseResult] = useState<HouseReport | null>(null);

  const [businessName, setBusinessName] = useState('');
  const [businessDriver, setBusinessDriver] = useState<number>(1);
  const [businessResult, setBusinessResult] = useState<BusinessReport | null>(null);

  const [signatureStyle, setSignatureStyle] = useState<string>('RISING_UNDERLINE');
  const [signatureResult, setSignatureResult] = useState<SignatureReport | null>(analyzeSignatureStyle('RISING_UNDERLINE'));

  const [childDob, setChildDob] = useState('');
  const [childResult, setChildResult] = useState<ChildReport | null>(null);

  const [luckyDatesDriver, setLuckyDatesDriver] = useState<number>(1);
  const [luckyDatesConductor, setLuckyDatesConductor] = useState<number>(1);
  const [luckySuiteResult, setLuckySuiteResult] = useState<LuckyDatesSuite | null>(null);

  // New Engines Input States
  const [medicalDob, setMedicalDob] = useState('');
  const [medicalName, setMedicalName] = useState('');
  const [medicalResult, setMedicalResult] = useState<MedicalNumerologyResult | null>(null);

  const [vaastuDob, setVaastuDob] = useState('');
  const [vaastuGender, setVaastuGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [vaastuName, setVaastuName] = useState('');
  const [vaastuResult, setVaastuResult] = useState<NumeroVaastuResult | null>(null);

  const [dashaDob, setDashaDob] = useState('');
  const [dashaYear, setDashaYear] = useState<number>(2026);
  const [dashaResult, setDashaResult] = useState<DashaAnalysisReport | null>(null);

  // AI Signature Audit states
  const [sigName, setSigName] = useState('');
  const [sigDob, setSigDob] = useState('');
  const [sigImage, setSigImage] = useState<string | null>(null);
  const [sigFileName, setSigFileName] = useState<string | null>(null);
  const [isAnalyzingSig, setIsAnalyzingSig] = useState(false);
  const [sigAuditResult, setSigAuditResult] = useState<any | null>(null);
  const [sigCameraActive, setSigCameraActive] = useState(false);
  const [sigError, setSigError] = useState<string | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(-1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Expanded explanations states ("Why This Result?")
  const [showVehicleWhy, setShowVehicleWhy] = useState(false);
  const [showHouseWhy, setShowHouseWhy] = useState(false);
  const [showBusinessWhy, setShowBusinessWhy] = useState(false);
  const [showSignatureWhy, setShowSignatureWhy] = useState(false);
  const [showChildWhy, setShowChildWhy] = useState(false);
  const [showDatesWhy, setShowDatesWhy] = useState(false);
  const [showMedicalWhy, setShowMedicalWhy] = useState(false);
  const [showVaastuWhy, setShowVaastuWhy] = useState(false);
  const [showDashaWhy, setShowDashaWhy] = useState(false);

  // Handlers
  const handleMedicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicalDob) return;
    const report = generateMedicalNumerologyReport(medicalDob, medicalName || 'Seeker');
    setMedicalResult(report);
    setShowMedicalWhy(false);
  };

  const handleVaastuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaastuDob) return;
    const report = generateNumeroVaastuReport(vaastuDob, vaastuGender, vaastuName || 'Seeker');
    setVaastuResult(report);
    setShowVaastuWhy(false);
  };

  const handleDashaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashaDob) return;
    const report = calculateDashaAndYearForecast(dashaDob, dashaYear);
    setDashaResult(report);
    setShowDashaWhy(false);
  };
  // Handlers
  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiclePlate.trim()) return;
    const report = analyzeVehicleNumerology(vehiclePlate, vehicleDriver);
    setVehicleResult(report);
    setShowVehicleWhy(false);
  };

  const handleHouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseNumber.trim()) return;
    const report = analyzeHouseNumerology(houseNumber);
    setHouseResult(report);
    setShowHouseWhy(false);
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    const report = analyzeBusinessNumerology(businessName, businessDriver);
    setBusinessResult(report);
    setShowBusinessWhy(false);
  };

  const handleSignatureTrigger = (style: string) => {
    setSignatureStyle(style);
    const report = analyzeSignatureStyle(style);
    setSignatureResult(report);
    setShowSignatureWhy(false);
  };

  // Helper calculations for Signature Numerology Integration
  const getDriverNumber = (dateStr: string): number => {
    if (!dateStr) return 1;
    const parts = dateStr.split('-');
    if (parts.length < 3) return 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(day)) return 1;
    const sum = String(day).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    return sum > 9 ? String(sum).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0) : sum;
  };

  const getConductorNumber = (dateStr: string): number => {
    if (!dateStr) return 1;
    const digits = dateStr.replace(/[^0-9]/g, '');
    let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    while (sum > 9) {
      sum = String(sum).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum;
  };

  const getChaldeanNameNumber = (nameStr: string): number => {
    if (!nameStr) return 1;
    const CHALDEAN_MAP: Record<string, number> = {
      A: 1, I: 1, J: 1, Q: 1, Y: 1,
      B: 2, K: 2, R: 2,
      C: 3, G: 3, L: 3, S: 3,
      D: 4, M: 4, T: 4,
      E: 5, H: 5, N: 5, X: 5,
      U: 6, V: 6, W: 6,
      O: 7, Z: 7,
      F: 8, P: 8
    };
    const norm = nameStr.toUpperCase().replace(/[^A-Z]/g, '');
    let sum = norm.split('').reduce((acc, char) => acc + (CHALDEAN_MAP[char] || 0), 0);
    return sum;
  };

  const getSingleDigit = (num: number): number => {
    let temp = num;
    while (temp > 9) {
      temp = String(temp).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return temp;
  };

  const generateLocalFallbackSignatureAudit = (styleId: string, name: string, dob: string) => {
    const finalStyleId = styleId || "RISING_UNDERLINE";
    const driver = getDriverNumber(dob);
    const conductor = getConductorNumber(dob);
    const nameNumber = getChaldeanNameNumber(name);

    if (finalStyleId === "TRAILING_DOT_BELOW") {
      return {
        analysis: {
          direction: "समतल या हल्की तरंग जैसी दिशा, जो कार्यक्षेत्र में परिस्थितियों के अनुसार ढलने और दृढ़ रहने की क्षमता दर्शाती है।",
          size: "सघन और सुगठित स्ट्रोक, जो गोपनीयता और बारीकियों पर ध्यान केंद्रित करने वाले स्वभाव का प्रतीक हैं।",
          firstLetterSize: `'${name}' का पहला अक्षर बाकी अक्षरों से लगभग 3 गुना बड़ा है, जो मजबूत आत्मसम्मान और सुरक्षात्मक सीमाओं को दर्शाता है।`,
          underlineStyle: "कोई अंडरलाइन नहीं है, जो किसी सहारे के बिना स्वतंत्र रूप से कार्य करने की इच्छा दर्शाती है।",
          endStroke: "अंतिम स्ट्रोक पीछे मुड़ता है या अचानक रुकता है, जो निर्णय लेने से पहले जोखिम को गहराई से जांचने की प्रवृत्ति दिखाता है।",
          dotPlacement: "अंतिम अक्षर के नीचे एक प्रमुख बिंदु (Dot) है, जो स्थिरता देता है लेकिन भारी होने पर काम में रुकावट भी डाल सकता है।",
          letterLegibility: "मध्यम स्पष्टता और लूप्स, जो रणनीतिक सोच और योजनाओं को गोपनीय रखने की आदत को दर्शाते हैं।",
          nameCompletion: "पहला नाम पूरी तरह से लिखा गया है और उपनाम छोड़ा गया है, जो स्वावलंबी व्यक्तित्व का प्रतीक है।",
          overallFlow: "संतुलित और तीखे मोड़, जो उच्च विश्लेषणात्मक क्षमता और तार्किक सोच को दर्शाते हैं।"
        },
        scores: {
          careerScore: 78,
          financialFlowScore: 75,
          recognitionScore: 82,
          leadershipScore: 85,
          businessSuccessScore: 80,
          relationshipHarmonyScore: 72,
          overallSignatureScore: 79
        },
        assessment: {
          currentSignatureAssessment: `इस हस्ताक्षर शैली में बड़ा पहला अक्षर और अंत में एक बिंदु (Dot) शामिल है। ${name} के मूलांक ${driver} और भाग्यांक ${conductor} के लिए, यह मजबूत आत्मनिर्भरता और रणनीतिक सोच को दर्शाता है। राहु और शनि के प्रभाव से यह आपको गहरी विश्लेषणात्मक शक्ति देता है। हालांकि, अंत में अकेला बिंदु कभी-कभार काम में अप्रत्याशित देरी या निर्णय में संकोच उत्पन्न कर सकता है।`,
          strengths: [
            "बड़े प्रारंभिक अक्षर द्वारा दर्शाया गया उत्कृष्ट आत्मविश्वास और कार्यक्षमता।",
            "बारीकियों का विश्लेषण और जोखिम प्रबंधन में महारत।",
            "स्वतंत्र निर्णय लेने और रणनीतिक योजना बनाने की उच्च क्षमता।"
          ],
          weaknesses: [
            "अंतिम बिंदु कभी-कभार ऊर्जा के प्रवाह को धीमा कर प्रगति में रुकावट डाल सकता है।",
            "नीचे बेसलाइन अंडरलाइन न होने से महत्वपूर्ण पलों में सहारे की कमी महसूस हो सकती है।",
            "अचानक समाप्त होने वाला स्ट्रोक साझेदारियों में अचानक बदलाव ला सकता है।"
          ],
          riskAreas: [
            "राहु-शनि डॉट संरचना के कारण कभी-कभार प्रशासनिक या दस्तावेजी कार्यों में अनावश्यक रुकावट।",
            "व्यावसायिक साझेदारों के साथ बातचीत में गलतफहमी की संभावना।"
          ],
          recommendedCorrections: [
            "अंतिम अकेले बिंदु को हटाकर हस्ताक्षर के नीचे खींची गई अंडरलाइन के नीचे दो संतुलित बिंदु लगाएं।",
            "बीच के अक्षरों के तीखे कोनों को थोड़ा गोल और सहज बनाएं ताकि ऊर्जा का प्रवाह सुगम रहे।",
            "सुनिश्चित करें कि हस्ताक्षर का अंतिम स्ट्रोक अचानक रुकने के बजाय आगे और ऊपर की ओर उठे।",
            "सोने से पहले बिना लाइन वाले सादे कागज पर हरे या काले पेन से 21 बार नए हस्ताक्षर का अभ्यास करें।"
          ],
          idealSignatureStyle: "पहला अक्षर बड़ा व स्पष्ट, उसके बाद सहज पठनीय अक्षर, नीचे एक 15 डिग्री उठती हुई सीधी अंडरलाइन और उसके नीचे दो संतुलित बिंदु।",
          personalizedSignatureBlueprint: "पहला अक्षर थोड़ा बड़ा और गोल बनाएं। बाकी नाम को साफ और सुंदर अक्षरों में लिखें। नीचे एक हल्की ऊपर उठती हुई सीधी रेखा खींचें और उसके नीचे दो छोटे बिंदु लगाएं।"
        },
        beforeAfter: {
          before: {
            visualDescription: "समतल हस्ताक्षर के अंत में एक भारी अकेला बिंदु, तीखे कोने और अचानक रुकने वाला अंतिम अक्षर।",
            impact: "अंतिम चरण में सौदों में अनावश्यक देरी और धन के प्रवाह में अचानक रुकावट का कारण बनता है।"
          },
          after: {
            visualDescription: "ऊपर की ओर उठता हुआ प्रवाहमय हस्ताक्षर, जिसके नीचे एक साफ अंडरलाइन और दो संतुलित बिंदु हैं।",
            impact: "रुके हुए धन को गति देता है, वरिष्ठों और मार्गदर्शकों का सहयोग दिलाता है और नए अवसर खोलता है।"
          }
        }
      };
    } else if (finalStyleId === "FALLING_LINE") {
      return {
        analysis: {
          direction: "दाहिनी ओर नीचे की ओर ढलान (Southwest Descent), जो काम के अंतिम चरण में ऊर्जा या उत्साह में कमी को दर्शाता है।",
          size: "शुरुआत में मध्यम लेकिन अंत में अक्षर छोटे हो जाते हैं, जो थकान या ऊर्जा के रिसाव का संकेत है।",
          firstLetterSize: "सामान्य पहला अक्षर, लेकिन बाद के अक्षर ऊंचाई खो देते हैं, जो दबाव में आत्मविश्वास कम होने को दर्शाता है।",
          underlineStyle: "अंडरलाइन अनुपस्थित है या नीचे की ओर झुकी हुई है, जिससे आत्मविश्वास का आधार कमजोर होता है।",
          endStroke: "नीचे की ओर झुकता हुआ, जो धन के क्षेत्र में रिसाव और अचानक रुचि समाप्त होने का संकेत देता है।",
          dotPlacement: "अनियमित बिंदु या बेसलाइन को काटने वाला बिंदु, जो मानसिक तनाव और ऊर्जा की कमी का प्रतीक है।",
          letterLegibility: "कम से मध्यम स्पष्टता, जो विचारों को दूसरों तक पहुंचाने में संकोच को दर्शाती है।",
          nameCompletion: "अंतिम अक्षर सिकुड़े हुए या घसीटकर लिखे गए हैं, जो काम को जल्दबाजी में निपटाने की आदत दर्शाते हैं।",
          overallFlow: "घटती हुई गति, जो शुरुआत में बहुत उत्साह लेकिन अंत में खिंचाव या तनाव दिखाती है।"
        },
        scores: {
          careerScore: 60,
          financialFlowScore: 52,
          recognitionScore: 58,
          leadershipScore: 62,
          businessSuccessScore: 55,
          relationshipHarmonyScore: 65,
          overallSignatureScore: 58
        },
        assessment: {
          currentSignatureAssessment: `आपके वर्तमान हस्ताक्षर में दाहिनी ओर नीचे की ओर झुकाव देखा गया है। हस्तलेखन वास्तु में इसे 'ढलान जाल (Descent Trap)' कहा जाता है। मूलांक ${driver} और भाग्यांक ${conductor} वाले जातक के लिए, इसका अर्थ है कि आप काम बहुत उत्साह से शुरू करते हैं (सूर्य/मंगल प्रभाव), लेकिन अंत तक आते-आते मानसिक थकान या परिणाम मिलने में देरी का सामना करते हैं। यह नीचे की ओर झुकता कोण करियर और धन संचय में रिसाव करता है। इसे तुरंत सुधारना अत्यंत लाभकारी रहेगा।`,
          strengths: [
            "नई योजनाओं और पहलों की बहुत ऊर्जावान और आकर्षक शुरुआत।",
            "मजबूत प्रारंभिक प्रस्तुति और स्वाभाविक प्रभाव।"
          ],
          weaknesses: [
            "नीचे की ओर झुकता कोण करियर की ऊर्जा को घटाता है और थकान लाता है।",
            "अक्षरों का छोटा होना निरंतर दबाव में आत्मविश्वास की कमी दर्शाता है।",
            "अस्पष्ट अंतिम अक्षर गलतफहमी और प्रशासनिक देरी का कारण बनते हैं।"
          ],
          riskAreas: [
            "अचानक अनावश्यक खर्चों या संचित धन के रिसाव की संभावना।",
            "कड़ी मेहनत के बावजूद पूरा श्रेय या पदोन्नति मिलने में बार-बार देरी।"
          ],
          recommendedCorrections: [
            "हस्ताक्षर को हमेशा बाएं से दाएं 10 से 15 डिग्री के कोण पर ऊपर की ओर उठाएं।",
            "नाम के सभी अक्षरों का आकार एक समान रखें, उन्हें अंत में छोटा न होने दें।",
            "हस्ताक्षर के नीचे एक मजबूत, सीधी स्वतंत्र रेखा (Underline) खींचें जो अंत में हल्की ऊपर उठे।",
            "एक अच्छे नीले या इंडिगो पेन से बिना लाइन वाले सफेद कागज पर प्रतिदिन 33 बार 21 दिनों तक नए हस्ताक्षर का अभ्यास करें।"
          ],
          idealSignatureStyle: "15 डिग्री ऊपर उठता हुआ हस्ताक्षर, अक्षरों का एक समान आकार और नीचे ऊपर की ओर उठती हुई अंडरलाइन।",
          personalizedSignatureBlueprint: "सफेद सादे कागज पर हाथ ढीला रखकर लिखें। अपने नाम को साफ अक्षरों में ऊपर की ओर 15 डिग्री पर ले जाएं। दूसरे अक्षर के नीचे से शुरू करके अंत तक एक सीधी रेखा खींचें जो अंत में ऊपर मुड़े।"
        },
        beforeAfter: {
          before: {
            visualDescription: "शुरुआत में मजबूत लेकिन दाहिनी ओर नीचे की ओर झुकता हस्ताक्षर, जिसके अंत में अक्षर छोटे और अस्पष्ट हो जाते हैं।",
            impact: "बचत में कमी, ऊर्जा स्तर में गिरावट और पदोन्नति व श्रेय मिलने में देरी।"
          },
          after: {
            visualDescription: "15 डिग्री ऊपर उठता हुआ सुंदर अक्षरों वाला हस्ताक्षर, जिसके नीचे मजबूत सीधी अंडरलाइन है।",
            impact: "धन संचय को सुरक्षित करता है, दैनिक ऊर्जा बढ़ाता है और मेहनत का पूरा श्रेय व मान-सम्मान दिलाता है।"
          }
        }
      };
    } else if (finalStyleId === "DOUBLE_UNDERLINE") {
      return {
        analysis: {
          direction: "स्थिर, पूरी तरह से सीधी क्षैतिज दिशा, जो जीवन में अत्यंत व्यावहारिक, व्यवस्थित और यथार्थवादी दृष्टिकोण दर्शाती है।",
          size: "बड़ा, स्पष्ट और विस्तृत, जो तुरंत ध्यान आकर्षित करता है और समाज में ठोस उपस्थिति बनाता है।",
          firstLetterSize: "मजबूत, चौड़ा और स्पष्ट पहला अक्षर, जो व्यावसायिक मजबूती और सुरक्षात्मक प्रवृत्ति का प्रतीक है।",
          underlineStyle: "हस्ताक्षर के नीचे दो समानांतर सीधी रेखाएं हैं। वास्तु में यह दोहरा आधार (पृथ्वी व धातु तत्व) कहलाता है जो अत्यधिक स्थिरता देता है।",
          endStroke: "सीधा या हल्का ऊपर मुड़ता हुआ, जो मुनाफे और सफलता को सुरक्षित रखने का प्रतीक है।",
          dotPlacement: "अंडरलाइन के नीचे या बीच में पूरी तरह संतुलित बिंदु, जो सुरक्षात्मक आधार का काम करते हैं।",
          letterLegibility: "अत्यधिक व्यवस्थित और पठनीय, जो लक्ष्यों की पूर्ण स्पष्टता और उच्च व्यापारिक समझ दर्शाता है।",
          nameCompletion: "पहला नाम और उपनाम दोनों स्पष्ट रूप से उपयोग किए गए हैं, जो कुल-परंपरा और स्थायी विरासत बनाने की इच्छा दर्शाते हैं।",
          overallFlow: "प्रभावशाली, अधिकारपूर्ण, संतुलित अंतर और गहरा अनुशासन दर्शाने वाले स्ट्रोक।"
        },
        scores: {
          careerScore: 88,
          financialFlowScore: 95,
          recognitionScore: 85,
          leadershipScore: 90,
          businessSuccessScore: 93,
          relationshipHarmonyScore: 78,
          overallSignatureScore: 89
        },
        assessment: {
          currentSignatureAssessment: `आपका वर्तमान हस्ताक्षर सीधी क्षैतिज शैली में है जिसके नीचे दोहरी अंडरलाइन (Double Underline) है। हस्तलेखन वास्तु में इसे 'किला' या 'डबल वॉल्ट' संरचना कहा जाता है। यह कॉरपोरेट लीडर्स, व्यापारियों और वित्तीय विशेषज्ञों के लिए बहुत मजबूत प्रारूप है। मूलांक ${driver} और भाग्यांक ${conductor} (बुध व शनि प्रभाव) के लिए यह असाधारण व्यावसायिक बुद्धि, गहरा वित्तीय अनुशासन और व्यवस्थित कार्यप्रणाली प्रदान करता है। दोहरी समानांतर रेखाएं धन हानि से रक्षा करती हैं और स्थायी सफलता की नींव रखती हैं।`,
          strengths: [
            "दोहरी अंडरलाइन द्वारा वित्तीय स्थिरता और संपत्तियों की मजबूत सुरक्षा।",
            "असाधारण प्रशासनिक और नेतृत्वकारी अधिकार।",
            "लक्ष्यों की पूर्ण स्पष्टता और व्यवस्थित कार्यशैली।"
          ],
          weaknesses: [
            "कभी-कभार अत्यधिक हठधर्मिता या बदलावों को तुरंत स्वीकार न करने की प्रवृत्ति।",
            "दोहरी रेखाएं कभी-कभार अत्यधिक जिम्मेदारियों का मानसिक दबाव ला सकती हैं।"
          ],
          riskAreas: [
            "साधारण बातों का बहुत अधिक विश्लेषण करना, जिससे तेजी से मिलने वाले अवसर छूट सकते हैं।",
            "अत्यधिक औपचारिकता के कारण निजी रिश्तों में दूरी का अनुभव।"
          ],
          recommendedCorrections: [
            "सुनिश्चित करें कि दोनों अंडरलाइन बिल्कुल समानांतर हों और किसी भी अक्षर के निचले लूप को न काटें।",
            "शुरुआती अक्षरों को हल्का घुमावदार बनाएं ताकि रिश्तों में मधुरता और अनुकूलनशीलता बढ़े।",
            "अंडरलाइन को नाम की लंबाई से बहुत आगे न ले जाएं, ताकि ऊर्जा केंद्रित रहे।",
            "प्रीमियम नीले या काले पेन से सादे कागज पर प्रतिदिन 15 बार हस्ताक्षर का अभ्यास करें।"
          ],
          idealSignatureStyle: "एक स्थिर क्षैतिज हस्ताक्षर जिसके नीचे दो साफ समानांतर रेखाएं हों और अंत में हल्का ऊपर की ओर झुकाव हो।",
          personalizedSignatureBlueprint: "पूरा नाम साफ और बोल्ड अक्षरों में लिखें। नीचे 2 मिमी की दूरी पर दो बिल्कुल सीधी समानांतर रेखाएं खींचें। दोनों रेखाएं नाम के अंत में ही समाप्त हों।"
        },
        beforeAfter: {
          before: {
            visualDescription: "दोहरी अंडरलाइन जो असमान हैं, एक-दूसरे को काटती हैं या अक्षरों के निचले हिस्से को छूती हैं।",
            impact: "अत्यधिक काम का बोझ, साझेदारियों में छोटी-मोटी बहस और निर्णयों में रुकावट लाता है।"
          },
          after: {
            visualDescription: "स्पष्ट क्षैतिज हस्ताक्षर के नीचे दो सुंदर, साफ और बिल्कुल समानांतर सीधी रेखाएं।",
            impact: "विशाल धन संचय को सुरक्षित करता है, नेतृत्व पदों पर सफलता देता है और स्थायी मान-सम्मान बनाता है।"
          }
        }
      };
    } else {
      return {
        analysis: {
          direction: "हस्ताक्षर में 15 डिग्री का सुंदर ऊपर की ओर झुकाव (पूर्वोन्मुख आरोहण) है, जो निरंतर उन्नति और सकारात्मक महत्वाकांक्षा का प्रतीक है।",
          size: "संतुलित मध्यम से बड़ा आकार, जो पृष्ठ पर आत्मविश्वास से जगह बनाता है बिना दूसरों को दबाए।",
          firstLetterSize: `'${name}' का पहला अक्षर बाकी अक्षरों से लगभग 2.5 गुना बड़ा है, जो मजबूत आत्मसम्मान और सुरक्षात्मक सीमाओं को दर्शाता है।`,
          underlineStyle: "पहले अक्षर के बाद से शुरू होकर अंत तक जाने वाली एक सीधी अंडरलाइन है, जो कार्यों को ठोस आधार (पृथ्वी तत्व) प्रदान करती है।",
          endStroke: "अंतिम स्ट्रोक ऊपर-दाहिनी ओर मुड़ता है, जो कार्यों के सफल समापन और भविष्य के नए अवसरों का स्वागत करता है।",
          dotPlacement: "कोई अनावश्यक रुकावट पैदा करने वाला बिंदु नहीं है, जिससे बातचीत और अवसरों का प्रवाह निर्बाध रहता है।",
          letterLegibility: "अत्यधिक स्पष्ट और पठनीय अक्षर, जो पारदर्शी नीयत और सीधे संबंधों के महत्व को रेखांकित करते हैं।",
          nameCompletion: "पहला नाम स्पष्ट रूप से लिखा गया है और उपनाम सुरुचिपूर्ण रूप से जोड़ा गया है, जो व्यक्तिगत और पारिवारिक संतुलन दर्शाता है।",
          overallFlow: "अत्यंत प्रवाहमय और संतुलित लय, जो सकारात्मक जीवन ऊर्जा और उत्तम सहनशक्ति को दर्शाता है।"
        },
        scores: {
          careerScore: 92,
          financialFlowScore: 89,
          recognitionScore: 94,
          leadershipScore: 88,
          businessSuccessScore: 90,
          relationshipHarmonyScore: 86,
          overallSignatureScore: 91
        },
        assessment: {
          currentSignatureAssessment: `आपका वर्तमान हस्ताक्षर 15 डिग्री ऊपर उठती हुई शैली में है जिसके नीचे एक ठोस अंडरलाइन आधार है। हस्तलेखन वास्तु में इसे 'राजमार्ग (Sovereign Path)' या 'अग्रणी शैली' कहा जाता है। मूलांक ${driver} और भाग्यांक ${conductor} वाले व्यक्ति के लिए, यह प्रगतिशील दृष्टिकोण आपके लिए उत्तम है। सूर्य और गुरु की ग्रह ऊर्जाएं यहां पूरी तरह संतुलित हैं, जो नेतृत्व गुण और निर्णय लेने की क्षमता प्रदान करती हैं। नीचे की रेखा करियर के निर्णयों को स्थिरता देती है।`,
          strengths: [
            "ऊपर उठता कोण जो निरंतर प्रगति और आत्मविश्वास को बढ़ाता है।",
            "अंडरलाइन एक मजबूत वास्तु आधार का काम करती है जो करियर में स्थिरता देती है।",
            "ऊपर मुड़ता अंतिम स्ट्रोक मान-सम्मान और लाभदायक अवसरों को आकर्षित करता है।"
          ],
          weaknesses: [
            "अंतिम अक्षरों में हल्की जल्दबाजी कभी-कभार बड़े सौदों को बंद करने में अधीरता ला सकती है।",
            "अंडरलाइन बिल्कुल साफ होनी चाहिए; 'g, j, p, y' जैसे अक्षरों के निचले लूप को काटना नहीं चाहिए।"
          ],
          riskAreas: [
            "यदि अंडरलाइन किसी अक्षर को काट दे तो वित्तीय रिसाव की संभावना बन सकती है।",
            "उच्च महत्वाकांक्षा के कारण अपनी क्षमताओं से अधिक कार्यों की जिम्मेदारी लेना।"
          ],
          recommendedCorrections: [
            "सुनिश्चित करें कि अंडरलाइन पहले अक्षर के बाद से शुरू हो और कभी भी 'g, j, p, y' के लूप को न काटे।",
            "पहले अक्षर को थोड़ा बड़ा रखें ताकि वह बाद के अक्षरों से 2.5 गुना बड़ा दिखे।",
            "अंतिम स्ट्रोक 15 से 20 डिग्री के कोण पर ऊपर उठे ताकि गुरु ग्रह की सकारात्मक ऊर्जा सक्रिय रहे।",
            "सादे सफेद कागज पर नीले या इंडिगो जेल पेन से प्रतिदिन 11 बार इस हस्ताक्षर का अभ्यास करें।"
          ],
          idealSignatureStyle: "15 डिग्री ऊपर उठता हुआ हस्ताक्षर, स्पष्ट पहला अक्षर और नीचे एक साफ स्वतंत्र अंडरलाइन।",
          personalizedSignatureBlueprint: "नीले या इंडिगो पेन का उपयोग करें। अपना पहला नाम साफ और 15 डिग्री ऊपर की ओर लिखें। दूसरे अक्षर से शुरू करके अंत तक एक सीधी रेखा खींचें जो अंत में ऊपर मुड़े।"
        },
        beforeAfter: {
          before: {
            visualDescription: "थोड़े सिकुड़े हुए अक्षर और एक ऐसी अंडरलाइन जो अक्षरों के निचले हिस्सों को छूती या काटती है।",
            impact: "काम की मंजूरी में छोटी-मोटी देरी और कभी-कभार अप्रत्याशित खर्च या धन का रिसाव।"
          },
          after: {
            visualDescription: "15 डिग्री पर ऊपर उठता हुआ खुला और सुंदर हस्ताक्षर, जिसके नीचे एक साफ स्वतंत्र आधार रेखा है।",
            impact: "नियमित धन प्रवाह की स्थिरता, पदोन्नति में गति और समाज में उच्च मान-सम्मान।"
          }
        }
      };
    }
  };

  React.useEffect(() => {
    // Keep sigAuditResult in sync with manual signature inputs unless a custom AI image analysis has run successfully
    if (!sigImage) {
      const localAudit = generateLocalFallbackSignatureAudit(signatureStyle, sigName || 'Aspirant', sigDob || '1990-01-01');
      setSigAuditResult(localAudit);
    }
  }, [signatureStyle, sigName, sigDob, sigImage]);

  // Profile selection
  const handleProfileSelectChange = (idx: number) => {
    setSelectedProfileIndex(idx);
    if (idx >= 0 && idx < savedProfiles.length) {
      const p = savedProfiles[idx];
      setSigName(p.name || '');
      setSigDob(p.dob || '');
      setSigError(null);
    } else {
      setSigName('');
      setSigDob('');
    }
  };

  // Convert uploaded image to base64 with validation and Canvas compression to avoid large payloads
  const processSignatureFile = (file: File) => {
    if (!file) return;

    // Validate type (PNG, JPG, JPEG, WEBP)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSigError("कृपया केवल वैध छवि फ़ाइलें (PNG, JPG, JPEG, WEBP) अपलोड करें। (Please upload only valid image files: PNG, JPG, JPEG, WEBP.)");
      setFileUploadSuccess(false);
      return;
    }

    // Validate size (max 10MB)
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSigError(`फ़ाइल बहुत बड़ी है। कृपया ${MAX_SIZE_MB}MB से छोटी फ़ाइल अपलोड करें। (File is too large. Please upload a file smaller than ${MAX_SIZE_MB}MB.)`);
      setFileUploadSuccess(false);
      return;
    }

    setIsProcessingFile(true);
    setSigError(null);
    setFileUploadSuccess(false);
    setSigFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Downscale to a maximum of 800px on either side to maintain detail while drastically reducing payload size (~50-100KB)
          const MAX_DIM = 800;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress with jpeg format and 0.8 quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            setSigImage(compressedBase64);
            setFileUploadSuccess(true);
          } else {
            // Fallback to original read if canvas context fails
            if (typeof e.target?.result === 'string') {
              setSigImage(e.target.result);
              setFileUploadSuccess(true);
            }
          }
        } catch (err) {
          console.error("Canvas compression failed, using original base64:", err);
          if (typeof e.target?.result === 'string') {
            setSigImage(e.target.result);
            setFileUploadSuccess(true);
          }
        } finally {
          setIsProcessingFile(false);
        }
      };
      img.onerror = () => {
        setSigError("छवि लोड करने में असमर्थ। कृपया फ़ाइल की जाँच करें। (Unable to load image. Please check the file.)");
        setIsProcessingFile(false);
        setFileUploadSuccess(false);
      };
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        setIsProcessingFile(false);
      }
    };
    reader.onerror = () => {
      setSigError("सिग्नेचर फ़ाइल पढ़ने में विफल। (Failed to read signature file.)");
      setIsProcessingFile(false);
      setFileUploadSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  // Camera Support
  const startCamera = async () => {
    setSigError(null);
    setSigImage(null);
    setSigFileName(null);
    setSigCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.error("Video play failed:", err));
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setSigError("कैमरा एक्सेस करने में असमर्थ। कृपया जांचें कि आपने कैमरा अनुमति दी है या नहीं।");
      setSigCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setSigCameraActive(false);
  };

  const captureSignature = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Horizontal flip for mirror video preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        setSigImage(dataUrl);
        setSigFileName("Camera_Capture.png");
        setFileUploadSuccess(true);
      }
      stopCamera();
    } catch (err) {
      console.error("Capture failed:", err);
      setSigError("सिग्नेचर कैप्चर करने में विफलता। कृपया मैन्युअल रूप से फ़ाइल अपलोड करें।");
    }
  };

  // AI Signature Audit trigger
  const handleAISignatureAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sigName.trim()) {
      setSigError("कृपया नाम दर्ज करें या ऊपर से एक सहेजा गया प्रोफ़ाइल चुनें।");
      return;
    }
    if (!sigDob) {
      setSigError("कृपया जन्म तिथि दर्ज करें।");
      return;
    }

    setIsAnalyzingSig(true);
    setSigError(null);

    const fallbackErrorMessage = "LeoFamily Signature Analysis temporarily unavailable. Please use manual signature style selection.";

    try {
      const response = await fetch('/api/signature-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: sigImage || undefined,
          personalDetails: { name: sigName, dob: sigDob },
          manualSelection: { styleId: signatureStyle },
          driver: getDriverNumber(sigDob),
          conductor: getConductorNumber(sigDob),
          nameNumber: getChaldeanNameNumber(sigName)
        })
      });

      // Safely validate content-type headers before calling response.json()
      const contentType = response.headers.get("content-type") || "";
      let result: any = null;

      if (contentType.includes("application/json")) {
        try {
          result = await response.json();
        } catch (jsonErr) {
          console.error("Failed to parse JSON response payload:", jsonErr);
        }
      } else {
        // Log actual response text to aid in debugging without exposing to the user
        try {
          const rawText = await response.text();
          console.error("Non-JSON Server Error Response Detected:", {
            status: response.status,
            statusText: response.statusText,
            bodySample: rawText.slice(0, 1000)
          });
        } catch (textErr) {
          console.error("Failed to read non-JSON response text:", textErr);
        }
      }

      if (!response.ok || !result) {
        // If the AI image analysis API fails, log details internally
        console.error("Signature Audit failed with status:", response.status, "and parsed result:", result);
        
        // Automatically switch to manual signature style selection as a fallback
        const fallbackResult = generateLocalFallbackSignatureAudit(signatureStyle || 'RISING_UNDERLINE', sigName, sigDob);
        setSigAuditResult(fallbackResult);
        handleSignatureTrigger(signatureStyle || 'RISING_UNDERLINE');
        
        throw new Error(fallbackErrorMessage);
      }

      setSigAuditResult(result);
      try {
        localStorage.setItem('leofamily_saved_signature_audit', JSON.stringify({
          auditResult: result,
          image: sigImage || null,
          fileName: sigFileName || null,
          name: sigName,
          dob: sigDob,
          timestamp: new Date().toISOString()
        }));
      } catch (saveErr) {
        console.error("Failed to save signature audit to localStorage:", saveErr);
      }
    } catch (err: any) {
      console.error("Signature Audit API Flow Error:", err);
      // Ensure we display the exact user-friendly message requested
      setSigError(fallbackErrorMessage);
      
      // Automatically switch to manual signature style selection on any failure
      const fallbackResult = generateLocalFallbackSignatureAudit(signatureStyle || 'RISING_UNDERLINE', sigName, sigDob);
      setSigAuditResult(fallbackResult);
      handleSignatureTrigger(signatureStyle || 'RISING_UNDERLINE');
      try {
        localStorage.setItem('leofamily_saved_signature_audit', JSON.stringify({
          auditResult: fallbackResult,
          image: sigImage || null,
          fileName: sigFileName || null,
          name: sigName,
          dob: sigDob,
          timestamp: new Date().toISOString()
        }));
      } catch (saveErr) {
        console.error("Failed to save fallback signature audit:", saveErr);
      }
    } finally {
      setIsAnalyzingSig(false);
    }
  };

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childDob) return;
    const report = generateChildNumerology(childDob);
    setChildResult(report);
    setShowChildWhy(false);
  };

  const handleLuckyDatesTrigger = () => {
    const suite = generateLuckyDatesSuite(luckyDatesDriver, luckyDatesConductor);
    setLuckySuiteResult(suite);
    setShowDatesWhy(false);
  };

  return (
    <div id="premium-consultations-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Sidebar Selector */}
      <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm space-y-4 h-fit">
        <div>
          <h3 className="font-playfair text-lg font-bold text-slate-800">Premium Astro-Consultations</h3>
          <p className="text-[10px] text-[#D97706] uppercase tracking-widest font-mono font-bold mt-1">Pro Vedic & Chaldean Tools v3.0</p>
        </div>
        <div className="space-y-2 border-t border-slate-100 pt-4">
          {[
            { id: 'VEHICLE', label: 'Pro Vehicle Numerology', icon: Car },
            { id: 'HOUSE', label: 'Pro House / Flat Vastu', icon: Home },
            { id: 'BUSINESS', label: 'Pro Business Name Suite', icon: Briefcase },
            { id: 'SIGNATURE', label: 'Signature Style Diagnostics', icon: FileText },
            { id: 'CHILD', label: 'Child Lucky Names Pro', icon: Baby },
            { id: 'LUCKY_DATES', label: 'Auspicious Dates Finder', icon: Calendar },
            { id: 'MEDICAL', label: 'Medical Numerology Scanner', icon: Activity },
            { id: 'VAASTU', label: 'Numero Vaastu Pro', icon: Compass },
            { id: 'DASHA', label: 'Annual Dasha Forecast', icon: Clock },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id as any)}
              className={`w-full text-left py-3 px-4 rounded-2xl text-xs font-bold font-sans flex items-center justify-between transition-all duration-300 cursor-pointer ${
                activeModule === m.id
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'bg-transparent text-[#4B5563] hover:bg-[#FDFCF7]/80 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <m.icon className="w-4 h-4" />
                <span>{m.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Form and Report Console */}
      <div className="lg:col-span-8 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[40px] p-8 md:p-10 shadow-sm min-h-[550px]">
        
        {/* VEHICLE MODULE */}
        {activeModule === 'VEHICLE' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <VehicleNumerologyDashboard />
          </motion.div>
        )}

        {/* HOUSE MODULE */}
        {activeModule === 'HOUSE' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Pro House & Flat Vastu Auditor</h3>
              <p className="text-xs text-slate-500 font-sans">Find the core planetary vibrations, wealth indexes, family harmony parameters, and dedicated remedies of your home address.</p>
            </div>

            <form onSubmit={handleHouseSubmit} className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">House / Apartment / Flat Number (any structure)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-101 or 403"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer self-end h-[46px] transition-all"
              >
                Find Vastu
              </button>
            </form>

            {houseResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-700 font-extrabold px-3 py-1 rounded-full uppercase">Type Vibe: {houseResult.vibe}</span>
                    <h4 className="font-playfair text-lg font-bold text-slate-800 mt-2">Home Root Value: {houseResult.reducedTotal}</h4>
                    <p className="text-xs text-slate-505 font-mono text-[#D97706] mt-0.5">Energy: {houseResult.energyVibration}</p>
                  </div>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Wealth potential</p>
                    <p className="text-xl font-bold font-mono text-[#1E3A8A] mt-1">{houseResult.wealthPotential}/100</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Family Harmony</p>
                    <p className="text-xl font-bold font-mono text-rose-600 mt-1">{houseResult.familyHarmony}/100</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold font-bold">Spiritual energy</p>
                    <p className="text-xl font-bold font-mono text-indigo-600 mt-1">{houseResult.spiritualEnergy}/100</p>
                  </div>
                </div>

                {/* Meaning & Advice */}
                <div className="space-y-3">
                  <h5 className="font-playfair text-sm font-bold text-[#1E3A8A] flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> Vastu House Essence</h5>
                  <p className="text-xs text-slate-650 font-sans leading-relaxed font-bold">{houseResult.meaning}</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl text-xs space-y-3 border">
                  <div>
                    <h6 className="font-bold text-slate-800 flex items-center gap-1"><Info className="w-3.5 h-3.5 text-[#1E3A8A]" /> Key Household Advice:</h6>
                    <p className="text-slate-600 mt-1 leading-relaxed">{houseResult.advice}</p>
                  </div>
                  <div className="border-t pt-3">
                    <h6 className="font-bold text-amber-800 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Mandir Vastu Remedy:</h6>
                    <p className="text-slate-600 mt-1 leading-relaxed">{houseResult.remedy}</p>
                  </div>
                </div>

                {/* Expanded Predictions */}
                <div className="space-y-2">
                  <h5 className="font-playfair text-sm font-bold text-slate-800">Long-Term Domestic Forecast</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">{houseResult.predictions}</p>
                </div>

                {/* Vastu Elements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/25 rounded-2xl p-4 border text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#D97706] font-bold">Lucky directions (Directions to Face)</span>
                    <p className="font-bold text-slate-700 mt-1">{houseResult.luckyDirections.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#D97706] font-bold">Best Vastu Wall Colors</span>
                    <p className="font-bold text-slate-700 mt-1">{houseResult.luckyColors.join(', ')}</p>
                  </div>
                </div>

                {/* Expandable Why */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowHouseWhy(!showHouseWhy)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-4 h-4" /> {showHouseWhy ? 'Hide' : 'Show'} "Why This Result?" Detailed Logic Breakdown
                  </button>
                  {showHouseWhy && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border text-xs text-slate-600 space-y-2">
                      <p><strong>Calculations Matrix:</strong> The system extracts sum of all numbers in your house address (ignoring letter tags except if specified). The cumulative sums resolve to Compound {houseResult.totalSum}, subsequently yielding root {houseResult.reducedTotal}.</p>
                      <p><strong>Planetary Rulers:</strong> Standard Indian Vastu assigns specific element vectors to other planets. Numbers like 6 represent high Venusian luxury vibration which multiplies structural assets potential, while numbers like 7 represent cold Ketu energy which benefits solo meditation.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* BUSINESS MODULE */}
        {activeModule === 'BUSINESS' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <BusinessNumerologyDashboard />
          </motion.div>
        )}

        {/* SIGNATURE MODULE */}
        {activeModule === 'SIGNATURE' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">AI Signature Audit Pro</h3>
              <p className="text-xs text-slate-500 font-sans">Audit how different signature trailing coordinates or ending lines directly block or accelerate career wealth flow under Handwriting Vastu & Chaldean Numerology.</p>
            </div>

            {/* PROFILE SYNCHRONIZATION AND DETAILS */}
            <div className="bg-slate-50 border rounded-3xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-playfair text-base font-bold text-slate-800">1. Birth Profile & Planetary Grid</h4>
                  <p className="text-[11px] text-slate-500">Sync birth coordinates to personalize Handwriting Vastu alignment.</p>
                </div>
                {savedProfiles.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Profile Sync:</span>
                    <select
                      value={selectedProfileIndex}
                      onChange={(e) => handleProfileSelectChange(parseInt(e.target.value, 10))}
                      className="bg-white border text-xs px-3 py-1.5 rounded-xl text-slate-700 font-medium focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none"
                    >
                      {savedProfiles.map((p, idx) => (
                        <option key={idx} value={idx}>{p.name} ({formatDateIndian(p.dob)})</option>
                      ))}
                      <option value={-1}>+ Use Custom Credentials</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Subject's Full Name</label>
                  <input
                    type="text"
                    value={sigName}
                    onChange={(e) => {
                      setSigName(e.target.value);
                      setSelectedProfileIndex(-1);
                    }}
                    placeholder="e.g. Raajeev Singh"
                    className="w-full bg-white border border-slate-200 text-xs px-4 py-2.5 rounded-xl text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Birth Date</label>
                  <DateInput
                    id="sig-dob-input"
                    value={sigDob}
                    onChange={(isoVal) => {
                      setSigDob(isoVal);
                      setSelectedProfileIndex(-1);
                    }}
                    className="py-2.5 text-xs"
                  />
                </div>
              </div>

              {sigDob && sigName && (
                <div className="bg-white border rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="border-r border-slate-100 last:border-none">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Mulank (Driver)</span>
                    <span className="font-playfair text-lg font-extrabold text-[#D97706] mt-0.5 block">{getDriverNumber(sigDob)}</span>
                    <span className="text-[9px] text-slate-400">Planet: {
                      ['Sun', 'Moon', 'Jupiter', 'Rahu', 'Mercury', 'Venus', 'Ketu', 'Saturn', 'Mars'][getDriverNumber(sigDob) - 1]
                    }</span>
                  </div>
                  <div className="border-r border-slate-100 last:border-none">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Bhagyank (Conductor)</span>
                    <span className="font-playfair text-lg font-extrabold text-[#1E3A8A] mt-0.5 block">{getConductorNumber(sigDob)}</span>
                    <span className="text-[9px] text-slate-400">Karma Destiny</span>
                  </div>
                  <div className="border-r border-slate-100 last:border-none">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Name Chaldean</span>
                    <span className="font-playfair text-lg font-extrabold text-indigo-800 mt-0.5 block">{getChaldeanNameNumber(sigName)}</span>
                    <span className="text-[9px] text-slate-400">Expression Root {getSingleDigit(getChaldeanNameNumber(sigName))}</span>
                  </div>
                  <div className="last:border-none">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Mercury Stabilizer</span>
                    <span className="text-xs font-semibold mt-1 block">
                      {getDriverNumber(sigDob) === 5 || getConductorNumber(sigDob) === 5 ? (
                        <span className="text-emerald-600 flex items-center justify-center gap-1">Present (Strong)</span>
                      ) : (
                        <span className="text-amber-600 flex items-center justify-center gap-1">Requires Support</span>
                      )}
                    </span>
                    <span className="text-[8px] text-slate-400">Central 5 alignment status</span>
                  </div>
                </div>
              )}
            </div>

            {/* SIGNATURE SUBMISSION / CAPTURE BOARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Area */}
              <div className="bg-white border rounded-3xl p-6 space-y-4">
                <h4 className="font-playfair text-base font-bold text-slate-800">2. Upload Signature or Use Camera</h4>
                <p className="text-[11px] text-slate-500">Provide a sample of your current handwritten signature for AI Handwriting Vastu diagnostics.</p>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processSignatureFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById('sig-file-input')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 min-h-[160px] ${
                    isDragOver ? 'border-[#1E3A8A] bg-[#1E3A8A]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="file"
                    id="sig-file-input"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processSignatureFile(e.target.files[0]);
                      }
                    }}
                  />

                  {isProcessingFile ? (
                    <div className="flex flex-col items-center space-y-2 py-4">
                      <div className="w-8 h-8 border-4 border-[#1E3A8A]/30 border-t-[#1E3A8A] rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold text-[#1E3A8A]">Processing & compressing signature image...</p>
                      <p className="text-[10px] text-slate-400">Optimizing resolution for astro-numerological audit...</p>
                    </div>
                  ) : sigImage ? (
                    <div className="space-y-2 w-full flex flex-col items-center">
                      <img
                        src={sigImage}
                        alt="Signature Preview"
                        className="max-h-24 max-w-full object-contain rounded border-2 border-emerald-500 shadow-sm p-1 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      {fileUploadSuccess && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 mt-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                          ✓ Signature Loaded & optimized
                        </div>
                      )}
                      <p className="text-xs font-mono text-slate-600 truncate max-w-[200px] mt-1">{sigFileName || 'signature.png'}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSigImage(null);
                          setSigFileName(null);
                          setFileUploadSuccess(false);
                        }}
                        className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-600">Drag & drop your signature here, or <span className="text-[#1E3A8A] underline">browse files</span></p>
                      <p className="text-[10px] text-slate-400">Accepts PNG, JPG, JPEG, WEBP signatures (max 10MB)</p>
                    </>
                  )}
                </div>

                {/* Camera Capture Section */}
                <div className="space-y-2">
                  {!sigCameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-slate-500" /> Capture signature using camera
                    </button>
                  ) : (
                    <div className="border rounded-2xl p-4 bg-slate-900 space-y-3 relative overflow-hidden">
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover scale-x-[-1]"
                          playsInline
                          muted
                        />
                        <div className="absolute inset-4 border border-dashed border-white/40 pointer-events-none rounded flex items-center justify-center">
                          <span className="text-[9px] text-white/50 uppercase tracking-widest font-mono">Align signature inside box</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="py-1.5 px-3 rounded-lg text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={captureSignature}
                          className="py-1.5 px-4 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Capture sample
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Textual Fallback Reference Card */}
              <div className="bg-white border rounded-3xl p-6 space-y-4">
                <h4 className="font-playfair text-base font-bold text-slate-800">Or: Choose Current General Style</h4>
                <p className="text-[11px] text-slate-500">No image? Choose the closest style of your current signature to run the AI engine with fallback descriptors.</p>
                
                <div className="space-y-2">
                  {[
                    { id: 'RISING_UNDERLINE', label: '15-Degree Rising Line + Underline', desc: 'Positive, ascending confidence line.' },
                    { id: 'TRAILING_DOT_BELOW', label: 'First Letter Large + Trailing Dot Below', desc: 'Subconscious lock blockages.' },
                    { id: 'FALLING_LINE', label: 'Downward Sloping Trailing Segment', desc: 'Declining cellular forces, delays.' },
                    { id: 'DOUBLE_UNDERLINE', label: 'Straight Line + Two Support Underlines', desc: 'Strong structure, corporate base.' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSignatureTrigger(s.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer block ${
                        signatureStyle === s.id ? 'bg-[#1E3A8A]/5 border-[#1E3A8A] ring-1 ring-[#1E3A8A]' : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">{s.label}</span>
                        {signatureStyle === s.id && <Check className="w-4 h-4 text-[#1E3A8A]" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {sigError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-xs text-red-800 flex gap-2 items-center">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="font-medium">{sigError}</p>
              </div>
            )}

            {/* ACTION TRIGGERS */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => handleAISignatureAudit()}
                disabled={isAnalyzingSig}
                className={`py-3.5 px-8 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                  isAnalyzingSig
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#1E3A8A] text-white hover:bg-[#1e3a8a]/90 hover:shadow-lg active:scale-95'
                }`}
              >
                {isAnalyzingSig ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Handwriting Vastu...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Start LeoFamily Signature Audit Pro
                  </>
                )}
              </button>
            </div>

            {/* AUDIT RESULTS DOSSIER */}
            {sigAuditResult ? (
              <div className="bg-white border rounded-3xl p-6 space-y-8 animate-in fade-in duration-500 mt-6" id="signature-dossier-report">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                  <div>
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 w-fit">
                      <CheckCircle className="w-3 h-3" /> LeoFamily Signature Audit Pro Completed & Synced to Master Report
                    </span>
                    <h3 className="font-playfair text-xl font-bold text-[#1E3A8A] mt-2">LeoFamily Signature Audit Pro Dossier</h3>
                    <p className="text-xs text-slate-500">Tailored to Driver {getDriverNumber(sigDob)} & Conductor {getConductorNumber(sigDob)} cosmic coordinates.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="py-1.5 px-4 rounded-xl text-xs font-bold border hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Print Dossier
                    </button>
                    <button
                      onClick={() => {
                        setSigAuditResult(null);
                        setSigImage(null);
                        setSigFileName(null);
                      }}
                      className="py-1.5 px-4 rounded-xl text-xs font-bold bg-slate-50 border hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                    >
                      Reset Audit
                    </button>
                  </div>
                </div>

                {/* SCORES AND RADIAL DASHBOARD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Circular Score Gauge */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-indigo-50/50 to-slate-50 border rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-4">Overall Vastu Alignment</span>
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-slate-200"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-[#1E3A8A]"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 60}
                          strokeDashoffset={2 * Math.PI * 60 * (1 - (sigAuditResult.scores?.overallSignatureScore || 50) / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span className="font-playfair text-4xl font-black text-slate-800">{sigAuditResult.scores?.overallSignatureScore}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">/ 100 Points</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-650 mt-4 font-medium leading-relaxed text-center">
                      {(sigAuditResult.scores?.overallSignatureScore || 50) >= 80 ? (
                        <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Highly Auspicious Vastu Alignment
                        </span>
                      ) : (sigAuditResult.scores?.overallSignatureScore || 50) >= 60 ? (
                        <span className="text-[#D97706] font-bold flex items-center justify-center gap-1">
                          <Info className="w-4 h-4" /> Moderate Karmic Blockages Found
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center justify-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Severe Energy Leakages Detected
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Astro-Numerology Alignment Bento Box */}
                  <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Career & Authority', val: sigAuditResult.scores?.careerScore || 65, desc: 'Fame & hierarchical growth' },
                      { label: 'Wealth Protection', val: sigAuditResult.scores?.financialFlowScore || 60, desc: 'Locks leakage, preserves savings' },
                      { label: 'Public Recognition', val: sigAuditResult.scores?.recognitionScore || 70, desc: 'Social brand & circle status' },
                      { label: 'Leadership Flow', val: sigAuditResult.scores?.leadershipScore || 65, desc: 'Command & team compliance' },
                      { label: 'Enterprise Suitability', val: sigAuditResult.scores?.businessSuccessScore || 60, desc: 'Corporate expansion & deeds' },
                      { label: 'Relationship Harmony', val: sigAuditResult.scores?.relationshipHarmonyScore || 75, desc: 'Vocal composure & household vibes' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white border rounded-2xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-700 block">{item.label}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{item.desc}</span>
                        </div>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="font-playfair text-xl font-bold text-slate-800">{item.val}</span>
                          <span className="text-[9px] text-slate-400">/100</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full ${
                              item.val >= 85 ? 'bg-emerald-500' : item.val >= 65 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 9 PARAMETERS VASTU AUDIT DETAIL */}
                <div className="space-y-4">
                  <h4 className="font-playfair text-base font-bold text-slate-800">3. Vastu Handwriting Audit Breakdown</h4>
                  <p className="text-[11px] text-slate-500">A rigorous evaluation of 9 structural handwriting coordinates detected in your signature.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Signature Direction', val: sigAuditResult.analysis?.direction, icon: TrendingUp },
                      { title: 'Physical Size', val: sigAuditResult.analysis?.size, icon: Compass },
                      { title: 'First Letter Size', val: sigAuditResult.analysis?.firstLetterSize, icon: Award },
                      { title: 'Underline Style', val: sigAuditResult.analysis?.underlineStyle, icon: Activity },
                      { title: 'End Stroke Angle', val: sigAuditResult.analysis?.endStroke, icon: ArrowRight },
                      { title: 'Dot Placement', val: sigAuditResult.analysis?.dotPlacement, icon: Star },
                      { title: 'Letter Legibility', val: sigAuditResult.analysis?.letterLegibility, icon: Eye },
                      { title: 'Name Completion', val: sigAuditResult.analysis?.nameCompletion, icon: User },
                      { title: 'Subconscious Flow', val: sigAuditResult.analysis?.overallFlow, icon: Sparkles },
                    ].map((param, idx) => {
                      const IconComp = param.icon;
                      return (
                        <div key={idx} className="bg-slate-50/50 border rounded-2xl p-4 space-y-2">
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                            <IconComp className="w-4 h-4 text-[#1E3A8A]" />
                            <span>{param.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{param.val}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* EXECUTIVE CLINICAL REPORT */}
                <div className="bg-slate-50 border rounded-3xl p-6 space-y-6">
                  <div>
                    <h4 className="font-playfair text-base font-bold text-slate-800">4. Astro-Vastu Diagnostic Assessment</h4>
                    <p className="text-[11px] text-slate-500">Executive diagnostic summary prepared by the AI master astrologer.</p>
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed font-sans bg-white border rounded-2xl p-4">
                    <p className="font-bold text-[#1E3A8A] mb-1">Current State Analysis:</p>
                    {sigAuditResult.assessment?.currentSignatureAssessment}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Strengths */}
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Present Strengths
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-650 font-sans">
                        {sigAuditResult.assessment?.strengths?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" /> Energy Blockages
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-650 font-sans">
                        {sigAuditResult.assessment?.weaknesses?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Risk Areas */}
                    <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 space-y-2">
                      <span className="text-[10px] font-mono text-rose-800 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Critical Risk Traps
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-650 font-sans">
                        {sigAuditResult.assessment?.riskAreas?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* BEFORE VS AFTER REDESIGN VIEW */}
                <div className="space-y-4">
                  <h4 className="font-playfair text-base font-bold text-slate-800">5. Before vs After Vastu Recommendations</h4>
                  <p className="text-[11px] text-slate-500">Visual comparison of energy traps in current style versus redesigned cosmic blueprint.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-5 space-y-3">
                      <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
                        <span className="p-1 rounded-lg bg-rose-100 text-rose-700">
                          <X className="w-4 h-4" />
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">Current Handwriting Traps (Before)</h5>
                          <p className="text-[10px] text-rose-700">Blocks, leakages, and planetary delays.</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-[11px]">
                        <p className="text-slate-700"><strong>Visual Blueprint:</strong> {sigAuditResult.beforeAfter?.before?.visualDescription}</p>
                        <p className="text-slate-600 bg-white border border-rose-50 p-2.5 rounded-xl"><strong>Energy Drag:</strong> {sigAuditResult.beforeAfter?.before?.impact}</p>
                      </div>
                    </div>

                    {/* After */}
                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-5 space-y-3">
                      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                        <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                          <Check className="w-4 h-4" />
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">Cosmic Shielded Script (After)</h5>
                          <p className="text-[10px] text-emerald-700">Unlocks wealth vaults & public status.</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-[11px]">
                        <p className="text-slate-700"><strong>Corrected Blueprint:</strong> {sigAuditResult.beforeAfter?.after?.visualDescription}</p>
                        <p className="text-slate-600 bg-white border border-emerald-50 p-2.5 rounded-xl"><strong>Vibrational Flow:</strong> {sigAuditResult.beforeAfter?.after?.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* THE REMEDIAL FORMULA & EXECUTION BLUEPRINT */}
                <div className="bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#1E3A8A]/10 pb-3">
                    <Shield className="w-5 h-5 text-[#1E3A8A]" />
                    <div>
                      <h4 className="font-playfair text-base font-bold text-[#1E3A8A]">6. Ideal Redesigned Execution & Formula</h4>
                      <p className="text-[11px] text-slate-500">Exact handwriting modifications prescribed for daily practice.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 font-sans">
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-2xl border">
                        <span className="text-[9px] font-mono text-[#D97706] uppercase tracking-wider block font-bold mb-1">Your Lucky Redesigned Vastu Style</span>
                        <p className="font-medium text-slate-800 leading-relaxed">{sigAuditResult.assessment?.idealSignatureStyle}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border">
                        <span className="text-[9px] font-mono text-indigo-700 uppercase tracking-wider block font-bold mb-1">Physical Execution Guidelines</span>
                        <p className="text-slate-600 leading-relaxed font-sans">{sigAuditResult.assessment?.personalizedSignatureBlueprint}</p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-2xl p-4 space-y-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Step-by-Step Handwriting Remediation</span>
                      <ol className="space-y-2 text-[11px] text-slate-650">
                        {sigAuditResult.assessment?.recommendedCorrections?.map((step: string, idx: number) => (
                          <li key={idx} className="flex gap-2 items-start font-sans">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-[#1E3A8A] font-extrabold flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5">{idx + 1}</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Fallback style selection display if no AI audit has run yet */
              signatureResult && (
                <div className="p-6 bg-slate-50 border rounded-3xl flex flex-col justify-between space-y-4 animate-in fade-in duration-500 mt-6">
                  <div className="border-b pb-3">
                    <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-2 py-0.5 rounded-full uppercase">Signature General Profile</span>
                    <h4 className="font-playfair text-base font-bold text-slate-800 mt-2">Style: {signatureResult.directionStyle}</h4>
                    <p className="text-[11px] text-slate-500">Planetary Force: {signatureResult.planetaryEnergy}</p>
                  </div>

                  <div className="text-xs space-y-2 text-slate-650 leading-relaxed">
                    <p><strong>Career Impact:</strong> {signatureResult.careerImpact}</p>
                    <p><strong>Financial Impact:</strong> {signatureResult.financialImpact}</p>
                    <p className="text-indigo-800"><strong>Public Recognition Score:</strong> {signatureResult.publicRecognitionScore}/100</p>
                  </div>

                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs text-rose-900">
                    <p className="font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Needed Corrections:</p>
                    <ul className="list-disc list-inside mt-1 font-sans space-y-1 text-slate-600 text-[11px]">
                      {signatureResult.corrections.map((col, idx) => <li key={idx}>{col}</li>)}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-650 pt-2 border-t">
                    <p className="font-bold text-[#D97706]">Grandmaster Advice:</p>
                    <p className="text-slate-500 italic mt-1 leading-relaxed">{signatureResult.recommendations}</p>
                  </div>

                  {/* Expandable Why */}
                  <div className="border-t pt-2">
                    <button
                      onClick={() => setShowSignatureWhy(!showSignatureWhy)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" /> Explain why signature lines matter
                    </button>
                    {showSignatureWhy && (
                      <div className="mt-2 p-3 bg-white rounded-xl border text-[11px] text-slate-500 space-y-1">
                        <p><strong>Vastu for Handwriting:</strong> Under Indian occult dynamics, signatures are direct outlets of self-projecting subconscious. An ascending line signals high cellular energy, while terminal dots at bottom act like locks that freeze active capital flow.</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </motion.div>
        )}

        {/* CHILD MODULE */}
        {activeModule === 'CHILD' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <ChildLuckyNamesDashboard />
          </motion.div>
        )}

        {/* LUCKY DATES MODULE */}
        {activeModule === 'LUCKY_DATES' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <LuckyDatesFinder />
          </motion.div>
        )}

        {/* MEDICAL MODULE */}
        {activeModule === 'MEDICAL' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Ayurvedic Medical Numerology Scanner</h3>
              <p className="text-xs text-slate-500 font-sans">Map your birth psychic coordinates and name harmonics to diagnose latent bodily doshas (Vata, Pitta, Kapha) and receive personalized preventative health advice.</p>
            </div>

            <form onSubmit={handleMedicalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Seeker Date of Birth</label>
                  <DateInput
                    id="medical-dob-input"
                    required
                    value={medicalDob}
                    onChange={setMedicalDob}
                    className="py-3 text-sm font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Seeker Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Sharma"
                    value={medicalName}
                    onChange={(e) => setMedicalName(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all"
              >
                Scan My Medical Doshas & Health Index
              </button>
            </form>

            {medicalResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans text-xs">
                
                {/* MEDICAL DISCLAIMER */}
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[10px] flex gap-2 font-sans font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <div>
                    <strong>MEDICAL DISCLAIMER:</strong> {medicalResult.disclaimer}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Dosha Breakdown Panel */}
                  <div className="space-y-4 border p-5 rounded-2xl bg-amber-50/10">
                    <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Ayurvedic Dosha Composition</h4>
                    <div className="space-y-3 font-semibold text-[11px]">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sky-700">Vata (वायु एवं आकाश - Senses, Movement)</span>
                          <span>{medicalResult.doshaComposition.vata}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${medicalResult.doshaComposition.vata}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-red-700">Pitta (अग्नि - Digestive Fire, Energy)</span>
                          <span>{medicalResult.doshaComposition.pitta}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${medicalResult.doshaComposition.pitta}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-emerald-700">Kapha (जल एवं पृथ्वी - Structure, Lubricant)</span>
                          <span>{medicalResult.doshaComposition.kapha}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${medicalResult.doshaComposition.kapha}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-500 leading-relaxed font-medium">
                      Primary Dominance is governed by **{medicalResult.dominantDosha}**, causing tendencies toward cold-dry blockages or warm respiratory delays. Secondary planetary influence is **{medicalResult.secondaryDosha}**.
                    </div>
                  </div>

                  {/* Health Scores Panel */}
                  <div className="space-y-4 border p-5 rounded-2xl bg-amber-50/5">
                    <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Planetary Vitality Sub-Scores</h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center border-b pb-1.5">
                        <span className="text-slate-600 font-medium font-sans">Core Health Wellness Index</span>
                        <span className="font-mono font-bold bg-amber-100 text-[#D97706] px-2.5 py-0.5 rounded-full">{medicalResult.scores.healthScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-1.5">
                        <span className="text-slate-600 font-medium font-sans">Agni digestive Index</span>
                        <span className="font-mono font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">{medicalResult.scores.digestiveScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-1.5">
                        <span className="text-slate-600 font-medium font-sans">Karmic Stress vulnerability</span>
                        <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">{medicalResult.scores.stressLevel}/100</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-1.5">
                        <span className="text-slate-600 font-medium font-sans">Sleep depth Index</span>
                        <span className="font-mono font-bold bg-sky-100 text-sky-850 px-2.5 py-0.5 rounded-full">{medicalResult.scores.sleepQuality}/100</span>
                      </div>
                      <div className="flex justify-between items-center pb-0.5">
                        <span className="text-slate-600 font-medium font-sans">Ojas Immunological Shield</span>
                        <span className="font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">{medicalResult.scores.immunityScore}/100</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Weak body organs */}
                  <div className="p-4 bg-rose-50/20 border border-rose-100/70 rounded-2xl space-y-2 text-left">
                    <span className="font-bold font-mono text-[10px] uppercase text-rose-800 flex items-center gap-1.5 font-sans">
                      ⚠️ Weak Body Organs & Systems
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {medicalResult.weakBodySystems.map((sys, idx) => (
                        <span key={idx} className="bg-rose-50 border border-rose-100 text-rose-800 text-[9px] px-2.5 py-0.5 rounded-full font-semibold font-sans">{sys}</span>
                      ))}
                    </div>
                  </div>

                  {/* Fasting Day */}
                  <div className="p-4 bg-amber-50/30 border border-amber-100 rounded-2xl space-y-2 text-left">
                    <span className="font-bold font-mono text-[10px] uppercase text-amber-800 flex items-center gap-1.5 font-sans">
                      ☀️ Recommended Planetary Fasting Day
                    </span>
                    <p className="text-xs font-bold text-slate-850 pt-1 leading-relaxed">
                      We highly recommend practicing intermittent or complete planetary fasting on **{medicalResult.dietRecommendations.recommendedFastingDay}** to clear any blocked channel energies.
                    </p>
                  </div>
                </div>

                {/* Dietary suggestions bento */}
                <div className="p-5 border rounded-2xl space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Vedic Diet Adjustments</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">🍽️ Recommended Health Foods</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        {medicalResult.dietRecommendations.recommendedFoods.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] font-mono uppercase text-red-700 font-bold block">🚫 Strictly Avoid / Cut Off Foods</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        {medicalResult.dietRecommendations.foodsToAvoid.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* YogaSuggestions and pranayama suggestions */}
                <div className="p-5 border rounded-2xl bg-slate-50/50 space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Ayurvedic Dinacharya Lifestyle Suggestions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px]">
                    <div className="space-y-2 text-left">
                      <span className="font-bold text-slate-750 uppercase font-mono block">🧘 Recommended Asanas & Exercises</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {medicalResult.ayurvedicLifestyle.yogaSuggestions.map((yo, i) => (
                          <span key={i} className="bg-slate-100 border text-slate-700 px-2 py-0.5 rounded-lg">{yo}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <span className="font-bold text-slate-750 uppercase font-mono block">🌬️ Pranayama Channel Cleansers</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {medicalResult.ayurvedicLifestyle.pranayamaSuggestions.map((pr, i) => (
                          <span key={i} className="bg-amber-50 border border-amber-100 text-amber-900 px-2 py-0.5 rounded-lg">{pr}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 col-span-1 sm:col-span-2 border-t pt-3 text-left">
                      <span className="font-bold text-slate-750 uppercase font-mono block">⏰ Custom Sleep Guide & Morning Alarm</span>
                      <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                        **Sleep Timing:** {medicalResult.ayurvedicLifestyle.sleepHygieneTip}. <br />
                        **Morning Routine:** {medicalResult.ayurvedicLifestyle.morningRoutine}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expandable Why */}
                <div className="border-t pt-2 text-left">
                  <button
                    type="button"
                    onClick={() => setShowMedicalWhy(!showMedicalWhy)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Explain medical calculation rule
                  </button>
                  {showMedicalWhy && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 space-y-1">
                      <p><strong>Birthday-Dosha Map:</strong> Birth dates map to celestial ruler planets with established physical properties in Ayurveda. Odd numbers (1-Sun, 9-Mars) govern Pitta. Soft even digits (2-Moon, 6-Venus) rule Kapha hydration. Delayed numbers (4-Rahu, 8-Saturn) govern dryness and neural Vata blockages.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* VAASTU MODULE */}
        {activeModule === 'VAASTU' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Numero Vaastu Pro Scanner</h3>
              <p className="text-xs text-slate-500 font-sans">Calculate your cosmic Kua direction number matching the Eight Mansion (BaBazi) school. Find your positive spatial zones (Success, Health, Family, Growth) and place color placements inside your flats.</p>
            </div>

            <form onSubmit={handleVaastuSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Date of Birth</label>
                  <DateInput
                    id="vaastu-dob-input"
                    required
                    value={vaastuDob}
                    onChange={setVaastuDob}
                    className="py-3 text-sm font-sans"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Gender (Crucial for Kua Sums)</label>
                  <select
                    value={vaastuGender}
                    onChange={(e: any) => setVaastuGender(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none cursor-pointer"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Raajeev Singh"
                    value={vaastuName}
                    onChange={(e) => setVaastuName(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all"
              >
                Scan Spatial Vastu Zones & Kua Number
              </button>
            </form>

            {vaastuResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans text-xs text-left">
                
                {/* Kua Number Core badge */}
                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#D97706] uppercase tracking-wider font-mono font-bold block">Your Magnetic Vastu Signature</span>
                    <h4 className="font-playfair text-md font-bold text-slate-800">
                      Kua Number: <strong className="text-[#D97706] text-xl font-mono">{vaastuResult.kuaNumber}</strong> (Co-ruled by Element: {vaastuResult.rulingElement})
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Your birthday coordinates belong to the **{vaastuResult.groupType === 'EAST_GROUP' ? 'East Mansion Group (पूर्व दिशा समूह)' : 'West Mansion Group (पश्चिम दिशा समूह)'}**. Aligning bed and desks matching this group activates rapid monetary luck.
                    </p>
                  </div>
                  <div className="bg-[#1E3A8A] text-white px-5 py-2 rounded-xl text-center shrink-0 font-sans">
                    <span className="text-[9px] block uppercase tracking-wider font-semibold font-mono">Orient Group</span>
                    <span className="font-bold text-xs">{vaastuResult.groupType === 'EAST_GROUP' ? 'EAST' : 'WEST'} GROUP</span>
                  </div>
                </div>

                {/* 2x2 Lucky directions bento */}
                <div className="space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Eight Mansion Favorable Directions Grid</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-4 bg-emerald-50/25 border border-emerald-100/70 rounded-2xl space-y-1 text-left">
                      <span className="font-bold font-mono text-[10px] uppercase text-emerald-800 flex items-center gap-1 font-sans">
                        🚀 Success Direction (Sheng Chi)
                      </span>
                      <p className="text-sm font-bold text-slate-850 font-mono">{vaastuResult.directions.success.direction}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">{vaastuResult.directions.success.description}</p>
                    </div>

                    <div className="p-4 bg-[#D97706]/5 border border-[#D97706]/10 rounded-2xl space-y-1 text-left">
                      <span className="font-bold font-mono text-[10px] uppercase text-[#D97706] flex items-center gap-1 font-sans">
                        ➕ Health Direction (Tien Yi)
                      </span>
                      <p className="text-sm font-bold text-slate-855 font-mono">{vaastuResult.directions.health.direction}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">{vaastuResult.directions.health.description}</p>
                    </div>

                    <div className="p-4 bg-pink-50/20 border border-pink-100/70 rounded-2xl space-y-1 text-left">
                      <span className="font-bold font-mono text-[10px] uppercase text-pink-700 flex items-center gap-1 font-sans">
                        💕 Relationship Direction (Nien Yen)
                      </span>
                      <p className="text-sm font-bold text-slate-850 font-mono">{vaastuResult.directions.family.direction}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">{vaastuResult.directions.family.description}</p>
                    </div>

                    <div className="p-4 bg-blue-50/25 border border-blue-100/70 rounded-2xl space-y-1 text-left">
                      <span className="font-bold font-mono text-[10px] uppercase text-blue-800 flex items-center gap-1 font-sans">
                        🌱 Personal Development (Fu Wei)
                      </span>
                      <p className="text-sm font-bold text-slate-850 font-mono">{vaastuResult.directions.personalDev.direction}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">{vaastuResult.directions.personalDev.description}</p>
                    </div>

                  </div>
                </div>

                {/* Spatial placements */}
                <div className="p-4 bg-indigo-50/10 border border-indigo-100 rounded-2xl space-y-3 text-left">
                  <span className="font-bold font-mono text-[10px] uppercase text-indigo-800 flex items-center gap-1.5 font-sans">
                    🛏️ Bed Head & Office Desk Facing Guidelines
                  </span>
                  <div className="font-semibold text-slate-700 space-y-1 text-[11px] leading-relaxed">
                    • **Bedroom & Bed orientation:** Headboard position must project towards the face direction **{vaastuResult.remedies.idealBedFacing}** to promote deeper sleep. <br />
                    • **Office Desk Facing:** Always sit facing **{vaastuResult.remedies.idealDeskFacing}** to activate rapid sales and prevent communication blockages.
                  </div>
                </div>

                {/* Colour Correction Suite */}
                <div className="p-5 border rounded-2xl space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">House, Bedding, and Vehicle Paint Correction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                    <div className="p-3 bg-emerald-50 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">🎨 Primary Lucky Colours</span>
                      <p className="text-slate-600 font-semibold">{vaastuResult.colourCorrection.luckyColours.join(', ')}</p>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-amber-800 uppercase font-bold">🎨 Stabilizing Balance Colours</span>
                      <p className="text-slate-600 font-semibold">{vaastuResult.colourCorrection.balanceColours.join(', ')}</p>
                    </div>

                    <div className="p-3 bg-red-50 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-red-800 uppercase font-bold">🚫 Hostile / Anti Colours to Avoid</span>
                      <p className="text-red-800 font-semibold">{vaastuResult.colourCorrection.antiColours.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Vastu Zone Remedies */}
                <div className="p-5 border rounded-2xl space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Actionable Directional Altar Enhancements</h4>
                  <div className="space-y-3 text-[11px] leading-relaxed">
                    <div className="border-b pb-2">
                      <span className="font-bold text-slate-800 uppercase font-mono block text-[10px] text-cyan-800">💼 Business & Career Zone (उत्तर - Career direction):</span>
                      <p className="text-slate-600 mt-0.5">{vaastuResult.zonesReport.careerZone.enhancement}</p>
                    </div>
                    <div className="border-b pb-2">
                      <span className="font-bold text-slate-800 uppercase font-mono block text-[10px] text-emerald-800">💰 Financial Cash Flow Zone (दक्षिण-पूर्व - Money direction):</span>
                      <p className="text-slate-600 mt-0.5">{vaastuResult.zonesReport.moneyZone.enhancement}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 uppercase font-mono block text-[10px] text-pink-800">💖 Relationship Zone (दक्षिण-पश्चिम - Relationships direction):</span>
                      <p className="text-slate-600 mt-0.5">{vaastuResult.zonesReport.relationshipZone.enhancement}</p>
                    </div>
                  </div>
                </div>

                {/* Lo Shu grid + Vastu remedies */}
                <div className="p-5 border rounded-2xl bg-amber-50/5 space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Vedic Missing Nodes Remedies (Lo Shu Grid Integration)</h4>
                  <p className="text-slate-500 text-[10px] leading-relaxed pb-1 italic font-sans animate-pulse">Based on missing numbers from your date of birth, apply these specific spatial corrections inside your living rooms:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] leading-relaxed font-sans">
                    {vaastuResult.loShuVaastuRemedies.map((re, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border rounded-xl space-y-1">
                        <span className="font-bold font-mono text-[10px] text-[#D97706] uppercase block">Node {re.digit} Missing ({re.title})</span>
                        <p className="text-slate-600 font-semibold text-xs">✨ {re.remedy}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bad directions warning */}
                <div className="p-4 bg-red-50/20 border border-rose-100 rounded-2xl space-y-2 text-left">
                  <span className="font-bold text-slate-755 font-mono text-[10px] uppercase text-rose-800 flex items-center gap-1.5 font-sans">
                    🚫 Avoid Facing / Bad Directions Hazard Alert
                  </span>
                  <div className="text-xs text-slate-600 space-y-1 text-[11px] leading-relaxed font-sans font-medium">
                    Never face these directions during important corporate meetings or property closings: <br />
                    <span className="font-bold text-rose-800 font-mono text-center block pt-1.5">{vaastuResult.directions.avoidList.join(', ')}</span>
                  </div>
                </div>

                {/* Expandable Why */}
                <div className="border-t pt-2 text-left">
                  <button
                    type="button"
                    onClick={() => setShowVaastuWhy(!showVaastuWhy)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Explain Kua directions maths
                  </button>
                  {showVaastuWhy && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 space-y-1 font-sans">
                      <p><strong>Kua Calculation Rules:</strong> Kua represents your celestial frequency matching local magnetic directions: <br />
                      • For Males: Sum the final two digits of the birth year, reduce to a single digit, and subtract from 11. <br />
                      • For Females: Sum the final two digits of the birth year, reduce to a single digit, and add 4.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* DASHA MODULE */}
        {activeModule === 'DASHA' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Annual Dasha & Shifting Forecast Engine</h3>
              <p className="text-xs text-slate-500 font-sans">Break down your lifespans into exact 9-year major planetary epochs (Mahadashas), discover your current yearly sub-period (Antardasha), and see predictions for 2026-2030.</p>
            </div>

            <form onSubmit={handleDashaSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Seeker Date of Birth</label>
                  <DateInput
                    id="dasha-dob-input"
                    required
                    value={dashaDob}
                    onChange={setDashaDob}
                    className="py-3 text-sm font-sans"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Target Transit Year</label>
                  <select
                    value={dashaYear}
                    onChange={(e) => setDashaYear(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none cursor-pointer"
                  >
                    {[2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>Transit Year {y}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all"
              >
                Calculate My Planetary Dashas & Forecast
              </button>
            </form>

            {dashaResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans text-xs text-left">
                
                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Mahadasha */}
                  <div className="p-4 bg-[#D97706]/5 border border-[#D97706]/15 rounded-2xl text-left space-y-1">
                    <span className="text-[10px] text-[#D97706] tracking-wider uppercase font-mono font-bold block">Active running Mahadasha</span>
                    <h5 className="font-playfair font-bold text-slate-850 text-sm">{dashaResult.currentMahadasha.planetName}</h5>
                    <p className="text-[10px] text-slate-500 font-medium pt-0.5">Focus Years: {dashaResult.currentMahadasha.startYear} - {dashaResult.currentMahadasha.endYear} (Age {dashaResult.currentMahadasha.startAge}-{dashaResult.currentMahadasha.endAge})</p>
                  </div>

                  {/* Current Antardasha */}
                  <div className="p-4 bg-blue-50/25 border border-blue-100 rounded-2xl text-left space-y-1">
                    <span className="text-[10px] text-blue-750 tracking-wider uppercase font-mono font-bold block">Active annual Antardasha sub-period</span>
                    <h5 className="font-playfair font-bold text-slate-850 text-sm">{dashaResult.currentAntardasha.subPlanetName}</h5>
                    <p className="text-[10px] text-slate-500 font-medium pt-0.5">Running in year: {dashaResult.currentAntardasha.calendarYear} (Influence age: {dashaResult.currentAntardasha.ageOfInfluence})</p>
                  </div>
                </div>

                {/* Antardasha forecast text */}
                <div className="p-4 bg-blue-50/10 border rounded-2xl">
                  <span className="text-[10px] text-blue-800 tracking-wider uppercase font-mono font-bold block mb-1">Sub period influence advice</span>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">{dashaResult.currentAntardasha.forecast}</p>
                </div>

                {/* Category impacts of current dasha */}
                <div className="space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Dasha Shifting Life-Category Impacts</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-3 bg-slate-55 rounded-xl border">
                      <span className="font-bold text-[#D97706] font-mono text-[9px] uppercase">💼 Career & Business Impact</span>
                      <p className="text-[11px] text-slate-600 mt-1">{dashaResult.currentMahadasha.careerImpact}</p>
                    </div>

                    <div className="p-3 bg-slate-55 rounded-xl border">
                      <span className="font-bold text-[#D97706] font-mono text-[9px] uppercase">💰 Financial Growth & Savings</span>
                      <p className="text-[11px] text-slate-600 mt-1">{dashaResult.currentMahadasha.financialImpact}</p>
                    </div>

                    <div className="p-3 bg-slate-55 rounded-xl border">
                      <span className="font-bold text-[#D97706] font-mono text-[9px] uppercase">🏥 Physical Body Vitality</span>
                      <p className="text-[11px] text-slate-600 mt-1">{dashaResult.currentMahadasha.healthImpact}</p>
                    </div>

                    <div className="p-3 bg-slate-55 rounded-xl border">
                      <span className="font-bold text-[#D97706] font-mono text-[9px] uppercase">💖 Marital & Relationship Harmony</span>
                      <p className="text-[11px] text-slate-600 mt-1">{dashaResult.currentMahadasha.relationshipImpact}</p>
                    </div>

                  </div>
                </div>

                {/* Personal year transit */}
                <div className="p-5 border rounded-2xl bg-amber-50/10 space-y-2">
                  <span className="font-bold text-[#D97706] font-mono text-[10px] uppercase block">📅 Personal Year Transit Forecast (Year {dashaResult.currentYear})</span>
                  <div className="text-xs font-semibold text-slate-800 leading-relaxed font-sans bg-white p-4.5 border rounded-2xl shadow-inner">
                    {dashaResult.personalYearForecast}
                  </div>
                </div>

                {/* Timeline visual section */}
                <div className="p-5 border rounded-2xl space-y-4">
                  <h4 className="font-playfair text-sm uppercase text-[#D97706] tracking-wider font-bold">Your Lifetime Dasha Master Roadmap</h4>
                  <div className="space-y-2 text-[11px]">
                    {dashaResult.mahadashasList.map((ds, idx) => {
                      const isCurrent = ds.planet === dashaResult.currentMahadasha.planet && ds.startYear === dashaResult.currentMahadasha.startYear;
                      return (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border transition-all ${isCurrent ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md font-bold' : 'bg-slate-50/55 hover:bg-slate-50/90 text-slate-700'}`}>
                          <span>Age {ds.startAge} - {ds.endAge} ({ds.startYear} - {ds.endYear})</span>
                          <span className="uppercase text-[10px] tracking-wider font-mono shrink-0">{ds.planetName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expandable Why */}
                <div className="border-t pt-2 text-left">
                  <button
                    type="button"
                    onClick={() => setShowDashaWhy(!showDashaWhy)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Explain dasha math logic
                  </button>
                  {showDashaWhy && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 space-y-1 font-sans">
                      <p><strong>Vedic Timeline Cycles:</strong> Traditional Indian numerology structures human trajectories in repeating 9-year intervals. The first era is ruled by your birth core Driver planet. The second period triggers your Conductor (Bhagyank) planet frequency. Shifting transits keep the individual within the magnetic rays of Saturn (delay/tests), Sun (fame/vertical progress), or Venus (splendor/luxury).</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
