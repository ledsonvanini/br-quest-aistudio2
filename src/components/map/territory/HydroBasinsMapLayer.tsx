// src/components/map/territory/HydroBasinsMapLayer.tsx
// Camada Cartográfica das Bacias Hidrográficas da ANA com Beacons e Pinos Integrados ao Tooltip de Tela

import React from 'react';
import { BRAZIL_HYDRO_REGIONS, HydroRegionInfo } from '../../../data/cartography/hydroRegionsData';
import { HYDRO_RIVER_NETWORK, MAJOR_HYDRO_PINS, HydroFeaturePin } from '../../../data/cartography/hydroRiverNetworkData';
import { STATE_PRIMARY_BASIN } from '../../../data/cartography/territoryAnchors';
import { HydroBasinPulsingBeacon } from './HydroBasinPulsingBeacon';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { Zap, Droplets, MapPin, Activity } from 'lucide-react';

interface HydroBasinsMapLayerProps {
  selectedRegionId?: string | null;
  hoveredRegionId?: string | null;
  selectedStateId?: string | null;
  onSelectRegion?: (region: HydroRegionInfo) => void;
  onHoverRegion?: (regionId: string | null) => void;
  onSelectPin?: (pin: HydroFeaturePin) => void;
  onSelectState?: (stateId: string) => void;
}

const HYDRO_REGION_PRIMARY_STATE: Record<string, string> = {
  amazonica: 'AM',
  tocantins_araguaia: 'TO',
  sao_francisco: 'BA',
  parana: 'SP',
  paraguai: 'MS',
  uruguai: 'RS',
  parnaiba: 'PI',
  atlantico_nordeste_oriental: 'PE',
  atlantico_nordeste_ocidental: 'MA',
  atlantico_leste: 'MG',
  atlantico_sudeste: 'RJ',
  atlantico_sul: 'SC',
};

const ESTUARY_MOUTHS = [
  { id: 'foz-amazonas', name: 'Foz do Rio Amazonas / Canal do Norte', x: 1330, y: 310, color: '#38bdf8' },
  { id: 'foz-sao-francisco', name: 'Foz do Rio São Francisco (AL/SE)', x: 1720, y: 640, color: '#22c55e' },
  { id: 'foz-tocantins', name: 'Foz do Rio Tocantins / Baía de Marajó', x: 1350, y: 335, color: '#eab308' },
];

export const HydroBasinsMapLayer: React.FC<HydroBasinsMapLayerProps> = ({
  selectedRegionId,
  hoveredRegionId,
  selectedStateId,
  onSelectRegion,
  onHoverRegion,
  onSelectPin,
  onSelectState,
}) => {
  const { showBeaconTooltip, updateBeaconPos, hideBeaconTooltip } = useBeaconHover();

  const handleRegionInteraction = (region: HydroRegionInfo) => {
    onSelectRegion?.(region);
    const targetState = HYDRO_REGION_PRIMARY_STATE[region.id];
    if (targetState && onSelectState) {
      onSelectState(targetState);
    }
  };

  return (
    <g id="camada-hidrografia-ana" className="camada-hidrografia-ana pointer-events-auto">
      {/* 1. REDE VASCULAR DE RIOS COM GRADIENTE E ESPESSURA HIERÁRQUICA */}
      <g id="grupo-rios-ana" className="grupo-rios-ana pointer-events-none">
        {HYDRO_RIVER_NETWORK.map((river) => {
          const isSelected = selectedRegionId === river.regionId;
          const isHovered = hoveredRegionId === river.regionId;
          const hasAnySelection = Boolean(selectedRegionId);
          const isDimmed = hasAnySelection && !isSelected;

          const strokeWidth = river.strokeWidth * (isSelected ? 1.5 : isHovered ? 1.25 : 1.0);
          const opacity = isDimmed ? river.opacity * 0.35 : isSelected ? 1.0 : river.opacity;

          return (
            <path
              key={river.id}
              d={river.d}
              fill="none"
              stroke={isSelected ? '#38bdf8' : river.color}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          );
        })}
      </g>

      {/* 2. FOZES E DELTAS COSTEIROS */}
      {!selectedRegionId && (
        <g id="grupo-fozes-deltas" className="grupo-fozes-deltas pointer-events-none">
          {ESTUARY_MOUTHS.map((mouth) => (
            <g key={mouth.id} transform={`translate(${mouth.x}, ${mouth.y})`}>
              <circle r="22" fill={mouth.color} fillOpacity="0.20" className="animate-ping" />
              <circle r="9" fill={mouth.color} fillOpacity="0.8" stroke="#ffffff" strokeWidth="1.8" />
            </g>
          ))}
        </g>
      )}

      {/* 3. PONTOS CIRCULARES COM EFEITO DE PULSO (ANA) */}
      <g id="grupo-beacons-bacias-mapa" className="grupo-beacons-bacias-mapa pointer-events-auto select-none">
        {BRAZIL_HYDRO_REGIONS.map((region) => {
          const activeBasinId = selectedRegionId || (selectedStateId ? STATE_PRIMARY_BASIN[selectedStateId] : null);
          if (activeBasinId && region.id !== activeBasinId) return null;

          const isSelected = selectedRegionId === region.id;
          const isHovered = hoveredRegionId === region.id;
          const hasAnySelection = Boolean(selectedRegionId);
          const isDimmed = hasAnySelection && !isSelected;

          return (
            <HydroBasinPulsingBeacon
              key={`basin-beacon-${region.id}`}
              region={region}
              isSelected={isSelected}
              isHovered={isHovered}
              isDimmed={isDimmed}
              onSelect={handleRegionInteraction}
              onHover={(id) => onHoverRegion?.(id)}
            />
          );
        })}
      </g>

      {/* 4. PINOS DAS GRANDES USINAS HIDRELÉTRICAS E CATARATAS COM TOOLTIP UNIFICADO */}
      <g id="grupo-pinos-usinas-hidreletricas" className="grupo-pinos-usinas-hidreletricas pointer-events-auto">
        {MAJOR_HYDRO_PINS.map((pin) => {
          if (selectedStateId && pin.state !== selectedStateId) return null;
          const pinColor = pin.type === 'dam' ? '#eab308' : pin.type === 'waterfall' ? '#06b6d4' : '#10b981';
          const badgeWidth = pin.name.length * 10.5 + 28;

          const pinPayload = {
            tag: pin.type === 'dam' ? 'USINA HIDRELÉTRICA' : pin.type === 'waterfall' ? 'CATARATA NATURAL' : 'CONFLUÊNCIA',
            tagColor: pinColor,
            tagBg: `${pinColor}25`,
            title: pin.name,
            borderColor: pinColor,
            subtitle: `${pin.river} • Estado ${pin.state || 'Brasil'}`,
            topBadge: {
              label: pin.capacity || 'Referência ANA',
              icon: pin.type === 'dam' ? <Zap className="w-3.5 h-3.5 text-amber-400" /> : <Droplets className="w-3.5 h-3.5 text-cyan-400" />,
            },
            metrics: [
              {
                label: 'Curso Hídrico',
                value: pin.river,
                icon: <Droplets className="w-4 h-4 text-sky-400 shrink-0" />,
                colorClass: 'text-sky-400',
              },
              {
                label: 'Capacidade / Porte',
                value: pin.capacity || 'Vazão Natural',
                icon: <Zap className="w-4 h-4 text-amber-400 shrink-0" />,
                colorClass: 'text-amber-400',
              },
              {
                label: 'Localização / UF',
                value: `Estado ${pin.state || 'BR'}`,
                icon: <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />,
                colorClass: 'text-emerald-400',
              },
              {
                label: 'Status SNIRH',
                value: 'Operação Ativa',
                icon: <Activity className="w-4 h-4 text-cyan-400 shrink-0" />,
                colorClass: 'text-cyan-400',
              },
            ],
            lines: [pin.curiosity || 'Ponto de interesse hídrico cadastrado na base da Agência Nacional de Águas (ANA).'],
            footerSource: 'ANA • ONS • SNIRH',
          };

          return (
            <g
              key={pin.id}
              transform={`translate(${pin.x}, ${pin.y})`}
              className="cursor-pointer group pointer-events-auto"
              onClick={() => onSelectPin?.(pin)}
              onMouseEnter={(e) => showBeaconTooltip(pinPayload, e)}
              onMouseMove={(e) => updateBeaconPos(e)}
              onMouseLeave={hideBeaconTooltip}
            >
              {/* Hitbox Generosa e Centralizada (Raio 48, Diâmetro 96) */}
              <circle r="48" fill="transparent" className="cursor-pointer pointer-events-auto" />

              <circle r="36" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.8" className="animate-ping pointer-events-none" />
              <circle
                r="18"
                fill={pinColor}
                stroke="#ffffff"
                strokeWidth="3.2"
                className="group-hover:scale-120 transition-transform origin-center"
                style={{ filter: `drop-shadow(0 0 14px ${pinColor})` }}
              />
              <circle r="6.5" fill="#020617" className="pointer-events-none" />

              <g className="pointer-events-auto cursor-pointer transition-transform group-hover:scale-105" transform="translate(22, -10)">
                <rect
                  x="0"
                  y="-16"
                  width={badgeWidth}
                  height="34"
                  rx="7"
                  fill="#020617"
                  fillOpacity="0.96"
                  stroke={pinColor}
                  strokeWidth="1.6"
                  style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.92))' }}
                />
                <text x="12" y="6" fill="#f8fafc" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">
                  {pin.name}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
