import React from 'react';
import { Camera, Sparkles, Compass, Check } from 'lucide-react';
import { ASTRONOMICAL_SCENE_PRESETS, AstronomicalScenePreset } from '../../lib/globeEngine/astronomicalScenes';
import { audioEngine } from '../../lib/audioSynth';

interface AstronomicalScenesSelectorProps {
  activePresetId?: string;
  onSelectScenePreset: (presetId: string) => void;
  isPlanetsAligned?: boolean;
  onTogglePlanetsAlignment?: () => void;
}

export const AstronomicalScenesSelector: React.FC<AstronomicalScenesSelectorProps> = ({
  activePresetId,
  onSelectScenePreset,
  isPlanetsAligned,
  onTogglePlanetsAlignment,
}) => {
  return (
    <div className="bg-slate-900/85 p-3 rounded-2xl border border-amber-500/25 space-y-2.5 shadow-md">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
        <span className="flex items-center gap-1.5 text-amber-300">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          Cenas Astronômicas Pré-Definidas
        </span>
        <span className="text-[9.5px] font-mono text-slate-400">1-Clique</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {ASTRONOMICAL_SCENE_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onSelectScenePreset(preset.id);
              }}
              className={`p-2 rounded-xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base leading-none">{preset.icon}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    isSelected ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {preset.badge}
                </span>
              </div>
              <div className="text-[11px] font-bold truncate">{preset.shortLabel}</div>
              <div className="text-[9px] text-slate-400 line-clamp-1 leading-tight">
                {preset.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão Especial: Alinhar Astros (Conjunção Radial Linear) */}
      {onTogglePlanetsAlignment && (
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            onTogglePlanetsAlignment();
          }}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer border transition-all ${
            isPlanetsAligned
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
              : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-500/40'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alinhar Astros em Linha (Como na Imagem)</span>
          </span>
          <span className="text-[10px] font-mono opacity-80">
            {isPlanetsAligned ? 'Ativo' : 'Alinhar'}
          </span>
        </button>
      )}
    </div>
  );
};
