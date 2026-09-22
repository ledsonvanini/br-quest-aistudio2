import React from 'react';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import { BRAZIL_STATES_GEOPOLITICS } from '../../data/geopoliticaData';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { GeopoliticsPulsingBeacon } from './geopolitica/GeopoliticsPulsingBeacon';

interface GeopoliticsMapLayerProps {
  activeMetric: GeopoliticaMetricKey;
  selectedStateId?: string | null;
  onSelectState: (stateId: string) => void;
  onHoverState?: (stateId: string | null) => void;
  geoProjectFn: (coords: [number, number]) => [number, number] | null;
  is3D?: boolean;
  hoveredStateId?: string | null;
  centroids?: Record<string, [number, number]>;
  disableHoverTooltip?: boolean;
}

/**
 * GeopoliticsMapLayer
 * Camada de Censo e Geopolítica do Brasil (IBGE).
 * Substitui balões fixos invasivos por pontos circulares cartográficos com efeito de pulso,
 * ativando cards 4x2 legíveis exclusivamente onHover para preservar a visão do mapa.
 */
export const GeopoliticsMapLayer: React.FC<GeopoliticsMapLayerProps> = ({
  activeMetric,
  selectedStateId,
  onSelectState,
  onHoverState,
  geoProjectFn,
  hoveredStateId,
  centroids,
}) => {
  // Quando um estado estiver selecionado/focado, o AppLateral assume o protagonismo
  if (selectedStateId) return null;

  return (
    <div
      id="camada-pins-geopolitica"
      className="camada-pins-geopolitica absolute inset-0 pointer-events-none z-20"
      style={{
        width: MAP_CANVAS_WIDTH,
        height: MAP_CANVAS_HEIGHT,
        transformStyle: 'preserve-3d',
      }}
    >
      {Object.entries(BRAZIL_STATES_GEOPOLITICS).map(([stateId, profile]) => {
        const capitalInfo = STATE_CAPITAL_GEO_DATA[stateId];
        if (!capitalInfo) return null;

        const projected = centroids?.[stateId] || geoProjectFn([capitalInfo.lng, capitalInfo.lat]);
        if (!projected) return null;

        const [projX, projY] = projected;
        const isHovered = hoveredStateId === stateId;
        const isSelected = selectedStateId === stateId;

        return (
          <GeopoliticsPulsingBeacon
            key={`geopolitica-beacon-${stateId}`}
            stateId={stateId}
            profile={profile}
            activeMetric={activeMetric}
            projX={projX}
            projY={projY}
            isHovered={isHovered}
            isSelected={isSelected}
            onSelectState={onSelectState}
            onHoverState={onHoverState}
          />
        );
      })}
    </div>
  );
};
