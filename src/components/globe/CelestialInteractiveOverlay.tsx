/**
 * CelestialInteractiveOverlay - Overlay Interativo dos Astros do Sistema Solar
 * Gerencia os pins cósmicos na tela, o balão rápido ao passar o mouse e o painel de trajetória interplanetária.
 */
import React, { useState } from 'react';
import {
  ProjectedCelestialPin,
  CelestialBodyInfo,
  CosmicTrajectoryTelemetry,
} from '../../lib/globeEngine/types';
import { CelestialHoverDialog } from './CelestialHoverDialog';
import { CelestialTrajectoryPanel } from './CelestialTrajectoryPanel';

interface CelestialInteractiveOverlayProps {
  pins: ProjectedCelestialPin[];
  selectedAstro: CelestialBodyInfo | null;
  trajectoryTelemetry: CosmicTrajectoryTelemetry | null;
  onSelectAstro: (astro: CelestialBodyInfo | null) => void;
  onFocusAstroCamera: (astro: CelestialBodyInfo) => void;
  onResetToBrazil: () => void;
}

export const CelestialInteractiveOverlay: React.FC<CelestialInteractiveOverlayProps> = ({
  pins,
  selectedAstro,
  trajectoryTelemetry,
  onSelectAstro,
  onFocusAstroCamera,
  onResetToBrazil,
}) => {
  const [hoveredAstroId, setHoveredAstroId] = useState<string | null>(null);

  // Active astro shown in hover
  const activeHoveredPin = pins.find((p) => p.id === hoveredAstroId);

  // Fallback telemetry calculation if trajectory telemetry is not yet populated
  const effectiveTelemetry =
    trajectoryTelemetry ||
    (selectedAstro
      ? {
          targetAstro: selectedAstro,
          originStateId: 'BR',
          originStateName: 'Brasil (Órbita)',
          distanceKm: selectedAstro.distanceKm || 384400,
          distanceAu: (selectedAstro.distanceKm || 384400) / 149597870.7,
          lightTimeFormatted: `${((selectedAstro.distanceKm || 384400) / 299792.458).toFixed(1)} seg`,
          radioPingLatencyFormatted: `${(((selectedAstro.distanceKm || 384400) / 299792.458) * 2).toFixed(1)} seg`,
          probeTravelFormatted: `${((selectedAstro.distanceKm || 384400) / (15 * 86400)).toFixed(1)} dias`,
          gravityRelativeFormatted: `${(selectedAstro.gravityMss / 9.807).toFixed(2)}g`,
        }
      : null);

  return (
    <div className="container-overlay-astronomico pointer-events-none absolute inset-0 z-30 overflow-hidden select-none">
      {/* 1. Celestial Screen Pins */}
      {pins.map((pin) => {
        if (!pin.visible) return null;

        const isHovered = hoveredAstroId === pin.id;
        const isSelected = selectedAstro?.id === pin.id;

        return (
          <div
            key={pin.id}
            id={`pin-astro-${pin.id}`}
            style={{
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredAstroId(pin.id)}
            onMouseLeave={() => setHoveredAstroId((cur) => (cur === pin.id ? null : cur))}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAstro(isSelected ? null : pin.data);
            }}
            className={`pin-astro-celeste pointer-events-auto absolute flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'scale-115 z-40'
                : isHovered
                ? 'scale-110 z-35'
                : 'opacity-85 hover:opacity-100 z-20'
            }`}
          >
            {/* Pulsing Aura */}
            <div
              className={`relative flex items-center justify-center rounded-full border transition-all ${
                isSelected
                  ? 'w-7 h-7 bg-cyan-500/30 border-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.8)] animate-pulse'
                  : isHovered
                  ? 'w-6 h-6 bg-amber-500/30 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'w-5 h-5 bg-slate-950/75 border-slate-400/60 shadow-[0_0_8px_rgba(0,0,0,0.5)]'
              }`}
            >
              <span
                style={{ color: pin.color }}
                className="text-xs font-serif font-black leading-none"
              >
                {pin.symbol}
              </span>
            </div>

            {/* Label Chip */}
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider transition-all backdrop-blur-md border ${
                isSelected
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400/80 shadow-md shadow-cyan-950/60'
                  : isHovered
                  ? 'bg-amber-950/90 text-amber-200 border-amber-400/80 shadow-md shadow-amber-950/60'
                  : 'bg-slate-950/70 text-slate-300 border-slate-700/60'
              }`}
            >
              <span>{pin.name}</span>
            </div>
          </div>
        );
      })}

      {/* 2. Balão de Diálogo Cósmico no Hover */}
      {hoveredAstroId && activeHoveredPin && !selectedAstro && (
        <CelestialHoverDialog pin={activeHoveredPin} />
      )}

      {/* 3. Painel Flutuante de Trajetória Cósmica Interplanetária */}
      {selectedAstro && effectiveTelemetry && (
        <CelestialTrajectoryPanel
          selectedAstro={selectedAstro}
          telemetry={effectiveTelemetry}
          onFocusAstroCamera={onFocusAstroCamera}
          onClose={() => {
            onSelectAstro(null);
            onResetToBrazil();
          }}
        />
      )}
    </div>
  );
};
