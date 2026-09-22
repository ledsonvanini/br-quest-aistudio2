// src/components/map/markers/InteractivePulsingBeacon.tsx
// Ponto de Pulso Interativo de Fenômenos Atmosféricos com Escala Nítida e Tooltip de Tela

import React, { useRef } from 'react';
import { audioEngine } from '../../../lib/audioSynth';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { StructuredBeaconMetric } from './beaconTelemetryParser';

export interface InteractivePulsingBeaconProps {
  x: number;
  y: number;
  color?: string;
  pulseColor?: string;
  badgeLabel?: string;
  tag: string;
  tagColor?: string;
  tagBg?: string;
  title: string;
  titleColor?: string;
  borderColor?: string;
  lines: string[];
  telemetry?: string;
  telemetryColor?: string;
  metrics?: StructuredBeaconMetric[];
  subtitle?: string;
  footerSource?: string;
  topBadge?: {
    label: string;
    icon?: React.ReactNode;
  };
  cardWidth?: number;
  cardHeight?: number;
  isHoveredDefault?: boolean;
  onSelect?: () => void;
  onHover?: (isHovered: boolean) => void;
  className?: string;
}

export const InteractivePulsingBeacon: React.FC<InteractivePulsingBeaconProps> = ({
  x,
  y,
  color = '#38bdf8',
  pulseColor = 'rgba(56, 189, 248, 0.45)',
  badgeLabel,
  tag,
  tagColor = '#38bdf8',
  tagBg = 'rgba(14, 165, 233, 0.20)',
  title,
  titleColor = '#38bdf8',
  borderColor = '#0284c7',
  lines,
  telemetry,
  telemetryColor = '#bae6fd',
  metrics,
  subtitle,
  footerSource,
  topBadge,
  onSelect,
  onHover,
  className = '',
}) => {
  const { showBeaconTooltip, updateBeaconPos, hideBeaconTooltip } = useBeaconHover();

  const payload = {
    tag,
    tagColor,
    tagBg,
    title,
    titleColor,
    borderColor,
    lines,
    telemetry,
    telemetryColor,
    metrics,
    subtitle,
    footerSource,
    topBadge,
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    showBeaconTooltip(payload, e);
    onHover?.(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateBeaconPos(e);
  };

  const handleMouseLeave = () => {
    hideBeaconTooltip();
    onHover?.(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playSfx('click');
    onSelect?.();
  };

  // Dimensões do badge ampliadas para manter legibilidade excelente no zoom out (mapa completo)
  const badgeWidth = badgeLabel ? badgeLabel.length * 11.5 + 32 : 0;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={`marcador-ponto-pulso-interativo group cursor-pointer pointer-events-auto ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 0. Área de Toque Invisível Generosa e Centralizada (Hitbox de 108px no SVG) */}
      <circle cx={0} cy={0} r={54} fill="transparent" className="cursor-pointer pointer-events-auto" />

      {/* 1. Anel Radar Pulsante (Onda Contínua Cartográfica Ampliada) */}
      <circle
        cx={0}
        cy={0}
        r={46}
        fill={pulseColor}
        className="animate-ping pointer-events-none"
        style={{ animationDuration: '2.5s' }}
      />
      <circle
        cx={0}
        cy={0}
        r={36}
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeOpacity={0.6}
        strokeDasharray="6 6"
        className="animate-spin pointer-events-none"
        style={{ animationDuration: '14s' }}
      />

      {/* 2. Núcleo Sólido com Borda de Alta Precisão (Raio 22, Diâmetro 44) */}
      <circle
        cx={0}
        cy={0}
        r={22}
        fill="#020617"
        stroke={color}
        strokeWidth={3.4}
        className="transition-transform duration-200 group-hover:scale-115"
        style={{ filter: `drop-shadow(0 0 16px ${color})` }}
      />
      <circle cx={0} cy={0} r={8.5} fill={color} className="pointer-events-none" />

      {/* 3. Rótulo Permanente do Fenômeno (Amplo, Nítido e Legível em Tela Cheia) */}
      {badgeLabel && (
        <g
          transform="translate(26, -8)"
          className="pointer-events-auto cursor-pointer select-none transition-transform duration-150 group-hover:scale-105"
        >
          <rect
            x={0}
            y={-19}
            width={badgeWidth}
            height={38}
            rx={9}
            fill="#020617"
            fillOpacity={0.96}
            stroke={color}
            strokeWidth={1.8}
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.92))' }}
          />
          <text
            x={16}
            y={7}
            fill="#f8fafc"
            fontSize={18}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
            fontWeight="bold"
            letterSpacing="0.04em"
          >
            {badgeLabel}
          </text>
        </g>
      )}
    </g>
  );
};
