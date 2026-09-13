/**
 * Starfield Generator for BrazilGlobeR3F
 * Produces photorealistic astronomical stars with diverse spectral colors (O, B, A, F, G, K, M),
 * smooth circular gaussian point textures, realistic magnitudes, and a safe celestial sphere
 * radius to eliminate any z-fighting, camera clipping, or frame flicker.
 */
import * as THREE from 'three';

// Stellar Spectral Class RGB Colors
const SPECTRAL_COLORS: THREE.Color[] = [
  new THREE.Color(0x93c5fd), // Class O/B: Blue / Blue-White (e.g. Rigel, Spica)
  new THREE.Color(0xbfdbfe), // Class A: White-Blue (e.g. Sirius, Vega)
  new THREE.Color(0xf8fafc), // Class F: Pure White (e.g. Canopus, Procyon)
  new THREE.Color(0xfef08a), // Class G: Yellow Solar (e.g. Sun, Alpha Centauri A)
  new THREE.Color(0xfde047), // Class G2: Warm Yellow
  new THREE.Color(0xfed7aa), // Class K: Orange Giant (e.g. Arcturus, Aldebaran)
  new THREE.Color(0xfca5a5), // Class M: Red Dwarf / Supergiant (e.g. Betelgeuse, Antares)
];

let cachedStarTexture: THREE.CanvasTexture | null = null;

/**
 * Creates a soft circular anti-aliased Gaussian point sprite texture
 * so stars render as radiant round cosmic points instead of square pixel blocks.
 */
function getStarSpriteTexture(): THREE.CanvasTexture {
  if (cachedStarTexture) return cachedStarTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = 32;
    const cy = 32;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.4, 'rgba(220, 235, 255, 0.45)');
    gradient.addColorStop(0.7, 'rgba(180, 210, 255, 0.12)');
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  cachedStarTexture = texture;
  return texture;
}

export interface StarfieldObject {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
}

/**
 * Generates an astronomical background starfield with 4,200 stars placed
 * on a spherical shell between r = 240 and 290 units.
 */
export function createRealisticStarfield(count = 4200): StarfieldObject {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const tempColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Distribute on spherical shell between 240 and 290 to prevent clipping
    const r = 240 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Pick spectral class weighted towards white/yellow/blue
    const rand = Math.random();
    let spectralIdx = 1; // Default Class A white
    if (rand < 0.25) spectralIdx = 0; // Blue
    else if (rand < 0.55) spectralIdx = 1; // White-Blue
    else if (rand < 0.75) spectralIdx = 2; // Pure White
    else if (rand < 0.88) spectralIdx = 3; // Solar Yellow
    else if (rand < 0.95) spectralIdx = 5; // Orange
    else spectralIdx = 6; // Red

    const baseColor = SPECTRAL_COLORS[spectralIdx];
    // Modulate brightness slightly
    const brightness = 0.65 + Math.random() * 0.35;
    tempColor.copy(baseColor).multiplyScalar(brightness);

    colors[i3] = tempColor.r;
    colors[i3 + 1] = tempColor.g;
    colors[i3 + 2] = tempColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.2,
    map: getStarSpriteTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false, // Prevents any z-buffer occlusion or flicker
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'realistic_starfield';

  return { points, geometry, material };
}

/**
 * Convenience helper returning the THREE.Points instance directly.
 */
export function createDeepSpaceStarfield(count = 4200): THREE.Points {
  return createRealisticStarfield(count).points;
}
