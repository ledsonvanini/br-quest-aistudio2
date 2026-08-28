import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Radio,
  Disc,
  Play,
  Pause,
  Gauge,
  Activity,
  CloudSun,
  Thermometer,
  Flame,
  Snowflake,
  Leaf,
  Bird,
  Trees,
  ShieldAlert,
  BarChart3,
  Clock,
  RefreshCw,
  CloudRain,
  Cloud,
  Waves,
  Sun,
  SunMedium,
  Moon,
} from 'lucide-react';
import { AppMainMode } from './TopGlobalNavMenu';
import { GuardianData } from '../types';
import { MapStateCarousel } from './map/MapStateCarousel';
import { audioEngine } from '../lib/audioSynth';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { vintageRadioEngine, RadioPlaybackState } from '../lib/vintageRadioEngine';
import { getStateMusicalHeritage } from '../data/musicalHeritageData';
import { ECMWF_TEMP_COLOR_STOPS, getEcmwfTempColor, formatFullDayTime, formatBrasiliaTimeDynamic } from '../services/climateService';
import { getBiomeStats, BRAZIL_BIOMES_INFO } from '../data/brazilBiodiversityData';
import { biodiversityService } from '../services/biodiversityService';
import { apiTracker } from '../services/apiTracker';
import { perfEngine, FpsTelemetry } from '../lib/performanceEngine';

interface DynamicAppFooterProps {
  mainMode: AppMainMode;
  activeTab: 'map' | 'insignias';
  activeGuardian: GuardianData | null;
  completedStateIds: string[];
  unlockedInsigniaCount: number;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  onOpenAboutInfo: () => void;
  onNavigateHome: () => void;

  // Telemetry & Utility buttons (Fixed in all modes)
  showFps?: boolean;
  onToggleFps?: () => void;
  onOpenApiStatus?: () => void;

  // Climate context & Common Atmosphere Controls
  climateMode?: ClimateMode;
  onOpenObservatorio?: () => void;
  isObservatorioOpen?: boolean;
  avgTempBrazil?: number;
  maxTempState?: { stateId: string; temp: number };
  minTempState?: { stateId: string; temp: number };
  climateLastUpdated?: string | number;

  isRainSimActive?: boolean;
  onToggleRainSim?: () => void;
  isCloudsActive?: boolean;
  onToggleClouds?: () => void;
  isWavesActive?: boolean;
  onToggleWaves?: () => void;
  isAtmosphereActive?: boolean;
  onToggleAtmosphere?: () => void;
  timeOverride?: 'auto' | 'day' | 'night';
  onTimeOverrideChange?: (mode: 'auto' | 'day' | 'night') => void;

  // Music context
  onToggleRadio?: () => void;
}

export const DynamicAppFooter: React.FC<DynamicAppFooterProps> = ({
  mainMode,
  activeTab,
  activeGuardian,
  completedStateIds,
  unlockedInsigniaCount,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateClick,
  onOpenAboutInfo,
  onNavigateHome,
  showFps = false,
  onToggleFps,
  onOpenApiStatus,
  climateMode = 'temperaturas_frentes',
  onOpenObservatorio,
  isObservatorioOpen = false,
  avgTempBrazil = 27.4,
  maxTempState = { stateId: 'MT', temp: 35.1 },
  minTempState = { stateId: 'RS', temp: 17.5 },
  climateLastUpdated,
  isRainSimActive = false,
  onToggleRainSim,
  isCloudsActive = true,
  onToggleClouds,
  isWavesActive = true,
  onToggleWaves,
  isAtmosphereActive = true,
  onToggleAtmosphere,
  timeOverride = 'auto',
  onTimeOverrideChange,
  onToggleRadio,
}) => {
  const completedSet = useMemo(() => new Set(completedStateIds), [completedStateIds]);
  const formattedTimeOnly = useMemo(() => {
    return formatBrasiliaTimeDynamic(climateLastUpdated);
  }, [climateLastUpdated]);
  const biodivTimeOnly = useMemo(() => biodiversityService.getBrasiliaTimeOnly(), []);

  // Real-time synchronization with Vintage Radio Player Engine & Performance Engine
  const [radioState, setRadioState] = useState<RadioPlaybackState>(() => vintageRadioEngine.getState());
  const [apiCallsCount, setApiCallsCount] = useState<number>(() => apiTracker.getTotalCallsToday());
  const [fpsTelemetry, setFpsTelemetry] = useState<FpsTelemetry>({
    fps: 60,
    frametimeMs: 16.6,
    quality: 'optimal',
    activeParticles: 0,
  });

  useEffect(() => {
    const unsubscribeRadio = vintageRadioEngine.subscribe((state) => {
      setRadioState(state);
    });
    const updateApiCount = () => {
      setApiCallsCount(apiTracker.getTotalCallsToday());
    };
    const unsubscribeApi = apiTracker.subscribe(updateApiCount);
    const unsubscribePerf = perfEngine.subscribe((data) => {
      setFpsTelemetry(data);
    });

    return () => {
      unsubscribeRadio();
      unsubscribeApi();
      unsubscribePerf();
    };
  }, []);

  const activeMusicStateData = useMemo(() => {
    const stateId = radioState.activeStateId || selectedStateId || 'RJ';
    return getStateMusicalHeritage(stateId);
  }, [selectedStateId, radioState.activeStateId]);

  return (
    <footer
      id="rodape-aplicacao-dinamico"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="rodape-aplicacao container-rodape-dinamico fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#020d24]/80 backdrop-blur-md border border-amber-500/35 rounded-2xl px-2.5 sm:px-3.5 py-1.5 text-slate-200 select-none shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto max-w-[calc(100vw-24px)] md:max-w-fit"
      role="contentinfo"
      aria-label="Rodapé do Sistema BR Quest"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
        
        {/* ========================================================================= */}
        {/* 1. SEÇÃO CENTRAL: CONTEÚDO DINÂMICO AUXILIAR */}
        {/* ========================================================================= */}
        <div className="secao-conteudo-dinamico-auxiliar flex-1 min-w-0 flex items-center justify-center overflow-visible">
          
          {/* CASO A: Modo Aventura no Mapa (Carrossel Compacto de 5 Estados) */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'aventura' && (
            <div className="container-carrossel-compacto-wrapper w-full max-w-[420px] sm:max-w-[480px] flex items-center justify-center">
              <MapStateCarousel
                completedStateIds={completedSet}
                hoveredStateId={hoveredStateId}
                selectedStateId={selectedStateId}
                onStateHover={(id) => onStateHover(id)}
                onStateClick={onStateClick}
              />
            </div>
          )}

          {/* CASO B: Modo Globo 3D no Mapa (Carrossel Compacto de Navegação Orbital) */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'globo3d' && (
            <div className="container-carrossel-globo3d-wrapper w-full max-w-[420px] sm:max-w-[480px] flex items-center justify-center">
              <MapStateCarousel
                completedStateIds={completedSet}
                hoveredStateId={hoveredStateId}
                selectedStateId={selectedStateId}
                onStateHover={(id) => onStateHover(id)}
                onStateClick={onStateClick}
              />
            </div>
          )}

          {/* CASO B: Modo Clima no Mapa (Cartela de Cores ECMWF + Telemetria em Tempo Real com Destaque Máx/Mín + Timestamp Atualizado) */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'clima' && (() => {
            const maxColor = getEcmwfTempColor(maxTempState.temp);
            const minColor = getEcmwfTempColor(minTempState.temp);
            const minPosPct = Math.max(0, Math.min(100, ((minTempState.temp - (-4)) / 44) * 100));
            const maxPosPct = Math.max(0, Math.min(100, ((maxTempState.temp - (-4)) / 44) * 100));

            return (
              <div
                id="painel-telemetria-clima-rodape"
                className="painel-telemetria-clima-rodape flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-xs shadow-lg animate-in fade-in duration-200 max-w-[96vw] sm:max-w-max overflow-x-auto no-scrollbar shrink-0"
              >
                {/* Badge ECMWF */}
                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-400/60 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                  <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden xs:inline">ECMWF</span>
                </div>

                {/* CARTELA DE CORES TÉRMICAS COM MARCADORES DINÂMICOS DE MÁX E MÍN */}
                <div className="secao-cartela-cores-clima flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">-4°</span>
                  <div
                    className="relative w-16 xs:w-20 sm:w-28 md:w-32 h-2.5 sm:h-3 rounded-full overflow-visible border border-slate-700/90 flex shadow-inner shrink-0"
                    title={`Cartela Térmica ECMWF (-4°C a 40°C) | Mín: ${minTempState.stateId} ${minTempState.temp}°C | Máx: ${maxTempState.stateId} ${maxTempState.temp}°C`}
                  >
                    <div className="absolute inset-0 rounded-full overflow-hidden flex">
                      {ECMWF_TEMP_COLOR_STOPS.map((stop) => (
                        <div
                          key={stop.temp}
                          className="h-full flex-1"
                          style={{ backgroundColor: stop.hex }}
                        />
                      ))}
                    </div>

                    {/* Marcador Dinâmico de Posição da Mínima Nacional */}
                    <div
                      className="absolute -top-1 w-1.5 sm:w-2 h-4 sm:h-5 rounded-full border border-white shadow-md z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${minPosPct}%`,
                        backgroundColor: minColor.hex,
                      }}
                    />

                    {/* Marcador Dinâmico de Posição da Máxima Nacional */}
                    <div
                      className="absolute -top-1 w-1.5 sm:w-2 h-4 sm:h-5 rounded-full border border-white shadow-md z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${maxPosPct}%`,
                        backgroundColor: maxColor.hex,
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">40°</span>
                </div>

                <div className="h-3.5 w-px bg-cyan-500/30 shrink-0" />

                {/* Média Brasil */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-100 shrink-0">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span className="text-slate-400 hidden md:inline">Méd:</span>
                  <span className="font-bold text-amber-300">{avgTempBrazil.toFixed(1)}°</span>
                </div>

                <div className="h-3.5 w-px bg-cyan-500/30 shrink-0" />

                {/* Destaque da Máxima Nacional com a cor real da escala ECMWF */}
                <div
                  className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md border font-mono text-[10px] sm:text-[11px] font-bold shadow-sm shrink-0"
                  style={{
                    backgroundColor: `${maxColor.hex}22`,
                    borderColor: maxColor.hex,
                    color: maxColor.hex,
                  }}
                  title={`Máxima Nacional: ${maxTempState.stateId} (${maxTempState.temp.toFixed(1)}°C)`}
                >
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse shrink-0" style={{ color: maxColor.hex }} />
                  <span className="hidden xs:inline">Máx:</span>
                  <span className="text-white bg-slate-900/80 px-1 rounded text-[10px]">{maxTempState.stateId}</span>
                  <span>{maxTempState.temp.toFixed(1)}°</span>
                </div>

                {/* Destaque da Mínima Nacional com a cor real da escala ECMWF */}
                <div
                  className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md border font-mono text-[10px] sm:text-[11px] font-bold shadow-sm shrink-0"
                  style={{
                    backgroundColor: `${minColor.hex}22`,
                    borderColor: minColor.hex,
                    color: minColor.hex,
                  }}
                  title={`Mínima Nacional: ${minTempState.stateId} (${minTempState.temp.toFixed(1)}°C)`}
                >
                  <Snowflake className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse shrink-0" style={{ color: minColor.hex }} />
                  <span className="hidden xs:inline">Mín:</span>
                  <span className="text-white bg-slate-900/80 px-1 rounded text-[10px]">{minTempState.stateId}</span>
                  <span>{minTempState.temp.toFixed(1)}°</span>
                </div>

                <div className="h-3.5 w-px bg-cyan-500/30 shrink-0" />

                {/* Ícone e Hora Discreta (Brasília UTC-3) */}
                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-cyan-500/30 text-cyan-200 font-mono text-[10px] shrink-0"
                  title="Horário da telemetria climática consolidada (Horário de Brasília UTC-3)"
                >
                  <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 font-sans text-[10px]">atualizado</span>
                  <span className="font-semibold text-cyan-100">{formattedTimeOnly}</span>
                </div>
              </div>
            );
          })()}

          {/* CASO C: Modo Biodiversidade no Mapa */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'biodiversidade' && (
            <div
              id="painel-biodiversidade-ticker-rodape"
              className="painel-biodiversidade-ticker-rodape flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs shadow-md animate-in fade-in duration-200 overflow-x-auto no-scrollbar shrink-0"
            >
              <div className="flex items-center gap-1.5 text-emerald-300 font-serif font-bold shrink-0">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Biodiversidade do Brasil</span>
              </div>
              <div className="h-3.5 w-px bg-emerald-500/30 hidden sm:block shrink-0" />
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-300 shrink-0">
                <span className="flex items-center gap-1 text-amber-300">
                  <Bird className="w-3 h-3 text-amber-400" /> Fauna
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <Trees className="w-3 h-3 text-emerald-400" /> Flora
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  <ShieldAlert className="w-3 h-3 text-rose-400" /> SisCITES / IBAMA
                </span>
              </div>

              <div className="h-3.5 w-px bg-emerald-500/30 shrink-0" />

              {/* Ícone e Hora Discreta (Brasília UTC-3) */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-emerald-500/30 text-emerald-200 font-mono text-[10px] shrink-0"
                title="Horário do catálogo de biodiversidade (Horário de Brasília UTC-3)"
              >
                <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-slate-400 font-sans text-[10px]">atualizado</span>
                <span className="font-semibold text-emerald-100">{biodivTimeOnly}</span>
              </div>
            </div>
          )}

          {/* CASO C: Modo Musicalidades no Mapa (Ticker Reativo Integrado ao Rádio) */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'musicalidades' && (
            <div
              id="painel-radio-ticker-rodape"
              className="painel-radio-ticker-rodape flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 text-xs shadow-md animate-in fade-in duration-200"
            >
              {/* Botão Play / Pause Direto no Rodapé */}
              <button
                id="btn-rodape-play-pause"
                onClick={() => {
                  audioEngine.playSfx('click');
                  vintageRadioEngine.togglePlayPause();
                }}
                className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 hover:text-white transition cursor-pointer shrink-0"
                title={radioState.isPlaying ? 'Pausar Rádio' : 'Tocar Rádio'}
              >
                {radioState.isPlaying ? (
                  <Pause className="w-3 h-3 text-amber-300 fill-amber-300" />
                ) : (
                  <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                )}
              </button>

              {/* Informação da Emissora Ativa */}
              <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold truncate">
                <Radio className={`w-3.5 h-3.5 text-amber-400 shrink-0 ${radioState.isPlaying ? 'animate-pulse' : ''}`} />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  {activeMusicStateData.stateName} ({activeMusicStateData.frequencyDialKHz} kHz)
                </span>
              </div>

              <div className="h-3.5 w-px bg-amber-500/30 hidden sm:block" />

              {/* Faixa / Hino Musical Tocando */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-300 truncate max-w-[160px] md:max-w-[220px]">
                <Disc className={`w-3 h-3 text-amber-400 shrink-0 ${radioState.isPlaying ? 'animate-spin' : ''}`} />
                <span className="truncate text-amber-200">
                  {radioState.currentTrackTitle || activeMusicStateData.stateAnthem.title}
                </span>
              </div>

              {/* Botão Sintonizador */}
              {onToggleRadio && (
                <button
                  id="btn-toggle-radio-rodape"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onToggleRadio();
                  }}
                  className="btn-abrir-radio px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-[10px] font-mono text-amber-200 font-bold hover:text-white transition cursor-pointer shrink-0"
                  title="Abrir / Fechar Gabinete de Rádio"
                >
                  Sintonizador
                </button>
              )}
            </div>
          )}

          {/* CASO D: Cena do Guardião do Estado Ativo */}
          {activeGuardian && (
            <div className="painel-contexto-guardiao-rodape flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-950/70 border border-amber-400/60 text-xs shadow-md animate-in fade-in duration-200">
              <span className="text-amber-300 font-mono font-bold">{activeGuardian.id}</span>
              <span className="text-slate-300 font-serif font-bold truncate">
                {activeGuardian.stateNamePt}
              </span>
              <span className="text-amber-400/80 font-serif hidden sm:inline">
                • {activeGuardian.guardianName}
              </span>
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onNavigateHome();
                }}
                className="btn-voltar-mapa-rodape ml-1 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] font-serif hover:bg-amber-400 transition cursor-pointer"
              >
                Voltar ao Mapa
              </button>
            </div>
          )}

          {/* CASO E: Santuário das Insígnias */}
          {!activeGuardian && activeTab === 'insignias' && (
            <div className="painel-contexto-insignias-rodape flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs shadow-md animate-in fade-in duration-200">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-serif font-bold">
                Santuário das 27 Insígnias Sagradas
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                • {unlockedInsigniaCount}/27 Desbloqueadas
              </span>
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onNavigateHome();
                }}
                className="btn-voltar-mapa-rodape ml-1 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] font-serif hover:bg-amber-400 transition cursor-pointer"
              >
                Explorar Mapa
              </button>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 2. GRUPO COMUM: CONTROLES DE CLIMA & ATMOSFERA (CHUVA, NUVENS, ONDAS, ASTRO) */}
        {/* ========================================================================= */}
        <div
          id="grupo-clima-atmosfera-rodape"
          className="grupo-clima-rodape flex items-center gap-1 p-0.5 rounded-xl bg-slate-950/85 border border-slate-700/80 shrink-0"
        >
          {/* 1. Simulador de Chuva */}
          {onToggleRainSim && (
            <button
              id="btn-rodape-chuva"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleRainSim();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                isRainSimActive
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isRainSimActive ? 'Desativar Simulador de Chuva' : 'Ativar Simulador de Chuva em Tempo Real'}
              aria-label="Simulador de Chuva"
            >
              <CloudRain className={`w-3.5 h-3.5 ${isRainSimActive ? 'animate-bounce' : ''}`} />
            </button>
          )}

          {/* 2. Nuvens Volumétricas */}
          {onToggleClouds && (
            <button
              id="btn-rodape-nuvens"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleClouds();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                isCloudsActive
                  ? 'bg-sky-500/30 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isCloudsActive ? 'Ocultar Nuvens Volumétricas' : 'Exibir Nuvens Volumétricas e Turbulência'}
              aria-label="Nuvens Volumétricas"
            >
              <Cloud className={`w-3.5 h-3.5 ${isCloudsActive ? 'animate-pulse' : ''}`} />
            </button>
          )}

          {/* 3. Ventos Alísios e Ondas Costeiras */}
          {onToggleWaves && (
            <button
              id="btn-rodape-ventos-ondas"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleWaves();
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                isWavesActive
                  ? 'bg-teal-500/30 border-teal-400 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.4)]'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isWavesActive ? 'Desativar Ventos Alísios & Ondas' : 'Ativar Ventos Alísios & Ondas Costeiras'}
              aria-label="Ventos Alísios e Ondas"
            >
              <Waves className={`w-3.5 h-3.5 ${isWavesActive ? 'animate-pulse' : ''}`} />
            </button>
          )}

          {/* 4. Astro e Atmosfera / Ciclo Solar */}
          {(onToggleAtmosphere || onTimeOverrideChange) && (
            <button
              id="btn-rodape-astro-atmosfera"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                if (onTimeOverrideChange) {
                  const next = timeOverride === 'auto' ? 'day' : timeOverride === 'day' ? 'night' : 'auto';
                  onTimeOverrideChange(next);
                } else if (onToggleAtmosphere) {
                  onToggleAtmosphere();
                }
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                isAtmosphereActive
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={`Astro & Atmosfera (${timeOverride === 'auto' ? 'Tempo Real Brasília' : timeOverride === 'day' ? 'Dia Fixado' : 'Noite Fixada'}). Clique para alternar.`}
              aria-label="Astro e Atmosfera"
            >
              {timeOverride === 'night' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              ) : timeOverride === 'day' ? (
                <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '12s' }} />
              ) : (
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. SEÇÃO DIREITA: ÍCONES FIXOS (Saiba +, FPS, APIs) */}
        {/* ========================================================================= */}
        <div
          id="secao-controles-fixos-direita-rodape"
          className="secao-direita-rodape flex items-center gap-1 sm:gap-1.5 shrink-0"
        >
          {/* Botão 1: Saiba Mais com Ícone Exclamação '!' */}
          <button
            id="btn-saiba-mais-rodape"
            onClick={() => {
              audioEngine.playSfx('click');
              onOpenAboutInfo();
            }}
            className="btn-saiba-mais flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-amber-200 text-xs font-serif font-bold transition shadow-sm cursor-pointer"
            title="Saiba Mais: Filosofia, Fontes de Dados e Direitos Autorais"
            aria-label="Saiba Mais"
          >
            <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-mono font-black text-[11px]">
              !
            </div>
            <span className="hidden sm:inline">Saiba +</span>
          </button>

          {/* Botão 2: FPS Medidor de Performance (Com Swap de Componente no Mesmo Local) */}
          {onToggleFps && (
            showFps ? (
              <button
                id="btn-fps-rodape"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onToggleFps();
                }}
                className={`btn-fps-rodape painel-fps-swap flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono font-bold transition-all shadow-lg shadow-black/80 cursor-pointer animate-in fade-in zoom-in-95 duration-200 ${
                  fpsTelemetry.quality === 'optimal'
                    ? 'bg-emerald-950/90 border-emerald-400/80 text-emerald-300 shadow-emerald-500/20'
                    : fpsTelemetry.quality === 'good'
                    ? 'bg-amber-950/90 border-amber-400/80 text-amber-300 shadow-amber-500/20'
                    : 'bg-rose-950/90 border-rose-400/80 text-rose-300 shadow-rose-500/20'
                }`}
                title={`Taxa de Atualização: ${fpsTelemetry.fps} FPS | Tempo de Quadro: ${fpsTelemetry.frametimeMs}ms | Clique para ocultar`}
                aria-label={`FPS: ${fpsTelemetry.fps} - ${fpsTelemetry.quality}`}
              >
                <Activity className="w-3.5 h-3.5 animate-pulse shrink-0" />
                <span className="font-black">{fpsTelemetry.fps} FPS</span>
                <span className="text-slate-500 font-sans">|</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider shrink-0">
                  {fpsTelemetry.quality === 'optimal' ? 'Fluido' : fpsTelemetry.quality === 'good' ? 'Estável' : 'Otimizando'}
                </span>
                <span className="text-[9px] text-slate-400 font-mono hidden xl:inline">
                  {fpsTelemetry.frametimeMs}ms
                </span>
              </button>
            ) : (
              <button
                id="btn-fps-rodape"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onToggleFps();
                }}
                className="btn-fps-rodape flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-mono font-bold transition shadow-sm cursor-pointer bg-slate-900/80 hover:bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200"
                title="Exibir Medidor de FPS em Tempo Real (Swap no Rodapé)"
                aria-label="Ativar Medidor de FPS"
              >
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">FPS</span>
              </button>
            )
          )}

          {/* Botão 3: APIs, Cotas e Telemetria */}
          {onOpenApiStatus && (
            <button
              id="btn-apis-rodape"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenApiStatus();
              }}
              className="btn-apis-rodape flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/90 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer group"
              title={`APIs & Cotas: ${apiCallsCount} requisições feitas hoje de 10.000 disponíveis (Open-Meteo). Clique para ver detalhes e estatísticas semanais.`}
              aria-label="Status e Cotas de APIs"
            >
              <div className="relative flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-emerald-400 group-hover:text-amber-400 transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="hidden sm:inline text-slate-200 group-hover:text-amber-300 font-sans">
                APIs:
              </span>
              <span className="text-amber-300 font-mono font-bold">
                {apiCallsCount}
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                / 10k
              </span>
            </button>
          )}
        </div>

      </div>
    </footer>
  );
};
