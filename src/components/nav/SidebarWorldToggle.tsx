import React from 'react';
import { Map, Globe } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export interface SidebarWorldToggleProps {
  isGlobeActive: boolean;
  onSelectWorld: (world: 'mapa2d' | 'globo3d') => void;
  bindTooltip: (config: {
    title: string;
    badge?: string;
    badgeColor?: string;
    description: string;
  }) => Record<string, unknown>;
}

/**
 * SidebarWorldToggle
 * Chave Mestra Contextual no topo da sidebar: alterna entre o Mapa 2D Isométrico e o Globo 3D Orbital.
 * Garante o desacoplamento de ferramentas e evita poluição entre os mundos.
 */
export const SidebarWorldToggle: React.FC<SidebarWorldToggleProps> = ({
  isGlobeActive,
  onSelectWorld,
  bindTooltip,
}) => {
  return (
    <div
      id="container-toggle-mundo-sidebar"
      className="container-toggle-mundo-sidebar flex flex-col items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-amber-400/40 shadow-md shrink-0 select-none"
      role="group"
      aria-label="Alternador de Mundo: Mapa 2D ou Globo 3D"
    >
      {/* Botão: Mapa 2D Isométrico */}
      <button
        id="btn-toggle-mundo-mapa"
        type="button"
        onClick={() => {
          if (isGlobeActive) {
            audioEngine.playSfx('click');
            onSelectWorld('mapa2d');
          }
        }}
        {...bindTooltip({
          title: 'Mundo Cartográfico: Mapa 2D',
          badge: !isGlobeActive ? 'Ativo' : 'Alternar',
          badgeColor: !isGlobeActive
            ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
            : 'bg-slate-700/40 text-slate-300 border-slate-600',
          description:
            'Acesse a cartografia detalhada do Brasil, divisão política das 27 UFs, relevo, hidrografia e clima local.',
        })}
        className={`btn-toggle-mundo-mapa relative w-10 h-8 sm:w-11 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
          !isGlobeActive
            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-bold'
            : 'bg-slate-900/60 border-transparent text-slate-400 hover:text-amber-300 hover:bg-slate-800/80'
        }`}
        aria-pressed={!isGlobeActive}
        aria-label="Alternar para Mapa 2D do Brasil"
      >
        <Map className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        {!isGlobeActive && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-slate-950 shadow-[0_0_6px_#f59e0b] pointer-events-none" />
        )}
      </button>

      {/* Botão: Globo 3D Orbital */}
      <button
        id="btn-toggle-mundo-globo"
        type="button"
        onClick={() => {
          if (!isGlobeActive) {
            audioEngine.playSfx('click');
            onSelectWorld('globo3d');
          }
        }}
        {...bindTooltip({
          title: 'Mundo Orbital: Globo 3D',
          badge: isGlobeActive ? 'Ativo' : 'Alternar',
          badgeColor: isGlobeActive
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
            : 'bg-slate-700/40 text-slate-300 border-slate-600',
          description:
            'Acesse o planeta Terra tridimensional em órbita com ciclo dia/noite espacial, atmosfera e visão continental.',
        })}
        className={`btn-toggle-mundo-globo relative w-10 h-8 sm:w-11 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
          isGlobeActive
            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.6)] font-bold'
            : 'bg-slate-900/60 border-transparent text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80'
        }`}
        aria-pressed={isGlobeActive}
        aria-label="Alternar para Globo 3D Orbital"
      >
        <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        {isGlobeActive && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-300 ring-2 ring-slate-950 shadow-[0_0_6px_#818cf8] pointer-events-none" />
        )}
      </button>
    </div>
  );
};
