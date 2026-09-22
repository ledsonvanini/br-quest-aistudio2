// src/components/map/UnifiedStateHoverTooltip.tsx
// Balão Unificado de Hover com Efeito de Cone de Projeção Cartográfica (QGIS Zoom Callout)
// Suporte universal para todos os modos (Clima, Território e Redes, Geopolítica, Biodiversidade, Musicalidades)
// Renderização síncrona sem delay entre o Cone e o Painel

import React, { useMemo } from 'react';
import { ClimateMode } from './ClimatePhenomenaLayer';
import { StateWeatherData } from '../../services/climateService';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import { AppMainMode, BiodiversityKingdom } from '../../types';
import { CartographyLayerMode } from '../../types/cartography';
import { TerritoryStateHoverTooltip } from './territory/TerritoryStateHoverTooltip';
import { BRAZIL_STATES_GEOPOLITICS } from '../../data/geopoliticaData';
import { STATE_BIODIVERSITY_PROFILES } from '../../data/brazilBiodiversityData';
import { ALL_BRAZIL_STATES, getStateCoatOfArmsUrl, getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { getStateMusicalHeritage } from '../../data/musicalHeritageData';
import { getStateHighlightsForEra, VINTAGE_RADIO_ERAS } from '../../data/vintageRadioEras';
import { ClimateTooltipSection } from './tooltip/ClimateTooltipSection';
import { BiodiversityTooltipSection } from './tooltip/BiodiversityTooltipSection';
import { MusicalTooltipSection } from './tooltip/MusicalTooltipSection';
import { GeopoliticaTooltipSection } from './tooltip/GeopoliticaTooltipSection';
import { calculateSmartTooltipPosition } from '../../utils/tooltipPositioning';
import { CartographicProjectionCone } from './tooltip/CartographicProjectionCone';

interface UnifiedStateHoverTooltipProps {
  hoveredStateId: string | null;
  centroids: Record<string, [number, number]>;
  mainMode: AppMainMode;
  isClimateActive: boolean;
  climateMode: ClimateMode;
  stateWeather: Record<string, StateWeatherData>;
  geopoliticaMetric: GeopoliticaMetricKey;
  biodiversityKingdom: BiodiversityKingdom | 'all';
  pan: { x: number; y: number };
  zoom: number;
  rotateX?: number;
  selectedStateId?: string | null;
  showNeighbors?: boolean;
  selectedRadioEraId?: string;
  mousePos?: { x: number; y: number };
  activeCartographyLayer?: CartographyLayerMode;
}

export const UnifiedStateHoverTooltip: React.FC<UnifiedStateHoverTooltipProps> = ({
  hoveredStateId,
  centroids,
  mainMode,
  isClimateActive,
  climateMode,
  stateWeather,
  geopoliticaMetric,
  pan,
  zoom,
  rotateX = 42,
  selectedStateId,
  showNeighbors,
  selectedRadioEraId = 'catedral_1930_1940',
  mousePos,
  activeCartographyLayer,
}) => {
  const isTerritoryActive = Boolean(
    mainMode === 'territorio' || (activeCartographyLayer && activeCartographyLayer !== 'none')
  );

  // Visibilidade estrita: ativo em todos os modos informativos quando não há seleção fixada
  const shouldHide =
    !hoveredStateId ||
    showNeighbors ||
    Boolean(selectedStateId) ||
    mainMode === 'globo3d' ||
    mainMode === 'aventura';

  // Cálculo da Projeção do Centroide do Estado na Viewport (Âncora do Mapa)
  const centroidScreenPos = useMemo(() => {
    if (!hoveredStateId || !centroids[hoveredStateId] || typeof window === 'undefined') {
      return null;
    }
    const [cx, cy] = centroids[hoveredStateId];
    const dx = cx - 1280;
    const dy = cy - 720;
    const rad = (rotateX * Math.PI) / 180;
    const cosX = Math.cos(rad);
    const x = window.innerWidth / 2 + (dx * zoom + pan.x);
    const y = window.innerHeight / 2 + (dy * cosX * zoom + pan.y);
    return { x, y };
  }, [hoveredStateId, centroids, zoom, pan, rotateX]);

  if (shouldHide || !hoveredStateId) return null;

  // Dimensões determinísticas e síncronas por modo (garante zero delay na projeção do cone)
  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 340;
  let cardHeight = 220;
  if (isTerritoryActive) {
    cardHeight = 230;
  } else if (mainMode === 'geopolitica') {
    cardHeight = 225;
  } else if (mainMode === 'biodiversidade') {
    cardHeight = 215;
  } else if (mainMode === 'musicalidades') {
    cardHeight = 235;
  } else if (isClimateActive || mainMode === 'clima') {
    cardHeight = 225;
  }

  // Ponto de mira focal: centroide geométrico do estado no mapa com fallback para mousePos
  const focalPoint = centroidScreenPos || (mousePos && mousePos.x > 0 ? mousePos : null);
  if (!focalPoint) return null;

  // Cálculo síncrono da geometria do cone e da posição do quadro
  const smartResult = calculateSmartTooltipPosition({
    target: focalPoint,
    cardWidth,
    cardHeight,
    minDistance: 74,
    topMargin: 70,
    bottomMargin: 60,
    sideMargin: 24,
  });

  const stateId = hoveredStateId;
  const weather = stateWeather[stateId];
  const geoProfile = BRAZIL_STATES_GEOPOLITICS[stateId];
  const bioProfile = STATE_BIODIVERSITY_PROFILES[stateId];
  const registryInfo = ALL_BRAZIL_STATES.find((s) => s.id === stateId);
  const stateName = registryInfo?.name || geoProfile?.stateName || stateId;
  const capital = registryInfo?.capital || geoProfile?.capital || weather?.capital || 'Capital';
  const coatOfArmsUrl = getStateCoatOfArmsUrl(stateId) || registryInfo?.coatOfArmsUrl;
  const flagUrl = getStateFlagUrl(stateId) || registryInfo?.flagUrl;
  const musicalHeritage = getStateMusicalHeritage(stateId);
  const radioEra = VINTAGE_RADIO_ERAS.find((e) => e.id === selectedRadioEraId) || VINTAGE_RADIO_ERAS[0];
  const eraHighlights = getStateHighlightsForEra(stateId, selectedRadioEraId);

  return (
    <div
      key={`tooltip-hover-group-${stateId}`}
      className="container-tooltip-hover-unificado fixed inset-0 pointer-events-none select-none z-[99998] animate-in fade-in duration-150 ease-out"
    >
      {/* 1. Feixe de Cone de Projeção / Zoom Section Cartográfico (QGIS) */}
      <CartographicProjectionCone
        targetPos={smartResult.targetPos}
        topAnchorPos={smartResult.topAnchorPos}
        bottomAnchorPos={smartResult.bottomAnchorPos}
        conePolygonPath={smartResult.conePolygonPath}
        topRayPath={smartResult.topRayPath}
        bottomRayPath={smartResult.bottomRayPath}
      />

      {/* 2. Painel Informativo de Alta Fidelidade Sincronizado - z-index 99999 */}
      <aside
        id="balao-universal-estado-hover"
        role="tooltip"
        aria-live="polite"
        className="balao-universal-estado-hover fixed w-[300px] sm:w-[340px] pointer-events-none select-none z-[99999] overflow-hidden"
        style={{
          left: `${smartResult.cardPos.x}px`,
          top: `${smartResult.cardPos.y}px`,
          isolation: 'isolate',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <div
          className="card-balao-conteudo-unificado rounded-2xl p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl border border-slate-700/80 text-white space-y-2.5 overflow-hidden break-words bg-slate-950/95"
        >
          {/* MODO 0: TERRITÓRIO E REDES VIVAS (Bacias ANA, Biomas/Relevo IBGE, Rotas ANTT) */}
          {isTerritoryActive && (
            <TerritoryStateHoverTooltip
              stateId={stateId}
              activeLayer={activeCartographyLayer || 'bacias_hidrograficas'}
            />
          )}

          {/* MODO 1: CLIMA & METEOROLOGIA */}
          {!isTerritoryActive && (isClimateActive || mainMode === 'clima') && weather && (
            <ClimateTooltipSection
              stateId={stateId}
              stateName={stateName}
              capital={capital}
              flagUrl={flagUrl}
              climateMode={climateMode}
              weather={weather}
            />
          )}

          {/* MODO 2: GEOPOLÍTICA & CENSO IBGE */}
          {!isTerritoryActive && mainMode === 'geopolitica' && (
            <GeopoliticaTooltipSection
              stateId={stateId}
              stateName={stateName}
              capital={capital}
              flagUrl={flagUrl}
              geoProfile={geoProfile}
              geopoliticaMetric={geopoliticaMetric}
            />
          )}

          {/* MODO 3: BIODIVERSIDADE (GBIF / ICMBio) */}
          {!isTerritoryActive && mainMode === 'biodiversidade' && bioProfile && (
            <BiodiversityTooltipSection
              stateId={stateId}
              capital={capital}
              flagUrl={flagUrl}
              bioProfile={bioProfile}
            />
          )}

          {/* MODO 4: MUSICALIDADES & RÁDIO HISTÓRICA */}
          {!isTerritoryActive && mainMode === 'musicalidades' && (
            <MusicalTooltipSection
              stateId={stateId}
              stateName={stateName}
              capital={capital}
              flagUrl={flagUrl}
              coatOfArmsUrl={coatOfArmsUrl}
              musicalHeritage={musicalHeritage}
              eraHighlights={eraHighlights}
              radioEra={radioEra}
            />
          )}
        </div>
      </aside>
    </div>
  );
};
