import React from 'react';
import { Play, Pause, Radio, Disc, Sliders } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { vintageRadioEngine, RadioPlaybackState } from '../../lib/vintageRadioEngine';
import { StateMusicalHeritage } from '../../data/musicalHeritageData';

interface FooterRadioTickerProps {
  radioState: RadioPlaybackState;
  activeMusicStateData: StateMusicalHeritage;
  onToggleRadio?: () => void;
}

export const FooterRadioTicker: React.FC<FooterRadioTickerProps> = ({
  radioState,
  activeMusicStateData,
  onToggleRadio,
}) => {
  return (
    <div
      id="painel-radio-ticker-rodape"
      className="painel-radio-ticker-rodape flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 text-xs shadow-md animate-in fade-in duration-150"
    >
      {/* Botão Play / Pause */}
      <button
        id="btn-rodape-play-pause"
        onClick={() => {
          audioEngine.playSfx('click');
          vintageRadioEngine.togglePlayPause();
        }}
        className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 hover:text-white transition cursor-pointer shrink-0"
        title={radioState.isPlaying ? 'Pausar Áudio' : 'Tocar Áudio'}
        aria-label={radioState.isPlaying ? 'Pausar' : 'Tocar'}
      >
        {radioState.isPlaying ? (
          <Pause className="w-3 h-3 text-amber-300 fill-amber-300" />
        ) : (
          <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
        )}
      </button>

      {/* Emissora Ativa */}
      <div
        className="flex items-center gap-1.5 text-amber-300 font-serif font-bold truncate"
        title={`Estação: ${activeMusicStateData.stateName} (${activeMusicStateData.frequencyDialKHz} kHz)`}
      >
        <Radio className={`w-3.5 h-3.5 text-amber-400 shrink-0 ${radioState.isPlaying ? 'animate-pulse' : ''}`} />
        <span className="font-mono text-xs text-amber-200">
          {activeMusicStateData.stateId} • {activeMusicStateData.frequencyDialKHz} kHz
        </span>
      </div>

      <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

      {/* Faixa Musical */}
      <div
        className="flex items-center gap-1 text-[11px] font-mono text-slate-300 truncate max-w-[160px] sm:max-w-[220px]"
        title={radioState.currentTrackTitle || activeMusicStateData.stateAnthem.title}
      >
        <Disc className={`w-3 h-3 text-amber-400 shrink-0 ${radioState.isPlaying ? 'animate-spin' : ''}`} />
        <span className="truncate text-amber-200">
          {radioState.currentTrackTitle || activeMusicStateData.stateAnthem.title}
        </span>
      </div>

      {/* Botão Sintonizador (Ícone Expressivo) */}
      {onToggleRadio && (
        <button
          id="btn-toggle-radio-rodape"
          onClick={() => {
            audioEngine.playSfx('click');
            onToggleRadio();
          }}
          className="btn-abrir-radio p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 hover:text-white transition cursor-pointer shrink-0"
          title="Abrir / Fechar Gabinete de Rádio e Sintonizador"
          aria-label="Sintonizador de Rádio"
        >
          <Sliders className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
