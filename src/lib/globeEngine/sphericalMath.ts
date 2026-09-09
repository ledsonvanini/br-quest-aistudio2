/**
 * Spherical and Geodesic Mathematics for the 3D Globe Engine
 */
import * as THREE from 'three';

export const EARTH_RADIUS_KM = 6371.0;
export const SPEED_OF_LIGHT_KM_S = 299792.458;
export const SCENE_GLOBE_RADIUS = 2.0;

/**
 * Converts Geographic Latitude and Longitude to Cartesian 3D Vector on sphere
 * @param lat Latitude in degrees (-90 to +90)
 * @param lon Longitude in degrees (-180 to +180)
 * @param radius Sphere radius (default SCENE_GLOBE_RADIUS)
 */
export function latLonToSphereVector3(lat: number, lon: number, radius = SCENE_GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Converts Cartesian 3D Vector on sphere back to Lat/Lon
 */
export function sphereVector3ToLatLon(v: THREE.Vector3): { lat: number; lon: number } {
  const norm = v.clone().normalize();
  const phi = Math.acos(Math.max(-1, Math.min(1, norm.y))); // 0 at north, pi at south
  const lat = 90 - phi * (180 / Math.PI);

  // x = -sin(phi)*cos(theta), z = sin(phi)*sin(theta)
  const theta = Math.atan2(norm.z, -norm.x); // theta in [-pi, pi]
  let lon = theta * (180 / Math.PI) - 180;
  while (lon < -180) lon += 360;
  while (lon > 180) lon -= 360;

  return { lat, lon };
}

/**
 * Calculates Haversine distance in kilometers between two geographic coordinates
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Estimates flight time for commercial jet (~820 km/h + 30 min takeoff/landing)
 */
export function estimateFlightHours(distanceKm: number): number {
  const cruisingSpeedKmH = 820;
  const taxiTakeoffLandingHours = 0.5;
  return Number((distanceKm / cruisingSpeedKmH + taxiTakeoffLandingHours).toFixed(1));
}

/**
 * Computes Great-Circle Arc (Orthodrome) 3D points between two coordinates
 * with an elevated curvature arch that scales with distance.
 *
 * @param v1 Starting 3D vector on sphere
 * @param v2 Ending 3D vector on sphere
 * @param distanceKm Real distance in km
 * @param numSegments Number of subdivision points along the arc (default 64)
 * @param baseRadius Radius of the globe surface
 */
export function generateGreatCircleArc(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  distanceKm: number,
  numSegments = 64,
  baseRadius = SCENE_GLOBE_RADIUS * 1.006
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const start = v1.clone().normalize();
  const end = v2.clone().normalize();

  // Angular distance between vectors in radians
  const angle = start.angleTo(end);
  if (angle < 0.0001) {
    return [v1.clone(), v2.clone()];
  }

  // Maximum elevation above surface scales smoothly with geographic distance:
  // Short hops (e.g. SP-RJ ~360km) have low subtle arch (~0.04r)
  // Continental hops (e.g. RS-RR ~3700km) have high majestic mesosphere arch (~0.28r)
  const normalizedDistance = Math.min(distanceKm / 4500.0, 1.0);
  const maxAltitude = 0.04 + 0.26 * Math.pow(normalizedDistance, 0.85);

  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments;
    // Slerp (Spherical Linear Interpolation) on unit sphere
    const sinAngle = Math.sin(angle);
    const w1 = Math.sin((1 - t) * angle) / sinAngle;
    const w2 = Math.sin(t * angle) / sinAngle;

    const interpolated = new THREE.Vector3()
      .addScaledVector(start, w1)
      .addScaledVector(end, w2)
      .normalize();

    // Sinusoidal elevation arch: h(t) = baseRadius + maxAltitude * sin(pi * t)
    const altitude = baseRadius + maxAltitude * Math.sin(Math.PI * t);
    interpolated.multiplyScalar(altitude);
    points.push(interpolated);
  }

  return points;
}
