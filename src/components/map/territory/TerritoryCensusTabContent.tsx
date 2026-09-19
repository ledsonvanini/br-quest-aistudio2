/**
 * TerritoryCensusTabContent.tsx
 * Aba de Dados Estatísticos Consolidados do Censo Demográfico IBGE 2022/2024.
 */

import React from 'react';
import {
  Users,
  MapPin,
  TrendingUp,
  Building,
  BarChart3,
} from 'lucide-react';
import { STATES_GEOPOLITICS_DATA } from '../../../data/geopoliticaData';
import { BRAZIL_STATES_REGISTRY } from '../../../data/brazilStatesRegistry';

interface Props {
  stateId: string;
}

export const TerritoryCensusTabContent: React.FC<Props> = ({ stateId }) => {
  const geopolitics = STATES_GEOPOLITICS_DATA[stateId];
  const registry = BRAZIL_STATES_REGISTRY[stateId];

  return (
    <div className="painel-aba-dados space-y-3.5 animate-in fade-in duration-200">
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">População Residente</span>
          <span className="text-base sm:text-lg font-black text-cyan-300">
            {geopolitics?.demografia?.populacaoTotal ? Number(geopolitics.demografia.populacaoTotal).toLocaleString('pt-BR') : '---'} hab.
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Censo Demográfico IBGE</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Área Territorial</span>
          <span className="text-base sm:text-lg font-black text-emerald-300">
            {geopolitics?.demografia?.areaKm2 ? `${Number(geopolitics.demografia.areaKm2).toLocaleString('pt-BR')} km²` : '---'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Malha Territorial IBGE</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Densidade Demográfica</span>
          <span className="text-base sm:text-lg font-black text-amber-300">
            {geopolitics?.demografia?.densidadeHabKm2
              ? `${geopolitics.demografia.densidadeHabKm2.toFixed(1)} hab/km²`
              : '---'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Urbanização</span>
          <span className="text-base sm:text-lg font-black text-blue-300">
            {geopolitics?.demografia?.taxaUrbanizacao ? `${geopolitics.demografia.taxaUrbanizacao.toFixed(1)}%` : '78.5%'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">IBGE / Censo</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <Building className="h-3.5 w-3.5 text-cyan-400" />
          <span>Capital & Organização Político-Administrativa</span>
        </div>
        <p className="text-sm text-slate-100 font-semibold">
          Capital: {geopolitics?.capital || 'Capital'} • Região {geopolitics?.regionName || 'Brasil'}
        </p>
        <p className="text-xs text-slate-400">
          Unidade Federativa autônoma integrada ao pacto federativo constitucional da República Federativa do Brasil.
        </p>
      </div>
    </div>
  );
};
