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
} from 'lucide-react';
import { apiTracker, ApiCallLog, ApiProviderSummary } from '../services/apiTracker';
import { fetchLiveClimateTelemetry } from '../services/climateService';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [providers, setProviders] = useState<ApiProviderSummary[]>([]);
  const [activeTab, setActiveTab] = useState<'providers' | 'logs'>('providers');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [filterProvider, setFilterProvider] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;

    const updateState = () => {
      setLogs(apiTracker.getLogs());
      setProviders(apiTracker.getProvidersSummary());
    };

    updateState();
    const unsubscribe = apiTracker.subscribe(updateState);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRetestTelemetry = async () => {
    setIsTesting(true);
    try {
      await fetchLiveClimateTelemetry();
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

  const totalCalls = logs.length;
  const successCalls = logs.filter((l) => l.status === 'success').length;
  const cachedCalls = logs.filter((l) => l.status === 'cached').length;
  const errorCalls = logs.filter((l) => l.status === 'error').length;

  return (
    <div className="modal-status-api-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="card-painel-status-api w-full max-w-2xl bg-slate-950/95 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-amber-300">
                  Painel de Status & Cota de APIs
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monitor de tráfego, limites de requisições e latência de provedores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-fechar-modal-api p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Metric Ribbon */}
        <div className="grid grid-cols-4 gap-2 px-5 py-3 bg-slate-900/60 border-b border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Total de Chamadas</span>
            <span className="text-lg font-black text-amber-300 font-mono">{totalCalls}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Sucesso (200)</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{successCalls}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Em Cache Local</span>
            <span className="text-lg font-black text-cyan-400 font-mono">{cachedCalls}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Falhas / Erros</span>
            <span className={`text-lg font-black font-mono ${errorCalls > 0 ? 'text-red-400' : 'text-slate-500'}`}>
              {errorCalls}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-800 bg-slate-950">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('providers')}
              className={`pb-2.5 px-3 text-xs font-bold font-serif transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'providers'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Provedores & Cotas
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-2.5 px-3 text-xs font-bold font-serif transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Histórico de Requisições ({logs.length})
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleRetestTelemetry}
              disabled={isTesting}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testando...' : 'Re-testar Open-Meteo'}</span>
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
        <div className="p-5 overflow-y-auto max-h-[50vh] custom-scrollbar space-y-3">
          {activeTab === 'providers' && (
            <div className="space-y-3">
              {providers.map((prov) => (
                <div
                  key={prov.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                        {prov.id === 'open-meteo' ? (
                          <Cloud className="w-4 h-4" />
                        ) : prov.id === 'ibge-geo' ? (
                          <Database className="w-4 h-4" />
                        ) : prov.id === 'cartodb-tiles' ? (
                          <Globe className="w-4 h-4" />
                        ) : (
                          <HardDrive className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          <span>{prov.name}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {prov.quotaPerDay}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-amber-400">
                        {prov.quotaUsedToday} req realizadas
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Latência média: ~{prov.avgLatencyMs} ms
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    {prov.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>
                      Última chamada: <strong className="text-slate-300 font-mono">{prov.lastCallTime || 'N/A'}</strong>
                    </span>
                    <span>
                      Cache em memória: <strong className="text-cyan-300 font-mono">{prov.cachedEntries} itens</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Nenhuma requisição registrada nesta sessão ainda.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.status === 'success'
                            ? 'bg-emerald-400'
                            : log.status === 'cached'
                            ? 'bg-cyan-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="font-bold text-amber-300 uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-800">
                        {log.provider}
                      </span>
                      <span className="text-slate-200 truncate max-w-[280px]">
                        {log.endpoint}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {log.payloadSizeKb && (
                        <span className="text-slate-400 text-[11px]">
                          {log.payloadSizeKb} KB
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px]">
                        {log.durationMs}ms
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Open-Meteo & IBGE Operacionais</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs transition-colors"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
