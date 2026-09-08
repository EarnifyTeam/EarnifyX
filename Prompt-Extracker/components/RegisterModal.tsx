import React, { useState } from 'react';
import { 
  Mail, 
  User, 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  Lock, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  LogOut 
} from 'lucide-react';
import { UserState } from '../types';
import { registerWithFirebase, loginWithFirebase } from '../services/firebase';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onRegister: (email: string, name?: string) => void;
  onLogout?: () => void;
  reason?: 'limit_reached' | 'manual';
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  userState,
  onRegister,
  onLogout,
  reason = 'manual',
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length > 0 && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    // Try Firebase Authentication
    try {
      if (activeTab === 'register') {
        await registerWithFirebase(trimmedEmail, password, name.trim() || undefined);
        setInfoMessage('Account registered with Firebase! Trial ended, Unlimited Active.');
      } else {
        await loginWithFirebase(trimmedEmail, password);
        setInfoMessage('Logged in with Firebase! Unlimited Active.');
      }
    } catch (fbError: any) {
      console.warn('Firebase Auth note:', fbError.message || fbError);
      if (fbError?.message?.includes('already-in-use')) {
        setError('This email is already registered. Please switch to Login tab.');
        setIsSubmitting(false);
        return;
      }
    }

    // Update user state locally & persist
    onRegister(trimmedEmail, name.trim() || undefined);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C4DFF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header & Badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-gradient-to-tr from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6] text-white rounded-2xl border border-purple-400/30 shadow-lg shadow-purple-950/40">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              {userState.isRegistered ? "PRO Account Dashboard" : "Earnify Labs Portal"}
            </h3>
            <p className="text-xs text-slate-400">
              {userState.isRegistered 
                ? "Your Unlimited PRO Plan is Active" 
                : "Sign In or Register for Free Unlimited Prompts"}
            </p>
          </div>
        </div>

        {/* Reason Alert Banner if limit reached */}
        {!userState.isRegistered && reason === 'limit_reached' && (
          <div className="mb-5 p-3.5 bg-purple-950/80 border border-purple-500/40 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-purple-200">
              <p className="font-bold mb-0.5">Free Trial Limit Reached ({userState.promptsUsed}/{userState.maxFreePrompts} prompts used)</p>
              <p className="text-purple-300/90 leading-relaxed text-[11px]">
                Log in or register your account below to immediately unlock <strong>100% Free Unlimited Prompt Generations</strong>.
              </p>
            </div>
          </div>
        )}

        {/* If user is already logged in */}
        {userState.isRegistered ? (
          <div className="space-y-4">
            <div className="p-6 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-950/50">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 font-mono">
                  Unlimited Subscription Active
                </span>
                <h4 className="text-base font-bold text-white mt-1">{userState.email}</h4>
                {userState.name && <p className="text-xs text-slate-400">Welcome, {userState.name}</p>}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have unrestricted access to generate unlimited AI prompts for Veo, Midjourney, FLUX, Gemini & ChatGPT!
              </p>
            </div>

            <div className="flex gap-3">
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex-1 py-3 px-4 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] hover:brightness-110 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
              >
                Continue Generating
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs for Register vs Login */}
            <div className="flex bg-[#09090B] p-1 rounded-2xl border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register (New Account)</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login (Existing)</span>
              </button>
            </div>

            {/* Benefits box */}
            <div className="mb-5 p-3.5 bg-[#09090B] border border-white/10 rounded-2xl space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Unlimited Prompts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Batch Video Queue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>100% Free Subscription</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>No Credit Card Needed</span>
                </div>
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Full Name <span className="text-slate-500 font-normal lowercase">(optional)</span></span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivers"
                    className="w-full px-4 py-2.5 bg-[#09090B] border border-white/10 focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Email Address <span className="text-red-400">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full px-4 py-2.5 bg-[#09090B] border border-white/10 focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Password <span className="text-slate-500 font-normal lowercase">(optional)</span></span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#09090B] border border-white/10 focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all font-mono"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-xl border border-red-500/30">
                  {error}
                </p>
              )}

              {infoMessage && (
                <p className="text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 font-mono">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> {infoMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#6C5CE7] via-[#7C4DFF] to-[#8B5CF6] hover:brightness-110 active:scale-[0.99] text-white font-extrabold text-xs rounded-xl transition-all shadow-xl shadow-purple-950/50 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> 
                    {activeTab === 'register' ? 'Registration Successful — Unlimited Plan Active!' : 'Login Successful!'}
                  </>
                ) : isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-purple-200" /> Processing...
                  </>
                ) : (
                  <>
                    <span>{activeTab === 'register' ? 'Claim Free Unlimited Subscription' : 'Sign In to Account'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

          </div>
        )}
      </div>
    </div>
  );
};
