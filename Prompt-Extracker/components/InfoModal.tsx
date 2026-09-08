import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertTriangle, Users, Sparkles, MessageCircle, Youtube, Facebook, Github } from 'lucide-react';

export type InfoTab = 'about' | 'privacy' | 'disclaimer';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: InfoTab;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<InfoTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#111827] border border-white/10 rounded-3xl shadow-2xl flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#09090B]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-[#6C5CE7] to-[#7C4DFF] text-white rounded-2xl border border-purple-400/20 shadow-lg shadow-purple-950/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                PromptX
                <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono">
                  Earnify Labs
                </span>
              </h3>
              <p className="text-xs text-slate-400">Information & Community Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#09090B]/40 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-[#7C4DFF] text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            About Earnify Labs
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Terms & Disclaimer
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed custom-scrollbar">
          {activeTab === 'about' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 bg-gradient-to-br from-purple-950/40 via-[#111827] to-[#09090B] border border-purple-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#7C4DFF] flex items-center justify-center font-bold text-white text-lg shadow-lg">
                    EL
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Earnify Labs</h4>
                    <p className="text-xs text-purple-300">Transform Images & Videos into AI-Ready Prompts</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>PromptX</strong> is built by <strong>Earnify Labs</strong>. PromptX allows creators, prompt engineers, and visual artists to reverse-engineer images and video clips into highly structured, detailed prompts for Google Veo, Gemini, ChatGPT, Midjourney, FLUX, Stable Diffusion, Kling AI, and Runway.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Core Capabilities</h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside bg-[#09090B] p-4 rounded-xl border border-white/10">
                  <li>Translates raw images and video clips into frame-accurate, production-grade AI prompts.</li>
                  <li>Extracts lighting setups, camera movements, color grading, art styles, and motion timing.</li>
                  <li>Supports batch queue processing up to 20 media files with Gemini 2.0 AI vision analysis.</li>
                  <li>100% Client-Side Privacy: No user media is stored on external database servers.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Earnify Labs Channels</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a
                    href="https://whatsapp.com/channel/0029VbD422MGOj9lYSbcc72c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#09090B] hover:bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center text-xs font-medium text-slate-200 transition-colors gap-1.5"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://facebook.com/earnifylabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#09090B] hover:bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center text-xs font-medium text-slate-200 transition-colors gap-1.5"
                  >
                    <Facebook className="w-5 h-5 text-blue-400" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://youtube.com/@earnifylabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#09090B] hover:bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center text-xs font-medium text-slate-200 transition-colors gap-1.5"
                  >
                    <Youtube className="w-5 h-5 text-red-400" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#09090B] hover:bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center text-xs font-medium text-slate-200 transition-colors gap-1.5"
                  >
                    <Github className="w-5 h-5 text-purple-400" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in text-xs">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-emerald-200/90 leading-relaxed">
                  <strong>100% Client-Side Privacy:</strong> PromptX does not save or transmit your media files to secondary servers. All video and image data is processed directly between your browser and Google Gemini API over secure HTTPS.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. Local Storage Security</h4>
                <p>
                  Any custom Gemini API key configured in PromptX is saved strictly in your browser's <code>localStorage</code>. It remains under your local control and can be wiped instantly at any time.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. In-Memory Media Processing</h4>
                <p>
                  Uploaded images and videos are read temporarily in browser RAM as base64 data to facilitate prompt generation, after which references are released.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">3. Zero Data Mining</h4>
                <p>
                  Earnify Labs does not sell, analyze, or harvest user data or uploaded assets.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-5 animate-fade-in text-xs">
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200/90 leading-relaxed">
                  <strong>Terms of Use:</strong> PromptX generates descriptive recreation text prompts based on AI vision models. Users are responsible for evaluating copyright compliance and licensing when utilizing prompts.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. AI Model Outputs</h4>
                <p>
                  Prompts generated by PromptX are produced using AI model vision analysis. Output quality depends on visual resolution and lighting. Prompt descriptions serve as creative starting points for video and image generators.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. Fair Use & Intellectual Property</h4>
                <p>
                  Earnify Labs assumes no liability for misuse of generated prompts or source assets analyzed with PromptX. Always ensure proper authorization when reverse-engineering visual content.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#09090B]/90 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 Earnify Labs. All Rights Reserved.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
