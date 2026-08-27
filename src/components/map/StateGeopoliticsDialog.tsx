import React, { useState } from 'react';
import {
  X,
  Users,
  Building2,
  GraduationCap,
  HeartPulse,
  Baby,
  Vote,
  TrendingUp,
  Percent,
  MapPin,
  Landmark,
  Shield,
  Award,
  Globe,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { GeopoliticaMetricKey, StateGeopoliticsProfile } from '../../types/geopolitica';
import { BRAZIL_STATES_GEOPOLITICS } from '../../data/geopoliticaData';
import { BRAZIL_STATES_REGISTRY } from '../../data/brazilStatesRegistry';
import { audioEngine } from '../../lib/audioSynth';

interface StateGeopoliticsDialogProps {
  stateId: string | null;
  onClose: () => void;
  activeMetric?: GeopoliticaMetricKey;
  initialMetric?: string;
  onToggleExpand?: (expanded: boolean) => void;
}

export const StateGeopoliticsDialog: React.FC<StateGeopoliticsDialogProps> = ({
  stateId,
  onClose,
  activeMetric,
  initialMetric = 'geral',
  onToggleExpand,
}) => {
  const getInitialTab = (): 'geral' | 'etnia' | 'genero' | 'demografia' | 'saude' | 'educacao' | 'politica' => {
    if (activeMetric === 'miscigenacao') return 'etnia';
    if (activeMetric === 'genero') return 'genero';
    if (activeMetric === 'densidade') return 'demografia';
    if (activeMetric === 'natalidade' || activeMetric === 'mortalidade') return 'saude';
    if (activeMetric === 'analfabetismo') return 'educacao';
    if (activeMetric === 'partidos') return 'politica';
    return 'geral';
  };

  const [activeTab, setActiveTab] = useState<'geral' | 'etnia' | 'genero' | 'demografia' | 'saude' | 'educacao' | 'politica'>(getInitialTab);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!stateId) return null;
  const profile: StateGeopoliticsProfile | undefined = BRAZIL_STATES_GEOPOLITICS[stateId];
  const registry = BRAZIL_STATES_REGISTRY[stateId];

  if (!profile) return null;

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    const next = !isExpanded;
    setIsExpanded(next);
    onToggleExpand?.(next);
  };

  return (
    <div
      id="dialog-geopolitica-estado"
      data-scrollable="true"
      className={`modal-dialog-geopolitica-estado painel-dialog-geopolitica fixed top-14 sm:top-15 md:top-[58px] bottom-9 sm:bottom-10 md:bottom-[42px] left-2 sm:left-3 md:left-4 z-40 max-w-[calc(100vw-16px)] bg-slate-950/98 sm:bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_24px_rgba(6,182,212,0.25)] flex flex-col text-slate-100 animate-in fade-in slide-in-from-left-4 duration-300 select-text overflow-hidden cursor-default pointer-events-auto transition-all duration-300 ${
        isExpanded
          ? 'w-[calc(100vw-16px)] sm:w-[calc(50vw-16px)] lg:w-[calc(50vw-20px)] xl:w-[calc(50vw-24px)]'
          : 'w-[calc(100vw-16px)] sm:w-[500px] md:w-[540px]'
      }`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Puxador em telas móveis */}
      <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto sm:hidden mt-2 -mb-1 shrink-0" />

      {/* CABEÇALHO COM BRASÃO, NOME E POLÍTICA */}
      <div className="px-3.5 sm:px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-cyan-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
            {registry?.coatOfArmsUrl ? (
              <img
                src={registry.coatOfArmsUrl}
                alt={profile.stateName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xs font-bold font-mono text-cyan-300">{profile.stateId}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold shrink-0">
                {profile.stateId}
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate">
                {profile.stateName}
              </h2>
              <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                • Região {profile.regionName}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans truncate mt-0.5">
              Capital: <strong className="text-slate-200">{profile.capital}</strong> • Governador:{' '}
              <strong className="text-cyan-300">{profile.politica.governador}</strong> ({profile.politica.siglaPartido})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-expandir-dialog-geopolitica"
            onClick={handleToggleExpand}
            className="btn-tamanho-painel w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition cursor-pointer"
            title={isExpanded ? 'Visualização Compacta' : 'Expandir Janela (50% da tela)'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            id="btn-fechar-dialog-geopolitica"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-painel w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-rose-400 text-slate-300 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
            title="Fechar Detalhamento"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO DE ABAS OTIMIZADAS */}
      <div className="menu-navegacao-abas px-3 sm:px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
        {[
          { id: 'geral', label: 'Geral', icon: <Globe className="w-3.5 h-3.5" /> },
          { id: 'etnia', label: 'Etnias', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'genero', label: 'Gênero', icon: <Percent className="w-3.5 h-3.5" /> },
          { id: 'demografia', label: 'Demografia', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'saude', label: 'Saúde', icon: <HeartPulse className="w-3.5 h-3.5" /> },
          { id: 'educacao', label: 'Educação', icon: <GraduationCap className="w-3.5 h-3.5" /> },
          { id: 'politica', label: 'Governo', icon: <Vote className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`btn-aba-geopolitica-${tab.id}`}
              onClick={() => {
                audioEngine.playSfx('click');
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer border ${
                isSel
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-cyan-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO PRINCIPAL ROLÁVEL */}
      <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs sm:text-sm">
          {/* 1. VISÃO GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              {/* Cards de Métricas Principais */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">População Censo 2022</span>
                  <div className="text-base sm:text-lg font-bold font-mono text-cyan-300">
                    {profile.demografia.populacaoTotal.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {profile.rankingPopulacaoNacional}º maior do Brasil
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Densidade Demográfica</span>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-300">
                    {profile.demografia.densidadeHabKm2.toLocaleString('pt-BR')} hab/km²
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {profile.rankingDensidadeNacional}º mais denso
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Taxa de Alfabetização</span>
                  <div className="text-base sm:text-lg font-bold font-mono text-amber-300">
                    {profile.educacao.taxaAlfabetizacao.toFixed(1)}%
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {profile.rankingAlfabetizacaoNacional}º em educação
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Expectativa de Vida</span>
                  <div className="text-base sm:text-lg font-bold font-mono text-pink-300">
                    {profile.vitais.expectativaVidaAnos.toFixed(1)} anos
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Fecundidade: {profile.vitais.taxaFecundidade.toFixed(2)} filhos
                  </span>
                </div>
              </div>

              {/* Destaques Socioeconômicos e Desafios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-cyan-500/20 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Potenciais & Destaques Socioeconômicos
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {profile.destaquesSocioEconomicosPt.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-amber-500/20 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400" />
                    Desafios Estruturais & Geopolíticos
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {profile.desafiosRegionaisPt.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. ETNIA & MISCIGENAÇÃO */}
          {activeTab === 'etnia' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-serif font-bold text-sm text-amber-300">
                  Composição Étnico-Racial (IBGE Censo 2022)
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Pardos', pct: profile.etnia.pardoPercent, total: profile.etnia.pardoTotal, color: 'bg-amber-500' },
                    { label: 'Brancos', pct: profile.etnia.brancoPercent, total: profile.etnia.brancoTotal, color: 'bg-sky-400' },
                    { label: 'Pretos', pct: profile.etnia.pretoPercent, total: profile.etnia.pretoTotal, color: 'bg-purple-500' },
                    { label: 'Indígenas', pct: profile.etnia.indigenaPercent, total: profile.etnia.indigenaTotal, color: 'bg-emerald-500' },
                    { label: 'Amarelos', pct: profile.etnia.amareloPercent, total: profile.etnia.amareloTotal, color: 'bg-yellow-400' },
                  ].map((et) => (
                    <div key={et.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{et.label} ({et.total.toLocaleString('pt-BR')} hab.)</span>
                        <strong className="text-white font-mono">{et.pct.toFixed(1)}%</strong>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div className={`h-full ${et.color}`} style={{ width: `${et.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. GÊNERO & SEXO */}
          {activeTab === 'genero' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-pink-500/30 space-y-2">
                  <span className="text-xs text-pink-400 font-bold">População Feminina</span>
                  <div className="text-2xl font-bold font-mono text-pink-300">
                    {profile.genero.mulheresPercent.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-300">
                    {profile.genero.mulheresTotal.toLocaleString('pt-BR')} mulheres
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-blue-500/30 space-y-2">
                  <span className="text-xs text-blue-400 font-bold">População Masculina</span>
                  <div className="text-2xl font-bold font-mono text-blue-300">
                    {profile.genero.homensPercent.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-300">
                    {profile.genero.homensTotal.toLocaleString('pt-BR')} homens
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400">Razão de Sexo</div>
                <div className="text-base font-bold font-mono text-amber-300">
                  {profile.genero.razaoDeSexo.toFixed(1)} homens para cada 100 mulheres
                </div>
              </div>
            </div>
          )}

          {/* 4. DEMOGRAFIA */}
          {activeTab === 'demografia' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">População Censo 2022</span>
                  <div className="text-lg font-bold font-mono text-white">
                    {profile.demografia.populacaoTotal.toLocaleString('pt-BR')} hab.
                  </div>
                  <span className="text-[11px] text-slate-400">Dados do Censo Demográfico</span>
                </div>
                {profile.demografia.populacaoEstimadaIBGE && (
                  <div className="bg-cyan-950/40 p-3.5 rounded-2xl border border-cyan-500/40">
                    <span className="text-xs text-cyan-300 font-bold">Estimativa Oficial IBGE (2024/2025)</span>
                    <div className="text-lg font-black font-mono text-cyan-300">
                      {profile.demografia.populacaoEstimadaIBGE.toLocaleString('pt-BR')} hab.
                    </div>
                    <span className="text-[11px] text-cyan-200/80">Portaria IBGE nº 1.041</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Área Territorial</span>
                  <div className="text-base font-bold font-mono text-white">
                    {profile.demografia.areaKm2.toLocaleString('pt-BR')} km²
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Taxa de Urbanização</span>
                  <div className="text-base font-bold font-mono text-cyan-300">
                    {profile.demografia.taxaUrbanizacao.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">População Idosa (60+)</span>
                  <div className="text-base font-bold font-mono text-purple-300">
                    {profile.demografia.populacaoIdosa60MaisPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SAÚDE & VITAIS */}
          {activeTab === 'saude' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Mortalidade Infantil</span>
                <div className="text-base font-bold font-mono text-rose-300">
                  {profile.vitais.taxaMortalidadeInfantil.toFixed(1)} ‰
                </div>
                <span className="text-[10px] text-slate-400">por 1.000 nascidos vivos</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Natalidade Geral</span>
                <div className="text-base font-bold font-mono text-cyan-300">
                  {profile.vitais.taxaNatalidadePorMil.toFixed(1)} ‰
                </div>
                <span className="text-[10px] text-slate-400">por 1.000 hab.</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Expectativa de Vida</span>
                <div className="text-base font-bold font-mono text-emerald-300">
                  {profile.vitais.expectativaVidaAnos.toFixed(1)} anos
                </div>
              </div>
            </div>
          )}

          {/* 6. EDUCAÇÃO */}
          {activeTab === 'educacao' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Alfabetização (15+)</span>
                <div className="text-base font-bold font-mono text-emerald-300">
                  {profile.educacao.taxaAlfabetizacao.toFixed(1)}%
                </div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Analfabetismo</span>
                <div className="text-base font-bold font-mono text-rose-400">
                  {profile.educacao.taxaAnalfabetismo15Mais.toFixed(1)}%
                </div>
                <span className="text-[10px] text-slate-400">
                  {profile.educacao.totalAnalfabetos.toLocaleString('pt-BR')} pessoas
                </span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Ensino Superior</span>
                <div className="text-base font-bold font-mono text-cyan-300">
                  {profile.educacao.taxaEnsinoSuperiorCompleto.toFixed(1)}%
                </div>
                <span className="text-[10px] text-slate-400">
                  {profile.educacao.anosMediosEstudo.toFixed(1)} anos de estudo
                </span>
              </div>
            </div>
          )}

          {/* 7. POLÍTICA & GOVERNO */}
          {activeTab === 'politica' && (
            <div className="space-y-3">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-xs text-slate-400">Governador Eleito</span>
                    <div className="text-base font-bold text-white">{profile.politica.governador}</div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-xl text-xs font-bold font-mono text-white"
                    style={{ backgroundColor: profile.politica.partidoCorHex || '#3b82f6' }}
                  >
                    {profile.politica.siglaPartido}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Vice: <strong className="text-white">{profile.politica.viceGovernador}</strong> • Mandato:{' '}
                  <strong className="text-cyan-300">{profile.politica.mandato}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Bancada Federal na Câmara</span>
                  <div className="text-lg font-bold font-mono text-cyan-300">
                    {profile.politica.bancadaFederalDeputados} Deputados
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Senadores da República</span>
                  <div className="text-xs text-slate-200 font-sans mt-1 space-y-0.5">
                    {profile.politica.senadores.map((sen, idx) => (
                      <div key={idx} className="truncate">• {sen}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};
