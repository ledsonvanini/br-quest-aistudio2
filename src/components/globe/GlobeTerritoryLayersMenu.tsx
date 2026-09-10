/**
 * GlobeTerritoryLayersMenu
 * Unified HUD Menu concentrating:
 * 1) Geodesic Routes (Ocultar/Exibir rotas geodésicas)
 * 2) State Coats of Arms (Mostrar brasões: completos / siglas / ocultar)
 * 3) State Borders & Regions Filter (Fronteiras por regiões: Norte, Nordeste, etc.)
 */
import React from 'react';
import { Layers, Navigation, Eye, Check, ChevronDown } from 'lucide-react';
import { BorderRegionFilter } from './GlobeControlsHUD';

export const REGIONS_LIST: { id: BorderRegionFilter; name: string; color: string; count: number }[] = [
  { id: 'all', name: 'Todas as Regiões (27 UFs)', color: '#f59e0b', count: 27 },
  { id: 'Norte', name: 'Norte (Amazônia)', color: '#10b981', count: 7 },
  { id: 'Nordeste', name: 'Nordeste (Caatinga/Mata Atlântica)', color: '#f59e0b', count: 9 },
  { id: 'Centro-Oeste', name: 'Centro-Oeste (Cerrado/Pantanal)', color: '#eab308', count: 4 },
  { id: 'Sudeste', name: 'Sudeste (Mata Atlântica)', color: '#38bdf8', count: 4 },
  { id: 'Sul', name: 'Sul (Pampas/Mata Atlântica)', color: '#a855f7', count: 3 },
];

interface GlobeTerritoryLayersMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  showGeodesicRoutes: boolean;
  onToggleGeodesicRoutes: () => void;
  pinDisplayMode: 'all' | 'compact' | 'none';
  onTogglePinDisplayMode?: () => void;
  onSetPinDisplayMode?: (mode: 'all' | 'compact' | 'none') => void;
  showBorders: boolean;
  onToggleBorders: () => void;
  borderRegionFilter: BorderRegionFilter;
  onChangeBorderRegionFilter?: (region: BorderRegionFilter) => void;
}

export const GlobeTerritoryLayersMenu: React.FC<GlobeTerritoryLayersMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  showGeodesicRoutes,
  onToggleGeodesicRoutes,
  pinDisplayMode,
  onSetPinDisplayMode,
  onTogglePinDisplayMode,
  showBorders,
  onToggleBorders,
  borderRegionFilter,
  onChangeBorderRegionFilter,
}) => {
  const hasActiveLayers = showGeodesicRoutes || showBorders || pinDisplayMode !== 'none';

  return (
    <div className="relative">
      <button
        type="button"
        id="btn-menu-camadas-brasil"
        onClick={onToggle}
        className={`btn-menu-camadas-brasil flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
          isOpen || hasActiveLayers
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-amber-500/10'
            : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-200'
        }`}
        title="Camadas do Território (Rotas, Brasões e Fronteiras Regionais)"
      >
        <Layers className="w-4 h-4 text-amber-400" />
        <ChevronDown
          className={`w-3 h-3 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id="popover-camadas-brasil"
          className="popover-camadas-brasil absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-80 rounded-2xl bg-[#030712] border border-amber-500/50 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 space-y-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 px-1">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                Camadas do Território
              </span>
            </div>
            <span className="text-[9px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              Brasil & Regiões
            </span>
          </div>

          {/* Subitem 1: Rotas Geodésicas */}
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Rotas Geodésicas</span>
              </div>
              <button
                type="button"
                id="btn-subitem-toggle-rotas"
                onClick={onToggleGeodesicRoutes}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer border ${
                  showGeodesicRoutes
                    ? 'bg-sky-500/20 text-sky-200 border-sky-400 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {showGeodesicRoutes ? 'Visível' : 'Oculto'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Arcos de grande círculo interligando capitais e trajetórias aéreas pelo país.
            </p>
          </div>

          {/* Subitem 2: Brasões dos Estados */}
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Brasões dos Estados</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onSetPinDisplayMode) onSetPinDisplayMode('all');
                  else if (onTogglePinDisplayMode && pinDisplayMode !== 'all') onTogglePinDisplayMode();
                }}
                className={`p-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                  pinDisplayMode === 'all'
                    ? 'bg-sky-500/25 text-sky-200 border-sky-400 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                }`}
              >
                Completos
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSetPinDisplayMode) onSetPinDisplayMode('compact');
                  else if (onTogglePinDisplayMode && pinDisplayMode !== 'compact') onTogglePinDisplayMode();
                }}
                className={`p-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                  pinDisplayMode === 'compact'
                    ? 'bg-sky-500/25 text-sky-200 border-sky-400 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                }`}
              >
                Siglas UF
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSetPinDisplayMode) onSetPinDisplayMode('none');
                  else if (onTogglePinDisplayMode && pinDisplayMode !== 'none') onTogglePinDisplayMode();
                }}
                className={`p-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                  pinDisplayMode === 'none'
                    ? 'bg-slate-800 text-slate-200 border-slate-700 font-bold'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                }`}
              >
                Ocultar
              </button>
            </div>
          </div>

          {/* Subitem 3: Fronteiras por Regiões do IBGE */}
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Fronteiras por Região</span>
              </div>
              <button
                type="button"
                id="btn-subitem-toggle-fronteiras"
                onClick={onToggleBorders}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer border ${
                  showBorders
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {showBorders ? 'Visível' : 'Oculto'}
              </button>
            </div>

            <div className="space-y-1 pt-1 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
              {REGIONS_LIST.map((reg) => {
                const isSelected = borderRegionFilter === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      onChangeBorderRegionFilter?.(reg.id);
                      if (!showBorders) onToggleBorders();
                    }}
                    className={`w-full text-left p-1.5 rounded-lg text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/40'
                        : 'text-slate-300 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: reg.color }}
                      />
                      <span className="truncate">{reg.name}</span>
                    </div>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
