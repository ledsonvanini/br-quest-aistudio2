import React, { useState, useEffect, useCallback } from 'react';
import { SidebarGlobalNavMenu } from './components/SidebarGlobalNavMenu';
import { IsometricMapCanvas } from './components/IsometricMapCanvas';
import { GuardianRPGScene } from './components/GuardianRPGScene';
import { CodexInsignias } from './components/CodexInsignias';
import { DynamicAppFooter } from './components/DynamicAppFooter';
import { AppModalsContainer } from './components/modals/AppModalsContainer';
import { BiodiversityKingdom, BrazilBiome } from './types';
import { GeopoliticaMetricKey } from './types/geopolitica';
import { ClimateMode } from './components/map/ClimatePhenomenaLayer';
import { GUARDIANS_DATA } from './data/guardiansData';
import { loadBrazilGeoData } from './lib/geoDataLoader';
import { apiTracker } from './services/apiTracker';

// Custom Hooks Modulares
import { useAppModes } from './hooks/useAppModes';
import { useAppModals } from './hooks/useAppModals';
import { useAppTelemetrySync } from './hooks/useAppTelemetrySync';
import { useAppProgression } from './hooks/useAppProgression';
import { useAppKeyboardShortcuts } from './hooks/useAppKeyboardShortcuts';
import { useDailyTips } from './hooks/useDailyTips';
import { useAppTerritoryAndLocation } from './hooks/useAppTerritoryAndLocation';

export function App() {
  const modals = useAppModals();
  const telemetry = useAppTelemetrySync();
  const dailyTips = useDailyTips();

  const notify = useCallback((msg: string) => {
    modals.setNotification(msg);
  }, [modals]);

  const {
    progress,
    activeTab,
    setActiveTab,
    activeGuardian,
    setActiveGuardian,
    lang,
    handleGainXp,
    handleBrQuestComplete,
    handleReadRelic,
    handleSelectGuardian,
    handleBackToMap,
  } = useAppProgression(notify);

  const modes = useAppModes('clima');
  const [climateMode, setClimateMode] = useState<ClimateMode>('temperaturas_frentes');
  const [biodiversityKingdom, setBiodiversityKingdom] = useState<BiodiversityKingdom | 'all'>('all');
  const [biodiversityBiome, setBiodiversityBiome] = useState<BrazilBiome | 'all'>('all');
  const [isBiodiversityThreatenedOnly, setIsBiodiversityThreatenedOnly] = useState(false);
  const [isBiodiversityEndemicOnly, setIsBiodiversityEndemicOnly] = useState(false);
  const [geopoliticaMetric, setGeopoliticaMetric] = useState<GeopoliticaMetricKey>('miscigenacao');

  const [activeMusicCategory, setActiveMusicCategory] = useState<'state_anthems' | 'top5' | 'national'>('state_anthems');
  const [selectedRadioEraId, setSelectedRadioEraId] = useState('catedral_1930_1940');

  const [globeTextureMode, setGlobeTextureMode] = useState<'nasa_satellite' | 'night_lights' | 'natural_earth'>('nasa_satellite');
  const [isGlobeCloudsActive, setIsGlobeCloudsActive] = useState(true);
  const [isGlobeAutoRotateActive, setIsGlobeAutoRotateActive] = useState(false);
  const [isGlobeBordersActive, setIsGlobeBordersActive] = useState(true);
  const [globePinMode, setGlobePinMode] = useState<'all' | 'compact' | 'none'>('all');

  const territory = useAppTerritoryAndLocation({
    modes,
    activeTab,
    setActiveTab,
    setBiodiversityBiome,
    notify,
    closeDailyTips: modals.closeDailyTips,
  });

  useAppKeyboardShortcuts({
    modals,
    onResetView: () => modes.setCenterMapTrigger((p) => p + 1),
    selectedStateId: territory.selectedStateId,
    onClearSelectedState: () => territory.setSelectedStateId(null),
  });

  useEffect(() => {
    loadBrazilGeoData().catch(() => {});
    apiTracker.pingAllProviders().catch(() => {});

    const handleHashChange = () => {
      const raw = window.location.hash || '';
      const hash = raw.toLowerCase();

      if (hash.startsWith('#/estado/') || hash.startsWith('#/state/')) {
        const id = hash.replace('#/estado/', '').replace('#/state/', '').toUpperCase();
        const found = GUARDIANS_DATA.find((g) => g.id === id);
        if (found) {
          setActiveGuardian(found);
          setActiveTab('map');
          return;
        }
      } else if (hash === '#/insignias' || hash === '#/santuario') {
        setActiveTab('insignias');
        setActiveGuardian(null);
        return;
      } else if (hash === '#/mapa' || hash === '#/map') {
        setActiveGuardian(null);
        setActiveTab('map');
        return;
      }
      setActiveGuardian(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveGuardian, setActiveTab]);

  return (
    <div className="container-app-brquest relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 1. Visão do Guardião RPG */}
      {activeGuardian && (
        <div className="painel-guardiao-detalhes absolute inset-0 z-50 overflow-hidden bg-slate-950/95 backdrop-blur-md">
          <GuardianRPGScene
            guardian={activeGuardian}
            isCompleted={progress.completedStateIds.includes(activeGuardian.id)}
            hasInsignia={progress.unlockedInsigniaIds.includes(activeGuardian.insigniaNamePt)}
            onBackToMap={handleBackToMap}
            onCompleteQuiz={(xp) => handleGainXp(xp, `Quiz ${activeGuardian.stateNamePt}`)}
            onUnlockInsignia={handleReadRelic}
            lang={lang}
            userProgress={progress}
            onOpenSettings={modals.openSettings}
            onNavigateToSanctuary={() => {
              setActiveTab('insignias');
              setActiveGuardian(null);
            }}
          />
        </div>
      )}

      {/* 2. Sidebar Global Lateral de Modos */}
      {!activeGuardian && activeTab === 'map' && (
        <SidebarGlobalNavMenu
          mainMode={modes.mainMode}
          onSelectMainMode={territory.handleSelectMainMode}
          terrainProvider={modes.terrainProvider}
          onTerrainProviderChange={modes.setTerrainProvider}
          visualStyle={modes.visualStyle}
          onVisualStyleChange={modes.setVisualStyle}
          choroplethSubTheme={modes.choroplethSubTheme}
          onChoroplethSubThemeChange={modes.setChoroplethSubTheme}
          selectedRegionFilter={modes.selectedRegionFilter}
          onSelectRegionFilter={modes.setSelectedRegionFilter}
          onHoverRegionFilter={modes.setHoveredRegionFilter}
          showNeighbors={modes.showNeighbors}
          onToggleNeighbors={modes.toggleNeighbors}
          playerLevel={progress.level}
          onOpenUserProfile={modals.openUserProfile}
          onOpenSettings={modals.openSettings}
          onOpenAboutInfo={modals.openAboutInfo}
          onOpenDailyTips={modals.openDailyTips}
          dailyTipsUnreadCount={dailyTips.unreadCount}
          onToggleFps={modals.toggleFps}
          showFps={modals.showFps}
          onOpenApiStatus={modals.openApiStatus}
          climateMode={climateMode}
          onClimateModeChange={setClimateMode}
          isObservatorioOpen={modes.isObservatorioOpen}
          onToggleObservatorio={() => modes.setIsObservatorioOpen((p) => !p)}
          isWavesActive={modes.isWavesActive}
          onToggleWaves={() => modes.setIsWavesActive((p) => !p)}
          isCloudsActive={modes.isCloudsActive}
          onToggleClouds={() => modes.setIsCloudsActive((p) => !p)}
          isRainSimActive={modes.isRainSimActive}
          onToggleRainSim={() => modes.setIsRainSimActive((p) => !p)}
          isAtmosphereActive={modes.isAtmosphereActive}
          onToggleAtmosphere={() => modes.setIsAtmosphereActive((p) => !p)}
          celestialTimeOverride={modes.celestialTimeOverride}
          biodiversityKingdom={biodiversityKingdom}
          onBiodiversityKingdomChange={setBiodiversityKingdom}
          biodiversityBiome={biodiversityBiome}
          onBiodiversityBiomeChange={setBiodiversityBiome}
          isBiodiversityThreatenedOnly={isBiodiversityThreatenedOnly}
          onToggleBiodiversityThreatenedOnly={() => setIsBiodiversityThreatenedOnly((p) => !p)}
          isBiodiversityEndemicOnly={isBiodiversityEndemicOnly}
          onToggleBiodiversityEndemicOnly={() => setIsBiodiversityEndemicOnly((p) => !p)}
          isBiodiversityPanelOpen={modes.isBiodiversityPanelOpen}
          onToggleBiodiversityPanel={() => modes.setIsBiodiversityPanelOpen((p) => !p)}
          geopoliticaMetric={geopoliticaMetric}
          onGeopoliticaMetricChange={setGeopoliticaMetric}
          isGeopoliticaPanelOpen={modes.isGeopoliticaPanelOpen}
          onToggleGeopoliticaPanel={() => modes.setIsGeopoliticaPanelOpen((p) => !p)}
          activeMusicCategory={activeMusicCategory}
          onSelectMusicCategory={setActiveMusicCategory}
          isRadioOpen={modes.isRadioOpen}
          onToggleRadio={() => modes.setIsRadioOpen((p) => !p)}
          selectedStateId={territory.selectedStateId}
          onFocusState={(id) => {
            territory.setSelectedStateId(id);
            modes.setFocusedStateId(id);
          }}
          activeCartographyLayer={territory.activeCartographyLayer}
          onSelectCartographyLayer={territory.handleSelectCartographyLayer}
          selectedTerritorySubitemId={territory.selectedTerritorySubitemId}
          onSelectTerritorySubitem={territory.setSelectedTerritorySubitemId}
          isTerritorySubmenuOpen={territory.isTerritorySubmenuOpen}
          onToggleTerritorySubmenu={() => territory.setIsTerritorySubmenuOpen((p) => !p)}
          onSelectState={(id) => {
            territory.setSelectedStateId(id);
            if (id) territory.setIsTerritorySubmenuOpen(false);
          }}
          onResetView={() => modes.setCenterMapTrigger((p) => p + 1)}
          globeTextureMode={globeTextureMode}
          onGlobeTextureModeChange={setGlobeTextureMode}
          isGlobeCloudsActive={isGlobeCloudsActive}
          onToggleGlobeClouds={() => setIsGlobeCloudsActive((p) => !p)}
          isGlobeAutoRotateActive={isGlobeAutoRotateActive}
          onToggleGlobeAutoRotate={() => setIsGlobeAutoRotateActive((p) => !p)}
          isGlobeBordersActive={isGlobeBordersActive}
          onToggleGlobeBorders={() => setIsGlobeBordersActive((p) => !p)}
          globePinMode={globePinMode}
          isGlobeTelemetryOpen={modes.isGlobeTelemetryOpen}
          onToggleGlobeTelemetry={() => modes.setIsGlobeTelemetryOpen((p) => !p)}
          onResetGlobeCamera={() => modes.setCenterMapTrigger((p) => p + 1)}
          isAnyModalOpen={modals.isAnyModalOpen}
        />
      )}

      {/* 3. Palco Central: Mapa 2D D3 ou Santuário de Insígnias */}
      <main className="w-full h-full relative">
        {activeTab === 'map' ? (
          <div className="container-mapa-br relative w-full h-full">
            <IsometricMapCanvas
              mainMode={modes.mainMode}
              terrainProvider={modes.terrainProvider}
              visualStyle={modes.visualStyle}
              choroplethSubTheme={modes.choroplethSubTheme}
              selectedRegionFilter={modes.selectedRegionFilter}
              hoveredRegionFilter={modes.hoveredRegionFilter}
              showNeighbors={modes.showNeighbors}
              onSelectGuardian={handleSelectGuardian}
              lang={lang}
              completedStateIds={progress.completedStateIds}
              unlockedInsigniaIds={progress.unlockedInsigniaIds}
              climateMode={climateMode}
              onClimateModeChange={setClimateMode}
              isObservatorioOpen={modes.isObservatorioOpen}
              onToggleObservatorio={() => modes.setIsObservatorioOpen((p) => !p)}
              atmosphereEnabled={modes.isAtmosphereActive}
              timeOverride={modes.celestialTimeOverride}
              wavesEnabled={modes.isWavesActive}
              cloudsEnabled={modes.isCloudsActive}
              rainSimEnabled={modes.isRainSimActive}
              centerTrigger={modes.centerMapTrigger}
              isRadioOpen={modes.isRadioOpen}
              onToggleRadio={() => modes.setIsRadioOpen((p) => !p)}
              activeMusicCategory={activeMusicCategory}
              onSelectMusicCategory={setActiveMusicCategory}
              selectedRadioEraId={selectedRadioEraId}
              onSelectRadioEra={setSelectedRadioEraId}
              globeTextureMode={globeTextureMode}
              globeClouds={isGlobeCloudsActive}
              globeAutoRotate={isGlobeAutoRotateActive}
              globeBorders={isGlobeBordersActive}
              globePinMode={globePinMode}
              isGlobeTelemetryOpen={modes.isGlobeTelemetryOpen}
              onToggleGlobeTelemetry={() => modes.setIsGlobeTelemetryOpen((p) => !p)}
              focusedStateId={modes.focusedStateId}
              onFocusStateHandled={() => modes.setFocusedStateId(null)}
              onHoverStateChange={territory.setHoveredStateId}
              biodiversityKingdom={biodiversityKingdom}
              onBiodiversityKingdomChange={setBiodiversityKingdom}
              biodiversityBiome={biodiversityBiome}
              onBiodiversityBiomeChange={setBiodiversityBiome}
              isBiodiversityThreatenedOnly={isBiodiversityThreatenedOnly}
              onToggleBiodiversityThreatenedOnly={() => setIsBiodiversityThreatenedOnly((p) => !p)}
              isBiodiversityEndemicOnly={isBiodiversityEndemicOnly}
              onToggleBiodiversityEndemicOnly={() => setIsBiodiversityEndemicOnly((p) => !p)}
              isBiodiversityPanelOpen={modes.isBiodiversityPanelOpen}
              onToggleBiodiversityPanel={() => modes.setIsBiodiversityPanelOpen((p) => !p)}
              geopoliticaMetric={geopoliticaMetric}
              onGeopoliticaMetricChange={setGeopoliticaMetric}
              isGeopoliticaPanelOpen={modes.isGeopoliticaPanelOpen}
              onToggleGeopoliticaPanel={() => modes.setIsGeopoliticaPanelOpen((p) => !p)}
              onOpenDailyTips={modals.openDailyTips}
              dailyTipsUnreadCount={dailyTips.unreadCount}
              onOpenSearchSelector={modals.openSearchSelector}
              isUserLocatedActive={Boolean(territory.userLocation)}
              onClearUserLocation={territory.handleClearUserLocation}
              onStateLocated={territory.handleStateLocated}
              onNotification={notify}
            />
          </div>
        ) : (
          <CodexInsignias
            progress={progress}
            lang={lang}
            onNavigateToState={(stateId) => {
              const found = GUARDIANS_DATA.find((g) => g.id === stateId);
              if (found) handleSelectGuardian(found);
            }}
            onReadRelic={handleReadRelic}
            onBackToMap={handleBackToMap}
          />
        )}
      </main>

      {/* 4. Rodapé Dinâmico com Telemetria e Acessos */}
      <DynamicAppFooter
        mainMode={modes.mainMode}
        activeTab={activeTab}
        activeGuardian={activeGuardian}
        completedStateIds={progress.completedStateIds}
        unlockedInsigniaCount={progress.unlockedInsigniaIds.length}
        hoveredStateId={territory.hoveredStateId}
        selectedStateId={territory.selectedStateId}
        onStateHover={territory.setHoveredStateId}
        onStateClick={(id) => {
          const found = GUARDIANS_DATA.find((g) => g.id === id);
          if (found) handleSelectGuardian(found);
        }}
        onOpenAboutInfo={modals.openAboutInfo}
        onNavigateHome={handleBackToMap}
        showFps={modals.showFps}
        onToggleFps={modals.toggleFps}
        onOpenApiStatus={modals.openApiStatus}
        climateMode={climateMode}
        onOpenObservatorio={() => modes.setIsObservatorioOpen((p) => !p)}
        isObservatorioOpen={modes.isObservatorioOpen}
        avgTempBrazil={telemetry.climateTelemetry.avgTempBrazil}
        maxTempState={telemetry.climateTelemetry.maxTempState}
        minTempState={telemetry.climateTelemetry.minTempState}
        climateLastUpdated={telemetry.latestClimateFetchTs}
        globeTextureMode={globeTextureMode}
        isGlobeAutoRotateActive={isGlobeAutoRotateActive}
        isGlobeCloudsActive={isGlobeCloudsActive}
        onToggleGlobeAutoRotate={() => setIsGlobeAutoRotateActive((p) => !p)}
        onResetGlobeCamera={() => modes.setCenterMapTrigger((p) => p + 1)}
        activeCartographyLayer={territory.activeCartographyLayer}
        onClearCartographyLayer={() => territory.handleSelectCartographyLayer('none')}
        onSelectCartographyLayer={territory.handleSelectCartographyLayer}
        selectedTerritorySubitemId={territory.selectedTerritorySubitemId}
        onSelectTerritorySubitem={territory.setSelectedTerritorySubitemId}
        isTerritorySubmenuOpen={territory.isTerritorySubmenuOpen}
        onToggleTerritorySubmenu={() => territory.setIsTerritorySubmenuOpen((p) => !p)}
        onToggleRadio={() => modes.setIsRadioOpen((p) => !p)}
        geopoliticaMetric={geopoliticaMetric}
        onOpenBrQuestHub={() => modals.openBrQuestHub()}
        selectedRegionFilter={modes.selectedRegionFilter}
        onSelectRegionFilter={modes.setSelectedRegionFilter}
      />

      {/* 5. Modais do Sistema Gerenciados pelo Container */}
      <AppModalsContainer
        modals={modals}
        progress={progress}
        dailyTipsController={dailyTips}
        userLocation={territory.userLocation}
        onSelectGuardian={handleSelectGuardian}
        onGainXp={handleGainXp}
        onBrQuestComplete={handleBrQuestComplete}
        onTeleportToState={territory.handleTeleportFromDailyTip}
      />
    </div>
  );
}

export default App;
