import { useState, useRef, useEffect, useMemo } from 'react';
import { CameraFocusMode } from '../../lib/globeEngine/cameraOrbitController';
import {
  calculateHeliocentricOrbitalState,
  HeliocentricOrbitalState,
} from '../../lib/globeEngine';

export interface LiveBrasiliaTime {
  formattedTime: string;
  formattedFull: string;
  hours: number;
  minutes: number;
  seconds: number;
  floatHours: number;
  periodName: string;
}

export function useGlobeSolarCycle() {
  // Solar Hour & Day/Night 24h Cycle Simulation (Default to null = Ao Vivo Brasília UTC-3)
  const [simulatedSolarHour, setSimulatedSolarHour] = useState<number | null>(null);
  const [isSolarCyclePlaying, setIsSolarCyclePlaying] = useState<boolean>(false);
  const simulatedSolarHourRef = useRef<number | null>(null);
  const isSolarCyclePlayingRef = useRef<boolean>(false);

  // 3-Point Planetary Lighting System & Solar Simulator State
  const [sunIntensity, setSunIntensity] = useState<number>(1.25);
  const sunIntensityRef = useRef<number>(1.25);
  const [moonLightIntensity, setMoonLightIntensity] = useState<number>(0.65);
  const moonLightIntensityRef = useRef<number>(0.65);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState<number>(0.16);
  const ambientLightIntensityRef = useRef<number>(0.16);
  const [cityLightIntensity, setCityLightIntensity] = useState<number>(1.40);
  const cityLightIntensityRef = useRef<number>(1.40);
  const [cloudsOpacity, setCloudsOpacity] = useState<number>(0.22);
  const cloudsOpacityRef = useRef<number>(0.22);

  // Dedicated Right Lateral Solar Simulator Panel State
  const [isSolarSimulatorOpen, setIsSolarSimulatorOpen] = useState<boolean>(false);
  const isSolarSimulatorOpenRef = useRef<boolean>(false);
  isSolarSimulatorOpenRef.current = isSolarSimulatorOpen;
  const [isSolarSimulatorExpanded, setIsSolarSimulatorExpanded] = useState<boolean>(false);
  const isSolarSimulatorExpandedRef = useRef<boolean>(false);
  isSolarSimulatorExpandedRef.current = isSolarSimulatorExpanded;
  const [solarCycleSpeed, setSolarCycleSpeed] = useState<number>(1);
  const solarCycleSpeedRef = useRef<number>(1);
  solarCycleSpeedRef.current = solarCycleSpeed;

  // Orbital Translation & Keplerian Physics State
  const [orbitalDayOfYear, setOrbitalDayOfYear] = useState<number>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) || 172; // Default to mid-year / winter solstice in Brazil
  });
  const orbitalDayOfYearRef = useRef<number>(orbitalDayOfYear);
  orbitalDayOfYearRef.current = orbitalDayOfYear;
  const [isOrbitalPlaying, setIsOrbitalPlaying] = useState<boolean>(false);
  const isOrbitalPlayingRef = useRef<boolean>(false);
  isOrbitalPlayingRef.current = isOrbitalPlaying;
  const [orbitalSpeedDaysPerSec, setOrbitalSpeedDaysPerSec] = useState<number>(7);
  const orbitalSpeedDaysPerSecRef = useRef<number>(7);
  orbitalSpeedDaysPerSecRef.current = orbitalSpeedDaysPerSec;
  const [isAxialRotationActive, setIsAxialRotationActive] = useState<boolean>(false);
  const isAxialRotationActiveRef = useRef<boolean>(false);
  isAxialRotationActiveRef.current = isAxialRotationActive;
  const [cameraFocusMode, setCameraFocusMode] = useState<CameraFocusMode>('earth');
  const cameraFocusModeRef = useRef<CameraFocusMode>('earth');
  cameraFocusModeRef.current = cameraFocusMode;
  const [isPlanetsAligned, setIsPlanetsAligned] = useState<boolean>(false);
  const isPlanetsAlignedRef = useRef<boolean>(false);
  isPlanetsAlignedRef.current = isPlanetsAligned;
  const [activeScenePresetId, setActiveScenePresetId] = useState<string>('foco-brasil');

  // Live Official Brasília Clock (UTC-3)
  const [liveBrasilia, setLiveBrasilia] = useState<LiveBrasiliaTime>(() => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const brtHours = (utcHours - 3 + 24) % 24;
    const period =
      brtHours >= 6 && brtHours < 12
        ? 'Manhã'
        : brtHours >= 12 && brtHours < 18
        ? 'Tarde'
        : brtHours >= 18 && brtHours < 24
        ? 'Noite'
        : 'Madrugada';
    return {
      formattedTime: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
      formattedFull: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`,
      hours: brtHours,
      minutes: utcMinutes,
      seconds: utcSeconds,
      floatHours: brtHours + utcMinutes / 60 + utcSeconds / 3600,
      periodName: period,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const utcSeconds = now.getUTCSeconds();
      const brtHours = (utcHours - 3 + 24) % 24;
      const period =
        brtHours >= 6 && brtHours < 12
          ? 'Manhã'
          : brtHours >= 12 && brtHours < 18
          ? 'Tarde'
          : brtHours >= 18 && brtHours < 24
          ? 'Noite'
          : 'Madrugada';
      setLiveBrasilia({
        formattedTime: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
        formattedFull: `${brtHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`,
        hours: brtHours,
        minutes: utcMinutes,
        seconds: utcSeconds,
        floatHours: brtHours + utcMinutes / 60 + utcSeconds / 3600,
        periodName: period,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    simulatedSolarHourRef.current = simulatedSolarHour;
  }, [simulatedSolarHour]);

  useEffect(() => {
    isSolarCyclePlayingRef.current = isSolarCyclePlaying;
  }, [isSolarCyclePlaying]);

  useEffect(() => {
    sunIntensityRef.current = sunIntensity;
  }, [sunIntensity]);

  useEffect(() => {
    ambientLightIntensityRef.current = ambientLightIntensity;
  }, [ambientLightIntensity]);

  useEffect(() => {
    moonLightIntensityRef.current = moonLightIntensity;
  }, [moonLightIntensity]);

  useEffect(() => {
    cityLightIntensityRef.current = cityLightIntensity;
  }, [cityLightIntensity]);

  useEffect(() => {
    cloudsOpacityRef.current = cloudsOpacity;
  }, [cloudsOpacity]);

  useEffect(() => {
    orbitalDayOfYearRef.current = orbitalDayOfYear;
  }, [orbitalDayOfYear]);

  useEffect(() => {
    isOrbitalPlayingRef.current = isOrbitalPlaying;
  }, [isOrbitalPlaying]);

  useEffect(() => {
    orbitalSpeedDaysPerSecRef.current = orbitalSpeedDaysPerSec;
  }, [orbitalSpeedDaysPerSec]);

  useEffect(() => {
    isAxialRotationActiveRef.current = isAxialRotationActive;
  }, [isAxialRotationActive]);

  useEffect(() => {
    cameraFocusModeRef.current = cameraFocusMode;
  }, [cameraFocusMode]);

  useEffect(() => {
    isPlanetsAlignedRef.current = isPlanetsAligned;
  }, [isPlanetsAligned]);

  const currentOrbitalState = useMemo<HeliocentricOrbitalState>(() => {
    return calculateHeliocentricOrbitalState(
      orbitalDayOfYear,
      simulatedSolarHour !== null ? simulatedSolarHour : liveBrasilia.floatHours
    );
  }, [orbitalDayOfYear, simulatedSolarHour, liveBrasilia.floatHours]);

  return {
    simulatedSolarHour,
    setSimulatedSolarHour,
    simulatedSolarHourRef,
    isSolarCyclePlaying,
    setIsSolarCyclePlaying,
    isSolarCyclePlayingRef,
    sunIntensity,
    setSunIntensity,
    sunIntensityRef,
    moonLightIntensity,
    setMoonLightIntensity,
    moonLightIntensityRef,
    ambientLightIntensity,
    setAmbientLightIntensity,
    ambientLightIntensityRef,
    cityLightIntensity,
    setCityLightIntensity,
    cityLightIntensityRef,
    cloudsOpacity,
    setCloudsOpacity,
    cloudsOpacityRef,
    isSolarSimulatorOpen,
    setIsSolarSimulatorOpen,
    isSolarSimulatorOpenRef,
    isSolarSimulatorExpanded,
    setIsSolarSimulatorExpanded,
    isSolarSimulatorExpandedRef,
    solarCycleSpeed,
    setSolarCycleSpeed,
    solarCycleSpeedRef,
    orbitalDayOfYear,
    setOrbitalDayOfYear,
    orbitalDayOfYearRef,
    isOrbitalPlaying,
    setIsOrbitalPlaying,
    isOrbitalPlayingRef,
    orbitalSpeedDaysPerSec,
    setOrbitalSpeedDaysPerSec,
    orbitalSpeedDaysPerSecRef,
    isAxialRotationActive,
    setIsAxialRotationActive,
    isAxialRotationActiveRef,
    cameraFocusMode,
    setCameraFocusMode,
    cameraFocusModeRef,
    isPlanetsAligned,
    setIsPlanetsAligned,
    isPlanetsAlignedRef,
    activeScenePresetId,
    setActiveScenePresetId,
    liveBrasilia,
    currentOrbitalState,
  };
}
