/**
 * GlobeAstroSelectorMenu - Seletor de Astros e Planetas Celestes
 * Permite navegação direta entre a Terra (Brasil), o Sol, a Lua e planetas do Sistema Solar.
 */
import React from 'react';
import { Sparkles, Globe, Sun, Moon, Check, ChevronDown } from 'lucide-react';

export interface AstroOption {
  id: string;
  name: string;
  symbol: string;
  type: 'terra' | 'sol' | 'lua' | 'planeta';
  color: string;
  realDistance: string;
  curiosity: string;
}

export const CELESTIAL_ASTROS_LIST: AstroOption[] = [
  {
    id: 'terra',
    name: 'Planeta Terra',
    symbol: '🜨',
    type: 'terra',
    color: '#38bdf8',
    realDistance: '0 km (Brasil)',
    curiosity: 'Nosso lar no cosmos, com 27 Unidades Federativas visíveis.',
  },
  {
    id: 'sol',
    name: 'O Sol',
    symbol: '☉',
    type: 'sol',
    color: '#f59e0b',
    realDistance: '149,6 Milhões km (1 UA)',
    curiosity: 'Estrela anã amarela que sustenta a vida na Terra.',
  },
  {
    id: 'lua',
    name: 'A Lua',
    symbol: '☽',
    type: 'lua',
    color: '#e2e8f0',
    realDistance: '384.400 km',
    curiosity: 'Único satélite natural da Terra com rotação sincronizada.',
  },
  {
    id: 'mercurio',
    name: 'Mercúrio',
    symbol: '☿',
    type: 'planeta',
    color: '#a3a3a3',
    realDistance: '91,7 Milhões km',
    curiosity: 'O menor planeta e o mais veloz em sua órbita ao redor do Sol.',
  },
  {
    id: 'venus',
    name: 'Vênus',
    symbol: '♀',
    type: 'planeta',
    color: '#fde047',
    realDistance: '41,4 Milhões km',
    curiosity: 'O planeta mais quente do Sistema Solar por efeito estufa extremo.',
  },
  {
    id: 'marte',
    name: 'Marte',
    symbol: '♂',
    type: 'planeta',
    color: '#ef4444',
    realDistance: '78,3 Milhões km',
    curiosity: 'Planeta Vermelho com as maiores montanhas vulcânicas.',
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    symbol: '♃',
    type: 'planeta',
    color: '#d97706',
    realDistance: '628,7 Milhões km',
    curiosity: 'O gigante gasoso com mais que o dobro da massa de todos os outros planetas.',
  },
  {
    id: 'saturno',
    name: 'Saturno',
    symbol: '♄',
    type: 'planeta',
    color: '#eab308',
    realDistance: '1,28 Bilhões km',
    curiosity: 'Famoso pelo seu vasto sistema de anéis formados por gelo e rocha.',
  },
];

interface GlobeAstroSelectorMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedAstroId?: string;
  onSelectAstro: (astroId: string) => void;
}

export const GlobeAstroSelectorMenu: React.FC<GlobeAstroSelectorMenuProps> = ({
  isOpen,
  onToggle,
  selectedAstroId = 'terra',
  onSelectAstro,
}) => {
  const currentAstro =
    CELESTIAL_ASTROS_LIST.find((a) => a.id === selectedAstroId) || CELESTIAL_ASTROS_LIST[0];

  const renderAstroIcon = (type: string, color: string) => {
    switch (type) {
      case 'terra':
        return <Globe className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'sol':
        return <Sun className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'lua':
        return <Moon className="w-4 h-4 text-slate-300 shrink-0" />;
      default:
        return (
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          />
        );
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        id="btn-seletor-astros"
        onClick={onToggle}
        className={`btn-seletor-astros w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm shrink-0 ${
          isOpen
            ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-cyan-500/20 ring-1 ring-cyan-400/50'
            : 'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700/80 text-slate-200 hover:text-cyan-300'
        }`}
        title={`Astros Celestes & Planetas: ${currentAstro.name} (Navegação Interplanetária)`}
        aria-label="Astros Celestes"
      >
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="popover-seletor-astros"
          className="popover-seletor-astros fixed bottom-16 left-[56px] right-2 sm:absolute sm:bottom-full sm:mb-2.5 sm:left-0 sm:right-auto sm:w-80 w-auto max-w-sm max-h-[min(480px,calc(100vh-100px))] overflow-y-auto rounded-2xl bg-[#030712] border border-cyan-500/50 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-slate-700"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/30">
            <span className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Astros Celestes</span>
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono">
              {CELESTIAL_ASTROS_LIST.length} Corpos
            </span>
          </div>

          <div className="space-y-1 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-0.5">
            {CELESTIAL_ASTROS_LIST.map((astro) => {
              const isSelected = selectedAstroId === astro.id;
              return (
                <button
                  key={astro.id}
                  id={`btn-astro-${astro.id}`}
                  type="button"
                  onClick={() => {
                    onSelectAstro(astro.id);
                    onToggle();
                  }}
                  className={`btn-astro-opcao w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-100 border-cyan-400 shadow-sm shadow-cyan-500/20 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 border-transparent hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 text-center font-serif text-sm opacity-90">
                      {astro.symbol}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-100">{astro.name}</span>
                        {renderAstroIcon(astro.type, astro.color)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {astro.realDistance}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
