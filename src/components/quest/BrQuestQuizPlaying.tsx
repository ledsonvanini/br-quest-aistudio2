import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { BrQuestQuestion, QuestThemePillar } from '../../data/brQuestQuestionsData';

interface BrQuestQuizPlayingProps {
  currentQ: BrQuestQuestion;
  currentMetrics: {
    points: number;
    xp: number;
    shortBadge: string;
    enemCategory: string;
  };
  currentIdx: number;
  totalQuestions: number;
  score: number;
  isConfirmed: boolean;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  onNextQuestion: () => void;
  onQuitToHub: () => void;
  getPillarBadge: (pillar: QuestThemePillar) => {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
}

export const BrQuestQuizPlaying: React.FC<BrQuestQuizPlayingProps> = ({
  currentQ,
  currentMetrics,
  currentIdx,
  totalQuestions,
  score,
  isConfirmed,
  selectedOption,
  onSelectOption,
  onNextQuestion,
  onQuitToHub,
  getPillarBadge,
}) => {
  const badge = getPillarBadge(currentQ.pillar);
  const PillarIcon = badge.icon;

  return (
    <div className="modo-jogando-brquest flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 overflow-hidden animate-in zoom-in-95 duration-150">
      {/* Coluna 1 da Prova: Telemetria Pedagógica */}
      <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
              Telemetria da Prova
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
              Q{currentIdx + 1} de {totalQuestions}
            </span>
          </div>

          {/* Pilar Temático */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${badge.color}`}>
            <PillarIcon className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">{badge.label}</div>
              <div className="text-[9px] opacity-80 font-mono">{currentMetrics.enemCategory}</div>
            </div>
          </div>

          {/* Nível & Pontuação */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400">Nível:</span>
              <span className="font-bold text-slate-200">{currentMetrics.shortBadge}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400">Recompensa:</span>
              <span className="text-amber-300 font-bold">+{currentQ.points || currentMetrics.points} pts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400">Bônus XP:</span>
              <span className="text-sky-300 font-bold">+{currentQ.xp || currentMetrics.xp} XP</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400">Acertos Atuais:</span>
              <span className="text-emerald-400 font-bold">{score}</span>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onQuitToHub}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Desistir e Voltar ao Hub</span>
        </button>
      </aside>

      {/* Coluna 2 da Prova: A Questão e as Alternativas */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950/70 rounded-2xl border border-amber-500/30 p-3.5 sm:p-4 md:p-5 overflow-y-auto custom-scrollbar-gold space-y-3.5">
        {/* Enunciado da Pergunta */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-inner space-y-2">
          <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Matriz Pedagógica: {currentMetrics.enemCategory}</span>
          </div>
          <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed">
            {currentQ.questionPt}
          </h3>
        </div>

        {/* Alternativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentQ.optionsPt.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-amber-400/60 hover:bg-slate-850';

            if (isConfirmed) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectOption(idx)}
                disabled={isConfirmed}
                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer break-words shadow-sm ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-full bg-black/50 border border-slate-700 flex items-center justify-center font-mono text-xs font-black shrink-0 mt-0.5 text-amber-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-sans leading-relaxed">{opt}</span>
                {isConfirmed && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explicação Científica & Próxima Questão */}
        {isConfirmed && (
          <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 space-y-2 animate-in fade-in">
            <div className="text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed">
              <span className="font-bold text-amber-300">Explicação Científica: </span>
              {currentQ.explanationPt}
            </div>
            {currentQ.sourceRef && (
              <div className="text-[11px] font-mono text-cyan-300/80 flex items-center gap-1">
                <span>Fonte Oficial:</span>
                <strong className="text-cyan-200">{currentQ.sourceRef}</strong>
              </div>
            )}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onNextQuestion}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{currentIdx + 1 < totalQuestions ? 'Próxima Questão' : 'Ver Resultado'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
