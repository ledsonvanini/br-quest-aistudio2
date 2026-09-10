import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type CameraFocusMode = 'earth' | 'moon' | 'sun' | 'planet' | 'route' | 'free';

export interface CameraGlideState {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
  startTime: number;
  durationMs: number;
  active: boolean;
}

/**
 * Controller responsável por transições de câmera suaves e esféricas (sem chicoteio ou mergulho),
 * e pelo rastreamento contínuo de corpos celestes e alvos geodésicos no espaço 3D.
 */
export class CameraOrbitController {
  private camera: THREE.PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;

  public focusMode: CameraFocusMode = 'earth';
  public targetAstroId: string | null = null;
  public targetMesh: THREE.Object3D | null = null;

  private glideState: CameraGlideState = {
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startTime: 0,
    durationMs: 1400,
    active: false,
  };

  constructor(camera?: THREE.PerspectiveCamera, controls?: OrbitControls) {
    if (camera) this.camera = camera;
    if (controls) this.controls = controls;
  }

  public attach(camera: THREE.PerspectiveCamera, controls: OrbitControls): void {
    this.camera = camera;
    this.controls = controls;
  }

  public isGliding(): boolean {
    return this.glideState.active;
  }

  /**
   * Inicia transição orbital esférica pura.
   * Evita trajetórias retilíneas que cortam por dentro de corpos celestes.
   */
  public glideTo(
    targetPos: THREE.Vector3,
    lookTarget: THREE.Vector3,
    durationMs = 1300,
    mode: CameraFocusMode = 'earth',
    astroId: string | null = null
  ): void {
    if (!this.camera || !this.controls) return;

    this.focusMode = mode;
    this.targetAstroId = astroId;

    this.glideState = {
      startPos: this.camera.position.clone(),
      endPos: targetPos.clone(),
      startTarget: this.controls.target.clone(),
      endTarget: lookTarget.clone(),
      startTime: performance.now(),
      durationMs: Math.max(300, durationMs),
      active: true,
    };
  }

  /**
   * Atualização frame-a-frame chamada no loop de animação do WebGL.
   */
  public update(nowMs: number, earthPos?: THREE.Vector3, isOrbitalPlaying = false): void {
    if (!this.camera || !this.controls) return;

    if (this.glideState.active) {
      const elapsed = nowMs - this.glideState.startTime;
      const progress = Math.min(1.0, elapsed / this.glideState.durationMs);

      // Easing cúbico monotônico desacelerado (sem overshooting)
      const ease = 1.0 - Math.pow(1.0 - progress, 3);

      // 1. Interpola o centro focal (look target)
      const currentTarget = new THREE.Vector3().lerpVectors(
        this.glideState.startTarget,
        this.glideState.endTarget,
        ease
      );
      this.controls.target.copy(currentTarget);

      // 2. Interpolação esférica da posição da câmera ao redor do centro focal
      const startOffset = this.glideState.startPos.clone().sub(this.glideState.startTarget);
      const endOffset = this.glideState.endPos.clone().sub(this.glideState.endTarget);

      const startDist = Math.max(0.1, startOffset.length());
      const endDist = Math.max(0.1, endOffset.length());
      const currentDist = (1.0 - ease) * startDist + ease * endDist;

      const startDir = startOffset.normalize();
      const endDir = endOffset.normalize();

      // Rotação geodésica em arco esférico usando Quaternion Slerp
      const qStart = new THREE.Quaternion();
      const qTarget = new THREE.Quaternion().setFromUnitVectors(startDir, endDir);
      const qCurrent = new THREE.Quaternion();
      qCurrent.slerpQuaternions(qStart, qTarget, ease);

      const currentDir = startDir.clone().applyQuaternion(qCurrent).normalize();
      this.camera.position.copy(currentTarget).add(currentDir.multiplyScalar(currentDist));

      this.controls.update();

      if (progress >= 1.0) {
        this.glideState.active = false;
        this.camera.position.copy(this.glideState.endPos);
        this.controls.target.copy(this.glideState.endTarget);
        this.controls.update();
      }
      return;
    }

    // Modo contínuo (quando a transição terminou)
    this.handleContinuousTracking(earthPos, isOrbitalPlaying);
  }

  /**
   * Mantém o enquadramento estável e contínuo no corpo celeste correspondente
   */
  private handleContinuousTracking(earthPos?: THREE.Vector3, isOrbitalPlaying = false): void {
    if (!this.controls || !this.camera) return;

    if (this.focusMode === 'sun') {
      const sunPos = new THREE.Vector3(0, 0, 0);
      this.controls.target.lerp(sunPos, 0.1);
      this.controls.update();
      return;
    }

    if (this.focusMode === 'moon' && this.targetMesh) {
      const moonWorld = new THREE.Vector3();
      this.targetMesh.getWorldPosition(moonWorld);

      const delta = moonWorld.clone().sub(this.controls.target);
      this.camera.position.add(delta);
      this.controls.target.copy(moonWorld);
      this.controls.update();
      return;
    }

    if (this.focusMode === 'planet' && this.targetMesh) {
      const planetWorld = new THREE.Vector3();
      this.targetMesh.getWorldPosition(planetWorld);

      const delta = planetWorld.clone().sub(this.controls.target);
      this.camera.position.add(delta);
      this.controls.target.copy(planetWorld);
      this.controls.update();
      return;
    }

    if (this.focusMode === 'earth' && earthPos) {
      if (isOrbitalPlaying) {
        const deltaEarth = earthPos.clone().sub(this.controls.target);
        this.camera.position.add(deltaEarth);
        this.controls.target.copy(earthPos);
      } else {
        this.controls.target.lerp(earthPos, 0.1);
      }
      this.controls.update();
      return;
    }

    this.controls.update();
  }
}
