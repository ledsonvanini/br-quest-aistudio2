import React, { useState } from 'react';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import {
  ALL_BRAZIL_STATES,
  getStateCoatOfArmsUrl,
} from '../../data/brazilStatesRegistry';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface MapPinsLayerProps {
  centroids: Record<string, [number, number]>;
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  is3D?: boolean;
  tiltAngle?: number;
  onSelectGuardian: (stateId: string) => void;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
}

export const MapPinsLayer: React.FC<MapPinsLayerProps> = ({
  centroids,
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  is3D = true,
  tiltAngle = 42,
  onSelectGuardian,
  onStateEnter,
  onStateLeave,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Quando qualquer estado estiver selecionado/isolado, oculta os pins do mapa
  if (selectedStateId) return null;

  return (
    <div
      className="camada-pins-brasoes absolute inset-0 pointer-events-none"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {ALL_BRAZIL_STATES.map((stateInfo) => {
        const stateId = stateInfo.id;
        const coords = centroids[stateId] || stateInfo.centroid;
        if (!coords) return null;

        const [x, y] = coords;
        const isCompleted = completedStateIds.has(stateId);
        const isHovered = hoveredStateId === stateId;
        const isSelected = selectedStateId === stateId;
        const isActive = isHovered || isSelected;

        const coatOfArmsUrl = getStateCoatOfArmsUrl(stateId) || stateInfo.coatOfArmsUrl;
        const hasImgError = imageErrors[stateId];

        // Counter-tilt for orthogonal view so the banner faces the player camera
        const effectiveTilt = Math.round(tiltAngle || 42);

        return (
          <div
            key={stateId}
            id={`anchor-pin-${stateId}`}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: '0px',
              height: '0px',
              transformStyle: 'preserve-3d',
              zIndex: isActive ? 60 : isCompleted ? 20 : 10,
            }}
            className={`ancora-estado-pin ancora-pin-${stateId.toLowerCase()} select-none`}
          >
            {/* ==================================================================== */}
            {/* 0. EXPANDED HIT TRIGGER FOR SMALL GEOGRAPHIC STATES (DF, SE, AL, etc.)*/}
            {/* ==================================================================== */}
            <div
              className="hitbox-estado-expandida absolute -left-7 -top-7 w-14 h-14 rounded-full pointer-events-auto cursor-pointer z-20"
              style={{ transform: 'translateZ(0px)' }}
              onMouseEnter={() => onStateEnter(stateId)}
              onMouseLeave={() => onStateLeave(stateId)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGuardian(stateId);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title={stateInfo.name}
            />

            {/* ==================================================================== */}
            {/* 1. GROUND BEACON CIRCLE & PERMANENT HIGH-CONTRAST STATE LABEL       */}
            {/* ==================================================================== */}
            <div
              className={`circulo-beacon-terreno absolute -left-4 -top-4 w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-transform duration-300 ${
                isActive ? 'scale-125' : 'hover:scale-115'
              }`}
              onMouseEnter={() => onStateEnter(stateId)}
              onMouseLeave={() => onStateLeave(stateId)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGuardian(stateId);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Soft Expanding Pulse Wave */}
              <div
                className={`anel-radar-pulso absolute inset-0 rounded-full anim-ground-beacon-pulse pointer-events-none ${
                  isActive
                    ? 'border-2 border-amber-300 bg-amber-400/25 shadow-[0_0_14px_rgba(245,158,11,0.6)]'
                    : isCompleted
                    ? 'border-2 border-emerald-400/80 bg-emerald-500/15'
                    : 'border-2 border-amber-400/70 bg-amber-500/15'
                }`}
              />

              {/* Antique Metal Cartographic Disc */}
              <div
                className={`anel-mostrador-solo relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'border-amber-300 bg-amber-950/95 shadow-[0_0_12px_rgba(245,158,11,0.85)]'
                    : isCompleted
                    ? 'border-emerald-400 bg-emerald-950/90 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                    : 'border-amber-400 bg-slate-950/90 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                }`}
              >
                {/* Concentric Brass Inset Ring */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isActive
                      ? 'border-amber-300 bg-amber-400/20'
                      : isCompleted
                      ? 'border-emerald-300/90 bg-emerald-400/20'
                      : 'border-amber-400/80'
                  }`}
                >
                  {/* Central Core Eyelet Pinpoint (Strict (0,0) center) */}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive
                        ? 'bg-amber-300 shadow-[0_0_8px_#fde047]'
                        : isCompleted
                        ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                        : 'bg-amber-400 shadow-[0_0_4px_#f59e0b]'
                    }`}
                  />
                </div>
              </div>

              {/* Tag Permanente da Sigla do Estado para Leitura Imediata (Para Idosos e Zoom Cheio) */}
              <div
                className={`tag-sigla-permanente absolute top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-md border shadow-lg font-mono font-black text-[11px] sm:text-xs tracking-wider whitespace-nowrap select-none pointer-events-none transition-all ${
                  isActive
                    ? 'bg-amber-950 text-amber-200 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)] scale-110'
                    : isCompleted
                    ? 'bg-slate-950/95 text-emerald-300 border-emerald-400/80 shadow-[0_2px_8px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-950/95 text-amber-200 border-amber-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }`}
              >
                {stateId}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
