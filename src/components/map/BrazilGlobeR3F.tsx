/**
 * BrazilGlobeR3F - Photorealistic 3D Globe with Astronomical Solar System,
 * Geodesic Inter-State Arcs, Day/Night VIIRS City Lights, and Cosmic Telemetry.
 */
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Hand } from 'lucide-react';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { loadBrazilGeoData, loadSouthAmericaGeoData } from '../../lib/geoDataLoader';
import {
  GlobeTextureMode,
  GlobeSeason,
  globePreloadManager,
  CelestialSystem,
  GeodesicRoutesEngine,
  calculateStateAstrometry,
  calculateLunarCoordinates,
  calculateSolarCoordinates,
  calculateHeliocentricOrbitalState,
  HeliocentricOrbitalState,
  createEarthShaderMaterial,
  createAtmosphereMaterial,
  createCloudShaderMaterial,
  latLonToSphereVector3,
  SCENE_GLOBE_RADIUS,
  GlobePreloadProgress,
  StateAstrometryTelemetry,
  MoonPhaseData,
  GeodesicRoute,
  ASTRONOMICAL_SCENE_PRESETS,
} from '../../lib/globeEngine';
import { CameraOrbitController, CameraFocusMode } from '../../lib/globeEngine/cameraOrbitController';
import {
  buildBorderPoints,
  buildBrazilStateOverlaysMesh,
  BorderRegionFilter,
} from '../../lib/globeEngine/brazilGeoMeshBuilder';
import { createDeepSpaceStarfield } from '../../lib/globeEngine/starfieldGenerator';
import { StateHeraldicPinsOverlay, ProjectedPin } from '../globe/StateHeraldicPinsOverlay';
import { GlobePanelsLayer } from '../globe/GlobePanelsLayer';
import { GlobeLoadingProgress } from '../globe/GlobeLoadingProgress';
import { CompassLoadingScreen } from './CompassLoadingScreen';
import { findCityByName } from '../../data/brazilCitiesGeo';
import {
  ProjectedCelestialPin,
  CelestialBodyInfo,
  CosmicTrajectoryTelemetry,
} from '../../lib/globeEngine/types';
import { useGlobeSolarCycle } from '../globe/useGlobeSolarCycle';
import { useGlobeAstrometry, getEffectiveDate } from '../globe/useGlobeAstrometry';
import { useGlobeCameraRig } from '../globe/useGlobeCameraRig';

export type { GlobeTextureMode };

export interface BrazilGlobeR3FProps {
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  onSelectGuardian?: (guardian: GuardianData) => void;
  textureMode?: GlobeTextureMode;
  cloudsEnabled?: boolean;
  autoRotate?: boolean;
  showBorders?: boolean;
  pinDisplayMode?: 'all' | 'compact' | 'none';
  timeOverride?: 'auto' | 'day' | 'night';
  focusedStateId?: string | null;
  centerTrigger?: number;
  zoomInTrigger?: number;
  zoomOutTrigger?: number;
  isTelemetryOpen?: boolean;
  onToggleTelemetry?: () => void;
}

export const BrazilGlobeR3F: React.FC<BrazilGlobeR3FProps> = ({
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateClick,
  onSelectGuardian,
  textureMode: propTextureMode,
  cloudsEnabled: propCloudsEnabled = true,
  autoRotate: propAutoRotate = false,
  showBorders: propShowBorders = true,
  pinDisplayMode: propPinMode,
  timeOverride = 'auto',
  focusedStateId,
  centerTrigger,
  zoomInTrigger,
  zoomOutTrigger,
  isTelemetryOpen: propIsTelemetryOpen,
  onToggleTelemetry,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [projectedPins, setProjectedPins] = useState<ProjectedPin[]>([]);
  const projectedPinsRef = useRef<ProjectedPin[]>([]);
  const lastPinsSyncMsRef = useRef<number>(0);
  const lastAppliedShiftPxRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Interactive HUD States
  const [pinDisplayMode, setPinDisplayMode] = useState<'all' | 'compact' | 'none'>(propPinMode || 'all');

  const [activeTextureMode, setActiveTextureMode] = useState<GlobeTextureMode>(propTextureMode || 'nasa_satellite');
  const [cloudsVisible, setCloudsVisible] = useState<boolean>(propCloudsEnabled);
  const [autoRotateActive, setAutoRotateActive] = useState<boolean>(propAutoRotate);
  const [bordersVisible, setBordersVisible] = useState<boolean>(propShowBorders);
  const bordersVisibleRef = useRef<boolean>(propShowBorders);
  const [showSolarSystem, setShowSolarSystem] = useState<boolean>(true);
  const showSolarSystemRef = useRef<boolean>(true);
  const [showGeodesicRoutes, setShowGeodesicRoutes] = useState<boolean>(true);
  const [showCosmicBeams, setShowCosmicBeams] = useState<boolean>(false);
  const [currentSeason, setCurrentSeason] = useState<GlobeSeason>('realtime');
  const currentSeasonRef = useRef<GlobeSeason>('realtime');
  const [internalIsTelemetryOpen, setInternalIsTelemetryOpen] = useState<boolean>(true);
  const isTelemetryOpen = propIsTelemetryOpen !== undefined ? propIsTelemetryOpen : internalIsTelemetryOpen;
  const isTelemetryOpenRef = useRef<boolean>(isTelemetryOpen);
  useEffect(() => {
    isTelemetryOpenRef.current = isTelemetryOpen;
  }, [isTelemetryOpen]);

  const currentShiftPxRef = useRef<number>(0);
  const [compassDismissed, setCompassDismissed] = useState<boolean>(false);
  const [showNavPill, setShowNavPill] = useState<boolean>(true);
  const [activeSelectedAstroId, setActiveSelectedAstroId] = useState<string>('terra');
  const [isTextureInfoOpen, setIsTextureInfoOpen] = useState<boolean>(false);
  const isTextureInfoOpenRef = useRef<boolean>(false);
  useEffect(() => {
    isTextureInfoOpenRef.current = isTextureInfoOpen;
  }, [isTextureInfoOpen]);

  const [borderRegionFilter, setBorderRegionFilter] = useState<BorderRegionFilter>('all');
  const borderRegionFilterRef = useRef<BorderRegionFilter>('all');
  const allBrazilBorderFeaturesRef = useRef<any[]>([]);

  // Update dynamic 3D borders and regional tint overlays when regional filter changes
  useEffect(() => {
    borderRegionFilterRef.current = borderRegionFilter;
    if (bordersMeshRef.current && allBrazilBorderFeaturesRef.current.length > 0) {
      const points = buildBorderPoints(allBrazilBorderFeaturesRef.current, borderRegionFilter);
      const linesGeo = bordersMeshRef.current.geometry;
      linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      linesGeo.computeBoundingSphere();
    }
    if (stateOverlaysMeshRef.current && globeGroupRef.current && allBrazilBorderFeaturesRef.current.length > 0) {
      globeGroupRef.current.remove(stateOverlaysMeshRef.current);
      stateOverlaysMeshRef.current.geometry.dispose();
      (stateOverlaysMeshRef.current.material as THREE.Material).dispose();
      const newMesh = buildBrazilStateOverlaysMesh(allBrazilBorderFeaturesRef.current, borderRegionFilter);
      if (newMesh) {
        newMesh.visible = bordersVisibleRef.current && !isAstralModeRef.current;
        stateOverlaysMeshRef.current = newMesh;
        globeGroupRef.current.add(newMesh);
      }
    }
  }, [borderRegionFilter]);

  // Auto-dismiss floating instruction pill after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNavPill(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Celestial Interactive Overlay States
  const [projectedCelestialPins, setProjectedCelestialPins] = useState<ProjectedCelestialPin[]>([]);
  const [selectedAstro, setSelectedAstro] = useState<CelestialBodyInfo | null>(null);
  const selectedAstroRef = useRef<CelestialBodyInfo | null>(null);
  useEffect(() => {
    selectedAstroRef.current = selectedAstro;
  }, [selectedAstro]);

  const [trajectoryTelemetry, setTrajectoryTelemetry] = useState<CosmicTrajectoryTelemetry | null>(null);

  // Astral Mode: when navigating or focusing an astro/planet, hide terrestrial states & borders
  const isAstralMode = Boolean(selectedAstro && selectedAstro.id !== 'terra');
  const isAstralModeRef = useRef<boolean>(false);
  useEffect(() => {
    isAstralModeRef.current = isAstralMode;
  }, [isAstralMode]);

  // Centralized Mutual Exclusivity Manager for UI Panels:
  // Regra Estrita: "SEMPRE QUE UM PAINEL ABRIR, TODOS OS OUTROS FECHAM"
  const closeAllPanelsExcept = useCallback(
    (except: 'telemetry' | 'trajectory' | 'solar_simulator' | 'texture_info' | 'none') => {
      if (except !== 'telemetry') {
        if (isTelemetryOpenRef.current || isTelemetryOpen) {
          isTelemetryOpenRef.current = false;
          if (onToggleTelemetry) {
            queueMicrotask(() => {
              onToggleTelemetry();
            });
          } else {
            setInternalIsTelemetryOpen(false);
          }
        }
      }
      if (except !== 'trajectory') {
        setSelectedAstro(null);
        selectedAstroRef.current = null;
        setTrajectoryTelemetry(null);
        celestialSystemRef.current?.clearCosmicTrajectory();
      }
      if (except !== 'solar_simulator') {
        setIsSolarSimulatorOpen(false);
        isSolarSimulatorOpenRef.current = false;
      }
      if (except !== 'texture_info') {
        setIsTextureInfoOpen(false);
        isTextureInfoOpenRef.current = false;
      }
    },
    [onToggleTelemetry, isTelemetryOpen]
  );

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const earthShaderMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const bordersMeshRef = useRef<THREE.LineSegments | null>(null);
  const saBordersMeshRef = useRef<THREE.LineSegments | null>(null);
  const stateOverlaysMeshRef = useRef<THREE.Mesh | null>(null);

  // Sub-Engines Refs
  const celestialSystemRef = useRef<CelestialSystem | null>(null);
  const geodesicEngineRef = useRef<GeodesicRoutesEngine | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Timer instance using modern THREE.Timer API with robust fallback tracking
  const timerRef = useRef<any>(null);
  if (!timerRef.current) {
    if (typeof (THREE as any).Timer !== 'undefined') {
      timerRef.current = new (THREE as any).Timer();
    } else {
      let lastTime = performance.now() * 0.001;
      let totalElapsed = 0;
      let currentDelta = 0.016;
      timerRef.current = {
        update: () => {
          const now = performance.now() * 0.001;
          currentDelta = Math.min(0.1, Math.max(0.001, now - lastTime));
          totalElapsed += currentDelta;
          lastTime = now;
        },
        getDelta: () => currentDelta,
        getElapsed: () => totalElapsed,
        dispose: () => {},
      };
    }
  }

  // 3D coordinates for all 27 Brazilian state capitals
  const state3DVectors = useRef<Record<string, THREE.Vector3>>({});

  useEffect(() => {
    const vectors: Record<string, THREE.Vector3> = {};
    Object.entries(BRAZIL_STATES_GEO).forEach(([id, geo]) => {
      vectors[id] = latLonToSphereVector3(geo.lat, geo.lon, SCENE_GLOBE_RADIUS * 1.012);
    });
    state3DVectors.current = vectors;
  }, []);

  // 1. Solar, Planetary Lighting & Orbital Translation Hook
  const {
    simulatedSolarHour,
    setSimulatedSolarHour,
    simulatedSolarHourRef,
    isSolarCyclePlaying,
    setIsSolarCyclePlaying,
    isSolarCyclePlayingRef,
    sunIntensity,
    setSunIntensity,
    sunIntensityRef,
    moonLightIntensity,
    setMoonLightIntensity,
    moonLightIntensityRef,
    ambientLightIntensity,
    setAmbientLightIntensity,
    ambientLightIntensityRef,
    cityLightIntensity,
    setCityLightIntensity,
    cityLightIntensityRef,
    cloudsOpacity,
    setCloudsOpacity,
    cloudsOpacityRef,
    isSolarSimulatorOpen,
    setIsSolarSimulatorOpen,
    isSolarSimulatorOpenRef,
    isSolarSimulatorExpanded,
    setIsSolarSimulatorExpanded,
    isSolarSimulatorExpandedRef,
    solarCycleSpeed,
    setSolarCycleSpeed,
    solarCycleSpeedRef,
    orbitalDayOfYear,
    setOrbitalDayOfYear,
    orbitalDayOfYearRef,
    isOrbitalPlaying,
    setIsOrbitalPlaying,
    isOrbitalPlayingRef,
    orbitalSpeedDaysPerSec,
    setOrbitalSpeedDaysPerSec,
    orbitalSpeedDaysPerSecRef,
    isAxialRotationActive,
    setIsAxialRotationActive,
    isAxialRotationActiveRef,
    cameraFocusMode,
    setCameraFocusMode,
    cameraFocusModeRef,
    isPlanetsAligned,
    setIsPlanetsAligned,
    isPlanetsAlignedRef,
    activeScenePresetId,
    setActiveScenePresetId,
    liveBrasilia,
    currentOrbitalState,
  } = useGlobeSolarCycle();

  // 2. Camera Rig Hook
  const {
    cameraOrbitControllerRef,
    smoothGlideCamera,
    handleZoomIn,
    handleZoomOut,
    handleRotateStep,
    handleResetView,
    handleSetCameraFocusMode,
    focusStateOnGlobe,
  } = useGlobeCameraRig({
    cameraRef,
    controlsRef,
    globeGroupRef,
    closeAllPanelsExcept,
    setActiveSelectedAstroId,
    setCameraFocusMode,
    setActiveScenePresetId,
  });

  // Target State tracking
  const currentTargetStateId = selectedStateId || focusedStateId || 'DF';
  const currentTargetStateIdRef = useRef<string>(currentTargetStateId);
  useEffect(() => {
    currentTargetStateIdRef.current = currentTargetStateId;
  }, [currentTargetStateId]);

  const showCosmicBeamsRef = useRef<boolean>(showCosmicBeams);
  useEffect(() => {
    showCosmicBeamsRef.current = showCosmicBeams;
  }, [showCosmicBeams]);

  // 3. Astrometry & Geodesic Routes Hook
  const {
    telemetryData,
    moonPhaseData,
    activeRoutes,
    allCapitalRoutes,
    activeAdaptedRoute,
    setActiveRoutes,
    setAllCapitalRoutes,
    setActiveAdaptedRoute,
    handleSelectCapitalRoute,
    handleCustomCityRoute,
    handleResetCapitalsRoute,
  } = useGlobeAstrometry({
    currentTargetStateId,
    currentSeason,
    simulatedSolarHour,
    globeGroupRef,
    geodesicEngineRef,
    cameraOrbitControllerRef,
    smoothGlideCamera,
    setShowGeodesicRoutes,
  });

  // Performance telemetry refs for the render loop
  const lastSolarUiSyncRef = useRef<number>(0);
  const lastOrbitalUiSyncRef = useRef<number>(0);
  const lastOrbitalVisualsStateRef = useRef<{ lines: boolean; aligned: boolean }>({ lines: false, aligned: false });
  const lastPinsCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastPinsCamQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const lastPinsGlobeRotYRef = useRef<number>(-999);
  const lastPinsWidthRef = useRef<number>(0);
  const lastPinsHeightRef = useRef<number>(0);

  // Sync lighting intensities to Three.js Shader Materials
  useEffect(() => {
    if (earthShaderMatRef.current) {
      earthShaderMatRef.current.uniforms.u_sunIntensity.value = sunIntensity;
      earthShaderMatRef.current.uniforms.u_ambientIntensity.value = ambientLightIntensity;
      earthShaderMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensity;
      earthShaderMatRef.current.uniforms.u_cityLightIntensity.value = cityLightIntensity;
      earthShaderMatRef.current.uniforms.u_cloudsOpacity.value = cloudsOpacity;
    }
    if (cloudsMatRef.current) {
      cloudsMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensity;
      cloudsMatRef.current.uniforms.u_opacity.value = cloudsOpacity;
    }
    if (atmosphereMatRef.current) {
      atmosphereMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensity;
    }
  }, [sunIntensity, ambientLightIntensity, moonLightIntensity, cityLightIntensity, cloudsOpacity]);

  const [preloadProgress, setPreloadProgress] = useState<GlobePreloadProgress>({
    loaded: 0,
    total: 4,
    percent: 0,
    currentAsset: '',
    isReady: false,
    fromCache: false,
  });

  // Sync prop changes
  useEffect(() => {
    if (propPinMode !== undefined) setPinDisplayMode(propPinMode);
  }, [propPinMode]);

  useEffect(() => {
    if (propTextureMode) setActiveTextureMode(propTextureMode);
  }, [propTextureMode]);

  // Switch texture mode dynamically on earth shader material
  useEffect(() => {
    if (earthShaderMatRef.current && earthShaderMatRef.current.uniforms.u_textureMode) {
      let modeInt = 0;
      if (activeTextureMode === 'nasa_satellite') modeInt = 0;
      else if (activeTextureMode === 'nasa_full_day' || activeTextureMode === 'natural_earth') modeInt = 1;
      else if (activeTextureMode === 'night_lights') modeInt = 2;
      else if (activeTextureMode === 'specular_topo') modeInt = 3;
      else if (activeTextureMode === 'el_nino_sst') modeInt = 4;
      else if (activeTextureMode === 'flood_hydrology') modeInt = 5;
      
      earthShaderMatRef.current.uniforms.u_textureMode.value = modeInt;
      earthShaderMatRef.current.needsUpdate = true;
    }
  }, [activeTextureMode]);

  useEffect(() => {
    setCloudsVisible(propCloudsEnabled);
  }, [propCloudsEnabled]);

  useEffect(() => {
    setAutoRotateActive(propAutoRotate);
  }, [propAutoRotate]);

  useEffect(() => {
    setBordersVisible(propShowBorders);
  }, [propShowBorders]);

  // Update controls auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotateActive;
      controlsRef.current.autoRotateSpeed = 0.5;
    }
  }, [autoRotateActive]);

  // Update clouds visibility
  useEffect(() => {
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.visible = cloudsVisible;
    }
  }, [cloudsVisible]);

  // Update borders visibility (hidden in Astral Mode to focus cleanly on celestial bodies)
  useEffect(() => {
    bordersVisibleRef.current = bordersVisible;
    const shouldShow = bordersVisible && !isAstralMode;
    if (bordersMeshRef.current) bordersMeshRef.current.visible = shouldShow;
    if (saBordersMeshRef.current) saBordersMeshRef.current.visible = shouldShow;
    if (stateOverlaysMeshRef.current) stateOverlaysMeshRef.current.visible = shouldShow;
  }, [bordersVisible, isAstralMode]);

  // Update Solar System visibility
  useEffect(() => {
    if (celestialSystemRef.current) {
      celestialSystemRef.current.setVisiblePlanets(showSolarSystem);
      celestialSystemRef.current.setSunVisible(showSolarSystem);
      celestialSystemRef.current.moonMesh.visible = showSolarSystem;
    }
  }, [showSolarSystem]);

  // Update Geodesic Routes visibility
  useEffect(() => {
    if (geodesicEngineRef.current) {
      geodesicEngineRef.current.setVisible(showGeodesicRoutes);
    }
  }, [showGeodesicRoutes]);

  // Preload textures progressively in background with auto-dismiss
  useEffect(() => {
    const unsubscribe = globePreloadManager.subscribeProgress((progress) => {
      setPreloadProgress(progress);

      // Auto-dismiss loading screen as soon as textures are cached or ready
      if (progress.isReady || progress.percent >= 100) {
        setCompassDismissed(true);
      }

      // Blur-up: as high-res textures complete decoding, update shader materials
      if (earthShaderMatRef.current) {
        const dayTex = globePreloadManager.getCachedTexture('day_marble');
        const nightTex = globePreloadManager.getCachedTexture('night_lights');
        const cloudsTex = globePreloadManager.getCachedTexture('clouds_map');
        const moonTex = globePreloadManager.getCachedTexture('moon_albedo');

        if (dayTex) {
          earthShaderMatRef.current.uniforms.u_dayMap.value = dayTex;
          earthShaderMatRef.current.uniforms.u_dayMap.value.needsUpdate = true;
        }
        if (nightTex) {
          earthShaderMatRef.current.uniforms.u_nightMap.value = nightTex;
          earthShaderMatRef.current.uniforms.u_nightMap.value.needsUpdate = true;
        }
        if (cloudsTex && cloudsMatRef.current) {
          cloudsMatRef.current.uniforms.u_cloudsMap.value = cloudsTex;
          cloudsMatRef.current.uniforms.u_cloudsMap.value.needsUpdate = true;
          earthShaderMatRef.current.uniforms.u_cloudsMap.value = cloudsTex;
        }
        if (moonTex && celestialSystemRef.current) {
          celestialSystemRef.current.setMoonTexture(moonTex);
        }
        earthShaderMatRef.current.needsUpdate = true;
      }
    });

    // Fallback auto-dismiss timer so user never gets blocked waiting manually
    const autoDismissTimer = setTimeout(() => {
      setCompassDismissed(true);
    }, 1800);

    globePreloadManager.startPreload();

    return () => {
      clearTimeout(autoDismissTimer);
      unsubscribe();
    };
  }, []);

  // Main Three.js Scene Setup & Mount
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initial physical heliocentric orbital position of Earth
    const initialOrbitalState = calculateHeliocentricOrbitalState(orbitalDayOfYearRef.current || 79, 12);
    const initialEarthPos = initialOrbitalState.earthScenePos.clone();

    // 2. Camera: Focused directly on Brazil and South America
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.4, 350);
    const initialBrazilCam = initialEarthPos.clone().add(latLonToSphereVector3(-14.235, -51.925, 5.76));
    camera.position.copy(initialBrazilCam);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Performance Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls with Middle Mouse Grab/Pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(initialEarthPos);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.75;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.25;
    controls.minDistance = 2.15; // Deep zoom into Brazilian states
    controls.maxDistance = 240.0; // Amplo zoom out para visualizar todo o sistema solar heliocêntrico
    controls.minPolarAngle = 0.04; // Permite visualização panorâmica superior do plano orbital
    controls.maxPolarAngle = Math.PI - 0.04;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;

    // Draggable Grab/Pan for moving the entire scene with Middle Mouse or Right Mouse
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.panSpeed = 1.0;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN,
    };

    controlsRef.current = controls;
    cameraOrbitControllerRef.current.attach(camera, controls);

    controls.addEventListener('start', () => {
      setIsDragging(true);
      isDraggingRef.current = true;
    });
    controls.addEventListener('end', () => {
      setIsDragging(false);
      isDraggingRef.current = false;
    });

    const handlePanMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || e.button === 2) {
        cameraOrbitControllerRef.current.focusMode = 'free';
        renderer.domElement.style.cursor = 'grabbing';
      }
    };
    const handlePanMouseUp = (e: MouseEvent) => {
      if (e.button === 1 || e.button === 2) {
        renderer.domElement.style.cursor = 'grab';
      }
    };
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('mousedown', handlePanMouseDown);
    window.addEventListener('mouseup', handlePanMouseUp);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.32);
    scene.add(ambientLight);

    // 6. Deep Space Background Starfield (Anti-flicker with Gaussian point sprite)
    const starfield = createDeepSpaceStarfield();
    scene.add(starfield);

    // 7. Celestial System (Sun, Moon, Solar System Planets, Cosmic Beams)
    const celestial = new CelestialSystem();
    celestialSystemRef.current = celestial;
    scene.add(celestial.group);

    // Initial celestial vectors from current date/season
    const solarInit = calculateSolarCoordinates(new Date(), currentSeason);
    const lunarInit = calculateLunarCoordinates(new Date());

    // 8. Globe Group (Earth + Atmosphere + Clouds + Borders)
    const globeGroup = new THREE.Group();
    globeGroup.position.copy(initialEarthPos);
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Earth Sphere Geometry
    const earthGeo = new THREE.SphereGeometry(SCENE_GLOBE_RADIUS, 64, 64);

    // Instant procedural placeholders (guarantees zero-delay render)
    const dayPlaceholder = globePreloadManager.getOrCreatePlaceholder('day');
    const nightPlaceholder = globePreloadManager.getOrCreatePlaceholder('night');
    const cloudsPlaceholder = globePreloadManager.getOrCreatePlaceholder('clouds');

    // Earth Shader Material com Iluminação de 3 Pontos:
    // Sol Hard + Lua Soft Box + Luz Fake Suave para Gaps
    const earthShaderMat = createEarthShaderMaterial({
      dayMap: globePreloadManager.getCachedTexture('day_marble') || dayPlaceholder,
      nightMap: globePreloadManager.getCachedTexture('night_lights') || nightPlaceholder,
      cloudsMap: globePreloadManager.getCachedTexture('clouds_map') || cloudsPlaceholder,
      sunDirection: solarInit.sunDirection,
      moonDirection: lunarInit.moonDirection,
      sunIntensity: sunIntensityRef.current,
      moonIntensity: moonLightIntensityRef.current,
      ambientIntensity: ambientLightIntensityRef.current,
      cityLightIntensity: cityLightIntensityRef.current,
    });
    earthShaderMatRef.current = earthShaderMat;

    const earthMesh = new THREE.Mesh(earthGeo, earthShaderMat);
    earthMeshRef.current = earthMesh;
    globeGroup.add(earthMesh);

    // Dynamic Atmosphere Shell (Rayleigh + Mie + Chappuis Ozone + Moonlight limb)
    const atmoGeo = new THREE.SphereGeometry(SCENE_GLOBE_RADIUS * 1.025, 64, 64);
    const atmoMat = createAtmosphereMaterial(
      solarInit.sunDirection,
      lunarInit.moonDirection,
      true,
      moonLightIntensityRef.current
    );
    atmosphereMatRef.current = atmoMat;
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmosphereMeshRef.current = atmoMesh;
    globeGroup.add(atmoMesh);

    // Dynamic Clouds Shell com banho de luar noturno
    const cloudGeo = new THREE.SphereGeometry(SCENE_GLOBE_RADIUS * 1.016, 64, 64);
    const cloudMat = createCloudShaderMaterial(
      globePreloadManager.getCachedTexture('clouds_map') || cloudsPlaceholder,
      solarInit.sunDirection,
      lunarInit.moonDirection,
      cloudsOpacityRef.current,
      moonLightIntensityRef.current
    );
    cloudsMatRef.current = cloudMat;
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.visible = cloudsVisible;
    cloudsMeshRef.current = cloudMesh;
    globeGroup.add(cloudMesh);

    // 9. Geodesic Inter-State Routes Sub-Engine
    const geodesicEngine = new GeodesicRoutesEngine();
    geodesicEngineRef.current = geodesicEngine;
    globeGroup.add(geodesicEngine.group);
    geodesicEngine.setVisible(showGeodesicRoutes);
    const routes = geodesicEngine.updateRoutes(currentTargetStateId);
    setActiveRoutes(routes);

    // 10. Load 3D Golden Borders for Brazil's 27 States and South America
    Promise.all([loadBrazilGeoData(), loadSouthAmericaGeoData()])
      .then(([brazilData, neighborsData]) => {
        // Brazil 27 States 3D Borders
        if (brazilData?.features) {
          allBrazilBorderFeaturesRef.current = brazilData.features;
          const points = buildBorderPoints(brazilData.features, borderRegionFilterRef.current);

          if (points.length) {
            const linesGeo = new THREE.BufferGeometry();
            linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            const linesMat = new THREE.LineBasicMaterial({
              color: 0xfbbf24, // Intense Radiant Gold Lines
              transparent: true,
              opacity: 1.0,
              depthTest: true,
              depthWrite: false,
            });
            const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
            linesMesh.renderOrder = 20;
            bordersMeshRef.current = linesMesh;
            linesMesh.visible = bordersVisibleRef.current && !isAstralModeRef.current;
            globeGroup.add(linesMesh);
          }

          // 3D Brazil State Overlays Mesh (Green 50% opacity by default, grouped by region color when filtered)
          const stateMesh = buildBrazilStateOverlaysMesh(brazilData.features, borderRegionFilterRef.current);
          if (stateMesh) {
            stateOverlaysMeshRef.current = stateMesh;
            stateMesh.visible = bordersVisibleRef.current && !isAstralModeRef.current;
            globeGroup.add(stateMesh);
          }
        }

        // South America International Borders
        if (neighborsData?.features) {
          const saPoints: number[] = [];
          neighborsData.features.forEach((feat: any) => {
            const geom = feat.geometry;
            if (!geom) return;

            const processSaPolygon = (coords: number[][]) => {
              for (let i = 0; i < coords.length - 1; i++) {
                const [lon1, lat1] = coords[i];
                const [lon2, lat2] = coords[i + 1];
                const p1 = latLonToSphereVector3(lat1, lon1, SCENE_GLOBE_RADIUS * 1.010);
                const p2 = latLonToSphereVector3(lat2, lon2, SCENE_GLOBE_RADIUS * 1.010);
                saPoints.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
              }
            };

            if (geom.type === 'Polygon') {
              geom.coordinates.forEach((ring: any) => processSaPolygon(ring));
            } else if (geom.type === 'MultiPolygon') {
              geom.coordinates.forEach((poly: any) => {
                poly.forEach((ring: any) => processSaPolygon(ring));
              });
            }
          });

          if (saPoints.length) {
            const saLinesGeo = new THREE.BufferGeometry();
            saLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(saPoints, 3));
            const saLinesMat = new THREE.LineBasicMaterial({
              color: 0x38bdf8,
              transparent: true,
              opacity: 0.65,
              depthTest: true,
              depthWrite: false,
            });
            const saLinesMesh = new THREE.LineSegments(saLinesGeo, saLinesMat);
            saLinesMesh.renderOrder = 18;
            saBordersMeshRef.current = saLinesMesh;
            saLinesMesh.visible = bordersVisibleRef.current && !isAstralModeRef.current;
            globeGroup.add(saLinesMesh);
          }
        }
      })
      .catch((err) => {
        console.warn('Globe vector borders load warning:', err);
      });

    // 11. Animation Loop & Screen-Space Pin Projection
    const tempVec = new THREE.Vector3();
    const cameraWorldPos = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (timerRef.current) {
        timerRef.current.update();
      }
      const elapsed = timerRef.current ? timerRef.current.getElapsed() : performance.now() * 0.001;
      const deltaRaw =
        typeof timerRef.current?.getDelta === 'function'
          ? timerRef.current.getDelta()
          : 0.016;
      // Clamp delta smoothly between 0.001s and 0.033s to eliminate any sudden frame-skip jumps
      const delta = Math.min(0.033, Math.max(0.001, deltaRaw));
      const nowMs = performance.now();

      // Handle continuous 24h day/night rotation cycle animation
      if (isSolarCyclePlayingRef.current) {
        const currentH = simulatedSolarHourRef.current ?? ((new Date().getUTCHours() - 3 + 24) % 24);
        const speed = solarCycleSpeedRef.current || 1;
        // Complete full 24h earth rotation in 36 seconds scaled by speed (~0.67h per second)
        const nextH = (currentH + delta * 0.67 * speed) % 24;
        simulatedSolarHourRef.current = nextH;

        // Synchronize React state at ~10fps smoothly so the slider and digital clock in the UI update cleanly without thrashing
        if (nowMs - lastSolarUiSyncRef.current > 100) {
          lastSolarUiSyncRef.current = nowMs;
          setSimulatedSolarHour(nextH);
        }
      }

      // Handle continuous orbital translation animation around the Sun (Keplerian physics)
      if (isOrbitalPlayingRef.current) {
        const speed = orbitalSpeedDaysPerSecRef.current || 7;
        const currentD = orbitalDayOfYearRef.current;
        const nextD = ((currentD + delta * speed - 1) % 365.25) + 1;
        orbitalDayOfYearRef.current = nextD;

        if (nowMs - lastOrbitalUiSyncRef.current > 100) {
          lastOrbitalUiSyncRef.current = nowMs;
          setOrbitalDayOfYear(nextD);
        }
      }

      // Handle natural axial rotation of the Earth on its axis
      if (globeGroupRef.current && isAxialRotationActiveRef.current && !isDraggingRef.current && !isAstralModeRef.current) {
        globeGroupRef.current.rotation.y += delta * 0.035;
      }

      // Compute effective date for celestial ephemeris
      let animEffectiveDate = new Date();
      if (simulatedSolarHourRef.current !== null) {
        const utcHour = (simulatedSolarHourRef.current + 3) % 24;
        const wholeHours = Math.floor(utcHour);
        const minutes = Math.floor((utcHour % 1) * 60);
        const seconds = Math.floor((((utcHour % 1) * 60) % 1) * 60);
        animEffectiveDate = new Date();
        animEffectiveDate.setUTCHours(wholeHours, minutes, seconds, 0);
      }

      // Update Celestial Positions (Sun, Moon, Planets, Cosmic Beams, and Heliocentric Orbit)
      if (celestialSystemRef.current) {
        const targetStateId = currentTargetStateIdRef.current || 'DF';
        let worldStatePos: THREE.Vector3 | null = null;
        if (globeGroupRef.current) {
          const localVec =
            state3DVectors.current[targetStateId] ||
            latLonToSphereVector3(-15.78, -47.93, SCENE_GLOBE_RADIUS);
          globeGroupRef.current.updateMatrixWorld(true);
          worldStatePos = localVec.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
        }

        const { sunDirection, moonDirection, sunPos, earthPos, orbitalState } = celestialSystemRef.current.updatePositions(
          animEffectiveDate,
          currentSeasonRef.current,
          worldStatePos,
          showCosmicBeamsRef.current,
          orbitalDayOfYearRef.current,
          isPlanetsAlignedRef.current
        );

        // Keep Globe (Earth) in its true physical heliocentric orbital position
        if (globeGroupRef.current && earthPos) {
          globeGroupRef.current.position.copy(earthPos);
        }

        // Discrete orbital lines & alignment axis: only appear during active simulation
        const isSimulating =
          isOrbitalPlayingRef.current ||
          isSolarCyclePlayingRef.current ||
          isPlanetsAlignedRef.current;
        const shouldShowOrbitalLines = showSolarSystemRef.current && isSimulating;

        // Cache calls to avoid redundant scene traversals and CPU stalls every frame
        if (
          lastOrbitalVisualsStateRef.current.lines !== shouldShowOrbitalLines ||
          lastOrbitalVisualsStateRef.current.aligned !== isPlanetsAlignedRef.current
        ) {
          lastOrbitalVisualsStateRef.current = {
            lines: shouldShowOrbitalLines,
            aligned: isPlanetsAlignedRef.current,
          };
          celestialSystemRef.current.setOrbitalVisualsVisibility(
            shouldShowOrbitalLines,
            0.20,
            isPlanetsAlignedRef.current
          );
        }

        // Camera Orbit Controller: Smooth Geodesic Glide & Continuous Tracking
        cameraOrbitControllerRef.current.update(nowMs, earthPos, isOrbitalPlayingRef.current);

        // Feed updated Sun & Moon vectors and lighting uniforms into Earth, Atmosphere, and Cloud Shaders (3-Point Lighting)
        const effectiveSunDir = sunDirection.clone();
        const effectiveMoonDir = moonDirection.clone();
        if (globeGroupRef.current) {
          effectiveSunDir.applyQuaternion(globeGroupRef.current.quaternion);
          effectiveMoonDir.applyQuaternion(globeGroupRef.current.quaternion);
        }

        if (earthShaderMatRef.current) {
          earthShaderMatRef.current.uniforms.u_sunDirection.value.copy(effectiveSunDir);
          earthShaderMatRef.current.uniforms.u_moonDirection.value.copy(effectiveMoonDir);
          earthShaderMatRef.current.uniforms.u_sunIntensity.value = sunIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_ambientIntensity.value = ambientLightIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_cityLightIntensity.value = cityLightIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_cloudsOpacity.value = cloudsOpacityRef.current;
          earthShaderMatRef.current.uniforms.u_cloudsTime.value = elapsed;
        }
        if (atmosphereMatRef.current) {
          atmosphereMatRef.current.uniforms.u_sunDirection.value.copy(effectiveSunDir);
          atmosphereMatRef.current.uniforms.u_moonDirection.value.copy(effectiveMoonDir);
          atmosphereMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensityRef.current;
        }
        if (cloudsMatRef.current) {
          cloudsMatRef.current.uniforms.u_sunDirection.value.copy(effectiveSunDir);
          cloudsMatRef.current.uniforms.u_moonDirection.value.copy(effectiveMoonDir);
          cloudsMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensityRef.current;
          cloudsMatRef.current.uniforms.u_time.value = elapsed;
          cloudsMatRef.current.uniforms.u_opacity.value = cloudsOpacityRef.current;
        }
      }

      // Tick animated Great-Circle Arcs pulses
      if (geodesicEngineRef.current) {
        geodesicEngineRef.current.tick(elapsed);
      }

      // Rotate dynamic clouds slightly faster than earth
      if (cloudsMeshRef.current && cloudsMeshRef.current.visible) {
        cloudsMeshRef.current.rotation.y += 0.0002;
      }

      // 12. Dynamic camera centering in available screen space
      const currentWidth = container.clientWidth || width;
      const currentHeight = container.clientHeight || height;

      // Combined lateral panel camera offsetting:
      // "SEMPRE QUE FOCARMOS EM UM ASTRO, RECALCULAR POSIÇÃO PARA NÃO SOBREPOR UM PAINEL OU OUTRO ELEMENTO (ESPAÇO DISPONÍVEL)"
      // - When a panel is open on the RIGHT (Trajectory card, Solar Simulator, Texture Info):
      //   Available space is [0, currentWidth - panelWidth].
      //   Shifting view offset by + (panelWidth / 2) centers the 3D subject in the open space on the left!
      // - When a panel is open on the LEFT (Telemetry Card):
      //   Available space is [panelWidth, currentWidth].
      //   Shifting view offset by - (panelWidth / 2) centers the 3D subject in the open space on the right!
      let targetShiftX = 0;
      if (currentWidth >= 640) {
        if (selectedAstroRef.current) {
          // Trajectory card on the right (w-80 = 320px, sm:w-96 = 384px, plus right margin 24px = ~408px)
          const panelWidth = currentWidth >= 768 ? 408 : 344;
          targetShiftX = Math.round(panelWidth * 0.50);
        } else if (isSolarSimulatorOpenRef.current) {
          const panelWidth = isSolarSimulatorExpandedRef.current
            ? currentWidth * 0.50
            : Math.min(490, Math.max(384, currentWidth * 0.42));
          targetShiftX = Math.round(panelWidth * 0.50);
        } else if (isTextureInfoOpenRef.current) {
          const panelWidth = 340;
          targetShiftX = Math.round(panelWidth * 0.50);
        } else if (isTelemetryOpenRef.current && !isAstralModeRef.current) {
          // Telemetry card on the LEFT (440px to 500px + 76px margin)
          const panelWidth = currentWidth >= 1024 ? 500 : currentWidth >= 768 ? 480 : 440;
          const leftMargin = currentWidth >= 1024 ? 88 : currentWidth >= 768 ? 84 : 76;
          const totalLeftOccupied = Math.min(panelWidth + leftMargin, currentWidth * 0.55);
          targetShiftX = -Math.round(totalLeftOccupied * 0.50);
        }
      }

      currentShiftPxRef.current += (targetShiftX - currentShiftPxRef.current) * 0.06;
      const targetRounded = Math.round(currentShiftPxRef.current);
      if (Math.abs(targetRounded) >= 1) {
        if (Math.abs(targetRounded - lastAppliedShiftPxRef.current) >= 1) {
          lastAppliedShiftPxRef.current = targetRounded;
          camera.setViewOffset(currentWidth, currentHeight, targetRounded, 0, currentWidth, currentHeight);
        }
      } else if (camera.view && camera.view.enabled) {
        lastAppliedShiftPxRef.current = 0;
        camera.clearViewOffset();
        camera.aspect = currentWidth / currentHeight;
        camera.updateProjectionMatrix();
      }

      // 13. Project 3D state coordinates onto 2D screen space (suppressed during Astral Mode, Solar view, or orbital simulation)
      const shouldHidePins =
        isAstralModeRef.current ||
        cameraFocusModeRef.current === 'sun' ||
        camera.position.distanceTo(globeGroup.position) > 22 ||
        isOrbitalPlayingRef.current;

      if (shouldHidePins) {
        if (projectedPinsRef.current.length > 0) {
          projectedPinsRef.current = [];
          setProjectedPins([]);
        }
      } else {
        // Throttle pin coordinate projection to ~30fps to keep main thread and WebGL at solid 60fps
        if (nowMs - lastPinsSyncMsRef.current > 33) {
          lastPinsSyncMsRef.current = nowMs;
          camera.getWorldPosition(cameraWorldPos);

          const camMoved =
            camera.position.distanceToSquared(lastPinsCamPosRef.current) > 0.0001 ||
            Math.abs(camera.quaternion.dot(lastPinsCamQuatRef.current) - 1.0) > 0.0001;
          const globeMoved =
            Math.abs(globeGroup.rotation.y - lastPinsGlobeRotYRef.current) > 0.0001;
          const sizeChanged =
            currentWidth !== lastPinsWidthRef.current ||
            currentHeight !== lastPinsHeightRef.current;

          if (camMoved || globeMoved || sizeChanged || projectedPinsRef.current.length === 0) {
            lastPinsCamPosRef.current.copy(camera.position);
            lastPinsCamQuatRef.current.copy(camera.quaternion);
            lastPinsGlobeRotYRef.current = globeGroup.rotation.y;
            lastPinsWidthRef.current = currentWidth;
            lastPinsHeightRef.current = currentHeight;

            const newPins: ProjectedPin[] = [];

            Object.entries(state3DVectors.current).forEach(([stateId, worldPos]) => {
              tempVec.copy(worldPos);
              tempVec.applyMatrix4(globeGroup.matrixWorld);

              const dot = tempVec.dot(cameraWorldPos);
              const isVisible = dot > 1.85; // Front hemisphere facing camera

              if (isVisible) {
                tempVec.project(camera);
                const screenX = (tempVec.x * 0.5 + 0.5) * currentWidth;
                const screenY = (-(tempVec.y * 0.5) + 0.5) * currentHeight;
                const dist = cameraWorldPos.distanceTo(worldPos);
                const scale = Math.max(0.6, Math.min(1.25, 4.8 / dist));

                newPins.push({
                  stateId,
                  x: screenX,
                  y: screenY,
                  visible: true,
                  scale,
                  distance: dist,
                });
              }
            });

            projectedPinsRef.current = newPins;
            setProjectedPins(newPins);
          }
        }
      }

      // 14. Animate Celestial Trajectory and Solar Corona Orientation
      if (celestialSystemRef.current) {
        celestialSystemRef.current.tickTrajectory(elapsed, camera);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 13. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      earthGeo.dispose();
      earthShaderMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      starfield.geometry?.dispose();
      (starfield.material as THREE.Material)?.dispose();
      celestial.dispose();
      geodesicEngine.dispose();
      if (stateOverlaysMeshRef.current) {
        stateOverlaysMeshRef.current.geometry.dispose();
        (stateOverlaysMeshRef.current.material as THREE.Material).dispose();
      }
      if (timerRef.current && typeof timerRef.current.dispose === 'function') {
        timerRef.current.dispose();
      }
      renderer.domElement.removeEventListener('mousedown', handlePanMouseDown);
      window.removeEventListener('mouseup', handlePanMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectScenePreset = useCallback(
    (presetId: string) => {
      setActiveScenePresetId(presetId);
      const preset = ASTRONOMICAL_SCENE_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      if (['sistema-ortogonal', 'terra-lua', 'alinhamento-astros', 'eclipse-solar', 'heliocentrico-geral', 'gigantes-gasosos'].includes(presetId)) {
        setShowSolarSystem(true);
      }

      const effectiveDay = preset.targetDayOfYear !== undefined ? preset.targetDayOfYear : orbitalDayOfYearRef.current;
      const effectiveAlign = preset.alignPlanets !== undefined ? preset.alignPlanets : isPlanetsAlignedRef.current;

      if (preset.targetDayOfYear !== undefined) {
        setOrbitalDayOfYear(preset.targetDayOfYear);
        orbitalDayOfYearRef.current = preset.targetDayOfYear;
      }

      if (preset.alignPlanets !== undefined) {
        setIsPlanetsAligned(preset.alignPlanets);
        isPlanetsAlignedRef.current = preset.alignPlanets;
      }

      setCameraFocusMode(preset.focusMode);
      cameraFocusModeRef.current = preset.focusMode;

      // Atualiza coordenadas celestes de imediato para garantir que a Terra e os astros estejam na posição de destino exata
      let destinationEarthPos = globeGroupRef.current ? globeGroupRef.current.position.clone() : new THREE.Vector3(14, 0, 0);
      let moonWorldPos = new THREE.Vector3();

      if (celestialSystemRef.current) {
        const effHour = simulatedSolarHourRef.current !== null ? simulatedSolarHourRef.current : liveBrasilia.floatHours;
        const utcHour = (effHour + 3) % 24;
        const animDate = new Date();
        animDate.setUTCHours(Math.floor(utcHour), Math.floor((utcHour % 1) * 60), 0, 0);

        const { earthPos, moonPos } = celestialSystemRef.current.updatePositions(
          animDate,
          currentSeasonRef.current,
          null,
          showCosmicBeamsRef.current,
          effectiveDay,
          effectiveAlign
        );
        if (globeGroupRef.current && earthPos) {
          globeGroupRef.current.position.copy(earthPos);
          destinationEarthPos = earthPos.clone();
        }
        if (moonPos) {
          moonWorldPos = moonPos.clone();
        }
      }

      let lookTarget = new THREE.Vector3(preset.lookTarget.x, preset.lookTarget.y, preset.lookTarget.z);
      let camPos = new THREE.Vector3(preset.camOffset.x, preset.camOffset.y, preset.camOffset.z);

      if (preset.id === 'foco-brasil') {
        lookTarget = destinationEarthPos.clone();
        let normal = latLonToSphereVector3(-14.235, -51.925, 1.0).normalize();
        if (globeGroupRef.current) {
          normal.applyQuaternion(globeGroupRef.current.quaternion);
        }
        camPos = destinationEarthPos.clone().add(normal.multiplyScalar(5.5));
      } else if (preset.id === 'solsticio-verao' || preset.id === 'solsticio-inverno' || preset.id === 'equinocio-outono') {
        lookTarget = destinationEarthPos.clone();
        camPos = destinationEarthPos.clone().add(new THREE.Vector3(preset.camOffset.x, preset.camOffset.y, preset.camOffset.z));
      } else if (preset.id === 'terra-lua') {
        lookTarget = destinationEarthPos.clone().lerp(moonWorldPos, 0.35);
        camPos = destinationEarthPos.clone().add(new THREE.Vector3(preset.camOffset.x, preset.camOffset.y, preset.camOffset.z));
      } else if (preset.id === 'eclipse-solar') {
        // Alinhamento na frente da Terra olhando diretamente para a silhueta da Lua eclipsando o Sol
        lookTarget = new THREE.Vector3(0, 0, 0);
        const dirToSun = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), destinationEarthPos).normalize();
        camPos = destinationEarthPos.clone().add(dirToSun.multiplyScalar(2.6));
      } else if (preset.focusMode === 'earth') {
        lookTarget = destinationEarthPos.clone().add(lookTarget);
        camPos = destinationEarthPos.clone().add(camPos);
      }

      cameraOrbitControllerRef.current.targetMesh = null;
      smoothGlideCamera(camPos, lookTarget, Math.min(preset.durationMs || 1400, 1400), preset.focusMode, null);
    },
    [smoothGlideCamera, liveBrasilia.floatHours]
  );

  const handleTogglePlanetsAlignment = useCallback(() => {
    setIsPlanetsAligned((prev) => {
      const next = !prev;
      isPlanetsAlignedRef.current = next;
      if (next) {
        handleSelectScenePreset('alinhamento-astros');
      }
      return next;
    });
  }, [handleSelectScenePreset]);

  const handleToggleOrbitalPlay = useCallback(() => {
    setIsOrbitalPlaying((prev) => {
      const next = !prev;
      if (next) {
        // When starting orbital emulation: automatically focus camera on the Sun to observe planets revolving
        handleSetCameraFocusMode('sun');
      }
      return next;
    });
  }, [handleSetCameraFocusMode]);

  const handleToggleTelemetry = useCallback(() => {
    if (isTelemetryOpen) {
      closeAllPanelsExcept('none');
      handleResetView();
    } else {
      closeAllPanelsExcept('telemetry');
      if (onToggleTelemetry) {
        onToggleTelemetry();
      } else {
        setInternalIsTelemetryOpen(true);
      }
      isTelemetryOpenRef.current = true;
    }
  }, [closeAllPanelsExcept, onToggleTelemetry, isTelemetryOpen, handleResetView]);

  const handleSelectAstro = useCallback(
    (astro: CelestialBodyInfo | null) => {
      if (!astro) {
        closeAllPanelsExcept('none');
        handleResetView();
        return;
      }
      closeAllPanelsExcept('trajectory');
      setSelectedAstro(astro);
      selectedAstroRef.current = astro;

      const targetStateId = currentTargetStateIdRef.current || 'DF';
      let worldStatePos: THREE.Vector3 | null = null;
      if (globeGroupRef.current) {
        const localVec =
          state3DVectors.current[targetStateId] ||
          latLonToSphereVector3(-15.78, -47.93, SCENE_GLOBE_RADIUS);
        globeGroupRef.current.updateMatrixWorld(true);
        worldStatePos = localVec.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
      }
      const stateObj = BRAZIL_STATES_GEO[targetStateId];
      const stateName = stateObj ? stateObj.name : 'Brasil';
      const telemetry =
        celestialSystemRef.current?.setCosmicTrajectory(
          astro.id,
          worldStatePos,
          targetStateId,
          stateName
        ) || null;
      setTrajectoryTelemetry(telemetry);
    },
    [closeAllPanelsExcept, handleResetView]
  );

  const handleFocusAstroCamera = useCallback(
    (astro: CelestialBodyInfo) => {
      if (!cameraRef.current || !controlsRef.current) return;
      setActiveSelectedAstroId(astro.id);

      if (astro.id === 'sol') {
        const sunPos = new THREE.Vector3(0, 0, 0);
        // Elevated perspective centered on the Sun with wide clearance
        const targetCamPos = new THREE.Vector3(14, 26, 40);
        cameraOrbitControllerRef.current.targetMesh = null;
        smoothGlideCamera(targetCamPos, sunPos, 1500, 'sun', 'sol');
        return;
      }

      if (astro.id === 'terra') {
        handleResetView();
        return;
      }

      if (astro.id === 'lua') {
        const moonWorld = new THREE.Vector3();
        if (celestialSystemRef.current) {
          celestialSystemRef.current.moonMesh.getWorldPosition(moonWorld);
        } else {
          moonWorld.copy(astro.position);
        }
        const earthPos = globeGroupRef.current ? globeGroupRef.current.position.clone() : new THREE.Vector3(14, 0, 0);
        const earthToMoon = moonWorld.clone().sub(earthPos).normalize();
        // Camera positioned slightly behind and above the Moon looking towards the Moon with Earth in the backdrop
        const camDir = earthToMoon.clone().multiplyScalar(0.7).add(new THREE.Vector3(0, 0.45, 0.55)).normalize();
        const targetCamPos = moonWorld.clone().add(camDir.multiplyScalar(2.4));

        cameraOrbitControllerRef.current.targetMesh = celestialSystemRef.current?.moonMesh || null;
        smoothGlideCamera(targetCamPos, moonWorld, 1300, 'moon', 'lua');
        return;
      }

      // Other planets (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune)
      const planetMesh = celestialSystemRef.current?.planetsGroup.getObjectByName(`planet-${astro.id}`) || null;
      const worldPos = new THREE.Vector3();
      if (planetMesh) {
        planetMesh.getWorldPosition(worldPos);
      } else {
        worldPos.copy(astro.position);
      }

      // Proportional camera distance based on apparent size, rings, and safe diagramming margin
      const isSaturn = astro.id === 'saturno' || astro.name === 'Saturno';
      const isJupiter = astro.id === 'jupiter' || astro.name === 'Júpiter';
      const baseMultiplier = isSaturn ? 5.2 : isJupiter ? 4.2 : 3.8;
      const dist = Math.max(3.0, Math.min(8.8, astro.apparentSize * baseMultiplier + 1.8));

      // Calculate camera position vector
      const radialDir = worldPos.clone().normalize();
      if (radialDir.lengthSq() < 0.001) radialDir.set(0, 0, 1);

      const camDir = radialDir.clone().add(new THREE.Vector3(0, 0.40, 0.35)).normalize();
      const targetCamPos = worldPos.clone().add(camDir.multiplyScalar(dist));

      cameraOrbitControllerRef.current.targetMesh = planetMesh;
      smoothGlideCamera(targetCamPos, worldPos, 1400, 'planet', astro.id);
    },
    [handleResetView, smoothGlideCamera]
  );

  const lastCenterTriggerRef = useRef<number>(centerTrigger || 0);
  useEffect(() => {
    if (centerTrigger !== undefined && centerTrigger > 0 && centerTrigger !== lastCenterTriggerRef.current) {
      lastCenterTriggerRef.current = centerTrigger;
      handleResetView();
    }
  }, [centerTrigger, handleResetView]);

  const lastZoomInTriggerRef = useRef<number>(zoomInTrigger || 0);
  useEffect(() => {
    if (zoomInTrigger !== undefined && zoomInTrigger > 0 && zoomInTrigger !== lastZoomInTriggerRef.current) {
      lastZoomInTriggerRef.current = zoomInTrigger;
      handleZoomIn();
    }
  }, [zoomInTrigger]);

  const lastZoomOutTriggerRef = useRef<number>(zoomOutTrigger || 0);
  useEffect(() => {
    if (zoomOutTrigger !== undefined && zoomOutTrigger > 0 && zoomOutTrigger !== lastZoomOutTriggerRef.current) {
      lastZoomOutTriggerRef.current = zoomOutTrigger;
      handleZoomOut();
    }
  }, [zoomOutTrigger]);

  const handleNavigateToAstro = useCallback(
    (astroId: string) => {
      setActiveSelectedAstroId(astroId);
      if (astroId === 'terra') {
        closeAllPanelsExcept('none');
        handleResetView();
        return;
      }
      setShowSolarSystem(true);
      if (celestialSystemRef.current) {
        const bodies = celestialSystemRef.current.getAllCelestialBodies(new Date(), currentSeason);
        const targetBody = bodies.find((b) => b.id === astroId);
        if (targetBody) {
          handleSelectAstro(targetBody);
          handleFocusAstroCamera(targetBody);
        }
      }
    },
    [closeAllPanelsExcept, currentSeason, handleResetView, handleSelectAstro, handleFocusAstroCamera]
  );

  const handlePinClick = useCallback(
    (stateId: string) => {
      onStateClick(stateId);
      if (!isTelemetryOpen) {
        closeAllPanelsExcept('telemetry');
        handleToggleTelemetry();
      }
      focusStateOnGlobe(stateId);
    },
    [onStateClick, isTelemetryOpen, closeAllPanelsExcept, handleToggleTelemetry, focusStateOnGlobe]
  );

  const handleTextureModeChange = useCallback((mode: GlobeTextureMode) => {
    setActiveTextureMode(mode);
    closeAllPanelsExcept('texture_info');
    setIsTextureInfoOpen(true);
    isTextureInfoOpenRef.current = true;
  }, [closeAllPanelsExcept]);

  return (
    <div
      id="container-palco-globo-3d"
      className="container-palco-globo-3d container-globo-3d-r3f relative w-full h-full bg-[#010613] select-none overflow-hidden"
    >
      {/* 3D WebGL Canvas Mount Container with Grab / Grabbing Cursor */}
      <div
        ref={mountRef}
        id="canvas-globo-3d-mount"
        className={`camada-canvas-globo-3d absolute inset-0 w-full h-full ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Nautical Compass Loading Preload Screen with Auto-Dismiss */}
      {!preloadProgress.isReady && !compassDismissed && !preloadProgress.fromCache && (
        <CompassLoadingScreen
          message="Traçando a Órbita Terrestre 3D..."
          subtitle="Carregando malha orbital da Terra, texturas de alta definição e efemérides solares..."
          progressPercent={preloadProgress.percent}
          currentAsset={preloadProgress.currentAsset}
          isDismissible={true}
          onDismiss={() => setCompassDismissed(true)}
        />
      )}

      {/* Floating Preload / Cache Progress Indicator in HUD (Auto-dismisses in 4s) */}
      <GlobeLoadingProgress progress={preloadProgress} />

      {/* Camada Centralizada de Painéis, HUD e Modais do Globo 3D */}
      <GlobePanelsLayer
        showNavPill={showNavPill}
        isTelemetryOpen={isTelemetryOpen}
        onToggleTelemetry={handleToggleTelemetry}
        telemetryData={telemetryData}
        moonPhaseData={moonPhaseData}
        activeRoutes={activeRoutes}
        allCapitalRoutes={allCapitalRoutes}
        activeAdaptedRoute={activeAdaptedRoute}
        showCosmicBeams={showCosmicBeams}
        onToggleCosmicBeams={() => setShowCosmicBeams((prev) => !prev)}
        activeSelectedAstroId={activeSelectedAstroId}
        onNavigateToAstro={handleNavigateToAstro}
        onPinClick={handlePinClick}
        onSelectCapitalRoute={handleSelectCapitalRoute}
        onCustomCityRoute={handleCustomCityRoute}
        onResetCapitalsRoute={handleResetCapitalsRoute}
        onResetView={handleResetView}
        isTextureInfoOpen={isTextureInfoOpen}
        onToggleTextureInfoPanel={() => {
          if (!isTextureInfoOpen) {
            closeAllPanelsExcept('texture_info');
            setIsTextureInfoOpen(true);
            isTextureInfoOpenRef.current = true;
          } else {
            setIsTextureInfoOpen(false);
            isTextureInfoOpenRef.current = false;
          }
        }}
        onCloseTextureInfoPanel={() => {
          setIsTextureInfoOpen(false);
          isTextureInfoOpenRef.current = false;
        }}
        activeTextureMode={activeTextureMode}
        onChangeTextureMode={handleTextureModeChange}
        showSolarSystem={showSolarSystem}
        onToggleSolarSystem={() => setShowSolarSystem((prev) => !prev)}
        selectedAstro={selectedAstro}
        trajectoryTelemetry={trajectoryTelemetry}
        onSelectAstro={handleSelectAstro}
        onFocusAstroCamera={handleFocusAstroCamera}
        isAxialRotationActive={isAxialRotationActive}
        onToggleAxialRotation={() => setIsAxialRotationActive((prev) => !prev)}
        cloudsVisible={cloudsVisible}
        onToggleClouds={() => setCloudsVisible((prev) => !prev)}
        showGeodesicRoutes={showGeodesicRoutes}
        onToggleGeodesicRoutes={() => setShowGeodesicRoutes((prev) => !prev)}
        currentSeason={currentSeason}
        onChangeSeason={(season) => setCurrentSeason(season)}
        showBorders={bordersVisible}
        onToggleBorders={() => setBordersVisible((prev) => !prev)}
        borderRegionFilter={borderRegionFilter}
        onChangeBorderRegionFilter={(reg) => setBorderRegionFilter(reg)}
        pinDisplayMode={pinDisplayMode}
        onTogglePinDisplayMode={() =>
          setPinDisplayMode((prev) => (prev === 'all' ? 'compact' : prev === 'compact' ? 'none' : 'all'))
        }
        simulatedSolarHour={simulatedSolarHour}
        onChangeSolarHour={(h) => {
          setSimulatedSolarHour(h);
          simulatedSolarHourRef.current = h;
        }}
        isSolarCyclePlaying={isSolarCyclePlaying}
        onToggleSolarCycle={() => setIsSolarCyclePlaying((prev) => !prev)}
        ambientLightIntensity={ambientLightIntensity}
        onChangeAmbientLightIntensity={(intensity) => setAmbientLightIntensity(intensity)}
        moonLightIntensity={moonLightIntensity}
        onChangeMoonLightIntensity={(intensity) => setMoonLightIntensity(intensity)}
        isSolarSimulatorOpen={isSolarSimulatorOpen}
        onToggleSolarSimulator={() => {
          if (!isSolarSimulatorOpen) {
            closeAllPanelsExcept('solar_simulator');
            setIsSolarSimulatorOpen(true);
            isSolarSimulatorOpenRef.current = true;
          } else {
            setIsSolarSimulatorOpen(false);
            isSolarSimulatorOpenRef.current = false;
          }
        }}
        onCloseSolarSimulator={() => {
          setIsSolarSimulatorOpen(false);
          isSolarSimulatorOpenRef.current = false;
        }}
        activeScenePresetId={activeScenePresetId}
        onSelectScenePreset={handleSelectScenePreset}
        isSolarSimulatorExpanded={isSolarSimulatorExpanded}
        onToggleExpandSolarSimulator={(expanded) => setIsSolarSimulatorExpanded(expanded)}
        solarCycleSpeed={solarCycleSpeed}
        onChangeSolarCycleSpeed={(spd) => {
          setSolarCycleSpeed(spd);
          solarCycleSpeedRef.current = spd;
        }}
        sunIntensity={sunIntensity}
        onChangeSunIntensity={(intensity) => {
          setSunIntensity(intensity);
          sunIntensityRef.current = intensity;
          if (earthShaderMatRef.current) {
            earthShaderMatRef.current.uniforms.u_sunIntensity.value = intensity;
          }
        }}
        cityLightIntensity={cityLightIntensity}
        onChangeCityLightIntensity={(intensity) => {
          setCityLightIntensity(intensity);
          cityLightIntensityRef.current = intensity;
          if (earthShaderMatRef.current) {
            earthShaderMatRef.current.uniforms.u_cityLightIntensity.value = intensity;
          }
        }}
        cloudsOpacity={cloudsOpacity}
        onChangeCloudsOpacity={(opacity) => {
          setCloudsOpacity(opacity);
          cloudsOpacityRef.current = opacity;
          if (earthShaderMatRef.current) {
            earthShaderMatRef.current.uniforms.u_cloudsOpacity.value = opacity;
          }
          if (cloudsMatRef.current) {
            cloudsMatRef.current.uniforms.u_opacity.value = opacity;
          }
        }}
        onResetLightingDefaults={() => {
          setSunIntensity(1.25);
          sunIntensityRef.current = 1.25;
          setMoonLightIntensity(0.65);
          moonLightIntensityRef.current = 0.65;
          setAmbientLightIntensity(0.16);
          ambientLightIntensityRef.current = 0.16;
          setCityLightIntensity(1.40);
          cityLightIntensityRef.current = 1.40;
          setCloudsOpacity(0.22);
          cloudsOpacityRef.current = 0.22;
          if (earthShaderMatRef.current) {
            earthShaderMatRef.current.uniforms.u_sunIntensity.value = 1.25;
            earthShaderMatRef.current.uniforms.u_moonIntensity.value = 0.65;
            earthShaderMatRef.current.uniforms.u_ambientIntensity.value = 0.16;
            earthShaderMatRef.current.uniforms.u_cityLightIntensity.value = 1.40;
            earthShaderMatRef.current.uniforms.u_cloudsOpacity.value = 0.22;
          }
          if (cloudsMatRef.current) {
            cloudsMatRef.current.uniforms.u_moonIntensity.value = 0.65;
            cloudsMatRef.current.uniforms.u_opacity.value = 0.22;
          }
          if (atmosphereMatRef.current) {
            atmosphereMatRef.current.uniforms.u_moonIntensity.value = 0.65;
          }
        }}
        liveBrasilia={liveBrasilia}
        orbitalDayOfYear={orbitalDayOfYear}
        onChangeOrbitalDayOfYear={(d) => {
          setOrbitalDayOfYear(d);
          orbitalDayOfYearRef.current = d;
        }}
        isOrbitalPlaying={isOrbitalPlaying}
        onToggleOrbitalPlay={handleToggleOrbitalPlay}
        orbitalSpeedDaysPerSec={orbitalSpeedDaysPerSec}
        onChangeOrbitalSpeed={(spd) => setOrbitalSpeedDaysPerSec(spd)}
        cameraFocusMode={cameraFocusMode}
        onChangeCameraFocusMode={handleSetCameraFocusMode}
        currentOrbitalState={currentOrbitalState}
        isPlanetsAligned={isPlanetsAligned}
        onTogglePlanetsAlignment={handleTogglePlanetsAlignment}
        onSelectPlanetAstro={(astroId) => {
          const allAstros = celestialSystemRef.current?.getAllCelestialBodies() || [];
          const astro = allAstros.find((a) => a.id === astroId);
          if (astro) handleFocusAstroCamera(astro);
        }}
        isAstralMode={isAstralMode}
        onCloseAllPanels={() => closeAllPanelsExcept('none')}
      />

      {/* Camada de Brasões Heráldicos e Pins dos Estados Brasileiros */}
      <StateHeraldicPinsOverlay
        projectedPins={projectedPins}
        completedStateIds={completedStateIds}
        hoveredStateId={hoveredStateId}
        selectedStateId={selectedStateId}
        activeAdaptedRoute={activeAdaptedRoute}
        pinDisplayMode={pinDisplayMode}
        isAstralMode={isAstralMode}
        onPinClick={handlePinClick}
        onStateHover={onStateHover}
      />
    </div>
  );
};
