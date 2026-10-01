/**
 * Hook de Gerenciamento de Progresso do Usuário, XP, Níveis e Guardião Ativo
 * Projeto: BR Quest
 */

import { useState, useCallback } from 'react';
import { UserProgress, GuardianData, Language } from '../types';
import { loadUserProgress, saveUserProgress, calculateLevel } from '../lib/storage';
import { audioEngine } from '../lib/audioSynth';

export function useAppProgression(notify: (msg: string) => void) {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'map' | 'insignias'>('map');
  const [activeGuardian, setActiveGuardian] = useState<GuardianData | null>(null);
  const [lang, setLang] = useState<Language>('pt');

  const handleGainXp = useCallback((xpGain: number, reason?: string) => {
    setProgress((prev) => {
      const newXp = prev.xp + xpGain;
      const oldLevelInfo = calculateLevel(prev.xp);
      const newLevelInfo = calculateLevel(newXp);

      if (newLevelInfo.level > oldLevelInfo.level) {
        audioEngine.playSfx('levelUp');
        notify(`🎉 Parabéns! Você subiu para o Nível ${newLevelInfo.level} (${newLevelInfo.titlePt})!`);
      } else if (reason) {
        notify(`✨ +${xpGain} XP: ${reason}`);
      }

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: newLevelInfo.level,
      };
      saveUserProgress(updated);
      return updated;
    });
  }, [notify]);

  const handleBrQuestComplete = useCallback((earnedXp: number, earnedStars: number) => {
    setProgress((prev) => {
      const newXp = prev.xp + earnedXp;
      const oldLevel = calculateLevel(prev.xp).level;
      const newLevel = calculateLevel(newXp).level;

      if (newLevel > oldLevel) {
        audioEngine.playSfx('levelUp');
        notify(`🎉 Nível ${newLevel} alcançado! Você ganhou ${earnedXp} XP e ${earnedStars} estrelas!`);
      } else {
        notify(`🏆 Quest concluída! +${earnedXp} XP e +${earnedStars} estrelas!`);
      }

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
      saveUserProgress(updated);
      return updated;
    });
  }, [notify]);

  const handleReadRelic = useCallback((relicId: string) => {
    setProgress((prev) => {
      if (prev.unlockedInsigniaIds.includes(relicId)) return prev;
      audioEngine.playSfx('badge');
      notify(`📜 Nova insígnia histórica desbloqueada! (+25 XP)`);
      const newXp = prev.xp + 25;
      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: calculateLevel(newXp).level,
        unlockedInsigniaIds: [...prev.unlockedInsigniaIds, relicId],
      };
      saveUserProgress(updated);
      return updated;
    });
  }, [notify]);

  const handleSelectGuardian = useCallback((guardian: GuardianData) => {
    audioEngine.playSfx('click');
    setActiveGuardian(guardian);
    window.location.hash = `#/guardiao/${guardian.id}`;
  }, []);

  const handleBackToMap = useCallback(() => {
    audioEngine.playSfx('click');
    setActiveGuardian(null);
    setActiveTab('map');
    window.location.hash = '#/mapa';
  }, []);

  return {
    progress,
    setProgress,
    activeTab,
    setActiveTab,
    activeGuardian,
    setActiveGuardian,
    lang,
    setLang,
    handleGainXp,
    handleBrQuestComplete,
    handleReadRelic,
    handleSelectGuardian,
    handleBackToMap,
  };
}
