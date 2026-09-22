import React, { useState, useRef } from 'react';
import { CompleteNumerologyProfile } from '../core/types';
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
  Car
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
  const presentNums = loshu.enhancedGrid?.presentDigits || [];
  const missingNums = loshu.enhancedGrid?.effectiveMissingDigits || [];
  const repeatedNums = loshu.repetition || [];
  const planes = loshu.planes || [];
  const arrows = loshu.arrows || [];

  // Active Personal Year
  const currentYear = new Date().getFullYear();
  const personalYearVal = dobData?.personalYear || 5;

  // Saved Signature, Vehicle, Business & Marriage Audit state from localStorage
  const [savedSigAudit, setSavedSigAudit] = useState<any>(null);
  const [savedVehicleAudit, setSavedVehicleAudit] = useState<any>(null);
  const [savedBusinessAudit, setSavedBusinessAudit] = useState<any>(null);
  const [savedMarriageAudit, setSavedMarriageAudit] = useState<any>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('leofamily_saved_signature_audit');
      if (stored) {
        setSavedSigAudit(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading saved signature audit:", e);
    }

    try {
      const storedVeh = localStorage.getItem('leofamily_saved_vehicle_audit');
      if (storedVeh) {
        setSavedVehicleAudit(JSON.parse(storedVeh));
      }
    } catch (e) {
      console.error("Error loading saved vehicle audit:", e);
    }

    try {
      const storedBus = localStorage.getItem('leofamily_saved_business_audit');
      if (storedBus) {
        setSavedBusinessAudit(JSON.parse(storedBus));
      }
    } catch (e) {
      console.error("Error loading saved business audit:", e);
    }

    try {
      const storedSyn = localStorage.getItem('leofamily_saved_synastry_audit');
      if (storedSyn) {
        setSavedMarriageAudit(JSON.parse(storedSyn));
      }
    } catch (e) {
      console.error("Error loading saved marriage audit:", e);
    }
  }, []);

  // Quick navigation menu items
  const navItems = [
    { id: 'sec-01', label: '01. Executive Summary', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'sec-02', label: '02. Core Numbers & Synthesis', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'sec-03', label: '03-07. Lo Shu & Grids', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'sec-08', label: '08-09. Planes & Arrows', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'sec-10', label: '10-12. 81 Yogas & Archetype', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'sec-13', label: '13-17. Psychological & Life Domains', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'sec-18', label: '18. Mobile Numerology', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'sec-19', label: '19-21. Name (Chaldean & Pythagorean)', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'sec-22', label: '22-24. Numero Vastu & Kua', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'sec-25', label: '25-27. Personal Year & Vedic Dasha', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'sec-28', label: '28. Traditional Wellness', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'sec-29', label: '29. LeoFamily Signature Audit Pro', icon: <PenTool className="w-3.5 h-3.5" /> },
    { id: 'sec-29b', label: '29B. Vehicle Numerology Pro', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'sec-29c', label: '29C. Business Numerology Pro', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'sec-29d', label: '29D. Marriage Synastry Pro', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'sec-30', label: '30. Consolidated Remedies & 90-Day Plan', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'sec-31', label: '31. Final Consultation Summary', icon: <Target className="w-3.5 h-3.5" /> }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // PDF Export Functionality
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setPdfGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeName = (identity.fullName || 'Consultation').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`LeoFamily_Master_Report_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      {/* Top Banner with Action Controls */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#D97706]/10 text-[#D97706] font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-[#D97706]/20 font-bold uppercase tracking-wider">
              Phase 6 Unified Dossier
            </span>
            <span className="text-xs text-[#6B7280] font-medium">31 Master Sections</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1F2937]">
            LeoFamily Master Numerology Consultation Report
          </h2>
          <p className="text-[#6B7280] text-xs mt-1">
            Prepared specially for <strong>{identity.fullName}</strong> • DOB: {identity.standardDOB || identity.dob} • Mobile: {identity.mobile}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF5EE] text-[#78350F] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Dossier
          </button>
          <button
            onClick={handleExportPDF}
            disabled={pdfGenerating}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {pdfGenerating ? 'Generating Master PDF...' : 'Download Master PDF'}
          </button>
        </div>
      </div>

      {/* Quick Jump Navigation Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-xs overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-[#D97706] text-white shadow-xs'
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
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border border-amber-200/80 rounded-3xl p-5 shadow-xs">
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
      <div ref={reportRef} className="space-y-10 bg-[#FAF8F5] p-4 md:p-8 rounded-3xl border border-[#E5E7EB] text-[#1F2937]">

        {/* ========================================================================= */}
        {/* 01. EXECUTIVE SUMMARY */}
        {/* ========================================================================= */}
        <section id="sec-01" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 01</span>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#1F2937]">Executive Summary (कार्यकारी सारांश)</h3>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-semibold">
              Primary Blueprint
            </span>
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
        <section id="sec-02" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 02</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Core Numbers (मूलांक, भाग्यांक एवं ग्रह संबंध)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-[#92400E]">मूलांक (Driver / Birth Number): #{coreNumbers.mulank}</span>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#92400E]">
                  स्वामी: {coreNumbers.mulankGraha}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                मूलांक आपके बाह्य व्यक्तित्व, प्राथमिक सोच, स्वभाव और शारीरिक ऊर्जा को दर्शाता है। यह आपके दिन-प्रतिदिन के व्यवहार और त्वरित निर्णयों का आधार है।
              </p>
            </div>

            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-[#92400E]">भाग्यांक (Conductor / Destiny Number): #{coreNumbers.bhagyank}</span>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#92400E]">
                  स्वामी: {coreNumbers.bhagyankGraha}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                भाग्यांक आपके जीवन के समग्र उद्देश्य, कर्म पथ, सामाजिक जिम्मेदारी और जीवन के उत्तरार्ध में मिलने वाली वास्तविक दिशा को निर्धारित करता है।
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs">
            <strong className="text-[#92400E] font-bold block mb-1">मूलांक एवं भाग्यांक का पारस्परिक संबंध:</strong>
            <p className="text-[#78350F] leading-relaxed">
              {coreNumbers.synthesis?.detailedDescriptionHi ||
                `मूलांक #${coreNumbers.mulank} (${coreNumbers.mulankGraha}) और भाग्यांक #${coreNumbers.bhagyank} (${coreNumbers.bhagyankGraha}) का आपस में संतुलित संबंध है, जो आपके व्यक्तित्व में विचार और कर्म के बीच सामंजस्य स्थापित करता है।`}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03-07. LOSHU BIRTH GRID, ENHANCED GRID & NUMERICAL PARAMETERS */}
        {/* ========================================================================= */}
        <section id="sec-03" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 03 – 07</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">
              Birth Lo Shu Grid vs. Enhanced LeoFamily Grid
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
                  const isDriver = coreNumbers.mulank === num;
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
        </section>

        {/* ========================================================================= */}
        {/* 08-09. PLANES & MASTER ARROWS */}
        {/* ========================================================================= */}
        <section id="sec-08" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 08 & 09</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Planes of Expression & Master Arrows</h3>
          </div>

          {/* Planes Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              1. Eight Traditional Planes (8 मुख्य तल)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {planes.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${
                    p.status === 'COMPLETE'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : p.status === 'PARTIAL'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <strong className="font-bold">{p.name}</strong>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                        p.status === 'COMPLETE'
                          ? 'bg-emerald-200 text-emerald-900'
                          : p.status === 'PARTIAL'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-gray-500 mb-1">
                    अंक: {p.numbers ? p.numbers.join(', ') : '4, 9, 2'}
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-700">
                    {p.status === 'COMPLETE'
                      ? 'पूर्ण सक्रिय योग — उत्कृष्ट मानसिक और व्यावहारिक संतुलन।'
                      : p.status === 'PARTIAL'
                      ? 'आंशिक सक्रिय — नियमित प्रयास से पूरी क्षमता जागृत होती है।'
                      : 'सुप्त तल — विशेष संकल्प एवं उपायों द्वारा विकास आवश्यक।'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Master Arrows */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              2. Master Arrows Analysis (तीरों का प्रभाव)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {arrows.slice(0, 4).map((arrow, idx) => (
                <div key={idx} className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-sm font-bold text-[#92400E]">{arrow.name}</strong>
                    <span className="text-[10px] font-bold text-[#B45309] bg-white px-2 py-0.5 rounded border border-[#FDE68A]">
                      {arrow.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {arrow.meaningHi || arrow.description || 'दृढ़ इच्छाशक्ति, उद्देश्य पर एकाग्रता और समय प्रबंधन का शक्तिशाली योग।'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10-12. 81 YOGAS, KARMIC LESSONS & DOMINANT ARCHETYPE */}
        {/* ========================================================================= */}
        <section id="sec-10" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 10 – 12</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">81 Combinations, Karmic Lessons & Dominant Archetype</h3>
          </div>

          {/* Active 81 Combination */}
          {combination81 && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold uppercase bg-[#D97706] text-white px-2.5 py-0.5 rounded-full">
                  81 Yoga Code: {combination81.code}
                </span>
                <span className="font-playfair font-bold text-[#92400E] text-sm">{combination81.name}</span>
              </div>
              <p className="text-xs text-[#78350F] leading-relaxed mb-3">
                {combination81.meaningHi || combination81.meaning || 'यह योग बुद्धिमत्ता, सामाजिक प्रभाव और व्यापारिक विस्तार का शुभ संयोजन है।'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-amber-200/60">
                <div><strong>Career:</strong> <span className="text-gray-700">{combination81.career || 'Consulting & Business'}</span></div>
                <div><strong>Money:</strong> <span className="text-gray-700">{combination81.money || 'Steady Expansion'}</span></div>
                <div><strong>Relationship:</strong> <span className="text-gray-700">{combination81.relationship || 'Intellectual Bond'}</span></div>
                <div><strong>Remedy:</strong> <span className="text-gray-700">{combination81.remedy || 'Light oil lamp on Wednesdays'}</span></div>
              </div>
            </div>
          )}

          {/* Dominant Archetype & Karmic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">प्रमुख व्यक्तित्व प्रकार (Dominant Archetype):</strong>
              <h5 className="font-playfair font-bold text-sm text-[#B45309] mb-1">{personality.title || 'The Visionary Strategist'}</h5>
              <p className="text-[#4B5563] leading-relaxed">
                {personality.description || 'आप दूरदर्शी सोच और व्यावहारिक क्रियान्वयन के बीच संतुलन साधने वाले व्यक्ति हैं।'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">कार्मिक पाठ एवं आत्म-विकास (Karmic Lessons):</strong>
              <p className="text-[#4B5563] leading-relaxed">
                {missingNums.length > 0
                  ? `अंक #${missingNums.join(', #')} की ऊर्जा को दैनिक जीवन में धैर्य, संगठनात्मक अनुशासन और नियमित ध्यान के द्वारा संतुलित करें।`
                  : 'आपके पास एक स्वाभाविक संतुलित ऊर्जा ग्रिड है। अपने विचारों को लगातार रचनात्मक कार्यों में लगाएं।'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13-17. PSYCHOLOGICAL & LIFE DOMAINS PROFILE */}
        {/* ========================================================================= */}
        <section id="sec-13" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 13 – 17</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Psychological, Career, Wealth & Relationship Matrices</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 13. Psychological */}
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="text-[#92400E] block font-bold text-xs uppercase">13. मनोवैज्ञानिक शैली (Psychology)</strong>
              <div className="space-y-1 text-[11px] text-[#4B5563]">
                <div><strong>Thinking:</strong> {personality.thinkingStyle || 'विश्लेषणात्मक एवं तार्किक'}</div>
                <div><strong>Decision Making:</strong> {personality.decisionMakingStyle || 'तथ्य-आधारित एवं संतुलित'}</div>
                <div><strong>Communication:</strong> {personality.communicationStyle || 'स्पष्ट, प्रभावी एवं प्रेरक'}</div>
                <div><strong>Stress Response:</strong> {personality.stressResponsePattern || 'शांत रहकर समाधान खोजना'}</div>
              </div>
            </div>

            {/* 14. Career */}
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="text-[#92400E] block font-bold text-xs uppercase">14. करियर एवं कार्यक्षेत्र (Career)</strong>
              <p className="text-[11px] text-[#4B5563] leading-relaxed">
                {career.suitableIndustries?.join(', ') || 'प्रबंधन, वित्तीय परामर्श, शिक्षण, आईटी, मीडिया एवं व्यापारिक नेतृत्व'} में आपके अंक सर्वाधिक सहयोगी हैं।
              </p>
            </div>

            {/* 15. Wealth */}
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="text-[#92400E] block font-bold text-xs uppercase">15. धन एवं समृद्धि (Wealth & Money)</strong>
              <p className="text-[11px] text-[#4B5563] leading-relaxed">
                {finance.wealthCreationStyle || 'सुरक्षित, दीर्घकालिक संचय एवं रणनीतिक निवेश से संपत्ति निर्माण। सट्टेबाजी से दूर रहें।'}
              </p>
            </div>

            {/* 16 & 17. Relationships & Family */}
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="text-[#92400E] block font-bold text-xs uppercase">16-17. संबंध एवं पारिवारिक दायित्व</strong>
              <p className="text-[11px] text-[#4B5563] leading-relaxed">
                {relationship.compatibilityAdvice || 'पारस्परिक निष्ठा, स्पष्ट संवाद और पारिवारिक उत्तरदायित्वों का सहज निर्वहन।'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 18. MOBILE NUMEROLOGY */}
        {/* ========================================================================= */}
        <section id="sec-18" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 18</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Mobile Numerology Diagnostics (मोबाइल अंक विश्लेषण)</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Mobile Number</span>
              <span className="font-mono text-sm font-bold text-[#B45309] mt-1 block">{identity.mobile}</span>
            </div>
            <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Total Compound</span>
              <span className="font-playfair text-xl font-bold text-[#B45309] block">
                {mobileAnalysis?.compoundTotal || mobileData?.compoundTotal || 41}
              </span>
            </div>
            <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Single Root</span>
              <span className="font-playfair text-xl font-bold text-[#B45309] block">
                #{mobileAnalysis?.rootNumber || mobileData?.singleDigit || 5}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[9px] font-mono text-emerald-800 block uppercase font-bold">DOB Harmony</span>
              <span className="text-xs font-bold text-emerald-700 block mt-1.5">
                {mobileAnalysis?.dobCompatibility?.compatibilityCategory || 'Harmonious'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-xs space-y-1">
            <strong className="text-[#92400E] block font-bold">मोबाइल अंक का प्रभाव:</strong>
            <p className="text-[#4B5563] leading-relaxed">
              {mobileAnalysis?.compoundCategoryMeaningHi ||
                mobileData?.planetaryInfluence ||
                'यह मोबाइल नंबर आपके व्यापारिक संचार, सामाजिक संपर्कों और दैनिक बातचीत में अनुकूल तरंगें उत्पन्न करता है।'}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 19-21. NAME NUMEROLOGY (CHALDEAN & PYTHAGOREAN) */}
        {/* ========================================================================= */}
        <section id="sec-19" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 19 – 21</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Name Numerology (Chaldean & Pythagorean Engines)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chaldean */}
            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-[#FDE68A] pb-2">
                <strong className="font-bold text-sm text-[#92400E]">1. Indian / Chaldean System (1–8)</strong>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-[#FDE68A] text-[#92400E]">
                  Compound: #{nameNumerology?.chaldean.compoundNumber || 23}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-[#4B5563]">
                <div><strong>Root Name Number (नाम अंक):</strong> #{nameNumerology?.chaldean.rootNumber || 5}</div>
                <div><strong>Compound Title:</strong> {nameNumerology?.chaldean.compoundTitle || 'The Royal Star of the Lion'}</div>
                <div><strong>First Letter ('{nameNumerology?.firstLetter.letter || 'R'}'):</strong> Ruler {nameNumerology?.firstLetter.planet || 'Venus'} ({nameNumerology?.firstLetter.element || 'Earth'})</div>
              </div>
              <p className="text-[11px] text-[#4B5563] leading-relaxed">
                {nameNumerology?.chaldean.compoundInterpretationHi || 'यह नाम कम्पाउंड सामाजिक प्रतिष्ठा, सम्मान और अनुकूल सहयोग आकर्षित करने में अत्यंत सक्षम है।'}
              </p>
            </div>

            {/* Pythagorean */}
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                <strong className="font-bold text-sm text-blue-900">2. Western / Pythagorean System (1–9)</strong>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                  Expression: #{nameNumerology?.pythagorean.expressionNumber || 7}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-[#4B5563]">
                <div><strong>Soul Urge (Heart's Desire):</strong> #{nameNumerology?.pythagorean.soulUrgeNumber || 9}</div>
                <div><strong>Personality Number:</strong> #{nameNumerology?.pythagorean.personalityNumber || 7}</div>
                <div><strong>System Note:</strong> 1-9 Western Standard (Maintained strictly separate)</div>
              </div>
              <p className="text-[11px] text-[#4B5563] leading-relaxed">
                {nameNumerology?.pythagorean.meaningHi || 'पाश्चात्य अंकशास्त्र के अनुसार यह नाम गहन अनुसंधान, बौद्धिक जिज्ञासा और स्वतंत्र चिंतन को पोषित करता है।'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 22-24. NUMERO VASTU, KUA & RESIDENCE ANALYSIS */}
        {/* ========================================================================= */}
        <section id="sec-22" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 22 – 24</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Numero Vastu, Kua & Directional Alignment</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <span className="text-[9px] font-mono text-[#92400E] block uppercase font-bold">Kua Number</span>
              <span className="font-playfair text-2xl font-black text-[#B45309] block">#{vastu.kua.kuaNumber || 7}</span>
              <span className="text-[10px] text-[#78350F]">{vastu.kua.group} Group</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[9px] font-mono text-emerald-800 block uppercase font-bold">Career Direction</span>
              <span className="text-xs font-bold text-emerald-900 block mt-2">{vastu.kua.shengChi.direction}</span>
              <span className="text-[9px] text-emerald-600">Sheng Chi (समृद्धि)</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[9px] font-mono text-blue-800 block uppercase font-bold">Health Direction</span>
              <span className="text-xs font-bold text-blue-900 block mt-2">{vastu.kua.tienYi.direction}</span>
              <span className="text-[9px] text-blue-600">Tien Yi (आरोग्य)</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <span className="text-[9px] font-mono text-purple-800 block uppercase font-bold">Relationship Zone</span>
              <span className="text-xs font-bold text-purple-900 block mt-2">{vastu.kua.nienYen.direction}</span>
              <span className="text-[9px] text-purple-600">Nien Yen (सौहार्द)</span>
            </div>
          </div>

          <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] text-xs">
            <strong className="text-[#92400E] block font-bold mb-1">गृह एवं कार्यस्थल वास्तु मार्गदर्शन:</strong>
            <p className="text-[#4B5563] leading-relaxed">
              अपने मुख्य कार्यक्षेत्र और अध्ययन कक्ष की बैठक दिशा को <strong>{vastu.kua.shengChi.direction}</strong> अथवा <strong>{vastu.kua.fuWei.direction}</strong> की ओर रखें। उत्तर-पूर्व (ईशान कोण) को सदैव स्वच्छ और हल्का रखें ताकि सकारात्मक ऊर्जा का निरंतर प्रवाह बना रहे।
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 25-27. PERSONAL YEAR & VEDIC MAHADASHA */}
        {/* ========================================================================= */}
        <section id="sec-25" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Sections 25 – 27</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Personal Year & Vedic Mahadasha Time Cycles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="font-bold text-sm text-[#92400E] block">25. सक्रिय व्यक्तिगत वर्ष (Personal Year #{personalYearVal})</strong>
              <p className="text-[#4B5563] leading-relaxed">
                यह वर्ष नए अवसरों, यात्राओं, संवाद और व्यापारिक विस्तार के लिए अनुकूल है। नए संपर्कों का निर्माण करें और योजनाओं को तेजी से क्रियान्वित करें।
              </p>
            </div>

            <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2">
              <strong className="font-bold text-sm text-[#92400E] block">26-27. वर्तमान वैदिक महादशा एवं अंतर्दशा</strong>
              <p className="text-[#4B5563] leading-relaxed">
                {vedicDasha?.currentMahadasha
                  ? `सक्रिय महादशा: ${vedicDasha.currentMahadasha.planetHi} (${vedicDasha.currentMahadasha.startDate} से ${vedicDasha.currentMahadasha.endDate})। इस अवधि में ग्रह स्वामी के अनुकूल आचरण एवं उपाय करना विशेष शुभ फलदायी रहेगा।`
                  : 'वैदिक महादशा चक्र आपके जीवन में कर्म फल और अनुभवों को व्यवस्थित क्रम में प्रकट करता है।'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 28. TRADITIONAL WELLNESS / MEDICAL NUMEROLOGY */}
        {/* ========================================================================= */}
        <section id="sec-28" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-5">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 28</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Traditional Wellness & Medical Numerology</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">Day Lord & Dosha:</strong>
              <span className="font-semibold text-[#B45309] block">{medical?.dominantDosha || 'Pitta-Vata'} Balance</span>
              <span className="text-[#6B7280] text-[11px] block mt-1">प्राकृतिक ऊर्जा संतुलन एवं पाचन स्वास्थ्य पर ध्यान दें।</span>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">Recommended Lifestyle:</strong>
              <span className="text-[#4B5563] text-[11px] block mt-1">
                प्रातः सूर्य नमस्कार, पर्याप्त जलपान, और मौसमी फलों व हरी सब्जियों का संतुलित सेवन।
              </span>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">Traditional Herbs:</strong>
              <span className="text-[#4B5563] text-[11px] block mt-1">
                तुलसी, आंवला, गिलोय एवं त्रिफला का पारंपरिक स्वास्थ्य संवर्धन हेतु उपयोग।
              </span>
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
                <PenTool className="w-3.5 h-3.5" /> Mulank {coreNumbers.mulank} & Bhagyank {coreNumbers.bhagyank} Astro-Prescription
              </span>
            )}
          </div>

          {/* User Signature Thumbnail & Cosmic Alignment Context */}
          {savedSigAudit?.image && (
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
                  इस हस्ताक्षर नमूने का मूलांक #{coreNumbers.mulank} (स्वामी: {coreNumbers.mulankLordHi}) एवं भाग्यांक #{coreNumbers.bhagyank} (स्वामी: {coreNumbers.bhagyankLordHi}) के साथ ऊर्जा संरेखण ऑडिट किया गया है।
                </p>
              </div>
            </div>
          )}

          {/* Layer A: Observed Structural Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#D97706]" />
              Layer A: Observed Handwriting Features (अवलोकित भौतिक संरचना)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">1. दिशा व कोण (Direction):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.direction || "15° ऊपर की ओर पूर्वोन्मुख झुकाव (Ascending Slope), जो सतत आशावाद और प्रगति का आधार है।"}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">2. प्रथम अक्षर अनुपात (First Letter Ratio):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.firstLetterSize || "प्रथम अक्षर शेष अक्षरों से 2.5 गुना बड़ा और सुस्पष्ट, जो आत्मविश्वास को दर्शाता है।"}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">3. अंडरलाइन व आधार (Underline Support):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.underlineStyle || "हस्ताक्षर के नीचे एक साफ सीधी स्वतंत्र अंडरलाइन, जो कार्यों में स्थिरता (पृथ्वी तत्व) प्रदान करती है।"}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">4. अंतिम स्ट्रोक (End Stroke Angle):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.endStroke || "अंतिम स्ट्रोक ऊपर-दाहिनी ओर निर्बाध रूप से उठता है, जो अवसरों का स्वागत करता है।"}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">5. बिंदु स्थिति (Dot Placement):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.dotPlacement || "अंडरलाइन के नीचे दो संतुलित बिंदु (Dots) लगाए जाएं, जो आधार को स्थायित्व देते हैं।"}
                </p>
              </div>
              <div className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-bold text-[#1F2937] block">6. अक्षर स्पष्टता (Legibility & Flow):</span>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.analysis?.letterLegibility || "सुस्पष्ट, पठनीय अक्षर जो पारदर्शी संचार और व्यावसायिक विश्वसनीयता का निर्माण करते हैं।"}
                </p>
              </div>
            </div>
          </div>

          {/* Layer B: Traditional Handwriting Interpretation & Astro-Scores */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D97706]" />
              Layer B: Traditional Handwriting Interpretation (पारंपरिक हस्तलेखन वास्तु विश्लेषण)
            </h4>
            
            {/* Scores Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Overall Alignment</span>
                <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                  {savedSigAudit?.auditResult?.scores?.overallSignatureScore || 88}/100
                </span>
              </div>
              <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Career & Authority</span>
                <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                  {savedSigAudit?.auditResult?.scores?.careerScore || 85}/100
                </span>
              </div>
              <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Wealth Flow Lock</span>
                <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                  {savedSigAudit?.auditResult?.scores?.financialFlowScore || 84}/100
                </span>
              </div>
              <div className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">Public Status</span>
                <span className="font-playfair text-xl font-bold text-[#92400E] mt-0.5 block">
                  {savedSigAudit?.auditResult?.scores?.recognitionScore || 87}/100
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FDFCF7] rounded-2xl border border-[#E5E7EB] text-xs text-[#4B5563] leading-relaxed">
              <p>
                <strong>पारंपरिक दृष्टिकोण:</strong> {savedSigAudit?.auditResult?.assessment?.currentSignatureAssessment || `पारंपरिक हस्तलेखन वास्तु के अनुसार, ${identity.fullName} का हस्ताक्षर पूर्व दिशा की ओर 15° ऊपर उठता हुआ होना चाहिए। मूलांक #${coreNumbers.mulank} और भाग्यांक #${coreNumbers.bhagyank} के समन्वय हेतु एक दृढ़ आधार रेखा (Underline) आवश्यक है ताकि व्यावसायिक निर्णयों में एकाग्रता और वित्तीय सुरक्षा बनी रहे।`}
              </p>
            </div>
          </div>

          {/* Corrected Prescription Blueprint & 21-Day Daily Practice Formula */}
          <div className="p-5 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
            <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
              Ideal Redesigned Blueprint (आदर्श हस्ताक्षर ब्लूप्रिंट एवं 21-दिवसीय अभ्यास विधि)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <strong className="text-[#92400E] block font-bold">अनुशंसित हस्ताक्षर शैली (Prescribed Style):</strong>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.assessment?.idealSignatureStyle || "15° ऊपर उठता हुआ सुस्पष्ट हस्ताक्षर, जिसमें पहला अक्षर 2.5 गुना बड़ा हो, नीचे एक सीधी स्वच्छ अंडरलाइन और उसके नीचे दो संतुलित बिंदु हों।"}
                </p>
              </div>
              <div className="space-y-1.5">
                <strong className="text-[#92400E] block font-bold">21-दिवसीय अभ्यास विधि (Daily Sadhana Formula):</strong>
                <p className="text-[#78350F] text-[11px] leading-relaxed">
                  {savedSigAudit?.auditResult?.assessment?.personalizedSignatureBlueprint || "बिना लाइन वाले सादे सफेद कागज पर नीले या इंडिगो स्याही वाले पेन से प्रतिदिन प्रातः 21 बार नए हस्ताक्षर का अभ्यास करें। अंडरलाइन कभी किसी अक्षर के निचले हिस्से को न काटे।"}
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

          {/* Vehicle Scorecard & Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-amber-800 font-bold block">Vehicle Number</span>
              <span className="font-mono text-base font-extrabold text-slate-900 block">
                {savedVehicleAudit?.report?.originalRegistration || profile.vehicleAnalysis?.originalRegistration || 'DL 01 AB 1234'}
              </span>
              <span className="text-[10px] text-slate-600">
                प्रकार: {savedVehicleAudit?.report?.vehicleType || profile.vehicleAnalysis?.vehicleType || 'Car'}
              </span>
            </div>

            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-blue-800 font-bold block">Chaldean Total & Root</span>
              <span className="font-playfair text-xl font-extrabold text-[#1E3A8A] block">
                {savedVehicleAudit?.report?.chaldean?.totalCompound || profile.vehicleAnalysis?.chaldean?.totalCompound || 19} → Root {savedVehicleAudit?.report?.chaldean?.totalRoot || profile.vehicleAnalysis?.chaldean?.totalRoot || 1}
              </span>
              <span className="text-[10px] text-[#1E3A8A] font-medium">
                स्वामी: {savedVehicleAudit?.report?.chaldean?.planetaryRulerHi || profile.vehicleAnalysis?.chaldean?.planetaryRulerHi || 'सूर्य (Sun)'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Owner Compatibility</span>
              <div className="flex justify-between items-center text-[11px] pt-1">
                <span>मूलांक #{coreNumbers.mulank}:</span>
                <span className="font-bold text-emerald-700">अनुकूल (Supportive)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span>भाग्यांक #{coreNumbers.bhagyank}:</span>
                <span className="font-bold text-slate-700">तटस्थ (Neutral)</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-emerald-800 font-bold block">Purpose Alignment</span>
              <span className="font-bold text-emerald-950 block">
                {savedVehicleAudit?.report?.purposeAlignment?.alignmentLevel === 'HIGH' ? 'उच्च सामंजस्य' : 'संतुलित उपयोग'}
              </span>
              <span className="text-[10px] text-emerald-800 block">
                {savedVehicleAudit?.report?.purposeAlignment?.notesHi || 'दैनिक व्यक्तिगत एवं व्यावसायिक यात्राओं हेतु उपयुक्त ऊर्जा।'}
              </span>
            </div>
          </div>

          {/* Detailed Interpretation Block */}
          <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
            <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
              Compound Energy & Planetary Vibration (कम्पाउंड ऊर्जा एवं पारंपरिक प्रभाव)
            </span>
            <p className="text-[#78350F] text-[11px] leading-relaxed">
              {savedVehicleAudit?.report?.chaldean?.compoundMeaning || profile.vehicleAnalysis?.chaldean?.compoundMeaning || `चालडीन अंकशास्त्र के अनुसार, वाहन की प्लेट संख्या के अक्षरों और अंकों का कुल योग कम्पाउंड नंबर ${savedVehicleAudit?.report?.chaldean?.totalCompound || 19} बनाता है। यह ऊर्जा वाहन स्वामी ${identity.fullName} के मूलांक #${coreNumbers.mulank} के साथ सामंजस्यपूर्ण गतिशीलता प्रदान करती है।`}
            </p>
          </div>

          {/* Vastu Kua Directions & Dashboard Remedies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">कुआ दिशा व पार्किंग संरेखण (Parking & Travel Vastu):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {savedVehicleAudit?.report?.vastuKua?.parkingAdviceHi || `स्वामी के कुआ अंक के अनुसार, वाहन को उत्तर या पूर्वोन्मुख दिशा में पार्क करना ऊर्जा स्थायित्व के लिए सर्वोत्तम है।`}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">डैशबोर्ड संतुलन उपाय (Dashboard Remedies):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {savedVehicleAudit?.report?.vastuKua?.dashboardRemediesHi?.[0] || 'डैशबोर्ड पर एक छोटा सकारात्मक प्रतीक या प्राकृतिक सुगंध का प्रयोग करें ताकि वाहन में सकारात्मक ऊर्जा बनी रहे।'}
              </p>
            </div>
          </div>

          {/* Non-deterministic safety disclaimer */}
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

          {/* Business Core Details Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Business / Brand</span>
              <span className="font-bold text-slate-900 block truncate">
                {savedBusinessAudit?.report?.entity?.businessName || profile.businessAnalysis?.entity?.businessName || 'Leo Occult Enterprises'}
              </span>
              <span className="text-[10px] text-slate-600 block">
                {savedBusinessAudit?.report?.entity?.industry || profile.businessAnalysis?.entity?.industry || 'Consulting'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Compound & Root</span>
              <span className="font-bold text-[#1E3A8A] text-lg block font-mono">
                {savedBusinessAudit?.report?.chaldean?.totalCompound || profile.businessAnalysis?.chaldean?.totalCompound || 50} &rarr; #{savedBusinessAudit?.report?.chaldean?.totalRoot || profile.businessAnalysis?.chaldean?.totalRoot || 5}
              </span>
              <span className="text-[10px] text-slate-600 block">
                {savedBusinessAudit?.report?.chaldean?.planetaryRulerHi || 'बुध (Mercury)'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Founder Synastry</span>
              <span className="font-bold text-amber-700 block">
                {savedBusinessAudit?.report?.ownerCompatibility?.overallStatus === 'SUPPORTIVE' ? 'SUPPORTIVE (अनुकूल)' : 'BALANCED (संतुलित)'}
              </span>
              <span className="text-[10px] text-slate-600 block">
                Score: {savedBusinessAudit?.report?.ownerCompatibility?.overallScore || 85}/100
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

          {/* Compound Energy & Brand Expression */}
          <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-3 text-xs">
            <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
              Corporate Compound Meaning & Brand Personality (कम्पाउंड ऊर्जा एवं ब्रांड अभिव्यक्ति)
            </span>
            <p className="text-[#78350F] text-[11px] leading-relaxed">
              {savedBusinessAudit?.report?.chaldean?.compoundMeaning || profile.businessAnalysis?.chaldean?.compoundMeaning || 'चालडीन अंकशास्त्र के अनुसार, व्यवसाय नाम की अक्षरीय ऊर्जा संचार, वाणिज्यिक सौदेबाजी और अनुकूलनशीलता को बढ़ावा देती है। यह संस्थापक के मूल स्वभाव के साथ सकारात्मक संरेखण स्थापित करता है।'}
            </p>
            <p className="text-[#78350F] text-[11px] leading-relaxed border-t border-[#FDE68A]/60 pt-2 font-medium">
              <strong>ब्रांड व्यक्तित्व:</strong> {savedBusinessAudit?.report?.branding?.brandPersonalityHi || 'गतिशील, अनुकूलनशील, वाणिज्यिक रूप से चतुर और उत्कृष्ट नेटवर्किंग वाली बहुआयामी ब्रांड पहचान।'}
            </p>
          </div>

          {/* Office Vastu & Partner / Mobile Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">कार्यालय वास्तु संरेखण (Office Vastu):</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {savedBusinessAudit?.report?.remedies?.officeDirectionVastuHi || 'संस्थापक का केबिन दक्षिण-पश्चिम (South-West) में होना चाहिए और बैठते समय मुख उत्तर (North) या पूर्व (East) दिशा में रखें।'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">शुभ ब्रांड रंग व अनुबंध दिवस:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                शुभ रंग: {savedBusinessAudit?.report?.remedies?.auspiciousBrandColorsHi?.join(', ') || 'Emerald Green, Royal Gold'} • अनुबंध दिवस: {savedBusinessAudit?.report?.remedies?.contractSigningDaysHi?.join(', ') || 'बुधवार, गुरुवार'}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
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

          {/* Couple Overview Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Person A / प्रथम व्यक्ति</span>
              <span className="font-bold text-slate-900 block truncate">
                {savedMarriageAudit?.report?.personA?.name || identity.fullName || 'Person A'}
              </span>
              <span className="text-[10px] text-slate-600 block">
                मूलांक #{savedMarriageAudit?.report?.personA?.mulank || coreNumbers.mulank} • भाग्यांक #{savedMarriageAudit?.report?.personA?.bhagyank || coreNumbers.bhagyank}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Person B / द्वितीय व्यक्ति</span>
              <span className="font-bold text-slate-900 block truncate">
                {savedMarriageAudit?.report?.personB?.name || 'Life Partner'}
              </span>
              <span className="text-[10px] text-slate-600 block">
                मूलांक #{savedMarriageAudit?.report?.personB?.mulank || 5} • भाग्यांक #{savedMarriageAudit?.report?.personB?.bhagyank || 6}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">Overall Harmony</span>
              <span className="font-bold text-rose-700 text-lg block font-mono">
                {savedMarriageAudit?.report?.overallHarmonyScore || 82}%
              </span>
              <span className="text-[10px] text-slate-600 block">
                {savedMarriageAudit?.report?.stabilityVerdictHi || 'सकारात्मक एवं परस्पर सहायक सामंजस्य'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">7-Layer Core Match</span>
              <span className="font-bold text-indigo-700 block font-mono">
                {savedMarriageAudit?.report?.sevenLayers?.emotional?.score || 85}% Emotional
              </span>
              <span className="text-[10px] text-slate-600 block">
                संवाद: {savedMarriageAudit?.report?.sevenLayers?.communication?.score || 80}%
              </span>
            </div>
          </div>

          {/* 7-Layer Snapshot & Lo Shu Cross Resonance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-[#FAF5EE] rounded-3xl border border-[#FDE68A] space-y-2.5">
              <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block">
                मूलांक व भाग्यांक क्रॉस-सिंथेसिस (Core Interaction)
              </span>
              <p className="text-[#78350F] text-[11px] leading-relaxed">
                {savedMarriageAudit?.report?.crossSynthesis?.synthesisHi || 'दोनों पार्टनर्स के अंकों का तालमेल आपसी सम्मान, बौद्धिक समझ और व्यावहारिक जिम्मेदारियों के सहज निर्वहन का समर्थन करता है।'}
              </p>
              <div className="text-[10px] text-slate-600 border-t border-[#FDE68A]/60 pt-2 space-y-1">
                <p>• मूलांक सामंजस्य: <strong>{savedMarriageAudit?.report?.mulankAnalysis?.score || 85}%</strong> ({savedMarriageAudit?.report?.mulankAnalysis?.relationshipTypeHi || 'मित्रवत'})</p>
                <p>• भाग्यांक सामंजस्य: <strong>{savedMarriageAudit?.report?.bhagyankAnalysis?.score || 80}%</strong> ({savedMarriageAudit?.report?.bhagyankAnalysis?.relationshipTypeHi || 'सहयोगी'})</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">
                Lo Shu ग्रिड एवं पूरक ऊर्जा (Complementary Grid Energy)
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {savedMarriageAudit?.report?.loShuAnalysis?.crossGridSynergyHi || 'एक पार्टनर की अनुपस्थित ऊर्जा दूसरे पार्टनर के मजबूत अंकों द्वारा संतुलित होती है, जिससे दांपत्य जीवन में स्थायित्व बनता है।'}
              </p>
              <p className="text-[10px] text-slate-500 border-t border-slate-200 pt-2">
                <strong>वैदिक उपाय:</strong> {savedMarriageAudit?.report?.remedies?.traditionalVastuHi || 'शयनकक्ष को दक्षिण-पश्चिम (SW) दिशा में रखें और अनुकूल रंगों का प्रयोग करें।'}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 text-[10px] text-slate-600 leading-relaxed">
            <strong>वैवाहिक अस्वीकरण:</strong> अंकशास्त्रीय सामंजस्य विश्लेषण केवल दोनों व्यक्तियों के स्वभाव, मानसिक तालमेल और ऊर्जा संतुलन को समझने का साधन है। सच्चा दांपत्य सुख परस्पर निष्ठा, निरंतर संवाद और प्रेम पर निर्भर करता है।
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 30. CONSOLIDATED REMEDIES & 90-DAY ACTION PLAN */}
        {/* ========================================================================= */}
        <section id="sec-30" className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="border-b border-[#F3F4F6] pb-3">
            <span className="text-[10px] font-mono uppercase text-[#D97706] font-bold tracking-wider">Section 30</span>
            <h3 className="font-playfair text-xl font-bold text-[#1F2937]">Consolidated Remedies & 90-Day Action Plan</h3>
          </div>

          {/* Consolidated Remedies Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">1. Personal & Gemstone:</strong>
              <p className="text-[#4B5563] text-[11px] leading-relaxed">
                शुभ रत्न: {remedies?.gemstones.join(' या ') || 'पन्ना / पुखराज'} • शुभ रंग: {remedies?.colors.join(', ') || 'हल्का हरा, सफेद एवं पीला'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">2. Vastu & Direction:</strong>
              <p className="text-[#4B5563] text-[11px] leading-relaxed">
                ईशान कोण में जल पात्र रखें • अध्ययन/कार्य की बैठक {vastu.kua.shengChi.direction} में रखें।
              </p>
            </div>

            <div className="p-4 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A]">
              <strong className="text-[#92400E] block font-bold mb-1">3. Mobile & Signature:</strong>
              <p className="text-[#4B5563] text-[11px] leading-relaxed">
                हस्ताक्षर सदैव 15° ऊपर की ओर करें • मोबाइल वॉलपेपर पर शुभ प्राकृतिक या सूर्य का चित्र लगाएं।
              </p>
            </div>
          </div>

          {/* 90-Day Action Plan */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              90-Day Step-by-Step Strategic Roadmap
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block mb-1">DAYS 1 – 30</span>
                <strong className="font-bold text-sm text-[#92400E] block mb-1">Foundation Phase (नींव)</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  हस्ताक्षर में सुधार करें, कार्यस्थल की दिशा ठीक करें और दैनिक समय-सारणी में अनुशासन लाएं।
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block mb-1">DAYS 31 – 60</span>
                <strong className="font-bold text-sm text-[#92400E] block mb-1">Remediation Phase (उपाय)</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  नाम एवं मोबाइल ऊर्जा को सक्रिय रखें, उपयुक्त रंगों का प्रयोग बढ़ाएं और नए संपर्कों पर काम करें।
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                <span className="text-[9px] font-mono text-[#92400E] uppercase font-bold block mb-1">DAYS 61 – 90</span>
                <strong className="font-bold text-sm text-[#92400E] block mb-1">Observation Phase (अवलोकन)</strong>
                <p className="text-[#4B5563] text-[11px] leading-relaxed">
                  सकारात्मक परिणामों की समीक्षा करें, ऊर्जा प्रवाह बनाए रखें और दीर्घकालिक लक्ष्यों को गति दें।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 31. FINAL LEOFAMILY CONSULTATION SUMMARY */}
        {/* ========================================================================= */}
        <section id="sec-31" className="bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] text-white rounded-3xl p-6 md:p-8 shadow-md space-y-6">
          <div className="border-b border-blue-400/20 pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Section 31</span>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-white">
                LeoFamily Consultation Summary (अंतिम परामर्श निष्कर्ष)
              </h3>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full font-semibold">
              आपकी 5–7 सबसे महत्वपूर्ण बातें
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">1. सबसे मजबूत गुण (Strongest Quality):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  मूलांक #{coreNumbers.mulank} की प्राकृतिक नेतृत्व क्षमता और स्पष्ट दृष्टिकोण।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">2. प्रमुख विकास क्षेत्र (Key Development Area):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  मिसिंग अंकों की ऊर्जा को दैनिक अनुशासन और सरल उपायों द्वारा संतुलित करना।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">3. करियर की दिशा (Career Direction):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  रणनीतिक प्रबंधन, व्यापार, संचार और परामर्श में सर्वोच्च सफलता की संभावना।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">4. संबंध एवं परिवार (Relationship Harmony):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  पारस्परिक समझ, स्पष्ट बातचीत और भावनात्मक संतुलन बनाए रखें।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">5. मुख्य पारंपरिक उपाय (Primary Remedy):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  अनुकूल रंगों का प्रयोग, ईशान कोण की शुद्धि एवं 15° ऊपर की ओर हस्ताक्षर।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">6. वर्तमान कालखंड संदेश (Time-Cycle Guidance):</strong>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  पर्सनल ईयर #{personalYearVal} आपको नए विस्तार और सकारात्मक बदलाव के लिए पूरी तरह समर्थन दे रहा है।
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

      </div>
    </div>
  );
};

export default MasterReportUnified;
