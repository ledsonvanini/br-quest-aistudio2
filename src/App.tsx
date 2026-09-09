import React, { useState, useEffect } from 'react';
import { TopGlobalNavMenu, AppMainMode } from './components/TopGlobalNavMenu';
import { IsometricMapCanvas } from './components/IsometricMapCanvas';
import { GuardianRPGScene } from './components/GuardianRPGScene';
import { CodexInsignias } from './components/CodexInsignias';
import { SettingsModal } from './components/SettingsModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { AboutInfoModal } from './components/AboutInfoModal';
import { BrQuestHubModal } from './components/quest/BrQuestHubModal';
import { DynamicAppFooter } from './components/DynamicAppFooter';
import { GuardianData, UserProgress, Language, TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme, BiodiversityKingdom, BrazilBiome } from './types';
import { GeopoliticaMetricKey } from './types/geopolitica';
import { loadUserProgress, saveUserProgress, calculateLevel } from './lib/storage';
import { audioEngine } from './lib/audioSynth';
import { GUARDIANS_DATA } from './data/guardiansData';
import { Sparkles, Activity, Gauge } from 'lucide-react';
import { loadBrazilGeoData } from './lib/geoDataLoader';
import { ClimateMode } from './components/map/ClimatePhenomenaLayer';
import { fetchLiveClimateTelemetry, onClimateTelemetryUpdate, getLatestClimateFetchTimestamp } from './services/climateService';
import { apiTracker } from './services/apiTracker';
import { QuestThemePillar } from './data/brQuestQuestionsData';

import { useAppModes } from './hooks/useAppModes';
import { centralizarZoomMapa } from './services/mapModeService';

export function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'map' | 'insignias'>('map');
  const [activeGuardian, setActiveGuardian] = useState<GuardianData | null>(null);
  const [lang, setLang] = useState<Language>('pt');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState<boolean>(false);
  const [isAboutInfoOpen, setIsAboutInfoOpen] = useState<boolean>(false);
  const [isBrQuestHubOpen, setIsBrQuestHubOpen] = useState<boolean>(false);
  const [brQuestInitialPillar, setBrQuestInitialPillar] = useState<QuestThemePillar | 'nacional' | null>(null);
  const [showFps, setShowFps] = useState<boolean>(false);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>('DF');

  // App Modes Orchestration with custom hook
  const {
    mainMode,
    selectMainMode,
    terrainProvider,
    setTerrainProvider,
    visualStyle,
    setVisualStyle,
    choroplethSubTheme,
    setChoroplethSubTheme,
    isCloudsActive,
    setIsCloudsActive,
    isWavesActive,
    setIsWavesActive,
    isAtmosphereActive,
    setIsAtmosphereActive,
    isRainSimActive,
    setIsRainSimActive,
    celestialTimeOverride,
    setCelestialTimeOverride,
    handleCycleCelestial,
    isObservatorioOpen,
    setIsObservatorioOpen,
    isBiodiversityPanelOpen,
    setIsBiodiversityPanelOpen,
    isGeopoliticaPanelOpen,
    setIsGeopoliticaPanelOpen,
    isRadioOpen,
    setIsRadioOpen,
    isGlobeTelemetryOpen,
    setIsGlobeTelemetryOpen,
    selectedRegionFilter,
    setSelectedRegionFilter,
    hoveredRegionFilter,
    setHoveredRegionFilter,
    showNeighbors,
    setShowNeighbors,
    toggleNeighbors,
    focusedStateId,
    setFocusedStateId,
    centerMapTrigger,
    setCenterMapTrigger,
  } = useAppModes('clima');

  const [climateMode, setClimateMode] = useState<ClimateMode>('temperaturas_frentes');

  // Biodiversity Mode State
  const [biodiversityKingdom, setBiodiversityKingdom] = useState<BiodiversityKingdom | 'all'>('all');
  const [biodiversityBiome, setBiodiversityBiome] = useState<BrazilBiome | 'all'>('all');
  const [isBiodiversityThreatenedOnly, setIsBiodiversityThreatenedOnly] = useState<boolean>(false);
  const [isBiodiversityEndemicOnly, setIsBiodiversityEndemicOnly] = useState<boolean>(false);

  // Geopolítica Mode State
  const [geopoliticaMetric, setGeopoliticaMetric] = useState<GeopoliticaMetricKey>('miscigenacao');

  const [climateTelemetry, setClimateTelemetry] = useState<{
    avgTempBrazil: number;
    maxTempState: { stateId: string; temp: number };
    minTempState: { stateId: string; temp: number };
    lastUpdated: string | number;
  }>({
    avgTempBrazil: 27.4,
    maxTempState: { stateId: 'MT', temp: 35.1 },
    minTempState: { stateId: 'RS', temp: 17.5 },
    lastUpdated: getLatestClimateFetchTimestamp(),
  });

  // Preload and live subscribe to climate telemetry updates
  useEffect(() => {
    const unsubscribe = onClimateTelemetryUpdate((res) => {
      if (res) {
        setClimateTelemetry({
          avgTempBrazil: res.avgTempBrazil,
          maxTempState: res.maxTempState,
          minTempState: res.minTempState,
          lastUpdated: res.fetchedAt || res.updatedAtH || res.updatedAt,
        });
      }
    });

    fetchLiveClimateTelemetry().catch(() => {});

    return () => {
      unsubscribe();
    };
  }, []);

  const [activeMusicCategory, setActiveMusicCategory] = useState<'state_anthems' | 'top5' | 'national'>('state_anthems');
  const [selectedRadioEraId, setSelectedRadioEraId] = useState<string>('catedral_1930_1940');

  // Globe 3D States
  const [globeTextureMode, setGlobeTextureMode] = useState<'nasa_satellite' | 'night_lights' | 'natural_earth'>('nasa_satellite');
  const [isGlobeCloudsActive, setIsGlobeCloudsActive] = useState<boolean>(true);
  const [isGlobeAutoRotateActive, setIsGlobeAutoRotateActive] = useState<boolean>(false);
  const [isGlobeBordersActive, setIsGlobeBordersActive] = useState<boolean>(true);
  const [globePinMode, setGlobePinMode] = useState<'all' | 'compact' | 'none'>('all');

  const handleSelectMainMode = (newMode: AppMainMode) => {
    selectMainMode(newMode);

    if (activeTab !== 'map') {
      setActiveTab('map');
      window.location.hash = '#/mapa';
    }
  };

  // Synchronize hash URL with state route (e.g., #/estado/rs, #/mapa, #/insignias)
  useEffect(() => {
    // Preload GeoJSON cartographic data in background & verify integrated APIs
    loadBrazilGeoData().catch(() => {});
    apiTracker.pingAllProviders().catch(() => {});

    const handleHashChange = () => {
      const rawHash = window.location.hash || '';
      const hash = rawHash.toLowerCase();

      // Padronização em minúsculo e pt-br: #/estado/rs (suporta legado #/state/rs)
      if (hash.startsWith('#/estado/') || hash.startsWith('#/state/')) {
        const stateId = hash
          .replace('#/estado/', '')
          .replace('#/state/', '')
          .toUpperCase();
        const found = GUARDIANS_DATA.find((g) => g.id === stateId);
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
      // Default to map view
      setActiveGuardian(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save progress on change
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleSelectGuardian = (guardian: GuardianData) => {
    audioEngine.playSfx('click');
    setActiveGuardian(guardian);
    window.location.hash = `#/estado/${guardian.id.toLowerCase()}`;
  };

  const handleBackToMap = () => {
    audioEngine.playSfx('click');
    setActiveGuardian(null);
    window.location.hash = '#/mapa';
  };

  const handleCompleteQuiz = (xpEarned: number, correctCount: number, mode?: 'quick' | 'campaign') => {
    if (!activeGuardian) return;

    setProgress((prev) => {
      const isNewState = !prev.completedStateIds.includes(activeGuardian.id);
      const updatedStates = isNewState
        ? [...prev.completedStateIds, activeGuardian.id]
        : prev.completedStateIds;

      const newXp = prev.xp + xpEarned;
      const oldLevel = calculateLevel(prev.xp).level;
      const newLevel = calculateLevel(newXp).level;

      const updatedScores = { ...(prev.stateScores || {}) };
      updatedScores[activeGuardian.id] = (updatedScores[activeGuardian.id] || 0) + xpEarned;

      const updatedCampaigns = { ...(prev.campaignsCompleted || {}) };
      if (mode === 'campaign') {
        updatedCampaigns[activeGuardian.id] = true;
      }

      const updatedQuickDuels = { ...(prev.quickDuelsWon || {}) };
      if (mode === 'quick' && correctCount > 0) {
        updatedQuickDuels[activeGuardian.id] = (updatedQuickDuels[activeGuardian.id] || 0) + 1;
      }

      if (newLevel > oldLevel) {
        audioEngine.playSfx('levelUp');
        showNotification(`🎉 Nível Superior! Você alcançou o Nível ${newLevel}!`);
      } else if (xpEarned > 0) {
        showNotification(`✨ Desafio de ${activeGuardian.stateNamePt} concluído! +${xpEarned} XP`);
      }

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedStateIds: updatedStates,
        totalCorrectAnswers: prev.totalCorrectAnswers + correctCount,
        totalQuestsPlayed: prev.totalQuestsPlayed + 1,
        stateScores: updatedScores,
        campaignsCompleted: updatedCampaigns,
        quickDuelsWon: updatedQuickDuels,
      };

      saveUserProgress(updated);
      return updated;
    });
  };

  const handleBrQuestComplete = (xpEarned: number, correctCount: number) => {
    setProgress((prev) => {
      const newXp = prev.xp + xpEarned;
      const oldLevel = calculateLevel(prev.xp).level;
      const newLevel = calculateLevel(newXp).level;

      if (newLevel > oldLevel) {
        audioEngine.playSfx('levelUp');
        showNotification(`🎉 Nível Superior! Você alcançou o Nível ${newLevel}!`);
      } else if (xpEarned > 0) {
        showNotification(`⚔️ Desafio BrQuest Concluído! +${xpEarned} XP (${correctCount} acertos)`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalCorrectAnswers: prev.totalCorrectAnswers + correctCount,
        totalQuestsPlayed: prev.totalQuestsPlayed + 1,
      };
    });
  };

  const handleReadRelic = (relicId: string, xpEarned: number) => {
    setProgress((prev) => {
      const alreadyRead = prev.readPergamentIds.includes(relicId);
      const updatedRead = alreadyRead ? prev.readPergamentIds : [...prev.readPergamentIds, relicId];
      const newXp = alreadyRead ? prev.xp : prev.xp + xpEarned;
      const oldLevelData = calculateLevel(prev.xp);
      const newLevelData = calculateLevel(newXp);

      if (!alreadyRead) {
        if (newLevelData.level > oldLevelData.level) {
          audioEngine.playSfx('levelUp');
          showNotification(`🎉 Você alcançou o Nível ${newLevelData.level} • Título: ${newLevelData.titlePt}!`);
        } else {
          showNotification(`📜 Sabedoria Absorvida! +${xpEarned} XP`);
        }
      }

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: newLevelData.level,
        readPergamentIds: updatedRead,
      };

      saveUserProgress(updated);
      return updated;
    });
  };

  const handleExploreDialogueTopic = (stateId: string, topicId: string, xpEarned: number) => {
    setProgress((prev) => {
      const explored = prev.exploredDialogueIds || [];
      if (explored.includes(topicId)) return prev;

      const updatedExplored = [...explored, topicId];
      const newXp = prev.xp + xpEarned;
      const oldLevelData = calculateLevel(prev.xp);
      const newLevelData = calculateLevel(newXp);

      const updatedScores = { ...(prev.stateScores || {}) };
      updatedScores[stateId] = (updatedScores[stateId] || 0) + xpEarned;

      if (newLevelData.level > oldLevelData.level) {
        audioEngine.playSfx('levelUp');
        showNotification(`🎉 Você alcançou o Nível ${newLevelData.level} • Título: ${newLevelData.titlePt}!`);
      } else {
        audioEngine.playSfx('badge');
        showNotification(`✨ Curiosidade Descoberta! +${xpEarned} XP`);
      }

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: newLevelData.level,
        exploredDialogueIds: updatedExplored,
        stateScores: updatedScores,
      };

      saveUserProgress(updated);
      return updated;
    });
  };

  const handleUnlockInsignia = (insigniaId: string) => {
    setProgress((prev) => {
      if (prev.unlockedInsigniaIds.includes(insigniaId)) return prev;

      showNotification(`🏆 Insígnia Sagrada de ${insigniaId} Desbloqueada!`);
      return {
        ...prev,
        unlockedInsigniaIds: [...prev.unlockedInsigniaIds, insigniaId],
      };
    });
  };

  const handleToggleNeighbors = () => {
    toggleNeighbors();
    setHoveredStateId(null);
  };

  return (
    <div
      className="container-app-principal h-screen h-dvh max-h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 select-none"
    >
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="banner-notificacao-toast fixed top-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md text-amber-300 font-bold px-4 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 text-xs sm:text-sm animate-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Unified Global Top Menu for All 3 Modes (Adventure, Climate, Music) */}
      {!activeGuardian && activeTab === 'map' && (
        <TopGlobalNavMenu
          mainMode={mainMode}
          onSelectMainMode={handleSelectMainMode}
          terrainProvider={terrainProvider}
          onTerrainProviderChange={(p) => {
            setTerrainProvider(p);
            if (showNeighbors) setShowNeighbors(false);
          }}
          visualStyle={visualStyle}
          onVisualStyleChange={(v) => {
            setVisualStyle(v);
            if (showNeighbors) setShowNeighbors(false);
          }}
          choroplethSubTheme={choroplethSubTheme}
          onChoroplethSubThemeChange={(c) => {
            setChoroplethSubTheme(c);
            if (showNeighbors) setShowNeighbors(false);
          }}
          selectedRegionFilter={selectedRegionFilter}
          onSelectRegionFilter={(region) => {
            setSelectedRegionFilter(region);
            if (showNeighbors) setShowNeighbors(false);
          }}
          onHoverRegionFilter={setHoveredRegionFilter}
          showNeighbors={showNeighbors}
          onToggleNeighbors={handleToggleNeighbors}
          isObservatorioOpen={isObservatorioOpen}
          onToggleObservatorio={() => {
            setIsObservatorioOpen((prev) => !prev);
            if (showNeighbors) setShowNeighbors(false);
          }}
          onNavigateToSanctuary={() => {
            if (showNeighbors) setShowNeighbors(false);
            setActiveGuardian(null);
            setActiveTab('insignias');
            window.location.hash = '#/insignias';
          }}
          playerLevel={progress.level}
          playerXp={progress.xp}
          completedStateCount={progress.completedStateIds.length}
          unlockedInsigniaCount={progress.unlockedInsigniaIds.length}
          climateMode={climateMode}
          onClimateModeChange={(mode) => {
            setClimateMode(mode);
            if (showNeighbors) setShowNeighbors(false);
          }}
          isRainSimActive={isRainSimActive}
          onToggleRainSim={() => setIsRainSimActive((prev) => !prev)}
          isCloudsActive={isCloudsActive}
          onToggleClouds={() => setIsCloudsActive((prev) => !prev)}
          isWavesActive={isWavesActive}
          onToggleWaves={() => setIsWavesActive((prev) => !prev)}
          isAtmosphereActive={isAtmosphereActive}
          onToggleAtmosphere={handleCycleCelestial}
          celestialTimeOverride={celestialTimeOverride}
          onFocusState={(stateId) => {
            setFocusedStateId(stateId);
            if (showNeighbors) setShowNeighbors(false);
          }}
          isRadioOpen={isRadioOpen}
          onToggleRadio={() => setIsRadioOpen((prev) => !prev)}
          activeMusicCategory={activeMusicCategory}
          onSelectMusicCategory={setActiveMusicCategory}
          selectedRadioEraId={selectedRadioEraId}
          onSelectRadioEra={setSelectedRadioEraId}
          globeTextureMode={globeTextureMode}
          onGlobeTextureModeChange={setGlobeTextureMode}
          isGlobeCloudsActive={isGlobeCloudsActive}
          onToggleGlobeClouds={() => setIsGlobeCloudsActive((prev) => !prev)}
          isGlobeAutoRotateActive={isGlobeAutoRotateActive}
          onToggleGlobeAutoRotate={() => setIsGlobeAutoRotateActive((prev) => !prev)}
          isGlobeBordersActive={isGlobeBordersActive}
          onToggleGlobeBorders={() => setIsGlobeBordersActive((prev) => !prev)}
          globePinMode={globePinMode}
          onGlobePinModeChange={setGlobePinMode}
          onResetGlobeCamera={() => setCenterMapTrigger((prev) => prev + 1)}
          isGlobeTelemetryOpen={isGlobeTelemetryOpen}
          onToggleGlobeTelemetry={() => setIsGlobeTelemetryOpen((prev) => !prev)}
          biodiversityKingdom={biodiversityKingdom}
          onBiodiversityKingdomChange={(k) => {
            setBiodiversityKingdom(k);
            if (showNeighbors) setShowNeighbors(false);
          }}
          biodiversityBiome={biodiversityBiome}
          onBiodiversityBiomeChange={(b) => {
            setBiodiversityBiome(b);
            if (showNeighbors) setShowNeighbors(false);
          }}
          isBiodiversityThreatenedOnly={isBiodiversityThreatenedOnly}
          onToggleBiodiversityThreatenedOnly={() => setIsBiodiversityThreatenedOnly((p) => !p)}
          isBiodiversityEndemicOnly={isBiodiversityEndemicOnly}
          onToggleBiodiversityEndemicOnly={() => setIsBiodiversityEndemicOnly((p) => !p)}
          isBiodiversityPanelOpen={isBiodiversityPanelOpen}
          onToggleBiodiversityPanel={() => setIsBiodiversityPanelOpen((p) => !p)}
          geopoliticaMetric={geopoliticaMetric}
          onGeopoliticaMetricChange={(metric) => {
            setGeopoliticaMetric(metric);
            if (showNeighbors) setShowNeighbors(false);
          }}
          isGeopoliticaPanelOpen={isGeopoliticaPanelOpen}
          onToggleGeopoliticaPanel={() => {
            setIsGeopoliticaPanelOpen((p) => !p);
            if (showNeighbors) setShowNeighbors(false);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAboutInfo={() => setIsAboutInfoOpen(true)}
          showFps={showFps}
          onToggleFps={() => setShowFps((prev) => !prev)}
          onOpenApiStatus={() => setIsApiStatusOpen(true)}
          onResetView={() => {
            if (showNeighbors) setShowNeighbors(false);
            setCenterMapTrigger((prev) => prev + 1);
          }}
          onResetViewIfNotCentered={() => {
            if (showNeighbors) setShowNeighbors(false);
            setCenterMapTrigger((prev) => prev + 1);
          }}
          hoveredStateId={hoveredStateId}
          onOpenBrQuestHub={(pillar) => {
            setBrQuestInitialPillar(pillar || null);
            setIsBrQuestHubOpen(true);
          }}
        />
      )}

      {/* Main View Container */}
      <main
        className={`container-conteudo-principal flex-1 min-h-0 w-full flex flex-col overflow-hidden relative ${
          activeGuardian || (activeTab === 'map' && !activeGuardian)
            ? 'p-0 m-0 max-w-none'
            : 'max-w-7xl mx-auto px-1 sm:px-3 py-1'
        }`}
      >
        
        {/* State Detail RPG Scene View (Dedicated Route for Selected State) */}
        {activeGuardian ? (
          <GuardianRPGScene
            guardian={activeGuardian}
            isCompleted={progress.completedStateIds.includes(activeGuardian.id)}
            hasInsignia={progress.unlockedInsigniaIds.includes(activeGuardian.id)}
            onBackToMap={handleBackToMap}
            onCompleteQuiz={handleCompleteQuiz}
            onUnlockInsignia={handleUnlockInsignia}
            onReadRelic={handleReadRelic}
            onExploreDialogueTopic={handleExploreDialogueTopic}
            lang={lang}
            userProgress={progress}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onNavigateToSanctuary={() => {
              setActiveGuardian(null);
              setActiveTab('insignias');
              window.location.hash = '#/insignias';
            }}
          />
        ) : activeTab === 'map' ? (
          /* Interactive RPG Map View (Homepage Route - Full Game Canvas) */
          <div className="container-secao-mapa flex-1 min-h-0 h-full w-full flex flex-col overflow-hidden relative">
            <IsometricMapCanvas
              completedStateIds={progress.completedStateIds}
              unlockedInsigniaIds={progress.unlockedInsigniaIds}
              onSelectGuardian={handleSelectGuardian}
              lang={lang}
              onOpenSettings={() => setIsSettingsOpen(true)}
              mainMode={mainMode}
              onSelectMainMode={handleSelectMainMode}
              climateMode={climateMode}
              onClimateModeChange={setClimateMode}
              terrainProvider={terrainProvider}
              onTerrainProviderChange={setTerrainProvider}
              visualStyle={visualStyle}
              onVisualStyleChange={setVisualStyle}
              choroplethSubTheme={choroplethSubTheme}
              onChoroplethSubThemeChange={setChoroplethSubTheme}
              selectedRegionFilter={selectedRegionFilter}
              hoveredRegionFilter={hoveredRegionFilter}
              showNeighbors={showNeighbors}
              onToggleNeighbors={handleToggleNeighbors}
              isObservatorioOpen={isObservatorioOpen}
              onToggleObservatorio={() => setIsObservatorioOpen((prev) => !prev)}
              atmosphereEnabled={isAtmosphereActive}
              timeOverride={celestialTimeOverride}
              wavesEnabled={isWavesActive}
              cloudsEnabled={isCloudsActive}
              rainSimEnabled={isRainSimActive}
              centerTrigger={centerMapTrigger}
              isRadioOpen={isRadioOpen}
              onToggleRadio={() => setIsRadioOpen((prev) => !prev)}
              activeMusicCategory={activeMusicCategory}
              onSelectMusicCategory={setActiveMusicCategory}
              selectedRadioEraId={selectedRadioEraId}
              onSelectRadioEra={setSelectedRadioEraId}
              globeTextureMode={globeTextureMode}
              globeClouds={isGlobeCloudsActive}
              globeAutoRotate={isGlobeAutoRotateActive}
              globeBorders={isGlobeBordersActive}
              globePinMode={globePinMode}
              isGlobeTelemetryOpen={isGlobeTelemetryOpen}
              onToggleGlobeTelemetry={() => setIsGlobeTelemetryOpen((prev) => !prev)}
              focusedStateId={focusedStateId}
              onFocusStateHandled={() => setFocusedStateId(null)}
              onHoverStateChange={setHoveredStateId}
              biodiversityKingdom={biodiversityKingdom}
              onBiodiversityKingdomChange={setBiodiversityKingdom}
              biodiversityBiome={biodiversityBiome}
              onBiodiversityBiomeChange={setBiodiversityBiome}
              isBiodiversityThreatenedOnly={isBiodiversityThreatenedOnly}
              onToggleBiodiversityThreatenedOnly={() => setIsBiodiversityThreatenedOnly((p) => !p)}
              isBiodiversityEndemicOnly={isBiodiversityEndemicOnly}
              onToggleBiodiversityEndemicOnly={() => setIsBiodiversityEndemicOnly((p) => !p)}
              isBiodiversityPanelOpen={isBiodiversityPanelOpen}
              onToggleBiodiversityPanel={() => setIsBiodiversityPanelOpen((p) => !p)}
              geopoliticaMetric={geopoliticaMetric}
              onGeopoliticaMetricChange={setGeopoliticaMetric}
              isGeopoliticaPanelOpen={isGeopoliticaPanelOpen}
              onToggleGeopoliticaPanel={() => setIsGeopoliticaPanelOpen((p) => !p)}
            />
          </div>

        ) : (
          /* Insignias Sanctuary View (Codex Route) */
          <CodexInsignias
            progress={progress}
            lang={lang}
            onNavigateToState={(stateId) => {
              const found = GUARDIANS_DATA.find((g) => g.id === stateId);
              if (found) {
                handleSelectGuardian(found);
              }
            }}
            onReadRelic={handleReadRelic}
            onBackToMap={handleBackToMap}
          />
        )}
      </main>

      {/* Settings & Audio Control Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenApiStatus={() => setIsApiStatusOpen(true)}
        showFps={showFps}
        onToggleFps={() => setShowFps((prev) => !prev)}
      />

      {/* API Telemetry & Status Modal */}
      <ApiStatusModal
        isOpen={isApiStatusOpen}
        onClose={() => setIsApiStatusOpen(false)}
      />

      {/* Saiba Mais: Filosofia, Fontes de Dados, Capacidades e Direitos Autorais Modal */}
      <AboutInfoModal
        isOpen={isAboutInfoOpen}
        onClose={() => setIsAboutInfoOpen(false)}
      />

      {/* BrQuest Hub Modal: Grande Prova do Brasil & Desafios Multidisciplinares */}
      <BrQuestHubModal
        isOpen={isBrQuestHubOpen}
        initialPillar={brQuestInitialPillar}
        onClose={() => {
          setIsBrQuestHubOpen(false);
          setBrQuestInitialPillar(null);
        }}
        onSelectGuardian={(g) => {
          setIsBrQuestHubOpen(false);
          setBrQuestInitialPillar(null);
          handleSelectGuardian(g);
        }}
        onGainXp={(xp) => handleBrQuestComplete(xp, Math.round(xp / 75))}
        playerLevel={progress.level}
        playerXp={progress.xp}
      />

      {/* Dynamic Application Footer: [ Logo BR Quest | Conteúdo Dinâmico Auxiliar | Ícone Saiba+ | FPS Swap | APIs ] */}
      <DynamicAppFooter
        mainMode={mainMode}
        activeTab={activeTab}
        activeGuardian={activeGuardian}
        completedStateIds={progress.completedStateIds}
        unlockedInsigniaCount={progress.unlockedInsigniaIds.length}
        hoveredStateId={hoveredStateId}
        selectedStateId={selectedStateId}
        onStateHover={(id) => setHoveredStateId(id)}
        onStateClick={(id) => {
          const found = GUARDIANS_DATA.find((g) => g.id === id);
          if (found) {
            handleSelectGuardian(found);
          }
        }}
        onOpenAboutInfo={() => setIsAboutInfoOpen(true)}
        onNavigateHome={() => {
          setActiveGuardian(null);
          setActiveTab('map');
        }}
        showFps={showFps}
        onToggleFps={() => setShowFps((prev) => !prev)}
        onOpenApiStatus={() => setIsApiStatusOpen(true)}
        climateMode={climateMode}
        onOpenObservatorio={() => setIsObservatorioOpen((prev) => !prev)}
        isObservatorioOpen={isObservatorioOpen}
        avgTempBrazil={climateTelemetry.avgTempBrazil}
        maxTempState={climateTelemetry.maxTempState}
        minTempState={climateTelemetry.minTempState}
        climateLastUpdated={climateTelemetry.lastUpdated}
        isRainSimActive={isRainSimActive}
        onToggleRainSim={() => setIsRainSimActive((prev) => !prev)}
        isCloudsActive={isCloudsActive}
        onToggleClouds={() => setIsCloudsActive((prev) => !prev)}
        isWavesActive={isWavesActive}
        onToggleWaves={() => setIsWavesActive((prev) => !prev)}
        isAtmosphereActive={isAtmosphereActive}
        onToggleAtmosphere={() => setIsAtmosphereActive((prev) => !prev)}
        timeOverride={celestialTimeOverride}
        onTimeOverrideChange={setCelestialTimeOverride}
        onToggleRadio={() => setIsRadioOpen((prev) => !prev)}
        geopoliticaMetric={geopoliticaMetric}
        onOpenBrQuestHub={() => setIsBrQuestHubOpen(true)}
      />
    </div>
  );
}

export default App;
