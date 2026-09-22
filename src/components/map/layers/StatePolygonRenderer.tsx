import React from 'react';
import { StateVisualProperties } from '../stateStyling/stateFillStyler';
import { MapVisualStyle } from '../../../lib/mapColorScales';
import { CartographyLayerMode } from '../../../types/cartography';

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
  activeCartographyLayer?: CartographyLayerMode;
  texturePattern?: string | null;
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
  activeCartographyLayer,
  texturePattern,
  onStateEnter,
  onStateLeave,
  onStateClick,
  onStateContextMenu,
}) => {
  let effectiveFill = visuals.stateFill;
  let effectiveOpacity = visuals.stateFillOpacity;
  let effectiveStroke = visuals.strokeColor;
  let effectiveStrokeWidth = visuals.strokeWidth;

  const isCartographyActive = Boolean(activeCartographyLayer && activeCartographyLayer !== 'none');

  if (isCartographyActive) {
    // CAMADAS CARTOGRÁFICAS DE TERRITÓRIO (BACIAS, BIOMAS/RELEVO, ROTAS, CENSO):
    // Respeita as propriedades visuais calculadas para o subitem/agrupamento filtrado ou estado
    effectiveFill = visuals.stateFill;
    effectiveOpacity = visuals.stateFillOpacity;
    effectiveStroke = isSelected ? '#fef08a' : isHovered ? '#ffffff' : visuals.strokeColor;
    effectiveStrokeWidth = isSelected ? 3.6 : isHovered ? 2.6 : visuals.strokeWidth;
  } else if (activeIsolatedState) {
    if (stateId === activeIsolatedState) {
      effectiveFill = visuals.stateFill;
      effectiveOpacity = 1.0;
      effectiveStroke = '#fef08a';
      effectiveStrokeWidth = 3.6;
    } else {
      if (visualStyle === 'tiles') {
        effectiveFill = '#070b14';
        effectiveOpacity = 0.20;
        effectiveStroke = '#334155';
        effectiveStrokeWidth = 0.85;
      } else {
        effectiveFill = '#070b14';
        effectiveOpacity = 0.60;
        effectiveStroke = '#1e293b';
        effectiveStrokeWidth = 0.75;
      }
    }
  } else if (isRegionActive) {
    if (belongsToActiveRegion) {
      effectiveFill = regionColor;
      effectiveOpacity = isHovered ? 0.85 : 0.70;
      effectiveStroke = isSelected ? '#fef08a' : regionColor;
      effectiveStrokeWidth = isSelected ? 3.2 : 2.4;
    } else {
      effectiveFill = visualStyle === 'tiles' ? '#0b1626' : '#1e293b';
      effectiveOpacity = visualStyle === 'tiles' ? 0.20 : 0.40;
      effectiveStroke = '#334155';
      effectiveStrokeWidth = 1.0;
    }
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

  const finalStroke = isCartographyActive
    ? (isSelected ? '#fef08a' : isHovered ? '#ffffff' : visuals.strokeColor)
    : activeIsolatedState
    ? (stateId === activeIsolatedState ? '#fef08a' : '#1e293b')
    : isRegionActive && belongsToActiveRegion
    ? regionColor
    : isNeighborOfSelected
    ? '#38bdf8'
    : isHovered
    ? '#ffffff'
    : isSelected
    ? '#fef08a'
    : effectiveStroke;

  const finalStrokeWidth = isCartographyActive
    ? (isSelected ? 3.6 : isHovered ? 2.6 : visuals.strokeWidth)
    : activeIsolatedState
    ? (stateId === activeIsolatedState ? 3.6 : 0.75)
    : isRegionActive && belongsToActiveRegion
    ? 2.2
    : isNeighborOfSelected
    ? 2.0
    : effectiveStrokeWidth;

  const isInteractionDisabled = showNeighbors || (!isCartographyActive && activeIsolatedState && stateId !== activeIsolatedState);

  return (
    <g
      key={stateId}
      className={`grupo-estado-svg grupo-estado-${stateId.toLowerCase()} transition-all duration-200`}
      style={{
        opacity: isCartographyActive
          ? 1.0
          : activeIsolatedState
          ? 1.0
          : isRegionActive
          ? belongsToActiveRegion
            ? 1.0
            : 0.80
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

      {/* Shaders & Texturas Procedurais Vetoriais da Skill Ativa */}
      {texturePattern && (
        <path
          d={pathD}
          fill={texturePattern}
          stroke="none"
          className="textura-shader-procedural pointer-events-none transition-opacity duration-300"
        />
      )}

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
