import React from 'react';
import { Award, Zap, Calendar, TrendingUp, Compass, CheckCircle2 } from 'lucide-react';
import { UserScoreHistoryItem } from '../../../types/userPreferences';

interface ExplorerHistoryTabProps {
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
  completedStatesCount: number;
  dailyStreak: number;
  scoreHistory?: UserScoreHistoryItem[];
}

export const ExplorerHistoryTab: React.FC<ExplorerHistoryTabProps> = ({
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
  completedStatesCount,
  dailyStreak,
  scoreHistory = [],
}) => {
  // Histórico sintetizado caso o usuário ainda não tenha registros remotos
  const sampleHistory: UserScoreHistoryItem[] = scoreHistory.length > 0 ? scoreHistory : [
    {
      id: 'hist-1',
      type: 'daily_tip',
      title: '5 Dicas do Dia: Pampa Gaúcho',
      points: 50,
      timestamp: 'Hoje, 09:15',
      detail: 'Leitura de biodiversidade e curiosidades',
    },
    {
      id: 'hist-2',
      type: 'quiz_uf',
      title: 'Desafio do Guardião: Rio de Janeiro',
      points: 150,
      timestamp: 'Ontem, 18:30',
      detail: 'Conquista da Insígnia do Corcovado',
    },
    {
      id: 'hist-3',
      type: 'quiz_uf',
      title: 'Desafio do Guardião: Amazonas',
      points: 150,
      timestamp: '11/09, 14:20',
      detail: 'Conquista da Insígnia da Vitória-Régia',
    },
  ];

  const territorialCoveragePercent = Math.min(100, Math.round((completedStatesCount / 27) * 100));

  return (
    <div className="painel-aba-historico space-y-5 text-stone-200 text-sm">
      {/* 1. Grade de Métricas Principais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/50">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <Zap className="w-4 h-4" />
            <span>XP Total</span>
          </div>
          <div className="text-lg font-bold text-stone-100 mt-1">{playerXp.toLocaleString('pt-BR')}</div>
          <div className="text-[11px] text-stone-400">Nível {playerLevel}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/50">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Award className="w-4 h-4" />
            <span>Insígnias</span>
          </div>
          <div className="text-lg font-bold text-stone-100 mt-1">{unlockedInsigniaCount} / 27</div>
          <div className="text-[11px] text-stone-400">Brasões de UFs</div>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/50">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
            <Calendar className="w-4 h-4" />
            <span>Ofensiva Diária</span>
          </div>
          <div className="text-lg font-bold text-stone-100 mt-1">{dailyStreak} {dailyStreak === 1 ? 'dia' : 'dias'}</div>
          <div className="text-[11px] text-stone-400">Sequência Ativa</div>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/50">
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
            <Compass className="w-4 h-4" />
            <span>Domínio</span>
          </div>
          <div className="text-lg font-bold text-stone-100 mt-1">{territorialCoveragePercent}%</div>
          <div className="text-[11px] text-stone-400">Território Nacional</div>
        </div>
      </div>

      {/* 2. Barra de Progresso Territorial */}
      <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-700/50 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-200">Exploração Territorial dos 27 Estados do Brasil</span>
          <span className="text-amber-400 font-mono font-bold">{completedStatesCount} de 27 estados explorados</span>
        </div>
        <div className="w-full h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-700/40">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500 transition-all duration-700 rounded-full"
            style={{ width: `${Math.max(5, territorialCoveragePercent)}%` }}
          />
        </div>
      </div>

      {/* 3. Linha do Tempo de Pontuações Recentes */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Histórico de Atividades & Pontuação</span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">SQLite Local</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
          {sampleHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-between text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-stone-200 line-clamp-1">{item.title}</div>
                  {item.detail && <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{item.detail}</div>}
                  <div className="text-[10px] text-stone-500 mt-1 font-mono">{item.timestamp}</div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                  +{item.points} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
