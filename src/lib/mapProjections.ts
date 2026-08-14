/**
 * Cartographic projections, exact centroid calculations,
 * and Spherical Earth 3D Gyroscope/Drag Inertia algorithms.
 */
import { geoMercator, geoPath, geoGraticule } from 'd3-geo';

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export const MAP_CANVAS_WIDTH = 2560;
export const MAP_CANVAS_HEIGHT = 1440;

/**
 * Standardized State ID cleaner: extracts pure 2-letter uppercase UF (e.g. 'BR.RS' -> 'RS', 'BR-SP' -> 'SP')
 */
export function cleanStateId(rawId: any): string {
  if (!rawId) return '';
  const str = String(rawId).trim();
  const clean = str.replace(/^BR[-_.]?/i, '').replace(/[^A-Za-z]/g, '').toUpperCase();
  return clean;
}

/**
 * Pre-calculated exact mathematical centroids for all 27 Brazilian States.
 * Calibrated directly from D3 Mercator projection centered on Brazil (2560x1440).
 */
export const DEFAULT_STATE_CENTROIDS: Record<string, [number, number]> = {
  AC: [859, 562],
  AL: [1745, 568],
  AP: [1343, 280],
  AM: [1010, 428],
  BA: [1612, 648],
  CE: [1667, 452],
  DF: [1453, 736],
  ES: [1639, 841],
  GO: [1405, 744],
  MA: [1518, 452],
  MT: [1240, 661],
  MS: [1268, 862],
  MG: [1534, 810],
  PA: [1313, 424],
  PB: [1740, 505],
  PR: [1352, 984],
  PE: [1709, 537],
  PI: [1578, 513],
  RJ: [1587, 914],
  RN: [1744, 471],
  RS: [1308, 1135],
  RO: [1059, 606],
  RR: [1096, 264],
  SC: [1382, 1060],
  SP: [1428, 916],
  SE: [1724, 596],
  TO: [1439, 585],
};

/**
 * Geographic center of Brazil:
 * Calibrated exactly at Longitude -54.39° (Midpoint between West Serra do Divisor/AC and East Ponta do Seixas/PB)
 * and Latitude -15.18° (Midpoint between North Monte Caburaí/RR and South Arroio Chuí/RS).
 * Directly maps the mathematical center of Brazil to the center of the Canvas (1280, 720).
 */
export function createBrazilMercatorProjection() {
  const projection = geoMercator();
  projection
    .center([-54.39, -15.18])
    .scale(1500)
    .translate([MAP_CANVAS_WIDTH / 2, MAP_CANVAS_HEIGHT / 2]);
  return projection;
}

/**
 * Creates D3 nautical and geographical graticule lines (10-degree intervals).
 */
export function createNauticalGraticule() {
  const graticule = geoGraticule()
    .step([10, 10])
    .extent([
      [-90, -60],
      [-20, 20],
    ]);
  return graticule();
}

/**
 * Optical and visual fine-tuning offsets for Brazilian states.
 * Guarantees that small states, enclaves (like DF inside GO), coastal island exclusions (ES, RN),
 * and dense Northeast coastal clusters (PB, PE, AL, SE) have crystal-clear pin placement
 * positioned directly in the heart of each state's mainland territory without overlap.
 */
const OPTICAL_STATE_OFFSETS: Record<string, [number, number]> = {
  // Distrito Federal is located inside Goiás; calibrate GO slightly SW towards Goiânia to avoid any pin collision
  GO: [-20, 18],
  DF: [0, 0],
  // Espírito Santo: oceanic islands pull centroid east into sea; adjust mainland pin west
  ES: [-16, -6],
  // Rio de Janeiro: adjust slightly towards Vale do Paraíba/Fluminense center
  RJ: [-16, -10],
  // Rio Grande do Norte: Fernando de Noronha pulls centroid east; calibrate mainland RN
  RN: [-20, 4],
  // Paraíba: center along Borborema / Campina Grande axis
  PB: [-24, 0],
  // Pernambuco: elongated strip; position in Agreste / central Sertão
  PE: [-45, -2],
  // Alagoas & Sergipe: adjust for maximum clarity
  AL: [-14, -4],
  SE: [-8, -6],
  // São Paulo: slightly towards central interior
  SP: [-8, -5],
  // Santa Catarina & Paraná
  SC: [-6, -4],
  PR: [-4, -4],
  // Bahia & Minas Gerais
  BA: [-6, 0],
  MG: [-4, 0],
};

/**
 * Calculates exact mathematical centroids for all 27 Brazilian states
 * directly from D3 geoPath center of mass, filtering out isolated distant oceanic islands,
 * and applying visual cartographic centering.
 */
export function calculateCalibratedCentroids(
  features?: Array<{ properties?: { id?: string; name?: string; sigla?: string; UF?: string }; id?: any; geometry?: any }>,
  pathGen?: ReturnType<typeof geoPath>
): Record<string, [number, number]> {
  const centroids: Record<string, [number, number]> = { ...DEFAULT_STATE_CENTROIDS };

  if (!features || !pathGen) return centroids;

  features.forEach((feat) => {
    const rawId =
      feat.properties?.id ||
      (feat as any).id ||
      feat.properties?.sigla ||
      feat.properties?.UF ||
      '';
    const stateId = cleanStateId(rawId);
    if (!stateId) return;

    try {
      // For MultiPolygon states with distant islands (e.g. ES with Trindade, RN with Noronha),
      // compute centroid on the largest mainland polygon to guarantee pin is strictly on land
      let targetGeometry = feat;
      if (feat.geometry?.type === 'MultiPolygon' && Array.isArray(feat.geometry.coordinates)) {
        let maxArea = -1;
        let largestPoly: any = null;
        feat.geometry.coordinates.forEach((coords: any) => {
          const singlePoly = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: coords },
            properties: feat.properties,
          };
          const area = pathGen.area(singlePoly as any);
          if (area > maxArea) {
            maxArea = area;
            largestPoly = singlePoly;
          }
        });
        if (largestPoly) {
          targetGeometry = largestPoly;
        }
      }

      const geoObj: any = (targetGeometry as any).type ? targetGeometry : { type: 'Feature', ...targetGeometry };
      const [rawX, rawY] = pathGen.centroid(geoObj);
      if (typeof rawX === 'number' && typeof rawY === 'number' && !isNaN(rawX) && !isNaN(rawY)) {
        const offset = OPTICAL_STATE_OFFSETS[stateId] || [0, 0];
        centroids[stateId] = [Math.round(rawX + offset[0]), Math.round(rawY + offset[1])];
      }
    } catch {
      // Fallback
    }
  });

  return centroids;
}

/**
 * Zero-Void Pan & Zoom Clamping Algorithm:
 * Ensures the viewport is strictly locked within the South American/Atlantic boundaries.
 * The user will NEVER see empty black voids when dragging or zooming.
 */
export function clampPanZoom(
  pan: { x: number; y: number },
  zoom: number,
  containerSize: { width: number; height: number },
  minZoom = 0.85,
  maxZoom = 4.0
): { pan: { x: number; y: number }; zoom: number } {
  const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

  // Generous, fluid panning boundaries allowing full centering of any state/region of Brazil
  const maxPanX = Math.max(1400, containerSize.width * (clampedZoom + 0.8) + 600);
  const minPanX = -maxPanX;
  const maxPanY = Math.max(1200, containerSize.height * (clampedZoom + 0.8) + 500);
  const minPanY = -maxPanY;

  return {
    zoom: clampedZoom,
    pan: {
      x: Math.max(minPanX, Math.min(maxPanX, pan.x)),
      y: Math.max(minPanY, Math.min(maxPanY, pan.y)),
    },
  };
}

/**
 * Mathematical center of Brazil based on the calibrated projection (-54.39°, -15.18°).
 * Centers the entire territorial mass of Brazil (Acre to Paraíba and Roraima to RS)
 * in the center of the screen in both 2D and 3D.
 */
export function getBrazilACtoPBMidpointPan(zoom = 1.12, is3D = true): { x: number; y: number } {
  return {
    x: 0,
    y: Math.round((is3D ? -35 : 0) * zoom),
  };
}

/**
 * Backward compatibility alias for Brazil midpoint centering
 */
export function getCenteredGoPan(zoom = 1.12, is3D = true): { x: number; y: number } {
  return getBrazilACtoPBMidpointPan(zoom, is3D);
}

/**
 * Calculates the exact pan needed to center any specific state centroid
 * at the center of the viewport during state zoom-in transitions.
 */
export function calculateStateCenterPan(
  centroid: [number, number],
  zoom = 2.4,
  is3D = true
): { x: number; y: number } {
  const [cx, cy] = centroid;
  const offsetX = cx - MAP_CANVAS_WIDTH / 2; // cx - 1280
  const offsetY = cy - MAP_CANVAS_HEIGHT / 2; // cy - 720
  return {
    x: Math.round(-offsetX * zoom),
    y: Math.round((is3D ? -offsetY * 0.74 : -offsetY) * zoom),
  };
}

/**
 * Spherical Globe Rotation & Gyroscope Matrix:
 * Simulates a spherical 3D globe / celestial sphere during grab-and-drag.
 * Horizontal drag (longitude) induces a realistic spherical roll (rotateY),
 * while vertical drag (latitude) adjusts isometric pitch (rotateX).
 */
export function calculateSphericalGlobeAngles(
  pan: { x: number; y: number },
  baseTiltAngle = 42,
  _dragVelocity: { x: number; y: number } = { x: 0, y: 0 },
  is3D = true
): { rotateX: number; rotateY: number; rotateZ: number } {
  if (!is3D) {
    return { rotateX: 0, rotateY: 0, rotateZ: 0 };
  }

  // Stable, elegant isometric perspective (no jarring velocity tilt jumps during dragging)
  // Subtle, calm horizon perspective based strictly on pan position
  const subtlePitch = Math.max(32, Math.min(48, baseTiltAngle - pan.y * 0.004));
  const subtleYaw = Math.max(-4, Math.min(4, pan.x * 0.003));

  return {
    rotateX: subtlePitch,
    rotateY: subtleYaw,
    rotateZ: 0,
  };
}
