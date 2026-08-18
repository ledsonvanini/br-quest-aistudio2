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
import { MapControlsHUD } from './map/MapControlsHUD';
import { MapChoroplethLegend } from './map/MapChoroplethLegend';
import { MapStateCarousel } from './map/MapStateCarousel';
import { TerrainTileProvider } from './map/ClippedMapTilesLayer';
import { StateDetailsSidebar } from './map/StateDetailsSidebar';
import { BrazilGlobeR3F } from './map/BrazilGlobeR3F';
import { IsolatedLeftGuardianStandee } from './map/IsolatedLeftGuardianStandee';
import { CompassLoadingScreen } from './map/CompassLoadingScreen';
import { loadBrazilGeoData, getCachedGeoData } from '../lib/geoDataLoader';
import { GizmoCompassHUD, MapAnglePreset } from './map/GizmoCompassHUD';
import { Compass, LocateFixed, MapPin, Flag } from 'lucide-react';

interface Props {
  completedStateIds: string[];
  unlockedInsigniaIds: string[];
  onSelectGuardian: (guardian: GuardianData) => void;
  lang: Language;
  onOpenSettings?: () => void;
  onClimateActiveChange?: (active: boolean) => void;
}

export const IsometricMapCanvas: React.FC<Props> = ({
  completedStateIds,
  onSelectGuardian,
  onClimateActiveChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Visual Modes & Customization
  const [visualStyle, setVisualStyle] = useState<MapVisualStyle>('tiles');
  const [terrainProvider, setTerrainProvider] = useState<TerrainTileProvider>('shaded_relief');
  const [choroplethSubTheme, setChoroplethSubTheme] = useState<ChoroplethSubTheme>('regions');
  const [is3D, setIs3D] = useState<boolean>(true);
  const [isGlobe3DActive, setIsGlobe3DActive] = useState<boolean>(false);
  const [atmosphereEnabled, setAtmosphereEnabled] = useState<boolean>(true);
  const [wavesEnabled, setWavesEnabled] = useState<boolean>(true);
  const [cloudsEnabled, setCloudsEnabled] = useState<boolean>(true);
  const [rainSimEnabled, setRainSimEnabled] = useState<boolean>(false);
  const [showNeighbors, setShowNeighbors] = useState<boolean>(false);
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<NeighborCountryData | null>(null);

  // Climate Phenomena & Live Meteorological Telemetry (Open-Meteo API)
  const [isClimateActive, setIsClimateActive] = useState<boolean>(false);

  // Notify parent component about climate mode active state
  useEffect(() => {
    onClimateActiveChange?.(isClimateActive);
  }, [isClimateActive, onClimateActiveChange]);
  const [isClimatePanelOpen, setIsClimatePanelOpen] = useState<boolean>(false);
  const [climateMode, setClimateMode] = useState<ClimateMode>('temperaturas_frentes');
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
    setIsClimateActive((prev) => {
      const next = !prev;
      setIsClimatePanelOpen(next);

      if (next) {
        // Automatically switch base terrain to Muted Grey for high-contrast meteorological radar viewing
        previousTerrainRef.current = terrainProvider;
        previousVisualStyleRef.current = visualStyle;
        setVisualStyle('tiles');
        setTerrainProvider('muted_gray');
      } else {
        // Restore previous visual configuration
        setTerrainProvider(previousTerrainRef.current);
        setVisualStyle(previousVisualStyleRef.current);
      }

      return next;
    });
  };

  // Camera Pan & Zoom States (Centered mathematically on Brazil with 30% wider zoom out: 0.80)
  const baseUserZoomRef = useRef<number>(0.80);
  const [pan, setPan] = useState<{ x: number; y: number }>(() => getBrazilACtoPBMidpointPan(0.80, true));
  const [zoom, setZoom] = useState<number>(0.80);
  const [baseTiltAngle, setBaseTiltAngle] = useState<number>(42);
  const [headingAngle, setHeadingAngle] = useState<number>(0);

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
    const targetZoom = showNeighbors ? 0.52 : 0.80;
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

  // Toggle South American Neighbor Countries & Flagpoles at 45°
  const handleToggleNeighbors = () => {
    stopInertia();
    audioEngine.playSfx('click');
    setTransitionMode('button');
    setShowNeighbors((prev) => {
      const next = !prev;
      if (next) {
        // Zoom out to show full South American continent
        const continentZoom = 0.52;
        baseUserZoomRef.current = continentZoom;
        const continentPan = getSouthAmericaMidpointPan(continentZoom, is3D);
        applyClampedPanZoom(continentPan, continentZoom);
      } else {
        // Zoom in to full Brazil view
        const brazilZoom = 0.80;
        baseUserZoomRef.current = brazilZoom;
        const brazilPan = getBrazilACtoPBMidpointPan(brazilZoom, is3D);
        applyClampedPanZoom(brazilPan, brazilZoom);
      }
      return next;
    });
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

      {/* 4. Top HUD Controls (Hidden in Climate Mode to avoid visual clutter and collision with temperature scale) */}
      {!isGlobe3DActive && !isClimateActive && (
        <MapControlsHUD
          visualStyle={visualStyle}
          onVisualStyleChange={setVisualStyle}
          terrainProvider={terrainProvider}
          onTerrainProviderChange={setTerrainProvider}
          choroplethSubTheme={choroplethSubTheme}
          onChoroplethSubThemeChange={setChoroplethSubTheme}
          is3D={is3D}
          onToggle3D={handleToggle3D}
          isGlobe3DActive={isGlobe3DActive}
          onToggleGlobe3D={handleToggleGlobe3D}
          atmosphereEnabled={atmosphereEnabled}
          onToggleAtmosphere={handleToggleAtmosphere}
          wavesEnabled={wavesEnabled}
          onToggleWaves={() => setWavesEnabled((prev) => !prev)}
          isClimateActive={isClimateActive}
          onToggleClimate={handleToggleClimate}
          showNeighbors={showNeighbors}
          onToggleNeighbors={handleToggleNeighbors}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* 4.1 Top-Right HUD: Centralizar Mapa (Goiás Pivot - Hidden in Climate Mode) */}
      {!isGlobe3DActive && !isClimateActive && (
        <div className="painel-hud-centralizar fixed top-14 right-5 z-40 flex items-center pointer-events-auto">
          <button
            id="btn-hud-centralizar-mapa"
            onClick={handleResetView}
            className="btn-hud-centralizar-mapa w-[50px] h-[50px] rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/60 text-amber-400 shadow-2xl shadow-black/90 hover:bg-slate-900 hover:border-amber-300 hover:text-amber-200 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
            title="Centralizar Mapa no Brasil (Pivô Goiás - GO)"
            aria-label="Centralizar Mapa no Brasil"
          >
            <LocateFixed className="w-5 h-5 text-amber-400 group-hover:text-amber-300 group-hover:scale-110 transition-all duration-300" />
          </button>
        </div>
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
                showNeighbors={showNeighbors}
                hoveredCountryId={hoveredCountryId}
                centroids={centroids}
                isClimateActive={isClimateActive}
                climateMode={climateMode}
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
                mode={climateMode}
                stations={climateStations}
                stateWeather={stateWeather}
                elNinoData={elNinoData}
                geoData={geoData}
                selectedStationId={selectedClimateStation?.id}
                onSelectStation={setSelectedClimateStation}
                speedMultiplier={climateSpeedMultiplier}
                dateTimeFormatted={climateDateTimeFormatted}
              />
            </div>

            {/* Layer 2.6: Rain Simulation & Rainfall Hotspots Ranking (Elevated at Z=60px) */}
            <div style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}>
              <RainSimulationLayer
                active={rainSimEnabled || (isClimateActive && climateMode === 'precipitacao_zcas')}
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

            {/* Layer 3: Guardian Heraldic Pins Layer with Coat of Arms (Hidden in Climate Mode to clear the view) */}
            {!isClimateActive && (
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

            {/* Layer 3.1: South America Neighbor Countries Flags on Masts tilted at 45° */}
            {!isClimateActive && (
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

            {/* Layer 4: Procedural Atmosphere (Gaivotas, Névoa Mágica & Brilho Solar) */}
            <div style={{ transform: 'translateZ(120px)', transformStyle: 'preserve-3d' }}>
              <ProceduralAtmosphereLayer enabled={atmosphereEnabled} />
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

      {/* 9. Interactive 3D Antique Compass Rose Gizmo HUD (Hidden in Climate Mode) */}
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
        />
      )}

      {/* 10. Bottom State Carousel with Search & Progress (Hidden in Climate Mode) */}
      {!isGlobe3DActive && !isClimateActive && (
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
        mode={climateMode}
        onModeChange={setClimateMode}
        stations={climateStations}
        elNinoData={elNinoData}
        selectedStation={selectedClimateStation}
        onSelectStation={setSelectedClimateStation}
        speedMultiplier={climateSpeedMultiplier}
        onSpeedMultiplierChange={setClimateSpeedMultiplier}
        onRefreshTelemetry={loadClimateData}
        isLoading={isClimateLoading}
        updatedAt={climateUpdatedAt}
        dateTimeFormatted={climateDateTimeFormatted}
        terrainProvider={terrainProvider}
        onTerrainProviderChange={setTerrainProvider}
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
      />
    </div>
  );
};
