/**
 * Rotas de Telemetria Climatológica, GBIF e Estatísticas do Servidor
 * Projeto: BR Quest
 */

import { Router } from 'express';
import {
  BRAZIL_STATES_COORDINATES,
  OCEANIC_MONITORING_POINTS,
  MOCK_EL_NINO_INDEX,
} from '../../services/climate/climateOfflineFallback';

export const climateRouter = Router();

interface ServerClimateCache {
  timestamp: number;
  data: any;
}

const CLIMATE_TTL_MS = 15 * 60 * 1000; // 15 minutos
const CLIMATE_FORCE_COOLDOWN_MS = 15 * 1000; // 15s de cooldown anti-spam
const SPECIES_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

let serverClimateCache: ServerClimateCache | null = null;
let lastUpstreamCallTimestamp = 0;
let serverTotalUpstreamCalls = 0;
let serverTotalHits = 0;

const speciesCache = new Map<string, { timestamp: number; data: any }>();

const getConditionName = (wCode: number) => {
  if (wCode === 0) return 'Céu Limpo / Ensolarado';
  if (wCode <= 3) return 'Parcialmente Nublado';
  if (wCode <= 48) return 'Nevoeiro / Neblina';
  if (wCode <= 57) return 'Garoa Leve';
  if (wCode <= 67) return 'Chuva Contínua';
  if (wCode <= 82) return 'Pancadas de Chuva';
  return 'Tempestades & Trovoadas';
};

const DAY_NAMES_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

async function fetchUpstreamClimateTelemetry(): Promise<any> {
  serverTotalUpstreamCalls++;
  lastUpstreamCallTimestamp = Date.now();
  const lats = BRAZIL_STATES_COORDINATES.map((s) => s.lat).join(',');
  const lngs = BRAZIL_STATES_COORDINATES.map((s) => s.lng).join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,uv_index_max&forecast_days=7&timezone=America%2FSao_Paulo`;

  const stateWeather: Record<string, any> = {};
  const stations: any[] = [];

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);

    const text = await res.text();
    let rawData: any;
    try {
      rawData = JSON.parse(text);
    } catch {
      throw new Error(`Open-Meteo retornou texto não-JSON`);
    }
    const dataList = Array.isArray(rawData) ? rawData : [rawData];

    BRAZIL_STATES_COORDINATES.forEach((state, idx) => {
      const current = dataList[idx]?.current || {};
      const daily = dataList[idx]?.daily || {};
      const base = state.baseClimate;

      const temp = typeof current.temperature_2m === 'number' ? Math.round(current.temperature_2m * 100) / 100 : base.temp;
      const maxDailyTemp = Array.isArray(daily.temperature_2m_max) && typeof daily.temperature_2m_max[0] === 'number'
        ? Math.round(daily.temperature_2m_max[0] * 100) / 100
        : Math.round((temp + 3.25) * 100) / 100;
      const minDailyTemp = Array.isArray(daily.temperature_2m_min) && typeof daily.temperature_2m_min[0] === 'number'
        ? Math.round(daily.temperature_2m_min[0] * 100) / 100
        : Math.round((temp - 4.45) * 100) / 100;
      const appTemp = typeof current.apparent_temperature === 'number' ? Math.round(current.apparent_temperature * 10) / 10 : temp + 1;
      const hum = typeof current.relative_humidity_2m === 'number' ? Math.round(current.relative_humidity_2m) : base.hum;
      const rain = typeof current.precipitation === 'number' ? Math.round(current.precipitation * 10) / 10 : base.rain;
      const windSpd = typeof current.wind_speed_10m === 'number' ? Math.round(current.wind_speed_10m) : base.wind;
      const windDir = typeof current.wind_direction_10m === 'number' ? Math.round(current.wind_direction_10m) : base.windDir;
      const press = typeof current.surface_pressure === 'number' ? Math.round(current.surface_pressure) : 1013;
      const uvIdx = typeof current.uv_index === 'number' ? Math.round(current.uv_index * 10) / 10 : (state.lat > -15 ? 8.5 : 6.0);
      const wCode = current.weather_code ?? 1;

      const forecast: any[] = [];
      const times = daily.time || [];
      for (let d = 0; d < Math.min(times.length, 7); d++) {
        const dObj = new Date(times[d] + 'T12:00:00');
        const dayLabel = d === 0 ? 'Hoje' : d === 1 ? 'Amanhã' : DAY_NAMES_PT[dObj.getDay()];
        forecast.push({
          date: times[d],
          dayName: dayLabel,
          minTemp: daily.temperature_2m_min?.[d] ?? minDailyTemp,
          maxTemp: daily.temperature_2m_max?.[d] ?? maxDailyTemp,
          precipitationProbability: daily.precipitation_probability_max?.[d] ?? 20,
          condition: getConditionName(daily.weather_code?.[d] ?? 1),
        });
      }

      stateWeather[state.id] = {
        stateId: state.id,
        stateName: state.name,
        capital: state.capital,
        lat: state.lat,
        lng: state.lng,
        temperature: temp,
        minTemperature: minDailyTemp,
        maxTemperature: maxDailyTemp,
        apparentTemperature: appTemp,
        humidity: hum,
        precipitation: rain,
        windSpeed: windSpd,
        windDirection: windDir,
        surfacePressure: press,
        uvIndex: uvIdx,
        weatherCode: wCode,
        condition: getConditionName(wCode),
        forecast,
      };

      stations.push({
        id: `station_${state.id.toLowerCase()}`,
        name: `Estação INMET / ${state.capital} (${state.id})`,
        region: state.id,
        lat: state.lat,
        lng: state.lng,
        temperature: temp,
        humidity: hum,
        precipitation: rain,
        windSpeed: windSpd,
        windDirection: windDir,
        surfacePressure: press,
        condition: getConditionName(wCode),
        isMarine: false,
      });
    });
  } catch (err: any) {
    console.warn('[ClimateRoutes] Upstream falhou, utilizando base científica calibrada:', err.message);
    BRAZIL_STATES_COORDINATES.forEach((state) => {
      const base = state.baseClimate;
      stateWeather[state.id] = {
        stateId: state.id,
        stateName: state.name,
        capital: state.capital,
        lat: state.lat,
        lng: state.lng,
        temperature: base.temp,
        minTemperature: Math.round((base.temp - 4.45) * 100) / 100,
        maxTemperature: Math.round((base.temp + 3.25) * 100) / 100,
        apparentTemperature: base.temp + 1,
        humidity: base.hum,
        precipitation: base.rain,
        windSpeed: base.wind,
        windDirection: base.windDir,
        surfacePressure: 1013,
        uvIndex: state.lat > -15 ? 8.5 : 6.0,
        weatherCode: 1,
        condition: 'Parcialmente Nublado',
        forecast: [],
      };
    });
  }

  OCEANIC_MONITORING_POINTS.forEach((pt) => {
    stations.push({
      id: pt.id,
      name: pt.name,
      region: pt.region,
      lat: pt.lat,
      lng: pt.lng,
      temperature: 26.5 + (pt.lat > -10 ? 2 : -3),
      humidity: 78,
      precipitation: 0.2,
      windSpeed: 22,
      windDirection: pt.lat > -10 ? 65 : 120,
      surfacePressure: 1014,
      isMarine: pt.isMarine,
      phenomenon: pt.phenomenon,
    });
  });

  const stateValues = Object.values(stateWeather);
  const totalTemp = stateValues.reduce((acc: number, s: any) => acc + s.temperature, 0);
  const avgTempBrazil = Math.round((totalTemp / stateValues.length) * 10) / 10;

  let maxTempState = { stateId: 'MT', temp: -99 };
  let minTempState = { stateId: 'RS', temp: 99 };
  stateValues.forEach((s: any) => {
    if (s.temperature > maxTempState.temp) maxTempState = { stateId: s.stateId, temp: s.temperature };
    if (s.temperature < minTempState.temp) minTempState = { stateId: s.stateId, temp: s.temperature };
  });

  const now = new Date();
  const dayName = now.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'America/Sao_Paulo' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
  const dayNum = now.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: 'America/Sao_Paulo' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

  return {
    fetchedAt: Date.now(),
    updatedAt: timeStr,
    updatedAtH: timeStr.replace(':', 'h'),
    dateTimeFormatted: `${capitalizedDay} ${dayNum}, ${timeStr} (-03)`,
    stateWeather,
    stations,
    elNino: MOCK_EL_NINO_INDEX,
    avgTempBrazil,
    maxTempState,
    minTempState,
    serverCacheExpiresInSec: Math.round(CLIMATE_TTL_MS / 1000),
  };
}

climateRouter.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    cacheHits: serverTotalHits,
    upstreamCalls: serverTotalUpstreamCalls,
  });
});

climateRouter.get('/api/climate', async (req, res) => {
  const force = req.query.force === 'true' || req.query.refresh === 'true';
  const now = Date.now();

  if (!force && serverClimateCache && now - serverClimateCache.timestamp < CLIMATE_TTL_MS) {
    serverTotalHits++;
    res.setHeader('X-Proxy-Cache', 'HIT');
    res.setHeader('X-Cache-Age-Seconds', Math.round((now - serverClimateCache.timestamp) / 1000));
    return res.json({
      ...serverClimateCache.data,
      cachedAt: new Date(serverClimateCache.timestamp).toISOString(),
      isServerCache: true,
    });
  }

  const isCooldownActive = force && (now - lastUpstreamCallTimestamp < CLIMATE_FORCE_COOLDOWN_MS) && serverClimateCache !== null;
  if (isCooldownActive) {
    serverTotalHits++;
    res.setHeader('X-Proxy-Cache', 'COOLDOWN-BUFFERED');
    res.setHeader('X-Cache-Age-Seconds', Math.round((now - serverClimateCache!.timestamp) / 1000));
    return res.json({
      ...serverClimateCache!.data,
      cachedAt: new Date(serverClimateCache!.timestamp).toISOString(),
      isServerCache: true,
      cooldownActive: true,
      cooldownRemainingSec: Math.ceil((CLIMATE_FORCE_COOLDOWN_MS - (now - lastUpstreamCallTimestamp)) / 1000),
    });
  }

  try {
    if (force) serverClimateCache = null;
    const data = await fetchUpstreamClimateTelemetry();
    serverClimateCache = { timestamp: now, data };
    res.setHeader('X-Proxy-Cache', force ? 'BYPASS-FORCE-REFRESH' : 'MISS');
    res.json({ ...data, cachedAt: new Date(now).toISOString(), isServerCache: false, forced: force });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao obter telemetria climatológica', message: err?.message });
  }
});

climateRouter.get('/api/climate/:stateCode', async (req, res) => {
  const stateCode = req.params.stateCode.toUpperCase();
  const force = req.query.force === 'true';
  const now = Date.now();

  let fullData: any;
  if (!force && serverClimateCache && now - serverClimateCache.timestamp < CLIMATE_TTL_MS) {
    serverTotalHits++;
    fullData = serverClimateCache.data;
  } else {
    fullData = await fetchUpstreamClimateTelemetry();
    serverClimateCache = { timestamp: now, data: fullData };
  }

  const stateData = fullData.stateWeather?.[stateCode];
  if (!stateData) {
    return res.status(404).json({ error: `Estado '${stateCode}' não encontrado` });
  }

  res.json({
    state: stateData,
    elNino: fullData.elNino,
    updatedAt: fullData.updatedAt,
    dateTimeFormatted: fullData.dateTimeFormatted,
    isServerCache: !force,
  });
});

climateRouter.get('/api/species/:taxonKey', async (req, res) => {
  const taxonKey = req.params.taxonKey;
  const force = req.query.force === 'true';
  const now = Date.now();

  const cached = speciesCache.get(taxonKey);
  if (!force && cached && now - cached.timestamp < SPECIES_TTL_MS) {
    serverTotalHits++;
    res.setHeader('X-Proxy-Cache', 'HIT');
    return res.json({ ...cached.data, isServerCache: true });
  }

  try {
    const gbifUrl = `https://api.gbif.org/v1/species/${encodeURIComponent(taxonKey)}`;
    const gbifRes = await fetch(gbifUrl, { signal: AbortSignal.timeout(5000) });
    if (!gbifRes.ok) throw new Error(`GBIF HTTP ${gbifRes.status}`);

    const gbifData = await gbifRes.json();
    speciesCache.set(taxonKey, { timestamp: now, data: gbifData });
    serverTotalUpstreamCalls++;
    res.setHeader('X-Proxy-Cache', force ? 'BYPASS-FORCE' : 'MISS');
    res.json({ ...gbifData, isServerCache: false });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao consultar GBIF', message: err?.message });
  }
});

climateRouter.get('/api/status', (_req, res) => {
  res.json({
    serverUptimeSec: Math.round(process.uptime()),
    climateCacheValid: !!serverClimateCache && Date.now() - serverClimateCache.timestamp < CLIMATE_TTL_MS,
    climateCacheAgeSec: serverClimateCache ? Math.round((Date.now() - serverClimateCache.timestamp) / 1000) : null,
    speciesCachedCount: speciesCache.size,
    serverTotalHits,
    serverTotalUpstreamCalls,
    theoreticalSavingsPct: serverTotalHits + serverTotalUpstreamCalls > 0
      ? Math.round((serverTotalHits / (serverTotalHits + serverTotalUpstreamCalls)) * 100)
      : 100,
  });
});
