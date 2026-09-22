import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Sparkles, User, Phone, Compass, Award, 
  ShieldCheck, Printer, History, Flame, Coins, 
  MessageSquare, Anchor, Star, Clock, Palette, Gem, Scroll, 
  ChevronRight, CheckCircle2, RefreshCw, Trash2, ArrowRight,
  Layers, Scale, HelpCircle, FileText, Check
} from 'lucide-react';
import DateInput from './DateInput';
import { generateSynastryReport, MarriageCompatibilityReport, SynastryPersonInput } from '../core/synastryEngine';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

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

export default function MarriageCompatibility() {
  // Input states
  const [p1Name, setP1Name] = useState('रोहित शर्मा (Rohit)');
  const [p1Dob, setP1Dob] = useState('1992-05-14');
  const [p1Mobile, setP1Mobile] = useState('9876543210');
  const [p1Gender, setP1Gender] = useState<'MALE' | 'FEMALE'>('MALE');

  const [p2Name, setP2Name] = useState('प्रिया वर्मा (Priya)');
  const [p2Dob, setP2Dob] = useState('1994-11-23');
  const [p2Mobile, setP2Mobile] = useState('9812345678');
  const [p2Gender, setP2Gender] = useState<'MALE' | 'FEMALE'>('FEMALE');

  const [historyList, setHistoryList] = useState<SavedHistoryItem[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [activeTab, setActiveTab] = useState<'7LAYERS' | 'CROSS_SYNTHESIS' | 'LOSHU_PLANES' | 'LIFE_ASPECTS' | 'REMEDIES'>('7LAYERS');
  
  // Computed output state
  const [report, setReport] = useState<MarriageCompatibilityReport | null>(null);

  useEffect(() => {
    // Load local history
    const stored = localStorage.getItem('marriage_compatibility_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistoryList(parsed);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }

    // Automatically generate initial report on mount with default sample
    const initialReport = generateSynastryReport(
      { name: p1Name, dob: p1Dob, mobile: p1Mobile, gender: p1Gender },
      { name: p2Name, dob: p2Dob, mobile: p2Mobile, gender: p2Gender }
    );
    setReport(initialReport);
    localStorage.setItem('leofamily_saved_synastry_audit', JSON.stringify({ report: initialReport, timestamp: new Date().toISOString() }));
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
      setActiveReportId(null);
    }
  };

  const handleCalculate = (e?: React.FormEvent, customItem?: SavedHistoryItem) => {
    if (e) e.preventDefault();
    
    const partner1Input: SynastryPersonInput = customItem 
      ? { name: customItem.partner1Name, dob: customItem.dob1, mobile: customItem.mobile1 } 
      : { name: p1Name, dob: p1Dob, mobile: p1Mobile, gender: p1Gender };
    
    const partner2Input: SynastryPersonInput = customItem 
      ? { name: customItem.partner2Name, dob: customItem.dob2, mobile: customItem.mobile2 } 
      : { name: p2Name, dob: p2Dob, mobile: p2Mobile, gender: p2Gender };

    if (!partner1Input.name || !partner1Input.dob || !partner2Input.name || !partner2Input.dob) {
      return;
    }

    setIsComputing(true);

    setTimeout(() => {
      const generated = generateSynastryReport(partner1Input, partner2Input);
      setReport(generated);
      setActiveReportId(generated.id);
      setIsComputing(false);

      // Save for Master Report integration
      localStorage.setItem('leofamily_saved_synastry_audit', JSON.stringify({ report: generated, timestamp: new Date().toISOString() }));

      if (!customItem) {
        saveToHistory({
          id: generated.id,
          partner1Name: partner1Input.name,
          partner2Name: partner2Input.name,
          dateStr: generated.calculatedAt,
          score: generated.overallHarmonyScore,
          dob1: partner1Input.dob,
          dob2: partner2Input.dob,
          mobile1: partner1Input.mobile || '',
          mobile2: partner2Input.mobile || ''
        });
      }
    }, 400);
  };

  const loadSample = () => {
    setP1Name('आदित्य कपूर (Aditya)');
    setP1Dob('1990-08-19');
    setP1Mobile('9820012345');
    setP1Gender('MALE');

    setP2Name('अंजलि शर्मा (Anjali)');
    setP2Dob('1993-04-12');
    setP2Mobile('9830054321');
    setP2Gender('FEMALE');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="marriage-compatibility-container" className="space-y-10 font-sans text-left">
      
      {/* HEADER SECTION */}
      <div id="mc-hdr" className="text-center space-y-3 max-w-3xl mx-auto print:hidden">
        <div className="inline-flex items-center gap-2 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
          <Heart className="w-3.5 h-3.5 fill-[#D97706] animate-pulse" /> LeoFamily Synastry Pro • Phase 10
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          वैवाहिक सामंजस्य एवं सिनैस्ट्री ऑडिट (Marriage Compatibility Pro)
        </h2>
        <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
          7-स्तरीय वैदिक एवं ला-शू अंकशास्त्रीय प्रणाली। दोनों पार्टनर्स के मूलांक, भाग्यांक, नाम ध्वनि, Lo Shu ग्रिड एवं ग्रहों के आपसी संतुलन का संपूर्ण हिंदी विश्लेषण।
        </p>
      </div>

      {/* INPUT FORM AND LOCAL HISTORY PANEL */}
      <div id="mc-main-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
        
        {/* Input Card Form */}
        <form 
          onSubmit={handleCalculate} 
          className="lg:col-span-8 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[36px] p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[#F2E8DC] pb-4">
            <div>
              <h3 className="font-playfair text-lg font-bold text-slate-800">दंपति विवरण दर्ज करें (Enter Couple Details)</h3>
              <p className="text-[11px] text-slate-500">दोनों व्यक्तियों के नाम एवं जन्मतिथि (DD/MM/YYYY) आवश्यक हैं</p>
            </div>
            <button
              type="button"
              onClick={loadSample}
              className="text-[11px] font-mono text-[#D97706] hover:text-[#B45309] font-bold border border-[#D97706]/30 px-3 py-1.5 rounded-xl bg-[#D97706]/5 hover:bg-[#D97706]/10 transition-colors"
            >
              उदाहरण डेटा लोड करें (Load Sample)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            {/* PARTNER 1 DETAILS */}
            <div className="space-y-4 p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs">
              <div className="flex items-center gap-2 border-b border-rose-100 pb-2.5">
                <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">P1</div>
                <div>
                  <h4 className="font-playfair text-sm font-bold text-slate-800">प्रथम व्यक्ति (Person A)</h4>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Primary Profile Details</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">पूरा नाम (Full Name)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name..."
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-2.5 pl-10 pr-3 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">जन्मतिथि (Date of Birth)</label>
                <DateInput
                  id="p1-dob-input"
                  required
                  value={p1Dob}
                  onChange={setP1Dob}
                  className="py-2.5 text-xs font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">मोबाइल नंबर (वैकल्पिक / Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={p1Mobile}
                    onChange={(e) => setP1Mobile(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-2.5 pl-10 pr-3 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
                  />
                </div>
              </div>
            </div>

            {/* PARTNER 2 DETAILS */}
            <div className="space-y-4 p-5 rounded-3xl bg-white border border-emerald-100/80 shadow-xs">
              <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">P2</div>
                <div>
                  <h4 className="font-playfair text-sm font-bold text-slate-800">द्वितीय व्यक्ति (Person B)</h4>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Partner Profile Details</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">पूरा नाम (Full Name)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter partner name..."
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-2.5 pl-10 pr-3 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">जन्मतिथि (Date of Birth)</label>
                <DateInput
                  id="p2-dob-input"
                  required
                  value={p2Dob}
                  onChange={setP2Dob}
                  className="py-2.5 text-xs font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">मोबाइल नंबर (वैकल्पिक / Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 9812345678"
                    value={p2Mobile}
                    onChange={(e) => setP2Mobile(e.target.value)}
                    className="w-full bg-[#FDFCF7]/60 border border-[#E5E7EB] py-2.5 pl-10 pr-3 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isComputing}
              className="px-8 py-3.5 rounded-2xl bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#11245A] shadow-md active:scale-98 transition-all inline-flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {isComputing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  गणना जारी है (Calculating Synastry)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  सामंजस्य रिपोर्ट तैयार करें (Generate Compatibility Report)
                </>
              )}
            </button>
          </div>
        </form>

        {/* History Sidebar Panel */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              <h3 className="font-playfair text-sm font-bold text-slate-800">ऑडिट इतिहास (Saved History)</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {historyList.length} सुरक्षित
            </span>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Heart className="w-8 h-8 text-slate-200 mx-auto fill-slate-50" />
              <p className="text-xs text-slate-400">
                कोई पुराना इतिहास नहीं मिला। नए दंपतियों का विश्लेषण करने पर यह स्वतः सुरक्षित होगा।
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCalculate(undefined, item)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                    activeReportId === item.id 
                      ? 'bg-[#FDFCF7] border-[#D97706]/40 shadow-xs' 
                      : 'bg-[#FDFCF7]/30 hover:bg-[#FDFCF7]/80 border-slate-150'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[9px] font-mono text-[#D97706] bg-[#D97706]/5 border border-[#D97706]/10 px-1.5 py-0.5 rounded font-bold">
                      Match: {item.score}%
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.partner1Name} & {item.partner2Name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {item.dateStr}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                    <button
                      onClick={(e) => deleteHistoryItem(item.id, e)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors"
                      title="Delete entry"
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

      {/* DETAILED RESULTS SCREEN */}
      {report && (
        <motion.div 
          id="mc-results-wrapper" 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          
          {/* ACTION BANNER */}
          <div className="p-4 border border-[#F2E8DC] bg-[#FDFCF7] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs print:hidden">
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">LeoFamily Synastry Pro Verified</span>
              <p className="text-xs text-[#1F2937] font-semibold">
                वैवाहिक अनुकूलता प्रमाण पत्र: <strong className="text-[#B45309]">{report.personA.name}</strong> एवं <strong className="text-[#B45309]">{report.personB.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-[11px] font-bold tracking-wider uppercase hover:bg-[#11245A] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> प्रिंट / PDF रिपोर्ट
              </button>
            </div>
          </div>

          {/* PRINT-ONLY HEADLINE BANNER */}
          <div className="hidden print:block text-center border-b-2 border-amber-600 pb-6 space-y-1">
            <h1 className="font-playfair text-3xl font-extrabold text-[#111827]">LeoFamily Occult Sciences</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">वैवाहिक सामंजस्य एवं सिनैस्ट्री ऑडिट रिपोर्ट (7-Layer Analysis)</p>
            <div className="pt-2 flex justify-between text-[10px] font-mono text-slate-600">
              <span>दिनांक: {report.calculatedAt}</span>
              <span>Ref ID: {report.id}</span>
            </div>
          </div>

          {/* OVERALL HARMONY WHEEL & 7-LAYER SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Stability Card */}
            <div className="lg:col-span-5 bg-[#1E3A8A] text-white rounded-[36px] p-6 md:p-8 flex flex-col justify-between gap-6 shadow-md relative overflow-hidden">
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest font-extrabold">Overall Marriage Harmony</span>
                <h3 className="font-playfair text-2xl font-bold text-white">समग्र वैवाहिक सामंजस्य</h3>
                <p className="text-xs text-blue-200">{report.stabilityVerdictHi}</p>
              </div>

              {/* Progress Wheel */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#1E4FF0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#FBBF24"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={427.2}
                    strokeDashoffset={427.2 - (427.2 * report.overallHarmonyScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-playfair text-4xl font-black text-amber-400 tracking-tighter">
                    {report.overallHarmonyScore}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-blue-200 tracking-wider">Harmony</span>
                </div>
              </div>

              <div className="space-y-2 relative z-10 bg-white/10 p-4 rounded-2xl border border-white/10 text-[11px] leading-relaxed text-blue-100">
                <p>
                  <strong>वैदिक दृष्टिकोण:</strong> यह स्कोर दोनों के मूलांक (25%), भाग्यांक (25%), भावनात्मक जुड़ाव (15%), संवाद (15%), निष्ठा (10%) एवं आर्थिक दृष्टिकोण (10%) का भारित संयुक्त परिणाम है।
                </p>
              </div>
            </div>

            {/* Right Side 7-Layer Snapshot */}
            <div className="lg:col-span-7 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[36px] p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-4">
              <div className="border-b border-[#F2E8DC] pb-3">
                <h3 className="font-playfair text-lg font-bold text-slate-800">7-स्तरीय संबंध सामंजस्य (7-Layer Framework)</h3>
                <p className="text-xs text-slate-500">प्रत्येक आयाम में दोनों पार्टनर्स के अंकों का सटीक मिलान</p>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { label: '1. मूलांक / दैनिक स्वभाव (Personality)', val: report.sevenLayers.personality.score, color: 'bg-rose-500' },
                  { label: '2. भावनात्मक आवश्यकताएं (Emotional Needs)', val: report.sevenLayers.emotional.score, color: 'bg-amber-500' },
                  { label: '3. संवाद एवं अभिव्यक्ति (Communication)', val: report.sevenLayers.communication.score, color: 'bg-blue-500' },
                  { label: '4. विश्वास एवं निष्ठा (Trust & Commitment)', val: report.sevenLayers.trust.score, color: 'bg-indigo-500' },
                  { label: '5. मतभेद समाधान (Conflict Handling)', val: report.sevenLayers.conflict.score, color: 'bg-purple-500' },
                  { label: '6. गृहस्थी अपेक्षाएं (Family Expectations)', val: report.sevenLayers.marriageExpectations.score, color: 'bg-emerald-500' },
                  { label: '7. समग्र सामंजस्य (Overall Harmony)', val: report.sevenLayers.overallHarmony.score, color: 'bg-[#D97706]' },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700">{row.label}</span>
                      <span className="font-mono font-bold text-slate-900">{row.val}%</span>
                    </div>
                    <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                      <div className={`${row.color} h-full rounded-full transition-all duration-700`} style={{ width: `${row.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* PERSON A & PERSON B PROFILES SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Person A Profile */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center">A</div>
                  <div>
                    <h4 className="font-playfair text-base font-bold text-slate-800">{report.personA.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">DOB: {report.personA.standardDOB}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                  Person A
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">मूलांक (Mulank)</span>
                  <strong className="text-base text-rose-700 font-bold block">{report.personA.mulank}</strong>
                  <span className="text-[9px] text-slate-600 truncate block">{report.personA.mulankGraha}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">भाग्यांक (Bhagyank)</span>
                  <strong className="text-base text-blue-700 font-bold block">{report.personA.bhagyank}</strong>
                  <span className="text-[9px] text-slate-600 truncate block">{report.personA.bhagyankGraha}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Chaldean Name</span>
                  <strong className="text-base text-amber-700 font-bold block">{report.personA.chaldeanNameNumber}</strong>
                  <span className="text-[9px] text-slate-600 block">नामांक</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <p><strong>उपस्थित अंक:</strong> {Object.keys(report.personA.birthGrid).filter(k => report.personA.birthGrid[Number(k)] > 0).join(', ')}</p>
                <p><strong>अनुपस्थित (Missing):</strong> {report.personA.missingNumbers.join(', ') || 'कोई नहीं'}</p>
                <p><strong>सक्रिय तल (Planes):</strong> {report.personA.activePlanes.join(', ') || 'सामान्य संतुलन'}</p>
              </div>
            </div>

            {/* Person B Profile */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center">B</div>
                  <div>
                    <h4 className="font-playfair text-base font-bold text-slate-800">{report.personB.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">DOB: {report.personB.standardDOB}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Person B
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">मूलांक (Mulank)</span>
                  <strong className="text-base text-emerald-700 font-bold block">{report.personB.mulank}</strong>
                  <span className="text-[9px] text-slate-600 truncate block">{report.personB.mulankGraha}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">भाग्यांक (Bhagyank)</span>
                  <strong className="text-base text-blue-700 font-bold block">{report.personB.bhagyank}</strong>
                  <span className="text-[9px] text-slate-600 truncate block">{report.personB.bhagyankGraha}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Chaldean Name</span>
                  <strong className="text-base text-amber-700 font-bold block">{report.personB.chaldeanNameNumber}</strong>
                  <span className="text-[9px] text-slate-600 block">नामांक</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <p><strong>उपस्थित अंक:</strong> {Object.keys(report.personB.birthGrid).filter(k => report.personB.birthGrid[Number(k)] > 0).join(', ')}</p>
                <p><strong>अनुपस्थित (Missing):</strong> {report.personB.missingNumbers.join(', ') || 'कोई नहीं'}</p>
                <p><strong>सक्रिय तल (Planes):</strong> {report.personB.activePlanes.join(', ') || 'सामान्य संतुलन'}</p>
              </div>
            </div>

          </div>

          {/* INTERACTIVE EXPLORATION TABS */}
          <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-2 print:hidden">
            {[
              { id: '7LAYERS', label: '1. 7-स्तरीय विश्लेषण (7 Layers)', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'CROSS_SYNTHESIS', label: '2. क्रॉस-सिंथेसिस एवं नामांक (Cross Analysis)', icon: <Scale className="w-3.5 h-3.5" /> },
              { id: 'LOSHU_PLANES', label: '3. Lo Shu व प्लेन्स मिलान (Planes & Arrows)', icon: <Compass className="w-3.5 h-3.5" /> },
              { id: 'LIFE_ASPECTS', label: '4. गृहस्थी एवं जीवन क्षेत्र (Life Aspects)', icon: <Heart className="w-3.5 h-3.5" /> },
              { id: 'REMEDIES', label: '5. वैदिक उपाय व मुख्य निष्कर्ष (Remedies & Summary)', icon: <Sparkles className="w-3.5 h-3.5" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: 7 LAYERS DEEP DIVE */}
          {(activeTab === '7LAYERS' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== '7LAYERS' ? 'hidden print:block' : ''}`}>
              
              {/* Mulank & Bhagyank Core Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mulank Analysis */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                        Layer 1 • Personality
                      </span>
                      <h4 className="font-playfair text-base font-bold text-slate-800 mt-1">
                        मूलांक सामंजस्य: #{report.personA.mulank} बनाम #{report.personB.mulank}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full">
                      {report.mulankAnalysis.score}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.mulankAnalysis.explanationHi}
                  </p>

                  <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2 text-[11px] text-slate-700">
                    <strong className="text-rose-900 block font-bold">मुख्य व्यावहारिक अंतर्दृष्टि:</strong>
                    <ul className="space-y-1 list-disc pl-4">
                      {report.mulankAnalysis.keyInsightsHi.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bhagyank Analysis */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                        Layer 2 • Long-term Destiny
                      </span>
                      <h4 className="font-playfair text-base font-bold text-slate-800 mt-1">
                        भाग्यांक सामंजस्य: #{report.personA.bhagyank} बनाम #{report.personB.bhagyank}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full">
                      {report.bhagyankAnalysis.score}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.bhagyankAnalysis.explanationHi}
                  </p>

                  <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2 text-[11px] text-slate-700">
                    <strong className="text-blue-900 block font-bold">दीर्घकालिक जीवन दिशा:</strong>
                    <ul className="space-y-1 list-disc pl-4">
                      {report.bhagyankAnalysis.keyInsightsHi.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Emotional, Communication, Trust, Conflict Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Emotional Needs */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" /> भावनात्मक आवश्यकताएं एवं संवेदनशीलता
                    </h5>
                    <span className="text-xs font-mono font-bold text-amber-700">{report.sevenLayers.emotional.score}%</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.sevenLayers.emotional.explanationHi}
                  </p>
                  <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                    {report.sevenLayers.emotional.practicalTipsHi.map((tip, i) => (
                      <p key={i}>• {tip}</p>
                    ))}
                  </div>
                </div>

                {/* Communication */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-blue-500" /> संवाद शैली एवं विचार अभिव्यक्ति
                    </h5>
                    <span className="text-xs font-mono font-bold text-blue-700">{report.sevenLayers.communication.score}%</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.sevenLayers.communication.explanationHi}
                  </p>
                  <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                    {report.sevenLayers.communication.practicalTipsHi.map((tip, i) => (
                      <p key={i}>• {tip}</p>
                    ))}
                  </div>
                </div>

                {/* Trust & Commitment */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" /> विश्वास, निष्ठा एवं स्थिरता
                    </h5>
                    <span className="text-xs font-mono font-bold text-indigo-700">{report.sevenLayers.trust.score}%</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.sevenLayers.trust.explanationHi}
                  </p>
                  <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                    {report.sevenLayers.trust.practicalTipsHi.map((tip, i) => (
                      <p key={i}>• {tip}</p>
                    ))}
                  </div>
                </div>

                {/* Conflict Handling */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-purple-500" /> मतभेद समाधान एवं तनाव प्रबंधन
                    </h5>
                    <span className="text-xs font-mono font-bold text-purple-700">{report.sevenLayers.conflict.score}%</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.sevenLayers.conflict.explanationHi}
                  </p>
                  <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                    {report.sevenLayers.conflict.practicalTipsHi.map((tip, i) => (
                      <p key={i}>• {tip}</p>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CROSS SYNTHESIS & NAME ALIGNMENT */}
          {(activeTab === 'CROSS_SYNTHESIS' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'CROSS_SYNTHESIS' ? 'hidden print:block' : ''}`}>
              
              {/* Cross Synthesis Matrix */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div className="border-b border-slate-150 pb-3">
                  <h4 className="font-playfair text-lg font-bold text-slate-800">
                    मूलांक एवं भाग्यांक क्रॉस-सिंथेसिस (Mulank + Bhagyank Cross-Interaction)
                  </h4>
                  <p className="text-xs text-slate-500">
                    दैनिक आचरण और दीर्घकालिक भाग्य पथ का एक-दूसरे पर परस्पर प्रभाव
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#D97706]">
                        {report.personA.name} Mulank &rarr; {report.personB.name} Bhagyank
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {report.crossSynthesis.mulankVsBhagyankAtoB.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {report.crossSynthesis.mulankVsBhagyankAtoB.explanationHi}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#D97706]">
                        {report.personB.name} Mulank &rarr; {report.personA.name} Bhagyank
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {report.crossSynthesis.mulankVsBhagyankBtoA.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {report.crossSynthesis.mulankVsBhagyankBtoA.explanationHi}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-xs text-[#78350F] leading-relaxed">
                  <strong>क्रॉस-सिंथेसिस निष्कर्ष:</strong> {report.crossSynthesis.synthesisHi}
                </div>
              </div>

              {/* Name Numerology Alignment */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-150 pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-playfair text-lg font-bold text-slate-800">
                      नाम ध्वनि एवं कंपन सामंजस्य (Chaldean Name Synastry)
                    </h4>
                    <p className="text-xs text-slate-500">
                      सामाजिक प्रतिष्ठा, सार्वजनिक छवि और दैनिक संवाद में नाम तरंगों का प्रभाव
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                    {report.nameAnalysis.chaldean.score}%
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.nameAnalysis.chaldean.explanationHi}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border text-center">
                    <span className="text-[10px] font-mono text-slate-500 block">{report.personA.name} Chaldean Compound</span>
                    <strong className="text-lg font-mono text-slate-800 font-bold block">{report.personA.chaldeanNameNumber}</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border text-center">
                    <span className="text-[10px] font-mono text-slate-500 block">{report.personB.name} Chaldean Compound</span>
                    <strong className="text-lg font-mono text-slate-800 font-bold block">{report.personB.chaldeanNameNumber}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DUAL LO SHU & PLANES */}
          {(activeTab === 'LOSHU_PLANES' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'LOSHU_PLANES' ? 'hidden print:block' : ''}`}>
              
              {/* Dual Lo Shu Side-by-Side */}
              <div className="bg-[#FDFCF7] border border-[#F2E8DC] rounded-[36px] p-6 md:p-8 shadow-xs space-y-6">
                <div className="border-b border-[#F2E8DC] pb-3">
                  <h4 className="font-playfair text-lg font-bold text-slate-800">
                    Lo Shu जन्म ग्रिड तुलना (Dual Lo Shu Cross-Analysis)
                  </h4>
                  <p className="text-xs text-slate-500">
                    दोनों पार्टनर्स के 3x3 जन्म ग्रिड को साथ रखकर ऊर्जा की उपस्थिति और अनुपस्थिति का मिलान
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Grid A */}
                  <div className="space-y-3">
                    <h5 className="font-playfair text-xs font-bold text-center text-[#1E3A8A] uppercase tracking-wider">
                      {report.personA.name} का जन्म ग्रिड
                    </h5>
                    <div className="grid grid-cols-3 gap-2.5 max-w-[220px] mx-auto">
                      {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                        const count = report.loShuAnalysis.gridA[num] || 0;
                        return (
                          <div
                            key={`ga-${num}`}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all text-xs ${
                              count > 0 
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-950 font-bold shadow-xs' 
                                : 'bg-white border-slate-200/60 text-slate-300'
                            }`}
                          >
                            <span>{num}</span>
                            {count > 0 && (
                              <span className="text-[8px] font-mono bg-amber-400 text-amber-950 font-bold px-1 rounded-sm">
                                {count}x
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid B */}
                  <div className="space-y-3">
                    <h5 className="font-playfair text-xs font-bold text-center text-emerald-800 uppercase tracking-wider">
                      {report.personB.name} का जन्म ग्रिड
                    </h5>
                    <div className="grid grid-cols-3 gap-2.5 max-w-[220px] mx-auto">
                      {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                        const count = report.loShuAnalysis.gridB[num] || 0;
                        return (
                          <div
                            key={`gb-${num}`}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all text-xs ${
                              count > 0 
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-950 font-bold shadow-xs' 
                                : 'bg-white border-slate-200/60 text-slate-300'
                            }`}
                          >
                            <span>{num}</span>
                            {count > 0 && (
                              <span className="text-[8px] font-mono bg-emerald-400 text-emerald-950 font-bold px-1 rounded-sm">
                                {count}x
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Lo Shu Complementary Insights */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block font-bold">पूरक ऊर्जा चक्र (Complementary Elements):</strong>
                  <p>{report.loShuAnalysis.crossGridSynergyHi}</p>
                  <p className="border-t border-slate-100 pt-2 text-slate-600">{report.loShuAnalysis.remedialBalanceHi}</p>
                </div>
              </div>

              {/* Planes & Arrows Comparison Table */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-150 pb-2">
                  <h4 className="font-playfair text-base font-bold text-slate-800">
                    Lo Shu तलों का मिलान (Planes & Arrows Cross-Resonance)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.planeAnalysis.planes.map((p, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-800 font-bold">{p.nameHi}</strong>
                        <span className="text-[9px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          [{p.numbers.join('-')}]
                        </span>
                      </div>
                      <div className="flex gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-medium ${p.personAActive ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
                          {report.personA.name}: {p.personAActive ? 'सक्रिय' : 'अपूर्ण'}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-medium ${p.personBActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                          {report.personB.name}: {p.personBActive ? 'सक्रिय' : 'अपूर्ण'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">{p.dynamicHi}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: LIFE ASPECTS & MARRIAGE EXPECTATIONS */}
          {(activeTab === 'LIFE_ASPECTS' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'LIFE_ASPECTS' ? 'hidden print:block' : ''}`}>
              
              {/* Marriage & Partner Expectations */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-150 pb-3">
                  <h4 className="font-playfair text-lg font-bold text-slate-800">
                    वैवाहिक एवं जीवनसाथी अपेक्षाएं (Marriage & Partner Expectations)
                  </h4>
                  <p className="text-xs text-slate-500">
                    गृहस्थी, स्वतंत्रता और भावनात्मक समर्थन को लेकर दोनों की स्वाभाविक सोच
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2">
                    <strong className="text-rose-900 block font-bold">{report.personA.name} की गृहस्थी अपेक्षाएं:</strong>
                    <p className="text-slate-600 leading-relaxed">{report.lifeAspects.marriageExpectations.personAExpectationsHi}</p>
                    <p className="text-slate-500 text-[11px] pt-1"><strong>चाहत:</strong> {report.lifeAspects.partnerExpectations.personASeeksHi}</p>
                  </div>

                  <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2">
                    <strong className="text-emerald-900 block font-bold">{report.personB.name} की गृहस्थी अपेक्षाएं:</strong>
                    <p className="text-slate-600 leading-relaxed">{report.lifeAspects.marriageExpectations.personBExpectationsHi}</p>
                    <p className="text-slate-500 text-[11px] pt-1"><strong>चाहत:</strong> {report.lifeAspects.partnerExpectations.personBSeeksHi}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
                  <strong>सामंजस्य सेतु:</strong> {report.lifeAspects.marriageExpectations.alignmentHi} {report.lifeAspects.partnerExpectations.balanceHi}
                </div>
              </div>

              {/* Family & Financial Compatibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Family */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h5 className="font-playfair text-sm font-bold text-slate-800">
                      पारिवारिक संबंध एवं बड़ों का आदर
                    </h5>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {report.lifeAspects.familyCompatibility.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.lifeAspects.familyCompatibility.explanationHi}
                  </p>
                </div>

                {/* Financial */}
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h5 className="font-playfair text-sm font-bold text-slate-800">
                      आर्थिक दृष्टिकोण एवं धन प्रबंधन
                    </h5>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {report.lifeAspects.financialCompatibility.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.lifeAspects.financialCompatibility.explanationHi}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: REMEDIES & FINAL 7-POINT SUMMARY */}
          {(activeTab === 'REMEDIES' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'REMEDIES' ? 'hidden print:block' : ''}`}>
              
              {/* Vedic Relationship Remedies */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div className="border-b border-slate-150 pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-playfair text-lg font-bold text-slate-800">
                      पारंपरिक वैदिक एवं संबंध संतुलन उपाय (Relationship Harmony Remedies)
                    </h4>
                    <p className="text-xs text-slate-500">
                      दैनिक जीवनशैली, संवाद, रंग और वास्तु के सरल गैर-कठिन उपाय
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 block font-bold">दैनिक सात्विक दिनचर्या:</strong>
                    <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px] leading-relaxed">
                      {report.remedies.dailyRoutinesHi.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 block font-bold">शुभ रंग व सामंजस्य तिथियां:</strong>
                    <p className="text-slate-600 text-[11px]">
                      <strong>अनुकूल रंग:</strong> {report.remedies.auspiciousColors.join(', ')}
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      <strong>शुभ तिथियां (मासिक):</strong> {report.remedies.auspiciousDates.map(d => `${d}, ${d+9}, ${d+18}`).join(', ')}
                    </p>
                    <p className="text-slate-600 text-[11px] border-t border-slate-200 pt-1.5">
                      <strong>वास्तु निर्देश:</strong> {report.remedies.traditionalVastuHi}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong>संवाद व दान उपाय:</strong>
                  <p className="text-[11px] leading-relaxed">{report.remedies.communicationRemedyHi} • {report.remedies.traditionalDaanHi}</p>
                </div>
              </div>

              {/* FINAL 7-POINT SUMMARY */}
              <div className="bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] text-white rounded-[36px] p-6 md:p-8 shadow-md space-y-6">
                <div className="border-b border-blue-400/20 pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                      Executive Synastry Summary
                    </span>
                    <h4 className="font-playfair text-xl md:text-2xl font-bold text-white">
                      आप दोनों की Relationship में 7 मुख्य बातें
                    </h4>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full font-semibold">
                    परामर्श निष्कर्ष
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5 font-bold">1. सबसे मजबूत साझा क्षेत्र:</strong>
                      <p className="text-blue-100 text-[11px] leading-relaxed">{report.summary.strongestCommonAreaHi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5 font-bold">2. पूरक गुण एवं ऊर्जा संतुलन:</strong>
                      <p className="text-blue-100 text-[11px] leading-relaxed">{report.summary.complementaryAreaHi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5 font-bold">3. संवाद के लिए मुख्य सूत्र:</strong>
                      <p className="text-blue-100 text-[11px] leading-relaxed">{report.summary.communicationKeyHi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5 font-bold">4. भावनात्मक समझ का बिंदु:</strong>
                      <p className="text-blue-100 text-[11px] leading-relaxed">{report.summary.emotionalKeyHi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5 font-bold">5. विश्वास एवं निष्ठा की नींव:</strong>
                      <p className="text-blue-100 text-[11px] leading-relaxed">{report.summary.trustKeyHi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5 font-bold">6. व्यावहारिक समझ का क्षेत्र:</strong>
                      <p className="text-blue-100 text-[11px] leading-relaxed">{report.summary.practicalChallengeHi}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-400/20 pt-3 text-center">
                  <p className="text-xs text-amber-200 font-serif italic">
                    "{report.summary.traditionalGuidanceHi}"
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* DISCLAIMER */}
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
            <strong>अस्वीकरण (Disclaimer):</strong> {report.disclaimer}
          </div>

        </motion.div>
      )}

    </div>
  );
}
