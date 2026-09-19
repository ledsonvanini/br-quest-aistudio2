import React from 'react';
import { BRAZIL_OFFICIAL_BIOMES, BiomeGeoFeature } from '../../../data/cartography/biomesData';
import {
  BRAZIL_MAJOR_PEAKS,
  BRAZIL_NOTABLE_CHAPADAS,
  MOUNTAIN_RIDGES,
  ReliefPeak,
  ReliefChapada,
} from '../../../data/cartography/reliefPeaksData';
import { STATE_PRIMARY_BIOME } from '../../../data/cartography/territoryAnchors';

interface BiomesReliefMapLayerProps {
  selectedBiomeId?: string | null;
  hoveredBiomeId?: string | null;
  selectedStateId?: string | null;
  onSelectBiome?: (biome: BiomeGeoFeature) => void;
  onHoverBiome?: (biomeId: string | null) => void;
  onSelectPeak?: (peak: ReliefPeak) => void;
  onSelectChapada?: (chapada: ReliefChapada) => void;
  onSelectState?: (stateId: string) => void;
}

const BIOME_PRIMARY_STATE: Record<string, string> = {
  amazonia: 'AM',
  cerrado: 'GO',
  caatinga: 'BA',
  mata_atlantica: 'RJ',
  pantanal: 'MS',
  pampa: 'RS',
};

/**
 * BiomesReliefMapLayer
 * Cobertura oficial dos 6 Biomas do Brasil (IBGE) + Relevo Hipsométrico,
 * Picos Culminantes com cotas altimétricas e Chapadas estruturais.
 */
export const BiomesReliefMapLayer: React.FC<BiomesReliefMapLayerProps> = ({
  selectedBiomeId,
  hoveredBiomeId,
  selectedStateId,
  onSelectBiome,
  onHoverBiome,
  onSelectPeak,
  onSelectChapada,
  onSelectState,
}) => {
  return (
    <g id="camada-biomas-relevo-viva" className="camada-biomas-relevo-viva pointer-events-auto">
      <defs>
        <filter id="reliefGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Padrão de Hachura Hipsométrica de Relevo */}
        <pattern id="hachura-relevo-serra" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.12" />
        </pattern>
      </defs>

      {/* 1. LEGENDAS E BOLHAS DE IDENTIFICAÇÃO DOS 6 BIOMAS OFICIAIS (IBGE) - PROPORÇÃO 4x2 */}
      <g id="grupo-bolhas-biomas-ibge" className="grupo-bolhas-biomas-ibge pointer-events-auto">
        {BRAZIL_OFFICIAL_BIOMES.map((biome) => {
          // Quando um estado ou bioma está isolado, esconde todas as outras bolhas de identificação ao redor
          const activeBiomeId = selectedBiomeId || (selectedStateId ? STATE_PRIMARY_BIOME[selectedStateId] : null);
          if (activeBiomeId && biome.id !== activeBiomeId) return null;

          const isSelected = selectedBiomeId === biome.id;
          const isHovered = hoveredBiomeId === biome.id;
          const hasAnySelection = Boolean(selectedBiomeId);
          const isDimmed = hasAnySelection && !isSelected;

          // Proporção matemática 4x2 (2:1): 184px de largura por 92px de altura
          const badgeWidth = 184;
          const badgeHeight = 92;
          const halfWidth = badgeWidth / 2;
          const halfHeight = badgeHeight / 2;

          return (
            <g
              key={biome.id}
              id={`bolha-bioma-${biome.id}`}
              transform={`translate(${biome.centerPos.x}, ${biome.centerPos.y})`}
              className={`bolha-legenda-bioma card-bolha-bioma cursor-pointer select-none transition-all duration-300 ${
                isDimmed ? 'opacity-40 hover:opacity-90' : 'opacity-100'
              }`}
              onClick={() => {
                onSelectBiome?.(biome);
                onSelectState?.(BIOME_PRIMARY_STATE[biome.id] || 'GO');
              }}
              onMouseEnter={() => onHoverBiome?.(biome.id)}
              onMouseLeave={() => onHoverBiome?.(null)}
            >
              {/* Sombra de projeção cartográfica */}
              <rect
                x={-halfWidth + 2}
                y={-halfHeight + 3}
                width={badgeWidth}
                height={badgeHeight}
                rx="12"
                fill="rgba(0,0,0,0.75)"
                className="pointer-events-none"
              />

              {/* Corpo Principal da Bolha (Proporção 4x2) */}
              <rect
                x={-halfWidth}
                y={-halfHeight}
                width={badgeWidth}
                height={badgeHeight}
                rx="12"
                fill="#030d1a"
                fillOpacity={0.96}
                stroke={isSelected ? '#ffffff' : biome.color}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2.0 : 1.4}
                filter={isSelected || isHovered ? `drop-shadow(0 0 12px ${biome.color})` : undefined}
                className="transition-all duration-200"
              />

              {/* Cabeçalho do Card: Tag Oficial e % Territorial */}
              <circle cx={-halfWidth + 14} cy={-halfHeight + 16} r="3.5" fill={biome.color} />
              <text
                x={-halfWidth + 24}
                y={-halfHeight + 19}
                fill="#94a3b8"
                fontSize="8.5"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                BIOMA IBGE
              </text>
              <text
                x={halfWidth - 12}
                y={-halfHeight + 20}
                textAnchor="end"
                fill={biome.color}
                fontSize="11"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="800"
              >
                {biome.percentageBr}% do BR
              </text>

              {/* Linha Divisória Fina */}
              <line
                x1={-halfWidth + 12}
                y1={-halfHeight + 27}
                x2={halfWidth - 12}
                y2={-halfHeight + 27}
                stroke={biome.color}
                strokeOpacity="0.25"
                strokeWidth="1"
              />

              {/* Nome do Bioma em Alta Legibilidade */}
              <text
                x={-halfWidth + 14}
                y={-halfHeight + 46}
                fill="#ffffff"
                fontSize="13.5"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="700"
                letterSpacing="0.2px"
              >
                {biome.shortName || biome.name.replace('Bioma ', '')}
              </text>

              {/* Extensão Territorial em km² */}
              <text
                x={-halfWidth + 14}
                y={-halfHeight + 62}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="500"
              >
                {(biome.areaKm2 / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil km²
              </text>

              {/* Botão de Ação Inferior: Feedback de Isolamento da Região */}
              <rect
                x={-halfWidth + 12}
                y={-halfHeight + 70}
                width={badgeWidth - 24}
                height={15}
                rx="4"
                fill={isSelected ? biome.color : 'rgba(255,255,255,0.06)'}
                fillOpacity={isSelected ? 0.28 : 1}
              />
              <text
                x={0}
                y={-halfHeight + 81}
                textAnchor="middle"
                fill={isSelected ? '#ffffff' : biome.color}
                fontSize="8.5"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                {isSelected ? '✓ REGIÃO ISOLADA' : 'CLIQUE PARA ISOLAR'}
              </text>
            </g>
          );
        })}
      </g>

      {/* 2. CADEIAS DE SERRAS E ESCARPAS DE RELEVO */}
      {!selectedStateId && (
        <g id="grupo-serras-escarpas-relevo" className="grupo-serras-escarpas-relevo pointer-events-none">
          {MOUNTAIN_RIDGES.map((ridge) => (
            <g key={ridge.id}>
              <path
                d={ridge.d}
                fill="none"
                stroke="#d97706"
                strokeWidth="2.8"
                strokeOpacity="0.80"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      )}

      {/* 3. GRANDES CHAPADAS BRASILEIRAS */}
      <g id="grupo-chapadas-brasileiras" className="grupo-chapadas-brasileiras pointer-events-auto select-none">
        {BRAZIL_NOTABLE_CHAPADAS.map((chapada) => {
          // Ao isolar um estado, esconde todas as chapadas que não pertençam a ele
          if (selectedStateId && chapada.state !== selectedStateId) return null;

          return (
            <g
              key={chapada.id}
              transform={`translate(${chapada.x}, ${chapada.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectChapada?.(chapada)}
            >
              {/* Trapézio estilizado de Chapada (Planalto de topo plano) */}
              <polygon
                points="-12,4 -7,-5 7,-5 12,4"
                fill="#b45309"
                stroke="#fde047"
                strokeWidth="1.6"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.8))"
              />
              <g transform="translate(0, 16)" className="transition-transform group-hover:scale-105">
                <rect
                  x="-65"
                  y="-10"
                  width="130"
                  height="20"
                  rx="5"
                  fill="#030712"
                  fillOpacity="0.95"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 6px rgba(0,0,0,0.8))"
                />
                <text
                  y="3.5"
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  {chapada.name} ({chapada.altitudeMeters}m)
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* 4. PICOS CULMINANTES COM COTAS ALTIMÉTRICAS EXATAS */}
      <g id="grupo-picos-culminantes-brasil" className="grupo-picos-culminantes-brasil pointer-events-auto">
        {BRAZIL_MAJOR_PEAKS.map((peak) => {
          // Ao isolar um estado, esconde todos os picos que não pertençam a ele
          if (selectedStateId && peak.state !== selectedStateId) return null;

          return (
            <g
              key={peak.id}
              transform={`translate(${peak.x}, ${peak.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectPeak?.(peak)}
            >
              {/* Anel Pulsante no Ponto Mais Alto do Brasil */}
              {peak.rankBr === 1 && (
                <circle r="12" fill="#ef4444" fillOpacity="0.25" stroke="#f87171" strokeWidth="1.5" className="animate-ping" />
              )}

              {/* Triângulo Geodésico do Pico */}
              <polygon
                points="0,-12 -8,4 8,4"
                fill={peak.rankBr <= 3 ? '#ef4444' : '#f59e0b'}
                stroke="#ffffff"
                strokeWidth="1.8"
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.85))"
                className="group-hover:scale-125 transition-transform"
              />
              {/* Altitude em Metros e Nome */}
              <g transform="translate(10, -2)" className="select-none">
                <rect
                  x="-2"
                  y="-10"
                  width="135"
                  height="22"
                  rx="4"
                  fill="#020617"
                  fillOpacity="0.92"
                  stroke={peak.rankBr === 1 ? '#ef4444' : '#e2e8f0'}
                  strokeWidth="1"
                />
                <text x="4" y="5" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                  ▲ {peak.name} <tspan fill="#38bdf8">{peak.altitudeMeters}m</tspan>
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
