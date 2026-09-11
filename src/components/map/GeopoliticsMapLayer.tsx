import React from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  HeartPulse,
  Baby,
  Vote,
  TrendingUp,
  Percent,
  Compass,
  MapPin,
  Landmark,
  Shield,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';
import { GeopoliticaMetricKey, StateGeopoliticsProfile } from '../../types/geopolitica';
import { BRAZIL_STATES_GEOPOLITICS } from '../../data/geopoliticaData';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
import { BRAZIL_STATES_REGISTRY } from '../../data/brazilStatesRegistry';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { audioEngine } from '../../lib/audioSynth';

interface GeopoliticsMapLayerProps {
  activeMetric: GeopoliticaMetricKey;
  selectedStateId?: string | null;
  onSelectState: (stateId: string) => void;
  onHoverState?: (stateId: string | null) => void;
  geoProjectFn: (coords: [number, number]) => [number, number] | null;
  is3D?: boolean;
  hoveredStateId?: string | null;
  centroids?: Record<string, [number, number]>;
  disableHoverTooltip?: boolean;
}

export const GeopoliticsMapLayer: React.FC<GeopoliticsMapLayerProps> = ({
  activeMetric,
  selectedStateId,
  onSelectState,
  onHoverState,
  geoProjectFn,
  is3D = true,
  hoveredStateId,
  centroids,
  disableHoverTooltip = true,
}) => {
  // Formatadores de métricas para badge do pin e tooltip
  const getMetricBadgeContent = (profile: StateGeopoliticsProfile, metric: GeopoliticaMetricKey) => {
    switch (metric) {
      case 'miscigenacao': {
        const pardo = profile.etnia.pardoPercent;
        const branco = profile.etnia.brancoPercent;
        const preto = profile.etnia.pretoPercent;
        const indigena = profile.etnia.indigenaPercent;
        let dominant = 'Pardo';
        let val = pardo;
        let color = '#f59e0b';
        if (branco > val) { dominant = 'Branco'; val = branco; color = '#38bdf8'; }
        if (preto > val) { dominant = 'Preto'; val = preto; color = '#a855f7'; }
        if (indigena > val) { dominant = 'Indígena'; val = indigena; color = '#10b981'; }
        return {
          primary: `${val.toFixed(1)}%`,
          sub: `${dominant}`,
          color,
          icon: <Users className="w-3.5 h-3.5" />,
        };
      }
      case 'genero': {
        const mul = profile.genero.mulheresPercent;
        const ratio = profile.genero.razaoDeSexo;
        return {
          primary: `${mul.toFixed(1)}% ♀`,
          sub: `${ratio} ♂ / 100♀`,
          color: '#ec4899',
          icon: <Percent className="w-3.5 h-3.5" />,
        };
      }
      case 'densidade': {
        const dens = profile.demografia.densidadeHabKm2;
        return {
          primary: `${dens.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}`,
          sub: 'hab/km²',
          color: dens > 100 ? '#f43f5e' : dens > 30 ? '#f59e0b' : '#38bdf8',
          icon: <Building2 className="w-3.5 h-3.5" />,
        };
      }
      case 'natalidade': {
        const nat = profile.vitais.taxaNatalidadePorMil;
        const fec = profile.vitais.taxaFecundidade;
        return {
          primary: `${nat.toFixed(1)} ‰`,
          sub: `${fec.toFixed(2)} filhos`,
          color: '#06b6d4',
          icon: <Baby className="w-3.5 h-3.5" />,
        };
      }
      case 'mortalidade': {
        const exp = profile.vitais.expectativaVidaAnos;
        const mortInf = profile.vitais.taxaMortalidadeInfantil;
        return {
          primary: `${exp.toFixed(1)} anos`,
          sub: `${mortInf.toFixed(1)}‰ mort. inf.`,
          color: '#ef4444',
          icon: <HeartPulse className="w-3.5 h-3.5" />,
        };
      }
      case 'analfabetismo': {
        const alf = profile.educacao.taxaAlfabetizacao;
        const analf = profile.educacao.taxaAnalfabetismo15Mais;
        return {
          primary: `${alf.toFixed(1)}% alf.`,
          sub: `${analf.toFixed(1)}% analf.`,
          color: '#10b981',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
        };
      }
      case 'partidos': {
        const sigla = profile.politica.siglaPartido;
        const gov = profile.politica.governador.split(' ')[0];
        return {
          primary: sigla,
          sub: gov,
          color: profile.politica.partidoCorHex || '#8b5cf6',
          icon: <Vote className="w-3.5 h-3.5" />,
        };
      }
      default:
        return {
          primary: `${(profile.demografia.populacaoTotal / 1000000).toFixed(2)}M`,
          sub: 'habitantes',
          color: '#38bdf8',
          icon: <Users className="w-3.5 h-3.5" />,
        };
    }
  };

  // Formatadores de resumo direto, minimalista e discreto para o Pin em repouso (idle)
  const getMetricIdleSummary = (profile: StateGeopoliticsProfile, metric: GeopoliticaMetricKey) => {
    switch (metric) {
      case 'partidos': {
        return {
          text: profile.politica.siglaPartido,
          color: profile.politica.partidoCorHex || '#8b5cf6',
        };
      }
      case 'mortalidade': {
        return {
          text: `${profile.vitais.expectativaVidaAnos.toFixed(0)}a`,
          color: '#f43f5e',
        };
      }
      case 'miscigenacao': {
        const pardo = profile.etnia.pardoPercent;
        const branco = profile.etnia.brancoPercent;
        const preto = profile.etnia.pretoPercent;
        const indigena = profile.etnia.indigenaPercent;
        let dominant = 'P';
        let val = pardo;
        let color = '#f59e0b';
        if (branco > val) { dominant = 'B'; val = branco; color = '#38bdf8'; }
        if (preto > val) { dominant = 'PR'; val = preto; color = '#a855f7'; }
        if (indigena > val) { dominant = 'I'; val = indigena; color = '#10b981'; }
        return {
          text: `${val.toFixed(0)}% ${dominant}`,
          color,
        };
      }
      case 'genero': {
        return {
          text: `${profile.genero.mulheresPercent.toFixed(0)}%♀`,
          color: '#ec4899',
        };
      }
      case 'densidade': {
        const dens = profile.demografia.densidadeHabKm2;
        return {
          text: `${Math.round(dens)}/km²`,
          color: dens > 100 ? '#f43f5e' : dens > 30 ? '#f59e0b' : '#38bdf8',
        };
      }
      case 'natalidade': {
        return {
          text: `${profile.vitais.taxaNatalidadePorMil.toFixed(1)}‰`,
          color: '#06b6d4',
        };
      }
      case 'analfabetismo': {
        return {
          text: `${profile.educacao.taxaAlfabetizacao.toFixed(0)}%`,
          color: '#10b981',
        };
      }
      default: {
        return {
          text: `${(profile.demografia.populacaoTotal / 1000000).toFixed(1)}M`,
          color: '#38bdf8',
        };
      }
    }
  };

  // Quando qualquer estado estiver selecionado/isolado, oculta todos os pins e balões de dicas do mapa,
  // pois o aplicativo lateral já exibe todo o cenário detalhado.
  if (selectedStateId) return null;

  return (
    <div
      id="camada-pins-geopolitica"
      className="camada-pins-geopolitica absolute inset-0 pointer-events-none z-20"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {Object.entries(BRAZIL_STATES_GEOPOLITICS).map(([stateId, profile]) => {
        const capitalInfo = STATE_CAPITAL_GEO_DATA[stateId];
        if (!capitalInfo) return null;

        const projected = centroids?.[stateId] || geoProjectFn([capitalInfo.lng, capitalInfo.lat]);
        if (!projected) return null;

        const [projX, projY] = projected;
        const isHovered = hoveredStateId === stateId;
        const isSelected = selectedStateId === stateId;
        const summary = getMetricIdleSummary(profile, activeMetric);

        return (
          <div
            key={`geopolitica-pin-${stateId}`}
            id={`pin-geopolitica-${stateId}`}
            className="container-pin-mapa-geopolitica absolute pointer-events-auto select-none"
            style={{
              position: 'absolute',
              left: `${projX}px`,
              top: `${projY}px`,
              width: '0px',
              height: '0px',
              transformStyle: 'preserve-3d',
              zIndex: isHovered || isSelected ? 90 : 35,
            }}
          >
            {/* CORPO DO PIN GEOPOLÍTICO COM ALTO CONTRASTE E VISIBILIDADE */}
            <div
              className={`absolute flex flex-col items-center cursor-pointer will-change-transform ${
                isHovered || isSelected
                  ? 'scale-120 -translate-y-3.5 z-40'
                  : 'scale-100 translate-y-0 hover:scale-115 hover:-translate-y-2'
              }`}
              style={{
                transform: 'translate(-50%, -100%)',
                transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={() => {
                onHoverState?.(stateId);
              }}
              onMouseLeave={() => {
                onHoverState?.(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                audioEngine.playSfx('click');
                onSelectState(stateId);
              }}
              aria-label={`Geopolítica ${profile.stateName} (${stateId})`}
            >
              {/* BALÃO DISCRETO E MINIMALISTA DO PIN (UF • DADO RESUMIDO) */}
              <div
                className={`card-pin-geopolitica flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-950/95 border transition-all ${
                  isHovered || isSelected
                    ? 'border-cyan-400 bg-slate-900 ring-1 ring-cyan-400/80 scale-105'
                    : 'border-slate-700/80 hover:border-cyan-400 hover:bg-slate-900/95'
                }`}
                style={{
                  boxShadow: isHovered || isSelected
                    ? `0 0 10px ${summary.color}60, 0 3px 8px rgba(0,0,0,0.6)`
                    : `0 2px 4px rgba(0,0,0,0.45)`,
                }}
              >
                {/* Sigla do Estado */}
                <span className="text-[10.5px] font-mono font-black text-slate-100 leading-none">{stateId}</span>
                {/* Separador minimalista */}
                <span className="text-[9px] font-mono font-semibold text-slate-400 leading-none">:</span>
                {/* Valor Direto Resumido (ex: 69% P, 70% P) */}
                <span
                  className="text-[10.5px] font-mono font-bold tracking-tight whitespace-nowrap leading-none"
                  style={{ color: summary.color }}
                >
                  {summary.text}
                </span>
              </div>

              {/* HASTE DISCRETA DO PIN COM PONTA CÔNICA */}
              <div className="flex flex-col items-center pointer-events-none">
                <div
                  className="w-[1.5px] h-1.5"
                  style={{ backgroundColor: summary.color }}
                />
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: summary.color }}
                />
              </div>

              {/* TOOLTIP FLUTUANTE EXPANDIDO NO HOVER - Responde Diretamente à Subcategoria/Métrica Ativa com Alto Contraste e Auto-Posicionamento */}
              {!disableHoverTooltip && isHovered && (() => {
                const isNearTop = projY < 380;
                const isNearBottom = projY > 980;
                const isNearRight = projX > 1550;
                const isNearLeft = projX < 750;

                // Estilo de ancoragem inteligente para nunca ser cortado pelo topo, rodapé ou laterais da viewport
                const tooltipPositionStyle: React.CSSProperties = {
                  position: 'absolute',
                  zIndex: 9999,
                  pointerEvents: 'none',
                };

                if (isNearTop) {
                  // Estado perto do topo (RR, AP, norte do AM, etc.): renderizar abaixo do pin
                  tooltipPositionStyle.top = '100%';
                  tooltipPositionStyle.marginTop = '18px';
                } else {
                  // Padrão ou perto do rodapé (RS, SC, etc.): renderizar acima do pin
                  tooltipPositionStyle.bottom = '100%';
                  tooltipPositionStyle.marginBottom = '18px';
                }

                if (isNearRight) {
                  // Perto da borda leste (RN, PB, PE, AL, SE): alinhar à direita
                  tooltipPositionStyle.right = '0px';
                  tooltipPositionStyle.left = 'auto';
                  tooltipPositionStyle.transform = 'translateZ(60px)';
                } else if (isNearLeft) {
                  // Perto da borda oeste (AC, oeste do AM): alinhar à esquerda
                  tooltipPositionStyle.left = '0px';
                  tooltipPositionStyle.right = 'auto';
                  tooltipPositionStyle.transform = 'translateZ(60px)';
                } else {
                  // Centro: alinhamento centralizado
                  tooltipPositionStyle.left = '50%';
                  tooltipPositionStyle.transform = 'translateX(-50%) translateZ(60px)';
                }

                return (
                  <div
                    id={`balao-hover-geopolitica-${stateId}`}
                    className="container-balao-hover-geopolitica absolute pointer-events-none select-none animate-in fade-in zoom-in-95 duration-150"
                    style={tooltipPositionStyle}
                  >
                    <div className="card-balao-geopolitica-conteudo w-[310px] sm:w-[350px] p-4 sm:p-4.5 rounded-2xl bg-slate-950 border-2 border-cyan-400 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_30px_rgba(6,182,212,0.45)] text-left text-white space-y-3">
                      {/* Cabeçalho do Estado no Tooltip */}
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

                      {/* Detalhes Específicos para a Métrica Selecionada com Alto Contraste */}
                      {activeMetric === 'miscigenacao' && (
                        <div className="space-y-2.5 text-xs">
                          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> Composição Étnica (Censo IBGE 2022)
                          </div>
                          {/* Barra de Proporção Étnica */}
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
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Taxa de Urbanização:</span>
                            <strong className="font-mono text-emerald-300 font-bold">{profile.demografia.taxaUrbanizacao}%</strong>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'natalidade' && (
                        <div className="space-y-2 text-xs">
                          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Baby className="w-3.5 h-3.5" /> Natalidade & Fecundidade
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Taxa de Natalidade:</span>
                            <strong className="font-mono text-cyan-300 font-black">{profile.vitais.taxaNatalidadePorMil} ‰</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Taxa de Fecundidade:</span>
                            <strong className="font-mono text-amber-300 font-bold">{profile.vitais.taxaFecundidade} filhos/mulher</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Jovens (0 a 14 anos):</span>
                            <strong className="font-mono text-white font-bold">{profile.demografia.populacaoJovem0a14Percent}%</strong>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'mortalidade' && (
                        <div className="space-y-2 text-xs">
                          <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                            <HeartPulse className="w-3.5 h-3.5" /> Saúde & Longevidade
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Expectativa de Vida:</span>
                            <strong className="font-mono text-cyan-300 font-black">{profile.vitais.expectativaVidaAnos} anos</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Mortalidade Infantil:</span>
                            <strong className="font-mono text-rose-300 font-black">{profile.vitais.taxaMortalidadeInfantil} ‰ nascidos</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Idosos (60+ anos):</span>
                            <strong className="font-mono text-amber-300 font-bold">{profile.demografia.populacaoIdosa60MaisPercent}%</strong>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'analfabetismo' && (
                        <div className="space-y-2 text-xs">
                          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" /> Educação & Alfabetização
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Taxa de Alfabetização:</span>
                            <strong className="font-mono text-emerald-300 font-black">{profile.educacao.taxaAlfabetizacao}%</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Taxa de Analfabetismo:</span>
                            <strong className="font-mono text-rose-300 font-bold">{profile.educacao.taxaAnalfabetismo15Mais}%</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Ensino Superior Completo:</span>
                            <strong className="font-mono text-sky-300 font-bold">{profile.educacao.taxaEnsinoSuperiorCompleto}%</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Anos Médios de Estudo:</span>
                            <strong className="font-mono text-white font-bold">{profile.educacao.anosMediosEstudo} anos</strong>
                          </div>
                        </div>
                      )}

                      {activeMetric === 'partidos' && (
                        <div className="space-y-2 text-xs">
                          <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Vote className="w-3.5 h-3.5" /> Governo Estadual & Bancada
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Governador:</span>
                            <strong className="text-white truncate max-w-[140px] font-bold">{profile.politica.governador}</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Partido Político:</span>
                            <span
                              className="px-2 py-0.5 rounded font-mono font-black text-xs text-white shadow-sm"
                              style={{ backgroundColor: profile.politica.partidoCorHex || '#8b5cf6' }}
                            >
                              {profile.politica.siglaPartido}
                            </span>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Espectro Político:</span>
                            <strong className="text-cyan-300 font-bold">{profile.politica.espectroPolitico}</strong>
                          </div>
                          <div className="flex justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <span className="text-slate-300">Bancada Federal:</span>
                            <strong className="font-mono text-amber-300 font-black">{profile.politica.bancadaFederalDeputados} deputados</strong>
                          </div>
                        </div>
                      )}

                      {/* Rodapé do Tooltip com Ação de Clique */}
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-bold flex items-center justify-between">
                        <span>Clique no pin para isolar e inspecionar</span>
                        <span className="font-black text-sm">→</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
};
