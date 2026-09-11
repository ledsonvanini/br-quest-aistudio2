import React from 'react';
import {
  Sun,
  Moon,
  Sliders,
  Building2,
  Cloud,
  RotateCcw,
} from 'lucide-react';
import { GlobeFilledSlider } from './GlobeFilledSlider';

export interface GlobeLightingControlsCardProps {
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
  onResetDefaults: () => void;
}

export const GlobeLightingControlsCard: React.FC<GlobeLightingControlsCardProps> = ({
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
  onResetDefaults,
}) => {
  return (
    <div className="card-controles-iluminacao bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <span>Iluminação de 3 Pontos</span>
        <button
          type="button"
          onClick={onResetDefaults}
          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Restaurar Padrões
        </button>
      </div>

      {/* Luz Solar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <Sun className="w-3.5 h-3.5" /> Luz Solar Direta
          </span>
          <span className="font-mono text-amber-400">{sunIntensity.toFixed(2)}x</span>
        </div>
        <GlobeFilledSlider
          id="slider-luz-solar"
          min={0.2}
          max={3.0}
          step={0.05}
          value={sunIntensity}
          onChange={onChangeSunIntensity}
          fillColorClass="bg-amber-500"
          ariaLabel="Intensidade da luz solar"
        />
      </div>

      {/* Luz Lunar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-indigo-300">
            <Moon className="w-3.5 h-3.5" /> Luz Lunar Sideral
          </span>
          <span className="font-mono text-indigo-400">{moonLightIntensity.toFixed(2)}x</span>
        </div>
        <GlobeFilledSlider
          id="slider-luz-lunar"
          min={0.0}
          max={2.0}
          step={0.05}
          value={moonLightIntensity}
          onChange={onChangeMoonLightIntensity}
          fillColorClass="bg-indigo-500"
          ariaLabel="Intensidade da luz lunar"
        />
      </div>

      {/* Luz Ambiente */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Sliders className="w-3.5 h-3.5" /> Luz Ambiente Noturna
          </span>
          <span className="font-mono text-slate-400">{ambientLightIntensity.toFixed(2)}x</span>
        </div>
        <GlobeFilledSlider
          id="slider-luz-ambiente"
          min={0.05}
          max={0.8}
          step={0.02}
          value={ambientLightIntensity}
          onChange={onChangeAmbientLightIntensity}
          fillColorClass="bg-slate-400"
          ariaLabel="Intensidade da luz ambiente"
        />
      </div>

      {/* Cidades NASA */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-amber-200">
            <Building2 className="w-3.5 h-3.5" /> Luzes Urbanas (NASA VIIRS)
          </span>
          <span className="font-mono text-amber-300">{cityLightIntensity.toFixed(2)}x</span>
        </div>
        <GlobeFilledSlider
          id="slider-luzes-cidades"
          min={0.0}
          max={3.0}
          step={0.05}
          value={cityLightIntensity}
          onChange={onChangeCityLightIntensity}
          fillColorClass="bg-amber-400"
          ariaLabel="Intensidade das luzes urbanas"
        />
      </div>

      {/* Nuvens */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-sky-200">
            <Cloud className="w-3.5 h-3.5" /> Nuvens Dinâmicas
          </span>
          <span className="font-mono text-sky-300">{Math.round(cloudsOpacity * 100)}%</span>
        </div>
        <GlobeFilledSlider
          id="slider-opacidade-nuvens"
          min={0.0}
          max={1.0}
          step={0.02}
          value={cloudsOpacity}
          onChange={onChangeCloudsOpacity}
          fillColorClass="bg-sky-400"
          ariaLabel="Opacidade das nuvens"
        />
      </div>
    </div>
  );
};
