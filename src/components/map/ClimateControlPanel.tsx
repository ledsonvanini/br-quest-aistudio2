import React, { useState, useEffect } from 'react';
import { ClimateMode } from './ClimatePhenomenaLayer';
import {
  ClimateStationData,
  ElNinoIndexData,
} from '../../services/climateService';
import {
  getBrasiliaCelestialEphemeris,
  CelestialEphemeris,
} from '../../services/astronomyService';
import {
  RefreshCw,
  X,
  Sliders,
  Thermometer,
  Radio,
  Sun,
  Moon,
  Wind,
  Compass,
  Sparkles,
  ShieldAlert,
  Activity,
  Orbit,
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
  onClose,
  stations,
  elNinoData,
  selectedStation,
  onSelectStation,
  speedMultiplier,
  onSpeedMultiplierChange,
  onRefreshTelemetry,
  isLoading = false,
  dateTimeFormatted = 'Hoje, 15:00 (-03)',
  avgTempBrazil = 27.4,
  maxTempState = { stateId: 'MT', temp: 35.1 },
  minTempState = { stateId: 'RS', temp: 17.5 },
  timeOverride = 'auto',
  onTimeOverrideChange,
}) => {
  const [activeTab, setActiveTab] = useState<'stations' | 'astronomy' | 'enso' | 'settings'>('astronomy');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [ephemeris, setEphemeris] = useState<CelestialEphemeris>(() =>
    getBrasiliaCelestialEphemeris(timeOverride)
  );

  // Sincronização de efemérides solares a cada segundo com a Hora de Brasília
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
      {/* Botão Flutuante Discreto para Reabrir Observatório (quando minimizado) */}
      {!isDrawerOpen && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/50 text-amber-300 text-xs font-serif font-bold shadow-2xl shadow-black/80 hover:scale-105 transition-all cursor-pointer"
            title="Abrir Observatório Meteorológico & Astronomia"
          >
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Observatório Ambiental</span>
          </button>
        </div>
      )}

      {/* PAINEL OBSERVATÓRIO LATERAL */}
      {isDrawerOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="painel-observatorio-clima fixed top-24 right-4 sm:right-6 z-40 w-80 sm:w-96 max-h-[82vh] bg-slate-950/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto select-none"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900/90 to-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-100 flex items-center gap-1.5 font-serif">
                  Observatório Ambiental
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Telemetria & Efemérides • Hora de Brasília</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onRefreshTelemetry}
                disabled={isLoading}
                title="Atualizar dados em tempo real"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
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
            
            {/* ABA 1: ASTRONOMIA, HORA DE BRASÍLIA, SOL, LUA & OZÔNIO */}
            {activeTab === 'astronomy' && (
              <div className="space-y-3">
                {/* Cartão do Relógio Oficial de Brasília */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Horário Oficial de Brasília</div>
                      <div className="font-mono font-bold text-amber-300 text-xs">
                        {ephemeris.brasiliaTimeFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        ephemeris.isNight
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {ephemeris.isNight ? '🌙 Noite' : '☀️ Dia'}
                    </span>
                  </div>
                </div>

                {/* Alternância de Modo / Teste Manual */}
                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
                    <span>CICLO DE ILUMINAÇÃO CELO</span>
                    <span className="font-mono text-slate-500">Auto: Brasília UTC-3</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => onTimeOverrideChange?.('auto')}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        timeOverride === 'auto'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⏱️ Automático
                    </button>
                    <button
                      onClick={() => onTimeOverrideChange?.('day')}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        timeOverride === 'day'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ☀️ Modo Dia
                    </button>
                    <button
                      onClick={() => onTimeOverrideChange?.('night')}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        timeOverride === 'night'
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🌙 Modo Noite
                    </button>
                  </div>
                </div>

                {/* Grade de Efemérides: Posição Solar e Lunar */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Bloco Sol */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] font-serif">
                      <Sun className="w-3.5 h-3.5" />
                      <span>Sol em Brasília</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono space-y-0.5">
                      <div>Elevação: <strong className="text-amber-300">{ephemeris.sunElevation}°</strong></div>
                      <div>Azimute: <strong className="text-amber-300">{ephemeris.sunAzimuth}° ({ephemeris.sunAzimuthCardinal})</strong></div>
                      <div>Intensidade: <strong className="text-amber-300">{Math.round(ephemeris.sunIntensity * 100)}%</strong></div>
                    </div>
                  </div>

                  {/* Bloco Lua */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px] font-serif">
                      <Moon className="w-3.5 h-3.5" />
                      <span>Lua & Cruzeiro do Sul</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono space-y-0.5">
                      <div>Fase: <strong className="text-indigo-300">{ephemeris.moonPhaseName}</strong></div>
                      <div>Iluminação: <strong className="text-indigo-300">{ephemeris.moonIlluminationPercent}%</strong></div>
                      <div>Azimute: <strong className="text-indigo-300">{ephemeris.moonAzimuth}° ({ephemeris.moonAzimuthCardinal})</strong></div>
                    </div>
                  </div>
                </div>

                {/* Radiação & Ozônio */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-serif font-bold text-slate-200 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                      Índice UV & Camada de Ozônio
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {ephemeris.ozoneColumnDU} DU
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="text-slate-400">Índice Ultravioleta</div>
                      <div className="font-bold text-xs text-amber-300">
                        {ephemeris.uvIndex} ({ephemeris.uvCategory})
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <div className="text-slate-400">Coluna de Ozônio</div>
                      <div className="font-bold text-xs text-emerald-300">
                        {ephemeris.ozoneColumnDU} Unidades Dobson
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: ESTAÇÕES METEOROLÓGICAS ESTADUAIS */}
            {activeTab === 'stations' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                  <span>CAPITAIS & POLOS CLIMÁTICOS</span>
                  <span>{stations.length} ESTAÇÕES</span>
                </div>

                <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1 custom-scrollbar">
                  {stations.map((st) => {
                    const isSelected = selectedStation?.id === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => onSelectStation(isSelected ? null : st)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                            : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-[10px] text-amber-400">
                            {st.id.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 text-xs">{st.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {st.windSpeed} km/h • {st.windDirection}° • {st.humidity}% UMID
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-black text-amber-300 text-sm">{st.temperature}°C</div>
                          <div className="text-[9px] text-slate-400">{st.phenomenon}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ABA 3: ÍNDICE ENSO & PACÍFICO */}
            {activeTab === 'enso' && (
              <div className="space-y-3">
                {elNinoData ? (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-amber-300 text-xs">Anomalia Térmica Niño 3.4</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {elNinoData.phase} ({elNinoData.intensity})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-mono font-black text-rose-400">
                        {elNinoData.seaTempAnomaly > 0 ? '+' : ''}
                        {elNinoData.seaTempAnomaly}°C
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {elNinoData.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                      <div>• <strong>Norte:</strong> {elNinoData.impactsBrazil?.norte}</div>
                      <div>• <strong>Nordeste:</strong> {elNinoData.impactsBrazil?.nordeste}</div>
                      <div>• <strong>Sul:</strong> {elNinoData.impactsBrazil?.sul}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    Carregando índices oceânicos...
                  </div>
                )}
              </div>
            )}

            {/* ABA 4: SLIDER POLIDO DE VELOCIDADE DOS VENTOS */}
            {activeTab === 'settings' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      Velocidade da Dinâmica dos Ventos
                    </label>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 text-xs">
                      {speedMultiplier.toFixed(1)}x
                    </span>
                  </div>

                  {/* Slider com track customizado e responsivo */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={speedMultiplier}
                      onChange={(e) => onSpeedMultiplierChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all hover:bg-slate-700"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 px-0.5">
                      <span>0.2x (Calmo)</span>
                      <span>1.0x (Real)</span>
                      <span>3.0x (Ventania)</span>
                    </div>
                  </div>

                  {/* Botões de Presets Rápidos */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-[10px] font-mono">
                    {[
                      { val: 0.5, label: '0.5x' },
                      { val: 1.0, label: '1.0x' },
                      { val: 2.0, label: '2.0x' },
                      { val: 3.0, label: '3.0x' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => onSpeedMultiplierChange(preset.val)}
                        className={`py-1 rounded-lg border transition-all cursor-pointer ${
                          Math.abs(speedMultiplier - preset.val) < 0.05
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>ATUALIZADO: {dateTimeFormatted}</span>
            <span>INMET / ECMWF / NOAA</span>
          </div>
        </div>
      )}
    </>
  );
};
