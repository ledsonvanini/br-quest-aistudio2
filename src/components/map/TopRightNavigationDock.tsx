import React from 'react';
import { LocateFixed, Plus, Minus } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { SpeechBubbleTooltip } from '../common/SpeechBubbleTooltip';

interface TopRightNavigationDockProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  zoom: number;
}

export const TopRightNavigationDock: React.FC<TopRightNavigationDockProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  zoom,
}) => {
  return (
    <div
      id="dock-navegacao-zoom-topo-direita"
      className="dock-navegacao-zoom-topo-direita fixed top-2 sm:top-3 right-2 sm:right-4 z-50 flex items-center gap-1 bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-1 shadow-2xl shadow-black/90 pointer-events-auto select-none font-sans"
    >
      {/* Zoom In */}
      <div className="relative group">
        <button
          id="btn-zoom-in-topo"
          onClick={() => {
            audioEngine.playSfx('click');
            onZoomIn();
          }}
          className="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 hover:text-amber-200 hover:bg-slate-800 hover:border-amber-400/50 flex items-center justify-center transition cursor-pointer font-black"
          aria-label="Aproximar Zoom"
        >
          <Plus className="w-4 h-4" />
        </button>

        <SpeechBubbleTooltip
          title="Aproximar Câmera"
          badge={`${Math.round(zoom * 100)}%`}
          description="Aumenta a aproximação visual do relevo e das cidades do Brasil."
          align="right"
        />
      </div>

      {/* Zoom Out */}
      <div className="relative group">
        <button
          id="btn-zoom-out-topo"
          onClick={() => {
            audioEngine.playSfx('click');
            onZoomOut();
          }}
          className="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 hover:text-amber-200 hover:bg-slate-800 hover:border-amber-400/50 flex items-center justify-center transition cursor-pointer font-black"
          aria-label="Afastar Zoom"
        >
          <Minus className="w-4 h-4" />
        </button>

        <SpeechBubbleTooltip
          title="Afastar Câmera"
          badge={`${Math.round(zoom * 100)}%`}
          description="Amplia o campo de visão panorâmico de todo o continente sul-americano."
          align="right"
        />
      </div>

      {/* Divisor Vertical */}
      <div className="h-5 w-[1px] bg-slate-800 shrink-0" />

      {/* Centralizar Brasil (Pivô Fronteira GO • TO • MT) */}
      <div className="relative group">
        <button
          id="btn-centralizar-brasil-topo"
          onClick={() => {
            audioEngine.playSfx('click');
            onResetView();
          }}
          className="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400 hover:text-amber-200 hover:bg-slate-800 hover:border-amber-400/50 flex items-center justify-center transition cursor-pointer group/btn"
          aria-label="Centralizar Brasil"
        >
          <LocateFixed className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
        </button>

        <SpeechBubbleTooltip
          title="Centralizar no Brasil"
          badge="Pivô GO-TO-MT"
          badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
          description="Restaura a visão centralizada no pivô da fronteira GO • TO • MT com zoom ampliado."
          align="right"
        />
      </div>
    </div>
  );
};
