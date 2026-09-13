import { MapVisualStyle, ChoroplethSubTheme, getStateColor } from '../../../lib/mapColorScales';
import { StateWeatherData, getEcmwfTempColor } from '../../../services/climateService';
import { ClimateMode } from '../ClimatePhenomenaLayer';
import { GeopoliticaMetricKey } from '../../../types/geopolitica';
import { BRAZIL_STATES_GEOPOLITICS } from '../../../data/geopoliticaData';
import { TerrainTileProvider } from '../ClippedMapTilesLayer';

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
  focusedClimateStateId?: string | null;
  focusedBiodiversityStateId?: string | null;
  focusedGeopoliticsStateId?: string | null;
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
    focusedClimateStateId = null,
    focusedBiodiversityStateId = null,
    focusedGeopoliticsStateId = null,
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

  // 1. Estado focado/isolado
  const activeIsolatedId =
    (isClimateActive ? focusedClimateStateId : null) ||
    focusedBiodiversityStateId ||
    focusedGeopoliticsStateId;

  if (activeIsolatedId) {
    if (stateId !== activeIsolatedId) {
      return {
        stateFill: '#27272a',
        stateFillOpacity: 1.0,
        strokeColor: '#52525b',
        strokeWidth: 1.2,
        underglowColor: 'transparent',
        wallGradId: 'url(#extrusionWallGradDefault)',
      };
    }

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
    const colors = getStateColor(
      stateId,
      visualStyle,
      choroplethSubTheme,
      isCompleted,
      isHovered,
      isSelected
    );
    stateFill = visualStyle === 'tiles' ? (isHovered || isSelected ? '#fbbf24' : 'transparent') : colors.fill;
    stateFillOpacity =
      visualStyle === 'tiles'
        ? isSelected
          ? 0.50
          : isHovered
          ? 0.40
          : isCompleted
          ? 0.25
          : 0.0
        : isSelected
        ? 0.96
        : isHovered
        ? 0.90
        : isCompleted
        ? 0.45
        : 0.28;

    strokeColor = isSelected
      ? '#fef08a'
      : isHovered
      ? '#fde047'
      : isCompleted
      ? '#34d399'
      : visualStyle === 'tiles'
      ? '#f59e0b'
      : colors.stroke;

    strokeWidth = isSelected ? 3.2 : isHovered ? 2.6 : 1.4;
    underglowColor = isCompleted ? '#10b981' : isSelected ? '#facc15' : '#f59e0b';
    wallGradId = isCompleted
      ? 'url(#extrusionWallGradEmerald)'
      : visualStyle === 'tiles' || terrainProvider === 'voyager_parchment'
      ? 'url(#extrusionWallGradGold)'
      : 'url(#extrusionWallGradDefault)';
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
