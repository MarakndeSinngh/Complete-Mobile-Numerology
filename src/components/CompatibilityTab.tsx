import React, { useState } from 'react';
import { generateCompatibility } from '../services/numerologyEngine';
import { CompatibilityReport } from '../types';

const CompatibilityTab: React.FC = () => {
  const [nameA, setNameA] = useState('');
  const [dobA, setDobA] = useState('');
  const [nameB, setNameB] = useState('');
  const [dobB, setDobB] = useState('');
  const [result, setResult] = useState<CompatibilityReport | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameA || !dobA || !nameB || !dobB) return;
    const report = generateCompatibility(nameA, dobA, nameB, dobB);
    setResult(report);
  };

  return (
    <div id="compatibility-tab-panel" className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6">
        <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Astro-Planetary Compatibility</h3>
        <p className="text-[#6B7280] text-xs">
          Match personal chart metrics to decode relationship, friendship, marital, or business alignments under Chaldean values.
        </p>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Person A */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#D97706] font-bold">First Person Details</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] rounded-2xl px-5 py-3.5 outline-none text-sm text-[#1F2937]"
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                required
              />
              <input
                type="date"
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] rounded-2xl px-5 py-3.5 outline-none text-sm text-[#1F2937]"
                value={dobA}
                onChange={(e) => setDobA(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Person B */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#D97706] font-bold">Second Person Details</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] rounded-2xl px-5 py-3.5 outline-none text-sm text-[#1F2937]"
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                required
              />
              <input
                type="date"
                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] rounded-2xl px-5 py-3.5 outline-none text-sm text-[#1F2937]"
                value={dobB}
                onChange={(e) => setDobB(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 text-xs tracking-widest uppercase cursor-pointer"
            >
              Analyze Synastry Bond
            </button>
          </div>

        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6 duration-700">
          
          {/* Synastry Meter Card */}
          <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm flex flex-col justify-center items-center text-center space-y-6">
            <span className="text-xs font-mono uppercase text-[#D97706]/80 tracking-widest font-bold">Resonance Compatibility</span>
            
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Radial Score representation */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#F8F4EF" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#D97706"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-5xl font-playfair font-bold text-[#1F2937]">{result.score}%</span>
                <span className="block text-[8px] font-mono text-[#6B7280] uppercase mt-1 font-bold">Planetary Match</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#F59E0B] tracking-widest block font-bold">Potential Verdict</span>
              <p className="font-playfair text-lg text-[#1F2937] font-bold mt-1 uppercase tracking-wider">
                {result.score >= 85 ? 'Highly Auspicious Match' : result.score >= 70 ? 'Favorable Match' : 'Planetary Adjustments Suggested'}
              </p>
            </div>
          </div>

          {/* Detailed Match breakdown */}
          <div className="glass-panel p-8 rounded-[40px] bg-white border-[#E5E7EB] shadow-sm space-y-6">
            <h4 className="font-playfair text-xl font-bold text-[#1F2937] pb-2 border-b border-[#E5E7EB]">Synastry Matrix Breakdown</h4>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-bold">Union Bond</span>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">{result.relationship}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-bold">Friendship Alignment</span>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">{result.friendship}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-bold">Business Synergy</span>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">{result.business}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest block font-bold">Domestic Compatibility</span>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">{result.marriage}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CompatibilityTab;
