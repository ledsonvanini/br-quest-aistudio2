/**
 * GlobeTelemetryCelestialTab - Aba de Mecânica Terrestre e Astrometria do Sistema Solar
 * Exibe velocidade tangencial de rotação, zênite solar, atraso tempo-luz e feixe cósmico 3D.
 */
import React from 'react';
import { Activity, Orbit, Zap } from 'lucide-react';
import { StateAstrometryTelemetry, AU_KM } from '../../lib/globeEngine';

export interface CelestialItem {
  id: string;
  name: string;
  symbol: string;
  type: string;
  categoryLabel: string;
  distanceKm: number;
  distanceAu: string;
  lightTimeText: string;
  badge: string;
  badgeColor: string;
  description: string;
  visibilityBrazil: string;
  surfaceTemp: string;
  gravityMss: number;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
}

interface GlobeTelemetryCelestialTabProps {
  telemetry: StateAstrometryTelemetry;
  celestialBodies: CelestialItem[];
  activeAstro: CelestialItem;
  onSelectAstro: (astroId: string) => void;
  showCosmicBeams: boolean;
  onToggleCosmicBeams: () => void;
  tangentialSpeedKmH: number;
  timeZoneName: string;
}

export const GlobeTelemetryCelestialTab: React.FC<GlobeTelemetryCelestialTabProps> = ({
  telemetry,
  celestialBodies,
  activeAstro,
  onSelectAstro,
  showCosmicBeams,
  onToggleCosmicBeams,
  tangentialSpeedKmH,
  timeZoneName,
}) => {
  const formatKm = (km: number) => {
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(km)} km`;
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Mecânica Terrestre & Coordenadas */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span>Mecânica Terrestre & Coordenadas</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Posição Geográfica:</span>
            <span className="font-mono text-slate-200 font-medium text-[11px]">
              {Math.abs(telemetry.lat).toFixed(2)}°{telemetry.lat >= 0 ? 'N' : 'S'},{' '}
              {Math.abs(telemetry.lon).toFixed(2)}°{telemetry.lon >= 0 ? 'L' : 'O'}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Fuso Horário Oficial:</span>
            <span className="font-mono text-sky-300 font-medium text-[11px]">
              {timeZoneName}
            </span>
          </div>
          <div className="col-span-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">
                Velocidade de Rotação Terrestre:
              </span>
              <span className="text-[11px] text-slate-300">
                Tangencial na latitude de {telemetry.capitalName}
              </span>
            </div>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {new Intl.NumberFormat('pt-BR').format(tangentialSpeedKmH)} km/h
            </span>
          </div>
        </div>
      </div>

      {/* 2. Carrossel dos Corpos Celestes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Orbit className="w-4 h-4 text-sky-400" />
            <span>Astrometria dos Astros (Sistema Solar)</span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            {celestialBodies.length} Corpos
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          {celestialBodies.map((astro) => {
            const isSelected = astro.id === activeAstro.id;
            return (
              <button
                key={astro.id}
                type="button"
                id={`btn-telemetria-astro-${astro.id}`}
                onClick={() => onSelectAstro(astro.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-sky-500/25 text-sky-200 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-bold">{astro.symbol}</span>
                <span>{astro.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Card de Detalhes do Astro */}
        <div
          className={`p-3.5 rounded-xl bg-gradient-to-b ${activeAstro.bgGradient} border ${activeAstro.borderColor} transition-all space-y-2.5 shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${activeAstro.accentColor}`}>
                {activeAstro.symbol}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{activeAstro.name}</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    ({activeAstro.categoryLabel})
                  </span>
                </h4>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${activeAstro.badgeColor}`}
            >
              {activeAstro.badge}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-400 block">Distância da Terra:</span>
              <div className="text-sm font-bold font-mono text-slate-100">
                {formatKm(activeAstro.distanceKm)}
              </div>
              <span className="text-[10px] text-sky-300 font-mono">
                {activeAstro.distanceAu} UA
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Tempo-Luz (Atraso):</span>
              <div className="text-sm font-bold font-mono text-amber-300">
                {activeAstro.lightTimeText}
              </div>
              <span className="text-[10px] text-slate-400">Velocidade c</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
            {activeAstro.visibilityBrazil && (
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">No Brasil:</span>
                <span className="text-slate-300 leading-tight">
                  {activeAstro.visibilityBrazil}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
              <span>
                Temp: <strong className="text-slate-200">{activeAstro.surfaceTemp}</strong>
              </span>
              <span>
                Gravidade:{' '}
                <strong className="text-slate-200">{activeAstro.gravityMss} m/s²</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Feixe Cósmico 3D */}
      <button
        id="btn-conectar-cosmos"
        type="button"
        onClick={onToggleCosmicBeams}
        className={`btn-conectar-cosmos w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md ${
          showCosmicBeams
            ? 'bg-gradient-to-r from-sky-500 via-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
            : 'bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-sky-500/40 hover:border-sky-400'
        }`}
      >
        <Zap
          className={`w-4 h-4 ${
            showCosmicBeams
              ? 'text-slate-950 fill-slate-950 animate-pulse'
              : 'text-sky-400'
          }`}
        />
        <span>
          {showCosmicBeams
            ? `Feixe Cósmico Ativo até ${activeAstro.name}`
            : `Traçar Feixe Cósmico 3D até ${activeAstro.name}`}
        </span>
      </button>
    </div>
  );
};
