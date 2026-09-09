/**
 * Globe Loading Progress & Cache Indicator
 * Subtle, non-intrusive progress notification while high-res assets stream in
 */
import React, { useState, useEffect } from 'react';
import { GlobePreloadProgress } from '../../lib/globeEngine';
import { Sparkles } from 'lucide-react';

interface GlobeLoadingProgressProps {
  progress: GlobePreloadProgress;
}

export const GlobeLoadingProgress: React.FC<GlobeLoadingProgressProps> = ({ progress }) => {
  const [visible, setVisible] = useState<boolean>(true);

  // Auto-dismiss floating indicator after 4 seconds as requested
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || progress.isReady || progress.percent >= 100) return null;

  return (
    <div
      id="barra-progresso-preload-globo"
      className="barra-progresso-preload-globo absolute top-6 right-6 z-30 flex items-center gap-3 py-1.5 px-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-sky-500/20 text-white shadow-lg pointer-events-none select-none text-xs transition-opacity duration-700 animate-in fade-in"
    >
      <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3 text-[10px] text-slate-300">
          <span className="truncate max-w-[140px]">{progress.currentAsset || 'Otimizando texturas...'}</span>
          <span className="font-mono text-sky-400 font-semibold">{progress.percent}%</span>
        </div>
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
