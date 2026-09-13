/**
 * CelestialTrajectoryPanel - Painel de Telemetria e Trajetória Interplanetária
 */
import React from 'react';
import {
  Rocket,
  Clock,
  Radio,
  Sparkles,
  Info,
  Target,
  Compass,
  X,
} from 'lucide-react';
import {
  CelestialBodyInfo,
  CosmicTrajectoryTelemetry,
} from '../../lib/globeEngine/types';

interface CelestialTrajectoryPanelProps {
  selectedAstro: CelestialBodyInfo;
  telemetry: CosmicTrajectoryTelemetry;
  onFocusAstroCamera: (astro: CelestialBodyInfo) => void;
  onClose: () => void;
}

export const CelestialTrajectoryPanel: React.FC<CelestialTrajectoryPanelProps> = ({
  selectedAstro,
  telemetry,
  onFocusAstroCamera,
  onClose,
}) => {
  return (
    <div
      id="painel-trajetoria-interplanetaria"
      className="painel-trajetoria-interplanetaria pointer-events-auto absolute top-14 sm:top-14 right-2 sm:right-4 w-auto sm:w-96 max-w-[calc(100vw-68px)] max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 bg-[#030712] border-2 border-cyan-400/90 rounded-3xl p-3.5 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.98)] text-slate-100 font-sans backdrop-blur-2xl animate-in slide-in-from-right-4 duration-300 z-40 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
            <Rocket className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-serif font-black text-cyan-300">
                {selectedAstro.symbol} {selectedAstro.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono font-bold">
                TRAJETÓRIA ATIVA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Origem: {telemetry.originStateName}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-fechar-trajetoria-astro"
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition cursor-pointer"
          title="Fechar Trajetória e Recentralizar Brasil"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Telemetria de Voo e Distância */}
      <div className="space-y-2.5 text-xs">
        {/* Linha de Trajetória Info */}
        <div className="p-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-cyan-400/80 font-mono block">
              Distância Geodésica
            </span>
            <span className="text-base font-mono font-black text-cyan-200">
              {telemetry.distanceKm.toLocaleString('pt-BR')} km
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">
              Unidades Astronômicas
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {telemetry.distanceAu.toFixed(4)} UA
            </span>
          </div>
        </div>

        {/* Grid de Métricas da Missão */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Clock className="w-3 h-3 text-cyan-400" /> Tempo-Luz (1 Via)
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 block pt-0.5">
              {telemetry.lightTimeFormatted}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Radio className="w-3 h-3 text-amber-400" /> Ping de Rádio (2 Vias)
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 block pt-0.5">
              {telemetry.radioPingLatencyFormatted}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Rocket className="w-3 h-3 text-rose-400" /> Voo de Sonda (~15 km/s)
            </span>
            <span className="text-xs font-mono font-bold text-slate-200 block pt-0.5">
              {telemetry.probeTravelFormatted}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Gravidade
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300 block pt-0.5">
              {telemetry.gravityRelativeFormatted}
            </span>
          </div>
        </div>

        {/* Curiosidade do Astro */}
        <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 text-[10px] text-slate-300 space-y-1 font-serif">
          <div className="flex items-center gap-1 text-amber-400 font-bold font-mono text-[9px] uppercase tracking-wider">
            <Info className="w-3 h-3" />
            <span>Curiosidade Astrofísica</span>
          </div>
          <p className="italic leading-relaxed">
            "{selectedAstro.curiosity}"
          </p>
        </div>

        {/* Ações de Câmera e Navegação */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <button
            type="button"
            id="btn-focar-astro"
            onClick={() => onFocusAstroCamera(selectedAstro)}
            className="btn-focar-astro py-2 px-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-serif font-black text-xs uppercase tracking-wider transition shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Aproximar Astro</span>
          </button>

          <button
            type="button"
            id="btn-voltar-brasil"
            onClick={onClose}
            className="btn-voltar-brasil py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-serif font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Voltar ao Brasil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
