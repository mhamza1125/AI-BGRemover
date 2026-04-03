import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, Layers, AlertCircle, Trash2, ImageIcon } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { cn } from './lib/utils';

export default function App() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelection(file);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleImageSelection = async (file: File) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setProcessedUrl(null);
    setError(null);
    setProgress(0);

    // Auto-trigger processing
    setIsProcessing(true);
    const config: any = {
      device: 'gpu',
      progress: (_key: string, progress: number, total: number) => {
        const percent = Math.round((progress / (total || progress + 1)) * 100);
        setProgress(percent);
      },
    };

    try {
      const blob = await removeBackground(file, config);
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (err: any) {
      console.error('BG Removal Error:', err);
      try {
        const fallbackConfig = { ...config, device: 'cpu' };
        const blob = await removeBackground(file, fallbackConfig);
        const url = URL.createObjectURL(blob);
        setProcessedUrl(url);
      } catch (fallbackErr) {
        setError('An error occurred during processing. Please try with a smaller image.');
      }
    } finally {
      setIsProcessing(false);
    }
  };


  const downloadResult = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `removed-bg-${originalFile?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 px-6 bg-grid">
      {/* Header */}
      <header className="max-w-4xl w-full mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100/50">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">BG<span className="text-indigo-600">Pro</span></h1>
        </div>
        <p className="text-slate-500 text-base max-w-lg mx-auto font-medium leading-relaxed">
          Pro-grade image background removal powered by AI.
          Everything stays local — your images never leave your browser.
        </p>
      </header>

      <main className="max-w-6xl w-full">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Left Column: Input */}
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Input Image</h2>
              {originalUrl && (
                <button onClick={reset} className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> CLEAR
                </button>
              )}
            </div>
            {!originalUrl ? (
              <div
                className={cn(
                  "relative group cursor-pointer",
                  "h-[400px] rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white/40 hover:bg-white/80 hover:border-indigo-400 transition-all duration-500",
                  "flex flex-col items-center justify-center p-8 text-center glass-card"
                )}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mb-4 p-4 bg-indigo-50 rounded-2xl group-hover:scale-105 transition-all duration-500 shadow-inner">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">Drop your image</h3>
                <p className="text-slate-400 mb-6 max-w-[240px] text-xs font-medium">PNG, JPG or WebP images.</p>

                <button className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-xl transition-all">
                  Choose Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelection(file);
                  }}
                />
              </div>
            ) : (
              <div className="glass-card rounded-[1.5rem] overflow-hidden p-4 bg-white h-[400px]">
                <div className="relative rounded-[1.5em] overflow-hidden bg-slate-50 h-full group">
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <p className="text-white font-bold text-sm">IMAGE READY</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Output / Processing */}
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Result View</h2>
              {processedUrl && (
                <button
                  onClick={downloadResult}
                  className="text-[11px] font-black text-indigo-600 bg-white border border-indigo-100 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3 h-3" /> DOWNLOAD
                </button>
              )}
            </div>
            <div className={cn(
              "h-[400px] glass-card rounded-[1.5rem] relative overflow-hidden flex flex-col",
              !processedUrl && !isProcessing && "bg-slate-100/50 border-none shadow-none"
            )}>
              {!processedUrl && !isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 grayscale saturate-0 animate-pulse">
                  <div className="p-8 bg-slate-200 rounded-full mb-6">
                    <ImageIcon className="w-16 h-16 text-slate-400" />
                  </div>
                  <p className="font-bold tracking-widest text-slate-500">READY FOR OUTPUT</p>
                </div>
              ) : isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/40">
                  <div className="relative w-40 h-40 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div
                      className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent transition-all duration-300 transform -rotate-90"
                      style={{ clipPath: `conic-gradient(white 0deg, white ${360 * (progress / 100)}deg, transparent ${360 * (progress / 100)}deg)` }}
                    ></div>
                    <div className="absolute inset-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex flex-col items-center justify-center p-4">
                      <span className="text-3xl font-black text-indigo-600 tabular-nums">{progress}%</span>
                      <span className="text-[9px] uppercase font-black text-indigo-400 mt-1 tracking-widest">Analying</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-center max-w-xs font-bold text-[10px] tracking-widest uppercase">Processing Local AI</p>
                </div>
              ) : (
                <div className="flex-1 p-6 bg-white/40">
                  <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden checkerboard shadow-inner border border-slate-100/50">
                    <img
                      src={processedUrl!}
                      alt="Processed"
                      className="w-full h-full object-contain relative z-10 animate-in zoom-in-95 duration-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {processedUrl && (
              <button
                onClick={reset}
                className="w-full py-3 bg-white border border-slate-200 text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center underline decoration-dotted"
              >
                TRY ANOTHER ONE
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 pb-2 text-slate-400 text-[10px] flex flex-col items-center gap-4 border-t border-slate-100 w-full pt-8">
        <p className="font-medium opacity-50 uppercase tracking-widest text-[9px]">© 2026 BGPro AI • Local Processing</p>
      </footer>
    </div>
  );
}
