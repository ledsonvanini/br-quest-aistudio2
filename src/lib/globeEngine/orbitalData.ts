/**
 * Real Keplerian Orbital Elements & Physical Data for the Solar System
 * Data confirmed by IAU (International Astronomical Union) and NASA JPL Horizons.
 */

export interface PlanetOrbitalElements {
  id: string;
  name: string;
  symbol: string;
  semiMajorAxisAU: number;
  eccentricity: number;
  periodDays: number;
  meanOrbitalSpeedKmS: number;
  inclinationDeg: number;
  color: string;
  radiusKm: number;
  massRelative: number;
  description: string;
  sceneDist: number;
  apparentSize: number;
}

/** Canonical 3D scene orbital distances ensuring 100% alignment between orbits and meshes */
export const EARTH_SCENE_ORBIT_RADIUS = 14.0;
export const MOON_SCENE_ORBIT_RADIUS = 5.6;
export const MOON_ORBIT_INCLINATION_RAD = (5.145 * Math.PI) / 180;
export const ASTEROID_BELT_SCENE_RADIUS = 23.0;

export const SOLAR_SYSTEM_PLANETS: PlanetOrbitalElements[] = [
  {
    id: 'mercurio',
    name: 'Mercúrio',
    symbol: '☿',
    semiMajorAxisAU: 0.3871,
    eccentricity: 0.2056,
    periodDays: 87.969,
    meanOrbitalSpeedKmS: 47.36,
    inclinationDeg: 7.0,
    color: '#cbd5e1',
    radiusKm: 2439.7,
    massRelative: 0.055,
    description: 'Menor planeta e o mais veloz; temperaturas oscilam entre -180 °C e +430 °C.',
    sceneDist: 5.2,
    apparentSize: 0.24,
  },
  {
    id: 'venus',
    name: 'Vênus',
    symbol: '♀',
    semiMajorAxisAU: 0.7233,
    eccentricity: 0.0068,
    periodDays: 224.701,
    meanOrbitalSpeedKmS: 35.02,
    inclinationDeg: 3.39,
    color: '#fef08a',
    radiusKm: 6051.8,
    massRelative: 0.815,
    description: 'A "Estrela D\'Alva"; atmosfera densa de CO2 com efeito estufa extremo de 464 °C.',
    sceneDist: 8.5,
    apparentSize: 0.50,
  },
  {
    id: 'terra',
    name: 'Terra',
    symbol: '♁',
    semiMajorAxisAU: 1.0000,
    eccentricity: 0.0167,
    periodDays: 365.256,
    meanOrbitalSpeedKmS: 29.78,
    inclinationDeg: 0.0,
    color: '#38bdf8',
    radiusKm: 6371.0,
    massRelative: 1.0,
    description: 'Nosso lar; o único mundo conhecido com vida ativa e oceanos de água líquida.',
    sceneDist: 14.0,
    apparentSize: 0.55,
  },
  {
    id: 'marte',
    name: 'Marte',
    symbol: '♂',
    semiMajorAxisAU: 1.5237,
    eccentricity: 0.0934,
    periodDays: 686.98,
    meanOrbitalSpeedKmS: 24.07,
    inclinationDeg: 1.85,
    color: '#f87171',
    radiusKm: 3389.5,
    massRelative: 0.107,
    description: 'O Planeta Vermelho; possui cânions colossais e o Monte Olimpo (21 km de altura).',
    sceneDist: 18.5,
    apparentSize: 0.35,
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    symbol: '♃',
    semiMajorAxisAU: 5.2044,
    eccentricity: 0.0485,
    periodDays: 4332.59,
    meanOrbitalSpeedKmS: 13.07,
    inclinationDeg: 1.30,
    color: '#fed7aa',
    radiusKm: 69911.0,
    massRelative: 317.8,
    description: 'Maior planeta (11x diâmetro da Terra); gigante gasoso com a Grande Mancha Vermelha.',
    sceneDist: 27.5,
    apparentSize: 1.55,
  },
  {
    id: 'saturno',
    name: 'Saturno',
    symbol: '♄',
    semiMajorAxisAU: 9.5826,
    eccentricity: 0.0555,
    periodDays: 10759.22,
    meanOrbitalSpeedKmS: 9.69,
    inclinationDeg: 2.49,
    color: '#fde68a',
    radiusKm: 58232.0,
    massRelative: 95.2,
    description: 'A joia do Sistema Solar; espetacular sistema de anéis de gelo e poeira.',
    sceneDist: 34.0,
    apparentSize: 1.30,
  },
  {
    id: 'urano',
    name: 'Urano',
    symbol: '♅',
    semiMajorAxisAU: 19.2184,
    eccentricity: 0.0463,
    periodDays: 30685.4,
    meanOrbitalSpeedKmS: 6.81,
    inclinationDeg: 0.77,
    color: '#67e8f9',
    radiusKm: 25362.0,
    massRelative: 14.5,
    description: 'Gigante de gelo azul-turquesa com atmosfera de metano e eixo inclinado a 98°.',
    sceneDist: 41.0,
    apparentSize: 0.82,
  },
  {
    id: 'netuno',
    name: 'Netuno',
    symbol: '♆',
    semiMajorAxisAU: 30.1104,
    eccentricity: 0.0095,
    periodDays: 60189.0,
    meanOrbitalSpeedKmS: 5.43,
    inclinationDeg: 1.77,
    color: '#60a5fa',
    radiusKm: 24622.0,
    massRelative: 17.1,
    description: 'Planeta mais distante; ventos supersônicos ultrapassam 2.100 km/h.',
    sceneDist: 47.5,
    apparentSize: 0.80,
  },
];
