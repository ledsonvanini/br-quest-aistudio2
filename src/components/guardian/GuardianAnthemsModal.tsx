import React, { useState, useEffect, useRef } from 'react';
import {
  getAnthemPairForState,
  NATIONAL_ANTHEM_BRAZIL,
  AnthemItem,
} from '../../data/anthemsData';
import { CompassBadgeIcon } from './GuardianCommon';
import { Music, Play, Pause, X, Scroll } from 'lucide-react';

interface Props {
  stateId: string;
  onClose: () => void;
}

export const GuardianAnthemsModal: React.FC<Props> = ({ stateId, onClose }) => {
  const [selectedType, setSelectedType] = useState<'state' | 'national'>('state');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const anthemPair = getAnthemPairForState(stateId);
  const activeAnthem: AnthemItem =
    selectedType === 'state' ? anthemPair.stateAnthem : NATIONAL_ANTHEM_BRAZIL;

  const mp3Path = React.useMemo(() => {
    if (selectedType === 'national') return '/br/hino-nacional-brasileiro.mp3';
    if (stateId === 'RS' && selectedType === 'state') return '/RS/hino-rio-grandense.mp3';
    return null;
  }, [stateId, selectedType]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, [selectedType]);

  const handleTogglePlay = () => {
    if (!mp3Path) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(mp3Path);
      } else {
        audioRef.current.src = mp3Path;
      }
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio playback error:', err));
    }
  };

  return (
    <div className="container-modal-hinos absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-xl z-40 animate-in zoom-in-95 duration-200 select-none">
      <div className="painel-hinos-conteudo relative bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] space-y-3.5 text-slate-100 max-h-[78vh] flex flex-col">
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/40 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <CompassBadgeIcon icon={Music} size="md" active />
            <div>
              <h3 className="font-serif font-black text-sm sm:text-base text-amber-300">
                Hinos Sagrados
              </h3>
              <p className="text-[11px] text-slate-400 font-serif">
                Acervo Cívico do Estado e da Pátria
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              onClose();
            }}
            className="btn-fechar-hinos bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-1.5 rounded-xl border border-amber-500/50 transition cursor-pointer shadow"
            title="Fechar Hinos"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={() => setSelectedType('state')}
            className={`p-2 rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              selectedType === 'state'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="truncate">{anthemPair.stateAnthem.title}</span>
          </button>

          <button
            onClick={() => setSelectedType('national')}
            className={`p-2 rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              selectedType === 'national'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Hino Nacional Brasileiro</span>
          </button>
        </div>

        {/* Audio Player Card */}
        <div className="bg-slate-900 border border-amber-500/30 p-3 rounded-xl space-y-2 shrink-0 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <h4 className="font-serif font-bold text-xs sm:text-sm text-amber-200 truncate">
                {activeAnthem.title}
              </h4>
              <p className="text-[10px] text-slate-400 font-serif truncate">
                Letra: {activeAnthem.composers.lyrics} • Música: {activeAnthem.composers.music}
              </p>
            </div>

            {mp3Path ? (
              <button
                onClick={handleTogglePlay}
                className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shrink-0 ${
                  isPlaying
                    ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                    : 'bg-slate-950 text-amber-300 hover:bg-slate-850 border border-amber-500/40'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Tocar MP3'}</span>
              </button>
            ) : (
              <span className="text-[9px] text-slate-500 font-serif bg-slate-950 px-2 py-1 rounded border border-slate-800">
                Apenas Letra
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-300 font-serif leading-relaxed italic bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            {activeAnthem.historicalSourcePt}
          </div>
        </div>

        {/* Anthem Lyrics */}
        <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
          <div className="text-[10px] font-serif font-bold uppercase text-amber-400 flex items-center gap-1 shrink-0">
            <Scroll className="w-3 h-3 text-amber-400" />
            <span>Letra Oficial:</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl overflow-y-auto custom-scrollbar-gold flex-1 text-center font-serif text-xs leading-relaxed text-slate-200 whitespace-pre-line select-text">
            {activeAnthem.lyricsPt}
          </div>
        </div>
      </div>
    </div>
  );
};
