import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { STATE_COAT_OF_ARMS } from '../../data/coatOfArms';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  X,
  Trophy,
} from 'lucide-react';

interface MapStateCarouselProps {
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (stateId: string | null, source?: 'toolbar' | 'map') => void;
  onStateClick: (stateId: string) => void;
}

const REGION_NAMES: Record<string, string> = {
  norte: 'Norte',
  nordeste: 'Nordeste',
  centro_oeste: 'Centro-Oeste',
  sudeste: 'Sudeste',
  sul: 'Sul',
};

export const MapStateCarousel: React.FC<MapStateCarouselProps> = ({
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateClick,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMiddleDragging, setIsMiddleDragging] = useState(false);

  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);

  // Filtered states for search popover
  const searchResults = GUARDIANS_DATA.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const regionName = REGION_NAMES[g.regionId] || g.regionId;
    return (
      g.id.toLowerCase().includes(q) ||
      g.stateNamePt.toLowerCase().includes(q) ||
      g.guardianName.toLowerCase().includes(q) ||
      regionName.toLowerCase().includes(q)
    );
  });

  // Toggle search popover
  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 80);
      }
      return next;
    });
  };

  // Close search popover on outside click or Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isSearchOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Smooth scroll via navigation buttons
  const handleScrollStep = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Middle mouse button / wheel horizontal scroll handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    // Converts vertical mouse wheel or trackpad delta to horizontal scroll
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    scrollRef.current.scrollLeft += delta * 1.1;
  }, []);

  // Middle-click / Drag scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if middle click (button === 1) or secondary drag
    if (e.button === 1 || e.button === 0) {
      if (e.button === 1) {
        e.preventDefault();
      }
      setIsMiddleDragging(true);
      dragStartXRef.current = e.clientX;
      if (scrollRef.current) {
        scrollStartRef.current = scrollRef.current.scrollLeft;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMiddleDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    scrollRef.current.scrollLeft = scrollStartRef.current - dx;
  };

  const handleMouseUp = () => {
    setIsMiddleDragging(false);
  };

  return (
    <div
      className="container-carrossel-estados painel-inferior-estados absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-30 pointer-events-auto flex flex-col items-center max-w-5xl mx-auto select-none"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 1. Floating Search Popover */}
      {isSearchOpen && (
        <div
          ref={popoverRef}
          className="popover-busca-estados absolute bottom-full mb-3 left-2 sm:left-4 w-80 sm:w-96 max-w-[calc(100vw-32px)] bg-slate-950/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2.5"
        >
          {/* Header & Search Input */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 flex-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus-within:border-amber-400/80 transition-colors">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar estado, sigla ou Guardião..."
                className="input-filtro-busca w-full bg-transparent border-none text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-slate-300 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsSearchOpen(false)}
              className="btn-fechar-popover p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Fechar (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Results List */}
          <div className="lista-resultados-busca max-h-60 overflow-y-auto custom-scrollbar-gold flex flex-col gap-1 pr-1">
            {searchResults.length > 0 ? (
              searchResults.map((guardian) => {
                const stateId = guardian.id;
                const isCompleted = completedStateIds.has(stateId);
                const isSelected = selectedStateId === stateId;
                const coatOfArms = STATE_COAT_OF_ARMS[stateId];

                return (
                  <button
                    key={stateId}
                    onClick={() => {
                      onStateClick(stateId);
                      setIsSearchOpen(false);
                    }}
                    onMouseEnter={() => onStateHover(stateId, 'toolbar')}
                    onMouseLeave={() => onStateHover(null, 'toolbar')}
                    className={`item-resultado-busca flex items-center justify-between p-2 rounded-xl text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-amber-950/80 text-amber-200 border border-amber-500/50'
                        : 'hover:bg-slate-900/90 text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-900 p-0.5 border border-slate-700 shrink-0 flex items-center justify-center">
                        {coatOfArms ? (
                          <img
                            src={coatOfArms}
                            alt={guardian.stateNamePt}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-400 font-mono">
                            {stateId}
                          </span>
                          <span className="font-medium text-slate-200 truncate">
                            {guardian.stateNamePt}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {guardian.guardianName} • {REGION_NAMES[guardian.regionId] || guardian.regionId}
                        </span>
                      </div>
                    </div>

                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                Nenhum estado encontrado para "{searchQuery}"
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 px-1 font-mono">
            <span>{searchResults.length} de 27 estados</span>
            <span>ESC para fechar</span>
          </div>
        </div>
      )}

      {/* 2. Main Modern Glass Carousel Bar */}
      <div className="barra-principal-carrossel w-full bg-slate-950/85 backdrop-blur-xl border border-slate-800/90 shadow-2xl rounded-2xl p-1.5 sm:p-2 flex items-center gap-2 relative">
        
        {/* Left Search Icon Trigger & Stats Counter */}
        <div className="secao-esquerda-botoes flex items-center gap-1.5 shrink-0 pl-1">
          <button
            onClick={toggleSearch}
            className={`btn-abrir-busca-estados p-2 rounded-xl border transition-all flex items-center justify-center ${
              isSearchOpen || searchQuery
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-amber-300'
            }`}
            title="Buscar Estado ou Guardião (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mini Counter Badge */}
          <div
            className="badge-contador-concluidos hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-amber-300 shrink-0"
            title="Estados Concluídos"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {completedStateIds.size}/27
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-6 bg-slate-800 shrink-0 hidden sm:block" />

        {/* Carousel Navigation: Left Button */}
        <button
          onClick={() => handleScrollStep('left')}
          className="btn-carrossel-prev shrink-0 p-1.5 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all active:scale-95 shadow-md"
          title="Rolar para esquerda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Scroll Track with Gradient Mask & Edge Shadows */}
        <div
          className="container-mascara-carrossel relative flex-1 min-w-0 overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 28px, black calc(100% - 28px), transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 28px, black calc(100% - 28px), transparent 100%)',
          }}
        >
          {/* Edge Shadows */}
          <div className="sombra-borda-esquerda pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
          <div className="sombra-borda-direita pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 via-slate-950/40 to-transparent z-10" />

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="trilha-carrossel-estados flex items-center gap-1.5 overflow-x-auto scrollbar-gold-horizontal pb-1.5 pt-0.5 px-6 cursor-grab active:cursor-grabbing select-none w-full scroll-smooth"
          >
            {GUARDIANS_DATA.map((guardian) => {
              const stateId = guardian.id;
              const isCompleted = completedStateIds.has(stateId);
              const isHovered = hoveredStateId === stateId;
              const isSelected = selectedStateId === stateId;
              const coatOfArms = STATE_COAT_OF_ARMS[stateId];

              return (
                <button
                  key={stateId}
                  id={`carousel-item-${stateId}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStateClick(stateId);
                  }}
                  onMouseEnter={() => onStateHover(stateId, 'toolbar')}
                  onMouseLeave={() => onStateHover(null, 'toolbar')}
                  className={`card-estado-carrossel item-estado-${stateId.toLowerCase()} flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border shadow-md ${
                    isSelected
                      ? 'bg-amber-950/95 border-amber-400 ring-2 ring-amber-400/40 text-amber-100 scale-102 shadow-amber-500/20'
                      : isHovered
                      ? 'bg-slate-900/95 border-amber-400/80 text-amber-200 shadow-slate-900'
                      : isCompleted
                      ? 'bg-slate-950/80 border-emerald-500/50 text-emerald-100 hover:border-emerald-400'
                      : 'bg-slate-950/60 border-slate-800/90 text-slate-300 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  {/* Coat of Arms / Icon */}
                  <div className="brasao-miniatura w-5 h-5 rounded-full overflow-hidden bg-slate-900 p-0.5 border border-white/10 shrink-0 flex items-center justify-center">
                    {coatOfArms ? (
                      <img
                        src={coatOfArms}
                        alt={guardian.stateNamePt}
                        className="w-full h-full object-contain pointer-events-none"
                        loading="lazy"
                      />
                    ) : (
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>

                  {/* UF + Name */}
                  <div className="flex items-center gap-1">
                    <span className="sigla-estado font-bold font-mono text-xs text-amber-300">
                      {stateId}
                    </span>
                    <span className="nome-estado text-[10px] text-slate-400 truncate max-w-[75px] hidden sm:inline">
                      {guardian.stateNamePt}
                    </span>
                  </div>

                  {/* Completion Checkmark */}
                  {isCompleted && (
                    <CheckCircle2 className="icone-status-concluido w-3.5 h-3.5 text-emerald-400 shrink-0 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation: Right Button */}
        <button
          onClick={() => handleScrollStep('right')}
          className="btn-carrossel-next shrink-0 p-1.5 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all active:scale-95 shadow-md"
          title="Rolar para direita"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
