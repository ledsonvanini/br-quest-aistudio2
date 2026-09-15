import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  HeartPulse,
  Baby,
  Vote,
  TrendingUp,
  Percent,
  Search,
  Filter,
  X,
  Globe,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Shield,
  Layers,
  MapPin,
  Landmark,
  Map as MapIcon,
  Sparkles,
  ArrowUpRight,
  ArrowUpDown,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import {
  GeopoliticaMetricKey,
  GeopoliticaScope,
  StateGeopoliticsProfile,
  RegionGeopoliticsSummary,
  NationalGeopoliticsSummary,
} from '../../types/geopolitica';
import {
  BRAZIL_NATIONAL_GEOPOLITICS,
  REGIONS_GEOPOLITICS_DATA,
  BRAZIL_STATES_GEOPOLITICS,
} from '../../data/geopoliticaData';
import { BRAZIL_STATES_REGISTRY } from '../../data/brazilStatesRegistry';
import { audioEngine } from '../../lib/audioSynth';
import { GeopoliticaTerritorialToolbar } from './geopolitica/GeopoliticaTerritorialToolbar';
import { GeopoliticaCompareModal } from './geopolitica/GeopoliticaCompareModal';

interface GeopoliticsControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeMetric: GeopoliticaMetricKey;
  onMetricChange: (metric: GeopoliticaMetricKey) => void;
  scope?: GeopoliticaScope;
  onScopeChange?: (scope: GeopoliticaScope) => void;
  selectedRegionFilter?: string;
  onSelectRegionFilter?: (region: string) => void;
  onOpenStateDetails?: (stateId: string) => void;
  onSelectState?: (stateId: string) => void;
  selectedStateId?: string | null;
  onToggleExpand?: (expanded: boolean) => void;
  showNeighbors?: boolean;
  onToggleNeighbors?: () => void;
}

export const GeopoliticsControlPanel: React.FC<GeopoliticsControlPanelProps> = ({
  isOpen,
  onClose,
  activeMetric,
  onMetricChange,
  scope = 'nacional',
  onScopeChange,
  selectedRegionFilter = 'todos',
  onSelectRegionFilter,
  onOpenStateDetails,
  onSelectState,
  selectedStateId,
  onToggleExpand,
  showNeighbors = false,
  onToggleNeighbors,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedStateRegion, setSelectedStateRegion] = useState<string>('todos');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [sortByMetric, setSortByMetric] = useState<boolean>(true);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const metricsScrollRef = useRef<HTMLDivElement>(null);

  // Sincronizar abertura e rolagem suave para a métrica ativa quando alterada via TopMenu ou externamente
  useEffect(() => {
    setIsDrawerOpen(true);
    if (metricsScrollRef.current) {
      const activeBtn = metricsScrollRef.current.querySelector<HTMLElement>(`#btn-metrica-${activeMetric}`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeMetric]);

  const handleStateSelection = (stateId: string) => {
    if (onSelectState) {
      onSelectState(stateId);
    } else if (onOpenStateDetails) {
      onOpenStateDetails(stateId);
    }
  };

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    const next = !isExpanded;
    setIsExpanded(next);
    onToggleExpand?.(next);
  };

  const scrollMetrics = (direction: 'left' | 'right') => {
    audioEngine.playSfx('click');
    if (metricsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      metricsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  // Definição das métricas disponíveis
  const metricsConfig: {
    id: GeopoliticaMetricKey;
    label: string;
    icon: React.ReactNode;
    color: string;
    title: string;
    desc: string;
  }[] = [
    {
      id: 'miscigenacao',
      label: 'Etnias',
      icon: <Users className="w-4 h-4" />,
      color: '#f59e0b',
      title: 'Miscigenação & Composição Étnica',
      desc: 'Censo 2022: Pardos (45,3%), Brancos (43,5%), Pretos (10,2%), Indígenas (0,8%) e Amarelos (0,2%).',
    },
    {
      id: 'genero',
      label: 'Gênero',
      icon: <Percent className="w-4 h-4" />,
      color: '#ec4899',
      title: 'Distribuição de Gênero & Sexo',
      desc: '51,5% Mulheres (104,5M) vs 48,5% Homens (98,5M). Razão: 94,2 homens para cada 100 mulheres.',
    },
    {
      id: 'densidade',
      label: 'Densidade',
      icon: <Building2 className="w-4 h-4" />,
      color: '#38bdf8',
      title: 'Densidade Demográfica & Urbanização',
      desc: 'Concentração de hab/km², população urbana vs rural e estimativas recentes do IBGE.',
    },
    {
      id: 'natalidade',
      label: 'Natalidade',
      icon: <Baby className="w-4 h-4" />,
      color: '#06b6d4',
      title: 'Natalidade & Taxa de Fecundidade',
      desc: 'Nascimentos por 1.000 hab., taxa média de filhos por mulher (1,57) e faixa etária jovem.',
    },
    {
      id: 'mortalidade',
      label: 'Longevidade',
      icon: <HeartPulse className="w-4 h-4" />,
      color: '#ef4444',
      title: 'Saúde, Longevidade & Mortalidade',
      desc: 'Expectativa de vida média ao nascer (76,2 anos) e mortalidade infantil (11,2 por mil nascidos).',
    },
    {
      id: 'analfabetismo',
      label: 'Educação',
      icon: <GraduationCap className="w-4 h-4" />,
      color: '#10b981',
      title: 'Educação & Alfabetização (15+)',
      desc: 'Taxa de alfabetização (94,4%), percentual de analfabetismo (5,6%) e anos médios de estudo.',
    },
    {
      id: 'partidos',
      label: 'Política',
      icon: <Vote className="w-4 h-4" />,
      color: '#8b5cf6',
      title: 'Governos Estaduais & Partidos',
      desc: 'Distribuição partidária dos 27 governadores eleitos e representação parlamentar federal.',
    },
  ];

  // Helper para obter valor numérico para ordenação
  const getMetricSortValue = (st: StateGeopoliticsProfile, metric: GeopoliticaMetricKey): number => {
    switch (metric) {
      case 'miscigenacao':
        return st.etnia.pardoPercent + st.etnia.pretoPercent + st.etnia.indigenaPercent; // % Diversidade
      case 'genero':
        return st.genero.mulheresPercent;
      case 'densidade':
        return st.demografia.densidadeHabKm2;
      case 'natalidade':
        return st.vitais.taxaNatalidadePorMil;
      case 'mortalidade':
        return st.vitais.expectativaVidaAnos;
      case 'analfabetismo':
        return st.educacao.taxaAlfabetizacao;
      case 'partidos':
        return st.politica.bancadaFederalDeputados;
      default:
        return st.demografia.populacaoTotal;
    }
  };

  // Filtragem e ordenação da lista de estados
  const sortedAndFilteredStates = Object.values(BRAZIL_STATES_GEOPOLITICS)
    .filter((st) => {
      if (selectedStateRegion !== 'todos' && st.regionId.toLowerCase() !== selectedStateRegion.toLowerCase()) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          st.stateName.toLowerCase().includes(term) ||
          st.stateId.toLowerCase().includes(term) ||
          st.capital.toLowerCase().includes(term) ||
          st.politica.governador.toLowerCase().includes(term) ||
          st.politica.siglaPartido.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortByMetric) {
        return getMetricSortValue(b, activeMetric) - getMetricSortValue(a, activeMetric);
      }
      return a.stateName.localeCompare(b.stateName);
    });

  const activeMetricObj = metricsConfig.find((m) => m.id === activeMetric) || metricsConfig[0];

  return (
    <>
      {/* Botão Flutuante quando Minimizada a Gaveta */}
      {!isDrawerOpen && (
        <div className="fixed bottom-14 left-4 sm:left-[80px] z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            id="btn-reabrir-painel-geopolitica"
            onClick={() => {
              audioEngine.playSfx('click');
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/95 hover:bg-slate-900 border-2 border-cyan-400 text-cyan-300 text-xs font-serif font-black shadow-2xl shadow-black/90 hover:scale-105 transition-all cursor-pointer"
            title="Abrir Observatório Geopolítico"
          >
            <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Observatório Geopolítico & Demografia</span>
          </button>
        </div>
      )}

      {/* Painel Principal de Geopolítica (Lateral Esquerda, 50% Expandido por Padrão) */}
      {isDrawerOpen && (
        <div
          id="painel-geopolitica-catalogo"
          data-scrollable="true"
          className={`painel-hud-controles painel-controle-geopolitica fixed top-3 sm:top-3.5 md:top-4 bottom-14 sm:bottom-16 left-2 sm:left-[76px] md:left-[84px] lg:left-[88px] z-40 bg-slate-950/98 border border-cyan-500/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_24px_rgba(6,182,212,0.25)] backdrop-blur-2xl text-slate-100 flex flex-col animate-in fade-in slide-in-from-left-4 duration-300 select-none overflow-hidden pointer-events-auto transition-all ${
            isExpanded
              ? 'w-[calc(100vw-16px)] sm:w-[calc(50vw-44px)] lg:w-[calc(50vw-48px)] xl:w-[calc(50vw-52px)]'
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
          {/* CABEÇALHO DO PAINEL */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-md shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-serif font-black text-sm text-white tracking-wide truncate">
                    Observatório Geopolítico & Demografia
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee] shrink-0" />
                </div>
                <p className="text-[11px] text-cyan-300/90 font-medium truncate">
                  IBGE Censo 2022 & Projeções Oficiais • TSE • DataSUS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Botão Expandir / Restaurar (50% da tela) */}
              <button
                id="btn-tamanho-painel-geopolitica"
                onClick={handleToggleExpand}
                className="btn-tamanho-painel p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={isExpanded ? 'Restaurar tamanho compacto' : 'Maximizar painel (50% da tela)'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Minimizar para botão discreto */}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Minimizar painel"
              >
                <ChevronRight className="w-4 h-4 -rotate-90" />
              </button>

              {/* Fechar completamente */}
              <button
                id="btn-fechar-painel-geopolitica"
                onClick={onClose}
                className="btn-fechar-painel p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Fechar observatório"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BARRA DE SELEÇÃO DE ESCOPO (Nacional / Regional / Estadual) - Sempre Visível e Responsiva */}
          <div className="menu-seletor-escopo px-3 sm:px-4 py-2 bg-slate-950 border-b border-slate-800/90 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Escopo de Análise:
            </span>
            <div className="grid grid-cols-3 gap-1.5 flex-1 sm:flex-initial bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'nacional', label: 'Nacional', icon: '🇧🇷' },
                { id: 'regional', label: 'Regional', icon: '🗺️' },
                { id: 'estadual', label: 'Estadual', icon: '🏛️' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  id={`btn-escopo-${sc.id}`}
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onScopeChange?.(sc.id as GeopoliticaScope);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    scope === sc.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40 font-black'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs">{sc.icon}</span>
                  <span>{sc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BARRA DE FERRAMENTAS TERRITORIAIS (América do Sul / Vizinhos, Comparador A/B, Filtro Macrorregional) */}
          <GeopoliticaTerritorialToolbar
            showNeighbors={showNeighbors}
            onToggleNeighbors={onToggleNeighbors}
            isCompareOpen={isCompareOpen}
            onToggleCompare={() => setIsCompareOpen((prev) => !prev)}
            selectedRegionFilter={selectedStateRegion}
            onSelectRegionFilter={(reg) => {
              setSelectedStateRegion(reg);
              onSelectRegionFilter?.(reg);
            }}
          />

          {/* BARRA DE SELEÇÃO DE MÉTRICAS (Submenus Otimizados com Rolagem Suave) */}
          <div className="menu-seletor-metricas relative px-2.5 sm:px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => scrollMetrics('left')}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer transition border border-slate-800"
              title="Rolar para a esquerda"
              aria-label="Rolar métricas para esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={metricsScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto scroll-smooth scrollbar-none flex-1 py-0.5"
            >
              {metricsConfig.map((m) => {
                const isSelected = activeMetric === m.id;
                return (
                  <button
                    key={m.id}
                    id={`btn-metrica-${m.id}`}
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onMetricChange(m.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer border shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-black border-cyan-300 shadow-md scale-105'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-cyan-200'
                    }`}
                  >
                    <span style={{ color: isSelected ? '#020d24' : m.color }}>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollMetrics('right')}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer transition border border-slate-800"
              title="Rolar para a direita"
              aria-label="Rolar métricas para direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* BARRA DE FILTROS E BUSCA EM MODO ESTADUAL */}
          {scope === 'estadual' && (
            <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar estado, sigla, capital, governador ou partido..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Alternar Ordenação por Métrica Selecionada ou Alfabeto */}
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setSortByMetric((prev) => !prev);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 cursor-pointer transition shrink-0 ${
                    sortByMetric
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                  title={sortByMetric ? 'Ordenado pelo valor da métrica ativa' : 'Ordenado alfabeticamente'}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{sortByMetric ? 'Por Métrica' : 'A-Z'}</span>
                </button>
              </div>

              {/* Filtro Rápido por Regiões */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px]">
                {[
                  { id: 'todos', label: 'Todos (27)' },
                  { id: 'norte', label: 'Norte (7)' },
                  { id: 'nordeste', label: 'Nordeste (9)' },
                  { id: 'centro-oeste', label: 'Centro-Oeste (4)' },
                  { id: 'sudeste', label: 'Sudeste (4)' },
                  { id: 'sul', label: 'Sul (3)' },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      audioEngine.playSfx('click');
                      setSelectedStateRegion(reg.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
                      selectedStateRegion === reg.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold'
                        : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CORPO PRINCIPAL ROLÁVEL COM ESTATÍSTICAS DINÂMICAS */}
          <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs sm:text-sm">
            {/* ========================================================================= */}
            {/* 1. VISÃO NACIONAL UNIFICADA (Responde Dinamicamente à Métrica Selecionada) */}
            {/* ========================================================================= */}
            {scope === 'nacional' && (
              <div className="space-y-4">
                {/* Banner Principal Brasil com Comparativo Censo 2022 vs Estimativa Oficial IBGE */}
                <div className="card-geopolitica-nacional bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-bold font-serif text-amber-300 flex items-center gap-2">
                          <span>🇧🇷 República Federativa do Brasil</span>
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-bold">
                          IBGE Oficial
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        Área: 8.510.418 km² • Densidade: 23,86 hab/km² • 26 Estados + Distrito Federal
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <div className="bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
                        <div className="text-sm font-bold font-mono text-slate-200">
                          {BRAZIL_NATIONAL_GEOPOLITICS.populacaoTotal.toLocaleString('pt-BR')}
                        </div>
                        <span className="text-[9.5px] text-slate-400 font-sans">Censo 2022</span>
                      </div>
                      <div className="bg-cyan-950/60 px-3.5 py-2 rounded-xl border border-cyan-500/50 text-right">
                        <div className="text-base font-black font-mono text-cyan-300">
                          {BRAZIL_NATIONAL_GEOPOLITICS.populacaoEstimadaIBGE.toLocaleString('pt-BR')}
                        </div>
                        <span className="text-[9.5px] text-cyan-200 font-sans font-bold">Estimativa Atualizada</span>
                      </div>
                    </div>
                  </div>

                  {/* BLOCO EM DESTAQUE DINÂMICO DA MÉTRICA ATIVA */}
                  <div className="bg-slate-900/90 border-2 rounded-2xl p-4 space-y-3 transition-all" style={{ borderColor: `${activeMetricObj.color}70` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg text-slate-950 font-bold" style={{ backgroundColor: activeMetricObj.color }}>
                          {activeMetricObj.icon}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white font-serif">
                          {activeMetricObj.title}
                        </h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 font-mono font-bold text-slate-300 border border-slate-800">
                        Indicador Ativo
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {activeMetricObj.desc}
                    </p>

                    {/* CONTEÚDO ESPECÍFICO CONFORME A MÉTRICA SELECIONADA */}
                    {activeMetric === 'miscigenacao' && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        {/* Barra de Proporção Colorida Contínua */}
                        <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800 shadow-inner">
                          <div style={{ width: '45.3%' }} className="bg-amber-500" title="Pardos 45,3%" />
                          <div style={{ width: '43.5%' }} className="bg-sky-400" title="Brancos 43,5%" />
                          <div style={{ width: '10.2%' }} className="bg-purple-500" title="Pretos 10,2%" />
                          <div style={{ width: '0.8%' }} className="bg-emerald-400" title="Indígenas 0,8%" />
                          <div style={{ width: '0.2%' }} className="bg-yellow-400" title="Amarelos 0,2%" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2 rounded-xl bg-slate-950 border border-amber-500/30">
                            <span className="text-[10px] text-amber-400 font-bold">Pardos (Maioria)</span>
                            <div className="text-base font-black font-mono text-amber-300">45,3%</div>
                            <span className="text-[10px] text-slate-400 font-mono">92,1M pessoas</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-sky-500/30">
                            <span className="text-[10px] text-sky-400 font-bold">Brancos</span>
                            <div className="text-base font-black font-mono text-sky-300">43,5%</div>
                            <span className="text-[10px] text-slate-400 font-mono">88,3M pessoas</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-purple-500/30">
                            <span className="text-[10px] text-purple-400 font-bold">Pretos</span>
                            <div className="text-base font-black font-mono text-purple-300">10,2%</div>
                            <span className="text-[10px] text-slate-400 font-mono">20,7M pessoas</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30">
                            <span className="text-[10px] text-emerald-400 font-bold">Indígenas</span>
                            <div className="text-base font-black font-mono text-emerald-300">0,8%</div>
                            <span className="text-[10px] text-slate-400 font-mono">1,7M pessoas</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMetric === 'genero' && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800 shadow-inner">
                          <div style={{ width: '51.5%' }} className="bg-pink-500" title="Mulheres 51,5%" />
                          <div style={{ width: '48.5%' }} className="bg-blue-500" title="Homens 48,5%" />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-pink-500/40">
                            <span className="text-xs text-pink-400 font-bold">Mulheres (Maioria Nacional)</span>
                            <div className="text-lg font-black font-mono text-pink-300">51,5%</div>
                            <span className="text-[10px] text-slate-400 font-mono">104.548.325 residentes (+6,0M mulheres)</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/40">
                            <span className="text-xs text-blue-400 font-bold">Homens</span>
                            <div className="text-lg font-black font-mono text-blue-300">48,5%</div>
                            <span className="text-[10px] text-slate-400 font-mono">98.532.431 residentes</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950 text-slate-300 flex justify-between items-center text-xs">
                          <span>Razão de Sexo Nacional (IBGE Censo 2022):</span>
                          <strong className="text-amber-300 font-mono font-bold">94,2 homens para cada 100 mulheres</strong>
                        </div>
                      </div>
                    )}

                    {activeMetric === 'densidade' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-xl bg-slate-950 border border-sky-500/30">
                            <span className="text-[10px] text-slate-400">Densidade Média</span>
                            <div className="text-base font-black font-mono text-sky-300">23,86 hab/km²</div>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-sky-500/30">
                            <span className="text-[10px] text-slate-400">Taxa de Urbanização</span>
                            <div className="text-base font-black font-mono text-emerald-300">84,7%</div>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-sky-500/30">
                            <span className="text-[10px] text-slate-400">UF Mais Densa</span>
                            <div className="text-base font-black font-mono text-rose-300">RJ (390 hab/km²)</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMetric === 'natalidade' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30">
                            <span className="text-[10px] text-slate-400">Taxa de Natalidade</span>
                            <div className="text-base font-black font-mono text-cyan-300">12,8 ‰</div>
                            <span className="text-[9px] text-slate-500">Por 1.000 hab.</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30">
                            <span className="text-[10px] text-slate-400">Fecundidade</span>
                            <div className="text-base font-black font-mono text-amber-300">1,57</div>
                            <span className="text-[9px] text-slate-500">Filhos por mulher</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30">
                            <span className="text-[10px] text-slate-400">Jovens (0-14)</span>
                            <div className="text-base font-black font-mono text-white">19,8%</div>
                            <span className="text-[9px] text-slate-500">Da população total</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMetric === 'mortalidade' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                            <span className="text-[10px] text-slate-400">Expectativa de Vida</span>
                            <div className="text-base font-black font-mono text-cyan-300">76,2 anos</div>
                            <span className="text-[9px] text-slate-500">Ao nascer (IBGE)</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                            <span className="text-[10px] text-slate-400">Mortalidade Infantil</span>
                            <div className="text-base font-black font-mono text-rose-300">11,2 ‰</div>
                            <span className="text-[9px] text-slate-500">Por 1.000 nascidos</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                            <span className="text-[10px] text-slate-400">Idosos (60+)</span>
                            <div className="text-base font-black font-mono text-amber-300">15,6%</div>
                            <span className="text-[9px] text-slate-500">32,1M idosos</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMetric === 'analfabetismo' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30">
                            <span className="text-[10px] text-slate-400">Alfabetização (15+)</span>
                            <div className="text-base font-black font-mono text-emerald-300">94,4%</div>
                            <span className="text-[9px] text-slate-500">Recorde histórico</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30">
                            <span className="text-[10px] text-slate-400">Taxa Analfabetismo</span>
                            <div className="text-base font-black font-mono text-rose-300">5,6%</div>
                            <span className="text-[9px] text-slate-500">9,6M pessoas</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30">
                            <span className="text-[10px] text-slate-400">Ensino Superior</span>
                            <div className="text-base font-black font-mono text-sky-300">19,2%</div>
                            <span className="text-[9px] text-slate-500">Graduados</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeMetric === 'partidos' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                        <div className="text-[11px] text-slate-400">Distribuição dos 27 Governadores por Partido:</div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                          {BRAZIL_NATIONAL_GEOPOLITICS.distribuicaoPartidariaGovernos.map((p) => (
                            <div key={p.sigla} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                              <span className="font-bold font-mono text-[11px]" style={{ color: p.corHex }}>{p.sigla}</span>
                              <span className="font-mono font-black text-white text-xs">{p.totalEstados} UFs</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. VISÃO REGIONAL (Adapta Todos os Dados à Métrica Selecionada) */}
            {/* ========================================================================= */}
            {scope === 'regional' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Panorama das 5 Grandes Regiões do Brasil:</span>
                  <span className="text-cyan-300 font-bold">Métrica: {activeMetricObj.label}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {Object.values(REGIONS_GEOPOLITICS_DATA).map((reg) => (
                    <div
                      key={reg.regionId}
                      className="card-geopolitica-regional bg-slate-900/90 border border-slate-800 hover:border-cyan-400/60 p-4 rounded-2xl space-y-3 transition shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="font-bold text-cyan-300 text-base font-serif">
                            {reg.regionName}
                          </span>
                          <p className="text-[10px] text-slate-400">{reg.areaKm2.toLocaleString('pt-BR')} km²</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-mono font-bold text-amber-300">
                            {reg.populacaoTotal.toLocaleString('pt-BR')}
                          </span>
                          <div className="text-[9.5px] text-slate-400 font-mono">habitantes (Censo)</div>
                        </div>
                      </div>

                      {/* CONTEÚDO REGIONAL ESPECÍFICO PARA A MÉTRICA ATIVA */}
                      {activeMetric === 'miscigenacao' && (
                        <div className="space-y-2">
                          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
                            <div style={{ width: `${reg.etnia.pardoPercent}%` }} className="bg-amber-500" />
                            <div style={{ width: `${reg.etnia.brancoPercent}%` }} className="bg-sky-400" />
                            <div style={{ width: `${reg.etnia.pretoPercent}%` }} className="bg-purple-500" />
                            <div style={{ width: `${reg.etnia.indigenaPercent}%` }} className="bg-emerald-400" />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            <div className="p-1.5 rounded-lg bg-slate-950 flex justify-between">
                              <span className="text-amber-400">Pardos:</span>
                              <strong className="font-mono">{reg.etnia.pardoPercent}%</strong>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-950 flex justify-between">
                              <span className="text-sky-300">Brancos:</span>
                              <strong className="font-mono">{reg.etnia.brancoPercent}%</strong>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-950 flex justify-between">
                              <span className="text-purple-300">Pretos:</span>
                              <strong className="font-mono">{reg.etnia.pretoPercent}%</strong>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-950 flex justify-between">
                              <span className="text-emerald-300">Indígenas:</span>
                              <strong className="font-mono">{reg.etnia.indigenaPercent}%</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'genero' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            <div className="p-1.5 rounded-lg bg-slate-950">
                              <span className="text-pink-400">Mulheres:</span>
                              <div className="font-mono font-bold text-pink-300 text-sm">{reg.genero.mulheresPercent}%</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-950">
                              <span className="text-blue-400">Homens:</span>
                              <div className="font-mono font-bold text-blue-300 text-sm">{reg.genero.homensPercent}%</div>
                            </div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-slate-950 flex justify-between text-xs">
                            <span className="text-slate-300">Razão de Sexo:</span>
                            <strong className="font-mono text-amber-300">{reg.genero.razaoDeSexo} ♂ / 100 ♀</strong>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'densidade' && (
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          <div className="p-2 rounded-lg bg-slate-950">
                            <span className="text-slate-400">Densidade Média:</span>
                            <div className="font-mono font-bold text-sky-300 text-sm">{reg.densidadeMedia} hab/km²</div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950">
                            <span className="text-slate-400">Área Territorial:</span>
                            <div className="font-mono font-bold text-white text-xs">{reg.areaKm2.toLocaleString('pt-BR')} km²</div>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'natalidade' && (
                        <div className="p-2 rounded-lg bg-slate-950 flex justify-between items-center text-xs">
                          <span className="text-slate-300">Taxa de Natalidade Média:</span>
                          <strong className="font-mono text-cyan-300 font-bold text-sm">{reg.taxaNatalidadeMedia} ‰</strong>
                        </div>
                      )}

                      {activeMetric === 'mortalidade' && (
                        <div className="p-2 rounded-lg bg-slate-950 flex justify-between items-center text-xs">
                          <span className="text-slate-300">Mortalidade Infantil Média:</span>
                          <strong className="font-mono text-rose-300 font-bold text-sm">{reg.taxaMortalidadeInfantilMedia} ‰ nascidos</strong>
                        </div>
                      )}

                      {activeMetric === 'analfabetismo' && (
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          <div className="p-2 rounded-lg bg-slate-950">
                            <span className="text-slate-400">Alfabetização:</span>
                            <div className="font-mono font-bold text-emerald-300 text-sm">{(100 - reg.taxaAnalfabetismoMedia).toFixed(1)}%</div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950">
                            <span className="text-slate-400">Analfabetismo:</span>
                            <div className="font-mono font-bold text-rose-300 text-sm">{reg.taxaAnalfabetismoMedia}%</div>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'partidos' && (
                        <div className="space-y-1.5 text-[11px]">
                          <div className="text-[10px] text-slate-400">Governos dos Estados:</div>
                          <div className="flex flex-wrap gap-1">
                            {reg.partidosGovernantes.map((pg, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white"
                                style={{ backgroundColor: pg.corHex || '#8b5cf6' }}
                              >
                                {pg.partido} ({pg.estados.join(', ')})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Botão de Atalho para Listar Estados desta Região */}
                      <button
                        onClick={() => {
                          audioEngine.playSfx('click');
                          setSelectedStateRegion(reg.regionName.replace('Região ', '').trim());
                          onScopeChange?.('estadual');
                        }}
                        className="w-full py-1.5 px-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Explorar os Estados do {reg.regionName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. VISÃO ESTADUAL (Catálogo com Destaque Dinâmico da Métrica Ativa) */}
            {/* ========================================================================= */}
            {scope === 'estadual' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
                  <span>Mostrando {sortedAndFilteredStates.length} de 27 estados:</span>
                  <span className="text-cyan-300 font-bold">Métrica em Foco: {activeMetricObj.label}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sortedAndFilteredStates.map((st) => {
                    const registry = BRAZIL_STATES_REGISTRY[st.stateId];
                    const isSelected = selectedStateId === st.stateId;

                    return (
                      <div
                        key={st.stateId}
                        id={`card-estado-${st.stateId}`}
                        onClick={() => {
                          audioEngine.playSfx('click');
                          handleStateSelection(st.stateId);
                        }}
                        className={`card-guardiao-estado card-geopolitica-estado p-3 rounded-2xl border transition-all cursor-pointer select-none space-y-2 ${
                          isSelected
                            ? 'bg-slate-900/95 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-950/50'
                            : 'bg-slate-900/80 border-slate-800 hover:border-cyan-400/60 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="pin-brasao-estado w-7 h-7 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                              {registry?.coatOfArmsUrl ? (
                                <img
                                  src={registry.coatOfArmsUrl}
                                  alt={st.stateId}
                                  className="w-5 h-5 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-[10px] font-mono font-bold text-cyan-300">{st.stateId}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-xs text-white">{st.stateId}</span>
                                <strong className="font-serif text-sm font-bold text-amber-200 truncate">
                                  {st.stateName}
                                </strong>
                              </div>
                              <span className="text-[10px] text-slate-400 font-sans">
                                Cap: {st.capital} • {st.regionName}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-white">
                              {(st.demografia.populacaoTotal / 1000000).toFixed(2)}M
                            </span>
                            <div className="text-[9px] text-slate-400">hab.</div>
                          </div>
                        </div>

                        {/* INDICADOR ESPECÍFICO DA MÉTRICA ATIVA */}
                        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          {activeMetric === 'miscigenacao' && (
                            <>
                              <span className="text-slate-300">Pardos: <strong className="text-amber-300 font-mono">{st.etnia.pardoPercent}%</strong></span>
                              <span className="text-slate-300">Brancos: <strong className="text-sky-300 font-mono">{st.etnia.brancoPercent}%</strong></span>
                              <span className="text-slate-300">Pretos: <strong className="text-purple-300 font-mono">{st.etnia.pretoPercent}%</strong></span>
                            </>
                          )}
                          {activeMetric === 'genero' && (
                            <>
                              <span className="text-pink-400">Mulheres: <strong className="font-mono">{st.genero.mulheresPercent}%</strong></span>
                              <span className="text-amber-300 font-mono font-bold">{st.genero.razaoDeSexo} ♂ / 100 ♀</span>
                            </>
                          )}
                          {activeMetric === 'densidade' && (
                            <>
                              <span className="text-slate-300">Densidade:</span>
                              <strong className="text-sky-300 font-mono font-bold">{st.demografia.densidadeHabKm2.toLocaleString('pt-BR')} hab/km²</strong>
                            </>
                          )}
                          {activeMetric === 'natalidade' && (
                            <>
                              <span className="text-slate-300">Natalidade: <strong className="text-cyan-300 font-mono">{st.vitais.taxaNatalidadePorMil} ‰</strong></span>
                              <span className="text-slate-300">Fecundidade: <strong className="text-amber-300 font-mono">{st.vitais.taxaFecundidade}</strong></span>
                            </>
                          )}
                          {activeMetric === 'mortalidade' && (
                            <>
                              <span className="text-slate-300">Expectativa: <strong className="text-cyan-300 font-mono">{st.vitais.expectativaVidaAnos} anos</strong></span>
                              <span className="text-rose-300 font-mono font-bold">{st.vitais.taxaMortalidadeInfantil} ‰ inf.</span>
                            </>
                          )}
                          {activeMetric === 'analfabetismo' && (
                            <>
                              <span className="text-emerald-300 font-bold">Alfabetização: {st.educacao.taxaAlfabetizacao}%</span>
                              <span className="text-rose-300 font-mono">Analf: {st.educacao.taxaAnalfabetismo15Mais}%</span>
                            </>
                          )}
                          {activeMetric === 'partidos' && (
                            <>
                              <span className="text-slate-300 truncate max-w-[120px]">{st.politica.governador}</span>
                              <span
                                className="px-2 py-0.5 rounded font-mono font-bold text-[10px] text-white"
                                style={{ backgroundColor: st.politica.partidoCorHex || '#8b5cf6' }}
                              >
                                {st.politica.siglaPartido}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Link de Ação Rápida */}
                        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold pt-0.5">
                          <span>Clique para isolar e ver Raio-X</span>
                          <span>→</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Comparador Interestadual A/B */}
      <GeopoliticaCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialStateA={selectedStateId || 'SP'}
        initialStateB="BA"
      />
    </>
  );
};
