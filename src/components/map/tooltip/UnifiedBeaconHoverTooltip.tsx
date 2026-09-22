// src/components/map/tooltip/UnifiedBeaconHoverTooltip.tsx
// Card Flutuante de Alto DPI em HTML Nativo para Círculos e Beacons com Cone de Projeção Cartográfica (QGIS)
// Renderização síncrona sem delay entre o Cone e o Painel

import React from 'react';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { parseTelemetryToMetrics } from '../markers/beaconTelemetryParser';
import { calculateSmartTooltipPosition } from '../../../utils/tooltipPositioning';
import { CartographicProjectionCone } from './CartographicProjectionCone';
import { Sparkles } from 'lucide-react';

export const UnifiedBeaconHoverTooltip: React.FC = () => {
  const { activeBeacon } = useBeaconHover();

  if (!activeBeacon) return null;

  const { payload, screenPos } = activeBeacon;
  const {
    tag,
    tagColor = '#38bdf8',
    tagBg = 'rgba(14, 165, 233, 0.20)',
    title,
    lines,
    telemetry,
    metrics: explicitMetrics,
    subtitle,
    footerSource = 'INMET • NOAA • ECMWF',
    topBadge,
  } = payload;

  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 310 : 340;
  const cardHeight = lines && lines.length > 0 ? 250 : 210;

  // Posicionamento inteligente síncrono afastado do cursor/círculo (~72px) e clampado na viewport
  const smartResult = calculateSmartTooltipPosition({
    target: screenPos,
    cardWidth,
    cardHeight,
    minDistance: 72,
    topMargin: 70,
    bottomMargin: 60,
    sideMargin: 24,
  });

  const metrics =
    explicitMetrics && explicitMetrics.length > 0
      ? explicitMetrics
      : parseTelemetryToMetrics(telemetry);

  const defaultTopBadge = topBadge || {
    label: metrics[0]?.value || 'Ativo',
    icon: metrics[0]?.icon || <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
  };

  return (
    <div
      key={`beacon-hover-group-${title}`}
      className="container-beacon-hover-unificado fixed inset-0 pointer-events-none select-none z-[99998] animate-in fade-in duration-150 ease-out"
    >
      {/* 1. Feixe de Cone de Projeção / Zoom Section (Preto 50% -> Alpha 0% estilo QGIS) */}
      <CartographicProjectionCone
        targetPos={smartResult.targetPos}
        topAnchorPos={smartResult.topAnchorPos}
        bottomAnchorPos={smartResult.bottomAnchorPos}
        conePolygonPath={smartResult.conePolygonPath}
        topRayPath={smartResult.topRayPath}
        bottomRayPath={smartResult.bottomRayPath}
      />

      {/* 2. Painel de Telemetria do Círculo/Beacon - z-index 99999 */}
      <aside
        id="balao-universal-circulo-hover"
        role="tooltip"
        aria-live="polite"
        className="balao-universal-circulo-hover fixed pointer-events-none select-none z-[99999] overflow-hidden"
        style={{
          left: `${smartResult.cardPos.x}px`,
          top: `${smartResult.cardPos.y}px`,
          width: `${cardWidth}px`,
          isolation: 'isolate',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'geometricPrecision',
        }}
      >
        <div
          className="card-balao-conteudo-unificado rounded-2xl p-3.5 sm:p-4 backdrop-blur-xl border border-slate-700/80 text-white space-y-2.5 overflow-hidden break-words shadow-[0_20px_50px_rgba(0,0,0,0.95)] bg-slate-950/95"
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
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner shrink-0">
              {defaultTopBadge.icon}
              <span className="font-black text-xs text-amber-300 font-mono truncate max-w-[100px]">
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
      </aside>
    </div>
  );
};
