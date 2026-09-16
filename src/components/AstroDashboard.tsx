import React from 'react';
import { DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { NumerologyProfile, buildBirthGrid, buildEnhancedGrid } from '../core';
import { CompleteNumerologyProfile } from '../core/types';
import { MANDATORY_WELLNESS_DISCLAIMER } from '../core/methodology';
import { Sparkles, Shield, AlertTriangle, CheckCircle, Compass, Award, Star, Activity, Info, Heart, TrendingUp } from 'lucide-react';

interface AstroDashboardProps {
  dobData: DOBAnalysis;
  nameData: NameAnalysis;
  mobileData: MobileAnalysis;
  remedies: remediesAdvice;
  name: string;
  profile?: NumerologyProfile | CompleteNumerologyProfile | null;
  completeProfile?: CompleteNumerologyProfile | null;
}

const AstroDashboard: React.FC<AstroDashboardProps> = ({ dobData, nameData, mobileData, remedies, name, profile, completeProfile }) => {
  const fullProfile = (completeProfile || profile) as CompleteNumerologyProfile | null;

  // Use centralized profile or compute via standard core engines
  const effectiveGrid: Record<number, number> = React.useMemo(() => {
    if (profile?.enhancedGrid) {
      return profile.enhancedGrid;
    }
    const bg = buildBirthGrid(dobData.dob || '1990-01-01');
    const eg = buildEnhancedGrid(bg, dobData.birthNumber, dobData.lifePathNumber);
    return eg.flatGrid;
  }, [profile, dobData]);

  const presentNumbers = React.useMemo(() => {
    return new Set(
      Object.entries(effectiveGrid)
        .filter(([_, count]) => (count as number) > 0)
        .map(([digit]) => parseInt(digit, 10))
    );
  }, [effectiveGrid]);

  const vedicTemplate = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];

  const loshoTemplate = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];

  return (
    <div id="dashboard-tab-panel" className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Driver Number (Mulank)</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{dobData.birthNumber}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">Your conscious character, talent, and physical disposition.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Conductor Number (Bhagyank)</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{dobData.lifePathNumber}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">Your destined path, karmic mission, and spiritual purpose.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Chaldean Name Power</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{nameData.chaldeanNumber}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">External magnetic frequencies projected into social networks.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Mobile Compound</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{mobileData.compoundTotal}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">Material wealth vibrations flowing into personal communication lines.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Personal Year Vibration</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{dobData.personalYear}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">Annual planetary rhythm dictating favorable cycles and transitions.</p>
        </div>
      </div>

      {/* 81 Combination & Karmic Alignment Quick Banner */}
      {fullProfile?.combination81 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-transparent p-6 rounded-3xl border border-amber-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#D97706] text-white px-2.5 py-0.5 rounded-full font-bold">
                81 Yoga Code: {fullProfile.combination81.code}
              </span>
              <span className="text-xs font-bold text-[#1F2937]">
                {fullProfile.combination81.titleHi} ({fullProfile.combination81.titleEn})
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              <strong className="text-[#1F2937]">Planetary Pair:</strong> {fullProfile.combination81.planetPair} • <strong className="text-[#1F2937]">Nature:</strong> {fullProfile.combination81.nature}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {fullProfile.karmic && (
              fullProfile.karmic.hasKarmicDebt ? (
                <span className="text-xs px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-mono font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Karmic Debt #{fullProfile.karmic.karmicNumbersPresent.join(', #')}
                </span>
              ) : (
                <span className="text-xs px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Clean Karmic Slate
                </span>
              )
            )}

            {fullProfile.kua && (
              <span className="text-xs px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-mono font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Kua #{fullProfile.kua.kuaNumber} ({fullProfile.kua.group})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grids Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Vedic Grid Card */}
        <div className="glass-panel p-8 rounded-[40px] space-y-6 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Vedic Grid (3x3)</h3>
            <span className="text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold border border-[#D97706]/20">Planetary Matrix</span>
          </div>
          <p className="text-xs text-[#6B7280]">Synthesizes planetary placements according to classical Indian astrology systems.</p>

          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-4">
            {vedicTemplate.map((row, rIdx) =>
              row.map((num) => {
                const isActive = presentNumbers.has(num);
                const count = effectiveGrid[num] || 0;
                return (
                  <div
                    key={`vedic-${rIdx}-${num}`}
                    className={`aspect-square flex flex-col justify-center items-center rounded-2xl border transition-all duration-700 relative ${
                      isActive
                        ? 'bg-[#D97706]/10 border-[#D97706]/40 text-[#D97706] shadow-[0_4px_12px_rgba(217,119,6,0.12)]'
                        : 'bg-[#F8F4EF] border-[#E5E7EB] text-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-playfair font-black">{num}</span>
                    {count > 1 && (
                      <span className="absolute top-1 right-1.5 text-[9px] font-mono font-bold bg-[#D97706] text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {fullProfile?.vedicGrid && (
            <div className="pt-4 border-t border-[#E5E7EB] space-y-2 text-xs">
              <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">Vedic Triad Axes</span>
              <div className="space-y-1.5 text-[#6B7280]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-[#1F2937]">{fullProfile.vedicGrid.triadAspects.dharmaAxis.name}</span>
                  <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">{fullProfile.vedicGrid.triadAspects.dharmaAxis.presentCount}/3 Present</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-[#1F2937]">{fullProfile.vedicGrid.triadAspects.arthaAxis.name}</span>
                  <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">{fullProfile.vedicGrid.triadAspects.arthaAxis.presentCount}/3 Present</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-[#1F2937]">{fullProfile.vedicGrid.triadAspects.kamaMokshaAxis.name}</span>
                  <span className="font-mono text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-bold">{fullProfile.vedicGrid.triadAspects.kamaMokshaAxis.presentCount}/3 Present</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Losho Grid Card */}
        <div className="glass-panel p-8 rounded-[40px] space-y-6 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">LeoFamily Lo Shu Grid</h3>
            <span className="text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold border border-[#D97706]/20">3-Layer Architecture</span>
          </div>
          <p className="text-xs text-[#6B7280]">Shows material, will, and emotional planes synthesized across Birth DOB, Driver (Mulank), and Conductor (Bhagyank) layers.</p>

          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-4">
            {loshoTemplate.map((row, rIdx) =>
              row.map((num) => {
                const isActive = presentNumbers.has(num);
                const count = effectiveGrid[num] || 0;
                return (
                  <div
                    key={`losho-${rIdx}-${num}`}
                    className={`aspect-square flex flex-col justify-center items-center rounded-2xl border transition-all duration-700 relative ${
                      isActive
                        ? 'bg-[#D97706]/10 border-[#D97706]/40 text-[#D97706] shadow-[0_4px_12px_rgba(217,119,6,0.12)]'
                        : 'bg-[#F8F4EF] border-[#E5E7EB] text-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-playfair font-black">{num}</span>
                    {count > 1 && (
                      <span className="absolute top-1 right-1.5 text-[9px] font-mono font-bold bg-[#D97706] text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Planetary Alignment Matrix */}
      <div className="glass-panel p-8 rounded-[40px] space-y-6 bg-white border-[#E5E7EB] shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Planetary Vibrational Alignment</h3>
          <span className="text-[10px] font-mono text-[#D97706] bg-[#D97706]/10 px-3 py-1 rounded-full uppercase tracking-wider font-semibold border border-[#D97706]/20">LeoFamily Matrix</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Planet</th>
                <th className="py-3 px-4">Number</th>
                <th className="py-3 px-4">Presence in Chart</th>
                <th className="py-3 px-4">Harmonic Resonance</th>
                <th className="py-3 px-4">Cosmic Element</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]/60">
              {[
                { planet: 'Sun (Surya)', num: 1, element: 'Fire', nature: 'Executive / Royal' },
                { planet: 'Moon (Chandra)', num: 2, element: 'Water', nature: 'Intuitive / Receptive' },
                { planet: 'Jupiter (Brihaspati)', num: 3, element: 'Wood / Akasha', nature: 'Scholarly / Expansive' },
                { planet: 'Rahu (North Node)', num: 4, element: 'Wood', nature: 'Strategic / Breakthrough' },
                { planet: 'Mercury (Budha)', num: 5, element: 'Earth', nature: 'Commercial / Stabilizer' },
                { planet: 'Venus (Shukra)', num: 6, element: 'Metal', nature: 'Aesthetic / Luxury' },
                { planet: 'Ketu (South Node)', num: 7, element: 'Metal', nature: 'Metaphysical / Mystical' },
                { planet: 'Saturn (Shani)', num: 8, element: 'Earth', nature: 'Judicial / Tenacious' },
                { planet: 'Mars (Mangala)', num: 9, element: 'Fire', nature: 'Courageous / Dynamic' }
              ].map((p, idx) => {
                const count = effectiveGrid[p.num] || 0;
                return (
                  <tr key={idx} className="hover:bg-[#F8F4EF]/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1F2937]">{p.planet}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#D97706]">#{p.num}</td>
                    <td className="py-3.5 px-4">
                      {count > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active ({count}x)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Latent Node
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280]">{p.nature}</td>
                    <td className="py-3.5 px-4 text-[#6B7280] font-mono">{p.element}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wellness & Astrological Notice */}
      <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-3xl flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#B45309] block uppercase tracking-wide text-[10px]">Traditional Astrological Notice:</strong>
          {MANDATORY_WELLNESS_DISCLAIMER}
        </p>
      </div>

    </div>
  );
};

export default AstroDashboard;
