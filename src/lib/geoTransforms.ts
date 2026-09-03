/**
 * Funções Matemáticas, Geométricas e Isométricas Parametrizadas
 * Projeto: BR Quest / Brasil Interativo
 * 
 * Reutilizáveis em todo o pipeline cartográfico, camadas de vento, ondas e radar.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox2D {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Interpolação linear simples (LERP).
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, t));
}

/**
 * Restringe um valor numérico entre limites mínimo e máximo.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Distância euclidiana entre dois pontos bidimensionais.
 */
export function distance2D(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Converte graus para radianos.
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converte radianos para graus.
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Rotaciona um ponto 2D ao redor de um centro de rotação por um ângulo em graus.
 */
export function rotatePoint2D(point: Point2D, center: Point2D, angleDeg: number): Point2D {
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos),
  };
}

/**
 * Projeta um ponto 2D com inclinação isométrica ortogonal (tiltX e rotateZ).
 */
export function projectIsometric(
  point: Point2D,
  tiltDeg: number = 42,
  rotationDeg: number = 0,
  center: Point2D = { x: 1200, y: 750 }
): Point2D {
  // 1. Rotação em torno do centro do mapa
  const rotated = rotationDeg !== 0 ? rotatePoint2D(point, center, rotationDeg) : point;

  // 2. Compressão no eixo Y proporcional ao cosseno do ângulo de inclinação
  const tiltRad = degToRad(tiltDeg);
  const scaleY = Math.cos(tiltRad);

  const dy = rotated.y - center.y;
  const projectedY = center.y + dy * scaleY;

  return {
    x: rotated.x,
    y: projectedY,
  };
}

/**
 * Calcula o centroide de um conjunto de pontos 2D.
 */
export function calculateCentroid(points: Point2D[]): Point2D {
  if (!points.length) return { x: 0, y: 0 };
  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}
