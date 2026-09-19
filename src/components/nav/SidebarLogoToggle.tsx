import React from 'react';
import { Map, Globe } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import type { AppMainMode } from '../../types';

export interface SidebarLogoToggleProps {
  mainMode: AppMainMode;
  onSelectMainMode: (mode: AppMainMode) => void;
  onResetView?: () => void;
  onResetViewIfNotCentered?: () => void;
  setHoveredMenuTooltip: (val: null) => void;
  setOpenFlyoutMode: (val: null) => void;
  bindTooltip: (config: {
    title: string;
    badge?: string;
    badgeColor?: string;
    description: string;
  }) => Record<string, unknown>;
}

/**
 * SidebarLogoToggle
 * Componente Mestre de 3 Camadas:
 * 1. Container div relativo ("container-logo-brq-mestre")
 * 2. Botão de Identidade Visual / Logo BRQ ("btn-sidebar-logo-brq")
 * 3. Badge anexo de notificação / alternador de modo MAPA <-> GLOBO ("btn-toggle-notificacao-mundo")
 */
export const SidebarLogoToggle: React.FC<SidebarLogoToggleProps> = ({
  mainMode,
  onSelectMainMode,
  onResetView,
  onResetViewIfNotCentered,
  setHoveredMenuTooltip,
  setOpenFlyoutMode,
  bindTooltip,
}) => {
  const isGlobe = mainMode === 'globo3d';

  return (
    <div className="container-logo-brq-mestre relative group shrink-0 flex items-center justify-center my-1">
      {/* Camada 1 & 2: Botão Base com Logo BRQ Valorizada (Centralização / Home do Mapa) */}
      <button
        id="btn-sidebar-logo-brq"
        type="button"
        onClick={() => {
          audioEngine.playSfx('click');
          setHoveredMenuTooltip(null);
          setOpenFlyoutMode(null);
          onResetView?.();
        }}
        {...bindTooltip({
          title: 'BR Quest • Guardiões da Cultura',
          badge: isGlobe ? 'Globo 3D' : 'Mapa 2D',
          badgeColor: isGlobe
            ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
            : 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          description: isGlobe
            ? 'Clique para restaurar a visão orbital e centralizar o planeta no Brasil.'
            : 'Clique para restaurar e recentralizar o enquadramento do mapa do Brasil.',
        })}
        className="btn-sidebar-logo-brq relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-slate-900 via-[#03112c] to-slate-950 hover:from-slate-850 hover:to-slate-900 border-2 border-amber-400/80 hover:border-amber-300 flex flex-col items-center justify-center transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.55)] group-hover:scale-105 active:scale-95"
        aria-label="BR Quest - Centralizar Visualização"
      >
        {/* Emblema Cultural e Bandeira Valorizada */}
        <span className="text-2xl sm:text-[26px] leading-none select-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          🇧🇷
        </span>
        <span className="font-serif font-black text-[9px] sm:text-[10px] text-amber-300 tracking-widest leading-none mt-1 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          BR QUEST
        </span>
      </button>

      {/* Camada 3: Wrapper com Background para o Círculo de Toggle Mapa 2D <-> Globo 3D */}
      <div className="absolute -bottom-1 -right-1 z-30 p-[2px] bg-slate-950 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        <button
          id={isGlobe ? 'btn-modo-mapa2d' : 'btn-modo-globo3d'}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            audioEngine.playSfx('click');
            setHoveredMenuTooltip(null);
            setOpenFlyoutMode(null);
            if (isGlobe) {
              onSelectMainMode('aventura');
            } else {
              onSelectMainMode('globo3d');
            }
          }}
          {...bindTooltip({
            title: isGlobe ? 'Alternar: Mapa 2D Nacional' : 'Alternar: Globo 3D Orbital',
            badge: isGlobe ? 'Clique p/ 2D' : 'Clique p/ 3D',
            badgeColor: isGlobe
              ? 'bg-amber-500/25 text-amber-300 border-amber-400/50'
              : 'bg-blue-500/25 text-blue-300 border-blue-400/50',
            description: isGlobe
              ? 'Modo atual: Globo 3D Orbital. Clique aqui para retornar ao Mapa 2D Nacional com as 27 UFs e Biomas.'
              : 'Modo atual: Mapa 2D Nacional. Clique aqui para voar ao espaço e explorar o planeta Terra em 3D.',
          })}
          className={`btn-toggle-notificacao-mundo relative w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer shadow-md hover:scale-120 active:scale-95 ${
            isGlobe
              ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 border-amber-200 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.85)]'
              : 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 border-sky-200 text-white shadow-[0_0_12px_rgba(14,165,233,0.85)]'
          }`}
          aria-label={isGlobe ? 'Alternar para Mapa 2D Nacional' : 'Alternar para Globo 3D Orbital'}
        >
          {isGlobe ? (
            <Map className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] drop-shadow-sm animate-pulse" />
          ) : (
            <Globe className="w-3.5 h-3.5 text-white stroke-[2.5] drop-shadow-sm animate-[spin_10s_linear_infinite]" />
          )}
        </button>
      </div>
    </div>
  );
};
