import React from 'react';
import { CompleteNumerologyProfile } from '../core/types';
import { MANDATORY_WELLNESS_DISCLAIMER } from '../core/methodology';
import { MedicalVedicDashaPanel } from './MedicalVedicDashaPanel';
import { NumeroVastuDashboard } from './NumeroVastuDashboard';
import { 
  Sparkles, Award, Shield, AlertTriangle, CheckCircle, Compass, 
  Heart, TrendingUp, BookOpen, Layers, Activity, Calendar, Clock, 
  Info, Star, Check, Zap
} from 'lucide-react';

interface KarmicVedicAnalysisViewProps {
  profile: CompleteNumerologyProfile;
}

export const KarmicVedicAnalysisView: React.FC<KarmicVedicAnalysisViewProps> = ({ profile }) => {
  const { combination81, karmic, kua, vedicGrid, actionPlan90Day, medical, coreNumbers, identity } = profile;

  return (
    <div id="karmic-vedic-dashboard" className="space-y-12 animate-in fade-in duration-500 text-left">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#0A0F1D] text-white p-8 md:p-10 rounded-[35px] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/30 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> LeoFamily Vedic & Karmic Intelligence v4.0
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
              ● Multi-Methodology Integrated
            </span>
          </div>

          <h3 className="font-playfair text-2.5xl md:text-4xl font-black tracking-wide text-[#FDFCF7]">
            Vedic Kundali, 81 Yogas & Karmic Roadmap
          </h3>

          <p className="text-slate-300 text-xs md:text-sm font-serif italic max-w-3xl leading-relaxed">
            A comprehensive synthesis uniting traditional Indian Vedic numerology, ancient 81 Mulank-Bhagyank combination yogas, Karmic Debt numbers (13, 14, 16, 19), Kua directional harmony, and a structured 90-day actionable transformation plan for {identity.fullName}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Mulank (मूलांक)</span>
              <p className="text-base font-bold text-[#F59E0B] font-mono">
                #{coreNumbers.mulank} • {coreNumbers.mulankGraha}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Bhagyank (भाग्यांक)</span>
              <p className="text-base font-bold text-sky-400 font-mono">
                #{coreNumbers.bhagyank} • {coreNumbers.bhagyankGraha}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">81 Combination Code</span>
              <p className="text-base font-bold text-amber-300 font-mono">
                {combination81?.code || `${coreNumbers.mulank}-${coreNumbers.bhagyank}`}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Kua Number</span>
              <p className="text-base font-bold text-emerald-400 font-mono">
                #{kua?.kuaNumber || 'N/A'} ({kua?.group || 'Harmonized'})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: 81 MULANK-BHAGYANK COMBINATION MATRIX */}
      {combination81 && (
        <section id="sec-81-combination" className="bg-white p-8 md:p-10 rounded-[35px] border border-[#E5E7EB] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D97706]">
                <Award className="w-4 h-4" /> 81 Indian Numerology Combinations Matrix
              </div>
              <h4 className="font-playfair text-2xl md:text-3xl font-bold text-[#1F2937]">
                {combination81.titleHi}
              </h4>
              <p className="text-xs text-[#6B7280] font-sans">
                {combination81.titleEn} • Code [{combination81.code}] • Nature: {combination81.nature}
              </p>
            </div>

            <div className="bg-[#F8F4EF] px-5 py-3 rounded-2xl border border-[#E5E7EB] text-center">
              <span className="text-[10px] font-mono uppercase text-[#6B7280] block font-bold">Planetary Synergy</span>
              <span className="text-sm font-bold text-[#D97706] font-mono">{combination81.planetPair}</span>
            </div>
          </div>

          {/* Positive vs Negative Traits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Cosmic Strengths & Potential (सकारात्मक ऊर्जा)</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                {combination81.positive}
              </p>
            </div>

            <div className="p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Planetary Challenges & Pitfalls (सावधानी एवं कमजोरियां)</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-sans">
                {combination81.negative}
              </p>
            </div>
          </div>

          {/* 4 Life Domains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <TrendingUp className="w-4 h-4 text-[#D97706]" />
                <span>Career & Authority</span>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {combination81.career}
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Wealth & Liquidity</span>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {combination81.wealth}
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Marriage & Love</span>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {combination81.relationships}
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Dharma & Evolution</span>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {combination81.spirituality}
              </p>
            </div>
          </div>

          {/* Key Lesson & Prescribed Remedy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E7EB]">
            <div className="p-5 bg-blue-50/60 border border-blue-200/70 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-mono text-blue-800 uppercase font-bold tracking-wider block">
                Primary Karmic Lesson
              </span>
              <p className="text-xs text-blue-950 font-medium leading-relaxed">
                "{combination81.keyLesson}"
              </p>
            </div>

            <div className="p-5 bg-amber-50/60 border border-amber-200/70 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold tracking-wider block">
                LeoFamily Prescribed Remedy
              </span>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {combination81.remedy}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: KARMIC DEBT ANALYSIS */}
      {karmic && (
        <section id="sec-karmic-debt" className="bg-white p-8 md:p-10 rounded-[35px] border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D97706]">
                <Shield className="w-4 h-4" /> Traditional Karmic Debt Audit (13, 14, 16, 19)
              </div>
              <h4 className="font-playfair text-2xl font-bold text-[#1F2937]">
                Past-Life Karmic Patterns & Lessons
              </h4>
            </div>

            {karmic.hasKarmicDebt ? (
              <span className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Karmic Debt Detected ({karmic.karmicNumbersPresent.join(', ')})
              </span>
            ) : (
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Clean Karmic Balance
              </span>
            )}
          </div>

          <p className="text-xs text-[#6B7280] leading-relaxed">
            {karmic.summary}
          </p>

          {karmic.debts.length > 0 ? (
            <div className="space-y-6 pt-2">
              {karmic.debts.map((debt, idx) => (
                <div key={idx} className="p-6 bg-[#FDFCF7] border border-[#D97706]/20 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#D97706] text-white font-mono font-bold text-base flex items-center justify-center shadow-sm">
                        {debt.number}
                      </span>
                      <div>
                        <h5 className="font-playfair text-base font-bold text-[#1F2937]">{debt.title}</h5>
                        <span className="text-[10px] font-mono text-[#6B7280]">Source of Detection: {debt.source}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-[#1F2937] block">Past-Life Cause:</span>
                      <p className="text-[#6B7280] leading-relaxed">{debt.pastLifeInfluence}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#1F2937] block">Behavioral Warning:</span>
                      <p className="text-[#6B7280] leading-relaxed">{debt.behavioralManifestation}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#1F2937] block">Daily Action Plan:</span>
                      <p className="text-[#6B7280] leading-relaxed">{debt.practicalActionPlan}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#1F2937] block">LeoFamily Traditional Remedy:</span>
                      <p className="text-[#D97706] leading-relaxed font-semibold">{debt.traditionalRemedy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-emerald-50/40 border border-emerald-200/60 rounded-2xl text-xs text-emerald-900 leading-relaxed">
              <strong>Auspicious Clean Ledger:</strong> Neither your primary birth day nor full compound birth date totals evaluate to the classic debt numbers (13, 14, 16, 19). Maintain ethical conduct, honesty in speech, and daily charity to sustain this pure spiritual flow.
            </div>
          )}
        </section>
      )}

      {/* SECTION 3: VEDIC KUNDALI 3X3 GRID */}
      {vedicGrid && (
        <section id="sec-vedic-grid" className="bg-white p-8 md:p-10 rounded-[35px] border border-[#E5E7EB] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D97706]">
                <Layers className="w-4 h-4" /> Traditional 3x3 Vedic Kundali Grid
              </div>
              <h4 className="font-playfair text-2xl font-bold text-[#1F2937]">
                Planetary Coordinates in Vedic Orientation
              </h4>
            </div>
            <span className="text-xs font-sans text-[#6B7280] bg-[#F8F4EF] px-4 py-2 rounded-xl border border-[#E5E7EB]">
              Row 1: [3, 1, 9] • Row 2: [6, 7, 5] • Row 3: [2, 8, 4]
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 3x3 Grid Visual */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] aspect-square p-3 bg-[#F8F4EF] rounded-3xl border border-[#E5E7EB]">
                {vedicGrid.matrix.flat().map((digit) => {
                  const cell = vedicGrid.grid[digit];
                  const isPresent = cell.count > 0;
                  return (
                    <div
                      key={digit}
                      className={`rounded-2xl p-3 border-2 flex flex-col justify-between transition-all relative overflow-hidden ${
                        isPresent
                          ? 'bg-white border-[#D97706] shadow-sm text-[#1F2937]'
                          : 'bg-[#FDFCF7]/60 border-dashed border-slate-200 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="font-bold text-[#D97706]">#{digit}</span>
                        <span className="text-[9px] uppercase text-slate-400">{cell.direction}</span>
                      </div>
                      
                      <div className="text-center my-auto">
                        <span className="text-xl font-bold font-mono block">
                          {isPresent ? `${digit}`.repeat(cell.count) : '-'}
                        </span>
                        <span className="text-[10px] block font-sans text-slate-500 font-medium">
                          {cell.graha}
                        </span>
                      </div>

                      <div className="text-[9px] text-right font-mono text-slate-400">
                        {cell.count}x
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] text-[#6B7280] mt-3 font-mono">Vedic Astro-Grid Matrix (Digits from DOB)</span>
            </div>

            {/* Triad Axes Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#D97706]" /> {vedicGrid.triadAspects.dharmaAxis.name}
                  </span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                    {vedicGrid.triadAspects.dharmaAxis.presentCount}/3 Present
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {vedicGrid.triadAspects.dharmaAxis.interpretation}
                </p>
              </div>

              <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" /> {vedicGrid.triadAspects.arthaAxis.name}
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    {vedicGrid.triadAspects.arthaAxis.presentCount}/3 Present
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {vedicGrid.triadAspects.arthaAxis.interpretation}
                </p>
              </div>

              <div className="p-5 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#D97706]" /> {vedicGrid.triadAspects.kamaMokshaAxis.name}
                  </span>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                    {vedicGrid.triadAspects.kamaMokshaAxis.presentCount}/3 Present
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {vedicGrid.triadAspects.kamaMokshaAxis.interpretation}
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-xs text-amber-950">
                <strong>Vedic Synthesis:</strong> {vedicGrid.synthesis}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: KUA NUMBER & CARDINAL HARMONY */}
      {kua && (
        <section id="sec-kua-directions" className="bg-white p-8 md:p-10 rounded-[35px] border border-[#E5E7EB] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D97706]">
                <Compass className="w-4 h-4" /> Kua Number & Directional Alignment
              </div>
              <h4 className="font-playfair text-2xl font-bold text-[#1F2937]">
                Kua #{kua.kuaNumber} • {kua.group} ({kua.element} • {kua.trigram})
              </h4>
            </div>

            <span className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
              {kua.gender} Calculation
            </span>
          </div>

          <p className="text-xs text-[#6B7280] leading-relaxed">
            {kua.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Favourable Directions */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> 4 Auspicious Directions (शुभ दिशाएं)
              </span>

              <div className="space-y-3">
                {kua.favorableDirections.map((dir, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-900">{dir.direction} • {dir.name}</span>
                      <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold">{dir.category}</span>
                    </div>
                    <p className="text-emerald-950 text-[11px] leading-relaxed">{dir.description}</p>
                    <p className="text-[10px] text-emerald-800 italic pt-1 font-sans">Optimal Use: {dir.optimalUse}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Unfavourable Directions */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase font-bold text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> 4 Inauspicious Directions (सावधानी दिशाएं)
              </span>

              <div className="space-y-3">
                {kua.unfavorableDirections.map((dir, idx) => (
                  <div key={idx} className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-900">{dir.direction} • {dir.name}</span>
                      <span className="text-[10px] font-mono uppercase text-rose-700 font-bold">{dir.category}</span>
                    </div>
                    <p className="text-rose-950 text-[11px] leading-relaxed">{dir.description}</p>
                    <p className="text-[10px] text-rose-800 italic pt-1 font-sans">Protection Advice: {dir.advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: 90-DAY ACTION PLAN */}
      {actionPlan90Day && (
        <section id="sec-90-day-roadmap" className="bg-white p-8 md:p-10 rounded-[35px] border border-[#E5E7EB] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#D97706]">
                <Calendar className="w-4 h-4" /> Structured Transformation
              </div>
              <h4 className="font-playfair text-2xl font-bold text-[#1F2937]">
                90-Day Developmental Roadmap
              </h4>
            </div>
            <span className="text-xs font-mono uppercase text-[#D97706] font-bold bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              Phased Remediation
            </span>
          </div>

          <p className="text-xs text-[#6B7280] leading-relaxed">
            {actionPlan90Day.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actionPlan90Day.phases.map((phase) => (
              <div key={phase.phase} className="p-6 bg-[#FAF8F5] border border-[#E5E7EB] rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#D97706] bg-amber-100/60 px-2 py-0.5 rounded">
                      {phase.days}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">Phase {phase.phase}</span>
                  </div>
                  <h5 className="font-playfair text-base font-bold text-[#1F2937]">{phase.title}</h5>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{phase.objective}</p>
                  
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Core Actions:</span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {phase.actions.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#D97706] mt-0.5 flex-shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 block">Target Milestone:</span>
                  <p className="text-xs text-slate-800 font-semibold mt-0.5">{phase.milestone}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Habits & Cautions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E7EB]">
            <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Recommended Daily Practices
              </span>
              <ul className="space-y-1 text-xs text-emerald-950">
                {actionPlan90Day.dailyHabits.map((habit, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Cautionary Guidelines
              </span>
              <ul className="space-y-1 text-xs text-amber-950">
                {actionPlan90Day.cautions.map((caution, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: TRADITIONAL MEDICAL NUMEROLOGY & VEDIC MAHADASHA (COURSE MODULE) */}
      {medical && (
        <section id="sec-medical-vedic-dasha-module">
          <MedicalVedicDashaPanel profile={profile} />
        </section>
      )}

      {/* SECTION 7: NUMERO VASTU, KUA & PROPERTY HARMONICS */}
      <section id="sec-numero-vastu-kua-module">
        <NumeroVastuDashboard
          profile={profile}
          dob={profile.identity.dob}
          name={profile.identity.fullName}
          gender={(profile.identity.gender as 'MALE' | 'FEMALE') || 'MALE'}
        />
      </section>

    </div>
  );
};

export default KarmicVedicAnalysisView;
