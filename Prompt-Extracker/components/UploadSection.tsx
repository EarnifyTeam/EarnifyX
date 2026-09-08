import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, Image as ImageIcon, AlertCircle, X, Plus, Sparkles, CheckCircle2, Film } from 'lucide-react';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, ALLOWED_TYPES, MAX_BATCH_SIZE } from '../constants';
import { Button } from './Button';

interface UploadSectionProps {
  onFilesSelected: (files: File[]) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempQueue, setTempQueue] = useState<File[]>([]);

  const validateFiles = (files: File[]): File[] => {
    const valid: File[] = [];
    let currentTotal = tempQueue.length;

    for (const file of files) {
      if (currentTotal >= MAX_BATCH_SIZE) {
        setError(`Maximum ${MAX_BATCH_SIZE} items allowed per batch queue.`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Invalid type for "${file.name}". Supported: MP4, MOV, MKV, JPG, PNG, WEBP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`"${file.name}" exceeds max limit of ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }
      valid.push(file);
      currentTotal++;
    }
    return valid;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files) as File[];
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setTempQueue(prev => [...prev, ...validFiles]);
    }
  }, [tempQueue]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files ? Array.from(e.target.files) as File[] : [];
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setTempQueue(prev => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setTempQueue(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleProceed = () => {
    if (tempQueue.length > 0) {
      onFilesSelected(tempQueue);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 animate-fade-in-up px-4">
      <div 
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-8 md:p-12
          transition-all duration-300 ease-out
          flex flex-col items-center justify-center text-center
          glass-card backdrop-blur-2xl
          ${isDragging 
            ? 'border-[#7C4DFF] bg-[#6C5CE7]/10 scale-[1.01] shadow-2xl shadow-[#6C5CE7]/20' 
            : 'border-white/10 hover:border-purple-500/40 hover:bg-[#111827]/90'
          }
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
          ${tempQueue.length > 0 ? 'py-8' : 'py-14'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('.queue-item')) return;
          document.getElementById('fileInput')?.click();
        }}
      >
        <input 
          type="file" 
          id="fileInput" 
          className="hidden" 
          accept="video/*,image/*"
          multiple
          onChange={handleFileInput}
        />
        
        {tempQueue.length === 0 ? (
          <div className="flex flex-col items-center">
            {/* Animated Upload Icon Container */}
            <div className="relative p-6 rounded-2xl mb-6 bg-purple-950/40 border border-purple-500/20 text-[#8B5CF6] group-hover:scale-110 group-hover:border-purple-400/40 transition-all duration-300">
              <UploadCloud className="w-12 h-12 text-[#8B5CF6] group-hover:text-purple-300 transition-colors animate-float" />
              <div className="absolute inset-0 rounded-2xl bg-[#6C5CE7]/10 blur-xl group-hover:bg-[#6C5CE7]/20 transition-all" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Drag & Drop Images or Videos
            </h3>
            
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Upload up to <strong className="text-slate-200">{MAX_BATCH_SIZE} media assets</strong> at once to generate AI prompts for Veo, Gemini, Midjourney, FLUX, and ChatGPT.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Images (JPG, PNG, WEBP)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <Film className="w-3.5 h-3.5 text-blue-400" /> Videos (MP4, MOV, MKV)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                Max {MAX_FILE_SIZE_MB}MB each
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Media Queue ({tempQueue.length}/{MAX_BATCH_SIZE})
                </h3>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setTempQueue([]); }}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear Queue
              </button>
            </div>
            
            {/* Queue Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {tempQueue.map((file, idx) => (
                <div key={idx} className="queue-item relative group/item aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#09090B] shadow-lg">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="w-full h-full object-cover opacity-75 group-hover/item:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-2 text-slate-400">
                      <FileVideo className="w-8 h-8 text-purple-400 mb-1" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Video</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl opacity-0 group-hover/item:opacity-100 transition-all shadow-md hover:scale-110"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/80 backdrop-blur-sm text-[10px] text-white truncate text-center font-mono border-t border-white/10">
                    {file.name}
                  </div>
                </div>
              ))}

              {tempQueue.length < MAX_BATCH_SIZE && (
                <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/50 flex flex-col items-center justify-center bg-white/5 hover:bg-purple-950/20 transition-all group/add">
                  <Plus className="w-6 h-6 text-slate-500 group-hover/add:text-purple-400 transition-colors" />
                  <span className="text-[10px] text-slate-500 group-hover/add:text-slate-300 mt-1">Add More</span>
                </div>
              )}
            </div>

            <Button 
              onClick={(e) => { e.stopPropagation(); handleProceed(); }}
              className="w-full sm:w-auto text-base px-10 py-3.5 shadow-xl shadow-[#6C5CE7]/30"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Prompts ({tempQueue.length} {tempQueue.length === 1 ? 'Asset' : 'Assets'})
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-300 bg-red-950/80 px-4 py-2.5 rounded-xl text-xs border border-red-500/30 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
