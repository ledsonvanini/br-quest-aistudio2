import React from 'react';
import { Disc, Radio, Volume2, ChevronRight } from 'lucide-react';

interface MusicalTooltipSectionProps {
  stateId: string;
  stateName: string;
  capital: string;
  flagUrl?: string | null;
  coatOfArmsUrl?: string | null;
  musicalHeritage: any;
  eraHighlights: any;
  radioEra: any;
}

export const MusicalTooltipSection: React.FC<MusicalTooltipSectionProps> = ({
  stateId,
  stateName,
  capital,
  flagUrl,
  coatOfArmsUrl,
  musicalHeritage,
  eraHighlights,
  radioEra,
}) => {
  return (
    <div className="balao-hover-musicalidades space-y-2">
      {/* Header com Bandeira, Brasão, Estado e Frequência do Dial */}
      <div className="header-hover-musical flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`Bandeira de ${stateName}`}
              className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          {coatOfArmsUrl && (
            <img
              src={coatOfArmsUrl}
              alt={stateName}
              className="w-6 h-6 object-contain drop-shadow shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h4 className="font-black text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-400/50">
                {stateId}
              </span>
              <span className="truncate font-serif font-bold text-amber-100">{stateName}</span>
            </h4>
            <p className="text-[11px] text-amber-300/70 font-medium truncate mt-0.5">Capital: {capital}</p>
          </div>
        </div>

        <div className="badge-frequencia-dial px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{musicalHeritage?.frequencyDialKHz ? `${musicalHeritage.frequencyDialKHz} kHz` : '840 kHz'}</span>
        </div>
      </div>

      {/* Destaque da Era Musical e Emissora */}
      <div className="card-hover-musical-conteudo p-2 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold font-serif min-w-0">
            <Disc className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
            <span className="truncate">{eraHighlights?.movementName || 'Patrimônio Musical'}</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300/90 border border-amber-700/40 shrink-0">
            {radioEra?.decade || radioEra?.shortName}
          </span>
        </div>

        {eraHighlights?.keyArtists && (
          <div className="text-[10.5px] text-slate-300 line-clamp-2 leading-relaxed">
            <span className="text-amber-300/80 font-semibold">Expoentes: </span>
            {eraHighlights.keyArtists}
          </div>
        )}

        {musicalHeritage?.famousBroadcastingStation && (
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono truncate pt-1 border-t border-slate-800">
            <Radio className="w-3 h-3 text-amber-400/80 shrink-0" />
            <span className="truncate">{musicalHeritage.famousBroadcastingStation}</span>
          </div>
        )}
      </div>

      {/* Dica de Ação / Rodapé */}
      <div className="rodape-acao-musical pt-0.5 flex items-center justify-between text-[10.5px] text-amber-300/90 font-medium">
        <span className="flex items-center gap-1.5 truncate">
          <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">Clique para sintonizar a rádio e isolar</span>
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      </div>
    </div>
  );
};
