import React from 'react';

const App: React.FC = () => {
  return (
    <div id="clean-slate-container" className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-6 selection:bg-amber-500/30">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        {/* Sleek Minimal Emblem */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-amber-900/25 shadow-2xl relative mb-4">
          <span className="text-2xl cosmic-drift opacity-60">✨</span>
          <div className="absolute inset-0 border border-amber-500/10 rounded-full animate-pulse"></div>
        </div>

        {/* Clear Workspace Metadata */}
        <div className="space-y-4">
          <h1 className="font-cinzel text-2xl md:text-3xl gold-text-shimmer uppercase tracking-[0.25em]">
            Clean Slate
          </h1>
          <p className="text-slate-400 font-lora italic text-sm md:text-base leading-relaxed">
            Workspace successfully reset. Introduce your custom requirements, rules, or core concepts, and I will build them with high-fidelity components and pristine design.
          </p>
        </div>

        {/* System telemetry line under architectural honesty */}
        <div className="pt-8 border-t border-white/[0.03]">
          <span className="font-mono text-[9px] text-amber-700/60 uppercase tracking-[0.4em] block">
            Awaiting prompt vectors...
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
