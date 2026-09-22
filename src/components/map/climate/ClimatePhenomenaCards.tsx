import React from 'react';

interface ClimateCardProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  tag: string;
  tagColor?: string;
  tagBg?: string;
  title: string;
  titleColor?: string;
  borderColor?: string;
  lines: string[];
  telemetry: string;
  telemetryColor?: string;
}

/**
 * Cartographic 4x2 Proportion Informative Badge Card for Climate Phenomena
 * Width:Height adheres strictly to a 2:1 (4x2) aspect ratio (e.g. 360x180 or 340x170).
 * Rendered natively in SVG with 100% solid contrast and sharp typography.
 */
export const CartographicClimateCard4x2: React.FC<ClimateCardProps> = ({
  x,
  y,
  width = 360,
  height = 180,
  tag,
  tagColor = '#38bdf8',
  tagBg = 'rgba(14, 165, 233, 0.20)',
  title,
  titleColor = '#ffffff',
  borderColor = '#0284c7',
  lines,
  telemetry,
  telemetryColor = '#bae6fd',
}) => {
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="card-fenomeno-clima-4x2 pointer-events-none select-none transition-all duration-300"
    >
      {/* Drop shadow / Glow de profundidade */}
      <rect
        x={-halfW + 3}
        y={-halfH + 6}
        width={width}
        height={height}
        rx={16}
        fill="rgba(0, 0, 0, 0.75)"
      />

      {/* Superfície Principal 100% Sólida e Escura com Borda Contrastante */}
      <rect
        x={-halfW}
        y={-halfH}
        width={width}
        height={height}
        rx={16}
        fill="rgba(4, 9, 22, 0.98)"
        stroke={borderColor}
        strokeWidth={2}
      />

      {/* Selo / Categoria Superior */}
      <g transform={`translate(${-halfW + 16}, ${-halfH + 16})`}>
        <rect
          x={0}
          y={0}
          width={Math.min(width - 32, tag.length * 6.8 + 16)}
          height={20}
          rx={5}
          fill={tagBg}
          stroke={tagColor}
          strokeWidth={1}
        />
        <text
          x={8}
          y={14}
          fill={tagColor}
          fontSize={9.5}
          fontFamily="ui-monospace, monospace"
          fontWeight="bold"
          letterSpacing="0.08em"
        >
          {tag.toUpperCase()}
        </text>
      </g>

      {/* Título Principal */}
      <text
        x={-halfW + 16}
        y={-halfH + 58}
        fill={titleColor}
        fontSize={14}
        fontFamily="serif"
        fontWeight="bold"
      >
        {title}
      </text>

      {/* Linha Divisória de Precisão */}
      <line
        x1={-halfW + 16}
        y1={-halfH + 68}
        x2={halfW - 16}
        y2={-halfH + 68}
        stroke={borderColor}
        strokeWidth={1}
        strokeOpacity={0.4}
      />

      {/* Linhas de Texto Explicativo (Multilinha Didática) */}
      <text
        x={-halfW + 16}
        y={-halfH + 88}
        fill="#cbd5e1"
        fontSize={11}
        fontFamily="sans-serif"
        letterSpacing="0.01em"
      >
        {lines.map((line, idx) => (
          <tspan key={idx} x={-halfW + 16} dy={idx === 0 ? 0 : 17}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Faixa de Rodapé com Telemetria e Indicadores */}
      <g transform={`translate(${-halfW + 12}, ${halfH - 34})`}>
        <rect
          x={0}
          y={0}
          width={width - 24}
          height={24}
          rx={6}
          fill="rgba(15, 23, 42, 0.90)"
          stroke="rgba(148, 163, 184, 0.25)"
          strokeWidth={1}
        />
        <text
          x={10}
          y={16}
          fill={telemetryColor}
          fontSize={10}
          fontFamily="ui-monospace, monospace"
          fontWeight="bold"
        >
          {telemetry}
        </text>
      </g>
    </g>
  );
};
