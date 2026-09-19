import React from 'react';
import {
  Waves,
  Mountain,
  Route,
  BarChart3,
  Anchor,
  X,
  Compass,
  Droplets,
} from 'lucide-react';
import { STATE_HYDROLOGY_AND_TERRITORY_DETAILS } from '../../data/cartographyBasinsData';
import { STATES_GEOPOLITICS_DATA } from '../../data/geopoliticaData';
import type { CartographyLayerMode } from '../../types/cartography';

interface TerritoryStateDetailCardProps {
  stateId: string;
  activeLayer: CartographyLayerMode;
  onClose: () => void;
}

export const TerritoryStateDetailCard: React.FC<TerritoryStateDetailCardProps> = ({
  stateId,
  activeLayer,
  onClose,
}) => {
  const detail = STATE_HYDROLOGY_AND_TERRITORY_DETAILS[stateId];
  const geopolitics = STATES_GEOPOLITICS_DATA[stateId];

  if (!detail) return null;

  return (
    <div
      id="card-territorio-detalhes-estado"
      className="card-territorio-detalhes-estado pointer-events-auto absolute bottom-24 left-6 z-40 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.15)',
      }}
    >
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/60 text-cyan-300 shadow-inner">
            {activeLayer === 'bacias_hidrograficas' && <Waves className="h-6 w-6 text-cyan-400" />}
            {activeLayer === 'biomas_relevo' && <Mountain className="h-6 w-6 text-emerald-400" />}
            {activeLayer === 'rotas_integracao' && <Route className="h-6 w-6 text-amber-400" />}
            {activeLayer === 'none' && <Compass className="h-6 w-6 text-cyan-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                {detail.name}
              </h3>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-950/80 px-1.5 py-0.5 text-xs font-bold text-cyan-300">
                {detail.stateId}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {geopolitics?.regionName ? `Região ${geopolitics.regionName}` : 'Território Brasileiro'} • Capital: {geopolitics?.capital || 'Capital'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes territoriais"
          className="btn-fechar-painel-territorio flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/60 text-slate-400 transition hover:bg-slate-700 hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Conteúdo Dinâmico Conforme a Camada Ativa */}
      <div className="mt-3.5 space-y-3 text-xs">
        {/* Seção 1: Hidrografia & Bacias */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
            <span>Macro-Bacia & Recursos Hídricos</span>
          </div>
          <p className="mt-1 font-medium text-slate-200">
            {detail.basinName}
          </p>
          <p className="mt-0.5 text-[11px] text-cyan-400/90">
            {detail.basinDischarge}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {detail.mainRivers.map((rio) => (
              <span
                key={rio}
                className="rounded-md border border-cyan-500/25 bg-cyan-950/40 px-2 py-0.5 text-[10px] text-cyan-200"
              >
                🌊 {rio}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            {detail.hydrologyHighlights}
          </p>
        </div>

        {/* Seção 2: Bioma & Relevo */}
        <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
            <Mountain className="h-3.5 w-3.5 text-emerald-400" />
            <span>Bioma Predominante & Geomorfologia</span>
          </div>
          <p className="mt-1 font-medium text-slate-200">
            {detail.biome}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            {detail.relevo}
          </p>
        </div>

        {/* Seção 3: Conexões, Portos e Rotas de Integração */}
        {(detail.routes.length > 0 || detail.ports.length > 0) && (
          <div className="rounded-xl border border-amber-500/20 bg-slate-900/60 p-3">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Anchor className="h-3.5 w-3.5 text-amber-400" />
              <span>Conexões Estratégicas & Cabotagem</span>
            </div>
            {detail.ports.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {detail.ports.map((porto) => (
                  <span
                    key={porto}
                    className="rounded-md border border-amber-500/25 bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-200"
                  >
                    ⚓ {porto}
                  </span>
                ))}
              </div>
            )}
            {detail.routes.length > 0 && (
              <div className="mt-1.5 space-y-1">
                {detail.routes.map((rota) => (
                  <p key={rota} className="text-[11px] text-slate-300">
                    🛣️ {rota}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Seção 4: Dados Demográficos IBGE */}
        {geopolitics && (
          <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/40 px-3 py-2 text-[11px] text-slate-300">
            <span>
              População: <strong className="text-slate-100">{geopolitics.demografia.populacaoTotal.toLocaleString('pt-BR')}</strong> hab.
            </span>
            <span>
              Densidade: <strong className="text-cyan-300">{geopolitics.demografia.densidadeHabKm2.toFixed(1)}</strong> hab/km²
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
