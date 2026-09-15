import React from 'react';
import { ChevronUp, ChevronDown, Waves, Trees, Compass, BarChart3 } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { CartographyLayerMode } from '../../types/cartography';

export interface Sidebar2DDrawerTerritoryProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeLayer: CartographyLayerMode;
  onSelectLayer: (layer: CartographyLayerMode) => void;
  bindTooltip: (config: {
    title: string;
    badge?: string;
    badgeColor?: string;
    description: string;
  }) => Record<string, unknown>;
}

/**
 * Sidebar2DDrawerTerritory
 * Gaveta 2 de Navegação 2D: Território & Camadas Cartográficas.
 * Utiliza o mesmo padrão retrátil com setas de "Ambiente & Sistema".
 */
export const Sidebar2DDrawerTerritory: React.FC<Sidebar2DDrawerTerritoryProps> = ({
  isExpanded,
  onToggleExpand,
  activeLayer,
  onSelectLayer,
  bindTooltip,
}) => {
  const handleLayerClick = (layer: CartographyLayerMode) => {
    audioEngine.playSfx('click');
    if (activeLayer === layer) {
      onSelectLayer('none'); // Desativa ao clicar novamente
    } else {
      onSelectLayer(layer);
    }
  };

  return (
    <div
      id="secao-gaveta-territorio-sidebar"
      className="secao-gaveta-territorio-sidebar flex flex-col items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-emerald-500/35 shrink-0 shadow-lg transition-all duration-300"
    >
      {/* Botão Seta Retrátil (Chevron) */}
      <button
        id="btn-toggle-expansao-territorio"
        type="button"
        onClick={() => {
          audioEngine.playSfx('click');
          onToggleExpand();
        }}
        {...bindTooltip({
          title: 'Território & Redes Vivas',
          badge: isExpanded ? 'Recolher' : 'Expandir',
          badgeColor: isExpanded
            ? 'bg-slate-700/50 text-slate-300 border-slate-600'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          description: isExpanded
            ? 'Clique para recolher as camadas de território e hidrografia do Brasil.'
            : 'Clique para expandir as camadas cartográficas: Bacias Hidrográficas, Biomas em Relevo, Rotas de Integração e Estatísticas.',
        })}
        className="btn-toggle-expansao-territorio w-10 h-7 sm:w-11 sm:h-7 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        aria-label={isExpanded ? 'Recolher Território & Camadas' : 'Expandir Território & Camadas'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-300 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-emerald-300 animate-pulse transition-transform" />
        )}
      </button>

      {/* Ícone Indicador de Camadas quando recolhido ou aberto */}
      <div
        id="badge-indicador-territorio"
        className="badge-indicador-territorio flex items-center justify-center w-10 h-6 sm:w-11 sm:h-6 text-[10px] font-mono font-bold text-emerald-300/80 uppercase tracking-tighter"
        title="Módulo de Território e Camadas"
      >
        GEO
      </div>

      {/* Conteúdo Expansível: Camadas Cartográficas */}
      {isExpanded && (
        <div className="flex flex-col items-center gap-1.5 transition-all duration-200">
          {/* 1. Bacias Hidrográficas */}
          <button
            id="btn-camada-hidrografia"
            type="button"
            onClick={() => handleLayerClick('bacias_hidrograficas')}
            {...bindTooltip({
              title: 'Bacias Hidrográficas',
              badge: activeLayer === 'bacias_hidrograficas' ? 'Camada Ativa' : 'Rios Vivos',
              badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
              description:
                'Traçado das grandes bacias fluviais brasileiras: Amazônica, São Francisco, Tocantins-Araguaia e Rio da Prata com fluxo contínuo.',
            })}
            className={`btn-camada-hidrografia relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              activeLayer === 'bacias_hidrograficas'
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-105'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
            }`}
            aria-label="Camada de Bacias Hidrográficas"
          >
            <Waves className="w-5 h-5" />
            {activeLayer === 'bacias_hidrograficas' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-slate-950 shadow-[0_0_8px_#06b6d4] animate-pulse pointer-events-none" />
            )}
          </button>

          {/* 2. Biomas Nacionais */}
          <button
            id="btn-camada-biomas"
            type="button"
            onClick={() => handleLayerClick('biomas_relevo')}
            {...bindTooltip({
              title: 'Biomas & Relevo',
              badge: activeLayer === 'biomas_relevo' ? 'Camada Ativa' : 'Mosaico Vegetal',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
              description:
                'Delimitação dos 6 biomas continentais brasileiros com sombreamento de relevo e elevações naturais.',
            })}
            className={`btn-camada-biomas relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              activeLayer === 'biomas_relevo'
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
            aria-label="Camada de Biomas Nacionais"
          >
            <Trees className="w-5 h-5" />
            {activeLayer === 'biomas_relevo' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-slate-950 shadow-[0_0_8px_#10b981] animate-pulse pointer-events-none" />
            )}
          </button>

          {/* 3. Rotas & Integração */}
          <button
            id="btn-camada-rotas"
            type="button"
            onClick={() => handleLayerClick('rotas_integracao')}
            {...bindTooltip({
              title: 'Rotas & Conectividade',
              badge: activeLayer === 'rotas_integracao' ? 'Camada Ativa' : 'Infraestrutura',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
              description:
                'Estradas históricas (Estrada Real, Rondon), malha ferroviária federal, rodovias de integração (BR-101) e portos de cabotagem.',
            })}
            className={`btn-camada-rotas relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              activeLayer === 'rotas_integracao'
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            aria-label="Camada de Rotas e Conectividade"
          >
            <Compass className="w-5 h-5" />
            {activeLayer === 'rotas_integracao' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-slate-950 shadow-[0_0_8px_#f59e0b] animate-pulse pointer-events-none" />
            )}
          </button>

          {/* 4. Dados Coropléticos */}
          <button
            id="btn-camada-coropletica"
            type="button"
            onClick={() => handleLayerClick('dados_coropleticos')}
            {...bindTooltip({
              title: 'Dados Coropléticos IBGE',
              badge: activeLayer === 'dados_coropleticos' ? 'Camada Ativa' : 'Censo 2022',
              badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
              description:
                'Mapas temáticos por estado: Densidade demográfica Censo 2022, PIB estadual e indicadores sociais do Brasil.',
            })}
            className={`btn-camada-coropletica relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              activeLayer === 'dados_coropleticos'
                ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.5)] scale-105'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
            }`}
            aria-label="Camada de Dados Coropléticos"
          >
            <BarChart3 className="w-5 h-5" />
            {activeLayer === 'dados_coropleticos' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-300 ring-2 ring-slate-950 shadow-[0_0_8px_#818cf8] animate-pulse pointer-events-none" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
