import React from 'react';
import { Compass, Award } from 'lucide-react';
import { StateSearchPopover } from '../map/StateSearchPopover';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { audioEngine } from '../../lib/audioSynth';

interface FooterAdventureTickerProps {
  completedSet: Set<string>;
  hoveredStateId: string | null;
  onStateClick: (stateId: string) => void;
  onOpenBrQuestHub?: () => void;
}

export const FooterAdventureTicker: React.FC<FooterAdventureTickerProps> = ({
  completedSet,
  hoveredStateId,
  onStateClick,
  onOpenBrQuestHub,
}) => {
  const hGuardian = hoveredStateId ? GUARDIANS_DATA.find((g) => g.id === hoveredStateId) : null;
  const flagUrl = hoveredStateId ? getStateFlagUrl(hoveredStateId) : null;

  return (
    <div
      id="painel-aventura-ticker-rodape"
      className="painel-aventura-ticker-rodape flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-slate-950/90 border border-amber-500/40 text-xs shadow-md animate-in fade-in duration-150 max-w-[95vw] sm:max-w-max overflow-x-auto no-scrollbar shrink-0"
    >
      {/* 1. Lupa de Pesquisa de Estados */}
      <StateSearchPopover
        completedStateIds={completedSet}
        onStateClick={onStateClick}
      />

      <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

      {/* 2. Conteúdo Expressivo */}
      {hGuardian ? (
        <div className="flex items-center gap-1.5 min-w-0 shrink-0 animate-in fade-in duration-100">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`Bandeira de ${hGuardian.stateNamePt}`}
              className="w-5 h-3.5 object-cover rounded border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-black border border-amber-400/40 shrink-0">
            {hGuardian.id}
          </span>
          <span className="font-serif font-bold text-slate-100 text-xs truncate max-w-[120px] sm:max-w-none">
            {hGuardian.stateNamePt}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div
            className="flex items-center text-amber-300 cursor-default"
            title="Cartografia: 27 Estados do Brasil"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>

          {onOpenBrQuestHub && (
            <button
              id="btn-rodape-abrir-brquest"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onOpenBrQuestHub();
              }}
              className="btn-iniciar-brquest-rodape flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-serif font-black text-[10px] shadow-sm transition cursor-pointer shrink-0"
              title="Abrir a Grande Prova do Brasil & Desafios Regionais"
            >
              <Award className="w-3 h-3 text-slate-950 shrink-0" />
              <span>BrQuest</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
