import React from 'react';
import { Sparkles, Radio, Music, Disc, ArrowRight, Volume2, X } from 'lucide-react';
import { getStateMusicalHeritage } from '../../data/musicalHeritageData';
import { getStateHighlightsForEra, VINTAGE_RADIO_ERAS } from '../../data/vintageRadioEras';
import { GUARDIANS_DATA } from '../../data/guardiansData';

interface MusicalStateMapCardProps {
  stateId: string | null;
  selectedRadioEraId?: string;
  onTuneState?: (stateId: string) => void;
  onClose?: () => void;
}

export const MusicalStateMapCard: React.FC<MusicalStateMapCardProps> = ({
  stateId,
  selectedRadioEraId = 'catedral_1930_1940',
  onTuneState,
  onClose,
}) => {
  if (!stateId) return null;

  const stateData = getStateMusicalHeritage(stateId);
  const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
  const era = VINTAGE_RADIO_ERAS.find((e) => e.id === selectedRadioEraId) || VINTAGE_RADIO_ERAS[0];
  const highlights = getStateHighlightsForEra(stateId, selectedRadioEraId);

  return (
    <div
      id={`card-detalhes-musical-${stateId.toLowerCase()}`}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="painel-card-musical-mapa fixed top-20 sm:top-24 right-3 sm:right-6 lg:right-8 z-40 w-80 sm:w-96 max-w-[calc(100vw-24px)] bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500/70 rounded-2xl shadow-2xl p-4 text-slate-100 animate-in fade-in slide-in-from-right-4 duration-200 pointer-events-auto select-none space-y-2.5"
      role="region"
      aria-label={`Patrimônio Musical de ${stateData.stateName}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-amber-900/60 pb-2">
        <div className="flex items-center gap-2.5">
          {guardian?.avatarUrl ? (
            <img
              src={guardian.avatarUrl}
              alt={stateData.stateName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-cover border border-amber-500/50 drop-shadow-md shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-serif font-black text-xs text-amber-300">
              {stateId}
            </div>
          )}

          <div>
            <div className="text-xs font-serif font-black text-amber-200 leading-tight">
              {stateData.stateName} ({stateId})
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Capital: {stateData.capitalName} • {stateData.famousBroadcastingStation}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-black text-amber-300">
            {stateData.frequencyDialKHz} kHz
          </div>
          {onClose && (
            <button
              id="btn-fechar-card-musical"
              onClick={onClose}
              className="btn-fechar-card-musical p-1 rounded-md text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 transition-colors cursor-pointer"
              title="Fechar detalhes do estado"
              aria-label="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Destaque da Era Musical Ativa */}
      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-1">
        <div className="flex items-center justify-between text-[9px] font-mono text-amber-400 font-bold">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            ERA {era.decade.toUpperCase()}
          </span>
          <span className="text-yellow-300">{era.shortName}</span>
        </div>

        <div className="text-xs font-serif font-black text-amber-200">
          {highlights.movementName}
        </div>

        <div className="text-[10px] text-slate-300 leading-snug">
          <strong className="text-amber-300 font-semibold">Artistas:</strong> {highlights.keyArtists}
        </div>
      </div>

      {/* Curiosidade Fonográfica */}
      <div className="text-[10px] text-slate-400 font-sans italic line-clamp-2">
        "{highlights.historicalFact}"
      </div>

      {/* Botão de Sintonia */}
      <button
        id="btn-sintonizar-radio-estado"
        onClick={() => onTuneState?.(stateId)}
        className="btn-sintonizar-radio-estado w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-serif font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>Sintonizar {stateData.stateName} no Rádio</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
