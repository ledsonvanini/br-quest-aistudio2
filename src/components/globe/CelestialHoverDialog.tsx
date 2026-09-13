/**
 * CelestialHoverDialog - Balão Cósmico de Diálogo Rápido no Hover de Astro
 */
import React from 'react';
import { Compass, Thermometer, Eye } from 'lucide-react';
import { ProjectedCelestialPin } from '../../lib/globeEngine/types';

interface CelestialHoverDialogProps {
  pin: ProjectedCelestialPin;
}

export const CelestialHoverDialog: React.FC<CelestialHoverDialogProps> = ({ pin }) => {
  // Clamp boundaries within viewport
  const leftPos = Math.min(
    typeof window !== 'undefined' ? window.innerWidth - 320 : 300,
    Math.max(16, pin.x + 24)
  );
  const topPos = Math.min(
    typeof window !== 'undefined' ? window.innerHeight - 260 : 300,
    Math.max(76, pin.y - 40)
  );

  return (
    <div
      id="balao-dialogo-astro-hover"
      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
      className="balao-dialogo-astro pointer-events-auto absolute w-72 sm:w-80 max-w-[calc(100vw-32px)] bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-slate-100 font-sans backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span style={{ color: pin.color }} className="text-base font-serif font-black">
            {pin.symbol}
          </span>
          <div>
            <h4 className="font-serif font-bold text-sm text-amber-300 leading-tight">
              {pin.name}
            </h4>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
              {pin.categoryLabel}
            </p>
          </div>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono font-bold">
          {pin.lightTimeFormatted} luz
        </span>
      </div>

      {/* Body stats */}
      <div className="space-y-1.5 text-[10px]">
        <p className="text-slate-300 leading-relaxed font-serif italic line-clamp-2">
          "{pin.data.description}"
        </p>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[8px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Compass className="w-2.5 h-2.5 text-amber-400" /> Distância
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 block">
              {(pin.data.distanceKm / 1e6).toFixed(1)} M km
            </span>
          </div>

          <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[8px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Thermometer className="w-2.5 h-2.5 text-rose-400" /> Temperatura
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-200 block truncate">
              {pin.data.surfaceTemp}
            </span>
          </div>
        </div>

        <div className="pt-1 text-[9px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800/80">
          <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">{pin.data.visibilityBrazil}</span>
        </div>

        <div className="text-[8px] text-cyan-300/80 font-mono text-center pt-0.5">
          ✦ Clique para calcular trajetória e traçar rota interplanetária
        </div>
      </div>
    </div>
  );
};
