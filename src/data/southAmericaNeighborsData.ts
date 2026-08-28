/**
 * South America Neighboring Countries Data:
 * High-definition flags, exact projection centroids, capital cities,
 * and boundary relationship with Brazil.
 */

export interface NeighborCountryData {
  id: string;
  code: string; // ISO 2-letter
  name: string;
  officialName: string;
  capital: string;
  population: string;
  populationNumber: number;
  area: string;
  currency: string;
  language: string;
  borderLength?: string;
  flagUrl: string;
  flagEmoji: string;
  isDirectNeighbor: boolean;
  centroid: [number, number]; // [X, Y] on 2560x1440 Mercator Canvas
  borderingStatesBR?: string[]; // Brazilian states bordering this country
  description: string;
  aliases?: string[];
}

export const SOUTH_AMERICA_NEIGHBORS: NeighborCountryData[] = [
  {
    id: 'AR',
    code: 'ar',
    name: 'Argentina',
    officialName: 'República Argentina',
    capital: 'Buenos Aires',
    population: '46,2 milhões hab.',
    populationNumber: 46200000,
    area: '2.780.400 km²',
    currency: 'Peso Argentino (ARS)',
    language: 'Espanhol',
    borderLength: '1.261 km',
    flagUrl: 'https://flagcdn.com/w160/ar.png',
    flagEmoji: '🇦🇷',
    isDirectNeighbor: true,
    centroid: [872, 1332],
    borderingStatesBR: ['RS', 'SC', 'PR'],
    description: 'Vizinho ao sul, compartilha a bacia do Prata, Cataratas do Iguaçu e ricas tradições gaúchas e de integração do Mercosul.',
    aliases: ['argentina', 'argentine republic', 'republica argentina', 'ar'],
  },
  {
    id: 'BO',
    code: 'bo',
    name: 'Bolívia',
    officialName: 'Estado Plurinacional da Bolívia',
    capital: 'Sucre / La Paz',
    population: '12,4 milhões hab.',
    populationNumber: 12400000,
    area: '1.098.581 km²',
    currency: 'Boliviano (BOB)',
    language: 'Espanhol, Quechua, Aimará, Guarani',
    borderLength: '3.423 km (Maior Fronteira)',
    flagUrl: 'https://flagcdn.com/w160/bo.png',
    flagEmoji: '🇧🇴',
    isDirectNeighbor: true,
    centroid: [891, 746],
    borderingStatesBR: ['AC', 'RO', 'MT', 'MS'],
    description: 'Maior fronteira terrestre com o Brasil, ligada pelos biomas do Pantanal, Cerrado e Amazônia e pelo Gasoduto Brasil-Bolívia.',
    aliases: ['bolivia', 'plurinational state of bolivia', 'estado plurinacional de bolivia', 'bo'],
  },
  {
    id: 'CO',
    code: 'co',
    name: 'Colômbia',
    officialName: 'República da Colômbia',
    capital: 'Bogotá',
    population: '52,2 milhões hab.',
    populationNumber: 52200000,
    area: '1.141.748 km²',
    currency: 'Peso Colombiano (COP)',
    language: 'Espanhol',
    borderLength: '1.644 km',
    flagUrl: 'https://flagcdn.com/w160/co.png',
    flagEmoji: '🇨🇴',
    isDirectNeighbor: true,
    centroid: [671, 197],
    borderingStatesBR: ['AM'],
    description: 'Vizinho ao noroeste, integrado pela tríplice fronteira amazônica em Tabatinga/Letícia com rica troca cultural e cooperação ambiental.',
    aliases: ['colombia', 'republic of colombia', 'republica de colombia', 'co'],
  },
  {
    id: 'GF',
    code: 'gf',
    name: 'Guiana Francesa',
    officialName: 'Guyane (Região e Departamento da França)',
    capital: 'Caiena',
    population: '312 mil hab.',
    populationNumber: 312000,
    area: '83.534 km²',
    currency: 'Euro (EUR)',
    language: 'Francês',
    borderLength: '730 km',
    flagUrl: 'https://flagcdn.com/w160/gf.png',
    flagEmoji: '🇬🇫',
    isDirectNeighbor: true,
    centroid: [1191, 198],
    borderingStatesBR: ['AP'],
    description: 'Território ultraperiférico francês na Amazônia, sede do Centro Espacial de Kourou, ligado ao Amapá pela ponte sobre o Rio Oiapoque.',
    aliases: ['french guiana', 'french guiana (france)', 'guyane', 'guyane francaise', 'guiana francesa', 'gf'],
  },
  {
    id: 'GY',
    code: 'gy',
    name: 'Guiana',
    officialName: 'República Cooperativa da Guiana',
    capital: 'Georgetown',
    population: '813 mil hab.',
    populationNumber: 813000,
    area: '214.970 km²',
    currency: 'Dólar Guianense (GYD)',
    language: 'Inglês',
    borderLength: '1.606 km',
    flagUrl: 'https://flagcdn.com/w160/gy.png',
    flagEmoji: '🇬🇾',
    isDirectNeighbor: true,
    centroid: [1040, 175],
    borderingStatesBR: ['RR', 'PA'],
    description: 'Vizinho ao norte do Escudo das Guianas, compartilha o Monte Roraima, savanas de Rupununi e a ponte do Rio Tacutu em Bonfim (RR).',
    aliases: ['guyana', 'co-operative republic of guyana', 'guiana', 'gy'],
  },
  {
    id: 'PY',
    code: 'py',
    name: 'Paraguai',
    officialName: 'República do Paraguai',
    capital: 'Assunção',
    population: '7,4 milhões hab.',
    populationNumber: 7400000,
    area: '406.752 km²',
    currency: 'Guarani (PYG)',
    language: 'Espanhol e Guarani',
    borderLength: '1.365 km',
    flagUrl: 'https://flagcdn.com/w160/py.png',
    flagEmoji: '🇵🇾',
    isDirectNeighbor: true,
    centroid: [1056, 927],
    borderingStatesBR: ['MS', 'PR'],
    description: 'Parceiro binacional na Usina Hidrelétrica de Itaipu, conectado ao Paraná pela Ponte da Amizade e pela Ponte da Integração.',
    aliases: ['paraguay', 'paraguai', 'republic of paraguay', 'republica del paraguay', 'py'],
  },
  {
    id: 'PE',
    code: 'pe',
    name: 'Peru',
    officialName: 'República do Peru',
    capital: 'Lima',
    population: '34,0 milhões hab.',
    populationNumber: 34000000,
    area: '1.285.216 km²',
    currency: 'Sol Peruano (PEN)',
    language: 'Espanhol, Quechua, Aimará',
    borderLength: '2.995 km',
    flagUrl: 'https://flagcdn.com/w160/pe.png',
    flagEmoji: '🇵🇪',
    isDirectNeighbor: true,
    centroid: [638, 543],
    borderingStatesBR: ['AC', 'AM'],
    description: 'Berço da nascente do Rio Amazonas nos Andes, conectado ao Acre pela Estrada do Pacífico (Rodovia Interoceânica).',
    aliases: ['peru', 'republic of peru', 'republica del peru', 'pe'],
  },
  {
    id: 'SR',
    code: 'sr',
    name: 'Suriname',
    officialName: 'República do Suriname',
    capital: 'Paramaribo',
    population: '620 mil hab.',
    populationNumber: 620000,
    area: '163.820 km²',
    currency: 'Dólar do Suriname (SRD)',
    language: 'Holandês',
    borderLength: '593 km',
    flagUrl: 'https://flagcdn.com/w160/sr.png',
    flagEmoji: '🇸🇷',
    isDirectNeighbor: true,
    centroid: [1121, 192],
    borderingStatesBR: ['AP', 'PA'],
    description: 'Vizinho setentrional na região das Guianas, com grande cobertura florestal amazônica preservada e forte diversidade étnica.',
    aliases: ['suriname', 'surinam', 'republic of suriname', 'republiek suriname', 'sr'],
  },
  {
    id: 'UY',
    code: 'uy',
    name: 'Uruguai',
    officialName: 'República Oriental do Uruguai',
    capital: 'Montevidéu',
    population: '3,4 milhões hab.',
    populationNumber: 3400000,
    area: '176.215 km²',
    currency: 'Peso Uruguaio (UYU)',
    language: 'Espanhol',
    borderLength: '1.068 km',
    flagUrl: 'https://flagcdn.com/w160/uy.png',
    flagEmoji: '🇺🇾',
    isDirectNeighbor: true,
    centroid: [1118, 1211],
    borderingStatesBR: ['RS'],
    description: 'Vizinho ao extremo sul, compartilha o bioma Pampa, a Lagoa Mirim e a fronteira da paz entre Santana do Livramento e Rivera.',
    aliases: ['uruguay', 'uruguai', 'oriental republic of uruguay', 'republica oriental del uruguay', 'uy'],
  },
  {
    id: 'VE',
    code: 've',
    name: 'Venezuela',
    officialName: 'República Bolivariana da Venezuela',
    capital: 'Caracas',
    population: '28,8 milhões hab.',
    populationNumber: 28800000,
    area: '916.445 km²',
    currency: 'Bolívar Digital (VES)',
    language: 'Espanhol',
    borderLength: '2.199 km',
    flagUrl: 'https://flagcdn.com/w160/ve.png',
    flagEmoji: '🇻🇪',
    isDirectNeighbor: true,
    centroid: [852, 113],
    borderingStatesBR: ['RR', 'AM'],
    description: 'Vizinho ao norte, ligado a Roraima pela fronteira de Pacaraima/Santa Elena de Uairén e pelos impressionantes tepuis amazônicos.',
    aliases: ['venezuela', 'bolivarian republic of venezuela', 'republica bolivariana de venezuela', 've'],
  },
  {
    id: 'CL',
    code: 'cl',
    name: 'Chile',
    officialName: 'República do Chile',
    capital: 'Santiago',
    population: '19,6 milhões hab.',
    populationNumber: 19600000,
    area: '756.102 km²',
    currency: 'Peso Chileno (CLP)',
    language: 'Espanhol',
    borderLength: 'Sem fronteira terrestre direta',
    flagUrl: 'https://flagcdn.com/w160/cl.png',
    flagEmoji: '🇨🇱',
    isDirectNeighbor: false,
    centroid: [712, 1455],
    description: 'Nação andina ao longo da costa pacífica, parceiro chave do Brasil no Corredor Bioceânico e no comércio de tecnologia e vinhos.',
    aliases: ['chile', 'republic of chile', 'republica de chile', 'cl'],
  },
  {
    id: 'EC',
    code: 'ec',
    name: 'Equador',
    officialName: 'República do Equador',
    capital: 'Quito',
    population: '18,0 milhões hab.',
    populationNumber: 18000000,
    area: '256.370 km²',
    currency: 'Dólar dos EUA (USD)',
    language: 'Espanhol, Kichwa',
    borderLength: 'Sem fronteira terrestre direta',
    flagUrl: 'https://flagcdn.com/w160/ec.png',
    flagEmoji: '🇪🇨',
    isDirectNeighbor: false,
    centroid: [523, 338],
    description: 'Nação equatorial andina e pacífica, conectada à bacia amazônica e rica em patrimônio histórico, vulcões e ilhas Galápagos.',
    aliases: ['ecuador', 'equador', 'republic of ecuador', 'republica del ecuador', 'ec'],
  },
];

/**
 * Normalizes and looks up a neighbor country data by GeoJSON feature properties
 */
export function findNeighborCountry(nameOrCodeOrId?: string): NeighborCountryData | undefined {
  if (!nameOrCodeOrId) return undefined;
  const search = nameOrCodeOrId.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return SOUTH_AMERICA_NEIGHBORS.find((c) => {
    const id = c.id.toLowerCase();
    const code = c.code.toLowerCase();
    const name = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const official = c.officialName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (search === id || search === code) return true;
    if (name === search || search.includes(name) || name.includes(search)) return true;
    if (official === search || search.includes(official) || official.includes(search)) return true;
    
    if (c.aliases && c.aliases.some((alias) => {
      const a = alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return search === a || search.includes(a) || a.includes(search);
    })) {
      return true;
    }

    return false;
  });
}
