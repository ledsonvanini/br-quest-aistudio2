import React, { useState, useMemo, useEffect } from 'react';
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
  MapPin,
  Map,
} from 'lucide-react';
import {
  BR_QUEST_QUESTIONS,
  BrQuestQuestion,
  QuestScope,
  QuestThemePillar,
  getRandomQuizBatch,
} from '../../data/brQuestQuestionsData';
import { GUARDIANS_DATA } from '../../data/guardiansData';
import { GuardianData } from '../../types';
import { audioEngine } from '../../lib/audioSynth';
import { triggerConfetti } from '../../lib/storage';

interface BrQuestHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuardian: (guardian: GuardianData) => void;
  onGainXp: (xp: number) => void;
  playerLevel?: number;
  playerXp?: number;
  initialPillar?: QuestThemePillar | 'nacional' | null;
}

type TabMode = 'hub' | 'playing' | 'guardians_grid' | 'result';

export const BrQuestHubModal: React.FC<BrQuestHubModalProps> = ({
  isOpen,
  onClose,
  onSelectGuardian,
  onGainXp,
  playerLevel = 1,
  playerXp = 0,
  initialPillar = null,
}) => {
  const [tabMode, setTabMode] = useState<TabMode>('hub');
  const [activeBatchTitle, setActiveBatchTitle] = useState<string>('Grande Prova do Brasil');
  const [activeBatchDesc, setActiveBatchDesc] = useState<string>('Desafio multidisciplinar integrando Clima, Biodiversidade, Demografia, Geopolítica e Cultura.');
  const [activeQuestions, setActiveQuestions] = useState<BrQuestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  const handleStartChallenge = (
    title: string,
    desc: string,
    filter: { scope?: QuestScope; pillar?: QuestThemePillar; regionId?: string },
    count = 5
  ) => {
    audioEngine.playSfx('click');
    const batch = getRandomQuizBatch(count, filter);
    setActiveBatchTitle(title);
    setActiveBatchDesc(desc);
    setActiveQuestions(batch);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setScore(0);
    setEarnedXp(0);
    setTabMode('playing');
  };

  // Responde à abertura com pilar inicial específico
  useEffect(() => {
    if (!isOpen) {
      setTabMode('hub');
      return;
    }

    if (initialPillar === 'nacional') {
      handleStartChallenge(
        'Grande Prova do Brasil',
        'Desafio multidisciplinar integrando Clima, Biodiversidade, Demografia, Geopolítica e Cultura.',
        { scope: 'nacional' },
        6
      );
    } else if (initialPillar === 'clima') {
      handleStartChallenge(
        'Desafio de Clima & Atmosfera',
        'Avaliação sobre Rios Voadores, ZCAS, frentes frias, massas de ar e telemetria ECMWF.',
        { pillar: 'clima' },
        5
      );
    } else if (initialPillar === 'biodiversidade') {
      handleStartChallenge(
        'Desafio de Biodiversidade & Biomas',
        'Avaliação sobre Fauna, Flora, Espécies Ameaçadas e os 6 Biomas do Brasil.',
        { pillar: 'biodiversidade' },
        5
      );
    } else if (initialPillar === 'geopolitica' || initialPillar === 'demografia') {
      handleStartChallenge(
        'Desafio de Geopolítica & Território',
        'Avaliação sobre Demografia Censo IBGE 2022, IDHM, PIB, Fronteiras e Saúde SUS.',
        { pillar: 'geopolitica' },
        5
      );
    } else if (initialPillar === 'cultura_musica' || initialPillar === 'geografia') {
      handleStartChallenge(
        'Desafio de Arte, Cultura & Tradições',
        'Avaliação sobre Patrimônio Histórico IPHAN, Culinária Típica, Rádio e Ritmos Regionais.',
        { pillar: 'cultura_musica' },
        5
      );
    } else {
      setTabMode('hub');
    }
  }, [isOpen, initialPillar]);

  if (!isOpen) return null;

  const currentQ = activeQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isConfirmed) return;
    audioEngine.playSfx('click');
    setSelectedOption(idx);
    setIsConfirmed(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      audioEngine.playSfx('badge');
      setScore((s) => s + 1);
    } else {
      audioEngine.playSfx('step');
    }
  };

  const handleNextQuestion = () => {
    audioEngine.playSfx('click');
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    } else {
      // Finalizar Quiz
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);
      const totalXp = finalScore * 75;
      setScore(finalScore);
      setEarnedXp(totalXp);
      onGainXp(totalXp);

      if (finalScore >= Math.ceil(activeQuestions.length * 0.7)) {
        triggerConfetti();
        audioEngine.playSfx('fanfare');
      }

      setTabMode('result');
    }
  };

  const getPillarBadge = (pillar: QuestThemePillar) => {
    switch (pillar) {
      case 'clima':
        return { label: 'Clima & ZCAS', icon: Thermometer, color: 'text-sky-300 bg-sky-950/80 border-sky-500/50' };
      case 'biodiversidade':
        return { label: 'Biodiversidade', icon: Trees, color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50' };
      case 'demografia':
        return { label: 'Demografia IBGE', icon: Users, color: 'text-purple-300 bg-purple-950/80 border-purple-500/50' };
      case 'geopolitica':
        return { label: 'Geopolítica', icon: Building2, color: 'text-indigo-300 bg-indigo-950/80 border-indigo-500/50' };
      case 'geografia':
        return { label: 'Geografia & Relevo', icon: Map, color: 'text-amber-300 bg-amber-950/80 border-amber-500/50' };
      case 'cultura_musica':
        return { label: 'Rádio & Cultura', icon: Radio, color: 'text-rose-300 bg-rose-950/80 border-rose-500/50' };
      default:
        return { label: 'Geral', icon: Globe2, color: 'text-teal-300 bg-teal-950/80 border-teal-500/50' };
    }
  };

  return (
    <div
      id="modal-brquest-hub"
      className="modal-brquest-hub fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
    >
      <div className="painel-brquest-conteudo relative w-full max-w-2xl bg-gradient-to-b from-slate-950 via-[#12141c] to-slate-950 border-2 border-amber-500/70 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-4 text-slate-100 overflow-hidden my-auto">
        {/* Cantos Ornamentais RPG Pergaminho */}
        <div className="ornamento-canto-tl absolute -top-2 -left-2 w-5 h-5 bg-amber-400 border-2 border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-tr absolute -top-2 -right-2 w-5 h-5 bg-amber-400 border-2 border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-bl absolute -bottom-2 -left-2 w-5 h-5 bg-amber-400 border-2 border-amber-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-br absolute -bottom-2 -right-2 w-5 h-5 bg-amber-400 border-2 border-amber-200 rotate-45 pointer-events-none shadow" />

        {/* 1. Header do Hub BrQuest */}
        <div className="flex items-center justify-between border-b border-amber-500/40 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-amber-300 shadow-md">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-xl text-amber-300 tracking-wide flex items-center gap-2">
                  <span>BrQuest</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 font-mono">
                    Desafios do Brasil
                  </span>
                </h2>
              </div>
              <p className="text-xs text-amber-200/70 font-serif">
                Aventura gamificada baseada em dados reais de Clima, Biomas, Demografia e Cultura
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Nv. {playerLevel}</span>
              <span className="text-slate-400">({playerXp} XP)</span>
            </div>
            <button
              id="btn-fechar-brquest-hub"
              onClick={() => {
                audioEngine.playSfx('click');
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-amber-500/40 transition cursor-pointer"
              title="Fechar BrQuest"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Conteúdo Dinâmico por Aba */}
        {tabMode === 'hub' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Banner Principal: Grande Prova do Brasil */}
            <div
              onClick={() =>
                handleStartChallenge(
                  'Grande Prova do Brasil',
                  'Desafio multidisciplinar integrando Clima, Biodiversidade, Demografia, Geopolítica e Cultura.',
                  { scope: 'nacional' },
                  6
                )
              }
              className="card-banner-grande-prova relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-amber-950/70 border-2 border-amber-400/70 hover:border-amber-300 transition-all hover:scale-[1.01] cursor-pointer shadow-lg group overflow-hidden"
            >
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-15 group-hover:opacity-30 transition-opacity">
                <Globe2 className="w-32 h-32 text-amber-300" />
              </div>

              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider">
                    Desafio Mestre
                  </span>
                  <span className="text-xs text-amber-300 font-serif">Nacional • 6 Questões</span>
                </div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-amber-100 group-hover:text-amber-200">
                  ⚔️ A Grande Prova do Brasil
                </h3>
                <p className="text-xs text-slate-300 max-w-md font-sans">
                  Enfrente o desafio supremo com questões integradas de Rios Voadores, ZCAS, biomas endêmicos, Censo IBGE 2022 e a Era de Ouro do Rádio.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Iniciar Jornada Nacional</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Trilhas Regionais (Norte, Nordeste, Centro-Oeste, Sudeste, Sul) */}
            <div className="space-y-2">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Trilhas das 5 Regiões Brasileiras</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'norte',
                    title: 'Trilha do Norte',
                    sub: 'Amazônia, Pirarucu e Carimbó',
                    border: 'border-emerald-500/50 hover:border-emerald-400',
                    bg: 'from-emerald-950/60 to-slate-900',
                    badge: 'Norte',
                  },
                  {
                    id: 'nordeste',
                    title: 'Trilha do Nordeste',
                    sub: 'Caatinga, Frevo e Cangaço',
                    border: 'border-amber-500/50 hover:border-amber-400',
                    bg: 'from-amber-950/60 to-slate-900',
                    badge: 'Nordeste',
                  },
                  {
                    id: 'centro_oeste',
                    title: 'Trilha do Centro-Oeste',
                    sub: 'Pantanal, Cerrado e Brasília',
                    border: 'border-yellow-500/50 hover:border-yellow-400',
                    bg: 'from-yellow-950/60 to-slate-900',
                    badge: 'Centro-Oeste',
                  },
                  {
                    id: 'sudeste',
                    title: 'Trilha do Sudeste',
                    sub: 'Mata Atlântica, Bossa Nova e Metrópoles',
                    border: 'border-blue-500/50 hover:border-blue-400',
                    bg: 'from-blue-950/60 to-slate-900',
                    badge: 'Sudeste',
                  },
                  {
                    id: 'sul',
                    title: 'Trilha do Sul',
                    sub: 'Araucárias, Pampa e Clima Subtropical',
                    border: 'border-cyan-500/50 hover:border-cyan-400',
                    bg: 'from-cyan-950/60 to-slate-900',
                    badge: 'Sul',
                  },
                  {
                    id: 'all_guardians',
                    title: 'Guardiões Estaduais',
                    sub: 'Escolha e desafie um dos 27 Guardiões',
                    border: 'border-rose-500/50 hover:border-rose-400',
                    bg: 'from-rose-950/60 to-slate-900',
                    badge: '27 Estados',
                    isGridMode: true,
                  },
                ].map((trilha) => (
                  <button
                    key={trilha.id}
                    onClick={() => {
                      if (trilha.isGridMode) {
                        setTabMode('guardians_grid');
                        audioEngine.playSfx('click');
                      } else {
                        handleStartChallenge(
                          trilha.title,
                          `Perguntas específicas sobre os biomas, geografia, relevo e cultura da região ${trilha.badge}.`,
                          { regionId: trilha.id as any },
                          4
                        );
                      }
                    }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${trilha.bg} border ${trilha.border} text-left transition hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-2 group shadow-sm`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-black/40">
                          {trilha.badge}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 transition-colors" />
                      </div>
                      <h5 className="font-serif font-bold text-sm text-slate-100 mt-1">
                        {trilha.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                        {trilha.sub}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pilares Temáticos */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Desafios por Pilar Temático</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { pilar: 'clima' as QuestThemePillar, label: 'Clima & ZCAS', icon: Thermometer },
                  { pilar: 'biodiversidade' as QuestThemePillar, label: 'Biomas & Espécies', icon: Trees },
                  { pilar: 'demografia' as QuestThemePillar, label: 'Censo 2022 & Etnias', icon: Users },
                  { pilar: 'geopolitica' as QuestThemePillar, label: 'Fronteiras & Política', icon: Building2 },
                  { pilar: 'geografia' as QuestThemePillar, label: 'Relevo & Bacias', icon: Map },
                  { pilar: 'cultura_musica' as QuestThemePillar, label: 'Rádio & Música', icon: Radio },
                ].map(({ pilar, label, icon: Icon }) => (
                  <button
                    key={pilar}
                    onClick={() =>
                      handleStartChallenge(
                        `Desafio: ${label}`,
                        `Questões especializadas sobre ${label}.`,
                        { pillar: pilar },
                        5
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/60 text-slate-300 hover:text-amber-200 text-xs font-serif font-medium transition flex items-center gap-2 cursor-pointer group hover:bg-slate-900"
                  >
                    <Icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Modo Jogando Quiz */}
        {tabMode === 'playing' && currentQ && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            {/* Topo do Quiz */}
            <div className="flex items-center justify-between bg-slate-900/90 px-3.5 py-2 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2">
                {(() => {
                  const badge = getPillarBadge(currentQ.pillar);
                  const Icon = badge.icon;
                  return (
                    <span className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  );
                })()}
                <span className="text-xs text-amber-200 font-serif">
                  Questão {currentIdx + 1} de {activeQuestions.length}
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-amber-400">
                Acertos: {score}
              </span>
            </div>

            {/* Pergunta */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-400/40">
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-100 leading-relaxed">
                {currentQ.questionPt}
              </h3>
            </div>

            {/* Alternativas */}
            <div className="space-y-2">
              {currentQ.optionsPt.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-400/60 hover:bg-slate-850';

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
                    className={`btn-opcao-resposta w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/40 border border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 font-sans">{opt}</span>
                    {isConfirmed && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explicação e Próximo */}
            {isConfirmed && (
              <div className="p-3.5 rounded-xl bg-slate-900/95 border border-amber-500/40 space-y-2 animate-in fade-in">
                <div className="text-xs text-amber-200/90 font-serif leading-relaxed">
                  <span className="font-bold text-amber-300">Explicação: </span>
                  {currentQ.explanationPt}
                </div>
                {currentQ.sourceRef && (
                  <div className="text-[10px] font-mono text-slate-400">
                    Fonte / Validação: {currentQ.sourceRef}
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{currentIdx + 1 < activeQuestions.length ? 'Próxima Questão' : 'Ver Resultado'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Modo Resultado Final */}
        {tabMode === 'result' && (
          <div className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-black text-xl text-amber-200">
                Desafio Concluído com Sucesso!
              </h3>
              <p className="text-xs text-slate-300 font-serif">
                {activeBatchTitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto py-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30">
                <div className="text-xs text-slate-400 font-serif">Acertos</div>
                <div className="text-xl font-mono font-black text-emerald-400">
                  {score} / {activeQuestions.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30">
                <div className="text-xs text-slate-400 font-serif">XP Ganho</div>
                <div className="text-xl font-mono font-black text-amber-400">
                  +{earnedXp} XP
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setTabMode('hub')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 font-serif text-xs transition cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jogar Novamente</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Modo Grade de Guardiões Estaduais */}
        {tabMode === 'guardians_grid' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Escolha um Guardião Estadual para Enfrentar</span>
              </h4>
              <button
                onClick={() => setTabMode('hub')}
                className="text-[11px] font-mono text-amber-400 hover:underline cursor-pointer"
              >
                ← Voltar ao Hub
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {GUARDIANS_DATA.map((guardian) => (
                <button
                  key={guardian.id}
                  onClick={() => {
                    audioEngine.playSfx('travel');
                    onClose();
                    onSelectGuardian(guardian);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400 text-left transition hover:scale-[1.03] cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                    <span>{guardian.id}</span>
                    <span className="text-sm">{guardian.flagSymbol}</span>
                  </div>
                  <div className="font-serif font-bold text-xs text-slate-100 truncate mt-1">
                    {guardian.stateNamePt}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-serif">
                    {guardian.guardianName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
