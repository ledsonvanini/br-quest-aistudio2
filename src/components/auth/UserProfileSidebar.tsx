import React from 'react';
import {
  Compass,
  Star,
  TrendingUp,
  Settings,
  Shield,
  ChevronRight,
  Info,
  User,
} from 'lucide-react';
import { ExplorerTabId } from './UserProfileModal';

interface UserProfileSidebarProps {
  user: { displayName?: string | null; avatarUrl?: string | null } | null;
  isGuest: boolean;
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
  territorialPercent: number;
  dailyStreak: number;
  currentLevelProgressPercent: number;
  activeTab: ExplorerTabId;
  onSelectTab: (tab: ExplorerTabId) => void;
}

export const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  user,
  isGuest,
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
  territorialPercent,
  dailyStreak,
  currentLevelProgressPercent,
  activeTab,
  onSelectTab,
}) => {
  const rankTitle =
    playerLevel >= 10 ? 'Guardião Supremo' : playerLevel >= 5 ? 'Cartógrafo Sênior' : 'Navegador Aprendiz';

  const NAV_ITEMS: { id: ExplorerTabId; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Visão Geral', desc: 'Painel central da expedição', icon: Compass },
    { id: 'favorites', label: 'Fauna, Flora & UFs', desc: 'Afinidades & coleções', icon: Star },
    { id: 'history', label: 'Jornada & XP', desc: 'Progresso e histórico', icon: TrendingUp },
    { id: 'preferences', label: 'Ajustes & Som', desc: 'Áudio e cartografia', icon: Settings },
    { id: 'identity', label: 'Minha Conta', desc: 'Sincronia Firebase', icon: Shield },
  ];

  return (
    <aside className="coluna-lateral-perfil w-full md:w-72 lg:w-80 xl:w-84 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
      {/* 1. Card de Perfil Resumido & XP */}
      <div className="card-perfil-resumo p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName || 'Explorador'}
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
            <div className="text-[10px] text-amber-300/90 font-medium truncate">{rankTitle}</div>
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

      {/* 2. Categorias Principais Empilhadas (Vertical Nav List) */}
      <div className="categorias-empilhadas flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
          Navegação Principal
        </span>

        {NAV_ITEMS.map(({ id, label, desc, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight">{label}</div>
                  <div className={`text-[10px] leading-tight ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {desc}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
            </button>
          );
        })}
      </div>

      {/* Dica do Explorador */}
      <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2 mt-auto">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>Conquiste os 27 Guardiões estaduais no BrQuest para desbloquear o brasão nacional completo!</span>
      </div>
    </aside>
  );
};
