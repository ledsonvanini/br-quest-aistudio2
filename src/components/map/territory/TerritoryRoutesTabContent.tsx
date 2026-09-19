/**
 * TerritoryRoutesTabContent.tsx
 * Aba de Rotas, Eixos Rodoviários, Ferrovias e Portos de Cabotagem.
 */

import React from 'react';
import {
  Route,
  Anchor,
  Truck,
  Ship,
} from 'lucide-react';
import { STATE_HYDROLOGY_AND_TERRITORY_DETAILS } from '../../../data/cartographyBasinsData';

interface Props {
  stateId: string;
}

export const TerritoryRoutesTabContent: React.FC<Props> = ({ stateId }) => {
  const hydroDetail = STATE_HYDROLOGY_AND_TERRITORY_DETAILS[stateId];

  return (
    <div className="painel-aba-rotas space-y-3.5 animate-in fade-in duration-200">
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-slate-900/80 p-3.5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Route className="h-4 w-4 text-amber-400" />
          <span>Eixos Rodoviários & Conexões Nacionais</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {hydroDetail?.routes && hydroDetail.routes.length > 0 ? (
            hydroDetail.routes.map((rota) => (
              <div key={rota} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium">{rota}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">Conexões por rodovias federais e malhas estaduais de escoamento.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
          <Anchor className="h-3.5 w-3.5 text-cyan-400" />
          <span>Portos de Cabotagem, Terminais Fluviais e Secos</span>
        </div>
        {hydroDetail?.ports && hydroDetail.ports.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hydroDetail.ports.map((porto) => (
              <span
                key={porto}
                className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-semibold text-cyan-200 flex items-center gap-1.5"
              >
                <Ship className="w-3 h-3 text-cyan-400" />
                <span>{porto}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Terminal intermodal conectado por hidrovias e ferrovias regionais.</p>
        )}
      </div>
    </div>
  );
};
