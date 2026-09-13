import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { BRAZIL_STATES_GEO } from '../../data/brazilGeoCoordinates';
import { findCityByName } from '../../data/brazilCitiesGeo';
import {
  GlobeSeason,
  GeodesicRoutesEngine,
  calculateStateAstrometry,
  calculateLunarCoordinates,
  latLonToSphereVector3,
  SCENE_GLOBE_RADIUS,
  StateAstrometryTelemetry,
  MoonPhaseData,
  GeodesicRoute,
} from '../../lib/globeEngine';
import { CameraFocusMode } from '../../lib/globeEngine/cameraOrbitController';

export interface UseGlobeAstrometryProps {
  currentTargetStateId: string;
  currentSeason: GlobeSeason;
  simulatedSolarHour: number | null;
  globeGroupRef: React.MutableRefObject<THREE.Group | null>;
  geodesicEngineRef: React.MutableRefObject<GeodesicRoutesEngine | null>;
  cameraOrbitControllerRef: React.MutableRefObject<any>;
  smoothGlideCamera: (
    targetPos: THREE.Vector3,
    lookTarget: THREE.Vector3,
    durationMs?: number,
    mode?: CameraFocusMode,
    astroId?: string | null
  ) => void;
  setShowGeodesicRoutes: (visible: boolean) => void;
}

export function getEffectiveDate(hour: number | null): Date {
  if (hour === null) return new Date();
  // Brasília is UTC-3, so UTC = hour + 3
  const utcHour = (hour + 3) % 24;
  const wholeHours = Math.floor(utcHour);
  const minutes = Math.floor((utcHour % 1) * 60);
  const seconds = Math.floor((((utcHour % 1) * 60) % 1) * 60);
  const d = new Date();
  d.setUTCHours(wholeHours, minutes, seconds, 0);
  return d;
}

export function useGlobeAstrometry({
  currentTargetStateId,
  currentSeason,
  simulatedSolarHour,
  globeGroupRef,
  geodesicEngineRef,
  cameraOrbitControllerRef,
  smoothGlideCamera,
  setShowGeodesicRoutes,
}: UseGlobeAstrometryProps) {
  const [telemetryData, setTelemetryData] = useState<StateAstrometryTelemetry | null>(null);
  const [moonPhaseData, setMoonPhaseData] = useState<MoonPhaseData | null>(null);
  const [activeRoutes, setActiveRoutes] = useState<GeodesicRoute[]>([]);
  const [allCapitalRoutes, setAllCapitalRoutes] = useState<GeodesicRoute[]>([]);
  const [activeAdaptedRoute, setActiveAdaptedRoute] = useState<GeodesicRoute | null>(null);

  // Recalculate Astrometric Telemetry & Moon Phase on target state, season, or solar hour change
  useEffect(() => {
    const geo = BRAZIL_STATES_GEO[currentTargetStateId];
    if (geo) {
      const effDate = getEffectiveDate(simulatedSolarHour);
      const telemetry = calculateStateAstrometry(
        currentTargetStateId,
        geo.name,
        geo.capital,
        geo.lat,
        geo.lon,
        effDate,
        currentSeason
      );
      setTelemetryData(telemetry);

      const lunar = calculateLunarCoordinates(effDate);
      setMoonPhaseData(lunar.phase);
    }
  }, [currentTargetStateId, currentSeason, simulatedSolarHour]);

  // Update default state capital routes only when target state changes and no custom route is active
  useEffect(() => {
    if (geodesicEngineRef.current && !activeAdaptedRoute) {
      const routes = geodesicEngineRef.current.updateRoutes(currentTargetStateId);
      setAllCapitalRoutes(routes);
      setActiveRoutes(routes);
    }
  }, [currentTargetStateId, activeAdaptedRoute, geodesicEngineRef]);

  const handleSelectCapitalRoute = useCallback(
    (originUf: string, destUf: string) => {
      if (!geodesicEngineRef.current) return;
      const route = geodesicEngineRef.current.setAdaptedCapitalsRoute(originUf, destUf, true);
      if (!route) return;

      setActiveAdaptedRoute(route);
      setActiveRoutes([route]);

      // Orbit camera smoothly towards the midpoint of the two capitals on the rotated Earth
      const originGeo = BRAZIL_STATES_GEO[originUf];
      const destGeo = BRAZIL_STATES_GEO[destUf];
      if (originGeo && destGeo && globeGroupRef.current) {
        const midLat = (originGeo.lat + destGeo.lat) / 2;
        const midLon = (originGeo.lon + destGeo.lon) / 2;
        const earthPos = globeGroupRef.current.position.clone();
        const localMid = latLonToSphereVector3(midLat, midLon, SCENE_GLOBE_RADIUS);
        globeGroupRef.current.updateMatrixWorld(true);
        const worldMid = localMid.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
        const normal = worldMid.clone().sub(earthPos).normalize();
        const targetCamPos = earthPos.clone().add(normal.clone().multiplyScalar(4.6));
        cameraOrbitControllerRef.current.targetMesh = null;
        smoothGlideCamera(targetCamPos, earthPos, 1200, 'earth', null);
      }
    },
    [cameraOrbitControllerRef, geodesicEngineRef, globeGroupRef, smoothGlideCamera]
  );

  const handleCustomCityRoute = useCallback(
    (originName: string, destName: string) => {
      const cleanOrigin = originName.replace(/\s*[-/(].*$/, '').trim();
      const cleanDest = destName.replace(/\s*[-/(].*$/, '').trim();

      let originCity = findCityByName(cleanOrigin) || findCityByName(originName);
      if (!originCity) {
        const stateMatch = Object.values(BRAZIL_STATES_GEO).find(
          (s) =>
            s.capital.toLowerCase().includes(cleanOrigin.toLowerCase()) ||
            cleanOrigin.toLowerCase().includes(s.capital.toLowerCase()) ||
            s.name.toLowerCase().includes(cleanOrigin.toLowerCase())
        );
        if (stateMatch) {
          originCity = {
            id: stateMatch.capital.toLowerCase(),
            name: stateMatch.capital,
            uf: stateMatch.id,
            region: stateMatch.region as 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul',
            lat: stateMatch.lat,
            lng: stateMatch.lon,
          };
        }
      }

      let destCity = findCityByName(cleanDest) || findCityByName(destName);
      if (!destCity) {
        const stateMatch = Object.values(BRAZIL_STATES_GEO).find(
          (s) =>
            s.capital.toLowerCase().includes(cleanDest.toLowerCase()) ||
            cleanDest.toLowerCase().includes(s.capital.toLowerCase()) ||
            s.name.toLowerCase().includes(cleanDest.toLowerCase())
        );
        if (stateMatch) {
          destCity = {
            id: stateMatch.capital.toLowerCase(),
            name: stateMatch.capital,
            uf: stateMatch.id,
            region: stateMatch.region as 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul',
            lat: stateMatch.lat,
            lng: stateMatch.lon,
          };
        }
      }

      if (!originCity || !destCity || !geodesicEngineRef.current) return;

      // Visually activate geodesic routes immediately
      setShowGeodesicRoutes(true);
      geodesicEngineRef.current.setVisible(true);

      const route = geodesicEngineRef.current.setCustomCityRoute(
        { name: originCity.name, uf: originCity.uf, lat: originCity.lat, lng: originCity.lng },
        { name: destCity.name, uf: destCity.uf, lat: destCity.lat, lng: destCity.lng },
        true
      );

      setActiveAdaptedRoute(route);
      setActiveRoutes([route]);

      // Orbit camera smoothly towards the midpoint of the route on the rotated Earth
      if (globeGroupRef.current) {
        const midLat = (originCity.lat + destCity.lat) / 2;
        const midLng = (originCity.lng + destCity.lng) / 2;
        const earthPos = globeGroupRef.current.position.clone();
        const localMid = latLonToSphereVector3(midLat, midLng, SCENE_GLOBE_RADIUS);
        globeGroupRef.current.updateMatrixWorld(true);
        const worldMid = localMid.clone().applyMatrix4(globeGroupRef.current.matrixWorld);
        const normal = worldMid.clone().sub(earthPos).normalize();
        const targetCamPos = earthPos.clone().add(normal.clone().multiplyScalar(4.6));
        cameraOrbitControllerRef.current.targetMesh = null;
        smoothGlideCamera(targetCamPos, earthPos, 1200, 'earth', null);
      }
    },
    [cameraOrbitControllerRef, geodesicEngineRef, globeGroupRef, setShowGeodesicRoutes, smoothGlideCamera]
  );

  const handleResetCapitalsRoute = useCallback(() => {
    if (!geodesicEngineRef.current) return;
    const routes = geodesicEngineRef.current.restoreAllCapitalsRoutes();
    setActiveAdaptedRoute(null);
    setActiveRoutes(routes);
  }, [geodesicEngineRef]);

  return {
    telemetryData,
    moonPhaseData,
    activeRoutes,
    allCapitalRoutes,
    activeAdaptedRoute,
    setActiveRoutes,
    setAllCapitalRoutes,
    setActiveAdaptedRoute,
    handleSelectCapitalRoute,
    handleCustomCityRoute,
    handleResetCapitalsRoute,
  };
}
