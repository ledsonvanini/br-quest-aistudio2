import * as THREE from 'three';

export interface CosmicBeamTarget {
  id: string;
  name: string;
  worldPos: THREE.Vector3;
  color: number;
}

/**
 * Microengine especializada em feixes cósmicos laser volumétricos 3D.
 * Conecta o território brasileiro na Terra diretamente aos astros do Sistema Solar.
 */
export class CosmicLaserBeam {
  public group: THREE.Group;

  private beamMesh: THREE.Mesh;
  private glowMesh: THREE.Mesh;
  private originMarker: THREE.Mesh;
  private targetMarker: THREE.Mesh;

  private beamMaterial: THREE.MeshBasicMaterial;
  private glowMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'grupo-feixe-laser-cosmico';

    // Cilindro do feixe central
    const cylinderGeo = new THREE.CylinderGeometry(0.025, 0.025, 1, 16, 1, true);
    cylinderGeo.translate(0, 0.5, 0);
    cylinderGeo.rotateX(Math.PI / 2);

    this.beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.beamMesh = new THREE.Mesh(cylinderGeo, this.beamMaterial);

    // Cilindro externo de halo/glow
    const glowGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16, 1, true);
    glowGeo.translate(0, 0.5, 0);
    glowGeo.rotateX(Math.PI / 2);

    this.glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.glowMesh = new THREE.Mesh(glowGeo, this.glowMaterial);

    // Marcador de pulso na Terra (origem)
    const markerGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    this.originMarker = new THREE.Mesh(markerGeo, markerMat);

    // Marcador de pulso no astro de destino
    const targetGeo = new THREE.RingGeometry(0.2, 0.35, 32);
    const targetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    this.targetMarker = new THREE.Mesh(targetGeo, targetMat);

    this.group.add(this.beamMesh);
    this.group.add(this.glowMesh);
    this.group.add(this.originMarker);
    this.group.add(this.targetMarker);

    this.group.visible = false;
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  /**
   * Atualiza geometria, orientação e pulso do feixe cósmico no espaço tridimensional.
   */
  public update(
    originWorldPos: THREE.Vector3,
    targetWorldPos: THREE.Vector3,
    colorHex = 0xf59e0b,
    timeMs = 0
  ): void {
    if (!this.group.visible) return;

    // Atualiza cor
    this.beamMaterial.color.setHex(colorHex);
    this.glowMaterial.color.setHex(colorHex);
    (this.originMarker.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
    (this.targetMarker.material as THREE.MeshBasicMaterial).color.setHex(colorHex);

    // Pulso senoidal suave
    const pulse = 0.75 + 0.25 * Math.sin(timeMs * 0.006);
    this.beamMaterial.opacity = 0.9 * pulse;
    this.glowMaterial.opacity = 0.4 * pulse;

    // Vetor de conexão
    const distance = originWorldPos.distanceTo(targetWorldPos);
    if (distance < 0.01) return;

    // Posiciona e orienta os cilindros
    this.beamMesh.position.copy(originWorldPos);
    this.beamMesh.lookAt(targetWorldPos);
    this.beamMesh.scale.set(1, 1, distance);

    this.glowMesh.position.copy(originWorldPos);
    this.glowMesh.lookAt(targetWorldPos);
    this.glowMesh.scale.set(1, 1, distance);

    // Origem na Terra
    this.originMarker.position.copy(originWorldPos);
    const origScale = 0.85 + 0.3 * Math.sin(timeMs * 0.008);
    this.originMarker.scale.setScalar(origScale);

    // Destino no astro
    this.targetMarker.position.copy(targetWorldPos);
    this.targetMarker.lookAt(originWorldPos);
    const targetScale = 1.0 + 0.25 * Math.sin(timeMs * 0.005);
    this.targetMarker.scale.setScalar(targetScale);
  }

  public dispose(): void {
    this.beamMesh.geometry.dispose();
    this.glowMesh.geometry.dispose();
    this.originMarker.geometry.dispose();
    this.targetMarker.geometry.dispose();
    this.beamMaterial.dispose();
    this.glowMaterial.dispose();
  }
}
