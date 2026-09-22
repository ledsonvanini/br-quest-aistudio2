// src/components/map/tooltip/CartographicProjectionCone.tsx
// Efeito de Cone de Projeção / Zoom Section Cartográfico (QGIS Callout Style)
// Renderiza o feixe de projeção sutil (Preto 50% -> Alpha 0%) com arestas em cinza muted e retículo discreto

import React from 'react';

interface CartographicProjectionConeProps {
  targetPos: { x: number; y: number };
  topAnchorPos: { x: number; y: number };
  bottomAnchorPos: { x: number; y: number };
  conePolygonPath: string;
  topRayPath: string;
  bottomRayPath: string;
  themeColor?: string;
  className?: string;
}

export const CartographicProjectionCone: React.FC<CartographicProjectionConeProps> = ({
  targetPos,
  topAnchorPos,
  bottomAnchorPos,
  conePolygonPath,
  topRayPath,
  bottomRayPath,
  className = '',
}) => {
  const targetX = targetPos.x;
  const targetY = targetPos.y;
  const anchorX = topAnchorPos.x;
  const midAnchorY = (topAnchorPos.y + bottomAnchorPos.y) / 2;

  // Tons de cinza muted discretos e elegantes
  const mutedStrokeColor = '#94a3b8'; // Slate 400 muted

  return (
    <svg
      id="svg-cone-projecao-cartografico"
      className={`svg-cone-projecao-cartografico fixed inset-0 pointer-events-none z-[99998] w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* 1. Gradiente do Cone Sutil: Preto 50% (lado do quadro) até Alpha 0% (alvo no mapa) */}
        <linearGradient
          id="cone-grad-muted"
          x1={anchorX}
          y1={midAnchorY}
          x2={targetX}
          y2={targetY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#020617" stopOpacity="0.50" />
          <stop offset="60%" stopColor="#020617" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.00" />
        </linearGradient>

        {/* 2. Gradiente Linear para as Linhas de Aresta em Cinza Muted */}
        <linearGradient
          id="stroke-grad-muted"
          x1={anchorX}
          y1={midAnchorY}
          x2={targetX}
          y2={targetY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={mutedStrokeColor} stopOpacity="0.75" />
          <stop offset="60%" stopColor={mutedStrokeColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={mutedStrokeColor} stopOpacity="0.10" />
        </linearGradient>
      </defs>

      {/* 1. Corpo do Cone Trapezoidal de Projeção (Preto 50% -> Alpha 0%) */}
      <path
        d={conePolygonPath}
        fill="url(#cone-grad-muted)"
      />

      {/* 2. Traço Nítido Principal das Arestas do Feixe de Zoom (Cinza Muted Discreto) */}
      <path
        d={topRayPath}
        fill="none"
        stroke="url(#stroke-grad-muted)"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      <path
        d={bottomRayPath}
        fill="none"
        stroke="url(#stroke-grad-muted)"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />

      {/* 3. Retículo de Mira e Cantoneiras de Foco no Ponto do Mapa (QGIS Target Box Discreto) */}
      <g transform={`translate(${targetX}, ${targetY})`}>
        {/* Retângulo de Foco da Seção com Cantoneiras */}
        <rect
          x="-8"
          y="-8"
          width="16"
          height="16"
          fill="none"
          stroke={mutedStrokeColor}
          strokeWidth="1.0"
          strokeDasharray="3 2"
          strokeOpacity="0.65"
        />
        {/* Ponto Central de Foco */}
        <circle r="2" fill={mutedStrokeColor} fillOpacity="0.85" />
      </g>

      {/* 4. Marcadores de Ancoragem Discretos nos Cantos do Quadro */}
      <g transform={`translate(${topAnchorPos.x}, ${topAnchorPos.y})`}>
        <circle r="3" fill="#020617" stroke={mutedStrokeColor} strokeWidth="1.2" />
        <circle r="1.2" fill={mutedStrokeColor} />
      </g>
      <g transform={`translate(${bottomAnchorPos.x}, ${bottomAnchorPos.y})`}>
        <circle r="3" fill="#020617" stroke={mutedStrokeColor} strokeWidth="1.2" />
        <circle r="1.2" fill={mutedStrokeColor} />
      </g>
    </svg>
  );
};
