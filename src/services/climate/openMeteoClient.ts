/**
 * Cliente Resiliente da API Open-Meteo & Servidor Proxy
 * Implementa timeout, deduplicação em voo (in-flight request deduplication)
 * e proteção contra payloads não-JSON ou sobrecarga do provedor externo.
 */

import { apiTracker } from '../apiTracker';
import type {
  ClimateStationData,
  ClimateTelemetryResponse,
  StateForecastDay,
  StateWeatherData,
} from './climateTypes';
import {
  BRAZIL_STATES_COORDINATES,
  OCEANIC_MONITORING_POINTS,
  buildFallbackClimateTelemetry,
  getConditionNameByWmoCode,
  MOCK_EL_NINO_INDEX,
} from './climateOfflineFallback';
import { formatMeteoredDateTime } from '../../lib/formatters';

// Controle de deduplicação de requisições em voo (in-flight request sharing)
let inFlightTelemetryPromise: Promise<ClimateTelemetryResponse> | null = null;

const DAY_NAMES_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Realiza a busca de telemetria climática conectando via Proxy do Servidor (/api/climate)
 * ou realizando fallback direto via Open-Meteo com proteção robusta de parsing.
 */
export async function fetchUpstreamTelemetry(forceRefresh = false): Promise<ClimateTelemetryResponse> {
  // Se já existir uma requisição em andamento e não for força bruta, reutiliza a mesma Promise
  if (!forceRefresh && inFlightTelemetryPromise) {
    return inFlightTelemetryPromise;
  }

  const fetchPromise = (async () => {
    const startTime = performance.now();

    // 1. Tentar primeiro via Proxy Centralizado do Servidor (/api/climate)
    try {
      const serverProxyUrl = `/api/climate${forceRefresh ? '?force=true' : ''}`;
      const proxyRes = await fetch(serverProxyUrl, { signal: AbortSignal.timeout(6000) });
      const duration = performance.now() - startTime;

      if (proxyRes.ok) {
        const text = await proxyRes.text();
        let proxyData: ClimateTelemetryResponse;
        try {
          proxyData = JSON.parse(text);
        } catch {
          throw new Error('Servidor retornou resposta não-JSON');
        }

        const payloadSizeKb = text.length / 1024;
        const isHit = proxyRes.headers.get('X-Proxy-Cache') === 'HIT';

        apiTracker.trackCall(
          'open-meteo',
          isHit ? '/api/climate (Server Proxy Cache 15m)' : '/api/climate (Server Live Batch)',
          duration,
          isHit ? 'cached' : 'success',
          200,
          isHit
            ? 'Telemetria obtida via Cache Central do Servidor (~1ms)'
            : forceRefresh
            ? 'Re-teste manual direto via Proxy Backend'
            : '27 estados sincronizados via Proxy Centralizado',
          payloadSizeKb
        );

        return proxyData;
      }
    } catch (proxyErr) {
      console.info('[OpenMeteoClient] Proxy local indisponível, tentando chamada direta:', proxyErr);
    }

    // 2. Fallback direto Client-Side para Open-Meteo caso o proxy não responda
    try {
      const lats = BRAZIL_STATES_COORDINATES.map((s) => s.lat).join(',');
      const lngs = BRAZIL_STATES_COORDINATES.map((s) => s.lng).join(',');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,uv_index_max&forecast_days=7&timezone=America%2FSao_Paulo`;

      const res = await fetch(url, { signal: AbortSignal.timeout(7500) });
      const duration = performance.now() - startTime;

      if (!res.ok) {
        apiTracker.trackCall('open-meteo', '/v1/forecast (Direct Client)', duration, 'error', res.status, `HTTP error ${res.status}`);
        throw new Error(`Open-Meteo HTTP ${res.status}`);
      }

      const text = await res.text();
      let rawData: any;
      try {
        rawData = JSON.parse(text);
      } catch {
        throw new Error('Open-Meteo retornou texto não-JSON');
      }

      const dataList = Array.isArray(rawData) ? rawData : [rawData];
      const payloadSizeKb = text.length / 1024;

      apiTracker.trackCall(
        'open-meteo',
        '/v1/forecast (Direct Client ECMWF)',
        duration,
        'success',
        200,
        '27 estados sincronizados diretamente via cliente',
        payloadSizeKb
      );

      const stateWeather: Record<string, StateWeatherData> = {};
      const stations: ClimateStationData[] = [];

      BRAZIL_STATES_COORDINATES.forEach((state, idx) => {
        const current = dataList[idx]?.current || {};
        const daily = dataList[idx]?.daily || {};
        const temp = typeof current.temperature_2m === 'number' ? Math.round(current.temperature_2m * 100) / 100 : state.baseClimate.temp;
        const maxDailyTemp = Array.isArray(daily.temperature_2m_max) && typeof daily.temperature_2m_max[0] === 'number'
          ? Math.round(daily.temperature_2m_max[0] * 100) / 100
          : Math.round((temp + 3.25) * 100) / 100;
        const minDailyTemp = Array.isArray(daily.temperature_2m_min) && typeof daily.temperature_2m_min[0] === 'number'
          ? Math.round(daily.temperature_2m_min[0] * 100) / 100
          : Math.round((temp - 4.45) * 100) / 100;
        const appTemp = typeof current.apparent_temperature === 'number' ? Math.round(current.apparent_temperature * 10) / 10 : temp + 1;
        const hum = typeof current.relative_humidity_2m === 'number' ? Math.round(current.relative_humidity_2m) : state.baseClimate.hum;
        const rain = typeof current.precipitation === 'number' ? Math.round(current.precipitation * 10) / 10 : state.baseClimate.rain;
        const windSpd = typeof current.wind_speed_10m === 'number' ? Math.round(current.wind_speed_10m) : state.baseClimate.wind;
        const windDir = typeof current.wind_direction_10m === 'number' ? Math.round(current.wind_direction_10m) : state.baseClimate.windDir;
        const press = typeof current.surface_pressure === 'number' ? Math.round(current.surface_pressure) : 1013;
        const uvIdx = typeof current.uv_index === 'number' ? Math.round(current.uv_index * 10) / 10 : (state.lat > -15 ? 8.5 : 6.0);
        const wCode = current.weather_code ?? 1;

        // Montar previsão estendida de 7 dias
        const forecast: StateForecastDay[] = [];
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
            dayName = !isNaN(dObj.getTime()) ? DAY_NAMES_PT[dObj.getDay()] : `+${d}d`;
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
            condition: getConditionNameByWmoCode(fCode),
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
          condition: getConditionNameByWmoCode(wCode),
          forecast,
        };

        stations.push({
          id: `ST-${state.id}`,
          name: `Estação ${state.capital} (${state.id})`,
          region: state.name,
          lat: state.lat,
          lng: state.lng,
          temperature: temp,
          humidity: hum,
          precipitation: rain,
          windSpeed: windSpd,
          windDirection: windDir,
          surfacePressure: press,
          isMarine: false,
          phenomenon: getConditionNameByWmoCode(wCode),
        });
      });

      // Estações Oceânicas
      OCEANIC_MONITORING_POINTS.forEach((pt) => {
        const tempBase = pt.lat < -20 ? 21.0 : pt.lat < -10 ? 26.5 : 28.2;
        stations.push({
          id: pt.id,
          name: pt.name,
          region: pt.region,
          lat: pt.lat,
          lng: pt.lng,
          temperature: Math.round((tempBase + (Math.random() * 1.5 - 0.75)) * 10) / 10,
          humidity: Math.round(80 + Math.random() * 8),
          precipitation: 0.0,
          windSpeed: Math.round(20 + Math.random() * 12),
          windDirection: Math.round(100 + Math.random() * 40),
          surfacePressure: 1014,
          isMarine: true,
          phenomenon: pt.phenomenon,
        });
      });

      const temps = Object.values(stateWeather).map((s) => s.temperature);
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      let maxS = { stateId: 'MT', temp: -99 };
      let minS = { stateId: 'RS', temp: 99 };
      Object.entries(stateWeather).forEach(([id, data]) => {
        if (data.temperature > maxS.temp) maxS = { stateId: id, temp: data.temperature };
        if (data.temperature < minS.temp) minS = { stateId: id, temp: data.temperature };
      });

      const now = new Date();
      return {
        fetchedAt: Date.now(),
        updatedAt: now.toISOString(),
        updatedAtH: formatMeteoredDateTime(now),
        dateTimeFormatted: formatMeteoredDateTime(now),
        stateWeather,
        stations,
        elNino: MOCK_EL_NINO_INDEX,
        avgTempBrazil: Math.round(avgTemp * 10) / 10,
        maxTempState: maxS,
        minTempState: minS,
      };
    } catch (directErr) {
      console.warn('[OpenMeteoClient] Falha na busca direta, ativando contingência calibrada L3:', directErr);
      return buildFallbackClimateTelemetry();
    }
  })();

  inFlightTelemetryPromise = fetchPromise;
  fetchPromise.finally(() => {
    inFlightTelemetryPromise = null;
  });

  return fetchPromise;
}
