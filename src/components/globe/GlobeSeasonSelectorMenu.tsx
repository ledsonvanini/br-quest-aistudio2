/**
 * GlobeSeasonSelectorMenu - Seletor de Estações do Ano e Solstícios/Equinócios
 * Configura a inclinação axial da Terra (23,44°) e a posição da órbita solar.
 */
import React from 'react';
import { Calendar, Check, ChevronDown } from 'lucide-react';
import { GlobeSeason } from '../../lib/globeEngine';

const SEASONS: { id: GlobeSeason; label: string; desc: string; icon: string }[] = [
  {
    id: 'realtime',
    label: 'Tempo Real (Agora)',
    desc: 'Iluminação baseada na data e hora oficial de Brasília.',
    icon: '🌐',
  },
  {
    id: 'summer_solstice',
    label: 'Verão Austral (Dez)',
    desc: 'Solstício de Verão: máxima insolação sobre o Hemisfério Sul.',
    icon: '☀️',
  },
  {
    id: 'autumn_equinox',
    label: 'Outono Austral (Mar)',
    desc: 'Equinócio de Outono: iluminação simétrica sobre a Linha do Equador.',
    icon: '🍂',
  },
  {
    id: 'winter_solstice',
    label: 'Inverno Austral (Jun)',
    desc: 'Solstício de Inverno: noites mais longas e menor insolação no Brasil.',
    icon: '❄️',
  },
  {
    id: 'spring_equinox',
    label: 'Primavera Austral (Set)',
    desc: 'Equinócio de Primavera: transição para o aquecimento austral.',
    icon: '🌸',
  },
];

interface GlobeSeasonSelectorMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSeason: GlobeSeason;
  onChangeSeason: (season: GlobeSeason) => void;
}

export const GlobeSeasonSelectorMenu: React.FC<GlobeSeasonSelectorMenuProps> = ({
  isOpen,
  onToggle,
  currentSeason,
  onChangeSeason,
}) => {
  const current = SEASONS.find((s) => s.id === currentSeason) || SEASONS[0];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        id="btn-seletor-estacoes"
        onClick={onToggle}
        className={`btn-seletor-estacoes w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm shrink-0 ${
          isOpen
            ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-amber-500/20 ring-1 ring-amber-400/50'
            : 'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700/80 text-slate-200 hover:text-amber-300'
        }`}
        title={`Estações do Ano: ${current.label} & Solstícios/Equinócios`}
        aria-label="Estações do Ano"
      >
        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="popover-seletor-estacoes"
          className="popover-seletor-estacoes fixed bottom-16 left-[56px] right-2 sm:absolute sm:bottom-full sm:mb-2.5 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-80 w-auto max-w-sm max-h-[min(480px,calc(100vh-100px))] overflow-y-auto rounded-2xl bg-[#030712] border border-amber-500/50 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.98)] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-slate-700"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/30">
            <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Estações & Solstícios</span>
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">
              Hemisfério Sul (BR)
            </span>
          </div>

          <div className="space-y-1">
            {SEASONS.map((season) => {
              const isSelected = currentSeason === season.id;
              return (
                <button
                  key={season.id}
                  id={`btn-estacao-${season.id}`}
                  type="button"
                  onClick={() => {
                    onChangeSeason(season.id);
                    onToggle();
                  }}
                  className={`btn-estacao-opcao w-full text-left p-2 rounded-xl text-xs transition-all flex items-start justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-100 border-amber-400 shadow-sm shadow-amber-500/20 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 border-transparent hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-base shrink-0 pt-0.5">{season.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100">{season.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {season.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1.5 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
