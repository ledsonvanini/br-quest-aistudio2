// src/components/map/ClimateControlPanel.tsx
// Painel Lateral do Observatório Meteorológico & Ambiental (Orquestrador Desacoplado)

import React, { useState, useEffect } from 'react';
import { ClimateMode } from './ClimatePhenomenaLayer';
import {
  ClimateStationData,
  ElNinoIndexData,
  formatBrasiliaTimeDynamic,
} from '../../services/climateService';
import {
  getBrasiliaCelestialEphemeris,
  CelestialEphemeris,
} from '../../services/astronomyService';
import { audioEngine } from '../../lib/audioSynth';
import {
  RefreshCw,
  X,
  Sliders,
  Thermometer,
  Radio,
  Sun,
  Moon,
  Activity,
  Clock,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ClimateAstronomyTab } from './climate/ClimateAstronomyTab';
import { ClimateStationsTab } from './climate/ClimateStationsTab';
import { ClimateEnsoTab } from './climate/ClimateEnsoTab';
import { ClimateSettingsTab } from './climate/ClimateSettingsTab';

interface ClimateControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ClimateMode;
  onModeChange: (mode: ClimateMode) => void;
  stations: ClimateStationData[];
  elNinoData: ElNinoIndexData | null;
  onElNinoPhaseChange?: (phase: 'El Niño' | 'La Niña' | 'Neutro') => void;
  selectedStation: ClimateStationData | null;
  onSelectStation: (station: ClimateStationData | null) => void;
  speedMultiplier: number;
  onSpeedMultiplierChange: (speed: number) => void;
  onRefreshTelemetry: () => void;
  isLoading?: boolean;
  updatedAt?: string;
  dateTimeFormatted?: string;
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
  timeOverride?: 'auto' | 'day' | 'night';
  onTimeOverrideChange?: (mode: 'auto' | 'day' | 'night') => void;
}

export const ClimateControlPanel: React.FC<ClimateControlPanelProps> = ({
  isOpen,
  stations,
  elNinoData,
  onElNinoPhaseChange,
  selectedStation,
  onSelectStation,
  speedMultiplier,
  onSpeedMultiplierChange,
  onRefreshTelemetry,
  isLoading = false,
  updatedAt,
  dateTimeFormatted = 'Hoje, 15:00 (-03)',
  avgTempBrazil = 27.4,
  maxTempState = { stateId: 'MT', temp: 35.1 },
  minTempState = { stateId: 'RS', temp: 17.5 },
  timeOverride = 'auto',
  onTimeOverrideChange,
}) => {
  const [activeTab, setActiveTab] = useState<'stations' | 'astronomy' | 'enso' | 'settings'>('astronomy');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [ephemeris, setEphemeris] = useState<CelestialEphemeris>(() =>
    getBrasiliaCelestialEphemeris(timeOverride)
  );

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const tick = () => {
      setEphemeris(getBrasiliaCelestialEphemeris(timeOverride));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [timeOverride]);

  if (!isOpen) return null;

  return (
    <>
      {!isDrawerOpen && (
        <div className="fixed bottom-12 right-4 sm:right-6 z-40 pointer-events-auto">
          <button
            onClick={() => {
              audioEngine.playSfx('click');
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/95 hover:bg-slate-900 border border-amber-500/60 text-amber-300 text-xs font-serif font-bold shadow-2xl shadow-black/90 hover:scale-105 transition-all cursor-pointer"
            title="Abrir Observatório Meteorológico & Astronomia"
          >
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Observatório Ambiental</span>
          </button>
        </div>
      )}

      {isDrawerOpen && (
        <div
          id="painel-observatorio-ambiental"
          data-scrollable="true"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className={`painel-observatorio-clima painel-observatorio-ambiental painel-app-observatorio fixed top-14 sm:top-15 md:top-[58px] bottom-9 sm:bottom-10 md:bottom-[42px] right-2 sm:right-3 md:right-4 z-40 max-w-[calc(100vw-16px)] bg-slate-950/98 sm:bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_24px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto select-none cursor-default transition-all duration-300 ${
            isExpanded
              ? 'w-[calc(100vw-16px)] sm:w-[calc(50vw-16px)] lg:w-[calc(50vw-20px)] xl:w-[calc(50vw-24px)]'
              : 'w-[calc(100vw-16px)] sm:w-96 md:w-[420px]'
          }`}
        >
          {/* Header */}
          <div className="p-3 sm:p-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/80 via-slate-900/95 to-slate-950 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-slate-100 flex items-center gap-1.5 font-serif truncate">
                  Observatório Ambiental
                </h3>
                <p className="text-[10px] text-slate-400 font-mono truncate">Telemetria & Efemérides • Hora de Brasília</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                id="btn-atualizar-observatorio"
                onClick={onRefreshTelemetry}
                disabled={isLoading}
                title="Atualizar dados em tempo real"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all disabled:opacity-50 cursor-pointer shadow-md min-w-[34px] min-h-[34px] flex items-center justify-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                id="btn-tamanho-observatorio"
                type="button"
                onClick={handleToggleExpand}
                className={`btn-tamanho-painel p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 touch-manipulation min-w-[34px] min-h-[34px] flex items-center justify-center ${
                  isExpanded
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/60'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
                title={isExpanded ? 'Restaurar Tamanho Compacto' : 'Maximizar Painel (50% da Tela)'}
                aria-label="Alternar Tamanho do Observatório"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5 text-cyan-300" /> : <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />}
              </button>

              <button
                id="btn-fechar-observatorio"
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  setIsDrawerOpen(false);
                }}
                className="btn-fechar-painel p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-md min-w-[34px] min-h-[34px] flex items-center justify-center"
                title="Minimizar Painel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Resumo Térmico Nacional Rápido */}
          <div className="grid grid-cols-3 gap-1.5 px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[9px] text-slate-400 font-semibold">Média Brasil</div>
              <div className="font-black text-amber-400 text-xs font-mono">{avgTempBrazil}°C</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[9px] text-slate-400 font-semibold">Máx ({maxTempState.stateId})</div>
              <div className="font-black text-red-400 text-xs font-mono">{maxTempState.temp}°C</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[9px] text-slate-400 font-semibold">Mín ({minTempState.stateId})</div>
              <div className="font-black text-blue-400 text-xs font-mono">{minTempState.temp}°C</div>
            </div>
          </div>

          {/* Abas do Observatório */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/40 text-[11px] font-serif font-bold text-center">
            <button
              onClick={() => setActiveTab('astronomy')}
              className={`py-2 px-1 flex items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'astronomy'
                  ? 'border-amber-400 text-amber-300 bg-slate-900/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {ephemeris.isNight ? <Moon className="w-3 h-3 text-indigo-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
              <span>Astronomia</span>
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`py-2 px-1 flex items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'stations'
                  ? 'border-amber-400 text-amber-300 bg-slate-900/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3 h-3" />
              <span>Estações</span>
            </button>
            <button
              onClick={() => setActiveTab('enso')}
              className={`py-2 px-1 flex items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'enso'
                  ? 'border-amber-400 text-amber-300 bg-slate-900/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>ENSO</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 flex items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-300 bg-slate-900/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Ventos</span>
            </button>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
            {activeTab === 'astronomy' && (
              <ClimateAstronomyTab
                ephemeris={ephemeris}
                timeOverride={timeOverride}
                onTimeOverrideChange={onTimeOverrideChange}
              />
            )}

            {activeTab === 'stations' && (
              <ClimateStationsTab
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={onSelectStation}
              />
            )}

            {activeTab === 'enso' && (
              <ClimateEnsoTab
                elNinoData={elNinoData}
                onPhaseChange={onElNinoPhaseChange}
              />
            )}

            {activeTab === 'settings' && (
              <ClimateSettingsTab
                speedMultiplier={speedMultiplier}
                onSpeedMultiplierChange={onSpeedMultiplierChange}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="text-slate-400 font-sans">atualizado</span>
              <strong className="text-cyan-200 font-mono">{formatBrasiliaTimeDynamic(updatedAt || dateTimeFormatted)}</strong>
            </div>
            <span className="text-[9px] text-slate-500">INMET • ECMWF • NOAA • SIMEPAR</span>
          </div>
        </div>
      )}
    </>
  );
};
