import React, { useState } from 'react';
import { GuardianData } from '../../types';
import { CompassBadgeIcon } from './GuardianCommon';
import { audioEngine } from '../../lib/audioSynth';
import { triggerConfetti } from '../../lib/storage';
import { Award, X, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

interface Props {
  guardian: GuardianData;
  onClose: () => void;
  onCompleteQuiz: (xpEarned: number, correctCount: number) => void;
  onUnlockInsignia: (insigniaId: string) => void;
  onSpeak: (text: string) => void;
}

export const GuardianQuizModal: React.FC<Props> = ({
  guardian,
  onClose,
  onCompleteQuiz,
  onUnlockInsignia,
  onSpeak,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = guardian.questions[currentQIndex];

  const handleSelectQuizAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      audioEngine.playSfx('badge');
      setQuizScore((s) => s + 1);
      onSpeak('“Muito bem, guerreiro! Tua sabedoria está afiada como adaga de prata!”');
    } else {
      audioEngine.playSfx('step');
      onSpeak('“Não desanime! Toda queda nos ensina a montar com mais firmeza!”');
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex + 1 < guardian.questions.length) {
      setCurrentQIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      onSpeak('“Próxima pergunta! Preste atenção aos detalhes sagrados das nossas tradições!”');
    } else {
      setQuizFinished(true);
      const finalScore = quizScore + (selectedAnswer === currentQ.correctIndex ? 1 : 0);
      const xp = finalScore * 100;
      onCompleteQuiz(xp, finalScore);

      if (finalScore === guardian.questions.length) {
        onUnlockInsignia(guardian.id);
        triggerConfetti();
        audioEngine.playSfx('fanfare');
        onSpeak('“Honra e Glória! Você dominou todos os segredos e conquistou a Insígnia Sagrada!”');
      } else {
        onSpeak(`“Desafio completado! Você acumulou ${xp} XP na sua jornada!”`);
      }
    }
  };

  return (
    <div className="container-modal-quiz absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-40 animate-in zoom-in-95 duration-200 select-none">
      <div className="painel-quiz-conteudo relative bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] space-y-3.5 text-slate-100">
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />

        <div className="flex items-center justify-between border-b border-amber-500/40 pb-2.5">
          <div className="flex items-center gap-2">
            <CompassBadgeIcon icon={Award} size="md" active />
            <div>
              <h3 className="font-serif font-black text-sm sm:text-base text-amber-300">
                Desafio de Honra • {guardian.stateNamePt}
              </h3>
              <p className="text-[10px] text-slate-400 font-serif">
                Questão {currentQIndex + 1} de {guardian.questions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-fechar-quiz bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-1.5 rounded-xl border border-amber-500/50 transition cursor-pointer shadow"
            title="Fechar Desafio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!quizFinished ? (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-amber-500/30 p-3 rounded-xl shadow-inner">
              <p className="text-xs sm:text-sm font-serif font-bold text-amber-100 leading-snug">
                {currentQ.questionPt}
              </p>
            </div>

            <div className="space-y-1.5">
              {currentQ.optionsPt.map((option, idx) => {
                const isChosen = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/60';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950 border-emerald-400 text-emerald-100 shadow-md';
                  } else if (isChosen) {
                    btnStyle = 'bg-rose-950 border-rose-400 text-rose-100';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full p-2.5 rounded-xl border text-left font-serif text-xs transition-all duration-150 flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="space-y-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-serif text-amber-200 leading-normal">
                  <span className="font-bold text-amber-400 block mb-0.5">Sabedoria do Guardião:</span>
                  {currentQ.explanationPt}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuizQuestion}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs px-4 py-2 rounded-xl transition shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <span>
                      {currentQIndex + 1 < guardian.questions.length ? 'Próxima Questão' : 'Ver Conquista'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-3 py-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-400 shadow">
              <Trophy className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-amber-300">
                Desafio de Honra Concluído!
              </h4>
              <p className="text-xs text-slate-300 font-serif mt-0.5">
                Você acertou {quizScore} de {guardian.questions.length} questões (+{quizScore * 100} XP).
              </p>
            </div>

            <div className="flex justify-center pt-1">
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs px-5 py-2 rounded-xl transition shadow cursor-pointer"
              >
                Voltar ao Cenário
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
