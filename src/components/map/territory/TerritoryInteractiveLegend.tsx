import React from 'react';
import {
  Waves,
  Trees,
  Route,
  X,
  ChevronRight,
  Mountain,
  Droplets,
  Anchor,
  Car,
  Ship,
  Train,
  Sparkles,
} from 'lucide-react';
import { CartographyLayerMode } from '../../../types/cartography';
import { BRAZIL_HYDRO_REGIONS } from '../../../data/cartography/hydroRegionsData';
import { BRAZIL_OFFICIAL_BIOMES } from '../../../data/cartography/biomesData';
import { ENRICHED_INTEGRATION_ROUTES, BRAZIL_KEY_PORTS } from '../../../data/cartographyBasinsData';
import {
  BASIN_PRIMARY_STATE,
  BIOME_PRIMARY_STATE,
  ROUTE_PRIMARY_STATE,
} from '../../../data/cartography/territoryAnchors';
import { audioEngine } from '../../../lib/audioSynth';

export interface TerritoryInteractiveLegendProps {
  activeLayer: CartographyLayerMode;
  selectedSubitemId?: string | null;
  onSelectSubitem?: (subitemId: string | null) => void;
  onSelectState?: (stateId: string) => void;
  onClose?: () => void;
  targetTop?: number;
  arrowTop?: number;
}

export const TerritoryInteractiveLegend: React.FC<TerritoryInteractiveLegendProps> = ({
  activeLayer,
  selectedSubitemId,
  onSelectSubitem,
  onSelectState,
  onClose,
  targetTop,
  arrowTop,
}) => {
  if (!activeLayer || activeLayer === 'none') return null;

  const handleBasinClick = (id: string) => {
    audioEngine.playSfx('click');
    const isTogglingOff = selectedSubitemId === id;
    onSelectSubitem?.(isTogglingOff ? null : id);
  };

  const handleBiomeClick = (id: string) => {
    audioEngine.playSfx('click');
    const isTogglingOff = selectedSubitemId === id;
    onSelectSubitem?.(isTogglingOff ? null : id);
  };

  const handleRouteClick = (id: string) => {
    audioEngine.playSfx('click');
    const isTogglingOff = selectedSubitemId === id;
    onSelectSubitem?.(isTogglingOff ? null : id);
  };

  return (
    <aside
      id="painel-submenu-territorio-conectado"
      style={{
        top: targetTop !== undefined ? `${targetTop}px` : undefined,
      }}
      className={`painel-submenu-territorio-conectado fixed left-[78px] sm:left-[84px] md:left-[88px] ${
        targetTop === undefined ? 'top-20 sm:top-24' : ''
      } z-50 max-w-[calc(100vw-96px)] w-80 sm:w-84 bg-[#020d24]/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3 shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.25)] text-slate-100 transition-all duration-200 select-none animate-in fade-in zoom-in-95 pointer-events-auto`}
      aria-label="Submenu Cartográfico Conectado de Território"
    >
      {/* Seta indicadora (Speech Bubble Pointer) apontando exatamente para o ícone ativo da sidebar */}
      <div
        id="seta-balao-dialogo-territorio"
        style={{
          top: arrowTop !== undefined ? `${arrowTop}px` : '28px',
        }}
        className="painel-seta-balao-territorio absolute -left-[7px] w-3.5 h-3.5 bg-[#020d24] border-l border-b border-cyan-400/60 rotate-45 pointer-events-none z-10"
      />

      {/* Cabeçalho do Submenu */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {activeLayer === 'bacias_hidrograficas' && <Waves className="w-4 h-4 text-cyan-400" />}
          {activeLayer === 'biomas_relevo' && <Trees className="w-4 h-4 text-emerald-400" />}
          {activeLayer === 'rotas_integracao' && <Route className="w-4 h-4 text-amber-400" />}
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-slate-200">
            {activeLayer === 'bacias_hidrograficas' && '12 Regiões Hidrográficas (ANA)'}
            {activeLayer === 'biomas_relevo' && '6 Biomas & Relevo (IBGE)'}
            {activeLayer === 'rotas_integracao' && 'Corredores Logísticos (ANTT)'}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Fechar submenu"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 1. BACIAS HIDROGRÁFICAS */}
      {activeLayer === 'bacias_hidrograficas' && (
        <div className="flex flex-col gap-1 mt-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-900">
          <div className="text-[10px] text-cyan-400/80 mb-1 flex items-center justify-between">
            <span>Selecione para focar e animar:</span>
            {selectedSubitemId && (
              <button
                type="button"
                onClick={() => onSelectSubitem?.(null)}
                className="text-[9px] text-amber-400 hover:underline"
              >
                Limpar filtro
              </button>
            )}
          </div>
          {BRAZIL_HYDRO_REGIONS.map((region) => {
            const isSelected = selectedSubitemId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => handleBasinClick(region.id)}
                className={`flex items-center justify-between p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: region.color }}
                  />
                  <div className="truncate">
                    <div className="text-[11px] font-semibold truncate">{region.shortName}</div>
                    <div className="text-[9px] text-slate-400">
                      Vazão: {region.dischargeM3s.toLocaleString('pt-BR')} m³/s ({region.areaPercentageBr}%)
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3 h-3 text-slate-500 shrink-0 ${isSelected ? 'text-cyan-300' : ''}`} />
              </button>
            );
          })}
        </div>
      )}

      {/* 2. BIOMAS & RELEVO */}
      {activeLayer === 'biomas_relevo' && (
        <div className="flex flex-col gap-1 mt-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-slate-900">
          <div className="text-[10px] text-emerald-400/80 mb-1 flex items-center justify-between">
            <span>Selecione o bioma para destacar:</span>
            {selectedSubitemId && (
              <button
                type="button"
                onClick={() => onSelectSubitem?.(null)}
                className="text-[9px] text-amber-400 hover:underline"
              >
                Limpar filtro
              </button>
            )}
          </div>
          {BRAZIL_OFFICIAL_BIOMES.map((biome) => {
            const isSelected = selectedSubitemId === biome.id;
            return (
              <button
                key={biome.id}
                type="button"
                onClick={() => handleBiomeClick(biome.id)}
                className={`flex items-center justify-between p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: biome.color }}
                  />
                  <div className="truncate">
                    <div className="text-[11px] font-semibold truncate">{biome.name}</div>
                    <div className="text-[9px] text-slate-400">
                      {biome.percentageBr}% do Brasil • {(biome.areaKm2 / 1000).toFixed(0)} mil km²
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3 h-3 text-slate-500 shrink-0 ${isSelected ? 'text-emerald-300' : ''}`} />
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-amber-300/90">
            <span className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-amber-400" />
              Picos Culminantes & Chapadas
            </span>
            <span className="text-[9px] text-slate-400 font-mono">10 Cumes Visíveis</span>
          </div>
        </div>
      )}

      {/* 3. ROTAS DE INTEGRAÇÃO & CABOTAGEM */}
      {activeLayer === 'rotas_integracao' && (
        <div className="flex flex-col gap-1 mt-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-slate-900">
          <div className="text-[10px] text-amber-400/80 mb-1 flex items-center justify-between">
            <span>Selecione a rota logística:</span>
            {selectedSubitemId && (
              <button
                type="button"
                onClick={() => onSelectSubitem?.(null)}
                className="text-[9px] text-amber-400 hover:underline"
              >
                Limpar filtro
              </button>
            )}
          </div>
          {ENRICHED_INTEGRATION_ROUTES.map((route) => {
            const isSelected = selectedSubitemId === route.id;
            const IconComponent =
              route.type === 'fluvial_cabotagem' ? Ship : route.type === 'ferroviaria' ? Train : Car;

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => handleRouteClick(route.id)}
                className={`flex items-center justify-between p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <IconComponent className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-[11px] font-semibold truncate">{route.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {route.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3 h-3 text-slate-500 shrink-0 ${isSelected ? 'text-amber-300' : ''}`} />
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-300/90">
            <span className="flex items-center gap-1">
              <Anchor className="w-3 h-3 text-cyan-400" />
              Portos de Cabotagem
            </span>
            <span className="text-[9px] text-slate-400 font-mono">{BRAZIL_KEY_PORTS.length} Estratégicos</span>
          </div>
        </div>
      )}
    </aside>
  );
};
