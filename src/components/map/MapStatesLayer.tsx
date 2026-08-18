import React, { useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { SOUTH_AMERICA_LANDMASS_GEO } from '../../data/southAmericaGeo';
import {
  MAP_CANVAS_WIDTH,
  MAP_CANVAS_HEIGHT,
  cleanStateId,
} from '../../lib/mapProjections';
import {
  getStateColor,
  MapVisualStyle,
  ChoroplethSubTheme,
} from '../../lib/mapColorScales';
import { findNeighborCountry, NeighborCountryData } from '../../data/southAmericaNeighborsData';
import { ClippedMapTilesLayer, TerrainTileProvider } from './ClippedMapTilesLayer';
import { AntiqueCartographyDecor } from './AntiqueCartographyDecor';
import { StateWeatherData, getEcmwfTempColor } from '../../services/climateService';
import { ClimateMode } from './ClimatePhenomenaLayer';

interface MapStatesLayerProps {
  geoData: any;
  projection: any;
  visualStyle: MapVisualStyle;
  choroplethSubTheme: ChoroplethSubTheme;
  terrainProvider?: TerrainTileProvider;
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  showNeighbors?: boolean;
  hoveredCountryId?: string | null;
  centroids?: Record<string, [number, number]>;
  isClimateActive?: boolean;
  climateMode?: ClimateMode;
  stateWeather?: Record<string, StateWeatherData>;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
  onStateClick: (stateId: string, e: React.MouseEvent) => void;
  onCountryEnter?: (countryId: string) => void;
  onCountryLeave?: (countryId: string) => void;
  onCountryClick?: (country: NeighborCountryData) => void;
}

export const MapStatesLayer: React.FC<MapStatesLayerProps> = ({
  geoData,
  projection,
  visualStyle,
  choroplethSubTheme,
  terrainProvider = 'shaded_relief',
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  showNeighbors = false,
  hoveredCountryId = null,
  isClimateActive = false,
  climateMode = 'temperaturas_frentes',
  stateWeather,
  onStateEnter,
  onStateLeave,
  onStateClick,
  onCountryEnter,
  onCountryLeave,
  onCountryClick,
}) => {
  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return geoPath().projection(projection);
  }, [projection]);

  // Pre-filter and pre-compute all South America paths ONCE
  const neighborFeaturesList = useMemo(() => {
    if (!pathGenerator) return [];

    const list: { pathD: string; countryName: string; matchedCountry: NeighborCountryData | undefined; key: string }[] = [];

    SOUTH_AMERICA_LANDMASS_GEO.features.forEach((feat: any, idx: number) => {
      let cleanFeat = feat;
      if (feat.geometry?.type === 'MultiPolygon' && Array.isArray(feat.geometry.coordinates)) {
        const cleanCoordinates = feat.geometry.coordinates.filter((poly: any) => {
          const isFarPacific = poly[0]?.some((pt: number[]) => pt[0] < -85);
          return !isFarPacific;
        });
        cleanFeat = {
          ...feat,
          geometry: { ...feat.geometry, coordinates: cleanCoordinates },
        };
      }

      const d = pathGenerator(cleanFeat as any);
      if (d) {
        const countryName = feat.properties?.name || feat.properties?.NAME || `country-${idx}`;
        const matchedCountry = findNeighborCountry(countryName);
        list.push({
          pathD: d,
          countryName,
          matchedCountry,
          key: `sa-neighbor-${idx}`,
        });
      }
    });

    return list;
  }, [pathGenerator]);

  // Pre-calculate all Brazilian state SVG path strings ONCE
  const { statePathMap, brazilBoundaryCombinedPath } = useMemo(() => {
    if (!pathGenerator || !geoData?.features) {
      return { statePathMap: {}, brazilBoundaryCombinedPath: '' };
    }
    const map: Record<string, string> = {};
    const dList: string[] = [];

    geoData.features.forEach((feat: any) => {
      const rawId =
        feat.properties?.id ||
        (feat as any).id ||
        feat.properties?.sigla ||
        feat.properties?.UF ||
        '';
      const stateId = cleanStateId(rawId);
      if (stateId) {
        const d = pathGenerator(feat);
        if (d) {
          map[stateId] = d;
          dList.push(d);
        }
      }
    });

    return {
      statePathMap: map,
      brazilBoundaryCombinedPath: dList.join(' '),
    };
  }, [pathGenerator, geoData]);

  if (!pathGenerator || !geoData) return null;

  return (
    <svg
      className="camada-estados-svg absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT, overflow: 'visible' }}
      viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
    >
      <defs>
        <clipPath id="brazil-boundary-clip">
          <path d={brazilBoundaryCombinedPath} />
        </clipPath>

        {/* Solid Continental Landmass Palette for South America Neighbors */}
        <linearGradient id="saContinentEarthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#223249" />
          <stop offset="40%" stopColor="#1b283d" />
          <stop offset="75%" stopColor="#152030" />
          <stop offset="100%" stopColor="#101926" />
        </linearGradient>

        <linearGradient id="neighborHighlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b5275" />
          <stop offset="100%" stopColor="#23354d" />
        </linearGradient>
      </defs>

      {/* =========================================================================
          1. MASSA CONTINENTAL DA AMÉRICA DO SUL & PAÍSES VIZINHOS (SEM CONTORNOS EXTRAS)
             Contraste garantido puramente por variação harmônica de cores de terra.
         ========================================================================= */}
      <g className={`camada-america-do-sul south-america-context ${showNeighbors ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {neighborFeaturesList.map(({ pathD, countryName, matchedCountry, key }) => {
          const isCurrentHovered =
            matchedCountry && hoveredCountryId && hoveredCountryId === matchedCountry.id;
          const isParchment = terrainProvider === 'voyager_parchment';

          return (
            <g
              key={key}
              className={`pais-vizinho pais-${countryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <path
                d={pathD}
                fill={
                  isCurrentHovered
                    ? 'url(#neighborHighlightGrad)'
                    : isParchment
                    ? '#eedbb8'
                    : 'url(#saContinentEarthGrad)'
                }
                stroke={
                  isCurrentHovered
                    ? '#fbbf24'
                    : isParchment
                    ? '#92400e'
                    : showNeighbors
                    ? '#475569'
                    : '#1e293b'
                }
                strokeWidth={isCurrentHovered ? '2.0' : '1.0'}
                strokeOpacity={isCurrentHovered ? 1.0 : isParchment ? 0.85 : showNeighbors ? 0.9 : 0.6}
                strokeLinejoin="round"
                strokeLinecap="round"
                className={`transition-colors duration-150 ${showNeighbors && matchedCountry ? 'cursor-pointer pointer-events-auto' : ''}`}
                onMouseEnter={() => {
                  if (matchedCountry && showNeighbors) {
                    onCountryEnter?.(matchedCountry.id);
                  }
                }}
                onMouseLeave={() => {
                  if (matchedCountry && showNeighbors) {
                    onCountryLeave?.(matchedCountry.id);
                  }
                }}
                onClick={() => {
                  if (matchedCountry && showNeighbors) {
                    onCountryClick?.(matchedCountry);
                  }
                }}
              />
            </g>
          );
        })}
      </g>

      {/* =========================================================================
          2. D3 CLIPPED MAP TILES (Natural Earth, Shaded Relief, Satellite)
         ========================================================================= */}
      {visualStyle === 'tiles' && (
        <ClippedMapTilesLayer
          geoData={geoData}
          projection={projection}
          provider={terrainProvider}
          opacity={isClimateActive ? 0.50 : 1.0}
        />
      )}

      {/* Antique Cartography Embellishments */}
      {!isClimateActive && (
        <AntiqueCartographyDecor isParchmentMode={terrainProvider === 'voyager_parchment'} />
      )}

      {/* =========================================================================
          3. CAMADA VETORIAL DOS 27 ESTADOS (Contraste Puro por Cores / Ultra Leve)
         ========================================================================= */}
      <g className="camada-vetorial-estados brazil-states-layer pointer-events-auto">
        {geoData.features.map((feat: any) => {
          const rawId =
            feat.properties?.id ||
            (feat as any).id ||
            feat.properties?.sigla ||
            feat.properties?.UF ||
            '';
          const stateId = cleanStateId(rawId);
          if (!stateId) return null;

          const pathD = statePathMap[stateId];
          if (!pathD) return null;

          const isCompleted = completedStateIds.has(stateId);
          const isHovered = hoveredStateId === stateId;
          const isSelected = selectedStateId === stateId;
          const weather = stateWeather?.[stateId];

          let stateFill = 'transparent';
          let stateFillOpacity = 0.0;
          let strokeColor = visualStyle === 'tiles' ? '#f59e0b' : '#38bdf8';
          let strokeWidth = 1.0;

          if (isClimateActive) {
            if (climateMode === 'temperaturas_frentes') {
              const temp = weather?.temperature ?? 24;
              stateFill = getEcmwfTempColor(temp).hex;
              stateFillOpacity = isSelected ? 0.95 : isHovered ? 0.88 : 0.72;
              strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : '#ffffff';
              strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 0.8;
            } else if (climateMode === 'precipitacao_zcas') {
              const rain = weather?.precipitation ?? 0;
              stateFill =
                rain > 60
                  ? '#0284c7'
                  : rain > 30
                  ? '#0ea5e9'
                  : rain > 10
                  ? '#38bdf8'
                  : rain > 2
                  ? '#059669'
                  : '#d97706';
              stateFillOpacity = isSelected ? 0.92 : isHovered ? 0.85 : 0.68;
              strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : rain > 30 ? '#67e8f9' : '#fde047';
              strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 0.8;
            } else if (climateMode === 'ventos_aliseos') {
              const isFlyingRiverCorridor = ['AM', 'RO', 'MT', 'MS', 'SP', 'PR', 'SC'].includes(stateId);
              stateFill = isFlyingRiverCorridor ? '#10b981' : '#0369a1';
              stateFillOpacity = isSelected ? 0.88 : isHovered ? 0.80 : 0.62;
              strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : isFlyingRiverCorridor ? '#6ee7b7' : '#38bdf8';
              strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 0.8;
            } else if (climateMode === 'el_nino_la_nina') {
              const isDroughtZone = ['AM', 'PA', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'].includes(stateId);
              const isFloodZone = ['RS', 'SC', 'PR'].includes(stateId);
              stateFill = isDroughtZone ? '#ef4444' : isFloodZone ? '#06b6d4' : '#1e293b';
              stateFillOpacity = isSelected ? 0.92 : isHovered ? 0.85 : 0.65;
              strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : isDroughtZone ? '#fca5a5' : isFloodZone ? '#67e8f9' : '#64748b';
              strokeWidth = isSelected ? 2.5 : isHovered ? 2.0 : 0.8;
            }
          } else {
            const colors = getStateColor(
              stateId,
              visualStyle,
              choroplethSubTheme,
              isCompleted,
              isHovered,
              isSelected
            );
            stateFill = visualStyle === 'tiles' ? (isHovered || isSelected ? '#fbbf24' : 'transparent') : colors.fill;
            stateFillOpacity =
              visualStyle === 'tiles'
                ? isSelected
                  ? 0.40
                  : isHovered
                  ? 0.30
                  : isCompleted
                  ? 0.20
                  : 0.0
                : isSelected
                ? 0.92
                : isHovered
                ? 0.85
                : isCompleted
                ? 0.45
                : 0.28;

            strokeColor = isSelected
              ? '#fef08a'
              : isHovered
              ? '#fde047'
              : isCompleted
              ? '#34d399'
              : visualStyle === 'tiles'
              ? '#f59e0b'
              : colors.stroke;

            strokeWidth = isSelected ? 2.8 : isHovered ? 2.0 : 1.0;
          }

          return (
            <g
              key={stateId}
              className={`grupo-estado-svg grupo-estado-${stateId.toLowerCase()}`}
            >
              <path
                id={`state-path-${stateId}`}
                d={pathD}
                fill={stateFill}
                fillOpacity={stateFillOpacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                className={`poligono-estado-interativo path-estado-${stateId.toLowerCase()} cursor-pointer transition-colors duration-150 pointer-events-auto`}
                onMouseEnter={() => onStateEnter(stateId)}
                onMouseLeave={() => onStateLeave(stateId)}
                onClick={(e) => onStateClick(stateId, e)}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
