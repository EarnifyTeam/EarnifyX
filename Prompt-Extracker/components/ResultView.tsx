import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Terminal, 
  Trash2, 
  CheckCircle2, 
  Film, 
  FileText,
  Share2
} from 'lucide-react';
import { BreakdownResult, ImageMetadata } from '../types';
import { Button } from './Button';

interface ResultViewProps {
  results: BreakdownResult[];
  imagesMeta: ImageMetadata[];
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ results, imagesMeta, onReset }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyOne = (id: string, title: string, prompt: string) => {
    const fullText = `Title: ${title}\nPrompt: ${prompt}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = results.map((r, i) => `=== PROMPT #${i + 1}: ${r.title} ===\n${r.prompt}`).join('\n\n' + '='.repeat(40) + '\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadAll = () => {
    const content = results
      ? results.map((r, i) => `PROMPT #${i + 1}\nTitle: ${r.title}\n\nPrompt:\n${r.prompt}`).join('\n\n' + '='.repeat(50) + '\n\n')
      : '';
    const blob = new Blob([`# PromptX Generated AI Prompts\n# Powered by Earnify Labs\n# Generated: ${new Date().toLocaleString()}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PromptX_AI_Prompts_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up pb-12 px-4">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 p-6 glass-card rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#7C4DFF] text-white shadow-lg shadow-[#6C5CE7]/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              Generated AI Prompts
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {results.length} {results.length === 1 ? 'Prompt' : 'Prompts'} Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">Ready for Veo, Midjourney, FLUX, ChatGPT & Gemini</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="secondary" onClick={handleCopyAll} className="py-2 px-4 text-xs">
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5 text-purple-400" />}
            {copiedAll ? 'Copied All!' : 'Copy All'}
          </Button>
          
          <Button variant="outline" onClick={handleDownloadAll} className="py-2 px-4 text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-300" />
            Download .TXT
          </Button>

          <Button variant="danger" onClick={onReset} className="py-2 px-4 text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear & Restart
          </Button>
        </div>
      </div>

      {/* Prompts Output Cards */}
      <div className="space-y-8">
        {results.map((res, index) => {
          const meta = imagesMeta.find(m => m.id === res.imageId);
          return (
            <div key={res.imageId} className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-purple-500/30">
              
              {/* Card Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#09090B]/90 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#7C4DFF] text-[11px] font-bold text-white font-mono shadow-md">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-slate-200 truncate max-w-[200px] md:max-w-md font-mono">
                      {meta?.name || `Prompt_Asset_${index + 1}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleCopyOne(res.imageId, res.title, res.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                  >
                    {copiedId === res.imageId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                    <span>{copiedId === res.imageId ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Thumbnail / Media Preview */}
                  {meta?.objectUrl && (
                    <div className="w-full md:w-1/4 flex-shrink-0">
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#09090B] aspect-square shadow-inner relative group">
                        {meta.type.startsWith('image/') ? (
                          <img 
                            src={meta.objectUrl} 
                            alt="Source"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center">
                            <Film className="w-10 h-10 text-purple-400 mb-2" />
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Video Asset</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] text-slate-300 font-mono border border-white/10">
                          {(meta.size / (1024 * 1024)).toFixed(1)} MB
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prompt Output Code Block */}
                  <div className="flex-1 space-y-4 min-w-0">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold font-mono">
                        Generated Scene Concept
                      </span>
                      <h2 className="text-lg font-bold text-white mt-0.5 leading-snug">{res.title}</h2>
                    </div>
                    
                    {/* Code Editor Styled Prompt Box */}
                    <div className="relative group/code">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-t border-x border-white/10 rounded-t-xl text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>AI-Ready Prompt Text</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">Veo</span>
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">Midjourney</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">FLUX</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-b-xl bg-[#09090B] border border-white/10 text-slate-200 leading-relaxed text-xs md:text-sm font-mono overflow-x-auto max-h-[320px] scrollbar-thin select-all">
                        <p className="whitespace-pre-wrap">{res.prompt}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
          variant="primary" 
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3.5 shadow-xl shadow-[#6C5CE7]/25"
        >
          <RotateCcw className="w-4 h-4" />
          Generate New Batch
        </Button>
      </div>
    </div>
  );
};
