// src/components/map/territory/LogisticCorridorBeacon.tsx
// Ponto circular e beacon pulsante para Portos e Nós Logísticos Estratégicos com Centralização Perfeita

import React from 'react';
import { IntegrationRouteDetail, PortCabotagePoint } from '../../../data/cartographyBasinsData';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { Truck, Train, Ship, Anchor, MapPin } from 'lucide-react';
import { audioEngine } from '../../../lib/audioSynth';

interface LogisticCorridorBeaconProps {
  porto?: PortCabotagePoint;
  routeNode?: { name: string; x: number; y: number; isPort?: boolean; route: IntegrationRouteDetail };
  onSelect?: () => void;
}

export const LogisticCorridorBeacon: React.FC<LogisticCorridorBeaconProps> = ({
  porto,
  routeNode,
  onSelect,
}) => {
  const { showBeaconTooltip, updateBeaconPos, hideBeaconTooltip } = useBeaconHover();

  const x = porto ? porto.x : routeNode?.x || 0;
  const y = porto ? porto.y : routeNode?.y || 0;
  const title = porto ? porto.name : routeNode?.name || '';
  const type = porto ? porto.type : routeNode?.route.type || 'rodoviaria';

  const getTypeColor = () => {
    if (porto) return '#38bdf8';
    switch (type) {
      case 'ferroviaria':
        return '#f59e0b';
      case 'fluvial_cabotagem':
        return '#06b6d4';
      case 'rodoviaria':
      default:
        return '#fbbf24';
    }
  };

  const color = getTypeColor();

  const getIcon = () => {
    if (porto) return <Anchor className="w-4 h-4 text-sky-400 shrink-0" />;
    switch (type) {
      case 'ferroviaria':
        return <Train className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'fluvial_cabotagem':
        return <Ship className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'rodoviaria':
      default:
        return <Truck className="w-4 h-4 text-yellow-400 shrink-0" />;
    }
  };

  const badgeWidth = title.length * 11.5 + 32;

  const nodeMetrics = porto
    ? [
        {
          label: 'Classificação',
          value: porto.type === 'porto_fluvial' ? 'Porto Fluvial' : 'Porto Marítimo',
          icon: <Anchor className="w-4 h-4 text-sky-400 shrink-0" />,
          colorClass: 'text-sky-400',
        },
        {
          label: 'Cargas Principais',
          value: porto.cargo,
          icon: <Ship className="w-4 h-4 text-cyan-400 shrink-0" />,
          colorClass: 'text-cyan-400',
        },
        {
          label: 'Localização / UF',
          value: `Estado ${porto.state}`,
          icon: <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />,
          colorClass: 'text-emerald-400',
        },
        {
          label: 'Intermodalidade',
          value: 'Cabotagem & Escoamento',
          icon: <Truck className="w-4 h-4 text-amber-400 shrink-0" />,
          colorClass: 'text-amber-400',
        },
      ]
    : [
        {
          label: 'Corredor',
          value: routeNode?.route.name || 'Eixo Logístico',
          icon: getIcon(),
          colorClass: 'text-amber-400',
        },
        {
          label: 'Extensão',
          value: routeNode?.route.lengthKm || 'Multimodal',
          icon: <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />,
          colorClass: 'text-cyan-400',
        },
        {
          label: 'Nó / Conexão',
          value: title,
          icon: <Anchor className="w-4 h-4 text-teal-400 shrink-0" />,
          colorClass: 'text-teal-400',
        },
        {
          label: 'Eixo Estratégico',
          value: routeNode?.route.typeLabel || 'Nacional',
          icon: <Truck className="w-4 h-4 text-emerald-400 shrink-0" />,
          colorClass: 'text-emerald-400',
        },
      ];

  const payload = {
    tag: porto ? 'PORTO ESTRATÉGICO' : routeNode?.route.typeLabel.toUpperCase() || 'CORREDOR',
    tagColor: color,
    tagBg: `${color}25`,
    title,
    borderColor: color,
    subtitle: porto ? `Terminal Hidroviário • ${porto.state}` : `Eixo ${routeNode?.route.name}`,
    topBadge: {
      label: porto ? porto.state : routeNode?.route.typeLabel || 'Logística',
      icon: getIcon(),
    },
    metrics: nodeMetrics,
    lines: [
      porto
        ? `Terminal portuário essencial para escoamento de safras e insumos (${porto.cargo}) interligando as rotas nacionais.`
        : routeNode?.route.description || 'Eixo logístico e integração nacional.',
    ],
    footerSource: 'DNIT • ANTT • ANTAQ',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    showBeaconTooltip(payload, e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateBeaconPos(e);
  };

  const handleMouseLeave = () => {
    hideBeaconTooltip();
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="marcador-no-logistico cursor-pointer select-none group pointer-events-auto"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        audioEngine.playSfx('click');
        onSelect?.();
      }}
    >
      {/* 0. Área de Toque Invisível Perfeitamente Centralizada (Hitbox de 100px) */}
      <circle cx={0} cy={0} r={50} fill="transparent" className="cursor-pointer pointer-events-auto" />

      {/* 1. Anéis Pulsantes Cartográficos Centralizados */}
      <circle
        cx={0}
        cy={0}
        r={42}
        fill="none"
        stroke={color}
        strokeWidth={2.0}
        strokeOpacity={0.6}
        className="animate-ping pointer-events-none"
        style={{ transformOrigin: '0px 0px', animationDuration: '2.5s' }}
      />
      <circle
        cx={0}
        cy={0}
        r={32}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeOpacity={0.5}
        strokeDasharray="5 5"
        className="animate-spin pointer-events-none"
        style={{ transformOrigin: '0px 0px', animationDuration: '14s' }}
      />

      {/* 2. Ponto Central com Borda de Precisão (Raio 20, Diâmetro 40) */}
      <circle
        cx={0}
        cy={0}
        r={20}
        fill="#020617"
        stroke={color}
        strokeWidth={3.2}
        className="transition-transform duration-200 group-hover:scale-115"
        style={{ filter: `drop-shadow(0 0 14px ${color})` }}
      />
      <circle cx={0} cy={0} r={7.5} fill={color} className="pointer-events-none" />

      {/* 3. Tag Curta Sempre Visível ao Lado do Ponto (17px, Legibilidade Total) */}
      {title && (
        <g
          transform="translate(24, -8)"
          className="pointer-events-auto cursor-pointer select-none transition-transform duration-150 group-hover:scale-105"
        >
          <rect
            x={0}
            y={-18}
            width={badgeWidth}
            height={36}
            rx={8}
            fill="#020617"
            fillOpacity={0.96}
            stroke={color}
            strokeWidth={1.6}
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.92))' }}
          />
          <text
            x={14}
            y={6}
            fill="#f8fafc"
            fontSize={17}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
            fontWeight="bold"
            letterSpacing="0.03em"
          >
            {title}
          </text>
        </g>
      )}
    </g>
  );
};
