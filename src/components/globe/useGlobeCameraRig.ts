import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraOrbitController, CameraFocusMode } from '../../lib/globeEngine/cameraOrbitController';
import { latLonToSphereVector3, SCENE_GLOBE_RADIUS } from '../../lib/globeEngine';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';

export interface UseGlobeCameraRigProps {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  controlsRef: React.MutableRefObject<OrbitControls | null>;
  globeGroupRef: React.MutableRefObject<THREE.Group | null>;
  closeAllPanelsExcept: (except: 'telemetry' | 'trajectory' | 'solar_simulator' | 'texture_info' | 'none') => void;
  setActiveSelectedAstroId: (id: string) => void;
  setCameraFocusMode: (mode: CameraFocusMode) => void;
  setActiveScenePresetId: (id: string) => void;
}

export function useGlobeCameraRig({
  cameraRef,
  controlsRef,
  globeGroupRef,
  closeAllPanelsExcept,
  setActiveSelectedAstroId,
  setCameraFocusMode,
  setActiveScenePresetId,
}: UseGlobeCameraRigProps) {
  const cameraOrbitControllerRef = useRef<CameraOrbitController>(new CameraOrbitController());

  const smoothGlideCamera = useCallback(
    (
      targetPos: THREE.Vector3,
      lookTarget: THREE.Vector3,
      durationMs = 1300,
      mode: CameraFocusMode = 'earth',
      astroId: string | null = null
    ) => {
      cameraOrbitControllerRef.current.glideTo(targetPos, lookTarget, durationMs, mode, astroId);
    },
    []
  );

  const handleZoomIn = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newLen = Math.max(2.15, cameraRef.current.position.length() * 0.8);
    cameraRef.current.position.setLength(newLen);
    controlsRef.current.update();
  }, [cameraRef, controlsRef]);

  const handleZoomOut = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newLen = Math.min(18.2, cameraRef.current.position.length() * 1.25);
    cameraRef.current.position.setLength(newLen);
    controlsRef.current.update();
  }, [cameraRef, controlsRef]);

  const handleRotateStep = useCallback((angleDeg = 15) => {
    if (!globeGroupRef.current) return;
    globeGroupRef.current.rotation.y += (angleDeg * Math.PI) / 180;
  }, [globeGroupRef]);

  const handleResetView = useCallback(() => {
    closeAllPanelsExcept('none');
    setActiveSelectedAstroId('terra');
    setCameraFocusMode('earth');
    setActiveScenePresetId('foco-brasil');

    const earthPos = globeGroupRef.current ? globeGroupRef.current.position.clone() : new THREE.Vector3(14, 0, 0);
    let brazilCam = earthPos.clone().add(latLonToSphereVector3(-14.235, -51.925, 5.5));
    if (globeGroupRef.current) {
      const localBrazil = latLonToSphereVector3(-14.235, -51.925, SCENE_GLOBE_RADIUS);
      globeGroupRef.current.updateMatrixWorld(true);
      const worldBrazil = localBrazil.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
      const normal = worldBrazil.clone().sub(earthPos).normalize();
      brazilCam = earthPos.clone().add(normal.clone().multiplyScalar(5.5));
    }
    cameraOrbitControllerRef.current.targetMesh = null;
    smoothGlideCamera(brazilCam, earthPos, 1300, 'earth', null);
  }, [closeAllPanelsExcept, globeGroupRef, setActiveScenePresetId, setActiveSelectedAstroId, setCameraFocusMode, smoothGlideCamera]);

  const handleSetCameraFocusMode = useCallback(
    (mode: CameraFocusMode) => {
      setCameraFocusMode(mode);

      if (mode === 'sun') {
        setActiveScenePresetId('sistema-solar');
        const sunPos = new THREE.Vector3(0, 0, 0);
        const targetCamPos = new THREE.Vector3(18, 38, 52);
        cameraOrbitControllerRef.current.targetMesh = null;
        smoothGlideCamera(targetCamPos, sunPos, 1600, 'sun', 'sol');
      } else {
        setActiveScenePresetId('foco-brasil');
        const earthPos = globeGroupRef.current ? globeGroupRef.current.position.clone() : new THREE.Vector3(14, 0, 0);
        let brazilCam = earthPos.clone().add(latLonToSphereVector3(-14.235, -51.925, 5.5));
        if (globeGroupRef.current) {
          const localBrazil = latLonToSphereVector3(-14.235, -51.925, SCENE_GLOBE_RADIUS);
          globeGroupRef.current.updateMatrixWorld(true);
          const worldBrazil = localBrazil.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
          const normal = worldBrazil.clone().sub(earthPos).normalize();
          brazilCam = earthPos.clone().add(normal.clone().multiplyScalar(5.5));
        }
        cameraOrbitControllerRef.current.targetMesh = null;
        smoothGlideCamera(brazilCam, earthPos, 1400, 'earth', null);
      }
    },
    [globeGroupRef, setActiveScenePresetId, setCameraFocusMode, smoothGlideCamera]
  );

  const focusStateOnGlobe = useCallback(
    (stateId: string, durationMs = 1100) => {
      const geo = BRAZIL_STATES_GEO[stateId];
      if (geo && globeGroupRef.current) {
        const earthPos = globeGroupRef.current.position.clone();
        const localVec = latLonToSphereVector3(geo.lat, geo.lon, SCENE_GLOBE_RADIUS);
        globeGroupRef.current.updateMatrixWorld(true);
        const worldVec = localVec.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
        const normal = worldVec.clone().sub(earthPos).normalize();
        const targetCamPos = earthPos.clone().add(normal.clone().multiplyScalar(4.5));
        cameraOrbitControllerRef.current.targetMesh = null;
        smoothGlideCamera(targetCamPos, earthPos, durationMs, 'earth', null);
      }
    },
    [globeGroupRef, smoothGlideCamera]
  );

  return {
    cameraOrbitControllerRef,
    smoothGlideCamera,
    handleZoomIn,
    handleZoomOut,
    handleRotateStep,
    handleResetView,
    handleSetCameraFocusMode,
    focusStateOnGlobe,
  };
}
