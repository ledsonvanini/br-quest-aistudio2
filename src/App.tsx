import React, { useState, useEffect } from 'react';
import { TopGlobalNavMenu, AppMainMode } from './components/TopGlobalNavMenu';
import { IsometricMapCanvas } from './components/IsometricMapCanvas';
import { GuardianRPGScene } from './components/GuardianRPGScene';
import { CodexInsignias } from './components/CodexInsignias';
import { SettingsModal } from './components/SettingsModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { AboutInfoModal } from './components/AboutInfoModal';
import { DynamicAppFooter } from './components/DynamicAppFooter';
import { FpsCounterWidget } from './components/FpsCounterWidget';
import { GuardianData, UserProgress, Language, TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme } from './types';
import { loadUserProgress, saveUserProgress, calculateLevel } from './lib/storage';
import { audioEngine } from './lib/audioSynth';
import { GUARDIANS_DATA } from './data/guardiansData';
import { Sparkles, Activity, Gauge } from 'lucide-react';
import { loadBrazilGeoData } from './lib/geoDataLoader';
import { ClimateMode } from './components/map/ClimatePhenomenaLayer';
import { fetchLiveClimateTelemetry } from './services/climateService';

export function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'map' | 'insignias'>('map');
  const [activeGuardian, setActiveGuardian] = useState<GuardianData | null>(null);
  const [lang, setLang] = useState<Language>('pt');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState<boolean>(false);
  const [isAboutInfoOpen, setIsAboutInfoOpen] = useState<boolean>(false);
  const [showFps, setShowFps] = useState<boolean>(false);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>('DF');

  // App Modes: 1º Aventura/Navegação (default on page load), 2º Clima, 3º Musicalidades
  const [mainMode, setMainMode] = useState<AppMainMode>('aventura');
  const [terrainProvider, setTerrainProvider] = useState<TerrainTileProvider>('shaded_relief');
  const [visualStyle, setVisualStyle] = useState<MapVisualStyle>('tiles');
  const [choroplethSubTheme, setChoroplethSubTheme] = useState<ChoroplethSubTheme>('regions');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('todos');
  const [hoveredRegionFilter, setHoveredRegionFilter] = useState<string | null>(null);
  const [showNeighbors, setShowNeighbors] = useState<boolean>(false);
  const [isObservatorioOpen, setIsObservatorioOpen] = useState<boolean>(false);
  const [climateMode, setClimateMode] = useState<ClimateMode>('temperaturas_frentes');
  const [climateTelemetry, setClimateTelemetry] = useState<{
    avgTempBrazil: number;
    maxTempState: { stateId: string; temp: number };
    minTempState: { stateId: string; temp: number };
  }>({
    avgTempBrazil: 27.4,
    maxTempState: { stateId: 'MT', temp: 35.1 },
    minTempState: { stateId: 'RS', temp: 17.5 },
  });

  // Preload live climate telemetry for dynamic footer
  useEffect(() => {
    fetchLiveClimateTelemetry()
      .then((res) => {
        if (res) {
          setClimateTelemetry({
            avgTempBrazil: res.avgTempBrazil,
            maxTempState: res.maxTempState,
            minTempState: res.minTempState,
          });
        }
      })
      .catch(() => {});
  }, []);

  const [isRainSimActive, setIsRainSimActive] = useState<boolean>(false);
  const [isCloudsActive, setIsCloudsActive] = useState<boolean>(true);
  const [isWavesActive, setIsWavesActive] = useState<boolean>(false);
  const [isAtmosphereActive, setIsAtmosphereActive] = useState<boolean>(true);
  const [celestialTimeOverride, setCelestialTimeOverride] = useState<'day' | 'night' | 'auto'>('auto');

  const handleCycleCelestial = () => {
    setCelestialTimeOverride((curr) => {
      if (curr === 'day') return 'night';
      if (curr === 'night') return 'auto';
      return 'day';
    });
    setIsAtmosphereActive(true);
  };
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(true);
  const [activeMusicCategory, setActiveMusicCategory] = useState<'state_anthems' | 'top5' | 'national'>('state_anthems');
  const [selectedRadioEraId, setSelectedRadioEraId] = useState<string>('catedral_1930_1940');
  const [focusedStateId, setFocusedStateId] = useState<string | null>(null);
  const [centerMapTrigger, setCenterMapTrigger] = useState<number>(0);

  const handleSelectMainMode = (newMode: AppMainMode) => {
    setMainMode(newMode);

    if (newMode === 'aventura') {
      // Modo Aventura Padrão: Apenas nuvens ativas; textura shaded_relief; sem vizinhos; astro em auto
      setTerrainProvider('shaded_relief');
      setVisualStyle('tiles');
      setChoroplethSubTheme('regions');
      setIsCloudsActive(true);
      setIsRainSimActive(false);
      setIsWavesActive(false);
      setIsAtmosphereActive(true);
      setCelestialTimeOverride('auto');
      setShowNeighbors(false);
      setSelectedRegionFilter('todos');
      setIsObservatorioOpen(false);
    } else if (newMode === 'clima') {
      // Modo Clima Padrão: Sol automático de Brasília, nuvens, ondas, cor neutra para América do Sul; Observatório Ambiental desmarcado por padrão
      setTerrainProvider('muted_gray');
      setVisualStyle('tiles');
      setClimateMode('temperaturas_frentes');
      setIsCloudsActive(true);
      setIsAtmosphereActive(true);
      setCelestialTimeOverride('auto');
      setIsWavesActive(true);
      setIsRainSimActive(false);
      setShowNeighbors(false);
      setSelectedRegionFilter('todos');
      setIsObservatorioOpen(false);
    } else if (newMode === 'musicalidades') {
      // Modo Musicalidades Padrão: Rádio aberto, sol e nuvens leves, ondas
      setTerrainProvider('shaded_relief');
      setVisualStyle('tiles');
      setIsCloudsActive(true);
      setIsAtmosphereActive(true);
      setCelestialTimeOverride('auto');
      setIsWavesActive(true);
      setIsRainSimActive(false);
      setIsRadioOpen(true);
      setActiveMusicCategory('state_anthems');
      setShowNeighbors(false);
      setSelectedRegionFilter('todos');
      setIsObservatorioOpen(false);
    }

    if (activeTab !== 'map') {
      setActiveTab('map');
      window.location.hash = '#/mapa';
    }
  };

  // Synchronize hash URL with state route (e.g., #/estado/rs, #/mapa, #/insignias)
  useEffect(() => {
    // Preload GeoJSON cartographic data in background
    loadBrazilGeoData().catch(() => {});

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

  const handleCompleteQuiz = (xpEarned: number, correctCount: number) => {
    if (!activeGuardian) return;

    setProgress((prev) => {
      const isNewState = !prev.completedStateIds.includes(activeGuardian.id);
      const updatedStates = isNewState
        ? [...prev.completedStateIds, activeGuardian.id]
        : prev.completedStateIds;

      const newXp = prev.xp + xpEarned;
      const oldLevel = calculateLevel(prev.xp).level;
      const newLevel = calculateLevel(newXp).level;

      if (newLevel > oldLevel) {
        audioEngine.playSfx('levelUp');
        showNotification(`🎉 Nível Superior! Você alcançou o Nível ${newLevel}!`);
      } else if (xpEarned > 0) {
        showNotification(`✨ Desafio de ${activeGuardian.stateNamePt} concluído! +${xpEarned} XP`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedStateIds: updatedStates,
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

      return {
        ...prev,
        xp: newXp,
        level: newLevelData.level,
        readPergamentIds: updatedRead,
      };
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
          onTerrainProviderChange={setTerrainProvider}
          visualStyle={visualStyle}
          onVisualStyleChange={setVisualStyle}
          choroplethSubTheme={choroplethSubTheme}
          onChoroplethSubThemeChange={setChoroplethSubTheme}
          selectedRegionFilter={selectedRegionFilter}
          onSelectRegionFilter={setSelectedRegionFilter}
          onHoverRegionFilter={setHoveredRegionFilter}
          showNeighbors={showNeighbors}
          onToggleNeighbors={() => setShowNeighbors((prev) => !prev)}
          isObservatorioOpen={isObservatorioOpen}
          onToggleObservatorio={() => setIsObservatorioOpen((prev) => !prev)}
          onNavigateToSanctuary={() => {
            setActiveGuardian(null);
            setActiveTab('insignias');
            window.location.hash = '#/insignias';
          }}
          playerLevel={progress.level}
          playerXp={progress.xp}
          completedStateCount={progress.completedStateIds.length}
          unlockedInsigniaCount={progress.unlockedInsigniaIds.length}
          climateMode={climateMode}
          onClimateModeChange={setClimateMode}
          isRainSimActive={isRainSimActive}
          onToggleRainSim={() => setIsRainSimActive((prev) => !prev)}
          isCloudsActive={isCloudsActive}
          onToggleClouds={() => setIsCloudsActive((prev) => !prev)}
          isWavesActive={isWavesActive}
          onToggleWaves={() => setIsWavesActive((prev) => !prev)}
          isAtmosphereActive={isAtmosphereActive}
          onToggleAtmosphere={handleCycleCelestial}
          celestialTimeOverride={celestialTimeOverride}
          onFocusState={(stateId) => setFocusedStateId(stateId)}
          isRadioOpen={isRadioOpen}
          onToggleRadio={() => setIsRadioOpen((prev) => !prev)}
          activeMusicCategory={activeMusicCategory}
          onSelectMusicCategory={setActiveMusicCategory}
          selectedRadioEraId={selectedRadioEraId}
          onSelectRadioEra={setSelectedRadioEraId}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onResetView={() => setCenterMapTrigger((prev) => prev + 1)}
          onResetViewIfNotCentered={() => setCenterMapTrigger((prev) => prev + 1)}
          hoveredStateId={hoveredStateId}
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
              onToggleNeighbors={() => setShowNeighbors((prev) => !prev)}
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
              focusedStateId={focusedStateId}
              onFocusStateHandled={() => setFocusedStateId(null)}
              onHoverStateChange={setHoveredStateId}
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

      {/* Real-time FPS & Performance Telemetry Widget */}
      <FpsCounterWidget
        isVisible={showFps}
        onToggleVisibility={() => setShowFps(false)}
      />

      {/* Dynamic Application Footer: [ Logo BR Quest | Conteúdo Dinâmico Auxiliar | Ícone Saiba+ | FPS | APIs | Bússola ] */}
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
        onToggleRadio={() => setIsRadioOpen((prev) => !prev)}
      />
    </div>
  );
}

export default App;
