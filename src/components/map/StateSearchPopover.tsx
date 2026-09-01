import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Shield, CheckCircle2, Compass, Sparkles } from 'lucide-react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { getStateCoatOfArmsUrl, getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { audioEngine } from '../../lib/audioSynth';

const REGION_NAMES: Record<string, string> = {
  norte: 'Norte',
  nordeste: 'Nordeste',
  centro_oeste: 'Centro-Oeste',
  sudeste: 'Sudeste',
  sul: 'Sul',
};

const REGION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  norte: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  nordeste: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-500/40' },
  centro_oeste: { bg: 'bg-yellow-950/80', text: 'text-yellow-300', border: 'border-yellow-500/40' },
  sudeste: { bg: 'bg-sky-950/80', text: 'text-sky-300', border: 'border-sky-500/40' },
  sul: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-500/40' },
};

interface StateSearchPopoverProps {
  completedStateIds?: Set<string>;
  onStateClick: (stateId: string) => void;
  className?: string;
}

export const StateSearchPopover: React.FC<StateSearchPopoverProps> = ({
  completedStateIds = new Set(),
  onStateClick,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        audioEngine.playSfx('click');
        setTimeout(() => inputRef.current?.focus(), 60);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredStates = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GUARDIANS_DATA.filter((g) => {
      if (selectedRegion !== 'all' && g.regionId !== selectedRegion) {
        return false;
      }
      if (!q) return true;
      const regionName = REGION_NAMES[g.regionId] || g.regionId;
      return (
        g.id.toLowerCase().includes(q) ||
        g.stateNamePt.toLowerCase().includes(q) ||
        g.capitalPt.toLowerCase().includes(q) ||
        g.guardianName.toLowerCase().includes(q) ||
        regionName.toLowerCase().includes(q)
      );
    });
  }, [query, selectedRegion]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Botão de Pesquisa no Rodapé */}
      <button
        id="btn-abrir-busca-estados"
        type="button"
        onClick={toggleSearch}
        className={`btn-abrir-busca-estados flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-serif font-bold transition shadow-sm cursor-pointer border ${
          isOpen
            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
            : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white'
        }`}
        title="Buscar Estado por nome, sigla, capital ou região (Ctrl+K)"
        aria-label="Buscar Estado"
      >
        <Search className={`w-3.5 h-3.5 ${isOpen ? 'text-slate-950' : 'text-amber-400'}`} />
        <span className="hidden xs:inline">Buscar Estado</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/40 text-[9px] font-mono text-amber-300 border border-amber-500/30">
          Ctrl+K
        </kbd>
      </button>

      {/* Popover de Pesquisa Flutuante */}
      {isOpen && (
        <div
          id="popover-busca-estados"
          className="popover-busca-estados absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[340px] xs:w-[380px] sm:w-[440px] max-h-[460px] bg-[#020d24]/98 backdrop-blur-xl border-2 border-amber-500/60 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.25)] z-50 text-slate-100 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header e Input de Pesquisa */}
          <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite estado, sigla, capital ou guardião..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-sans text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros Rápidos por Região */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedRegion('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition shrink-0 border ${
                selectedRegion === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-300'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              Todos (27)
            </button>
            {Object.entries(REGION_NAMES).map(([key, name]) => {
              const count = GUARDIANS_DATA.filter((g) => g.regionId === key).length;
              const isSelected = selectedRegion === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedRegion(key)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition shrink-0 border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {name} ({count})
                </button>
              );
            })}
          </div>

          {/* Lista de Estados Filtrados */}
          <div className="lista-resultados-estados overflow-y-auto max-h-[280px] space-y-1 pr-1 custom-scrollbar">
            {filteredStates.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-sans">
                Nenhum estado encontrado para "{query}".
              </div>
            ) : (
              filteredStates.map((g) => {
                const isCompleted = completedStateIds.has(g.id);
                const flagUrl = getStateFlagUrl(g.id);
                const coatUrl = getStateCoatOfArmsUrl(g.id);
                const regionColor = REGION_COLORS[g.regionId] || REGION_COLORS.norte;

                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      audioEngine.playSfx('travel');
                      onStateClick(g.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-1.5 rounded-xl bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-400/60 transition group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {flagUrl && (
                        <img
                          src={flagUrl}
                          alt={`Bandeira de ${g.stateNamePt}`}
                          className="w-6 h-4 object-cover rounded border border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 shrink-0">
                        {g.id}
                      </span>
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-xs text-slate-100 group-hover:text-amber-200 truncate">
                          {g.stateNamePt}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Cap: {g.capitalPt} • {g.guardianName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${regionColor.bg} ${regionColor.text} ${regionColor.border}`}
                      >
                        {REGION_NAMES[g.regionId]}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-amber-400/70 group-hover:text-amber-300">
                          Viajar →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
