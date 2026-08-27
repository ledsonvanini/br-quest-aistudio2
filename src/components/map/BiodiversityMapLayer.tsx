import React from 'react';
import {
  Leaf,
  Bird,
  Sparkles,
  Trees,
  BookOpen,
  Eye,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Compass,
  Flame,
} from 'lucide-react';
import { BiodiversitySpecimen, BiodiversityKingdom, BrazilBiome } from '../../types';
import {
  ALL_BRAZIL_SPECIMENS,
  STATE_BIODIVERSITY_PROFILES,
  IUCN_STATUS_LABELS,
  BIOME_COLORS,
  NATIONAL_KINGDOM_REPRESENTATIVES,
} from '../../data/brazilBiodiversityData';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { audioEngine } from '../../lib/audioSynth';
import { BiodiversityImage } from '../common/BiodiversityImage';

interface BiodiversityMapLayerProps {
  activeKingdomFilter?: BiodiversityKingdom | 'all';
  activeBiomeFilter?: BrazilBiome | 'all';
  threatenedOnly?: boolean;
  selectedStateId?: string | null;
  onSelectState: (stateId: string) => void;
  onSelectSpecimen?: (specimen: BiodiversitySpecimen) => void;
  onHoverState?: (stateId: string | null) => void;
  geoProjectFn: (coords: [number, number]) => [number, number] | null;
  is3D?: boolean;
  hoveredStateId?: string | null;
  centroids?: Record<string, [number, number]>;
}

export const BiodiversityMapLayer: React.FC<BiodiversityMapLayerProps> = ({
  activeKingdomFilter = 'all',
  activeBiomeFilter = 'all',
  threatenedOnly = false,
  selectedStateId,
  onSelectState,
  onSelectSpecimen,
  onHoverState,
  geoProjectFn,
  is3D = true,
  hoveredStateId,
  centroids,
}) => {
  const [hoveredSpecimenId, setHoveredSpecimenId] = React.useState<string | null>(null);

  // Filter specimens for map pins & counts
  const filteredSpecimens = ALL_BRAZIL_SPECIMENS.filter((specimen) => {
    if (activeKingdomFilter !== 'all' && specimen.kingdom !== activeKingdomFilter) return false;
    if (activeBiomeFilter !== 'all' && !specimen.biomes.includes(activeBiomeFilter)) return false;
    if (threatenedOnly && !['CR', 'EN', 'VU'].includes(specimen.iucnStatus)) return false;
    return true;
  });

  const getKingdomIcon = (kingdom: BiodiversityKingdom, className = 'w-3.5 h-3.5') => {
    switch (kingdom) {
      case 'fauna':
        return <Bird className={`${className} text-amber-300`} />;
      case 'flora':
        return <Trees className={`${className} text-emerald-300`} />;
      case 'fungi_micro':
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${className} text-cyan-300`}
          >
            <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
            <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
            <circle cx="8" cy="8.5" r="1" fill="currentColor" />
            <circle cx="15.5" cy="9" r="0.8" fill="currentColor" />
            <circle cx="12" cy="6.5" r="0.8" fill="currentColor" />
          </svg>
        );
      default:
        return <Leaf className={`${className} text-emerald-300`} />;
    }
  };

  // Helper to get IUCN ring & status styling (discreto e elegante)
  const getIucnRingStyle = (status: string) => {
    switch (status) {
      case 'CR':
        return {
          ring: 'border-[2px] border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)] bg-slate-950',
          badgeBg: 'bg-rose-600 text-white border-rose-400',
        };
      case 'EN':
        return {
          ring: 'border-[2px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] bg-slate-950',
          badgeBg: 'bg-amber-600 text-white border-amber-300',
        };
      case 'VU':
        return {
          ring: 'border-[2px] border-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.35)] bg-slate-950',
          badgeBg: 'bg-yellow-600 text-white border-yellow-200',
        };
      default:
        return {
          ring: 'border-[2px] border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.35)] bg-slate-950',
          badgeBg: 'bg-emerald-600 text-white border-emerald-300',
        };
    }
  };

  // Hovered state calculations
  const hoveredProfile = hoveredStateId ? STATE_BIODIVERSITY_PROFILES[hoveredStateId] : null;
  const capitalData = hoveredStateId ? STATE_CAPITAL_GEO_DATA[hoveredStateId] : null;

  const hoveredStateSpecimens = hoveredStateId
    ? ALL_BRAZIL_SPECIMENS.filter((s) => s.states.includes(hoveredStateId))
    : [];

  const hoveredFaunaCount = hoveredStateSpecimens.filter((s) => s.kingdom === 'fauna').length;
  const hoveredFloraCount = hoveredStateSpecimens.filter((s) => s.kingdom === 'flora').length;
  const hoveredFungiCount = hoveredStateSpecimens.filter((s) => s.kingdom === 'fungi_micro').length;
  const hoveredThreatenedCount = hoveredStateSpecimens.filter((s) =>
    ['CR', 'EN', 'VU'].includes(s.iucnStatus)
  ).length;

  // Selected spotlight specimen for the hover tooltip based on active filters
  const spotlightSpecimen: BiodiversitySpecimen | null = (() => {
    if (hoveredSpecimenId) {
      const found = ALL_BRAZIL_SPECIMENS.find((s) => s.id === hoveredSpecimenId);
      if (found) return found;
    }
    if (!hoveredStateSpecimens.length) return null;
    if (threatenedOnly) {
      const match = hoveredStateSpecimens.find((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus));
      if (match) return match;
    }
    if (activeKingdomFilter !== 'all') {
      const match = hoveredStateSpecimens.find((s) => s.kingdom === activeKingdomFilter);
      if (match) return match;
    }
    return hoveredStateSpecimens[0];
  })();

  const hoverPos = React.useMemo(() => {
    if (!hoveredStateId) return null;
    if (centroids && centroids[hoveredStateId]) {
      return { x: centroids[hoveredStateId][0], y: centroids[hoveredStateId][1] };
    }
    if (capitalData) {
      const pt = geoProjectFn([capitalData.lng, capitalData.lat]);
      if (pt) return { x: pt[0], y: pt[1] };
    }
    return null;
  }, [hoveredStateId, centroids, capitalData, geoProjectFn]);

  // Quando qualquer estado estiver selecionado/isolado, oculta todos os pins e balões de dicas do mapa,
  // pois o aplicativo lateral já exibe todo o conteúdo da biodiversidade em detalhes.
  if (selectedStateId) return null;

  return (
    <div
      className="camada-pins-biodiversidade absolute inset-0 pointer-events-none z-20"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. PINOS E MÁSCARAS CIRCULARES DE BIODIVERSIDADE POR ESTADO */}
      {Object.entries(STATE_BIODIVERSITY_PROFILES).map(([stateId, profile]) => {
        const capitalInfo = STATE_CAPITAL_GEO_DATA[stateId];
        if (!capitalInfo) return null;

        const projected = centroids?.[stateId] || geoProjectFn([capitalInfo.lng, capitalInfo.lat]);
        if (!projected) return null;

        const [projX, projY] = projected;
        const isHovered = hoveredStateId === stateId;
        const isSelected = selectedStateId === stateId;
        const stateSpecimens = filteredSpecimens.filter((s) => s.states.includes(stateId));
        if (stateSpecimens.length === 0) return null;

        // Priorização inteligente de espécimes por estado:
        // 1. Prioriza espécies nativas/endêmicas do próprio estado (ou com menção na flagship fauna/flora do perfil)
        // 2. Prioriza maior gravidade de extinção no modo Livro Vermelho
        // 3. Garante que estados vizinhos não mostrem imagens idênticas repetidas
        const stateProfile = STATE_BIODIVERSITY_PROFILES[stateId];
        const sortedStateSpecimens = [...stateSpecimens].sort((a, b) => {
          if (threatenedOnly) {
            const rank: Record<string, number> = { CR: 5, EN: 4, VU: 3, NT: 2, LC: 1, DD: 0 };
            const rankDiff = (rank[b.iucnStatus] || 0) - (rank[a.iucnStatus] || 0);
            if (rankDiff !== 0) return rankDiff;
          }

          // Verificar se o espécime é a espécie símbolo/flagship declarada do estado
          const aFlagshipScore =
            stateProfile &&
            (stateProfile.flagshipFauna.toLowerCase().includes(a.namePt.toLowerCase()) ||
              stateProfile.flagshipFlora.toLowerCase().includes(a.namePt.toLowerCase()) ||
              stateProfile.flagshipFauna.toLowerCase().includes(a.scientificName.toLowerCase()) ||
              stateProfile.flagshipFlora.toLowerCase().includes(a.scientificName.toLowerCase()))
              ? 100
              : 0;
          const bFlagshipScore =
            stateProfile &&
            (stateProfile.flagshipFauna.toLowerCase().includes(b.namePt.toLowerCase()) ||
              stateProfile.flagshipFlora.toLowerCase().includes(b.namePt.toLowerCase()) ||
              stateProfile.flagshipFauna.toLowerCase().includes(b.scientificName.toLowerCase()) ||
              stateProfile.flagshipFlora.toLowerCase().includes(b.scientificName.toLowerCase()))
              ? 100
              : 0;

          if (aFlagshipScore !== bFlagshipScore) return bFlagshipScore - aFlagshipScore;

          // Priorizar espécies endêmicas do estado ou com menor abrangência geográfica (mais específicas)
          const aSpecificity = (a.isEndemicState ? 50 : 0) + (30 - a.states.length);
          const bSpecificity = (b.isEndemicState ? 50 : 0) + (30 - b.states.length);

          return bSpecificity - aSpecificity;
        });

        // Determinar se estamos em modo multi-imagem (Todos os Reinos) ou modo único/específico (Fauna, Flora, Fungos)
        const isAllKingdomsMode = activeKingdomFilter === 'all' && !threatenedOnly;
        
        // No modo "all", tentar pegar 1 de fauna e 1 de flora se possível para diversidade máxima
        let visibleSpecimens: typeof sortedStateSpecimens = [];
        if (isAllKingdomsMode) {
          const firstFauna = sortedStateSpecimens.find((s) => s.kingdom === 'fauna');
          const firstFlora = sortedStateSpecimens.find((s) => s.kingdom === 'flora');
          if (firstFauna && firstFlora) {
            visibleSpecimens = [firstFauna, firstFlora];
          } else {
            visibleSpecimens = sortedStateSpecimens.slice(0, 2);
          }
        } else {
          visibleSpecimens = [sortedStateSpecimens[0]];
        }

        const remainingCount = isAllKingdomsMode ? sortedStateSpecimens.length - visibleSpecimens.length : 0;
        const primarySpecimen = visibleSpecimens[0];
        const primaryStyle = getIucnRingStyle(primarySpecimen.iucnStatus);
        const tokenDiameter = isAllKingdomsMode ? 52 : 62;

        const pinBorderColor = threatenedOnly
          ? 'border-rose-400'
          : activeKingdomFilter === 'fauna'
          ? 'border-amber-400'
          : activeKingdomFilter === 'flora'
          ? 'border-emerald-400'
          : activeKingdomFilter === 'fungi_micro'
          ? 'border-cyan-400'
          : 'border-teal-400';

        const pinNeedleColor = threatenedOnly
          ? '#fb7185'
          : activeKingdomFilter === 'fauna'
          ? '#fbbf24'
          : activeKingdomFilter === 'flora'
          ? '#34d399'
          : activeKingdomFilter === 'fungi_micro'
          ? '#22d3ee'
          : '#2dd4bf';

        const hasThreatened = sortedStateSpecimens.some((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus));

        return (
          <div
            key={`bio-pin-${stateId}`}
            id={`pin-biodiversidade-${stateId}`}
            className="container-pin-mapa-biodiversidade absolute pointer-events-auto select-none"
            style={{
              position: 'absolute',
              left: `${projX}px`,
              top: `${projY}px`,
              width: '0px',
              height: '0px',
              transformStyle: 'preserve-3d',
              zIndex: isHovered || isSelected ? 80 : 30,
            }}
          >
            {/* CORPO DO PIN COM SOMBRA NATURAL E TRANSIÇÃO SUAVE DE HOVER */}
            <div
              className={`absolute flex flex-col items-center cursor-pointer will-change-transform ${
                isHovered || isSelected
                  ? 'scale-125 -translate-y-3 z-40'
                  : 'scale-100 translate-y-0 hover:scale-120 hover:-translate-y-2'
              }`}
              style={{
                transform: 'translate(-50%, -100%)',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45))',
                transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={() => {
                onHoverState?.(stateId);
              }}
              onMouseLeave={() => {
                onHoverState?.(null);
                setHoveredSpecimenId(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                audioEngine.playSfx('click');
                onSelectState(stateId);
                if (onSelectSpecimen) onSelectSpecimen(primarySpecimen);
              }}
            >
              {/* MEDALHÃO DO PIN (FOTO CIRCULAR COM BORDA DE ESMAECIMENTO EM LOOP & AJUSTE DE FIT CENTRALIZADO) */}
              <div className="medallion-pin-especie flex items-center -space-x-3.5 p-0.5 relative z-10">
                {visibleSpecimens.map((specimen, idx) => {
                  const styleInfo = getIucnRingStyle(specimen.iucnStatus);
                  const isSpecificHovered = hoveredSpecimenId === specimen.id;
                  const isSpecimenThreatened = ['CR', 'EN', 'VU'].includes(specimen.iucnStatus);

                  return (
                    <div
                      key={specimen.id}
                      className={`relative rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                        threatenedOnly || isSpecimenThreatened
                          ? 'border-[2px] border-rose-500/90 shadow-[0_0_8px_rgba(244,63,94,0.4)] anim-border-fade-threatened'
                          : activeKingdomFilter === 'fauna'
                          ? 'border-[2px] border-amber-400 ring-1 ring-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.5)] anim-border-fade-standard'
                          : activeKingdomFilter === 'flora'
                          ? 'border-[2px] border-emerald-400 ring-1 ring-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.5)] anim-border-fade-standard'
                          : activeKingdomFilter === 'fungi_micro'
                          ? 'border-[2px] border-cyan-400 ring-1 ring-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.5)] anim-border-fade-standard'
                          : 'border-[2px] border-teal-400 ring-1 ring-teal-500/40 shadow-[0_0_8px_rgba(20,184,166,0.5)] anim-border-fade-standard'
                      } ${isSpecificHovered ? 'scale-115 z-30 ring-2 ring-white' : idx === 0 ? 'z-20' : 'z-10'}`}
                      style={{
                        width: `${tokenDiameter}px`,
                        height: `${tokenDiameter}px`,
                        minWidth: `${tokenDiameter}px`,
                        minHeight: `${tokenDiameter}px`,
                        maxWidth: `${tokenDiameter}px`,
                        maxHeight: `${tokenDiameter}px`,
                        borderRadius: '9999px',
                        backgroundColor: '#020617',
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setHoveredSpecimenId(specimen.id);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setHoveredSpecimenId(null);
                      }}
                      title={`${specimen.namePt} (${specimen.scientificName}) - ${IUCN_STATUS_LABELS[specimen.iucnStatus]?.labelPt || specimen.iucnStatus}`}
                    >
                      <BiodiversityImage
                        src={specimen.thumbnailUrl || specimen.imageUrl}
                        alt={specimen.namePt}
                        scientificName={specimen.scientificName}
                        kingdom={specimen.kingdom}
                        fallbackSrc={specimen.imageUrl}
                        size="thumb"
                        isCircularMask={true}
                        containerClassName="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                        className="w-full h-full object-cover object-center aspect-square flex-shrink-0 block"
                        style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                      />

                      {/* Tag de Status IUCN / Reino no canto inferior direito do círculo */}
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 px-1 min-w-[20px] h-4.5 rounded-full flex items-center justify-center text-[9px] font-mono font-black border shadow-lg pointer-events-none z-30 ${
                          threatenedOnly || isSpecimenThreatened
                            ? styleInfo.badgeBg
                            : 'bg-slate-950 text-white border-emerald-400/90'
                        }`}
                      >
                        {threatenedOnly || isSpecimenThreatened
                          ? specimen.iucnStatus
                          : specimen.kingdom === 'fauna'
                          ? '🐾'
                          : specimen.kingdom === 'flora'
                          ? '🌿'
                          : '🍄'}
                      </div>
                    </div>
                  );
                })}

                {/* Badge de +N espécimes adicionais caso existam no modo Todos os Reinos */}
                {remainingCount > 0 && (
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-[11px] border-2 shadow-lg z-0 ${
                      threatenedOnly
                        ? 'bg-rose-950 text-rose-200 border-rose-400'
                        : 'bg-emerald-950 text-emerald-200 border-emerald-400'
                    }`}
                    title={`Mais ${remainingCount} espécimes em ${stateId}`}
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>

              {/* TAG DE IDENTIFICAÇÃO COMPACTA DO ESTADO (UF + Qtd) */}
              <div
                className={`badge-uf-pin -mt-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-md backdrop-blur-md text-xs font-mono font-black whitespace-nowrap transition-all z-20 ${
                  threatenedOnly
                    ? 'bg-slate-950/95 text-rose-200 border-rose-500/80'
                    : isSelected
                    ? 'bg-emerald-500 text-slate-950 border-white ring-2 ring-emerald-300'
                    : 'bg-slate-950/95 text-slate-200 border-emerald-500/60'
                }`}
              >
                <span className="font-bold">{stateId}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
                    threatenedOnly ? 'bg-rose-600 text-white' : 'bg-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {stateSpecimens.length}
                </span>
              </div>

              {/* PONTEIRO DO PIN EM ESTILO AGULHA / V-STEM (Apontando diretamente para o ponto do mapa) */}
              <div className="ponteiro-pin-agulha relative -mt-0.5 flex flex-col items-center z-10">
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="pointer-events-none"
                >
                  <path
                    d="M1 1L7 9L13 1H1Z"
                    fill="#020617"
                    stroke={pinNeedleColor}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}

      {/* 2. Balão de Telemetria e Ficha Rápida de Biodiversidade no Hover (+50% Scale, 100% Solid Deep Slate, Anti-Blur) */}
      {hoveredStateId && hoveredProfile && hoverPos && !selectedStateId && (
        <div
          id="balao-biodiversidade-estado-hover"
          className="balao-biodiversidade-estado-hover absolute pointer-events-none transition-all duration-150 select-none"
          style={{
            left: `${
              hoverPos.x > 1680
                ? hoverPos.x - 30
                : hoverPos.x < 720
                ? hoverPos.x + 30
                : hoverPos.x + 30
            }px`,
            top: `${
              hoverPos.y < 400
                ? hoverPos.y + 40
                : hoverPos.y > 1020
                ? hoverPos.y - 40
                : hoverPos.y
            }px`,
            transform: `translate(${hoverPos.x > 1680 ? '-100%' : '0%'}, ${
              hoverPos.y < 400 ? '0%' : hoverPos.y > 1020 ? '-100%' : '-50%'
            }) translateZ(0)`,
            zIndex: 99999,
            isolation: 'isolate',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="card-balao-biodiversidade-conteudo bg-slate-950 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.98),0_0_25px_rgba(16,185,129,0.35)] w-[min(94vw,440px)] max-w-[calc(100vw-24px)] text-white space-y-3">
            {/* Header: Código UF + Nome do Estado + Capital + Biomas */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <h4 className="font-black text-base sm:text-lg text-slate-100 flex items-center gap-2 truncate">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-mono font-black text-xs sm:text-sm shrink-0">
                    {hoveredStateId}
                  </span>
                  <span className="truncate font-serif font-bold text-white tracking-wide">
                    {hoveredProfile.stateName}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                  Capital: <strong className="text-slate-200">{capitalData?.capital || 'Capital'}</strong> • Região {hoveredProfile.region}
                </p>
              </div>

              {/* Tag Biomas Predominantes */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {hoveredProfile.predominantBiomes.slice(0, 2).map((b) => {
                  const biomeColor = BIOME_COLORS[b]?.primary || '#10b981';
                  return (
                    <span
                      key={b}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm"
                      style={{
                        backgroundColor: `${biomeColor}25`,
                        borderColor: `${biomeColor}80`,
                        color: BIOME_COLORS[b]?.badgeText || '#6ee7b7',
                      }}
                    >
                      {b}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Grid de Métricas de Biodiversidade do Estado (+Legível e Nítido) */}
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
              <div className="p-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 flex flex-col items-center">
                <Bird className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-xs sm:text-sm text-amber-300 font-black">{hoveredFaunaCount}</span>
                <span className="text-[9px] text-slate-300 uppercase tracking-tight font-semibold">Fauna</span>
              </div>
              <div className="p-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col items-center">
                <Trees className="w-4 h-4 text-emerald-400 mb-0.5" />
                <span className="text-xs sm:text-sm text-emerald-300 font-black">{hoveredFloraCount}</span>
                <span className="text-[9px] text-slate-300 uppercase tracking-tight font-semibold">Flora</span>
              </div>
              <div className="p-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex flex-col items-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-cyan-400 mb-0.5"
                >
                  <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
                  <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
                  <circle cx="8" cy="8.5" r="1" fill="currentColor" />
                  <circle cx="15.5" cy="9" r="0.8" fill="currentColor" />
                  <circle cx="12" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
                <span className="text-xs sm:text-sm text-cyan-300 font-black">{hoveredFungiCount}</span>
                <span className="text-[9px] text-slate-300 uppercase tracking-tight font-semibold">Fungos</span>
              </div>
              <div className="p-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 flex flex-col items-center">
                <BookOpen className="w-4 h-4 text-rose-400 mb-0.5" />
                <span className="text-xs sm:text-sm text-rose-300 font-black">{hoveredThreatenedCount}</span>
                <span className="text-[9px] text-rose-200 uppercase tracking-tight font-semibold">Livro Verm.</span>
              </div>
            </div>

            {/* Ficha da Espécie em Destaque no Estado */}
            {spotlightSpecimen && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-3 shadow-inner">
                <BiodiversityImage
                  src={spotlightSpecimen.thumbnailUrl || spotlightSpecimen.imageUrl}
                  alt={spotlightSpecimen.namePt}
                  scientificName={spotlightSpecimen.scientificName}
                  kingdom={spotlightSpecimen.kingdom}
                  fallbackSrc={spotlightSpecimen.imageUrl}
                  containerClassName="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-emerald-400/80 shrink-0 shadow-lg"
                  className="w-full h-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-black text-sm text-emerald-200 truncate">
                      {spotlightSpecimen.namePt}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border shrink-0 ${
                        IUCN_STATUS_LABELS[spotlightSpecimen.iucnStatus].colorBg
                      } ${IUCN_STATUS_LABELS[spotlightSpecimen.iucnStatus].colorText} ${
                        IUCN_STATUS_LABELS[spotlightSpecimen.iucnStatus].colorBorder
                      }`}
                    >
                      {spotlightSpecimen.iucnStatus}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono italic truncate">
                    {spotlightSpecimen.scientificName}
                  </p>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 font-sans">
                    {spotlightSpecimen.ecologicalRolePt}
                  </p>
                </div>
              </div>
            )}

            {/* Destaque / Curiosidade Ecológica do Estado */}
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed flex items-start gap-2 font-sans">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                <strong className="text-emerald-300">Biodiversidade:</strong> {hoveredProfile.biodiversitySummaryPt}
              </span>
            </div>

            {/* Footer com Ação de Clique */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                GBIF • SisCITES • ICMBio
              </span>
              <span className="text-amber-300 font-mono font-semibold">Clique para abrir detalhes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
