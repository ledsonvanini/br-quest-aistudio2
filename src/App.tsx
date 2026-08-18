import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IsometricMapCanvas } from './components/IsometricMapCanvas';
import { GuardianRPGScene } from './components/GuardianRPGScene';
import { CodexInsignias } from './components/CodexInsignias';
import { SettingsModal } from './components/SettingsModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { FpsCounterWidget } from './components/FpsCounterWidget';
import { GuardianData, UserProgress, Language } from './types';
import { loadUserProgress, saveUserProgress, calculateLevel } from './lib/storage';
import { audioEngine } from './lib/audioSynth';
import { GUARDIANS_DATA } from './data/guardiansData';
import { Sparkles, Activity, Gauge } from 'lucide-react';
import { loadBrazilGeoData } from './lib/geoDataLoader';

export function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'map' | 'insignias'>('map');
  const [activeGuardian, setActiveGuardian] = useState<GuardianData | null>(null);
  const [lang, setLang] = useState<Language>('pt');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState<boolean>(false);
  const [isClimateActive, setIsClimateActive] = useState<boolean>(false);
  const [showFps, setShowFps] = useState<boolean>(false);

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

      {/* Main RPG Header (Hidden when inside state RPG view or Climate Mode) */}
      {!activeGuardian && (
        <Header
          progress={progress}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'insignias') {
              setActiveGuardian(null);
              window.location.hash = '#/insignias';
            } else {
              window.location.hash = '#/mapa';
            }
          }}
          lang={lang}
          setLang={setLang}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isClimateActive={isClimateActive}
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
              onClimateActiveChange={setIsClimateActive}
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
      />

      {/* API Telemetry & Status Modal */}
      <ApiStatusModal
        isOpen={isApiStatusOpen}
        onClose={() => setIsApiStatusOpen(false)}
      />

      {/* Real-time FPS & Performance Telemetry Widget */}
      <FpsCounterWidget
        isVisible={showFps}
        onToggleVisibility={() => setShowFps(false)}
      />

      {/* Footer */}
      <footer className="rodape-aplicacao shrink-0 bg-slate-950 text-slate-400 border-t border-amber-500/30 py-2 px-4 text-center text-xs font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2">
            <span>🇧🇷</span>
            <span className="font-bold text-amber-400">BR Quest</span>
            <span className="hidden sm:inline">— Os Guardiões da Cultura do Brasil (RPG & Mapa Ortogonal 3D)</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* FPS / Frame Rate Toggle Button */}
            <button
              id="btn-toggle-fps-rodape"
              onClick={() => {
                audioEngine.playSfx('click');
                setShowFps((prev) => !prev);
              }}
              className={`btn-toggle-fps flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition cursor-pointer ${
                showFps
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-700 hover:border-emerald-400/60 text-slate-300 hover:text-emerald-300'
              }`}
              title="Mostrar / Ocultar Medidor de Taxa de Quadros (FPS) em tempo real"
            >
              <Gauge className="w-3 h-3 text-emerald-400" />
              <span>{showFps ? 'FPS: Ativo' : 'Mostrar FPS'}</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playSfx('click');
                setIsApiStatusOpen(true);
              }}
              className="btn-status-api-footer flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition cursor-pointer"
              title="Abrir painel de monitoramento de tráfego e latência de APIs"
            >
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Status API</span>
            </button>

            <div className="text-amber-400/80 text-[11px]">
              Rio Grande do Sul & Pampas • Hinos, Lendas e Insígnias
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
