import React from 'react';
import { StateVisualProperties } from '../stateStyling/stateFillStyler';

export interface StateElevatedHighlightLayerProps {
  activeElevatedStateId: string;
  activePathD: string;
  activeVisuals: StateVisualProperties;
  onStateClick: (stateId: string, e: React.MouseEvent) => void;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
}

export const StateElevatedHighlightLayer: React.FC<StateElevatedHighlightLayerProps> = ({
  activeElevatedStateId,
  activePathD,
  activeVisuals,
  onStateClick,
  onStateEnter,
  onStateLeave,
}) => {
  return (
    <g
      key={`highlight-topografico-${activeElevatedStateId}`}
      className={`camada-realce-topografico estado-focado-${activeElevatedStateId.toLowerCase()} pointer-events-auto`}
    >
      {/* Sombra de Relevo Direcional Sutil Integrada à Placa */}
      <path
        d={activePathD}
        filter="url(#stateReliefShadow)"
        fill="none"
        stroke="#010409"
        strokeWidth={activeVisuals.strokeWidth + 2.5}
        strokeOpacity={0.8}
        className="sombra-relevo-placa pointer-events-none"
      />

      {/* Polígono Superior de Alta Definição */}
      <g
        className="face-estado-focado cursor-pointer pointer-events-auto"
        onClick={(e) => onStateClick(activeElevatedStateId, e)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseEnter={() => onStateEnter(activeElevatedStateId)}
        onMouseLeave={() => onStateLeave(activeElevatedStateId)}
      >
        <path
          id={`state-path-highlight-${activeElevatedStateId}`}
          d={activePathD}
          fill={activeVisuals.stateFill}
          fillOpacity={Math.min(1.0, activeVisuals.stateFillOpacity + 0.15)}
          stroke={activeVisuals.strokeColor}
          strokeWidth={activeVisuals.strokeWidth + 1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="poligono-estado-realcado"
        />

        {/* Traço Fino de Bisel Superior com Luz Zenital Nítida */}
        <path
          d={activePathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity={0.75}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="bisel-brilho-topo pointer-events-none"
        />
      </g>
    </g>
  );
};
