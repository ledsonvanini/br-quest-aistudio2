// src/components/map/climate/ClimateStationsTab.tsx
// Aba com lista de capitais e estações meteorológicas estaduais

import React from 'react';
import { ClimateStationData } from '../../../services/climateService';

interface ClimateStationsTabProps {
  stations: ClimateStationData[];
  selectedStation: ClimateStationData | null;
  onSelectStation: (station: ClimateStationData | null) => void;
}

export const ClimateStationsTab: React.FC<ClimateStationsTabProps> = ({
  stations,
  selectedStation,
  onSelectStation,
}) => {
  return (
    <div className="aba-estacoes-conteudo space-y-2">
      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
        <span>CAPITAIS & POLOS CLIMÁTICOS</span>
        <span>{stations.length} ESTAÇÕES</span>
      </div>

      <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1 custom-scrollbar">
        {stations.map((st) => {
          const isSelected = selectedStation?.id === st.id;
          return (
            <div
              key={st.id}
              onClick={() => onSelectStation(isSelected ? null : st)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-[10px] text-amber-400">
                  {st.id.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-xs">{st.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {st.windSpeed} km/h • {st.windDirection}° • {st.humidity}% UMID
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-black text-amber-300 text-sm">{st.temperature}°C</div>
                <div className="text-[9px] text-slate-400">{st.phenomenon}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
