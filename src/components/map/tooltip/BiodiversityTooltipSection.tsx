import React from 'react';
import { Bird, ShieldAlert } from 'lucide-react';

interface BiodiversityTooltipSectionProps {
  stateId: string;
  capital: string;
  flagUrl?: string | null;
  bioProfile: any;
}

export const BiodiversityTooltipSection: React.FC<BiodiversityTooltipSectionProps> = ({
  stateId,
  capital,
  flagUrl,
  bioProfile,
}) => {
  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`Bandeira de ${bioProfile.stateName}`}
              className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h4 className="font-black text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-mono font-black text-xs shrink-0">
                {stateId}
              </span>
              <span className="truncate font-serif font-bold text-white tracking-wide">{bioProfile.stateName}</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              Capital: <strong className="text-slate-200">{capital}</strong> • Região {bioProfile.region}
            </p>
          </div>
        </div>

        <div className="px-2 py-0.5 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
          {bioProfile.predominantBiomes?.[0] || 'Bioma'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
          <Bird className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block">Espécies</span>
            <strong className="text-white text-xs block font-bold truncate">
              {bioProfile.totalKnownSpeciesEst?.toLocaleString('pt-BR') || '1.200+'}
            </strong>
          </div>
        </div>
        <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block">Ameaçadas</span>
            <strong className="text-rose-300 text-xs block font-bold truncate">
              {bioProfile.threatenedSpeciesCount || 0} espécies
            </strong>
          </div>
        </div>
      </div>

      {bioProfile.specimens && bioProfile.specimens.length > 0 && (
        <div className="pt-1.5 border-t border-slate-800 text-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Espécies Símbolo:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {bioProfile.specimens.slice(0, 2).map((sp: any, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-200 text-[11px] font-medium truncate max-w-full"
              >
                {sp.namePt}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
