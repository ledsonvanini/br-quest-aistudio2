import React, { useState } from 'react';
import {
  Leaf,
  Bird,
  Trees,
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  X,
  BookOpen,
  Globe,
  Sliders,
  ChevronRight,
  ExternalLink,
  Award,
  RotateCcw,
  Layers,
  AlertTriangle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { BiodiversityKingdom, BrazilBiome, BiodiversitySpecimen } from '../../types';
import { ALL_BRAZIL_SPECIMENS, BIOME_COLORS, IUCN_STATUS_LABELS } from '../../data/brazilBiodiversityData';
import { audioEngine } from '../../lib/audioSynth';
import { BiodiversityImage } from '../common/BiodiversityImage';

interface BiodiversityControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeKingdom: BiodiversityKingdom | 'all';
  onKingdomChange: (kingdom: BiodiversityKingdom | 'all') => void;
  activeBiome: BrazilBiome | 'all';
  onBiomeChange: (biome: BrazilBiome | 'all') => void;
  threatenedOnly: boolean;
  onToggleThreatenedOnly: () => void;
  endemicOnly: boolean;
  onToggleEndemicOnly: () => void;
  onOpenStateDetails: (stateId: string) => void;
  selectedStateId?: string | null;
  onToggleExpand?: (expanded: boolean) => void;
}

export const BiodiversityControlPanel: React.FC<BiodiversityControlPanelProps> = ({
  isOpen,
  onClose,
  activeKingdom,
  onKingdomChange,
  activeBiome,
  onBiomeChange,
  threatenedOnly,
  onToggleThreatenedOnly,
  endemicOnly,
  onToggleEndemicOnly,
  onOpenStateDetails,
  selectedStateId,
  onToggleExpand,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Expandido / Maximizado por padrão (50% da largura da tela)
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  if (!isOpen) return null;

  const biomes: BrazilBiome[] = [
    'Amazônia',
    'Cerrado',
    'Mata Atlântica',
    'Caatinga',
    'Pantanal',
    'Pampa',
    'Marinho Costeiro',
  ];

  // Count total threatened in database
  const totalThreatenedCount = ALL_BRAZIL_SPECIMENS.filter((s) =>
    ['CR', 'EN', 'VU'].includes(s.iucnStatus)
  ).length;

  const filteredCatalog = ALL_BRAZIL_SPECIMENS.filter((s) => {
    if (activeKingdom !== 'all' && s.kingdom !== activeKingdom) return false;
    if (activeBiome !== 'all' && !s.biomes.includes(activeBiome)) return false;
    if (threatenedOnly && !['CR', 'EN', 'VU'].includes(s.iucnStatus)) return false;
    if (endemicOnly && !s.isEndemicBrazil && !s.isEndemicState) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        s.namePt.toLowerCase().includes(term) ||
        s.scientificName.toLowerCase().includes(term) ||
        s.subcategoryPt.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const hasActiveFilters =
    activeKingdom !== 'all' ||
    activeBiome !== 'all' ||
    threatenedOnly ||
    endemicOnly ||
    searchTerm.trim().length > 0;

  const handleResetFilters = () => {
    audioEngine.playSfx('click');
    onKingdomChange('all');
    onBiomeChange('all');
    if (threatenedOnly) onToggleThreatenedOnly();
    if (endemicOnly) onToggleEndemicOnly();
    setSearchTerm('');
  };

  const handleToggleExpand = () => {
    audioEngine.playSfx('click');
    setIsExpanded((prev) => {
      const next = !prev;
      if (onToggleExpand) onToggleExpand(next);
      return next;
    });
  };

  return (
    <>
      {/* Botão Flutuante Discreto para Reabrir Painel de Filtros (quando minimizado) */}
      {!isDrawerOpen && (
        <div className="fixed bottom-14 left-4 sm:left-[80px] z-40 pointer-events-auto">
          <button
            onClick={() => {
              audioEngine.playSfx('click');
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/95 hover:bg-slate-900 border-2 border-emerald-500/80 text-emerald-300 text-xs font-serif font-bold shadow-2xl shadow-black/90 hover:scale-105 transition-all cursor-pointer"
            title="Abrir Catálogo de Biodiversidade"
          >
            <Filter className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Catálogo de Biodiversidade</span>
          </button>
        </div>
      )}

      {/* Painel Principal de Catálogo de Biodiversidade (Lateral Esquerda, 50% Expandido por Padrão) */}
      {isDrawerOpen && (
        <div
          id="painel-controle-biodiversidade"
          data-scrollable="true"
          className={`painel-hud-controles painel-catalogo-biodiversidade fixed top-3 sm:top-3.5 md:top-4 bottom-14 sm:bottom-16 left-2 sm:left-[76px] md:left-[84px] lg:left-[88px] z-40 bg-slate-950/98 sm:bg-slate-950/95 border border-emerald-500/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_24px_rgba(16,185,129,0.25)] backdrop-blur-2xl text-slate-100 flex flex-col animate-in fade-in slide-in-from-left-4 duration-300 select-none overflow-hidden pointer-events-auto transition-all ${
            isExpanded
              ? 'w-[calc(100vw-16px)] sm:w-[calc(50vw-44px)] lg:w-[calc(50vw-48px)] xl:w-[calc(50vw-52px)]'
              : 'w-[calc(100vw-16px)] sm:w-[500px] md:w-[540px]'
          }`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {/* 1. Header do Painel do Catálogo */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-300 shadow-md">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-black text-sm text-white tracking-wide flex items-center gap-2">
                  Catálogo de Biodiversidade
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                </h4>
                <p className="text-[11px] text-emerald-300/90 font-medium">Controle de População do Mapa & Fauna/Flora</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                  title="Limpar todos os filtros"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}

              {/* Botão Expandir / Restaurar */}
              <button
                id="btn-tamanho-catalogo-biodiversidade"
                onClick={handleToggleExpand}
                className="btn-tamanho-painel p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={isExpanded ? 'Restaurar tamanho compacto' : 'Maximizar catálogo (50% da tela)'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Minimizar para botão discreto */}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Minimizar painel"
              >
                <ChevronRight className="w-4 h-4 -rotate-90" />
              </button>

              {/* Fechar completamente */}
              <button
                id="btn-fechar-catalogo-biodiversidade"
                onClick={onClose}
                className="btn-fechar-painel p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Fechar catálogo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Barra de Busca Rápida */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por animal, planta, fungo, nome científico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Seções de Filtro com Layout Responsivo (1 coluna ou 2 colunas quando expandido) */}
          <div
            className={`p-3.5 overflow-y-auto custom-scrollbar flex-1 text-xs ${
              isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'
            }`}
          >
            {/* COLUNA ESQUERDA: CONTROLES DE FILTRO */}
            <div className="space-y-4">
              {/* SEÇÃO 1: DESTAQUE LIVRO VERMELHO (ESPÉCIES AMEAÇADAS) */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-rose-300 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Destaque Principal de Conservação
                </span>

                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onToggleThreatenedOnly();
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                    threatenedOnly
                      ? 'bg-gradient-to-r from-rose-950 via-rose-900/60 to-slate-900 border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.45)] ring-2 ring-rose-400/40 text-white'
                      : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                        threatenedOnly
                          ? 'bg-rose-600 border-white text-white shadow-lg shadow-rose-500/50'
                          : 'bg-rose-950/80 border-rose-500/40 text-rose-400 group-hover:scale-105'
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>Livro Vermelho (Ameaçadas)</span>
                        {threatenedOnly && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-600 text-[10px] font-black tracking-wider">
                            ATIVO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-rose-300/90 font-medium">
                        {totalThreatenedCount} espécies sob risco de extinção (CR • EN • VU)
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-black transition-all ${
                      threatenedOnly
                        ? 'bg-rose-500 border-white text-white shadow-md'
                        : 'border-slate-600 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {threatenedOnly ? '✓' : ''}
                  </div>
                </button>
              </div>

              {/* SEÇÃO 2: FILTRO POR REINOS BIOLÓGICOS (Sequência: Fauna, Flora, Fungos, Todos) */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-300 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Filtrar por Reino Biológico
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onKingdomChange('fauna');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition flex items-center gap-2.5 cursor-pointer ${
                      activeKingdom === 'fauna'
                        ? 'bg-amber-500 text-slate-950 border-white font-black shadow-lg shadow-amber-500/30'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <Bird className={`w-4 h-4 ${activeKingdom === 'fauna' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <div className="min-w-0">
                      <div className="font-bold text-xs">Fauna (Animais)</div>
                      <div className={`text-[10px] ${activeKingdom === 'fauna' ? 'text-slate-800' : 'text-slate-400'}`}>
                        {ALL_BRAZIL_SPECIMENS.filter((s) => s.kingdom === 'fauna').length} espécies
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onKingdomChange('flora');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition flex items-center gap-2.5 cursor-pointer ${
                      activeKingdom === 'flora'
                        ? 'bg-emerald-500 text-slate-950 border-white font-black shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <Trees className={`w-4 h-4 ${activeKingdom === 'flora' ? 'text-slate-950' : 'text-emerald-400'}`} />
                    <div className="min-w-0">
                      <div className="font-bold text-xs">Flora (Plantas)</div>
                      <div className={`text-[10px] ${activeKingdom === 'flora' ? 'text-slate-800' : 'text-slate-400'}`}>
                        {ALL_BRAZIL_SPECIMENS.filter((s) => s.kingdom === 'flora').length} espécies
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onKingdomChange('fungi_micro');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition flex items-center gap-2.5 cursor-pointer ${
                      activeKingdom === 'fungi_micro'
                        ? 'bg-cyan-500 text-slate-950 border-white font-black shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-4 h-4 ${activeKingdom === 'fungi_micro' ? 'text-slate-950' : 'text-cyan-400'}`}
                    >
                      <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
                      <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
                      <circle cx="8" cy="8.5" r="1" fill="currentColor" />
                      <circle cx="15.5" cy="9" r="0.8" fill="currentColor" />
                      <circle cx="12" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                    <div className="min-w-0">
                      <div className="font-bold text-xs">Fungos & Micro</div>
                      <div className={`text-[10px] ${activeKingdom === 'fungi_micro' ? 'text-slate-800' : 'text-slate-400'}`}>
                        {ALL_BRAZIL_SPECIMENS.filter((s) => s.kingdom === 'fungi_micro').length} espécimes
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onKingdomChange('all');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition flex items-center gap-2.5 cursor-pointer ${
                      activeKingdom === 'all'
                        ? 'bg-teal-500 text-slate-950 border-white font-black shadow-lg shadow-teal-500/30'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-teal-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <Leaf className={`w-4 h-4 ${activeKingdom === 'all' ? 'text-slate-950' : 'text-teal-400'}`} />
                    <div className="min-w-0">
                      <div className="font-bold text-xs">Todos os Reinos</div>
                      <div className={`text-[10px] ${activeKingdom === 'all' ? 'text-slate-800' : 'text-slate-400'}`}>
                        {ALL_BRAZIL_SPECIMENS.length} espécimes
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* SEÇÃO 3: FILTRO POR BIOMAS DO BRASIL */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-300 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Filtrar por Bioma Brasileiro
                </span>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onBiomeChange('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeBiome === 'all'
                        ? 'bg-emerald-500 text-slate-950 border-white font-black shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>Todos os Biomas</span>
                  </button>

                  {biomes.map((b) => {
                    const count = ALL_BRAZIL_SPECIMENS.filter((s) => s.biomes.includes(b)).length;
                    const isSelected = activeBiome === b;
                    return (
                      <button
                        key={b}
                        onClick={() => {
                          audioEngine.playSfx('click');
                          onBiomeChange(b);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-white font-black shadow-md'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: BIOME_COLORS[b]?.primary || '#10b981' }}
                        />
                        <span>{b}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-950 font-black' : 'text-slate-400'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEÇÃO 4: ENDEMISMO BRASILEIRO */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    onToggleEndemicOnly();
                  }}
                  className={`w-full p-2.5 rounded-xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                    endemicOnly
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500 shadow-md font-bold'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">Apenas Espécies Endêmicas do Brasil</div>
                      <div className="text-[10px] text-slate-400">Ocorrem exclusivamente em território nacional</div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold text-xs ${
                      endemicOnly ? 'bg-amber-500 border-white text-slate-950' : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {endemicOnly ? '✓' : ''}
                  </div>
                </button>
              </div>
            </div>

            {/* COLUNA DIREITA: CATÁLOGO DE ESPÉCIES NO FILTRO ATUAL */}
            <div className="pt-2 md:pt-0 md:border-l md:border-slate-800/80 md:pl-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>Espécies no Filtro Atual:</span>
                  <strong className="text-emerald-300 font-mono font-black">{filteredCatalog.length}</strong>
                </span>
                <span className="text-[11px] text-slate-400">Clique para abrir UF</span>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  isExpanded ? 'sm:grid-cols-2 gap-2 max-h-[380px]' : 'gap-1.5 max-h-52'
                } overflow-y-auto custom-scrollbar pr-1`}
              >
                {filteredCatalog.map((s) => {
                  const iucnInfo = IUCN_STATUS_LABELS[s.iucnStatus];
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        audioEngine.playSfx('click');
                        if (s.states[0]) onOpenStateDetails(s.states[0]);
                      }}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-400/80 flex items-center justify-between cursor-pointer group transition-all hover:bg-slate-850"
                      title={`Ver espécime no estado ${s.states.join(', ')}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-emerald-400 shrink-0 bg-slate-950 shadow-md">
                          <BiodiversityImage
                            src={s.thumbnailUrl || s.imageUrl}
                            alt={s.namePt}
                            kingdom={s.kingdom}
                            fallbackSrc={s.imageUrl}
                            size="thumb"
                            isCircularMask={true}
                            containerClassName="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-xs text-white truncate group-hover:text-emerald-300">
                            {s.namePt}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono italic truncate">
                            {s.scientificName} • <span className="text-slate-300 not-italic">{s.states.slice(0, 3).join(', ')}{s.states.length > 3 ? '...' : ''}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-black shrink-0 ${iucnInfo.colorBg} ${iucnInfo.colorText} ${iucnInfo.colorBorder}`}
                      >
                        {s.iucnStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Footer com Status do Filtro */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/95 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div>
              <span>Mapa populado com: </span>
              <strong className="text-emerald-300 font-black">{filteredCatalog.length} espécimes</strong>
            </div>

            {selectedStateId && (
              <button
                onClick={() => onOpenStateDetails(selectedStateId)}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500 hover:text-slate-950 transition font-bold cursor-pointer"
              >
                Focar UF: {selectedStateId}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
