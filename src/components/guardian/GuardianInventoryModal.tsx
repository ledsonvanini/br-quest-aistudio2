import React, { useState } from 'react';
import { CulturalItem } from '../../data/culturalInventoryData';
import { CompassBadgeIcon, ItemVectorIcon } from './GuardianCommon';
import { GuardianItemReadingModal } from './GuardianItemReadingModal';
import {
  Package,
  X,
  Eye,
  Utensils,
  BookOpen,
  Leaf,
  Users,
  Compass,
  Award,
  Sparkles,
  CheckCircle,
  Search,
  BookMarked,
  GraduationCap,
  Landmark,
} from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingItem, setReadingItem] = useState<CulturalItem | null>(null);

  const categories = [
    { id: 'todos', label: 'Todas as Relíquias', icon: Package },
    { id: 'historia', label: 'História & Guerras', icon: BookOpen },
    { id: 'tradicoes', label: 'Tradições & Indumentária', icon: Users },
    { id: 'culinaria', label: 'Culinária & Ritos', icon: Utensils },
    { id: 'personagens', label: 'Heróis & Personagens', icon: Award },
    { id: 'geografia', label: 'Patrimônio Mundial', icon: Landmark },
    { id: 'fauna_flora', label: 'Fauna & Flora', icon: Leaf },
  ];

  const filteredItems = items.filter((it) => {
    const matchCat = selectedCategory === 'todos' || it.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const readCount = items.filter((it) => readItemIds.includes(it.id)).length;
  const progressPercent = Math.round((readCount / (items.length || 1)) * 100);
  const totalAvailableXp = items.length * 50;
  const earnedXp = readCount * 50;

  return (
    <>
      <div className="container-inventario-rpg absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[96%] max-w-4xl lg:max-w-5xl z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200 select-none">
        {/* Moldura RPG Ampliada e Espaçosa com Acervo Histórico */}
        <div className="painel-inventario-conteudo relative bg-slate-950/98 border-2 border-amber-500/95 rounded-2xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] space-y-3.5 text-slate-100 flex flex-col h-[78vh] sm:h-[80vh]">
          {/* Cantos Ornamentais RPG */}
          <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
          <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
          <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />
          <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 pointer-events-none shadow" />

          {/* Cabeçalho do Inventário com Estatísticas Educativas */}
          <div className="cabecalho-inventario flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/40 pb-3 gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <CompassBadgeIcon icon={Package} size="md" active />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-categoria-rpg text-[10px] font-serif font-black uppercase text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded border border-yellow-200 shadow-sm">
                    Códice de Relíquias • {stateId}
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
                    <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                    {readCount} de {items.length} Verbetes Estudados
                  </span>
                </div>
                <h3 className="font-serif font-black text-base sm:text-lg text-amber-200 tracking-wide mt-0.5">
                  Baú do Saber Cívico & Patrimônio Histórico
                </h3>
              </div>
            </div>

            {/* Painel de Pontuação de Conhecimento e Botão Fechar */}
            <div className="flex items-center gap-3">
              <div className="painel-meta-xp hidden sm:flex flex-col items-end bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <div className="text-[10px] font-mono text-slate-400">Sabedoria Adquirida:</div>
                <div className="text-xs font-serif font-bold text-amber-300">
                  +{earnedXp} / +{totalAvailableXp} XP ({progressPercent}%)
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-fechar-inventario bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-2 rounded-xl border border-amber-500/50 transition cursor-pointer shadow"
                title="Fechar Inventário e Retornar ao Palco"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Barra de Progresso Cultural & Barra de Pesquisa */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <div className="barra-pesquisa-inventario relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar relíquia, fato ou categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-400 pl-8 pr-3 py-1.5 rounded-xl text-xs font-serif text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            {/* Categorias Rápidas */}
            <div className="barra-filtros-categorias flex items-center gap-1.5 overflow-x-auto pb-1 w-full flex-1 scrollbar-gold-horizontal">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`item-filtro-categoria px-2.5 py-1 rounded-lg text-xs font-serif font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/60 hover:bg-slate-850'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade Ampliada de Slots de Itens Culturais RPG */}
          <div className="grade-slots-inventario grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar-gold pr-1.5 flex-1 min-h-0">
            {filteredItems.map((item) => {
              const isRead = readItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setReadingItem(item);
                    onInspectItem(item);
                  }}
                  className={`card-slot-item-rpg group border rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-lg relative overflow-hidden ${
                    isRead
                      ? 'bg-slate-900/95 border-amber-400/80 hover:border-amber-300 hover:bg-slate-850'
                      : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/80 hover:bg-slate-850'
                  }`}
                >
                  {/* Topo do Card: Ícone, Categorias e Status de Leitura */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/50 flex items-center justify-center group-hover:border-amber-300 shadow-inner relative shrink-0">
                        <ItemVectorIcon
                          itemId={item.id}
                          category={item.category}
                          className="w-5 h-5"
                        />
                        {isRead && (
                          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-slate-950 shadow">
                            <CheckCircle className="w-3 h-3 text-slate-950" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[8px] font-serif font-bold uppercase px-2 py-0.5 rounded border ${
                            item.rarity === 'sagrado'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400/80'
                              : item.rarity === 'epico'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/60'
                              : item.rarity === 'raro'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {item.rarity}
                        </span>
                        <span className="text-[9px] text-amber-400/90 font-serif font-bold">
                          {item.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Título & Resumo Educativo */}
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-sm text-slate-100 group-hover:text-amber-200 line-clamp-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-serif text-slate-300 line-clamp-2 leading-relaxed italic">
                        “{item.shortDesc}”
                      </p>
                    </div>
                  </div>

                  {/* Rodapé do Card: Ação de Estudo e XP */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        isRead ? 'text-emerald-400' : 'text-amber-300 group-hover:text-yellow-300'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      {isRead ? 'Estudo Concluído' : 'Estudar Verbete (+50 XP)'}
                    </span>
                    <span className="text-amber-400 text-xs group-hover:translate-x-0.5 transition-transform">
                      ➔
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé Informativo */}
          <div className="rodape-status-acervo pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-serif text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Acervo Documental baseado em dados históricos e patrimônio tombado</span>
            </div>
            <span className="text-amber-300/90 font-mono">
              {filteredItems.length} {filteredItems.length === 1 ? 'item disponível' : 'itens disponíveis'}
            </span>
          </div>
        </div>
      </div>

      {/* Painel Digno de Leitura (Pergaminho Cultural Completo com Referências) */}
      {readingItem && (
        <GuardianItemReadingModal
          item={readingItem}
          guardianName={guardianName}
          isAlreadyRead={readItemIds.includes(readingItem.id)}
          onClose={() => setReadingItem(null)}
          onCompleteReading={(itemId, xpEarned) => {
            if (onCompleteReading) {
              onCompleteReading(itemId, xpEarned);
            }
          }}
          onSpeak={onSpeak}
        />
      )}
    </>
  );
};

