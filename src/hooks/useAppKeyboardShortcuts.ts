/**
 * Hook Global de Atalhos de Teclado (Ctrl+K para busca e Esc para reset)
 * Projeto: BR Quest
 */

import { useEffect } from 'react';
import { AppModalsState } from './useAppModals';
import { audioEngine } from '../lib/audioSynth';

interface AppKeyboardShortcutsOptions {
  modals: AppModalsState;
  onResetView?: () => void;
  selectedStateId?: string | null;
  onClearSelectedState?: () => void;
}

export function useAppKeyboardShortcuts({
  modals,
  onResetView,
  selectedStateId,
  onClearSelectedState,
}: AppKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Busca Global via Ctrl+K ou Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modals.openSearchSelector();
        return;
      }

      // 2. Escape: Fecha modais abertos ou reseta foco de estado
      if (e.key === 'Escape') {
        if (modals.isSearchSelectorOpen) {
          e.preventDefault();
          modals.closeSearchSelector();
          return;
        }

        if (modals.isAnyModalOpen) {
          e.preventDefault();
          modals.closeAllModals();
          return;
        }

        if (selectedStateId) {
          e.preventDefault();
          audioEngine.playSfx('click');
          onClearSelectedState?.();
          onResetView?.();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modals, onResetView, selectedStateId, onClearSelectedState]);
}
