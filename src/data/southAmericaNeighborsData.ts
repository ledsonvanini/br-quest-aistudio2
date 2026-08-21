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
  aliases?: string[];
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
    aliases: ['argentina', 'argentine republic', 'republica argentina', 'ar'],
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
    aliases: ['bolivia', 'plurinational state of bolivia', 'estado plurinacional de bolivia', 'bo'],
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
    aliases: ['colombia', 'republic of colombia', 'republica de colombia', 'co'],
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
    aliases: ['french guiana', 'french guiana (france)', 'guyane', 'guyane francaise', 'guiana francesa', 'gf'],
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
    aliases: ['guyana', 'co-operative republic of guyana', 'guiana', 'gy'],
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
    aliases: ['paraguay', 'paraguai', 'republic of paraguay', 'republica del paraguay', 'py'],
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
    aliases: ['peru', 'republic of peru', 'republica del peru', 'pe'],
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
    aliases: ['suriname', 'surinam', 'republic of suriname', 'republiek suriname', 'sr'],
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
    aliases: ['uruguay', 'uruguai', 'oriental republic of uruguay', 'republica oriental del uruguay', 'uy'],
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
    aliases: ['venezuela', 'bolivarian republic of venezuela', 'republica bolivariana de venezuela', 've'],
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
    aliases: ['chile', 'republic of chile', 'republica de chile', 'cl'],
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
