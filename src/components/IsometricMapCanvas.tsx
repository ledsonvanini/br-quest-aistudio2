import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { geoPath } from 'd3-geo';
import { GuardianData, Language } from '../types';
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
  calculateAnchoredZoomPan,
  DEFAULT_BRAZIL_ZOOM,
  MAP_CANVAS_WIDTH,
  MAP_CANVAS_HEIGHT,
} from '../lib/mapProjections';
import { MapVisualStyle, ChoroplethSubTheme } from '../lib/mapColorScales';

// Modular Sub-components
import { ProceduralTerrainFilter } from './map/ProceduralTerrainFilter';
import { ParchmentTextureFilter } from './map/ParchmentTextureFilter';
import { AgedParchmentOverlay } from './map/AgedParchmentOverlay';
import { ProceduralOceanCanvas } from './map/ProceduralOceanCanvas';
import { CoastalWavesCanvas } from './map/CoastalWavesCanvas';
import { AtmosphericCloudsLayer } from './map/AtmosphericCloudsLayer';
import { RainSimulationLayer } from './map/RainSimulationLayer';
import { ClimatePhenomenaLayer, ClimateMode } from './map/ClimatePhenomenaLayer';
import { ClimateControlPanel } from './map/ClimateControlPanel';
import { ClimateStationTelemetryCard } from './map/ClimateStationTelemetryCard';
import {
  fetchLiveClimateTelemetry,
  ClimateStationData,
  ElNinoIndexData,
  StateWeatherData,
} from '../services/climateService';
import { ProceduralAtmosphereLayer } from './map/ProceduralAtmosphereLayer';
import { TopHudCelestialOrb } from './map/TopHudCelestialOrb';
import { MapStatesLayer } from './map/MapStatesLayer';
import { MapPinsLayer } from './map/MapPinsLayer';
import { NeighborCountryPinsLayer } from './map/NeighborCountryPinsLayer';
import { NeighborCountryModal } from './map/NeighborCountryModal';
import { NeighborCountryData } from '../data/southAmericaNeighborsData';
import { TopRightNavigationDock } from './map/TopRightNavigationDock';
import { MapChoroplethLegend } from './map/MapChoroplethLegend';
import { MapStateCarousel } from './map/MapStateCarousel';
import { TerrainTileProvider } from './map/ClippedMapTilesLayer';
import { StateDetailsSidebar } from './map/StateDetailsSidebar';
import { BrazilGlobeR3F } from './map/BrazilGlobeR3F';
import { IsolatedLeftGuardianStandee } from './map/IsolatedLeftGuardianStandee';
import { CompassLoadingScreen } from './map/CompassLoadingScreen';
import { loadBrazilGeoData, getCachedGeoData } from '../lib/geoDataLoader';
import { GizmoCompassHUD, MapAnglePreset } from './map/GizmoCompassHUD';
import { VintageRadioPlayer } from './music/VintageRadioPlayer';
import { MusicalStateMapCard } from './music/MusicalStateMapCard';
import { vintageRadioEngine } from '../lib/vintageRadioEngine';
import { AppMainMode } from './TopGlobalNavMenu';
import { CustomCanvasCursor } from './map/CustomCanvasCursor';
import { Compass, LocateFixed, MapPin, Flag, Plus, Minus, X, Crosshair, RotateCcw, Radio } from 'lucide-react';

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
  wavesEnabled?: boolean;
  cloudsEnabled?: boolean;
  rainSimEnabled?: boolean;
  timeOverride?: 'auto' | 'day' | 'night';
  centerTrigger?: number;
  onHoverStateChange?: (stateId: string | null) => void;
  globeTextureMode?: 'nasa_satellite' | 'night_lights' | 'natural_earth';
  globeClouds?: boolean;
  globeAutoRotate?: boolean;
  globeBorders?: boolean;
  globePinMode?: 'all' | 'compact' | 'none';
}

export const IsometricMapCanvas: React.FC<Props> = ({
  completedStateIds,
  onSelectGuardian,
  onClimateActiveChange,
  mainMode = 'aventura',
  onSelectMainMode,
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
  wavesEnabled: propWavesEnabled,
  cloudsEnabled: propCloudsEnabled,
  rainSimEnabled: propRainSimEnabled,
  timeOverride: propTimeOverride,
  centerTrigger,
  onHoverStateChange,
  globeTextureMode = 'nasa_satellite',
  globeClouds = true,
  globeAutoRotate = false,
  globeBorders = true,
  globePinMode = 'all',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Visual Modes & Customization
  const [internalVisualStyle, setVisualStyle] = useState<MapVisualStyle>('tiles');
  const [internalTerrainProvider, setTerrainProvider] = useState<TerrainTileProvider>('shaded_relief');
  const [internalChoroplethSubTheme, setChoroplethSubTheme] = useState<ChoroplethSubTheme>('regions');
  
  const visualStyle = propVisualStyle !== undefined ? propVisualStyle : internalVisualStyle;
  const terrainProvider = propTerrainProvider !== undefined ? propTerrainProvider : internalTerrainProvider;
  const choroplethSubTheme = propChoroplethSubTheme !== undefined ? propChoroplethSubTheme : internalChoroplethSubTheme;

  const [is3D, setIs3D] = useState<boolean>(true);
  const [isGlobe3DActive, setIsGlobe3DActive] = useState<boolean>(false);
  const [internalAtmosphereEnabled, setAtmosphereEnabled] = useState<boolean>(true);
  const [internalWavesEnabled, setWavesEnabled] = useState<boolean>(true);
  const [internalCloudsEnabled, setCloudsEnabled] = useState<boolean>(true);
  const [internalRainSimEnabled, setRainSimEnabled] = useState<boolean>(false);

  const atmosphereEnabled = propAtmosphereEnabled !== undefined ? propAtmosphereEnabled : internalAtmosphereEnabled;
  const wavesEnabled = propWavesEnabled !== undefined ? propWavesEnabled : internalWavesEnabled;
  const cloudsEnabled = propCloudsEnabled !== undefined ? propCloudsEnabled : internalCloudsEnabled;
  const rainSimEnabled = propRainSimEnabled !== undefined ? propRainSimEnabled : internalRainSimEnabled;
  const [internalShowNeighbors, setInternalShowNeighbors] = useState<boolean>(false);
  const showNeighbors = propShowNeighbors !== undefined ? propShowNeighbors : internalShowNeighbors;
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<NeighborCountryData | null>(null);

  // Climate Phenomena & Live Meteorological Telemetry (Open-Meteo API)
  const [isClimateActive, setIsClimateActive] = useState<boolean>(mainMode === 'clima');
  const [internalIsClimatePanelOpen, setInternalIsClimatePanelOpen] = useState<boolean>(false);
  const isClimatePanelOpen = propIsObservatorioOpen !== undefined ? propIsObservatorioOpen : internalIsClimatePanelOpen;

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
      }
    }
    onClimateActiveChange?.(mainMode === 'clima');
  }, [mainMode, onClimateActiveChange]);

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
      setClimateStations(res.stations);
      setStateWeather(res.stateWeather);
      setElNinoData(res.elNino);
      setClimateUpdatedAt(res.updatedAt);
      setClimateDateTimeFormatted(res.dateTimeFormatted);
      setAvgTempBrazil(res.avgTempBrazil);
      setMaxTempState(res.maxTempState);
      setMinTempState(res.minTempState);
    } catch (e) {
      console.error('Failed to load climate telemetry:', e);
    } finally {
      setIsClimateLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClimateData();
  }, [loadClimateData]);

  const handleToggleClimate = () => {
    audioEngine.playSfx('click');
    if (onToggleObservatorio) {
      onToggleObservatorio();
    } else {
      setInternalIsClimatePanelOpen((prev) => !prev);
    }
  };

  // Camera Pan & Zoom States (Centered mathematically on Brazil with 30% wider zoom out: DEFAULT_BRAZIL_ZOOM = 0.56)
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
  const [selectedStateId, setSelectedStateId] = useState<string | null>('DF');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);
  const [showAnchorPoint, setShowAnchorPoint] = useState<boolean>(false);
  const anchorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus & Inspection Mode via Right-Click (Focus on State + Zoom for Reading)
  const [focusedInspectionState, setFocusedInspectionState] = useState<{
    id: string;
    name: string;
    region: string;
  } | null>(null);

  // GeoJSON Data (instant cache retrieval)
  const [geoData, setGeoData] = useState<any>(() => getCachedGeoData());

  // Set of completed IDs for O(1) lookups
  const completedSet = useMemo(() => new Set(completedStateIds), [completedStateIds]);

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

  // Focus and zoom smoothly on state if triggered by top menu telemetry pills
  useEffect(() => {
    if (focusedStateId && centroids[focusedStateId]) {
      setSelectedStateId(focusedStateId);
      setTransitionMode('button');
      const targetZoom = Math.min(2.0, Math.max(1.2, zoom));
      const targetPan = calculateStateCenterPan(centroids[focusedStateId], targetZoom, is3D);
      setPan(targetPan);
      setZoom(targetZoom);
      onFocusStateHandled?.();
    }
  }, [focusedStateId, centroids, is3D, onFocusStateHandled]);

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
        mainMode === 'musicalidades'
      );
      setPan(clamped.pan);
      setZoom(clamped.zoom);
    },
    [mainMode]
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
          mainMode === 'musicalidades'
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

  // Mouse drag handlers on map stage with momentum sampling (Supports Left Click, Middle / Scroll Button, and Right Click)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1 && e.button !== 2) return;
    if (isEnteringScene) return;

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

    if (!isDragging) return;
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
    e.preventDefault();
    if (isEnteringScene) return;
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
        mainMode === 'musicalidades'
      );
      setPan(clamped.pan);
      baseUserPanRef.current = clamped.pan;
      baseUserZoomRef.current = clamped.zoom;
      return clamped.zoom;
    });
  }, [isEnteringScene, stopInertia, pan, mainMode]);

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

    const target = e.target as HTMLElement;
    if (
      target.closest('path') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a') ||
      target.closest('.painel-app-radio-vintage') ||
      target.closest('.btn-reabrir-radio-flutuante') ||
      target.closest('.card-musical-estado-mapa') ||
      target.closest('.gizmo-compass-hud') ||
      target.closest('.painel-legenda-coropletica') ||
      target.closest('.painel-observatorio-ambiental') ||
      target.closest('.card-guardiao-standee')
    ) {
      return;
    }

    if (selectedStateId || focusedInspectionState || selectedCountry) {
      audioEngine.playSfx('click');
      setSelectedStateId(null);
      setFocusedInspectionState(null);
      setSelectedCountry(null);
      setHoveredStateId(null);
      if (onHoverStateChange) {
        onHoverStateChange(null);
      }
      if (mainMode === 'musicalidades' && isRadioOpen && onToggleRadio) {
        onToggleRadio();
      }
    }
  };

  // State selection: Clicks zoom in deeply onto the state's pulsing centroid as the pivot
  const handleStateClick = (stateId: string) => {
    if (hasMovedRef.current || isDragging || isEnteringScene) return;
    stopInertia();

    setSelectedStateId(stateId);
    audioEngine.playSfx('travel');

    // In Musical Heritage mode, tune radio, ensure radio is open, and focus camera smoothly without opening RPG scene
    if (mainMode === 'musicalidades') {
      if (!isRadioOpen && onToggleRadio) {
        onToggleRadio();
      }
      const centroid = centroids[stateId];
      if (centroid) {
        setTransitionMode('button');
        const targetZoom = Math.min(2.0, Math.max(1.1, zoom));
        const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
        setPan(targetPan);
        setZoom(targetZoom);
        baseUserPanRef.current = targetPan;
        baseUserZoomRef.current = targetZoom;
      }
      return;
    }

    const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
    if (guardian) {
      setEnteringGuardianName(guardian.stateNamePt);
      setIsEnteringScene(true);
      setTransitionMode('entry');

      // Lock onto the pulsing circle centroid of this state as the absolute pivot
      const centroid = centroids[stateId];
      if (centroid) {
        const targetZoom = 2.5;
        const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
        setPan(targetPan);
        setZoom(targetZoom);
      }

      // Transition smoothly into guardian details scene
      setTimeout(() => {
        onSelectGuardian(guardian);
      }, 1500);
    }
  };

  // Right-Click State Centralization & Inspection (Zooms into the center of the screen for reading)
  const handleStateRightClick = useCallback((stateId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isEnteringScene) return;
    stopInertia();

    const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
    const centroid = centroids[stateId];
    if (!centroid) return;

    // Small states get higher magnification for reading, large states get comfortable framing
    const isSmallState = ['DF', 'SE', 'AL', 'RJ', 'ES', 'PB', 'RN', 'SC'].includes(stateId);
    const isLargeState = ['AM', 'PA', 'MT', 'MG', 'BA'].includes(stateId);
    const targetZoom = isSmallState ? 2.3 : isLargeState ? 1.55 : 1.9;
    const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);

    setTransitionMode('button');
    setPan(targetPan);
    setZoom(targetZoom);
    baseUserPanRef.current = targetPan;
    baseUserZoomRef.current = targetZoom;

    setFocusedInspectionState({
      id: stateId,
      name: guardian ? guardian.stateNamePt : stateId,
      region: guardian ? guardian.regionId.replace('_', '-').toUpperCase() : '',
    });

    audioEngine.playSfx('travel');
  }, [centroids, is3D, isEnteringScene, stopInertia]);

  // Close focus & return camera smoothly to centered full Brazil map
  const handleCloseInspection = useCallback(() => {
    setFocusedInspectionState(null);
    audioEngine.playMenuHover();
    const defaultPan = getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, is3D);
    setTransitionMode('button');
    setPan(defaultPan);
    setZoom(DEFAULT_BRAZIL_ZOOM);
    baseUserPanRef.current = defaultPan;
    baseUserZoomRef.current = DEFAULT_BRAZIL_ZOOM;
  }, [is3D]);

  // Global 'Escape' key listener to quickly dismiss state selection, inspection, or neighbor countries
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedInspectionState) {
          handleCloseInspection();
        }
        if (selectedStateId) {
          setSelectedStateId(null);
        }
        if (selectedCountry) {
          setSelectedCountry(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedInspectionState, selectedStateId, selectedCountry, handleCloseInspection]);

  // Custom onEnter handler for Brazilian States: Highlights state, updates HUD & plays sound
  const handleStateEnter = useCallback((stateId: string) => {
    if (isMouseDownRef.current || hasMovedRef.current || isEnteringScene) return;

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
  }, [isEnteringScene, onHoverStateChange]);

  // Graceful debounce on leaving state
  const handleStateLeave = useCallback((stateId: string) => {
    if (isEnteringScene) return;

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
  }, [isEnteringScene, onHoverStateChange]);

  // Custom onEnter handler for South America Neighbor Countries: Fires ONCE upon entering
  const handleCountryEnter = useCallback((countryId: string) => {
    if (isMouseDownRef.current || hasMovedRef.current || isEnteringScene) return;

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
  }, [isEnteringScene]);

  const handleCountryLeave = useCallback((countryId: string) => {
    if (isEnteringScene) return;

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
  }, [isEnteringScene]);

  // Centralizes viewport directly on Brazil (Acre to Paraíba / Roraima to RS) or South America if active
  const handleResetView = useCallback((playSound = true) => {
    stopInertia();
    if (playSound) {
      audioEngine.playSfx('click');
    }
    setTransitionMode('button');
    hoveredStateIdRef.current = null;
    setHoveredStateId(null);
    if (onHoverStateChange) {
      onHoverStateChange(null);
    }
    setBaseTiltAngle(is3D ? 42 : 0);
    setHeadingAngle(0);
    const targetZoom = showNeighbors ? 0.40 : DEFAULT_BRAZIL_ZOOM;
    baseUserZoomRef.current = targetZoom;
    const basePan = showNeighbors
      ? getSouthAmericaMidpointPan(targetZoom, is3D)
      : getBrazilACtoPBMidpointPan(targetZoom, is3D);
    const radioShiftX = mainMode === 'musicalidades' && typeof window !== 'undefined' && window.innerWidth >= 1024 ? 140 : 0;
    const centeredPan = { x: basePan.x + radioShiftX, y: basePan.y };
    baseUserPanRef.current = centeredPan;
    applyClampedPanZoom(centeredPan, targetZoom);

    // Trigger glowing anchor point animation in RED over Goiás (GO) for exactly 1.0 second
    setShowAnchorPoint(true);
    if (anchorTimerRef.current) clearTimeout(anchorTimerRef.current);
    anchorTimerRef.current = setTimeout(() => {
      setShowAnchorPoint(false);
    }, 1000);
  }, [stopInertia, is3D, showNeighbors, applyClampedPanZoom, mainMode]);

  // Mathematical evaluation of whether the camera is currently centered
  const isMapCentered = useMemo(() => {
    const targetZoom = showNeighbors ? 0.40 : DEFAULT_BRAZIL_ZOOM;
    const defaultPan = showNeighbors
      ? getSouthAmericaMidpointPan(targetZoom, is3D)
      : getBrazilACtoPBMidpointPan(targetZoom, is3D);
    const isPanNear = Math.abs(pan.x - defaultPan.x) < 14 && Math.abs(pan.y - defaultPan.y) < 14;
    const isZoomNear = Math.abs(zoom - targetZoom) < 0.05;
    const isAngleZero = headingAngle === 0;
    return isPanNear && isZoomNear && isAngleZero;
  }, [pan, zoom, headingAngle, showNeighbors, is3D]);

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
      handleResetView(true);
    }
  }, [centerTrigger, handleResetView]);

  // Toggle South American Neighbor Countries & Flagpoles at 45°
  const handleToggleNeighbors = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const next = !showNeighbors;
    if (onToggleNeighbors) {
      onToggleNeighbors();
    } else {
      setInternalShowNeighbors(next);
    }
    if (next) {
      // Zoom out to show full South American continent
      const continentZoom = 0.40;
      baseUserZoomRef.current = continentZoom;
      const continentPan = getSouthAmericaMidpointPan(continentZoom, is3D);
      applyClampedPanZoom(continentPan, continentZoom);
    } else {
      // Zoom in to full Brazil view with 30% wider zoom out
      const brazilZoom = DEFAULT_BRAZIL_ZOOM;
      baseUserZoomRef.current = brazilZoom;
      const brazilPan = getBrazilACtoPBMidpointPan(brazilZoom, is3D);
      applyClampedPanZoom(brazilPan, brazilZoom);
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
      onWheel={isGlobe3DActive ? undefined : handleWheel}
      className={`container-canva-mapa-br container-mapa-br relative w-full h-full flex-1 overflow-hidden select-none ${
        isGlobe3DActive ? 'cursor-default' : 'cursor-none'
      }`}
      style={{
        perspective: '1600px',
        backgroundColor: !isClimateActive && terrainProvider === 'voyager_parchment' ? '#b08f58' : '#031526',
      }}
    >
      {/* 1. Procedural SVG Filters Definition (Relief & Antique Parchment Paper) */}
      <ProceduralTerrainFilter />
      <ParchmentTextureFilter />

      {/* 2. Full-Screen Aged Parchment Noise & Fiber Grain Overlay (No Grid Lines, Pure Vintage Texture) */}
      <AgedParchmentOverlay isParchmentMode={!isClimateActive && terrainProvider === 'voyager_parchment'} />

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

      {/* 4. Top-Right Navigation & Zoom HUD (Fixed on Row 1, alongside topMenu with no background strip) */}
      {!isGlobe3DActive && (
        <TopRightNavigationDock
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          zoom={zoom}
        />
      )}

      {/* 4.5. Top HUD Celestial Orb (Sol / Lua de Brasília na HUD de Topo com Difusão Atmosférica Orgânica) */}
      <TopHudCelestialOrb
        enabled={atmosphereEnabled}
        timeOverride={timeOverride}
      />

      {/* 5. Choropleth Interactive Legend (Shown on 2D/2.5D Cartographic Mode in Adventure Mode) */}
      {!isGlobe3DActive && !isClimateActive && mainMode === 'aventura' && (
        <MapChoroplethLegend
          visualStyle={visualStyle}
          choroplethSubTheme={choroplethSubTheme}
          completedCount={completedSet.size}
        />
      )}

      {/* 6. Dedicated Right Side State Details Panel (Adventure Mode only) */}
      {!isClimateActive && mainMode === 'aventura' && (
        <StateDetailsSidebar
          activeStateId={hoveredStateId}
          completedStateIds={completedSet}
          onSelectGuardian={onSelectGuardian}
        />
      )}

      {/* 7. UNBOXED FULL-BODY GUARDIAN NPC STANDEE (Adventure Mode only) */}
      {!isClimateActive && mainMode === 'aventura' && (
        <IsolatedLeftGuardianStandee
          activeStateId={hoveredStateId || selectedStateId}
          completedStateIds={completedSet}
          onSelectGuardian={onSelectGuardian}
        />
      )}

      {/* 7.5. MODO MUSICALIDADES: APLICAÇÃO AUTÔNOMA DO RÁDIO VINTAGE (Com 70% de Opacidade e Card Independente) */}
      {mainMode === 'musicalidades' && isRadioOpen && (
        <section
          id="coluna-radio-vintage-independente"
          className="coluna-radio-vintage-independente painel-split-radio-esquerda fixed left-3 sm:left-5 top-16 sm:top-18 bottom-12 sm:bottom-14 max-w-[calc(100vw-24px)] z-30 pointer-events-auto flex flex-col min-h-0"
          aria-label="Aparelho e Reprodutor de Rádio Vintage do Brasil"
        >
          <VintageRadioPlayer
            selectedStateId={selectedStateId || hoveredStateId || 'DF'}
            activeCategory={activeMusicCategory}
            selectedRadioEraId={selectedRadioEraId}
            onSelectRadioEra={onSelectRadioEra}
            onSelectState={(stateId) => {
              setSelectedStateId(stateId);
              const centroid = centroids[stateId];
              if (centroid) {
                setTransitionMode('button');
                const targetZoom = Math.min(2.0, Math.max(1.1, zoom));
                const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
                setPan(targetPan);
                setZoom(targetZoom);
                baseUserPanRef.current = targetPan;
                baseUserZoomRef.current = targetZoom;
              }
            }}
            onClose={onToggleRadio}
          />
        </section>
      )}

      {/* 7.5.B MODO MUSICALIDADES: Ícone Grande Flutuante para Reabrir o Rádio (Sem background no ícone) */}
      {mainMode === 'musicalidades' && !isRadioOpen && onToggleRadio && (
        <div className="fixed left-3 sm:left-5 top-16 sm:top-18 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <button
            id="btn-reabrir-radio-flutuante"
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playSfx('click');
              onToggleRadio();
            }}
            className="btn-reabrir-radio-flutuante flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/50 hover:border-amber-300 text-amber-300 hover:text-amber-200 shadow-[0_8px_30px_rgba(0,0,0,0.85)] cursor-pointer transition hover:scale-105 group active:scale-95"
            title="Abrir Rádio Nacional"
          >
            {/* Ícone de Rádio Grande sem background */}
            <div className="flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-transform group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
              <Radio className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.8} />
            </div>

            <div className="text-left font-serif">
              <div className="text-sm font-bold text-amber-200 leading-tight flex items-center gap-1.5 drop-shadow">
                <span>Rádio Nacional</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              </div>
              <div className="text-[11px] text-amber-300/80 font-sans tracking-wide">
                Clique para abrir
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 7.6. Card Flutuante com Informações Musicais e da Era do Estado em Hover/Seleção (Posicionado à Direita sem sobrepor o Rádio) */}
      {mainMode === 'musicalidades' && (
        <MusicalStateMapCard
          stateId={hoveredStateId || selectedStateId}
          selectedRadioEraId={selectedRadioEraId}
          onTuneState={(stateId) => {
            setSelectedStateId(stateId);
            vintageRadioEngine.playTuningDialSfx();
          }}
          onClose={() => {
            setSelectedStateId(null);
            setHoveredStateId(null);
          }}
        />
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
        />
      ) : (
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
            {/* Layer 0: Seamless Infinite Procedural Ocean (Game Engine Fluid Simulation) */}
            <ProceduralOceanCanvas
              isPlayingAnimation={true}
              isParchmentMode={!isClimateActive && terrainProvider === 'voyager_parchment'}
            />

            {/* Layer 0.1: Coastal Waves & Sea Foam Simulation */}
            <CoastalWavesCanvas enabled={wavesEnabled} />

            {/* Layer 1 & 2: D3 Clipped Map Tiles & States Layer (Base Terrain Plan Z=0) */}
            <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
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
                isClimateActive={isClimateActive}
                climateMode={currentClimateMode}
                stateWeather={stateWeather}
                is3D={is3D}
                onStateEnter={handleStateEnter}
                onStateLeave={handleStateLeave}
                onStateClick={handleStateClick}
                onStateContextMenu={handleStateRightClick}
                onCountryEnter={handleCountryEnter}
                onCountryLeave={handleCountryLeave}
                onCountryClick={(country) => {
                  audioEngine.playSfx('click');
                  setSelectedCountry(country);
                }}
              />
            </div>

            {/* Layer 2.5: Real-Time Climate Phenomena & Streamlines (Coplanar with map base at Z=0px) */}
            <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
              <ClimatePhenomenaLayer
                active={isClimateActive}
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
              />
            </div>

            {/* Layer 2.6: Rain Simulation & Rainfall Hotspots Ranking (Elevated at Z=60px) */}
            <div style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}>
              <RainSimulationLayer
                active={rainSimEnabled || (isClimateActive && currentClimateMode === 'precipitacao_zcas')}
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

            {/* Layer 3: Guardian Heraldic Pins Layer with Coat of Arms (Coplanar with map base at Z=0px) */}
            {!isClimateActive && (mainMode === 'aventura' || mainMode === 'musicalidades') && (
              <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
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
                  onStateContextMenu={handleStateRightClick}
                />
              </div>
            )}

            {/* Layer 3.1: South America Neighbor Countries Flags on Masts tilted at 45° (Adventure mode only) */}
            {!isClimateActive && mainMode === 'aventura' && (
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

            {/* Layer 4: Procedural Atmosphere (Gaivotas, Névoa Mágica & Brilho Solar / Céu Noturno) */}
            <div style={{ transform: 'translateZ(120px)', transformStyle: 'preserve-3d' }}>
              <ProceduralAtmosphereLayer enabled={atmosphereEnabled} timeOverride={timeOverride} />
            </div>

            {/* Layer 5: Animated Anchor Point Reticle (Pivô de Rotação Goiás - GO em Vermelho por 1s) */}
            {showAnchorPoint && (
              <div
                className="pivo-anchor-point-goias absolute pointer-events-none z-30 transition-opacity duration-300 animate-fadeIn"
                style={{
                  left: 1280,
                  top: 720,
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
                    Pivô: Goiás (GO)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. Interactive 3D Antique Compass Rose Gizmo HUD (With Inclination & 3D Globe) */}
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
        />
      )}

      {/* 11. Modal de Detalhes do País Vizinho */}
      <NeighborCountryModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />

      {/* 12. Floating Climate & Meteorology Observatório Panel */}
      <ClimateControlPanel
        isOpen={isClimatePanelOpen && isClimateActive}
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
      {isClimateActive && selectedClimateStation && (
        <ClimateStationTelemetryCard
          station={selectedClimateStation}
          onClose={() => setSelectedClimateStation(null)}
          onCenterMap={() => handleSelectClimateStation(selectedClimateStation)}
        />
      )}

      {/* 13.5. Banner Flutuante de Foco & Leitura do Estado (Ativado por Botão Direito) */}
      {focusedInspectionState && (
        <div
          id="banner-hud-foco-estado"
          className="banner-hud-foco-estado absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 px-4 py-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-400/80 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)] animate-in fade-in slide-in-from-top-3 duration-200 select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
              <Crosshair className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {focusedInspectionState.id}
                </span>
                <span className="text-sm font-serif font-bold text-amber-100 tracking-wide">
                  {focusedInspectionState.name}
                </span>
                {focusedInspectionState.region && (
                  <span className="text-[10px] text-amber-300/70 font-sans">
                    • Região {focusedInspectionState.region}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-amber-200/60 font-mono tracking-wider">
                Foco Topográfico & Leitura Centralizada
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-amber-500/30 mx-1 shrink-0" />

          <button
            id="btn-fechar-foco-estado"
            type="button"
            onClick={handleCloseInspection}
            className="btn-fechar-foco-estado flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 hover:border-amber-300 text-amber-200 text-xs font-serif font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Voltar a centralizar todo o Brasil (Esc)"
          >
            <X className="w-3.5 h-3.5 text-amber-300" />
            <span>Fechar</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-900/90 border border-amber-400/40 rounded text-amber-300 shadow-inner">
              Esc
            </kbd>
          </button>
        </div>
      )}

      {/* 14. Cursor Virtual Personalizado com Efeito Mão "Grab" / "Grabbing" e Tração Suave */}
      <CustomCanvasCursor
        isDragging={isDragging}
        hoveredStateId={hoveredStateId}
        hoveredCountryId={hoveredCountryId}
        isDwellZoomed={isDwellZoomedRef.current}
        containerRef={containerRef}
      />
    </div>
  );
};
