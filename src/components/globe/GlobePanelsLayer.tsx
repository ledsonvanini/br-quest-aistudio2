/**
 * GlobePanelsLayer - Orquestrador Central das Camadas de Painéis e HUD do Modo Globo 3D
 * Gerencia a exclusividade mútua estrita entre o Simulador Solar, Telemetria e Mosaicos de Textura.
 */
import React from 'react';
import { Hand } from 'lucide-react';
import { GlobeTelemetryCard } from './GlobeTelemetryCard';
import { GlobeControlsHUD } from './GlobeControlsHUD';
import { GlobeSolarSimulatorPanel } from './GlobeSolarSimulatorPanel';
import { GlobeTextureInfoPanel } from './GlobeTextureInfoPanel';
import { CelestialInteractiveOverlay } from './CelestialInteractiveOverlay';
import { GlobePanelsLayerProps } from '../../types/globePanels';

export type { GlobePanelsLayerProps };

export const GlobePanelsLayer: React.FC<GlobePanelsLayerProps> = ({
  showNavPill,
  isTelemetryOpen,
  onToggleTelemetry,
  telemetryData,
  moonPhaseData,
  activeRoutes,
  allCapitalRoutes,
  activeAdaptedRoute,
  showCosmicBeams,
  onToggleCosmicBeams,
  activeSelectedAstroId,
  onNavigateToAstro,
  onPinClick,
  onSelectCapitalRoute,
  onCustomCityRoute,
  onResetCapitalsRoute,
  onResetView,
  isTextureInfoOpen,
  onToggleTextureInfoPanel,
  onCloseTextureInfoPanel,
  activeTextureMode,
  onChangeTextureMode,
  showSolarSystem,
  onToggleSolarSystem,
  selectedAstro,
  trajectoryTelemetry,
  onSelectAstro,
  onFocusAstroCamera,
  isAxialRotationActive,
  onToggleAxialRotation,
  cloudsVisible,
  onToggleClouds,
  showGeodesicRoutes,
  onToggleGeodesicRoutes,
  currentSeason,
  onChangeSeason,
  showBorders,
  onToggleBorders,
  borderRegionFilter,
  onChangeBorderRegionFilter,
  pinDisplayMode,
  onTogglePinDisplayMode,
  simulatedSolarHour,
  onChangeSolarHour,
  isSolarCyclePlaying,
  onToggleSolarCycle,
  ambientLightIntensity,
  onChangeAmbientLightIntensity,
  moonLightIntensity,
  onChangeMoonLightIntensity,
  isSolarSimulatorOpen,
  onToggleSolarSimulator,
  onCloseSolarSimulator,
  activeScenePresetId,
  onSelectScenePreset,
  isSolarSimulatorExpanded,
  onToggleExpandSolarSimulator,
  solarCycleSpeed,
  onChangeSolarCycleSpeed,
  sunIntensity,
  onChangeSunIntensity,
  cityLightIntensity,
  onChangeCityLightIntensity,
  cloudsOpacity,
  onChangeCloudsOpacity,
  onResetLightingDefaults,
  liveBrasilia,
  orbitalDayOfYear,
  onChangeOrbitalDayOfYear,
  isOrbitalPlaying,
  onToggleOrbitalPlay,
  orbitalSpeedDaysPerSec,
  onChangeOrbitalSpeed,
  cameraFocusMode,
  onChangeCameraFocusMode,
  currentOrbitalState,
  isPlanetsAligned,
  onTogglePlanetsAlignment,
  onSelectPlanetAstro,
  isAstralMode,
  onCloseAllPanels,
}) => {
  return (
    <>
      {/* 1. Badge Superior de Ajuda de Navegação */}
      {showNavPill && (
        <div
          id="badge-dica-navegacao-globo"
          className="badge-dica-navegacao-globo pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-xs shadow-xl transition-all duration-300 select-none animate-in fade-in"
        >
          <div className="flex items-center gap-1.5 text-sky-400 font-medium">
            <Hand className="w-3.5 h-3.5" />
            <span>Arraste para orbitar</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Scroll Zoom</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1 text-amber-300">
            <span>Clique nos Brasões</span>
          </div>
        </div>
      )}

      {/* 2. Card de Telemetria Astrométrica */}
      {isTelemetryOpen && !isAstralMode && (
        <GlobeTelemetryCard
          telemetry={telemetryData}
          moonPhase={moonPhaseData}
          routes={activeRoutes}
          allCapitalRoutes={allCapitalRoutes}
          activeAdaptedRoute={activeAdaptedRoute}
          showCosmicBeams={showCosmicBeams}
          onToggleCosmicBeams={onToggleCosmicBeams}
          selectedAstroId={activeSelectedAstroId}
          onSelectAstroId={onNavigateToAstro}
          onSelectRouteTarget={onPinClick}
          onSelectCapitalRoute={onSelectCapitalRoute}
          onCustomCityRoute={onCustomCityRoute}
          onResetCapitalsRoute={onResetCapitalsRoute}
          onClose={() => {
            onToggleTelemetry();
            onResetView();
          }}
        />
      )}

      {/* 3. Painel de Inteligência de Texturas */}
      {isTextureInfoOpen && (
        <GlobeTextureInfoPanel
          textureMode={activeTextureMode}
          onChangeTextureMode={onChangeTextureMode}
          onClose={onCloseTextureInfoPanel}
        />
      )}

      {/* 4. Diálogo Interativo dos Astros */}
      {showSolarSystem && (
        <CelestialInteractiveOverlay
          pins={[]}
          selectedAstro={selectedAstro}
          trajectoryTelemetry={trajectoryTelemetry}
          onSelectAstro={onSelectAstro}
          onFocusAstroCamera={onFocusAstroCamera}
          onResetToBrazil={onResetView}
        />
      )}

      {/* 5. HUD de Controles Flutuante */}
      <GlobeControlsHUD
        autoRotate={isAxialRotationActive}
        onToggleAutoRotate={onToggleAxialRotation}
        cloudsEnabled={cloudsVisible}
        onToggleClouds={onToggleClouds}
        showSolarSystem={showSolarSystem}
        onToggleSolarSystem={onToggleSolarSystem}
        showGeodesicRoutes={showGeodesicRoutes}
        onToggleGeodesicRoutes={onToggleGeodesicRoutes}
        textureMode={activeTextureMode}
        onChangeTextureMode={onChangeTextureMode}
        season={currentSeason}
        onChangeSeason={onChangeSeason}
        showBorders={showBorders}
        onToggleBorders={onToggleBorders}
        borderRegionFilter={borderRegionFilter}
        onChangeBorderRegionFilter={onChangeBorderRegionFilter}
        pinDisplayMode={pinDisplayMode}
        onTogglePinDisplayMode={onTogglePinDisplayMode}
        isTelemetryOpen={isTelemetryOpen}
        onToggleTelemetry={onToggleTelemetry}
        isTextureInfoOpen={isTextureInfoOpen}
        onToggleTextureInfoPanel={onToggleTextureInfoPanel}
        selectedAstroId={activeSelectedAstroId}
        onNavigateToAstro={onNavigateToAstro}
        solarHour={simulatedSolarHour}
        onChangeSolarHour={onChangeSolarHour}
        isSolarCyclePlaying={isSolarCyclePlaying}
        onToggleSolarCycle={onToggleSolarCycle}
        currentSolarStatus={telemetryData?.localSolarStatus || 'dia'}
        ambientLightIntensity={ambientLightIntensity}
        onChangeAmbientLightIntensity={onChangeAmbientLightIntensity}
        moonLightIntensity={moonLightIntensity}
        onChangeMoonLightIntensity={onChangeMoonLightIntensity}
        isSolarSimulatorOpen={isSolarSimulatorOpen}
        onToggleSolarSimulator={onToggleSolarSimulator}
        activeScenePresetId={activeScenePresetId}
        onSelectScenePreset={onSelectScenePreset}
        onCloseAllPanels={onCloseAllPanels}
      />

      {/* 6. Painel Lateral do Simulador Solar & Translação (1 Ano) */}
      <GlobeSolarSimulatorPanel
        isOpen={isSolarSimulatorOpen}
        onClose={onCloseSolarSimulator}
        isExpanded={isSolarSimulatorExpanded}
        onToggleExpand={onToggleExpandSolarSimulator}
        solarHour={simulatedSolarHour}
        onChangeSolarHour={onChangeSolarHour}
        isSolarCyclePlaying={isSolarCyclePlaying}
        onToggleSolarCycle={onToggleSolarCycle}
        solarCycleSpeed={solarCycleSpeed}
        onChangeSolarCycleSpeed={onChangeSolarCycleSpeed}
        sunIntensity={sunIntensity}
        onChangeSunIntensity={onChangeSunIntensity}
        moonLightIntensity={moonLightIntensity}
        onChangeMoonLightIntensity={onChangeMoonLightIntensity}
        ambientLightIntensity={ambientLightIntensity}
        onChangeAmbientLightIntensity={onChangeAmbientLightIntensity}
        cityLightIntensity={cityLightIntensity}
        onChangeCityLightIntensity={onChangeCityLightIntensity}
        cloudsOpacity={cloudsOpacity}
        onChangeCloudsOpacity={onChangeCloudsOpacity}
        cloudsVisible={cloudsVisible}
        onToggleClouds={onToggleClouds}
        onResetDefaults={onResetLightingDefaults}
        liveBrasilia={liveBrasilia}
        currentSolarStatus={telemetryData?.localSolarStatus || 'dia'}
        orbitalDayOfYear={orbitalDayOfYear}
        onChangeOrbitalDayOfYear={onChangeOrbitalDayOfYear}
        isOrbitalPlaying={isOrbitalPlaying}
        onToggleOrbitalPlay={onToggleOrbitalPlay}
        orbitalSpeedDaysPerSec={orbitalSpeedDaysPerSec}
        onChangeOrbitalSpeed={onChangeOrbitalSpeed}
        isAxialRotationActive={isAxialRotationActive}
        onToggleAxialRotation={onToggleAxialRotation}
        cameraFocusMode={cameraFocusMode}
        onChangeCameraFocusMode={onChangeCameraFocusMode}
        onSelectPlanetAstro={onSelectPlanetAstro}
        orbitalState={currentOrbitalState}
        activeScenePresetId={activeScenePresetId}
        onSelectScenePreset={onSelectScenePreset}
        isPlanetsAligned={isPlanetsAligned}
        onTogglePlanetsAlignment={onTogglePlanetsAlignment}
      />
    </>
  );
};
