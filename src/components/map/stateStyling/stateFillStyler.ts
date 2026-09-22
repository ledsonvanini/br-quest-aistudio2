import { MapVisualStyle, ChoroplethSubTheme, getStateColor, STATE_GEOGRAPHICAL_DATA } from '../../../lib/mapColorScales';
import { StateWeatherData, getEcmwfTempColor } from '../../../services/climateService';
import { ClimateMode } from '../ClimatePhenomenaLayer';
import { GeopoliticaMetricKey } from '../../../types/geopolitica';
import { BRAZIL_STATES_GEOPOLITICS } from '../../../data/geopoliticaData';
import { TerrainTileProvider } from '../ClippedMapTilesLayer';
import { CartographyLayerMode } from '../../../types/cartography';
import { getRouteStateStyle } from './routesStateColors';
import { isStateMatchingTerritoryFilter } from './territoryStateFilters';

export interface StateVisualProperties {
  stateFill: string;
  stateFillOpacity: number;
  strokeColor: string;
  strokeWidth: number;
  underglowColor: string;
  wallGradId: string;
}

export interface GetStateVisualsOptions {
  stateId: string;
  isHovered: boolean;
  isSelected: boolean;
  completedStateIds: Set<string>;
  showNeighbors?: boolean;
  visualStyle: MapVisualStyle;
  choroplethSubTheme: ChoroplethSubTheme;
  terrainProvider?: TerrainTileProvider;
  isClimateActive?: boolean;
  climateMode?: ClimateMode;
  stateWeather?: Record<string, StateWeatherData>;
  isGeopoliticaActive?: boolean;
  geopoliticaMetric?: GeopoliticaMetricKey;
  activeCartographyLayer?: CartographyLayerMode;
  selectedTerritorySubitemId?: string | null;
  selectedStateId?: string | null;
  focusedClimateStateId?: string | null;
  focusedBiodiversityStateId?: string | null;
  focusedGeopoliticsStateId?: string | null;
  focusedTerritoryStateId?: string | null;
  selectedCampaign?: string;
  mainMode?: string;
}

export const REGION_STATES_MAP: Record<string, string[]> = {
  norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  centro_oeste: ['DF', 'GO', 'MT', 'MS'],
  sudeste: ['ES', 'MG', 'RJ', 'SP'],
  sul: ['PR', 'RS', 'SC'],
};

export const REGION_COLORS_MAP: Record<string, string> = {
  norte: '#10b981',        // Verde esmeralda (Norte / Amazônia)
  nordeste: '#f59e0b',     // Âmbar dourado (Nordeste)
  centro_oeste: '#eab308', // Amarelo sol (Centro-Oeste)
  sudeste: '#0284c7',      // Azul safira (Sudeste)
  sul: '#a855f7',          // Púrpura nobre (Sul)
};

export function getStateRegion(stateId: string): string {
  for (const [region, states] of Object.entries(REGION_STATES_MAP)) {
    if (states.includes(stateId)) return region;
  }
  return 'sudeste';
}

export const STATE_NEIGHBORS_MAP: Record<string, string[]> = {
  AC: ['AM', 'RO'],
  AL: ['PE', 'SE', 'BA'],
  AM: ['AC', 'RO', 'MT', 'PA', 'RR'],
  AP: ['PA'],
  BA: ['SE', 'AL', 'PE', 'PI', 'TO', 'GO', 'MG', 'ES'],
  CE: ['PI', 'RN', 'PB', 'PE'],
  DF: ['GO', 'MG'],
  ES: ['BA', 'MG', 'RJ'],
  GO: ['TO', 'BA', 'MG', 'DF', 'MS', 'MT'],
  MA: ['PA', 'TO', 'PI'],
  MG: ['BA', 'ES', 'RJ', 'SP', 'MS', 'GO', 'DF'],
  MS: ['MT', 'GO', 'MG', 'SP', 'PR'],
  MT: ['RO', 'AM', 'PA', 'TO', 'GO', 'MS'],
  PA: ['AP', 'RR', 'AM', 'MT', 'TO', 'MA'],
  PB: ['RN', 'CE', 'PE'],
  PE: ['PB', 'CE', 'PI', 'BA', 'AL'],
  PI: ['MA', 'TO', 'BA', 'PE', 'CE'],
  PR: ['SP', 'MS', 'SC'],
  RJ: ['ES', 'MG', 'SP'],
  RN: ['CE', 'PB'],
  RO: ['AC', 'AM', 'MT'],
  RR: ['AM', 'PA'],
  RS: ['SC'],
  SC: ['PR', 'RS'],
  SE: ['AL', 'BA'],
  SP: ['MG', 'RJ', 'PR', 'MS'],
  TO: ['PA', 'MA', 'PI', 'BA', 'GO', 'MT'],
};

export function computeStateVisuals(opts: GetStateVisualsOptions): StateVisualProperties {
  const {
    stateId,
    isHovered,
    isSelected,
    completedStateIds,
    showNeighbors = false,
    visualStyle,
    choroplethSubTheme,
    terrainProvider = 'shaded_relief',
    isClimateActive = false,
    climateMode = 'temperaturas_frentes',
    stateWeather,
    isGeopoliticaActive = false,
    geopoliticaMetric = 'densidade',
    activeCartographyLayer,
    selectedTerritorySubitemId = null,
    selectedStateId = null,
    focusedClimateStateId = null,
    focusedBiodiversityStateId = null,
    focusedGeopoliticsStateId = null,
    focusedTerritoryStateId = null,
    selectedCampaign = 'livre',
  } = opts;

  const isCompleted = completedStateIds.has(stateId);
  const weather = stateWeather?.[stateId];

  // 0. Quando o modo 'Mostrar Vizinhos' está ativo: Muted Gray puro e fosco
  if (showNeighbors) {
    return {
      stateFill: '#27272a',
      stateFillOpacity: 1.0,
      strokeColor: '#3f3f46',
      strokeWidth: 1.0,
      underglowColor: 'transparent',
      wallGradId: 'url(#extrusionWallGradDefault)',
    };
  }

  // 0.A ISOLAMENTO E FOCO TOTAL NO ESTADO SELECIONADO:
  // Se qualquer estado estiver focado/selecionado (em modos fora de território), os outros 26 estados recebem tratamento "muted"
  // cartográfico elegante (ardósia/índigo suave, preservando a leitura geográfica e as divisas, sem jamais pintar de preto)
  const isCartographyActive = Boolean(activeCartographyLayer && activeCartographyLayer !== 'none');

  const activeIsolatedId =
    selectedStateId ||
    focusedTerritoryStateId ||
    (isClimateActive ? focusedClimateStateId : null) ||
    focusedBiodiversityStateId ||
    focusedGeopoliticsStateId ||
    (isSelected ? stateId : null);

  if (!isCartographyActive && activeIsolatedId && stateId !== activeIsolatedId) {
    if (visualStyle === 'tiles') {
      return {
        stateFill: '#0b1626',
        stateFillOpacity: 0.20,
        strokeColor: '#334155',
        strokeWidth: 0.85,
        underglowColor: 'transparent',
        wallGradId: 'url(#extrusionWallGradDefault)',
      };
    }
    return {
      stateFill: '#0b1626',
      stateFillOpacity: 0.65,
      strokeColor: '#1d2c42',
      strokeWidth: 0.85,
      underglowColor: 'transparent',
      wallGradId: 'url(#extrusionWallGradDefault)',
    };
  }

  // 0.B Camadas Cartográficas Especiais do Território (Bacias Hidrográficas, Biomas & Relevo, Rotas e Dados Coropléticos)
  if (activeCartographyLayer && activeCartographyLayer !== 'none') {
    const isMatchingFilter = isStateMatchingTerritoryFilter(
      activeCartographyLayer,
      selectedTerritorySubitemId,
      stateId
    );

    // Se houver um subitem selecionado e o estado não pertencer a ele, atenua com preenchimento cartográfico suave
    if (!isMatchingFilter) {
      return {
        stateFill: '#0b1626',
        stateFillOpacity: 0.80,
        strokeColor: '#1d2c42',
        strokeWidth: 0.85,
        underglowColor: 'transparent',
        wallGradId: 'url(#extrusionWallGradDefault)',
      };
    }
  }

  if (activeCartographyLayer === 'bacias_hidrograficas') {
    const isSubitemFiltered = Boolean(selectedTerritorySubitemId);
    // Mapeamento das Grandes Bacias Hidrográficas Brasileiras (12 Regiões ANA / IBGE Oficial)
    const basinMap: Record<string, { fill: string; stroke: string; glow: string; wall: string; name: string }> = {
      // 1. Região Hidrográfica Amazônica (Verde Florestal Fluvial ANA)
      AM: { fill: '#1b4d2e', stroke: '#38bdf8', glow: '#0ea5e9', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia Amazônica' },
      AC: { fill: '#1b4d2e', stroke: '#38bdf8', glow: '#0ea5e9', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia Amazônica' },
      RO: { fill: '#1b4d2e', stroke: '#38bdf8', glow: '#0ea5e9', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia Amazônica (Madeira)' },
      RR: { fill: '#1b4d2e', stroke: '#38bdf8', glow: '#0ea5e9', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia Amazônica (Rio Branco)' },
      AP: { fill: '#1b4d2e', stroke: '#38bdf8', glow: '#0ea5e9', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia Amazônica / Foz Oceânica' },
      PA: { fill: '#1b4d2e', stroke: '#38bdf8', glow: '#0ea5e9', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia Amazônica e Foz Marajoara' },

      // 2. Região Hidrográfica Tocantins-Araguaia (Ocre Alaranjado ANA)
      TO: { fill: '#b45309', stroke: '#facc15', glow: '#fde047', wall: 'url(#extrusionWallGradGold)', name: 'Bacia Tocantins-Araguaia' },
      GO: { fill: '#b45309', stroke: '#facc15', glow: '#fde047', wall: 'url(#extrusionWallGradGold)', name: 'Bacia Araguaia e Paranaíba' },
      DF: { fill: '#b45309', stroke: '#fde047', glow: '#fef08a', wall: 'url(#extrusionWallGradGold)', name: 'Berço das Águas (DF)' },

      // 3. Região Hidrográfica do Parnaíba (Anil / Índigo Fluvial ANA)
      PI: { fill: '#3730a3', stroke: '#818cf8', glow: '#a5b4fc', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia do Rio Parnaíba' },

      // 4. Atlântico Nordeste Ocidental (Laranja Cobre ANA)
      MA: { fill: '#c2410c', stroke: '#fb923c', glow: '#fdba74', wall: 'url(#extrusionWallGradGold)', name: 'Atlântico NE Ocidental / Pindaré' },

      // 5. Atlântico Nordeste Oriental (Âmbar Dourado ANA)
      CE: { fill: '#a16207', stroke: '#fde047', glow: '#fef08a', wall: 'url(#extrusionWallGradGold)', name: 'Atlântico NE Oriental (Jaguaribe)' },
      RN: { fill: '#a16207', stroke: '#fde047', glow: '#fef08a', wall: 'url(#extrusionWallGradGold)', name: 'Bacia Piranhas-Açu' },
      PB: { fill: '#a16207', stroke: '#fde047', glow: '#fef08a', wall: 'url(#extrusionWallGradGold)', name: 'Bacia do Rio Paraíba' },

      // 6. Região Hidrográfica do São Francisco (Terracota / Carmesim do Velho Chico ANA)
      MG: { fill: '#9f1239', stroke: '#f87171', glow: '#fca5a5', wall: 'url(#extrusionWallGradGold)', name: 'Nascentes do Velho Chico (Canastra)' },
      BA: { fill: '#9f1239', stroke: '#f87171', glow: '#fca5a5', wall: 'url(#extrusionWallGradGold)', name: 'Bacia do São Francisco (Médio)' },
      PE: { fill: '#9f1239', stroke: '#f87171', glow: '#fca5a5', wall: 'url(#extrusionWallGradGold)', name: 'Submédio São Francisco' },
      AL: { fill: '#9f1239', stroke: '#f87171', glow: '#fca5a5', wall: 'url(#extrusionWallGradGold)', name: 'Foz do São Francisco (Piaçabuçu)' },
      SE: { fill: '#9f1239', stroke: '#f87171', glow: '#fca5a5', wall: 'url(#extrusionWallGradGold)', name: 'Foz do São Francisco (Brejo Grande)' },

      // 7. Região Hidrográfica do Paraguai (Púrpura Pantaneiro ANA)
      MS: { fill: '#701a75', stroke: '#e879f9', glow: '#f0abfc', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia do Rio Paraguai (Pantanal)' },
      MT: { fill: '#701a75', stroke: '#e879f9', glow: '#f0abfc', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia do Paraguai e Teles Pires' },

      // 8. Região Hidrográfica do Paraná (Violeta do Planalto ANA)
      SP: { fill: '#5b21b6', stroke: '#a78bfa', glow: '#c4b5fd', wall: 'url(#extrusionWallGradGold)', name: 'Bacia do Rio Tietê-Paraná' },
      PR: { fill: '#5b21b6', stroke: '#a78bfa', glow: '#c4b5fd', wall: 'url(#extrusionWallGradGold)', name: 'Bacia do Rio Paraná e Iguaçu' },

      // 9. Regiões Hidrográficas do Uruguai e Atlântico Sul (Azul Marinho / Turquesa ANA)
      SC: { fill: '#0f4c81', stroke: '#38bdf8', glow: '#7dd3fc', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia do Rio Uruguai e Itajaí-Açu' },
      RS: { fill: '#0f4c81', stroke: '#38bdf8', glow: '#7dd3fc', wall: 'url(#extrusionWallGradCyan)', name: 'Bacia do Rio Uruguai e Lagoa dos Patos' },

      // 10. Bacias Costeiras do Atlântico Leste / Sudeste (Verde Oliva Fluvial)
      ES: { fill: '#365314', stroke: '#a3e635', glow: '#bef264', wall: 'url(#extrusionWallGradEmerald)', name: 'Bacia do Rio Doce' },
      RJ: { fill: '#365314', stroke: '#a3e635', glow: '#bef264', wall: 'url(#extrusionWallGradEmerald)', name: 'Bacia do Rio Paraíba do Sul' },
    };

    const bInfo = basinMap[stateId] || {
      fill: '#1e293b',
      stroke: '#38bdf8',
      glow: '#0ea5e9',
      wall: 'url(#extrusionWallGradCyan)',
      name: 'Rede Hidrográfica',
    };

    return {
      stateFill: bInfo.fill,
      stateFillOpacity: isSelected ? 0.98 : isHovered ? 0.94 : isSubitemFiltered ? 0.96 : 0.88,
      strokeColor: isSelected ? '#fef08a' : isHovered ? '#ffffff' : isSubitemFiltered ? '#38bdf8' : bInfo.stroke,
      strokeWidth: isSelected ? 3.6 : isHovered ? 2.8 : isSubitemFiltered ? 2.4 : 1.8,
      underglowColor: bInfo.glow,
      wallGradId: bInfo.wall,
    };
  }

  if (activeCartographyLayer === 'rotas_integracao') {
    return getRouteStateStyle(stateId, isSelected, isHovered);
  }

  if (activeCartographyLayer === 'biomas_relevo') {
    const isSubitemFiltered = Boolean(selectedTerritorySubitemId);
    const geoInfo = STATE_GEOGRAPHICAL_DATA[stateId];
    const biomeColors: Record<string, { fill: string; stroke: string; glow: string; wall: string }> = {
      'Amazônia': { fill: '#064e3b', stroke: '#10b981', glow: '#059669', wall: 'url(#extrusionWallGradEmerald)' },
      'Cerrado': { fill: '#78350f', stroke: '#d97706', glow: '#f59e0b', wall: 'url(#extrusionWallGradGold)' },
      'Caatinga': { fill: '#831843', stroke: '#db2777', glow: '#f43f5e', wall: 'url(#extrusionWallGradGold)' },
      'Mata Atlântica': { fill: '#14532d', stroke: '#16a34a', glow: '#22c55e', wall: 'url(#extrusionWallGradEmerald)' },
      'Pantanal': { fill: '#0e7490', stroke: '#06b6d4', glow: '#22d3ee', wall: 'url(#extrusionWallGradCyan)' },
      'Pampa': { fill: '#4c1d95', stroke: '#8b5cf6', glow: '#a855f7', wall: 'url(#extrusionWallGradCyan)' },
    };
    const bColor = (geoInfo?.biome && biomeColors[geoInfo.biome]) || {
      fill: '#1e293b',
      stroke: '#38bdf8',
      glow: '#0ea5e9',
      wall: 'url(#extrusionWallGradCyan)',
    };

    return {
      stateFill: bColor.fill,
      stateFillOpacity: isSelected ? 0.98 : isHovered ? 0.94 : isSubitemFiltered ? 0.96 : 0.85,
      strokeColor: isSelected ? '#fef08a' : isHovered ? '#ffffff' : isSubitemFiltered ? '#34d399' : bColor.stroke,
      strokeWidth: isSelected ? 3.6 : isHovered ? 2.8 : isSubitemFiltered ? 2.4 : 1.8,
      underglowColor: bColor.glow,
      wallGradId: bColor.wall,
    };
  }

  // 1. Estilos específicos para o estado isolado focado
  if (activeIsolatedId && stateId === activeIsolatedId) {
    if (focusedGeopoliticsStateId && stateId === focusedGeopoliticsStateId) {
      return {
        stateFill: '#0891b2',
        stateFillOpacity: 0.98,
        strokeColor: '#22d3ee',
        strokeWidth: 3.6,
        underglowColor: '#06b6d4',
        wallGradId: 'url(#extrusionWallGradCyan)',
      };
    }

    if (focusedBiodiversityStateId && stateId === focusedBiodiversityStateId) {
      return {
        stateFill: '#065f46',
        stateFillOpacity: 0.98,
        strokeColor: '#34d399',
        strokeWidth: 3.6,
        underglowColor: '#10b981',
        wallGradId: 'url(#extrusionWallGradEmerald)',
      };
    }

    if (focusedClimateStateId && stateId === focusedClimateStateId) {
      return {
        stateFill: '#0284c7',
        stateFillOpacity: 0.98,
        strokeColor: '#38bdf8',
        strokeWidth: 3.6,
        underglowColor: '#0ea5e9',
        wallGradId: 'url(#extrusionWallGradCyan)',
      };
    }

    if (focusedTerritoryStateId && stateId === focusedTerritoryStateId) {
      return {
        stateFill: '#0284c7',
        stateFillOpacity: 0.98,
        strokeColor: '#fef08a',
        strokeWidth: 3.6,
        underglowColor: '#0ea5e9',
        wallGradId: 'url(#extrusionWallGradCyan)',
      };
    }
  }

  let stateFill = 'transparent';
  let stateFillOpacity = 0.0;
  let strokeColor = visualStyle === 'tiles' ? '#f59e0b' : '#38bdf8';
  let strokeWidth = 1.0;
  let underglowColor = '#f59e0b';
  let wallGradId = 'url(#extrusionWallGradDefault)';

  if (isClimateActive) {
    if (climateMode === 'temperaturas_frentes') {
      const temp = weather?.temperature ?? 24;
      stateFill = getEcmwfTempColor(temp).hex;
      stateFillOpacity = isSelected ? 0.98 : isHovered ? 0.94 : 0.78;
      strokeColor = '#ffffff';
      strokeWidth = isSelected ? 3.2 : isHovered ? 2.6 : 1.6;
      underglowColor = temp > 28 ? '#f97316' : temp > 20 ? '#38bdf8' : '#60a5fa';
      wallGradId = temp > 28 ? 'url(#extrusionWallGradGold)' : 'url(#extrusionWallGradCyan)';
    } else if (climateMode === 'previsao_tempo') {
      const fDay = weather?.forecast?.[0];
      const maxTemp = fDay?.maxTemp ?? weather?.maxTemperature ?? weather?.temperature ?? 28;
      stateFill = getEcmwfTempColor(maxTemp).hex;
      stateFillOpacity = isSelected ? 0.98 : isHovered ? 0.94 : 0.82;
      strokeColor = isSelected ? '#ffffff' : isHovered ? '#fde047' : '#ffffff';
      strokeWidth = isSelected ? 3.4 : isHovered ? 2.8 : 1.8;
      underglowColor = maxTemp > 28 ? '#f97316' : maxTemp > 20 ? '#38bdf8' : '#60a5fa';
      wallGradId = maxTemp > 28 ? 'url(#extrusionWallGradGold)' : 'url(#extrusionWallGradCyan)';
    } else if (climateMode === 'precipitacao_zcas') {
      const rain = weather?.precipitation ?? 0;
      stateFill =
        rain > 60
          ? '#0284c7'
          : rain > 30
          ? '#0ea5e9'
          : rain > 10
          ? '#38bdf8'
          : rain > 2
          ? '#059669'
          : '#d97706';
      stateFillOpacity = isSelected ? 0.96 : isHovered ? 0.90 : 0.72;
      strokeColor = isSelected ? '#fef08a' : '#ffffff';
      strokeWidth = isSelected ? 3.2 : isHovered ? 2.6 : 1.5;
      underglowColor = rain > 30 ? '#00f0ff' : '#38bdf8';
      wallGradId = 'url(#extrusionWallGradCyan)';
    } else if (climateMode === 'ventos_aliseos') {
      const isFlyingRiverCorridor = ['AM', 'RO', 'MT', 'MS', 'SP', 'PR', 'SC'].includes(stateId);
      stateFill = isFlyingRiverCorridor ? '#10b981' : '#0369a1';
      stateFillOpacity = isSelected ? 0.94 : isHovered ? 0.88 : 0.68;
      strokeColor = isSelected ? '#fef08a' : '#ffffff';
      strokeWidth = isSelected ? 3.2 : isHovered ? 2.6 : 1.5;
      underglowColor = isFlyingRiverCorridor ? '#10b981' : '#0284c7';
      wallGradId = isFlyingRiverCorridor ? 'url(#extrusionWallGradEmerald)' : 'url(#extrusionWallGradCyan)';
    } else if (climateMode === 'el_nino_la_nina') {
      const isDroughtZone = ['AM', 'PA', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'].includes(stateId);
      const isFloodZone = ['RS', 'SC', 'PR'].includes(stateId);
      stateFill = isDroughtZone ? '#ef4444' : isFloodZone ? '#06b6d4' : '#1e293b';
      stateFillOpacity = isSelected ? 0.96 : isHovered ? 0.90 : 0.70;
      strokeColor = isSelected ? '#fef08a' : '#ffffff';
      strokeWidth = isSelected ? 3.2 : isHovered ? 2.6 : 1.5;
      underglowColor = isDroughtZone ? '#ef4444' : isFloodZone ? '#06b6d4' : '#64748b';
      wallGradId = isDroughtZone ? 'url(#extrusionWallGradGold)' : 'url(#extrusionWallGradCyan)';
    }
  } else if (isGeopoliticaActive) {
    const profile = BRAZIL_STATES_GEOPOLITICS[stateId];
    if (profile) {
      switch (geopoliticaMetric) {
        case 'densidade': {
          const dens = profile.demografia.densidadeHabKm2;
          if (dens > 150) {
            stateFill = '#9f1239';
            underglowColor = '#f43f5e';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else if (dens > 70) {
            stateFill = '#e11d48';
            underglowColor = '#fb7185';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else if (dens > 30) {
            stateFill = '#ea580c';
            underglowColor = '#f97316';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else if (dens > 15) {
            stateFill = '#d97706';
            underglowColor = '#fbbf24';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else if (dens > 5) {
            stateFill = '#0d9488';
            underglowColor = '#2dd4bf';
            wallGradId = 'url(#extrusionWallGradEmerald)';
          } else {
            stateFill = '#0284c7';
            underglowColor = '#38bdf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          }
          break;
        }

        case 'partidos': {
          const corPartido = profile.politica.partidoCorHex;
          stateFill = corPartido || '#2563eb';
          underglowColor = stateFill;
          wallGradId =
            profile.politica.siglaPartido === 'PT'
              ? 'url(#extrusionWallGradGold)'
              : profile.politica.siglaPartido === 'MDB'
              ? 'url(#extrusionWallGradEmerald)'
              : 'url(#extrusionWallGradCyan)';
          break;
        }

        case 'miscigenacao': {
          const pardo = profile.etnia.pardoPercent;
          const branco = profile.etnia.brancoPercent;
          const preto = profile.etnia.pretoPercent;
          const indigena = profile.etnia.indigenaPercent;

          if (indigena > 10 || stateId === 'RR') {
            stateFill = '#059669';
            underglowColor = '#10b981';
            wallGradId = 'url(#extrusionWallGradEmerald)';
          } else if (preto > 18 || (stateId === 'BA' && preto > 20)) {
            stateFill = '#7e22ce';
            underglowColor = '#a855f7';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else if (branco > pardo) {
            stateFill = '#0284c7';
            underglowColor = '#38bdf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else {
            stateFill = '#b45309';
            underglowColor = '#f59e0b';
            wallGradId = 'url(#extrusionWallGradGold)';
          }
          break;
        }

        case 'genero': {
          const mul = profile.genero.mulheresPercent;
          if (mul >= 52.2) {
            stateFill = '#be185d';
            underglowColor = '#ec4899';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else if (mul >= 51.5) {
            stateFill = '#7c3aed';
            underglowColor = '#a855f7';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else if (mul >= 50.5) {
            stateFill = '#4f46e5';
            underglowColor = '#818cf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else {
            stateFill = '#0284c7';
            underglowColor = '#38bdf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          }
          break;
        }

        case 'mortalidade': {
          const exp = profile.vitais.expectativaVidaAnos;
          if (exp >= 78.5) {
            stateFill = '#059669';
            underglowColor = '#10b981';
            wallGradId = 'url(#extrusionWallGradEmerald)';
          } else if (exp >= 76.0) {
            stateFill = '#0284c7';
            underglowColor = '#38bdf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else if (exp >= 73.0) {
            stateFill = '#d97706';
            underglowColor = '#f59e0b';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else {
            stateFill = '#e11d48';
            underglowColor = '#fb7185';
            wallGradId = 'url(#extrusionWallGradGold)';
          }
          break;
        }

        case 'analfabetismo': {
          const alf = profile.educacao.taxaAlfabetizacao;
          if (alf >= 96.0) {
            stateFill = '#059669';
            underglowColor = '#10b981';
            wallGradId = 'url(#extrusionWallGradEmerald)';
          } else if (alf >= 92.0) {
            stateFill = '#0284c7';
            underglowColor = '#38bdf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else if (alf >= 86.0) {
            stateFill = '#d97706';
            underglowColor = '#f59e0b';
            wallGradId = 'url(#extrusionWallGradGold)';
          } else {
            stateFill = '#ea580c';
            underglowColor = '#f97316';
            wallGradId = 'url(#extrusionWallGradGold)';
          }
          break;
        }

        case 'natalidade': {
          const nat = profile.vitais.taxaNatalidadePorMil;
          if (nat >= 16.5) {
            stateFill = '#06b6d4';
            underglowColor = '#22d3ee';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else if (nat >= 13.0) {
            stateFill = '#0284c7';
            underglowColor = '#38bdf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else if (nat >= 10.0) {
            stateFill = '#4f46e5';
            underglowColor = '#818cf8';
            wallGradId = 'url(#extrusionWallGradCyan)';
          } else {
            stateFill = '#7c3aed';
            underglowColor = '#a855f7';
            wallGradId = 'url(#extrusionWallGradCyan)';
          }
          break;
        }
      }
    }

    stateFillOpacity = isSelected ? 0.98 : isHovered ? 0.94 : 0.82;
    strokeColor = isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#fde047';
    strokeWidth = isSelected ? 3.4 : isHovered ? 2.6 : 1.4;
  } else {
    // Modo Aventura e visualização padrão do mapa por regiões/campanha
    const stateRegion = getStateRegion(stateId);
    const isRegionCampaignActive = selectedCampaign && selectedCampaign !== 'todos' && selectedCampaign !== 'livre';
    const isStateInCampaign = !isRegionCampaignActive || stateRegion === selectedCampaign;

    if (!isStateInCampaign) {
      // Estado fora da campanha regional ativa: Muted slate cartográfico elegante com divisas visíveis
      return {
        stateFill: '#0b1626',
        stateFillOpacity: 0.82,
        strokeColor: '#1d2c42',
        strokeWidth: 0.85,
        underglowColor: 'transparent',
        wallGradId: 'url(#extrusionWallGradDefault)',
      };
    }

    // Cores temáticas do modo Aventura por Região
    let baseRegionFill = REGION_COLORS_MAP[stateRegion] || '#0284c7';
    let baseRegionStroke = '#fde047';
    let baseWallGrad = 'url(#extrusionWallGradDefault)';

    if (stateRegion === 'norte') {
      baseRegionFill = '#0d4d38';
      baseRegionStroke = '#34d399';
      baseWallGrad = 'url(#extrusionWallGradEmerald)';
    } else if (stateRegion === 'nordeste') {
      baseRegionFill = '#7c2d12';
      baseRegionStroke = '#f97316';
      baseWallGrad = 'url(#extrusionWallGradGold)';
    } else if (stateRegion === 'centro_oeste') {
      baseRegionFill = '#78350f';
      baseRegionStroke = '#facc15';
      baseWallGrad = 'url(#extrusionWallGradGold)';
    } else if (stateRegion === 'sudeste') {
      baseRegionFill = '#1e3a8a';
      baseRegionStroke = '#60a5fa';
      baseWallGrad = 'url(#extrusionWallGradCyan)';
    } else if (stateRegion === 'sul') {
      baseRegionFill = '#581c87';
      baseRegionStroke = '#c084fc';
      baseWallGrad = 'url(#extrusionWallGradCyan)';
    }

    if (isCompleted) {
      stateFill = isSelected ? '#a16207' : isHovered ? '#854d0e' : '#0f392b';
      stateFillOpacity = isSelected ? 0.98 : isHovered ? 0.92 : 0.75;
      strokeColor = isSelected ? '#ffffff' : isHovered ? '#fde047' : '#34d399';
      strokeWidth = isSelected ? 3.4 : isHovered ? 2.8 : 1.8;
      underglowColor = '#10b981';
      wallGradId = 'url(#extrusionWallGradGold)';
    } else {
      stateFill = visualStyle === 'tiles' ? (isHovered || isSelected ? '#fbbf24' : 'transparent') : baseRegionFill;
      stateFillOpacity =
        visualStyle === 'tiles'
          ? isSelected
            ? 0.50
            : isHovered
            ? 0.40
            : 0.0
          : isSelected
          ? 0.96
          : isHovered
          ? 0.90
          : 0.78;

      strokeColor = isSelected
        ? '#fef08a'
        : isHovered
        ? '#fde047'
        : baseRegionStroke;

      strokeWidth = isSelected ? 3.2 : isHovered ? 2.6 : 1.4;
      underglowColor = isSelected ? '#facc15' : '#f59e0b';
      wallGradId = baseWallGrad;
    }
  }

  return {
    stateFill,
    stateFillOpacity,
    strokeColor,
    strokeWidth,
    underglowColor,
    wallGradId,
  };
}
