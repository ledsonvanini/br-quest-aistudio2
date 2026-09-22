import React, { useState } from 'react';
import {
  X,
  Radio,
  Music,
  Disc,
  Volume2,
  Maximize2,
  Minimize2,
  Award,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { getStateMusicalHeritage } from '../../data/musicalHeritageData';
import { getStateHighlightsForEra, VINTAGE_RADIO_ERAS } from '../../data/vintageRadioEras';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { audioEngine } from '../../lib/audioSynth';
import { vintageRadioEngine } from '../../lib/vintageRadioEngine';
import { MusicStateQuickSwitcher } from './MusicStateQuickSwitcher';

interface StateMusicDialogProps {
  stateId: string;
  selectedRadioEraId?: string;
  onClose: () => void;
  onSelectState?: (stateId: string) => void;
  onTuneState?: (stateId: string) => void;
  onToggleExpand?: (expanded: boolean) => void;
}

export const StateMusicDialog: React.FC<StateMusicDialogProps> = ({
  stateId,
  selectedRadioEraId = 'catedral_1930_1940',
  onClose,
  onSelectState,
  onTuneState,
  onToggleExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);

  const stateData = getStateMusicalHeritage(stateId);
  const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
  const era = VINTAGE_RADIO_ERAS.find((e) => e.id === selectedRadioEraId) || VINTAGE_RADIO_ERAS[0];
  const highlights = getStateHighlightsForEra(stateId, selectedRadioEraId);

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    const next = !isExpanded;
    setIsExpanded(next);
    onToggleExpand?.(next);
  };

  const handlePlayAnthemPreview = () => {
    if (!guardian) return;
    setIsPlayingAnthem(true);
    audioEngine.playHymnArpeggio(guardian.hymnFrequencies);
    setTimeout(() => {
      setIsPlayingAnthem(false);
    }, 8000);
  };

  const handleTuneRadio = () => {
    audioEngine.playSfx('click');
    vintageRadioEngine.updateMetadata({ frequencyDialKHz: stateData.frequencyDialKHz });
    if (stateData.stateAnthem?.frequenciesHz) {
      vintageRadioEngine.playTrack(stateData.stateAnthem.frequenciesHz);
    }
    onTuneState?.(stateId);
  };

  return (
    <aside
      id={`dialog-applateral-musical-${stateId.toLowerCase()}`}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={`painel-applateral-musical fixed top-16 sm:top-20 right-2 sm:right-4 z-40 flex flex-col bg-[#0b0c16]/95 backdrop-blur-2xl border-2 border-amber-500/60 rounded-2xl shadow-2xl shadow-black/90 text-white transition-all duration-300 pointer-events-auto select-none overflow-hidden ${
        isExpanded ? 'w-[340px] sm:w-[420px] md:w-[460px] max-h-[85vh]' : 'w-[300px] sm:w-[340px] max-h-[70vh]'
      }`}
      aria-label={`Patrimônio Musical de ${stateData.stateName}`}
    >
      {/* Top Header */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-900/40 border-b border-amber-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {guardian?.avatarUrl ? (
            <img
              src={guardian.avatarUrl}
              alt={stateData.stateName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-md shadow-amber-950"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center font-serif font-black text-amber-300">
              {stateId}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300">
                {stateData.stateName} ({stateId})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[10px] font-mono font-bold text-amber-300">
                {stateData.frequencyDialKHz} kHz
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-serif font-black text-amber-100 leading-tight">
              {stateData.famousBroadcastingStation}
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Capital: {stateData.capitalName} • Dial AM/SW
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleExpand}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Recolher' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-painel p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar Detalhes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seletor Rápido de Estados Brasileiros */}
      <MusicStateQuickSwitcher
        currentStateId={stateId}
        onSelectState={(newId) => {
          if (onSelectState) {
            onSelectState(newId);
          } else if (onTuneState) {
            onTuneState(newId);
          }
        }}
      />

      {/* Conteúdo com Rolagem */}
      <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1 text-xs text-slate-300">
        {/* Destaque da Era Musical */}
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ERA {era.decade.toUpperCase()}
            </span>
            <span className="text-yellow-300">{era.shortName}</span>
          </div>

          <div className="text-sm font-serif font-black text-amber-200">
            {highlights.movementName}
          </div>

          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Artistas Notáveis:</strong>{' '}
            {highlights.keyArtists}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            {highlights.historicalFact}
          </p>
        </div>

        {/* Hino Oficial do Estado */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Hino Oficial do Estado
            </span>
            <button
              type="button"
              onClick={handlePlayAnthemPreview}
              disabled={isPlayingAnthem}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-[10px] font-bold text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
            >
              {isPlayingAnthem ? (
                <>
                  <Volume2 className="w-3 h-3 text-amber-300 animate-pulse" />
                  <span>Tocando...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-amber-300" />
                  <span>Ouvir Melodia</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-200">
            {stateData.stateAnthem?.title || 'Hino Estadual'}
          </div>

          {stateData.stateAnthem?.lyricsExcerptPt && (
            <p className="text-[11px] text-slate-400 italic line-clamp-3">
              &ldquo;{stateData.stateAnthem.lyricsExcerptPt}&rdquo;
            </p>
          )}
        </div>

        {/* Canções & Ritmos Tradicionais */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-amber-400" />
            Top 5 Clássicos Regionais
          </div>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {stateData.top5Tracks.slice(0, 5).map((song, i) => (
              <li key={song.id || i} className="flex items-center gap-1.5">
                <span className="w-4 text-center font-mono text-amber-400 font-bold">{i + 1}.</span>
                <span>{song.title} - <span className="text-slate-400">{song.artist}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Fixo: Sintonizar Rádio */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={handleTuneRadio}
          className="btn-acao-viajar-estado w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950 transition-all cursor-pointer"
        >
          <Radio className="w-4 h-4" />
          <span>Sintonizar {stateData.frequencyDialKHz} kHz no Rádio Retrô</span>
        </button>
      </div>
    </aside>
  );
};
