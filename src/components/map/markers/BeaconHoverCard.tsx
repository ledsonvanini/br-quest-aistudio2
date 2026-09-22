// src/components/map/markers/BeaconHoverCard.tsx
// Card Didático Padronizado de Alto Contraste Renderizado com HTML/Tailwind idêntico ao Estado

import React from 'react';
import { parseTelemetryToMetrics, StructuredBeaconMetric } from './beaconTelemetryParser';
import { Compass, Sparkles } from 'lucide-react';

export interface BeaconHoverCardProps {
  offsetX: number;
  offsetY: number;
  cardWidth?: number;
  cardHeight?: number;
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
}

export const BeaconHoverCard: React.FC<BeaconHoverCardProps> = ({
  offsetX,
  offsetY,
  cardWidth = 345,
  cardHeight = 285,
  tag,
  tagColor = '#38bdf8',
  tagBg = 'rgba(14, 165, 233, 0.20)',
  title,
  borderColor = '#0284c7',
  lines,
  telemetry,
  metrics: explicitMetrics,
  subtitle,
  footerSource = 'INMET • NOAA • ECMWF',
  topBadge,
}) => {
  const halfW = cardWidth / 2;
  const metrics = explicitMetrics && explicitMetrics.length > 0 ? explicitMetrics : parseTelemetryToMetrics(telemetry);

  // Badge no topo direito (usa o topBadge se fornecido ou o primeiro dado da métrica)
  const defaultTopBadge = topBadge || {
    label: metrics[0]?.value || 'Ativo',
    icon: metrics[0]?.icon || <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
  };

  const isOpeningAbove = offsetY < 0;

  return (
    <foreignObject
      x={offsetX - halfW}
      y={isOpeningAbove ? offsetY : offsetY}
      width={cardWidth}
      height={cardHeight + 50}
      className="painel-legivel-onhover-circulo overflow-visible pointer-events-auto select-none"
      style={{ zIndex: 99999 }}
    >
      <div
        className="relative group w-full pointer-events-auto flex flex-col justify-between"
        style={{ width: `${cardWidth}px` }}
      >
        {/* Ponte de mouse transparente para garantir estabilidade do hover */}
        {isOpeningAbove && (
          <div
            className="absolute -bottom-6 left-0 w-full h-8 bg-transparent pointer-events-auto"
            aria-hidden="true"
          />
        )}
        {!isOpeningAbove && (
          <div
            className="absolute -top-6 left-0 w-full h-8 bg-transparent pointer-events-auto"
            aria-hidden="true"
          />
        )}

        {/* Card Padronizado com Design System do UnifiedStateHoverTooltip */}
        <div
          className="rounded-2xl p-3.5 sm:p-4 backdrop-blur-xl border-2 text-white space-y-2.5 overflow-hidden break-words transition-all duration-150 ease-out animate-in fade-in zoom-in-95 duration-150"
          style={{
            backgroundColor: 'rgba(2, 6, 23, 0.96)',
            borderColor: borderColor,
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.98), 0 0 30px ${borderColor}66`,
          }}
        >
          {/* 1. Header Padronizado: Tag + Título + Badge à Direita */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span
                className="font-mono font-black text-xs px-2 py-0.5 rounded-lg border shrink-0 uppercase tracking-wider"
                style={{
                  backgroundColor: tagBg,
                  color: tagColor,
                  borderColor: tagColor,
                }}
              >
                {tag.length > 18 ? tag.slice(0, 18) + '…' : tag}
              </span>

              <div className="min-w-0">
                <h4 className="font-serif font-bold text-white text-sm sm:text-base tracking-wide truncate">
                  {title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {subtitle || 'Fenômeno Atmosférico & Geográfico'}
                </p>
              </div>
            </div>

            {/* Badge de Telemetria no Topo Direito */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-inner shrink-0">
              {defaultTopBadge.icon}
              <span className="font-black text-xs text-amber-300 font-mono truncate max-w-[90px]">
                {defaultTopBadge.label}
              </span>
            </div>
          </div>

          {/* 2. Grid 2x2 com Métricas Técnicas Padronizadas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {metrics.slice(0, 4).map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div className="shrink-0">{metric.icon}</div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block truncate">{metric.label}</span>
                  <strong className="text-white text-xs block font-bold truncate">
                    {metric.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Bloco Descritivo Didático Fluido */}
          {lines && lines.length > 0 && (
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs text-slate-200 leading-relaxed font-sans">
              {lines.join(' ')}
            </div>
          )}

          {/* 4. Faixa Inferior de Fonte e Status Cartográfico */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
            <span className="truncate">{footerSource}</span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Ativo
            </span>
          </div>
        </div>
      </div>
    </foreignObject>
  );
};
