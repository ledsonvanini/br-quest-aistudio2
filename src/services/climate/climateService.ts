/**
 * Coordenador do Serviço Meteorológico e Oceanográfico
 * Projeto: BR Quest / Brasil Interativo
 * 
 * Gerencia cache L1/L2 com TTL de 15 minutos, distribuição de eventos para a UI
 * e escalas termométricas padronizadas ECMWF.
 */

import type { ClimateTelemetryResponse } from './climateTypes';
import { fetchUpstreamTelemetry } from './openMeteoClient';
import { formatMeteoredDateTime } from '../../lib/formatters';

export * from './climateTypes';
export {
  BRAZIL_STATES_COORDINATES,
  ECMWF_TEMP_COLOR_STOPS,
  getEcmwfTempColor,
  getRainRadarColor,
  generateOfflineCalibratedClimateData,
  buildFallbackClimateTelemetry,
  MOCK_EL_NINO_INDEX,
} from './climateOfflineFallback';

const CLIMATE_LAST_FETCH_KEY = 'br_quest_climate_last_fetch_ts';
let lastClimateApiFetchTimestamp: number = (() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(CLIMATE_LAST_FETCH_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // ignore
    }
  }
  return Date.now();
})();

export function setLatestClimateFetchTimestamp(ts: number) {
  lastClimateApiFetchTimestamp = ts;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(CLIMATE_LAST_FETCH_KEY, String(ts));
    } catch {
      // ignore
    }
  }
}

export function getLatestClimateFetchTimestamp(): number {
  return lastClimateApiFetchTimestamp;
}

export function formatBrasiliaTimeDynamic(timestampOrDate?: number | Date | string): string {
  let date: Date;
  if (!timestampOrDate) {
    date = new Date(lastClimateApiFetchTimestamp);
  } else if (typeof timestampOrDate === 'number') {
    date = new Date(timestampOrDate);
  } else if (typeof timestampOrDate === 'string') {
    if (timestampOrDate.includes('T') || timestampOrDate.includes('-') || !isNaN(Date.parse(timestampOrDate))) {
      date = new Date(timestampOrDate);
    } else {
      const match = timestampOrDate.match(/(\d{2})[:h](\d{2})/);
      if (match) return `${match[1]}h${match[2]}`;
      return timestampOrDate;
    }
  } else {
    date = timestampOrDate;
  }
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour')?.value.padStart(2, '0') || '00';
  const minute = parts.find((p) => p.type === 'minute')?.value.padStart(2, '0') || '00';
  return `${hour}h${minute}`;
}

export function formatFullDayTime(dateOrTimestamp?: Date | number | string): string {
  let date: Date;
  if (!dateOrTimestamp) {
    date = new Date(lastClimateApiFetchTimestamp);
  } else if (typeof dateOrTimestamp === 'number') {
    date = new Date(dateOrTimestamp);
  } else if (typeof dateOrTimestamp === 'string' && (dateOrTimestamp.includes('T') || !isNaN(Date.parse(dateOrTimestamp)))) {
    date = new Date(dateOrTimestamp);
  } else if (dateOrTimestamp instanceof Date) {
    date = dateOrTimestamp;
  } else {
    date = new Date(lastClimateApiFetchTimestamp);
  }
  const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return `${capitalizedDay}, ${formatBrasiliaTimeDynamic(date)}`;
}

export function formatBrasiliaTimeOnly(date = new Date()): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
}

export { formatMeteoredDateTime };

type ClimateTelemetryListener = (data: ClimateTelemetryResponse) => void;
const climateTelemetryListeners: Set<ClimateTelemetryListener> = new Set();

export function onClimateTelemetryUpdate(listener: ClimateTelemetryListener): () => void {
  climateTelemetryListeners.add(listener);
  const current = getCachedClimateData();
  if (current) {
    listener(current);
  }
  return () => {
    climateTelemetryListeners.delete(listener);
  };
}

const CLIMATE_CACHE_KEY = 'br_quest_climate_cache_v2';
const CLIMATE_CACHE_TTL_MS = 15 * 60 * 1000;

interface ClimateCacheEntry {
  timestamp: number;
  data: ClimateTelemetryResponse;
}

let inMemoryClimateCache: ClimateCacheEntry | null = null;

function getCachedClimateData(): ClimateTelemetryResponse | null {
  const now = Date.now();
  if (inMemoryClimateCache && now - inMemoryClimateCache.timestamp < CLIMATE_CACHE_TTL_MS) {
    setLatestClimateFetchTimestamp(inMemoryClimateCache.timestamp);
    return inMemoryClimateCache.data;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(CLIMATE_CACHE_KEY);
      if (raw) {
        const parsed: ClimateCacheEntry = JSON.parse(raw);
        if (parsed && parsed.timestamp && now - parsed.timestamp < CLIMATE_CACHE_TTL_MS) {
          inMemoryClimateCache = parsed;
          setLatestClimateFetchTimestamp(parsed.timestamp);
          return parsed.data;
        }
      }
    } catch {
      // Ignorar erro de leitura de cache
    }
  }
  return null;
}

function saveClimateDataToCache(data: ClimateTelemetryResponse) {
  const timestamp = data.fetchedAt || Date.now();
  data.fetchedAt = timestamp;
  setLatestClimateFetchTimestamp(timestamp);
  if (!data.updatedAtH) {
    data.updatedAtH = formatBrasiliaTimeDynamic(timestamp);
  }
  const entry: ClimateCacheEntry = {
    timestamp,
    data,
  };
  inMemoryClimateCache = entry;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(CLIMATE_CACHE_KEY, JSON.stringify(entry));
    } catch {
      // Ignorar erro de localStorage
    }
  }
  climateTelemetryListeners.forEach((fn) => {
    try {
      fn(data);
    } catch (err) {
      console.error('Erro no listener de clima:', err);
    }
  });
}

export function getLatestClimateTelemetry(): ClimateTelemetryResponse | null {
  return inMemoryClimateCache?.data || getCachedClimateData();
}

export async function fetchLiveClimateTelemetry(forceRefresh = false): Promise<ClimateTelemetryResponse> {
  if (!forceRefresh) {
    const cached = getCachedClimateData();
    if (cached) {
      return cached;
    }
  }

  const data = await fetchUpstreamTelemetry(forceRefresh);
  saveClimateDataToCache(data);
  return data;
}
