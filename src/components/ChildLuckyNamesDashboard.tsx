import React, { useState, useEffect } from 'react';
import {
  Baby,
  Sparkles,
  Heart,
  Award,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Calendar,
  User,
  Hash,
  Download,
  Printer,
  ChevronRight,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  BookOpen,
  Search,
  Filter,
  Sliders,
  ShieldAlert,
  Compass,
  Star,
  Activity,
  Lightbulb,
  FileText
} from 'lucide-react';
import {
  analyzeChildLuckyNamesPro,
  ChildLuckyNamesReport,
  ChildProfileInput,
  CandidateNameAnalysis,
  WisdomLetterInfo,
  CURATED_BABY_NAMES_LIBRARY,
  BabyNameDictionaryItem
} from '../core/childNumerologyEngine';
import DateInput from './DateInput';
import { formatDateForDisplay, parseIndianDate } from '../utils/dateUtils';
import { useLanguage } from '../i18n';
import { getProfileIsolationKey } from '../core';

interface ChildLuckyNamesDashboardProps {
  initialDob?: string;
  initialName?: string;
  initialGender?: 'MALE' | 'FEMALE' | 'OTHER';
  onSyncToMasterReport?: (report: ChildLuckyNamesReport) => void;
}

export const ChildLuckyNamesDashboard: React.FC<ChildLuckyNamesDashboardProps> = ({
  initialDob = '2024-05-15',
  initialName = 'Aarav',
  initialGender = 'BOY' as any,
  onSyncToMasterReport
}) => {
  const { t, language } = useLanguage();
  const [dob, setDob] = useState<string>(initialDob || '2024-05-15');
  const [childName, setChildName] = useState<string>(initialName || 'Aarav');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>((initialGender as any) || 'BOY');
  const [candidateNames, setCandidateNames] = useState<string[]>(['Aarav', 'Advik', 'Ananya']);
  const [newCandidateInput, setNewCandidateInput] = useState<string>('');
  const [preferredLetter, setPreferredLetter] = useState<string>('ALL');

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LETTERS' | 'ANALYSIS' | 'COMPARISON' | 'GENERATOR' | 'REPORT'>('OVERVIEW');
  const [selectedCandidateIdx, setSelectedCandidateIdx] = useState<number>(0);
  
  // Name Generator state
  const [genLetterFilter, setGenLetterFilter] = useState<string>('ALL');
  const [genGenderFilter, setGenGenderFilter] = useState<string>('ALL');
  const [genGoalFilter, setGenGoalFilter] = useState<string>('ALL');
  const [genRootFilter, setGenRootFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Report state
  const [report, setReport] = useState<ChildLuckyNamesReport | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Perform initial calculation on mount
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = () => {
    setIsCalculating(true);
    try {
      const input: ChildProfileInput = {
        childName,
        dob,
        gender,
        parentPreferredLetter: preferredLetter !== 'ALL' ? preferredLetter : undefined,
        candidateNames: candidateNames.filter(n => n.trim().length > 0)
      };

      const result = analyzeChildLuckyNamesPro(input);
      setReport(result);

      // Save to localStorage with profile isolation
      try {
        const profileKey = getProfileIsolationKey({ name: childName, dob, gender });
        const payload = JSON.stringify({
          report: result,
          updatedAt: new Date().toISOString()
        });
        localStorage.setItem(`leofamily_child_lucky_names_report_${profileKey}`, payload);
        localStorage.setItem('leofamily_child_lucky_names_report', payload);
      } catch (err) {
        console.error('Failed to cache child lucky names report:', err);
      }

      if (onSyncToMasterReport) {
        onSyncToMasterReport(result);
      }
    } catch (err) {
      console.error('Child lucky names calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAddCandidate = () => {
    if (!newCandidateInput.trim()) return;
    const nameToAdd = newCandidateInput.trim();
    if (!candidateNames.includes(nameToAdd)) {
      const updated = [...candidateNames, nameToAdd];
      setCandidateNames(updated);
      setNewCandidateInput('');
      // Trigger recalculation with new candidate
      const input: ChildProfileInput = {
        childName,
        dob,
        gender,
        candidateNames: updated
      };
      const result = analyzeChildLuckyNamesPro(input);
      setReport(result);
      if (onSyncToMasterReport) onSyncToMasterReport(result);
    }
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidateNames.length <= 1) return;
    const updated = candidateNames.filter((_, i) => i !== index);
    setCandidateNames(updated);
    if (selectedCandidateIdx >= updated.length) {
      setSelectedCandidateIdx(0);
    }
    const input: ChildProfileInput = {
      childName,
      dob,
      gender,
      candidateNames: updated
    };
    const result = analyzeChildLuckyNamesPro(input);
    setReport(result);
    if (onSyncToMasterReport) onSyncToMasterReport(result);
  };

  const handleAddFromLibrary = (name: string) => {
    if (!candidateNames.includes(name)) {
      const updated = [...candidateNames, name];
      setCandidateNames(updated);
      const input: ChildProfileInput = {
        childName,
        dob,
        gender,
        candidateNames: updated
      };
      const result = analyzeChildLuckyNamesPro(input);
      setReport(result);
      if (onSyncToMasterReport) onSyncToMasterReport(result);
      setActiveTab('ANALYSIS');
      setSelectedCandidateIdx(updated.length - 1);
    }
  };

  // Filter Generator Library
  const filteredLibrary = CURATED_BABY_NAMES_LIBRARY.filter(item => {
    if (genLetterFilter !== 'ALL' && item.startingLetter !== genLetterFilter) return false;
    if (genGenderFilter !== 'ALL' && item.gender !== genGenderFilter && item.gender !== 'UNISEX') return false;
    if (genGoalFilter !== 'ALL' && item.focusGoal !== genGoalFilter) return false;
    if (genRootFilter !== 'ALL' && item.chaldeanRoot !== parseInt(genRootFilter, 10)) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="child-lucky-names-pro-root">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2D4A9E] to-[#1E3A8A] text-white rounded-[32px] p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border border-amber-300/30">
              <Baby className="w-3.5 h-3.5" /> LeoFamily Phase 11 • Child Lucky Names Pro
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">
              शुभ शिशु नामाक्षर एवं वैदिक नाम चयन प्रो
            </h2>
            <p className="text-xs text-blue-100/90 font-sans max-w-2xl leading-relaxed">
              वैदिक न्यूमेरोलॉजी, चालडियन कम्पाउंड एवं लो शू ग्रिड पर आधारित अभिभावक-हितैषी शुभ नामाक्षर, नाम विश्लेषण और बहु-नाम तुलनात्मक परामर्श प्रणाली।
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Dossier
            </button>
          </div>
        </div>
      </div>

      {/* INPUT CONTROLS PANEL */}
      <div className="bg-white border border-[#F2E8DC] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-playfair text-base font-bold text-[#1E3A8A] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D97706]" /> 1. शिशु विवरण एवं जन्मतिथि प्रविष्टि (Child Coordinates)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Vedic Coordinates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Child Name / Primary Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">शिशु का नाम (या प्रस्तावित नाम)</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Aarav"
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            />
          </div>

          {/* DOB Input */}
          <div className="space-y-1">
            <DateInput
              id="child-dob-input"
              label="जन्मतिथि (Date of Birth)"
              value={dob}
              outputFormat="iso"
              onChange={(val) => setDob(val)}
              className="py-2 px-3 text-xs bg-[#FDFCF7] rounded-xl"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">लिंग (Gender)</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="BOY">बालक (Boy)</option>
              <option value="GIRL">बालिका (Girl)</option>
              <option value="OTHER">अन्य / अनिर्दिष्ट (Unisex/Other)</option>
            </select>
          </div>

          {/* Preferred Letter Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">इच्छित प्रारंभिक अक्षर (Optional)</label>
            <select
              value={preferredLetter}
              onChange={(e) => setPreferredLetter(e.target.value)}
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="ALL">सभी अक्षर (All A to Z)</option>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
                <option key={l} value={l}>अक्षर '{l}'</option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidate Names Management */}
        <div className="pt-2 border-t space-y-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
            तुलना हेतु उम्मीदवार नाम सूची (Candidate Names for Comparison):
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {candidateNames.map((cName, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-[#1E3A8A]/10 text-[#1E3A8A] px-3 py-1 rounded-full text-xs font-bold border border-[#1E3A8A]/20"
              >
                {cName}
                {candidateNames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(idx)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newCandidateInput}
                onChange={(e) => setNewCandidateInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCandidate(); } }}
                placeholder="+ नया नाम जोड़ें"
                className="bg-[#FDFCF7] border border-dashed border-[#1E3A8A]/40 py-1 px-3 rounded-full text-xs font-sans focus:outline-none w-32 focus:w-44 transition-all"
              />
              <button
                type="button"
                onClick={handleAddCandidate}
                className="bg-[#1E3A8A] text-white p-1 rounded-full hover:bg-[#1E3A8A]/90 transition-all cursor-pointer"
                title="Add Name"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={runAnalysis}
              disabled={isCalculating}
              className="ml-auto bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isCalculating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              विश्लेषण प्रारंभ करें (Analyze)
            </button>
          </div>
        </div>
      </div>

      {/* MODULE NAVIGATION TABS */}
      {report && (
        <div className="flex overflow-x-auto gap-2 border-b border-[#F2E8DC] pb-2 no-scrollbar">
          {[
            { id: 'OVERVIEW', label: '1. मुख्य ग्रिड व मूलांक (Overview)', icon: Layers },
            { id: 'LETTERS', label: '2. शुभ नामाक्षर (Wisdom Letters)', icon: Star },
            { id: 'ANALYSIS', label: '3. विस्तृत नाम विश्लेषण (Deep Audit)', icon: BookOpen },
            { id: 'COMPARISON', label: '4. बहु-नाम तुलना (Multi-Compare)', icon: Sliders },
            { id: 'GENERATOR', label: '5. शुभ नाम खोजक (Name Library)', icon: Search },
            { id: 'REPORT', label: '6. संपूर्ण 16-सूत्रीय रिपोर्ट (Full Dossier)', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-white border border-[#E5E7EB] text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 1: OVERVIEW & CORE PROFILE */}
      {report && activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* CORE VEDIC METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Mulank */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider">मूलांक (Driver / Root)</span>
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="my-2">
                <div className="text-3xl font-playfair font-black text-indigo-900">{report.childInfo.mulank}</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{report.childInfo.mulankGrahaHi}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                शिशु के मूल स्वभाव, प्रतिभा व तात्कालिक प्रतिक्रिया की मुख्य ऊर्जा।
              </p>
            </div>

            {/* Bhagyank */}
            <div className="bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider">भाग्यांक (Conductor / Destiny)</span>
                <Award className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="my-2">
                <div className="text-3xl font-playfair font-black text-amber-900">{report.childInfo.bhagyank}</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{report.childInfo.bhagyankGrahaHi}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                जीवन का दीर्घकालिक मार्ग, भाग्य व जीवन उद्देश्य का सूचक।
              </p>
            </div>

            {/* Inherent Strengths */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">सक्रिय ग्रिड अंक (Active Digits)</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="my-2 flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => report.gridData.birthGrid[n] > 0).map(n => (
                  <span key={n} className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded text-xs">
                    {n} {report.gridData.birthGrid[n] > 1 && `(x${report.gridData.birthGrid[n]})`}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                जन्म ग्रिड में स्वाभाविक रूप से उपस्थित ऊर्जा तरंगें।
              </p>
            </div>

            {/* Missing Numbers */}
            <div className="bg-gradient-to-br from-rose-50/70 to-white border border-rose-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-rose-700 font-bold uppercase tracking-wider">अनुपस्थित अंक (Missing Digits)</span>
                <Info className="w-4 h-4 text-rose-500" />
              </div>
              <div className="my-2 flex flex-wrap gap-1.5">
                {report.gridData.missingNumbers.length > 0 ? (
                  report.gridData.missingNumbers.map(n => (
                    <span key={n} className="bg-rose-100 text-rose-800 font-mono font-bold px-2 py-0.5 rounded text-xs">
                      {n}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-bold">पूर्ण संतुलित ग्रिड (All Present)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                जिनकी ऊर्जा को अनुकूल नाम अक्षरों (Name Overlay) से संतुलित किया जा सकता है।
              </p>
            </div>
          </div>

          {/* LO SHU GRID + ENHANCED GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Birth Lo Shu Grid */}
            <div className="bg-white border rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1E3A8A]" /> शिशु जन्म लो शू ग्रिड (Birth Lo Shu Grid)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">3x3 Traditional Vedic Matrix</span>
              </div>

              {/* 3x3 Visual Matrix */}
              <div className="grid grid-cols-3 gap-2 aspect-square max-w-[280px] mx-auto p-3 bg-slate-50 rounded-2xl border">
                {[
                  [4, 9, 2],
                  [3, 5, 7],
                  [8, 1, 6]
                ].flat().map((num) => {
                  const count = report.gridData.birthGrid[num] || 0;
                  const isPresent = count > 0;
                  return (
                    <div
                      key={num}
                      className={`flex flex-col items-center justify-center rounded-xl border transition-all ${
                        isPresent
                          ? 'bg-indigo-50/80 border-[#1E3A8A]/30 text-[#1E3A8A]'
                          : 'bg-white/60 border-slate-200 text-slate-300'
                      }`}
                    >
                      <span className="text-base font-bold font-mono">{num}</span>
                      {isPresent && (
                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded-full mt-0.5">
                          {Array(count).fill(num).join('')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 text-center font-sans">
                शिशु की जन्मतिथि: <strong className="text-slate-800">{report.childInfo.standardDob}</strong>
              </p>
            </div>

            {/* Key Planes & Inherent Potentials */}
            <div className="bg-white border rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#D97706]" /> प्रमुख जीवन तल एवं क्षमताएं (Key Planes)
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Mental, Emotional, Practical</span>
              </div>

              <div className="space-y-3">
                {report.gridData.planes.slice(0, 4).map((plane, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{plane.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        plane.status === 'Complete' || plane.status === 'FULL' || plane.status === 'COMPLETE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : plane.status === 'Partial' || plane.status === 'PARTIAL'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {plane.status} ({plane.completionPercentage}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{plane.meaning || plane.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WISDOM STARTING LETTERS */}
      {report && activeTab === 'LETTERS' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border rounded-3xl p-6 space-y-4">
            <div className="border-b pb-4">
              <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Wisdom Starting Alphabets Layer
              </span>
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A] mt-2">
                शिशु के लिए शुभ प्रारंभिक नामाक्षर (Wisdom Starting Letters)
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                मूलांक {report.childInfo.mulank} एवं भाग्यांक {report.childInfo.bhagyank} की मित्र ग्रहीय ऊर्जा तथा जन्म ग्रिड की पूरक आवश्यकताओं के आधार पर वर्गीकृत नामाक्षर।
              </p>
            </div>

            {/* THREE CATEGORIES BREAKDOWN */}
            <div className="space-y-6">
              {/* Highly Supportive Letters */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> अत्यंत अनुकूल नामाक्षर (Highly Supportive Alphabets)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {report.wisdomLetters.highlySupportive.map((item) => (
                    <div
                      key={item.letter}
                      className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-2 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-playfair font-black text-lg flex items-center justify-center shadow-sm">
                          {item.letter}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-bold">
                            Chaldean {item.chaldeanValue}
                          </span>
                          <div className="text-[10px] text-emerald-900 font-bold mt-0.5">{item.planetHi}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-700 font-sans leading-relaxed">{item.whyConsiderHi}</p>
                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{item.elementHi}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setGenLetterFilter(item.letter);
                            setActiveTab('GENERATOR');
                          }}
                          className="text-[10px] font-bold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          नाम खोजें <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supportive / Neutral Letters */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" /> संतुलित / मध्यम अनुकूल नामाक्षर (Supportive / Neutral Alphabets)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {report.wisdomLetters.supportiveNeutral.map((item) => (
                    <div
                      key={item.letter}
                      className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-indigo-700 text-white font-playfair font-black text-base flex items-center justify-center">
                          {item.letter}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border text-indigo-800 font-bold">
                            Chaldean {item.chaldeanValue}
                          </span>
                          <div className="text-[10px] text-indigo-900 font-bold mt-0.5">{item.planetHi}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{item.whyConsiderHi}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cautionary Letters */}
              {report.wisdomLetters.cautionary.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> विशेष ध्यान देने योग्य नामाक्षर (Cautionary Alphabets)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {report.wisdomLetters.cautionary.map((item) => (
                      <div
                        key={item.letter}
                        className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-xl bg-amber-700 text-white font-playfair font-black text-base flex items-center justify-center">
                            {item.letter}
                          </span>
                          <div className="text-right">
                            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-bold">
                              Chaldean {item.chaldeanValue}
                            </span>
                            <div className="text-[10px] text-amber-900 font-bold mt-0.5">{item.planetHi}</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{item.whyConsiderHi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATE NAMES DEEP AUDIT */}
      {report && activeTab === 'ANALYSIS' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Candidate Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white border p-3 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-2">विश्लेषण हेतु नाम चुनें:</span>
            {report.candidateAnalyses.map((ana, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCandidateIdx(idx)}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCandidateIdx === idx
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {ana.name} (Compound {ana.chaldeanCompound} → {ana.chaldeanRoot})
              </button>
            ))}
          </div>

          {/* Detailed Dossier for Selected Candidate */}
          {report.candidateAnalyses[selectedCandidateIdx] && (() => {
            const candidate = report.candidateAnalyses[selectedCandidateIdx];
            return (
              <div className="bg-white border rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        candidate.dobCompatibility.status === 'SUPPORTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : candidate.dobCompatibility.status === 'NEEDS_ATTENTION'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {candidate.dobCompatibility.statusHi}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-full">
                        Harmonization Score: {candidate.dobCompatibility.score}/100
                      </span>
                    </div>
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#1E3A8A] mt-2">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      Chaldean Compound <strong className="text-slate-800">{candidate.chaldeanCompound}</strong> ({candidate.compoundData.title}) • Root Vibration <strong className="text-slate-800">{candidate.chaldeanRoot}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Chaldean Total</span>
                    <div className="font-playfair text-3xl font-black text-[#1E3A8A] mt-0.5">{candidate.chaldeanCompound}</div>
                    <span className="text-[10px] text-amber-700 font-bold font-mono">मूलांक {candidate.chaldeanRoot}</span>
                  </div>
                </div>

                {/* LETTER BY LETTER BREAKDOWN */}
                <div className="space-y-3">
                  <h4 className="font-playfair text-base font-bold text-slate-800 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#1E3A8A]" /> अक्षर-वार संख्या एवं ग्रहीय तालमेल (Letter Breakdown)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.letterBreakdown.map((item, i) => (
                      <div key={i} className="bg-slate-50 border rounded-xl p-2.5 text-center min-w-[56px]">
                        <span className="text-base font-playfair font-black text-slate-800 block">{item.letter}</span>
                        <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-white px-2 py-0.5 rounded border block mt-1">
                          {item.value}
                        </span>
                        <span className="text-[9px] text-slate-500 block mt-1 truncate">{item.planet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FIRST LETTER, VOWELS, CONSONANTS TRIO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Letter */}
                  <div className="bg-slate-50 border rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider block">
                      प्रथम अक्षर कम्पन (First Letter)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white font-playfair font-bold flex items-center justify-center">
                        {candidate.firstLetter.letter}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-800">{candidate.firstLetter.soundVibration}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{candidate.firstLetter.influenceHi}</p>
                  </div>

                  {/* Vowels / Soul Urge */}
                  <div className="bg-slate-50 border rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-rose-700 font-bold uppercase tracking-wider block">
                      स्वर (Vowels / Soul Urge)
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        [{candidate.vowels.letters.join(', ')}] = {candidate.vowels.chaldeanCompound} ({candidate.vowels.chaldeanRoot})
                      </span>
                      <Heart className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{candidate.vowels.soulUrgeMeaningHi}</p>
                  </div>

                  {/* Consonants / Outer Personality */}
                  <div className="bg-slate-50 border rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">
                      व्यंजन (Consonants / Personality)
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        [{candidate.consonants.letters.join(', ')}] = {candidate.consonants.chaldeanCompound} ({candidate.consonants.chaldeanRoot})
                      </span>
                      <User className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{candidate.consonants.personalityImpressionHi}</p>
                  </div>
                </div>

                {/* DOB COMPATIBILITY & NAME OVERLAY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DOB Compatibility Explanation */}
                  <div className="bg-white border rounded-2xl p-5 space-y-3">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> जन्मतिथि सामंजस्य (DOB Compatibility)
                    </h5>
                    <div className="space-y-2 text-xs text-slate-700 font-sans leading-relaxed">
                      <p><strong>मूलांक प्रभाव:</strong> {candidate.dobCompatibility.mulankHarmonyHi}</p>
                      <p><strong>भाग्यांक प्रभाव:</strong> {candidate.dobCompatibility.bhagyankHarmonyHi}</p>
                      <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border mt-2">
                        {candidate.dobCompatibility.whyExplanationHi}
                      </div>
                    </div>
                  </div>

                  {/* Missing Number Overlay Support */}
                  <div className="bg-white border rounded-2xl p-5 space-y-3">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-500" /> अनुपस्थित अंकों का नाम सहयोग (Name Overlay)
                    </h5>
                    <div className="space-y-2 text-xs text-slate-700 font-sans leading-relaxed">
                      <p>{candidate.missingNumberSupport.effectiveSupportHi}</p>
                      <p className="text-[11px] text-slate-500 italic mt-2">
                        {candidate.missingNumberSupport.nameOverlayNotesHi}
                      </p>
                      {candidate.repeatedNumberCheck.hasHighRepetition && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 mt-2">
                          {candidate.repeatedNumberCheck.cautionAdviceHi}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DEVELOPMENT & CAREER/TALENT THEMES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Development & Learning */}
                  <div className="p-5 bg-slate-50 border rounded-2xl space-y-3 text-xs">
                    <h5 className="font-playfair text-sm font-bold text-slate-800">व्यक्तित्व एवं अधिगम विकास (Child Development)</h5>
                    <div className="space-y-1.5 text-slate-700 font-sans">
                      <p><strong>अध्ययन शैली:</strong> {candidate.developmentThemes.learningStyleHi}</p>
                      <p><strong>संवाद शैली:</strong> {candidate.developmentThemes.communicationStyleHi}</p>
                      <p><strong>आत्मबल व अनुशासन:</strong> {candidate.developmentThemes.confidenceAndDisciplineHi}</p>
                      <p><strong>रचनात्मक अभिव्यक्ति:</strong> {candidate.developmentThemes.creativityAndExpressionHi}</p>
                      <p><strong>सामाजिक व्यवहार:</strong> {candidate.developmentThemes.socialBehaviourHi}</p>
                    </div>
                  </div>

                  {/* Talent & Career */}
                  <div className="p-5 bg-slate-50 border rounded-2xl space-y-3 text-xs">
                    <h5 className="font-playfair text-sm font-bold text-slate-800">प्रतिभा व भविष्य के क्षेत्र (Talent & Potential)</h5>
                    <div className="space-y-2 text-slate-700 font-sans">
                      <p><strong>स्वाभाविक प्रतिभा:</strong> {candidate.careerAndTalentThemes.talentSummaryHi}</p>
                      <p><strong>अनुकूल क्षेत्र:</strong> {candidate.careerAndTalentThemes.recommendedFieldsHi.join(', ')}</p>
                      <p className="text-[11px] text-slate-500 italic border-t pt-2">{candidate.careerAndTalentThemes.traditionalRoleNoteHi}</p>
                    </div>
                  </div>
                </div>

                {/* PARENTING & STUDY ROOM VASTU */}
                <div className="p-5 bg-amber-50/30 border border-amber-200/70 rounded-2xl space-y-2 text-xs">
                  <h5 className="font-playfair text-sm font-bold text-[#D97706]">अभिभावक परामर्श एवं अध्ययन कक्ष वास्तु</h5>
                  <p className="text-slate-700 font-sans"><strong>सकारात्मक दृष्टिकोण:</strong> {candidate.parentingAndVastuTips.parentingToneHi}</p>
                  <p className="text-slate-700 font-sans"><strong>अध्ययन मेज वास्तु:</strong> {candidate.parentingAndVastuTips.studyRoomVastuHi}</p>
                  <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-600">
                    <span><strong>शुभ रंग:</strong> {candidate.parentingAndVastuTips.beneficialColors.join(', ')}</span>
                    <span><strong>अनुकूल दिन:</strong> {candidate.parentingAndVastuTips.favorableDays.join(', ')}</span>
                  </div>
                </div>

                {/* SPELLING VARIANTS */}
                {candidate.spellingVariants.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[#1E3A8A]" /> वैकल्पिक वर्तनी समायोजन (Spelling Variants Explorer)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {candidate.spellingVariants.map((variant, vIdx) => (
                        <div key={vIdx} className="bg-slate-50 p-3 rounded-xl border flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{variant.variantName}</span>
                            <span className="text-[10px] text-slate-500 block">{variant.noteHi}</span>
                          </div>
                          <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded border text-emerald-800">
                            {variant.suitabilityHi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: MULTI-NAME COMPARISON MATRIX */}
      {report && activeTab === 'COMPARISON' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Side-by-Side Matrix
              </span>
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A] mt-2">
                उम्मीदवार नामों का तुलनात्मक चार्ट (Candidate Names Comparison)
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                सभी प्रस्तावित नामों का संतुलित विश्लेषण बिना किसी नकारात्मक या एकांगी लेबल के।
              </p>
            </div>

            {/* COMPARISON TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600 font-mono text-[10px] uppercase">
                    <th className="p-3">प्रस्तावित नाम</th>
                    <th className="p-3">संयुक्त संख्या (Compound)</th>
                    <th className="p-3">मूलांक (Root)</th>
                    <th className="p-3">जन्मतिथि सामंजस्य</th>
                    <th className="p-3">स्कोर</th>
                    <th className="p-3">मुख्य सकारात्मक पक्ष</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.candidateAnalyses.map((ana, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{ana.name}</td>
                      <td className="p-3 font-mono font-bold text-[#1E3A8A]">{ana.chaldeanCompound} ({ana.compoundData.title})</td>
                      <td className="p-3 font-mono font-bold text-amber-700">{ana.chaldeanRoot}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ana.dobCompatibility.status === 'SUPPORTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ana.dobCompatibility.status === 'NEEDS_ATTENTION'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {ana.dobCompatibility.statusHi}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">{ana.dobCompatibility.score}/100</td>
                      <td className="p-3 text-[11px] text-slate-600">{ana.compoundData.meaning?.slice(0, 70)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border text-xs text-slate-700 leading-relaxed font-sans">
              <p className="font-bold text-[#1E3A8A] mb-1">संतुलित दृष्टिकोण (Balanced Overview):</p>
              {report.comparisonSummary.balancedOverviewHi}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NAME FINDER / GENERATOR LIBRARY */}
      {report && activeTab === 'GENERATOR' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <span className="text-[9px] font-mono bg-amber-50 text-amber-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Vedic Baby Name Library & Finder
              </span>
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A] mt-2">
                शुभ शिशु नाम भंडार एवं खोजक (Curated Baby Names)
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                प्रारंभिक अक्षर, लिंग, वैदिक लक्ष्य एवं अनुकूल कम्पाउंड के अनुसार शुद्ध, अर्थपूर्ण भारतीय शिशु नाम खोजें।
              </p>
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border text-xs">
              {/* Search */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">नाम खोजें (Search)</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Aarav"
                  className="w-full bg-white border py-1.5 px-2.5 rounded-xl text-xs"
                />
              </div>

              {/* Letter Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">प्रारंभिक अक्षर</label>
                <select
                  value={genLetterFilter}
                  onChange={(e) => setGenLetterFilter(e.target.value)}
                  className="w-full bg-white border py-1.5 px-2.5 rounded-xl text-xs"
                >
                  <option value="ALL">सभी अक्षर</option>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
                    <option key={l} value={l}>अक्षर '{l}'</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">लिंग</label>
                <select
                  value={genGenderFilter}
                  onChange={(e) => setGenGenderFilter(e.target.value)}
                  className="w-full bg-white border py-1.5 px-2.5 rounded-xl text-xs"
                >
                  <option value="ALL">सभी (Boy & Girl)</option>
                  <option value="BOY">बालक (Boy)</option>
                  <option value="GIRL">बालिका (Girl)</option>
                </select>
              </div>

              {/* Goal Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">वैदिक उद्देश्य / गुण</label>
                <select
                  value={genGoalFilter}
                  onChange={(e) => setGenGoalFilter(e.target.value)}
                  className="w-full bg-white border py-1.5 px-2.5 rounded-xl text-xs"
                >
                  <option value="ALL">सभी गुण</option>
                  <option value="Knowledge">ज्ञान व संस्कार (Knowledge)</option>
                  <option value="Leadership">नेतृत्व व तेज (Leadership)</option>
                  <option value="Creativity">रचनात्मकता व कला (Creativity)</option>
                  <option value="Prosperity">समृद्धि व सुख (Prosperity)</option>
                  <option value="Confidence">आत्मविश्वास व शक्ति (Confidence)</option>
                  <option value="Harmony">शांति व सौहार्द (Harmony)</option>
                </select>
              </div>

              {/* Root Number Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">मूलांक अंक (Root Number)</label>
                <select
                  value={genRootFilter}
                  onChange={(e) => setGenRootFilter(e.target.value)}
                  className="w-full bg-white border py-1.5 px-2.5 rounded-xl text-xs"
                >
                  <option value="ALL">सभी अंक</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <option key={n} value={n}>अंक {n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* RESULTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibrary.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border hover:border-[#1E3A8A]/40 rounded-2xl p-4 space-y-2 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-playfair text-lg font-bold text-slate-800">{item.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.gender === 'BOY' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {item.gender === 'BOY' ? 'बालक' : 'बालिका'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans mt-1">
                      <strong>अर्थ:</strong> {item.meaningHi} ({item.meaningEn})
                    </p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-500 font-bold">
                      Chaldean {item.chaldeanCompound} (अंक {item.chaldeanRoot})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddFromLibrary(item.name)}
                      className="text-[11px] font-bold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      विश्लेषण करें <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FULL 16-POINT REPORT */}
      {report && activeTab === 'REPORT' && (
        <div className="space-y-6 animate-in fade-in duration-300" id="child-full-dossier">
          <div className="bg-white border rounded-3xl p-6 md:p-10 space-y-8 shadow-sm">
            {/* Report Header */}
            <div className="text-center border-b pb-6 space-y-2">
              <span className="text-[10px] font-mono bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                LeoFamily Master Numerology Dossier
              </span>
              <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#1E3A8A]">
                16-सूत्रीय संपूर्ण वैदिक शिशु नामाक्षर एवं नाम रिपोर्ट
              </h3>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                शिशु {report.childInfo.name} • जन्मतिथि {report.childInfo.standardDob} • मूलांक {report.childInfo.mulank} • भाग्यांक {report.childInfo.bhagyank}
              </p>
            </div>

            {/* 16-Point Structured Sections */}
            <div className="space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border">
                <h5 className="font-bold text-[#1E3A8A]">1. मूल न्यूमेरोलॉजी निर्देशांक (Core Coordinates)</h5>
                <p>शिशु का मूलांक {report.childInfo.mulank} ({report.childInfo.mulankGrahaHi}) एवं भाग्यांक {report.childInfo.bhagyank} ({report.childInfo.bhagyankGrahaHi}) है।</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border">
                <h5 className="font-bold text-[#1E3A8A]">2. लो शू ग्रिड एवं अनुपस्थित अंक (Grid & Missing Numbers)</h5>
                <p>जन्म ग्रिड में अनुपस्थित अंक: {report.gridData.missingNumbers.join(', ') || 'कोई नहीं (पूर्ण ग्रिड)'}।</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border">
                <h5 className="font-bold text-[#1E3A8A]">3. शुभ नामाक्षर सारांश (Wisdom Starting Letters)</h5>
                <p>अत्यंत अनुशंसित अक्षर: {report.wisdomLetters.highlySupportive.map(l => `'${l.letter}'`).join(', ')}।</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border">
                <h5 className="font-bold text-[#1E3A8A]">4. अभिभावकों हेतु अंतिम नाम चयन नियम (Final Selection Guidance)</h5>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                  {report.parentGuidelines.rulesHi.map((rule, rIdx) => (
                    <li key={rIdx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[10px] flex gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <p>{report.parentGuidelines.disclaimerHi}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
