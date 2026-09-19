/**
 * StateTerritoryDialog.tsx
 * AppLateral de Detalhamento do Estado (Hidrografia ANA 2025/2026, Relevo Jurandyr Ross e Clima).
 * Ocupa 50% da tela em desktop e tela cheia em mobile, idêntico ao Anexo 1.
 */

import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Waves,
  Mountain,
  CloudSun,
  AlertTriangle,
  Route,
  BarChart3,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { BRAZIL_STATES_REGISTRY, getStateFlagUrl } from '../../../data/brazilStatesRegistry';
import { STATES_GEOPOLITICS_DATA } from '../../../data/geopoliticaData';
import { audioEngine } from '../../../lib/audioSynth';
import { CartographyLayerMode } from '../../../types/cartography';
import { StateTerritoryTabsContent, TerritoryDialogTab } from './StateTerritoryTabsContent';
import { getStateAnaWaterData } from '../../../data/cartography/anaWaterData2025';

interface StateTerritoryDialogProps {
  stateId: string | null;
  activeLayer: CartographyLayerMode;
  onClose: () => void;
  onToggleExpand?: (expanded: boolean) => void;
}

export const StateTerritoryDialog: React.FC<StateTerritoryDialogProps> = ({
  stateId,
  activeLayer,
  onClose,
  onToggleExpand,
}) => {
  const getInitialTab = (): TerritoryDialogTab => {
    if (activeLayer === 'bacias_hidrograficas') return 'bacias';
    if (activeLayer === 'biomas_relevo') return 'relevo';
    if (activeLayer === 'rotas_integracao') return 'rotas';
    return 'koppen';
  };

  const [activeTab, setActiveTab] = useState<TerritoryDialogTab>(getInitialTab);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  React.useEffect(() => {
    setActiveTab(getInitialTab());
  }, [activeLayer]);

  if (!stateId) return null;

  const registryInfo = BRAZIL_STATES_REGISTRY[stateId];
  const geopolitics = STATES_GEOPOLITICS_DATA[stateId];
  const anaData = getStateAnaWaterData(stateId);
  const stateName = registryInfo?.name || geopolitics?.stateName || stateId;

  const handleTabChange = (tab: TerritoryDialogTab) => {
    audioEngine.playSfx('click');
    setActiveTab(tab);
  };

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    const next = !isExpanded;
    setIsExpanded(next);
    onToggleExpand?.(next);
  };

  return (
    <div
      id="dialog-territorio-estado"
      data-scrollable="true"
      className={`painel-app-lateral-estado modal-dialog-territorio-estado fixed top-3 sm:top-3.5 md:top-4 bottom-14 sm:bottom-16 left-2 sm:left-[76px] md:left-[84px] lg:left-[88px] z-40 max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-96px)] bg-slate-950/98 sm:bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_24px_rgba(6,182,212,0.2)] flex flex-col text-slate-100 animate-in fade-in slide-in-from-left-4 duration-300 select-text overflow-hidden cursor-default transition-all duration-300 ${
        isExpanded
          ? 'w-[calc(100vw-16px)] sm:w-[calc(50vw-44px)] md:w-[calc(50vw-48px)] lg:w-[calc(50vw-52px)]'
          : 'w-[calc(100vw-16px)] sm:w-[480px] md:w-[500px]'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Header do Diálogo com Bandeira, Brasão e UF (Idêntico ao Anexo 1) */}
      <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            {getStateFlagUrl(stateId) && (
              <img
                src={getStateFlagUrl(stateId)}
                alt={`Bandeira ${stateName}`}
                referrerPolicy="no-referrer"
                className="w-9 h-6 sm:w-10 sm:h-7 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
              />
            )}
            {registryInfo?.coatOfArmsUrl && (
              <img
                src={registryInfo.coatOfArmsUrl}
                alt={`Brasão ${stateName}`}
                referrerPolicy="no-referrer"
                className="w-7 h-8 sm:w-8 sm:h-9 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] shrink-0 hidden sm:block"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-black tracking-wider shrink-0">
                {stateId}
              </span>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 truncate">
                {stateName}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Capital: {geopolitics?.capital || 'Capital'} • Região {geopolitics?.regionName || 'Centro-Oeste'} • Clima Local
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleToggleExpand}
            aria-label={isExpanded ? 'Restaurar Tamanho' : 'Expandir Painel (50% da Tela)'}
            title={isExpanded ? 'Restaurar largura' : 'Expandir (50% da tela)'}
            className="btn-expandir-app-lateral flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar foco no estado (Esc)"
            title="Fechar foco e restaurar visão geral (Esc)"
            className="btn-fechar-app-lateral-territorio flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-400 transition hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Barra de Telemetria Rápida com Dados Oficiais ANA / IBGE */}
      <div className="p-2 sm:p-2.5 bg-slate-900/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Classificação</span>
          <span className="text-xs sm:text-sm font-black text-yellow-300 font-mono">
            {anaData?.climateClassification.koppenCode || 'Aw / Cwa'}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Precipitação</span>
          <span className="text-xs sm:text-sm font-black text-blue-300 font-mono">
            ~{anaData?.climateClassification.annualPrecipitationMm || 1600} mm/ano
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Vazão Média ANA</span>
          <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono">
            {anaData?.averageDischargeM3s ? `${anaData.averageDischargeM3s.toLocaleString('pt-BR')} m³/s` : 'Balanço ANA'}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Relevo Jurandyr</span>
          <span className="text-xs sm:text-sm font-black text-emerald-300 truncate">
            {anaData?.jurandyrRossRelief.macroUnit || 'Planaltos'}
          </span>
        </div>
      </div>

      {/* 3. Navegação por Abas (Idêntico ao Anexo 1) */}
      <div className="flex items-center border-b border-slate-800/80 bg-slate-900/50 px-2 py-1 gap-1 overflow-x-auto scrollbar-none shrink-0 text-xs font-semibold">
        <button
          type="button"
          onClick={() => handleTabChange('koppen')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'koppen'
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CloudSun className="h-3.5 w-3.5 text-yellow-400" />
          <span>Köppen</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('bacias')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'bacias'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Waves className="h-3.5 w-3.5 text-cyan-400" />
          <span>Bacias</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('relevo')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'relevo'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Mountain className="h-3.5 w-3.5 text-emerald-400" />
          <span>Relevo</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('extremos')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'extremos'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          <span>Extremos</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('rotas')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'rotas'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Route className="h-3.5 w-3.5 text-amber-400" />
          <span>Rotas</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('dados')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
            activeTab === 'dados'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
          <span>Dados</span>
        </button>
      </div>

      {/* 4. Conteúdo da Aba */}
      <StateTerritoryTabsContent stateId={stateId} activeTab={activeTab} />

      {/* 5. Rodapé do Painel Lateral (Idêntico ao Anexo 1) */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between text-xs shrink-0">
        <div className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 block">INMET • ECMWF • ANA • IBGE</span>
          <span className="text-[10px] text-slate-400">Edição 2025/2026 • Dados Oficiais Integrados</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
        >
          <X className="w-3.5 h-3.5" />
          <span>Fechar Foco (Esc)</span>
        </button>
      </div>
    </div>
  );
};
