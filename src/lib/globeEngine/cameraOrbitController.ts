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

  private lastEarthPos: THREE.Vector3 | null = null;
  private lastTargetMeshPos: THREE.Vector3 | null = null;

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
   * Inicia transição orbital esférica e direta ao ponto alvo.
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

    // 1. Rastreamento dinâmico de translação da Terra ou astros durante transição ou em repouso
    if (this.focusMode === 'earth' && earthPos) {
      if (this.lastEarthPos) {
        const deltaEarth = earthPos.clone().sub(this.lastEarthPos);
        if (deltaEarth.lengthSq() > 0.0000001) {
          // Se a Terra se moveu no espaço orbital, move a câmera e o alvo em sincronia absoluta
          if (this.glideState.active) {
            this.glideState.endPos.add(deltaEarth);
            this.glideState.endTarget.add(deltaEarth);
          } else {
            this.camera.position.add(deltaEarth);
            this.controls.target.add(deltaEarth);
          }
        }
      }
      this.lastEarthPos = earthPos.clone();
    } else {
      this.lastEarthPos = null;
    }

    if ((this.focusMode === 'moon' || this.focusMode === 'planet') && this.targetMesh) {
      const meshWorld = new THREE.Vector3();
      this.targetMesh.getWorldPosition(meshWorld);
      if (this.lastTargetMeshPos) {
        const delta = meshWorld.clone().sub(this.lastTargetMeshPos);
        if (delta.lengthSq() > 0.0000001) {
          if (this.glideState.active) {
            this.glideState.endPos.add(delta);
            this.glideState.endTarget.add(delta);
          } else {
            this.camera.position.add(delta);
            this.controls.target.add(delta);
          }
        }
      }
      this.lastTargetMeshPos = meshWorld.clone();
    } else {
      this.lastTargetMeshPos = null;
    }

    // 2. Executa a interpolação suave e esférica da câmera durante o voo (sem mergulho através de malhas)
    if (this.glideState.active) {
      const elapsed = nowMs - this.glideState.startTime;
      const progress = Math.min(1.0, elapsed / this.glideState.durationMs);

      // Easing cúbico desacelerado suave (monotônico, sem overshooting)
      const ease = 1.0 - Math.pow(1.0 - progress, 3);

      // Interpolação do ponto de visada
      this.controls.target.lerpVectors(this.glideState.startTarget, this.glideState.endTarget, ease);

      // Distâncias radiais relativas ao alvo no início e fim
      const startDist = this.glideState.startPos.distanceTo(this.glideState.startTarget);
      const endDist = this.glideState.endPos.distanceTo(this.glideState.endTarget);
      const expectedDist = THREE.MathUtils.lerp(startDist, endDist, ease);

      // Posição linear base
      const pLinear = new THREE.Vector3().lerpVectors(this.glideState.startPos, this.glideState.endPos, ease);
      const relVec = pLinear.clone().sub(this.controls.target);
      const currentDist = relVec.length();

      // Piso de segurança radial: impede terminantemente que a câmera corte o interior da Terra ou do Sol
      const safeRadius = Math.min(startDist, endDist) * 0.96;
      if (currentDist < safeRadius && currentDist > 0.001) {
        relVec.setLength(Math.max(safeRadius, expectedDist));
        this.camera.position.copy(this.controls.target).add(relVec);
      } else {
        this.camera.position.copy(pLinear);
      }

      // Arco de elevação parabólica para transições longas (geodésica espacial orbital)
      const travelDist = this.glideState.startPos.distanceTo(this.glideState.endPos);
      if (travelDist > 4.0) {
        const archHeight = Math.sin(progress * Math.PI) * Math.min(5.5, travelDist * 0.16);
        this.camera.position.y += archHeight;
      }

      this.camera.lookAt(this.controls.target);

      if (progress >= 1.0) {
        this.glideState.active = false;
        this.camera.position.copy(this.glideState.endPos);
        this.controls.target.copy(this.glideState.endTarget);
        this.controls.update();
      }
      return;
    }

    // 3. Atualização normal dos controles de órbita
    this.controls.update();
  }
}
