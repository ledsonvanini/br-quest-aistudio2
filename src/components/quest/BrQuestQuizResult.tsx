import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { BrQuestQuestion } from '../../data/brQuestQuestionsData';

interface BrQuestQuizResultProps {
  score: number;
  totalQuestions: number;
  earnedPoints: number;
  earnedXp: number;
  activeBatchTitle: string;
  activeBatchDesc: string;
  correctAnswersList: { question: BrQuestQuestion; isCorrect: boolean }[];
  onPlayAgain: () => void;
  onReturnToHub: () => void;
}

export const BrQuestQuizResult: React.FC<BrQuestQuizResultProps> = ({
  score,
  totalQuestions,
  earnedPoints,
  earnedXp,
  activeBatchTitle,
  correctAnswersList,
  onPlayAgain,
  onReturnToHub,
}) => {
  return (
    <div className="modo-resultado-brquest flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 overflow-hidden animate-in zoom-in-95 duration-150">
      {/* Coluna 1: Troféu & Recompensas */}
      <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif font-black text-base sm:text-lg text-amber-200">
              Desafio Concluído!
            </h3>
            <p className="text-xs text-slate-300 font-serif mt-0.5">
              {activeBatchTitle}
            </p>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Acertos:</span>
              <span className="text-emerald-400 font-bold">{score} de {totalQuestions}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Pontuação:</span>
              <span className="text-amber-300 font-bold">+{earnedPoints} pts</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
              <span className="text-slate-400">XP Conquistado:</span>
              <span className="text-sky-300 font-bold">+{earnedXp} XP</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3">
          <button
            type="button"
            onClick={onReturnToHub}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-serif text-xs transition cursor-pointer"
          >
            Voltar ao Hub
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      </aside>

      {/* Coluna 2: Revisão Detalhada das Questões */}
      <main className="flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950/70 rounded-2xl border border-amber-500/30 p-3.5 sm:p-4 overflow-y-auto custom-scrollbar-gold space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
            Revisão Pedagógica das Questões
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {score}/{totalQuestions} corretas ({Math.round((score / Math.max(1, totalQuestions)) * 100)}%)
          </span>
        </div>

        <div className="space-y-2">
          {correctAnswersList.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                item.isCorrect
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">
                  Questão {idx + 1}: {item.question.questionPt}
                </span>
                <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-full ${
                  item.isCorrect
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {item.isCorrect ? 'Correta' : 'Incorreta'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-serif leading-relaxed">
                {item.question.explanationPt}
              </p>
              {item.question.sourceRef && (
                <div className="text-[10px] font-mono text-slate-400">
                  Fonte: {item.question.sourceRef}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
