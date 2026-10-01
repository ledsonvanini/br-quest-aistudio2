import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuth } from '../../services/auth/AuthContext';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import {
  EducationTier,
  QuestThemePillar,
  getTierMetrics,
} from '../../data/brQuestQuestionsData';
import { audioEngine } from '../../lib/audioSynth';
import { BrQuestSidebar, QuestCategory } from './BrQuestSidebar';
import { BrQuestHubContent } from './BrQuestHubContent';
import { BrQuestQuizPlaying } from './BrQuestQuizPlaying';
import { BrQuestQuizResult } from './BrQuestQuizResult';
import { useBrQuestQuiz } from './useBrQuestQuiz';
import { getBrQuestSubTabs, getBrQuestPillarBadge, getRankTitle } from './brQuestHelpers';

interface BrQuestHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGainXp?: (amount: number) => void;
  initialPillar?: QuestThemePillar | 'nacional' | null;
  onSelectGuardian?: (guardianId: string) => void;
  userLocation?: { stateId: string; stateName: string; regionId?: string } | null;
  playerLevel?: number;
  playerXp?: number;
  completedStatesCount?: number;
  dailyStreak?: number;
}

export const BrQuestHubModal: React.FC<BrQuestHubModalProps> = ({
  isOpen,
  onClose,
  onGainXp,
  initialPillar,
  onSelectGuardian,
  userLocation,
  playerLevel: propLevel,
  playerXp: propXp,
  completedStatesCount: propCompletedCount,
  dailyStreak: propStreak,
}) => {
  const { user, isGuest } = useAuth();
  const [activeCategory, setActiveCategory] = useState<QuestCategory>('nacional');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [selectedDifficultyTier, setSelectedDifficultyTier] = useState<EducationTier | 'todos'>('todos');
  const [guardianSearchQuery, setGuardianSearchQuery] = useState('');

  const quiz = useBrQuestQuiz(selectedDifficultyTier, onGainXp);

  useEffect(() => {
    if (initialPillar) {
      if (initialPillar === 'nacional') {
        setActiveCategory('nacional');
      } else {
        setActiveCategory('pilares');
        setActiveSubTab(initialPillar);
      }
    }
  }, [initialPillar]);

  const playerLevel = propLevel ?? 1;
  const playerXp = propXp ?? 0;
  const completedStatesCount = propCompletedCount ?? 0;
  const dailyStreak = propStreak ?? 1;
  const territorialPercent = Math.min(100, Math.round((completedStatesCount / 27) * 100));
  const currentLevelProgressPercent = Math.min(100, (playerXp % 1000) / 10);

  const allGuardiansList = useMemo(() => GUARDIANS_DATA, []);

  const filteredGuardians = useMemo(() => {
    return allGuardiansList.filter((g) => {
      const q = guardianSearchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.stateNamePt.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.guardianName.toLowerCase().includes(q) ||
        g.capitalPt.toLowerCase().includes(q);
      const matchSub = activeSubTab === 'all' || g.regionId === activeSubTab;
      return matchSearch && matchSub;
    });
  }, [allGuardiansList, guardianSearchQuery, activeSubTab]);

  const subTabs = getBrQuestSubTabs(activeCategory);
  const currentQ = quiz.activeQuestions[quiz.currentIdx];
  const currentMetrics = currentQ
    ? {
        points: currentQ.points || getTierMetrics(currentQ.difficulty).points,
        xp: currentQ.xp || getTierMetrics(currentQ.difficulty).xp,
        shortBadge: getTierMetrics(currentQ.difficulty).shortBadge,
        enemCategory: getTierMetrics(currentQ.difficulty).enemCategory,
      }
    : undefined;

  if (!isOpen) return null;

  return (
    <div
      id="modal-brquest-backdrop"
      className="modal-brquest-backdrop fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-brquest-container"
        className="modal-brquest-container painel-brquest-unificado relative w-[96vw] max-w-7xl 2xl:max-w-[1560px] h-[92vh] max-h-[940px] flex flex-col bg-gradient-to-b from-slate-950 via-[#0a1122] to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 my-auto overflow-hidden"
      >
        {/* Ornamentos de canto estilo RPG */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

        {/* Header Superior do BrQuest Hub */}
        <header className="header-brquest-hub flex items-center justify-between gap-3 pb-3 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-sm flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-serif font-black tracking-wide text-slate-100 flex items-center gap-2">
                  <span>BrQuest • Avaliação & Hub Pedagógico</span>
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Sparkles className="w-3 h-3" />
                  BNCC & ENEM
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-300 font-sans line-clamp-1">
                Provas científicas multidisciplinares, trilhas temáticas e conquista dos 27 Guardiões
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-fechar-brquest-modal"
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                onClose();
              }}
              className="btn-fechar-brquest-modal p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 text-slate-300 transition-all cursor-pointer shadow-md"
              title="Fechar BrQuest Hub"
              aria-label="Fechar Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Corpo Principal do Hub */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 pt-3 overflow-hidden">
          {quiz.tabMode === 'hub' && (
            <>
              <BrQuestSidebar
                user={user}
                isGuest={isGuest}
                playerLevel={playerLevel}
                playerXp={playerXp}
                completedStatesCount={completedStatesCount}
                dailyStreak={dailyStreak}
                territorialPercent={territorialPercent}
                currentLevelProgressPercent={currentLevelProgressPercent}
                rankTitle={getRankTitle(playerLevel)}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => {
                  setActiveCategory(cat);
                  setActiveSubTab('all');
                }}
                selectedDifficultyTier={selectedDifficultyTier}
                onSelectDifficultyTier={setSelectedDifficultyTier}
              />

              <main className="area-conteudo-brquest flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
                {/* Barra de Sub-Navegação e Filtro */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar-gold pb-1 shrink-0">
                  <div className="flex items-center gap-1.5 flex-nowrap">
                    {subTabs.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          audioEngine.playSfx('click');
                          setActiveSubTab(id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                          activeSubTab === id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  {activeCategory === 'guardioes' && (
                    <div className="relative shrink-0 w-36 sm:w-48">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar UF..."
                        value={guardianSearchQuery}
                        onChange={(e) => setGuardianSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                <BrQuestHubContent
                  activeCategory={activeCategory}
                  activeSubTab={activeSubTab}
                  selectedDifficultyTier={selectedDifficultyTier}
                  userLocation={userLocation ? { regionId: userLocation.regionId || 'sudeste' } : null}
                  filteredGuardians={filteredGuardians}
                  guardianSearchQuery={guardianSearchQuery}
                  setGuardianSearchQuery={setGuardianSearchQuery}
                  onStartChallenge={quiz.handleStartChallenge}
                  onSelectGuardian={(g) => onSelectGuardian?.(g.id)}
                  onClose={onClose}
                />
              </main>
            </>
          )}

          {quiz.tabMode === 'playing' && currentQ && currentMetrics && (
            <BrQuestQuizPlaying
              currentQ={currentQ}
              currentMetrics={currentMetrics}
              currentIdx={quiz.currentIdx}
              totalQuestions={quiz.activeQuestions.length}
              score={quiz.score}
              isConfirmed={quiz.isConfirmed}
              selectedOption={quiz.selectedOption}
              onSelectOption={quiz.handleSelectOption}
              onNextQuestion={quiz.handleNextQuestion}
              onQuitToHub={() => quiz.setTabMode('hub')}
              getPillarBadge={getBrQuestPillarBadge}
            />
          )}

          {quiz.tabMode === 'result' && (
            <BrQuestQuizResult
              score={quiz.score}
              totalQuestions={quiz.activeQuestions.length}
              earnedPoints={quiz.earnedPoints}
              earnedXp={quiz.earnedXp}
              activeBatchTitle={quiz.activeBatchTitle}
              activeBatchDesc={quiz.activeBatchDesc}
              correctAnswersList={quiz.correctAnswersList}
              onPlayAgain={() =>
                quiz.handleStartChallenge(
                  quiz.activeBatchTitle,
                  quiz.activeBatchDesc,
                  { scope: 'nacional' },
                  quiz.activeQuestions.length
                )
              }
              onReturnToHub={() => quiz.setTabMode('hub')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default BrQuestHubModal;
