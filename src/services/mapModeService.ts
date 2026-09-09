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
  DEFAULT_BRAZIL_ZOOM,
} from '../lib/mapProjections';

export interface MapCenteringParams {
  stateId?: string | null;
  centroid?: [number, number];
  containerWidth: number;
  containerHeight?: number;
  is3D?: boolean;
  isPanelOpen?: boolean;
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
    defaultPanelOpen: true,
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
    defaultPanelOpen: true,
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
    is3D = true,
    isPanelOpen = false,
    customZoom,
  } = params;

  // Fallback to state centroid or central Brazil (Goiás)
  const effectiveCentroid: [number, number] =
    customCentroid ||
    (stateId && DEFAULT_STATE_CENTROIDS[stateId]) ||
    DEFAULT_STATE_CENTROIDS['GO'] ||
    [1280, 720];

  // If no specific state is focused, return mode-specific overview centering
  if (!stateId) {
    let baseOverviewZoom = customZoom || DEFAULT_BRAZIL_ZOOM;
    let screenOffsetX = 0;

    if (isPanelOpen && containerWidth >= 640) {
      screenOffsetX = Math.round(containerWidth * 0.18);
      baseOverviewZoom *= Math.max(0.80, Math.min(1.0, (containerWidth * 0.65) / 600));
    }

    const targetPan = calculateStateCenterPan(
      DEFAULT_STATE_CENTROIDS['GO'],
      baseOverviewZoom,
      is3D,
      screenOffsetX
    );

    return {
      targetZoom: baseOverviewZoom,
      targetPan,
    };
  }

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

    case 'geopolitica':
    case 'aventura':
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
