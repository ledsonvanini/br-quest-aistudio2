import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  Flame,
  Globe2,
  Compass,
  Thermometer,
  Trees,
  Users,
  Building2,
  Radio,
  RotateCcw,
  BookOpen,
  Map,
  Filter,
  Layers,
  Zap,
  Shield,
  Star,
  Info,
  ArrowLeft,
  Search,
  User,
  Check,
  Target,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import {
  BR_QUEST_QUESTIONS,
  BrQuestQuestion,
  QuestScope,
  QuestThemePillar,
  EducationTier,
  getRandomQuizBatch,
  getTierMetrics,
} from '../../data/brQuestQuestionsData';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { GuardianData } from '../../types';
import { audioEngine } from '../../lib/audioSynth';
import { triggerConfetti } from '../../lib/storage';
import { useAuth } from '../../services/auth/AuthContext';

interface BrQuestHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuardian: (guardian: GuardianData) => void;
  onGainXp: (xp: number) => void;
  playerLevel?: number;
  playerXp?: number;
  completedStatesCount?: number;
  dailyStreak?: number;
  userLocation?: {
    stateId: string;
    stateName: string;
    regionId: string;
  } | null;
  initialPillar?: QuestThemePillar | 'nacional' | null;
}

type TabMode = 'hub' | 'playing' | 'result';
type QuestCategory = 'nacional' | 'pilares' | 'trilhas' | 'guardioes';

export const BrQuestHubModal: React.FC<BrQuestHubModalProps> = ({
  isOpen,
  onClose,
  onSelectGuardian,
  onGainXp,
  playerLevel = 1,
  playerXp = 0,
  completedStatesCount = 0,
  dailyStreak = 1,
  userLocation = null,
  initialPillar = null,
}) => {
  const { user, isGuest } = useAuth();
  const [tabMode, setTabMode] = useState<TabMode>('hub');
  const [activeCategory, setActiveCategory] = useState<QuestCategory>('nacional');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [selectedDifficultyTier, setSelectedDifficultyTier] = useState<EducationTier | 'todos'>('todos');
  const [guardianSearchQuery, setGuardianSearchQuery] = useState<string>('');
  
  // Quiz Execution States
  const [activeBatchTitle, setActiveBatchTitle] = useState<string>('Grande Prova do Brasil');
  const [activeBatchDesc, setActiveBatchDesc] = useState<string>(
    'Desafio multidisciplinar integrando Clima, Biodiversidade, Demografia, Geopolítica e Cultura.'
  );
  const [activeQuestions, setActiveQuestions] = useState<BrQuestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [correctAnswersList, setCorrectAnswersList] = useState<{
    question: BrQuestQuestion;
    isCorrect: boolean;
  }[]>([]);

  // Calculate rank title and progression
  const territorialPercent = Math.min(100, Math.round((completedStatesCount / 27) * 100));
  const currentLevelProgressPercent = Math.min(100, Math.round(((playerXp % 500) / 500) * 100));
  const rankTitle =
    playerLevel >= 10
      ? 'Guardião Supremo'
      : playerLevel >= 5
      ? 'Pesquisador Sênior'
      : playerLevel >= 3
      ? 'Cartógrafo Aprendiz'
      : 'Navegador Estudante';

  const handleStartChallenge = (
    title: string,
    desc: string,
    filter: {
      scope?: QuestScope;
      pillar?: QuestThemePillar;
      regionId?: string;
      tier?: EducationTier | 'todos';
    },
    count = 5
  ) => {
    audioEngine.playSfx('click');
    const tierToUse = filter.tier ?? selectedDifficultyTier;
    const batch = getRandomQuizBatch(count, {
      ...filter,
      tier: tierToUse,
    });
    setActiveBatchTitle(title);
    setActiveBatchDesc(desc);
    setActiveQuestions(batch);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setScore(0);
    setEarnedPoints(0);
    setEarnedXp(0);
    setCorrectAnswersList([]);
    setTabMode('playing');
  };

  // Open with specific initial pillar if provided
  useEffect(() => {
    if (!isOpen) {
      setTabMode('hub');
      return;
    }

    if (initialPillar === 'nacional') {
      setActiveCategory('nacional');
      setActiveSubTab('all');
    } else if (initialPillar) {
      setActiveCategory('pilares');
      setActiveSubTab(initialPillar);
    }
  }, [isOpen, initialPillar]);

  // Reset subtab on category switch
  const handleSelectCategory = (cat: QuestCategory) => {
    setActiveCategory(cat);
    setActiveSubTab('all');
  };

  if (!isOpen) return null;

  const currentQ = activeQuestions[currentIdx];
  const currentMetrics = currentQ ? getTierMetrics(currentQ.difficulty) : null;

  const handleSelectOption = (idx: number) => {
    if (isConfirmed) return;
    setSelectedOption(idx);
    setIsConfirmed(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      audioEngine.playSfx('badge');
      setScore((prev) => prev + 1);
      const points = currentQ.points || currentMetrics?.points || 100;
      const xp = currentQ.xp || currentMetrics?.xp || 50;
      setEarnedPoints((prev) => prev + points);
      setEarnedXp((prev) => prev + xp);
    } else {
      audioEngine.playSfx('click');
    }

    setCorrectAnswersList((prev) => [
      ...prev,
      {
        question: currentQ,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    audioEngine.playSfx('click');
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    } else {
      // Finished quiz
      setTabMode('result');
      if (score >= Math.ceil(activeQuestions.length * 0.6)) {
        triggerConfetti();
        audioEngine.playSfx('fanfare');
      }
      if (earnedXp > 0) {
        onGainXp(earnedXp);
      }
    }
  };

  const getPillarBadge = (pillar: QuestThemePillar) => {
    switch (pillar) {
      case 'clima':
        return { label: 'Clima & Rios Voadores', icon: Thermometer, color: 'text-sky-400 bg-sky-950/80 border-sky-500/50' };
      case 'biodiversidade':
        return { label: 'Biomas & Espécies', icon: Trees, color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50' };
      case 'demografia':
        return { label: 'Demografia & Censo IBGE', icon: Users, color: 'text-purple-400 bg-purple-950/80 border-purple-500/50' };
      case 'geopolitica':
        return { label: 'Geopolítica & Fronteiras', icon: Building2, color: 'text-indigo-400 bg-indigo-950/80 border-indigo-500/50' };
      case 'geografia':
        return { label: 'Relevo & Bacias ANA', icon: Map, color: 'text-amber-400 bg-amber-950/80 border-amber-500/50' };
      case 'cultura_musica':
        return { label: 'Cultura & Patrimônio', icon: Radio, color: 'text-rose-400 bg-rose-950/80 border-rose-500/50' };
      default:
        return { label: 'Conhecimento Geral', icon: Sparkles, color: 'text-amber-300 bg-amber-950/80 border-amber-500/50' };
    }
  };

  // Sub-tabs based on active category
  const getSubTabs = () => {
    switch (activeCategory) {
      case 'nacional':
        return [
          { id: 'all', label: '⚔️ Visão Geral da Prova' },
          { id: 'simulado', label: '⚡ Simulado Rápido (3 Questões)' },
          { id: 'completo', label: '🏆 Grande Prova (6 Questões)' },
        ];
      case 'pilares':
        return [
          { id: 'all', label: 'Todos os 6 Pilares' },
          { id: 'clima', label: '☀️ Clima' },
          { id: 'biodiversidade', label: '🌿 Biomas' },
          { id: 'demografia', label: '👥 Demografia' },
          { id: 'geopolitica', label: '🏛️ Geopolítica' },
          { id: 'geografia', label: '🗺️ Relevo & Águas' },
          { id: 'cultura_musica', label: '📻 Cultura' },
        ];
      case 'trilhas':
        return [
          { id: 'all', label: 'Todas as 5 Regiões' },
          { id: 'norte', label: 'Norte (7)' },
          { id: 'nordeste', label: 'Nordeste (9)' },
          { id: 'centro_oeste', label: 'Centro-Oeste (4)' },
          { id: 'sudeste', label: 'Sudeste (4)' },
          { id: 'sul', label: 'Sul (3)' },
        ];
      case 'guardioes':
        return [
          { id: 'all', label: 'Todas as 27 UFs' },
          { id: 'norte', label: 'Norte' },
          { id: 'nordeste', label: 'Nordeste' },
          { id: 'centro_oeste', label: 'Centro-Oeste' },
          { id: 'sudeste', label: 'Sudeste' },
          { id: 'sul', label: 'Sul' },
        ];
      default:
        return [{ id: 'all', label: 'Geral' }];
    }
  };

  const subTabs = getSubTabs();

  // Filter guardians by region and query
  const filteredGuardians = GUARDIANS_DATA.filter((g) => {
    if (activeCategory === 'guardioes' && activeSubTab !== 'all') {
      if (g.regionId.toLowerCase() !== activeSubTab.toLowerCase()) return false;
    }
    if (!guardianSearchQuery.trim()) return true;
    const q = guardianSearchQuery.toLowerCase();
    return (
      g.id.toLowerCase().includes(q) ||
      g.stateNamePt.toLowerCase().includes(q) ||
      g.guardianName.toLowerCase().includes(q) ||
      g.capitalPt.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="modal-brquest-hub"
      className="modal-brquest-backdrop modal-brquest-hub fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-brquest-container"
        className="modal-brquest-container painel-brquest-unificado relative w-[98vw] sm:w-[95vw] md:w-[92vw] lg:w-[90vw] max-w-6xl h-[95vh] sm:h-[94vh] max-h-[96vh] flex flex-col bg-gradient-to-b from-slate-950 via-[#0a1122] to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 my-auto overflow-hidden"
      >
        {/* Cantos Ornamentais RPG Pergaminho */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />

        {/* 1. Header do Modal (Idêntico ao Padrão de Excelência de Perfil e Jornada) */}
        <div className="cabecalho-modal-brquest flex items-center justify-between pb-3 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-wide flex items-center gap-1.5">
                  BrQuest Edu • Desafios do Brasil
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Nv. {playerLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Questões estruturadas por nível pedagógico e área com dados oficiais IBGE, INPE, ANA e MapBiomas 2024/2025.
              </p>
            </div>
          </div>

          <button
            id="btn-fechar-brquest-hub"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-modal-brquest text-slate-300 hover:text-slate-950 p-2 rounded-xl bg-slate-900 hover:bg-amber-500 border border-amber-500/40 transition z-30 cursor-pointer shadow-md"
            title="Fechar BrQuest Edu"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 2. CORPO PRINCIPAL EM 2 COLUNAS (Wide-Screen Optimized) */}
        <div className="corpo-duas-colunas-brquest flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 pt-3 overflow-hidden">
          {tabMode === 'hub' && (
            <>
              {/* ========================================================================= */}
              {/* COLUNA 1 (Esquerda): Perfil Estudante, Categorias & Níveis BNCC Empilhados */}
              {/* ========================================================================= */}
              <aside className="coluna-lateral-brquest w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
                {/* 1.1 Card de Perfil Resumido do Estudante & XP */}
                <div className="card-estudante-resumo p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-2.5">
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

                {/* 1.2 Categorias Principais Empilhadas (Vertical Nav List) */}
                <div className="categorias-empilhadas-brquest flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                    Modos de Desafio
                  </span>

                  {/* Categoria 1: Prova Nacional */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('nacional')}
                    className={`btn-aba-brquest-nacional w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                      activeCategory === 'nacional'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="w-4 h-4 shrink-0" />
                      <span className="text-xs">⚔️ Prova Nacional</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          activeCategory === 'nacional' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        6 Áreas
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </button>

                  {/* Categoria 2: Áreas do Conhecimento */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('pilares')}
                    className={`btn-aba-brquest-pilares w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                      activeCategory === 'pilares'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="text-xs">📚 Áreas Científicas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          activeCategory === 'pilares' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        6 Pilares
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </button>

                  {/* Categoria 3: Trilhas Regionais */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('trilhas')}
                    className={`btn-aba-brquest-trilhas w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                      activeCategory === 'trilhas'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 shrink-0" />
                      <span className="text-xs">🔥 Trilhas Regionais</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          activeCategory === 'trilhas' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        5 Regiões
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </button>

                  {/* Categoria 4: 27 Guardiões Estaduais */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('guardioes')}
                    className={`btn-aba-brquest-guardioes w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                      activeCategory === 'guardioes'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 shrink-0" />
                      <span className="text-xs">🏆 27 Guardiões UFs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          activeCategory === 'guardioes' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        27 UFs
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </button>
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
                        setSelectedDifficultyTier('todos');
                      }}
                      className={`w-full p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                        selectedDifficultyTier === 'todos'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950/80 text-slate-300 hover:text-slate-100 border border-slate-800'
                      }`}
                    >
                      <span>🌐 Todos os Níveis (Misto)</span>
                      <span className="text-[10px] font-mono opacity-80">Geral</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        setSelectedDifficultyTier('fundamental');
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
                        setSelectedDifficultyTier('medio');
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
                        setSelectedDifficultyTier('avancado');
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

              {/* ========================================================================= */}
              {/* COLUNA 2 (Direita): SubTabs no Topo & Módulos Expandidos                   */}
              {/* ========================================================================= */}
              <main className="coluna-conteudo-brquest flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950/70 rounded-2xl border border-amber-500/30 p-3 sm:p-4 overflow-hidden shadow-inner">
                {/* Barra de SubTabs no Topo da Coluna 2 */}
                <div className="subtabs-topo-brquest flex items-center gap-1.5 pb-2.5 mb-3 border-b border-slate-800 overflow-x-auto custom-scrollbar-gold shrink-0">
                  {subTabs.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        setActiveSubTab(st.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        activeSubTab === st.id
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>

                {/* Conteúdo com Scroll Suave dependendo da Categoria Ativa */}
                <div className="conteudo-subtab-scroll flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar-gold">
                  {/* CATEGORIA 1: PROVA NACIONAL */}
                  {activeCategory === 'nacional' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      {/* Banner Principal da Grande Prova */}
                      <div className="card-desafio-brquest relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-400/80 shadow-md group overflow-hidden">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-35 transition-opacity pointer-events-none">
                          <Globe2 className="w-36 h-36 text-amber-300" />
                        </div>

                        <div className="relative z-10 space-y-2.5 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow">
                              Desafio Oficial Brasil
                            </span>
                            <span className="text-xs text-amber-300 font-mono">6 Questões Multidisciplinares</span>
                          </div>

                          <h3 className="font-serif font-black text-base sm:text-xl text-amber-100">
                            ⚔️ A Grande Prova do Brasil
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                            Simulado nacional integrando Rios Voadores, ZCAS, biomas endêmicos, demografia Censo IBGE 2024/2025 e matrizes geopolíticas territoriais.
                          </p>

                          <div className="pt-2 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleStartChallenge(
                                  'Grande Prova do Brasil',
                                  'Desafio multidisciplinar integrando Clima, Biodiversidade, Demografia, Geopolítica e Cultura.',
                                  { scope: 'nacional' },
                                  6
                                )
                              }
                              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
                            >
                              <Trophy className="w-4 h-4" />
                              <span>Iniciar Grande Prova (6 Qs)</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStartChallenge(
                                  'Simulado Rápido do Brasil',
                                  'Versão ágil de 3 questões com telemetria simplificada.',
                                  { scope: 'nacional' },
                                  3
                                )
                              }
                              className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Zap className="w-4 h-4" />
                              <span>Simulado Rápido (3 Qs)</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Grade das 6 Especialidades Científicas Cobertas */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                          Eixos Temáticos Incluídos na Avaliação
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-sky-400 shrink-0" />
                            <span className="text-slate-200">Clima & Rios Voadores</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                            <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-slate-200">Biomas & Biodiversidade</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-slate-200">Demografia Censo 2025</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="text-slate-200">Geopolítica & Fronteiras</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                            <Map className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-slate-200">Geografia & Bacias ANA</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                            <Radio className="w-4 h-4 text-rose-400 shrink-0" />
                            <span className="text-slate-200">Cultura & Patrimônio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CATEGORIA 2: ÁREAS DO CONHECIMENTO (6 PILARES) */}
                  {activeCategory === 'pilares' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>Módulos por Área Científica & Matriz Pedagógica</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">6 Especialidades</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {[
                          {
                            pilar: 'clima' as QuestThemePillar,
                            label: 'Clima & Atmosfera',
                            desc: 'Rios Voadores, ZCAS, frentes polares e telemetria CPTEC/ECMWF 2025.',
                            icon: Thermometer,
                            color: 'border-sky-500/40 hover:border-sky-400 bg-gradient-to-br from-sky-950/40 to-slate-900',
                            iconColor: 'text-sky-400',
                          },
                          {
                            pilar: 'biodiversidade' as QuestThemePillar,
                            label: 'Biomas & Biodiversidade',
                            desc: 'Fauna endêmica, flora ameaçada e os 6 biomas do Brasil (MapBiomas Col. 9).',
                            icon: Trees,
                            color: 'border-emerald-500/40 hover:border-emerald-400 bg-gradient-to-br from-emerald-950/40 to-slate-900',
                            iconColor: 'text-emerald-400',
                          },
                          {
                            pilar: 'demografia' as QuestThemePillar,
                            label: 'Demografia IBGE',
                            desc: 'Censo 2024/2025, pirâmide etária, povos originários e indicadores IDHM.',
                            icon: Users,
                            color: 'border-purple-500/40 hover:border-purple-400 bg-gradient-to-br from-purple-950/40 to-slate-900',
                            iconColor: 'text-purple-400',
                          },
                          {
                            pilar: 'geopolitica' as QuestThemePillar,
                            label: 'Geopolítica & Fronteiras',
                            desc: 'Tratados territoriais, 10 países vizinhos, Amazônia Azul e infraestrutura.',
                            icon: Building2,
                            color: 'border-indigo-500/40 hover:border-indigo-400 bg-gradient-to-br from-indigo-950/40 to-slate-900',
                            iconColor: 'text-indigo-400',
                          },
                          {
                            pilar: 'geografia' as QuestThemePillar,
                            label: 'Geografia & Relevo',
                            desc: 'Bacias hidrográficas ANA, divisores de água, serras e depressões.',
                            icon: Map,
                            color: 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-br from-amber-950/40 to-slate-900',
                            iconColor: 'text-amber-400',
                          },
                          {
                            pilar: 'cultura_musica' as QuestThemePillar,
                            label: 'Cultura & Tradições',
                            desc: 'Patrimônio histórico IPHAN, ritmos regionais, culinária e rádio tradicional.',
                            icon: Radio,
                            color: 'border-rose-500/40 hover:border-rose-400 bg-gradient-to-br from-rose-950/40 to-slate-900',
                            iconColor: 'text-rose-400',
                          },
                        ]
                          .filter((item) => activeSubTab === 'all' || item.pilar === activeSubTab)
                          .map(({ pilar, label, desc, icon: Icon, color, iconColor }) => (
                            <button
                              key={pilar}
                              onClick={() =>
                                handleStartChallenge(
                                  `Módulo: ${label}`,
                                  `Questões estruturadas sobre ${label} com dados oficiais atualizados.`,
                                  { pillar: pilar },
                                  5
                                )
                              }
                              className={`p-3.5 rounded-2xl border ${color} text-left transition hover:scale-[1.01] cursor-pointer flex flex-col justify-between gap-2.5 shadow-sm group`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                                  <Icon className={`w-5 h-5 ${iconColor} group-hover:scale-110 transition-transform`} />
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-amber-300">
                                  5 Questões
                                </span>
                              </div>

                              <div>
                                <div className="font-serif font-bold text-sm text-slate-100 group-hover:text-amber-200">
                                  {label}
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed font-sans">
                                  {desc}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                                <span className="text-amber-400/90 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                  <span>Iniciar Módulo</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                                <span className="text-slate-400">
                                  {selectedDifficultyTier === 'todos' ? 'Misto' : selectedDifficultyTier}
                                </span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* CATEGORIA 3: TRILHAS REGIONAIS (5 REGIÕES) */}
                  {activeCategory === 'trilhas' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                          <Flame className="w-4 h-4 text-amber-400" />
                          <span>Expedições pelas 5 Grandes Regiões</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Macro-Regiões IBGE</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {[
                          {
                            id: 'norte',
                            title: 'Trilha do Norte',
                            sub: 'Amazônia, Bacia Amazônica, Carimbó e biodiversidade equatorial.',
                            border: 'border-emerald-500/50 hover:border-emerald-400',
                            bg: 'from-emerald-950/60 to-slate-900',
                            badge: 'Norte (7 UFs)',
                          },
                          {
                            id: 'nordeste',
                            title: 'Trilha do Nordeste',
                            sub: 'Caatinga, Sertão, Rio São Francisco, Frevo e culinária litorânea.',
                            border: 'border-amber-500/50 hover:border-amber-400',
                            bg: 'from-amber-950/60 to-slate-900',
                            badge: 'Nordeste (9 UFs)',
                          },
                          {
                            id: 'centro_oeste',
                            title: 'Trilha do Centro-Oeste',
                            sub: 'Pantanal, Cerrado, Planalto Central, bacias e agronegócio.',
                            border: 'border-yellow-500/50 hover:border-yellow-400',
                            bg: 'from-yellow-950/60 to-slate-900',
                            badge: 'Centro-Oeste (4 UFs)',
                          },
                          {
                            id: 'sudeste',
                            title: 'Trilha do Sudeste',
                            sub: 'Mata Atlântica, Serra do Mar, Metrópoles e Patrimônio Colonial.',
                            border: 'border-blue-500/50 hover:border-blue-400',
                            bg: 'from-blue-950/60 to-slate-900',
                            badge: 'Sudeste (4 UFs)',
                          },
                          {
                            id: 'sul',
                            title: 'Trilha do Sul',
                            sub: 'Pampa, Mata de Araucárias, Serras Gaúchas e bacias do Prata.',
                            border: 'border-cyan-500/50 hover:border-cyan-400',
                            bg: 'from-cyan-950/60 to-slate-900',
                            badge: 'Sul (3 UFs)',
                          },
                        ]
                          .filter((item) => activeSubTab === 'all' || item.id === activeSubTab)
                          .map((trilha) => {
                            const isUserRegion = userLocation && userLocation.regionId.toLowerCase() === trilha.id.toLowerCase();
                            return (
                              <button
                                key={trilha.id}
                                onClick={() =>
                                  handleStartChallenge(
                                    trilha.title,
                                    `Questões específicas sobre a geografia, biomas e cultura da região ${trilha.badge}.`,
                                    { regionId: trilha.id as any },
                                    5
                                  )
                                }
                                className={`p-3.5 rounded-2xl bg-gradient-to-br ${trilha.bg} border ${trilha.border} text-left transition hover:scale-[1.01] cursor-pointer flex flex-col justify-between gap-2.5 group shadow-sm`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded-md bg-black/40 border border-amber-500/30">
                                      {trilha.badge}
                                    </span>
                                    {isUserRegion && (
                                      <span className="text-[9px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                                        📍 Sua Região
                                      </span>
                                    )}
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition" />
                                </div>
                                <div>
                                  <h5 className="font-serif font-bold text-sm text-slate-100 mt-1">
                                    {trilha.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-300 font-sans line-clamp-2 mt-0.5 leading-relaxed">
                                    {trilha.sub}
                                  </p>
                                </div>
                                <div className="text-[11px] font-mono text-amber-400 font-bold pt-1 border-t border-slate-800/60">
                                  Iniciar Trilha Regional →
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* CATEGORIA 4: 27 GUARDIÕES ESTADUAIS */}
                  {activeCategory === 'guardioes' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      {/* Campo de Busca Rápida de Guardião */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={guardianSearchQuery}
                            onChange={(e) => setGuardianSearchQuery(e.target.value)}
                            placeholder="Buscar UF, estado, capital ou Guardião..."
                            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-amber-400">
                          {filteredGuardians.length} de 27 Guardiões
                        </span>
                      </div>

                      {/* Grade dos 27 Guardiões */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {filteredGuardians.map((guardian) => (
                          <button
                            key={guardian.id}
                            onClick={() => {
                              audioEngine.playSfx('travel');
                              onClose();
                              onSelectGuardian(guardian);
                            }}
                            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400 hover:bg-slate-850 text-left transition hover:scale-[1.01] cursor-pointer group shadow-sm flex flex-col justify-between gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={`/flags/${guardian.id.toLowerCase()}.svg`}
                                  alt={guardian.stateNamePt}
                                  className="w-5 h-3.5 object-cover rounded border border-slate-700 shadow-xs"
                                />
                                <span className="font-mono font-bold text-xs text-amber-300">{guardian.id}</span>
                              </div>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400 capitalize">
                                {guardian.regionId}
                              </span>
                            </div>

                            <div>
                              <div className="font-serif font-bold text-xs text-slate-100 truncate group-hover:text-amber-200">
                                {guardian.stateNamePt}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {guardian.guardianName}
                              </div>
                            </div>

                            <div className="text-[10px] font-mono text-sky-300/90 flex items-center justify-between pt-1 border-t border-slate-800/80">
                              <span>Cap. {guardian.capitalPt}</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </>
          )}

          {/* ========================================================================= */}
          {/* MODO JOGANDO QUIZ (PLAYING) - 2 COLUNAS DE TELEMETRIA E PERGUNTA          */}
          {/* ========================================================================= */}
          {tabMode === 'playing' && currentQ && currentMetrics && (
            <div className="modo-jogando-brquest flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 overflow-hidden animate-in zoom-in-95 duration-150">
              {/* Coluna 1 da Prova: Telemetria Pedagógica */}
              <aside className="w-full md:w-72 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                      Telemetria da Prova
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                      Q{currentIdx + 1} de {activeQuestions.length}
                    </span>
                  </div>

                  {/* Pilar Temático */}
                  {(() => {
                    const badge = getPillarBadge(currentQ.pillar);
                    const Icon = badge.icon;
                    return (
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${badge.color}`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{badge.label}</div>
                          <div className="text-[9px] opacity-80 font-mono">{currentMetrics.enemCategory}</div>
                        </div>
                      </div>
                    );
                  })()}

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
                        style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTabMode('hub')}
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

                {/* Alternativas (Grid 2x2 Auto-Contido) */}
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
                        onClick={() => handleSelectOption(idx)}
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
                        onClick={handleNextQuestion}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>{currentIdx + 1 < activeQuestions.length ? 'Próxima Questão' : 'Ver Resultado'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </main>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODO RESULTADO FINAL (RESULT) - 2 COLUNAS DE PONTUAÇÃO E REVISÃO          */}
          {/* ========================================================================= */}
          {tabMode === 'result' && (
            <div className="modo-resultado-brquest flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 overflow-hidden animate-in zoom-in-95 duration-150">
              {/* Coluna 1: Troféu & Recompensas */}
              <aside className="w-full md:w-72 shrink-0 flex flex-col justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm text-center">
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
                      <span className="text-emerald-400 font-bold">{score} de {activeQuestions.length}</span>
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
                    onClick={() => setTabMode('hub')}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-serif text-xs transition cursor-pointer"
                  >
                    Voltar ao Hub
                  </button>
                  <button
                    onClick={() =>
                      handleStartChallenge(
                        activeBatchTitle,
                        activeBatchDesc,
                        { scope: 'nacional' },
                        activeQuestions.length
                      )
                    }
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
                    {score}/{activeQuestions.length} corretas ({Math.round((score / Math.max(1, activeQuestions.length)) * 100)}%)
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
          )}
        </div>
      </div>
    </div>
  );
};
