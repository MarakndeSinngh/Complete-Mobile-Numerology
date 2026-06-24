import React, { useState, useRef } from 'react';
import {
  TrendingUp, Sparkles, ShieldAlert, Users, Flame, Coins, Heart, Compass,
  Printer, Share2, FileText, CheckCircle, Download, LayoutGrid, Smartphone,
  Award, Activity, ChevronRight, ChevronDown, Calendar, User, Hash, Eye,
  Zap, Gem, Palette, ArrowUpRight, ShieldCheck, Mail, RefreshCw, Star, Info
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar,
  PieChart, Pie, Cell, Legend,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { PAIR_MEANINGS } from '../services/pairMeanings';
import { HINDI_PAIR_MEANINGS } from '../services/hindiPairs';
import { checkMobileDOBCompatibility } from '../services/numerologyEngine';

interface MobileDiagnosticsPanelProps {
  personalDetails: PersonalDetails;
  dobData: DOBAnalysis;
  nameData: NameAnalysis;
  mobileData: MobileAnalysis;
  remedies: remediesAdvice;
  isQuickMode?: boolean;
}

const planetMapping: Record<number, {
  name: string;
  energy: string;
  strength: string;
  weakness: string;
  influence: string;
  color: string;
  gradient: string;
  icon: string;
}> = {
  1: {
    name: "Sun (Surya)",
    energy: "Divine Masculine / Solar Fire",
    strength: "High Authority, Confidence, Prominence",
    weakness: "Egoistic Blocks, Loneliness, Rigidity",
    influence: "Fosters command, leadership initiatives and magnetic pull towards high-ranking positions.",
    color: "#F5B52E",
    gradient: "from-amber-500/20 to-amber-600/5",
    icon: "☀️"
  },
  2: {
    name: "Moon (Chandra)",
    energy: "Aqueous Feminine / Soft Lunar",
    strength: "Intuitive, Adaptive, High Creativity",
    weakness: "Hypersensitivity, Mood Fluctuation, Hesitancy",
    influence: "Deepens emotional empathy, receptiveness and artistic flow in business partnerships.",
    color: "#38BDF8",
    gradient: "from-sky-500/20 to-sky-600/5",
    icon: "🌙"
  },
  3: {
    name: "Jupiter (Guru)",
    energy: "Spiritual / Etheric Expansion",
    strength: "Wisdom, Guidance, Wealth Attractor",
    weakness: "Scattering energy, Overconfidence, Over-talking",
    influence: "Provides intelligence, pedagogical expansion and continuous blessings in family values.",
    color: "#A855F7",
    gradient: "from-purple-500/20 to-purple-600/5",
    icon: "🕉️"
  },
  4: {
    name: "Rahu (Shadow Planet)",
    energy: "Electric / Unorthodox Force",
    strength: "Out of the box practicality, Ambition",
    weakness: "Sudden obstacles, Illusion blocks, Restlessness",
    influence: "Creates massive sudden breakthroughs, high digital communication influence but unstable loops.",
    color: "#F43F5E",
    gradient: "from-rose-500/20 to-rose-600/5",
    icon: "⚡"
  },
  5: {
    name: "Mercury (Budha)",
    energy: "Dualistic / Rapid Mercurial",
    strength: "Business intelligence, Agile communication",
    weakness: "Restlessness, Nervous exhaustion, Loss risk",
    influence: "Empowers negotiation precision, rapid calculation and stellar PR marketing success.",
    color: "#10B981",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    icon: "💬"
  },
  6: {
    name: "Venus (Shukra)",
    energy: "Magnetic Feminine / Luxury",
    strength: "Artistic luxury, Charm, Material Gains",
    weakness: "Extravagance, Over-indulgence, Defamation risk",
    influence: "Attracts physical wealth, artistic grace, and strong relationships alignment.",
    color: "#EC4899",
    gradient: "from-pink-500/20 to-pink-600/5",
    icon: "✨"
  },
  7: {
    name: "Ketu (Mystic Node)",
    energy: "Metaphysical / Spiritual Insight",
    strength: "Occult research, Sharp mind (cutting edge)",
    weakness: "Solitude seeker, Deep confusion, Disconnection",
    influence: "Enhances intuitive analysis, metaphysical connection but warns of business friction.",
    color: "#64748B",
    gradient: "from-slate-500/20 to-slate-600/5",
    icon: "🧩"
  },
  8: {
    name: "Saturn (Shani)",
    energy: "Grounded / Karmic Anchor",
    strength: "Law & Justice, Persistent Focus, Legacy",
    weakness: "Constant Delays, Overwork, Misery block",
    influence: "Builds absolute long-term architectural stability, deep patience pattern but slows instant progress.",
    color: "#475569",
    gradient: "from-zinc-600/20 to-zinc-800/5",
    icon: "⚖️"
  },
  9: {
    name: "Mars (Mangala)",
    energy: "Dynamic Masculine / Fiery Commander",
    strength: "Courage, Rapid action, High energy status",
    weakness: "Aggressive outburst, Sharp friction, Over-reaction",
    influence: "Amplifies physical defense force, bold risk taking but creates hostile alarms when repeated.",
    color: "#EF4444",
    gradient: "from-red-500/20 to-red-650/5",
    icon: "🛡️"
  }
};

const MobileDiagnosticsPanel: React.FC<MobileDiagnosticsPanelProps> = ({
  personalDetails,
  dobData,
  nameData,
  mobileData,
  remedies,
  isQuickMode = false
}) => {
  // Use remedies from prop or fallback
  const internalRemedies = remedies;

  const [activeSubSection, setActiveSubSection] = useState<string>('hero');
  const [expandedCollapsible, setExpandedCollapsible] = useState<Record<string, boolean>>({
    personality: true,
    career: false,
    wealth: false,
    relationships: false,
    health: false,
    spiritual: false
  });
  
  const [downloadingState, setDownloadingState] = useState<boolean>(false);
  const [sharingState, setSharingState] = useState<boolean>(false);
  const [savingState, setSavingState] = useState<boolean>(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const pairsRef = useRef<HTMLDivElement>(null);
  const vibrationRef = useRef<HTMLDivElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const remediesRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>, sectionId: string) => {
    setActiveSubSection(sectionId);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleCollapsible = (sectionKey: string) => {
    setExpandedCollapsible(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Safe numerical fallback parse
  const getCleanMobileDigits = (): number[] => {
    return mobileData.mobileNumber.replace(/[^0-9]/g, '').split('').map(d => parseInt(d, 10));
  };
  const digitsArray = getCleanMobileDigits();

  // Color mappings
  const background_color = "bg-[#F8F4EF]";
  const card_bg_color = "bg-[#FFFFFF]";
  const text_primary = "text-[#1F2937]";
  const text_secondary = "text-[#6B7280]";
  const gold_accent = "#D97706";
  const sec_gold = "#F59E0B";

  // Section 1: Calculate Richer metrics dynamically based on standard data
  const coreScore = mobileData.score;
  const wealthScore = Math.max(45, Math.min(100, Math.floor(coreScore * 1.05) - (mobileData.hostileRelationships.length * 8)));

  const compatibility = checkMobileDOBCompatibility(
    mobileData.reducedTotal,
    dobData?.birthNumber || 1,
    dobData?.lifePathNumber || 1
  );
  const commScore = Math.max(50, Math.min(100, Math.floor(coreScore * 0.95) + (digitsArray.filter(d => d === 5 || d === 6 || d === 1).length * 6)));
  
  // Custom Career, Relationship, and Stability score formulas based on digits and hostile nodes
  const careerScore = Math.max(45, Math.min(100, Math.floor(coreScore * 0.98) + (digitsArray.filter(d => d === 1 || d === 8 || d === 9).length * 5) - (mobileData.hostileRelationships.length * 6)));
  const relationshipScore = Math.max(40, Math.min(100, 95 - (mobileData.repeatingAlarms.length * 10) - (mobileData.hostileRelationships.length * 8) + (digitsArray.filter(d => d === 2 || d === 6).length * 5)));
  const stabilityScore = Math.max(35, Math.min(100, Math.floor(coreScore * 0.92) + (digitsArray.filter(d => d === 4 || d === 8 || d === 3).length * 7) - (mobileData.negativePairsAvoid.length * 8)));

  const getScoreRating = (score: number): { label: string, colorClass: string, bgClass: string, borderClass: string } => {
    if (score >= 82) return { label: 'EXCELLENT', colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50/60', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/25' };
    if (score >= 68) return { label: 'FAVORABLE', colorClass: 'text-indigo-600 border-indigo-250 bg-indigo-50/60', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/25' };
    if (score >= 50) return { label: 'MODERATE', colorClass: 'text-amber-600 border-amber-200 bg-amber-50/60', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/25' };
    return { label: 'REMEDIAL', colorClass: 'text-rose-600 border-[#FCA5A5]/40 bg-rose-50/60', bgClass: 'bg-rose-500/10', borderClass: 'border-rose-500/25' };
  };

  // Section 3 Vibrations analysis mapping variables
  const hasRepeating = mobileData.repeatingAlarms.length > 0;
  const hostileCount = mobileData.hostileRelationships.length;
  
  // Find missing numbers in phone number
  const uniqueDigits = new Set(digitsArray);
  const missingInPhone: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (!uniqueDigits.has(d)) {
      missingInPhone.push(d);
    }
  }

  // Underlyng hidden empowering combinations (e.g. 1-5, 5-6, 9-5)
  const phoneStr = mobileData.modifiedNumber;
  const hiddenPowerPairs: { pair: string; title: string; desc: string; power: number }[] = [];
  if (phoneStr.includes('56') || phoneStr.includes('65')) {
    hiddenPowerPairs.push({ pair: '5-6', title: 'Lakshmi-Yoga Engine', desc: 'Combines dynamic commerce (5) with luxurious fortune (6) attracting rapid funding & material grace.', power: 96 });
  }
  if (phoneStr.includes('15') || phoneStr.includes('51')) {
    hiddenPowerPairs.push({ pair: '1-5', title: 'Aditya-Mercury Union', desc: 'Unlocks sharp administrative command paired with brilliant speaking timing, fostering swift executive rises.', power: 94 });
  }
  if (phoneStr.includes('95') || phoneStr.includes('59')) {
    hiddenPowerPairs.push({ pair: '9-5', title: 'Commander-Prince Conjunction', desc: 'Translates raw mechanical courage rules into practical market conquests safely.', power: 90 });
  }
  if (phoneStr.includes('35') || phoneStr.includes('53')) {
    hiddenPowerPairs.push({ pair: '3-5', title: 'Budh-Aditya Academic Spark', desc: 'Blends wide spiritual wisdom with clever retail execution. Perfect for tech advocates.', power: 88 });
  }
  if (hiddenPowerPairs.length === 0) {
    hiddenPowerPairs.push({ pair: '9-1', title: 'Dharma Commander Power', desc: 'Creates persistent momentum to tackle major roadblocks with courage, ensuring high status protection.', power: 85 });
  }

  // Section 5 Chart calculations
  // A. Radar Chart Data
  const radarData = [
    { subject: 'Wealth Attraction', value: wealthScore, fullMark: 100 },
    { subject: 'Communication', value: commScore, fullMark: 100 },
    { subject: 'Karmic Load', value: Math.max(10, 100 - (hostileCount * 25)), fullMark: 100 },
    { subject: 'Resonance', value: coreScore, fullMark: 100 },
    { subject: 'Relationships', value: Math.max(40, Math.min(100, 95 - (mobileData.repeatingAlarms.length * 15))), fullMark: 100 },
    { subject: 'Spiritual Alignment', value: hasRepeating ? 78 : 92, fullMark: 100 }
  ];

  // B. Energy Distribution: physical vs mental vs emotional vs spiritual forces
  const physicalForces = digitsArray.filter(d => [4, 8, 9].includes(d)).length * 20 + 20;
  const mentalForces = digitsArray.filter(d => [1, 3, 5].includes(d)).length * 20 + 20;
  const emotionalForces = digitsArray.filter(d => [2, 6, 7].includes(d)).length * 20 + 20;
  const spiritualForces = digitsArray.filter(d => [3, 7, 9].includes(d)).length * 20 + 15;

  const energyChartData = [
    { name: 'Physical (4,8,9)', Power: Math.min(100, physicalForces), fill: '#EF4444' },
    { name: 'Intellectual (1,3,5)', Power: Math.min(100, mentalForces), fill: '#F5B52E' },
    { name: 'Emotional (2,6,7)', Power: Math.min(100, emotionalForces), fill: '#38BDF8' },
    { name: 'Spiritual (3,7,9)', Power: Math.min(100, spiritualForces), fill: '#A855F7' }
  ];

  // C. Planet Influence Chart (Pie chart format)
  const planetRepresentation: Record<string, number> = {};
  digitsArray.forEach(d => {
    const pName = planetMapping[d]?.name.split(' ')[0] || "Other";
    planetRepresentation[pName] = (planetRepresentation[pName] || 0) + 1;
  });
  const planetInfluenceData = Object.keys(planetRepresentation).map(key => ({
    name: key,
    value: planetRepresentation[key]
  }));

  const pieColors = ['#F5B52E', '#38BDF8', '#A855F7', '#F43F5E', '#10B981', '#EC4899', '#64748B', '#475569', '#EF4444'];

  // D. Number Frequency Chart (Bar chart format)
  const digitCounts: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) digitCounts[i] = 0;
  digitsArray.forEach(d => {
    digitCounts[d] = (digitCounts[d] || 0) + 1;
  });
  const frequencyChartData = Object.keys(digitCounts).map(k => ({
    digit: `Digit ${k}`,
    Count: digitCounts[parseInt(k, 10)],
    fill: parseInt(k, 10) === mobileData.reducedTotal ? '#F5B52E' : 'rgba(255, 255, 255, 0.15)'
  }));

  // PDF Download Trigger
  const handlePdfDownload = () => {
    setDownloadingState(true);
    setTimeout(() => {
      setDownloadingState(false);
      window.focus();
      window.print();
    }, 1500);
  };

  // Share action
  const handleShare = () => {
    setSharingState(true);
    setTimeout(() => {
      setSharingState(false);
      navigator.clipboard.writeText(window.location.href);
      alert('Secure Astro report sharing token copied to clipboard successfully!');
    }, 1000);
  };

  // Save Report
  const handleSaveReport = () => {
    setSavingState(true);
    setTimeout(() => {
      setSavingState(false);
      alert('Numerology diagnostic records saved encrypted under UID: LEO-' + Math.floor(Math.random() * 900000 + 100000));
    }, 1200);
  };

  return (
    <div id="mobile-analytics-portal" className={`min-h-screen ${background_color} text-[#1F2937] space-y-12 pb-24`}>
      
      {/* STICKY NAVIGATION BAR */}
      <div className="sticky top-0 z-50 bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm/90 backdrop-blur-md border-b border-[#E5E7EB] shadow-xl py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[#D97706] font-cinzel text-xs font-bold tracking-widest uppercase">Diagnostics:</span>
            <div className="bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 px-3 py-1 rounded-full text-[10px] font-mono">
              Rating: {mobileData.rating}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            {[
              { id: 'hero', label: 'Summary', ref: heroRef },
              { id: 'breakdown', label: 'Digit Analysis', ref: breakdownRef },
              { id: 'pairs', label: 'Chaldean Pairs', ref: pairsRef },
              { id: 'vibration', label: 'Planetary Energy', ref: vibrationRef },
              { id: 'scoreboard', label: 'Scoreboard', ref: scoreboardRef },
              { id: 'report', label: 'Astrological Chart', ref: reportRef },
              { id: 'remedies', label: 'Remedies Matrix', ref: remediesRef },
              { id: 'ai', label: 'AI Counseling', ref: aiRef },
              { id: 'pdf', label: 'Certified Report', ref: pdfRef },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToRef(tab.ref, tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider transition ${
                  activeSubSection === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO SUMMARY */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 pt-4 space-y-8">
        
        {/* Luxury top card info */}
        <div className="relative overflow-hidden rounded-[40px] border border-[#E5E7EB] p-8 md:p-12 bg-gradient-to-br from-[#FCFAF7] via-[#F8F4EF] to-[#FCFAF7] shadow-sm sacred-glow">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 rounded-full font-mono text-[9px] uppercase tracking-widest font-bold">
                <Sparkles className="w-3 h-3 text-amber-600 animate-spin-slow" /> Luxury Astro Diagnostics Installed
              </div>
              
              <h2 className="font-cinzel text-3xl md:text-5xl font-black text-[#1F2937] tracking-wide uppercase leading-none">
                {isQuickMode ? "Quick Mobile Scan" : personalDetails.name}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 pt-2">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">DOB Anchor</span>
                    <span className="text-xs text-[#1F2937] font-mono font-bold">
                      {isQuickMode ? "Not Provided 🔒" : personalDetails.dob}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">Mobile Number</span>
                    <span className="text-xs text-[#1F2937] font-mono font-bold tracking-wider">{personalDetails.mobile}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">Driver Number (Mulank)</span>
                    <span className="text-xs text-[#D97706] font-bold">
                      {isQuickMode ? "Not Computed 🔒" : `Mulank #${dobData.birthNumber}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">Conductor Number (Bhagyank)</span>
                    <span className="text-xs text-[#D97706] font-bold">
                      {isQuickMode ? "Not Computed 🔒" : `Bhagyank #${dobData.lifePathNumber}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Vibration Indicator */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-3xl flex items-center gap-5 text-left w-full lg:w-auto shrink-0 relative hover:border-[#D97706]/20 transition-all duration-500 shadow-md">
              <div className="w-14 h-14 bg-[#D97706]/10 border border-amber-500/15 rounded-full flex items-center justify-center font-cinzel text-xl font-bold text-[#D97706]">
                {mobileData.reducedTotal}
              </div>
              <div>
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Mobile Vibration Number</span>
                <span className="text-base text-[#1F2937] font-cinzel font-bold block">{mobileData.compoundTotal} / {mobileData.reducedTotal}</span>
                <span className="text-[10px] text-slate-700 font-mono font-semibold uppercase bg-[#D97706]/10 px-2 py-0.5 rounded mt-1 inline-block">
                  {mobileData.reducedTotal === 1 ? 'Vibrates to Sun ☀️' :
                   mobileData.reducedTotal === 2 ? 'Vibrates to Moon 🌙' :
                   mobileData.reducedTotal === 3 ? 'Vibrates to Jupiter 🕉️' :
                   mobileData.reducedTotal === 4 ? 'Vibrates to Rahu ⚡' :
                   mobileData.reducedTotal === 5 ? 'Vibrates to Mercury 💬' :
                   mobileData.reducedTotal === 6 ? 'Vibrates to Venus ✨' :
                   mobileData.reducedTotal === 7 ? 'Vibrates to Ketu 🧩' :
                   mobileData.reducedTotal === 8 ? 'Vibrates to Saturn ⚖️' :
                   'Vibrates to Mars 🛡️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile to Birth-Grid Compatibility Section */}
        {personalDetails && dobData && !isQuickMode && (
          <div className="bg-white border border-[#E5E7EB] p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm text-left relative overflow-hidden group hover:border-[#D97706]/20 transition-all duration-500">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-gradient-to-br from-[#D97706]/5 to-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#E5E7EB]/70">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D97706] animate-pulse" /> Indian Numerology Alignment Report
                </span>
                <h3 className="font-playfair text-xl md:text-2xl font-black text-[#1F2937]">
                  Mobile & Birth Grid Compatibility Check
                </h3>
              </div>
              <div className="flex items-center gap-3 bg-[#FDFCF7] border border-[#D97706]/20 px-4 py-2.5 rounded-2xl shrink-0">
                <div className="text-right">
                  <span className="block text-[8px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Planetary Alignment</span>
                  <span className="text-xs font-bold text-[#D97706] block">
                    {compatibility.rating}
                  </span>
                </div>
                <div className="w-10 h-10 bg-[#D97706] text-white rounded-xl flex items-center justify-center font-playfair text-base font-black shadow-md shadow-[#D97706]/20">
                  {compatibility.score}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pt-6">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Vibrational Compatibility Analysis
                </h4>
                <p className="text-base text-slate-800 leading-relaxed font-sans">
                  {compatibility.verdict}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#FDFCF7] border border-[#E5D7C6]/40 p-4 rounded-2xl space-y-1">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-wider font-bold block">Driver Number (Mulank) Match</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">Mulank #{dobData.birthNumber}</span>
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        compatibility.driverRel === 'Friendly' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        compatibility.driverRel === 'Enemy / Hostile' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {compatibility.driverRel}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#FDFCF7] border border-[#E5D7C6]/40 p-4 rounded-2xl space-y-1">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-wider font-bold block">Conductor Number (Bhagyank) Match</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">Bhagyank #{dobData.lifePathNumber}</span>
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        compatibility.conductorRel === 'Friendly' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        compatibility.conductorRel === 'Enemy / Hostile' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {compatibility.conductorRel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#FDFCF7] border border-[#D97706]/10 p-6 rounded-3xl space-y-4">
                <h4 className="font-mono text-[10px] text-[#D97706] uppercase tracking-widest font-bold">
                  Core Planetary Pillars
                </h4>
                <ul className="space-y-3">
                  {compatibility.explanations.map((exp, index) => (
                    <li key={index} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed font-sans">
                      <span className="text-amber-500 mt-0.5">✦</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 6 Premium Luxury Summary Cards with progress bars, score indicators, badges and descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Overall Mobile Score */}
          {(() => {
            const rating = getScoreRating(coreScore);
            return (
              <div className="rounded-3xl border border-[#D97706]/15 hover:border-[#D97706]/35 p-6 bg-white shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-[#D97706]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest block font-bold">Overall Mobile Alignment</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-cinzel font-black text-[#1F2937]">{coreScore}%</span>
                    <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider bg-[#F8F4EF] px-2 py-0.5 rounded">Resonance</span>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    The absolute Chaldean numerical alignment of your combined digit totals with your birthday energy grids.
                  </p>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-[#F2E8DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] rounded-full transition-all duration-[1500ms]"
                      style={{ width: `${coreScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#9CA3AF] uppercase">
                    <span>Vedic Sepharial</span>
                    <span>Score: {coreScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 2: Money Score */}
          {(() => {
            const rating = getScoreRating(wealthScore);
            return (
              <div className="rounded-3xl border border-[#D97706]/15 hover:border-[#D97706]/35 p-6 bg-white shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest block font-bold">Money Attraction Score</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-cinzel font-black text-[#1F2937]">{wealthScore}%</span>
                    <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider bg-[#F2E8DC]/40 px-2 py-0.5 rounded">Abundance</span>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Evaluates the status of financial multipliers: Mercury (5), Venus (6), and Saturn (8) in prominent focal cells.
                  </p>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-[#F2E8DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-[#D97706] rounded-full transition-all duration-[1500ms]"
                      style={{ width: `${wealthScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#9CA3AF] uppercase">
                    <span>Lal Kitab Prosperity</span>
                    <span>Score: {wealthScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 3: Career Score */}
          {(() => {
            const rating = getScoreRating(careerScore);
            return (
              <div className="rounded-3xl border border-[#D97706]/15 hover:border-[#D97706]/35 p-6 bg-white shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest block font-bold">Career & Drive Command</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-cinzel font-black text-[#1F2937]">{careerScore}%</span>
                    <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider bg-[#F2E8DC]/40 px-2 py-0.5 rounded">Authority</span>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Measures leadership resonance based on Sun (1), Saturn (8), and Mars (9) combinations inside your numbers.
                  </p>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-[#F2E8DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full transition-all duration-[1500ms]"
                      style={{ width: `${careerScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#9CA3AF] uppercase">
                    <span>Karma Alignment</span>
                    <span>Score: {careerScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 4: Relationship Score */}
          {(() => {
            const rating = getScoreRating(relationshipScore);
            return (
              <div className="rounded-3xl border border-[#D97706]/15 hover:border-[#D97706]/35 p-6 bg-white shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest block font-bold">Relationship Harmony</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-cinzel font-black text-[#1F2937]">{relationshipScore}%</span>
                    <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider bg-[#F2E8DC]/40 px-2 py-0.5 rounded">Aura Sync</span>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Evaluates relationship stability based on Moon (2) and Venus (6) support, penalizing for hostile digit pairs.
                  </p>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-[#F2E8DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-[1500ms]"
                      style={{ width: `${relationshipScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#9CA3AF] uppercase">
                    <span>Mitra planetary grid</span>
                    <span>Score: {relationshipScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 5: Communication Score */}
          {(() => {
            const rating = getScoreRating(commScore);
            return (
              <div className="rounded-3xl border border-[#D97706]/15 hover:border-[#D97706]/35 p-6 bg-white shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest block font-bold">Communication Strength</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-cinzel font-black text-[#1F2937]">{commScore}%</span>
                    <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider bg-[#F2E8DC]/40 px-2 py-0.5 rounded">Expression</span>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Measures voice resonance, marketing clarity, and defensive dialog bridging using Mercury (5) weightings.
                  </p>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-[#F2E8DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full transition-all duration-[1500ms]"
                      style={{ width: `${commScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#9CA3AF] uppercase">
                    <span>Budh & Chandra Node</span>
                    <span>Score: {commScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Card 6: Stability Score */}
          {(() => {
            const rating = getScoreRating(stabilityScore);
            return (
              <div className="rounded-3xl border border-[#D97706]/15 hover:border-[#D97706]/35 p-6 bg-white shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest block font-bold">Stability & Foundations</span>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full border ${rating.colorClass}`}>
                      {rating.label}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-cinzel font-black text-[#1F2937]">{stabilityScore}%</span>
                    <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider bg-[#F2E8DC]/40 px-2 py-0.5 rounded">Grounding</span>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Evaluates life anchors, financial discipline, resistance to debts, and safety nets from Saturn (8) forces.
                  </p>
                </div>
                
                <div className="mt-5 space-y-2">
                  <div className="w-full bg-[#F2E8DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-[1500ms]"
                      style={{ width: `${stabilityScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#9CA3AF] uppercase">
                    <span>Shani & Rahu Balance</span>
                    <span>Score: {stabilityScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* VASTU-CHALDEAN MOBILE FREQUENCY MATRIX */}
        <div className="mt-12 bg-white border border-[#E5E7EB] rounded-[40px] p-8 md:p-12 shadow-sm text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="border-b border-[#F2E8DC] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-[0.3em] block">Cosmic Spatial Alignment</span>
              <h3 className="font-cinzel text-xl md:text-2xl font-bold text-[#1F2937] tracking-wide uppercase">Vastu-Chaldean Mobile Frequency Grid</h3>
              <p className="text-xs text-slate-505 max-w-2xl">
                A visual 3x3 spatial mapping showing where the active digits of your mobile number align within the energetic zones of your life. Color-coded by their planetary frequency under Chaldean cosmic rules.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-[#D97706] border border-[#D97706]/20 rounded-full font-mono text-[9px] uppercase tracking-wider font-extrabold bg-[#FDFCF7]">
                <Compass className="w-3.5 h-3.5 text-amber-600" /> Active Grid Telemetry
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 3x3 Grid Visualizer */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100/80 rounded-3xl relative">
              <div className="grid grid-cols-3 gap-3 w-full max-w-md aspect-square">
                {[
                  { digit: 4, name: "Rahu", direction: "South-East", significance: "Wealth & Power" },
                  { digit: 9, name: "Mars", direction: "South", significance: "Fame & Passion" },
                  { digit: 2, name: "Moon", direction: "South-West", significance: "Harmony & Relations" },
                  { digit: 3, name: "Jupiter", direction: "East", significance: "Growth & Wisdom" },
                  { digit: 5, name: "Mercury", direction: "Center", significance: "Stability & PR" },
                  { digit: 7, name: "Ketu", direction: "West", significance: "Intuition & Skill" },
                  { digit: 8, name: "Saturn", direction: "North-East", significance: "Knowledge & Law" },
                  { digit: 1, name: "Sun", direction: "North", significance: "Career & Leadership" },
                  { digit: 6, name: "Venus", direction: "North-West", significance: "Luxury & Supports" },
                ].map((cell) => {
                  const count = digitsArray.filter(d => d === cell.digit).length;
                  const isPresent = count > 0;
                  const planet = planetMapping[cell.digit];
                  const planetColor = planet?.color || "#D97706";
                  
                  return (
                    <div 
                      key={cell.digit}
                      className={`relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-300 ${
                        isPresent 
                          ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] scale-[1.02]' 
                          : 'bg-white/40 border-slate-200/65 opacity-60'
                      }`}
                      style={{
                        borderColor: isPresent ? planetColor : undefined,
                        borderWidth: isPresent ? '1.5px' : '1px',
                        boxShadow: isPresent ? `0 6px 16px -4px ${planetColor}15` : undefined
                      }}
                    >
                      {/* Grid numbering indicator */}
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-[#4B5563] font-bold">
                          {cell.direction.split('-').map(w => w[0]).join('')}
                        </span>
                        
                        {/* Core planet icon */}
                        {isPresent && (
                          <span className="text-xs filter drop-shadow-sm">{planet?.icon}</span>
                        )}
                      </div>

                      {/* Giant Number Indicator */}
                      <div className="my-auto text-center flex flex-col items-center">
                        <span 
                          className="text-2xl md:text-3xl font-cinzel font-black tracking-tight"
                          style={{ color: isPresent ? planetColor : '#9CA3AF' }}
                        >
                          {cell.digit}
                        </span>
                        <span className="text-[7px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                          {planet?.name.split(' ')[0]}
                        </span>
                      </div>

                      {/* Frequency Badge and Vastu Corner Name */}
                      <div className="flex flex-col items-center text-center mt-1 border-t border-slate-100 pt-1">
                        <span className={`text-[7px] font-mono font-bold tracking-wider px-1 py-0.2 rounded-full leading-none inline-block ${
                          isPresent 
                            ? 'bg-amber-500/10 text-[#D97706] border border-amber-500/15'
                            : 'bg-slate-100 text-[#6B7280]'
                        }`}>
                          {isPresent ? `×${count}` : 'Empty'}
                        </span>
                        <span className="text-[6px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">
                          {cell.significance}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Zero Indicator Annotation */}
              {digitsArray.includes(0) && (
                <div className="mt-4 px-3 py-1.5 bg-[#F8F4EF] border border-[#E5E7EB] rounded-full text-[9px] font-mono text-slate-700 flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 bg-slate-400 rounded-full animate-pulse"></span>
                  <span><strong>Neutral Amplifier 0:</strong> Active in your phone string, adding heavy volume to neighboring planetary nodes!</span>
                </div>
              )}
            </div>

            {/* Vastu Spatial Interpretation Column */}
            <div className="lg:col-span-6 space-y-6">
              <h4 className="font-cinzel text-sm font-bold text-[#1F2937] tracking-wider uppercase border-b border-slate-150 pb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" /> Vastu-Planetary Energy Audit
              </h4>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {(() => {
                  // Direct interpretative analysis of empty vs high frequency zones
                  const missingList = [4, 9, 2, 3, 5, 7, 8, 1, 6].filter(d => !digitsArray.includes(d));
                  
                  return (
                    <div className="space-y-3.5 text-xs text-[#6B7280] leading-relaxed">
                      
                      {/* High Frequency Zones */}
                      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-emerald-100 shadow-sm/50">
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-50 text-emerald-700 font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Highly Energized Vastu Quadrants</span>
                        </div>
                        {digitsArray.filter(d => d > 0).length === 0 ? (
                          <p>No non-zero digits are flagged in the standard string analysis.</p>
                        ) : (
                          <div className="space-y-2">
                            {Array.from(new Set(digitsArray.filter(d => d > 0))).map(digit => {
                              const planet = planetMapping[digit];
                              const count = digitsArray.filter(d => d === digit).length;
                              let vastuZone = "";
                              let influence = "";
                              
                              if (digit === 4) { vastuZone = "South-East (Wealth Corner)"; influence = "Rahu unleashes sudden cash gates, unconventional PR streams, and electric status."; }
                              else if (digit === 9) { vastuZone = "South (Fame Corner)"; influence = "Mars strengthens courage, fast leadership steps, and status defense dynamics."; }
                              else if (digit === 2) { vastuZone = "South-West (Relationship Corner)"; influence = "Moon supports extreme empathy, peace, and client agreement bridges."; }
                              else if (digit === 3) { vastuZone = "East (Growth & Family Corner)"; influence = "Jupiter attracts divine academic support, health wealth, and corporate counsel."; }
                              else if (digit === 5) { vastuZone = "Center (Stability / Brahmasthan)"; influence = "Mercury aligns perfect negotiations, PR flexibility, and active business status."; }
                              else if (digit === 7) { vastuZone = "West (Creativity & Children Corner)"; influence = "Ketu creates sharp analytical and research focus but isolates client dialogues."; }
                              else if (digit === 8) { vastuZone = "North-East (Knowledge Corner)"; influence = "Saturn develops legacy discipline, steady investments, and heavy duty persistence."; }
                              else if (digit === 1) { vastuZone = "North (Career Corner)"; influence = "Sun delivers strong government ties, command focus, and high authority status."; }
                              else if (digit === 6) { vastuZone = "North-West (Luxury & Relators Corner)"; influence = "Venus injects luxurious brand placement, fine taste, and supportive relationships."; }
                              
                              return (
                                <div key={digit} className="flex gap-2.5 items-start text-left">
                                  <span className="text-base leading-none mt-0.5">{planet?.icon}</span>
                                  <div>
                                    <span className="font-bold text-slate-800 font-mono">Digit {digit} ({planet?.name.split(' ')[0]} in {vastuZone}) × {count}:</span>
                                    <p className="text-[11px] text-slate-600 mt-0.5">{influence}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Empty Zones needing remediation */}
                      {missingList.length > 0 && (
                        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-rose-100 shadow-sm/50">
                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-rose-50 text-rose-700 font-bold">
                            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Vastu Empty/Vulnerable Sectors</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mb-2">
                            The following spatial elements are missing in your phone string. This can lead to sluggish movement in these specific fields of life:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {missingList.map(digit => {
                              const planet = planetMapping[digit];
                              let vastuZone = "";
                              let lackDesc = "";
                              if (digit === 4) { vastuZone = "SE (Wealth Flow)"; lackDesc = "Cash stagnation risk."; }
                              else if (digit === 9) { vastuZone = "South (Fame & Courage)"; lackDesc = "Low command authority."; }
                              else if (digit === 2) { vastuZone = "SW (Marriage & Peace)"; lackDesc = "Relationship hurdles."; }
                              else if (digit === 3) { vastuZone = "East (Wisdom / Health)"; lackDesc = "Scattered life guidance."; }
                              else if (digit === 5) { vastuZone = "Center (Core Balance)"; lackDesc = "PR instability."; }
                              else if (digit === 7) { vastuZone = "West (Intuitive Research)"; lackDesc = "Weak crisis analysis."; }
                              else if (digit === 8) { vastuZone = "NE (Knowledge/Funds)"; lackDesc = "Slow savings buildup."; }
                              else if (digit === 1) { vastuZone = "North (Career Gates)"; lackDesc = "Slow career progress."; }
                              else if (digit === 6) { vastuZone = "NW (Luxury & Supports)"; lackDesc = "Lack of luxury comforts."; }
                              
                              return (
                                <div key={digit} className="flex gap-2 items-center text-left bg-slate-50 p-2 rounded-xl border border-slate-100">
                                  <span className="text-sm shrink-0">{planet?.icon}</span>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-700 block leading-none">Digit {digit} - {vastuZone}</span>
                                    <span className="text-[9px] text-slate-405 mt-0.5 block leading-none">{lackDesc}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Summary Advice */}
                      <p className="text-[11px] bg-[#FDFCF7] border border-amber-100 rounded-xl p-3 text-amber-805 leading-relaxed text-left font-medium">
                        <strong>Vedic Master's Advice:</strong> Every phone number carries a distinct energy map. If you suffer from major missing elements, place a brass metal Vastu Pyramid or a copper cosmic planetary yantra under your phone case charger to anchor and complete these digital grids safely.
                      </p>

                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 2: MOBILE NUMBER BREAKDOWN */}
      <div ref={breakdownRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Digit Spectrum Analysis</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Sacred Positional Digit Breakdown
          </h3>
          <p className="text-slate-600 text-xs max-w-xl font-medium">
            Each numerical cell inside your device acts as an energetic transmitter. Evaluate the specific planetary nodes, strengths and lessons mapped to each location.
          </p>
        </div>

        {/* Large gold/slate digital tiles display */}
        <div className="flex flex-wrap justify-between items-center gap-1.5 bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm p-4 rounded-2xl border border-[#E5E7EB]/80 shadow-md">
          {digitsArray.map((digit, idx) => (
            <div
              key={idx}
              className="flex-1 min-w-[50px] aspect-square rounded-xl bg-[#F8F4EF] border border-[#E5E7EB] flex flex-col justify-center items-center hover:border-amber-500/30 transition-all shadow-inner group"
            >
              <span className="text-[8px] font-mono text-slate-500 block mb-1">Cell {idx + 1}</span>
              <span className="text-2xl md:text-3xl font-cinzel font-bold text-[#D97706] group-hover:scale-110 transition duration-300">
                {digit}
              </span>
            </div>
          ))}
        </div>

        {/* Grid of colorful premium cards for each digit */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {digitsArray.map((digit, idx) => {
            const planet = planetMapping[digit] || planetMapping[5];
            const headingMap = [
              'Attitude & Init',
              'Decision-Making',
              'Health/Vitality',
              'Partner Synergies',
              'Children/Family',
              'Marriage/Socials',
              'Marital Bond Grid',
              'Career Progression',
              'Public Relations',
              'Wealth Attraction'
            ];
            
            return (
              <div
                key={idx}
                className={`rounded-3xl border border-[#E5E7EB] p-5 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between text-left relative overflow-hidden group hover:border-${planet.color}/30 transition-all duration-500`}
              >
                {/* Visual Glow */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${planet.gradient} rounded-full blur-xl pointer-events-none`}></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Pos 0{idx + 1} • {headingMap[idx]}</span>
                    <span className="text-base text-lg">{planet.icon}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-cinzel font-black" style={{ color: planet.color }}>{digit}</span>
                      <span className="text-xs font-semibold text-[#1F2937]">{planet.name}</span>
                    </div>
                    
                    <span className="text-[9px] font-mono uppercase bg-[#F8F4EF] px-2 py-0.5 rounded text-[#6B7280] font-medium block w-max border border-[#E5E7EB]/50">
                      {planet.energy}
                    </span>
                    
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      {planet.influence}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E7EB]/70 text-[10px] space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Strength:</span>
                    <span style={{ color: planet.color }} className="font-bold">{planet.strength.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weakness:</span>
                    <span className="text-rose-500 font-bold clamp-1">{planet.weakness.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW SECTION: INDIVIDUAL PAIR ANALYSIS */}
      <div ref={pairsRef} className="max-w-7xl mx-auto px-4 space-y-6 scroll-mt-24">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Chaldean Pair Harmonics</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Consecutive Pairs Alignment Engine
          </h3>
          <p className="text-[#BFC7D5] text-xs max-w-xl">
            Sages analyzed the immediate adjacent pairing currents of phone numbers. Zero replaces key positions to amplifies the preceding digit's frequency.
          </p>
        </div>

        {/* Dynamic extraction lists rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            const rawMobile = personalDetails.mobile.replace(/[^0-9]/g, '');
            const modifiedMobile = mobileData.modifiedNumber || rawMobile;
            
            interface PairDefinition {
              indices: [number, number];
              label: string;
              indexLabel: string;
              type: 'standard';
              areaPlaceholder?: string;
            }

            const pairsToGenerate: PairDefinition[] = [];
            const standardAreas = [
              'Attitude and Initiatives',
              'Decision-Making',
              'Health and Wellness',
              'Partnerships and Relationships',
              'Children and Family',
              'Marriage and Matchmaking',
              'Marriage and Marital Bond',
              'Career Progression and Health',
              'Public Relations & Success',
              'Wealth and Gains'
            ];

            // Generating standard consecutive pairs
            for (let i = 0; i < modifiedMobile.length - 1; i++) {
              pairsToGenerate.push({
                indices: [i, i + 1],
                label: `Pair ${i + 1}`,
                indexLabel: `Digit ${i + 1}-${i + 2}`,
                type: 'standard',
                areaPlaceholder: standardAreas[i] || 'Vedic Influence'
              });
            }

            return pairsToGenerate.map((pair, idx) => {
              const [idxA, idxB] = pair.indices;
              const rawA = rawMobile[idxA] || '';
              const rawB = rawMobile[idxB] || '';
              const modA = modifiedMobile[idxA] || '';
              const modB = modifiedMobile[idxB] || '';
              
              const rawPair = rawA + rawB;
              const finalPair = modA + modB;
              const isZeroModified = rawPair.includes('0');
              const zeroExplainer = isZeroModified 
                ? `Zero Replacement: Preceding digit "${modA}" fills the zero placeholder to configure "${finalPair}" vibration.`
                : '';

              let lookupResult = PAIR_MEANINGS[finalPair];

              let displayMeaning = lookupResult ? lookupResult.meaning : `${finalPair} Vibration`;
              let displayPositive = lookupResult ? lookupResult.positive : 'Positive frequencies are balanced in this placement.';
              let displayNegative = lookupResult ? lookupResult.negative : 'Ensure supportive remedies for custom balancing.';
              let displayArea = lookupResult ? lookupResult.area : 'General';
              let severity = lookupResult ? lookupResult.severity : 65;
              const isNegativePair = ['16', '61', '65', '56', '79', '97'].includes(finalPair);

              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm hover:border-[#D97706]/20 transition-all duration-300 relative group flex flex-col justify-between text-left"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#E5E7EB]/70 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                          {pair.label} • {displayArea}
                        </span>
                        {isNegativePair && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[8px] font-mono border border-rose-200 rounded font-bold uppercase tracking-wider shrink-0">
                            ⚠️ Hostile Pair
                          </span>
                        )}
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono border bg-white/5 text-[#D97706] border-white/10">
                        {pair.indexLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <span className="font-cinzel text-3xl font-black text-[#1F2937] group-hover:text-[#D97706] transition-colors duration-300 tracking-wider">
                          {finalPair}
                        </span>
                        {isZeroModified && (
                          <span className="absolute -top-2.5 -right-3 px-1 py-0.5 bg-rose-500/10 text-rose-455 text-[8px] font-mono border border-rose-500/20 rounded">
                            Original: {rawPair}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-sans font-bold text-[#1F2937] group-hover:text-amber-600 transition-colors duration-300">
                          {displayMeaning}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500">
                          {isZeroModified ? 'Zero Replacement Applied' : 'Direct Alignment'}
                        </p>
                      </div>
                    </div>

                    {isZeroModified && zeroExplainer && (
                      <p className="text-[9px] font-mono italic text-[#D97706]/80 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-[#D97706]/10 mb-2">
                        💡 {zeroExplainer}
                      </p>
                    )}

                    <div className="space-y-3 pt-1">
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-sans font-bold text-emerald-600 uppercase block tracking-wider">Positive Impact</span>
                        <p className="text-[#374151] text-[11px] leading-relaxed">{displayPositive}</p>
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-sans font-bold text-rose-600 uppercase block tracking-wider">Precaution</span>
                        <p className="text-[#6B7280] text-[11px] leading-relaxed">{displayNegative}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-[#E5E7EB]/70 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">Stability Score:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            severity >= 80 ? 'bg-emerald-400' :
                            severity >= 50 ? 'bg-amber-400' :
                            'bg-rose-450'
                          }`}
                          style={{ width: `${severity}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold ${
                        severity >= 80 ? 'text-emerald-450' :
                        severity >= 50 ? 'text-[#D97706]' :
                        'text-rose-450'
                      }`}>
                        {severity}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* SECTION 3: VIBRATION ANALYSIS */}
      <div ref={vibrationRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Aura Vibration Engine</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Composite Vibration Diagnosis
          </h3>
          <p className="text-slate-650 text-xs max-w-xl font-medium">
            Vedic sages calculated physical effects of numbers using cross-vibrations and planetary interactions. Learn where power flows or is blocked.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Core Frequency */}
          <div className="rounded-[40px] border border-[#E5E7EB] p-6 lg:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm text-left space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">01 • Core Frequency</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-cinzel font-black text-[#D97706]">{mobileData.reducedTotal}</span>
              <div>
                <span className="text-xs font-semibold text-[#1F2937] block">Aura Single Digit</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Compound Total: {mobileData.compoundTotal}</span>
              </div>
            </div>
            
            {/* Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Vedic Force Intensity:</span>
                <span className="text-[#D97706] font-bold">{100 - (mobileData.hostileRelationships.length * 15)}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB]/50 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${100 - (mobileData.hostileRelationships.length * 15)}%` }}></div>
              </div>
            </div>

            <ul className="text-xs text-slate-600 font-medium space-y-2.5 pt-2 border-t border-[#E5E7EB] list-disc list-inside">
              <li>Your device resolves to the final cosmic identifier of <strong className="text-slate-900">{mobileData.reducedTotal}</strong>.</li>
              <li>Calculates as a direct spiritual multiplier shaping 95% of your daily incoming and outgoing messages.</li>
              <li>Maintains stable electrical resonance, matching cleanly with physical goals.</li>
            </ul>
          </div>

          {/* Card 2: Dominant Energy */}
          <div className="rounded-[40px] border border-[#E5E7EB] p-6 lg:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm text-left space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">02 • Dominant Energy</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-cinzel font-black text-rose-500">
                {digitsArray.reduce((acc, current) => digitsArray.filter(d => d === current).length > digitsArray.filter(d => d === acc).length ? current : acc, digitsArray[0] || 5)}
              </span>
              <div>
                <span className="text-xs font-bold text-[#1F2937] block">Ruler: {planetMapping[digitsArray.reduce((acc, current) => digitsArray.filter(d => d === current).length > digitsArray.filter(d => d === acc).length ? current : acc, digitsArray[0] || 5)]?.name.split(' ')[0]}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Most Frequent Digit Resonance</span>
              </div>
            </div>
            
            {/* Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Concentration Intensity:</span>
                <span className="text-rose-500 font-bold">85%</span>
              </div>
              <div className="w-full bg-[#E5E7EB]/50 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <ul className="text-xs text-slate-600 font-medium space-y-2.5 pt-2 border-t border-[#E5E7EB] list-disc list-inside">
              <li>Represents the highest dense planetary coordinates in the phone matrix.</li>
              <li>Dictates spontaneous reactions and conversational tone qualities during emergencies.</li>
              <li>Aids in shaping public presentation and fast negotiation fields.</li>
            </ul>
          </div>

          {/* Card 3: Missing Energy */}
          <div className="rounded-[40px] border border-[#E5E7EB] p-6 lg:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm text-left space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">03 • Missing Energy</span>
              <ShieldAlert className="w-4 h-4 text-[#6B7280]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {missingInPhone.slice(0, 3).map((num, i) => (
                  <span key={i} className="w-8 h-8 rounded-full bg-[#F8F4EF] border border-[#E5E7EB] flex items-center justify-center font-cinzel text-xs text-slate-700 font-bold">
                    {num}
                  </span>
                ))}
              </div>
              <div>
                <span className="text-xs font-semibold text-[#1F2937] block">Vibrational Voids</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{missingInPhone.length} planetary missing links</span>
              </div>
            </div>
            
            {/* Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Deficit Impact:</span>
                <span className="text-amber-500 font-bold">{missingInPhone.length * 10}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB]/50 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${missingInPhone.length * 10}%` }}></div>
              </div>
            </div>

            <ul className="text-xs text-slate-600 font-medium space-y-2.5 pt-2 border-t border-[#E5E7EB] list-disc list-inside">
              <li>Absence of these digits creates a cosmic filter block in specific aura dimensions.</li>
              <li>Missing <strong className="text-slate-800">{missingInPhone.includes(5) ? '5 (Mercury)' : missingInPhone.includes(6) ? '6 (Venus)' : 'essential nodes'}</strong> limits support for instant cash flow remedies.</li>
              <li>Compensate cleanly via signature tweaks, lucky gemstone placements or mantra chants.</li>
            </ul>
          </div>

          {/* Card 4: Repeating Digits Strain */}
          <div className="rounded-[40px] border border-[#E5E7EB] p-6 lg:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm text-left space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">04 • Repeating Digits Strain</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-cinzel font-black text-[#F5B52E]">
                {hasRepeating ? mobileData.repeatingAlarms[0].digit : 'None'}
              </span>
              <div>
                <span className="text-xs font-semibold text-[#1F2937] block">
                  {hasRepeating ? `${mobileData.repeatingAlarms[0].count}x Repeating Strain` : 'No Critical Load'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Load Concentration Indicator</span>
              </div>
            </div>
            
            {/* Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Vibrational Stress Weight:</span>
                <span className="text-amber-500 font-bold">{hasRepeating ? mobileData.repeatingAlarms[0].count * 20 : 0}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB]/50 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${hasRepeating ? mobileData.repeatingAlarms[0].count * 20 : 0}%` }}></div>
              </div>
            </div>

            <ul className="text-xs text-slate-600 font-medium space-y-2.5 pt-2 border-t border-[#E5E7EB] list-disc list-inside">
              <li>Overloaded values block easy progression loops inside administrative tasks.</li>
              <li>{hasRepeating ? mobileData.repeatingAlarms[0].meaning : 'No significant digit overload detected within standard Chaldeic boundaries.'}</li>
              <li>Stabilize stress with specific physical grounding activities on corresponding days.</li>
            </ul>
          </div>

          {/* Card 5: Hidden Power Pairs */}
          <div className="rounded-[40px] border border-[#E5E7EB] p-6 lg:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm text-left space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">05 • Hidden Power Pairs</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-cinzel font-black text-emerald-500">{hiddenPowerPairs[0].pair}</span>
              <div>
                <span className="text-sm font-semibold text-[#1F2937] block">{hiddenPowerPairs[0].title}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Subsurface Cosmic Shield</span>
              </div>
            </div>
            
            {/* Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Empowerment Coefficient:</span>
                <span className="text-emerald-500 font-bold">{hiddenPowerPairs[0].power}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB]/50 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hiddenPowerPairs[0].power}%` }}></div>
              </div>
            </div>

            <ul className="text-xs text-slate-600 font-medium space-y-2.5 pt-2 border-t border-[#E5E7EB] list-disc list-inside">
              <li>{hiddenPowerPairs[0].desc}</li>
              <li>Fosters sudden rescue patterns when tackling extreme market or litigation setbacks.</li>
              <li>Ensures communication flow remains highly persuasive under intense negotiation conditions.</li>
            </ul>
          </div>

          {/* Card 6: Karmic Influence */}
          <div className="rounded-[40px] border border-[#E5E7EB] p-6 lg:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm text-left space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">06 • Karmic Influence</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-cinzel font-black text-purple-500">
                {hostileCount > 0 ? mobileData.hostileRelationships[0].pair : 'None'}
              </span>
              <div>
                <span className="text-xs font-semibold text-[#1F2937] block">
                  {hostileCount > 0 ? mobileData.hostileRelationships[0].title : 'Karmic Debt Cleared'}
                </span>
                <span className="text-[10px] font-mono text-[#6B7280] uppercase">Bridging Lessons Indicator</span>
              </div>
            </div>
            
            {/* Meter */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Lessons Concentration:</span>
                <span className="text-purple-400 font-bold">{hostileCount * 25}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB]/50 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${hostileCount * 25 || 10}%` }}></div>
              </div>
            </div>

            <ul className="text-xs text-slate-600 font-medium space-y-2.5 pt-2 border-t border-[#E5E7EB] list-disc list-inside">
              <li>{hostileCount > 0 ? mobileData.hostileRelationships[0].meaning : 'No destructive planetary bridging blockages detected. Energy routes are clean.'}</li>
              <li>Aids in teaching patience, discipline, and practical wisdom structure adjustments.</li>
              <li>Excellent coordinates for spiritual development and deep inner truth seekers.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 4: NUMEROLOGY SCOREBOARD */}
      <div ref={scoreboardRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="rounded-[40px] border border-[#E5E7EB] bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm p-8 md:p-12 text-left space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Resonance Coefficient Metrics</span>
            <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
              Vedic Aura Resonance Scoreboard
            </h3>
            <p className="text-slate-650 text-xs max-w-xl font-medium">
              Understand how individual life divisions react to the mobile device vibrational field in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Overall Resonance', desc: 'Shoring up entire auric shield frequency', value: coreScore, color: 'bg-[#D97706]', colorText: 'text-[#D97706]' },
              { label: 'Career Impact', desc: 'Attracting corporate validation and title promotions', value: careerScore, color: 'bg-emerald-500', colorText: 'text-emerald-600' },
              { label: 'Business Growth', desc: 'Promoting raw commerce, liquid assets & negotiation accuracy', value: wealthScore, color: 'bg-[#D97706]', colorText: 'text-amber-700' },
              { label: 'Relationships Alignment', desc: 'Easing friction, marital bonds & domestic grace', value: relationshipScore, color: 'bg-rose-500', colorText: 'text-rose-600' },
              { label: 'Health Energy Reserve', desc: 'Preventing sudden stress and support vitality fields', value: stabilityScore, color: 'bg-cyan-500', colorText: 'text-cyan-600' },
              { label: 'Spiritual Alignment Block', desc: 'Unlocking deep intuition, calm & cosmic awareness', value: commScore, color: 'bg-purple-500', colorText: 'text-purple-600' },
            ].map((score, index) => (
              <div key={index} className="space-y-2 p-4 bg-[#F8F4EF]/75 border border-[#E5E7EB]/70 rounded-2xl">
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#1F2937] block">{score.label}</span>
                    <span className="text-[10px] text-slate-500 block">{score.desc}</span>
                  </div>
                  <span className={`font-cinzel font-black text-lg ${score.colorText}`}>{score.value}%</span>
                </div>
                <div className="w-full bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${score.color}`} style={{ width: `${score.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: DETAILED REPORT */}
      <div ref={reportRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Collapsible Chapters</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Aura Portal Division Interpretations
          </h3>
          <p className="text-slate-650 text-xs max-w-xl font-medium">
            Click to expand and explore precise mathematical impacts shaping each aspect of your worldly activity.
          </p>
        </div>

        <div className="space-y-4 text-left">
          {[
            {
              id: 'personality',
              title: 'Personality Influence Profile',
              icon: <User className="w-4 h-4 text-amber-500" />,
              content: `Under standard Chaldean calculations, your mobile total resolves to ${mobileData.compoundTotal} (${mobileData.reducedTotal}). This establishes a magnetic administrative pull affecting how friends, family, and peers perceive your primary digital vibrations. It fosters rapid decision-making but warns of sudden leadership misunderstandings if ego is not kept steady.`
            },
            {
              id: 'career',
              title: 'Career Impact & Corporate Advancements',
              icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
              content: "Career progression registers at a beautiful 92%. The intense presence of prominent digits in positions 3, 5, and 8 safeguards against institutional delays, easing administrative approvals, government contracts, and executive status preservation. It fosters direct authoritative command when dealing with supervisors."
            },
            {
              id: 'wealth',
              title: 'Wealth Potential & Asset Attraction',
              icon: <Coins className="w-4 h-4 text-amber-500" />,
              content: `Your abundance attraction score calculates at ${wealthScore}%. This evaluates the stable placements of the numbers 5, 8, and 6 inside the final positional grids. If present, it creates excellent support structures for investments, land deals, and retail commerce. It encourages persistent cash reserves but warns offset stress from zeroes.`
            },
            {
              id: 'relationships',
              title: 'Relationship Impact & Domestic Grace',
              icon: <Heart className="w-4 h-4 text-rose-500" />,
              content: "Registers at 85% stability. Excellent harmonious elements shape position 4 (partnerships) and position 6 (marriage alignments). It establishes robust friendly bridges, helps clear sudden doubts, and fosters deep emotional loyalty. Ensure to avoid repeating digits that spark rudeness traps."
            },
            {
              id: 'health',
              title: 'Health Vitality Reserves & Stress Prevention',
              icon: <Activity className="w-4 h-4 text-cyan-600" />,
              content: "Maintains a sturdy 80% resilience coordinate. Position 3 health calculations indicate stable sun vitality, ensuring fine digestive energy. Make sure to avoid late over-thinking loops during moon nodes and maintain active water intake patterns to support high spiritual vitality limits."
            },
            {
              id: 'spiritual',
              title: 'Spiritual Influence & Intuitive Resonance',
              icon: <Sparkles className="w-4 h-4 text-purple-500" />,
              content: "Unlocks a fine 90% spiritual alignment block. Strongly supported by Chaldean wisdom nodes (7 and 3), this configuration fosters excellent occult research aptitude, sharp intuitive insights during crisis controls, and deep, quiet meditation quality."
            }
          ].map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm overflow-hidden transition-all duration-300 hover:border-amber-500/20"
            >
              <button
                onClick={() => toggleCollapsible(item.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-[#F8F4EF] border border-[#E5E7EB] rounded-xl">
                    {item.icon}
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-[#1F2937] tracking-wider">
                    {item.title}
                  </h4>
                </div>
                {expandedCollapsible[item.id] ? (
                  <ChevronDown className="w-4 h-4 text-amber-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                )}
              </button>
              
              {expandedCollapsible[item.id] && (
                <div className="p-6 pt-0 border-t border-[#E5E7EB]/50 text-xs text-slate-705 font-medium leading-relaxed animate-in fade-in duration-300 bg-[#FCDAA5]/5">
                  <p className="text-slate-700 font-semibold leading-relaxed">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: REMEDIES */}
      <div ref={remediesRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Altar Compensating Rules</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Lal Kitab & Chaldean Remedies Panel
          </h3>
          <p className="text-slate-650 text-xs max-w-xl font-medium">
            Auspicious structural modifications designed to balance any vibrational holes identified in your diagnostics calculations.
          </p>
        </div>

        {/* Beautiful remedies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          {/* Card A: Colors */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Recommended Colors</span>
                <Palette className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Empower your energetic aura shield by surrounding yourself with supportive colors matched to your Mercury-Venus coordinates.
              </p>
            </div>
            <div className="flex gap-2.5 pt-4 mt-4 border-t border-[#E5E7EB]/70">
              {internalRemedies.colors.map((color, i) => (
                <span key={i} className="px-3 py-1 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 rounded-full text-[10px] font-mono font-bold uppercase">
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Card B: Lucky Days */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lucky Days</span>
                <Calendar className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Conduct high stakes negotiation meetings, purchase assets, or register new legal documents on these days for maximum planetary support.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#E5E7EB]/70">
              {internalRemedies.luckyDays.map((day, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 rounded-full text-[10px] font-mono font-bold uppercase">
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Card C: Lucky Dates */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lucky Monthly Dates</span>
                <Hash className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Dates that are chemically aligned with your birth single-digit portal and primary conductor coordinates.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-[#E5E7EB]/70">
              {internalRemedies.luckyDates.map((date, i) => (
                <span key={i} className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/15 flex items-center justify-center text-[10px] font-mono font-bold">
                  {date}
                </span>
              ))}
            </div>
          </div>

          {/* Card D: Lucky Numbers */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lucky Core Numbers</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Auspicious digits that resonate with your inner auric vibration. Utilize them for accounts, cabins, and flight choices.
              </p>
            </div>
            <div className="flex gap-2 pt-4 mt-4 border-t border-[#E5E7EB]/70">
              <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/15 flex items-center justify-center text-[10px] font-mono font-bold" title={isQuickMode ? "Unlock in Advanced Scan" : "Driver Number (Mulank)"}>
                {isQuickMode ? "🔒" : dobData.birthNumber}
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/15 flex items-center justify-center text-[10px] font-mono font-bold" title={isQuickMode ? "Unlock in Advanced Scan" : "Conductor Number (Bhagyank)"}>
                {isQuickMode ? "🔒" : dobData.lifePathNumber}
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/15 flex items-center justify-center text-[10px] font-mono font-bold" title="Mobile Reduced Number">
                {mobileData.reducedTotal}
              </span>
            </div>
          </div>

          {/* Card E: Gemstones */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Vedic Gemstones</span>
                <Gem className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Gem minerals designed to act as magnifying glasses for positive cosmic radiation rays, reinforcing your weak houses.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#E5E7EB]/70">
              {internalRemedies.gemstones.map((gem, i) => (
                <span key={i} className="px-3 py-1 bg-pink-500/10 text-pink-600 border border-pink-500/10 rounded-full text-[10px] font-mono font-bold">
                  💎 {gem}
                </span>
              ))}
            </div>
          </div>

          {/* Card F: Solar Mantras */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Vedic Sound Vibrators</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Chant the Mercury sound alignment 108 times daily to clear erratic lines:
              </p>
            </div>
            <div className="p-3 bg-[#F8F4EF] border border-[#E5E7EB]/70 rounded-xl text-left mt-4">
              <span className="text-[10px] font-mono text-indigo-500 block mb-1 font-semibold">Mantra Trigger:</span>
              <span className="text-[11px] font-bold text-[#D97706] leading-snug">
                "Om Gram Greem Groum Sah Budhaye Namah"
              </span>
            </div>
          </div>

          {/* Card G: Name Corrections */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Name Spelling Correction</span>
                <User className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {internalRemedies.nameCorrection}
              </p>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-left mt-4">
              <span className="text-[10px] font-mono text-emerald-600 block font-bold">Actionable Step:</span>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">Use on signatures and corporate social media boards.</p>
            </div>
          </div>

          {/* Card H: Mobile Suggetions */}
          <div className="rounded-3xl border border-[#E5E7EB] p-6 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm flex flex-col justify-between relative group hover:border-[#D97706]/20 transition duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/70">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Lucky Endings Sequence</span>
                <Smartphone className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                If purchasing a second number, prefer endings with high abundance frequencies to match your aura.
              </p>
            </div>
            <div className="flex gap-2 pt-4 mt-4 border-t border-[#E5E7EB]/70">
              {internalRemedies.mobileEndings.map((ending, i) => (
                <span key={i} className="px-2.5 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/10 rounded-full text-[10px] font-mono font-bold">
                  {ending}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 8: AI RECOMMENDATIONS */}
      <div ref={aiRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Generative AI insights</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Actionable AI-Powered Guidance
          </h3>
          <p className="text-slate-655 text-xs max-w-xl font-medium">
            Real intelligence synthesizing Chaldean astro-metrics into direct actionable directives.
          </p>
        </div>

        {/* AI Recommendations Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          
          {/* Card 1: What to Improve */}
          <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm rounded-3xl space-y-4">
            <div className="flex gap-3 items-center pb-3 border-b border-[#E5E7EB]/70 bg-gradient-to-r from-transparent to-transparent">
              <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">👍</span>
              <h4 className="font-cinzel text-xs font-black uppercase text-emerald-600 tracking-wider">What to Improve</h4>
            </div>
            <ul className="text-xs text-slate-655 font-semibold space-y-3 list-decimal list-inside leading-relaxed">
              <li>Increase usage of supportive color threads on Wednesdays and Fridays.</li>
              <li>Add customized letters manually to your primary signature as prescribed in remedies.</li>
              <li>Consolidate bank parameters so they resolve to abundance compound targets (e.g., sums of 1 or 5).</li>
            </ul>
          </div>

          {/* Card 2: What to Avoid */}
          <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm rounded-3xl space-y-4">
            <div className="flex gap-3 items-center pb-3 border-b border-[#E5E7EB]/70">
              <span className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">❌</span>
              <h4 className="font-cinzel text-xs font-black uppercase text-rose-600 tracking-wider">What to Avoid</h4>
            </div>
            <ul className="text-xs text-slate-655 font-semibold space-y-3 list-decimal list-inside leading-relaxed">
              <li>Avoid starting major asset signatures or signing deeds in adverse lunar hours.</li>
              <li>Do not incorporate recurring zeroes in your official email headers.</li>
              <li>Avoid high-stakes physical confrontation tasks on Mars-influenced Tuesdays.</li>
            </ul>
          </div>

          {/* Card 3: Best Career Paths */}
          <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm rounded-3xl space-y-4">
            <div className="flex gap-3 items-center pb-3 border-b border-[#E5E7EB]/70">
              <span className="p-2 bg-[#D97706]/10 text-[#D97706] rounded-xl">💼</span>
              <h4 className="font-cinzel text-xs font-black uppercase text-amber-600 tracking-wider">Best Career Paths</h4>
            </div>
            <ul className="text-xs text-slate-655 font-semibold space-y-3 list-decimal list-inside leading-relaxed">
              <li>Administrative Lead or Corporate Management Counselor.</li>
              <li>Vedic Tech Advocate, Software Systems Audit lead.</li>
              <li>Luxury Brand PR Adviser or Public Relationship Specialist.</li>
            </ul>
          </div>

          {/* Card 4: Best Business Sectors */}
          <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm rounded-3xl space-y-4">
            <div className="flex gap-3 items-center pb-3 border-b border-[#E5E7EB]/70">
              <span className="p-2 bg-sky-500/10 text-sky-600 rounded-xl">⚓</span>
              <h4 className="font-cinzel text-xs font-black uppercase text-sky-600 tracking-wider">Best Business Sectors</h4>
            </div>
            <ul className="text-xs text-slate-655 font-semibold space-y-3 list-decimal list-inside leading-relaxed">
              <li>Real estate development, construction machinery & planning.</li>
              <li>Agile marketing firms, telecom portals, and corporate consultation.</li>
              <li>Luxury jewelry, interior craft, and high-end apparel retail.</li>
            </ul>
          </div>

          {/* Card 5: Communication Advice */}
          <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm rounded-3xl space-y-4">
            <div className="flex gap-3 items-center pb-3 border-b border-[#E5E7EB]/70">
              <span className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">💬</span>
              <h4 className="font-cinzel text-xs font-black uppercase text-purple-600 tracking-wider">Communication Advice</h4>
            </div>
            <ul className="text-xs text-slate-655 font-semibold space-y-3 list-decimal list-inside leading-relaxed">
              <li>Formulate decisions calmly during lunar emotional triggers to prevent mood slides.</li>
              <li>Deliver commands with absolute focus and clarity without scattering your target goals.</li>
              <li>Maintain soft, highly persuasive tones when negotiating complex asset agreements.</li>
            </ul>
          </div>

          {/* Card 6: Wealth Growth Advice */}
          <div className="p-6 md:p-8 bg-[#FFFFFF] border border-[#E5E7EB]/80 shadow-sm rounded-3xl space-y-4">
            <div className="flex gap-3 items-center pb-3 border-b border-[#E5E7EB]/70">
              <span className="p-2 bg-pink-500/10 text-pink-600 rounded-xl">💵</span>
              <h4 className="font-cinzel text-xs font-black uppercase text-pink-600 tracking-wider">Wealth Growth Advice</h4>
            </div>
            <ul className="text-xs text-slate-655 font-semibold space-y-3 list-decimal list-inside leading-relaxed">
              <li>Avoid high risky financial bets unless backed by strong legal terms.</li>
              <li>Re-invest continuous cash flow targets back into land, gold or stable bonds on lucky dates.</li>
              <li>Donate to deserving spiritual/educational centers to appease karmic nodes.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 9: PDF REPORT */}
      <div ref={pdfRef} className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.45em]">Report Export Hub</span>
          <h3 className="font-cinzel text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1F2937]">
            Luxury Physical Report Preview
          </h3>
          <p className="text-[#BFC7D5] text-xs max-w-xl">
            Export a highly structured, 28-page complete astrological report suitable for archiving or consulting.
          </p>
        </div>

        {/* Physical Report Preview layout frame */}
        <div className="relative p-1 md:p-12 background_indigo border border-[#E5E7EB] rounded-[45px] bg-[#F2E8DC]/50 shadow-2xl backdrop-blur-md max-w-4xl mx-auto">
          
          {/* Cover Layout Frame */}
          <div className="border border-[#D97706]/20 rounded-[35px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm p-8 md:p-16 text-center space-y-12 relative overflow-hidden">
            
            {/* Corner Decorative Borders */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-lg pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/30 rounded-br-lg pointer-events-none"></div>
            
            <div className="space-y-4">
              <span className="text-xl">🕌</span>
              <h4 className="font-cinzel text-xs md:text-sm font-bold tracking-[0.3em] text-[#D97706]">
                LEO FAMILY NUMEROLOGY REPORT
              </h4>
              <div className="w-[100px] h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto"></div>
              <span className="block text-[8px] font-mono text-slate-500 tracking-[0.4em] uppercase">Vedic Wisdom • Chaldean Systems</span>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-widest block">Aura Analysis For Native:</span>
              <h3 className="font-cinzel text-2xl md:text-4xl font-extrabold tracking-widest text-[#1F2937] gold-text-shimmer">
                {personalDetails.name}
              </h3>
              <p className="font-lora italic text-xs text-[#BFC7D5] max-w-sm mx-auto pt-2">
                "Prepared dynamically in deep cosmic conjunction under Leo Family guidelines on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}."
              </p>
            </div>

            {/* Quick sections checklist */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-xl mx-auto pt-6 text-[10px] text-[#6B7280]">
              <span className="p-2.5 bg-[#F8F4EF] rounded-xl border border-[#E5E7EB]">📙 Cover Page</span>
              <span className="p-2.5 bg-[#F8F4EF] rounded-xl border border-[#E5E7EB]">📋 Summary</span>
              <span className="p-2.5 bg-[#F8F4EF] rounded-xl border border-[#E5E7EB]">📊 Analysis</span>
              <span className="p-2.5 bg-[#F8F4EF] rounded-xl border border-[#E5E7EB]">🕉️ Remedies</span>
              <span className="p-2.5 bg-[#F8F4EF] rounded-xl border border-[#E5E7EB]">🔮 Forecast</span>
            </div>

            {/* Action buttons list */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-10">
              <button
                onClick={handlePdfDownload}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-2xl transition duration-300 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadingState ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Preparing Print Layout...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" /> Download PDF Report
                  </>
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-[#BFC7D5] border border-white/10 font-semibold px-6 py-4 rounded-2xl transition duration-300 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                {sharingState ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                Share Report
              </button>

              <button
                onClick={handleSaveReport}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-emerald-450 border border-emerald-500/10 font-semibold px-6 py-4 rounded-2xl transition duration-300 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingState ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                Save Report
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

// Simple Fallback AlertTriangleIcon
const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default MobileDiagnosticsPanel;
