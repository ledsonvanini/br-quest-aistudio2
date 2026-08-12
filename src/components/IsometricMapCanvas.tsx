import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { geoMercator, geoPath } from 'd3-geo';
import { GuardianData, Language } from '../types';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { audioEngine } from '../lib/audioSynth';
import { getCoatOfArmsUrl } from '../data/coatOfArms';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
  UserCheck,
  Layers,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Grab,
} from 'lucide-react';

interface Props {
  completedStateIds: string[];
  unlockedInsigniaIds: string[];
  onSelectGuardian: (guardian: GuardianData) => void;
  lang: Language;
  onOpenSettings?: () => void;
}

interface GeoJsonFeature {
  type: string;
  properties: { id: string; name: string };
  geometry: any;
}

interface GeoJsonData {
  type: string;
  features: GeoJsonFeature[];
}

export const IsometricMapCanvas: React.FC<Props> = ({
  completedStateIds,
  unlockedInsigniaIds,
  onSelectGuardian,
}) => {
  // Pan and Zoom states
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.18); // Default 118% scale fitting canvas container perfectly
  const [tiltAngle, setTiltAngle] = useState<number>(32); // Default 32° RPG Orthographic camera tilt
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag vs Click threshold detector
  const hasMovedRef = useRef<boolean>(false);
  const mouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover state
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  // Delayed one-shot micro-zoom state (triggers 1s after resting hover on an icon)
  const [zoomedStateId, setZoomedStateId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // One-shot timer effect: trigger zoom 500ms after resting mouse on state icon
  useEffect(() => {
    if (!hoveredStateId) {
      setZoomedStateId(null);
      return;
    }

    const timer = setTimeout(() => {
      setZoomedStateId(hoveredStateId);
    }, 500);

    return () => clearTimeout(timer);
  }, [hoveredStateId]);

  // Toolbar drag-to-scroll & wheel state
  const toolbarScrollRef = useRef<HTMLDivElement | null>(null);
  const stateButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hoverSourceRef = useRef<'map' | 'toolbar' | null>(null);
  const [isToolbarDragging, setIsToolbarDragging] = useState<boolean>(false);
  const [toolbarScrollProgress, setToolbarScrollProgress] = useState<number>(0);
  const toolbarDragStartXRef = useRef<number>(0);
  const toolbarScrollStartRef = useRef<number>(0);
  const toolbarHasMovedRef = useRef<boolean>(false);

  const updateToolbarScrollProgress = () => {
    if (!toolbarScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = toolbarScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setToolbarScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  };

  // Auto-scroll corresponding toolbar icon to center ONLY when user hovers a state on the map
  useEffect(() => {
    if (
      hoverSourceRef.current === 'map' &&
      hoveredStateId &&
      stateButtonRefs.current[hoveredStateId] &&
      toolbarScrollRef.current
    ) {
      const container = toolbarScrollRef.current;
      const btn = stateButtonRefs.current[hoveredStateId];
      if (btn) {
        const targetScroll = btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2;
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
        setTimeout(updateToolbarScrollProgress, 250);
      }
    }
  }, [hoveredStateId]);

  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // CRUCIAL: Isolates toolbar from dragging main map!
    if (e.button === 0 || e.button === 1) { // Left or Middle Click
      setIsToolbarDragging(true);
      toolbarHasMovedRef.current = false;
      toolbarDragStartXRef.current = e.clientX;
      if (toolbarScrollRef.current) {
        toolbarScrollStartRef.current = toolbarScrollRef.current.scrollLeft;
      }
    }
  };

  const handleToolbarMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isToolbarDragging || !toolbarScrollRef.current) return;
    const dx = e.clientX - toolbarDragStartXRef.current;
    if (Math.abs(dx) > 4) {
      toolbarHasMovedRef.current = true;
    }
    toolbarScrollRef.current.scrollLeft = toolbarScrollStartRef.current - dx;
    updateToolbarScrollProgress();
  };

  const handleToolbarMouseUp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsToolbarDragging(false);
    setTimeout(() => {
      toolbarHasMovedRef.current = false;
    }, 60);
  };

  const handleToolbarWheel = (e: React.WheelEvent) => {
    e.stopPropagation(); // Isolates toolbar wheel from main map zoom!
    if (toolbarScrollRef.current) {
      toolbarScrollRef.current.scrollLeft += e.deltaY * 1.2 || e.deltaX * 1.2;
      updateToolbarScrollProgress();
    }
  };

  const scrollToolbarBy = (offset: number) => {
    if (toolbarScrollRef.current) {
      toolbarScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(updateToolbarScrollProgress, 300);
    }
  };

  // GeoJSON data
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const threeCameraRef = useRef<THREE.OrthographicCamera | null>(null);

  // Initialize Three.js Orthographic Camera instance
  useEffect(() => {
    const aspect = 16 / 9;
    const frustumSize = 1000;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      2000
    );
    camera.position.set(0, -600, 800);
    camera.lookAt(0, 0, 0);
    threeCameraRef.current = camera;
  }, []);

  // Sync Three.js Orthographic Camera with current pitch, yaw, zoom, and pan
  useEffect(() => {
    if (!threeCameraRef.current) return;
    const camera = threeCameraRef.current;
    const pitchRad = (tiltAngle * Math.PI) / 180;
    const yawRad = (rotationAngle * Math.PI) / 180;

    camera.position.x = pan.x;
    camera.position.y = -Math.sin(pitchRad) * 800 + pan.y;
    camera.position.z = Math.cos(pitchRad) * 800;
    camera.rotation.x = pitchRad;
    camera.rotation.z = yawRad;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [pan, zoom, tiltAngle, rotationAngle]);

  // Load GeoJSON on mount
  useEffect(() => {
    fetch('/br/br.json')
      .then((res) => res.json())
      .then((data: GeoJsonData) => setGeoData(data))
      .catch((err) => console.error('Failed to load br.json GeoJSON:', err));
  }, []);

  // Filter continental features (excluding oceanic islands > -34.8° lon like Fernando de Noronha & Trindade)
  const continentalGeo = useMemo(() => {
    if (!geoData) return null;
    return {
      type: 'FeatureCollection',
      features: geoData.features.map((f) => {
        if (f.geometry?.type === 'MultiPolygon') {
          const coords = f.geometry.coordinates.filter((poly: any) => {
            let minX = 180;
            poly[0].forEach(([lon]: [number, number]) => {
              if (lon < minX) minX = lon;
            });
            return minX < -34.8;
          });
          return { ...f, geometry: { ...f.geometry, coordinates: coords } };
        }
        return f;
      }),
    };
  }, [geoData]);

  // Standard Mercator Path Generator fitted precisely to bg-mapa-br.png (2560x1440 canvas)
  const pathGenerator = useMemo(() => {
    if (!geoData || !continentalGeo) return null;

    const proj = geoMercator();
    proj.fitExtent([[358, 0], [2347, 1439]], continentalGeo as any);

    return geoPath().projection(proj as any);
  }, [geoData, continentalGeo]);

  // Map state ID to GeoJSON centroid
  const stateCentroids = useMemo(() => {
    if (!geoData || !pathGenerator) return {};
    const centroids: Record<string, [number, number]> = {};

    geoData.features.forEach((feat) => {
      const stateId = feat.properties.id.replace('BR', '');
      const [cx, cy] = pathGenerator.centroid(feat as any);
      centroids[stateId] = [cx, cy];
    });

    // Micro-offsets for small/adjacent state labels
    if (centroids['GO'] && centroids['DF']) {
      centroids['GO'] = [centroids['GO'][0] - 20, centroids['GO'][1] + 10];
      centroids['DF'] = [centroids['DF'][0] + 20, centroids['DF'][1] - 10];
    }
    if (centroids['RN']) centroids['RN'] = [centroids['RN'][0] + 15, centroids['RN'][1] - 10];
    if (centroids['PB']) centroids['PB'] = [centroids['PB'][0] + 20, centroids['PB'][1] + 2];
    if (centroids['PE']) centroids['PE'] = [centroids['PE'][0] - 10, centroids['PE'][1] - 5];
    if (centroids['AL']) centroids['AL'] = [centroids['AL'][0] + 20, centroids['AL'][1] + 10];
    if (centroids['SE']) centroids['SE'] = [centroids['SE'][0] + 15, centroids['SE'][1] + 15];

    return centroids;
  }, [geoData, pathGenerator]);

  // Particle seeds for Option B rising magical sparks
  const guardianParticlesMap = useMemo(() => {
    const map: Record<
      string,
      Array<{
        id: number;
        startX: number;
        startY: number;
        driftX: number;
        riseY: number;
        size: number;
        color: string;
        duration: number;
        delay: number;
      }>
    > = {};

    GUARDIANS_DATA.forEach((g) => {
      map[g.id] = Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const radius = 12 + ((i * 7) % 32);
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius * 0.5;
        const driftX = (i % 2 === 0 ? 1 : -1) * (12 + ((i * 9) % 30));
        const riseY = -(80 + ((i * 13) % 90));
        const size = 2.5 + (i % 4) * 1.8;
        const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#e0f2fe', '#fef08a'];
        const color = colors[i % colors.length];
        const duration = 1.3 + (i % 5) * 0.28;
        const delay = (i % 7) * 0.22;

        return {
          id: i,
          startX,
          startY,
          driftX,
          riseY,
          size,
          color,
          duration,
          delay,
        };
      });
    });

    return map;
  }, []);

  // Pivot centroid for 1-shot zoom centered on state icon
  const pivotCentroid = zoomedStateId ? stateCentroids[zoomedStateId] : null;
  const pivotX = pivotCentroid ? pivotCentroid[0] : 1280;
  const pivotY = pivotCentroid ? pivotCentroid[1] : 720;

  // Mouse pan handlers with drag threshold detection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      hasMovedRef.current = false;
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dist = Math.hypot(
        e.clientX - mouseDownPosRef.current.x,
        e.clientY - mouseDownPosRef.current.y
      );
      if (dist > 6) {
        hasMovedRef.current = true;
      }
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Safe guardian selection helper ignoring drag drops
  const handleSelectStateSafe = (guardian: GuardianData) => {
    if (hasMovedRef.current) return; // Prevent selection if mouse was dragged/dropped
    audioEngine.playSfx('click');
    onSelectGuardian(guardian);
  };

  // Scroll wheel zoom handler (minZoom floor 1.0 fits container div)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(2.5, Math.max(1.0, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.18);
    setTiltAngle(32);
    setRotationAngle(0);
    audioEngine.playSfx('click');
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    audioEngine.setSoundEnabled(next);
  };

  const hoveredGuardian = GUARDIANS_DATA.find((g) => g.id === hoveredStateId);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-[680px] sm:h-[740px] lg:h-[820px] rounded-3xl overflow-hidden bg-[#090d16] border-2 border-amber-500/60 shadow-2xl select-none cursor-${
        isDragging ? 'grabbing' : 'grab'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* Medieval Parchment Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Atlantic Ocean Label */}
      <div className="absolute top-6 left-6 pointer-events-none opacity-50 text-amber-500/80 font-serif text-xs space-y-1 z-20">
        <div className="flex items-center gap-2">
          <Compass className="w-8 h-8 animate-spin-slow text-amber-400" />
          <span className="text-sm font-bold tracking-widest text-amber-300">OCEANO ATLÂNTICO</span>
        </div>
        <p className="text-[10px] italic">"Mapa do Brasil - Câmera RPG Ortogonal Three.js"</p>
      </div>

      {/* --- MAP NAVIGATION HUD CONTROLS (Top Right) --- */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border-2 border-amber-500/50 shadow-2xl">
        {/* Toggle 3D RPG / Flat 2D Camera View */}
        <button
          onClick={() => {
            setTiltAngle((t) => (t > 0 ? 0 : 32));
            audioEngine.playSfx('click');
          }}
          className={`p-2 rounded-xl transition flex items-center gap-1 text-xs font-bold font-serif ${
            tiltAngle > 0
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800'
          }`}
          title="Alternar entre Câmera RPG 3D (Ortogonal) e Plana 2D"
        >
          <Eye className="w-5 h-5 text-amber-400" />
          <span className="hidden sm:inline">{tiltAngle > 0 ? 'RPG 3D' : 'Plano 2D'}</span>
        </button>

        {/* Rotate Camera angle button */}
        <button
          onClick={() => {
            setRotationAngle((r) => (r >= 15 ? -15 : r + 15));
            audioEngine.playSfx('click');
          }}
          className="p-2 text-slate-200 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
          title="Girar Câmera RPG"
        >
          <Layers className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-800 my-auto" />

        <button
          onClick={() => {
            setZoom((z) => Math.min(2.5, z * 1.15));
            audioEngine.playSfx('click');
          }}
          className="p-2 text-slate-200 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setZoom((z) => Math.max(1.0, z * 0.85));
            audioEngine.playSfx('click');
          }}
          className="p-2 text-slate-200 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
          title="Zoom Out (Limite Fit)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <button
          onClick={handleResetView}
          className="p-2 text-slate-200 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
          title="Resetar Visão da Câmera"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-800 my-auto" />

        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl transition ${
            soundOn ? 'text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
          }`}
          title="Som & Efeitos"
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* --- OCEAN BACKGROUND PARALLAX LAYER (Seamless Extended Ocean Texture, NO Black Void Gaps) --- */}
      <div
        className="absolute -inset-20 w-[calc(100%+10rem)] h-[calc(100%+10rem)] pointer-events-none z-0 transition-transform duration-700 ease-out bg-cover bg-center"
        style={{
          transform: `translate3d(${pan.x * 0.22}px, ${pan.y * 0.22}px, 0px) scale(${1.35 + (zoom - 1) * 0.15})`,
          backgroundImage: `url('/br/bg-mapa-br.png')`,
          filter: 'brightness(0.65) contrast(1.1) saturate(1.1)',
        }}
      />

      {/* --- MAIN THREE.JS / ORTHOGRAPHIC RPG MAP CANVAS CONTAINER --- */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-700 ease-out p-1 overflow-visible"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) rotateX(${tiltAngle}deg) rotateZ(${rotationAngle}deg) scale(${zoom})`,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 2560 1440"
          className="w-full h-full object-contain max-w-full max-h-full drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-visible"
        >
          <defs>
            {/* Radial Spotlight Gradient for Hovered State */}
            <radialGradient id="stateSpotlightGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Golden Glow Filter - Softened & Refined */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="0.9" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Paper Texture SVG Pattern for 100% Brazil State Coverage */}
            <pattern
              id="paperTexturePattern"
              patternUnits="userSpaceOnUse"
              x="358"
              y="0"
              width="1989"
              height="1439"
            >
              <image
                href="/br/papel-mapa-br.jpg"
                x="0"
                y="0"
                width="1989"
                height="1439"
                preserveAspectRatio="none"
              />
            </pattern>

            {/* Brazil Landmass Drop Shadow for High Contrast */}
            <filter id="landmassShadow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="8" dy="16" stdDeviation="12" floodColor="#000000" floodOpacity="0.85" />
            </filter>

            {/* Individual State Inner Shadow (50% Opacity Depth Delineation) */}
            <filter id="stateInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feOffset dx="1.5" dy="2.5" />
              <feGaussianBlur stdDeviation="3" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="#000000" floodOpacity="0.50" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>

            {/* Individual State Border Shadow (50% Contour Drop Shadow) */}
            <filter id="stateBorderShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.50" />
            </filter>

            {/* Drop Shadow */}
            <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="3" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
            </filter>

            {/* Coat of Arms Circular Clip Paths */}
            {GUARDIANS_DATA.map((g) => (
              <clipPath id={`flag-clip-${g.id}`} key={`clip-${g.id}`}>
                <circle cx="0" cy="0" r="34" />
              </clipPath>
            ))}

            {/* State GeoJSON Clip Paths for Coat of Arms Mask Overlay */}
            {geoData &&
              pathGenerator &&
              geoData.features.map((feat) => {
                const stateId = feat.properties.id.replace('BR', '');
                const pathD = pathGenerator(feat as any);
                if (!pathD) return null;
                return (
                  <clipPath id={`clip-state-${stateId}`} key={`clip-state-${stateId}`}>
                    <path d={pathD} />
                  </clipPath>
                );
              })}

            {/* Pulsing Gold Border Style & Particles Keyframes */}
            <style>{`
              @keyframes goldStrokePulse {
                0%, 100% { stroke-opacity: 1; stroke-width: 3.2px; filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.7)); }
                50% { stroke-opacity: 0.55; stroke-width: 2.2px; filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.3)); }
              }
              .animate-pulse-gold-stroke {
                animation: goldStrokePulse 2s ease-in-out infinite;
              }
              @keyframes floatParticleUp {
                0% {
                  transform: translate(0px, 0px) scale(0.2);
                  opacity: 0;
                }
                20% {
                  opacity: 1;
                }
                80% {
                  opacity: 0.85;
                }
                100% {
                  transform: translate(var(--drift-x, 15px), var(--rise-y, -120px)) scale(1.4);
                  opacity: 0;
                }
              }
              @keyframes spinSlow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes spinReverseSlow {
                from { transform: rotate(0deg); }
                to { transform: rotate(-360deg); }
              }
              .animate-spin-slow {
                animation: spinSlow 18s linear infinite;
              }
              .animate-spin-reverse-slow {
                animation: spinReverseSlow 24s linear infinite;
              }
            `}</style>
          </defs>

          {/* MAP PIVOT CONTAINER FOR 1-SHOT CENTERED MICRO-ZOOM */}
          <g
            className="map-pivot-layer"
            style={{
              transform: zoomedStateId ? 'scale(1.08)' : 'scale(1.0)',
              transformOrigin: `${pivotX}px ${pivotY}px`,
              transition:
                'transform 750ms cubic-bezier(0.16, 1, 0.3, 1), transform-origin 750ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* LAYER 1: Ocean Artwork (bg-mapa-br.png with Extended Bounds for 3D Perspective) */}
            <image
              href="/br/bg-mapa-br.png"
              x="-200"
              y="-120"
              width="2960"
              height="1680"
              preserveAspectRatio="cover"
            />

            {/* LAYER 2: GeoJSON Brazil State Polygons (Paper Texture Pattern Base for ALL States, Crisp Gold Borders, Drop Shadow for Contrast) */}
            <g className="geojson-states" filter="url(#landmassShadow)">
              {geoData &&
                pathGenerator &&
                geoData.features.map((feat) => {
                  const stateId = feat.properties.id.replace('BR', '');
                  const isHovered = hoveredStateId === stateId;
                  const pathD = pathGenerator(feat as any);

                  if (!pathD) return null;

                  const coatUrl = getCoatOfArmsUrl(stateId);
                  const centroid = stateCentroids[stateId];
                  const cx = centroid ? centroid[0] : 1280;
                  const cy = centroid ? centroid[1] : 720;

                  return (
                    <g key={`state-group-${stateId}`}>
                      {/* Base State Polygon: Paper Texture Fill with Inner Shadow for Delineation */}
                      <path
                        d={pathD}
                        fill="url(#paperTexturePattern)"
                        opacity="0.88"
                        filter="url(#stateInnerShadow)"
                        className="pointer-events-none"
                      />

                      {/* State Border Drop Shadow Layer (50% Opacity Contour Delineation) */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.50)"
                        strokeWidth={isHovered ? '4.2' : '2.8'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter="url(#stateBorderShadow)"
                        className="pointer-events-none"
                      />

                      {/* Interactive Overlay Polygon: Crisp Amber-Gold Borders, Gentle Tint & Soft Glow on Hover */}
                      <path
                        d={pathD}
                        fill={isHovered ? 'rgba(3, 105, 161, 0.55)' : 'rgba(15, 23, 42, 0.05)'}
                        stroke={isHovered ? '#fef08a' : '#d97706'}
                        strokeWidth={isHovered ? '3.5' : '1.8'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter={isHovered ? 'url(#goldGlow)' : undefined}
                        className={`cursor-pointer transition-colors duration-300 pointer-events-auto ${
                          isHovered ? 'animate-pulse-gold-stroke' : ''
                        }`}
                        onMouseEnter={() => {
                          hoverSourceRef.current = 'map';
                          setHoveredStateId(stateId);
                          audioEngine.playSfx('step');
                        }}
                        onMouseLeave={() => setHoveredStateId(null)}
                        onClick={() => {
                          const g = GUARDIANS_DATA.find((item) => item.id === stateId);
                          if (g) handleSelectStateSafe(g);
                        }}
                      />

                      {/* Coat of Arms Mask Overlay (75% Opacity on Hover) */}
                      {isHovered && coatUrl && (
                        <image
                          href={coatUrl}
                          x={cx - 240}
                          y={cy - 240}
                          width="480"
                          height="480"
                          clipPath={`url(#clip-state-${stateId})`}
                          opacity="0.75"
                          preserveAspectRatio="xMidYMid meet"
                          className="pointer-events-none transition-opacity duration-300"
                        />
                      )}
                    </g>
                  );
                })}
            </g>

            {/* LAYER 2: Option B Ethereal Radial Spotlight & Rising Particles for Hovered State */}
            <g className="spotlight-highlights-and-particles pointer-events-none">
              {GUARDIANS_DATA.map((guardian) => {
                const isHovered = hoveredStateId === guardian.id;
                if (!isHovered) return null;

                const centroid = stateCentroids[guardian.id];
                const pinX = centroid ? centroid[0] : (guardian.centerX + 388.8888889) * 1.44;
                const pinY = centroid ? centroid[1] : guardian.centerY * 1.44;

                const particles = guardianParticlesMap[guardian.id] || [];

                return (
                  <g key={`spotlight-particles-${guardian.id}`} className="transition-all duration-300">
                    {/* Option B: Soft Radial Aura */}
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r="160"
                      fill="url(#stateSpotlightGlow)"
                      className="animate-pulse"
                    />

                    {/* Option B: Rotating Concentric Dashed Ring Halos */}
                    <g style={{ transformOrigin: `${pinX}px ${pinY}px` }} className="animate-spin-slow">
                      <circle
                        cx={pinX}
                        cy={pinY}
                        r="125"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                        strokeDasharray="8 12"
                        opacity="0.85"
                      />
                    </g>
                    <g style={{ transformOrigin: `${pinX}px ${pinY}px` }} className="animate-spin-reverse-slow">
                      <circle
                        cx={pinX}
                        cy={pinY}
                        r="165"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.8"
                        strokeDasharray="4 16"
                        opacity="0.65"
                      />
                    </g>

                    {/* Rising Floating Magical Particles (Sparks) */}
                    {particles.map((p) => (
                      <circle
                        key={`particle-${guardian.id}-${p.id}`}
                        cx={pinX + p.startX}
                        cy={pinY + p.startY}
                        r={p.size}
                        fill={p.color}
                        filter="drop-shadow(0 0 6px currentColor)"
                        style={{
                          ['--drift-x' as any]: `${p.driftX}px`,
                          ['--rise-y' as any]: `${p.riseY}px`,
                          animation: `floatParticleUp ${p.duration}s ease-out ${p.delay}s infinite`,
                        }}
                      />
                    ))}
                  </g>
                );
              })}
            </g>

          {/* LAYER 4: Interactive State Pins & Badges */}
          <g filter="url(#dropShadow)">
            {GUARDIANS_DATA.map((guardian) => {
              const isHovered = hoveredStateId === guardian.id;
              const isCompleted = completedStateIds.includes(guardian.id);
              const hasInsignia = unlockedInsigniaIds.includes(guardian.id);
              const coatOfArms = getCoatOfArmsUrl(guardian.id);

              const centroid = stateCentroids[guardian.id];
              const pinX = centroid ? centroid[0] : (guardian.centerX + 388.8888889) * 1.44;
              const pinY = centroid ? centroid[1] : guardian.centerY * 1.44;

              return (
                <g key={guardian.id} className="cursor-pointer group">
                  {/* Precise Center Hit Area around State Icon */}
                  <circle
                    cx={pinX}
                    cy={pinY}
                    r="42"
                    fill="transparent"
                    className="cursor-pointer pointer-events-auto"
                    onMouseEnter={() => {
                      hoverSourceRef.current = 'map';
                      setHoveredStateId(guardian.id);
                      audioEngine.playSfx('step');
                    }}
                    onMouseLeave={() => setHoveredStateId(null)}
                    onClick={() => handleSelectStateSafe(guardian)}
                  />

                  {/* State Marker Group */}
                  <g
                    transform={`translate(${pinX}, ${pinY})`}
                    onClick={() => handleSelectStateSafe(guardian)}
                    onMouseEnter={() => {
                      hoverSourceRef.current = 'map';
                      setHoveredStateId(guardian.id);
                      audioEngine.playSfx('step');
                    }}
                    onMouseLeave={() => setHoveredStateId(null)}
                    className="pointer-events-auto cursor-pointer"
                  >
                    {/* Hover Glow Aura */}
                    {isHovered && (
                      <g className="pointer-events-none">
                        <circle
                          cx="0"
                          cy="0"
                          r="68"
                          fill="rgba(245, 158, 11, 0.3)"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          filter="url(#goldGlow)"
                          className="animate-ping opacity-90"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r="56"
                          fill="rgba(245, 158, 11, 0.4)"
                          stroke="#fbbf24"
                          strokeWidth="3"
                        />
                      </g>
                    )}

                    {/* Scaled Marker */}
                    <g
                      className="transition-transform duration-200 ease-out"
                      style={{
                        transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r={isHovered ? '42' : '38'}
                        fill={hasInsignia ? '#b45309' : isCompleted ? '#047857' : '#0f172a'}
                        stroke={isHovered ? '#f59e0b' : '#fbbf24'}
                        strokeWidth={isHovered ? '4' : '3'}
                        className="transition-all duration-200 shadow-2xl cursor-pointer"
                      />

                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isHovered ? '24' : '20'}
                        fill="#fbbf24"
                        className="pointer-events-none select-none font-bold"
                      >
                        {guardian.flagSymbol}
                      </text>

                      <g clipPath={`url(#flag-clip-${guardian.id})`}>
                        <image
                          href={coatOfArms || `https://flagcdn.com/w80/br-${guardian.id.toLowerCase()}.png`}
                          x="-34"
                          y="-34"
                          width="68"
                          height="68"
                          preserveAspectRatio="xMidYMid contain"
                          className="pointer-events-none"
                        />
                      </g>

                      <g transform="translate(0, 52)">
                        <rect
                          x="-28"
                          y="-13"
                          width="56"
                          height="26"
                          rx="8"
                          fill={isHovered ? '#78350f' : '#020617'}
                          stroke={isHovered ? '#f59e0b' : '#475569'}
                          strokeWidth={isHovered ? '2.5' : '1.5'}
                          className="cursor-pointer shadow-lg transition-colors"
                        />
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={isHovered ? '#fbbf24' : '#f8fafc'}
                          fontSize="13"
                          fontWeight="black"
                          fontFamily="serif"
                          className="pointer-events-none select-none"
                        >
                          {guardian.id}
                        </text>
                      </g>
                    </g>
                  </g>
                </g>
              );
            })}
          </g>
          </g>
        </svg>
      </div>

      {/* --- HOVER DISPLAY: UNBOXED FULL-BODY GUARDIAN STANDEE (~80% CANVAS HEIGHT) & DIALOGUE PREVIEW --- */}
      {hoveredGuardian && (
        <>
          {/* LEFT SIDE: UNBOXED FULL-BODY CHARACTER (~80% CANVAS HEIGHT) */}
          <div className="absolute left-3 sm:left-6 bottom-16 top-6 z-30 pointer-events-none flex flex-col justify-end items-center select-none animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Dynamic Speech Bubble */}
            <div className="mb-3 max-w-xs sm:max-w-sm bg-slate-950/95 border-2 border-amber-400 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100 font-serif text-xs leading-relaxed space-y-1 relative pointer-events-auto">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                {hoveredGuardian.guardianName} ({hoveredGuardian.id})
              </div>
              <p className="italic text-xs sm:text-sm">
                "{hoveredGuardian.id === 'RS' ? 'Bah, tchê! Sou o Guardião dos Pampas! Clique no estado para conversarmos!' : `Saudações! Sou ${hoveredGuardian.guardianName}. Clique para interagir!`}"
              </p>
              {/* Pointer Triangle */}
              <div className="absolute -bottom-2 left-10 w-4 h-4 bg-slate-950 border-r-2 border-b-2 border-amber-400 rotate-45" />
            </div>

            {/* Natural Floor Shadow */}
            <div className="absolute bottom-1 w-56 h-7 bg-black/80 rounded-[100%] blur-md -z-10" />

            {/* UNBOXED CHARACTER SPRITE (~80% OF CANVAS HEIGHT) */}
            <img
              src={hoveredGuardian.id === 'RS' ? '/RS/w-gaucho.png' : hoveredGuardian.avatarUrl}
              alt={hoveredGuardian.guardianName}
              className="h-[78%] max-h-[480px] sm:max-h-[520px] md:max-h-[560px] w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:scale-[1.03] pointer-events-auto cursor-pointer"
              onClick={() => handleSelectStateSafe(hoveredGuardian)}
            />
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="absolute right-4 md:right-8 top-16 z-30 pointer-events-none w-80 bg-slate-950/95 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl text-amber-100 backdrop-blur-md animate-in slide-in-from-right-4 fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-amber-500/30 pb-2 mb-2">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md border border-amber-400/80 shrink-0 bg-slate-900 flex items-center justify-center p-1">
                <span className="text-sm">{hoveredGuardian.flagSymbol}</span>
                <img
                  src={getCoatOfArmsUrl(hoveredGuardian.id) || `https://flagcdn.com/w80/br-${hoveredGuardian.id.toLowerCase()}.png`}
                  alt={`Brasão de ${hoveredGuardian.stateNamePt}`}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="font-serif font-black text-lg text-amber-400">
                  {hoveredGuardian.stateNamePt} ({hoveredGuardian.id})
                </div>
                <div className="text-xs text-slate-300 font-sans font-medium">
                  Capital: <span className="text-amber-200">{hoveredGuardian.capitalPt}</span> | Região:{' '}
                  <span className="text-amber-300 font-bold uppercase">{hoveredGuardian.regionId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-serif">
              <div className="text-slate-200 text-xs line-clamp-3 italic">
                "{hoveredGuardian.loreStoryPt}"
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-sans font-bold">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-300" /> Clique no estado para entrar na cena RPG
                </span>
                {unlockedInsigniaIds.includes(hoveredGuardian.id) && (
                  <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" /> Adquirida
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- REDESIGNED BOTTOM NAVIGATION TOOLBAR --- */}
      <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4 gap-1">
        {/* Interaction Guide Hint Badge */}
        <div className="pointer-events-auto bg-slate-950/90 border border-amber-500/40 px-3 py-0.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 text-[10px] text-amber-300 font-serif">
          <Grab className="w-3 h-3 text-amber-400" />
          <span>Arraste (Botão Esquerdo/Meio) ou use a roleta do mouse ⟷ para navegar nos 27 estados</span>
        </div>

        {/* Toolbar Container (~80% Width) */}
        <div className="relative w-[82%] max-w-4xl pointer-events-auto rounded-2xl border-2 border-amber-500/50 bg-slate-950/95 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Scroll Left Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollToolbarBy(-260);
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-xl bg-slate-900/90 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/50 transition shadow-md"
            title="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scroll Right Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollToolbarBy(260);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-xl bg-slate-900/90 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/50 transition shadow-md"
            title="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Left Edge Dark Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

          {/* Right Edge Dark Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

          {/* Drag & Scroll Container */}
          <div
            ref={toolbarScrollRef}
            onMouseDown={handleToolbarMouseDown}
            onMouseMove={handleToolbarMouseMove}
            onMouseUp={handleToolbarMouseUp}
            onMouseLeave={handleToolbarMouseUp}
            onWheel={handleToolbarWheel}
            className={`overflow-x-auto scrollbar-none flex items-center gap-2 p-2 px-10 select-none ${
              isToolbarDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <span className="text-xs text-amber-400 font-serif font-black uppercase shrink-0 pr-3 border-r border-amber-500/40 flex items-center gap-1.5 tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-lg">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              27 ESTADOS
            </span>

            {GUARDIANS_DATA.map((g) => {
              const isHovered = hoveredStateId === g.id;
              const hasInsignia = unlockedInsigniaIds.includes(g.id);
              const isDone = completedStateIds.includes(g.id);

              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    stateButtonRefs.current[g.id] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (toolbarHasMovedRef.current) return;
                    handleSelectStateSafe(g);
                  }}
                  onMouseEnter={() => {
                    hoverSourceRef.current = 'toolbar';
                    setHoveredStateId(g.id);
                  }}
                  onMouseLeave={() => setHoveredStateId(null)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all duration-200 flex items-center gap-2 border select-none ${
                    isHovered
                      ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105 shadow-lg shadow-amber-500/30'
                      : hasInsignia
                      ? 'bg-amber-950/80 text-amber-200 border-amber-500/80'
                      : isDone
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/80'
                      : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-amber-500/60'
                  }`}
                >
                  {/* Brasão / Coat of Arms Thumbnail */}
                  <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-950 border border-amber-400/50 shrink-0 flex items-center justify-center p-0.5 shadow-inner">
                    <img
                      src={
                        getCoatOfArmsUrl(g.id) ||
                        `https://flagcdn.com/w80/br-${g.id.toLowerCase()}.png`
                      }
                      alt={g.id}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="tracking-wide font-extrabold">{g.id}</span>
                  <span className="text-xs opacity-90">{g.flagSymbol}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Scroll Progress Bar */}
          <div className="w-full h-1 bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-150"
              style={{ width: `${Math.max(12, Math.min(100, (toolbarScrollProgress || 0) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

