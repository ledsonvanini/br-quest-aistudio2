import React from 'react';
import { CloudSun, Thermometer, Flame, Snowflake, Clock } from 'lucide-react';
import { ECMWF_TEMP_COLOR_STOPS, getEcmwfTempColor } from '../../services/climateService';

interface FooterWeatherTickerProps {
  avgTempBrazil: number;
  maxTempState: { stateId: string; temp: number };
  minTempState: { stateId: string; temp: number };
  formattedTimeOnly: string;
}

export const FooterWeatherTicker: React.FC<FooterWeatherTickerProps> = ({
  avgTempBrazil,
  maxTempState,
  minTempState,
  formattedTimeOnly,
}) => {
  const maxColor = getEcmwfTempColor(maxTempState.temp);
  const minColor = getEcmwfTempColor(minTempState.temp);
  const minPosPct = Math.max(0, Math.min(100, ((minTempState.temp - -4) / 44) * 100));
  const maxPosPct = Math.max(0, Math.min(100, ((maxTempState.temp - -4) / 44) * 100));

  return (
    <div
      id="painel-telemetria-clima-rodape"
      className="painel-telemetria-clima-rodape flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-xs shadow-lg animate-in fade-in duration-150 max-w-[96vw] sm:max-w-max overflow-x-auto no-scrollbar shrink-0"
    >
      {/* Ícone ECMWF */}
      <div
        className="flex items-center px-1.5 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 shrink-0"
        title="Modelo Meteorológico Global ECMWF"
      >
        <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
      </div>

      {/* Cartela Térmica com Marcadores Visuais de Mín e Máx */}
      <div
        className="relative w-20 sm:w-28 h-2.5 rounded-full overflow-visible border border-slate-700/90 flex shadow-inner shrink-0"
        title={`Escala Térmica (-4°C a 40°C) • Mín: ${minTempState.stateId} ${minTempState.temp.toFixed(1)}°C | Máx: ${maxTempState.stateId} ${maxTempState.temp.toFixed(1)}°C`}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden flex">
          {ECMWF_TEMP_COLOR_STOPS.map((stop) => (
            <div
              key={stop.temp}
              className="h-full flex-1"
              style={{ backgroundColor: stop.hex }}
            />
          ))}
        </div>

        {/* Marcador Mínima */}
        <div
          className="absolute -top-1 w-1.5 h-4.5 rounded-full border border-white shadow-md z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
          style={{ left: `${minPosPct}%`, backgroundColor: minColor.hex }}
        />

        {/* Marcador Máxima */}
        <div
          className="absolute -top-1 w-1.5 h-4.5 rounded-full border border-white shadow-md z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
          style={{ left: `${maxPosPct}%`, backgroundColor: maxColor.hex }}
        />
      </div>

      <div className="h-3.5 w-px bg-cyan-500/30 shrink-0" />

      {/* Média Brasil */}
      <div
        className="flex items-center gap-1 text-[11px] font-mono text-cyan-100 shrink-0"
        title="Temperatura Média no Território Nacional"
      >
        <Thermometer className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
        <span className="font-bold text-amber-300">{avgTempBrazil.toFixed(1)}°</span>
      </div>

      <div className="h-3.5 w-px bg-cyan-500/30 shrink-0" />

      {/* Máxima Nacional */}
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border font-mono text-[11px] font-bold shadow-sm shrink-0"
        style={{
          backgroundColor: `${maxColor.hex}22`,
          borderColor: maxColor.hex,
          color: maxColor.hex,
        }}
        title={`Máxima Nacional: ${maxTempState.stateId} (${maxTempState.temp.toFixed(1)}°C)`}
      >
        <Flame className="w-3.5 h-3.5 animate-pulse shrink-0" style={{ color: maxColor.hex }} />
        <span className="text-white bg-slate-900/80 px-1 rounded text-[10px]">{maxTempState.stateId}</span>
        <span>{maxTempState.temp.toFixed(1)}°</span>
      </div>

      {/* Mínima Nacional */}
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border font-mono text-[11px] font-bold shadow-sm shrink-0"
        style={{
          backgroundColor: `${minColor.hex}22`,
          borderColor: minColor.hex,
          color: minColor.hex,
        }}
        title={`Mínima Nacional: ${minTempState.stateId} (${minTempState.temp.toFixed(1)}°C)`}
      >
        <Snowflake className="w-3.5 h-3.5 animate-pulse shrink-0" style={{ color: minColor.hex }} />
        <span className="text-white bg-slate-900/80 px-1 rounded text-[10px]">{minTempState.stateId}</span>
        <span>{minTempState.temp.toFixed(1)}°</span>
      </div>

      <div className="h-3.5 w-px bg-cyan-500/30 shrink-0" />

      {/* Timestamp */}
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/90 border border-cyan-500/30 text-cyan-200 font-mono text-[10px] shrink-0"
        title="Horário de Brasília (UTC-3)"
      >
        <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
        <span className="font-semibold text-cyan-100">{formattedTimeOnly}</span>
      </div>
    </div>
  );
};
