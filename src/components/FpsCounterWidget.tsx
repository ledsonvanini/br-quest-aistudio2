import React, { useState, useEffect } from 'react';
import { perfEngine, FpsTelemetry } from '../lib/performanceEngine';
import { Zap, Activity, Gauge, Eye, EyeOff } from 'lucide-react';

interface FpsCounterWidgetProps {
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const FpsCounterWidget: React.FC<FpsCounterWidgetProps> = ({
  isVisible = false,
  onToggleVisibility,
}) => {
  const [telemetry, setTelemetry] = useState<FpsTelemetry>({
    fps: 60,
    frametimeMs: 16.6,
    quality: 'optimal',
    activeParticles: 0,
  });

  useEffect(() => {
    const unsubscribe = perfEngine.subscribe((data) => {
      setTelemetry(data);
    });
    return unsubscribe;
  }, []);

  if (!isVisible) return null;

  const getStatusColor = (quality: FpsTelemetry['quality']) => {
    switch (quality) {
      case 'optimal':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/80';
      case 'good':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/80';
      case 'low':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/80';
    }
  };

  const getBadgeColor = (quality: FpsTelemetry['quality']) => {
    switch (quality) {
      case 'optimal':
        return 'bg-emerald-500 text-slate-950';
      case 'good':
        return 'bg-amber-500 text-slate-950';
      case 'low':
        return 'bg-rose-500 text-white';
    }
  };

  return (
    <div
      id="widget-fps-contador"
      className="widget-fps-contador fixed bottom-16 sm:bottom-20 left-4 z-40 pointer-events-auto select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/90 font-mono text-xs ${getStatusColor(
          telemetry.quality
        )}`}
      >
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-black text-sm">{telemetry.fps}</span>
          <span className="text-[10px] text-slate-400 font-sans">FPS</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700/60" />

        <div className="text-[11px] text-slate-300">
          <span className="font-bold">{telemetry.frametimeMs}</span>
          <span className="text-[9px] text-slate-400 font-sans ml-0.5">ms</span>
        </div>

        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-sans uppercase ${getBadgeColor(telemetry.quality)}`}>
          {telemetry.quality === 'optimal' ? '60Hz Fluido' : telemetry.quality === 'good' ? 'Estável' : 'Otimizando'}
        </span>

        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer ml-1"
            title="Ocultar Contador de FPS"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
