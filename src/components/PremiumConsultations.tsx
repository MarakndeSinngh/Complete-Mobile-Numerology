import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, Home, Briefcase, FileText, UserPlus, TrendingUp, Calendar, ChevronRight, Sparkles, Award, ShieldAlert, CheckCircle, RefreshCw
} from 'lucide-react';
import { 
  analyzeVehicleNumerology, 
  analyzeHouseNumerology, 
  analyzeBusinessNumerology, 
  generateChildNumerology, 
  generateLuckyDatesForMonth, 
  VehicleReport, 
  HouseReport, 
  BusinessReport, 
  ChildReport 
} from '../services/premiumModules';

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function PremiumConsultations() {
  const [activeModule, setActiveModule] = useState<'VEHICLE' | 'HOUSE' | 'BUSINESS' | 'SIGNATURE' | 'CHILD' | 'CAREER' | 'LUCKY_DATES'>('VEHICLE');

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
  const [signatureReason, setSignatureReason] = useState<string>('');

  const [childDob, setChildDob] = useState('');
  const [childResult, setChildResult] = useState<ChildReport | null>(null);

  const [careerDriver, setCareerDriver] = useState<number>(1);
  const [careerConductor, setCareerConductor] = useState<number>(1);
  const [careerResultsList, setCareerResultsList] = useState<string[]>([]);

  const [luckyDatesDriver, setLuckyDatesDriver] = useState<number>(1);
  const [luckyDatesConductor, setLuckyDatesConductor] = useState<number>(1);
  const [luckyDatesResult, setLuckyDatesResult] = useState<number[]>([]);

  // Handlers
  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiclePlate.trim()) return;
    const report = analyzeVehicleNumerology(vehiclePlate, vehicleDriver);
    setVehicleResult(report);
  };

  const handleHouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseNumber.trim()) return;
    const report = analyzeHouseNumerology(houseNumber);
    setHouseResult(report);
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    const report = analyzeBusinessNumerology(businessName, businessDriver);
    setBusinessResult(report);
  };

  const handleSignatureTrigger = (style: string) => {
    setSignatureStyle(style);
    if (style === 'RISING_UNDERLINE') {
      setSignatureReason('The rising angle (15 degrees) with a solid underline represents high ambition, self-reliance, and outstanding financial shielding. It ensures you complete projects on schedule.');
    } else if (style === 'TRAILING_DOT_BELOW') {
      setSignatureReason('Fosters sudden unexpected delays and creates persistent financial blockages. Placing a single dot at the end acts like a full-stop to cosmic opportunities.');
    } else if (style === 'FALLING_LINE') {
      setSignatureReason('Reflects falling confidence levels and severe loss of workspace control. It indicates that you easily get overwhelmed by adverse peer feedback.');
    } else {
      setSignatureReason('Very stable and secure. The double underline serves as a continuous support cushion for family life. Excellent for administrative consultants!');
    }
  };

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childDob) return;
    const report = generateChildNumerology(childDob);
    setChildResult(report);
  };

  const handleCareerTrigger = () => {
    const list: string[] = [];
    if (careerDriver === 1 || careerConductor === 1) {
      list.push('Government Contracts and Administration', 'Gold Crafting and Wholesale Gems Jewelries', 'Independent Brand Founder/CEO roles', 'Medical Research and High-level Surgeries');
    }
    if (careerDriver === 3 || careerConductor === 3) {
      list.push('Educational Institutes and Noble Consultancies', 'Legal Advisorship, Judiciary Chambers', 'Finances Direction and Stock Auditing', 'Occult Sciences, Astrology & Philosophy');
    }
    if (careerDriver === 5 || careerConductor === 5) {
      list.push('Rapid Import Export, Trading Houses', 'Digital Media, Public Relations Directorship', 'Software Application Architecture', 'Brokering Agencies and Stock Exchange Market');
    }
    if (list.length === 0) {
      list.push('Luxury Hospitality, Premium Interior Decor', 'Structural Property Development / Logistics', 'Chemical Research & Iron Metallurgy Factories', 'Artistic Design, High-class Textile Brands');
    }
    setCareerResultsList(list);
  };

  const handleLuckyDatesTrigger = () => {
    const dates = generateLuckyDatesForMonth(luckyDatesDriver, luckyDatesConductor, 1, 2026);
    setLuckyDatesResult(dates);
  };

  return (
    <div id="premium-consultations-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Sidebar Selector */}
      <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-playfair text-lg font-bold text-slate-800">Premium Consultation Modules</h3>
          <p className="text-[10px] text-[#D97706] uppercase tracking-widest font-mono font-bold mt-1">7 Traditional Chaldean Tools</p>
        </div>
        <div className="space-y-2 border-t border-slate-100 pt-4">
          {[
            { id: 'VEHICLE', label: 'Vehicle Numerology', icon: Car },
            { id: 'HOUSE', label: 'House / Flat Numerology', icon: Home },
            { id: 'BUSINESS', label: 'Business Firm Name Suite', icon: Briefcase },
            { id: 'SIGNATURE', label: 'Signature Style Audit', icon: FileText },
            { id: 'CHILD', label: 'Child Auspicious Names', icon: UserPlus },
            { id: 'CAREER', label: 'Career Sector Profiler', icon: TrendingUp },
            { id: 'LUCKY_DATES', label: 'Auspicious Date Finder', icon: Calendar },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id as any)}
              className={`w-full text-left py-3 px-4 rounded-2xl text-xs font-bold font-sans flex items-center justify-between transition-all duration-300 cursor-pointer ${
                activeModule === m.id
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'bg-transparent text-slate-650 hover:bg-[#F2E8DC]/50'
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
      <div className="lg:col-span-8 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[40px] p-8 md:p-10 shadow-sm min-h-[500px]">
        
        {activeModule === 'VEHICLE' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Vehicle Plate Numerology Analysis</h3>
              <p className="text-xs text-slate-500 font-sans">Calculate cumulative Chaldean vibrations of your car or bike license plate.</p>
            </div>

            <form onSubmit={handleVehicleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Vehicle Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH12AB1234"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Your Driver Number</label>
                <select
                  value={vehicleDriver}
                  onChange={(e) => setVehicleDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold text-xs uppercase cursor-pointer"
              >
                Scan Plate Compatibility
              </button>
            </form>

            {vehicleResult && (
              <div className="p-6 bg-white border rounded-3xl space-y-4 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-2 py-0.5 rounded-full uppercase">Chaldean Sum: {vehicleResult.totalSum}</span>
                    <h4 className="font-playfair text-base font-bold text-slate-800">Root Value: {vehicleResult.reducedTotal}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    vehicleResult.suitability === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-600' :
                    vehicleResult.suitability === 'AVOID' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                  }`}>{vehicleResult.suitability}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{vehicleResult.meaning}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/50">
                    <strong className="text-rose-800 text-xs flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Vulnerability:</strong>
                    <p className="text-[11px] text-slate-500 mt-1">{vehicleResult.vulnerability}</p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                    <strong className="text-emerald-800 text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Remedy Practise:</strong>
                    <p className="text-[11px] text-slate-500 mt-1">{vehicleResult.remedy}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeModule === 'HOUSE' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">House / Flat Number Vastu</h3>
              <p className="text-xs text-slate-500 font-sans">Find the core planetary vibrations and remedies of your apartment or plot.</p>
            </div>

            <form onSubmit={handleHouseSubmit} className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">House / Apartment Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-101 or 403"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase cursor-pointer self-end h-[46px]"
              >
                Find Vastu
              </button>
            </form>

            {houseResult && (
              <div className="p-6 bg-white border rounded-3xl space-y-4 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-600 font-extrabold px-2 py-0.5 rounded-full uppercase">Type Vibe: {houseResult.vibe}</span>
                    <h4 className="font-playfair text-base font-bold text-slate-800">Flat Root Number: {houseResult.reducedTotal}</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-sans font-bold">{houseResult.meaning}</p>
                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-2 leading-relaxed">
                  <p><strong>Vastu Advice:</strong> {houseResult.advice}</p>
                  <p className="text-amber-800"><strong>Mandir Remedy:</strong> {houseResult.remedy}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeModule === 'BUSINESS' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Business Firm Name Numerology</h3>
              <p className="text-xs text-slate-500 font-sans">Evaluate if your corporate brand name aligns with your birth blueprint.</p>
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
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Your Driver Number</label>
                <select
                  value={businessDriver}
                  onChange={(e) => setBusinessDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold text-xs uppercase cursor-pointer"
              >
                Scan Corporate Vibration
              </button>
            </form>

            {businessResult && (
              <div className="p-6 bg-white border rounded-3xl space-y-4 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-2 py-0.5 rounded-full uppercase">Chaldean Name Value: {businessResult.chaldeanTotal}</span>
                    <h4 className="font-playfair text-base font-bold text-slate-800">Business Expression: {businessResult.reducedTotal}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    businessResult.suitability === 'OUTSTANDING' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>{businessResult.suitability} Suitability</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{businessResult.meaning}</p>
                <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-2">
                  <p><strong>Auspicious Industries:</strong> {businessResult.industrySuitability}</p>
                  <p className="text-indigo-800"><strong>Corporate expansion tip:</strong> {businessResult.expansionTip}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeModule === 'SIGNATURE' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Signature Style Diagnostics</h3>
              <p className="text-xs text-slate-500 font-sans">Audit how different signature trailing parameters directly block or streamline career wealth flow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Select Your Signature Template</label>
                {[
                  { id: 'RISING_UNDERLINE', label: '15-Degree Rising Line + Underline' },
                  { id: 'TRAILING_DOT_BELOW', label: 'First letter large + trailing dot below' },
                  { id: 'FALLING_LINE', label: 'Downward sloping trailing segment' },
                  { id: 'DOUBLE_UNDERLINE', label: 'Straight horizontal line + two support underline bars' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSignatureTrigger(s.id)}
                    className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold border font-sans block transition-all ${
                      signatureStyle === s.id ? 'bg-[#D97706]/10 border-[#D97706] text-[#D97706]' : 'bg-white border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="p-6 bg-white border rounded-3xl flex flex-col justify-center min-h-[220px]">
                {signatureReason ? (
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-600 font-extrabold px-2 py-0.5 rounded-full uppercase">Signature Audit Complete</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{signatureReason}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-450 italic text-center font-sans">Select a template signature block on the left to review cosmic remedies instantly.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeModule === 'CHILD' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Auspicious Starting Baby Name Alphabets</h3>
              <p className="text-xs text-slate-500 font-sans">Generate best starting name alphabets based on the baby's birth driver and conductors.</p>
            </div>

            <form onSubmit={handleChildSubmit} className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Child's Date of Birth (Psychic Setup)</label>
                <input
                  type="date"
                  required
                  value={childDob}
                  onChange={(e) => setChildDob(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase cursor-pointer self-end h-[46px]"
              >
                Scan DOB
              </button>
            </form>

            {childResult && (
              <div className="p-6 bg-white border rounded-3xl space-y-4 animate-in fade-in duration-500">
                <span className="text-[9px] font-mono bg-indigo-50 text-[#1E3A8A] font-extrabold px-2 py-0.5 rounded-full uppercase">Computed: Driver {childResult.birthDriver} | Conductor {childResult.birthConductor}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-800 text-xs">Auspicious Alphabets:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {childResult.startingAlphabets.map((a, idx) => <span key={idx} className="bg-white border text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold font-mono">{a}</span>)}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <strong className="text-rose-800 text-xs">Cautionary Alphabets (Avoid):</strong>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {childResult.cautionaryAlphabets.map((a, idx) => <span key={idx} className="bg-white border text-rose-700 px-2 py-0.5 rounded text-[11px] font-bold font-mono">{a}</span>)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans mt-2"><strong>Destined Career Path:</strong> {childResult.careerPrecedence}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeModule === 'CAREER' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Career Segment Profiler</h3>
              <p className="text-xs text-slate-500 font-sans">Find target-friendly business and administrative fields aligned with your psychic/destiny numbers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Driver Number</label>
                <select
                  value={careerDriver}
                  onChange={(e) => setCareerDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Conductor Number</label>
                <select
                  value={careerConductor}
                  onChange={(e) => setCareerConductor(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Conductor {n}</option>)}
                </select>
              </div>
              <button
                onClick={handleCareerTrigger}
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold text-xs uppercase cursor-pointer"
              >
                Scan Career Sectors
              </button>
            </div>

            {careerResultsList.length > 0 && (
              <div className="p-6 bg-white border rounded-3xl space-y-4 animate-in fade-in duration-500">
                <strong className="text-slate-800 text-xs uppercase font-mono">Highly Recommended Sectors:</strong>
                <ul className="space-y-2 font-sans text-xs text-slate-650 leading-relaxed list-inside list-disc">
                  {careerResultsList.map((item, idx) => <li key={idx} className="text-slate-700">{item}</li>)}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {activeModule === 'LUCKY_DATES' && (
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="border-b border-[#F2E8DC] pb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1E3A8A]">Personalized Lucky Date Finder</h3>
              <p className="text-xs text-slate-500 font-sans">Find the top supportive dates in the year based on your driver and conductor frequencies.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Driver Number</label>
                <select
                  value={luckyDatesDriver}
                  onChange={(e) => setLuckyDatesDriver(parseInt(e.target.value, 10))}
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-3 pr-4 pr-4 pl-4 rounded-xl text-sm font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Driver {n}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Conductor Number</label>
                <select
                  value={luckyDatesConductor}
                  onChange={(e) => setLuckyDatesConductor(parseInt(e.target.value, 10))}
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-3 pr-4 pr-4 pl-4 rounded-xl text-sm font-sans"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>Conductor {n}</option>)}
                </select>
              </div>
              <button
                onClick={handleLuckyDatesTrigger}
                className="col-span-1 sm:col-span-2 w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold text-xs uppercase cursor-pointer"
              >
                Find My Dates
              </button>
            </div>

            {luckyDatesResult.length > 0 && (
              <div className="p-6 bg-white border rounded-3xl space-y-4 animate-in fade-in duration-500">
                <strong className="text-slate-800 text-xs uppercase font-mono">Your Premium Days of Any Month:</strong>
                <div className="flex flex-wrap gap-2 pt-2">
                  {luckyDatesResult.map(day => (
                    <span key={day} className="bg-amber-500/10 border border-amber-500/30 text-amber-950 font-bold px-3 py-1.5 rounded-xl font-mono text-xs">
                      {day}th
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-450 italic pt-1 leading-relaxed font-sans">These dates bypass standard negative intervals. Excellent to sign business leases, buy gold, schedule wedding registrations, or launch digital websites.</p>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
