// src/components/map/climate/ClimateAstronomyTab.tsx
// Aba de Astronomia, Hora de Brasília, Efemérides Sol/Lua e Radiação UV

import React from 'react';
import { CelestialEphemeris } from '../../../services/astronomyService';
import { Orbit, Sun, Moon, ShieldAlert } from 'lucide-react';

interface ClimateAstronomyTabProps {
  ephemeris: CelestialEphemeris;
  timeOverride: 'auto' | 'day' | 'night';
  onTimeOverrideChange?: (mode: 'auto' | 'day' | 'night') => void;
}

export const ClimateAstronomyTab: React.FC<ClimateAstronomyTabProps> = ({
  ephemeris,
  timeOverride,
  onTimeOverrideChange,
}) => {
  return (
    <div className="aba-astronomia-conteudo space-y-3">
      {/* Cartão do Relógio Oficial de Brasília */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Horário Oficial de Brasília</div>
            <div className="font-mono font-bold text-amber-300 text-xs">
              {ephemeris.brasiliaTimeFormatted}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              ephemeris.isNight
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {ephemeris.isNight ? '🌙 Noite' : '☀️ Dia'}
          </span>
        </div>
      </div>

      {/* Alternância de Modo / Teste Manual */}
      <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5">
        <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between">
          <span>CICLO DE ILUMINAÇÃO CELO</span>
          <span className="font-mono text-slate-500">Auto: Brasília UTC-3</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onTimeOverrideChange?.('auto')}
            className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              timeOverride === 'auto'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⏱️ Automático
          </button>
          <button
            onClick={() => onTimeOverrideChange?.('day')}
            className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              timeOverride === 'day'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ☀️ Modo Dia
          </button>
          <button
            onClick={() => onTimeOverrideChange?.('night')}
            className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              timeOverride === 'night'
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🌙 Modo Noite
          </button>
        </div>
      </div>

      {/* Grade de Efemérides: Posição Solar e Lunar */}
      <div className="grid grid-cols-2 gap-2">
        {/* Bloco Sol */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] font-serif">
            <Sun className="w-3.5 h-3.5" />
            <span>Sol em Brasília</span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono space-y-0.5">
            <div>Elevação: <strong className="text-amber-300">{ephemeris.sunElevation}°</strong></div>
            <div>Azimute: <strong className="text-amber-300">{ephemeris.sunAzimuth}° ({ephemeris.sunAzimuthCardinal})</strong></div>
            <div>Intensidade: <strong className="text-amber-300">{Math.round(ephemeris.sunIntensity * 100)}%</strong></div>
          </div>
        </div>

        {/* Bloco Lua */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px] font-serif">
            <Moon className="w-3.5 h-3.5" />
            <span>Lua & Cruzeiro do Sul</span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono space-y-0.5">
            <div>Fase: <strong className="text-indigo-300">{ephemeris.moonPhaseName}</strong></div>
            <div>Iluminação: <strong className="text-indigo-300">{ephemeris.moonIlluminationPercent}%</strong></div>
            <div>Azimute: <strong className="text-indigo-300">{ephemeris.moonAzimuth}° ({ephemeris.moonAzimuthCardinal})</strong></div>
          </div>
        </div>
      </div>

      {/* Radiação & Ozônio */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            Índice UV & Camada de Ozônio
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            {ephemeris.ozoneColumnDU} DU
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-slate-400">Índice Ultravioleta</div>
            <div className="font-bold text-xs text-amber-300">
              {ephemeris.uvIndex} ({ephemeris.uvCategory})
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-slate-400">Coluna de Ozônio</div>
            <div className="font-bold text-xs text-emerald-300">
              {ephemeris.ozoneColumnDU} Unidades Dobson
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
