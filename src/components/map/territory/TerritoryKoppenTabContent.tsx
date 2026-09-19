/**
 * TerritoryKoppenTabContent.tsx
 * Aba de Classificação Climática Oficial de Köppen-Geiger e Regimes Sazonais.
 * Reprodução exata do layout e dados do Anexo 1.
 */

import React from 'react';
import {
  CloudSun,
  Droplets,
  Gauge,
  Sun,
  CloudRain,
  Compass,
} from 'lucide-react';
import { getStateAnaWaterData } from '../../../data/cartography/anaWaterData2025';

interface Props {
  stateId: string;
}

export const TerritoryKoppenTabContent: React.FC<Props> = ({ stateId }) => {
  const anaData = getStateAnaWaterData(stateId);
  const koppen = anaData?.climateClassification;

  return (
    <div className="painel-aba-koppen space-y-3.5 animate-in fade-in duration-200">
      {/* 1. Cartão Principal: Classificação Oficial de Köppen-Geiger */}
      <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-950/30 to-slate-900/80 p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm">
            <CloudSun className="h-4 w-4 text-yellow-400" />
            <span>Classificação Climática Oficial (Köppen-Geiger)</span>
          </div>
          <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-300">
            {koppen?.koppenCode || 'Aw'}
          </span>
        </div>
        <p className="mt-2 text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
          {koppen?.koppenDescription || 'Clima tropical semiúmido com estação chuvosa no verão e estiagem no inverno.'}
        </p>
      </div>

      {/* 2. Métricas de Precipitação Anual e Pressão Atmosférica (Idêntico ao Anexo 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Precipitação Anual</span>
            <span className="text-sm sm:text-base font-black text-blue-300 font-mono">
              ~{koppen?.annualPrecipitationMm ? `${koppen.annualPrecipitationMm.toLocaleString('pt-BR')} mm/ano` : '1.600 mm/ano'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Média histórica climatológica</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Gauge className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressão Atmosférica</span>
            <span className="text-sm sm:text-base font-black text-cyan-300 font-mono">
              {koppen?.averagePressureHpa || 937} hPa
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Nível médio da estação barométrica</span>
          </div>
        </div>
      </div>

      {/* 3. Regime Sazonal de Chuvas e Estiagem (Idêntico ao Anexo 1) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          <span>Regime Sazonal de Chuvas e Estiagem</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Estação Chuvosa */}
          <div className="rounded-lg bg-slate-950/70 border border-blue-500/30 p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-300 font-bold text-xs">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Estação Chuvosa</span>
            </div>
            <p className="text-slate-100 font-semibold text-xs">
              {koppen?.rainySeason || 'Outubro a Março'}
            </p>
            <p className="text-[10px] text-slate-400">
              Concentração de mais de 75% da precipitação anual e formação de sistemas convectivos.
            </p>
          </div>

          {/* Estação Seca */}
          <div className="rounded-lg bg-slate-950/70 border border-amber-500/30 p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Estação Seca / Estiagem</span>
            </div>
            <p className="text-slate-100 font-semibold text-xs">
              {koppen?.drySeason || 'Maio a Setembro'}
            </p>
            <p className="text-[10px] text-slate-400">
              Queda expressiva da umidade relativa do ar e estabilidade atmosférica por massa polar/continental.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
