import React from 'react';
import {
  Leaf,
  Bug,
  Sparkles,
  Trees,
  BookOpen,
  Eye,
  ShieldAlert,
  MapPin,
  Compass,
} from 'lucide-react';
import { BiodiversitySpecimen, BiodiversityKingdom, BrazilBiome } from '../../types';
import {
  ALL_BRAZIL_SPECIMENS,
  STATE_BIODIVERSITY_PROFILES,
  IUCN_STATUS_LABELS,
  BIOME_COLORS,
} from '../../data/brazilBiodiversityData';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
import { audioEngine } from '../../lib/audioSynth';
import { BiodiversityImage } from '../common/BiodiversityImage';

interface BiodiversityMapLayerProps {
  activeKingdomFilter?: BiodiversityKingdom | 'all';
  activeBiomeFilter?: BrazilBiome | 'all';
  threatenedOnly?: boolean;
  selectedStateId?: string | null;
  onSelectState: (stateId: string) => void;
  onSelectSpecimen?: (specimen: BiodiversitySpecimen) => void;
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
  geoProjectFn,
  is3D = true,
  hoveredStateId,
  centroids,
}) => {
  // Filter specimens for map pins & counts
  const filteredSpecimens = ALL_BRAZIL_SPECIMENS.filter((specimen) => {
    if (activeKingdomFilter !== 'all' && specimen.kingdom !== activeKingdomFilter) return false;
    if (activeBiomeFilter !== 'all' && !specimen.biomes.includes(activeBiomeFilter)) return false;
    if (threatenedOnly && !['CR', 'EN', 'VU'].includes(specimen.iucnStatus)) return false;
    return true;
  });

  const getKingdomIcon = (kingdom: BiodiversityKingdom, className = 'w-3 h-3') => {
    switch (kingdom) {
      case 'fauna':
        return <Bug className={`${className} text-amber-300`} />;
      case 'flora':
        return <Trees className={`${className} text-emerald-300`} />;
      case 'fungi_micro':
        return <Sparkles className={`${className} text-cyan-300`} />;
      default:
        return <Leaf className={`${className} text-emerald-300`} />;
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
    if (!hoveredStateSpecimens.length) return null;
    if (activeKingdomFilter !== 'all') {
      const match = hoveredStateSpecimens.find((s) => s.kingdom === activeKingdomFilter);
      if (match) return match;
    }
    if (threatenedOnly) {
      const match = hoveredStateSpecimens.find((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus));
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

  return (
    <div className="layer-biodiversidade-mapa absolute inset-0 pointer-events-none z-20">
      {/* 1. Hotspot Pins por Estado */}
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

        const primarySpecimen = stateSpecimens[0];

        return (
          <div
            key={`bio-pin-${stateId}`}
            id={`pin-biodiversidade-${stateId}`}
            className="pin-biodiversidade-estado absolute pointer-events-auto transition-transform duration-200"
            style={{
              left: `${projX}px`,
              top: `${projY}px`,
              transform: `translate(-50%, -50%) ${isHovered || isSelected ? 'scale(1.15)' : 'scale(1.0)'}`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playSfx('click');
              onSelectState(stateId);
              if (onSelectSpecimen) onSelectSpecimen(primarySpecimen);
            }}
          >
            {/* Bio-Aura pulsante */}
            <div
              className={`absolute -inset-2 rounded-full blur-sm transition-opacity duration-300 ${
                isSelected
                  ? 'bg-emerald-400/50 animate-pulse'
                  : isHovered
                  ? 'bg-emerald-500/40'
                  : 'bg-emerald-500/15 opacity-60'
              }`}
            />

            {/* Pin Badge de Biodiversidade */}
            <div
              className={`relative flex items-center gap-1 px-1.5 py-0.5 rounded-full border shadow-lg backdrop-blur-md cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold scale-105 shadow-[0_0_16px_rgba(16,185,129,0.8)]'
                  : isHovered
                  ? 'bg-slate-900 text-emerald-300 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-950/85 text-slate-200 border-emerald-500/40 hover:border-emerald-400'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900/90 flex items-center justify-center shrink-0 border border-emerald-500/50">
                {getKingdomIcon(primarySpecimen.kingdom, 'w-2.5 h-2.5')}
              </div>
              <span className="text-[10px] font-mono font-bold">{stateId}</span>
              <span className="text-[9px] px-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-mono">
                {stateSpecimens.length}
              </span>
            </div>
          </div>
        );
      })}

      {/* 2. Balão de Telemetria e Ficha Rápida de Biodiversidade no Hover (Estilo e Posicionamento do Modo Temperaturas) */}
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
            })`,
            zIndex: 9999,
            isolation: 'isolate',
          }}
        >
          <div className="card-balao-biodiversidade-conteudo bg-slate-950/95 backdrop-blur-xl border border-emerald-500/60 rounded-2xl p-3 sm:p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_24px_rgba(16,185,129,0.3)] w-[min(90vw,315px)] max-w-[calc(100vw-24px)] text-white space-y-2.5">
            {/* Header: Código UF + Nome do Estado + Capital + Biomas */}
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-2">
              <div className="min-w-0 flex-1 pr-2">
                <h4 className="font-black text-sm text-slate-100 flex items-center gap-1.5 truncate">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-black text-xs shrink-0">
                    {hoveredStateId}
                  </span>
                  <span className="truncate font-serif font-bold text-white tracking-wide">
                    {hoveredProfile.stateName}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Cap: <strong className="text-slate-200">{capitalData?.capital || 'Capital'}</strong> • Região {hoveredProfile.region}
                </p>
              </div>

              {/* Tag Biomas Predominantes */}
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                {hoveredProfile.predominantBiomes.slice(0, 2).map((b) => {
                  const biomeColor = BIOME_COLORS[b]?.primary || '#10b981';
                  return (
                    <span
                      key={b}
                      className="text-[8px] font-mono px-1.5 py-0.2 rounded-full border"
                      style={{
                        backgroundColor: `${biomeColor}20`,
                        borderColor: `${biomeColor}70`,
                        color: BIOME_COLORS[b]?.badgeText || '#6ee7b7',
                      }}
                    >
                      {b}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Grid de Métricas de Biodiversidade do Estado */}
            <div className="grid grid-cols-4 gap-1 text-center font-mono">
              <div className="p-1 rounded-lg bg-amber-950/40 border border-amber-500/30 flex flex-col items-center">
                <Bug className="w-3 h-3 text-amber-400 mb-0.5" />
                <span className="text-[9px] text-amber-300 font-bold">{hoveredFaunaCount}</span>
                <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter">Fauna</span>
              </div>
              <div className="p-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex flex-col items-center">
                <Trees className="w-3 h-3 text-emerald-400 mb-0.5" />
                <span className="text-[9px] text-emerald-300 font-bold">{hoveredFloraCount}</span>
                <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter">Flora</span>
              </div>
              <div className="p-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex flex-col items-center">
                <Sparkles className="w-3 h-3 text-cyan-400 mb-0.5" />
                <span className="text-[9px] text-cyan-300 font-bold">{hoveredFungiCount}</span>
                <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter">Fungos</span>
              </div>
              <div className="p-1 rounded-lg bg-rose-950/40 border border-rose-500/30 flex flex-col items-center">
                <BookOpen className="w-3 h-3 text-rose-400 mb-0.5" />
                <span className="text-[9px] text-rose-300 font-bold">{hoveredThreatenedCount}</span>
                <span className="text-[7.5px] text-slate-400 uppercase tracking-tighter">Livro Verm.</span>
              </div>
            </div>

            {/* Ficha da Espécie em Destaque no Estado */}
            {spotlightSpecimen && (
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-2 flex items-center gap-2">
                <BiodiversityImage
                  src={spotlightSpecimen.thumbnailUrl || spotlightSpecimen.imageUrl}
                  alt={spotlightSpecimen.namePt}
                  kingdom={spotlightSpecimen.kingdom}
                  fallbackSrc={spotlightSpecimen.imageUrl}
                  containerClassName="w-11 h-11 rounded-lg border border-emerald-500/50 shrink-0 shadow-md"
                  className="w-full h-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-serif font-black text-xs text-emerald-200 truncate">
                      {spotlightSpecimen.namePt}
                    </span>
                    <span
                      className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold border shrink-0 ${
                        IUCN_STATUS_LABELS[spotlightSpecimen.iucnStatus].colorBg
                      } ${IUCN_STATUS_LABELS[spotlightSpecimen.iucnStatus].colorText} ${
                        IUCN_STATUS_LABELS[spotlightSpecimen.iucnStatus].colorBorder
                      }`}
                    >
                      {spotlightSpecimen.iucnStatus}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-emerald-400/90 font-mono italic truncate">
                    {spotlightSpecimen.scientificName}
                  </p>
                  <p className="text-[9px] text-slate-300 line-clamp-1 mt-0.5">
                    {spotlightSpecimen.ecologicalRolePt}
                  </p>
                </div>
              </div>
            )}

            {/* Destaque / Curiosidade Ecológica do Estado */}
            <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-slate-300 leading-snug flex items-start gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                <strong className="text-emerald-300">Biodiversidade:</strong> {hoveredProfile.biodiversitySummaryPt}
              </span>
            </div>

            {/* Footer com Ação de Clique */}
            <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GBIF • SisCITES • ICMBio
              </span>
              <span className="text-slate-400 font-mono">Clique para detalhes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
