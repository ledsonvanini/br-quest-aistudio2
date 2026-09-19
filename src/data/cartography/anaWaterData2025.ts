/**
 * anaWaterData2025.ts
 * Repositório Central de Dados Hídricos e Geomorfológicos do Brasil (Edição Atualizada 2025/2026).
 * Integração: ANA (Agência Nacional de Águas / SNIRH / Dados Abertos) + IBGE (Jurandyr Ross 1989/2024).
 * Portal Público Oficial: https://dadosabertos.ana.gov.br/search
 */

import { StateAnaWaterBalance2025 } from '../../types/anaWaterTypes';
import { ANA_WATER_NORTH_CENTRAL } from './anaWaterDataNorthCentral';
import { ANA_WATER_NORTHEAST } from './anaWaterDataNortheast';
import { ANA_WATER_SOUTH_EAST } from './anaWaterDataSouthEast';

export const ALL_STATES_ANA_WATER_2025: Record<string, StateAnaWaterBalance2025> = {
  ...ANA_WATER_NORTH_CENTRAL,
  ...ANA_WATER_NORTHEAST,
  ...ANA_WATER_SOUTH_EAST,
};

/**
 * Retorna as estatísticas consolidadas da ANA 2025/2026 para um estado
 */
export function getStateAnaWaterData(stateId: string | null | undefined): StateAnaWaterBalance2025 | null {
  if (!stateId) return null;
  const upperId = stateId.toUpperCase().trim();
  return ALL_STATES_ANA_WATER_2025[upperId] || null;
}

/**
 * Resumo nacional dos recursos hídricos (ANA 2025/2026)
 */
export const BRAZIL_ANA_NATIONAL_SUMMARY_2025 = {
  edition: 'Conjuntura dos Recursos Hídricos no Brasil 2025/2026 (Relatório Síntese ANA)',
  portalUrl: 'https://dadosabertos.ana.gov.br/search',
  totalAverageDischargeM3s: 180000,
  globalFreshwaterSharePercent: 12.0,
  consumptiveUseTotalM3s: 2150.0,
  majorUsesShare: {
    irrigacaoAgricola: 50.3,
    abastecimentoUrbano: 22.3,
    industriaTransformacao: 9.9,
    dessedentacaoAnimal: 8.4,
    termoeletricas: 5.8,
    mineracaoERurais: 3.3,
  },
  waterSecurityScoreBr: 'Adequado com Alertas Regionais no Semiárido e Bacias Metropolitanas',
};
