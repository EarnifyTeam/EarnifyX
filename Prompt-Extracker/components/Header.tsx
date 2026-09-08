import React, { useState } from 'react';
import { Sparkles, Settings, Check, Zap, Menu, X, ChevronDown } from 'lucide-react';
import { UserState } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  hasCustomKey: boolean;
  userState: UserState;
  onOpenRegisterModal: () => void;
}

const SITE_URL = 'https://earnifyxlab.in';

const NAV_LINKS = [
  { label: '🧩 Extensions', href: `${SITE_URL}/extensions/` },
  { label: '💻 Software', href: `${SITE_URL}/software/` },
  { label: '🧠 Prompt Bhandar', href: `${SITE_URL}/prompts/` },
  { label: '📦 Resources', href: `${SITE_URL}/resources/` },
];

const MORE_LINKS = [
  { label: '🤖 AI Tools Directory', href: `${SITE_URL}/ai-tools/` },
  { label: '⚡ Automation Tools', href: `${SITE_URL}/automation/` },
  { label: '🎬 Creator Tools', href: `${SITE_URL}/creator-tools/` },
  { label: '📝 Blog Posts', href: `${SITE_URL}/blog/` },
  { label: '📚 Tutorials & Guides', href: `${SITE_URL}/tutorials/` },
  { label: '📥 Downloads', href: `${SITE_URL}/downloads/` },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  hasCustomKey,
  userState,
  onOpenRegisterModal,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const remainingFree = Math.max(0, userState.maxFreePrompts - userState.promptsUsed);

  return (
    <header className="w-full border-b border-white/10 bg-[#09090B]/80 backdrop-blur-xl sticky top-0 z-50">
      {/* Top brand bar — same nav system as earnifyxlab.in */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 md:px-8 py-3">
        <a href={SITE_URL} className="flex items-center gap-3 shrink-0 group">
          <div className="relative p-2 bg-gradient-to-tr from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6] rounded-xl shadow-lg shadow-[#6C5CE7]/30 border border-purple-400/30">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-white">
              EarnifyX<span className="text-[#8B5CF6]">Lab</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Tools • Prompts • Resources</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
              More <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 pt-2 w-56">
                <div className="bg-[#111116] border border-white/10 rounded-xl shadow-2xl p-2">
                  {MORE_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`${SITE_URL}/login/`}
            className="hidden md:inline-block px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </a>
          <a
            href={`${SITE_URL}/register/`}
            className="hidden md:inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] text-white shadow-lg shadow-[#6C5CE7]/30 hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 py-3 space-y-1 bg-[#09090B]">
          {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <a href={`${SITE_URL}/login/`} className="flex-1 text-center px-3 py-2 rounded-lg border border-white/10 text-xs font-semibold text-slate-200">Login</a>
            <a href={`${SITE_URL}/register/`} className="flex-1 text-center px-3 py-2 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] text-xs font-bold text-white">Get Started</a>
          </div>
        </div>
      )}

      {/* App sub-bar — PromptX tool identity & actions */}
      <div className="w-full border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-8 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-white">
              Prompt<span className="text-[#8B5CF6]">X</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
              Earnify Labs
            </span>
            <span className="hidden sm:inline text-[11px] text-slate-500">AI Image & Video Prompt Generator</span>
          </div>

          <div className="flex items-center gap-2.5">
            {userState.isRegistered ? (
              <button
                onClick={onOpenRegisterModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 transition-all text-xs font-bold"
                title={`Registered as ${userState.email} — Unlimited Access`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">PRO Unlimited</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200 border border-emerald-500/30 font-mono">
                  Active
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenRegisterModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/40 text-purple-200 hover:text-white transition-all text-xs font-semibold group"
                title="Click to register email for Unlimited Subscription"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300 group-hover:rotate-12 transition-transform" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-200">
                    Trial: <span className="text-purple-300">{remainingFree}/{userState.maxFreePrompts} Prompts</span>
                  </span>
                  <span className="hidden md:inline-block text-[10px] bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    Register
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 active:scale-95 ${
                hasCustomKey
                  ? 'bg-purple-950/80 text-purple-200 border-purple-500/50 hover:bg-purple-900/80'
                  : 'bg-[#111827] text-slate-200 border-white/10 hover:border-purple-500/40 hover:text-white'
              }`}
              title="Configure API Key & Preferences"
            >
              <Settings className="w-4 h-4 text-[#8B5CF6]" />
              <span className="hidden md:inline">Settings</span>
              {hasCustomKey ? (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">
                  <Check className="w-3 h-3" /> Key
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Custom Key Optional" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
