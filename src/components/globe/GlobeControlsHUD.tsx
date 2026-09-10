/**
 * Globe Controls HUD Toolbar
 * Minimalist single-line footer for 3D Globe with semantic human-readable classes.
 * Icon-only celestial navigation picker, pure icon controls without verbose labels,
 * solid-contrast high-opacity popovers, and responsive layout.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  Sun,
  Moon,
  Globe,
  Layers,
  Sparkles,
  Cloud,
  Navigation,
  Calendar,
  Eye,
  Sliders,
  ChevronDown,
  Waves,
  CloudRain,
  Flame,
  Info,
  Filter,
  Check,
  Sunrise,
  Sunset,
  Play,
  Pause,
  Clock,
  Leaf,
  Snowflake,
  Flower2,
  Minus,
  Plus,
} from 'lucide-react';
import { GlobeTextureMode, GlobeSeason, SEASONS_CATALOG } from '../../lib/globeEngine';
import { GlobeCameraMenu } from './GlobeCameraMenu';
import { GlobeTerritoryLayersMenu } from './GlobeTerritoryLayersMenu';
import { GlobeCosmosAtmosphereMenu } from './GlobeCosmosAtmosphereMenu';

export interface AstroOption {
  id: string;
  name: string;
  symbol: string;
  color: string;
  category: string;
}

export const CELESTIAL_ASTROS_LIST: AstroOption[] = [
  { id: 'terra', name: 'Terra (Brasil)', symbol: 'BR', color: '#38bdf8', category: 'Planeta Natal' },
  { id: 'sol', name: 'Sol', symbol: '☉', color: '#f59e0b', category: 'Estrela Central' },
  { id: 'lua', name: 'Lua', symbol: '☽', color: '#e2e8f0', category: 'Satélite Natural' },
  { id: 'mercurio', name: 'Mercúrio', symbol: '☿', color: '#cbd5e1', category: 'Planeta Rochoso' },
  { id: 'venus', name: 'Vênus', symbol: '♀', color: '#fef08a', category: 'Planeta Rochoso' },
  { id: 'marte', name: 'Marte', symbol: '♂', color: '#f87171', category: 'Planeta Rochoso' },
  { id: 'jupiter', name: 'Júpiter', symbol: '♃', color: '#fed7aa', category: 'Gigante Gasoso' },
  { id: 'saturno', name: 'Saturno', symbol: '♄', color: '#fde68a', category: 'Gigante com Anéis' },
  { id: 'urano', name: 'Urano', symbol: '♅', color: '#67e8f9', category: 'Gigante de Gelo' },
  { id: 'netuno', name: 'Netuno', symbol: '♆', color: '#60a5fa', category: 'Gigante de Gelo' },
];

export type BorderRegionFilter = 'all' | 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

const REGIONS_LIST: { id: BorderRegionFilter; name: string; color: string; count: number }[] = [
  { id: 'all', name: 'Todas as Regiões (27 UFs)', color: '#f59e0b', count: 27 },
  { id: 'Norte', name: 'Norte (Amazônia)', color: '#10b981', count: 7 },
  { id: 'Nordeste', name: 'Nordeste (Caatinga/Mata Atlântica)', color: '#f59e0b', count: 9 },
  { id: 'Centro-Oeste', name: 'Centro-Oeste (Cerrado/Pantanal)', color: '#eab308', count: 4 },
  { id: 'Sudeste', name: 'Sudeste (Mata Atlântica)', color: '#38bdf8', count: 4 },
  { id: 'Sul', name: 'Sul (Pampas/Mata Atlântica)', color: '#a855f7', count: 3 },
];

interface GlobeControlsHUDProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  cloudsEnabled: boolean;
  onToggleClouds: () => void;
  showSolarSystem: boolean;
  onToggleSolarSystem: () => void;
  showGeodesicRoutes: boolean;
  onToggleGeodesicRoutes: () => void;
  textureMode: GlobeTextureMode;
  onChangeTextureMode: (mode: GlobeTextureMode) => void;
  season: GlobeSeason;
  onChangeSeason: (season: GlobeSeason) => void;
  showBorders: boolean;
  onToggleBorders: () => void;
  borderRegionFilter?: BorderRegionFilter;
  onChangeBorderRegionFilter?: (region: BorderRegionFilter) => void;
  pinDisplayMode?: 'all' | 'compact' | 'none';
  onTogglePinDisplayMode?: () => void;
  isTelemetryOpen?: boolean;
  onToggleTelemetry?: () => void;
  isTextureInfoOpen?: boolean;
  onToggleTextureInfoPanel?: () => void;
  selectedAstroId?: string | null;
  onNavigateToAstro?: (astroId: string) => void;
  solarHour?: number | null;
  onChangeSolarHour?: (hour: number | null) => void;
  isSolarCyclePlaying?: boolean;
  onToggleSolarCycle?: () => void;
  currentSolarStatus?: 'dia' | 'crepusculo' | 'noite';
  ambientLightIntensity?: number;
  onChangeAmbientLightIntensity?: (intensity: number) => void;
  moonLightIntensity?: number;
  onChangeMoonLightIntensity?: (intensity: number) => void;
  isSolarSimulatorOpen?: boolean;
  onToggleSolarSimulator?: () => void;
  activeScenePresetId?: string;
  onSelectScenePreset?: (presetId: string) => void;
}

export const GlobeControlsHUD: React.FC<GlobeControlsHUDProps> = ({
  autoRotate,
  onToggleAutoRotate,
  cloudsEnabled,
  onToggleClouds,
  showSolarSystem,
  onToggleSolarSystem,
  showGeodesicRoutes,
  onToggleGeodesicRoutes,
  textureMode,
  onChangeTextureMode,
  season,
  onChangeSeason,
  showBorders,
  onToggleBorders,
  borderRegionFilter = 'all',
  onChangeBorderRegionFilter,
  pinDisplayMode = 'all',
  onTogglePinDisplayMode,
  isTelemetryOpen,
  onToggleTelemetry,
  isTextureInfoOpen,
  onToggleTextureInfoPanel,
  selectedAstroId = 'terra',
  onNavigateToAstro,
  solarHour = null,
  onChangeSolarHour,
  isSolarCyclePlaying = false,
  onToggleSolarCycle,
  currentSolarStatus = 'dia',
  ambientLightIntensity = 0.14,
  onChangeAmbientLightIntensity,
  moonLightIntensity = 0.65,
  onChangeMoonLightIntensity,
  isSolarSimulatorOpen = false,
  onToggleSolarSimulator,
  activeScenePresetId = 'foco-brasil',
  onSelectScenePreset,
}) => {
  const [isAstroMenuOpen, setIsAstroMenuOpen] = useState(false);
  const [isCameraMenuOpen, setIsCameraMenuOpen] = useState(false);
  const [isCosmosMenuOpen, setIsCosmosMenuOpen] = useState(false);
  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState(false);
  const [isSeasonMenuOpen, setIsSeasonMenuOpen] = useState(false);
  const [isTextureMenuOpen, setIsTextureMenuOpen] = useState(false);
  const [isSolarMenuOpen, setIsSolarMenuOpen] = useState(false);

  // Live real-time official Brasília clock (UTC-3)
  const [liveBrasilia, setLiveBrasilia] = useState<{
    formattedTime: string;
    formattedFull: string;
    hours: number;
    minutes: number;
    seconds: number;
    floatHours: number;
    periodName: string;
  }>(() => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const brtHours = (utcHours - 3 + 24) % 24;
    const period =
      brtHours >= 6 && brtHours < 12
        ? 'Manhã'
        : brtHours >= 12 && brtHours < 18
        ? 'Tarde'
        : brtHours >= 18 && brtHours < 24
        ? 'Noite'
        : 'Madrugada';
    return {
      formattedTime: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
      formattedFull: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`,
      hours: brtHours,
      minutes: utcMinutes,
      seconds: utcSeconds,
      floatHours: brtHours + utcMinutes / 60 + utcSeconds / 3600,
      periodName: period,
    };
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const utcSeconds = now.getUTCSeconds();
      const brtHours = (utcHours - 3 + 24) % 24;
      const period =
        brtHours >= 6 && brtHours < 12
          ? 'Manhã'
          : brtHours >= 12 && brtHours < 18
          ? 'Tarde'
          : brtHours >= 18 && brtHours < 24
          ? 'Noite'
          : 'Madrugada';
      setLiveBrasilia({
        formattedTime: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
        formattedFull: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`,
        hours: brtHours,
        minutes: utcMinutes,
        seconds: utcSeconds,
        floatHours: brtHours + utcMinutes / 60 + utcSeconds / 3600,
        periodName: period,
      });
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current) {
        const path = e.composedPath ? e.composedPath() : [];
        if (path.length > 0) {
          if (!path.includes(menuRef.current)) {
            setIsAstroMenuOpen(false);
            setIsCameraMenuOpen(false);
            setIsCosmosMenuOpen(false);
            setIsLayersMenuOpen(false);
            setIsSeasonMenuOpen(false);
            setIsTextureMenuOpen(false);
            setIsSolarMenuOpen(false);
          }
        } else if (!menuRef.current.contains(e.target as Node)) {
          setIsAstroMenuOpen(false);
          setIsCameraMenuOpen(false);
          setIsCosmosMenuOpen(false);
          setIsLayersMenuOpen(false);
          setIsSeasonMenuOpen(false);
          setIsTextureMenuOpen(false);
          setIsSolarMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAstro =
    CELESTIAL_ASTROS_LIST.find((a) => a.id === selectedAstroId) || CELESTIAL_ASTROS_LIST[0];

  return (
    <div
      ref={menuRef}
      id="painel-hud-globo-controles"
      className="painel-hud-controles painel-hud-globo-controles absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 h-11 sm:h-12 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-sky-500/30 text-white shadow-2xl shadow-sky-950/90 pointer-events-auto select-none whitespace-nowrap overflow-visible max-w-[96vw]"
    >
      {/* 1. Seletor de Astro / Planeta (Apenas Ícones) */}
      <div className="relative">
        <button
          id="btn-dropdown-navegar-astro"
          onClick={() => {
            setIsAstroMenuOpen(!isAstroMenuOpen);
            setIsCameraMenuOpen(false);
            setIsCosmosMenuOpen(false);
            setIsLayersMenuOpen(false);
            setIsSeasonMenuOpen(false);
            setIsTextureMenuOpen(false);
            setIsSolarMenuOpen(false);
          }}
          className={`btn-dropdown-navegar-astro flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
            selectedAstroId && selectedAstroId !== 'terra'
              ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
              : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white'
          }`}
          title={`Navegação Astral: ${activeAstro.name} (${activeAstro.category})`}
        >
          <span className="text-base font-sans leading-none">{activeAstro.symbol}</span>
          <ChevronDown
            className={`w-3 h-3 text-cyan-400 transition-transform ${
              isAstroMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isAstroMenuOpen && (
          <div className="absolute bottom-full mb-2.5 left-0 w-64 sm:w-72 rounded-2xl bg-[#030712] border border-cyan-500/50 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[10px] uppercase font-bold text-cyan-400 px-2 py-1 tracking-wider border-b border-slate-800 flex items-center justify-between mb-2">
              <span>Navegação Astral</span>
              <span className="text-[9px] text-slate-400 font-mono">8 Corpos Celestes</span>
            </div>
            {/* Grid compacto de ícones de astros */}
            <div className="grid grid-cols-4 gap-1.5">
              {CELESTIAL_ASTROS_LIST.map((astro) => {
                const isSelected = astro.id === selectedAstroId;
                return (
                  <button
                    key={astro.id}
                    id={`btn-astro-${astro.id}`}
                    onClick={() => {
                      if (onNavigateToAstro) {
                        onNavigateToAstro(astro.id);
                      }
                      setIsAstroMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold scale-105'
                        : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                    }`}
                    title={`${astro.name} • ${astro.category}`}
                  >
                    <span className="text-xl leading-none mb-1">{astro.symbol}</span>
                    <span className="text-[10px] font-serif truncate w-full text-center">
                      {astro.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-slate-800" />

      {/* 2. Câmeras Astronômicas & Visões do Sistema (Novo Ícone Especializado) */}
      {onSelectScenePreset && (
        <>
          <GlobeCameraMenu
            isOpen={isCameraMenuOpen}
            onToggle={() => {
              setIsCameraMenuOpen(!isCameraMenuOpen);
              setIsAstroMenuOpen(false);
              setIsCosmosMenuOpen(false);
              setIsLayersMenuOpen(false);
              setIsSeasonMenuOpen(false);
              setIsTextureMenuOpen(false);
              setIsSolarMenuOpen(false);
            }}
            onClose={() => setIsCameraMenuOpen(false)}
            activePresetId={activeScenePresetId}
            onSelectPreset={onSelectScenePreset}
          />
          <div className="h-5 w-px bg-slate-800" />
        </>
      )}

      {/* 3. Cosmos & Atmosfera (Astros do Sistema Solar + Nuvens + Giro Terra agrupados) */}
      <GlobeCosmosAtmosphereMenu
        isOpen={isCosmosMenuOpen}
        onToggle={() => {
          setIsCosmosMenuOpen(!isCosmosMenuOpen);
          setIsAstroMenuOpen(false);
          setIsCameraMenuOpen(false);
          setIsLayersMenuOpen(false);
          setIsSeasonMenuOpen(false);
          setIsTextureMenuOpen(false);
          setIsSolarMenuOpen(false);
        }}
        onClose={() => setIsCosmosMenuOpen(false)}
        showSolarSystem={showSolarSystem}
        onToggleSolarSystem={onToggleSolarSystem}
        cloudsEnabled={cloudsEnabled}
        onToggleClouds={onToggleClouds}
        autoRotate={autoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
      />

      <div className="h-5 w-px bg-slate-800" />

      {/* 4. Camadas do Território (Rotas Geodésicas + Brasões dos Estados + Fronteiras e Regiões) */}
      <GlobeTerritoryLayersMenu
        isOpen={isLayersMenuOpen}
        onToggle={() => {
          setIsLayersMenuOpen(!isLayersMenuOpen);
          setIsAstroMenuOpen(false);
          setIsCameraMenuOpen(false);
          setIsCosmosMenuOpen(false);
          setIsSeasonMenuOpen(false);
          setIsTextureMenuOpen(false);
          setIsSolarMenuOpen(false);
        }}
        onClose={() => setIsLayersMenuOpen(false)}
        showGeodesicRoutes={showGeodesicRoutes}
        onToggleGeodesicRoutes={onToggleGeodesicRoutes}
        pinDisplayMode={pinDisplayMode}
        onTogglePinDisplayMode={onTogglePinDisplayMode}
        showBorders={showBorders}
        onToggleBorders={onToggleBorders}
        borderRegionFilter={borderRegionFilter}
        onChangeBorderRegionFilter={onChangeBorderRegionFilter}
      />

      {/* 5. Painel Lateral de Telemetria (Icon Only) */}
      {onToggleTelemetry && (
        <>
          <div className="h-5 w-px bg-slate-800" />
          <button
            id="btn-hud-toggle-telemetria"
            onClick={onToggleTelemetry}
            className={`btn-toggle-telemetria p-2 rounded-xl text-xs transition-all cursor-pointer ${
              isTelemetryOpen
                ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
            }`}
            title={isTelemetryOpen ? 'Recolher Painel Lateral' : 'Expandir Painel Lateral'}
          >
            <Sliders className="w-4 h-4 text-sky-400" />
          </button>
        </>
      )}

      <div className="h-5 w-px bg-slate-800" />

      {/* 4. Estações do Ano Reformulado (Clean & Structured) */}
      <div className="relative">
        <button
          id="btn-menu-estacoes"
          onClick={() => {
            setIsSeasonMenuOpen(!isSeasonMenuOpen);
            setIsAstroMenuOpen(false);
            setIsCameraMenuOpen(false);
            setIsCosmosMenuOpen(false);
            setIsLayersMenuOpen(false);
            setIsTextureMenuOpen(false);
            setIsSolarMenuOpen(false);
          }}
          className={`btn-menu-estacoes p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border ${
            isSeasonMenuOpen
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent hover:border-amber-500/30'
          }`}
          title="Simulação de Estações e Insolação Axial"
        >
          <Calendar className="w-4 h-4 text-amber-400" />
        </button>

        {isSeasonMenuOpen && (
          <div className="absolute bottom-full mb-2.5 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-[340px] sm:w-[410px] max-w-[calc(100vw-20px)] rounded-2xl bg-[#030712] border border-amber-500/50 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 space-y-2 backdrop-blur-2xl whitespace-normal break-words animate-in fade-in zoom-in-95 duration-150">
            {/* Header with Astronomical Obliquity Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Estações do Ano
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0 whitespace-nowrap">
                Obliquidade: 23,44°
              </span>
            </div>

            {/* List of Seasons */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
              {Object.entries(SEASONS_CATALOG).map(([key, desc]) => {
                const isSelected = season === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChangeSeason(key as GlobeSeason);
                      setIsSeasonMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col cursor-pointer border whitespace-normal break-words ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">
                          {key === 'realtime' ? (
                            <Clock className="w-4 h-4 text-sky-400" />
                          ) : key === 'summer_solstice' ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : key === 'autumn_equinox' ? (
                            <Leaf className="w-4 h-4 text-amber-500" />
                          ) : key === 'winter_solstice' ? (
                            <Snowflake className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Flower2 className="w-4 h-4 text-pink-400" />
                          )}
                        </span>
                        <span className="font-bold text-slate-100">{desc.ptName}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0 whitespace-nowrap">
                        {desc.astronomicalDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed whitespace-normal break-words">
                      {desc.brazilImpact}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-slate-800" />

      {/* 5. Ícone Dedicado: Simular Movimento do Sol & Alternância Dia/Noite (Fuso de Brasília) */}
      <div className="relative">
        <button
          id="btn-simular-movimento-sol"
          onClick={() => {
            if (onToggleSolarSimulator) {
              onToggleSolarSimulator();
            } else {
              setIsSolarMenuOpen(!isSolarMenuOpen);
            }
            setIsAstroMenuOpen(false);
            setIsCameraMenuOpen(false);
            setIsCosmosMenuOpen(false);
            setIsLayersMenuOpen(false);
            setIsSeasonMenuOpen(false);
            setIsTextureMenuOpen(false);
          }}
          className={`btn-simular-movimento-sol p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border ${
            isSolarSimulatorOpen || isSolarMenuOpen || isSolarCyclePlaying
              ? 'bg-amber-500/25 text-amber-200 border-amber-400 shadow-md shadow-amber-500/20'
              : solarHour === 0 || (solarHour === null && (liveBrasilia.hours < 6 || liveBrasilia.hours >= 18))
              ? 'text-indigo-300 hover:text-indigo-100 hover:bg-slate-800 border-transparent hover:border-indigo-500/40'
              : 'text-amber-400 hover:text-amber-200 hover:bg-slate-800 border-transparent hover:border-amber-500/40'
          }`}
          title={`Simulador Solar Dia/Noite • Fuso de Brasília (${liveBrasilia.formattedTime} BRT)`}
        >
          {solarHour === 0 || (solarHour === null && (liveBrasilia.hours < 6 || liveBrasilia.hours >= 18)) ? (
            <Moon className={`w-4 h-4 text-indigo-300 ${isSolarCyclePlaying ? 'animate-pulse' : ''}`} />
          ) : (
            <Sun className={`w-4 h-4 text-amber-400 ${isSolarCyclePlaying ? 'animate-spin' : ''}`} />
          )}
        </button>

        {!onToggleSolarSimulator && isSolarMenuOpen && (
          <div className="absolute bottom-full mb-2.5 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-[350px] sm:w-[420px] max-w-[calc(100vw-20px)] rounded-2xl bg-[#030712] border border-amber-500/50 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 space-y-3 backdrop-blur-2xl whitespace-normal break-words animate-in fade-in zoom-in-95 duration-150">
            {/* Header com Horário Oficial de Brasília ao Vivo */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Simulador Solar e Dia / Noite
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>BRT (UTC-3)</span>
              </div>
            </div>

            {/* Alternador Imediato Dia / Noite / Tempo Real (1 Clique) */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
                <span>Alternar Iluminação Global</span>
                <span className="text-slate-500 font-normal">Ajuste instantâneo</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  id="btn-quick-dia-pleno"
                  onClick={() => onChangeSolarHour?.(12)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour === 12
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/25'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                  }`}
                  title="Iluminação total a pino sobre o Brasil (12:00 BRT)"
                >
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                  <span>Dia (12:00)</span>
                </button>

                <button
                  type="button"
                  id="btn-quick-noite-plena"
                  onClick={() => onChangeSolarHour?.(0)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour === 0
                      ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md shadow-indigo-500/25'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-indigo-300 border-indigo-500/30'
                  }`}
                  title="Noite total no Brasil com luzes urbanas da NASA (00:00 BRT)"
                >
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span>Noite (00:00)</span>
                </button>

                <button
                  type="button"
                  id="btn-quick-tempo-real"
                  onClick={() => onChangeSolarHour?.(null)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour === null
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/25'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-sky-300 border-sky-500/30'
                  }`}
                  title={`Sincronizar com a hora oficial de Brasília agora (${liveBrasilia.formattedTime} BRT)`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Agora ({liveBrasilia.formattedTime})</span>
                </button>
              </div>
            </div>

            {/* Painel de Status Detalhado */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-slate-800 border border-slate-700">
                    {currentSolarStatus === 'dia' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : currentSolarStatus === 'crepusculo' ? (
                      <Sunrise className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>
                        {currentSolarStatus === 'dia'
                          ? 'Dia Pleno no Brasil'
                          : currentSolarStatus === 'crepusculo'
                          ? 'Crepúsculo Solar (Amanhecer / Pôr do Sol)'
                          : 'Noite Fechada • Luzes Urbanas'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Oficial Brasília Agora:{' '}
                      <span className="text-sky-300 font-bold">{liveBrasilia.formattedFull} BRT</span>{' '}
                      <span className="text-slate-500">({liveBrasilia.periodName})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block mb-0.5 ${
                      currentSolarStatus === 'dia'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : currentSolarStatus === 'crepusculo'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {currentSolarStatus}
                  </span>
                  <span className="text-[9px] text-amber-300 font-mono">
                    {solarHour !== null
                      ? `${Math.floor(solarHour).toString().padStart(2, '0')}:${Math.floor(
                          (solarHour % 1) * 60
                        )
                          .toString()
                          .padStart(2, '0')} BRT`
                      : 'Sincronizado'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 leading-tight pt-0.5 border-t border-slate-800/80">
                {solarHour === null ? (
                  <span>
                    O shader está perfeitamente sincronizado com o Sol real deste instante no território
                    brasileiro.
                  </span>
                ) : (
                  <span>
                    Posição solar simulada em{' '}
                    <strong className="text-amber-200">
                      {Math.floor(solarHour).toString().padStart(2, '0')}:
                      {Math.floor((solarHour % 1) * 60)
                        .toString()
                        .padStart(2, '0')}{' '}
                      BRT
                    </strong>
                    . Clique em &quot;Agora&quot; para restaurar o tempo real.
                  </span>
                )}
              </div>
            </div>

            {/* Slider de Hora Solar com Gradiente e Ajuste Fino */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Linha do Tempo (00h às 24h)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const current = solarHour ?? liveBrasilia.floatHours;
                      const next = (current - 1 + 24) % 24;
                      onChangeSolarHour?.(next);
                    }}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] cursor-pointer flex items-center gap-0.5"
                    title="Avançar 1 hora para trás"
                  >
                    <Minus className="w-3 h-3" />
                    <span>1h</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const current = solarHour ?? liveBrasilia.floatHours;
                      const next = (current + 1) % 24;
                      onChangeSolarHour?.(next);
                    }}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] cursor-pointer flex items-center gap-0.5"
                    title="Avançar 1 hora para a frente"
                  >
                    <Plus className="w-3 h-3" />
                    <span>1h</span>
                  </button>
                </div>
              </div>

              {/* Barra do slider com gradiente do céu (noite -> aurora -> meio-dia -> crepúsculo -> noite) */}
              <div className="relative pt-1">
                <input
                  id="slider-hora-solar-popup"
                  type="range"
                  min="0"
                  max="23.9"
                  step="0.25"
                  value={solarHour ?? liveBrasilia.floatHours}
                  onChange={(e) => onChangeSolarHour?.(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2.5 rounded-lg appearance-none bg-gradient-to-r from-slate-950 via-amber-700 via-amber-400 via-orange-600 to-slate-950 border border-slate-700"
                  aria-label="Ajustar hora solar do sombreador da Terra"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-0.5">
                  <span className="flex items-center gap-0.5">
                    <Moon className="w-2.5 h-2.5 text-indigo-400" /> 00h
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Sunrise className="w-2.5 h-2.5 text-amber-300" /> 06h
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Sun className="w-2.5 h-2.5 text-amber-400" /> 12h
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Sunset className="w-2.5 h-2.5 text-orange-400" /> 18h
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Moon className="w-2.5 h-2.5 text-indigo-400" /> 24h
                  </span>
                </div>
              </div>
            </div>

            {/* Atalhos Rápidos com Ícones Reais */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => onChangeSolarHour?.(6)}
                className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 border cursor-pointer transition-all ${
                  solarHour === 6
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title="06:00 BRT - Amanhecer sobre o Oceano Atlântico e Costa Leste"
              >
                <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                <span>06h Leste</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeSolarHour?.(12)}
                className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 border cursor-pointer transition-all ${
                  solarHour === 12
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title="12:00 BRT - Sol a pino no Zênite sobre o Centro-Oeste e Brasília"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>12h Pino</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeSolarHour?.(18)}
                className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 border cursor-pointer transition-all ${
                  solarHour === 18
                    ? 'bg-orange-500/25 text-orange-200 border-orange-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title="18:00 BRT - Pôr do Sol e Crepúsculo na Amazônia e Fronteira Oeste"
              >
                <Sunset className="w-3.5 h-3.5 text-orange-400" />
                <span>18h Oeste</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeSolarHour?.(0)}
                className={`p-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 border cursor-pointer transition-all ${
                  solarHour === 0
                    ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title="00:00 BRT - Meia-noite / Luzes Urbanas das Metrópoles Brasileiras"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>00h Noite</span>
              </button>
            </div>

            {/* Técnica de Iluminação de 3 Pontos: Sol Hard + Lua Soft Box + Ambient Fake */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Iluminação de 3 Pontos
                </span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  Estúdio Planetário
                </span>
              </div>

              {/* 1. Sol - Luz Hard (Key Light) */}
              <div className="bg-slate-900/60 p-2 rounded-xl border border-amber-500/20 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-amber-200 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    1. Sol — Luz Hard (Key Light)
                  </span>
                  <span className="text-amber-400 font-mono text-[9px] font-bold">Direcional 100%</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-tight">
                  Feixe solar nítido com sombras terminadoras de alto contraste e reflexo especular cristalino nos oceanos.
                </p>
              </div>

              {/* 2. Lua - Luz de Preenchimento / Soft Box Natural (Fill Light com Leve Glow) */}
              <div className="bg-slate-900/60 p-2 rounded-xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-[10px] font-bold text-indigo-200">
                      2. Lua — Soft Box Natural (Fill Light)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    {Math.round(moonLightIntensity * 100)}%
                  </span>
                </div>

                {/* Presets Rápidos do Luar */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    id="btn-moon-suave"
                    onClick={() => onChangeMoonLightIntensity?.(0.35)}
                    className={`py-1 px-1.5 rounded-lg text-[9px] font-medium border cursor-pointer transition-all ${
                      Math.abs(moonLightIntensity - 0.35) < 0.05
                        ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                    title="35% - Luar suave e discreto"
                  >
                    Suave (35%)
                  </button>
                  <button
                    type="button"
                    id="btn-moon-balance"
                    onClick={() => onChangeMoonLightIntensity?.(0.65)}
                    className={`py-1 px-1.5 rounded-lg text-[9px] font-medium border cursor-pointer transition-all ${
                      Math.abs(moonLightIntensity - 0.65) < 0.05
                        ? 'bg-indigo-500 text-slate-950 border-indigo-300 font-bold shadow-sm shadow-indigo-500/25'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                    title="65% - Soft box natural balanceado com leve glow"
                  >
                    Natural (65%)
                  </button>
                  <button
                    type="button"
                    id="btn-moon-pleno"
                    onClick={() => onChangeMoonLightIntensity?.(0.95)}
                    className={`py-1 px-1.5 rounded-lg text-[9px] font-medium border cursor-pointer transition-all ${
                      Math.abs(moonLightIntensity - 0.95) < 0.05
                        ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                    title="95% - Luar intenso e brilhante"
                  >
                    Pleno (95%)
                  </button>
                </div>

                {/* Slider da Luz da Lua */}
                <div>
                  <input
                    id="slider-luz-lua"
                    type="range"
                    min="0.10"
                    max="1.00"
                    step="0.01"
                    value={moonLightIntensity}
                    onChange={(e) => onChangeMoonLightIntensity?.(parseFloat(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer h-1.5 rounded-lg appearance-none bg-gradient-to-r from-slate-950 via-indigo-900 to-indigo-400 border border-slate-700"
                    aria-label="Ajustar intensidade do soft box lunar"
                  />
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono mt-0.5">
                    <span>10% Sutil</span>
                    <span className="text-indigo-400/90">65% Soft Box Ideal</span>
                    <span>100% Intenso</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-tight">
                  A Lua atua como <strong>soft box natural</strong> envolvente: ilumina a penumbra com tom prateado-azulado, leve glow difuso e reflexo acetinado na água.
                </p>
              </div>

              {/* 3. Ambient Light: Luz Fake Suave para Gaps */}
              <div className="bg-slate-900/60 p-2 rounded-xl border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-[10px] font-bold text-sky-200">
                      3. Luz Ambiente (Fake Gaps Fill)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/20 px-1.5 py-0.5 rounded border border-sky-500/30">
                    {Math.round(ambientLightIntensity * 100)}%
                  </span>
                </div>

                {/* Presets Rápidos de Luz Ambiente */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    id="btn-ambient-minimo"
                    onClick={() => onChangeAmbientLightIntensity?.(0.08)}
                    className={`py-1 px-1.5 rounded-lg text-[9px] font-medium border cursor-pointer transition-all ${
                      Math.abs(ambientLightIntensity - 0.08) < 0.03
                        ? 'bg-sky-500/30 text-sky-200 border-sky-400 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                    title="8% - Contraste espacial profundo"
                  >
                    Mínimo (8%)
                  </button>
                  <button
                    type="button"
                    id="btn-ambient-balance"
                    onClick={() => onChangeAmbientLightIntensity?.(0.14)}
                    className={`py-1 px-1.5 rounded-lg text-[9px] font-medium border cursor-pointer transition-all ${
                      Math.abs(ambientLightIntensity - 0.14) < 0.03
                        ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold shadow-sm shadow-sky-500/25'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                    title="14% - Equilíbrio recomendado para preencher frestas"
                  >
                    Ideal (14%)
                  </button>
                  <button
                    type="button"
                    id="btn-ambient-suave"
                    onClick={() => onChangeAmbientLightIntensity?.(0.24)}
                    className={`py-1 px-1.5 rounded-lg text-[9px] font-medium border cursor-pointer transition-all ${
                      Math.abs(ambientLightIntensity - 0.24) < 0.03
                        ? 'bg-sky-500/30 text-sky-200 border-sky-400 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                    title="24% - Preenchimento suave extra"
                  >
                    Suave (24%)
                  </button>
                </div>

                {/* Slider de Luz Ambiente */}
                <div>
                  <input
                    id="slider-luz-ambiente"
                    type="range"
                    min="0.04"
                    max="0.35"
                    step="0.01"
                    value={ambientLightIntensity}
                    onChange={(e) => onChangeAmbientLightIntensity?.(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer h-1.5 rounded-lg appearance-none bg-gradient-to-r from-slate-950 via-sky-900 to-sky-400 border border-slate-700"
                    aria-label="Ajustar intensidade da luz ambiente fake"
                  />
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono mt-0.5">
                    <span>4% Profundo</span>
                    <span className="text-sky-400/90">14% Equilíbrio Ideal</span>
                    <span>35% Claro</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-tight">
                  Luz fake omnidirecional que preenche pequenos gaps e depressões de relevo sem deixar sombras 100% pretas.
                </p>
              </div>
            </div>

            {/* Animação Contínua 24h */}
            <div className="pt-1 border-t border-slate-800">
              <button
                type="button"
                id="btn-toggle-animacao-sol"
                onClick={onToggleSolarCycle}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  isSolarCyclePlaying
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/25'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
                title={isSolarCyclePlaying ? 'Pausar Simulação' : 'Iniciar Rotação Automática de 24 Horas'}
              >
                {isSolarCyclePlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar Rotação Solar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Animar Ciclo Solar Contínuo (24h)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-slate-800" />

      {/* 6. Mosaicos Globais de Textura & Painel Explicativo */}
      <div className="relative">
        <button
          id="btn-menu-texturas"
          onClick={() => {
            setIsTextureMenuOpen(!isTextureMenuOpen);
            setIsAstroMenuOpen(false);
            setIsCameraMenuOpen(false);
            setIsCosmosMenuOpen(false);
            setIsLayersMenuOpen(false);
            setIsSeasonMenuOpen(false);
            setIsSolarMenuOpen(false);
          }}
          className={`btn-menu-texturas p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border ${
            isTextureMenuOpen
              ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent hover:border-sky-500/30'
          }`}
          title="Mosaico e Textura da Superfície Terrestre"
        >
          <Globe className="w-4 h-4 text-sky-400" />
        </button>

        {isTextureMenuOpen && (
          <div className="absolute bottom-full mb-2.5 right-0 w-80 max-w-[calc(100vw-20px)] max-h-[min(80vh,520px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 rounded-2xl bg-[#030712] border border-sky-500/50 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 space-y-1.5 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 px-1">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                Mosaicos e Texturas Globais
              </span>
              {onToggleTextureInfoPanel && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleTextureInfoPanel();
                    setIsTextureMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-[10px] text-sky-300 hover:text-sky-100 hover:underline cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>Explicação</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                onChangeTextureMode('nasa_satellite');
                setIsTextureMenuOpen(false);
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                textureMode === 'nasa_satellite'
                  ? 'bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/30'
                  : 'text-slate-300 hover:bg-slate-900/90'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold">NASA Blue Marble (Dia/Noite)</div>
                <div className="text-[10px] text-slate-400 truncate">Terminador dinâmico e luzes noturnas</div>
              </div>
            </button>

            <button
              onClick={() => {
                onChangeTextureMode('nasa_full_day');
                setIsTextureMenuOpen(false);
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                textureMode === 'nasa_full_day' || textureMode === 'natural_earth'
                  ? 'bg-emerald-500/20 text-emerald-200 font-semibold border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-900/90'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold">NASA Blue Marble (Dia Total 100%)</div>
                <div className="text-[10px] text-slate-400 truncate">Iluminação diurna plena em todo o globo</div>
              </div>
            </button>

            <button
              onClick={() => {
                onChangeTextureMode('night_lights');
                setIsTextureMenuOpen(false);
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                textureMode === 'night_lights'
                  ? 'bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900/90'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold">NASA Black Marble</div>
                <div className="text-[10px] text-slate-400 truncate">Metrópoles e centros urbanos noturnos</div>
              </div>
            </button>

            <button
              onClick={() => {
                onChangeTextureMode('specular_topo');
                setIsTextureMenuOpen(false);
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                textureMode === 'specular_topo'
                  ? 'bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-900/90'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold">Relevo e Batimetria Especular</div>
                <div className="text-[10px] text-slate-400 truncate">Topografia e reflexo solar nos oceanos</div>
              </div>
            </button>

            <button
              onClick={() => {
                onChangeTextureMode('el_nino_sst');
                setIsTextureMenuOpen(false);
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                textureMode === 'el_nino_sst'
                  ? 'bg-orange-500/20 text-orange-200 font-semibold border border-orange-500/30'
                  : 'text-slate-300 hover:bg-slate-900/90'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold">El Niño & Anomalia Térmica (SST)</div>
                <div className="text-[10px] text-slate-400 truncate">Aquecimento das águas equatoriais</div>
              </div>
            </button>

            <button
              onClick={() => {
                onChangeTextureMode('flood_hydrology');
                setIsTextureMenuOpen(false);
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                textureMode === 'flood_hydrology'
                  ? 'bg-teal-500/20 text-teal-200 font-semibold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-900/90'
              }`}
            >
              <CloudRain className="w-4 h-4 text-teal-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold">Hidrologia & Inundações (NDWI)</div>
                <div className="text-[10px] text-slate-400 truncate">Saturação de solo e bacias hidrográficas</div>
              </div>
            </button>

            {/* Discreet Button to open right info panel */}
            {onToggleTextureInfoPanel && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onToggleTextureInfoPanel();
                    setIsTextureMenuOpen(false);
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-sky-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
                >
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>Abrir Painel de Dados dos Sensores</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
