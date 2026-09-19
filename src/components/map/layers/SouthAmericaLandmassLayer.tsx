import React from 'react';
import { NeighborCountryData } from '../../../data/southAmericaNeighborsData';
import { TerrainTileProvider } from '../ClippedMapTilesLayer';

export interface NeighborFeatureItem {
  pathD: string;
  countryName: string;
  matchedCountry: NeighborCountryData | undefined;
  key: string;
}

export interface SouthAmericaLandmassLayerProps {
  neighborFeaturesList: NeighborFeatureItem[];
  showNeighbors?: boolean;
  hoveredCountryId?: string | null;
  isClimateActive?: boolean;
  isTerritoryActive?: boolean;
  terrainProvider?: TerrainTileProvider;
  onCountryEnter?: (countryId: string) => void;
  onCountryLeave?: (countryId: string) => void;
  onCountryClick?: (country: NeighborCountryData) => void;
}

export const SouthAmericaLandmassLayer: React.FC<SouthAmericaLandmassLayerProps> = ({
  neighborFeaturesList,
  showNeighbors = false,
  hoveredCountryId = null,
  isClimateActive = false,
  isTerritoryActive = false,
  terrainProvider = 'shaded_relief',
  onCountryEnter,
  onCountryLeave,
  onCountryClick,
}) => {
  const isParchment = !isClimateActive && !isTerritoryActive && terrainProvider === 'voyager_parchment';

  return (
    <g
      className={`camada-america-do-sul south-america-context ${
        showNeighbors ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {neighborFeaturesList.map(({ pathD, countryName, matchedCountry, key }) => {
        const effectiveCountry: NeighborCountryData = matchedCountry || {
          id: countryName.toUpperCase().slice(0, 3),
          code: countryName.toLowerCase().slice(0, 2),
          name: countryName,
          officialName: countryName,
          capital: 'Não informada',
          population: 'Não informada',
          populationNumber: 0,
          area: 'Não informada',
          currency: 'Não informada',
          language: 'Espanhol / Português',
          flagUrl: '',
          flagEmoji: '🌎',
          isDirectNeighbor: true,
          centroid: [1000, 700] as [number, number],
          description: 'País do continente sul-americano.',
        };
        const isCurrentHovered =
          effectiveCountry && hoveredCountryId && hoveredCountryId === effectiveCountry.id;

        return (
          <g
            key={key}
            className={`pais-vizinho pais-${countryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          >
            {/* High Contrast Background Shadow Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="#020617"
              strokeWidth={isCurrentHovered ? '3.2' : '2.2'}
              strokeOpacity={0.8}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="pointer-events-none"
            />
            {/* Country Area Polygon */}
            <path
              d={pathD}
              fill={
                isCurrentHovered
                  ? 'url(#neighborHighlightGrad)'
                  : isTerritoryActive
                  ? 'url(#saContinentTerritoryGrad)'
                  : isParchment
                  ? '#eedbb8'
                  : 'url(#saContinentEarthGrad)'
              }
              stroke={
                isCurrentHovered
                  ? '#fbbf24'
                  : isTerritoryActive
                  ? '#1e293b'
                  : isParchment
                  ? '#92400e'
                  : showNeighbors
                  ? '#475569'
                  : '#1e293b'
              }
              strokeWidth={isCurrentHovered ? '2.0' : '1.0'}
              strokeOpacity={isCurrentHovered ? 1.0 : isParchment ? 0.85 : showNeighbors ? 0.9 : 0.6}
              strokeLinejoin="round"
              strokeLinecap="round"
              className={`transition-colors duration-150 ${
                showNeighbors ? 'cursor-pointer pointer-events-auto' : ''
              }`}
              onMouseEnter={() => {
                if (showNeighbors) onCountryEnter?.(effectiveCountry.id);
              }}
              onMouseLeave={() => {
                if (showNeighbors) onCountryLeave?.(effectiveCountry.id);
              }}
              onClick={() => {
                if (showNeighbors) onCountryClick?.(effectiveCountry);
              }}
            />
          </g>
        );
      })}
    </g>
  );
};
