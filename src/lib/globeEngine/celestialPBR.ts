/**
 * Procedural PBR Planetary Engine
 * Manages caching and dispatching of physical materials (Albedo, Bump, Roughness).
 */
import * as THREE from 'three';
import {
  createProceduralCanvas,
  wrapTexture,
  generateMarsPBR,
  generateVenusPBR,
  generateJupiterPBR,
  generateMercuryPBR,
} from './celestialPBRGenerators';

export interface PlanetPBRMaps {
  albedoMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpScale: number;
  roughness: number;
  metalness: number;
}

const pbrCache: Map<string, PlanetPBRMaps> = new Map();

/**
 * Saturn, Uranus, Neptune & Default Fallback PBR
 */
function generateDefaultPBR(planetId: string): PlanetPBRMaps {
  const { canvas: aCan, ctx: aCtx } = createProceduralCanvas(1024, 512);
  const { canvas: bCan, ctx: bCtx } = createProceduralCanvas(1024, 512);
  const { canvas: rCan, ctx: rCtx } = createProceduralCanvas(512, 256);

  if (planetId === 'saturno') {
    const grad = aCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#fef3c7');
    grad.addColorStop(0.5, '#fde68a');
    grad.addColorStop(1, '#fef3c7');
    aCtx.fillStyle = grad;
    aCtx.fillRect(0, 0, 1024, 512);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 1024, 512);
    rCtx.fillStyle = '#808080';
    rCtx.fillRect(0, 0, 512, 256);
    return {
      albedoMap: wrapTexture(new THREE.CanvasTexture(aCan)),
      bumpMap: wrapTexture(new THREE.CanvasTexture(bCan)),
      roughnessMap: wrapTexture(new THREE.CanvasTexture(rCan)),
      bumpScale: 0.04,
      roughness: 0.52,
      metalness: 0.05,
    };
  }

  // Uranus / Neptune
  const isNeptune = planetId === 'netuno';
  const c1 = isNeptune ? '#1e40af' : '#67e8f9';
  const c2 = isNeptune ? '#1d4ed8' : '#a5f3fc';
  const grad = aCtx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.5, c2);
  grad.addColorStop(1, c1);
  aCtx.fillStyle = grad;
  aCtx.fillRect(0, 0, 1024, 512);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 1024, 512);
  rCtx.fillStyle = '#555555';
  rCtx.fillRect(0, 0, 512, 256);

  return {
    albedoMap: wrapTexture(new THREE.CanvasTexture(aCan)),
    bumpMap: wrapTexture(new THREE.CanvasTexture(bCan)),
    roughnessMap: wrapTexture(new THREE.CanvasTexture(rCan)),
    bumpScale: 0.03,
    roughness: 0.35,
    metalness: 0.04,
  };
}

export function getPlanetPBRMaps(planetId: string): PlanetPBRMaps {
  if (pbrCache.has(planetId)) {
    return pbrCache.get(planetId)!;
  }

  let maps: PlanetPBRMaps;
  if (planetId === 'marte') {
    maps = generateMarsPBR();
  } else if (planetId === 'venus') {
    maps = generateVenusPBR();
  } else if (planetId === 'jupiter') {
    maps = generateJupiterPBR();
  } else if (planetId === 'mercurio' || planetId === 'moon') {
    maps = generateMercuryPBR();
  } else {
    maps = generateDefaultPBR(planetId);
  }

  pbrCache.set(planetId, maps);
  return maps;
}
