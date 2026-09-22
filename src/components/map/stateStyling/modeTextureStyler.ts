// src/components/map/stateStyling/modeTextureStyler.ts
// Determina a textura vetorial procedural correspondente à Skill do modo ativo
// Atua na microengine cartográfica ligando Preenchimento <-> Shaders por Skills

import { AppMainMode } from '../../../types';
import { ClimateMode } from '../ClimatePhenomenaLayer';
import { CartographyLayerMode } from '../../../types/cartography';
import { GeopoliticaMetricKey } from '../../../types/geopolitica';

export interface GetStateTextureOptions {
  stateId: string;
  mainMode: AppMainMode;
  climateMode?: ClimateMode;
  isElNinoActive?: boolean;
  elNinoPhase?: 'El Niño' | 'La Niña' | 'Neutro';
  activeCartographyLayer?: CartographyLayerMode;
  geopoliticaMetric?: GeopoliticaMetricKey;
  isSelected?: boolean;
  isHovered?: boolean;
}

/**
 * Retorna o ID da textura SVG (ex: 'url(#pattern-canopy-dense)') para o estado e modo ativo
 */
export function getStateTexturePattern(opts: GetStateTextureOptions): string | null {
  const {
    stateId,
    mainMode,
    climateMode,
    elNinoPhase = 'El Niño',
    activeCartographyLayer,
    geopoliticaMetric,
  } = opts;

  switch (mainMode) {
    case 'clima': {
      if (climateMode === 'el_nino_la_nina') {
        const isNorteNordeste = [
          'AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO',
          'AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE',
        ].includes(stateId);
        const isSul = ['PR', 'RS', 'SC'].includes(stateId);

        if (elNinoPhase === 'El Niño') {
          if (isNorteNordeste) return 'url(#pattern-enso-drought)';
          if (isSul) return 'url(#pattern-enso-flood)';
          return 'url(#pattern-thermal-isolines)';
        } else if (elNinoPhase === 'La Niña') {
          if (isNorteNordeste) return 'url(#pattern-la-nina-rain)';
          if (isSul) return 'url(#pattern-enso-drought)';
          return 'url(#pattern-thermal-isolines)';
        }
        return 'url(#pattern-thermal-isolines)';
      }

      if (climateMode === 'temperaturas_frentes' || climateMode === 'previsao_tempo') {
        return 'url(#pattern-thermal-isolines)';
      }
      return null;
    }

    case 'biodiversidade': {
      // Biomas dominantes por estado
      if (['AM', 'PA', 'AC', 'RO', 'RR', 'AP'].includes(stateId)) {
        return 'url(#pattern-canopy-dense)'; // Amazônia
      }
      if (['RJ', 'ES', 'SC', 'PR'].includes(stateId)) {
        return 'url(#pattern-canopy-dense)'; // Mata Atlântica
      }
      if (['CE', 'RN', 'PB', 'PE', 'PI', 'AL', 'SE'].includes(stateId)) {
        return 'url(#pattern-caatinga-thorn)'; // Caatinga
      }
      if (['RS'].includes(stateId)) {
        return 'url(#pattern-pampa-grass)'; // Pampa
      }
      if (['MS'].includes(stateId)) {
        return 'url(#pattern-pantanal-wetland)'; // Pantanal
      }
      if (['MT'].includes(stateId)) {
        return 'url(#pattern-cerrado-savanna)'; // Cerrado/Pantanal
      }
      // Padrão para estados centrais de Cerrado (GO, DF, TO, MG, BA, SP)
      return 'url(#pattern-cerrado-savanna)';
    }

    case 'territorio': {
      if (activeCartographyLayer === 'bacias_hidrograficas') {
        return 'url(#pattern-hydro-basin)';
      }
      if (activeCartographyLayer === 'rotas_integracao') {
        return 'url(#pattern-rail-grid)';
      }
      return 'url(#pattern-relief-contour)';
    }

    case 'geopolitica': {
      if (geopoliticaMetric === 'densidade') {
        if (['DF', 'RJ', 'SP', 'AL', 'SE', 'PE'].includes(stateId)) {
          return 'url(#pattern-density-high)';
        }
        if (['MG', 'ES', 'PR', 'SC', 'RS', 'PB', 'RN', 'CE', 'BA'].includes(stateId)) {
          return 'url(#pattern-density-mid)';
        }
        return null;
      }
      return 'url(#pattern-geiger-stripes)';
    }

    case 'musicalidades': {
      return 'url(#pattern-vinyl-grooves)';
    }

    case 'aventura': {
      return 'url(#pattern-adventure-rhumb)';
    }

    default:
      return null;
  }
}
