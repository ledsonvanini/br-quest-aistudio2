import React from 'react';
import { Waves, Mountain, Compass, Droplets, Anchor, ExternalLink } from 'lucide-react';
import { CartographyLayerMode } from '../../../types/cartography';
import { STATE_HYDROLOGY_AND_TERRITORY_DETAILS } from '../../../data/cartographyBasinsData';
import { BRAZIL_STATES_GEOPOLITICS } from '../../../data/geopoliticaData';
import { ALL_BRAZIL_STATES, getStateFlagUrl } from '../../../data/brazilStatesRegistry';

export interface TerritoryStateHoverTooltipProps {
  stateId: string;
  activeLayer: CartographyLayerMode;
}

/**
 * TerritoryStateHoverTooltip
 * Tooltip contextual isolado para feições cartográficas de Território:
 * - Bacias Hidrográficas (ANA / HidroWeb)
 * - Biomas & Relevo Hipsométrico (IBGE Geomorfologia)
 * - Rotas de Integração & Portos (ANTT / Min. Transportes)
 * - Dados Coropléticos Demográficos (Censo IBGE 2022)
 * Garante isolamento estrito: nenhum dado de clima ou outros módulos vaza.
 */
export const TerritoryStateHoverTooltip: React.FC<TerritoryStateHoverTooltipProps> = ({
  stateId,
  activeLayer,
}) => {
  const territoryInfo = STATE_HYDROLOGY_AND_TERRITORY_DETAILS[stateId];
  const geoProfile = BRAZIL_STATES_GEOPOLITICS[stateId];
  const registryInfo = ALL_BRAZIL_STATES.find((s) => s.id === stateId);
  const stateName = registryInfo?.name || territoryInfo?.name || stateId;
  const capital = registryInfo?.capital || geoProfile?.capital || 'Capital';
  const flagUrl = getStateFlagUrl(stateId) || registryInfo?.flagUrl;

  return (
    <div
      id="card-territorio-hover-isolado"
      className="card-territorio-hover-isolado tooltip-territorio-estado space-y-2.5 text-slate-100 select-none"
    >
      {/* 1. Header Institucional da UF */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-2">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`Bandeira de ${stateName}`}
              className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h4 className="font-black text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded shrink-0 border bg-cyan-950/80 text-cyan-300 border-cyan-400/60">
                {stateId}
              </span>
              <span className="truncate font-serif font-bold text-white tracking-wide">{stateName}</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              Capital: <strong className="text-slate-200">{capital}</strong>
            </p>
          </div>
        </div>

        {/* Badge Institucional do Tema */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/90 border border-slate-700/70 text-[10px] font-mono font-semibold shrink-0 shadow-inner">
          {activeLayer === 'bacias_hidrograficas' && (
            <span className="text-cyan-300 flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              ANA
            </span>
          )}
          {activeLayer === 'biomas_relevo' && (
            <span className="text-emerald-300 flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              IBGE
            </span>
          )}
          {activeLayer === 'rotas_integracao' && (
            <span className="text-amber-300 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              ANTT
            </span>
          )}
        </div>
      </div>

      {/* 2. Conteúdo Específico do Subtema Ativo */}
      {activeLayer === 'bacias_hidrograficas' && (
        <div className="space-y-2 text-xs">
          {/* Nome da Bacia Hidrográfica */}
          <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 font-mono block uppercase font-bold tracking-wider mb-0.5">
              Região Hidrográfica Principal (ANA)
            </span>
            <strong className="text-white text-xs font-semibold block leading-tight">
              {territoryInfo?.basinName || 'Bacia Nacional'}
            </strong>
          </div>

          {/* Rios Perenes de Destaque */}
          {territoryInfo?.mainRivers && territoryInfo.mainRivers.length > 0 && (
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono font-bold mb-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>Rios & Afluentes Principais</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {territoryInfo.mainRivers.slice(0, 4).map((river, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-600/30 text-cyan-200 text-[10px] font-mono"
                  >
                    {river}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Destaque Hidrológico / Usinas */}
          {territoryInfo?.hydrologyHighlights && (
            <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-900/50 p-2 rounded-xl border border-slate-800/80">
              "{territoryInfo.hydrologyHighlights}"
            </p>
          )}
        </div>
      )}

      {activeLayer === 'biomas_relevo' && (
        <div className="space-y-2 text-xs">
          <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-mono block uppercase font-bold tracking-wider mb-0.5">
              Bioma Predominante
            </span>
            <strong className="text-white text-xs font-semibold block leading-tight">
              {territoryInfo?.biome || 'Bioma Nacional'}
            </strong>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-amber-300 font-mono block uppercase font-bold tracking-wider mb-0.5">
              Geomorfologia & Relevo
            </span>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              {territoryInfo?.relevo || 'Planaltos e Planícies do Brasil'}
            </p>
          </div>
        </div>
      )}

      {activeLayer === 'rotas_integracao' && (
        <div className="space-y-2 text-xs">
          <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-500/30">
            <span className="text-[10px] text-amber-400 font-mono block uppercase font-bold tracking-wider mb-0.5">
              Eixos Logísticos & Rodovias
            </span>
            <div className="text-[11px] text-slate-200 space-y-1">
              {territoryInfo?.routes?.map((r, i) => (
                <div key={i} className="flex items-start gap-1">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{r}</span>
                </div>
              )) || <div>Rotas de integração nacional</div>}
            </div>
          </div>

          {territoryInfo?.ports && territoryInfo.ports.length > 0 && (
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-mono font-bold mb-1">
                <Anchor className="w-3 h-3 text-amber-400" />
                <span>Portos e Terminais de Cabotagem</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {territoryInfo.ports.map((port, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-600/30 text-amber-200 text-[10px] font-mono"
                  >
                    {port}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Rodapé do Card com CTA para ver detalhes */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="text-cyan-400/90 font-medium">Toque para ver detalhes</span>
        <ExternalLink className="w-3 h-3 text-cyan-400" />
      </div>
    </div>
  );
};
