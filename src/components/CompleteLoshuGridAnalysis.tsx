import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  computeLoshuAnalysis, 
  performLoshuCompatibility, 
  LoshuAnalysisResult, 
  LoshuGridBox, 
  CompatibilityAnalysisResult,
  calculateLoShuGrid
} from '../services/loshuEngine';
import {
  computeLoshuMasterReport,
  LoshuMasterReport,
  CombinationResult,
  ArrowMasterResult
} from '../services/loshuMasterEngine';
import { generateCompleteNumerologyProfile } from '../core';
import { CompleteNumerologyProfile } from '../core/types';
import { MANDATORY_WELLNESS_DISCLAIMER } from '../core/methodology';
import { KarmicVedicAnalysisView } from './KarmicVedicAnalysisView';
import { DateInput } from './DateInput';
import { BrandLogo } from './BrandLogo';
import { formatDateIndian } from '../utils/dateUtils';
import { formatLocalizedDateTime } from '../utils/localeUtils';
import { useLanguage } from '../i18n';
import { 
  Calendar, User, Compass, HelpCircle, Sparkles, RefreshCw, Star, 
  Trash2, Heart, Shield, BookOpen, Layers, Award, FileText, Download, 
  Check, AlertCircle, Eye, Info, ShieldCheck, ArrowRight, CheckCircle, Flame, Droplet, Trees, Hammer, Landmark, Printer, Phone, TrendingUp, Activity
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PLANETARY_REPETITION_MEANINGS: Record<number, Record<number, string>> = {
  1: {
    2: "2 बार 1 (सूर्य): संतुलित बातचीत, प्रभावशाली और आत्मविश्वास से भरी वाणी। आप अपनी बात बहुत स्पष्टता और कूटनीति के साथ रखते हैं।",
    3: "3 बार 1 (सूर्य): बहुत ज्यादा बोलने की आदत। कभी-कभी बिना सोचे बोल देना या अत्यधिक भावुक होकर अपनी बात रखना।",
    4: "4 बार 1 (सूर्य): अत्यधिक अहंकार (Ego) और जिद्दी स्वभाव। दूसरों की बात सुनने और सार्वजनिक मामलों में समझौता करने में कठिनाई।"
  },
  2: {
    2: "2 बार 2 (चंद्रमा): गहरी अंतर्दृष्टि (Intuition) और संवेदनशीलता। कलात्मक समझ अच्छी होती है, पर कभी-कभी मूड स्विंग्स हो सकते हैं।",
    3: "3 बार 2 (चंद्रमा): अत्यधिक भावनात्मक संवेदनशीलता। छोटी-छोटी बातों को दिल पर लगाना और मन में बेचैनी रहना।",
    4: "4 बार 2 (चंद्रमा): तीव्र मानसिक तनाव, अत्यधिक चिंता (Anxiety) और रिश्तों में भावनात्मक अस्थिरता।"
  },
  3: {
    2: "2 बार 3 (गुरु): उत्कृष्ट बुद्धिमत्ता, रचनात्मक सोच और बेहतरीन योजना बनाने की क्षमता। ज्ञान का अच्छा उपयोग करते हैं।",
    3: "3 बार 3 (गुरु): अत्यधिक सैद्धांतिक सोच। व्यावहारिक दुनिया से थोड़ा कटाव और जरूरत से ज्यादा उपदेशात्मक होना।",
    4: "4 बार 3 (गुरु): बौद्धिक अहंकार। दूसरों की अच्छी सलाह भी न मानना और काम को बीच में छोड़ बार-बार नई शुरुआत करना।"
  },
  4: {
    2: "2 बार 4 (राहु): बारीक से बारीक डिटेल पर ध्यान देने वाला, व्यावहारिक और अत्यधिक व्यवस्थित योजनाकार।",
    3: "3 बार 4 (राहु): अत्यधिक काम का दबाव (Workaholic)। व्यक्तिगत आराम और सामाजिक खुशियों की कमी महसूस होना।",
    4: "4 बार 4 (राहु): अत्यधिक जिद्दीपन, अप्रत्याशित स्वभाव और नियमों व प्रशासनिक मामलों में बार-बार टकराव।"
  },
  5: {
    2: "2 बार 5 (बुध): मजबूत व्यापारिक समझ, त्वरित निर्णय क्षमता और नेटवर्किंग व व्यापार में शानदार सफलता।",
    3: "3 बार 5 (बुध): जोखिम भरे आर्थिक फैसले, अनियंत्रित खर्चे और जीवनशैली में अत्यधिक बेचैनी व भटकाव।",
    4: "4 बार 5 (बुध): मानसिक थकान, सट्टेबाजी/शेयर में जल्दबाजी से नुकसान और अत्यधिक चंचलता व वाणी में अस्थिरता।"
  },
  6: {
    2: "2 बार 6 (शुक्र): बेहतरीन कलात्मक रुचि, परिवार के प्रति गहरा समर्पण और सुख-सुविधाओं की मजबूत चाह।",
    3: "3 बार 6 (शुक्र): घरेलू जिम्मेदारियों या लग्जरी के चक्कर में भारी तनाव और अनावश्यक खर्चों का बोझ।",
    4: "4 बार 6 (शुक्र): अत्यधिक भोग-विलास, रिश्तों में असंतुलन और पारिवारिक मामलों में दूरी या तनाव।"
  },
  7: {
    2: "2 बार 7 (केतु): गहरा विश्लेषणात्मक व खोजी दिमाग, लेकिन निकटतम लोगों या साझेदारों से धोखे का जोखिम।",
    3: "3 बार 7 (केतु): करियर या रिश्तों में बड़े भावनात्मक झटके, जो आगे चलकर गहरे आध्यात्मिक परिवर्तन का कारण बनते हैं।",
    4: "4 बार 7 (केतु): दुनिया से अत्यधिक अलगाव, एकांतप्रियता और दूसरों पर बिल्कुल भी भरोसा न करने की प्रवृत्ति।"
  },
  8: {
    2: "2 बार 8 (शनि): मजबूत संगठन क्षमता और लगन, लेकिन कार्यों में देरी और जीवन में भारी जिम्मेदारियों का बोझ।",
    3: "3 बार 8 (शनि): आर्थिक व करियर में भारी उतार-चढ़ाव। कभी अचानक बड़ी सफलता तो कभी अचानक रुकावटें।",
    4: "4 बार 8 (शनि): अत्यंत संघर्षपूर्ण मार्ग, कानूनी या संपत्ति के मामलों में देरी और देर से मिलने वाली सफलता।"
  },
  9: {
    2: "2 बार 9 (मंगल): अत्यधिक ऊर्जावान, प्रतिस्पर्धी स्वभाव, त्वरित शारीरिक और मानसिक सजगता।",
    3: "3 बार 9 (मंगल): तेज गुस्सा, अधीरता और जल्दबाजी में चोट या शारीरिक थकान का जोखिम।",
    4: "4 बार 9 (मंगल): अत्यधिक आक्रामकता, बिना सोचे-समझे कदम उठाना और उच्च अधिकारियों या परिजनों से सीधा टकराव।"
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

interface CompleteLoshuGridAnalysisProps {
  initialProfile?: { name: string; dob: string; gender: string } | null;
}

export const CompleteLoshuGridAnalysis: React.FC<CompleteLoshuGridAnalysisProps> = ({ initialProfile }) => {
  const { language } = useLanguage();
  // Main states
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [analysisResult, setAnalysisResult] = useState<LoshuAnalysisResult | null>(null);
  const [masterReport, setMasterReport] = useState<LoshuMasterReport | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [calcDob, setCalcDob] = useState('');
  
  // Tab control inside Loshu Analysis
  const [activeSubTab, setActiveSubTab] = useState<'MASTER_CONSULTATION' | 'KARMIC_VEDIC' | 'GRID' | 'PLANES' | 'REMEDIES' | 'PERIODS' | 'COMPATIBILITY' | 'AI_REPORT' | 'HISTORY'>('MASTER_CONSULTATION');
  const [completeProfile, setCompleteProfile] = useState<CompleteNumerologyProfile | null>(null);
  
  // History list
  const [history, setHistory] = useState<{ id: string; name: string; dob: string; date: string }[]>([]);
  
  // Compatibility subform
  const [partnerName, setPartnerName] = useState('');
  const [partnerDob, setPartnerDob] = useState('');
  const [partnerResult, setPartnerResult] = useState<CompatibilityAnalysisResult | null>(null);
  
  // AI report states
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState('');
  const [showRawJSON, setShowRawJSON] = useState(false);

  // Selected Grid box for interactive detail drawer
  const [selectedBoxDigit, setSelectedBoxDigit] = useState<number | null>(5);

  // Load history & initial profile values on mount
  useEffect(() => {
    const saved = localStorage.getItem('leo_loshu_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    if (initialProfile?.dob) {
      setName(initialProfile.name);
      setDob(initialProfile.dob);
      setGender(initialProfile.gender || 'MALE');
      
      const analysis = computeLoshuAnalysis(initialProfile.dob, initialProfile.name, initialProfile.gender);
      setAnalysisResult(analysis);

      // Consume from the unified Core Engine
      const profile = generateCompleteNumerologyProfile({
        dob: initialProfile.dob,
        name: initialProfile.name,
        mobile: mobileNumber,
        gender: (initialProfile.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE'
      });
      setCompleteProfile(profile);
      const master = computeLoshuMasterReport(initialProfile.dob, initialProfile.name, (initialProfile.gender as 'MALE' | 'FEMALE') || 'MALE', mobileNumber);
      setMasterReport(master);
    }
  }, [initialProfile]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    
    const finalName = name.trim() || 'Fate seeker';
    const analysis = computeLoshuAnalysis(dob, finalName, gender as 'MALE' | 'FEMALE');
    setAnalysisResult(analysis);

    // Consume from the unified Core Engine
    const profile = generateCompleteNumerologyProfile({
      dob,
      name: finalName,
      mobile: mobileNumber,
      gender: gender as 'MALE' | 'FEMALE'
    });
    setCompleteProfile(profile);
    const master = computeLoshuMasterReport(dob, finalName, gender as 'MALE' | 'FEMALE', mobileNumber);
    setMasterReport(master);
    
    // Save to history list
    const newHistoryItem = {
      id: Date.now().toString(),
      name: finalName,
      dob,
      date: formatLocalizedDateTime(new Date(), language)
    };
    
    const updatedHistory = [newHistoryItem, ...history.filter(h => h.dob !== dob)].slice(0, 8);
    setHistory(updatedHistory);
    localStorage.setItem('leo_loshu_history', JSON.stringify(updatedHistory));
    
    // Reset secondary operations
    setPartnerResult(null);
    setPartnerName('');
    setPartnerDob('');
    setAiReport('');
    setSelectedBoxDigit(5); // default center
  };

  const handleLoadHistoryItem = (item: { name: string; dob: string }) => {
    setName(item.name);
    setDob(item.dob);
    const analysis = computeLoshuAnalysis(item.dob, item.name, gender as 'MALE' | 'FEMALE');
    setAnalysisResult(analysis);
    
    // Consume from the unified Core Engine
    const profile = generateCompleteNumerologyProfile({
      dob: item.dob,
      name: item.name,
      mobile: mobileNumber,
      gender: gender as 'MALE' | 'FEMALE'
    });
    const master = computeLoshuMasterReport(item.dob, item.name, gender as 'MALE' | 'FEMALE', mobileNumber);
    setMasterReport(master);

    setPartnerResult(null);
    setAiReport('');
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('leo_loshu_history', JSON.stringify(updated));
  };

  const handleCalculateCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisResult || !partnerDob) return;
    
    const pResult = performLoshuCompatibility(
      analysisResult.personalDetails.dob,
      analysisResult.personalDetails.name,
      partnerDob,
      partnerName || 'Partner'
    );
    setPartnerResult(pResult);
  };

  const handleGenerateAIReport = async () => {
    if (!analysisResult) return;
    setLoadingReport(true);
    setReportError('');
    setAiReport('');
    
    try {
      const response = await fetch('/api/loshu-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalDetails: analysisResult.personalDetails,
          mulank: analysisResult.mulank,
          bhagyank: analysisResult.bhagyank,
          loshuGrid: analysisResult.loshuGrid,
          missingNumbers: analysisResult.missingNumbers,
          strengthArrows: analysisResult.strengthArrows,
          weaknessArrows: analysisResult.weaknessArrows,
          personalYear: analysisResult.personalYear,
          currentMahadasha: analysisResult.currentMahadasha,
          currentAntardasha: analysisResult.currentAntardasha
        })
      });
      
      const data = await response.json();
      if (data.report) {
        setAiReport(data.report);
      } else {
        setReportError(data.error || 'आकाशीय विसंगति: रिपोर्ट जनरेट नहीं हो सकी।');
      }
    } catch (e) {
      console.error(e);
      setReportError('सर्वर से संपर्क विफल रहा। कृपया आवश्यक सेटिंग्स में अपनी GEMINI_API_KEY जांचें।');
    } finally {
      setLoadingReport(false);
    }
  };

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  // Grid background colors by element
  const getBoxElementStyle = (element: string, count: number) => {
    if (count === 0) return 'bg-[#FDFCF7]/40 text-[#CBD5E1] border-slate-200 border-dashed';
    
    switch (element.toLowerCase()) {
      case 'water':
        return 'bg-blue-50/90 text-blue-800 border-blue-200 shadow-md shadow-blue-50';
      case 'wood':
        return 'bg-emerald-50/90 text-emerald-800 border-emerald-200 shadow-md shadow-emerald-50';
      case 'earth':
        return 'bg-amber-50/90 text-amber-800 border-amber-200 shadow-md shadow-amber-50';
      case 'metal':
        return 'bg-slate-100/90 text-slate-800 border-slate-300 shadow-md shadow-slate-100';
      case 'fire':
        return 'bg-red-50/90 text-red-800 border-red-200 shadow-md shadow-red-50';
      default:
        return 'bg-white text-slate-800 border-[#E5E7EB]';
    }
  };

  const getElementBadge = (element: string) => {
    switch (element.toLowerCase()) {
      case 'water': return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold"><Droplet className="w-2.5 h-2.5" /> Water (जल)</span>;
      case 'wood': return <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold"><Trees className="w-2.5 h-2.5" /> Wood (काष्ठ)</span>;
      case 'earth': return <span className="flex items-center gap-1 bg-amber-100 text-[#B45309] px-2 py-0.5 rounded text-[10px] font-bold"><Landmark className="w-2.5 h-2.5" /> Earth (भूमि)</span>;
      case 'metal': return <span className="flex items-center gap-1 bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold"><Hammer className="w-2.5 h-2.5" /> Metal (धातु)</span>;
      case 'fire': return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold"><Flame className="w-2.5 h-2.5" /> Fire (अग्नि)</span>;
      default: return null;
    }
  };

  // Order of standard Loshu representation: Row 1 (4,9,2), Row 2 (3,5,7), Row 3 (8,1,6)
  const loshuGridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  return (
    <div id="complete-loshu-portal" className="space-y-10 text-left print:p-0">
      
      {/* SECTION 1: HEADER SECTION */}
      <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden bg-gradient-to-r from-white via-[#FDFCF7] to-[#FDFCF7] print:border-none print:shadow-none print:bg-none">
        <div className="absolute top-0 right-0 w-[180px] h-[180px] opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#D97706] rotate-12">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="36.6" x2="90" y2="36.6" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="63.3" x2="90" y2="63.3" stroke="currentColor" strokeWidth="1" />
            <line x1="36.6" y1="10" x2="36.6" y2="90" stroke="currentColor" strokeWidth="1" />
            <line x1="63.3" y1="10" x2="63.3" y2="90" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" />
            <div className="inline-flex items-center gap-1.5 bg-[#D97706]/10 text-[#D97706] px-3.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border border-[#D97706]/20">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" /> सम्पूर्ण Lo Shu Magic Grid विश्लेषण
            </div>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-[#1F2937] tracking-wider uppercase leading-tight">
            Complete Lo Shu Grid विश्लेषण एवं सिद्ध उपाय
          </h2>
          <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed font-lora italic pt-1">
            अपनी जन्म तारीख को प्राचीन 3x3 Lo Shu Magic Square पर देखें। मूलांक (Driver), भाग्यांक (Conductor), स्ट्रेंथ और वीकनेस Planes, महादशा चक्र और लाल किताब के प्रभावी उपाय जानें।
          </p>
        </div>

        <button 
          onClick={handlePrint}
          className="bg-[#1F2937] hover:bg-[#111827] text-white px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 cursor-pointer border border-[#E5E7EB]/10 border-t-white/10"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* SECTION 2: STANDALONE DATE OF BIRTH LOGIC PANEL */}
      <div className="glass-panel p-8 md:p-10 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm relative overflow-hidden border-l-4 border-l-[#D97706] print:hidden">
        <div className="absolute top-1/2 right-12 text-5xl opacity-5 pointer-events-none select-none font-serif">☯️</div>
        
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-widest font-bold">व्यक्ति का पूरा नाम (Full Name)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. राहुल शर्मा"
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] focus:bg-white transition-all rounded-2xl pl-12 pr-5 py-4 outline-none text-sm text-[#1F2937] font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase text-[#D97706] tracking-widest font-bold">जन्म तारीख चुनें (Date of Birth)</label>
            <DateInput
              id="loshu-dob-input"
              value={dob}
              onChange={setDob}
              required
              className="py-4 text-sm font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-4 rounded-2xl transition duration-300 text-xs tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-white hover:rotate-12 transition-transform" /> Lo Shu Grid देखें (Analyze)
          </button>
        </form>

        {/* Quick history selector */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-[#E5E7EB]">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">हालिया रिकॉर्ड्स (History): </span>
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => handleLoadHistoryItem(h)}
                className="inline-flex items-center gap-1.5 bg-[#F8F4EF] hover:bg-[#F2E8DC] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer border border-[#E5E7EB]/60 group text-[#1F2937]"
              >
                <span>{h.name} ({formatDateIndian(h.dob)})</span>
                <button
                  onClick={(e) => handleDeleteHistoryItem(h.id, e)}
                  className="p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                  title="Remove from logs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {analysisResult ? (
        <div className="space-y-10 animate-in fade-in duration-500">
          
          {/* SECTION 3: KEY METRICS ROW (MULANK & BHAGYANK CARDS) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            
            {/* Mulank (Driver) Card */}
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm flex flex-col justify-between gap-4 border-t-4 border-t-[#D97706]"
            >
              <div className="flex items-start justify-between w-full gap-4">
                <div className="space-y-2 text-left">
                  <span className="text-[9px] font-mono uppercase bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 px-2.5 py-0.5 rounded-full font-bold">मूलांक (Driver / Psychic Number)</span>
                  <h3 className="font-playfair text-2xl font-black text-[#1F2937]">मूलांक #{analysisResult.mulank}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                    यह आपके व्यक्तित्व, स्वाभाविक प्रतिभा और तात्कालिक निर्णय लेने की शैली को दर्शाता है।
                  </p>
                </div>
                <div className="w-16 h-16 shrink-0 rounded-full bg-[#FDFCF7] border-2 border-[#D97706]/20 text-[#D97706] font-playfair font-black text-3xl flex items-center justify-center shadow-inner">
                  {analysisResult.mulank}
                </div>
              </div>
              {analysisResult.chaldeanMulank && (
                <div className="pt-3 border-t border-slate-100 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#D97706] font-bold">
                    <span>Chaldean Rank #{analysisResult.chaldeanMulank.compound}</span>
                    <span>•</span>
                    <span>{analysisResult.chaldeanMulank.ruler}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800">{analysisResult.chaldeanMulank.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    {analysisResult.chaldeanMulank.description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Bhagyank (Conductor) Card */}
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm flex flex-col justify-between gap-4 border-t-4 border-t-[#1E3A8A]"
            >
              <div className="flex items-start justify-between w-full gap-4">
                <div className="space-y-2 text-left">
                  <span className="text-[9px] font-mono uppercase bg-blue-50 text-[#1E3A8A] border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">भाग्यांक (Conductor / Destiny Number)</span>
                  <h3 className="font-playfair text-2xl font-black text-[#1F2937]">भाग्यांक #{analysisResult.bhagyank}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                    यह आपके जीवन का मुख्य उद्देश्य, करियर की दिशा और भाग्य का समग्र प्रवाह निर्धारित करता है।
                  </p>
                </div>
                <div className="w-16 h-16 shrink-0 rounded-full bg-blue-50/50 border-2 border-blue-200 text-[#1E3A8A] font-playfair font-black text-3xl flex items-center justify-center shadow-inner">
                  {analysisResult.bhagyank}
                </div>
              </div>
              {analysisResult.chaldeanBhagyank && (
                <div className="pt-3 border-t border-slate-100 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#1E3A8A] font-bold">
                    <span>Chaldean Rank #{analysisResult.chaldeanBhagyank.compound}</span>
                    <span>•</span>
                    <span>{analysisResult.chaldeanBhagyank.ruler}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800">{analysisResult.chaldeanBhagyank.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    {analysisResult.chaldeanBhagyank.description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Personal Year Card */}
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm flex items-center justify-between gap-6 border-t-4 border-t-emerald-600"
            >
              <div className="space-y-2 text-left">
                <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">वर्तमान व्यक्तिगत वर्ष (Active Year)</span>
                <h3 className="font-playfair text-2xl font-black text-[#1F2937]">व्यक्तिगत वर्ष #{analysisResult.personalYear.number}</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                  वर्तमान वर्ष का प्रभाव: {analysisResult.personalYear.title.split(':')[0]}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-playfair font-black text-3xl flex items-center justify-center shadow-inner">
                {analysisResult.personalYear.number}
              </div>
            </motion.div>

          </motion.div>

          {/* SECTION 4: SUBTAB MENU */}
          <div className="border-b border-[#E5E7EB] pt-2 flex flex-wrap gap-2 print:hidden">
            {[
              { id: 'MASTER_CONSULTATION', label: 'Master Consultation 🏆' },
              { id: 'KARMIC_VEDIC', label: 'Vedic Grid & 81 Yogas ☸️' },
              { id: 'GRID', label: 'Lo Shu Grid (3x3) 🔢' },
              { id: 'PLANES', label: 'Planes & Arrows (राजयोग) ⚡' },
              { id: 'REMEDIES', label: 'लाल किताब एवं वास्तु उपाय 🛡️' },
              { id: 'PERIODS', label: 'महादशा एवं जीवन चक्र ⏳' },
              { id: 'COMPATIBILITY', label: 'Grid Compatibility (मिलान) ❤️' },
              { id: 'AI_REPORT', label: 'Astro-Guru AI रिपोर्ट 🔮' },
              { id: 'HISTORY', label: 'Developer JSON डेटा 📋' }
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => {
                  setActiveSubTab(subTab.id as any);
                  setPartnerResult(null); // Clear compatibility result on tab switch
                }}
                className={`px-5 py-3.5 rounded-t-2xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === subTab.id
                    ? 'bg-white border-x border-t border-[#E5E7EB] text-[#D97706] shadow-sm -mb-px z-10'
                    : 'text-[#6B7280] hover:text-[#1F2937] bg-transparent'
                }`}
              >
                {subTab.id === 'MASTER_CONSULTATION' && <Award className="w-4 h-4 text-[#D97706] animate-pulse" />}
                {subTab.id === 'KARMIC_VEDIC' && <Sparkles className="w-4 h-4 text-[#D97706] animate-spin-slow" />}
                {subTab.id === 'GRID' && <Compass className="w-4 h-4" />}
                {subTab.id === 'PLANES' && <Layers className="w-4 h-4" />}
                {subTab.id === 'REMEDIES' && <Shield className="w-4 h-4" />}
                {subTab.id === 'PERIODS' && <Star className="w-4 h-4 animate-pulse text-[#D97706]" />}
                {subTab.id === 'COMPATIBILITY' && <Heart className="w-4 h-4" />}
                {subTab.id === 'AI_REPORT' && <Sparkles className="w-4 h-4 text-amber-500" />}
                {subTab.id === 'HISTORY' && <FileText className="w-4 h-4" />}
                <span>{subTab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB AREA STAGE */}

          {/* TAB 0: MASTER CONSULTATION SYSTEM 5.0 */}
          {activeSubTab === 'MASTER_CONSULTATION' && masterReport && (
            <div className="space-y-12 animate-in fade-in duration-500 text-left print:p-0">
              
              {/* Premium Consultation Overview Banner */}
              <div className="bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#030712] text-white p-8 md:p-10 rounded-[40px] border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
                      ★ LEOFAMILY सम्पूर्ण Lo Shu ग्रिड महा-परामर्श v5.0
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
                      ● संपूर्ण विश्लेषण सक्रिय
                    </span>
                  </div>
                  <h3 className="font-cinzel text-3xl md:text-5xl font-black tracking-widest text-[#FDFCF7] uppercase leading-tight">
                    सम्पूर्ण Lo Shu ग्रिड एवं अंकज्योतिष महा-परामर्श
                  </h3>
                  <p className="text-slate-300 text-xs md:text-sm font-lora italic leading-relaxed max-w-3xl pt-1">
                    आपके संपूर्ण Lo Shu Grid, वैदिक मूलांक-भाग्यांक, ग्रह प्रभाव और 19 मुख्य जीवन आयामों का विस्तृत भारतीय अंकज्योतिष विश्लेषण, जिसमें लाल किताब सिद्ध उपाय भी सम्मिलित हैं।
                  </p>
                  
                  {/* Dynamic Subject Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">परामर्श जातक</span>
                      <p className="text-sm font-bold text-white font-sans">{masterReport.personal.name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">मूलांक (Driver)</span>
                      <p className="text-sm font-bold text-[#F59E0B] font-sans"># {masterReport.personal.driver} (मूलांक)</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">भाग्यांक (Conductor / Destiny)</span>
                      <p className="text-sm font-bold text-blue-400 font-sans"># {masterReport.personal.conductor} (भाग्यांक)</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">प्रधान व्यक्तित्व स्वरूप</span>
                      <p className="text-sm font-bold text-emerald-400 font-sans">{masterReport.archetype.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK NAV BAR */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-3xl flex flex-wrap gap-2 text-xs font-semibold text-slate-700 print:hidden items-center">
                <span className="font-mono text-[10px] uppercase text-[#D97706] px-2 font-bold select-none">त्वरित नेविगेशन (Quick Jump):</span>
                <a href="#master-sec-scores" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition">1. मुख्य स्कोर</a>
                <a href="#master-sec-grid" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition">2. संपूर्ण ग्रिड</a>
                <a href="#master-sec-combs" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition">3. 81 युति योग</a>
                <a href="#master-sec-profile" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition">4. व्यक्तित्व प्रोफाइल</a>
                <a href="#master-sec-relations" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition" onClick={(e) => { e.preventDefault(); document.getElementById('master-sec-relations')?.scrollIntoView({ behavior: 'smooth' }); }}>5. प्रेम व परिवार</a>
                <a href="#master-sec-wealth" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition" onClick={(e) => { e.preventDefault(); document.getElementById('master-sec-wealth')?.scrollIntoView({ behavior: 'smooth' }); }}>6. धन व करियर</a>
                <a href="#master-sec-karmic" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition" onClick={(e) => { e.preventDefault(); document.getElementById('master-sec-karmic')?.scrollIntoView({ behavior: 'smooth' }); }}>7. कार्मिक सीख</a>
                <a href="#master-sec-fusions" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition" onClick={(e) => { e.preventDefault(); document.getElementById('master-sec-fusions')?.scrollIntoView({ behavior: 'smooth' }); }}>8. मोबाइल व वास्तु</a>
                <a href="#master-sec-health" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition" onClick={(e) => { e.preventDefault(); document.getElementById('master-sec-health')?.scrollIntoView({ behavior: 'smooth' }); }}>9. स्वास्थ्य व वर्षफल</a>
                <a href="#master-sec-remedies" className="hover:text-[#D97706] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl transition" onClick={(e) => { e.preventDefault(); document.getElementById('master-sec-remedies')?.scrollIntoView({ behavior: 'smooth' }); }}>10. सिद्ध उपाय</a>
              </div>

              {/* SECTION 1: LOSHU SUMMARY DASHBOARD */}
              <div id="master-sec-scores" className="space-y-6 scroll-mt-6">
                <div className="flex gap-2.5 items-center pb-2 border-b border-[#E5E7EB]">
                  <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-mono font-bold text-xs">01</span>
                  <h4 className="font-cinzel text-xl font-bold text-slate-800 uppercase tracking-widest">Lo Shu ग्रिड मुख्य सारांश (Summary Dashboard)</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries({
                    "मानसिक शक्ति स्कोर (Mental Strength)": { val: masterReport.scores.mentalStrength, field: 'mentalStrength', c: 'border-t-purple-600 bg-purple-50/10' },
                    "भावनात्मक शक्ति स्कोर (Emotional Strength)": { val: masterReport.scores.emotionalStrength, field: 'emotionalStrength', c: 'border-t-rose-600 bg-rose-50/10' },
                    "व्यावहारिक शक्ति स्कोर (Practical Strength)": { val: masterReport.scores.practicalStrength, field: 'practicalStrength', c: 'border-t-indigo-600 bg-indigo-50/10' },
                    "नेतृत्व क्षमता (Leadership Score)": { val: masterReport.scores.leadershipScore, field: 'leadershipScore', c: 'border-t-amber-600 bg-amber-50/10' },
                    "संवाद व वाणी स्कोर (Communication Score)": { val: masterReport.scores.communicationScore, field: 'communicationScore', c: 'border-t-teal-600 bg-teal-50/10' },
                    "आध्यात्मिक स्कोर (Spiritual Score)": { val: masterReport.scores.spiritualScore, field: 'spiritualScore', c: 'border-t-violet-600 bg-violet-50/10' },
                    "संबंध व प्रेम स्कोर (Relationship Score)": { val: masterReport.scores.relationshipScore, field: 'relationshipScore', c: 'border-t-pink-600 bg-pink-50/10' },
                    "करियर संभावना स्कोर (Career Potential)": { val: masterReport.scores.careerPotentialScore, field: 'careerPotentialScore', c: 'border-t-blue-600 bg-blue-50/10' },
                    "कुल Lo Shu संतुलन स्कोर (Overall Score)": { val: masterReport.scores.overallLoshuScore, field: 'overallLoshuScore', c: 'border-t-[#D97706] bg-amber-50/20' }
                  }).map(([title, item]) => (
                    <div key={title} className={`p-6 rounded-[30px] border border-slate-200 shadow-sm border-t-4 flex flex-col justify-between gap-4 ${item.c}`}>
                      <div className="space-y-1.5 text-left">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">{title}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-playfair font-black text-slate-800">{item.val}</span>
                          <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                        </div>
                      </div>
                      
                      {/* Visual score bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-current h-2 rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${item.val}%`, 
                            color: item.field === 'overallLoshuScore' ? '#D97706' : '#4B5563' 
                          }} 
                        />
                      </div>
                      
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans mt-1">
                        {masterReport.scores.reasons[item.field]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: COMPLETE GRID ANALYSIS */}
              <div id="master-sec-grid" className="glass-panel p-8 md:p-10 rounded-[40px] bg-white border border-[#E5E7EB] shadow-sm space-y-8 scroll-mt-6">
                <div className="flex gap-2.5 items-center pb-2 border-b border-[#E5E7EB]">
                  <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-mono font-bold text-xs">02</span>
                  <h4 className="font-cinzel text-xl font-bold text-slate-800 uppercase tracking-widest">Lo Shu ग्रिड संपूर्ण विवरण (Grid Parameters)</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Specs List */}
                  <div className="space-y-6 text-left text-xs leading-relaxed text-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">मौजूद नंबर (Present Numbers)</span>
                        <p className="text-lg font-black text-slate-800 mt-1">{masterReport.gridAnalysis.present.join(', ') || 'कोई नहीं'}</p>
                        <p className="text-[10px] text-slate-400">जन्म तारीख में मौजूद मुख्य ऊर्जा तत्व।</p>
                      </div>
                      <div className="p-4 bg-red-50/30 border border-red-200/50 rounded-2xl">
                        <span className="text-[10px] font-mono text-red-600 uppercase tracking-wider block font-bold">अनुपस्थित नंबर (Missing Numbers)</span>
                        <p className="text-lg font-black text-red-800 mt-1">{masterReport.gridAnalysis.missing.join(', ') || 'कोई नहीं'}</p>
                        <p className="text-[10px] text-slate-400">जिन नंबरों के लिए उपाय और संतुलन आवश्यक है।</p>
                      </div>
                    </div>

                    {/* Explanatory note when Driver or Destiny added numbers that were physically absent in DOB */}
                    {(() => {
                      const addedNotes: string[] = [];
                      if (analysisResult.loshuGrid[analysisResult.bhagyank]?.isDestinyLayer && analysisResult.loshuGrid[analysisResult.bhagyank]?.count === 0) {
                        addedNotes.push(`${analysisResult.bhagyank} जन्म तारीख में मौजूद नहीं था, लेकिन आपका Bhagyank ${analysisResult.bhagyank} होने के कारण LeoFamily Enhanced Grid में इसे Destiny Layer के रूप में जोड़ा गया है। इसलिए ${analysisResult.bhagyank} को Enhanced Grid में Missing Number नहीं माना गया है।`);
                      }
                      if (analysisResult.loshuGrid[analysisResult.mulank]?.isDriverLayer && analysisResult.loshuGrid[analysisResult.mulank]?.count === 0 && analysisResult.mulank !== analysisResult.bhagyank) {
                        addedNotes.push(`${analysisResult.mulank} जन्म तारीख में मौजूद नहीं था, लेकिन आपका Mulank ${analysisResult.mulank} होने के कारण LeoFamily Enhanced Grid में इसे Driver Layer के रूप में जोड़ा गया है। इसलिए ${analysisResult.mulank} को Enhanced Grid में Missing Number नहीं माना गया है।`);
                      }
                      if (addedNotes.length === 0) return null;
                      return (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-[11px] text-amber-900 leading-relaxed space-y-1">
                          <span className="font-bold text-[#D97706] block text-[10px] font-mono uppercase tracking-wider">LeoFamily Grid Layering विवरण</span>
                          {addedNotes.map((note, idx) => (
                            <p key={idx}>{note}</p>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="p-5 bg-[#FBD784]/10 border border-[#D97706]/10 rounded-3xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-widest text-[#D97706]">ग्रह प्रभाव विश्लेषण (Ruler Influence)</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">सबसे प्रभावी नंबर:</span>
                          <span className="font-bold text-slate-800 ml-2">नंबर #{masterReport.gridAnalysis.mostInfluential.digit}</span>
                          <p className="text-[10px] text-slate-500">{masterReport.gridAnalysis.mostInfluential.reason}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200/50">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">न्यूनतम प्रभावी नंबर:</span>
                          <span className="font-bold text-slate-800 ml-2">नंबर #{masterReport.gridAnalysis.leastInfluential.digit}</span>
                          <p className="text-[10px] text-slate-500">{masterReport.gridAnalysis.leastInfluential.reason}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">जीवन का मुख्य उद्देश्य (भाग्यांक आधारित):</span>
                        <p className="text-sm font-black text-slate-800 mt-1"># {masterReport.gridAnalysis.lifeThemeNum}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">"{masterReport.gridAnalysis.lifeThemeText}"</p>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">मूल स्वभाव व व्यक्तित्व दिशा (मूलांक आधारित):</span>
                        <p className="text-sm font-black text-slate-800 mt-1"># {masterReport.gridAnalysis.corePersonalityNum}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">"{masterReport.gridAnalysis.corePersonalityText}"</p>
                      </div>
                    </div>

                  </div>

                  {/* Right: Grid Representation & Repeated Values meanings */}
                  <div className="space-y-6">
                    <div className="p-6 bg-[#FDFCF7] border border-amber-200/80 rounded-[35px] space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-widest text-center text-[#D97706]">नंबरों की पुनरावृत्ति व तीव्रता (Repetition Analysis)</h4>
                      
                      {masterReport.gridAnalysis.repeated.length > 0 ? (
                        <div className="space-y-4 text-left">
                          {masterReport.gridAnalysis.repeated.map(rep => (
                            <div key={rep.digit} className="p-3 bg-white border border-slate-200 rounded-2xl flex gap-3.5 items-start">
                              <div className="w-9 h-9 shrink-0 rounded-full bg-amber-500/10 text-[#D97706] font-mono font-black text-sm flex items-center justify-center border border-amber-500/20">
                                {rep.digit}
                              </div>
                              <div className="space-y-0.5 text-xs">
                                <span className="font-bold text-slate-800">नंबर {rep.digit} — {rep.count} बार आया है</span>
                                <p className="text-slate-500 leading-relaxed text-[11px]">
                                  {PLANETARY_REPETITION_MEANINGS[rep.digit]?.[Math.min(rep.count, 4)] || "इस ग्रिड क्षेत्र में तत्व की अत्यधिक ऊर्जा उत्पन्न करता है।"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">कोई भी नंबर दोहराया नहीं गया है। आपके सभी तत्व संतुलित रूप से सक्रिय हैं।</p>
                      )}
                    </div>
                  </div>

                  {/* Dedicated calculateLoShuGrid Section */}
                  <div className="col-span-1 md:col-span-2 pt-8 border-t border-[#E5E7EB] mt-4 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="text-left space-y-1">
                        <h5 className="font-cinzel text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 fill-[#D97706]/20 text-[#D97706]" />
                          मानक Lo Shu Grid गणना (`calculateLoShuGrid`)
                        </h5>
                        <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
                          जन्म तारीख से सीधे निकाले गए नंबर, जिसमें शून्य को छोड़कर <strong>भाग्यांक (Conductor / Destiny)</strong> को भी शामिल किया गया है।
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setCalcDob('05-08-1983')}
                          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-[#D97706] font-mono text-[10px] font-bold rounded-xl transition cursor-pointer"
                        >
                          डिफ़ॉल्ट 05-08-1983 सेट करें
                        </button>
                        <button
                          type="button"
                          disabled={!dob}
                          onClick={() => {
                            if (dob) {
                              setCalcDob(dob);
                            }
                          }}
                          className={`px-3 py-1.5 border font-mono text-[10px] font-bold rounded-xl transition ${
                            dob 
                              ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 cursor-pointer' 
                              : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          ऊपर वाली जन्म तारीख उपयोग करें
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50 border border-slate-100 p-6 rounded-3xl items-stretch">
                      
                      {/* Left calculation parameters */}
                      <div className="lg:col-span-4 space-y-4 text-left flex flex-col justify-center">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">जाँच हेतु जन्म तारीख (DOB)</span>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={calcDob}
                              onChange={(e) => setCalcDob(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D97706] focus:border-[#D97706]"
                              placeholder="DD/MM/YYYY or YYYY-MM-DD"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                          <div className="flex justify-between">
                            <span>निकाला गया फॉर्मेट:</span>
                            <span className="font-bold text-slate-800">{calculateLoShuGrid(calcDob).yyyymmdd}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>भाग्यांक (Conductor):</span>
                            <span className="font-bold text-[#D97706] bg-[#D97706]/10 px-1.5 py-0.5 rounded">
                              #{calculateLoShuGrid(calcDob).conductor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right calculation display */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Present Numbers */}
                        <div className="p-4 bg-white border border-slate-200/60 rounded-2xl flex flex-col justify-between text-left">
                          <div>
                            <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              मौजूद नंबर (Present Numbers)
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                              जन्म तारीख और भाग्यांक के अद्वितीय अंक।
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {calculateLoShuGrid(calcDob).present.map((num) => (
                              <div
                                key={num}
                                className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 font-mono font-black text-xs flex items-center gap-1"
                              >
                                {num}
                                <span className="text-[9px] font-normal text-emerald-500">
                                  ({num === 1 ? 'Sun' : num === 2 ? 'Moon' : num === 3 ? 'Jup' : num === 4 ? 'Rah' : num === 5 ? 'Mer' : num === 6 ? 'Ven' : num === 7 ? 'Ket' : num === 8 ? 'Sat' : 'Mar'})
                                </span>
                              </div>
                            ))}
                            {calculateLoShuGrid(calcDob).present.length === 0 && (
                              <span className="text-xs text-slate-400 italic">कोई नहीं</span>
                            )}
                          </div>
                        </div>

                        {/* Missing Numbers */}
                        <div className="p-4 bg-white border border-slate-200/60 rounded-2xl flex flex-col justify-between text-left">
                          <div>
                            <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                              अनुपस्थित नंबर (Missing Numbers)
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                              ग्रिड में अनुपस्थित अंक, जिनके वास्तु व जीवन उपाय आवश्यक हैं।
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {calculateLoShuGrid(calcDob).missing.map((num) => (
                              <div
                                key={num}
                                className="px-2.5 py-1 bg-red-50/50 border border-red-100/50 rounded-lg text-red-700 font-mono font-black text-xs flex items-center gap-1"
                              >
                                {num}
                                <span className="text-[9px] font-normal text-red-400">
                                  ({num === 1 ? 'Sun' : num === 2 ? 'Moon' : num === 3 ? 'Jup' : num === 4 ? 'Rah' : num === 5 ? 'Mer' : num === 6 ? 'Ven' : num === 7 ? 'Ket' : num === 8 ? 'Sat' : 'Mar'})
                                </span>
                              </div>
                            ))}
                            {calculateLoShuGrid(calcDob).missing.length === 0 && (
                              <span className="text-xs text-slate-400 italic">कोई नहीं</span>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 3: 81 COMBINATION ANALYSIS */}
              <div id="master-sec-combs" className="space-y-6 scroll-mt-6">
                <div className="flex gap-2.5 items-center pb-2 border-b border-[#E5E7EB]">
                  <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-mono font-bold text-xs">03</span>
                  <h4 className="font-cinzel text-xl font-bold text-slate-800 uppercase tracking-widest">81 मूलांक-भाग्यांक युति महा-मैट्रिक्स (81 Combinations)</h4>
                </div>

                <div className="p-5 bg-amber-50/40 border border-amber-200/50 rounded-3xl text-left">
                  <p className="text-xs text-slate-700 leading-relaxed italic font-lora">
                    "आपके मूलांक और भाग्यांक की युति से बनने वाले विशेष योग और जीवन पर उनका सीधा प्रभाव नीचे विस्तार से दिया गया है।"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {masterReport.activeCombinations.map((comb, index) => (
                    <div key={comb.code + index} className="p-6 bg-white border border-slate-200 rounded-[35px] shadow-sm space-y-4 text-left border-l-4 border-l-[#D97706]">
                      <div className="flex justify-between items-center gap-4 pb-2 border-b border-slate-100">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">युति योग कोड #{comb.code}</span>
                          <h4 className="text-sm font-black text-slate-800">{comb.name}</h4>
                        </div>
                        <div className="bg-[#D97706]/10 text-[#D97706] font-mono font-black text-lg px-4 py-2 rounded-2xl border border-[#D97706]/20">
                          {comb.code}
                        </div>
                      </div>
                      
                      <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                        <p className="font-medium text-slate-800">{comb.meaning}</p>
                        
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <span className="text-[9px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">सकारात्मक प्रभाव (Strengths)</span>
                            <p className="text-[11px] text-slate-600 font-sans mt-0.5">{comb.strength}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-red-600 uppercase tracking-wider block font-bold">सावधानियां (Weaknesses)</span>
                            <p className="text-[11px] text-slate-600 font-sans mt-0.5">{comb.weakness}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-50">
                          <div className="flex justify-between gap-4 text-[11px]">
                            <span className="font-semibold text-slate-700 font-sans">करियर पर प्रभाव:</span>
                            <span className="text-slate-500 font-sans">{comb.careerImpact}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-[11px]">
                            <span className="font-semibold text-slate-700 font-sans">संबंध व वैवाहिक जीवन:</span>
                            <span className="text-slate-500 font-sans">{comb.relationshipImpact}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-[11px]">
                            <span className="font-semibold text-slate-700 font-sans">आर्थिक स्थिति व धन प्रवाह:</span>
                            <span className="text-slate-500 font-sans">{comb.financialImpact}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-[11px]">
                            <span className="font-semibold text-slate-700 font-sans">आध्यात्मिक विकास:</span>
                            <span className="text-slate-500 font-sans">{comb.spiritualImpact}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-[#FDFCF7] border border-[#D97706]/20 rounded-xl mt-2">
                          <span className="text-[9px] font-mono text-[#D97706] uppercase tracking-wider block font-bold mb-0.5">सिद्ध उपाय (Prescribed Remedy)</span>
                          <p className="italic text-[#B45309] font-medium leading-relaxed font-sans text-[11px]">"{comb.remedy}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4 & 5: ARCHETYPE & CHARACTER PROFILING */}
              <div id="master-sec-profile" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start scroll-mt-6">
                
                {/* SECTION 4: ARCHETYPE CARD (Left 1 Span) */}
                <div className="bg-gradient-to-b from-[#FFFDF5] to-[#FFF7E3] p-8 rounded-[40px] border border-amber-200/70 shadow-md text-center space-y-6 flex flex-col justify-between h-full border-t-8 border-t-[#D97706]">
                  <div className="space-y-2 relative">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-black">आपका प्रधान व्यक्तित्व स्वरूप (Dominant Archetype)</span>
                    <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-4xl shadow-md border-2 border-amber-200">
                      🔮
                    </div>
                    <h3 className="font-cinzel text-2xl font-black text-slate-900 uppercase tracking-widest">{masterReport.archetype.title}</h3>
                    <p className="text-xs text-slate-500 font-lora italic">"{masterReport.archetype.description}"</p>
                  </div>

                  <div className="p-4 bg-white/80 border border-[#D97706]/20 rounded-2xl text-left space-y-2">
                    <span className="text-[9px] font-mono text-[#D97706] uppercase font-bold tracking-widest block">ज्योतिषीय तर्क व कारण (Logic Mapping)</span>
                    <p className="text-xs leading-relaxed text-slate-700 font-sans">{masterReport.archetype.reasoning}</p>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl space-y-2 text-center">
                    <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-widest block">सक्रिय सिद्ध मंत्र (Active Mantra)</span>
                    <p className="text-[11px] font-black tracking-widest text-[#FDFCF7] font-mono">{masterReport.archetype.mantra}</p>
                    <span className="text-[8px] font-mono text-slate-400 block tracking-wider">प्रातःकाल पूर्व दिशा की ओर मुख करके 27 बार जाप करें।</span>
                  </div>
                </div>

                {/* SECTION 5: CHARACTER PROFILING GRID (Right 2 Spans) */}
                <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left">
                  <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest pb-2 border-b border-slate-100">मनोवैज्ञानिक एवं स्वभाव प्रोफाइलिंग (Psychological Profiling)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    {[
                      { l: "सोचने का तरीका (Thinking Style)", d: masterReport.profiling.thinkingStyle },
                      { l: "निर्णय लेने की शैली (Decision Making)", d: masterReport.profiling.decisionMakingStyle },
                      { l: "बातचीत की शैली (Communication Style)", d: masterReport.profiling.communicationStyle },
                      { l: "सीखने का तरीका (Learning Style)", d: masterReport.profiling.learningStyle },
                      { l: "नेतृत्व शैली (Leadership Style)", d: masterReport.profiling.leadershipStyle },
                      { l: "कार्यशैली (Work Style)", d: masterReport.profiling.workStyle },
                      { l: "समस्या समाधान शैली (Problem Solving)", d: masterReport.profiling.problemSolvingStyle },
                      { l: "तनाव में प्रतिक्रिया (Stress Response)", d: masterReport.profiling.stressResponsePattern },
                      { l: "प्रेरणा का स्रोत (Motivation Pattern)", d: masterReport.profiling.motivationPattern },
                      { l: "आत्म-अनुशासन स्तर (Self Discipline)", d: masterReport.profiling.selfDisciplineLevel },
                      { l: "आत्मविश्वास का स्तर (Confidence Level)", d: masterReport.profiling.confidenceLevel },
                      { l: "सामाजिक छवि (Public Image)", d: masterReport.profiling.publicImage },
                    ].map(prof => (
                      <div key={prof.l} className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl hover:border-amber-200 transition">
                        <span className="text-[10px] font-mono text-[#D97706] uppercase block font-bold mb-1">{prof.l}</span>
                        <p className="text-slate-600 font-sans leading-relaxed text-[11px]">{prof.d}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl block">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase block font-bold mb-1">व्यक्तिगत विकास के मुख्य सुझाव (Growth Areas)</span>
                    <p className="text-xs leading-relaxed text-slate-700 italic font-medium font-sans">"{masterReport.profiling.personalGrowthAreas}"</p>
                  </div>
                </div>

              </div>

              {/* SECTION 6 & 7: RELATIONSHIP BEHAVIOUR & FAMILY KARMA */}
              <div id="master-sec-relations" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-6">
                
                {/* SECTION 6: RELATIONSHIP BEHAVIOUR */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left border-t-8 border-t-pink-500">
                  <div className="flex gap-2 items-center">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">प्रेम, वैवाहिक जीवन एवं संबंध मनोविज्ञान</h4>
                  </div>
                  
                  <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-pink-50/20 border border-pink-100 rounded-xl">
                        <span className="text-[10px] font-mono text-pink-600 block uppercase font-bold">प्रेम अभिव्यक्ति (Love Language)</span>
                        <p className="font-sans leading-relaxed text-[11px] mt-0.5">{masterReport.relationshipBehaviour.loveLanguage}</p>
                      </div>
                      <div className="p-3 bg-pink-50/20 border border-pink-100 rounded-xl">
                        <span className="text-[10px] font-mono text-pink-600 block uppercase font-bold">भावनात्मक जरूरतें (Emotional Needs)</span>
                        <p className="font-sans leading-relaxed text-[11px] mt-0.5">{masterReport.relationshipBehaviour.emotionalNeeds}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p><strong className="text-slate-800 font-sans">कमिटमेंट व निष्ठा:</strong> {masterReport.relationshipBehaviour.commitmentStyle}</p>
                      <p><strong className="text-slate-800 font-sans">विश्वास करने का स्वभाव:</strong> {masterReport.relationshipBehaviour.trustPattern}</p>
                      <p><strong className="text-slate-800 font-sans">मतभेद में व्यवहार:</strong> {masterReport.relationshipBehaviour.conflictBehaviour}</p>
                      <p><strong className="text-slate-800 font-sans">विवाह से अपेक्षाएं:</strong> {masterReport.relationshipBehaviour.marriageExpectations}</p>
                      <p><strong className="text-slate-800 font-sans">जीवनसाथी से अपेक्षाएं:</strong> {masterReport.relationshipBehaviour.partnerExpectations}</p>
                      <p><strong className="text-slate-800 font-sans">भावनात्मक अनुकूलता शैली:</strong> {masterReport.relationshipBehaviour.emotionalCompatibilityStyle}</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <p className="text-slate-800 text-[11px] font-semibold font-sans">संबंधों में मजबूती एवं चुनौतियां</p>
                      <p className="text-[11px] font-sans text-slate-600 leading-relaxed"><strong className="text-emerald-600 font-sans">मजबूत पक्ष:</strong> {masterReport.relationshipBehaviour.strengths}</p>
                      <p className="text-[11px] font-sans text-slate-600 leading-relaxed"><strong className="text-red-500 font-sans">कठिनाइयां:</strong> {masterReport.relationshipBehaviour.challenges}</p>
                    </div>

                    <p className="p-3 bg-pink-50/20 border border-pink-200/50 rounded-xl text-pink-700 italic font-medium font-sans text-[11px]">
                      💡 सुधार हेतु सुझाव: "{masterReport.relationshipBehaviour.growthSuggestions}"
                    </p>
                  </div>
                </div>

                {/* SECTION 7: FAMILY KARMA ANALYSIS */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left border-t-8 border-t-purple-600">
                  <div className="flex gap-2 items-center">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">पारिवारिक एवं पैतृक कर्म विश्लेषण (Family Karma)</h4>
                  </div>
                  
                  <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <p><strong className="text-slate-800 font-sans">पिता / पितृ प्रभाव:</strong> {masterReport.familyKarma.fatherInfluence}</p>
                      <p className="pt-2 border-t border-slate-200/60"><strong className="text-slate-800 font-sans">माता / मातृ प्रभाव:</strong> {masterReport.familyKarma.motherInfluence}</p>
                    </div>

                    <div className="space-y-2.5">
                      <p><strong className="text-slate-800 font-sans">पैतृक प्रभाव व संस्कार:</strong> {masterReport.familyKarma.ancestralInfluence}</p>
                      <p><strong className="text-slate-800 font-sans">पारिवारिक जिम्मेदारियां:</strong> {masterReport.familyKarma.familyResponsibilities}</p>
                      <p><strong className="text-slate-800 font-sans">विरासत में मिली खूबियां:</strong> {masterReport.familyKarma.inheritedStrengths}</p>
                      <p><strong className="text-slate-800 font-sans">विरासत में मिली चुनौतियां:</strong> {masterReport.familyKarma.inheritedChallenges}</p>
                    </div>

                    <div className="p-4 bg-purple-50/20 border border-purple-200/50 rounded-2xl">
                      <span className="text-[10px] font-mono text-purple-600 uppercase block font-bold mb-1">पारिवारिक कर्म की सीख (Karmic Lessons)</span>
                      <p className="italic text-purple-900 leading-relaxed font-sans font-medium text-[11px]">"{masterReport.familyKarma.familyKarmaLessons}"</p>
                    </div>

                    <p className="text-[11px] font-sans text-slate-500 leading-relaxed">
                      <strong>पारिवारिक विकास के मुख्य क्षेत्र:</strong> {masterReport.familyKarma.generationalGrowthAreas}
                    </p>
                  </div>
                </div>

              </div>

              {/* SECTION 8, 9 & 10: WEALTH PSYCHOLOGY, CAREER BLUEPRINT, HIDDEN TALENTS */}
              <div id="master-sec-wealth" className="space-y-12 scroll-mt-6">
                
                {/* SECTION 8: WEALTH PSYCHOLOGY CARD */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left border-t-8 border-t-emerald-600">
                  <div className="flex justify-between items-center flex-wrap gap-4 pb-2 border-b border-slate-100">
                    <div className="flex gap-2 items-center">
                      <Landmark className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">धन मनोविज्ञान एवं माइंडसेट (Wealth Psychology)</h4>
                    </div>
                    <div className="flex gap-3 text-xs font-mono font-bold uppercase">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                        धन क्षमता (Wealth Potential): {masterReport.wealthPsychology.wealthPotentialScore}/100
                      </span>
                      <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                        वित्तीय अनुशासन (Discipline): {masterReport.wealthPsychology.financialDisciplineScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-600">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <span className="text-[10px] font-mono text-emerald-600 uppercase font-black tracking-wider block">धन को लेकर सोच (Money Mindset)</span>
                      <p className="font-sans leading-relaxed text-[11px]">{masterReport.wealthPsychology.moneyMindset}</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <span className="text-[10px] font-mono text-emerald-600 uppercase font-black tracking-wider block">व्यापारिक सोच (Business Mindset)</span>
                      <p className="font-sans leading-relaxed text-[11px]">{masterReport.wealthPsychology.businessMindset}</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <span className="text-[10px] font-mono text-emerald-600 uppercase font-black tracking-wider block">धन कमाने की शैली (Wealth Creation Style)</span>
                      <p className="font-sans leading-relaxed text-[11px]">{masterReport.wealthPsychology.wealthCreationStyle}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                    <p><strong className="text-slate-800 font-sans">जोखिम लेने का स्वभाव (Risk Taking):</strong> {masterReport.wealthPsychology.riskTakingBehaviour}</p>
                    <p><strong className="text-slate-800 font-sans">खर्च करने की आदतें (Spending Behaviour):</strong> {masterReport.wealthPsychology.spendingBehaviour}</p>
                    <p><strong className="text-slate-800 font-sans">बचत के नियम (Saving Behaviour):</strong> {masterReport.wealthPsychology.savingBehaviour}</p>
                    <p><strong className="text-slate-800 font-sans">निवेश की दिशा (Investment Placements):</strong> {masterReport.wealthPsychology.investmentBehaviour}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-red-50/20 border border-red-200/50 rounded-2xl">
                      <span className="text-[10px] font-mono text-red-600 uppercase block font-bold mb-1">धन ऊर्जा में रुकावटें (Money Energy Blockages)</span>
                      <p className="font-sans leading-relaxed text-[11px] text-slate-700">{masterReport.wealthPsychology.moneyBlockages}</p>
                    </div>
                    <div className="p-4 bg-emerald-50/20 border border-emerald-200/50 rounded-2xl">
                      <span className="text-[10px] font-mono text-emerald-600 uppercase block font-bold mb-1">वित्तीय उपाय (Financial Remedies)</span>
                      <p className="font-sans leading-relaxed text-[11px] text-slate-700">{masterReport.wealthPsychology.financialRemedies}</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 9: CAREER BLUEPRINT CARD */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-8 text-left border-t-8 border-t-blue-600">
                  <div className="flex gap-2 items-center pb-2 border-b border-slate-100">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">करियर ब्लूप्रिंट (Career Blueprint)</h4>
                  </div>

                  {/* Career Suitability Metrics Wheel */}
                  <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 text-center">
                    {Object.entries({
                      "शिक्षण (Teaching)": masterReport.careerBlueprint.suitabilityScores.teaching,
                      "तकनीकी (Tech)": masterReport.careerBlueprint.suitabilityScores.technology,
                      "प्रबंधन (Mgmt)": masterReport.careerBlueprint.suitabilityScores.management,
                      "सेल्स (Sales)": masterReport.careerBlueprint.suitabilityScores.sales,
                      "रचनात्मक (Creative)": masterReport.careerBlueprint.suitabilityScores.creative,
                      "आध्यात्मिक (Spiritual)": masterReport.careerBlueprint.suitabilityScores.spiritual,
                      "नेतृत्व (Leadership)": masterReport.careerBlueprint.suitabilityScores.leadership
                    }).map(([label, score]) => (
                      <div key={label} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 hover:border-blue-200 transition">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">{label}</span>
                        <p className="text-lg font-black text-[#1E3A8A] font-playfair">{score}%</p>
                      </div>
                    ))}
                  </div>

                  {/* Suitability guidelines */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                    <p><strong className="text-slate-800 font-sans block mb-0.5">सर्वश्रेष्ठ कार्यक्षेत्र (Primary Best Sectors):</strong> {masterReport.careerBlueprint.bestCareers.join(', ')}</p>
                    <p><strong className="text-slate-800 font-sans block mb-0.5">सरकारी नौकरी का योग (Govt Job Alignment):</strong> {masterReport.careerBlueprint.governmentJobs}</p>
                    <p><strong className="text-slate-800 font-sans block mb-0.5">निजी क्षेत्र व व्यापार (Private/Business):</strong> {masterReport.careerBlueprint.privateJobs}</p>
                  </div>

                  {/* Top 10 recommended Careers lists */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest block font-black">शीर्ष 10 अनुशंसित करियर विकल्प (TOP 10 RECOMMENDED CAREERS)</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {masterReport.careerBlueprint.recommendedCareers.map((rec, idx) => (
                        <div key={rec.title} className="p-4 bg-blue-50/10 border border-blue-100 rounded-2xl flex gap-3.5 items-start text-xs text-left">
                          <span className="w-6 h-6 shrink-0 rounded-full bg-blue-600/10 text-[#1E3A8A] font-mono font-black text-[11px] flex items-center justify-center border border-blue-600/10">
                            {idx+1}
                          </span>
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 leading-relaxed">{rec.title}</span>
                            <p className="text-slate-500 leading-relaxed font-sans text-[11px]">{rec.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 10: HIDDEN TALENTS ENGINE */}
                <div className="bg-[#FFFDF5] p-8 md:p-10 rounded-[40px] border border-amber-200/60 shadow-sm space-y-6 text-left border-l-4 border-l-amber-600">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">SECTION 10: छुपी हुई प्रतिभाएं</span>
                    <h4 className="font-cinzel text-lg font-black text-slate-900 uppercase tracking-widest">प्राकृतिक गुण एवं छिपी हुई क्षमताएं (HIDDEN TALENTS)</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs leading-relaxed text-slate-600">
                    {Object.entries({
                      "रचनात्मक (Creative)": masterReport.hiddenTalents.talents.creative,
                      "संवाद (Communication)": masterReport.hiddenTalents.talents.communication,
                      "व्यापारिक (Business)": masterReport.hiddenTalents.talents.business,
                      "शिक्षण (Teaching)": masterReport.hiddenTalents.talents.teaching,
                      "नेतृत्व (Leadership)": masterReport.hiddenTalents.talents.leadership,
                      "आध्यात्मिक (Spiritual)": masterReport.hiddenTalents.talents.spiritual,
                      "कलात्मक (Artistic)": masterReport.hiddenTalents.talents.artistic,
                      "उद्यमिता (Entrepreneurial)": masterReport.hiddenTalents.talents.entrepreneurial
                    }).map(([tName, desc]) => (
                      <div key={tName} className="p-4 bg-white border border-slate-200 rounded-2xl">
                        <span className="font-bold text-slate-800 font-sans block mb-1">{tName}</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-white border-2 border-dashed border-[#D97706]/40 rounded-3xl space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold tracking-widest block">आपकी सबसे प्रबल छिपी हुई प्रतिभा (MOST POWERFUL TALENT)</span>
                    <p className="text-sm font-bold text-slate-800 font-sans">"{masterReport.hiddenTalents.mostPowerfulTalent}"</p>
                    <p className="text-slate-500 leading-relaxed text-[11px] font-sans">अपने करियर और कार्यों को इस प्रतिभा के अनुसार ढालें ताकि आपको बिना किसी अनावश्यक तनाव के सफलता और आर्थिक समृद्धि प्राप्त हो सके।</p>
                  </div>
                </div>

              </div>

              {/* SECTION 11 & 12: KARMIC LESSON ANALYSIS & SOUL MISSION */}
              <div id="master-sec-karmic" className="space-y-12 scroll-mt-6">
                
                {/* SECTION 11: KARMIC LESSONS */}
                <div className="space-y-6">
                  <div className="flex gap-2.5 items-center pb-2 border-b border-[#E5E7EB]">
                    <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-mono font-bold text-xs">11</span>
                    <h4 className="font-cinzel text-xl font-bold text-slate-800 uppercase tracking-widest">कार्मिक पाठ एवं अनुपस्थित अंक विश्लेषण (Karmic Lessons & Missing Numbers)</h4>
                  </div>

                  {masterReport.karmicLessons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      {masterReport.karmicLessons.map(lesson => (
                        <div key={lesson.digit} className="p-6 bg-white border border-slate-200 rounded-[35px] shadow-sm space-y-4 border-t-4 border-t-red-500 hover:border-red-500/35 transition">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <div>
                              <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block font-bold">अनुपस्थित तत्व (MISSING ELEMENT)</span>
                              <h4 className="text-sm font-black text-slate-800">अंक #{lesson.digit} का कार्मिक पाठ (Karmic Lesson)</h4>
                            </div>
                            <div className="w-10 h-10 shrink-0 rounded-full bg-red-100/50 text-red-700 font-mono font-black text-base flex items-center justify-center border border-red-500/20 shadow-inner">
                              {lesson.digit}
                            </div>
                          </div>

                          <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
                            <p><strong className="text-slate-800 font-sans block mb-0.5">मुख्य जीवन चुनौती (Life Challenge):</strong> {lesson.lifeChallenge}</p>
                            <p><strong className="text-slate-800 font-sans block mb-0.5">विकास का अवसर (Growth Opportunity):</strong> {lesson.growthOpportunity}</p>
                            <p><strong className="text-slate-800 font-sans block mb-0.5">व्यावहारिक सलाह (Practical Advice):</strong> {lesson.practicalAdvice}</p>
                            <p><strong className="text-slate-800 font-sans block mb-0.5">दैनिक सुधार रणनीति (Daily Strategy):</strong> {lesson.developmentStrategy}</p>
                            
                            <div className="p-3.5 bg-red-50/20 border border-red-200/50 rounded-xl mt-2 block">
                              <span className="text-[10px] font-mono text-red-600 uppercase font-black tracking-widest block mb-0.5">व्यक्तिगत सिद्ध उपाय (Personalised Remedy)</span>
                              <p className="italic text-red-900 leading-relaxed font-sans font-medium text-[11px]">{lesson.personalizedRemedy}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-4 italic text-center">अद्भुत! आपकी जन्म कुंडली में कोई भी अनुपस्थित अंक नहीं है। आपके सभी भौतिक एवं ऊर्जावान प्लेन्स सक्रिय हैं।</p>
                  )}
                </div>

                {/* SECTION 12: SOUL MISSION ANALYSIS */}
                <div className="bg-[#FFFDF5] p-8 md:p-10 rounded-[40px] border border-amber-200/70 shadow-sm space-y-6 text-left">
                  <div className="flex gap-2 items-center">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">आत्मा का उद्देश्य एवं जीवन ध्येय (Soul Mission & Purpose)</h4>
                  </div>

                  <div className="p-6 bg-white border border-amber-200/40 rounded-3xl space-y-1 text-center">
                    <span className="text-[9px] font-mono text-[#D97706] uppercase tracking-widest font-black block">उच्चतर जीवन ध्येय (HIGHER CALLING)</span>
                    <p className="font-serif italic font-semibold text-lg text-slate-800 leading-relaxed">
                      " {masterReport.soulMission.purposeStatement} "
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed font-sans mt-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <span className="font-bold text-slate-800 font-sans block mb-1">जीवन उद्देश्य मार्ग (Life Purpose)</span>
                      <p className="text-slate-500 leading-relaxed font-sans text-[11px]">{masterReport.soulMission.lifePurpose}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <span className="font-bold text-slate-800 font-sans block mb-1">आत्मा का मुख्य लक्ष्य (Soul Mission)</span>
                      <p className="text-slate-500 leading-relaxed font-sans text-[11px]">{masterReport.soulMission.soulMissionText}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <span className="font-bold text-slate-800 font-sans block mb-1">उच्च आध्यात्मिक उद्देश्य (Higher Calling)</span>
                      <p className="text-slate-500 leading-relaxed font-sans text-[11px]">{masterReport.soulMission.higherCalling}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                      <span className="font-bold text-slate-800 font-sans block mb-1">जीवन की स्थायी विरासत (Legacy Potential)</span>
                      <p className="text-slate-500 leading-relaxed font-sans text-[11px]">{masterReport.soulMission.legacyPotential}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 13: ARROW MASTER ANALYSIS */}
              <div id="master-sec-arrows" className="space-y-6">
                <div className="flex gap-2.5 items-center pb-2 border-b border-[#E5E7EB]">
                  <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-mono font-bold text-xs">13</span>
                  <h4 className="font-cinzel text-xl font-bold text-slate-800 uppercase tracking-widest">12 एरो एवं योग संपूर्ण विश्लेषण (12 Arrow Master Analysis)</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-xs leading-relaxed">
                  {masterReport.arrowsAnalysis.map(arrow => (
                    <div key={arrow.name} className={`p-6 bg-white border rounded-[35px] shadow-sm space-y-3 border-l-4 ${arrow.isActive ? 'border-l-emerald-600' : 'border-l-slate-300'}`}>
                      <div className="flex justify-between items-center gap-4 border-b border-slate-100 pb-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">प्लेन स्थिति (PLANE ALIGNMENT)</span>
                          <h4 className="text-sm font-black text-slate-800 leading-relaxed">{arrow.name}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-widest font-black ${
                          arrow.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}>
                          {arrow.status}
                        </span>
                      </div>

                      <p className="italic text-slate-600 font-lora leading-relaxed text-[11px]">"{arrow.meaning}"</p>
                      
                      <div className="grid grid-cols-2 gap-3 pt-1.5">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">सकारात्मक प्रभाव (Strengths)</span>
                          <p className="text-slate-600 text-[11px] leading-relaxed font-sans">{arrow.strength}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block">सावधानी एवं जोखिम (Risk Points)</span>
                          <p className="text-slate-600 text-[11px] leading-relaxed font-sans">{arrow.risk}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-50">
                        <p className="text-[11px] font-sans text-slate-600"><strong className="text-slate-700 font-sans">करियर पर प्रभाव (Career Impact):</strong> {arrow.careerImpact}</p>
                        <p className="text-[11px] font-sans text-slate-600"><strong className="text-slate-700 font-sans">रिश्तों पर प्रभाव (Relations Impact):</strong> {arrow.relationshipImpact}</p>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                        <span className="text-[9px] font-mono uppercase text-[#D97706] tracking-wider block font-bold mb-0.5">उपाय एवं मार्गदर्शन (Remedy)</span>
                        <p className="text-slate-800 leading-relaxed font-medium font-sans text-[11px]">"{arrow.remedy}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 14 & 15: INTERACTIVE FUSION STATION (MOBILE & VAASTU) */}
              <div id="master-sec-fusions" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-6">
                
                {/* SECTION 14: INTERACTIVE MOBILE FUSION */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left border-t-8 border-t-amber-600">
                  <div className="flex gap-2 items-center">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">लोशू + मोबाइल न्यूमेरोलॉजी मिलान (Lo Shu + Mobile Fusion)</h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    आपके 10-अंकों के मोबाइल नंबर को जन्म कुंडली के खाली अंकों के साथ मिलाकर ग्रिड की कमियों को दूर करने का लाइव विश्लेषण।
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">अपना मोबाइल नंबर दर्ज करें (Enter Mobile):</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                          setMobileNumber(val);
                          const master = computeLoshuMasterReport(masterReport.personal.dob, masterReport.personal.name, masterReport.personal.gender, val);
                          setMasterReport(master);
                        }}
                        placeholder="उदा. 9810574362"
                        className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl text-xs outline-none focus:ring-4 focus:ring-amber-500/15 font-mono"
                      />
                    </div>
                  </div>

                  {mobileNumber.length >= 8 ? (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-4">
                      <p><strong className="text-slate-800 font-sans">मोबाइल की शक्तियां (Mobile Strengths):</strong> {masterReport.mobileFusion.strengths}</p>
                      <p><strong className="text-slate-800 font-sans">मोबाइल की कमियां (Mobile Weaknesses):</strong> {masterReport.mobileFusion.weaknesses}</p>
                      <p><strong className="text-slate-800 font-sans">ग्रिड भरपाई विश्लेषण (Compensation):</strong> {masterReport.mobileFusion.compensationAnalysis}</p>
                      <p><strong className="text-slate-800 font-sans">ग्रहों का सहयोग (Planetary Support):</strong> {masterReport.mobileFusion.supportAnalysis}</p>
                      
                      <div className="p-3.5 bg-amber-50/20 border border-amber-200/50 rounded-xl space-y-1 font-sans">
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-black">मोबाइल नंबर में सुधार के सुझाव (RECOMMENDED IMPROVEMENTS)</span>
                        <p className="text-slate-800 leading-relaxed font-sans text-[11px]">{masterReport.mobileFusion.improvements}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 border border-dashed rounded-3xl text-xs font-sans">
                      रियल-टाइम मोबाइल नंबर विश्लेषण और ग्रिड बैलेंसिंग देखने के लिए ऊपर 10 अंकों का मोबाइल नंबर लिखें।
                    </div>
                  )}
                </div>

                {/* SECTION 15: NUMERO VAASTU FUSION */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left border-t-8 border-t-indigo-600">
                  <div className="flex gap-2 items-center">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">लोशू + न्यूमेरो वास्तु मिलान (Lo Shu + Numero Vaastu)</h4>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed">
                    <span className="text-[10px] font-mono text-indigo-600 uppercase block font-bold mb-1">दिशात्मक विश्लेषण (Mansion Directional Analysis)</span>
                    <p className="font-sans text-slate-800 font-semibold">{masterReport.vaastuFusion.directionAnalysis}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed font-sans">
                    <div className="p-4 bg-emerald-50/10 border border-emerald-100 rounded-xl">
                      <span className="text-[10px] font-mono text-emerald-600 block uppercase font-bold">अनुकूल दिशाएं (Best Directions)</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 font-sans text-[11px] text-slate-600">
                        {masterReport.vaastuFusion.bestDirections.map(d => <li key={d}>{d}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50/10 border border-red-100 rounded-xl">
                      <span className="text-[10px] font-mono text-red-600 block uppercase font-bold">बचने योग्य दिशाएं (Avoid Directions)</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 font-sans text-[11px] text-slate-600">
                        {masterReport.vaastuFusion.avoidDirections.map(d => <li key={d}>{d}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-sans">
                    <p><strong className="text-slate-800 block mb-0.5">करियर क्षेत्र (Career Zone):</strong> {masterReport.vaastuFusion.zones.career}</p>
                    <p><strong className="text-slate-800 block mb-0.5">धन एवं समृद्धि क्षेत्र (Money/Wealth Zone):</strong> {masterReport.vaastuFusion.zones.money}</p>
                    <p><strong className="text-slate-800 block mb-0.5">स्वास्थ्य क्षेत्र (Health Zone):</strong> {masterReport.vaastuFusion.zones.health}</p>
                    <p><strong className="text-slate-800 block mb-0.5">संबंध एवं परिवार क्षेत्र (Relationship Zone):</strong> {masterReport.vaastuFusion.zones.relationship}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed font-sans pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-600 uppercase block font-bold mb-0.5">घर के वास्तु उपाय (Home Remedies)</span>
                      <p className="font-sans leading-relaxed text-[11px] text-slate-500">{masterReport.vaastuFusion.homeRemedies}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-600 uppercase block font-bold mb-0.5">कार्यस्थल/ऑफिस के उपाय (Office Remedies)</span>
                      <p className="font-sans leading-relaxed text-[11px] text-slate-500">{masterReport.vaastuFusion.officeRemedies}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 16 & 17: HEALTH & DOSH ANALYSIS + ANNUAL FORECAST */}
              <div id="master-sec-health" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-6">
                
                {/* SECTION 16: HEALTH & ayurveda DOSHA */}
                <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-left border-t-8 border-t-teal-600">
                  <div className="flex gap-2 items-center pb-2 border-b border-slate-150">
                    <Activity className="w-5 h-5 text-teal-600" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">आयुर्वेद त्रिदोष एवं स्वास्थ्य प्रोफाइल (Ayurveda Dosha & Wellness)</h4>
                  </div>

                  {/* Health indexes */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-teal-50/10 border border-teal-150 rounded-2xl">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">स्वास्थ्य स्कोर (Health Score)</span>
                      <p className="text-xl font-black text-teal-800 font-sans">{masterReport.healthAnalysis.healthScore}/100</p>
                    </div>
                    <div className="p-3 bg-rose-50/10 border border-rose-150 rounded-2xl">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">तनाव सूचकांक (Stress Index)</span>
                      <p className="text-xl font-black text-rose-800 font-sans">{masterReport.healthAnalysis.stressScore}/100</p>
                    </div>
                    <div className="p-3 bg-amber-50/10 border border-amber-150 rounded-2xl">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">प्राण ऊर्जा (Vitality)</span>
                      <p className="text-xl font-black text-amber-800 font-sans">{masterReport.healthAnalysis.energyScore}/100</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600 font-sans">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold mb-1">प्रधान त्रिदोष (Primary Dosha)</span>
                      <p className="text-slate-800 font-semibold font-sans">{masterReport.healthAnalysis.primaryDosha} (प्रधान दोष)</p>
                      <p className="text-[11px] font-sans text-slate-500 leading-relaxed mt-1">
                        {masterReport.healthAnalysis.primaryDosha === 'PITTA' && "पित्त दोष अग्नि तत्व और पाचन क्रिया से जुड़ा है। अत्यधिक मिर्च-मसाले और तनाव से एसिडिटी बढ़ सकती है।"}
                        {masterReport.healthAnalysis.primaryDosha === 'VATA' && "वात दोष वायु और आकाश तत्व से संबंधित है। इससे अनिद्रा, बेचैनी और नसों से जुड़े खिंचाव की संभावना रहती है।"}
                        {masterReport.healthAnalysis.primaryDosha === 'KAPHA' && "कफ दोष जल और पृथ्वी तत्व से संबंधित है, जो धीमे मेटाबॉलिज्म और वजन बढ़ने की प्रवृत्ति लाता है।"}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-mono text-teal-600 uppercase block font-bold mb-1">स्वास्थ्य प्रवृत्तियां (Health Tendencies)</span>
                      <p className="text-[11px] font-sans text-slate-500 leading-relaxed">{masterReport.healthAnalysis.healthTendencies}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <span className="text-[10px] font-mono text-teal-600 uppercase tracking-widest block font-black">निवारक जीवनशैली सिफारिशें (LIFESTYLE RECOMMENDATIONS)</span>
                    
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 leading-relaxed font-sans">
                      {masterReport.healthAnalysis.lifestyleRecommendations.map((rec, idx) => (
                        <li key={idx} className="font-sans text-slate-600 text-[11px]">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="p-3.5 bg-teal-50/20 border border-teal-200/50 rounded-xl text-teal-800 italic font-medium font-sans text-[11px]">
                    🛡️ केवल स्वास्थ्य मार्गदर्शन: "{masterReport.healthAnalysis.preventiveWellness}" (चिकित्सीय सलाह का विकल्प नहीं है)।
                  </p>
                </div>

                {/* SECTION 17: TRANSIT/ANNUAL FORECAST */}
                <div className="bg-[#FFFDF5] p-8 md:p-10 rounded-[40px] border border-amber-200/70 shadow-sm space-y-6 text-left border-t-8 border-t-amber-600">
                  <div className="space-y-1 pb-2 border-b border-amber-200/40 text-left">
                    <span className="text-[9px] font-mono text-[#D97706] uppercase block font-bold">SECTION 17: वर्षफल एवं गोचर (TRANSIT CODES)</span>
                    <h4 className="font-cinzel text-lg font-black text-slate-900 uppercase tracking-widest">पर्सनल ईयर राशिफल (PERSONAL YEAR FORECAST)</h4>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-slate-700">
                    <div className="flex justify-between border-b border-amber-200/20 pb-1.5">
                      <span>पर्सनल ईयर (Personal Year):</span>
                      <span className="font-bold text-[#D97706]"># {masterReport.forecasts.personalYear}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-300/25 pb-1.5">
                      <span>वर्तमान माह (Personal Month):</span>
                      <span className="font-bold text-slate-800"># {masterReport.forecasts.personalMonth}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-300/25 pb-1.5">
                      <span>वर्तमान दिन (Personal Day):</span>
                      <span className="font-bold text-slate-800"># {masterReport.forecasts.personalDay}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-[11px] leading-relaxed text-slate-600 font-sans">
                    <p><strong className="text-slate-800 font-sans block">करियर गोचर (Career Transit):</strong> {masterReport.forecasts.career}</p>
                    <p><strong className="text-slate-800 font-sans block">आर्थिक स्थिति (Financial Space):</strong> {masterReport.forecasts.money}</p>
                    <p><strong className="text-slate-800 font-sans block">विवाह एवं प्रेम (Marriage & Love):</strong> {masterReport.forecasts.relationships}</p>
                    <p><strong className="text-slate-800 font-sans block">व्यापार एवं लेन-देन (Business & Trade):</strong> {masterReport.forecasts.business}</p>
                  </div>

                  <div className="pt-2 border-t border-amber-200/30 text-[11px] font-sans">
                    <span className="text-[#D97706] uppercase tracking-wider block font-bold mb-1 font-mono text-[9px]">विशेष अनुकूल अवसर (Opportunities)</span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-500 font-sans">
                      {masterReport.forecasts.opportunities.map(o => <li key={o}>{o}</li>)}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-amber-300/25 text-[11px] font-sans">
                    <span className="text-red-500 uppercase tracking-wider block font-bold mb-1 font-mono text-[9px]">सावधानी एवं चेतावनियां (Warnings)</span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-500 font-sans">
                      {masterReport.forecasts.warnings.map(w => <li key={w}>{w}</li>)}
                    </ul>
                  </div>
                </div>

              </div>

              {/* SECTION 18: LAL KITAB & 90-DAY ACTION REMEDIES PLAN */}
              <div id="master-sec-remedies" className="bg-white p-8 md:p-10 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-8 text-left border-t-8 border-t-[#D97706] scroll-mt-6">
                
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 flex-wrap gap-4">
                  <div className="flex gap-2 items-center">
                    <Shield className="w-5 h-5 text-[#D97706]" />
                    <h4 className="font-cinzel text-lg font-bold text-slate-800 uppercase tracking-widest">लाल किताब एवं सिद्ध उपाय (Siddha Remedies Altar)</h4>
                  </div>
                  
                  <div className="flex gap-3 text-xs font-mono font-bold uppercase text-[#D97706]">
                    <span>शुभ रंग (Lucky Colors): {masterReport.remedies.luckyColours.join(', ')}</span>
                  </div>
                </div>

                {/* Lucky coordinates */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold font-sans">
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase block font-bold mb-0.5">शुभ अंक (Lucky Numbers)</span>
                    <p className="text-slate-800 font-black">{masterReport.remedies.luckyNumbers.join(', ')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase block font-bold mb-0.5">शुभ तारीखें (Lucky Dates)</span>
                    <p className="text-slate-800 font-black text-[11px]">{masterReport.remedies.luckyDates.join(', ')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase block font-bold mb-0.5">शुभ दिन (Lucky Days)</span>
                    <p className="text-slate-800 font-black text-[11px]">{masterReport.remedies.luckyDays.join(', ')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase block font-bold mb-0.5">शुभ दिशा (Lucky Direction)</span>
                    <p className="text-slate-800 font-black text-[11px]">{masterReport.remedies.luckyDirections[0]}</p>
                  </div>
                </div>

                {/* Remedies split lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 font-sans">
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase font-black tracking-widest block">व्यक्तिगत व करियर उपाय (Personal & Career)</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-500 font-sans text-[11px]">
                      {masterReport.remedies.personalRemedies.map((r, i) => <li key={i}>{r}</li>)}
                      {masterReport.remedies.careerRemedies.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase font-black tracking-widest block">आर्थिक व आध्यात्मिक उपाय (Financial & Spiritual)</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-500 font-sans text-[11px]">
                      {masterReport.remedies.financialRemedies.map((r, i) => <li key={i}>{r}</li>)}
                      {masterReport.remedies.spiritualRemedies.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Highly Structured 90-Day Plan block */}
                <div className="p-6 bg-amber-50/20 border border-amber-200/60 rounded-[35px] space-y-4 font-sans text-xs">
                  <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-black block text-center">90 दिवसीय सुनियोजित क्रियान्वयन योजना (90-Day Action Execution Plan)</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-white border border-[#D97706]/15 rounded-2xl space-y-1.5">
                      <span className="bg-[#D97706]/10 text-[#D97706] px-3.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold block w-max">दिन 1 - 30 (प्रारंभिक शुद्धि व तैयारी)</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{masterReport.remedies.plan90Days.days1_30}</p>
                    </div>
                    <div className="p-4 bg-white border border-[#D97706]/15 rounded-2xl space-y-1.5">
                      <span className="bg-[#D97706]/10 text-[#D97706] px-3.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold block w-max">दिन 31 - 60 (सक्रिय उपाय एवं साधना)</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{masterReport.remedies.plan90Days.days31_60}</p>
                    </div>
                    <div className="p-4 bg-white border border-[#D97706]/15 rounded-2xl space-y-1.5">
                      <span className="bg-[#D97706]/10 text-[#D97706] px-3.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold block w-max">दिन 61 - 90 (स्थिरीकरण व सकारात्मक परिणाम)</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{masterReport.remedies.plan90Days.days61_90}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 19: PREMIUM PDF BRAND PRINTABLE REPORT MODULE */}
              <div className="border-t-4 border-dashed border-slate-300 pt-12 space-y-6">
                <div className="text-center space-y-4">
                  <span className="text-4xl text-[#D97706]/20">⚜️</span>
                  <h3 className="font-cinzel text-xl md:text-2xl font-black text-slate-800 uppercase tracking-widest">Section 19: संपूर्ण परामर्श रिपोर्ट (Consultation Report)</h3>
                  <p className="text-slate-400 text-xs max-w-lg mx-auto">यह संपूर्ण 19-आयामी रिपोर्ट आपके जीवन के सभी महत्वपूर्ण पहलुओं को समेटे हुए है, जिसे आप प्रिंट या पीडीएफ के रूप में सुरक्षित रख सकते हैं।</p>
                </div>

                <div className="bg-[#111827] text-slate-100 p-8 md:p-12 rounded-[40px] border border-slate-800 shadow-xl max-w-4xl mx-auto space-y-10 relative select-all scroll-mt-6 print:border-none print:shadow-none print:p-0">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
                  
                  {/* Watermark sign */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-2 font-cinzel text-[160px] pointer-events-none select-none select-all uppercase">☯️</div>

                  {/* Header page */}
                  <div className="text-center space-y-4 pb-8 border-b border-slate-800/80">
                    <span className="text-amber-500 font-mono text-[9px] tracking-widest uppercase font-bold border border-amber-500/20 px-4 py-1.5 rounded-full bg-amber-500/5">
                      आधिकारिक न्यूमेरोलॉजी परामर्श पत्र
                    </span>
                    <h2 className="font-cinzel text-3xl font-black tracking-widest uppercase text-[#FDFCF7]">LO SHU REPORT PRESET</h2>
                    <p className="text-slate-400 font-lora italic text-xs">"जीवन मार्गदर्शन एवं ग्रहों के संतुलन हेतु संपूर्ण विश्लेषण।"</p>
                  </div>

                  <div className="space-y-6 text-xs text-slate-300 leading-relaxed font-sans select-all">
                    <p className="text-sm font-semibold text-[#F59E0B] pb-2 border-b border-slate-850">I. मुख्य परामर्श सारांश (Executive Summary)</p>
                    <p className="font-lora italic text-slate-400 text-center text-sm">"जातक <strong>{masterReport.personal.name}</strong>, जिनका मूलांक #{masterReport.personal.driver} और भाग्यांक #{masterReport.personal.conductor} है, उनका आभामंडल <strong>{masterReport.archetype.title}</strong> के अनुरूप है। जीवन में संतुलन और प्रगति के लिए अनुपस्थित ग्रिड क्षेत्रों के उपायों का नियमित पालन करें।"</p>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <div>
                        <p className="font-bold text-slate-100 mb-1">ग्रिड अंक स्थिति (Grid Coordinates)</p>
                        <p className="text-slate-400">उपस्थित अंक (Present Digits): {masterReport.gridAnalysis.present.join(', ')}</p>
                        <p className="text-slate-400">अनुपस्थित अंक (Missing Digits): {masterReport.gridAnalysis.missing.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 mb-1">कुआ एवं दिशा स्थिति (Mansion Coordinates)</p>
                        <p className="text-slate-400">कुआ अंक: #{masterReport.vaastuFusion.kuaNumber} ({masterReport.vaastuFusion.groupType === 'EAST_GROUP' ? 'पूर्व समूह (East Group)' : 'पश्चिम समूह (West Group)'})</p>
                        <p className="text-slate-400">सर्वश्रेष्ठ दिशा: {masterReport.vaastuFusion.bestDirections[0]}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
                      <p className="font-semibold text-[#F59E0B]">II. वरिष्ठ सलाहकार मार्गदर्शन (Consultant Advice)</p>
                      <p className="italic text-slate-400">"दक्षिण-पूर्व धन क्षेत्र और दक्षिण-पश्चिम संबंध क्षेत्र पर विशेष ध्यान दें। अनुकूल रंगों का उपयोग करें और बताए गए वैदिक व लाल किताब उपायों को समय पर पूर्ण करें।"</p>
                    </div>

                    {/* Counselor signature block */}
                    <div className="pt-8 flex justify-between items-end flex-wrap gap-6 text-[10px]">
                      <div>
                        <span className="text-slate-500 block uppercase font-mono tracking-wider">परामर्श तिथि (Date)</span>
                        <span className="font-bold font-mono text-slate-305">June 2026</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block uppercase font-mono tracking-wider">हस्ताक्षर (Consultant Signature)</span>
                        <span className="font-cinzel text-amber-500 block font-bold text-sm mt-1">LEO Grand Master Vedic System</span>
                        <span className="text-[9px] text-slate-600 block">सत्यापित वैदिक ब्लूप्रिंट • Certified Report</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex justify-center gap-4 print:hidden">
                    <button
                      onClick={handlePrint}
                      className="bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer transition shadow-lg"
                    >
                      <Printer className="w-4 h-4 inline mr-1.5" /> प्रिंट / PDF सेव करें (Print Report)
                    </button>
                    <button
                      onClick={() => {
                        const contentBlob = new Blob([JSON.stringify(masterReport, null, 2)], { type: 'application/json' });
                        const dlUrl = URL.createObjectURL(contentBlob);
                        const trigger = document.createElement('a');
                        trigger.href = dlUrl;
                        trigger.download = `Consultation_Report_${masterReport.personal.name.replace(/\s+/g,'_')}.json`;
                        trigger.click();
                      }}
                      className="bg-slate-800 text-slate-300 hover:text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer transition"
                    >
                      डेटा स्कीमा एक्सपोर्ट (Export JSON)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 0.5: VEDIC GRID, 81 YOGAS & KARMIC ACTION PLAN */}
          {activeSubTab === 'KARMIC_VEDIC' && completeProfile && (
            <KarmicVedicAnalysisView profile={completeProfile} />
          )}

          {/* TAB 1: GRID & BOX AUDITING */}
          {activeSubTab === 'GRID' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in duration-500">
              
              {/* Box 1: Interactive Loshu Grid 3x3 (Left, span 2) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-center select-none">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                    <span className="text-xs font-mono uppercase text-[#D97706] tracking-widest font-bold">इंटरएक्टिव लोशू ग्रिड (3x3 Magic Square)</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">विवरण देखने हेतु किसी भी अंक पर क्लिक करें</span>
                  </div>

                  {/* Complete Animated Magic Board */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-3 gap-3 max-w-[340px] mx-auto aspect-square my-4 p-2 bg-[#F8F4EF]/80 rounded-[30px] border border-[#E5E7EB]"
                  >
                    {loshuGridOrder.map((digit) => {
                      const box = analysisResult.loshuGrid[digit];
                      const style = getBoxElementStyle(box.element, box.count || 0);
                      const isSelected = selectedBoxDigit === digit;

                      return (
                        <motion.div
                          key={digit}
                          variants={itemVariants}
                          onClick={() => setSelectedBoxDigit(digit)}
                          className={`rounded-2xl border-2 flex flex-col justify-between p-3 cursor-pointer select-none transition-all duration-300 relative overflow-hidden group ${style} ${
                            isSelected ? 'ring-4 ring-[#D97706]/40 border-[#D97706] scale-102 z-20 shadow-lg' : 'hover:scale-101 hover:border-[#D97706]/20'
                          }`}
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          {/* Inner tiny background number mapping index */}
                          <span className="absolute -bottom-2 -left-2 text-[28px] font-mono font-bold opacity-5 group-hover:opacity-10 transition-opacity">
                            {digit}
                          </span>

                          {/* Digit Counts / Badges */}
                          <div className="flex flex-col gap-1.5 justify-start text-left">
                            {/* Base DOB counts (Birth Layer) */}
                            <div className="flex flex-wrap gap-1">
                              {box.dobCount && box.dobCount > 0 ? (
                                Array.from({ length: Math.min(box.dobCount, 4) }).map((_, i) => (
                                  <span key={i} title="जन्म तारीख (Birth Layer) अंक" className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[10px] font-mono font-black text-slate-800 shadow-sm">
                                    {digit}
                                  </span>
                                ))
                              ) : (box.isDriverLayer || box.isDestinyLayer) ? (
                                <span title={box.isDestinyLayer ? "भाग्यांक से जोड़ा गया (Destiny Layer Added)" : "मूलांक से जोड़ा गया (Driver Layer Added)"} className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-black shadow-sm ${box.isDestinyLayer ? 'bg-blue-50 border border-blue-400 text-blue-700' : 'bg-amber-50 border border-amber-400 text-amber-700'}`}>
                                  {digit}
                                </span>
                              ) : null}
                            </div>

                            {/* Reinforcement / Layer Badges */}
                            <div className="flex flex-wrap gap-1.5">
                              {box.isDriverLayer && (
                                <span title="मूलांक द्वारा जोड़ा गया (Driver Layer Added)" className="px-1.5 h-4 rounded-md bg-amber-500 text-white border border-amber-600 flex items-center justify-center text-[8px] font-mono font-bold uppercase shadow-sm">
                                  मूलांक जोड़ा
                                </span>
                              )}
                              {box.isDriverReinforced && (
                                <span title="मूलांक द्वारा मजबूत (Driver Reinforced)" className="px-1.5 h-4 rounded-md bg-amber-600 text-white border border-amber-700 flex items-center justify-center text-[8px] font-mono font-bold uppercase shadow-sm">
                                  मूलांक मजबूत
                                </span>
                              )}
                              {box.isDestinyLayer && (
                                <span title="भाग्यांक द्वारा जोड़ा गया (Destiny Layer Added)" className="px-1.5 h-4 rounded-md bg-blue-600 text-white border border-blue-700 flex items-center justify-center text-[8px] font-mono font-bold uppercase shadow-sm">
                                  भाग्यांक जोड़ा
                                </span>
                              )}
                              {box.isDestinyReinforced && (
                                <span title="भाग्यांक द्वारा मजबूत (Destiny Reinforced)" className="px-1.5 h-4 rounded-md bg-indigo-500 text-white border border-indigo-600 flex items-center justify-center text-[8px] font-mono font-bold uppercase shadow-sm">
                                  भाग्यांक मजबूत
                                </span>
                              )}
                              {box.count === 0 && !box.isDriverLayer && !box.isDestinyLayer && (
                                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">अनुपस्थित</span>
                              )}
                            </div>
                          </div>

                          {/* Info overlay inside Box for details */}
                          <div className="text-right mt-auto">
                            <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-600 truncate">
                              {box.element}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  <div className="flex gap-4 items-center justify-center text-[10px] font-mono flex-wrap bg-[#F8F4EF] p-4 rounded-2xl">
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded"></span><span>काष्ठ तत्व (Wood)</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-red-100 border border-red-300 rounded"></span><span>अग्नि तत्व (Fire)</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-amber-100 border border-amber-300 rounded"></span><span>पृथ्वी तत्व (Earth)</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-slate-200 border border-slate-400 rounded"></span><span>धातु तत्व (Metal)</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-blue-100 border border-blue-300 rounded"></span><span>जल तत्व (Water)</span></div>
                  </div>
                </div>
              </div>

              {/* Box 2: Box Diagnostic Drawer (Right, span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {selectedBoxDigit !== null ? (
                  (() => {
                    const box = analysisResult.loshuGrid[selectedBoxDigit];
                    const isMissing = box.count === 0;
                    const hasDriver = analysisResult.mulank === selectedBoxDigit;
                    const hasBhagyank = analysisResult.bhagyank === selectedBoxDigit;

                    return (
                      <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 flex flex-col justify-between min-h-full">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start border-b border-[#E5E7EB]/70 pb-4">
                            <div className="text-left space-y-1">
                              <span className="text-[9px] font-mono uppercase text-[#D97706] tracking-widest font-bold">चयनित अंक विश्लेषण (Selected Node)</span>
                              <h3 className="font-playfair text-2.5xl font-extrabold text-[#1F2937]">
                                ग्रिड बॉक्स: अंक #{selectedBoxDigit}
                              </h3>
                            </div>
                            <div className="text-right">
                              {getElementBadge(box.element)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[#F8F4EF]/80 border border-[#E5E7EB] rounded-2xl text-left">
                              <span className="block text-[8px] font-mono uppercase text-slate-500 tracking-wider">वास्तु दिशा (Direction)</span>
                              <span className="text-sm text-[#1F2937] font-bold mt-1 block">{box.direction} (दिशा)</span>
                            </div>
                            <div className="p-4 bg-[#F8F4EF]/80 border border-[#E5E7EB] rounded-2xl text-left">
                              <span className="block text-[8px] font-mono uppercase text-slate-500 tracking-wider">प्रभावित जीवन क्षेत्र (Life Domain)</span>
                              <span className="text-sm text-[#1F2937] font-bold mt-1 block select-all">{box.lifeArea}</span>
                            </div>
                          </div>

                          <div className="space-y-4 pt-2">
                            <span className="text-[10px] font-mono uppercase text-[#D97706] tracking-widest block font-bold border-b border-slate-100 pb-1 text-left">स्तरीय ग्रिड विश्लेषण (Layered Grid Audit)</span>
                            
                            {/* Layer 1: Birth Grid Analysis (Birth Layer) */}
                            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left space-y-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                1. जन्म ग्रिड स्तर (Birth Layer - DOB)
                              </span>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-700">जन्म ग्रिड स्थिति (Birth Grid Status):</span>
                                <span className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                                  box.dobCount && box.dobCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {box.dobCount && box.dobCount > 0 ? `मौजूद (${box.dobCount} बार)` : 'मौजूद नहीं (0 बार)'}
                                </span>
                              </div>
                              <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                {box.dobCount && box.dobCount > 0 
                                  ? `अंक #${selectedBoxDigit} आपकी जन्म तारीख में प्राकृतिक रूप से मौजूद है (${box.dobCount} बार)। यह आपके जीवन में ${box.lifeArea} के क्षेत्र में जन्मजात संतुलन और स्थिर ऊर्जा प्रदान करता है।`
                                  : `अंक #${selectedBoxDigit} आपकी जन्म तारीख में नहीं है। यह जन्म स्तर पर अनुपस्थित है, जो कि ${box.lifeArea} के क्षेत्र में एक प्रारंभिक शून्यता को दर्शाता है।`
                                }
                              </p>
                            </div>

                            {/* Layer 2: Driver Influence (Driver Layer) */}
                            {hasDriver ? (
                              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 text-left space-y-1.5">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  2. मूलांक प्रभाव स्तर (Driver Layer - Mulank)
                                </span>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-slate-700">मूलांक स्थिति (Driver Status):</span>
                                  <span className="font-mono text-xs font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                    {box.isDriverReinforced ? `प्रभाव मजबूत / Reinforced (#${analysisResult.mulank})` : `ग्रिड में जोड़ा गया / Added (#${analysisResult.mulank})`}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-xs leading-relaxed font-sans font-medium">
                                  {box.isDriverReinforced 
                                    ? `आपका मूलांक ${analysisResult.mulank} है और यह आपकी जन्म तारीख में पहले से मौजूद है, इसलिए इसे 'Driver Reinforced' (प्रभाव मजबूत) माना गया है।`
                                    : `आपका मूलांक ${analysisResult.mulank} है और यह आपकी जन्म तारीख में मौजूद नहीं था, इसलिए LeoFamily Enhanced Grid में ${analysisResult.mulank} को मूलांक स्तर (Driver Layer) के रूप में जोड़कर इस क्षेत्र को सक्रिय किया गया है।`
                                  }
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/30 text-left text-[11px] text-slate-400 italic font-mono">
                                मूलांक #{analysisResult.mulank} दूसरे बॉक्स को नियंत्रित करता है। इस बॉक्स पर कोई प्रत्यक्ष मूलांक प्रभाव नहीं है।
                              </div>
                            )}

                            {/* Layer 3: Bhagyank Influence (Destiny Layer) */}
                            {hasBhagyank ? (
                              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 text-left space-y-1.5">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E3A8A] block flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                                  3. भाग्यांक प्रभाव स्तर (Destiny Layer - Bhagyank)
                                </span>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-slate-700">भाग्यांक स्थिति (Destiny Status):</span>
                                  <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    {box.isDestinyReinforced ? `प्रभाव मजबूत / Reinforced (#${analysisResult.bhagyank})` : `ग्रिड में जोड़ा गया / Added (#${analysisResult.bhagyank})`}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-xs leading-relaxed font-sans font-medium">
                                  {box.isDestinyReinforced 
                                    ? `आपका भाग्यांक ${analysisResult.bhagyank} है और यह आपकी जन्म तारीख में पहले से मौजूद है, इसलिए LeoFamily Enhanced Grid में इसे 'Destiny Reinforced' (भाग्य प्रभाव मजबूत) के रूप में चिन्हित किया गया है।`
                                    : `आपका भाग्यांक ${analysisResult.bhagyank} है और यह आपकी जन्म तारीख में मौजूद नहीं था, इसलिए LeoFamily Enhanced Grid में ${analysisResult.bhagyank} को भाग्य स्तर (Destiny Layer) के रूप में जोड़ा गया है।`
                                  }
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/30 text-left text-[11px] text-slate-400 italic font-mono">
                                भाग्यांक #{analysisResult.bhagyank} दूसरे बॉक्स को संचालित करता है। इस बॉक्स पर कोई प्रत्यक्ष भाग्यांक सुदृढ़ीकरण नहीं है।
                              </div>
                            )}

                            {/* Layer 4: Combined Energy Analysis */}
                            <div className="p-4 rounded-2xl border border-[#D97706]/20 bg-[#FDFCF7] text-left space-y-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B45309] block flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
                                4. संयुक्त फल एवं मार्गदर्शन (Combined Interpretation)
                              </span>
                              <p className="text-slate-700 text-xs leading-relaxed font-sans font-medium">
                                {(() => {
                                  let explanation = `अंक #${selectedBoxDigit} का संयुक्त फल: `;
                                  if (box.dobCount && box.dobCount > 0) {
                                    explanation += `यह अंक आपकी जन्म कुंडली में पहले से सक्रिय आधारशिला रखता है। `;
                                    if (hasDriver && hasBhagyank) {
                                      explanation += `मूलांक और भाग्यांक दोनों का एक साथ इस अंक पर प्रभाव होने से यह आपके जीवन का सबसे शक्तिशाली केंद्र बन जाता है, जो ${box.lifeArea} में अद्वितीय सफलता प्रदान करता है।`;
                                    } else if (hasDriver) {
                                      explanation += `क्योंकि आपका मूलांक भी यही है, आप अपने सचेत प्रयासों और निर्णयों से इस क्षेत्र की क्षमताओं को भरपूर रूप से निखारते हैं।`;
                                    } else if (hasBhagyank) {
                                      explanation += `क्योंकि आपका भाग्यांक भी यही है, उम्र बढ़ने के साथ-साथ यह क्षेत्र आपके करियर और सामाजिक प्रतिष्ठा का सबसे मुख्य आधार बनेगा।`;
                                    } else {
                                      explanation += `यह आपकी जन्मजात शक्ति है, जो बिना किसी अतिरिक्त प्रयास के आपके जीवन को संतुलित बनाए रखती है।`;
                                    }
                                  } else {
                                    explanation += `जन्म तारीख में यह अंक मौजूद नहीं था। `;
                                    if (hasDriver && hasBhagyank) {
                                      explanation += `लेकिन मूलांक और भाग्यांक दोनों के यहाँ केंद्रित होने से आपके जीवन के अनुभव और कर्म इस कमी को पूरी तरह भरकर इसे आपकी सबसे बड़ी ताकत बना देते हैं।`;
                                    } else if (hasDriver) {
                                      explanation += `मूलांक #${analysisResult.mulank} होने के कारण आपकी दैनिक कार्यशैली और निर्णय इस कमी को सचेत रूप से पूरा करते हैं।`;
                                    } else if (hasBhagyank) {
                                      explanation += `भाग्यांक #${analysisResult.bhagyank} होने के कारण जीवन की परिस्थितियाँ आपको इस क्षेत्र में निपुण बनने के लगातार अवसर प्रदान करेंगी।`;
                                    } else {
                                      explanation += `मूलांक या भाग्यांक का सीधा सहयोग न होने से यह एक मुख्य 'कार्मिक पाठ' (Karmic Lesson) है। इसके संतुलन के लिए नीचे दिए गए लाल किताब व वास्तु उपायों का पालन करना लाभकारी रहेगा।`;
                                    }
                                  }
                                  return explanation;
                                })()}
                              </p>
                            </div>
                          </div>

                          {/* Specialized remediation display */}
                          {isMissing ? (
                            <div className="space-y-2 pt-2 text-left">
                              <span className="text-[10px] font-mono uppercase text-[#D97706] tracking-widest block font-bold">लाल किताब सरल उपाय (Remedy)</span>
                              <p className="text-xs text-slate-700 leading-relaxed italic bg-[#F2E8DC]/40 p-4 rounded-xl border border-[#D97706]/10">
                                "{analysisResult.missingNumbers.find(m => m.digit === selectedBoxDigit)?.remedy || 'दैनिक जीवन में इस तत्व के अनुकूल रंगों और वस्तुओं का उपयोग करें।'}"
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 pt-2 text-left">
                              <span className="text-[10px] font-mono uppercase text-emerald-700 tracking-widest block font-bold">पुनरावृत्ति प्रभाव (Repetition Impact)</span>
                              <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/20 p-4 rounded-xl border border-emerald-500/10">
                                {analysisResult.repeatedNumbers.find(r => r.digit === selectedBoxDigit)?.meaning || 'यह अंक जीवन में स्थिर और सकारात्मक ऊर्जा प्रदान करता है।'}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-[#E5E7EB] text-center">
                          <span className="text-[10px] font-sans text-slate-400">ग्रिड के अन्य अंकों पर क्लिक करके उनका विस्तृत विश्लेषण देखें।</span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm flex items-center justify-center text-slate-400 h-full min-h-[300px]">
                    तत्व एवं ग्रहों का विश्लेषण देखने के लिए बाईं ओर लोशू ग्रिड के किसी भी अंक पर क्लिक करें।
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PLANES & ARROWS */}
          {activeSubTab === 'PLANES' && (
            <div className="space-y-8 animate-in duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Active strength planes / Rajyogas */}
                <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6 text-left">
                  <div className="flex gap-3 items-center">
                    <span className="text-3xl text-amber-500">🏆</span>
                    <div className="space-y-0.5">
                      <h3 className="font-playfair text-lg font-bold text-[#1F2937]">सक्रिय राजयोग एवं शक्ति प्लेन (Strength Arrows)</h3>
                      <p className="text-xs text-slate-500">पूर्ण पंक्तियाँ, स्तंभ या विकर्ण जो प्रबल भाग्य और क्षमताओं को दर्शाते हैं।</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {analysisResult.strengthArrows.length > 0 ? (
                      analysisResult.strengthArrows.map((plane, idx) => (
                        <div key={idx} className="p-5 bg-emerald-50/30 border border-emerald-200 rounded-2xl space-y-2 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-emerald-800">{plane.name} ({plane.title})</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono px-2.5 py-0.5 rounded-full font-extrabold uppercase">सक्रिय (Present)</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed select-all">
                            अंक {plane.digits.join(', ')} मौजूद हैं। {plane.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 bg-slate-50 border border-[#E5E7EB] rounded-2xl text-center text-slate-500 space-y-2">
                        <Award className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs text-[#1F2937] font-semibold">कोई पूर्ण शक्ति प्लेन उपस्थित नहीं है</p>
                        <p className="text-[10px] text-slate-400">सभी प्लेन वर्तमान में आंशिक या सामान्य संतुलन अवस्था में हैं।</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty / Weakness Arrows */}
                <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6 text-left">
                  <div className="flex gap-3 items-center">
                    <span className="text-3xl text-red-500">⚠️</span>
                    <div className="space-y-0.5">
                      <h3 className="font-playfair text-lg font-bold text-[#1F2937]">दुर्बलता एवं रिक्त प्लेन (Weakness Arrows)</h3>
                      <p className="text-xs text-slate-500">पूरी तरह से खाली रेखाएं जो कुछ तत्वों की कमी की ओर इशारा करती हैं।</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {analysisResult.weaknessArrows.length > 0 ? (
                      analysisResult.weaknessArrows.map((plane, idx) => (
                        <div key={idx} className="p-5 bg-red-50/30 border border-red-200 rounded-2xl space-y-3 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-red-800">{plane.name}</span>
                            <span className="bg-red-100 text-red-800 text-[9px] font-mono px-2.5 py-0.5 rounded-full font-extrabold uppercase">अनुपस्थित (Weak)</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed select-all">
                            अंक {plane.digits.join(', ')} पूर्णतः अनुपस्थित हैं। {plane.description}
                          </p>
                          <div className="bg-[#F2E8DC]/40 p-3 rounded-xl border border-[#D97706]/15 space-y-1">
                            <span className="block text-[8px] font-mono text-[#D97706] uppercase tracking-wider font-bold">सरल वैदिक उपाय (Remedy)</span>
                            <span className="text-[11px] text-slate-700 block italic leading-relaxed">"{plane.remedy?.split('|')[0] || 'संतुलन हेतु संबंधित रंगों और वस्तुओं का प्रयोग करें।'}"</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-center text-emerald-800 space-y-2">
                        <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
                        <p className="text-xs text-emerald-800 font-semibold">कोई दुर्बलता प्लेन उपस्थित नहीं है</p>
                        <p className="text-[10px] text-slate-500">शुभ योग! हर प्लेन में कम से कम एक अंक सक्रिय है, जिससे कोई भी ऊर्जा चक्र पूरी तरह खाली नहीं है।</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Standard Planes visual key index */}
              <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-4 text-left">
                <h4 className="font-playfair text-lg font-bold text-[#1F2937]">लोशू ग्रिड मुख्य प्लेन्स संदर्भ निर्देशिका (Reference Guide)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">मानसिक प्लेन (Mental Plane: 4-9-2)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">गहन विचारशीलता, शोध, तार्किक क्षमता और स्मरण शक्ति का प्रतीक।</span>
                  </div>
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">भावनात्मक प्लेन (Emotional Plane: 3-5-7)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">सहज ज्ञान (Intuition), कला, दयालुता और उच्च मानवीय संवेदनाओं का केंद्र।</span>
                  </div>
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">व्यावहारिक प्लेन (Practical Plane: 8-1-6)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">व्यावहारिक व्यापारिक समझ, भौतिक कार्यक्षमता और धन प्रबंधन।</span>
                  </div>
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">गोल्डन राजयोग (Prosperity Plane: 4-5-6)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">अत्यंत शुभ स्वर्णिम राजयोग, जो अपार धन, प्रतिष्ठा और नेतृत्व क्षमता देता है।</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REMEDIES ALTAR */}
          {activeSubTab === 'REMEDIES' && (
            <div className="space-y-8 animate-in duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                
                {/* Colors Altar */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                  <span className="text-3xl">🎨</span>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">शुभ रंग (Lucky Colors)</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysisResult.luckyDetails.colors.map((color, idx) => (
                      <span key={idx} className="bg-[#F8F4EF] text-[#D97706] border border-[#D97706]/15 rounded-xl px-4 py-2 text-xs font-semibold">
                        {color}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-[10px]">ऊर्जा संतुलन के लिए कपड़ों, ऑफिस की फाइलों और दैनिक उपयोग में इन रंगों को प्राथमिकता दें।</p>
                </div>

                {/* Gemstone Altar */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                  <span className="text-3xl">💎</span>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">अनुकूल रत्न (Cosmic Gemstones)</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysisResult.luckyDetails.gemstones.map((gem, idx) => (
                      <span key={idx} className="bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-xl px-4 py-2 text-xs font-semibold">
                        {gem}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-[10px]">शुभ वार को सूर्योदय के समय उपयुक्त धातु में धारण करें। धारण से पहले परामर्श लेना उत्तम है।</p>
                </div>

                {/* Lucky Numbers list */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                  <span className="text-3xl">⚜️</span>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">शुभ एवं मित्र अंक (Lucky Numbers)</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysisResult.luckyDetails.numbers.map((numVal, idx) => (
                      <span key={idx} className="w-9 h-9 rounded-full bg-amber-50 text-[#D97706] border border-[#D97706]/20 flex items-center justify-center font-bold text-xs">
                        {numVal}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-[10px]">नया खाता खोलने, वाहन/मकान नंबर, लॉकर कॉम्बिनेशन व महत्वपूर्ण कार्यों के लिए अत्यंत शुभ।</p>
                </div>

              </div>

              {/* Personalized remedies guide list */}
              <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6 text-left">
                <div className="flex gap-4 items-center">
                  <span className="text-3xl">🛡️</span>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wide">व्यक्तिगत लाल किताब एवं वैदिक उपाय (Lal Kitab & Vastu Guidelines)</h3>
                    <p className="text-[#6B7280] text-xs">ग्रह दोषों के शमन और ग्रिड की ऊर्जा को सक्रिय करने के लिए इन सरल उपायों का नियमित पालन करें।</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {analysisResult.luckyDetails.remedies.map((rem, idx) => (
                    <div key={idx} className="p-4 bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl flex gap-3 text-left">
                      <Check className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-semibold leading-relaxed select-all">{rem}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: MAHADASHAS & PERIODS */}
          {activeSubTab === 'PERIODS' && (
            <div className="space-y-8 animate-in duration-500 select-all">
              
              {/* Highlight Active Dasha Box */}
              {analysisResult.currentMahadasha && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-8 rounded-[40px] shadow-lg relative overflow-hidden border border-[#D97706]/40 text-left">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_0.75px,transparent_0.75px)] [background-size:24px_24px]"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 text-left">
                      <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-3.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold border border-white/20">
                        ⚡ सक्रिय ग्रह महादशा चक्र (Active Mahadasha)
                      </span>
                      <h3 className="font-playfair text-2.5xl font-black">
                        वर्तमान महादशा: {analysisResult.currentMahadasha.planet}
                      </h3>
                      <p className="text-amber-50 text-xs font-semibold">
                        आयु वर्ग: {analysisResult.currentMahadasha.startAge} - {analysisResult.currentMahadasha.endAge} वर्ष (वर्ष {analysisResult.currentMahadasha.startYear} से {analysisResult.currentMahadasha.endYear} तक)
                      </p>
                      <p className="text-amber-100 text-xs max-w-2xl pt-1">
                        {analysisResult.currentMahadasha.meaning}
                      </p>
                    </div>

                    {analysisResult.currentAntardasha && (
                      <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-left space-y-1 min-w-[240px]">
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-amber-200 font-bold">वर्तमान अंतर्दशा (Antardasha)</span>
                        <span className="text-sm font-bold block">{analysisResult.currentAntardasha.planet} की अंतर्दशा</span>
                        <span className="block text-[10px] text-amber-100 italic leading-relaxed pt-1">
                          {analysisResult.currentAntardasha.meaning.split('.')[0]}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Complete chronologial lifespan table */}
              <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                  <h3 className="font-playfair text-xl font-bold text-[#1F2937]">वैदिक अंकज्योतिष महादशा जीवन चक्र (Mahadasha Timeline)</h3>
                  <span className="text-[10px] font-mono text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/20 px-3 py-1 rounded-full uppercase font-bold">100-वर्षीय जीवन चक्र</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead className="bg-[#F8F4EF]/75 font-mono text-slate-500 uppercase tracking-wider text-[9px] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="p-4 font-bold">स्वामी ग्रह (Planet)</th>
                        <th className="p-4 font-bold">अवधि (Length)</th>
                        <th className="p-4 font-bold">आयु अंतराल (Age Range)</th>
                        <th className="p-4 font-bold">वर्ष अवधि (Years)</th>
                        <th className="p-4 font-bold">मुख्य प्रभाव एवं फल (Impact)</th>
                        <th className="p-4 font-bold">स्थिति (Status)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] font-sans text-[#1F2937]">
                      {analysisResult.mahadashas.map((dasha, idx) => (
                        <tr 
                          key={idx}
                          className={`hover:bg-[#F8F4EF]/20 transition-all ${
                            dasha.isCurrent ? 'bg-amber-50/50 font-semibold border-y border-amber-200' : ''
                          }`}
                        >
                          <td className="p-4 flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center font-mono text-[9px] text-[#D97706]">
                              {dasha.rulerNumber}
                            </span>
                            <span className="font-semibold">{dasha.planet}</span>
                          </td>
                          <td className="p-4 font-mono">{dasha.durationYears} वर्ष</td>
                          <td className="p-4">{dasha.startAge} से {dasha.endAge} वर्ष</td>
                          <td className="p-4 font-mono text-slate-500">{dasha.startYear} से {dasha.endYear}</td>
                          <td className="p-4 text-slate-500 font-lora italic truncate max-w-xs" title={dasha.meaning}>
                            {dasha.meaning.substring(0, 70)}...
                          </td>
                          <td className="p-4">
                            {dasha.isCurrent ? (
                              <span className="bg-[#D97706] text-white text-[8px] font-mono font-bold uppercase py-1 px-3 rounded-full tracking-wider shadow-inner">
                                वर्तमान सक्रिय
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-[9px]">निष्क्रिय</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pinnacles & Challenges side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 select-all">
                
                {/* Pinnacle Cycles */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6 text-left border-l-4 border-l-[#D97706]">
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">शिखर काल चक्र (Pinnacle Cycles)</h3>
                  <div className="space-y-4">
                    {analysisResult.pinnacles.map((p, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/50">
                        <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-black font-mono text-xs border border-[#D97706]/20">
                          #{p.pinnacle}
                        </span>
                        <div>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">चरण {p.cycle}: {p.ageRange}</span>
                          <p className="text-[#1F2937] text-xs font-semibold leading-relaxed mt-0.5 italic">"{p.meaning}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6 text-left border-l-4 border-l-[#1E3A8A]">
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">जीवन की चुनौतियाँ (Vedic Challenges)</h3>
                  <div className="space-y-4">
                    {analysisResult.challenges.map((c, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 bg-blue-50/20 rounded-2xl border border-blue-200/50">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center font-black font-mono text-xs border border-blue-200">
                          #{c.challenge}
                        </span>
                        <div>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">चुनौती चरण {c.cycle}</span>
                          <p className="text-[#1F2937] text-xs font-semibold leading-relaxed mt-0.5 italic">"{c.meaning}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: GRID COMPATIBILITY */}
          {activeSubTab === 'COMPATIBILITY' && (
            <div className="space-y-8 animate-in duration-500">
              
              <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6 text-left">
                <div className="text-left space-y-1">
                  <span className="text-[9px] font-mono uppercase text-[#D97706] tracking-widest font-bold">ग्रिड कुंडली मिलान (Grid Synastry)</span>
                  <h3 className="font-playfair text-xl font-bold text-[#1F2937]">द्वैत लोशू ग्रिड अनुकूलता मिलान (Dual Grid Compatibility)</h3>
                  <p className="text-slate-500 text-xs">
                    अपने जीवनसाथी, बिजनेस पार्टनर या परिवार के सदस्य का विवरण दर्ज करें ताकि दोनों ग्रिड के ओवरलैप होने वाले प्लेन और संबंधों की अनुकूलता का सटीक विश्लेषण प्राप्त हो सके।
                  </p>
                </div>

                <form onSubmit={handleCalculateCompatibility} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase text-[#6B7280]">साथी का पूरा नाम (Partner's Name)</label>
                    <input
                      type="text"
                      placeholder="नाम दर्ज करें"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      required
                      className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl px-5 py-3.5 outline-none text-xs text-[#1F2937]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase text-[#6B7280]">साथी की जन्म तारीख (Partner's DOB)</label>
                    <DateInput
                      id="partner-dob-input"
                      value={partnerDob}
                      onChange={setPartnerDob}
                      required
                      className="py-3.5 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-4 rounded-2xl transition text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    ग्रिड अनुकूलता मिलान करें (Compare Grids)
                  </button>
                </form>
              </div>

              {partnerResult && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left select-all"
                >
                  
                  {/* Radial Synastry Compass (Left) */}
                  <motion.div 
                    variants={itemVariants}
                    className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm flex flex-col justify-center items-center text-center space-y-6"
                  >
                    <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider font-bold">अनुकूलता सामंजस्य स्कोर (Resonance Rating)</span>
                    
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#F8F4EF" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#D97706"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - partnerResult.score / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center select-none">
                        <span className="text-5xl font-playfair font-black text-[#1F2937]">{partnerResult.score}%</span>
                        <span className="block text-[8px] font-mono text-slate-500 uppercase mt-1 font-bold">ग्रहीय सामंजस्य (Planetary Harmony)</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">वैदिक निर्णय (Verdict)</span>
                      <p className="font-playfair text-lg text-[#1F2937] font-extrabold uppercase tracking-widest">{partnerResult.verdict}</p>
                    </div>
                  </motion.div>

                  {/* Detailed Forecast Breakdown (Right) */}
                  <motion.div 
                    variants={itemVariants}
                    className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6"
                  >
                    <h4 className="font-playfair text-xl font-bold text-[#1F2937] pb-2 border-b border-[#E5E7EB]">ग्रहीय अनुकूलता रिपोर्ट (Affinity Report)</h4>
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                      
                      <div>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">अनुकूलता श्रेणी (Grade)</span>
                        <p className="font-semibold text-[#1F2937] mt-1 select-all">श्रेणी: {partnerResult.grade}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">साझे सक्रिय प्लेन्स (Overlap Planes)</span>
                        {partnerResult.overlapPlanes.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
                            {partnerResult.overlapPlanes.map((o, idx) => <li key={idx}>{o}</li>)}
                          </ul>
                        ) : (
                          <p className="text-slate-400 italic mt-1">कोई मुख्य साझा शक्ति प्लेन मौजूद नहीं है।</p>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">परस्पर शक्तियां एवं सहयोग (Mutual Strengths)</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
                          {partnerResult.mutualStrengths.map((m, idx) => <li key={idx}>{m}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 bg-[#F2E8DC]/40 border border-[#D97706]/10 rounded-xl">
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold mb-1">संबंध व साझेदारी भविष्यफल (Forecast)</span>
                        <p className="italic text-slate-800 font-medium">"{partnerResult.partnershipForecast}"</p>
                      </div>

                    </div>
                  </motion.div>

                </motion.div>
              )}

            </div>
          )}

          {/* TAB 6: GURU AI REPORT */}
          {activeSubTab === 'AI_REPORT' && (
            <div className="space-y-6 animate-in duration-500">
              
              <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4 text-left">
                <div className="flex gap-4 items-center">
                  <div className="bg-amber-100 p-3 rounded-full text-2xl">🔮</div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-[#1F2937]">विस्तृत एस्ट्रो-गुरु परामर्श रिपोर्ट (Gemini AI Report)</h3>
                    <p className="text-slate-500 text-xs">सर्वर-साइड जेमिनी AI के माध्यम से शुद्ध, स्वाभाविक और आदरपूर्ण हिंदी में एक संपूर्ण व्यक्तिगत अंकज्योतिष रिपोर्ट तैयार करें।</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleGenerateAIReport}
                    disabled={loadingReport}
                    className="bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer disabled:bg-slate-300 flex items-center gap-2 shadow-lg"
                  >
                    {loadingReport ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> ग्रहीय गणनाएं एकत्रित हो रही हैं...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-bounce" /> संपूर्ण हिंदी AI रिपोर्ट तैयार करें
                      </>
                    )}
                  </button>
                  
                  {aiReport && (
                    <button
                      onClick={() => setShowRawJSON(!showRawJSON)}
                      className="bg-[#F8F4EF] hover:bg-[#F2E8DC] text-[#1F2937] px-6 py-3.5 rounded-2xl text-xs font-semibold tracking-wider uppercase border border-[#E5E7EB]"
                    >
                      {showRawJSON ? 'JSON स्कीमा छिपाएं' : 'JSON स्कीमा देखें'}
                    </button>
                  )}
                </div>

                {reportError && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex gap-2 items-center">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{reportError}</span>
                  </div>
                )}
              </div>

              {/* Collapsed Structured Developer JSON view */}
              {showRawJSON && (
                <div className="p-6 bg-slate-900 text-slate-300 rounded-[30px] font-mono text-[11px] select-all overflow-x-auto border-t-4 border-t-[#D97706] text-left">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
                    <span className="text-amber-400 font-bold uppercase text-[9px] tracking-widest">सक्रिय लोशू API स्कीमा (Active Loshu API Schema)</span>
                    <span className="text-slate-500">बाहरी सिस्टम एकीकरण हेतु तैयार</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{analysisResult.rawJSON}</pre>
                </div>
              )}

              {/* Renders generated markdown Report */}
              {aiReport ? (
                <div className="bg-white p-8 md:p-12 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-8 select-all text-left max-w-4xl mx-auto border-t-8 border-t-[#D97706] print:border-none print:shadow-none print:p-0">
                  <div className="text-center space-y-3 pb-6 border-b border-slate-200">
                    <span className="text-3xl">⚜️</span>
                    <h2 className="font-cinzel text-2.5xl font-extrabold tracking-widest text-[#1F2937] uppercase">लोशू ग्रिड आध्यात्मिक महावेध (Loshu Life Map)</h2>
                    <span className="text-[#D97706] font-mono text-[10px] tracking-widest uppercase font-bold">व्यक्तिगत परामर्श रिपोर्ट: {analysisResult.personalDetails.name}</span>
                  </div>
                  
                  <div className="markdown-body space-y-6 text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap select-all">
                    {aiReport}
                  </div>

                  <div className="pt-8 border-t border-slate-200 text-center flex flex-col items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">परामर्श रिपोर्ट समाप्त • Leo Occult Sciences</span>
                    <button
                      onClick={handlePrint}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> रिपोर्ट प्रिंट / एक्सपोर्ट करें (Export Report)
                    </button>
                  </div>
                </div>
              ) : (
                !loadingReport && (
                  <div className="p-16 text-center text-slate-400 bg-white border border-[#E5E7EB] rounded-[40px] space-y-3">
                    <StarsPlaceholder />
                    <p className="text-xs text-[#1F2937] font-semibold">आपकी AI परामर्श रिपोर्ट तैयार होने की प्रतीक्षा में है।</p>
                    <p className="text-[10px] max-w-xs mx-auto">सभी ग्रिड निर्देशांकों के आधार पर विस्तृत परामर्श रिपोर्ट तैयार करने के लिए ऊपर "संपूर्ण हिंदी AI रिपोर्ट तैयार करें" पर क्लिक करें।</p>
                  </div>
                )
              )}

            </div>
          )}

          {/* TAB 7: STRUCTURED DEVELOPER JSON */}
          {activeSubTab === 'HISTORY' && (
            <div className="space-y-6 animate-in duration-500 text-left select-all">
              <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-4 text-left">
                <h3 className="font-playfair text-xl font-bold text-[#1F2937]">संरचित डेवलपर JSON आउटपुट स्कीमा (Structured JSON)</h3>
                <p className="text-slate-500 text-xs">
                  नीचे लोशू ग्रिड और सभी ज्योतिषीय गणनाओं का मशीन-पठनीय JSON ऑब्जेक्ट है। यह भविष्य के API या डेटाबेस एकीकरण के लिए पूर्णतः संगत है।
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      const blob = new Blob([analysisResult.rawJSON], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `loshu_${analysisResult.personalDetails.name.toLowerCase().replace(/\s+/g,'_')}.json`;
                      a.click();
                    }}
                    className="bg-[#1F2937] text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl hover:bg-black transition flex items-center gap-2 w-full md:w-auto justify-center"
                  >
                    <Download className="w-4 h-4" /> JSON फाइल डाउनलोड करें (Download JSON)
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-900 text-slate-300 rounded-[30px] font-mono text-[11px] overflow-x-auto border-t-4 border-t-[#D97706]">
                <pre className="whitespace-pre-wrap">{analysisResult.rawJSON}</pre>
              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="p-16 text-center text-slate-400 bg-white border border-[#E5E7EB] rounded-[40px] space-y-4">
          <Compass className="w-12 h-12 text-[#D97706]/40 mx-auto animate-spin-slow" />
          <h3 className="font-playfair text-xl font-bold text-[#1F2937]">अपनी लोशू ग्रिड कुंडली बनाएं</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed text-slate-500">
            कृपया संपूर्ण 19-स्तरीय अंकज्योतिष और लोशू ग्रिड विश्लेषण देखने के लिए ऊपर अपना नाम और जन्म तारीख दर्ज करें।
          </p>
        </div>
      )}

    </div>
  );
};

// Simple visual spacer icon
const StarsPlaceholder = () => (
  <div className="flex gap-1 justify-center text-[#D97706]/35 my-2">
    <Star className="w-5 h-5 fill-current" />
    <Star className="w-5 h-5 fill-current scale-120 text-[#D97706]" />
    <Star className="w-5 h-5 fill-current" />
  </div>
);

export default CompleteLoshuGridAnalysis;
