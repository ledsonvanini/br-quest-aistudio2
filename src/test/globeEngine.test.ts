/**
 * Unit Tests for 3D Globe Astronomical and Geodesic Engine
 */
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  latLonToSphereVector3,
  sphereVector3ToLatLon,
  calculateHaversineDistanceKm,
  estimateFlightHours,
  generateGreatCircleArc,
  calculateSolarCoordinates,
  calculateLunarCoordinates,
  calculateStateAstrometry,
  getVisiblePlanetsInfo,
  SEASONS_CATALOG,
  EARTH_RADIUS_KM,
  SPEED_OF_LIGHT_KM_S,
} from '../lib/globeEngine';

describe('Spherical and Geodesic Mathematics', () => {
  it('converts Lat/Lon to Sphere Vector3 and back accurately', () => {
    // Brasília coordinates (-15.7939, -47.8828)
    const lat = -15.7939;
    const lon = -47.8828;
    const v = latLonToSphereVector3(lat, lon, 2.0);

    expect(v.length()).toBeCloseTo(2.0, 3);

    const back = sphereVector3ToLatLon(v);
    expect(back.lat).toBeCloseTo(lat, 2);
    expect(back.lon).toBeCloseTo(lon, 2);
  });

  it('calculates Haversine distance between SP and RJ correctly (~360 km)', () => {
    // São Paulo: -23.5505, -46.6333
    // Rio de Janeiro: -22.9068, -43.1729
    const dist = calculateHaversineDistanceKm(-23.5505, -46.6333, -22.9068, -43.1729);
    expect(dist).toBeGreaterThan(340);
    expect(dist).toBeLessThan(380);

    const flightTime = estimateFlightHours(dist);
    expect(flightTime).toBeGreaterThan(0.7);
    expect(flightTime).toBeLessThan(1.2);
  });

  it('generates Great-Circle Arc with correct endpoints and elevation', () => {
    const v1 = latLonToSphereVector3(-23.55, -46.63, 2.0);
    const v2 = latLonToSphereVector3(-3.11, -60.02, 2.0); // Manaus (~2700 km)
    const distKm = calculateHaversineDistanceKm(-23.55, -46.63, -3.11, -60.02);

    const arc = generateGreatCircleArc(v1, v2, distKm, 32, 2.0);
    expect(arc.length).toBe(33);

    // Midpoint altitude must be higher than start and end (sinusoidal arch)
    const startLen = arc[0].length();
    const midLen = arc[16].length();
    const endLen = arc[32].length();

    expect(midLen).toBeGreaterThan(startLen);
    expect(midLen).toBeGreaterThan(endLen);
  });
});

describe('Analytical Astronomical and Celestial Mathematics', () => {
  it('calculates realistic Earth-Sun distance (~1 AU) and subsolar point', () => {
    const solar = calculateSolarCoordinates(new Date());
    expect(solar.distanceKm).toBeGreaterThan(146e6);
    expect(solar.distanceKm).toBeLessThan(153e6);
    expect(solar.subSolarLat).toBeGreaterThanOrEqual(-24);
    expect(solar.subSolarLat).toBeLessThanOrEqual(24);
    expect(solar.sunDirection.length()).toBeCloseTo(1.0, 4);
  });

  it('calculates Moon distance (~384,400 km) and valid phase parameters', () => {
    const lunar = calculateLunarCoordinates(new Date());
    expect(lunar.distanceKm).toBeGreaterThan(350000);
    expect(lunar.distanceKm).toBeLessThan(410000);
    expect(lunar.phase.illuminationFraction).toBeGreaterThanOrEqual(0.0);
    expect(lunar.phase.illuminationFraction).toBeLessThanOrEqual(1.0);
    expect(lunar.phase.phaseName).toBeTruthy();
    expect(lunar.phase.phaseIcon).toBeTruthy();
  });

  it('calculates topocentric astrometric telemetry for a Brazilian state', () => {
    // Brasília DF
    const telemetry = calculateStateAstrometry(
      'DF',
      'Distrito Federal',
      'Brasília',
      -15.7939,
      -47.8828,
      new Date(),
      'realtime'
    );

    expect(telemetry.stateId).toBe('DF');
    // Distance to moon ~384,000 km
    expect(telemetry.distanceToMoonKm).toBeGreaterThan(350000);
    expect(telemetry.distanceToMoonKm).toBeLessThan(410000);

    // Light-time to moon ~1.2 to 1.35 seconds
    expect(telemetry.lightTimeToMoonSec).toBeGreaterThan(1.1);
    expect(telemetry.lightTimeToMoonSec).toBeLessThan(1.4);

    // Light-time to sun ~8.1 to 8.5 minutes
    expect(telemetry.lightTimeToSunMin).toBeGreaterThan(8.0);
    expect(telemetry.lightTimeToSunMin).toBeLessThan(8.6);

    // Insolation factor
    expect(telemetry.insolationPercent).toBeGreaterThanOrEqual(0);
    expect(telemetry.insolationPercent).toBeLessThanOrEqual(100);
  });

  it('provides physical info for visible planets in the Solar System', () => {
    const sunDir = new THREE.Vector3(1, 0, 0);
    const planets = getVisiblePlanetsInfo(new Date(), sunDir);

    expect(planets.length).toBe(5);
    const names = planets.map((p) => p.name);
    expect(names).toContain('Mercúrio');
    expect(names).toContain('Vênus');
    expect(names).toContain('Marte');
    expect(names).toContain('Júpiter');
    expect(names).toContain('Saturno');
  });

  it('contains complete descriptions for all 4 astronomical solstices and equinoxes', () => {
    expect(SEASONS_CATALOG.realtime).toBeDefined();
    expect(SEASONS_CATALOG.summer_solstice).toBeDefined();
    expect(SEASONS_CATALOG.autumn_equinox).toBeDefined();
    expect(SEASONS_CATALOG.winter_solstice).toBeDefined();
    expect(SEASONS_CATALOG.spring_equinox).toBeDefined();

    expect(SEASONS_CATALOG.summer_solstice.subSolarLat).toBeCloseTo(-23.44, 1);
    expect(SEASONS_CATALOG.winter_solstice.subSolarLat).toBeCloseTo(23.44, 1);
  });
});
