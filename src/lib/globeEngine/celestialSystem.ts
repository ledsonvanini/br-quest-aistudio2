/**
 * Celestial System Engine for 3D Globe
 * Manages 3D Sun, 3D Moon (with real phases & orbit), visible planets of the Solar System,
 * and cosmic laser beams connecting the selected Brazilian state to the Moon and Sun.
 */
import * as THREE from 'three';
import {
  calculateSolarCoordinates,
  calculateLunarCoordinates,
  getVisiblePlanetsInfo,
} from './celestialMath';
import { calculateHeliocentricOrbitalState, HeliocentricOrbitalState } from './orbitalPhysics';
import {
  EARTH_SCENE_ORBIT_RADIUS,
  MOON_SCENE_ORBIT_RADIUS,
  MOON_ORBIT_INCLINATION_RAD,
  ASTEROID_BELT_SCENE_RADIUS,
} from './orbitalData';
import { GlobeSeason, CelestialBodyInfo, CosmicTrajectoryTelemetry } from './types';
import { SCENE_GLOBE_RADIUS } from './sphericalMath';
import {
  getProceduralSunTexture,
  getProceduralMoonTexture,
  getProceduralPlanetTexture,
  getSaturnRingTexture,
} from './celestialTextures';

/**
 * Creates a crisp 3D Billboard Sprite for celestial body labels (Sun, Moon, Planets)
 * Rendered natively in WebGL with zero flicker and 100% synchronized motion.
 */
function createAstroBillboardSprite(name: string, symbol: string, colorHex: string): THREE.Sprite {
  if (typeof document === 'undefined') return new THREE.Sprite();

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  // Background rounded pill badge
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(4, 8, 248, 48, 24);
  } else {
    ctx.rect(4, 8, 248, 48);
  }
  ctx.fill();
  ctx.stroke();

  // Symbol
  ctx.font = 'bold 22px serif';
  ctx.fillStyle = colorHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 32, 32);

  // Label text
  ctx.font = 'bold 18px "Cinzel", "Times New Roman", serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.toUpperCase(), 58, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.6, 0.4, 1);
  sprite.renderOrder = 999;
  return sprite;
}

export class CelestialSystem {
  public group: THREE.Group;
  public sunLight: THREE.DirectionalLight;
  public sunPointLight: THREE.PointLight;
  public sunMesh: THREE.Mesh;
  public sunCorona: THREE.Mesh;
  public outerCorona: THREE.Mesh;
  public moonMesh: THREE.Mesh;
  public planetsGroup: THREE.Group;
  public cosmicBeamMoon: THREE.Line;
  public cosmicBeamSun: THREE.Line;
  public cosmicTrajectoryLine: THREE.Line;
  public cosmicTargetBeacon: THREE.Mesh;
  private moonMaterial: THREE.MeshStandardMaterial;
  private trajectoryMaterial: THREE.LineDashedMaterial;
  private activeTargetAstroId: string | null = null;
  private cachedPlanetsInfo: CelestialBodyInfo[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'celestial-system';

    // 1. Sun Directional Light & Point Light
    this.sunLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    this.sunLight.castShadow = false;
    this.group.add(this.sunLight);

    this.sunPointLight = new THREE.PointLight(0xffedd5, 2.8, 60, 0.7);
    this.group.add(this.sunPointLight);

    // Sun 3D Visual Mesh with Procedural Granulation Texture
    // Scientifically scaled: Sun is the primary star of our solar system (radius 6.5)
    const sunGeo = new THREE.SphereGeometry(6.5, 48, 48);
    const sunTex = getProceduralSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTex,
      color: 0xffffff,
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.name = 'astro-sol';
    this.group.add(this.sunMesh);

    // Sun Corona Glow (Inner Core Corona) - Radiant golden aura with additive blending
    const coronaGeo = new THREE.SphereGeometry(7.6, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.sunMesh.add(this.sunCorona);

    // Sun Radiant Aura (Outer Corona)
    const outerCoronaGeo = new THREE.SphereGeometry(9.2, 32, 32);
    const outerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    this.outerCorona = new THREE.Mesh(outerCoronaGeo, outerCoronaMat);
    this.sunMesh.add(this.outerCorona);

    // 2. Moon 3D Mesh with Procedural Lunar Maria & Craters
    // Proportioned: Moon radius 0.46 (in visual balance with Earth radius 2.0)
    const moonGeo = new THREE.SphereGeometry(0.46, 32, 32);
    const moonTex = getProceduralMoonTexture();
    this.moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTex,
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.05,
    });
    this.moonMesh = new THREE.Mesh(moonGeo, this.moonMaterial);
    this.moonMesh.name = 'astro-lua';
    this.group.add(this.moonMesh);

    // 3D Billboard Sprite for Moon
    const moonLabel = createAstroBillboardSprite('Lua', '☽', '#e2e8f0');
    moonLabel.position.set(0, 0.95, 0);
    this.moonMesh.add(moonLabel);

    // 3D Billboard Sprite for Sun
    const sunLabel = createAstroBillboardSprite('Sol', '☉', '#f59e0b');
    sunLabel.position.set(0, 7.6, 0);
    this.sunMesh.add(sunLabel);

    // 3. Planets of the Solar System Group
    this.planetsGroup = new THREE.Group();
    this.group.add(this.planetsGroup);
    this.buildVisiblePlanets();

    // 4. Cosmic Laser Beams (Selected State -> Moon & Sun)
    const beamMoonGeo = new THREE.BufferGeometry();
    beamMoonGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3)
    );
    const beamMoonMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      linewidth: 2,
    });
    this.cosmicBeamMoon = new THREE.Line(beamMoonGeo, beamMoonMat);
    this.cosmicBeamMoon.visible = false;
    this.group.add(this.cosmicBeamMoon);

    const beamSunGeo = new THREE.BufferGeometry();
    beamSunGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3)
    );
    const beamSunMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      linewidth: 2,
    });
    this.cosmicBeamSun = new THREE.Line(beamSunGeo, beamSunMat);
    this.cosmicBeamSun.visible = false;
    this.group.add(this.cosmicBeamSun);

    // 5. Interactive Interplanetary Cosmic Trajectory Line (Dotted / Dashed Animated)
    const trajGeo = new THREE.BufferGeometry();
    trajGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3)
    );
    this.trajectoryMaterial = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      scale: 1,
      dashSize: 0.35,
      gapSize: 0.22,
      transparent: true,
      opacity: 0.9,
    });
    this.cosmicTrajectoryLine = new THREE.Line(trajGeo, this.trajectoryMaterial);
    this.cosmicTrajectoryLine.visible = false;
    this.group.add(this.cosmicTrajectoryLine);

    // Target Pulsing Beacon Ring around clicked Astro
    const beaconGeo = new THREE.RingGeometry(0.3, 0.45, 32);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    this.cosmicTargetBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    this.cosmicTargetBeacon.visible = false;
    this.group.add(this.cosmicTargetBeacon);
  }

  public setMoonTexture(tex: THREE.Texture): void {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    this.moonMaterial.map = tex;
    this.moonMaterial.needsUpdate = true;
  }

  private buildVisiblePlanets(): void {
    const sunDir = new THREE.Vector3(1, 0, 0);
    const planets = getVisiblePlanetsInfo(new Date(), sunDir);
    this.cachedPlanetsInfo = planets;

    planets.forEach((p) => {
      const pGeo = new THREE.SphereGeometry(p.apparentSize, 32, 32);
      const pTex = getProceduralPlanetTexture(p.id);
      const pMat = new THREE.MeshStandardMaterial({
        map: pTex,
        roughness: p.id === 'venus' ? 0.35 : 0.75,
        metalness: 0.05,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(p.position);
      pMesh.name = `planet-${p.id}`;
      pMesh.userData = { astroId: p.id, name: p.name };

      // 3D Billboard Sprite Label for planet
      const planetLabel = createAstroBillboardSprite(p.name, p.symbol, p.color);
      planetLabel.position.set(0, p.apparentSize * 1.5 + 0.32, 0);
      pMesh.add(planetLabel);

      // Add Saturn's rings if Saturn
      if (p.name === 'Saturno' || p.id === 'saturno') {
        const ringGeo = new THREE.RingGeometry(p.apparentSize * 1.35, p.apparentSize * 2.55, 64);
        const ringTex = getSaturnRingTexture();
        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.5;
        pMesh.add(ringMesh);
      }

      // Add Uranus tilted faint ring (Uranus has 98° axial tilt)
      if (p.name === 'Urano' || p.id === 'urano') {
        const ringGeo = new THREE.RingGeometry(p.apparentSize * 1.35, p.apparentSize * 1.65, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xa5f3fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.y = Math.PI / 2.1;
        pMesh.add(ringMesh);
      }

      // Add orbit trajectory circle around the Sun (coplanar concentric in the Ecliptic plane)
      const orbitRadius = p.sceneDist || Math.sqrt(p.position.x * p.position.x + p.position.z * p.position.z);
      const orbitPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        orbitPoints.push(
          new THREE.Vector3(
            orbitRadius * Math.cos(a),
            0,
            orbitRadius * Math.sin(a)
          )
        );
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.45,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.name = `orbit-line-${p.id}`;
      this.planetsGroup.add(orbitLine);

      this.planetsGroup.add(pMesh);
    });

    // Earth's Orbit line around the Sun (EARTH_SCENE_ORBIT_RADIUS in Ecliptic plane)
    const earthOrbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      earthOrbitPoints.push(
        new THREE.Vector3(
          EARTH_SCENE_ORBIT_RADIUS * Math.cos(a),
          0,
          EARTH_SCENE_ORBIT_RADIUS * Math.sin(a)
        )
      );
    }
    const earthOrbitGeo = new THREE.BufferGeometry().setFromPoints(earthOrbitPoints);
    const earthOrbitMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const earthOrbitLine = new THREE.Line(earthOrbitGeo, earthOrbitMat);
    earthOrbitLine.name = 'orbit-line-terra';
    this.planetsGroup.add(earthOrbitLine);

    // Add Asteroid Belt (Cinturão de Asteroides, ASTEROID_BELT_SCENE_RADIUS, between Mars 18.5 and Jupiter 27.5)
    const asteroidCount = 900;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    const asteroidColors = new Float32Array(asteroidCount * 3);
    const beltCenter = ASTEROID_BELT_SCENE_RADIUS;
    const beltWidth = 3.2;

    for (let i = 0; i < asteroidCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = beltCenter + (Math.random() - 0.5) * beltWidth;
      const yLoft = (Math.random() - 0.5) * 0.9;
      const x = r * Math.cos(a);
      const y = yLoft;
      const z = r * Math.sin(a);

      asteroidPositions[i * 3] = x;
      asteroidPositions[i * 3 + 1] = y;
      asteroidPositions[i * 3 + 2] = z;

      const lum = 0.65 + Math.random() * 0.35;
      asteroidColors[i * 3] = 0.72 * lum;
      asteroidColors[i * 3 + 1] = 0.68 * lum;
      asteroidColors[i * 3 + 2] = 0.64 * lum;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));

    const asteroidMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    asteroidBelt.name = 'asteroid-belt';
    this.planetsGroup.add(asteroidBelt);

    const asteroidLabel = createAstroBillboardSprite('Cinturão de Asteroides', '☄', '#94a3b8');
    asteroidLabel.position.set(beltCenter, 0.7, 0);
    this.planetsGroup.add(asteroidLabel);

    // Add Comet with glowing vapor tail (Cometa Periélico)
    const cometHeadGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const cometHeadMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const cometHead = new THREE.Mesh(cometHeadGeo, cometHeadMat);
    cometHead.position.set(22.0, 1.4, 25.0);
    cometHead.name = 'comet-head';

    const cometTailPoints = [
      new THREE.Vector3(22.0, 1.4, 25.0),
      new THREE.Vector3(24.2, 1.8, 28.5),
      new THREE.Vector3(26.8, 2.3, 32.5),
    ];
    const cometTailGeo = new THREE.BufferGeometry().setFromPoints(cometTailPoints);
    const cometTailMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });
    const cometTail = new THREE.Line(cometTailGeo, cometTailMat);
    cometTail.name = 'comet-tail';
    this.planetsGroup.add(cometHead);
    this.planetsGroup.add(cometTail);

    const cometLabel = createAstroBillboardSprite('Cometa Periélico', '☄', '#38bdf8');
    cometLabel.position.set(22.0, 2.2, 25.0);
    this.planetsGroup.add(cometLabel);

    // Add Moon's Geocentric orbit path around the Earth (MOON_SCENE_ORBIT_RADIUS scene units, inclined 5.145°)
    const moonOrbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      moonOrbitPoints.push(
        new THREE.Vector3(
          MOON_SCENE_ORBIT_RADIUS * Math.cos(a),
          MOON_SCENE_ORBIT_RADIUS * Math.sin(a) * Math.sin(MOON_ORBIT_INCLINATION_RAD),
          MOON_SCENE_ORBIT_RADIUS * Math.sin(a) * Math.cos(MOON_ORBIT_INCLINATION_RAD)
        )
      );
    }
    const moonOrbitGeo = new THREE.BufferGeometry().setFromPoints(moonOrbitPoints);
    const moonOrbitMat = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.25,
    });
    const moonOrbitLine = new THREE.Line(moonOrbitGeo, moonOrbitMat);
    moonOrbitLine.name = 'orbit-line-lua';
    this.group.add(moonOrbitLine);
  }

  /**
   * Updates Sun, Moon, and Planets positions for current time, season, or orbital day of the year
   */
  public updatePositions(
    date: Date = new Date(),
    seasonOverride?: GlobeSeason,
    selectedStatePos?: THREE.Vector3 | null,
    showCosmicBeams = false,
    orbitalDayOfYear?: number | null,
    alignPlanets: boolean = false
  ): {
    sunDirection: THREE.Vector3;
    moonDirection: THREE.Vector3;
    sunPos: THREE.Vector3;
    earthPos: THREE.Vector3;
    moonPos: THREE.Vector3;
    orbitalState?: HeliocentricOrbitalState;
  } {
    // Determine effective orbital day of year
    let effectiveDay = orbitalDayOfYear;
    if (effectiveDay === null || effectiveDay === undefined) {
      const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      effectiveDay = (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1;
    }

    // Real Keplerian physical translation & heliocentric calculation
    const orbitalState = calculateHeliocentricOrbitalState(
      effectiveDay,
      date.getUTCHours() + date.getUTCMinutes() / 60,
      alignPlanets
    );

    const sunPos = orbitalState.sunScenePos; // Fixed at (0, 0, 0)
    const earthPos = orbitalState.earthScenePos;
    const moonPos = orbitalState.moonScenePos;

    // Direction vector from Earth pointing directly towards Sun (for surface shaders & lighting)
    const sunDirection = sunPos.clone().sub(earthPos).normalize();
    // Direction vector from Earth pointing towards Moon
    const moonDirection = moonPos.clone().sub(earthPos).normalize();

    // Update planets according to heliocentric physics
    orbitalState.planets.forEach((p) => {
      const pMesh = this.planetsGroup.getObjectByName(`planet-${p.id}`);
      if (pMesh) {
        pMesh.position.copy(p.position);
      }
    });

    this.sunLight.position.copy(sunPos);
    this.sunLight.target.position.copy(earthPos);
    this.sunLight.target.updateMatrixWorld();

    this.sunPointLight.position.copy(sunPos);
    this.sunMesh.position.copy(sunPos);
    this.planetsGroup.position.copy(sunPos);

    this.moonMesh.position.copy(moonPos);
    this.moonMesh.lookAt(sunPos);

    const moonOrbit = this.group.getObjectByName('orbit-line-lua');
    if (moonOrbit) {
      moonOrbit.position.copy(earthPos);
    }

    // Update Cosmic Laser Beams if requested and a state is selected
    if (showCosmicBeams && selectedStatePos) {
      const stateWorldPos = selectedStatePos.clone().add(earthPos);
      this.cosmicBeamMoon.visible = true;
      const moonPositions = new Float32Array([
        stateWorldPos.x,
        stateWorldPos.y,
        stateWorldPos.z,
        moonPos.x,
        moonPos.y,
        moonPos.z,
      ]);
      this.cosmicBeamMoon.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(moonPositions, 3)
      );
      this.cosmicBeamMoon.geometry.attributes.position.needsUpdate = true;

      this.cosmicBeamSun.visible = true;
      const sunPositions = new Float32Array([
        stateWorldPos.x,
        stateWorldPos.y,
        stateWorldPos.z,
        sunPos.x,
        sunPos.y,
        sunPos.z,
      ]);
      this.cosmicBeamSun.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(sunPositions, 3)
      );
      this.cosmicBeamSun.geometry.attributes.position.needsUpdate = true;
    } else {
      this.cosmicBeamMoon.visible = false;
      this.cosmicBeamSun.visible = false;
    }

    // Update target beacon if following an active astro
    if (this.activeTargetAstroId && this.cosmicTargetBeacon.visible) {
      let targetMesh: THREE.Object3D | null = null;
      if (this.activeTargetAstroId === 'sol') targetMesh = this.sunMesh;
      else if (this.activeTargetAstroId === 'lua') targetMesh = this.moonMesh;
      else targetMesh = this.planetsGroup.getObjectByName(`planet-${this.activeTargetAstroId}`) || null;
      if (targetMesh) {
        const endPos = new THREE.Vector3();
        targetMesh.getWorldPosition(endPos);
        this.cosmicTargetBeacon.position.copy(endPos);
      }
    }

    return {
      sunDirection,
      moonDirection,
      sunPos,
      earthPos,
      moonPos,
      orbitalState,
    };
  }

  public setVisiblePlanets(visible: boolean): void {
    this.planetsGroup.visible = visible;
  }

  /**
   * Returns complete astronomy telemetry for all interactive celestial bodies
   */
  public getAllCelestialBodies(date: Date = new Date(), seasonOverride?: GlobeSeason): CelestialBodyInfo[] {
    const solar = calculateSolarCoordinates(date, seasonOverride);
    const lunar = calculateLunarCoordinates(date);
    const sunSceneDist = EARTH_SCENE_ORBIT_RADIUS;
    const moonSceneDist = MOON_SCENE_ORBIT_RADIUS;

    const sunInfo: CelestialBodyInfo = {
      id: 'sol',
      name: 'Sol',
      ptName: 'Sol',
      symbol: '☉',
      type: 'star',
      categoryLabel: 'Estrela Central (Classe G2V)',
      position: solar.sunDirection.clone().multiplyScalar(sunSceneDist),
      distanceKm: 149597870,
      radiusKm: 696340,
      apparentSize: 1.6,
      color: '#f59e0b',
      description: 'Coração termonuclear do Sistema Solar, fonte da vida e dos climas brasileiros.',
      surfaceTemp: '5.778 K (5.505 °C)',
      massEarthRelative: 333000,
      gravityMss: 274,
      lightTimeSeconds: 499,
      visibilityBrazil: 'Rege as estações, chuvas zenitais e a fotossíntese nos biomas brasileiros.',
      curiosity: 'A energia gerada no núcleo levou mais de 100.000 anos para emergir na fotosfera.',
    };

    const moonInfo: CelestialBodyInfo = {
      id: 'lua',
      name: 'Lua',
      ptName: 'Lua',
      symbol: '☽',
      type: 'moon',
      categoryLabel: 'Satélite Natural da Terra',
      position: lunar.moonDirection.clone().multiplyScalar(moonSceneDist),
      distanceKm: 384400,
      radiusKm: 1737.4,
      apparentSize: 0.48,
      color: '#e2e8f0',
      description: 'Companheira cósmica que rege as marés da extensa costa marítima brasileira.',
      surfaceTemp: '-130 °C a +120 °C',
      massEarthRelative: 0.0123,
      gravityMss: 1.62,
      lightTimeSeconds: 1.28,
      visibilityBrazil: 'Ilumina o céu noturno do Oiapoque ao Chuí em suas 4 fases sagradas.',
      curiosity: 'A gravidade lunar desacelera gradualmente a rotação da Terra ao longo dos éons.',
    };

    const planets = getVisiblePlanetsInfo(date, solar.sunDirection);
    this.cachedPlanetsInfo = planets;

    return [sunInfo, moonInfo, ...planets];
  }

  /**
   * Sets or clears an active 3D dashed trajectory from Brazil to the target celestial body
   * and returns computed astrometric telemetry for the mission HUD
   */
  public setCosmicTrajectory(
    targetAstroId: string | null,
    startPos: THREE.Vector3 | null,
    originStateId = 'DF',
    originStateName = 'Distrito Federal'
  ): CosmicTrajectoryTelemetry | null {
    this.activeTargetAstroId = targetAstroId;

    if (!targetAstroId || !startPos) {
      this.cosmicTrajectoryLine.visible = false;
      this.cosmicTargetBeacon.visible = false;
      return null;
    }

    let targetMesh: THREE.Object3D | null = null;
    if (targetAstroId === 'sol') {
      targetMesh = this.sunMesh;
    } else if (targetAstroId === 'lua') {
      targetMesh = this.moonMesh;
    } else {
      const normalizedId = targetAstroId.toLowerCase();
      targetMesh =
        this.planetsGroup.getObjectByName(`planet-${normalizedId}`) ||
        this.planetsGroup.getObjectByName(`planet-${targetAstroId}`) ||
        this.planetsGroup.children.find((c) => (c as any).userData?.astroId === normalizedId) ||
        null;
      if (!targetMesh) {
        const capitalized = targetAstroId.charAt(0).toUpperCase() + targetAstroId.slice(1);
        targetMesh = this.planetsGroup.getObjectByName(`planet-${capitalized}`) || null;
      }
    }

    if (!targetMesh) {
      this.cosmicTrajectoryLine.visible = false;
      this.cosmicTargetBeacon.visible = false;
      return null;
    }

    const endPos = new THREE.Vector3();
    targetMesh.getWorldPosition(endPos);

    // Build curved arc with multiple sample points
    const pointsCount = 36;
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const pt = new THREE.Vector3().lerpVectors(startPos, endPos, t);
      // Subtle parabolic arc loft
      const arcLoft = Math.sin(t * Math.PI) * Math.min(1.5, endPos.length() * 0.1);
      pt.y += arcLoft;
      curvePoints.push(pt);
    }

    const trajGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    this.cosmicTrajectoryLine.geometry.dispose();
    this.cosmicTrajectoryLine.geometry = trajGeo;
    this.cosmicTrajectoryLine.computeLineDistances();
    this.cosmicTrajectoryLine.visible = true;

    // Beacon ring around destination astro
    this.cosmicTargetBeacon.position.copy(endPos);
    this.cosmicTargetBeacon.lookAt(startPos);
    this.cosmicTargetBeacon.visible = true;

    // Find celestial body info and generate rich mission telemetry
    const bodies = this.getAllCelestialBodies(new Date(), 'realtime');
    const targetAstro =
      bodies.find((b) => b.id.toLowerCase() === targetAstroId.toLowerCase()) || bodies[0];

    const distanceKm = targetAstro.distanceKm || 384400;
    const distanceAu = distanceKm / 149597870.7;
    const lightSeconds = distanceKm / 299792.458;
    const lightTimeFormatted =
      lightSeconds < 60
        ? `${lightSeconds.toFixed(2)} seg`
        : lightSeconds < 3600
        ? `${(lightSeconds / 60).toFixed(1)} min`
        : `${(lightSeconds / 3600).toFixed(2)} horas`;
    const radioPingLatencyFormatted =
      lightSeconds * 2 < 60
        ? `${(lightSeconds * 2).toFixed(2)} seg`
        : lightSeconds * 2 < 3600
        ? `${((lightSeconds * 2) / 60).toFixed(1)} min`
        : `${((lightSeconds * 2) / 3600).toFixed(2)} horas`;

    // Speed of scientific probe ~15 km/s (54,000 km/h)
    const probeHours = distanceKm / (15 * 3600);
    const probeTravelFormatted =
      probeHours < 48
        ? `${probeHours.toFixed(0)} horas`
        : probeHours < 24 * 60
        ? `${(probeHours / 24).toFixed(1)} dias`
        : `${(probeHours / (24 * 30)).toFixed(1)} meses`;

    const gravityRelativeFormatted = `${(targetAstro.gravityMss / 9.807).toFixed(2)}g (${targetAstro.gravityMss.toFixed(2)} m/s²)`;

    return {
      targetAstro,
      originStateId,
      originStateName,
      distanceKm,
      distanceAu,
      lightTimeFormatted,
      radioPingLatencyFormatted,
      probeTravelFormatted,
      gravityRelativeFormatted,
    };
  }

  /**
   * Clears cosmic trajectory line and beacon
   */
  public clearCosmicTrajectory(): void {
    this.activeTargetAstroId = null;
    this.cosmicTrajectoryLine.visible = false;
    this.cosmicTargetBeacon.visible = false;
  }

  /**
   * Ticks trajectory visual animation and solar/planetary rotation
   */
  public tickTrajectory(elapsed: number): void {
    if (this.sunMesh) {
      this.sunMesh.rotation.y += 0.0015;
      this.sunCorona.rotation.z -= 0.001;
      if (this.outerCorona) {
        this.outerCorona.rotation.z += 0.0008;
      }
    }
    if (this.moonMesh) {
      this.moonMesh.rotation.y += 0.0008;
    }
    if (this.planetsGroup) {
      this.planetsGroup.children.forEach((c) => {
        if (c instanceof THREE.Mesh && c.name.startsWith('planet-')) {
          c.rotation.y += 0.003;
        } else if (c.name === 'asteroid-belt') {
          c.rotation.y += 0.0004;
        }
      });
    }

    if (this.cosmicTrajectoryLine.visible && this.trajectoryMaterial) {
      (this.trajectoryMaterial as any).dashOffset = -elapsed * 1.5;
    }
    if (this.cosmicTargetBeacon.visible) {
      this.cosmicTargetBeacon.rotation.z += 0.04;
      const scale = 1.0 + Math.sin(elapsed * 4.5) * 0.18;
      this.cosmicTargetBeacon.scale.set(scale, scale, scale);
    }
  }

  public getSunPosition(): THREE.Vector3 {
    return this.sunMesh.position.clone();
  }

  public dispose(): void {
    this.sunMesh.geometry.dispose();
    (this.sunMesh.material as THREE.Material).dispose();
    this.sunCorona.geometry.dispose();
    (this.sunCorona.material as THREE.Material).dispose();
    if (this.outerCorona) {
      this.outerCorona.geometry.dispose();
      (this.outerCorona.material as THREE.Material).dispose();
    }
    this.moonMesh.geometry.dispose();
    this.moonMaterial.dispose();
    this.cosmicBeamMoon.geometry.dispose();
    (this.cosmicBeamMoon.material as THREE.Material).dispose();
    this.cosmicBeamSun.geometry.dispose();
    (this.cosmicBeamSun.material as THREE.Material).dispose();
    this.cosmicTrajectoryLine.geometry.dispose();
    (this.cosmicTrajectoryLine.material as THREE.Material).dispose();
    this.cosmicTargetBeacon.geometry.dispose();
    (this.cosmicTargetBeacon.material as THREE.Material).dispose();
  }
}
