/**
 * TerritoryReliefTabContent.tsx
 * Aba de Relevo Hipsométrico e Geomorfologia Oficial (Jurandyr Ross / IBGE).
 * Referência Visual: Anexo 2 (Planaltos, Planícies e Depressões).
 */

import React from 'react';
import {
  Mountain,
  Compass,
  Layers,
  MapPin,
  Trees,
} from 'lucide-react';
import { STATE_HYDROLOGY_AND_TERRITORY_DETAILS } from '../../../data/cartographyBasinsData';
import { getStateAnaWaterData } from '../../../data/cartography/anaWaterData2025';
import { BRAZIL_MAJOR_PEAKS, ReliefPeak } from '../../../data/cartography/reliefPeaksData';
import { STATE_GEOGRAPHICAL_DATA } from '../../../lib/mapColorScales';

interface Props {
  stateId: string;
}

export const TerritoryReliefTabContent: React.FC<Props> = ({ stateId }) => {
  const hydroDetail = STATE_HYDROLOGY_AND_TERRITORY_DETAILS[stateId];
  const anaData = getStateAnaWaterData(stateId);
  const geoData = STATE_GEOGRAPHICAL_DATA[stateId];

  const statePeaks: ReliefPeak[] = BRAZIL_MAJOR_PEAKS.filter(
    (peak: ReliefPeak) => peak.state === stateId
  ).slice(0, 3);

  const relief = anaData?.jurandyrRossRelief;

  return (
    <div className="painel-aba-bioma space-y-3.5 animate-in fade-in duration-200">
      {/* 1. Macro-Unidade Geomorfológica de Jurandyr Ross (Anexo 2) */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900/80 p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Mountain className="h-4 w-4 text-emerald-400" />
            <span>Geomorfologia Jurandyr Ross (IBGE)</span>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
            relief?.macroUnit === 'Planaltos' ? 'bg-lime-950/70 border-lime-500/40 text-lime-300' :
            relief?.macroUnit === 'Planícies' ? 'bg-amber-950/70 border-amber-500/40 text-amber-300' :
            'bg-rose-950/70 border-rose-500/40 text-rose-300'
          }`}>
            {relief?.macroUnit || 'Planaltos e Chapadas'}
          </span>
        </div>

        {/* Faixa de Altitude */}
        <div className="mt-2.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Faixa Hipsométrica Típica:</span>
          <strong className="text-emerald-300 font-mono text-sm">{relief?.altitudeRange || '200m a 1.200m'}</strong>
        </div>

        {/* Subunidades de Relevo */}
        {relief?.subUnits && (
          <div className="mt-2 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unidades Morfoestruturais:</span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {relief.subUnits.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-200"
                >
                  🏔️ {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {relief?.dominantFeatures || hydroDetail?.relevo}
        </p>
      </div>

      {/* 2. Bioma Predominante & Vegetação */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <Trees className="h-3.5 w-3.5 text-emerald-400" />
          <span>Bioma & Cobertura Vegetal Predominante</span>
        </div>
        <p className="text-slate-100 font-bold text-sm">
          {hydroDetail?.biome || geoData?.biome || 'Bioma Continental Brasileiro'}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Classificação biogeográfica oficial do Instituto Brasileiro de Geografia e Estatística (IBGE).
        </p>
      </div>

      {/* 3. Picos Culminantes e Serras */}
      {statePeaks.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>Picos Culminantes & Elevações Notáveis</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {statePeaks.map((peak: ReliefPeak) => (
              <div key={peak.id} className="rounded-lg bg-slate-950/70 border border-slate-800 p-2.5 text-xs">
                <div className="font-bold text-slate-100 flex items-center justify-between">
                  <span className="truncate pr-1">⛰️ {peak.name}</span>
                  <span className="text-amber-400 font-mono text-[11px] shrink-0 font-black">{peak.altitudeMeters}m</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{peak.notableFeatures || peak.mountainRange}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
