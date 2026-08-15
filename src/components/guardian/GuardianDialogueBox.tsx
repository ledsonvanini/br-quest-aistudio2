import React from 'react';
import { GuardianData } from '../../types';
import { CompassBadgeIcon } from './GuardianCommon';
import {
  MessageSquare,
  ChevronRight,
  RotateCcw,
  Swords,
  Coffee,
  Leaf,
  Package,
  Award,
  Sword,
  Feather,
  Shield,
  Flame,
  Users,
  Trees,
  Crown,
  X,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export type DialogueNode =
  | 'root'
  | 'farrapos'
  | 'farrapos_anita'
  | 'farrapos_lenco'
  | 'farrapos_sepe'
  | 'costumes'
  | 'costumes_chimarrao'
  | 'costumes_churrasco'
  | 'costumes_pilcha'
  | 'natureza'
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
  // Generate compact, concise options for current state
  const options: DialogueOption[] = React.useMemo(() => {
    switch (dialogueNode) {
      case 'root':
        return [
          {
            id: 'opt_farrapos',
            label: '⚔️ Fatos Históricos & Revolução Farroupilha',
            desc: 'Conheça os 10 anos de lutas, heróis e causas republicanas',
            icon: Swords,
            action: () => {
              setDialogueNode('farrapos');
              onSpeak(
                '“A Revolução Farroupilha (1835–1845) forjou a bravura e a identidade do Rio Grande do Sul. Escolha qual fato ou herói deseja conhecer:”'
              );
            },
          },
          {
            id: 'opt_costumes',
            label: '🧉 Tradições Campeiras, Pilcha & Chimarrão',
            desc: 'Descubra os ritos de hospitalidade, indumentária e culinária',
            icon: Coffee,
            action: () => {
              setDialogueNode('costumes');
              onSpeak(
                '“O chimarrão e as lidas campeiras unem nosso povo há séculos. Qual tradição tu queres desvendar agora?”'
              );
            },
          },
          {
            id: 'opt_natureza',
            label: '🦅 Fauna, Flora & Paisagens dos Pampas',
            desc: 'O Quero-Quero sentinela, o Cavalo Crioulo e as Araucárias',
            icon: Leaf,
            action: () => {
              setDialogueNode('natureza');
              onSpeak(
                '“Das coxilhas verdes do Pampa às serras de pinheirais, nossa terra guarda guardiões naturais. Sobre quem deseja saber?”'
              );
            },
          },
          {
            id: 'opt_bau',
            label: '📦 Abrir o Baú de Relíquias',
            desc: 'Estude os verbetes culturais e ganhe +50 XP por leitura',
            icon: Package,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_quiz',
            label: '🏆 Realizar o Desafio de Honra (Quiz)',
            desc: 'Teste seus conhecimentos e conquiste a Insígnia Sagrada (+300 XP)',
            icon: Award,
            highlight: true,
            action: onStartQuiz,
          },
        ];

      case 'farrapos':
        return [
          {
            id: 'opt_anita',
            label: '⚔️ Quem foi Anita Garibaldi, a Heroína dos Dois Mundos?',
            desc: 'A guerreira catarinense-gaúcha que lutou no Brasil e na Itália',
            icon: Sword,
            action: () => {
              setDialogueNode('farrapos_anita');
              onSpeak(
                '“Anita Garibaldi pegou em armas nas batalhas farroupilhas e mais tarde pela unificação italiana. É símbolo eterno de coragem e liberdade!”'
              );
            },
          },
          {
            id: 'opt_lenco',
            label: '🧣 O que simboliza o Lenço Farroupilha?',
            desc: 'O lenço vermelho dos maragatos e o lenço branco dos chimangos',
            icon: Feather,
            action: () => {
              setDialogueNode('farrapos_lenco');
              onSpeak(
                '“O lenço atado ao pescoço identificava as correntes políticas e honrava o brio dos guerreiros dos pampas na revolução!”'
              );
            },
          },
          {
            id: 'opt_sepe',
            label: '🛡️ Qual foi a luta de Sepé Tiaraju nas Missões?',
            desc: 'O líder guarani que bradou: “Esta terra tem dono!”',
            icon: Shield,
            action: () => {
              setDialogueNode('farrapos_sepe');
              onSpeak(
                '“Sepé Tiaraju defendeu as terras dos Sete Povos das Missões contra as coroas de Espanha e Portugal. É herói oficial da Pátria brasileira!”'
              );
            },
          },
          {
            id: 'opt_open_chest_history',
            label: '📖 Ver Relíquias Históricas no Baú',
            desc: 'Consulte os documentos oficiais com fontes do IPHAN',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_back',
            label: '← Voltar ao Menu Principal',
            desc: 'Retornar aos assuntos gerais',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              onSpeak('“Qual outro tema da nossa história tu queres explorar?”');
            },
          },
        ];

      case 'farrapos_anita':
      case 'farrapos_lenco':
      case 'farrapos_sepe':
        return [
          {
            id: 'opt_study_item',
            label: '📖 Abrir Baú e Estudar este Verbete (+50 XP)',
            desc: 'Ver documentos, acervo fotográfico e referências históricas',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_take_quiz',
            label: '🏆 Testar Conhecimentos no Desafio de Honra',
            desc: 'Responda ao Quiz do estado e ganhe a Insígnia Sagrada',
            icon: Award,
            action: onStartQuiz,
          },
          {
            id: 'opt_back_farrapos',
            label: '⚔️ Perguntar sobre outro Herói Farroupilha',
            desc: 'Ver outros líderes e fatos da Revolução',
            icon: Swords,
            action: () => {
              setDialogueNode('farrapos');
              onSpeak('“Qual outro herói ou detalhe da Revolução Farroupilha queres saber?”');
            },
          },
          {
            id: 'opt_back_root',
            label: '← Voltar ao Menu de Tópicos',
            desc: 'Retornar ao início do diálogo',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              onSpeak('“Sobre qual outro aspecto do estado desejas conversar?”');
            },
          },
        ];

      case 'costumes':
        return [
          {
            id: 'opt_chimarrao',
            label: '🧉 Como nasceu o Ritual do Chimarrão?',
            desc: 'A cuia, a bomba de prata, a erva-mate e as regras da roda',
            icon: Coffee,
            action: () => {
              setDialogueNode('costumes_chimarrao');
              onSpeak(
                '“O chimarrão é uma herança direta dos povos indígenas guaranis e kaingangs. Em roda, a cuia passa de mão em mão como símbolo sagrado de hospitalidade e respeito!”'
              );
            },
          },
          {
            id: 'opt_churrasco',
            label: '🥩 Qual a tradição do Churrasco de Fogo de Chão?',
            desc: 'A técnica dos tropeiros e vaqueiros assando carne na lenha',
            icon: Flame,
            action: () => {
              setDialogueNode('costumes_churrasco');
              onSpeak(
                '“Nas longas travessias do gado, os tropeiros fincavam espetos de madeira no chão de terra e assavam a carne no calor das brasas de lenha nobre.”'
              );
            },
          },
          {
            id: 'opt_pilcha',
            label: '👖 O que compõe a Pilcha Tradicional?',
            desc: 'Bombacha, guaiaca, bota de couro, chapéu e poncho',
            icon: Users,
            action: () => {
              setDialogueNode('costumes_pilcha');
              onSpeak(
                '“A pilcha é indumentária de honra oficializada por lei estadual. Cada peça foi desenhada para a proteção e dignidade nas lidas do campo!”'
              );
            },
          },
          {
            id: 'opt_open_chest_costumes',
            label: '📖 Ver Relíquias de Tradições no Baú',
            desc: 'Acesse o acervo de fotos e patrimônio imaterial',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_back',
            label: '← Voltar ao Menu Principal',
            desc: 'Retornar aos assuntos gerais',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              onSpeak('“Que outra tradição atrai teu coração?”');
            },
          },
        ];

      case 'costumes_chimarrao':
      case 'costumes_churrasco':
      case 'costumes_pilcha':
        return [
          {
            id: 'opt_study_item',
            label: '📖 Abrir Baú e Estudar este Verbete (+50 XP)',
            desc: 'Ver documentos, acervo fotográfico e referências históricas',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_take_quiz',
            label: '🏆 Testar Conhecimentos no Desafio de Honra',
            desc: 'Responda ao Quiz do estado e ganhe a Insígnia Sagrada',
            icon: Award,
            action: onStartQuiz,
          },
          {
            id: 'opt_back_costumes',
            label: '🧉 Perguntar sobre outra Tradição Gaúcha',
            desc: 'Ver outros costumes, pratos e indumentárias',
            icon: Coffee,
            action: () => {
              setDialogueNode('costumes');
              onSpeak('“Que outro costume tu queres compreender?”');
            },
          },
          {
            id: 'opt_back_root',
            label: '← Voltar ao Menu de Tópicos',
            desc: 'Retornar ao início do diálogo',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              onSpeak('“Pronto para novos temas culturais!”');
            },
          },
        ];

      case 'natureza':
        return [
          {
            id: 'opt_quero',
            label: '🦅 Por que o Quero-Quero é a Ave Símbolo?',
            desc: 'A sentinela vigilante que avisa qualquer aproximação nos campos',
            icon: Feather,
            action: () => {
              setDialogueNode('natureza_quero');
              onSpeak(
                '“O quero-quero é a ave sentinela oficial do RS. Com seus esporões nas asas e grito estridente, ele guarda a querência e protege seus ninhos no solo!”'
              );
            },
          },
          {
            id: 'opt_cavalo',
            label: '🐎 O que torna o Cavalo Crioulo tão especial?',
            desc: 'Resistência extrema herdada dos cavalos ibéricos nos pampas',
            icon: Crown,
            action: () => {
              setDialogueNode('natureza_cavalo');
              onSpeak(
                '“O cavalo crioulo sobreviveu a invernos rigorosos e estiagens no sul. É o animal símbolo do estado e companheiro leal do homem do campo!”'
              );
            },
          },
          {
            id: 'opt_araucaria',
            label: '🌲 O que representa a Araucária e o Pinhão?',
            desc: 'O pinheiro imponente das serras e seu fruto nutritivo',
            icon: Trees,
            action: () => {
              setDialogueNode('natureza_araucaria');
              onSpeak(
                '“A araucária domina o planalto serrano. Seu pinhão alimentou os povos indígenas e até hoje aquece os invernos na brasa!”'
              );
            },
          },
          {
            id: 'opt_open_chest_nature',
            label: '📖 Ver Relíquias da Natureza no Baú',
            desc: 'Consulte registros botânicos e zoológicos',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_back',
            label: '← Voltar ao Menu Principal',
            desc: 'Retornar aos assuntos gerais',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              onSpeak('“Diga, nobre viajante, o que mais te fascina na nossa terra?”');
            },
          },
        ];

      case 'natureza_quero':
      case 'natureza_cavalo':
      case 'natureza_araucaria':
        return [
          {
            id: 'opt_study_item',
            label: '📖 Abrir Baú e Estudar este Verbete (+50 XP)',
            desc: 'Ver documentos, acervo fotográfico e referências históricas',
            icon: BookOpen,
            highlight: true,
            action: onOpenChest,
          },
          {
            id: 'opt_take_quiz',
            label: '🏆 Testar Conhecimentos no Desafio de Honra',
            desc: 'Responda ao Quiz do estado e ganhe a Insígnia Sagrada',
            icon: Award,
            action: onStartQuiz,
          },
          {
            id: 'opt_back_natureza',
            label: '🦅 Perguntar sobre outro Símbolo da Natureza',
            desc: 'Ver outros seres e paisagens dos pampas e serras',
            icon: Leaf,
            action: () => {
              setDialogueNode('natureza');
              onSpeak('“Que outro ser ou paisagem tu queres conhecer?”');
            },
          },
          {
            id: 'opt_back_root',
            label: '← Voltar ao Menu de Tópicos',
            desc: 'Retornar ao início do diálogo',
            icon: RotateCcw,
            action: () => {
              setDialogueNode('root');
              onSpeak('“Pronto para desvendar novas memórias!”');
            },
          },
        ];

      default:
        return [
          {
            id: 'opt_back_root',
            label: '← Voltar ao Menu de Tópicos',
            icon: RotateCcw,
            action: () => setDialogueNode('root'),
          },
        ];
    }
  }, [dialogueNode, onOpenChest, onStartQuiz, onSpeak, setDialogueNode]);

  return (
    <div
      id="menu-interacao-dialogo-central"
      className="menu-interacao-dialogo-central w-full max-w-lg mx-auto bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-3 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 select-none z-30 relative"
    >
      {/* Cantos Ornamentais RPG */}
      <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
      <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
      <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
      <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />

      {/* Header with Guardian Info & Close Button */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <CompassBadgeIcon icon={MessageSquare} size="sm" active />
          <div>
            <span className="text-xs font-serif font-bold text-amber-300">
              {guardian.guardianName}
            </span>
            <span className="text-[10px] text-slate-400 font-serif ml-1.5">
              • {guardian.guardianTitlePt}
            </span>
          </div>
        </div>

        {onCloseDialogue && (
          <button
            onClick={onCloseDialogue}
            className="btn-fechar-painel text-slate-400 hover:text-amber-300 p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-amber-500/40"
            title="Recolher Caixa de Diálogo (Guardião e Baú se aproximam)"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Speech Balloon with Typewriter Animation */}
      <div className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-xl min-h-[56px] flex items-center shadow-inner relative">
        <p className="texto-fala-guardiao font-serif text-xs sm:text-sm text-amber-100 italic leading-relaxed">
          {displayedSpeech}
          {isTyping && (
            <span className="inline-block w-1.5 h-3 bg-amber-400 ml-1 animate-pulse" />
          )}
        </p>
      </div>

      {/* State Machine Options - Compact, Direct, Highly Informative */}
      <div className="opcoes-dialogo-condicionais grid grid-cols-1 gap-1.5 max-h-[36vh] overflow-y-auto custom-scrollbar-gold pr-1">
        {options.map((opt) => {
          const OptIcon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={opt.action}
              className={`btn-escolha-dialogo group w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:translate-x-1 shadow-sm ${
                opt.highlight
                  ? 'bg-gradient-to-r from-amber-950/70 to-slate-900 border-amber-500/70 hover:border-amber-400 hover:from-amber-900/80'
                  : 'bg-slate-900/90 hover:bg-amber-500/15 border-slate-800 hover:border-amber-400/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    opt.highlight
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-amber-500/20 border border-amber-400/40 group-hover:bg-amber-500 group-hover:text-slate-950'
                  }`}
                >
                  <OptIcon
                    className={`w-3.5 h-3.5 ${
                      opt.highlight
                        ? 'text-slate-950'
                        : 'text-amber-300 group-hover:text-slate-950'
                    }`}
                  />
                </div>
                <div className="truncate">
                  <div
                    className={`text-xs font-serif font-bold ${
                      opt.highlight
                        ? 'text-amber-300 group-hover:text-yellow-200'
                        : 'text-slate-200 group-hover:text-amber-200'
                    }`}
                  >
                    {opt.label}
                  </div>
                  {opt.desc && (
                    <div className="text-[10px] text-slate-400 font-serif truncate">
                      {opt.desc}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 ml-2 ${
                  opt.highlight
                    ? 'text-amber-300 group-hover:translate-x-0.5'
                    : 'text-amber-400/70 group-hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

