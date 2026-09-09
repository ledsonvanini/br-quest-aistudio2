/**
 * BrazilGlobeR3F - Photorealistic 3D Globe with Astronomical Solar System,
 * Geodesic Inter-State Arcs, Day/Night VIIRS City Lights, and Cosmic Telemetry.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  createEarthShaderMaterial,
  createAtmosphereMaterial,
  createCloudShaderMaterial,
  latLonToSphereVector3,
  SCENE_GLOBE_RADIUS,
  GlobePreloadProgress,
  StateAstrometryTelemetry,
  MoonPhaseData,
  GeodesicRoute,
} from '../../lib/globeEngine';
import { GlobeTelemetryCard } from '../globe/GlobeTelemetryCard';
import { GlobeControlsHUD, BorderRegionFilter } from '../globe/GlobeControlsHUD';
import { GlobeSolarSimulatorPanel } from '../globe/GlobeSolarSimulatorPanel';
import { GlobeTextureInfoPanel } from '../globe/GlobeTextureInfoPanel';
import { GlobeLoadingProgress } from '../globe/GlobeLoadingProgress';
import { CelestialInteractiveOverlay } from '../globe/CelestialInteractiveOverlay';
import { CompassLoadingScreen } from './CompassLoadingScreen';
import { StateHeraldicShield } from './StateHeraldicShield';
import { Hand } from 'lucide-react';
import { findCityByName } from '../../data/brazilCitiesGeo';
import {
  ProjectedCelestialPin,
  CelestialBodyInfo,
  CosmicTrajectoryTelemetry,
} from '../../lib/globeEngine/types';

export type { GlobeTextureMode };

function buildBorderPoints(features: any[], regionFilter: BorderRegionFilter = 'all'): number[] {
  const points: number[] = [];
  features.forEach((feat: any) => {
    // Correctly extract state abbreviation handling IBGE/SimpleMaps ids like "BRRS" -> "RS"
    const rawId = feat.properties?.id || feat.properties?.sigla || feat.id;
    const uf = typeof rawId === 'string' ? rawId.replace(/^BR/i, '').toUpperCase() : '';
    const stateGeo = uf ? BRAZIL_STATES_GEO[uf] : null;
    if (regionFilter !== 'all' && stateGeo && stateGeo.region !== regionFilter) {
      return;
    }
    const geom = feat.geometry;
    if (!geom) return;

    const processPolygon = (coords: number[][]) => {
      for (let i = 0; i < coords.length - 1; i++) {
        const [lon1, lat1] = coords[i];
        const [lon2, lat2] = coords[i + 1];
        // Elevation 1.012 ensures lines render crisply above terrain with zero z-fighting
        const p1 = latLonToSphereVector3(lat1, lon1, SCENE_GLOBE_RADIUS * 1.012);
        const p2 = latLonToSphereVector3(lat2, lon2, SCENE_GLOBE_RADIUS * 1.012);
        points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    };

    if (geom.type === 'Polygon') {
      geom.coordinates.forEach((ring: any) => processPolygon(ring));
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach((poly: any) => {
        poly.forEach((ring: any) => processPolygon(ring));
      });
    }
  });
  return points;
}

/**
 * Builds a discrete, subtle tinted 3D mesh overlay for Brazilian states,
 * color-coded by macro-region with gentle opacity to enhance contrast and state boundaries.
 */
function buildBrazilStateOverlaysMesh(features: any[], regionFilter: BorderRegionFilter = 'all'): THREE.Mesh | null {
  const positions: number[] = [];
  const colors: number[] = [];

  // Regional macro palette:
  // Norte: Verde Floresta / Esmeralda Escuro
  // Nordeste: Âmbar Dourado #f59e0b
  // Centro-Oeste: Amarelo Sol #eab308
  // Sudeste: Azul Safira #0284c7
  // Sul: Púrpura Nobre #a855f7
  const REGION_COLORS: Record<string, { r: number; g: number; b: number }> = {
    'Norte': { r: 0.035, g: 0.52, b: 0.35 },       // Verde Floresta Tropical / Esmeralda Escuro
    'Nordeste': { r: 0.96, g: 0.62, b: 0.15 },    // Warm golden amber #f59e0b
    'Centro-Oeste': { r: 0.92, g: 0.76, b: 0.12 },// Sun wheat #eab308
    'Sudeste': { r: 0.01, g: 0.52, b: 0.78 },     // Sapphire #0284c7
    'Sul': { r: 0.66, g: 0.33, b: 0.97 },         // Purple #a855f7
  };

  // Verde Brasil com tom mais escuro e nobre (escurecido conforme solicitado)
  const DEFAULT_GREEN = { r: 0.02, g: 0.38, b: 0.22 };

  features.forEach((feat: any) => {
    const rawId = feat.properties?.id || feat.properties?.sigla || feat.id;
    const uf = typeof rawId === 'string' ? rawId.replace(/^BR/i, '').toUpperCase() : '';
    const stateGeo = uf ? BRAZIL_STATES_GEO[uf] : null;
    // O Mapa do Brasil deve ter preenchimento para todos os estados com cor verde e opacidade de 50%.
    // Ao escolher regiões, agrupar por cor para cada região
    const regionName = stateGeo?.region || 'Sudeste';
    let c = DEFAULT_GREEN;
    if (regionFilter !== 'all') {
      c = REGION_COLORS[regionName] || DEFAULT_GREEN;
    }

    const geom = feat.geometry;
    if (!geom) return;

    const processRing = (ring: number[][]) => {
      if (ring.length < 3) return;
      const v2s = ring.map((pt) => new THREE.Vector2(pt[0], pt[1]));
      try {
        const triangles = THREE.ShapeUtils.triangulateShape(v2s, []);
        for (let i = 0; i < triangles.length; i++) {
          const tri = triangles[i];
          for (let j = 0; j < 3; j++) {
            const idx = tri[j];
            const [lon, lat] = ring[idx];
            // Elevation 1.006 sits snugly above the globe surface (1.000) and below border lines (1.012)
            const p = latLonToSphereVector3(lat, lon, SCENE_GLOBE_RADIUS * 1.006);
            positions.push(p.x, p.y, p.z);
            colors.push(c.r, c.g, c.b);
          }
        }
      } catch {
        // Ignore any non-manifold ring edge
      }
    };

    if (geom.type === 'Polygon') {
      processRing(geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach((poly: any) => {
        if (poly && poly[0]) processRing(poly[0]);
      });
    }
  });

  if (positions.length === 0) return null;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.50, // 50% opacity per user specification
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 16;
  return mesh;
}

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

interface ProjectedPin {
  stateId: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
  distance: number;
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
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
  const currentShiftPxRef = useRef<number>(0);
  const [compassDismissed, setCompassDismissed] = useState<boolean>(false);
  const [showNavPill, setShowNavPill] = useState<boolean>(true);
  const [activeSelectedAstroId, setActiveSelectedAstroId] = useState<string>('terra');
  const [isTextureInfoOpen, setIsTextureInfoOpen] = useState<boolean>(false);
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
  const [trajectoryTelemetry, setTrajectoryTelemetry] = useState<CosmicTrajectoryTelemetry | null>(null);

  // Astral Mode: when navigating or focusing an astro/planet, hide terrestrial states & borders
  const isAstralMode = Boolean(selectedAstro && selectedAstro.id !== 'terra');
  const isAstralModeRef = useRef<boolean>(false);
  useEffect(() => {
    isAstralModeRef.current = isAstralMode;
  }, [isAstralMode]);

  // Smooth Camera Glide Animation State
  const cameraGlideRef = useRef<{
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startTime: number;
    durationMs: number;
    active: boolean;
  }>({
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startTime: 0,
    durationMs: 1400,
    active: false,
  });

  const smoothGlideCamera = useCallback(
    (targetPos: THREE.Vector3, lookTarget: THREE.Vector3, durationMs = 1400) => {
      if (!cameraRef.current || !controlsRef.current) return;
      cameraGlideRef.current = {
        startPos: cameraRef.current.position.clone(),
        endPos: targetPos.clone(),
        startTarget: controlsRef.current.target.clone(),
        endTarget: lookTarget.clone(),
        startTime: performance.now(),
        durationMs,
        active: true,
      };
    },
    []
  );

  useEffect(() => {
    isTelemetryOpenRef.current = isTelemetryOpen;
  }, [isTelemetryOpen]);

  useEffect(() => {
    showSolarSystemRef.current = showSolarSystem;
  }, [showSolarSystem]);

  useEffect(() => {
    currentSeasonRef.current = currentSeason;
  }, [currentSeason]);

  // Astrometry & Telemetry State
  const [telemetryData, setTelemetryData] = useState<StateAstrometryTelemetry | null>(null);
  const [moonPhaseData, setMoonPhaseData] = useState<MoonPhaseData | null>(null);
  const [activeRoutes, setActiveRoutes] = useState<GeodesicRoute[]>([]);
  const [allCapitalRoutes, setAllCapitalRoutes] = useState<GeodesicRoute[]>([]);
  const [activeAdaptedRoute, setActiveAdaptedRoute] = useState<GeodesicRoute | null>(null);

  // Solar Hour & Day/Night 24h Cycle Simulation (Default to 12:00 midday for optimal map clarity)
  const [simulatedSolarHour, setSimulatedSolarHour] = useState<number | null>(12);
  const [isSolarCyclePlaying, setIsSolarCyclePlaying] = useState(false);
  const simulatedSolarHourRef = useRef<number | null>(12);
  const isSolarCyclePlayingRef = useRef<boolean>(false);

  // 3-Point Planetary Lighting System & Solar Simulator State:
  // 1. Sol: Luz Hard (Key Light)
  // 2. Lua: Luz de Preenchimento / Soft Box Natural com leve glow (Fill Light)
  // 3. Ambient: Luz Fake Suave para preencher pequenos gaps
  // 4. Luzes Noturnas Urbanas (NASA VIIRS Black Marble)
  const [sunIntensity, setSunIntensity] = useState<number>(1.25);
  const sunIntensityRef = useRef<number>(1.25);
  const [moonLightIntensity, setMoonLightIntensity] = useState<number>(0.65);
  const moonLightIntensityRef = useRef<number>(0.65);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState<number>(0.16);
  const ambientLightIntensityRef = useRef<number>(0.16);
  const [cityLightIntensity, setCityLightIntensity] = useState<number>(1.40);
  const cityLightIntensityRef = useRef<number>(1.40);
  const [cloudsOpacity, setCloudsOpacity] = useState<number>(0.22);
  const cloudsOpacityRef = useRef<number>(0.22);

  // Dedicated Right Lateral Solar Simulator Panel State
  const [isSolarSimulatorOpen, setIsSolarSimulatorOpen] = useState<boolean>(false);
  const isSolarSimulatorOpenRef = useRef<boolean>(false);
  isSolarSimulatorOpenRef.current = isSolarSimulatorOpen;
  const [isSolarSimulatorExpanded, setIsSolarSimulatorExpanded] = useState<boolean>(false);
  const isSolarSimulatorExpandedRef = useRef<boolean>(false);
  isSolarSimulatorExpandedRef.current = isSolarSimulatorExpanded;
  const [solarCycleSpeed, setSolarCycleSpeed] = useState<number>(1);
  const solarCycleSpeedRef = useRef<number>(1);
  solarCycleSpeedRef.current = solarCycleSpeed;
  const lastSolarUiSyncRef = useRef<number>(0);

  // Live Official Brasília Clock (UTC-3)
  const [liveBrasilia, setLiveBrasilia] = useState<{
    formattedTime: string;
    formattedFull: string;
    hours: number;
    minutes: number;
    seconds: number;
    floatHours: number;
    periodName: string;
  }>(() => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const brtHours = (utcHours - 3 + 24) % 24;
    const period =
      brtHours >= 6 && brtHours < 12
        ? 'Manhã'
        : brtHours >= 12 && brtHours < 18
        ? 'Tarde'
        : brtHours >= 18 && brtHours < 24
        ? 'Noite'
        : 'Madrugada';
    return {
      formattedTime: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
      formattedFull: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`,
      hours: brtHours,
      minutes: utcMinutes,
      seconds: utcSeconds,
      floatHours: brtHours + utcMinutes / 60 + utcSeconds / 3600,
      periodName: period,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const utcSeconds = now.getUTCSeconds();
      const brtHours = (utcHours - 3 + 24) % 24;
      const period =
        brtHours >= 6 && brtHours < 12
          ? 'Manhã'
          : brtHours >= 12 && brtHours < 18
          ? 'Tarde'
          : brtHours >= 18 && brtHours < 24
          ? 'Noite'
          : 'Madrugada';
      setLiveBrasilia({
        formattedTime: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
        formattedFull: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`,
        hours: brtHours,
        minutes: utcMinutes,
        seconds: utcSeconds,
        floatHours: brtHours + utcMinutes / 60 + utcSeconds / 3600,
        periodName: period,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    simulatedSolarHourRef.current = simulatedSolarHour;
  }, [simulatedSolarHour]);

  useEffect(() => {
    isSolarCyclePlayingRef.current = isSolarCyclePlaying;
  }, [isSolarCyclePlaying]);

  useEffect(() => {
    sunIntensityRef.current = sunIntensity;
    if (earthShaderMatRef.current) {
      earthShaderMatRef.current.uniforms.u_sunIntensity.value = sunIntensity;
    }
  }, [sunIntensity]);

  useEffect(() => {
    ambientLightIntensityRef.current = ambientLightIntensity;
    if (earthShaderMatRef.current) {
      earthShaderMatRef.current.uniforms.u_ambientIntensity.value = ambientLightIntensity;
    }
  }, [ambientLightIntensity]);

  useEffect(() => {
    moonLightIntensityRef.current = moonLightIntensity;
    if (earthShaderMatRef.current) {
      earthShaderMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensity;
    }
    if (cloudsMatRef.current) {
      cloudsMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensity;
    }
    if (atmosphereMatRef.current) {
      atmosphereMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensity;
    }
  }, [moonLightIntensity]);

  useEffect(() => {
    cityLightIntensityRef.current = cityLightIntensity;
    if (earthShaderMatRef.current) {
      earthShaderMatRef.current.uniforms.u_cityLightIntensity.value = cityLightIntensity;
    }
  }, [cityLightIntensity]);

  useEffect(() => {
    cloudsOpacityRef.current = cloudsOpacity;
    if (earthShaderMatRef.current) {
      earthShaderMatRef.current.uniforms.u_cloudsOpacity.value = cloudsOpacity;
    }
    if (cloudsMatRef.current) {
      cloudsMatRef.current.uniforms.u_opacity.value = cloudsOpacity;
    }
  }, [cloudsOpacity]);

  const [preloadProgress, setPreloadProgress] = useState<GlobePreloadProgress>({
    loaded: 0,
    total: 4,
    percent: 0,
    currentAsset: '',
    isReady: false,
    fromCache: false,
  });

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

  // Timer instance using modern THREE.Timer API (eliminates deprecated THREE.Clock warning)
  const timerRef = useRef<any>(null);
  if (!timerRef.current) {
    if (typeof (THREE as any).Timer !== 'undefined') {
      timerRef.current = new (THREE as any).Timer();
    } else {
      let lastTime = performance.now() * 0.001;
      let totalElapsed = 0;
      timerRef.current = {
        update: () => {
          const now = performance.now() * 0.001;
          totalElapsed += Math.max(0, now - lastTime);
          lastTime = now;
        },
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
      celestialSystemRef.current.sunMesh.visible = showSolarSystem;
      celestialSystemRef.current.moonMesh.visible = showSolarSystem;
    }
  }, [showSolarSystem]);

  // Update Geodesic Routes visibility
  useEffect(() => {
    if (geodesicEngineRef.current) {
      geodesicEngineRef.current.setVisible(showGeodesicRoutes);
    }
  }, [showGeodesicRoutes]);

  // Helper to get effective date based on simulated solar hour or real time
  const getEffectiveDate = (hour: number | null): Date => {
    if (hour === null) return new Date();
    // Brasília is UTC-3, so UTC = hour + 3
    const utcHour = (hour + 3) % 24;
    const wholeHours = Math.floor(utcHour);
    const minutes = Math.floor((utcHour % 1) * 60);
    const seconds = Math.floor((((utcHour % 1) * 60) % 1) * 60);
    const d = new Date();
    d.setUTCHours(wholeHours, minutes, seconds, 0);
    return d;
  };

  // Recalculate Astrometric Telemetry & Routes on state selection change, season change, or solar hour change
  const currentTargetStateId = selectedStateId || focusedStateId || 'DF';

  useEffect(() => {
    const geo = BRAZIL_STATES_GEO[currentTargetStateId];
    if (geo) {
      const effDate = getEffectiveDate(simulatedSolarHour);
      const telemetry = calculateStateAstrometry(
        currentTargetStateId,
        geo.name,
        geo.capital,
        geo.lat,
        geo.lon,
        effDate,
        currentSeason
      );
      setTelemetryData(telemetry);

      const lunar = calculateLunarCoordinates(effDate);
      setMoonPhaseData(lunar.phase);
    }
  }, [currentTargetStateId, currentSeason, simulatedSolarHour]);

  // Update default state capital routes only when target state changes and no custom route is active
  useEffect(() => {
    if (geodesicEngineRef.current && !activeAdaptedRoute) {
      const routes = geodesicEngineRef.current.updateRoutes(currentTargetStateId);
      setAllCapitalRoutes(routes);
      setActiveRoutes(routes);
    }
  }, [currentTargetStateId]);

  // Periodic telemetry and UI sync during continuous 24h solar cycle animation
  useEffect(() => {
    if (!isSolarCyclePlaying) return;
    const interval = setInterval(() => {
      if (simulatedSolarHourRef.current !== null) {
        setSimulatedSolarHour(simulatedSolarHourRef.current);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isSolarCyclePlaying]);

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

    // 2. Camera: Focused directly on Brazil and South America
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialBrazilCam = latLonToSphereVector3(-14.235, -51.925, 5.76);
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

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.75;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.5;
    controls.minDistance = 2.15; // Deep zoom into Brazilian states
    controls.maxDistance = 18.2; // Aumentado em 30% (14.0 -> 18.2) para exibir todo o sistema solar
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = (5 * Math.PI) / 6;
    controls.autoRotate = autoRotateActive;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    controls.addEventListener('start', () => setIsDragging(true));
    controls.addEventListener('end', () => setIsDragging(false));

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.32);
    scene.add(ambientLight);

    // 6. Deep Space Background Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // 7. Celestial System (Sun, Moon, Solar System Planets, Cosmic Beams)
    const celestial = new CelestialSystem();
    celestialSystemRef.current = celestial;
    scene.add(celestial.group);

    // Initial celestial vectors from current date/season
    const solarInit = calculateSolarCoordinates(new Date(), currentSeason);
    const lunarInit = calculateLunarCoordinates(new Date());

    // 8. Globe Group (Earth + Atmosphere + Clouds + Borders)
    const globeGroup = new THREE.Group();
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

      // Handle smooth camera interpolation
      if (cameraGlideRef.current.active && cameraRef.current && controlsRef.current) {
        const now = performance.now();
        const elapsed = now - cameraGlideRef.current.startTime;
        const progress = Math.min(1.0, elapsed / cameraGlideRef.current.durationMs);
        const ease = 1 - Math.pow(1 - progress, 3); // Smooth cubic ease-out

        cameraRef.current.position.lerpVectors(
          cameraGlideRef.current.startPos,
          cameraGlideRef.current.endPos,
          ease
        );
        controlsRef.current.target.lerpVectors(
          cameraGlideRef.current.startTarget,
          cameraGlideRef.current.endTarget,
          ease
        );
        controls.update();

        if (progress >= 1.0) {
          cameraGlideRef.current.active = false;
        }
      } else {
        controls.update();
      }

      if (timerRef.current) {
        timerRef.current.update();
      }
      const elapsed = timerRef.current ? timerRef.current.getElapsed() : performance.now() * 0.001;
      const delta = timerRef.current ? timerRef.current.getDelta() : 0.016;

      // Handle continuous 24h day/night rotation cycle animation
      if (isSolarCyclePlayingRef.current) {
        const currentH = simulatedSolarHourRef.current ?? ((new Date().getUTCHours() - 3 + 24) % 24);
        const speed = solarCycleSpeedRef.current || 1;
        // Complete full 24h earth rotation in 36 seconds scaled by speed (~0.67h per second)
        const nextH = (currentH + delta * 0.67 * speed) % 24;
        simulatedSolarHourRef.current = nextH;

        // Synchronize React state at ~15fps so the slider and digital clock in the UI move in real time
        const nowMs = performance.now();
        if (nowMs - lastSolarUiSyncRef.current > 65) {
          lastSolarUiSyncRef.current = nowMs;
          setSimulatedSolarHour(nextH);
        }
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

      // Update Celestial Positions (Sun, Moon, Planets, Cosmic Beams)
      if (celestialSystemRef.current) {
        const selectedVec = state3DVectors.current[currentTargetStateId] || null;
        const { sunDirection, moonDirection } = celestialSystemRef.current.updatePositions(
          animEffectiveDate,
          currentSeason,
          selectedVec,
          showCosmicBeams
        );

        // Feed updated Sun & Moon vectors and lighting uniforms into Earth, Atmosphere, and Cloud Shaders (3-Point Lighting)
        if (earthShaderMatRef.current) {
          earthShaderMatRef.current.uniforms.u_sunDirection.value.copy(sunDirection);
          earthShaderMatRef.current.uniforms.u_moonDirection.value.copy(moonDirection);
          earthShaderMatRef.current.uniforms.u_sunIntensity.value = sunIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_ambientIntensity.value = ambientLightIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_cityLightIntensity.value = cityLightIntensityRef.current;
          earthShaderMatRef.current.uniforms.u_cloudsOpacity.value = cloudsOpacityRef.current;
          earthShaderMatRef.current.uniforms.u_cloudsTime.value = elapsed;
        }
        if (atmosphereMatRef.current) {
          atmosphereMatRef.current.uniforms.u_sunDirection.value.copy(sunDirection);
          atmosphereMatRef.current.uniforms.u_moonDirection.value.copy(moonDirection);
          atmosphereMatRef.current.uniforms.u_moonIntensity.value = moonLightIntensityRef.current;
        }
        if (cloudsMatRef.current) {
          cloudsMatRef.current.uniforms.u_sunDirection.value.copy(sunDirection);
          cloudsMatRef.current.uniforms.u_moonDirection.value.copy(moonDirection);
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
      // - Telemetry on desktop (left side): shifts globe right (- targetShiftX)
      // - Solar Simulator on desktop (right side): shifts globe left (+ targetShiftX) to center in remaining space
      let targetShiftX = 0;
      if (isTelemetryOpenRef.current && currentWidth >= 640) {
        targetShiftX -= Math.round(Math.min(260, currentWidth * 0.22));
      }
      if (isSolarSimulatorOpenRef.current && currentWidth >= 640) {
        const panelWidth = isSolarSimulatorExpandedRef.current
          ? currentWidth * 0.50
          : Math.min(490, currentWidth * 0.45);
        targetShiftX += Math.round(panelWidth * 0.50);
      }

      currentShiftPxRef.current += (targetShiftX - currentShiftPxRef.current) * 0.08;

      if (Math.abs(currentShiftPxRef.current) > 0.5) {
        camera.setViewOffset(currentWidth, currentHeight, currentShiftPxRef.current, 0, currentWidth, currentHeight);
      } else if (camera.view && camera.view.enabled) {
        camera.clearViewOffset();
        camera.aspect = currentWidth / currentHeight;
        camera.updateProjectionMatrix();
      }

      // 13. Project 3D state coordinates onto 2D screen space (suppressed during Astral Mode)
      if (isAstralModeRef.current) {
        setProjectedPins([]);
      } else {
        camera.getWorldPosition(cameraWorldPos);
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

        setProjectedPins(newPins);
      }

      // 14. Animate Celestial Trajectory when showSolarSystem is active
      if (celestialSystemRef.current && showSolarSystemRef.current) {
        celestialSystemRef.current.tickTrajectory(elapsed);
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

    // 14. Wheel Zoom Handler
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      const currentDist = camera.position.length();
      const targetDist = THREE.MathUtils.clamp(currentDist * zoomFactor, 2.15, 18.2);
      camera.position.setLength(targetDist);
      controls.update();
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      earthGeo.dispose();
      earthShaderMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      celestial.dispose();
      geodesicEngine.dispose();
      if (stateOverlaysMeshRef.current) {
        stateOverlaysMeshRef.current.geometry.dispose();
        (stateOverlaysMeshRef.current.material as THREE.Material).dispose();
      }
      if (timerRef.current && typeof timerRef.current.dispose === 'function') {
        timerRef.current.dispose();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Center / Focus Controls with smooth glide
  const handleResetView = useCallback(() => {
    setActiveSelectedAstroId('terra');
    setSelectedAstro(null);
    setTrajectoryTelemetry(null);
    celestialSystemRef.current?.clearCosmicTrajectory();
    const brazilCam = latLonToSphereVector3(-14.235, -51.925, 5.76);
    smoothGlideCamera(brazilCam, new THREE.Vector3(0, 0, 0), 1300);
  }, [smoothGlideCamera]);

  const handleToggleTelemetry = useCallback(() => {
    if (isTelemetryOpen) {
      handleResetView();
    }
    if (onToggleTelemetry) {
      onToggleTelemetry();
    } else {
      setInternalIsTelemetryOpen((prev) => !prev);
    }
  }, [onToggleTelemetry, isTelemetryOpen, handleResetView]);

  const handleSelectAstro = useCallback(
    (astro: CelestialBodyInfo | null) => {
      if (!astro) {
        handleResetView();
        return;
      }
      setSelectedAstro(astro);
      const selectedVec =
        state3DVectors.current[currentTargetStateId] ||
        latLonToSphereVector3(-14.235, -51.925, SCENE_GLOBE_RADIUS);
      const stateObj = BRAZIL_STATES_GEO[currentTargetStateId];
      const stateName = stateObj ? stateObj.name : 'Brasil';
      const telemetry =
        celestialSystemRef.current?.setCosmicTrajectory(
          astro.id,
          selectedVec,
          currentTargetStateId,
          stateName
        ) || null;
      setTrajectoryTelemetry(telemetry);
    },
    [currentTargetStateId]
  );

  const handleFocusAstroCamera = useCallback(
    (astro: CelestialBodyInfo) => {
      if (!cameraRef.current || !controlsRef.current) return;
      const astroPos = astro.position.clone();
      const dir = astroPos.clone().normalize();
      // Medium context distance: allows user to view the full astro and space context
      const distance = Math.max(4.0, Math.min(9.5, astro.apparentSize * 5.0 + 3.0));
      const targetCamPos = astroPos.clone().add(dir.clone().multiplyScalar(distance));
      targetCamPos.y += distance * 0.22; // slight elevation for a cinematic diagonal perspective
      smoothGlideCamera(targetCamPos, astroPos, 1400);
    },
    [smoothGlideCamera]
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
        handleResetView();
        setSelectedAstro(null);
        setTrajectoryTelemetry(null);
        celestialSystemRef.current?.clearCosmicTrajectory();
        return;
      }
      if (celestialSystemRef.current) {
        const bodies = celestialSystemRef.current.getAllCelestialBodies(new Date(), currentSeason);
        const targetBody = bodies.find((b) => b.id === astroId);
        if (targetBody) {
          handleSelectAstro(targetBody);
          handleFocusAstroCamera(targetBody);
        }
      }
    },
    [currentSeason, handleResetView, handleSelectAstro, handleFocusAstroCamera]
  );

  const handleZoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newLen = Math.max(2.15, cameraRef.current.position.length() * 0.8);
    cameraRef.current.position.setLength(newLen);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newLen = Math.min(18.2, cameraRef.current.position.length() * 1.25);
    cameraRef.current.position.setLength(newLen);
    controlsRef.current.update();
  };

  const handleRotateStep = (angleDeg = 15) => {
    if (!globeGroupRef.current) return;
    globeGroupRef.current.rotation.y += (angleDeg * Math.PI) / 180;
  };

  const handlePinClick = useCallback(
    (stateId: string) => {
      onStateClick(stateId);
      if (!isTelemetryOpen) {
        handleToggleTelemetry();
      }
    },
    [onStateClick, isTelemetryOpen, handleToggleTelemetry]
  );

  const handleSelectCapitalRoute = useCallback(
    (originUf: string, destUf: string) => {
      if (!geodesicEngineRef.current) return;
      const route = geodesicEngineRef.current.setAdaptedCapitalsRoute(originUf, destUf, true);
      if (!route) return;

      setActiveAdaptedRoute(route);
      setActiveRoutes([route]);

      // Orbit camera smoothly towards the midpoint of the two capitals
      const originGeo = BRAZIL_STATES_GEO[originUf];
      const destGeo = BRAZIL_STATES_GEO[destUf];
      if (originGeo && destGeo) {
        const midLat = (originGeo.lat + destGeo.lat) / 2;
        const midLon = (originGeo.lon + destGeo.lon) / 2;
        const targetCamPos = latLonToSphereVector3(midLat, midLon, 4.6);
        smoothGlideCamera(targetCamPos, new THREE.Vector3(0, 0, 0), 1400);
      }
    },
    [smoothGlideCamera]
  );

  const handleTextureModeChange = useCallback((mode: GlobeTextureMode) => {
    setActiveTextureMode(mode);
    setIsTextureInfoOpen(true);
  }, []);

  const handleCustomCityRoute = useCallback(
    (originName: string, destName: string) => {
      const cleanOrigin = originName.replace(/\s*[-/(].*$/, '').trim();
      const cleanDest = destName.replace(/\s*[-/(].*$/, '').trim();

      let originCity = findCityByName(cleanOrigin) || findCityByName(originName);
      if (!originCity) {
        const stateMatch = Object.values(BRAZIL_STATES_GEO).find(
          (s) =>
            s.capital.toLowerCase().includes(cleanOrigin.toLowerCase()) ||
            cleanOrigin.toLowerCase().includes(s.capital.toLowerCase()) ||
            s.name.toLowerCase().includes(cleanOrigin.toLowerCase())
        );
        if (stateMatch) {
          originCity = {
            id: stateMatch.capital.toLowerCase(),
            name: stateMatch.capital,
            uf: stateMatch.id,
            region: stateMatch.region as 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul',
            lat: stateMatch.lat,
            lng: stateMatch.lon,
          };
        }
      }

      let destCity = findCityByName(cleanDest) || findCityByName(destName);
      if (!destCity) {
        const stateMatch = Object.values(BRAZIL_STATES_GEO).find(
          (s) =>
            s.capital.toLowerCase().includes(cleanDest.toLowerCase()) ||
            cleanDest.toLowerCase().includes(s.capital.toLowerCase()) ||
            s.name.toLowerCase().includes(cleanDest.toLowerCase())
        );
        if (stateMatch) {
          destCity = {
            id: stateMatch.capital.toLowerCase(),
            name: stateMatch.capital,
            uf: stateMatch.id,
            region: stateMatch.region as 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul',
            lat: stateMatch.lat,
            lng: stateMatch.lon,
          };
        }
      }

      if (!originCity || !destCity || !geodesicEngineRef.current) return;

      // Visually activate geodesic routes immediately
      setShowGeodesicRoutes(true);
      geodesicEngineRef.current.setVisible(true);

      const route = geodesicEngineRef.current.setCustomCityRoute(
        { name: originCity.name, uf: originCity.uf, lat: originCity.lat, lng: originCity.lng },
        { name: destCity.name, uf: destCity.uf, lat: destCity.lat, lng: destCity.lng },
        true
      );

      setActiveAdaptedRoute(route);
      setActiveRoutes([route]);

      // Orbit camera smoothly towards the midpoint of the route
      const midLat = (originCity.lat + destCity.lat) / 2;
      const midLng = (originCity.lng + destCity.lng) / 2;
      const targetCamPos = latLonToSphereVector3(midLat, midLng, 4.4);
      smoothGlideCamera(targetCamPos, new THREE.Vector3(0, 0, 0), 1400);
    },
    [smoothGlideCamera]
  );

  const handleResetCapitalsRoute = useCallback(() => {
    if (!geodesicEngineRef.current) return;
    const routes = geodesicEngineRef.current.restoreAllCapitalsRoutes();
    setActiveAdaptedRoute(null);
    setActiveRoutes(routes);
  }, []);

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

      {/* Top Floating Navigation Instruction Pill (Auto-dismisses after 4 seconds) */}
      {showNavPill && (
        <div
          id="pill-instrucoes-navegacao"
          className="painel-instrucao-navegacao absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-sky-500/30 text-sky-200 text-xs shadow-2xl pointer-events-none transition-opacity duration-700 animate-in fade-in"
        >
          <div className="flex items-center gap-1 text-sky-300">
            <Hand className="w-3.5 h-3.5 text-sky-400" />
            <span>Girar Terra</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Scroll Zoom</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-amber-300">
            <span>Clique nos Brasões</span>
          </div>
        </div>
      )}

      {/* Astrometric Telemetry HUD Card (Moon, Sun, Geodesic Arcs) - Hidden in Astral Mode */}
      {isTelemetryOpen && !isAstralMode && (
        <GlobeTelemetryCard
          telemetry={telemetryData}
          moonPhase={moonPhaseData}
          routes={activeRoutes}
          allCapitalRoutes={allCapitalRoutes}
          activeAdaptedRoute={activeAdaptedRoute}
          showCosmicBeams={showCosmicBeams}
          onToggleCosmicBeams={() => setShowCosmicBeams((prev) => !prev)}
          onSelectRouteTarget={(targetId) => handlePinClick(targetId)}
          onSelectCapitalRoute={handleSelectCapitalRoute}
          onCustomCityRoute={handleCustomCityRoute}
          onResetCapitalsRoute={handleResetCapitalsRoute}
          onClose={() => {
            handleToggleTelemetry();
            handleResetView();
          }}
        />
      )}

      {/* Cartographic Texture Intelligence & Metadata Panel */}
      {isTextureInfoOpen && (
        <GlobeTextureInfoPanel
          textureMode={activeTextureMode}
          onChangeTextureMode={handleTextureModeChange}
          onClose={() => setIsTextureInfoOpen(false)}
        />
      )}

      {/* Interactive Celestial Overlay: Interplanetary Trajectory Dialogue */}
      {showSolarSystem && (
        <CelestialInteractiveOverlay
          pins={[]}
          selectedAstro={selectedAstro}
          trajectoryTelemetry={trajectoryTelemetry}
          onSelectAstro={handleSelectAstro}
          onFocusAstroCamera={handleFocusAstroCamera}
          onResetToBrazil={handleResetView}
        />
      )}

      {/* Floating Bottom Center Minimalist Single-Line HUD Controls */}
      <GlobeControlsHUD
        autoRotate={autoRotateActive}
        onToggleAutoRotate={() => setAutoRotateActive((prev) => !prev)}
        cloudsEnabled={cloudsVisible}
        onToggleClouds={() => setCloudsVisible((prev) => !prev)}
        showSolarSystem={showSolarSystem}
        onToggleSolarSystem={() => setShowSolarSystem((prev) => !prev)}
        showGeodesicRoutes={showGeodesicRoutes}
        onToggleGeodesicRoutes={() => setShowGeodesicRoutes((prev) => !prev)}
        textureMode={activeTextureMode}
        onChangeTextureMode={handleTextureModeChange}
        season={currentSeason}
        onChangeSeason={(season) => setCurrentSeason(season)}
        showBorders={bordersVisible}
        onToggleBorders={() => setBordersVisible((prev) => !prev)}
        borderRegionFilter={borderRegionFilter}
        onChangeBorderRegionFilter={(reg) => setBorderRegionFilter(reg)}
        pinDisplayMode={pinDisplayMode}
        onTogglePinDisplayMode={() =>
          setPinDisplayMode((prev) => (prev === 'all' ? 'compact' : prev === 'compact' ? 'none' : 'all'))
        }
        isTelemetryOpen={isTelemetryOpen}
        onToggleTelemetry={handleToggleTelemetry}
        isTextureInfoOpen={isTextureInfoOpen}
        onToggleTextureInfoPanel={() => setIsTextureInfoOpen((prev) => !prev)}
        selectedAstroId={activeSelectedAstroId}
        onNavigateToAstro={handleNavigateToAstro}
        solarHour={simulatedSolarHour}
        onChangeSolarHour={(h) => {
          setSimulatedSolarHour(h);
          simulatedSolarHourRef.current = h;
        }}
        isSolarCyclePlaying={isSolarCyclePlaying}
        onToggleSolarCycle={() => setIsSolarCyclePlaying((prev) => !prev)}
        currentSolarStatus={telemetryData?.localSolarStatus || 'dia'}
        ambientLightIntensity={ambientLightIntensity}
        onChangeAmbientLightIntensity={(intensity) => setAmbientLightIntensity(intensity)}
        moonLightIntensity={moonLightIntensity}
        onChangeMoonLightIntensity={(intensity) => setMoonLightIntensity(intensity)}
        isSolarSimulatorOpen={isSolarSimulatorOpen}
        onToggleSolarSimulator={() => setIsSolarSimulatorOpen((prev) => !prev)}
      />

      {/* Dedicated Right Lateral Solar Simulator & Day/Night 24h Panel */}
      <GlobeSolarSimulatorPanel
        isOpen={isSolarSimulatorOpen}
        onClose={() => setIsSolarSimulatorOpen(false)}
        isExpanded={isSolarSimulatorExpanded}
        onToggleExpand={(expanded) => setIsSolarSimulatorExpanded(expanded)}
        solarHour={simulatedSolarHour}
        onChangeSolarHour={(h) => {
          setSimulatedSolarHour(h);
          simulatedSolarHourRef.current = h;
        }}
        isSolarCyclePlaying={isSolarCyclePlaying}
        onToggleSolarCycle={() => setIsSolarCyclePlaying((prev) => !prev)}
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
        moonLightIntensity={moonLightIntensity}
        onChangeMoonLightIntensity={(intensity) => {
          setMoonLightIntensity(intensity);
          moonLightIntensityRef.current = intensity;
          if (earthShaderMatRef.current) {
            earthShaderMatRef.current.uniforms.u_moonIntensity.value = intensity;
          }
          if (cloudsMatRef.current) {
            cloudsMatRef.current.uniforms.u_moonIntensity.value = intensity;
          }
          if (atmosphereMatRef.current) {
            atmosphereMatRef.current.uniforms.u_moonIntensity.value = intensity;
          }
        }}
        ambientLightIntensity={ambientLightIntensity}
        onChangeAmbientLightIntensity={(intensity) => {
          setAmbientLightIntensity(intensity);
          ambientLightIntensityRef.current = intensity;
          if (earthShaderMatRef.current) {
            earthShaderMatRef.current.uniforms.u_ambientIntensity.value = intensity;
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
        cloudsVisible={cloudsVisible}
        onToggleClouds={() => setCloudsVisible((prev) => !prev)}
        onResetDefaults={() => {
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
        currentSolarStatus={telemetryData?.localSolarStatus || 'dia'}
        season={
          currentSeason === 'summer_solstice' ? 'verao' :
          currentSeason === 'winter_solstice' ? 'inverno' :
          currentSeason === 'autumn_equinox' ? 'outono' :
          currentSeason === 'spring_equinox' ? 'primavera' : 'verao'
        }
        onChangeSeason={(s) => {
          const map: Record<string, GlobeSeason> = {
            verao: 'summer_solstice',
            outono: 'autumn_equinox',
            inverno: 'winter_solstice',
            primavera: 'spring_equinox',
          };
          const next = map[s] || 'summer_solstice';
          setCurrentSeason(next);
          currentSeasonRef.current = next;
        }}
      />

      {/* Screen-Space Projected Heraldic Pins Overlay - Hidden in Astral Mode */}
      {pinDisplayMode !== 'none' && !isAstralMode && (
        <div
          id="camada-pins-projetados-3d"
          className="camada-pins-projetados-3d absolute inset-0 pointer-events-none overflow-hidden z-20"
        >
          {projectedPins.map(({ stateId, x, y, scale, distance }) => {
            const isCompleted = completedStateIds.has(stateId);
            const isHovered = hoveredStateId === stateId;
            const isSelected = selectedStateId === stateId;

            // Distance-based Level of Detail (LOD) & reduced default scale
            const isZoomedOut = distance > 5.2 && pinDisplayMode !== 'all';
            const pinScale = scale * (isHovered || isSelected ? 1.25 : 0.60);

            // Heraldic Shield rule: only show on hover, selection, or if it is an active customized route endpoint.
            // By default, only show discrete pulsating radar circles with the UF code tag.
            const isRouteEndpoint = !!(
              activeAdaptedRoute &&
              (activeAdaptedRoute.fromStateId === stateId || activeAdaptedRoute.toStateId === stateId)
            );
            const shouldShowShield = isHovered || isSelected || isRouteEndpoint;

            return (
              <div
                key={stateId}
                id={`pin-item-${stateId}`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -100%) scale(${pinScale})`,
                  transformOrigin: 'bottom center',
                }}
                className="pin-estado-3d-item pin-brasao-estado absolute pointer-events-auto transition-transform duration-200"
              >
                <button
                  type="button"
                  id={`btn-pin-globo-${stateId}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinClick(stateId);
                  }}
                  onMouseEnter={() => onStateHover(stateId)}
                  onMouseLeave={() => onStateHover(null)}
                  className="btn-pin-globo-3d group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer"
                  aria-label={`Estado ${stateId}`}
                >
                  {/* Radar Pulse Ring */}
                  <div className="circulo-radar-3d absolute -inset-2.5 pointer-events-none flex items-center justify-center">
                    <div
                      className={`absolute w-10 h-10 rounded-full border transition-all duration-300 ${
                        isSelected
                          ? 'border-2 border-sky-300 bg-sky-400/30 animate-ping opacity-90'
                          : isCompleted
                          ? 'border border-emerald-300/80 bg-emerald-500/20 animate-ping opacity-75'
                          : isHovered
                          ? 'border-2 border-sky-400 bg-sky-400/25 animate-ping opacity-85'
                          : 'border border-sky-400/30 opacity-30 group-hover:opacity-80 group-hover:animate-ping'
                      }`}
                      style={{ animationDuration: isSelected ? '1.4s' : '2.8s' }}
                    />
                  </div>

                  {/* Heraldic Shield: Only rendered when hovered, selected, or on an active route endpoint */}
                  {shouldShowShield && !isZoomedOut && (
                    <StateHeraldicShield
                      stateId={stateId}
                      isCompleted={isCompleted}
                      isSelected={isSelected}
                      isHovered={isHovered}
                      size={isHovered || isSelected ? 'md' : 'sm'}
                    />
                  )}

                  {/* State UF Tag Badge */}
                  <div
                    className={`pill-sigla-uf-3d mt-0.5 px-2 py-0.2 ${
                      isHovered || isSelected ? 'text-[10px]' : 'text-[8px]'
                    } font-black rounded-full shadow-md whitespace-nowrap z-20 border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-300 font-bold'
                        : isSelected || isHovered
                        ? 'bg-sky-400 text-slate-950 border-sky-200 font-bold'
                        : 'bg-black/70 backdrop-blur-sm text-sky-200 border-sky-500/60'
                    }`}
                  >
                    {stateId}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
