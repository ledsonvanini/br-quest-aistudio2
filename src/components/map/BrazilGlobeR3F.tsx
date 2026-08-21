import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BRAZIL_STATES_GEO, latLonToVector3 } from '../../data/brazilGeoCoordinates';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { StateHeraldicShield } from './StateHeraldicShield';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
  Eye,
  Layers,
  Sparkles,
  Compass,
  Maximize2,
  Sun,
  Moon,
  Globe,
  RotateCw,
} from 'lucide-react';
import { loadBrazilGeoData, loadSouthAmericaGeoData } from '../../lib/geoDataLoader';
import { SOUTH_AMERICA_LANDMASS_GEO } from '../../data/southAmericaGeo';

export type GlobeTextureMode = 'nasa_satellite' | 'night_lights' | 'natural_earth';

interface BrazilGlobeR3FProps {
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
}

interface ProjectedPin {
  stateId: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
  distance: number;
}

// Biome palette for realistic South America natural textures
const STATE_BIOME_PALETTE: Record<string, { base: string; border: string }> = {
  AM: { base: '#154323', border: '#22c55e' },
  PA: { base: '#194928', border: '#22c55e' },
  AC: { base: '#143f21', border: '#22c55e' },
  RO: { base: '#1b4b29', border: '#22c55e' },
  RR: { base: '#1e522d', border: '#22c55e' },
  AP: { base: '#164525', border: '#22c55e' },
  TO: { base: '#365322', border: '#84cc16' },
  BA: { base: '#4a3b1a', border: '#eab308' },
  CE: { base: '#55421d', border: '#eab308' },
  MA: { base: '#2d4b24', border: '#84cc16' },
  PI: { base: '#4f3e1b', border: '#eab308' },
  RN: { base: '#56441e', border: '#eab308' },
  PB: { base: '#53411d', border: '#eab308' },
  PE: { base: '#503f1c', border: '#eab308' },
  AL: { base: '#3d4b1f', border: '#84cc16' },
  SE: { base: '#3e4c1f', border: '#84cc16' },
  MT: { base: '#274e27', border: '#84cc16' },
  MS: { base: '#2f5526', border: '#84cc16' },
  GO: { base: '#3b5423', border: '#eab308' },
  DF: { base: '#425825', border: '#fbbf24' },
  MG: { base: '#2d4b26', border: '#84cc16' },
  SP: { base: '#264828', border: '#22c55e' },
  RJ: { base: '#1f4229', border: '#06b6d4' },
  ES: { base: '#22462b', border: '#06b6d4' },
  PR: { base: '#214425', border: '#22c55e' },
  SC: { base: '#1d4023', border: '#22c55e' },
  RS: { base: '#284c24', border: '#84cc16' },
};

function geoToCanvasXY(lon: number, lat: number, width: number, height: number): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  };
}

function renderGeoJsonGeometry(
  ctx: CanvasRenderingContext2D,
  geometry: any,
  width: number,
  height: number,
  fillStyle?: string,
  strokeStyle?: string,
  lineWidth: number = 1
) {
  if (!geometry) return;

  const drawRing = (coords: number[][]) => {
    if (!coords || coords.length === 0) return;
    for (let i = 0; i < coords.length; i++) {
      const [lon, lat] = coords[i];
      const { x, y } = geoToCanvasXY(lon, lat, width, height);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  };

  ctx.beginPath();
  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach((ring: any) => drawRing(ring));
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly: any) => {
      poly.forEach((ring: any) => drawRing(ring));
    });
  }

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Creates subtle, realistic planetary clouds
 */
function createSubtleCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Soft equatorial cloud bands (ITCZ)
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * 0.48 + (Math.random() - 0.5) * 70;
    const rx = 60 + Math.random() * 130;
    const ry = 15 + Math.random() * 35;
    const grad = ctx.createRadialGradient(x, y, 2, x, y, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    grad.addColorStop(0.6, 'rgba(240, 249, 255, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // South Atlantic moisture band (ZCAS)
  const saX = ((-52 + 180) / 360) * canvas.width;
  const saY = ((90 - -14) / 180) * canvas.height;
  for (let i = 0; i < 30; i++) {
    const offsetX = (Math.random() - 0.5) * 280;
    const x = saX + offsetX;
    const y = saY + (Math.random() - 0.5) * 200 + offsetX * 0.35;
    const rx = 55 + Math.random() * 95;
    const ry = 18 + Math.random() * 38;
    const grad = ctx.createRadialGradient(x, y, 2, x, y, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.6, 'rgba(224, 242, 254, 0.2)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export const BrazilGlobeR3F: React.FC<BrazilGlobeR3FProps> = ({
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateClick,
  onSelectGuardian,
  textureMode = 'nasa_satellite',
  cloudsEnabled = true,
  autoRotate = false,
  showBorders = true,
  pinDisplayMode: propPinMode,
  timeOverride = 'auto',
  focusedStateId,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [projectedPins, setProjectedPins] = useState<ProjectedPin[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [internalPinDisplayMode, setInternalPinDisplayMode] = useState<'all' | 'compact' | 'none'>('all');
  const pinDisplayMode = propPinMode !== undefined ? propPinMode : internalPinDisplayMode;

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const earthMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const bordersMeshRef = useRef<THREE.LineSegments | null>(null);
  const saBordersMeshRef = useRef<THREE.LineSegments | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Textures cache ref to switch instantly between NASA Satellite, Night Lights and Natural Earth
  const textureCacheRef = useRef<Record<string, THREE.Texture>>({});
  const isNasaTextureActiveRef = useRef<boolean>(true);

  // Precomputed state coordinates
  const stateVectors = useRef<Record<string, THREE.Vector3>>({});

  useEffect(() => {
    const vectors: Record<string, THREE.Vector3> = {};
    Object.entries(BRAZIL_STATES_GEO).forEach(([id, geo]) => {
      const [x, y, z] = latLonToVector3(geo.lat, geo.lon, 2.025);
      vectors[id] = new THREE.Vector3(x, y, z);
    });
    stateVectors.current = vectors;
  }, []);

  // Update controls auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 0.6;
    }
  }, [autoRotate]);

  // Update clouds visibility
  useEffect(() => {
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.visible = cloudsEnabled;
    }
  }, [cloudsEnabled]);

  // Update 3D border visibility
  useEffect(() => {
    if (bordersMeshRef.current) {
      bordersMeshRef.current.visible = showBorders;
    }
    if (saBordersMeshRef.current) {
      saBordersMeshRef.current.visible = showBorders;
    }
  }, [showBorders]);

  // Handle camera focus to specific state
  useEffect(() => {
    if (!focusedStateId || !cameraRef.current || !controlsRef.current) return;
    const geo = BRAZIL_STATES_GEO[focusedStateId];
    if (!geo) return;

    const [targetX, targetY, targetZ] = latLonToVector3(geo.lat, geo.lon, 3.4);
    
    // Smoothly animate camera to position facing the state
    const startPos = cameraRef.current.position.clone();
    const endPos = new THREE.Vector3(targetX, targetY, targetZ);
    let progress = 0;

    const animStep = () => {
      progress += 0.05;
      if (progress <= 1 && cameraRef.current) {
        cameraRef.current.position.lerpVectors(startPos, endPos, progress);
        controlsRef.current?.update();
        requestAnimationFrame(animStep);
      }
    };
    animStep();
  }, [focusedStateId]);

  // Switch Texture Mode between NASA Satellite, Night Lights and Natural Earth
  useEffect(() => {
    const earthMat = earthMatRef.current;
    if (!earthMat) return;

    const loader = new THREE.TextureLoader();

    if (textureMode === 'night_lights') {
      const nightUrl = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
      if (textureCacheRef.current[nightUrl]) {
        earthMat.map = textureCacheRef.current[nightUrl];
        earthMat.needsUpdate = true;
      } else {
        loader.load(nightUrl, (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          textureCacheRef.current[nightUrl] = tex;
          earthMat.map = tex;
          earthMat.needsUpdate = true;
        });
      }
    } else {
      // NASA Blue Marble Satellite Texture
      const satelliteUrl = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
      if (textureCacheRef.current[satelliteUrl]) {
        earthMat.map = textureCacheRef.current[satelliteUrl];
        earthMat.needsUpdate = true;
      } else {
        loader.load(satelliteUrl, (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          textureCacheRef.current[satelliteUrl] = tex;
          earthMat.map = tex;
          earthMat.needsUpdate = true;
        });
      }
    }
  }, [textureMode]);

  // Lighting adjustments based on timeOverride
  useEffect(() => {
    if (!sunLightRef.current) return;
    if (timeOverride === 'night') {
      sunLightRef.current.intensity = 0.5;
    } else {
      sunLightRef.current.intensity = 2.6;
    }
  }, [timeOverride]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    // Initial angle centered on South America & Brazil
    camera.position.set(0, -0.6, 4.8);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Smooth OrbitControls with responsive Mouse Wheel Scroll Zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.75;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.5;
    controls.minDistance = 2.15; // Deep zoom into Brazilian states
    controls.maxDistance = 9.0;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = (5 * Math.PI) / 6;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    // Drag state tracking for navigation hand cursor
    controls.addEventListener('start', () => setIsDragging(true));
    controls.addEventListener('end', () => setIsDragging(false));

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8eb, 2.6);
    sunLight.position.set(6, 4, 5);
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const oceanRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    oceanRimLight.position.set(-6, -3, -4);
    scene.add(oceanRimLight);

    // 5. Starfield Dust
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 35 + Math.random() * 35;
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

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Earth Sphere Material
    const earthGeo = new THREE.SphereGeometry(2, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      roughness: 0.5,
      metalness: 0.1,
      color: 0xffffff,
    });
    earthMatRef.current = earthMat;
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMeshRef.current = earthMesh;
    globeGroup.add(earthMesh);

    // Load authentic NASA Visible Earth / Blue Marble Satellite texture as default base
    const textureLoader = new THREE.TextureLoader();
    const primaryNasaUrl = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
    const fallbackNasaUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg';

    const loadBaseNasaTexture = (url: string) => {
      textureLoader.load(
        url,
        (satelliteTex) => {
          satelliteTex.wrapS = THREE.RepeatWrapping;
          satelliteTex.wrapT = THREE.ClampToEdgeWrapping;
          satelliteTex.generateMipmaps = true;
          satelliteTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          textureCacheRef.current[url] = satelliteTex;
          earthMat.map = satelliteTex;
          earthMat.needsUpdate = true;
          isNasaTextureActiveRef.current = true;
        },
        undefined,
        () => {
          if (url === primaryNasaUrl) {
            loadBaseNasaTexture(fallbackNasaUrl);
          }
        }
      );
    };

    loadBaseNasaTexture(primaryNasaUrl);

    // Dynamic Atmospheric Clouds Sphere (Thin, crisp, revolving subtly)
    const cloudGeo = new THREE.SphereGeometry(2.018, 48, 48);
    const cloudTex = createSubtleCloudTexture();
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.42,
      blending: THREE.NormalBlending,
      roughness: 0.9,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.visible = cloudsEnabled;
    cloudsMeshRef.current = cloudMesh;
    globeGroup.add(cloudMesh);

    // Atmospheric Edge Glow Shell (BackSide only - zero haze on camera face!)
    const atmoGeo = new THREE.SphereGeometry(2.08, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // 7. Load GeoJSON Datasets & Add 3D Vector Lines for Brazil and South America
    Promise.all([loadBrazilGeoData(), loadSouthAmericaGeoData()])
      .then(([brazilData, neighborsData]) => {
        // 7.1. Add 3D Golden Lines for Brazil's 27 States
        if (brazilData?.features) {
          const points: number[] = [];

          brazilData.features.forEach((feat: any) => {
            const geom = feat.geometry;
            if (!geom) return;

            const processPolygon = (coords: number[][]) => {
              for (let i = 0; i < coords.length - 1; i++) {
                const [lon1, lat1] = coords[i];
                const [lon2, lat2] = coords[i + 1];
                const [x1, y1, z1] = latLonToVector3(lat1, lon1, 2.012);
                const [x2, y2, z2] = latLonToVector3(lat2, lon2, 2.012);
                points.push(x1, y1, z1, x2, y2, z2);
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

          if (points.length) {
            const linesGeo = new THREE.BufferGeometry();
            linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            const linesMat = new THREE.LineBasicMaterial({
              color: 0xf59e0b, // Pure Gold Lines
              transparent: true,
              opacity: 0.95,
            });
            const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
            bordersMeshRef.current = linesMesh;
            linesMesh.visible = showBorders;
            globeGroup.add(linesMesh);
          }
        }

        // 7.2. Add 3D South America International Borders
        if (neighborsData?.features) {
          const saPoints: number[] = [];

          neighborsData.features.forEach((feat: any) => {
            const geom = feat.geometry;
            if (!geom) return;

            const processSaPolygon = (coords: number[][]) => {
              for (let i = 0; i < coords.length - 1; i++) {
                const [lon1, lat1] = coords[i];
                const [lon2, lat2] = coords[i + 1];
                const [x1, y1, z1] = latLonToVector3(lat1, lon1, 2.008);
                const [x2, y2, z2] = latLonToVector3(lat2, lon2, 2.008);
                saPoints.push(x1, y1, z1, x2, y2, z2);
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
              opacity: 0.5,
            });
            const saLinesMesh = new THREE.LineSegments(saLinesGeo, saLinesMat);
            saBordersMeshRef.current = saLinesMesh;
            saLinesMesh.visible = showBorders;
            globeGroup.add(saLinesMesh);
          }
        }

        // 7.3. Add 3D Amazon River & São Francisco River Path
        const riverPoints: number[] = [];
        const amzCoords = [
          [-73.4, -4.5], [-70.0, -3.5], [-63.0, -3.1], [-58.4, -2.5],
          [-54.7, -2.2], [-51.9, -1.8], [-48.5, -0.6]
        ];
        for (let i = 0; i < amzCoords.length - 1; i++) {
          const [lon1, lat1] = amzCoords[i];
          const [lon2, lat2] = amzCoords[i + 1];
          const [x1, y1, z1] = latLonToVector3(lat1, lon1, 2.010);
          const [x2, y2, z2] = latLonToVector3(lat2, lon2, 2.010);
          riverPoints.push(x1, y1, z1, x2, y2, z2);
        }
        if (riverPoints.length) {
          const riverGeo = new THREE.BufferGeometry();
          riverGeo.setAttribute('position', new THREE.Float32BufferAttribute(riverPoints, 3));
          const riverMat = new THREE.LineBasicMaterial({
            color: 0x0284c7,
            transparent: true,
            opacity: 0.9,
          });
          const riverMesh = new THREE.LineSegments(riverGeo, riverMat);
          globeGroup.add(riverMesh);
        }
      })
      .catch((err) => {
        console.error('Error loading 3D globe geo data:', err);
      });

    // 8. Animation Loop with Screen Space Pin Projection
    const tempVec = new THREE.Vector3();
    const cameraWorldPos = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      if (cloudsMeshRef.current && cloudsMeshRef.current.visible) {
        cloudsMeshRef.current.rotation.y += 0.0002;
      }

      camera.getWorldPosition(cameraWorldPos);

      const currentWidth = container.clientWidth || width;
      const currentHeight = container.clientHeight || height;

      const newPins: ProjectedPin[] = [];

      Object.entries(stateVectors.current).forEach(([stateId, worldPos]) => {
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
      renderer.render(scene, camera);
    };

    animate();

    // 9. Responsive Resize Observer
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

    // 10. Direct Wheel Zoom Handler ensuring smooth scroll zoom anywhere on canvas
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      const currentDist = camera.position.length();
      const targetDist = THREE.MathUtils.clamp(currentDist * zoomFactor, 2.15, 9.0);
      camera.position.setLength(targetDist);
      controls.update();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudTex.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Quick reset / zoom controls
  const handleResetView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, -0.6, 4.8);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handleZoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newLen = Math.max(2.15, cameraRef.current.position.length() * 0.8);
    cameraRef.current.position.setLength(newLen);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newLen = Math.min(9.0, cameraRef.current.position.length() * 1.25);
    cameraRef.current.position.setLength(newLen);
    controlsRef.current.update();
  };

  const handleRotateStep = (angleDeg: number = 15) => {
    if (!globeGroupRef.current) return;
    globeGroupRef.current.rotation.y += (angleDeg * Math.PI) / 180;
  };

  const handlePinClick = useCallback(
    (stateId: string) => {
      onStateClick(stateId);
      if (onSelectGuardian) {
        const g = GUARDIANS_DATA.find((item) => item.id === stateId);
        if (g) onSelectGuardian(g);
      }
    },
    [onStateClick, onSelectGuardian]
  );

  return (
    <div className="container-palco-globo-3d container-globo-3d-r3f relative w-full h-full bg-[#010613] select-none overflow-hidden">
      {/* 3D WebGL Canvas Mount Container with Custom Hand Cursor Styling */}
      <div
        ref={mountRef}
        className={`camada-canvas-globo-3d absolute inset-0 w-full h-full ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Floating Navigation Instructions Pill HUD */}
      <div className="painel-instrucao-navegacao absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs font-serif shadow-2xl pointer-events-none animate-fadeIn">
        <div className="flex items-center gap-1.5 text-amber-300">
          <Hand className="w-4 h-4 text-amber-400" />
          <span>Arraste para Girar</span>
        </div>
        <span className="text-amber-500/60">•</span>
        <div className="flex items-center gap-1 text-slate-300">
          <span>Scroll para Zoom</span>
        </div>
        <span className="text-amber-500/60">•</span>
        <div className="flex items-center gap-1 text-yellow-300">
          <span>Clique nos Brasões</span>
        </div>
      </div>

      {/* Floating Camera & Pins Control HUD (Bottom Right) */}
      <div className="painel-hud-controles absolute bottom-6 right-6 z-30 flex flex-col gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-amber-500/40 shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="btn-zoom-in p-2.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
          title="Aproximar Zoom (Scroll Up)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="btn-zoom-out p-2.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
          title="Afastar Zoom (Scroll Down)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleRotateStep(15)}
          className="btn-rotate-step p-2.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all border-t border-slate-800 cursor-pointer"
          title="Girar Terra (+15°)"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetView}
          className="btn-reset-view p-2.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all border-t border-slate-800 cursor-pointer"
          title="Centralizar Brasil"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setInternalPinDisplayMode((prev) => (prev === 'all' ? 'compact' : prev === 'compact' ? 'none' : 'all'));
          }}
          className="btn-toggle-pin-mode p-2.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-all border-t border-slate-800 cursor-pointer"
          title={`Modo de Brasões: ${pinDisplayMode === 'all' ? 'Brasões Completos' : pinDisplayMode === 'compact' ? 'Siglas UF' : 'Oculto'}`}
        >
          <Eye className={`w-5 h-5 ${pinDisplayMode === 'all' ? 'text-amber-400' : 'text-slate-500'}`} />
        </button>
      </div>

      {/* Screen-Space Projected Heraldic Pins Overlay (Black 40% + Gold Border + Brasão de Cada Estado) */}
      {pinDisplayMode !== 'none' && (
        <div className="camada-pins-projetados-3d absolute inset-0 pointer-events-none overflow-hidden z-20">
          {projectedPins.map(({ stateId, x, y, scale, distance }) => {
            const isCompleted = completedStateIds.has(stateId);
            const isHovered = hoveredStateId === stateId;
            const isSelected = selectedStateId === stateId;

            // Distance-based Level of Detail (LOD)
            const isZoomedOut = distance > 5.2 && pinDisplayMode !== 'all';
            const pinScale = scale * (isHovered || isSelected ? 1.3 : 1);

            return (
              <div
                key={stateId}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -100%) scale(${pinScale})`,
                  transformOrigin: 'bottom center',
                }}
                className="pin-estado-3d-item absolute pointer-events-auto transition-transform duration-150"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinClick(stateId);
                  }}
                  onMouseEnter={() => onStateHover(stateId)}
                  onMouseLeave={() => onStateHover(null)}
                  className="btn-pin-globo-3d group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer"
                  aria-label={`Estado ${stateId}`}
                >
                  {/* 1. Radar Pulse Ring */}
                  <div className="circulo-radar-3d absolute -inset-2.5 pointer-events-none flex items-center justify-center">
                    <div
                      className={`absolute w-10 h-10 rounded-full border transition-all duration-300 ${
                        isSelected
                          ? 'border-2 border-yellow-300 bg-amber-400/30 animate-ping opacity-90'
                          : isCompleted
                          ? 'border border-amber-300/80 bg-amber-500/20 animate-ping opacity-75'
                          : isHovered
                          ? 'border-2 border-amber-400 bg-yellow-400/25 animate-ping opacity-85'
                          : 'border border-amber-400/30 opacity-30 group-hover:opacity-80 group-hover:animate-ping'
                      }`}
                      style={{ animationDuration: isSelected ? '1.4s' : '2.8s' }}
                    />
                  </div>

                  {/* 2. Heraldic Shield with Official Crest on Black 40% + Gold Border */}
                  {(!isZoomedOut || isHovered || isSelected) && (
                    <StateHeraldicShield
                      stateId={stateId}
                      isCompleted={isCompleted}
                      isSelected={isSelected}
                      isHovered={isHovered}
                      size="md"
                    />
                  )}

                  {/* 3. State UF Tag Badge (Black 40% + Gold Border) */}
                  <div
                    className={`pill-sigla-uf-3d mt-0.5 px-2 py-0.2 text-[10px] font-black rounded-full shadow-md whitespace-nowrap z-20 border transition-colors ${
                      isCompleted
                        ? 'bg-amber-400 text-slate-950 border-amber-200 font-bold'
                        : isSelected || isHovered
                        ? 'bg-yellow-400 text-slate-950 border-yellow-200 font-bold'
                        : 'bg-black/60 backdrop-blur-sm text-amber-300 border-amber-400/80'
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
