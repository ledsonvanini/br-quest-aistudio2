/**
 * Map Mode Management Service & Decoupled Mode Architecture Engine
 * 
 * Centralizes the decoupled logic, navigation parametrization (e.g. centralizarZoomMapa),
 * and mode-specific viewport/layer defaults to ensure zero cross-contamination between modes.
 */
import { AppMainMode, TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme } from '../types';
import {
  DEFAULT_STATE_CENTROIDS,
  calculateStateCenterPan,
  getClimateFocusZoomAndPan,
  getBiodiversityFocusZoomAndPan,
  getMusicalFocusZoomAndPan,
  getParameterizedMapCentering,
} from '../lib/mapProjections';

export interface MapCenteringParams {
  stateId?: string | null;
  centroid?: [number, number];
  containerWidth: number;
  containerHeight?: number;
  is3D?: boolean;
  isPanelOpen?: boolean;
  isExpanded?: boolean;
  showNeighbors?: boolean;
  isClimateActive?: boolean;
  isRadioOpen?: boolean;
  customZoom?: number;
}

export interface ModeDefaultProfile {
  id: AppMainMode;
  namePt: string;
  defaultTerrain: TerrainTileProvider;
  defaultVisualStyle: MapVisualStyle;
  defaultSubTheme: ChoroplethSubTheme;
  isCloudsDefault: boolean;
  isWavesDefault: boolean;
  isAtmosphereDefault: boolean;
  isRainSimDefault: boolean;
  defaultPanelOpen: boolean;
}

/**
 * Single Source of Truth for Default Mode Profiles
 */
export const MODE_DEFAULT_PROFILES: Record<AppMainMode, ModeDefaultProfile> = {
  clima: {
    id: 'clima',
    namePt: 'Clima e Telemetria',
    defaultTerrain: 'muted_gray',
    defaultVisualStyle: 'tiles',
    defaultSubTheme: 'regions',
    isCloudsDefault: true,
    isWavesDefault: true,
    isAtmosphereDefault: true,
    isRainSimDefault: false,
    defaultPanelOpen: false,
  },
  biodiversidade: {
    id: 'biodiversidade',
    namePt: 'Biodiversidade e Biomas',
    defaultTerrain: 'natural_earth',
    defaultVisualStyle: 'tiles',
    defaultSubTheme: 'biomes',
    isCloudsDefault: true,
    isWavesDefault: true,
    isAtmosphereDefault: true,
    isRainSimDefault: false,
    defaultPanelOpen: false,
  },
  geopolitica: {
    id: 'geopolitica',
    namePt: 'Geopolítica e Estatísticas',
    defaultTerrain: 'shaded_relief',
    defaultVisualStyle: 'tiles',
    defaultSubTheme: 'regions',
    isCloudsDefault: true,
    isWavesDefault: true,
    isAtmosphereDefault: true,
    isRainSimDefault: false,
    defaultPanelOpen: false,
  },
  musicalidades: {
    id: 'musicalidades',
    namePt: 'Musicalidades e Rádio Vintage',
    defaultTerrain: 'shaded_relief',
    defaultVisualStyle: 'tiles',
    defaultSubTheme: 'regions',
    isCloudsDefault: true,
    isWavesDefault: true,
    isAtmosphereDefault: true,
    isRainSimDefault: false,
    defaultPanelOpen: false,
  },
  globo3d: {
    id: 'globo3d',
    namePt: 'Globo Terrestre 3D Orbital',
    defaultTerrain: 'satellite_earth',
    defaultVisualStyle: 'tiles',
    defaultSubTheme: 'regions',
    isCloudsDefault: true,
    isWavesDefault: true,
    isAtmosphereDefault: true,
    isRainSimDefault: false,
    defaultPanelOpen: false,
  },
  aventura: {
    id: 'aventura',
    namePt: 'Aventura e Guardiões',
    defaultTerrain: 'voyager_parchment',
    defaultVisualStyle: 'tiles',
    defaultSubTheme: 'regions',
    isCloudsDefault: true,
    isWavesDefault: true,
    isAtmosphereDefault: true,
    isRainSimDefault: false,
    defaultPanelOpen: false,
  },
};

/**
 * Parametrized Map Centering & Zoom Function with Explicit Mode Context
 * 
 * Computes the exact pan and zoom depending on the active Mode and whether
 * that mode's side panel/drawer occupies screen space.
 */
export function centralizarZoomMapa(
  modo: AppMainMode,
  params: MapCenteringParams
): { targetZoom: number; targetPan: { x: number; y: number } } {
  const {
    stateId,
    centroid: customCentroid,
    containerWidth,
    containerHeight,
    is3D = true,
    isPanelOpen = false,
    isExpanded = true,
    showNeighbors = false,
    customZoom,
  } = params;

  // Overview centering (no state focused or explicit reset trigger)
  if (!stateId || stateId === 'RESET_CENTRAL_BRAZIL') {
    const scenario = showNeighbors
      ? 'Centralizar Mapa mostrar Vizinhos'
      : isPanelOpen
      ? 'Centralizar Mapa com App Lateral'
      : 'Centralizar Mapa';

    return getParameterizedMapCentering({
      scenario,
      is3D,
      containerWidth,
      containerHeight,
      isExpanded,
      customZoom,
    });
  }

  // Fallback to state centroid or central Brazil (Goiás)
  const effectiveCentroid: [number, number] =
    customCentroid ||
    DEFAULT_STATE_CENTROIDS[stateId] ||
    DEFAULT_STATE_CENTROIDS['GO'] ||
    [1280, 720];

  // Mode-Specific Focus Calculations
  switch (modo) {
    case 'clima':
      return getClimateFocusZoomAndPan(
        effectiveCentroid,
        stateId,
        containerWidth,
        is3D,
        isPanelOpen
      );

    case 'biodiversidade':
      return getBiodiversityFocusZoomAndPan(
        effectiveCentroid,
        stateId,
        containerWidth,
        is3D,
        isPanelOpen
      );

    case 'musicalidades':
      return getMusicalFocusZoomAndPan(
        effectiveCentroid,
        containerWidth,
        is3D,
        isPanelOpen,
        stateId
      );

    case 'aventura': {
      const isSmallState = ['DF', 'SE', 'AL', 'RJ', 'ES', 'PB', 'RN', 'SC'].includes(stateId);
      const isLargeState = ['AM', 'PA', 'MT', 'MG', 'BA'].includes(stateId);
      let baseZoom = isSmallState ? 1.95 : isLargeState ? 1.30 : 1.55;
      let screenOffsetX = 0;

      // O painel de aventura é o ÚNICO que fica na DIREITA. Portanto, deslocamos para a ESQUERDA (offset negativo)
      // para manter o estado e o mapa perfeitamente visíveis na área livre da esquerda
      if (isPanelOpen && containerWidth >= 640) {
        screenOffsetX = -Math.round(containerWidth * 0.14);
      }

      const targetPan = calculateStateCenterPan(effectiveCentroid, baseZoom, is3D, screenOffsetX);
      return { targetZoom: baseZoom, targetPan };
    }

    case 'geopolitica':
    default: {
      const isSmallState = ['DF', 'SE', 'AL', 'RJ', 'ES', 'PB', 'RN', 'SC'].includes(stateId);
      const isLargeState = ['AM', 'PA', 'MT', 'MG', 'BA'].includes(stateId);
      let baseZoom = isSmallState ? 2.05 : isLargeState ? 1.35 : 1.68;
      let screenOffsetX = 0;

      if (isPanelOpen && containerWidth >= 640) {
        screenOffsetX = Math.round(containerWidth * 0.22);
        baseZoom *= Math.max(0.75, Math.min(1.0, (containerWidth * 0.55) / 600));
      }

      const targetPan = calculateStateCenterPan(effectiveCentroid, baseZoom, is3D, screenOffsetX);
      return { targetZoom: baseZoom, targetPan };
    }
  }
}
