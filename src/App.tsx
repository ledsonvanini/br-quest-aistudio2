import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IsometricMapCanvas } from './components/IsometricMapCanvas';
import { GuardianDialog } from './components/GuardianDialog';
import { CodexInsignias } from './components/CodexInsignias';
import { SettingsModal } from './components/SettingsModal';
import { GuardianData, UserProgress, Language } from './types';
import { loadUserProgress, saveUserProgress, calculateLevel } from './lib/storage';
import { audioEngine } from './lib/audioSynth';
import { Sparkles } from 'lucide-react';

export function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'map' | 'insignias'>('map');
  const [activeGuardian, setActiveGuardian] = useState<GuardianData | null>(null);
  const [lang, setLang] = useState<Language>('pt');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Save progress on change & start audio on initial interaction
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  useEffect(() => {
    audioEngine.autoStartBgmOnFirstInteraction();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
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
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col">
        
        {/* Interactive RPG Map View */}
        {activeTab === 'map' && (
          <div className="flex-1 w-full flex flex-col">
            <IsometricMapCanvas
              completedStateIds={progress.completedStateIds}
              unlockedInsigniaIds={progress.unlockedInsigniaIds}
              onSelectGuardian={(guardian) => setActiveGuardian(guardian)}
              lang={lang}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
        )}

        {/* Insignias Sanctuary View */}
        {activeTab === 'insignias' && (
          <CodexInsignias
            progress={progress}
            lang={lang}
          />
        )}
      </main>

      {/* Guardian Interactive Dialog Modal */}
      {activeGuardian && (
        <GuardianDialog
          guardian={activeGuardian}
          isCompleted={progress.completedStateIds.includes(activeGuardian.id)}
          hasInsignia={progress.unlockedInsigniaIds.includes(activeGuardian.id)}
          onClose={() => setActiveGuardian(null)}
          onCompleteQuiz={handleCompleteQuiz}
          onUnlockInsignia={handleUnlockInsignia}
          lang={lang}
        />
      )}

      {/* Settings & Audio Control Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-amber-500/30 py-4 px-4 text-center text-xs font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2">
            <span>🇧🇷</span>
            <span className="font-bold text-amber-400">Símbolos BR</span>
            <span>— Sistema Gamificado dos 27 Guardiões e Estados Brasileiros</span>
          </div>
          <div className="text-amber-400/80 text-[11px]">
            Guerreiros do Conhecimento, Hinos, Bandeiras, Fauna & Culinária
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
