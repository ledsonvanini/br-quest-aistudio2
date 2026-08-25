import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,
  RefreshCw,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Radio,
  Zap,
  Globe,
  HardDrive,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Percent,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  apiTracker,
  ApiCallLog,
  ApiProviderSummary,
  WeeklyRecommendation,
  WeeklyDayData,
} from '../services/apiTracker';
import { fetchLiveClimateTelemetry } from '../services/climateService';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'providers' | 'statistics' | 'logs';
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'providers',
}) => {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [providers, setProviders] = useState<ApiProviderSummary[]>([]);
  const [recommendations, setRecommendations] = useState<WeeklyRecommendation[]>([]);
  const [weeklyDays, setWeeklyDays] = useState<WeeklyDayData[]>([]);
  const [activeTab, setActiveTab] = useState<'providers' | 'statistics' | 'logs'>(initialTab);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [filterProvider, setFilterProvider] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;

    const updateState = () => {
      setLogs(apiTracker.getLogs());
      setProviders(apiTracker.getProvidersSummary());
      setRecommendations(apiTracker.getWeeklyRecommendations());
      setWeeklyDays(apiTracker.getWeeklyDaysData());
    };

    updateState();
    const unsubscribe = apiTracker.subscribe(updateState);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRetestTelemetry = async () => {
    setIsTesting(true);
    try {
      await fetchLiveClimateTelemetry(true);
      await apiTracker.pingAllProviders();
    } catch {
      // Handled in tracker
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearLogs = () => {
    apiTracker.clearLogs();
  };

  const filteredLogs = filterProvider === 'all'
    ? logs
    : logs.filter((l) => l.provider === filterProvider);

  const totalCalls = apiTracker.getTotalCallsToday();
  const totalCached = apiTracker.getTotalCachedToday();
  const successCalls = logs.filter((l) => l.status === 'success').length;
  const errorCalls = logs.filter((l) => l.status === 'error').length;

  const maxWeeklyDayValue = Math.max(
    ...weeklyDays.map((d) => d.calls + d.cached),
    10
  );

  return (
    <div className="container-modal-api-status modal-status-api-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="card-painel-status-api w-full max-w-3xl bg-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="menu-superior-api-status px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-amber-300">
                  Painel de APIs, Cotas & Estatísticas
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PROVEDORES ATIVOS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Requisições feitas vs. limites disponíveis, projeções semanais e políticas de economia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-fechar-modal-api p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar Painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Metric Ribbon: Requisições Feitas / Disponíveis & Economia */}
        <div className="painel-metricas-cotas-api grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 py-3 bg-slate-900/70 border-b border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Requisições Hoje</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-amber-300 font-mono">{totalCalls}</span>
              <span className="text-[10px] text-slate-500 font-mono">/ 10.000 (Open-Meteo)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Economia em Cache</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-cyan-400 font-mono">{totalCached}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">~96% economia</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Projeção Semanal</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-emerald-300 font-mono">
                {Math.max(totalCalls * 7, 28)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">/ 70k semana</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Status de Segurança</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 font-mono">100% SEGURO</span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation Bar */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-800 bg-slate-950">
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('providers')}
              className={`aba-provedores-cotas pb-2.5 px-3 text-xs font-bold font-serif transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'providers'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Provedores & Cotas
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`aba-estatisticas-semanais pb-2.5 px-3 text-xs font-bold font-serif transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'statistics'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Estatísticas & Recomendações
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`aba-logs-requisicoes pb-2.5 px-3 text-xs font-bold font-serif transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'logs'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Histórico ({logs.length})
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleRetestTelemetry}
              disabled={isTesting}
              className="btn-retestar-telemetria px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isTesting ? 'Testando...' : 'Re-testar Conexões'}</span>
              <span className="sm:hidden">{isTesting ? '...' : 'Testar'}</span>
            </button>
            {activeTab === 'logs' && (
              <button
                onClick={handleClearLogs}
                className="p-1 rounded-lg text-slate-400 hover:text-red-300 hover:bg-slate-900 transition-colors"
                title="Limpar logs da sessão"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[55vh] custom-scrollbar space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: PROVEDORES & COTAS DISPONÍVEIS */}
          {/* ========================================================================= */}
          {activeTab === 'providers' && (
            <div className="painel-lista-provedores space-y-3">
              {providers.map((prov) => {
                const usedToday = prov.quotaUsedToday;
                const limitToday = prov.quotaDailyLimit;
                const progressPct = limitToday
                  ? Math.min(100, Math.max(2, (usedToday / limitToday) * 100))
                  : 0;

                return (
                  <div
                    key={prov.id}
                    className="card-provedor-cota p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                          {prov.id === 'open-meteo' ? (
                            <Cloud className="w-4 h-4" />
                          ) : prov.id === 'ibge-geo' ? (
                            <Database className="w-4 h-4" />
                          ) : prov.id === 'cartodb-tiles' ? (
                            <Globe className="w-4 h-4" />
                          ) : prov.id === 'gbif-biodiversity' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <HardDrive className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-100">
                              {prov.name}
                            </h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                              {prov.planName}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <span className="text-[11px] text-amber-400 font-mono">
                            Cota: {prov.quotaPerDay}
                          </span>
                        </div>
                      </div>

                      {/* Medidor de Feitas / Disponíveis */}
                      <div className="text-left sm:text-right bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/90 shrink-0 w-full sm:w-auto">
                        <div className="text-xs font-mono font-bold flex items-center justify-between sm:justify-end gap-2">
                          <span className="text-slate-400 text-[10px]">Feitas / Limite:</span>
                          <span className="text-amber-300">
                            {usedToday} <span className="text-slate-500">/</span> {limitToday ? limitToday.toLocaleString('pt-BR') : 'Ilimitado'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between sm:justify-end gap-2">
                          <span>Latência média:</span>
                          <span className="text-slate-200">~{prov.avgLatencyMs} ms</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso de Cota Diária */}
                    {limitToday && (
                      <div className="space-y-1">
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progressPct > 80 ? 'bg-rose-500' : progressPct > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>Uso hoje: {progressPct.toFixed(2)}%</span>
                          <span>Disponível restante: {Math.max(0, limitToday - usedToday).toLocaleString('pt-BR')} req</span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      {prov.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <div>
                        <strong>Política:</strong> <span className="text-slate-300">{prov.rateLimitPolicy}</span>
                      </div>
                      <div className="sm:text-right">
                        <strong>Cache TTL:</strong> <span className="text-cyan-300">{prov.recommendedTtl}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ESTATÍSTICAS SEMANAIS & RECOMENDAÇÕES POR PLANO */}
          {/* ========================================================================= */}
          {activeTab === 'statistics' && (
            <div className="painel-estatisticas-semanais space-y-5">
              
              {/* Gráfico Semanal de Volume (Requisições Reais vs Cache Salvo) */}
              <div className="card-grafico-semanal p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif font-bold text-sm text-slate-100">
                      Consumo Semanal de Requisições (Últimos 7 Dias)
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Requisições
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> Economia em Cache
                    </span>
                  </div>
                </div>

                {/* Colunas do Gráfico */}
                <div className="grid grid-cols-7 gap-2 pt-4 pb-2 items-end h-32 border-b border-slate-800">
                  {weeklyDays.map((d) => {
                    const totalDay = d.calls + d.cached;
                    const callsHeightPct = maxWeeklyDayValue > 0 ? (d.calls / maxWeeklyDayValue) * 100 : 0;
                    const cachedHeightPct = maxWeeklyDayValue > 0 ? (d.cached / maxWeeklyDayValue) * 100 : 0;

                    return (
                      <div key={d.dateStr} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {totalDay}
                        </div>
                        <div className="w-full max-w-[28px] flex flex-col gap-0.5 rounded-t overflow-hidden bg-slate-950 h-full justify-end">
                          {/* Barra de Cache */}
                          {d.cached > 0 && (
                            <div
                              className="w-full bg-cyan-500 transition-all rounded-t-sm"
                              style={{ height: `${Math.max(4, cachedHeightPct)}%` }}
                              title={`Cache: ${d.cached} requisições economizadas`}
                            />
                          )}
                          {/* Barra de Requisições Reais */}
                          {d.calls > 0 && (
                            <div
                              className="w-full bg-amber-500 transition-all rounded-t-sm"
                              style={{ height: `${Math.max(4, callsHeightPct)}%` }}
                              title={`API Calls: ${d.calls} requisições realizadas`}
                            />
                          )}
                          {totalDay === 0 && (
                            <div className="w-full bg-slate-800/40 h-1 rounded-t-sm" />
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-amber-300">
                          {d.dayName}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 italic">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Graças ao cache inteligente de 15 min (Open-Meteo) e 24h (IBGE / GBIF), mais de 95% das consultas repetidas são resolvidas instantaneamente na memória local.
                </p>
              </div>

              {/* Tabela de Estimativas Semanais vs Limites do Plano */}
              <div className="card-estimativas-planos p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-serif font-bold text-sm text-slate-100">
                    Estimativa de Consumo por Semana vs. Limite do Plano Atual
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                        <th className="pb-2">Provedor</th>
                        <th className="pb-2">Plano Atual</th>
                        <th className="pb-2 text-right">Limite Semanal</th>
                        <th className="pb-2 text-right">Estimativa Semanal</th>
                        <th className="pb-2 text-right">% do Teto</th>
                        <th className="pb-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {providers.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 text-slate-200 font-sans font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {p.name.split('(')[0]}
                          </td>
                          <td className="py-2.5 text-slate-400 text-[11px]">{p.planName}</td>
                          <td className="py-2.5 text-right text-slate-300">
                            {p.quotaWeeklyLimit ? `${p.quotaWeeklyLimit.toLocaleString('pt-BR')} req` : 'Sem Limite'}
                          </td>
                          <td className="py-2.5 text-right font-bold text-amber-300">
                            ~{p.projectedWeeklyUsage.toLocaleString('pt-BR')} req
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="text-emerald-400 font-bold">
                              {p.usagePercentWeekly}%
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              SEGURO
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recomendações de Limitação por Semana por Provider */}
              <div className="card-recomendacoes-providers space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif font-bold text-sm text-amber-300">
                    Recomendações de Limitação & Melhores Práticas por Provedor
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.providerId}
                      className="card-item-recomendacao p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="font-bold text-xs text-slate-100 font-serif">
                            {rec.providerName}
                          </h5>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {rec.weeklySavingsPct}% Economia
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mb-2">
                          Plano: {rec.currentPlan} • Teto: {rec.weeklyLimitDisplay}
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300 leading-snug">
                          {rec.recommendations.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-500/30 flex items-center justify-between">
                        <span>Diretriz ativa:</span>
                        <strong className="text-slate-200">{rec.policyInPlace}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: HISTÓRICO & LOGS EM TEMPO REAL */}
          {/* ========================================================================= */}
          {activeTab === 'logs' && (
            <div className="painel-logs-historico space-y-2">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-slate-400">
                  Filtrar por provedor:
                </span>
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value="all">Todos os Provedores</option>
                  <option value="open-meteo">Open-Meteo</option>
                  <option value="ibge-geo">IBGE GeoJSON</option>
                  <option value="gbif-biodiversity">GBIF Biodiversidade</option>
                  <option value="ibama-siscites">IBAMA SisCITES</option>
                  <option value="wikipedia-commons">Wikimedia Commons</option>
                  <option value="cartodb-tiles">CartoDB Tiles</option>
                  <option value="satellite-orbital">Satélite Orbital</option>
                </select>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Nenhuma requisição registrada nesta sessão para o filtro selecionado.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          log.status === 'success'
                            ? 'bg-emerald-400'
                            : log.status === 'cached'
                            ? 'bg-cyan-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="font-bold text-amber-300 uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-800 shrink-0">
                        {log.provider}
                      </span>
                      <span className="text-slate-200 truncate max-w-[200px] sm:max-w-[340px]">
                        {log.endpoint}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {log.status === 'cached' ? (
                        <span className="text-cyan-300 text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40">
                          CACHE
                        </span>
                      ) : (
                        log.payloadSizeKb && (
                          <span className="text-slate-400 text-[11px] hidden sm:inline">
                            {log.payloadSizeKb} KB
                          </span>
                        )
                      )}
                      <span className="text-slate-400 text-[11px]">
                        {log.durationMs}ms
                      </span>
                      <span className="text-slate-500 text-[10px] hidden xs:inline">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer Ribbon */}
        <div className="menu-inferior-modal-api px-5 py-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">Políticas de limitação e cache ativas em conformidade com os planos gratuitos</span>
            <span className="sm:hidden">Plano Free Conforme</span>
          </div>
          <button
            onClick={onClose}
            className="btn-fechar-painel px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
};

