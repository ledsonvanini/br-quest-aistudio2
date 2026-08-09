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
  const [zoom, setZoom] = useState<number>(0.85);
  const [tiltAngle, setTiltAngle] = useState<number>(32); // Default 32° RPG Orthographic camera tilt
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover state
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);

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

  // Filter continental features (excluding oceanic islands > -34.5° lon)
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
            return minX < -34.5;
          });
          return { ...f, geometry: { ...f.geometry, coordinates: coords } };
        }
        return f;
      }),
    };
  }, [geoData]);

  // Standard Mercator Path Generator fitted to mapa-br-estados2.png (1460x1392 centered at x=550, y=24)
  const pathGenerator = useMemo(() => {
    if (!geoData || !continentalGeo) return null;

    const proj = geoMercator();
    proj.fitExtent([[550, 24], [2010, 1416]], continentalGeo as any);

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

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(2.5, Math.max(0.5, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(0.85);
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
      className={`relative w-full h-[620px] sm:h-[680px] rounded-3xl overflow-hidden bg-[#0a121d] border-2 border-amber-500/60 shadow-2xl select-none cursor-${
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
            setZoom((z) => Math.max(0.5, z * 0.85));
            audioEngine.playSfx('click');
          }}
          className="p-2 text-slate-200 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
          title="Zoom Out"
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

      {/* --- OCEAN BACKGROUND PARALLAX LAYER --- */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none z-0 transition-transform duration-300 ease-out scale-110"
        style={{
          transform: `translate(${pan.x * 0.25}px, ${pan.y * 0.25}px) scale(${1 + (zoom - 1) * 0.15})`,
          backgroundImage:
            "url('/br/bg-mapa-br.png'), radial-gradient(circle at center, #0284c7 0%, #0369a1 50%, #0c4a6e 100%)",
        }}
      />

      {/* --- MAIN THREE.JS / ORTHOGRAPHIC RPG MAP CANVAS CONTAINER --- */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-300 ease-out p-2 overflow-visible"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) rotateX(${tiltAngle}deg) rotateZ(${rotationAngle}deg) scale(${zoom})`,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 2560 1440"
          className="w-full h-auto aspect-[16/9] max-w-[1280px] drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-visible"
        >
          <defs>
            {/* Golden Glow Filter */}
            <filter id="goldGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="2.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
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
          </defs>

          {/* LAYER 2: Undistorted Brazil Map Image (mapa-br-estados2.png 1460x1392 centered at 550, 24) */}
          <image
            href="/br/mapa-br-estados2.png"
            x="550"
            y="24"
            width="1460"
            height="1392"
            preserveAspectRatio="none"
          />

          {/* LAYER 3: GeoJSON Interactive State Polygons */}
          <g className="geojson-states">
            {geoData &&
              pathGenerator &&
              geoData.features.map((feat) => {
                const stateId = feat.properties.id.replace('BR', '');
                const guardian = GUARDIANS_DATA.find((g) => g.id === stateId);
                const isHovered = hoveredStateId === stateId;
                const pathD = pathGenerator(feat as any);

                if (!pathD) return null;

                return (
                  <path
                    key={`state-shape-${stateId}`}
                    d={pathD}
                    fill={isHovered ? 'rgba(245, 158, 11, 0.35)' : 'rgba(0, 0, 0, 0.01)'}
                    stroke={isHovered ? '#fbbf24' : 'rgba(245, 158, 11, 0.25)'}
                    strokeWidth={isHovered ? '3.5' : '1.0'}
                    strokeLinejoin="round"
                    filter={isHovered ? 'url(#goldGlow)' : undefined}
                    className="cursor-pointer transition-colors duration-150"
                    onMouseEnter={() => {
                      setHoveredStateId(stateId);
                      audioEngine.playSfx('step');
                    }}
                    onMouseLeave={() => setHoveredStateId(null)}
                    onClick={() => {
                      if (guardian) {
                        audioEngine.playSfx('click');
                        onSelectGuardian(guardian);
                      }
                    }}
                  />
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
                  {/* Invisible Hit Area */}
                  <circle
                    cx={pinX}
                    cy={pinY}
                    r="56"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredStateId(guardian.id);
                      audioEngine.playSfx('step');
                    }}
                    onMouseLeave={() => setHoveredStateId(null)}
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onSelectGuardian(guardian);
                    }}
                  />

                  {/* State Marker Group */}
                  <g
                    transform={`translate(${pinX}, ${pinY})`}
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onSelectGuardian(guardian);
                    }}
                    onMouseEnter={() => {
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
        </svg>
      </div>

      {/* --- HOVER DISPLAY: LEFT GUARDIAN STANDEE & RIGHT STATE POPOVER PANEL --- */}
      {hoveredGuardian && (
        <>
          {/* LEFT SIDE PANEL */}
          <div className="fixed left-4 md:left-8 top-20 z-30 pointer-events-none w-72 bg-slate-950/95 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl text-amber-100 backdrop-blur-md animate-in slide-in-from-left-4 fade-in duration-200">
            <div className="text-[10px] uppercase tracking-widest text-amber-400 font-mono font-bold mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Guardião de {hoveredGuardian.stateNamePt}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xl shrink-0 bg-slate-900">
                <img
                  src={hoveredGuardian.avatarUrl}
                  alt={hoveredGuardian.guardianName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-serif font-black text-base text-amber-300">
                  {hoveredGuardian.guardianName}
                </div>
                <div className="text-xs text-amber-200/90 font-serif italic line-clamp-2">
                  {hoveredGuardian.guardianTitlePt}
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-300 font-serif line-clamp-3 italic bg-amber-950/40 p-2 rounded-lg border border-amber-500/20">
              "{hoveredGuardian.garbDescriptionPt}"
            </p>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="fixed right-4 md:right-8 top-20 z-30 pointer-events-none w-80 bg-slate-950/95 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl text-amber-100 backdrop-blur-md animate-in slide-in-from-right-4 fade-in duration-200">
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
                  <UserCheck className="w-4 h-4 text-amber-300" /> Clique no estado para interagir
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

      {/* --- BOTTOM QUICK NAVIGATION BAR --- */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto max-w-full overflow-x-auto scrollbar-none flex items-center gap-1.5 p-2 bg-slate-950/90 backdrop-blur-md rounded-2xl border-2 border-amber-500/40 shadow-2xl">
          <span className="text-[10px] text-amber-400 font-serif font-bold uppercase shrink-0 px-2">
            27 Estados:
          </span>
          {GUARDIANS_DATA.map((g) => {
            const isHovered = hoveredStateId === g.id;
            const hasInsignia = unlockedInsigniaIds.includes(g.id);
            const isDone = completedStateIds.includes(g.id);

            return (
              <button
                key={g.id}
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectGuardian(g);
                }}
                onMouseEnter={() => setHoveredStateId(g.id)}
                onMouseLeave={() => setHoveredStateId(null)}
                className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-serif font-bold transition flex items-center gap-1 border ${
                  isHovered
                    ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105'
                    : hasInsignia
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{g.id}</span>
                <span>{g.flagSymbol}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

