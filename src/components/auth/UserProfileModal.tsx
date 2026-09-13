import React, { useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { User, X, Star, TrendingUp, Settings, Shield } from 'lucide-react';
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
}

type ExplorerTabId = 'favorites' | 'history' | 'preferences' | 'identity';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
  completedStatesCount = 0,
  dailyStreak = 1,
}) => {
  const { preferences, updatePreferences, vendorName } = useAuth();
  const [activeTab, setActiveTab] = useState<ExplorerTabId>('favorites');

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
      className="modal-auth-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-auth-container"
        className="modal-auth-container painel-explorador-unificado relative w-[92vw] sm:w-[85vw] max-w-5xl h-[85vh] max-h-[85vh] bg-stone-900/95 border border-amber-500/30 rounded-2xl shadow-2xl p-5 sm:p-7 text-stone-100 font-sans flex flex-col"
      >
        {/* Botão Fechar */}
        <button
          id="btn-fechar-modal-auth"
          onClick={onClose}
          className="btn-fechar-modal-auth absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3 flex-shrink-0">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-wide text-amber-300">
              Painel do Explorador
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Persistência Ativa:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                {vendorName}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Abas (Tabs) */}
        <div className="menu-abas-explorador grid grid-cols-4 gap-1.5 my-3.5 p-1 bg-stone-950/80 rounded-xl border border-stone-800 flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`btn-aba-favoritos py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
              activeTab === 'favorites'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Favoritos</span>
            <span className="sm:hidden">Favs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`btn-aba-historico py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
              activeTab === 'history'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Progresso</span>
            <span className="sm:hidden">Hist</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`btn-aba-preferencias py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
              activeTab === 'preferences'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preferências</span>
            <span className="sm:hidden">Prefs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`btn-aba-identidade py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
              activeTab === 'identity'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Identidade</span>
            <span className="sm:hidden">Conta</span>
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="conteudo-aba flex-1 overflow-y-auto pr-1">
          {activeTab === 'favorites' && (
            <ExplorerFavoritesTab
              favoriteBiomes={currentFavorites.biomes}
              favoriteSpeciesIds={currentFavorites.speciesIds}
              favoriteStateIds={currentFavorites.stateIds}
              onToggleBiome={handleToggleBiome}
              onToggleSpecies={handleToggleSpecies}
              onToggleState={handleToggleState}
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
