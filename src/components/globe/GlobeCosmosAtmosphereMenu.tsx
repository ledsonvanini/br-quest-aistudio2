/**
 * GlobeCosmosAtmosphereMenu
 * Unified HUD Menu grouping:
 * 1) Ocultar / Exibir Astros do Sistema Solar (showSolarSystem)
 * 2) Ocultar / Exibir Manto de Nuvens (cloudsEnabled)
 * 3) Giro Automático da Terra / Auto-rotação axial (autoRotate)
 */
import React from 'react';
import { Sparkles, Cloud, RotateCw, ChevronDown } from 'lucide-react';

interface GlobeCosmosAtmosphereMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  showSolarSystem: boolean;
  onToggleSolarSystem: () => void;
  cloudsEnabled: boolean;
  onToggleClouds: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}

export const GlobeCosmosAtmosphereMenu: React.FC<GlobeCosmosAtmosphereMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  showSolarSystem,
  onToggleSolarSystem,
  cloudsEnabled,
  onToggleClouds,
  autoRotate,
  onToggleAutoRotate,
}) => {
  const isAnyActive = showSolarSystem || cloudsEnabled;

  return (
    <div className="relative">
      <button
        type="button"
        id="btn-menu-cosmos-atmosfera"
        onClick={onToggle}
        className={`btn-menu-cosmos-atmosfera w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm shrink-0 ${
          isOpen || isAnyActive
            ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 shadow-indigo-500/20 ring-1 ring-indigo-400/50'
            : 'bg-slate-900/90 hover:bg-slate-800 border-indigo-500/40 hover:border-indigo-400 text-slate-300 hover:text-indigo-200'
        }`}
        title="Cosmos & Atmosfera (Astros do Sistema Solar e Manto de Nuvens)"
        aria-label="Cosmos e Atmosfera"
      >
        <Sparkles className="w-4 h-4 text-indigo-400" />
      </button>

      {isOpen && (
        <div
          id="popover-cosmos-atmosfera"
          className="popover-cosmos-atmosfera fixed bottom-16 left-[56px] right-2 sm:absolute sm:bottom-full sm:mb-2.5 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-80 w-auto max-w-sm max-h-[min(480px,calc(100vh-100px))] overflow-y-auto rounded-2xl bg-[#030712] border border-indigo-500/50 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                Cosmos & Atmosfera
              </span>
            </div>
            <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
              Astros & Clima
            </span>
          </div>

          {/* Subitem 1: Astros do Sistema Solar */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">
                  Astros do Sistema Solar
                </span>
              </div>
              <button
                type="button"
                id="btn-subitem-toggle-astros"
                onClick={onToggleSolarSystem}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer border ${
                  showSolarSystem
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {showSolarSystem ? 'Exibindo' : 'Oculto'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Sol, Lua, planetas coplanares, cinturão de asteroides e linhas orbitais no plano da eclíptica.
            </p>
          </div>

          {/* Subitem 2: Manto de Nuvens */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">
                  Manto de Nuvens Terrestre
                </span>
              </div>
              <button
                type="button"
                id="btn-subitem-toggle-nuvens"
                onClick={onToggleClouds}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer border ${
                  cloudsEnabled
                    ? 'bg-sky-500/25 text-sky-200 border-sky-400 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cloudsEnabled ? 'Exibindo' : 'Oculto'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Camada de nebulosidade atmosférica dinâmica com rotação diferencial suave.
            </p>
          </div>

          {/* Subitem 3: Auto-Rotação Axial da Terra */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCw
                  className={`w-4 h-4 text-emerald-400 shrink-0 ${autoRotate ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '8s' }}
                />
                <span className="text-xs font-semibold text-slate-200">
                  Auto-Rotação da Terra
                </span>
              </div>
              <button
                type="button"
                id="btn-subitem-toggle-rotacao"
                onClick={onToggleAutoRotate}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer border ${
                  autoRotate
                    ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400 shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {autoRotate ? 'Ativo' : 'Parado'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Giro lento da Terra sobre o eixo polar de 23.5° para apreciação panorâmica do globo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
