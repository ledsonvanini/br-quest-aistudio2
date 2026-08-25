import React, { useState } from 'react';
import {
  Leaf,
  Bug,
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
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'categorias' | 'biomas' | 'catalogo'>('categorias');

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

  return (
    <div
      id="painel-controle-biodiversidade"
      data-scrollable="true"
      className="painel-hud-controles fixed top-[68px] right-2 sm:right-4 z-40 w-[calc(100vw-16px)] sm:w-[380px] bg-slate-950/95 border border-emerald-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl text-slate-100 flex flex-col max-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-300 select-none overflow-hidden pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* 1. Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-black text-sm text-white">
              Catálogo de Biodiversidade
            </h4>
            <p className="text-[10px] text-emerald-300">Fauna • Flora • Fungos • SisCITES</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          title="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Abas do Painel */}
      <div className="flex items-center gap-1 p-2 bg-slate-900/80 border-b border-slate-800/80 text-xs shrink-0">
        <button
          onClick={() => setActiveTab('categorias')}
          className={`flex-1 py-1 rounded-lg font-semibold transition ${
            activeTab === 'categorias'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Reinos
        </button>
        <button
          onClick={() => setActiveTab('biomas')}
          className={`flex-1 py-1 rounded-lg font-semibold transition ${
            activeTab === 'biomas'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Biomas
        </button>
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`flex-1 py-1 rounded-lg font-semibold transition ${
            activeTab === 'catalogo'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Espécies ({filteredCatalog.length})
        </button>
      </div>

      {/* 3. Conteúdo do Painel */}
      <div className="p-3 overflow-y-auto space-y-3 custom-scrollbar flex-1 text-xs">
        
        {/* TAB 1: REINOS & FILTROS */}
        {activeTab === 'categorias' && (
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Filtrar por Reino Biológico</span>
            
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onKingdomChange('all');
                }}
                className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                  activeKingdom === 'all'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Leaf className="w-4 h-4" />
                <span>Todos os Reinos</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onKingdomChange('fauna');
                }}
                className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                  activeKingdom === 'fauna'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Bug className="w-4 h-4" />
                <span>Fauna</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onKingdomChange('flora');
                }}
                className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                  activeKingdom === 'flora'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Trees className="w-4 h-4" />
                <span>Flora</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onKingdomChange('fungi_micro');
                }}
                className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                  activeKingdom === 'fungi_micro'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Fungos & Micro</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critérios de Conservação</span>

              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onToggleThreatenedOnly();
                }}
                className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between ${
                  threatenedOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Livro Vermelho (Ameaçadas CR, EN, VU)</span>
                </span>
                <span className="text-[10px] font-mono">{threatenedOnly ? 'ATIVO' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  onToggleEndemicOnly();
                }}
                className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between ${
                  endemicOnly
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Apenas Espécies Endêmicas do Brasil</span>
                </span>
                <span className="text-[10px] font-mono">{endemicOnly ? 'ATIVO' : 'OFF'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BIOMAS BRASILEIROS */}
        {activeTab === 'biomas' && (
          <div className="space-y-2">
            <button
              onClick={() => {
                audioEngine.playSfx('click');
                onBiomeChange('all');
              }}
              className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between ${
                activeBiome === 'all'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <span>Todos os Biomas Brasileiros</span>
              <span className="text-[10px] font-mono">{ALL_BRAZIL_SPECIMENS.length} espécimes</span>
            </button>

            {biomes.map((b) => (
              <button
                key={b}
                onClick={() => {
                  audioEngine.playSfx('click');
                  onBiomeChange(b);
                }}
                className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between ${
                  activeBiome === b
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: BIOME_COLORS[b].primary }}
                  />
                  <span>{b}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {ALL_BRAZIL_SPECIMENS.filter((s) => s.biomes.includes(b)).length} espécimes
                </span>
              </button>
            ))}
          </div>
        )}

        {/* TAB 3: CATÁLOGO COMPLETO DE ESPÉCIES */}
        {activeTab === 'catalogo' && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredCatalog.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    audioEngine.playSfx('click');
                    if (s.states[0]) onOpenStateDetails(s.states[0]);
                  }}
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BiodiversityImage
                      src={s.thumbnailUrl || s.imageUrl}
                      alt={s.namePt}
                      kingdom={s.kingdom}
                      fallbackSrc={s.imageUrl}
                      containerClassName="w-8 h-8 rounded-lg border border-slate-700 shrink-0"
                      className="w-full h-full object-cover"
                    />
                    <div className="min-w-0">
                      <h5 className="font-serif font-bold text-xs text-white truncate group-hover:text-emerald-300">
                        {s.namePt}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-mono italic truncate">
                        {s.scientificName}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-bold shrink-0 ${IUCN_STATUS_LABELS[s.iucnStatus].colorBg} ${IUCN_STATUS_LABELS[s.iucnStatus].colorText} ${IUCN_STATUS_LABELS[s.iucnStatus].colorBorder}`}>
                    {s.iucnStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer com Estado Selecionado */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>Estado ativo: <strong className="text-emerald-300">{selectedStateId || 'Brasil'}</strong></span>
        {selectedStateId && (
          <button
            onClick={() => onOpenStateDetails(selectedStateId)}
            className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition font-bold"
          >
            Abrir UF
          </button>
        )}
      </div>
    </div>
  );
};
