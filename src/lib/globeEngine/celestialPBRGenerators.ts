/**
 * Procedural PBR Generators for Solar System Planetary Bodies
 * Generates high-detail Albedo, Bump/Normal, and Roughness canvas textures.
 */
import * as THREE from 'three';
import { PlanetPBRMaps } from './celestialPBR';

export function createProceduralCanvas(
  w: number,
  h: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

export function wrapTexture(tex: THREE.CanvasTexture): THREE.CanvasTexture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Mars PBR: Rust Iron-Oxide Albedo, Olympus Mons & Valles Marineris Bump, Polar Ice Gloss
 */
export function generateMarsPBR(): PlanetPBRMaps {
  const { canvas: aCan, ctx: aCtx } = createProceduralCanvas(1024, 512);
  const { canvas: bCan, ctx: bCtx } = createProceduralCanvas(1024, 512);
  const { canvas: rCan, ctx: rCtx } = createProceduralCanvas(512, 256);

  // Albedo
  aCtx.fillStyle = '#b44414';
  aCtx.fillRect(0, 0, 1024, 512);
  aCtx.fillStyle = '#7c2d12';
  aCtx.beginPath();
  aCtx.ellipse(460, 260, 170, 95, -0.18, 0, Math.PI * 2);
  aCtx.fill();
  aCtx.beginPath();
  aCtx.ellipse(780, 280, 200, 70, 0.12, 0, Math.PI * 2);
  aCtx.fill();
  // Polar Ice Caps
  aCtx.fillStyle = '#f8fafc';
  aCtx.beginPath();
  aCtx.ellipse(512, 0, 512, 45, 0, 0, Math.PI * 2);
  aCtx.fill();
  aCtx.beginPath();
  aCtx.ellipse(512, 512, 512, 55, 0, 0, Math.PI * 2);
  aCtx.fill();

  // Bump Map (Neutral gray = 128, White = peak, Black = canyon)
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 512);
  // Olympus Mons Peak
  const omGrad = bCtx.createRadialGradient(280, 210, 0, 280, 210, 60);
  omGrad.addColorStop(0, '#ffffff');
  omGrad.addColorStop(0.7, '#a0a0a0');
  omGrad.addColorStop(1, '#808080');
  bCtx.fillStyle = omGrad;
  bCtx.beginPath();
  bCtx.arc(280, 210, 60, 0, Math.PI * 2);
  bCtx.fill();
  // Valles Marineris Canyon
  bCtx.strokeStyle = '#202020';
  bCtx.lineWidth = 14;
  bCtx.beginPath();
  bCtx.moveTo(420, 250);
  bCtx.bezierCurveTo(550, 260, 620, 240, 720, 255);
  bCtx.stroke();
  bCtx.fillStyle = '#c0c0c0';
  bCtx.fillRect(0, 0, 1024, 35);
  bCtx.fillRect(0, 512 - 45, 1024, 45);

  // Roughness Map
  rCtx.fillStyle = '#d0d0d0'; // Dry regolith
  rCtx.fillRect(0, 0, 512, 256);
  rCtx.fillStyle = '#3a3a3a'; // Glossy polar ice
  rCtx.fillRect(0, 0, 512, 20);
  rCtx.fillRect(0, 256 - 25, 512, 25);

  return {
    albedoMap: wrapTexture(new THREE.CanvasTexture(aCan)),
    bumpMap: wrapTexture(new THREE.CanvasTexture(bCan)),
    roughnessMap: wrapTexture(new THREE.CanvasTexture(rCan)),
    bumpScale: 0.12,
    roughness: 0.82,
    metalness: 0.05,
  };
}

/**
 * Venus PBR: Swirling Sulfuric Acid Cloud Albedo, Atmospheric Wave Bump, High Specular Gloss
 */
export function generateVenusPBR(): PlanetPBRMaps {
  const { canvas: aCan, ctx: aCtx } = createProceduralCanvas(1024, 512);
  const { canvas: bCan, ctx: bCtx } = createProceduralCanvas(1024, 512);
  const { canvas: rCan, ctx: rCtx } = createProceduralCanvas(512, 256);

  const grad = aCtx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#fef9c3');
  grad.addColorStop(0.3, '#fef08a');
  grad.addColorStop(0.5, '#fde047');
  grad.addColorStop(0.7, '#fef08a');
  grad.addColorStop(1, '#fef9c3');
  aCtx.fillStyle = grad;
  aCtx.fillRect(0, 0, 1024, 512);

  aCtx.fillStyle = 'rgba(217, 119, 6, 0.14)';
  for (let x = 0; x < 1024; x += 12) {
    const y = 256 + Math.sin(x * 0.02) * 55;
    aCtx.beginPath();
    aCtx.arc(x, y, 42, 0, Math.PI * 2);
    aCtx.fill();
  }

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 512);
  bCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  bCtx.lineWidth = 18;
  for (let i = 1; i < 7; i++) {
    bCtx.beginPath();
    bCtx.moveTo(0, i * 75);
    bCtx.bezierCurveTo(256, i * 75 + 25, 768, i * 75 - 25, 1024, i * 75);
    bCtx.stroke();
  }

  rCtx.fillStyle = '#505050'; // Smooth sulfuric aerosol (low roughness)
  rCtx.fillRect(0, 0, 512, 256);

  return {
    albedoMap: wrapTexture(new THREE.CanvasTexture(aCan)),
    bumpMap: wrapTexture(new THREE.CanvasTexture(bCan)),
    roughnessMap: wrapTexture(new THREE.CanvasTexture(rCan)),
    bumpScale: 0.05,
    roughness: 0.30,
    metalness: 0.08,
  };
}

/**
 * Jupiter PBR: Zonal Jet Streams, Great Red Spot, Cloud Deck Altitude Steps
 */
export function generateJupiterPBR(): PlanetPBRMaps {
  const { canvas: aCan, ctx: aCtx } = createProceduralCanvas(1024, 512);
  const { canvas: bCan, ctx: bCtx } = createProceduralCanvas(1024, 512);
  const { canvas: rCan, ctx: rCtx } = createProceduralCanvas(512, 256);

  const bands = [
    '#d6c7af', '#b48a60', '#e3d5c1', '#a67244', '#dfd2bc',
    '#995f32', '#decbbe', '#b17b4c', '#e6dbc9', '#90532b'
  ];
  const h = 512 / bands.length;
  bands.forEach((color, i) => {
    aCtx.fillStyle = color;
    aCtx.fillRect(0, i * h, 1024, h + 2);
  });

  const grsX = 640;
  const grsY = 320;
  const grs = aCtx.createRadialGradient(grsX, grsY, 0, grsX, grsY, 55);
  grs.addColorStop(0, '#dc2626');
  grs.addColorStop(0.75, '#ea580c');
  grs.addColorStop(1, 'transparent');
  aCtx.fillStyle = grs;
  aCtx.beginPath();
  aCtx.ellipse(grsX, grsY, 68, 40, 0, 0, Math.PI * 2);
  aCtx.fill();

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 512);
  bands.forEach((_, i) => {
    bCtx.fillStyle = i % 2 === 0 ? '#989898' : '#686868';
    bCtx.fillRect(0, i * h, 1024, h);
  });
  const grsBump = bCtx.createRadialGradient(grsX, grsY, 0, grsX, grsY, 55);
  grsBump.addColorStop(0, '#d0d0d0');
  grsBump.addColorStop(1, '#808080');
  bCtx.fillStyle = grsBump;
  bCtx.beginPath();
  bCtx.ellipse(grsX, grsY, 68, 40, 0, 0, Math.PI * 2);
  bCtx.fill();

  rCtx.fillStyle = '#909090';
  rCtx.fillRect(0, 0, 512, 256);

  return {
    albedoMap: wrapTexture(new THREE.CanvasTexture(aCan)),
    bumpMap: wrapTexture(new THREE.CanvasTexture(bCan)),
    roughnessMap: wrapTexture(new THREE.CanvasTexture(rCan)),
    bumpScale: 0.08,
    roughness: 0.60,
    metalness: 0.04,
  };
}

/**
 * Mercury / Moon PBR: Impact Craters with Raised Rims & Depressed Floors
 */
export function generateMercuryPBR(): PlanetPBRMaps {
  const { canvas: aCan, ctx: aCtx } = createProceduralCanvas(1024, 512);
  const { canvas: bCan, ctx: bCtx } = createProceduralCanvas(1024, 512);
  const { canvas: rCan, ctx: rCtx } = createProceduralCanvas(512, 256);

  aCtx.fillStyle = '#64748b';
  aCtx.fillRect(0, 0, 1024, 512);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 65; i++) {
    const cx = (i * 127) % 1024;
    const cy = (i * 83) % 512;
    const r = 8 + (i % 22);

    aCtx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    aCtx.beginPath();
    aCtx.arc(cx, cy, r, 0, Math.PI * 2);
    aCtx.fill();

    bCtx.strokeStyle = '#d8d8d8';
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.arc(cx, cy, r, 0, Math.PI * 2);
    bCtx.stroke();
    bCtx.fillStyle = '#404040';
    bCtx.beginPath();
    bCtx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
    bCtx.fill();
  }

  rCtx.fillStyle = '#e0e0e0';
  rCtx.fillRect(0, 0, 512, 256);

  return {
    albedoMap: wrapTexture(new THREE.CanvasTexture(aCan)),
    bumpMap: wrapTexture(new THREE.CanvasTexture(bCan)),
    roughnessMap: wrapTexture(new THREE.CanvasTexture(rCan)),
    bumpScale: 0.10,
    roughness: 0.88,
    metalness: 0.12,
  };
}
