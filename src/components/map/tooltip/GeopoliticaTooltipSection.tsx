// src/components/map/tooltip/GeopoliticaTooltipSection.tsx
// Seção de Tooltip para o Modo Geopolítica (Censo IBGE 2022, Demografia, Etnia, Gênero e Indicadores)

import React from 'react';
import { Users, MapPin, Heart, GraduationCap, Percent, Landmark } from 'lucide-react';
import { StateGeopoliticsProfile, GeopoliticaMetricKey } from '../../../types/geopolitica';

interface GeopoliticaTooltipSectionProps {
  stateId: string;
  stateName: string;
  capital: string;
  flagUrl?: string;
  geoProfile?: StateGeopoliticsProfile;
  geopoliticaMetric?: GeopoliticaMetricKey;
}

export const GeopoliticaTooltipSection: React.FC<GeopoliticaTooltipSectionProps> = ({
  stateId,
  stateName,
  capital,
  flagUrl,
  geoProfile,
  geopoliticaMetric = 'miscigenacao',
}) => {
  if (!geoProfile) {
    return (
      <div className="p-3 text-slate-300 text-xs font-mono">
        Carregando dados geopolíticos de {stateName}...
      </div>
    );
  }

  const popFormatted = geoProfile.demografia?.populacaoTotal
    ? new Intl.NumberFormat('pt-BR').format(geoProfile.demografia.populacaoTotal)
    : 'N/D';

  const densFormatted = geoProfile.demografia?.densidadeHabKm2
    ? `${geoProfile.demografia.densidadeHabKm2.toFixed(1)} hab/km²`
    : 'N/D';

  const alfabetizacaoFormatted = geoProfile.educacao?.taxaAlfabetizacao
    ? `${geoProfile.educacao.taxaAlfabetizacao.toFixed(1)}%`
    : 'N/D';

  const expectativaVidaFormatted = geoProfile.vitais?.expectativaVidaAnos
    ? `${geoProfile.vitais.expectativaVidaAnos.toFixed(1)} anos`
    : 'N/D';

  return (
    <div
      id="secao-geopolitica-tooltip"
      className="secao-geopolitica-tooltip space-y-2.5 text-slate-100 select-none"
    >
      {/* 1. Header Institucional da UF */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`Bandeira de ${stateName}`}
              className="w-7 h-5 object-cover rounded shadow-md border border-slate-700/80 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5 truncate">
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded shrink-0 border bg-indigo-950/80 text-indigo-300 border-indigo-400/60">
                {stateId}
              </span>
              <span className="truncate font-serif font-bold text-white tracking-wide">
                {stateName}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              Capital: <strong className="text-slate-200">{capital}</strong>
            </p>
          </div>
        </div>

        {/* Badge do Censo IBGE */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900 border border-indigo-500/40 text-[10px] font-mono font-semibold shrink-0 text-indigo-300 shadow-inner">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>{geoProfile.regionName || 'IBGE'}</span>
        </div>
      </div>

      {/* 2. Destaque Contextual da Métrica Ativa */}
      {geopoliticaMetric === 'miscigenacao' && geoProfile.etnia && (
        <div className="space-y-1.5 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Users className="w-3 h-3" /> Etnia (Censo 2022)
            </span>
            <span className="text-slate-400">Pardos {geoProfile.etnia.pardoPercent}% • Brancos {geoProfile.etnia.brancoPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
            <div style={{ width: `${geoProfile.etnia.pardoPercent}%` }} className="bg-amber-500" title={`Pardos ${geoProfile.etnia.pardoPercent}%`} />
            <div style={{ width: `${geoProfile.etnia.brancoPercent}%` }} className="bg-sky-400" title={`Brancos ${geoProfile.etnia.brancoPercent}%`} />
            <div style={{ width: `${geoProfile.etnia.pretoPercent}%` }} className="bg-purple-500" title={`Pretos ${geoProfile.etnia.pretoPercent}%`} />
            <div style={{ width: `${geoProfile.etnia.indigenaPercent}%` }} className="bg-emerald-400" title={`Indígenas ${geoProfile.etnia.indigenaPercent}%`} />
            <div style={{ width: `${geoProfile.etnia.amareloPercent}%` }} className="bg-yellow-400" title={`Amarelos ${geoProfile.etnia.amareloPercent}%`} />
          </div>
        </div>
      )}

      {geopoliticaMetric === 'genero' && geoProfile.genero && (
        <div className="space-y-1.5 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1 text-pink-300 font-bold">
              <Percent className="w-3 h-3" /> Razão de Sexo
            </span>
            <span className="text-pink-300 font-bold">
              {geoProfile.genero.mulheresPercent}% Mulheres • {geoProfile.genero.homensPercent}% Homens
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
            <div style={{ width: `${geoProfile.genero.mulheresPercent}%` }} className="bg-pink-500" />
            <div style={{ width: `${geoProfile.genero.homensPercent}%` }} className="bg-blue-500" />
          </div>
        </div>
      )}

      {/* 3. Grid 2x2 com Indicadores Demográficos e Socioeconômicos do Censo */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="p-1 rounded-lg bg-indigo-950/70 text-indigo-400 shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate font-medium">População</span>
            <strong className="text-white text-xs block font-bold truncate">{popFormatted}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="p-1 rounded-lg bg-sky-950/70 text-sky-400 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate font-medium">Densidade</span>
            <strong className="text-sky-300 text-xs block font-bold truncate">{densFormatted}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="p-1 rounded-lg bg-emerald-950/70 text-emerald-400 shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate font-medium">Alfabetização</span>
            <strong className="text-emerald-300 text-xs block font-bold truncate">{alfabetizacaoFormatted}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="p-1 rounded-lg bg-amber-950/70 text-amber-400 shrink-0">
            <Heart className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate font-medium">Expectativa Vida</span>
            <strong className="text-amber-300 text-xs block font-bold truncate">{expectativaVidaFormatted}</strong>
          </div>
        </div>
      </div>

      {/* 4. Rodapé de Fonte Oficial */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
        <span className="truncate">Censo Demográfico IBGE 2022</span>
        <span className="text-indigo-400 font-bold shrink-0">
          {geoProfile.rankingPopulacaoNacional ? `${geoProfile.rankingPopulacaoNacional}º mais populoso` : 'Oficial'}
        </span>
      </div>
    </div>
  );
};
