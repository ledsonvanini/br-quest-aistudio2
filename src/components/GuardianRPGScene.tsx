import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GuardianData, UserProgress, Language } from '../types';
import { calculateLevel } from '../lib/storage';
import { audioEngine } from '../lib/audioSynth';
import { getCoatOfArmsUrl } from '../data/coatOfArms';
import {
  CULTURAL_INVENTORY_BY_STATE,
  CulturalItem,
  getCulturalItemsForState,
} from '../data/culturalInventoryData';
import { getStateChestXpSummary } from '../data/explorationXpRegistry';
import { CompassBadgeIcon } from './guardian/GuardianCommon';
import { GuardianDialogueBox, DialogueNode } from './guardian/GuardianDialogueBox';
import { GuardianInventoryModal } from './guardian/GuardianInventoryModal';
import { GuardianAnthemsModal } from './guardian/GuardianAnthemsModal';
import { GuardianQuizModal } from './guardian/GuardianQuizModal';
import { GuardianInsigniaCelebrationModal } from './guardian/GuardianInsigniaCelebrationModal';
import { RPGEnvironmentCanvas, EnvironmentMode, ParticleMode } from './guardian/RPGEnvironmentCanvas';
import { RPGEnvironmentGadgetHUD } from './guardian/RPGEnvironmentGadgetHUD';
import { STATE_CAPITAL_GEO_DATA } from '../data/stateCapitalGeoData';
import { getGuardianSpeech } from '../data/guardianPhrases';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Award,
  Music,
  Package,
  Settings,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Shield,
} from 'lucide-react';

interface Props {
  guardian: GuardianData;
  isCompleted: boolean;
  hasInsignia: boolean;
  onBackToMap: () => void;
  onCompleteQuiz: (xpEarned: number, correctCount: number, mode?: 'quick' | 'campaign') => void;
  onUnlockInsignia: (insigniaId: string) => void;
  onReadRelic?: (relicId: string, xpEarned: number) => void;
  onExploreDialogueTopic?: (stateId: string, topicId: string, xpEarned: number) => void;
  lang: Language;
  userProgress?: UserProgress;
  onOpenSettings?: () => void;
  onNavigateToSanctuary?: () => void;
}

type NpcState = 'idle' | 'dialogando' | 'bau_aberto' | 'hinos' | 'quiz';

export const GuardianRPGScene: React.FC<Props> = ({
  guardian,
  hasInsignia,
  onBackToMap,
  onCompleteQuiz,
  onUnlockInsignia,
  onReadRelic,
  onExploreDialogueTopic,
  userProgress,
  onOpenSettings,
  onNavigateToSanctuary,
}) => {
  // State Machine
  const [npcState, setNpcState] = useState<NpcState>('idle');
  const [dialogueNode, setDialogueNode] = useState<DialogueNode>('root');
  const [isDialogueActive, setIsDialogueActive] = useState<boolean>(true);
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
  const [isChestTransitioning, setIsChestTransitioning] = useState<boolean>(false);

  // Environment & Weather HUD state (Randomized combinations on state route access)
  const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>(() => {
    const modes: EnvironmentMode[] = ['dia', 'por_do_sol', 'noite'];
    return modes[Math.floor(Math.random() * modes.length)];
  });
  const [particleMode, setParticleMode] = useState<ParticleMode>(() => {
    const particles: ParticleMode[] = ['auto', 'flores', 'folhas', 'estrelas'];
    return particles[Math.floor(Math.random() * particles.length)];
  });

  // Re-randomize atmosphere whenever a new guardian/state route is accessed
  useEffect(() => {
    const modes: EnvironmentMode[] = ['dia', 'por_do_sol', 'noite'];
    const particles: ParticleMode[] = ['auto', 'flores', 'folhas', 'estrelas'];
    setEnvironmentMode(modes[Math.floor(Math.random() * modes.length)]);
    setParticleMode(particles[Math.floor(Math.random() * particles.length)]);
  }, [guardian.id]);

  const capitalGeo = useMemo(() => {
    return STATE_CAPITAL_GEO_DATA[guardian.id] || STATE_CAPITAL_GEO_DATA['RS'];
  }, [guardian.id]);

  // Celebration modal state
  const [celebrationData, setCelebrationData] = useState<{
    titleText: string;
    subtitleText?: string;
    insigniaName?: string;
    insigniaIcon?: string;
    xpGained?: number;
    levelReached?: number;
  } | null>(null);

  // Typewriting state
  const [displayedSpeech, setDisplayedSpeech] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive check (< 1280x720) & manual toggle state
  const [isScreenCompact, setIsScreenCompact] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1280 || window.innerHeight < 720;
    }
    return false;
  });
  const [isSidebarManualCollapsed, setIsSidebarManualCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1280 || window.innerHeight < 720;
      setIsScreenCompact(compact);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isChestModeActive = npcState === 'bau_aberto';
  const isSidebarEffectiveCollapsed =
    isChestModeActive || (isSidebarManualCollapsed !== null ? isSidebarManualCollapsed : isScreenCompact);

  // User player statistics
  const playerStats = useMemo(() => {
    if (!userProgress)
      return {
        level: 1,
        currentXpInLevel: 0,
        xpForNextLevel: 300,
        titlePt: 'Explorador Cultural',
        xpPercentage: 0,
      };
    const { level, currentXpInLevel, xpForNextLevel, titlePt } = calculateLevel(userProgress.xp);
    const xpPercentage = Math.min(100, Math.round((currentXpInLevel / xpForNextLevel) * 100));
    return { level, currentXpInLevel, xpForNextLevel, titlePt, xpPercentage };
  }, [userProgress]);

  // Inventory Items: Load strictly per state without RS fallback
  const inventoryItems: CulturalItem[] = useMemo(() => {
    return getCulturalItemsForState(guardian.id);
  }, [guardian.id]);

  // Chest XP summary calculation
  const chestSummary = useMemo(() => {
    return getStateChestXpSummary(inventoryItems, userProgress?.readPergamentIds || []);
  }, [inventoryItems, userProgress?.readPergamentIds]);

  // Speech function with smooth typewriter effect
  const speak = (text: string) => {
    if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    setDisplayedSpeech('');
    setIsTyping(true);

    let i = 0;
    const speed = 14;
    speechTimerRef.current = setInterval(() => {
      i++;
      setDisplayedSpeech(text.slice(0, i));
      if (i >= text.length) {
        setIsTyping(false);
        if (speechTimerRef.current) clearInterval(speechTimerRef.current);
      }
    }, speed);
  };

  // Initial greeting
  useEffect(() => {
    setIsDialogueActive(true);
    setDialogueNode('root');
    const speechData = getGuardianSpeech(guardian.id);
    speak(`${speechData.greeting} ${speechData.regionalCalling}`);
    return () => {
      if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    };
  }, [guardian.id]);

  // Restore/open dialogue helper
  const handleRestoreDialogue = () => {
    if (npcState === 'idle') {
      setIsDialogueActive(true);
      setDialogueNode('root');
      const speechData = getGuardianSpeech(guardian.id);
      speak(`${speechData.greeting} O que desejas desvendar sobre ${guardian.stateNamePt}?`);
    }
  };

  // Chest Toggle
  const handleChestClick = () => {
    if (isChestTransitioning) return;
    audioEngine.playSfx('badge');
    setIsChestTransitioning(true);

    const nextOpen = !isChestOpen;

    setTimeout(() => {
      setIsChestOpen(nextOpen);
      setIsChestTransitioning(false);

      if (nextOpen) {
        setNpcState('bau_aberto');
        setIsDialogueActive(false);
        const speechData = getGuardianSpeech(guardian.id);
        const cleanGreeting = speechData.greeting.replace(/[“"”]/g, '');
        speak(
          `“${cleanGreeting} Abriste o Baú de Relíquias de ${guardian.stateNamePt}! Examine cada acervo histórico e cultural guardado nesta arca sagrada!”`
        );
      } else {
        setNpcState('idle');
        setIsDialogueActive(true);
        speak(`“Baú guardado com honra! O que mais desejas desvendar sobre ${guardian.stateNamePt}?”`);
      }
    }, 250);
  };

  // Handle Reading Completion & Rewards
  const handleCompleteItemReading = (itemId: string, xpEarned: number) => {
    if (onReadRelic) {
      onReadRelic(itemId, xpEarned);
    } else {
      onCompleteQuiz(xpEarned, 0);
    }

    if (userProgress) {
      const oldLevelInfo = calculateLevel(userProgress.xp);
      const newLevelInfo = calculateLevel(userProgress.xp + xpEarned);

      // Check if user gained a new title or level up
      if (newLevelInfo.titlePt !== oldLevelInfo.titlePt || newLevelInfo.level > oldLevelInfo.level) {
        setCelebrationData({
          titleText: `Você acaba de conquistar o título ${newLevelInfo.titlePt}!`,
          subtitleText: `Pelo estudo dedicado das tradições e relíquias do Brasil, você alcançou o Nível ${newLevelInfo.level}!`,
          xpGained: xpEarned,
          levelReached: newLevelInfo.level,
        });
      }
    }
  };

  // Handle Insignia Unlocked
  const handleInsigniaEarned = (insigniaId: string) => {
    onUnlockInsignia(insigniaId);
    setCelebrationData({
      titleText: `Insígnia Sagrada de ${guardian.stateNamePt} Conquistada!`,
      subtitleText: `Você desvendou os enigmas de ${guardian.stateNamePt} e provou sua honra com bravura!`,
      insigniaName: guardian.insigniaNamePt,
      insigniaIcon: guardian.insigniaIcon,
      xpGained: 300,
    });
  };

  // Check if center is engaged (showing dialogue, inventory, quiz or anthems)
  const isEngaged =
    isDialogueActive ||
    npcState === 'bau_aberto' ||
    npcState === 'hinos' ||
    npcState === 'quiz';

  const isToolbarMode = isSidebarEffectiveCollapsed;

  const coatOfArms = getCoatOfArmsUrl(guardian.id);
  const characterImgSrc = guardian.id === 'RS' ? '/RS/itens/w-gaucho.png' : guardian.avatarUrl;
  const chestImgSrc = isChestOpen ? '/RS/itens/bau1-a.png' : '/RS/itens/bau1.png';

  return (
    <div
      id="container-tela-detalhes-estado"
      className="container-tela-detalhes-estado w-full h-screen h-dvh flex flex-row bg-slate-950 text-slate-100 select-none overflow-hidden"
    >
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. SIDEBAR LATERAL COM TRANSIÇÃO INTELIGENTE (EXPANDIDA / TOOLBAR) */}
      {/* ────────────────────────────────────────────────────────── */}
      <aside
        id="sidebar-lateral-detalhes-estado"
        className={`sidebar-lateral-detalhes-estado h-full bg-slate-950 border-r border-amber-500/30 flex flex-col justify-between z-30 shadow-2xl shrink-0 overflow-y-auto custom-scrollbar-gold transition-all duration-300 ease-in-out relative ${
          isToolbarMode
            ? 'w-[58px] sm:w-[68px] min-w-[58px] sm:min-w-[68px] p-2 items-center'
            : 'w-[250px] sm:w-[270px] min-w-[250px] sm:min-w-[270px] p-3 sm:p-3.5'
        }`}
      >
        {/* Botão Flutuante de Toggle Rápido da Sidebar */}
        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setIsSidebarManualCollapsed(!isSidebarEffectiveCollapsed);
          }}
          className={`absolute top-3 z-40 p-1 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 hover:text-amber-200 hover:bg-slate-800 transition shadow-lg cursor-pointer ${
            isToolbarMode ? 'right-1.5 translate-x-1' : 'right-2'
          }`}
          title={isToolbarMode ? 'Expandir Painel Lateral' : 'Minimizar Painel Lateral'}
        >
          {isToolbarMode ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        <div className={`space-y-3 w-full ${isToolbarMode ? 'flex flex-col items-center' : ''}`}>
          {/* 1.1 APP LOGO + SETTINGS */}
          {isToolbarMode ? (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="icone-logo-brasil w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-base font-black text-slate-950 shadow-md cursor-pointer hover:scale-105 transition-transform"
                title="Símbolos BR - RPG Cívico"
              >
                🇧🇷
              </div>
              {onOpenSettings && (
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onOpenSettings();
                  }}
                  className="btn-abrir-ajustes p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-400 transition cursor-pointer"
                  title="Configurações & Áudio"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="grupo-logotipo-sidebar flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="icone-logo-brasil w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-sm font-black text-slate-950 shadow">
                  🇧🇷
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="titulo-app font-serif font-black text-xs text-amber-400 tracking-wider">
                      SÍMBOLOS BR
                    </h1>
                    <span className="badge-genero-rpg bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[9px] font-bold px-1.5 py-0.2 rounded font-serif">
                      RPG
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-serif">Guardiões da Cultura</p>
                </div>
              </div>

              {onOpenSettings && (
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onOpenSettings();
                  }}
                  className="btn-abrir-ajustes p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-400 transition cursor-pointer"
                  title="Configurações & Áudio"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* 1.2 XP PROGRESS & PLAYER LEVEL */}
          {userProgress && (
            isToolbarMode ? (
              <div
                className="painel-xp-sidebar-compact p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center w-full shadow-inner cursor-default"
                title={`Nível ${playerStats.level} (${userProgress.xp} XP) - ${playerStats.titlePt}`}
              >
                <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[10px] font-mono font-bold text-amber-300">
                  Nv.{playerStats.level}
                </span>
              </div>
            ) : (
              <div className="painel-xp-sidebar p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-serif font-bold">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nível {playerStats.level}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {userProgress.xp} XP
                  </span>
                </div>
                <div className="barra-progresso-xp w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="preenchimento-progresso-xp bg-amber-400 h-full transition-all duration-300"
                    style={{ width: `${playerStats.xpPercentage}%` }}
                  />
                </div>
                <div className="text-[9px] text-amber-400/80 font-serif truncate">
                  {playerStats.titlePt}
                </div>
              </div>
            )
          )}

          {/* 1.3 MAIN NAVIGATION BUTTONS */}
          <div className={`space-y-1.5 w-full ${isToolbarMode ? 'flex flex-col items-center' : ''}`}>
            <button
              onClick={() => {
                audioEngine.playSfx('click');
                onBackToMap();
              }}
              className={`btn-acao-voltar-mapa group transition-all duration-200 cursor-pointer ${
                isToolbarMode
                  ? 'p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-400 border border-amber-500/40 hover:border-amber-400 flex items-center justify-center w-full shadow-sm'
                  : 'w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400'
              }`}
              title="Voltar ao Mapa do Brasil"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                {!isToolbarMode && <span className="font-serif font-bold text-xs">Voltar ao Mapa</span>}
              </div>
              {!isToolbarMode && (
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>

            {onNavigateToSanctuary && (
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onNavigateToSanctuary();
                }}
                className={`btn-ir-santuario group transition-all duration-200 cursor-pointer ${
                  isToolbarMode
                    ? 'p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-400 border border-slate-800 hover:border-amber-500/40 flex items-center justify-center w-full shadow-sm'
                    : 'w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40'
                }`}
                title={`Santuário de Insígnias (${userProgress?.unlockedInsigniaIds.length || 0}/27)`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  {!isToolbarMode && <span className="font-serif font-bold text-xs">Santuário de Insígnias</span>}
                </div>
                {!isToolbarMode && (
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                    {userProgress?.unlockedInsigniaIds.length || 0}/27
                  </span>
                )}
              </button>
            )}
          </div>

          {/* 1.4 STATE IDENTITY CARD */}
          {isToolbarMode ? (
            <div
              className="card-brasao-estado-toolbar p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer shadow-sm hover:border-amber-500/40 transition"
              title={`${guardian.stateNamePt} (${guardian.id}) - Cap. ${guardian.capitalPt}`}
            >
              <div className="w-9 h-9 rounded-lg p-0.5 bg-slate-950 border border-amber-500/40 flex items-center justify-center">
                <img
                  src={coatOfArms}
                  alt={`Brasão de ${guardian.stateNamePt}`}
                  className="w-full h-full object-contain filter drop-shadow"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="card-brasao-estado-sidebar p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg p-0.5 bg-slate-950 border border-amber-500/40 flex items-center justify-center shrink-0">
                <img
                  src={coatOfArms}
                  alt={`Brasão de ${guardian.stateNamePt}`}
                  className="w-full h-full object-contain filter drop-shadow"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">{guardian.flagSymbol}</span>
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 font-mono font-bold">
                    {guardian.id} • {guardian.regionId.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-xs text-amber-200 truncate">
                  {guardian.stateNamePt}
                </h2>
                <p className="text-[10px] text-slate-400 font-serif truncate">
                  Cap. {guardian.capitalPt}
                </p>
              </div>
            </div>
          )}

          {/* 1.5 ACTIONS */}
          <div className={`space-y-1.5 pt-1 w-full ${isToolbarMode ? 'flex flex-col items-center' : ''}`}>
            {/* Abrir Baú */}
            <button
              onClick={handleChestClick}
              className={`item-menu-lateral-bau group transition-all duration-200 cursor-pointer ${
                isToolbarMode
                  ? 'p-2.5 rounded-xl border flex items-center justify-center w-full bg-amber-500 text-slate-950 border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-bold'
                  : `w-full flex items-center justify-between p-2 rounded-xl border ${
                      isChestOpen
                        ? 'bg-amber-500 text-slate-950 border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-bold'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-amber-500/40'
                    }`
              }`}
              title={isChestOpen ? 'Fechar Baú de Relíquias' : 'Abrir Baú de Relíquias'}
            >
              <div className="flex items-center gap-2">
                <Package className={`w-4 h-4 ${isChestOpen ? 'text-slate-950' : 'text-amber-400'}`} />
                {!isToolbarMode && (
                  <span className="font-serif font-bold text-xs">
                    {isChestOpen ? 'Baú Aberto (Ativo)' : 'Abrir Baú de Relíquias'}
                  </span>
                )}
              </div>
              {!isToolbarMode && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isChestOpen ? 'bg-slate-950 text-amber-300' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  {inventoryItems.length}
                </span>
              )}
            </button>

            {/* Hinos */}
            <button
              onClick={() => {
                audioEngine.playSfx('click');
                setNpcState('hinos');
                speak('“Ouça com orgulho os hinos sagrados que contam nossa história!”');
              }}
              className={`item-menu-lateral-hinos group transition-all duration-200 cursor-pointer ${
                isToolbarMode
                  ? 'p-2.5 rounded-xl border flex items-center justify-center w-full bg-slate-900 hover:bg-slate-850 text-amber-400 border-slate-800 hover:border-amber-500/40'
                  : `w-full flex items-center justify-between p-2 rounded-xl border ${
                      npcState === 'hinos'
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow font-bold'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-amber-500/40'
                    }`
              }`}
              title="Hinos Sagrados do Estado"
            >
              <div className="flex items-center gap-2">
                <Music className={`w-4 h-4 ${!isToolbarMode && npcState === 'hinos' ? 'text-slate-950' : 'text-amber-400'}`} />
                {!isToolbarMode && <span className="font-serif font-bold text-xs">Hinos Sagrados</span>}
              </div>
              {!isToolbarMode && <ChevronRight className="w-3.5 h-3.5 text-amber-400/80" />}
            </button>

            {/* Quiz */}
            <button
              onClick={() => {
                audioEngine.playSfx('click');
                setNpcState('quiz');
                speak('“Prepare-se para o Desafio de Honra! Teste seus conhecimentos e conquiste a Insígnia!”');
              }}
              className={`item-menu-lateral-quiz group transition-all duration-200 cursor-pointer ${
                isToolbarMode
                  ? 'p-2.5 rounded-xl border flex items-center justify-center w-full bg-slate-900 hover:bg-slate-850 text-amber-400 border-slate-800 hover:border-amber-500/40'
                  : `w-full flex items-center justify-between p-2 rounded-xl border ${
                      npcState === 'quiz'
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow font-bold'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-amber-500/40'
                    }`
              }`}
              title="Desafio de Honra (Quiz +300 XP)"
            >
              <div className="flex items-center gap-2">
                <Award className={`w-4 h-4 ${!isToolbarMode && npcState === 'quiz' ? 'text-slate-950' : 'text-amber-400'}`} />
                {!isToolbarMode && <span className="font-serif font-bold text-xs">Desafio de Honra</span>}
              </div>
              {!isToolbarMode && (
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  +300 XP
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 1.6 BOTTOM INSIGNIA STATUS */}
        <div className={`pt-2 border-t border-slate-800 w-full ${isToolbarMode ? 'flex justify-center' : ''}`}>
          {isToolbarMode ? (
            <div
              className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer ${
                hasInsignia
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={hasInsignia ? 'Insígnia Sagrada Conquistada!' : 'Insígnia Sagrada Pendente (Faça o Quiz)'}
            >
              {hasInsignia ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-500" />
              )}
            </div>
          ) : hasInsignia ? (
            <div className="card-insignia-conquistada flex items-center gap-2 p-2 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-300 text-xs font-serif font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Insígnia Sagrada Conquistada</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-serif">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span>Complete o Quiz para a Insígnia</span>
            </div>
          )}
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. PALCO PRINCIPAL RPG COM ANIMAÇÃO SEPARADORA DINÂMICA    */}
      {/* ────────────────────────────────────────────────────────── */}
      <main
        id="conteudo-principal-cena-rpg"
        className="conteudo-principal-cena-rpg flex-1 h-full relative overflow-hidden flex flex-col justify-end"
      >
        {/* Deep Slate Atmospheric Backdrop */}
        <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/br/bg-mapa-br.png')] bg-cover bg-center opacity-5 mix-blend-overlay pointer-events-none" />

        {/* Dynamic RPG Environment Canvas (Day / Sunset / Night & Regional Particles) */}
        <RPGEnvironmentCanvas
          environmentMode={environmentMode}
          particleMode={particleMode}
          typicalFlower={capitalGeo.typicalFlower}
        />

        {/* Environment & State Capital Gadget HUD (Top-Right Toolbar Stack) */}
        {npcState !== 'bau_aberto' && (
          <RPGEnvironmentGadgetHUD
            stateId={guardian.id}
            stateName={guardian.stateNamePt}
            capitalName={guardian.capitalPt}
            environmentMode={environmentMode}
            onSelectEnvironmentMode={setEnvironmentMode}
            particleMode={particleMode}
            onSelectParticleMode={setParticleMode}
          />
        )}

        {/* Floor Shadow Contact */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-14 bg-black/80 rounded-[100%] blur-2xl pointer-events-none -z-10" />

        {/* ────────────────────────────────────────────────────────── */}
        {/* CENTER INTERACTION AREA: DIALOGUE OR COMPACT PANELS        */}
        {/* ────────────────────────────────────────────────────────── */}
        {isDialogueActive && npcState === 'idle' && (
          <div className="absolute top-2 sm:top-5 left-1/2 -translate-x-1/2 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl px-3 sm:px-6 z-30 animate-in fade-in zoom-in-95 duration-500">
            <GuardianDialogueBox
              guardian={guardian}
              dialogueNode={dialogueNode}
              setDialogueNode={setDialogueNode}
              displayedSpeech={displayedSpeech}
              isTyping={isTyping}
              onOpenChest={handleChestClick}
              onStartQuiz={() => {
                setNpcState('quiz');
                speak('“Prepare-se para o Desafio de Honra!”');
              }}
              onSpeak={speak}
              onCloseDialogue={() => setIsDialogueActive(false)}
              exploredDialogueIds={userProgress?.exploredDialogueIds || []}
              onExploreDialogueTopic={(topicId, xpReward) =>
                onExploreDialogueTopic?.(guardian.id, topicId, xpReward)
              }
              chestTotalXp={chestSummary.totalXp}
              chestEarnedXp={chestSummary.earnedXp}
              userProgress={userProgress}
            />
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* STAGE: GUARDIAN & CHEST APPROACH / SEPARATE DYNAMICALLY     */}
        {/* ────────────────────────────────────────────────────────── */}
        <div
          id="palco-guardiao-cenario"
          className="palco-guardiao-cenario relative w-full h-[90vh] max-h-[90vh] flex items-end justify-center pointer-events-auto"
        >
          {/* 1. O GUARDIÃO:
              - Quando o diálogo está aberto: afasta-se suavemente para o canto esquerdo
              - Quando o diálogo fecha: aproxima-se do centro ao lado do Baú
              - Quando o inventário está aberto: oculta-se suavemente com fade + slide */}
          <div
            onClick={handleRestoreDialogue}
            onMouseEnter={handleRestoreDialogue}
            className={`personagem-guardiao-destaque absolute bottom-0 h-[92%] sm:h-[95%] flex flex-col items-start justify-end group cursor-pointer z-10 transition-all duration-700 ease-in-out ${
              npcState === 'bau_aberto'
                ? 'opacity-0 pointer-events-none -translate-x-28 scale-90 left-0'
                : isDialogueActive && npcState === 'idle'
                ? 'left-0 sm:left-2 md:left-4 translate-x-0 scale-95 opacity-100'
                : 'left-1/2 -translate-x-[85%] sm:-translate-x-[75%] md:-translate-x-[68%] scale-100 opacity-100'
            }`}
            title="Clique ou passe o mouse no Guardião para abrir o Diálogo"
          >
            {/* Character Full-Body Graphic */}
            <img
              src={characterImgSrc}
              alt={guardian.guardianName}
              className="h-full w-auto max-w-full object-contain object-bottom-left filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] group-hover:scale-[1.01] transition-transform duration-300"
            />

            {/* Name Banner at Feet */}
            <div className="banner-nome-pes -mt-3 ml-2 sm:ml-4 bg-slate-900/95 border border-amber-500/60 px-3 py-1 rounded-xl shadow-2xl text-center z-20 backdrop-blur-sm">
              <span className="text-xs font-serif font-bold text-amber-200 whitespace-nowrap">
                {guardian.guardianName} ({guardian.guardianTitlePt})
              </span>
            </div>
          </div>

          {/* 2. O BAÚ DE RELÍQUIAS (AMPLIADO EM ~50% PARA MÁXIMO IMPACTO RPG):
              - Quando o modal do baú está aberto: ocultado no fundo para evitar duplicidade com o cabeçalho
              - Quando o diálogo está aberto: afasta-se para a direita
              - Quando o diálogo fecha: aproxima-se do centro ao lado do Guardião */}
          {npcState !== 'bau_aberto' && (
            <div
              onClick={handleChestClick}
              className={`elemento-bau-reliquias absolute bottom-2 sm:bottom-3 flex flex-col items-center justify-end group cursor-pointer z-30 transition-all duration-700 ease-in-out ${
                isDialogueActive && npcState === 'idle'
                  ? 'right-2 sm:right-6 md:right-8 translate-x-0'
                  : 'left-1/2 translate-x-[15%] sm:translate-x-[20%] md:translate-x-[24%]'
              }`}
              title="Clique para abrir o Baú de Relíquias"
            >
              {/* Treasure Glow */}
              <div
                className={`absolute bottom-2 w-64 sm:w-80 md:w-96 h-28 sm:h-36 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                  isChestOpen
                    ? 'bg-amber-400/50 shadow-[0_0_50px_rgba(245,158,11,0.7)]'
                    : 'bg-amber-500/25 group-hover:bg-amber-400/40'
                }`}
              />

              {/* Floating Action Badge */}
              <div className="absolute -top-8 bg-amber-500 text-slate-950 text-[11px] font-black font-serif px-3 py-0.5 rounded-full shadow-xl border border-amber-300 flex items-center gap-1.5 group-hover:scale-105 transition-transform whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>
                  {isChestTransitioning
                    ? 'Abrindo...'
                    : isChestOpen
                    ? 'Baú de Relíquias Aberto'
                    : 'Abrir Baú de Relíquias'}
                </span>
              </div>

              {/* Proportional Large Chest Graphic (+50% Scale) */}
              <div className="relative w-64 sm:w-80 md:w-96 h-44 sm:h-56 md:h-64 flex items-center justify-center">
                <img
                  src={chestImgSrc}
                  alt={isChestOpen ? 'Baú Cultural Aberto' : 'Baú Cultural Fechado'}
                  className={`w-full h-full object-contain filter transition-all duration-300 drop-shadow-[0_16px_28px_rgba(0,0,0,0.9)] ${
                    isChestTransitioning
                      ? 'opacity-75 scale-95'
                      : isChestOpen
                      ? 'scale-105 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]'
                      : 'group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                  }`}
                />
              </div>

              {/* Subtitle */}
              <div className="bg-slate-900/95 border border-amber-500/70 px-3.5 py-1 rounded-xl shadow-xl text-center mt-1">
                <span className="text-xs sm:text-sm font-serif font-bold text-amber-300">
                  Baú de Relíquias ({inventoryItems.length} Itens)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 3. MODAIS AUXILIARES (INVENTÁRIO, HINOS, QUIZ, CELEBRAÇÃO) */}
        {/* ────────────────────────────────────────────────────────── */}

        {/* MODAL INVENTÁRIO (Com Painel de Leitura & Atribuição de XP) */}
        {npcState === 'bau_aberto' && (
          <GuardianInventoryModal
            stateId={guardian.id}
            items={inventoryItems}
            guardianName={guardian.guardianName}
            readItemIds={userProgress?.readPergamentIds || []}
            onClose={() => {
              setIsChestOpen(false);
              setNpcState('idle');
              setIsDialogueActive(true);
              speak('“Baú guardado com honra! O que mais desejas explorar?”');
            }}
            onInspectItem={(item) => speak(item.guardianQuote)}
            onCompleteReading={handleCompleteItemReading}
            onSpeak={speak}
          />
        )}

        {/* MODAL HINOS SAGRADOS */}
        {npcState === 'hinos' && (
          <GuardianAnthemsModal
            stateId={guardian.id}
            onClose={() => {
              setNpcState('idle');
              setIsDialogueActive(true);
            }}
          />
        )}

        {/* MODAL QUIZ / DESAFIO DE HONRA */}
        {npcState === 'quiz' && (
          <GuardianQuizModal
            guardian={guardian}
            userProgress={userProgress}
            onClose={() => {
              setNpcState('idle');
              setIsDialogueActive(true);
            }}
            onCompleteQuiz={onCompleteQuiz}
            onUnlockInsignia={handleInsigniaEarned}
            onSpeak={speak}
          />
        )}

        {/* MODAL DE CELEBRAÇÃO DE TÍTULO / INSÍGNIA */}
        {celebrationData && (
          <GuardianInsigniaCelebrationModal
            titleText={celebrationData.titleText}
            subtitleText={celebrationData.subtitleText}
            insigniaName={celebrationData.insigniaName}
            insigniaIcon={celebrationData.insigniaIcon}
            xpGained={celebrationData.xpGained}
            levelReached={celebrationData.levelReached}
            onClose={() => setCelebrationData(null)}
            onNavigateToSanctuary={onNavigateToSanctuary}
          />
        )}
      </main>
    </div>
  );
};
