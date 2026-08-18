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
  flagUrl: string;
  flagEmoji: string;
  isDirectNeighbor: boolean;
  centroid: [number, number]; // [X, Y] on 2560x1440 Mercator Canvas
  borderingStatesBR?: string[]; // Brazilian states bordering this country
  description: string;
}

export const SOUTH_AMERICA_NEIGHBORS: NeighborCountryData[] = [
  {
    id: 'AR',
    code: 'ar',
    name: 'Argentina',
    officialName: 'República Argentina',
    capital: 'Buenos Aires',
    flagUrl: 'https://flagcdn.com/w160/ar.png',
    flagEmoji: '🇦🇷',
    isDirectNeighbor: true,
    centroid: [872, 1332],
    borderingStatesBR: ['RS', 'SC', 'PR'],
    description: 'Vizinho ao sul, compartilha a bacia do Prata, Cataratas do Iguaçu e ricas tradições gaúchas.',
  },
  {
    id: 'BO',
    code: 'bo',
    name: 'Bolívia',
    officialName: 'Estado Plurinacional da Bolívia',
    capital: 'Sucre / La Paz',
    flagUrl: 'https://flagcdn.com/w160/bo.png',
    flagEmoji: '🇧🇴',
    isDirectNeighbor: true,
    centroid: [891, 746],
    borderingStatesBR: ['AC', 'RO', 'MT', 'MS'],
    description: 'Maior fronteira terrestre com o Brasil, ligada pelos biomas do Pantanal e Amazônia.',
  },
  {
    id: 'CO',
    code: 'co',
    name: 'Colômbia',
    officialName: 'República da Colômbia',
    capital: 'Bogotá',
    flagUrl: 'https://flagcdn.com/w160/co.png',
    flagEmoji: '🇨🇴',
    isDirectNeighbor: true,
    centroid: [671, 197],
    borderingStatesBR: ['AM'],
    description: 'Vizinho ao noroeste, integrado pela tríplice fronteira amazônica em Tabatinga/Letícia.',
  },
  {
    id: 'GF',
    code: 'gf',
    name: 'Guiana Francesa',
    officialName: 'Guyane (França)',
    capital: 'Caiena',
    flagUrl: 'https://flagcdn.com/w160/gf.png',
    flagEmoji: '🇬🇫',
    isDirectNeighbor: true,
    centroid: [1191, 198],
    borderingStatesBR: ['AP'],
    description: 'Território ultraperiférico francês na Amazônia, ligado ao Amapá pela ponte sobre o Rio Oiapoque.',
  },
  {
    id: 'GY',
    code: 'gy',
    name: 'Guiana',
    officialName: 'República Cooperativa da Guiana',
    capital: 'Georgetown',
    flagUrl: 'https://flagcdn.com/w160/gy.png',
    flagEmoji: '🇬🇾',
    isDirectNeighbor: true,
    centroid: [1040, 175],
    borderingStatesBR: ['RR', 'PA'],
    description: 'Vizinho ao norte do Escudo das Guianas, compartilha o Monte Roraima e savanas de Rupununi.',
  },
  {
    id: 'PY',
    code: 'py',
    name: 'Paraguai',
    officialName: 'República do Paraguai',
    capital: 'Assunção',
    flagUrl: 'https://flagcdn.com/w160/py.png',
    flagEmoji: '🇵🇾',
    isDirectNeighbor: true,
    centroid: [1056, 927],
    borderingStatesBR: ['MS', 'PR'],
    description: 'Parceiro da Usina Hidrelétrica de Itaipu, conectado ao Paraná pela Ponte da Amizade.',
  },
  {
    id: 'PE',
    code: 'pe',
    name: 'Peru',
    officialName: 'República do Peru',
    capital: 'Lima',
    flagUrl: 'https://flagcdn.com/w160/pe.png',
    flagEmoji: '🇵🇪',
    isDirectNeighbor: true,
    centroid: [638, 543],
    borderingStatesBR: ['AC', 'AM'],
    description: 'Berço da nascente do Rio Amazonas nos Andes e vizinho direto do Acre e Amazonas.',
  },
  {
    id: 'SR',
    code: 'sr',
    name: 'Suriname',
    officialName: 'República do Suriname',
    capital: 'Paramaribo',
    flagUrl: 'https://flagcdn.com/w160/sr.png',
    flagEmoji: '🇸🇷',
    isDirectNeighbor: true,
    centroid: [1121, 192],
    borderingStatesBR: ['AP', 'PA'],
    description: 'Vizinho setentrional na região das Guianas, coberto por densas florestas tropicais pristinas.',
  },
  {
    id: 'UY',
    code: 'uy',
    name: 'Uruguai',
    officialName: 'República Oriental do Uruguai',
    capital: 'Montevidéu',
    flagUrl: 'https://flagcdn.com/w160/uy.png',
    flagEmoji: '🇺🇾',
    isDirectNeighbor: true,
    centroid: [1118, 1211],
    borderingStatesBR: ['RS'],
    description: 'Vizinho ao extremo sul, compartilha o bioma Pampa e a histórica Lagoa Mirim.',
  },
  {
    id: 'VE',
    code: 've',
    name: 'Venezuela',
    officialName: 'República Bolivariana da Venezuela',
    capital: 'Caracas',
    flagUrl: 'https://flagcdn.com/w160/ve.png',
    flagEmoji: '🇻🇪',
    isDirectNeighbor: true,
    centroid: [852, 113],
    borderingStatesBR: ['RR', 'AM'],
    description: 'Vizinho ao norte, ligado a Roraima pela fronteira de Pacaraima e pelos tepuis amazônicos.',
  },
  {
    id: 'CL',
    code: 'cl',
    name: 'Chile',
    officialName: 'República do Chile',
    capital: 'Santiago',
    flagUrl: 'https://flagcdn.com/w160/cl.png',
    flagEmoji: '🇨🇱',
    isDirectNeighbor: false,
    centroid: [712, 1455],
    description: 'Nação andina ao longo do Pacífico, importante parceiro comercial e da Rota Bioceânica.',
  },
  {
    id: 'EC',
    code: 'ec',
    name: 'Equador',
    officialName: 'República do Equador',
    capital: 'Quito',
    flagUrl: 'https://flagcdn.com/w160/ec.png',
    flagEmoji: '🇪🇨',
    isDirectNeighbor: false,
    centroid: [523, 338],
    description: 'Nação equatorial andina e pacífica, conectada à bacia amazônica.',
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
    return search === id || search === code || name.includes(search) || search.includes(name) || official.includes(search);
  });
}
