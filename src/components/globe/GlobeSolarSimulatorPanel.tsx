import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Cloud,
  Maximize2,
  Minimize2,
  X,
  Clock,
  Sliders,
  Plus,
  Minus,
  Building2,
} from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export interface GlobeSolarSimulatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
  solarHour: number | null;
  onChangeSolarHour: (hour: number | null) => void;
  isSolarCyclePlaying: boolean;
  onToggleSolarCycle: () => void;
  solarCycleSpeed?: number;
  onChangeSolarCycleSpeed?: (speed: number) => void;
  sunIntensity: number;
  onChangeSunIntensity: (intensity: number) => void;
  moonLightIntensity: number;
  onChangeMoonLightIntensity: (intensity: number) => void;
  ambientLightIntensity: number;
  onChangeAmbientLightIntensity: (intensity: number) => void;
  cityLightIntensity: number;
  onChangeCityLightIntensity: (intensity: number) => void;
  cloudsOpacity: number;
  onChangeCloudsOpacity: (opacity: number) => void;
  cloudsVisible: boolean;
  onToggleClouds: () => void;
  onResetDefaults: () => void;
  liveBrasilia: {
    formattedTime: string;
    formattedFull: string;
    hours: number;
    minutes: number;
    seconds: number;
    floatHours: number;
    periodName: string;
  };
  currentSolarStatus: 'dia' | 'crepusculo' | 'noite';
  season?: 'primavera' | 'verao' | 'outono' | 'inverno';
  onChangeSeason?: (season: 'primavera' | 'verao' | 'outono' | 'inverno') => void;
}

interface SolarTrackSliderProps {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  fillColor: string;
  leftLabel?: string;
  centerLabel?: string;
  rightLabel?: string;
  ariaLabel: string;
}

const SolarTrackSlider: React.FC<SolarTrackSliderProps> = ({
  id,
  min,
  max,
  step,
  value,
  onChange,
  fillColor,
  leftLabel,
  centerLabel,
  rightLabel,
  ariaLabel,
}) => {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="w-full space-y-1 select-none">
      <div className="relative w-full flex items-center h-6">
        {/* Background Base Track with Real-Time Glowing Active Fill */}
        <div className="absolute inset-x-0 h-2.5 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden pointer-events-none shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${pct}%`,
              backgroundColor: fillColor,
              boxShadow: `0 0 10px ${fillColor}`,
            }}
          />
        </div>

        {/* Transparent Interactive Native Range Input on Top */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="solar-range-input relative z-10 w-full h-6 cursor-pointer focus:outline-none"
          aria-label={ariaLabel}
        />
      </div>

      {(leftLabel || centerLabel || rightLabel) && (
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono px-0.5">
          <span>{leftLabel}</span>
          {centerLabel && <span className="text-amber-300 font-bold">{centerLabel}</span>}
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
};

export const GlobeSolarSimulatorPanel: React.FC<GlobeSolarSimulatorPanelProps> = ({
  isOpen,
  onClose,
  isExpanded,
  onToggleExpand,
  solarHour,
  onChangeSolarHour,
  isSolarCyclePlaying,
  onToggleSolarCycle,
  solarCycleSpeed = 1,
  onChangeSolarCycleSpeed,
  sunIntensity,
  onChangeSunIntensity,
  moonLightIntensity,
  onChangeMoonLightIntensity,
  ambientLightIntensity,
  onChangeAmbientLightIntensity,
  cityLightIntensity,
  onChangeCityLightIntensity,
  cloudsOpacity,
  onChangeCloudsOpacity,
  cloudsVisible,
  onToggleClouds,
  onResetDefaults,
  liveBrasilia,
  currentSolarStatus,
  season,
  onChangeSeason,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tempo' | 'iluminacao'>('tempo');

  if (!isOpen) return null;

  // Formatar hora simulada exibida
  const displayHour = solarHour ?? liveBrasilia.floatHours;
  const wholeHours = Math.floor(displayHour);
  const minutes = Math.floor((displayHour % 1) * 60);
  const formattedSimulatedTime = `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    onToggleExpand(!isExpanded);
  };

  const handleClose = () => {
    audioEngine.playSfx('click');
    onClose();
  };

  return (
    <div
      id="painel-simulador-solar"
      data-scrollable="true"
      className={`painel-hud-controles painel-simulador-solar container-simulador-solar fixed top-12 sm:top-14 right-0 bottom-0 z-40 bg-slate-950/98 border-l border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.95),-10px_0_30px_rgba(245,158,11,0.15)] backdrop-blur-2xl text-slate-100 flex flex-col animate-in fade-in slide-in-from-right-6 duration-300 select-none overflow-hidden pointer-events-auto transition-all ${
        isExpanded
          ? 'w-full md:w-1/2'
          : 'w-full sm:w-[480px] lg:w-[520px]'
      }`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* CABEÇALHO DO PAINEL */}
      <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-slate-800/90 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md shrink-0">
            {currentSolarStatus === 'dia' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : currentSolarStatus === 'crepusculo' ? (
              <Sunrise className="w-5 h-5 text-orange-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-black text-sm text-white tracking-wide truncate">
                Simulador Solar & Ciclo Dia / Noite
              </h3>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  currentSolarStatus === 'dia'
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : currentSolarStatus === 'crepusculo'
                    ? 'bg-orange-500/25 text-orange-200 border border-orange-400/60 shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                    : 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/60 shadow-[0_0_8px_rgba(99,102,241,0.3)]'
                }`}
              >
                {currentSolarStatus === 'dia'
                  ? 'Dia Pleno'
                  : currentSolarStatus === 'crepusculo'
                  ? 'Crepúsculo'
                  : 'Noite Fechada'}
              </span>
            </div>
            <p className="text-[11px] text-amber-300/90 font-medium truncate flex items-center gap-1.5">
              <span>Brasília UTC-3</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-slate-300">Oficial: {liveBrasilia.formattedTime} BRT</span>
            </p>
          </div>
        </div>

        {/* Botões de Ação do Topo (Expandir / Fechar) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            id="btn-expandir-painel-solar"
            onClick={handleToggleExpand}
            className="hidden sm:flex p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title={isExpanded ? 'Recolher Painel Lateral' : 'Expandir para 50% da Tela'}
            aria-label="Alternar expansão do painel"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            id="btn-fechar-painel-solar"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
            title="Fechar Simulador Solar"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ABAS SUPERIORES: HORÁRIO & ANIMAÇÃO / ILUMINAÇÃO DE 3 PONTOS */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-3 py-1.5 gap-2 shrink-0">
        <button
          type="button"
          id="tab-simulador-tempo"
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveSubTab('tempo');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
            activeSubTab === 'tempo'
              ? 'bg-amber-500/25 text-amber-200 border-amber-400/80 shadow-sm shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulação & Horas</span>
        </button>

        <button
          type="button"
          id="tab-simulador-iluminacao"
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveSubTab('iluminacao');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
            activeSubTab === 'iluminacao'
              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/80 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Iluminação de 3 Pontos</span>
        </button>

        <div className="ml-auto">
          <button
            type="button"
            id="btn-restaurar-agora"
            onClick={() => {
              audioEngine.playSfx('click');
              onChangeSolarHour(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 cursor-pointer transition-all"
            title="Sincronizar imediatamente com o Sol real deste instante no Brasil"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Agora (Real)</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO COM SCROLL SUAVE */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 p-3.5 sm:p-4 space-y-3.5">
        {activeSubTab === 'tempo' && (
          <>
            {/* 1. ALTERNADOR IMEDIATO DIA / NOITE / TEMPO REAL (1 CLIQUE) */}
            <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
                <span>Alternar Iluminação Global (1 Clique)</span>
                <span className="text-amber-400/80 font-normal">Ajuste Instantâneo</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  id="btn-quick-dia"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(12);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour !== null && Math.abs(solarHour - 12) < 0.5
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                  }`}
                  title="Sol a Pino sobre o Brasil (12:00 BRT)"
                >
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                  <span>Dia (12:00)</span>
                </button>

                <button
                  type="button"
                  id="btn-quick-crepusculo"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(18);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour !== null && Math.abs(solarHour - 18) < 0.5
                      ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-orange-300 border-orange-500/30'
                  }`}
                  title="Pôr do Sol & Crepúsculo (18:00 BRT)"
                >
                  <Sunset className="w-3.5 h-3.5 shrink-0" />
                  <span>Ocaso (18h)</span>
                </button>

                <button
                  type="button"
                  id="btn-quick-noite"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(0);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour !== null && (Math.abs(solarHour) < 0.5 || Math.abs(solarHour - 24) < 0.5)
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-indigo-300 border-indigo-500/30'
                  }`}
                  title="Noite total com luzes urbanas NASA VIIRS (00:00 BRT)"
                >
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span>Noite (00:00)</span>
                </button>

                <button
                  type="button"
                  id="btn-quick-tempo-real"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    solarHour === null
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border-sky-500/30'
                  }`}
                  title={`Sincronizar ao vivo com Brasília (${liveBrasilia.formattedTime} BRT)`}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Agora ({liveBrasilia.formattedTime})</span>
                </button>
              </div>
            </div>

            {/* 2. CARD PRINCIPAL DO RELÓGIO E STATUS */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Posição Solar Simulada
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-amber-300 tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]">
                      {formattedSimulatedTime}
                    </span>
                    <span className="font-mono text-sm text-amber-400/80 font-bold">BRT</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {solarHour === null ? 'Sincronizado' : 'Modo Simulado'}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {displayHour >= 5 && displayHour < 12
                      ? 'Manhã / Nascer do Sol'
                      : displayHour >= 12 && displayHour < 17.5
                      ? 'Tarde / Sol a Pino'
                      : displayHour >= 17.5 && displayHour < 19.5
                      ? 'Crepúsculo Vespertino'
                      : 'Noite / Sideral'}
                  </span>
                </div>
              </div>

              {/* BOTÃO PLAY / PAUSE DO CICLO 24H E VELOCIDADE */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-play-ciclo-solar"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onToggleSolarCycle();
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                    isSolarCyclePlaying
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/50 shadow-sm'
                  }`}
                >
                  {isSolarCyclePlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pausar Rotação 24h</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>Animar Ciclo Solar Contínuo (24h)</span>
                    </>
                  )}
                </button>

                {/* Seletores de Velocidade */}
                {onChangeSolarCycleSpeed && (
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => onChangeSolarCycleSpeed(1)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        solarCycleSpeed === 1
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Velocidade normal: 1 volta completa a cada 36 segundos"
                    >
                      1x
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeSolarCycleSpeed(2)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        solarCycleSpeed === 2
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="2x mais rápido"
                    >
                      2x
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeSolarCycleSpeed(4)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        solarCycleSpeed === 4
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="4x ultra-rápido"
                    >
                      4x
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. SLIDER DE HORA SOLAR COM GRADIENTE E BOTÕES DE AJUSTE FINO */}
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Linha do Tempo Interativa (00:00 às 24:00 BRT)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    id="btn-recuar-1h"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      const current = solarHour ?? liveBrasilia.floatHours;
                      const next = (current - 1 + 24) % 24;
                      onChangeSolarHour(next);
                    }}
                    className="px-1.5 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] cursor-pointer flex items-center gap-0.5 transition-colors"
                    title="Recuar 1 hora"
                  >
                    <Minus className="w-2.5 h-2.5" />
                    <span>1h</span>
                  </button>
                  <button
                    type="button"
                    id="btn-avancar-1h"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      const current = solarHour ?? liveBrasilia.floatHours;
                      const next = (current + 1) % 24;
                      onChangeSolarHour(next);
                    }}
                    className="px-1.5 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] cursor-pointer flex items-center gap-0.5 transition-colors"
                    title="Avançar 1 hora"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>1h</span>
                  </button>
                </div>
              </div>

              {/* Range input interativo com fill animado */}
              <div className="relative pt-1">
                <SolarTrackSlider
                  id="slider-hora-solar-lateral"
                  min={0}
                  max={23.95}
                  step={0.05}
                  value={displayHour}
                  onChange={(val) => onChangeSolarHour(val)}
                  fillColor="#f59e0b"
                  ariaLabel="Ajustar hora solar interativa"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-0.5">
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-indigo-400" /> 00h
                  </span>
                  <span className="flex items-center gap-1">
                    <Sunrise className="w-3 h-3 text-amber-300" /> 06h
                  </span>
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" /> 12h
                  </span>
                  <span className="flex items-center gap-1">
                    <Sunset className="w-3 h-3 text-orange-400" /> 18h
                  </span>
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3 text-indigo-400" /> 24h
                  </span>
                </div>
              </div>
            </div>

            {/* 4. ATALHOS RÁPIDOS (PRESETS DE HORA DO DIA NO BRASIL) */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Momentos Chave no Território Nacional
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  id="btn-preset-06h"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(6);
                  }}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                    solarHour !== null && Math.abs(solarHour - 6) < 0.5
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sunrise className="w-4 h-4 text-amber-300" />
                    <span className="text-[10px] font-mono font-bold">06:00</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">Nascer do Sol</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Ponta do Seixas (PB)</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-preset-12h"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(12);
                  }}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                    solarHour !== null && Math.abs(solarHour - 12) < 0.5
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold">12:00</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">Sol a Pino</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Zênite em Brasília (DF)</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-preset-18h"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(18);
                  }}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                    solarHour !== null && Math.abs(solarHour - 18) < 0.5
                      ? 'bg-orange-500/25 border-orange-400 text-orange-200 shadow-md shadow-orange-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sunset className="w-4 h-4 text-orange-400" />
                    <span className="text-[10px] font-mono font-bold">18:00</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">Pôr do Sol</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Serra do Divisor (AC)</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-preset-00h"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onChangeSolarHour(0);
                  }}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                    solarHour !== null && (Math.abs(solarHour) < 0.5 || Math.abs(solarHour - 24) < 0.5)
                      ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono font-bold">00:00</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">Meia-Noite</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Metrópoles & NASA VIIRS</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. SELETOR DE ESTAÇÃO DO ANO (DECLINAÇÃO AXIAL) */}
            {onChangeSeason && season && (
              <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Estação do Ano • Declinação Solar</span>
                  <span className="text-amber-300 capitalize">{season}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: 'verao', label: 'Verão', icon: '☀️', desc: 'Solstício Sul' },
                      { id: 'outono', label: 'Outono', icon: '🍂', desc: 'Equinócio' },
                      { id: 'inverno', label: 'Inverno', icon: '❄️', desc: 'Solstício Norte' },
                      { id: 'primavera', label: 'Primavera', icon: '🌸', desc: 'Equinócio' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onChangeSeason(st.id);
                      }}
                      className={`p-1.5 rounded-lg text-center border cursor-pointer transition-all ${
                        season === st.id
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-sm'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs">{st.icon}</div>
                      <div className="text-[10px] font-semibold">{st.label}</div>
                      <div className="text-[8px] text-slate-400 truncate">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeSubTab === 'iluminacao' && (
          <div className="space-y-3">
            <div className="p-2.5 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              Técnica de Iluminação Cinematográfica em <strong>3 Pontos</strong>: o <strong>Sol</strong> como Key Light direta, a <strong>Lua</strong> como Soft Box natural de preenchimento, e a <strong>Luz Ambiente</strong> para clarear frestas e depressões do relevo.
            </div>

            {/* Grid responsivo de 2 colunas para compactar a altura e aproveitar a largura do painel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. SOL - LUZ HARD (KEY LIGHT) */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-200">1. Sol — Luz Hard (Key Light)</div>
                      <div className="text-[10px] text-slate-400">Feixe direcional solar de alto contraste</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
                    {(sunIntensity * 100).toFixed(0)}%
                  </span>
                </div>

                <SolarTrackSlider
                  id="slider-intensidade-sol"
                  min={0.50}
                  max={2.00}
                  step={0.05}
                  value={sunIntensity}
                  onChange={onChangeSunIntensity}
                  fillColor="#f59e0b"
                  leftLabel="50% Suave"
                  centerLabel="125% Padrão"
                  rightLabel="200% Intenso"
                  ariaLabel="Intensidade do Sol"
                />
              </div>

              {/* 2. LUA - LUZ DE PREENCHIMENTO (FILL LIGHT / SOFT BOX NATURAL) */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-200">2. Lua — Soft Box (Fill Light)</div>
                      <div className="text-[10px] text-slate-400">Preenchimento com suave glow</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/40">
                    {Math.round(moonLightIntensity * 100)}%
                  </span>
                </div>

                {/* Presets Rápidos */}
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    id="btn-moon-suave"
                    onClick={() => onChangeMoonLightIntensity(0.35)}
                    className={`py-0.5 px-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                      Math.abs(moonLightIntensity - 0.35) < 0.05
                        ? 'bg-indigo-500 text-slate-950 border-indigo-300 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    Suave (35%)
                  </button>
                  <button
                    type="button"
                    id="btn-moon-natural"
                    onClick={() => onChangeMoonLightIntensity(0.65)}
                    className={`py-0.5 px-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                      Math.abs(moonLightIntensity - 0.65) < 0.05
                        ? 'bg-indigo-500 text-slate-950 border-indigo-300 font-bold shadow-sm'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    Natural (65%)
                  </button>
                  <button
                    type="button"
                    id="btn-moon-pleno"
                    onClick={() => onChangeMoonLightIntensity(0.95)}
                    className={`py-0.5 px-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                      Math.abs(moonLightIntensity - 0.95) < 0.05
                        ? 'bg-indigo-500 text-slate-950 border-indigo-300 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    Pleno (95%)
                  </button>
                </div>

                <SolarTrackSlider
                  id="slider-luz-lua-lateral"
                  min={0.10}
                  max={1.00}
                  step={0.02}
                  value={moonLightIntensity}
                  onChange={onChangeMoonLightIntensity}
                  fillColor="#818cf8"
                  leftLabel="10% Sutil"
                  centerLabel="65% Soft Box"
                  rightLabel="100% Intenso"
                  ariaLabel="Intensidade do Luar"
                />
              </div>

              {/* 3. LUZ AMBIENTE (FAKE GAPS FILL) */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-sky-200">3. Luz Ambiente (Gaps Fill)</div>
                      <div className="text-[10px] text-slate-400">Preenchimento suave de sombras</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-500/40">
                    {Math.round(ambientLightIntensity * 100)}%
                  </span>
                </div>

                {/* Presets Rápidos */}
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    id="btn-ambient-baixo"
                    onClick={() => onChangeAmbientLightIntensity(0.10)}
                    className={`py-0.5 px-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                      Math.abs(ambientLightIntensity - 0.10) < 0.03
                        ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    Baixo (10%)
                  </button>
                  <button
                    type="button"
                    id="btn-ambient-ideal"
                    onClick={() => onChangeAmbientLightIntensity(0.20)}
                    className={`py-0.5 px-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                      Math.abs(ambientLightIntensity - 0.20) < 0.03
                        ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold shadow-sm'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    Ideal (20%)
                  </button>
                  <button
                    type="button"
                    id="btn-ambient-claro"
                    onClick={() => onChangeAmbientLightIntensity(0.35)}
                    className={`py-0.5 px-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all ${
                      Math.abs(ambientLightIntensity - 0.35) < 0.03
                        ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    Claro (35%)
                  </button>
                </div>

                <SolarTrackSlider
                  id="slider-luz-ambiente-lateral"
                  min={0.05}
                  max={0.50}
                  step={0.01}
                  value={ambientLightIntensity}
                  onChange={onChangeAmbientLightIntensity}
                  fillColor="#38bdf8"
                  leftLabel="5% Sombra"
                  centerLabel="20% Equilibrado"
                  rightLabel="50% Claro"
                  ariaLabel="Intensidade da Luz Ambiente"
                />
              </div>

              {/* 4. LUZES URBANAS (NASA VIIRS BLACK MARBLE) */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-200">4. Luzes Noturnas (VIIRS)</div>
                      <div className="text-[10px] text-slate-400">Radiância urbana das metrópoles</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
                    {(cityLightIntensity * 100).toFixed(0)}%
                  </span>
                </div>

                <SolarTrackSlider
                  id="slider-luzes-cidades-lateral"
                  min={0.40}
                  max={2.50}
                  step={0.05}
                  value={cityLightIntensity}
                  onChange={onChangeCityLightIntensity}
                  fillColor="#f59e0b"
                  leftLabel="40% Discreto"
                  centerLabel="140% Equilibrado"
                  rightLabel="250% Brilho"
                  ariaLabel="Intensidade das Luzes das Cidades"
                />
              </div>
            </div>

            {/* 5. NUVENS E ATMOSFERA */}
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">5. Camada de Nuvens Dinâmicas</div>
                    <div className="text-[10px] text-slate-400">Deriva zonal dos ventos alísios & sombras</div>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-toggle-nuvens-lateral"
                  onClick={onToggleClouds}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                    cloudsVisible
                      ? 'bg-sky-500/25 text-sky-200 border-sky-400'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {cloudsVisible ? 'Visível' : 'Oculto'}
                </button>
              </div>

              {cloudsVisible && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Opacidade da Camada:</span>
                    <span className="font-mono text-sky-300 font-bold">{Math.round(cloudsOpacity * 100)}%</span>
                  </div>
                  <SolarTrackSlider
                    id="slider-opacidade-nuvens-lateral"
                    min={0.05}
                    max={0.60}
                    step={0.02}
                    value={cloudsOpacity}
                    onChange={onChangeCloudsOpacity}
                    fillColor="#38bdf8"
                    leftLabel="5% Sutil"
                    centerLabel="30% Natural"
                    rightLabel="60% Densa"
                    ariaLabel="Opacidade das nuvens"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RODAPÉ DO PAINEL */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <button
          type="button"
          id="btn-resetar-padroes-iluminacao"
          onClick={() => {
            audioEngine.playSfx('click');
            onResetDefaults();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
          title="Restaurar parâmetros recomendados de estúdio 3D"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Calibração Ideal</span>
        </button>

        <button
          type="button"
          id="btn-concluir-painel-solar"
          onClick={handleClose}
          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 cursor-pointer transition-all"
        >
          Concluir
        </button>
      </div>
    </div>
  );
};
