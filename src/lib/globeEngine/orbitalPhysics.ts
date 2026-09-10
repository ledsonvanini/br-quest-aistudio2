/**
 * Orbital and Celestial Physics Engine
 * Formulates real Keplerian orbits, heliocentric planetary translation around the Sun,
 * Earth's axial rotation (obliquity 23.44°), and lunar geocentric revolution.
 */
import * as THREE from 'three';
import {
  SOLAR_SYSTEM_PLANETS,
  PlanetOrbitalElements,
  EARTH_SCENE_ORBIT_RADIUS,
  MOON_SCENE_ORBIT_RADIUS,
  MOON_ORBIT_INCLINATION_RAD,
} from './orbitalData';
import { AU_KM } from './celestialMath';

export { SOLAR_SYSTEM_PLANETS };
export type { PlanetOrbitalElements };

// Astronomical Constants (CODATA / IAU values)
export const SOLAR_MASS_KG = 1.98847e30; // 99.8% of Solar System mass
export const EARTH_MASS_KG = 5.9722e24;
export const GRAVITATIONAL_CONSTANT = 6.67430e-11;
export const EARTH_AXIAL_TILT_DEG = 23.439281; // Earth's obliquity of the ecliptic
export const EARTH_ROTATION_SIDEREAL_HOURS = 23.9344696; // 23h 56m 04.09s
export const EARTH_EQUATORIAL_SPEED_KM_H = 1674.4; // Tangential speed at equator
export const EARTH_ORBITAL_PERIOD_DAYS = 365.256363; // Sidereal year

export interface HeliocentricOrbitalState {
  dayOfYear: number;
  formattedDate: string;
  seasonBrazil: string;
  seasonIcon: string;
  distanceToSunKm: number;
  distanceToSunAU: number;
  orbitalSpeedKmS: number;
  orbitalProgressPct: number;
  solarDeclinationDeg: number;
  axialTiltDeg: number;
  earthHeliocentricAngleRad: number;
  earthHeliocentricPos: THREE.Vector3;
  earthScenePos: THREE.Vector3;
  sunScenePos: THREE.Vector3;
  moonScenePos: THREE.Vector3;
  moonPhaseName: string;
  moonPhaseAgeDays: number;
  planets: {
    id: string;
    name: string;
    symbol: string;
    position: THREE.Vector3;
    distanceToEarthKm: number;
    distanceToEarthAU: number;
    orbitalProgressPct: number;
    orbitalSpeedKmS: number;
  }[];
}

/**
 * Calculates continuous physical orbital mechanics for a specific day of the year (1-365.25)
 * and hour of the day (0-24). Supports planetary radial alignment scene.
 */
export function calculateHeliocentricOrbitalState(
  dayOfYear: number,
  hourOfDay: number = 12,
  alignPlanets: boolean = false
): HeliocentricOrbitalState {
  const boundedDay = Math.max(1, Math.min(365.25, dayOfYear));
  const totalDays = boundedDay + hourOfDay / 24.0;

  // Earth's Mean Anomaly (Perihelion is around day 3, Jan 3)
  const meanAnomalyRad = ((2 * Math.PI) / EARTH_ORBITAL_PERIOD_DAYS) * (totalDays - 3);

  // Kepler's equation approximation for true anomaly (eccentricity e = 0.0167)
  const e = 0.0167;
  const trueAnomalyRad = meanAnomalyRad + 2 * e * Math.sin(meanAnomalyRad);

  // Earth-Sun distance (elliptical orbit): r = a(1 - e²) / (1 + e * cos(v))
  const distanceToSunAU = (1 - e * e) / (1 + e * Math.cos(trueAnomalyRad));
  const distanceToSunKm = Math.round(distanceToSunAU * AU_KM);

  // Vis-viva equation: v = sqrt(GM * (2/r - 1/a))
  const orbitalSpeedKmS = +(29.78 * Math.sqrt(2 / distanceToSunAU - 1)).toFixed(2);

  // Heliocentric orbital angle of Earth (0 rad at vernal equinox ~ March 20, day ~79)
  const vernalEquinoxDay = 79.25;
  const daysSinceEquinox = totalDays - vernalEquinoxDay;
  const earthOrbitalAngleRad =
    ((daysSinceEquinox % EARTH_ORBITAL_PERIOD_DAYS) / EARTH_ORBITAL_PERIOD_DAYS) * 2 * Math.PI;

  // Solar declination δ = arcsin(sin(tilt) * sin(orbitalAngle))
  const tiltRad = (EARTH_AXIAL_TILT_DEG * Math.PI) / 180;
  const sinDeclination = Math.sin(tiltRad) * Math.sin(earthOrbitalAngleRad);
  const solarDeclinationDeg = +(Math.asin(sinDeclination) * (180 / Math.PI)).toFixed(1);

  // Astronomical Season in Brazil (Southern Hemisphere)
  let seasonBrazil = 'Outono';
  let seasonIcon = '🍂';
  if (totalDays >= 355 || totalDays < 79) {
    seasonBrazil = 'Verão (Solstício de Dezembro)';
    seasonIcon = '☀️';
  } else if (totalDays >= 79 && totalDays < 172) {
    seasonBrazil = 'Outono (Equinócio de Março)';
    seasonIcon = '🍂';
  } else if (totalDays >= 172 && totalDays < 265) {
    seasonBrazil = 'Inverno (Solstício de Junho)';
    seasonIcon = '❄️';
  } else {
    seasonBrazil = 'Primavera (Equinócio de Setembro)';
    seasonIcon = '🌸';
  }

  // Format Calendar Date
  const dummyDate = new Date(Date.UTC(2026, 0, 1));
  dummyDate.setUTCDate(Math.floor(boundedDay));
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const formattedDate = `${dummyDate.getUTCDate()} de ${monthNames[dummyDate.getUTCMonth()]}`;

  // Heliocentric 3D position of Earth (AU scale)
  const earthHelioX = distanceToSunAU * Math.cos(earthOrbitalAngleRad);
  const earthHelioZ = distanceToSunAU * Math.sin(earthOrbitalAngleRad);
  const earthHeliocentricPos = new THREE.Vector3(earthHelioX, 0, earthHelioZ);

  // Sun position in Heliocentric coordinates: Sun is at (0, 0, 0)
  const sunScenePos = new THREE.Vector3(0, 0, 0);

  // Earth position in 3D Heliocentric scene (coplanar in the ecliptic plane, 14.0 scene units from Sun)
  const earthSceneDist = EARTH_SCENE_ORBIT_RADIUS;
  const earthSceneX = alignPlanets ? earthSceneDist : Math.cos(earthOrbitalAngleRad) * earthSceneDist;
  const earthSceneY = 0;
  const earthSceneZ = alignPlanets ? 0 : Math.sin(earthOrbitalAngleRad) * earthSceneDist;
  const earthScenePos = new THREE.Vector3(earthSceneX, earthSceneY, earthSceneZ);

  // Moon Geocentric Revolution around Earth (27.32 days sidereal, 5.6 scene units non-overlapping orbit)
  const moonSiderealPeriod = 27.32166;
  const moonAngle = alignPlanets ? 0 : ((totalDays % moonSiderealPeriod) / moonSiderealPeriod) * 2 * Math.PI;
  const moonRelX = Math.cos(moonAngle) * MOON_SCENE_ORBIT_RADIUS;
  const moonRelY = alignPlanets ? 0 : Math.sin(moonAngle) * Math.sin(MOON_ORBIT_INCLINATION_RAD) * MOON_SCENE_ORBIT_RADIUS;
  const moonRelZ = alignPlanets ? 0 : Math.sin(moonAngle) * Math.cos(MOON_ORBIT_INCLINATION_RAD) * MOON_SCENE_ORBIT_RADIUS;
  const moonScenePos = earthScenePos.clone().add(new THREE.Vector3(moonRelX, moonRelY, moonRelZ));

  // Synodic Moon Phase (29.53 days)
  const synodicPeriod = 29.53059;
  const moonPhaseAge = (totalDays % synodicPeriod);
  let moonPhaseName = 'Lua Nova';
  if (moonPhaseAge < 1.5 || moonPhaseAge >= 28.0) moonPhaseName = 'Lua Nova';
  else if (moonPhaseAge < 6.5) moonPhaseName = 'Crescente';
  else if (moonPhaseAge < 8.5) moonPhaseName = 'Quarto Crescente';
  else if (moonPhaseAge < 13.5) moonPhaseName = 'Gibosa Crescente';
  else if (moonPhaseAge < 16.5) moonPhaseName = 'Lua Cheia';
  else if (moonPhaseAge < 21.5) moonPhaseName = 'Gibosa Minguante';
  else if (moonPhaseAge < 23.5) moonPhaseName = 'Quarto Minguante';
  else moonPhaseName = 'Minguante';

  const planets = SOLAR_SYSTEM_PLANETS.filter(p => p.id !== 'terra').map(p => {
    const planetAngle = alignPlanets ? 0 : ((totalDays % p.periodDays) / p.periodDays) * 2 * Math.PI;
    const pDistAU = p.semiMajorAxisAU;

    const dAU = Math.sqrt(
      distanceToSunAU * distanceToSunAU +
      pDistAU * pDistAU -
      2 * distanceToSunAU * pDistAU * Math.cos(planetAngle - earthOrbitalAngleRad)
    );

    const sceneDist = p.sceneDist || 10;
    const pX = Math.cos(planetAngle) * sceneDist;
    const pY = 0;
    const pZ = alignPlanets ? 0 : Math.sin(planetAngle) * sceneDist;

    return {
      id: p.id,
      name: p.name,
      symbol: p.symbol,
      position: new THREE.Vector3(pX, pY, pZ),
      distanceToEarthKm: Math.round(dAU * AU_KM),
      distanceToEarthAU: +dAU.toFixed(3),
      orbitalProgressPct: +(((totalDays % p.periodDays) / p.periodDays) * 100).toFixed(1),
      orbitalSpeedKmS: p.meanOrbitalSpeedKmS,
    };
  });

  return {
    dayOfYear: +boundedDay.toFixed(1),
    formattedDate,
    seasonBrazil,
    seasonIcon,
    distanceToSunKm,
    distanceToSunAU: +distanceToSunAU.toFixed(4),
    orbitalSpeedKmS,
    orbitalProgressPct: +((boundedDay / EARTH_ORBITAL_PERIOD_DAYS) * 100).toFixed(1),
    solarDeclinationDeg,
    axialTiltDeg: EARTH_AXIAL_TILT_DEG,
    earthHeliocentricAngleRad: earthOrbitalAngleRad,
    earthHeliocentricPos,
    earthScenePos,
    sunScenePos,
    moonScenePos,
    moonPhaseName,
    moonPhaseAgeDays: +moonPhaseAge.toFixed(1),
    planets,
  };
}
