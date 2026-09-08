import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  MessageCircle,
  Youtube,
  Instagram,
  Send,
  ExternalLink,
} from 'lucide-react';
import { InfoTab } from './InfoModal';

interface FooterProps {
  onOpenInfoModal: (tab: InfoTab) => void;
  onOpenSettings: () => void;
  hasCustomKey: boolean;
}

const SITE_URL = 'https://earnifyxlab.in';

const PLATFORM_LINKS = [
  { label: 'AI Tools', href: `${SITE_URL}/ai-tools/` },
  { label: 'Chrome Extensions', href: `${SITE_URL}/extensions/` },
  { label: 'Software & Apps', href: `${SITE_URL}/software/` },
  { label: 'PromptBhandar', href: `${SITE_URL}/prompts/` },
  { label: 'Automation Tools', href: `${SITE_URL}/automation/` },
];

const RESOURCE_LINKS = [
  { label: 'Creator Resources', href: `${SITE_URL}/resources/` },
  { label: 'Blog & Insights', href: `${SITE_URL}/blog/` },
  { label: 'Tutorials & Guides', href: `${SITE_URL}/tutorials/` },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: `${SITE_URL}/privacy-policy/` },
  { label: 'Terms of Service', href: `${SITE_URL}/terms/` },
  { label: 'Disclaimer', href: `${SITE_URL}/disclaimer/` },
  { label: 'Contact Us', href: 'mailto:contact@earnifyxlab.in' },
];

const SOCIAL_LINKS = [
  {
    label: 'WhatsApp Channel',
    href: 'https://whatsapp.com/channel/0029VbD422MGOj9lYSbcc72c',
    icon: MessageCircle,
    color: 'emerald',
  },
  {
    label: 'Telegram VIP',
    href: 'https://t.me/+HEQvM-fugAgwZjZl',
    icon: Send,
    color: 'blue',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: Youtube,
    color: 'red',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
    color: 'purple',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-950 text-emerald-400 group-hover:bg-emerald-600',
  blue: 'bg-blue-950 text-blue-400 group-hover:bg-blue-600',
  red: 'bg-red-950 text-red-400 group-hover:bg-red-600',
  purple: 'bg-purple-950 text-purple-400 group-hover:bg-purple-600',
};

export const Footer: React.FC<FooterProps> = ({
  onOpenInfoModal,
  onOpenSettings,
  hasCustomKey,
}) => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#09090B]/95 pt-14 pb-10 px-4 md:px-8 mt-auto text-slate-400 text-xs selection:bg-[#7C4DFF]/30">
      <div className="max-w-7xl mx-auto space-y-12">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

          {/* Brand */}
          <div className="md:col-span-4 space-y-4">
            <a href={SITE_URL} className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6] rounded-2xl shadow-lg shadow-[#6C5CE7]/30 border border-purple-400/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  EarnifyX<span className="text-[#8B5CF6]">Lab</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">Tools • Prompts • Resources</p>
              </div>
            </a>

            <p className="text-slate-400 leading-relaxed text-xs max-w-md">
              Tools, prompts and resources for creators. Build faster, automate workflows, and create high-converting content. This tool, <strong className="text-slate-200">PromptX</strong>, transforms images and videos into detailed AI-ready prompts for <strong className="text-slate-200">Google Veo, Gemini, ChatGPT, Midjourney, FLUX, Stable Diffusion, Kling AI</strong> and <strong className="text-slate-200">Runway</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111827] border border-white/10 rounded-full text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Powered by EarnifyX Lab
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111827] border border-white/10 rounded-full text-[11px] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Safe
              </span>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenSettings}
                className="text-purple-300 hover:text-white font-semibold flex items-center gap-2"
              >
                Configure Gemini API Key
                {hasCustomKey && <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 rounded border border-emerald-500/30">Saved</span>}
              </button>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Platform</h4>
            <ul className="space-y-2 font-medium text-xs">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-purple-300 text-slate-300 transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Resources</h4>
            <ul className="space-y-2 font-medium text-xs">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-purple-300 text-slate-300 transition-colors">{l.label}</a>
                </li>
              ))}
              <li>
                <button onClick={() => onOpenInfoModal('about')} className="hover:text-purple-300 text-slate-300 transition-colors text-left">
                  About PromptX
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Legal & Support</h4>
            <ul className="space-y-2 font-medium text-xs">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-amber-400 text-slate-300 transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Social */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">Community</h4>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#111827] hover:bg-slate-800 border border-white/10 rounded-lg flex items-center justify-between text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg transition-colors ${colorMap[color]} group-hover:text-white`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[11px] text-white">{label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500 animate-pulse" /> by <strong className="text-slate-300 font-semibold">EarnifyX Lab</strong>
          </p>
          <p className="font-mono">
            © 2026 EarnifyX Lab. All Rights Reserved. Hosted on GitHub Pages.
          </p>
        </div>

      </div>
    </footer>
  );
};
