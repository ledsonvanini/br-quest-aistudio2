import React from 'react';
import { LocateFixed, Plus, Minus, Sparkles, GraduationCap } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { SpeechBubbleTooltip } from '../common/SpeechBubbleTooltip';

interface TopRightNavigationDockProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  zoom: number;
  onOpenDailyTips?: () => void;
  dailyTipsUnreadCount?: number;
  onOpenEducatorPortal?: () => void;
}

export const TopRightNavigationDock: React.FC<TopRightNavigationDockProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  zoom,
  onOpenDailyTips,
  dailyTipsUnreadCount,
  onOpenEducatorPortal,
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
          description="Restaura o enquadramento centralizado no pivô da fronteira GO • TO • MT no zoom padrão panorâmico."
          align="right"
        />
      </div>

      {/* 5 Dicas do Dia: Você Sabia? */}
      {onOpenDailyTips && (
        <>
          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />
          <div className="relative group">
            <button
              id="btn-dicas-do-dia-topo-dock"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenDailyTips();
              }}
              className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:text-amber-100 hover:bg-amber-500/35 hover:border-amber-400 flex items-center justify-center transition cursor-pointer group/btn shadow-md relative"
              aria-label="5 Dicas do Dia: Você Sabia?"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover/btn:rotate-12 transition-transform" />
              {dailyTipsUnreadCount !== undefined && dailyTipsUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950 shadow-[0_0_8px_#f59e0b] animate-pulse" />
              )}
            </button>

            <SpeechBubbleTooltip
              title="5 Dicas do Dia: Você Sabia?"
              badge={
                dailyTipsUnreadCount !== undefined && dailyTipsUnreadCount > 0
                  ? `${dailyTipsUnreadCount} Novas Hoje`
                  : '5/5 Concluídas'
              }
              badgeColor={
                dailyTipsUnreadCount && dailyTipsUnreadCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              }
              description="Pílulas de curiosidades geográficas oficiais com bônus de XP e teletransporte imediato."
              align="right"
            />
          </div>
        </>
      )}

      {/* Portal do Educador: BR Quest Edu (BNCC & ENEM) */}
      {onOpenEducatorPortal && (
        <>
          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />
          <div className="relative group">
            <button
              id="btn-abrir-portal-educador"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenEducatorPortal();
              }}
              className="btn-abrir-portal-educador w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:text-amber-100 hover:bg-amber-500/25 hover:border-amber-400 flex items-center justify-center transition cursor-pointer group/btn shadow-md"
              aria-label="BR Quest Edu - Portal do Educador"
            >
              <GraduationCap className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
            </button>

            <SpeechBubbleTooltip
              title="BR Quest Edu"
              badge="BNCC & ENEM"
              badgeColor="bg-amber-500/20 text-amber-300 border-amber-400/40"
              description="Portal do Educador: Trilhas pedagógicas por bioma, acompanhamento de turmas e simulados."
              align="right"
            />
          </div>
        </>
      )}
    </div>
  );
};
