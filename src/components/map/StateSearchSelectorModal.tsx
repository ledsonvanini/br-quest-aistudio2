import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  X,
  CheckCircle2,
  Swords,
  Compass,
  Trees,
  Sun,
  Flame,
  Building2,
  Mountain,
  Trophy,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { ALL_BRAZIL_STATES, getStateCoatOfArmsUrl, getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { audioEngine } from '../../lib/audioSynth';

const REGION_FILTERS = [
  { id: 'all', label: 'Todos', count: 27, icon: Compass },
  { id: 'norte', label: 'Norte', count: 7, icon: Trees, color: 'text-emerald-400' },
  { id: 'nordeste', label: 'Nordeste', count: 9, icon: Sun, color: 'text-amber-400' },
  { id: 'centro_oeste', label: 'Centro-Oeste', count: 4, icon: Flame, color: 'text-yellow-400' },
  { id: 'sudeste', label: 'Sudeste', count: 4, icon: Building2, color: 'text-sky-400' },
  { id: 'sul', label: 'Sul', count: 3, icon: Mountain, color: 'text-indigo-400' },
  { id: 'conquistados', label: 'Conquistados', count: 0, icon: Trophy, color: 'text-emerald-300' },
] as const;

interface StateSearchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedStateIds?: Set<string>;
  onStateClick: (stateId: string) => void;
}

export const StateSearchSelectorModal: React.FC<StateSearchSelectorModalProps> = ({
  isOpen,
  onClose,
  completedStateIds = new Set(),
  onStateClick,
}) => {
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredStates = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GUARDIANS_DATA.filter((g) => {
      const isConquered = completedStateIds.has(g.id);

      if (selectedRegion === 'conquistados' && !isConquered) {
        return false;
      }
      if (selectedRegion !== 'all' && selectedRegion !== 'conquistados' && g.regionId !== selectedRegion) {
        return false;
      }

      if (!q) return true;

      const regInfo = ALL_BRAZIL_STATES.find((s) => s.id === g.id);
      const stateName = regInfo?.name || g.stateNamePt;
      const capital = regInfo?.capital || g.capitalPt;

      return (
        g.id.toLowerCase().includes(q) ||
        stateName.toLowerCase().includes(q) ||
        capital.toLowerCase().includes(q) ||
        g.guardianName.toLowerCase().includes(q) ||
        g.guardianTitlePt.toLowerCase().includes(q) ||
        g.regionId.toLowerCase().includes(q)
      );
    });
  }, [query, selectedRegion, completedStateIds]);

  // Ensure index stays in valid range when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedRegion]);

  const handleSelectState = (stateId: string) => {
    audioEngine.playSfx('click');
    onClose();
    onStateClick(stateId);
  };

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
        setSelectedIndex((prev) => (filteredStates.length ? (prev + 1) % filteredStates.length : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredStates.length ? (prev - 1 + filteredStates.length) % filteredStates.length : 0
        );
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredStates[selectedIndex]) {
          handleSelectState(filteredStates[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredStates, onClose]);

  // Scroll selected element into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const conqueredTotal = completedStateIds.size;

  return createPortal(
    <div
      id="modal-seletor-estados-backdrop"
      className="modal-seletor-estados-backdrop fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="menu-seletor-estados"
        className="menu-seletor-estados w-full max-w-2xl bg-gradient-to-b from-slate-900 via-[#020c1e] to-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Seletor de Estados e Guardiões"
      >
        {/* 1. Header com Barra de Pesquisa Estilosa */}
        <div className="p-4 border-b border-amber-500/20 bg-slate-950/60 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
                <Compass className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-sm sm:text-base text-amber-100 tracking-wide flex items-center gap-2">
                  <span>Explorar Estados & Guardiões</span>
                  <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300">
                    27 UFs
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:flex items-center gap-1 font-mono text-[10.5px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400">
                <kbd className="text-amber-300 font-bold">ESC</kbd> fechar
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition cursor-pointer"
                title="Fechar (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o estado, sigla (ex: SP, MG, BA), capital ou nome do guardião..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-sm font-sans text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 p-1 rounded text-slate-400 hover:text-white"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {REGION_FILTERS.map((rf) => {
              const isActive = selectedRegion === rf.id;
              const Icon = rf.icon;
              const countDisplay = rf.id === 'conquistados' ? conqueredTotal : rf.count;

              return (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setSelectedRegion(rf.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-105'
                      : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border-slate-800 hover:border-amber-500/30'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{rf.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-950/40 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {countDisplay}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Lista de Estados e Guardiões */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 custom-scrollbar-gold min-h-[220px]"
        >
          {filteredStates.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <Compass className="w-10 h-10 text-slate-600 animate-spin-slow" />
              <p className="text-sm font-serif">Nenhum estado encontrado para "{query}".</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedRegion('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredStates.map((g, idx) => {
                const isSelected = idx === selectedIndex;
                const isConquered = completedStateIds.has(g.id);
                const regInfo = ALL_BRAZIL_STATES.find((s) => s.id === g.id);
                const stateName = regInfo?.name || g.stateNamePt;
                const capital = regInfo?.capital || g.capitalPt;
                const flagUrl = getStateFlagUrl(g.id);
                const coatUrl = getStateCoatOfArmsUrl(g.id);

                return (
                  <div
                    key={g.id}
                    data-index={idx}
                    onClick={() => handleSelectState(g.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`card-item-seletor-estado p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5 select-none ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.3)] scale-[1.01]'
                        : isConquered
                        ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-400/80'
                        : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/90'
                    }`}
                  >
                    {/* Flag & UF thumbnail */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-10 h-7 rounded-md overflow-hidden border border-amber-400/60 bg-slate-900 shrink-0 shadow-sm">
                        {flagUrl && (
                          <img
                            src={flagUrl}
                            alt={`Bandeira de ${stateName}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        {coatUrl && (
                          <div className="absolute inset-0 flex items-center justify-center p-0.5 bg-slate-950/40">
                            <img
                              src={coatUrl}
                              alt={`Brasão de ${stateName}`}
                              className="w-4 h-4 object-contain drop-shadow"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`font-mono text-[11px] font-black px-1.5 py-0.2 rounded shrink-0 border ${
                              isConquered
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                                : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                            }`}
                          >
                            {g.id}
                          </span>
                          <span className="font-serif font-bold text-xs sm:text-sm text-slate-100 truncate">
                            {stateName}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                          {g.guardianName} • <span className="text-slate-300">{capital}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isConquered ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-bold shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="hidden xs:inline">Conquistado</span>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-colors ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                              : 'bg-slate-900 border border-amber-500/40 text-amber-300'
                          }`}
                        >
                          <Swords className="w-3 h-3" />
                          <span className="hidden xs:inline">Desafiar</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Footer com Dica de Teclado */}
        <div className="p-3 border-t border-amber-500/20 bg-slate-950/90 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[10px]">
                ↓
              </kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[10px]">
                ENTER
              </kbd>
              Desafiar Guardião
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-300 font-serif font-bold">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>+100 XP por desafio</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
