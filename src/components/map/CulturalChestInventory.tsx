import React, { useState } from 'react';
import { CulturalItem, CULTURAL_INVENTORY_BY_STATE } from '../../data/culturalInventoryData';
import { audioEngine } from '../../lib/audioSynth';
import {
  Sparkles,
  X,
  Package,
  Utensils,
  BookOpen,
  Leaf,
  Users,
  Compass,
  Award,
  Lock,
  Eye,
  ChevronRight,
} from 'lucide-react';

interface Props {
  stateId: string;
  stateName: string;
  guardianName: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectItem?: (item: CulturalItem) => void;
}

export const CulturalChestInventory: React.FC<Props> = ({
  stateId,
  stateName,
  guardianName,
  isOpen,
  onToggleOpen,
  onSelectItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [inspectingItem, setInspectingItem] = useState<CulturalItem | null>(null);

  // Retrieve inventory items for state (fallback to RS if other states don't have custom items yet)
  const items: CulturalItem[] =
    CULTURAL_INVENTORY_BY_STATE[stateId] || CULTURAL_INVENTORY_BY_STATE['RS'] || [];

  const categories = [
    { id: 'todos', label: 'Todos os Itens', icon: Package },
    { id: 'culinaria', label: 'Culinária & Mesa', icon: Utensils },
    { id: 'historia', label: 'História & Guerras', icon: BookOpen },
    { id: 'fauna_flora', label: 'Fauna & Flora', icon: Leaf },
    { id: 'tradicoes', label: 'Tradições & Pilcha', icon: Users },
    { id: 'personagens', label: 'Heroínas & Nomes', icon: Award },
    { id: 'geografia', label: 'Geografia & Missões', icon: Compass },
  ];

  const filteredItems =
    selectedCategory === 'todos'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleOpenChest = () => {
    audioEngine.playSfx('badge');
    onToggleOpen();
  };

  const handleInspect = (item: CulturalItem) => {
    audioEngine.playSfx('click');
    setInspectingItem(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  const getRarityBadge = (rarity: CulturalItem['rarity']) => {
    switch (rarity) {
      case 'sagrado':
        return {
          label: 'Relíquia Sagrada',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-amber-500/30',
        };
      case 'epico':
        return {
          label: 'Tesouro Épico',
          classes: 'bg-purple-500/20 text-purple-300 border-purple-400/80 shadow-purple-500/30',
        };
      case 'raro':
        return {
          label: 'Item Raro',
          classes: 'bg-blue-500/20 text-blue-300 border-blue-400/80 shadow-blue-500/30',
        };
      default:
        return {
          label: 'Costume Tradicional',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/80',
        };
    }
  };

  const chestImgSrc = isOpen ? '/RS/itens/bau1-a.png' : '/RS/itens/bau1.png';

  return (
    <div className="container-bau-inventario-cultural relative flex flex-col">
      {/* 1. CLOSED OR MINI CHEST TRIGGER BAR */}
      {!isOpen ? (
        <div
          onClick={handleOpenChest}
          className="card-bau-fechado group relative bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border-2 border-amber-500/60 hover:border-amber-400 rounded-3xl p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:shadow-amber-500/20 hover:scale-[1.01] cursor-pointer flex items-center justify-between gap-3 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            {/* Chest Graphic with Outline / Hover Highlight */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-md group-hover:bg-amber-400/40 transition-all" />
              <img
                src="/RS/itens/bau1.png"
                alt="Baú Cultural Fechado"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:rotate-1 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/RS/itens/bau1.png';
                }}
              />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                {items.length}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Inventário Cultural • {stateId}
                </span>
                <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">
                  {items.length} Relíquias & Tradições
                </span>
              </div>
              <h3 className="font-serif font-black text-sm sm:text-base text-amber-200 group-hover:text-amber-100 transition tracking-wide flex items-center gap-1.5 mt-0.5">
                <span>Baú de Relíquias de {stateName}</span>
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              </h3>
              <p className="text-[11px] text-slate-300 font-serif line-clamp-1 mt-0.5">
                Clique para abrir o baú e inspecionar comidas, história, fauna, vestimentas e heróis!
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 relative z-10">
            <button className="btn-abrir-bau bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-serif font-black text-xs px-3.5 py-2 rounded-2xl shadow-lg border border-amber-300 flex items-center gap-1.5 group-hover:from-amber-400 group-hover:to-yellow-400 transition-all cursor-pointer">
              <span>Abrir Baú</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        /* 2. OPEN CHEST FULL INTERACTIVE INVENTORY SYSTEM */
        <div className="painel-inventario-aberto bg-slate-950/95 border-2 border-amber-500/80 rounded-3xl p-3 sm:p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-200">
          
          {/* Header of Open Chest */}
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-500/40">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                <img
                  src="/RS/itens/bau1-a.png"
                  alt="Baú Cultural Aberto"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(245,158,11,0.3)] animate-pulse"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-serif font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/50">
                    Baú Aberto • Inventário do Estado
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {filteredItems.length} de {items.length} itens exibidos
                  </span>
                </div>
                <h3 className="font-serif font-black text-sm sm:text-base text-amber-200">
                  Relíquias, Sabores e Memórias de {stateName}
                </h3>
              </div>
            </div>

            <button
              onClick={onToggleOpen}
              className="btn-fechar-bau bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 p-2 rounded-2xl border border-amber-500/40 transition shadow cursor-pointer flex items-center gap-1.5 text-xs font-serif font-bold"
              title="Fechar Baú"
            >
              <X className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Guardar Baú</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-gold-horizontal pb-2 pt-0.5">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* COMPARTMENTALIZED RPG INVENTORY SLOTS GRID */}
          <div className="grade-slots-inventario grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 max-h-72 sm:max-h-80 overflow-y-auto custom-scrollbar-gold pr-1">
            {filteredItems.map((item) => {
              const rarityInfo = getRarityBadge(item.rarity);
              return (
                <div
                  key={item.id}
                  onClick={() => handleInspect(item)}
                  className="card-slot-item-rpg group relative bg-slate-900/90 hover:bg-slate-800/95 border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl p-2.5 sm:p-3 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer flex flex-col justify-between"
                >
                  {/* Slot Frame Top */}
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span
                      className={`text-[9px] font-serif font-bold uppercase px-1.5 py-0.5 rounded-md border ${rarityInfo.classes}`}
                    >
                      {item.rarity}
                    </span>
                  </div>

                  {/* Item Title & Category */}
                  <div className="mt-1">
                    <div className="text-[10px] text-amber-400/80 font-serif line-clamp-1">
                      {item.categoryLabel}
                    </div>
                    <h4 className="font-serif font-bold text-xs text-amber-100 group-hover:text-white line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                  </div>

                  {/* Inspect CTA indicator */}
                  <div className="mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                      <Eye className="w-3 h-3" /> Inspecionar
                    </span>
                    <span className="text-amber-500 font-bold">▶</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ITEM INSPECTOR MODAL / SHOWCASE WITH GUARDIAN REACTION */}
      {inspectingItem && (
        <div className="modal-inspecao-item fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
          <div className="card-detalhes-reliquia bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden animate-in zoom-in-95 duration-200 text-slate-100">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  {inspectingItem.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/50">
                      {inspectingItem.categoryLabel}
                    </span>
                    <span
                      className={`text-[10px] font-serif font-bold uppercase px-2 py-0.5 rounded-md border ${
                        getRarityBadge(inspectingItem.rarity).classes
                      }`}
                    >
                      {getRarityBadge(inspectingItem.rarity).label}
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-base sm:text-lg text-amber-200 mt-1">
                    {inspectingItem.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setInspectingItem(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-3 text-xs sm:text-sm font-serif max-h-64 overflow-y-auto custom-scrollbar-gold pr-1">
              <p className="text-slate-200 leading-relaxed">
                {inspectingItem.fullDesc}
              </p>

              {/* Curiosity Box */}
              {inspectingItem.curiosity && (
                <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Curiosidade Ancestral & Tradição:</span>
                  </div>
                  <p className="text-xs text-amber-100/90 italic">
                    {inspectingItem.curiosity}
                  </p>
                </div>
              )}

              {/* Guardian's Quote */}
              <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  Palavra do Guardião ({guardianName}):
                </div>
                <p className="text-xs sm:text-sm text-amber-300 italic font-serif">
                  {inspectingItem.guardianQuote}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectingItem(null)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs px-5 py-2 rounded-xl transition shadow-lg cursor-pointer"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
