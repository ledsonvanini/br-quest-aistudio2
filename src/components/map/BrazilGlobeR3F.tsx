import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BRAZIL_STATES_GEO, latLonToVector3 } from '../../data/brazilGeoCoordinates';
import { getCoatOfArmsUrl } from '../../data/coatOfArms';
import { GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { Shield, Sparkles } from 'lucide-react';

interface BrazilGlobeR3FProps {
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  onSelectGuardian?: (guardian: GuardianData) => void;
}

interface ProjectedPin {
  stateId: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

// Procedural high-res Canvas Earth Texture for realistic continents & ocean
function createEarthCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep Ocean Base with Bathymetry Gradients
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#04132b');
  oceanGrad.addColorStop(0.3, '#020b18');
  oceanGrad.addColorStop(0.5, '#051b3a');
  oceanGrad.addColorStop(0.7, '#020b18');
  oceanGrad.addColorStop(1, '#04132b');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Subtle Nautical Graticule (Meridians & Parallels)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
  ctx.lineWidth = 1;
  for (let lon = 0; lon <= 360; lon += 15) {
    const x = (lon / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 15) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // 3. Equator and Tropic Highlight Lines
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  // 4. South America & Brazil Shaded Landmass Texture
  const saGrad = ctx.createRadialGradient(720, 600, 40, 720, 600, 320);
  saGrad.addColorStop(0, '#1e3a29'); // Amazon Rainforest Green
  saGrad.addColorStop(0.35, '#2d4a22'); // Cerrado & Savannah
  saGrad.addColorStop(0.65, '#3b321c'); // Andes & Highlands
  saGrad.addColorStop(0.9, '#1a2e1d'); // Pampas & Southern Atlantic Forest
  saGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = saGrad;
  ctx.beginPath();
  ctx.ellipse(720, 620, 160, 240, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Brazil Golden Core Shimmer
  const brGrad = ctx.createRadialGradient(740, 590, 20, 740, 590, 140);
  brGrad.addColorStop(0, 'rgba(217, 119, 6, 0.3)');
  brGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.35)');
  brGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = brGrad;
  ctx.beginPath();
  ctx.ellipse(740, 590, 120, 150, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const BrazilGlobeR3F: React.FC<BrazilGlobeR3FProps> = ({
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateClick,
  onSelectGuardian,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [projectedPins, setProjectedPins] = useState<ProjectedPin[]>([]);

  // Keep references to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Precompute 3D vectors for each state
  const stateVectors = useRef<Record<string, THREE.Vector3>>({});

  useEffect(() => {
    const vectors: Record<string, THREE.Vector3> = {};
    Object.entries(BRAZIL_STATES_GEO).forEach(([id, geo]) => {
      const [x, y, z] = latLonToVector3(geo.lat, geo.lon, 2.03);
      vectors[id] = new THREE.Vector3(x, y, z);
    });
    stateVectors.current = vectors;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -0.6, 5.0);
    cameraRef.current = camera;

    // 2. WebGL Renderer with High Precision & Antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls (Smooth Google Earth-style navigation restricted to South America)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.85;
    controls.minDistance = 3.2;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = Math.PI / 4.5;
    controls.maxPolarAngle = (3.2 * Math.PI) / 4.5;
    controls.minAzimuthAngle = -Math.PI / 1.4;
    controls.maxAzimuthAngle = Math.PI / 1.4;
    controlsRef.current = controls;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    sunLight.position.set(6, 4, 5);
    scene.add(sunLight);

    const oceanFillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    oceanFillLight.position.set(-6, -3, -4);
    scene.add(oceanFillLight);

    // 5. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, transparent: true, opacity: 0.75 });
    const starsMesh = new THREE.Points(starsGeo, starsMat);
    scene.add(starsMesh);

    // 6. Earth Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Earth Sphere
    const earthGeo = new THREE.SphereGeometry(2, 64, 64);
    const earthTex = createEarthCanvasTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.6,
      metalness: 0.1,
      color: 0xdbeafe,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Atmospheric Glow Shell
    const atmoGeo = new THREE.SphereGeometry(2.05, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Golden Boundary Graticule Rings
    const ringGeo = new THREE.SphereGeometry(2.015, 32, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    globeGroup.add(ringMesh);

    // 7. Animation Loop with Screen Space Pin Projection
    const tempVec = new THREE.Vector3();
    const cameraWorldPos = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      camera.getWorldPosition(cameraWorldPos);

      // Project 3D state coordinates onto screen space for interactive HTML overlays
      const currentWidth = container.clientWidth || width;
      const currentHeight = container.clientHeight || height;

      const newPins: ProjectedPin[] = [];

      Object.entries(stateVectors.current).forEach(([stateId, worldPos]) => {
        // Clone vector and transform by globe group if rotated
        tempVec.copy(worldPos);
        tempVec.applyMatrix4(globeGroup.matrixWorld);

        // Check if the pin is on the facing side of the sphere
        // Vector from sphere center (0,0,0) to point
        const dot = tempVec.dot(cameraWorldPos);
        const isVisible = dot > 1.8; // visible on front hemisphere

        if (isVisible) {
          tempVec.project(camera);
          const screenX = (tempVec.x * 0.5 + 0.5) * currentWidth;
          const screenY = (-(tempVec.y * 0.5) + 0.5) * currentHeight;
          const dist = cameraWorldPos.distanceTo(worldPos);
          const scale = Math.max(0.65, Math.min(1.3, 5.0 / dist));

          newPins.push({
            stateId,
            x: screenX,
            y: screenY,
            visible: true,
            scale,
          });
        }
      });

      setProjectedPins(newPins);
      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Observer
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

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      earthTex.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

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
    <div className="container-palco-globo-3d container-globo-3d-r3f relative w-full h-full bg-[#020611] select-none overflow-hidden">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="camada-canvas-globo-3d absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Screen-Space Projected Heraldic Pins Overlay (Pure Gold Radiant Aura) */}
      <div className="camada-pins-projetados-3d absolute inset-0 pointer-events-none overflow-hidden z-20">
        {projectedPins.map(({ stateId, x, y, scale }) => {
          const isCompleted = completedStateIds.has(stateId);
          const isHovered = hoveredStateId === stateId;
          const isSelected = selectedStateId === stateId;
          const coatUrl = getCoatOfArmsUrl(stateId);

          return (
            <div
              key={stateId}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -100%) scale(${scale * (isHovered || isSelected ? 1.35 : 1)})`,
                transformOrigin: 'bottom center',
              }}
              className="pin-estado-3d-item absolute pointer-events-auto transition-transform duration-200"
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
                {/* 1. Radar Ring Pulser (Gold Themed) */}
                <div className="circulo-radar-3d absolute -inset-2.5 pointer-events-none flex items-center justify-center">
                  <div
                    className={`absolute w-11 h-11 rounded-full border transition-all duration-300 ${
                      isSelected
                        ? 'border-2 border-yellow-300 bg-amber-400/30 animate-ping opacity-90'
                        : isCompleted
                        ? 'border border-amber-300/80 bg-amber-500/20 animate-ping opacity-75'
                        : isHovered
                        ? 'border-2 border-amber-400 bg-yellow-400/25 animate-ping opacity-85'
                        : 'border border-amber-400/40 opacity-40 group-hover:opacity-80 group-hover:animate-ping'
                    }`}
                    style={{ animationDuration: isSelected ? '1.4s' : '2.6s' }}
                  />

                  {/* Halo Glow Ring */}
                  <div
                    className={`absolute w-10 h-10 rounded-full border transition-all duration-300 ${
                      isSelected || isHovered
                        ? 'border-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.9)] bg-amber-500/30 scale-110'
                        : 'border-amber-500/50 shadow-[0_0_6px_rgba(245,158,11,0.4)] bg-slate-950/60'
                    }`}
                  />
                </div>

                {/* 2. Heraldic Shield Pin with Official Crest */}
                <div
                  className={`moldura-heraldica-brasao relative w-9 h-11 rounded-b-lg rounded-t-sm flex items-center justify-center p-0.5 shadow-2xl transition-all duration-200 z-10 ${
                    isCompleted
                      ? 'bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 border-1.5 border-amber-300 shadow-amber-500/60'
                      : isSelected || isHovered
                      ? 'bg-gradient-to-b from-yellow-500 via-amber-800 to-slate-950 border-2 border-yellow-300 shadow-yellow-400/70'
                      : 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-1.5 border-amber-500/80 shadow-black/80'
                  }`}
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
                  }}
                >
                  {coatUrl ? (
                    <img
                      src={coatUrl}
                      alt={stateId}
                      className="w-full h-full object-contain drop-shadow"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Shield className="w-5 h-5 text-amber-300" />
                  )}

                  {/* Sparkle badge */}
                  {(isHovered || isSelected) && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-200 animate-pulse" />
                  )}
                </div>

                {/* 3. State UF Tag Badge */}
                <div
                  className={`pill-sigla-uf-3d mt-0.5 px-2 py-0.2 text-[10px] font-black rounded-full shadow-md whitespace-nowrap z-20 border transition-colors ${
                    isCompleted
                      ? 'bg-amber-400 text-slate-950 border-amber-200 font-bold'
                      : isSelected || isHovered
                      ? 'bg-yellow-400 text-slate-950 border-yellow-200 font-bold'
                      : 'bg-slate-950/90 text-amber-300 border-amber-500/60'
                  }`}
                >
                  {stateId}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
