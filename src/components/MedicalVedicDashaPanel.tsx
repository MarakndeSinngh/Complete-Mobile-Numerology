import React, { useState } from 'react';
import { CompleteNumerologyProfile } from '../core/types';
import { useLanguage } from '../i18n';
import { getPlanetName, getLocalizedNumberMeaning } from '../i18n/dynamicContent';
import {
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Apple,
  CheckCircle,
  AlertCircle,
  Repeat,
  Sun,
  Flame,
  Droplets,
  Wind,
  Layers,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface MedicalVedicDashaPanelProps {
  profile: CompleteNumerologyProfile;
}

export const MedicalVedicDashaPanel: React.FC<MedicalVedicDashaPanelProps> = ({ profile }) => {
  const { language } = useLanguage();
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const { medical, coreNumbers, identity } = profile;
  const dashaData = medical.vedicDashaAnalysis;

  if (!dashaData) {
    return null;
  }

  const {
    dayLord,
    ayurvedicConstitution,
    vedicMatrix,
    vedicGridCounts,
    repeatedNumbers,
    mahadashaTimeline,
    currentMahadasha,
    upcomingMahadasha,
    currentAntardasha,
    dashaCompatibility,
    planetaryBodyParts,
    remediesDietPlan,
    vedicRemedies,
    mandatoryDisclaimer
  } = dashaData;

  const getDoshaIcon = (dosha: string) => {
    if (dosha.includes('Pitta') || dosha.includes('पित्त')) {
      return <Flame className="w-5 h-5 text-amber-500" />;
    }
    if (dosha.includes('Kapha') || dosha.includes('कफ')) {
      return <Droplets className="w-5 h-5 text-cyan-500" />;
    }
    return <Wind className="w-5 h-5 text-indigo-500" />;
  };

  const getCompatibilityBadge = (status: string) => {
    if (status === 'SUPPORTIVE') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold font-mono">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {dashaCompatibility.statusHi}
        </span>
      );
    }
    if (status === 'CHALLENGING') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-xs font-bold font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> {dashaCompatibility.statusHi}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold font-mono">
        <Info className="w-3.5 h-3.5 text-amber-600" /> {dashaCompatibility.statusHi}
      </span>
    );
  };

  return (
    <div id="medical-vedic-dasha-section" className="space-y-10 animate-in fade-in duration-500 text-left">
      
      {/* 1. MANDATORY SAFETY DISCLAIMER BANNER (TOP) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 text-amber-950">
        <div className="p-2.5 bg-amber-200/80 rounded-xl text-amber-900 shrink-0 mt-0.5">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
              Traditional Wellness Interpretation
            </span>
          </div>
          <p className="text-sm font-semibold leading-relaxed">
            {mandatoryDisclaimer}
          </p>
          <p className="text-xs text-amber-800/80 font-sans">
            Source: LeoFamily Medical Numerology & Vedic Mahadasha Course Modules (Raajeev Singh Chauhann).
          </p>
        </div>
      </div>

      {/* 2. TOP HERO HEADER */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] text-white p-8 md:p-10 rounded-[35px] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" /> Medical Numerology & Vedic Mahadasha Engine v4.0
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
              ● Course Verified (Day 1 & Day 2 PDFs)
            </span>
          </div>

          <h3 className="font-playfair text-2.5xl md:text-4xl font-black tracking-wide text-[#FDFCF7]">
            Vedic Mahadasha, Ayurvedic Tridosha & Wellness Profiling
          </h3>

          <p className="text-slate-300 text-xs md:text-sm font-serif italic max-w-3xl leading-relaxed">
            Complete master synthesis combining Day Lord (वार स्वामी), Single/Bi/Tri-Doshic constitution, lifelong 45-year recurring Vedic Mahadasha sequence starting from Mulank, 3x3 Vedic Kundali matrix, Antardasha compatibility, and traditional dietary & karmic remedies for {identity.fullName}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Day Lord (वार स्वामी)</span>
              <p className="text-base font-bold text-amber-400 font-mono">
                #{dayLord.dayLordNumber} • {dayLord.dayLordPlanetHi}
              </p>
              <span className="text-[11px] text-slate-400 font-sans block">{dayLord.birthDayOfWeekHi}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Ayurvedic Dosha</span>
              <p className="text-base font-bold text-cyan-400 font-mono">
                {ayurvedicConstitution.compoundDosha} ({ayurvedicConstitution.constitutionType})
              </p>
              <span className="text-[11px] text-slate-400 font-sans block">मूलांक #{coreNumbers.mulank} आधारित</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Active Mahadasha</span>
              <p className="text-base font-bold text-emerald-400 font-mono">
                #{currentMahadasha.lordNumber} • {currentMahadasha.planetHi}
              </p>
              <span className="text-[11px] text-slate-400 font-sans block">{currentMahadasha.startDate} - {currentMahadasha.endDate}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Active Antardasha</span>
              <p className="text-base font-bold text-sky-400 font-mono">
                #{currentAntardasha.lordNumber} • {currentAntardasha.planetHi}
              </p>
              <span className="text-[11px] text-slate-400 font-sans block">{currentAntardasha.startDate} - {currentAntardasha.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DAY LORD & DAY DASHA CALCULATION CARD */}
      <section id="sec-day-lord" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
              <Sun className="w-4 h-4" /> 1. Day Lord Mapping & Day Dasha Formula
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              वार स्वामी (Day Lord) एवं दैनिक दशा विश्लेषण
            </h4>
          </div>
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs font-mono text-amber-900">
            Source: Course Day 2 PDF, Page 1
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">जन्म वार (Day of Birth)</span>
            <p className="text-lg font-bold text-slate-900">
              {dayLord.birthDayOfWeekHi} ({dayLord.birthDayOfWeek})
            </p>
            <p className="text-xs text-slate-600">
              वार स्वामी अंक: <strong className="text-amber-700 font-mono">#{dayLord.dayLordNumber}</strong> ({dayLord.dayLordPlanetHi})
            </p>
          </div>

          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase text-amber-800 font-bold block">दैनिक दशा सूत्र (Day Dasha Formula)</span>
            <p className="text-xs font-mono text-amber-950 font-bold leading-relaxed bg-white/80 p-2.5 rounded-lg border border-amber-200/70">
              Day + Month + Year (w/o Century) + Day Lord
            </p>
            <p className="text-xs text-amber-900 font-sans">
              गणना: <span className="font-mono font-bold">{dayLord.dayDashaFormula}</span>
            </p>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase text-emerald-800 font-bold block">दशा आरंभ नियम (Start-Date Rule)</span>
            <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
              {dayLord.dashaStartRuleLabel}
            </p>
            <p className="text-xs text-emerald-800 font-mono">
              सक्रिय वर्ष संदर्भ: {dayLord.dashaStartReferenceDate}
            </p>
          </div>
        </div>
      </section>

      {/* 4. AYURVEDIC TRIDOSHA & CONSTITUTION CARD */}
      <section id="sec-ayurvedic-dosha" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-700">
              {getDoshaIcon(ayurvedicConstitution.compoundDosha)} 2. Ayurvedic Dosha Constitution
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              आयुर्वेदिक त्रिदोष एवं धातु संरचना: {ayurvedicConstitution.constitutionTypeHi}
            </h4>
          </div>
          <div className="bg-cyan-50 px-4 py-2 rounded-xl border border-cyan-200 text-xs font-mono text-cyan-900">
            Source: Course Day 1 PDF, Pages 1-8
          </div>
        </div>

        <div className="p-5 bg-cyan-50/40 border border-cyan-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-xl">
              {getDoshaIcon(ayurvedicConstitution.compoundDosha)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {ayurvedicConstitution.explanationHi}
              </p>
              <p className="text-xs text-slate-600">
                प्राथमिक दोष: <strong>{ayurvedicConstitution.compoundDosha}</strong> • प्रकृति प्रकार: <strong>{ayurvedicConstitution.constitutionType}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>संतुष्ट / संतुलित अवस्था के गुण (Balanced State Qualities)</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 leading-relaxed list-disc list-inside">
              {ayurvedicConstitution.balancedQualitiesHi.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>असंतुलित अवस्था के संभावित लक्षण (Imbalanced State Symptoms)</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-950 leading-relaxed list-disc list-inside">
              {ayurvedicConstitution.imbalancedSymptomsHi.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. VEDIC 3x3 GRID & REPEATED NUMBERS */}
      <section id="sec-vedic-grid" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-indigo-700">
              <Layers className="w-4 h-4" /> 3. Vedic Kundali 3x3 Grid & Repeated Numbers
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              वैदिक ग्रिड एवं दोहराई गई संख्याओं का प्रभाव
            </h4>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200 text-xs font-mono text-indigo-900">
            Matrix: [3,1,9] / [6,7,5] / [2,8,4]
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3x3 Vedic Matrix Display */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-900/60 text-white space-y-4 shadow-md">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold block">
                Vedic Kundali Grid (3x3 Matrix)
              </span>
              <p className="text-xs text-slate-300 font-serif italic">
                Separated strictly from standard Lo Shu positions
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
              {vedicMatrix.map((row, rIdx) =>
                row.map((num) => {
                  const count = vedicGridCounts[num] || 0;
                  const isPresent = count > 0;
                  const isDasha = num === currentMahadasha.lordNumber;

                  return (
                    <div
                      key={num}
                      className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                        isDasha
                          ? 'bg-amber-500/25 border-amber-400 shadow-lg shadow-amber-500/20'
                          : isPresent
                          ? 'bg-indigo-500/20 border-indigo-400/50'
                          : 'bg-white/5 border-white/5 opacity-40'
                      }`}
                    >
                      {isDasha && (
                        <span className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase">
                          Dasha
                        </span>
                      )}
                      <span className="text-lg font-mono font-bold text-white">
                        {isPresent ? Array(count).fill(num).join('') : num}
                      </span>
                      <span className="text-[10px] font-sans text-slate-300 block">
                        अंक {num} ({count > 0 ? `${count} बार` : 'अनुपस्थित'})
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between text-[11px] font-mono text-indigo-300 pt-2 border-t border-white/10">
              <span>R1: Dharma [3,1,9]</span>
              <span>R2: Karma [6,7,5]</span>
              <span>R3: Moksha [2,8,4]</span>
            </div>
          </div>

          {/* Repeated Numbers Analysis */}
          <div className="lg:col-span-7 space-y-4">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-600" />
              वैदिक ग्रिड में दोहराई गई संख्याएं (Repeated Numbers Analysis):
            </h5>

            {repeatedNumbers.length > 0 ? (
              <div className="space-y-3">
                {repeatedNumbers.map((rep) => (
                  <div
                    key={rep.number}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 rounded-lg text-xs font-bold font-mono">
                          अंक #{rep.number}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {rep.planetHi} — {rep.frequency} बार उपस्थित
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Course Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {rep.traditionalSignificanceHi}
                    </p>
                    <p className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-sans">
                      <strong>दशा संदर्भ:</strong> {rep.relevantDashaContextHi}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 italic">
                वैदिक ग्रिड में कोई भी अंक एकाधिक बार नहीं दोहराया गया है। सभी उपस्थित अंक संतुलित ऊर्जा प्रदान कर रहे हैं।
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. VEDIC MAHADASHA TIMELINE & ANTARDASHA COMPATIBILITY */}
      <section id="sec-mahadasha-engine" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              <Calendar className="w-4 h-4" /> 4. Vedic Mahadasha Sequence & Antardasha Compatibility
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              वैदिक महादशा क्रम एवं अंतर्दशा अनुकूलता
            </h4>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900">
            Source: Course Day 1 PDF, Pages 17-18
          </div>
        </div>

        {/* Active Mahadasha + Active Antardasha Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Mahadasha */}
          <div className="p-6 bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold font-mono uppercase tracking-wider">
                वर्तमान सक्रिय महादशा (Active Mahadasha)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900">
                अवधि: {currentMahadasha.durationYears} वर्ष
              </span>
            </div>

            <div className="space-y-1">
              <h5 className="text-2xl font-bold font-mono text-slate-900">
                अंक #{currentMahadasha.lordNumber} • {getPlanetName(currentMahadasha.lordNumber, language)}
              </h5>
              <p className="text-xs font-mono text-emerald-800 font-semibold">
                सक्रिय काल: {currentMahadasha.startDate} से {currentMahadasha.endDate} (आयु {currentMahadasha.ageStart} - {currentMahadasha.ageEnd} वर्ष)
              </p>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white/80 p-3 rounded-xl border border-emerald-200/80">
              {language === 'en'
                ? `Mahadasha of Lord #${currentMahadasha.lordNumber} (${getPlanetName(currentMahadasha.lordNumber, language)}): Focus on balanced vital energies, organ vitality, and planetary harmony.`
                : language === 'mr'
                ? `महादशा स्वामी अंक #${currentMahadasha.lordNumber} (${getPlanetName(currentMahadasha.lordNumber, language)}): शारीरिक ऊर्जा, अवयवांचे आरोग्य आणि संतुलित जीवनशैलीवर लक्ष केंद्रित करा.`
                : language === 'bn'
                ? `মহাদশা অধিপতি সংখ্যা #${currentMahadasha.lordNumber} (${getPlanetName(currentMahadasha.lordNumber, language)}): শারীরিক জীবনীশক্তি এবং গ্রহের ভারসাম্য বজায় রাখার ওপর জোর দিন।`
                : language === 'gu'
                ? `મહાદશા સ્વામી અંક #${currentMahadasha.lordNumber} (${getPlanetName(currentMahadasha.lordNumber, language)}): શારીરિક ઉર્જા અને સંતુલિત જીવનશૈલી પર ધ્યાન કેન્દ્રિત કરો.`
                : currentMahadasha.themeHi}
            </p>

            <div className="text-[11px] font-mono text-emerald-900">
              सूत्र: <span className="font-bold">{currentMahadasha.calculationFormula}</span>
            </div>
          </div>

          {/* Active Antardasha & Compatibility */}
          <div className="p-6 bg-sky-50/70 border-2 border-sky-300 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-sky-600 text-white rounded-full text-xs font-bold font-mono uppercase tracking-wider">
                वर्तमान सक्रिय अंतर्दशा (Active Antardasha)
              </span>
              {getCompatibilityBadge(dashaCompatibility.status)}
            </div>

            <div className="space-y-1">
              <h5 className="text-2xl font-bold font-mono text-slate-900">
                अंक #{currentAntardasha.lordNumber} • {currentAntardasha.planetHi}
              </h5>
              <p className="text-xs font-mono text-sky-800 font-semibold">
                सक्रिय वर्ष: {currentAntardasha.startDate} से {currentAntardasha.endDate}
              </p>
            </div>

            <div className="space-y-2 bg-white/80 p-3 rounded-xl border border-sky-200/80">
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                <strong>अनुकूलता विश्लेषण:</strong> {dashaCompatibility.explanationHi}
              </p>
              <p className="text-xs text-sky-900 font-sans italic">
                <strong>मार्गदर्शन:</strong> {dashaCompatibility.adviceHi}
              </p>
            </div>

            <div className="text-[11px] font-mono text-sky-900">
              सूत्र: <span className="font-bold">{currentAntardasha.calculationFormula}</span>
            </div>
          </div>
        </div>

        {/* Mahadasha Full Lifelong Timeline Accordion */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              आजीवन वैदिक महादशा समय-सारणी (Lifelong 45-Year Recurring Sequence):
            </h5>
            <button
              onClick={() => setShowFullTimeline(!showFullTimeline)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              {showFullTimeline ? (
                <>
                  संक्षिप्त देखें <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  संपूर्ण समय-सारणी देखें ({mahadashaTimeline.length} चक्र) <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">महादशा स्वामी</th>
                  <th className="p-3">ग्रह</th>
                  <th className="p-3">अवधि (वर्ष)</th>
                  <th className="p-3">आरंभ - समाप्ति</th>
                  <th className="p-3">आयु</th>
                  <th className="p-3">गणना सूत्र</th>
                  <th className="p-3">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {(showFullTimeline ? mahadashaTimeline : mahadashaTimeline.slice(0, 7)).map((step) => (
                  <tr
                    key={step.periodIndex}
                    className={`${
                      step.isCurrent
                        ? 'bg-emerald-100/70 font-semibold'
                        : step.isUpcoming
                        ? 'bg-amber-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-slate-900">
                      #{step.lordNumber}
                    </td>
                    <td className="p-3">{step.planetHi}</td>
                    <td className="p-3 font-mono">{step.durationYears} वर्ष</td>
                    <td className="p-3 font-mono">
                      {step.startDate} – {step.endDate}
                    </td>
                    <td className="p-3 font-mono">
                      {step.ageStart} – {step.ageEnd} वर्ष
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {step.calculationFormula}
                    </td>
                    <td className="p-3">
                      {step.isCurrent ? (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold font-mono">
                          सक्रिय (Active)
                        </span>
                      ) : step.isUpcoming ? (
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] font-bold font-mono">
                          आगामी (Next)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          {step.endYear < new Date().getFullYear() ? 'व्यतीत' : 'भविष्य'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. PLANETARY BODY PARTS & TRADITIONAL DISEASE SENSITIVITIES */}
      <section id="sec-body-parts" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-rose-700">
              <HeartPulse className="w-4 h-4" /> 5. Planetary Body Parts & Health Sensitivities
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              मूलांक #{coreNumbers.mulank} ({planetaryBodyParts.planetHi}) संबंधित शारीरिक अंग व पारंपरिक संवेदनशीलताएं
            </h4>
          </div>
          <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 text-xs font-mono text-rose-900">
            Source: Course Day 1 PDF, Pages 9-16
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-600 block">
              संबंधित शारीरिक अंग (Governed Body Parts)
            </span>
            <div className="flex flex-wrap gap-2">
              {planetaryBodyParts.bodyPartsHi.map((part, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                >
                  {part}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-sans italic pt-2">
              (English: {planetaryBodyParts.bodyPartsEn.join(', ')})
            </p>
          </div>

          <div className="p-6 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-rose-800 block">
              पारंपरिक संवेदनशीलताएं (Traditional Prone Sensitivities)
            </span>
            <ul className="space-y-2 text-xs text-rose-950 leading-relaxed list-disc list-inside">
              {planetaryBodyParts.traditionalDiseasesHi.map((dis, idx) => (
                <li key={idx}>{dis}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. REMEDIES DIET PLAN & FASTING ROUTINE */}
      <section id="sec-diet-plan" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              <Apple className="w-4 h-4" /> 6. Remedies Diet Plan & Fasting Routine
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              पारंपरिक सात्विक आहार एवं उपवास नियम (Diet Plan for Number #{coreNumbers.mulank})
            </h4>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900">
            Source: Course Day 2 PDF, Pages 4-17
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 block">
              अनुशंसित सात्विक खाद्य पदार्थ (Recommended Foods)
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-950 font-semibold list-disc list-inside">
              {remediesDietPlan.foodsHi.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-amber-800 block">
              उपवास / व्रत दिन (Fasting Day)
            </span>
            <p className="text-sm font-bold text-amber-950">
              {remediesDietPlan.fastingHi}
            </p>
            <p className="text-xs text-amber-800 font-serif italic">
              (English: {remediesDietPlan.fastingEn})
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-600 block">
              सावधानियां व जीवनशैली सुझाव (Precautions & Habits)
            </span>
            <ul className="space-y-2 text-xs text-slate-800 leading-relaxed list-disc list-inside">
              {remediesDietPlan.precautionsHi.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. VEDIC REMEDIES & GOOD KARMA ACTIONS */}
      <section id="sec-vedic-remedies" className="bg-white p-7 md:p-9 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
              <Sparkles className="w-4 h-4" /> 7. Vedic Remedies & Good Karma Actions
            </div>
            <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-900">
              वैदिक उपाय, सद्कर्म एवं सजीव ग्रह सेवा (Remedies for #{coreNumbers.mulank})
            </h4>
          </div>
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs font-mono text-amber-900">
            Source: Course Day 2 PDF, Pages 18-28
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-amber-800 block">
              दैनिक एवं साप्ताहिक वैदिक उपाय (Specific Course Remedies)
            </span>
            <ul className="space-y-2.5 text-xs text-amber-950 leading-relaxed list-disc list-inside">
              {vedicRemedies.remediesHi.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 block">
                सद्कर्म (Good Karma Practices)
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                {vedicRemedies.goodKarmasHi}
              </p>
            </div>

            <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-indigo-800 block">
                सजीव ग्रह सेवा (Living Planets Harmony)
              </span>
              <p className="text-xs text-indigo-950 leading-relaxed font-semibold">
                {vedicRemedies.livingPlanetsHi}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. MANDATORY SAFETY DISCLAIMER BANNER (BOTTOM) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 text-amber-950">
        <div className="p-2.5 bg-amber-200/80 rounded-xl text-amber-900 shrink-0 mt-0.5">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
            Mandatory Disclaimer
          </span>
          <p className="text-sm font-semibold leading-relaxed">
            {mandatoryDisclaimer}
          </p>
        </div>
      </div>

    </div>
  );
};
