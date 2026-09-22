// src/components/map/climate/ClimateEnsoTab.tsx
// Aba de Telemetria e Simulação do Fenômeno ENSO (El Niño / La Niña)
// Referências: NASA Earth Science, NOAA Climate, INMET e SIMEPAR

import React from 'react';
import { ElNinoIndexData } from '../../../services/climateService';
import { Waves, ExternalLink, Sparkles } from 'lucide-react';

interface ClimateEnsoTabProps {
  elNinoData: ElNinoIndexData | null;
  onPhaseChange?: (phase: 'El Niño' | 'La Niña' | 'Neutro') => void;
}

export const ClimateEnsoTab: React.FC<ClimateEnsoTabProps> = ({
  elNinoData,
  onPhaseChange,
}) => {
  if (!elNinoData) {
    return (
      <div className="p-4 text-center text-slate-400 text-xs">
        Carregando índices oceânicos...
      </div>
    );
  }

  const isLaNina = elNinoData.phase === 'La Niña';
  const isElNino = elNinoData.phase === 'El Niño';

  return (
    <div className="aba-enso-conteudo space-y-3">
      {/* Seletor Educativo de Fase ENSO para Simulação Científica */}
      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            SIMULADOR CARTOGRÁFICO ENSO
          </span>
          <span className="font-mono text-cyan-400">Niño 3.4</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onPhaseChange?.('El Niño')}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              isElNino
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 El Niño (+2.3°C)
          </button>
          <button
            onClick={() => onPhaseChange?.('La Niña')}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              isLaNina
                ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ❄️ La Niña (-0.8°C)
          </button>
          <button
            onClick={() => onPhaseChange?.('Neutro')}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              elNinoData.phase === 'Neutro'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚖️ Neutro (0.0°C)
          </button>
        </div>
      </div>

      {/* Cartão de Telemetria Principal */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-serif font-bold text-amber-300 text-xs">Anomalia Térmica Niño 3.4</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              isLaNina
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : isElNino
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {elNinoData.phase} ({elNinoData.intensity})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`text-2xl font-mono font-black ${
              elNinoData.seaTempAnomaly < 0 ? 'text-sky-400' : 'text-rose-400'
            }`}
          >
            {elNinoData.seaTempAnomaly > 0 ? '+' : ''}
            {elNinoData.seaTempAnomaly}°C
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            {elNinoData.description}
          </p>
        </div>

        {/* Impactos Regionais no Brasil */}
        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 space-y-1.5 font-sans">
          <div>
            <strong className="text-amber-300 font-serif">Norte & Amazônia:</strong>{' '}
            <span className="text-slate-300">{elNinoData.impactsBrazil?.norte}</span>
          </div>
          <div>
            <strong className="text-amber-300 font-serif">Nordeste (Semiárido):</strong>{' '}
            <span className="text-slate-300">{elNinoData.impactsBrazil?.nordeste}</span>
          </div>
          <div>
            <strong className="text-amber-300 font-serif">Centro-Oeste:</strong>{' '}
            <span className="text-slate-300">{elNinoData.impactsBrazil?.centroOeste}</span>
          </div>
          <div>
            <strong className="text-amber-300 font-serif">Sudeste:</strong>{' '}
            <span className="text-slate-300">{elNinoData.impactsBrazil?.sudeste}</span>
          </div>
          <div>
            <strong className="text-amber-300 font-serif">Sul (SIMEPAR / INMET):</strong>{' '}
            <span className="text-slate-300">{elNinoData.impactsBrazil?.sul}</span>
          </div>
        </div>
      </div>

      {/* Referências Oficiais de Padrão Internacional */}
      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 space-y-1">
        <div className="text-[10px] font-bold text-slate-300 font-serif flex items-center gap-1">
          <Waves className="w-3 h-3 text-cyan-400" />
          Fontes Meteorológicas & Modelagem
        </div>
        <div className="text-[9.5px] text-slate-400 leading-snug">
          NASA Earth Science (Goddard Space Flight Center), NOAA Climate Prediction Center, INMET e SIMEPAR (Boletins Climáticos do Sul).
        </div>
      </div>
    </div>
  );
};
