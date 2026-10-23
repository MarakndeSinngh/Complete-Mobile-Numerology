import React, { useState, useRef } from 'react';
import { useLanguage } from '../i18n';
import { CompleteNumerologyProfile } from '../core/types';
import { calculateKuaNumber, KuaProfile } from '../core/kuaEngine';
import { deriveExpertConsultationDossier, ExpertConsultationDossier } from '../core/expertConsultationEngine';
import { analyzeCrossPatterns, PersonalizedPatternDossier } from '../core/crossPatternEngine';
import { AdvancedInsightEngine, AdvancedInsightDossier, AdvancedInsight } from '../core/advancedInsightEngine';
import { buildLocalizedExpertDossier, getPlanetName, getLocalizedNumberMeaning, getLocalized81Yoga, getLocalizedPlane, getLocalizedPersonalYear, LocalizedPersonalYear } from '../i18n/dynamicContent';
import { calculatePersonalYearNumber, scanLuckyDates } from '../core/luckyDatesEngine';
import { sumDigits, reduceToDigit } from '../core/numerologyEngine';
import { NUMBER_DEFINITIONS } from '../core/methodology/numberMeanings';
import { PLANET_DEFINITIONS } from '../core/methodology/planetMappings';
import { MASTER_PLANES } from '../core/methodology/planeDefinitions';
import { MASTER_ARROWS } from '../core/methodology/arrowDefinitions';
import { PROFESSION_RULES } from '../core/methodology/professionDefinitions';
import { parseIndianDate } from '../utils/dateUtils';
import { formatLocalizedDate, getProfileIsolationKey } from '../utils/localeUtils';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import {
  Sparkles,
  Compass,
  Phone,
  User,
  Heart,
  Briefcase,
  Shield,
  Activity,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Download,
  Printer,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Home,
  FileText,
  Target,
  PenTool,
  Check,
  TrendingUp,
  Star,
  Car,
  Baby,
  MessageSquare,
  Send,
  ThumbsUp
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BrandLogo } from './BrandLogo';
import { useReportAccess } from '../hooks/useReportAccess';
import { ReportPaywallModal } from './ReportPaywallModal';
import { ReportAccessGate } from './ReportAccessGate';
import { ReportAccessService } from '../services/reportAccessService';
import { Lock, Unlock, Gift } from 'lucide-react';

interface MasterReportUnifiedProps {
  profile: CompleteNumerologyProfile;
  personalDetails: PersonalDetails;
  dobData?: DOBAnalysis;
  nameData?: NameAnalysis;
  mobileData?: MobileAnalysis;
  remedies?: remediesAdvice;
}

export const MasterReportUnified: React.FC<MasterReportUnifiedProps> = ({
  profile,
  personalDetails,
  dobData,
  nameData,
  mobileData,
  remedies
}) => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Date formatting helpers ensuring Indian DD/MM/YYYY standard
  const formatToIndianDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const formattedDOB = formatToIndianDate(personalDetails?.dob || profile?.identity?.dob || '');
  const formattedReportDate = formatLocalizedDate(new Date(), language);

  // Extract core entities from unified profile
  const {
    identity,
    coreNumbers,
    loshu,
    vastu,
    medical,
    nameNumerology,
    vedicDasha,
    mobileAnalysis,
    interpretations,
    personality,
    career,
    finance,
    relationship,
    combination81,
    actionPlan90Day
  } = profile;

  // Grid references
  const birthGrid = loshu.birthGrid || {};
  const enhancedGrid = loshu.enhancedGrid?.flatGrid || {};
  const presentNums = loshu.enhancedGrid?.effectivePresentDigits || [];
  const missingNums = loshu.enhancedGrid?.effectiveMissingDigits || [];
  const repeatedNums = loshu.repetition || [];
  const planes = loshu.planes || [];
  const arrows = loshu.arrows || [];

  const mulankDef = NUMBER_DEFINITIONS[coreNumbers.mulank] || NUMBER_DEFINITIONS[1];
  const bhagyankDef = NUMBER_DEFINITIONS[coreNumbers.bhagyank] || NUMBER_DEFINITIONS[1];
  const mPlanet = PLANET_DEFINITIONS[coreNumbers.mulank] || PLANET_DEFINITIONS[1];
  const bPlanet = PLANET_DEFINITIONS[coreNumbers.bhagyank] || PLANET_DEFINITIONS[1];
  const matchedProfessions = Object.values(PROFESSION_RULES).filter(
    (r) => r.requiredNumbers.includes(coreNumbers.mulank) || r.requiredNumbers.includes(coreNumbers.bhagyank)
  );
  const rawNameStr = (personalDetails?.name || identity?.fullName || '').trim();
  const hasProvidedName = Boolean(
    rawNameStr &&
      rawNameStr !== 'जातक' &&
      rawNameStr !== 'अतिथि उपयोगकर्ता' &&
      rawNameStr !== 'Guest User' &&
      rawNameStr !== 'जिज्ञासु' &&
      nameNumerology?.chaldean?.nameBreakdown?.length
  );
  const rawMobileStr = (personalDetails?.mobile || identity?.mobile || '').replace(/\D/g, '');
  const hasProvidedMobile = Boolean(rawMobileStr.length >= 7 && mobileAnalysis);

  // Active Personal Year & Multi-Year Calculations
  const [activePyTab, setActivePyTab] = useState<'CURRENT' | 'UPCOMING' | 'NEXT_2' | 'TIMELINE'>('CURRENT');
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const next2Year = currentYear + 2;
  const prevYear = currentYear - 1;

  const dobStr = personalDetails?.dob || profile?.identity?.dob || `${new Date().getFullYear()}-01-01`;
  const parsedDob = parseIndianDate(dobStr);
  const birthDay = parsedDob?.day || 1;
  const birthMonth = parsedDob?.month || 1;
  const birthDaySum = sumDigits(birthDay);
  const birthMonthSum = sumDigits(birthMonth);

  const currentPY = calculatePersonalYearNumber(dobStr, currentYear);
  const nextPY = calculatePersonalYearNumber(dobStr, nextYear);
  const next2PY = calculatePersonalYearNumber(dobStr, next2Year);
  const prevPY = calculatePersonalYearNumber(dobStr, prevYear);
  const personalYearVal = currentPY;

  const dynamicLuckyDatesReport = React.useMemo(() => {
    try {
      return scanLuckyDates(dobStr, 'GENERAL', {
        userName: rawNameStr || undefined
      });
    } catch {
      return null;
    }
  }, [dobStr, rawNameStr]);

  const currentPYForecast = React.useMemo(() => {
    return getLocalizedPersonalYear(currentPY, currentYear, language);
  }, [currentPY, currentYear, language]);

  const nextPYForecast = React.useMemo(() => {
    return getLocalizedPersonalYear(nextPY, nextYear, language);
  }, [nextPY, nextYear, language]);

  const next2PYForecast = React.useMemo(() => {
    return getLocalizedPersonalYear(next2PY, next2Year, language);
  }, [next2PY, next2Year, language]);

  const prevPYForecast = React.useMemo(() => {
    return getLocalizedPersonalYear(prevPY, prevYear, language);
  }, [prevPY, prevYear, language]);

  // Resolve Kua profile safely from unified profile or existing core Kua engine
  const kuaProfile: KuaProfile = React.useMemo(() => {
    if (profile?.kua && typeof profile.kua === 'object' && (profile.kua as any).kuaNumber) {
      return profile.kua as KuaProfile;
    }
    if ((profile?.vastu as any)?.kua && typeof (profile.vastu as any).kua === 'object') {
      return (profile.vastu as any).kua as KuaProfile;
    }
    const safeDobStr = personalDetails?.dob || profile?.identity?.dob || `${new Date().getFullYear()}-01-01`;
    const parsed = parseIndianDate(safeDobStr);
    const birthYear = parsed?.year || (safeDobStr ? new Date(safeDobStr).getFullYear() : new Date().getFullYear());
    const gender = (personalDetails?.gender || profile?.identity?.gender || 'MALE') as 'MALE' | 'FEMALE' | 'OTHER';
    return calculateKuaNumber(birthYear, gender);
  }, [profile?.kua, profile?.vastu, personalDetails?.dob, personalDetails?.gender, profile?.identity]);

  // Derived expert consultation sections from single source of truth profile
  const expertDossier: ExpertConsultationDossier = React.useMemo(() => {
    return deriveExpertConsultationDossier(profile);
  }, [profile]);

  const localizedDossier = React.useMemo(() => {
    return buildLocalizedExpertDossier(profile, language);
  }, [profile, language]);

  // Derived cross-pattern analysis from unified profile
  const patternDossier: PersonalizedPatternDossier = React.useMemo(() => {
    return analyzeCrossPatterns(profile);
  }, [profile]);

  // Phase 7: Advanced Insight Dossier & Explainability Engine
  const advancedInsightDossier: AdvancedInsightDossier = React.useMemo(() => {
    return AdvancedInsightEngine.generateDossier(profile);
  }, [profile]);

  const [selectedProvenanceInsight, setSelectedProvenanceInsight] = useState<AdvancedInsight | null>(null);
  const [showDebugProvenanceModal, setShowDebugProvenanceModal] = useState<boolean>(false);

  // Phase 10: Feedback & Quality Rating Loop State
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackClarity, setFeedbackClarity] = useState<string>('crystal_clear');
  const [feedbackActionability, setFeedbackActionability] = useState<string>('highly_actionable');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    setFeedbackError(null);
    try {
      const isolationKey = getProfileIsolationKey({
        name: personalDetails?.name || profile?.identity?.fullName || '',
        dob: personalDetails?.dob || profile?.identity?.dob || '',
        mobile: personalDetails?.mobile || profile?.identity?.mobile || ''
      });
      const res = await ReportAccessService.submitFeedback({
        reportType: 'MASTER_REPORT',
        profileKey: isolationKey,
        rating: feedbackRating,
        clarity: feedbackClarity,
        actionability: feedbackActionability,
        feedbackText: feedbackText.trim()
      });
      if (res.success) {
        setFeedbackSubmitted(true);
      } else {
        setFeedbackError(res.error || 'Feedback recorded');
        setFeedbackSubmitted(true);
      }
    } catch {
      setFeedbackSubmitted(true);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Saved Signature, Vehicle, Business, Marriage & Child Audit state from localStorage
  const [savedSigAudit, setSavedSigAudit] = useState<any>(null);
  const [savedVehicleAudit, setSavedVehicleAudit] = useState<any>(null);
  const [savedBusinessAudit, setSavedBusinessAudit] = useState<any>(null);
  const [savedMarriageAudit, setSavedMarriageAudit] = useState<any>(null);
  const [savedChildReport, setSavedChildReport] = useState<any>(null);

  React.useEffect(() => {
    const currentKey = getProfileIsolationKey({
      name: personalDetails?.name || profile?.identity?.fullName || '',
      dob: personalDetails?.dob || profile?.identity?.dob || '',
      mobile: personalDetails?.mobile || profile?.identity?.mobile || ''
    });

    const isMatch = (item: any) => {
      if (!item) return false;
      if (item.profileKey && item.profileKey === currentKey) return true;
      if (item.name && item.name === (personalDetails?.name || profile?.identity?.fullName)) return true;
      if (item.report?.ownerName && item.report?.ownerName === (personalDetails?.name || profile?.identity?.fullName)) return true;
      if (item.report?.personA?.name && item.report?.personA?.name === (personalDetails?.name || profile?.identity?.fullName)) return true;
      if (item.report?.childInfo?.parentName && item.report?.childInfo?.parentName === (personalDetails?.name || profile?.identity?.fullName)) return true;
      return false;
    };

    try {
      const stored = localStorage.getItem(`leofamily_saved_signature_audit_${currentKey}`) || localStorage.getItem('leofamily_saved_signature_audit');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedSigAudit(isMatch(parsed) ? parsed : null);
      } else {
        setSavedSigAudit(null);
      }
    } catch (e) {
      console.error("Error loading saved signature audit:", e);
    }

    try {
      const storedVeh = localStorage.getItem(`leofamily_saved_vehicle_audit_${currentKey}`) || localStorage.getItem('leofamily_saved_vehicle_audit');
      if (storedVeh) {
        const parsed = JSON.parse(storedVeh);
        setSavedVehicleAudit(isMatch(parsed) ? parsed : null);
      } else {
        setSavedVehicleAudit(null);
      }
    } catch (e) {
      console.error("Error loading saved vehicle audit:", e);
    }

    try {
      const storedBus = localStorage.getItem(`leofamily_saved_business_audit_${currentKey}`) || localStorage.getItem('leofamily_saved_business_audit');
      if (storedBus) {
        const parsed = JSON.parse(storedBus);
        setSavedBusinessAudit(isMatch(parsed) ? parsed : null);
      } else {
        setSavedBusinessAudit(null);
      }
    } catch (e) {
      console.error("Error loading saved business audit:", e);
    }

    try {
      const storedSyn = localStorage.getItem(`leofamily_saved_synastry_audit_${currentKey}`) || localStorage.getItem('leofamily_saved_synastry_audit');
      if (storedSyn) {
        const parsed = JSON.parse(storedSyn);
        setSavedMarriageAudit(isMatch(parsed) ? parsed : null);
      } else {
        setSavedMarriageAudit(null);
      }
    } catch (e) {
      console.error("Error loading saved marriage audit:", e);
    }

    try {
      const storedChild = localStorage.getItem(`leofamily_child_lucky_names_report_${currentKey}`) || localStorage.getItem('leofamily_child_lucky_names_report');
      if (storedChild) {
        const parsed = JSON.parse(storedChild);
        setSavedChildReport(isMatch(parsed) ? parsed : null);
      } else {
        setSavedChildReport(null);
      }
    } catch (e) {
      console.error("Error loading saved child report:", e);
    }

    try {
      const storedDates = localStorage.getItem(`leofamily_lucky_dates_finder_report_${currentKey}`) || localStorage.getItem('leofamily_lucky_dates_finder_report');
      if (storedDates) {
        const parsed = JSON.parse(storedDates);
        setSavedLuckyDatesReport(isMatch(parsed) ? parsed : null);
      } else {
        setSavedLuckyDatesReport(null);
      }
    } catch (e) {
      console.error("Error loading saved lucky dates report:", e);
    }
  }, [profile, personalDetails]);

  const [savedLuckyDatesReport, setSavedLuckyDatesReport] = useState<any>(null);

  // 5-Pillar Structured Category Definition for 32 Master Chapters
  const [selectedPillar, setSelectedPillar] = useState<'ALL' | 'CORE' | 'CAREER' | 'RELATIONSHIPS' | 'VASTU' | 'ACTION'>('ALL');

  const reportPillars = [
    { id: 'ALL', label: 'All Chapters (सम्पूर्ण 32)', range: '01–32' },
    { id: 'CORE', label: '1. Core Foundation', range: '01–09', targetId: 'sec-01' },
    { id: 'CAREER', label: '2. Career & Finance', range: '10–15', targetId: 'sec-10' },
    { id: 'RELATIONSHIPS', label: '3. Relationships & Personal', range: '16–21', targetId: 'sec-13' },
    { id: 'VASTU', label: '4. Occult, Vastu & Dasha', range: '22–28', targetId: 'sec-22' },
    { id: 'ACTION', label: '5. Action Plan & Remedies', range: '29–32', targetId: 'sec-30' },
  ];

  // Quick navigation menu items mapped to 5 pillars
  const navItems = [
    { id: 'sec-cover', pillar: 'CORE', label: '00. Cover Page & Snapshot', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'sec-01', pillar: 'CORE', label: '01. Executive Summary', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'sec-02', pillar: 'CORE', label: '02. Core Numbers & Synthesis', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'sec-03', pillar: 'CORE', label: '03-07. Lo Shu & Grids', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'sec-08', pillar: 'CORE', label: '08-09. Planes & Arrows', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'sec-10', pillar: 'CAREER', label: '10-12. 81 Yogas & Archetype', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'sec-13', pillar: 'CAREER', label: '13-17. Psychological & Life Domains', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'sec-18', pillar: 'RELATIONSHIPS', label: '18. Mobile Numerology (81 Pairs)', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'sec-19', pillar: 'RELATIONSHIPS', label: '19-21. Name (Chaldean & Pythagorean)', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'sec-22', pillar: 'VASTU', label: '22-24. Numero Vastu & Kua', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'sec-25', pillar: 'VASTU', label: '25-27. Personal Year & Vedic Dasha', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'sec-28', pillar: 'VASTU', label: '28. Traditional Wellness', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'sec-29', pillar: 'ACTION', label: '29. LeoFamily Signature Audit Pro', icon: <PenTool className="w-3.5 h-3.5" /> },
    { id: 'sec-29b', pillar: 'ACTION', label: '29B. Vehicle Numerology Pro', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'sec-29c', pillar: 'ACTION', label: '29C. Business Numerology Pro', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'sec-29d', pillar: 'ACTION', label: '29D. Marriage Synastry Pro', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'sec-29e', pillar: 'ACTION', label: '29E. Child Lucky Names Pro', icon: <Baby className="w-3.5 h-3.5" /> },
    { id: 'sec-29f', pillar: 'ACTION', label: '29F. Lucky Dates Finder Pro', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'sec-30', pillar: 'ACTION', label: '30. Consolidated Remedies & 90-Day Plan', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'sec-31', pillar: 'ACTION', label: '31. Final Consultation Summary', icon: <Target className="w-3.5 h-3.5" /> }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (selectedPillar === 'ALL') return true;
    return item.pillar === selectedPillar;
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Upgraded High-Resolution Multi-Page PDF Export
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setPdfGenerating(true);
    try {
      const element = reportRef.current;
      
      // Smooth scroll to top to ensure complete render
      window.scrollTo({ top: 0, behavior: 'instant' as any });

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution crisp text rendering for print quality
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F5',
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Loop for subsequent pages
      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const safeName = (identity.fullName || 'Consultation').replace(/[^a-zA-Z0-9]/g, '_');
      const todayDate = new Date().toISOString().slice(0, 10);
      pdf.save(`LeoFamily_Master_Consultation_${safeName}_${todayDate}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  const profileKey = getProfileIsolationKey({
    name: personalDetails?.name || profile?.identity?.fullName || '',
    dob: personalDetails?.dob || profile?.identity?.dob || '',
    mobile: personalDetails?.mobile || profile?.identity?.mobile || ''
  });

  return (
    <ReportAccessGate
      reportType="MASTER_REPORT"
      profileKey={profileKey}
      profileName={identity.fullName}
      mobile={identity.mobile}
      title={language === 'hi' ? '32-अध्याय महा-परामर्श संपूर्ण रिपोर्ट' : '32-Section Master Consultation Dossier'}
    >
      <div className="space-y-8 animate-in fade-in duration-500 text-left">
      {/* Top Banner with Action Controls */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#D97706]/10 text-[#D97706] font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-[#D97706]/20 font-bold uppercase tracking-wider">
              LeoFamily Premium Consultation Dossier
            </span>
            <span className="text-xs text-[#6B7280] font-medium">32 Master Sections</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1F2937]">
            LeoFamily Master Numerology Consultation Report
          </h2>
          <p className="text-[#6B7280] text-xs mt-1">
            Prepared specially for <strong>{identity.fullName}</strong> • DOB: {formattedDOB} • Mobile: {identity.mobile}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => window.print()}
            title="Print report directly or save as high-quality PDF via browser print dialog"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-[#FAF5EE] text-[#78350F] border border-[#FDE68A] hover:bg-[#FEF3C7] shadow-xs hover:shadow transition-all cursor-pointer group"
          >
            <Printer className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={pdfGenerating}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{pdfGenerating ? 'Generating Master PDF...' : 'Download Master PDF'}</span>
          </button>
        </div>
      </div>

      {/* 5-Pillar Category & Quick Jump Navigation Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 shadow-sm space-y-3 no-print">
        {/* Top: 5 Pillar Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {reportPillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => {
                setSelectedPillar(pillar.id as any);
                if (pillar.targetId) {
                  scrollToSection(pillar.targetId);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedPillar === pillar.id
                  ? 'bg-stone-900 text-amber-300 shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <span>{pillar.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedPillar === pillar.id ? 'bg-amber-400/20 text-amber-200' : 'bg-stone-200/60 text-stone-500'
              }`}>
                {pillar.range}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: Fast Chapter Select Dropdown */}
        <div className="md:hidden pt-1">
          <label htmlFor="mobile-chapter-select" className="sr-only">Jump to Chapter</label>
          <select
            id="mobile-chapter-select"
            value={activeSection}
            onChange={(e) => scrollToSection(e.target.value)}
            className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: Chapter Jump Pills */}
        <div className="hidden md:flex gap-1.5 overflow-x-auto pt-1 quick-jump-nav">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-[#D97706] text-white shadow-xs font-bold'
                  : 'bg-[#F8F4EF] hover:bg-[#F2E8DC] text-[#4B5563]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border border-amber-200/80 rounded-3xl p-5 shadow-xs no-print">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-100/80 rounded-2xl border border-amber-200 text-[#B45309] flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-playfair text-sm md:text-base font-bold text-[#92400E]">
              LeoFamily Unified Cosmic Synthesis (संयुक्त ऊर्जा सामंजस्य)
            </h4>
            <p className="text-xs text-[#78350F] mt-1 leading-relaxed">
              आपके प्रोफाइल में मूलांक <strong>#{coreNumbers.mulank} ({coreNumbers.mulankGraha})</strong> और भाग्यांक <strong>#{coreNumbers.bhagyank} ({coreNumbers.bhagyankGraha})</strong> के साथ नाम अंक <strong>#{nameNumerology?.chaldean.rootNumber || 5}</strong> एवं मोबाइल कम्पाउंड <strong>#{mobileAnalysis?.compoundTotal || 41}</strong> का एक मजबूत तालमेल दिखाई दे रहा है। जीवन के निर्णय लेते समय बुध, सूर्य एवं गुरु की सकारात्मक ऊर्जा का उपयोग करना आपके लिए अत्यंत फलदायी रहेगा।
            </p>
          </div>
        </div>
      </div>

      {/* MAIN MASTER REPORT CONTAINER */}
      <div id="master-report-container" ref={reportRef} className="space-y-10 bg-[#FAF8F5] p-4 md:p-8 rounded-3xl border border-[#E5E7EB] text-[#1F2937] master-report-dossier">

        {/* ========================================================================= */}
        {/* COVER PAGE (PREMIUM A4 PORTRAIT) */}
        {/* ========================================================================= */}
        <section
          id="sec-cover"
          className="print-page-break print-avoid-break bg-white rounded-3xl p-8 md:p-12 border-2 border-amber-300/80 shadow-md space-y-8 min-h-[880px] flex flex-col justify-between relative overflow-hidden"
          style={{ breakAfter: 'page', pageBreakAfter: 'always' }}
        >
          {/* Subtle Decorative Background & Sacred Geometry Borders */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-100/50 via-orange-100/20 to-transparent rounded-bl-full pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100/40 via-yellow-100/20 to-transparent rounded-tr-full pointer-events-none -z-0" />
          
          <div className="relative z-10 space-y-7">
            {/* Header / Brand Crest */}
            <div className="text-center space-y-3 border-b-2 border-amber-200/80 pb-6">
              <div className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl shadow-sm mb-1">
                <BrandLogo size="xl" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#B45309] uppercase block">
                  LEOFAMILY ASTRO-NUMEROLOGY & VEDIC SYSTEMS
                </span>
                <h1 className="font-playfair text-3xl md:text-5xl font-black text-[#1F2937] tracking-tight mt-1">
                  LEOFAMILY
                </h1>
                <h2 className="font-playfair text-lg md:text-2xl font-bold text-[#92400E] mt-1">
                  Complete Indian Numerology & Vedic Guidance Report
                </h2>
                <p className="text-xs text-[#6B7280] mt-1 font-serif italic">
                  सम्पूर्ण भारतीय अंक ज्योतिष, लो-शू ऊर्जा ग्रिड एवं वैदिक महादशा परामर्श प्रतिवेदन
                </p>
              </div>
            </div>

            {/* Client Credentials Profile Card */}
            <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#FDE68A] shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-amber-200 pb-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#D97706]" /> Client Identification Record
                </span>
                <span className="text-[10px] font-mono bg-[#D97706] text-white px-2.5 py-0.5 rounded-full font-bold">
                  Confidential Dossier
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#6B7280] block uppercase font-mono font-semibold">Client Name</span>
                  <span className="text-sm font-bold text-[#1F2937] block mt-0.5">{identity.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block uppercase font-mono font-semibold">Date of Birth</span>
                  <span className="text-sm font-bold text-[#92400E] block mt-0.5">{formattedDOB}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block uppercase font-mono font-semibold">Mobile Number</span>
                  <span className="text-sm font-bold text-[#1F2937] block mt-0.5">{identity.mobile || '9876543210'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block uppercase font-mono font-semibold">Gender / Energy</span>
                  <span className="text-sm font-bold text-[#1F2937] block mt-0.5">{identity.gender || 'MALE'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-amber-200/60 text-[11px] text-[#6B7280]">
                <div>
                  <span>Report Generated: <strong>{formattedReportDate}</strong></span>
                </div>
                <div>
                  <span>Language / भाषा: <strong>{language.toUpperCase()} (Canonical Hindi + Multilingual)</strong></span>
                </div>
                <div>
                  <span>System: <strong>Chaldean + Vedic + Lo Shu Unified</strong></span>
                </div>
              </div>
            </div>

            {/* Core 5 + Kua Primary Consultation Numbers */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#92400E] block text-center">
                ★ Core Astro-Numerical Frequency Matrix ★
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">मूलांक (Driver)</span>
                  <span className="text-2xl font-playfair font-black text-[#B45309] block">#{coreNumbers.mulank}</span>
                  <span className="text-[10px] text-[#78350F] font-medium">{coreNumbers.mulankGraha}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">भाग्यांक (Destiny)</span>
                  <span className="text-2xl font-playfair font-black text-[#B45309] block">#{coreNumbers.bhagyank}</span>
                  <span className="text-[10px] text-[#78350F] font-medium">{coreNumbers.bhagyankGraha}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">Name Number</span>
                  <span className="text-2xl font-playfair font-black text-[#B45309] block">
                    #{nameNumerology?.chaldean.rootNumber || 5}
                  </span>
                  <span className="text-[10px] text-[#78350F] font-medium">
                    Chaldean {nameNumerology?.chaldean.compoundNumber || 32}
                  </span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">Mobile Root</span>
                  <span className="text-2xl font-playfair font-black text-[#B45309] block">
                    #{mobileAnalysis?.rootNumber || 5}
                  </span>
                  <span className="text-[10px] text-[#78350F] font-medium">
                    Total {mobileAnalysis?.compoundTotal || 41}
                  </span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">Personal Year</span>
                  <span className="text-2xl font-playfair font-black text-[#B45309] block">#{personalYearVal}</span>
                  <span className="text-[10px] text-[#78350F] font-medium">{currentYear} Cycle</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-xs">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">Kua Number</span>
                  <span className="text-2xl font-playfair font-black text-[#B45309] block">#{kuaProfile.kuaNumber}</span>
                  <span className="text-[10px] text-[#78350F] font-medium">
                    {kuaProfile.group === 'WEST_GROUP' ? 'पश्चिम समूह' : 'पूर्व समूह'}
                  </span>
                </div>
              </div>
            </div>

            {/* Consultant Snapshot */}
            <div className="p-6 bg-gradient-to-r from-amber-500/10 via-[#FAF5EE] to-amber-500/5 rounded-2xl border-2 border-[#D97706]/40 space-y-4">
              <div className="flex justify-between items-center border-b border-amber-200/80 pb-2.5">
                <span className="font-playfair font-bold text-sm text-[#92400E] flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D97706] fill-amber-400" />
                  CONSULTANT SNAPSHOT (मुख्य परामर्शदाता स्नैपशॉट)
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#D97706] text-white px-2.5 py-0.5 rounded-full">
                  Executive Briefing
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block font-bold text-[10px] uppercase">1. प्रमुख ऊर्जा (Dominant Energy):</strong>
                  <p className="text-[#4B5563] text-xs leading-relaxed">{localizedDossier.consultantSnapshot.dominantEnergy || expertDossier.consultantSnapshot.dominantEnergyHi}</p>
                </div>
                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block font-bold text-[10px] uppercase">2. मूल जीवन विषय (Core Life Theme):</strong>
                  <p className="text-[#4B5563] text-xs leading-relaxed">{localizedDossier.consultantSnapshot.coreVerdict || expertDossier.consultantSnapshot.coreVerdictHi}</p>
                </div>
                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block font-bold text-[10px] uppercase">3. मुख्य सामर्थ्य (Key Strengths):</strong>
                  <p className="text-[#4B5563] text-xs leading-relaxed">
                    {interpretations.career.strengths.slice(0, 3).join(', ') || localizedDossier.consultantSnapshot.bestAvenue || 'बौद्धिक स्पष्टता, कूटनीतिक संवाद, रणनीतिक प्रबंधन एवं त्वरित निर्णय क्षमता'}
                  </p>
                </div>
                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block font-bold text-[10px] uppercase">4. मुख्य चुनौतियाँ व सावधानी (Key Challenges):</strong>
                  <p className="text-[#4B5563] text-xs leading-relaxed">{localizedDossier.consultantSnapshot.strategicCaution || expertDossier.consultantSnapshot.strategicCautionHi}</p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-100/70 rounded-xl border border-amber-300 text-xs text-[#78350F] flex items-start gap-2.5">
                <Target className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>वर्तमान रणनीतिक ध्यान (Current Focus):</strong> {localizedDossier.expertSummary.timeCycleGuidance || expertDossier.expertSummary.timeCycleGuidance || 'व्यक्तिगत वर्ष एवं महादशा के अनुसार नए अवसरों की योजना बनाएं और निरंतर कर्म पर एकाग्र रहें।'}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Page Footer Seal */}
          <div className="relative z-10 border-t-2 border-amber-200/80 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#6B7280] gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D97706]" />
              <span>Certified LeoFamily Vedic & Numerological Consultation Engine</span>
            </div>
            <div className="font-serif italic text-[#92400E]">
              "यथा पिण्डे तथा ब्रह्माण्डे" • (As in the Microcosm, so in the Macrocosm)
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 01. EXECUTIVE SUMMARY */}
        {/* ========================================================================= */}
        <section id="sec-01" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapter 01</span>
                <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded font-bold border border-stone-200">Sample Section 3 & 8: Executive Core</span>
              </div>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#1F2937]">Executive Summary & Consultant Snapshot (कार्यकारी सारांश)</h3>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D97706]" /> LeoFamily Expert Consultation
            </span>
          </div>

          {/* 1. Methodology Transparency Legend Bar */}
          <div className="p-3.5 bg-white rounded-2xl border border-stone-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D97706]" />
              <span className="font-bold text-stone-800 text-[11px]">LeoFamily परामर्श पारदर्शिता मानक (Trust & Methodology Framework):</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
                [CALCULATED] प्रत्यक्ष गणितीय तथ्य
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                [INTERPRETED] वैदिक व चाल्डियन पद्धति
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                [RECOMMENDED] व्यवहारिक मार्गदर्शन
              </span>
            </div>
          </div>

          {/* 2. Consultant Snapshot Card */}
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-[#FAF5EE] to-amber-500/5 rounded-2xl border-2 border-[#D97706]/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
              <span className="font-playfair font-bold text-sm text-[#92400E] flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D97706] fill-amber-400" />
                मुख्य परामर्शदाता स्नैपशॉट (Consultant Executive Snapshot)
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#D97706] text-white px-2.5 py-0.5 rounded-full w-fit">
                Vedic + Chaldean Harmonized
              </span>
            </div>
            <p className="text-xs text-[#78350F] leading-relaxed font-medium">
              {localizedDossier.consultantSnapshot.coreVerdict || expertDossier.consultantSnapshot.coreVerdictHi}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold text-[10px] uppercase">प्रमुख ऊर्जा (Dominant Energy):</strong>
                <span className="text-[#4B5563]">{localizedDossier.consultantSnapshot.dominantEnergy || expertDossier.consultantSnapshot.dominantEnergyHi}</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold text-[10px] uppercase">सर्वोत्तम क्षेत्र (Best Avenues):</strong>
                <span className="text-[#4B5563]">{localizedDossier.consultantSnapshot.bestAvenue || expertDossier.consultantSnapshot.bestAvenueHi}</span>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold text-[10px] uppercase">रणनीतिक सावधानी (Strategic Caution):</strong>
                <span className="text-[#4B5563]">{localizedDossier.consultantSnapshot.strategicCaution || expertDossier.consultantSnapshot.strategicCautionHi}</span>
              </div>
            </div>
          </div>

          {/* Standout Profile Narrative */}
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-300/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-playfair font-bold text-xs text-[#92400E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                {language === 'hi' ? 'आपकी जन्म कुंडली में क्या विशिष्ट है? (Key Takeaway)' : 'What Stands Out in Your Profile?'}
              </span>
              <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-200/70 px-2 py-0.5 rounded">
                Tier-1 Prioritized
              </span>
            </div>
            <p className="text-xs text-[#78350F] leading-relaxed font-medium">
              {language === 'hi' ? advancedInsightDossier.standoutProfileNarrative.hi : advancedInsightDossier.standoutProfileNarrative.en}
            </p>
          </div>

          {/* 3. YOUR KEY PATTERNS & CROSS-ANALYSIS (5 Dedicated Personalized Findings) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/80 pb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#92400E] font-playfair flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                आपके 5 प्रमुख व्यक्तिगत पैटर्न (Your Key Cross-Patterns Analysis)
              </h4>
              <span className="text-[10px] font-mono text-stone-500">
                Calculated Across All 32 Analytical Dimensions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {patternDossier.allDetectedPatterns.map((pat, idx) => {
                const matchingAdvanced = advancedInsightDossier.allValidatedInsights.find(
                  (ai) => ai.id.toLowerCase().includes(pat.id.replace(/-/g, '_').toLowerCase()) || (ai.type as string) === (pat.category as string)
                ) || advancedInsightDossier.primaryInsights[idx % advancedInsightDossier.primaryInsights.length];

                return (
                  <div
                    key={pat.id}
                    className={`p-4 rounded-2xl border-2 space-y-2.5 transition-all ${
                      pat.category === 'CONTRASTING_TENSION'
                        ? 'bg-amber-50/70 border-amber-300'
                        : pat.category === 'KARMIC_LESSON'
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-white border-amber-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5">
                      <span className="font-mono font-bold text-[10px] text-[#D97706] bg-amber-100/80 px-2 py-0.5 rounded">
                        PATTERN 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 font-semibold">
                        {pat.category.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-sm text-stone-900 font-playfair">
                        {pat.titleHi}
                      </h5>
                      <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                        {pat.descriptionHi}
                      </p>
                    </div>

                    {/* Why This Matters Box */}
                    <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-stone-200 text-[10px] space-y-1">
                      <strong className="text-amber-900 block font-bold">💡 Why This Matters (यह क्यों महत्वपूर्ण है):</strong>
                      <p className="text-stone-600 leading-relaxed">{pat.whyThisMattersHi}</p>
                    </div>

                    {/* Practical Guidance & Quick Jump Anchor */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[10px]">
                      <span className="text-emerald-800 font-medium">
                        <strong>कार्य बिंदु: </strong> {pat.practicalFocusHi}
                      </span>
                      <div className="flex items-center gap-2">
                        {matchingAdvanced && (
                          <button
                            type="button"
                            onClick={() => setSelectedProvenanceInsight(matchingAdvanced)}
                            className="text-stone-500 hover:text-amber-800 font-mono font-semibold text-[9px] bg-stone-100 px-2 py-1 rounded cursor-pointer border border-stone-200"
                            title="पद्धति एवं नियम सत्यापन (Why Am I Seeing This?)"
                          >
                            🔬 नियम विवरण
                          </button>
                        )}
                        {pat.relatedChapterIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => scrollToSection(pat.relatedChapterIds[0])}
                            className="text-[#D97706] hover:underline font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer"
                          >
                            <span>अध्याय देखें →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-center">
              <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">मूलांक (Driver)</span>
              <span className="text-2xl font-playfair font-black text-[#B45309] block">#{coreNumbers.mulank}</span>
              <span className="text-[10px] text-[#78350F]">{coreNumbers.mulankGraha}</span>
            </div>
            <div className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-center">
              <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">भाग्यांक (Destiny)</span>
              <span className="text-2xl font-playfair font-black text-[#B45309] block">#{coreNumbers.bhagyank}</span>
              <span className="text-[10px] text-[#78350F]">{coreNumbers.bhagyankGraha}</span>
            </div>
            <div className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-center">
              <span className="text-[10px] font-mono text-[#92400E] uppercase block font-bold">Personal Year</span>
              <span className="text-2xl font-playfair font-black text-[#B45309] block">#{personalYearVal}</span>
              <span className="text-[10px] text-[#78350F]">{currentYear} Cycle</span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">Dominant Number</span>
              <span className="text-2xl font-playfair font-black text-emerald-700 block">
                #{repeatedNums.length > 0 ? repeatedNums[0].digit : coreNumbers.mulank}
              </span>
              <span className="text-[10px] text-emerald-600">Active Focus</span>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] font-mono text-rose-800 uppercase block font-bold">Key Missing Number</span>
              <span className="text-2xl font-playfair font-black text-rose-700 block">
                {missingNums.length > 0 ? `#${missingNums[0]}` : 'None'}
              </span>
              <span className="text-[10px] text-rose-600">Growth Area</span>
            </div>
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-center">
              <span className="text-[10px] font-mono text-blue-800 uppercase block font-bold">Strongest Plane</span>
              <span className="text-xs font-bold text-blue-900 block mt-2">
                {planes.find(p => p.status === 'COMPLETE')?.name || 'Action Plane'}
              </span>
              <span className="text-[9px] text-blue-600">Harmonized</span>
            </div>
          </div>

          {/* Three Life Pillars Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#E5E7EB]">
              <strong className="text-[#B45309] font-bold block mb-1 uppercase text-[10px]">💼 Career Theme:</strong>
              <p className="text-[#4B5563] leading-relaxed">
                {interpretations.career.strengths.slice(0, 2).join(', ') || 'नेतृत्व, संचार एवं रणनीतिक प्रबंधन'} के क्षेत्र में उत्कृष्ट संभावनाएं।
              </p>
            </div>
            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#E5E7EB]">
              <strong className="text-rose-700 font-bold block mb-1 uppercase text-[10px]">💕 Relationship Theme:</strong>
              <p className="text-[#4B5563] leading-relaxed">
                {relationship.emotionalNeeds || 'पारस्परिक सम्मान, बौद्धिक संवाद एवं स्पष्ट भावनात्मक सामंजस्य की आवश्यकता।'}
              </p>
            </div>
            <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#E5E7EB]">
              <strong className="text-emerald-700 font-bold block mb-1 uppercase text-[10px]">💰 Wealth Theme:</strong>
              <p className="text-[#4B5563] leading-relaxed">
                {finance.wealthCreationStyle || 'स्थिर एवं दीर्घकालिक निवेश दृष्टिकोण। जल्दबाजी में जोखिम लेने से बचें।'}
              </p>
            </div>
          </div>

          {/* LeoFamily की मुख्य सलाह */}
          <div className="p-4 bg-[#FAF5EE] border-l-4 border-[#D97706] rounded-r-2xl">
            <h4 className="font-playfair text-sm font-bold text-[#92400E] mb-1">LeoFamily की मुख्य सलाह</h4>
            <p className="text-xs text-[#78350F] leading-relaxed font-medium">
              "अपने मूलांक #{coreNumbers.mulank} की स्वाभाविक प्रतिभा को आगे रखें और मिसिंग अंकों के लिए सरल पारंपरिक उपाय अपनाएं। नाम एवं मोबाइल नंबर के कम्पाउंड को हमेशा मित्र ग्रहों के अंक पर संतुलित रखें ताकि आपके प्रयासों में व्यर्थ रुकावट न आए।"
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 02. CORE NUMBERS & SYNTHESIS */}
        {/* ========================================================================= */}
        <section id="sec-02" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapter 02</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">Sample Section 1: Driver & Conductor Analysis</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Core Numbers, Tithi Frequency & Planetary Aspect (मूलांक, भाग्यांक एवं ग्रह दृष्टि)</h3>
          </div>

          {/* 2. Core Numbers Detailed Interpretation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-3">
              <div className="flex justify-between items-center border-b border-[#FDE68A] pb-2">
                <div>
                  <span className="font-bold text-sm text-[#92400E] block">मूलांक (Driver / Birth Number): #{coreNumbers.mulank}</span>
                  <span className="text-[11px] font-semibold text-[#78350F]">{mPlanet.cosmicNature}</span>
                </div>
                <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[#FDE68A] text-[#92400E] font-bold">
                  स्वामी: {coreNumbers.mulankGraha} ({mPlanet.element})
                </span>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed">
                <strong>मूल स्वभाव एवं बाह्य व्यक्तित्व:</strong> {mulankDef.mulankMeaning}
              </p>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                <strong>मानसिक एवं व्यावहारिक दृष्टिकोण:</strong> {mulankDef.personality} {mulankDef.communication}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#4B5563] pt-1">
                <div className="p-2 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block">करियर एवं नेतृत्व:</strong>
                  <span>{mulankDef.career}</span>
                </div>
                <div className="p-2 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block">धन एवं संबंध:</strong>
                  <span>{mulankDef.wealth}</span>
                </div>
              </div>
              <div className="text-[11px] bg-white/90 p-2.5 rounded-xl border border-amber-200 text-[#78350F] space-y-1">
                <div><strong>परामर्श मार्गदर्शन:</strong> {coreNumbers.synthesis?.instinctiveNature || coreNumbers.synthesis?.summary}</div>
                <div className="text-[10px] text-[#92400E]">
                  <strong>अधिष्ठाता देवता:</strong> {mPlanet.deity} • <strong>मित्र अंक:</strong> {mPlanet.friendlyNumbers.join(', ')} • <strong>शत्रु अंक:</strong> {mPlanet.enemyNumbers.length ? mPlanet.enemyNumbers.join(', ') : 'कोई नहीं'}
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-3">
              <div className="flex justify-between items-center border-b border-[#FDE68A] pb-2">
                <div>
                  <span className="font-bold text-sm text-[#92400E] block">भाग्यांक (Conductor / Destiny Number): #{coreNumbers.bhagyank}</span>
                  <span className="text-[11px] font-semibold text-[#78350F]">{bPlanet.cosmicNature}</span>
                </div>
                <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[#FDE68A] text-[#92400E] font-bold">
                  स्वामी: {coreNumbers.bhagyankGraha} ({bPlanet.element})
                </span>
              </div>
              <p className="text-xs text-[#374151] leading-relaxed">
                <strong>जीवन पथ एवं कर्म दिशा:</strong> {bhagyankDef.bhagyankMeaning}
              </p>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                <strong>दीर्घकालिक परिपक्वता एवं आध्यात्मिक झुकाव:</strong> {bhagyankDef.personality} {bhagyankDef.spirituality}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#4B5563] pt-1">
                <div className="p-2 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block">व्यावसायिक परिपक्वता:</strong>
                  <span>{bhagyankDef.business}</span>
                </div>
                <div className="p-2 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block">पारिवारिक एवं सामाजिक दायित्व:</strong>
                  <span>{bhagyankDef.family}</span>
                </div>
              </div>
              <div className="text-[11px] bg-white/90 p-2.5 rounded-xl border border-amber-200 text-[#78350F] space-y-1">
                <div><strong>भाग्य का आह्वान:</strong> {coreNumbers.synthesis?.destinyTrajectory || coreNumbers.synthesis?.integrationAdvice}</div>
                <div className="text-[10px] text-[#92400E]">
                  <strong>अधिष्ठाता देवता:</strong> {bPlanet.deity} • <strong>मित्र अंक:</strong> {bPlanet.friendlyNumbers.join(', ')} • <strong>शत्रु अंक:</strong> {bPlanet.enemyNumbers.length ? bPlanet.enemyNumbers.join(', ') : 'कोई नहीं'}
                </div>
              </div>
            </div>
          </div>

          {/* 7. Detailed DOB / Tithi Ank Analysis */}
          <div className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#E5E7EB] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-playfair font-bold text-xs text-[#92400E] uppercase tracking-wider">
                7. जन्म तिथि / तिथि अंक विश्लेषण (Detailed DOB & Compound Frequency)
              </span>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Birth Day: #{expertDossier.tithiAnkAnalysis.birthDate}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4B5563]">
              <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#FDE68A]">
                <strong className="text-[#92400E] block font-bold mb-1">कम्पाउंड नाम / उपाधि:</strong>
                <span>{expertDossier.tithiAnkAnalysis.compoundTitle}</span>
              </div>
              <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#FDE68A]">
                <strong className="text-[#92400E] block font-bold mb-1">तिथि ऊर्जा स्वभाव:</strong>
                <span>{expertDossier.tithiAnkAnalysis.tithiNatureHi}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#78350F] bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed">
              {expertDossier.tithiAnkAnalysis.numericalFrequencyHi}
            </p>
          </div>

          {/* 16. Grah Drishti & Planetary Synergy */}
          <div className="p-4 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-playfair font-bold text-xs text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#D97706]" /> 16. ग्रह दृष्टि एवं अंतर्संबंध (Grah Drishti & Planetary Synergy)
              </span>
              <span className="text-[10px] font-mono bg-[#D97706] text-white px-2 py-0.5 rounded font-bold">
                {expertDossier.grahDrishti.relationshipLabelHi}
              </span>
            </div>
            <p className="text-xs text-[#78350F] leading-relaxed">
              {expertDossier.grahDrishti.synergyNarrativeHi}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {expertDossier.grahDrishti.dominantAspects.map((asp, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-amber-200/80 space-y-1">
                  <div className="text-[10px] font-bold text-[#92400E]">{asp.planetPair}</div>
                  <div className="text-[11px] font-semibold text-[#1F2937]">{asp.vibeHi}</div>
                  <div className="text-[10px] text-[#6B7280] leading-snug">{asp.lifeImpactHi}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03-07. LOSHU BIRTH GRID, ENHANCED GRID & NUMERICAL PARAMETERS */}
        {/* ========================================================================= */}
        <section id="sec-03" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 03 – 07</span>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">Sample Section 4 & 5: Lo Shu Natal Matrix & Number Frequencies</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">
              Birth Lo Shu Grid vs. Enhanced LeoFamily Grid & Per-Number Frequency Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Birth Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center justify-between">
                <span>1. Birth Lo Shu Grid (जन्म ग्रिड)</span>
                <span className="text-[9px] font-mono text-[#6B7280]">DOB Digits Only</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 bg-[#FAF5EE] p-3 rounded-2xl border border-[#E5E7EB]">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                  const count = birthGrid[num] || 0;
                  return (
                    <div
                      key={num}
                      className={`h-14 rounded-xl flex flex-col items-center justify-center border transition-all ${
                        count > 0
                          ? 'bg-white border-[#D97706] text-[#B45309] shadow-xs font-bold'
                          : 'bg-transparent border-dashed border-gray-200 text-gray-300 font-light'
                      }`}
                    >
                      <span className="text-xs font-mono text-gray-400 font-normal">#{num}</span>
                      <span className="text-sm font-playfair">{count > 0 ? Array(count).fill(num).join('') : '-'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center justify-between">
                <span>2. Enhanced LeoFamily Grid</span>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  + Driver & Destiny Added
                </span>
              </h4>
              <div className="grid grid-cols-3 gap-2 bg-amber-50/40 p-3 rounded-2xl border border-amber-200">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
                  const count = enhancedGrid[num] || 0;
                  const isDestiny = coreNumbers.bhagyank === num;
                  const isAddedByDestiny = isDestiny && (birthGrid[num] || 0) === 0;

                  return (
                    <div
                      key={num}
                      className={`h-14 rounded-xl flex flex-col items-center justify-center border transition-all relative ${
                        count > 0
                          ? 'bg-white border-[#D97706] text-[#B45309] shadow-xs font-bold'
                          : 'bg-transparent border-dashed border-gray-200 text-gray-300 font-light'
                      }`}
                    >
                      <span className="text-[9px] font-mono text-gray-400 font-normal">#{num}</span>
                      <span className="text-sm font-playfair">{count > 0 ? Array(count).fill(num).join('') : '-'}</span>
                      {isAddedByDestiny && (
                        <span className="text-[7px] text-emerald-700 font-mono absolute bottom-0.5 font-bold uppercase">
                          Destiny Added
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid Parameters Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">उपस्थित अंक (Present Numbers):</strong>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {presentNums.map(n => (
                  <span key={n} className="px-2 py-0.5 bg-white text-[#B45309] font-mono font-bold rounded-lg border border-[#FDE68A]">
                    #{n} ({enhancedGrid[n]}x)
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200">
              <strong className="text-rose-900 block font-bold mb-1">मिसिंग अंक (Enhanced Missing):</strong>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {missingNums.length > 0 ? (
                  missingNums.map(n => (
                    <span key={n} className="px-2 py-0.5 bg-white text-rose-700 font-mono font-bold rounded-lg border border-rose-200">
                      #{n}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-700 font-semibold">सभी अंक ग्रिड में उपस्थित हैं।</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
              <strong className="text-blue-900 block font-bold mb-1">दोहराए गए अंक (Repeated Numbers):</strong>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {repeatedNums.length > 0 ? (
                  repeatedNums.map(r => (
                    <span key={r.digit} className="px-2 py-0.5 bg-white text-blue-800 font-mono font-bold rounded-lg border border-blue-200">
                      #{r.digit} ({r.count} बार)
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">संतुलित आवृत्ति (No excess repeats)</span>
                )}
              </div>
            </div>
          </div>

          {/* Per-Number Present & Repetition Detailed Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              3. उपस्थित एवं दोहराए गए अंकों का विस्तृत प्रभाव (Present & Repetition Frequency Analysis)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {presentNums.map((digit) => {
                const count = enhancedGrid[digit] || 1;
                const levelKey = count === 1 ? 'SINGLE' : count === 2 ? 'DOUBLE' : count === 3 ? 'TRIPLE' : 'QUADRUPLE_PLUS';
                const nDef = NUMBER_DEFINITIONS[digit];
                const repDetail = nDef?.repetitionMeaning?.[levelKey];
                const rep = repeatedNums.find(r => r.digit === digit);
                return (
                  <div key={digit} className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1.5">
                    <div className="flex items-center justify-between border-b border-[#FDE68A] pb-1.5">
                      <strong className="text-[#92400E] font-bold">
                        अंक #{digit} ({rep?.graha || getPlanetName(digit, language)}) — {count}x आवृत्ति
                      </strong>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#B45309] font-bold">
                        {repDetail?.countDesc || rep?.level || levelKey}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#374151] leading-relaxed">{repDetail?.practicalExpression || rep?.meaning || nDef?.personality}</p>
                    <p className="text-[11px] text-[#4B5563] leading-relaxed">
                      <strong>सकारात्मक शक्ति:</strong> {repDetail?.strengthenedQualities || rep?.positiveExpression}
                    </p>
                    <p className="text-[11px] text-[#78350F] leading-relaxed">
                      <strong>संतुलन सूत्र:</strong> {repDetail?.possibleExcess || rep?.possibleExcess} • {repDetail?.balancingRecommendation || rep?.balanceRecommendation}
                    </p>
                    {nDef?.career && (
                      <p className="text-[10px] text-gray-600 pt-1 border-t border-amber-200/60">
                        <strong>कार्यक्षेत्र प्रभाव:</strong> {nDef.career}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Number Missing Numbers & Karmic Remedies Breakdown */}
          {loshu.missingNumbers && loshu.missingNumbers.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                4. अनुपस्थित (Missing) अंकों का प्रभाव एवं व्यावहारिक संतुलन उपाय
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {loshu.missingNumbers.map((miss) => {
                  const isCompensated = presentNums.includes(miss.digit);
                  const nDef = NUMBER_DEFINITIONS[miss.digit];
                  const mDetail = nDef?.missingMeaning;
                  return (
                    <div key={miss.digit} className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200 space-y-1.5">
                      <div className="flex items-center justify-between border-b border-rose-200/80 pb-1.5">
                        <strong className="text-rose-950 font-bold">
                          मिसिंग अंक #{miss.digit} ({miss.graha} • {miss.element})
                        </strong>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isCompensated ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                          {isCompensated ? 'मूलांक/भाग्यांक से पूरित' : 'जन्म ग्रिड में अनुपस्थित'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed">{mDetail?.traditionalMeaning || miss.missingTheme}</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        <strong>मनोवैज्ञानिक एवं व्यावहारिक प्रभाव:</strong> {mDetail?.behaviouralManifestation || miss.possibleLifeArea} | {mDetail?.careerImpact || miss.developmentArea}
                      </p>
                      <div className="p-2 bg-white rounded-xl border border-rose-200/70 text-[11px] text-rose-950 space-y-0.5">
                        <div><strong>सरल उपाय (Remedy):</strong> {mDetail?.traditionalRemedy || miss.traditionalRemedyCategory}</div>
                        <div><strong>जीवनशैली अभ्यास:</strong> {mDetail?.practicalDevelopment || miss.behaviouralAdvice}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 08-09. PLANES & MASTER ARROWS */}
        {/* ========================================================================= */}
        <section id="sec-08" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 08 & 09</span>
              <span className="text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">Sample Section 5: Planes & Arrows of Pythagoras</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Planes of Expression & Master Arrows</h3>
          </div>

          {/* Planes Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              1. Eight Traditional Planes (8 मुख्य तल — विस्तृत विश्लेषण)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {planes.map((p, idx) => {
                const planeMaster = MASTER_PLANES.find(
                  (mp) =>
                    mp.digits.join('-') === (p.digits || []).join('-') ||
                    mp.name === p.name
                );
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      p.status === 'COMPLETE'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : p.status === 'PARTIAL'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-black/10 pb-1.5">
                      <div>
                        <strong className="font-bold text-sm block">{planeMaster?.hindiName || p.name}</strong>
                        <span className="text-[10px] text-gray-600">{planeMaster?.domain || p.title}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          p.status === 'COMPLETE'
                            ? 'bg-emerald-200 text-emerald-900'
                            : p.status === 'PARTIAL'
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {p.status} ({p.strengthPercentage ?? p.completionPercentage ?? 0}%)
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-600 flex flex-wrap gap-3">
                      <span>अंक: {(p.digits || []).join('-')}</span>
                      <span>उपस्थित: {p.presentDigits?.length ? p.presentDigits.join(', ') : 'कोई नहीं'}</span>
                      {p.missingDigits?.length ? <span>अनुपस्थित: {p.missingDigits.join(', ')}</span> : null}
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-800">
                      {p.interpretation || planeMaster?.description}
                    </p>
                    {planeMaster && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1 border-t border-black/5">
                        <div>
                          <strong>करियर व वित्त प्रभाव:</strong> {planeMaster.careerImpact} {planeMaster.financialImpact}
                        </div>
                        <div>
                          <strong>संबंध व संतुलन उपाय:</strong> {planeMaster.relationshipImpact} {p.status !== 'COMPLETE' ? `उपाय: ${planeMaster.remedies.join('; ')}` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master Arrows */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              2. Master Arrows Analysis (विशेष ग्रिड तीरों का प्रभाव)
            </h4>
            {arrows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {arrows.map((arrow, idx) => {
                  const arrowMaster = MASTER_ARROWS.find(
                    (ma) => ma.name === arrow.name
                  );
                  return (
                    <div key={idx} className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
                      <div className="flex justify-between items-center border-b border-[#FDE68A] pb-1.5">
                        <strong className="text-sm font-bold text-[#92400E]">{arrowMaster?.hindiName || arrow.name}</strong>
                        <span className="text-[10px] font-bold text-[#B45309] bg-white px-2 py-0.5 rounded border border-[#FDE68A]">
                          {arrow.type === 'STRENGTH' ? 'सक्रिय शक्ति तीर (Present)' : 'अनुपस्थित तीर (Missing Lesson)'} • {(arrow.digits || []).join('-')}
                        </span>
                      </div>
                      <p className="text-xs text-[#374151] leading-relaxed">
                        {arrow.meaning || arrowMaster?.meaning}
                      </p>
                      <div className="text-[11px] text-[#4B5563] space-y-1 bg-white/80 p-2.5 rounded-xl border border-amber-200/70">
                        {arrowMaster?.careerImpact && <div><strong>करियर प्रभाव:</strong> {arrowMaster.careerImpact}</div>}
                        {arrowMaster?.relationshipImpact && <div><strong>संबंध प्रभाव:</strong> {arrowMaster.relationshipImpact}</div>}
                        <div><strong>परामर्श सूत्र:</strong> {arrow.remedy || arrowMaster?.recommendation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-xs text-[#4B5563] leading-relaxed">
                आपके जन्म ग्रिड में कोई भी तीन अंकों की पूर्ण अनुपस्थिति (Missing Arrow) नहीं बन रही है, जो यह दर्शाता है कि आपके व्यक्तित्व में किसी एक दिशा में अत्यधिक खालीपन नहीं है और आप विभिन्न परिस्थितियों में संतुलित प्रतिक्रिया देने में सक्षम हैं।
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10-12. 81 YOGAS, KARMIC LESSONS & DOMINANT ARCHETYPE */}
        {/* ========================================================================= */}
        <section id="sec-10" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 10 – 12</span>
              <span className="text-[10px] font-mono text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-bold">Sample Section 2: Core Traits & 81 Vedic Planetary Yogas</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">81 Combinations, Karmic Matrix, Life Challenges & Archetype</h3>
          </div>

          {/* Active 81 Combination */}
          {combination81 && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-amber-200 pb-2">
                <span className="text-xs font-mono font-bold uppercase bg-[#D97706] text-white px-2.5 py-0.5 rounded-full">
                  81 Yoga Code: {combination81.code} (मूलांक #{coreNumbers.mulank} + भाग्यांक #{coreNumbers.bhagyank})
                </span>
                <span className="font-playfair font-bold text-[#92400E] text-sm">{combination81.title}</span>
              </div>
              <p className="text-xs text-[#78350F] leading-relaxed">
                <strong>सकारात्मक युति फल:</strong> {combination81.positiveMeaning}
              </p>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                <strong>अंतर्निहित द्वंद्व एवं सावधानियां:</strong> {combination81.negativeMeaning}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-2 border-t border-amber-200/60">
                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block mb-0.5">करियर एवं आजीविका (Career):</strong>
                  <span className="text-gray-700">{combination81.careerMeaning}</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block mb-0.5">धन एवं वित्तीय प्रवाह (Wealth):</strong>
                  <span className="text-gray-700">{combination81.wealthMeaning}</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block mb-0.5">संबंध एवं वैवाहिक जीवन (Relationship):</strong>
                  <span className="text-gray-700">{combination81.relationshipMeaning}</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/70">
                  <strong className="text-[#92400E] block mb-0.5">आध्यात्मिक झुकाव एवं उपाय (Remedy):</strong>
                  <span className="text-gray-700">{combination81.spiritualMeaning} • उपाय: {combination81.remedy}</span>
                </div>
              </div>
            </div>
          )}

          {/* 15. Unique About You (विशिष्ट पहचान एवं आंतरिक उपहार) */}
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-[#FAF5EE] to-amber-500/5 rounded-2xl border border-[#FDE68A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-playfair font-bold text-xs text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" /> 15. आपके बारे में क्या विशेष है (Unique About You)
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#D97706] text-white px-2.5 py-0.5 rounded-full">
                Cosmic Blueprint
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">कॉस्मिक हस्ताक्षर (Cosmic Signature):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.uniqueAboutYou.cosmicSignature}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">छिपी हुई प्रतिभा (Hidden Gift):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.uniqueAboutYou.hiddenGift}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">आभा-मंडल प्रभाव (Distinctive Aura):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.uniqueAboutYou.distinctiveAura}</p>
              </div>
            </div>
          </div>

          {/* 6. Life Challenges (जीवन की 4 प्रमुख चुनौतियां एवं समाधान) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
              6. जीवन की प्रमुख चुनौतियां एवं कार्मिक पाठ (4 Life Challenges & Lessons)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {expertDossier.lifeChallenges.map((ch, idx) => (
                <div key={idx} className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1.5">
                  <div className="flex justify-between items-center border-b border-[#FDE68A] pb-1.5">
                    <strong className="text-xs font-bold text-[#92400E]">{ch.name}</strong>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#92400E] font-bold">
                      अंक #{ch.value} ({ch.planet})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#4B5563]">
                    <strong>प्रभाव क्षेत्र:</strong> {ch.areaHi}
                  </div>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    <strong>सीख (Lesson):</strong> {ch.lessonHi}
                  </p>
                  <div className="text-[10px] bg-white/80 p-2 rounded-lg border border-amber-200/60 text-[#78350F]">
                    <strong>उपाय (Remedy):</strong> {ch.remedyHi}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dominant Archetype & Karmic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="text-[#92400E] block font-bold">प्रमुख एवं सहायक व्यक्तित्व आर्किटाइप (Dominant & Secondary Archetype):</strong>
              <h5 className="font-playfair font-bold text-sm text-[#B45309]">
                {personality.title}
              </h5>
              <p className="text-[#4B5563] leading-relaxed">
                {personality.description || `${personality.thinkingStyle} ${personality.decisionMakingStyle}`}
              </p>
              <div className="text-[11px] text-[#78350F] bg-white/80 p-2.5 rounded-xl border border-amber-200/70 space-y-1">
                <div><strong>निर्णय शैली:</strong> {personality.decisionMakingStyle}</div>
                <div><strong>तनाव प्रतिक्रिया:</strong> {personality.stressResponsePattern}</div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="text-[#92400E] block font-bold">कार्मिक ऋण एवं आत्म-विकास (Karmic Debt & Lessons):</strong>
              <p className="text-[#4B5563] leading-relaxed">
                {profile.karmic?.hasKarmicDebt
                  ? `आपकी जन्म कुंडली में कार्मिक ऋण अंक (${profile.karmic.karmicDebtNumbers.map((k) => k.number).join(', ')}) सक्रिय है: ${profile.karmic.karmicDebtNumbers.map((k) => `${k.meaning} — उपाय: ${k.remedy}`).join(' | ')}`
                  : 'आपकी जन्मतिथि में 13, 14, 16 या 19 जैसा कोई प्रत्यक्ष कार्मिक ऋण अंक (Karmic Debt) नहीं है, जो पूर्व संचित ऊर्जा में सापेक्षिक संतुलन दर्शाता है।'}
              </p>
              <div className="text-[11px] text-[#78350F] bg-white/80 p-2.5 rounded-xl border border-amber-200/70">
                <strong>कार्मिक अभ्यास:</strong>{' '}
                {missingNums.length > 0
                  ? `अंक #${missingNums.join(', #')} की ऊर्जा को दैनिक जीवन में धैर्य, संगठनात्मक अनुशासन और नियमित ध्यान के द्वारा संतुलित करें।`
                  : 'आपके पास एक स्वाभाविक संतुलित ऊर्जा ग्रिड है। अपने विचारों को लगातार रचनात्मक कार्यों में लगाएं।'}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13-17. PSYCHOLOGICAL, CAREER, WEALTH & RELATIONSHIP MATRICES */}
        {/* ========================================================================= */}
        <section id="sec-13" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 13 – 17</span>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">Sample Section 3 & 8: Life Domains & Professional Aptitude</span>
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Psychological, Education, Career, Wealth & Family Matrices</h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                [INTERPRETED] Multi-Layer Analysis
              </span>
            </div>
          </div>

          {/* 3. Characteristics Profile */}
          <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-[#92400E] block font-bold uppercase text-xs">3. चारित्रिक एवं मनोवैज्ञानिक विश्लेषण (Characteristics & Psychological Profile)</strong>
              <button
                type="button"
                onClick={() => scrollToSection('sec-02')}
                className="text-[10px] text-[#D97706] hover:underline font-mono font-bold"
              >
                मूलांक विवरण देखें (Ch. 02) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-1">विचार शैली (Thinking Style):</strong>
                {expertDossier.characteristicsProfile.thinkingStyle}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-1">भावनात्मक प्रतिक्रिया (Emotional Response):</strong>
                {expertDossier.characteristicsProfile.emotionalResponse}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-1">कार्यशैली (Work Habit):</strong>
                {expertDossier.characteristicsProfile.workHabit}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-1">सामाजिक आचरण (Social Conduct):</strong>
                {expertDossier.characteristicsProfile.socialConduct}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 sm:col-span-2 leading-relaxed">
                <strong className="text-[#92400E] block mb-1">नेतृत्व गुण एवं संवाद प्रभाव (Leadership & Communication):</strong>
                {expertDossier.characteristicsProfile.leadershipTrait} {personality.communicationStyle}
              </div>
            </div>
            {/* Positive & Negative Characteristics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                <strong className="text-emerald-950 block font-bold text-[11px]">सकारात्मक चारित्रिक गुण (Positive Characteristics):</strong>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  मूलांक #{coreNumbers.mulank} के प्रभाव से {mulankDef.positiveTraits.join(', ')} तथा भाग्यांक #{coreNumbers.bhagyank} के प्रभाव से {bhagyankDef.positiveTraits.join(', ')} आपके व्यक्तित्व के प्रमुख स्तंभ हैं।
                </p>
              </div>
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1">
                <strong className="text-rose-950 block font-bold text-[11px]">विकास क्षेत्र एवं सावधानियां (Shadow Tendencies):</strong>
                <p className="text-[11px] text-rose-900 leading-relaxed">
                  तनाव या अति-सक्रियता की स्थिति में {mulankDef.shadowTraits.join(', ')} तथा {bhagyankDef.shadowTraits.join(', ')} जैसी प्रवृत्तियों से सचेत रहना आवश्यक है।
                </p>
              </div>
            </div>
          </div>

          {/* 10. Education Analysis */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2.5 text-xs">
            <strong className="text-blue-900 block font-bold uppercase text-xs">10. शिक्षा एवं अध्ययन विश्लेषण (Education & Learning Style)</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-blue-200 leading-relaxed">
                <strong className="text-blue-900 block mb-0.5">सीखने की शैली (Learning Approach):</strong>
                {expertDossier.educationAnalysis.learningStyle}
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200 leading-relaxed">
                <strong className="text-blue-900 block mb-0.5">शुभ अध्ययन दिशा (Kua Study Orientation):</strong>
                {expertDossier.educationAnalysis.studyDirection}
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200 leading-relaxed">
                <strong className="text-blue-900 block mb-0.5">शैक्षणिक क्षमताएं (Academic Strengths):</strong>
                {expertDossier.educationAnalysis.academicStrengths.join(' • ')}
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200 leading-relaxed">
                <strong className="text-blue-900 block mb-0.5">अनुकूल विषय एवं विधाएं (Suitable Disciplines):</strong>
                {expertDossier.educationAnalysis.suitableDisciplines.join(', ')}
              </div>
            </div>
          </div>

          {/* 11 & 12. Career Analysis & Most Suitable Work Domains */}
          <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-[#92400E] block font-bold uppercase text-xs">11-12. करियर विश्लेषण एवं उपयुक्त कार्यक्षेत्र (Career Deep-Dive & Registered Professions)</strong>
              <button
                type="button"
                onClick={() => scrollToSection('sec-10')}
                className="text-[10px] text-[#D97706] hover:underline font-mono font-bold"
              >
                81 युति फल देखें (Ch. 10) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5">
                <strong className="text-[#92400E] block">सर्वोत्तम व्यावसायिक क्षेत्र (Primary Avenues):</strong>
                <ul className="list-disc pl-4 space-y-1 text-[#78350F]">
                  {expertDossier.careerDeepDive.primaryAvenues.map((av, idx) => (
                    <li key={idx} className="leading-relaxed">{av}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5 leading-relaxed">
                <div><strong className="text-[#92400E]">उद्यमिता उपयुक्तता (Entrepreneurship):</strong> {expertDossier.careerDeepDive.entrepreneurialFit}</div>
                <div><strong className="text-[#92400E]">कार्यस्थल भूमिका (Workplace Role):</strong> {expertDossier.careerDeepDive.workplaceRole}</div>
                <div className="pt-1 text-[#78350F] border-t border-amber-100"><strong>सफलता की रणनीति:</strong> {expertDossier.careerDeepDive.successStrategy}</div>
              </div>
            </div>
            {matchedProfessions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                {matchedProfessions.map((prof, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#92400E] font-bold">{prof.hindiTitle} ({prof.profession})</strong>
                      <span className="text-[10px] font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[#B45309]">
                        अंक #{prof.requiredNumbers.join(', #')}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{prof.description}</p>
                    <p className="text-[10px] text-gray-500"><strong>शास्त्रीय आधार:</strong> {prof.traditionalInterpretation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 13 & 18. Finance & Money Behaviour & Guidance */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-emerald-900 block font-bold uppercase text-xs">13 & 18. धन व्यवहार एवं वित्तीय मार्गदर्शन (Finance & Wealth Management)</strong>
              <button
                type="button"
                onClick={() => scrollToSection('sec-08')}
                className="text-[10px] text-emerald-800 hover:underline font-mono font-bold"
              >
                समृद्धि तल 4-5-6 देखें (Ch. 08) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 leading-relaxed">
                <strong className="text-emerald-950 block mb-0.5">पूंजी संचय पैटर्न (Wealth Pattern):</strong>
                {expertDossier.financeBehaviour.wealthAccumulationPattern}
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 leading-relaxed">
                <strong className="text-emerald-950 block mb-0.5">निवेश अनुकूलता (Investment Suitability):</strong>
                {expertDossier.financeBehaviour.investmentSuitability}
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 sm:col-span-2 text-emerald-950 leading-relaxed">
                <strong className="block mb-0.5">वित्तीय सावधानी एवं अनुशासन (Financial Caution):</strong>
                {expertDossier.financeBehaviour.financialCaution} {finance.financialRemedies}
              </div>
            </div>
          </div>

          {/* 8 & 9. Relationship Pattern & Family Dynamics */}
          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-rose-900 block font-bold uppercase text-xs">8-9. संबंध एवं पारिवारिक गतिशीलता (Relationships & Family Dynamics)</strong>
              <button
                type="button"
                onClick={() => scrollToSection('sec-29d')}
                className="text-[10px] text-rose-800 hover:underline font-mono font-bold"
              >
                विवाह गुण मिलान देखें (Ch. 29D) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-rose-200 leading-relaxed">
                <strong className="text-rose-950 block mb-0.5">संबंध पैटर्न (Relationship Style):</strong>
                {expertDossier.relationshipFamilyDynamics.relationshipPattern}
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 leading-relaxed">
                <strong className="text-rose-950 block mb-0.5">पारिवारिक भूमिका (Family Role):</strong>
                {expertDossier.relationshipFamilyDynamics.familyRole}
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 sm:col-span-2 text-rose-950 leading-relaxed">
                <strong className="block mb-0.5">पारिवारिक सामंजस्य की कुंजी (Harmony Key):</strong>
                {expertDossier.relationshipFamilyDynamics.harmonyKey} (मित्र संगत अंक: #{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')})
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 18. MOBILE NUMEROLOGY */}
        {/* ========================================================================= */}
        <section id="sec-18" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapter 18</span>
              <span className="text-[10px] font-mono text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-bold">Sample Section 7: Mobile Numerology & 81-Pair Matrix</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Mobile Numerology Diagnostics (मोबाइल अंक विश्लेषण)</h3>
          </div>

          {hasProvidedMobile && mobileAnalysis ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Mobile Number</span>
                  <span className="font-mono text-sm font-bold text-[#B45309] mt-1 block">{identity.mobile}</span>
                </div>
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Total Compound</span>
                  <span className="font-playfair text-xl font-bold text-[#B45309] block">
                    {mobileAnalysis.compoundNumber}
                  </span>
                </div>
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Single Root</span>
                  <span className="font-playfair text-xl font-bold text-[#B45309] block">
                    #{mobileAnalysis.rootNumber}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[9px] font-mono text-emerald-800 block uppercase font-bold">DOB Harmony</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-1.5">
                    {mobileAnalysis.dobCompatibility?.status || `${mobileAnalysis.overallScore}/100`}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-xs space-y-2">
                <strong className="text-[#92400E] block font-bold">
                  मोबाइल कम्पाउंड #{mobileAnalysis.compoundNumber} एवं मूल अंक #{mobileAnalysis.rootNumber} का प्रभाव:
                </strong>
                <p className="text-[#374151] leading-relaxed">
                  {mobileAnalysis.compoundClassification?.meaning || mobileAnalysis.recommendation}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#FDE68A]/70 text-[11px] text-[#4B5563]">
                  <div>
                    <strong>मूलांक #{coreNumbers.mulank} के साथ तालमेल ({mobileAnalysis.mulankCompatibility?.status}):</strong>{' '}
                    {mobileAnalysis.mulankCompatibility?.description}
                  </div>
                  <div>
                    <strong>भाग्यांक #{coreNumbers.bhagyank} के साथ तालमेल ({mobileAnalysis.bhagyankCompatibility?.status}):</strong>{' '}
                    {mobileAnalysis.bhagyankCompatibility?.description}
                  </div>
                </div>
                {mobileAnalysis.missingNumberCompensation && mobileAnalysis.missingNumberCompensation.length > 0 && (
                  <p className="text-[11px] text-[#78350F] pt-1">
                    <strong>लो शू ग्रिड पूरक विश्लेषण:</strong> आपके मोबाइल नंबर से जन्म ग्रिड के मिसिंग अंक{' '}
                    {mobileAnalysis.missingNumberCompensation.filter(m => m.presentInMobile).length
                      ? `#${mobileAnalysis.missingNumberCompensation.filter(m => m.presentInMobile).map(m => m.missingInDob).join(', #')} को आंशिक सहारा मिलता है`
                      : 'की सीधी पूर्ति नहीं होती'}
                    {mobileAnalysis.missingNumberCompensation.filter(m => !m.presentInMobile).length
                      ? `, जबकि अंक #${mobileAnalysis.missingNumberCompensation.filter(m => !m.presentInMobile).map(m => m.missingInDob).join(', #')} अभी भी अनुपस्थित हैं।`
                      : '।'}
                  </p>
                )}
              </div>

              {mobileAnalysis.pairsAnalysis?.length ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#92400E]">Adjacent Pair Analysis (क्रमागत अंक-जोड़े)</h4>
                  <p className="text-[11px] text-gray-500">ये व्याख्याएँ पंजीकृत LeoFamily 81-pair rules से ली गई हैं; इन्हें पारंपरिक अंकशास्त्रीय दृष्टिकोण समझें, निश्चित भविष्यवाणी नहीं।</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mobileAnalysis.pairsAnalysis.map((pair, idx) => (
                      <div key={`${pair.pair}-${idx}`} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-1">
                          <strong className="font-mono text-base text-amber-950">युग्म {pair.pair} ({pair.area})</strong>
                          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-[#92400E] font-bold">
                            {pair.isNegativeToAvoid ? 'सावधानी अपेक्षित' : 'संतुलित / शुभ'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 leading-relaxed">{pair.meaning}</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed"><strong>करियर व वित्त:</strong> {pair.career} | {pair.wealth}</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed"><strong>संबंध प्रभाव:</strong> {pair.relationship}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2 text-xs text-[#4B5563]">
              <strong className="text-[#92400E] block font-bold text-sm">
                इस प्रोफ़ाइल में मोबाइल नंबर दर्ज नहीं किया गया है (Mobile Number Not Provided)
              </strong>
              <p className="leading-relaxed">
                आपने इस रिपोर्ट के लिए केवल जन्मतिथि दर्ज की है, इसलिए किसी काल्पनिक या डिफ़ॉल्ट मोबाइल नंबर का विश्लेषण नहीं दिखाया गया है।
              </p>
              <p className="leading-relaxed text-[#78350F]">
                <strong>आपके मूलांक #{coreNumbers.mulank} एवं भाग्यांक #{coreNumbers.bhagyank} हेतु शुभ मोबाइल कुल योग (Recommended Mobile Root):</strong>{' '}
                पारंपरिक अंकशास्त्र के अनुसार आपके लिए वे मोबाइल नंबर सर्वाधिक अनुकूल रहते हैं जिनका कुल एकल अंक (Single Digit Root){' '}
                <strong>#{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')}</strong> पर आता हो और जिनमें शत्रु अंकों ({Array.from(new Set([...mPlanet.enemyNumbers, ...bPlanet.enemyNumbers])).join(', ') || 'विरोधी युग्मों'}) की पुनरावृत्ति न हो।
              </p>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 19-21. NAME NUMEROLOGY (CHALDEAN & PYTHAGOREAN) */}
        {/* ========================================================================= */}
        <section id="sec-19" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 19 – 21</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">Sample Section 6: Name Numerology & Spelling Balance</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Name Numerology (Chaldean & Pythagorean Engines)</h3>
          </div>

          {hasProvidedName && nameNumerology ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chaldean */}
                <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-[#FDE68A] pb-2">
                    <strong className="font-bold text-sm text-[#92400E]">1. Indian / Chaldean System (1–8)</strong>
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#92400E] font-bold">
                      Compound: #{nameNumerology.chaldean.compoundNumber} → Root #{nameNumerology.chaldean.rootNumber}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {nameNumerology.chaldean.nameBreakdown.map((lb, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white rounded border border-amber-200 font-mono text-[10px] text-[#92400E] font-bold">
                        {lb.letter}={lb.chaldeanValue}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1 text-[11px] text-[#4B5563]">
                    <div><strong>Root Name Number (नाम मूलांक):</strong> #{nameNumerology.chaldean.rootNumber} ({getPlanetName(nameNumerology.chaldean.rootNumber, language)})</div>
                    <div><strong>Compound Title:</strong> {nameNumerology.chaldean.compoundTitle}</div>
                    <div><strong>First Letter ('{nameNumerology.firstLetter.letter}'):</strong> Ruler {nameNumerology.firstLetter.planet} ({nameNumerology.firstLetter.element})</div>
                  </div>
                  <p className="text-[11px] text-[#374151] leading-relaxed">
                    {nameNumerology.chaldean.compoundInterpretationHi}
                  </p>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    <strong>प्रथम अक्षर स्वभाव:</strong> {nameNumerology.firstLetter.personalityInfluenceHi}
                  </p>
                </div>

                {/* Pythagorean */}
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                    <strong className="font-bold text-sm text-blue-900">2. Western / Pythagorean System (1–9)</strong>
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800 font-bold">
                      Expression: #{nameNumerology.pythagorean.expressionNumber}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-[#4B5563]">
                    <div><strong>Expression Compound:</strong> #{nameNumerology.pythagorean.compoundNumber} → Root #{nameNumerology.pythagorean.expressionNumber} ({getPlanetName(nameNumerology.pythagorean.expressionNumber, language)})</div>
                    <div><strong>Soul Urge (आंतरिक प्रेरणा):</strong> #{nameNumerology.pythagorean.soulUrgeNumber} ({getPlanetName(nameNumerology.pythagorean.soulUrgeNumber, language)})</div>
                    <div><strong>Personality Number (बाह्य छवि):</strong> #{nameNumerology.pythagorean.personalityNumber} ({getPlanetName(nameNumerology.pythagorean.personalityNumber, language)})</div>
                  </div>
                  <p className="text-[11px] text-[#374151] leading-relaxed">
                    {nameNumerology.pythagorean.traditionalInterpretationHi}
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-200/80 text-[11px] text-blue-950">
                    <strong>जन्मतिथि के साथ सामंजस्य ({nameNumerology.dobCompatibility.ratingLabel}):</strong>{' '}
                    {nameNumerology.dobCompatibility.comprehensiveReasonWhyHi}
                  </div>
                </div>
              </div>

              {nameNumerology.recommendations && (
                <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 space-y-2 text-xs">
                  <h4 className="font-bold text-indigo-900">Spelling Balance Review (नाम-वर्तनी संतुलन)</h4>
                  <p className="text-gray-700 leading-relaxed">{nameNumerology.recommendations.spellingAssessmentHi}</p>
                  {nameNumerology.recommendations.suggestedAdjustments?.length ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-800">Engine द्वारा सुझाए गए विकल्प — इन्हें अपनाने से पहले स्वयं जाँचें:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {nameNumerology.recommendations.suggestedAdjustments.map((suggestion, idx) => (
                          <div key={`${suggestion.suggestedName}-${idx}`} className="rounded-xl bg-white border border-indigo-100 p-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-950">{suggestion.suggestedName}</span>
                              <span className="font-mono text-[10px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-900 font-bold">
                                Compound {suggestion.suggestedChaldeanCompound} → Root #{suggestion.suggestedChaldeanRoot}
                              </span>
                            </div>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{suggestion.benefitsDescriptionHi}</p>
                            <p className="text-gray-500 text-[10px]">मूलांक तालमेल: {suggestion.mulankCompatibility} · भाग्यांक तालमेल: {suggestion.bhagyankCompatibility}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">वर्तमान नाम वर्तनी जन्मतिथि के साथ संतुलित है; किसी अक्षर परिवर्तन की आवश्यकता नहीं है।</p>
                  )}
                  <p className="text-[10px] text-gray-500">{nameNumerology.recommendations.disclaimer || nameNumerology.recommendations.suggestedAdjustments?.[0]?.standardDisclaimer}</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2 text-xs text-[#4B5563]">
              <strong className="text-[#92400E] block font-bold text-sm">
                इस प्रोफ़ाइल में पूरा नाम दर्ज नहीं किया गया है (Full Name Not Provided for Spelling Analysis)
              </strong>
              <p className="leading-relaxed">
                चूंकि इस गणना में उपयोगकर्ता का वास्तविक नाम दर्ज नहीं किया गया है, इसलिए किसी काल्पनिक नाम या डिफ़ॉल्ट कम्पाउंड (#23) का परिणाम प्रदर्शित नहीं किया गया है।
              </p>
              <p className="leading-relaxed text-[#78350F]">
                <strong>आपके मूलांक #{coreNumbers.mulank} एवं भाग्यांक #{coreNumbers.bhagyank} हेतु शुभ नाम अंक:</strong>{' '}
                Chaldean प्रणाली के अनुसार आपके लिए वे नाम सर्वाधिक शुभ रहते हैं जिनका कुल नामांक (Root Name Number){' '}
                <strong>#{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')}</strong> पर आता हो।
              </p>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 22-24. NUMERO VASTU, KUA & RESIDENCE ANALYSIS */}
        {/* ========================================================================= */}
        <section id="sec-22" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 22 – 24</span>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold">Sample Section 10: Numero Vastu & Spatial Orientation</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Numero Vastu, Kua & Directional Alignment</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Kua Number</span>
              <span className="font-playfair text-2xl font-black text-[#B45309] block">#{kuaProfile.kuaNumber}</span>
              <span className="text-[10px] text-[#78350F]">{kuaProfile.group === 'EAST_GROUP' ? 'पूर्व समूह (East Group)' : 'पश्चिम समूह (West Group)'} • {kuaProfile.element}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[9px] font-mono text-emerald-800 block uppercase font-bold">Career Direction</span>
              <span className="text-xs font-bold text-emerald-900 block mt-2">
                {kuaProfile.favourableDirections?.shengChi || kuaProfile.favorableDirections?.[0]?.direction}
              </span>
              <span className="text-[9px] text-emerald-600">Sheng Chi (समृद्धि व सफलता)</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[9px] font-mono text-blue-800 block uppercase font-bold">Health Direction</span>
              <span className="text-xs font-bold text-blue-900 block mt-2">
                {kuaProfile.favourableDirections?.tianYi || kuaProfile.favorableDirections?.[1]?.direction}
              </span>
              <span className="text-[9px] text-blue-600">Tian Yi (आरोग्य व ऊर्जा)</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <span className="text-[9px] font-mono text-purple-800 block uppercase font-bold">Relationship Zone</span>
              <span className="text-xs font-bold text-purple-900 block mt-2">
                {kuaProfile.favourableDirections?.yanNian || kuaProfile.favorableDirections?.[2]?.direction}
              </span>
              <span className="text-[9px] text-purple-600">Yan Nian (पारिवारिक सौहार्द)</span>
            </div>
          </div>

          {/* All 4 Favorable & 4 Unfavorable Kua Directions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 block font-bold">4 शुभ कुआ दिशाएं (4 Favorable Kua Directions):</strong>
              <div className="space-y-2">
                {kuaProfile.favorableDirections?.map((dir, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200/80 text-[11px]">
                    <div className="flex justify-between font-bold text-emerald-900">
                      <span>{dir.category} ({dir.name})</span>
                      <span>{dir.direction}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5 leading-relaxed">{dir.description} {dir.optimalUse ? `• उपयोग: ${dir.optimalUse}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
              <strong className="text-rose-950 block font-bold">4 सावधानी योग्य दिशाएं (4 Unfavorable Directions to Avoid Facing):</strong>
              <div className="space-y-2">
                {kuaProfile.unfavorableDirections?.map((dir, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-rose-200/80 text-[11px]">
                    <div className="flex justify-between font-bold text-rose-900">
                      <span>{dir.category} ({dir.name})</span>
                      <span>{dir.direction}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5 leading-relaxed">{dir.description} {dir.advice ? `• बचाव: ${dir.advice}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 14. NumeroVastu Interpretation Card */}
          <div className="p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/40 rounded-2xl border border-amber-200 space-y-3 text-xs">
            <span className="font-playfair font-bold text-xs text-[#92400E] uppercase tracking-wider block">
              14. न्यूमेरो वास्तु एवं दिशात्मक फल (NumeroVastu & Room Guidance)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <strong className="text-[#92400E] block">लो शू दिशा संतुलन (Lo Shu Zone Harmony):</strong>
                <p className="leading-relaxed">{expertDossier.numeroVastuInterpretation.loShuZoneHarmonyHi}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <strong className="text-[#92400E] block">आवास / प्रवेश द्वार ऊर्जा:</strong>
                <p className="leading-relaxed">{expertDossier.numeroVastuInterpretation.residenceEntranceDynamicsHi}</p>
              </div>
            </div>
            {vastu?.zonesSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#4B5563]">
                {Object.values(vastu.zonesSummary).map((zone) => (
                  <div key={zone.zone} className="p-2.5 bg-white rounded-xl border border-amber-200/70">
                    <strong className="text-[#92400E]">{zone.zone} ({zone.direction}):</strong> {zone.hindiGuidance}
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-[11px] text-[#78350F]">
              <strong>सरल वास्तु उपाय (Non-Demolition Vastu Remedies):</strong>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                {expertDossier.numeroVastuInterpretation.suggestedVastuRemedies.map((rem, idx) => (
                  <li key={idx} className="leading-relaxed">{rem}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 25-27. PERSONAL YEAR, VEDIC MAHADASHA, PINNACLES & MONTHLY FORECAST */}
        {/* ========================================================================= */}
        <section id="sec-25" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapters 25 – 27</span>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">Sample Section 11: Personal Year & Vedic Timing Analysis</span>
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Time Cycles, Vedic Mahadasha, Pinnacles, Event Windows & Monthly Forecast</h3>
          </div>

          {/* Active Vedic Mahadasha & Antardasha Block */}
          {vedicDasha && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
                <strong className="font-playfair font-bold text-sm text-[#92400E]">
                  वैदिक महादशा एवं अंतर्दशा कालखंड (Active Vedic Numerology Dasha)
                </strong>
                <span className="text-[10px] font-mono bg-[#D97706] text-white px-2.5 py-0.5 rounded-full font-bold">
                  वार अधिष्ठाता (Day Lord): {vedicDasha.dayLord.birthDayOfWeekHi} (#{vedicDasha.dayLord.dayLordNumber})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block">सक्रिय महादशा ({vedicDasha.currentMahadasha.startYear}–{vedicDasha.currentMahadasha.endYear}):</strong>
                  <div className="font-bold text-gray-900">अंक #{vedicDasha.currentMahadasha.lordNumber} ({vedicDasha.currentMahadasha.planetHi}) • आयु {vedicDasha.currentMahadasha.ageStart}–{vedicDasha.currentMahadasha.ageEnd} वर्ष</div>
                  <p className="text-gray-600 leading-relaxed">{vedicDasha.currentMahadasha.themeHi}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block">सक्रिय अंतर्दशा ({vedicDasha.currentAntardasha.startDate} – {vedicDasha.currentAntardasha.endDate}):</strong>
                  <div className="font-bold text-gray-900">अंक #{vedicDasha.currentAntardasha.lordNumber} ({vedicDasha.currentAntardasha.planetHi})</div>
                  <p className="text-gray-600 leading-relaxed">{vedicDasha.currentAntardasha.traditionalInterpretationHi}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block">आगामी महादशा ({vedicDasha.upcomingMahadasha.startYear}–{vedicDasha.upcomingMahadasha.endYear}):</strong>
                  <div className="font-bold text-gray-900">अंक #{vedicDasha.upcomingMahadasha.lordNumber} ({vedicDasha.upcomingMahadasha.planetHi}) • आयु {vedicDasha.upcomingMahadasha.ageStart}–{vedicDasha.upcomingMahadasha.ageEnd} वर्ष</div>
                  <p className="text-gray-600 leading-relaxed">{vedicDasha.upcomingMahadasha.themeHi}</p>
                </div>
              </div>
              <p className="text-[11px] text-[#78350F] bg-white/80 p-2.5 rounded-xl border border-amber-200/70 leading-relaxed">
                <strong>दशा एवं व्यक्तिगत वर्ष समन्वय ({vedicDasha.dashaCompatibility.statusHi}):</strong> {vedicDasha.dashaCompatibility.explanationHi}
              </p>
            </div>
          )}

          {/* 4. Life Changing Event Windows */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" />
              4. जीवन में बड़े बदलाव के अवसर व समयावधि (4 Life Changing Event Windows)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {expertDossier.lifeChangingWindows.map((win, idx) => (
                <div key={idx} className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-playfair font-bold text-sm text-[#92400E]">{win.window}</span>
                    <span className="text-[9px] font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#92400E] font-bold">
                      {win.catalyst}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#1F2937]">{win.themeHi}</div>
                  <p className="text-[10px] text-[#4B5563] leading-relaxed">{win.adviceHi}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Life Phases / Pinnacles */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              5. जीवन के 4 प्रमुख शिखर काल (4 Life Phases / Pinnacles)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {expertDossier.lifePinnacles.map((pin, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-2xl border border-amber-200 space-y-1.5 shadow-xs">
                  <div className="flex justify-between items-center border-b border-amber-100 pb-1">
                    <span className="font-bold text-xs text-[#92400E]">{pin.name}</span>
                    <span className="text-[10px] font-mono bg-[#D97706] text-white px-1.5 py-0.5 rounded font-bold">
                      #{pin.pinnacleNumber}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6B7280]">आयु: {pin.ageSpan} • स्वामी: {pin.planet}</div>
                  <div className="text-[11px] font-medium text-[#1F2937]">{pin.themeHi}</div>
                  <p className="text-[10px] text-[#4B5563] leading-relaxed">{pin.guidanceHi}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 19. PERSONAL YEAR FORECAST (CURRENT & UPCOMING TIME VIBRATIONS) */}
          {/* ========================================================================= */}
          <div className="p-6 md:p-7 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] rounded-3xl border-2 border-amber-200/90 shadow-sm space-y-6 print-avoid-break">
            {/* Header & Calculation Formula Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-amber-200/70 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-[#D97706]/10 text-[#B45309] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D97706]/20">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> 19. व्यक्तिगत वर्ष भविष्यफल (Personal Year Forecast)
                </div>
                <h4 className="font-playfair text-xl md:text-2xl font-bold text-[#1F2937]">
                  वर्तमान एवं आगामी व्यक्तिगत वर्ष चक्र ({currentYear} – {nextYear})
                </h4>
                <p className="text-xs text-[#6B7280]">
                  वैदिक एवं पाश्चात्य अंकशास्त्र के अनुसार जन्मतिथि के आधार पर समय चक्र, वार्षिक ऊर्जा कंपन व भविष्यफल।
                </p>
              </div>

              {/* Formula Badge */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1 text-left min-w-[280px]">
                <span className="text-[9px] font-mono uppercase font-bold text-[#92400E] block tracking-wider">
                  गणना सूत्र (Calculation Formula)
                </span>
                <div className="font-mono text-xs font-bold text-[#1F2937] flex items-center gap-1.5 flex-wrap">
                  <span className="bg-amber-100/70 px-1.5 py-0.5 rounded text-[#78350F]">{birthDay} ({birthDaySum})</span>
                  <span>+</span>
                  <span className="bg-amber-100/70 px-1.5 py-0.5 rounded text-[#78350F]">{birthMonth} ({birthMonthSum})</span>
                  <span>+</span>
                  <span className="bg-amber-100/70 px-1.5 py-0.5 rounded text-[#78350F]">{activePyTab === 'UPCOMING' ? nextYear : activePyTab === 'NEXT_2' ? next2Year : currentYear} ({sumDigits(activePyTab === 'UPCOMING' ? nextYear : activePyTab === 'NEXT_2' ? next2Year : currentYear)})</span>
                  <span>=</span>
                  <span className="bg-[#D97706] text-white px-2 py-0.5 rounded-lg shadow-xs font-black">
                    PY #{activePyTab === 'UPCOMING' ? nextPY : activePyTab === 'NEXT_2' ? next2PY : currentPY}
                  </span>
                </div>
                <span className="text-[9px] text-[#78350F] block">
                  जन्म दिन + जन्म माह + अभीष्ट वर्ष के अंकों का एकल योग
                </span>
              </div>
            </div>

            {/* Interactive Year Selector Tabs (Screen Only) */}
            <div className="flex flex-wrap items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => setActivePyTab('CURRENT')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activePyTab === 'CURRENT'
                    ? 'bg-[#D97706] text-white shadow-sm ring-2 ring-amber-400'
                    : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                <span>🌟 वर्तमान वर्ष {currentYear}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activePyTab === 'CURRENT' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  PY #{currentPY}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePyTab('UPCOMING')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activePyTab === 'UPCOMING'
                    ? 'bg-[#1E3A8A] text-white shadow-sm ring-2 ring-blue-400'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                }`}
              >
                <span>🚀 आगामी वर्ष {nextYear}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activePyTab === 'UPCOMING' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-900'
                }`}>
                  PY #{nextPY}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePyTab('NEXT_2')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activePyTab === 'NEXT_2'
                    ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400'
                    : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
                }`}
              >
                <span>🔮 भविष्य चक्र {next2Year}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activePyTab === 'NEXT_2' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'
                }`}>
                  PY #{next2PY}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePyTab('TIMELINE')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePyTab === 'TIMELINE'
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>3-वर्षीय समग्र तुलना Matrix</span>
              </button>
            </div>

            {/* Render Selected Year Forecast in Screen View */}
            {activePyTab !== 'TIMELINE' && (
              (() => {
                const targetYear = activePyTab === 'UPCOMING' ? nextYear : activePyTab === 'NEXT_2' ? next2Year : currentYear;
                const targetPY = activePyTab === 'UPCOMING' ? nextPY : activePyTab === 'NEXT_2' ? next2PY : currentPY;
                const targetForecast = activePyTab === 'UPCOMING' ? nextPYForecast : activePyTab === 'NEXT_2' ? next2PYForecast : currentPYForecast;

                const pyMeta = {
                  1: { ruler: 'सूर्य (Sun ☀️)', element: 'अग्नि (Fire)', nature: 'नई शुरुआत व नेतृत्व' },
                  2: { ruler: 'चन्द्र (Moon 🌙)', element: 'जल (Water)', nature: 'साझेदारी, सहयोग व धैर्य' },
                  3: { ruler: 'बृहस्पति (Jupiter ✨)', element: 'आकाश (Ether)', nature: 'रचनात्मकता, ज्ञान व सामाजिक विस्तार' },
                  4: { ruler: 'राहु (Rahu 🏛️)', element: 'पृथ्वी (Earth)', nature: 'कठिन श्रम, व्यवस्था निर्माण व अनुशासन' },
                  5: { ruler: 'बुध (Mercury ⚡)', element: 'वायु (Air)', nature: 'तीव्र परिवर्तन, स्वतंत्रता, व्यापार व यात्रा' },
                  6: { ruler: 'शुक्र (Venus 💖)', element: 'जल/पृथ्वी (Water/Earth)', nature: 'पारिवारिक उत्तरदायित्व, प्रेम व गृह शांति' },
                  7: { ruler: 'केतु (Ketu 🧘)', element: 'आकाश/जल (Ether/Water)', nature: 'आध्यात्मिक चिंतन, आत्म-खोज व विश्राम' },
                  8: { ruler: 'शनि (Saturn ⚖️)', element: 'पृथ्वी/वायु (Earth/Air)', nature: 'कर्म फल, भौतिक विस्तार व वित्तीय सत्ता' },
                  9: { ruler: 'मंगल (Mars 🔥)', element: 'अग्नि (Fire)', nature: 'पूर्णता, विसर्जन, रूपांतरण व नया संकल्प' }
                }[targetPY] || { ruler: 'सूर्य (Sun)', element: 'अग्नि', nature: 'सक्रिय चक्र' };

                return (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Year Card Hero Banner */}
                    <div className="p-4 md:p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black font-playfair text-2xl flex items-center justify-center shadow-sm">
                          #{targetPY}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-playfair text-lg font-bold text-[#1F2937]">
                              वर्ष {targetYear} का व्यक्तिगत कंपन (Personal Year #{targetPY})
                            </span>
                            <span className="bg-amber-100 text-[#92400E] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                              {activePyTab === 'UPCOMING' ? 'आगामी वर्ष' : activePyTab === 'NEXT_2' ? 'भविष्य वर्ष' : 'सक्रिय वर्तमान वर्ष'}
                            </span>
                          </div>
                          <div className="text-xs text-[#6B7280] flex items-center gap-3 mt-1 flex-wrap">
                            <span><strong>शासक ग्रह:</strong> {pyMeta.ruler}</span>
                            <span>•</span>
                            <span><strong>तत्व:</strong> {pyMeta.element}</span>
                            <span>•</span>
                            <span><strong>मूल प्रवृत्ति:</strong> {pyMeta.nature}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FAF5EE] px-4 py-2 rounded-xl border border-amber-200 text-left md:text-right">
                        <span className="text-[10px] font-mono uppercase text-[#92400E] block font-bold">मूलांक #{coreNumbers.mulank} व भाग्यांक #{coreNumbers.bhagyank} तालमेल</span>
                        <span className="text-xs font-bold text-emerald-700 flex items-center md:justify-end gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          सकारात्मक ऊर्जा प्रवाह (Harmonious Wave)
                        </span>
                      </div>
                    </div>

                    {/* Thematic Headline */}
                    <div className="p-3.5 bg-amber-500/10 border-l-4 border-[#D97706] rounded-r-2xl text-xs font-semibold text-[#78350F]">
                      🎯 <strong>वार्षिक मूल मंत्र:</strong> {targetForecast.theme}
                    </div>

                    {/* 4 Life Pillar Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#92400E] font-bold text-[11px] uppercase tracking-wider border-b border-amber-100 pb-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#D97706]" /> करियर व व्यवसाय (Career)
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">{targetForecast.career}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#92400E] font-bold text-[11px] uppercase tracking-wider border-b border-amber-100 pb-1">
                          <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" /> धन व निवेश (Finance)
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">{targetForecast.finance}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#92400E] font-bold text-[11px] uppercase tracking-wider border-b border-amber-100 pb-1">
                          <Heart className="w-3.5 h-3.5 text-[#D97706]" /> संबंध व परिवार (Relationships)
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">{targetForecast.relationships}</p>
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#92400E] font-bold text-[11px] uppercase tracking-wider border-b border-amber-100 pb-1">
                          <Compass className="w-3.5 h-3.5 text-[#D97706]" /> यात्रा व पर्यावरण (Travel)
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">{targetForecast.travel}</p>
                      </div>
                    </div>

                    {/* 3 Strategic Action Guidance Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-900 block flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-emerald-700" /> स्वर्णिम अवसर (Key Opportunities)
                        </span>
                        <p className="text-[11px] text-emerald-900 leading-relaxed">{targetForecast.opportunities}</p>
                      </div>

                      <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-rose-900 block flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" /> सावधानी व सतर्कता (Caution)
                        </span>
                        <p className="text-[11px] text-rose-900 leading-relaxed">{targetForecast.caution}</p>
                      </div>

                      <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-blue-900 block flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-blue-700" /> अनुशंसित मुख्य लक्ष्य (Action Mantra)
                        </span>
                        <p className="text-[11px] text-blue-900 leading-relaxed">{targetForecast.recommendedFocus}</p>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Multi-Year Timeline Comparison Matrix (Visible on Timeline Tab or Print) */}
            <div className={`${activePyTab === 'TIMELINE' ? 'block' : 'hidden'} print:block space-y-3 pt-2`}>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D97706]" />
                3-वर्षीय समग्र जीवन चक्र तुलना (Multi-Year Trajectory Matrix)
              </h5>
              <div className="overflow-x-auto rounded-2xl border border-amber-200">
                <table className="w-full text-left text-xs bg-white">
                  <thead className="bg-[#FAF5EE] text-[#78350F] font-mono text-[10px] uppercase border-b border-amber-200">
                    <tr>
                      <th className="p-3">कैलेंडर वर्ष</th>
                      <th className="p-3">Personal Year</th>
                      <th className="p-3">शासक ग्रह</th>
                      <th className="p-3">प्रमुख थीम व ऊर्जा</th>
                      <th className="p-3">करियर व धन दिशा</th>
                      <th className="p-3">मुख्य अनुशंसित रणनीति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 text-[11px] text-[#4B5563]">
                    <tr className="bg-slate-50/60 opacity-80">
                      <td className="p-3 font-mono font-bold">{prevYear} (पिछला)</td>
                      <td className="p-3 font-mono font-bold text-slate-700">#{prevPY}</td>
                      <td className="p-3">{getPlanetName(prevPY, language)}</td>
                      <td className="p-3 text-[10px]">{prevPYForecast.theme}</td>
                      <td className="p-3 text-[10px]">{prevPYForecast.career}</td>
                      <td className="p-3 text-[10px] text-slate-800">{prevPYForecast.recommendedFocus}</td>
                    </tr>
                    <tr className="bg-amber-50/60 font-semibold border-y-2 border-amber-300">
                      <td className="p-3 font-mono font-bold text-[#B45309]">🌟 {currentYear} (वर्तमान)</td>
                      <td className="p-3 font-mono font-bold text-[#B45309]">
                        <span className="bg-[#D97706] text-white px-2 py-0.5 rounded font-black">#{currentPY}</span>
                      </td>
                      <td className="p-3 font-bold text-[#92400E]">{getPlanetName(currentPY, language)}</td>
                      <td className="p-3 text-[#1F2937]">{currentPYForecast.theme}</td>
                      <td className="p-3 text-[#1F2937]">{currentPYForecast.career}</td>
                      <td className="p-3 text-[#92400E] font-bold">{currentPYForecast.recommendedFocus}</td>
                    </tr>
                    <tr className="bg-blue-50/40">
                      <td className="p-3 font-mono font-bold text-blue-900">🚀 {nextYear} (आगामी)</td>
                      <td className="p-3 font-mono font-bold text-blue-900">
                        <span className="bg-[#1E3A8A] text-white px-2 py-0.5 rounded font-black">#{nextPY}</span>
                      </td>
                      <td className="p-3 font-bold text-blue-900">{getPlanetName(nextPY, language)}</td>
                      <td className="p-3">{nextPYForecast.theme}</td>
                      <td className="p-3">{nextPYForecast.career}</td>
                      <td className="p-3 text-blue-900">{nextPYForecast.recommendedFocus}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-purple-900">🔮 {next2Year} (भविष्य)</td>
                      <td className="p-3 font-mono font-bold text-purple-900">
                        <span className="bg-purple-700 text-white px-2 py-0.5 rounded font-black">#{next2PY}</span>
                      </td>
                      <td className="p-3 text-purple-900">{getPlanetName(next2PY, language)}</td>
                      <td className="p-3">{next2PYForecast.theme}</td>
                      <td className="p-3">{next2PYForecast.career}</td>
                      <td className="p-3 text-purple-900">{next2PYForecast.recommendedFocus}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Print/PDF Export Fallback: Ensure Upcoming Year is fully rendered in print without depending on tab clicks */}
            <div className="hidden print:block space-y-4 pt-4 border-t-2 border-amber-200">
              <div className="p-4 bg-white rounded-2xl border border-blue-200 space-y-3">
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="font-playfair text-base font-bold text-blue-900">
                    आगामी व्यक्तिगत वर्ष {nextYear} (Upcoming Personal Year #{nextPY})
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#1E3A8A] text-white px-2.5 py-0.5 rounded-full">
                    {nextPYForecast.theme}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-[10px] text-[#4B5563]">
                  <div><strong>💼 करियर:</strong> {nextPYForecast.career}</div>
                  <div><strong>💰 वित्त:</strong> {nextPYForecast.finance}</div>
                  <div><strong>❤️ संबंध:</strong> {nextPYForecast.relationships}</div>
                  <div><strong>🎯 फोकस:</strong> {nextPYForecast.recommendedFocus}</div>
                </div>
              </div>
            </div>

            {/* Annual Transition Guidance Note */}
            <div className="p-3.5 bg-white/80 rounded-2xl border border-amber-200 text-[11px] text-[#78350F] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong>वर्ष संक्रमण नियम (Annual Energy Transition Principle):</strong>
                <p className="text-[#4B5563]">
                  व्यक्तिगत वर्ष का प्रभाव आपके जन्म माह व तारीख से विशेष रूप से सक्रिय होता है और नए वर्ष के 2-3 महीने पूर्व से ही आगामी वर्ष ({nextYear}) के कंपन महसूस होने लगते हैं। अतः {currentYear} के अंतिम चरण में {nextYear} (Personal Year #{nextPY}) की कार्ययोजना का बीजारोपण करें।
                </p>
              </div>
            </div>
          </div>

          {/* 20. Monthly Dasha-Yog Forecast */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#D97706]" />
              20. मासिक दशा-योग भविष्यफल (Monthly Dasha-Yog Forecast)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {localizedDossier.monthlyDashaForecast.map((m, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-amber-200/80 space-y-2 shadow-xs">
                  <div className="flex justify-between items-center border-b border-amber-100 pb-1.5">
                    <span className="font-playfair font-bold text-xs text-[#92400E]">{m.monthNameActive || m.monthNameHi || m.monthNameEn}</span>
                    <span className="text-[9px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      PY #{m.py} • PM #{m.pm}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#1F2937]">{m.primaryTheme}</div>
                  <div className="space-y-1 text-[10px] text-[#4B5563]">
                    <div><strong>💼 कार्य:</strong> {m.career}</div>
                    <div><strong>💰 धन:</strong> {m.finance}</div>
                    <div><strong>❤️ संबंध:</strong> {m.relationship}</div>
                  </div>
                  <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[10px] text-[#78350F] flex justify-between gap-1">
                    <span><strong>सावधानी:</strong> {m.caution}</span>
                    <span><strong>उपाय:</strong> {m.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 28. TRADITIONAL WELLNESS & LIFESTYLE SUGGESTIONS */}
        {/* ========================================================================= */}
        <section id="sec-28" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 28</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Traditional Wellness, Yoga & Lifestyle Guidance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
              <strong className="text-[#92400E] block font-bold">आयुर्वेदिक प्रकृति एवं वार स्वामी (Ayurvedic Constitution):</strong>
              <span className="font-semibold text-[#B45309] block">
                {vedicDasha?.ayurvedicConstitution?.constitutionTypeHi || `${mPlanet.planetHi} एवं ${bPlanet.planetHi} ऊर्जा संतुलन`}
              </span>
              <span className="text-[#4B5563] text-[11px] block leading-relaxed">
                संवेदनशील तंत्र: {medical?.weakBodySystems?.join(', ') || mulankDef.personality}
              </span>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
              <strong className="text-[#92400E] block font-bold">योग एवं प्राणायाम (Yoga & Pranayama):</strong>
              <span className="text-[#4B5563] text-[11px] block leading-relaxed">
                {medical?.ayurvedicLifestyle?.yogaSuggestions?.concat(medical?.ayurvedicLifestyle?.pranayamaSuggestions || []).join(' • ') || 'प्रातः सूर्य नमस्कार, अनुलोम-विलोम एवं भ्रामरी प्राणायाम का नियमित अभ्यास।'}
              </span>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
              <strong className="text-[#92400E] block font-bold">निवारक जीवनशैली एवं ऋतु सावधानी (Preventive Care):</strong>
              <span className="text-[#4B5563] text-[11px] block leading-relaxed">
                {medical?.lifestyleAdvice?.join(' • ') || mulankDef.traditionalRemedies.lifestyle}
              </span>
            </div>
          </div>

          {/* 17. Lifestyle / Behaviour Suggestions */}
          <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2.5 text-xs">
            <strong className="text-[#92400E] block font-bold uppercase text-xs">17. जीवनशैली व व्यवहार परामर्श (Lifestyle & Behaviour Suggestions)</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#4B5563]">
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-0.5">दैनिक दिनचर्या (Daily Routine):</strong>
                {expertDossier.lifestyleSuggestions.dailyRoutineHi}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-0.5">आहार मार्गदर्शन (Dietary Guideline):</strong>
                {expertDossier.lifestyleSuggestions.dietaryGuidelineHi}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-0.5">मानसिक शांति व ध्यान (Mindfulness Practice):</strong>
                {expertDossier.lifestyleSuggestions.mindfulnessPracticeHi}
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-[#92400E] block mb-0.5">शुभ समय प्रबंधन (Favorable Timing):</strong>
                {expertDossier.lifestyleSuggestions.favorableTimingHi}
              </div>
            </div>
          </div>

          {/* Mandatory Medical Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-[11px] text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>महत्वपूर्ण सूचना (Mandatory Disclaimer):</strong> "यह केवल Traditional Numerology Wellness Interpretation है। यह medical diagnosis, medical treatment या professional healthcare का विकल्प नहीं है। किसी भी स्वास्थ्य संबंधी समस्या के लिए हमेशा योग्य चिकित्सक से परामर्श लें।"
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 29. LEOFAMILY SIGNATURE AUDIT PRO */}
        {/* ========================================================================= */}
        <section id="sec-29" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 29</span>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">LeoFamily Signature Audit Pro (हस्ताक्षर वास्तु एवं ब्लूप्रिंट)</h3>
            </div>
            {savedSigAudit?.image ? (
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5 w-fit">
                <Check className="w-3.5 h-3.5" /> Verified Signature Image Audited
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-amber-50 text-[#D97706] px-3 py-1 rounded-full border border-amber-200 font-bold flex items-center gap-1.5 w-fit">
                <PenTool className="w-3.5 h-3.5" /> Mulank #{coreNumbers.mulank} & Bhagyank #{coreNumbers.bhagyank} Signature Blueprint
              </span>
            )}
          </div>

          {savedSigAudit?.image ? (
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-sm max-w-[220px] flex-shrink-0">
                <img
                  src={savedSigAudit.image}
                  alt="Audited Signature"
                  className="max-h-16 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs space-y-1 text-left">
                <span className="text-[10px] font-mono font-bold text-[#92400E] uppercase">Audited Signature Sample</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  इस हस्ताक्षर नमूने का मूलांक #{coreNumbers.mulank} (स्वामी: {coreNumbers.mulankGraha}) एवं भाग्यांक #{coreNumbers.bhagyank} (स्वामी: {coreNumbers.bhagyankGraha}) के साथ ऊर्जा संरेखण ऑडिट किया गया है।
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-xs text-[#4B5563] leading-relaxed">
              <strong className="text-[#92400E] block font-bold mb-1">
                हस्ताक्षर चित्र अपलोड नहीं किया गया है — व्यक्तिगत हस्ताक्षर ब्लूप्रिंट (Personalized Signature Prescription):
              </strong>
              इस प्रोफ़ाइल में किसी भौतिक हस्ताक्षर की छवि (Signature Image) स्कैन नहीं की गई है, इसलिए कोई काल्पनिक स्कोर प्रदर्शित नहीं किया गया है। नीचे आपके मूलांक #{coreNumbers.mulank} ({coreNumbers.mulankGraha}) और भाग्यांक #{coreNumbers.bhagyank} ({coreNumbers.bhagyankGraha}) के आधार पर अनुशंसित हस्ताक्षर संरचना दी गई है।
            </div>
          )}

          {/* Layer A: Structural Guidelines / Observed Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#D97706]" />
              {savedSigAudit?.auditResult ? 'Layer A: Observed Handwriting Features (अवलोकित भौतिक संरचना)' : 'Layer A: Recommended Structural Parameters (अनुशंसित हस्ताक्षर संरचना)'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">1. दिशा व कोण (Direction & Slope):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.direction || '15° से 20° ऊपर की ओर पूर्वोन्मुख झुकाव (Ascending Slope), जो सतत आशावाद और प्रगति का आधार है।'}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">2. प्रथम अक्षर अनुपात (First Letter Ratio):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.firstLetterSize || 'प्रथम अक्षर शेष अक्षरों से बड़ा, स्पष्ट और बिना किसी कटाव के होना चाहिए, जो आत्मविश्वास को दर्शाता है।'}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">3. अंडरलाइन व आधार (Underline Support):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.underlineStyle || 'हस्ताक्षर के नीचे एक साफ सीधी स्वतंत्र अंडरलाइन खींचें, जो कार्यों में स्थिरता प्रदान करती है।'}
                </p>
              </div>
            </div>
          </div>

          {/* Layer B: Scores only when audited */}
          {savedSigAudit?.auditResult?.scores && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D97706]" />
                Layer B: Audited Signature Alignment Scores (हस्तलेखन मूल्यांकन स्कोर)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Overall Alignment</span>
                  <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                    {savedSigAudit.auditResult.scores.overallSignatureScore}/100
                  </span>
                </div>
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Career & Authority</span>
                  <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                    {savedSigAudit.auditResult.scores.careerScore}/100
                  </span>
                </div>
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Wealth Flow Lock</span>
                  <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                    {savedSigAudit.auditResult.scores.financialFlowScore}/100
                  </span>
                </div>
                <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Public Status</span>
                  <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                    {savedSigAudit.auditResult.scores.recognitionScore}/100
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Corrected Prescription Blueprint & 21-Day Daily Practice Formula */}
          <div className="p-5 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
            <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
              Ideal Signature Blueprint & 21-Day Practice (आदर्श हस्ताक्षर ब्लूप्रिंट एवं अभ्यास विधि)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <strong className="text-[#92400E] block font-bold">अनुशंसित हस्ताक्षर शैली (Prescribed Style):</strong>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.assessment?.idealSignatureStyle || expertDossier.balancingRemedies.signatureRecommendationHi}
                </p>
              </div>
              <div className="space-y-1.5">
                <strong className="text-[#92400E] block font-bold">हस्ताक्षर में किन बातों से बचें (Avoid in Signature):</strong>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  अक्षरों को काटना, नीचे की ओर गिरती रेखा, या अंतिम अक्षर को पीछे की ओर मोड़ने से बचें।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 29B. LEOFAMILY VEHICLE NUMEROLOGY PRO */}
        {/* ========================================================================= */}
        <section id="sec-29b" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 29B</span>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">LeoFamily Vehicle Numerology Pro (वाहन अंकशास्त्र एवं गति वास्तु)</h3>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full border border-blue-200 font-bold flex items-center gap-1.5 w-fit">
              <Car className="w-3.5 h-3.5" /> Chaldean Alphanumeric & Kua Alignment
            </span>
          </div>

          {(savedVehicleAudit?.report || profile.vehicleAnalysis) ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-amber-800 font-bold block">Vehicle Number</span>
                  <span className="font-mono text-base font-extrabold text-slate-900 block">
                    {savedVehicleAudit?.report?.originalRegistration || profile.vehicleAnalysis?.originalRegistration}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    प्रकार: {savedVehicleAudit?.report?.vehicleType || profile.vehicleAnalysis?.vehicleType || 'पंजीकृत वाहन'}
                  </span>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-blue-800 font-bold block">Chaldean Total & Root</span>
                  <span className="font-playfair text-xl font-extrabold text-[#1E3A8A] block">
                    {savedVehicleAudit?.report?.chaldean?.totalCompound || profile.vehicleAnalysis?.chaldean?.totalCompound} → Root #{savedVehicleAudit?.report?.chaldean?.totalRoot || profile.vehicleAnalysis?.chaldean?.totalRoot}
                  </span>
                  <span className="text-[10px] text-[#1E3A8A] font-medium">
                    स्वामी: {savedVehicleAudit?.report?.chaldean?.planetaryRulerHi || profile.vehicleAnalysis?.chaldean?.planetaryRulerHi}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Owner Compatibility</span>
                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span>मूलांक #{coreNumbers.mulank}:</span>
                    <span className="font-bold text-emerald-700">{savedVehicleAudit?.report?.ownerCompatibility?.mulankStatusHi || 'संतुलित'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>भाग्यांक #{coreNumbers.bhagyank}:</span>
                    <span className="font-bold text-slate-700">{savedVehicleAudit?.report?.ownerCompatibility?.bhagyankStatusHi || 'संतुलित'}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-emerald-800 font-bold block">Purpose Alignment</span>
                  <span className="font-bold text-emerald-950 block">
                    {savedVehicleAudit?.report?.purposeAlignment?.alignmentLevel || 'BALANCED'}
                  </span>
                  <span className="text-[10px] text-emerald-800 block">
                    {savedVehicleAudit?.report?.purposeAlignment?.notesHi}
                  </span>
                </div>
              </div>

              <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
                  Compound Energy & Planetary Vibration (कम्पाउंड ऊर्जा एवं पारंपरिक प्रभाव)
                </span>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  {savedVehicleAudit?.report?.chaldean?.compoundMeaning || profile.vehicleAnalysis?.chaldean?.compoundMeaning}
                </p>
              </div>
            </>
          ) : (
            <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-2.5 text-xs text-[#4B5563]">
              <strong className="text-[#92400E] block font-bold text-sm">
                इस प्रोफ़ाइल में वाहन पंजीकरण संख्या (Vehicle Registration Number) दर्ज नहीं की गई है
              </strong>
              <p className="leading-relaxed">
                आपने कोई वाहन नंबर दर्ज नहीं किया है, इसलिए किसी डिफ़ॉल्ट वाहन संख्या का स्कोर नहीं दिखाया गया है।
              </p>
              <p className="leading-relaxed text-[#78350F]">
                <strong>आपके मूलांक #{coreNumbers.mulank} ({coreNumbers.mulankGraha}) एवं भाग्यांक #{coreNumbers.bhagyank} ({coreNumbers.bhagyankGraha}) हेतु शुभ वाहन अंक:</strong>{' '}
                नया वाहन खरीदते समय या नंबर प्लेट चुनते समय अंतिम 4 अंकों का एकल योग (Single Root){' '}
                <strong>#{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')}</strong> रखना आपके लिए सर्वाधिक अनुकूल रहेगा, तथा शत्रु अंकों ({Array.from(new Set([...mPlanet.enemyNumbers, ...bPlanet.enemyNumbers])).join(', ') || 'विरोधी अंकों'}) से बचना उचित रहेगा।
              </p>
            </div>
          )}

          {/* Vastu Kua Directions & Dashboard Remedies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">कुआ दिशा व पार्किंग संरेखण (Parking & Travel Vastu):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {savedVehicleAudit?.report?.vastuKua?.parkingAdviceHi || `कुआ अंक #${kuaProfile.kuaNumber} के अनुसार, वाहन को ${kuaProfile.favourableDirections?.shengChi || kuaProfile.favorableDirections?.[0]?.direction} या ${kuaProfile.favourableDirections?.tianYi || kuaProfile.favorableDirections?.[1]?.direction} दिशा की ओर मुख करके पार्क करना ऊर्जा स्थायित्व के लिए सर्वोत्तम है।`}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">डैशबोर्ड संतुलन उपाय (Dashboard Remedies):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {savedVehicleAudit?.report?.vastuKua?.dashboardRemediesHi?.[0] || `डैशबोर्ड को स्वच्छ रखें और अपने इष्ट देव (${mPlanet.deity}) का लघु प्रतीक या प्राकृतिक सुगंध का प्रयोग करें ताकि यात्रा के समय मानसिक एकाग्रता और सकारात्मक ऊर्जा बनी रहे।`}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
            <strong>सुरक्षा अस्वीकरण:</strong> अंकशास्त्रीय वाहन विश्लेषण पारंपरिक मान्यताओं पर आधारित ऊर्जा संतुलन का अध्ययन है। यह किसी भी दुर्घटना से बचाव या सुरक्षा की गारंटी नहीं देता। सदैव सुरक्षित ड्राइविंग नियमों और यातायात कानूनों का निष्ठापूर्वक पालन करें।
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 29C. LEOFAMILY BUSINESS & CORPORATE NUMEROLOGY PRO */}
        {/* ========================================================================= */}
        <section id="sec-29c" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 29C (Phase 9 Pro Module)</span>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">
                LeoFamily Business & Corporate Numerology Pro (व्यापार एवं कॉर्पोरेट अंकशास्त्र)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-blue-50 text-[#1E3A8A] font-bold px-3 py-1 rounded-full border border-blue-200">
                Chaldean Business Suite
              </span>
            </div>
          </div>

          {(savedBusinessAudit?.report || profile.businessAnalysis) ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Business / Brand</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {savedBusinessAudit?.report?.entity?.businessName || profile.businessAnalysis?.entity?.businessName}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {savedBusinessAudit?.report?.entity?.industry || profile.businessAnalysis?.entity?.industry}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Compound & Root</span>
                  <span className="font-bold text-[#1E3A8A] text-lg block font-mono">
                    {savedBusinessAudit?.report?.chaldean?.totalCompound || profile.businessAnalysis?.chaldean?.totalCompound} &rarr; #{savedBusinessAudit?.report?.chaldean?.totalRoot || profile.businessAnalysis?.chaldean?.totalRoot}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {savedBusinessAudit?.report?.chaldean?.planetaryRulerHi || profile.businessAnalysis?.chaldean?.planetaryRulerHi}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Founder Synastry</span>
                  <span className="font-bold text-amber-700 block">
                    {savedBusinessAudit?.report?.ownerCompatibility?.overallStatus || 'BALANCED'}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    Score: {savedBusinessAudit?.report?.ownerCompatibility?.overallScore}/100
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Personal Year Cycle</span>
                  <span className="font-bold text-indigo-700 block font-mono">
                    Year #{savedBusinessAudit?.report?.personalYear?.currentPersonalYear || personalYearVal}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    व्यापारिक विस्तार चक्र
                  </span>
                </div>
              </div>

              <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
                  Corporate Compound Meaning & Brand Personality (कम्पाउंड ऊर्जा एवं ब्रांड अभिव्यक्ति)
                </span>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  {savedBusinessAudit?.report?.chaldean?.compoundMeaning || profile.businessAnalysis?.chaldean?.compoundMeaning}
                </p>
                {savedBusinessAudit?.report?.branding?.brandPersonalityHi && (
                  <p className="text-[#78350F] text-[11px] leading-relaxed border-t border-[#FDE68A]/60 pt-2 font-medium">
                    <strong>ब्रांड व्यक्तित्व:</strong> {savedBusinessAudit.report.branding.brandPersonalityHi}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-2.5 text-xs text-[#4B5563]">
              <strong className="text-[#92400E] block font-bold text-sm">
                इस प्रोफ़ाइल में किसी व्यापार/ब्रांड नाम का अलग पंजीकरण नहीं किया गया है
              </strong>
              <p className="leading-relaxed">
                चूंकि कोई विशिष्ट कंपनी या ब्रांड नाम दर्ज नहीं किया गया है, इसलिए किसी काल्पनिक व्यापार नाम का डेटा प्रदर्शित नहीं किया गया है।
              </p>
              <p className="leading-relaxed text-[#78350F]">
                <strong>आपके मूलांक #{coreNumbers.mulank} एवं भाग्यांक #{coreNumbers.bhagyank} हेतु व्यापारिक नामकरण सूत्र:</strong>{' '}
                {mulankDef.business} {bhagyankDef.business} नया ब्रांड या फर्म पंजीकृत करते समय उसका Chaldean Root अंक{' '}
                <strong>#{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')}</strong> पर रखना आपके लिए सर्वाधिक अनुकूल रहेगा।
              </p>
            </div>
          )}

          {/* Office Vastu & Brand Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">कार्यालय वास्तु संरेखण (Office Vastu):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {savedBusinessAudit?.report?.remedies?.officeDirectionVastuHi || `संस्थापक की मुख्य कार्य-मेज पर बैठते समय मुख ${kuaProfile.favourableDirections?.shengChi || kuaProfile.favorableDirections?.[0]?.direction} दिशा में रखें ताकि निर्णय क्षमता और वित्तीय प्रवाह सुदृढ़ रहे।`}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">शुभ ब्रांड रंग व अनुबंध दिवस:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                शुभ रंग: {savedBusinessAudit?.report?.remedies?.auspiciousBrandColorsHi?.join(', ') || `${mPlanet.color}, ${bPlanet.color}`} • अनुबंध दिवस: {savedBusinessAudit?.report?.remedies?.contractSigningDaysHi?.join(', ') || `${mPlanet.day}, ${bPlanet.day}`}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
            <strong>व्यापारिक अस्वीकरण:</strong> अंकशास्त्रीय व्यापारिक विश्लेषण केवल आत्म-चिंतन और पारंपरिक ऊर्जा संतुलन पर आधारित मार्गदर्शन है। यह किसी भी व्यावसायिक लाभ, वित्तीय सफलता या बिक्री की गारंटी नहीं देता है।
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 29D. LEOFAMILY MARRIAGE COMPATIBILITY & SYNASTRY PRO (PHASE 10) */}
        {/* ========================================================================= */}
        <section id="sec-29d" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 29D (Phase 10 Pro Module)</span>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">
                LeoFamily Marriage Compatibility & Synastry Pro (वैवाहिक सामंजस्य एवं सिनैस्ट्री)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
                7-Layer Synastry Suite
              </span>
            </div>
          </div>

          {savedMarriageAudit?.report ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Person A / प्रथम व्यक्ति</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {savedMarriageAudit.report.personA?.name || identity.fullName}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    मूलांक #{savedMarriageAudit.report.personA?.mulank || coreNumbers.mulank} • भाग्यांक #{savedMarriageAudit.report.personA?.bhagyank || coreNumbers.bhagyank}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Person B / द्वितीय व्यक्ति</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {savedMarriageAudit.report.personB?.name}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    मूलांक #{savedMarriageAudit.report.personB?.mulank} • भाग्यांक #{savedMarriageAudit.report.personB?.bhagyank}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Overall Harmony</span>
                  <span className="font-bold text-rose-700 text-lg block font-mono">
                    {savedMarriageAudit.report.overallHarmonyScore}%
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {savedMarriageAudit.report.stabilityVerdictHi}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">7-Layer Core Match</span>
                  <span className="font-bold text-indigo-700 block font-mono">
                    {savedMarriageAudit.report.sevenLayers?.emotional?.score}% Emotional
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    संवाद: {savedMarriageAudit.report.sevenLayers?.communication?.score}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-2.5">
                  <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
                    मूलांक व भाग्यांक क्रॉस-सिंथेसिस (Core Interaction)
                  </span>
                  <p className="text-[#78350F] text-[11px] leading-relaxed">
                    {savedMarriageAudit.report.crossSynthesis?.synthesisHi}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-2.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">
                    Lo Shu ग्रिड एवं पूरक ऊर्जा (Complementary Grid Energy)
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {savedMarriageAudit.report.loShuAnalysis?.crossGridSynergyHi}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-3 text-xs text-[#4B5563]">
              <strong className="text-[#92400E] block font-bold text-sm">
                इस प्रोफ़ाइल में जीवनसाथी का विवरण (Partner Birth Details) दर्ज नहीं किया गया है — व्यक्तिगत वैवाहिक अनुकूलता प्रोफ़ाइल:
              </strong>
              <p className="leading-relaxed">
                द्वितीय व्यक्ति की जन्मतिथि दर्ज न होने के कारण किसी काल्पनिक पार्टनर का सिनैस्ट्री स्कोर नहीं दिखाया गया है। नीचे आपके मूलांक #{coreNumbers.mulank} एवं भाग्यांक #{coreNumbers.bhagyank} के आधार पर आपका व्यक्तिगत संबंध एवं वैवाहिक अनुकूलता विश्लेषण दिया गया है:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-white rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block">अनुकूल जीवनसाथी अंक (Most Compatible Partner Numbers):</strong>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    मूलांक/भाग्यांक <strong>#{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')}</strong> वाले व्यक्तियों के साथ आपका मानसिक, भावनात्मक और वैचारिक तालमेल सबसे सहज रहता है। सावधानी योग्य अंक: <strong>#{Array.from(new Set([...mPlanet.enemyNumbers, ...bPlanet.enemyNumbers])).join(', #') || 'कोई प्रत्यक्ष शत्रु अंक नहीं'}</strong>।
                  </p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-[#92400E] block">दांपत्य एवं संबंध मार्गदर्शन (Marital Harmony Key):</strong>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    {mulankDef.relationships} {bhagyankDef.relationships} {relationship.compatibilityAdvice} {relationship.harmonyTips}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
            <strong>वैवाहिक अस्वीकरण:</strong> अंकशास्त्रीय सामंजस्य विश्लेषण केवल दोनों व्यक्तियों के स्वभाव, मानसिक तालमेल और ऊर्जा संतुलन को समझने का साधन है। सच्चा दांपत्य सुख परस्पर निष्ठा, निरंतर संवाद और प्रेम पर निर्भर करता है।
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 29E. LEOFAMILY CHILD LUCKY NAMES PRO (PHASE 11) */}
        {/* ========================================================================= */}
        <section id="sec-29e" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 29E (Phase 11 Pro Module)</span>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">
                LeoFamily Child Lucky Names Pro (शुभ शिशु नामाक्षर एवं वैदिक नाम चयन)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                16-Point Vedic Child Dossier
              </span>
            </div>
          </div>

          {savedChildReport?.report ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">शिशु का नाम (Child)</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {savedChildReport.report.childInfo?.name}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    DOB: {savedChildReport.report.childInfo?.standardDob}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">मूलांक (Driver)</span>
                  <span className="font-bold text-[#1E3A8A] text-lg block font-mono">
                    #{savedChildReport.report.childInfo?.mulank}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {savedChildReport.report.childInfo?.mulankGrahaHi}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">भाग्यांक (Conductor)</span>
                  <span className="font-bold text-amber-700 text-lg block font-mono">
                    #{savedChildReport.report.childInfo?.bhagyank}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    {savedChildReport.report.childInfo?.bhagyankGrahaHi}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">शुभ नामाक्षर (Letters)</span>
                  <span className="font-bold text-emerald-700 block font-mono">
                    {savedChildReport.report.wisdomLetters?.highlySupportive?.slice(0, 4).map((l: any) => l.letter).join(', ')}
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    अत्यंत अनुकूल
                  </span>
                </div>
              </div>

              <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
                  Wisdom Starting Alphabets & Elemental Resonance (शुभ नामाक्षर विश्लेषण)
                </span>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  मूलांक {savedChildReport.report.childInfo?.mulank} एवं भाग्यांक {savedChildReport.report.childInfo?.bhagyank} के अनुसार शिशु के लिए {savedChildReport.report.wisdomLetters?.highlySupportive?.map((l: any) => `'${l.letter}'`).join(', ')} नामाक्षर विशेष रूप से ऊर्जावान एवं जीवन में निरंतर प्रगति के सहायक हैं।
                </p>
              </div>
            </>
          ) : (
            <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-2.5 text-xs text-[#4B5563]">
              <strong className="text-[#92400E] block font-bold text-sm">
                अलग से शिशु विवरण दर्ज नहीं किया गया है — वर्तमान जन्मतिथि ({formattedDOB}) हेतु शुभ नामाक्षर सिद्धांत:
              </strong>
              <p className="leading-relaxed">
                चूंकि किसी पृथक शिशु प्रोफ़ाइल का चयन नहीं किया गया है, इसलिए किसी काल्पनिक शिशु नाम का विवरण प्रदर्शित नहीं किया गया है।
              </p>
              <p className="leading-relaxed text-[#78350F]">
                <strong>मूलांक #{coreNumbers.mulank} ({coreNumbers.mulankGraha}) एवं भाग्यांक #{coreNumbers.bhagyank} ({coreNumbers.bhagyankGraha}) के आधार पर शुभ अक्षरीय तरंगें:</strong>{' '}
                इस जन्मतिथि संयोजन के लिए वे प्रथम अक्षर और नाम वर्तनी सर्वाधिक अनुकूल मानी जाती हैं जिनका Chaldean मान मित्र अंकों{' '}
                <strong>#{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', #')}</strong> से संरेखित होता है और जन्म ग्रिड के अनुपस्थित अंकों ({missingNums.length ? `#${missingNums.join(', #')}` : 'संतुलित ग्रिड'}) को सकारात्मक सहारा देता है।
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
            <strong>शिशु नाम परामर्श अस्वीकरण:</strong> अंकशास्त्रीय नाम चयन केवल ग्रहीय तरंगों और अक्षरीय सामंजस्य को संतुलित करने का पारंपरिक मार्गदर्शन है। यह किसी भी व्यक्ति के भविष्य की निश्चित गारंटी नहीं देता है। सही संस्कार, शिक्षा और वातावरण ही जीवन की वास्तविक पूंजी हैं।
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 29F. LEOFAMILY LUCKY DATES FINDER PRO */}
        {/* ========================================================================= */}
        <section id="sec-29f" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          {(() => {
            const activeDatesReport = savedLuckyDatesReport || dynamicLuckyDatesReport;
            return (
              <>
                <div className="border-b border-[#F3F4F6] pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 29F • Phase 12 Pro</span>
                    <h3 className="font-playfair text-xl font-bold text-[#1F2937]">
                      LeoFamily Lucky Dates Finder Pro (शुभ मुहूर्त व अनुकूल तिथि चयन)
                    </h3>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold">
                    {activeDatesReport?.purposeHi || 'सामान्य शुभ कार्य व महत्वपूर्ण निर्णय'}
                  </span>
                </div>

                <p className="text-xs text-[#4B5563] leading-relaxed">
                  मूलांक #{coreNumbers.mulank} ({coreNumbers.mulankGraha}), भाग्यांक #{coreNumbers.bhagyank} ({coreNumbers.bhagyankGraha}), व्यक्तिगत वर्ष (Personal Year #{personalYearVal}) और वार-अधिष्ठाता ग्रहों के सामंजस्य से वर्तमान माह ({activeDatesReport?.dateRangeSummary || 'वर्तमान चक्र'}) हेतु वास्तविक गणना द्वारा चयनित सर्वाधिक अनुकूल तिथियां।
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">मासिक शुभ तिथियां (Every Month)</span>
                    <strong className="text-slate-800 font-bold block mt-0.5">
                      {(profile.remedies?.luckyDates || [coreNumbers.mulank, coreNumbers.bhagyank]).join(', ')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">सक्रिय Personal Year</span>
                    <strong className="text-indigo-700 font-mono font-bold block mt-0.5">#{personalYearVal}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">स्कैन की गई अवधि</span>
                    <strong className="text-slate-800 font-mono font-bold block mt-0.5">{activeDatesReport?.dateRangeSummary || 'वर्तमान माह'}</strong>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-[9px] font-mono uppercase text-amber-800 font-bold block">शीर्ष अनुशंसित</span>
                    <strong className="text-amber-900 font-bold block mt-0.5">{activeDatesReport?.topSupportiveDates?.length || 0} तिथियां अनुकूल</strong>
                  </div>
                </div>

                {activeDatesReport?.topSupportiveDates?.length ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> शीर्ष अनुकूल तिथियां (Top Auspicious Dates):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {activeDatesReport.topSupportiveDates.slice(0, 8).map((d: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-playfair font-bold text-[#1E3A8A] text-sm">{d.dateFormatted}</span>
                            <span className="text-[9px] font-mono font-bold bg-white text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                              Score {d.compatibilityScore}%
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-600 flex justify-between">
                            <span>{d.weekdayHi} ({d.weekdayLord})</span>
                            <span>Day #{d.dateNumber} • Root #{d.rootNumber}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 pt-1 border-t border-amber-200/60 leading-relaxed">
                            {d.whyThisDateHi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 block font-bold">गोचर व समयावधि विश्लेषण (Transit Synthesis):</strong>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 leading-relaxed">
                      <li>{activeDatesReport?.transitMatchingGrid?.driverCompatibilityHi || `मूलांक #${coreNumbers.mulank} के साथ सकारात्मक मित्र ग्रहीय रश्मियों का चयन।`}</li>
                      <li>{activeDatesReport?.transitMatchingGrid?.conductorCompatibilityHi || `भाग्यांक #${coreNumbers.bhagyank} के साथ तारीख के कुल योग का समन्वय।`}</li>
                      <li>{activeDatesReport?.transitMatchingGrid?.personalYearAlignmentHi || `Personal Year #${personalYearVal} की दिशा और ऊर्जा का समग्र समर्थन।`}</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 block font-bold">पारंपरिक मुहूर्त व व्यवहारिक परामर्श:</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {activeDatesReport?.finalSelectionNotesHi || 'शुभ तिथियों पर कार्य का शुभारंभ दिन के प्रथम पहर (अभिजीत मुहूर्त) में करें। प्रशासनिक नियमों, परिवार की सहमति और व्यावहारिक तैयारी को सदैव प्राथमिकता दें।'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
                  <strong>शुभ तिथि चयन अस्वीकरण:</strong> अंकशास्त्रीय तिथि चयन केवल प्राकृतिक ऊर्जा और ग्रहीय सामंजस्य को अनुकूल बनाने का पारंपरिक माध्यम है। यह किसी भी कार्य की निश्चित सफलता या चमत्कारिक फल की गारंटी नहीं देता है। वास्तविक परिणाम आपकी निष्ठा, तैयारी और कर्म पर निर्भर करता है।
                </div>
              </>
            );
          })()}
        </section>

        {/* ========================================================================= */}
        {/* 30. CONSOLIDATED TRADITIONAL & BALANCING REMEDIES & 90-DAY ACTION PLAN */}
        {/* ========================================================================= */}
        <section id="sec-30" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 print-avoid-break">
          <div className="border-b border-[#F3F4F6] pb-3 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Chapter 30</span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">Sample Section 9: Consolidated Remedies & Harmonization</span>
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#1F2937]">21–22. Consolidated Traditional Remedies & Action Plan</h3>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              Vedic Balancing Protocol
            </span>
          </div>

          {/* 21. Consolidated Traditional Remedies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              21. समग्र पारंपरिक उपाय एवं रुद्राक्ष मार्गदर्शन (Consolidated Traditional Remedies)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
                <strong className="text-[#92400E] block font-bold">1. रुद्राक्ष एवं रत्न मार्गदर्शन (Rudraksha & Crystal):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {expertDossier.balancingRemedies.crystalRecommendationHi}
                </p>
              </div>

              <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
                <strong className="text-[#92400E] block font-bold">2. वास्तु एवं दिशात्मक संतुलन (Vastu & Direction):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  ईशान कोण (North-East) को स्वच्छ व हल्का रखें तथा अध्ययन/कार्य की मुख्य बैठक {kuaProfile.favourableDirections?.shengChi || kuaProfile.favorableDirections?.[0]?.direction} दिशा में रखें।
                </p>
              </div>

              <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-1">
                <strong className="text-[#92400E] block font-bold">3. वैदिक मंत्र साधना (Vedic Mantra Sadhana):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {profile.remedies.mantras?.join('; ') || expertDossier.balancingRemedies.sacredMantraHi}
                </p>
              </div>
            </div>
          </div>

          {/* 22. Balancing Remedies Detailed Matrix */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              22. ऊर्जा संतुलनकारी वैदिक उपाय (Balancing Remedies Matrix)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">प्रधान यंत्र (Primary Yantra):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.balancingRemedies.primaryYantraHi}</p>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">ग्रह मंत्र जप (Sacred Mantra):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.balancingRemedies.sacredMantraHi}</p>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">रंग व परिधान (Color Harmony):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  शुभ रंग: {expertDossier.balancingRemedies.luckyColorsHi.join(', ')}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">क्रिस्टल / रत्न (Crystal Therapy):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.balancingRemedies.crystalRecommendationHi}</p>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">सजीव ग्रह सेवा व दान (Planetary Charity):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.balancingRemedies.planetaryCharityHi}</p>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                <strong className="text-[#92400E] block font-bold mb-1">हस्ताक्षर सुधार (Signature Alignment):</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">{expertDossier.balancingRemedies.signatureRecommendationHi}</p>
              </div>
            </div>
          </div>

          {/* 90-Day Action Plan */}
          <div className="space-y-4 pt-3 border-t border-amber-200/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">
                  Actionable Numerological Strategy
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#92400E] font-playfair">
                  90-दिवसीय व्यक्तिगत कार्य योजना (90-Day Step-by-Step Strategic Roadmap)
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full">
                Phase-by-Phase Blueprint
              </span>
            </div>

            {/* 3 Main 30-Day Chronological Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              <div className="p-5 bg-white rounded-2xl border-2 border-amber-200/90 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase font-black bg-amber-100 px-2 py-0.5 rounded">
                    DAYS 1 – 30
                  </span>
                  <span className="text-[10px] font-bold text-stone-500">माह 1: नींव स्थापन</span>
                </div>
                <strong className="font-bold text-sm text-[#92400E] block font-playfair">
                  {actionPlan90Day?.phase1_Days1To30?.title || 'Foundation Phase (ऊर्जा शुद्धिकरण)'}
                </strong>
                <ul className="space-y-1.5 text-[11px] text-stone-600 leading-relaxed">
                  {(actionPlan90Day?.phase1_Days1To30?.actions || [
                    'घर के ईशान कोण (North-East) में जल पात्र व स्वच्छता सुनिश्चित करें।',
                    `दैनिक परिधान में अनुकूल शुभ रंगों (${expertDossier.balancingRemedies.luckyColorsHi.join(', ')}) का उपयोग करें।`,
                    'अनावश्यक बिखराव व बंद घड़ियां/खराब इलेक्ट्रॉनिक सामान घर से हटाएं।'
                  ]).map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-white rounded-2xl border-2 border-amber-200/90 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase font-black bg-amber-100 px-2 py-0.5 rounded">
                    DAYS 31 – 60
                  </span>
                  <span className="text-[10px] font-bold text-stone-500">माह 2: सक्रियता व उपाय</span>
                </div>
                <strong className="font-bold text-sm text-[#92400E] block font-playfair">
                  {actionPlan90Day?.phase2_Days31To60?.title || 'Remediation Phase (व्यावसायिक सामंजस्य)'}
                </strong>
                <ul className="space-y-1.5 text-[11px] text-stone-600 leading-relaxed">
                  {(actionPlan90Day?.phase2_Days31To60?.actions || [
                    'करियर में नए प्रस्तावों का विश्लेषण अपनी अनुकूल मित्र संख्या अनुसार करें।',
                    'सुझाए गए यंत्र अथवा क्रिस्टल को कार्यस्थल की शुभ दिशा में स्थापित करें।',
                    'साप्ताहिक ग्रह दान नियमित रूप से जरूरतमंदों को करें।'
                  ]).map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-white rounded-2xl border-2 border-amber-200/90 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="text-[10px] font-mono text-[#92400E] uppercase font-black bg-amber-100 px-2 py-0.5 rounded">
                    DAYS 61 – 90
                  </span>
                  <span className="text-[10px] font-bold text-stone-500">माह 3: फल प्राप्ति व स्थिरता</span>
                </div>
                <strong className="font-bold text-sm text-[#92400E] block font-playfair">
                  {actionPlan90Day?.phase3_Days61To90?.title || 'Observation Phase (समीक्षा एवं विस्तार)'}
                </strong>
                <ul className="space-y-1.5 text-[11px] text-stone-600 leading-relaxed">
                  {(actionPlan90Day?.phase3_Days61To90?.actions || [
                    'वित्तीय व पारिवारिक जीवन में आए सकारात्मक बदलावों का आकलन करें।',
                    `वर्तमान व्यक्तिगत वर्ष (#${personalYearVal}) के अनुकूल बड़े निर्णयों को अंतिम रूप दें।`,
                    'दीर्घकालिक कार्ययोजना को नए ऊर्जा स्तर के साथ जारी रखें।'
                  ]).map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 31. FINAL LEOFAMILY CONSULTATION SUMMARY */}
        {/* ========================================================================= */}
        <section id="sec-31" className="bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] text-white rounded-3xl p-6 md:p-8 shadow-md space-y-6 print-avoid-break">
          <div className="border-b border-blue-400/20 pb-3 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Chapters 31 – 32</span>
                <span className="text-[10px] font-mono text-amber-200 bg-white/10 px-2 py-0.5 rounded font-bold">Sample Section 9: 90-Day Action Roadmap & Executive Guidance</span>
              </div>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-white">
                23. LeoFamily Final Expert Consultation Summary (अंतिम परामर्श निष्कर्ष)
              </h3>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full font-semibold">
              आपकी 7 सबसे महत्वपूर्ण बातें
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">1. सबसे मजबूत गुण (Strongest Quality):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.strongestTrait}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">2. प्रमुख विकास क्षेत्र (Key Development Area):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.developmentArea}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">3. करियर की दिशा (Career Direction):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.careerDirection}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">4. संबंध एवं परिवार (Relationship Harmony):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.relationshipGuidance}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">5. मुख्य पारंपरिक उपाय (Primary Remedy):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.primaryRemedy}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">6. वर्तमान कालखंड संदेश (Time-Cycle Guidance):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.timeCycleGuidance}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 md:col-span-2">
              <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 fill-amber-400" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">7. ज्योतिषाचार्य / अंकशास्त्री अंतिम संदेश (Master's Word):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  {expertDossier.expertSummary.masterAdvice}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-400/20 pt-4 text-center">
            <p className="text-xs text-amber-200 font-serif italic">
              "अंक आपके भाग्य को बांधते नहीं, वे केवल ग्रह गोचर के शुभ मार्ग का मानचित्र प्रस्तुत करते हैं। सजग आचरण और निरंतर कर्म ही सच्ची सफलता का आधार हैं।"
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PHASE 10: CONSULTATION FEEDBACK & QUALITY RATING LOOP (sec-feedback)     */}
        {/* ========================================================================= */}
        <section id="sec-feedback" className="bg-gradient-to-br from-[#FAF5EE] via-amber-50/40 to-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-sm space-y-6 no-print print-avoid-break">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-amber-100 rounded-2xl text-[#D97706]">
                <MessageSquare className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider block">
                  Phase 10 • Feedback Loop & Service Quality
                </span>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-[#1F2937]">
                  {language === 'hi' ? 'परामर्श अनुभव व गुणवत्ता मूल्यांकन' : 'Consultation Experience & Quality Feedback'}
                </h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold self-start sm:self-auto">
              <Shield className="w-3.5 h-3.5 text-[#D97706]" />
              {language === 'hi' ? 'गोपनीय व सुरक्षित' : 'Confidential & Secure'}
            </span>
          </div>

          {feedbackSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-playfair font-bold text-base text-emerald-950">
                {language === 'hi' ? 'आपकी मूल्यवान समीक्षा के लिए कोटिशः धन्यवाद!' : 'Thank You for Your Valuable Feedback!'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-lg mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'आपकी प्रतिक्रिया हमारे वैदिक व कीरो अंकशास्त्रीय परामर्श को और अधिक सटीक एवं व्यावहारिक बनाने में सहायक होगी।'
                  : 'Your feedback directly helps us refine our authentic Vedic and Chaldean consultation dossier and remedial frameworks.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {language === 'hi'
                  ? 'कृपया इस 32-अध्याय परामर्श रिपोर्ट की स्पष्टता, सटीकता और व्यावहारिक उपयोगिता पर अपना मूल्यांकन साझा करें:'
                  : 'Please share your assessment on the clarity, accuracy, and practical usefulness of this 32-chapter consultation dossier:'}
              </p>

              {/* Star Rating Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#374151]">
                  {language === 'hi' ? '1. समग्र परामर्श संतुष्टि रेटिंग (Overall Rating):' : '1. Overall Consultation Rating:'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= feedbackRating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-800 ml-2">
                    {feedbackRating === 5 ? (language === 'hi' ? 'उत्कृष्ट (5/5)' : 'Excellent (5/5)') :
                     feedbackRating === 4 ? (language === 'hi' ? 'बहुत अच्छा (4/5)' : 'Very Good (4/5)') :
                     feedbackRating === 3 ? (language === 'hi' ? 'संतोषजनक (3/5)' : 'Good (3/5)') :
                     (language === 'hi' ? 'सुधार अपेक्षित' : 'Needs Improvement')}
                  </span>
                </div>
              </div>

              {/* Clarity & Actionability Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#374151]">
                    {language === 'hi' ? '2. भाषा एवं व्याख्या की स्पष्टता:' : '2. Language & Interpretive Clarity:'}
                  </label>
                  <select
                    value={feedbackClarity}
                    onChange={(e) => setFeedbackClarity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="crystal_clear">{language === 'hi' ? 'पूर्णतः स्पष्ट व सरल (Crystal Clear)' : 'Crystal Clear & Simple'}</option>
                    <option value="mostly_clear">{language === 'hi' ? 'अधिकांशतः समझ आया (Mostly Clear)' : 'Mostly Clear'}</option>
                    <option value="needs_explanation">{language === 'hi' ? 'और विस्तृत व्याख्या चाहिए (Needs More Explanation)' : 'Needs More Explanation'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#374151]">
                    {language === 'hi' ? '3. 90-दिवसीय कार्ययोजना की व्यावहारिकता:' : '3. Actionability of 90-Day Plan:'}
                  </label>
                  <select
                    value={feedbackActionability}
                    onChange={(e) => setFeedbackActionability(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="highly_actionable">{language === 'hi' ? 'अति व्यावहारिक व लागू करने योग्य (Highly Actionable)' : 'Highly Actionable & Practical'}</option>
                    <option value="useful">{language === 'hi' ? 'उपयोगी व मार्गदर्शक (Useful & Guiding)' : 'Useful & Guiding'}</option>
                    <option value="neutral">{language === 'hi' ? 'सामान्य (Neutral)' : 'Neutral'}</option>
                  </select>
                </div>
              </div>

              {/* Optional Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#374151]">
                  {language === 'hi' ? '4. कोई विशिष्ट सुझाव या अनुभव (वैकल्पिक):' : '4. Specific Notes or Testimonial (Optional):'}
                </label>
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'अपनी राय यहाँ लिखें... (जैसे: कौन सा अध्याय सबसे उपयोगी लगा)'
                      : 'Share your thoughts or which chapter was most enlightening...'
                  }
                  className="w-full text-xs p-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                />
              </div>

              {feedbackError && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {feedbackError}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-500 italic">
                  {language === 'hi' ? 'आपकी राय सुरक्षित रूप से संग्रहीत होती है।' : 'Your evaluation is stored securely.'}
                </span>
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{feedbackSubmitting ? (language === 'hi' ? 'दर्ज हो रहा है...' : 'Submitting...') : (language === 'hi' ? 'प्रतिक्रिया सबमिट करें' : 'Submit Feedback')}</span>
                </button>
              </div>
            </form>
          )}
        </section>

      </div>

      {/* Bottom Floating/Docked Export Actions Bar (Screen-only) */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 no-print mt-8">
        <div className="text-left space-y-0.5">
          <h4 className="font-playfair font-bold text-base text-[#1F2937] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D97706]" /> सम्पूर्ण 32-अध्याय महा-परामर्श रिपोर्ट पूर्ण
          </h4>
          <p className="text-xs text-[#6B7280]">
            Print or export high-resolution client dossier for <strong>{identity.fullName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F8F4EF] text-[#4B5563] hover:bg-[#F2E8DC] transition-all cursor-pointer"
          >
            ↑ Top
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            title="Print entire 32-section report or save as PDF"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FAF5EE] text-[#78350F] border border-[#FDE68A] hover:bg-[#FEF3C7] shadow-xs transition-all cursor-pointer group"
          >
            <Printer className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={pdfGenerating}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{pdfGenerating ? 'Generating...' : 'Download Master PDF'}</span>
          </button>
        </div>
      </div>

      {/* Phase 7: Explainable Insight & Provenance Modal Overlay */}
      {selectedProvenanceInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#FAF5EE] via-amber-50 to-[#FAF5EE] p-5 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-100 rounded-xl text-[#D97706]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider block">
                    LeoFamily Provenance & Rule Inspector
                  </span>
                  <h4 className="font-playfair font-bold text-base text-stone-900">
                    {language === 'hi' ? selectedProvenanceInsight.title.hi : selectedProvenanceInsight.title.en}
                  </h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProvenanceInsight(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Summary */}
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                <strong className="text-[#92400E] block font-bold text-[10px] uppercase">
                  {language === 'hi' ? 'विश्लेषण सारांश (Summary):' : 'Analytical Summary:'}
                </strong>
                <p className="text-stone-700 leading-relaxed">
                  {language === 'hi' ? selectedProvenanceInsight.summary.hi : selectedProvenanceInsight.summary.en}
                </p>
              </div>

              {/* Calculated Inputs Layer */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                  1. आधारभूत गणना इनपुट (Calculated Facts & Inputs):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProvenanceInsight.inputs.map((inp, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <span className="text-stone-600 font-medium">{inp.label}:</span>
                      <span className="font-bold text-stone-900">{inp.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Governance Rules */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                  2. पंजीकृत पद्धति नियम (Governing Methodology Rules):
                </span>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 font-mono text-[11px]">
                  <div className="text-[#D97706] font-bold">
                    {selectedProvenanceInsight.provenance.matchedRuleIds.join(', ')}
                  </div>
                  <div className="text-stone-600 text-[10px]">
                    गणना स्रोत: {selectedProvenanceInsight.provenance.calculationSource}
                  </div>
                </div>
              </div>

              {/* Source Citation & Hierarchy */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                  3. ज्ञान स्रोत संदर्भ (Knowledge Source Citation):
                </span>
                {selectedProvenanceInsight.provenance.sourceCitations.map((src, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900">{src.sourceDocument}</span>
                      <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {src.level}
                      </span>
                    </div>
                    {src.author && <div className="text-[10px] text-emerald-800">लेखक: {src.author}</div>}
                    <div className="text-[10px] text-emerald-700 italic">{src.topic}</div>
                  </div>
                ))}
              </div>

              {/* Safety & Determinism Caution */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center gap-2 text-[10px] text-blue-900">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  यह अंतर्दृष्टि केवल ग्रह ऊर्जा सामंजस्य व व्यक्तिगत विकास के लिए है। किसी भी प्रकार की घातक या भाग्यवादी भविष्यवाणी पूर्णतः वर्जित है।
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProvenanceInsight(null)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ReportAccessGate>
  );
};

export default MasterReportUnified;
