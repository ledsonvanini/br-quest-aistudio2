import React from 'react';
import { ClimateMode } from './ClimatePhenomenaLayer';
import { StateWeatherData, getEcmwfTempColor } from '../../services/climateService';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import { AppMainMode, BiodiversityKingdom } from '../../types';
import { CartographyLayerMode } from '../../types/cartography';
import { TerritoryStateHoverTooltip } from './territory/TerritoryStateHoverTooltip';
import { BRAZIL_STATES_GEOPOLITICS } from '../../data/geopoliticaData';
import { STATE_BIODIVERSITY_PROFILES } from '../../data/brazilBiodiversityData';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { ALL_BRAZIL_STATES, getStateCoatOfArmsUrl, getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { getStateMusicalHeritage } from '../../data/musicalHeritageData';
import { getStateHighlightsForEra, VINTAGE_RADIO_ERAS } from '../../data/vintageRadioEras';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Gauge,
  SunMedium,
  CloudSun,
  Sun,
  CloudLightning,
  CalendarClock,
  Users,
  TrendingUp,
  Building2,
  HeartPulse,
  TreePine,
  ShieldAlert,
  Bird,
  Flower2,
  Sparkles,
  Shield,
  CheckCircle2,
  ChevronRight,
  Zap,
  Radio,
  Disc,
  Music,
  Volume2,
  Utensils,
  Swords,
  Award,
  Compass,
} from 'lucide-react';

interface UnifiedStateHoverTooltipProps {
  hoveredStateId: string | null;
  centroids: Record<string, [number, number]>;
  mainMode: AppMainMode;
  isClimateActive: boolean;
  climateMode: ClimateMode;
  stateWeather: Record<string, StateWeatherData>;
  geopoliticaMetric: GeopoliticaMetricKey;
  biodiversityKingdom: BiodiversityKingdom | 'all';
  pan: { x: number; y: number };
  zoom: number;
  rotateX?: number;
  selectedStateId?: string | null;
  showNeighbors?: boolean;
  selectedRadioEraId?: string;
  mousePos?: { x: number; y: number };
  activeCartographyLayer?: CartographyLayerMode;
}

export const UnifiedStateHoverTooltip: React.FC<UnifiedStateHoverTooltipProps> = ({
  hoveredStateId,
  centroids,
  mainMode,
  isClimateActive,
  climateMode,
  stateWeather,
  geopoliticaMetric,
  biodiversityKingdom,
  pan,
  zoom,
  rotateX = 42,
  selectedStateId,
  showNeighbors,
  selectedRadioEraId = 'catedral_1930_1940',
  mousePos,
  activeCartographyLayer,
}) => {
  const isTerritoryActive = Boolean(activeCartographyLayer && activeCartographyLayer !== 'none');

  // Balão flutuante unificado exibido ao posicionar o mouse sobre qualquer estado
  const shouldHide =
    !hoveredStateId ||
    showNeighbors ||
    Boolean(selectedStateId) ||
    mainMode === 'globo3d';

  if (shouldHide || !hoveredStateId) return null;

  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 340;
  const cardHeight = 280;

  let screenPos: { x: number; y: number; isNearTop: boolean } | null = null;

  // 1. Se temos posição de mouse em tempo real
  if (mousePos && mousePos.x > 0 && mousePos.y > 0) {
    let x = mousePos.x + 20;
    if (typeof window !== 'undefined' && x + cardWidth > window.innerWidth - 16) {
      x = Math.max(16, mousePos.x - cardWidth - 20);
    }
    let y = mousePos.y - 70;
    if (typeof window !== 'undefined') {
      y = Math.max(64, Math.min(y, window.innerHeight - cardHeight - 20));
    }
    screenPos = { x, y, isNearTop: y < 130 };
  } else if (hoveredStateId && centroids[hoveredStateId] && typeof window !== 'undefined') {
    // 2. Fallback por projeção do centróide do estado
    const centroid = centroids[hoveredStateId];
    const [cx, cy] = centroid;
    const dx = cx - 1280;
    const dy = cy - 720;
    const rad = (rotateX * Math.PI) / 180;
    const cosX = Math.cos(rad);
    const projX = window.innerWidth / 2 + (dx * zoom + pan.x);
    const projY = window.innerHeight / 2 + (dy * cosX * zoom + pan.y);

    let x = projX + 24;
    if (x + cardWidth > window.innerWidth - 16) {
      x = Math.max(16, projX - cardWidth - 24);
    }
    let y = projY - 70;
    y = Math.max(64, Math.min(y, window.innerHeight - cardHeight - 20));
    screenPos = { x, y, isNearTop: y < 130 };
  }

  if (!screenPos) return null;

  const stateId = hoveredStateId;
  const weather = stateWeather[stateId];
  const geoProfile = BRAZIL_STATES_GEOPOLITICS[stateId];
  const bioProfile = STATE_BIODIVERSITY_PROFILES[stateId];
  const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
  const registryInfo = ALL_BRAZIL_STATES.find((s) => s.id === stateId);
  const stateName = registryInfo?.name || geoProfile?.stateName || stateId;
  const capital = registryInfo?.capital || geoProfile?.capital || weather?.capital || 'Capital';
  const coatOfArmsUrl = getStateCoatOfArmsUrl(stateId) || registryInfo?.coatOfArmsUrl;
  const flagUrl = getStateFlagUrl(stateId) || registryInfo?.flagUrl;
  const musicalHeritage = getStateMusicalHeritage(stateId);
  const radioEra = VINTAGE_RADIO_ERAS.find((e) => e.id === selectedRadioEraId) || VINTAGE_RADIO_ERAS[0];
  const eraHighlights = getStateHighlightsForEra(stateId, selectedRadioEraId);

  return (
    <aside
      id="balao-universal-estado-hover"
      role="tooltip"
      aria-live="polite"
      className="balao-universal-estado-hover fixed max-h-[calc(100vh-120px)] w-[300px] sm:w-[340px] pointer-events-none select-none z-[99999] transition-all duration-150 ease-out overflow-y-auto custom-scrollbar-gold animate-fadeIn"
      style={{
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
        opacity: 1,
        isolation: 'isolate',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div
        className={`card-balao-conteudo-unificado rounded-2xl p-3.5 sm:p-4 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-xl border-2 text-white space-y-2.5 overflow-hidden break-words ${
          isTerritoryActive
            ? activeCartographyLayer === 'bacias_hidrograficas'
              ? 'bg-slate-950/95 border-cyan-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(6,182,212,0.4)]'
              : activeCartographyLayer === 'biomas_relevo'
              ? 'bg-slate-950/95 border-emerald-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(16,185,129,0.4)]'
              : 'bg-slate-950/95 border-amber-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(245,158,11,0.4)]'
            : isClimateActive
            ? climateMode === 'previsao_tempo'
              ? 'bg-slate-950/95 border-yellow-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(250,204,21,0.4)]'
              : 'bg-slate-950/95 border-cyan-400'
            : mainMode === 'biodiversidade'
            ? 'bg-slate-950/95 border-emerald-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(16,185,129,0.4)]'
            : mainMode === 'geopolitica'
            ? 'bg-slate-950/95 border-cyan-400'
            : 'bg-slate-950/95 border-amber-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(245,158,11,0.4)]'
        }`}
      >
        {/* ========================================================================= */}
        {/* MODO 0: CAMADAS CARTOGRÁFICAS DE TERRITÓRIO (ISOLAMENTO ESTRITO)          */}
        {/* ========================================================================= */}
        {isTerritoryActive && (
          <TerritoryStateHoverTooltip
            stateId={stateId}
            activeLayer={activeCartographyLayer!}
          />
        )}

        {/* ========================================================================= */}
        {/* MODO 1: CLIMA E TELEMETRIA (Com suporte especial a Previsão do Tempo 7D)  */}
        {/* ========================================================================= */}
        {!isTerritoryActive && isClimateActive && weather && (
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
                      <span className="text-[10px] text-slate-400 block">Condição</span>
                      <strong className="text-white text-xs truncate block font-bold">
                        {weather.forecast?.[0]?.condition || weather.condition || 'Ensolarado'}
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block">Prob. Chuva</span>
                      <strong className="text-white text-xs block font-bold font-mono">
                        {weather.forecast?.[0]?.rainProb ?? 25}% ({weather.forecast?.[0]?.rainSum ?? 0.0} mm)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Grade dos Próximos 7 Dias de Previsão */}
                {weather.forecast && weather.forecast.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-800/80">
                    <div className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        Prognóstico Semanal (ECMWF)
                      </span>
                      <span className="text-[9px] text-slate-400 font-normal">Máx / Mín</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {weather.forecast.slice(0, 7).map((fDay) => {
                        return (
                          <div
                            key={fDay.dayIndex}
                            className="p-1 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-between min-w-0"
                          >
                            <span className="text-[9px] font-bold text-slate-300 truncate w-full block">
                              {fDay.dayName}
                            </span>
                            <div className="my-0.5 text-xs">
                              {fDay.rainProb > 50 ? (
                                <CloudRain className="w-3 h-3 text-cyan-400 mx-auto" />
                              ) : fDay.maxTemp > 30 ? (
                                <Sun className="w-3 h-3 text-amber-400 mx-auto" />
                              ) : (
                                <CloudSun className="w-3 h-3 text-yellow-300 mx-auto" />
                              )}
                            </div>
                            <div className="text-[9px] font-mono leading-tight">
                              <span className="text-rose-400 font-bold block">{Math.round(fDay.maxTemp)}°</span>
                              <span className="text-sky-300 text-[8px] block">{Math.round(fDay.minTemp)}°</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SE MODO CLIMA CONVENCIONAL: Telemetria Completa em Tempo Real */
              <>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      Umid: <strong className="text-white font-bold">{weather.humidity}%</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">
                      Chuva: <strong className="text-white font-bold">{weather.precipitation} mm</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                    <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      Vento: <strong className="text-white font-bold">{weather.windSpeed} km/h</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">
                      Pressão: <strong className="text-white font-bold">{weather.surfacePressure} hPa</strong>
                    </span>
                  </div>
                </div>

                {/* Temperaturas Mínima e Máxima com destaque */}
                <div className="pt-1.5 border-t border-slate-800/90 grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
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
        )}

        {/* ========================================================================= */}
        {/* MODO 2: BIODIVERSIDADE (Espécies, Biomas, Reinos)                          */}
        {/* ========================================================================= */}
        {!isTerritoryActive && !isClimateActive && mainMode === 'biodiversidade' && bioProfile && (
          <>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
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
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-mono font-black text-xs shrink-0">
                      {stateId}
                    </span>
                    <span className="truncate font-serif font-bold text-white tracking-wide">{bioProfile.stateName}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    Capital: <strong className="text-slate-200">{capital}</strong> • Região {bioProfile.region}
                  </p>
                </div>
              </div>

              <div className="px-2 py-0.5 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
                {bioProfile.predominantBiomes?.[0] || 'Bioma'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Bird className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Espécies</span>
                  <strong className="text-white text-xs block font-bold truncate">
                    {bioProfile.totalKnownSpeciesEst?.toLocaleString('pt-BR') || '1.200+'}
                  </strong>
                </div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Ameaçadas</span>
                  <strong className="text-rose-300 text-xs block font-bold truncate">
                    {bioProfile.threatenedSpeciesCount || 0} espécies
                  </strong>
                </div>
              </div>
            </div>

            {bioProfile.specimens && bioProfile.specimens.length > 0 && (
              <div className="pt-1.5 border-t border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                  Espécies Símbolo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {bioProfile.specimens.slice(0, 2).map((sp, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-200 text-[11px] font-medium truncate max-w-full"
                    >
                      {sp.namePt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* MODO 3: GEOPOLÍTICA & DEMOGRAFIA (IBGE Censo 2022)                         */}
        {/* ========================================================================= */}
        {!isTerritoryActive && !isClimateActive && mainMode === 'geopolitica' && geoProfile && (
          <>
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
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-black border border-cyan-400/50">
                      {stateId}
                    </span>
                    <span className="truncate font-serif font-bold text-amber-200 tracking-wide">{geoProfile.stateName}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    Capital: <strong className="text-slate-200">{geoProfile.capital}</strong> • {geoProfile.regionName}
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-mono font-bold shrink-0">
                Censo 2022
              </span>
            </div>

            {/* Métrica Dinâmica Ativa */}
            {geopoliticaMetric === 'miscigenacao' && geoProfile.etnia && (
              <div className="space-y-1.5 text-xs">
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Composição Étnica (IBGE)
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800">
                  <div style={{ width: `${geoProfile.etnia.pardoPercent}%` }} className="bg-amber-600 h-full" title={`Pardos: ${geoProfile.etnia.pardoPercent}%`} />
                  <div style={{ width: `${geoProfile.etnia.brancoPercent}%` }} className="bg-slate-200 h-full" title={`Brancos: ${geoProfile.etnia.brancoPercent}%`} />
                  <div style={{ width: `${geoProfile.etnia.pretoPercent}%` }} className="bg-amber-950 h-full" title={`Pretos: ${geoProfile.etnia.pretoPercent}%`} />
                  <div style={{ width: `${geoProfile.etnia.indigenaPercent}%` }} className="bg-emerald-600 h-full" title={`Indígenas: ${geoProfile.etnia.indigenaPercent}%`} />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10.5px] text-slate-300">
                  <span>Pardos: <strong className="text-white">{geoProfile.etnia.pardoPercent}%</strong></span>
                  <span>Brancos: <strong className="text-white">{geoProfile.etnia.brancoPercent}%</strong></span>
                  <span>Pretos: <strong className="text-white">{geoProfile.etnia.pretoPercent}%</strong></span>
                  <span>Indígenas: <strong className="text-white">{geoProfile.etnia.indigenaPercent}%</strong></span>
                </div>
              </div>
            )}

            {geopoliticaMetric === 'genero' && geoProfile.genero && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mulheres</span>
                  <strong className="text-rose-400 text-xs sm:text-sm block font-mono font-bold">
                    {geoProfile.genero.mulheresPercent}%
                  </strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{geoProfile.genero.mulheresTotal.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Homens</span>
                  <strong className="text-sky-400 text-xs sm:text-sm block font-mono font-bold">
                    {geoProfile.genero.homensPercent}%
                  </strong>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{geoProfile.genero.homensTotal.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            )}

            {geopoliticaMetric !== 'miscigenacao' && geopoliticaMetric !== 'genero' && geoProfile.demografia && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">População</span>
                  <strong className="text-white text-xs sm:text-sm block font-mono font-bold">
                    {geoProfile.demografia.populacaoTotal.toLocaleString('pt-BR')}
                  </strong>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Densidade</span>
                  <strong className="text-cyan-300 text-xs sm:text-sm block font-mono font-bold">
                    {geoProfile.demografia.densidadeHabKm2.toFixed(1)} hab/km²
                  </strong>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* MODO 4: MODO MUSICALIDADES (Balão Único Consolidado de Rádio e Cultura)    */}
        {/* ========================================================================= */}
        {mainMode === 'musicalidades' && (
          <div className="balao-hover-musicalidades space-y-2">
            {/* Header com Bandeira, Brasão, Estado e Frequência do Dial */}
            <div className="header-hover-musical flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`Bandeira de ${stateName}`}
                    className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                {coatOfArmsUrl && (
                  <img
                    src={coatOfArmsUrl}
                    alt={stateName}
                    className="w-6 h-6 object-contain drop-shadow shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0">
                  <h4 className="font-black text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-400/50">
                      {stateId}
                    </span>
                    <span className="truncate font-serif font-bold text-amber-100">{stateName}</span>
                  </h4>
                  <p className="text-[11px] text-amber-300/70 font-medium truncate mt-0.5">Capital: {capital}</p>
                </div>
              </div>

              <div className="badge-frequencia-dial px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{musicalHeritage?.frequencyDialKHz ? `${musicalHeritage.frequencyDialKHz} kHz` : '840 kHz'}</span>
              </div>
            </div>

            {/* Destaque da Era Musical e Emissora */}
            <div className="card-hover-musical-conteudo p-2 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold font-serif min-w-0">
                  <Disc className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
                  <span className="truncate">{eraHighlights?.movementName || 'Patrimônio Musical'}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300/90 border border-amber-700/40 shrink-0">
                  {radioEra.decade || radioEra.shortName}
                </span>
              </div>

              {eraHighlights?.keyArtists && (
                <div className="text-[10.5px] text-slate-300 line-clamp-2 leading-relaxed">
                  <span className="text-amber-300/80 font-semibold">Expoentes: </span>
                  {eraHighlights.keyArtists}
                </div>
              )}

              {musicalHeritage?.famousBroadcastingStation && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono truncate pt-1 border-t border-slate-800">
                  <Radio className="w-3 h-3 text-amber-400/80 shrink-0" />
                  <span className="truncate">{musicalHeritage.famousBroadcastingStation}</span>
                </div>
              )}
            </div>

            {/* Dica de Ação / Rodapé */}
            <div className="rodape-acao-musical pt-0.5 flex items-center justify-between text-[10.5px] text-amber-300/90 font-medium">
              <span className="flex items-center gap-1.5 truncate">
                <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">Clique para sintonizar a rádio e isolar</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODO 5: AVENTURA / CARTOGRAFIA / BRQUEST                                  */}
        {/* ========================================================================= */}
        {!isTerritoryActive && !isClimateActive && mainMode !== 'biodiversidade' && mainMode !== 'geopolitica' && mainMode !== 'musicalidades' && guardian && (
          <div className="balao-hover-aventura space-y-2">
            {/* Header: Bandeira + Brasão + UF + Nome + Capital + Badge Região */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`Bandeira de ${stateName}`}
                    className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                {coatOfArmsUrl && (
                  <img
                    src={coatOfArmsUrl}
                    alt={stateName}
                    className="w-6 h-6 object-contain drop-shadow shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0">
                  <h4 className="font-black text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-400/50">
                      {stateId}
                    </span>
                    <span className="truncate font-serif font-bold text-amber-100">{stateName}</span>
                  </h4>
                  <p className="text-[11px] text-amber-300/70 font-medium truncate mt-0.5">
                    Capital: <strong className="text-slate-200">{capital}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold shrink-0 shadow-sm">
                <Compass className="w-3 h-3 text-amber-400" />
                <span className="capitalize">{guardian.regionId}</span>
              </div>
            </div>

            {/* Resumo da Cultura & Culinária (Grade de 2 Colunas no Estilo Clima) */}
            <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
              <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[9.5px] text-amber-300/80 font-bold block uppercase tracking-wider">Cultura</span>
                  <p className="text-[11px] text-slate-200 font-medium truncate leading-tight">
                    {guardian.musicAndCulturePt || 'Tradições e Folclore'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 min-w-0">
                <Utensils className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[9.5px] text-orange-300/80 font-bold block uppercase tracking-wider">Gastronomia</span>
                  <p className="text-[11px] text-slate-200 font-medium truncate leading-tight">
                    {guardian.typicalDishPt || 'Pratos Típicos Regionais'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card do Guardião do Estado */}
            <div className="p-2 rounded-xl bg-slate-900/95 border border-amber-500/30 flex items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 shadow-sm">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <strong className="text-amber-200 text-xs block truncate font-serif font-bold">
                    {guardian.guardianName}
                  </strong>
                  <span className="text-[10px] text-slate-400 block truncate leading-tight">{guardian.guardianTitlePt}</span>
                </div>
              </div>

              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/30 shrink-0 font-bold">
                +100 XP
              </span>
            </div>

            {/* Rodapé com Convite / Call to Action */}
            <div className="rodape-acao-aventura pt-0.5 flex items-center justify-between text-[10.5px] text-amber-300 font-medium border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 truncate">
                <Swords className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">Clique para viajar e aceitar o Desafio</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
