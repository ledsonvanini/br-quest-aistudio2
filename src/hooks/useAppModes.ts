/**
 * Custom Hook for Modular App Mode Orchestration
 * 
 * Ensures clean transitions, isolated panel states, and automatic configuration
 * for each mode ('clima', 'biodiversidade', 'geopolitica', 'musicalidades', 'globo3d', 'aventura').
 */
import { useState, useCallback } from 'react';
import { AppMainMode, TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme } from '../types';
import { MODE_DEFAULT_PROFILES } from '../services/mapModeService';

export function useAppModes(initialMode: AppMainMode = 'clima') {
  const [mainMode, setMainMode] = useState<AppMainMode>(initialMode);
  
  // Visuals
  const [terrainProvider, setTerrainProvider] = useState<TerrainTileProvider>(
    MODE_DEFAULT_PROFILES[initialMode].defaultTerrain
  );
  const [visualStyle, setVisualStyle] = useState<MapVisualStyle>(
    MODE_DEFAULT_PROFILES[initialMode].defaultVisualStyle
  );
  const [choroplethSubTheme, setChoroplethSubTheme] = useState<ChoroplethSubTheme>(
    MODE_DEFAULT_PROFILES[initialMode].defaultSubTheme
  );
  
  // Layer Toggles
  const [isCloudsActive, setIsCloudsActive] = useState<boolean>(true);
  const [isWavesActive, setIsWavesActive] = useState<boolean>(true);
  const [isAtmosphereActive, setIsAtmosphereActive] = useState<boolean>(true);
  const [isRainSimActive, setIsRainSimActive] = useState<boolean>(false);
  const [celestialTimeOverride, setCelestialTimeOverride] = useState<'day' | 'night' | 'auto'>('auto');

  // Mode Panels (Decoupled & Mutually Isolated)
  const [isObservatorioOpen, setIsObservatorioOpen] = useState<boolean>(false);
  const [isBiodiversityPanelOpen, setIsBiodiversityPanelOpen] = useState<boolean>(false);
  const [isGeopoliticaPanelOpen, setIsGeopoliticaPanelOpen] = useState<boolean>(false);
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(false);
  const [isGlobeTelemetryOpen, setIsGlobeTelemetryOpen] = useState<boolean>(true);

  // Filters & Selection
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('todos');
  const [hoveredRegionFilter, setHoveredRegionFilter] = useState<string | null>(null);
  const [showNeighbors, setShowNeighbors] = useState<boolean>(false);
  const [focusedStateId, setFocusedStateId] = useState<string | null>(null);
  const [centerMapTrigger, setCenterMapTrigger] = useState<number>(0);

  const handleCycleCelestial = useCallback(() => {
    setCelestialTimeOverride((curr) => {
      if (curr === 'day') return 'night';
      if (curr === 'night') return 'auto';
      return 'day';
    });
    setIsAtmosphereActive(true);
  }, []);

  const selectMainMode = useCallback((newMode: AppMainMode) => {
    setMainMode(newMode);
    const profile = MODE_DEFAULT_PROFILES[newMode];

    // Reset cross-mode panels to guarantee isolation
    setIsObservatorioOpen(false);
    setIsBiodiversityPanelOpen(false);
    setIsGeopoliticaPanelOpen(newMode === 'geopolitica');
    setIsRadioOpen(false);
    setFocusedStateId(null);
    setSelectedRegionFilter('todos');
    setShowNeighbors(false);
    setCenterMapTrigger((prev) => prev + 1);

    // Apply mode-specific default configurations
    setTerrainProvider(profile.defaultTerrain);
    setVisualStyle(profile.defaultVisualStyle);
    setChoroplethSubTheme(profile.defaultSubTheme);
    setIsCloudsActive(profile.isCloudsDefault);
    setIsWavesActive(profile.isWavesDefault);
    setIsAtmosphereActive(profile.isAtmosphereDefault);
    setIsRainSimActive(profile.isRainSimDefault);
    setCelestialTimeOverride('auto');
  }, []);

  const toggleNeighbors = useCallback(() => {
    setShowNeighbors((prev) => {
      const next = !prev;
      if (next) {
        setIsGeopoliticaPanelOpen(false);
        setIsBiodiversityPanelOpen(false);
        setIsObservatorioOpen(false);
        setFocusedStateId(null);
        setSelectedRegionFilter('todos');
        setHoveredRegionFilter(null);
      }
      return next;
    });
  }, []);

  return {
    mainMode,
    selectMainMode,
    terrainProvider,
    setTerrainProvider,
    visualStyle,
    setVisualStyle,
    choroplethSubTheme,
    setChoroplethSubTheme,
    isCloudsActive,
    setIsCloudsActive,
    isWavesActive,
    setIsWavesActive,
    isAtmosphereActive,
    setIsAtmosphereActive,
    isRainSimActive,
    setIsRainSimActive,
    celestialTimeOverride,
    setCelestialTimeOverride,
    handleCycleCelestial,
    isObservatorioOpen,
    setIsObservatorioOpen,
    isBiodiversityPanelOpen,
    setIsBiodiversityPanelOpen,
    isGeopoliticaPanelOpen,
    setIsGeopoliticaPanelOpen,
    isRadioOpen,
    setIsRadioOpen,
    isGlobeTelemetryOpen,
    setIsGlobeTelemetryOpen,
    selectedRegionFilter,
    setSelectedRegionFilter,
    hoveredRegionFilter,
    setHoveredRegionFilter,
    showNeighbors,
    setShowNeighbors,
    toggleNeighbors,
    focusedStateId,
    setFocusedStateId,
    centerMapTrigger,
    setCenterMapTrigger,
  };
}
