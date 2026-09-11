import React from 'react';
import { Play, Pause, RotateCcw, Gauge, Orbit, Sparkles, Calendar } from 'lucide-react';
import { HeliocentricOrbitalState } from '../../lib/globeEngine/orbitalPhysics';
import { audioEngine } from '../../lib/audioSynth';
import { GlobeFilledSlider } from './GlobeFilledSlider';

interface FullYearSimulationCardProps {
  orbitalDayOfYear: number;
  onChangeOrbitalDayOfYear: (day: number) => void;
  isOrbitalPlaying: boolean;
  onToggleOrbitalPlay: () => void;
  orbitalSpeedDaysPerSec: number;
  onChangeOrbitalSpeed: (speed: number) => void;
  orbitalState: HeliocentricOrbitalState;
}

const SPEED_PRESETS = [
  { speed: 10, label: '10 d/s', desc: '36s / ano' },
  { speed: 30, label: '30 d/s', desc: '12s / ano' },
  { speed: 60, label: '60 d/s', desc: '6s / ano' },
  { speed: 120, label: '120 d/s', desc: '3s / ano' },
];

export const FullYearSimulationCard: React.FC<FullYearSimulationCardProps> = ({
  orbitalDayOfYear,
  onChangeOrbitalDayOfYear,
  isOrbitalPlaying,
  onToggleOrbitalPlay,
  orbitalSpeedDaysPerSec,
  onChangeOrbitalSpeed,
  orbitalState,
}) => {
  const currentDay = Math.round(orbitalDayOfYear);
  const progressPercent = Math.min(100, Math.max(0, (orbitalDayOfYear / 365.25) * 100));
  const estimatedSecondsForYear = Math.max(1, Math.round(365 / Math.max(1, orbitalSpeedDaysPerSec)));

  return (
    <div className="card-simulador-ano-completo relative overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-950 p-3.5 shadow-xl shadow-amber-950/30 space-y-3">
      {/* Luz ambiente de destaque */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* CABEÇALHO COM BADGE DE DESTAQUE */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
            <Orbit className={`w-4 h-4 ${isOrbitalPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5 leading-none">
              <span>Simulação de 1 Ano Completo</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <span className="text-[9.5px] text-slate-400">Translação física heliocêntrica (365 dias)</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/40 text-[9px] font-bold text-amber-300 font-mono">
          365 DIAS
        </span>
      </div>

      {/* BOTÃO PRINCIPAL DE AÇÃO (PLAY / PAUSE COM DESTAQUE MÁXIMO) */}
      <div className="grid grid-cols-4 gap-1.5 relative z-10">
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            onToggleOrbitalPlay();
          }}
          className={`btn-acao-ano-completo col-span-3 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border shadow-lg ${
            isOrbitalPlaying
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/30 animate-pulse'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-300 shadow-amber-500/20 hover:scale-[1.01]'
          }`}
        >
          {isOrbitalPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
          <span>{isOrbitalPlaying ? 'Pausar Simulação de 1 Ano' : 'Iniciar Simulação de 1 Ano'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            onChangeOrbitalDayOfYear(1);
          }}
          className="col-span-1 py-2.5 px-2 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
          title="Reiniciar para o Dia 1 (01 de Janeiro)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Dia 1</span>
        </button>
      </div>

      {/* LINHA DO TEMPO / PROGRESSO DE 1 ANO */}
      <div className="space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 relative z-10">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Dia <strong className="text-amber-300 font-mono">{currentDay}</strong> de 365</span>
          </span>
          <span className="text-amber-300 font-bold font-mono">
            {progressPercent.toFixed(0)}% do ano
          </span>
        </div>

        {/* Barra de Progresso do Ano com Marcadores dos Solstícios / Equinócios */}
        <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-100 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status da Estação Atual e Data Formatada */}
        <div className="flex items-center justify-between text-[9.5px] text-slate-400 pt-0.5">
          <span className="text-slate-200 font-semibold">{orbitalState.formattedDate}</span>
          <span className="text-amber-400 font-medium">{orbitalState.seasonBrazil}</span>
        </div>
      </div>

      {/* SLIDER DE CONTROLE DE VELOCIDADE DA TRANSLAÇÃO */}
      <div className="space-y-1.5 pt-1 relative z-10">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>Velocidade da Translação:</span>
          </span>
          <span className="font-mono text-amber-300 font-bold">
            {orbitalSpeedDaysPerSec} dias/s <span className="text-slate-400 font-normal text-[9.5px]">({estimatedSecondsForYear}s/ano)</span>
          </span>
        </div>

        <GlobeFilledSlider
          min={5}
          max={120}
          step={1}
          value={orbitalSpeedDaysPerSec}
          onChange={(newSpeed) => onChangeOrbitalSpeed(Math.round(newSpeed))}
          fillColorClass="bg-amber-400"
          ariaLabel="Controle de velocidade da translação"
        />

        {/* Chips de Velocidade Pré-definida */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          {SPEED_PRESETS.map((preset) => (
            <button
              key={preset.speed}
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onChangeOrbitalSpeed(preset.speed);
              }}
              className={`py-1 px-1 rounded-lg text-center cursor-pointer border transition-all ${
                orbitalSpeedDaysPerSec === preset.speed
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
            >
              <div className="text-[10px] leading-tight font-mono">{preset.label}</div>
              <div className="text-[8px] opacity-75 leading-tight">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
