import { AppMainMode } from '../../types';
import { createBrazilMercatorProjection } from '../mapProjections';
import { OceanicIslandSpec, OceanCurrentSpec } from './types';
import { BRAZIL_COASTLINE_GEO_POINTS, OCEAN_ISLANDS_SPECS } from './oceanCoastlineData';

export {
  BRAZIL_COASTLINE_GEO_POINTS,
  OCEAN_ISLANDS_SPECS,
};
export {
  SOUTH_AMERICA_ATLANTIC_SOUTH_GEO,
  SOUTH_AMERICA_PACIFIC_COASTLINE_GEO,
  SOUTH_AMERICA_CARIBBEAN_GEO,
} from './oceanCoastlineData';

// Correntes Marítimas Principais no Atlântico Sul
export const OCEAN_CURRENTS_SPECS: OceanCurrentSpec[] = [
  {
    name: 'Corrente Sul Equatorial (Oeste)',
    x: 1360,
    y: 380,
    vx: -1.2,
    vy: 0.35,
    color: 'rgba(56, 189, 248, 0.65)',
  },
  {
    name: 'Corrente do Brasil (Sul)',
    x: 1490,
    y: 720,
    vx: -0.6,
    vy: 1.15,
    color: 'rgba(52, 211, 153, 0.65)',
  },
  {
    name: 'Corrente das Malvinas (Norte)',
    x: 1210,
    y: 1120,
    vx: 0.8,
    vy: -0.9,
    color: 'rgba(147, 197, 253, 0.70)',
  },
];

export interface ProjectedCoastPoint {
  x: number;
  y: number;
  nx: number;
  ny: number;
  angle: number;
}

/**
 * Projeta e pré-calcula os pontos litorâneos com vetores normais (apontando mar adentro)
 * e ângulos tangenciais da costa para cálculo de arrebentação e refração de ondas.
 */
export function calculateProjectedCoastPoints(): ProjectedCoastPoint[] {
  const projection = createBrazilMercatorProjection();
  const coastPts: ProjectedCoastPoint[] = [];

  for (let i = 0; i < BRAZIL_COASTLINE_GEO_POINTS.length; i++) {
    const pt = projection(BRAZIL_COASTLINE_GEO_POINTS[i]);
    if (!pt) continue;

    let nx = 1;
    let ny = 0;
    let angle = 0;

    if (i < BRAZIL_COASTLINE_GEO_POINTS.length - 1) {
      const nextPt = projection(BRAZIL_COASTLINE_GEO_POINTS[i + 1]);
      if (nextPt) {
        const dx = nextPt[0] - pt[0];
        const dy = nextPt[1] - pt[1];
        const len = Math.hypot(dx, dy) || 1;
        // Vetor normal apontando 90 graus mar adentro (Leste/Sudeste)
        nx = -dy / len;
        ny = dx / len;
        if (nx < 0) {
          nx = -nx;
          ny = -ny;
        }
        angle = Math.atan2(dy, dx);
      }
    } else if (coastPts.length > 0) {
      const prev = coastPts[coastPts.length - 1];
      nx = prev.nx;
      ny = prev.ny;
      angle = prev.angle;
    }

    coastPts.push({ x: pt[0], y: pt[1], nx, ny, angle });
  }

  return coastPts;
}

/**
 * Deformação geométrica de Gerstner Waves
 * Combina 3 trens de ondas senoidais com inclinação não-linear, gerando cristas afiladas
 * e calhas largas típicas de ondulações marítimas reais.
 */
export function calculateGerstnerWave(
  x: number,
  y: number,
  time: number,
  speedMultiplier: number = 1.0,
  scaleMultiplier: number = 1.0
): { dx: number; dy: number; height: number; normalX: number; normalY: number } {
  const t = time * speedMultiplier;

  // Trem 1: Ondulação primária do Atlântico vinda de ESE (direção ~[-0.8, -0.6])
  const w1 = 0.0035;
  const a1 = 12 * scaleMultiplier;
  const d1x = -0.8;
  const d1y = -0.6;
  const phase1 = (d1x * x + d1y * y) * w1 + t * 1.8;

  // Trem 2: Marola secundária cruzada de NE (direção ~[-0.6, 0.8])
  const w2 = 0.007;
  const a2 = 6 * scaleMultiplier;
  const d2x = -0.6;
  const d2y = 0.8;
  const phase2 = (d2x * x + d2y * y) * w2 + t * 2.4;

  // Trem 3: Micro-marola costeira de alta frequência
  const w3 = 0.015;
  const a3 = 3 * scaleMultiplier;
  const d3x = -0.9;
  const d3y = -0.3;
  const phase3 = (d3x * x + d3y * y) * w3 + t * 3.5;

  const height =
    a1 * Math.cos(phase1) +
    a2 * Math.cos(phase2) +
    a3 * Math.cos(phase3);

  const dx =
    -d1x * a1 * Math.sin(phase1) * 0.5 -
    d2x * a2 * Math.sin(phase2) * 0.4 -
    d3x * a3 * Math.sin(phase3) * 0.3;

  const dy =
    -d1y * a1 * Math.sin(phase1) * 0.5 -
    d2y * a2 * Math.sin(phase2) * 0.4 -
    d3y * a3 * Math.sin(phase3) * 0.3;

  const normalX = -(d1x * a1 * w1 * Math.sin(phase1) + d2x * a2 * w2 * Math.sin(phase2));
  const normalY = -(d1y * a1 * w1 * Math.sin(phase1) + d2y * a2 * w2 * Math.sin(phase2));

  return { dx, dy, height, normalX, normalY };
}

/**
 * Fator de reflexão especular Fresnel para simular o reflexo do Sol nas marolas
 */
export function calculateSpecularGlint(
  normalX: number,
  normalY: number,
  lightX: number = 0.7,
  lightY: number = -0.7
): number {
  const dot = normalX * lightX + normalY * lightY;
  if (dot <= 0) return 0;
  // Elevação não-linear da crista para brilho faiscante de água
  return Math.pow(dot, 16);
}

export { getOceanThemePalette } from './oceanPalettes';
export type { OceanThemePalette } from './oceanPalettes';

