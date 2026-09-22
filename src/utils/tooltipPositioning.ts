// src/utils/tooltipPositioning.ts
// Algoritmo Universal de Posicionamento e Geometria do Cone de Projeção Cartográfica (QGIS Zoom Callout)

export interface SmartTooltipResult {
  cardPos: { x: number; y: number };
  anchorPos: { x: number; y: number };
  topAnchorPos: { x: number; y: number };
  bottomAnchorPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  conePolygonPath: string;
  topRayPath: string;
  bottomRayPath: string;
  midLinePath: string;
  placement: 'right' | 'left';
}

export interface SmartTooltipOptions {
  target: { x: number; y: number };
  cardWidth: number;
  cardHeight: number;
  viewportWidth?: number;
  viewportHeight?: number;
  minDistance?: number;
  topMargin?: number;
  bottomMargin?: number;
  sideMargin?: number;
}

/**
 * Calcula o posicionamento inteligente e a geometria do cone de projeção cartográfica (Zoom Section):
 * 1. Mantém distância confortável do cursor/alvo (~74px), desobstruindo a visualização da área.
 * 2. Aplica clamp rígido nos limites da janela (top, bottom, left, right).
 * 3. Gera as coordenadas exatas do trapézio de projeção (cone) e dos raios conectores superior e inferior.
 */
export function calculateSmartTooltipPosition(options: SmartTooltipOptions): SmartTooltipResult {
  const {
    target,
    cardWidth,
    cardHeight,
    viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920,
    viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080,
    minDistance = 72,
    topMargin = 70,
    bottomMargin = 60,
    sideMargin = 24,
  } = options;

  // Decide lado preferencial com base no espaço livre horizontal
  const fitsOnRight = target.x + minDistance + cardWidth + sideMargin <= viewportWidth;
  const fitsOnLeft = target.x - minDistance - cardWidth - sideMargin >= 0;

  let placement: 'right' | 'left' = 'right';
  let cardX = 0;

  if (fitsOnRight && target.x < viewportWidth * 0.62) {
    placement = 'right';
    cardX = target.x + minDistance;
  } else if (fitsOnLeft) {
    placement = 'left';
    cardX = target.x - minDistance - cardWidth;
  } else {
    const spaceRight = viewportWidth - target.x;
    const spaceLeft = target.x;
    if (spaceRight >= spaceLeft) {
      placement = 'right';
      cardX = Math.min(viewportWidth - cardWidth - sideMargin, target.x + minDistance);
    } else {
      placement = 'left';
      cardX = Math.max(sideMargin, target.x - minDistance - cardWidth);
    }
  }

  // Alinhamento vertical centralizado em relação ao alvo focal
  let cardY = target.y - Math.round(cardHeight * 0.38);

  // Clamping vertical estrito para garantir que o card nunca vaze nem corte
  const maxY = Math.max(topMargin, viewportHeight - cardHeight - bottomMargin);
  cardY = Math.max(topMargin, Math.min(cardY, maxY));

  // Clamping horizontal final de segurança
  const maxX = Math.max(sideMargin, viewportWidth - cardWidth - sideMargin);
  cardX = Math.max(sideMargin, Math.min(cardX, maxX));

  const roundedCardX = Math.round(cardX);
  const roundedCardY = Math.round(cardY);
  const roundedTargetX = Math.round(target.x);
  const roundedTargetY = Math.round(target.y);

  // Vértices de ancoragem na borda vertical do card voltada para o mapa
  const anchorX = placement === 'right' ? roundedCardX : roundedCardX + cardWidth;
  const anchorY = Math.round(roundedCardY + cardHeight * 0.5);

  // Cantos superior e inferior com pequena folga para respeitar o rounded border (14px)
  const topAnchorY = roundedCardY + 14;
  const bottomAnchorY = roundedCardY + cardHeight - 14;

  const topAnchorPos = { x: anchorX, y: topAnchorY };
  const bottomAnchorPos = { x: anchorX, y: bottomAnchorY };
  const anchorPos = { x: anchorX, y: anchorY };
  const targetPos = { x: roundedTargetX, y: roundedTargetY };

  // Geometria do Cone Trapezoidal de Projeção (Zoom Section Callout)
  const conePolygonPath = `M ${roundedTargetX} ${roundedTargetY} L ${anchorX} ${topAnchorY} L ${anchorX} ${bottomAnchorY} Z`;

  // Raios conectores das arestas superior e inferior
  const topRayPath = `M ${roundedTargetX} ${roundedTargetY} L ${anchorX} ${topAnchorY}`;
  const bottomRayPath = `M ${roundedTargetX} ${roundedTargetY} L ${anchorX} ${bottomAnchorY}`;
  const midLinePath = `M ${roundedTargetX} ${roundedTargetY} L ${anchorX} ${anchorY}`;

  return {
    cardPos: { x: roundedCardX, y: roundedCardY },
    anchorPos,
    topAnchorPos,
    bottomAnchorPos,
    targetPos,
    conePolygonPath,
    topRayPath,
    bottomRayPath,
    midLinePath,
    placement,
  };
}
