import React, { useState } from 'react';
import { 
  Sparkles, Compass, Phone, User, Heart, Briefcase, FileText, 
  Home, Car, Activity, Shield, Calendar, Baby, PenTool, 
  ArrowRight, Award, Layers, CheckCircle2, Star, 
  ChevronRight, TrendingUp, ShieldCheck, Lock, Gift, Zap,
  Check, AlertCircle, Eye, Download, Printer
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
import { calculatePersonalYearNumber } from '../core/luckyDatesEngine';
import { REPORT_REGISTRY } from '../types/reportAccess';

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

// 32 Canonical Master Report Sections
export const MASTER_REPORT_32_SECTIONS = [
  {
    num: '01',
    category: 'CORE',
    titleHi: 'कार्यकारी सारांश एवं मुख्य प्रोफाइल',
    titleEn: 'Executive Summary & Core Snapshot',
    desc: 'समस्त गणनाओं का संक्षिप्त निष्कर्ष, मुख्य ग्रहीय ऊर्जा एवं व्यक्तित्व का समग्र आईना।'
  },
  {
    num: '02',
    category: 'CORE',
    titleHi: 'मूलांक, भाग्यांक व आत्म-चेतना समन्वय',
    titleEn: 'Core Numbers & Synthesis (Driver & Conductor)',
    desc: 'जन्म अंक एवं संपूर्ण जन्मतिथि योग की गहरी व्याख्या, ग्रहीय स्वामी एवं प्राकृतिक स्वभाव।'
  },
  {
    num: '03',
    category: 'CORE',
    titleHi: '3x3 लो शू जन्म कुंडली ग्रिड',
    titleEn: 'Natal 3x3 Lo Shu Birth Grid',
    desc: 'प्राचीन 3x3 अंक चक्र में जन्म अंकों की स्थिति एवं प्राकृतिक संतुलन का मानचित्र।'
  },
  {
    num: '04',
    category: 'CORE',
    titleHi: '3-स्तरीय संश्लेषित ग्रिड विश्लेषण',
    titleEn: 'Enhanced 3-Layer Lo Shu Matrix',
    desc: 'जन्म अंक, मूलांक व भाग्यांक के संयुक्त प्रभाव से निर्मित संपूर्ण ऊर्जा ग्रिड।'
  },
  {
    num: '05',
    category: 'CORE',
    titleHi: 'सक्रिय एवं उपस्थित अंक आवृत्तियां',
    titleEn: 'Active & Present Number Frequencies',
    desc: 'आपके ग्रिड में उपस्थित अंकों की शक्ति, उनकी कार्यशैली एवं प्राकृतिक प्रतिभाएं।'
  },
  {
    num: '06',
    category: 'CORE',
    titleHi: 'रिक्त अंक एवं कार्मिक पाठ',
    titleEn: 'Missing Numbers & Karmic Lessons',
    desc: 'ग्रिड में अनुपस्थित अंकों से उत्पन्न जीवन चुनौतियां एवं उनके व्यावहारिक समाधान।'
  },
  {
    num: '07',
    category: 'CORE',
    titleHi: 'अंकों की पुनरावृत्ति एवं अति-ऊर्जा प्रभाव',
    titleEn: 'Number Repetition & Over-Energy Analysis',
    desc: 'एक ही अंक के बार-बार आने से स्वभाव पर पड़ने वाले सकारात्मक व नकारात्मक प्रभाव।'
  },
  {
    num: '08',
    category: 'CORE',
    titleHi: '8 सफलता, मानसिक एवं व्यावहारिक तल',
    titleEn: '8 Success & Balance Planes',
    desc: 'मानसिक तल, भावनात्मक तल, व्यावहारिक तल, राजयोग एवं इच्छा शक्ति का स्कोर।'
  },
  {
    num: '09',
    category: 'CORE',
    titleHi: 'पाइथागोरस एवं कार्मिक योग तीर',
    titleEn: 'Arrows of Pythagoras & Strength',
    desc: 'अंक चक्र में बनने वाले विशेष तीर (तीक्ष्ण बुद्धि, दृढ़ संकल्प, संवेदनशीलता आदि)।'
  },
  {
    num: '10',
    category: 'CAREER_FINANCE',
    titleHi: '81 वैदिक ग्रहीय युति एवं फल',
    titleEn: '81 Vedic Planetary Yogas',
    desc: 'मूलांक और भाग्यांक के 81 विशिष्ट संयोजनों में से आपके संयोजन का प्रामाणिक फल।'
  },
  {
    num: '11',
    category: 'CAREER_FINANCE',
    titleHi: 'मुख्य व्यक्तित्व प्रारूप एवं प्रारब्ध',
    titleEn: 'Primary Archetype & Karmic Blueprint',
    desc: 'नेतृत्व, रचनात्मकता, शोध या व्यापार — आपका मूल प्रारब्ध एवं कर्म क्षेत्र।'
  },
  {
    num: '12',
    category: 'CAREER_FINANCE',
    titleHi: 'जीवन दिशा, भाग्यांक एवं आत्म अभिलाषा',
    titleEn: 'Life Destiny & Soul Urge Coordinates',
    desc: 'हृदय की सच्ची इच्छा, अंतरात्मा का उद्देश्य एवं जीवन में संतोष प्राप्ति का मार्ग।'
  },
  {
    num: '13',
    category: 'CAREER_FINANCE',
    titleHi: 'मानसिक, भावनात्मक एवं व्यावहारिक सोच',
    titleEn: 'Psychological & Cognitive Dynamics',
    desc: 'तनाव में प्रतिक्रिया, निर्णय लेने की शैली एवं कार्य निष्पादन का मनोवैज्ञानिक ऑडिट।'
  },
  {
    num: '14',
    category: 'CAREER_FINANCE',
    titleHi: 'करियर, आजीविका व अनुकूल व्यवसाय',
    titleEn: 'Career Aptitude & Professional Alignment',
    desc: 'नौकरी, व्यवसाय, पार्टनरशिप, सरकारी क्षेत्र या स्वतंत्र उद्यम हेतु अनुकूल सुझाव।'
  },
  {
    num: '15',
    category: 'CAREER_FINANCE',
    titleHi: 'धन, वित्तीय समृद्धि एवं जोखिम प्रबंधन',
    titleEn: 'Wealth, Finance & Abundance Blueprint',
    desc: 'धन संचय की क्षमता, निवेश की रणनीतियां एवं वित्तीय अस्थिरता से बचाव के उपाय।'
  },
  {
    num: '16',
    category: 'RELATIONSHIPS',
    titleHi: 'प्रेम, दांपत्य एवं संबंध अनुकूलता',
    titleEn: 'Love, Marriage & Relationship Approach',
    desc: 'जीवनसाथी, परिवार एवं मित्रों के साथ तालमेल, मित्र-शत्रु अंक एवं प्रेम जीवन।'
  },
  {
    num: '17',
    category: 'RELATIONSHIPS',
    titleHi: 'सामाजिक प्रतिष्ठा एवं नेतृत्व क्षमता',
    titleEn: 'Social Image & Leadership Style',
    desc: 'समाज में छवि, आकर्षण, जनसंपर्क तथा कार्यस्थल पर नेतृत्व करने की स्वाभाविक शैली।'
  },
  {
    num: '18',
    category: 'RELATIONSHIPS',
    titleHi: 'मोबाइल 10-अंकीय 81 जोड़ी गहन विश्लेषण',
    titleEn: 'Mobile 81-Pair Deep Matrix',
    desc: 'फोन नंबर के सभी 9 संयोजनों का विस्तृत परीक्षण एवं कैरियर/धन पर प्रभाव।'
  },
  {
    num: '19',
    category: 'RELATIONSHIPS',
    titleHi: 'चाल्डियन संयुक्त नामांक एवं स्पेलिंग कंपन',
    titleEn: 'Chaldean Compound Name Analysis',
    desc: 'नाम की ध्वनि तरंगों का चाल्डियन अंकशास्त्र अनुसार मूल्यांकन एवं अनुकूलता।'
  },
  {
    num: '20',
    category: 'RELATIONSHIPS',
    titleHi: 'पाइथागोरियन नामांक एवं प्रकटीकरण',
    titleEn: 'Pythagorean Name Frequency & Expression',
    desc: 'नाम के स्वर और व्यंजन का संतुलन तथा अभिव्यक्ति अंक का सूक्ष्म विश्लेषण।'
  },
  {
    num: '21',
    category: 'RELATIONSHIPS',
    titleHi: 'नाम स्पेलिंग शुद्धि एवं अक्षर संतुलन',
    titleEn: 'Name Spell Correction & Letter Tuning',
    desc: 'यदि नाम मित्र अंक पर न हो, तो स्पेलिंग में न्यूनतम बदलाव से शुभ कंपन लाना।'
  },
  {
    num: '22',
    category: 'OCCULT_VASTU',
    titleHi: 'न्यूमेरो वास्तु एवं 8-दिशा ऊर्जा संतुलन',
    titleEn: 'Numero Vastu & Directional Alignment',
    desc: 'जन्मतिथि अनुसार गृह व कार्यस्थल की 8 दिशाओं का संतुलन एवं दोष निवारण।'
  },
  {
    num: '23',
    category: 'OCCULT_VASTU',
    titleHi: 'कुआ अंक एवं अष्ट दिशा शुभ-अशुभ चक्र',
    titleEn: 'Kua Number & 8 Mansions Compass Harmony',
    desc: 'शेंग ची (धन), तियान यी (स्वास्थ्य), यान नियन (संबंध) व फू वेई (शांति) दिशाएं।'
  },
  {
    num: '24',
    category: 'OCCULT_VASTU',
    titleHi: 'आवास एवं कार्यस्थल ऊर्जा अभिविन्यास',
    titleEn: 'Residential & Workplace Spatial Energy',
    desc: 'घर का मुख्य द्वार, शयनकक्ष, तिजोरी एवं अध्ययन कक्ष हेतु अनुकूल दिशाएं।'
  },
  {
    num: '25',
    category: 'OCCULT_VASTU',
    titleHi: 'व्यक्तिगत वर्ष चक्र एवं 3-वर्षीय कालखंड',
    titleEn: 'Personal Year Cyclic Vibration & 3-Year Forecast',
    desc: 'वर्तमान वर्ष का अंक, उसके प्रभाव, अनुकूल कार्य एवं आगामी 2 वर्षों का पूर्वावलोकन।'
  },
  {
    num: '26',
    category: 'OCCULT_VASTU',
    titleHi: 'वैदिक महादशा एवं अंतर्दशा समय चक्र',
    titleEn: 'Vedic Mahadasha & Antardasha Time Periods',
    desc: 'सक्रिय ग्रह दशा, उसके प्रारंभ व समापन वर्ष तथा दशा अनुसार आवश्यक सावधानी।'
  },
  {
    num: '27',
    category: 'OCCULT_VASTU',
    titleHi: 'ग्रहीय गोचर एवं अनुकूल समय चयन',
    titleEn: 'Planetary Transits & Auspicious Timing',
    desc: 'महत्वपूर्ण कार्यों, यात्रा, निवेश एवं नए उपक्रमों हेतु शुभ कालखंड निर्धारण।'
  },
  {
    num: '28',
    category: 'OCCULT_VASTU',
    titleHi: 'पारंपरिक आयुर्वेदिक स्वास्थ्य एवं त्रिदोष',
    titleEn: 'Traditional Ayurvedic & Astro-Wellness',
    desc: 'वात, पित्त, कफ प्रकृति, ग्रहानुकूल आहार, सावधानियां एवं दैनिक दिनचर्या सुझाव।'
  },
  {
    num: '29',
    category: 'ACTION_REMEDIES',
    titleHi: 'हस्ताक्षर ऊर्जा एवं स्ट्रोक ऑडिट प्रो',
    titleEn: 'Signature Energy Audit Pro',
    desc: 'हस्ताक्षर का कोण, रेखाएं, अधोरेखा एवं वित्तीय प्रगति हेतु सही हस्ताक्षर प्रारूप।'
  },
  {
    num: '30',
    category: 'ACTION_REMEDIES',
    titleHi: 'वाहन, संपत्ति, बाल नामाक्षर व विवाह विस्तार',
    titleEn: 'Multi-Vehicle, Property & Synastry Extensions',
    desc: 'कार/बाइक नंबर, फ्लैट नंबर, शिशु के शुभ नामाक्षर एवं जीवनसाथी मिलान।'
  },
  {
    num: '31',
    category: 'ACTION_REMEDIES',
    titleHi: 'प्रामाणिक वैदिक, मंत्र, यंत्र व लाल किताब उपाय',
    titleEn: 'Consolidated Vedic & Lal Kitab Remedies',
    desc: 'हानिरहित, सरल वैदिक मंत्र, दान, यंत्र, रंग चिकित्सा एवं धातु/रत्न परामर्श।'
  },
  {
    num: '32',
    category: 'ACTION_REMEDIES',
    titleHi: '90-दिवसीय व्यक्तिगत कार्य योजना एवं निष्कर्ष',
    titleEn: '90-Day Action Plan & Final Executive Guidance',
    desc: 'जीवन में स्पष्ट दिशा एवं गति प्राप्त करने हेतु 3 चरणों वाली चरणबद्ध कार्ययोजना।'
  }
];

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
  const configuredPrice = REPORT_REGISTRY.MASTER_REPORT.priceInr || 33;

  // Local instant calculator state
  const [calcName, setCalcName] = useState(personalDetails?.name || '');
  const [calcDob, setCalcDob] = useState(personalDetails?.dob ? personalDetails.dob.slice(0, 10) : '');
  const [calcMobile, setCalcMobile] = useState(personalDetails?.mobile || '');
  const [calcGender, setCalcGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>((personalDetails?.gender as any) || 'MALE');
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedSectionCategory, setSelectedSectionCategory] = useState<'ALL' | 'CORE' | 'CAREER_FINANCE' | 'RELATIONSHIPS' | 'OCCULT_VASTU' | 'ACTION_REMEDIES'>('ALL');
  
  const [localResult, setLocalResult] = useState<{
    name: string;
    dob: string;
    mulank: number;
    bhagyank: number;
    kua: number;
    personalYear: number;
    grid: Record<number, number>;
    mobileTotal?: number;
    mobileSingle?: number;
  } | null>(() => {
    if (personalDetails && dobData) {
      const pYear = calculatePersonalYearNumber(personalDetails.dob, new Date().getFullYear());
      return {
        name: personalDetails.name,
        dob: personalDetails.dob,
        mulank: dobData.birthNumber,
        bhagyank: dobData.lifePathNumber,
        kua: dobData.kuaNumber || 1,
        personalYear: pYear,
        grid: dobData.kuaNumber ? buildBirthGrid(personalDetails.dob) : {},
        mobileSingle: mobileData?.singleDigit || mobileData?.reducedTotal || undefined,
      };
    }
    return null;
  });

  const handleInstantCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcDob) return;
    setIsCalculating(true);

    try {
      const dateParts = calcDob.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const mulankVal = calculateMulank(calcDob);
        const bhagyankVal = calculateBhagyank(calcDob);
        const kuaRes = calculateKuaNumber(year, calcGender === 'FEMALE' ? 'FEMALE' : 'MALE');
        const gridObj = buildBirthGrid(calcDob);
        const pYear = calculatePersonalYearNumber(calcDob, new Date().getFullYear());

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
          name: calcName.trim() || 'Seeker',
          dob: calcDob,
          mulank: mulankVal,
          bhagyank: bhagyankVal,
          kua: kuaRes.kuaNumber,
          personalYear: pYear,
          grid: gridObj,
          mobileTotal: mobTotal || undefined,
          mobileSingle: mobSingle || undefined,
        });

        // Smooth scroll to free result view
        setTimeout(() => {
          const resEl = document.getElementById('free-result-container');
          if (resEl) {
            resEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setTimeout(() => {
        setIsCalculating(false);
      }, 300);
    }
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('free-calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFreeTools = () => {
    const el = document.getElementById('free-tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredSections = MASTER_REPORT_32_SECTIONS.filter(s => {
    if (selectedSectionCategory === 'ALL') return true;
    return s.category === selectedSectionCategory;
  });

  return (
    <div className="space-y-14 animate-in fade-in duration-500 font-sans max-w-7xl mx-auto pb-12">
      
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

      {/* 2. FREE CALCULATOR FORM SECTION */}
      <div id="free-calculator-section" className="bg-white border border-[#E7E5E4] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#D97706] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Gift className="w-3.5 h-3.5" /> 100% Free Instant Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-stone-900">
            अपनी जन्मतिथि दर्ज करें और तुरंत परिणाम पाएं
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            मूलांक, भाग्यांक, वास्तु ऊर्जा (कुआ अंक), 3x3 लो शू ग्रिड और मोबाइल वाइब्रेशन की त्वरित एवं सटीक गणना
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
                  <span>अभी Calculate करें (FREE)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. TWO-LAYER CONVERSION EXPERIENCE (FREE RESULT → PREMIUM DISCOVERY) */}
      {localResult && (
        <div id="free-result-container" className="space-y-10 scroll-mt-20">
          
          {/* LAYER 1: FREE RESULT DASHBOARD */}
          <div className="bg-[#FAF8F5] border-2 border-amber-300/80 rounded-[36px] p-6 sm:p-8 md:p-10 shadow-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Header with Clear FREE Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" /> 100% Free Analysis Ready
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-playfair text-stone-900">
                  आपका Free Analysis तैयार है
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  {localResult.name} के लिए प्रामाणिक वैदिक एवं चाल्डियन प्रारंभिक गणना
                </p>
              </div>

              <div className="bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-xs text-right text-xs">
                <span className="text-stone-400 block text-[10px] font-mono uppercase">Date of Birth</span>
                <span className="font-bold text-stone-800">{formatDateIndian(localResult.dob)}</span>
              </div>
            </div>

            {/* "आपको अभी क्या पता चला" - Section 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <h3 className="font-bold text-base sm:text-lg text-stone-900 font-playfair">
                  आपको अभी क्या पता चला (Free Key Insights)
                </h3>
              </div>

              {/* 5 Core Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-white border border-amber-200/80 rounded-2xl p-4 text-center shadow-xs">
                  <span className="text-xs text-stone-500 font-medium block">मूलांक (Driver)</span>
                  <span className="text-3xl font-extrabold text-[#D97706] block my-1">{localResult.mulank}</span>
                  <span className="text-[10px] text-stone-400 font-medium">आत्म चेतना व स्वभाव</span>
                </div>

                <div className="bg-white border border-blue-200/80 rounded-2xl p-4 text-center shadow-xs">
                  <span className="text-xs text-stone-500 font-medium block">भाग्यांक (Conductor)</span>
                  <span className="text-3xl font-extrabold text-[#1E3A8A] block my-1">{localResult.bhagyank}</span>
                  <span className="text-[10px] text-stone-400 font-medium">कर्म व जीवन दिशा</span>
                </div>

                <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 text-center shadow-xs">
                  <span className="text-xs text-stone-500 font-medium block">कुआ अंक (Kua)</span>
                  <span className="text-3xl font-extrabold text-emerald-700 block my-1">{localResult.kua}</span>
                  <span className="text-[10px] text-stone-400 font-medium">वास्तु व अनुकूल दिशा</span>
                </div>

                <div className="bg-white border border-purple-200/80 rounded-2xl p-4 text-center shadow-xs">
                  <span className="text-xs text-stone-500 font-medium block">मोबाइल वाइब्रेशन</span>
                  <span className="text-3xl font-extrabold text-purple-700 block my-1">
                    {localResult.mobileSingle || '—'}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">चाल्डियन ध्वनि तरंग</span>
                </div>

                <div className="bg-white border border-amber-200/80 rounded-2xl p-4 text-center shadow-xs col-span-2 sm:col-span-1">
                  <span className="text-xs text-stone-500 font-medium block">व्यक्तिगत वर्ष (PY)</span>
                  <span className="text-3xl font-extrabold text-amber-700 block my-1">{localResult.personalYear}</span>
                  <span className="text-[10px] text-stone-400 font-medium">{new Date().getFullYear()} की सक्रिय ऊर्जा</span>
                </div>
              </div>

              {/* Lo Shu Grid Mini Preview */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-1 text-left max-w-md">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5" /> 3x3 Natal Birth Kundali
                  </div>
                  <h4 className="font-bold text-base text-stone-900 font-playfair">
                    लो शू ग्रिड जन्म चक्र (Lo Shu Grid)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    आपके जन्म अंकों के आधार पर 8 विशेष योगों (मानसिक, भावनात्मक, व्यावहारिक, सफलता, इच्छा शक्ति) का प्रारंभिक नक्शा तैयार है।
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-stone-900 p-2 rounded-xl border border-stone-800 shadow-inner">
                  {[
                    [4, 9, 2],
                    [3, 5, 7],
                    [8, 1, 6],
                  ].flat().map((num) => {
                    const count = localResult.grid?.[num] || 0;
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onNavigate('CORE_LOSHU')}
                    className="whitespace-nowrap bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>लो शू ग्रिड पूरा देखें (FREE)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Strategic CTA 1 */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-stone-800">
                  क्या आप इन अंकों के पीछे का सम्पूर्ण 360° विश्लेषण देखना चाहते हैं?
                </span>
                <p className="text-[11px] text-stone-600">
                  करियर, धन, विवाह, 81 ग्रहीय युति, महादशा और सिद्ध उपायों का 32-अध्यायों का मास्टर दस्तावेज।
                </p>
              </div>
              <button
                onClick={() => onNavigate('MASTER_REPORT')}
                className="whitespace-nowrap bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Complete Report देखें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* LAYER 2: "आपकी Complete Report में क्या और जानने को मिलेगा?" */}
          <div className="bg-white border border-[#E7E5E4] rounded-[36px] p-6 sm:p-8 md:p-10 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-[#92400E] border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-[#D97706]" /> Full Spectrum Master Dossier
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-stone-900">
                आपकी Complete Report में क्या और जानने को मिलेगा?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                निःशुल्क गणना आपको मुख्य अंक बताती है — Complete Master Report आपको जीवन के प्रत्येक क्षेत्र की विस्तृत रणनीति प्रदान करती है।
              </p>
            </div>

            {/* 6 Core Deeper Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Chapter 14-15
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">
                  करियर व वित्तीय समृद्धि ब्लूप्रिंट
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  नौकरी, व्यापार, साझेदारी, प्रमोशन के शुभ वर्ष एवं धन संचय में बाधक ग्रहीय दोषों का समाधान।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Chapter 16, 30
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">
                  दांपत्य सुख एवं संबंध अनुकूलता
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  जीवनसाथी के साथ तालमेल, विवाह हेतु अनुकूल समय, मित्र-शत्रु संख्या मिलान एवं पारिवारिक शांति।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Chapter 18-21
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">
                  मोबाइल व नाम स्पेलिंग शुद्धि
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  फोन नंबर के सभी 9 युग्मों का गहन विश्लेषण एवं चाल्डियन पद्धति से नाम की पूर्ण स्पेलिंग बैलेंसिंग।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Chapter 22-24
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">
                  न्यूमेरो वास्तु व 8-दिशा अलाइनमेंट
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  कुआं संख्या के आधार पर मुख्य द्वार, शयनकक्ष, तिजोरी एवं कार्यक्षेत्र की शुभ दिशाओं का निर्धारण।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Chapter 25-27
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">
                  वैदिक महादशा एवं 3-वर्षीय वर्षफल
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  वर्तमान सक्रिय दशा चक्र, आगामी वर्षों की ग्रहीय चाल एवं महत्वपूर्ण जीवन निर्णयों हेतु सही समय।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Chapter 31-32
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">
                  सिद्ध वैदिक उपाय व 90-डे एक्शन प्लान
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  हानिरहित मंत्र, रत्न, दान व दैनिक जीवन में सकारात्मक बदलाव लाने वाली व्यावहारिक 90-दिवसीय कार्ययोजना।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. “WHY UPGRADE?” SECTION (FREE RESULT VS MASTER REPORT) */}
      <div className="bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] text-white rounded-[36px] p-8 md:p-12 space-y-8 border border-amber-600/30 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Factual Comparison
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-playfair text-white leading-tight">
            Free Result आपको शुरुआत देता है। <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              Master Report आपको पूरी तस्वीर देता है।
            </span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light">
            निःशुल्क गणना से आपको अपने मूल अंकों की पहचान होती है, जबकि 32-अध्यायों की मास्टर रिपोर्ट आपको जीवन की दिशा, अनुकूल समय, संबंध और व्यावहारिक समाधान का संपूर्ण रोडमैप प्रदान करती है।
          </p>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Free Analysis Card */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-stone-200 font-playfair">FREE ANALYSIS</h3>
                <span className="text-xs text-stone-400">निःशुल्क प्रारंभिक गणना</span>
              </div>
              <span className="text-sm font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
                ₹0 मुफ़्त
              </span>
            </div>

            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>मूलांक (Driver Number) एवं भाग्यांक (Conductor) की मूल गणना</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>3x3 लो शू ग्रिड जन्म चक्र का प्राथमिक दृश्य</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>कुआ वास्तु अंक एवं मोबाइल मूल कंपन</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>प्रारंभिक संक्षिप्त ग्रहीय अवलोकन</span>
              </li>
              <li className="flex items-start gap-2.5 text-stone-500">
                <Lock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span>विस्तृत करियर, धन व व्यवसाय विश्लेषण (अनुपलब्ध)</span>
              </li>
              <li className="flex items-start gap-2.5 text-stone-500">
                <Lock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span>81 ग्रहीय युति व महादशा चक्र (अनुपलब्ध)</span>
              </li>
              <li className="flex items-start gap-2.5 text-stone-500">
                <Lock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span>वैदिक उपाय एवं 90-डे एक्शन प्लान (अनुपलब्ध)</span>
              </li>
            </ul>
          </div>

          {/* Complete Master Report Card */}
          <div className="bg-gradient-to-b from-stone-900 via-amber-950/30 to-stone-900 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 font-extrabold text-[10px] px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              RECOMMENDED
            </div>

            <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
              <div>
                <h3 className="font-bold text-lg text-amber-300 font-playfair">COMPLETE MASTER REPORT</h3>
                <span className="text-xs text-stone-300">32 अध्यायों का संपूर्ण व्यक्तिगत दस्तावेज</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-amber-400 block font-playfair">₹{configuredPrice}</span>
                <span className="text-[10px] text-stone-400 block">एक बार भुगतान</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-stone-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>सम्पूर्ण 32 अध्याय:</strong> व्यक्तित्व, करियर, धन, विवाह, वास्तु व स्वास्थ्य</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>81 वैदिक ग्रहीय युति:</strong> मूलांक व भाग्यांक के संयोजन का प्रामाणिक फल</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>गहन लो शू विश्लेषण:</strong> 8 तलों का स्कोर, रिक्त अंक एवं अति-ऊर्जा निदान</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>मोबाइल 81-पेयर मैट्रिक्स:</strong> 10 अंकों के सभी 9 जोड़ियों का शुभ-अशुभ ऑडिट</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>दशा व वर्षफल:</strong> वैदिक महादशा चक्र एवं आगामी 3 वर्षों का समय चक्र</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>सिद्ध उपाय व 90-डे प्लान:</strong> वैदिक मंत्र, रत्न एवं चरणबद्ध कार्ययोजना</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>डिजिटल एक्सेस + A4 PDF:</strong> ऑनलाइन आजीवन एक्सेस एवं प्रिंटेबल PDF</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('MASTER_REPORT')}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-stone-900" />
              <span>₹{configuredPrice} में Complete Report Unlock करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. SAMPLE REPORT VISUAL PREVIEW CARDS */}
      <div className="bg-white border border-[#E7E5E4] rounded-[36px] p-6 sm:p-8 md:p-10 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#D97706] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Eye className="w-3.5 h-3.5" /> Authentic Visual Blueprint
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-stone-900">
            Master Report का दृश्य पूर्वावलोकन
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            आपकी अनलॉक रिपोर्ट में प्रस्तुत होने वाले प्रमुख अनुभागों का एक संक्षिप्त नमूना
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Executive Cover Page',
              tag: 'Sample Preview',
              desc: 'आधिकारिक लियोफैमिली मुहर, 32-अध्याय सूचकांक व व्यक्तिगत जन्म विवरण।',
              bg: 'bg-stone-900 text-amber-300',
              icon: <Award className="w-5 h-5 text-amber-400" />
            },
            {
              title: '3x3 Lo Shu & 8 Planes',
              tag: 'Sample Preview',
              desc: 'मानसिक, भावनात्मक, व्यावहारिक तल एवं राजयोग तीरों का विस्तृत प्रतिशत ग्राफ।',
              bg: 'bg-amber-50 text-amber-900',
              icon: <Compass className="w-5 h-5 text-[#D97706]" />
            },
            {
              title: 'Career & Finance Matrix',
              tag: 'Sample Preview',
              desc: 'अनुकूल आजीविका क्षेत्र, व्यवसाय तालमेल व आर्थिक स्थिरता के शुभ वर्ष।',
              bg: 'bg-blue-50 text-blue-900',
              icon: <Briefcase className="w-5 h-5 text-blue-700" />
            },
            {
              title: 'Mobile 81-Pair Deep Matrix',
              tag: 'Sample Preview',
              desc: '10 अंकों के सभी 9 संयोजनों का शुभ-अशुभ स्कोर एवं वित्तीय कंपन वर्गीकरण।',
              bg: 'bg-purple-50 text-purple-900',
              icon: <Phone className="w-5 h-5 text-purple-700" />
            },
            {
              title: 'Marriage & Synastry Match',
              tag: 'Sample Preview',
              desc: 'द्विपक्षीय अंक मिलान, भावनात्मक तालमेल एवं संबंध संतुलन मार्गदर्शन।',
              bg: 'bg-rose-50 text-rose-900',
              icon: <Heart className="w-5 h-5 text-rose-700" />
            },
            {
              title: 'Numero Vastu & Kua',
              tag: 'Sample Preview',
              desc: 'अष्ट दिशा ऊर्जा संतुलन, मुख्य द्वार एवं कार्यस्थल की अनुकूल दिशाएं।',
              bg: 'bg-emerald-50 text-emerald-900',
              icon: <Home className="w-5 h-5 text-emerald-700" />
            },
            {
              title: 'Vedic & Lal Kitab Remedies',
              tag: 'Sample Preview',
              desc: 'सुरक्षित मंत्र, रत्न परामर्श, दान एवं व्यावहारिक जीवनशैली सुधार।',
              bg: 'bg-amber-50 text-amber-900',
              icon: <ShieldCheck className="w-5 h-5 text-[#D97706]" />
            },
            {
              title: '90-Day Action Plan',
              tag: 'Sample Preview',
              desc: '3 चरणों (माह 1, माह 2, माह 3) में विभाजित स्पष्ट कार्य योजना।',
              bg: 'bg-stone-900 text-white',
              icon: <TargetIcon className="w-5 h-5 text-amber-400" />
            }
          ].map((card, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-[#FAF8F5] flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-stone-200">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded">
                    {card.tag}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-playfair">{card.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-2 text-[11px] font-semibold text-[#D97706] flex items-center gap-1">
                <span>Unlock In Master Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. COMPLETE 32-SECTION MASTER VALUE SHOWCASE GRID */}
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-[36px] p-6 sm:p-8 md:p-10 space-y-8">
        
        {/* Header & Category Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase tracking-wider">
              <Award className="w-4 h-4" /> 32-Chapter Master Index
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-playfair text-stone-900">
              Complete LeoFamily Master Report — 32 अध्याय
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              आपकी कुंडली और अंक विश्लेषण का विस्तृत व्यक्तिगत दस्तावेज़ (सभी 32 अध्याय आपकी अनलॉक रिपोर्ट में उपलब्ध हैं)
            </p>
          </div>

          <button
            onClick={() => onNavigate('MASTER_REPORT')}
            className="whitespace-nowrap bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>₹{configuredPrice} में Report Unlock करें</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'ALL', label: 'सभी 32 अध्याय (All 32)' },
            { id: 'CORE', label: 'मूल आधार (Core 01-09)' },
            { id: 'CAREER_FINANCE', label: 'करियर एवं धन (Career 10-15)' },
            { id: 'RELATIONSHIPS', label: 'संबंध व व्यक्तिगत (Personal 16-21)' },
            { id: 'OCCULT_VASTU', label: 'वास्तु व महादशा (Vastu 22-28)' },
            { id: 'ACTION_REMEDIES', label: 'उपाय व कार्ययोजना (Action 29-32)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSectionCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedSectionCategory === tab.id
                  ? 'bg-stone-900 text-amber-400 shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 32-Section Responsive Grid (Desktop 4/3 cols, Tablet 2 cols, Mobile 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSections.map((sec) => (
            <div
              key={sec.num}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {sec.num}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300">
                    <Lock className="w-3 h-3 text-amber-700" />
                    PREMIUM
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-stone-900 font-playfair group-hover:text-[#D97706] transition">
                    {sec.titleHi}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-medium block">{sec.titleEn}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-400 group-hover:text-[#D97706] transition">
                <span>अनलॉक रिपोर्ट में शामिल</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. PROBLEM-BASED GUIDANCE ENTRY ("आप किस विषय में Guidance चाहते हैं?") */}
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

      {/* 8. FREE PUBLIC TOOLS SECTION (MOBILE & LO SHU ARE 100% FREE) */}
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

      {/* 9. HOW IT WORKS */}
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
              desc: `गहन 32 अध्यायों वाली संपूर्ण व्यक्तिगत मास्टर रिपोर्ट को मात्र ₹${configuredPrice} में अनलॉक करें।`,
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

      {/* 10. FACTUAL TRUST SECTION */}
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
              जीवनभर सुरक्षित रखने योग्य 32 अध्यायों का प्रिंटेबल A4 PDF डॉसियर।
            </p>
          </div>
        </div>
      </div>

      {/* 11. FINAL BOTTOM PURCHASE CTA & CONSULTATION */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-[36px] p-8 md:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-100">
            <Award className="w-3.5 h-3.5" /> 32 Chapters • Lifetime Access
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-playfair">
            अपनी Complete Report अभी प्राप्त करें
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            मात्र ₹{configuredPrice} में अपने संपूर्ण जीवन का 32-अध्यायों वाला वैदिक व चाल्डियन मास्टर विश्लेषण अनलॉक करें।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={() => onNavigate('MASTER_REPORT')}
            className="whitespace-nowrap bg-white hover:bg-amber-50 text-amber-900 font-extrabold px-8 py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-900" />
            <span>₹{configuredPrice} में Complete Report Unlock करें</span>
          </button>
          
          <button
            onClick={() => onNavigate('AI_CONSULTATION')}
            className="whitespace-nowrap bg-amber-800/80 hover:bg-amber-800 text-white font-bold px-6 py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition border border-amber-500/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>परामर्श केंद्र</span>
          </button>
        </div>
      </div>

      {/* STICKY MOBILE BOTTOM CTA (Visible on Mobile when free result exists) */}
      {localResult && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-amber-500/30 p-3 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div>
            <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">32-Chapter Master Report</span>
            <span className="text-sm font-extrabold text-white">₹{configuredPrice} <span className="text-[10px] text-stone-400 font-normal">only</span></span>
          </div>
          <button
            onClick={() => onNavigate('MASTER_REPORT')}
            className="bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Report Unlock</span>
          </button>
        </div>
      )}

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

// Helper icon component for Target
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
