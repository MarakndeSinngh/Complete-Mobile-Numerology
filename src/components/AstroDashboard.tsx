import React from 'react';
import { DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';

interface AstroDashboardProps {
  dobData: DOBAnalysis;
  nameData: NameAnalysis;
  mobileData: MobileAnalysis;
  remedies: remediesAdvice;
  name: string;
}

const AstroDashboard: React.FC<AstroDashboardProps> = ({ dobData, nameData, mobileData, remedies, name }) => {
  // Check presence for Vedic grid
  const presentNumbers = new Set(
    (dobData.birthNumber.toString() + dobData.lifePathNumber.toString() + dobData.destinyNumber.toString())
      .split('')
      .map(Number)
  );

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
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">Your divine purpose, karmic trajectory, and path in life.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Birth Compound Number</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{dobData.birthNumberCompound}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">The unreduced daily birth vibration representing core heritage.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Mobile Compound Number</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{mobileData.compoundTotal}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">The collective total of your 10-digit mobile number.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden bg-white hover:border-[#D97706]/30 border-[#E5E7EB] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[#D97706]/80 block tracking-wider font-bold">Mobile Root Number</span>
          <span className="text-4xl font-playfair font-bold text-[#D97706] mt-2 block">{mobileData.reducedTotal}</span>
          <p className="text-[#6B7280] text-[10px] mt-2 leading-relaxed">The single-digit primary mobile vibration influencing success.</p>
        </div>
      </div>

      {/* Astro Grids Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Vedic Grid Card */}
        <div className="glass-panel p-8 rounded-[40px] space-y-6 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Vedic Grid (Sepharial)</h3>
            <span className="text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold border border-[#D97706]/20">Planetary Houses</span>
          </div>
          <p className="text-xs text-[#6B7280]">Highlights active numeric portals influencing your subtle body energy aligned with celestial forces.</p>

          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-4">
            {vedicTemplate.map((row, rIdx) =>
              row.map((num) => {
                const isActive = presentNumbers.has(num);
                return (
                  <div
                    key={`vedic-${rIdx}-${num}`}
                    className={`aspect-square flex flex-col justify-center items-center rounded-2xl border transition-all duration-700 ${
                      isActive
                        ? 'bg-[#D97706]/10 border-[#D97706]/40 text-[#D97706] shadow-[0_4px_12px_rgba(217,119,6,0.12)]'
                        : 'bg-[#F8F4EF] border-[#E5E7EB] text-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-playfair font-black">{num}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Losho Grid Card */}
        <div className="glass-panel p-8 rounded-[40px] space-y-6 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Losho Magic Square Grid</h3>
            <span className="text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold border border-[#D97706]/20">Vibrational Planes</span>
          </div>
          <p className="text-xs text-[#6B7280]">Shows the material, social, and emotional alignments acting in your planetary cosmic charts.</p>

          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-4">
            {loshoTemplate.map((row, rIdx) =>
              row.map((num) => {
                const isActive = presentNumbers.has(num);
                return (
                  <div
                    key={`losho-${rIdx}-${num}`}
                    className={`aspect-square flex flex-col justify-center items-center rounded-2xl border transition-all duration-700 ${
                      isActive
                        ? 'bg-[#D97706]/10 border-[#D97706]/40 text-[#D97706] shadow-[0_4px_12px_rgba(217,119,6,0.12)]'
                        : 'bg-[#F8F4EF] border-[#E5E7EB] text-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-playfair font-black">{num}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Traits Section */}
      <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm">
        <h3 className="font-playfair text-xl font-bold text-[#1F2937] mb-6 tracking-wide border-b border-[#E5E7EB] pb-3">Planetary Traits Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-sm font-bold text-[#10B981] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Positive Strengths
            </h4>
            <ul className="space-y-3 text-xs text-[#1F2937] leading-relaxed">
              {nameData.traits.positive.map((t, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-[#10B981] font-mono font-bold">✓</span> <span className="text-slate-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#EF4444] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span> Frictional Blockages
            </h4>
            <ul className="space-y-3 text-xs text-[#1F2937] leading-relaxed">
              {nameData.traits.negative.map((t, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-[#EF4444] font-mono font-bold">✗</span> <span className="text-slate-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#D97706] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Top Career Suitability
            </h4>
            <ul className="space-y-3 text-xs text-[#1F2937] leading-relaxed">
              {nameData.traits.careers.map((t, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-[#F59E0B] font-mono font-bold">★</span> <span className="text-slate-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AstroDashboard;
