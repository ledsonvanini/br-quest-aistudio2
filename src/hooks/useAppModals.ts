/**
 * Hook Centralizado para Gerenciamento de Modais e Telas Secundárias do App
 * Projeto: BR Quest
 */

import { useState, useCallback } from 'react';
import { QuestThemePillar } from '../data/brQuestQuestionsData';
import { audioEngine } from '../lib/audioSynth';

export interface AppModalsState {
  isSettingsOpen: boolean;
  isApiStatusOpen: boolean;
  isAboutInfoOpen: boolean;
  isUserProfileOpen: boolean;
  isBrQuestHubOpen: boolean;
  isSearchSelectorOpen: boolean;
  isDailyTipsOpen: boolean;
  showFps: boolean;
  notification: string | null;
  brQuestInitialPillar: QuestThemePillar | 'nacional' | null;

  // Actions
  openSettings: () => void;
  closeSettings: () => void;
  openApiStatus: () => void;
  closeApiStatus: () => void;
  openAboutInfo: () => void;
  closeAboutInfo: () => void;
  openUserProfile: () => void;
  closeUserProfile: () => void;
  openBrQuestHub: (pillar?: QuestThemePillar | 'nacional') => void;
  closeBrQuestHub: () => void;
  openSearchSelector: () => void;
  closeSearchSelector: () => void;
  openDailyTips: () => void;
  closeDailyTips: () => void;
  toggleFps: () => void;
  setNotification: (msg: string | null) => void;
  closeAllModals: () => void;
  isAnyModalOpen: boolean;
}

export function useAppModals(): AppModalsState {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState(false);
  const [isAboutInfoOpen, setIsAboutInfoOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isBrQuestHubOpen, setIsBrQuestHubOpen] = useState(false);
  const [brQuestInitialPillar, setBrQuestInitialPillar] = useState<QuestThemePillar | 'nacional' | null>(null);
  const [isSearchSelectorOpen, setIsSearchSelectorOpen] = useState(false);
  const [isDailyTipsOpen, setIsDailyTipsOpen] = useState(false);
  const [showFps, setShowFps] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const openSettings = useCallback(() => {
    audioEngine.playSfx('click');
    setIsSettingsOpen(true);
  }, []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const openApiStatus = useCallback(() => {
    audioEngine.playSfx('click');
    setIsApiStatusOpen(true);
  }, []);
  const closeApiStatus = useCallback(() => setIsApiStatusOpen(false), []);

  const openAboutInfo = useCallback(() => {
    audioEngine.playSfx('click');
    setIsAboutInfoOpen(true);
  }, []);
  const closeAboutInfo = useCallback(() => setIsAboutInfoOpen(false), []);

  const openUserProfile = useCallback(() => {
    audioEngine.playSfx('click');
    setIsUserProfileOpen(true);
  }, []);
  const closeUserProfile = useCallback(() => setIsUserProfileOpen(false), []);

  const openBrQuestHub = useCallback((pillar?: QuestThemePillar | 'nacional') => {
    audioEngine.playSfx('fanfare');
    setBrQuestInitialPillar(pillar || null);
    setIsBrQuestHubOpen(true);
  }, []);
  const closeBrQuestHub = useCallback(() => setIsBrQuestHubOpen(false), []);

  const openSearchSelector = useCallback(() => {
    audioEngine.playSfx('click');
    setIsSearchSelectorOpen(true);
  }, []);
  const closeSearchSelector = useCallback(() => setIsSearchSelectorOpen(false), []);

  const openDailyTips = useCallback(() => {
    audioEngine.playSfx('click');
    setIsDailyTipsOpen(true);
  }, []);
  const closeDailyTips = useCallback(() => setIsDailyTipsOpen(false), []);

  const toggleFps = useCallback(() => setShowFps((prev) => !prev), []);

  const closeAllModals = useCallback(() => {
    setIsSettingsOpen(false);
    setIsApiStatusOpen(false);
    setIsAboutInfoOpen(false);
    setIsUserProfileOpen(false);
    setIsBrQuestHubOpen(false);
    setIsSearchSelectorOpen(false);
    setIsDailyTipsOpen(false);
  }, []);

  const isAnyModalOpen = isSettingsOpen || isApiStatusOpen || isAboutInfoOpen || 
    isUserProfileOpen || isBrQuestHubOpen || isSearchSelectorOpen || isDailyTipsOpen;

  return {
    isSettingsOpen,
    isApiStatusOpen,
    isAboutInfoOpen,
    isUserProfileOpen,
    isBrQuestHubOpen,
    isSearchSelectorOpen,
    isDailyTipsOpen,
    showFps,
    notification,
    brQuestInitialPillar,

    openSettings,
    closeSettings,
    openApiStatus,
    closeApiStatus,
    openAboutInfo,
    closeAboutInfo,
    openUserProfile,
    closeUserProfile,
    openBrQuestHub,
    closeBrQuestHub,
    openSearchSelector,
    closeSearchSelector,
    openDailyTips,
    closeDailyTips,
    toggleFps,
    setNotification,
    closeAllModals,
    isAnyModalOpen,
  };
}
