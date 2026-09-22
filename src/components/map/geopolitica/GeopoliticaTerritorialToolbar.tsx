import React, { useState } from 'react';
import { Globe2, Scale, Check, Layers } from 'lucide-react';
import { audioEngine } from '../../../lib/audioSynth';

interface GeopoliticaTerritorialToolbarProps {
  showNeighbors?: boolean;
  onToggleNeighbors?: () => void;
  isCompareOpen: boolean;
  onToggleCompare: () => void;
  selectedRegionFilter: string;
  onSelectRegionFilter?: (region: string) => void;
}

const IBGE_REGION_OPTIONS = [
  { id: 'todos', label: 'Brasil (Todos)', sigla: 'BR' },
  { id: 'norte', label: 'Norte', sigla: 'NO' },
  { id: 'nordeste', label: 'Nordeste', sigla: 'NE' },
  { id: 'centro-oeste', label: 'Centro-Oeste', sigla: 'CO' },
  { id: 'sudeste', label: 'Sudeste', sigla: 'SE' },
  { id: 'sul', label: 'Sul', sigla: 'SU' },
];

const GEIGER_COMPLEX_OPTIONS = [
  { id: 'todos', label: 'Brasil (Todos)', sigla: 'BR' },
  { id: 'amazonia', label: 'Complexo da Amazônia', sigla: 'AMZ' },
  { id: 'nordeste_geiger', label: 'Complexo do Nordeste', sigla: 'C.NE' },
  { id: 'centro_sul', label: 'Complexo Centro-Sul', sigla: 'C.SUL' },
];

/**
 * GeopoliticaTerritorialToolbar
 * Toolbar de ferramentas de análise territorial geopolítica encapsulada no painel lateral.
 * Agrupa funções sem poluir o canvas:
 * 1. Toggle de Fronteiras / Países Vizinhos Sul-Americanos
 * 2. Comparador Interestadual (Split-View / Comparativo A/B)
 * 3. Seletor de Divisões Regionais Modernas: Macrorregiões IBGE e Complexos Geoeconômicos (Geiger)
 */
export const GeopoliticaTerritorialToolbar: React.FC<GeopoliticaTerritorialToolbarProps> = ({
  showNeighbors = false,
  onToggleNeighbors,
  isCompareOpen,
  onToggleCompare,
  selectedRegionFilter,
  onSelectRegionFilter,
}) => {
  const [divisionModel, setDivisionModel] = useState<'ibge' | 'geiger'>('ibge');

  const currentOptions = divisionModel === 'ibge' ? IBGE_REGION_OPTIONS : GEIGER_COMPLEX_OPTIONS;

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

        {/* 3. Alternador de Modelo Regional (IBGE vs Complexos Geoeconômicos Geiger) */}
        <button
          id="btn-geopolitica-modelo-regional"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            const nextModel = divisionModel === 'ibge' ? 'geiger' : 'ibge';
            setDivisionModel(nextModel);
            onSelectRegionFilter?.('todos');
          }}
          className="px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 bg-slate-950/80 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all cursor-pointer"
          title={
            divisionModel === 'ibge'
              ? 'Modelo atual: Macrorregiões Oficiais IBGE. Clique para alternar para Complexos Geoeconômicos de Pedro Pinchas Geiger.'
              : 'Modelo atual: Complexos Geoeconômicos de Pedro Pinchas Geiger (Amazônia, Nordeste, Centro-Sul). Clique para alternar para Macrorregiões IBGE.'
          }
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>{divisionModel === 'ibge' ? 'IBGE' : 'Geiger'}</span>
        </button>
      </div>

      {/* Grupo Direita: Pílulas da Divisão Regional Selecionada */}
      {onSelectRegionFilter && (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            {currentOptions.map((reg) => {
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
                  title={`Filtrar: ${reg.label}`}
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
