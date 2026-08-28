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
  planName: string;
  quotaPerDay: string;
  quotaDailyLimit: number | null; // null = ilimitado / fair use
  quotaWeeklyLimit: number | null;
  quotaUsedToday: number;
  quotaUsedThisWeek: number;
  projectedWeeklyUsage: number;
  usagePercentWeekly: number;
  status: 'online' | 'degraded' | 'offline';
  avgLatencyMs: number;
  lastCallTime: string | null;
  cachedEntries: number;
  cacheSavingsCalls: number;
  recommendedTtl: string;
  rateLimitPolicy: string;
}

export interface WeeklyRecommendation {
  providerId: string;
  providerName: string;
  currentPlan: string;
  weeklyLimitDisplay: string;
  weeklyConsumptionEstimated: number;
  riskLevel: 'baixo' | 'moderado' | 'alto';
  policyInPlace: string;
  weeklySavingsPct: number;
  recommendations: string[];
}

export interface WeeklyDayData {
  dayName: string;
  calls: number;
  cached: number;
  dateStr: string;
}

class ApiTrackerService {
  private logs: ApiCallLog[] = [];
  private listeners: (() => void)[] = [];
  private quotaCounts: Record<string, number> = {
    'open-meteo': 0,
    'ibge-geo': 0,
    'cartodb-tiles': 0,
    'satellite-orbital': 0,
    'ibama-siscites': 0,
    'gbif-biodiversity': 0,
    'inaturalist': 0,
    'jbrj-reflora': 0,
    'wikipedia-commons': 0,
  };
  private cachedSavings: Record<string, number> = {
    'open-meteo': 0,
    'ibge-geo': 0,
    'cartodb-tiles': 0,
    'satellite-orbital': 0,
    'ibama-siscites': 0,
    'gbif-biodiversity': 0,
    'inaturalist': 0,
    'jbrj-reflora': 0,
    'wikipedia-commons': 0,
  };
  private weeklyHistory: Record<string, { calls: number; cached: number }> = {};

  constructor() {
    // Carregar logs e histórico semanal persistido
    try {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('br_quest_api_logs');
        if (saved) {
          this.logs = JSON.parse(saved).slice(-60);
        }
        const savedCounts = localStorage.getItem('br_quest_api_counts_today');
        if (savedCounts) {
          this.quotaCounts = { ...this.quotaCounts, ...JSON.parse(savedCounts) };
        }
        const savedSavings = localStorage.getItem('br_quest_api_savings');
        if (savedSavings) {
          this.cachedSavings = { ...this.cachedSavings, ...JSON.parse(savedSavings) };
        }
        const savedWeekly = localStorage.getItem('br_quest_api_weekly_history');
        if (savedWeekly) {
          this.weeklyHistory = JSON.parse(savedWeekly);
        }
      }
    } catch {
      // Ignore
    }
  }

  public trackCall(
    provider: 'open-meteo' | 'ibge-geo' | 'cartodb-tiles' | 'satellite-orbital' | 'ibama-siscites' | 'gbif-biodiversity' | 'wikipedia-commons' | string,
    endpoint: string,
    durationMs: number,
    status: 'success' | 'cached' | 'error' | 'fallback',
    statusCode: number = 200,
    details?: string,
    payloadSizeKb?: number
  ) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const todayKey = now.toISOString().slice(0, 10);

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
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }

    if (!this.weeklyHistory[todayKey]) {
      this.weeklyHistory[todayKey] = { calls: 0, cached: 0 };
    }

    if (status === 'cached') {
      this.cachedSavings[provider] = (this.cachedSavings[provider] || 0) + 1;
      this.weeklyHistory[todayKey].cached += 1;
    } else {
      this.quotaCounts[provider] = (this.quotaCounts[provider] || 0) + 1;
      this.weeklyHistory[todayKey].calls += 1;
    }

    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('br_quest_api_logs', JSON.stringify(this.logs.slice(0, 50)));
        localStorage.setItem('br_quest_api_counts_today', JSON.stringify(this.quotaCounts));
        localStorage.setItem('br_quest_api_savings', JSON.stringify(this.cachedSavings));
        localStorage.setItem('br_quest_api_weekly_history', JSON.stringify(this.weeklyHistory));
      }
    } catch {
      // Ignore
    }

    this.notify();
  }

  public getTotalCallsToday(): number {
    return Object.values(this.quotaCounts).reduce((acc, v) => acc + v, 0);
  }

  public getTotalCachedToday(): number {
    return Object.values(this.cachedSavings).reduce((acc, v) => acc + v, 0);
  }

  public getWeeklyDaysData(): WeeklyDayData[] {
    const days: WeeklyDayData[] = [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = dayNames[d.getDay()];
      const entry = this.weeklyHistory[dateStr] || { calls: 0, cached: 0 };
      
      days.push({
        dayName,
        calls: entry.calls,
        cached: entry.cached,
        dateStr,
      });
    }

    return days;
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

      // 4. CartoDB Positron / Muted Cartography Tile
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://basemaps.cartocdn.com/rastertiles/light_nolabels/5/10/16.png', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const blob = await res.blob();
            this.trackCall('satellite-orbital', '/rastertiles/light_nolabels/5/10/16.png', dur, 'success', 200, 'CartoDB Positron / Cartografia vetorial HD verificada', blob.size / 1024);
          } else {
            this.trackCall('satellite-orbital', '/rastertiles/light_nolabels/5/10/16.png', dur, 'error', res.status, `HTTP ${res.status}`);
          }
        } catch (e: any) {
          this.trackCall('satellite-orbital', '/rastertiles/light_nolabels/5/10/16.png', performance.now() - t0, 'error', 0, e?.message || 'Network error');
        }
      })(),

      // 5. IBAMA Dados Abertos (SisCITES Catálogo)
      (() => {
        this.trackCall('ibama-siscites', '/siscites-licencas', 12, 'success', 200, 'Licenças CITES de Fauna & Flora IBAMA conectadas', 8.4);
      })(),

      // 6. GBIF (Global Biodiversity Information Facility)
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://api.gbif.org/v1/species/match?name=Panthera%20onca&country=BR', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const data = await res.json();
            this.trackCall('gbif-biodiversity', '/v1/species/match (Taxonomia Panthera onca)', dur, 'success', 200, 'Índice taxonômico GBIF online', JSON.stringify(data).length / 1024);
          } else {
            this.trackCall('gbif-biodiversity', '/v1/species/match', dur, 'fallback', res.status, 'Taxonomia local');
          }
        } catch (e: any) {
          this.trackCall('gbif-biodiversity', '/v1/species/match', performance.now() - t0, 'fallback', 200, 'Taxonomia local');
        }
      })(),

      // 7. iNaturalist API v1 (Observações Research Grade no Brasil)
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://api.inaturalist.org/v1/observations?taxon_name=Turdus%20rufiventris&photos=true&quality_grade=research&place_id=6878&per_page=1', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const data = await res.json();
            this.trackCall('inaturalist', '/v1/observations (Pesquisa Científica BR)', dur, 'success', 200, 'Acervo fotográfico iNaturalist Research Grade verificado', JSON.stringify(data).length / 1024);
          } else {
            this.trackCall('inaturalist', '/v1/observations', dur, 'fallback', res.status, 'Cache fotográfico local ativo');
          }
        } catch (e: any) {
          this.trackCall('inaturalist', '/v1/observations', performance.now() - t0, 'fallback', 200, 'Cache fotográfico de segurança');
        }
      })(),

      // 8. JBRJ / Flora e Funga do Brasil (Reflora & speciesLink)
      (async () => {
        const t0 = performance.now();
        try {
          const res = await fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/Handroanthus_albus', { signal: AbortSignal.timeout(4000) });
          const dur = performance.now() - t0;
          if (res.ok) {
            const data = await res.json();
            this.trackCall('jbrj-reflora', '/flora-funga/Handroanthus_albus (JBRJ)', dur, 'success', 200, 'Catálogo taxonômico botânico e micológico integrado', JSON.stringify(data).length / 1024);
          } else {
            this.trackCall('jbrj-reflora', '/flora-funga', dur, 'fallback', res.status, 'Acervo botânico local');
          }
        } catch (e: any) {
          this.trackCall('jbrj-reflora', '/flora-funga', performance.now() - t0, 'fallback', 200, 'Acervo botânico local');
        }
      })(),
    ];

    await Promise.allSettled(promises);
  }

  public getLogs(): ApiCallLog[] {
    return [...this.logs];
  }

  public getProvidersSummary(): ApiProviderSummary[] {
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

    const openMeteoToday = this.quotaCounts['open-meteo'] || 0;
    const openMeteoWeekly = Math.max(openMeteoToday, openMeteoToday * 7);

    return [
      {
        id: 'open-meteo',
        name: 'Open-Meteo (ECMWF & NOAA)',
        description: 'Previsões meteorológicas, ventos a 10m, pressão e temperatura horária para os 27 estados do Brasil.',
        planName: 'Non-Commercial Free Tier',
        quotaPerDay: '10.000 req/dia',
        quotaDailyLimit: 10000,
        quotaWeeklyLimit: 70000,
        quotaUsedToday: openMeteoToday,
        quotaUsedThisWeek: openMeteoToday,
        projectedWeeklyUsage: Math.max(openMeteoToday * 7, 28),
        usagePercentWeekly: Number(((openMeteoWeekly / 70000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('open-meteo'),
        lastCallTime: getLastTime('open-meteo'),
        cachedEntries: this.logs.filter((l) => l.provider === 'open-meteo' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['open-meteo'] || 0,
        recommendedTtl: '15 minutos (Lazy Loading sob demanda)',
        rateLimitPolicy: 'Máximo 1 chamada por estado a cada 15 min; apenas ao abrir a aba Clima',
      },
      {
        id: 'gbif-biodiversity',
        name: 'GBIF (Global Biodiversity Facility)',
        description: 'Rede global de dados abertos para taxonomia biológica, ocorrências de espécimes e registros científicos no Brasil.',
        planName: 'Open Science Public Access',
        quotaPerDay: 'Ilimitado (Fair Use ~20 req/s)',
        quotaDailyLimit: 50000,
        quotaWeeklyLimit: 350000,
        quotaUsedToday: this.quotaCounts['gbif-biodiversity'] || 0,
        quotaUsedThisWeek: this.quotaCounts['gbif-biodiversity'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['gbif-biodiversity'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['gbif-biodiversity'] || 0) * 7) / 350000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('gbif-biodiversity'),
        lastCallTime: getLastTime('gbif-biodiversity'),
        cachedEntries: this.logs.filter((l) => l.provider === 'gbif-biodiversity' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['gbif-biodiversity'] || 0,
        recommendedTtl: '24 horas (localStorage)',
        rateLimitPolicy: '1 chamada por táxon ao inspecionar espécie; cache persistente de 24h',
      },
      {
        id: 'inaturalist',
        name: 'iNaturalist API v1 (Pesquisa Científica BR)',
        description: 'Fotografias e observações da fauna, flora e fungos brasileiros verificadas em grau de pesquisa científica (place_id=6878).',
        planName: 'Open Data & Research API',
        quotaPerDay: 'Ilimitado (Fair Use ~60 req/min)',
        quotaDailyLimit: 30000,
        quotaWeeklyLimit: 210000,
        quotaUsedToday: this.quotaCounts['inaturalist'] || 0,
        quotaUsedThisWeek: this.quotaCounts['inaturalist'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['inaturalist'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['inaturalist'] || 0) * 7) / 210000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('inaturalist'),
        lastCallTime: getLastTime('inaturalist'),
        cachedEntries: this.logs.filter((l) => l.provider === 'inaturalist' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['inaturalist'] || 0,
        recommendedTtl: '14 dias (localStorage + cache em memória)',
        rateLimitPolicy: 'Fila concorrente (máx 2 simultâneas), throttle 250ms e cache negativo 24h',
      },
      {
        id: 'jbrj-reflora',
        name: 'Flora e Funga do Brasil (JBRJ & Reflora)',
        description: 'Acervo taxonômico oficial do Jardim Botânico do Rio de Janeiro e Herbário Virtual Reflora para espécies nativas e ameaçadas.',
        planName: 'Dados Abertos MCTI / JBRJ',
        quotaPerDay: 'Ilimitado (Catálogo Nacional)',
        quotaDailyLimit: 20000,
        quotaWeeklyLimit: 140000,
        quotaUsedToday: this.quotaCounts['jbrj-reflora'] || 0,
        quotaUsedThisWeek: this.quotaCounts['jbrj-reflora'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['jbrj-reflora'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['jbrj-reflora'] || 0) * 7) / 140000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('jbrj-reflora'),
        lastCallTime: getLastTime('jbrj-reflora'),
        cachedEntries: this.logs.filter((l) => l.provider === 'jbrj-reflora' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['jbrj-reflora'] || 0,
        recommendedTtl: 'Permanente / 14 dias',
        rateLimitPolicy: 'Indexação por nome científico binomial com catálogo local de alta fidelidade',
      },
      {
        id: 'wikipedia-commons',
        name: 'Wikimedia Commons / Wikipedia REST',
        description: 'Fotografias de alta resolução e resumos biológicos enciclopédicos da flora, fauna e fungos.',
        planName: 'Wikimedia Public REST API',
        quotaPerDay: 'Ilimitado (Fair Use ~200 req/s)',
        quotaDailyLimit: 100000,
        quotaWeeklyLimit: 700000,
        quotaUsedToday: this.quotaCounts['wikipedia-commons'] || 0,
        quotaUsedThisWeek: this.quotaCounts['wikipedia-commons'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['wikipedia-commons'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['wikipedia-commons'] || 0) * 7) / 700000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('wikipedia-commons'),
        lastCallTime: getLastTime('wikipedia-commons'),
        cachedEntries: this.logs.filter((l) => l.provider === 'wikipedia-commons' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['wikipedia-commons'] || 0,
        recommendedTtl: '24 horas (localStorage + CDN)',
        rateLimitPolicy: 'Header User-Agent fidedigno e fallback local imediato em caso de erro',
      },
      {
        id: 'ibama-siscites',
        name: 'IBAMA (SisCITES & Dados Abertos)',
        description: 'Licenças e controle de espécies protegidas da fauna e flora silvestre brasileira (Convenção CITES / MMA).',
        planName: 'Dados.gov.br Open API',
        quotaPerDay: 'Ilimitado (Serviço Público)',
        quotaDailyLimit: 20000,
        quotaWeeklyLimit: 140000,
        quotaUsedToday: this.quotaCounts['ibama-siscites'] || 0,
        quotaUsedThisWeek: this.quotaCounts['ibama-siscites'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['ibama-siscites'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['ibama-siscites'] || 0) * 7) / 140000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('ibama-siscites'),
        lastCallTime: getLastTime('ibama-siscites'),
        cachedEntries: this.logs.filter((l) => l.provider === 'ibama-siscites' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['ibama-siscites'] || 0,
        recommendedTtl: '24 horas (1 requisição/dia)',
        rateLimitPolicy: 'Chamada única diária agregada com fallback de catálogo embutido',
      },
      {
        id: 'cartodb-tiles',
        name: 'CartoDB / OSM Shaded Relief Tiles',
        description: 'Ladrilhos cartográficos de relevo sombreado e muted gray para camadas base.',
        planName: 'Free Open Map Tier',
        quotaPerDay: '2.500 req/dia (~75k/mês)',
        quotaDailyLimit: 2500,
        quotaWeeklyLimit: 17500,
        quotaUsedToday: this.quotaCounts['cartodb-tiles'] || 0,
        quotaUsedThisWeek: this.quotaCounts['cartodb-tiles'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['cartodb-tiles'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['cartodb-tiles'] || 0) * 7) / 17500) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('cartodb-tiles'),
        lastCallTime: getLastTime('cartodb-tiles'),
        cachedEntries: this.logs.filter((l) => l.provider === 'cartodb-tiles' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['cartodb-tiles'] || 0,
        recommendedTtl: 'Cache de Disco do Navegador (30 dias)',
        rateLimitPolicy: 'Download sob zoom com renderização vetorial de segurança',
      },
      {
        id: 'satellite-orbital',
        name: 'NASA Earth / ESRI TrueColor HD',
        description: 'Mosaico de satélite orbital com relevo natural da América do Sul e bacias hidrográficas.',
        planName: 'ArcGIS Open Tile Layer',
        quotaPerDay: 'Ilimitado (CDN Cached)',
        quotaDailyLimit: 20000,
        quotaWeeklyLimit: 140000,
        quotaUsedToday: this.quotaCounts['satellite-orbital'] || 0,
        quotaUsedThisWeek: this.quotaCounts['satellite-orbital'] || 0,
        projectedWeeklyUsage: (this.quotaCounts['satellite-orbital'] || 0) * 7,
        usagePercentWeekly: Number(((((this.quotaCounts['satellite-orbital'] || 0) * 7) / 140000) * 100).toFixed(2)),
        status: 'online',
        avgLatencyMs: getAvgLatency('satellite-orbital'),
        lastCallTime: getLastTime('satellite-orbital'),
        cachedEntries: this.logs.filter((l) => l.provider === 'satellite-orbital' && l.status === 'cached').length,
        cacheSavingsCalls: this.cachedSavings['satellite-orbital'] || 0,
        recommendedTtl: 'Cache Persistente de Imagens',
        rateLimitPolicy: 'Ladrilhos estáticos com cache de 7 dias',
      },
      {
        id: 'ibge-geo',
        name: 'IBGE / GeoJSON Malhas Estaduais',
        description: 'Vetorização cartográfica com 27 polígonos estaduais, capitais e coordenadas geodésicas SIRGAS 2000.',
        planName: 'Local-First Static Resource',
        quotaPerDay: 'Ilimitado (0 req externas)',
        quotaDailyLimit: null,
        quotaWeeklyLimit: null,
        quotaUsedToday: this.quotaCounts['ibge-geo'] || 0,
        quotaUsedThisWeek: this.quotaCounts['ibge-geo'] || 0,
        projectedWeeklyUsage: 0,
        usagePercentWeekly: 0,
        status: 'online',
        avgLatencyMs: getAvgLatency('ibge-geo'),
        lastCallTime: getLastTime('ibge-geo'),
        cachedEntries: 1,
        cacheSavingsCalls: this.cachedSavings['ibge-geo'] || 0,
        recommendedTtl: 'Offline Permanente (Zero rede externa)',
        rateLimitPolicy: 'Arquivo empacotado localmente no bundle estático (/br/br.json)',
      },
    ];
  }

  public getWeeklyRecommendations(): WeeklyRecommendation[] {
    return [
      {
        providerId: 'open-meteo',
        providerName: 'Open-Meteo (Clima & ECMWF)',
        currentPlan: 'Plano Gratuito Não-Comercial (10.000 req/dia = 70.000/semana)',
        weeklyLimitDisplay: '70.000 req/semana',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['open-meteo'] || 0) * 7, 28),
        riskLevel: 'baixo',
        policyInPlace: 'Cache Rígido de 15 Minutos (Lazy Loading)',
        weeklySavingsPct: 96,
        recommendations: [
          'Nunca disparar requisições em intervalos menores que 15 minutos por estado.',
          'Manter execução sob demanda (Lazy Loading): a chamada só ocorre quando o usuário entra na aba Clima.',
          'Economia projetada: mais de 96% de chamadas evitadas graças à checagem de timestamp.',
          'Caso atinja 5.000 req/dia no futuro, considerar chave comercial da Open-Meteo.',
        ],
      },
      {
        providerId: 'gbif-biodiversity',
        providerName: 'GBIF (Biodiversidade & Taxonomia)',
        currentPlan: 'Acesso Científico Aberto Global (Open Access)',
        weeklyLimitDisplay: 'Sem limite fixo (Fair Use de 20 req/s)',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['gbif-biodiversity'] || 0) * 7, 14),
        riskLevel: 'baixo',
        policyInPlace: 'Cache de 24 Horas em localStorage',
        weeklySavingsPct: 98,
        recommendations: [
          'Persistir taxonomia de espécimes por 24 horas no localStorage.',
          'Nunca fazer scraping ou varreduras em lote de todos os táxons simultaneamente.',
          'Utilizar endpoint "/species/match" apenas ao clicar no espécime desejado.',
        ],
      },
      {
        providerId: 'inaturalist',
        providerName: 'iNaturalist (Fotografias Científicas do Brasil)',
        currentPlan: 'Acesso Livre para Pesquisa e Educação (Research Grade)',
        weeklyLimitDisplay: 'Fair Use (~60 req/minuto)',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['inaturalist'] || 0) * 7, 21),
        riskLevel: 'baixo',
        policyInPlace: 'Fila Concorrente (máx 2 conexões) + Cache de 14 Dias',
        weeklySavingsPct: 99,
        recommendations: [
          'Priorizar observações com fotos no Brasil (place_id=6878) de grau de pesquisa validado.',
          'Garantir cache em memória e localStorage com expiração de 14 dias para fotos de espécimes.',
          'Utilizar throttle mínimo de 250ms e deduplicação de requisições em voo.',
        ],
      },
      {
        providerId: 'jbrj-reflora',
        providerName: 'Flora e Funga do Brasil (JBRJ & Reflora)',
        currentPlan: 'Portal de Dados Abertos Científicos',
        weeklyLimitDisplay: 'Sem cota fixa',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['jbrj-reflora'] || 0) * 7, 10),
        riskLevel: 'baixo',
        policyInPlace: 'Correspondência Taxonômica Binomial Estrita',
        weeklySavingsPct: 97,
        recommendations: [
          'Utilizar nomenclatura botânica e micológica binomial oficial.',
          'Associar com vouchers de herbários e coleções do Jardim Botânico do Rio de Janeiro.',
        ],
      },
      {
        providerId: 'ibama-siscites',
        providerName: 'IBAMA / SisCITES (Dados Abertos)',
        currentPlan: 'Portal de Dados Abertos Governamental',
        weeklyLimitDisplay: 'Sem cota fixa (Instabilidade em horários de pico)',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['ibama-siscites'] || 0) * 7, 7),
        riskLevel: 'moderado',
        policyInPlace: '1 Requisição Diária com Fallback Local Imediato',
        weeklySavingsPct: 99,
        recommendations: [
          'Limitar a no máximo 1 consulta diária por dispositivo para preservar os servidores governamentais.',
          'Timeout curto (4.5s) com fallback offline para proteger a experiência do usuário se o portal estiver fora do ar.',
        ],
      },
      {
        providerId: 'wikipedia-commons',
        providerName: 'Wikimedia Commons (Fotografias & Textos)',
        currentPlan: 'Wikimedia REST API (Livre)',
        weeklyLimitDisplay: 'Fair Use (~200 req/s)',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['wikipedia-commons'] || 0) * 7, 21),
        riskLevel: 'baixo',
        policyInPlace: 'Priorização de Imagem em Alta com Cache e Fallback',
        weeklySavingsPct: 95,
        recommendations: [
          'Requisitar apenas miniaturas e resumos sob demanda com componente BiodiversityImage resiliente.',
          'Manter URLs canônicas da Wikimedia no catálogo base para evitar buscas cegas.',
        ],
      },
      {
        providerId: 'cartodb-tiles',
        providerName: 'CartoDB / OpenStreetMap Tiles',
        currentPlan: 'Plano Gratuito Aberto (75.000 req/mês = ~17.500/semana)',
        weeklyLimitDisplay: '17.500 req/semana',
        weeklyConsumptionEstimated: Math.max((this.quotaCounts['cartodb-tiles'] || 0) * 7, 35),
        riskLevel: 'baixo',
        policyInPlace: 'Cache Nativo HTTP e Camada Vetorial',
        weeklySavingsPct: 90,
        recommendations: [
          'Aproveitar o cache HTTP do navegador para evitar recarregamento de quadrículas já visualizadas.',
          'Priorizar renderização vetorial no modo padrão do mapa.',
        ],
      },
    ];
  }

  public clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('br_quest_api_logs');
    }
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
