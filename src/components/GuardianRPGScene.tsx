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

  const coatOfArms = getCoatOfArmsUrl(guardian.id);
  const characterImgSrc = guardian.id === 'RS' ? '/RS/w-gaucho.png' : guardian.avatarUrl;

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] flex flex-col bg-slate-950 rounded-3xl border-2 border-amber-500/60 shadow-2xl overflow-hidden p-3 sm:p-6 my-2 text-slate-100">
      
      {/* ATMOSPHERIC RPG BACKGROUND WITH PARALLAX GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_50%,#020617_100%)] opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/br/bg-mapa-br.png')] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-amber-500/30">
        <button
          onClick={() => {
            audioEngine.playSfx('click');
            onBackToMap();
          }}
          className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-amber-200 border-2 border-amber-500/60 font-serif font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2 transition shadow-lg group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Mapa do Brasil</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-amber-400 p-1 flex items-center justify-center shrink-0">
            <span className="text-xl">{guardian.flagSymbol}</span>
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
            <h1 className="font-serif font-black text-lg sm:text-xl text-amber-300 tracking-wide flex items-center gap-2">
              <span>{guardian.stateNamePt}</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/40 font-mono">
                {guardian.id}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Capital: <strong className="text-slate-200">{guardian.capitalPt}</strong> • Região:{' '}
              <strong className="text-amber-400 uppercase">{guardian.regionId}</strong>
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {hasInsignia ? (
            <div className="bg-amber-500 text-slate-950 font-serif font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Insígnia {guardian.insigniaIcon}</span>
            </div>
          ) : isCompleted ? (
            <div className="bg-emerald-500 text-slate-950 font-serif font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluído</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* MAIN RPG ENCOUNTER CANVAS */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        
        {/* LEFT COLUMN: UNBOXED FULL-BODY GUARDIAN CHARACTER (NO DIV BORDER / NO CARD FRAME) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-end relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] select-none">
          
          {/* Subtle Ambient Particle/Glow behind NPC feet */}
          <div className="absolute bottom-6 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Natural Floor Shadow under NPC Boots */}
          <div className="absolute bottom-2 w-64 h-8 bg-black/80 rounded-[100%] blur-md pointer-events-none -z-10" />

          {/* UNBOXED FULL-BODY CHARACTER SPRITE (Free standing, transparent background, facing the dialogue box) */}
          <div className="relative z-10 w-full h-full flex items-end justify-center group cursor-pointer">
            <img
              src={characterImgSrc}
              alt={guardian.guardianName}
              className="max-h-[420px] sm:max-h-[480px] lg:max-h-[540px] w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-105"
            />

            {/* Floating State Crest Badge next to character */}
            <div className="absolute top-2 right-4 bg-slate-950/90 border-2 border-amber-400 p-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2">
              <span className="text-xl">{guardian.flagSymbol}</span>
              <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
                {guardian.id}
              </span>
            </div>
          </div>

          {/* Floating Character Name & Title Banner below feet */}
          <div className="relative z-20 mt-3 w-full max-w-sm bg-slate-950/90 border-2 border-amber-500/70 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-center">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-serif flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              {guardian.guardianTitlePt}
            </div>
            <h2 className="font-serif font-black text-lg sm:text-xl text-amber-100 tracking-wide">
              {guardian.guardianName}
            </h2>
          </div>
        </div>


        {/* RIGHT COLUMN: DYNAMIC RPG DIALOGUE BOX & INTERACTIVE PANELS */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* TOP RPG DIALOGUE BOX (Caixa de Diálogo Dinâmica) */}
          <div className="bg-slate-950/95 border-2 border-amber-500/80 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 mb-3">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Caixa de Diálogo Dinâmica do Guardião</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {guardian.guardianName}
              </span>
            </div>

            {/* Speech Bubble / Typewriting Content */}
            <div className="min-h-[90px] flex items-center">
              <p className="font-serif text-sm sm:text-base text-amber-100 leading-relaxed italic">
                "{displayedText}"
                {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
              </p>
            </div>

            {/* Next Dialogue Line Button if multiple steps remain */}
            {activeTopic === 'about' && dialogueStep < defaultDialogueLines.length - 1 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleNextDialogueLine}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs px-4 py-2 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Avançar Fala</span>
                  <span>▶</span>
                </button>
              </div>
            )}
          </div>

          {/* INTERACTIVE TOPIC CHOICES BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleTopicSelect('about')}
              className={`p-3 rounded-2xl font-serif font-bold text-xs flex items-center justify-center gap-2 transition border ${
                activeTopic === 'about'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>História e Lendas</span>
            </button>

            <button
              onClick={() => handleTopicSelect('culture')}
              className={`p-3 rounded-2xl font-serif font-bold text-xs flex items-center justify-center gap-2 transition border ${
                activeTopic === 'culture'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Tradições & Hábitos</span>
            </button>

            <button
              onClick={() => handleTopicSelect('anthems')}
              className={`p-3 rounded-2xl font-serif font-bold text-xs flex items-center justify-center gap-2 transition border ${
                activeTopic === 'anthems'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <Music className="w-4 h-4 shrink-0" />
              <span>Hinos Sagrados</span>
            </button>

            <button
              onClick={() => handleTopicSelect('quiz')}
              className={`p-3 rounded-2xl font-serif font-bold text-xs flex items-center justify-center gap-2 transition border ${
                activeTopic === 'quiz'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Desafio no Quiz</span>
            </button>
          </div>

          {/* TOPIC CONTENT DETAILS CONTAINER */}
          <div className="bg-slate-950/90 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl min-h-[280px] flex flex-col justify-between">
            
            {/* 1. ABOUT & LORE TOPIC */}
            {activeTopic === 'about' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                  <div className="text-xs text-amber-400 font-serif font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-300" />
                    <span>Resumo do Território & Lenda Ancestral</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                    {guardian.loreStoryPt}
                  </p>
                </div>

                {/* Traje e Armadura */}
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider font-serif">
                    Armadura e Traje do Guardião:
                  </div>
                  <p className="text-xs text-slate-300 italic font-serif">
                    "{guardian.garbDescriptionPt}"
                  </p>
                </div>

                {/* Pergaminho Literário / Erico Verissimo */}
                {guardian.literaryPergament && (
                  <div className="bg-amber-900/20 border border-amber-500/40 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        Obra: "{guardian.literaryPergament.title}"
                      </span>
                      <span className="text-[11px] text-amber-400/90 font-serif italic">
                        {guardian.literaryPergament.author}
                      </span>
                    </div>
                    <blockquote className="text-xs italic text-amber-100/90 border-l-2 border-amber-400 pl-3 py-1 font-serif">
                      "{guardian.literaryPergament.excerpt}"
                    </blockquote>
                  </div>
                )}
              </div>
            )}

            {/* 2. CULTURE & TRADITIONS TOPIC */}
            {activeTopic === 'culture' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                {/* Prato Típico */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-300" /> Culinária Tradicional:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.typicalDishPt}
                  </div>
                </div>

                {/* Fauna */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-400" /> Fauna Símbolo:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.faunaPt}
                  </div>
                </div>

                {/* Flora */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-yellow-400" /> Flora Sagrada:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.floraPt}
                  </div>
                </div>

                {/* Ritmos e Tradição */}
                <div className="bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-2xl space-y-1">
                  <div className="text-xs text-amber-400 font-serif font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" /> Músicas & Tradições:
                  </div>
                  <div className="text-xs text-slate-200 font-serif font-semibold">
                    {guardian.musicAndCulturePt}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ANTHEMS TOPIC */}
            {activeTopic === 'anthems' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Selector */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => setSelectedAnthemType('state')}
                    className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs transition ${
                      selectedAnthemType === 'state'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Hino do Estado ({guardian.id})
                  </button>
                  <button
                    onClick={() => setSelectedAnthemType('national')}
                    className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs transition ${
                      selectedAnthemType === 'national'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Hino Nacional Brasileiro
                  </button>
                </div>

                {/* Player Card */}
                <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-amber-300">
                        {activeAnthem.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Música: {activeAnthem.composers.music} • Letra: {activeAnthem.composers.lyrics}
                      </p>
                    </div>

                    {mp3Path && (
                      <button
                        onClick={handleToggleMp3}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 text-xs shadow-lg cursor-pointer"
                      >
                        {isPlayingMp3 ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlayingMp3 ? 'Pausar Hino MP3' : 'Tocar Hino MP3'}</span>
                      </button>
                    )}
                  </div>

                  {/* Lyrics Box */}
                  <div className="max-h-40 overflow-y-auto pr-2 bg-slate-950/80 p-3 rounded-xl border border-amber-500/20 text-xs font-serif italic leading-relaxed text-amber-100 whitespace-pre-line scrollbar-thin">
                    {activeAnthem.lyricsPt}
                  </div>
                </div>
              </div>
            )}

            {/* 4. QUIZ TOPIC */}
            {activeTopic === 'quiz' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {!quizFinished ? (
                  <>
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                      <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider">
                        Pergunta {currentQIndex + 1} de {guardian.questions.length}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Pontuação: {score} XP
                      </span>
                    </div>

                    <p className="font-serif text-sm font-bold text-white">
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
                            className={`p-3 rounded-2xl border text-left text-xs font-serif transition cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono text-amber-400 font-bold mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="pt-2 flex items-center justify-between border-t border-amber-500/20">
                        <p className="text-xs text-amber-200/90 italic font-serif">
                          {currentQ.explanationPt}
                        </p>
                        <button
                          onClick={handleNextQuestion}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs px-4 py-2 rounded-xl transition shadow-lg shrink-0 cursor-pointer"
                        >
                          Próxima ▶
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-3 py-4">
                    <Award className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                    <h3 className="font-serif font-black text-lg text-amber-300">
                      Desafio Concluído!
                    </h3>
                    <p className="text-xs text-slate-300 font-serif">
                      Você acertou {score} de {guardian.questions.length} perguntas e ganhou{' '}
                      <strong className="text-amber-400">{score * 100} XP</strong>!
                    </p>
                    {score === guardian.questions.length && (
                      <div className="bg-amber-500/20 border border-amber-400 p-3 rounded-2xl text-xs text-amber-300 font-bold font-serif">
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
