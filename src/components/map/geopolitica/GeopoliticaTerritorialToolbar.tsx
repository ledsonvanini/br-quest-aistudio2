import React from 'react';
import { Globe2, Scale, MapPin, Check } from 'lucide-react';
import { audioEngine } from '../../../lib/audioSynth';

interface GeopoliticaTerritorialToolbarProps {
  showNeighbors?: boolean;
  onToggleNeighbors?: () => void;
  isCompareOpen: boolean;
  onToggleCompare: () => void;
  selectedRegionFilter: string;
  onSelectRegionFilter?: (region: string) => void;
}

const REGION_OPTIONS = [
  { id: 'todos', label: 'Brasil (Todos)', sigla: 'BR' },
  { id: 'norte', label: 'Norte', sigla: 'NO' },
  { id: 'nordeste', label: 'Nordeste', sigla: 'NE' },
  { id: 'centro-oeste', label: 'Centro-Oeste', sigla: 'CO' },
  { id: 'sudeste', label: 'Sudeste', sigla: 'SE' },
  { id: 'sul', label: 'Sul', sigla: 'SU' },
];

/**
 * GeopoliticaTerritorialToolbar
 * Toolbar de ferramentas de análise territorial geopolítica encapsulada no painel lateral.
 * Agrupa funções sem poluir o canvas:
 * 1. Toggle de Fronteiras / Países Vizinhos Sul-Americanos (reaproveitando a lógica global)
 * 2. Comparador Interestadual (Split-View / Comparativo A/B)
 * 3. Seletor compacto de Macrorregiões do IBGE
 */
export const GeopoliticaTerritorialToolbar: React.FC<GeopoliticaTerritorialToolbarProps> = ({
  showNeighbors = false,
  onToggleNeighbors,
  isCompareOpen,
  onToggleCompare,
  selectedRegionFilter,
  onSelectRegionFilter,
}) => {
  return (
    <div
      id="toolbar-ferramentas-territoriais-geopolitica"
      className="toolbar-ferramentas-territoriais-geopolitica px-3 sm:px-4 py-2 bg-slate-900/90 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 shrink-0 select-none"
    >
      {/* Grupo Esquerda: Ferramentas de Análise (Ícones com Tooltips e Pílulas) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400/90 mr-1 hidden sm:inline">
          Ferramentas:
        </span>

        {/* 1. Botão Países Vizinhos / Fronteiras Sul-Americanas */}
        {onToggleNeighbors && (
          <button
            id="btn-geopolitica-vizinhos-sul-americanos"
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onToggleNeighbors();
            }}
            className={`btn-acao-vizinhos-geopolitica px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showNeighbors
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/70 shadow-sm shadow-amber-900/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700/80'
            }`}
            title="Visualizar países vizinhos da América do Sul e tratados de fronteira"
            aria-pressed={showNeighbors}
          >
            <Globe2 className={`w-3.5 h-3.5 ${showNeighbors ? 'text-amber-400 animate-spin-slow' : 'text-slate-400'}`} />
            <span className="text-[11px] font-bold">América do Sul</span>
            {showNeighbors && <Check className="w-3 h-3 text-amber-300" />}
          </button>
        )}

        {/* 2. Botão Comparador Interestadual */}
        <button
          id="btn-geopolitica-comparador-estados"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            onToggleCompare();
          }}
          className={`btn-acao-comparar-geopolitica px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            isCompareOpen
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/70 shadow-sm shadow-cyan-900/30'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700/80'
          }`}
          title="Comparar indicadores demográficos e políticos entre dois estados"
          aria-pressed={isCompareOpen}
        >
          <Scale className={`w-3.5 h-3.5 ${isCompareOpen ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className="text-[11px] font-bold">Comparar UFs</span>
        </button>
      </div>

      {/* Grupo Direita: Pílulas de Macrorregião */}
      {onSelectRegionFilter && (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            {REGION_OPTIONS.map((reg) => {
              const isSelected = selectedRegionFilter.toLowerCase() === reg.id.toLowerCase();
              return (
                <button
                  key={reg.id}
                  id={`btn-filtro-regiao-${reg.id}`}
                  type="button"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onSelectRegionFilter(reg.id);
                  }}
                  className={`px-1.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Filtrar macrorregião: ${reg.label}`}
                >
                  {reg.sigla}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
