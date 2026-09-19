import React from 'react';
import {
  Waves,
  Trees,
  Route,
  Lightbulb,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Droplets,
  Zap,
} from 'lucide-react';
import { CartographyLayerMode } from '../../../types/cartography';
import { BRAZIL_HYDRO_REGIONS } from '../../../data/cartography/hydroRegionsData';
import { BRAZIL_OFFICIAL_BIOMES } from '../../../data/cartography/biomesData';
import { ENRICHED_INTEGRATION_ROUTES } from '../../../data/cartographyBasinsData';
import { audioEngine } from '../../../lib/audioSynth';

export interface TerritoryMapTipsHUDProps {
  activeLayer: CartographyLayerMode;
  selectedSubitemId?: string | null;
  hoveredStateId?: string | null;
  onSelectSubitem?: (subitemId: string | null) => void;
  onInspectInLateralApp?: (stateId: string) => void;
}

const LAYER_HEADER_CONFIG = {
  bacias_hidrograficas: {
    title: 'Rede Hidrográfica Nacional',
    org: 'ANA • HidroWeb',
    icon: Waves,
    accentColor: '#38bdf8',
    borderColor: 'border-cyan-500/40',
    shadowColor: 'shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.25)]',
    tip: 'Passe o mouse ou toque nos ícones do rodapé para destacar as 12 grandes bacias e leitos de rios com fluxo dinâmico.',
    defaultState: 'AM',
  },
  biomas_relevo: {
    title: 'Biomas & Relevo Hipsométrico',
    org: 'IBGE • Relevo Jurandyr Ross',
    icon: Trees,
    accentColor: '#10b981',
    borderColor: 'border-emerald-500/40',
    shadowColor: 'shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.25)]',
    tip: 'Explore os 6 biomas continentais, picos culminantes e chapadas estruturais com cotas altimétricas reais.',
    defaultState: 'GO',
  },
  rotas_integracao: {
    title: 'Corredores Logísticos & Cabotagem',
    org: 'ANTT • DNIT • Portos BR',
    icon: Route,
    accentColor: '#f59e0b',
    borderColor: 'border-amber-500/40',
    shadowColor: 'shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.25)]',
    tip: 'Acompanhe as rodovias estruturantes, hidrovias navegáveis, ferrovias de carga e portos marítimos estratégicos.',
    defaultState: 'SP',
  },
};

export const TerritoryMapTipsHUD: React.FC<TerritoryMapTipsHUDProps> = ({
  activeLayer,
  selectedSubitemId,
  hoveredStateId,
  onSelectSubitem,
  onInspectInLateralApp,
}) => {
  if (!activeLayer || activeLayer === 'none') return null;

  const cfg = LAYER_HEADER_CONFIG[activeLayer];
  const Icon = cfg.icon;

  // Obter dados do item selecionado
  const activeBasin =
    activeLayer === 'bacias_hidrograficas'
      ? BRAZIL_HYDRO_REGIONS.find((b) => b.id === selectedSubitemId)
      : null;

  const activeBiome =
    activeLayer === 'biomas_relevo'
      ? BRAZIL_OFFICIAL_BIOMES.find((b) => b.id === selectedSubitemId)
      : null;

  const activeRoute =
    activeLayer === 'rotas_integracao'
      ? ENRICHED_INTEGRATION_ROUTES.find((r) => r.id === selectedSubitemId)
      : null;

  const handleInspect = () => {
    audioEngine.playSfx('click');
    if (activeBasin) {
      const primaryState = activeBasin.id === 'amazonica' ? 'AM' : activeBasin.id === 'sao_francisco' ? 'BA' : activeBasin.id === 'parana' ? 'SP' : 'TO';
      onInspectInLateralApp?.(primaryState);
    } else if (activeBiome) {
      const primaryState = activeBiome.id === 'cerrado' ? 'GO' : activeBiome.id === 'amazonia' ? 'AM' : activeBiome.id === 'mata_atlantica' ? 'RJ' : 'BA';
      onInspectInLateralApp?.(primaryState);
    } else {
      onInspectInLateralApp?.(cfg.defaultState);
    }
  };

  return (
    <aside
      id="hud-dicas-territorio-mapa"
      className={`hud-dicas-territorio-mapa fixed top-16 right-3 sm:top-18 sm:right-6 z-30 max-w-[calc(100vw-24px)] w-80 sm:w-88 bg-[#020d24]/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border ${cfg.borderColor} ${cfg.shadowColor} text-slate-100 select-none pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-2`}
      aria-label="Painel de Dicas e Informações de Território"
    >
      {/* 1. Cabeçalho com Ícone e Órgão Oficial */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${cfg.accentColor}20`,
              borderColor: `${cfg.accentColor}50`,
            }}
          >
            <Icon className="w-4 h-4" style={{ color: cfg.accentColor }} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xs text-white leading-tight">
              {cfg.title}
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {cfg.org}
            </span>
          </div>
        </div>

        {selectedSubitemId && (
          <button
            type="button"
            onClick={() => onSelectSubitem?.(null)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-[10px] text-amber-300 hover:text-amber-200 transition cursor-pointer"
            title="Restaurar visão geral do Brasil"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* 2. Conteúdo Informativo Dinâmico */}
      <div className="mt-2.5 space-y-2">
        {/* Caso A: Bacia Hidrográfica Selecionada */}
        {activeBasin && (
          <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeBasin.color }} />
                {activeBasin.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300">
                {activeBasin.areaPercentageBr}% do Brasil
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg">
                <Droplets className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Vazão: <strong className="text-white font-mono">{activeBasin.dischargeM3s.toLocaleString('pt-BR')} m³/s</strong></span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{activeBasin.keyHydroPlants[0] || 'Geração Hídrica'}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 leading-snug">
              <strong className="text-slate-300">Rios:</strong> {activeBasin.mainRivers.slice(0, 4).join(', ')}...
            </div>
          </div>
        )}

        {/* Caso B: Bioma Selecionado */}
        {activeBiome && (
          <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeBiome.color }} />
                Bioma {activeBiome.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                {activeBiome.percentageBr}% do BR
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {activeBiome.vegetationType}
            </p>
            <div className="text-[10px] text-slate-400">
              <strong className="text-slate-300">Fauna Chave:</strong> {activeBiome.faunaHighlights.slice(0, 3).join(', ')}
            </div>
          </div>
        )}

        {/* Caso C: Rota Selecionada */}
        {activeRoute && (
          <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs text-amber-300">
                {activeRoute.name}
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-400">
                {activeRoute.typeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {activeRoute.description}
            </p>
            <div className="text-[10px] text-amber-400 font-mono">
              Extensão: {activeRoute.lengthKm}
            </div>
          </div>
        )}

        {/* Dica Cartográfica Guia quando nenhum item está filtrado */}
        {!selectedSubitemId && (
          <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{cfg.tip}</span>
          </div>
        )}

        {/* Botão de Ação: Inspecionar no AppLateral (50% da Tela) */}
        <button
          type="button"
          onClick={handleInspect}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 via-slate-800 to-emerald-600/30 hover:from-cyan-600/40 hover:to-emerald-600/40 border border-cyan-400/40 text-xs font-semibold text-white shadow-md transition cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Inspecionar no AppLateral (50%)</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-300 ml-auto" />
        </button>
      </div>
    </aside>
  );
};
