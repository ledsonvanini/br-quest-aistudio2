import React from 'react';
import { BRAZIL_HYDRO_REGIONS, HydroRegionInfo } from '../../../data/cartography/hydroRegionsData';
import { HYDRO_RIVER_NETWORK, MAJOR_HYDRO_PINS, HydroFeaturePin } from '../../../data/cartography/hydroRiverNetworkData';
import { STATE_PRIMARY_BASIN } from '../../../data/cartography/territoryAnchors';

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

// Pontos de deságue oceânico (Foz dos Grandes Rios) com pulso estuarino
const ESTUARY_MOUTHS = [
  { id: 'foz-amazonas', name: 'Foz do Rio Amazonas / Canal do Norte', x: 1330, y: 310, color: '#38bdf8' },
  { id: 'foz-sao-francisco', name: 'Foz do Rio São Francisco (AL/SE)', x: 1720, y: 640, color: '#22c55e' },
  { id: 'foz-tocantins', name: 'Foz do Rio Tocantins / Baía de Marajó', x: 1350, y: 335, color: '#eab308' },
  { id: 'foz-parnaiba', name: 'Delta das Américas (Rio Parnaíba)', x: 1530, y: 440, color: '#06b6d4' },
];

/**
 * HydroBasinsMapLayer
 * Projeção da Rede Hidrográfica do Brasil baseada no padrão ANA (HidroWeb).
 * Inclui delimitações orográficas, veios dendríticos fluidos com animação vetorial,
 * pulsos estuarinos e integração direta ao AppLateral ao clicar.
 */
export const HydroBasinsMapLayer: React.FC<HydroBasinsMapLayerProps> = ({
  selectedRegionId,
  hoveredRegionId,
  selectedStateId,
  onSelectRegion,
  onHoverRegion,
  onSelectPin,
  onSelectState,
}) => {
  const handleRegionInteraction = (region: HydroRegionInfo) => {
    onSelectRegion?.(region);
  };

  return (
    <g id="camada-hidrografia-viva" className="camada-hidrografia-viva pointer-events-auto">
      <defs>
        <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="deepHydroGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5.0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes hydroStreamFlow {
              from { stroke-dashoffset: 60; }
              to { stroke-dashoffset: 0; }
            }
            .linha-veio-fluvial-animado {
              stroke-dasharray: 10 6;
              animation: hydroStreamFlow 3.5s linear infinite;
            }
          `}
        </style>
      </defs>

      {/* 1. REDE DENDRÍTICA DE RIOS E VEIOS FLUVIAIS COM FLUXO VETORIAL DINÂMICO */}
      <g id="grupo-veios-hidrograficos-dendriticos" className="grupo-veios-hidrograficos-dendriticos pointer-events-none">
        {HYDRO_RIVER_NETWORK.map((river) => {
          const activeBasinId = selectedRegionId || (selectedStateId ? STATE_PRIMARY_BASIN[selectedStateId] : null);
          const isRegionSelected = activeBasinId === river.regionId;
          const isRegionHovered = hoveredRegionId === river.regionId;
          const isDimmed = (activeBasinId && !isRegionSelected) || (hoveredRegionId && !isRegionHovered && !activeBasinId);

          // Ao isolar um estado ou bacia, esconde completamente os veios das outras bacias ao redor
          if (activeBasinId && !isRegionSelected) {
            return null;
          }

          const opacity = isDimmed ? river.opacity * 0.25 : isRegionSelected ? 1.0 : river.opacity;
          const strokeWidth = isRegionSelected ? river.strokeWidth * 1.35 : river.strokeWidth;

          return (
            <React.Fragment key={river.id}>
              {/* Leito base do rio */}
              <path
                d={river.d}
                fill="none"
                stroke={river.color}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={river.isMainTrunk ? 'url(#riverGlow)' : undefined}
                className="transicao-veio-fluvial transition-opacity duration-300"
              />
              {/* Fluxo vetorial animado para leitos mestres (efeito correnteza) */}
              {river.isMainTrunk && (
                <path
                  d={river.d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={Math.max(1.2, strokeWidth * 0.45)}
                  strokeOpacity={isDimmed ? 0.15 : 0.75}
                  strokeLinecap="round"
                  className="linha-veio-fluvial-animado"
                />
              )}
            </React.Fragment>
          );
        })}
      </g>

      {/* 2. PULSOS ESTUARINOS NA FOZ DOS GRANDES RIOS NO OCEANO ATLÂNTICO */}
      {!selectedStateId && (
        <g id="grupo-estuarios-foz-rios" className="grupo-estuarios-foz-rios pointer-events-none">
          {ESTUARY_MOUTHS.map((mouth) => (
            <g key={mouth.id} transform={`translate(${mouth.x}, ${mouth.y})`}>
              <circle r="12" fill={mouth.color} fillOpacity="0.2" className="animate-ping" />
              <circle r="5" fill={mouth.color} fillOpacity="0.8" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          ))}
        </g>
      )}

      {/* 3. BALÕES E LEGENDAS CARTOGRÁFICAS DAS 12 BACIAS HIDROGRÁFICAS (ANA) - PROPORÇÃO 4x2 */}
      <g id="grupo-titulos-bacias-mapa" className="grupo-titulos-bacias-mapa pointer-events-auto select-none">
        {BRAZIL_HYDRO_REGIONS.map((region) => {
          // Ao isolar um estado ou bacia, esconde os balões de todas as outras bacias ao redor
          const activeBasinId = selectedRegionId || (selectedStateId ? STATE_PRIMARY_BASIN[selectedStateId] : null);
          if (activeBasinId && region.id !== activeBasinId) return null;

          const isSelected = selectedRegionId === region.id;
          const isHovered = hoveredRegionId === region.id;
          const hasAnySelection = Boolean(selectedRegionId);
          const isDimmed = hasAnySelection && !isSelected;

          // Proporção matemática 4x2 (2:1): 184px de largura por 92px de altura
          const badgeWidth = 184;
          const badgeHeight = 92;
          const halfWidth = badgeWidth / 2;
          const halfHeight = badgeHeight / 2;

          return (
            <g
              key={`label-${region.id}`}
              id={`bolha-bacia-${region.id}`}
              transform={`translate(${region.labelPos.x}, ${region.labelPos.y})`}
              className={`bolha-legenda-bacia card-bolha-bacia transition-all duration-300 cursor-pointer ${
                isDimmed ? 'opacity-40 hover:opacity-90' : 'opacity-100'
              }`}
              onClick={() => handleRegionInteraction(region)}
              onMouseEnter={() => onHoverRegion?.(region.id)}
              onMouseLeave={() => onHoverRegion?.(null)}
            >
              {/* Sombra de Profundidade */}
              <rect
                x={-halfWidth + 2}
                y={-halfHeight + 3}
                width={badgeWidth}
                height={badgeHeight}
                rx="12"
                fill="rgba(0,0,0,0.75)"
                className="pointer-events-none"
              />

              {/* Corpo Principal do Balão de Dados (Proporção 4x2) */}
              <rect
                x={-halfWidth}
                y={-halfHeight}
                width={badgeWidth}
                height={badgeHeight}
                rx="12"
                fill="#030d1a"
                fillOpacity={0.96}
                stroke={isSelected ? '#ffffff' : region.color}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2.0 : 1.4}
                filter={isSelected || isHovered ? `drop-shadow(0 0 14px ${region.color})` : undefined}
                className="transition-all duration-200"
              />

              {/* Cabeçalho: Tag ANA e % Territorial */}
              <circle cx={-halfWidth + 14} cy={-halfHeight + 16} r="3.5" fill={region.color} />
              <text
                x={-halfWidth + 24}
                y={-halfHeight + 19}
                fill="#94a3b8"
                fontSize="8.5"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                BACIA ANA
              </text>
              <text
                x={halfWidth - 12}
                y={-halfHeight + 20}
                textAnchor="end"
                fill={region.color}
                fontSize="11"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="800"
              >
                {region.areaPercentageBr}% do BR
              </text>

              {/* Linha Divisória Fina */}
              <line
                x1={-halfWidth + 12}
                y1={-halfHeight + 27}
                x2={halfWidth - 12}
                y2={-halfHeight + 27}
                stroke={region.color}
                strokeOpacity="0.25"
                strokeWidth="1"
              />

              {/* Título da Bacia */}
              <text
                x={-halfWidth + 14}
                y={-halfHeight + 46}
                fill="#f8fafc"
                fontSize="13"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="700"
                letterSpacing="0.2px"
              >
                {region.name.length > 22 ? region.shortName : region.name.replace('Região Hidrográfica ', 'Bacia ')}
              </text>

              {/* Subtítulo: Vazão Média */}
              <text
                x={-halfWidth + 14}
                y={-halfHeight + 62}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="500"
              >
                Vazão: {region.dischargeM3s.toLocaleString('pt-BR')} m³/s
              </text>

              {/* Botão de Ação Inferior: Feedback de Isolamento da Região */}
              <rect
                x={-halfWidth + 12}
                y={-halfHeight + 70}
                width={badgeWidth - 24}
                height={15}
                rx="4"
                fill={isSelected ? region.color : 'rgba(255,255,255,0.06)'}
                fillOpacity={isSelected ? 0.28 : 1}
              />
              <text
                x={0}
                y={-halfHeight + 81}
                textAnchor="middle"
                fill={isSelected ? '#ffffff' : region.color}
                fontSize="8.5"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                {isSelected ? '✓ BACIA ISOLADA' : 'CLIQUE PARA ISOLAR'}
              </text>
            </g>
          );
        })}
      </g>

      {/* 5. PINOS DAS GRANDES USINAS HIDRELÉTRICAS E CATARATAS */}
      <g id="grupo-pinos-usinas-hidreletricas" className="grupo-pinos-usinas-hidreletricas pointer-events-auto">
        {MAJOR_HYDRO_PINS.map((pin) => {
          // Ao isolar um estado, esconde os pinos de usinas e cataratas que não pertençam a ele
          if (selectedStateId && pin.state !== selectedStateId) return null;

          return (
            <g
              key={pin.id}
              transform={`translate(${pin.x}, ${pin.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectPin?.(pin)}
            >
              <circle r="9" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" />
              <circle
                r="6.5"
                fill={pin.type === 'dam' ? '#eab308' : pin.type === 'waterfall' ? '#06b6d4' : '#10b981'}
                stroke="#ffffff"
                strokeWidth="2"
                className="shadow-md"
              />
              <circle r="2.5" fill="#0f172a" />
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" transform="translate(12, -8)">
                <rect x="0" y="-12" width="180" height="26" rx="6" fill="#020817" fillOpacity="0.95" stroke="#38bdf8" strokeWidth="1" />
                <text x="8" y="5" fill="#f8fafc" fontSize="10.5" fontWeight="bold">
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
