import React, { useState, useMemo } from 'react';
import { UserProgress, Language } from '../types';
import { GUARDIANS_DATA } from '../data/guardiansData';
import {
  getAllCulturalItems,
  getCulturalItemsForState,
  CulturalItem,
} from '../data/culturalInventoryData';
import { calculateLevel } from '../lib/storage';
import { audioEngine } from '../lib/audioSynth';
import { GuardianItemReadingModal } from './guardian/GuardianItemReadingModal';
import { ItemVectorIcon } from './guardian/GuardianCommon';
import {
  Shield,
  Lock,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Search,
  Package,
  Scroll,
  Crown,
  Swords,
  Compass,
  Trophy,
  Flame,
  Trees,
  MapPin,
  ChevronRight,
  ExternalLink,
  Filter,
  Check,
  Zap,
  GraduationCap,
  Landmark,
  Layers,
  ArrowRight,
  Eye,
  Star,
} from 'lucide-react';

interface Props {
  progress: UserProgress;
  lang: Language;
  onNavigateToState?: (stateId: string) => void;
  onReadRelic?: (relicId: string, xpEarned: number) => void;
  onBackToMap?: () => void;
}

/**
 * Ícone Moderno Vetorial para as Insígnias Sagradas dos Estados
 */
const StateInsigniaIcon: React.FC<{
  stateId: string;
  isUnlocked: boolean;
  className?: string;
}> = ({ stateId, isUnlocked, className = 'w-6 h-6' }) => {
  if (!isUnlocked) {
    return <Lock className={`${className} text-slate-500`} />;
  }

  switch (stateId) {
    case 'RS':
      return <Shield className={`${className} text-amber-300`} />;
    case 'AM':
      return <Trees className={`${className} text-emerald-300`} />;
    case 'PA':
      return <Compass className={`${className} text-cyan-300`} />;
    case 'BA':
      return <Crown className={`${className} text-yellow-300`} />;
    case 'MG':
      return <Landmark className={`${className} text-amber-300`} />;
    case 'RJ':
      return <Award className={`${className} text-yellow-300`} />;
    case 'SP':
      return <Swords className={`${className} text-rose-300`} />;
    case 'PE':
      return <Sparkles className={`${className} text-purple-300`} />;
    case 'CE':
      return <Flame className={`${className} text-orange-300`} />;
    case 'DF':
      return <Crown className={`${className} text-amber-300`} />;
    case 'PR':
      return <Trees className={`${className} text-emerald-300`} />;
    case 'SC':
      return <Compass className={`${className} text-sky-300`} />;
    case 'GO':
      return <Landmark className={`${className} text-amber-300`} />;
    case 'MT':
    case 'MS':
      return <Trees className={`${className} text-emerald-300`} />;
    default:
      return <Shield className={`${className} text-amber-300`} />;
  }
};

export const CodexInsignias: React.FC<Props> = ({
  progress,
  lang,
  onNavigateToState,
  onReadRelic,
  onBackToMap,
}) => {
  // Navigation tabs inside Santuário
  const [activeSubTab, setActiveSubTab] = useState<'insignias' | 'bau' | 'estatisticas'>('insignias');

  // Filters for Insignias tab
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filters for Chest/Relics tab
  const [relicCategoryFilter, setRelicCategoryFilter] = useState<string>('all');
  const [relicStateFilter, setRelicStateFilter] = useState<string>('all');
  const [relicRarityFilter, setRelicRarityFilter] = useState<string>('all');

  // Active item for Reading Modal
  const [readingItem, setReadingItem] = useState<{
    item: CulturalItem;
    guardianName: string;
  } | null>(null);

  // Level & XP calculations
  const { level, titlePt, currentXpInLevel, xpForNextLevel } = calculateLevel(progress.xp);
  const xpPercentage = Math.min(100, Math.round((currentXpInLevel / xpForNextLevel) * 100));

  // All cultural relics from all states
  const allRelics = useMemo(() => getAllCulturalItems(), []);

  // Stats
  const unlockedInsigniasCount = progress.unlockedInsigniaIds.length;
  const readRelicsCount = progress.readPergamentIds.length;
  const totalRelicsCount = allRelics.length;
  const relicsXpEarned = readRelicsCount * 50;
  const quizXpEarned = progress.completedStateIds.length * 300;

  // Filtered Guardians for Insignias Tab
  const filteredGuardians = useMemo(() => {
    return GUARDIANS_DATA.filter((g) => {
      const matchesRegion = regionFilter === 'all' || g.regionId === regionFilter;
      const isUnlocked = progress.unlockedInsigniaIds.includes(g.id);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unlocked' && isUnlocked) ||
        (statusFilter === 'locked' && !isUnlocked);

      const matchesSearch =
        g.stateNamePt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.guardianTitlePt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.insigniaNamePt.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesRegion && matchesStatus && matchesSearch;
    });
  }, [regionFilter, statusFilter, searchTerm, progress.unlockedInsigniaIds]);

  // Filtered Relics for Chest Tab
  const filteredRelics = useMemo(() => {
    return allRelics.filter((item) => {
      const matchesCategory = relicCategoryFilter === 'all' || item.category === relicCategoryFilter;
      const matchesState = relicStateFilter === 'all' || item.stateId === relicStateFilter;
      const matchesRarity = relicRarityFilter === 'all' || item.rarity === relicRarityFilter;
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stateId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesState && matchesRarity && matchesSearch;
    });
  }, [allRelics, relicCategoryFilter, relicStateFilter, relicRarityFilter, searchTerm]);

  // Regional breakdown statistics
  const regionsStats = useMemo(() => {
    const regions = [
      { id: 'norte', name: 'Região Norte', total: 7 },
      { id: 'nordeste', name: 'Região Nordeste', total: 9 },
      { id: 'centro_oeste', name: 'Região Centro-Oeste', total: 4 },
      { id: 'sudeste', name: 'Região Sudeste', total: 4 },
      { id: 'sul', name: 'Região Sul', total: 3 },
    ];

    return regions.map((reg) => {
      const guardiansInRegion = GUARDIANS_DATA.filter((g) => g.regionId === reg.id);
      const unlockedInRegion = guardiansInRegion.filter((g) =>
        progress.unlockedInsigniaIds.includes(g.id)
      ).length;
      return {
        ...reg,
        unlocked: unlockedInRegion,
        percent: Math.round((unlockedInRegion / reg.total) * 100),
      };
    });
  }, [progress.unlockedInsigniaIds]);

  // Handle travel/navigate to state
  const handleTravelToState = (stateId: string) => {
    audioEngine.playSfx('click');
    if (onNavigateToState) {
      onNavigateToState(stateId);
    } else {
      window.location.hash = `#/estado/${stateId.toLowerCase()}`;
    }
  };

  // Open Relic Reader Modal
  const handleOpenRelicReader = (item: CulturalItem) => {
    audioEngine.playSfx('click');
    const guardian = GUARDIANS_DATA.find((g) => g.id === item.stateId);
    setReadingItem({
      item,
      guardianName: guardian ? guardian.guardianName : 'Guardião da Tradição',
    });
  };

  // Complete Reading and award XP
  const handleCompleteRelicReading = (itemId: string, xpEarned: number) => {
    if (onReadRelic) {
      onReadRelic(itemId, xpEarned);
    }
  };

  return (
    <div
      id="container-santuario-insignias"
      className="container-santuario-insignias flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-slate-900 bg-slate-950 p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 select-none"
    >
      
      {/* 1. Hero Banner Principal: Santuário & Grande Baú de Relíquias da Nação */}
      <section
        id="painel-hero-santuario"
        className="painel-hero-santuario relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 border-2 border-amber-500/50 shadow-2xl p-4 sm:p-6"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Informações de Título e Narrativa */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-acervo-nacional inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/50 px-3 py-0.5 rounded-full text-xs font-serif font-bold tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Santuário da Pátria & Acervo dos 27 Estados
              </span>
              <span className="badge-grau-mestre bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-serif font-bold">
                Nível {level} • {titlePt}
              </span>
            </div>

            <h1 className="titulo-santuario font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-wide">
              Santuário das Insígnias & Baú de Relíquias
            </h1>

            <p className="descricao-santuario text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
              Consulte as 27 Insígnias Sagradas restauradas nos Desafios de Honra (+300 XP cada) e explore os manuscritos, culinária e lendas ancestrais no Grande Baú de Relíquias (+50 XP por estudo).
            </p>
          </div>

          {/* Placar de Pontuação & Conquistas */}
          <div
            id="painel-estatisticas-pontuacao"
            className="painel-estatisticas-pontuacao grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto shrink-0"
          >
            {/* Insígnias */}
            <div className="card-estatistica-insignias bg-slate-950/90 border border-amber-500/40 rounded-2xl p-3 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-serif font-bold mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Insígnias</span>
              </div>
              <div className="font-serif font-black text-xl sm:text-2xl text-white">
                {unlockedInsigniasCount} <span className="text-xs text-slate-500 font-normal">/ 27</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
                  style={{ width: `${(unlockedInsigniasCount / 27) * 100}%` }}
                />
              </div>
            </div>

            {/* Baú de Relíquias */}
            <div className="card-estatistica-bau bg-slate-950/90 border border-amber-500/40 rounded-2xl p-3 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-serif font-bold mb-1">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Baú Estudado</span>
              </div>
              <div className="font-serif font-black text-xl sm:text-2xl text-white">
                {readRelicsCount} <span className="text-xs text-slate-500 font-normal">/ {totalRelicsCount}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (readRelicsCount / (totalRelicsCount || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* XP Total */}
            <div className="card-estatistica-xp bg-slate-950/90 border border-amber-500/40 rounded-2xl p-3 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-serif font-bold mb-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Total XP</span>
              </div>
              <div className="font-serif font-black text-xl sm:text-2xl text-amber-300 font-mono">
                {progress.xp}
              </div>
              <div className="text-[10px] text-slate-400 font-serif mt-0.5">
                Nível {level}
              </div>
            </div>

            {/* Quizzes Vencidos */}
            <div className="card-estatistica-quizzes bg-slate-950/90 border border-amber-500/40 rounded-2xl p-3 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-serif font-bold mb-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Desafios</span>
              </div>
              <div className="font-serif font-black text-xl sm:text-2xl text-emerald-300">
                {progress.completedStateIds.length} <span className="text-xs text-slate-500 font-normal">est.</span>
              </div>
              <div className="text-[10px] text-slate-400 font-serif mt-0.5">
                {progress.totalCorrectAnswers} acertos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Menu de Navegação por Sub-Abas do Santuário */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
        {/* Abas */}
        <nav
          id="menu-abas-santuario"
          className="menu-abas-santuario flex items-center gap-2 overflow-x-auto scrollbar-none"
        >
          <button
            id="btn-subaba-insignias"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('insignias');
            }}
            className={`btn-subaba-insignias px-3.5 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition cursor-pointer border shrink-0 ${
              activeSubTab === 'insignias'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-amber-200 border-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>27 Insígnias Sagradas</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950/50 text-amber-300">
              {unlockedInsigniasCount}/27
            </span>
          </button>

          <button
            id="btn-subaba-bau"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('bau');
            }}
            className={`btn-subaba-bau px-3.5 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition cursor-pointer border shrink-0 ${
              activeSubTab === 'bau'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-amber-200 border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Grande Baú de Relíquias</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950/50 text-amber-300">
              +{relicsXpEarned} XP
            </span>
          </button>

          <button
            id="btn-subaba-estatisticas"
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('estatisticas');
            }}
            className={`btn-subaba-estatisticas px-3.5 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition cursor-pointer border shrink-0 ${
              activeSubTab === 'estatisticas'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-amber-200 border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Honra & Regiões</span>
          </button>
        </nav>

        {/* Botão de Atalho Rápido para Voltar ao Mapa */}
        {onBackToMap ? (
          <button
            onClick={onBackToMap}
            className="btn-atalho-mapa flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/40 hover:border-amber-400 text-xs font-serif font-bold transition shadow cursor-pointer shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Voltar ao Mapa do Brasil</span>
          </button>
        ) : (
          <button
            onClick={() => {
              window.location.hash = '#/map';
            }}
            className="btn-atalho-mapa flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/40 hover:border-amber-400 text-xs font-serif font-bold transition shadow cursor-pointer shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Voltar ao Mapa do Brasil</span>
          </button>
        )}
      </div>

      {/* 3. ABA 1: AS 27 INSÍGNIAS SAGRADAS DOS ESTADOS */}
      {activeSubTab === 'insignias' && (
        <section id="secao-insignias-estados" className="secao-insignias-estados space-y-4">
          
          {/* Barra de Filtros e Busca de Insígnias */}
          <div className="painel-filtros-insignias flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-amber-500/30">
            {/* Filtro por Região */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-amber-300 font-serif font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Região:
              </span>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'norte', label: 'Norte' },
                { id: 'nordeste', label: 'Nordeste' },
                { id: 'centro_oeste', label: 'Centro-Oeste' },
                { id: 'sudeste', label: 'Sudeste' },
                { id: 'sul', label: 'Sul' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setRegionFilter(r.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition cursor-pointer border ${
                    regionFilter === r.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Filtro por Status e Campo de Busca */}
            <div className="flex items-center gap-2">
              {/* Status */}
              <div className="flex items-center bg-slate-950 rounded-xl p-0.5 border border-slate-800">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-serif font-bold transition ${
                    statusFilter === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({GUARDIANS_DATA.length})
                </button>
                <button
                  onClick={() => setStatusFilter('unlocked')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-serif font-bold transition flex items-center gap-1 ${
                    statusFilter === 'unlocked'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  Conquistadas ({unlockedInsigniasCount})
                </button>
                <button
                  onClick={() => setStatusFilter('locked')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-serif font-bold transition flex items-center gap-1 ${
                    statusFilter === 'locked'
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Pendentes ({27 - unlockedInsigniasCount})
                </button>
              </div>

              {/* Busca por texto */}
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar estado..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Grid de Cards de Insígnias dos 27 Estados */}
          <div
            id="grid-cards-insignias"
            className="grid-cards-insignias grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5"
          >
            {filteredGuardians.map((guardian) => {
              const isUnlocked = progress.unlockedInsigniaIds.includes(guardian.id);
              const isCompleted = progress.completedStateIds.includes(guardian.id);
              const stateRelics = getCulturalItemsForState(guardian.id);
              const readCountForState = stateRelics.filter((r) =>
                progress.readPergamentIds.includes(r.id)
              ).length;

              return (
                <div
                  key={guardian.id}
                  id={`card-insignia-${guardian.id.toLowerCase()}`}
                  className={`card-insignia-estado relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-400/60 shadow-xl shadow-amber-500/10 hover:border-amber-300'
                      : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Top Glow Decorativo */}
                  {isUnlocked && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
                  )}

                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* Cabeçalho do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Brasão / Ícone do Estado */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
                            isUnlocked
                              ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-amber-400/80 shadow-md'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <StateInsigniaIcon
                            stateId={guardian.id}
                            isUnlocked={isUnlocked}
                            className="w-6 h-6"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="nome-estado-card font-serif font-black text-base text-white group-hover:text-amber-300 transition-colors">
                              {guardian.stateNamePt}
                            </h3>
                            <span className="sigla-estado text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-950 text-amber-400 border border-slate-800">
                              {guardian.id}
                            </span>
                          </div>
                          <p className="titulo-guardiao-card text-xs text-slate-400 font-serif">
                            {guardian.guardianName} • {guardian.guardianTitlePt}
                          </p>
                        </div>
                      </div>

                      {/* Badge de Status de Desbloqueio */}
                      <div>
                        {isUnlocked ? (
                          <span className="badge-status-insignia inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-[10px] font-serif font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Conquistada
                          </span>
                        ) : (
                          <span className="badge-status-insignia inline-flex items-center gap-1 bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-serif font-bold px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3 text-slate-500" />
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Detalhes da Insígnia Sagrada */}
                    <div
                      className={`p-3 rounded-xl border space-y-1.5 ${
                        isUnlocked
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-950/70 border-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>{guardian.insigniaNamePt}</span>
                        </div>
                        <span className="text-[10px] font-serif font-bold text-yellow-400/90 bg-slate-950/80 px-1.5 py-0.2 rounded border border-amber-500/20">
                          +300 XP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-serif leading-relaxed line-clamp-2">
                        {guardian.insigniaDescPt}
                      </p>
                    </div>

                    {/* Resumo do Baú de Relíquias do Estado */}
                    <div className="flex items-center justify-between text-xs font-serif text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        <span>Baú Cultural:</span>
                        <strong className="text-slate-200">
                          {readCountForState}/{stateRelics.length} estudados
                        </strong>
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {guardian.capitalPt}
                      </span>
                    </div>
                  </div>

                  {/* Rodapé do Card com Ações Diretas */}
                  <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handleTravelToState(guardian.id)}
                      className="btn-acao-viajar-estado flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
                      title={`Viajar para ${guardian.stateNamePt} e interagir com ${guardian.guardianName}`}
                    >
                      <Swords className="w-3.5 h-3.5 text-slate-950" />
                      <span>{isUnlocked ? 'Revisitar Estado' : 'Viajar & Desafiar'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {stateRelics.length > 0 && (
                      <button
                        onClick={() => {
                          audioEngine.playSfx('click');
                          setRelicStateFilter(guardian.id);
                          setActiveSubTab('bau');
                        }}
                        className="btn-ver-bau-estado p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer"
                        title={`Ver todas as relíquias do Baú de ${guardian.stateNamePt}`}
                      >
                        <Package className="w-4 h-4 text-amber-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGuardians.length === 0 && (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="font-serif font-bold text-base text-slate-300">
                Nenhum guardião ou insígnia encontrada com os filtros selecionados.
              </h4>
              <p className="text-xs text-slate-500 font-serif">
                Tente redefinir os filtros de região ou o termo de busca.
              </p>
            </div>
          )}
        </section>
      )}

      {/* 4. ABA 2: O GRANDE BAÚ DE RELÍQUIAS DA NAÇÃO */}
      {activeSubTab === 'bau' && (
        <section id="secao-grande-bau-reliquias" className="secao-grande-bau-reliquias space-y-4">
          
          {/* Header e Filtros do Baú */}
          <div className="painel-filtros-bau flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 shadow-lg">
            
            {/* Categorias de Relíquias */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-amber-300 font-serif font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Categoria:
              </span>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'culinaria', label: 'Gastronomia' },
                { id: 'historia', label: 'História & Documentos' },
                { id: 'fauna_flora', label: 'Fauna & Flora' },
                { id: 'tradicoes', label: 'Festas & Música' },
                { id: 'personagens', label: 'Heróis' },
                { id: 'geografia', label: 'Patrimônio' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setRelicCategoryFilter(c.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition cursor-pointer border ${
                    relicCategoryFilter === c.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Filtro por Estado e Busca */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={relicStateFilter}
                onChange={(e) => setRelicStateFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-serif focus:outline-none cursor-pointer"
              >
                <option value="all">Todos os Estados (27)</option>
                {GUARDIANS_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.stateNamePt} ({g.id})
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-44">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar relíquia..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Grid de Relíquias do Baú */}
          <div
            id="grid-cards-reliquias"
            className="grid-cards-reliquias grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
          >
            {filteredRelics.map((item) => {
              const isRead = progress.readPergamentIds.includes(item.id);
              const guardian = GUARDIANS_DATA.find((g) => g.id === item.stateId);

              return (
                <div
                  key={item.id}
                  id={`card-reliquia-${item.id}`}
                  onClick={() => handleOpenRelicReader(item)}
                  className={`card-reliquia-bau relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-4 cursor-pointer group ${
                    isRead
                      ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-lg'
                      : 'bg-slate-900/50 border-amber-500/30 hover:border-amber-400 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Ícone Vetorial e Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                          <ItemVectorIcon
                            itemId={item.id}
                            category={item.category}
                            className="w-5 h-5"
                          />
                        </div>

                        <div>
                          <span className="categoria-reliquia text-[10px] uppercase tracking-wider font-serif font-bold text-amber-400">
                            {item.categoryLabel}
                          </span>
                          <h4 className="titulo-reliquia font-serif font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {/* Status de Leitura */}
                      {isRead ? (
                        <span className="badge-lido inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-[10px] font-serif font-bold px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Estudado (+50 XP)
                        </span>
                      ) : (
                        <span className="badge-nao-lido inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-serif font-bold px-2 py-0.5 rounded-full shrink-0">
                          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                          +50 XP
                        </span>
                      )}
                    </div>

                    {/* Descrição Curta */}
                    <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-3">
                      {item.shortDesc}
                    </p>

                    {/* Citação do Guardião ou Fonte */}
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-serif italic">
                      {item.guardianQuote || item.curiosity}
                    </div>
                  </div>

                  {/* Rodapé do Card */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-serif">
                    <span className="text-amber-400/90 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {guardian ? guardian.stateNamePt : item.stateId} ({item.stateId})
                    </span>

                    <span className="text-slate-400 group-hover:text-amber-300 flex items-center gap-1 text-[11px] font-bold transition-colors">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isRead ? 'Reler Dossiê' : 'Estudar Relíquia'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRelics.length === 0 && (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
              <Package className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="font-serif font-bold text-base text-slate-300">
                Nenhuma relíquia cultural encontrada com estes filtros.
              </h4>
              <p className="text-xs text-slate-500 font-serif">
                Selecione "Todas as Categorias" ou "Todos os Estados".
              </p>
            </div>
          )}
        </section>
      )}

      {/* 5. ABA 3: PAINEL DE HONRA, PONTUAÇÃO & PROGRESSO REGIONAL */}
      {activeSubTab === 'estatisticas' && (
        <section id="secao-honra-estatisticas" className="secao-honra-estatisticas space-y-6">
          
          {/* Card Nobre de Nível e Título */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-5 rounded-3xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl font-serif font-black text-amber-300 shrink-0 shadow-lg shadow-amber-500/20">
                {level}
              </div>
              <div>
                <span className="text-xs text-amber-400 font-serif font-bold uppercase tracking-wider">
                  Patente & Título Honorífico
                </span>
                <h3 className="font-serif font-black text-2xl text-white">
                  {titlePt}
                </h3>
                <p className="text-xs text-slate-300 font-serif">
                  Você acumulou <strong className="text-amber-300">{progress.xp} XP</strong> ao longo da sua jornada patriótica pelos estados do Brasil.
                </p>
              </div>
            </div>

            {/* Barra de Próximo Nível */}
            <div className="w-full md:w-64 space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-serif font-bold">
                <span className="text-slate-400">Progresso do Nível</span>
                <span className="text-amber-400">{xpPercentage}%</span>
              </div>
              <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 text-right font-mono">
                {currentXpInLevel} / {xpForNextLevel} XP para o Nível {level + 1}
              </div>
            </div>
          </div>

          {/* Progresso por Região do Brasil */}
          <div className="space-y-3">
            <h3 className="font-serif font-black text-lg text-amber-300 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Restauração Cultural por Macrorregião Brasileira</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {regionsStats.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-3.5 space-y-2 shadow"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xs text-white">
                      {reg.name}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      {reg.unlocked}/{reg.total}
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
                      style={{ width: `${reg.percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-serif">
                    <span>Completude</span>
                    <span className="font-bold text-slate-200">{reg.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Origem da Pontuação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Desafios de Honra (Quizzes)</span>
              </h4>
              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Cada estado vencido no Desafio de Honra rende <strong className="text-amber-300">+300 XP</strong> e a respectiva Insígnia Sagrada.
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                <span className="text-slate-400">Estados Concluídos:</span>
                <strong className="text-white font-mono">{progress.completedStateIds.length} estados</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                <span className="text-slate-400">XP de Desafios:</span>
                <strong className="text-yellow-400 font-mono">+{quizXpEarned} XP</strong>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Grande Baú de Relíquias (Leituras)</span>
              </h4>
              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Cada dossiê histórico, culinário ou lenda estudada no Baú confere <strong className="text-cyan-300">+50 XP</strong> de sabedoria.
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                <span className="text-slate-400">Relíquias Estudadas:</span>
                <strong className="text-white font-mono">{readRelicsCount} relíquias</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                <span className="text-slate-400">XP de Sabedoria:</span>
                <strong className="text-cyan-300 font-mono">+{relicsXpEarned} XP</strong>
              </div>
            </div>
          </div>

        </section>
      )}

      {/* 6. Modal de Leitura de Relíquia do Baú */}
      {readingItem && (
        <GuardianItemReadingModal
          item={readingItem.item}
          guardianName={readingItem.guardianName}
          isAlreadyRead={progress.readPergamentIds.includes(readingItem.item.id)}
          onClose={() => setReadingItem(null)}
          onCompleteReading={handleCompleteRelicReading}
        />
      )}

    </div>
  );
};
