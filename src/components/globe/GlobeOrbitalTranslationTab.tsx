import React, { useState } from 'react';
import {
  RotateCw,
  Globe2,
  Calendar,
  Sun,
} from 'lucide-react';
import {
  ASTRONOMICAL_MILESTONES,
  AstronomicalMilestone,
} from '../../lib/globeEngine/orbitalMilestones';
import { HeliocentricOrbitalState } from '../../lib/globeEngine/orbitalPhysics';
import { audioEngine } from '../../lib/audioSynth';
import { AstronomicalScenesSelector } from './AstronomicalScenesSelector';
import { PlanetaryOrderList } from './PlanetaryOrderList';
import { GlobeFilledSlider } from './GlobeFilledSlider';
import { AstronomicalMilestonesCard } from './AstronomicalMilestonesCard';
import { FullYearSimulationCard } from './FullYearSimulationCard';

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
      {/* 1. DESTAQUE MÁXIMO: SIMULAÇÃO DE 1 ANO COMPLETO COM SLIDER DE VELOCIDADE */}
      <FullYearSimulationCard
        orbitalDayOfYear={orbitalDayOfYear}
        onChangeOrbitalDayOfYear={onChangeOrbitalDayOfYear}
        isOrbitalPlaying={isOrbitalPlaying}
        onToggleOrbitalPlay={onToggleOrbitalPlay}
        orbitalSpeedDaysPerSec={orbitalSpeedDaysPerSec}
        onChangeOrbitalSpeed={onChangeOrbitalSpeed}
        orbitalState={orbitalState}
      />

      {/* 2. SELETOR DE CENAS PRÉ-DEFINIDAS (ASTRONOMICAL PRESETS) */}
      {onSelectScenePreset && (
        <AstronomicalScenesSelector
          activePresetId={activeScenePresetId}
          onSelectScenePreset={onSelectScenePreset}
          isPlanetsAligned={isPlanetsAligned}
          onTogglePlanetsAlignment={onTogglePlanetsAlignment}
        />
      )}

      {/* 3. PONTO DE VISTA DE CÂMERA (TERRA vs SOL) */}
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

      {/* 4. MARCOS ASTRONÔMICOS DA ÓRBITA */}
      <AstronomicalMilestonesCard
        activeMilestone={activeMilestone}
        onSelectMilestone={handleSelectMilestone}
      />

      {/* 5. AJUSTE FINO DO DIA DO ANO E ROTAÇÃO AXIAL DA TERRA */}
      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
          <span>Ajuste Manual do Dia do Ano</span>
          <span className="text-amber-400 font-normal">Exploração Fina</span>
        </div>

        {/* Slider do Dia do Ano */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Dia Selecionado: <strong className="text-slate-200 font-mono">{Math.round(orbitalDayOfYear)} / 365</strong>
            </span>
            <span className="font-bold text-amber-300">{orbitalState.formattedDate}</span>
          </div>
          <GlobeFilledSlider
            min={1}
            max={365}
            step={1}
            value={Math.round(orbitalDayOfYear)}
            onChange={onChangeOrbitalDayOfYear}
            fillColorClass="bg-amber-400"
            ariaLabel="Dia do ano manual"
          />
        </div>

        {/* Botão de Giro Axial da Terra */}
        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Rotação Axial da Terra:</span>
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onToggleAxialRotation();
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
              isAxialRotationActive
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/25'
                : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border-sky-500/30'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isAxialRotationActive ? 'Pausar Giro' : 'Girar Terra'}</span>
          </button>
        </div>
      </div>

      {/* 6. ORDEM DOS PLANETAS DO SISTEMA SOLAR */}
      <PlanetaryOrderList
        onSelectPlanetAstro={onSelectPlanetAstro}
        onFocusSun={() => onChangeCameraFocusMode('sun')}
      />
    </div>
  );
};
