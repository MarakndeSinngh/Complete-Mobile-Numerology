import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  ChevronRight,
  Sliders,
  Sun,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  User,
  Heart,
  Briefcase,
  Home,
  Car,
  BookOpen,
  Check,
  Star
} from 'lucide-react';
import {
  scanLuckyDates,
  LuckyDatesFinderReport,
  CandidateDateAnalysis,
  LuckyDatesPurposeKey,
  PURPOSE_DEFINITIONS,
  WEEKDAY_MAP
} from '../core/luckyDatesEngine';
import { formatDateIndian, parseIndianDate } from '../utils/dateUtils';
import { calculateMulank, calculateBhagyank } from '../core/numerologyEngine';

export interface LuckyDatesFinderProps {
  initialDob?: string;
  initialName?: string;
  onReportGenerated?: (report: LuckyDatesFinderReport) => void;
}

export const LuckyDatesFinder: React.FC<LuckyDatesFinderProps> = ({
  initialDob = '15/08/1988',
  initialName = 'Client',
  onReportGenerated
}) => {
  // Input States
  const [dob, setDob] = useState<string>(initialDob || '15/08/1988');
  const [name, setName] = useState<string>(initialName || 'Client');
  const [purpose, setPurpose] = useState<LuckyDatesPurposeKey>('BUSINESS_LAUNCH');
  const [partnerDob, setPartnerDob] = useState<string>('');
  
  // Date Range Mode
  const [rangeMode, setRangeMode] = useState<'MONTH' | 'CUSTOM'>('MONTH');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [startDate, setStartDate] = useState<string>('01/10/2026');
  const [endDate, setEndDate] = useState<string>('31/10/2026');

  // Filters
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUPPORTIVE' | 'NEUTRAL' | 'NEEDS_ATTENTION'>('ALL');
  const [selectedWeekdayFilter, setSelectedWeekdayFilter] = useState<number | null>(null);
  const [selectedNumberFilter, setSelectedNumberFilter] = useState<number | null>(null);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'TABLE' | 'TRANSIT' | 'COMPARISON' | 'DOSSIER'>('TABLE');
  
  // Selected Dates for Comparison
  const [comparisonDates, setComparisonDates] = useState<CandidateDateAnalysis[]>([]);
  const [selectedDetailDate, setSelectedDetailDate] = useState<CandidateDateAnalysis | null>(null);

  // Generated Report
  const [report, setReport] = useState<LuckyDatesFinderReport | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Calculate live core numbers
  const liveMulank = useMemo(() => calculateMulank(dob), [dob]);
  const liveBhagyank = useMemo(() => calculateBhagyank(dob), [dob]);

  // Synchronize initial prop changes
  useEffect(() => {
    if (initialDob) setDob(initialDob);
    if (initialName) setName(initialName);
  }, [initialDob, initialName]);

  // Execute Date Scan
  const handleScanDates = () => {
    setIsCalculating(true);
    setTimeout(() => {
      try {
        const generated = scanLuckyDates(dob, purpose, {
          month: selectedMonth,
          year: selectedYear,
          startDate: rangeMode === 'CUSTOM' ? startDate : undefined,
          endDate: rangeMode === 'CUSTOM' ? endDate : undefined,
          partnerDob: partnerDob.trim() || undefined,
          userName: name.trim() || undefined
        });

        setReport(generated);
        if (generated.topSupportiveDates.length > 0) {
          setSelectedDetailDate(generated.topSupportiveDates[0]);
          setComparisonDates(generated.topSupportiveDates.slice(0, 3));
        }

        // Cache report for MasterReportUnified sync
        try {
          localStorage.setItem('leofamily_lucky_dates_finder_report', JSON.stringify(generated));
        } catch (e) {
          console.warn('localStorage error:', e);
        }

        if (onReportGenerated) {
          onReportGenerated(generated);
        }
      } catch (err) {
        console.error('Error scanning lucky dates:', err);
      } finally {
        setIsCalculating(false);
      }
    }, 150);
  };

  // Run initial scan on mount
  useEffect(() => {
    handleScanDates();
  }, []);

  // Filtered Candidates View
  const filteredCandidates = useMemo(() => {
    if (!report) return [];
    let list = report.candidates;
    if (filterStatus !== 'ALL') {
      list = list.filter(c => c.compatibilityStatus === filterStatus);
    }
    if (selectedWeekdayFilter !== null) {
      list = list.filter(c => c.weekdayNumber === selectedWeekdayFilter);
    }
    if (selectedNumberFilter !== null) {
      list = list.filter(c => c.dateNumber === selectedNumberFilter || c.rootNumber === selectedNumberFilter);
    }
    return list;
  }, [report, filterStatus, selectedWeekdayFilter, selectedNumberFilter]);

  // Toggle Date in Comparison
  const toggleComparisonDate = (dateItem: CandidateDateAnalysis) => {
    setComparisonDates(prev => {
      const exists = prev.some(d => d.dateFormatted === dateItem.dateFormatted);
      if (exists) {
        return prev.filter(d => d.dateFormatted !== dateItem.dateFormatted);
      } else {
        if (prev.length >= 4) {
          return [...prev.slice(1), dateItem];
        }
        return [...prev, dateItem];
      }
    });
  };

  return (
    <div id="lucky-dates-finder-component" className="space-y-8 text-left font-sans text-[#1F2937]">
      
      {/* HEADER & HERO BANNER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#D97706] rounded-[36px] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Lucky Dates Finder Pro
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-mono">
              Vibration Analysis & Transit Matching Engine
            </span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold">
            शुभ मुहूर्त व अनुकूल तिथि चयन (Lucky Dates Finder)
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-3xl leading-relaxed">
            मूलांक, भाग्यांक, व्यक्तिगत वर्ष (Personal Year), व्यक्तिगत माह एवं वार-अधिष्ठाता ग्रहों के सामंजस्य से किसी भी महत्वपूर्ण कार्य, व्यापार, गृह प्रवेश या विवाह के लिए शास्त्रसम्मत शुभ तिथियों का वैज्ञानिक विश्लेषण।
          </p>
        </div>
      </div>

      {/* INPUT CONTROLS PANEL */}
      <div className="glass-panel p-6 sm:p-8 rounded-[36px] bg-white border border-[#E5E7EB] shadow-md space-y-6">
        <div className="border-b border-[#E5E7EB] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-playfair font-bold text-lg text-[#1E3A8A]">
              तिथि चयन इनपुट मानदंड (DOB & Purpose Selection)
            </h3>
            <span className="text-[11px] text-slate-500">
              अपनी जन्मतिथि और कार्य का उद्देश्य दर्ज करें (All dates in DD/MM/YYYY)
            </span>
          </div>
          <button
            onClick={handleScanDates}
            disabled={isCalculating}
            className="px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'गणना जारी...' : 'शुभ तिथियां खोजें (Find Lucky Dates)'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* DOB Input */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600 block">
              जन्मतिथि (Date of Birth) *
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:bg-white focus:border-[#D97706] outline-none"
            />
            <span className="text-[10px] text-slate-500 block font-mono">
              Driver: #{liveMulank} • Conductor: #{liveBhagyank}
            </span>
          </div>

          {/* User Name */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600 block">
              व्यक्ति / प्रतिष्ठान का नाम (Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Sharma / Leo Tech"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-[#D97706] outline-none"
            />
          </div>

          {/* Purpose Selection */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600 block">
              कार्य का उद्देश्य (Purpose of Activity) *
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as LuckyDatesPurposeKey)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-[#D97706] outline-none cursor-pointer"
            >
              {Object.values(PURPOSE_DEFINITIONS).map(p => (
                <option key={p.key} value={p.key}>
                  {p.titleHi} ({p.titleEn})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-amber-800 font-sans block">
              विषय: {PURPOSE_DEFINITIONS[purpose]?.coreThemeHi}
            </span>
          </div>
        </div>

        {/* Date Range Selection Controls */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[#1E3A8A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> समय सीमा चयन (Scan Window)
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setRangeMode('MONTH')}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                  rangeMode === 'MONTH' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                मासिक स्कैन (Monthly)
              </button>
              <button
                onClick={() => setRangeMode('CUSTOM')}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                  rangeMode === 'CUSTOM' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                कस्टम अवधि (Custom Range)
              </button>
            </div>
          </div>

          {rangeMode === 'MONTH' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">माह (Month)</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium outline-none"
                >
                  {[
                    '01 - जनवरी (Jan)', '02 - फ़रवरी (Feb)', '03 - मार्च (Mar)', '04 - अप्रैल (Apr)',
                    '05 - मई (May)', '06 - जून (Jun)', '07 - जुलाई (Jul)', '08 - अगस्त (Aug)',
                    '09 - सितंबर (Sep)', '10 - अक्टूबर (Oct)', '11 - नवंबर (Nov)', '12 - दिसंबर (Dec)'
                  ].map((mStr, idx) => (
                    <option key={idx + 1} value={idx + 1}>{mStr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">वर्ष (Year)</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium outline-none"
                >
                  {[2025, 2026, 2027, 2028].map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {(purpose === 'MARRIAGE' || purpose === 'BUSINESS_MEETING') && (
                <div className="col-span-2">
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">पार्टनर की जन्मतिथि (Optional)</label>
                  <input
                    type="text"
                    value={partnerDob}
                    onChange={(e) => setPartnerDob(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">प्रारंभ तिथि (Start Date - DD/MM/YYYY)</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="01/10/2026"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">समापन तिथि (End Date - DD/MM/YYYY)</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="31/10/2026"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs outline-none"
                />
              </div>

              {(purpose === 'MARRIAGE' || purpose === 'BUSINESS_MEETING') && (
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">पार्टनर की जन्मतिथि (Optional)</label>
                  <input
                    type="text"
                    value={partnerDob}
                    onChange={(e) => setPartnerDob(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CORE SUMMARY TILES */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">मूलांक (Driver)</span>
            <span className="text-xl font-playfair font-black text-[#1E3A8A] block">#{report.birthProfile.mulank}</span>
            <span className="text-[10px] text-slate-600 block">{report.birthProfile.mulankGraha}</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">भाग्यांक (Conductor)</span>
            <span className="text-xl font-playfair font-black text-amber-700 block">#{report.birthProfile.bhagyank}</span>
            <span className="text-[10px] text-slate-600 block">{report.birthProfile.bhagyankGraha}</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Personal Year</span>
            <span className="text-xl font-playfair font-black text-indigo-700 block">#{report.currentPersonalYear}</span>
            <span className="text-[10px] text-slate-600 block truncate">{report.currentPersonalYearThemeHi.slice(0, 14)}...</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Personal Month</span>
            <span className="text-xl font-playfair font-black text-emerald-700 block">#{report.currentPersonalMonth}</span>
            <span className="text-[10px] text-slate-600 block">मासिक चक्र</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">कुल तिथियां</span>
            <span className="text-xl font-playfair font-black text-slate-800 block">{report.candidates.length}</span>
            <span className="text-[10px] text-slate-600 block">{report.dateRangeSummary}</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-3xl border border-amber-200 shadow-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-amber-800 font-bold block">अनुकूल तिथियां</span>
            <span className="text-xl font-playfair font-black text-amber-900 block">{report.topSupportiveDates.length}</span>
            <span className="text-[10px] text-amber-700 block font-bold">Supportive Dates</span>
          </div>
        </div>
      )}

      {/* TOP AUSPICIOUS DATES SPOTLIGHT */}
      {report && report.topSupportiveDates.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-[36px] bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 border border-amber-200/80 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">
                Top Auspicious Dates (सर्वोत्तम अनुशंसित तिथियां)
              </span>
              <h3 className="font-playfair font-bold text-lg text-slate-900">
                {report.purposeHi} हेतु शीर्ष अनुकूल तिथियां
              </h3>
            </div>
            <span className="text-xs font-mono bg-white border border-amber-300 text-amber-900 px-3 py-1 rounded-full font-bold">
              {report.topSupportiveDates.length} Auspicious Dates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {report.topSupportiveDates.map((item, idx) => {
              const isCompared = comparisonDates.some(d => d.dateFormatted === item.dateFormatted);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDetailDate(item)}
                  className="p-4 bg-white rounded-3xl border border-amber-200/70 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-playfair font-bold text-base text-[#1E3A8A]">
                      {item.dateFormatted}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {item.compatibilityScore}%
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>वार: <strong>{item.weekdayHi}</strong></span>
                      <span>Day #{item.dateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Day: <strong>#{item.personalDay}</strong></span>
                      <span>Root #{item.rootNumber}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-2 border-t border-slate-100 pt-1.5">
                    {item.whyThisDateHi}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComparisonDate(item);
                      }}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                        isCompared
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isCompared ? '✓ तुलना सूची में' : '+ तुलना करें'}
                    </button>
                    <span className="text-[9px] font-mono text-[#D97706] font-bold">
                      {item.weekdayLord}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'TABLE', label: 'तिथि विश्लेषण तालिका (Table View)', icon: Calendar },
          { id: 'TRANSIT', label: 'ट्रांजिट व ग्रहीय गोचर (Transit Matching)', icon: Compass },
          { id: 'COMPARISON', label: `तिथि तुलना मैट्रिक्स (${comparisonDates.length})`, icon: Sliders },
          { id: 'DOSSIER', label: 'वैदिक मुहूर्त दस्तावेज (Dossier)', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CLEAN TABLE-BASED VIEW WITH VIBRATION & TRANSIT ANALYSIS */}
      {activeTab === 'TABLE' && (
        <div className="space-y-6">
          {/* Quick Filters */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#D97706]" /> फ़िल्टर:
              </span>
              {[
                { id: 'ALL', label: 'सभी तिथियां' },
                { id: 'SUPPORTIVE', label: 'अत्यंत अनुकूल' },
                { id: 'NEUTRAL', label: 'संतुलित' },
                { id: 'NEEDS_ATTENTION', label: 'विशेष ध्यान' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id as any)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                    filterStatus === f.id
                      ? 'bg-[#D97706] text-white'
                      : 'bg-white border text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              दिखाई गई तिथियां: <strong>{filteredCandidates.length}</strong> / {report?.candidates.length || 0}
            </div>
          </div>

          {/* MAIN TABLE */}
          <div className="glass-panel rounded-[32px] bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">तारीख (Date)</th>
                    <th className="py-3.5 px-4">वार व अधिष्ठाता (Day & Lord)</th>
                    <th className="py-3.5 px-4">कंपन अंक (Vibrations)</th>
                    <th className="py-3.5 px-4">Personal Day</th>
                    <th className="py-3.5 px-4">अनुकूलता स्तर (Tier)</th>
                    <th className="py-3.5 px-4">ट्रांजिट व ग्रहीय विश्लेषण (Why This Date)</th>
                    <th className="py-3.5 px-4 text-center">तुलना</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((c, idx) => {
                    const isCompared = comparisonDates.some(d => d.dateFormatted === c.dateFormatted);
                    const isSelected = selectedDetailDate?.dateFormatted === c.dateFormatted;
                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedDetailDate(c)}
                        className={`hover:bg-amber-50/50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-amber-50/80 font-medium' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A8A]">
                          {c.dateFormatted}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">{c.weekdayHi}</span>
                          <span className="text-[10px] text-slate-500 block">{c.weekdayLord}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-slate-800">Day #{c.dateNumber}</span>
                          <span className="text-[10px] text-slate-500 block">Root #{c.rootNumber} (Sum {c.compoundNumber})</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-indigo-700">P.Day #{c.personalDay}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{c.personalDayThemeHi}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            c.compatibilityStatus === 'SUPPORTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : c.compatibilityStatus === 'NEUTRAL'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {c.compatibilityStatus === 'SUPPORTIVE' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {c.compatibilityStatus === 'SUPPORTIVE' ? 'अत्यंत अनुकूल' : c.compatibilityStatus === 'NEUTRAL' ? 'संतुलित' : 'विशेष ध्यान'}
                            <span className="font-mono text-[9px] opacity-80">({c.compatibilityScore}%)</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {c.whyThisDateHi}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComparisonDate(c);
                            }}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                              isCompared
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {isCompared ? '✓' : '+'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Date Deep-Dive Card */}
          {selectedDetailDate && (
            <div className="p-6 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-[#FDE68A]/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#D97706] text-white font-playfair font-black text-lg flex items-center justify-center">
                    {selectedDetailDate.day}
                  </span>
                  <div>
                    <h4 className="font-playfair font-bold text-base text-[#1E3A8A]">
                      तारीख सूक्ष्म विश्लेषण: {selectedDetailDate.dateFormatted} ({selectedDetailDate.weekdayHi})
                    </h4>
                    <span className="text-[11px] text-[#78350F]">
                      अधिष्ठाता: {selectedDetailDate.weekdayLord} • {selectedDetailDate.compatibilityStatusHi} ({selectedDetailDate.compatibilityScore}%)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleComparisonDate(selectedDetailDate)}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-xl font-bold hover:bg-amber-50"
                >
                  {comparisonDates.some(d => d.dateFormatted === selectedDetailDate.dateFormatted)
                    ? '✓ तुलना सूची से हटाएं'
                    : '+ तुलना मैट्रिक्स में जोड़ें'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-slate-800 block font-bold text-emerald-800">सकारात्मक कंपन व सहायक कारक:</strong>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {selectedDetailDate.supportingFactorsHi.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-slate-800 block font-bold text-amber-900">सावधानी एवं ध्यान बिंदु (Cautions):</strong>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {selectedDetailDate.cautionFactorsHi.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-slate-800 block font-bold text-[#1E3A8A]">पारंपरिक मुहूर्त व समय परामर्श:</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selectedDetailDate.traditionalGuidanceHi}
                  </p>
                  <span className="text-[10px] text-slate-500 block font-mono mt-1">
                    {selectedDetailDate.transitMatchingAspectHi}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRANSIT MATCHING & CYCLES */}
      {activeTab === 'TRANSIT' && report && (
        <div className="glass-panel p-6 sm:p-8 rounded-[36px] bg-white border border-[#E5E7EB] shadow-md space-y-6">
          <div className="border-b pb-4">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">
              Vibration Synthesis & Planetary Transits
            </span>
            <h3 className="font-playfair font-bold text-lg text-slate-900">
              ग्रह गोचर व व्यक्तिगत समयावधि तालमेल (Transit Matching Grid)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D97706]" /> मूलांक व भाग्यांक तालमेल (Driver & Conductor Synergy):
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {report.transitMatchingGrid.driverCompatibilityHi}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {report.transitMatchingGrid.conductorCompatibilityHi}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" /> व्यक्तिगत वर्ष व माह चक्र (Personal Cycles):
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {report.transitMatchingGrid.personalYearAlignmentHi}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {report.transitMatchingGrid.personalMonthAlignmentHi}
              </p>
            </div>
          </div>

          {/* Planetary Weekday Lords */}
          <div className="space-y-3 text-xs pt-2">
            <strong className="text-slate-800 block font-bold">सप्ताहिक वार एवं अधिष्ठाता ग्रह सारणी (Vedic Weekday Lords):</strong>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {Object.values(WEEKDAY_MAP).map((w, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border rounded-2xl text-center space-y-0.5">
                  <span className="font-bold text-slate-800 block">{w.nameHi}</span>
                  <span className="font-mono text-[10px] text-[#D97706] font-bold block">#{w.planetNumber}</span>
                  <span className="text-[10px] text-slate-500 block">{w.lordHi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPARISON MATRIX */}
      {activeTab === 'COMPARISON' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-playfair font-bold text-lg text-[#1E3A8A]">
                चुनी हुई तिथियों की तुलना (Date Comparison Matrix)
              </h3>
              <p className="text-xs text-slate-500">
                2 से 4 तिथियों की ग्रहीय ऊर्जा, मूलांक सामंजस्य व कार्य अनुकूलता का समानांतर विश्लेषण
              </p>
            </div>
            {comparisonDates.length > 0 && (
              <button
                onClick={() => setComparisonDates([])}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                सूची रीसेट करें
              </button>
            )}
          </div>

          {comparisonDates.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">कोई तिथि नहीं चुनी गई</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                तालिका में जाकर किसी भी तारीख के आगे '+ तुलना' बटन दबाएं।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {comparisonDates.map((item, idx) => (
                <div key={idx} className="glass-panel p-5 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b pb-2">
                    <div>
                      <span className="font-playfair font-bold text-lg text-[#1E3A8A] block">
                        {item.dateFormatted}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {item.weekdayHi} ({item.weekdayLord})
                      </span>
                    </div>
                    <button
                      onClick={() => toggleComparisonDate(item)}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-bold"
                    >
                      हटाएं
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">तारीख अंक (Day):</span>
                      <strong className="font-mono">#{item.dateNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">तारीख योग (Root):</span>
                      <strong className="font-mono">#{item.rootNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Personal Day:</span>
                      <strong className="font-mono text-indigo-700">#{item.personalDay}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">अनुकूलता स्तर:</span>
                      <span className="font-bold text-emerald-700">{item.compatibilityStatusHi.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] pt-1">
                    <strong className="text-slate-800 block font-bold">प्रमुख विश्लेषण:</strong>
                    <p className="text-slate-600 leading-relaxed">
                      {item.whyThisDateHi}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-[10px] text-slate-600 border border-slate-200">
                    <strong>मुहूर्त सलाह:</strong> {item.traditionalGuidanceHi}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DOSSIER */}
      {activeTab === 'DOSSIER' && report && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700">
          <div className="border-b pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold tracking-wider">
                Vedic Muhurta Dossier
              </span>
              <h3 className="font-playfair text-xl font-bold text-slate-900">
                13-सूत्रीय शुभ तिथि चयन दस्तावेज (Lucky Dates Dossier)
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200 font-bold">
              LeoFamily Pro Dossier
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
              <strong className="text-slate-900 block font-bold">1. जन्म विवरण (Birth Profile):</strong>
              <p>जन्मतिथि: {report.birthProfile.standardDob} • मूलांक: #{report.birthProfile.mulank} ({report.birthProfile.mulankGraha}) • भाग्यांक: #{report.birthProfile.bhagyank} ({report.birthProfile.bhagyankGraha})</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
              <strong className="text-slate-900 block font-bold">2. कार्य उद्देश्य (Purpose):</strong>
              <p>{report.purposeHi} — {PURPOSE_DEFINITIONS[report.purpose]?.coreThemeHi}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
              <strong className="text-slate-900 block font-bold">3. व्यक्तिगत वर्ष एवं माह (Personal Cycles):</strong>
              <p>Personal Year: #{report.currentPersonalYear} ({report.currentPersonalYearThemeHi}) • Personal Month: #{report.currentPersonalMonth}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
              <strong className="text-slate-900 block font-bold">4. अनुशंसित शुभ तिथियां (Top Auspicious Dates):</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.topSupportiveDates.map((d, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl border text-[11px]">
                    <strong>{d.dateFormatted} ({d.weekdayHi})</strong> — Day #{d.dateNumber}, Personal Day #{d.personalDay} • {d.whyThisDateHi}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
              <strong className="text-slate-900 block font-bold">5. सहायक कारक (Supporting Factors):</strong>
              <ul className="list-disc list-inside space-y-0.5">
                {report.generalSupportingFactorsHi.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
              <strong className="text-slate-900 block font-bold">6. सावधानी बिंदु (Caution Factors):</strong>
              <ul className="list-disc list-inside space-y-0.5">
                {report.generalCautionFactorsHi.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
              <strong className="text-amber-900 block font-bold">7. अंतिम चयन सलाह (Final Guidance):</strong>
              <p className="text-amber-800 leading-relaxed">
                {report.finalSelectionNotesHi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      <div className="p-5 bg-slate-100 rounded-3xl border border-slate-300 text-xs text-slate-600 leading-relaxed space-y-1">
        <strong className="text-slate-800 block">शुभ तिथि एवं मुहूर्त परामर्श अस्वीकरण:</strong>
        <p>
          अंकशास्त्रीय तिथि चयन वैदिक ग्रहों और व्यक्तिगत अंकों के सकारात्मक सामंजस्य को समझने का पारंपरिक मार्गदर्शन है। यह किसी भी कार्य की शत-प्रतिशत सफलता या निश्चित भविष्यफल की गारंटी नहीं देता है। सही योजना, कानूनी औपचारिकताएं और निष्ठावान प्रयास ही सफलता के मुख्य आधार हैं।
        </p>
      </div>

    </div>
  );
};

export default LuckyDatesFinder;
