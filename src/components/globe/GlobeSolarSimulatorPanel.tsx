import React, { useState } from 'react';
import {
  Sun,
  Globe2,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';
import { HeliocentricOrbitalState } from '../../lib/globeEngine/orbitalPhysics';
import { GlobeSolarLightingTab } from './GlobeSolarLightingTab';
import { GlobeOrbitalTranslationTab } from './GlobeOrbitalTranslationTab';

export interface GlobeSolarSimulatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
  solarHour: number | null;
  onChangeSolarHour: (hour: number | null) => void;
  isSolarCyclePlaying: boolean;
  onToggleSolarCycle: () => void;
  solarCycleSpeed?: number;
  onChangeSolarCycleSpeed?: (speed: number) => void;
  sunIntensity: number;
  onChangeSunIntensity: (intensity: number) => void;
  moonLightIntensity: number;
  onChangeMoonLightIntensity: (intensity: number) => void;
  ambientLightIntensity: number;
  onChangeAmbientLightIntensity: (intensity: number) => void;
  cityLightIntensity: number;
  onChangeCityLightIntensity: (intensity: number) => void;
  cloudsOpacity: number;
  onChangeCloudsOpacity: (opacity: number) => void;
  cloudsVisible: boolean;
  onToggleClouds: () => void;
  onResetDefaults: () => void;
  liveBrasilia: {
    formattedTime: string;
    formattedFull: string;
    hours: number;
    minutes: number;
    seconds: number;
    floatHours: number;
    periodName: string;
  };
  currentSolarStatus: 'dia' | 'crepusculo' | 'noite';
  // Orbital Translation & Heliocentric Keplerian Physics Props
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
  onSelectPlanetAstro?: (planetId: string) => void;
  orbitalState: HeliocentricOrbitalState;
  activeScenePresetId?: string;
  onSelectScenePreset?: (presetId: string) => void;
  isPlanetsAligned?: boolean;
  onTogglePlanetsAlignment?: () => void;
}

export const GlobeSolarSimulatorPanel: React.FC<GlobeSolarSimulatorPanelProps> = ({
  isOpen,
  onClose,
  isExpanded,
  onToggleExpand,
  solarHour,
  onChangeSolarHour,
  isSolarCyclePlaying,
  onToggleSolarCycle,
  solarCycleSpeed = 1,
  onChangeSolarCycleSpeed,
  sunIntensity,
  onChangeSunIntensity,
  moonLightIntensity,
  onChangeMoonLightIntensity,
  ambientLightIntensity,
  onChangeAmbientLightIntensity,
  cityLightIntensity,
  onChangeCityLightIntensity,
  cloudsOpacity,
  onChangeCloudsOpacity,
  cloudsVisible,
  onToggleClouds,
  onResetDefaults,
  liveBrasilia,
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
  const [activeMainTab, setActiveMainTab] = useState<'iluminacao' | 'orbita'>('iluminacao');

  if (!isOpen) return null;

  return (
    <div
      id="painel-simulador-solar-container"
      className={`painel-simulador-solar-container painel-hud-controles absolute top-4 right-4 z-40 bg-slate-950/95 backdrop-blur-md rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded
          ? 'w-[94vw] sm:w-[540px] max-h-[90vh]'
          : 'w-[92vw] sm:w-[410px] max-h-[84vh]'
      }`}
    >
      {/* CABEÇALHO DO PAINEL */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            {activeMainTab === 'iluminacao' ? <Sun className="w-4 h-4" /> : <Globe2 className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 leading-none">
              <span>Simulador Solar & Órbita</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h3>
            <span className="text-[10px] text-slate-400">
              {activeMainTab === 'iluminacao' ? 'Iluminação Dia/Noite 24h' : 'Translação Heliocêntrica 365d'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleExpand(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all cursor-pointer"
            title={isExpanded ? 'Recolher painel' : 'Expandir painel'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ABAS PRINCIPAIS: ILUMINAÇÃO (24H) VS ÓRBITA & TRANSLAÇÃO (365D) */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-900/40 shrink-0">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            id="tab-iluminacao-solar"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveMainTab('iluminacao');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
              activeMainTab === 'iluminacao'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Iluminação (24h)</span>
          </button>

          <button
            type="button"
            id="tab-translacao-solar"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveMainTab('orbita');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
              activeMainTab === 'orbita'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Translação & Órbita (365d)</span>
          </button>
        </div>
      </div>

      {/* CORPO DE CONTEÚDO COM SCROLL SUAVE */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 p-3.5 sm:p-4">
        {activeMainTab === 'iluminacao' ? (
          <GlobeSolarLightingTab
            solarHour={solarHour}
            onChangeSolarHour={onChangeSolarHour}
            isSolarCyclePlaying={isSolarCyclePlaying}
            onToggleSolarCycle={onToggleSolarCycle}
            solarCycleSpeed={solarCycleSpeed}
            onChangeSolarCycleSpeed={onChangeSolarCycleSpeed}
            sunIntensity={sunIntensity}
            onChangeSunIntensity={onChangeSunIntensity}
            moonLightIntensity={moonLightIntensity}
            onChangeMoonLightIntensity={onChangeMoonLightIntensity}
            ambientLightIntensity={ambientLightIntensity}
            onChangeAmbientLightIntensity={onChangeAmbientLightIntensity}
            cityLightIntensity={cityLightIntensity}
            onChangeCityLightIntensity={onChangeCityLightIntensity}
            cloudsOpacity={cloudsOpacity}
            onChangeCloudsOpacity={onChangeCloudsOpacity}
            cloudsVisible={cloudsVisible}
            onToggleClouds={onToggleClouds}
            onResetDefaults={onResetDefaults}
            liveBrasilia={liveBrasilia}
          />
        ) : (
          <GlobeOrbitalTranslationTab
            orbitalDayOfYear={orbitalDayOfYear}
            onChangeOrbitalDayOfYear={onChangeOrbitalDayOfYear}
            isOrbitalPlaying={isOrbitalPlaying}
            onToggleOrbitalPlay={onToggleOrbitalPlay}
            orbitalSpeedDaysPerSec={orbitalSpeedDaysPerSec}
            onChangeOrbitalSpeed={onChangeOrbitalSpeed}
            isAxialRotationActive={isAxialRotationActive}
            onToggleAxialRotation={onToggleAxialRotation}
            cameraFocusMode={cameraFocusMode}
            onChangeCameraFocusMode={onChangeCameraFocusMode}
            onSelectPlanetAstro={onSelectPlanetAstro}
            orbitalState={orbitalState}
            activeScenePresetId={activeScenePresetId}
            onSelectScenePreset={onSelectScenePreset}
            isPlanetsAligned={isPlanetsAligned}
            onTogglePlanetsAlignment={onTogglePlanetsAlignment}
          />
        )}
      </div>
    </div>
  );
};
