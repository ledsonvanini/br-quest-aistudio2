import React from 'react';
import {
  Globe2,
  BookOpen,
  Flame,
  Award,
  Filter,
  User,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { EducationTier } from '../../data/brQuestQuestionsData';
import { audioEngine } from '../../lib/audioSynth';

export type QuestCategory = 'nacional' | 'pilares' | 'trilhas' | 'guardioes';

interface BrQuestSidebarProps {
  user: { displayName?: string | null; avatarUrl?: string | null } | null;
  isGuest: boolean;
  playerLevel: number;
  playerXp: number;
  completedStatesCount: number;
  dailyStreak: number;
  territorialPercent: number;
  currentLevelProgressPercent: number;
  rankTitle: string;
  activeCategory: QuestCategory;
  onSelectCategory: (cat: QuestCategory) => void;
  selectedDifficultyTier: EducationTier | 'todos';
  onSelectDifficultyTier: (tier: EducationTier | 'todos') => void;
}

export const BrQuestSidebar: React.FC<BrQuestSidebarProps> = ({
  user,
  isGuest,
  playerLevel,
  playerXp,
  dailyStreak,
  territorialPercent,
  currentLevelProgressPercent,
  rankTitle,
  activeCategory,
  onSelectCategory,
  selectedDifficultyTier,
  onSelectDifficultyTier,
}) => {
  const CATEGORIES: { id: QuestCategory; label: string; badge: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'nacional', label: 'Prova Nacional', badge: '6 Áreas', icon: Globe2 },
    { id: 'pilares', label: 'Áreas Científicas', badge: '6 Pilares', icon: BookOpen },
    { id: 'trilhas', label: 'Trilhas Regionais', badge: '5 Regiões', icon: Flame },
    { id: 'guardioes', label: '27 Guardiões UFs', badge: '27 UFs', icon: Award },
  ];

  return (
    <aside className="coluna-lateral-brquest w-full md:w-72 lg:w-80 xl:w-84 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
      {/* 1.1 Card de Perfil Resumido do Estudante & XP */}
      <div className="card-estudante-resumo p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-2.5">
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
              <span className="text-xs font-bold text-slate-100 truncate">
                {user?.displayName || 'Explorador'}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                  isGuest
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                }`}
              >
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
            <div className="text-[11px] font-bold text-amber-400 capitalize truncate">
              {selectedDifficultyTier === 'todos' ? 'Misto' : selectedDifficultyTier.slice(0, 4)}
            </div>
            <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Nível BNCC</div>
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

      {/* 1.2 Categorias Principais Empilhadas */}
      <div className="categorias-empilhadas-brquest flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
          Modos de Desafio
        </span>

        {CATEGORIES.map(({ id, label, badge, icon: Icon }) => {
          const isActive = activeCategory === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectCategory(id)}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold">{label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300'
                  }`}
                >
                  {badge}
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </div>
            </button>
          );
        })}
      </div>

      {/* 1.3 Seletor de Nível Pedagógico BNCC & ENEM */}
      <div className="seletor-niveis-pedagogicos-brquest p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filtro Pedagógico</span>
          </span>
          <span className="text-[9px] font-mono text-amber-400/80">BNCC & ENEM</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onSelectDifficultyTier('todos');
            }}
            className={`w-full p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
              selectedDifficultyTier === 'todos'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950/80 text-slate-300 hover:text-slate-100 border border-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Todos os Níveis (Misto)</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">Geral</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onSelectDifficultyTier('fundamental');
            }}
            className={`w-full p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
              selectedDifficultyTier === 'fundamental'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-950/80 text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Ensino Fundamental</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">100 pts • 50 XP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onSelectDifficultyTier('medio');
            }}
            className={`w-full p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
              selectedDifficultyTier === 'medio'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'bg-slate-950/80 text-sky-300 hover:bg-sky-950/40 border border-sky-500/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Médio / ENEM</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">200 pts • 100 XP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              onSelectDifficultyTier('avancado');
            }}
            className={`w-full p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
              selectedDifficultyTier === 'avancado'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950/80 text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Pesquisador</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">350 pts • 200 XP</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
