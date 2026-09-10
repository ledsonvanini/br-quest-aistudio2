/**
 * Astrometric Telemetry HUD Card for 3D Globe
 * Shows real-time distance and light-time from selected Brazilian state
 * to the Moon and Sun, solar zenith angle, planetary rotation velocity,
 * and inter-state geodesic routes.
 */
import React, { useState, useMemo } from 'react';
import {
  StateAstrometryTelemetry,
  MoonPhaseData,
  GeodesicRoute,
  getVisiblePlanetsInfo,
  AU_KM,
} from '../../lib/globeEngine';
import * as THREE from 'three';
import {
  Compass,
  Moon,
  Sun,
  Zap,
  Navigation,
  Globe2,
  Clock,
  ChevronRight,
  Search,
  Activity,
  Orbit,
  MapPin,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Plane,
} from 'lucide-react';
import {
  BRAZIL_MAJOR_CITIES,
  findCityByName,
  calculateCityRouteDistance,
  BrazilCityGeo,
} from '../../data/brazilCitiesGeo';

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
  const [routeSearch, setRouteSearch] = useState('');
  const [routeMode, setRouteMode] = useState<'capitais' | 'cidades'>('capitais');
  const [customOrigin, setCustomOrigin] = useState<string>('');
  const [customDest, setCustomDest] = useState<string>('São Paulo');
  const [selectedCelestialId, setSelectedCelestialId] = useState<string>(selectedAstroId || 'sol');

  const visiblePlanets = useMemo(() => {
    return getVisiblePlanetsInfo(new Date(), new THREE.Vector3(1, 0, 0));
  }, []);

  const celestialBodies = useMemo(() => {
    if (!telemetry) return [];
    const sunItem = {
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
      description: 'Estrela central amarela responsável por 99,8% de toda a massa do Sistema Solar.',
      visibilityBrazil: `Zênite em ${telemetry.solarZenithAngleDeg}° • Insolação local de ${telemetry.insolationPercent}%.`,
      surfaceTemp: '5.500 °C',
      gravityMss: 274.0,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgGradient: 'from-amber-950/30 to-slate-900/90',
    };

    const moonItem = {
      id: 'lua',
      name: 'Lua',
      symbol: '☽',
      type: 'moon',
      categoryLabel: 'Satélite Natural',
      distanceKm: telemetry.distanceToMoonKm,
      distanceAu: (telemetry.distanceToMoonKm / AU_KM).toFixed(5),
      lightTimeText: `${telemetry.lightTimeToMoonSec} s`,
      badge: moonPhase?.phaseName ? `${Math.round(moonPhase.illuminationFraction * 100)}%` : 'Lua Cheia',
      badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
      description: moonPhase?.phaseName || 'Satélite natural da Terra em sincronia de rotação.',
      visibilityBrazil: `Fase atual: ${moonPhase?.phaseName || 'Crescente'} (${Math.round((moonPhase?.illuminationFraction || 0.5) * 100)}% iluminada).`,
      surfaceTemp: '-130 °C a +120 °C',
      gravityMss: 1.62,
      accentColor: 'text-sky-300',
      borderColor: 'border-sky-500/40',
      bgGradient: 'from-sky-950/30 to-slate-900/90',
    };

    const planetItems = visiblePlanets.map((p) => ({
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
      accentColor:
        p.id === 'marte'
          ? 'text-red-400'
          : p.id === 'venus'
          ? 'text-yellow-200'
          : p.id === 'jupiter'
          ? 'text-amber-300'
          : p.id === 'saturno'
          ? 'text-yellow-400'
          : 'text-slate-300',
      borderColor:
        p.id === 'marte'
          ? 'border-red-500/40'
          : p.id === 'venus'
          ? 'border-yellow-500/40'
          : 'border-indigo-500/40',
      bgGradient: 'from-slate-950/50 to-slate-900/90',
    }));

    return [sunItem, moonItem, ...planetItems];
  }, [telemetry, moonPhase, visiblePlanets]);

  const activeAstro = useMemo(() => {
    return celestialBodies.find((b) => b.id === selectedCelestialId) || celestialBodies[0];
  }, [celestialBodies, selectedCelestialId]);

  const handleSelectAstro = (id: string) => {
    setSelectedCelestialId(id);
    if (onSelectAstroId) {
      onSelectAstroId(id);
    }
  };

  // Set default origin when telemetry loads
  React.useEffect(() => {
    if (telemetry?.capitalName && !customOrigin) {
      setCustomOrigin(telemetry.capitalName);
    }
  }, [telemetry?.capitalName]);

  const filteredRoutes = useMemo(() => {
    const baseRoutes = allCapitalRoutes && allCapitalRoutes.length > 0 ? allCapitalRoutes : routes;
    if (!baseRoutes) return [];
    if (!routeSearch.trim()) return baseRoutes;
    const q = routeSearch.toLowerCase();
    return baseRoutes.filter(
      (r) =>
        r.toStateId.toLowerCase().includes(q) ||
        r.toName.toLowerCase().includes(q)
    );
  }, [allCapitalRoutes, routes, routeSearch]);

  // Compute preview for custom city route
  const customRouteCalc = useMemo(() => {
    if (!customOrigin || !customDest) return null;
    return calculateCityRouteDistance(customOrigin, customDest);
  }, [customOrigin, customDest]);

  if (!telemetry) return null;

  const handleApplyCustomRoute = () => {
    if (customOrigin.trim() && customDest.trim() && onCustomCityRoute) {
      onCustomCityRoute(customOrigin.trim(), customDest.trim());
    }
  };

  const handleResetToCapitals = () => {
    if (onResetCapitalsRoute) {
      onResetCapitalsRoute();
    }
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
  };

  // Tangential velocity of Earth's rotation at the state's latitude
  // v = 1674.4 * cos(lat) km/h
  const tangentialSpeedKmH = Math.round(
    1674.4 * Math.cos((telemetry.lat * Math.PI) / 180)
  );

  // Time zone determination
  const getTimeZone = (stateId: string) => {
    if (stateId === 'AC') return 'UTC-5 (Acre)';
    if (['AM', 'RO', 'RR', 'MT', 'MS'].includes(stateId)) return 'UTC-4 (Amazônia)';
    return 'UTC-3 (Brasília)';
  };

  // Format flight duration into hours and minutes
  const formatFlightTime = (hoursDecimal: number) => {
    const totalMinutes = Math.round(hoursDecimal * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}min`;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  };

  return (
    <div
      id="card-telemetria-globo"
      className="painel-astrometria-telemetria fixed top-3 sm:top-3.5 md:top-4 bottom-14 sm:bottom-16 left-2 sm:left-[76px] md:left-[84px] lg:left-[88px] z-40 w-[calc(100vw-16px)] sm:w-[440px] md:w-[480px] lg:w-[500px] bg-slate-950/95 backdrop-blur-2xl border border-sky-500/40 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(56,189,248,0.2)] flex flex-col text-slate-100 overflow-hidden select-none animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-auto"
    >
      {/* 1. Header with State Identification & Close Button */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Orbit className="w-5 h-5 text-sky-400 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-sky-400 font-bold flex items-center gap-1.5">
              <span>Telemetria Cósmica 3D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 leading-tight">
              <span>{telemetry.capitalName}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-sky-950/80 text-sky-300 border border-sky-700/60 font-mono font-bold shadow-sm">
                {telemetry.stateId}
              </span>
            </h3>
            <div className="text-[11px] text-slate-400">
              {telemetry.stateName}
            </div>
          </div>
        </div>

        <button
          id="btn-fechar-telemetria"
          onClick={onClose}
          className="btn-fechar-painel w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 flex items-center justify-center transition-all cursor-pointer"
          title="Fechar Painel de Telemetria"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700/80">
        
        {/* Geodetic & Rotational Mechanics Card */}
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
                {getTimeZone(telemetry.stateId)}
              </span>
            </div>
            <div className="col-span-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Velocidade de Rotação Terrestre:</span>
                <span className="text-[11px] text-slate-300">
                  Velocidade tangencial na latitude de {telemetry.capitalName}
                </span>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {new Intl.NumberFormat('pt-BR').format(tangentialSpeedKmH)} km/h
              </span>
            </div>
          </div>
        </div>

        {/* Seletor do Sistema Solar & Astrometria Dinâmica */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Orbit className="w-4 h-4 text-sky-400" />
              <span>Astrometria dos Astros (Sistema Solar)</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              7 Corpos Celestes
            </span>
          </div>

          {/* Carrossel / Tabs dos Astros */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {celestialBodies.map((astro) => {
              const isSelected = astro.id === activeAstro.id;
              return (
                <button
                  key={astro.id}
                  type="button"
                  onClick={() => handleSelectAstro(astro.id)}
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

          {/* Cartão de Telemetria Detalhado do Astro Selecionado */}
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

            {/* Distância e Tempo de Luz */}
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
                <span className="text-[10px] text-slate-400">
                  Velocidade c
                </span>
              </div>
            </div>

            {/* Informações Físicas e Visibilidade no Brasil */}
            <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
              {activeAstro.visibilityBrazil && (
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">No Brasil:</span>
                  <span className="text-slate-300 leading-tight">{activeAstro.visibilityBrazil}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Temp: <strong className="text-slate-200">{activeAstro.surfaceTemp}</strong></span>
                <span>Gravidade: <strong className="text-slate-200">{activeAstro.gravityMss} m/s²</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Cosmic Beams in 3D */}
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
          <Zap className={`w-4 h-4 ${showCosmicBeams ? 'text-slate-950 fill-slate-950 animate-pulse' : 'text-sky-400'}`} />
          <span>
            {showCosmicBeams
              ? `Feixe Cósmico Ativo até ${activeAstro.name}`
              : `Traçar Feixe Cósmico 3D até ${activeAstro.name}`}
          </span>
        </button>

        {/* Geodesic Inter-State & Inter-City Routes Module */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          {/* Header & Mode Switcher */}
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

            {/* Informative Explanation */}
            <p className="text-[11px] text-slate-400 mt-1 leading-tight">
              {routeMode === 'capitais'
                ? 'Navegando entre as 27 Capitais por padrão em arcos de círculo máximo (Great Circle).'
                : 'Trace rotas geodésicas ponta-a-ponta entre cidades específicas do Brasil.'}
            </p>
          </div>

          {/* Mode Selector Tabs */}
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

          {/* MODE 1: Capitais (Padrão) */}
          {routeMode === 'capitais' && (
            <div className="space-y-2">
              {/* Active Adapted Capital Route Banner */}
              {activeAdaptedRoute && activeAdaptedRoute.id.startsWith('adapted-capital') && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rota Adaptada entre Capitais</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetToCapitals}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[10.5px] font-semibold cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restaurar Todas
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span>{activeAdaptedRoute.fromName} ➔ {activeAdaptedRoute.toName}</span>
                    <span className="text-amber-300 font-bold">{formatKm(activeAdaptedRoute.distanceKm)} ({formatFlightTime(activeAdaptedRoute.estimatedFlightHours)})</span>
                  </div>
                </div>
              )}

              {/* Active Custom City Route Banner if on capitais tab */}
              {activeAdaptedRoute && activeAdaptedRoute.id === 'custom-city-route' && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  <span className="text-[11px]">Exibindo rota de cidade personalizada: {activeAdaptedRoute.fromName} ➔ {activeAdaptedRoute.toName}</span>
                  <button
                    type="button"
                    onClick={handleResetToCapitals}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[10.5px] font-semibold cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar 27 Capitais
                  </button>
                </div>
              )}

              {/* Quick Search for Destinations */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={routeSearch}
                  onChange={(e) => setRouteSearch(e.target.value)}
                  placeholder={`Buscar capital a partir de ${telemetry.capitalName}...`}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                {filteredRoutes.map((r) => {
                  const isAdapted = activeAdaptedRoute?.toStateId === r.toStateId;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        if (onSelectCapitalRoute) {
                          onSelectCapitalRoute(telemetry.stateId, r.toStateId);
                        } else if (onSelectRouteTarget) {
                          onSelectRouteTarget(r.toStateId);
                        }
                      }}
                      className={`card-rota-geodesica flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-all group ${
                        isAdapted
                          ? 'bg-amber-950/60 border-2 border-amber-500/70 shadow-sm'
                          : 'bg-slate-950/50 hover:bg-sky-950/50 border border-slate-800/80 hover:border-sky-500/40'
                      }`}
                      title={`Calcular e adaptar rota 3D para ${r.toName}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-2 h-2 rounded-full transition-transform ${
                            isAdapted ? 'bg-amber-400 scale-125' : 'bg-sky-400 group-hover:scale-125'
                          }`}
                        />
                        <span
                          className={`font-bold font-mono transition-colors ${
                            isAdapted ? 'text-amber-300' : 'text-slate-200 group-hover:text-sky-300'
                          }`}
                        >
                          {r.toStateId}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate">
                          {r.toName}
                        </span>
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

          {/* MODE 2: Entre Cidades Personalizadas */}
          {routeMode === 'cidades' && (
            <div className="space-y-3">
              {/* Active Adapted City Route Banner */}
              {activeAdaptedRoute && activeAdaptedRoute.id === 'custom-city-route' && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Rota Adaptada entre Cidades Ativa</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetToCapitals}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[10.5px] font-semibold cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restaurar 27 Capitais
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span>{activeAdaptedRoute.fromName} ➔ {activeAdaptedRoute.toName}</span>
                    <span className="text-emerald-300 font-bold">{formatKm(activeAdaptedRoute.distanceKm)} ({formatFlightTime(activeAdaptedRoute.estimatedFlightHours)})</span>
                  </div>
                </div>
              )}

              {/* Origin City */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Cidade de Origem:
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    placeholder="Ex: Curitiba, Campinas, Santos..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              {/* Destination City */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Cidade de Destino:
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customDest}
                    onChange={(e) => setCustomDest(e.target.value)}
                    placeholder="Ex: Manaus, Foz do Iguaçu, Juiz de Fora..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/60"
                  />
                </div>
              </div>

              {/* Quick Destination Chips */}
              <div>
                <div className="text-[9.5px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
                  Sugestões Rápidas de Destino:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'São Paulo',
                    'Rio de Janeiro',
                    'Campinas',
                    'Foz do Iguaçu',
                    'Manaus',
                    'Brasília',
                    'Santos',
                    'Salvador',
                  ].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCustomDest(city)}
                      className={`px-2 py-0.5 rounded text-[10.5px] transition-all cursor-pointer border ${
                        customDest.toLowerCase() === city.toLowerCase()
                          ? 'bg-sky-500/25 border-sky-400 text-sky-200 font-bold'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Preview */}
              {customRouteCalc ? (
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-sky-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Distância Geodésica:</span>
                    <span className="font-mono text-sky-300 font-bold text-sm">
                      {formatKm(customRouteCalc.distanceKm)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tempo de Voo Comercial:</span>
                    <span className="font-mono text-amber-300 font-semibold flex items-center gap-1">
                      <Plane className="w-3 h-3 text-amber-400" />
                      {formatFlightTime(customRouteCalc.flightHours)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800 flex justify-between">
                    <span>{customRouteCalc.origin.name} ({customRouteCalc.origin.uf})</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span>{customRouteCalc.destination.name} ({customRouteCalc.destination.uf})</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-amber-300/80 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  Digite os nomes das cidades para calcular a distância e traçar o arco.
                </div>
              )}

              {/* Action Button: Trace Custom City Route on 3D Globe */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApplyCustomRoute}
                  disabled={!customRouteCalc}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    customRouteCalc
                      ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Traçar Rota no Globo 3D</span>
                </button>

                {Boolean(activeAdaptedRoute) && (
                  <button
                    type="button"
                    onClick={handleResetToCapitals}
                    title="Restaurar visualização das 27 capitais"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <span>Arraste o globo para orbitar livremente</span>
        <span className="text-sky-400 font-mono">Astrometria Real</span>
      </div>
    </div>
  );
};
