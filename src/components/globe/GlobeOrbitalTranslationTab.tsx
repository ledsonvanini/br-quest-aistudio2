import React, { useState } from 'react';
import {
  Play,
  Pause,
  Sun,
  RotateCw,
  Globe2,
  Calendar,
  Gauge,
  Sparkles,
  Info,
  Camera,
} from 'lucide-react';
import {
  ASTRONOMICAL_MILESTONES,
  AstronomicalMilestone,
} from '../../lib/globeEngine/orbitalMilestones';
import { HeliocentricOrbitalState } from '../../lib/globeEngine/orbitalPhysics';
import { audioEngine } from '../../lib/audioSynth';
import { AstronomicalScenesSelector } from './AstronomicalScenesSelector';
import { PlanetaryOrderList } from './PlanetaryOrderList';

interface GlobeOrbitalTranslationTabProps {
  orbitalDayOfYear: number;
  onChangeOrbitalDayOfYear: (day: number) => void;
  isOrbitalPlaying: boolean;
  onToggleOrbitalPlay: () => void;
  orbitalSpeedDaysPerSec: number;
  onChangeOrbitalSpeed: (speed: number) => void;
  isAxialRotationActive: boolean;
  onToggleAxialRotation: () => void;
  cameraFocusMode: 'earth' | 'sun';
  onChangeCameraFocusMode: (mode: 'earth' | 'sun') => void;
  onSelectPlanetAstro?: (astroId: string) => void;
  orbitalState: HeliocentricOrbitalState;
  activeScenePresetId?: string;
  onSelectScenePreset?: (presetId: string) => void;
  isPlanetsAligned?: boolean;
  onTogglePlanetsAlignment?: () => void;
}

export const GlobeOrbitalTranslationTab: React.FC<GlobeOrbitalTranslationTabProps> = ({
  orbitalDayOfYear,
  onChangeOrbitalDayOfYear,
  isOrbitalPlaying,
  onToggleOrbitalPlay,
  orbitalSpeedDaysPerSec,
  onChangeOrbitalSpeed,
  isAxialRotationActive,
  onToggleAxialRotation,
  cameraFocusMode,
  onChangeCameraFocusMode,
  onSelectPlanetAstro,
  orbitalState,
  activeScenePresetId,
  onSelectScenePreset,
  isPlanetsAligned,
  onTogglePlanetsAlignment,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('solsticio-verao');

  const activeMilestone =
    ASTRONOMICAL_MILESTONES.find((m) => m.id === selectedMilestoneId) ||
    ASTRONOMICAL_MILESTONES.find((m) => Math.abs(orbitalDayOfYear - m.day) < 8) ||
    ASTRONOMICAL_MILESTONES[0];

  const handleSelectMilestone = (m: AstronomicalMilestone) => {
    audioEngine.playSfx('click');
    setSelectedMilestoneId(m.id);
    onChangeOrbitalDayOfYear(m.day);
    if (onSelectScenePreset) {
      onSelectScenePreset(m.id);
    }
  };

  return (
    <div className="painel-orbital-translacao space-y-3 text-slate-200">
      {/* 1. SELETOR DE CENAS PRÉ-DEFINIDAS (ASTRONOMICAL PRESETS) */}
      {onSelectScenePreset && (
        <AstronomicalScenesSelector
          activePresetId={activeScenePresetId}
          onSelectScenePreset={onSelectScenePreset}
          isPlanetsAligned={isPlanetsAligned}
          onTogglePlanetsAlignment={onTogglePlanetsAlignment}
        />
      )}

      {/* 2. PONTO DE VISTA DE CÂMERA (TERRA vs SOL) */}
      <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
          <span>Ponto de Foco da Câmera</span>
          <span className="text-amber-400 font-normal">Heliocêntrico</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onChangeCameraFocusMode('earth');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border transition-all ${
              cameraFocusMode === 'earth'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border-sky-500/30'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Foco na Terra</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onChangeCameraFocusMode('sun');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border transition-all ${
              cameraFocusMode === 'sun'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-500/30'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Foco no Sol</span>
          </button>
        </div>
      </div>

      {/* 3. MARCOS ASTRONÔMICOS DA ÓRBITA */}
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
                onClick={() => handleSelectMilestone(m)}
                className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>{m.icon}</span>
                  <span className="text-[9px] font-mono text-slate-400">{m.dateStr.split(' ')[0]} {m.dateStr.split(' ')[2]?.slice(0, 3)}</span>
                </div>
                <div className="text-[11px] font-bold truncate mt-0.5">{m.label}</div>
                <div className="text-[9.5px] text-slate-400">{m.seasonName}</div>
              </button>
            );
          })}
        </div>

        {/* Card Explicativo com Ação de Câmera 3D */}
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

      {/* 4. CONTROLES DE MOVIMENTO: TRANSLAÇÃO & ROTAÇÃO */}
      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
          <span>Controles de Giro</span>
          <span className="text-amber-400 font-normal">Órbita e Eixo</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Translação Orbital */}
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onToggleOrbitalPlay();
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
              isOrbitalPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-500/30'
            }`}
          >
            {isOrbitalPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isOrbitalPlaying ? 'Pausar Translação' : 'Giro Translação'}</span>
          </button>

          {/* Rotação Axial da Terra */}
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onToggleAxialRotation();
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
              isAxialRotationActive
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/25'
                : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border-sky-500/30'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isAxialRotationActive ? 'Pausar Giro Terra' : 'Giro da Terra'}</span>
          </button>
        </div>

        {/* Slider do Dia do Ano */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Dia do Ano: <strong className="text-slate-200 font-mono">{Math.round(orbitalDayOfYear)} / 365</strong>
            </span>
            <span className="font-bold text-amber-300">{orbitalState.formattedDate}</span>
          </div>
          <input
            type="range"
            min={1}
            max={365}
            step={1}
            value={Math.round(orbitalDayOfYear)}
            onChange={(e) => onChangeOrbitalDayOfYear(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Velocidade da Translação */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            Velocidade:
          </span>
          <div className="flex items-center gap-1 font-mono">
            {[10, 30, 90].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onChangeOrbitalSpeed(spd);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                  orbitalSpeedDaysPerSec === spd
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                {spd}d/s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ORDEM DOS PLANETAS DO SISTEMA SOLAR */}
      <PlanetaryOrderList
        onSelectPlanetAstro={onSelectPlanetAstro}
        onFocusSun={() => onChangeCameraFocusMode('sun')}
      />
    </div>
  );
};
