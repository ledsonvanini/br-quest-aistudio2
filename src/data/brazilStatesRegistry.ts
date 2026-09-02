export type BrazilRegion = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export interface BrazilStateInfo {
  id: string; // e.g. 'RS', 'SP', 'AM'
  name: string; // e.g. 'Rio Grande do Sul'
  capital: string; // e.g. 'Porto Alegre'
  region: BrazilRegion;
  coatOfArmsUrl: string;
  flagSymbol: string;
  flagUrl: string;
  centroid: [number, number]; // [x, y] in canvas 2560x1440 coordinates
}

export const BRAZIL_REGIONS: BrazilRegion[] = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
];

export const BRAZIL_STATES_REGISTRY: Record<string, BrazilStateInfo> = {
  // ==========================================
  // REGIÃO NORTE (7 Estados)
  // ==========================================
  AC: {
    id: 'AC',
    name: 'Acre',
    capital: 'Rio Branco',
    region: 'Norte',
    coatOfArmsUrl: '/brasao_br/brasao-do-acre-300x295.png',
    flagSymbol: '⭐',
    flagUrl: '/flags/ac.svg',
    centroid: [814, 582],
  },
  AP: {
    id: 'AP',
    name: 'Amapá',
    capital: 'Macapá',
    region: 'Norte',
    coatOfArmsUrl: '/brasao_br/brasao-do-amapa-260x300.png',
    flagSymbol: '☀️',
    flagUrl: '/flags/ap.svg',
    centroid: [1306, 321],
  },
  AM: {
    id: 'AM',
    name: 'Amazonas',
    capital: 'Manaus',
    region: 'Norte',
    coatOfArmsUrl: '/brasao_br/brasao-do-amazonas-712x1024.png',
    flagSymbol: '🌿',
    flagUrl: '/flags/am.svg',
    centroid: [944, 435],
  },
  PA: {
    id: 'PA',
    name: 'Pará',
    capital: 'Belém',
    region: 'Norte',
    coatOfArmsUrl: '',
    flagSymbol: '⭐',
    flagUrl: '/flags/pa.svg',
    centroid: [1230, 397],
  },
  RO: {
    id: 'RO',
    name: 'Rondônia',
    capital: 'Porto Velho',
    region: 'Norte',
    coatOfArmsUrl: '',
    flagSymbol: '🌟',
    flagUrl: '/flags/ro.svg',
    centroid: [1003, 648],
  },
  RR: {
    id: 'RR',
    name: 'Roraima',
    capital: 'Boa Vista',
    region: 'Norte',
    coatOfArmsUrl: '',
    flagSymbol: '⛰️',
    flagUrl: '/flags/rr.svg',
    centroid: [1043, 273],
  },
  TO: {
    id: 'TO',
    name: 'Tocantins',
    capital: 'Palmas',
    region: 'Norte',
    coatOfArmsUrl: '',
    flagSymbol: '☀️',
    flagUrl: '/flags/to.svg',
    centroid: [1403, 613],
  },

  // ==========================================
  // REGIÃO NORDESTE (9 Estados)
  // ==========================================
  AL: {
    id: 'AL',
    name: 'Alagoas',
    capital: 'Maceió',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-de-alagoas-272x300.png',
    flagSymbol: '🌊',
    flagUrl: '/flags/al.svg',
    centroid: [1706, 597],
  },
  BA: {
    id: 'BA',
    name: 'Bahia',
    capital: 'Salvador',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-da-bahia-256x300.png',
    flagSymbol: '⚓',
    flagUrl: '/flags/ba.svg',
    centroid: [1576, 677],
  },
  CE: {
    id: 'CE',
    name: 'Ceará',
    capital: 'Fortaleza',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-do-ceara-753x1024.png',
    flagSymbol: '☀️',
    flagUrl: '/flags/ce.svg',
    centroid: [1638, 490],
  },
  MA: {
    id: 'MA',
    name: 'Maranhão',
    capital: 'São Luís',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-maranhao-estado-768x768.png',
    flagSymbol: '🌴',
    flagUrl: '/flags/ma.svg',
    centroid: [1482, 476],
  },
  PB: {
    id: 'PB',
    name: 'Paraíba',
    capital: 'João Pessoa',
    region: 'Nordeste',
    coatOfArmsUrl: '',
    flagSymbol: '☀️',
    flagUrl: '/flags/pb.svg',
    centroid: [1706, 536],
  },
  PE: {
    id: 'PE',
    name: 'Pernambuco',
    capital: 'Recife',
    region: 'Nordeste',
    coatOfArmsUrl: '',
    flagSymbol: '🌈',
    flagUrl: '/flags/pe.svg',
    centroid: [1701, 577],
  },
  PI: {
    id: 'PI',
    name: 'Piauí',
    capital: 'Teresina',
    region: 'Nordeste',
    coatOfArmsUrl: '',
    flagSymbol: '🌾',
    flagUrl: '/flags/pi.svg',
    centroid: [1549, 548],
  },
  RN: {
    id: 'RN',
    name: 'Rio Grande do Norte',
    capital: 'Natal',
    region: 'Nordeste',
    coatOfArmsUrl: '',
    flagSymbol: '🥥',
    flagUrl: '/flags/rn.svg',
    centroid: [1711, 498],
  },
  SE: {
    id: 'SE',
    name: 'Sergipe',
    capital: 'Aracaju',
    region: 'Nordeste',
    coatOfArmsUrl: '',
    flagSymbol: '⭐',
    flagUrl: '/flags/se.svg',
    centroid: [1690, 623],
  },

  // ==========================================
  // REGIÃO CENTRO-OESTE (4 Estados/DF)
  // ==========================================
  DF: {
    id: 'DF',
    name: 'Distrito Federal',
    capital: 'Brasília',
    region: 'Centro-Oeste',
    coatOfArmsUrl: '/brasao_br/brasao-do-distrito-federal-768x901.png',
    flagSymbol: '🏛️',
    flagUrl: '/flags/df.svg',
    centroid: [1414, 762],
  },
  GO: {
    id: 'GO',
    name: 'Goiás',
    capital: 'Goiânia',
    region: 'Centro-Oeste',
    coatOfArmsUrl: '/brasao_br/brasao-de-goias-765x1024.png',
    flagSymbol: '🌾',
    flagUrl: '/flags/go.svg',
    centroid: [1363, 763],
  },
  MT: {
    id: 'MT',
    name: 'Mato Grosso',
    capital: 'Cuiabá',
    region: 'Centro-Oeste',
    coatOfArmsUrl: '',
    flagSymbol: '🐆',
    flagUrl: '/flags/mt.svg',
    centroid: [1204, 680],
  },
  MS: {
    id: 'MS',
    name: 'Mato Grosso do Sul',
    capital: 'Campo Grande',
    region: 'Centro-Oeste',
    coatOfArmsUrl: '',
    flagSymbol: '🌾',
    flagUrl: '/flags/ms.svg',
    centroid: [1233, 895],
  },

  // ==========================================
  // REGIÃO SUDESTE (4 Estados)
  // ==========================================
  ES: {
    id: 'ES',
    name: 'Espírito Santo',
    capital: 'Vitória',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-espirito-santo-768x846.png',
    flagSymbol: '🕊️',
    flagUrl: '/flags/es.svg',
    centroid: [1613, 852],
  },
  MG: {
    id: 'MG',
    name: 'Minas Gerais',
    capital: 'Belo Horizonte',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-estado-minas-gerais-768x734.png',
    flagSymbol: '🔺',
    flagUrl: '/flags/mg.svg',
    centroid: [1501, 834],
  },
  RJ: {
    id: 'RJ',
    name: 'Rio de Janeiro',
    capital: 'Rio de Janeiro',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-estado-rio-de-janeiro-768x977.png',
    flagSymbol: '⛰️',
    flagUrl: '/flags/rj.svg',
    centroid: [1538, 951],
  },
  SP: {
    id: 'SP',
    name: 'São Paulo',
    capital: 'São Paulo',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-estado-de-sao-paulo-768x892.png',
    flagSymbol: '⚙️',
    flagUrl: '/flags/sp.svg',
    centroid: [1447, 969],
  },

  // ==========================================
  // REGIÃO SUL (3 Estados)
  // ==========================================
  PR: {
    id: 'PR',
    name: 'Paraná',
    capital: 'Curitiba',
    region: 'Sul',
    coatOfArmsUrl: '',
    flagSymbol: '🌲',
    flagUrl: '/flags/pr.svg',
    centroid: [1306, 1015],
  },
  RS: {
    id: 'RS',
    name: 'Rio Grande do Sul',
    capital: 'Porto Alegre',
    region: 'Sul',
    coatOfArmsUrl: '',
    flagSymbol: '🧉',
    flagUrl: '/flags/rs.svg',
    centroid: [1327, 1145],
  },
  SC: {
    id: 'SC',
    name: 'Santa Catarina',
    capital: 'Florianópolis',
    region: 'Sul',
    coatOfArmsUrl: '',
    flagSymbol: '🦅',
    flagUrl: '/flags/sc.svg',
    centroid: [1353, 1069],
  },
};

export const ALL_BRAZIL_STATES = Object.values(BRAZIL_STATES_REGISTRY);

export function getStateRegistryById(id: string): BrazilStateInfo | undefined {
  return BRAZIL_STATES_REGISTRY[id.toUpperCase()];
}

export function getStatesByRegion(region: BrazilRegion): BrazilStateInfo[] {
  return ALL_BRAZIL_STATES.filter((s) => s.region === region);
}

export function getStateCentroidById(id: string): [number, number] {
  const state = BRAZIL_STATES_REGISTRY[id.toUpperCase()];
  return state ? state.centroid : [1280, 720];
}

export function getStateCoatOfArmsUrl(id: string): string {
  const state = BRAZIL_STATES_REGISTRY[id.toUpperCase()];
  return state ? state.coatOfArmsUrl : '';
}

export function getStateFlagUrl(id: string): string {
  const state = BRAZIL_STATES_REGISTRY[id.toUpperCase()];
  if (state?.flagUrl) return state.flagUrl;
  return `/flags/${id.toLowerCase()}.svg`;
}
