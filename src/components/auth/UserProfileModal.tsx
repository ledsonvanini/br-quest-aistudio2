import React, { useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import {
  X,
  Sparkles,
  Star,
  TrendingUp,
  Settings,
  Shield,
  Compass,
  User,
  Zap,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
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

  // Switch primary category and reset subtab to 'all'
  const handleSelectTab = (tab: ExplorerTabId) => {
    setActiveTab(tab);
    setActiveSubTab('all');
  };

  const territorialPercent = Math.min(100, Math.round((completedStatesCount / 27) * 100));
  const xpNeededForNextLevel = playerLevel * 500;
  const currentLevelProgressPercent = Math.min(100, Math.round(((playerXp % 500) / 500) * 100));

  // Sub-tabs configuration for Column 2 based on activeTab
  const getSubTabs = () => {
    switch (activeTab) {
      case 'overview':
        return [
          { id: 'all', label: 'Tudo' },
          { id: 'destaque', label: '🎯 Destino Recomendado' },
          { id: 'afinidades', label: '🌿 Biomas & Espécies' },
          { id: 'estados', label: '🗺️ Estados Favoritos' },
        ];
      case 'favorites':
        return [
          { id: 'all', label: 'Todas as Coleções' },
          { id: 'biomes', label: `🌿 Biomas (${currentFavorites.biomes.length}/7)` },
          { id: 'species', label: `🐆 Espécies (${currentFavorites.speciesIds.length})` },
          { id: 'states', label: `🗺️ Estados (${currentFavorites.stateIds.length}/27)` },
        ];
      case 'history':
        return [
          { id: 'all', label: 'Visão Completa' },
          { id: 'metrics', label: '⚡ Métricas & XP' },
          { id: 'progress', label: '🗺️ Domínio Territorial' },
          { id: 'history', label: '📜 Histórico de Desafios' },
        ];
      case 'preferences':
        return [
          { id: 'all', label: 'Todos os Ajustes' },
          { id: 'audio', label: '🔊 Áudio & Hinos' },
          { id: 'visual', label: '🗺️ Modo de Mapa' },
          { id: 'access', label: '👁️ Acessibilidade' },
        ];
      case 'identity':
        return [
          { id: 'all', label: 'Geral' },
          { id: 'profile', label: '👤 Identidade' },
          { id: 'cloud', label: '☁️ Nuvem Firestore' },
          { id: 'auth', label: '🔐 Acesso & Contas' },
        ];
      default:
        return [{ id: 'all', label: 'Todos' }];
    }
  };

  const subTabs = getSubTabs();

  return (
    <div
      id="modal-auth-backdrop"
      className="modal-auth-backdrop modal-perfil-usuario fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-auth-container"
        className="modal-auth-container painel-explorador-unificado painel-perfil-usuario-container relative w-[98vw] sm:w-[95vw] md:w-[92vw] lg:w-[90vw] max-w-6xl h-[95vh] sm:h-[94vh] max-h-[96vh] flex flex-col bg-gradient-to-b from-slate-950 via-[#0a1122] to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 my-auto overflow-hidden"
      >
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />

        {/* Cabeçalho Compacto do Modal */}
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
        <div className="corpo-duas-colunas flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 pt-3 overflow-hidden">
          {/* ========================================================================= */}
          {/* COLUNA 1 (Esquerda): Perfil do Usuário & Categorias Principais Empilhadas */}
          {/* ========================================================================= */}
          <aside className="coluna-lateral-perfil w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
            {/* 1.1 Card de Perfil Resumido & XP */}
            <div className="card-perfil-resumo p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
                      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-slate-950 shadow-xs border border-slate-900">
                    N.{playerLevel}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-100 truncate">{user?.displayName || 'Explorador'}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                      isGuest ? 'bg-slate-800 text-slate-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isGuest ? 'Convidado' : 'Google'}
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-300/90 font-medium truncate">
                    {playerLevel >= 10 ? 'Guardião Supremo' : playerLevel >= 5 ? 'Cartógrafo Sênior' : 'Navegador Aprendiz'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {playerXp.toLocaleString('pt-BR')} XP Total
                  </div>
                </div>
              </div>

              {/* Barra de Progresso de Nível */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Nv. {playerLevel}</span>
                  <span className="text-amber-400">{currentLevelProgressPercent}% até Nv. {playerLevel + 1}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, currentLevelProgressPercent)}%` }}
                  />
                </div>
              </div>

              {/* Mini Pílulas de Estatísticas */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono">
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-bold text-emerald-400">{unlockedInsigniaCount}/27</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Insígnias</div>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-bold text-sky-400">{territorialPercent}%</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Domínio</div>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-bold text-rose-400">{dailyStreak}d</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Ofensiva</div>
                </div>
              </div>
            </div>

            {/* 1.2 Categorias Principais Empilhadas (Vertical Nav List) */}
            <div className="categorias-empilhadas flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                Navegação Principal
              </span>

              <button
                type="button"
                onClick={() => handleSelectTab('overview')}
                className={`btn-aba-visao-geral w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Visão Geral</div>
                    <div className={`text-[10px] leading-tight ${activeTab === 'overview' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Painel central da expedição
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'overview' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('favorites')}
                className={`btn-aba-favoritos w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Fauna, Flora & UFs</div>
                    <div className={`text-[10px] leading-tight ${activeTab === 'favorites' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Afinidades & coleções
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'favorites' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('history')}
                className={`btn-aba-historico w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Jornada & XP</div>
                    <div className={`text-[10px] leading-tight ${activeTab === 'history' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Progresso e histórico
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'history' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('preferences')}
                className={`btn-aba-preferencias w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeTab === 'preferences'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Ajustes & Som</div>
                    <div className={`text-[10px] leading-tight ${activeTab === 'preferences' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Áudio e cartografia
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'preferences' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('identity')}
                className={`btn-aba-identidade w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeTab === 'identity'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Minha Conta</div>
                    <div className={`text-[10px] leading-tight ${activeTab === 'identity' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Sincronia Firebase
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'identity' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>
            </div>

            {/* Dica do Explorador (Card Auto-contido) */}
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2 mt-auto">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Conquiste os 27 Guardiões estaduais no BrQuest para desbloquear o brasão nacional completo!</span>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* COLUNA 2 (Direita): SubTabs no Topo & Conteúdo Principal Expandido        */}
          {/* ========================================================================= */}
          <main className="coluna-conteudo-principal flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950/70 rounded-2xl border border-amber-500/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            {/* Barra de SubTabs Contextuais no Topo da Coluna 2 */}
            <div className="subtabs-topo flex items-center gap-1.5 pb-2.5 mb-3 border-b border-slate-800 overflow-x-auto custom-scrollbar-gold shrink-0">
              {subTabs.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveSubTab(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeSubTab === st.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Conteúdo Principal com Scroll Suave */}
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
