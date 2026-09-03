import React, { useMemo } from 'react';
import { TerrainTileProvider } from '../../types';

export type { TerrainTileProvider };

interface ClippedMapTilesLayerProps {
  geoData: any;
  projection: any;
  provider?: TerrainTileProvider;
  opacity?: number;
}

// Convert longitude to tile X at zoom level
function lon2tile(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

// Convert latitude to tile Y at zoom level
function lat2tile(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * Math.pow(2, zoom));
}

// Convert tile X to longitude
function tile2lon(x: number, zoom: number): number {
  return (x / Math.pow(2, zoom)) * 360 - 180;
}

// Convert tile Y to latitude
function tile2lat(y: number, zoom: number): number {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

// Tile URL providers with high-reliability global endpoints (100% free and open, no watermarks, no API keys)
// Uses ESRI ArcGIS MapServer public REST endpoints: {z}/{y}/{x} where z=zoom, y=row(lat), x=col(lon)
const TILE_URL_PROVIDERS: Record<TerrainTileProvider, (x: number, y: number, z: number) => string> = {
  // 1. High-Definition Topographic Elevation & Shaded Relief (ESRI World Shaded Relief - 100% Free, No Watermarks, No API Key)
  shaded_relief: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/${z}/${y}/${x}`,

  // 2. Physical Land Cover Atlas (Forests, Savannahs, Basins & Mountain Ridges - ESRI World Physical Map)
  physical_atlas: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,

  // 3. High-Resolution True-Color Satellite Imagery (Amazon, Pantanal, Atlantic Coast - ESRI World Imagery)
  satellite_earth: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,

  // 4. Antique Voyager Parchment (Historical Cartographic Style over Shaded Relief)
  voyager_parchment: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/${z}/${y}/${x}`,

  // 5. Clean Muted Light Grey (High-definition Terrain Base for Demography & Geopolitics)
  muted_gray: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/${z}/${y}/${x}`,

  // 6. Natural Earth Land Cover (Tropical Biomes, Amazon, Cerrado & Atlantic Forest - ESRI World Physical Map)
  natural_earth: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,
};

// CSS Filter Profiles to make each terrain mode visually striking, clean, and watermark-free
const PROVIDER_FILTER_STYLES: Record<TerrainTileProvider, string> = {
  shaded_relief: 'contrast(1.22) saturate(1.1) brightness(0.98)',
  physical_atlas: 'contrast(1.25) saturate(1.35) brightness(1.0)',
  satellite_earth: 'contrast(1.2) saturate(1.25) brightness(0.98)',
  voyager_parchment: 'sepia(0.72) contrast(1.25) saturate(1.2) brightness(0.94) hue-rotate(-5deg)',
  muted_gray: 'grayscale(0.75) contrast(1.15) brightness(1.02)',
  natural_earth: 'contrast(1.18) saturate(1.3) brightness(1.02)',
};

// Fallback solid/neutral tones while tiles load or during offline operation
const PROVIDER_FALLBACK_FILLS: Record<TerrainTileProvider, string> = {
  shaded_relief: '#1e293b',
  physical_atlas: '#254e38',
  satellite_earth: '#0f1f2e',
  voyager_parchment: '#eedbb8',
  muted_gray: '#334155',
  natural_earth: '#1b4332',
};

export const ClippedMapTilesLayer: React.FC<ClippedMapTilesLayerProps> = ({
  geoData,
  projection,
  provider = 'shaded_relief',
  opacity = 0.95,
}) => {
  // Calculate tile grid covering 100% of Brazil (Lon: [-74.5, -34.0], Lat: [5.5, -34.0])
  const tiles = useMemo(() => {
    if (!projection) return [];

    const zoom = 5;
    const minX = lon2tile(-75.5, zoom); // 9
    const maxX = lon2tile(-33.5, zoom); // 13
    const minY = lat2tile(6.0, zoom);   // 15
    const maxY = lat2tile(-34.5, zoom); // 19

    const tileList: Array<{
      x: number;
      y: number;
      z: number;
      posX: number;
      posY: number;
      width: number;
      height: number;
    }> = [];

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const nwLon = tile2lon(x, zoom);
        const nwLat = tile2lat(y, zoom);
        const seLon = tile2lon(x + 1, zoom);
        const seLat = tile2lat(y + 1, zoom);

        const nwProj = projection([nwLon, nwLat]);
        const seProj = projection([seLon, seLat]);

        if (nwProj && seProj) {
          tileList.push({
            x,
            y,
            z: zoom,
            posX: Math.floor(nwProj[0]),
            posY: Math.floor(nwProj[1]),
            // Add 1px overlap to prevent any micro sub-pixel seams
            width: Math.ceil(seProj[0] - nwProj[0]) + 1.2,
            height: Math.ceil(seProj[1] - nwProj[1]) + 1.2,
          });
        }
      }
    }

    return tileList;
  }, [projection]);

  if (!tiles.length || !geoData) return null;

  const getTileUrl = TILE_URL_PROVIDERS[provider] || TILE_URL_PROVIDERS.shaded_relief;
  const filterStyle = PROVIDER_FILTER_STYLES[provider] || PROVIDER_FILTER_STYLES.shaded_relief;
  const fallbackFill = PROVIDER_FALLBACK_FILLS[provider] || PROVIDER_FALLBACK_FILLS.shaded_relief;

  return (
    <g
      id="clipped-map-tiles-group"
      clipPath="url(#brazil-boundary-clip)"
      className="camada-tiles-terreno pointer-events-none"
      opacity={opacity}
    >
      {/* 0. Fallback base fill for smooth loading and offline resilience */}
      <rect
        id="base-fundo-terreno-fallback"
        className="base-fundo-terreno pointer-events-none"
        x="0"
        y="0"
        width="2560"
        height="1440"
        fill={fallbackFill}
      />

      {/* Dynamic Tile Grid across all 27 States of Brazil */}
      {tiles.map(({ x, y, z, posX, posY, width, height }) => {
        const url = getTileUrl(x, y, z);

        return (
          <image
            key={`tile-hd-${provider}-${z}-${x}-${y}`}
            id={`tile-ladrilho-${provider}-${z}-${x}-${y}`}
            className="ladrilho-mapa-tile"
            href={url}
            x={posX}
            y={posY}
            width={width}
            height={height}
            preserveAspectRatio="none"
            crossOrigin="anonymous"
            style={{
              filter: filterStyle,
            }}
            onError={(e) => {
              // Hide failed tile cleanly so the background fill renders smoothly
              (e.currentTarget as SVGImageElement).style.display = 'none';
            }}
          />
        );
      })}
    </g>
  );
};
