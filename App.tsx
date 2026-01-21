
import React, { useState } from 'react';
import { comfyService } from './services/comfyService';
import { 
  ImageIcon, 
  Send, 
  Loader2, 
  Download, 
  AlertCircle,
  Zap,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setStatusMessage('Connecting to ComfyUI...');

    try {
      const promptId = await comfyService.submitPrompt(prompt);
      setStatusMessage('Generating image...');
      const url = await comfyService.waitForImage(promptId);
      setImageUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation failed. Check connection.');
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `SD-Image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="h-16 flex items-center justify-center px-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Stable Diffusion Image
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full gap-8">
        
        {/* Error Alert */}
        {error && (
          <div className="w-full max-w-2xl flex items-center gap-3 text-red-400 bg-red-950/20 border border-red-900/50 p-4 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Display Box */}
        <div className="relative w-full aspect-square max-w-[512px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/50 group">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
              <div className="relative">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                <Sparkles className="absolute -top-1 -right-1 text-indigo-300 animate-pulse" size={16} />
              </div>
              <p className="text-indigo-400 font-medium tracking-wide animate-pulse">{statusMessage}</p>
            </div>
          ) : null}

          {imageUrl ? (
            <>
              <img 
                src={imageUrl} 
                alt="Generated output" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={downloadImage}
                className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                title="Download Image"
              >
                <Download size={20} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
              <div className="bg-slate-800/50 p-6 rounded-full mb-4 border border-slate-700/50">
                <ImageIcon size={48} className="text-slate-600" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Waiting for prompt</p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-2xl px-2">
          <form 
            onSubmit={handleGenerate}
            className="flex flex-col gap-4"
          >
            <div className="relative group bg-slate-900 border border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all rounded-2xl p-2 shadow-xl">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Describe what you want to see..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 min-h-[100px] text-lg text-slate-100 placeholder:text-slate-600"
              />
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  <Sparkles size={12} className="text-indigo-500" />
                  SDXL Turbo Mode
                </div>
                <button 
                  disabled={isGenerating || !prompt.trim()}
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 ${
                    isGenerating || !prompt.trim()
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <span>Generate</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-700 font-medium uppercase tracking-tighter">
              Press Enter to trigger generation
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center text-[10px] text-slate-800 font-bold uppercase tracking-[0.2em] border-t border-slate-900/50">
        ComfyUI Backend • 512x512 • 1-Step Sampling
      </footer>
    </div>
  );
};

export default App;
