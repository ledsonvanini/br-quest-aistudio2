import React, { useState } from 'react';
import { Plus, Minus, GraduationCap, Navigation, Search, Loader2, LocateFixed } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { SpeechBubbleTooltip } from '../common/SpeechBubbleTooltip';
import { requestUserGeolocation } from '../../services/geolocationService';

interface TopRightNavigationDockProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  zoom: number;
  onOpenDailyTips?: () => void;
  dailyTipsUnreadCount?: number;
  onOpenEducatorPortal?: () => void;
  onOpenSearchSelector?: () => void;
  onStateLocated?: (stateId: string, stateName: string, regionId?: string) => void;
  onNotification?: (msg: string) => void;
}

export const TopRightNavigationDock: React.FC<TopRightNavigationDockProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  zoom,
  onOpenDailyTips,
  dailyTipsUnreadCount,
  onOpenEducatorPortal,
  onOpenSearchSelector,
  onStateLocated,
  onNotification,
}) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateUser = async () => {
    audioEngine.playSfx('click');
    setIsLocating(true);
    try {
      const result = await requestUserGeolocation();
      audioEngine.playSfx('travel');
      onNotification?.(`📍 Localizado: ${result.stateName} (${result.detectedStateId})`);
      if (onStateLocated) {
        onStateLocated(result.detectedStateId, result.stateName, result.regionId);
      } else {
        onResetView();
      }
    } catch (err: any) {
      onNotification?.(err?.message || 'Geolocalização não autorizada. Centralizando no Brasil.');
      onResetView();
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div
      id="dock-navegacao-zoom-topo-direita"
      className="dock-navegacao-zoom-topo-direita fixed top-2 sm:top-3 right-2 sm:right-4 z-50 flex items-center gap-1 bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-1 shadow-2xl shadow-black/90 pointer-events-auto select-none font-sans"
    >
      {/* Botão de Busca Rápida (Ctrl+K) */}
      {onOpenSearchSelector && (
        <>
          <div className="relative group">
            <button
              id="btn-abrir-pesquisa-topo"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenSearchSelector();
              }}
              className="btn-abrir-pesquisa-topo w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:text-amber-100 hover:bg-amber-500/25 hover:border-amber-400 flex items-center justify-center transition cursor-pointer group/btn shadow-sm"
              aria-label="Buscar Estados e Guardiões (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
            </button>

            <SpeechBubbleTooltip
              title="Buscar Estados & Guardiões"
              badge="Ctrl+K"
              badgeColor="bg-amber-500/25 text-amber-200 border-amber-400/50"
              description="Abre o menu seletor estilizado para localizar e viajar para qualquer uma das 27 UFs."
              align="right"
            />
          </div>
          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />
        </>
      )}

      {/* Zoom In */}
      <div className="relative group">
        <button
          id="btn-zoom-in-topo"
          type="button"
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
          type="button"
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

      {/* Centralizar Mapa Brasil */}
      <div className="relative group">
        <button
          id="btn-centralizar-brasil-topo"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            onResetView();
          }}
          className="btn-centralizar-brasil-topo w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-300 hover:text-amber-200 hover:bg-slate-800 hover:border-amber-400/50 flex items-center justify-center transition cursor-pointer group/btn"
          aria-label="Centralizar Mapa Brasil"
        >
          <LocateFixed className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
        </button>

        <SpeechBubbleTooltip
          title="Centralizar Mapa Brasil"
          badge="DF / Centro"
          badgeColor="bg-sky-500/20 text-sky-300 border-sky-400/40"
          description="Restaura a visão panorâmica central do território brasileiro."
          align="right"
        />
      </div>

      {/* Minha Geolocalização (GPS) */}
      <div className="relative group">
        <button
          id="btn-geolocalizacao-usuario"
          type="button"
          onClick={handleLocateUser}
          disabled={isLocating}
          className="btn-geolocalizacao-usuario w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 hover:text-emerald-200 hover:bg-slate-800 hover:border-emerald-400/50 flex items-center justify-center transition cursor-pointer group/btn relative"
          aria-label="Minha Geolocalização"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 group-hover/btn:-rotate-45 transition-transform" />
          )}
        </button>

        <SpeechBubbleTooltip
          title="Minha Geolocalização"
          badge="GPS / Navegador"
          badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
          description="Solicita permissão ao navegador para aproximar e focar diretamente no seu estado de origem."
          align="right"
        />
      </div>

      {/* Portal do Educador: BR Quest Edu (BNCC & ENEM) */}
      {onOpenEducatorPortal && (
        <>
          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />
          <div className="relative group">
            <button
              id="btn-abrir-portal-educador"
              type="button"
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
              description="Portal do Educador: Trilhas pedagógicas por bioma, turmas e simulados."
              align="right"
            />
          </div>
        </>
      )}
    </div>
  );
};


