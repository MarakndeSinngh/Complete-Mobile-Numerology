import React, { useState } from 'react';
import { 
  Sparkles, Compass, Phone, User, Heart, Briefcase, FileText, 
  Home, Car, Activity, Shield, Calendar, Baby, PenTool, 
  ArrowRight, Award, Layers, CheckCircle2, Star, 
  ChevronRight, TrendingUp, ShieldCheck, Lock, Gift, Zap
} from 'lucide-react';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { CompleteNumerologyProfile } from '../core/types';
import { NavPortalId, NAV_CATEGORIES } from './MasterNavigation';
import { formatDateIndian } from '../utils/dateUtils';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';
import { calculateMulank, calculateBhagyank } from '../core/numerologyEngine';
import { calculateKuaNumber } from '../core/kuaEngine';
import { buildBirthGrid } from '../core/loshuEngine';

interface MasterDashboardHubProps {
  personalDetails: PersonalDetails | null;
  dobData: DOBAnalysis | null;
  nameData: NameAnalysis | null;
  mobileData: MobileAnalysis | null;
  remedies: remediesAdvice | null;
  profile: CompleteNumerologyProfile | null;
  onNavigate: (portalId: NavPortalId) => void;
  onOpenProfileModal: () => void;
}

export const MasterDashboardHub: React.FC<MasterDashboardHubProps> = ({
  personalDetails,
  dobData,
  nameData,
  mobileData,
  remedies,
  profile,
  onNavigate,
  onOpenProfileModal,
}) => {
  const { t, language } = useLanguage();

  // Local instant calculator state for first-time visitors
  const [calcName, setCalcName] = useState(personalDetails?.name || '');
  const [calcDob, setCalcDob] = useState(personalDetails?.dob ? personalDetails.dob.slice(0, 10) : '');
  const [calcMobile, setCalcMobile] = useState(personalDetails?.mobile || '');
  const [calcGender, setCalcGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>((personalDetails?.gender as any) || 'MALE');
  const [isCalculating, setIsCalculating] = useState(false);
  const [localResult, setLocalResult] = useState<{
    mulank: number;
    bhagyank: number;
    kua: number;
    grid: Record<number, number>;
    mobileTotal?: number;
    mobileSingle?: number;
  } | null>(null);

  const handleInstantCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcDob) return;
    setIsCalculating(true);

    try {
      const dateParts = calcDob.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);

        const mulankVal = calculateMulank(calcDob);
        const bhagyankVal = calculateBhagyank(calcDob);
        const kuaRes = calculateKuaNumber(year, calcGender === 'FEMALE' ? 'FEMALE' : 'MALE');
        const gridObj = buildBirthGrid(calcDob);

        let mobTotal = 0;
        let mobSingle = 0;
        if (calcMobile && calcMobile.length >= 10) {
          const digits = calcMobile.replace(/\D/g, '');
          mobTotal = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
          let sum = mobTotal;
          while (sum > 9) {
            sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
          }
          mobSingle = sum;
        }

        setLocalResult({
          mulank: mulankVal,
          bhagyank: bhagyankVal,
          kua: kuaRes.kuaNumber,
          grid: gridObj,
          mobileTotal: mobTotal || undefined,
          mobileSingle: mobSingle || undefined,
        });
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setTimeout(() => {
        setIsCalculating(false);
      }, 300);
    }
  };

  // Scroll to calculator
  const scrollToCalculator = () => {
    const el = document.getElementById('free-calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to free tools
  const scrollToFreeTools = () => {
    const el = document.getElementById('free-tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-14 animate-in fade-in duration-500 font-sans max-w-7xl mx-auto">
      
      {/* 1. HERO BANNER - EXACT SPECIFICATION */}
      <div className="rounded-[36px] p-8 md:p-12 lg:p-14 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white border border-[#D97706]/30 shadow-2xl relative overflow-hidden">
        {/* Subtle Celestial Geometry Background */}
        <div className="absolute -top-12 -right-12 w-96 h-96 opacity-15 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#F59E0B] rotate-12">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,4 96,50 50,96 4,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,14 86,50 50,86 14,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="lg" />
            {/* Small Official Badge */}
            <div className="inline-flex items-center gap-2 bg-[#D97706]/20 px-3.5 py-1.5 rounded-full border border-[#D97706]/40 text-[#FBBF24] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> भारतीय वैदिक एवं चाल्डियन अंकशास्त्र
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-playfair text-[#FDFBF7] leading-[1.15] text-balance">
            अपने अंकों और जीवन के पैटर्न को <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]">बेहतर समझें</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-stone-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl font-light">
            LeoFamily के साथ अपना Free Analysis शुरू करें और चाहें तो Complete Personalized Master Report unlock करें।
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={scrollToCalculator}
              className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold px-7 py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-900/30 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="w-4 h-4 text-amber-200" />
              <span>FREE ANALYSIS शुरू करें</span>
            </button>

            <button
              onClick={scrollToFreeTools}
              className="bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-semibold px-6 py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>FREE TOOLS देखें</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FREE INSTANT CALCULATOR & RESULT EXPERIENCE */}
      <div id="free-calculator-section" className="bg-white border border-[#E7E5E4] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#D97706] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Gift className="w-3.5 h-3.5" /> 100% Free Instant Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-stone-900">
            अपनी जन्मतिथि दर्ज करें और तुरंत परिणाम पाएं
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            मूलांक, भाग्यांक, वास्तु ऊर्जा (कुआ अंक), 3x3 लो शू ग्रिड और मोबाइल वाइब्रेशन की सटीक गणना
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleInstantCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              पूरा नाम (Full Name)
            </label>
            <input
              type="text"
              value={calcName}
              onChange={(e) => setCalcName(e.target.value)}
              placeholder="उदा. राहुल शर्मा"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              जन्मतिथि (Date of Birth) *
            </label>
            <input
              type="date"
              required
              value={calcDob}
              onChange={(e) => setCalcDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              मोबाइल नंबर (10 Digit Mobile)
            </label>
            <input
              type="tel"
              maxLength={10}
              value={calcMobile}
              onChange={(e) => setCalcMobile(e.target.value)}
              placeholder="उदा. 9876543210"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isCalculating || !calcDob}
              className="w-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCalculating ? (
                <span>गणना जारी है...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>अभी Calculate करें</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Free Instant Results Container */}
        {(localResult || (personalDetails && dobData)) && (
          <div className="bg-[#FAF8F5] border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
                  Your Free LeoFamily Analysis
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-playfair text-stone-900">
                  {calcName || personalDetails?.name || 'जिज्ञासु'} — मुख्य ग्रहीय ऊर्जा चक्र
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                DOB: {formatDateIndian(calcDob || personalDetails?.dob || '')}
              </span>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-xs text-stone-500 font-medium block">मूलांक (Driver / Root)</span>
                <span className="text-3xl font-extrabold text-[#D97706] block my-1">
                  {localResult?.mulank || dobData?.birthNumber}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">आत्म चेतना व स्वभाव</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-xs text-stone-500 font-medium block">भाग्यांक (Conductor / Destiny)</span>
                <span className="text-3xl font-extrabold text-[#1E3A8A] block my-1">
                  {localResult?.bhagyank || dobData?.lifePathNumber}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">कर्म व जीवन दिशा</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-xs text-stone-500 font-medium block">कुआ अंक (Kua / Vastu)</span>
                <span className="text-3xl font-extrabold text-emerald-700 block my-1">
                  {localResult?.kua || dobData?.kuaNumber || '—'}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">वास्तु ऊर्जा व अनुकूल दिशा</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-xs text-stone-500 font-medium block">मोबाइल वाइब्रेशन (Root)</span>
                <span className="text-3xl font-extrabold text-purple-700 block my-1">
                  {localResult?.mobileSingle || mobileData?.singleDigit || mobileData?.reducedTotal || '—'}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">चाल्डियन ध्वनि तरंग</span>
              </div>
            </div>

            {/* Lo Shu Grid Preview */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1 text-left max-w-md">
                <h4 className="font-bold text-base text-stone-900 font-playfair">
                  3x3 लो शू ग्रिड जन्म चक्र (Lo Shu Grid)
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  आपके जन्म अंकों के आधार पर 8 विशेष योग (मानसिक, भावनात्मक, व्यावहारिक, सफलता, इच्छा शक्ति) का विश्लेषण।
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 bg-stone-900 p-2 rounded-xl border border-stone-800 shadow-inner">
                {[
                  [4, 9, 2],
                  [3, 5, 7],
                  [8, 1, 6],
                ].flat().map((num) => {
                  const count = localResult?.grid?.[num] || 0;
                  const isPresent = count > 0;
                  return (
                    <div
                      key={num}
                      className={`w-11 h-11 flex flex-col items-center justify-center rounded-lg text-xs font-bold ${
                        isPresent
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-xs'
                          : 'bg-stone-800 text-stone-500 border border-stone-700/50'
                      }`}
                    >
                      <span>{num}</span>
                      {isPresent && count > 1 && (
                        <span className="text-[9px] font-mono opacity-80 leading-none">x{count}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => onNavigate('CORE_LOSHU')}
                className="whitespace-nowrap bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>लो शू ग्रिड पूरा देखें (FREE)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. PROBLEM-BASED GUIDANCE ENTRY ("आप किस विषय में Guidance चाहते हैं?") */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-widest font-mono">
            Problem-Centric Life Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-playfair text-stone-900">
            आप किस विषय में Guidance चाहते हैं?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            अपने जीवन के प्रमुख क्षेत्र का चयन करें और उस विषय की विशेष अंकशास्त्रीय गणना देखें
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'career',
              title: 'करियर और आजीविका',
              subtitle: 'Career & Profession',
              desc: 'अनुकूल कार्यक्षेत्र, नौकरी, प्रमोशन व सफलता के वर्ष',
              icon: <Briefcase className="w-5 h-5 text-blue-600" />,
              target: 'CORE_DASHBOARD' as NavPortalId,
              color: 'hover:border-blue-300 hover:bg-blue-50/40',
            },
            {
              id: 'money',
              title: 'धन और वित्तीय समृद्धि',
              subtitle: 'Money & Wealth',
              desc: 'धन संचय योग, लक्ष्मी आकर्षण अंक एवं वित्तीय स्थिरता',
              icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
              target: 'CORE_LOSHU' as NavPortalId,
              color: 'hover:border-emerald-300 hover:bg-emerald-50/40',
            },
            {
              id: 'love',
              title: 'प्रेम और संबंध',
              subtitle: 'Love & Relationship',
              desc: 'भावनात्मक तालमेल, आकर्षण व संबंध सामंजस्य',
              icon: <Heart className="w-5 h-5 text-rose-600" />,
              target: 'MARRIAGE_COMPATIBILITY' as NavPortalId,
              color: 'hover:border-rose-300 hover:bg-rose-50/40',
            },
            {
              id: 'marriage',
              title: 'विवाह व गुण मिलान',
              subtitle: 'Marriage Compatibility',
              desc: 'अंक मिलान, दांपत्य सुख व विवाह हेतु श्रेष्ठ समय',
              icon: <Activity className="w-5 h-5 text-pink-600" />,
              target: 'MARRIAGE_COMPATIBILITY' as NavPortalId,
              color: 'hover:border-pink-300 hover:bg-pink-50/40',
            },
            {
              id: 'business',
              title: 'व्यवसाय और व्यापार नाम',
              subtitle: 'Business & Brand Name',
              desc: 'फर्म का नाम, पार्टनरशिप मैच व ब्रांड सफलता वाइब्रेशन',
              icon: <Building2Icon className="w-5 h-5 text-amber-600" />,
              target: 'PREMIUM_BUSINESS' as NavPortalId,
              color: 'hover:border-amber-300 hover:bg-amber-50/40',
            },
            {
              id: 'family',
              title: 'पारिवारिक सुख व संतान',
              subtitle: 'Family & Children',
              desc: 'गृह शांति, बच्चों का नामकरण व पारिवारिक सामंजस्य',
              icon: <Baby className="w-5 h-5 text-indigo-600" />,
              target: 'PREMIUM_CHILD' as NavPortalId,
              color: 'hover:border-indigo-300 hover:bg-indigo-50/40',
            },
            {
              id: 'growth',
              title: 'व्यक्तिगत विकास व दिशा',
              subtitle: 'Personal Growth & Destiny',
              desc: 'जीवन का उद्देश्य, भाग्यशाली दिशा, रंग व रत्न',
              icon: <Compass className="w-5 h-5 text-teal-600" />,
              target: 'PREMIUM_DASHA' as NavPortalId,
              color: 'hover:border-teal-300 hover:bg-teal-50/40',
            },
            {
              id: 'life',
              title: 'सम्पूर्ण 360° जीवन चक्र',
              subtitle: 'Master 360° Life Dossier',
              desc: '32 अध्यायों में जीवन का समग्र वैदिक व चाल्डियन विश्लेषण',
              icon: <Award className="w-5 h-5 text-purple-600" />,
              target: 'MASTER_REPORT' as NavPortalId,
              color: 'hover:border-purple-300 hover:bg-purple-50/40',
            },
          ].map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.target)}
              className={`p-5 rounded-2xl bg-white border border-stone-200 text-left transition-all duration-200 shadow-xs flex flex-col justify-between group cursor-pointer ${card.color}`}
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 inline-block">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900 font-playfair group-hover:text-[#D97706] transition">
                    {card.title}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-medium block">
                    {card.subtitle}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-[#D97706] group-hover:translate-x-0.5 transition">
                <span>विस्तार से देखें</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. FREE PUBLIC TOOLS HIGHLIGHT SECTION */}
      <div id="free-tools-section" className="bg-[#FAF8F5] border border-amber-200/80 rounded-3xl p-8 md:p-10 space-y-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> 100% Free Public Calculators
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-playfair text-stone-900">
              निःशुल्क जनहित अंकशास्त्रीय टूल्स
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md">
            ये टूल्स सभी के लिए पूरी तरह मुफ़्त (FREE) उपलब्ध हैं। बिना किसी शुल्क के तुरंत उपयोग करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Public Tool 1: Mobile Numerology */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                  FREE / मुफ़्त
                </span>
              </div>
              <h3 className="text-lg font-bold font-playfair text-stone-900">
                मोबाइल अंकशास्त्र विश्लेषण (Mobile Numerology)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                आपके 10-अंकीय फोन नंबर की चाल्डियन ध्वनि तरंगें, मित्र-शत्रु ग्रहीय युति और सकारात्मक/नकारात्मक संख्या जोड़े का समग्र परीक्षण।
              </p>
            </div>
            <button
              onClick={() => onNavigate('MOBILE_NUMEROLOGY')}
              className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>अभी Calculate करें (FREE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Public Tool 2: Lo Shu Grid */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-amber-50 text-[#D97706]">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                  FREE / मुफ़्त
                </span>
              </div>
              <h3 className="text-lg font-bold font-playfair text-stone-900">
                लो शू ग्रिड एवं 8 योग (Lo Shu 3x3 Grid)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                3x3 वैदिक जन्म चक्र के माध्यम से मानसिक तल, भावनात्मक तल, व्यावहारिक तल, राजयोग तथा रिक्त अंकों के प्रभाव का सटीक विवरण।
              </p>
            </div>
            <button
              onClick={() => onNavigate('CORE_LOSHU')}
              className="w-full bg-[#1E3A8A] hover:bg-[#1e293b] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>अभी Calculate करें (FREE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. PREMIUM MASTER REPORT PRODUCT SHOWCASE & 12 LOCKED PREVIEWS */}
      <div className="bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white rounded-3xl p-8 md:p-12 space-y-10 border border-amber-600/30 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" /> 32-Chapter Master Life Dossier
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-playfair text-white">
              LeoFamily Complete Master Report
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              आपकी जन्मतिथि, नाम, फोन और ग्रहीय युतियों पर आधारित भारत की सर्वाधिक विस्तृत 32-अध्यायों वाली व्यक्तिगत मार्गदर्शिका।
            </p>
          </div>

          <button
            onClick={() => onNavigate('MASTER_REPORT')}
            className="whitespace-nowrap bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold px-8 py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Lock className="w-4 h-4 text-stone-900" />
            <span>COMPLETE REPORT UNLOCK करें</span>
          </button>
        </div>

        {/* 12 Master Report Chapter Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            {
              id: 'p1',
              title: 'व्यक्तित्व व स्वभाव विश्लेषण',
              en: 'Detailed Personality Analysis',
              desc: 'मूलांक, भाग्यांक व जन्म तिथि की गहरी मनोवैज्ञानिक व्याख्या।',
            },
            {
              id: 'p2',
              title: 'करियर व अनुकूल व्यवसाय',
              en: 'Career & Profession Matrix',
              desc: 'ग्रहानुकूल आजीविका, पदोन्नति के वर्ष एवं कार्यक्षेत्र संरेखण।',
            },
            {
              id: 'p3',
              title: 'धन व वित्तीय समृद्धि योग',
              en: 'Finance & Wealth Blueprint',
              desc: 'धन संचय, आय के स्रोत एवं आर्थिक जोखिम से बचाव की रणनीति।',
            },
            {
              id: 'p4',
              title: 'विवाह, दांपत्य व संबंध',
              en: 'Marriage & Relationship Synastry',
              desc: 'जीवनसाथी से अनुकूलता, दांपत्य सुख व संबंधों में तालमेल।',
            },
            {
              id: 'p5',
              title: 'मोबाइल 81 जोड़ी गहन विश्लेषण',
              en: 'Mobile 81-Pair Deep Matrix',
              desc: 'फोन नंबर के सभी 9 संयोजनों का शुभ-अशुभ वैज्ञानिक वर्गीकरण।',
            },
            {
              id: 'p6',
              title: 'लो शू ग्रिड 8 तल व रिक्त अंक',
              en: 'Lo Shu 8 Planes & Missing Numbers',
              desc: 'कमजोर तलों को सक्रिय करने एवं रिक्त अंकों के वैदिक उपाय।',
            },
            {
              id: 'p7',
              title: '81 वैदिक ग्रहीय युति फल',
              en: '81 Vedic Combinations Analysis',
              desc: 'सूर्य, चंद्र, गुरु, शनि आदि का मूलांक-भाग्यांक पर प्रभाव।',
            },
            {
              id: 'p8',
              title: 'अंक वास्तु व दिशा संतुलन',
              en: 'Numero Vastu Alignment',
              desc: 'कुआं अंक अनुसार मुख्य द्वार, शयनकक्ष व कार्यस्थल की दिशा।',
            },
            {
              id: 'p9',
              title: 'नाम व व्यावसायिक ब्रांड शुद्धि',
              en: 'Name & Business Brand Tuning',
              desc: 'चाल्डियन व पाइथागोरियन पद्धति से नाम की पूर्ण स्पेलिंग शुद्धि।',
            },
            {
              id: 'p10',
              title: 'महादशा, अंतर्दशा व 9 वर्षीय चक्र',
              en: 'Cyclic Dasha & Yearly Forecast',
              desc: 'वर्तमान में सक्रिय ग्रह कालखंड एवं आगामी वर्षों का भविष्यफल।',
            },
            {
              id: 'p11',
              title: 'वैदिक मंत्र, यंत्र व रत्न उपाय',
              en: 'Authentic Remedies & Gemstones',
              desc: 'सुरक्षित एवं प्रामाणिक वैदिक समाधान, मंत्र व धातु परामर्श।',
            },
            {
              id: 'p12',
              title: '90-दिवसीय कार्य योजना',
              en: '90-Day Action Plan',
              desc: 'दैनिक जीवन में सकारात्मक बदलाव लाने हेतु चरणबद्ध मार्गदर्शन।',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-stone-800 text-amber-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    Chapter
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-100 font-playfair">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-stone-400 block">{item.en}</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('MASTER_REPORT')}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Unlock In Master Report</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. HOW IT WORKS (LeoFamily कैसे काम करता है?) */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-8 md:p-12 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-widest font-mono">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-playfair text-stone-900">
            LeoFamily कैसे काम करता है?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            सरल, प्रामाणिक और त्वरित — अपनी पूरी अंकशास्त्रीय यात्रा को समझें
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'अपनी Details दें',
              desc: 'नाम, जन्मतिथि, लिंग एवं मोबाइल नंबर दर्ज करें।',
              icon: <User className="w-5 h-5 text-[#D97706]" />,
            },
            {
              step: '02',
              title: 'Free Analysis पाएं',
              desc: 'मूलांक, भाग्यांक, वास्तु ऊर्जा व लो शू ग्रिड का तुरंत निःशुल्क परिणाम देखें।',
              icon: <Sparkles className="w-5 h-5 text-[#1E3A8A]" />,
            },
            {
              step: '03',
              title: 'Complete Report Unlock करें',
              desc: 'गहन 32 अध्यायों वाली संपूर्ण व्यक्तिगत मास्टर रिपोर्ट को अनलॉक करें।',
              icon: <Lock className="w-5 h-5 text-emerald-700" />,
            },
            {
              step: '04',
              title: 'Personalized Guidance देखें',
              desc: 'ऑनलाइन डिजिटल डैशबोर्ड एवं प्रिंटेबल A4 PDF के रूप में स्थायी मार्गदर्शन पाएं।',
              icon: <Award className="w-5 h-5 text-purple-700" />,
            },
          ].map((s) => (
            <div key={s.step} className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-xs">
                  {s.icon}
                </div>
                <span className="text-2xl font-extrabold font-playfair text-stone-300">
                  {s.step}
                </span>
              </div>
              <h3 className="font-bold text-base text-stone-900 font-playfair">
                {s.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. FACTUAL TRUST SECTION */}
      <div className="bg-white border border-[#E7E5E4] rounded-3xl p-8 md:p-10 space-y-6 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-widest font-mono">
            Authentic Heritage & Security
          </span>
          <h2 className="text-2xl font-bold font-playfair text-stone-900">
            प्रामाणिक वैदिक एवं चाल्डियन सिद्धांत
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            गणितीय शुद्धता, प्राचीन संहिता एवं आधुनिक तकनीक का विश्वसनीय संगम
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center mx-auto">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-800 font-playfair">प्रामाणिक गणितीय नियम</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              वैदिक मूलांक, भाग्यांक व चाल्डियन ध्वनि कंपन के स्वीकृत गणितीय नियमों पर आधारित।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-800 font-playfair">5 भारतीय भाषाएं</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              हिंदी, अंग्रेज़ी, मराठी, बंगाली व गुजराती में सुगम और स्पष्ट भाषा में मार्गदर्शन।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-800 font-playfair">256-बिट सुरक्षित खाता</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Supabase Auth एवं एन्क्रिप्टेड डेटाबेस के साथ आपकी व्यक्तिगत जानकारी पूर्णतः गोपनीय।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-800 font-playfair">उच्च गुणवत्ता A4 PDF</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              जीवनभर सुरक्षित रखने योग्य हाई-डेफिनिशन 14-32 पृष्ठीय प्रिंटेबल A4 PDF रिपोर्ट।
            </p>
          </div>
        </div>
      </div>

      {/* 8. OPTIONAL VEDIC EXPERT CONSULTATION HUB */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-100">
            <Sparkles className="w-3.5 h-3.5" /> Optional Next Step
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-playfair">
            वैदिक परामर्श केंद्र (Vedic Consultation Hub)
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            यदि आप अपनी रिपोर्ट के बाद किसी विशिष्ट प्रश्न या जीवन निर्णय पर मार्गदर्शन चाहते हैं, तो हमारे विशेषज्ञ परामर्श केंद्र से परामर्श प्राप्त करें।
          </p>
        </div>

        <button
          onClick={() => onNavigate('AI_CONSULTATION')}
          className="whitespace-nowrap bg-white hover:bg-amber-50 text-amber-900 font-bold px-8 py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>परामर्श केंद्र देखें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

// Helper icon component for Building2
function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
