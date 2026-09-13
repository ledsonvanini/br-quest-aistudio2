/**
 * GlobeTelemetryCard - Painel Flutuante de Telemetria Astrométrica & Mecânica Orbital
 * Orquestra a telemetria do estado brasileiro selecionado, corpos celestes e rotas geodésicas.
 */
import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { Orbit, X } from 'lucide-react';
import {
  StateAstrometryTelemetry,
  MoonPhaseData,
  GeodesicRoute,
  getVisiblePlanetsInfo,
  AU_KM,
} from '../../lib/globeEngine';
import {
  GlobeTelemetryCelestialTab,
  CelestialItem,
} from './GlobeTelemetryCelestialTab';
import { GlobeTelemetryRoutesTab } from './GlobeTelemetryRoutesTab';

interface GlobeTelemetryCardProps {
  telemetry: StateAstrometryTelemetry | null;
  moonPhase: MoonPhaseData | null;
  routes: GeodesicRoute[];
  allCapitalRoutes?: GeodesicRoute[];
  activeAdaptedRoute?: GeodesicRoute | null;
  showCosmicBeams: boolean;
  onToggleCosmicBeams: () => void;
  selectedAstroId?: string;
  onSelectAstroId?: (astroId: string) => void;
  onSelectRouteTarget?: (stateId: string) => void;
  onSelectCapitalRoute?: (originStateId: string, destStateId: string) => void;
  onCustomCityRoute?: (originCity: string, destCity: string) => void;
  onResetCapitalsRoute?: () => void;
  onClose?: () => void;
}

export const GlobeTelemetryCard: React.FC<GlobeTelemetryCardProps> = ({
  telemetry,
  moonPhase,
  routes,
  allCapitalRoutes,
  activeAdaptedRoute,
  showCosmicBeams,
  onToggleCosmicBeams,
  selectedAstroId,
  onSelectAstroId,
  onSelectRouteTarget,
  onSelectCapitalRoute,
  onCustomCityRoute,
  onResetCapitalsRoute,
  onClose,
}) => {
  const [selectedCelestialId, setSelectedCelestialId] = useState<string>(
    selectedAstroId || 'sol'
  );

  const visiblePlanets = useMemo(() => {
    return getVisiblePlanetsInfo(new Date(), new THREE.Vector3(1, 0, 0));
  }, []);

  const celestialBodies: CelestialItem[] = useMemo(() => {
    if (!telemetry) return [];
    const sunItem: CelestialItem = {
      id: 'sol',
      name: 'Sol',
      symbol: '☉',
      type: 'star',
      categoryLabel: 'Estrela Central',
      distanceKm: telemetry.distanceToSunKm,
      distanceAu: (telemetry.distanceToSunKm / AU_KM).toFixed(3),
      lightTimeText: `${telemetry.lightTimeToSunMin} min`,
      badge: telemetry.localSolarStatus.toUpperCase(),
      badgeColor:
        telemetry.localSolarStatus === 'dia'
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      description: 'Estrela central amarela responsável por 99,8% da massa solar.',
      visibilityBrazil: `Zênite em ${telemetry.solarZenithAngleDeg}° • Insolação de ${telemetry.insolationPercent}%.`,
      surfaceTemp: '5.500 °C',
      gravityMss: 274.0,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgGradient: 'from-amber-950/30 to-slate-900/90',
    };

    const moonItem: CelestialItem = {
      id: 'lua',
      name: 'Lua',
      symbol: '☽',
      type: 'moon',
      categoryLabel: 'Satélite Natural',
      distanceKm: telemetry.distanceToMoonKm,
      distanceAu: (telemetry.distanceToMoonKm / AU_KM).toFixed(5),
      lightTimeText: `${telemetry.lightTimeToMoonSec} s`,
      badge: moonPhase?.phaseName
        ? `${Math.round(moonPhase.illuminationFraction * 100)}%`
        : 'Lua Cheia',
      badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
      description: moonPhase?.phaseName || 'Satélite natural da Terra em rotação síncrona.',
      visibilityBrazil: `Fase atual: ${moonPhase?.phaseName || 'Crescente'}.`,
      surfaceTemp: '-130 °C a +120 °C',
      gravityMss: 1.62,
      accentColor: 'text-sky-300',
      borderColor: 'border-sky-500/40',
      bgGradient: 'from-sky-950/30 to-slate-900/90',
    };

    const planetItems: CelestialItem[] = visiblePlanets.map((p) => ({
      id: p.id,
      name: p.name,
      symbol: p.symbol,
      type: p.type,
      categoryLabel: p.categoryLabel,
      distanceKm: p.distanceKm,
      distanceAu: (p.distanceKm / AU_KM).toFixed(3),
      lightTimeText:
        p.lightTimeSeconds && p.lightTimeSeconds > 60
          ? `${(p.lightTimeSeconds / 60).toFixed(1)} min`
          : `${Math.round(p.lightTimeSeconds || 0)} s`,
      badge: `${(p.distanceKm / AU_KM).toFixed(2)} UA`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      description: p.description,
      visibilityBrazil: p.visibilityBrazil || '',
      surfaceTemp: p.surfaceTemp || 'N/A',
      gravityMss: p.gravityMss || 0,
      accentColor: p.id === 'marte' ? 'text-red-400' : 'text-amber-300',
      borderColor: p.id === 'marte' ? 'border-red-500/40' : 'border-indigo-500/40',
      bgGradient: 'from-slate-950/50 to-slate-900/90',
    }));

    return [sunItem, moonItem, ...planetItems];
  }, [telemetry, moonPhase, visiblePlanets]);

  const activeAstro = useMemo(() => {
    return celestialBodies.find((b) => b.id === selectedCelestialId) || celestialBodies[0];
  }, [celestialBodies, selectedCelestialId]);

  if (!telemetry) return null;

  const latRad = (telemetry.lat * Math.PI) / 180;
  const tangentialSpeedKmH = Math.round(1670 * Math.cos(latRad));

  return (
    <div
      id="painel-telemetria-globo"
      className="painel-telemetria-globo painel-hud-controles fixed sm:absolute top-14 sm:top-14 left-[56px] sm:left-16 right-2 sm:right-auto z-40 w-auto sm:w-[480px] max-w-[calc(100vw-68px)] sm:max-w-[500px] max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-130px)] bg-slate-950/95 backdrop-blur-md rounded-3xl border border-sky-500/40 shadow-2xl flex flex-col overflow-hidden text-slate-100 select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Orbit className="w-5 h-5 text-sky-400 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-sky-400 font-bold flex items-center gap-1.5">
              <span>Telemetria Cósmica 3D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 leading-tight">
              <span>{telemetry.capitalName}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-sky-950/80 text-sky-300 border border-sky-700/60 font-mono font-bold shadow-sm">
                {telemetry.stateId}
              </span>
            </h3>
            <div className="text-[11px] text-slate-400">{telemetry.stateName}</div>
          </div>
        </div>

        {onClose && (
          <button
            id="btn-fechar-telemetria"
            onClick={onClose}
            className="btn-fechar-painel w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 flex items-center justify-center transition-all cursor-pointer"
            title="Fechar Telemetria"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700/80">
        {/* Aba de Mecânica Terrestre e Astrometria */}
        <GlobeTelemetryCelestialTab
          telemetry={telemetry}
          celestialBodies={celestialBodies}
          activeAstro={activeAstro}
          onSelectAstro={(id) => {
            setSelectedCelestialId(id);
            onSelectAstroId?.(id);
          }}
          showCosmicBeams={showCosmicBeams}
          onToggleCosmicBeams={onToggleCosmicBeams}
          tangentialSpeedKmH={tangentialSpeedKmH}
          timeZoneName={telemetry.stateId === 'AC' ? 'UTC -5h (Acre)' : telemetry.stateId === 'AM' || telemetry.stateId === 'RR' || telemetry.stateId === 'RO' || telemetry.stateId === 'MS' || telemetry.stateId === 'MT' ? 'UTC -4h (Amazônia)' : 'UTC -3h (Brasília)'}
        />

        {/* Aba de Rotas Geodésicas */}
        <GlobeTelemetryRoutesTab
          originCapitalName={telemetry.capitalName}
          originStateId={telemetry.stateId}
          routes={routes}
          allCapitalRoutes={allCapitalRoutes}
          activeAdaptedRoute={activeAdaptedRoute}
          onSelectRouteTarget={onSelectRouteTarget}
          onSelectCapitalRoute={onSelectCapitalRoute}
          onCustomCityRoute={onCustomCityRoute}
          onResetCapitalsRoute={onResetCapitalsRoute}
        />
      </div>

      {/* 3. Footer */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <span>Arraste o globo para orbitar livremente</span>
        <span className="text-sky-400 font-mono">Astrometria Real</span>
      </div>
    </div>
  );
};
