import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GuardianData, Language } from '../types';
import { audioEngine } from '../lib/audioSynth';
import { triggerConfetti } from '../lib/storage';
import { getCoatOfArmsUrl } from '../data/coatOfArms';
import {
  getAnthemPairForState,
  NATIONAL_ANTHEM_BRAZIL,
  AnthemItem,
} from '../data/anthemsData';
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Award,
  BookOpen,
  Music,
  UserCheck,
  Utensils,
  Leaf,
  Users,
  Feather,
  Landmark,
  Compass,
} from 'lucide-react';

interface Props {
  guardian: GuardianData;
  isCompleted: boolean;
  hasInsignia: boolean;
  onBackToMap: () => void;
  onCompleteQuiz: (xpEarned: number, correctCount: number) => void;
  onUnlockInsignia: (insigniaId: string) => void;
  lang: Language;
}

export const GuardianRPGScene: React.FC<Props> = ({
  guardian,
  isCompleted,
  hasInsignia,
  onBackToMap,
  onCompleteQuiz,
  onUnlockInsignia,
}) => {
  // Dialogue topic: 'about' | 'culture' | 'anthems' | 'quiz'
  const [activeTopic, setActiveTopic] = useState<'about' | 'culture' | 'anthems' | 'quiz'>('about');

  // Gaucho dialogue dialogue sequence steps
  const defaultDialogueLines = useMemo(() => {
    if (guardian.id === 'RS') {
      return [
        'Bah, tchê! Sou o Guardião dos Pampas!',
        'O que deseja saber da minha terra?',
        'Tenho orgulho de defender a tradição farroupilha, os campos abertos e o chimarrão sagrado!',
      ];
    }
    return [
      `Saudações, nobre viajante! Eu sou ${guardian.guardianName}, ${guardian.guardianTitlePt}.`,
      `Seja muito bem-vindo ao solo sagrado de ${guardian.stateNamePt}!`,
      'O que desejas conhecer das nossas tradições e história?',
    ];
  }, [guardian]);

  const [dialogueStep, setDialogueStep] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Anthem Jukebox State
  const [selectedAnthemType, setSelectedAnthemType] = useState<'state' | 'capital' | 'national'>('state');
  const [isPlayingMp3, setIsPlayingMp3] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = guardian.questions[currentQIndex];

  // Anthems Data
  const anthemPair = getAnthemPairForState(guardian.id);
  const activeAnthem: AnthemItem =
    selectedAnthemType === 'state'
      ? anthemPair.stateAnthem
      : selectedAnthemType === 'capital'
      ? anthemPair.capitalAnthem
      : NATIONAL_ANTHEM_BRAZIL;

  // MP3 Path Helper
  const mp3Path = useMemo(() => {
    if (selectedAnthemType === 'national') {
      return '/br/hino-nacional-brasileiro.mp3';
    }
    if (guardian.id === 'RS' && selectedAnthemType === 'state') {
      return '/RS/hino-rio-grandense.mp3';
    }
    return null;
  }, [guardian.id, selectedAnthemType]);

  // Handle typing effect for dialogue speech
  useEffect(() => {
    const targetText = defaultDialogueLines[dialogueStep] || defaultDialogueLines[0];
    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(targetText.slice(0, charIndex));
      if (charIndex >= targetText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [dialogueStep, defaultDialogueLines]);

  // Clean up audio on unmount or anthem change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingMp3(false);
  }, [selectedAnthemType, activeTopic]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleToggleMp3 = () => {
    if (!mp3Path) return;

    if (isPlayingMp3) {
      audioRef.current?.pause();
      setIsPlayingMp3(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(mp3Path);
      } else {
        audioRef.current.src = mp3Path;
      }
      audioRef.current.onended = () => setIsPlayingMp3(false);
      audioRef.current
        .play()
        .then(() => setIsPlayingMp3(true))
        .catch((err) => console.error('Audio playback error:', err));
    }
  };

  const handleTopicSelect = (topic: 'about' | 'culture' | 'anthems' | 'quiz') => {
    audioEngine.playSfx('click');
    setActiveTopic(topic);

    if (topic === 'about') {
      setDialogueStep(0);
    } else if (topic === 'culture') {
      setDisplayedText(
        `A cultura de ${guardian.stateNamePt} é viva e cheia de bravura! Saboreie nosso ${guardian.typicalDishPt} e viva a tradição.`
      );
      setIsTyping(false);
    } else if (topic === 'anthems') {
      setDisplayedText(
        `Escute com atenção os acordes sagrados dos nossos hinos. Aqui cantamos o orgulho e a história do nosso povo!`
      );
      setIsTyping(false);
    } else if (topic === 'quiz') {
      setDisplayedText(
        `Prepare sua mente, guerreiro! Responda às perguntas sobre ${guardian.stateNamePt} para conquistar a ${guardian.insigniaNamePt}!`
      );
      setIsTyping(false);
    }
  };

  const handleNextDialogueLine = () => {
    if (dialogueStep < defaultDialogueLines.length - 1) {
      audioEngine.playSfx('click');
      setDialogueStep((s) => s + 1);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      audioEngine.playSfx('badge');
      setScore((s) => s + 1);
    } else {
      audioEngine.playSfx('step');
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < guardian.questions.length) {
      setCurrentQIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      const finalScore = score + (selectedAnswer === currentQ.correctIndex ? 1 : 0);
      const xp = finalScore * 100;

      onCompleteQuiz(xp, finalScore);

      if (finalScore === guardian.questions.length) {
        onUnlockInsignia(guardian.id);
        triggerConfetti();
        audioEngine.playSfx('fanfare');
      }
    }
  };

  // Ref and drag-scroll state for the topic content panel
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPanelDragging, setIsPanelDragging] = useState<boolean>(false);
  const panelDragStartY = useRef<number>(0);
  const panelScrollTopStart = useRef<number>(0);

  const handlePanelMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsPanelDragging(true);
    panelDragStartY.current = e.clientY;
    panelScrollTopStart.current = scrollContainerRef.current.scrollTop;
  };

  const handlePanelMouseMove = (e: React.MouseEvent) => {
    if (!isPanelDragging || !scrollContainerRef.current) return;
    const dy = e.clientY - panelDragStartY.current;
    scrollContainerRef.current.scrollTop = panelScrollTopStart.current - dy;
  };

  const handlePanelMouseUp = () => {
    setIsPanelDragging(false);
  };

  const coatOfArms = getCoatOfArmsUrl(guardian.id);
  const characterImgSrc = guardian.id === 'RS' ? '/RS/w-gaucho.png' : guardian.avatarUrl;

  return (
    <div className="painel-guardiao-detalhes container-cena-guardiao relative w-full h-[calc(100vh-105px)] max-h-[calc(100vh-105px)] flex flex-col bg-slate-950/95 rounded-3xl border-2 border-amber-500/60 shadow-2xl overflow-hidden p-2 sm:p-4 my-1 text-slate-100 select-none">
      
      {/* ATMOSPHERIC RPG BACKGROUND WITH PARALLAX GLOW */}
      <div className="camada-brilho-fundo absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_50%,#020617_100%)] opacity-90 pointer-events-none" />
      <div className="camada-textura-mapa absolute inset-0 bg-[url('/br/bg-mapa-br.png')] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <div className="topo-cena-guardiao relative z-20 flex items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-500/30 shrink-0">
        <button
          onClick={() => {
            audioEngine.playSfx('click');
            onBackToMap();
          }}
          className="btn-voltar-mapa-guardiao bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-amber-200 border-2 border-amber-500/60 font-serif font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl flex items-center gap-2 transition shadow-lg group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Mapa</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-slate-900 border border-amber-400 p-1 flex items-center justify-center shrink-0">
            <span className="text-lg sm:text-xl">{guardian.flagSymbol}</span>
            {coatOfArms && (
              <img
                src={coatOfArms}
                alt={guardian.stateNamePt}
                className="absolute inset-0 w-full h-full object-contain p-1"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>
          <div>
            <h1 className="font-serif font-black text-sm sm:text-lg text-amber-300 tracking-wide flex items-center gap-1.5">
              <span>{guardian.stateNamePt}</span>
              <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
                {guardian.id}
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-sans">
              Capital: <strong className="text-slate-200">{guardian.capitalPt}</strong> • Região:{' '}
              <strong className="text-amber-400 uppercase">{guardian.regionId}</strong>
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {hasInsignia ? (
            <div className="bg-amber-500 text-slate-950 font-serif font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-lg border border-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Insígnia {guardian.insigniaIcon}</span>
            </div>
          ) : isCompleted ? (
            <div className="bg-emerald-500 text-slate-950 font-serif font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Concluído</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* MAIN RPG ENCOUNTER CANVAS (Left: 80% Screen Guardian, Right: Dialogue & Actions) */}
      <div className="canvas-encontro-guardiao relative z-10 flex-1 flex flex-col lg:flex-row gap-4 items-stretch overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: ISOLATED FULL-BODY GUARDIAN CHARACTER (80% OF SCREEN HEIGHT, TRANSPARENT BACKGROUND) */}
        <div className="coluna-personagem-guardiao w-full lg:w-[40%] xl:w-[42%] shrink-0 flex flex-col items-center justify-end relative h-full min-h-[300px] select-none pb-1">
          
          {/* Subtle Ambient Particle/Glow behind NPC */}
          <div className="brilho-aura-personagem absolute bottom-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Natural Floor Shadow under NPC */}
          <div className="sombra-piso-personagem absolute bottom-8 w-72 h-8 bg-black/85 rounded-[100%] blur-md pointer-events-none -z-10" />

          {/* UNBOXED FULL-BODY CHARACTER SPRITE: Transparent Background, Free-Standing, 80% Screen */}
          <div className="sprite-completo-guardiao relative z-10 w-full h-[78vh] max-h-[78vh] flex items-end justify-center group cursor-pointer">
            <img
              src={characterImgSrc}
              alt={guardian.guardianName}
              className="imagem-sprite-guardiao h-full w-auto max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-105"
            />

            {/* Floating State Crest Badge next to character */}
            <div className="badge-flutuante-estado absolute top-2 right-4 bg-slate-950/90 border-2 border-amber-400 p-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2">
              <span className="text-xl">{guardian.flagSymbol}</span>
              <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
                {guardian.id}
              </span>
            </div>
          </div>

          {/* Floating Character Name & Title Banner below feet */}
          <div className="banner-nome-guardiao relative z-20 -mt-4 w-full max-w-xs bg-slate-950/90 border-2 border-amber-500/70 py-2 px-3 rounded-2xl shadow-2xl backdrop-blur-md text-center">
            <div className="titulo-rpg-guardiao text-[10px] text-amber-400 font-bold uppercase tracking-widest font-serif flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              {guardian.guardianTitlePt}
            </div>
            <h2 className="nome-guardiao-rpg font-serif font-black text-base sm:text-lg text-amber-100 tracking-wide">
              {guardian.guardianName}
            </h2>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC RPG DIALOGUE BOX & INTERACTIVE PANELS WITH MASKED DRAG-SCROLL */}
        <div className="coluna-dialogo-guardiao flex-1 flex flex-col justify-between overflow-hidden gap-2.5 min-h-0">
          
          {/* TOP RPG DIALOGUE BOX (Caixa de Diálogo Dinâmica) */}
          <div className="caixa-dialogo-guardiao bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-3.5 sm:p-4 shadow-xl relative overflow-hidden backdrop-blur-md shrink-0">
            
            {/* Header Badge */}
            <div className="cabecalho-caixa-dialogo flex items-center justify-between pb-2 border-b border-amber-500/30 mb-2">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Diálogo com o Guardião</span>
              </div>
              <span className="nome-autor-fala text-[10px] text-slate-400 font-mono">
                {guardian.guardianName}
              </span>
            </div>

            {/* Speech Bubble / Typewriting Content */}
            <div className="area-texto-fala min-h-[64px] flex items-center">
              <p className="texto-dialogo-animado font-serif text-xs sm:text-sm text-amber-100 leading-relaxed italic">
                "{displayedText}"
                {isTyping && <span className="cursor-digitacao inline-block w-2 h-3.5 bg-amber-400 ml-1 animate-pulse" />}
              </p>
            </div>

            {/* Next Dialogue Line Button if multiple steps remain */}
            {activeTopic === 'about' && dialogueStep < defaultDialogueLines.length - 1 && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleNextDialogueLine}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-[11px] px-3 py-1.5 rounded-xl shadow-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Avançar Fala</span>
                  <span>▶</span>
                </button>
              </div>
            )}
          </div>

          {/* INTERACTIVE TOPIC CHOICES BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 shrink-0">
            <button
              onClick={() => handleTopicSelect('about')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                activeTopic === 'about'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>História & Lendas</span>
            </button>

            <button
              onClick={() => handleTopicSelect('culture')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                activeTopic === 'culture'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Cultura & Tradição</span>
            </button>

            <button
              onClick={() => handleTopicSelect('anthems')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                activeTopic === 'anthems'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span>Hinos Sagrados</span>
            </button>

            <button
              onClick={() => handleTopicSelect('quiz')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                activeTopic === 'quiz'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Desafio no Quiz</span>
            </button>
          </div>

          {/* TOPIC CONTENT DETAILS CONTAINER (WITH MASKED DRAG-TO-SCROLL, ZERO NATIVE SCROLLBARS) */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handlePanelMouseDown}
            onMouseMove={handlePanelMouseMove}
            onMouseUp={handlePanelMouseUp}
            onMouseLeave={handlePanelMouseUp}
            className={`painel-conteudo-topico-guardiao bg-slate-950/90 border-2 border-amber-500/60 rounded-2xl p-4 shadow-2xl flex-1 overflow-y-auto scrollbar-none mask-vertical-fade cursor-${
              isPanelDragging ? 'grabbing' : 'default'
            }`}
          >
            
            {/* 1. ABOUT & LORE TOPIC */}
            {activeTopic === 'about' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="bg-amber-950/40 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
                  <div className="text-xs text-amber-400 font-serif font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-300" />
                    <span>Território & Lenda Ancestral</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                    {guardian.loreStoryPt}
                  </p>
                </div>

                {/* Traje e Armadura */}
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider font-serif">
                    Armadura e Traje Sagrado:
                  </div>
                  <p className="text-xs text-slate-300 italic font-serif">
                    "{guardian.garbDescriptionPt}"
                  </p>
                </div>

                {/* Pergaminho Literário */}
                {guardian.literaryPergament && (
                  <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        Obra: "{guardian.literaryPergament.title}"
                      </span>
                      <span className="text-[11px] text-amber-400/90 font-serif italic">
                        {guardian.literaryPergament.author}
                      </span>
                    </div>
                    <blockquote className="text-xs italic text-amber-100/90 border-l-2 border-amber-400 pl-2.5 py-0.5 font-serif">
                      "{guardian.literaryPergament.excerpt}"
                    </blockquote>
                  </div>
                )}
              </div>
            )}

            {/* 2. CULTURE & TRADITIONS TOPIC */}
            {activeTopic === 'culture' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                {/* Prato Típico */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-300" /> Culinária Tradicional:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.typicalDishPt}
                  </div>
                </div>

                {/* Fauna */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Fauna Símbolo:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.faunaPt}
                  </div>
                </div>

                {/* Flora */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-yellow-400" /> Flora Sagrada:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.floraPt}
                  </div>
                </div>

                {/* Ritmos e Tradição */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" /> Músicas & Tradições:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.musicAndCulturePt}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ANTHEMS TOPIC */}
            {activeTopic === 'anthems' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Selector */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSelectedAnthemType('state')}
                    className={`px-2.5 py-1 rounded-lg font-serif font-bold text-xs transition ${
                      selectedAnthemType === 'state'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Hino do Estado ({guardian.id})
                  </button>
                  <button
                    onClick={() => setSelectedAnthemType('national')}
                    className={`px-2.5 py-1 rounded-lg font-serif font-bold text-xs transition ${
                      selectedAnthemType === 'national'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Hino Nacional Brasileiro
                  </button>
                </div>

                {/* Player Card */}
                <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-amber-300">
                        {activeAnthem.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Música: {activeAnthem.composers.music} • Letra: {activeAnthem.composers.lyrics}
                      </p>
                    </div>

                    {mp3Path && (
                      <button
                        onClick={handleToggleMp3}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 text-xs shadow-lg cursor-pointer"
                      >
                        {isPlayingMp3 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingMp3 ? 'Pausar' : 'Tocar MP3'}</span>
                      </button>
                    )}
                  </div>

                  {/* Lyrics Box */}
                  <div className="max-h-36 overflow-y-auto pr-2 bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/20 text-xs font-serif italic leading-relaxed text-amber-100 whitespace-pre-line scrollbar-none">
                    {activeAnthem.lyricsPt}
                  </div>
                </div>
              </div>
            )}

            {/* 4. QUIZ TOPIC */}
            {activeTopic === 'quiz' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {!quizFinished ? (
                  <>
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-1.5">
                      <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider">
                        Pergunta {currentQIndex + 1} de {guardian.questions.length}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Pontuação: {score} XP
                      </span>
                    </div>

                    <p className="font-serif text-xs sm:text-sm font-bold text-white">
                      {currentQ.questionPt}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentQ.optionsPt.map((opt, idx) => {
                        let btnStyle =
                          'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/60';
                        if (isAnswered) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                          } else if (idx === selectedAnswer) {
                            btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            disabled={isAnswered}
                            className={`p-2.5 rounded-xl border text-left text-xs font-serif transition cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono text-amber-400 font-bold mr-1.5">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="pt-2 flex items-center justify-between border-t border-amber-500/20">
                        <p className="text-[11px] text-amber-200/90 italic font-serif">
                          {currentQ.explanationPt}
                        </p>
                        <button
                          onClick={handleNextQuestion}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs px-3.5 py-1.5 rounded-xl transition shadow-lg shrink-0 cursor-pointer"
                        >
                          Próxima ▶
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-2.5 py-3">
                    <Award className="w-10 h-10 text-yellow-400 mx-auto animate-bounce" />
                    <h3 className="font-serif font-black text-base text-amber-300">
                      Desafio Concluído!
                    </h3>
                    <p className="text-xs text-slate-300 font-serif">
                      Você acertou {score} de {guardian.questions.length} perguntas e ganhou{' '}
                      <strong className="text-amber-400">{score * 100} XP</strong>!
                    </p>
                    {score === guardian.questions.length && (
                      <div className="bg-amber-500/20 border border-amber-400 p-2.5 rounded-2xl text-xs text-amber-300 font-bold font-serif">
                        🏆 Parabéns! Você conquistou a {guardian.insigniaNamePt}!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
