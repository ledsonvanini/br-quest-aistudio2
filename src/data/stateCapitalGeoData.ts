export interface StateCapitalGeoInfo {
  stateId: string;
  capital: string;
  lat: number;
  lng: number;
  timezone: string; // e.g. 'GMT-3 (Brasília)'
  defaultClimate: string; // e.g. 'Subtropical Úmido'
  typicalFlower: { name: string; icon: string; color: string; particleType: 'petals' | 'leaves' | 'stars' };
}

export const STATE_CAPITAL_GEO_DATA: Record<string, StateCapitalGeoInfo> = {
  RS: {
    stateId: 'RS',
    capital: 'Porto Alegre',
    lat: -30.0346,
    lng: -51.2177,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Subtropical Úmido',
    typicalFlower: { name: 'Brinco-de-Princesa', icon: '🌺', color: '#f43f5e', particleType: 'petals' },
  },
  SC: {
    stateId: 'SC',
    capital: 'Florianópolis',
    lat: -27.5954,
    lng: -48.5480,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Subtropical',
    typicalFlower: { name: 'Orquídea Laelia Purpurata', icon: '🌸', color: '#c084fc', particleType: 'petals' },
  },
  PR: {
    stateId: 'PR',
    capital: 'Curitiba',
    lat: -25.4290,
    lng: -49.2671,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Subtropical Cfb',
    typicalFlower: { name: 'Gralha Azul & Araucária', icon: '🌲', color: '#10b981', particleType: 'leaves' },
  },
  SP: {
    stateId: 'SP',
    capital: 'São Paulo',
    lat: -23.5505,
    lng: -46.6333,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical de Altitude',
    typicalFlower: { name: 'Flor do Ipê Amarelo', icon: '🌼', color: '#eab308', particleType: 'petals' },
  },
  RJ: {
    stateId: 'RJ',
    capital: 'Rio de Janeiro',
    lat: -22.9068,
    lng: -43.1729,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Litorâneo',
    typicalFlower: { name: 'Ipê Roxo & Bromélia', icon: '🌺', color: '#a855f7', particleType: 'petals' },
  },
  MG: {
    stateId: 'MG',
    capital: 'Belo Horizonte',
    lat: -19.9167,
    lng: -43.9345,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical de Altitude',
    typicalFlower: { name: 'Sempre-Viva do Cerrado', icon: '🌸', color: '#f59e0b', particleType: 'petals' },
  },
  ES: {
    stateId: 'ES',
    capital: 'Vitória',
    lat: -20.3155,
    lng: -40.3128,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Úmido',
    typicalFlower: { name: 'Orquídea do Convento', icon: '🌸', color: '#ec4899', particleType: 'petals' },
  },
  BA: {
    stateId: 'BA',
    capital: 'Salvador',
    lat: -12.9714,
    lng: -38.5014,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Atlântico',
    typicalFlower: { name: 'Flor de Mandacaru', icon: '🌵', color: '#fbbf24', particleType: 'petals' },
  },
  PE: {
    stateId: 'PE',
    capital: 'Recife',
    lat: -8.0476,
    lng: -34.8770,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Úmido',
    typicalFlower: { name: 'Flor de Xique-Xique', icon: '🌺', color: '#f97316', particleType: 'petals' },
  },
  CE: {
    stateId: 'CE',
    capital: 'Fortaleza',
    lat: -3.7172,
    lng: -38.5433,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Semiárido / Tropical',
    typicalFlower: { name: 'Flor da Carnaúba', icon: '🌴', color: '#eab308', particleType: 'leaves' },
  },
  MA: {
    stateId: 'MA',
    capital: 'São Luís',
    lat: -2.5307,
    lng: -44.3068,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Megatérmico',
    typicalFlower: { name: 'Flor do Babaçu', icon: '🌿', color: '#84cc16', particleType: 'leaves' },
  },
  PB: {
    stateId: 'PB',
    capital: 'João Pessoa',
    lat: -7.1195,
    lng: -34.8450,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Litorâneo',
    typicalFlower: { name: 'Orquídea da Paraíba', icon: '🌸', color: '#ec4899', particleType: 'petals' },
  },
  RN: {
    stateId: 'RN',
    capital: 'Natal',
    lat: -5.7945,
    lng: -35.2110,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Seco',
    typicalFlower: { name: 'Flor de Cajuzeiro', icon: '🌺', color: '#ef4444', particleType: 'petals' },
  },
  AL: {
    stateId: 'AL',
    capital: 'Maceió',
    lat: -9.6658,
    lng: -35.7351,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Úmido',
    typicalFlower: { name: 'Vitória-Litorânea', icon: '🌸', color: '#38bdf8', particleType: 'petals' },
  },
  SE: {
    stateId: 'SE',
    capital: 'Aracaju',
    lat: -10.9472,
    lng: -37.0731,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Costeiro',
    typicalFlower: { name: 'Flor de Mangue', icon: '🌿', color: '#10b981', particleType: 'leaves' },
  },
  PI: {
    stateId: 'PI',
    capital: 'Teresina',
    lat: -5.0920,
    lng: -42.8038,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Semiúmido',
    typicalFlower: { name: 'Flor do Buriti', icon: '🌴', color: '#f59e0b', particleType: 'leaves' },
  },
  AM: {
    stateId: 'AM',
    capital: 'Manaus',
    lat: -3.1190,
    lng: -60.0217,
    timezone: 'UTC-4 (Fuso do Amazonas)',
    defaultClimate: 'Equatorial Úmido',
    typicalFlower: { name: 'Vitória-Régia Sagrada', icon: '🪷', color: '#22c55e', particleType: 'leaves' },
  },
  PA: {
    stateId: 'PA',
    capital: 'Belém',
    lat: -1.4558,
    lng: -48.4902,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Equatorial Superúmido',
    typicalFlower: { name: 'Flor do Açaizeiro', icon: '🌴', color: '#a855f7', particleType: 'leaves' },
  },
  AC: {
    stateId: 'AC',
    capital: 'Rio Branco',
    lat: -9.9753,
    lng: -67.8249,
    timezone: 'UTC-5 (Fuso do Acre)',
    defaultClimate: 'Equatorial Quente',
    typicalFlower: { name: 'Flor da Seringueira', icon: '🌿', color: '#10b981', particleType: 'leaves' },
  },
  RO: {
    stateId: 'RO',
    capital: 'Porto Velho',
    lat: -8.7619,
    lng: -63.9039,
    timezone: 'UTC-4 (Fuso Ocidental)',
    defaultClimate: 'Equatorial de Transição',
    typicalFlower: { name: 'Orquídea da Madeira', icon: '🌸', color: '#f43f5e', particleType: 'petals' },
  },
  RR: {
    stateId: 'RR',
    capital: 'Boa Vista',
    lat: 2.8235,
    lng: -60.6758,
    timezone: 'UTC-4 (Fuso Ocidental)',
    defaultClimate: 'Tropical Savânico',
    typicalFlower: { name: 'Flor do Lavrado', icon: '🌼', color: '#eab308', particleType: 'petals' },
  },
  AP: {
    stateId: 'AP',
    capital: 'Macapá',
    lat: 0.0355,
    lng: -51.0705,
    timezone: 'UTC-3 (Equador)',
    defaultClimate: 'Equatorial Quente/Úmido',
    typicalFlower: { name: 'Flor de Açaí da Linha do Equador', icon: '🌿', color: '#06b6d4', particleType: 'leaves' },
  },
  TO: {
    stateId: 'TO',
    capital: 'Palmas',
    lat: -10.2128,
    lng: -48.3603,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Continental',
    typicalFlower: { name: 'Flor do Capim Dourado', icon: '🌾', color: '#f59e0b', particleType: 'petals' },
  },
  DF: {
    stateId: 'DF',
    capital: 'Brasília',
    lat: -15.7975,
    lng: -47.8919,
    timezone: 'UTC-3 (Capital Federal)',
    defaultClimate: 'Tropical de Altitude (Cerrado)',
    typicalFlower: { name: 'Ipê Amarelo Monumental', icon: '🌼', color: '#fbbf24', particleType: 'petals' },
  },
  GO: {
    stateId: 'GO',
    capital: 'Goiânia',
    lat: -16.6869,
    lng: -49.2648,
    timezone: 'UTC-3 (Brasília)',
    defaultClimate: 'Tropical Semiúmido',
    typicalFlower: { name: 'Flor do Pequizeiro', icon: '🌸', color: '#facc15', particleType: 'petals' },
  },
  MT: {
    stateId: 'MT',
    capital: 'Cuiabá',
    lat: -15.6014,
    lng: -56.0979,
    timezone: 'UTC-4 (Fuso do Pantanal)',
    defaultClimate: 'Tropical Continental Quente',
    typicalFlower: { name: 'Flor de Aguapé Pantaneira', icon: '🪷', color: '#818cf8', particleType: 'petals' },
  },
  MS: {
    stateId: 'MS',
    capital: 'Campo Grande',
    lat: -20.4697,
    lng: -54.6201,
    timezone: 'UTC-4 (Fuso Pantaneiro)',
    defaultClimate: 'Tropical de Altitude',
    typicalFlower: { name: 'Flor de Piuva Roxa', icon: '🌺', color: '#c084fc', particleType: 'petals' },
  },
};

/**
 * Retorna a estação do ano aproximada no Hemisfério Sul com base no mês atual
 */
export function getSouthernHemisphereSeason(date: Date = new Date()): {
  namePt: string;
  icon: string;
  color: string;
} {
  const month = date.getMonth(); // 0 a 11
  const day = date.getDate();

  // Verão: 21 Dez - 20 Mar
  if ((month === 11 && day >= 21) || month === 0 || month === 1 || (month === 2 && day < 20)) {
    return { namePt: 'Verão', icon: '☀️', color: '#eab308' };
  }
  // Outono: 20 Mar - 20 Jun
  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 20)) {
    return { namePt: 'Outono', icon: '🍂', color: '#f97316' };
  }
  // Inverno: 20 Jun - 22 Set
  if ((month === 5 && day >= 20) || month === 6 || month === 7 || (month === 8 && day < 22)) {
    return { namePt: 'Inverno', icon: '❄️', color: '#38bdf8' };
  }
  // Primavera: 22 Set - 21 Dez
  return { namePt: 'Primavera', icon: '🌸', color: '#ec4899' };
}
