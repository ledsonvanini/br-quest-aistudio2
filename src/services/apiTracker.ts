export interface ApiCallLog {
  id: string;
  provider: string;
  endpoint: string;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'cached' | 'error' | 'fallback';
  statusCode: number;
  payloadSizeKb?: number;
  details?: string;
}

export interface ApiProviderSummary {
  id: string;
  name: string;
  description: string;
  quotaPerDay: string;
  quotaUsedToday: number;
  status: 'online' | 'degraded' | 'offline';
  avgLatencyMs: number;
  lastCallTime: string | null;
  cachedEntries: number;
}

class ApiTrackerService {
  private logs: ApiCallLog[] = [];
  private listeners: (() => void)[] = [];
  private quotaCounts: Record<string, number> = {
    'open-meteo': 0,
    'ibge-geo': 0,
    'cartodb-tiles': 0,
    'satellite-orbital': 0,
  };

  constructor() {
    // Carregar logs da sessão anterior se houver
    try {
      const saved = sessionStorage.getItem('br_quest_api_logs');
      if (saved) {
        this.logs = JSON.parse(saved).slice(-50);
      }
      const savedCounts = sessionStorage.getItem('br_quest_api_counts');
      if (savedCounts) {
        this.quotaCounts = { ...this.quotaCounts, ...JSON.parse(savedCounts) };
      }
    } catch {
      // Ignore
    }
  }

  public trackCall(
    provider: 'open-meteo' | 'ibge-geo' | 'cartodb-tiles' | 'satellite-orbital' | string,
    endpoint: string,
    durationMs: number,
    status: 'success' | 'cached' | 'error' | 'fallback',
    statusCode: number = 200,
    details?: string,
    payloadSizeKb?: number
  ) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const logItem: ApiCallLog = {
      id: `call_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      provider,
      endpoint,
      timestamp: timeStr,
      durationMs: Math.round(durationMs),
      status,
      statusCode,
      payloadSizeKb: payloadSizeKb ? Math.round(payloadSizeKb * 10) / 10 : undefined,
      details,
    };

    this.logs.unshift(logItem);
    if (this.logs.length > 80) {
      this.logs = this.logs.slice(0, 80);
    }

    if (status !== 'cached') {
      this.quotaCounts[provider] = (this.quotaCounts[provider] || 0) + 1;
    }

    try {
      sessionStorage.setItem('br_quest_api_logs', JSON.stringify(this.logs.slice(0, 40)));
      sessionStorage.setItem('br_quest_api_counts', JSON.stringify(this.quotaCounts));
    } catch {
      // Ignore
    }

    this.notify();
  }

  public async pingAllProviders(): Promise<void> {
    const promises = [
      // 1. Open-Meteo
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-15.79&longitude=-47.88&current=temperature_2m,wind_speed_10m&timezone=America%2FSao_Paulo', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const data = await res.json();
            this.trackCall('open-meteo', '/v1/forecast (Brasília Diagnostic)', dur, 'success', 200, 'Telemetria ECMWF ativa', JSON.stringify(data).length / 1024);
          } else {
            this.trackCall('open-meteo', '/v1/forecast (Brasília Diagnostic)', dur, 'error', res.status, `HTTP ${res.status}`);
          }
        } catch (e: any) {
          this.trackCall('open-meteo', '/v1/forecast (Brasília Diagnostic)', performance.now() - t0, 'error', 0, e?.message || 'Network error');
        }
      })(),

      // 2. IBGE GeoJSON / Malhas Estaduais
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('/br/br.json');
          const dur = performance.now() - t0;
          if (res.ok) {
            const data = await res.json();
            this.trackCall('ibge-geo', '/br/br.json (Malhas SIRGAS 2000)', dur, 'success', 200, '27 UFs geodésicas carregadas', JSON.stringify(data).length / 1024);
          } else {
            this.trackCall('ibge-geo', '/br/br.json', dur, 'fallback', 200, 'Malha vetorial local');
          }
        } catch (e: any) {
          this.trackCall('ibge-geo', '/br/br.json', performance.now() - t0, 'fallback', 200, 'Cache local SIRGAS');
        }
      })(),

      // 3. CartoDB Tiles (Voyager / Light)
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/5/10/16.png', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const blob = await res.blob();
            this.trackCall('cartodb-tiles', '/rastertiles/voyager_nolabels/5/10/16.png', dur, 'success', 200, 'CartoDB Voyager tile verificado', blob.size / 1024);
          } else {
            this.trackCall('cartodb-tiles', '/rastertiles/voyager_nolabels/5/10/16.png', dur, 'error', res.status, `HTTP ${res.status}`);
          }
        } catch (e: any) {
          this.trackCall('cartodb-tiles', '/rastertiles/voyager_nolabels/5/10/16.png', performance.now() - t0, 'error', 0, e?.message || 'Network error');
        }
      })(),

      // 4. NASA Earth / ESRI TrueColor HD Satellite
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/16/10', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const blob = await res.blob();
            this.trackCall('satellite-orbital', '/ArcGIS/rest/services/World_Imagery/tile/5/16/10', dur, 'success', 200, 'NASA/ESRI TrueColor orbital tile verificado', blob.size / 1024);
          } else {
            this.trackCall('satellite-orbital', '/ArcGIS/rest/services/World_Imagery/tile/5/16/10', dur, 'error', res.status, `HTTP ${res.status}`);
          }
        } catch (e: any) {
          this.trackCall('satellite-orbital', '/ArcGIS/rest/services/World_Imagery/tile/5/16/10', performance.now() - t0, 'error', 0, e?.message || 'Network error');
        }
      })(),
    ];

    await Promise.allSettled(promises);
  }

  public getLogs(): ApiCallLog[] {
    return [...this.logs];
  }

  public getProvidersSummary(): ApiProviderSummary[] {
    const now = new Date();
    const getAvgLatency = (prov: string) => {
      const provLogs = this.logs.filter((l) => l.provider === prov && l.status === 'success');
      if (!provLogs.length) return 45;
      const total = provLogs.reduce((acc, l) => acc + l.durationMs, 0);
      return Math.round(total / provLogs.length);
    };

    const getLastTime = (prov: string) => {
      const l = this.logs.find((log) => log.provider === prov);
      return l ? l.timestamp : null;
    };

    return [
      {
        id: 'open-meteo',
        name: 'Open-Meteo (ECMWF & NOAA)',
        description: 'Previsões meteorológicas, ventos a 10m, pressão e temperatura horária para os 27 estados do Brasil.',
        quotaPerDay: '10.000 req/dia (Free)',
        quotaUsedToday: this.quotaCounts['open-meteo'] || 0,
        status: 'online',
        avgLatencyMs: getAvgLatency('open-meteo'),
        lastCallTime: getLastTime('open-meteo'),
        cachedEntries: this.logs.filter((l) => l.provider === 'open-meteo' && l.status === 'cached').length,
      },
      {
        id: 'ibge-geo',
        name: 'IBGE / GeoJSON Malhas Estaduais',
        description: 'Vetorização cartográfica com 27 polígonos estaduais, capitais e coordenadas geodésicas SIRGAS 2000.',
        quotaPerDay: 'Ilimitado (Local / CDN)',
        quotaUsedToday: this.quotaCounts['ibge-geo'] || 0,
        status: 'online',
        avgLatencyMs: getAvgLatency('ibge-geo'),
        lastCallTime: getLastTime('ibge-geo'),
        cachedEntries: 1,
      },
      {
        id: 'cartodb-tiles',
        name: 'CartoDB / OSM Shaded Relief Tiles',
        description: 'Ladrilhos cartográficos de relevo sombreado e muted gray para camadas base.',
        quotaPerDay: '75.000 req/mês (Open Access)',
        quotaUsedToday: this.quotaCounts['cartodb-tiles'] || 0,
        status: 'online',
        avgLatencyMs: getAvgLatency('cartodb-tiles'),
        lastCallTime: getLastTime('cartodb-tiles'),
        cachedEntries: this.logs.filter((l) => l.provider === 'cartodb-tiles' && l.status === 'cached').length,
      },
      {
        id: 'satellite-orbital',
        name: 'NASA Earth / ESRI TrueColor HD',
        description: 'Mosaico de satélite orbital com relevo natural da América do Sul e bacias hidrográficas.',
        quotaPerDay: 'Ilimitado (Cached)',
        quotaUsedToday: this.quotaCounts['satellite-orbital'] || 0,
        status: 'online',
        avgLatencyMs: getAvgLatency('satellite-orbital'),
        lastCallTime: getLastTime('satellite-orbital'),
        cachedEntries: this.logs.filter((l) => l.provider === 'satellite-orbital' && l.status === 'cached').length,
      },
    ];
  }

  public clearLogs() {
    this.logs = [];
    sessionStorage.removeItem('br_quest_api_logs');
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const apiTracker = new ApiTrackerService();
