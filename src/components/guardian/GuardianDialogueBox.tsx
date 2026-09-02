import React, { useState, useMemo } from 'react';
import { GuardianData, UserProgress } from '../../types';
import { getCoatOfArmsUrl } from '../../data/coatOfArms';
import { getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
import { getGuardianSpeech } from '../../data/guardianPhrases';
import { audioEngine } from '../../lib/audioSynth';
import {
  Compass,
  MessageSquare,
  Award,
  BookOpen,
  Landmark,
  Utensils,
  Leaf,
  Package,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Swords,
  X,
  Flame,
  Feather,
  Sword,
  Users,
  Coffee,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import {
  getStateDialogueTopics,
  getStateDialogueXpSummary,
  DialogueCuriosityTopic,
} from '../../data/explorationXpRegistry';

export type DialogueNode =
  | 'root'
  | 'historia'
  | 'historia_doc'
  | 'historia_heroes'
  | 'historia_garb'
  | 'cultura'
  | 'cultura_prato'
  | 'cultura_festa'
  | 'cultura_hino'
  | 'natureza'
  | 'natureza_fauna'
  | 'natureza_flora'
  | 'natureza_bioma'
  | 'farrapos'
  | 'farrapos_anita'
  | 'farrapos_lenco'
  | 'farrapos_sepe'
  | 'costumes'
  | 'costumes_chimarrao'
  | 'costumes_churrasco'
  | 'costumes_pilcha'
  | 'natureza_quero'
  | 'natureza_araucaria'
  | 'natureza_cavalo';

export interface DialogueOption {
  id: string;
  label: string;
  desc?: string;
  category?: string;
  xpReward?: number;
  isExplored?: boolean;
  icon: React.ElementType;
  action: () => void;
  highlight?: boolean;
}

interface Props {
  guardian: GuardianData;
  dialogueNode: DialogueNode;
  setDialogueNode: (node: DialogueNode) => void;
  displayedSpeech: string;
  isTyping: boolean;
  onOpenChest: () => void;
  onStartQuiz: () => void;
  onSpeak: (text: string) => void;
  onCloseDialogue?: () => void;
  exploredDialogueIds?: string[];
  onExploreDialogueTopic?: (topicId: string, xpEarned: number) => void;
  chestTotalXp?: number;
  chestEarnedXp?: number;
  userProgress?: UserProgress;
  totalUserXp?: number;
}

export const GuardianDialogueBox: React.FC<Props> = ({
  guardian,
  dialogueNode,
  setDialogueNode,
  displayedSpeech,
  isTyping,
  onOpenChest,
  onStartQuiz,
  onSpeak,
  onCloseDialogue,
  exploredDialogueIds = [],
  onExploreDialogueTopic,
  chestTotalXp,
  chestEarnedXp,
  userProgress,
  totalUserXp,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'historia' | 'cultura' | 'natureza'>('geral');
  const speech = useMemo(() => getGuardianSpeech(guardian.id), [guardian.id]);
  const coatUrl = useMemo(() => getCoatOfArmsUrl(guardian.id), [guardian.id]);
  const flagUrl = useMemo(() => getStateFlagUrl(guardian.id), [guardian.id]);
  const capitalData = STATE_CAPITAL_GEO_DATA[guardian.id];

  // Cálculo do Horário Local pelo fuso horário do estado
  const localTimeString = useMemo(() => {
    const now = new Date();
    let offsetHours = -3;
    if (guardian.id === 'AC') offsetHours = -5;
    else if (['AM', 'RR', 'RO', 'MT', 'MS'].includes(guardian.id)) offsetHours = -4;
    else if (guardian.id === 'FN') offsetHours = -2;

    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const targetDate = new Date(utcTime + 3600000 * offsetHours);
    return targetDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }, [guardian.id]);

  // Curiosidades e XP individualizado de diálogo para o estado
  const dialogueSummary = useMemo(() => {
    return getStateDialogueXpSummary(guardian, exploredDialogueIds);
  }, [guardian, exploredDialogueIds]);

  const allTopics = useMemo(() => {
    return getStateDialogueTopics(guardian);
  }, [guardian]);

  const historyTopics = useMemo(() => allTopics.filter((t) => t.tabKey === 'historia'), [allTopics]);
  const cultureTopics = useMemo(() => allTopics.filter((t) => t.tabKey === 'cultura'), [allTopics]);
  const natureTopics = useMemo(() => allTopics.filter((t) => t.tabKey === 'natureza'), [allTopics]);

  const getTopicIcon = (topic: DialogueCuriosityTopic) => {
    if (topic.category.includes('Documento') || topic.category.includes('Memória')) return BookOpen;
    if (topic.category.includes('Herói') || topic.category.includes('Pioneiro') || topic.category.includes('Epopeia')) return Sword;
    if (topic.category.includes('Traje') || topic.category.includes('Insígnia') || topic.category.includes('Identidade')) return Shield;
    if (topic.category.includes('Culinária') || topic.category.includes('Gastronomia')) return Utensils;
    if (topic.category.includes('Festa') || topic.category.includes('Patrimônio') || topic.category.includes('Celebração')) return Sparkles;
    if (topic.category.includes('Hino') || topic.category.includes('Símbolo')) return Feather;
    if (topic.category.includes('Fauna')) return Leaf;
    if (topic.category.includes('Flora') || topic.category.includes('Botânica')) return Leaf;
    if (topic.category.includes('Bioma') || topic.category.includes('Território') || topic.category.includes('Geografia')) return Compass;
    return BookOpen;
  };

  const handleSelectTopic = (topic: DialogueCuriosityTopic) => {
    if (onExploreDialogueTopic && !exploredDialogueIds.includes(topic.id)) {
      onExploreDialogueTopic(topic.id, topic.xpReward);
    }
    onSpeak(topic.speechText);
  };

  const handleTabChange = (tab: 'geral' | 'historia' | 'cultura' | 'natureza') => {
    audioEngine.playSfx('click');
    setActiveTab(tab);
    if (tab === 'geral') {
      setDialogueNode('root');
      onSpeak(`${speech.greeting} ${speech.regionalCalling}`);
    } else if (tab === 'historia') {
      setDialogueNode('historia');
      onSpeak(`“${speech.welcomeDetails.historyText}”`);
    } else if (tab === 'cultura') {
      setDialogueNode('cultura');
      onSpeak(`“${speech.welcomeDetails.cultureText}”`);
    } else if (tab === 'natureza') {
      setDialogueNode('natureza');
      onSpeak(`“${speech.welcomeDetails.natureText}”`);
    }
  };

  // Opções interativas dinâmicas com classificação e XP individualizados
  const contextualOptions: DialogueOption[] = useMemo(() => {
    const chestLabel =
      chestEarnedXp !== undefined && chestTotalXp !== undefined
        ? `📖 Abrir Baú de Relíquias de ${guardian.stateNamePt} (XP ${chestEarnedXp}/${chestTotalXp})`
        : `📖 Abrir Baú de Relíquias de ${guardian.stateNamePt} (+50 XP)`;

    switch (dialogueNode) {
      case 'historia':
        return [
          ...historyTopics.map((topic) => ({
            id: topic.id,
            label: topic.title,
            desc: topic.desc,
            category: topic.category,
            xpReward: topic.xpReward,
            isExplored: exploredDialogueIds.includes(topic.id),
            icon: getTopicIcon(topic),
            action: () => handleSelectTopic(topic),
          })),
          {
            id: 'opt_back_hist_root',
            label: '← Voltar às Boas-Vindas',
            desc: 'Retornar ao diálogo principal',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              setActiveTab('geral');
              onSpeak(`${speech.greeting} ${speech.regionalCalling}`);
            },
          },
        ];

      case 'historia_doc':
      case 'historia_heroes':
      case 'historia_garb':
      case 'farrapos_anita':
      case 'farrapos_lenco':
      case 'farrapos_sepe':
        return [
          {
            id: 'opt_study_item_h',
            label: chestLabel,
            desc: 'Ver documentos, acervo oficial e fontes históricas',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_back_to_hist',
            label: `⚔️ Explorar outro fato histórico de ${guardian.stateNamePt}`,
            desc: 'Ver outros registros e líderes',
            icon: Swords,
            action: () => {
              setDialogueNode('historia');
              onSpeak(`“Qual outro momento histórico de ${guardian.stateNamePt} desejas desvendar?”`);
            },
          },
          {
            id: 'opt_back_root_h',
            label: '← Voltar às Boas-Vindas',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              setActiveTab('geral');
              onSpeak(`${speech.greeting} O que mais queres conhecer?`);
            },
          },
        ];

      case 'cultura':
        return [
          ...cultureTopics.map((topic) => ({
            id: topic.id,
            label: topic.title,
            desc: topic.desc,
            category: topic.category,
            xpReward: topic.xpReward,
            isExplored: exploredDialogueIds.includes(topic.id),
            icon: getTopicIcon(topic),
            action: () => handleSelectTopic(topic),
          })),
          {
            id: 'opt_back_cult_root',
            label: '← Voltar às Boas-Vindas',
            desc: 'Retornar ao diálogo principal',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              setActiveTab('geral');
              onSpeak(`${speech.greeting} ${speech.regionalCalling}`);
            },
          },
        ];

      case 'cultura_prato':
      case 'cultura_festa':
      case 'cultura_hino':
      case 'costumes_chimarrao':
      case 'costumes_churrasco':
      case 'costumes_pilcha':
        return [
          {
            id: 'opt_study_item_c',
            label: chestLabel,
            desc: 'Consulte registros culturais e históricos com fotos e fichas',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_back_to_cult',
            label: `🎭 Explorar outra Tradição de ${guardian.stateNamePt}`,
            icon: Utensils,
            action: () => {
              setDialogueNode('cultura');
              onSpeak(`“Qual outro costume de ${guardian.stateNamePt} queres descobrir?”`);
            },
          },
          {
            id: 'opt_back_root_c',
            label: '← Voltar às Boas-Vindas',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              setActiveTab('geral');
              onSpeak(`${speech.greeting} Sobre qual outro tema queres conversar?`);
            },
          },
        ];

      case 'natureza':
        return [
          ...natureTopics.map((topic) => ({
            id: topic.id,
            label: topic.title,
            desc: topic.desc,
            category: topic.category,
            xpReward: topic.xpReward,
            isExplored: exploredDialogueIds.includes(topic.id),
            icon: getTopicIcon(topic),
            action: () => handleSelectTopic(topic),
          })),
          {
            id: 'opt_back_nat_root',
            label: '← Voltar às Boas-Vindas',
            desc: 'Retornar ao diálogo principal',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              setActiveTab('geral');
              onSpeak(`${speech.greeting} ${speech.regionalCalling}`);
            },
          },
        ];

      case 'natureza_fauna':
      case 'natureza_flora':
      case 'natureza_bioma':
      case 'natureza_quero':
      case 'natureza_araucaria':
      case 'natureza_cavalo':
        return [
          {
            id: 'opt_study_item_n',
            label: chestLabel,
            desc: 'Consultar fichas da fauna, flora e unidades de conservação',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_back_to_nat',
            label: `🌿 Explorar outros aspectos da Natureza`,
            icon: Leaf,
            action: () => {
              setDialogueNode('natureza');
              onSpeak(`“Que outro detalhe da natureza de ${guardian.stateNamePt} queres conhecer?”`);
            },
          },
          {
            id: 'opt_back_root_n',
            label: '← Voltar às Boas-Vindas',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              setActiveTab('geral');
              onSpeak(`${speech.greeting} O que mais queres conhecer?`);
            },
          },
        ];

      default:
        return [];
    }
  }, [
    dialogueNode,
    guardian,
    onOpenChest,
    onSpeak,
    setDialogueNode,
    speech,
    historyTopics,
    cultureTopics,
    natureTopics,
    exploredDialogueIds,
    onExploreDialogueTopic,
    chestEarnedXp,
    chestTotalXp,
  ]);

  return (
    <div
      id="balao-dialogo-guardiao-rpg"
      className="balao-dialogo-guardiao-rpg w-full bg-slate-950/95 border-2 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.35)] backdrop-blur-xl text-white space-y-4 select-none relative z-30 transition-all duration-300"
    >
      {/* Cantos Ornamentais de Brasão Dourado */}
      <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow" />
      <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow" />
      <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow" />

      {/* 1. CABEÇALHO DO DIÁLOGO: Brasão, Estado, Capital, Horário, Guardião e Destaque Padronizado de XP */}
      <div className="cabecalho-dialogo-guardiao flex items-center justify-between gap-3 pb-3 border-b border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-3">
        {/* Coluna Esquerda: Brasão + Informações em linhas (com quebra natural para a próxima linha) */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-slate-900 border-2 border-amber-400 p-1 flex items-center justify-center shadow-lg shrink-0 overflow-hidden relative">
            <img
              src={coatUrl || flagUrl}
              alt={`Brasão de ${guardian.stateNamePt}`}
              className="w-full h-full object-contain filter drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            {/* Linha Superior: [UF] • Região/Capital • Hora Local */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1 text-xs leading-tight">
              <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 shrink-0">
                {guardian.id}
              </span>
              <span className="text-slate-300 flex items-center gap-1 font-serif">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Região {guardian.regionId.toUpperCase()} • Capital {guardian.capitalPt}
              </span>
              <span className="text-amber-300/90 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {localTimeString} (Hora Local)
              </span>
            </div>

            {/* Linha Inferior: Nome do Estado e Título do Guardião (quebra para próxima linha) */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-snug">
              <h2 className="font-serif font-black text-base sm:text-xl md:text-2xl text-amber-200">
                {guardian.stateNamePt}
              </h2>
              <span className="text-slate-500 text-xs hidden sm:inline">•</span>
              <p className="font-serif text-xs sm:text-sm text-amber-400/90 font-semibold flex items-center gap-1.5 break-words">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {guardian.guardianTitlePt}
              </p>
            </div>
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
                {(userProgress?.xp ?? totalUserXp ?? 0).toLocaleString('pt-BR')}{' '}
                <span className="text-[10px] text-amber-400 font-bold">XP</span>
              </span>
            </div>

            <div className="h-6 w-px bg-amber-500/40 mx-0.5 hidden sm:block" />

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 leading-none">
                Curiosidades ({dialogueSummary.exploredCount}/{dialogueSummary.totalTopics})
              </span>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                <span className="text-xs font-mono font-black text-amber-300">
                  XP {dialogueSummary.earnedXp}/{dialogueSummary.totalXp}
                </span>
                <div className="w-10 sm:w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                    style={{ width: `${dialogueSummary.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {onCloseDialogue && (
            <button
              onClick={onCloseDialogue}
              className="btn-fechar-painel text-slate-400 hover:text-amber-300 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 transition cursor-pointer shrink-0"
              title="Recolher Caixa de Diálogo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. ABAS DE TÓPICOS DO DIÁLOGO (Boas-Vindas, História & Heróis, Cultura & Sabores, Natureza & Bioma) */}
      <div className="abas-dialogo-guardiao grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => handleTabChange('geral')}
          className={`px-3 py-2 sm:py-2.5 rounded-xl font-serif text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'geral'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black ring-1 ring-amber-300'
              : 'text-slate-300 hover:text-amber-300 bg-slate-900/90 border-slate-800 hover:border-amber-400/50'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span className="truncate">Boas-Vindas</span>
        </button>
        <button
          onClick={() => handleTabChange('historia')}
          className={`px-3 py-2 sm:py-2.5 rounded-xl font-serif text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'historia'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black ring-1 ring-amber-300'
              : 'text-slate-300 hover:text-amber-300 bg-slate-900/90 border-slate-800 hover:border-amber-400/50'
          }`}
        >
          <Landmark className="w-4 h-4 shrink-0" />
          <span className="truncate">História & Heróis</span>
        </button>
        <button
          onClick={() => handleTabChange('cultura')}
          className={`px-3 py-2 sm:py-2.5 rounded-xl font-serif text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'cultura'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black ring-1 ring-amber-300'
              : 'text-slate-300 hover:text-amber-300 bg-slate-900/90 border-slate-800 hover:border-amber-400/50'
          }`}
        >
          <Utensils className="w-4 h-4 shrink-0" />
          <span className="truncate">Cultura & Sabores</span>
        </button>
        <button
          onClick={() => handleTabChange('natureza')}
          className={`px-3 py-2 sm:py-2.5 rounded-xl font-serif text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'natureza'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black ring-1 ring-amber-300'
              : 'text-slate-300 hover:text-amber-300 bg-slate-900/90 border-slate-800 hover:border-amber-400/50'
          }`}
        >
          <Leaf className="w-4 h-4 shrink-0" />
          <span className="truncate">Natureza & Bioma</span>
        </button>
      </div>

      {/* 3. BALÃO DE FALA COM DIGITAÇÃO DINÂMICA */}
      <div className="balao-fala-ativa bg-slate-900/90 border border-amber-500/40 p-3.5 sm:p-4 rounded-2xl min-h-[70px] flex items-center shadow-inner relative">
        <p className="texto-fala-guardiao font-serif text-xs sm:text-sm md:text-base text-amber-100 italic leading-relaxed">
          {displayedSpeech}
          {isTyping && (
            <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1.5 animate-pulse" />
          )}
        </p>
      </div>

      {/* 4. OPÇÕES CONTEXTUAIS OU BOTÕES PRINCIPAIS DE AÇÃO RPG */}
      {contextualOptions.length > 0 ? (
        <div className="opcoes-dialogo-subtopicos grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto custom-scrollbar-gold pr-1">
          {contextualOptions.map((opt) => {
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={opt.action}
                className={`btn-escolha-dialogo group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:translate-x-0.5 shadow-sm ${
                  opt.highlight
                    ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border-amber-500/80 hover:border-amber-400 hover:from-amber-900/90'
                    : 'bg-slate-900/90 hover:bg-amber-500/15 border-slate-800 hover:border-amber-400/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      opt.highlight
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-amber-500/20 border border-amber-400/40 group-hover:bg-amber-500 group-hover:text-slate-950'
                    }`}
                  >
                    <OptIcon
                      className={`w-4 h-4 ${
                        opt.highlight
                          ? 'text-slate-950'
                          : 'text-amber-300 group-hover:text-slate-950'
                      }`}
                    />
                  </div>
                  <div className="truncate flex-1">
                    <div
                      className={`text-xs sm:text-sm font-serif font-bold ${
                        opt.highlight
                          ? 'text-amber-300 group-hover:text-yellow-200'
                          : 'text-slate-200 group-hover:text-amber-200'
                      }`}
                    >
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div className="text-[11px] text-slate-400 font-serif truncate">
                        {opt.desc}
                      </div>
                    )}
                    {opt.category && opt.xpReward !== undefined && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="badge-classificacao-dialogo text-[9px] font-mono px-1.5 py-0.5 rounded border bg-amber-500/15 text-amber-300 border-amber-400/30 font-bold">
                          [{opt.category}]
                        </span>
                        <span
                          className={`badge-xp-dialogo text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold flex items-center gap-1 ${
                            opt.isExplored
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                              : 'bg-amber-400 text-slate-950 border-yellow-200 shadow-sm'
                          }`}
                        >
                          {opt.isExplored ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Conhecido (+{opt.xpReward} XP)</span>
                            </>
                          ) : (
                            <span>+{opt.xpReward} XP</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 ml-2 ${
                    opt.highlight
                      ? 'text-amber-300 group-hover:translate-x-0.5'
                      : 'text-amber-400/70 group-hover:text-amber-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      ) : (
        /* 5. AÇÕES PRINCIPAIS DE RPG: DESAFIAR (+300 XP) & ABRIR BAÚ (+50 XP) */
        <div className="acoes-principais-rpg grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              audioEngine.playSfx('travel');
              onStartQuiz();
            }}
            className="btn-desafio-honra group relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-serif font-bold text-left shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:scale-[1.01] border-2 border-yellow-300 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                Desafio de Honra
              </div>
              <span className="text-xs bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full font-mono font-black shadow border border-amber-400/30">
                +300 XP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-950/95 font-medium leading-snug">
              Responda ao Quiz do Guardião e conquiste a Insígnia Sagrada!
            </p>
          </button>

          <button
            onClick={() => {
              audioEngine.playSfx('click');
              onOpenChest();
            }}
            className="btn-abrir-bau-reliquias group relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 hover:bg-amber-950/40 border-2 border-amber-500/50 hover:border-amber-400 text-white font-serif text-left shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                Baú de Relíquias
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {chestEarnedXp !== undefined && chestTotalXp !== undefined
                  ? `XP ${chestEarnedXp}/${chestTotalXp}`
                  : '+50 XP / Doc'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
              Examine os pergaminhos históricos, tradições e patrimônios IPHAN.
            </p>
          </button>
        </div>
      )}
    </div>
  );
};
