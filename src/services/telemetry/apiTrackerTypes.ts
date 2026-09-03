/**
 * Tipos e Estruturas de Telemetria de APIs
 */

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
  quotaDailyLimit: number | null;
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
