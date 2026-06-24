import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, Home, Briefcase, FileText, UserPlus, TrendingUp, Calendar, ChevronRight, Sparkles, Award, ShieldAlert, CheckCircle, RefreshCw, Star, ArrowRight, Info, Eye, Clock, User, Heart, Compass, Activity,
  Camera, Upload, X, Check, AlertTriangle, Trash2, FileImage, Shield
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

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function PremiumConsultations() {
  const [activeModule, setActiveModule] = useState<'VEHICLE' | 'HOUSE' | 'BUSINESS' | 'SIGNATURE' | 'CHILD' | 'LUCKY_DATES' | 'MEDICAL' | 'VAASTU' | 'DASHA'>('VEHICLE');

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

  // Convert uploaded image or PDF to base64
  const processSignatureFile = (file: File) => {
    if (!file) return;
    setSigFileName(file.name);
    setSigError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setSigImage(result);
      }
    };
    reader.onerror = () => {
      setSigError("सिग्नेचर फ़ाइल पढ़ने में विफल। कृपया कोई अन्य छवि या पीडीएफ फ़ाइल आज़माएं।");
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

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "सिग्नेचर ऑडिट विफल रहा।");
      }

      const result = await response.json();
      setSigAuditResult(result);
    } catch (err: any) {
      console.error("Signature Audit API Error:", err);
      setSigError(err.message || "सिग्नेचर ऑडिट करने में समस्या आई। कृपया पुनः प्रयास करें।");
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
            { id: 'CHILD', label: 'Child Auspicious Names', icon: UserPlus },
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
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Pro Vehicle Numerology Analyzer</h3>
              <p className="text-xs text-slate-500 font-sans">Calculate precise cumulative Chaldean vibrations, accident risks, and suitability ratings of your vehicle.</p>
            </div>

            <form onSubmit={handleVehicleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Vehicle Plate Number (eg. MH12AB1234)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH12AB1234"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Your Driver / Birth Root Number</label>
                <select
                  value={vehicleDriver}
                  onChange={(e) => setVehicleDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all"
              >
                Scan Plate Compatibility (500+ Words)
              </button>
            </form>

            {vehicleResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-3 py-1 rounded-full uppercase">Chaldean Sum: {vehicleResult.totalSum}</span>
                    <h4 className="font-playfair text-lg font-bold text-slate-800 mt-2">Vehicle Root Index: {vehicleResult.reducedTotal}</h4>
                    <p className="text-xs text-amber-600 font-mono mt-1">Ruler Planet: {vehicleResult.rulerPlanet}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider ${
                      vehicleResult.suitability === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      vehicleResult.suitability === 'AVOID' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-50 text-slate-600'
                    }`}>{vehicleResult.suitability} SUITABILITY</span>
                  </div>
                </div>

                {/* Score meters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Business Suitability</p>
                    <p className="text-xl font-bold font-mono text-[#1E3A8A] mt-1">{vehicleResult.businessUsageScore}/100</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Travel Luck Rating</p>
                    <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{vehicleResult.travelLuckScore}/100</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold font-bold">Protection Level</p>
                    <p className="text-xl font-bold font-mono text-indigo-600 mt-1">{vehicleResult.protectionEnergyScore}/100</p>
                  </div>
                </div>

                {/* Core meanings & predictions */}
                <div className="space-y-3">
                  <h5 className="font-playfair text-sm font-bold text-[#1E3A8A] flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> Complete Astral Meaning</h5>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">{vehicleResult.meaning}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-playfair text-sm font-bold text-slate-800">Detailed Vehicle Prediction</h5>
                  <p className="text-xs text-slate-500 mt-1">{vehicleResult.prediction}</p>
                  <p className="text-xs text-slate-500 mt-1">{vehicleResult.ownershipAnalysis}</p>
                </div>

                {/* Risk and safety block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500">Accident Risk</span>
                    <p className={`text-xs font-bold mt-0.5 ${vehicleResult.accidentRisk === 'HIGH' ? 'text-rose-600' : 'text-emerald-600'}`}>{vehicleResult.accidentRisk}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500">Theft Vulnerability</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{vehicleResult.theftRisk}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500">Breakdown Probability</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{vehicleResult.mechanicalBreakdownRisk}</p>
                  </div>
                </div>

                {/* Remedies & Elements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                    <strong className="text-rose-800 text-xs flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Vibration Flaws:</strong>
                    <p className="text-xs text-slate-600 mt-1">{vehicleResult.vulnerability}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <strong className="text-emerald-800 text-xs flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Vastu & Puja Remedies:</strong>
                    <p className="text-xs text-slate-600 mt-1">{vehicleResult.remedy}</p>
                  </div>
                </div>

                {/* Lucky details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/30 rounded-2xl p-4 border border-amber-500/10 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#D97706] font-bold">Auspicious Colors</span>
                    <p className="font-bold text-slate-700 mt-0.5">{vehicleResult.luckyColors.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#D97706] font-bold font-bold">Best Service Days</span>
                    <p className="font-bold text-slate-700 mt-0.5">{vehicleResult.luckyServiceDays.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#D97706] font-bold font-bold">First Travel Days</span>
                    <p className="font-bold text-slate-700 mt-0.5">{vehicleResult.luckyTravelDays.join(', ')}</p>
                  </div>
                </div>

                {/* Expandable Why section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowVehicleWhy(!showVehicleWhy)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-4 h-4" /> {showVehicleWhy ? 'Hide' : 'Show'} "Why This Result?" Detailed Logic Breakdown
                  </button>
                  {showVehicleWhy && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border text-xs text-slate-600 space-y-2">
                      <p><strong>Calculations Matrix:</strong> The system sums the alphabetical values of your vehicle plate under classical Chaldean rules (A=1, B=2, R=2 etc.) and adds the numeric sequence to obtain Compound total {vehicleResult.totalSum}. This reduces to Root {vehicleResult.reducedTotal}.</p>
                      <p><strong>Driver Alignment:</strong> Your Driver Number is {vehicleDriver} (governed by traditional rules). Based on the ancient planetary relationships chart, the value {vehicleResult.reducedTotal} is {vehicleResult.suitability === 'EXCELLENT' ? 'ultra-friendly' : vehicleResult.suitability === 'AVOID' ? 'inimical / hostile' : 'neutral'} to your lifestyle energy coordinates.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
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
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Pro Business Firm Name Suite</h3>
              <p className="text-xs text-slate-500 font-sans">Evaluate if your corporate brand name, customer attraction scores, and growth potentials align beautifully with your path.</p>
            </div>

            <form onSubmit={handleBusinessSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Business Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo Occult Enterprises"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Primary Owner's Driver Number</label>
                <select
                  value={businessDriver}
                  onChange={(e) => setBusinessDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all"
              >
                Scan Corporate Vibration
              </button>
            </form>

            {businessResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-3 py-1 rounded-full uppercase">Chaldean Name Value: {businessResult.chaldeanTotal}</span>
                    <h4 className="font-playfair text-lg font-bold text-slate-800 mt-2">Business Expression root: {businessResult.reducedTotal}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-mono">Marketing Energy Level: {businessResult.marketingEnergy}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider ${
                      businessResult.suitability === 'OUTSTANDING' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      businessResult.suitability === 'POOR' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-50 text-slate-600'
                    }`}>{businessResult.suitability} SUITABILITY</span>
                  </div>
                </div>

                {/* Score meters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Brand Strength</p>
                    <p className="text-lg font-bold font-mono text-[#1E3A8A] mt-1">{businessResult.brandStrengthScore}/100</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold font-bold">Customer Loyalty</p>
                    <p className="text-lg font-bold font-mono text-emerald-600 mt-1">{businessResult.customerAttractionScore}/100</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold font-bold">Financial health</p>
                    <p className="text-lg font-bold font-mono text-indigo-600 mt-1">{businessResult.financialStrength}/100</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-center border">
                    <p className="text-[10px] font-mono text-slate-450 uppercase font-bold font-bold">Growth Potential</p>
                    <p className="text-lg font-bold font-mono text-amber-600 mt-1">{businessResult.growthPotential}/100</p>
                  </div>
                </div>

                {/* Core meanings */}
                <div className="space-y-3">
                  <h5 className="font-playfair text-sm font-bold text-[#1E3A8A] flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> Planetary Brand Meaning</h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{businessResult.meaning}</p>
                </div>

                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-2">
                  <p><strong>Auspicious Industries:</strong> {businessResult.industrySuitability}</p>
                  <p className="text-[#D97706]"><strong>Corporate expansion tip:</strong> {businessResult.expansionTip}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-playfair text-sm font-bold text-slate-800">Remedial Corrections</h5>
                  <p className="text-xs text-slate-650 leading-relaxed">{businessResult.suggestedCorrections}</p>
                  <p className="text-xs text-slate-505 leading-relaxed italic">{businessResult.longTermForecast}</p>
                </div>

                {/* Business Remedies */}
                <div className="bg-amber-50/10 p-5 rounded-2xl border border-amber-500/10 text-xs">
                  <h6 className="font-bold text-[#D97706] mb-2 font-mono uppercase">Grandmaster Business Remedies list</h6>
                  <ul className="space-y-2 text-slate-600">
                    {businessResult.businessRemedies.map((r, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expandable Why */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowBusinessWhy(!showBusinessWhy)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-4 h-4" /> {showBusinessWhy ? 'Hide' : 'Show'} "Why This Result?" Detailed Logic Breakdown
                  </button>
                  {showBusinessWhy && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border text-xs text-slate-600 space-y-2">
                      <p><strong>Calculations Matrix:</strong> The system sums your business name letter values under Chaldean rules, resolving to initial sum {businessResult.chaldeanTotal}, reducing to Root {businessResult.reducedTotal}.</p>
                      <p><strong>Owner Synastry:</strong> Your Driver Number is {businessDriver}. In the Indian system, business totals like 5 (Merchant Mercury) or 6 (Venus) are friendly with almost all driver matrices except for Saturn delays under specific sectors.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
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
                        <option key={idx} value={idx}>{p.name} ({p.dob})</option>
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
                  <input
                    type="date"
                    value={sigDob}
                    onChange={(e) => {
                      setSigDob(e.target.value);
                      setSelectedProfileIndex(-1);
                    }}
                    className="w-full bg-white border border-slate-200 text-xs px-4 py-2.5 rounded-xl text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
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
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processSignatureFile(e.target.files[0]);
                      }
                    }}
                  />

                  {sigImage ? (
                    <div className="space-y-2 w-full flex flex-col items-center">
                      {sigFileName?.endsWith('.pdf') ? (
                        <FileText className="w-10 h-10 text-red-500 animate-pulse" />
                      ) : (
                        <img
                          src={sigImage}
                          alt="Signature Preview"
                          className="max-h-24 max-w-full object-contain rounded border shadow-sm p-1 bg-white"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="text-xs font-mono text-slate-600 truncate max-w-[200px]">{sigFileName || 'signature.png'}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSigImage(null);
                          setSigFileName(null);
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
                      <p className="text-[10px] text-slate-400">Accepts JPG, PNG, or PDF signatures (max 10MB)</p>
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
                    <Sparkles className="w-4 h-4 text-amber-300" /> Start AI Signature Audit Pro
                  </>
                )}
              </button>
            </div>

            {/* AUDIT RESULTS DOSSIER */}
            {sigAuditResult ? (
              <div className="bg-white border rounded-3xl p-6 space-y-8 animate-in fade-in duration-500 mt-6" id="signature-dossier-report">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                  <div>
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                      AI Handwriting Vastu Completed
                    </span>
                    <h3 className="font-playfair text-xl font-bold text-[#1E3A8A] mt-2">Personalized Signature Vastu Dossier</h3>
                    <p className="text-xs text-slate-500">Tailored to Driver {getDriverNumber(sigDob)} & Conductor {getConductorNumber(sigDob)} cosmic coordinates.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="py-1.5 px-4 rounded-xl text-xs font-bold border hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Print Report
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
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Auspicious Baby Starting Names Finder</h3>
              <p className="text-xs text-slate-500 font-sans">Generate highly supportive starting name alphabets based on birth drivers, learning styles, and future planetary setups.</p>
            </div>

            <form onSubmit={handleChildSubmit} className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Select Baby's Date of Birth</label>
                <input
                  type="date"
                  required
                  value={childDob}
                  onChange={(e) => setChildDob(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer self-end h-[46px] transition-all"
              >
                Scan DOB
              </button>
            </form>

            {childResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-5 animate-in fade-in duration-500 leading-relaxed font-sans text-xs">
                
                <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-3 py-1 rounded-full uppercase">Computed: Driver {childResult.birthDriver} | Conductor {childResult.birthConductor}</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <strong className="text-emerald-800 text-xs flex items-center gap-1"><Award className="w-4 h-4" /> Recommended Alphabets:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {childResult.startingAlphabets.map((a, idx) => (
                        <span key={idx} className="bg-white border text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold font-mono shadow-sm">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                    <strong className="text-rose-800 text-xs flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Cautionary Alphabets (Avoid):</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {childResult.cautionaryAlphabets.map((a, idx) => (
                        <span key={idx} className="bg-white border text-rose-700 px-2.5 py-1 rounded-lg text-xs font-bold font-mono shadow-sm">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border rounded-2xl space-y-3 leading-relaxed">
                  <p><strong>Destined Career Path:</strong> {childResult.careerPrecedence}</p>
                  <p><strong>Learning Style:</strong> {childResult.learningStyle}</p>
                  <p><strong>Educational Strengths:</strong> {childResult.educationStrength}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <strong className="text-slate-800 text-xs">Creativity Level:</strong>
                    <p className="text-slate-500 mt-1 leading-relaxed">{childResult.creativity}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 text-xs">Communication Tone:</strong>
                    <p className="text-slate-500 mt-1 leading-relaxed">{childResult.communication}</p>
                  </div>
                </div>

                <div className="border-t pt-4 text-xs space-y-2">
                  <p className="font-bold text-[#D97706] uppercase font-mono">Parenting Vastu Guidance:</p>
                  <p className="text-slate-650 leading-relaxed">{childResult.parentingGuidance}</p>
                </div>

                <div className="p-3 bg-amber-50/20 rounded-xl border text-slate-650">
                  <p className="font-bold text-amber-900">Recommended Activities:</p>
                  <p className="text-slate-500 mt-0.5">{childResult.luckyActivities.join(', ')}</p>
                </div>

                {/* Expandable Why */}
                <div className="border-t pt-2">
                  <button
                    onClick={() => setShowChildWhy(!showChildWhy)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Explain baby spelling calculation
                  </button>
                  {showChildWhy && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 space-y-1">
                      <p><strong>Chaldean Vibration:</strong> The recommended alphabets generate letters matching friendly, high-energy planets (like Jupiter for wisdom or Mercury for business) while keeping away from extreme Saturn opposition (8) or sudden delays.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* LUCKY DATES MODULE */}
        {activeModule === 'LUCKY_DATES' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Auspicious Pro Dates Suite</h3>
              <p className="text-xs text-slate-500 font-sans">Find target-specific friendly dates for Business, Marriage, Travel, and property deals matching your birth numbers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Driver Number</label>
                <select
                  value={luckyDatesDriver}
                  onChange={(e) => setLuckyDatesDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Conductor Number</label>
                <select
                  value={luckyDatesConductor}
                  onChange={(e) => setLuckyDatesConductor(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Conductor {n}</option>)}
                </select>
              </div>
              <button
                onClick={handleLuckyDatesTrigger}
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all"
              >
                Find Target Specific Dates
              </button>
            </div>

            {luckySuiteResult && (
              <div className="p-6 md:p-8 bg-white border rounded-3xl space-y-6 animate-in fade-in duration-500 leading-relaxed font-sans text-xs">
                
                <h4 className="font-playfair text-sm uppercase font-mono text-[#D97706] tracking-wider font-bold">Auspicious Dates Breakdown Analysis</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
                    <span className="font-bold text-slate-750 font-mono text-[11px] uppercase text-emerald-800">Best Business Launch Dates</span>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{luckySuiteResult.businessDates.map(d=>`${d}th`).join(', ')}</p>
                  </div>

                  <div className="p-3 bg-red-50/20 rounded-xl border border-rose-100">
                    <span className="font-bold text-slate-750 font-mono text-[11px] uppercase text-[#D97706]">Auspicious Marriage Dates</span>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{luckySuiteResult.marriageDates.map(d=>`${d}th`).join(', ')}</p>
                  </div>

                  <div className="p-3 bg-blue-50/20 rounded-xl border border-blue-100">
                    <span className="font-bold text-slate-750 font-mono text-[11px] uppercase text-blue-700">Best Travel Venture Dates</span>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{luckySuiteResult.travelDates.map(d=>`${d}th`).join(', ')}</p>
                  </div>

                  <div className="p-3 bg-amber-50/20 rounded-xl border border-amber-150">
                    <span className="font-bold text-slate-755 font-mono text-[11px] uppercase text-amber-800">Financial Investments Dates</span>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{luckySuiteResult.investmentDates.map(d=>`${d}th`).join(', ')}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border">
                    <span className="font-bold text-slate-750 font-mono text-[11px] uppercase">Property Registration Dates</span>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{luckySuiteResult.propertyDates.map(d=>`${d}th`).join(', ')}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100">
                    <span className="font-bold text-slate-750 font-mono text-[11px] uppercase text-indigo-700">Exams & Job Interviews Dates</span>
                    <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{luckySuiteResult.interviewDates.map(d=>`${d}th`).join(', ')}</p>
                  </div>

                </div>

                <p className="text-[11px] text-slate-500 italic pt-2">These dates represent peak matching parameters of Driver {luckyDatesDriver} and Conductor {luckyDatesConductor}. They bypass the hostile Saturn and Rahu numbers to prevent blocks during launch periods.</p>

                {/* Expandable Why */}
                <div className="border-t pt-2">
                  <button
                    onClick={() => setShowDatesWhy(!showDatesWhy)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Explain dates selection logic
                  </button>
                  {showDatesWhy && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 space-y-1">
                      <p><strong>Friendly Reductions:</strong> Each date is filtered mathematically so that its reduced root number matches your friendly planetary rulers (e.g. 1, 3, 5, 6) while strictly weeding out obstructive or inimical totals to guarantee maximum smooth transit protection.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
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
                  <input
                    type="date"
                    required
                    value={medicalDob}
                    onChange={(e) => setMedicalDob(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
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
                  <input
                    type="date"
                    required
                    value={vaastuDob}
                    onChange={(e) => setVaastuDob(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
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
                  <input
                    type="date"
                    required
                    value={dashaDob}
                    onChange={(e) => setDashaDob(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans focus:outline-none"
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
