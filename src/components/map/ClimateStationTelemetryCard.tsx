import React from 'react';
import { ClimateStationData, getEcmwfTempColor } from '../../services/climateService';
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Compass,
  X,
  Radio,
  LocateFixed,
  Eye,
  Activity,
} from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

interface ClimateStationTelemetryCardProps {
  station: ClimateStationData | null;
  onClose: () => void;
  onCenterMap?: () => void;
}

export const ClimateStationTelemetryCard: React.FC<ClimateStationTelemetryCardProps> = ({
  station,
  onClose,
  onCenterMap,
}) => {
  if (!station) return null;

  const tempColor = getEcmwfTempColor(station.temperature);
  const apparentTemp = Math.round(station.temperature + (station.humidity > 70 ? 2 : -1));

  return (
    <div
      id="card-telemetria-estacao-clima"
      className="card-telemetria-estacao-clima fixed bottom-16 left-4 sm:left-6 z-40 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto select-none"
    >
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-slate-900/90 to-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-black text-xs text-amber-400">
            {station.id.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-100 font-serif leading-tight">
              {station.name}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Estação Capital INMET</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onCenterMap && (
            <button
              onClick={() => {
                audioEngine.playSfx('click');
                onCenterMap();
              }}
              title="Centralizar nesta estação"
              className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition cursor-pointer"
            >
              <LocateFixed className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            title="Fechar Detalhes"
            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Temperature & Phenomenon */}
      <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Condição Atual</div>
          <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {station.phenomenon}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[9px] text-slate-400 font-mono">ECMWF / INMET</div>
            <div className="text-[10px] text-amber-200/80 font-mono">Sens: {apparentTemp}°C</div>
          </div>
          <div
            className="px-2.5 py-1 rounded-xl font-mono font-black text-base shadow-md border"
            style={{
              backgroundColor: `${tempColor.hex}25`,
              borderColor: tempColor.hex,
              color: tempColor.hex,
            }}
          >
            {station.temperature}°C
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="p-3 grid grid-cols-2 gap-2 text-xs">
        {/* Vento */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-400" />
              Vento
            </span>
            <Compass
              className="w-3 h-3 text-sky-400 transition-transform duration-700"
              style={{ transform: `rotate(${station.windDirection}deg)` }}
            />
          </div>
          <div className="font-mono font-bold text-slate-100 text-xs">
            {station.windSpeed} <span className="text-[10px] text-slate-400">km/h</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">
            Direção: {station.windDirection}°
          </div>
        </div>

        {/* Umidade */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Umidade
            </span>
            <span className="font-mono text-[10px] text-cyan-300 font-bold">{station.humidity}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, station.humidity)}%` }}
            />
          </div>
          <div className="text-[9px] text-slate-400 font-mono">
            {station.humidity > 70 ? 'Ar Úmido' : station.humidity < 30 ? 'Alerta Baixa Umid' : 'Agradável'}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Radio className="w-2.5 h-2.5 text-amber-400" />
          Telemetria Ativa
        </span>
        <span>LAT {station.lat.toFixed(2)} • LON {station.lng.toFixed(2)}</span>
      </div>
    </div>
  );
};
