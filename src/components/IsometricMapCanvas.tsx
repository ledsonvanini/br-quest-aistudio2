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
import { Compass, LocateFixed, MapPin, Flag, Plus, Minus } from 'lucide-react';

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
  const isClimatePanelOpen = propIsObservatorioOpen !== undefined ? propIsObservatorioOpen : (internalIsClimatePanelOpen || isClimateActive);

  // Synchronize internal climate active state with global mainMode
  useEffect(() => {
    if (mainMode === 'clima') {
      setIsClimateActive(true);
      setInternalIsClimatePanelOpen(true);
      setInternalShowNeighbors(false);
      previousTerrainRef.current = terrainProvider;
      previousVisualStyleRef.current = visualStyle;
      setVisualStyle('tiles');
      setTerrainProvider('muted_gray');
    } else {
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
  const [pan, setPan] = useState<{ x: number; y: number }>(() => getBrazilACtoPBMidpointPan(DEFAULT_BRAZIL_ZOOM, true));
  const [zoom, setZoom] = useState<number>(DEFAULT_BRAZIL_ZOOM);
  const [baseTiltAngle, setBaseTiltAngle] = useState<number>(42);
  const [headingAngle, setHeadingAngle] = useState<number>(0);
  const [timeOverride, setTimeOverride] = useState<'auto' | 'day' | 'night'>('auto');

  // Transition Animation Mode: 'button' (400ms), 'hover' (750ms), or 'entry' (1500ms zoom-in to state)
  const [transitionMode, setTransitionMode] = useState<'drag' | 'hover' | 'button' | 'entry'>('button');
  const [isEnteringScene, setIsEnteringScene] = useState<boolean>(false);
  const [enteringGuardianName, setEnteringGuardianName] = useState<string>('');

  // Dynamic Spherical Globe Drag Physics & Velocity
  const [dragVelocity, setDragVelocity] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMousePosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const velocityRafRef = useRef<number | null>(null);

  // Drag & Gestures
  const isMouseDownRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const mouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover & Focus States (Stable: Zero camera movement on hover to prevent any glitch)
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const hoveredStateRef = useRef<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);
  const [showAnchorPoint, setShowAnchorPoint] = useState<boolean>(false);
  const anchorTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    return calculateSphericalGlobeAngles(pan, baseTiltAngle, dragVelocity, is3D, headingAngle);
  }, [pan, baseTiltAngle, dragVelocity, is3D, headingAngle]);

  // Kinetic Inertia Physics & Velocity Sampling
  const isInertiaActiveRef = useRef<boolean>(false);
  const inertiaRafRef = useRef<number | null>(null);
  const currentInertiaVelRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const recentMouseSamplesRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  // Hover Debounce Timers & Single-Sound Trigger Refs
  const hoveredStateIdRef = useRef<string | null>(null);
  const stateLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSoundPlayedStateRef = useRef<string | null>(null);

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
      const clamped = clampPanZoom(newPan, newZoom, { width: containerW, height: containerH });
      setPan(clamped.pan);
      setZoom(clamped.zoom);
    },
    []
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
        const clamped = clampPanZoom(targetPan, zoom, { width: containerW, height: containerH });
        return clamped.pan;
      });

      inertiaRafRef.current = requestAnimationFrame(stepInertia);
    };

    inertiaRafRef.current = requestAnimationFrame(stepInertia);
  }, [zoom, stopInertia]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      stopInertia();
      if (stateLeaveTimeoutRef.current) clearTimeout(stateLeaveTimeoutRef.current);
      if (countryLeaveTimeoutRef.current) clearTimeout(countryLeaveTimeoutRef.current);
      if (anchorTimerRef.current) clearTimeout(anchorTimerRef.current);
    };
  }, [stopInertia]);

  // Mouse drag handlers on map stage with momentum sampling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (isEnteringScene) return;

    stopInertia();
    isMouseDownRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;

    const now = performance.now();
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    recentMouseSamplesRef.current = [{ x: e.clientX, y: e.clientY, time: now }];
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setDragVelocity({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastMousePosRef.current.time);
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    // Track dynamic drag velocity for spherical globe roll
    const vx = (dx / dt) * 16;
    const vy = (dy / dt) * 16;
    setDragVelocity({
      x: Math.max(-20, Math.min(20, vx)),
      y: Math.max(-20, Math.min(20, vy)),
    });

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

  // Scroll wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isEnteringScene) return;
    stopInertia();
    setTransitionMode('button');
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.max(0.40, Math.min(3.5, zoom * zoomFactor));
    baseUserZoomRef.current = newZoom;
    applyClampedPanZoom(pan, newZoom);
  };

  // State selection: Clicks zoom in deeply onto the state's pulsing centroid as the pivot
  const handleStateClick = (stateId: string) => {
    if (hasMovedRef.current || isDragging || isEnteringScene) return;
    stopInertia();

    setSelectedStateId(stateId);
    audioEngine.playSfx('travel');

    // In Musical Heritage mode, tune radio and focus camera smoothly without opening RPG scene
    if (mainMode === 'musicalidades') {
      const centroid = centroids[stateId];
      if (centroid) {
        setTransitionMode('button');
        const targetZoom = Math.min(2.0, Math.max(1.1, zoom));
        const targetPan = calculateStateCenterPan(centroid, targetZoom, is3D);
        setPan(targetPan);
        setZoom(targetZoom);
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

  // Custom onEnter handler for Brazilian States: Fires ONCE upon entering, avoiding glitches and jitter
  const handleStateEnter = useCallback((stateId: string) => {
    if (isMouseDownRef.current || hasMovedRef.current || isEnteringScene) return;

    if (stateLeaveTimeoutRef.current) {
      clearTimeout(stateLeaveTimeoutRef.current);
      stateLeaveTimeoutRef.current = null;
    }

    if (hoveredStateIdRef.current === stateId) return;

    hoveredStateIdRef.current = stateId;
    setHoveredStateId(stateId);

    if (stateId && stateId !== lastSoundPlayedStateRef.current) {
      lastSoundPlayedStateRef.current = stateId;
      audioEngine.playMenuHover();
    }
  }, [isEnteringScene]);

  // Graceful debounce on leaving state (prevents rapid menu thrashing when crossing child elements)
  const handleStateLeave = useCallback((stateId: string) => {
    if (isEnteringScene) return;

    if (stateLeaveTimeoutRef.current) {
      clearTimeout(stateLeaveTimeoutRef.current);
    }
    stateLeaveTimeoutRef.current = setTimeout(() => {
      if (hoveredStateIdRef.current === stateId) {
        hoveredStateIdRef.current = null;
        setHoveredStateId(null);
        lastSoundPlayedStateRef.current = null;
      }
    }, 100);
  }, [isEnteringScene]);

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
  const handleResetView = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    hoveredStateIdRef.current = null;
    setHoveredStateId(null);
    setBaseTiltAngle(is3D ? 42 : 0);
    setHeadingAngle(0);
    setDragVelocity({ x: 0, y: 0 });
    const targetZoom = showNeighbors ? 0.48 : DEFAULT_BRAZIL_ZOOM;
    baseUserZoomRef.current = targetZoom;
    const centeredPan = showNeighbors
      ? getSouthAmericaMidpointPan(targetZoom, is3D)
      : getBrazilACtoPBMidpointPan(targetZoom, is3D);
    applyClampedPanZoom(centeredPan, targetZoom);

    // Trigger glowing anchor point animation in RED over Goiás (GO) for exactly 1.0 second
    setShowAnchorPoint(true);
    if (anchorTimerRef.current) clearTimeout(anchorTimerRef.current);
    anchorTimerRef.current = setTimeout(() => {
      setShowAnchorPoint(false);
    }, 1000);
  };

  // Re-alinhar suavemente sempre que o usuário alternar de modo no menu principal ou filtro regional
  useEffect(() => {
    handleResetView();
  }, [mainMode, selectedRegionFilter]);

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
      const continentZoom = 0.48;
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
    const nextZoom = zoom * 1.15;
    baseUserZoomRef.current = nextZoom;
    applyClampedPanZoom(pan, nextZoom);
  };

  const handleZoomOut = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const nextZoom = zoom * 0.85;
    baseUserZoomRef.current = nextZoom;
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

  // Dynamic CSS transition: none during active drag or kinetic inertia glide, 700ms smooth ease-out for buttons/presets, 1500ms cinematic dive on click
  const isMovingWithPhysics = isDragging || isInertiaActiveRef.current;
  const stageTransition = isMovingWithPhysics
    ? 'none'
    : isEnteringScene || transitionMode === 'entry'
    ? 'transform 1500ms cubic-bezier(0.16, 1, 0.3, 1)'
    : transitionMode === 'hover'
    ? 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)'
    : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)';

  // ----------------------------------------------------
  // MODO MUSICALIDADES: SPLIT-SCREEN 50/50 (Rádio + Mapa Musical)
  // ----------------------------------------------------
  if (mainMode === 'musicalidades') {
    return (
      <div className="container-modo-musical-split w-full h-full flex flex-col lg:flex-row overflow-hidden select-none bg-slate-950 pt-14 sm:pt-16">
        {/* Procedural Filters */}
        <ProceduralTerrainFilter />
        <ParchmentTextureFilter />

        {/* LADO ESQUERDO: APARELHO DE RÁDIO HISTÓRICO & TOCADOR VINTAGE (50% no Desktop) */}
        <div className="painel-split-radio-esquerda w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-amber-500/40 z-20 flex flex-col min-h-0 bg-slate-950 overflow-hidden shadow-2xl">
          <VintageRadioPlayer
            selectedStateId={selectedStateId || hoveredStateId || 'RJ'}
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
              }
            }}
            onClose={onToggleRadio}
          />
        </div>

        {/* LADO DIREITO: MAPA DO BRASIL MUSICAL INTERATIVO (50% no Desktop) */}
        <div
          ref={containerRef}
          onMouseDown={isGlobe3DActive ? undefined : handleMouseDown}
          onMouseMove={isGlobe3DActive ? undefined : handleMouseMove}
          onMouseUp={isGlobe3DActive ? undefined : handleMouseUp}
          onMouseLeave={() => {
            if (!isGlobe3DActive) {
              handleMouseUp();
              if (hoveredStateId) handleStateLeave(hoveredStateId);
            }
          }}
          onWheel={isGlobe3DActive ? undefined : handleWheel}
          className={`painel-split-mapa-direita relative w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden flex-1 cursor-${
            isGlobe3DActive ? 'default' : isDragging ? 'grabbing' : 'grab'
          }`}
          style={{
            perspective: '1600px',
            backgroundColor: '#031526',
          }}
        >
          {/* Botão Centralizar e Controles HUD Rápidos */}
          <div className="painel-hud-musical-controles absolute top-3 right-4 z-40 flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-xl bg-slate-950/90 border border-amber-500/50 text-amber-300 flex items-center justify-center hover:bg-slate-900 hover:scale-105 transition cursor-pointer shadow-lg font-bold"
              title="Aproximar Zoom"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-xl bg-slate-950/90 border border-amber-500/50 text-amber-300 flex items-center justify-center hover:bg-slate-900 hover:scale-105 transition cursor-pointer shadow-lg font-bold"
              title="Afastar Zoom"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="w-8 h-8 rounded-xl bg-slate-950/90 border border-amber-500/50 text-amber-300 flex items-center justify-center hover:bg-slate-900 hover:scale-105 transition cursor-pointer shadow-lg"
              title="Centralizar Mapa no Brasil"
            >
              <LocateFixed className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Dica de Interação */}
          <div className="absolute top-3 left-4 z-30 pointer-events-none px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Passe o mouse ou clique nos estados para sintonizar a rádio histórica
          </div>

          {/* Stage com Mapa */}
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
              {/* Oceano & Ondas */}
              <ProceduralOceanCanvas isPlayingAnimation={true} isParchmentMode={false} />
              <CoastalWavesCanvas enabled={wavesEnabled} />

              {/* Camada de Estados com Realce Musical */}
              <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
                <MapStatesLayer
                  geoData={geoData}
                  projection={projection}
                  visualStyle="tiles"
                  terrainProvider="shaded_relief"
                  choroplethSubTheme={choroplethSubTheme}
                  completedStateIds={completedSet}
                  hoveredStateId={hoveredStateId}
                  selectedStateId={selectedStateId}
                  showNeighbors={false}
                  centroids={centroids}
                  isClimateActive={false}
                  onStateEnter={(stateId) => {
                    handleStateEnter(stateId);
                    vintageRadioEngine.playTuningDialSfx();
                  }}
                  onStateLeave={handleStateLeave}
                  onStateClick={(stateId) => {
                    handleStateClick(stateId);
                    setSelectedStateId(stateId);
                    vintageRadioEngine.playTuningDialSfx();
                  }}
                />
              </div>

              {/* Nuvens decorativas suaves */}
              <div style={{ transform: 'translateZ(100px)', transformStyle: 'preserve-3d' }}>
                <AtmosphericCloudsLayer enabled={cloudsEnabled} speedMultiplier={0.6} />
              </div>
            </div>
          </div>

          {/* Card Flutuante com Informações Musicais e da Era do Estado em Hover */}
          <MusicalStateMapCard
            stateId={hoveredStateId || selectedStateId}
            selectedRadioEraId={selectedRadioEraId}
            onTuneState={(stateId) => {
              setSelectedStateId(stateId);
              vintageRadioEngine.playTuningDialSfx();
            }}
          />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MODOS AVENTURA & CLIMA
  // ----------------------------------------------------
  return (
    <div
      ref={containerRef}
      onMouseDown={isGlobe3DActive ? undefined : handleMouseDown}
      onMouseMove={isGlobe3DActive ? undefined : handleMouseMove}
      onMouseUp={isGlobe3DActive ? undefined : handleMouseUp}
      onMouseLeave={() => {
        if (!isGlobe3DActive) {
          handleMouseUp();
          if (hoveredStateId) handleStateLeave(hoveredStateId);
          if (hoveredCountryId) handleCountryLeave(hoveredCountryId);
        }
      }}
      onWheel={isGlobe3DActive ? undefined : handleWheel}
      className={`container-canva-mapa-br container-mapa-br relative w-full h-full flex-1 overflow-hidden select-none cursor-${
        isGlobe3DActive ? 'default' : isDragging ? 'grabbing' : 'grab'
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

      {/* 3. Cinematic Zoom-In & Fade Veil (Triggered on State Click) */}
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

      {/* 4. Top-Right Navigation & Zoom HUD (8px from top-right corner, active in all modes) */}
      {!isGlobe3DActive && (
        <TopRightNavigationDock
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          zoom={zoom}
        />
      )}

      {/* 5. Choropleth Interactive Legend (Shown on 2D/2.5D Cartographic Mode, Hidden in Climate Mode) */}
      {!isGlobe3DActive && !isClimateActive && (
        <MapChoroplethLegend
          visualStyle={visualStyle}
          choroplethSubTheme={choroplethSubTheme}
          completedCount={completedSet.size}
        />
      )}

      {/* 6. Dedicated Right Side State Details Panel (Hidden in Climate Mode) */}
      {!isClimateActive && (
        <StateDetailsSidebar
          activeStateId={hoveredStateId}
          completedStateIds={completedSet}
          onSelectGuardian={onSelectGuardian}
        />
      )}

      {/* 7. UNBOXED FULL-BODY GUARDIAN NPC STANDEE (Hidden in Climate Mode) */}
      {!isClimateActive && (
        <IsolatedLeftGuardianStandee
          activeStateId={hoveredStateId || selectedStateId}
          completedStateIds={completedSet}
          onSelectGuardian={onSelectGuardian}
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
                hoveredStateId={isClimateActive ? null : hoveredStateId}
                selectedStateId={isClimateActive ? null : selectedStateId}
                selectedRegionFilter={selectedRegionFilter}
                hoveredRegionFilter={hoveredRegionFilter}
                showNeighbors={showNeighbors}
                hoveredCountryId={hoveredCountryId}
                centroids={centroids}
                isClimateActive={isClimateActive}
                climateMode={currentClimateMode}
                stateWeather={stateWeather}
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

            {/* Layer 2.5: Real-Time Climate Phenomena & Streamlines (Coplanar with map base at Z=0px) */}
            <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
              <ClimatePhenomenaLayer
                active={isClimateActive}
                mode={currentClimateMode}
                stations={climateStations}
                stateWeather={stateWeather}
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

            {/* Layer 3: Guardian Heraldic Pins Layer with Coat of Arms (Hidden in Climate and Music Modes to clear the view) */}
            {!isClimateActive && mainMode === 'aventura' && (
              <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
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
            setHeadingAngle(newHeading);
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

      {/* 10. Bottom State Carousel with Search & Progress (Only in Adventure Mode) */}
      {!isGlobe3DActive && !isClimateActive && mainMode === 'aventura' && (
        <MapStateCarousel
          completedStateIds={completedSet}
          hoveredStateId={hoveredStateId}
          selectedStateId={selectedStateId}
          onStateHover={(id) => (id ? handleStateEnter(id) : hoveredStateId && handleStateLeave(hoveredStateId))}
          onStateClick={handleStateClick}
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
        onTimeOverrideChange={setTimeOverride}
      />

      {/* 13. Card de Telemetria Flutuante da Estação Selecionada */}
      {isClimateActive && selectedClimateStation && (
        <ClimateStationTelemetryCard
          station={selectedClimateStation}
          onClose={() => setSelectedClimateStation(null)}
          onCenterMap={() => handleSelectClimateStation(selectedClimateStation)}
        />
      )}
    </div>
  );
};
