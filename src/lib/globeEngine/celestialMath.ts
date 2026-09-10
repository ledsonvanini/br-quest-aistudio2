/**
 * Analytical Astronomical and Celestial Mathematics for 3D Globe Engine
 * Calculates real-time solar positions, lunar phases/orbits, planetary positions,
 * and topocentric telemetric distances for Brazilian states.
 */
import * as THREE from 'three';
import {
  EARTH_RADIUS_KM,
  SPEED_OF_LIGHT_KM_S,
  SCENE_GLOBE_RADIUS,
  latLonToSphereVector3,
} from './sphericalMath';
import {
  CelestialBodyInfo,
  MoonPhaseData,
  StateAstrometryTelemetry,
  GlobeSeason,
} from './types';

// Constants
export const AU_KM = 149597870.7; // 1 Astronomical Unit in km
export const MOON_MEAN_DISTANCE_KM = 384400.0;
export const AXIAL_TILT_DEG = 23.43928; // Earth's obliquity of the ecliptic

/**
 * Calculates current subsolar point (lat, lon) and distance from Earth center to Sun in km
 */
export function calculateSolarCoordinates(date: Date = new Date(), seasonOverride?: GlobeSeason): {
  subSolarLat: number;
  subSolarLon: number;
  distanceKm: number;
  sunDirection: THREE.Vector3;
} {
  // Day of year calculation
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Subsolar longitude based on UTC time (15° per hour, Greenwich at 12:00 UTC)
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  // Subsolar meridian moves 360° westward in 24 hours
  let subSolarLon = (12 - utcHours) * 15;
  while (subSolarLon < -180) subSolarLon += 360;
  while (subSolarLon > 180) subSolarLon -= 360;

  let subSolarLat = 0;

  if (seasonOverride && seasonOverride !== 'realtime') {
    switch (seasonOverride) {
      case 'summer_solstice': // Dec 21 - Tropic of Capricorn in Southern Hemisphere (-23.44°)
        subSolarLat = -AXIAL_TILT_DEG;
        break;
      case 'winter_solstice': // Jun 21 - Tropic of Cancer (+23.44°)
        subSolarLat = AXIAL_TILT_DEG;
        break;
      case 'autumn_equinox': // Mar 20 - Equator (0°)
      case 'spring_equinox': // Sep 22 - Equator (0°)
        subSolarLat = 0;
        break;
    }
  } else {
    // Solar declination (approximate formula by Cooper, 1969)
    const declinationRad =
      (AXIAL_TILT_DEG * Math.PI) / 180 *
      Math.sin(((360 / 365) * (dayOfYear + 284) * Math.PI) / 180);
    subSolarLat = declinationRad * (180 / Math.PI);
  }

  // Earth-Sun distance (elliptical orbit: perihelion ~Jan 3, aphelion ~July 4)
  const meanAnomaly = ((2 * Math.PI) / 365.25) * (dayOfYear - 3);
  const distanceKm = AU_KM * (1 - 0.0167 * Math.cos(meanAnomaly));

  const sunDirection = latLonToSphereVector3(subSolarLat, subSolarLon, 1.0).normalize();

  return {
    subSolarLat,
    subSolarLon,
    distanceKm,
    sunDirection,
  };
}

/**
 * Calculates current Lunar orbital position, phase fraction, and topocentric parameters
 */
export function calculateLunarCoordinates(date: Date = new Date()): {
  subMoonLat: number;
  subMoonLon: number;
  distanceKm: number;
  phase: MoonPhaseData;
  moonDirection: THREE.Vector3;
} {
  // Known reference new moon: Jan 11, 2024, 11:57 UTC
  const refNewMoonMs = Date.UTC(2024, 0, 11, 11, 57, 0);
  const synodicMonthDays = 29.53058867;
  const daysSinceRef = (date.getTime() - refNewMoonMs) / (1000 * 60 * 60 * 24);

  const phaseAgeDays = ((daysSinceRef % synodicMonthDays) + synodicMonthDays) % synodicMonthDays;
  const phaseAngle = (phaseAgeDays / synodicMonthDays) * 2 * Math.PI;

  // Illumination fraction: 0.0 at new moon, 1.0 at full moon
  const illuminationFraction = (1 - Math.cos(phaseAngle)) / 2;

  let phaseName = 'Lua Nova';
  let phaseIcon = '🌑';
  if (phaseAgeDays >= 1.5 && phaseAgeDays < 6.5) {
    phaseName = 'Crescente Inicial';
    phaseIcon = '🌒';
  } else if (phaseAgeDays >= 6.5 && phaseAgeDays < 8.5) {
    phaseName = 'Quarto Crescente';
    phaseIcon = '🌓';
  } else if (phaseAgeDays >= 8.5 && phaseAgeDays < 13.5) {
    phaseName = 'Gibosa Crescente';
    phaseIcon = '🌔';
  } else if (phaseAgeDays >= 13.5 && phaseAgeDays < 16.5) {
    phaseName = 'Lua Cheia';
    phaseIcon = '🌕';
  } else if (phaseAgeDays >= 16.5 && phaseAgeDays < 21.5) {
    phaseName = 'Gibosa Minguante';
    phaseIcon = '🌖';
  } else if (phaseAgeDays >= 21.5 && phaseAgeDays < 23.5) {
    phaseName = 'Quarto Minguante';
    phaseIcon = '🌗';
  } else if (phaseAgeDays >= 23.5 && phaseAgeDays < 28.0) {
    phaseName = 'Minguante Final';
    phaseIcon = '🌘';
  }

  // Moon orbit inclination ~5.14° relative to ecliptic
  // Approximate lunar latitude variation
  const lunarDraconicDays = 27.2122;
  const draconicPhase = ((daysSinceRef % lunarDraconicDays) + lunarDraconicDays) % lunarDraconicDays;
  const subMoonLat = 28.5 * Math.sin((draconicPhase / lunarDraconicDays) * 2 * Math.PI);

  // Moon orbital motion is eastward (~13.2° per day relative to stars)
  const siderealDays = 27.32166;
  const siderealPhase = ((daysSinceRef % siderealDays) + siderealDays) % siderealDays;
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
  let subMoonLon = (12 - utcHours) * 15 - (siderealPhase / siderealDays) * 360;
  while (subMoonLon < -180) subMoonLon += 360;
  while (subMoonLon > 180) subMoonLon -= 360;

  // Distance variations (Perigee ~363,300 km to Apogee ~405,500 km)
  const anomalisticDays = 27.55455;
  const anomalisticPhase = ((daysSinceRef % anomalisticDays) + anomalisticDays) % anomalisticDays;
  const distanceKm =
    MOON_MEAN_DISTANCE_KM - 21000 * Math.cos((anomalisticPhase / anomalisticDays) * 2 * Math.PI);

  const moonDirection = latLonToSphereVector3(subMoonLat, subMoonLon, 1.0).normalize();

  const phase: MoonPhaseData = {
    phaseAngle,
    illuminationFraction,
    phaseName,
    phaseIcon,
    ageDays: Number(phaseAgeDays.toFixed(1)),
    distanceKm: Math.round(distanceKm),
    subSolarLatitude: subMoonLat,
    subSolarLongitude: subMoonLon,
  };

  return {
    subMoonLat,
    subMoonLon,
    distanceKm,
    phase,
    moonDirection,
  };
}

/**
 * Calculates topocentric astrometric telemetry from a specific Brazilian state capital
 */
export function calculateStateAstrometry(
  stateId: string,
  stateName: string,
  capitalName: string,
  lat: number,
  lon: number,
  date: Date = new Date(),
  seasonOverride?: GlobeSeason
): StateAstrometryTelemetry {
  const solar = calculateSolarCoordinates(date, seasonOverride);
  const lunar = calculateLunarCoordinates(date);

  // State surface position unit vector
  const stateVec = latLonToSphereVector3(lat, lon, 1.0).normalize();

  // 1. Solar calculations
  // Dot product between surface normal and sun direction = cos(zenith angle)
  const cosZenith = Math.max(-1, Math.min(1, stateVec.dot(solar.sunDirection)));
  const solarZenithAngleDeg = (Math.acos(cosZenith) * 180) / Math.PI;

  let localSolarStatus: 'dia' | 'crepusculo' | 'noite' = 'dia';
  if (solarZenithAngleDeg > 96) {
    localSolarStatus = 'noite';
  } else if (solarZenithAngleDeg > 84) {
    localSolarStatus = 'crepusculo';
  } else {
    localSolarStatus = 'dia';
  }

  // Insolation factor (0% at night to 100% at zenith)
  const insolationPercent = Math.max(0, Math.round(cosZenith * 100));

  // Topocentric correction for distance to Sun (Earth radius delta)
  const distanceToSunKm = solar.distanceKm - EARTH_RADIUS_KM * cosZenith;
  const lightTimeToSunMin = Number((distanceToSunKm / (SPEED_OF_LIGHT_KM_S * 60)).toFixed(2));

  // 2. Lunar topocentric calculations
  // Parallax vector: Moon vector from center of Earth - state vector from center
  const moonDistKm = lunar.distanceKm;
  const earthCenterToMoon = lunar.moonDirection.clone().multiplyScalar(moonDistKm);
  const earthCenterToState = stateVec.clone().multiplyScalar(EARTH_RADIUS_KM);
  const stateToMoonVec = earthCenterToMoon.clone().sub(earthCenterToState);

  const distanceToMoonKm = Math.round(stateToMoonVec.length());
  const lightTimeToMoonSec = Number((distanceToMoonKm / SPEED_OF_LIGHT_KM_S).toFixed(3));

  return {
    stateId,
    stateName,
    capitalName,
    lat,
    lon,
    distanceToMoonKm,
    lightTimeToMoonSec,
    distanceToSunKm: Math.round(distanceToSunKm),
    lightTimeToSunMin,
    solarZenithAngleDeg: Number(solarZenithAngleDeg.toFixed(1)),
    localSolarStatus,
    insolationPercent,
  };
}

/**
 * Returns positions and physical info for visible planets in the 3D scene
 */
export function getVisiblePlanetsInfo(date: Date = new Date(), sunDir: THREE.Vector3): CelestialBodyInfo[] {
  // Semi-major axes and visual sizes scaled harmoniously for interactive 3D inspection
  const days = (date.getTime() - Date.UTC(2026, 0, 1)) / (1000 * 60 * 60 * 24);

  // Heliocentric approximate angles
  const planetsConfig = [
    {
      id: 'mercurio',
      name: 'Mercúrio',
      ptName: 'Mercúrio',
      symbol: '☿',
      type: 'planet' as const,
      categoryLabel: 'Planeta Telúrico (Rochoso)',
      periodDays: 87.97,
      distanceKm: 91.7e6,
      radiusKm: 2439.7,
      sceneDist: 5.2,
      apparentSize: 0.24,
      color: '#cbd5e1',
      description: 'Menor planeta do Sistema Solar, rico em ferro e sem atmosfera protetora.',
      surfaceTemp: '-180 °C a +430 °C',
      massEarthRelative: 0.055,
      gravityMss: 3.7,
      lightTimeSeconds: 306,
      visibilityBrazil: 'Visível a olho nu rente ao horizonte ao crepúsculo matutino ou vespertino.',
      curiosity: 'Um ano em Mercúrio dura 88 dias terrestres, mas seu dia solar dura 176 dias.',
    },
    {
      id: 'venus',
      name: 'Vênus',
      ptName: 'Vênus',
      symbol: '♀',
      type: 'planet' as const,
      categoryLabel: 'Planeta Telúrico ("Gêmeo da Terra")',
      periodDays: 224.7,
      distanceKm: 41.4e6,
      radiusKm: 6051.8,
      sceneDist: 8.5,
      apparentSize: 0.50,
      color: '#fef08a',
      description: 'A célebre "Estrela D\'Alva", astro mais brilhante do céu noturno brasileiro.',
      surfaceTemp: '464 °C (efeito estufa extremo)',
      massEarthRelative: 0.815,
      gravityMss: 8.87,
      lightTimeSeconds: 138,
      visibilityBrazil: 'Ponto ultra-brilhante visível a oeste no entardecer ou a leste na alvorada.',
      curiosity: 'Gira em rotação retrógrada: o Sol lá nasce no oeste e se põe no leste.',
    },
    {
      id: 'marte',
      name: 'Marte',
      ptName: 'Marte',
      symbol: '♂',
      type: 'planet' as const,
      categoryLabel: 'Planeta Telúrico ("Planeta Vermelho")',
      periodDays: 686.98,
      distanceKm: 78.3e6,
      radiusKm: 3389.5,
      sceneDist: 18.5,
      apparentSize: 0.35,
      color: '#f87171',
      description: 'Mundo árido com cânions colossais e calotas de gelo seco nos polos.',
      surfaceTemp: '-63 °C (média)',
      massEarthRelative: 0.107,
      gravityMss: 3.72,
      lightTimeSeconds: 261,
      visibilityBrazil: 'Disco avermelhado inconfundível que cruza as noites límpidas de inverno no Brasil.',
      curiosity: 'Abriga o Monte Olimpo com 21 km de altura, três vezes mais alto que o Monte Everest.',
    },
    {
      id: 'jupiter',
      name: 'Júpiter',
      ptName: 'Júpiter',
      symbol: '♃',
      type: 'planet' as const,
      categoryLabel: 'Gigante Gasoso (Escudo Protetor)',
      periodDays: 4332.59,
      distanceKm: 628.7e6,
      radiusKm: 69911.0,
      sceneDist: 27.5,
      apparentSize: 1.55,
      color: '#fed7aa',
      description: 'O maior planeta do Sistema Solar, guardião da Terra contra impactos de asteroides.',
      surfaceTemp: '-110 °C (topo de nuvens)',
      massEarthRelative: 317.8,
      gravityMss: 24.79,
      lightTimeSeconds: 2097,
      visibilityBrazil: 'Farol dourado brilhante que domina o zênite brasileiro durante meses.',
      curiosity: 'A sua Grande Mancha Vermelha é um ciclone anti-horário maior que o próprio planeta Terra.',
    },
    {
      id: 'saturno',
      name: 'Saturno',
      ptName: 'Saturno',
      symbol: '♄',
      type: 'planet' as const,
      categoryLabel: 'Gigante Gasoso com Anéis',
      periodDays: 10759.22,
      distanceKm: 1275.0e6,
      radiusKm: 58232.0,
      sceneDist: 34.0,
      apparentSize: 1.30,
      color: '#fde68a',
      description: 'A joia do Sistema Solar, coroada pelo mais espetacular sistema de anéis.',
      surfaceTemp: '-140 °C',
      massEarthRelative: 95.2,
      gravityMss: 10.44,
      lightTimeSeconds: 4253,
      visibilityBrazil: 'Brilho calmo e amarelado; seus anéis são visíveis em pequenos telescópios.',
      curiosity: 'Possui densidade menor que a da água: se houvesse um oceano gigante, Saturno flutuaria.',
    },
    {
      id: 'urano',
      name: 'Urano',
      ptName: 'Urano',
      symbol: '♅',
      type: 'planet' as const,
      categoryLabel: 'Gigante de Gelo (Eixo Deitado)',
      periodDays: 30685.4,
      distanceKm: 2720.0e6,
      radiusKm: 25362.0,
      sceneDist: 41.0,
      apparentSize: 0.82,
      color: '#67e8f9',
      description: 'Gigante gelado de metano e água, com eixo de rotação inclinado a 98°.',
      surfaceTemp: '-224 °C (atmosfera mais fria)',
      massEarthRelative: 14.5,
      gravityMss: 8.69,
      lightTimeSeconds: 9070,
      visibilityBrazil: 'Astro pálido esverdeado observável com binóculos em céus escuros.',
      curiosity: 'Gira praticamente deitado em relação ao plano de sua órbita solar.',
    },
    {
      id: 'netuno',
      name: 'Netuno',
      ptName: 'Netuno',
      symbol: '♆',
      type: 'planet' as const,
      categoryLabel: 'Gigante de Gelo (Último Planeta)',
      periodDays: 60189.0,
      distanceKm: 4350.0e6,
      radiusKm: 24622.0,
      sceneDist: 47.5,
      apparentSize: 0.80,
      color: '#60a5fa',
      description: 'O mundo mais distante do Sol; ventos supersônicos ultrapassam 2.100 km/h.',
      surfaceTemp: '-218 °C',
      massEarthRelative: 17.1,
      gravityMss: 11.15,
      lightTimeSeconds: 14500,
      visibilityBrazil: 'Ponto azulado tênue visível com telescópios de média abertura.',
      curiosity: 'Leva cerca de 165 anos terrestres para completar uma única volta ao redor do Sol.',
    },
  ];

  // Earth's heliocentric position for dynamic distance calculation
  const earthPeriodDays = 365.256;
  const earthAngle = ((days % earthPeriodDays) / earthPeriodDays) * 2 * Math.PI;
  const AU_KM = 149597870;

  // Semi-major axes in AU
  const semiMajorAxesAU: Record<string, number> = {
    mercurio: 0.387,
    venus: 0.723,
    marte: 1.524,
    jupiter: 5.204,
    saturno: 9.582,
    urano: 19.218,
    netuno: 30.110,
  };

  return planetsConfig.map((p) => {
    // Angular orbital position along ecliptic plane
    const angle = ((days % p.periodDays) / p.periodDays) * 2 * Math.PI;
    // Ecliptic plane inclination relative to scene axes
    const tilt = (AXIAL_TILT_DEG * Math.PI) / 180;

    // Real dynamic distance Earth-Planet (in Astronomical Units and Kilometers)
    const rAU = semiMajorAxesAU[p.id] || (p.distanceKm / AU_KM);
    const distAU = Math.sqrt(
      1.0 + rAU * rAU - 2.0 * rAU * Math.cos(angle - earthAngle)
    );
    const currentDistKm = Math.round(distAU * AU_KM);
    const lightTimeSeconds = Math.round(currentDistKm / 299792.458);

    const x = p.sceneDist * Math.cos(angle);
    const y = 0;
    const z = p.sceneDist * Math.sin(angle);

    return {
      id: p.id,
      name: p.name,
      ptName: p.ptName,
      symbol: p.symbol,
      type: p.type,
      categoryLabel: p.categoryLabel,
      position: new THREE.Vector3(x, y, z),
      distanceKm: currentDistKm,
      radiusKm: p.radiusKm,
      apparentSize: p.apparentSize,
      color: p.color,
      description: p.description,
      surfaceTemp: p.surfaceTemp,
      massEarthRelative: p.massEarthRelative,
      gravityMss: p.gravityMss,
      lightTimeSeconds: lightTimeSeconds,
      visibilityBrazil: p.visibilityBrazil,
      curiosity: p.curiosity,
      orbitalPeriodDays: p.periodDays,
    };
  });
}
