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
} from 'lucide-react';
import { AppMainMode } from './TopGlobalNavMenu';
import { GuardianData } from '../types';
import { MapStateCarousel } from './map/MapStateCarousel';
import { audioEngine } from '../lib/audioSynth';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { vintageRadioEngine, RadioPlaybackState } from '../lib/vintageRadioEngine';
import { getStateMusicalHeritage } from '../data/musicalHeritageData';
import { ECMWF_TEMP_COLOR_STOPS } from '../services/climateService';

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

  // Climate context
  climateMode?: ClimateMode;
  onOpenObservatorio?: () => void;
  isObservatorioOpen?: boolean;
  avgTempBrazil?: number;
  maxTempState?: { stateId: string; temp: number };
  minTempState?: { stateId: string; temp: number };

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
  onToggleRadio,
}) => {
  const completedSet = useMemo(() => new Set(completedStateIds), [completedStateIds]);

  // Real-time synchronization with Vintage Radio Player Engine
  const [radioState, setRadioState] = useState<RadioPlaybackState>(() => vintageRadioEngine.getState());

  useEffect(() => {
    const unsubscribe = vintageRadioEngine.subscribe((state) => {
      setRadioState(state);
    });
    return () => unsubscribe();
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
      className="rodape-aplicacao container-rodape-dinamico shrink-0 w-full bg-[#020d20]/70 backdrop-blur-md border-t border-cyan-500/30 px-2 sm:px-4 py-1.5 z-40 text-slate-200 select-none shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
      role="contentinfo"
      aria-label="Rodapé do Sistema BR Quest"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ========================================================================= */}
        {/* 1. SEÇÃO ESQUERDA: LOGO BR QUEST (Com Retorno ao Mapa) */}
        {/* ========================================================================= */}
        <div className="secao-logo-rodape flex items-center gap-2 shrink-0">
          <button
            id="btn-logo-rodape-home"
            onClick={() => {
              audioEngine.playSfx('click');
              onNavigateHome();
            }}
            className="btn-logo-brquest flex items-center gap-2 group p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/80 transition-all cursor-pointer shadow-inner"
            title="BR Quest • Ir para o Mapa Principal"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
              <span>🇧🇷</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-black text-xs sm:text-sm text-amber-300 tracking-wide group-hover:text-amber-200 leading-tight">
                BR Quest
              </span>
              <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-300 hidden md:inline leading-tight">
                Guardiões da Cultura
              </span>
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SEÇÃO CENTRAL: CONTEÚDO DINÂMICO AUXILIAR */}
        {/* ========================================================================= */}
        <div className="secao-conteudo-dinamico-auxiliar flex-1 min-w-0 flex items-center justify-center overflow-visible">
          
          {/* CASO A: Modo Aventura no Mapa (Carrossel Compacto de 5 Estados) */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'aventura' && (
            <div className="container-carrossel-compacto-wrapper w-full max-w-[480px] sm:max-w-[540px] flex items-center justify-center">
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
            <div className="container-carrossel-globo3d-wrapper w-full max-w-[480px] sm:max-w-[540px] flex items-center justify-center">
              <MapStateCarousel
                completedStateIds={completedSet}
                hoveredStateId={hoveredStateId}
                selectedStateId={selectedStateId}
                onStateHover={(id) => onStateHover(id)}
                onStateClick={onStateClick}
              />
            </div>
          )}

          {/* CASO B: Modo Clima no Mapa (Cartela de Cores ECMWF + Telemetria em Tempo Real) */}
          {!activeGuardian && activeTab === 'map' && mainMode === 'clima' && (
            <div
              id="painel-telemetria-clima-rodape"
              className="painel-telemetria-clima-rodape flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-xs shadow-md animate-in fade-in duration-200 max-w-full overflow-hidden"
            >
              {/* Badge ECMWF */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">ECMWF</span>
              </div>

              {/* CARTELA DE CORES TÉRMICAS COMPACTA */}
              <div className="secao-cartela-cores-clima flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-mono text-slate-400 hidden xl:inline">-4°C</span>
                <div
                  className="w-24 sm:w-32 md:w-36 h-2 rounded-full overflow-hidden border border-slate-700/80 flex shadow-inner shrink-0"
                  title="Cartela Térmica Oficial ECMWF (-4°C a 40°C+)"
                >
                  {ECMWF_TEMP_COLOR_STOPS.map((stop) => (
                    <div
                      key={stop.temp}
                      className="h-full flex-1"
                      style={{ backgroundColor: stop.hex }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-slate-400 hidden xl:inline">40°C</span>
              </div>

              <div className="h-3.5 w-px bg-cyan-500/30" />

              {/* Média Brasil */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-100 shrink-0">
                <Thermometer className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-slate-400 hidden sm:inline">Média:</span>
                <span className="font-bold text-amber-300">{avgTempBrazil.toFixed(1)}°C</span>
              </div>

              <div className="h-3.5 w-px bg-cyan-500/30 hidden md:block" />

              {/* Máxima Nacional */}
              <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-rose-300 shrink-0">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-bold">{maxTempState.stateId} {maxTempState.temp.toFixed(1)}°C</span>
              </div>

              <div className="h-3.5 w-px bg-cyan-500/30 hidden lg:block" />

              {/* Mínima Nacional */}
              <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-blue-300 shrink-0">
                <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold">{minTempState.stateId} {minTempState.temp.toFixed(1)}°C</span>
              </div>

              {/* Botão do Observatório Ambiental */}
              {onOpenObservatorio && (
                <button
                  id="btn-toggle-observatorio-rodape"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onOpenObservatorio();
                  }}
                  className={`btn-abrir-observatorio px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer shrink-0 ${
                    isObservatorioOpen
                      ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-sm shadow-cyan-500/40'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/50 text-cyan-200 hover:text-white'
                  }`}
                  title="Abrir / Fechar Observatório Ambiental"
                >
                  Observatório
                </button>
              )}
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

          {/* Botão 2: FPS Medidor de Performance */}
          {onToggleFps && (
            <button
              id="btn-fps-rodape"
              onClick={() => {
                audioEngine.playSfx('click');
                onToggleFps();
              }}
              className={`btn-fps-rodape flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-mono font-bold transition shadow-sm cursor-pointer ${
                showFps
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200'
              }`}
              title={showFps ? 'Ocultar Medidor de FPS' : 'Exibir Medidor de FPS em Tempo Real'}
              aria-label="Alternar FPS"
            >
              <Gauge className={`w-3.5 h-3.5 ${showFps ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">FPS</span>
            </button>
          )}

          {/* Botão 3: APIs e Telemetria */}
          {onOpenApiStatus && (
            <button
              id="btn-apis-rodape"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenApiStatus();
              }}
              className="btn-apis-rodape flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-cyan-300 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
              title="Status e Telemetria das APIs de Dados"
              aria-label="Status APIs"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">APIs</span>
            </button>
          )}
        </div>

      </div>
    </footer>
  );
};
