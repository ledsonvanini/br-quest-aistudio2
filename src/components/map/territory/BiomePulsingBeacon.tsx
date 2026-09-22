// src/components/map/territory/BiomePulsingBeacon.tsx
// Ponto de Pulso Interativo de Biomas com Escala Ampliada e Tooltip de Tela Nativo 1:1

import React from 'react';
import { BiomeGeoFeature } from '../../../data/cartography/biomesData';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { Trees, Maximize2, Activity, Leaf } from 'lucide-react';

interface BiomePulsingBeaconProps {
  biome: BiomeGeoFeature;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onSelect: (biome: BiomeGeoFeature) => void;
  onHover: (biomeId: string | null) => void;
}

export const BiomePulsingBeacon: React.FC<BiomePulsingBeaconProps> = ({
  biome,
  isSelected,
  isDimmed,
  onSelect,
  onHover,
}) => {
  const { showBeaconTooltip, updateBeaconPos, hideBeaconTooltip } = useBeaconHover();

  const displayName = biome.shortName || biome.name;
  const badgeWidth = displayName.length * 12.0 + 32;

  const biomeMetrics = [
    {
      label: 'Área Territorial',
      value: `${(biome.areaKm2 / 1000).toLocaleString('pt-BR')} mil km²`,
      icon: <Maximize2 className="w-4 h-4 text-emerald-400 shrink-0" />,
      colorClass: 'text-emerald-400',
    },
    {
      label: 'Cobertura Nacional',
      value: `${biome.percentageBr}% do Brasil`,
      icon: <Trees className="w-4 h-4 text-teal-400 shrink-0" />,
      colorClass: 'text-teal-400',
    },
    {
      label: 'Estado de Foco',
      value: isSelected ? 'Foco Ativo' : 'Clique p/ Isolar',
      icon: <Activity className="w-4 h-4 text-cyan-400 shrink-0" />,
      colorClass: 'text-cyan-400',
    },
    {
      label: 'Fitofisionomia',
      value: 'Fauna e Flora IBGE',
      icon: <Leaf className="w-4 h-4 text-amber-400 shrink-0" />,
      colorClass: 'text-amber-400',
    },
  ];

  const payload = {
    tag: 'BIOMA IBGE',
    tagColor: biome.color,
    tagBg: `${biome.color}25`,
    title: biome.name,
    borderColor: isSelected ? '#ffffff' : biome.color,
    subtitle: 'Bioma Continental Brasileiro • IBGE / MMA',
    topBadge: {
      label: `${biome.percentageBr}% BR`,
      icon: <Trees className="w-3.5 h-3.5 text-emerald-400" />,
    },
    metrics: biomeMetrics,
    lines: [
      `Bioma continental representativo cobrindo ${(biome.areaKm2 / 1000).toLocaleString('pt-BR')} mil km² do território brasileiro, regulado pelo ICMBio e mapeado pelo IBGE.`,
    ],
    footerSource: 'IBGE • MMA • MapBiomas',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    showBeaconTooltip(payload, e);
    onHover(biome.id);
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
      transform={`translate(${biome.centerPos.x}, ${biome.centerPos.y})`}
      className={`marcador-bioma-pulso cursor-pointer group transition-opacity duration-300 pointer-events-auto ${
        isDimmed ? 'opacity-35 hover:opacity-100' : 'opacity-100'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(biome);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 0. Área de Toque Invisível Generosa e Centralizada (Hitbox de 108px) */}
      <circle cx={0} cy={0} r={54} fill="transparent" className="cursor-pointer pointer-events-auto" />

      {/* 1. Anéis Pulsantes Cartográficos Ampliados */}
      <circle
        cx={0}
        cy={0}
        r={46}
        fill={biome.color}
        fillOpacity="0.28"
        className="animate-ping pointer-events-none"
        style={{ animationDuration: '2.5s' }}
      />
      <circle
        cx={0}
        cy={0}
        r={36}
        fill="none"
        stroke={biome.color}
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
        stroke={isSelected ? '#ffffff' : biome.color}
        strokeWidth={isSelected ? 4.0 : 3.4}
        className="transition-transform duration-200 group-hover:scale-115"
        style={{ filter: `drop-shadow(0 0 16px ${biome.color})` }}
      />
      <circle cx={0} cy={0} r={8.5} fill={biome.color} className="pointer-events-none" />

      {/* 3. Tag Sempre Visível Ampla (18px, Legibilidade Total no Mapa Completo) */}
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
          stroke={biome.color}
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
          {displayName}
        </text>
      </g>
    </g>
  );
};
