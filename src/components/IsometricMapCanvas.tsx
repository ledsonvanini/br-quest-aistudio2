import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { geoPath } from 'd3-geo';
import { GuardianData, Language, AppMainMode } from '../types';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { audioEngine } from '../lib/audioSynth';
import {
  createBrazilMercatorProjection,
  calculateCalibratedCentroids,
  clampPanZoom,
  calculateSphericalGlobeAngles,
  getBrazilACtoPBMidpointPan,
  getSouthAmericaMidpointPan,
  calculateStateCenterPan,
  getClimateFocusZoomAndPan,
  getBiodiversityFocusZoomAndPan,
  getBrazilOverviewFocusZoomAndPan,
  getMusicalFocusZoomAndPan,
  calculateAnchoredZoomPan,
  DEFAULT_BRAZIL_ZOOM,
  NEIGHBORS_CONTINENT_ZOOM,
  BRAZIL_MAP_PIVOT_CENTER,
  MAP_CANVAS_WIDTH,
  MAP_CANVAS_HEIGHT,
} from '../lib/mapProjections';
import { MapVisualStyle, ChoroplethSubTheme } from '../lib/mapColorScales';
import { centralizarZoomMapa } from '../services/mapModeService';

import { getStateAnaWaterData } from '../data/cartography/anaWaterData2025';
import {
  STATE_PRIMARY_BASIN,
  STATE_PRIMARY_BIOME,
  STATE_PRIMARY_ROUTE,
} from '../data/cartography/territoryAnchors';

// Modular Sub-components
import { ProceduralTerrainFilter } from './map/ProceduralTerrainFilter';
import { ParchmentTextureFilter } from './map/ParchmentTextureFilter';
import {
  ProceduralOceanCanvas,
  FINE_PAPER_NOISE_SVG,
} from './map/ProceduralOceanCanvas';
import { CoastalWavesCanvas } from './map/CoastalWavesCanvas';
import { AtmosphericCloudsLayer } from './map/AtmosphericCloudsLayer';
import { RainSimulationLayer } from './map/RainSimulationLayer';
import { ClimatePhenomenaLayer, ClimateMode } from './map/ClimatePhenomenaLayer';
import { ClimateControlPanel } from './map/ClimateControlPanel';
import { ClimateStationTelemetryCard } from './map/ClimateStationTelemetryCard';
import {
  fetchLiveClimateTelemetry,
  onClimateTelemetryUpdate,
  ClimateStationData,
  ElNinoIndexData,
  StateWeatherData,
} from '../services/climateService';
import { ProceduralAtmosphereLayer } from './map/ProceduralAtmosphereLayer';
import { TopHudCelestialOrb } from './map/TopHudCelestialOrb';
import { MapStatesLayer } from './map/MapStatesLayer';
import { MapPinsLayer } from './map/MapPinsLayer';
import { DottedCampaignPathLayer } from './map/DottedCampaignPathLayer';
import { NeighborCountryPinsLayer } from './map/NeighborCountryPinsLayer';
import { NeighborCountryModal } from './map/NeighborCountryModal';
import { NeighborCountryData } from '../data/southAmericaNeighborsData';
import { TopRightNavigationDock } from './map/TopRightNavigationDock';
import { MapChoroplethLegend } from './map/MapChoroplethLegend';
import { MapStateCarousel } from './map/MapStateCarousel';
import { TerrainTileProvider } from './map/ClippedMapTilesLayer';
import { StateDetailsSidebar } from './map/StateDetailsSidebar';
import { BrazilGlobeR3F } from './map/BrazilGlobeR3F';
import { IsolatedRightGuardianStandee } from './map/IsolatedRightGuardianStandee';
import { CompassLoadingScreen } from './map/CompassLoadingScreen';
import { loadBrazilGeoData, getCachedGeoData } from '../lib/geoDataLoader';
import { GizmoCompassHUD, MapAnglePreset } from './map/GizmoCompassHUD';
import { VintageRadioPlayer } from './music/VintageRadioPlayer';
import { TerritoryLayersOverlay } from './map/TerritoryLayersOverlay';
import { StateTerritoryDialog } from './map/territory/StateTerritoryDialog';
import { CartographyLayerMode } from '../types/cartography';
import { vintageRadioEngine } from '../lib/vintageRadioEngine';
import { CustomCanvasCursor } from './map/CustomCanvasCursor';
import { StateClimateDialog } from './map/StateClimateDialog';
import { BiodiversityMapLayer } from './map/BiodiversityMapLayer';
import { BiodiversityControlPanel } from './map/BiodiversityControlPanel';
import { StateBiodiversityDialog } from './map/StateBiodiversityDialog';
import { GeopoliticsMapLayer } from './map/GeopoliticsMapLayer';
import { GeopoliticsControlPanel } from './map/GeopoliticsControlPanel';
import { StateGeopoliticsDialog } from './map/StateGeopoliticsDialog';
import { EducatorPortalModal } from './educator/EducatorPortalModal';
import { StateAdventureDialog } from './guardian/StateAdventureDialog';
import { StateMusicDialog } from './music/StateMusicDialog';
import { UnifiedStateHoverTooltip } from './map/UnifiedStateHoverTooltip';
import { BiodiversityKingdom, BrazilBiome, BiodiversitySpecimen } from '../types';
import { GeopoliticaMetricKey, GeopoliticaScope } from '../types/geopolitica';
import { Compass, LocateFixed, MapPin, Flag, Plus, Minus, X, Crosshair, RotateCcw, Radio, Music } from 'lucide-react';

interface Props {
  completedStateIds: string[];
  unlockedInsigniaIds: string[];
  onSelectGuardian: (guardian: GuardianData) => void;
  lang: Language;
  onOpenSettings?: () => void;
  onClimateActiveChange?: (active: boolean) => void;
  mainMode?: AppMainMode;
  onSelectMainMode?: (mode: AppMainMode) => void;
  isRadioOpen?: boolean;
  onToggleRadio?: () => void;
  activeMusicCategory?: 'state_anthems' | 'top5' | 'national';
  onSelectMusicCategory?: (category: 'state_anthems' | 'top5' | 'national') => void;
  selectedRadioEraId?: string;
  onSelectRadioEra?: (eraId: string) => void;
  focusedStateId?: string | null;
  onFocusStateHandled?: () => void;
  climateMode?: ClimateMode;
  onClimateModeChange?: (mode: ClimateMode) => void;
  geopoliticaMetric?: GeopoliticaMetricKey;
  onGeopoliticaMetricChange?: (metric: GeopoliticaMetricKey) => void;
  isGeopoliticaPanelOpen?: boolean;
  onToggleGeopoliticaPanel?: () => void;
  biodiversityKingdom?: BiodiversityKingdom | 'all';
  onBiodiversityKingdomChange?: (kingdom: BiodiversityKingdom | 'all') => void;
  biodiversityBiome?: BrazilBiome | 'all';
  onBiodiversityBiomeChange?: (biome: BrazilBiome | 'all') => void;
  isBiodiversityThreatenedOnly?: boolean;
  onToggleBiodiversityThreatenedOnly?: () => void;
  isBiodiversityEndemicOnly?: boolean;
  onToggleBiodiversityEndemicOnly?: () => void;
  isBiodiversityPanelOpen?: boolean;
  onToggleBiodiversityPanel?: () => void;
  terrainProvider?: TerrainTileProvider;
  onTerrainProviderChange?: (provider: TerrainTileProvider) => void;
  visualStyle?: MapVisualStyle;
  onVisualStyleChange?: (style: MapVisualStyle) => void;
  choroplethSubTheme?: ChoroplethSubTheme;
  onChoroplethSubThemeChange?: (theme: ChoroplethSubTheme) => void;
  selectedRegionFilter?: string;
  hoveredRegionFilter?: string | null;
  showNeighbors?: boolean;
  onToggleNeighbors?: () => void;
  isObservatorioOpen?: boolean;
  onToggleObservatorio?: () => void;
  atmosphereEnabled?: boolean;
  isAtmosphereActive?: boolean;
  wavesEnabled?: boolean;
  isWavesActive?: boolean;
  cloudsEnabled?: boolean;
  isCloudsActive?: boolean;
  rainSimEnabled?: boolean;
  isRainSimActive?: boolean;
  timeOverride?: 'auto' | 'day' | 'night';
  centerTrigger?: number;
  onHoverStateChange?: (stateId: string | null) => void;
  globeTextureMode?: 'nasa_satellite' | 'night_lights' | 'natural_earth';
  globeClouds?: boolean;
  globeAutoRotate?: boolean;
  globeBorders?: boolean;
  globePinMode?: 'all' | 'compact' | 'none';
  isGlobeTelemetryOpen?: boolean;
  onToggleGlobeTelemetry?: () => void;
  onOpenDailyTips?: () => void;
  dailyTipsUnreadCount?: number;
  activeCartographyLayer?: CartographyLayerMode;
  selectedTerritorySubitemId?: string | null;
  onSelectTerritorySubitem?: (subitemId: string | null) => void;
  isTerritorySubmenuOpen?: boolean;
  onCloseTerritorySubmenu?: () => void;
  onOpenTerritorySubmenu?: () => void;
  selectedStateId?: string | null;
  onSelectStateId?: (stateId: string | null) => void;
  onStateLocated?: (stateId: string, stateName: string, regionId?: string) => void;
  isUserLocatedActive?: boolean;
  onClearUserLocation?: () => void;
  onOpenSearchSelector?: () => void;
  onNotification?: (msg: string) => void;
}

export const IsometricMapCanvas: React.FC<Props> = ({
  completedStateIds,
  onSelectGuardian,
  onClimateActiveChange,
  mainMode = 'aventura',
  onSelectMainMode,
  activeCartographyLayer = 'none',
  selectedTerritorySubitemId,
  onSelectTerritorySubitem,
  isTerritorySubmenuOpen = false,
  onCloseTerritorySubmenu,
  onOpenTerritorySubmenu,
  selectedStateId: propSelectedStateId,
  onSelectStateId,
  onStateLocated,
  isUserLocatedActive = false,
  onClearUserLocation,
  isRadioOpen = true,
  onToggleRadio,
  activeMusicCategory = 'state_anthems',
  onSelectMusicCategory,
  selectedRadioEraId = 'catedral_1930_1940',
  onSelectRadioEra,
  focusedStateId,
  onFocusStateHandled,
  climateMode = 'temperaturas_frentes',
  onClimateModeChange,
  geopoliticaMetric: propGeopoliticaMetric = 'miscigenacao',
  onGeopoliticaMetricChange,
  isGeopoliticaPanelOpen: propIsGeopoliticaPanelOpen = false,
  onToggleGeopoliticaPanel,
  biodiversityKingdom: propBiodiversityKingdom = 'all',
  onBiodiversityKingdomChange,
  biodiversityBiome: propBiodiversityBiome = 'all',
  onBiodiversityBiomeChange,
  isBiodiversityThreatenedOnly: propIsBiodiversityThreatenedOnly = false,
  onToggleBiodiversityThreatenedOnly,
  isBiodiversityEndemicOnly: propIsBiodiversityEndemicOnly = false,
  onToggleBiodiversityEndemicOnly,
  isBiodiversityPanelOpen: propIsBiodiversityPanelOpen = false,
  onToggleBiodiversityPanel,
  terrainProvider: propTerrainProvider,

  onTerrainProviderChange: propOnTerrainProviderChange,
  visualStyle: propVisualStyle,
  onVisualStyleChange: propOnVisualStyleChange,
  choroplethSubTheme: propChoroplethSubTheme,
  selectedRegionFilter = 'todos',
  hoveredRegionFilter = null,
  showNeighbors: propShowNeighbors,
  onToggleNeighbors,
  isObservatorioOpen: propIsObservatorioOpen,
  onToggleObservatorio,
  atmosphereEnabled: propAtmosphereEnabled,
  isAtmosphereActive: propIsAtmosphereActive,
  wavesEnabled: propWavesEnabled,
  isWavesActive: propIsWavesActive,
  cloudsEnabled: propCloudsEnabled,
  isCloudsActive: propIsCloudsActive,
  rainSimEnabled: propRainSimEnabled,
  isRainSimActive: propIsRainSimActive,
  timeOverride: propTimeOverride,
  centerTrigger,
  onHoverStateChange,
  globeTextureMode = 'nasa_satellite',
  globeClouds = true,
  globeAutoRotate = false,
  globeBorders = true,
  globePinMode = 'all',
  isGlobeTelemetryOpen,
  onToggleGlobeTelemetry,
  onOpenDailyTips,
  dailyTipsUnreadCount,
  onOpenSearchSelector,
  onNotification,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getContainerWidth = useCallback(() => {
    return containerRef.current?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
  }, []);

  // Visual Modes & Customization
  const [internalVisualStyle, setVisualStyle] = useState<MapVisualStyle>('tiles');
  const [internalTerrainProvider, setTerrainProvider] = useState<TerrainTileProvider>('shaded_relief');
  const [internalChoroplethSubTheme, setChoroplethSubTheme] = useState<ChoroplethSubTheme>('regions');
  
  const visualStyle = propVisualStyle !== undefined ? propVisualStyle : internalVisualStyle;
  const terrainProvider = propTerrainProvider !== undefined ? propTerrainProvider : internalTerrainProvider;
  const choroplethSubTheme = propChoroplethSubTheme !== undefined ? propChoroplethSubTheme : internalChoroplethSubTheme;

  const [is3D, setIs3D] = useState<boolean>(true);
  const [isGlobe3DActive, setIsGlobe3DActive] = useState<boolean>(false);
  const [globeZoomInTrigger, setGlobeZoomInTrigger] = useState<number>(0);
  const [globeZoomOutTrigger, setGlobeZoomOutTrigger] = useState<number>(0);
  const [globeCenterTrigger, setGlobeCenterTrigger] = useState<number>(0);
  const [internalAtmosphereEnabled, setAtmosphereEnabled] = useState<boolean>(true);
  const [internalWavesEnabled, setWavesEnabled] = useState<boolean>(true);
  const [internalCloudsEnabled, setCloudsEnabled] = useState<boolean>(true);
  const [internalRainSimEnabled, setRainSimEnabled] = useState<boolean>(false);

  const atmosphereEnabled = propAtmosphereEnabled !== undefined ? propAtmosphereEnabled : (propIsAtmosphereActive !== undefined ? propIsAtmosphereActive : internalAtmosphereEnabled);
  const wavesEnabled = propWavesEnabled !== undefined ? propWavesEnabled : (propIsWavesActive !== undefined ? propIsWavesActive : internalWavesEnabled);
  const cloudsEnabled = propCloudsEnabled !== undefined ? propCloudsEnabled : (propIsCloudsActive !== undefined ? propIsCloudsActive : internalCloudsEnabled);
  const rainSimEnabled = propRainSimEnabled !== undefined ? propRainSimEnabled : (propIsRainSimActive !== undefined ? propIsRainSimActive : internalRainSimEnabled);
  const [internalShowNeighbors, setInternalShowNeighbors] = useState<boolean>(false);
  const showNeighbors = propShowNeighbors !== undefined ? propShowNeighbors : internalShowNeighbors;
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<NeighborCountryData | null>(null);
  const [isEducatorPortalOpen, setIsEducatorPortalOpen] = useState<boolean>(false);

  // Climate Phenomena & Live Meteorological Telemetry (Open-Meteo API)
  const [isClimateActive, setIsClimateActive] = useState<boolean>(mainMode === 'clima');
  const [internalIsClimatePanelOpen, setInternalIsClimatePanelOpen] = useState<boolean>(false);
  const isClimatePanelOpen = propIsObservatorioOpen !== undefined ? propIsObservatorioOpen : internalIsClimatePanelOpen;
  const [selectedClimateStateId, setSelectedClimateStateId] = useState<string | null>(null);

  // Biodiversity Module States & Handlers
  const [internalBiodiversityKingdom, setInternalBiodiversityKingdom] = useState<BiodiversityKingdom | 'all'>('all');
  const [internalBiodiversityBiome, setInternalBiodiversityBiome] = useState<BrazilBiome | 'all'>('all');
  const [internalBiodiversityThreatenedOnly, setInternalBiodiversityThreatenedOnly] = useState<boolean>(false);
  const [internalBiodiversityEndemicOnly, setInternalBiodiversityEndemicOnly] = useState<boolean>(false);
  const [internalIsBiodiversityPanelOpen, setInternalIsBiodiversityPanelOpen] = useState<boolean>(false);
  const [isBiodiversityPanelExpanded, setIsBiodiversityPanelExpanded] = useState<boolean>(true);
  const [selectedBiodiversityStateId, setSelectedBiodiversityStateId] = useState<string | null>(null);

  const biodiversityKingdom = propBiodiversityKingdom !== undefined ? propBiodiversityKingdom : internalBiodiversityKingdom;
  const biodiversityBiome = propBiodiversityBiome !== undefined ? propBiodiversityBiome : internalBiodiversityBiome;
  const isBiodiversityThreatenedOnly = propIsBiodiversityThreatenedOnly !== undefined ? propIsBiodiversityThreatenedOnly : internalBiodiversityThreatenedOnly;
  const isBiodiversityEndemicOnly = propIsBiodiversityEndemicOnly !== undefined ? propIsBiodiversityEndemicOnly : internalBiodiversityEndemicOnly;
  const isBiodiversityPanelOpen = propIsBiodiversityPanelOpen !== undefined ? propIsBiodiversityPanelOpen : internalIsBiodiversityPanelOpen;

  const handleBiodiversityKingdomChange = (k: BiodiversityKingdom | 'all') => {
    if (onBiodiversityKingdomChange) {
      onBiodiversityKingdomChange(k);
    } else {
      setInternalBiodiversityKingdom(k);
    }
  };

  const handleBiodiversityBiomeChange = (b: BrazilBiome | 'all') => {
    if (onBiodiversityBiomeChange) {
      onBiodiversityBiomeChange(b);
    } else {
      setInternalBiodiversityBiome(b);
    }
  };

  const handleToggleThreatenedOnly = () => {
    if (onToggleBiodiversityThreatenedOnly) {
      onToggleBiodiversityThreatenedOnly();
    } else {
      setInternalBiodiversityThreatenedOnly((p) => !p);
    }
  };

  const handleToggleEndemicOnly = () => {
    if (onToggleBiodiversityEndemicOnly) {
      onToggleBiodiversityEndemicOnly();
    } else {
      setInternalBiodiversityEndemicOnly((p) => !p);
    }
  };

  // Geopolitics Module States & Handlers
  const [internalGeopoliticaMetric, setInternalGeopoliticaMetric] = useState<GeopoliticaMetricKey>('miscigenacao');
  const [internalIsGeopoliticaPanelOpen, setInternalIsGeopoliticaPanelOpen] = useState<boolean>(false);
  const [isGeopoliticaPanelExpanded, setIsGeopoliticaPanelExpanded] = useState<boolean>(true);
  const [geopoliticaScope, setGeopoliticaScope] = useState<GeopoliticaScope>('nacional');
  const [selectedGeopoliticaStateId, setSelectedGeopoliticaStateId] = useState<string | null>(null);
  const [selectedTerritoryStateId, setSelectedTerritoryStateId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const geopoliticaMetric = propGeopoliticaMetric !== undefined ? propGeopoliticaMetric : internalGeopoliticaMetric;
  const isGeopoliticaPanelOpen = propIsGeopoliticaPanelOpen !== undefined ? propIsGeopoliticaPanelOpen : internalIsGeopoliticaPanelOpen;

  const handleGeopoliticaMetricChange = (metric: GeopoliticaMetricKey) => {
    if (onGeopoliticaMetricChange) {
      onGeopoliticaMetricChange(metric);
    } else {
      setInternalGeopoliticaMetric(metric);
    }
  };

  // Isolamento Estrito: quando a camada de território muda, isola o módulo sem abrir AppLateral automaticamente
  useEffect(() => {
    if (!activeCartographyLayer || activeCartographyLayer === 'none') {
      setSelectedTerritoryStateId(null);
      if (selectedStateId) {
        setSelectedStateId(null);
        onSelectStateId?.(null);
      }
    } else {
      setSelectedClimateStateId(null);
      setSelectedClimateStation(null);
      setSelectedBiodiversityStateId(null);
      setSelectedGeopoliticaStateId(null);
      setSelectedTerritoryStateId(null);
      setSelectedStateId(null);
      onSelectStateId?.(null);
      setInternalIsClimatePanelOpen(false);
      setInternalIsBiodiversityPanelOpen(false);
      setInternalIsGeopoliticaPanelOpen(false);

      // Centraliza a visão do Brasil no modo sem AppLateral
      const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
        stateId: 'RESET_CENTRAL_BRAZIL',
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: false,
      });
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;
    }
  }, [activeCartographyLayer]);

  // Synchronize internal climate active state with global mainMode
  useEffect(() => {
    hoveredStateIdRef.current = null;
    setHoveredStateId(null);
    lastSoundPlayedStateRef.current = null;
    if (stateLeaveTimeoutRef.current) {
      clearTimeout(stateLeaveTimeoutRef.current);
      stateLeaveTimeoutRef.current = null;
    }

    if (mainMode === 'clima') {
      setIsGlobe3DActive(false);
      setIsClimateActive(true);
      setInternalIsClimatePanelOpen(false);
      setInternalShowNeighbors(false);
      previousTerrainRef.current = terrainProvider;
      previousVisualStyleRef.current = visualStyle;
      setVisualStyle('tiles');
      setTerrainProvider('muted_gray');
    } else if (mainMode === 'globo3d') {
      setIsGlobe3DActive(true);
      setIsClimateActive(false);
      setInternalIsClimatePanelOpen(false);
      setInternalShowNeighbors(false);
    } else {
      setIsGlobe3DActive(false);
      setIsClimateActive(false);
      setInternalIsClimatePanelOpen(false);
      if (mainMode === 'musicalidades') {
        setInternalShowNeighbors(false);
        setSelectedStateId(null);
        const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
        setTransitionMode('button');
        setPan(defaultPan);
        setZoom(DEFAULT_BRAZIL_ZOOM);
        baseUserPanRef.current = defaultPan;
        baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
      }
    }
    onClimateActiveChange?.(mainMode === 'clima');
  }, [mainMode, is3D, onClimateActiveChange]);

  const [internalClimateMode, setInternalClimateMode] = useState<ClimateMode>('temperaturas_frentes');
  const currentClimateMode = climateMode || internalClimateMode;
  const handleClimateModeChange = (mode: ClimateMode) => {
    setInternalClimateMode(mode);
    onClimateModeChange?.(mode);
  };
  const [climateStations, setClimateStations] = useState<ClimateStationData[]>([]);
  const [stateWeather, setStateWeather] = useState<Record<string, StateWeatherData>>({});
  const [elNinoData, setElNinoData] = useState<ElNinoIndexData | null>(null);
  const [selectedClimateStation, setSelectedClimateStation] = useState<ClimateStationData | null>(null);
  const [climateSpeedMultiplier, setClimateSpeedMultiplier] = useState<number>(1.0);
  const [isClimateLoading, setIsClimateLoading] = useState<boolean>(false);
  const [climateUpdatedAt, setClimateUpdatedAt] = useState<string>('');
  const [climateDateTimeFormatted, setClimateDateTimeFormatted] = useState<string>('');
  const [avgTempBrazil, setAvgTempBrazil] = useState<number>(27.4);
  const [maxTempState, setMaxTempState] = useState<{ stateId: string; temp: number }>({ stateId: 'MT', temp: 35.1 });
  const [minTempState, setMinTempState] = useState<{ stateId: string; temp: number }>({ stateId: 'RS', temp: 17.5 });

  // Store previous terrain/style to seamlessly restore when closing climate mode
  const previousTerrainRef = useRef<TerrainTileProvider>('shaded_relief');
  const previousVisualStyleRef = useRef<MapVisualStyle>('tiles');

  const loadClimateData = useCallback(async () => {
    setIsClimateLoading(true);
    try {
      const res = await fetchLiveClimateTelemetry();
      if (res) {
        setClimateStations(res.stations);
        setStateWeather(res.stateWeather);
        setElNinoData(res.elNino);
        setClimateUpdatedAt(res.fetchedAt ? String(res.fetchedAt) : (res.updatedAtH || res.updatedAt));
        setClimateDateTimeFormatted(res.dateTimeFormatted);
        setAvgTempBrazil(res.avgTempBrazil);
        setMaxTempState(res.maxTempState);
        setMinTempState(res.minTempState);
      }
    } catch (e) {
      console.error('Failed to load climate telemetry:', e);
    } finally {
      setIsClimateLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onClimateTelemetryUpdate((res) => {
      if (res) {
        setClimateStations(res.stations);
        setStateWeather(res.stateWeather);
        setElNinoData(res.elNino);
        setClimateUpdatedAt(res.fetchedAt ? String(res.fetchedAt) : (res.updatedAtH || res.updatedAt));
        setClimateDateTimeFormatted(res.dateTimeFormatted);
        setAvgTempBrazil(res.avgTempBrazil);
        setMaxTempState(res.maxTempState);
        setMinTempState(res.minTempState);
      }
    });

    loadClimateData();

    return () => {
      unsubscribe();
    };
  }, [loadClimateData]);

  const handleToggleClimate = () => {
    audioEngine.playSfx('click');
    if (onToggleObservatorio) {
      onToggleObservatorio();
    } else {
      setInternalIsClimatePanelOpen((prev) => !prev);
    }
  };

  // Camera Pan & Zoom States (Centered mathematically on Brazil with 20% increased default zoom out: DEFAULT_BRAZIL_ZOOM = 0.95)
  const baseUserZoomRef = useRef<number>(DEFAULT_BRAZIL_ZOOM);
  const baseUserPanRef = useRef<{ x: number; y: number }>(getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, true));
  const [pan, setPan] = useState<{ x: number; y: number }>(() => getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, true));
  const [zoom, setZoom] = useState<number>(DEFAULT_BRAZIL_ZOOM);
  const [baseTiltAngle, setBaseTiltAngle] = useState<number>(42);
  const [headingAngle, setHeadingAngle] = useState<number>(0);
  const [internalTimeOverride, setInternalTimeOverride] = useState<'auto' | 'day' | 'night'>('auto');
  const timeOverride = propTimeOverride !== undefined ? propTimeOverride : internalTimeOverride;

  // Transition Animation Mode: 'button' (950ms), 'wheel' (180ms), 'hover' (1350ms), 'dwell' (1850ms slow cinematic center), or 'entry' (1600ms zoom-in)
  const [transitionMode, setTransitionMode] = useState<'drag' | 'wheel' | 'hover' | 'dwell' | 'button' | 'entry'>('button');
  const [isEnteringScene, setIsEnteringScene] = useState<boolean>(false);
  const [enteringGuardianName, setEnteringGuardianName] = useState<string>('');

  // Dynamic Spherical Globe Angles
  const lastMousePosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Drag & Gestures
  const isMouseDownRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const mouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover & Focus States (State tracking and auditory feedback without camera hijacking)
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const hoveredStateRef = useRef<string | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(propSelectedStateId ?? null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);
  const [showAnchorPoint, setShowAnchorPoint] = useState<boolean>(false);
  const anchorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // GeoJSON Data (instant cache retrieval)
  const [geoData, setGeoData] = useState<any>(() => getCachedGeoData());

  // Set of completed IDs for O(1) lookups
  const completedSet = useMemo(() => new Set(completedStateIds), [completedStateIds]);

  // Modo Território e Redes Vivas Ativo (Camadas de Bacias, Biomas, Rotas)
  const isTerritoryModeActive = Boolean(
    activeCartographyLayer && activeCartographyLayer !== 'none'
  );

  // Load GeoJSON on mount with memory cache
  useEffect(() => {
    let isMounted = true;
    loadBrazilGeoData()
      .then((data) => {
        if (isMounted) setGeoData(data);
      })
      .catch((err) => console.error('Failed to load br.json GeoJSON:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Calibrated D3 Projection (Centered exactly on Brazil: -54.39°, -15.18°)
  const projection = useMemo(() => {
    return createBrazilMercatorProjection();
  }, []);

  // Exact Mathematical Centroids for Pins (O Círculo Pulsante de cada estado)
  const centroids = useMemo(() => {
    const pathGen = geoPath().projection(projection);
    return calculateCalibratedCentroids(geoData?.features, pathGen);
  }, [geoData, projection]);

  useEffect(() => {
    if (propSelectedStateId !== undefined) {
      setSelectedStateId(propSelectedStateId);
      if (activeCartographyLayer && activeCartographyLayer !== 'none') {
        setSelectedTerritoryStateId(propSelectedStateId);
      }
      if (propSelectedStateId && centroids[propSelectedStateId]) {
        const centroid = centroids[propSelectedStateId];
        const { targetZoom, targetPan } = centralizarZoomMapa(mainMode, {
          stateId: propSelectedStateId,
          centroid,
          containerWidth: getContainerWidth(),
          is3D,
          isPanelOpen: true,
        });
        setTransitionMode('button');
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
      } else if (propSelectedStateId === null) {
        const { targetZoom, targetPan } = centralizarZoomMapa(mainMode, {
          containerWidth: getContainerWidth(),
          is3D,
          isPanelOpen: false,
        });
        setTransitionMode('button');
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
      }
    }
  }, [propSelectedStateId, activeCartographyLayer, mainMode, is3D, centroids, getContainerWidth]);

  // Interatividade das Estações do Observatório: Selecionar e Voar a Câmera
  const handleSelectClimateStation = useCallback((station: ClimateStationData | null) => {
    setSelectedClimateStation(station);
    if (!station) return;

    audioEngine.playSfx('click');

    if (station.lng !== undefined && station.lat !== undefined && projection) {
      const coords = projection([station.lng, station.lat]);
      if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
        const targetZoom = 1.30;
        const cx = coords[0];
        const cy = coords[1];
        const targetPan = {
          x: (MAP_CANVAS_WIDTH / 2 - cx) * targetZoom,
          y: (MAP_CANVAS_HEIGHT / 2 - cy) * targetZoom,
        };
        setTransitionMode('button');
        setZoom(targetZoom);
        setPan(targetPan);
      }
    }
  }, [projection]);

  // Troca Imediata de Textura de Base do Mapa
  const handleTerrainProviderChange = useCallback((newProvider: TerrainTileProvider) => {
    setTerrainProvider(newProvider);
    setVisualStyle('tiles');
    propOnVisualStyleChange?.('tiles');
    propOnTerrainProviderChange?.(newProvider);
    audioEngine.playSfx('click');
  }, [propOnVisualStyleChange, propOnTerrainProviderChange]);

  // Focus and zoom smoothly on state if triggered by top menu telemetry pills or submenus
  useEffect(() => {
    if (focusedStateId === 'RESET_CENTRAL_BRAZIL') {
      setSelectedStateId(null);
      const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
      setTransitionMode('button');
      setPan(defaultPan);
      setZoom(DEFAULT_BRAZIL_ZOOM);
      baseUserPanRef.current = defaultPan;
      baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
      onFocusStateHandled?.();
      return;
    }

    if (focusedStateId && centroids[focusedStateId]) {
      setSelectedStateId(focusedStateId);
      setTransitionMode('button');
      if (mainMode === 'musicalidades') {
        if (!isRadioOpen && onToggleRadio) {
          onToggleRadio();
        }
        const { targetZoom, targetPan } = centralizarZoomMapa('musicalidades', {
          stateId: focusedStateId,
          centroid: centroids[focusedStateId],
          containerWidth: getContainerWidth(),
          is3D,
          isPanelOpen: true,
        });
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
      } else if (isClimateActive || mainMode === 'clima') {
        if (propIsObservatorioOpen && onToggleObservatorio) {
          onToggleObservatorio();
        }
        setInternalIsClimatePanelOpen(false);
        setSelectedClimateStation(null);

        const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
          stateId: focusedStateId,
          centroid: centroids[focusedStateId],
          containerWidth: getContainerWidth(),
          is3D,
          isPanelOpen: true,
        });
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
        setSelectedClimateStateId(focusedStateId);
      } else {
        const { targetZoom, targetPan } = centralizarZoomMapa(mainMode, {
          stateId: focusedStateId,
          centroid: centroids[focusedStateId],
          containerWidth: getContainerWidth(),
          is3D,
          isPanelOpen: false,
          customZoom: Math.min(2.0, Math.max(1.2, zoom)),
        });
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
      }
      onFocusStateHandled?.();
    }
  }, [focusedStateId, centroids, getContainerWidth, is3D, isClimateActive, isRadioOpen, mainMode, onFocusStateHandled, onToggleObservatorio, onToggleRadio, propIsObservatorioOpen, zoom]);

  // Ao fechar o rádio no modo Musicalidades, retorna o comportamento inicial (mapa do Brasil no centro da tela)
  const prevRadioOpenRef = useRef<boolean>(isRadioOpen);
  useEffect(() => {
    if (mainMode === 'musicalidades') {
      if (prevRadioOpenRef.current && !isRadioOpen) {
        setSelectedStateId(null);
        const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
        setTransitionMode('button');
        setPan(defaultPan);
        setZoom(DEFAULT_BRAZIL_ZOOM);
        baseUserPanRef.current = defaultPan;
        baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
      }
    }
    prevRadioOpenRef.current = isRadioOpen;
  }, [isRadioOpen, mainMode, is3D]);

  // Spherical Globe Dynamic Angles
  const sphericalAngles = useMemo(() => {
    return calculateSphericalGlobeAngles(pan, baseTiltAngle, { x: 0, y: 0 }, is3D, headingAngle);
  }, [pan, baseTiltAngle, is3D, headingAngle]);

  // Kinetic Inertia Physics & Velocity Sampling
  const isInertiaActiveRef = useRef<boolean>(false);
  const inertiaRafRef = useRef<number | null>(null);
  const currentInertiaVelRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const recentMouseSamplesRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  // Hover Debounce Timers & Single-Sound Trigger Refs
  const hoveredStateIdRef = useRef<string | null>(null);
  const stateLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stateHoverDwellTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSoundPlayedStateRef = useRef<string | null>(null);
  const currentMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const basePreDwellPanRef = useRef<{ x: number; y: number } | null>(null);
  const basePreDwellZoomRef = useRef<number | null>(null);
  const isDwellZoomedRef = useRef<boolean>(false);

  const hoveredCountryIdRef = useRef<string | null>(null);
  const countryLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSoundPlayedCountryRef = useRef<string | null>(null);

  // Stop kinetic inertia simulation
  const stopInertia = useCallback(() => {
    isInertiaActiveRef.current = false;
    if (inertiaRafRef.current) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  }, []);

  // Zero-Void Clamping execution
  const applyClampedPanZoom = useCallback(
    (newPan: { x: number; y: number }, newZoom: number) => {
      const containerW = containerRef.current?.clientWidth || 1280;
      const containerH = containerRef.current?.clientHeight || 720;
      const clamped = clampPanZoom(
        newPan,
        newZoom,
        { width: containerW, height: containerH },
        0.35,
        3.20,
        mainMode === 'musicalidades' && isRadioOpen
      );
      setPan(clamped.pan);
      setZoom(clamped.zoom);
    },
    [mainMode, isRadioOpen]
  );

  // Kinetic Inertial momentum loop
  const startInertiaGlide = useCallback(() => {
    stopInertia();
    isInertiaActiveRef.current = true;

    const stepInertia = () => {
      if (!isInertiaActiveRef.current) return;
      const { vx, vy } = currentInertiaVelRef.current;
      const speed = Math.hypot(vx, vy);

      if (speed < 0.12) {
        stopInertia();
        return;
      }

      // Physical air/ground resistance friction coefficient (0.925)
      const friction = 0.925;
      const nextVx = vx * friction;
      const nextVy = vy * friction;
      currentInertiaVelRef.current = { vx: nextVx, vy: nextVy };

      setPan((prevPan) => {
        const containerW = containerRef.current?.clientWidth || 1280;
        const containerH = containerRef.current?.clientHeight || 720;
        const targetPan = { x: prevPan.x + nextVx, y: prevPan.y + nextVy };
        const clamped = clampPanZoom(
          targetPan,
          zoom,
          { width: containerW, height: containerH },
          0.35,
          3.20,
          mainMode === 'musicalidades' && isRadioOpen
        );
        return clamped.pan;
      });

      inertiaRafRef.current = requestAnimationFrame(stepInertia);
    };

    inertiaRafRef.current = requestAnimationFrame(stepInertia);
  }, [zoom, stopInertia, mainMode]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      stopInertia();
      if (stateLeaveTimeoutRef.current) clearTimeout(stateLeaveTimeoutRef.current);
      if (stateHoverDwellTimeoutRef.current) clearTimeout(stateHoverDwellTimeoutRef.current);
      if (countryLeaveTimeoutRef.current) clearTimeout(countryLeaveTimeoutRef.current);
      if (anchorTimerRef.current) clearTimeout(anchorTimerRef.current);
    };
  }, [stopInertia]);

  // Identificador do estado isolado em foco (unificado para todos os modos)
  const activeIsolatedStateId =
    selectedTerritoryStateId ||
    (activeCartographyLayer && activeCartographyLayer !== 'none' && selectedStateId ? selectedStateId : null) ||
    (isClimateActive && selectedClimateStateId) ||
    (mainMode === 'biodiversidade' && selectedBiodiversityStateId) ||
    (mainMode === 'geopolitica' && (selectedGeopoliticaStateId || selectedStateId)) ||
    (mainMode === 'musicalidades' && selectedStateId) ||
    (mainMode === 'aventura' && selectedStateId) ||
    null;

  // Mouse drag handlers on map stage with momentum sampling (Supports Left Click, Middle / Scroll Button, and Right Click)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
    if (isEnteringScene) return;
    // Quando qualquer estado estiver isolado em qualquer modo, bloqueia arrasto no mapa até o 'X' ser acionado
    if (activeIsolatedStateId) return;

    stopInertia();
    if (stateHoverDwellTimeoutRef.current) {
      clearTimeout(stateHoverDwellTimeoutRef.current);
      stateHoverDwellTimeoutRef.current = null;
    }
    if (isDwellZoomedRef.current) {
      isDwellZoomedRef.current = false;
      basePreDwellPanRef.current = null;
      basePreDwellZoomRef.current = null;
    }
    isMouseDownRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;

    const now = performance.now();
    currentMousePosRef.current = { x: e.clientX, y: e.clientY };
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    recentMouseSamplesRef.current = [{ x: e.clientX, y: e.clientY, time: now }];
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    currentMousePosRef.current = { x: e.clientX, y: e.clientY };
    setMousePos({ x: e.clientX, y: e.clientY });

    if (!isDragging) return;
    if (activeIsolatedStateId) return;
    const now = performance.now();

    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

    // Record sample points for release inertia calculation
    const samples = recentMouseSamplesRef.current;
    samples.push({ x: e.clientX, y: e.clientY, time: now });
    if (samples.length > 5) samples.shift();

    const totalDx = Math.abs(e.clientX - mouseDownPosRef.current.x);
    const totalDy = Math.abs(e.clientY - mouseDownPosRef.current.y);
    if (totalDx > 4 || totalDy > 4) {
      hasMovedRef.current = true;
    }

    const targetPan = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    applyClampedPanZoom(targetPan, zoom);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    isMouseDownRef.current = false;
    setIsDragging(false);
    baseUserPanRef.current = { ...pan };
    baseUserZoomRef.current = zoom;

    // Calculate release inertia from recent movement samples
    const samples = recentMouseSamplesRef.current;
    if (samples.length >= 2) {
      const last = samples[samples.length - 1];
      const prev = samples[Math.max(0, samples.length - 4)];
      const dt = last.time - prev.time;
      const timeSinceLast = performance.now() - last.time;

      // Only flick if mouse was actively moving within 100ms of release
      if (dt > 8 && timeSinceLast < 100) {
        let vx = ((last.x - prev.x) / dt) * 16.67;
        let vy = ((last.y - prev.y) / dt) * 16.67;
        const maxSpeed = 38;
        const speed = Math.hypot(vx, vy);
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }

        if (speed > 0.8) {
          currentInertiaVelRef.current = { vx, vy };
          startInertiaGlide();
        }
      }
    }

    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  // Ultra-fluid focal scroll wheel zoom anchored directly at the mouse cursor position
  const handleWheel = useCallback((e: WheelEvent | React.WheelEvent) => {
    const target = (e.target as HTMLElement | null);

    // If mouse wheel is over any modal, dialog, scrollable window, allow native scrolling!
    const isOverScrollable = Boolean(
      target?.closest?.(
        '.modal-dialog-climatologia-estado, #dialog-climatologia-estado, [data-scrollable], .overflow-y-auto, .overflow-x-auto, [role="dialog"], .dialog-overlay, .modal-backdrop, .modal-conteudo, .scrollbar-thin'
      )
    );
    if (isOverScrollable) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }
    if (isEnteringScene) return;
    // Quando qualquer estado estiver isolado em qualquer modo, bloqueia zoom do mapa para manter foco até 'X' ser acionado
    if (activeIsolatedStateId) return;

    stopInertia();
    if (stateHoverDwellTimeoutRef.current) {
      clearTimeout(stateHoverDwellTimeoutRef.current);
      stateHoverDwellTimeoutRef.current = null;
    }
    if (isDwellZoomedRef.current) {
      isDwellZoomedRef.current = false;
      basePreDwellPanRef.current = null;
      basePreDwellZoomRef.current = null;
    }
    lastWheelTimeRef.current = performance.now();
    setTransitionMode('wheel');
    const isZoomIn = e.deltaY < 0;
    const zoomFactor = isZoomIn ? 1.12 : 0.89;

    const containerEl = containerRef.current;
    const rect = containerEl ? containerEl.getBoundingClientRect() : { left: 0, top: 0, width: 1280, height: 720 };
    const mouseScreenX = e.clientX - rect.left;
    const mouseScreenY = e.clientY - rect.top;
    const containerW = rect.width || 1280;
    const containerH = rect.height || 720;
    
    setZoom((prevZoom) => {
      const targetZoom = Math.max(0.35, Math.min(3.2, prevZoom * zoomFactor));
      const anchoredPan = calculateAnchoredZoomPan(
        pan,
        prevZoom,
        targetZoom,
        { x: mouseScreenX, y: mouseScreenY },
        { width: containerW, height: containerH }
      );
      const clamped = clampPanZoom(
        anchoredPan,
        targetZoom,
        { width: containerW, height: containerH },
        0.35,
        3.20,
        mainMode === 'musicalidades' && isRadioOpen
      );
      setPan(clamped.pan);
      baseUserPanRef.current = clamped.pan;
      baseUserZoomRef.current = clamped.zoom;
      return clamped.zoom;
    });
  }, [isEnteringScene, stopInertia, pan, mainMode, isClimateActive, selectedClimateStateId, selectedBiodiversityStateId]);

  // Native non-passive wheel event listener ensuring 100% reliable wheel zooming across all browser layouts
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isGlobe3DActive) return;

    const onWheelNative = (e: WheelEvent) => {
      handleWheel(e);
    };

    el.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelNative);
    };
  }, [handleWheel, isGlobe3DActive, mainMode]);

  // Background canvas click: When clicking ocean/background (not on states or UI), deselect all states and close radio
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current || isDragging || isEnteringScene) return;
    // No modo de análise de clima com foco/diálogo aberto ou biodiversidade com diálogo aberto, cliques fora do mapa NÃO fecham o modo!
    if ((isClimateActive && selectedClimateStateId) || (mainMode === 'biodiversidade' && selectedBiodiversityStateId)) {
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a') ||
      target.closest('.painel-app-radio-vintage') ||
      target.closest('.btn-reabrir-radio-flutuante') ||
      target.closest('.card-musical-estado-mapa') ||
      target.closest('.gizmo-compass-hud') ||
      target.closest('.painel-legenda-coropletica') ||
      target.closest('.painel-observatorio-ambiental') ||
      target.closest('.painel-controle-biodiversidade') ||
      target.closest('.modal-dialog-biodiversidade-estado') ||
      target.closest('.painel-controle-geopolitica') ||
      target.closest('.modal-dialog-geopolitica-estado') ||
      target.closest('.card-guardiao-standee') ||
      target.closest('.state-territory-dialog') ||
      target.closest('.menu-lateral-interativo') ||
      target.closest('.painel-territorio-lateral') ||
      target.closest('.pin-brasao-estado')
    ) {
      return;
    }

    // Se o clique foi especificamente em um polígono de estado do Brasil ou balão interativo, o handler respectivo cuida
    if (
      target.closest('.camada-vetorial-estados') ||
      target.closest('[id^="state-path-"]') ||
      target.closest('.grupo-titulos-bacias-mapa') ||
      target.closest('.grupo-bolhas-biomas-ibge') ||
      target.closest('.grupo-rota-integracao') ||
      target.closest('.marcador-porto-maritimo')
    ) {
      return;
    }

    // Se uma região, subitem ou estado estiver selecionado: ao clicarmos fora do Mapa do Brasil, restauramos a visão geral!
    const isAnyRegionOrStateSelected = Boolean(
      selectedStateId ||
      selectedTerritoryStateId ||
      selectedTerritorySubitemId ||
      selectedCountry ||
      selectedBiodiversityStateId ||
      selectedGeopoliticaStateId
    );

    if (isAnyRegionOrStateSelected) {
      audioEngine.playSfx('click');
      setSelectedStateId(null);
      setSelectedTerritoryStateId(null);
      onSelectStateId?.(null);
      onSelectTerritorySubitem?.(null);
      setSelectedCountry(null);
      setSelectedBiodiversityStateId(null);
      setSelectedGeopoliticaStateId(null);
      setHoveredStateId(null);
      if (onHoverStateChange) {
        onHoverStateChange(null);
      }

      // Se a camada de território estiver ativa, reabre o submenu lateral
      if (activeCartographyLayer && activeCartographyLayer !== 'none') {
        onOpenTerritorySubmenu?.();
      }

      // Restaura a visão geral e centraliza o mapa do Brasil
      const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
        stateId: 'RESET_CENTRAL_BRAZIL',
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: false,
      });
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;

      if (mainMode === 'musicalidades') {
        if (isRadioOpen && onToggleRadio) {
          onToggleRadio();
        }
      }
      return;
    }
  };

  // Transição suave para a cena do Guardião RPG
  const handleEnterGuardianScene = useCallback((stateId: string) => {
    const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
    if (guardian) {
      setEnteringGuardianName(guardian.stateNamePt);
      setIsEnteringScene(true);
      setTransitionMode('entry');

      const centroid = centroids[stateId];
      if (centroid) {
        const targetZoom = 2.5;
        const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
        setPan(targetPan);
        setZoom(targetZoom);
      }

      setTimeout(() => {
        onSelectGuardian(guardian);
      }, 1400);
    }
  }, [centroids, is3D, onSelectGuardian]);

  // State selection: Behavior is customized independently per mode
  const handleStateClick = useCallback((stateId: string) => {
    if (hasMovedRef.current || isDragging || isEnteringScene) return;
    // Se um estado já está isolado, impede navegação para outro estado até que 'X' seja acionado
    if (activeIsolatedStateId && activeIsolatedStateId !== stateId) return;
    stopInertia();

    const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
    const centroid = centroids[stateId];

    // 0. MODO TERRITÓRIO & REDES VIVAS (Bacias, Biomas, Rotas e Censo Demográfico)
    // Caso o usuário clique em apenas um Estado: isolamos a Bacia ou agrupamento ao qual ele pertence + AppLateral com dados corretos
    if (activeCartographyLayer && activeCartographyLayer !== 'none') {
      if (selectedStateId === stateId) {
        // Deseleção com segundo clique restaura a visão geral
        setSelectedStateId(null);
        setSelectedTerritoryStateId(null);
        onSelectStateId?.(null);
        onSelectTerritorySubitem?.(null);
        onOpenTerritorySubmenu?.();
        const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
          stateId: 'RESET_CENTRAL_BRAZIL',
          containerWidth: getContainerWidth(),
          is3D,
          isPanelOpen: false,
        });
        setTransitionMode('button');
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
        audioEngine.playSfx('click');
        return;
      }

      // Identifica a Bacia, Bioma ou Rota ao qual o estado pertence:
      let groupingId: string | null = null;
      if (activeCartographyLayer === 'bacias_hidrograficas') {
        groupingId = STATE_PRIMARY_BASIN[stateId] || null;
      } else if (activeCartographyLayer === 'biomas_relevo') {
        groupingId = STATE_PRIMARY_BIOME[stateId] || null;
      } else if (activeCartographyLayer === 'rotas_integracao') {
        groupingId = STATE_PRIMARY_ROUTE[stateId] || null;
      }

      if (groupingId) {
        onSelectTerritorySubitem?.(groupingId);
      }

      // Ao abrir o AppLateral, fecha os submenus (garante que AppLateral e Menu Lateral não fiquem abertos juntos)
      onCloseTerritorySubmenu?.();

      if (propIsObservatorioOpen && onToggleObservatorio) {
        onToggleObservatorio();
      }
      setInternalIsClimatePanelOpen(false);
      setSelectedClimateStation(null);
      setSelectedClimateStateId(null);
      setSelectedBiodiversityStateId(null);
      setSelectedGeopoliticaStateId(null);

      const { targetZoom, targetPan } = centralizarZoomMapa('geopolitica', {
        stateId,
        centroid,
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: true,
        isExpanded: true,
      });

      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;

      setSelectedStateId(stateId);
      setSelectedTerritoryStateId(stateId);
      onSelectStateId?.(stateId);
      audioEngine.playSfx('travel');
      return;
    }

    // 1. MODO CLIMA: Abre o diálogo de clima local e foca na telemetria (50% da tela)
    // Desmarca e fecha o Observatório e telemetrias flutuantes para não poluir a tela junto com o App Lateral
    if (isClimateActive || mainMode === 'clima') {
      if (propIsObservatorioOpen && onToggleObservatorio) {
        onToggleObservatorio();
      }
      setInternalIsClimatePanelOpen(false);
      setSelectedClimateStation(null);

      const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
        stateId,
        centroid,
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: true,
      });

      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;

      setSelectedStateId(stateId);
      setSelectedClimateStateId(stateId);
      audioEngine.playSfx('travel');
      return;
    }

    // 1.5. MODO BIODIVERSIDADE: Abre o diálogo de biodiversidade do estado e foca na região considerando os 50% de largura
    // Desmarca e fecha o Painel geral de Biodiversidade para não sobrepor o App Lateral do Estado
    if (mainMode === 'biodiversidade') {
      if (propIsBiodiversityPanelOpen && onToggleBiodiversityPanel) {
        onToggleBiodiversityPanel();
      }
      setInternalIsBiodiversityPanelOpen(false);

      const { targetZoom, targetPan } = centralizarZoomMapa('biodiversidade', {
        stateId,
        centroid,
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: true,
      });

      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;

      setSelectedStateId(stateId);
      setSelectedBiodiversityStateId(stateId);
      audioEngine.playSfx('travel');
      return;
    }

    // 1.6. MODO GEOPOLÍTICA: Abre o painel lateral de geopolítica/demografia e centraliza no espaço restante
    // Desmarca e fecha o Painel geral de Geopolítica para não sobrepor o App Lateral do Estado
    if (mainMode === 'geopolitica') {
      if (propIsGeopoliticaPanelOpen && onToggleGeopoliticaPanel) {
        onToggleGeopoliticaPanel();
      }
      setInternalIsGeopoliticaPanelOpen(false);

      const { targetZoom, targetPan } = centralizarZoomMapa('geopolitica', {
        stateId,
        centroid,
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: true,
      });

      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;

      setSelectedStateId(stateId);
      setSelectedGeopoliticaStateId(stateId);
      audioEngine.playSfx('travel');
      return;
    }

    // 2. MODO MUSICALIDADES: Abre apenas o AppLateral Musical do Estado, fecha o rádio vintage para não sobrepor dois painéis e centraliza o mapa
    if (mainMode === 'musicalidades') {
      if (isRadioOpen && onToggleRadio) {
        onToggleRadio();
      }
      setSelectedStateId(stateId);
      setInternalIsBiodiversityPanelOpen(false);
      setInternalIsGeopoliticaPanelOpen(false);
      const { targetZoom, targetPan } = centralizarZoomMapa('musicalidades', {
        stateId,
        centroid,
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: true,
      });
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;

      audioEngine.playSfx('click');
      return;
    }

    // 3. MODO AVENTURA / BRQUEST: Ao clicar no estado, viaja direto para 'Desafiar Guardião' sem perguntas
    if (mainMode === 'aventura') {
      audioEngine.playSfx('travel');
      handleEnterGuardianScene(stateId);
      return;
    }

    // 4. MODO GERAL: Seleciona o estado com suavidade, mantendo navegação livre
    setSelectedStateId(stateId);
    audioEngine.playSfx('click');

    if (centroid) {
      const targetZoom = Math.max(zoom, 1.4);
      const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;
    }
  }, [activeCartographyLayer, activeIsolatedStateId, centroids, getContainerWidth, handleEnterGuardianScene, is3D, isClimateActive, isEnteringScene, isRadioOpen, mainMode, onToggleBiodiversityPanel, onToggleGeopoliticaPanel, onToggleObservatorio, onToggleRadio, propIsBiodiversityPanelOpen, propIsGeopoliticaPanelOpen, propIsObservatorioOpen, stopInertia, zoom]);

  // Close focus & return camera smoothly to centered full Brazil map
  const handleCloseInspection = useCallback(() => {
    setSelectedClimateStateId(null);
    setSelectedBiodiversityStateId(null);
    setSelectedGeopoliticaStateId(null);
    setSelectedTerritoryStateId(null);
    setSelectedStateId(null);
    onSelectStateId?.(null);
    if (activeCartographyLayer && activeCartographyLayer !== 'none') {
      onOpenTerritorySubmenu?.();
      onSelectTerritorySubitem?.(null);
      const { targetZoom, targetPan } = centralizarZoomMapa('clima', {
        stateId: 'RESET_CENTRAL_BRAZIL',
        containerWidth: getContainerWidth(),
        is3D,
        isPanelOpen: false,
      });
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;
      audioEngine.playMenuHover();
      return;
    }
    audioEngine.playMenuHover();

    if (mainMode === 'musicalidades') {
      if (isRadioOpen && onToggleRadio) {
        onToggleRadio();
      }
      const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
      setTransitionMode('button');
      setPan(defaultPan);
      setZoom(DEFAULT_BRAZIL_ZOOM);
      baseUserPanRef.current = defaultPan;
      baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
      return;
    }

    if (mainMode === 'biodiversidade' && isBiodiversityPanelOpen) {
      const { targetZoom, targetPan } = getBrazilOverviewFocusZoomAndPan(
        getContainerWidth(),
        is3D,
        isBiodiversityPanelExpanded
      );
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;
      return;
    }

    if (mainMode === 'geopolitica' && isGeopoliticaPanelOpen) {
      const { targetZoom, targetPan } = getBrazilOverviewFocusZoomAndPan(
        getContainerWidth(),
        is3D,
        isGeopoliticaPanelExpanded
      );
      setTransitionMode('button');
      setPan(targetPan);
      setZoom(targetZoom);
      baseUserPanRef.current = targetPan;
      baseUserZoomRef.current = targetZoom;
      return;
    }

    const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
    setTransitionMode('button');
    setPan(defaultPan);
    setZoom(DEFAULT_BRAZIL_ZOOM);
    baseUserPanRef.current = defaultPan;
    baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
  }, [is3D, mainMode, isBiodiversityPanelOpen, isBiodiversityPanelExpanded, isGeopoliticaPanelOpen, isGeopoliticaPanelExpanded, getContainerWidth]);

  // Global 'Escape' key listener to quickly dismiss state selection, inspection, or neighbor countries
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedClimateStateId || selectedBiodiversityStateId || selectedGeopoliticaStateId || selectedStateId) {
          handleCloseInspection();
        } else if (selectedCountry) {
          setSelectedCountry(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStateId, selectedCountry, selectedClimateStateId, selectedBiodiversityStateId, selectedGeopoliticaStateId, handleCloseInspection]);

  // Custom onEnter handler for Brazilian States: Highlights state, updates HUD & plays sound
  const handleStateEnter = useCallback((stateId: string) => {
    if (isMouseDownRef.current || hasMovedRef.current || isEnteringScene) return;
    if (activeIsolatedStateId) return;

    if (stateLeaveTimeoutRef.current) {
      clearTimeout(stateLeaveTimeoutRef.current);
      stateLeaveTimeoutRef.current = null;
    }

    if (hoveredStateIdRef.current === stateId) return;

    hoveredStateIdRef.current = stateId;
    setHoveredStateId(stateId);
    if (onHoverStateChange) {
      onHoverStateChange(stateId);
    }

    if (stateId && stateId !== lastSoundPlayedStateRef.current) {
      lastSoundPlayedStateRef.current = stateId;
      audioEngine.playMenuHover();
    }
  }, [isEnteringScene, onHoverStateChange, isClimateActive, selectedClimateStateId, mainMode, selectedBiodiversityStateId]);

  // Graceful debounce on leaving state
  const handleStateLeave = useCallback((stateId: string) => {
    if (isEnteringScene) return;
    if ((isClimateActive && selectedClimateStateId) || (mainMode === 'biodiversidade' && selectedBiodiversityStateId) || (mainMode === 'geopolitica' && selectedGeopoliticaStateId)) return;

    if (stateLeaveTimeoutRef.current) {
      clearTimeout(stateLeaveTimeoutRef.current);
    }
    stateLeaveTimeoutRef.current = setTimeout(() => {
      if (hoveredStateIdRef.current === stateId) {
        hoveredStateIdRef.current = null;
        setHoveredStateId(null);
        if (onHoverStateChange) {
          onHoverStateChange(null);
        }
        lastSoundPlayedStateRef.current = null;
      }
    }, 120);
  }, [isEnteringScene, onHoverStateChange, isClimateActive, selectedClimateStateId, mainMode, selectedBiodiversityStateId, selectedGeopoliticaStateId]);

  // Custom onEnter handler for South America Neighbor Countries: Fires ONCE upon entering
  const handleCountryEnter = useCallback((countryId: string) => {
    if (isMouseDownRef.current || hasMovedRef.current || isEnteringScene) return;
    if ((isClimateActive && selectedClimateStateId) || (mainMode === 'biodiversidade' && selectedBiodiversityStateId)) return;

    if (countryLeaveTimeoutRef.current) {
      clearTimeout(countryLeaveTimeoutRef.current);
      countryLeaveTimeoutRef.current = null;
    }

    if (hoveredCountryIdRef.current === countryId) return;

    hoveredCountryIdRef.current = countryId;
    setHoveredCountryId(countryId);

    if (countryId && countryId !== lastSoundPlayedCountryRef.current) {
      lastSoundPlayedCountryRef.current = countryId;
      audioEngine.playMenuHover();
    }
  }, [isEnteringScene, isClimateActive, selectedClimateStateId, mainMode, selectedBiodiversityStateId]);

  const handleCountryLeave = useCallback((countryId: string) => {
    if (isEnteringScene) return;
    if ((isClimateActive && selectedClimateStateId) || (mainMode === 'biodiversidade' && selectedBiodiversityStateId)) return;

    if (countryLeaveTimeoutRef.current) {
      clearTimeout(countryLeaveTimeoutRef.current);
    }
    countryLeaveTimeoutRef.current = setTimeout(() => {
      if (hoveredCountryIdRef.current === countryId) {
        hoveredCountryIdRef.current = null;
        setHoveredCountryId(null);
        lastSoundPlayedCountryRef.current = null;
      }
    }, 100);
  }, [isEnteringScene, isClimateActive, selectedClimateStateId, mainMode, selectedBiodiversityStateId]);

  // Centralizes viewport directly on Brazil (Acre to Paraíba / Roraima to RS) or South America if active
  // Suporta dois estados: a) Tela 100% disponível (sem painéis laterais); b) 50% de tela útil (quando algum app lateral estiver aberto)
  const handleResetView = useCallback((playSound = true) => {
    stopInertia();
    if (playSound) {
      audioEngine.playSfx('click');
    }
    setTransitionMode('button');
    hoveredStateIdRef.current = null;
    setHoveredStateId(null);
    setSelectedClimateStateId(null);
    setSelectedBiodiversityStateId(null);
    setSelectedGeopoliticaStateId(null);
    setSelectedStateId(null);
    if (onHoverStateChange) {
      onHoverStateChange(null);
    }
    setBaseTiltAngle(is3D ? 42 : 0);
    setHeadingAngle(0);

    // Detecta se qualquer painel lateral está ativo/aberto
    const isAnySidePanelOpen =
      (isClimateActive && isClimatePanelOpen) ||
      (mainMode === 'biodiversidade' && isBiodiversityPanelOpen) ||
      (mainMode === 'geopolitica' && isGeopoliticaPanelOpen);

    const isExpanded =
      (mainMode === 'biodiversidade' && isBiodiversityPanelExpanded) ||
      (mainMode === 'geopolitica' && isGeopoliticaPanelExpanded) ||
      true;

    const scenario = showNeighbors
      ? 'Centralizar Mapa mostrar Vizinhos'
      : isAnySidePanelOpen
      ? 'Centralizar Mapa com App Lateral'
      : 'Centralizar Mapa';

    const { targetZoom: finalZoom, targetPan: calculatedPan } = centralizarZoomMapa(mainMode, {
      containerWidth: getContainerWidth(),
      is3D,
      isPanelOpen: isAnySidePanelOpen,
      isExpanded,
      showNeighbors,
    });

    baseUserZoomRef.current = finalZoom;
    baseUserPanRef.current = calculatedPan;
    applyClampedPanZoom(calculatedPan, finalZoom);

    // Dispara animação sutil do ponto âncora em vermelho sobre o centro geodésico do Brasil (GO) por 1.0s
    setShowAnchorPoint(true);
    if (anchorTimerRef.current) clearTimeout(anchorTimerRef.current);
    anchorTimerRef.current = setTimeout(() => {
      setShowAnchorPoint(false);
    }, 1000);
  }, [
    stopInertia,
    is3D,
    showNeighbors,
    applyClampedPanZoom,
    mainMode,
    isClimateActive,
    isClimatePanelOpen,
    isBiodiversityPanelOpen,
    isBiodiversityPanelExpanded,
    isGeopoliticaPanelOpen,
    isGeopoliticaPanelExpanded,
    getContainerWidth,
    onHoverStateChange,
  ]);

  // Mathematical evaluation of whether the camera is currently centered
  const isMapCentered = useMemo(() => {
    const isAnySidePanelOpen =
      (isClimateActive && isClimatePanelOpen) ||
      (mainMode === 'biodiversidade' && isBiodiversityPanelOpen) ||
      (mainMode === 'geopolitica' && isGeopoliticaPanelOpen);

    const scenario = showNeighbors
      ? 'Centralizar Mapa mostrar Vizinhos'
      : isAnySidePanelOpen
      ? 'Centralizar Mapa com App Lateral'
      : 'Centralizar Mapa';

    const { targetZoom, targetPan } = centralizarZoomMapa(mainMode, {
      containerWidth: getContainerWidth(),
      is3D,
      isPanelOpen: isAnySidePanelOpen,
      showNeighbors,
    });

    const isPanNear = Math.abs(pan.x - targetPan.x) < 14 && Math.abs(pan.y - targetPan.y) < 14;
    const isZoomNear = Math.abs(zoom - targetZoom) < 0.05;
    const isAngleZero = headingAngle === 0;
    return isPanNear && isZoomNear && isAngleZero;
  }, [
    pan,
    zoom,
    headingAngle,
    showNeighbors,
    is3D,
    isClimateActive,
    isClimatePanelOpen,
    mainMode,
    isBiodiversityPanelOpen,
    isGeopoliticaPanelOpen,
    getContainerWidth,
  ]);

  // Re-alinhar suavemente quando o usuário alternar de modo no menu principal ou filtro regional
  const prevModeOrRegionRef = useRef<string>(`${mainMode}_${selectedRegionFilter}`);
  useEffect(() => {
    const key = `${mainMode}_${selectedRegionFilter}`;
    if (key !== prevModeOrRegionRef.current) {
      prevModeOrRegionRef.current = key;
      handleResetView(false);
    }
  }, [mainMode, selectedRegionFilter, handleResetView]);

  // Re-align ONLY when top menu "Centralizar Mapa" / "Focar Brasil" button is clicked (centerTrigger increments)
  const lastCenterTriggerRef = useRef<number>(centerTrigger || 0);
  useEffect(() => {
    if (centerTrigger !== undefined && centerTrigger > 0 && centerTrigger !== lastCenterTriggerRef.current) {
      lastCenterTriggerRef.current = centerTrigger;
      handleResetView(false);
    }
  }, [centerTrigger, handleResetView]);

  // Transição de câmera suave ao ativar/desativar o modo de Países Vizinhos / Continente Sul-Americano
  const prevShowNeighborsPropRef = useRef<boolean>(showNeighbors);
  useEffect(() => {
    if (prevShowNeighborsPropRef.current !== showNeighbors) {
      prevShowNeighborsPropRef.current = showNeighbors;
      stopInertia();
      setTransitionMode('button');
      if (showNeighbors) {
        // Ao ativar vizinhos: limpar seleção de estados, guardiões, biomas, geopolítica e estações do Brasil para foco exclusivo nos países
        setSelectedStateId(null);
        setSelectedGeopoliticaStateId(null);
        setSelectedBiodiversityStateId(null);
        setSelectedClimateStateId(null);
        setSelectedClimateStation(null);
        setSelectedCountry(null);
        setHoveredStateId(null);
        hoveredStateIdRef.current = null;

        // Zoom out suave parametrizado mantendo o Brasil no centro
        const { targetZoom: continentZoom, targetPan: continentPan } = centralizarZoomMapa(mainMode, {
          containerWidth: getContainerWidth(),
          is3D,
          showNeighbors: true,
        });
        baseUserZoomRef.current = continentZoom;
        applyClampedPanZoom(continentPan, continentZoom);
      } else {
        // Ao desativar: fechar modal de país e retornar suavemente ao zoom padrão do Brasil (1.14)
        setSelectedCountry(null);
        setSelectedGeopoliticaStateId(null);
        setSelectedBiodiversityStateId(null);
        setSelectedClimateStateId(null);
        setSelectedClimateStation(null);
        setHoveredStateId(null);
        hoveredStateIdRef.current = null;

        const { targetZoom: brazilZoom, targetPan: brazilPan } = centralizarZoomMapa(mainMode, {
          containerWidth: getContainerWidth(),
          is3D,
          showNeighbors: false,
        });
        baseUserZoomRef.current = brazilZoom;
        applyClampedPanZoom(brazilPan, brazilZoom);
      }
    }
  }, [showNeighbors, is3D, stopInertia, applyClampedPanZoom]);

  // Toggle South American Neighbor Countries & Flagpoles at 45°
  const handleToggleNeighbors = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const next = !showNeighbors;
    if (next) {
      setSelectedStateId(null);
      setSelectedGeopoliticaStateId(null);
      setSelectedBiodiversityStateId(null);
      setSelectedClimateStateId(null);
      setSelectedClimateStation(null);
      setSelectedCountry(null);
      setHoveredStateId(null);
      hoveredStateIdRef.current = null;
    }
    if (onToggleNeighbors) {
      onToggleNeighbors();
    } else {
      setInternalShowNeighbors(next);
    }
  };

  const handleResetNorth = () => {
    stopInertia();
    setTransitionMode('button');
    setHeadingAngle(0);
  };

  const handleSelectAnglePreset = (preset: MapAnglePreset) => {
    stopInertia();
    setTransitionMode('button');
    if (preset === '2d_flat') {
      setIs3D(false);
      setBaseTiltAngle(0);
      setHeadingAngle(0);
      setPan((currentPan) => ({ x: currentPan.x, y: 0 }));
    } else if (preset === 'iso_suave') {
      setIs3D(true);
      setBaseTiltAngle(30);
      setHeadingAngle(0);
      setPan((currentPan) => ({ x: currentPan.x, y: -25 }));
    } else if (preset === 'iso_classico') {
      setIs3D(true);
      setBaseTiltAngle(42);
      setHeadingAngle(0);
      setPan((currentPan) => ({ x: currentPan.x, y: -35 }));
    } else if (preset === 'perspectiva_3d') {
      setIs3D(true);
      setBaseTiltAngle(58);
      setHeadingAngle(-15);
      setPan((currentPan) => ({ x: currentPan.x, y: -45 }));
    }
  };

  const handleZoomIn = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const nextZoom = Math.min(3.2, zoom * 1.25);
    baseUserZoomRef.current = nextZoom;
    baseUserPanRef.current = pan;
    applyClampedPanZoom(pan, nextZoom);
  };

  const handleZoomOut = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const nextZoom = Math.max(0.35, zoom * 0.80);
    baseUserZoomRef.current = nextZoom;
    baseUserPanRef.current = pan;
    applyClampedPanZoom(pan, nextZoom);
  };

  const handleToggle3D = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const nextIs3D = !is3D;
    setIs3D(nextIs3D);
    setBaseTiltAngle(nextIs3D ? 42 : 0);
    // Smoothly re-adjust y optical pan for the new projection angle
    setPan((currentPan) => ({
      x: currentPan.x,
      y: nextIs3D ? currentPan.y - 35 : currentPan.y + 35,
    }));
  };

  const handleToggleGlobe3D = () => {
    audioEngine.playSfx('click');
    setIsGlobe3DActive((prev) => !prev);
  };

  const handleToggleAtmosphere = () => {
    audioEngine.playSfx('click');
    setAtmosphereEnabled((prev) => !prev);
  };

  const handleToggleMusic = () => {
    const next = !isMusicPlaying;
    setIsMusicPlaying(next);
    audioEngine.setSoundEnabled(next);
  };

  if (!geoData) {
    return <CompassLoadingScreen />;
  }

  // Dynamic CSS transition: slow, smooth LINEAR variations as requested (no aggressive easing curves)
  const isMovingWithPhysics = isDragging || isInertiaActiveRef.current;
  const stageTransition = isMovingWithPhysics
    ? 'none'
    : isEnteringScene || transitionMode === 'entry'
    ? 'transform 1800ms linear'
    : transitionMode === 'wheel'
    ? 'transform 200ms linear'
    : transitionMode === 'dwell'
    ? 'transform 2400ms linear'
    : transitionMode === 'hover'
    ? 'transform 1800ms linear'
    : 'transform 1200ms linear';

  // ----------------------------------------------------
  // RENDERIZAÇÃO UNIFICADA DO MAPA (AVENTURA, CLIMA & MUSICALIDADES)
  // ----------------------------------------------------
  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      onMouseDown={isGlobe3DActive ? undefined : handleMouseDown}
      onMouseMove={isGlobe3DActive ? undefined : handleMouseMove}
      onMouseUp={isGlobe3DActive ? undefined : handleMouseUp}
      onContextMenu={(e) => {
        // Suppress browser native context menu on the entire map
        e.preventDefault();
      }}
      onMouseLeave={() => {
        if (!isGlobe3DActive) {
          handleMouseUp();
          if (hoveredStateId) handleStateLeave(hoveredStateId);
          if (hoveredCountryId) handleCountryLeave(hoveredCountryId);
        }
      }}
      className={`container-canva-mapa-br container-mapa-br relative w-full h-full flex-1 overflow-hidden select-none cursor-default ${
        isGlobe3DActive ? 'modo-globo-3d-ativo' : ''
      }`}
      style={{
        perspective: '1600px',
        background:
          !isClimateActive && terrainProvider === 'voyager_parchment'
            ? 'radial-gradient(circle at 50% 50%, #fbf2df 0%, #eedbb8 30%, #dfc59b 55%, #b08f58 85%, #8c6a38 100%)'
            : mainMode === 'musicalidades'
            ? 'radial-gradient(circle at 50% 50%, #091a2e 0%, #061220 25%, #030b14 55%, #02060b 80%, #010306 100%)'
            : 'radial-gradient(circle at 50% 50%, #0e568e 0%, #0a3d68 25%, #062846 50%, #03172b 75%, #020d1c 95%)',
      }}
    >
      {/* 0. Seamless Full-Viewport Subtle Aged Paper Noise Overlay */}
      <div
        className="camada-ruido-oceano-global absolute inset-0 pointer-events-none z-0 mix-blend-overlay opacity-20 select-none"
        style={{
          backgroundImage: `url("${FINE_PAPER_NOISE_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
      {/* 1. Procedural SVG Filters Definition (Relief & Antique Parchment Paper) */}
      <ProceduralTerrainFilter />
      <ParchmentTextureFilter />

      {/* 3. Cinematic Zoom-In & Fade Veil (Triggered on State Click in Adventure mode) */}
      {isEnteringScene && (
        <div className="transicao-entrada-estado fixed inset-0 z-50 pointer-events-none bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <Compass className="w-12 h-12 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-amber-200 font-serif font-bold text-xl tracking-wider">
              Viajando para {enteringGuardianName}...
            </span>
          </div>
        </div>
      )}

      {/* 4. Top-Right Navigation & Zoom HUD (Standard across entire app: 2D Cartographic & 3D Globe mode) */}
      <TopRightNavigationDock
        onZoomIn={isGlobe3DActive ? () => setGlobeZoomInTrigger((c) => c + 1) : handleZoomIn}
        onZoomOut={isGlobe3DActive ? () => setGlobeZoomOutTrigger((c) => c + 1) : handleZoomOut}
        onResetView={isGlobe3DActive ? () => setGlobeCenterTrigger((c) => c + 1) : handleResetView}
        zoom={isGlobe3DActive ? 1.0 : zoom}
        onOpenDailyTips={onOpenDailyTips}
        dailyTipsUnreadCount={dailyTipsUnreadCount}
        onOpenEducatorPortal={() => setIsEducatorPortalOpen(true)}
        onOpenSearchSelector={onOpenSearchSelector}
        isUserLocatedActive={isUserLocatedActive}
        onClearUserLocation={onClearUserLocation}
        onStateLocated={(stateId, stateName, regionId) => {
          handleStateClick(stateId);
          if (!isGlobe3DActive && mainMode !== 'musicalidades') {
            const centroid = centroids[stateId];
            if (centroid) {
              const targetZoom = 2.2;
              const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
              setPan(targetPan);
              setZoom(targetZoom);
            }
          }
          onStateLocated?.(stateId, stateName, regionId);
        }}
        onNotification={onNotification}
      />

      {/* 4.5. Top HUD Celestial Orb (Sol / Lua de Brasília na HUD de Topo - apenas nos modos 2D/isométrico, oculto no Globo 3D) */}
      {!isGlobe3DActive && (
        <TopHudCelestialOrb
          enabled={atmosphereEnabled}
          timeOverride={timeOverride}
        />
      )}

      {/* 5. Choropleth Interactive Legend (Shown on 2D/2.5D Cartographic Mode in Adventure Mode) */}
      {!showNeighbors && !isGlobe3DActive && !isClimateActive && !isTerritoryModeActive && mainMode === 'aventura' && (
        <MapChoroplethLegend
          visualStyle={visualStyle}
          choroplethSubTheme={choroplethSubTheme}
          completedCount={completedSet.size}
        />
      )}

      {/* 6. UNBOXED FULL-BODY GUARDIAN NPC STANDEE (Adventure Mode only - Fixed on Right Side; Oculto em modo Território por isolamento de módulo) */}
      {!showNeighbors && !isClimateActive && !isTerritoryModeActive && mainMode === 'aventura' && (
        <IsolatedRightGuardianStandee
          activeStateId={hoveredStateId || selectedStateId || 'DF'}
          completedStateIds={completedSet}
          onSelectGuardian={onSelectGuardian}
        />
      )}

      {/* 7.5. MODO MUSICALIDADES: APLICAÇÃO AUTÔNOMA DO RÁDIO VINTAGE (Com 70% de Opacidade e Card Independente) */}
      {!showNeighbors && mainMode === 'musicalidades' && isRadioOpen && !selectedStateId && (
        <section
          id="coluna-radio-vintage-independente"
          className="coluna-radio-vintage-independente painel-split-radio-esquerda fixed left-2 right-2 sm:right-auto sm:left-[76px] md:left-[84px] lg:left-[88px] top-13 sm:top-15 md:top-[58px] bottom-8 sm:bottom-10 md:bottom-[42px] max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-96px)] z-30 pointer-events-auto flex flex-col min-h-0 cursor-default"
          aria-label="Aparelho e Reprodutor de Rádio Vintage do Brasil"
        >
          <VintageRadioPlayer
            selectedStateId={selectedStateId || hoveredStateId || 'DF'}
            activeCategory={activeMusicCategory}
            selectedRadioEraId={selectedRadioEraId}
            onSelectRadioEra={onSelectRadioEra}
            onSelectState={(stateId) => {
              setSelectedStateId(stateId);
              if (!isRadioOpen && onToggleRadio) {
                onToggleRadio();
              }
              const centroid = centroids[stateId];
              if (centroid) {
                setTransitionMode('button');
                const { targetZoom, targetPan } = getMusicalFocusZoomAndPan(
                  centroid,
                  getContainerWidth(),
                  is3D,
                  true,
                  stateId
                );
                setPan(targetPan);
                setZoom(targetZoom);
                baseUserPanRef.current = targetPan;
                baseUserZoomRef.current = targetZoom;
              }
            }}
            onClose={() => {
              if (onToggleRadio) onToggleRadio();
              setSelectedStateId(null);
              const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
              setTransitionMode('button');
              setPan(defaultPan);
              setZoom(DEFAULT_BRAZIL_ZOOM);
              baseUserPanRef.current = defaultPan;
              baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
            }}
          />
        </section>
      )}

      {/* 7.5.B MODO MUSICALIDADES: Ícone Grande Flutuante para Reabrir o Rádio (Sem background no ícone) */}
      {!showNeighbors && mainMode === 'musicalidades' && !isRadioOpen && onToggleRadio && (
        <div className="fixed left-3 sm:left-[80px] top-16 sm:top-18 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <button
            id="btn-reabrir-radio-flutuante"
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playSfx('click');
              onToggleRadio();
              const targetState = selectedStateId || 'DF';
              setSelectedStateId(targetState);
              const centroid = centroids[targetState];
              if (centroid) {
                setTransitionMode('button');
                const { targetZoom, targetPan } = getMusicalFocusZoomAndPan(
                  centroid,
                  getContainerWidth(),
                  is3D,
                  true,
                  targetState
                );
                setPan(targetPan);
                setZoom(targetZoom);
                baseUserPanRef.current = targetPan;
                baseUserZoomRef.current = targetZoom;
              }
            }}
            className="btn-reabrir-radio-flutuante flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/50 hover:border-amber-300 text-amber-300 hover:text-amber-200 shadow-[0_8px_30px_rgba(0,0,0,0.85)] cursor-pointer transition hover:scale-105 group active:scale-95"
            title="Abrir Gabinete & Acervo Musical"
          >
            {/* Ícone de Música Grande sem background */}
            <div className="flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-transform group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
              <Music className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.8} />
            </div>

            <div className="text-left font-serif">
              <div className="text-sm font-bold text-amber-200 leading-tight flex items-center gap-1.5 drop-shadow">
                <span>Musicalidades</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              </div>
              <div className="text-[11px] text-amber-300/80 font-sans tracking-wide">
                Gabinete & Acervo
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 8. Main Stage: Either Interactive 3D Sphere Globe (React Three Fiber) OR Cartographic 2.5D Map */}
      {isGlobe3DActive ? (
        <BrazilGlobeR3F
          completedStateIds={completedSet}
          hoveredStateId={hoveredStateId}
          selectedStateId={selectedStateId}
          onStateHover={(id) => (id ? handleStateEnter(id) : hoveredStateId && handleStateLeave(hoveredStateId))}
          onStateClick={handleStateClick}
          onSelectGuardian={onSelectGuardian}
          textureMode={globeTextureMode}
          cloudsEnabled={globeClouds}
          autoRotate={globeAutoRotate}
          showBorders={globeBorders}
          pinDisplayMode={globePinMode}
          timeOverride={timeOverride}
          focusedStateId={focusedStateId}
          centerTrigger={globeCenterTrigger || centerTrigger}
          zoomInTrigger={globeZoomInTrigger}
          zoomOutTrigger={globeZoomOutTrigger}
          isTelemetryOpen={isGlobeTelemetryOpen}
          onToggleTelemetry={onToggleGlobeTelemetry}
        />
      ) : (() => {
        const effectiveCartographyLayer = isTerritoryModeActive ? activeCartographyLayer : 'none';
        const effectiveIsClimateActive = Boolean(isClimateActive && mainMode === 'clima' && !isTerritoryModeActive);
        const effectiveIsBiodiversityActive = Boolean(mainMode === 'biodiversidade' && !isTerritoryModeActive);
        const effectiveIsGeopoliticaActive = Boolean(mainMode === 'geopolitica' && !isTerritoryModeActive);
        const effectiveIsAventuraActive = Boolean(mainMode === 'aventura' && !isTerritoryModeActive);
        const effectiveIsMusicalActive = Boolean(mainMode === 'musicalidades' && !isTerritoryModeActive);

        return (
          <div className="container-palco-globo-3d relative z-10 w-full h-full overflow-visible pointer-events-none">
            <div
              className="quadro-canvas-camadas absolute left-1/2 top-1/2 pointer-events-auto shrink-0"
              style={{
                width: MAP_CANVAS_WIDTH,
                height: MAP_CANVAS_HEIGHT,
                transform: `translate(-50%, -50%) translate3d(${pan.x}px, ${pan.y}px, 0px) rotateX(${sphericalAngles.rotateX}deg) rotateY(${sphericalAngles.rotateY}deg) rotateZ(${sphericalAngles.rotateZ}deg) scale(${zoom})`,
                transformStyle: 'preserve-3d',
                transformOrigin: '1280px 720px',
                transition: stageTransition,
              }}
            >
            {/* Layer 0: Seamless Infinite Procedural Ocean with Linear Gradient & Overlay Noise */}
            <ProceduralOceanCanvas
              mode={mainMode}
              isPlayingAnimation={true}
              isParchmentMode={!isTerritoryModeActive && terrainProvider === 'voyager_parchment'}
              isBiodiversityMode={effectiveIsBiodiversityActive}
              isMusicalMode={effectiveIsMusicalActive}
              isTerritoryMode={isTerritoryModeActive}
            />

            {/* Layer 0.1: Coastal Waves, Bathymetric Gradient & Heterogeneous Swell Shader */}
            <CoastalWavesCanvas
              enabled={wavesEnabled}
              mode={mainMode}
              isTerritoryMode={isTerritoryModeActive}
              waveSpeed={0.6}
              customBrazilGeo={geoData}
            />

            {/* Layer 1 & 2: D3 Clipped Map Tiles & States Layer (Base Terrain Plan Z=0) */}
            <div
              className="camada-base-terreno-wrapper absolute inset-0 z-10 pointer-events-none"
              style={{
                width: MAP_CANVAS_WIDTH,
                height: MAP_CANVAS_HEIGHT,
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <MapStatesLayer
                geoData={geoData}
                projection={projection}
                visualStyle={visualStyle}
                terrainProvider={terrainProvider}
                choroplethSubTheme={choroplethSubTheme}
                completedStateIds={completedSet}
                hoveredStateId={hoveredStateId}
                selectedStateId={selectedStateId}
                selectedRegionFilter={selectedRegionFilter}
                hoveredRegionFilter={hoveredRegionFilter}
                showNeighbors={showNeighbors}
                hoveredCountryId={hoveredCountryId}
                centroids={centroids}
                isClimateActive={effectiveIsClimateActive}
                climateMode={currentClimateMode}
                stateWeather={stateWeather}
                isGeopoliticaActive={effectiveIsGeopoliticaActive && !showNeighbors}
                geopoliticaMetric={geopoliticaMetric}
                activeCartographyLayer={effectiveCartographyLayer}
                selectedTerritorySubitemId={isTerritoryModeActive ? selectedTerritorySubitemId : null}
                focusedClimateStateId={effectiveIsClimateActive ? selectedClimateStateId : null}
                focusedBiodiversityStateId={effectiveIsBiodiversityActive ? selectedBiodiversityStateId : null}
                focusedGeopoliticsStateId={effectiveIsGeopoliticaActive ? selectedGeopoliticaStateId : null}
                focusedMusicalStateId={effectiveIsMusicalActive ? selectedStateId : null}
                focusedTerritoryStateId={isTerritoryModeActive ? (selectedTerritoryStateId || selectedStateId) : null}
                is3D={is3D}
                onStateEnter={handleStateEnter}
                onStateLeave={handleStateLeave}
                onStateClick={handleStateClick}
                onCountryEnter={handleCountryEnter}
                onCountryLeave={handleCountryLeave}
                onCountryClick={(country) => {
                  audioEngine.playSfx('click');
                  setSelectedCountry(country);
                }}
              />
            </div>

            {/* Layer 2.4: Camadas Cartográficas Ricas do Território (Exclusivo 2D e Aventura) */}
            {isTerritoryModeActive && (
              <div
                className="camada-territorio-wrapper absolute inset-0 pointer-events-none z-20"
                style={{
                  width: MAP_CANVAS_WIDTH,
                  height: MAP_CANVAS_HEIGHT,
                  transform: 'translateZ(10px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <TerritoryLayersOverlay
                  activeLayer={activeCartographyLayer}
                  hoveredStateId={hoveredStateId}
                  selectedStateId={selectedStateId}
                  selectedSubitemId={selectedTerritorySubitemId}
                  onSelectSubitem={onSelectTerritorySubitem}
                  onSelectState={handleStateClick}
                />
              </div>
            )}

            {/* Layer 2.5: Real-Time Climate Phenomena & Streamlines (Coplanar at Z=1px to align perfectly with base map without parallax duplication) */}
            <div style={{ transform: 'translateZ(1px)', transformStyle: 'preserve-3d', zIndex: 30 }}>
              <ClimatePhenomenaLayer
                active={effectiveIsClimateActive}
                mode={currentClimateMode}
                stations={climateStations}
                stateWeather={stateWeather}
                hoveredStateId={hoveredStateId}
                elNinoData={elNinoData}
                geoData={geoData}
                selectedStationId={selectedClimateStation?.id}
                onSelectStation={handleSelectClimateStation}
                speedMultiplier={climateSpeedMultiplier}
                dateTimeFormatted={climateDateTimeFormatted}
                focusedStateId={effectiveIsClimateActive ? selectedClimateStateId : null}
                disableHoverTooltip={true}
              />
            </div>

            {/* Layer 2.6: Rain Simulation & Rainfall Hotspots Ranking (Elevated at Z=60px) */}
            <div style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}>
              <RainSimulationLayer
                active={(!isTerritoryModeActive && rainSimEnabled) || (effectiveIsClimateActive && currentClimateMode === 'precipitacao_zcas')}
                stateWeather={stateWeather}
                tiltAngle={is3D ? baseTiltAngle : 0}
              />
            </div>

            {/* Layer 2.7: Atmospheric Cumulus Clouds & Shadows Layer (Elevated at Z=100px - PASSING ABOVE MAP) */}
            <div style={{ transform: 'translateZ(100px)', transformStyle: 'preserve-3d' }}>
              <AtmosphericCloudsLayer
                enabled={cloudsEnabled}
                speedMultiplier={climateSpeedMultiplier}
              />
            </div>

            {/* Layer 3: Guardian Heraldic Pins Layer with Coat of Arms & Dotted Campaign Path (Coplanar with map base at Z=0px) */}
            {!showNeighbors && effectiveIsAventuraActive && (
              <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
                <DottedCampaignPathLayer
                  centroids={centroids}
                  selectedCampaign={selectedRegionFilter || 'livre'}
                  completedStateIds={completedSet}
                  tiltAngle={sphericalAngles.rotateX}
                />
                <MapPinsLayer
                  centroids={centroids}
                  completedStateIds={completedSet}
                  hoveredStateId={hoveredStateId}
                  selectedStateId={selectedStateId}
                  is3D={is3D}
                  tiltAngle={sphericalAngles.rotateX}
                  onSelectGuardian={handleStateClick}
                  onStateEnter={handleStateEnter}
                  onStateLeave={handleStateLeave}
                  selectedCampaign={selectedRegionFilter}
                  mainMode={mainMode}
                />
              </div>
            )}

            {/* Layer 3.1: South America Neighbor Countries Flags on Masts tilted at 45° */}
            {showNeighbors && (
              <div style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}>
                <NeighborCountryPinsLayer
                  visible={showNeighbors}
                  hoveredCountryId={hoveredCountryId}
                  onCountryEnter={handleCountryEnter}
                  onCountryLeave={handleCountryLeave}
                  onSelectCountry={(country) => {
                    audioEngine.playSfx('click');
                    setSelectedCountry(country);
                  }}
                />
              </div>
            )}

            {/* Layer 3.2: Biodiversity Species Hotspots & Specimen Pins Layer */}
            {!showNeighbors && effectiveIsBiodiversityActive && (
              <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                <BiodiversityMapLayer
                  activeKingdomFilter={biodiversityKingdom}
                  activeBiomeFilter={biodiversityBiome}
                  threatenedOnly={isBiodiversityThreatenedOnly}
                  selectedStateId={selectedBiodiversityStateId || selectedStateId}
                  onSelectState={(stateId) => {
                    handleStateClick(stateId);
                  }}
                  onHoverState={(id) => (id ? handleStateEnter(id) : hoveredStateId && handleStateLeave(hoveredStateId))}
                  geoProjectFn={projection}
                  is3D={is3D}
                  hoveredStateId={hoveredStateId}
                  centroids={centroids}
                />
              </div>
            )}

            {/* Layer 3.3: Geopolitics & Demographics Map Pins Layer (Elevated at Z=30px for sharp readability) */}
            {!showNeighbors && mainMode === 'geopolitica' && (
              <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d', zIndex: 35 }}>
                <GeopoliticsMapLayer
                  activeMetric={geopoliticaMetric}
                  selectedStateId={selectedGeopoliticaStateId || selectedStateId}
                  hoveredStateId={hoveredStateId}
                  centroids={centroids}
                  onSelectState={(stateId) => {
                    handleStateClick(stateId);
                  }}
                  onHoverState={(id) => (id ? handleStateEnter(id) : hoveredStateId && handleStateLeave(hoveredStateId))}
                  geoProjectFn={projection}
                  is3D={is3D}
                />
              </div>
            )}


            {/* Layer 4: Procedural Atmosphere (Gaivotas, Névoa Mágica & Brilho Solar / Céu Noturno) */}
            <div style={{ transform: 'translateZ(120px)', transformStyle: 'preserve-3d' }}>
              <ProceduralAtmosphereLayer enabled={atmosphereEnabled} timeOverride={timeOverride} />
            </div>

            {/* Layer 5: Animated Anchor Point Reticle (Pivô de Rotação Fronteira GO • TO • MT em Vermelho por 1s) */}
            {showAnchorPoint && (
              <div
                className="pivo-anchor-point-brasil absolute pointer-events-none z-30 transition-opacity duration-300 animate-fadeIn"
                style={{
                  left: BRAZIL_MAP_PIVOT_CENTER[0],
                  top: BRAZIL_MAP_PIVOT_CENTER[1],
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Pulsing Red Radar Ping */}
                  <div className="absolute w-28 h-28 rounded-full border-2 border-red-500 animate-ping" />
                  <div className="absolute w-16 h-16 rounded-full border-2 border-red-500 bg-red-600/30 backdrop-blur-sm shadow-[0_0_25px_rgba(239,68,68,0.8)]" />
                  
                  {/* Red Crosshair Lines */}
                  <div className="absolute w-24 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444]" />
                  <div className="absolute h-24 w-0.5 bg-red-500 shadow-[0_0_10px_#ef4444]" />
                  <div className="absolute w-8 h-8 rounded-full border border-red-300" />
                  
                  {/* Center Ruby Red Point */}
                  <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-[0_0_18px_#ef4444]" />
                  
                  {/* Red Pill Label */}
                  <div className="absolute top-14 whitespace-nowrap px-3 py-1.5 rounded-lg bg-red-950/95 border border-red-500 text-red-200 font-serif font-bold text-xs shadow-2xl shadow-black flex items-center gap-1.5 animate-bounce">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    Pivô: Fronteira GO • TO • MT
                  </div>
                </div>
              </div>
            )}

            {/* Floating Close 'X' Button on Map next to highlighted state (Universal across all modes) */}
            {(() => {
              if (showNeighbors || !activeIsolatedStateId || !centroids[activeIsolatedStateId] || activeCartographyLayer !== 'none' || Boolean(propSelectedStateId || selectedStateId)) return null;
              const isBio = mainMode === 'biodiversidade';
              const isGeopol = mainMode === 'geopolitica';
              const isMusic = mainMode === 'musicalidades';

              const borderColor = isBio
                ? 'border-emerald-400 hover:border-emerald-300 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.75),0_8px_24px_rgba(0,0,0,0.9)]'
                : isGeopol
                ? 'border-cyan-400 hover:border-cyan-300 text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.75),0_8px_24px_rgba(0,0,0,0.9)]'
                : isMusic
                ? 'border-amber-400 hover:border-amber-300 text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.75),0_8px_24px_rgba(0,0,0,0.9)]'
                : 'border-cyan-400 hover:border-cyan-300 text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.75),0_8px_24px_rgba(0,0,0,0.9)]';

              const iconColor = isBio
                ? 'text-emerald-300'
                : isGeopol
                ? 'text-cyan-300'
                : isMusic
                ? 'text-amber-300'
                : 'text-cyan-300';

              const badgeMetricLabel = (() => {
                if (isClimateActive || mainMode === 'clima') {
                  const temp = stateWeather[activeIsolatedStateId]?.temperature;
                  return temp !== undefined ? `${Math.round(temp)}°` : 'Clima';
                }
                if (mainMode === 'biodiversidade') {
                  return 'Bioma';
                }
                if (mainMode === 'geopolitica') {
                  return 'Censo IBGE';
                }
                return 'Foco';
              })();

              return (
                <div
                  className="btn-fechar-foco-estado-flutuante absolute z-50 pointer-events-auto flex flex-col items-center gap-1.5 transition-transform hover:scale-105 animate-in fade-in zoom-in-75 duration-200 touch-manipulation"
                  style={{
                    left: centroids[activeIsolatedStateId][0] + 42,
                    top: centroids[activeIsolatedStateId][1] - 42,
                    transform: 'translate(-50%, -50%) translateZ(40px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <button
                    id="btn-fechar-foco-flutuante-mapa"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseInspection();
                    }}
                    className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 border-2 ${borderColor} hover:text-white cursor-pointer backdrop-blur-md transition-all font-mono text-xs font-black shadow-[0_8px_24px_rgba(0,0,0,0.85)]`}
                    title="Fechar foco no estado e centralizar o mapa do Brasil (Esc)"
                  >
                    <X
                      className={`w-4 h-4 ${iconColor} group-hover:rotate-90 transition-transform duration-200`}
                    />
                    <span className="text-[11px] pr-0.5 font-bold">Fechar Foco</span>
                  </button>

                  <div className="badge-flutuante-estado-metrica px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 font-mono text-[11px] font-black shadow-md flex items-center gap-1.5 backdrop-blur-md">
                    <span className="text-cyan-300 font-black">{activeIsolatedStateId}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300">{badgeMetricLabel}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        );
      })()}

      {/* 9. Interactive 3D Antique Compass Rose Gizmo HUD (With Inclination, Unified Legend & 3D Globe) */}
      {!isGlobe3DActive && !isClimateActive && (
        <GizmoCompassHUD
          headingAngle={headingAngle}
          pitchAngle={sphericalAngles.rotateX}
          onHeadingChange={(newHeading) => {
            setTransitionMode('drag');
            setHeadingAngle(Math.max(-45, Math.min(45, newHeading)));
          }}
          onPitchChange={(newPitch) => {
            setTransitionMode('button');
            setIs3D(newPitch > 0);
            setBaseTiltAngle(newPitch);
          }}
          onResetNorth={handleResetNorth}
          onSelectPreset={handleSelectAnglePreset}
          is3D={is3D}
          isGlobe3DActive={isGlobe3DActive}
          onToggleGlobe3D={handleToggleGlobe3D}
          activeCartographyLayer={activeCartographyLayer}
          visualStyle={visualStyle}
          choroplethSubTheme={choroplethSubTheme}
          completedCount={completedSet.size}
        />
      )}

      {/* 11. Modal de Detalhes do País Vizinho */}
      <NeighborCountryModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />

      {/* 12. Floating Climate & Meteorology Observatório Panel */}
      <ClimateControlPanel
        isOpen={!showNeighbors && !selectedClimateStateId && !selectedStateId && isClimatePanelOpen && isClimateActive}
        onClose={() => handleToggleClimate()}
        mode={currentClimateMode}
        onModeChange={handleClimateModeChange}
        stations={climateStations}
        elNinoData={elNinoData}
        selectedStation={selectedClimateStation}
        onSelectStation={handleSelectClimateStation}
        speedMultiplier={climateSpeedMultiplier}
        onSpeedMultiplierChange={setClimateSpeedMultiplier}
        onRefreshTelemetry={loadClimateData}
        isLoading={isClimateLoading}
        updatedAt={climateUpdatedAt}
        dateTimeFormatted={climateDateTimeFormatted}
        avgTempBrazil={avgTempBrazil}
        maxTempState={maxTempState}
        minTempState={minTempState}
        wavesEnabled={wavesEnabled}
        onToggleWaves={() => setWavesEnabled((prev) => !prev)}
        atmosphereEnabled={atmosphereEnabled}
        onToggleAtmosphere={handleToggleAtmosphere}
        cloudsEnabled={cloudsEnabled}
        onToggleClouds={() => setCloudsEnabled((prev) => !prev)}
        rainSimEnabled={rainSimEnabled}
        onToggleRainSim={() => setRainSimEnabled((prev) => !prev)}
        timeOverride={timeOverride}
        onTimeOverrideChange={setInternalTimeOverride}
      />

      {/* 13. Card de Telemetria Flutuante da Estação Selecionada */}
      {!showNeighbors && (!activeCartographyLayer || activeCartographyLayer === 'none') && !selectedClimateStateId && !selectedStateId && isClimateActive && selectedClimateStation && (
        <ClimateStationTelemetryCard
          station={selectedClimateStation}
          onClose={() => setSelectedClimateStation(null)}
          onCenterMap={() => handleSelectClimateStation(selectedClimateStation)}
        />
      )}

      {/* 13.6. Diálogo Completo de Climatologia, Relevos, Enchentes e Extremos Históricos (Ativado por Botão Esquerdo no Modo Clima) */}
      {!showNeighbors && (!activeCartographyLayer || activeCartographyLayer === 'none') && isClimateActive && selectedClimateStateId && (
        <StateClimateDialog
          stateId={selectedClimateStateId}
          weatherData={stateWeather[selectedClimateStateId]}
          allStatesWeather={stateWeather}
          lastUpdated={climateUpdatedAt || climateDateTimeFormatted}
          climateMode={currentClimateMode}
          onClose={handleCloseInspection}
          onToggleExpand={(expanded) => {
            const centroid = centroids[selectedClimateStateId];
            if (centroid) {
              const { targetZoom, targetPan } = getClimateFocusZoomAndPan(
                centroid,
                selectedClimateStateId,
                getContainerWidth(),
                is3D,
                expanded
              );
              setTransitionMode('button');
              setPan(targetPan);
              setZoom(targetZoom);
              baseUserPanRef.current = targetPan;
              baseUserZoomRef.current = targetZoom;
            }
          }}
        />
      )}

      {/* 13.7. Diálogo Completo de Biodiversidade do Estado (Fauna, Flora, Microorganismos, GBIF, IBAMA SisCITES & Wikipedia) */}
      {!showNeighbors && (!activeCartographyLayer || activeCartographyLayer === 'none') && mainMode === 'biodiversidade' && selectedBiodiversityStateId && (
        <StateBiodiversityDialog
          stateId={selectedBiodiversityStateId}
          onClose={handleCloseInspection}
          activeKingdomFilter={biodiversityKingdom}
          isThreatenedOnly={isBiodiversityThreatenedOnly}
          onToggleExpand={(expanded) => {
            const centroid = centroids[selectedBiodiversityStateId];
            if (centroid) {
              const { targetZoom, targetPan } = getBiodiversityFocusZoomAndPan(
                centroid,
                selectedBiodiversityStateId,
                getContainerWidth(),
                is3D,
                expanded
              );
              setTransitionMode('button');
              setPan(targetPan);
              setZoom(targetZoom);
              baseUserPanRef.current = targetPan;
              baseUserZoomRef.current = targetZoom;
            }
          }}
        />
      )}

      {/* 13.8. Painel Flutuante de Controle e Filtros de Biodiversidade */}
      <BiodiversityControlPanel
        isOpen={!showNeighbors && (!activeCartographyLayer || activeCartographyLayer === 'none') && !selectedBiodiversityStateId && !selectedStateId && isBiodiversityPanelOpen && mainMode === 'biodiversidade'}
        onClose={() => {
          if (onToggleBiodiversityPanel) {
            onToggleBiodiversityPanel();
          } else {
            setInternalIsBiodiversityPanelOpen(false);
          }
          if (mainMode === 'biodiversidade' && !selectedBiodiversityStateId) {
            const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
            setTransitionMode('button');
            setPan(defaultPan);
            setZoom(DEFAULT_BRAZIL_ZOOM);
            baseUserPanRef.current = defaultPan;
            baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
          }
        }}
        onToggleExpand={(expanded) => {
          setIsBiodiversityPanelExpanded(expanded);
          if (mainMode === 'biodiversidade' && !selectedBiodiversityStateId) {
            const { targetZoom, targetPan } = getBrazilOverviewFocusZoomAndPan(
              getContainerWidth(),
              is3D,
              expanded
            );
            setTransitionMode('button');
            setPan(targetPan);
            setZoom(targetZoom);
            baseUserPanRef.current = targetPan;
            baseUserZoomRef.current = targetZoom;
          }
        }}
        activeKingdom={biodiversityKingdom}
        onKingdomChange={handleBiodiversityKingdomChange}
        activeBiome={biodiversityBiome}
        onBiomeChange={handleBiodiversityBiomeChange}
        threatenedOnly={isBiodiversityThreatenedOnly}
        onToggleThreatenedOnly={handleToggleThreatenedOnly}
        endemicOnly={isBiodiversityEndemicOnly}
        onToggleEndemicOnly={handleToggleEndemicOnly}
        onOpenStateDetails={(stateId) => {
          if (onToggleBiodiversityPanel) {
            onToggleBiodiversityPanel();
          }
          setInternalIsBiodiversityPanelOpen(false);
          setSelectedBiodiversityStateId(stateId);
          handleStateClick(stateId);
        }}
        selectedStateId={selectedBiodiversityStateId || selectedStateId}
      />

      {/* 13.9. Diálogo Completo de Geopolítica e Demografia do Estado (Censo 2022, IBGE, TSE, Eleições & Saúde) */}
      {!showNeighbors && (!activeCartographyLayer || activeCartographyLayer === 'none') && mainMode === 'geopolitica' && selectedGeopoliticaStateId && (
        <StateGeopoliticsDialog
          stateId={selectedGeopoliticaStateId}
          onClose={handleCloseInspection}
          activeMetric={geopoliticaMetric}
          onToggleExpand={(expanded) => {
            const centroid = centroids[selectedGeopoliticaStateId];
            if (centroid) {
              const { targetZoom, targetPan } = getBiodiversityFocusZoomAndPan(
                centroid,
                selectedGeopoliticaStateId,
                getContainerWidth(),
                is3D,
                expanded
              );
              setTransitionMode('button');
              setPan(targetPan);
              setZoom(targetZoom);
              baseUserPanRef.current = targetPan;
              baseUserZoomRef.current = targetZoom;
            }
          }}
        />
      )}

      {/* 13.10. Painel Flutuante de Controle e Métricas Geopolíticas (Nacional, Regional, Estadual) */}
      <GeopoliticsControlPanel
        isOpen={(!activeCartographyLayer || activeCartographyLayer === 'none') && !selectedGeopoliticaStateId && !selectedStateId && isGeopoliticaPanelOpen && mainMode === 'geopolitica'}
        onClose={() => {
          if (onToggleGeopoliticaPanel) {
            onToggleGeopoliticaPanel();
          } else {
            setInternalIsGeopoliticaPanelOpen(false);
          }
          if (mainMode === 'geopolitica' && !selectedGeopoliticaStateId) {
            const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
            setTransitionMode('button');
            setPan(defaultPan);
            setZoom(DEFAULT_BRAZIL_ZOOM);
            baseUserPanRef.current = defaultPan;
            baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
          }
        }}
        onToggleExpand={(expanded) => {
          setIsGeopoliticaPanelExpanded(expanded);
          if (mainMode === 'geopolitica' && !selectedGeopoliticaStateId) {
            const { targetZoom, targetPan } = getBrazilOverviewFocusZoomAndPan(
              getContainerWidth(),
              is3D,
              expanded
            );
            setTransitionMode('button');
            setPan(targetPan);
            setZoom(targetZoom);
            baseUserPanRef.current = targetPan;
            baseUserZoomRef.current = targetZoom;
          }
        }}
        activeMetric={geopoliticaMetric}
        onMetricChange={handleGeopoliticaMetricChange}
        scope={geopoliticaScope}
        onScopeChange={setGeopoliticaScope}
        selectedStateId={selectedGeopoliticaStateId || selectedStateId}
        showNeighbors={showNeighbors}
        onToggleNeighbors={onToggleNeighbors}
        onSelectState={(stateId: string) => {
          if (onToggleGeopoliticaPanel) {
            onToggleGeopoliticaPanel();
          }
          setInternalIsGeopoliticaPanelOpen(false);
          setSelectedGeopoliticaStateId(stateId);
          handleStateClick(stateId);
        }}
      />

      {/* 13.5. Portal do Educador (BR Quest Edu - BNCC, Gestão de Turmas e Simulados ENEM) */}
      <EducatorPortalModal
        isOpen={isEducatorPortalOpen}
        onClose={() => setIsEducatorPortalOpen(false)}
        onSelectTrackState={(stateId: string) => {
          setSelectedStateId(stateId);
          handleStateClick(stateId);
        }}
      />

      {/* 13.6. AppLateral de Território e Redes Vivas (Bacias Hidrográficas, Biomas, Rotas de Integração & Censo) */}
      {activeCartographyLayer && activeCartographyLayer !== 'none' && (selectedTerritoryStateId || selectedStateId) && (
        <StateTerritoryDialog
          stateId={(selectedTerritoryStateId || selectedStateId)!}
          activeLayer={activeCartographyLayer}
          onClose={handleCloseInspection}
          onToggleExpand={(expanded) => {
            const currentId = selectedTerritoryStateId || selectedStateId;
            if (!currentId) return;
            const centroid = centroids[currentId];
            if (centroid) {
              const { targetZoom, targetPan } = centralizarZoomMapa('geopolitica', {
                stateId: currentId,
                centroid,
                containerWidth: getContainerWidth(),
                is3D,
                isPanelOpen: true,
                isExpanded: expanded,
              });
              setTransitionMode('button');
              setPan(targetPan);
              setZoom(targetZoom);
              baseUserPanRef.current = targetPan;
              baseUserZoomRef.current = targetZoom;
            }
          }}
        />
      )}

      {/* 13.7. AppLateral de Aventura & Guardiões (Perfil do Guardião, Biografia, Relíquias e Desafio RPG) */}
      {mainMode === 'aventura' && selectedStateId && (!activeCartographyLayer || activeCartographyLayer === 'none') && (
        <StateAdventureDialog
          stateId={selectedStateId}
          isCompleted={completedStateIds.includes(selectedStateId)}
          hasInsignia={completedStateIds.includes(selectedStateId)}
          onClose={handleCloseInspection}
          onEnterGuardianScene={(guardian) => {
            handleEnterGuardianScene(guardian.id);
          }}
          onToggleExpand={(expanded) => {
            const centroid = centroids[selectedStateId];
            if (centroid) {
              const { targetZoom, targetPan } = centralizarZoomMapa('geopolitica', {
                stateId: selectedStateId,
                centroid,
                containerWidth: getContainerWidth(),
                is3D,
                isPanelOpen: true,
                isExpanded: expanded,
              });
              setTransitionMode('button');
              setPan(targetPan);
              setZoom(targetZoom);
              baseUserPanRef.current = targetPan;
              baseUserZoomRef.current = targetZoom;
            }
          }}
        />
      )}

      {/* 13.8. AppLateral de Musicalidades (Rádios Retrô, Frequências kHz, Hinos Oficiais e Canções Tradicionais) */}
      {mainMode === 'musicalidades' && selectedStateId && (!activeCartographyLayer || activeCartographyLayer === 'none') && (
        <StateMusicDialog
          stateId={selectedStateId}
          selectedRadioEraId={selectedRadioEraId}
          onSelectState={handleStateClick}
          onClose={handleCloseInspection}
          onTuneState={(sId) => {
            if (onFocusStateHandled) {
              onFocusStateHandled();
            }
          }}
          onToggleExpand={(expanded) => {
            const centroid = centroids[selectedStateId];
            if (centroid) {
              const { targetZoom, targetPan } = centralizarZoomMapa('musicalidades', {
                stateId: selectedStateId,
                centroid,
                containerWidth: getContainerWidth(),
                is3D,
                isPanelOpen: true,
                isExpanded: expanded,
              });
              setTransitionMode('button');
              setPan(targetPan);
              setZoom(targetZoom);
              baseUserPanRef.current = targetPan;
              baseUserZoomRef.current = targetZoom;
            }
          }}
        />
      )}

      {/* 13.9. Balão de Informações Unificado OnHover dos Estados (Clima, Musicalidades, Geopolítica, Biodiversidade e Aventura) */}
      {!isGlobe3DActive && hoveredStateId && !selectedStateId && !showNeighbors && (
        <UnifiedStateHoverTooltip
          hoveredStateId={hoveredStateId}
          centroids={centroids}
          mainMode={mainMode}
          isClimateActive={Boolean((isClimateActive || mainMode === 'clima') && !isTerritoryModeActive)}
          climateMode={currentClimateMode}
          stateWeather={stateWeather}
          geopoliticaMetric={geopoliticaMetric}
          biodiversityKingdom={biodiversityKingdom}
          pan={pan}
          zoom={zoom}
          rotateX={is3D ? sphericalAngles.rotateX : 0}
          selectedStateId={selectedStateId}
          showNeighbors={showNeighbors}
          selectedRadioEraId={selectedRadioEraId}
          mousePos={mousePos}
          activeCartographyLayer={activeCartographyLayer}
        />
      )}

      {/* 14. Cursor Virtual Personalizado com Efeito Mão "Grab" / "Grabbing" e Tração Suave (Apenas modo 2D cartográfico) */}
      {!isGlobe3DActive && (
        <CustomCanvasCursor
          isDragging={isDragging}
          hoveredStateId={hoveredStateId}
          hoveredCountryId={hoveredCountryId}
          isDwellZoomed={isDwellZoomedRef.current}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};
