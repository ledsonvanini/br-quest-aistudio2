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
  selectedRegionFilter?: string;
  hoveredRegionFilter?: string | null;
  showNeighbors?: boolean;
  hoveredCountryId?: string | null;
  centroids?: Record<string, [number, number]>;
  isClimateActive?: boolean;
  climateMode?: ClimateMode;
  stateWeather?: Record<string, StateWeatherData>;
  is3D?: boolean;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
  onStateClick: (stateId: string, e: React.MouseEvent) => void;
  onStateContextMenu?: (stateId: string, e: React.MouseEvent) => void;
  onCountryEnter?: (countryId: string) => void;
  onCountryLeave?: (countryId: string) => void;
  onCountryClick?: (country: NeighborCountryData) => void;
}

export const REGION_STATES_MAP: Record<string, string[]> = {
  norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  centro_oeste: ['DF', 'GO', 'MT', 'MS'],
  sudeste: ['ES', 'MG', 'RJ', 'SP'],
  sul: ['PR', 'RS', 'SC'],
};

export const STATE_NEIGHBORS_MAP: Record<string, string[]> = {
  AC: ['AM', 'RO'],
  AL: ['PE', 'SE', 'BA'],
  AM: ['AC', 'RO', 'MT', 'PA', 'RR'],
  AP: ['PA'],
  BA: ['SE', 'AL', 'PE', 'PI', 'TO', 'GO', 'MG', 'ES'],
  CE: ['PI', 'RN', 'PB', 'PE'],
  DF: ['GO', 'MG'],
  ES: ['BA', 'MG', 'RJ'],
  GO: ['TO', 'BA', 'MG', 'DF', 'MS', 'MT'],
  MA: ['PA', 'TO', 'PI'],
  MG: ['BA', 'ES', 'RJ', 'SP', 'MS', 'GO', 'DF'],
  MS: ['MT', 'GO', 'MG', 'SP', 'PR'],
  MT: ['RO', 'AM', 'PA', 'TO', 'GO', 'MS'],
  PA: ['AP', 'RR', 'AM', 'MT', 'TO', 'MA'],
  PB: ['RN', 'CE', 'PE'],
  PE: ['PB', 'CE', 'PI', 'BA', 'AL'],
  PI: ['MA', 'TO', 'BA', 'PE', 'CE'],
  PR: ['SP', 'MS', 'SC'],
  RJ: ['ES', 'MG', 'SP'],
  RN: ['CE', 'PB'],
  RO: ['AC', 'AM', 'MT'],
  RR: ['AM', 'PA'],
  RS: ['SC'],
  SC: ['PR', 'RS'],
  SE: ['AL', 'BA'],
  SP: ['MG', 'RJ', 'PR', 'MS'],
  TO: ['PA', 'MA', 'PI', 'BA', 'GO', 'MT'],
};

export const MapStatesLayer: React.FC<MapStatesLayerProps> = ({
  geoData,
  projection,
  visualStyle,
  choroplethSubTheme,
  terrainProvider = 'shaded_relief',
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  selectedRegionFilter = 'todos',
  hoveredRegionFilter = null,
  showNeighbors = false,
  hoveredCountryId = null,
  isClimateActive = false,
  climateMode = 'temperaturas_frentes',
  stateWeather,
  is3D = false,
  onStateEnter,
  onStateLeave,
  onStateClick,
  onStateContextMenu,
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

  // Helper to compute precise visual styling for any state
  const getStateVisuals = (stateId: string, isHovered: boolean, isSelected: boolean) => {
    const isCompleted = completedStateIds.has(stateId);
    const weather = stateWeather?.[stateId];

    let stateFill = 'transparent';
    let stateFillOpacity = 0.0;
    let strokeColor = visualStyle === 'tiles' ? '#f59e0b' : '#38bdf8';
    let strokeWidth = 1.0;
    let underglowColor = '#f59e0b';
    let wallGradId = 'url(#extrusionWallGradDefault)';

    if (isClimateActive) {
      if (climateMode === 'temperaturas_frentes') {
        const temp = weather?.temperature ?? 24;
        stateFill = getEcmwfTempColor(temp).hex;
        stateFillOpacity = isSelected ? 0.98 : isHovered ? 0.92 : 0.72;
        strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : '#ffffff';
        strokeWidth = isSelected ? 2.8 : isHovered ? 2.2 : 0.8;
        underglowColor = temp > 28 ? '#f97316' : temp > 20 ? '#38bdf8' : '#60a5fa';
        wallGradId = temp > 28 ? 'url(#extrusionWallGradGold)' : 'url(#extrusionWallGradCyan)';
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
        stateFillOpacity = isSelected ? 0.96 : isHovered ? 0.90 : 0.68;
        strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : rain > 30 ? '#67e8f9' : '#fde047';
        strokeWidth = isSelected ? 2.8 : isHovered ? 2.2 : 0.8;
        underglowColor = rain > 30 ? '#00f0ff' : '#38bdf8';
        wallGradId = 'url(#extrusionWallGradCyan)';
      } else if (climateMode === 'ventos_aliseos') {
        const isFlyingRiverCorridor = ['AM', 'RO', 'MT', 'MS', 'SP', 'PR', 'SC'].includes(stateId);
        stateFill = isFlyingRiverCorridor ? '#10b981' : '#0369a1';
        stateFillOpacity = isSelected ? 0.94 : isHovered ? 0.88 : 0.62;
        strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : isFlyingRiverCorridor ? '#6ee7b7' : '#38bdf8';
        strokeWidth = isSelected ? 2.8 : isHovered ? 2.2 : 0.8;
        underglowColor = isFlyingRiverCorridor ? '#10b981' : '#0284c7';
        wallGradId = isFlyingRiverCorridor ? 'url(#extrusionWallGradEmerald)' : 'url(#extrusionWallGradCyan)';
      } else if (climateMode === 'el_nino_la_nina') {
        const isDroughtZone = ['AM', 'PA', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'].includes(stateId);
        const isFloodZone = ['RS', 'SC', 'PR'].includes(stateId);
        stateFill = isDroughtZone ? '#ef4444' : isFloodZone ? '#06b6d4' : '#1e293b';
        stateFillOpacity = isSelected ? 0.96 : isHovered ? 0.90 : 0.65;
        strokeColor = isSelected ? '#fef08a' : isHovered ? '#ffffff' : isDroughtZone ? '#fca5a5' : isFloodZone ? '#67e8f9' : '#64748b';
        strokeWidth = isSelected ? 2.8 : isHovered ? 2.2 : 0.8;
        underglowColor = isDroughtZone ? '#ef4444' : isFloodZone ? '#06b6d4' : '#64748b';
        wallGradId = isDroughtZone ? 'url(#extrusionWallGradGold)' : 'url(#extrusionWallGradCyan)';
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
            ? 0.50
            : isHovered
            ? 0.40
            : isCompleted
            ? 0.25
            : 0.0
          : isSelected
          ? 0.96
          : isHovered
          ? 0.90
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

      strokeWidth = isSelected ? 3.0 : isHovered ? 2.4 : 1.0;
      underglowColor = isCompleted ? '#10b981' : isSelected ? '#facc15' : '#f59e0b';
      wallGradId = isCompleted ? 'url(#extrusionWallGradEmerald)' : (visualStyle === 'tiles' || terrainProvider === 'voyager_parchment') ? 'url(#extrusionWallGradGold)' : 'url(#extrusionWallGradDefault)';
    }

    return {
      stateFill,
      stateFillOpacity,
      strokeColor,
      strokeWidth,
      underglowColor,
      wallGradId,
    };
  };

  if (!pathGenerator || !geoData) return null;

  // Active state for dedicated 3D elevation block overlay
  const activeElevatedStateId = hoveredStateId || selectedStateId;
  const activePathD = activeElevatedStateId ? statePathMap[activeElevatedStateId] : null;
  const activeVisuals = activeElevatedStateId ? getStateVisuals(activeElevatedStateId, hoveredStateId === activeElevatedStateId, selectedStateId === activeElevatedStateId) : null;

  // Isometric stepped extrusion slices (from -2px down to -16px height)
  const extrusionSlices = [-2, -4, -6, -8, -10, -12, -14, -16];
  const topElevationY = is3D ? -18 : -15;

  if (!pathGenerator || !geoData) return null;

  return (
    <svg
      className="camada-estados-svg svg-crisp-precision absolute inset-0 pointer-events-none overflow-visible"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        overflow: 'visible',
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
      }}
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

        {/* Subtle Directional Cartographic Drop Shadow for Highlighted State */}
        <filter id="stateReliefShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#010409" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* =========================================================================
          1. MASSA CONTINENTAL DA AMÉRICA DO SUL & PAÍSES VIZINHOS (SEM CONTORNOS EXTRAS)
             Contraste garantido puramente por variação harmônica de cores de terra.
         ========================================================================= */}
      <g className={`camada-america-do-sul south-america-context ${showNeighbors ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {neighborFeaturesList.map(({ pathD, countryName, matchedCountry, key }) => {
          const effectiveCountry = matchedCountry || {
            id: countryName.toUpperCase().slice(0, 3),
            code: countryName.toLowerCase().slice(0, 2),
            name: countryName,
            officialName: countryName,
            capital: '',
            flagUrl: '',
            flagEmoji: '🌎',
            isDirectNeighbor: true,
            centroid: [1000, 700] as [number, number],
            description: 'País do continente sul-americano.',
          };
          const isCurrentHovered =
            effectiveCountry && hoveredCountryId && hoveredCountryId === effectiveCountry.id;
          const isParchment = !isClimateActive && terrainProvider === 'voyager_parchment';

          return (
            <g
              key={key}
              className={`pais-vizinho pais-${countryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              {/* High Contrast Background Shadow Stroke for Zoomed-Out Clean Separation */}
              <path
                d={pathD}
                fill="none"
                stroke="#020617"
                strokeWidth={isCurrentHovered ? '3.2' : '2.2'}
                strokeOpacity={0.8}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="pointer-events-none"
              />
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
                className={`transition-colors duration-150 ${showNeighbors ? 'cursor-pointer pointer-events-auto' : ''}`}
                onMouseEnter={() => {
                  if (showNeighbors) {
                    onCountryEnter?.(effectiveCountry.id);
                  }
                }}
                onMouseLeave={() => {
                  if (showNeighbors) {
                    onCountryLeave?.(effectiveCountry.id);
                  }
                }}
                onClick={() => {
                  if (showNeighbors) {
                    onCountryClick?.(effectiveCountry);
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
             Inclui Under-Stroke de Alto Contraste para zoom distante impecável
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

          const isHovered = hoveredStateId === stateId;
          const isSelected = selectedStateId === stateId;
          const visuals = getStateVisuals(stateId, isHovered, isSelected);

          const activeRegionFilter =
            hoveredRegionFilter && hoveredRegionFilter !== 'todos'
              ? hoveredRegionFilter
              : selectedRegionFilter && selectedRegionFilter !== 'todos'
              ? selectedRegionFilter
              : null;

          const isRegionActive = !!activeRegionFilter;
          const belongsToActiveRegion = !isRegionActive || (REGION_STATES_MAP[activeRegionFilter]?.includes(stateId) ?? false);
          const isNeighborOfSelected = Boolean(showNeighbors && selectedStateId && STATE_NEIGHBORS_MAP[selectedStateId]?.includes(stateId));

          return (
            <g
              key={stateId}
              className={`grupo-estado-svg grupo-estado-${stateId.toLowerCase()} transition-all duration-200`}
              style={{
                opacity: isRegionActive ? (belongsToActiveRegion ? 1.0 : 0.20) : (showNeighbors && selectedStateId ? (isSelected || isNeighborOfSelected ? 1.0 : 0.45) : 1.0),
              }}
            >
              {/* High Contrast Dark Under-Stroke Layer */}
              <path
                d={pathD}
                fill="none"
                stroke="#010409"
                strokeWidth={visuals.strokeWidth + 1.2}
                strokeOpacity={0.88}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="understroke-contraste pointer-events-none"
              />

              {/* State Base Polygon */}
              <path
                id={`state-path-${stateId}`}
                d={pathD}
                fill={
                  isRegionActive && belongsToActiveRegion && visualStyle === 'tiles'
                    ? '#10b981'
                    : isNeighborOfSelected && visualStyle === 'tiles'
                    ? '#0284c7'
                    : visuals.stateFill
                }
                fillOpacity={
                  isRegionActive && belongsToActiveRegion && visualStyle === 'tiles'
                    ? 0.40
                    : isNeighborOfSelected && visualStyle === 'tiles'
                    ? 0.30
                    : visuals.stateFillOpacity
                }
                stroke={
                  isRegionActive && belongsToActiveRegion
                    ? '#34d399'
                    : isNeighborOfSelected
                    ? '#38bdf8'
                    : visuals.strokeColor
                }
                strokeWidth={
                  isRegionActive && belongsToActiveRegion
                    ? 2.2
                    : isNeighborOfSelected
                    ? 2.0
                    : visuals.strokeWidth
                }
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={`poligono-estado-interativo path-estado-${stateId.toLowerCase()} cursor-pointer transition-all duration-150 pointer-events-auto`}
                onMouseEnter={() => onStateEnter(stateId)}
                onMouseLeave={() => onStateLeave(stateId)}
                onClick={(e) => onStateClick(stateId, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStateContextMenu?.(stateId, e);
                }}
              />

              {/* Expanded Transparent Hit Target for Small Geographic States (DF, SE, AL, RJ, ES, PB, RN) */}
              <path
                d={pathD}
                fill="transparent"
                stroke="transparent"
                strokeWidth={18}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="hit-target-estado-expandido pointer-events-auto cursor-pointer"
                onMouseEnter={() => onStateEnter(stateId)}
                onMouseLeave={() => onStateLeave(stateId)}
                onClick={(e) => onStateClick(stateId, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStateContextMenu?.(stateId, e);
                }}
              />
            </g>
          );
        })}
      </g>

      {/* =========================================================================
          4. CAMADA DE REALCE TOPOGRÁFICO INTEGRADO (Estado em Foco/Hover/Selecionado)
             Conectado perfeitamente ao território, sem cortes, sem desconexão, sem glow borrado
         ========================================================================= */}
      {activeElevatedStateId && activePathD && activeVisuals && (
        <g
          key={`highlight-topografico-${activeElevatedStateId}`}
          className={`camada-realce-topografico estado-focado-${activeElevatedStateId.toLowerCase()} pointer-events-auto`}
        >
          {/* 4.1 Sombra de Relevo Direcional Sutil Integrada à Placa */}
          <path
            d={activePathD}
            filter="url(#stateReliefShadow)"
            fill="none"
            stroke="#010409"
            strokeWidth={activeVisuals.strokeWidth + 2.5}
            strokeOpacity={0.8}
            className="sombra-relevo-placa pointer-events-none"
          />

          {/* 4.2 Polígono Superior de Alta Definição */}
          <g
            className="face-estado-focado cursor-pointer pointer-events-auto"
            onClick={(e) => onStateClick(activeElevatedStateId, e)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStateContextMenu?.(activeElevatedStateId, e);
            }}
            onMouseEnter={() => onStateEnter(activeElevatedStateId)}
            onMouseLeave={() => onStateLeave(activeElevatedStateId)}
          >
            <path
              id={`state-path-highlight-${activeElevatedStateId}`}
              d={activePathD}
              fill={activeVisuals.stateFill}
              fillOpacity={Math.min(1.0, activeVisuals.stateFillOpacity + 0.15)}
              stroke={activeVisuals.strokeColor}
              strokeWidth={activeVisuals.strokeWidth + 1.2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="poligono-estado-realcado"
            />

            {/* 4.3 Traço Fino de Bisel Superior com Luz Zenital Nítida */}
            <path
              d={activePathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity={0.75}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="bisel-brilho-topo pointer-events-none"
            />
          </g>
        </g>
      )}
    </svg>
  );
};
