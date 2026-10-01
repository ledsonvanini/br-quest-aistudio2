/**
 * Dicionário e Utilitário de Resolução Fonética e Normalizada de UFs Brasileiras
 * Projeto: BR Quest
 */

export const BRAZIL_STATE_NAME_TO_UF: Record<string, string> = {
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  'mato grosso do sul': 'MS',
  'distrito federal': 'DF',
  'espirito santo': 'ES',
  'santa catarina': 'SC',
  'rio de janeiro': 'RJ',
  'minas gerais': 'MG',
  'mato grosso': 'MT',
  'pernambuco': 'PE',
  'paraiba': 'PB',
  'maranhao': 'MA',
  'rondonia': 'RO',
  'amazonas': 'AM',
  'tocantins': 'TO',
  'parana': 'PR',
  'alagoas': 'AL',
  'sergipe': 'SE',
  'roraima': 'RR',
  'brasilia': 'DF',
  'sao paulo': 'SP',
  'ceara': 'CE',
  'bahia': 'BA',
  'goias': 'GO',
  'amapa': 'AP',
  'piaui': 'PI',
  'acre': 'AC',
  'para': 'PA',
};

/**
 * Normaliza o nome do estado vindo de geocodificadores (Nominatim/IBGE)
 * e resolve para a sigla oficial de 2 caracteres (UF).
 */
export function resolveStateUfFromName(stateName: string): string | null {
  if (!stateName) return null;
  const normalized = stateName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // 1. Match exato
  if (BRAZIL_STATE_NAME_TO_UF[normalized]) {
    return BRAZIL_STATE_NAME_TO_UF[normalized];
  }

  // 2. Match por limites de palavra
  for (const [name, uf] of Object.entries(BRAZIL_STATE_NAME_TO_UF)) {
    const regex = new RegExp(`\\b${name}\\b`, 'i');
    if (regex.test(normalized) || normalized.includes(name)) {
      return uf;
    }
  }

  return null;
}
