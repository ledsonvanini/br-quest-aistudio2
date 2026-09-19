import React, { useState } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { CartographyLayerMode } from '../../types/cartography';
import { ENRICHED_INTEGRATION_ROUTES, BRAZIL_KEY_PORTS } from '../../data/cartographyBasinsData';
import { HydroBasinsMapLayer } from './territory/HydroBasinsMapLayer';
import { BiomesReliefMapLayer } from './territory/BiomesReliefMapLayer';
import { TerritoryFeatureDetailModal, TerritoryFeatureData } from './territory/TerritoryFeatureDetailModal';
import { HydroRegionInfo } from '../../data/cartography/hydroRegionsData';
import { BiomeGeoFeature } from '../../data/cartography/biomesData';

export interface TerritoryLayersOverlayProps {
  activeLayer: CartographyLayerMode;
  hoveredStateId?: string | null;
  selectedStateId?: string | null;
  selectedSubitemId?: string | null;
  onSelectSubitem?: (subitemId: string | null) => void;
  onSelectState?: (stateId: string) => void;
}

const ROUTE_PRIMARY_STATE: Record<string, string> = {
  br_101: 'RJ',
  br_116: 'SP',
  br_364: 'RO',
  hidrovia_tiete_parana: 'SP',
  hidrovia_madeira_amazonas: 'AM',
  ferrovia_norte_sul: 'GO',
  ferrovia_carajas: 'PA',
};

const BIOME_PRIMARY_STATE: Record<string, string> = {
  amazonia: 'AM',
  cerrado: 'GO',
  caatinga: 'BA',
  mata_atlantica: 'RJ',
  pantanal: 'MS',
  pampa: 'RS',
};

const BASIN_PRIMARY_STATE: Record<string, string> = {
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

export const TerritoryLayersOverlay: React.FC<TerritoryLayersOverlayProps> = ({
  activeLayer,
  hoveredStateId,
  selectedStateId,
  selectedSubitemId,
  onSelectSubitem,
  onSelectState,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [modalFeature, setModalFeature] = useState<TerritoryFeatureData | null>(null);

  if (!activeLayer || activeLayer === 'none') {
    return null;
  }

  const handleRouteClick = (routeId: string) => {
    onSelectSubitem?.(selectedSubitemId === routeId ? null : routeId);
    const anchor = ROUTE_PRIMARY_STATE[routeId] || 'SP';
    onSelectState?.(anchor);
  };

  const handlePortClick = (porto: (typeof BRAZIL_KEY_PORTS)[0]) => {
    onSelectSubitem?.(porto.id);
    onSelectState?.(porto.state);
    setModalFeature({
      type: 'porto',
      data: porto,
    });
  };

  return (
    <>
      {/* 1. MODAL FLUTUANTE DE DETALHE DE FEIÇÃO GEOGRÁFICA ESPECÍFICA */}
      <TerritoryFeatureDetailModal
        feature={modalFeature}
        onClose={() => setModalFeature(null)}
      />

      {/* 2. CAMADA CARTOGRÁFICA VETORIAL SVG (VIEWBOX 2560x1440) */}
      <svg
        id="territory-layers-svg-canvas"
        className="territory-layers-svg-canvas absolute inset-0 pointer-events-none overflow-visible"
        style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
        viewBox={`0 0 ${MAP_CANVAS_WIDTH} ${MAP_CANVAS_HEIGHT}`}
      >
        <defs>
          <filter id="portBeaconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>
            {`
              @keyframes routeTransitFlow {
                from { stroke-dashoffset: 40; }
                to { stroke-dashoffset: 0; }
              }
              .linha-transito-logistico {
                stroke-dasharray: 8 6;
                animation: routeTransitFlow 2s linear infinite;
              }
            `}
          </style>
        </defs>

        <g id="territory-overlay-root-group" className="territory-overlay-root-group">
          {/* Subcamada 1: BACIAS HIDROGRÁFICAS (ANA / HIDROWEB) */}
          {activeLayer === 'bacias_hidrograficas' && (
            <HydroBasinsMapLayer
              selectedRegionId={selectedSubitemId}
              hoveredRegionId={hoveredRegionId}
              selectedStateId={selectedStateId}
              onSelectRegion={(region: HydroRegionInfo) => {
                onSelectSubitem?.(region.id);
                const anchor = BASIN_PRIMARY_STATE[region.id] || 'AM';
                onSelectState?.(anchor);
              }}
              onHoverRegion={(rId) => setHoveredRegionId(rId)}
              onSelectPin={(pin) => setModalFeature({ type: 'hydroPin', data: pin })}
              onSelectState={onSelectState}
            />
          )}

          {/* Subcamada 2: BIOMAS & RELEVO (IBGE / JURANDYR ROSS) */}
          {activeLayer === 'biomas_relevo' && (
            <BiomesReliefMapLayer
              selectedBiomeId={selectedSubitemId}
              hoveredBiomeId={hoveredRegionId}
              selectedStateId={selectedStateId}
              onSelectBiome={(biome: BiomeGeoFeature) => {
                onSelectSubitem?.(biome.id);
                const anchor = BIOME_PRIMARY_STATE[biome.id] || 'GO';
                onSelectState?.(anchor);
              }}
              onHoverBiome={(bId) => setHoveredRegionId(bId)}
              onSelectPeak={(peak) => setModalFeature({ type: 'peak', data: peak })}
              onSelectChapada={(chapada) => setModalFeature({ type: 'chapada', data: chapada })}
              onSelectState={onSelectState}
            />
          )}

          {/* Subcamada 3: ROTAS DE INTEGRAÇÃO & CORREDORES MULTIMODAIS */}
          {activeLayer === 'rotas_integracao' && (
            <g id="camada-rotas-logistica-viva" className="camada-rotas-logistica-viva pointer-events-auto">
              {ENRICHED_INTEGRATION_ROUTES.map((route) => {
                // Se um estado estiver isolado, esconde rotas que não pertençam a ele
                if (selectedStateId && ROUTE_PRIMARY_STATE[route.id] !== selectedStateId && selectedSubitemId !== route.id) return null;

                const isSelected =
                  selectedSubitemId === route.id ||
                  (selectedSubitemId === 'rodovias' && (route.type === 'rodoviaria' || route.type === 'historica')) ||
                  (selectedSubitemId === 'hidrovias' && route.type === 'fluvial_cabotagem') ||
                  (selectedSubitemId === 'ferrovias' && route.type === 'ferroviaria');
                const isDimmed = Boolean(selectedSubitemId && !isSelected);

                return (
                  <g
                    key={route.id}
                    className={`grupo-rota-integracao cursor-pointer group transition-opacity duration-300 ${
                      isDimmed ? 'opacity-20 hover:opacity-80' : 'opacity-100'
                    }`}
                    onClick={() => handleRouteClick(route.id)}
                  >
                    <path
                      d={route.path}
                      fill="none"
                      stroke={route.color}
                      strokeWidth={isSelected ? 8 : route.type === 'fluvial_cabotagem' ? 6 : 4.5}
                      strokeLinecap="round"
                      strokeOpacity={isSelected ? 0.95 : 0.65}
                      filter={isSelected ? 'url(#routeGlow)' : undefined}
                      className="transition-all"
                    />
                    <path
                      d={route.path}
                      fill="none"
                      stroke={route.type === 'historica' ? '#fde047' : '#ffffff'}
                      strokeWidth={route.type === 'ferroviaria' ? 3 : 2.4}
                      strokeLinecap="round"
                      className="linha-transito-logistico"
                    />
                    {isSelected && route.cities[0] && (
                      <g
                        transform={`translate(${route.cities[0].x}, ${route.cities[0].y - 14})`}
                        className="transition-transform"
                      >
                        <rect
                          x="-75"
                          y="-12"
                          width="150"
                          height="24"
                          rx="6"
                          fill="#0f172a"
                          fillOpacity="0.96"
                          stroke="#38bdf8"
                          strokeWidth={1.8}
                          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.8))"
                        />
                        <text textAnchor="middle" y="3.5" fill="#f8fafc" fontSize="9.5" fontWeight="bold">
                          {route.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Portos de Cabotagem Estratégicos */}
              {BRAZIL_KEY_PORTS.map((porto) => {
                // Se um estado estiver isolado, esconde portos fora desse estado
                if (selectedStateId && porto.state !== selectedStateId) return null;

                const isPortSelected = selectedSubitemId === 'portos' || selectedSubitemId === porto.id;
                return (
                  <g
                    key={porto.id}
                    transform={`translate(${porto.x}, ${porto.y})`}
                    className="marcador-porto-maritimo cursor-pointer group"
                    onClick={() => handlePortClick(porto)}
                  >
                    <circle
                      r={isPortSelected ? 14 : 9}
                      fill={porto.type === 'porto_fluvial' ? '#22d3ee' : '#38bdf8'}
                      fillOpacity={isPortSelected ? 0.6 : 0.35}
                      className="animate-ping"
                    />
                    <circle
                      r={isPortSelected ? 7 : 5}
                      fill={isPortSelected ? '#fef08a' : '#ffffff'}
                      stroke={porto.type === 'porto_fluvial' ? '#0891b2' : '#0284c7'}
                      strokeWidth={isPortSelected ? 3 : 2}
                      filter="url(#portBeaconGlow)"
                    />
                  <g transform="translate(14, 4)" className="transition-all opacity-0 group-hover:opacity-100 group-hover:scale-105 pointer-events-none">
                    <rect
                      x="-4"
                      y="-11"
                      width={porto.name.length * 6.4 + 14}
                      height="20"
                      rx="5"
                      fill="#030712"
                      fillOpacity="0.95"
                      stroke="#0284c7"
                      strokeWidth="1.2"
                      filter="drop-shadow(0 2px 6px rgba(0,0,0,0.8))"
                    />
                    <text x="3" y="3" fill="#e0f2fe" fontSize="9.5" fontWeight="bold">
                      ⚓ {porto.name.replace(/Porto (de|do|Fluvial de) /g, '')} ({porto.state})
                    </text>
                  </g>
                </g>
              );
            })}
            </g>
          )}
        </g>
      </svg>
    </>
  );
};
