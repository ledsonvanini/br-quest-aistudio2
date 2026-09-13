/**
 * Tipos e Interfaces Estruturadas para as Camadas de Painéis do Globo 3D
 */
import {
  GlobeTextureMode,
  GlobeSeason,
  StateAstrometryTelemetry,
  MoonPhaseData,
  GeodesicRoute,
  HeliocentricOrbitalState,
} from '../lib/globeEngine';
import { CameraFocusMode } from '../lib/globeEngine/cameraOrbitController';
import { BrasiliaTimeData } from '../hooks/useBrasiliaTime';
import { BorderRegionFilter } from '../components/globe/GlobeControlsHUD';
import { CelestialBodyInfo, CosmicTrajectoryTelemetry } from '../lib/globeEngine/types';

export interface GlobeLightingState {
  simulatedSolarHour: number | null;
  onChangeSolarHour: (hour: number | null) => void;
  isSolarCyclePlaying: boolean;
  onToggleSolarCycle: () => void;
  solarCycleSpeed: number;
  onChangeSolarCycleSpeed: (val: number) => void;
  sunIntensity: number;
  onChangeSunIntensity: (val: number) => void;
  ambientLightIntensity: number;
  onChangeAmbientLightIntensity: (val: number) => void;
  moonLightIntensity: number;
  onChangeMoonLightIntensity: (val: number) => void;
  cityLightIntensity: number;
  onChangeCityLightIntensity: (val: number) => void;
  cloudsOpacity: number;
  onChangeCloudsOpacity: (val: number) => void;
  cloudsVisible: boolean;
  onToggleClouds: () => void;
  onResetLightingDefaults: () => void;
}

export interface GlobeOrbitalProps {
  orbitalDayOfYear: number;
  onChangeOrbitalDayOfYear: (day: number) => void;
  isOrbitalPlaying: boolean;
  onToggleOrbitalPlay: () => void;
  orbitalSpeedDaysPerSec: number;
  onChangeOrbitalSpeed: (speed: number) => void;
  isAxialRotationActive: boolean;
  onToggleAxialRotation: () => void;
  cameraFocusMode: CameraFocusMode;
  onChangeCameraFocusMode: (mode: CameraFocusMode) => void;
  currentOrbitalState: HeliocentricOrbitalState;
  isPlanetsAligned: boolean;
  onTogglePlanetsAlignment: () => void;
  onSelectPlanetAstro: (astroId: string) => void;
}

export interface GlobePanelsLayerProps {
  showNavPill: boolean;
  isTelemetryOpen: boolean;
  onToggleTelemetry: () => void;
  telemetryData: StateAstrometryTelemetry | null;
  moonPhaseData: MoonPhaseData | null;
  activeRoutes: GeodesicRoute[];
  allCapitalRoutes: GeodesicRoute[];
  activeAdaptedRoute: GeodesicRoute | null;
  showCosmicBeams: boolean;
  onToggleCosmicBeams: () => void;
  activeSelectedAstroId: string;
  onNavigateToAstro: (astroId: string) => void;
  onPinClick: (stateId: string) => void;
  onSelectCapitalRoute: (originStateId: string, destStateId: string) => void;
  onCustomCityRoute: (originCity: string, destCity: string) => void;
  onResetCapitalsRoute: () => void;
  onResetView: () => void;
  isTextureInfoOpen: boolean;
  onToggleTextureInfoPanel: () => void;
  onCloseTextureInfoPanel: () => void;
  activeTextureMode: GlobeTextureMode;
  onChangeTextureMode: (mode: GlobeTextureMode) => void;
  showSolarSystem: boolean;
  onToggleSolarSystem: () => void;
  selectedAstro: CelestialBodyInfo | null;
  trajectoryTelemetry: CosmicTrajectoryTelemetry | null;
  onSelectAstro: (astro: CelestialBodyInfo | null) => void;
  onFocusAstroCamera: (astro: CelestialBodyInfo) => void;
  isAxialRotationActive: boolean;
  onToggleAxialRotation: () => void;
  cloudsVisible: boolean;
  onToggleClouds: () => void;
  showGeodesicRoutes: boolean;
  onToggleGeodesicRoutes: () => void;
  currentSeason: GlobeSeason;
  onChangeSeason: (season: GlobeSeason) => void;
  showBorders: boolean;
  onToggleBorders: () => void;
  borderRegionFilter: BorderRegionFilter;
  onChangeBorderRegionFilter: (filter: BorderRegionFilter) => void;
  pinDisplayMode: 'all' | 'compact' | 'none';
  onTogglePinDisplayMode: () => void;
  simulatedSolarHour: number | null;
  onChangeSolarHour: (hour: number | null) => void;
  isSolarCyclePlaying: boolean;
  onToggleSolarCycle: () => void;
  ambientLightIntensity: number;
  onChangeAmbientLightIntensity: (val: number) => void;
  moonLightIntensity: number;
  onChangeMoonLightIntensity: (val: number) => void;
  isSolarSimulatorOpen: boolean;
  onToggleSolarSimulator: () => void;
  onCloseSolarSimulator: () => void;
  activeScenePresetId: string;
  onSelectScenePreset: (presetId: string) => void;
  isSolarSimulatorExpanded: boolean;
  onToggleExpandSolarSimulator: (val: boolean) => void;
  solarCycleSpeed: number;
  onChangeSolarCycleSpeed: (val: number) => void;
  sunIntensity: number;
  onChangeSunIntensity: (val: number) => void;
  cityLightIntensity: number;
  onChangeCityLightIntensity: (val: number) => void;
  cloudsOpacity: number;
  onChangeCloudsOpacity: (val: number) => void;
  onResetLightingDefaults: () => void;
  liveBrasilia: BrasiliaTimeData;
  orbitalDayOfYear: number;
  onChangeOrbitalDayOfYear: (day: number) => void;
  isOrbitalPlaying: boolean;
  onToggleOrbitalPlay: () => void;
  orbitalSpeedDaysPerSec: number;
  onChangeOrbitalSpeed: (speed: number) => void;
  cameraFocusMode: CameraFocusMode;
  onChangeCameraFocusMode: (mode: CameraFocusMode) => void;
  currentOrbitalState: HeliocentricOrbitalState;
  isPlanetsAligned: boolean;
  onTogglePlanetsAlignment: () => void;
  onSelectPlanetAstro: (astroId: string) => void;
  isAstralMode: boolean;
  onCloseAllPanels?: () => void;
}
