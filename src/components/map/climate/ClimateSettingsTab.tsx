// src/components/map/climate/ClimateSettingsTab.tsx
// Aba de Controles de Dinâmica e Velocidade dos Ventos

import React from 'react';
import { Wind } from 'lucide-react';

interface ClimateSettingsTabProps {
  speedMultiplier: number;
  onSpeedMultiplierChange: (speed: number) => void;
}

export const ClimateSettingsTab: React.FC<ClimateSettingsTabProps> = ({
  speedMultiplier,
  onSpeedMultiplierChange,
}) => {
  return (
    <div className="aba-configuracoes-conteudo space-y-3">
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            Velocidade da Dinâmica dos Ventos
          </label>
          <span className="px-2 py-0.5 rounded font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 text-xs">
            {speedMultiplier.toFixed(1)}x
          </span>
        </div>

        {/* Slider com track customizado e responsivo */}
        <div className="space-y-1">
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) => onSpeedMultiplierChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all hover:bg-slate-700"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 px-0.5">
            <span>0.2x (Calmo)</span>
            <span>1.0x (Real)</span>
            <span>3.0x (Ventania)</span>
          </div>
        </div>

        {/* Botões de Presets Rápidos */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-[10px] font-mono">
          {[
            { val: 0.5, label: '0.5x' },
            { val: 1.0, label: '1.0x' },
            { val: 2.0, label: '2.0x' },
            { val: 3.0, label: '3.0x' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => onSpeedMultiplierChange(preset.val)}
              className={`py-1 rounded-lg border transition-all cursor-pointer ${
                Math.abs(speedMultiplier - preset.val) < 0.05
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
