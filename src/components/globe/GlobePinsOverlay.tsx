/**
 * 2D Screen Overlay for Projected 3D State Pins & Heraldic Shields
 */
import React from 'react';
import { StateHeraldicShield } from '../map/StateHeraldicShield';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { GuardianData } from '../../types';

export interface ProjectedPin {
  stateId: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
  distance: number;
}

interface GlobePinsOverlayProps {
  pins: ProjectedPin[];
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  routeStateIds?: Set<string>;
  pinDisplayMode: 'all' | 'compact' | 'none';
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  onSelectGuardian?: (guardian: GuardianData) => void;
}

export const GlobePinsOverlay: React.FC<GlobePinsOverlayProps> = ({
  pins,
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  routeStateIds,
  pinDisplayMode,
  onStateHover,
  onStateClick,
  onSelectGuardian,
}) => {
  if (pinDisplayMode === 'none') return null;

  return (
    <div
      id="container-pins-globo-3d"
      className="container-pins-globo-3d absolute inset-0 pointer-events-none overflow-hidden z-20"
    >
      {pins.map((pin) => {
        if (!pin.visible) return null;

        const geo = BRAZIL_STATES_GEO[pin.stateId];
        if (!geo) return null;

        const isHovered = hoveredStateId === pin.stateId;
        const isSelected = selectedStateId === pin.stateId;
        const isCompleted = completedStateIds.has(pin.stateId);
        const isRouteActive = Boolean(routeStateIds && routeStateIds.has(pin.stateId));
        const guardian = GUARDIANS_DATA.find((g) => g.id === pin.stateId);

        // User mandate: default to pulsing circles, show shield onHover, onRoute, or onSelect
        const showShield = isHovered || isRouteActive || isSelected;

        return (
          <div
            key={pin.stateId}
            id={`pin-globo-${pin.stateId}`}
            className="pin-brasao-estado absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-150"
            style={{
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              transform: `translate(-50%, -50%) scale(${pin.scale * (isHovered || isSelected ? 1.25 : 1.0)})`,
              zIndex: isSelected ? 40 : isHovered ? 35 : isRouteActive ? 30 : 20,
            }}
            onMouseEnter={() => onStateHover(pin.stateId)}
            onMouseLeave={() => onStateHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              onStateClick(pin.stateId);
              if (guardian && onSelectGuardian) {
                onSelectGuardian(guardian);
              }
            }}
          >
            {showShield ? (
              // Full Heraldic Shield on Hover / Route / Select
              <div className="flex flex-col items-center group animate-in zoom-in-75 duration-150">
                <div
                  className={`p-1 rounded-xl backdrop-blur-md transition-all duration-200 shadow-xl ${
                    isRouteActive
                      ? 'bg-amber-500/30 border-2 border-amber-300 shadow-amber-500/50 scale-110'
                      : isSelected
                      ? 'bg-amber-500/30 border-2 border-amber-400 shadow-amber-500/40 scale-110'
                      : isHovered
                      ? 'bg-sky-500/30 border border-sky-400 shadow-sky-500/30'
                      : isCompleted
                      ? 'bg-emerald-950/80 border border-emerald-400/60'
                      : 'bg-slate-900/85 border border-slate-700/80 hover:border-sky-400'
                  }`}
                >
                  <StateHeraldicShield
                    stateId={pin.stateId}
                    size="md"
                    isCompleted={isCompleted}
                  />
                </div>

                <div
                  className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors whitespace-nowrap shadow-md ${
                    isRouteActive || isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : isHovered
                      ? 'bg-sky-400 text-slate-950'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {isRouteActive ? `ROTA • ${pin.stateId}` : pin.stateId}
                </div>
              </div>
            ) : (
              // POR PADRÃO: Circulo Pulsante Discreto
              <div className="circulo-pulsante-globo relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-sky-400/30 animate-ping pointer-events-none" />
                <span className="absolute w-6 h-6 rounded-full border border-sky-400/60 animate-pulse pointer-events-none" />
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] font-mono shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400'
                      : 'bg-slate-950/90 text-sky-200 border-2 border-sky-400/80 hover:border-amber-400 hover:text-amber-300'
                  }`}
                >
                  {pin.stateId}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
