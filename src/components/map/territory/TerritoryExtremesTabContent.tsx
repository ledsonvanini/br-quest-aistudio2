/**
 * TerritoryExtremesTabContent.tsx
 * Aba de Extremos Climáticos e Histórico de Secas / Inundações.
 */

import React from 'react';
import {
  AlertTriangle,
  Flame,
  Snowflake,
  Waves,
  Calendar,
} from 'lucide-react';
import { STATES_GEOPOLITICS_DATA } from '../../../data/geopoliticaData';

interface Props {
  stateId: string;
}

export const TerritoryExtremesTabContent: React.FC<Props> = ({ stateId }) => {
  const geopolitics = STATES_GEOPOLITICS_DATA[stateId];

  return (
    <div className="painel-aba-extremos space-y-3.5 animate-in fade-in duration-200">
      <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/30 to-slate-900/80 p-3.5 shadow-sm">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <span>Vulnerabilidade Hidroclimática & Eventos Extremos</span>
        </div>
        <p className="mt-1.5 text-slate-300 text-xs leading-relaxed">
          Monitoramento de estiagens prolongadas, ondas de calor, tempestades convectivas e inundações graduais / enxurradas registradas no histórico estadual.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Recorde de Calor / Seca */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="w-4 h-4" />
            <span>Calor & Estiagem Severa</span>
          </div>
          <p className="text-slate-200 text-xs font-semibold">Ondas de Calor Recentes (2023–2025)</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Períodos com umidade relativa inferior a 15% e anomalias de temperatura positiva de até +4°C acima da média climatológica.
          </p>
        </div>

        {/* Inundações e Cheias */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Waves className="w-4 h-4" />
            <span>Picos de Vazão & Cheias</span>
          </div>
          <p className="text-slate-200 text-xs font-semibold">Cheias Fluviais Históricas</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Inundações graduais em planícies aluviais durante o ápice da estação chuvosa monitoradas pelo Sistema de Alerta Hidrológico (SAH/CPRM/ANA).
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-2.5 text-xs">
        <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-slate-300">
          Dados históricos integrados a estações automáticas do INMET e medições da Rede Hidrometeorológica Nacional (RHN/ANA).
        </span>
      </div>
    </div>
  );
};
