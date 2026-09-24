import React, { useState } from 'react';
import { 
  calculatePlanetaryTransitImpact, 
  TransitAnalysisResult,
  CURRENT_SATURN_TRANSIT,
  CURRENT_RAHU_TRANSIT,
  AspectPolarity
} from '../services/planetaryTransitEngine';
import { useLanguage } from '../i18n';
import { 
  Compass, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  RefreshCw, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Eye,
  Sliders,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';

interface PlanetaryTransitTrackerProps {
  driverNumber: number;
  conductorNumber: number;
  name?: string;
}

type SubTab = 'SUMMARY' | 'DRIVER' | 'CONDUCTOR' | 'REMEDIES';

export const PlanetaryTransitTracker: React.FC<PlanetaryTransitTrackerProps> = ({
  driverNumber,
  conductorNumber,
  name
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SubTab>('SUMMARY');
  const [simulatedDriver, setSimulatedDriver] = useState<number>(driverNumber);
  const [simulatedConductor, setSimulatedConductor] = useState<number>(conductorNumber);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Sync if props change
  React.useEffect(() => {
    setSimulatedDriver(driverNumber);
    setSimulatedConductor(conductorNumber);
  }, [driverNumber, conductorNumber]);

  const transitData: TransitAnalysisResult = React.useMemo(() => {
    return calculatePlanetaryTransitImpact(simulatedDriver, simulatedConductor);
  }, [simulatedDriver, simulatedConductor]);

  const getPolarityBadge = (polarity: AspectPolarity) => {
    switch (polarity) {
      case 'FAVORABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> मित्र दृष्टि (Favorable)
          </span>
        );
      case 'TRANSFORMATIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> परिवर्तनकारी (Transformative)
          </span>
        );
      case 'CHALLENGING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> कर्म शुद्धि दृष्टि (Challenging)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            <Info className="w-3.5 h-3.5 text-slate-500" /> सम दृष्टि (Neutral)
          </span>
        );
    }
  };

  return (
    <div 
      id="planetary-transit-tracker-widget" 
      className="glass-panel p-6 sm:p-8 rounded-[40px] space-y-8 bg-white border border-[#E5E7EB] shadow-md text-left transition-all relative overflow-hidden"
    >
      {/* Subtle Vedic star background overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      
      {/* Header with Live Planetary Status Badge */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10 border-b border-[#E5E7EB] pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#D97706]/10 text-[#D97706] px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-[#D97706]/20">
              <Compass className="w-3 h-3 animate-spin-slow" /> ग्रह गोचर वेधशाला (Vedic Ephemeris)
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE 2026 TRANSIT
            </span>
          </div>
          <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-wide">
            Planetary Transit Tracker <span className="text-base sm:text-xl font-normal text-[#6B7280] font-sans">| शनि एवं राहु गोचर प्रभाव</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl leading-relaxed">
            Real-time planetary coordinates of <strong className="text-[#1F2937]">Saturn (शनि)</strong> and <strong className="text-[#1F2937]">Rahu (राहु)</strong>, tracking their active Vedic aspects (दृष्टि) on {name ? <span className="font-semibold text-[#D97706]">{name}'s</span> : 'your'} Driver Number (मूलांक #{simulatedDriver}) and Conductor Number (भाग्यांक #{simulatedConductor}).
          </p>
        </div>

        {/* Customization & Recalculate Tool */}
        <div className="flex items-center gap-2">
          <button
            id="btn-transit-customize-toggle"
            type="button"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#F8F4EF] hover:bg-[#F2E8DC] text-[#1F2937] border border-[#E5E7EB] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-[#D97706]" />
            {isCustomizing ? 'Hide Simulator' : 'Test Other Numbers'}
          </button>
        </div>
      </div>

      {/* Simulator Tray (Optional) */}
      {isCustomizing && (
        <div 
          id="transit-customizer-tray" 
          className="p-5 rounded-2xl bg-[#FDFBF7] border border-amber-200/70 space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#D97706]" /> Custom Transit Simulation
            </span>
            <button
              id="btn-transit-reset-birth"
              type="button"
              onClick={() => {
                setSimulatedDriver(driverNumber);
                setSimulatedConductor(conductorNumber);
              }}
              className="text-[10px] font-mono text-[#D97706] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset to Birth Profile
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-[#6B7280] block mb-1.5 font-bold">
                Driver Number (मूलांक 1-9)
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={`d-${num}`}
                    type="button"
                    onClick={() => setSimulatedDriver(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      simulatedDriver === num
                        ? 'bg-[#D97706] text-white shadow-sm'
                        : 'bg-white text-[#1F2937] border border-[#E5E7EB] hover:bg-amber-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#6B7280] block mb-1.5 font-bold">
                Conductor Number (भाग्यांक 1-9)
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={`c-${num}`}
                    type="button"
                    onClick={() => setSimulatedConductor(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      simulatedConductor === num
                        ? 'bg-[#D97706] text-white shadow-sm'
                        : 'bg-white text-[#1F2937] border border-[#E5E7EB] hover:bg-amber-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Ephemeris Dual Cards: Saturn & Rahu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saturn Card */}
        <div 
          id="card-saturn-transit"
          className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#111827] text-white space-y-4 shadow-md relative overflow-hidden border border-slate-700/60"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-serif select-none pointer-events-none">
            🪐
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-playfair tracking-wide text-amber-300">
                  {CURRENT_SATURN_TRANSIT.planet} ({CURRENT_SATURN_TRANSIT.vedicName})
                </span>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  अंक #8
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono block mt-0.5">
                {CURRENT_SATURN_TRANSIT.sanskritName} • कर्मकारक ग्रह (Lord of Justice)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {CURRENT_SATURN_TRANSIT.motionHi}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-700/60">
            <div className="bg-slate-800/60 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-mono">Current Sign (गोचर राशि)</span>
              <span className="font-semibold text-slate-100 block mt-0.5">{CURRENT_SATURN_TRANSIT.currentSignHi}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-mono">Nakshatra (नक्षत्र)</span>
              <span className="font-semibold text-slate-100 block mt-0.5">
                {CURRENT_SATURN_TRANSIT.nakshatra} (प.-{CURRENT_SATURN_TRANSIT.nakshatraPada})
              </span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block font-mono">Special Drishti (दृष्टि)</span>
              <span className="font-semibold text-amber-300 block mt-0.5">3rd, 7th, 10th Houses</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-lora italic pt-1 border-t border-slate-800">
            "{CURRENT_SATURN_TRANSIT.transitPhaseSummaryHi}"
          </p>
        </div>

        {/* Rahu Card */}
        <div 
          id="card-rahu-transit"
          className="p-6 rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#311042] to-[#18181B] text-white space-y-4 shadow-md relative overflow-hidden border border-indigo-900/60"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-serif select-none pointer-events-none">
            🐉
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-playfair tracking-wide text-indigo-300">
                  {CURRENT_RAHU_TRANSIT.planet} ({CURRENT_RAHU_TRANSIT.vedicName})
                </span>
                <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  अंक #4
                </span>
              </div>
              <span className="text-[11px] text-indigo-200/80 font-mono block mt-0.5">
                {CURRENT_RAHU_TRANSIT.sanskritName} • मायावी एवं महत्वाकांक्षी ग्रह
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {CURRENT_RAHU_TRANSIT.motionHi}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-indigo-900/60">
            <div className="bg-indigo-950/60 p-2.5 rounded-xl">
              <span className="text-[10px] text-indigo-300 block font-mono">Current Sign (गोचर राशि)</span>
              <span className="font-semibold text-slate-100 block mt-0.5">{CURRENT_RAHU_TRANSIT.currentSignHi}</span>
            </div>
            <div className="bg-indigo-950/60 p-2.5 rounded-xl">
              <span className="text-[10px] text-indigo-300 block font-mono">Nakshatra (नक्षत्र)</span>
              <span className="font-semibold text-slate-100 block mt-0.5">
                {CURRENT_RAHU_TRANSIT.nakshatra} (प.-{CURRENT_RAHU_TRANSIT.nakshatraPada})
              </span>
            </div>
            <div className="bg-indigo-950/60 p-2.5 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-indigo-300 block font-mono">Special Drishti (दृष्टि)</span>
              <span className="font-semibold text-indigo-300 block mt-0.5">5th, 7th, 9th Houses</span>
            </div>
          </div>

          <p className="text-xs text-indigo-200 leading-relaxed font-lora italic pt-1 border-t border-indigo-950">
            "{CURRENT_RAHU_TRANSIT.transitPhaseSummaryHi}"
          </p>
        </div>

      </div>

      {/* Synthesis Metric Banner */}
      <div 
        id="transit-harmony-banner"
        className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/50 border border-amber-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-[#D97706] text-white px-2.5 py-0.5 rounded-full font-bold">
              गोचर प्रभाव सूचकांक
            </span>
            <span className="text-sm font-bold text-[#1F2937]">
              {transitData.overallVerdictHi}
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            शनि (#8) और राहु (#4) का आपके मूलांक #{simulatedDriver} व भाग्यांक #{simulatedConductor} के साथ संयुक्त ऊर्जा समन्वय।
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Transit Harmony</span>
            <span className="text-2xl font-black font-playfair text-[#D97706]">
              {transitData.overallTransitScore}%
            </span>
          </div>
          <div className="w-24 bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#D97706] to-amber-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${transitData.overallTransitScore}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Aspect Views Tab Navigation */}
      <div className="border-b border-[#E5E7EB] pb-2 flex flex-wrap gap-2">
        {[
          { id: 'SUMMARY', label: 'Overview & Themes', labelHi: 'गोचर समीक्षा' },
          { id: 'DRIVER', label: `Driver #${simulatedDriver} Aspects`, labelHi: `मूलांक #${simulatedDriver} दृष्टि` },
          { id: 'CONDUCTOR', label: `Conductor #${simulatedConductor} Aspects`, labelHi: `भाग्यांक #${simulatedConductor} दृष्टि` },
          { id: 'REMEDIES', label: 'Transit Remedies', labelHi: 'गोचर महा-उपाय' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`btn-transit-tab-${tab.id.toLowerCase()}`}
            type="button"
            onClick={() => setActiveTab(tab.id as SubTab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                : 'bg-[#F8F4EF] hover:bg-[#F2E8DC] text-[#1F2937] border-[#E5E7EB]'
            }`}
          >
            <span>{tab.labelHi}</span>
            <span className="opacity-70 text-[10px] ml-1.5 hidden sm:inline">({tab.label})</span>
          </button>
        ))}
      </div>

      {/* SubTab 1: SUMMARY & DOMINANT THEMES */}
      {activeTab === 'SUMMARY' && (
        <div id="panel-transit-summary" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dominant Themes */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#E5E7EB] space-y-4">
              <h4 className="font-playfair font-bold text-base text-[#1F2937] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" /> सक्रिय गोचर के मुख्य प्रभाव (Dominant Themes)
              </h4>
              <ul className="space-y-2.5 text-xs text-[#4B5563]">
                {transitData.dominantThemesHi.map((theme, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 flex-shrink-0" />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action Matrix */}
            <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#E5E7EB] space-y-4">
              <h4 className="font-playfair font-bold text-base text-[#1F2937] flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> इस गोचर में क्या करें और क्या टालें?
              </h4>
              <div className="space-y-3 text-xs">
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60">
                  <span className="font-bold text-emerald-800 block text-[11px] mb-1">
                    ✓ अनुकूल गतिविधियां (Recommended):
                  </span>
                  <p className="text-emerald-900 leading-relaxed">
                    दीर्घकालिक अनुबंध, सॉफ्टवेयर व डिजिटल विस्तार, भूमि या संपत्ति सुधार, और नियमित ध्यान/कर्म शुद्धि।
                  </p>
                </div>
                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/60">
                  <span className="font-bold text-rose-800 block text-[11px] mb-1">
                    ✗ विशेष सावधानियां (Avoid):
                  </span>
                  <p className="text-rose-900 leading-relaxed">
                    सट्टेबाजी या तुरंत अमीर बनने के लालच, उच्चाधिकारियों से व्यर्थ अहंकार, और रात्रि में अनियमित दिनचर्या।
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Dual Number Radar Strip */}
          <div className="p-5 rounded-2xl bg-[#F8F4EF] border border-[#E5E7EB] flex flex-wrap justify-around items-center gap-4 text-center">
            <div>
              <span className="text-[10px] font-mono text-[#6B7280] uppercase block">आपका मूलांक (Driver)</span>
              <span className="text-2xl font-bold font-playfair text-[#D97706]">#{simulatedDriver}</span>
              <span className="text-[10px] text-slate-500 block">
                {transitData.driverAspect.targetPlanet}
              </span>
            </div>
            <div className="text-sm font-mono text-slate-400">⚡ Aspects ⚡</div>
            <div>
              <span className="text-[10px] font-mono text-[#6B7280] uppercase block">शनि का प्रभाव</span>
              <div className="mt-1">{getPolarityBadge(transitData.driverAspect.saturnAspect.polarity)}</div>
            </div>
            <div className="text-sm font-mono text-slate-400">+</div>
            <div>
              <span className="text-[10px] font-mono text-[#6B7280] uppercase block">राहु का प्रभाव</span>
              <div className="mt-1">{getPolarityBadge(transitData.driverAspect.rahuAspect.polarity)}</div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: DRIVER ASPECT DETAIL */}
      {activeTab === 'DRIVER' && (
        <div id="panel-transit-driver" className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div>
              <strong className="font-bold">मूलांक (Driver Number) #{simulatedDriver}:</strong> यह आपकी आंतरिक प्रतिभा, शारीरिक स्वभाव और प्राथमिक कार्यशैली का प्रतिनिधित्व करता है।
            </div>
            <span className="font-mono font-bold bg-[#D97706] text-white px-2.5 py-0.5 rounded-full text-[10px]">
              Ruling: {transitData.driverAspect.targetPlanet}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Saturn aspect on Driver */}
            <div 
              id="card-saturn-driver-aspect"
              className="p-6 rounded-3xl bg-white border border-[#E5E7EB] space-y-4 shadow-sm hover:border-[#D97706]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    शनि गोचर दृष्टि ➔ मूलांक #{simulatedDriver}
                  </span>
                  <h4 className="font-playfair font-bold text-lg text-[#1F2937]">
                    {language === 'en' ? transitData.driverAspect.saturnAspect.title : transitData.driverAspect.saturnAspect.titleHi}
                  </h4>
                  <span className="text-xs font-mono text-[#D97706]">
                    {language === 'en' ? transitData.driverAspect.saturnAspect.drishtiType : transitData.driverAspect.saturnAspect.drishtiTypeHi}
                  </span>
                </div>
                {getPolarityBadge(transitData.driverAspect.saturnAspect.polarity)}
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">
                {language === 'en' ? transitData.driverAspect.saturnAspect.impactDescription : transitData.driverAspect.saturnAspect.impactDescriptionHi}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900">
                  <strong>{language === 'en' ? 'Opportunity:' : 'अवसर (Opportunity):'}</strong> {transitData.driverAspect.saturnAspect.opportunity}
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
                  <strong>{language === 'en' ? 'Caution:' : 'सावधानी (Caution):'}</strong> {transitData.driverAspect.saturnAspect.caution}
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-indigo-900">
                  <strong>{language === 'en' ? 'Remedy:' : 'अनुशंसित उपाय (Remedy):'}</strong> {transitData.driverAspect.saturnAspect.remedy}
                </div>
              </div>
            </div>

            {/* Rahu aspect on Driver */}
            <div 
              id="card-rahu-driver-aspect"
              className="p-6 rounded-3xl bg-white border border-[#E5E7EB] space-y-4 shadow-sm hover:border-[#D97706]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    {language === 'en' ? `Rahu Transit Aspect ➔ Mulank #${simulatedDriver}` : `राहु गोचर दृष्टि ➔ मूलांक #${simulatedDriver}`}
                  </span>
                  <h4 className="font-playfair font-bold text-lg text-[#1F2937]">
                    {language === 'en' ? transitData.driverAspect.rahuAspect.title : transitData.driverAspect.rahuAspect.titleHi}
                  </h4>
                  <span className="text-xs font-mono text-indigo-700">
                    {language === 'en' ? transitData.driverAspect.rahuAspect.drishtiType : transitData.driverAspect.rahuAspect.drishtiTypeHi}
                  </span>
                </div>
                {getPolarityBadge(transitData.driverAspect.rahuAspect.polarity)}
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">
                {language === 'en' ? transitData.driverAspect.rahuAspect.impactDescription : transitData.driverAspect.rahuAspect.impactDescriptionHi}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900">
                  <strong>{language === 'en' ? 'Opportunity:' : 'अवसर (Opportunity):'}</strong> {transitData.driverAspect.rahuAspect.opportunity}
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
                  <strong>{language === 'en' ? 'Caution:' : 'सावधानी (Caution):'}</strong> {transitData.driverAspect.rahuAspect.caution}
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-indigo-900">
                  <strong>{language === 'en' ? 'Remedy:' : 'अनुशंसित उपाय (Remedy):'}</strong> {transitData.driverAspect.rahuAspect.remedy}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SubTab 3: CONDUCTOR ASPECT DETAIL */}
      {activeTab === 'CONDUCTOR' && (
        <div id="panel-transit-conductor" className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div>
              <strong className="font-bold">{language === 'en' ? `Conductor Number #${simulatedConductor}:` : `भाग्यांक (Conductor Number) #${simulatedConductor}:`}</strong> {language === 'en' ? 'Governs destiny, career trajectory and post-35 impact.' : 'यह आपकी नियति, जीवन के परम उद्देश्य, करियर दिशा और 35 वर्ष के पश्चात के प्रभाव को संचालित करता है।'}
            </div>
            <span className="font-mono font-bold bg-[#D97706] text-white px-2.5 py-0.5 rounded-full text-[10px]">
              Ruling: {transitData.conductorAspect.targetPlanet}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Saturn aspect on Conductor */}
            <div 
              id="card-saturn-conductor-aspect"
              className="p-6 rounded-3xl bg-white border border-[#E5E7EB] space-y-4 shadow-sm hover:border-[#D97706]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    {language === 'en' ? `Saturn Transit Aspect ➔ Bhagyank #${simulatedConductor}` : `शनि गोचर दृष्टि ➔ भाग्यांक #${simulatedConductor}`}
                  </span>
                  <h4 className="font-playfair font-bold text-lg text-[#1F2937]">
                    {language === 'en' ? transitData.conductorAspect.saturnAspect.title : transitData.conductorAspect.saturnAspect.titleHi}
                  </h4>
                  <span className="text-xs font-mono text-[#D97706]">
                    {language === 'en' ? transitData.conductorAspect.saturnAspect.drishtiType : transitData.conductorAspect.saturnAspect.drishtiTypeHi}
                  </span>
                </div>
                {getPolarityBadge(transitData.conductorAspect.saturnAspect.polarity)}
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">
                {language === 'en' ? transitData.conductorAspect.saturnAspect.impactDescription : transitData.conductorAspect.saturnAspect.impactDescriptionHi}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900">
                  <strong>{language === 'en' ? 'Opportunity:' : 'अवसर (Opportunity):'}</strong> {transitData.conductorAspect.saturnAspect.opportunity}
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
                  <strong>{language === 'en' ? 'Caution:' : 'सावधानी (Caution):'}</strong> {transitData.conductorAspect.saturnAspect.caution}
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-indigo-900">
                  <strong>{language === 'en' ? 'Remedy:' : 'अनुशंसित उपाय (Remedy):'}</strong> {transitData.conductorAspect.saturnAspect.remedy}
                </div>
              </div>
            </div>

            {/* Rahu aspect on Conductor */}
            <div 
              id="card-rahu-conductor-aspect"
              className="p-6 rounded-3xl bg-white border border-[#E5E7EB] space-y-4 shadow-sm hover:border-[#D97706]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    {language === 'en' ? `Rahu Transit Aspect ➔ Bhagyank #${simulatedConductor}` : `राहु गोचर दृष्टि ➔ भाग्यांक #${simulatedConductor}`}
                  </span>
                  <h4 className="font-playfair font-bold text-lg text-[#1F2937]">
                    {language === 'en' ? transitData.conductorAspect.rahuAspect.title : transitData.conductorAspect.rahuAspect.titleHi}
                  </h4>
                  <span className="text-xs font-mono text-indigo-700">
                    {language === 'en' ? transitData.conductorAspect.rahuAspect.drishtiType : transitData.conductorAspect.rahuAspect.drishtiTypeHi}
                  </span>
                </div>
                {getPolarityBadge(transitData.conductorAspect.rahuAspect.polarity)}
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">
                {language === 'en' ? transitData.conductorAspect.rahuAspect.impactDescription : transitData.conductorAspect.rahuAspect.impactDescriptionHi}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900">
                  <strong>अवसर (Opportunity):</strong> {transitData.conductorAspect.rahuAspect.opportunity}
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
                  <strong>सावधानी (Caution):</strong> {transitData.conductorAspect.rahuAspect.caution}
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 text-indigo-900">
                  <strong>अनुशंसित उपाय (Remedy):</strong> {transitData.conductorAspect.rahuAspect.remedy}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SubTab 4: TRANSIT REMEDIES & MITIGATION */}
      {activeTab === 'REMEDIES' && (
        <div id="panel-transit-remedies" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Saturn Vedic Remedy Card */}
            <div className="p-6 rounded-3xl bg-[#F8F4EF] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-600/10 text-[#D97706] rounded-xl font-mono text-sm font-bold">
                  🪐
                </span>
                <div>
                  <h4 className="font-playfair font-bold text-base text-[#1F2937]">
                    शनि गोचर शांति महा-उपाय (Saturn Alignment)
                  </h4>
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    अनुशासन, धैर्य एवं कर्म शुद्धि
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#4B5563]">
                <p className="p-3 bg-white rounded-xl border border-[#E5E7EB] leading-relaxed">
                  <strong className="text-[#1F2937] block mb-1">1. दीपदान एवं पीपल सेवा:</strong>
                  शनिवार को सूर्यास्त के बाद पीपल के वृक्ष की जड़ में सरसों के तेल का दीपक जलाएं तथा 7 परिक्रमा करें।
                </p>
                <p className="p-3 bg-white rounded-xl border border-[#E5E7EB] leading-relaxed">
                  <strong className="text-[#1F2937] block mb-1">2. वैदिक मंत्र साधना:</strong>
                  प्रतिदिन या शनिवार को <span className="font-mono font-bold text-[#D97706]">"ॐ शं शनैश्चराय नमः"</span> का 108 बार रुद्राक्ष की माला से जाप करें।
                </p>
                <p className="p-3 bg-white rounded-xl border border-[#E5E7EB] leading-relaxed">
                  <strong className="text-[#1F2937] block mb-1">3. श्रमदान एवं सेवा:</strong>
                  सफाई कर्मचारियों, श्रमिकों अथवा दिव्यांग व्यक्तियों को कभी अनादर न करें; उन्हें शनिवार को भोजन या काली वस्तुएं भेंट करें।
                </p>
              </div>
            </div>

            {/* Rahu Vedic Remedy Card */}
            <div className="p-6 rounded-3xl bg-[#F8F4EF] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-600/10 text-indigo-700 rounded-xl font-mono text-sm font-bold">
                  🐉
                </span>
                <div>
                  <h4 className="font-playfair font-bold text-base text-[#1F2937]">
                    राहु गोचर शांति महा-उपाय (Rahu Harmonization)
                  </h4>
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    भ्रम निवारण, डिजिटल विजय एवं मानसिक स्पष्टता
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#4B5563]">
                <p className="p-3 bg-white rounded-xl border border-[#E5E7EB] leading-relaxed">
                  <strong className="text-[#1F2937] block mb-1">1. भैरव या शिव उपासना:</strong>
                  रविवार अथवा बुधवार को कालभैरव या भगवान शिव की पूजा करें; ॐ नमः शिवाय का शांत मन से उच्चारण करें।
                </p>
                <p className="p-3 bg-white rounded-xl border border-[#E5E7EB] leading-relaxed">
                  <strong className="text-[#1F2937] block mb-1">2. जीव-जंतु सेवा:</strong>
                  आवारा कुत्तों को मीठी रोटी या बिस्कुट दें; पक्षियों के लिए छत पर ताज़ा जल और बाजरा/अनाज रखें।
                </p>
                <p className="p-3 bg-white rounded-xl border border-[#E5E7EB] leading-relaxed">
                  <strong className="text-[#1F2937] block mb-1">3. घर का नैऋत्य कोण (South-West):</strong>
                  घर की दक्षिण-पश्चिम दिशा को सदैव स्वच्छ एवं भारयुक्त रखें; इलेक्ट्रॉनिक कचरा और बंद घड़ियां तुरंत हटाएं।
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer disclaimer badge */}
      <div className="pt-2 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Vedic Ephemeris calculations referenced to Lahiri Ayanamsha (चित्रापक्षीय अयनांश) for 2026.</span>
        </div>
        <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
          Aspect Angles: Saturn (3°, 7°, 10°) | Rahu (5°, 7°, 9°)
        </span>
      </div>

    </div>
  );
};

export default PlanetaryTransitTracker;
