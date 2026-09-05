import { OceanicIslandSpec } from './types';

/**
 * Linha de costa atlântica brasileira (Amapá ao Chuí)
 */
export const BRAZIL_COASTLINE_GEO_POINTS: [number, number][] = [
  [-51.0, 4.3],   // Oiapoque / Cabo Orange
  [-50.8, 2.5],   // Amapá
  [-50.0, 1.2],   // Foz do Amazonas
  [-48.5, -0.8],  // Pará / Ilha de Marajó
  [-44.3, -2.4],  // Maranhão / Lençóis Maranhenses
  [-40.2, -3.1],  // Ceará / Jericoacoara
  [-38.5, -3.7],  // Fortaleza
  [-36.2, -5.1],  // Rio Grande do Norte / Cabo de São Roque
  [-35.0, -6.4],  // Pipa
  [-34.8, -7.5],  // Paraíba (Ponta do Seixas)
  [-34.8, -8.1],  // Pernambuco (Recife)
  [-35.7, -9.6],  // Alagoas (Maceió)
  [-37.0, -10.9], // Sergipe (Aracaju)
  [-38.5, -13.0], // Bahia (Salvador)
  [-39.0, -14.8], // Ilhéus
  [-39.1, -16.5], // Porto Seguro / Costa do Descobrimento
  [-39.8, -18.0], // Abrolhos / Caravelas
  [-39.8, -19.2], // Espírito Santo (Linhares)
  [-40.3, -20.3], // Vitória / Guarapari
  [-41.7, -21.8], // Rio de Janeiro (Campos dos Goytacazes)
  [-42.0, -22.9], // Cabo Frio / Búzios
  [-43.2, -23.0], // Rio de Janeiro (Copacabana)
  [-44.7, -23.3], // Angra dos Reis / Paraty
  [-45.1, -23.6], // Ilhabela / Litoral Norte SP
  [-46.3, -23.9], // Santos
  [-47.0, -24.4], // Iguape / Cananéia
  [-48.5, -25.5], // Paranaguá (PR)
  [-48.5, -27.1], // Santa Catarina (Florianópolis)
  [-48.8, -28.5], // Cabo de Santa Marta
  [-49.8, -29.9], // Torres / RS
  [-51.2, -31.0], // Mostardas
  [-52.1, -32.1], // Rio Grande / Cassino
  [-53.4, -33.7], // Chuí / Fronteira Sul
];

/**
 * Costa atlântica meridional (Uruguai, Argentina até Cabo Horn)
 */
export const SOUTH_AMERICA_ATLANTIC_SOUTH_GEO: [number, number][] = [
  [-53.4, -33.7], // Chuí
  [-54.9, -34.9], // Punta del Este (Uruguai)
  [-56.2, -34.9], // Montevidéu
  [-57.5, -38.0], // Mar del Plata (Argentina)
  [-62.0, -40.8], // Bahía Blanca
  [-64.0, -42.8], // Península Valdés
  [-65.1, -43.3], // Rawson / Chubut
  [-67.5, -45.9], // Comodoro Rivadavia
  [-67.7, -47.8], // Puerto Deseado
  [-69.2, -51.6], // Río Gallegos
  [-66.8, -54.8], // Ushuaia / Beagle Channel
  [-67.2, -55.9], // Cabo Horn
];

/**
 * Costa pacífica da América do Sul (Cabo Horn até Colômbia/Panamá)
 */
export const SOUTH_AMERICA_PACIFIC_COASTLINE_GEO: [number, number][] = [
  [-67.2, -55.9], // Cabo Horn
  [-71.0, -54.0], // Tierra del Fuego Pacífico
  [-74.0, -52.5], // Estrecho de Magallanes Pacífico
  [-75.2, -50.0], // Canal Concepción (Chile)
  [-74.5, -46.9], // Golfo de Penas
  [-74.0, -43.5], // Golfo de Corcovado / Chiloé
  [-73.7, -41.5], // Puerto Montt
  [-73.4, -39.8], // Valdivia
  [-73.1, -36.8], // Concepción
  [-72.0, -35.3], // Constitución
  [-71.6, -33.0], // Valparaíso / Viña del Mar
  [-71.3, -29.9], // La Serena / Coquimbo
  [-70.8, -27.1], // Caldera
  [-70.4, -23.6], // Antofagasta
  [-70.1, -20.2], // Iquique
  [-70.3, -18.5], // Arica (Fronteira Chile-Peru)
  [-71.4, -17.6], // Ilo (Peru)
  [-72.8, -16.8], // Camaná
  [-74.9, -15.5], // San Juan de Marcona
  [-76.2, -13.9], // Paracas / Pisco
  [-77.2, -12.1], // Callao / Lima
  [-78.0, -10.0], // Huarmey
  [-79.0, -8.1],  // Trujillo
  [-79.9, -6.8],  // Chiclayo
  [-80.6, -5.9],  // Sechura
  [-81.3, -4.7],  // Punta Pariñas / Talara (Ponto mais ocidental da América do Sul)
  [-81.0, -2.2],  // Salinas / Golfo de Guayaquil (Equador)
  [-80.7, -0.9],  // Manta
  [-79.8, 0.9],   // Esmeraldas
  [-78.8, 1.8],   // Tumaco (Colômbia)
  [-77.3, 3.9],   // Buenaventura
  [-77.4, 5.7],   // Bahía Solano
  [-77.3, 7.1],   // Punta Ardita (Fronteira Colômbia-Panamá)
];

/**
 * Costa caribenha e norte (Panamá até Guiana Francesa / Oiapoque)
 */
export const SOUTH_AMERICA_CARIBBEAN_GEO: [number, number][] = [
  [-77.3, 7.1],   // Punta Ardita
  [-77.0, 8.6],   // Golfo de Urabá (Colômbia)
  [-75.5, 10.4],  // Cartagena
  [-74.8, 11.0],  // Barranquilla
  [-72.0, 11.9],  // Península de La Guajira
  [-71.6, 11.0],  // Maracaibo (Venezuela)
  [-70.0, 11.7],  // Península de Paraguaná
  [-67.0, 10.6],  // Caracas / La Guaira
  [-64.2, 10.5],  // Cumaná
  [-61.8, 8.6],   // Delta do Orinoco
  [-58.2, 6.8],   // Georgetown (Guiana)
  [-55.2, 5.8],   // Paramaribo (Suriname)
  [-52.3, 4.9],   // Caiena (Guiana Francesa)
  [-51.0, 4.3],   // Oiapoque / Amapá (Conecta com a costa brasileira)
];

/**
 * Arquipélagos e Ilhas Oceânicas Brasileiras
 */
export const OCEAN_ISLANDS_SPECS: OceanicIslandSpec[] = [
  {
    name: 'Fernando de Noronha',
    geo: [-32.4, -3.85],
    radius: 3.5,
    depthColor: '#06b6d4',
    shallowColor: '#67e8f9',
  },
  {
    name: 'Atol das Rocas',
    geo: [-33.8, -3.86],
    radius: 2.5,
    depthColor: '#22d3ee',
    shallowColor: '#a5f3fc',
  },
  {
    name: 'Arquipélago de São Pedro e São Paulo',
    geo: [-29.3, 0.9],
    radius: 2.0,
    depthColor: '#38bdf8',
    shallowColor: '#bae6fd',
  },
  {
    name: 'Ilhas de Trindade e Martim Vaz',
    geo: [-29.3, -20.5],
    radius: 3.0,
    depthColor: '#0284c7',
    shallowColor: '#7dd3fc',
  },
  {
    name: 'Arquipélago de Abrolhos',
    geo: [-38.7, -17.9],
    radius: 3.0,
    depthColor: '#0891b2',
    shallowColor: '#a5f3fc',
  },
];
