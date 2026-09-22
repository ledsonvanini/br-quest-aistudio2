import React, { useState, useRef } from 'react';
import { GeopoliticaMetricKey, StateGeopoliticsProfile } from '../../../types/geopolitica';
import { GeopoliticsMetricTooltip } from './GeopoliticsMetricTooltip';
import { audioEngine } from '../../../lib/audioSynth';

interface GeopoliticsPulsingBeaconProps {
  stateId: string;
  profile: StateGeopoliticsProfile;
  activeMetric: GeopoliticaMetricKey;
  projX: number;
  projY: number;
  isHovered: boolean;
  isSelected: boolean;
  onSelectState: (stateId: string) => void;
  onHoverState?: (stateId: string | null) => void;
}

export const GeopoliticsPulsingBeacon: React.FC<GeopoliticsPulsingBeaconProps> = ({
  stateId,
  profile,
  activeMetric,
  projX,
  projY,
  isHovered,
  isSelected,
  onSelectState,
  onHoverState,
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeHover = isHovered || internalHover;

  // Cor temática baseada na métrica
  const getMetricColor = (): string => {
    switch (activeMetric) {
      case 'densidade':
        return profile.demografia.densidadeHabKm2 > 100 ? '#f43f5e' : '#38bdf8';
      case 'miscigenacao':
        return '#f59e0b';
      case 'genero':
        return '#ec4899';
      case 'natalidade':
        return '#06b6d4';
      case 'mortalidade':
        return '#ef4444';
      case 'analfabetismo':
        return '#10b981';
      case 'partidos':
        return '#a855f7';
      default:
        return '#38bdf8';
    }
  };

  const metricColor = getMetricColor();

  // Posicionamento inteligente do tooltip flutuante
  const isNearTop = projY < 380;
  const isNearBottom = projY > 980;
  const isNearRight = projX > 1550;
  const isNearLeft = projX < 750;

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 9999,
    pointerEvents: 'auto',
  };

  if (isNearTop) {
    tooltipStyle.top = '100%';
    tooltipStyle.marginTop = '22px';
  } else {
    tooltipStyle.bottom = '100%';
    tooltipStyle.marginBottom = '22px';
  }

  if (isNearRight) {
    tooltipStyle.right = '0px';
    tooltipStyle.left = 'auto';
  } else if (isNearLeft) {
    tooltipStyle.left = '0px';
    tooltipStyle.right = 'auto';
  } else {
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translateX(-50%)';
  }

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setInternalHover(true);
    onHoverState?.(stateId);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setInternalHover(false);
      onHoverState?.(null);
    }, 120);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playSfx('click');
    onSelectState(stateId);
  };

  return (
    <div
      id={`pin-geopolitica-${stateId}`}
      className="container-pin-mapa-geopolitica absolute pointer-events-auto select-none"
      style={{
        position: 'absolute',
        left: `${projX}px`,
        top: `${projY}px`,
        width: '0px',
        height: '0px',
        transformStyle: 'preserve-3d',
        zIndex: activeHover || isSelected ? 90 : 35,
      }}
    >
      <div
        className={`absolute flex flex-col items-center cursor-pointer will-change-transform ${
          activeHover || isSelected ? 'scale-115 z-40' : 'scale-100 hover:scale-110'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label={`Geopolítica ${profile.stateName} (${stateId})`}
      >
        {/* 0. Área de Toque Invisível Generosa (Hitbox) */}
        <div className="absolute -inset-4 rounded-full pointer-events-auto cursor-pointer" />

        {/* 1. Anel Pulsante Cartográfico */}
        <div
          className="absolute w-12 h-12 rounded-full animate-ping pointer-events-none -z-10"
          style={{ backgroundColor: `${metricColor}44`, animationDuration: '2.4s' }}
        />

        {/* 2. Badge Circular Elegante e Nítida de Ponto de Pulso */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 shadow-xl backdrop-blur-md transition-all duration-200"
          style={{
            backgroundColor: '#020617',
            borderColor: activeHover || isSelected ? '#ffffff' : metricColor,
            boxShadow: `0 0 16px ${metricColor}88`,
          }}
        >
          {/* Ponto Central Iluminado */}
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: metricColor }}
          />
          {/* Sigla da UF em Alto Contraste (14px, Nítido) */}
          <span className="text-[13.5px] font-mono font-black text-white leading-none tracking-wider">
            {stateId}
          </span>
        </div>
      </div>
    </div>
  );
};
