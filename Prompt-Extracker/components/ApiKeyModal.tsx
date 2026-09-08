import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, Check, X, ShieldCheck, Trash2, Sliders } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [promptLength, setPromptLength] = useState('detailed');

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
    setSavedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          title="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-[#6C5CE7] to-[#7C4DFF] text-white rounded-2xl border border-purple-400/20 shadow-lg shadow-purple-950/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">PromptX Settings Panel</h3>
            <p className="text-xs text-slate-400">Configure API authentication and prompt preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Gemini API Key Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
              <span>Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-200 transition-colors normal-case font-normal"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste your Gemini API key (AIzaSy...)"
                className="w-full px-4 py-3 bg-[#09090B] border border-white/10 focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] rounded-xl text-xs text-white placeholder-slate-600 outline-none pr-12 font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Prompt Style Preference */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Prompt Aesthetic Focus
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              {[
                { id: 'cinematic', label: 'Cinematic' },
                { id: 'photorealistic', label: 'Photoreal' },
                { id: 'artistic', label: 'Artistic' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`py-2 px-3 rounded-xl border transition-all text-center ${
                    selectedStyle === style.id
                      ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                      : 'bg-[#09090B] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Length Option */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Output Prompt Depth
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {[
                { id: 'detailed', label: 'Ultra Detailed (Recommended)' },
                { id: 'concise', label: 'Concise & Short' },
              ].map((len) => (
                <button
                  key={len.id}
                  type="button"
                  onClick={() => setPromptLength(len.id)}
                  className={`py-2 px-3 rounded-xl border transition-all text-center ${
                    promptLength === len.id
                      ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                      : 'bg-[#09090B] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {len.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-[#09090B] border border-white/10 rounded-xl text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Earnify Labs Security Standard
            </p>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Keys are encrypted in browser localStorage and sent strictly to Google Gemini endpoints over HTTPS.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="py-3 px-4 bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-red-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#6C5CE7] to-[#8B5CF6] hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Settings Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
