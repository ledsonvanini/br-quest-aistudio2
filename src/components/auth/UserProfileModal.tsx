import React, { useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import {
  X,
  Compass,
  Target,
  TreePine,
  MapPin,
  Layers,
  Sparkles,
  TrendingUp,
  Zap,
  Award,
  Settings,
  Volume2,
  Eye,
  User,
  Shield,
  Cloud,
  KeyRound,
} from 'lucide-react';
import { UserProfileSidebar } from './UserProfileSidebar';
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

interface SubTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

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
  const { user, isGuest, preferences, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState<ExplorerTabId>('overview');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');

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
    await updatePreferences({ favorites: { ...currentFavorites, biomes: list } });
  };

  const handleToggleSpecies = async (speciesId: string) => {
    const list = currentFavorites.speciesIds.includes(speciesId)
      ? currentFavorites.speciesIds.filter((s) => s !== speciesId)
      : [...currentFavorites.speciesIds, speciesId];
    await updatePreferences({ favorites: { ...currentFavorites, speciesIds: list } });
  };

  const handleToggleState = async (stateId: string) => {
    const list = currentFavorites.stateIds.includes(stateId)
      ? currentFavorites.stateIds.filter((st) => st !== stateId)
      : [...currentFavorites.stateIds, stateId];
    await updatePreferences({ favorites: { ...currentFavorites, stateIds: list } });
  };

  const handleSelectTab = (tab: ExplorerTabId) => {
    setActiveTab(tab);
    setActiveSubTab('all');
  };

  const territorialPercent = Math.min(100, Math.round((completedStatesCount / 27) * 100));
  const currentLevelProgressPercent = Math.min(100, Math.round(((playerXp % 500) / 500) * 100));

  const getSubTabs = (): SubTabItem[] => {
    switch (activeTab) {
      case 'overview':
        return [
          { id: 'all', label: 'Tudo', icon: Compass },
          { id: 'destaque', label: 'Destino Recomendado', icon: Target },
          { id: 'afinidades', label: 'Biomas & Espécies', icon: TreePine },
          { id: 'estados', label: 'Estados Favoritos', icon: MapPin },
        ];
      case 'favorites':
        return [
          { id: 'all', label: 'Todas as Coleções', icon: Layers },
          { id: 'biomes', label: `Biomas (${currentFavorites.biomes.length}/7)`, icon: TreePine },
          { id: 'species', label: `Espécies (${currentFavorites.speciesIds.length})`, icon: Sparkles },
          { id: 'states', label: `Estados (${currentFavorites.stateIds.length}/27)`, icon: MapPin },
        ];
      case 'history':
        return [
          { id: 'all', label: 'Visão Completa', icon: TrendingUp },
          { id: 'metrics', label: 'Métricas & XP', icon: Zap },
          { id: 'progress', label: 'Domínio Territorial', icon: Compass },
          { id: 'history', label: 'Histórico de Desafios', icon: Award },
        ];
      case 'preferences':
        return [
          { id: 'all', label: 'Todos os Ajustes', icon: Settings },
          { id: 'audio', label: 'Áudio & Hinos', icon: Volume2 },
          { id: 'visual', label: 'Modo de Mapa', icon: Compass },
          { id: 'access', label: 'Acessibilidade', icon: Eye },
        ];
      case 'identity':
        return [
          { id: 'all', label: 'Geral', icon: User },
          { id: 'profile', label: 'Identidade', icon: Shield },
          { id: 'cloud', label: 'Nuvem Firestore', icon: Cloud },
          { id: 'auth', label: 'Acesso & Contas', icon: KeyRound },
        ];
      default:
        return [{ id: 'all', label: 'Todos', icon: Compass }];
    }
  };

  const subTabs = getSubTabs();

  return (
    <div
      id="modal-auth-backdrop"
      className="modal-auth-backdrop modal-perfil-usuario fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-auth-container"
        className="modal-auth-container painel-explorador-unificado painel-perfil-usuario-container relative w-[96vw] max-w-7xl 2xl:max-w-[1540px] h-[92vh] max-h-[920px] flex flex-col bg-gradient-to-b from-slate-950 via-[#0a1122] to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 my-auto overflow-hidden"
      >
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />

        {/* Cabeçalho do Modal */}
        <div className="cabecalho-modal-perfil flex items-center justify-between pb-3 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-wide flex items-center gap-1.5">
                  Painel do Explorador
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Nv. {playerLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Gerencie sua jornada, afinidades ecológicas, conquistas e preferências cartográficas.
              </p>
            </div>
          </div>

          <button
            id="btn-fechar-modal-auth"
            onClick={onClose}
            className="btn-fechar-modal-auth text-slate-300 hover:text-slate-950 p-2 rounded-xl bg-slate-900 hover:bg-amber-500 border border-amber-500/40 transition z-30 cursor-pointer shadow-md"
            title="Fechar painel de perfil"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* CORPO PRINCIPAL EM 2 COLUNAS (Wide-Screen Optimized) */}
        <div className="corpo-duas-colunas flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5 pt-3 overflow-hidden">
          {/* Coluna 1: Sidebar de Perfil & Navegação Principal */}
          <UserProfileSidebar
            user={user}
            isGuest={isGuest}
            playerLevel={playerLevel}
            playerXp={playerXp}
            unlockedInsigniaCount={unlockedInsigniaCount}
            territorialPercent={territorialPercent}
            dailyStreak={dailyStreak}
            currentLevelProgressPercent={currentLevelProgressPercent}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />

          {/* Coluna 2: SubTabs no Topo & Conteúdo Principal */}
          <main className="coluna-conteudo-principal flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950/70 rounded-2xl border border-amber-500/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            {/* Barra de SubTabs Contextuais com Ícones Profissionais */}
            <div className="subtabs-topo flex items-center gap-1.5 pb-2.5 mb-3 border-b border-slate-800 overflow-x-auto custom-scrollbar-gold shrink-0">
              {subTabs.map(({ id, label, icon: SubIcon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSubTab(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeSubTab === id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Conteúdo da Aba */}
            <div className="conteudo-aba-scroll flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar-gold">
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
                  onSwitchTab={(tab) => handleSelectTab(tab)}
                  activeSubSection={activeSubTab as any}
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
                  activeSubSection={activeSubTab as any}
                />
              )}

              {activeTab === 'history' && (
                <ExplorerHistoryTab
                  playerLevel={playerLevel}
                  playerXp={playerXp}
                  unlockedInsigniaCount={unlockedInsigniaCount}
                  completedStatesCount={completedStatesCount}
                  dailyStreak={dailyStreak}
                  activeSubSection={activeSubTab as any}
                />
              )}

              {activeTab === 'preferences' && (
                <ExplorerPreferencesTab
                  preferences={preferences}
                  onUpdatePreferences={updatePreferences}
                  activeSubSection={activeSubTab as any}
                />
              )}

              {activeTab === 'identity' && (
                <ExplorerIdentityTab
                  playerLevel={playerLevel}
                  playerXp={playerXp}
                  unlockedInsigniaCount={unlockedInsigniaCount}
                  activeSubSection={activeSubTab as any}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
