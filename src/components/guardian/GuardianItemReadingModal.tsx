import React, { useState, useRef, useEffect } from 'react';
import { CulturalItem } from '../../data/culturalInventoryData';
import { ItemVectorIcon } from './GuardianCommon';
import { audioEngine } from '../../lib/audioSynth';
import { triggerConfetti } from '../../lib/storage';
import {
  X,
  Sparkles,
  BookOpen,
  Scroll,
  Award,
  CheckCircle2,
  Quote,
  Feather,
  Compass,
  BookmarkCheck,
  ExternalLink,
  Library,
  Landmark,
  FileText,
  Calendar,
  CheckCircle,
  HelpCircle,
  ZoomIn,
} from 'lucide-react';

interface Props {
  item: CulturalItem;
  guardianName: string;
  isAlreadyRead: boolean;
  onClose: () => void;
  onCompleteReading: (itemId: string, xpEarned: number) => void;
  onSpeak?: (text: string) => void;
}

export const GuardianItemReadingModal: React.FC<Props> = ({
  item,
  guardianName,
  isAlreadyRead,
  onClose,
  onCompleteReading,
  onSpeak,
}) => {
  const [hasCompleted, setHasCompleted] = useState<boolean>(isAlreadyRead);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'leitura' | 'acervo' | 'referencias'>('leitura');
  const [isZoomImageOpen, setIsZoomImageOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const XP_REWARD = 50;

  // Track reading scroll progress
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const totalScrollable = scrollHeight - clientHeight;
    if (totalScrollable <= 0) {
      setScrollProgress(100);
      return;
    }
    const currentPercent = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));
    setScrollProgress(currentPercent);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const handleFinishReading = () => {
    if (hasCompleted) {
      onClose();
      return;
    }

    audioEngine.playSfx('badge');
    triggerConfetti();
    setHasCompleted(true);

    onCompleteReading(item.id, XP_REWARD);

    if (onSpeak) {
      onSpeak(`“Excelente estudo! Absorveste a sabedoria histórica e fontes de ${item.title}. +${XP_REWARD} XP concedidos!”`);
    }
  };

  // Border & glow color based on rarity
  const rarityColors = {
    sagrado: 'border-amber-400 text-amber-300 bg-amber-500/15',
    epico: 'border-purple-400 text-purple-300 bg-purple-500/15',
    raro: 'border-cyan-400 text-cyan-300 bg-cyan-500/15',
    comum: 'border-slate-500 text-slate-300 bg-slate-800/40',
  };

  return (
    <div
      id="modal-leitura-cultural"
      className="modal-leitura-cultural absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200 select-none pointer-events-auto"
    >
      <div
        id="painel-pergaminho-leitura"
        className="painel-pergaminho-leitura relative w-full max-w-5xl bg-slate-950 border-2 border-amber-500/90 rounded-2xl p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.98)] text-slate-100 flex flex-col h-[92vh] max-h-[92vh]"
      >
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-2 -left-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-tr absolute -top-2 -right-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-bl absolute -bottom-2 -left-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />
        <div className="ornamento-canto-br absolute -bottom-2 -right-2 w-4 h-4 bg-amber-400 border-2 border-yellow-200 rotate-45 pointer-events-none shadow" />

        {/* Barra de Progresso de Leitura */}
        <div className="barra-progresso-leitura absolute top-0 left-4 right-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Cabeçalho do Pergaminho */}
        <div className="cabecalho-leitura-item flex items-start justify-between border-b border-amber-500/30 pb-3 mt-1 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shrink-0">
              <ItemVectorIcon itemId={item.id} category={item.category} className="w-7 h-7 sm:w-8 sm:h-8" />
              <div className="absolute -bottom-1 -right-1 text-xs bg-slate-950 p-0.5 rounded-full border border-amber-400">
                {item.icon}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="badge-reliquia-categoria text-[9px] sm:text-[10px] font-serif font-black uppercase text-slate-950 bg-amber-400 px-2 py-0.5 rounded border border-yellow-200 shadow-sm">
                  {item.categoryLabel}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-serif font-bold uppercase px-2 py-0.5 rounded border ${
                    rarityColors[item.rarity] || rarityColors.comum
                  }`}
                >
                  Raridade: {item.rarity}
                </span>
                {item.archive?.period && (
                  <span className="badge-periodo-historico flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    <Calendar className="w-2.5 h-2.5 text-amber-400" />
                    {item.archive.period}
                  </span>
                )}
                <span className="text-[10px] font-mono text-amber-300 font-bold">
                  • {item.stateId}
                </span>
              </div>

              <h2 className="titulo-pergaminho-reliquia font-serif font-black text-base sm:text-xl md:text-2xl text-amber-200 tracking-wide leading-tight">
                {item.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-fechar-leitura bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-2 rounded-xl border border-amber-500/50 transition cursor-pointer shadow shrink-0"
              title="Fechar Leitura da Relíquia"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Abas de Navegação no Códice Histórico */}
        <div className="menu-abas-codice flex items-center gap-2 pt-2 border-b border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveTab('leitura')}
            className={`aba-item px-3 py-1.5 text-xs font-serif font-bold rounded-t-lg transition flex items-center gap-1.5 border-t border-x cursor-pointer ${
              activeTab === 'leitura'
                ? 'bg-slate-900 text-amber-300 border-amber-500/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Estudo & História</span>
          </button>

          <button
            onClick={() => setActiveTab('acervo')}
            className={`aba-item px-3 py-1.5 text-xs font-serif font-bold rounded-t-lg transition flex items-center gap-1.5 border-t border-x cursor-pointer ${
              activeTab === 'acervo'
                ? 'bg-slate-900 text-amber-300 border-amber-500/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Acervo & Registro Histórico</span>
          </button>

          <button
            onClick={() => setActiveTab('referencias')}
            className={`aba-item px-3 py-1.5 text-xs font-serif font-bold rounded-t-lg transition flex items-center gap-1.5 border-t border-x cursor-pointer ${
              activeTab === 'referencias'
                ? 'bg-slate-900 text-amber-300 border-amber-500/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Referências & Fontes Oficiais ({item.references.length})</span>
          </button>
        </div>

        {/* Corpo Principal: Layout em 2 Colunas para Maior Conforto de Leitura */}
        <div className="corpo-leitura-container flex-1 min-h-0 pt-3 pb-1 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* COLUNA ESQUERDA: ACERVO VISUAL E FICHA TÉCNICA (md:col-span-4 lg:col-span-4) */}
          <div className="coluna-acervo-lateral hidden md:flex md:col-span-4 flex-col gap-3 overflow-y-auto custom-scrollbar-gold pr-1">
            {/* Foto de Acervo com Moldura de Museu */}
            {item.archive?.imageUrl && (
              <div className="card-acervo-museologico bg-slate-900/90 border border-amber-500/40 rounded-xl p-2.5 shadow-md space-y-2">
                <div
                  className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-video cursor-pointer"
                  onClick={() => setIsZoomImageOpen(true)}
                  title="Clique para ampliar a imagem do acervo"
                >
                  <img
                    src={item.archive.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-amber-300 text-xs font-serif font-bold">
                    <ZoomIn className="w-4 h-4" />
                    <span>Ampliar Imagem</span>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-slate-950/80 backdrop-blur-sm text-[8px] font-mono text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                    Acervo Oficial
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-300 font-serif italic leading-tight">
                    {item.archive.imageCaption}
                  </p>
                  <div className="text-[9px] text-amber-400/80 font-mono">
                    Fonte: {item.archive.archiveName}
                  </div>
                </div>
              </div>
            )}

            {/* Ficha Técnica Museológica */}
            <div className="ficha-tecnica-museu bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-2 text-xs font-serif">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Registro do Patrimônio</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Classificação:</span>
                  <span className="text-amber-200 font-bold">{item.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Origem Regional:</span>
                  <span className="text-slate-200">{item.stateId} • Sul do Brasil</span>
                </div>
                {item.archive?.curatorNotes && (
                  <div className="pt-1 text-[10px] text-slate-300 italic border-t border-slate-800/80">
                    “{item.archive.curatorNotes}”
                  </div>
                )}
              </div>
            </div>

            {/* Citação Direta do Guardião */}
            {item.guardianQuote && (
              <div className="citacao-guardiao-leitura bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2.5 shadow-inner">
                <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-serif italic text-amber-100/90 leading-snug">
                    {item.guardianQuote}
                  </p>
                  <span className="text-[9px] text-amber-400 font-mono block mt-1">
                    — {guardianName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: CONTEÚDO PEDAGÓGICO E NARRATIVA (md:col-span-8 lg:col-span-8) */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="coluna-texto-conteudo col-span-1 md:col-span-8 overflow-y-auto custom-scrollbar-gold pr-2 space-y-4 font-serif text-slate-200 leading-relaxed select-text"
          >
            {activeTab === 'leitura' && (
              <>
                {/* Introdução / Resumo */}
                <div className="secao-resumo-item bg-slate-900/90 border-l-4 border-amber-400 p-3.5 rounded-r-xl shadow-inner">
                  <p className="text-xs sm:text-sm font-serif italic text-amber-100 leading-snug">
                    “{item.shortDesc}”
                  </p>
                </div>

                {/* 1. Visão Geral e Rito */}
                <div className="secao-lore-pergaminho space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Scroll className="w-4 h-4 text-amber-400" />
                    <span>Visão Geral & Descrição do Bem Cultural</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 text-justify leading-relaxed">
                    {item.fullDesc}
                  </p>
                </div>

                {/* 2. Contexto Histórico Profundo */}
                {item.historicalContext && (
                  <div className="secao-contexto-historico bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Contexto Histórico & Origens Ancestrais</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 text-justify leading-relaxed">
                      {item.historicalContext}
                    </p>
                  </div>
                )}

                {/* 3. Simbologia e Impacto Cultural */}
                {item.culturalImpact && (
                  <div className="secao-impacto-cultural space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <Landmark className="w-4 h-4 text-amber-400" />
                      <span>Simbologia, Legislação & Impacto Social</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 text-justify leading-relaxed">
                      {item.culturalImpact}
                    </p>
                  </div>
                )}

                {/* 4. Aprendizados-Chave / Pontos de Sabedoria */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div className="secao-aprendizados-chave bg-emerald-950/20 border border-emerald-500/40 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Pontos de Sabedoria Essenciais</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {item.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 5. Curiosidade Popular */}
                {item.curiosity && (
                  <div className="caixa-sabedoria-popular bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300">
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                      <span>Curiosidade & Sabedoria Popular</span>
                    </div>
                    <p className="text-xs text-amber-100/90 italic leading-normal">
                      {item.curiosity}
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'acervo' && (
              <div className="secao-aba-acervo space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>Salvaguarda & Acervo Documental</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Este registro faz parte do <strong>Códice Cívico dos Guardiões do Brasil</strong>, elaborado para preservar a história, patrimônio material e imaterial das 27 unidades federativas.
                  </p>

                  {item.archive?.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-amber-500/30">
                      <img
                        src={item.archive.imageUrl}
                        alt={item.title}
                        className="w-full max-h-72 object-cover"
                      />
                      <div className="p-2.5 bg-slate-950 text-xs text-slate-300 space-y-1">
                        <p className="font-serif italic">{item.archive.imageCaption}</p>
                        <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
                          <span>{item.archive.archiveName}</span>
                          <span>{item.archive.period}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-xs">
                    <div className="font-bold text-amber-200">Notas de Preservação do Curador:</div>
                    <div className="text-slate-300 italic">{item.archive?.curatorNotes || 'Patrimônio Cultural protegido e registrado.'}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referencias' && (
              <div className="secao-aba-referencias space-y-3">
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Library className="w-4 h-4 text-amber-400" />
                    <span>Fontes Oficiais, Acadêmicas e Legislação</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Consulte as fontes primárias e instituições públicas de salvaguarda que fundamentam este verbete cultural:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {item.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-referencia-link group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/80 p-3 rounded-xl transition flex items-start justify-between gap-3 shadow-md"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200 group-hover:text-amber-300">
                          <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{ref.title}</span>
                        </div>
                        <div className="text-[10px] text-amber-400/80 font-mono">
                          {ref.institution}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {ref.description}
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-amber-400 text-slate-400 group-hover:text-amber-300 shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Origem e Autenticidade */}
            <div className="secao-fonte-autenticidade pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Feather className="w-3 h-3 text-amber-400" />
                <span>Acervo Cívico dos Guardiões da Cultura</span>
              </div>
              <span className="text-amber-400/80">Registro: {item.id}</span>
            </div>
          </div>
        </div>

        {/* Modal de Zoom da Imagem */}
        {isZoomImageOpen && item.archive?.imageUrl && (
          <div
            className="fixed inset-0 z-60 bg-slate-950/95 flex items-center justify-center p-4 cursor-pointer backdrop-blur-md"
            onClick={() => setIsZoomImageOpen(false)}
          >
            <div className="relative max-w-4xl max-h-[85vh] bg-slate-900 border-2 border-amber-400 rounded-2xl overflow-hidden p-2 shadow-2xl">
              <button
                onClick={() => setIsZoomImageOpen(false)}
                className="absolute top-4 right-4 bg-slate-950 text-amber-300 hover:text-white p-2 rounded-full border border-amber-400 z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={item.archive.imageUrl}
                alt={item.title}
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
              <div className="p-3 text-center text-xs font-serif text-amber-200">
                {item.archive.imageCaption} — <span className="font-mono text-slate-400">{item.archive.archiveName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé com Botão de Concluir Leitura & Recompensa */}
        <div className="rodape-leitura-acoes pt-3 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {hasCompleted ? (
              <div className="badge-conclusao-ativa flex items-center gap-1.5 text-emerald-400 text-xs font-serif font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sabedoria Registrada no Códice (+{XP_REWARD} XP Concedidos)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-serif bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/40">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Leia com atenção e absorva o conhecimento para ganhar <strong>+{XP_REWARD} XP</strong></span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleFinishReading}
              className={`btn-concluir-leitura w-full sm:w-auto px-5 py-2.5 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-lg ${
                hasCompleted
                  ? 'bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/50'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border border-yellow-200 scale-100 hover:scale-[1.02]'
              }`}
            >
              {hasCompleted ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  <span>Concluir Leitura & Retornar ao Baú</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Concluir Leitura & Absorver Sabedoria (+{XP_REWARD} XP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
