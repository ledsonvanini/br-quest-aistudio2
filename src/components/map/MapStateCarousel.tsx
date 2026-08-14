import React, { useRef, useEffect, useState } from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { STATE_COAT_OF_ARMS } from '../../data/coatOfArms';
import { CheckCircle2, ChevronLeft, ChevronRight, Search, Shield } from 'lucide-react';

interface MapStateCarouselProps {
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (stateId: string | null, source: 'toolbar' | 'map') => void;
  onStateClick: (stateId: string) => void;
}

export const MapStateCarousel: React.FC<MapStateCarouselProps> = ({
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateClick,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Filtered states based on search query
  const filteredStates = GUARDIANS_DATA.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      g.id.toLowerCase().includes(q) ||
      g.stateNamePt.toLowerCase().includes(q) ||
      g.guardianName.toLowerCase().includes(q)
    );
  });

  const updateProgress = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  };

  // Synchronize map hover to scroll carousel into view
  useEffect(() => {
    if (hoveredStateId && itemRefs.current[hoveredStateId] && scrollRef.current && !isDragging) {
      const container = scrollRef.current;
      const el = itemRefs.current[hoveredStateId];
      if (el) {
        const targetScroll = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        setTimeout(updateProgress, 250);
      }
    }
  }, [hoveredStateId, isDragging]);

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(updateProgress, 200);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    if (scrollRef.current) {
      scrollStartRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4) {
      hasMovedRef.current = true;
    }
    scrollRef.current.scrollLeft = scrollStartRef.current - dx;
    updateProgress();
  };

  const handleMouseUp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsDragging(false);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  return (
    <div
      className="container-carrossel-estados painel-inferior-estados absolute bottom-4 left-4 right-4 z-30 pointer-events-auto flex flex-col gap-1.5 max-w-6xl mx-auto"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Search Bar & Progress Bar */}
      <div className="barra-busca-estados flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
        <div className="grupo-input-busca flex items-center gap-2 text-xs text-slate-400">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <input
            type="text"
            placeholder="Filtrar por estado, sigla ou Guardião..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-filtro-busca bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-48 sm:w-64"
          />
        </div>

        {/* Scroll indicator bar */}
        <div className="indicador-progresso-carrossel flex items-center gap-2">
          <div className="trilha-mini-progresso w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
            <div
              className="barra-mini-progresso h-full bg-amber-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
            />
          </div>
          <span className="texto-concluidos-total text-[10px] font-mono text-slate-400">
            {completedStateIds.size}/27 ⭐
          </span>
        </div>
      </div>

      {/* States Carousel Track with Navigation Buttons */}
      <div className="container-trilha-botoes relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => scrollBy(-240)}
          className="btn-carrossel-esquerda absolute left-1 z-10 p-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700 shadow-xl hover:bg-slate-800 hover:text-white transition-colors"
          title="Rolar para a esquerda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scroll Track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onScroll={updateProgress}
          className="trilha-carrossel-estados flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-8 cursor-grab active:cursor-grabbing select-none w-full scroll-smooth"
        >
          {filteredStates.map((guardian) => {
            const stateId = guardian.id;
            const isCompleted = completedStateIds.has(stateId);
            const isHovered = hoveredStateId === stateId;
            const isSelected = selectedStateId === stateId;
            const coatOfArms = STATE_COAT_OF_ARMS[stateId];

            return (
              <button
                key={stateId}
                ref={(el) => {
                  itemRefs.current[stateId] = el;
                }}
                id={`carousel-item-${stateId}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasMovedRef.current) {
                    onStateClick(stateId);
                  }
                }}
                onMouseEnter={() => onStateHover(stateId, 'toolbar')}
                onMouseLeave={() => onStateHover(null, 'toolbar')}
                className={`card-estado-carrossel item-estado-${stateId.toLowerCase()} flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border shadow-lg ${
                  isSelected
                    ? 'bg-amber-950/95 border-amber-400 ring-2 ring-amber-400/40 text-amber-100 scale-105'
                    : isHovered
                    ? 'bg-slate-900/95 border-amber-400/80 text-amber-200 scale-102'
                    : isCompleted
                    ? 'bg-slate-950/85 border-emerald-500/60 text-emerald-100 hover:border-emerald-400'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {/* Coat of arms */}
                <div className="brasao-miniatura w-5 h-5 rounded-full overflow-hidden bg-slate-900 p-0.5 border border-white/10 shrink-0">
                  {coatOfArms ? (
                    <img
                      src={coatOfArms}
                      alt={guardian.stateNamePt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="sigla-estado font-bold text-xs">{stateId}</span>
                    <span className="nome-estado text-[10px] text-slate-400 truncate max-w-[80px]">
                      {guardian.stateNamePt}
                    </span>
                  </div>
                </div>

                {isCompleted && (
                  <CheckCircle2 className="icone-status-concluido w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scrollBy(240)}
          className="btn-carrossel-direita absolute right-1 z-10 p-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700 shadow-xl hover:bg-slate-800 hover:text-white transition-colors"
          title="Rolar para a direita"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
