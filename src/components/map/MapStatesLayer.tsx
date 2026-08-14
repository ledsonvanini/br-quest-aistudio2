import React, { useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { SOUTH_AMERICA_LANDMASS_GEO } from '../../data/southAmericaGeo';
import {
  createNauticalGraticule,
  MAP_CANVAS_WIDTH,
  MAP_CANVAS_HEIGHT,
  cleanStateId,
} from '../../lib/mapProjections';
import {
  getStateColor,
  MapVisualStyle,
  ChoroplethSubTheme,
} from '../../lib/mapColorScales';
import { ClippedMapTilesLayer, TerrainTileProvider } from './ClippedMapTilesLayer';
import { AntiqueCartographyDecor } from './AntiqueCartographyDecor';

interface MapStatesLayerProps {
  geoData: any;
  projection: any;
  visualStyle: MapVisualStyle;
  choroplethSubTheme: ChoroplethSubTheme;
  terrainProvider?: TerrainTileProvider;
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  centroids?: Record<string, [number, number]>;
  onStateHover: (stateId: string | null, e?: React.MouseEvent) => void;
  onStateClick: (stateId: string, e: React.MouseEvent) => void;
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
  centroids,
  onStateHover,
  onStateClick,
}) => {
  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return geoPath().projection(projection);
  }, [projection]);

  const graticuleData = useMemo(() => {
    return createNauticalGraticule();
  }, []);

  // Filter out remote Pacific islands (Easter Island at -109°, Galapagos at -91°) so only continental South America and coastal landmass is rendered
  const filteredSouthAmericaFeatures = useMemo(() => {
    return SOUTH_AMERICA_LANDMASS_GEO.features.map((feat: any) => {
      if (feat.geometry?.type === 'MultiPolygon' && Array.isArray(feat.geometry.coordinates)) {
        const cleanCoordinates = feat.geometry.coordinates.filter((poly: any) => {
          const isFarPacific = poly[0]?.some((pt: number[]) => pt[0] < -82);
          return !isFarPacific;
        });
        return {
          ...feat,
          geometry: {
            ...feat.geometry,
            coordinates: cleanCoordinates,
          },
        };
      }
      return feat;
    });
  }, []);

  // Pre-calculate all state SVG path strings
  const statePathMap = useMemo(() => {
    if (!pathGenerator || !geoData) return {};
    const map: Record<string, string> = {};
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
        if (d) map[stateId] = d;
      }
    });
    return map;
  }, [pathGenerator, geoData]);

  // Compound SVG path combining all 27 states into a unified boundary for reliable clipping
  const brazilBoundaryCombinedPath = useMemo(() => {
    return Object.values(statePathMap).join(' ');
  }, [statePathMap]);

  // Sort states so the hovered/selected state is rendered last (on top of neighboring borders)
  const sortedFeatures = useMemo(() => {
    if (!geoData?.features) return [];
    if (!hoveredStateId && !selectedStateId) return geoData.features;
    return [...geoData.features].sort((a: any, b: any) => {
      const idA = cleanStateId(a.properties?.id || (a as any).id || a.properties?.sigla || a.properties?.UF || '');
      const idB = cleanStateId(b.properties?.id || (b as any).id || b.properties?.sigla || b.properties?.UF || '');
      if (idA === hoveredStateId || idA === selectedStateId) return 1;
      if (idB === hoveredStateId || idB === selectedStateId) return -1;
      return 0;
    });
  }, [geoData, hoveredStateId, selectedStateId]);

  if (!pathGenerator || !geoData) return null;

  return (
    <svg
      className="camada-estados-svg absolute inset-0 pointer-events-none"
      style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
      viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
    >
      <defs>
        {/* Master Clip Path: Single compound path encompassing ALL 27 states seamlessly */}
        <clipPath id="brazil-boundary-clip">
          <path d={brazilBoundaryCombinedPath} />
        </clipPath>
      </defs>

      {/* 2. South America Context Landmass (Authentic Detailed Continental Landmass & Neighboring Countries) */}
      <g className="camada-america-do-sul south-america-context pointer-events-none">
        {filteredSouthAmericaFeatures.map((feat: any, idx) => {
          const d = pathGenerator(feat as any);
          if (!d) return null;
          const countryName = feat.properties?.name || feat.properties?.NAME || `country-${idx}`;

          return (
            <g key={`sa-neighbor-${idx}`} className={`pais-vizinho pais-${countryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              {/* Continental Land Underlay */}
              <path
                d={d}
                fill="url(#rpgSouthAmericaGrad)"
                stroke="#334155"
                strokeWidth="1.2"
                strokeOpacity="0.7"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Subtle Coastal Marine Wash */}
              <path
                d={d}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.4"
                strokeOpacity="0.15"
              />
            </g>
          );
        })}
      </g>

      {/* 3. Base Underlay for Brazil - Clean transparent anchor without overriding beige texture */}
      <g id="brazil-base-land-underlay" className="camada-base-terreno-brasil" pointerEvents="none">
        {/* Intentionally transparent base to allow Shaded, Satellite, Atlas, and Region colors to shine without opaque beige overlay */}
      </g>

      {/* 4. D3 CLIPPED MAP TILES (Natural Earth, Shaded Relief, Satellite & Atlas Físico) */}
      {visualStyle === 'tiles' && (
        <ClippedMapTilesLayer
          geoData={geoData}
          projection={projection}
          provider={terrainProvider}
          opacity={1.0}
        />
      )}

      {/* 5. Antique Cartography Embellishments (Rosa dos Ventos, Caravel, Ocean Titles) */}
      <AntiqueCartographyDecor />

      {/* 6. Interactive Brazil States Vector Layer */}
      <g className="camada-vetorial-estados brazil-states-layer pointer-events-auto">
        {sortedFeatures.map((feat: any) => {
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

          const centroid = centroids ? centroids[stateId] : null;
          const [cx, cy] = centroid || [0, 0];

          const { fill, stroke } = getStateColor(
            stateId,
            visualStyle,
            choroplethSubTheme,
            isCompleted,
            isHovered,
            isSelected
          );

          // In Tiles/Shaded mode: State fill is transparent (0%) by default so terrain is fully visible;
          // on hover, it lights up with a subtle golden tint (30%).
          // In Choropleth mode: State fill has subtle opacity (28%), rising to 88% on hover.
          const stateFillOpacity =
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

          const strokeColor = isSelected
            ? '#fef08a'
            : isHovered
            ? '#fde047'
            : isCompleted
            ? '#34d399'
            : visualStyle === 'tiles'
            ? '#f59e0b'
            : stroke;

          const strokeWidth = isSelected ? 4.0 : isHovered ? 3.2 : 1.6;

          return (
            <g
              key={stateId}
              className={`grupo-estado-svg grupo-estado-${stateId.toLowerCase()}`}
              style={
                centroid
                  ? {
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }
                  : undefined
              }
            >
              {/* Outer Golden Glow on Hover/Selection */}
              {(isHovered || isSelected) && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={strokeWidth + 2.5}
                  strokeOpacity={0.7}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="borda-neon-dourada pointer-events-none animate-pulse"
                />
              )}

              {/* Primary State Polygon (Fires hover once upon entering state polygon, clears upon leaving) */}
              <path
                id={`state-path-${stateId}`}
                d={pathD}
                fill={visualStyle === 'tiles' ? (isHovered || isSelected ? '#fbbf24' : 'transparent') : fill}
                fillOpacity={stateFillOpacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={isSelected || isHovered ? 'url(#rpgGoldenAura)' : undefined}
                className={`poligono-estado-interativo path-estado-${stateId.toLowerCase()} cursor-pointer transition-all duration-200 pointer-events-auto`}
                onMouseEnter={(e) => onStateHover(stateId, e)}
                onMouseLeave={() => onStateHover(null)}
                onClick={(e) => onStateClick(stateId, e)}
              />

              {/* Subtle Inset Border for Cartographic Precision */}
              <path
                d={pathD}
                fill="none"
                stroke={isHovered ? '#fef08a' : '#d97706'}
                strokeWidth={1}
                strokeDasharray="4 4"
                strokeOpacity={isHovered ? 0.9 : 0.35}
                className="borda-pontilhada-estado pointer-events-none"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
