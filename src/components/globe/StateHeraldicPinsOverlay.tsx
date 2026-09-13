/**
 * StateHeraldicPinsOverlay - Camada de Projeção 2D dos Brasões e Pins dos Estados Brasileiros
 * Renderiza os pins de radar e brasões heráldicos com LOD (Level of Detail) e suavidade.
 */
import React from 'react';
import { GeodesicRoute } from '../../lib/globeEngine';
import { StateHeraldicShield } from '../map/StateHeraldicShield';

export interface ProjectedPin {
  stateId: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
  distance: number;
}

interface StateHeraldicPinsOverlayProps {
  projectedPins: ProjectedPin[];
  completedStateIds: Set<string>;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  activeAdaptedRoute?: GeodesicRoute | null;
  pinDisplayMode?: 'all' | 'compact' | 'none';
  isAstralMode?: boolean;
  onPinClick: (stateId: string) => void;
  onStateHover: (stateId: string | null) => void;
}

export const StateHeraldicPinsOverlay: React.FC<StateHeraldicPinsOverlayProps> = ({
  projectedPins,
  completedStateIds,
  hoveredStateId,
  selectedStateId,
  activeAdaptedRoute,
  pinDisplayMode = 'all',
  isAstralMode = false,
  onPinClick,
  onStateHover,
}) => {
  if (pinDisplayMode === 'none' || isAstralMode) return null;

  return (
    <div
      id="camada-pins-projetados-3d"
      className="camada-pins-projetados-3d absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-label="Pins Interativos dos Estados Brasileiros"
    >
      {projectedPins.map(({ stateId, x, y, scale, distance }) => {
        const isCompleted = completedStateIds.has(stateId);
        const isHovered = hoveredStateId === stateId;
        const isSelected = selectedStateId === stateId;

        const isZoomedOut = distance > 5.2 && pinDisplayMode !== 'all';
        const pinScale = scale * (isHovered || isSelected ? 1.25 : 0.6);

        const isRouteEndpoint = Boolean(
          activeAdaptedRoute &&
            (activeAdaptedRoute.fromStateId === stateId || activeAdaptedRoute.toStateId === stateId)
        );
        const shouldShowShield = isHovered || isSelected || isRouteEndpoint;

        return (
          <div
            key={stateId}
            id={`pin-item-${stateId}`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -100%) scale(${pinScale})`,
              transformOrigin: 'bottom center',
            }}
            className="pin-estado-3d-item pin-brasao-estado absolute pointer-events-auto will-change-transform"
          >
            <button
              type="button"
              id={`btn-pin-globo-${stateId}`}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(stateId);
              }}
              onMouseEnter={() => onStateHover(stateId)}
              onMouseLeave={() => onStateHover(null)}
              className="btn-pin-globo-3d group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer"
              aria-label={`Estado ${stateId}`}
            >
              {/* Radar Pulse Ring */}
              <div className="circulo-radar-3d absolute -inset-2.5 pointer-events-none flex items-center justify-center">
                <div
                  className={`absolute w-10 h-10 rounded-full border transition-all duration-300 ${
                    isSelected
                      ? 'border-2 border-sky-300 bg-sky-400/30 animate-ping opacity-90'
                      : isCompleted
                      ? 'border border-emerald-300/80 bg-emerald-500/20 animate-ping opacity-75'
                      : isHovered
                      ? 'border-2 border-sky-400 bg-sky-400/25 animate-ping opacity-85'
                      : 'border border-sky-400/30 opacity-30 group-hover:opacity-80 group-hover:animate-ping'
                  }`}
                  style={{ animationDuration: isSelected ? '1.4s' : '2.8s' }}
                />
              </div>

              {/* Heraldic Shield */}
              {shouldShowShield && !isZoomedOut && (
                <StateHeraldicShield
                  stateId={stateId}
                  isCompleted={isCompleted}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  size={isHovered || isSelected ? 'md' : 'sm'}
                />
              )}

              {/* UF Tag Badge */}
              <div
                className={`pill-sigla-uf-3d mt-0.5 px-2 py-0.2 ${
                  isHovered || isSelected ? 'text-[10px]' : 'text-[8px]'
                } font-black rounded-full shadow-md whitespace-nowrap z-20 border transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white border-emerald-300 font-bold'
                    : isSelected || isHovered
                    ? 'bg-sky-400 text-slate-950 border-sky-200 font-bold'
                    : 'bg-black/70 backdrop-blur-sm text-sky-200 border-sky-500/60'
                }`}
              >
                {stateId}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};
