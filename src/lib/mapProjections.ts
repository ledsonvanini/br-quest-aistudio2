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
  AC: [734, 538],
  AL: [1620, 544],
  AP: [1218, 256],
  AM: [885, 404],
  BA: [1487, 624],
  CE: [1542, 428],
  DF: [1328, 712],
  ES: [1514, 817],
  GO: [1280, 720],
  MA: [1393, 428],
  MT: [1115, 637],
  MS: [1143, 838],
  MG: [1409, 786],
  PA: [1188, 400],
  PB: [1615, 481],
  PR: [1227, 960],
  PE: [1584, 513],
  PI: [1453, 489],
  RJ: [1462, 890],
  RN: [1619, 447],
  RS: [1183, 1111],
  RO: [934, 582],
  RR: [971, 240],
  SC: [1257, 1036],
  SP: [1303, 892],
  SE: [1599, 572],
  TO: [1314, 561],
};

/**
 * Center of Brazil (Goiás - GO):
 * Calibrated exactly at Longitude -49.83° and Latitude -15.82° (Center of Goiás / Central Plateau).
 * Maps the center of Goiás to the exact pivot and center of the Canvas (1280, 720).
 */
export function createBrazilMercatorProjection() {
  const projection = geoMercator();
  projection
    .center([-49.83, -15.82])
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
 * The user will NEVER see empty black voids or the outer canvas frame when dragging or zooming.
 */
export function clampPanZoom(
  pan: { x: number; y: number },
  zoom: number,
  containerSize: { width: number; height: number },
  minZoom = 0.35,
  maxZoom = 3.20,
  isMusicalRadioMode = false
): { pan: { x: number; y: number }; zoom: number } {
  const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

  // Clamping seguro que impede a visualização das bordas do canvas e esconde o mapa atrás do rádio
  const maxPanX = Math.min(750, (containerSize.width * 0.35) * clampedZoom + 150);
  const minPanX = isMusicalRadioMode ? -Math.min(320, (containerSize.width * 0.20) * clampedZoom + 60) : -maxPanX;
  const maxPanY = Math.min(600, (containerSize.height * 0.30) * clampedZoom + 120);
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
 * Mathematical center of Brazil based on the calibrated border between GO, TO, and MT
 * (Rio Araguaia / Ilha do Bananal region, slightly above the geographic center of Goiás).
 * Centers the entire territorial mass of Brazil in the viewport with 20% increased default zoom (1.14).
 */
export const DEFAULT_BRAZIL_ZOOM = 1.14;

/**
 * Pivot center point coordinates on the 2560x1440 canvas:
 * Border between Goiás (GO), Tocantins (TO), and Mato Grosso (MT) [1235, 640].
 */
export const BRAZIL_MAP_PIVOT_CENTER: [number, number] = [1235, 640];

export function getBrazilACtoPBMidpointPan(zoom = DEFAULT_BRAZIL_ZOOM, is3D = true): { x: number; y: number } {
  const offsetX = BRAZIL_MAP_PIVOT_CENTER[0] - MAP_CANVAS_WIDTH / 2; // 1235 - 1280 = -45
  const offsetY = BRAZIL_MAP_PIVOT_CENTER[1] - MAP_CANVAS_HEIGHT / 2; // 640 - 720 = -80
  const sidebarCompensationX = 28; // visual compensation for left navigation sidebar

  return {
    x: Math.round((-offsetX + sidebarCompensationX) * zoom),
    y: Math.round((-offsetY * (is3D ? 0.80 : 1.0) - (is3D ? 20 : 0)) * zoom),
  };
}

/**
 * Calculates the exact pan & zoom to center Brazil in the remaining 50% right half
 * of the screen when a 50% lateral application (like Biodiversity Catalog) is open on the left.
 */
export function getBrazilOverviewFocusZoomAndPan(
  containerWidth: number,
  is3D = true,
  isExpanded = true
): { targetZoom: number; targetPan: { x: number; y: number } } {
  let baseZoom = DEFAULT_BRAZIL_ZOOM;
  let screenOffsetX = 0;

  if (containerWidth >= 640) {
    if (isExpanded) {
      screenOffsetX = Math.round(containerWidth * 0.25);
      baseZoom *= Math.max(0.85, Math.min(1.14, (containerWidth * 0.5) / 580));
    } else {
      screenOffsetX = Math.round(Math.min(300, 250));
      baseZoom *= Math.max(0.90, Math.min(1.14, (containerWidth - 500) / 600));
    }
  }

  const targetPan = calculateStateCenterPan(BRAZIL_MAP_PIVOT_CENTER, baseZoom, is3D, screenOffsetX);
  return { targetZoom: baseZoom, targetPan };
}

/**
 * Backward compatibility alias for Brazil midpoint centering
 */
export function getCenteredGoPan(zoom = DEFAULT_BRAZIL_ZOOM, is3D = true): { x: number; y: number } {
  return getBrazilACtoPBMidpointPan(zoom, is3D);
}

export type MapCenterScenario =
  | 'Centralizar Mapa'
  | 'Centralizar Mapa com App Lateral'
  | 'Centralizar Mapa mostrar Vizinhos';

export interface MapCenteringConfig {
  scenario?: MapCenterScenario;
  is3D?: boolean;
  containerWidth?: number;
  isExpanded?: boolean;
  customZoom?: number;
}

/**
 * Função Universal Parametrizada para Centralização do Mapa do Brasil e Continente:
 * - 'Centralizar Mapa': Enquadra o Brasil perfeitamente no centro da viewport no zoom padrão (1.14).
 * - 'Centralizar Mapa com App Lateral': Centraliza o Brasil na metade útil visível quando há painel lateral aberto.
 * - 'Centralizar Mapa mostrar Vizinhos': Mantém o Brasil no centro geométrico e aplica o percentual de zoom out ideal (0.58)
 *   para enquadrar perfeitamente o Brasil e todos os seus 10 países vizinhos e territórios com suas bandeiras.
 */
export function getParameterizedMapCentering(
  config: MapCenteringConfig = {}
): { targetZoom: number; targetPan: { x: number; y: number } } {
  const {
    scenario = 'Centralizar Mapa',
    is3D = true,
    containerWidth = 1920,
    isExpanded = true,
    customZoom,
  } = config;

  if (scenario === 'Centralizar Mapa mostrar Vizinhos') {
    const targetZoom = customZoom ?? NEIGHBORS_CONTINENT_ZOOM;
    // O Brasil permanece como o ponto focal e âncora central, aplicando o zoom out proporcional
    const targetPan = getBrazilACtoPBMidpointPan(targetZoom, is3D);
    return { targetZoom, targetPan };
  }

  if (scenario === 'Centralizar Mapa com App Lateral') {
    return getBrazilOverviewFocusZoomAndPan(containerWidth, is3D, isExpanded);
  }

  // 'Centralizar Mapa' padrão
  const targetZoom = customZoom ?? DEFAULT_BRAZIL_ZOOM;
  const targetPan = getBrazilACtoPBMidpointPan(targetZoom, is3D);
  return { targetZoom, targetPan };
}

/**
 * Zoom level for viewing South American neighboring countries:
 * Increased zoom out by 20% from 0.81 (0.81 / 1.20 = 0.68) using the exact same 'Centralizar Mapa' centering anchor
 * to display all 10 neighbor countries and territories cleanly centered in the viewport.
 */
export const NEIGHBORS_CONTINENT_ZOOM = Number((0.81 / 1.20).toFixed(2)); // 0.68

/**
 * Calculates the exact pan & zoom to center the entire South American continent in the viewport
 */
export function getSouthAmericaMidpointPan(zoom = NEIGHBORS_CONTINENT_ZOOM, is3D = true): { x: number; y: number } {
  // Centroid of South American landmass is around [1000, 1050]
  const offsetX = 1000 - MAP_CANVAS_WIDTH / 2; // -280
  const offsetY = 1050 - MAP_CANVAS_HEIGHT / 2; // +330
  return {
    x: Math.round(-offsetX * zoom * 0.7),
    y: Math.round((is3D ? -offsetY * 0.65 : -offsetY * 0.8) * zoom),
  };
}

/**
 * Calculates the exact pan needed to center any specific state centroid
 * at the center of the viewport (or offset for side panels) during state zoom-in transitions.
 */
export function calculateStateCenterPan(
  centroid: [number, number],
  zoom = 2.4,
  is3D = true,
  screenOffsetX = 0,
  screenOffsetY = 0
): { x: number; y: number } {
  const [cx, cy] = centroid;
  const offsetX = cx - MAP_CANVAS_WIDTH / 2; // cx - 1280
  const offsetY = cy - MAP_CANVAS_HEIGHT / 2; // cy - 720
  return {
    x: Math.round(-offsetX * zoom + screenOffsetX),
    y: Math.round((is3D ? -offsetY * 0.74 : -offsetY) * zoom + screenOffsetY),
  };
}

/**
 * Calculates the exact zoom & pan to focus on a state while taking into account
 * the 50% width (or compact width) occupied by the Detail Dialog/App on the left side.
 * Centers the selected state precisely in the remaining 50% right half of the screen.
 */
export function getClimateFocusZoomAndPan(
  centroid: [number, number],
  stateId: string,
  containerWidth: number,
  is3D = true,
  isExpanded = true
): { targetZoom: number; targetPan: { x: number; y: number } } {
  const isSmallState = ['DF', 'SE', 'AL', 'RJ', 'ES', 'PB', 'RN', 'SC'].includes(stateId);
  const isLargeState = ['AM', 'PA', 'MT', 'MG', 'BA'].includes(stateId);

  let baseZoom = isSmallState ? 2.05 : isLargeState ? 1.35 : 1.68;

  let screenOffsetX = 0;
  if (containerWidth >= 640) {
    if (isExpanded) {
      // 50% width taken by left panel -> center of right 50% is at +25% screen width offset
      screenOffsetX = Math.round(containerWidth * 0.25);
      baseZoom *= Math.max(0.75, Math.min(1.0, (containerWidth * 0.5) / 600));
    } else {
      // Compact width (~520px)
      screenOffsetX = Math.round(Math.min(320, 260 + (containerWidth >= 1024 ? 20 : 0)));
      baseZoom *= Math.max(0.70, Math.min(1.0, (containerWidth - 520) / 600));
    }
  } else {
    // Mobile screen: modal takes full screen
    screenOffsetX = 0;
  }

  const targetPan = calculateStateCenterPan(centroid, baseZoom, is3D, screenOffsetX);
  return { targetZoom: baseZoom, targetPan };
}

/**
 * Calculates the exact zoom & pan to focus on a state while taking into account
 * the 50% width (or compact width) occupied by the Biodiversity Detail Dialog on the left.
 * Centers the selected state precisely in the remaining 50% right half of the screen.
 */
export function getBiodiversityFocusZoomAndPan(
  centroid: [number, number],
  stateId: string,
  containerWidth: number,
  is3D = true,
  isExpanded = true
): { targetZoom: number; targetPan: { x: number; y: number } } {
  const isSmallState = ['DF', 'SE', 'AL', 'RJ', 'ES', 'PB', 'RN', 'SC'].includes(stateId);
  const isLargeState = ['AM', 'PA', 'MT', 'MG', 'BA'].includes(stateId);

  let baseZoom = isSmallState ? 2.0 : isLargeState ? 1.32 : 1.65;

  let screenOffsetX = 0;
  if (containerWidth >= 640) {
    if (isExpanded) {
      // 50% width taken by left panel -> center of right 50% is at +25% screen width offset
      screenOffsetX = Math.round(containerWidth * 0.25);
      baseZoom *= Math.max(0.75, Math.min(1.0, (containerWidth * 0.5) / 600));
    } else {
      // Compact width (~540px)
      screenOffsetX = Math.round(Math.min(330, 270 + (containerWidth >= 1024 ? 20 : 0)));
      baseZoom *= Math.max(0.70, Math.min(1.0, (containerWidth - 540) / 600));
    }
  } else {
    // Mobile screen: modal takes full screen
    screenOffsetX = 0;
  }

  const targetPan = calculateStateCenterPan(centroid, baseZoom, is3D, screenOffsetX);
  return { targetZoom: baseZoom, targetPan };
}

/**
 * Calculates the exact zoom & pan to focus on a state or Brazil in Musicalities Mode
 * with the Vintage Radio Player occupying 50% width on the left.
 */
export function getMusicalFocusZoomAndPan(
  centroid: [number, number],
  containerWidth: number,
  is3D = true,
  isExpanded = true
): { targetZoom: number; targetPan: { x: number; y: number } } {
  let baseZoom = 1.6;
  let screenOffsetX = 0;

  if (containerWidth >= 640) {
    if (isExpanded) {
      screenOffsetX = Math.round(containerWidth * 0.25);
      baseZoom *= Math.max(0.75, Math.min(1.0, (containerWidth * 0.5) / 600));
    } else {
      screenOffsetX = Math.round(Math.min(300, 240));
      baseZoom *= Math.max(0.70, Math.min(1.0, (containerWidth - 480) / 600));
    }
  }

  const targetPan = calculateStateCenterPan(centroid, baseZoom, is3D, screenOffsetX);
  return { targetZoom: baseZoom, targetPan };
}

/**
 * Calculates the exact pan adjustment to zoom in/out while keeping the point
 * directly under the mouse cursor invariant on the screen (zero displacement & zero flicker).
 */
export function calculateAnchoredZoomPan(
  currentPan: { x: number; y: number },
  currentZoom: number,
  targetZoom: number,
  mouseScreenPos: { x: number; y: number },
  containerSize: CanvasDimensions
): { x: number; y: number } {
  if (currentZoom <= 0 || targetZoom <= 0) return currentPan;

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  const scaleRatio = targetZoom / currentZoom;
  const newPanX = mouseScreenPos.x - centerX - (mouseScreenPos.x - centerX - currentPan.x) * scaleRatio;
  const newPanY = mouseScreenPos.y - centerY - (mouseScreenPos.y - centerY - currentPan.y) * scaleRatio;

  return {
    x: Math.round(newPanX),
    y: Math.round(newPanY),
  };
}

/**
 * Spherical Globe Rotation & Gyroscope Matrix:
 * Simulates a spherical 3D globe / celestial sphere during grab-and-drag.
 * Horizontal drag (longitude) induces a realistic spherical roll (rotateY),
 * vertical drag (latitude) adjusts isometric pitch (rotateX),
 * and headingAngle sets the compass orientation (rotateZ).
 */
export function calculateSphericalGlobeAngles(
  pan: { x: number; y: number },
  baseTiltAngle = 42,
  _dragVelocity: { x: number; y: number } = { x: 0, y: 0 },
  is3D = true,
  headingAngle = 0
): { rotateX: number; rotateY: number; rotateZ: number } {
  if (!is3D) {
    return { rotateX: 0, rotateY: 0, rotateZ: headingAngle };
  }

  // Stable, elegant isometric perspective (no jarring velocity tilt jumps during dragging)
  // Subtle, calm horizon perspective based strictly on pan position
  const subtlePitch = Math.max(0, Math.min(75, baseTiltAngle - pan.y * 0.004));
  const subtleYaw = Math.max(-10, Math.min(10, pan.x * 0.003));

  return {
    rotateX: subtlePitch,
    rotateY: subtleYaw,
    rotateZ: headingAngle,
  };
}
