import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, Home, Briefcase, FileText, UserPlus, TrendingUp, Calendar, ChevronRight, Sparkles, Award, ShieldAlert, CheckCircle, RefreshCw, Star, ArrowRight, Info, Eye, Clock, User
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

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function PremiumConsultations() {
  const [activeModule, setActiveModule] = useState<'VEHICLE' | 'HOUSE' | 'BUSINESS' | 'SIGNATURE' | 'CHILD' | 'LUCKY_DATES'>('VEHICLE');

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

  // Expanded explanations states ("Why This Result?")
  const [showVehicleWhy, setShowVehicleWhy] = useState(false);
  const [showHouseWhy, setShowHouseWhy] = useState(false);
  const [showBusinessWhy, setShowBusinessWhy] = useState(false);
  const [showSignatureWhy, setShowSignatureWhy] = useState(false);
  const [showChildWhy, setShowChildWhy] = useState(false);
  const [showDatesWhy, setShowDatesWhy] = useState(false);

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
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Signature Style Diagnostics</h3>
              <p className="text-xs text-slate-500 font-sans">Audit how different signature trailing coordinates or ending lines directly block or accelerate career wealth flow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Select Your Current Signature Outline</label>
                {[
                  { id: 'RISING_UNDERLINE', label: '15-Degree Rising Line + Underline' },
                  { id: 'TRAILING_DOT_BELOW', label: 'First letter large + trailing dot below' },
                  { id: 'FALLING_LINE', label: 'Downward sloping trailing segment' },
                  { id: 'DOUBLE_UNDERLINE', label: 'Straight horizontal line + two support underlines' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSignatureTrigger(s.id)}
                    className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold border font-sans block transition-all cursor-pointer ${
                      signatureStyle === s.id ? 'bg-[#1E3A8A]/10 border-[#1E3A8A] text-[#1E3A8A]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {signatureResult && (
                <div className="p-6 bg-white border rounded-3xl flex flex-col justify-between space-y-4 animate-in fade-in duration-500">
                  <div className="border-b pb-3">
                    <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-2 py-0.5 rounded-full uppercase">Signature Audit Active</span>
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
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-500 space-y-1">
                        <p><strong>Vastu for Handwriting:</strong> Under Indian occult dynamics, signatures are direct outlets of self-projecting subconscious. An ascending line signals high cellular energy, while terminal dots at bottom act like locks that freeze active capital flow.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
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

      </div>
    </div>
  );
}
