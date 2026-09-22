import React, { useState } from 'react';
import { MAP_CANVAS_WIDTH, MAP_CANVAS_HEIGHT } from '../../lib/mapProjections';
import { CartographyLayerMode } from '../../types/cartography';
import { ENRICHED_INTEGRATION_ROUTES, BRAZIL_KEY_PORTS } from '../../data/cartographyBasinsData';
import { HydroBasinsMapLayer } from './territory/HydroBasinsMapLayer';
import { BiomesReliefMapLayer } from './territory/BiomesReliefMapLayer';
import { LogisticCorridorsMapLayer } from './territory/LogisticCorridorsMapLayer';
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

        <g id="territory-overlay-root-group" className="territory-overlay-root-group pointer-events-auto">
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
            <LogisticCorridorsMapLayer
              selectedSubitemId={selectedSubitemId}
              selectedStateId={selectedStateId}
              onSelectRoute={handleRouteClick}
              onSelectPort={handlePortClick}
            />
          )}
        </g>
      </svg>
    </>
  );
};
