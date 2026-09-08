import React from 'react';
import { Sparkles, Zap, Film, Image as ImageIcon, Cpu, Flame, Layers } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const models = [
    { name: 'Google Veo', icon: Film, color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30' },
    { name: 'Gemini 2.0', icon: Cpu, color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30' },
    { name: 'ChatGPT', icon: Sparkles, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
    { name: 'Midjourney v6', icon: ImageIcon, color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30' },
    { name: 'FLUX.1', icon: Zap, color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30' },
    { name: 'Stable Diffusion', icon: Layers, color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'Kling AI', icon: Flame, color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30' },
    { name: 'Runway Gen-3', icon: Film, color: 'from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30' },
  ];

  return (
    <section className="relative w-full max-w-6xl mx-auto pt-8 pb-6 px-4 text-center overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-[600px] h-[300px] bg-gradient-to-tr from-[#6C5CE7]/30 via-[#7C4DFF]/20 to-transparent blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[200px] bg-[#8B5CF6]/15 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[200px] bg-indigo-600/15 blur-[80px] pointer-events-none rounded-full" />

      {/* Powered by Earnify Labs Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/80 border border-white/10 backdrop-blur-md mb-6 shadow-xl shadow-purple-950/20 hover:border-purple-500/40 transition-all cursor-default">
        <span className="flex h-2 w-2 rounded-full bg-[#7C4DFF] animate-ping" />
        <span className="text-xs font-semibold text-purple-300">PromptX</span>
        <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
          Powered by Earnify Labs
        </span>
      </div>

      {/* Main Hero Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
          PromptX
        </span>
        <br />
        <span className="text-2xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6]">
          AI Image & Video Prompt Generator
        </span>
      </h1>

      {/* Subtitle Description */}
      <p className="text-slate-400 text-sm md:text-lg max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
        Upload any image or video and instantly generate ultra-detailed, professional AI prompts tailored for <strong className="text-slate-200">Google Veo, Gemini, ChatGPT, Midjourney, FLUX, Stable Diffusion, Kling AI</strong>, and more.
      </p>

      {/* Supported AI Models Ribbon */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {models.map((m, idx) => {
          const IconComponent = m.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-gradient-to-r ${m.color} text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-purple-900/20`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{m.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
