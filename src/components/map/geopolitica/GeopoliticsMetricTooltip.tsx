import React from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  HeartPulse,
  Baby,
  Percent,
  Landmark,
} from 'lucide-react';
import { GeopoliticaMetricKey, StateGeopoliticsProfile } from '../../../types/geopolitica';

interface GeopoliticsMetricTooltipProps {
  profile: StateGeopoliticsProfile;
  stateId: string;
  activeMetric: GeopoliticaMetricKey;
}

export const GeopoliticsMetricTooltip: React.FC<GeopoliticsMetricTooltipProps> = ({
  profile,
  stateId,
  activeMetric,
}) => {
  return (
    <div
      className="card-balao-geopolitica-conteudo w-[310px] sm:w-[350px] p-4 rounded-2xl border-2 border-cyan-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(6,182,212,0.45)] text-left text-white space-y-3"
      style={{ backgroundColor: '#020617' }}
    >
      {/* Cabeçalho do Estado */}
      <div className="header-balao-geopolitica flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-black border border-cyan-400/50 shadow-inner">
            {stateId}
          </span>
          <div className="min-w-0">
            <strong className="text-base font-serif font-black text-amber-200 tracking-wide block truncate">
              {profile.stateName}
            </strong>
            <span className="text-[11px] text-slate-400 font-sans font-semibold">
              Capital: <strong className="text-slate-200 font-normal">{profile.capital}</strong>
            </span>
          </div>
        </div>
        <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10.5px] text-cyan-300 font-mono font-bold shrink-0">
          {profile.regionName}
        </span>
      </div>

      {/* Conteúdo Específico por Métrica */}
      {activeMetric === 'miscigenacao' && (
        <div className="space-y-2.5 text-xs">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Composição Étnica (Censo IBGE 2022)
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800 shadow-inner">
            <div style={{ width: `${profile.etnia.pardoPercent}%` }} className="bg-amber-500" title={`Pardos ${profile.etnia.pardoPercent}%`} />
            <div style={{ width: `${profile.etnia.brancoPercent}%` }} className="bg-sky-400" title={`Brancos ${profile.etnia.brancoPercent}%`} />
            <div style={{ width: `${profile.etnia.pretoPercent}%` }} className="bg-purple-500" title={`Pretos ${profile.etnia.pretoPercent}%`} />
            <div style={{ width: `${profile.etnia.indigenaPercent}%` }} className="bg-emerald-400" title={`Indígenas ${profile.etnia.indigenaPercent}%`} />
            <div style={{ width: `${profile.etnia.amareloPercent}%` }} className="bg-yellow-400" title={`Amarelos ${profile.etnia.amareloPercent}%`} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
            <div className="flex justify-between bg-slate-900 px-2 py-1.5 rounded-lg border border-amber-500/30">
              <span className="text-amber-300 font-semibold">Pardos:</span>
              <strong className="font-mono text-white font-black">{profile.etnia.pardoPercent}%</strong>
            </div>
            <div className="flex justify-between bg-slate-900 px-2 py-1.5 rounded-lg border border-sky-500/30">
              <span className="text-sky-300 font-semibold">Brancos:</span>
              <strong className="font-mono text-white font-black">{profile.etnia.brancoPercent}%</strong>
            </div>
            <div className="flex justify-between bg-slate-900 px-2 py-1.5 rounded-lg border border-purple-500/30">
              <span className="text-purple-300 font-semibold">Pretos:</span>
              <strong className="font-mono text-white font-black">{profile.etnia.pretoPercent}%</strong>
            </div>
            <div className="flex justify-between bg-slate-900 px-2 py-1.5 rounded-lg border border-emerald-500/30">
              <span className="text-emerald-300 font-semibold">Indígenas:</span>
              <strong className="font-mono text-white font-black">{profile.etnia.indigenaPercent}%</strong>
            </div>
          </div>
        </div>
      )}

      {activeMetric === 'genero' && (
        <div className="space-y-2.5 text-xs">
          <div className="text-[11px] font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> Distribuição de Gênero & Razão de Sexo
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800 shadow-inner">
            <div style={{ width: `${profile.genero.mulheresPercent}%` }} className="bg-pink-500" />
            <div style={{ width: `${profile.genero.homensPercent}%` }} className="bg-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-2 rounded-xl border border-pink-500/40">
              <span className="text-pink-400 font-bold block">Mulheres:</span>
              <div className="font-mono font-black text-pink-300 text-sm mt-0.5">{profile.genero.mulheresPercent}%</div>
              <span className="text-[10px] text-slate-400 font-mono">{(profile.genero.mulheresTotal / 1000000).toFixed(2)}M pessoas</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-xl border border-blue-500/40">
              <span className="text-blue-400 font-bold block">Homens:</span>
              <div className="font-mono font-black text-blue-300 text-sm mt-0.5">{profile.genero.homensPercent}%</div>
              <span className="text-[10px] text-slate-400 font-mono">{(profile.genero.homensTotal / 1000000).toFixed(2)}M pessoas</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-300 pt-1.5 border-t border-slate-800">
            <span>Razão de sexo:</span>
            <strong className="font-mono text-amber-300 font-bold">{profile.genero.razaoDeSexo} ♂ / 100 ♀</strong>
          </div>
        </div>
      )}

      {activeMetric === 'densidade' && (
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Densidade & Urbanização
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Densidade Demográfica:</span>
            <strong className="font-mono text-sky-300 font-black">{profile.demografia.densidadeHabKm2.toLocaleString('pt-BR')} hab/km²</strong>
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">População Censo 2022:</span>
            <strong className="font-mono text-white font-bold">{profile.demografia.populacaoTotal.toLocaleString('pt-BR')} hab</strong>
          </div>
          {profile.demografia.populacaoEstimadaIBGE && (
            <div className="flex justify-between bg-cyan-950/60 px-2.5 py-1.5 rounded-lg border border-cyan-500/50">
              <span className="text-cyan-200 font-semibold">Estimativa IBGE (2025):</span>
              <strong className="font-mono text-cyan-300 font-black">{profile.demografia.populacaoEstimadaIBGE.toLocaleString('pt-BR')} hab</strong>
            </div>
          )}
        </div>
      )}

      {activeMetric === 'natalidade' && (
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5" /> Taxa de Natalidade & Fecundidade
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Natalidade:</span>
            <strong className="font-mono text-cyan-300 font-black">{profile.vitais.taxaNatalidadePorMil.toFixed(1)} por mil hab.</strong>
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Fecundidade:</span>
            <strong className="font-mono text-white font-bold">{profile.vitais.taxaFecundidade.toFixed(2)} filhos/mulher</strong>
          </div>
        </div>
      )}

      {activeMetric === 'mortalidade' && (
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5" /> Longevidade & Mortalidade Infantil
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Expectativa de Vida:</span>
            <strong className="font-mono text-emerald-300 font-black">{profile.vitais.expectativaVidaAnos.toFixed(1)} anos</strong>
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Mortalidade Infantil:</span>
            <strong className="font-mono text-rose-400 font-bold">{profile.vitais.taxaMortalidadeInfantil.toFixed(1)} por mil nascidos</strong>
          </div>
        </div>
      )}

      {activeMetric === 'analfabetismo' && (
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Educação e Alfabetização
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Taxa de Alfabetização:</span>
            <strong className="font-mono text-emerald-300 font-black">{profile.educacao.taxaAlfabetizacao.toFixed(1)}%</strong>
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Analfabetismo (15+ anos):</span>
            <strong className="font-mono text-amber-400 font-bold">{profile.educacao.taxaAnalfabetismo15Mais.toFixed(1)}%</strong>
          </div>
        </div>
      )}

      {activeMetric === 'partidos' && (
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" /> Liderança Executiva Estadual
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Governador:</span>
            <strong className="text-white font-bold">{profile.politica.governador}</strong>
          </div>
          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-300">Partido:</span>
            <strong className="font-mono text-amber-400 font-black">{profile.politica.siglaPartido}</strong>
          </div>
        </div>
      )}

      {/* CTA Rodapé */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/80 font-mono text-center flex items-center justify-center gap-1">
        <span>Clique no ponto para abrir o painel detalhado do estado</span>
      </div>
    </div>
  );
};
