/**
 * Types and interfaces for the 3D Globe Engine
 */
import * as THREE from 'three';

export type GlobeTextureMode =
  | 'nasa_satellite'
  | 'nasa_full_day'
  | 'natural_earth'
  | 'night_lights'
  | 'specular_topo'
  | 'el_nino_sst'
  | 'flood_hydrology';

export type GlobeSeason = 'realtime' | 'summer_solstice' | 'autumn_equinox' | 'winter_solstice' | 'spring_equinox';

export interface CelestialBodyInfo {
  id: string;
  name: string;
  ptName: string;
  symbol: string;
  type: 'star' | 'moon' | 'planet';
  categoryLabel: string;
  position: THREE.Vector3;
  distanceKm: number;
  radiusKm: number;
  apparentSize: number; // visual scale in scene
  sceneDist?: number; // Distance in 3D scene units
  color: string;
  description: string;
  surfaceTemp: string;
  massEarthRelative: number;
  gravityMss: number;
  lightTimeSeconds: number;
  visibilityBrazil: string;
  curiosity: string;
  orbitalPeriodDays?: number;
}

export interface ProjectedCelestialPin {
  id: string;
  name: string;
  symbol: string;
  type: 'star' | 'moon' | 'planet';
  categoryLabel: string;
  color: string;
  x: number;
  y: number;
  visible: boolean;
  distanceKm: number;
  lightTimeFormatted: string;
  apparentSize: number;
  depth: number;
  data: CelestialBodyInfo;
}

export interface CosmicTrajectoryTelemetry {
  targetAstro: CelestialBodyInfo;
  originStateId: string;
  originStateName: string;
  distanceKm: number;
  distanceAu: number;
  lightTimeFormatted: string;
  radioPingLatencyFormatted: string;
  probeTravelFormatted: string;
  gravityRelativeFormatted: string;
}

export interface MoonPhaseData {
  phaseAngle: number; // 0 to 2PI
  illuminationFraction: number; // 0.0 (Nova) to 1.0 (Cheia)
  phaseName: string;
  phaseIcon: string;
  ageDays: number;
  distanceKm: number;
  subSolarLatitude: number;
  subSolarLongitude: number;
}

export interface StateAstrometryTelemetry {
  stateId: string;
  stateName: string;
  capitalName: string;
  lat: number;
  lon: number;
  distanceToMoonKm: number;
  lightTimeToMoonSec: number;
  distanceToSunKm: number;
  lightTimeToSunMin: number;
  solarZenithAngleDeg: number;
  localSolarStatus: 'dia' | 'crepusculo' | 'noite';
  insolationPercent: number;
}

export interface GeodesicRoutePoint {
  x: number;
  y: number;
  z: number;
}

export interface GeodesicRoute {
  id: string;
  fromStateId: string;
  toStateId: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  estimatedFlightHours: number;
  points: THREE.Vector3[];
  color: string;
  active: boolean;
}

export interface GlobePreloadProgress {
  loaded: number;
  total: number;
  percent: number;
  currentAsset: string;
  isReady: boolean;
  fromCache: boolean;
}

export interface EarthShaderUniforms {
  u_dayMap: { value: THREE.Texture | null };
  u_nightMap: { value: THREE.Texture | null };
  u_specularMap: { value: THREE.Texture | null };
  u_cloudsMap: { value: THREE.Texture | null };
  u_sunDirection: { value: THREE.Vector3 };
  u_cityLightIntensity: { value: number };
  u_atmosphereColor: { value: THREE.Color };
  u_cloudsOpacity: { value: number };
  u_cloudsTime: { value: number };
  u_axialTiltMatrix: { value: THREE.Matrix4 };
}
