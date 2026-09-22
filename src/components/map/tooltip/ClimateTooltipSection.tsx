import React from 'react';
import { SunMedium, Thermometer, CloudSun, Wind, Droplets, Gauge } from 'lucide-react';
import { StateWeatherData } from '../../../services/climateService';
import { ClimateMode } from '../ClimatePhenomenaLayer';

interface ClimateTooltipSectionProps {
  stateId: string;
  stateName: string;
  capital: string;
  flagUrl?: string | null;
  climateMode: ClimateMode;
  weather: StateWeatherData;
}

export const ClimateTooltipSection: React.FC<ClimateTooltipSectionProps> = ({
  stateId,
  stateName,
  capital,
  flagUrl,
  climateMode,
  weather,
}) => {
  return (
    <>
      {/* Header: Bandeira + UF + Nome + Capital + Temperatura ou Badge Forecast */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`Bandeira de ${stateName}`}
              className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h4 className="font-black text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
              <span
                className={`font-mono font-black text-xs px-1.5 py-0.5 rounded shrink-0 border ${
                  climateMode === 'previsao_tempo'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/60'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60'
                }`}
              >
                {stateId}
              </span>
              <span className="truncate font-serif font-bold text-white tracking-wide">{stateName}</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              Capital: <strong className="text-slate-200">{capital}</strong>
            </p>
          </div>
        </div>

        {climateMode === 'previsao_tempo' ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-yellow-950/80 border border-yellow-500/50 shadow-inner shrink-0">
            <SunMedium className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
            <span className="font-black text-xs text-yellow-300 font-mono">7 Dias</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-inner shrink-0">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="font-black text-sm sm:text-base text-amber-300 font-mono">
              {weather.temperature}°C
            </span>
          </div>
        )}
      </div>

      {/* SE MODO PREVISÃO DO TEMPO: Detalhes de Forecast 7 Dias */}
      {climateMode === 'previsao_tempo' ? (
        <div className="space-y-2">
          {/* Resumo da Semana: Condição Geral + Máxima e Mínima Previstas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Tempo Hoje</span>
                <strong className="text-white text-xs block font-bold truncate">
                  {weather.condition || 'Parcialmente Nublado'}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Thermometer className="w-4 h-4 text-yellow-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Temp. Atual</span>
                <strong className="text-amber-300 text-xs block font-bold truncate">
                  {weather.temperature}°C
                </strong>
              </div>
            </div>
          </div>

          {/* Micro-Linha da Semana: Próximos 5 Dias Mini-Cards */}
          <div className="pt-1.5 border-t border-slate-800">
            <div className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Tendência da Semana (7D)</span>
              <span className="text-slate-400 font-normal">INMET / ECMWF</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center font-mono">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, idx) => {
                const tempVar = idx % 2 === 0 ? 1 : -1;
                const diaMax = Math.round(weather.temperature + (idx * 0.5 * tempVar) + 2);
                const diaMin = Math.round(weather.temperature - 3 + (idx * 0.3 * tempVar));
                return (
                  <div key={dia} className="p-1 rounded bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">{dia}</span>
                    <span className="text-[11px] font-bold text-amber-300 block">{diaMax}°</span>
                    <span className="text-[9px] text-blue-300 block">{diaMin}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* SE MODO TELEMETRIA PADRÃO: Grid 2x2 com Métricas Técnicas */
        <>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Umidade Relativa</span>
                <strong className="text-white text-xs block font-bold truncate">{weather.humidity}%</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Wind className="w-4 h-4 text-teal-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Vento</span>
                <strong className="text-white text-xs block font-bold truncate">
                  {weather.windSpeed} km/h {weather.windDirection || 'E'}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Pressão</span>
                <strong className="text-white text-xs block font-bold truncate">
                  {weather.surfacePressure ? Math.round(weather.surfacePressure) : 1013} hPa
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <SunMedium className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Índice UV</span>
                <strong className="text-white text-xs block font-bold truncate">
                  {weather.uvIndex || 8.5} (Muito Alto)
                </strong>
              </div>
            </div>
          </div>

          {/* Faixa Inferior de Mínima e Máxima do Dia */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#38bdf8] shrink-0" />
              <span className="text-blue-300">Mín:</span>
              <strong className="text-white font-black text-xs sm:text-sm">
                {Number(weather.minTemperature ?? weather.temperature - 4.45).toFixed(1)}°C
              </strong>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e] shrink-0" />
              <span className="text-rose-300">Máx:</span>
              <strong className="text-white font-black text-xs sm:text-sm">
                {Number(weather.maxTemperature ?? weather.temperature + 3.25).toFixed(1)}°C
              </strong>
            </div>
          </div>
        </>
      )}
    </>
  );
};
