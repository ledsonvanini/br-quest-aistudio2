/**
 * Geodesic Routes Engine for Brazil's 27 States
 * Generates Great-Circle Arcs with altitude curvature, animated energy pulses,
 * and flight time/distance estimations between state capitals.
 */
import * as THREE from 'three';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import {
  latLonToSphereVector3,
  calculateHaversineDistanceKm,
  estimateFlightHours,
  generateGreatCircleArc,
  SCENE_GLOBE_RADIUS,
} from './sphericalMath';
import { GeodesicRoute } from './types';
import { createGeodesicPulseMaterial } from './shaders/geodesicPulseShader';

export class GeodesicRoutesEngine {
  public group: THREE.Group;
  private routeMeshes: Map<string, THREE.Line> = new Map();
  private pulseMaterials: THREE.ShaderMaterial[] = [];
  private activeRoutes: GeodesicRoute[] = [];
  private allDefaultRoutes: GeodesicRoute[] = [];
  private adaptedMeshes: THREE.Object3D[] = [];
  private cityBeaconsGroup: THREE.Group;
  private beaconPulsers: { mesh: THREE.Mesh; baseScale: number; speed: number }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'geodesic-routes-layer';
    this.cityBeaconsGroup = new THREE.Group();
    this.cityBeaconsGroup.name = 'city-route-beacons';
    this.group.add(this.cityBeaconsGroup);
  }

  private clearAdaptedMeshes(): void {
    this.adaptedMeshes.forEach((mesh) => {
      this.group.remove(mesh);
      if ((mesh as THREE.Mesh).geometry) {
        (mesh as THREE.Mesh).geometry.dispose();
      }
    });
    this.adaptedMeshes = [];
    this.clearCityBeacons();
  }

  private buildThickRouteArc(
    arcPoints: THREE.Vector3[],
    primaryColor: string,
    pulseColor: string,
    secondaryColor: string,
    renderOrderBase = 25
  ): void {
    if (arcPoints.length < 2) return;

    // 1. Core 3D Volumetric Laser Tube (refined aerospace precision: radius 0.0075)
    const curve = new THREE.CatmullRomCurve3(arcPoints);
    const tubeGeo = new THREE.TubeGeometry(curve, Math.min(120, arcPoints.length * 2), 0.0075, 8, false);
    const tubeUvs = tubeGeo.attributes.uv.array;
    const tubeProgress = new Float32Array(tubeGeo.attributes.position.count);
    for (let i = 0; i < tubeGeo.attributes.position.count; i++) {
      tubeProgress[i] = tubeUvs[i * 2];
    }
    tubeGeo.setAttribute('a_progress', new THREE.BufferAttribute(tubeProgress, 1));

    const tubeMat = createGeodesicPulseMaterial(primaryColor, pulseColor);
    tubeMat.depthTest = false;
    this.pulseMaterials.push(tubeMat);
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.renderOrder = renderOrderBase + 1;
    this.group.add(tubeMesh);
    this.adaptedMeshes.push(tubeMesh);

    // 2. Outer Halo Glow Tube (Luminous aura: radius 0.014)
    const haloGeo = new THREE.TubeGeometry(curve, Math.min(120, arcPoints.length * 2), 0.014, 8, false);
    const haloUvs = haloGeo.attributes.uv.array;
    const haloProgress = new Float32Array(haloGeo.attributes.position.count);
    for (let i = 0; i < haloGeo.attributes.position.count; i++) {
      haloProgress[i] = haloUvs[i * 2];
    }
    haloGeo.setAttribute('a_progress', new THREE.BufferAttribute(haloProgress, 1));

    const haloMat = createGeodesicPulseMaterial(secondaryColor, primaryColor);
    haloMat.depthTest = false;
    this.pulseMaterials.push(haloMat);
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.renderOrder = renderOrderBase + 2;
    this.group.add(haloMesh);
    this.adaptedMeshes.push(haloMesh);

    // 3. Central razor-sharp guide line
    const positions: number[] = [];
    const progressVals: number[] = [];
    arcPoints.forEach((pt, index) => {
      positions.push(pt.x, pt.y, pt.z);
      progressVals.push(index / (arcPoints.length - 1));
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    lineGeo.setAttribute('a_progress', new THREE.Float32BufferAttribute(progressVals, 1));
    const lineMat = createGeodesicPulseMaterial('#ffffff', primaryColor);
    lineMat.depthTest = false;
    this.pulseMaterials.push(lineMat);
    const lineMesh = new THREE.Line(lineGeo, lineMat);
    lineMesh.renderOrder = renderOrderBase + 3;
    this.group.add(lineMesh);
    this.adaptedMeshes.push(lineMesh);
  }

  /**
   * Builds or updates the default active route network connecting the origin capital to all other capitals
   * @param focusStateId Optional state ID to connect outwards from (defaults to DF)
   */
  public updateRoutes(focusStateId?: string | null): GeodesicRoute[] {
    this.clear();

    const originStateId = focusStateId || 'DF';
    const originGeo = BRAZIL_STATES_GEO[originStateId];
    if (!originGeo) return [];

    const originVec = latLonToSphereVector3(originGeo.lat, originGeo.lon, SCENE_GLOBE_RADIUS * 1.006);
    const routes: GeodesicRoute[] = [];

    // Connect to all other 26 state capitals across Brazil by default
    const targetStateIds = Object.keys(BRAZIL_STATES_GEO).filter((id) => id !== originStateId);

    targetStateIds.forEach((targetId) => {
      const targetGeo = BRAZIL_STATES_GEO[targetId];
      if (!targetGeo) return;

      const targetVec = latLonToSphereVector3(targetGeo.lat, targetGeo.lon, SCENE_GLOBE_RADIUS * 1.006);
      const distanceKm = calculateHaversineDistanceKm(
        originGeo.lat,
        originGeo.lon,
        targetGeo.lat,
        targetGeo.lon
      );
      const flightHours = estimateFlightHours(distanceKm);

      // 48 segment arc with parabolic elevation
      const arcPoints = generateGreatCircleArc(originVec, targetVec, distanceKm, 48);

      const routeId = `${originStateId}-${targetId}`;
      const route: GeodesicRoute = {
        id: routeId,
        fromStateId: originStateId,
        toStateId: targetId,
        fromName: originGeo.name,
        toName: targetGeo.name,
        distanceKm: Math.round(distanceKm),
        estimatedFlightHours: flightHours,
        points: arcPoints,
        color: '#38bdf8',
        active: true,
      };
      routes.push(route);

      // Create Three.js Line with progress attribute for pulse animation
      const positions: number[] = [];
      const progressVals: number[] = [];

      arcPoints.forEach((pt, index) => {
        positions.push(pt.x, pt.y, pt.z);
        progressVals.push(index / (arcPoints.length - 1));
      });

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      lineGeo.setAttribute('a_progress', new THREE.Float32BufferAttribute(progressVals, 1));

      const mat = createGeodesicPulseMaterial('#38bdf8', '#fbbf24');
      this.pulseMaterials.push(mat);

      const line = new THREE.Line(lineGeo, mat);
      this.group.add(line);
      this.routeMeshes.set(routeId, line);
    });

    this.allDefaultRoutes = routes;
    this.activeRoutes = routes;
    return routes;
  }

  /**
   * Adapts the 3D route display when calculating between two specific state capitals.
   * Highlights the specific arc with vibrant gold/cyan pulse and isolates it for clarity.
   */
  public setAdaptedCapitalsRoute(
    originStateId: string,
    destStateId: string,
    isolateOtherRoutes = true
  ): GeodesicRoute | null {
    const originGeo = BRAZIL_STATES_GEO[originStateId];
    const destGeo = BRAZIL_STATES_GEO[destStateId];
    if (!originGeo || !destGeo) return null;

    // Clean up previous adapted mesh if present
    this.clearAdaptedMeshes();

    // Hide or dim background default capital routes
    if (isolateOtherRoutes) {
      this.routeMeshes.forEach((mesh) => {
        mesh.visible = false;
      });
    }

    const originVec = latLonToSphereVector3(originGeo.lat, originGeo.lon, SCENE_GLOBE_RADIUS * 1.025);
    const destVec = latLonToSphereVector3(destGeo.lat, destGeo.lon, SCENE_GLOBE_RADIUS * 1.025);
    const distanceKm = calculateHaversineDistanceKm(originGeo.lat, originGeo.lon, destGeo.lat, destGeo.lon);
    const flightHours = estimateFlightHours(distanceKm);

    const arcPoints = generateGreatCircleArc(originVec, destVec, distanceKm, 64);
    const routeId = `adapted-capital-${originStateId}-${destStateId}`;

    const route: GeodesicRoute = {
      id: routeId,
      fromStateId: originStateId,
      toStateId: destStateId,
      fromName: `${originGeo.capital} (${originStateId})`,
      toName: `${destGeo.capital} (${destStateId})`,
      distanceKm: Math.round(distanceKm),
      estimatedFlightHours: flightHours,
      points: arcPoints,
      color: '#f59e0b',
      active: true,
    };

    // Build prominent thick 3D volumetric laser tube and glowing halo
    this.buildThickRouteArc(arcPoints, '#f59e0b', '#38bdf8', '#fbbf24', 25);
    this.createCityBeacon(originVec, 0xf59e0b, originGeo.capital);
    this.createCityBeacon(destVec, 0x38bdf8, destGeo.capital);

    this.activeRoutes = [route];
    return route;
  }

  /**
   * Adapts the 3D route display when calculating between two specific cities.
   * Renders the Great-Circle arc elevated above the globe with altitude curvature.
   */
  public setCustomCityRoute(
    origin: { name: string; uf: string; lat: number; lng: number },
    destination: { name: string; uf: string; lat: number; lng: number },
    isolateOtherRoutes = true
  ): GeodesicRoute {
    this.clearAdaptedMeshes();

    if (isolateOtherRoutes) {
      this.routeMeshes.forEach((mesh) => {
        mesh.visible = false;
      });
    }

    const originVec = latLonToSphereVector3(origin.lat, origin.lng, SCENE_GLOBE_RADIUS * 1.025);
    const targetVec = latLonToSphereVector3(destination.lat, destination.lng, SCENE_GLOBE_RADIUS * 1.025);
    const distanceKm = calculateHaversineDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);
    const flightHours = estimateFlightHours(distanceKm);

    const arcPoints = generateGreatCircleArc(originVec, targetVec, distanceKm, 80);
    const customRouteId = 'custom-city-route';

    const route: GeodesicRoute = {
      id: customRouteId,
      fromStateId: origin.uf,
      toStateId: destination.uf,
      fromName: `${origin.name} (${origin.uf})`,
      toName: `${destination.name} (${destination.uf})`,
      distanceKm: Math.round(distanceKm),
      estimatedFlightHours: flightHours,
      points: arcPoints,
      color: '#10b981',
      active: true,
    };

    // Build prominent thick 3D volumetric laser tube and glowing halo
    this.buildThickRouteArc(arcPoints, '#10b981', '#38bdf8', '#fbbf24', 25);

    // Create 3D Luminous Beacons at City Coordinates
    this.createCityBeacon(originVec, 0x10b981, origin.name);
    this.createCityBeacon(targetVec, 0x38bdf8, destination.name);

    this.activeRoutes = [route];
    return route;
  }

  private createCityBeacon(position: THREE.Vector3, hexColor: number, cityName: string): void {
    const beaconGroup = new THREE.Group();
    beaconGroup.position.copy(position);

    // Orient beacon to point radially outward from globe center
    const normal = position.clone().normalize();
    beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    // Glowing core sphere
    const sphereGeo = new THREE.SphereGeometry(0.024, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: hexColor,
      transparent: true,
      opacity: 0.95,
      depthTest: true,
      depthWrite: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.renderOrder = 30;
    beaconGroup.add(sphereMesh);

    // Outward radiant pulse wave ring
    const ringGeo = new THREE.RingGeometry(0.016, 0.048, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: hexColor,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.renderOrder = 29;
    beaconGroup.add(ringMesh);

    this.beaconPulsers.push({ mesh: ringMesh, baseScale: 1.0, speed: 3.5 });
    this.beaconPulsers.push({ mesh: sphereMesh, baseScale: 1.0, speed: 2.0 });

    this.cityBeaconsGroup.add(beaconGroup);
  }

  private clearCityBeacons(): void {
    while (this.cityBeaconsGroup.children.length > 0) {
      const child = this.cityBeaconsGroup.children[0] as THREE.Group;
      child.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      });
      this.cityBeaconsGroup.remove(child);
    }
    this.beaconPulsers = [];
  }

  /**
   * Restores the default view showing all 26 capital routes across Brazil
   */
  public restoreAllCapitalsRoutes(): GeodesicRoute[] {
    this.clearAdaptedMeshes();

    this.routeMeshes.forEach((mesh) => {
      mesh.visible = true;
    });
    this.activeRoutes = [...this.allDefaultRoutes];
    return this.activeRoutes;
  }

  public getAllDefaultRoutes(): GeodesicRoute[] {
    return this.allDefaultRoutes;
  }

  public tick(timeSeconds: number): void {
    this.pulseMaterials.forEach((mat) => {
      mat.uniforms.u_time.value = timeSeconds;
    });

    // Animate radiant beacon rings & core pulses
    this.beaconPulsers.forEach(({ mesh, baseScale, speed }) => {
      const scale = baseScale + Math.sin(timeSeconds * speed) * 0.35 + 0.2;
      mesh.scale.set(scale, scale, scale);
    });
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public getActiveRoutes(): GeodesicRoute[] {
    return this.activeRoutes;
  }

  public clear(): void {
    this.clearAdaptedMeshes();
    this.routeMeshes.forEach((mesh) => {
      this.group.remove(mesh);
      mesh.geometry.dispose();
    });
    this.routeMeshes.clear();
    this.pulseMaterials.forEach((m) => m.dispose());
    this.pulseMaterials = [];
    this.activeRoutes = [];
  }

  public dispose(): void {
    this.clear();
  }
}
