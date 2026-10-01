/**
 * Hook de Sincronização de Telemetria Climática e Contadores de API
 * Projeto: BR Quest
 */

import { useState, useEffect } from 'react';
import {
  fetchLiveClimateTelemetry,
  onClimateTelemetryUpdate,
  getLatestClimateFetchTimestamp,
} from '../services/climateService';
import { apiTracker } from '../services/apiTracker';

export interface AppTelemetryState {
  climateTelemetry: {
    avgTempBrazil: number;
    maxTempState: { stateId: string; temp: number };
    minTempState: { stateId: string; temp: number };
    updatedAtH?: string;
    dateTimeFormatted?: string;
  };
  apiCallsCount: number;
  latestClimateFetchTs: number;
  refetchTelemetry: () => Promise<void>;
}

export function useAppTelemetrySync(): AppTelemetryState {
  const [climateTelemetry, setClimateTelemetry] = useState<{
    avgTempBrazil: number;
    maxTempState: { stateId: string; temp: number };
    minTempState: { stateId: string; temp: number };
    updatedAtH?: string;
    dateTimeFormatted?: string;
  }>({
    avgTempBrazil: 27.4,
    maxTempState: { stateId: 'MT', temp: 34.2 },
    minTempState: { stateId: 'RS', temp: 18.5 },
  });

  const [apiCallsCount, setApiCallsCount] = useState<number>(() => apiTracker.getLogs().length);
  const [latestClimateFetchTs, setLatestClimateFetchTs] = useState<number>(getLatestClimateFetchTimestamp());

  useEffect(() => {
    // 1. Busca inicial
    fetchLiveClimateTelemetry(false).then((data) => {
      setClimateTelemetry({
        avgTempBrazil: data.avgTempBrazil,
        maxTempState: data.maxTempState,
        minTempState: data.minTempState,
        updatedAtH: data.updatedAtH,
        dateTimeFormatted: data.dateTimeFormatted,
      });
      setLatestClimateFetchTs(getLatestClimateFetchTimestamp());
    });

    // 2. Subscrição para atualizações climáticas
    const unsubClimate = onClimateTelemetryUpdate((data) => {
      setClimateTelemetry({
        avgTempBrazil: data.avgTempBrazil,
        maxTempState: data.maxTempState,
        minTempState: data.minTempState,
        updatedAtH: data.updatedAtH,
        dateTimeFormatted: data.dateTimeFormatted,
      });
      setLatestClimateFetchTs(getLatestClimateFetchTimestamp());
    });

    // 3. Subscrição para métricas da API
    const unsubTracker = apiTracker.subscribe(() => {
      setApiCallsCount(apiTracker.getLogs().length);
    });

    return () => {
      unsubClimate();
      unsubTracker();
    };
  }, []);

  const refetchTelemetry = async () => {
    const data = await fetchLiveClimateTelemetry(true);
    setClimateTelemetry({
      avgTempBrazil: data.avgTempBrazil,
      maxTempState: data.maxTempState,
      minTempState: data.minTempState,
      updatedAtH: data.updatedAtH,
      dateTimeFormatted: data.dateTimeFormatted,
    });
    setLatestClimateFetchTs(getLatestClimateFetchTimestamp());
  };

  return {
    climateTelemetry,
    apiCallsCount,
    latestClimateFetchTs,
    refetchTelemetry,
  };
}
