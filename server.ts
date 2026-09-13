import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { processGuardianChat } from './src/server/guardianChatService';
import { userRepository } from './src/server/db/userRepository';

const PORT = 3000;

// Coordinates for Brazil's 27 Federal Units
const BRAZIL_COORDS = [
  { id: 'AC', name: 'Acre', capital: 'Rio Branco', lat: -9.97, lng: -67.81, baseT: 31.2, baseH: 82, baseR: 1.4, baseW: 9, baseWD: 320 },
  { id: 'AL', name: 'Alagoas', capital: 'Maceió', lat: -9.66, lng: -35.73, baseT: 28.5, baseH: 76, baseR: 0.2, baseW: 22, baseWD: 110 },
  { id: 'AP', name: 'Amapá', capital: 'Macapá', lat: 0.03, lng: -51.05, baseT: 30.8, baseH: 84, baseR: 3.1, baseW: 15, baseWD: 60 },
  { id: 'AM', name: 'Amazonas', capital: 'Manaus', lat: -3.11, lng: -60.02, baseT: 33.4, baseH: 80, baseR: 2.8, baseW: 10, baseWD: 80 },
  { id: 'BA', name: 'Bahia', capital: 'Salvador', lat: -12.97, lng: -38.50, baseT: 29.2, baseH: 74, baseR: 0.4, baseW: 24, baseWD: 125 },
  { id: 'CE', name: 'Ceará', capital: 'Fortaleza', lat: -3.71, lng: -38.54, baseT: 31.0, baseH: 71, baseR: 0.1, baseW: 28, baseWD: 95 },
  { id: 'DF', name: 'Distrito Federal', capital: 'Brasília', lat: -15.79, lng: -47.88, baseT: 26.5, baseH: 58, baseR: 0.0, baseW: 16, baseWD: 100 },
  { id: 'ES', name: 'Espírito Santo', capital: 'Vitória', lat: -20.31, lng: -40.33, baseT: 27.8, baseH: 73, baseR: 0.3, baseW: 20, baseWD: 50 },
  { id: 'GO', name: 'Goiás', capital: 'Goiânia', lat: -16.68, lng: -49.25, baseT: 28.9, baseH: 56, baseR: 0.0, baseW: 14, baseWD: 85 },
  { id: 'MA', name: 'Maranhão', capital: 'São Luís', lat: -2.53, lng: -44.30, baseT: 31.5, baseH: 79, baseR: 1.2, baseW: 19, baseWD: 75 },
  { id: 'MT', name: 'Mato Grosso', capital: 'Cuiabá', lat: -15.60, lng: -56.09, baseT: 35.1, baseH: 54, baseR: 0.0, baseW: 12, baseWD: 350 },
  { id: 'MS', name: 'Mato Grosso do Sul', capital: 'Campo Grande', lat: -20.44, lng: -54.64, baseT: 29.8, baseH: 62, baseR: 0.2, baseW: 15, baseWD: 30 },
  { id: 'MG', name: 'Minas Gerais', capital: 'Belo Horizonte', lat: -19.92, lng: -43.93, baseT: 25.4, baseH: 65, baseR: 0.0, baseW: 13, baseWD: 80 },
  { id: 'PA', name: 'Pará', capital: 'Belém', lat: -1.45, lng: -48.50, baseT: 32.0, baseH: 83, baseR: 4.2, baseW: 14, baseWD: 70 },
  { id: 'PB', name: 'Paraíba', capital: 'João Pessoa', lat: -7.11, lng: -34.86, baseT: 29.0, baseH: 75, baseR: 0.1, baseW: 25, baseWD: 115 },
  { id: 'PR', name: 'Paraná', capital: 'Curitiba', lat: -25.42, lng: -49.27, baseT: 19.8, baseH: 78, baseR: 0.8, baseW: 17, baseWD: 85 },
  { id: 'PE', name: 'Pernambuco', capital: 'Recife', lat: -8.05, lng: -34.88, baseT: 29.5, baseH: 77, baseR: 0.3, baseW: 23, baseWD: 120 },
  { id: 'PI', name: 'Piauí', capital: 'Teresina', lat: -5.08, lng: -42.80, baseT: 34.2, baseH: 60, baseR: 0.0, baseW: 15, baseWD: 85 },
  { id: 'RJ', name: 'Rio de Janeiro', capital: 'Rio de Janeiro', lat: -22.90, lng: -43.17, baseT: 27.2, baseH: 72, baseR: 0.2, baseW: 19, baseWD: 170 },
  { id: 'RN', name: 'Rio Grande do Norte', capital: 'Natal', lat: -5.79, lng: -35.20, baseT: 29.8, baseH: 74, baseR: 0.1, baseW: 26, baseWD: 110 },
  { id: 'RS', name: 'Rio Grande do Sul', capital: 'Porto Alegre', lat: -30.03, lng: -51.22, baseT: 17.5, baseH: 81, baseR: 1.5, baseW: 20, baseWD: 210 },
  { id: 'RO', name: 'Rondônia', capital: 'Porto Velho', lat: -8.76, lng: -63.90, baseT: 32.8, baseH: 81, baseR: 2.0, baseW: 11, baseWD: 340 },
  { id: 'RR', name: 'Roraima', capital: 'Boa Vista', lat: 2.82, lng: -60.67, baseT: 34.0, baseH: 68, baseR: 0.4, baseW: 16, baseWD: 55 },
  { id: 'SC', name: 'Santa Catarina', capital: 'Florianópolis', lat: -27.59, lng: -48.54, baseT: 21.4, baseH: 79, baseR: 0.9, baseW: 22, baseWD: 190 },
  { id: 'SP', name: 'São Paulo', capital: 'São Paulo', lat: -23.55, lng: -46.63, baseT: 23.6, baseH: 68, baseR: 0.1, baseW: 16, baseWD: 140 },
  { id: 'SE', name: 'Sergipe', capital: 'Aracaju', lat: -10.91, lng: -37.07, baseT: 28.7, baseH: 75, baseR: 0.2, baseW: 22, baseWD: 115 },
  { id: 'TO', name: 'Tocantins', capital: 'Palmas', lat: -10.21, lng: -48.36, baseT: 33.1, baseH: 58, baseR: 0.0, baseW: 14, baseWD: 90 },
];

const OCEANIC_POINTS = [
  { id: 'atlantico_equatorial', name: 'Atlântico Equatorial / Foz Amazonas', region: 'Norte / Oceano', lat: 0.5, lng: -48.0, phenomenon: 'Ventos Alísios de NE & Rios Voadores', isMarine: true },
  { id: 'costa_nordeste', name: 'Costa Leste Nordeste (RN/PB/PE)', region: 'Nordeste / Oceano', lat: -6.5, lng: -34.8, phenomenon: 'Ventos Alísios de SE & Corrente do Brasil', isMarine: true },
  { id: 'bacia_santos', name: 'Bacia de Santos / Sudeste Marítimo', region: 'Sudeste / Oceano', lat: -24.5, lng: -44.5, phenomenon: 'Corrente das Malvinas & Frentes Frias', isMarine: true },
  { id: 'bacia_prata', name: 'Fronteira Sul / Bacia do Prata', region: 'Sul / Oceano', lat: -31.5, lng: -50.0, phenomenon: 'Massa de Ar Polar Atlântica (MPA)', isMarine: true },
];

// Server-Side Central In-Memory Cache
interface ServerClimateCache {
  timestamp: number;
  data: any;
}

const CLIMATE_TTL_MS = 15 * 60 * 1000; // 15 minutes central cache
const CLIMATE_FORCE_COOLDOWN_MS = 15 * 1000; // 15 seconds minimum between upstream force-refreshes (Buffer de Proteção)
let serverClimateCache: ServerClimateCache | null = null;
let lastUpstreamCallTimestamp = 0;
let serverTotalUpstreamCalls = 0;
let serverTotalHits = 0;

const speciesCache = new Map<string, { timestamp: number; data: any }>();
const SPECIES_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to fetch Open-Meteo in batch
async function fetchUpstreamClimateTelemetry(): Promise<any> {
  serverTotalUpstreamCalls++;
  lastUpstreamCallTimestamp = Date.now();
  const lats = BRAZIL_COORDS.map((s) => s.lat).join(',');
  const lngs = BRAZIL_COORDS.map((s) => s.lng).join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,uv_index_max&forecast_days=7&timezone=America%2FSao_Paulo`;

  const stateWeather: Record<string, any> = {};
  const stations: any[] = [];

  const getConditionName = (wCode: number) => {
    if (wCode === 0) return 'Céu Limpo / Ensolarado';
    if (wCode <= 3) return 'Parcialmente Nublado';
    if (wCode <= 48) return 'Nevoeiro / Neblina';
    if (wCode <= 57) return 'Garoa Leve';
    if (wCode <= 67) return 'Chuva Contínua';
    if (wCode <= 82) return 'Pancadas de Chuva';
    return 'Tempestades & Trovoadas';
  };

  const dayNamesPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);

    const text = await res.text();
    let rawData: any;
    try {
      rawData = JSON.parse(text);
    } catch {
      throw new Error(`Open-Meteo retornou texto não-JSON: ${text.slice(0, 80)}...`);
    }
    const dataList = Array.isArray(rawData) ? rawData : [rawData];

    BRAZIL_COORDS.forEach((state, idx) => {
      const current = dataList[idx]?.current || {};
      const daily = dataList[idx]?.daily || {};
      const temp = typeof current.temperature_2m === 'number' ? Math.round(current.temperature_2m * 100) / 100 : state.baseT;
      const maxDailyTemp = Array.isArray(daily.temperature_2m_max) && typeof daily.temperature_2m_max[0] === 'number'
        ? Math.round(daily.temperature_2m_max[0] * 100) / 100
        : Math.round((temp + 3.25) * 100) / 100;
      const minDailyTemp = Array.isArray(daily.temperature_2m_min) && typeof daily.temperature_2m_min[0] === 'number'
        ? Math.round(daily.temperature_2m_min[0] * 100) / 100
        : Math.round((temp - 4.45) * 100) / 100;
      const appTemp = typeof current.apparent_temperature === 'number' ? Math.round(current.apparent_temperature * 10) / 10 : temp + 1;
      const hum = typeof current.relative_humidity_2m === 'number' ? Math.round(current.relative_humidity_2m) : state.baseH;
      const rain = typeof current.precipitation === 'number' ? Math.round(current.precipitation * 10) / 10 : state.baseR;
      const windSpd = typeof current.wind_speed_10m === 'number' ? Math.round(current.wind_speed_10m) : state.baseW;
      const windDir = typeof current.wind_direction_10m === 'number' ? Math.round(current.wind_direction_10m) : state.baseWD;
      const press = typeof current.surface_pressure === 'number' ? Math.round(current.surface_pressure) : 1013;
      const uvIdx = typeof current.uv_index === 'number' ? Math.round(current.uv_index * 10) / 10 : (state.lat > -15 ? 8.5 : 6.0);
      const wCode = current.weather_code ?? 1;

      // Montar Forecast de 7 dias
      const forecast: any[] = [];
      const times = daily.time || [];
      const maxs = daily.temperature_2m_max || [];
      const mins = daily.temperature_2m_min || [];
      const rainSums = daily.precipitation_sum || [];
      const rainProbs = daily.precipitation_probability_max || [];
      const codes = daily.weather_code || [];

      for (let d = 0; d < Math.max(times.length, 7); d++) {
        const dateStr = times[d] || `Dia +${d}`;
        let dayName = 'Hoje';
        if (d === 0) dayName = 'Hoje';
        else if (d === 1) dayName = 'Amanhã';
        else {
          const dObj = new Date(dateStr + 'T12:00:00');
          dayName = !isNaN(dObj.getTime()) ? dayNamesPt[dObj.getDay()] : `+${d}d`;
        }

        const fMax = typeof maxs[d] === 'number' ? Math.round(maxs[d] * 10) / 10 : Math.round((temp + 3 + (d % 3) * 0.5) * 10) / 10;
        const fMin = typeof mins[d] === 'number' ? Math.round(mins[d] * 10) / 10 : Math.round((temp - 4 - (d % 2) * 0.5) * 10) / 10;
        const fRain = typeof rainSums[d] === 'number' ? Math.round(rainSums[d] * 10) / 10 : (d % 2 === 0 ? 2.5 : 0.0);
        const fProb = typeof rainProbs[d] === 'number' ? Math.round(rainProbs[d]) : (fRain > 1 ? 70 : 15);
        const fCode = typeof codes[d] === 'number' ? codes[d] : (fRain > 5 ? 61 : fRain > 0.5 ? 51 : 1);

        forecast.push({
          dayIndex: d,
          date: dateStr,
          dayName,
          maxTemp: fMax,
          minTemp: fMin,
          rainSum: fRain,
          rainProb: fProb,
          weatherCode: fCode,
          condition: getConditionName(fCode),
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
    });
  } catch (err) {
    console.warn('[SERVER PROXY] Falha na Open-Meteo, usando base sintética calibrada:', err);
    BRAZIL_COORDS.forEach((state) => {
      const temp = state.baseT;
      const forecast: any[] = [];
      for (let d = 0; d < 7; d++) {
        const dayNames = ['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        forecast.push({
          dayIndex: d,
          date: `2026-08-${28 + d}`,
          dayName: dayNames[d] || `+${d}d`,
          maxTemp: Math.round((temp + 3.2 + (d % 2) * 0.8) * 10) / 10,
          minTemp: Math.round((temp - 4.1 - (d % 3) * 0.4) * 10) / 10,
          rainSum: state.baseR * (d % 2 === 0 ? 1.2 : 0.4),
          rainProb: state.baseR > 1.0 ? 65 : 20,
          weatherCode: state.baseR > 2.0 ? 61 : 1,
          condition: state.baseR > 2.0 ? 'Pancadas de Chuva' : 'Ensolarado',
        });
      }

      stateWeather[state.id] = {
        stateId: state.id,
        stateName: state.name,
        capital: state.capital,
        lat: state.lat,
        lng: state.lng,
        temperature: state.baseT,
        minTemperature: Math.round((state.baseT - 4.45) * 100) / 100,
        maxTemperature: Math.round((state.baseT + 3.25) * 100) / 100,
        apparentTemperature: state.baseT + 1,
        humidity: state.baseH,
        precipitation: state.baseR,
        windSpeed: state.baseW,
        windDirection: state.baseWD,
        surfacePressure: 1013,
        uvIndex: state.lat > -15 ? 8.5 : 6.0,
        weatherCode: 1,
        condition: 'Parcialmente Nublado',
        forecast,
      };
    });
  }

  OCEANIC_POINTS.forEach((pt) => {
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

  const elNino = {
    phase: 'La Niña',
    seaTempAnomaly: -0.8,
    intensity: 'Fraco a Moderado',
    description: 'Resfriamento das águas superficiais do Oceano Pacífico Equatorial (Niño 3.4), intensificando ventos alísios.',
    impactsBrazil: {
      norte: 'Chuvas regulares e rios com volume elevado.',
      nordeste: 'Aumento das chuvas no semiárido e litoral leste.',
      centroOeste: 'Estação chuvosa bem distribuída.',
      sudeste: 'Maior variabilidade térmica com frentes frias regulares.',
      sul: 'Tendência a estiagens periódicas.',
    },
  };

  const now = new Date();
  const dayName = now.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'America/Sao_Paulo' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
  const dayNum = now.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: 'America/Sao_Paulo' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
  const timeHStr = timeStr.replace(':', 'h');

  return {
    fetchedAt: Date.now(),
    updatedAt: timeStr,
    updatedAtH: timeHStr,
    dateTimeFormatted: `${capitalizedDay} ${dayNum}, ${timeStr} (-03)`,
    stateWeather,
    stations,
    elNino,
    avgTempBrazil,
    maxTempState,
    minTempState,
    serverCacheExpiresInSec: Math.round(CLIMATE_TTL_MS / 1000),
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      cacheHits: serverTotalHits,
      upstreamCalls: serverTotalUpstreamCalls,
    });
  });

  // 2. Telemetria Climatológica Global (/api/climate)
  // Aceita ?force=true com controle inteligente de buffer (cooldown de 15s para evitar spam upstream)
  app.get('/api/climate', async (req, res) => {
    const force = req.query.force === 'true' || req.query.refresh === 'true';
    const now = Date.now();

    // Cache regular válido
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

    // Buffer inteligente de proteção contra múltiplos cliques rápidos em "Forçar Atualização"
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
      // Se forçarmos atualização após o cooldown, limpamos a referência anterior
      if (force) {
        serverClimateCache = null;
      }

      const data = await fetchUpstreamClimateTelemetry();
      serverClimateCache = {
        timestamp: now,
        data,
      };

      res.setHeader('X-Proxy-Cache', force ? 'BYPASS-FORCE-REFRESH' : 'MISS');
      res.json({
        ...data,
        cachedAt: new Date(now).toISOString(),
        isServerCache: false,
        forced: force,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao obter telemetria climatológica', message: err?.message });
    }
  });

  // 3. Telemetria de Estado Individual (/api/climate/:stateCode)
  // Aceita ?force=true
  app.get('/api/climate/:stateCode', async (req, res) => {
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

  // 4. GBIF / Espécies Proxy Central (/api/species/:taxonKey)
  // Cache central de 24 horas no servidor para não onerar GBIF
  app.get('/api/species/:taxonKey', async (req, res) => {
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

  // 5. Estatísticas Globais do Servidor
  app.get('/api/status', (_req, res) => {
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

  // 6. Dados e Bundles Estruturados dos Estados Brasileiros
  app.get(['/api/states', '/data/states', '/data/states/all.json'], (_req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'public', 'states', 'all_states.json');
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/json');
        return res.sendFile(filePath);
      }
      res.status(404).json({ error: 'Arquivo all_states.json não encontrado' });
    } catch (e: any) {
      res.status(500).json({ error: 'Erro ao carregar dados dos estados', message: e?.message });
    }
  });

  app.get(['/api/states/:uf', '/data/states/:uf'], (req, res) => {
    try {
      const uf = req.params.uf.toLowerCase();
      const filePath = path.join(process.cwd(), 'public', 'states', 'all_states.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const all = JSON.parse(raw);
        const stateData = all[uf.toUpperCase()];
        if (stateData) {
          res.setHeader('Content-Type', 'application/json');
          return res.json(stateData);
        }
      }
      res.status(404).json({ error: `Estado ${uf.toUpperCase()} não encontrado` });
    } catch (e: any) {
      res.status(500).json({ error: 'Erro ao carregar estado', message: e?.message });
    }
  });

  // 7. Diálogo Inteligente com Guardiões Estaduais (Gemini API Server-Side)
  app.post('/api/guardian-chat', async (req, res) => {
    try {
      const { guardianId, message, history, context } = req.body || {};
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Mensagem obrigatória para dialogar com o Guardião.' });
      }

      const result = await processGuardianChat({
        guardianId: guardianId || 'AM',
        message: message.trim(),
        history,
        context,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        error: 'Falha ao processar diálogo com o Guardião',
        message: err?.message,
      });
    }
  });

  // 8. Rotas de Autenticação e Usuário Desacopladas (SQLite Leve)
  app.post('/api/auth/register', (req, res) => {
    try {
      const { username, displayName, email, password } = req.body || {};
      if (!username || !username.trim()) {
        return res.status(400).json({ error: 'Nome de usuário é obrigatório.' });
      }

      const cleanUsername = username.trim().toLowerCase();
      const existing = userRepository.findByUsername(cleanUsername);
      if (existing) {
        return res.status(409).json({ error: 'Nome de usuário já está em uso.' });
      }

      const newUser = userRepository.create({
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        username: cleanUsername,
        display_name: displayName?.trim() || cleanUsername,
        email: email?.trim() || null,
        password_hash: password ? `hash_${password}` : null,
        avatar_id: 'recruta',
        is_guest: 0,
      });

      res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.display_name,
          email: newUser.email,
          avatarId: newUser.avatar_id,
          isGuest: false,
          createdAt: newUser.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao criar conta', message: err?.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { usernameOrEmail } = req.body || {};
      if (!usernameOrEmail || !usernameOrEmail.trim()) {
        return res.status(400).json({ error: 'Identificador de usuário obrigatório.' });
      }

      const user = userRepository.findByUsername(usernameOrEmail.trim().toLowerCase()) 
        || userRepository.findByEmail(usernameOrEmail.trim().toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      userRepository.updateLastLogin(user.id);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          avatarId: user.avatar_id,
          isGuest: Boolean(user.is_guest),
          createdAt: user.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao autenticar', message: err?.message });
    }
  });

  app.post('/api/auth/google', (req, res) => {
    try {
      const { email, displayName, avatarUrl, googleId } = req.body || {};
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'E-mail obrigatório para Login com Google.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      let user = userRepository.findByEmail(cleanEmail);

      if (!user) {
        // Cria usuário autenticado via Google
        const generatedUsername = cleanEmail.split('@')[0] || `google_${Math.random().toString(36).slice(2, 6)}`;
        let uniqueUsername = generatedUsername;
        if (userRepository.findByUsername(uniqueUsername)) {
          uniqueUsername = `${generatedUsername}_${Math.random().toString(36).slice(2, 5)}`;
        }

        user = userRepository.create({
          id: `goog_${googleId || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          username: uniqueUsername,
          display_name: displayName?.trim() || uniqueUsername,
          email: cleanEmail,
          password_hash: null,
          avatar_id: avatarUrl || 'recruta',
          is_guest: 0,
        });
      } else {
        userRepository.updateLastLogin(user.id);
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          avatarId: user.avatar_id,
          isGuest: Boolean(user.is_guest),
          createdAt: user.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao autenticar via Google', message: err?.message });
    }
  });

  app.post('/api/auth/guest', (_req, res) => {
    try {
      const guestId = `guest_${Math.random().toString(36).slice(2, 8)}`;
      const guest = userRepository.create({
        id: guestId,
        username: guestId,
        display_name: 'Explorador Convidado',
        email: null,
        password_hash: null,
        avatar_id: 'recruta',
        is_guest: 1,
      });

      res.json({
        user: {
          id: guest.id,
          username: guest.username,
          displayName: guest.display_name,
          isGuest: true,
          createdAt: guest.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao gerar sessão de convidado', message: err?.message });
    }
  });

  app.get('/api/user/me', (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

      const user = userRepository.findById(userId);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      res.json({
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          email: user.email,
          avatarId: user.avatar_id,
          isGuest: Boolean(user.is_guest),
          createdAt: user.created_at,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar dados do usuário', message: err?.message });
    }
  });

  app.get('/api/user/preferences', (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

      const prefs = userRepository.getPreferences(userId);
      res.json({ preferences: prefs });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar preferências', message: err?.message });
    }
  });

  app.put('/api/user/preferences', (req, res) => {
    try {
      const { userId, ...rest } = req.body || {};
      if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

      userRepository.savePreferences({
        user_id: userId,
        sound_enabled: rest.soundEnabled ?? true,
        default_map_mode: rest.defaultMapMode || '2d',
        high_contrast: rest.highContrast ?? false,
        auto_rotate_globe: rest.autoRotateGlobe ?? true,
        theme: rest.theme || 'cartographic',
        music_volume: rest.musicVolume ?? 80,
        sfx_volume: rest.sfxVolume ?? 85,
        favorites: rest.favorites,
        updated_at: new Date().toISOString(),
      });

      const updated = userRepository.getPreferences(userId);
      res.json({ preferences: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao salvar preferências', message: err?.message });
    }
  });

  app.get('/api/user/progress', (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

      const progress = userRepository.getProgress(userId);
      res.json({ progress });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao buscar progresso', message: err?.message });
    }
  });

  app.put('/api/user/progress', (req, res) => {
    try {
      const { userId, progress } = req.body || {};
      if (!userId || !progress) return res.status(400).json({ error: 'userId e progress obrigatórios' });

      userRepository.saveProgress({
        user_id: userId,
        xp: progress.xp || 0,
        level: progress.level || 1,
        daily_streak: progress.dailyStreak || 1,
        unlocked_insignias: progress.unlockedInsignias || [],
        completed_states: progress.completedStates || [],
        read_pergaments: progress.readPergaments || [],
        explored_dialogues: progress.exploredDialogues || [],
        score_history: progress.scoreHistory || [],
        updated_at: new Date().toISOString(),
      });

      res.json({ status: 'ok' });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao salvar progresso', message: err?.message });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BR-QUEST SERVER] Servidor Express ativo na porta ${PORT} com proxy de cache central.`);
  });
}

startServer();
