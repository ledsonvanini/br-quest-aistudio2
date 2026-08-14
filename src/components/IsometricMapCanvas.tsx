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
import { ProceduralAtmosphereLayer } from './map/ProceduralAtmosphereLayer';
import { MapStatesLayer } from './map/MapStatesLayer';
import { MapPinsLayer } from './map/MapPinsLayer';
import { MapControlsHUD } from './map/MapControlsHUD';
import { MapChoroplethLegend } from './map/MapChoroplethLegend';
import { MapStateCarousel } from './map/MapStateCarousel';
import { TerrainTileProvider } from './map/ClippedMapTilesLayer';
import { StateDetailsSidebar } from './map/StateDetailsSidebar';
import { BrazilGlobeR3F } from './map/BrazilGlobeR3F';
import { IsolatedLeftGuardianStandee } from './map/IsolatedLeftGuardianStandee';
import { CompassLoadingScreen } from './map/CompassLoadingScreen';
import { loadBrazilGeoData, getCachedGeoData } from '../lib/geoDataLoader';
import { Compass } from 'lucide-react';

interface Props {
  completedStateIds: string[];
  unlockedInsigniaIds: string[];
  onSelectGuardian: (guardian: GuardianData) => void;
  lang: Language;
  onOpenSettings?: () => void;
}

export const IsometricMapCanvas: React.FC<Props> = ({
  completedStateIds,
  onSelectGuardian,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Visual Modes & Customization
  const [visualStyle, setVisualStyle] = useState<MapVisualStyle>('tiles');
  const [terrainProvider, setTerrainProvider] = useState<TerrainTileProvider>('shaded_relief');
  const [choroplethSubTheme, setChoroplethSubTheme] = useState<ChoroplethSubTheme>('regions');
  const [is3D, setIs3D] = useState<boolean>(true);
  const [isGlobe3DActive, setIsGlobe3DActive] = useState<boolean>(false);
  const [atmosphereEnabled, setAtmosphereEnabled] = useState<boolean>(true);

  // Camera Pan & Zoom States (Centered mathematically on Brazil)
  const baseUserZoomRef = useRef<number>(1.12);
  const [pan, setPan] = useState<{ x: number; y: number }>(() => getBrazilACtoPBMidpointPan(1.12, true));
  const [zoom, setZoom] = useState<number>(1.12);
  const [baseTiltAngle, setBaseTiltAngle] = useState<number>(42);

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
    return calculateSphericalGlobeAngles(pan, baseTiltAngle, dragVelocity, is3D);
  }, [pan, baseTiltAngle, dragVelocity, is3D]);

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

  // Inertial velocity decay on release
  useEffect(() => {
    if (!isDragging && (Math.abs(dragVelocity.x) > 0.05 || Math.abs(dragVelocity.y) > 0.05)) {
      const decay = () => {
        setDragVelocity((prev) => {
          const nextX = prev.x * 0.88;
          const nextY = prev.y * 0.88;
          if (Math.abs(nextX) < 0.02 && Math.abs(nextY) < 0.02) {
            return { x: 0, y: 0 };
          }
          velocityRafRef.current = requestAnimationFrame(decay);
          return { x: nextX, y: nextY };
        });
      };
      velocityRafRef.current = requestAnimationFrame(decay);
    }
    return () => {
      if (velocityRafRef.current) cancelAnimationFrame(velocityRafRef.current);
    };
  }, [isDragging, dragVelocity]);

  // Mouse drag handlers on map stage
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (isEnteringScene) return;

    isMouseDownRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;

    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
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

    const totalDx = Math.abs(e.clientX - mouseDownPosRef.current.x);
    const totalDy = Math.abs(e.clientY - mouseDownPosRef.current.y);
    if (totalDx > 4 || totalDy > 4) {
      hasMovedRef.current = true;
    }

    const targetPan = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    applyClampedPanZoom(targetPan, zoom);
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  // Scroll wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isEnteringScene) return;
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.max(0.85, Math.min(3.5, zoom * zoomFactor));
    baseUserZoomRef.current = newZoom;
    applyClampedPanZoom(pan, newZoom);
  };

  // State selection: Clicks zoom in deeply onto the state's pulsing centroid as the pivot
  const handleStateClick = (stateId: string) => {
    if (hasMovedRef.current || isDragging || isEnteringScene) return;

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

  // State hover: Fires ONCE on enter. The map stays perfectly still, and the hovered
  // state scales smoothly around its own centroid.
  const handleStateHover = useCallback((stateId: string | null) => {
    if (isMouseDownRef.current || hasMovedRef.current || isEnteringScene) return;

    if (stateId === hoveredStateRef.current) return;

    hoveredStateRef.current = stateId;
    setHoveredStateId(stateId);

    if (stateId) {
      audioEngine.playMenuHover();
    }
  }, [isEnteringScene]);

  // Centralizes viewport directly on Brazil (Acre to Paraíba / Roraima to RS)
  const handleResetView = () => {
    audioEngine.playSfx('click');
    setTransitionMode('button');
    hoveredStateRef.current = null;
    setHoveredStateId(null);
    setBaseTiltAngle(is3D ? 42 : 0);
    setDragVelocity({ x: 0, y: 0 });
    const targetZoom = 1.12;
    baseUserZoomRef.current = targetZoom;
    const centeredPan = getBrazilACtoPBMidpointPan(targetZoom, is3D);
    applyClampedPanZoom(centeredPan, targetZoom);
  };

  const handleZoomIn = () => {
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const nextZoom = zoom * 1.15;
    baseUserZoomRef.current = nextZoom;
    applyClampedPanZoom(pan, nextZoom);
  };

  const handleZoomOut = () => {
    audioEngine.playSfx('click');
    setTransitionMode('button');
    const nextZoom = zoom * 0.85;
    baseUserZoomRef.current = nextZoom;
    applyClampedPanZoom(pan, nextZoom);
  };

  const handleToggle3D = () => {
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

  // Dynamic CSS transition: smooth 400ms for manual controls, 750ms for hover zoom in/out, 1500ms cinematic dive on click
  const stageTransition = isDragging
    ? 'none'
    : isEnteringScene || transitionMode === 'entry'
    ? 'transform 1500ms cubic-bezier(0.16, 1, 0.3, 1)'
    : transitionMode === 'hover'
    ? 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)'
    : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div
      ref={containerRef}
      onMouseDown={isGlobe3DActive ? undefined : handleMouseDown}
      onMouseMove={isGlobe3DActive ? undefined : handleMouseMove}
      onMouseUp={isGlobe3DActive ? undefined : handleMouseUp}
      onMouseLeave={() => {
        if (!isGlobe3DActive) {
          handleMouseUp();
          handleStateHover(null);
        }
      }}
      onWheel={isGlobe3DActive ? undefined : handleWheel}
      className={`container-canva-mapa-br container-mapa-br relative w-full h-full flex-1 overflow-hidden bg-[#020611] select-none cursor-${
        isGlobe3DActive ? 'default' : isDragging ? 'grabbing' : 'grab'
      }`}
      style={{ perspective: '1600px' }}
    >
      {/* 1. Procedural SVG Filters Definition (Relief & Antique Parchment Paper) */}
      <ProceduralTerrainFilter />
      <ParchmentTextureFilter />

      {/* 2. Full-Screen Aged Parchment Noise & Fiber Grain Overlay (No Grid Lines, Pure Vintage Texture) */}
      <AgedParchmentOverlay />

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

      {/* 4. Top HUD Controls */}
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
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
      />

      {/* 5. Choropleth Interactive Legend (Shown on 2D/2.5D Cartographic Mode) */}
      {!isGlobe3DActive && (
        <MapChoroplethLegend
          visualStyle={visualStyle}
          choroplethSubTheme={choroplethSubTheme}
          completedCount={completedSet.size}
        />
      )}

      {/* 6. Dedicated Right Side State Details Panel */}
      <StateDetailsSidebar
        activeStateId={hoveredStateId}
        completedStateIds={completedSet}
        onSelectGuardian={onSelectGuardian}
      />

      {/* 7. UNBOXED FULL-BODY GUARDIAN NPC STANDEE */}
      <IsolatedLeftGuardianStandee
        activeStateId={hoveredStateId || selectedStateId}
        completedStateIds={completedSet}
        onSelectGuardian={onSelectGuardian}
      />

      {/* 8. Main Stage: Either Interactive 3D Sphere Globe (React Three Fiber) OR Cartographic 2.5D Map */}
      {isGlobe3DActive ? (
        <BrazilGlobeR3F
          completedStateIds={completedSet}
          hoveredStateId={hoveredStateId}
          selectedStateId={selectedStateId}
          onStateHover={handleStateHover}
          onStateClick={handleStateClick}
          onSelectGuardian={onSelectGuardian}
        />
      ) : (
        <div
          className="container-palco-globo-3d palco-isometrico-matriz relative z-10 w-full h-full flex items-center justify-center origin-center"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) rotateX(${sphericalAngles.rotateX}deg) rotateY(${sphericalAngles.rotateY}deg) rotateZ(${sphericalAngles.rotateZ}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d',
            transition: stageTransition,
          }}
        >
          <div
            className="quadro-canvas-camadas relative"
            style={{
              width: MAP_CANVAS_WIDTH,
              height: MAP_CANVAS_HEIGHT,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Layer 0: Seamless Infinite Procedural Ocean (Clean abyssal water, no grid) */}
            <ProceduralOceanCanvas isPlayingAnimation={true} />

            {/* Layer 1 & 2: D3 Clipped Map Tiles & States Layer */}
            <MapStatesLayer
              geoData={geoData}
              projection={projection}
              visualStyle={visualStyle}
              terrainProvider={terrainProvider}
              choroplethSubTheme={choroplethSubTheme}
              completedStateIds={completedSet}
              hoveredStateId={hoveredStateId}
              selectedStateId={selectedStateId}
              centroids={centroids}
              onStateHover={handleStateHover}
              onStateClick={handleStateClick}
            />

            {/* Layer 3: Guardian Heraldic Pins Layer with Coat of Arms */}
            <MapPinsLayer
              centroids={centroids}
              completedStateIds={completedSet}
              hoveredStateId={hoveredStateId}
              selectedStateId={selectedStateId}
              is3D={is3D}
              tiltAngle={sphericalAngles.rotateX}
              onSelectGuardian={handleStateClick}
              onHoverState={handleStateHover}
            />

            {/* Layer 4: Procedural Atmosphere (Gaivotas, Névoa Mágica & Brilho Solar) */}
            <ProceduralAtmosphereLayer enabled={atmosphereEnabled} />
          </div>
        </div>
      )}

      {/* 9. Bottom State Carousel with Search & Progress */}
      <MapStateCarousel
        completedStateIds={completedSet}
        hoveredStateId={hoveredStateId}
        selectedStateId={selectedStateId}
        onStateHover={handleStateHover}
        onStateClick={handleStateClick}
      />
    </div>
  );
};
