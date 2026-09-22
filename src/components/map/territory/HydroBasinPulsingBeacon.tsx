// src/components/map/territory/HydroBasinPulsingBeacon.tsx
// Ponto de Pulso Interativo de Bacias Hidrográficas da ANA com Escala Ampliada e Tooltip de Tela

import React from 'react';
import { HydroRegionInfo } from '../../../data/cartography/hydroRegionsData';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { Droplets, Maximize2, Users, Compass } from 'lucide-react';

interface HydroBasinPulsingBeaconProps {
  region: HydroRegionInfo;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onSelect: (region: HydroRegionInfo) => void;
  onHover: (regionId: string | null) => void;
}

export const HydroBasinPulsingBeacon: React.FC<HydroBasinPulsingBeaconProps> = ({
  region,
  isSelected,
  isDimmed,
  onSelect,
  onHover,
}) => {
  const { showBeaconTooltip, updateBeaconPos, hideBeaconTooltip } = useBeaconHover();

  const badgeWidth = region.shortName.length * 12.0 + 32;

  const basinMetrics = [
    {
      label: 'Área da Bacia',
      value: `${(region.areaKm2 / 1000).toLocaleString('pt-BR')} mil km²`,
      icon: <Maximize2 className="w-4 h-4 text-sky-400 shrink-0" />,
      colorClass: 'text-sky-400',
    },
    {
      label: 'Vazão Média',
      value: `${region.dischargeM3s.toLocaleString('pt-BR')} m³/s`,
      icon: <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />,
      colorClass: 'text-cyan-400',
    },
    {
      label: 'População',
      value: region.populationServed,
      icon: <Users className="w-4 h-4 text-blue-400 shrink-0" />,
      colorClass: 'text-blue-400',
    },
    {
      label: 'Balanço Hídrico',
      value: isSelected ? 'Foco Ativo' : 'Clique p/ Isolar',
      icon: <Compass className="w-4 h-4 text-emerald-400 shrink-0" />,
      colorClass: 'text-emerald-400',
    },
  ];

  const payload = {
    tag: 'BACIA ANA',
    tagColor: region.color,
    tagBg: `${region.color}25`,
    title: region.name,
    borderColor: isSelected ? '#ffffff' : region.color,
    subtitle: 'Região Hidrográfica Nacional • ANA HidroWeb',
    topBadge: {
      label: `${region.areaPercentageBr}% BR`,
      icon: <Droplets className="w-3.5 h-3.5 text-cyan-400" />,
    },
    metrics: basinMetrics,
    lines: [
      `Bacia estratégica com descarga de ${region.dischargeM3s.toLocaleString('pt-BR')} m³/s atendendo a ${region.populationServed}, monitorada pelo Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH).`,
    ],
    footerSource: 'ANA • SNIRH • HidroWeb',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    showBeaconTooltip(payload, e);
    onHover(region.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateBeaconPos(e);
  };

  const handleMouseLeave = () => {
    hideBeaconTooltip();
    onHover(null);
  };

  return (
    <g
      transform={`translate(${region.labelPos.x}, ${region.labelPos.y})`}
      className={`marcador-bacia-pulso cursor-pointer group transition-opacity duration-300 pointer-events-auto ${
        isDimmed ? 'opacity-35 hover:opacity-100' : 'opacity-100'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(region);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 0. Área de Toque Invisível Generosa e Centralizada (Hitbox de 108px) */}
      <circle cx={0} cy={0} r={54} fill="transparent" className="cursor-pointer pointer-events-auto" />

      {/* 1. Anel Pulsante Cartográfico Ampliado */}
      <circle
        cx={0}
        cy={0}
        r={46}
        fill={region.color}
        fillOpacity="0.28"
        className="animate-ping pointer-events-none"
        style={{ animationDuration: '2.5s' }}
      />
      <circle
        cx={0}
        cy={0}
        r={36}
        fill="none"
        stroke={region.color}
        strokeWidth={2.4}
        strokeOpacity={0.6}
        strokeDasharray="6 6"
        className="animate-spin pointer-events-none"
        style={{ animationDuration: '16s' }}
      />

      {/* 2. Ponto Central Sólido (Raio 22, Diâmetro 44) */}
      <circle
        cx={0}
        cy={0}
        r={22}
        fill="#020d1a"
        stroke={isSelected ? '#ffffff' : region.color}
        strokeWidth={isSelected ? 4.0 : 3.4}
        className="transition-transform duration-200 group-hover:scale-115"
        style={{ filter: `drop-shadow(0 0 16px ${region.color})` }}
      />
      <circle cx={0} cy={0} r={8.5} fill={region.color} className="pointer-events-none" />

      {/* 3. Tag Curta Sempre Visível e Interativa (18px, Legibilidade Total) */}
      <g
        transform="translate(26, -8)"
        className="pointer-events-auto cursor-pointer select-none transition-transform duration-150 group-hover:scale-105"
      >
        <rect
          x={0}
          y={-19}
          width={badgeWidth}
          height={38}
          rx={9}
          fill="#020d1a"
          fillOpacity={0.96}
          stroke={region.color}
          strokeWidth={1.8}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.92))' }}
        />
        <text
          x={16}
          y={7}
          fill="#f8fafc"
          fontSize={18}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="bold"
          letterSpacing="0.04em"
        >
          {region.shortName}
        </text>
      </g>
    </g>
  );
};
