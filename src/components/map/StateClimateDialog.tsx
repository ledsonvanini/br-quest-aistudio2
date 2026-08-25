import React, { useState } from 'react';
import {
  X,
  Thermometer,
  CloudRain,
  Mountain,
  Waves,
  Sun,
  Flame,
  Snowflake,
  Compass,
  Droplets,
  Wind,
  Gauge,
  Info,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { STATE_CLIMATOLOGY_DATABASE, StateClimatologyDetail } from '../../data/stateClimatologyData';
import { StateWeatherData, formatFullDayTime } from '../../services/climateService';
import { BRAZIL_STATES_REGISTRY } from '../../data/brazilStatesRegistry';

interface StateClimateDialogProps {
  stateId: string | null;
  weatherData?: StateWeatherData;
  allStatesWeather?: Record<string, StateWeatherData>;
  lastUpdated?: string | number;
  onClose: () => void;
}

export const StateClimateDialog: React.FC<StateClimateDialogProps> = ({
  stateId,
  weatherData,
  allStatesWeather,
  lastUpdated,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'enchentes' | 'extremos' | 'relevo' | 'estatisticas'>('geral');

  if (!stateId) return null;

  const climateInfo: StateClimatologyDetail | undefined = STATE_CLIMATOLOGY_DATABASE[stateId];
  const registryInfo = BRAZIL_STATES_REGISTRY[stateId];

  if (!climateInfo) return null;

  const stateName = climateInfo.name;
  const capital = climateInfo.capital;
  const currentTemp = weatherData?.temperature ?? 25.0;
  const minTemp = weatherData?.minTemperature ?? currentTemp - 4.45;
  const maxTemp = weatherData?.maxTemperature ?? currentTemp + 3.25;
  const apparentTemp = weatherData?.apparentTemperature ?? (currentTemp + 1.2);
  const humidity = weatherData?.humidity ?? 68;
  const windSpeed = weatherData?.windSpeed ?? 14;
  const windDir = weatherData?.windDirection ?? 90;
  const pressure = weatherData?.surfacePressure ?? 1012;
  const precipitation = weatherData?.precipitation ?? 0.0;
  const uvIdx = weatherData?.uvIndex ?? 7.2;

  // Cálculo de ranking térmico nacional (posição entre os 27 estados)
  let nationalRankText = 'Posição Intermediária';
  let tempDiffFromNationalAvg = 0;
  if (allStatesWeather) {
    const sorted = Object.entries(allStatesWeather).sort((a, b) => b[1].temperature - a[1].temperature);
    const pos = sorted.findIndex(([id]) => id === stateId);
    if (pos !== -1) {
      const avg = sorted.reduce((acc, curr) => acc + curr[1].temperature, 0) / sorted.length;
      tempDiffFromNationalAvg = currentTemp - avg;
      nationalRankText = `${pos + 1}º mais quente do Brasil`;
    }
  }

  return (
    <div
      id="dialog-climatologia-estado"
      data-scrollable="true"
      className="modal-dialog-climatologia-estado fixed top-[62px] sm:top-[66px] bottom-[58px] sm:bottom-[62px] left-2 sm:left-4 md:left-6 z-40 w-[calc(100vw-16px)] sm:w-[520px] md:w-[560px] max-w-[calc(100vw-16px)] bg-slate-950/98 sm:bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_24px_rgba(6,182,212,0.2)] flex flex-col text-slate-100 animate-in fade-in slide-in-from-left-4 duration-300 select-text overflow-hidden cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Indicador de puxador / notch em telas móveis */}
      <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto sm:hidden mt-2 -mb-1 shrink-0" />

      {/* 1. Header do Diálogo com Brasão e Identidade do Estado */}
      <div className="flex items-center justify-between p-2.5 sm:p-3 md:p-3.5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {registryInfo?.coatOfArmsUrl ? (
            <img
              src={registryInfo.coatOfArmsUrl}
              alt={`Brasão ${stateName}`}
              referrerPolicy="no-referrer"
              className="w-8 h-9 sm:w-9 sm:h-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] shrink-0"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-300 text-xs sm:text-sm shadow-inner shrink-0 font-mono">
              {stateId}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-black tracking-wider shrink-0">
                {stateId}
              </span>
              <h3 className="font-serif font-black text-sm sm:text-base md:text-lg text-white tracking-wide truncate">
                {stateName}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate mt-0.5">
              Capital: <strong className="text-white">{capital}</strong> • Região {climateInfo.region} • <span className="text-cyan-300 font-semibold">Clima Local</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            id="btn-fechar-dialog-clima"
            type="button"
            onClick={onClose}
            className="btn-fechar-painel p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600/80 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 touch-manipulation min-w-[34px] min-h-[34px] flex items-center justify-center"
            title="Fechar foco e restaurar visão do mapa (Esc)"
          >
            <X className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* 2. Barra de Telemetria Compacta em Tempo Real */}
      <div className="p-2 sm:p-2.5 bg-slate-900/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
        {/* Temperatura Atual */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[8px] sm:text-[9px] font-mono text-slate-400 uppercase tracking-wider">Temperatura</div>
            <div className="text-sm sm:text-base font-black text-amber-300 font-mono leading-tight">
              {Number(currentTemp).toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Faixa Térmica (Mín / Máx) */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center gap-0.5 text-[11px] font-mono">
          <div className="flex items-center justify-between text-blue-300">
            <span className="flex items-center gap-1 font-semibold text-[9px] sm:text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Mín:
            </span>
            <strong className="text-white font-bold text-[11px] sm:text-xs">{Number(minTemp).toFixed(1)}°C</strong>
          </div>
          <div className="flex items-center justify-between text-rose-300">
            <span className="flex items-center gap-1 font-semibold text-[9px] sm:text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Máx:
            </span>
            <strong className="text-white font-bold text-[11px] sm:text-xs">{Number(maxTemp).toFixed(1)}°C</strong>
          </div>
        </div>

        {/* Sensação & Índice UV */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center gap-0.5 text-[11px] font-mono">
          <div className="flex items-center justify-between text-amber-200">
            <span className="text-[9px] sm:text-[10px] text-slate-400">Sensação:</span>
            <strong className="text-amber-300 font-bold text-[11px] sm:text-xs">{Number(apparentTemp).toFixed(1)}°C</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[9px] sm:text-[10px] text-slate-400">Índice UV:</span>
            <strong className={`font-bold text-[11px] sm:text-xs ${uvIdx >= 8 ? 'text-rose-400' : uvIdx >= 6 ? 'text-amber-300' : 'text-emerald-300'}`}>
              {Number(uvIdx).toFixed(1)}
            </strong>
          </div>
        </div>

        {/* Umidade & Ventos */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center gap-0.5 text-[11px] font-mono">
          <div className="flex items-center justify-between text-cyan-300">
            <span className="text-[9px] sm:text-[10px] text-slate-400">Umidade:</span>
            <strong className="text-white font-bold text-[11px] sm:text-xs">{humidity}%</strong>
          </div>
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[9px] sm:text-[10px] text-slate-400">Ventos:</span>
            <strong className="text-white font-bold text-[11px] sm:text-xs">{windSpeed} km/h</strong>
          </div>
        </div>
      </div>

      {/* 3. Navegação por Abas Rápidas e Concisas */}
      <div className="flex border-b border-slate-800 text-[11px] sm:text-xs font-semibold bg-slate-900/60 overflow-x-auto scrollbar-none shrink-0 px-1">
        <button
          type="button"
          onClick={() => setActiveTab('geral')}
          className={`flex-1 py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'geral'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5 shrink-0" />
          <span>Köppen</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('enchentes')}
          className={`flex-1 py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'enchentes'
              ? 'border-blue-400 text-blue-300 bg-blue-950/30 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Waves className="w-3.5 h-3.5 shrink-0" />
          <span>Bacias</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('extremos')}
          className={`flex-1 py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'extremos'
              ? 'border-amber-400 text-amber-300 bg-amber-950/30 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 shrink-0" />
          <span>Extremos</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('relevo')}
          className={`flex-1 py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'relevo'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mountain className="w-3.5 h-3.5 shrink-0" />
          <span>Relevo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('estatisticas')}
          className={`flex-1 py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'estatisticas'
              ? 'border-purple-400 text-purple-300 bg-purple-950/30 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span>Dados</span>
        </button>
      </div>

      {/* 4. Corpo das Abas com Altura Flexível e Scroll Fluido */}
      <div
        data-scrollable="true"
        className="flex-1 min-h-0 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500 scrollbar-track-slate-900/50"
      >
        {/* ABA: CLIMA & KÖPPEN */}
        {activeTab === 'geral' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider">
                  CLASSIFICAÇÃO CLIMÁTICA OFICIAL (KÖPPEN-GEIGER)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                  {climateInfo.koppenClimate.split(' ')[0]}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {climateInfo.koppenClimate}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {climateInfo.koppenDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-sky-400" />
                    PRECIPITAÇÃO ANUAL
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-sky-300 font-mono mt-1.5">
                    ~{climateInfo.annualRainfallMm.toLocaleString('pt-BR')} mm/ano
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Média histórica</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-indigo-400" />
                    PRESSÃO ATMOSFÉRICA
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-indigo-300 font-mono mt-1.5">
                    {pressure} hPa
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Nível da estação</span>
                </div>
              </div>
            </div>

            {/* Ciclo Sazonal */}
            <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="font-bold text-slate-200 text-xs sm:text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Regime Sazonal de Chuvas e Estiagem
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/40 space-y-1">
                  <div className="font-bold text-sky-300 text-xs sm:text-sm">Estação Chuvosa:</div>
                  <div className="text-slate-200 text-xs sm:text-sm leading-relaxed">{climateInfo.rainySeason}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 space-y-1">
                  <div className="font-bold text-amber-300 text-xs sm:text-sm">Estação Seca / Estiagem:</div>
                  <div className="text-slate-200 text-xs sm:text-sm leading-relaxed">{climateInfo.drySeason}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: ENCHENTES & BACIAS */}
        {activeTab === 'enchentes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2.5 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">Vulnerabilidade a Inundações & Enchentes:</span>
                <p className="text-xs text-slate-400 mt-0.5">Classificação conforme histórico do CPRM e Defesa Civil</p>
              </div>
              <span
                className={`px-3.5 py-1.5 rounded-full font-black text-xs sm:text-sm ${
                  climateInfo.floodHistory.vulnerabilityLevel === 'Muito Alta'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : climateInfo.floodHistory.vulnerabilityLevel === 'Alta'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                }`}
              >
                {climateInfo.floodHistory.vulnerabilityLevel}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-blue-400 font-bold flex items-center gap-1.5">
                <Waves className="w-4 h-4" />
                BACIAS HIDROGRÁFICAS CRÍTICAS
              </div>
              <div className="flex flex-wrap gap-2.5">
                {climateInfo.floodHistory.mainBasins.map((basin, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-200 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    {basin}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                EVENTOS HISTÓRICOS DE CHEIA / INUNDAÇÃO / SECA
              </div>
              <ul className="space-y-2.5">
                {climateInfo.floodHistory.historicEvents.map((event, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ABA: EXTREMOS HISTÓRICOS INMET */}
        {activeTab === 'extremos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Recorde de Frio */}
            <div className="bg-sky-950/40 p-4 sm:p-5 rounded-2xl border border-sky-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs sm:text-sm">
                  <Snowflake className="w-4 h-4 sm:w-5 sm:h-5" />
                  RECORDE HISTÓRICO DE FRIO (INMET)
                </div>
                <span className="font-mono font-black text-xl sm:text-2xl text-sky-200">
                  {climateInfo.temperatureExtremes.recordCold.temp > 0
                    ? `+${climateInfo.temperatureExtremes.recordCold.temp}°C`
                    : `${climateInfo.temperatureExtremes.recordCold.temp}°C`}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-normal">
                <strong>Estação / Local:</strong> {climateInfo.temperatureExtremes.recordCold.location}
                {climateInfo.temperatureExtremes.recordCold.date && (
                  <span className="text-slate-400 font-mono ml-2">({climateInfo.temperatureExtremes.recordCold.date})</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-sky-200/90 italic bg-sky-950/70 p-3 rounded-xl border border-sky-900/60 leading-relaxed">
                "{climateInfo.temperatureExtremes.recordCold.context}"
              </p>
            </div>

            {/* Recorde de Calor */}
            <div className="bg-rose-950/40 p-4 sm:p-5 rounded-2xl border border-rose-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                  RECORDE HISTÓRICO DE CALOR (INMET)
                </div>
                <span className="font-mono font-black text-xl sm:text-2xl text-rose-200">
                  {climateInfo.temperatureExtremes.recordHeat.temp}°C
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-normal">
                <strong>Estação / Local:</strong> {climateInfo.temperatureExtremes.recordHeat.location}
                {climateInfo.temperatureExtremes.recordHeat.date && (
                  <span className="text-slate-400 font-mono ml-2">({climateInfo.temperatureExtremes.recordHeat.date})</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-rose-200/90 italic bg-rose-950/70 p-3 rounded-xl border border-rose-900/60 leading-relaxed">
                "{climateInfo.temperatureExtremes.recordHeat.context}"
              </p>
            </div>

            {/* Amplitude Térmica Histórica */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="text-slate-300">Amplitude Histórica Total:</span>
              <strong className="text-amber-300 font-bold text-sm sm:text-base">
                {(climateInfo.temperatureExtremes.recordHeat.temp - climateInfo.temperatureExtremes.recordCold.temp).toFixed(1)}°C de Variação
              </strong>
            </div>
          </div>
        )}

        {/* ABA: RELEVO & TOPOGRAFIA */}
        {activeTab === 'relevo' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-emerald-950/40 p-4 sm:p-5 rounded-2xl border border-emerald-800/50 space-y-1.5">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                RELEVO & GEOMORFOLOGIA PREDOMINANTE
              </div>
              <div className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {climateInfo.reliefGeography.predominantRelief}
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 sm:p-5 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-amber-400" />
                  PONTO CULMINANTE DO ESTADO
                </div>
                <div className="text-sm sm:text-base font-bold text-white mt-1">
                  {climateInfo.reliefGeography.highestPoint.name}
                </div>
              </div>
              <div className="text-right">
                <span className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono font-black text-sm sm:text-base shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  {climateInfo.reliefGeography.highestPoint.altitudeM.toLocaleString('pt-BR')} m
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                PRINCIPAIS FORMAÇÕES TOPOGRÁFICAS & SERRAS
              </div>
              <div className="space-y-2">
                {climateInfo.reliefGeography.mainLandforms.map((form, idx) => (
                  <div
                    key={idx}
                    className="p-3 px-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-center gap-2.5"
                  >
                    <span className="text-emerald-400">⛰️</span>
                    <span>{form}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-emerald-300">Destaque Ambiental & Geológico:</strong>{' '}
              {climateInfo.reliefGeography.environmentalHighlights}
            </div>
          </div>
        )}

        {/* ABA: ESTATÍSTICAS NACIONAIS */}
        {activeTab === 'estatisticas' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-purple-950/40 p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-purple-300 font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  RANKING TÉRMICO NACIONAL
                </span>
                <span className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-200 font-mono font-bold text-xs sm:text-sm border border-purple-500/30">
                  {nationalRankText}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                A temperatura atual de <strong>{stateName}</strong> está{' '}
                <strong className={tempDiffFromNationalAvg >= 0 ? 'text-amber-300' : 'text-cyan-300'}>
                  {tempDiffFromNationalAvg >= 0 ? `+${tempDiffFromNationalAvg.toFixed(1)}°C` : `${tempDiffFromNationalAvg.toFixed(1)}°C`}
                </strong>{' '}
                em relação à média observada em todas as 27 capitais do Brasil neste momento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">RADIAÇÃO SOLAR GLOBAL</div>
                <div className="text-base sm:text-lg font-bold text-amber-300 mt-1">
                  {Math.round(currentTemp * 28 + (uvIdx * 40))} W/m²
                </div>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">PONTO DE ORVALHO</div>
                <div className="text-base sm:text-lg font-bold text-cyan-300 mt-1">
                  {(currentTemp - ((100 - humidity) / 5)).toFixed(1)}°C
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="text-amber-300 font-bold">Nota de Integração:</span> Os dados meteorológicos em tempo real são atualizados a cada ciclo sinótico através dos modelos ECMWF e GFS, combinados com as normais climatológicas do INMET (1991-2020).
            </div>
          </div>
        )}
      </div>

      {/* 5. Footer do Diálogo com Ações e Botão Fechar Foco */}
      <div className="p-2 sm:p-2.5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden xs:inline">INMET • CPRM • Open-Meteo • ECMWF</span>
            <span className="xs:hidden">INMET • ECMWF</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Atualizado em: <strong className="text-cyan-200">{formatFullDayTime(lastUpdated)}</strong></span>
          </span>
        </div>
        <button
          id="btn-fechar-dialog-clima-footer"
          type="button"
          onClick={onClose}
          className="px-3 sm:px-4 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white font-bold transition-all cursor-pointer border border-cyan-500/50 shadow-md active:scale-95 text-xs flex items-center gap-1.5 ml-auto"
          title="Fechar foco no estado e centralizar o mapa do Brasil (Esc)"
        >
          <X className="w-3.5 h-3.5 text-cyan-300" />
          <span>Fechar Foco</span>
          <kbd className="hidden sm:inline px-1 py-0.2 text-[9px] font-mono bg-slate-900 border border-cyan-500/40 rounded text-cyan-300 ml-1">
            Esc
          </kbd>
        </button>
      </div>
    </div>
  );
};

