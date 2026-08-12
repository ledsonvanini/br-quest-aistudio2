import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IsometricMapCanvas } from './components/IsometricMapCanvas';
import { GuardianRPGScene } from './components/GuardianRPGScene';
import { CodexInsignias } from './components/CodexInsignias';
import { SettingsModal } from './components/SettingsModal';
import { GuardianData, UserProgress, Language } from './types';
import { loadUserProgress, saveUserProgress, calculateLevel } from './lib/storage';
import { audioEngine } from './lib/audioSynth';
import { GUARDIANS_DATA } from './data/guardiansData';
import { Sparkles } from 'lucide-react';

export function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'map' | 'insignias'>('map');
  const [activeGuardian, setActiveGuardian] = useState<GuardianData | null>(null);
  const [lang, setLang] = useState<Language>('pt');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Synchronize hash URL with state route (e.g., #/state/RS or #/map)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/state/')) {
        const stateId = hash.replace('#/state/', '').toUpperCase();
        const found = GUARDIANS_DATA.find((g) => g.id === stateId);
        if (found) {
          setActiveGuardian(found);
          setActiveTab('map');
          return;
        }
      } else if (hash === '#/insignias') {
        setActiveTab('insignias');
        setActiveGuardian(null);
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
    window.location.hash = `#/state/${guardian.id}`;
  };

  const handleBackToMap = () => {
    audioEngine.playSfx('click');
    setActiveGuardian(null);
    window.location.hash = '#/map';
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
      className={
        activeTab === 'map' && !activeGuardian
          ? 'h-screen h-dvh max-h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950'
          : 'min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950'
      }
    >
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md text-amber-300 font-bold px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-400 text-xs sm:text-sm animate-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main RPG Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'insignias') {
            setActiveGuardian(null);
            window.location.hash = '#/insignias';
          } else {
            window.location.hash = '#/map';
          }
        }}
        lang={lang}
        setLang={setLang}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Container */}
      <main
        className={
          activeTab === 'map' && !activeGuardian
            ? 'flex-1 min-h-0 w-full max-w-7xl mx-auto px-1 sm:px-3 py-1 flex flex-col overflow-hidden relative'
            : 'flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col'
        }
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
            lang={lang}
          />
        ) : activeTab === 'map' ? (
          /* Interactive RPG Map View (Homepage Route) */
          <div className="flex-1 min-h-0 h-full w-full flex flex-col overflow-hidden relative">
            <IsometricMapCanvas
              completedStateIds={progress.completedStateIds}
              unlockedInsigniaIds={progress.unlockedInsigniaIds}
              onSelectGuardian={handleSelectGuardian}
              lang={lang}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
        ) : (
          /* Insignias Sanctuary View (Codex Route) */
          <CodexInsignias progress={progress} lang={lang} />
        )}
      </main>

      {/* Settings & Audio Control Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="shrink-0 bg-slate-950 text-slate-400 border-t border-amber-500/30 py-2 px-4 text-center text-xs font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 font-medium">
          <div className="flex items-center gap-2">
            <span>🇧🇷</span>
            <span className="font-bold text-amber-400">BR Quest</span>
            <span className="hidden sm:inline">— Os Guardiões da Cultura do Brasil (RPG & Mapa Ortogonal 3D)</span>
          </div>
          <div className="text-amber-400/80 text-[11px]">
            Rio Grande do Sul & Pampas • Hinos, Lendas e Insígnias
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
