import React, { useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { X, Sparkles, Star, TrendingUp, Settings, Shield, Compass } from 'lucide-react';
import { ExplorerWelcomeBanner } from './tabs/ExplorerWelcomeBanner';
import { ExplorerOverviewTab } from './tabs/ExplorerOverviewTab';
import { ExplorerFavoritesTab } from './tabs/ExplorerFavoritesTab';
import { ExplorerHistoryTab } from './tabs/ExplorerHistoryTab';
import { ExplorerPreferencesTab } from './tabs/ExplorerPreferencesTab';
import { ExplorerIdentityTab } from './tabs/ExplorerIdentityTab';
import { BrazilBiome } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
  completedStatesCount?: number;
  dailyStreak?: number;
  onNavigateToState?: (stateId: string) => void;
}

export type ExplorerTabId = 'overview' | 'favorites' | 'history' | 'preferences' | 'identity';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
  completedStatesCount = 0,
  dailyStreak = 1,
  onNavigateToState,
}) => {
  const { user, isGuest, preferences, updatePreferences, vendorName } = useAuth();
  const [activeTab, setActiveTab] = useState<ExplorerTabId>('overview');

  if (!isOpen) return null;

  const currentFavorites = preferences?.favorites || {
    biomes: ['Amazônia', 'Mata Atlântica'] as BrazilBiome[],
    speciesIds: ['onca-pintada', 'mico-leao-dourado', 'pau-brasil'],
    stateIds: ['AM', 'RJ', 'BA'],
  };

  const handleToggleBiome = async (biome: BrazilBiome) => {
    const list = currentFavorites.biomes.includes(biome)
      ? currentFavorites.biomes.filter((b) => b !== biome)
      : [...currentFavorites.biomes, biome];

    await updatePreferences({
      favorites: { ...currentFavorites, biomes: list },
    });
  };

  const handleToggleSpecies = async (speciesId: string) => {
    const list = currentFavorites.speciesIds.includes(speciesId)
      ? currentFavorites.speciesIds.filter((s) => s !== speciesId)
      : [...currentFavorites.speciesIds, speciesId];

    await updatePreferences({
      favorites: { ...currentFavorites, speciesIds: list },
    });
  };

  const handleToggleState = async (stateId: string) => {
    const list = currentFavorites.stateIds.includes(stateId)
      ? currentFavorites.stateIds.filter((st) => st !== stateId)
      : [...currentFavorites.stateIds, stateId];

    await updatePreferences({
      favorites: { ...currentFavorites, stateIds: list },
    });
  };

  return (
    <div
      id="modal-auth-backdrop"
      className="modal-auth-backdrop fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-auth-container"
        className="modal-auth-container painel-explorador-unificado relative w-[96vw] max-w-6xl h-[92vh] max-h-[94vh] bg-stone-900/98 border border-amber-500/40 rounded-3xl shadow-2xl p-4 sm:p-6 text-stone-100 font-sans flex flex-col overflow-hidden"
      >
        {/* Botão Fechar no Topo Direito */}
        <button
          id="btn-fechar-modal-auth"
          onClick={onClose}
          className="btn-fechar-modal-auth absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-2 rounded-xl hover:bg-stone-800 transition z-20"
          title="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Banner Superior de Boas-Vindas & Status Pessoal */}
        <ExplorerWelcomeBanner
          user={user}
          isGuest={isGuest}
          playerLevel={playerLevel}
          playerXp={playerXp}
          unlockedInsigniaCount={unlockedInsigniaCount}
          completedStatesCount={completedStatesCount}
          dailyStreak={dailyStreak}
          vendorName={vendorName}
        />

        {/* 2. Menu de Navegação em Abas com Ícones Claros */}
        <div className="menu-abas-explorador grid grid-cols-5 gap-1.5 p-1.5 bg-stone-950/90 rounded-2xl border border-stone-800 flex-shrink-0 text-xs mb-3.5">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`btn-aba-visao-geral py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 font-bold transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visão Geral</span>
            <span className="sm:hidden">Início</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`btn-aba-favoritos py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 font-bold transition ${
              activeTab === 'favorites'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fauna, Flora & UFs</span>
            <span className="sm:hidden">Afinidades</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`btn-aba-historico py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 font-bold transition ${
              activeTab === 'history'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Jornada & XP</span>
            <span className="sm:hidden">Progresso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`btn-aba-preferencias py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 font-bold transition ${
              activeTab === 'preferences'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajustes & Som</span>
            <span className="sm:hidden">Ajustes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`btn-aba-identidade py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 font-bold transition ${
              activeTab === 'identity'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Minha Conta</span>
            <span className="sm:hidden">Conta</span>
          </button>
        </div>

        {/* 3. Área de Conteúdo da Aba Ativa com Scroll Suave */}
        <div className="conteudo-aba flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
          {activeTab === 'overview' && (
            <ExplorerOverviewTab
              favorites={currentFavorites}
              playerLevel={playerLevel}
              completedStatesCount={completedStatesCount}
              unlockedInsigniaCount={unlockedInsigniaCount}
              onNavigateToState={(stateId) => {
                onClose();
                onNavigateToState?.(stateId);
              }}
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'favorites' && (
            <ExplorerFavoritesTab
              favoriteBiomes={currentFavorites.biomes}
              favoriteSpeciesIds={currentFavorites.speciesIds}
              favoriteStateIds={currentFavorites.stateIds}
              onToggleBiome={handleToggleBiome}
              onToggleSpecies={handleToggleSpecies}
              onToggleState={handleToggleState}
              onNavigateToState={(stateId) => {
                onClose();
                onNavigateToState?.(stateId);
              }}
            />
          )}

          {activeTab === 'history' && (
            <ExplorerHistoryTab
              playerLevel={playerLevel}
              playerXp={playerXp}
              unlockedInsigniaCount={unlockedInsigniaCount}
              completedStatesCount={completedStatesCount}
              dailyStreak={dailyStreak}
            />
          )}

          {activeTab === 'preferences' && (
            <ExplorerPreferencesTab
              preferences={preferences}
              onUpdatePreferences={updatePreferences}
            />
          )}

          {activeTab === 'identity' && (
            <ExplorerIdentityTab
              playerLevel={playerLevel}
              playerXp={playerXp}
              unlockedInsigniaCount={unlockedInsigniaCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};
