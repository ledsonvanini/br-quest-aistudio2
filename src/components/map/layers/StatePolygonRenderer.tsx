import React from 'react';
import { StateVisualProperties } from '../stateStyling/stateFillStyler';
import { MapVisualStyle } from '../../../lib/mapColorScales';

export interface StatePolygonRendererProps {
  stateId: string;
  pathD: string;
  visuals: StateVisualProperties;
  isHovered: boolean;
  isSelected: boolean;
  isRegionActive: boolean;
  belongsToActiveRegion: boolean;
  regionColor: string;
  isNeighborOfSelected: boolean;
  activeIsolatedState: string | null;
  showNeighbors: boolean;
  isClimateActive: boolean;
  isGeopoliticaActive: boolean;
  visualStyle: MapVisualStyle;
  onStateEnter: (stateId: string) => void;
  onStateLeave: (stateId: string) => void;
  onStateClick: (stateId: string, e: React.MouseEvent) => void;
  onStateContextMenu?: (stateId: string, e: React.MouseEvent) => void;
}

export const StatePolygonRenderer: React.FC<StatePolygonRendererProps> = ({
  stateId,
  pathD,
  visuals,
  isHovered,
  isSelected,
  isRegionActive,
  belongsToActiveRegion,
  regionColor,
  isNeighborOfSelected,
  activeIsolatedState,
  showNeighbors,
  isClimateActive,
  isGeopoliticaActive,
  visualStyle,
  onStateEnter,
  onStateLeave,
  onStateClick,
  onStateContextMenu,
}) => {
  let effectiveFill = visuals.stateFill;
  let effectiveOpacity = visuals.stateFillOpacity;
  let effectiveStroke = visuals.strokeColor;
  let effectiveStrokeWidth = visuals.strokeWidth;

  if (activeIsolatedState) {
    effectiveFill = visuals.stateFill;
    effectiveOpacity = visuals.stateFillOpacity;
    effectiveStroke = visuals.strokeColor;
    effectiveStrokeWidth = visuals.strokeWidth;
  } else if (isRegionActive) {
    effectiveFill = regionColor;
    effectiveOpacity = belongsToActiveRegion ? (isHovered ? 0.75 : 0.60) : 0.18;
    effectiveStroke = belongsToActiveRegion ? regionColor : '#475569';
    effectiveStrokeWidth = belongsToActiveRegion ? 2.4 : 1.0;
  } else if (isClimateActive || isGeopoliticaActive) {
    effectiveFill = visuals.stateFill;
    effectiveOpacity = visuals.stateFillOpacity;
    effectiveStroke = isSelected ? '#fef08a' : isHovered ? '#ffffff' : visuals.strokeColor;
    effectiveStrokeWidth = visuals.strokeWidth;
  } else if (visualStyle !== 'tiles') {
    effectiveFill = visuals.stateFill;
    effectiveOpacity = isSelected ? 0.85 : isHovered ? 0.75 : 0.60;
    effectiveStroke = isSelected ? '#fef08a' : isHovered ? '#ffffff' : visuals.strokeColor;
    effectiveStrokeWidth = visuals.strokeWidth;
  } else {
    effectiveFill = isSelected ? '#fbbf24' : isHovered ? '#34d399' : 'transparent';
    effectiveOpacity = isSelected ? 0.40 : isHovered ? 0.30 : 0.0;
    effectiveStroke = isNeighborOfSelected
      ? '#38bdf8'
      : isHovered
      ? '#ffffff'
      : isSelected
      ? '#fef08a'
      : visuals.strokeColor;
    effectiveStrokeWidth = isSelected ? 3.0 : isHovered ? 2.4 : visuals.strokeWidth;
  }

  const finalStroke = activeIsolatedState
    ? visuals.strokeColor
    : isRegionActive && belongsToActiveRegion
    ? regionColor
    : isNeighborOfSelected
    ? '#38bdf8'
    : isHovered
    ? '#ffffff'
    : isSelected
    ? '#fef08a'
    : effectiveStroke;

  const finalStrokeWidth = activeIsolatedState
    ? visuals.strokeWidth
    : isRegionActive && belongsToActiveRegion
    ? 2.2
    : isNeighborOfSelected
    ? 2.0
    : effectiveStrokeWidth;

  const isInteractionDisabled = showNeighbors || (activeIsolatedState && stateId !== activeIsolatedState);

  return (
    <g
      key={stateId}
      className={`grupo-estado-svg grupo-estado-${stateId.toLowerCase()} transition-all duration-200`}
      style={{
        opacity: activeIsolatedState
          ? 1.0
          : isRegionActive
          ? belongsToActiveRegion
            ? 1.0
            : 0.20
          : showNeighbors && isNeighborOfSelected
          ? 1.0
          : showNeighbors
          ? 0.45
          : 1.0,
      }}
    >
      {/* High Contrast Dark Under-Stroke Layer */}
      <path
        d={pathD}
        fill="none"
        stroke="#000000"
        strokeWidth={visuals.strokeWidth + 1.8}
        strokeOpacity={0.95}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="understroke-contraste pointer-events-none"
      />

      {/* State Base Polygon */}
      <path
        id={`state-path-${stateId}`}
        d={pathD}
        fill={effectiveFill}
        fillOpacity={effectiveOpacity}
        stroke={finalStroke}
        strokeWidth={finalStrokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={`poligono-estado-interativo path-estado-${stateId.toLowerCase()} ${
          isInteractionDisabled ? 'cursor-default pointer-events-none' : 'cursor-pointer pointer-events-auto'
        } transition-all duration-150`}
        onMouseEnter={() => {
          if (!showNeighbors) onStateEnter(stateId);
        }}
        onMouseLeave={() => {
          if (!showNeighbors) onStateLeave(stateId);
        }}
        onClick={(e) => {
          if (!showNeighbors) onStateClick(stateId, e);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStateContextMenu?.(stateId, e);
        }}
      />

      {/* Expanded Hit Target for Small States */}
      <path
        d={pathD}
        fill="transparent"
        stroke="transparent"
        strokeWidth={18}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={`hit-target-estado-expandido ${
          isInteractionDisabled ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
        }`}
        onMouseEnter={() => {
          if (!showNeighbors) onStateEnter(stateId);
        }}
        onMouseLeave={() => {
          if (!showNeighbors) onStateLeave(stateId);
        }}
        onClick={(e) => {
          if (!showNeighbors) onStateClick(stateId, e);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStateContextMenu?.(stateId, e);
        }}
      />
    </g>
  );
};
