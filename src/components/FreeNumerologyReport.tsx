import React, { useRef, useState } from 'react';
import { CompleteNumerologyProfile } from '../core/types';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';
import { getPlanetName, getLocalizedNumberMeaning } from '../i18n/dynamicContent';
import { getCombination81 } from '../core/methodology/combinationDefinitions';
import { calculatePersonalYearNumber } from '../core/luckyDatesEngine';
import { calculateKuaNumber } from '../core/kuaEngine';
import { parseIndianDate, formatDateIndian } from '../utils/dateUtils';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Sparkles,
  Compass,
  Phone,
  User,
  Heart,
  Briefcase,
  Shield,
  Calendar,
  Layers,
  Award,
  Download,
  Printer,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Star,
  Home,
  FileText,
  Activity,
  Check
} from 'lucide-react';

interface FreeNumerologyReportProps {
  profile: CompleteNumerologyProfile;
  personalDetails?: PersonalDetails | null;
  dobData?: DOBAnalysis | null;
  nameData?: NameAnalysis | null;
  mobileData?: MobileAnalysis | null;
  remedies?: remediesAdvice | null;
  onUpgradeToPremium: () => void;
}

export const FreeNumerologyReport: React.FC<FreeNumerologyReportProps> = ({
  profile,
  personalDetails,
  dobData,
  nameData,
  mobileData,
  remedies,
  onUpgradeToPremium
}) => {
  const { language } = useLanguage();
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const {
    identity,
    coreNumbers,
    loshu,
    vastu,
    nameNumerology,
    mobileAnalysis,
    personality
  } = profile;

  const mulank = coreNumbers.mulank;
  const bhagyank = coreNumbers.bhagyank;
  const mulankGraha = coreNumbers.mulankGraha || getPlanetName(mulank, language);
  const bhagyankGraha = coreNumbers.bhagyankGraha || getPlanetName(bhagyank, language);

  const dobStr = personalDetails?.dob || identity?.dob || '';
  const parsedDob = parseIndianDate(dobStr);
  const formattedDob = parsedDob.isValid ? formatDateIndian(dobStr) : (identity.standardDOB || '—');
  const reportDate = formatDateIndian(new Date());

  // Personal Year
  const currentYear = new Date().getFullYear();
  const personalYear = calculatePersonalYearNumber(dobStr, currentYear);

  // Kua Number
  const gender = (personalDetails?.gender || identity?.gender || 'MALE') as 'MALE' | 'FEMALE' | 'OTHER';
  const kuaProfile = calculateKuaNumber(parsedDob.isValid ? parsedDob.year : currentYear - 30, gender);

  // 81 Combination details
  const comb81 = getCombination81(mulank, bhagyank);

  // Number meaning from registry
  const numberMeaning = getLocalizedNumberMeaning(mulank, language);

  // Present and missing numbers from enhanced grid
  const presentDigits = loshu.enhancedGrid?.effectivePresentDigits || [];
  const missingDigits = loshu.enhancedGrid?.effectiveMissingDigits || [];
  const birthGrid = loshu.birthGrid || {};

  // Lucky Dates from profile remedies or formula
  const luckyDatesList = profile.remedies?.luckyDates ?? [];
  const luckyDaysList = profile.remedies?.luckyDays?.length
    ? profile.remedies.luckyDays.join(', ')
    : null;

  // PDF Export
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setPdfGenerating(true);
    try {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
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

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const safeName = (identity.fullName || 'User').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`LeoFamily_Free_Numerology_Report_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left font-sans max-w-5xl mx-auto">
      {/* Action Header Bar (Screen only) */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-900 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300 font-bold uppercase tracking-wider">
              100% Free Numerology Report
            </span>
            <span className="text-xs text-stone-500 font-medium">11 Structured Sections</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900">
            वैदिक एवं चाल्डियन निःशुल्क अंकशास्त्रीय परामर्श रिपोर्ट
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            व्यक्तिगत रिपोर्ट: <strong>{identity.fullName || 'जिज्ञासु'}</strong> • जन्मतिथि: {formattedDob}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FAF5EE] text-[#78350F] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-all cursor-pointer"
            title="प्रिंट करें"
          >
            <Printer className="w-4 h-4 text-[#D97706]" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={pdfGenerating}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{pdfGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* PRINT / SCREEN REPORT CANVAS */}
      <div
        id="free-report-printable-dossier"
        ref={reportRef}
        className="bg-[#FAF8F5] p-5 sm:p-8 md:p-10 rounded-3xl border border-[#E5E7EB] text-stone-800 space-y-8"
      >
        {/* ========================================================================= */}
        {/* 0. FORMAL COVER HEADER */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5">
            <div className="flex items-center gap-3">
              <BrandLogo size="md" />
              <div>
                <h1 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 tracking-wide">
                  LEOFAMILY NUMEROLOGY AI
                </h1>
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold block">
                  Vedic Astrology & Chaldean Vibrations Authority
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-stone-500 font-mono space-y-0.5">
              <div>रिपोर्ट दिनांक: <span className="text-stone-800 font-bold">{reportDate}</span></div>
              <div>श्रेणी: <span className="text-[#D97706] font-bold">निःशुल्क परामर्श आख्या (Free Dossier)</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">परामर्शार्थी (Name)</span>
              <span className="font-bold text-stone-900 text-sm truncate block">{identity.fullName || 'जिज्ञासु'}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">जन्मतिथि (DOB)</span>
              <span className="font-bold text-stone-900 text-sm block">{formattedDob}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">मूलांक (Driver)</span>
              <span className="font-bold text-[#D97706] text-sm block">{mulank} ({mulankGraha})</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">भाग्यांक (Conductor)</span>
              <span className="font-bold text-blue-900 text-sm block">{bhagyank} ({bhagyankGraha})</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#D97706] flex-shrink-0" />
            <span>
              यह निःशुल्क रिपोर्ट उपलब्ध जन्म-विवरण और LeoFamily में लागू अंकशास्त्रीय नियमों पर आधारित है। व्याख्याएँ पारंपरिक मान्यताओं को दर्शाती हैं, निश्चित भविष्यवाणी या वैज्ञानिक निष्कर्ष नहीं।
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: DRIVER (MULANK) & CONDUCTOR (BHAGYANK) ANALYSIS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                01
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                मूलांक एवं भाग्यांक विश्लेषण (Driver & Conductor Analysis)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border-2 border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold tracking-wider">
                    जन्म अंक / आत्म चेतना
                  </span>
                  <h4 className="font-playfair text-lg font-bold text-stone-900">
                    मूलांक #{mulank} — {mulankGraha}
                  </h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-playfair font-black text-2xl shadow-sm">
                  {mulank}
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {numberMeaning?.nature || 'आत्मविश्वास, नवोन्मेष और आंतरिक स्वाभाविक गुणों का प्रतिनिधित्व करता है।'}
              </p>
              <div className="pt-1 text-[11px] text-stone-600 border-t border-amber-200/80 space-y-1">
                <div><strong>तत्व (Element):</strong> {numberMeaning?.element || 'अग्नि / वायु'}</div>
                <div><strong>ऊर्जा स्वरूप:</strong> {numberMeaning?.energy || 'सक्रिय व नेतृत्वकारी'}</div>
              </div>
            </div>

            {/* Conductor Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-white to-blue-500/5 border-2 border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-800 uppercase font-bold tracking-wider">
                    संपूर्ण जन्मतिथि योग / कर्म दिशा
                  </span>
                  <h4 className="font-playfair text-lg font-bold text-stone-900">
                    भाग्यांक #{bhagyank} — {bhagyankGraha}
                  </h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-playfair font-black text-2xl shadow-sm">
                  {bhagyank}
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                भाग्यांक आपके जीवन के उद्देश्य, कर्म क्षेत्र एवं परिपक्वता काल की दिशा को नियंत्रित करता है। यह आपका जीवन पथ है।
              </p>
              <div className="pt-1 text-[11px] text-stone-600 border-t border-blue-200 space-y-1">
                <div><strong>ग्रह स्वामी:</strong> {bhagyankGraha}</div>
                <div><strong>कार्यक्षेत्र प्रभाव:</strong> {comb81?.careerMeaning || 'व्यावसायिक एवं सामाजिक प्रतिष्ठा'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: CORE TRAITS & COMBINED INFLUENCE */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                02
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                मूल स्वभाव एवं संयुक्त ग्रहीय प्रभाव (Core Traits & Combined Influence)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-amber-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-playfair font-bold text-base text-[#92400E] flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D97706] fill-amber-400" />
                {comb81?.title || `मूलांक ${mulank} एवं भाग्यांक ${bhagyank} का योग`}
              </span>
              <span className="text-[10px] font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                Pair: {comb81?.planetaryPair || `${mulankGraha} - ${bhagyankGraha}`}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {comb81?.positiveMeaning || 'मूलांक और भाग्यांक की यह युति आपके विचारों में रचनात्मकता तथा कार्यों में दृढ़ता प्रदान करती है।'}
            </p>
            <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-600">
              <strong className="text-stone-900 block mb-1">मुख्य ग्रहीय ऊर्जा समन्वय:</strong>
              {mulankGraha} की स्वाभाविक प्रेरणा के साथ {bhagyankGraha} का मार्गदर्शन मिलने से आप अपने चुने हुए क्षेत्र में दीर्घकालिक प्रभाव छोड़ते हैं।
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: STRENGTHS & CHALLENGES */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                03
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                प्रमुख शक्तियां एवं जीवन चुनौतियां (Strengths & Challenges)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold font-playfair text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>प्राकृतिक शक्तियां (Core Strengths)</span>
              </div>
              <ul className="space-y-1.5 text-stone-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{personality?.thinkingStyle || 'तीक्ष्ण निर्णय क्षमता एवं तार्किक विश्लेषण।'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{personality?.communicationStyle || 'प्रभावी अभिव्यक्ति एवं स्वतंत्र विचार शैली।'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>संकट के समय धैर्यपूर्वक समाधान खोजने की क्षमता।</span>
                </li>
              </ul>
            </div>

            {/* Challenges */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-2 text-[#92400E] font-bold font-playfair text-sm">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <span>सावधानियां व चुनौतियां (Growth Areas)</span>
              </div>
              <ul className="space-y-1.5 text-stone-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>अति-उत्साह अथवा जल्दबाजी में निर्णय लेने से बचें।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>दूसरों के विचारों को भी पर्याप्त समय व सम्मान दें।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{personality?.stressResponsePattern || 'मानसिक तनाव के समय नियमित ध्यान व विश्राम अपनाएं।'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: POSITIVE & NEGATIVE CHARACTERISTICS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                04
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                सकारात्मक एवं नकारात्मक प्रवृत्तियां (Positive & Negative Characteristics)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <strong className="text-emerald-700 block font-bold font-playfair text-sm">
                सकारात्मक प्रवृत्तियां (Positive Traits)
              </strong>
              <p className="text-stone-600 leading-relaxed">
                नेतृत्व क्षमता, स्पष्टवादिता, कर्मठता, ज्ञानार्जन की तीव्र इच्छा, तथा विपरीत परिस्थितियों में भी संभलने का नैतिक साहस।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <strong className="text-rose-700 block font-bold font-playfair text-sm">
                नियंत्रण योग्य प्रवृत्तियां (Traits to Balance)
              </strong>
              <p className="text-stone-600 leading-relaxed">
                {comb81?.negativeMeaning || 'अधीरता, आवश्यकता से अधिक कठोरता, अथवा भावनाओं को दबाने की प्रवृत्ति। वाणी में सौम्यता बनाए रखना आपके लिए अमृत समान है।'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: PERSONAL QUALITIES & LO SHU GRID THEMES */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                05
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                लो शू जन्म चक्र एवं तल विश्लेषण (Lo Shu Natal Grid & Life Themes)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 3x3 Natal Grid */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-2">
              <div className="grid grid-cols-3 gap-2 bg-stone-900 p-3 rounded-2xl border-2 border-amber-400 shadow-inner max-w-[220px]">
                {[
                  [4, 9, 2],
                  [3, 5, 7],
                  [8, 1, 6]
                ].flat().map((digit) => {
                  const count = birthGrid[digit] || 0;
                  const isPresent = count > 0;
                  return (
                    <div
                      key={digit}
                      className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isPresent
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-xs'
                          : 'bg-stone-800 text-stone-500 border border-stone-700/60'
                      }`}
                    >
                      <span className="leading-tight">{digit}</span>
                      {isPresent && count > 1 && (
                        <span className="text-[10px] font-mono opacity-90">x{count}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                3x3 Natal Magic Square
              </span>
            </div>

            {/* Present and Missing Details */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800">सक्रिय एवं उपस्थित अंक (Active Numbers):</span>
                  <span className="font-mono text-[11px] text-emerald-700 font-bold">
                    {presentDigits.length > 0 ? presentDigits.join(', ') : '—'}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  ये अंक आपकी प्राकृतिक योग्यताओं एवं जन्मजात क्षमताओं का प्रतिनिधित्व करते हैं।
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800">रिक्त अंक एवं कार्मिक पाठ (Missing Numbers):</span>
                  <span className="font-mono text-[11px] text-amber-700 font-bold">
                    {missingDigits.length > 0 ? missingDigits.join(', ') : 'कोई नहीं'}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  अनुपस्थित अंक जीवन में अनुभव द्वारा सीखे जाने वाले क्षेत्रों को दर्शाते हैं।
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                <strong>मुख्य तल स्थिति:</strong> मानसिक तल (4-9-2), भावनात्मक तल (3-5-7) और व्यावहारिक तल (8-1-6) का प्रारंभिक संतुलन आपके स्वभाव में बहुमुखी प्रतिभा दर्शाता है।
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: NAME ANALYSIS & SPELLING BALANCE */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                06
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                नाम अंकशास्त्र एवं ध्वनि संतुलन (Name Analysis & Spelling Balance)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED]
            </span>
          </div>

          {nameNumerology ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase block">चाल्डियन संयुक्त नामांक</span>
                <span className="text-2xl font-bold font-playfair text-[#D97706] block">
                  {nameNumerology.chaldean.compoundNumber}
                </span>
                <span className="text-[11px] text-stone-600">ध्वनि कंपन तरंग</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase block">चाल्डियन एकल नामांक</span>
                <span className="text-2xl font-bold font-playfair text-blue-900 block">
                  {nameNumerology.chaldean.rootNumber}
                </span>
                <span className="text-[11px] text-stone-600">ग्रह: {getPlanetName(nameNumerology.chaldean.rootNumber, language)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                <span className="text-[10px] font-mono text-stone-500 uppercase block">पाइथागोरियन अभिव्यक्ति</span>
                <span className="text-2xl font-bold font-playfair text-emerald-800 block">
                  {nameNumerology.pythagorean.expressionNumber}
                </span>
                <span className="text-[11px] text-stone-600">व्यक्तित्व प्रकटीकरण</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
              अपना पूरा नाम प्रोफाइल में जोड़कर चाल्डियन व पाइथागोरियन नाम शुद्धि का सटीक फल प्राप्त करें।
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: MOBILE NUMEROLOGY & KEY NUMBER COMBINATIONS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                07
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                मोबाइल अंकशास्त्र एवं युगल प्रभाव (Mobile Numerology & Combinations)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED]
            </span>
          </div>

          {mobileAnalysis ? (
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">विश्लेषित नंबर</span>
                  <div className="font-mono font-bold text-base text-stone-900 tracking-wider">
                    {identity.mobile || '—'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-stone-400 block">कुल योग / एकल कंपन</span>
                    <span className="text-sm font-bold text-[#D97706] font-mono">
                      {mobileAnalysis.compoundNumber || mobileAnalysis.compoundTotal} → #{mobileAnalysis.rootNumber}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-stone-700 leading-relaxed">
                {mobileAnalysis.compoundClassification?.meaning ||
                  mobileAnalysis.recommendation ||
                  'यह मोबाइल नंबर आपके व्यापारिक संचार, सामाजिक संपर्कों और दैनिक बातचीत में अनुकूल तरंगें उत्पन्न करता है।'}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
              अपना १०-अंकीय मोबाइल नंबर जोड़कर सभी ९ युग्मों का वैज्ञानिक परीक्षण निःशुल्क देखें।
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: LUCKY COLOURS, DAYS, DATES & PROFESSIONS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                08
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                शुभ रंग, दिन, तिथियां एवं अनुकूल व्यवसाय (Lucky Alignments & Professions)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">शुभ रंग (Lucky Colors)</span>
              <span className="font-bold text-stone-900 block">{numberMeaning?.luckyColor || 'सुनहरा, पीला, नारंगी'}</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">अनुकूल दिन (Lucky Days)</span>
              <span className="font-bold text-stone-900 block">{luckyDaysList || 'पंजीकृत नियम के आधार पर डेटा उपलब्ध नहीं'}</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">शुभ तिथियां (Auspicious Dates)</span>
              <span className="font-bold text-[#D97706] block font-mono">
                {luckyDatesList.length ? luckyDatesList.slice(0, 4).join(', ') : 'पंजीकृत नियम के आधार पर डेटा उपलब्ध नहीं'}
              </span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">अनुकूल क्षेत्र (Professions)</span>
              <span className="font-bold text-stone-900 block truncate">{comb81?.careerMeaning ? comb81.careerMeaning.slice(0, 30) + '...' : 'प्रबंधन, परामर्श, व्यवसाय'}</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: PERSONAL DEVELOPMENT & TRADITIONAL REMEDIES */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                09
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                आत्म-विकास एवं पारंपरिक वैदिक उपाय (Personal Development & Remedies)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [RECOMMENDED]
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#92400E] font-bold font-playfair text-sm">
              <Shield className="w-4 h-4 text-[#D97706]" />
              <span>दैनिक जीवन में सकारात्मक ऊर्जा संतुलन हेतु सुझाव</span>
            </div>
            <div className="space-y-2 text-stone-700">
              <div>
                <strong>मंत्र साधना:</strong> {numberMeaning?.mantra || 'ॐ घृणिः सूर्याय नमः'} (प्रतिदिन प्रातः १०८ बार शांत मन से जपें)
              </div>
              <div>
                <strong>पारंपरिक उपाय:</strong> {numberMeaning?.remedy || 'पक्षियों को अन्न-जल दें और बड़ों का आदर करें।'}
              </div>
              <div>
                <strong>रंग चिकित्सा:</strong> महत्वपूर्ण बैठकों में अपने शुभ रंग {numberMeaning?.luckyColor || 'हल्के व सौम्य रंग'} का प्रयोग करें।
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: NUMERO VASTU */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                10
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                न्यूमेरो वास्तु एवं कुआ अंक दिशा (Numero Vastu & Kua Energy)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1 text-center">
              <span className="text-[10px] font-mono text-stone-500 uppercase block">कुआ अंक (Kua Number)</span>
              <span className="text-3xl font-bold font-playfair text-emerald-700 block">
                {kuaProfile.kuaNumber}
              </span>
              <span className="text-[11px] text-stone-500">{kuaProfile.group}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold block">
                सर्वोत्तम धन व समृद्धि दिशा (Sheng Chi / Wealth)
              </span>
              <div className="font-bold text-stone-900 text-sm">
                {kuaProfile.favourableDirections?.shengChi || kuaProfile.favorableDirections?.[0]?.direction || 'ईशान / उत्तर'}
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed pt-1">
                कार्य करते समय अथवा अध्ययन के दौरान अपना मुख इस दिशा की ओर रखने से एकाग्रता और सकारात्मक ऊर्जा में वृद्धि होती है।
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: PERSONAL-YEAR OR TIMING ANALYSIS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                11
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                व्यक्तिगत वर्ष एवं कालचक्र विश्लेषण (Personal Year & Timing)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED]
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#FAF5EE] to-amber-500/5 border border-amber-300 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-playfair font-bold text-stone-900 text-sm">
                वर्ष {currentYear} की सक्रिय ऊर्जा: <strong className="text-[#D97706]">Personal Year #{personalYear}</strong>
              </span>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded font-bold">
                9-Year Cycle
              </span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              यह वर्ष आपके लिए {personalYear === 1 ? 'नई शुरुआत, नए संकल्प एवं स्वावलंबन' : personalYear === 3 ? 'ज्ञान विस्तार, अध्ययन व सामाजिक संपर्क' : personalYear === 5 ? 'सकारात्मक परिवर्तन, यात्रा व प्रगति' : 'धैर्य, संतुलन व आंतरिक विकास'} का कालखंड है। योजनाबद्ध तरीके से कार्य करने पर उत्तम परिणाम प्राप्त होंगे।
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* EXECUTIVE UPGRADE CARD (PREMIUM MASTER REPORT CALLOUT) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-amber-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-700/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/30 mb-2">
                <Award className="w-3.5 h-3.5" /> Full 32-Chapter Master Dossier
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                Complete Premium Master Report Unlock करें
              </h3>
              <p className="text-stone-300 text-xs mt-1 max-w-xl leading-relaxed">
                यह निःशुल्क रिपोर्ट केवल मुख्य ११ सारांश प्रस्तुत करती है। संपूर्ण ३२-अध्यायों की विस्तृत रिपोर्ट में आपको वैदिक महादशा चक्र, संपूर्ण ८१ ग्रहीय युति, ९०-दिवसीय कार्ययोजना एवं प्रिंटेबल मास्टर PDF प्राप्त होता है।
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-[11px] text-stone-400 line-through">वास्तविक मूल्य: ₹499</div>
              <div className="text-3xl font-extrabold text-amber-400 font-playfair">₹33 <span className="text-xs font-normal text-stone-300">मात्र</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>सम्पूर्ण 32 अध्याय विस्तृत विश्लेषण</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>वैदिक महादशा एवं अंतर्दशा समय चक्र</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>90-दिवसीय व्यक्तिगत कार्ययोजना</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>81 मोबाइल पेयर विस्तृत मैट्रिक्स</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>नाम स्पेलिंग शुद्धि एवं अक्षर संतुलन</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>उच्च गुणवत्ता वाली प्रिंटेबल Master PDF</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-stone-400">
              सुरक्षित UPI / UTR सत्यापन • तत्काल रिपोर्ट अनलॉकिंग
            </span>
            <button
              onClick={onUpgradeToPremium}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Master Report (₹33)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MANDATORY LEGAL & ETHICAL DISCLAIMER */}
        {/* ========================================================================= */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 text-[10px] text-stone-500 leading-relaxed space-y-1">
          <strong className="text-stone-700 block uppercase font-mono tracking-wider">
            परामर्श व सुरक्षा अस्वीकरण (Ethical Numerology Disclaimer):
          </strong>
          <p>
            अंकशास्त्र एवं ज्योतिषीय पद्धतियां प्राचीन भारतीय व चालडीन सांस्कृतिक परम्पराओं पर आधारित आत्म-चिंतन व मार्गदर्शन उपकरण हैं। यह कोई चिकित्सीय निदान, कानूनी गारंटी, वित्तीय निवेश सलाह अथवा बाध्यकारी भविष्यवाणी नहीं है। किसी भी स्वास्थ्य संबंधी समस्या हेतु योग्य चिकित्सक तथा वित्तीय निर्णय हेतु पंजीकृत विशेषज्ञ से परामर्श लें।
          </p>
        </div>
      </div>
    </div>
  );
};
