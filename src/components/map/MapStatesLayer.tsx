import React, { useMemo } from 'react';
import { geoPath } from 'd3-geo';
import { SOUTH_AMERICA_LANDMASS_GEO } from '../../data/southAmericaGeo';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT, cleanStateId } from '../../lib/mapProjections';
import { MapVisualStyle, ChoroplethSubTheme } from '../../lib/mapColorScales';
import { findNeighborCountry, NeighborCountryData } from '../../data/southAmericaNeighborsData';
import { ClippedMapTilesLayer, TerrainTileProvider } from './ClippedMapTilesLayer';
import { AntiqueCartographyDecor } from './AntiqueCartographyDecor';
import { CartographicGraticuleLayer } from './CartographicGraticuleLayer';
import { StateWeatherData } from '../../services/climateService';
import { ClimateMode } from './ClimatePhenomenaLayer';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import { CartographyLayerMode } from '../../types/cartography';
import {
  computeStateVisuals,
  REGION_STATES_MAP,
  REGION_COLORS_MAP,
  getStateRegion,
  STATE_NEIGHBORS_MAP,
} from './stateStyling/stateFillStyler';
import { SouthAmericaLandmassLayer, NeighborFeatureItem } from './layers/SouthAmericaLandmassLayer';
import { StatePolygonRenderer } from './layers/StatePolygonRenderer';
import { StateElevatedHighlightLayer } from './layers/StateElevatedHighlightLayer';
import { MapCartographicDefs } from './layers/MapCartographicDefs';
import { getStateTexturePattern } from './stateStyling/modeTextureStyler';
import { AppMainMode } from '../../types';

// Re-export constants for full backward compatibility
export { REGION_STATES_MAP, REGION_COLORS_MAP, getStateRegion, STATE_NEIGHBORS_MAP };

export interface MapStatesLayerProps {
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
  elNinoPhase?: 'El Niño' | 'La Niña' | 'Neutro';
  mainMode?: AppMainMode;
  stateWeather?: Record<string, StateWeatherData>;
  isGeopoliticaActive?: boolean;
  geopoliticaMetric?: GeopoliticaMetricKey;
  activeCartographyLayer?: CartographyLayerMode;
  selectedTerritorySubitemId?: string | null;
  focusedClimateStateId?: string | null;
  focusedBiodiversityStateId?: string | null;
  focusedGeopoliticsStateId?: string | null;
  focusedMusicalStateId?: string | null;
  focusedTerritoryStateId?: string | null;
  is3D?: boolean;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
  onStateClick: (stateId: string, e: React.MouseEvent) => void;
  onStateContextMenu?: (stateId: string, e: React.MouseEvent) => void;
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
  selectedRegionFilter = 'todos',
  hoveredRegionFilter = null,
  showNeighbors = false,
  hoveredCountryId = null,
  isClimateActive = false,
  climateMode = 'temperaturas_frentes',
  elNinoPhase = 'El Niño',
  mainMode,
  stateWeather,
  isGeopoliticaActive = false,
  geopoliticaMetric = 'densidade',
  activeCartographyLayer,
  selectedTerritorySubitemId = null,
  focusedClimateStateId = null,
  focusedBiodiversityStateId = null,
  focusedGeopoliticsStateId = null,
  focusedMusicalStateId = null,
  focusedTerritoryStateId = null,
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
  const neighborFeaturesList: NeighborFeatureItem[] = useMemo(() => {
    if (!pathGenerator) return [];
    const list: NeighborFeatureItem[] = [];

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

  // Active state for dedicated 3D elevation block overlay
  const activeElevatedStateId =
    (isClimateActive && focusedClimateStateId) ||
    focusedBiodiversityStateId ||
    focusedGeopoliticsStateId ||
    focusedMusicalStateId ||
    (hoveredStateId || selectedStateId);

  const activePathD = activeElevatedStateId ? statePathMap[activeElevatedStateId] : null;

  const activeVisuals = useMemo(() => {
    if (!activeElevatedStateId) return null;
    return computeStateVisuals({
      stateId: activeElevatedStateId,
      isHovered: hoveredStateId === activeElevatedStateId,
      isSelected: selectedStateId === activeElevatedStateId,
      completedStateIds,
      showNeighbors,
      visualStyle,
      choroplethSubTheme,
      terrainProvider,
      isClimateActive,
      climateMode,
      stateWeather,
      isGeopoliticaActive,
      geopoliticaMetric,
      activeCartographyLayer,
      selectedStateId,
      focusedClimateStateId,
      focusedBiodiversityStateId,
      focusedGeopoliticsStateId,
      focusedTerritoryStateId,
    });
  }, [
    activeElevatedStateId,
    hoveredStateId,
    selectedStateId,
    completedStateIds,
    showNeighbors,
    visualStyle,
    choroplethSubTheme,
    terrainProvider,
    isClimateActive,
    climateMode,
    stateWeather,
    isGeopoliticaActive,
    geopoliticaMetric,
    focusedClimateStateId,
    focusedBiodiversityStateId,
    focusedGeopoliticsStateId,
    focusedTerritoryStateId,
  ]);

  if (!pathGenerator || !geoData) return null;

  const activeRegionFilter =
    hoveredRegionFilter && hoveredRegionFilter !== 'todos'
      ? hoveredRegionFilter
      : selectedRegionFilter && selectedRegionFilter !== 'todos'
      ? selectedRegionFilter
      : null;
  const isRegionActive = !!activeRegionFilter;

  const activeIsolatedState =
    selectedStateId ||
    focusedTerritoryStateId ||
    (isClimateActive ? focusedClimateStateId : null) ||
    focusedBiodiversityStateId ||
    focusedGeopoliticsStateId ||
    focusedMusicalStateId ||
    null;

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
      <MapCartographicDefs brazilBoundaryCombinedPath={brazilBoundaryCombinedPath} />

      {/* 1. Continental Landmass & Neighboring Countries */}
      <SouthAmericaLandmassLayer
        neighborFeaturesList={neighborFeaturesList}
        showNeighbors={showNeighbors}
        hoveredCountryId={hoveredCountryId}
        isClimateActive={isClimateActive}
        isTerritoryActive={Boolean(activeCartographyLayer && activeCartographyLayer !== 'none')}
        terrainProvider={terrainProvider}
        onCountryEnter={onCountryEnter}
        onCountryLeave={onCountryLeave}
        onCountryClick={onCountryClick}
      />

      {/* 2. D3 Clipped Map Tiles (Natural Earth, Shaded Relief, Satellite) */}
      {visualStyle === 'tiles' && (
        <ClippedMapTilesLayer
          geoData={geoData}
          projection={projection}
          provider={terrainProvider}
          opacity={
            isClimateActive
              ? 0.60
              : activeCartographyLayer && activeCartographyLayer !== 'none'
              ? 0.45
              : 1.0
          }
        />
      )}

      {/* Cartographic Graticule Grid (Discreto e apenas quando nenhuma camada temática de território estiver ativa) */}
      {(!activeCartographyLayer || activeCartographyLayer === 'none') && (
        <CartographicGraticuleLayer
          projection={projection}
          isParchmentMode={terrainProvider === 'voyager_parchment'}
          isClimateActive={isClimateActive}
        />
      )}

      {/* Antique Cartography Embellishments (Apenas no modo padrão sem cartografia temática) */}
      {!isClimateActive && (!activeCartographyLayer || activeCartographyLayer === 'none') && !activeIsolatedState && (
        <AntiqueCartographyDecor isParchmentMode={terrainProvider === 'voyager_parchment'} />
      )}

      {/* 3. 27 Brazilian State Polygons */}
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

          const visuals = computeStateVisuals({
            stateId,
            isHovered,
            isSelected,
            completedStateIds,
            showNeighbors,
            visualStyle,
            choroplethSubTheme,
            terrainProvider,
            isClimateActive,
            climateMode,
            stateWeather,
            isGeopoliticaActive,
            geopoliticaMetric,
            activeCartographyLayer,
            selectedTerritorySubitemId,
            selectedStateId,
            focusedClimateStateId,
            focusedBiodiversityStateId,
            focusedGeopoliticsStateId,
            focusedTerritoryStateId,
          });

          const belongsToActiveRegion =
            !isRegionActive || (REGION_STATES_MAP[activeRegionFilter]?.includes(stateId) ?? false);
          const isNeighborOfSelected = Boolean(
            showNeighbors && selectedStateId && STATE_NEIGHBORS_MAP[selectedStateId]?.includes(stateId)
          );
          const stateRegion = getStateRegion(stateId);
          const regionColor = REGION_COLORS_MAP[stateRegion] || '#10b981';

          const effectiveMode: AppMainMode =
            mainMode ||
            (isClimateActive
              ? 'clima'
              : isGeopoliticaActive
              ? 'geopolitica'
              : activeCartographyLayer && activeCartographyLayer !== 'none'
              ? 'territorio'
              : 'aventura');

          const texturePattern = getStateTexturePattern({
            stateId,
            mainMode: effectiveMode,
            climateMode,
            elNinoPhase,
            activeCartographyLayer,
            geopoliticaMetric,
            isSelected,
            isHovered,
          });

          return (
            <StatePolygonRenderer
              key={stateId}
              stateId={stateId}
              pathD={pathD}
              visuals={visuals}
              isHovered={isHovered}
              isSelected={isSelected}
              isRegionActive={isRegionActive}
              belongsToActiveRegion={belongsToActiveRegion}
              regionColor={regionColor}
              isNeighborOfSelected={isNeighborOfSelected}
              activeIsolatedState={activeIsolatedState}
              showNeighbors={showNeighbors}
              isClimateActive={isClimateActive}
              isGeopoliticaActive={isGeopoliticaActive}
              visualStyle={visualStyle}
              activeCartographyLayer={activeCartographyLayer}
              texturePattern={texturePattern}
              onStateEnter={onStateEnter}
              onStateLeave={onStateLeave}
              onStateClick={onStateClick}
              onStateContextMenu={onStateContextMenu}
            />
          );
        })}
      </g>

      {/* 4. Realce Topográfico Elevado Integrado */}
      {!showNeighbors && activeElevatedStateId && activePathD && activeVisuals && (
        <StateElevatedHighlightLayer
          activeElevatedStateId={activeElevatedStateId}
          activePathD={activePathD}
          activeVisuals={activeVisuals}
          onStateClick={onStateClick}
          onStateEnter={onStateEnter}
          onStateLeave={onStateLeave}
        />
      )}
    </svg>
  );
};
