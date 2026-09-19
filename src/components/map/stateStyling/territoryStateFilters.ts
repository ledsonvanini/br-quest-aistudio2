/**
 * territoryStateFilters.ts
 * Mapeamento oficial e unificado entre Feições Territoriais
 * (Bacias ANA, Biomas IBGE, Corredores Logísticos ANTT/DNIT) e as 27 UFs do Brasil.
 */

import { CartographyLayerMode } from '../../../types/cartography';

/**
 * 1. Mapeamento das 12 Regiões Hidrográficas da ANA para Estados
 */
export const BASIN_TO_STATES_MAP: Record<string, string[]> = {
  amazonica: ['AM', 'AC', 'RO', 'RR', 'AP', 'PA', 'MT'],
  tocantins_araguaia: ['TO', 'GO', 'PA', 'MA', 'MT', 'DF'],
  sao_francisco: ['BA', 'MG', 'PE', 'AL', 'SE', 'GO', 'DF'],
  parana: ['SP', 'PR', 'MS', 'MG', 'GO', 'SC', 'DF'],
  paraguai: ['MS', 'MT'],
  uruguai: ['RS', 'SC'],
  parnaiba: ['PI', 'MA', 'CE'],
  atlantico_nordeste_oriental: ['CE', 'RN', 'PB', 'PE', 'AL'],
  atlantico_nordeste_ocidental: ['MA', 'PA'],
  atlantico_leste: ['BA', 'MG', 'ES', 'SE'],
  atlantico_sudeste: ['RJ', 'SP', 'MG', 'ES', 'PR'],
  atlantico_sul: ['RS', 'SC', 'PR'],
};

/**
 * 2. Mapeamento dos 6 Biomas Continentais do IBGE para Estados
 */
export const BIOME_TO_STATES_MAP: Record<string, string[]> = {
  amazonia: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'MT', 'MA', 'TO'],
  cerrado: ['GO', 'TO', 'MT', 'MS', 'MG', 'BA', 'MA', 'PI', 'SP', 'PR', 'DF'],
  mata_atlantica: ['RS', 'SC', 'PR', 'SP', 'RJ', 'ES', 'MG', 'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'MS', 'GO'],
  caatinga: ['CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'PI', 'MG'],
  pampa: ['RS'],
  pantanal: ['MT', 'MS'],
};

/**
 * 3. Mapeamento de Rotas, Eixos e Modais Logísticos para Estados
 */
export const ROUTE_TO_STATES_MAP: Record<string, string[]> = {
  rodovias: ['RS', 'SC', 'PR', 'SP', 'RJ', 'ES', 'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA', 'TO', 'PA', 'GO', 'DF', 'MT', 'MS', 'MG'],
  hidrovias: ['AM', 'PA', 'RO', 'MS', 'SP', 'PR', 'MG', 'GO'],
  ferrovias: ['MA', 'PA', 'TO', 'GO', 'MG', 'SP', 'PR', 'SC', 'RJ', 'ES', 'MS', 'MT'],
  portos: ['AM', 'PA', 'MA', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'ES', 'RJ', 'SP', 'PR', 'SC', 'RS'],
  br101: ['RS', 'SC', 'PR', 'SP', 'RJ', 'ES', 'BA', 'SE', 'AL', 'PE', 'PB', 'RN'],
  br_101: ['RS', 'SC', 'PR', 'SP', 'RJ', 'ES', 'BA', 'SE', 'AL', 'PE', 'PB', 'RN'],
  br116: ['RS', 'SC', 'PR', 'SP', 'RJ', 'MG', 'BA', 'PE', 'PB', 'CE'],
  br_116: ['RS', 'SC', 'PR', 'SP', 'RJ', 'MG', 'BA', 'PE', 'PB', 'CE'],
  br153: ['RS', 'SC', 'PR', 'SP', 'MG', 'GO', 'TO', 'PA'],
  br_153: ['RS', 'SC', 'PR', 'SP', 'MG', 'GO', 'TO', 'PA'],
  br364: ['SP', 'MG', 'GO', 'MT', 'RO', 'AC'],
  br_364: ['SP', 'MG', 'GO', 'MT', 'RO', 'AC'],
  'hidrovia-madeira': ['AM', 'RO', 'PA', 'MT'],
  hidrovia_madeira_amazonas: ['AM', 'RO', 'PA', 'MT'],
  'hidrovia-tiete': ['SP', 'PR', 'MS', 'MG', 'GO'],
  hidrovia_tiete_parana: ['SP', 'PR', 'MS', 'MG', 'GO'],
  'ferrovia-norte-sul': ['MA', 'TO', 'GO', 'MG', 'SP'],
  ferrovia_norte_sul: ['MA', 'TO', 'GO', 'MG', 'SP'],
  'ferrovia-carajas': ['PA', 'MA'],
  ferrovia_carajas: ['PA', 'MA'],
  'malha-paulista': ['SP', 'MS'],
  'ferrovia-graos': ['MT', 'PA', 'GO', 'SP'],
  'porto-santos': ['SP'],
  'porto-paranagua': ['PR'],
  'porto-itaqui': ['MA'],
  'porto-rio-grande': ['RS'],
  'porto-suape': ['PE'],
  'porto-pecem': ['CE'],
  'porto-barcarena': ['PA'],
  'porto-itaguai': ['RJ'],
  'porto-tubarao': ['ES'],
  'porto-salvador': ['BA'],
  'porto-itajaia': ['SC'],
};

/**
 * Verifica se um estado pertence ao filtro selecionado
 */
export function isStateMatchingTerritoryFilter(
  activeLayer: CartographyLayerMode | undefined,
  selectedSubitemId: string | null | undefined,
  stateId: string
): boolean {
  if (!activeLayer || activeLayer === 'none' || !selectedSubitemId) {
    return true;
  }

  if (activeLayer === 'bacias_hidrograficas') {
    const states = BASIN_TO_STATES_MAP[selectedSubitemId];
    return states ? states.includes(stateId) : true;
  }

  if (activeLayer === 'biomas_relevo') {
    const states = BIOME_TO_STATES_MAP[selectedSubitemId];
    return states ? states.includes(stateId) : true;
  }

  if (activeLayer === 'rotas_integracao') {
    const states = ROUTE_TO_STATES_MAP[selectedSubitemId];
    return states ? states.includes(stateId) : true;
  }

  return true;
}
