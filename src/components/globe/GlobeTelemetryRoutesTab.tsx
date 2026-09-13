/**
 * GlobeTelemetryRoutesTab - Módulo de Rotas Geodésicas 3D (Círculo Máximo / Great Circle)
 * Permite traçar rotas entre as 27 capitais ou entre quaisquer cidades brasileiras.
 */
import React, { useState, useMemo } from 'react';
import {
  Navigation,
  Sparkles,
  RotateCcw,
  Search,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { GeodesicRoute } from '../../lib/globeEngine';
import { GlobeCustomRouteForm } from './GlobeCustomRouteForm';

interface GlobeTelemetryRoutesTabProps {
  originCapitalName: string;
  originStateId: string;
  routes: GeodesicRoute[];
  allCapitalRoutes?: GeodesicRoute[];
  activeAdaptedRoute?: GeodesicRoute | null;
  onSelectRouteTarget?: (stateId: string) => void;
  onSelectCapitalRoute?: (originStateId: string, destStateId: string) => void;
  onCustomCityRoute?: (originCity: string, destCity: string) => void;
  onResetCapitalsRoute?: () => void;
}

export const GlobeTelemetryRoutesTab: React.FC<GlobeTelemetryRoutesTabProps> = ({
  originCapitalName,
  originStateId,
  routes,
  allCapitalRoutes,
  activeAdaptedRoute,
  onSelectRouteTarget,
  onSelectCapitalRoute,
  onCustomCityRoute,
  onResetCapitalsRoute,
}) => {
  const [routeMode, setRouteMode] = useState<'capitais' | 'cidades'>('capitais');
  const [routeSearch, setRouteSearch] = useState('');

  const formatKm = (km: number) => {
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(km)} km`;
  };

  const formatFlightTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m.toString().padStart(2, '0')}m`;
  };

  const filteredRoutes = useMemo(() => {
    const base = allCapitalRoutes && allCapitalRoutes.length > 0 ? allCapitalRoutes : routes;
    if (!base) return [];
    if (!routeSearch.trim()) return base;
    const q = routeSearch.toLowerCase();
    return base.filter(
      (r) => r.toStateId.toLowerCase().includes(q) || r.toName.toLowerCase().includes(q)
    );
  }, [allCapitalRoutes, routes, routeSearch]);

  return (
    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>Rotas Geodésicas 3D</span>
          </div>
          <span className="text-[10px] text-sky-400 font-mono bg-sky-950/90 px-2 py-0.5 rounded border border-sky-800/80">
            Ortodrômica
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-tight">
          {routeMode === 'capitais'
            ? 'Círculo máximo entre capitais com velocidade de cruzeiro comercial.'
            : 'Trace rotas geodésicas ponta-a-ponta entre cidades específicas.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 rounded-lg bg-slate-950 border border-slate-800/90 text-xs">
        <button
          type="button"
          onClick={() => setRouteMode('capitais')}
          className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all cursor-pointer ${
            routeMode === 'capitais'
              ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Capitais (Padrão)
        </button>
        <button
          type="button"
          onClick={() => setRouteMode('cidades')}
          className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-center transition-all cursor-pointer ${
            routeMode === 'cidades'
              ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Entre Cidades
        </button>
      </div>

      {/* MODE 1: Capitais */}
      {routeMode === 'capitais' && (
        <div className="space-y-2">
          {activeAdaptedRoute && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rota Ativa Adaptada</span>
                </div>
                {onResetCapitalsRoute && (
                  <button
                    type="button"
                    onClick={onResetCapitalsRoute}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[10.5px] font-semibold cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resetar</span>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] pt-0.5">
                <span>
                  {activeAdaptedRoute.fromStateId} ({originCapitalName}) → {activeAdaptedRoute.toStateId} ({activeAdaptedRoute.toName})
                </span>
                <span className="font-bold text-amber-300">
                  {formatKm(activeAdaptedRoute.distanceKm)}
                </span>
              </div>
            </div>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={routeSearch}
              onChange={(e) => setRouteSearch(e.target.value)}
              placeholder="Buscar capital ou estado (Ex: Manaus, AM)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/60"
            />
          </div>

          <div className="space-y-1 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-0.5">
            {filteredRoutes.map((r) => {
              const isAdapted = activeAdaptedRoute?.toStateId === r.toStateId;
              return (
                <div
                  key={`${r.fromStateId}-${r.toStateId}`}
                  onClick={() => {
                    if (onSelectCapitalRoute) {
                      onSelectCapitalRoute(originStateId, r.toStateId);
                    } else if (onSelectRouteTarget) {
                      onSelectRouteTarget(r.toStateId);
                    }
                  }}
                  className={`group p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isAdapted
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-100'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/80 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-sky-400 shrink-0">
                      {r.toStateId}
                    </span>
                    <span className="text-xs truncate">{r.toName}</span>
                  </div>

                  <div className="text-right flex items-center gap-2.5 shrink-0">
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        isAdapted ? 'text-amber-300' : 'text-sky-300'
                      }`}
                    >
                      {formatKm(r.distanceKm)}
                    </span>
                    <span className="text-[10px] text-amber-300/90 font-mono flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      <Clock className="w-2.5 h-2.5 text-amber-400" />
                      {formatFlightTime(r.estimatedFlightHours)}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: Cidades */}
      {routeMode === 'cidades' && (
        <GlobeCustomRouteForm
          defaultOrigin={originCapitalName}
          onCustomCityRoute={onCustomCityRoute}
          formatKm={formatKm}
          formatFlightTime={formatFlightTime}
        />
      )}
    </div>
  );
};
