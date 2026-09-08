import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { UploadSection } from './components/UploadSection';
import { ProcessingView } from './components/ProcessingView';
import { ResultView } from './components/ResultView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { InfoModal, InfoTab } from './components/InfoModal';
import { RegisterModal } from './components/RegisterModal';
import { Button } from './components/Button';
import { AppStep, BreakdownResult, ProcessingState, ImageMetadata, UserState } from './types';
import { fileToGenerativePart, generateBreakdown } from './services/geminiService';
import { Wand2, Clock, Sparkles, AlertTriangle, Film, Zap, Lock, Mail } from 'lucide-react';
import { auth, onAuthStateChanged } from './services/firebase';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [imagesMeta, setImagesMeta] = useState<ImageMetadata[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({ 
    progress: 0, 
    message: '', 
    currentCount: 0, 
    totalCount: 0 
  });
  const [results, setResults] = useState<BreakdownResult[]>([]);
  
  // Custom API Key Management
  const [customApiKey, setCustomApiKey] = useState<string>(
    () => localStorage.getItem('gemini_api_key') || ''
  );
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [infoModalTab, setInfoModalTab] = useState<InfoTab | null>(null);

  // User & Registration State (10 free trial prompts max)
  const [userState, setUserState] = useState<UserState>(() => {
    const savedEmail = localStorage.getItem('promptx_user_email');
    const savedName = localStorage.getItem('promptx_user_name');
    const savedIsRegistered = localStorage.getItem('promptx_is_registered') === 'true';
    const savedPromptsUsed = parseInt(localStorage.getItem('promptx_prompts_used') || '0', 10);

    return {
      isRegistered: savedIsRegistered || !!savedEmail,
      email: savedEmail || null,
      name: savedName || null,
      promptsUsed: isNaN(savedPromptsUsed) ? 0 : savedPromptsUsed,
      maxFreePrompts: 10,
    };
  });

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [registerReason, setRegisterReason] = useState<'limit_reached' | 'manual'>('manual');

  const handleRegister = (email: string, name?: string) => {
    localStorage.setItem('promptx_user_email', email);
    if (name) localStorage.setItem('promptx_user_name', name);
    localStorage.setItem('promptx_is_registered', 'true');

    setUserState(prev => ({
      ...prev,
      isRegistered: true,
      email: email,
      name: name || prev.name,
    }));
  };

  const handleLogout = async () => {
    localStorage.removeItem('promptx_user_email');
    localStorage.removeItem('promptx_user_name');
    localStorage.removeItem('promptx_is_registered');

    try {
      const { logoutFromFirebase } = await import('./services/firebase');
      await logoutFromFirebase();
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }

    setUserState(prev => ({
      ...prev,
      isRegistered: false,
      email: null,
      name: null,
    }));
  };

  const incrementPromptsUsed = (count: number = 1) => {
    setUserState(prev => {
      if (prev.isRegistered) return prev; // Unlimited for registered users
      const newUsed = prev.promptsUsed + count;
      localStorage.setItem('promptx_prompts_used', newUsed.toString());
      return {
        ...prev,
        promptsUsed: newUsed,
      };
    });
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState(prev => ({
          ...prev,
          isRegistered: true,
          email: user.email || prev.email,
          name: user.displayName || prev.name,
        }));
        localStorage.setItem('promptx_is_registered', 'true');
        if (user.email) localStorage.setItem('promptx_user_email', user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      imagesMeta.forEach(img => {
        if (img.objectUrl) URL.revokeObjectURL(img.objectUrl);
      });
    };
  }, [imagesMeta]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setStep(AppStep.PREPARING);
    setProcessingState({ 
      progress: 0, 
      message: 'Preparing media pipeline...', 
      currentCount: 0, 
      totalCount: files.length 
    });

    try {
      const prepared: ImageMetadata[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingState(prev => ({ 
          ...prev, 
          progress: ((i + 1) / files.length) * 100, 
          message: `Reading ${file.name}...` 
        }));
        
        const part = await fileToGenerativePart(file);
        prepared.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          base64Data: part.inlineData.data,
          objectUrl: URL.createObjectURL(file)
        });
      }

      setImagesMeta(prepared);
      setStep(AppStep.READY_TO_GENERATE);
    } catch (error) {
      console.error("Error preparing files", error);
      alert("Failed to prepare files. Please try again.");
      setStep(AppStep.UPLOAD);
    }
  }, []);

  const handleGenerateClick = async () => {
    if (imagesMeta.length === 0) return;

    const totalToGenerate = imagesMeta.length;

    // Check trial limit for unregistered users
    if (!userState.isRegistered) {
      const remaining = Math.max(0, userState.maxFreePrompts - userState.promptsUsed);
      if (remaining <= 0 || totalToGenerate > remaining) {
        setRegisterReason('limit_reached');
        setIsRegisterModalOpen(true);
        return;
      }
    }

    setStep(AppStep.ANALYZING);
    const total = imagesMeta.length;
    const finalResults: BreakdownResult[] = [];

    for (let i = 0; i < total; i++) {
      const currentAsset = imagesMeta[i];
      setProcessingState({
        progress: 10,
        message: `Analyzing: ${currentAsset.name}`,
        currentCount: i + 1,
        totalCount: total
      });

      const progressInterval = setInterval(() => {
        setProcessingState(prev => {
          if (prev.progress >= 90) return prev;
          return { ...prev, progress: prev.progress + (Math.random() * 10) };
        });
      }, 500);

      try {
        if (currentAsset.base64Data) {
          const result = await generateBreakdown(
            currentAsset.id, 
            currentAsset.base64Data, 
            currentAsset.type,
            customApiKey
          );
          finalResults.push(result);
          // Record successful prompt generation for trial counter
          incrementPromptsUsed(1);
        }
      } catch (error: any) {
        console.error(`Error analyzing asset ${i + 1}`, error);
        const isQuota = error?.message?.toLowerCase().includes("quota") || error?.message?.includes("429");
        finalResults.push({
          imageId: currentAsset.id,
          title: isQuota ? "Quota Limit Hit" : "Analysis Failed",
          prompt: isQuota 
            ? "This item was skipped because the API quota was exceeded even after multiple retry attempts. High-volume video processing requires longer breaks." 
            : (error?.message || "The AI was unable to process this content. It might be due to safety filters or temporary availability issues.")
        });
      } finally {
        clearInterval(progressInterval);
        
        // Extended Throttle: 4-second delay between items to prevent hitting burst rate limits
        if (i < total - 1) {
          setProcessingState(prev => ({
            ...prev,
            progress: 100,
            message: `Wait... API Cooldown (Protecting Quotas)`
          }));
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }
    }

    setResults(finalResults);
    setStep(AppStep.RESULT);
  };

  const handleReset = () => {
    imagesMeta.forEach(img => {
      if (img.objectUrl) URL.revokeObjectURL(img.objectUrl);
    });
    setImagesMeta([]);
    setResults([]);
    setProcessingState({ progress: 0, message: '', currentCount: 0, totalCount: 0 });
    setStep(AppStep.UPLOAD);
  };

  const remainingFree = Math.max(0, userState.maxFreePrompts - userState.promptsUsed);

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-white selection:bg-[#7C4DFF]/30 selection:text-white antialiased">
      <Header 
        onOpenSettings={() => setIsKeyModalOpen(true)}
        hasCustomKey={!!customApiKey}
        userState={userState}
        onOpenRegisterModal={() => {
          setRegisterReason('manual');
          setIsRegisterModalOpen(true);
        }}
      />
      
      <main className="flex-1 flex flex-col items-center pb-12 w-full">
        
        {step === AppStep.UPLOAD && (
          <>
            <HeroSection />
            <UploadSection onFilesSelected={handleFilesSelected} />
            <FeaturesSection />
          </>
        )}

        {(step === AppStep.PREPARING || step === AppStep.ANALYZING) && (
          <ProcessingView step={step} state={processingState} />
        )}

        {step === AppStep.READY_TO_GENERATE && imagesMeta.length > 0 && (
          <div className="w-full max-w-4xl mx-auto my-12 px-4 animate-fade-in text-center">
             <div className="p-8 md:p-10 rounded-3xl glass-card border border-white/10 mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Ready for AI Vision Processing
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                  Batch Queue Staged ({imagesMeta.length} Assets)
                </h2>
                <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
                  PromptX will process your media with smart rate-limiting to prevent Gemini API quota bottlenecks.
                </p>

                {/* Trial status banner in staged view */}
                {!userState.isRegistered && (
                  <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 max-w-lg mx-auto flex items-center justify-between text-xs text-purple-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <span>Free Trial: <strong>{remainingFree} of 5 prompts remaining</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setRegisterReason('manual');
                        setIsRegisterModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-white bg-gradient-to-r from-[#6C5CE7] to-[#7C4DFF] hover:brightness-110 px-3 py-1 rounded-lg transition-all"
                    >
                      Register for Unlimited
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                  {imagesMeta.map(img => (
                    <div key={img.id} className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#09090B] group relative shadow-lg">
                      {img.type.startsWith('image/') ? (
                        <img src={img.objectUrl} alt="prev" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2">
                          <Film className="w-8 h-8 text-purple-400 mb-1" />
                          <span className="text-[10px] text-slate-300 font-bold uppercase">Video</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#6C5CE7]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider bg-black/80 px-2 py-0.5 rounded-md border border-white/20">Staged</span>
                      </div>
                    </div>
                  ))}
                </div>

                {imagesMeta.length > 2 && (
                  <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-2xl mb-8 flex items-start gap-3 text-left">
                    <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      <strong>Rate Limit Protection:</strong> Sequential analysis of {imagesMeta.length} items will take approx. {Math.max(1, Math.round((imagesMeta.length * 6) / 60))} minute(s). PromptX incorporates mandatory cooldown pauses between assets.
                    </p>
                  </div>
                )}
                
                <Button onClick={handleGenerateClick} className="w-full sm:w-auto text-base px-10 py-4 shadow-xl shadow-[#6C5CE7]/30">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Start AI Prompt Synthesis
                </Button>
             </div>
             
             <button onClick={handleReset} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
               Cancel and reset queue
             </button>
          </div>
        )}

        {step === AppStep.RESULT && results.length > 0 && (
          <ResultView 
            results={results} 
            imagesMeta={imagesMeta} 
            onReset={handleReset} 
          />
        )}

      </main>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={customApiKey}
        onSaveKey={handleSaveApiKey}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        userState={userState}
        onRegister={handleRegister}
        onLogout={handleLogout}
        reason={registerReason}
      />

      <InfoModal
        isOpen={infoModalTab !== null}
        onClose={() => setInfoModalTab(null)}
        initialTab={infoModalTab || 'about'}
      />

      <Footer
        onOpenInfoModal={(tab) => setInfoModalTab(tab)}
        onOpenSettings={() => setIsKeyModalOpen(true)}
        hasCustomKey={!!customApiKey}
      />
    </div>
  );
};

export default App;
