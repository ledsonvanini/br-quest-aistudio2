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
    flagUrl: 'https://flagcdn.com/w80/br-ac.png',
    centroid: [814, 582],
  },
  AP: {
    id: 'AP',
    name: 'Amapá',
    capital: 'Macapá',
    region: 'Norte',
    coatOfArmsUrl: '/brasao_br/brasao-do-amapa-260x300.png',
    flagSymbol: '☀️',
    flagUrl: 'https://flagcdn.com/w80/br-ap.png',
    centroid: [1306, 321],
  },
  AM: {
    id: 'AM',
    name: 'Amazonas',
    capital: 'Manaus',
    region: 'Norte',
    coatOfArmsUrl: '/brasao_br/brasao-do-amazonas-712x1024.png',
    flagSymbol: '🌿',
    flagUrl: 'https://flagcdn.com/w80/br-am.png',
    centroid: [944, 435],
  },
  PA: {
    id: 'PA',
    name: 'Pará',
    capital: 'Belém',
    region: 'Norte',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bras%C3%A3o_do_Par%C3%A1.svg/300px-Bras%C3%A3o_do_Par%C3%A1.svg.png',
    flagSymbol: '⭐',
    flagUrl: 'https://flagcdn.com/w80/br-pa.png',
    centroid: [1230, 397],
  },
  RO: {
    id: 'RO',
    name: 'Rondônia',
    capital: 'Porto Velho',
    region: 'Norte',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bras%C3%A3o_de_Rond%C3%B4nia.svg/300px-Bras%C3%A3o_de_Rond%C3%B4nia.svg.png',
    flagSymbol: '🌟',
    flagUrl: 'https://flagcdn.com/w80/br-ro.png',
    centroid: [1003, 648],
  },
  RR: {
    id: 'RR',
    name: 'Roraima',
    capital: 'Boa Vista',
    region: 'Norte',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bras%C3%A3o_de_Roraima.svg/300px-Bras%C3%A3o_de_Roraima.svg.png',
    flagSymbol: '⛰️',
    flagUrl: 'https://flagcdn.com/w80/br-rr.png',
    centroid: [1043, 273],
  },
  TO: {
    id: 'TO',
    name: 'Tocantins',
    capital: 'Palmas',
    region: 'Norte',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bras%C3%A3o_do_Tocantins.svg/300px-Bras%C3%A3o_do_Tocantins.svg.png',
    flagSymbol: '☀️',
    flagUrl: 'https://flagcdn.com/w80/br-to.png',
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
    flagUrl: 'https://flagcdn.com/w80/br-al.png',
    centroid: [1706, 597],
  },
  BA: {
    id: 'BA',
    name: 'Bahia',
    capital: 'Salvador',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-da-bahia-256x300.png',
    flagSymbol: '⚓',
    flagUrl: 'https://flagcdn.com/w80/br-ba.png',
    centroid: [1576, 677],
  },
  CE: {
    id: 'CE',
    name: 'Ceará',
    capital: 'Fortaleza',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-do-ceara-753x1024.png',
    flagSymbol: '☀️',
    flagUrl: 'https://flagcdn.com/w80/br-ce.png',
    centroid: [1638, 490],
  },
  MA: {
    id: 'MA',
    name: 'Maranhão',
    capital: 'São Luís',
    region: 'Nordeste',
    coatOfArmsUrl: '/brasao_br/brasao-maranhao-estado-768x768.png',
    flagSymbol: '🌴',
    flagUrl: 'https://flagcdn.com/w80/br-ma.png',
    centroid: [1482, 476],
  },
  PB: {
    id: 'PB',
    name: 'Paraíba',
    capital: 'João Pessoa',
    region: 'Nordeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bras%C3%A3o_da_Para%C3%ADba.svg/300px-Bras%C3%A3o_da_Para%C3%ADba.svg.png',
    flagSymbol: '☀️',
    flagUrl: 'https://flagcdn.com/w80/br-pb.png',
    centroid: [1706, 536],
  },
  PE: {
    id: 'PE',
    name: 'Pernambuco',
    capital: 'Recife',
    region: 'Nordeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Bras%C3%A3o_de_Pernambuco.svg/300px-Bras%C3%A3o_de_Pernambuco.svg.png',
    flagSymbol: '🌈',
    flagUrl: 'https://flagcdn.com/w80/br-pe.png',
    centroid: [1701, 577],
  },
  PI: {
    id: 'PI',
    name: 'Piauí',
    capital: 'Teresina',
    region: 'Nordeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bras%C3%A3o_do_Piau%C3%AD.svg/300px-Bras%C3%A3o_do_Piau%C3%AD.svg.png',
    flagSymbol: '🌾',
    flagUrl: 'https://flagcdn.com/w80/br-pi.png',
    centroid: [1549, 548],
  },
  RN: {
    id: 'RN',
    name: 'Rio Grande do Norte',
    capital: 'Natal',
    region: 'Nordeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bras%C3%A3o_do_Rio_Grande_do_Norte.svg/300px-Bras%C3%A3o_do_Rio_Grande_do_Norte.svg.png',
    flagSymbol: '🥥',
    flagUrl: 'https://flagcdn.com/w80/br-rn.png',
    centroid: [1711, 498],
  },
  SE: {
    id: 'SE',
    name: 'Sergipe',
    capital: 'Aracaju',
    region: 'Nordeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bras%C3%A3o_de_Sergipe.svg/300px-Bras%C3%A3o_de_Sergipe.svg.png',
    flagSymbol: '⭐',
    flagUrl: 'https://flagcdn.com/w80/br-se.png',
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
    flagUrl: 'https://flagcdn.com/w80/br-df.png',
    centroid: [1414, 762],
  },
  GO: {
    id: 'GO',
    name: 'Goiás',
    capital: 'Goiânia',
    region: 'Centro-Oeste',
    coatOfArmsUrl: '/brasao_br/brasao-de-goias-765x1024.png',
    flagSymbol: '🌾',
    flagUrl: 'https://flagcdn.com/w80/br-go.png',
    centroid: [1363, 763],
  },
  MT: {
    id: 'MT',
    name: 'Mato Grosso',
    capital: 'Cuiabá',
    region: 'Centro-Oeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bras%C3%A3o_de_Mato_Grosso.svg/300px-Bras%C3%A3o_de_Mato_Grosso.svg.png',
    flagSymbol: '🐆',
    flagUrl: 'https://flagcdn.com/w80/br-mt.png',
    centroid: [1204, 680],
  },
  MS: {
    id: 'MS',
    name: 'Mato Grosso do Sul',
    capital: 'Campo Grande',
    region: 'Centro-Oeste',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bras%C3%A3o_de_Mato_Grosso_do_Sul.svg/300px-Bras%C3%A3o_de_Mato_Grosso_do_Sul.svg.png',
    flagSymbol: '🌾',
    flagUrl: 'https://flagcdn.com/w80/br-ms.png',
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
    flagUrl: 'https://flagcdn.com/w80/br-es.png',
    centroid: [1613, 852],
  },
  MG: {
    id: 'MG',
    name: 'Minas Gerais',
    capital: 'Belo Horizonte',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-estado-minas-gerais-768x734.png',
    flagSymbol: '🔺',
    flagUrl: 'https://flagcdn.com/w80/br-mg.png',
    centroid: [1501, 834],
  },
  RJ: {
    id: 'RJ',
    name: 'Rio de Janeiro',
    capital: 'Rio de Janeiro',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-estado-rio-de-janeiro-768x977.png',
    flagSymbol: '⛰️',
    flagUrl: 'https://flagcdn.com/w80/br-rj.png',
    centroid: [1538, 951],
  },
  SP: {
    id: 'SP',
    name: 'São Paulo',
    capital: 'São Paulo',
    region: 'Sudeste',
    coatOfArmsUrl: '/brasao_br/brasao-estado-de-sao-paulo-768x892.png',
    flagSymbol: '⚙️',
    flagUrl: 'https://flagcdn.com/w80/br-sp.png',
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
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bras%C3%A3o_do_Paran%C3%A1.svg/300px-Bras%C3%A3o_do_Paran%C3%A1.svg.png',
    flagSymbol: '🌲',
    flagUrl: 'https://flagcdn.com/w80/br-pr.png',
    centroid: [1306, 1015],
  },
  RS: {
    id: 'RS',
    name: 'Rio Grande do Sul',
    capital: 'Porto Alegre',
    region: 'Sul',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Bras%C3%A3o_do_Rio_Grande_do_Sul.svg/300px-Bras%C3%A3o_do_Rio_Grande_do_Sul.svg.png',
    flagSymbol: '🧉',
    flagUrl: 'https://flagcdn.com/w80/br-rs.png',
    centroid: [1327, 1145],
  },
  SC: {
    id: 'SC',
    name: 'Santa Catarina',
    capital: 'Florianópolis',
    region: 'Sul',
    coatOfArmsUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bras%C3%A3o_de_Santa_Catarina.svg/300px-Bras%C3%A3o_de_Santa_Catarina.svg.png',
    flagSymbol: '🦅',
    flagUrl: 'https://flagcdn.com/w80/br-sc.png',
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
