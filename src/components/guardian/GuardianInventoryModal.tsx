import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CulturalItem } from '../../data/culturalInventoryData';
import { ItemVectorIcon } from './GuardianCommon';
import { audioEngine } from '../../lib/audioSynth';
import { triggerConfetti } from '../../lib/storage';
import {
  Package,
  X,
  Sparkles,
  Award,
  CheckCircle2,
  Quote,
  Feather,
  BookmarkCheck,
  ExternalLink,
  Library,
  Landmark,
  FileText,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  BookOpen,
  Users,
  Utensils,
  Leaf,
  Layers,
  Search,
} from 'lucide-react';
import {
  getItemXpReward,
  getItemClassificationLabel,
  getStateChestXpSummary,
} from '../../data/explorationXpRegistry';

interface Props {
  stateId: string;
  items: CulturalItem[];
  guardianName: string;
  readItemIds?: string[];
  onClose: () => void;
  onInspectItem: (item: CulturalItem) => void;
  onCompleteReading?: (itemId: string, xpEarned: number) => void;
  onSpeak?: (text: string) => void;
}

export const GuardianInventoryModal: React.FC<Props> = ({
  stateId,
  items,
  guardianName,
  readItemIds = [],
  onClose,
  onInspectItem,
  onCompleteReading,
  onSpeak,
}) => {
  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Currently inspected/active item for the reading area
  const [selectedItemId, setSelectedItemId] = useState<string>(
    items.length > 0 ? items[0].id : ''
  );

  // Modal for zoomed historical archive image
  const [isZoomImageOpen, setIsZoomImageOpen] = useState<boolean>(false);

  // Active reading tab (História & Lore / Acervo Museológico / Fontes Oficiais)
  const [activeReadingTab, setActiveReadingTab] = useState<'historia' | 'acervo' | 'fontes'>('historia');

  // Internal scroll tracker for reading pane
  const readingPaneRef = useRef<HTMLDivElement | null>(null);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  // Categories list for quick filtering
  const categories = [
    { id: 'todos', label: 'Todas as Relíquias', icon: Layers },
    { id: 'culinaria', label: 'Culinária & Ritos', icon: Utensils },
    { id: 'historia', label: 'História & Guerras', icon: BookOpen },
    { id: 'tradicoes', label: 'Tradições & Indumentária', icon: Users },
    { id: 'personagens', label: 'Heróis & Líderes', icon: Award },
    { id: 'geografia', label: 'Patrimônio Mundial', icon: Landmark },
    { id: 'fauna_flora', label: 'Fauna & Flora', icon: Leaf },
  ];

  // Filter items based on active category & search
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const matchCat = selectedCategory === 'todos' || it.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Current active cultural item
  const activeItem = useMemo(() => {
    const found = items.find((it) => it.id === selectedItemId);
    return found || filteredItems[0] || items[0];
  }, [items, filteredItems, selectedItemId]);

  // Ensure activeItem is valid when filter changes
  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.some((it) => it.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0].id);
    }
  }, [filteredItems, selectedItemId]);

  // Handle scroll progress within the reading container
  const handleReadingScroll = () => {
    if (!readingPaneRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = readingPaneRef.current;
    const totalScrollable = scrollHeight - clientHeight;
    if (totalScrollable <= 0) {
      setReadingProgress(100);
      return;
    }
    const currentPercent = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));
    setReadingProgress(currentPercent);
  };

  useEffect(() => {
    handleReadingScroll();
    if (readingPaneRef.current) {
      readingPaneRef.current.scrollTop = 0;
    }
  }, [activeItem?.id, activeReadingTab]);

  // Stats calculation using centralized XP registry
  const chestSummary = useMemo(() => {
    return getStateChestXpSummary(items, readItemIds);
  }, [items, readItemIds]);

  const readCount = chestSummary.readCount;
  const progressPercent = chestSummary.percentage;
  const totalAvailableXp = chestSummary.totalXp;
  const earnedXp = chestSummary.earnedXp;

  const currentItemXp = activeItem ? getItemXpReward(activeItem) : 50;
  const currentItemClassification = activeItem ? getItemClassificationLabel(activeItem) : 'Relíquia Cultural';

  const isCurrentItemRead = activeItem ? readItemIds.includes(activeItem.id) : false;

  // Complete study handler
  const handleStudyCurrentItem = () => {
    if (!activeItem) return;
    if (isCurrentItemRead) {
      audioEngine.playSfx('click');
      return;
    }

    audioEngine.playSfx('badge');
    triggerConfetti();

    if (onCompleteReading) {
      onCompleteReading(activeItem.id, currentItemXp);
    }

    if (onSpeak) {
      onSpeak(
        `“Magnífico estudo! Desvendaste os mistérios de ${activeItem.title} [${currentItemClassification}]. +${currentItemXp} XP de sabedoria cívica adquiridos!”`
      );
    }
  };

  // Select Item and inspect
  const handleSelectItem = (item: CulturalItem) => {
    audioEngine.playSfx('click');
    setSelectedItemId(item.id);
    onInspectItem(item);
  };

  // Next / Previous navigation
  const currentIndexInFiltered = filteredItems.findIndex((it) => it.id === activeItem?.id);
  const handlePrevItem = () => {
    if (currentIndexInFiltered > 0) {
      handleSelectItem(filteredItems[currentIndexInFiltered - 1]);
    }
  };
  const handleNextItem = () => {
    if (currentIndexInFiltered < filteredItems.length - 1) {
      handleSelectItem(filteredItems[currentIndexInFiltered + 1]);
    }
  };

  // Build 12 slots for RPG grid layout
  const TOTAL_DISPLAY_SLOTS = Math.max(12, Math.ceil(items.length / 6) * 6);
  const displaySlots = useMemo(() => {
    const slots: Array<CulturalItem | null> = [];
    filteredItems.forEach((it) => slots.push(it));
    while (slots.length < TOTAL_DISPLAY_SLOTS) {
      slots.push(null);
    }
    return slots;
  }, [filteredItems, TOTAL_DISPLAY_SLOTS]);

  const rarityStyles = {
    sagrado: {
      badge: 'bg-amber-500/25 text-amber-300 border-amber-400',
      label: '★ SAGRADO',
      tag: 'SAG',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    },
    epico: {
      badge: 'bg-purple-500/25 text-purple-300 border-purple-400',
      label: '◆ ÉPICO',
      tag: 'EPI',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    },
    raro: {
      badge: 'bg-cyan-500/25 text-cyan-300 border-cyan-400',
      label: '▲ RARO',
      tag: 'RAR',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    },
    comum: {
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      label: '● COMUM',
      tag: 'COM',
      glow: '',
    },
  };

  return (
    <div
      id="container-bau-detalhado"
      className="container-bau-detalhado absolute inset-2 sm:inset-3 md:inset-4 z-20 flex flex-col animate-in fade-in zoom-in-98 duration-400 select-none pointer-events-auto"
    >
      {/* Moldura Mestra do Baú Aberto (Popover de Leitura & Inventário Totalmente Expandido) */}
      <div
        id="painel-mestre-bau"
        className="painel-mestre-bau relative w-full h-full bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-slate-100 flex flex-col backdrop-blur-md"
      >
        {/* Cantos Ornamentais RPG (Posicionados na borda externa visíveis) */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow-lg z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow-lg z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow-lg z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow-lg z-30 ring-1 ring-amber-500/80" />

        {/* ────────────────────────────────────────────────────────── */}
        {/* CABEÇALHO & SELETOR DO INVENTÁRIO (ESTRUTURADO EM GRID RPG) */}
        {/* Linha 1: [Logo + Baú do Saber Cívico + Badge] -> [Sabedoria Adquirida XP] */}
        {/* Linha 2 & 3: [Coluna Inventário (row-span-2) | Labels Categorias (L2) / Ícones Slots (L3) | Baú Aberto Sem Borda Rígida (row-span-2)] */}
        {/* ────────────────────────────────────────────────────────── */}
        <header
          id="cabecalho-bau-grid"
          className="cabecalho-bau-grid bg-slate-900/95 border-b border-amber-500/40 px-4 sm:px-6 py-2.5 shrink-0 flex flex-col gap-2.5 shadow-xl select-none rounded-t-2xl"
        >
          {/* LINHA 1: TÍTULO GERAL & SABEDORIA (Com margem para o grupo do baú no canto) */}
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-amber-500/20">
            {/* Esquerda: Logo + Título + Status */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md border border-amber-300 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                <h2 className="font-serif font-black text-base sm:text-lg text-amber-200 tracking-wider whitespace-nowrap">
                  BAÚ DO SABER CÍVICO
                </h2>
                <span className="badge-codice-estado text-[10px] font-serif font-black uppercase text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-md border border-yellow-200 shadow-sm whitespace-nowrap">
                  Códice de Relíquias • {stateId}
                </span>
                <span className="text-xs text-amber-300/90 font-mono font-bold whitespace-nowrap hidden sm:inline">
                  {readCount} de {items.length} Verbetes Estudados
                </span>
              </div>
            </div>

            {/* Direita: Sabedoria Adquirida XP (Deslocado elegantemente à esquerda do baú) */}
            <div className="painel-xp-sabedoria-bau bg-slate-950 px-3.5 py-1.5 rounded-xl border border-amber-500/40 flex flex-col items-end shadow-inner shrink-0 mr-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">
                Sabedoria Adquirida
              </span>
              <span className="text-xs sm:text-sm font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                XP {earnedXp}/{totalAvailableXp} ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* LINHA 2 & 3: GRID INTEGRADA [INVENTÁRIO (L2-L3) | LABELS (L2) + ÍCONES (L3) | BAÚ ABERTO HERO NO CANTO (L2-L3)] */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-stretch">
            {/* Bloco 1 (Esquerda - Ocupa Linhas 2 e 3): Rótulo Vertical/Destaque do Inventário */}
            <div className="bloco-label-inventario-colapse flex flex-col items-center justify-center bg-slate-950 border-2 border-amber-500/50 rounded-2xl px-3.5 py-2 h-full min-h-[96px] shrink-0 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-1">
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs font-serif font-black text-amber-200 uppercase tracking-widest whitespace-nowrap">
                INVENTÁRIO
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 mt-1 whitespace-nowrap font-bold">
                {filteredItems.length}/{TOTAL_DISPLAY_SLOTS} slots
              </span>
            </div>

            {/* Bloco 2 (Centro - Linha 2 em cima, Linha 3 embaixo): Categorias + Slots com Padding Amplo */}
            <div className="flex flex-col justify-between gap-2 min-w-0 py-0.5">
              {/* Linha 2 (Topo Centro): Labels / Filtros de Categoria */}
              <div className="menu-filtro-categorias-bau flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar-gold">
                {categories.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        audioEngine.playSfx('click');
                        setSelectedCategory(cat.id);
                      }}
                      className={`btn-filtro-cat px-3 py-1 rounded-xl text-[11px] sm:text-xs font-serif font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow font-bold scale-[1.02]'
                          : 'bg-slate-950 text-slate-300 border-slate-850 hover:border-amber-500/60 hover:text-amber-200 hover:bg-slate-900'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Linha 3 (Base Centro): Ícones dos Slots com Altura e Espaço Superior para o Span de Raridade */}
              <div
                id="grade-horizontal-slots-rpg"
                className="grade-horizontal-slots-rpg flex items-center gap-2 sm:gap-2.5 overflow-x-auto pt-3 pb-2 px-1 custom-scrollbar-gold"
              >
                {displaySlots.map((item, idx) => {
                  if (!item) {
                    return (
                      <div
                        key={`empty-slot-${idx}`}
                        className="slot-inventario-vazio w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center text-slate-700 shrink-0 opacity-40"
                        title="Slot Vazio do Inventário"
                      >
                        <Lock className="w-4 h-4 text-slate-700" />
                        <span className="text-[8px] font-mono mt-0.5">#{idx + 1}</span>
                      </div>
                    );
                  }

                  const isSelected = activeItem?.id === item.id;
                  const isRead = readItemIds.includes(item.id);
                  const rStyle = rarityStyles[item.rarity] || rarityStyles.comum;

                  return (
                    <div key={item.id} className="relative shrink-0 group">
                      <button
                        onClick={() => handleSelectItem(item)}
                        className={`slot-inventario-rpg relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-2 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.6)] scale-105 z-10 ring-2 ring-amber-300/40'
                            : isRead
                            ? 'bg-slate-950 border border-amber-500/40 hover:border-amber-400 hover:scale-105 hover:bg-slate-900'
                            : 'bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:scale-105 hover:bg-slate-900'
                        }`}
                      >
                        {/* Badge de Raridade Superior no Slot (Posicionada para nunca cortar) */}
                        <span
                          className={`absolute -top-2.5 -right-1 text-[7px] sm:text-[8px] font-mono font-black px-1.5 py-0.5 rounded border shadow-md z-20 ${rStyle.badge}`}
                        >
                          {rStyle.tag}
                        </span>

                        {/* Badge de Recompensa XP Individual no Slot */}
                        <span className="badge-xp-slot-item absolute -bottom-2 -right-1 text-[7px] font-mono font-black text-amber-300 bg-slate-950 px-1 py-0.2 rounded border border-amber-500/50 shadow z-20">
                          +{getItemXpReward(item)} XP
                        </span>

                        {/* Ícone Vetorial Central */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                          <ItemVectorIcon
                            itemId={item.id}
                            category={item.category}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          />
                        </div>

                        {/* Indicador de Lido */}
                        {isRead && (
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center shadow z-20">
                            <CheckCircle2 className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                          </div>
                        )}

                        {/* Indicador Ativo */}
                        {isSelected && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-amber-400 rounded-full shadow" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bloco 3 (Direita - Ocupa Linhas 2 e 3): Baú Aberto em Destaque Fluido, Sem Bordas Pesadas, com 'X' Flutuante e Tooltip ao Hover */}
            <div
              onClick={onClose}
              className="bloco-bau-topo-colapse group relative flex flex-col items-center justify-center min-w-[140px] sm:min-w-[160px] h-full min-h-[96px] shrink-0 cursor-pointer p-1"
              title="Clique para fechar o Baú e retornar ao cenário"
            >
              {/* Botão 'X' Flutuante no Topo Direito do Baú */}
              <div
                className="absolute top-0 right-0 w-7 h-7 rounded-full bg-slate-950 border border-amber-500/70 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-300 flex items-center justify-center shadow-lg transition-all duration-300 z-30 group-hover:scale-110"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </div>

              {/* Aura Dourada do Baú Aberto */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/40 transition-all duration-500 pointer-events-none" />

              {/* Imagem do Baú Aberto Ampliada e Sem Contornos Rígidos */}
              <div className="relative w-28 h-18 sm:w-32 sm:h-20 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/RS/itens/bau1-a.png"
                  alt="Baú de Relíquias Aberto"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(245,158,11,0.65)]"
                />
              </div>

              {/* Texto "Fechar Baú" Revelado Apenas ao Passar o Mouse (Hover) */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none whitespace-nowrap">
                <span className="bg-slate-950/95 text-amber-300 text-[10px] font-serif font-black px-2.5 py-0.5 rounded-full border border-amber-400/80 shadow-lg tracking-wider">
                  Fechar Baú ✕
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 3. SEÇÃO B: ÁREA DE LEITURA AMPLIADA (SPLIT-SCREEN)         */}
        {/* ────────────────────────────────────────────────────────── */}
        <section
          id="secao-leitura-ampliada-bau"
          className="secao-leitura-ampliada-bau flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 bg-slate-950 overflow-hidden"
        >
          {activeItem ? (
            <>
              {/* 3.1 COLUNA ESQUERDA: IMAGEM REAL, ACERVO & FICHA TÉCNICA (md:col-span-5) */}
              <div
                id="coluna-acervo-visual"
                className="coluna-acervo-visual hidden md:flex md:col-span-5 flex-col justify-between p-4 border-r border-amber-500/20 bg-slate-950/60 overflow-y-auto custom-scrollbar-gold space-y-3"
              >
                {/* Moldura de Galeria da Imagem Real */}
                {activeItem.archive?.imageUrl && (
                  <div className="card-moldura-museologica bg-slate-900 border border-amber-500/40 rounded-2xl p-2 shadow-xl space-y-2">
                    <div
                      className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 cursor-pointer"
                      onClick={() => setIsZoomImageOpen(true)}
                      title="Clique para ampliar a imagem histórica"
                    >
                      <img
                        src={activeItem.archive.imageUrl}
                        alt={activeItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-amber-300 text-xs font-serif font-bold backdrop-blur-[2px]">
                        <ZoomIn className="w-4 h-4" />
                        <span>Ver em Tela Cheia</span>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-sm text-[9px] font-mono text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 shadow">
                        {activeItem.archive.period || 'Acervo Histórico'}
                      </div>
                    </div>

                    <div className="px-1 space-y-1">
                      <p className="text-[11px] text-slate-300 font-serif italic leading-snug">
                        {activeItem.archive.imageCaption}
                      </p>
                      <div className="text-[9px] text-amber-400 font-mono flex items-center justify-between">
                        <span>{activeItem.archive.archiveName}</span>
                        <span>{activeItem.stateId} • Brasil</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Citação Direta do Guardião */}
                {activeItem.guardianQuote && (
                  <div className="citacao-guardiao-box bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2.5 shadow-inner">
                    <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-serif italic text-amber-100/95 leading-relaxed">
                        {activeItem.guardianQuote}
                      </p>
                      <span className="text-[10px] text-amber-400 font-mono block mt-1 font-bold">
                        — {guardianName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Ficha Técnica Museológica */}
                <div className="ficha-tecnica-resumo bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono uppercase border-b border-slate-800 pb-1">
                    <span>Ficha Catalográfica</span>
                    <span>ID: {activeItem.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-serif">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Classificação:</span>
                      <span className="text-slate-200 font-bold">{activeItem.categoryLabel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Raridade Cívica:</span>
                      <span className="text-amber-300 font-bold uppercase">{activeItem.rarity}</span>
                    </div>
                  </div>
                </div>
              </div>

                {/* 3.2 COLUNA DIREITA: LEITURA EDITORIAL AMPLIADA COM SCROLL INTERNO (md:col-span-7) */}
                <div
                  id="coluna-leitura-editorial"
                  className="coluna-leitura-editorial md:col-span-7 flex flex-col justify-between h-full min-h-0 bg-slate-950 relative"
                >
                  {/* Abas de Estudo Superior */}
                  <div className="menu-abas-leitura px-4 sm:px-6 pt-3 pb-1 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-950">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveReadingTab('historia')}
                        className={`aba-leitura px-3 py-1 text-xs font-serif font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                          activeReadingTab === 'historia'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>História & Tradição</span>
                      </button>
                      <button
                        onClick={() => setActiveReadingTab('acervo')}
                        className={`aba-leitura px-3 py-1 text-xs font-serif font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                          activeReadingTab === 'acervo'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                        }`}
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Acervo & Registro</span>
                      </button>
                      <button
                        onClick={() => setActiveReadingTab('fontes')}
                        className={`aba-leitura px-3 py-1 text-xs font-serif font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                          activeReadingTab === 'fontes'
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                        }`}
                      >
                        <Library className="w-3.5 h-3.5" />
                        <span>Fontes Oficiais ({activeItem.references.length})</span>
                      </button>
                    </div>

                    {/* Indicador de progresso de scroll da leitura */}
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span>Leitura: {readingProgress}%</span>
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-150"
                          style={{ width: `${readingProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CORPO DE TEXTO COM SCROLL ESTREITO INTERNO */}
                  <div
                    ref={readingPaneRef}
                    onScroll={handleReadingScroll}
                    id="conteudo-scroll-leitura"
                    className="conteudo-scroll-leitura flex-1 min-h-0 overflow-y-auto custom-scrollbar-gold px-4 sm:px-6 py-4 space-y-4 font-serif text-slate-200 leading-relaxed select-text"
                  >
                  {/* Cabeçalho da Relíquia */}
                  <div className="space-y-1.5 pb-2 border-b border-amber-500/20">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge-cat-label text-[10px] font-serif font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2 py-0.5 rounded border border-yellow-200">
                        {currentItemClassification}
                      </span>
                      <span
                        className={`text-[10px] font-serif font-bold uppercase px-2 py-0.5 rounded border ${
                          rarityStyles[activeItem.rarity]?.badge || rarityStyles.comum.badge
                        }`}
                      >
                        {rarityStyles[activeItem.rarity]?.label || activeItem.rarity}
                      </span>
                      <span className="badge-xp-individual text-[10px] font-mono font-black text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/40 shadow-sm">
                        +{currentItemXp} XP
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        • Unidade Federativa: {activeItem.stateId}
                      </span>
                    </div>

                    <h1 className="titulo-reliquia-destaque font-serif font-black text-xl sm:text-2xl md:text-3xl text-amber-200 tracking-wide leading-tight mt-1">
                      {activeItem.title}
                    </h1>

                    {/* Divisor Decorativo com Losango */}
                    <div className="flex items-center gap-2 py-1">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                      <span className="text-amber-400 text-xs">◆</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    </div>
                  </div>

                  {activeReadingTab === 'historia' && (
                    <>
                      {/* Resumo com Destaque */}
                      <div className="resumo-box-italico bg-slate-900/80 border-l-4 border-amber-400 p-3 rounded-r-xl shadow-inner">
                        <p className="text-xs sm:text-sm font-serif italic text-amber-100/90 leading-snug">
                          “{activeItem.shortDesc}”
                        </p>
                      </div>

                      {/* Descrição Principal com Letra Capitular (Drop Cap) */}
                      <div className="secao-texto-capitular space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                          <Feather className="w-4 h-4 text-amber-400" />
                          <span>Descrição do Bem Cultural & Rito</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-100 text-justify leading-relaxed drop-cap-editorial">
                          <span className="float-left text-3xl sm:text-4xl font-serif font-black text-amber-300 leading-none pr-2 pt-1">
                            {activeItem.fullDesc.charAt(0)}
                          </span>
                          {activeItem.fullDesc.slice(1)}
                        </p>
                      </div>

                      {/* Contexto Histórico */}
                      {activeItem.historicalContext && (
                        <div className="secao-contexto-historico bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl space-y-2 shadow-sm">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>Contexto Histórico & Origem das Tradições</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 text-justify leading-relaxed">
                            {activeItem.historicalContext}
                          </p>
                        </div>
                      )}

                      {/* Simbologia e Impacto Cultural */}
                      {activeItem.culturalImpact && (
                        <div className="secao-impacto-social space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                            <Landmark className="w-4 h-4 text-amber-400" />
                            <span>Simbologia, Legislação & Impacto Cívico</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 text-justify leading-relaxed">
                            {activeItem.culturalImpact}
                          </p>
                        </div>
                      )}

                      {/* Pontos de Sabedoria Essenciais */}
                      {activeItem.keyTakeaways && activeItem.keyTakeaways.length > 0 && (
                        <div className="secao-pontos-chave bg-emerald-950/20 border border-emerald-500/40 p-3.5 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Pontos de Sabedoria Essenciais</span>
                          </div>
                          <ul className="space-y-1 text-xs text-slate-200">
                            {activeItem.keyTakeaways.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Curiosidade & Sabedoria Popular */}
                      {activeItem.curiosity && (
                        <div className="caixa-curiosidade bg-amber-950/25 border border-amber-500/40 p-3 rounded-xl space-y-1 shadow">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                            <span>Curiosidade & Sabedoria Popular</span>
                          </div>
                          <p className="text-xs text-amber-100/90 italic leading-snug">
                            {activeItem.curiosity}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {activeReadingTab === 'acervo' && (
                    <div className="secao-detalhe-acervo space-y-3">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                          <Landmark className="w-4 h-4 text-amber-400" />
                          <span>Registro Museológico & Preservação</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Este registro faz parte do acervo cívico de salvaguarda cultural do Estado de{' '}
                          <strong>{guardianName}</strong> ({activeItem.stateId}).
                        </p>

                        {activeItem.archive?.imageUrl && (
                          <div className="rounded-xl overflow-hidden border border-amber-500/30">
                            <img
                              src={activeItem.archive.imageUrl}
                              alt={activeItem.title}
                              className="w-full max-h-64 object-cover"
                            />
                            <div className="p-2.5 bg-slate-950 text-xs text-slate-300 space-y-1">
                              <p className="font-serif italic">{activeItem.archive.imageCaption}</p>
                              <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
                                <span>Fonte: {activeItem.archive.archiveName}</span>
                                <span>{activeItem.archive.period}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-xs">
                          <div className="font-bold text-amber-200">Notas do Curador Cívico:</div>
                          <div className="text-slate-300 italic">
                            {activeItem.archive?.curatorNotes ||
                              'Patrimônio Cultural protegido e registrado.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeReadingTab === 'fontes' && (
                    <div className="secao-fontes-oficiais space-y-3">
                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                          <Library className="w-4 h-4 text-amber-400" />
                          <span>Fontes Oficiais, Legislação e Instituições de Salvaguarda</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Consulte os documentos oficiais e portais institucionais que fundamentam este verbete:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {activeItem.references.map((ref, idx) => (
                          <a
                            key={idx}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-link-referencia group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/80 p-3 rounded-xl transition flex items-start justify-between gap-3 shadow"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200 group-hover:text-amber-300">
                                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{ref.title}</span>
                              </div>
                              <div className="text-[10px] text-amber-400/90 font-mono">
                                {ref.institution}
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">
                                {ref.description}
                              </p>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-amber-400 text-slate-400 group-hover:text-amber-300 shrink-0">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 3.3 RODAPÉ DO LEITOR: AÇÃO DE ESTUDO & NAVEGAÇÃO           */}
                {/* ────────────────────────────────────────────────────────── */}
                <div
                  id="rodape-acoes-leitor"
                  className="rodape-acoes-leitor px-4 sm:px-6 py-3 border-t border-amber-500/30 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"
                >
                  <div className="flex items-center gap-2">
                    {isCurrentItemRead ? (
                      <div className="badge-estudado flex items-center gap-1.5 text-emerald-400 text-xs font-serif font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sabedoria Registrada (+{currentItemXp} XP)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-serif bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>
                          Estude este verbete para absorver o saber e ganhar{' '}
                          <strong>+{currentItemXp} XP</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* Botões de Próximo / Anterior */}
                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                      <button
                        onClick={handlePrevItem}
                        disabled={currentIndexInFiltered <= 0}
                        className="btn-nav-item-prev p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        title="Relíquia Anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-mono text-amber-400 px-1 font-bold">
                        {currentIndexInFiltered + 1}/{filteredItems.length}
                      </span>
                      <button
                        onClick={handleNextItem}
                        disabled={currentIndexInFiltered >= filteredItems.length - 1}
                        className="btn-nav-item-next p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        title="Próxima Relíquia"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Botão de Estudar */}
                    <button
                      onClick={handleStudyCurrentItem}
                      className={`btn-estudar-verbete px-4 py-2 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg ${
                        isCurrentItemRead
                          ? 'bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-500/50'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border border-yellow-200 scale-100 hover:scale-[1.02]'
                      }`}
                    >
                      {isCurrentItemRead ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                          <span>Verbete Estudado</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                          <span>Estudar Verbete (+{currentItemXp} XP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-12 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Package className="w-12 h-12 text-slate-600 mb-2" />
              <p className="font-serif">Nenhuma relíquia encontrada para a categoria selecionada.</p>
            </div>
          )}
        </section>
      </div>

      {/* Modal de Zoom da Imagem Histórica */}
      {isZoomImageOpen && activeItem?.archive?.imageUrl && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/95 flex items-center justify-center p-4 cursor-pointer backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsZoomImageOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[88vh] bg-slate-900 border-2 border-amber-400 rounded-2xl overflow-hidden p-2.5 shadow-2xl">
            <button
              onClick={() => setIsZoomImageOpen(false)}
              className="absolute top-4 right-4 bg-slate-950 text-amber-300 hover:text-white p-2 rounded-full border border-amber-400 z-10 cursor-pointer shadow"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeItem.archive.imageUrl}
              alt={activeItem.title}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs font-serif text-amber-200">
              {activeItem.archive.imageCaption} —{' '}
              <span className="font-mono text-slate-400">{activeItem.archive.archiveName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
