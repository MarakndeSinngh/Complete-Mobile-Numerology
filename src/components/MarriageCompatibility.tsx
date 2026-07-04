import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { analyzeDateOfBirth, analyzeNameSystems, analyzeMobileNumber } from '../services/numerologyEngine';
import { computeLoshuAnalysis } from '../services/loshuEngine';
import { calculateAdvancedCompatibility } from '../services/advancedCompatibilityEngine';

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
import { 
  Heart, Sparkles, Calendar, User, Phone, Compass, Award, 
  ShieldCheck, Printer, Download, History, Flame, Coins, 
  MessageSquare, Anchor, Star, Clock, Palette, Gem, Scroll, 
  ChevronRight, CheckCircle2, RefreshCw, Trash2, ArrowRight
} from 'lucide-react';

interface MarriageProfile {
  name: string;
  dob: string;
  mobile: string;
}

interface SavedHistoryItem {
  id: string;
  partner1Name: string;
  partner2Name: string;
  dateStr: string;
  score: number;
  dob1: string;
  dob2: string;
  mobile1: string;
  mobile2: string;
}

// Deterministic Vedic Harmony Matrix for Primary Mulank Numbers
// 10 = High harmony, 7-9 = Medium support, 4-6 = Neutral, 1-3 = Adversary/Karmic lesson
const MULANK_HARMONY: Record<number, Record<number, number>> = {
  1: { 1: 8, 2: 7, 3: 9, 4: 5, 5: 10, 6: 6, 7: 6, 8: 3, 9: 10 },
  2: { 1: 7, 2: 8, 3: 8, 4: 4, 5: 6, 6: 6, 7: 10, 8: 5, 9: 7 },
  3: { 1: 9, 2: 8, 3: 9, 4: 6, 5: 7, 6: 3, 7: 8, 8: 6, 9: 10 },
  4: { 1: 5, 2: 4, 3: 6, 4: 8, 5: 8, 6: 7, 7: 7, 8: 9, 9: 5 },
  5: { 1: 10, 2: 6, 3: 7, 4: 8, 5: 9, 6: 9, 7: 7, 8: 7, 9: 8 },
  6: { 1: 6, 2: 6, 3: 3, 4: 7, 5: 9, 6: 9, 7: 8, 8: 6, 9: 8 },
  7: { 1: 6, 2: 10, 3: 8, 4: 7, 5: 7, 6: 8, 7: 8, 8: 5, 9: 6 },
  8: { 1: 3, 2: 5, 3: 6, 4: 9, 5: 7, 6: 6, 7: 5, 8: 9, 9: 4 },
  9: { 1: 10, 2: 7, 3: 10, 4: 5, 5: 8, 6: 8, 7: 6, 8: 4, 9: 9 }
};

export default function MarriageCompatibility() {
  // Input states
  const [p1Name, setP1Name] = useState('');
  const [p1Dob, setP1Dob] = useState('');
  const [p1Mobile, setP1Mobile] = useState('');

  const [p2Name, setP2Name] = useState('');
  const [p2Dob, setP2Dob] = useState('');
  const [p2Mobile, setP2Mobile] = useState('');

  const [historyList, setHistoryList] = useState<SavedHistoryItem[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  // Computed output state
  const [currentResult, setCurrentResult] = useState<any | null>(null);

  useEffect(() => {
    // Load local history
    const stored = localStorage.getItem('marriage_compatibility_history');
    if (stored) {
      try {
        setHistoryList(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (item: SavedHistoryItem) => {
    const updated = [item, ...historyList.filter(h => h.id !== item.id)].slice(0, 50);
    setHistoryList(updated);
    localStorage.setItem('marriage_compatibility_history', JSON.stringify(updated));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.filter(h => h.id !== id);
    setHistoryList(updated);
    localStorage.setItem('marriage_compatibility_history', JSON.stringify(updated));
    if (activeReportId === id) {
      setCurrentResult(null);
      setActiveReportId(null);
    }
  };

  const handleCalculate = (e?: React.FormEvent, customItem?: SavedHistoryItem) => {
    if (e) e.preventDefault();
    
    const partner1 = customItem ? { name: customItem.partner1Name, dob: customItem.dob1, mobile: customItem.mobile1 } : { name: p1Name, dob: p1Dob, mobile: p1Mobile };
    const partner2 = customItem ? { name: customItem.partner2Name, dob: customItem.dob2, mobile: customItem.mobile2 } : { name: p2Name, dob: p2Dob, mobile: p2Mobile };

    if (!partner1.name || !partner1.dob || !partner2.name || !partner2.dob) {
      return;
    }

    setIsComputing(true);

    setTimeout(() => {
      // 1. Core Numerology Analyses
      const rawAna1 = computeLoshuAnalysis(partner1.dob, partner1.name, 'MALE');
      const rawAna2 = computeLoshuAnalysis(partner2.dob, partner2.name, 'FEMALE');

      const nameSystems1 = analyzeNameSystems(partner1.name);
      const nameSystems2 = analyzeNameSystems(partner2.name);

      const mob1 = partner1.mobile ? analyzeMobileNumber(partner1.mobile) : { reducedTotal: 5, compoundTotal: 23, score: 75, rating: 'GOOD' };
      const mob2 = partner2.mobile ? analyzeMobileNumber(partner2.mobile) : { reducedTotal: 6, compoundTotal: 24, score: 85, rating: 'EXCELLENT' };

      // Calculate Advanced Compatibility Layer scores
      const advanced = calculateAdvancedCompatibility(partner1, partner2);

      const m1 = rawAna1.mulank;
      const m2 = rawAna2.mulank;
      const b1 = rawAna1.bhagyank;
      const b2 = rawAna2.bhagyank;

      const mulankScore = advanced.layers.driver.score;
      const bhagyankScore = advanced.layers.conductor.score;
      const nameScore = advanced.layers.name.score;
      const mobileScore = advanced.layers.mobile.score;

      const loveScore = advanced.layers.compound.score;
      const emotionalScore = advanced.categories.emotional.score;
      const communicationScore = advanced.categories.communication.score;
      const financialScore = advanced.categories.financial.score;
      const spiritualScore = advanced.categories.spiritual.score;
      const overallStability = advanced.overallScore;

      const karmicWarning = advanced.indicators.karmicWarning;
      const isSoulmate = advanced.indicators.isSoulmate;

      const reportId = customItem ? customItem.id : Date.now().toString();

      const computed = {
        id: reportId,
        partner1,
        partner2,
        rawAna1,
        rawAna2,
        nameSystems1,
        nameSystems2,
        mob1,
        mob2,
        advanced, // Include raw calculation for deep UI rendering
        metrics: {
          mulankScore,
          bhagyankScore,
          nameScore,
          mobileScore,
          loveScore,
          emotionalScore,
          communicationScore,
          financialScore,
          spiritualScore,
          overallStability
        },
        indicators: {
          karmicWarning,
          isSoulmate
        },
        calculatedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };

      setCurrentResult(computed);
      setActiveReportId(reportId);
      setIsComputing(false);

      if (!customItem) {
        saveToHistory({
          id: reportId,
          partner1Name: partner1.name,
          partner2Name: partner2.name,
          dateStr: computed.calculatedAt,
          score: overallStability,
          dob1: partner1.dob,
          dob2: partner2.dob,
          mobile1: partner1.mobile || '',
          mobile2: partner2.mobile || ''
        });
      }
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatBirthday = (dStr: string) => {
    if (!dStr) return '';
    const date = new Date(dStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div id="marriage-compatibility-container" className="space-y-12">
      
      {/* HEADER SECTION */}
      <div id="mc-hdr" className="text-center space-y-4 max-w-2xl mx-auto print:hidden">
        <div className="inline-flex items-center gap-2 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
          <Heart className="w-3.5 h-3.5 fill-[#D97706] animate-pulse" /> Traditional Jyotish & Chaldean Alignments
        </div>
        <h2 className="font-playfair text-4xl font-black text-[#1F2937] tracking-tight">
          Marriage Compatibility Analysis
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed font-sans">
          Unlock profound cosmic matches for couples. Combining traditional Vedic Loshu grid positions, 
          Chaldean birth-vibrations, and modern emotional index scores to ensure authentic marital pathways.
        </p>
      </div>

      {/* INPUT FORM AND LOCAL HISTORY PANEL */}
      <div id="mc-main-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
        
        {/* Input Card Form */}
        <form 
          onSubmit={handleCalculate} 
          className="lg:col-span-8 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[40px] p-8 md:p-10 shadow-lg space-y-8 relative overflow-hidden"
        >
          {/* Subtle sacred geometry background element */}
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10 pointer-events-none border border-[#B45309] rounded-full flex items-center justify-center translate-x-12 -translate-y-12">
            <div className="w-24 h-24 border border-[#B45309] rounded-full rotate-45"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* PARTNER 1 DETAILS */}
            <div className="space-y-5 p-6 rounded-3xl bg-white border border-slate-150/60 shadow-sm">
              <div className="flex items-center gap-2 border-b border-rose-100 pb-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">P1</div>
                <div>
                  <h3 className="font-playfair text-base font-bold text-slate-800">First Partner</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Planetary Yang Energy</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name..."
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-3 pl-11 pr-4 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 text-left font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={p1Dob}
                    onChange={(e) => setP1Dob(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-3 pl-11 pr-4 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 text-left font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Mobile Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={p1Mobile}
                    onChange={(e) => setP1Mobile(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-3 pl-11 pr-4 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 text-left font-sans"
                  />
                </div>
              </div>
            </div>

            {/* PARTNER 2 DETAILS */}
            <div className="space-y-5 p-6 rounded-3xl bg-white border border-slate-150/60 shadow-sm">
              <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">P2</div>
                <div>
                  <h3 className="font-playfair text-base font-bold text-slate-800">Second Partner</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Planetary Yin Energy</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name..."
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-3 pl-11 pr-4 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 text-left font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={p2Dob}
                    onChange={(e) => setP2Dob(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-3 pl-11 pr-4 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 text-left font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Mobile Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={p2Mobile}
                    onChange={(e) => setP2Mobile(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-3 pl-11 pr-4 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 text-left font-sans"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="text-center pt-2 relative z-10">
            <button
              type="submit"
              disabled={isComputing}
              className="px-10 py-4 rounded-2xl bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#11245A] hover:shadow-lg active:scale-95 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer select-none disabled:opacity-50"
            >
              {isComputing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Aligning Cosmic Coordinates...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Generate Compatibility Report
                </>
              )}
            </button>
          </div>
        </form>

        {/* History Sidebar Panel */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600 animate-pulse" />
              <h3 className="font-playfair text-sm font-bold text-slate-800">Analysis History</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full">
              {historyList.length} Saved
            </span>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Heart className="w-8 h-8 text-slate-200 mx-auto fill-slate-50/50" />
              <p className="text-xs text-slate-400 leading-normal font-sans">
                No saved compatibility histories found. Calculate to record profiles locally.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCalculate(undefined, item)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group ${
                    activeReportId === item.id 
                      ? 'bg-[#FDFCF7] border-[#D97706]/40 shadow-inner' 
                      : 'bg-[#FDFCF7]/30 hover:bg-[#FDFCF7]/80 border-slate-150'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono text-[#D97706] bg-[#D97706]/5 border border-[#D97706]/10 px-1.5 py-0.5 rounded font-bold">
                      Match: {item.score}%
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.partner1Name} & {item.partner2Name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {item.dateStr}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                    <button
                      onClick={(e) => deleteHistoryItem(item.id, e)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* DETAILED RESULTS & AI GENERATED REPORT SCREEN */}
      {currentResult && (
        <motion.div 
          id="mc-results-wrapper" 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-12 text-left"
        >
          
          {/* EXPORT AND ACTION BANNER */}
          <motion.div variants={itemVariants} className="p-4 border border-[#F2E8DC] bg-[#FDFCF7] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm print:hidden">
            <div className="text-left space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Authentic Chart Generated</span>
              <p className="text-xs text-[#1F2937] font-semibold">
                Marriage Alignment Certificate for <strong className="text-[#B45309]">{currentResult.partner1.name}</strong> & <strong className="text-[#B45309]">{currentResult.partner2.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#11245A] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Export PDF
              </button>
            </div>
          </motion.div>

          {/* PRINT-ONLY HEADLINE BANNER */}
          <div className="hidden print:block text-center border-b-2 border-amber-600 pb-8 space-y-2">
            <h1 className="font-playfair text-4xl font-extrabold text-[#111827]">Leo Family Occult Sciences</h1>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-slate-500">Traditional Vedic Rules & Marriage Alignment Certificate</p>
            <div className="pt-4 flex justify-between text-[11px] font-mono text-slate-600">
              <span>Date: {currentResult.calculatedAt}</span>
              <span>Ref ID: MC-{currentResult.id}</span>
            </div>
          </div>

          {/* MAIN STABILITY SCORE & CHARTS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Stability Wheel Chart */}
            <motion.div variants={itemVariants} className="md:col-span-4 bg-[#1E3A8A] text-white rounded-[40px] p-8 text-center flex flex-col justify-between gap-6 relative overflow-hidden shadow-lg">
              {/* Golden circular sacred backdrop element */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_0.75px,transparent_0.75px)] [background-size:20px_20px] pointer-events-none"></div>
              
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest font-extrabold">Overall Marriage Stability</span>
                <p className="text-[10px] font-serif italic text-blue-200">वैवाहिक स्थिरता विश्लेषण</p>
              </div>

              {/* High precision circular percent wheel */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="#1E4FF0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="#FBBF24"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={389.5}
                    strokeDashoffset={389.5 - (389.5 * currentResult.metrics.overallStability) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-playfair text-4xl font-black text-amber-400 tracking-tighter">
                    {currentResult.metrics.overallStability}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-blue-150 tracking-wider">Stability</span>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {currentResult.indicators.isSoulmate && (
                  <div className="bg-amber-400/25 border border-amber-400/30 rounded-2xl py-2 px-3 text-amber-300 text-[10px] font-mono tracking-wider uppercase font-bold inline-flex items-center gap-1.5 justify-center max-w-full">
                    <Star className="w-3.5 h-3.5 fill-amber-300" /> Divine Soulmate Link!
                  </div>
                )}
                {currentResult.indicators.karmicWarning ? (
                  <p className="text-[11px] text-blue-200/95 leading-relaxed max-w-xs mx-auto">
                    Karmic debt alignment observed. Mutual alignment is strong, but active, conscious planetary remedies are highly recommended to bypass immediate friction points.
                  </p>
                ) : (
                  <p className="text-[11px] text-blue-200/95 leading-relaxed max-w-xs mx-auto">
                    Beautiful planetary sync identified across primary date configurations. This indicates supportive domestic fields with rich harmony over decades.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Individual Compatibility Pillars */}
            <motion.div variants={itemVariants} className="md:col-span-8 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[40px] p-8 md:p-10 shadow-sm flex flex-col justify-between">
              <div className="text-left space-y-1 pb-4 border-b border-[#F2E8DC]">
                <h3 className="font-playfair text-xl font-bold text-slate-800">Planetary Harmony Indexes</h3>
                <p className="text-xs text-slate-500 font-sans">
                  Deeply extracted alignment percentages of the double birth grids and names systems.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-6 flex-1">
                
                {/* 1. Love Compatibility */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Marriage & Love Vibe
                    </span>
                    <span className="font-mono font-bold text-rose-600">{currentResult.metrics.loveScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${currentResult.metrics.loveScore}%` }}></div>
                  </div>
                </div>

                {/* 2. Emotional Compatibility */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Emotional Resonance
                    </span>
                    <span className="font-mono font-bold text-amber-600">{currentResult.metrics.emotionalScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentResult.metrics.emotionalScore}%` }}></div>
                  </div>
                </div>

                {/* 3. Communication Compatibility */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Communication Frequency
                    </span>
                    <span className="font-mono font-bold text-blue-600">{currentResult.metrics.communicationScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${currentResult.metrics.communicationScore}%` }}></div>
                  </div>
                </div>

                {/* 4. Financial Compatibility */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-500" /> Financial & Asset Growth
                    </span>
                    <span className="font-mono font-bold text-emerald-600">{currentResult.metrics.financialScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentResult.metrics.financialScore}%` }}></div>
                  </div>
                </div>

                {/* 5. Spiritual Compatibility */}
                <div className="space-y-1.5 text-left text-xs sm:col-span-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-purple-600" /> Soul Plan & Spiritual Alignments
                    </span>
                    <span className="font-mono font-bold text-purple-600">{currentResult.metrics.spiritualScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${currentResult.metrics.spiritualScore}%` }}></div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* DUAL MULANK & BHAGYANK COMPATIBILITY */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mulank Compatibility Panel */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono bg-rose-50 border border-rose-200 text-rose-600 font-extrabold px-2 py-0.5 rounded-full uppercase">Mulank (Psychic Axis)</span>
                  <h3 className="font-playfair text-lg font-bold text-slate-800">Driver Compatibility Match</h3>
                </div>
                <Award className="w-8 h-8 text-rose-500" />
              </div>

              <div className="flex items-center gap-4 justify-center py-2">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-rose-50 font-playfair font-black text-xl text-rose-600 border border-rose-200 flex items-center justify-center">
                    {currentResult.rawAna1.mulank}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase mt-1 block">P1 Driver</span>
                </div>
                <div className="text-slate-300 font-bold">X</div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-rose-50 font-playfair font-black text-xl text-rose-600 border border-rose-200 flex items-center justify-center">
                    {currentResult.rawAna2.mulank}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase mt-1 block">P2 Driver</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {currentResult.advanced ? currentResult.advanced.layers.driver.explanation : `Partner 1 resolves to Mulank ${currentResult.rawAna1.mulank} matched against Partner 2's Mulank ${currentResult.rawAna2.mulank}. This produces a Compatibility score of ${currentResult.metrics.mulankScore}%.`}
              </p>
            </motion.div>

            {/* Bhagyank Compatibility Panel */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono bg-blue-50 border border-blue-200 text-blue-600 font-extrabold px-2 py-0.5 rounded-full uppercase">Bhagyank (Conductor Axis)</span>
                  <h3 className="font-playfair text-lg font-bold text-slate-800">Conductor Compatibility Match</h3>
                </div>
                <Award className="w-8 h-8 text-blue-500" />
              </div>

              <div className="flex items-center gap-4 justify-center py-2">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 font-playfair font-black text-xl text-blue-600 border border-blue-200 flex items-center justify-center">
                    {currentResult.rawAna1.bhagyank}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase mt-1 block">P1 Conductor</span>
                </div>
                <div className="text-slate-300 font-bold">X</div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 font-playfair font-black text-xl text-blue-600 border border-blue-200 flex items-center justify-center">
                    {currentResult.rawAna2.bhagyank}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase mt-1 block">P2 Conductor</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {currentResult.advanced ? currentResult.advanced.layers.conductor.explanation : `Partner 1 resolves to Conductor Bhagyank ${currentResult.rawAna1.bhagyank} matched against Partner 2's Conductor Bhagyank ${currentResult.rawAna2.bhagyank}, bringing an outstanding Bhagyank score of ${currentResult.metrics.bhagyankScore}%.`}
              </p>
            </motion.div>

          </motion.div>

          {/* DUAL LOSHU GRIDS COMPARISON */}
          <motion.div variants={itemVariants} className="bg-[#FDFCF7] border border-[#F2E8DC] rounded-[40px] p-8 md:p-10 shadow-sm text-left space-y-8">
            <div className="border-b border-[#F2E8DC] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-playfair text-2xl font-black text-indigo-900">Dual Loshu Grid Positions</h3>
                <p className="text-xs text-slate-500">Compare standard planetary placement of both partners side-by-side.</p>
              </div>
              <Compass className="w-8 h-8 text-amber-600 animate-spin-slow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Grid 1 */}
              <div className="space-y-4">
                <h4 className="font-playfair text-sm font-bold text-center text-[#1E3A8A]">
                  {currentResult.partner1.name}'s Grid
                </h4>
                
                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                  {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                    const count = currentResult.rawAna1.loshuGrid[num]?.count || 0;
                    return (
                      <div
                        key={`g1-${num}`}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative ${
                          count > 0 
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 font-bold shadow-sm' 
                            : 'bg-white border-slate-100/50 text-slate-200'
                        }`}
                      >
                        <span className="text-sm">{num}</span>
                        {count > 0 && (
                          <span className="text-[9px] font-mono bg-amber-400 text-amber-950 font-extrabold px-1 rounded absolute bottom-1 right-1 leading-none py-0.5">
                            {count}x
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid 2 */}
              <div className="space-y-4">
                <h4 className="font-playfair text-sm font-bold text-center text-[#1E3A8A]">
                  {currentResult.partner2.name}'s Grid
                </h4>
                
                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                  {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                    const count = currentResult.rawAna2.loshuGrid[num]?.count || 0;
                    return (
                      <div
                        key={`g2-${num}`}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative ${
                          count > 0 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 font-bold shadow-sm' 
                            : 'bg-white border-slate-100/50 text-slate-200'
                        }`}
                      >
                        <span className="text-sm">{num}</span>
                        {count > 0 && (
                          <span className="text-[9px] font-mono bg-emerald-400 text-emerald-950 font-extrabold px-1 rounded absolute bottom-1 right-1 leading-none py-0.5">
                            {count}x
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>

          {/* COMBINED MISSING NUMBERS & ARROWS ANALYSIS */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Missing Numbers Audit */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="font-playfair text-lg font-bold text-slate-800">Missing Elements Integration</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Vibrational Empty Holes Matching</p>
              </div>

              <div className="space-y-4 font-sans text-xs">
                
                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-left space-y-2">
                  <h4 className="font-bold text-rose-800 text-xs">
                    {currentResult.partner1.name}'s Missing Numbers:
                  </h4>
                  <div className="flex gap-2">
                    {currentResult.rawAna1.missingNumbers.map((m: any) => (
                      <span key={`p1m-${m.digit}`} className="bg-white text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                        {m.digit}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Lacking these channels of planetary energy directly. Relies on external partners or crystal stones to find stable alignment.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-left space-y-2">
                  <h4 className="font-bold text-emerald-800 text-xs">
                    {currentResult.partner2.name}'s Missing Numbers:
                  </h4>
                  <div className="flex gap-2">
                    {currentResult.rawAna2.missingNumbers.map((m: any) => (
                      <span key={`p2m-${m.digit}`} className="bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                        {m.digit}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Lacking these coordinates of cosmic frequencies. Resonating remedies triggers speedy support.
                  </p>
                </div>

                {/* Synthesis analysis */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans pt-2">
                  <strong>Synergistic Remedy Yoga:</strong> Fortunately, Partner 1 possesses numbers like{' '} 
                  {currentResult.rawAna1.loshuGridStructure?.filter((g: any) => g.count > 0 && currentResult.rawAna2.missingNumbers?.map((m: any) => m.digit).includes(g.digit)).map((g: any) => g.digit).join(', ') || 'none'}{' '}
                  which directly fill the empty spaces of Partner 2, providing immediate subconscious structural shielding. This forms a supportive, stabilizing long-term marriage.
                </p>

              </div>
            </motion.div>

            {/* Strength Arrow Analysis */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="font-playfair text-lg font-bold text-slate-800">Dynamic Lushu Arrows Match</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Strengths & Willpower Planes Map</p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                
                <div className="space-y-1.5 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                  <span className="text-[9px] font-mono text-indigo-700 uppercase font-bold tracking-wider">Partner 1 Planes:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentResult.rawAna1.strengthArrows?.map((arr: any) => (
                      <span key={`p1a-${arr.name}`} className="bg-white border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-800">
                        ✓ {arr.name} (Active)
                      </span>
                    )) || <span className="text-slate-400 text-[11px] font-mono">No complete planes</span>}
                  </div>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                  <span className="text-[9px] font-mono text-indigo-700 uppercase font-bold tracking-wider">Partner 2 Planes:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentResult.rawAna2.strengthArrows?.map((arr: any) => (
                      <span key={`p2a-${arr.name}`} className="bg-white border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-800">
                        ✓ {arr.name} (Active)
                      </span>
                    )) || <span className="text-slate-400 text-[11px] font-mono">No complete planes</span>}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  The coupled alignment combines a rich selection of behavioral plans. Mind planes (4-9-2) and Practical planes (8-1-6) are robustly active in this partnership, triggering outstanding business stability and continuous target execute focus!
                </p>

              </div>
            </motion.div>

          </motion.div>

          {/* DUAL NAME & MOBILE NUMEROLOGY COMPATIBILITY */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Name Numerology Grid Compatibility */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="font-playfair text-lg font-bold text-slate-800">Name Vibrations (Chaldean Link)</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Planetary Word Frequency Match</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border text-center space-y-1">
                    <span className="text-[9px] text-[#D97706] font-mono font-bold uppercase block">{currentResult.partner1.name}</span>
                    <strong className="text-lg font-cinzel text-slate-800 font-bold block">{currentResult.nameSystems1.chaldeanNumber}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border text-center space-y-1">
                    <span className="text-[9px] text-[#D97706] font-mono font-bold uppercase block">{currentResult.partner2.name}</span>
                    <strong className="text-lg font-cinzel text-slate-800 font-bold block">{currentResult.nameSystems2.chaldeanNumber}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Partner 1's Chaldean name total resolves to <strong>{currentResult.nameSystems1.chaldeanNumber}</strong>, matched with Partner 2's Chaldean name sum 
                  resolving to <strong>{currentResult.nameSystems2.chaldeanNumber}</strong>. Under Chaldean frequencies, this mutual alignment produces a 
                  highly cooperative harmonic. It protects the couple from public rumors and enhances domestic peace.
                </p>
              </div>
            </motion.div>

            {/* Mobile Numerology Alignment */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="font-playfair text-lg font-bold text-slate-800">Mobile Numerology Integration</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Dynamic Digital Shielding</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border text-center space-y-1">
                    <span className="text-[9px] text-slate-500 font-mono block">P1 Mobile ({currentResult.partner1.mobile || 'Fallback'})</span>
                    <strong className="text-lg font-cinzel text-indigo-900 font-bold block">{currentResult.mob1.compoundTotal} / {currentResult.mob1.reducedTotal}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border text-center space-y-1">
                    <span className="text-[9px] text-slate-500 font-mono block">P2 Mobile ({currentResult.partner2.mobile || 'Fallback'})</span>
                    <strong className="text-lg font-cinzel text-indigo-900 font-bold block">{currentResult.mob2.compoundTotal} / {currentResult.mob2.reducedTotal}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  The combined phone systems totals are beautifully harmonious. Under Chaldean phone diagnostics, these numbers do not form hostile alignments, ensuring that phone messages and everyday chats remain respectful and filled with positive trust.
                </p>
              </div>
            </motion.div>

          </motion.div>

          {/* SACRED SPIRITUALITY & SOULMATE INDICATORS */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[40px] shadow-sm text-left space-y-6 relative overflow-hidden">
            {/* Shiny golden circular glow decoration */}
            <div className="absolute right-4 bottom-4 w-52 h-52 bg-[#D97706]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 border-b border-[#F2E8DC] pb-4">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div>
                <h3 className="font-playfair text-xl font-bold text-slate-850">Sacred Spirituality & Soulmate Indicators</h3>
                <p className="text-[10px] text-amber-600 uppercase font-bold tracking-widest font-mono">Planetary Yogas & Divine Unions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs font-sans">
              
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-inner space-y-2">
                <h4 className="font-extrabold text-[#D97706] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#D97706]" /> Spiritual Yoga
                </h4>
                <p className="text-slate-650 leading-relaxed">
                  Both partners share active intellectual planes. Ruled by Jupiter (3) and Ketu (7), this provides excellent mutual interest in occult, traditional scriptures, and higher education.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-inner space-y-2">
                <h4 className="font-extrabold text-[#1E3A8A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#1E3A8A]" /> Soul Compassion
                </h4>
                <p className="text-slate-650 leading-relaxed">
                  The planetary resonance triggers high understanding during emotional stress. There are no sudden dynamic rifts in the primary grids, maintaining deep domestic warmth.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-inner space-y-2">
                <h4 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" /> Devotional Level
                </h4>
                <p className="text-slate-650 leading-relaxed">
                  Rated high at 88/100. This maintains outstanding dedication to family stability, with minimal blockages.
                </p>
              </div>

            </div>
          </motion.div>

          {/* MARRIAGE TIMING ANALYSIS & AUSPICIOUS DATES */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Wedding Timing Analysis */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <Clock className="w-6 h-6 text-amber-500 inline-block mr-2" />
                <h3 className="font-playfair text-lg font-bold text-slate-800 inline-block align-middle">Marriage Timing Analysis</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold pt-1">Inspirations for Best Wedding Timings</p>
              </div>

              <div className="space-y-4 text-xs font-sans text-slate-600 leading-relaxed">
                <p>
                  Based on Partner 1's Personal Year <strong>{currentResult.rawAna1.personalYear?.number}</strong> and Partner 2's Personal Year <strong>{currentResult.rawAna2.personalYear?.number}</strong>, 
                  the current period is highly aligned. 
                </p>
                <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-2xl">
                  <strong className="text-amber-800 text-xs block mb-1">Golden Auspicious Timing Windows:</strong>
                  The upcoming months corresponding to <strong>Vedic Solar Transits (Aswin, Kartik and Phalguna)</strong> provide unmatched planetary backing, especially when dates resolve to celestial integers <strong>1, 3, 5 or 9</strong>.
                </div>
              </div>
            </motion.div>

            {/* Lucky Dates & Colors */}
            <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <Palette className="w-6 h-6 text-[#1E3A8A] inline-block mr-2" />
                <h3 className="font-playfair text-lg font-bold text-slate-800 inline-block align-middle">Lucky Elements & Colors</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold pt-1">Auspicious Colors & Attire Decors</p>
              </div>

              <div className="space-y-5 text-xs font-sans text-slate-600">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border rounded-2xl">
                    <strong className="text-[#1E3A8A] block mb-1">Auspicious Dates:</strong>
                    1st, 3rd, 5th, 9th, 14th, 23rd, and 27th of any month.
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-2xl">
                    <strong className="text-[#1E3A8A] block mb-1 font-bold">Coupled Gemstones:</strong>
                    Yellow Sapphire & Rose Quartz combinations.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border space-y-2">
                  <strong className="text-slate-800 block text-xs">Vibrational Harmony Colors:</strong>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block border"></span> Cream-Gold</span>
                    <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full bg-blue-100 inline-block border"></span> Soft Ivory</span>
                    <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full bg-orange-100 inline-block border"></span> Peach-Orange</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                    Utilizing these colors during the main rituals harmonizes individual vibrations and strengthens family bonding.
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* FAMILY & CHILDREN ENERGY & REMEDIES */}
          <motion.div variants={itemVariants} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm text-left space-y-6">
            <div className="border-b border-slate-150 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-lg font-bold text-slate-800">Family Energy & Planetary Remedies</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Vedic Correction Practices & Protection Mandir</p>
              </div>
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans text-slate-650">
              
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">Auspicious Family Expansion Energy</h4>
                <p className="leading-relaxed">
                  The Earth element (2, 5, 8) in both grids is highly active. This provides strong stability for raising children, constructing property, and managing joint funds with elders.
                </p>
                <p className="leading-relaxed">
                  To protect the home from unexpected financial blockages, place a brass metal compass inside the North-East zone of your living room, or hang a traditional gold-embroidered family picture on the South wall.
                </p>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-[#FDFCF7] border border-[#F2E8DC] text-slate-700">
                <h4 className="font-bold text-[#B45309] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Couple Remedies to Maximize Harmony
                </h4>
                <ul className="space-y-2 list-disc pl-4 text-[11px] leading-relaxed">
                  <li><strong>Radhe-Krishna Worship:</strong> Offer water in a copper vessel to a Tulsi plant jointly every Thursday morning.</li>
                  <li><strong>Chanting Frequencies:</strong> Chant the peaceful Vishnu Sahasranama once a week under soft candle shadows.</li>
                  <li><strong>Signature Correction:</strong> Ensure both partners write their signatures with a slight upward tilt, avoiding trailing downward hooks.</li>
                  <li><strong>Feed Birds:</strong> Feed mixed grains to birds on Saturday mornings to neutralize Saturn's harsh gaze.</li>
                </ul>
              </div>

            </div>
          </motion.div>

          {/* COMPLETE AI GENERATED CONSULTATION REPORT */}
          <motion.div variants={itemVariants} className="p-8 md:p-12 bg-gradient-to-br from-[#1E3A8A] to-[#111827] rounded-[40px] text-white shadow-2xl space-y-10 relative overflow-hidden text-left">
            {/* Elegant luxury backdrop curves */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3 border-b border-blue-900/60 pb-6 relative z-10">
              <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest font-extrabold flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" /> Complete AI Astrological Report
              </span>
              <h3 className="font-playfair text-3xl font-black text-amber-200">
                Lal Kitab & Chaldean Marriage Synthesis
              </h3>
              <p className="text-xs text-blue-200 leading-normal max-w-2xl font-serif italic">
                A professional, high-end astrological consultation analysis explaining combined planetary plans and life directions.
              </p>
            </div>

            <div className="space-y-8 text-xs md:text-sm font-sans relative z-10 leading-relaxed text-blue-100/95">
              
              <div className="space-y-3">
                <h4 className="font-serif text-amber-300 font-bold text-sm">CHAPTER I: The General Spiritual Agreement</h4>
                <p>
                  Vibrations mapping reveals that <strong className="text-white">{currentResult.partner1.name}</strong> and <strong className="text-white">{currentResult.partner2.name}</strong> possess highly linked cosmic coordinates. 
                  The driver numbers {currentResult.rawAna1.mulank} and {currentResult.rawAna2.mulank} work like friendly planetary gears. While Partner 1 brings sharp willpower and high target focus, Partner 2 injects incredible emotional support, quiet diplomatic skills, and superb management instincts. 
                  This creates an extremely balanced dual partnership, suitable for starting commercial trades together or raising a progressive family.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif text-amber-300 font-bold text-sm">CHAPTER II: Emotional Sync & Communication Dynamics</h4>
                <p>
                  In everyday family life, communication controls are strongly supported by {currentResult.rawAna1.loshuGrid[5]?.count > 0 || currentResult.rawAna2.loshuGrid[5]?.count > 0 ? 'the powerful Mercury (5) element energy' : 'the combined name resonances'}. 
                  There is little threat of sudden verbal misunderstandings, as both partners support each other's emotional expressions. 
                  During the transit of heavy karmic years, Partner 2's soothing Moon vibration acts as a cooling shield, ensuring that arguments melt away before causing deeper scars in the sub-conscious layer.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif text-amber-300 font-bold text-sm">CHAPTER III: Ultimate Prosperity and Wealth Shielding</h4>
                <p>
                  Under standard Chaldean and Lushu equations, financial luck is rated exceptionally high. 
                  The presence of planetary lines in both grids stimulates the continuous creation of secure material assets. 
                  Joint investments in gold, real estate, or agricultural lands remain highly propitious. 
                  By implementing the suggested Saturday remedies and avoiding toxic red-dominated living spaces, you secure an unmatched protective shield over your household funds, paving the way for peaceful, luxurious retirement years.
                </p>
              </div>

              <div className="pt-6 border-t border-blue-900/60 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-blue-300 gap-4">
                <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Leo Family Occult Certificate Verified
                </span>
                <span>Ref Code: LOM-{currentResult.id}</span>
              </div>

            </div>
          </motion.div>

        </motion.div>
      )}

    </div>
  );
}
