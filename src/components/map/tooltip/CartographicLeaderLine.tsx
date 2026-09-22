// src/components/map/tooltip/CartographicLeaderLine.tsx
// Linha Guia Cartográfica Conectora (Leader Line) entre o Centro do Alvo e o Balão de Telemetria

import React from 'react';

interface CartographicLeaderLineProps {
  targetPos: { x: number; y: number };
  anchorPos: { x: number; y: number };
  linePath: string;
  themeColor?: string;
  className?: string;
}

export const CartographicLeaderLine: React.FC<CartographicLeaderLineProps> = ({
  targetPos,
  anchorPos,
  linePath,
  themeColor = '#38bdf8',
  className = '',
}) => {
  return (
    <svg
      id="svg-leader-line-cartografica"
      className={`svg-leader-line-cartografica fixed inset-0 pointer-events-none z-[99998] w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradiente luminoso ao longo do traço */}
        <linearGradient
          id={`grad-leader-${themeColor.replace('#', '')}`}
          x1={targetPos.x}
          y1={targetPos.y}
          x2={anchorPos.x}
          y2={anchorPos.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={themeColor} stopOpacity="0.85" />
          <stop offset="45%" stopColor={themeColor} stopOpacity="0.65" />
          <stop offset="100%" stopColor={themeColor} stopOpacity="0.95" />
        </linearGradient>

        {/* Filtro de brilho sutil */}
        <filter id="leader-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Sombra e Glow da Linha de Conexão */}
      <path
        d={linePath}
        fill="none"
        stroke={themeColor}
        strokeWidth="3.2"
        strokeOpacity="0.30"
        strokeLinecap="round"
        filter="url(#leader-glow)"
      />

      {/* 2. Traço Principal Cartográfico Pontilhado / Sólido */}
      <path
        d={linePath}
        fill="none"
        stroke={`url(#grad-leader-${themeColor.replace('#', '')})`}
        strokeWidth="1.8"
        strokeDasharray="4 3"
        strokeLinecap="round"
        className="animate-[pulse_2.5s_ease-in-out_infinite]"
      />

      {/* 3. Retículo de Mira no Ponto Apontado (Origem no Mapa) */}
      <g transform={`translate(${targetPos.x}, ${targetPos.y})`}>
        {/* Anel Externo Pulsante */}
        <circle
          r="9"
          fill="none"
          stroke={themeColor}
          strokeWidth="1.4"
          strokeOpacity="0.6"
          strokeDasharray="3 3"
          className="animate-spin"
          style={{ animationDuration: '8s' }}
        />
        {/* Núcleo Central de Mira */}
        <circle r="3.5" fill={themeColor} />
      </g>

      {/* 4. Ponto Luminoso de Fixação na Borda do Card */}
      <g transform={`translate(${anchorPos.x}, ${anchorPos.y})`}>
        <circle r="4" fill="#020617" stroke={themeColor} strokeWidth="2" />
        <circle r="2" fill={themeColor} />
      </g>
    </svg>
  );
};
