import React from 'react';
import { 
  ImageIcon, 
  Video, 
  Sparkles, 
  Wand2, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Copy 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ImageIcon,
      title: 'Image to Prompt',
      description: 'Deconstruct any photo or artwork into comprehensive photographic and artistic recreation prompts.',
      glow: 'from-purple-500/10 to-indigo-500/10 hover:border-purple-500/40'
    },
    {
      icon: Video,
      title: 'Video to Prompt',
      description: 'Analyze frame rate, motion, camera angles, action, and timing for cinematic video generator prompts.',
      glow: 'from-blue-500/10 to-violet-500/10 hover:border-blue-500/40'
    },
    {
      icon: Sparkles,
      title: 'AI Scene Analysis',
      description: 'Detects lighting setups, color grading, shot composition, character details, and environmental textures.',
      glow: 'from-amber-500/10 to-purple-500/10 hover:border-amber-500/40'
    },
    {
      icon: Wand2,
      title: 'Prompt Enhancement',
      description: 'Formats raw visual descriptions into production-ready prompts optimized for current-gen AI tools.',
      glow: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/40'
    },
    {
      icon: Layers,
      title: 'Multi-Model Support',
      description: 'Compatible output styles for Google Veo, Gemini, ChatGPT, Midjourney, FLUX, Stable Diffusion, and Kling AI.',
      glow: 'from-fuchsia-500/10 to-pink-500/10 hover:border-fuchsia-500/40'
    },
    {
      icon: Zap,
      title: 'Fast Batch Processing',
      description: 'Queue up to 20 media files at once with intelligent throttling and automated rate limit protection.',
      glow: 'from-violet-500/10 to-indigo-500/10 hover:border-violet-500/40'
    },
    {
      icon: ShieldCheck,
      title: 'Client-Side Privacy',
      description: 'Your uploaded media is processed directly via Gemini API and never stored on third-party tracking servers.',
      glow: 'from-teal-500/10 to-cyan-500/10 hover:border-teal-500/40'
    },
    {
      icon: Copy,
      title: 'One-Click Export & Copy',
      description: 'Export all generated prompts as structured text files or copy instantly to your clipboard.',
      glow: 'from-rose-500/10 to-purple-500/10 hover:border-rose-500/40'
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto my-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          Designed for Modern AI Creators
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Everything you need to reverse-engineer high-performing video and image prompts effortlessly with Earnify Labs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className={`group relative p-6 rounded-2xl bg-[#111827]/80 border border-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20 bg-gradient-to-b ${feat.glow}`}
            >
              <div className="p-3 w-max rounded-xl bg-purple-950/50 border border-purple-500/20 text-[#8B5CF6] mb-4 group-hover:scale-110 group-hover:bg-[#6C5CE7] group-hover:text-white transition-all duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
