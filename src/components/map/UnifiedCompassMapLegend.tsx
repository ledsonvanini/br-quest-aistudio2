import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Waves,
  Trees,
  Route,
  Anchor,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { CartographyLayerMode } from '../../types/cartography';
import {
  ENRICHED_INTEGRATION_ROUTES,
  BRAZIL_KEY_PORTS,
} from '../../data/cartographyBasinsData';
import { BRAZIL_HYDRO_REGIONS } from '../../data/cartography/hydroRegionsData';
import { BRAZIL_OFFICIAL_BIOMES } from '../../data/cartography/biomesData';
import {
  MapVisualStyle,
  ChoroplethSubTheme,
  REGION_COLORS,
  BIOME_COLORS,
} from '../../lib/mapColorScales';

export interface UnifiedCompassMapLegendProps {
  activeCartographyLayer?: CartographyLayerMode;
  visualStyle?: MapVisualStyle;
  choroplethSubTheme?: ChoroplethSubTheme;
  completedCount?: number;
  isCompact?: boolean;
}

/**
 * UnifiedCompassMapLegend
 * Legenda cartográfica unificada e viva ancorada na bússola / HUD.
 * Exibe dinamicamente convenções de hidrografia, biomas, rotas de integração,
 * coropléticos (IBGE / biomas / progresso de guardiões) e símbolos náuticos/portuários.
 */
export const UnifiedCompassMapLegend: React.FC<UnifiedCompassMapLegendProps> = ({
  activeCartographyLayer = 'none',
  visualStyle = 'tiles',
  choroplethSubTheme = 'progress',
  completedCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Determinar se há algo relevante para exibir
  const hasCartoLayer = activeCartographyLayer && activeCartographyLayer !== 'none';
  const hasChoropleth = visualStyle === 'choropleth';

  // Se nenhum dos modos temáticos ou coropléticos estiver ativo, mostramos orientação cartográfica padrão (Rosa dos Ventos & Escala)
  const isDefaultCarto = !hasCartoLayer && !hasChoropleth;

  return (
    <div
      id="unified-compass-map-legend"
      className="painel-legenda-unificada flex flex-col gap-1.5 pt-2 mt-1 border-t border-slate-800/80 text-left"
    >
      {/* Cabeçalho colapsável da Legenda */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between cursor-pointer group py-0.5 select-none"
      >
        <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Legenda Cartográfica</span>
          {hasCartoLayer && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              Ativa
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={isExpanded ? 'Recolher Legenda' : 'Expandir Legenda'}
          className="text-slate-400 group-hover:text-amber-300 transition-colors p-0.5"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="conteudo-legenda-unificada flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 text-[11px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {/* ========================================================= */}
          {/* 1. CAMADA ATIVA: Bacias Hidrográficas                     */}
          {/* ========================================================= */}
          {activeCartographyLayer === 'bacias_hidrograficas' && (
            <div className="secao-legenda-bacias flex flex-col gap-1.5 bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-xl">
              <div className="flex items-center justify-between font-serif font-bold text-cyan-300 text-[10px] uppercase tracking-wider pb-1 border-b border-cyan-900/50">
                <span className="flex items-center gap-1">
                  <Waves className="w-3 h-3 text-cyan-400" />
                  12 Regiões Hidrográficas (ANA)
                </span>
                <span className="text-[9px] font-mono text-cyan-400/80">HidroWeb</span>
              </div>
              <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1">
                {BRAZIL_HYDRO_REGIONS.map((basin) => (
                  <div key={basin.id} className="item-legenda-bacia flex items-start gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 shadow-sm"
                      style={{ backgroundColor: basin.color }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <span>{basin.name}</span>
                        <span className="text-[9px] font-mono text-cyan-400/70">{basin.dischargeM3s.toLocaleString('pt-BR')} m³/s</span>
                      </div>
                      <span className="text-[9px] text-slate-400 leading-tight">
                        {basin.mainRivers.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Símbolo de Usinas Hidrelétricas */}
              <div className="flex items-center gap-2 pt-1 border-t border-cyan-900/40 text-[9px] text-cyan-300/80">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                  <span>Usinas Hidrelétricas (UHE)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-cyan-400/80 inline-block" />
                  <span>Veios Dendríticos</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. CAMADA ATIVA: Biomas & Relevo                          */}
          {/* ========================================================= */}
          {activeCartographyLayer === 'biomas_relevo' && (
            <div className="secao-legenda-biomas flex flex-col gap-1.5 bg-emerald-950/30 border border-emerald-800/40 p-2 rounded-xl">
              <div className="flex items-center justify-between font-serif font-bold text-emerald-300 text-[10px] uppercase tracking-wider pb-1 border-b border-emerald-900/50">
                <span className="flex items-center gap-1">
                  <Trees className="w-3 h-3 text-emerald-400" />
                  6 Biomas Continentais & Relevo
                </span>
                <span className="text-[9px] font-mono text-emerald-400/80">IBGE</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {BRAZIL_OFFICIAL_BIOMES.map((b) => (
                  <div key={b.id} className="item-legenda-bioma flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 border"
                      style={{ backgroundColor: b.fillColor, borderColor: b.color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-medium text-slate-200 truncate">{b.name}</span>
                      <span className="text-[8px] font-mono text-emerald-400/80">{b.percentageBr}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. CAMADA ATIVA: Rotas & Conectividade Territorial         */}
          {/* ========================================================= */}
          {activeCartographyLayer === 'rotas_integracao' && (
            <div className="secao-legenda-rotas flex flex-col gap-1.5 bg-amber-950/30 border border-amber-800/40 p-2 rounded-xl">
              <div className="flex items-center justify-between font-serif font-bold text-amber-300 text-[10px] uppercase tracking-wider pb-1 border-b border-amber-900/50">
                <span className="flex items-center gap-1">
                  <Route className="w-3 h-3 text-amber-400" />
                  Eixos de Integração Nacional
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {ENRICHED_INTEGRATION_ROUTES.map((route) => (
                  <div key={route.id} className="item-legenda-rota flex items-center gap-2">
                    <span
                      className="w-4 h-0.5 shrink-0"
                      style={{
                        backgroundColor: route.color,
                        borderStyle: route.strokeDash ? 'dashed' : 'solid',
                      }}
                    />
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="text-[10px] font-medium text-slate-200 truncate">{route.name}</span>
                      <span className="text-[8px] font-mono text-amber-400/80 shrink-0 ml-1">{route.lengthKm}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Portos de Cabotagem */}
              <div className="pt-1.5 mt-0.5 border-t border-amber-900/40 flex items-center justify-between text-[9px] text-amber-200/90">
                <span className="flex items-center gap-1">
                  <Anchor className="w-3 h-3 text-cyan-400" />
                  <span>Portos Estratégicos ({BRAZIL_KEY_PORTS.length})</span>
                </span>
                <span className="font-mono text-slate-400">Marítimos & Fluviais</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. VISUAL COROPLÉTICO: Regiões IBGE, Biomas ou Conquistas */}
          {/* ========================================================= */}
          {hasChoropleth && (
            <div className="secao-legenda-coropletica flex flex-col gap-1.5 bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
              <div className="font-serif font-bold text-amber-300 text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>
                  {choroplethSubTheme === 'progress' && 'Conquistas & XP'}
                  {choroplethSubTheme === 'regions' && 'Macrorregiões IBGE'}
                  {choroplethSubTheme === 'biomes' && 'Biomas Continentais'}
                </span>
                <span className="text-[9px] font-mono text-slate-400">Coroplético</span>
              </div>

              {/* Sub-tema 1: Progresso */}
              {choroplethSubTheme === 'progress' && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#065f46] border border-[#34d399] shrink-0" />
                    <span className="text-slate-200">Concluído ({completedCount}/27)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#1e293b] border border-[#475569] shrink-0" />
                    <span className="text-slate-400">Pendente ({27 - completedCount}/27)</span>
                  </div>
                </div>
              )}

              {/* Sub-tema 2: Regiões */}
              {choroplethSubTheme === 'regions' && (
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(REGION_COLORS).map(([region, color]) => (
                    <div key={region} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0 border"
                        style={{ backgroundColor: color.fill, borderColor: color.stroke }}
                      />
                      <span className="text-slate-300 truncate">{color.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tema 3: Biomas */}
              {choroplethSubTheme === 'biomes' && (
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(BIOME_COLORS).map(([biome, color]) => (
                    <div key={biome} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-sm shrink-0 border"
                        style={{ backgroundColor: color.fill, borderColor: color.stroke }}
                      />
                      <span className="text-slate-300 truncate">{color.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. ORIENTAÇÃO CARTOGRÁFICA GERAL (Modo Padrão)            */}
          {/* ========================================================= */}
          {isDefaultCarto && (
            <div className="secao-legenda-padrao flex flex-col gap-1.5 p-1 text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-200/90 font-medium">
                <Info className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Convenções Cartográficas</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400/80 border border-amber-300" />
                  <span>Brasão / Guardião</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/80 border border-cyan-300" />
                  <span>Capital Estadual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-amber-500/70 inline-block" />
                  <span>Fronteira Estadual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-slate-500/80 border-b border-dashed border-slate-400 inline-block" />
                  <span>Fronteira Nacional</span>
                </div>
              </div>
              <div className="pt-1 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                <span>Projeção: Mercator D3</span>
                <span>Pivô: Goiás</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
