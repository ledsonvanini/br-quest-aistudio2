import React, { useState } from 'react';
import { ClimateMode } from './ClimatePhenomenaLayer';
import {
  ClimateStationData,
  ElNinoIndexData,
  ECMWF_TEMP_COLOR_STOPS,
} from '../../services/climateService';
import { TerrainTileProvider } from './ClippedMapTilesLayer';
import {
  Wind,
  CloudRain,
  Flame,
  Activity,
  RefreshCw,
  X,
  Gauge,
  Compass,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  Thermometer,
  ThermometerSun,
  Layers,
  Globe,
  Radio,
  Waves,
  Feather,
  Sun,
  Cloud,
  Droplets,
} from 'lucide-react';

interface ClimateControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ClimateMode;
  onModeChange: (mode: ClimateMode) => void;
  stations: ClimateStationData[];
  elNinoData: ElNinoIndexData | null;
  selectedStation: ClimateStationData | null;
  onSelectStation: (station: ClimateStationData | null) => void;
  speedMultiplier: number;
  onSpeedMultiplierChange: (speed: number) => void;
  onRefreshTelemetry: () => void;
  isLoading?: boolean;
  updatedAt?: string;
  dateTimeFormatted?: string;
  terrainProvider?: TerrainTileProvider;
  onTerrainProviderChange?: (provider: TerrainTileProvider) => void;
  avgTempBrazil?: number;
  maxTempState?: { stateId: string; temp: number };
  minTempState?: { stateId: string; temp: number };
  wavesEnabled?: boolean;
  onToggleWaves?: () => void;
  atmosphereEnabled?: boolean;
  onToggleAtmosphere?: () => void;
  cloudsEnabled?: boolean;
  onToggleClouds?: () => void;
  rainSimEnabled?: boolean;
  onToggleRainSim?: () => void;
}

export const ClimateControlPanel: React.FC<ClimateControlPanelProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  stations,
  elNinoData,
  selectedStation,
  onSelectStation,
  speedMultiplier,
  onSpeedMultiplierChange,
  onRefreshTelemetry,
  isLoading = false,
  updatedAt,
  dateTimeFormatted = 'Hoje, 15:00 (-03)',
  terrainProvider = 'muted_gray',
  onTerrainProviderChange,
  avgTempBrazil = 27.4,
  maxTempState = { stateId: 'MT', temp: 35.1 },
  minTempState = { stateId: 'RS', temp: 17.5 },
  wavesEnabled = true,
  onToggleWaves,
  atmosphereEnabled = true,
  onToggleAtmosphere,
  cloudsEnabled = true,
  onToggleClouds,
  rainSimEnabled = false,
  onToggleRainSim,
}) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'environment' | 'enso'>('modes');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  if (!isOpen) return null;

  const MODES_CONFIG: {
    id: ClimateMode;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }[] = [
    {
      id: 'temperaturas_frentes',
      label: 'Temperatura & Calor',
      shortLabel: 'Temperatura',
      icon: <Thermometer className="w-4 h-4" />,
      color: 'from-amber-500 to-red-600',
      description:
        'Mapa coroplético térmico com interpolação de calor em alta precisão (Escala ECMWF de -4°C a 36°C) e frentes térmicas estaduais.',
    },
    {
      id: 'ventos_aliseos',
      label: 'Ventos Alísios & Rios Voadores',
      shortLabel: 'Ventos & Rios',
      icon: <Wind className="w-4 h-4" />,
      color: 'from-sky-500 to-emerald-500',
      description:
        'Ventos que sopram dos trópicos para o Equador sobre o Atlântico, adentrando a Bacia Amazônica e alimentando os "Rios Voadores" em direção ao Sudeste e Sul.',
    },
    {
      id: 'precipitacao_zcas',
      label: 'ZCAS & Chuvas Continentais',
      shortLabel: 'ZCAS & Chuvas',
      icon: <CloudRain className="w-4 h-4" />,
      color: 'from-cyan-500 to-blue-600',
      description:
        'Zona de Convergência do Atlântico Sul (ZCAS): faixa diagonal de nebulosidade e chuvas persistentes que liga a Amazônia ao Sudeste do Brasil.',
    },
    {
      id: 'el_nino_la_nina',
      label: 'El Niño & La Niña (ENSO)',
      shortLabel: 'El Niño (ENSO)',
      icon: <Activity className="w-4 h-4" />,
      color: 'from-amber-500 to-rose-500',
      description:
        'Oscilação térmica do Oceano Pacífico Equatorial e Corrente de Humboldt, alterando drasticamente o regime de chuvas e secas no Brasil.',
    },
  ];

  const currentModeInfo = MODES_CONFIG.find((m) => m.id === mode) || MODES_CONFIG[0];

  return (
    <>
      {/* 1. TOP HORIZONTAL TOOLBAR & ATTACHED SCIENTIFIC LEGEND BAR */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="painel-cabecalho-clima fixed top-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto max-w-[96vw] gap-1.5"
      >
        <div className="bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500/60 rounded-2xl px-2.5 sm:px-3 py-1.5 shadow-2xl shadow-black/90 flex items-center gap-1.5 sm:gap-2 text-white flex-nowrap whitespace-nowrap overflow-x-auto custom-scrollbar">
          
          {/* HIGH-VISIBILITY EXIT BUTTON: Voltar à Navegação (ÚNICO COM TEXTO) */}
          <button
            onClick={onClose}
            id="btn-voltar-navegacao-relevo"
            className="btn-voltar-navegacao flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-serif font-black text-xs tracking-wide shadow-md shadow-amber-500/30 hover:from-amber-300 hover:to-yellow-400 hover:scale-105 active:scale-95 border border-yellow-200 transition-all duration-200 cursor-pointer group shrink-0"
            title="Voltar à Navegação do Mapa 3D"
          >
            <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform duration-300 shrink-0" />
            <span>Voltar</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />

          {/* Quick Mode Switching Pills (Apenas Ícones com Balões Informativos) */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
            {MODES_CONFIG.map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`btn-modo-${m.id} w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative group ${
                  mode === m.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={`${m.label} • ${m.description}`}
                aria-label={m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />

          {/* Dedicated Ambient Actions: Simular Chuva, Nuvens, Ondas, Pássaros (Apenas Ícones) */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
            {/* Simular Chuva */}
            {onToggleRainSim && (
              <button
                onClick={onToggleRainSim}
                className={`btn-simular-chuva w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  rainSimEnabled
                    ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-md shadow-cyan-500/30 scale-105'
                    : 'text-cyan-400 hover:bg-cyan-950/60 hover:text-cyan-300'
                }`}
                title="Simular Chuva & Radar Pluviométrico (Distribuição e Ranking dos Estados)"
                aria-label="Simular Chuva"
              >
                <Droplets className="w-4 h-4" />
              </button>
            )}

            {/* Nuvens Animadas */}
            {onToggleClouds && (
              <button
                onClick={onToggleClouds}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  cloudsEnabled
                    ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Nuvens Cumulus & Sombras no Relevo"
                aria-label="Nuvens Cumulus"
              >
                <Cloud className="w-4 h-4" />
              </button>
            )}

            {/* Ondas Oceânicas */}
            {onToggleWaves && (
              <button
                onClick={onToggleWaves}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  wavesEnabled
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Ondas & Espuma Costeira do Atlântico"
                aria-label="Ondas Oceânicas"
              >
                <Waves className="w-4 h-4" />
              </button>
            )}

            {/* Gaivotas / Pássaros */}
            {onToggleAtmosphere && (
              <button
                onClick={onToggleAtmosphere}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  atmosphereEnabled
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Gaivotas & Brisa Atmosférica"
                aria-label="Gaivotas e Pássaros"
              >
                <Feather className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0" />

          {/* Controls toggle button (Apenas Ícone com Tooltip) */}
          <button
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className={`btn-toggle-detalhes-clima w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isDrawerOpen
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Abrir/Recolher Observatório Meteorológico"
            aria-label="Observatório Meteorológico"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* ATTACHED SUB-BAR: SCIENTIFIC SCALE & LEGEND (Compact, Single-line, No-wrap, Explanations on hover) */}
        {mode === 'precipitacao_zcas' && (
          <div className="painel-legenda-chuva-topo flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/50 shadow-xl shadow-black/80 text-xs text-white animate-in fade-in slide-in-from-top-2 duration-200 flex-nowrap whitespace-nowrap overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1 font-bold text-cyan-300 text-[11px] shrink-0">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chuva:</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] font-semibold flex-nowrap">
              <span
                title="Estiagem / Chuva Quase Nula: Menos de 5 mm acumulados ao dia"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" /> 0-5mm
              </span>
              <span
                title="Chuva Leve / Garoa: Entre 5 e 20 mm acumulados ao dia"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> 5-20mm
              </span>
              <span
                title="Chuva Moderada: Entre 20 e 45 mm acumulados ao dia"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> 20-45mm
              </span>
              <span
                title="Chuva Forte / Temporal: Entre 45 e 70 mm acumulados ao dia"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> 45-70mm
              </span>
              <span
                title="Zona de Convergência do Atlântico Sul (ZCAS): Tempestades severas acima de 70 mm ao dia"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-950/90 text-red-300 border border-red-700/60 font-bold hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" /> &gt;70mm ZCAS
              </span>
            </div>
          </div>
        )}

        {mode === 'temperaturas_frentes' && (
          <div className="painel-legenda-temperatura-topo flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/95 backdrop-blur-md border border-amber-500/50 shadow-xl shadow-black/80 text-xs text-white animate-in fade-in slide-in-from-top-2 duration-200 flex-nowrap whitespace-nowrap overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1 font-bold text-amber-300 text-[11px] shrink-0">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temp (°C):</span>
            </div>
            <div className="flex items-center gap-1">
              {ECMWF_TEMP_COLOR_STOPS.map((stop) => (
                <div
                  key={stop.label}
                  title={`Faixa Térmica: ${stop.label} • Paleta Padrão Meteorológico ECMWF / Meteored`}
                  className="cursor-help flex flex-col items-center hover:scale-110 transition-transform"
                >
                  <div
                    className="w-4 sm:w-5 h-2 rounded-sm shadow-inner"
                    style={{ backgroundColor: stop.hex }}
                  />
                  <span className="text-[8px] sm:text-[9px] font-mono text-slate-300 mt-0.5 font-bold">{stop.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'ventos_aliseos' && (
          <div className="painel-legenda-ventos-topo flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-xl bg-slate-950/95 backdrop-blur-md border border-emerald-500/50 shadow-xl shadow-black/80 text-xs text-white animate-in fade-in slide-in-from-top-2 duration-200 flex-nowrap whitespace-nowrap overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1 font-bold text-emerald-300 text-[11px] shrink-0">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ventos:</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] font-semibold flex-nowrap">
              <span
                title="Rios Voadores da Amazônia: Corredor de vapor d'água (~200.000 m³/s) canalizado pela Cordilheira dos Andes até o Centro-Oeste e Sudeste"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Rios Voadores
              </span>
              <span
                title="Ventos Alísios de Nordeste (NE): Sopram do Hemisfério Norte sobre a calha equatorial"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Alísios NE
              </span>
              <span
                title="Ventos Alísios de Sudeste (SE): Trazem umidade marítima do Atlântico Sul para o litoral brasileiro"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Alísios SE
              </span>
            </div>
          </div>
        )}

        {mode === 'el_nino_la_nina' && (
          <div className="painel-legenda-elnino-topo flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-xl bg-slate-950/95 backdrop-blur-md border border-amber-500/50 shadow-xl shadow-black/80 text-xs text-white animate-in fade-in slide-in-from-top-2 duration-200 flex-nowrap whitespace-nowrap overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1 font-bold text-amber-300 text-[11px] shrink-0">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>El Niño:</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] font-semibold flex-nowrap">
              <span
                title="Norte e Nordeste: Aquecimento do Pacífico provoca secas severas, estiagem e altas temperaturas"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-950/90 text-red-300 border border-red-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> Seca (N / NE)
              </span>
              <span
                title="Região Sul: Bloqueio atmosférico retém frentes frias, provocando tempestades e enchentes frequentes"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Chuvas (Sul)
              </span>
              <span
                title="Centro-Oeste e Sudeste: Zona de transição com variabilidade térmica e pancadas de chuva"
                className="cursor-help flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/95 text-slate-300 border border-slate-700/60 hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" /> Neutro (CO / SE)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. RIGHT FLOATING METEOROLOGY & ENVIRONMENT DRAWER */}
      {isDrawerOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="painel-observatorio-clima absolute top-20 right-6 z-40 w-96 max-h-[85vh] bg-slate-950/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900/90 to-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
                  Observatório Ambiental
                </h3>
                <p className="text-[11px] text-slate-400">Telemetria Real • Open-Meteo & ECMWF</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onRefreshTelemetry}
                disabled={isLoading}
                title="Atualizar dados em tempo real"
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick National Summary Banner */}
          <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Média Brasil</div>
              <div className="font-black text-amber-400 text-sm">{avgTempBrazil}°C</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Máx ({maxTempState.stateId})</div>
              <div className="font-black text-red-400 text-sm">{maxTempState.temp}°C</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Mín ({minTempState.stateId})</div>
              <div className="font-black text-sky-400 text-sm">{minTempState.temp}°C</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800/80 bg-slate-900/40 p-1 gap-1">
            <button
              onClick={() => setActiveTab('modes')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'modes'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fenômenos
            </button>
            <button
              onClick={() => setActiveTab('environment')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'environment'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ambiente & Visual
            </button>
            <button
              onClick={() => setActiveTab('enso')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'enso'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              El Niño (ENSO)
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 overflow-y-auto space-y-4 max-h-[55vh] custom-scrollbar text-xs">
            {activeTab === 'modes' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed">
                  {currentModeInfo.description}
                </div>

                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="space-y-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      Velocidade da Dinâmica dos Ventos
                    </span>
                    <span className="text-amber-400 font-mono font-black">{speedMultiplier.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={speedMultiplier}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => onSpeedMultiplierChange(parseFloat(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((speedMultiplier - 0.5) / 2.0) * 100}%, #1e293b ${((speedMultiplier - 0.5) / 2.0) * 100}%, #1e293b 100%)`,
                    }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Stations List */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400">Estações Oceânicas & Costeiras</span>
                  <div className="space-y-1.5">
                    {stations.map((station) => (
                      <div
                        key={station.id}
                        onClick={() => onSelectStation(selectedStation?.id === station.id ? null : station)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedStation?.id === station.id
                            ? 'bg-slate-900 border-amber-500 shadow-md'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-200">{station.name}</div>
                          <div className="text-[10px] text-slate-400">{station.phenomenon}</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="font-bold text-amber-400">{station.temperature}°C</div>
                          <div className="text-[10px] text-slate-400">{station.windSpeed} km/h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'environment' && (
              <div className="space-y-4">
                {/* 1. Dynamic Environment Layers Toggles */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Dinâmica Físico-Ambiental
                  </span>

                  {/* Rain Simulation Toggle */}
                  {onToggleRainSim && (
                    <div
                      onClick={onToggleRainSim}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        rainSimEnabled
                          ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">Simulação de Chuva & Ranking</div>
                          <div className="text-[11px] text-slate-400">
                            Gotas de precipitação animadas e ranking dos estados com maior volume de chuva.
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          rainSimEnabled ? 'bg-cyan-500 border-cyan-300 text-slate-950' : 'border-slate-600'
                        }`}
                      >
                        {rainSimEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )}

                  {/* Animated Clouds Toggle */}
                  {onToggleClouds && (
                    <div
                      onClick={onToggleClouds}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        cloudsEnabled
                          ? 'bg-sky-950/40 border-sky-500/60 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                          <Cloud className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">Nuvens Cumulus & Sombras</div>
                          <div className="text-[11px] text-slate-400">
                            Formações de nuvens procedurais que deslizam projetando sombras no relevo.
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          cloudsEnabled ? 'bg-sky-500 border-sky-300 text-slate-950' : 'border-slate-600'
                        }`}
                      >
                        {cloudsEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )}

                  {/* Waves Toggle */}
                  {onToggleWaves && (
                    <div
                      onClick={onToggleWaves}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        wavesEnabled
                          ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                          <Waves className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">Ondas Oceânicas & Espuma</div>
                          <div className="text-[11px] text-slate-400">
                            Ondulações do Atlântico e quebra de espuma costeira nas praias e ilhas.
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          wavesEnabled ? 'bg-cyan-500 border-cyan-300 text-slate-950' : 'border-slate-600'
                        }`}
                      >
                        {wavesEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )}

                  {/* Atmosphere Birds & Sunlight Fog */}
                  {onToggleAtmosphere && (
                    <div
                      onClick={onToggleAtmosphere}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        atmosphereEnabled
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                          <Feather className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">Gaivotas & Atmosfera Costeira</div>
                          <div className="text-[11px] text-slate-400">
                            Voo de pássaros marinhos e iluminação procedural solar.
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          atmosphereEnabled ? 'bg-amber-500 border-amber-300 text-slate-950' : 'border-slate-600'
                        }`}
                      >
                        {atmosphereEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Base Cartography Providers */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Base Cartográfica de Fundo
                  </span>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => onTerrainProviderChange?.('muted_gray')}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        terrainProvider === 'muted_gray'
                          ? 'bg-slate-900 border-amber-500 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>Muted Grey (ECMWF Radar)</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cinza neutro padrão da meteorologia profissional.
                        </div>
                      </div>
                      {terrainProvider === 'muted_gray' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      onClick={() => onTerrainProviderChange?.('satellite_earth')}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        terrainProvider === 'satellite_earth'
                          ? 'bg-slate-900 border-amber-500 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>Satélite Orbital True-Color</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Imagens orbitais reais de alta resolução.
                        </div>
                      </div>
                      {terrainProvider === 'satellite_earth' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      onClick={() => onTerrainProviderChange?.('shaded_relief')}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        terrainProvider === 'shaded_relief'
                          ? 'bg-slate-900 border-amber-500 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>Relevo Físico Topográfico</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Sombreamento digital de serras e planaltos.
                        </div>
                      </div>
                      {terrainProvider === 'shaded_relief' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'enso' && elNinoData && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Fase Atual do Pacífico:</span>
                    <span className="font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/50">
                      {elNinoData.phase} ({elNinoData.intensity})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Anomalia Niño 3.4:</span>
                    <span className="font-mono font-bold text-cyan-300">{elNinoData.seaTempAnomaly}°C</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed pt-1 border-t border-slate-800">
                    {elNinoData.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400">Impactos por Região do Brasil:</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                      <strong className="text-emerald-400">Norte:</strong> {elNinoData.impactsBrazil.norte}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                      <strong className="text-amber-400">Nordeste:</strong> {elNinoData.impactsBrazil.nordeste}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                      <strong className="text-yellow-400">Centro-Oeste:</strong> {elNinoData.impactsBrazil.centroOeste}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                      <strong className="text-blue-400">Sudeste:</strong> {elNinoData.impactsBrazil.sudeste}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                      <strong className="text-purple-400">Sul:</strong> {elNinoData.impactsBrazil.sul}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

