/**
 * Container e Apresentador Central dos Modais Secundários da Aplicação
 * Projeto: BR Quest
 */

import React from 'react';
import { SettingsModal } from '../SettingsModal';
import { UserProfileModal } from '../auth/UserProfileModal';
import { ApiStatusModal } from '../ApiStatusModal';
import { AboutInfoModal } from '../AboutInfoModal';
import { BrQuestHubModal } from '../quest/BrQuestHubModal';
import { DailyTipsModal } from '../quest/DailyTipsModal';
import { StateSearchSelectorModal } from '../search/StateSearchSelectorModal';
import { AppModalsState } from '../../hooks/useAppModals';
import { UserProgress, GuardianData } from '../../types';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { calculateLevel } from '../../lib/storage';
import { Sparkles, X } from 'lucide-react';

interface AppModalsContainerProps {
  modals: AppModalsState;
  progress: UserProgress;
  dailyTipsController: any;
  userLocation: { stateId: string; stateName: string; regionId: string } | null;
  onSelectGuardian: (guardian: GuardianData) => void;
  onGainXp: (xp: number, reason?: string) => void;
  onBrQuestComplete: (xp: number, stars: number) => void;
  onTeleportToState: (stateId: string) => void;
}

export const AppModalsContainer: React.FC<AppModalsContainerProps> = ({
  modals,
  progress,
  dailyTipsController,
  userLocation,
  onSelectGuardian,
  onGainXp,
  onBrQuestComplete,
  onTeleportToState,
}) => {
  return (
    <>
      {/* 1. Modal de Configurações e Áudio */}
      <SettingsModal
        isOpen={modals.isSettingsOpen}
        onClose={modals.closeSettings}
        onOpenApiStatus={modals.openApiStatus}
        showFps={modals.showFps}
        onToggleFps={modals.toggleFps}
        onOpenDailyTips={() => {
          modals.closeSettings();
          modals.openDailyTips();
        }}
      />

      {/* 2. Modal de Perfil do Usuário e Autenticação */}
      <UserProfileModal
        isOpen={modals.isUserProfileOpen}
        onClose={modals.closeUserProfile}
        playerLevel={calculateLevel(progress.xp).level}
        playerXp={progress.xp}
        unlockedInsigniaCount={progress.unlockedInsigniaIds.length}
        completedStatesCount={progress.completedStateIds.length}
        dailyStreak={progress.dailyStreak || 1}
        onNavigateToState={(stateId) => {
          const g = GUARDIANS_DATA.find((item) => item.id === stateId);
          if (g) onSelectGuardian(g);
        }}
      />

      {/* 3. Modal de Telemetria e Status da API */}
      <ApiStatusModal
        isOpen={modals.isApiStatusOpen}
        onClose={modals.closeApiStatus}
      />

      {/* 4. Modal Saiba Mais / Filosofia / Direitos */}
      <AboutInfoModal
        isOpen={modals.isAboutInfoOpen}
        onClose={modals.closeAboutInfo}
      />

      {/* 5. Modal BrQuest Hub (Desafios BNCC e Provas Nacionais) */}
      <BrQuestHubModal
        isOpen={modals.isBrQuestHubOpen}
        initialPillar={modals.brQuestInitialPillar}
        onClose={modals.closeBrQuestHub}
        onSelectGuardian={(guardianId: string) => {
          modals.closeBrQuestHub();
          const found = GUARDIANS_DATA.find((g) => g.id === guardianId);
          if (found) onSelectGuardian(found);
        }}
        onGainXp={(xp: number) => onBrQuestComplete(xp, Math.round(xp / 75))}
        playerLevel={progress.level}
        playerXp={progress.xp}
        completedStatesCount={progress.completedStateIds.length}
        dailyStreak={progress.dailyStreak || 1}
        userLocation={userLocation}
      />

      {/* 6. Modal 5 Dicas do Dia: Você Sabia? */}
      <DailyTipsModal
        isOpen={modals.isDailyTipsOpen}
        onClose={modals.closeDailyTips}
        onTeleportToState={onTeleportToState}
        onGainXp={onGainXp}
        dailyTipsController={dailyTipsController}
      />

      {/* 7. Modal de Busca Rápida de Estados (Ctrl+K) */}
      <StateSearchSelectorModal
        isOpen={modals.isSearchSelectorOpen}
        onClose={modals.closeSearchSelector}
        completedStateIds={progress.completedStateIds}
        onSelectState={(stateId) => {
          modals.closeSearchSelector();
          const found = GUARDIANS_DATA.find((g) => g.id === stateId);
          if (found) onSelectGuardian(found);
        }}
      />

      {/* 8. Toast de Notificação do Sistema */}
      {modals.notification && (
        <div className="toast-notificacao-container fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
          <div className="bg-slate-900/95 border border-cyan-500/50 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
            <span className="text-sm font-semibold text-slate-100">{modals.notification}</span>
            <button
              onClick={() => modals.setNotification(null)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
