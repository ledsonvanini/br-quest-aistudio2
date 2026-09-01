import React, { useState, useMemo } from 'react';
import { GuardianData } from '../../types';
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
} from 'lucide-react';

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

  // Opções interativas dinâmicas de acordo com o nó atual de diálogo para TODOS os estados
  const contextualOptions: DialogueOption[] = useMemo(() => {
    switch (dialogueNode) {
      case 'historia':
        return [
          {
            id: 'opt_hist_doc',
            label: `📜 O que revela o manuscrito "${guardian.literaryPergament?.title || 'Memória Cívica'}"?`,
            desc: `Obra de ${guardian.literaryPergament?.author || 'autores célebres'} preservada no acervo`,
            icon: BookOpen,
            action: () => {
              setDialogueNode('historia_doc');
              onSpeak(
                `“${guardian.literaryPergament?.excerpt || guardian.loreStoryPt} — ${guardian.literaryPergament?.contextPt || ''}”`
              );
            },
          },
          {
            id: 'opt_hist_heroes',
            label: `⚔️ Quem foram os grandes heróis e ícones de ${guardian.stateNamePt}?`,
            desc: `Legado de ${guardian.famousIcons?.slice(0, 2).join(' e ') || 'líderes históricos'}`,
            icon: Sword,
            action: () => {
              setDialogueNode('historia_heroes');
              onSpeak(
                `“Em nosso solo floresceu o talento e a coragem de ${guardian.famousIcons?.join(', ')}. ${guardian.loreStoryPt}”`
              );
            },
          },
          {
            id: 'opt_hist_garb',
            label: `🛡️ Qual é o significado dos trajes e símbolos do Guardião?`,
            desc: guardian.garbDescriptionPt,
            icon: Shield,
            action: () => {
              setDialogueNode('historia_garb');
              onSpeak(`“${guardian.garbDescriptionPt} Cada adorno representa um elo sagrado com nossa história!”`);
            },
          },
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
            label: `📖 Abrir Baú de Relíquias de ${guardian.stateNamePt} (+50 XP)`,
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
          {
            id: 'opt_cult_prato',
            label: `🍲 Qual o segredo da culinária típica (${guardian.typicalDishPt})?`,
            desc: 'Ingredientes, técnicas ancestrais e sabor tradicional',
            icon: Utensils,
            action: () => {
              setDialogueNode('cultura_prato');
              onSpeak(
                `“Nossa mesa é consagrada por ${guardian.typicalDishPt}! Uma fusão inigualável de saberes dos povos originários e colonizadores!”`
              );
            },
          },
          {
            id: 'opt_cult_festa',
            label: `🎭 Como se celebra "${guardian.musicAndCulturePt}"?`,
            desc: 'Ritmos, vestimentas, autos populares e patrimônio imaterial',
            icon: Sparkles,
            action: () => {
              setDialogueNode('cultura_festa');
              onSpeak(
                `“A celebração de ${guardian.musicAndCulturePt} é onde a alma de ${guardian.stateNamePt} pulsa com mais vigor e alegria!”`
              );
            },
          },
          {
            id: 'opt_cult_hino',
            label: `🎵 O que cantam os versos do Hino Estadual?`,
            desc: guardian.anthemTitle,
            icon: Feather,
            action: () => {
              setDialogueNode('cultura_hino');
              onSpeak(`“‘${guardian.anthemLyricsPt}’ — Cantamos com o peito aberto em reverência à nossa terra!”`);
            },
          },
          {
            id: 'opt_back_cult_root',
            label: '← Voltar às Boas-Vindas',
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
            label: `📖 Abrir Baú e Estudar Acervo Cultural (+50 XP)`,
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
          {
            id: 'opt_nat_fauna',
            label: `🐾 Quais as espécies emblemáticas da fauna (${guardian.faunaPt})?`,
            desc: 'Mamíferos, aves nobres e animais guardiões dos biomas',
            icon: Leaf,
            action: () => {
              setDialogueNode('natureza_fauna');
              onSpeak(
                `“Em nossas matas e rios vivem ${guardian.faunaPt}. São seres sagrados protegidos pela sabedoria dos guardiões!”`
              );
            },
          },
          {
            id: 'opt_nat_flora',
            label: `🌿 Quais os tesouros da flora nativa (${guardian.floraPt})?`,
            desc: 'Árvores monumentais, flores raras e plantas medicinais',
            icon: Leaf,
            action: () => {
              setDialogueNode('natureza_flora');
              onSpeak(
                `“Nossa flora é abençoada por ${guardian.floraPt}, moldando paisagens que encantam o mundo!”`
              );
            },
          },
          {
            id: 'opt_nat_bioma',
            label: `🏞️ Como é a geografia e o bioma de ${guardian.stateNamePt}?`,
            desc: speech.welcomeDetails.natureTitle,
            icon: Compass,
            action: () => {
              setDialogueNode('natureza_bioma');
              onSpeak(`“${speech.welcomeDetails.natureText}”`);
            },
          },
          {
            id: 'opt_back_nat_root',
            label: '← Voltar às Boas-Vindas',
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
        return [
          {
            id: 'opt_study_item_n',
            label: `📖 Abrir Baú e Estudar a Biodiversidade (+50 XP)`,
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
  }, [dialogueNode, guardian, onOpenChest, onSpeak, setDialogueNode, speech]);

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

      {/* 1. CABEÇALHO DO DIÁLOGO: Brasão, Estado, Capital, Horário e Guardião */}
      <div className="cabecalho-dialogo-guardiao flex items-center justify-between gap-3 pb-3 border-b border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-3">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
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
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50">
                {guardian.id}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1 font-serif">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Região {guardian.regionId.toUpperCase()} • Capital {guardian.capitalPt}
              </span>
              <span className="text-xs text-amber-300/90 flex items-center gap-1 font-mono ml-auto">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {localTimeString} (Hora Local)
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h2 className="font-serif font-black text-lg sm:text-2xl text-amber-200 truncate">
                {guardian.stateNamePt}
              </h2>
              <span className="text-slate-500 text-xs hidden sm:inline">•</span>
              <p className="font-serif text-xs sm:text-sm text-amber-400/90 font-semibold truncate flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                {guardian.guardianTitlePt}
              </p>
            </div>
          </div>
        </div>

        {onCloseDialogue && (
          <button
            onClick={onCloseDialogue}
            className="btn-fechar-painel text-slate-400 hover:text-amber-300 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 transition cursor-pointer shrink-0 ml-2"
            title="Recolher Caixa de Diálogo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
                +50 XP / Doc
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
