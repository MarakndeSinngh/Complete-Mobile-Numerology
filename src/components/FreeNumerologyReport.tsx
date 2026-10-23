import React, { useMemo, useRef, useState } from 'react';
import { CompleteNumerologyProfile } from '../core/types';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';
import { getPlanetName, getLocalizedNumberMeaning } from '../i18n/dynamicContent';
import { getCombination81 } from '../core/methodology/combinationDefinitions';
import { NUMBER_DEFINITIONS } from '../core/methodology/numberMeanings';
import { PLANET_DEFINITIONS } from '../core/methodology/planetMappings';
import { MASTER_PLANES } from '../core/methodology/planeDefinitions';
import { MASTER_ARROWS } from '../core/methodology/arrowDefinitions';
import { PROFESSION_RULES } from '../core/methodology/professionDefinitions';
import { deriveExpertConsultationDossier } from '../core/expertConsultationEngine';
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
    personality,
    interpretations,
    vedicDasha,
    medical
  } = profile;

  const mulank = coreNumbers.mulank || 1;
  const bhagyank = coreNumbers.bhagyank || 1;
  const mulankGraha = coreNumbers.mulankGraha || getPlanetName(mulank, language);
  const bhagyankGraha = coreNumbers.bhagyankGraha || getPlanetName(bhagyank, language);

  const mDef = NUMBER_DEFINITIONS[mulank] || NUMBER_DEFINITIONS[1];
  const bDef = NUMBER_DEFINITIONS[bhagyank] || NUMBER_DEFINITIONS[1];
  const mPlanet = PLANET_DEFINITIONS[mulank] || PLANET_DEFINITIONS[1];
  const bPlanet = PLANET_DEFINITIONS[bhagyank] || PLANET_DEFINITIONS[1];

  const dobStr = (personalDetails?.dob || identity?.dob || identity?.standardDOB || '').trim();
  const parsedDob = parseIndianDate(dobStr);
  const hasValidDob = Boolean(parsedDob && parsedDob.isValid);
  const formattedDob = hasValidDob ? formatDateIndian(dobStr) : 'अमान्य / अनुपस्थित जन्मतिथि (Valid DOB Required)';
  const reportDate = formatDateIndian(new Date());

  // Expert Consultation Dossier
  const expertDossier = useMemo(() => deriveExpertConsultationDossier(profile), [profile]);

  // Personal Year (Authoritative single-source calculation; suppressed when DOB is invalid)
  const currentYear = new Date().getFullYear();
  const personalYear = hasValidDob ? calculatePersonalYearNumber(dobStr, currentYear) : 0;
  const pyNarrative = expertDossier.personalYearNarrative;

  // Kua Number (Strictly requires valid birth year; never substitute currentYear - 30)
  const gender = (personalDetails?.gender || identity?.gender || 'MALE') as 'MALE' | 'FEMALE' | 'OTHER';
  const kuaProfile = useMemo(() => {
    if (!hasValidDob || !parsedDob) return null;
    if (profile.kua && typeof profile.kua === 'object' && profile.kua.kuaNumber) {
      return profile.kua;
    }
    return calculateKuaNumber(parsedDob.year, gender);
  }, [hasValidDob, parsedDob, profile.kua, gender]);

  // 81 Combination details
  const comb81 = getCombination81(mulank, bhagyank);

  // Number meaning from registry
  const numberMeaning = getLocalizedNumberMeaning(mulank, language);
  const bhagyankNumberMeaning = getLocalizedNumberMeaning(bhagyank, language);

  // Present and missing numbers from birth and enhanced grid
  const birthGrid = loshu.birthGrid || {};
  const enhancedGridCounts = loshu.enhancedGrid?.flatGrid || birthGrid;
  const birthPresentDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => (birthGrid[d] || 0) > 0);
  const presentDigits = loshu.enhancedGrid?.effectivePresentDigits || birthPresentDigits;
  const missingDigits = loshu.enhancedGrid?.effectiveMissingDigits || [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !presentDigits.includes(d));

  // Matched professions from registered rules
  const matchedProfessions = useMemo(
    () => Object.values(PROFESSION_RULES).filter(r => r.requiredNumbers.includes(mulank) || r.requiredNumbers.includes(bhagyank)),
    [mulank, bhagyank]
  );

  // Lucky Dates & Days from profile remedies
  const luckyDatesList = profile.remedies?.luckyDates ?? [];
  const luckyDaysList = profile.remedies?.luckyDays?.length
    ? profile.remedies.luckyDays.join(', ')
    : `${mPlanet.day}, ${bPlanet.day}`;

  // Check whether optional inputs were genuinely provided
  const rawName = (personalDetails?.name || identity?.fullName || '').trim();
  const hasProvidedName = Boolean(
    rawName &&
    !['जिज्ञासु', 'User', 'Valued Seeker', 'अतिथि', 'Guest'].includes(rawName) &&
    nameNumerology &&
    nameNumerology.chaldean.compoundNumber > 0
  );

  const rawMobile = (personalDetails?.mobile || identity?.mobile || '').replace(/\D/g, '');
  const isValidTenDigitMobile = rawMobile.length === 10 && rawMobile !== '0000000000';
  const hasPartialOrInvalidMobile = rawMobile.length > 0 && !isValidTenDigitMobile;
  const hasProvidedMobile = Boolean(isValidTenDigitMobile && mobileAnalysis);

  // Page-Aware A4 PDF Export (prevents cutting cards, text lines, or detaching headings)
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setPdfGenerating(true);
    const element = reportRef.current;
    try {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
      element.classList.add('pdf-exporting');
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // Ensure all images (including BrandLogo /logo.jpg) are loaded
      const imgs = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((res) => {
                img.onload = () => res();
                img.onerror = () => res();
              })
        )
      );

      const rootRect = element.getBoundingClientRect();
      const domWidth = rootRect.width || 1000;
      const domHeight = element.scrollHeight;

      // A4 geometry in mm: 210 x 297, margins: 10mm left/right, 13mm top, 15mm bottom
      const pageWidthMm = 210;
      const pageHeightMm = 297;
      const marginX = 10;
      const marginTop = 13;
      const marginBottom = 15;
      const contentWidthMm = pageWidthMm - marginX * 2; // 190mm
      const maxContentHeightMm = pageHeightMm - marginTop - marginBottom; // 269mm
      const maxPageDomHeight = (maxContentHeightMm / contentWidthMm) * domWidth;

      // Collect indivisible atomic blocks and heading keep-with-next zones in DOM coordinates
      const atomicIntervals: Array<{ top: number; bottom: number }> = [];
      const atomicNodes = element.querySelectorAll(
        'p, li, tr, blockquote, .rounded-xl, .rounded-2xl, .grid > div'
      );
      atomicNodes.forEach((node) => {
        const el = node as HTMLElement;
        if (el.offsetParent === null) return;
        const r = el.getBoundingClientRect();
        const top = r.top - rootRect.top;
        const bottom = r.bottom - rootRect.top;
        const h = bottom - top;
        if (h > 4 && h <= maxPageDomHeight * 0.72) {
          atomicIntervals.push({ top, bottom });
        }
      });

      const headingNodes = element.querySelectorAll('h1, h2, h3, h4, section > div:first-child');
      headingNodes.forEach((node) => {
        const el = node as HTMLElement;
        if (el.offsetParent === null) return;
        const r = el.getBoundingClientRect();
        const top = r.top - rootRect.top;
        const bottom = r.bottom - rootRect.top;
        if (bottom - top > 4 && bottom - top <= 180) {
          atomicIntervals.push({ top: Math.max(0, top - 8), bottom: Math.min(domHeight, bottom + 110) });
        }
      });

      // Compute safe page break Y coordinates in DOM pixels
      const pageBreaks: number[] = [0];
      let curY = 0;
      while (curY + maxPageDomHeight < domHeight - 8) {
        let candidateY = curY + maxPageDomHeight;
        const minAllowedY = curY + maxPageDomHeight * 0.35;

        let adjusted = true;
        let guard = 0;
        while (adjusted && guard < 60) {
          adjusted = false;
          guard++;
          for (const box of atomicIntervals) {
            if (box.top + 2 < candidateY && box.bottom - 2 > candidateY) {
              if (box.top - 6 >= minAllowedY) {
                candidateY = box.top - 6;
                adjusted = true;
                break;
              }
            }
          }
        }
        pageBreaks.push(candidateY);
        curY = candidateY;
      }
      pageBreaks.push(domHeight);

      const scale = 2;
      const fullCanvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F5',
        ignoreElements: (el) =>
          el.classList?.contains('no-print') || el.tagName === 'BUTTON'
      });

      const ratio = fullCanvas.width / domWidth;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const totalPages = pageBreaks.length - 1;

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        const sliceStartDom = pageBreaks[i];
        const sliceEndDom = pageBreaks[i + 1];
        const sliceDomH = Math.max(1, sliceEndDom - sliceStartDom);

        const sy = Math.max(0, Math.floor(sliceStartDom * ratio));
        const sh = Math.min(fullCanvas.height - sy, Math.ceil(sliceDomH * ratio));

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = fullCanvas.width;
        pageCanvas.height = sh;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FAF8F5';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(fullCanvas, 0, sy, fullCanvas.width, sh, 0, 0, fullCanvas.width, sh);
        }

        const sliceImg = pageCanvas.toDataURL('image/jpeg', 0.94);
        const sliceHeightMm = Math.min(maxContentHeightMm, (sliceDomH / domWidth) * contentWidthMm);

        // Running Header
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(120, 113, 108);
        pdf.text('LEOFAMILY VEDIC & CHALDEAN NUMEROLOGY DOSSIER (FREE CONSULTATION REPORT)', marginX, 8.5);
        pdf.text(`DOB: ${hasValidDob ? formattedDob : 'N/A'}`, pageWidthMm - marginX, 8.5, { align: 'right' });
        pdf.setDrawColor(231, 229, 228);
        pdf.line(marginX, 10, pageWidthMm - marginX, 10);

        // Page Slice Image
        pdf.addImage(sliceImg, 'JPEG', marginX, marginTop, contentWidthMm, sliceHeightMm, undefined, 'FAST');

        // Running Footer & Page Number
        pdf.setDrawColor(231, 229, 228);
        pdf.line(marginX, pageHeightMm - 10.5, pageWidthMm - marginX, pageHeightMm - 10.5);
        pdf.setFontSize(7.5);
        pdf.setTextColor(120, 113, 108);
        pdf.text('LeoFamily Astro-Numerology Authority • Authentic Calculation & Interpretation', marginX, pageHeightMm - 6.5);
        pdf.text(`Page ${i + 1} of ${totalPages}`, pageWidthMm - marginX, pageHeightMm - 6.5, { align: 'right' });
      }

      const safeName = (rawName || 'Seeker').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`LeoFamily_Free_Numerology_Report_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      element.classList.remove('pdf-exporting');
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
              100% Free Detailed Numerology Dossier
            </span>
            <span className="text-xs text-stone-500 font-medium">11 Comprehensive Consultation Sections</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900">
            वैदिक, लो शू एवं चाल्डियन विस्तृत निःशुल्क अंकशास्त्रीय परामर्श रिपोर्ट
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            परामर्शार्थी: <strong>{rawName || 'जिज्ञासु'}</strong> • जन्मतिथि: <strong>{formattedDob}</strong>
            {hasValidDob ? ` • मूलांक #${mulank} / भाग्यांक #${bhagyank}` : ' • वैध जन्मतिथि आवश्यक'}
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
                  Vedic Astro-Numerology, Lo Shu Grid & Chaldean Consultation Authority
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-stone-500 font-mono space-y-0.5">
              <div>रिपोर्ट दिनांक: <span className="text-stone-800 font-bold">{reportDate}</span></div>
              <div>श्रेणी: <span className="text-[#D97706] font-bold">विस्तृत निःशुल्क परामर्श आख्या (Comprehensive Free Dossier)</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">परामर्शार्थी (Name)</span>
              <span className="font-bold text-stone-900 text-sm truncate block">{rawName || 'जिज्ञासु (नाम प्रविष्ट नहीं)'}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">जन्मतिथि (DOB)</span>
              <span className="font-bold text-stone-900 text-sm block">{formattedDob}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">मूलांक (Driver)</span>
              <span className="font-bold text-[#D97706] text-sm block">
                {hasValidDob ? `#${mulank} (${mulankGraha})` : '— (DOB आवश्यक)'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">भाग्यांक (Conductor)</span>
              <span className="font-bold text-blue-900 text-sm block">
                {hasValidDob ? `#${bhagyank} (${bhagyankGraha})` : '— (DOB आवश्यक)'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">कुआ अंक / व्यक्तिगत वर्ष</span>
              <span className="font-bold text-emerald-800 text-sm block">
                {hasValidDob && kuaProfile ? `Kua #${kuaProfile.kuaNumber} • PY #${personalYear}` : '— (DOB आवश्यक)'}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
            <div>
              <strong>पद्धति एवं पारदर्शिता नोट:</strong> यह विस्तृत रिपोर्ट आपके जन्म-विवरण (<strong>{formattedDob}</strong>) और LeoFamily के पंजीकृत वैदिक, लो शू तथा चाल्डियन नियमों के प्रत्यक्ष गणितीय विश्लेषण से तैयार की गई है। इसमें गणनात्मक तथ्य (<strong>[CALCULATED]</strong>), पारंपरिक ज्योतिषीय व्याख्या (<strong>[INTERPRETED]</strong>) और व्यवहारिक सुझाव (<strong>[RECOMMENDED]</strong>) स्पष्ट रूप से वर्गीकृत हैं।
            </div>
          </div>
        </div>

        {!hasValidDob ? (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  वैध जन्मतिथि आवश्यक है (Valid Date of Birth Required — DD/MM/YYYY)
                </h3>
                <p>
                  <strong>जन्मतिथि-आधारित गणनाएं स्थगित की गई हैं:</strong> प्रोफाइल में वैध जन्मतिथि (DD/MM/YYYY) उपलब्ध न होने के कारण मूलांक (Driver), भाग्यांक (Conductor), लो शू ग्रिड, कुआ अंक (Kua Number), व्यक्तिगत वर्ष (Personal Year) और वैदिक महादशा के परिणाम प्रदर्शित नहीं किए गए हैं।
                </p>
                <p>
                  <strong>कोई कृत्रिम डिफ़ॉल्ट तिथि प्रयुक्त नहीं:</strong> LeoFamily के सटीकता मानकों के अनुसार किसी भी अनुपलब्ध जन्मतिथि के स्थान पर आज की तारीख, 01 जनवरी या काल्पनिक जन्म-वर्ष (जैसे 30 वर्ष पूर्व) का प्रयोग नहीं किया जाता। कृपया पूर्ण जन्मतिथि (उदाहरण: <strong>05/08/1983</strong>) दर्ज करें।
                </p>
                {!hasProvidedMobile && (
                  <p className="pt-2 border-t border-stone-200 text-amber-900">
                    <strong>मोबाइल नंबर सत्यापन सूचना:</strong>{' '}
                    {hasPartialOrInvalidMobile
                      ? `दर्ज किया गया मोबाइल नंबर (${rawMobile} — ${rawMobile.length} अंक) अपूर्ण है। भारतीय मोबाइल अंकशास्त्र एवं 81-युग्म विश्लेषण (Adjacent Pair Audit) के लिए पूर्ण 10-अंकीय मोबाइल नंबर आवश्यक है।`
                      : 'प्रोफाइल में 10-अंकीय मोबाइल नंबर दर्ज नहीं किया गया है, इसलिए व्यक्तिगत मोबाइल युग्म ऑडिट प्रदर्शित नहीं किया गया है।'}
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
        {/* ========================================================================= */}
        {/* SECTION 1: DRIVER (MULANK) & CONDUCTOR (BHAGYANK) DETAILED ANALYSIS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                01
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  मूलांक (Driver) एवं भाग्यांक (Conductor) का गहन विश्लेषण
                </h3>
                <p className="text-[11px] text-stone-500">
                  जन्म तारीख और संपूर्ण जन्मतिथि से प्राप्त दोनों मुख्य जीवन-स्तंभों की गणना एवं विस्तृत चरित्र व्याख्या
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED + INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver (Mulank) Detailed Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border-2 border-amber-300 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold tracking-wider">
                    जन्म तारीख का एकल अंक • मानसिक एवं व्यक्तिगत स्वभाव (Driver / Psychic Number)
                  </span>
                  <h4 className="font-playfair text-xl font-bold text-stone-900 mt-0.5">
                    मूलांक #{mulank} — स्वामी ग्रह: {mulankGraha}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-600">
                    गणना सूत्र: जन्म दिवस ({parsedDob?.day || mulank}) → एकल अंक #{mulank} ({expertDossier.tithiAnkAnalysis.compoundTitle})
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-playfair font-black text-3xl shadow-sm flex-shrink-0">
                  {mulank}
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <p>
                  <strong className="text-stone-900">मूलांक का मूल सिद्धांत एवं अर्थ:</strong> {mDef.mulankMeaning} {expertDossier.tithiAnkAnalysis.tithiNatureHi}
                </p>
                <p>
                  <strong className="text-stone-900">व्यक्तित्व एवं आंतरिक मनोविज्ञान:</strong> {mDef.personality} {numberMeaning?.nature || ''}
                </p>
                <p>
                  <strong className="text-stone-900">संवाद एवं नेतृत्व शैली:</strong> {mDef.communication} {mDef.leadership}
                </p>
                <p>
                  <strong className="text-stone-900">कार्यक्षेत्र एवं संबंधों में भूमिका:</strong> {mDef.career} व्यक्तिगत संबंधों में: {mDef.relationships}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/80 text-[11px] text-stone-700">
                <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
                  <strong className="text-amber-900 block">तत्व एवं अधिष्ठाता देवता:</strong>
                  <span>{mDef.element} तत्व • {mPlanet.deity}</span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
                  <strong className="text-amber-900 block">मित्र एवं सम अंक:</strong>
                  <span>मित्र: {mPlanet.friendlyNumbers.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Conductor (Bhagyank) Detailed Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-white to-blue-500/5 border-2 border-blue-200 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-800 uppercase font-bold tracking-wider">
                    संपूर्ण जन्मतिथि का कुल योग • जीवन पथ एवं भाग्य दिशा (Conductor / Life Path Number)
                  </span>
                  <h4 className="font-playfair text-xl font-bold text-stone-900 mt-0.5">
                    भाग्यांक #{bhagyank} — स्वामी ग्रह: {bhagyankGraha}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-600">
                    गणना सूत्र: {formattedDob} के सभी अंकों का योग ({coreNumbers.compoundBhagyank}) → एकल अंक #{bhagyank}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-playfair font-black text-3xl shadow-sm flex-shrink-0">
                  {bhagyank}
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <p>
                  <strong className="text-stone-900">भाग्यांक का मूल सिद्धांत एवं अर्थ:</strong> जहां मूलांक आपकी आंतरिक सोच और प्राथमिक स्वभाव को दर्शाता है, वहीं भाग्यांक #{bhagyank} आपके संपूर्ण जीवन की दिशा, कर्मक्षेत्र के अवसरों और 32–35 वर्ष की आयु के बाद के स्थायित्व को संचालित करता है। {bDef.bhagyankMeaning}
                </p>
                <p>
                  <strong className="text-stone-900">दीर्घकालिक व्यक्तित्व एवं कर्म पथ:</strong> {bDef.personality} {bhagyankNumberMeaning?.nature || ''}
                </p>
                <p>
                  <strong className="text-stone-900">धन संचय एवं व्यावसायिक विस्तार:</strong> {bDef.wealth} व्यापारिक दृष्टिकोण से: {bDef.business}
                </p>
                <p>
                  <strong className="text-stone-900">पारिवारिक दायित्व एवं आत्मिक विकास:</strong> {bDef.family} आध्यात्मिक झुकाव: {bDef.spirituality}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/80 text-[11px] text-stone-700">
                <div className="bg-white/90 p-2.5 rounded-xl border border-blue-200/60">
                  <strong className="text-blue-900 block">तत्व एवं अधिष्ठाता देवता:</strong>
                  <span>{bDef.element} तत्व • {bPlanet.deity}</span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-xl border border-blue-200/60">
                  <strong className="text-blue-900 block">मित्र एवं सहयोगी अंक:</strong>
                  <span>मित्र: {bPlanet.friendlyNumbers.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: CORE TRAITS & COMBINED INFLUENCE (81-COMBINATION MATRIX) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                02
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  मूलांक #{mulank} एवं भाग्यांक #{bhagyank} का संयुक्त प्रभाव (Combined Driver–Conductor Synergy)
                </h3>
                <p className="text-[11px] text-stone-500">
                  81-युति मैट्रिक्स के अंतर्गत आपके दोनों मुख्य ग्रहों ({mulankGraha} एवं {bhagyankGraha}) का पारस्परिक संबंध
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-amber-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <span className="font-playfair font-bold text-base sm:text-lg text-[#92400E] flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D97706] fill-amber-400" />
                युति कोड #{comb81.code}: {comb81.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200 font-bold">
                  ग्रहीय युग्म: {comb81.planetaryPair} ({mulankGraha} + {bhagyankGraha})
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                  संबंध: {coreNumbers.synthesis?.relationship || expertDossier.grahDrishti.relationshipType}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong className="text-stone-900">संयुक्त ऊर्जा का विश्लेषण:</strong> {comb81.positiveMeaning} {coreNumbers.synthesis?.summary || ''}
              </p>
              <p>
                <strong className="text-stone-900">यह युति आपके जीवन में कैसे कार्य करती है:</strong> मूलांक #{mulank} ({mulankGraha}) आपके दैनिक निर्णय लेने के तरीके, सोच की गति और व्यक्तिगत प्राथमिकताओं को निर्धारित करता है, जबकि भाग्यांक #{bhagyank} ({bhagyankGraha}) आपके जीवन के बाहरी अवसरों और कर्मफल की दिशा तय करता है। जब ये दोनों अंक एक साथ सक्रिय होते हैं, तो {expertDossier.grahDrishti.synergyNarrativeHi}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
                <strong className="text-[#92400E] block font-playfair text-sm">करियर एवं पेशेवर प्रभाव:</strong>
                <p className="text-stone-700 leading-relaxed">{comb81.careerMeaning}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
                <strong className="text-emerald-800 block font-playfair text-sm">आर्थिक एवं संपत्ति प्रभाव:</strong>
                <p className="text-stone-700 leading-relaxed">{comb81.wealthMeaning}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
                <strong className="text-blue-900 block font-playfair text-sm">संबंध एवं पारिवारिक सामंजस्य:</strong>
                <p className="text-stone-700 leading-relaxed">{comb81.relationshipMeaning}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
                <strong className="text-purple-900 block font-playfair text-sm">आंतरिक चेतना एवं संतुलन सूत्र:</strong>
                <p className="text-stone-700 leading-relaxed">{comb81.spiritualMeaning} <strong>सुझाव:</strong> {comb81.remedy}</p>
              </div>
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
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  प्रमुख शक्तियां एवं जीवन की चुनौतियां (Core Strengths & Life Challenges)
                </h3>
                <p className="text-[11px] text-stone-500">
                  आपकी जन्मजात क्षमताएं और वे क्षेत्र जहाँ सचेत आत्म-नियंत्रण आवश्यक है
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold font-playfair text-base border-b border-emerald-200/80 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>आपकी जन्मजात शक्तियां (Key Personal Strengths)</span>
              </div>
              <ul className="space-y-2.5 text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold mt-0.5">1.</span>
                  <span>
                    <strong>मूलांक #{mulank} की प्राथमिक शक्ति:</strong> {mDef.personality} आपके प्रमुख सकारात्मक गुण ({mDef.positiveTraits.join(', ')}) आपको कठिन परिस्थितियों में भी आगे बढ़ने का आत्मविश्वास देते हैं।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold mt-0.5">2.</span>
                  <span>
                    <strong>भाग्यांक #{bhagyank} का दीर्घकालिक संबल:</strong> {bDef.leadership} {bDef.creativity}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold mt-0.5">3.</span>
                  <span>
                    <strong>बौद्धिक एवं निर्णय क्षमता:</strong> {personality.thinkingStyle} {personality.decisionMakingStyle}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold mt-0.5">4.</span>
                  <span>
                    <strong>कार्य निष्पादन एवं संवाद:</strong> {personality.workStyle} साथ ही, {personality.communicationStyle}
                  </span>
                </li>
              </ul>
            </div>

            {/* Challenges */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-[#92400E] font-bold font-playfair text-base border-b border-amber-200/80 pb-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <span>चुनौतियां एवं सावधानियां (Challenges & Cautions)</span>
              </div>
              <ul className="space-y-2.5 text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold mt-0.5">1.</span>
                  <span>
                    <strong>मूलांक-भाग्यांक घर्षण बिंदु:</strong> {comb81.negativeMeaning}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold mt-0.5">2.</span>
                  <span>
                    <strong>मूलांक #{mulank} की छाया प्रवृत्तियां ({mDef.shadowTraits.join(', ')}):</strong> दबाव या अवरोध के समय इन प्रवृत्तियों से बचना आवश्यक है। {mDef.traditionalRemedies.behavioural}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold mt-0.5">3.</span>
                  <span>
                    <strong>भाग्यांक #{bhagyank} की सावधानियां ({bDef.shadowTraits.join(', ')}):</strong> दीर्घकालिक लक्ष्यों में {bDef.traditionalRemedies.behavioural}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold mt-0.5">4.</span>
                  <span>
                    <strong>तनाव प्रतिक्रिया एवं भावनात्मक संतुलन:</strong> {personality.stressResponsePattern} {personality.motivationPattern}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: POSITIVE & NEGATIVE CHARACTERISTICS & BEHAVIOURAL PATTERNS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                04
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  व्यक्तिगत गुण, व्यवहारिक पैटर्न एवं जीवन-पथ थीम (Personal Qualities & Behavioural Patterns)
                </h3>
                <p className="text-[11px] text-stone-500">
                  सोचने की शैली, कार्यशैली, आर्थिक दृष्टिकोण और पारिवारिक व्यवहार का समग्र मनोवैज्ञानिक विश्लेषण
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <strong className="text-emerald-800 block font-bold font-playfair text-sm">
                सकारात्मक चारित्रिक गुण (Positive Characteristics)
              </strong>
              <p className="text-stone-700 leading-relaxed">
                आपका प्रधान आर्किटाइप <strong>{personality.title}</strong> है। {interpretations.personality?.detailedAnalysis || personality.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from(new Set([...mDef.positiveTraits, ...bDef.positiveTraits])).map((trait) => (
                  <span key={trait} className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-200">
                    ✓ {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
              <strong className="text-rose-800 block font-bold font-playfair text-sm">
                विकास एवं सुधार के क्षेत्र (Areas for Self-Refinement)
              </strong>
              <p className="text-stone-700 leading-relaxed">
                जब आपके चार्ट की ऊर्जा असंतुलित होती है, तो {comb81.negativeMeaning} विशेष रूप से कार्यक्षेत्र और निजी जीवन के बीच संतुलन बनाए रखना तथा {mDef.traditionalRemedies.behavioural} आपके व्यक्तित्व को और अधिक प्रभावशाली बनाएगा।
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from(new Set([...mDef.shadowTraits, ...bDef.shadowTraits])).map((trait) => (
                  <span key={trait} className="px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-900 font-mono text-[10px] font-bold border border-rose-200">
                    ! {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
              <strong className="text-stone-900 block font-playfair">शिक्षा एवं सीखने की शैली:</strong>
              <p className="text-stone-600 leading-relaxed">{mDef.learning} {personality.learningStyle}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
              <strong className="text-stone-900 block font-playfair">धन एवं आर्थिक व्यवहार:</strong>
              <p className="text-stone-600 leading-relaxed">{interpretations.wealth?.detailedAnalysis || mDef.wealth}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
              <strong className="text-stone-900 block font-playfair">पारिवारिक एवं सामाजिक संबंध:</strong>
              <p className="text-stone-600 leading-relaxed">{interpretations.relationships?.detailedAnalysis || mDef.relationships} {mDef.family}</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: LO SHU NATAL & ENHANCED GRID, REPETITIONS, MISSING NUMBERS & PLANES */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                05
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  लो शू जन्म चक्र, पुनरावृत्ति, लुप्त अंक एवं तल विश्लेषण (Lo Shu Grid, Repetitions, Missing Numbers & Planes)
                </h3>
                <p className="text-[11px] text-stone-500">
                  मूल जन्म ग्रिड (DOB Digits) एवं संवर्धित ग्रिड (+मूलांक/+भाग्यांक) की तुलना तथा प्रत्येक अंक का व्यक्तिगत प्रभाव
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED + INTERPRETED]
            </span>
          </div>

          {/* Dual Grids: Birth Grid vs Enhanced Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200">
            {/* 1. Original Birth Grid */}
            <div className="flex flex-col items-center space-y-2.5">
              <div className="text-center">
                <span className="text-[11px] font-bold text-stone-800 block">1. मूल जन्म लो शू ग्रिड (Original Birth Grid)</span>
                <span className="text-[10px] text-stone-500">केवल जन्मतिथि ({formattedDob}) के प्रत्यक्ष अंकों से निर्मित</span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-stone-900 p-3 rounded-2xl border-2 border-amber-400 shadow-inner">
                {[
                  [4, 9, 2],
                  [3, 5, 7],
                  [8, 1, 6]
                ].flat().map((digit) => {
                  const count = birthGrid[digit] || 0;
                  const isPresent = count > 0;
                  return (
                    <div
                      key={`birth-${digit}`}
                      className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isPresent
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-xs'
                          : 'bg-stone-800 text-stone-500 border border-stone-700/60'
                      }`}
                    >
                      <span className="leading-tight font-mono">{isPresent ? String(digit).repeat(count) : '—'}</span>
                      <span className="text-[9px] font-mono opacity-80 mt-0.5">अंक #{digit}</span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-stone-600">
                जन्म से उपस्थित अंक: <strong>{birthPresentDigits.join(', ') || '—'}</strong>
              </span>
            </div>

            {/* 2. Enhanced Grid (+Mulank/+Bhagyank) */}
            <div className="flex flex-col items-center space-y-2.5">
              <div className="text-center">
                <span className="text-[11px] font-bold text-stone-800 block">2. संवर्धित लो शू ग्रिड (Enhanced Grid: +मूलांक/+भाग्यांक)</span>
                <span className="text-[10px] text-stone-500">मूलांक (#{mulank}) एवं भाग्यांक (#{bhagyank}) के जुड़ने के बाद सक्रिय ग्रिड</span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-stone-900 p-3 rounded-2xl border-2 border-emerald-400 shadow-inner">
                {[
                  [4, 9, 2],
                  [3, 5, 7],
                  [8, 1, 6]
                ].flat().map((digit) => {
                  const bCount = birthGrid[digit] || 0;
                  const eCount = enhancedGridCounts[digit] || 0;
                  const isPresent = eCount > 0;
                  const addedByCore = eCount > bCount;
                  return (
                    <div
                      key={`enh-${digit}`}
                      className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isPresent
                          ? addedByCore
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-stone-950 shadow-xs'
                            : 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-xs'
                          : 'bg-stone-800 text-stone-500 border border-stone-700/60'
                      }`}
                    >
                      <span className="leading-tight font-mono">{isPresent ? String(digit).repeat(eCount) : '—'}</span>
                      <span className="text-[9px] font-mono opacity-85 mt-0.5">
                        {addedByCore ? `जन्म:${bCount} + योग:${eCount - bCount}` : `अंक #${digit}`}
                      </span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-emerald-800">
                कुल प्रभावी सक्रिय अंक: <strong>{presentDigits.join(', ') || '—'}</strong> • शेष लुप्त अंक: <strong>{missingDigits.join(', ') || 'कोई नहीं'}</strong>
              </span>
            </div>
          </div>

          {/* Per-Number Present & Repetition Analysis */}
          <div className="space-y-3">
            <h4 className="font-playfair font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>आपके चार्ट में उपस्थित एवं पुनरावृत्त अंकों का विस्तृत विश्लेषण (Present & Repeated Numbers Breakdown)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {presentDigits.map((digit) => {
                const count = enhancedGridCounts[digit] || 1;
                const levelKey = count === 1 ? 'SINGLE' : count === 2 ? 'DOUBLE' : count === 3 ? 'TRIPLE' : 'QUADRUPLE_PLUS';
                const nDef = NUMBER_DEFINITIONS[digit];
                const repDetail = nDef?.repetitionMeaning?.[levelKey];
                const repEngineItem = loshu.repetition.find(r => r.digit === digit);
                return (
                  <div key={digit} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5">
                      <span className="font-bold text-emerald-950 font-playfair text-sm">
                        अंक #{digit} ({getPlanetName(digit, language)})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                        आवृत्ति: {count} बार ({repDetail?.countDesc || repEngineItem?.level || levelKey})
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>प्रबल गुण:</strong> {repDetail?.strengthenedQualities || repEngineItem?.positiveExpression || nDef?.personality}
                    </p>
                    <p className="text-stone-700 leading-relaxed">
                      <strong>व्यावहारिक एवं करियर अभिव्यक्ति:</strong> {repDetail?.practicalExpression || repEngineItem?.meaning} {repDetail?.careerExpression || ''}
                    </p>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      <strong>सावधानी व संतुलन:</strong> {repDetail?.possibleExcess || repEngineItem?.possibleExcess} <em>सुझाव:</em> {repDetail?.balancingRecommendation || repEngineItem?.balanceRecommendation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Number Missing Numbers Analysis */}
          <div className="space-y-3">
            <h4 className="font-playfair font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>अनुपस्थित (Missing) अंकों का कार्मिक पाठ एवं समाधान (Missing Numbers & Remedies)</span>
            </h4>
            {loshu.missingNumbers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {loshu.missingNumbers.map((miss) => {
                  const nDef = NUMBER_DEFINITIONS[miss.digit];
                  const mDetail = nDef?.missingMeaning;
                  const compensatedByCore = presentDigits.includes(miss.digit) && !birthPresentDigits.includes(miss.digit);
                  return (
                    <div key={miss.digit} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                        <span className="font-bold text-amber-950 font-playfair text-sm">
                          लुप्त अंक #{miss.digit} ({getPlanetName(miss.digit, language)})
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          compensatedByCore ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {compensatedByCore ? 'मूलांक/भाग्यांक से आंशिक पूर्ति' : 'जन्म ग्रिड में अनुपस्थित'}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        <strong>पारंपरिक प्रभाव:</strong> {mDetail?.traditionalMeaning || miss.missingTheme}
                      </p>
                      <p className="text-stone-700 leading-relaxed">
                        <strong>व्यवहार एवं कार्यक्षेत्र प्रभाव:</strong> {mDetail?.behaviouralManifestation || miss.possibleLifeArea} {mDetail?.careerImpact || ''}
                      </p>
                      <p className="text-stone-700 text-[11px] leading-relaxed bg-white/80 p-2 rounded-lg border border-amber-200/50">
                        <strong>विकास सूत्र एवं पारंपरिक उपाय:</strong> {mDetail?.practicalDevelopment || miss.practicalDevelopment} <strong>उपाय:</strong> {mDetail?.traditionalRemedy || miss.traditionalRemedyCategory}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                आपके लो शू ग्रिड में सभी 9 अंक उपस्थित हैं, जो अत्यंत दुर्लभ और पूर्ण संतुलित ऊर्जा का संकेत है।
              </div>
            )}
          </div>

          {/* 8 Planes & Active Arrows Summary */}
          <div className="space-y-3 pt-2">
            <h4 className="font-playfair font-bold text-sm sm:text-base text-stone-900">
              लो शू के प्रमुख तल (Planes) एवं सक्रिय राजयोग / तीर (Active Arrows)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {loshu.planes.map((plane) => {
                const pDef = MASTER_PLANES.find(mp => mp.name === plane.name || mp.digits.join('-') === plane.digits.join('-'));
                return (
                  <div key={plane.name} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-[11px]">{pDef?.hindiName || plane.name}</span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        {plane.completionPercentage}% ({plane.status})
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-stone-500">
                      अंक: {plane.digits.join('-')} • उपस्थित: {plane.presentDigits.join(', ') || 'कोई नहीं'}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {plane.completionPercentage === 100
                        ? (pDef?.strengths.join('; ') || plane.interpretation || plane.meaning)
                        : plane.completionPercentage > 0
                        ? `आंशिक सक्रियता (${plane.completionPercentage}%): ${pDef?.domain || plane.interpretation || plane.meaning}`
                        : (pDef?.weaknesses.join('; ') || plane.interpretation || plane.meaning)}
                    </p>
                  </div>
                );
              })}
            </div>

            {loshu.arrows && loshu.arrows.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                {loshu.arrows.map((arrow) => {
                  const aDef = MASTER_ARROWS.find(ma => ma.name === arrow.name);
                  return (
                    <div
                      key={arrow.name}
                      className={`p-4 rounded-2xl border space-y-1 ${
                        arrow.type === 'STRENGTH'
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-amber-50/60 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 font-playfair">{aDef?.hindiName || arrow.name} ({arrow.digits.join('-')})</strong>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                          {arrow.isActive ? 'सक्रिय योग' : 'सुप्त योग'}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{aDef?.meaning || arrow.meaning}</p>
                      <p className="text-stone-600 text-[11px]">
                        <strong>प्रभाव एवं सुझाव:</strong> {aDef?.careerImpact || arrow.careerImpact} {aDef?.recommendation || arrow.remedy}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
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
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  नाम अंकशास्त्र एवं स्पेलिंग संतुलन विश्लेषण (Name Numerology & Spelling Assessment)
                </h3>
                <p className="text-[11px] text-stone-500">
                  चाल्डियन एवं पाइथागोरियन पद्धति से आपके नाम के अक्षरों, ध्वनि तरंगों और जन्मतिथि सामंजस्य की जांच
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              {hasProvidedName ? '[CALCULATED + INTERPRETED]' : '[INPUT REQUIRED FOR SPELLING AUDIT]'}
            </span>
          </div>

          {hasProvidedName && nameNumerology ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">चाल्डियन संयुक्त नामांक</span>
                  <span className="text-2xl font-bold font-playfair text-[#D97706] block">
                    {nameNumerology.chaldean.compoundNumber}
                  </span>
                  <span className="text-[11px] text-stone-600 block">{nameNumerology.chaldean.compoundTitle}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">चाल्डियन एकल नामांक (Root)</span>
                  <span className="text-2xl font-bold font-playfair text-blue-900 block">
                    #{nameNumerology.chaldean.rootNumber}
                  </span>
                  <span className="text-[11px] text-stone-600 block">स्वामी: {getPlanetName(nameNumerology.chaldean.rootNumber, language)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">पाइथागोरियन अभिव्यक्ति अंक</span>
                  <span className="text-2xl font-bold font-playfair text-emerald-800 block">
                    #{nameNumerology.pythagorean.expressionNumber}
                  </span>
                  <span className="text-[11px] text-stone-600 block">आंतरिक प्रेरणा: #{nameNumerology.pythagorean.soulUrgeNumber}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">जन्मतिथि के साथ सामंजस्य</span>
                  <span className="text-lg font-bold font-playfair text-stone-900 block">
                    {nameNumerology.dobCompatibility.ratingLabel}
                  </span>
                  <span className="text-[11px] text-stone-600 block">
                    स्थिति: {nameNumerology.dobCompatibility.status}
                  </span>
                </div>
              </div>

              {/* Letter Breakdown */}
              {nameNumerology.chaldean.nameBreakdown && nameNumerology.chaldean.nameBreakdown.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <strong className="text-stone-900 block">चाल्डियन अक्षर-दर-अक्षर मान (Chaldean Letter Vibration Map):</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {nameNumerology.chaldean.nameBreakdown.map((item, idx) => (
                      <div key={`${item.letter}-${idx}`} className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-center font-mono">
                        <span className="font-bold text-stone-900 block text-xs">{item.letter}</span>
                        <span className="text-[10px] text-[#D97706] font-bold">{item.chaldeanValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2.5 leading-relaxed text-stone-700">
                <p>
                  <strong className="text-stone-900">संयुक्त नामांक ({nameNumerology.chaldean.compoundNumber}) एवं एकल नामांक (#{nameNumerology.chaldean.rootNumber}) की व्याख्या:</strong>{' '}
                  {nameNumerology.chaldean.compoundInterpretationHi} {nameNumerology.chaldean.rootInterpretationHi}
                </p>
                <p>
                  <strong className="text-stone-900">प्रथम अक्षर ({nameNumerology.firstLetter.letter} — अंक #{nameNumerology.firstLetter.chaldeanValue}) का प्रभाव:</strong>{' '}
                  {nameNumerology.firstLetter.personalityInfluenceHi} {nameNumerology.firstLetter.careerInfluenceHi}
                </p>
                <p>
                  <strong className="text-stone-900">मूलांक #{mulank} एवं भाग्यांक #{bhagyank} के साथ संगति:</strong>{' '}
                  {nameNumerology.dobCompatibility.comprehensiveReasonWhyHi} ({nameNumerology.dobCompatibility.mulankHarmonicsHi} • {nameNumerology.dobCompatibility.bhagyankHarmonicsHi})
                </p>
                <p>
                  <strong className="text-stone-900">स्पेलिंग मूल्यांकन एवं परामर्श:</strong>{' '}
                  {nameNumerology.recommendations.spellingAssessmentHi}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
              <p>
                <strong>नाम प्रविष्ट नहीं किया गया है:</strong> इस गणना में पूरा नाम उपलब्ध न होने के कारण व्यक्तिगत अक्षर-मान की गणना नहीं की गई है। किसी भी काल्पनिक नाम का प्रयोग नहीं किया गया है।
              </p>
              <p>
                <strong>आपके मूलांक #{mulank} एवं भाग्यांक #{bhagyank} के लिए आदर्श नामांक सिद्धांत:</strong> जब आप अपना नाम जोड़ते हैं, तो चाल्डियन पद्धति के अनुसार आपके नाम का एकल योग आपके मित्र अंकों (<strong>{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).join(', ')}</strong>) के साथ सामंजस्यपूर्ण होना सबसे अनुकूल माना जाता है।
              </p>
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
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  मोबाइल अंकशास्त्र एवं अंकीय युग्म विश्लेषण (Mobile Numerology & Adjacent Pair Audit)
                </h3>
                <p className="text-[11px] text-stone-500">
                  मोबाइल नंबर के कुल योग, मूलांक/भाग्यांक अनुकूलता, पुनरावृत्त अंकों और क्रमागत जोड़ों (Adjacent Pairs) का परीक्षण
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              {hasProvidedMobile ? '[CALCULATED + INTERPRETED]' : '[INPUT REQUIRED FOR MOBILE AUDIT]'}
            </span>
          </div>

          {hasProvidedMobile && mobileAnalysis ? (
            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">विश्लेषित मोबाइल नंबर</span>
                    <div className="font-mono font-bold text-base sm:text-lg text-stone-900 tracking-wider">
                      {rawMobile}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-mono text-stone-400 block">कम्पाउंड / रूट अंक</span>
                      <span className="text-sm font-bold text-[#D97706] font-mono">
                        {mobileAnalysis.compoundNumber} → #{mobileAnalysis.rootNumber} ({getPlanetName(mobileAnalysis.rootNumber, language)})
                      </span>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-mono text-stone-400 block">DOB अनुकूलता स्तर</span>
                      <span className="text-sm font-bold text-emerald-800 font-mono">
                        {mobileAnalysis.dobCompatibility.status} (Score: {mobileAnalysis.overallScore}/100)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-stone-700 leading-relaxed">
                  <p>
                    <strong className="text-stone-900">कम्पाउंड #{mobileAnalysis.compoundNumber} ({mobileAnalysis.compoundClassification?.title || 'प्रभाव'}) एवं रूट #{mobileAnalysis.rootNumber} का अर्थ:</strong>{' '}
                    {mobileAnalysis.compoundClassification?.meaning || mobileAnalysis.recommendation}
                  </p>
                  <p>
                    <strong className="text-stone-900">मूलांक #{mulank} के साथ संबंध ({mobileAnalysis.mulankCompatibility.status}):</strong>{' '}
                    {mobileAnalysis.mulankCompatibility.description}
                  </p>
                  <p>
                    <strong className="text-stone-900">भाग्यांक #{bhagyank} के साथ संबंध ({mobileAnalysis.bhagyankCompatibility.status}):</strong>{' '}
                    {mobileAnalysis.bhagyankCompatibility.description}
                  </p>
                </div>

                {/* Missing Number Compensation */}
                {mobileAnalysis.missingNumberCompensation && mobileAnalysis.missingNumberCompensation.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-700 leading-relaxed">
                    <strong className="text-stone-900 block mb-0.5">लो शू लुप्त अंक पूर्ति (Missing Number Compensation):</strong>
                    {mobileAnalysis.missingNumberCompensation.filter(m => m.presentInMobile).length > 0
                      ? `यह मोबाइल नंबर आपके जन्म चार्ट में अनुपस्थित अंकों (${mobileAnalysis.missingNumberCompensation.filter(m => m.presentInMobile).map(m => m.missingInDob).join(', ')}) की ऊर्जात्मक पूर्ति करने में सहायक है। `
                      : 'यह मोबाइल नंबर आपके जन्म चार्ट में पहले से उपस्थित अंकों को ही दोहराता है। '}
                    {mobileAnalysis.missingNumberCompensation.filter(m => !m.presentInMobile).length > 0 &&
                      `शेष अनुपस्थित अंक: ${mobileAnalysis.missingNumberCompensation.filter(m => !m.presentInMobile).map(m => m.missingInDob).join(', ')}।`}
                  </div>
                )}
              </div>

              {/* Adjacent Pairs Breakdown */}
              {mobileAnalysis.pairsAnalysis && mobileAnalysis.pairsAnalysis.length > 0 && (
                <div className="space-y-2.5">
                  <strong className="text-stone-900 block font-playfair text-sm">
                    मोबाइल नंबर के क्रमागत युग्मों (Adjacent Number Pairs) का विस्तृत फल:
                  </strong>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mobileAnalysis.pairsAnalysis.map((pairItem, idx) => (
                      <div
                        key={`${pairItem.pair}-${idx}`}
                        className={`p-3.5 rounded-2xl border space-y-1 ${
                          !pairItem.isNegativeToAvoid
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-stone-900">
                            युग्म #{pairItem.pair} — क्षेत्र: {pairItem.area}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                            {pairItem.isNegativeToAvoid ? 'सावधानी अपेक्षित' : 'सकारात्मक / संतुलित'}
                          </span>
                        </div>
                        <p className="text-stone-700 leading-relaxed">{pairItem.meaning}</p>
                        <p className="text-stone-600 text-[11px]">
                          <strong>करियर व धन:</strong> {pairItem.career} • {pairItem.wealth}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
              {hasPartialOrInvalidMobile ? (
                <p className="text-amber-900">
                  <strong>अपूर्ण या अमान्य मोबाइल नंबर ({rawMobile} — {rawMobile.length} अंक):</strong> भारतीय मोबाइल अंकशास्त्र एवं 81-युग्म विश्लेषण (Adjacent Pair Audit) के लिए पूर्ण <strong>10-अंकीय मोबाइल नंबर</strong> आवश्यक है। आंशिक नंबर (7–9 अंक) के आधार पर कोई कृत्रिम या अधूरा युग्म विश्लेषण प्रदर्शित नहीं किया गया है।
                </p>
              ) : (
                <p>
                  <strong>मोबाइल नंबर प्रविष्ट नहीं किया गया है (Mobile Number Not Provided):</strong> प्रोफाइल में 10-अंकीय मोबाइल नंबर उपलब्ध न होने के कारण व्यक्तिगत युग्म विश्लेषण (Adjacent Pair Audit) प्रदर्शित नहीं किया गया है।
                </p>
              )}
              <p>
                <strong>आपके मूलांक #{mulank} एवं भाग्यांक #{bhagyank} के लिए शुभ मोबाइल कुल-योग मार्गदर्शन:</strong> आपके लिए ऐसे 10-अंकीय मोबाइल नंबर सर्वोत्तम रहते हैं जिनका एकल योग (Root Total) <strong>{Array.from(new Set([...mPlanet.friendlyNumbers, ...bPlanet.friendlyNumbers])).slice(0, 4).join(', ')}</strong> पर आता हो और जिनमें आपके लुप्त अंकों ({missingDigits.slice(0, 3).join(', ') || 'संतुलित अंकों'}) का सकारात्मक समावेश हो।
              </p>
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
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  शुभ अंक, रंग, दिन, तिथियां एवं अनुकूल व्यवसाय (Lucky Alignments & Career Fields)
                </h3>
                <p className="text-[11px] text-stone-500">
                  पंजीकृत ग्रहीय मित्रता नियमों के आधार पर आपके लिए अनुकूल तत्व और करियर क्षेत्र
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              [CALCULATED + INTERPRETED]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">शुभ एवं मित्र अंक (Lucky Numbers)</span>
              <span className="font-bold text-emerald-800 text-sm block font-mono">
                {Array.from(new Set([mulank, bhagyank, ...mPlanet.friendlyNumbers])).join(', ')}
              </span>
              <span className="text-[11px] text-stone-600 block">
                परहेज योग्य/शत्रु अंक: {mPlanet.enemyNumbers.join(', ') || 'कोई विशेष शत्रु नहीं'}
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">शुभ रंग (Lucky Colours)</span>
              <span className="font-bold text-stone-900 block">
                {mDef.traditionalRemedies.color}; {bDef.traditionalRemedies.color}
              </span>
              <span className="text-[11px] text-stone-600 block">
                बचने योग्य रंग: {expertDossier.balancingRemedies.avoidColorsHi.join(', ')}
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">अनुकूल वार (Lucky Days)</span>
              <span className="font-bold text-stone-900 block">{luckyDaysList}</span>
              <span className="text-[11px] text-stone-600 block">
                महत्वपूर्ण अनुबंध, यात्रा व शुभ कार्य प्रारंभ करने हेतु उत्तम दिन।
              </span>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-mono text-stone-500 uppercase font-bold block">मासिक शुभ तिथियां (Lucky Dates)</span>
              <span className="font-bold text-[#D97706] text-sm block font-mono">
                {luckyDatesList.length ? luckyDatesList.join(', ') : `${mulank}, ${bhagyank}, ${mulank + 9}, ${bhagyank + 9}`}
              </span>
              <span className="text-[11px] text-stone-600 block">
                मूलांक #{mulank} एवं भाग्यांक #{bhagyank} की आवृत्ति वाली मासिक तारीखें।
              </span>
            </div>
          </div>

          {/* Complete Un-truncated Career & Profession Guidance */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 text-xs">
            <h4 className="font-playfair font-bold text-sm text-stone-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#D97706]" />
              <span>अनुकूल करियर, व्यापार एवं कार्यक्षेत्र (Suitable Professions & Business Domains)</span>
            </h4>
            <p className="text-stone-700 leading-relaxed">
              <strong>मूलांक #{mulank} ({mulankGraha}) के अनुसार कार्यक्षेत्र:</strong> {mDef.career} <strong>व्यापारिक झुकाव:</strong> {mDef.business}
            </p>
            <p className="text-stone-700 leading-relaxed">
              <strong>भाग्यांक #{bhagyank} ({bhagyankGraha}) के अनुसार दीर्घकालिक क्षेत्र:</strong> {bDef.career} <strong>संयुक्त युति ({mulank}-{bhagyank}) प्रभाव:</strong> {comb81.careerMeaning}
            </p>

            {matchedProfessions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {matchedProfessions.map((prof) => (
                  <div key={prof.id} className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5">
                    <strong className="text-amber-900 block font-playfair">{prof.hindiTitle} ({prof.profession})</strong>
                    <div className="text-stone-800 font-medium text-[11px]">
                      <strong>अनुशंसित सहायक अंक:</strong> {prof.requiredNumbers.join(', ')} • <strong>युग्म:</strong> {prof.requiredPairs.join(', ')}
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{prof.description}</p>
                    <p className="text-emerald-800 text-[10px]"><strong>शास्त्रीय आधार:</strong> {prof.traditionalInterpretation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: PERSONAL DEVELOPMENT, YOGA/MEDITATION & TRADITIONAL REMEDIES */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                09
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  व्यक्तिगत विकास, योग-ध्यान एवं पारंपरिक वैदिक उपाय (Personal Development & Traditional Remedies)
                </h3>
                <p className="text-[11px] text-stone-500">
                  व्यवहारिक सुधार, दैनिक जीवनशैली, प्राणायाम और पारंपरिक उपायों का संतुलित मार्गदर्शन
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [RECOMMENDED]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Behavioural & Lifestyle Development */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2.5 leading-relaxed">
              <strong className="text-emerald-950 font-playfair text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>1. व्यवहारिक एवं जीवनशैली संतुलन (Behavioural & Lifestyle Practices)</span>
              </strong>
              <p className="text-stone-700">
                <strong>मूलांक #{mulank} व्यवहारिक सूत्र:</strong> {mDef.traditionalRemedies.behavioural} {mDef.traditionalRemedies.lifestyle}
              </p>
              <p className="text-stone-700">
                <strong>भाग्यांक #{bhagyank} व्यवहारिक सूत्र:</strong> {bDef.traditionalRemedies.behavioural} {bDef.traditionalRemedies.lifestyle}
              </p>
              <p className="text-stone-700">
                <strong>योग, प्राणायाम एवं ध्यान:</strong>{' '}
                {medical?.ayurvedicLifestyle?.yogaSuggestions?.concat(medical?.ayurvedicLifestyle?.pranayamaSuggestions || []).join('; ') ||
                  'प्रतिदिन प्रातः 15 मिनट अनुलोम-विलोम, भ्रामरी प्राणायाम और शांत ध्यान का अभ्यास करें।'}
              </p>
            </div>

            {/* Traditional Vedic & Vibrational Remedies */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2.5 leading-relaxed">
              <strong className="text-[#92400E] font-playfair text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D97706]" />
                <span>2. पारंपरिक वैदिक एवं ऊर्जा उपाय (Traditional Vedic Remedies)</span>
              </strong>
              <p className="text-stone-700">
                <strong>मंत्र उपासना:</strong> मूलांक मंत्र: <em>{mDef.traditionalRemedies.mantra}</em> • भाग्यांक मंत्र: <em>{bDef.traditionalRemedies.mantra}</em> (प्रातः शांत मन से 11 या 108 बार)।
              </p>
              <p className="text-stone-700">
                <strong>सेवा एवं दान (Charity):</strong> {mDef.traditionalRemedies.charitable} साथ ही {bDef.traditionalRemedies.charitable}
              </p>
              <p className="text-stone-700">
                <strong>रुद्राक्ष एवं यंत्र मार्गदर्शन:</strong> {expertDossier.balancingRemedies.crystalRecommendationHi} • {expertDossier.balancingRemedies.primaryYantraHi}
              </p>
              <p className="text-stone-700">
                <strong>हस्ताक्षर संतुलन:</strong> {expertDossier.balancingRemedies.signatureRecommendationHi}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: NUMERO VASTU & KUA DIRECTIONAL ALIGNMENT */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                10
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  न्यूमेरो वास्तु एवं कुआ दिशा संरेखण (Numero Vastu & Kua Directional Alignment)
                </h3>
                <p className="text-[11px] text-stone-500">
                  जन्म वर्ष और लिंग से प्राप्त कुआ (Kua) अंक, 4 शुभ दिशाएं, 4 वर्जित दिशाएं और लो शू वास्तु ज़ोन
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED + RECOMMENDED]
            </span>
          </div>

          {kuaProfile && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">पवित्र फेंगशुई / लो शू कुआ अंक</span>
                  <span className="text-4xl font-bold font-playfair text-emerald-700 block">
                    #{kuaProfile.kuaNumber}
                  </span>
                  <span className="font-bold text-stone-800 block">{kuaProfile.group} Group • {kuaProfile.element}</span>
                  <span className="text-[11px] text-stone-600 leading-relaxed">
                    जन्म वर्ष ({parsedDob?.year || '—'}) और लिंग ({gender}) के आधार पर गणनाकृत।
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2 md:col-span-2">
                  <strong className="text-emerald-950 font-playfair text-sm block">
                    आपकी 4 सर्वोच्च शुभ दिशाएं (4 Favorable Kua Directions):
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {kuaProfile.favorableDirections.map((dir) => (
                      <div key={dir.name} className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">{dir.direction}</span>
                          <span className="text-[10px] font-mono text-[#D97706] font-bold">{dir.name} ({dir.category})</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{dir.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <strong className="text-stone-900 font-playfair text-sm block">
                    लो शू वास्तु ज़ोन एवं कक्ष मार्गदर्शन (Lo Shu Vastu Room Guidance):
                  </strong>
                  <p className="text-stone-700 leading-relaxed">
                    <strong>अनुकूल दिशा क्षेत्र:</strong> {vastu.compatibleDirections.map(d => d.direction).join(' • ')}
                  </p>
                  <ul className="space-y-1 text-stone-600">
                    <li>• <strong>करियर ज़ोन ({vastu.zonesSummary.careerZone.direction}):</strong> {vastu.zonesSummary.careerZone.hindiGuidance}</li>
                    <li>• <strong>धन ज़ोन ({vastu.zonesSummary.wealthZone.direction}):</strong> {vastu.zonesSummary.wealthZone.hindiGuidance}</li>
                    <li>• <strong>स्वास्थ्य ज़ोन ({vastu.zonesSummary.healthZone.direction}):</strong> {vastu.zonesSummary.healthZone.hindiGuidance}</li>
                    <li>• <strong>संबंध ज़ोन ({vastu.zonesSummary.relationshipZone.direction}):</strong> {vastu.zonesSummary.relationshipZone.hindiGuidance}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <strong className="text-amber-950 font-playfair text-sm block">
                    वास्तु दोष संतुलन एवं अनुपस्थित अंक उपचार (Vastu Balancing):
                  </strong>
                  <p className="text-stone-700 leading-relaxed">
                    <strong>बचने योग्य दिशाएं (Unfavorable Kua Directions):</strong>{' '}
                    {kuaProfile.unfavorableDirections.map(d => `${d.direction} (${d.name})`).join(', ')}
                  </p>
                  <ul className="space-y-1 text-stone-700">
                    {(vastu.homeEnergyAssessment?.traditionalBalancingSuggestions || []).slice(0, 4).map((rp, i) => (
                      <li key={i}>• {rp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: PERSONAL-YEAR & VEDIC TIMING ANALYSIS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-[#D97706] font-bold text-xs flex items-center justify-center font-mono">
                11
              </span>
              <div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
                  व्यक्तिगत वर्ष #{personalYear} एवं वैदिक महादशा कालचक्र विश्लेषण (Personal Year & Vedic Dasha Timing)
                </h3>
                <p className="text-[11px] text-stone-500">
                  वर्ष {currentYear} के 9-वर्षीय चक्र और वर्तमान वैदिक महादशा/अंतर्दशा के संयुक्त प्रभाव का मार्गदर्शन
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              [CALCULATED + INTERPRETED]
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#FAF5EE] to-amber-500/5 border border-amber-300 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
              <div>
                <span className="font-playfair font-bold text-stone-900 text-base block">
                  वर्ष {currentYear} की सक्रिय ऊर्जा: <strong className="text-[#D97706]">Personal Year #{personalYear} ({getPlanetName(personalYear, language)})</strong>
                </span>
                <span className="text-[11px] text-stone-600">
                  गणना सूत्र: जन्म दिवस ({parsedDob?.day || mulank}) + जन्म माह ({parsedDob?.month || 1}) + वर्तमान वर्ष ({currentYear}) → एकल अंक #{personalYear}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-900 bg-amber-200/70 px-3 py-1 rounded-lg font-bold">
                {pyNarrative.theme}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-stone-700 leading-relaxed">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <strong className="text-stone-900 block mb-0.5">करियर एवं व्यवसाय:</strong>
                {pyNarrative.career}
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <strong className="text-stone-900 block mb-0.5">धन एवं निवेश:</strong>
                {pyNarrative.finance}
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <strong className="text-stone-900 block mb-0.5">संबंध एवं पारिवारिक जीवन:</strong>
                {pyNarrative.relationships} {pyNarrative.family}
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <strong className="text-stone-900 block mb-0.5">प्रमुख अवसर एवं सावधानी:</strong>
                <strong>अवसर:</strong> {pyNarrative.opportunities} • <strong>सावधानी:</strong> {pyNarrative.caution}
              </div>
            </div>

            <div className="p-3.5 bg-amber-100/60 rounded-xl border border-amber-300 text-amber-950">
              <strong>वर्ष {currentYear} का मुख्य संकल्प (Recommended Focus):</strong> {pyNarrative.recommendedFocus}
            </div>
          </div>

          {/* Vedic Mahadasha & Antardasha Overview */}
          {vedicDasha && (
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                <strong className="text-stone-900 font-playfair text-sm">
                  वर्तमान वैदिक अंक-महादशा एवं अंतर्दशा (Active Vedic Dasha Period):
                </strong>
                <span className="text-[11px] font-mono text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-bold">
                  जन्म वार स्वामी: {vedicDasha.dayLord.birthDayOfWeekHi} ({vedicDasha.dayLord.dayLordPlanetHi})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#92400E]">वर्तमान महादशा: {vedicDasha.currentMahadasha.planetHi} (#{vedicDasha.currentMahadasha.lordNumber})</strong>
                    <span className="font-mono text-[10px] text-stone-500">
                      {vedicDasha.currentMahadasha.startYear} – {vedicDasha.currentMahadasha.endYear} (आयु {vedicDasha.currentMahadasha.ageStart}–{vedicDasha.currentMahadasha.ageEnd})
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">{vedicDasha.currentMahadasha.themeHi}</p>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-blue-900">वर्तमान अंतर्दशा: {vedicDasha.currentAntardasha.planetHi} (#{vedicDasha.currentAntardasha.lordNumber})</strong>
                    <span className="font-mono text-[10px] text-stone-500">
                      {vedicDasha.currentAntardasha.startDate} – {vedicDasha.currentAntardasha.endDate}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">{vedicDasha.currentAntardasha.traditionalInterpretationHi}</p>
                </div>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                <strong>दशा एवं मूलांक/भाग्यांक सामंजस्य ({vedicDasha.dashaCompatibility.statusHi}):</strong> {vedicDasha.dashaCompatibility.explanationHi}
              </p>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* EXECUTIVE UPGRADE CARD (PREMIUM MASTER REPORT CALLOUT — SCREEN ONLY) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-amber-500/30 no-print">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-700/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/30 mb-2">
                <Award className="w-3.5 h-3.5" /> Full 32-Chapter Master Dossier
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                Complete Premium Master Report Unlock करें
              </h3>
              <p className="text-stone-300 text-xs mt-1 max-w-xl leading-relaxed">
                संपूर्ण ३२-अध्यायों की प्रीमियम मास्टर रिपोर्ट में आपको जीवन के ४ शिखर काल (Pinnacles), ४ जीवन चुनौतियां, १२-मासिक दशा-योग कैलेंडर, संपूर्ण ४५-वर्षीय वैदिक महादशा समयरेखा, आयुर्वेदिक त्रिदोष संविधान, हस्ताक्षर ब्लूप्रिंट और ९०-दिवसीय कार्ययोजना प्राप्त होती है।
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
              <span>वैदिक महादशा एवं 12-मासिक दशा-योग कैलेंडर</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>90-दिवसीय व्यक्तिगत कार्ययोजना</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>जीवन के 4 शिखर (Pinnacles) व परिवर्तन वर्ष</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>नाम स्पेलिंग शुद्धि एवं प्रो मॉड्यूल ऑडिट</span>
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
          </>
        )}

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

