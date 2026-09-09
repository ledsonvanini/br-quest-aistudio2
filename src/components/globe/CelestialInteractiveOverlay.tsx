import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Radio,
  Rocket,
  Clock,
  Thermometer,
  Eye,
  Info,
  X,
  Target,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  ProjectedCelestialPin,
  CelestialBodyInfo,
  CosmicTrajectoryTelemetry,
} from '../../lib/globeEngine/types';

interface CelestialInteractiveOverlayProps {
  pins: ProjectedCelestialPin[];
  selectedAstro: CelestialBodyInfo | null;
  trajectoryTelemetry: CosmicTrajectoryTelemetry | null;
  onSelectAstro: (astro: CelestialBodyInfo | null) => void;
  onFocusAstroCamera: (astro: CelestialBodyInfo) => void;
  onResetToBrazil: () => void;
}

export const CelestialInteractiveOverlay: React.FC<CelestialInteractiveOverlayProps> = ({
  pins,
  selectedAstro,
  trajectoryTelemetry,
  onSelectAstro,
  onFocusAstroCamera,
  onResetToBrazil,
}) => {
  const [hoveredAstroId, setHoveredAstroId] = useState<string | null>(null);

  // Active astro shown in detailed hover or selection
  const activeHoveredPin = pins.find((p) => p.id === hoveredAstroId);
  const activePinData = activeHoveredPin?.data || selectedAstro;

  // Guarantee telemetry data is always available when an astro is selected
  const effectiveTelemetry =
    trajectoryTelemetry ||
    (selectedAstro
      ? {
          targetAstro: selectedAstro,
          originStateId: 'BR',
          originStateName: 'Brasil (Órbita)',
          distanceKm: selectedAstro.distanceKm || 384400,
          distanceAu: (selectedAstro.distanceKm || 384400) / 149597870.7,
          lightTimeFormatted: `${((selectedAstro.distanceKm || 384400) / 299792.458).toFixed(1)} seg`,
          radioPingLatencyFormatted: `${(((selectedAstro.distanceKm || 384400) / 299792.458) * 2).toFixed(1)} seg`,
          probeTravelFormatted: `${((selectedAstro.distanceKm || 384400) / (15 * 86400)).toFixed(1)} dias`,
          gravityRelativeFormatted: `${(selectedAstro.gravityMss / 9.807).toFixed(2)}g`,
        }
      : null);

  return (
    <div className="container-overlay-astronomico pointer-events-none absolute inset-0 z-30 overflow-hidden select-none">
      {/* 1. Celestial Screen Pins */}
      {pins.map((pin) => {
        if (!pin.visible) return null;

        const isHovered = hoveredAstroId === pin.id;
        const isSelected = selectedAstro?.id === pin.id;

        return (
          <div
            key={pin.id}
            id={`pin-astro-${pin.id}`}
            style={{
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredAstroId(pin.id)}
            onMouseLeave={() => setHoveredAstroId((cur) => (cur === pin.id ? null : cur))}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAstro(isSelected ? null : pin.data);
            }}
            className={`pin-astro-celeste pointer-events-auto absolute flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              isSelected ? 'scale-115 z-40' : isHovered ? 'scale-110 z-35' : 'opacity-85 hover:opacity-100 z-20'
            }`}
          >
            {/* Pulsing Aura */}
            <div
              className={`relative flex items-center justify-center rounded-full border transition-all ${
                isSelected
                  ? 'w-7 h-7 bg-cyan-500/30 border-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.8)] animate-pulse'
                  : isHovered
                  ? 'w-6 h-6 bg-amber-500/30 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'w-5 h-5 bg-slate-950/75 border-slate-400/60 shadow-[0_0_8px_rgba(0,0,0,0.5)]'
              }`}
            >
              <span
                style={{ color: pin.color }}
                className="text-xs font-serif font-black leading-none"
              >
                {pin.symbol}
              </span>
            </div>

            {/* Label Chip */}
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider transition-all backdrop-blur-md border ${
                isSelected
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400/80 shadow-md shadow-cyan-950/60'
                  : isHovered
                  ? 'bg-amber-950/90 text-amber-200 border-amber-400/80 shadow-md shadow-amber-950/60'
                  : 'bg-slate-950/70 text-slate-300 border-slate-700/60'
              }`}
            >
              <span>{pin.name}</span>
            </div>
          </div>
        );
      })}

      {/* 2. Balão de Diálogo Cósmico no Hover (Estilo Modo Clima / Cartografia) */}
      {hoveredAstroId && activeHoveredPin && !selectedAstro && (
        <div
          id="balao-dialogo-astro-hover"
          style={{
            left: `${Math.min(window.innerWidth - 320, Math.max(20, activeHoveredPin.x + 24))}px`,
            top: `${Math.min(window.innerHeight - 260, Math.max(80, activeHoveredPin.y - 40))}px`,
          }}
          className="balao-dialogo-astro pointer-events-auto absolute w-72 sm:w-80 bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-slate-100 font-sans backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                style={{ color: activeHoveredPin.color }}
                className="text-base font-serif font-black"
              >
                {activeHoveredPin.symbol}
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm text-amber-300 leading-tight">
                  {activeHoveredPin.name}
                </h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                  {activeHoveredPin.categoryLabel}
                </p>
              </div>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono font-bold">
              {activeHoveredPin.lightTimeFormatted} luz
            </span>
          </div>

          {/* Body stats */}
          <div className="space-y-1.5 text-[10px]">
            <p className="text-slate-300 leading-relaxed font-serif italic line-clamp-2">
              "{activeHoveredPin.data.description}"
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[8px] text-slate-400 flex items-center gap-1 font-mono uppercase">
                  <Compass className="w-2.5 h-2.5 text-amber-400" /> Distância
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 block">
                  {(activeHoveredPin.data.distanceKm / 1e6).toFixed(1)} M km
                </span>
              </div>

              <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[8px] text-slate-400 flex items-center gap-1 font-mono uppercase">
                  <Thermometer className="w-2.5 h-2.5 text-rose-400" /> Temperatura
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-200 block truncate">
                  {activeHoveredPin.data.surfaceTemp}
                </span>
              </div>
            </div>

            <div className="pt-1 text-[9px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800/80">
              <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{activeHoveredPin.data.visibilityBrazil}</span>
            </div>

            <div className="text-[8px] text-cyan-300/80 font-mono text-center pt-0.5">
              ✦ Clique para calcular trajetória e traçar rota interplanetária
            </div>
          </div>
        </div>
      )}

      {/* 2. Painel Flutuante de Trajetória Cósmica Interplanetária (Ao Clicar no Astro) */}
      {selectedAstro && effectiveTelemetry && (
        <div
          id="painel-trajetoria-interplanetaria"
          className="painel-trajetoria-interplanetaria pointer-events-auto absolute top-20 right-4 sm:right-6 w-80 sm:w-96 max-w-[calc(100vw-32px)] bg-[#030712] border-2 border-cyan-400/90 rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.98)] text-slate-100 font-sans backdrop-blur-2xl animate-in slide-in-from-right-4 duration-300 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
                <Rocket className="w-5 h-5 animate-pulse" />
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
                  Origem: {effectiveTelemetry.originStateName}
                </p>
              </div>
            </div>

            <button
              id="btn-fechar-trajetoria-astro"
              onClick={() => {
                onSelectAstro(null);
                onResetToBrazil();
              }}
              className="p-1 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition cursor-pointer"
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
                  {effectiveTelemetry.distanceKm.toLocaleString('pt-BR')} km
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">
                  Unidades Astronômicas
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {effectiveTelemetry.distanceAu.toFixed(4)} UA
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
                  {effectiveTelemetry.lightTimeFormatted}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
                  <Radio className="w-3 h-3 text-amber-400" /> Ping de Rádio (2 Vias)
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 block pt-0.5">
                  {effectiveTelemetry.radioPingLatencyFormatted}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
                  <Rocket className="w-3 h-3 text-rose-400" /> Voo de Sonda (~15 km/s)
                </span>
                <span className="text-xs font-mono font-bold text-slate-200 block pt-0.5">
                  {effectiveTelemetry.probeTravelFormatted}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono uppercase">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Gravidade
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300 block pt-0.5">
                  {effectiveTelemetry.gravityRelativeFormatted}
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
                id="btn-focar-astro"
                onClick={() => onFocusAstroCamera(selectedAstro)}
                className="btn-focar-astro py-2 px-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-serif font-black text-xs uppercase tracking-wider transition shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Aproximar Astro</span>
              </button>

              <button
                id="btn-voltar-brasil"
                onClick={() => {
                  onSelectAstro(null);
                  onResetToBrazil();
                }}
                className="btn-voltar-brasil py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-serif font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Voltar ao Brasil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
