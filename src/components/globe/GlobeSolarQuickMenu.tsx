/**
 * GlobeSolarQuickMenu - Popover de Controle Rápido de Iluminação e Posição Solar
 * Permite ajustar a hora do dia (0h-24h), reproduzir o ciclo solar e modular iluminação direta.
 */
import React from 'react';
import {
  Sun,
  Play,
  Pause,
  Clock,
  RotateCcw,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { GlobeFilledSlider } from './GlobeFilledSlider';

interface GlobeSolarQuickMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  solarHour: number | null;
  onChangeSolarHour: (hour: number | null) => void;
  isSolarCyclePlaying: boolean;
  onToggleSolarCycle: () => void;
  solarCycleSpeed: number;
  onChangeSolarCycleSpeed: (speed: number) => void;
  sunIntensity: number;
  onChangeSunIntensity: (intensity: number) => void;
  ambientLightIntensity: number;
  onChangeAmbientLightIntensity: (intensity: number) => void;
  cloudsOpacity: number;
  onChangeCloudsOpacity: (opacity: number) => void;
  cityLightIntensity: number;
  onChangeCityLightIntensity: (intensity: number) => void;
  onResetDefaults: () => void;
  brasiliaTimeFormatted: string;
}

export const GlobeSolarQuickMenu: React.FC<GlobeSolarQuickMenuProps> = ({
  isOpen,
  onToggle,
  solarHour,
  onChangeSolarHour,
  isSolarCyclePlaying,
  onToggleSolarCycle,
  solarCycleSpeed,
  onChangeSolarCycleSpeed,
  sunIntensity,
  onChangeSunIntensity,
  ambientLightIntensity,
  onChangeAmbientLightIntensity,
  cloudsOpacity,
  onChangeCloudsOpacity,
  cityLightIntensity,
  onChangeCityLightIntensity,
  onResetDefaults,
  brasiliaTimeFormatted,
}) => {
  const isRealTime = solarHour === null;
  const displayHour = solarHour ?? 12;

  const formatHour = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        id="btn-menu-solar-rapido"
        onClick={onToggle}
        className={`btn-menu-solar-rapido w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm shrink-0 ${
          isOpen
            ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-amber-500/20 ring-1 ring-amber-400/50'
            : 'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700/80 text-slate-200 hover:text-amber-300'
        }`}
        title={`Iluminação Rápida & Ciclo Solar (${isRealTime ? 'Tempo Real' : formatHour(displayHour)})`}
        aria-label="Ciclo Solar"
      >
        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="popover-solar-rapido"
          className="popover-solar-rapido fixed bottom-16 left-[56px] right-2 sm:absolute sm:bottom-full sm:mb-2.5 sm:left-auto sm:right-0 sm:w-80 w-auto max-w-sm max-h-[min(480px,calc(100vh-100px))] overflow-y-auto rounded-2xl bg-[#030712] border border-amber-500/50 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 space-y-3 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Ciclo Solar 24h</span>
            </span>
            <button
              type="button"
              id="btn-restaurar-iluminacao-rapida"
              onClick={onResetDefaults}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar
            </button>
          </div>

          {/* Modo Tempo Real vs Simulado */}
          <div className="flex gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              id="btn-horario-brasilia-tempo-real"
              onClick={() => onChangeSolarHour(null)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                isRealTime
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Real ({brasiliaTimeFormatted})</span>
            </button>
            <button
              type="button"
              id="btn-horario-solar-simulado"
              onClick={() => {
                if (isRealTime) onChangeSolarHour(12);
              }}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                !isRealTime
                  ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Simulado</span>
            </button>
          </div>

          {/* Slider de Hora Solar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Hora Solar Local
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {formatHour(displayHour)}
              </span>
            </div>
            <GlobeFilledSlider
              id="slider-hora-solar-rapida"
              value={displayHour}
              onChange={(val) => onChangeSolarHour(val)}
              min={0}
              max={24}
              step={0.1}
              fillColorClass="bg-amber-500"
            />
          </div>

          {/* Play/Pause do Ciclo */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
            <button
              type="button"
              id="btn-play-ciclo-solar"
              onClick={onToggleSolarCycle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isSolarCyclePlaying
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isSolarCyclePlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pausar Ciclo
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Animar Ciclo
                </>
              )}
            </button>

            {/* Velocidade do Ciclo */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeSolarCycleSpeed(spd)}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    solarCycleSpeed === spd
                      ? 'bg-amber-500/30 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Intensidades Rápidas */}
          <div className="space-y-2 pt-1 border-t border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Intensidade Solar</span>
                <span className="font-mono text-amber-400">{sunIntensity.toFixed(1)}x</span>
              </div>
              <GlobeFilledSlider
                id="slider-intensidade-sol"
                value={sunIntensity}
                onChange={onChangeSunIntensity}
                min={0.2}
                max={3.0}
                step={0.1}
                fillColorClass="bg-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Nuvens & Nebulosidade</span>
                <span className="font-mono text-sky-400">
                  {Math.round(cloudsOpacity * 100)}%
                </span>
              </div>
              <GlobeFilledSlider
                id="slider-opacidade-nuvens"
                value={cloudsOpacity}
                onChange={onChangeCloudsOpacity}
                min={0}
                max={1.0}
                step={0.05}
                fillColorClass="bg-sky-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
