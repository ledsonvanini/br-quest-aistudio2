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

// Tile URL providers with high-reliability global endpoints
const TILE_URL_PROVIDERS: Record<TerrainTileProvider, (x: number, y: number, z: number) => string> = {
  // 1. High-Definition Topographic Elevation & Shaded Relief (Esri World Topo / Shaded Relief)
  shaded_relief: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`,

  // 2. Physical Land Cover Atlas (Forests, Savannahs, Basins & Mountain Ridges)
  physical_atlas: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,

  // 3. High-Resolution True-Color Satellite Imagery (Amazon, Pantanal, Atlantic Coast)
  satellite_earth: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,

  // 4. Antique Voyager Parchment (Historical Cartographic Style)
  voyager_parchment: (x, y, z) =>
    `https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/${z}/${x}/${y}.png`,

  // 5. Clean Muted Light Grey (High-definition Gray Carto Canvas for Demography & Geopolitics)
  muted_gray: (x, y, z) =>
    `https://basemaps.cartocdn.com/rastertiles/light_nolabels/${z}/${x}/${y}.png`,

  // 6. Natural Earth Land Cover
  natural_earth: (x, y, z) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,
};

// CSS Filter Profiles to make each terrain mode visually striking and premium
const PROVIDER_FILTER_STYLES: Record<TerrainTileProvider, string> = {
  shaded_relief: 'contrast(1.18) saturate(1.12) brightness(0.96)',
  physical_atlas: 'contrast(1.22) saturate(1.3) brightness(1.02)',
  satellite_earth: 'contrast(1.24) saturate(1.28) brightness(0.96)',
  voyager_parchment: 'sepia(0.65) contrast(1.25) saturate(1.1) brightness(0.92) hue-rotate(-5deg)',
  muted_gray: 'grayscale(0.65) contrast(1.15) brightness(0.95)',
  natural_earth: 'contrast(1.22) saturate(1.35) brightness(1.04) hue-rotate(-3deg)',
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

  return (
    <g
      id="clipped-map-tiles-group"
      clipPath="url(#brazil-boundary-clip)"
      className="camada-tiles-terreno pointer-events-none"
      opacity={opacity}
    >
      {/* Dynamic Tile Grid across all 27 States of Brazil */}
      {tiles.map(({ x, y, z, posX, posY, width, height }) => {
        const url = getTileUrl(x, y, z);

        return (
          <image
            key={`tile-hd-${provider}-${z}-${x}-${y}`}
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
          />
        );
      })}
    </g>
  );
};
