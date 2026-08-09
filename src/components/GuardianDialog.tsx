import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  X,
  Volume2,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Music,
  Utensils,
  Leaf,
  Users,
  Feather,
  UserCheck,
  MessageSquare,
  Landmark,
  FileText,
  Building2,
  Flag,
  Info,
  Play,
  Pause
} from 'lucide-react';

interface Props {
  guardian: GuardianData;
  isCompleted: boolean;
  hasInsignia: boolean;
  onClose: () => void;
  onCompleteQuiz: (xpEarned: number, correctCount: number) => void;
  onUnlockInsignia: (insigniaId: string) => void;
  lang: Language;
}

export const GuardianDialog: React.FC<Props> = ({
  guardian,
  isCompleted,
  hasInsignia,
  onClose,
  onCompleteQuiz,
  onUnlockInsignia,
}) => {
  // Main Interactive Dialogue Mode: 'about' | 'culture' | 'anthems' | 'quiz'
  const [dialogueTopic, setDialogueTopic] = useState<'about' | 'culture' | 'anthems' | 'quiz'>('about');
  
  // Selected Anthem in the Jukebox
  const [selectedAnthemType, setSelectedAnthemType] = useState<'state' | 'capital' | 'national'>('state');
  const [isPlayingHymn, setIsPlayingHymn] = useState<boolean>(false);

  // Character Hover / Interactive Quote State
  const [characterMessage, setCharacterMessage] = useState<string>(
    `Saudações, honorável viajante! Eu sou ${guardian.guardianName}, ${guardian.guardianTitlePt}. O que desejas conhecer de ${guardian.stateNamePt}?`
  );

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = guardian.questions[currentQIndex];

  // Retrieve anthems data
  const anthemPair = getAnthemPairForState(guardian.id);
  const activeAnthem: AnthemItem =
    selectedAnthemType === 'state'
      ? anthemPair.stateAnthem
      : selectedAnthemType === 'capital'
      ? anthemPair.capitalAnthem
      : NATIONAL_ANTHEM_BRAZIL;

  // Audio MP3 Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingMp3, setIsPlayingMp3] = useState<boolean>(false);

  // Helper to determine MP3 path for the active anthem
  const mp3Path = useMemo(() => {
    if (selectedAnthemType === 'national') {
      return '/br/hino-nacional-brasileiro.mp3';
    }
    if (guardian.id === 'RS' && selectedAnthemType === 'state') {
      return '/RS/hino-rio-grandense.mp3';
    }
    return null;
  }, [guardian.id, selectedAnthemType]);

  // Stop MP3 audio when switching anthems or topics or closing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingMp3(false);
  }, [selectedAnthemType, dialogueTopic, guardian.id]);

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
      audioRef.current.play().then(() => {
        setIsPlayingMp3(true);
      }).catch((err) => {
        console.error('Erro ao reproduzir áudio MP3:', err);
      });
    }
  };

  // Layout alignment: West vs East side of Brazil SVG map
  const isWestSide = guardian.centerX < 550;

  const handleTopicSelect = (topic: 'about' | 'culture' | 'anthems' | 'quiz') => {
    audioEngine.playSfx('click');
    setDialogueTopic(topic);

    if (topic === 'about') {
      setCharacterMessage(
        `Sou ${guardian.guardianName}. Defendo o solo sagrado de ${guardian.stateNamePt} e sua capital ${guardian.capitalPt}!`
      );
    } else if (topic === 'culture') {
      setCharacterMessage(
        `A cultura de ${guardian.stateNamePt} é viva e vibrante! Saboreie nosso ${guardian.typicalDishPt} e ouça nossos ritmos.`
      );
    } else if (topic === 'anthems') {
      setCharacterMessage(
        `Nossos hinos registram a bravura e a poesia do nosso povo. Escute as notas da nossa pátria!`
      );
    } else if (topic === 'quiz') {
      setCharacterMessage(
        `Mantenha o foco, guerreiro! Prove seu conhecimento sobre ${guardian.stateNamePt} para conquistar a Insígnia Sagrada!`
      );
    }
  };

  const handlePlayAnthem = (anthem: AnthemItem) => {
    setIsPlayingHymn(true);
    audioEngine.playHymnArpeggio(anthem.synthNotes);
    setTimeout(() => {
      setIsPlayingHymn(false);
    }, anthem.synthNotes.length * 300);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Container holding FULL-BODY NPC Standee on one side & Dynamic Dialogue Panel on other */}
      <div
        className={`relative w-full max-w-6xl my-auto flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 ${
          isWestSide ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >

        {/* --- FULL-BODY / UNBOXED GUARDIAN NPC STANDEE --- */}
        <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 bg-slate-950/95 border-2 border-amber-500/70 rounded-3xl shadow-2xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden group">
          
          {/* Ambient Background Aura Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-slate-950 pointer-events-none" />

          {/* Top Status Banner */}
          <div className="w-full flex items-center justify-between gap-2 border-b border-amber-500/30 pb-3 z-10">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400 text-[11px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              NPC Guardião
            </span>
            <span className="text-xs font-serif font-black text-amber-400 flex items-center gap-1">
              <span>{guardian.flagSymbol}</span>
              <span>{guardian.stateNamePt} ({guardian.id})</span>
            </span>
          </div>

          {/* Natural Full-Body Character Graphic - Unboxed / Transparent Frame */}
          <div className="relative my-2 w-full h-80 sm:h-96 md:h-[420px] flex items-center justify-center z-10 group cursor-pointer">
            
            {/* Unboxed Full-Body Character Standee */}
            <img
              src={guardian.id === 'RS' ? '/RS/w-gaucho.png' : guardian.avatarUrl}
              alt={guardian.guardianName}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105"
            />

            {/* Floating Official State Flag / Coat of Arms Crest */}
            <div className="absolute top-2 right-2 w-12 h-12 rounded-2xl bg-slate-950/90 border-2 border-amber-400 flex items-center justify-center shadow-xl backdrop-blur-sm overflow-hidden p-1">
              <span className="text-sm">{guardian.flagSymbol}</span>
              <img
                src={getCoatOfArmsUrl(guardian.id) || `https://flagcdn.com/w80/br-${guardian.id.toLowerCase()}.png`}
                alt={`Brasão do estado ${guardian.stateNamePt}`}
                className="absolute inset-0 w-full h-full object-contain p-1 rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Insignia Status Tag */}
            {hasInsignia ? (
              <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-lg border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Insígnia Sagrada
              </div>
            ) : isCompleted ? (
              <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Concluído
              </div>
            ) : null}
          </div>

          {/* Character Name & Title Box Overlay */}
          <div className="relative z-20 p-3.5 w-full bg-slate-900/90 rounded-2xl border border-amber-500/40 backdrop-blur-md space-y-1 text-left my-2">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-serif flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {guardian.guardianTitlePt}
            </div>
            <h2 className="font-serif font-black text-lg text-white tracking-wide">
              {guardian.guardianName}
            </h2>
          </div>

          {/* Interactive Speech Bubble Prompt below Character */}
          <div className="w-full z-10 bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/40 text-xs text-amber-100 font-serif text-left space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold uppercase">
              <MessageSquare className="w-3 h-3" /> Fala do Guardião:
            </div>
            <p className="italic leading-relaxed text-slate-200">
              "{characterMessage}"
            </p>
          </div>
        </div>


        {/* --- DYNAMIC INTERACTIVE DIALOGUE PANEL (Interactive Options) --- */}
        <div className="flex-1 bg-slate-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 min-h-[500px]">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-950 border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shrink-0">
                {guardian.flagSymbol}
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-amber-400 flex items-center gap-2">
                  <span>Caixa de Diálogo Dinâmica</span>
                </h3>
                <p className="text-xs text-slate-400">{guardian.stateNamePt} • Capital: {guardian.capitalPt}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Fechar Diálogo"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* INTERACTIVE CHOICE PROMPTS BAR (O que o usuário deseja saber) */}
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleTopicSelect('about')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                dialogueTopic === 'about'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Fala-me sobre você</span>
            </button>

            <button
              onClick={() => handleTopicSelect('culture')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                dialogueTopic === 'culture'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Conheça minha cultura</span>
            </button>

            <button
              onClick={() => handleTopicSelect('anthems')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                dialogueTopic === 'anthems'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <Music className="w-4 h-4 shrink-0" />
              <span>Posso ouvir seus hinos?</span>
            </button>

            <button
              onClick={() => handleTopicSelect('quiz')}
              className={`p-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                dialogueTopic === 'quiz'
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Desafio do NPC</span>
            </button>
          </div>

          {/* DYNAMIC DIALOGUE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* OPTION 1: "FALA-ME SOBRE VOCÊ" */}
            {dialogueTopic === 'about' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                {/* Lore Speech Box */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                    <UserCheck className="w-5 h-5" />
                    <span>Identidade & Dever do Guardião</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-serif italic">
                    "{guardian.loreStoryPt}"
                  </p>
                </div>

                {/* Garb & Armor Details */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>Traje & Equipamento Medieval Sacro</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {guardian.garbDescriptionPt}
                  </p>
                </div>

                {/* Geographic & Regional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Capital Estadual</div>
                    <div className="text-sm font-serif font-bold text-amber-300">{guardian.capitalPt}</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Região Geográfica</div>
                    <div className="text-sm font-serif font-bold text-amber-300 uppercase">{guardian.regionId.replace('_', '-')}</div>
                  </div>
                </div>

              </div>
            )}

            {/* OPTION 2: "CONHEÇA MINHA CULTURA" */}
            {dialogueTopic === 'culture' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                {/* 2x2 Grid for Gastronomy, Fauna/Flora, Rhythms, Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Gastronomy */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-orange-400 font-serif font-bold text-sm">
                      <Utensils className="w-4 h-4" />
                      <span>Gastronomy Típica</span>
                    </div>
                    <p className="text-xs text-slate-300">{guardian.typicalDishPt}</p>
                  </div>

                  {/* Fauna & Flora */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-sm">
                      <Leaf className="w-4 h-4" />
                      <span>Fauna & Flora Símbolos</span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div><strong className="text-emerald-300">Fauna:</strong> {guardian.faunaPt}</div>
                      <div><strong className="text-emerald-300">Flora:</strong> {guardian.floraPt}</div>
                    </div>
                  </div>

                  {/* Rhythms & Culture */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-serif font-bold text-sm">
                      <Users className="w-4 h-4" />
                      <span>Ritmos & Festividades</span>
                    </div>
                    <p className="text-xs text-slate-300">{guardian.musicAndCulturePt}</p>
                  </div>

                  {/* Cultural Icons */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                      <Award className="w-4 h-4" />
                      <span>Figuras Históricas</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {guardian.famousIcons.map((icon, idx) => (
                        <span key={idx} className="bg-amber-950/60 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-lg text-[11px] font-medium">
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Literary Pergament Scroll Card */}
                <div className="bg-[#1a140e] p-6 rounded-2xl border-2 border-amber-600/70 shadow-2xl space-y-3 text-amber-100 font-serif">
                  <div className="flex items-center justify-between border-b border-amber-800/60 pb-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Feather className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-wider">Pergaminho Literário Sagrado</span>
                    </div>
                    <span className="text-xs text-amber-300/70">{guardian.stateNamePt}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-amber-300">{guardian.literaryPergament.title}</h4>
                    <div className="text-xs text-amber-400/80 font-sans italic">Por {guardian.literaryPergament.author}</div>
                  </div>

                  <blockquote className="bg-slate-950/60 p-4 rounded-xl border-l-4 border-amber-500 text-xs sm:text-sm italic leading-relaxed text-amber-200">
                    "{guardian.literaryPergament.excerpt}"
                  </blockquote>

                  <div className="text-xs text-amber-300/80 font-sans bg-amber-950/30 p-3 rounded-xl border border-amber-800/40">
                    <strong className="text-amber-400">Contexto Histórico: </strong>
                    {guardian.literaryPergament.contextPt}
                  </div>
                </div>

              </div>
            )}

            {/* OPTION 3: "POSSO OUVIR SEUS HINOS?" (INTERACTIVE ANTHEMS JUKEBOX) */}
            {dialogueTopic === 'anthems' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                {/* Anthem Type Selector Tabs */}
                <div className="flex border border-slate-800 rounded-2xl bg-slate-950 p-1.5 gap-2">
                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      setSelectedAnthemType('state');
                    }}
                    className={`flex-1 py-2 rounded-xl font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedAnthemType === 'state'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Hino do Estado</span>
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      setSelectedAnthemType('capital');
                    }}
                    className={`flex-1 py-2 rounded-xl font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedAnthemType === 'capital'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Hino da Capital</span>
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      setSelectedAnthemType('national');
                    }}
                    className={`flex-1 py-2 rounded-xl font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedAnthemType === 'national'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Hino do Brasil</span>
                  </button>
                </div>

                {/* Selected Anthem Card with Audio Player & Official Archival Citation */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/50 space-y-4">
                  
                  {/* Top Bar with Title and Audio Synth Player Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-serif">
                        {activeAnthem.category === 'state'
                          ? `Hino Oficial do Estado do ${guardian.stateNamePt}`
                          : activeAnthem.category === 'capital'
                          ? `Hino Municipal da Cidade de ${guardian.capitalPt}`
                          : 'Hino Nacional da República Federativa do Brasil'}
                      </span>
                      <h4 className="font-serif font-black text-lg text-white">
                        {activeAnthem.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans">
                        Música: {activeAnthem.composers.music} • Letra: {activeAnthem.composers.lyrics}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Real MP3 Audio Player Button (if available) */}
                      {mp3Path && (
                        <button
                          onClick={handleToggleMp3}
                          className={`font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-xl shrink-0 cursor-pointer ${
                            isPlayingMp3
                              ? 'bg-amber-400 text-slate-950 animate-pulse ring-2 ring-amber-300'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                          }`}
                        >
                          {isPlayingMp3 ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          <span>{isPlayingMp3 ? 'Pausar Hino MP3' : 'Tocar Hino MP3 Oficial 🎵'}</span>
                        </button>
                      )}

                      {/* Synthesizer Preview Button */}
                      <button
                        onClick={() => handlePlayAnthem(activeAnthem)}
                        disabled={isPlayingHymn}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 disabled:opacity-50 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isPlayingHymn ? 'Sintetizando...' : 'Arpejo Sintetizador'}</span>
                      </button>

                      {/* Spotify Direct Search Link */}
                      <a
                        href={`https://open.spotify.com/search/${encodeURIComponent(activeAnthem.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shrink-0 cursor-pointer"
                      >
                        <Music className="w-4 h-4" />
                        <span>Spotify</span>
                      </a>

                      {/* YouTube Direct Search Link */}
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeAnthem.title + ' oficial completo')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>YouTube</span>
                      </a>
                    </div>
                  </div>

                  {/* Lyrics Scroll Box */}
                  <div className="bg-slate-900/90 p-4 sm:p-5 rounded-xl border border-slate-800 text-xs sm:text-sm text-amber-100 font-serif whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto shadow-inner">
                    {activeAnthem.lyricsPt}
                  </div>

                  {/* Official Archival Citation Reference (Fontes Fidedignas / Museus) */}
                  <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-800/40 text-[11px] text-amber-300 space-y-1 font-sans">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fonte Oficial e Acervo Histórico Documental:</span>
                    </div>
                    <p className="text-slate-300">{activeAnthem.historicalSourcePt}</p>
                    <div className="text-[10px] text-amber-400/80 italic pt-0.5">
                      {activeAnthem.archiveReference}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* OPTION 4: "DESAFIO DO NPC (QUIZ)" */}
            {dialogueTopic === 'quiz' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {!quizFinished ? (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase">
                      <span>Questão {currentQIndex + 1} de {guardian.questions.length}</span>
                      <span>Pontuação: {score}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                      {currentQ.questionPt}
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {currentQ.optionsPt.map((option, idx) => {
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500';
                        if (isAnswered) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                          } else if (idx === selectedAnswer) {
                            btnStyle = 'bg-red-950 border-red-500 text-red-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            disabled={isAnswered}
                            className={`p-4 rounded-xl border text-left font-medium text-sm transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {isAnswered && idx === currentQ.correctIndex && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3 animate-in fade-in">
                        <p>{currentQ.explanationPt}</p>
                        <button
                          onClick={handleNextQuestion}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 font-serif"
                        >
                          <span>Próxima Pergunta</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950 p-8 rounded-2xl border-2 border-amber-500 text-center space-y-6 animate-in zoom-in-95">
                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl">
                      🏆
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif font-black text-2xl text-amber-400">
                        Desafio do Guardião Concluído!
                      </h3>
                      <p className="text-sm text-slate-300">
                        Você acertou {score} de {guardian.questions.length} perguntas sobre {guardian.stateNamePt}!
                      </p>
                    </div>

                    {score === guardian.questions.length && (
                      <div className="bg-amber-500/20 border border-amber-400 p-4 rounded-2xl text-amber-300 text-xs font-bold flex items-center justify-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-yellow-400" />
                        <span>{guardian.insigniaNamePt} Desbloqueada!</span>
                      </div>
                    )}

                    <button
                      onClick={onClose}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3 rounded-xl transition shadow-lg font-serif"
                    >
                      Retornar ao Mapa do Brasil
                    </button>
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
