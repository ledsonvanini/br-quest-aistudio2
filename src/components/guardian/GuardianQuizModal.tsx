import React, { useState } from 'react';
import { GuardianData, UserProgress } from '../../types';
import { CompassBadgeIcon } from './GuardianCommon';
import { audioEngine } from '../../lib/audioSynth';
import { triggerConfetti } from '../../lib/storage';
import {
  getRandomStateHonorQuestion,
  getStateCampaignQuestions,
  StateQuizQuestion,
} from '../../data/stateQuestionsData';
import {
  Award,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trophy,
  RotateCcw,
  BookOpen,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Props {
  guardian: GuardianData;
  initialMode?: 'quick_honor' | 'campaign';
  onClose: () => void;
  onCompleteQuiz: (xpEarned: number, correctCount: number, mode?: 'quick' | 'campaign') => void;
  onUnlockInsignia: (insigniaId: string) => void;
  onSpeak: (text: string) => void;
  userProgress?: UserProgress;
}

export const GuardianQuizModal: React.FC<Props> = ({
  guardian,
  initialMode = 'quick_honor',
  onClose,
  onCompleteQuiz,
  onUnlockInsignia,
  onSpeak,
  userProgress,
}) => {
  const [mode, setMode] = useState<'quick_honor' | 'campaign'>(initialMode);
  const [accumulatedXp, setAccumulatedXp] = useState<number>(userProgress?.xp || 0);

  // Estado do Desafio Rápido (1 Pergunta Aleatória com opções embaralhadas)
  const [quickQuestion, setQuickQuestion] = useState<StateQuizQuestion>(() =>
    getRandomStateHonorQuestion(guardian.id)
  );
  const [quickSelectedIdx, setQuickSelectedIdx] = useState<number | null>(null);
  const [quickIsAnswered, setQuickIsAnswered] = useState<boolean>(false);
  const [quickAnsweredCorrect, setQuickAnsweredCorrect] = useState<boolean>(false);

  // Estado da Campanha Longa (Várias Perguntas com opções embaralhadas)
  const [campaignQuestions, setCampaignQuestions] = useState<StateQuizQuestion[]>(() =>
    getStateCampaignQuestions(guardian.id, 5)
  );
  const [campaignIdx, setCampaignIdx] = useState<number>(0);
  const [campaignAnswers, setCampaignAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [campaignIsAnswered, setCampaignIsAnswered] = useState<boolean[]>(new Array(5).fill(false));
  const [campaignFinished, setCampaignFinished] = useState<boolean>(false);

  // 0. AÇÃO SORTEAR OUTRA PERGUNTA (DISPONÍVEL NO TOPO AO LADO DE CAMPANHA LONGA)
  const handleReloadQuickQuestion = () => {
    audioEngine.playQuestNewQuestion();
    const nextQ = getRandomStateHonorQuestion(guardian.id);
    setMode('quick_honor');
    setQuickQuestion(nextQ);
    setQuickSelectedIdx(null);
    setQuickIsAnswered(false);
    setQuickAnsweredCorrect(false);
    onSpeak(`“Eis um novo enigma sagrado das terras de ${guardian.stateNamePt}!”`);
  };

  const handleStartCampaign = () => {
    audioEngine.playQuestNext();
    setMode('campaign');
    const qs = getStateCampaignQuestions(guardian.id, 5);
    setCampaignQuestions(qs);
    setCampaignIdx(0);
    setCampaignAnswers(new Array(qs.length).fill(null));
    setCampaignIsAnswered(new Array(qs.length).fill(false));
    setCampaignFinished(false);
    onSpeak(`“Adentraste a Campanha Sagrada de ${guardian.stateNamePt}! Prove teu conhecimento através de ${qs.length} provas paginadas!”`);
  };

  // 1. AÇÃO DESAFIO RÁPIDO DE HONRA
  const handleSelectQuickAnswer = (idx: number) => {
    if (quickIsAnswered) return;
    setQuickSelectedIdx(idx);
    setQuickIsAnswered(true);

    const isCorrect = idx === quickQuestion.correctIndex;
    setQuickAnsweredCorrect(isCorrect);

    if (isCorrect) {
      audioEngine.playQuestCorrect();
      triggerConfetti();
      setAccumulatedXp((prev) => prev + 100);
      onCompleteQuiz(100, 1, 'quick');
      onSpeak(`“Honra aos teus ancestrais! Acertaste o enigma de ${guardian.stateNamePt}! +100 XP concedidos!”`);
    } else {
      audioEngine.playQuestWrong();
      onSpeak('“Erraste o golpe desta vez, mas a sabedoria floresce na persistência!”');
    }
  };

  // 2. AÇÃO CAMPANHA LONGA
  const currentCampaignQ = campaignQuestions[campaignIdx] || campaignQuestions[0];
  const currentCampaignAnswer = campaignAnswers[campaignIdx];
  const isCurrentCampaignAnswered = campaignIsAnswered[campaignIdx];

  const handleSelectCampaignAnswer = (idx: number) => {
    if (isCurrentCampaignAnswered) return;

    audioEngine.playQuestOptionSelect();
    const newAnswers = [...campaignAnswers];
    newAnswers[campaignIdx] = idx;
    setCampaignAnswers(newAnswers);

    const newAnsweredFlags = [...campaignIsAnswered];
    newAnsweredFlags[campaignIdx] = true;
    setCampaignIsAnswered(newAnsweredFlags);

    const isCorrect = idx === currentCampaignQ.correctIndex;
    if (isCorrect) {
      audioEngine.playQuestCorrect();
      setAccumulatedXp((prev) => prev + 100);
    } else {
      audioEngine.playQuestWrong();
    }
  };

  const handleCampaignNext = () => {
    audioEngine.playQuestNext();
    if (campaignIdx + 1 < campaignQuestions.length) {
      setCampaignIdx((i) => i + 1);
    } else {
      // Finalizar Campanha
      let totalCorrect = 0;
      campaignQuestions.forEach((q, i) => {
        if (campaignAnswers[i] === q.correctIndex) {
          totalCorrect++;
        }
      });

      setCampaignFinished(true);
      const earnedXp = totalCorrect * 100;
      onCompleteQuiz(earnedXp, totalCorrect, 'campaign');

      // Se acertou pelo menos 4 de 5, ganha Insígnia
      if (totalCorrect >= Math.ceil(campaignQuestions.length * 0.7)) {
        onUnlockInsignia(guardian.id);
        triggerConfetti();
        audioEngine.playSfx('fanfare');
        onSpeak(`“Triunfo lendário! Completaste a Campanha de ${guardian.stateNamePt} com louvor e conquistaste a Insígnia Sagrada!”`);
      } else {
        onSpeak(`“Campanha finalizada com ${totalCorrect} acertos. Continue seus estudos no Baú de Relíquias e tente novamente!”`);
      }
    }
  };

  const handleCampaignPrev = () => {
    audioEngine.playQuestNext();
    if (campaignIdx > 0) {
      setCampaignIdx((i) => i - 1);
    }
  };

  return (
    <div
      id="modal-quiz-guardiao"
      className="modal-quiz-guardiao fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
    >
      <div className="painel-quiz-conteudo relative w-full max-w-2xl sm:max-w-3xl bg-gradient-to-b from-slate-950 via-[#0f121a] to-slate-950 border-2 border-amber-500/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-3 text-slate-100 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />

        {/* 1. CABEÇALHO COM ÊNFASE NA SOMA TOTAL DE XP ORGANIZADO EM COLUNAS */}
        <div className="cabeçalho-quiz-topo flex items-center justify-between gap-3 border-b border-amber-500/40 pb-3 shrink-0">
          {/* Coluna Esquerda: Identificação do Guardião e Estado (com quebra natural de linha) */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <CompassBadgeIcon icon={Award} size="md" active />
            <div className="min-w-0 flex-1">
              <h3 className="font-serif font-black text-sm sm:text-base md:text-lg text-amber-300 flex items-center gap-2 leading-tight">
                <span>{guardian.stateNamePt}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 shrink-0">
                  {guardian.id}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-serif leading-snug break-words mt-0.5">
                <span className="text-amber-400/90 font-medium">{guardian.guardianName}</span>
                <span className="text-slate-600 mx-1">•</span>
                <span>{guardian.guardianTitlePt}</span>
              </p>
            </div>
          </div>

          {/* Coluna Direita: PAINEL DE SOMA TOTAL DE XP + BOTÃO FECHAR (Fixos na mesma linha) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="painel-destaque-soma-xp flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 px-2.5 sm:px-3.5 py-1.5 rounded-2xl border-2 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-amber-300/90 flex items-center gap-1 leading-none">
                  <Trophy className="w-2.5 h-2.5 text-amber-400" />
                  Soma Total de XP
                </span>
                <span className="text-xs sm:text-sm md:text-base font-mono font-black text-amber-200 tracking-tight leading-tight mt-0.5">
                  {accumulatedXp.toLocaleString('pt-BR')} <span className="text-[10px] text-amber-400 font-bold">XP</span>
                </span>
              </div>

              <div className="h-6 w-px bg-amber-500/40 mx-0.5 hidden xs:block sm:block" />

              <div className="hidden xs:flex sm:flex flex-col text-right">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 leading-none">
                  Recompensa
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-black text-emerald-400 flex items-center justify-end gap-0.5 leading-tight mt-0.5 whitespace-nowrap">
                  <Zap className="w-3 h-3" />
                  {mode === 'quick_honor' ? '+100 XP' : `Até +${campaignQuestions.length * 100} XP`}
                </span>
              </div>
            </div>

            {/* Botão Fechar */}
            <button
              id="btn-fechar-quiz-guardiao"
              onClick={onClose}
              className="btn-fechar-painel bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-2 rounded-xl border border-amber-500/50 transition cursor-pointer shadow shrink-0"
              title="Fechar Desafio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. BARRA DE CONTROLE NO TOPO: DESAFIO RÁPIDO | CAMPANHA LONGA | SORTEAR */}
        <div className="barra-controles-topo-quiz flex flex-wrap items-center gap-2 shrink-0">
          {/* Botão 1: Desafio Rápido de Honra */}
          <button
            onClick={() => {
              audioEngine.playQuestOptionSelect();
              setMode('quick_honor');
            }}
            className={`btn-modo-desafio-rapido px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              mode === 'quick_honor'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow font-black ring-1 ring-amber-300'
                : 'bg-slate-900/90 text-slate-300 hover:text-amber-300 border-slate-800 hover:border-amber-400/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span>Desafio Rápido (1 Q.)</span>
          </button>

          {/* Botão 2: Campanha Longa */}
          <button
            onClick={handleStartCampaign}
            className={`btn-modo-campanha-longa px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              mode === 'campaign'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow font-black ring-1 ring-amber-300'
                : 'bg-slate-900/90 text-slate-300 hover:text-amber-300 border-slate-800 hover:border-amber-400/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Campanha Longa ({campaignQuestions.length} Qs.)</span>
          </button>

          {/* Botão 3: SORTEAR (COMPACTO E DIRETO) */}
          <button
            id="btn-sortear-quiz"
            onClick={handleReloadQuickQuestion}
            className="btn-sortear-quiz ml-auto px-3 py-1.5 sm:py-2 rounded-xl text-xs font-serif font-bold bg-slate-900/95 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/60 hover:border-amber-400 shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Sortear outro enigma do estado com opções aleatórias"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 animate-spin-reverse hover:rotate-180 transition-transform duration-300 shrink-0" />
            <span className="font-black">Sortear</span>
          </button>
        </div>

        {/* 3. CORPO DO MODAL (COM LARGURA EXPANDIDA E GRID RESPONSIVO PARA EVITAR ROLAGEM) */}
        <div className="overflow-y-auto custom-scrollbar-gold pr-1 space-y-3.5 flex-1">
          {/* ========================================================================= */}
          {/* MODO A: DESAFIO RÁPIDO DE HONRA (1 PERGUNTA ALEATÓRIA DO ESTADO)           */}
          {/* ========================================================================= */}
          {mode === 'quick_honor' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-serif font-semibold text-amber-300/90 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Enigma Aleatório de {guardian.stateNamePt}
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Vale +100 XP
                </span>
              </div>

              {/* Pergunta */}
              <div className="painel-enunciado-pergunta bg-slate-900/90 border border-amber-500/40 p-3.5 sm:p-4 rounded-2xl shadow-inner">
                <p className="text-xs sm:text-sm md:text-base font-serif font-bold text-amber-100 leading-relaxed break-words">
                  {quickQuestion.questionPt}
                </p>
              </div>

              {/* Alternativas Empilhadas na Vertical (A, B, C, D) */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                {quickQuestion.optionsPt.map((option, idx) => {
                  const isChosen = quickSelectedIdx === idx;
                  const isCorrect = idx === quickQuestion.correctIndex;
                  let btnStyle =
                    'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-400/60 hover:bg-slate-850';

                  if (quickIsAnswered) {
                    if (isCorrect) {
                      btnStyle =
                        'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.35)] font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuickAnswer(idx)}
                      disabled={quickIsAnswered}
                      className={`btn-opcao-resposta w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer break-words ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/40 border border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-sans break-words whitespace-normal leading-snug">{option}</span>
                      {quickIsAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback sem o botão de reload (que agora está no topo ao lado de Campanha Longa) */}
              {quickIsAnswered && (
                <div className="painel-feedback-quiz space-y-2.5 p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 animate-in fade-in">
                  <div className="text-xs sm:text-sm text-amber-200 font-serif leading-relaxed break-words">
                    <span className="font-bold text-amber-400 block mb-0.5">
                      {quickAnsweredCorrect ? '✨ Sabedoria Conquistada (+100 XP):' : '📖 Fato Histórico/Cultural:'}
                    </span>
                    {quickQuestion.explanationPt}
                  </div>

                  <div className="flex items-center justify-end pt-1 gap-2">
                    <button
                      onClick={handleStartCampaign}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>Continuar para a Campanha Longa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODO B: CAMPANHA LONGA (PAGINADA, MÚLTIPLAS QUESTÕES, INSÍGNIA)            */}
          {/* ========================================================================= */}
          {mode === 'campaign' && !campaignFinished && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {/* Barra Paginada de Questões */}
              <div className="flex items-center justify-between bg-slate-900/90 p-2 sm:p-2.5 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
                  {campaignQuestions.map((q, qIndex) => {
                    const isAnswered = campaignIsAnswered[qIndex];
                    const isCorrect = isAnswered && campaignAnswers[qIndex] === q.correctIndex;
                    const isCurrent = campaignIdx === qIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          audioEngine.playQuestNext();
                          setCampaignIdx(qIndex);
                        }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer border ${
                          isCurrent
                            ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                            : isAnswered
                            ? isCorrect
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : 'bg-rose-950 text-rose-300 border-rose-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-amber-400/50'
                        }`}
                        title={`Ir para Questão ${qIndex + 1}`}
                      >
                        {qIndex + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-mono font-bold text-amber-300 shrink-0 ml-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  Questão {campaignIdx + 1} de {campaignQuestions.length}
                </div>
              </div>

              {/* Pergunta Atual */}
              <div className="painel-enunciado-campanha bg-slate-900/90 border border-amber-500/40 p-3.5 sm:p-4 rounded-2xl shadow-inner">
                <p className="text-xs sm:text-sm md:text-base font-serif font-bold text-amber-100 leading-relaxed break-words">
                  {currentCampaignQ.questionPt}
                </p>
              </div>

              {/* Alternativas da Campanha Empilhadas na Vertical */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                {currentCampaignQ.optionsPt.map((option, idx) => {
                  const isChosen = currentCampaignAnswer === idx;
                  const isCorrect = idx === currentCampaignQ.correctIndex;
                  let btnStyle =
                    'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-400/60 hover:bg-slate-850';

                  if (isCurrentCampaignAnswered) {
                    if (isCorrect) {
                      btnStyle =
                        'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.35)] font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectCampaignAnswer(idx)}
                      disabled={isCurrentCampaignAnswered}
                      className={`btn-opcao-resposta w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer break-words ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/40 border border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-sans break-words whitespace-normal leading-snug">{option}</span>
                      {isCurrentCampaignAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explicação e Navegação Paginada */}
              {isCurrentCampaignAnswered && (
                <div className="painel-feedback-campanha p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 space-y-2.5 animate-in fade-in">
                  <div className="text-xs sm:text-sm text-amber-200 font-serif leading-relaxed break-words">
                    <span className="font-bold text-amber-400">Sabedoria do Guardião: </span>
                    {currentCampaignQ.explanationPt}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleCampaignPrev}
                      disabled={campaignIdx === 0}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 text-xs font-serif transition flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>

                    <button
                      onClick={handleCampaignNext}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>
                        {campaignIdx + 1 < campaignQuestions.length
                          ? 'Próxima Questão'
                          : 'Finalizar Campanha'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODO C: RESULTADO FINAL DA CAMPANHA LONGA                                  */}
          {/* ========================================================================= */}
          {mode === 'campaign' && campaignFinished && (
            <div className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-200">
              {(() => {
                let totalCorrect = 0;
                campaignQuestions.forEach((q, i) => {
                  if (campaignAnswers[i] === q.correctIndex) totalCorrect++;
                });
                const passed = totalCorrect >= Math.ceil(campaignQuestions.length * 0.7);

                return (
                  <>
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 ${
                        passed
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {passed ? <Trophy className="w-8 h-8" /> : <Award className="w-8 h-8" />}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif font-black text-lg sm:text-xl text-amber-200">
                        {passed ? 'Campanha Conquistada com Honra!' : 'Campanha Concluída'}
                      </h4>
                      <p className="text-xs text-slate-300 font-serif max-w-md mx-auto">
                        {passed
                          ? `Parabéns! Você dominou os enigmas sagrados de ${guardian.stateNamePt} e conquistou a Insígnia!`
                          : `Você respondeu a todas as questões. Revise o Baú de Relíquias de ${guardian.stateNamePt} para alcançar a Insígnia Sagrada!`}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto py-2">
                      <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30">
                        <div className="text-[11px] text-slate-400 font-serif">Acertos</div>
                        <div className="text-xl font-mono font-black text-emerald-400">
                          {totalCorrect} / {campaignQuestions.length}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30">
                        <div className="text-[11px] text-slate-400 font-serif">XP Adquirido</div>
                        <div className="text-xl font-mono font-black text-amber-400">
                          +{totalCorrect * 100} XP
                        </div>
                      </div>
                    </div>

                    {passed && (
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-300 text-xs font-serif font-bold max-w-sm mx-auto">
                        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          {guardian.insigniaNamePt.toLowerCase().startsWith('insígnia')
                            ? guardian.insigniaNamePt
                            : `Insígnia ${guardian.insigniaNamePt}`}{' '}
                          Desbloqueada!
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2.5 pt-2">
                      <button
                        onClick={handleStartCampaign}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-serif text-xs transition cursor-pointer"
                      >
                        Repetir Campanha
                      </button>

                      <button
                        onClick={() => setMode('quick_honor')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition cursor-pointer shadow"
                      >
                        Desafio Rápido
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
