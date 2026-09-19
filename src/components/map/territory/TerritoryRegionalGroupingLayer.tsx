import React from 'react';
import { BRAZIL_HYDRO_REGIONS, HydroRegionInfo } from '../../../data/cartography/hydroRegionsData';
import { BRAZIL_OFFICIAL_BIOMES, BiomeGeoFeature } from '../../../data/cartography/biomesData';
import { MOUNTAIN_RIDGES } from '../../../data/cartography/reliefPeaksData';
import { CartographyLayerMode } from '../../../types/cartography';

interface TerritoryRegionalGroupingLayerProps {
  activeLayer: CartographyLayerMode;
  selectedRegionId?: string | null;
  hoveredRegionId?: string | null;
  onSelectRegion?: (regionId: string) => void;
  onHoverRegion?: (regionId: string | null) => void;
}

/**
 * TerritoryRegionalGroupingLayer
 * Camada visual de agrupamento por macrorregiões (Bacias ANA, Biomas IBGE e Relevo Orográfico).
 * Agrupa visualmente os estados em regiões contínuas, superando a mera divisão por cores estaduais.
 */
export const TerritoryRegionalGroupingLayer: React.FC<TerritoryRegionalGroupingLayerProps> = ({
  activeLayer,
  selectedRegionId,
  hoveredRegionId,
  onSelectRegion,
  onHoverRegion,
}) => {
  if (!activeLayer || activeLayer === 'none') {
    return null;
  }

  return (
    <g id="camada-agrupamento-regional-territorio" className="camada-agrupamento-regional-territorio pointer-events-auto">
      <defs>
        <filter id="regionalBoundaryGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="padrao-relevo-orografico" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.08" />
        </pattern>
      </defs>

      {/* ========================================================================= */}
      {/* 1. AGRUPAMENTO REGIONAL DE BACIAS HIDROGRÁFICAS (ANA)                      */}
      {/* ========================================================================= */}
      {activeLayer === 'bacias_hidrograficas' && (
        <g id="grupo-agrupamento-bacias-macro" className="grupo-agrupamento-bacias-macro">
          {BRAZIL_HYDRO_REGIONS.map((region) => {
            const isSelected = selectedRegionId === region.id;
            const isHovered = hoveredRegionId === region.id;
            const isDimmed = (selectedRegionId && !isSelected) || (hoveredRegionId && !isHovered && !selectedRegionId);
            const badgeWidth = 184;
            const badgeHeight = 92;
            const halfW = badgeWidth / 2;
            const halfH = badgeHeight / 2;

            return (
              <g
                key={`macro-basin-${region.id}`}
                className="regiao-bacia-agrupada cursor-pointer transition-opacity duration-300 select-none"
                opacity={isDimmed ? 0.4 : 1.0}
                onClick={() => onSelectRegion?.(region.id)}
                onMouseEnter={() => onHoverRegion?.(region.id)}
                onMouseLeave={() => onHoverRegion?.(null)}
              >
                {/* Selo Cartográfico Flutuante do Agrupamento da Bacia (Proporção 4x2) */}
                <g
                  transform={`translate(${region.labelPos.x}, ${region.labelPos.y})`}
                  className="transition-transform duration-200"
                >
                  <rect
                    x={-halfW + 2}
                    y={-halfH + 3}
                    width={badgeWidth}
                    height={badgeHeight}
                    rx="12"
                    fill="rgba(0,0,0,0.7)"
                  />
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={badgeWidth}
                    height={badgeHeight}
                    rx="12"
                    fill="#020817"
                    fillOpacity="0.94"
                    stroke={region.color}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                    strokeOpacity={isSelected ? 1 : 0.75}
                  />
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={badgeWidth}
                    height="20"
                    rx="12"
                    fill={region.color}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                  />
                  <text
                    x={-halfW + 10}
                    y={-halfH + 14}
                    fill={region.color}
                    fontSize="8.5"
                    fontWeight="800"
                    letterSpacing="0.08em"
                  >
                    BACIA HIDROGRÁFICA
                  </text>
                  <text
                    x="0"
                    y="-6"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11.5"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {region.shortName}
                  </text>
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {region.areaPercentageBr}% BR • {region.dischargeM3s.toLocaleString()} m³/s
                  </text>
                  <text
                    x="0"
                    y="31"
                    textAnchor="middle"
                    fill={region.color}
                    fontSize="8"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    TOQUE PARA DETALHES
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* ========================================================================= */}
      {/* 2. AGRUPAMENTO REGIONAL DE BIOMAS E RELEVO (IBGE)                          */}
      {/* ========================================================================= */}
      {activeLayer === 'biomas_relevo' && (
        <g id="grupo-agrupamento-biomas-relevo-macro" className="grupo-agrupamento-biomas-relevo-macro">
          {BRAZIL_OFFICIAL_BIOMES.map((biome) => {
            const isSelected = selectedRegionId === biome.id;
            const isHovered = hoveredRegionId === biome.id;
            const isDimmed = (selectedRegionId && !isSelected) || (hoveredRegionId && !isHovered && !selectedRegionId);
            const badgeWidth = 184;
            const badgeHeight = 92;
            const halfW = badgeWidth / 2;
            const halfH = badgeHeight / 2;

            return (
              <g
                key={`macro-biome-${biome.id}`}
                className="regiao-bioma-agrupada cursor-pointer transition-opacity duration-300 select-none"
                opacity={isDimmed ? 0.4 : 1.0}
                onClick={() => onSelectRegion?.(biome.id)}
                onMouseEnter={() => onHoverRegion?.(biome.id)}
                onMouseLeave={() => onHoverRegion?.(null)}
              >
                {/* Tag de Domínio Morfoclimático do Bioma (Proporção 4x2) */}
                <g
                  transform={`translate(${biome.centerPos.x}, ${biome.centerPos.y})`}
                  className="transition-transform duration-200"
                >
                  <rect
                    x={-halfW + 2}
                    y={-halfH + 3}
                    width={badgeWidth}
                    height={badgeHeight}
                    rx="12"
                    fill="rgba(0,0,0,0.7)"
                  />
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={badgeWidth}
                    height={badgeHeight}
                    rx="12"
                    fill="#020817"
                    fillOpacity="0.94"
                    stroke={biome.color}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                    strokeOpacity={isSelected ? 1 : 0.75}
                  />
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={badgeWidth}
                    height="20"
                    rx="12"
                    fill={biome.color}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                  />
                  <text
                    x={-halfW + 10}
                    y={-halfH + 14}
                    fill={biome.color}
                    fontSize="8.5"
                    fontWeight="800"
                    letterSpacing="0.08em"
                  >
                    BIOMA OFICIAL IBGE
                  </text>
                  <text
                    x="0"
                    y="-6"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {biome.name}
                  </text>
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {biome.percentageBr}% Território • {(biome.areaKm2 / 1000).toFixed(0)}k km²
                  </text>
                  <text
                    x="0"
                    y="31"
                    textAnchor="middle"
                    fill={biome.color}
                    fontSize="8"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    TOQUE PARA DETALHES
                  </text>
                </g>
              </g>
            );
          })}

          {/* Cordilheiras Orográficas e Serras de Relevo Contínuo */}
          <g id="grupo-serras-orograficas-relevo" className="grupo-serras-orograficas-relevo pointer-events-none">
            {MOUNTAIN_RIDGES.map((ridge) => (
              <path
                key={ridge.id}
                d={ridge.d}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.8"
                strokeOpacity="0.75"
                strokeLinecap="round"
                strokeDasharray="4 3"
              />
            ))}
          </g>
        </g>
      )}
    </g>
  );
};
