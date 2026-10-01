import { useState } from 'react';
import {
  BR_QUEST_QUESTIONS,
  BrQuestQuestion,
  EducationTier,
  QuestThemePillar,
  getTierFromDifficulty,
  getTierMetrics,
} from '../../data/brQuestQuestionsData';
import { audioEngine } from '../../lib/audioSynth';

export type TabMode = 'hub' | 'playing' | 'result';

export function useBrQuestQuiz(
  selectedDifficultyTier: EducationTier | 'todos',
  onGainXp?: (amount: number) => void
) {
  const [tabMode, setTabMode] = useState<TabMode>('hub');
  const [activeQuestions, setActiveQuestions] = useState<BrQuestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [activeBatchTitle, setActiveBatchTitle] = useState('');
  const [activeBatchDesc, setActiveBatchDesc] = useState('');
  const [correctAnswersList, setCorrectAnswersList] = useState<{ question: BrQuestQuestion; isCorrect: boolean }[]>([]);

  const handleStartChallenge = (
    title: string,
    desc: string,
    filter: { scope?: 'nacional'; pillar?: QuestThemePillar; regionId?: any; stateId?: string },
    count: number = 5
  ) => {
    audioEngine.playSfx('click');
    let pool = BR_QUEST_QUESTIONS.filter((q) => {
      if (filter.scope === 'nacional') return true;
      if (filter.pillar && q.pillar !== filter.pillar) return false;
      if (filter.regionId && q.regionId !== filter.regionId) return false;
      if (filter.stateId && q.stateId !== filter.stateId) return false;
      return true;
    });

    if (selectedDifficultyTier !== 'todos') {
      const tierFiltered = pool.filter((q) => getTierFromDifficulty(q.difficulty) === selectedDifficultyTier);
      if (tierFiltered.length >= 2) pool = tierFiltered;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setActiveQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setScore(0);
    setEarnedPoints(0);
    setEarnedXp(0);
    setActiveBatchTitle(title);
    setActiveBatchDesc(desc);
    setCorrectAnswersList([]);
    setTabMode('playing');
  };

  const handleSelectOption = (idx: number) => {
    if (isConfirmed) return;
    setSelectedOption(idx);
    setIsConfirmed(true);

    const q = activeQuestions[currentIdx];
    const isCorrect = idx === q.correctIndex;
    const tierMeta = getTierMetrics(q.difficulty);

    if (isCorrect) {
      audioEngine.playSfx('badge');
      setScore((prev) => prev + 1);
      setEarnedPoints((prev) => prev + (q.points || tierMeta.points));
      setEarnedXp((prev) => prev + (q.xp || tierMeta.xp));
    } else {
      audioEngine.playSfx('click');
    }

    setCorrectAnswersList((prev) => [...prev, { question: q, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    } else {
      if (earnedXp > 0 && onGainXp) {
        onGainXp(earnedXp);
      }
      setTabMode('result');
    }
  };

  return {
    tabMode,
    setTabMode,
    activeQuestions,
    currentIdx,
    selectedOption,
    isConfirmed,
    score,
    earnedPoints,
    earnedXp,
    activeBatchTitle,
    activeBatchDesc,
    correctAnswersList,
    handleStartChallenge,
    handleSelectOption,
    handleNextQuestion,
  };
}
