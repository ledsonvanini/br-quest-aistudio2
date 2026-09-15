import React from 'react';
import { Map, Globe } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { AppMainMode } from '../TopGlobalNavMenu';

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
    <div className="container-logo-brq-mestre relative group shrink-0 flex items-center justify-center">
      {/* Camada 1 & 2: Botão Base com Logo BRQ (Centralização / Home do Mapa) */}
      <button
        id="btn-sidebar-logo-brq"
        type="button"
        onClick={() => {
          audioEngine.playSfx('click');
          setHoveredMenuTooltip(null);
          setOpenFlyoutMode(null);
          onResetViewIfNotCentered?.();
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
        className="btn-sidebar-logo-brq relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/60 hover:border-amber-300 flex flex-col items-center justify-center transition-all cursor-pointer shadow-inner group-hover:scale-105"
        aria-label="BR Quest - Centralizar Visualização"
      >
        {/* Camada de Imagem/Emblema Cultural da Logo BRQ */}
        <span className="text-sm sm:text-base leading-none select-none">🇧🇷</span>
        <span className="font-serif font-black text-[8px] text-amber-300 leading-none mt-0.5 tracking-tight">
          BRQ
        </span>
      </button>

      {/* Camada 3: Ícone Anexo de Notificação / Alternador de Modo (MAPA 2D <-> GLOBO 3D) */}
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
        className={`btn-toggle-notificacao-mundo absolute -bottom-1 -right-1 z-30 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md hover:scale-125 ${
          isGlobe
            ? 'bg-slate-950 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)] hover:bg-amber-500/20'
            : 'bg-slate-950 border-blue-400 text-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] hover:bg-blue-500/20'
        }`}
        aria-label={isGlobe ? 'Alternar para Mapa 2D Nacional' : 'Alternar para Globo 3D Orbital'}
      >
        {isGlobe ? (
          <Map className="w-3 h-3 text-amber-300 animate-pulse" />
        ) : (
          <Globe className="w-3 h-3 text-blue-300 animate-[spin_8s_linear_infinite]" />
        )}
      </button>
    </div>
  );
};
