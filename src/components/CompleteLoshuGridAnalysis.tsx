import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  computeLoshuAnalysis, 
  performLoshuCompatibility, 
  LoshuAnalysisResult, 
  LoshuGridBox, 
  CompatibilityAnalysisResult 
} from '../services/loshuEngine';
import { 
  Calendar, User, Compass, HelpCircle, Sparkles, RefreshCw, Star, 
  Trash2, Heart, Shield, BookOpen, Layers, Award, FileText, Download, 
  Check, AlertCircle, Eye, Info, ShieldCheck, ArrowRight, CheckCircle, Flame, Droplet, Trees, Hammer, Landmark, Printer
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

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

interface CompleteLoshuGridAnalysisProps {
  initialProfile?: { name: string; dob: string; gender: string } | null;
}

export const CompleteLoshuGridAnalysis: React.FC<CompleteLoshuGridAnalysisProps> = ({ initialProfile }) => {
  // Main states
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [analysisResult, setAnalysisResult] = useState<LoshuAnalysisResult | null>(null);
  
  // Tab control inside Loshu Analysis
  const [activeSubTab, setActiveSubTab] = useState<'GRID' | 'PLANES' | 'REMEDIES' | 'PERIODS' | 'COMPATIBILITY' | 'AI_REPORT' | 'HISTORY'>('GRID');
  
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
    }
  }, [initialProfile]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    
    const finalName = name.trim() || 'Fate seeker';
    const analysis = computeLoshuAnalysis(dob, finalName, gender);
    setAnalysisResult(analysis);
    
    // Save to history list
    const newHistoryItem = {
      id: Date.now().toString(),
      name: finalName,
      dob,
      date: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
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
    const analysis = computeLoshuAnalysis(item.dob, item.name, gender);
    setAnalysisResult(analysis);
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
          <div className="inline-flex items-center gap-1.5 bg-[#D97706]/10 text-[#D97706] px-3.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border border-[#D97706]/20">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Complete Vedic Magic Matrix
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-[#1F2937] tracking-wider uppercase leading-tight">
            Complete Loshu Grid Analysis & Remedial Altar
          </h2>
          <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed font-lora italic pt-1">
            Map your Date of Birth onto the ancient 3x3 magic square. Decode psychic (Mulank) and conductor (Bhagyank) numbers, strength and weakness planes, active dasha cycles, and customized Lal Kitab remedies.
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
            <label className="block text-[10px] font-mono uppercase text-slate-500 tracking-widest font-bold">Subject's Full Name (for sound vibrations)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Raajeev Singh Chauhann"
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] focus:bg-white transition-all rounded-2xl pl-12 pr-5 py-4 outline-none text-sm text-[#1F2937] font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase text-[#D97706] tracking-widest font-bold">Select Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D97706]/70" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] focus:bg-white transition-all rounded-2xl pl-12 pr-4 py-4 outline-none text-sm text-[#1F2937] font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-4 rounded-2xl transition duration-300 text-xs tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-white hover:rotate-12 transition-transform" /> Cast Loshu Blueprint
          </button>
        </form>

        {/* Quick history selector */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-[#E5E7EB]">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Recent Blueprints: </span>
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => handleLoadHistoryItem(h)}
                className="inline-flex items-center gap-1.5 bg-[#F8F4EF] hover:bg-[#F2E8DC] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer border border-[#E5E7EB]/60 group text-[#1F2937]"
              >
                <span>{h.name} ({h.dob})</span>
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
                  <span className="text-[9px] font-mono uppercase bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 px-2.5 py-0.5 rounded-full font-bold">Psychic / Driver Number</span>
                  <h3 className="font-playfair text-2xl font-black text-[#1F2937]">मूलांक #{analysisResult.mulank}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                    Governs raw talent, personality traits, and default mental attributes. Triggers how you approach immediate decisions.
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
                  <span className="text-[9px] font-mono uppercase bg-blue-50 text-[#1E3A8A] border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">Conductor / Destiny Number</span>
                  <h3 className="font-playfair text-2xl font-black text-[#1F2937]">भाग्यांक #{analysisResult.bhagyank}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                    Governs life purpose, core destiny, career achievements, and major planetary direction changes.
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
                <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">Active Year Influence</span>
                <h3 className="font-playfair text-2xl font-black text-[#1F2937]">व्यक्तिगत वर्ष #{analysisResult.personalYear.number}</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                  Current personal year vibration. Focus: {analysisResult.personalYear.title.split(':')[0]}
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
              { id: 'GRID', label: 'Loshu Magic Grid' },
              { id: 'PLANES', label: 'Planes & Arrows' },
              { id: 'REMEDIES', label: 'Lal Kitab remedies' },
              { id: 'PERIODS', label: 'Mahadasha Lifespan' },
              { id: 'COMPATIBILITY', label: 'Grid Compatibility' },
              { id: 'AI_REPORT', label: 'Astro-Guru AI Report' },
              { id: 'HISTORY', label: 'Developer JSON Integration' }
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

          {/* TAB 1: GRID & BOX AUDITING */}
          {activeSubTab === 'GRID' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in duration-500">
              
              {/* Box 1: Interactive Loshu Grid 3x3 (Left, span 2) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 text-center select-none">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                    <span className="text-xs font-mono uppercase text-[#D97706] tracking-widest font-bold">Interactive Magic Square</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">Select boxes to audit details</span>
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
                      const style = getBoxElementStyle(box.element, box.count);
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

                          {/* Digit Counts */}
                          <div className="flex gap-0.5 justify-start">
                            {box.count > 0 ? (
                              Array.from({ length: Math.min(box.count, 4) }).map((_, i) => (
                                <span key={i} className="w-5 h-5 rounded-full bg-white/70 border border-slate-300 flex items-center justify-center text-[10px] font-mono font-black text-slate-800">
                                  {digit}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400 font-bold">MISSING</span>
                            )}
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
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded"></span><span>Wood Element</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-red-100 border border-red-300 rounded"></span><span>Fire Element</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-amber-100 border border-amber-300 rounded"></span><span>Earth Element</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-slate-200 border border-slate-400 rounded"></span><span>Metal Element</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-blue-100 border border-blue-300 rounded"></span><span>Water Element</span></div>
                  </div>
                </div>
              </div>

              {/* Box 2: Box Diagnostic Drawer (Right, span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {selectedBoxDigit !== null ? (
                  (() => {
                    const box = analysisResult.loshuGrid[selectedBoxDigit];
                    const isMissing = box.count === 0;

                    return (
                      <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-6 flex flex-col justify-between min-h-full">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start border-b border-[#E5E7EB]/70 pb-4">
                            <div className="text-left space-y-1">
                              <span className="text-[9px] font-mono uppercase text-[#D97706] tracking-widest font-bold">Selected Element Node</span>
                              <h3 className="font-playfair text-2.5xl font-extrabold text-[#1F2937]">
                                Plate Coordinates: Node #{selectedBoxDigit}
                              </h3>
                            </div>
                            <div className="text-right">
                              {getElementBadge(box.element)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[#F8F4EF]/80 border border-[#E5E7EB] rounded-2xl">
                              <span className="block text-[8px] font-mono uppercase text-slate-500 tracking-wider">Compass Direction</span>
                              <span className="text-sm text-[#1F2937] font-bold mt-1 block">{box.direction} (दिशा)</span>
                            </div>
                            <div className="p-4 bg-[#F8F4EF]/80 border border-[#E5E7EB] rounded-2xl">
                              <span className="block text-[8px] font-mono uppercase text-slate-500 tracking-wider">Governed Life Domain</span>
                              <span className="text-sm text-[#1F2937] font-bold mt-1 block select-all">{box.lifeArea}</span>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <span className="text-[10px] font-mono uppercase text-[#D97706] tracking-widest block font-bold">Vibrational State Analytics</span>
                            {isMissing ? (
                              <div className="p-5 rounded-2xl border border-red-200 bg-red-50/50 space-y-2">
                                <div className="flex items-center gap-2 text-red-700">
                                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                  <span className="text-xs font-bold uppercase tracking-wider">VIBRATION CONSTRAINED (Missing Digit)</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                  There is no instance of #{selectedBoxDigit} in your Date of Birth or key indexes. This denotes minor weaknesses or voids in your traits regarding <strong>{box.lifeArea}</strong>.
                                </p>
                              </div>
                            ) : (
                              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                                <div className="flex items-center gap-2 text-emerald-700">
                                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                  <span className="text-xs font-bold uppercase tracking-wider">RESONANCE FULL (Present: {box.count}x)</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                  Number #{selectedBoxDigit} is present {box.count} time(s). Sources: {box.sources.join(', ')}. Details: {box.meaning}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Specialized remediation display */}
                          {isMissing ? (
                            <div className="space-y-2 pt-2 text-left">
                              <span className="text-[10px] font-mono uppercase text-[#D97706] tracking-widest block font-bold">Actionable Lal Kitab Correction</span>
                              <p className="text-xs text-slate-700 leading-relaxed italic bg-[#F2E8DC]/40 p-4 rounded-xl border border-[#D97706]/10">
                                "{analysisResult.missingNumbers.find(m => m.digit === selectedBoxDigit)?.remedy || 'Apply appropriate color elements in daily wear.'}"
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 pt-2 text-left">
                              <span className="text-[10px] font-mono uppercase text-emerald-700 tracking-widest block font-bold">Repeating Counts Metaphysics</span>
                              <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/20 p-4 rounded-xl border border-emerald-500/10">
                                {analysisResult.repeatedNumbers.find(r => r.digit === selectedBoxDigit)?.meaning || 'Brings stable, predictable planetary waves.'}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-[#E5E7EB] text-center">
                          <span className="text-[10px] font-sans text-slate-400">Click other boxes on the grid to instantly view their core diagnostics.</span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm flex items-center justify-center text-slate-400 h-full min-h-[300px]">
                    Select any box on the magic Loshu Grid to audit its elemental parameters.
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
                      <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Active Strength Arrows (राजयोग)</h3>
                      <p className="text-xs text-slate-500">Full rows, columns, or diagonal lines indicating highly active fortunes.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {analysisResult.strengthArrows.length > 0 ? (
                      analysisResult.strengthArrows.map((plane, idx) => (
                        <div key={idx} className="p-5 bg-emerald-50/30 border border-emerald-200 rounded-2xl space-y-2 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-emerald-800">{plane.name} ({plane.title})</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono px-2.5 py-0.5 rounded-full font-extrabold uppercase">Present</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed select-all">
                            Contains coordinates {plane.digits.join(', ')}. {plane.description} Represents peak energetic strength.
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 bg-slate-50 border border-[#E5E7EB] rounded-2xl text-center text-slate-500 space-y-2">
                        <Award className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs text-[#1F2937] font-semibold">No Full Strength Planes Present</p>
                        <p className="text-[10px] text-slate-400">All planes are currently in partial or balanced equilibrium states.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty / Weakness Arrows */}
                <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6 text-left">
                  <div className="flex gap-3 items-center">
                    <span className="text-3xl text-red-500">⚠️</span>
                    <div className="space-y-0.5">
                      <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Active Weakness Arrows (दुर्बलता)</h3>
                      <p className="text-xs text-slate-500">Completely empty lines indicating lack of certain elemental balances.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {analysisResult.weaknessArrows.length > 0 ? (
                      analysisResult.weaknessArrows.map((plane, idx) => (
                        <div key={idx} className="p-5 bg-red-50/30 border border-red-200 rounded-2xl space-y-3 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-red-800">{plane.name}</span>
                            <span className="bg-red-100 text-red-800 text-[9px] font-mono px-2.5 py-0.5 rounded-full font-extrabold uppercase">Weak / Absent</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed select-all">
                            Coordinates {plane.digits.join(', ')} are totally absent. {plane.description}
                          </p>
                          <div className="bg-[#F2E8DC]/40 p-3 rounded-xl border border-[#D97706]/15 space-y-1">
                            <span className="block text-[8px] font-mono text-[#D97706] uppercase tracking-wider font-bold">Planetary Remedy</span>
                            <span className="text-[11px] text-slate-700 block italic leading-relaxed">"{plane.remedy?.split('|')[0] || 'Keep balancing gemstones'}"</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-center text-emerald-800 space-y-2">
                        <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
                        <p className="text-xs text-emerald-800 font-semibold">No Weakness Planes Present</p>
                        <p className="text-[10px] text-slate-500">Auspicious! Every plane has at least one node active, preventing full energetic holes.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Standard Planes visual key index */}
              <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-4 text-left">
                <h4 className="font-playfair text-lg font-bold text-[#1F2937]">Complete Loshu planes Reference Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">Mental Plane (4-9-2)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">Excellent for thoughts, research, deep intellectual logic, memory retention structures.</span>
                  </div>
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">Emotional Plane (3-5-7)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">Governs active intuitive states, art, deeply artistic values, empathy capabilities.</span>
                  </div>
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">Practical Plane (8-1-6)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">Practical trade skills, physical labor performance, handling solid liquid cash.</span>
                  </div>
                  <div className="p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/60">
                    <span className="block text-xs font-bold text-[#1F2937]">Prosperity Plane (4-5-6)</span>
                    <span className="block text-[10px] text-[#6B7280] leading-normal mt-1">Auspicous Golden Rajyoga representing high fortune, business leadership, material fame.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REMEDIES ALTAR */}
          {activeSubTab === 'REMEDIES' && (
            <div className="space-y-8 animate-in duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Colors Altar */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                  <span className="text-3xl">🎨</span>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Lucky Colors Altar</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysisResult.luckyDetails.colors.map((color, idx) => (
                      <span key={idx} className="bg-[#F8F4EF] text-[#D97706] border border-[#D97706]/15 rounded-xl px-4 py-2 text-xs font-semibold">
                        {color}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-[10px]">Wear or incorporate these in files, signature inks, or screen saver backdrops for solar alignment.</p>
                </div>

                {/* Gemstone Altar */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                  <span className="text-3xl">💎</span>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Cosmic Gemstones</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysisResult.luckyDetails.gemstones.map((gem, idx) => (
                      <span key={idx} className="bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-xl px-4 py-2 text-xs font-semibold">
                        {gem}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-[10px]">Wear on specified metal rings on auspicious weekday sunrise hours. Consult with guru before mounting.</p>
                </div>

                {/* Lucky Numbers list */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                  <span className="text-3xl">⚜️</span>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Resonating Numbers</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {analysisResult.luckyDetails.numbers.map((numVal, idx) => (
                      <span key={idx} className="w-9 h-9 rounded-full bg-amber-50 text-[#D97706] border border-[#D97706]/20 flex items-center justify-center font-bold text-xs">
                        {numVal}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-[10px]">Highly favorable digits for starting accounts, selection of plots, locker combinations, registration files.</p>
                </div>

              </div>

              {/* Personalized remedies guide list */}
              <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6">
                <div className="flex gap-4 items-center">
                  <span className="text-3xl">🛡️</span>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wide">Personalized Lal Kitab & Vastu Altar Guidelines</h3>
                    <p className="text-[#6B7280] text-xs">Observe these spiritual rituals to clean karmic locks and stimulate latent grid channels.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {analysisResult.luckyDetails.reremedies ? (
                    analysisResult.luckyDetails.reremedies.map((rem, idx) => (
                      <div key={idx} className="p-4 bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl flex gap-3 text-left">
                        <Check className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-semibold leading-relaxed select-all">{rem}</span>
                      </div>
                    ))
                  ) : (
                    analysisResult.luckyDetails.remedies.map((rem, idx) => (
                      <div key={idx} className="p-4 bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl flex gap-3 text-left">
                        <Check className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-semibold leading-relaxed select-all">{rem}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: MAHADASHAS & PERIODS */}
          {activeSubTab === 'PERIODS' && (
            <div className="space-y-8 animate-in duration-500 select-all">
              
              {/* Highlight Active Dasha Box */}
              {analysisResult.currentMahadasha && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-8 rounded-[40px] shadow-lg relative overflow-hidden border border-[#D97706]/40">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_0.75px,transparent_0.75px)] [background-size:24px_24px]"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 text-left">
                      <span className="inline-flex items-center gap-1.5 bg-white/10 text-white px-3.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold border border-white/20">
                        ⚡ Active Planetary Phase (सक्रिय चक्र)
                      </span>
                      <h3 className="font-playfair text-2.5xl font-black">
                        Current Mahadasha: {analysisResult.currentMahadasha.planet}
                      </h3>
                      <p className="text-amber-50 text-xs font-semibold">
                        Ages: {analysisResult.currentMahadasha.startAge} - {analysisResult.currentMahadasha.endAge} ({analysisResult.currentMahadasha.startYear} to {analysisResult.currentMahadasha.endYear})
                      </p>
                      <p className="text-amber-100 text-xs max-w-2xl pt-1">
                        {analysisResult.currentMahadasha.meaning}
                      </p>
                    </div>

                    {analysisResult.currentAntardasha && (
                      <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-left space-y-1 min-w-[240px]">
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-amber-200 font-bold">Sub-Period / Antardasha</span>
                        <span className="text-sm font-bold block">{analysisResult.currentAntardasha.planet} Phase</span>
                        <span className="block text-[10px] text-amber-100 italic leading-relaxed pt-1">
                          {analysisResult.currentAntardasha.meaning.split('.')[0]}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Complete chronologial lifespan table */}
              <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                  <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Vedic Numerological Mahadasha Timeline</h3>
                  <span className="text-[10px] font-mono text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/20 px-3 py-1 rounded-full uppercase font-bold">100-Year Life Grid</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead className="bg-[#F8F4EF]/75 font-mono text-slate-500 uppercase tracking-wider text-[9px] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="p-4 font-bold">Ruler Planet</th>
                        <th className="p-4 font-bold">Length</th>
                        <th className="p-4 font-bold">Age Interval</th>
                        <th className="p-4 font-bold">Years Range</th>
                        <th className="p-4 font-bold">Focal Vibrations Area</th>
                        <th className="p-4 font-bold">Status</th>
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
                          <td className="p-4 font-mono">{dasha.durationYears} Years</td>
                          <td className="p-4">Ages {dasha.startAge} - {dasha.endAge}</td>
                          <td className="p-4 font-mono text-slate-500">{dasha.startYear} to {dasha.endYear}</td>
                          <td className="p-4 text-slate-500 font-lora italic truncate max-w-xs" title={dasha.meaning}>
                            {dasha.meaning.substring(0, 70)}...
                          </td>
                          <td className="p-4">
                            {dasha.isCurrent ? (
                              <span className="bg-[#D97706] text-white text-[8px] font-mono font-bold uppercase py-1 px-3 rounded-full tracking-wider shadow-inner">
                                Active Now
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-[9px]">Inactive</span>
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
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Pinnacle Cycles (शिखर काल चक्र)</h3>
                  <div className="space-y-4">
                    {analysisResult.pinnacles.map((p, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 bg-[#F8F4EF]/50 rounded-2xl border border-[#E5E7EB]/50">
                        <span className="w-8 h-8 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-black font-mono text-xs border border-[#D97706]/20">
                          #{p.pinnacle}
                        </span>
                        <div>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">Phase {p.cycle}: {p.ageRange}</span>
                          <p className="text-[#1F2937] text-xs font-semibold leading-relaxed mt-0.5 italic">"{p.meaning}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6 text-left border-l-4 border-l-[#1E3A8A]">
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Vedic Lifelong Challenges (चुनौतियाँ)</h3>
                  <div className="space-y-4">
                    {analysisResult.challenges.map((c, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 bg-blue-50/20 rounded-2xl border border-blue-200/50">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center font-black font-mono text-xs border border-blue-200">
                          #{c.challenge}
                        </span>
                        <div>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">Challenge Segment {c.cycle}</span>
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
              
              <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6">
                <div className="text-left space-y-1">
                  <span className="text-[9px] font-mono uppercase text-[#D97706] tracking-widest font-bold">Grid Synastry Diagnostic</span>
                  <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Dual Loshu Grid Compatibility Analysis</h3>
                  <p className="text-slate-500 text-xs">
                    Input your partner, business associate, or family member's details to calculate overlapping planes, psychic planetary affinities, and receive a complete synastry audit.
                  </p>
                </div>

                <form onSubmit={handleCalculateCompatibility} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase text-[#6B7280]">Partner's Full Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      required
                      className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl px-5 py-3.5 outline-none text-xs text-[#1F2937]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase text-[#6B7280]">Partner's DOB</label>
                    <input
                      type="date"
                      value={partnerDob}
                      onChange={(e) => setPartnerDob(e.target.value)}
                      required
                      className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl px-5 py-3.5 outline-none text-xs text-[#1F2937]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-4 rounded-2xl transition text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Compare Grids Bond
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
                    <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider font-bold">Synastry Resonance Rating</span>
                    
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
                        <span className="block text-[8px] font-mono text-slate-500 uppercase mt-1 font-bold">Planetary Harmony</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">Divine Verdict</span>
                      <p className="font-playfair text-lg text-[#1F2937] font-extrabold uppercase tracking-widest">{partnerResult.verdict}</p>
                    </div>
                  </motion.div>

                  {/* Detailed Forecast Breakdown (Right) */}
                  <motion.div 
                    variants={itemVariants}
                    className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-6"
                  >
                    <h4 className="font-playfair text-xl font-bold text-[#1F2937] pb-2 border-b border-[#E5E7EB]">Planetary Affinity Report</h4>
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                      
                      <div>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">Affinity Matrix (grade)</span>
                        <p className="font-semibold text-[#1F2937] mt-1 select-all">Grade: {partnerResult.grade}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">Active Overlap Planes</span>
                        {partnerResult.overlapPlanes.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
                            {partnerResult.overlapPlanes.map((o, idx) => <li key={idx}>{o}</li>)}
                          </ul>
                        ) : (
                          <p className="text-slate-400 italic mt-1">No major overlapping full strength planes present.</p>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">Planetary Affinity Notes</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-slate-600">
                          {partnerResult.mutualStrengths.map((m, idx) => <li key={idx}>{m}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 bg-[#F2E8DC]/40 border border-[#D97706]/10 rounded-xl">
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold mb-1">Grid Synergy Forecast</span>
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
              
              <div className="p-8 bg-white border border-[#E5E7EB] rounded-[40px] shadow-sm space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-amber-100 p-3 rounded-full text-2xl">🔮</div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Generate 10-15 Page Equivalent Astro-Guru PDF Report</h3>
                    <p className="text-slate-500 text-xs">Invoke the server-side Gemini 3.5-Flash model to generate a majestic, personalized consultation report matching professional guidelines in pure respectful Hindi.</p>
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
                        <RefreshCw className="w-4 h-4 animate-spin" /> Gathering Cosmic Coordinates...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-bounce" /> Cast Deep Gemini Hindi Report
                      </>
                    )}
                  </button>
                  
                  {aiReport && (
                    <button
                      onClick={() => setShowRawJSON(!showRawJSON)}
                      className="bg-[#F8F4EF] hover:bg-[#F2E8DC] text-[#1F2937] px-6 py-3.5 rounded-2xl text-xs font-semibold tracking-wider uppercase border border-[#E5E7EB]"
                    >
                      {showRawJSON ? 'Hide Structured JSON' : 'Show Structured JSON'}
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
                    <span className="text-amber-400 font-bold uppercase text-[9px] tracking-widest">Active Loshu API Diagnostic Schema</span>
                    <span className="text-slate-500">Ready for external systems integration</span>
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
                    <span className="text-[#D97706] font-mono text-[10px] tracking-widest uppercase font-bold">Personalized Advisory Report for {analysisResult.personalDetails.name}</span>
                  </div>
                  
                  <div className="markdown-body space-y-6 text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap select-all">
                    {aiReport}
                  </div>

                  <div className="pt-8 border-t border-slate-200 text-center flex flex-col items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">End of advisory report • Leo Occult sciences</span>
                    <button
                      onClick={handlePrint}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Export Report copy
                    </button>
                  </div>
                </div>
              ) : (
                !loadingReport && (
                  <div className="p-16 text-center text-slate-400 bg-white border border-[#E5E7EB] rounded-[40px] space-y-3">
                    <StarsPlaceholder />
                    <p className="text-xs text-[#1F2937] font-semibold">Your AI Diagnostic report is waiting to be cast.</p>
                    <p className="text-[10px] max-w-xs mx-auto">Click "Cast Deep Gemini Hindi Report" above to initiate natural intelligence synthesis of all grid coordinates.</p>
                  </div>
                )
              )}

            </div>
          )}

          {/* TAB 7: STRUCTURED DEVELOPER JSON */}
          {activeSubTab === 'HISTORY' && (
            <div className="space-y-6 animate-in duration-500 text-left select-all">
              <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-4">
                <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Structured Developer JSON Output Schema</h3>
                <p className="text-slate-500 text-xs">
                  Below is the pristine, machine-readable JSON object representing all computed parameters from the Loshu Grid and Astrological equations. Designed for seamless future API bindings or database ingestion.
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
                    <Download className="w-4 h-4" /> Download JSON File
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
          <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Cast Your Loshu Grid Chart</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed text-slate-500">
            Please type in your full candidate name and date of birth in the alignment panel above to fetch all numerical coordinates.
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
