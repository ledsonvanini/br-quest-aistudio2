import React from 'react';
import {
  Sun,
  Moon,
  Sunset,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sliders,
  Plus,
  Minus,
  Building2,
  Cloud,
} from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export interface GlobeSolarLightingTabProps {
  solarHour: number | null;
  onChangeSolarHour: (hour: number | null) => void;
  isSolarCyclePlaying: boolean;
  onToggleSolarCycle: () => void;
  solarCycleSpeed: number;
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
}

export const GlobeSolarLightingTab: React.FC<GlobeSolarLightingTabProps> = ({
  solarHour,
  onChangeSolarHour,
  isSolarCyclePlaying,
  onToggleSolarCycle,
  solarCycleSpeed,
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
}) => {
  const displayHour = solarHour !== null ? solarHour : liveBrasilia.floatHours;
  const hoursInt = Math.floor(displayHour) % 24;
  const minutesInt = Math.floor((displayHour % 1) * 60);
  const formattedSimulatedTime = `${hoursInt.toString().padStart(2, '0')}:${minutesInt.toString().padStart(2, '0')}`;

  return (
    <div className="painel-solar-iluminacao space-y-3 text-slate-200">
      {/* 1. ALTERNADOR RÁPIDO (1 CLIQUE) */}
      <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
          <span>Iluminação Rápida (1 Clique)</span>
          <span className="text-amber-400 font-normal">Ajuste Instantâneo</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => { audioEngine.playSfx('click'); onChangeSolarHour(12); }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
              solarHour !== null && Math.abs(solarHour - 12) < 0.5
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-500/30'
            }`}
          >
            <Sun className="w-3.5 h-3.5 shrink-0" />
            <span>Dia (12h)</span>
          </button>
          <button
            type="button"
            onClick={() => { audioEngine.playSfx('click'); onChangeSolarHour(18); }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
              solarHour !== null && Math.abs(solarHour - 18) < 0.5
                ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-orange-300 border-orange-500/30'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 shrink-0" />
            <span>Ocaso (18h)</span>
          </button>
          <button
            type="button"
            onClick={() => { audioEngine.playSfx('click'); onChangeSolarHour(0); }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
              solarHour !== null && (Math.abs(solarHour) < 0.5 || Math.abs(solarHour - 24) < 0.5)
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <Moon className="w-3.5 h-3.5 shrink-0" />
            <span>Noite (00h)</span>
          </button>
          <button
            type="button"
            onClick={() => { audioEngine.playSfx('click'); onChangeSolarHour(null); }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
              solarHour === null
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border-sky-500/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Agora ({liveBrasilia.formattedTime})</span>
          </button>
        </div>
      </div>

      {/* 2. CARD DO RELÓGIO & PLAY DO CICLO 24H */}
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hora Solar (Brasília UTC-3)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-3xl font-black text-amber-300">{formattedSimulatedTime}</span>
              <span className="font-mono text-sm text-amber-400/80 font-bold">BRT</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">{solarHour === null ? 'Ao Vivo' : 'Simulado'}</span>
            <span className="text-xs font-semibold text-slate-300">
              {displayHour >= 5 && displayHour < 12 ? 'Manhã' : displayHour >= 12 && displayHour < 18 ? 'Tarde' : displayHour >= 18 && displayHour < 20 ? 'Crepúsculo' : 'Noite'}
            </span>
          </div>
        </div>

        {/* SLIDER 24H */}
        <div className="space-y-1">
          <div className="relative w-full flex items-center h-6">
            <div className="absolute inset-x-0 h-2.5 rounded-full bg-slate-900 border border-slate-700/80 overflow-hidden shadow-inner">
              <div className="h-full rounded-full bg-amber-500 transition-all duration-75" style={{ width: `${(displayHour / 24) * 100}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={0.1}
              value={displayHour}
              onChange={(e) => onChangeSolarHour(parseFloat(e.target.value))}
              className="solar-range-input relative z-10 w-full h-6 cursor-pointer focus:outline-none"
              aria-label="Hora solar"
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-0.5">
            <span>00:00 (Meia-Noite)</span>
            <span className="text-amber-300 font-bold">12:00 (Zênite)</span>
            <span>24:00 (Noite)</span>
          </div>
        </div>

        {/* BOTÃO ANIMAR CICLO 24H */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => { audioEngine.playSfx('click'); onToggleSolarCycle(); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border transition-all ${
              isSolarCyclePlaying ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30' : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/50'
            }`}
          >
            {isSolarCyclePlaying ? (<><Pause className="w-4 h-4" /><span>Pausar Rotação 24h</span></>) : (<><Play className="w-4 h-4 fill-amber-400 text-amber-400" /><span>Animar Ciclo Solar (24h)</span></>)}
          </button>
          {onChangeSolarCycleSpeed && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => { audioEngine.playSfx('click'); onChangeSolarCycleSpeed(spd); }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    solarCycleSpeed === spd ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. CONTROLES DE ILUMINAÇÃO DE 3 PONTOS */}
      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Iluminação de 3 Pontos</span>
          <button type="button" onClick={onResetDefaults} className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px] font-bold cursor-pointer">
            <RotateCcw className="w-3 h-3" /> Restaurar Padrões
          </button>
        </div>

        {/* Luz Solar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-300"><Sun className="w-3.5 h-3.5" /> Luz Solar Direta</span>
            <span className="font-mono text-amber-400">{sunIntensity.toFixed(2)}x</span>
          </div>
          <input type="range" min={0.2} max={3.0} step={0.05} value={sunIntensity} onChange={(e) => onChangeSunIntensity(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer" />
        </div>

        {/* Luz Lunar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-indigo-300"><Moon className="w-3.5 h-3.5" /> Luz Lunar Sideral</span>
            <span className="font-mono text-indigo-400">{moonLightIntensity.toFixed(2)}x</span>
          </div>
          <input type="range" min={0.0} max={2.0} step={0.05} value={moonLightIntensity} onChange={(e) => onChangeMoonLightIntensity(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg accent-indigo-500 cursor-pointer" />
        </div>

        {/* Luz Ambiente */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300"><Sliders className="w-3.5 h-3.5" /> Luz Ambiente Noturna</span>
            <span className="font-mono text-slate-400">{ambientLightIntensity.toFixed(2)}x</span>
          </div>
          <input type="range" min={0.05} max={0.8} step={0.02} value={ambientLightIntensity} onChange={(e) => onChangeAmbientLightIntensity(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg accent-slate-400 cursor-pointer" />
        </div>

        {/* Cidades NASA */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-200"><Building2 className="w-3.5 h-3.5" /> Luzes Urbanas (NASA VIIRS)</span>
            <span className="font-mono text-amber-300">{cityLightIntensity.toFixed(2)}x</span>
          </div>
          <input type="range" min={0.0} max={3.0} step={0.05} value={cityLightIntensity} onChange={(e) => onChangeCityLightIntensity(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-400 cursor-pointer" />
        </div>

        {/* Nuvens */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-sky-200"><Cloud className="w-3.5 h-3.5" /> Nuvens Dinâmicas</span>
            <span className="font-mono text-sky-300">{Math.round(cloudsOpacity * 100)}%</span>
          </div>
          <input type="range" min={0.0} max={1.0} step={0.02} value={cloudsOpacity} onChange={(e) => onChangeCloudsOpacity(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg accent-sky-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
