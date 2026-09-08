import React, { useEffect, useState } from 'react';
import { Loader2, Layers, Cpu, Sparkles, ShieldAlert } from 'lucide-react';
import { AppStep, ProcessingState } from '../types';

interface ProcessingViewProps {
  step: AppStep;
  state: ProcessingState;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ step, state }) => {
  const [visualProgress, setVisualProgress] = useState(0);

  useEffect(() => {
    const baseProgress = ((state.currentCount - 1) / (state.totalCount || 1)) * 100;
    const itemProgress = ((state.progress || 0) / (state.totalCount || 1));
    const target = baseProgress + itemProgress;

    if (target > visualProgress) {
      const diff = target - visualProgress;
      const stepSize = Math.max(diff / 10, 0.2);
      const timer = setTimeout(() => {
        setVisualProgress(prev => Math.min(prev + stepSize, 100));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [state.progress, state.currentCount, state.totalCount, visualProgress]);

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 md:p-12 rounded-3xl glass-card text-center animate-fade-in shadow-2xl relative overflow-hidden border border-white/10">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#7C4DFF]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Radial Progress Graphic */}
      <div className="relative w-28 h-28 mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6C5CE7]/30 to-[#8B5CF6]/30 rounded-full animate-pulse-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
           {step === AppStep.ANALYZING ? (
             <Sparkles className="w-10 h-10 text-[#8B5CF6] animate-pulse" />
           ) : (
             <Loader2 className="w-10 h-10 text-[#7C4DFF] animate-spin" />
           )}
        </div>
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="44" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.08)" 
            strokeWidth="5" 
          />
          <circle 
            cx="50" cy="50" r="44" 
            fill="none" 
            stroke="#7C4DFF" 
            strokeWidth="5" 
            strokeDasharray="276.46" 
            strokeDashoffset={276.46 * (1 - Math.min(visualProgress, 100) / 100)}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-950/60 text-xs font-bold text-purple-300 mb-4 tracking-wider uppercase border border-purple-500/30">
        <Cpu className="w-3.5 h-3.5 text-purple-400" />
        PromptX AI Queue: {state.currentCount} / {state.totalCount}
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
        {step === AppStep.ANALYZING ? "Reverse-Engineering Media Assets" : "Initializing Media Pipeline"}
      </h2>

      <p className="text-slate-300 text-sm mb-8 h-6 italic font-medium">
        {state.message || "Generating frame-by-frame prompt descriptions..."}
      </p>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5 p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6] rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${Math.min(visualProgress, 100)}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>AI Vision Synthesizer</span>
        <span>{Math.round(Math.min(visualProgress, 100))}%</span>
      </div>

      {state.message?.includes('Cooldown') && (
        <div className="mt-6 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Intelligent Rate Limit Throttling Active — Protecting Gemini API Quota</span>
        </div>
      )}
    </div>
  );
};
