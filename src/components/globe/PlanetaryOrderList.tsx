import React from 'react';
import { Eye, Sun } from 'lucide-react';
import { SOLAR_SYSTEM_PLANETS } from '../../lib/globeEngine/orbitalData';
import { audioEngine } from '../../lib/audioSynth';

interface PlanetaryOrderListProps {
  onSelectPlanetAstro?: (astroId: string) => void;
  onFocusSun?: () => void;
}

export const PlanetaryOrderList: React.FC<PlanetaryOrderListProps> = ({
  onSelectPlanetAstro,
  onFocusSun,
}) => {
  return (
    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
        <span className="flex items-center gap-1.5">
          <span className="text-amber-400">🪐</span>
          Ordem dos Planetas (Sol aos Confins)
        </span>
        <span className="text-slate-400 font-normal">8 Planetas + Sol</span>
      </div>

      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {/* Sol */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-slate-950 shrink-0">
              ☉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-amber-400">#0</span>
                <span className="text-xs font-bold text-amber-300">Sol (Estrela Central)</span>
              </div>
              <div className="text-[9.5px] font-mono text-slate-400">
                0,0 UA • Centro Gravitacional
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              if (onFocusSun) onFocusSun();
            }}
            className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-[10px] flex items-center gap-1 cursor-pointer transition-colors border border-amber-500/30 shrink-0"
          >
            <Eye className="w-3 h-3" />
            <span>Ver</span>
          </button>
        </div>

        {/* 8 Planetas */}
        {SOLAR_SYSTEM_PLANETS.map((planet, index) => {
          const isEarth = planet.id === 'terra';
          return (
            <React.Fragment key={planet.id}>
              <div
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  isEarth
                    ? 'bg-sky-500/15 border-sky-400/50 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 shrink-0 shadow-sm"
                    style={{ backgroundColor: planet.color }}
                  >
                    {planet.symbol}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                      <span className={`text-xs font-bold truncate ${isEarth ? 'text-sky-300' : 'text-slate-200'}`}>
                        {planet.name}
                      </span>
                      {isEarth && (
                        <span className="text-[9px] bg-sky-500/25 text-sky-300 px-1.5 py-0.2 rounded font-semibold">
                          Brasil
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-400">
                      <span>{planet.semiMajorAxisAU} UA</span>
                      <span>•</span>
                      <span>
                        {planet.periodDays > 365
                          ? `${(planet.periodDays / 365.25).toFixed(1)} anos`
                          : `${planet.periodDays}d`}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    if (onSelectPlanetAstro) onSelectPlanetAstro(planet.id);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[10px] flex items-center gap-1 cursor-pointer transition-colors border border-slate-700 shrink-0"
                >
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>Ver</span>
                </button>
              </div>

              {/* Cinturão de Asteroides entre Marte e Júpiter */}
              {planet.id === 'marte' && (
                <div className="p-1.5 px-2.5 rounded-lg bg-slate-800/40 border border-dashed border-slate-700/80 flex items-center justify-between text-[9.5px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-300">☄</span>
                    <strong className="text-slate-300 font-medium">Cinturão de Asteroides</strong>
                    <span>(Ceres, Vesta)</span>
                  </span>
                  <span className="font-mono text-slate-500">~2,5 UA</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
