import React from 'react';
import { Info } from 'lucide-react';
import {
  ASTRONOMICAL_MILESTONES,
  AstronomicalMilestone,
} from '../../lib/globeEngine/orbitalMilestones';

export interface AstronomicalMilestonesCardProps {
  activeMilestone: AstronomicalMilestone;
  onSelectMilestone: (m: AstronomicalMilestone) => void;
}

export const AstronomicalMilestonesCard: React.FC<AstronomicalMilestonesCardProps> = ({
  activeMilestone,
  onSelectMilestone,
}) => {
  return (
    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          Marcos Astronômicos da Órbita
        </span>
        <span className="text-amber-300 font-normal">Clique para Navegar</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {ASTRONOMICAL_MILESTONES.map((m) => {
          const isSelected = activeMilestone.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMilestone(m)}
              className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800/90'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span>{m.icon}</span>
                <span className="text-[9px] font-mono text-slate-400">
                  {m.dateStr.split(' ')[0]} {m.dateStr.split(' ')[2]?.slice(0, 3)}
                </span>
              </div>
              <div className="text-[11px] font-bold truncate mt-0.5">{m.label}</div>
              <div className="text-[9.5px] text-slate-400">{m.seasonName}</div>
            </button>
          );
        })}
      </div>

      {activeMilestone && (
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-amber-300 font-semibold text-[11px]">
            <span className="flex items-center gap-1.5">
              <span>{activeMilestone.icon}</span>
              {activeMilestone.label} — {activeMilestone.dateStr}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Declinação: {activeMilestone.declination}
            </span>
          </div>
          <p className="text-[10.5px] text-slate-300 leading-relaxed">
            {activeMilestone.axialTiltExplanation}
          </p>
          <div className="text-[10px] text-sky-300/90 bg-sky-950/40 p-1.5 rounded border border-sky-900/40">
            <strong>Efeito no Brasil:</strong> {activeMilestone.brazilSolarEffect}
          </div>
        </div>
      )}
    </div>
  );
};
