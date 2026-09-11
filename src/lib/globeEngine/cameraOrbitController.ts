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

    // 2. Executa a interpolação suave da câmera durante o voo
    if (this.glideState.active) {
      const elapsed = nowMs - this.glideState.startTime;
      const progress = Math.min(1.0, elapsed / this.glideState.durationMs);

      // Easing cúbico desacelerado puro (monotônico, sem overshooting nem distorção)
      const ease = 1.0 - Math.pow(1.0 - progress, 3);

      // Interpolação direta e precisa do ponto de visada e da posição
      this.controls.target.lerpVectors(this.glideState.startTarget, this.glideState.endTarget, ease);
      this.camera.position.lerpVectors(this.glideState.startPos, this.glideState.endPos, ease);
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
