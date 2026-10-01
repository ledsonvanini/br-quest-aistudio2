import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, MapPin, Sparkles, Trophy, ChevronRight, Compass, Shield, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { StateFlag } from '../StateFlag';
import { audioEngine } from '../../lib/audioSynth';

interface StateSearchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectState: (stateId: string, challengeDirectly?: boolean) => void;
  completedStateIds?: string[];
}

export const StateSearchSelectorModal: React.FC<StateSearchSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectState,
  completedStateIds = [],
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string>('todos');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Focus input on modal open & reset
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setSelectedRegion('todos');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const regions = [
    { id: 'todos', label: 'Todos' },
    { id: 'Norte', label: 'Norte' },
    { id: 'Nordeste', label: 'Nordeste' },
    { id: 'Centro-Oeste', label: 'Centro-Oeste' },
    { id: 'Sudeste', label: 'Sudeste' },
    { id: 'Sul', label: 'Sul' },
  ];

  const filteredStates = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    return GUARDIANS_DATA.filter((state) => {
      const matchesRegion = selectedRegion === 'todos' || state.regionId.toLowerCase() === selectedRegion.toLowerCase();
      if (!matchesRegion) return false;

      if (!cleanQuery) return true;

      return (
        state.id.toLowerCase().includes(cleanQuery) ||
        state.stateNamePt.toLowerCase().includes(cleanQuery) ||
        state.capitalPt.toLowerCase().includes(cleanQuery) ||
        state.guardianName.toLowerCase().includes(cleanQuery) ||
        state.guardianTitlePt.toLowerCase().includes(cleanQuery) ||
        state.regionId.toLowerCase().includes(cleanQuery)
      );
    });
  }, [query, selectedRegion]);

  // Adjust selectedIndex when list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredStates.length, selectedRegion]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredStates.length > 0 ? (prev + 1) % filteredStates.length : 0));
        audioEngine.playSfx('hover');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredStates.length > 0 ? (prev - 1 + filteredStates.length) % filteredStates.length : 0));
        audioEngine.playSfx('hover');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredStates[selectedIndex]) {
          const selected = filteredStates[selectedIndex];
          audioEngine.playSfx('travel');
          onSelectState(selected.id, true);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredStates, selectedIndex, onClose, onSelectState]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-seletor-busca-container"
      className="modal-seletor-busca-container fixed inset-0 z-[100000] flex items-start justify-center p-3 sm:p-6 md:p-10 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="card-seletor-busca-estados"
        className="card-seletor-busca-estados relative w-full max-w-2xl bg-slate-900/95 border-2 border-amber-500/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 mt-4 sm:mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho da Busca */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-950/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              id="input-busca-estados"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o estado, sigla (SP, RJ), capital, bioma ou guardião..."
              className="input-busca-estados w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm sm:text-base text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros de Região Rápidos */}
        <div className="px-3.5 sm:px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0 font-sans">
            Região:
          </span>
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800'
                }`}
              >
                {reg.label}
              </button>
            );
          })}
        </div>

        {/* Lista de Resultados */}
        <div
          ref={listRef}
          id="lista-resultados-busca"
          className="lista-resultados-busca flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-slate-800/40"
        >
          {filteredStates.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-300 font-serif font-bold text-base">Nenhum estado ou guardião encontrado</p>
              <p className="text-slate-500 text-xs mt-1">Tente pesquisar por nome (ex: Amazonas), sigla (AM) ou capital (Manaus).</p>
            </div>
          ) : (
            filteredStates.map((state, index) => {
              const isSelected = index === selectedIndex;
              const isConquered = completedStateIds.includes(state.id);

              return (
                <div
                  key={state.id}
                  id={`item-busca-estado-${state.id}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    audioEngine.playSfx('travel');
                    onSelectState(state.id, true);
                    onClose();
                  }}
                  className={`item-estado-busca flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 shadow-md translate-x-1'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Bandeira do Estado */}
                    <div className="w-10 h-7 rounded overflow-hidden border border-slate-700 shadow shrink-0 flex items-center justify-center bg-slate-950">
                      <StateFlag uf={state.id} className="w-full h-full object-cover" />
                    </div>

                    {/* Informações Principais */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm sm:text-base text-amber-200 truncate">
                          {state.stateNamePt}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[11px] font-mono font-bold text-amber-400 border border-slate-700">
                          {state.id}
                        </span>
                        {isConquered && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                            <Trophy className="w-3 h-3 text-emerald-400" />
                            Conquistado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span>Capital: <strong className="text-slate-300">{state.capitalPt}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span className="capitalize">{state.regionId}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400/90 font-medium">Guardião: {state.guardianName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ação Rápida */}
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playSfx('travel');
                        onSelectState(state.id, true);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shadow-md shadow-amber-500/20"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Desafiar</span>
                    </button>
                    <ChevronRight className={`w-4 h-4 transition-colors ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Seletor com Dicas de Teclado */}
        <div className="p-2.5 sm:p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-sans">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] flex items-center">
                <ArrowUp className="w-2.5 h-2.5" />
                <ArrowDown className="w-2.5 h-2.5" />
              </span>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] flex items-center">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </span>
              Desafiar Guardião
            </span>
          </div>
          <span className="text-slate-500">
            {filteredStates.length} de {GUARDIANS_DATA.length} estados
          </span>
        </div>
      </div>
    </div>
  );
};
