/**
 * TerritoryBasinTabContent.tsx
 * Aba de Bacias Hidrográficas e Balanço Hídrico com Dados Oficiais ANA 2025/2026 (SNIRH).
 * Portal Público Oficial: https://dadosabertos.ana.gov.br/search
 */

import React from 'react';
import {
  Waves,
  Droplets,
  Zap,
  ExternalLink,
  Activity,
  PieChart,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { STATE_HYDROLOGY_AND_TERRITORY_DETAILS } from '../../../data/cartographyBasinsData';
import { getStateAnaWaterData } from '../../../data/cartography/anaWaterData2025';
import { MAJOR_HYDRO_PINS } from '../../../data/cartography/hydroFeaturePinsData';

interface Props {
  stateId: string;
}

export const TerritoryBasinTabContent: React.FC<Props> = ({ stateId }) => {
  const hydroDetail = STATE_HYDROLOGY_AND_TERRITORY_DETAILS[stateId];
  const anaData = getStateAnaWaterData(stateId);

  // Usinas hidrelétricas associadas ao estado
  const stateDams = MAJOR_HYDRO_PINS.filter((pin) =>
    hydroDetail?.hydrologyHighlights?.toLowerCase().includes(pin.name.toLowerCase().split(' ')[1] || '---')
  );

  return (
    <div className="painel-aba-hidrografia space-y-3.5 animate-in fade-in duration-200">
      {/* 1. Header da Região Hidrográfica Oficial ANA */}
      <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-slate-900/80 p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Waves className="h-4 w-4 text-cyan-400" />
            <span>Região Hidrográfica Oficial (ANA 2025/2026)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 font-bold">
            {anaData?.ugrhCount || 1} UGRHs ANA
          </span>
        </div>
        <p className="mt-1.5 text-slate-100 font-bold text-sm">
          {anaData?.basinOfficialName || hydroDetail?.basinName || 'Região Hidrográfica Brasileira'}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Vazão Média (ANA):</span>
            <span className="text-cyan-300 font-black text-sm">
              {anaData?.averageDischargeM3s ? `${anaData.averageDischargeM3s.toLocaleString('pt-BR')} m³/s` : hydroDetail?.basinDischarge}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Disponib. per capita:</span>
            <span className="text-emerald-300 font-black text-sm">
              {anaData?.waterAvailabilityPerCapitaM3Year ? `${anaData.waterAvailabilityPerCapitaM3Year.toLocaleString('pt-BR')} m³/hab/ano` : 'Dados em consolidação'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Demanda e Usos Consuntivos de Água (Conjuntura ANA 2025/2026) */}
      {anaData && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <PieChart className="h-3.5 w-3.5 text-cyan-400" />
              <span>Usos Consuntivos da Água (Balanço ANA 2025/2026)</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
              <Activity className="h-3 w-3 text-amber-400" />
              <span>Demanda: <strong>{anaData.consumptiveDemandM3s} m³/s</strong></span>
            </div>
          </div>

          {/* Barras de Proporção de Uso */}
          <div className="space-y-1.5 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>🌾 Irrigação Agrícola:</span>
                <strong className="text-amber-300 font-mono">{anaData.waterUseShare.irrigacao}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${anaData.waterUseShare.irrigacao}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>🏙️ Abastecimento Humano / Urbano:</span>
                <strong className="text-cyan-300 font-mono">{anaData.waterUseShare.abastecimentoUrbano}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${anaData.waterUseShare.abastecimentoUrbano}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span>🏭 Indústria de Transformação:</span>
                <strong className="text-blue-300 font-mono">{anaData.waterUseShare.industria}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${anaData.waterUseShare.industria}%` }} />
              </div>
            </div>
          </div>

          {/* Status de Segurança Hídrica */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Segurança Hídrica Estadual:</span>
            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
              anaData.waterSecurityStatus === 'Excelente' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
              anaData.waterSecurityStatus === 'Confortável' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
              anaData.waterSecurityStatus === 'Atenção' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
              'bg-rose-950 text-rose-300 border border-rose-500/30'
            }`}>
              {anaData.waterSecurityStatus === 'Excelente' || anaData.waterSecurityStatus === 'Confortável' ? (
                <ShieldCheck className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              {anaData.waterSecurityStatus}
            </span>
          </div>
        </div>
      )}

      {/* 3. Rios Mestres e Afluentes */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <Droplets className="h-3.5 w-3.5 text-cyan-400" />
          <span>Rios Mestres & Calhas Hidroviárias</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {hydroDetail?.mainRivers.map((river) => (
            <span
              key={river}
              className="rounded-lg border border-cyan-500/20 bg-cyan-950/40 px-2.5 py-1 text-xs font-medium text-cyan-200"
            >
              🌊 {river}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Destaques Hídricos e Usinas */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>Infraestrutura Hídrica & Hidrelétricas</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {hydroDetail?.hydrologyHighlights || 'Rede hidrográfica estratégica com relevância no abastecimento e irrigação.'}
        </p>
        {stateDams.length > 0 && (
          <div className="pt-2 space-y-1.5">
            {stateDams.map((dam) => (
              <div key={dam.id} className="rounded-lg bg-slate-950/60 border border-amber-500/20 p-2 text-xs">
                <span className="font-bold text-amber-300">⚡ {dam.name}</span>
                {dam.capacity && <span className="ml-2 text-slate-400 font-mono text-[11px]">Capacidade: {dam.capacity}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Link Oficial para a API e Dados Abertos da ANA */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 flex items-center justify-between text-xs">
        <div className="text-slate-300">
          <span className="font-semibold text-white block">Fonte: Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH)</span>
          <span className="text-[10px] text-slate-400">Edição 2025/2026 - Agência Nacional de Águas e Saneamento Básico</span>
        </div>
        <a
          href="https://dadosabertos.ana.gov.br/search"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 font-bold text-[11px] transition-all"
        >
          <span>Portal ANA</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
