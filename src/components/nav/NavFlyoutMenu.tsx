import React from 'react';
import {
  Thermometer,
  SunMedium,
  Wind,
  CloudRain,
  Activity,
  Telescope,
  Bird,
  Trees,
  Leaf,
  BookOpen,
  Layers,
  Users,
  Percent,
  Building2,
  Baby,
  HeartPulse,
  GraduationCap,
  Vote,
  Flag,
  Landmark,
  Radio,
  Music,
  Flame,
  Award,
  Globe,
  Moon,
  Cloud,
  Eye,
  Crosshair,
  Mountain,
  Sun,
  Scroll,
  Trophy,
} from 'lucide-react';
import { ClimateMode } from '../map/ClimatePhenomenaLayer';
import { TerrainTileProvider, MapVisualStyle, BiodiversityKingdom } from '../../types';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import { QuestThemePillar } from '../../data/brQuestQuestionsData';
import { AppMainMode, MenuTooltipInfo } from '../TopGlobalNavMenu';

interface NavFlyoutMenuProps {
  openFlyoutMode: AppMainMode;
  flyoutPos: { top: number; arrowTop: number } | null;
  flyoutRef: React.RefObject<HTMLDivElement>;
  handleSelectSubitem: (action: () => void) => void;
  bindTooltip: (info: MenuTooltipInfo) => any;
  // Clima
  climateMode: ClimateMode;
  handleSmartClimateModeChange: (mode: ClimateMode) => void;
  isObservatorioOpen?: boolean;
  onToggleObservatorio?: () => void;
  // Biodiversidade
  biodiversityKingdom?: BiodiversityKingdom | 'all';
  onBiodiversityKingdomChange?: (kingdom: BiodiversityKingdom | 'all') => void;
  isBiodiversityThreatenedOnly?: boolean;
  onToggleBiodiversityThreatenedOnly?: () => void;
  isBiodiversityPanelOpen?: boolean;
  onToggleBiodiversityPanel?: () => void;
  // Geopolítica
  geopoliticaMetric?: GeopoliticaMetricKey;
  onGeopoliticaMetricChange?: (metric: GeopoliticaMetricKey) => void;
  showNeighbors?: boolean;
  onToggleNeighbors?: () => void;
  isGeopoliticaPanelOpen?: boolean;
  onToggleGeopoliticaPanel?: () => void;
  // Música
  activeMusicCategory?: 'state_anthems' | 'top5' | 'national';
  onSelectMusicCategory?: (category: 'state_anthems' | 'top5' | 'national') => void;
  isRadioOpen?: boolean;
  onToggleRadio?: () => void;
  // Globo 3D
  globeTextureMode?: 'nasa_satellite' | 'night_lights' | 'natural_earth';
  onGlobeTextureModeChange?: (mode: 'nasa_satellite' | 'night_lights' | 'natural_earth') => void;
  isGlobeCloudsActive?: boolean;
  onToggleGlobeClouds?: () => void;
  isGlobeAutoRotateActive?: boolean;
  onToggleGlobeAutoRotate?: () => void;
  isGlobeBordersActive?: boolean;
  onToggleGlobeBorders?: () => void;
  globePinMode?: 'all' | 'compact' | 'none';
  onGlobePinModeChange?: (mode: 'all' | 'compact' | 'none') => void;
  onResetGlobeCamera?: () => void;
  // Aventura & Desafios BrQuest
  visualStyle?: MapVisualStyle;
  onVisualStyleChange?: (style: MapVisualStyle) => void;
  terrainProvider?: TerrainTileProvider;
  onTerrainProviderChange?: (provider: TerrainTileProvider) => void;
  selectedRegionFilter?: string;
  onSelectRegionFilter?: (regionId: string) => void;
  onHoverRegionFilter?: (regionId: string | null) => void;
  setHoveredMenuTooltip: React.Dispatch<React.SetStateAction<MenuTooltipInfo | null>>;
  onNavigateToSanctuary?: () => void;
  onOpenBrQuestHub?: (pillar?: QuestThemePillar | 'nacional') => void;
  playerLevel?: number;
  playerXp?: number;
}

export const NavFlyoutMenu: React.FC<NavFlyoutMenuProps> = ({
  openFlyoutMode,
  flyoutPos,
  flyoutRef,
  handleSelectSubitem,
  bindTooltip,
  climateMode,
  handleSmartClimateModeChange,
  isObservatorioOpen,
  onToggleObservatorio,
  biodiversityKingdom = 'all',
  onBiodiversityKingdomChange,
  isBiodiversityThreatenedOnly = false,
  onToggleBiodiversityThreatenedOnly,
  isBiodiversityPanelOpen,
  onToggleBiodiversityPanel,
  geopoliticaMetric = 'miscigenacao',
  onGeopoliticaMetricChange,
  showNeighbors = false,
  onToggleNeighbors,
  isGeopoliticaPanelOpen,
  onToggleGeopoliticaPanel,
  activeMusicCategory = 'state_anthems',
  onSelectMusicCategory,
  isRadioOpen = true,
  onToggleRadio,
  globeTextureMode = 'nasa_satellite',
  onGlobeTextureModeChange,
  isGlobeCloudsActive = true,
  onToggleGlobeClouds,
  isGlobeAutoRotateActive = false,
  onToggleGlobeAutoRotate,
  isGlobeBordersActive = true,
  onToggleGlobeBorders,
  globePinMode = 'all',
  onGlobePinModeChange,
  onResetGlobeCamera,
  visualStyle = 'tiles',
  onVisualStyleChange,
  terrainProvider = 'shaded_relief',
  onTerrainProviderChange,
  selectedRegionFilter = 'todos',
  onSelectRegionFilter,
  onHoverRegionFilter,
  setHoveredMenuTooltip,
  onNavigateToSanctuary,
  onOpenBrQuestHub,
  playerLevel = 1,
  playerXp = 0,
}) => {
  const getThemeConfig = (mode: AppMainMode) => {
    switch (mode) {
      case 'clima':
        return {
          border: 'border-orange-500/50',
          shadow: 'shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(249,115,22,0.25)]',
          arrowBorder: 'rgba(249,115,22,0.6)',
          divider: 'bg-orange-500/25',
        };
      case 'biodiversidade':
        return {
          border: 'border-emerald-500/50',
          shadow: 'shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(16,185,129,0.25)]',
          arrowBorder: 'rgba(16,185,129,0.6)',
          divider: 'bg-emerald-500/25',
        };
      case 'geopolitica':
        return {
          border: 'border-blue-500/50',
          shadow: 'shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(59,130,246,0.25)]',
          arrowBorder: 'rgba(59,130,246,0.6)',
          divider: 'bg-blue-500/25',
        };
      case 'musicalidades':
        return {
          border: 'border-amber-500/50',
          shadow: 'shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(245,158,11,0.25)]',
          arrowBorder: 'rgba(245,158,11,0.6)',
          divider: 'bg-amber-500/25',
        };
      case 'globo3d':
        return {
          border: 'border-indigo-500/50',
          shadow: 'shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(99,102,241,0.25)]',
          arrowBorder: 'rgba(99,102,241,0.6)',
          divider: 'bg-indigo-500/25',
        };
      case 'aventura':
      default:
        return {
          border: 'border-teal-500/50',
          shadow: 'shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(20,184,166,0.25)]',
          arrowBorder: 'rgba(20,184,166,0.6)',
          divider: 'bg-teal-500/25',
        };
    }
  };

  const theme = getThemeConfig(openFlyoutMode);

  const getModeHeader = () => {
    switch (openFlyoutMode) {
      case 'clima':
        return { title: 'Clima & Atmosfera', subtitle: 'Tempo Real & Modelos ECMWF' };
      case 'biodiversidade':
        return { title: 'Biodiversidade', subtitle: 'Fauna, Flora & Livro Vermelho' };
      case 'geopolitica':
        return { title: 'Geopolítica & Demografia', subtitle: 'IBGE Censo 2022 & Saúde' };
      case 'musicalidades':
        return { title: 'Musicalidades', subtitle: 'Hinos Cívicos & Rádio Retrô' };
      case 'globo3d':
        return { title: 'Globo 3D Orbital', subtitle: 'Satélites NASA & Fronteiras' };
      case 'aventura':
      default:
        return { title: 'BrQuest • Avaliação', subtitle: 'Clima, Biomas, Geopolítica & Arte' };
    }
  };

  const header = getModeHeader();

  return (
    <div
      id={`flyout-toolbar-${openFlyoutMode}`}
      ref={flyoutRef}
      style={{
        top: flyoutPos ? `${flyoutPos.top}px` : '16px',
      }}
      className={`painel-flyout-vertical painel-flyout-toolbar-${openFlyoutMode} fixed left-[62px] sm:left-[70px] z-50 pointer-events-auto select-none transition-all duration-150 animate-in fade-in zoom-in-95`}
    >
      {/* Seta indicadora de balão de diálogo (Speech Bubble Pointer) apontando para o botão da sidebar */}
      <div
        id="seta-balao-dialogo-flyout"
        className="painel-seta-balao absolute -left-[7px] w-3.5 h-3.5 rotate-45 pointer-events-none z-10"
        style={{
          top: flyoutPos ? `${flyoutPos.arrowTop}px` : '28px',
          transform: 'translateY(-50%) rotate(45deg)',
          backgroundColor: '#020d24',
          borderLeft: `1px solid ${theme.arrowBorder}`,
          borderBottom: `1px solid ${theme.arrowBorder}`,
        }}
      />

      {/* Cartão Balão Desktop com Acrylic Glassmorphism, bordas sutis e sombra profunda */}
      <div
        className={`relative w-64 sm:w-68 p-2.5 bg-[#020d24]/95 backdrop-blur-2xl border ${theme.border} rounded-2xl ${theme.shadow} text-slate-100 flex flex-col gap-1.5 max-h-[calc(100vh-32px)] overflow-y-auto no-scrollbar`}
      >
        {/* Cabeçalho do Balão de Diálogo */}
        <div className="flex items-center justify-between pb-1.5 mb-0.5 border-b border-slate-800/80 px-1 shrink-0">
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-bold text-xs text-amber-300 tracking-wide truncate">
              {header.title}
            </span>
            <span className="font-sans text-[10px] text-slate-400 truncate">
              {header.subtitle}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_8px_#f59e0b] shrink-0" />
        </div>

        {/* Lista de Opções do Submenu */}
        <div className="flex flex-col gap-1">

      {/* ===================================================================== */}
      {/* 1. MODO CLIMA (VERTICAL, SEM NOME REPETIDO)                          */}
      {/* ===================================================================== */}
      {openFlyoutMode === 'clima' && (
        <>
          <button
            id="btn-subitem-clima-temperatura"
            onClick={() => handleSelectSubitem(() => handleSmartClimateModeChange('temperaturas_frentes'))}
            {...bindTooltip({
              title: 'Temperatura & Calor (ECMWF)',
              badge: '-4°C a 36°C',
              badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
              description: 'Mapa térmico coroplético em alta resolução com frentes quentes e frias sobre o Brasil.',
            })}
            className={`btn-subitem-clima w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              climateMode === 'temperaturas_frentes'
                ? 'bg-orange-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-orange-300'
                : 'text-orange-200/80 hover:text-orange-50 hover:bg-orange-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Thermometer className="w-4 h-4 shrink-0" />
              <span className="truncate">Temperatura</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              climateMode === 'temperaturas_frentes' ? 'bg-slate-950/25 text-slate-950' : 'bg-orange-500/20 text-orange-300'
            }`}>
              -4°C a 36°C
            </span>
          </button>

          <button
            id="btn-subitem-clima-previsao"
            onClick={() => handleSelectSubitem(() => handleSmartClimateModeChange('previsao_tempo'))}
            {...bindTooltip({
              title: 'Previsão do Tempo (7 Dias)',
              badge: 'ECMWF / Open-Meteo',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
              description: 'Prognóstico diário, máximas/mínimas previstas e probabilidade de chuva para todos os estados.',
            })}
            className={`btn-subitem-clima w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              climateMode === 'previsao_tempo'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                : 'text-orange-200/80 hover:text-orange-50 hover:bg-orange-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <SunMedium className="w-4 h-4 shrink-0" />
              <span className="truncate">Previsão 7 Dias</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              climateMode === 'previsao_tempo' ? 'bg-slate-950/25 text-slate-950' : 'bg-amber-500/20 text-amber-300'
            }`}>
              ECMWF
            </span>
          </button>

          <button
            id="btn-subitem-clima-ventos"
            onClick={() => handleSelectSubitem(() => handleSmartClimateModeChange('ventos_aliseos'))}
            {...bindTooltip({
              title: 'Ventos Alísios & Rios Voadores',
              badge: 'Vapor Amazônico',
              badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
              description: 'Ativa fluxo de vento em partículas, nuvens volumétricas e ondas marinhas pelo continente.',
            })}
            className={`btn-subitem-clima w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              climateMode === 'ventos_aliseos'
                ? 'bg-orange-400 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-orange-300'
                : 'text-orange-200/80 hover:text-orange-50 hover:bg-orange-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Wind className="w-4 h-4 shrink-0" />
              <span className="truncate">Ventos & Rios</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              climateMode === 'ventos_aliseos' ? 'bg-slate-950/25 text-slate-950' : 'bg-orange-500/20 text-orange-300'
            }`}>
              Vapor
            </span>
          </button>

          <button
            id="btn-subitem-clima-zcas"
            onClick={() => handleSelectSubitem(() => handleSmartClimateModeChange('precipitacao_zcas'))}
            {...bindTooltip({
              title: 'ZCAS & Chuvas Continentais',
              badge: 'Convergência',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
              description: 'Banda diagonal de convergência unindo a Amazônia ao Sudeste com chuva e nuvens carregadas.',
            })}
            className={`btn-subitem-clima w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              climateMode === 'precipitacao_zcas'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                : 'text-orange-200/80 hover:text-orange-50 hover:bg-orange-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <CloudRain className="w-4 h-4 shrink-0" />
              <span className="truncate">ZCAS Chuvas</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              climateMode === 'precipitacao_zcas' ? 'bg-slate-950/25 text-slate-950' : 'bg-amber-500/20 text-amber-300'
            }`}>
              Chuva
            </span>
          </button>

          <button
            id="btn-subitem-clima-elnino"
            onClick={() => handleSelectSubitem(() => handleSmartClimateModeChange('el_nino_la_nina'))}
            {...bindTooltip({
              title: 'El Niño & La Niña (ENSO)',
              badge: 'Oceano Pacífico',
              badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
              description: 'Variação térmica do Pacífico Equatorial que impacta o Semiárido e o Sul do país.',
            })}
            className={`btn-subitem-clima w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              climateMode === 'el_nino_la_nina'
                ? 'bg-rose-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-rose-300'
                : 'text-orange-200/80 hover:text-orange-50 hover:bg-orange-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Activity className="w-4 h-4 shrink-0" />
              <span className="truncate">El Niño / ENSO</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              climateMode === 'el_nino_la_nina' ? 'bg-slate-950/25 text-slate-950' : 'bg-rose-500/20 text-rose-300'
            }`}>
              Pacífico
            </span>
          </button>

          {onToggleObservatorio && (
            <>
              <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />
              <button
                id="btn-subitem-clima-observatorio"
                onClick={() => handleSelectSubitem(() => onToggleObservatorio())}
                {...bindTooltip({
                  title: 'Observatório Ambiental',
                  badge: isObservatorioOpen ? 'Aberto' : 'Recolhido',
                  badgeColor: isObservatorioOpen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700',
                  description: 'Painel de monitoramento meteorológico ao vivo com 27 estações das capitais.',
                })}
                className={`btn-subitem-clima w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer border ${
                  isObservatorioOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md scale-[1.02]'
                    : 'bg-slate-900/80 text-orange-300 border-orange-500/40 hover:bg-orange-950/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Telescope className="w-4 h-4 shrink-0" />
                  <span className="truncate">Observatório</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                  {isObservatorioOpen ? 'Ativo' : 'Painel'}
                </span>
              </button>
            </>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* 2. MODO BIODIVERSIDADE                                                */}
      {/* ===================================================================== */}
      {openFlyoutMode === 'biodiversidade' && (
        <>
          <button
            id="btn-subitem-bio-fauna"
            onClick={() =>
              handleSelectSubitem(() => {
                if (isBiodiversityThreatenedOnly) onToggleBiodiversityThreatenedOnly?.();
                onBiodiversityKingdomChange?.('fauna');
              })
            }
            {...bindTooltip({
              title: 'Fauna Brasileira',
              badge: 'Mamíferos, Aves & Répteis',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
              description: 'Mamíferos, aves, répteis, anfíbios, peixes e invertebrados nativos e endêmicos.',
            })}
            className={`btn-subitem-bio w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              biodiversityKingdom === 'fauna' && !isBiodiversityThreatenedOnly
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                : 'text-emerald-200/80 hover:text-emerald-50 hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Bird className="w-4 h-4 shrink-0" />
              <span className="truncate">Fauna Nativa</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
              Animais
            </span>
          </button>

          <button
            id="btn-subitem-bio-flora"
            onClick={() =>
              handleSelectSubitem(() => {
                if (isBiodiversityThreatenedOnly) onToggleBiodiversityThreatenedOnly?.();
                onBiodiversityKingdomChange?.('flora');
              })
            }
            {...bindTooltip({
              title: 'Flora do Brasil',
              badge: 'Árvores & Flores',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
              description: 'Árvores monumentais, epífitas, orquídeas e cactáceas nativas dos 6 biomas.',
            })}
            className={`btn-subitem-bio w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              biodiversityKingdom === 'flora' && !isBiodiversityThreatenedOnly
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-emerald-300'
                : 'text-emerald-200/80 hover:text-emerald-50 hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Trees className="w-4 h-4 shrink-0" />
              <span className="truncate">Flora do Brasil</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
              Plantas
            </span>
          </button>

          <button
            id="btn-subitem-bio-fungos"
            onClick={() =>
              handleSelectSubitem(() => {
                if (isBiodiversityThreatenedOnly) onToggleBiodiversityThreatenedOnly?.();
                onBiodiversityKingdomChange?.('fungi_micro');
              })
            }
            {...bindTooltip({
              title: 'Fungos & Microbioma',
              badge: 'Micélios & Orelha-de-Pau',
              badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
              description: 'Fungos nativos da floresta tropical e decompositores de matéria orgânica.',
            })}
            className={`btn-subitem-bio w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              biodiversityKingdom === 'fungi_micro' && !isBiodiversityThreatenedOnly
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-cyan-300'
                : 'text-emerald-200/80 hover:text-emerald-50 hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
                <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
                <circle cx="8" cy="8.5" r="1" fill="currentColor" />
              </svg>
              <span className="truncate">Fungos & Micélio</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 shrink-0">
              Fungi
            </span>
          </button>

          <button
            id="btn-subitem-bio-todos"
            onClick={() =>
              handleSelectSubitem(() => {
                if (isBiodiversityThreatenedOnly) onToggleBiodiversityThreatenedOnly?.();
                onBiodiversityKingdomChange?.('all');
              })
            }
            {...bindTooltip({
              title: 'Todos os Reinos Biológicos',
              badge: 'Holístico',
              badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
              description: 'Exibe múltiplos espécimes de fauna, flora e fungos simultaneamente.',
            })}
            className={`btn-subitem-bio w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              biodiversityKingdom === 'all' && !isBiodiversityThreatenedOnly
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-teal-300'
                : 'text-emerald-200/80 hover:text-emerald-50 hover:bg-emerald-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Leaf className="w-4 h-4 shrink-0" />
              <span className="truncate">Todos os Reinos</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 shrink-0">
              Geral
            </span>
          </button>

          <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />

          <button
            id="btn-subitem-bio-ameacadas"
            onClick={() => handleSelectSubitem(() => onToggleBiodiversityThreatenedOnly?.())}
            {...bindTooltip({
              title: 'Livro Vermelho (Espécies Ameaçadas)',
              badge: isBiodiversityThreatenedOnly ? 'Filtro Ativo' : 'Todas',
              badgeColor: isBiodiversityThreatenedOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                : 'bg-slate-800 text-slate-300 border-slate-700',
              description: 'Filtro oficial de espécies ameaçadas segundo o Livro Vermelho MMA/ICMBio.',
            })}
            className={`btn-subitem-bio w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer border ${
              isBiodiversityThreatenedOnly
                ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold shadow-md scale-[1.02]'
                : 'bg-slate-900/80 text-rose-300 border-emerald-500/30 hover:bg-emerald-950/60'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">Livro Vermelho</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
              Ameaçadas
            </span>
          </button>

          {onToggleBiodiversityPanel && (
            <button
              id="btn-subitem-bio-catalogo"
              onClick={() => handleSelectSubitem(() => onToggleBiodiversityPanel())}
              {...bindTooltip({
                title: 'Catálogo de Biodiversidade',
                badge: isBiodiversityPanelOpen ? 'Aberto' : 'Recolhido',
                badgeColor: isBiodiversityPanelOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700',
                description: 'Painel completo com os 6 biomas e catálogo SisCITES do IBAMA.',
              })}
              className={`btn-subitem-bio w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer border ${
                isBiodiversityPanelOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold shadow-md scale-[1.02]'
                  : 'bg-slate-900/80 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">Catálogo Biomas</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                SisCITES
              </span>
            </button>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* 3. MODO GEOPOLÍTICA                                                   */}
      {/* ===================================================================== */}
      {openFlyoutMode === 'geopolitica' && (
        <>
          <button
            id="btn-subitem-geopol-miscigenacao"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('miscigenacao');
              })
            }
            {...bindTooltip({
              title: 'Miscigenação & Composição Étnica',
              badge: 'Censo 2022',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
              description: 'Pardos (45,3%), Brancos (43,5%), Pretos (10,2%), Indígenas e Amarelos.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'miscigenacao' && !showNeighbors
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Miscigenação</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 shrink-0">
              Censo 2022
            </span>
          </button>

          <button
            id="btn-subitem-geopol-genero"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('genero');
              })
            }
            {...bindTooltip({
              title: 'Distribuição por Sexo & Gênero',
              badge: '51,5% Mulheres',
              badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
              description: 'Proporção de mulheres e homens e pirâmide demográfica por estado.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'genero' && !showNeighbors
                ? 'bg-pink-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-pink-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Percent className="w-4 h-4 shrink-0" />
              <span className="truncate">Sexo & Gênero</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-pink-500/20 text-pink-300 shrink-0">
              51,5% F
            </span>
          </button>

          <button
            id="btn-subitem-geopol-densidade"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('densidade');
              })
            }
            {...bindTooltip({
              title: 'Densidade Demográfica & Urbanização',
              badge: 'hab/km²',
              badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
              description: 'Concentração populacional e urbanização por estado.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'densidade' && !showNeighbors
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-sky-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Densidade</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 shrink-0">
              hab/km²
            </span>
          </button>

          <button
            id="btn-subitem-geopol-natalidade"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('natalidade');
              })
            }
            {...bindTooltip({
              title: 'Natalidade & Taxa de Fecundidade',
              badge: 'Nascimentos ‰',
              badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
              description: 'Taxa de natalidade por mil habitantes e filhos por mulher.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'natalidade' && !showNeighbors
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-cyan-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Baby className="w-4 h-4 shrink-0" />
              <span className="truncate">Natalidade</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 shrink-0">
              Fecund.
            </span>
          </button>

          <button
            id="btn-subitem-geopol-mortalidade"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('mortalidade');
              })
            }
            {...bindTooltip({
              title: 'Saúde, Longevidade & Mortalidade',
              badge: 'DataSUS',
              badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
              description: 'Expectativa de vida ao nascer (76,2 anos) e mortalidade infantil.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'mortalidade' && !showNeighbors
                ? 'bg-rose-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-rose-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <HeartPulse className="w-4 h-4 shrink-0" />
              <span className="truncate">Saúde & Longevidade</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 shrink-0">
              76,2 Anos
            </span>
          </button>

          <button
            id="btn-subitem-geopol-analfabetismo"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('analfabetismo');
              })
            }
            {...bindTooltip({
              title: 'Educação & Alfabetização',
              badge: 'PNAD / Censo',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
              description: 'Taxa de alfabetização (94,4% nacional) e anos médios de estudo.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'analfabetismo' && !showNeighbors
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-emerald-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="truncate">Educação</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
              94,4%
            </span>
          </button>

          <button
            id="btn-subitem-geopol-partidos"
            onClick={() =>
              handleSelectSubitem(() => {
                if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                onGeopoliticaMetricChange?.('partidos');
              })
            }
            {...bindTooltip({
              title: 'Governo & Partidos Políticos',
              badge: 'TSE Eleições',
              badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
              description: 'Governadores eleitos e distribuição partidária dos 27 estados.',
            })}
            className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              geopoliticaMetric === 'partidos' && !showNeighbors
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-purple-300'
                : 'text-blue-200/80 hover:text-blue-50 hover:bg-blue-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Vote className="w-4 h-4 shrink-0" />
              <span className="truncate">Partidos & Governo</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 shrink-0">
              Eleições
            </span>
          </button>

          <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />

          {onToggleNeighbors && (
            <button
              id="btn-subitem-geopol-vizinhos"
              onClick={() => handleSelectSubitem(() => onToggleNeighbors())}
              {...bindTooltip({
                title: 'Países Vizinhos & América do Sul',
                badge: showNeighbors ? 'Ativo (Continente)' : 'Oculto (Foco Brasil)',
                badgeColor: showNeighbors
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700',
                description: 'Abre o enquadramento para os 10 países vizinhos da América do Sul.',
              })}
              className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer border ${
                showNeighbors
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md scale-[1.02]'
                  : 'bg-slate-900/80 text-amber-300 border-blue-500/40 hover:bg-blue-950/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Flag className="w-4 h-4 shrink-0" />
                <span className="truncate">América do Sul</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                Vizinhos
              </span>
            </button>
          )}

          {onToggleGeopoliticaPanel && (
            <button
              id="btn-subitem-geopol-painel"
              onClick={() => handleSelectSubitem(() => onToggleGeopoliticaPanel())}
              {...bindTooltip({
                title: 'Observatório Geopolítico',
                badge: isGeopoliticaPanelOpen ? 'Aberto' : 'Recolhido',
                badgeColor: isGeopoliticaPanelOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700',
                description: 'Painel com visões Nacional, Regional e Estadual completa.',
              })}
              className={`btn-subitem-geopol w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer border ${
                isGeopoliticaPanelOpen
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-md scale-[1.02]'
                  : 'bg-slate-900/80 text-cyan-300 border-blue-500/40 hover:bg-blue-950/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Landmark className="w-4 h-4 shrink-0" />
                <span className="truncate">Painel Geopolítico</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                Painel
              </span>
            </button>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* 4. MODO MUSICALIDADES                                                 */}
      {/* ===================================================================== */}
      {openFlyoutMode === 'musicalidades' && (
        <>
          <button
            id="btn-subitem-musica-hinos"
            onClick={() =>
              handleSelectSubitem(() => {
                if (!isRadioOpen) onToggleRadio?.();
                onSelectMusicCategory?.('state_anthems');
              })
            }
            {...bindTooltip({
              title: 'Hinos Oficiais do Estado',
              badge: 'Hinos Cívicos',
              description: 'Hino Oficial do Estado e Hino da Capital Municipal.',
            })}
            className={`btn-subitem-musica w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              activeMusicCategory === 'state_anthems'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                : 'text-amber-200/80 hover:text-amber-50 hover:bg-amber-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">Hinos do Estado</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 shrink-0">
              Oficial
            </span>
          </button>

          <button
            id="btn-subitem-musica-top5"
            onClick={() =>
              handleSelectSubitem(() => {
                if (!isRadioOpen) onToggleRadio?.();
                onSelectMusicCategory?.('top5');
              })
            }
            {...bindTooltip({
              title: 'Top 5 Clássicos Regionais',
              badge: 'Patrimônio Musical',
              badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
              description: 'As 5 canções e ritmos mais representativos da identidade do estado.',
            })}
            className={`btn-subitem-musica w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              activeMusicCategory === 'top5'
                ? 'bg-orange-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-orange-300'
                : 'text-amber-200/80 hover:text-amber-50 hover:bg-amber-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Flame className="w-4 h-4 shrink-0" />
              <span className="truncate">Top 5 Clássicos</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 shrink-0">
              Ritmos
            </span>
          </button>

          <button
            id="btn-subitem-musica-nacionais"
            onClick={() =>
              handleSelectSubitem(() => {
                if (!isRadioOpen) onToggleRadio?.();
                onSelectMusicCategory?.('national');
              })
            }
            {...bindTooltip({
              title: 'Hinos Cívicos Nacionais',
              badge: 'Brasil',
              badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
              description: 'Grandes símbolos cívicos do Brasil: Bandeira, Independência, Proclamação.',
            })}
            className={`btn-subitem-musica w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
              activeMusicCategory === 'national'
                ? 'bg-yellow-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-yellow-300'
                : 'text-amber-200/80 hover:text-amber-50 hover:bg-amber-950/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-4 h-4 shrink-0" />
              <span className="truncate">Hinos Nacionais</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 shrink-0">
              Brasil
            </span>
          </button>

          {onToggleRadio && (
            <>
              <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />
              <button
                id="btn-subitem-musica-gabinete"
                onClick={() => handleSelectSubitem(() => onToggleRadio())}
                {...bindTooltip({
                  title: 'Gabinete do Rádio Retrô',
                  badge: isRadioOpen ? 'Aberto' : 'Oculto',
                  description: 'Exibe ou oculta o aparelho de rádio na tela.',
                })}
                className={`btn-subitem-musica w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer border ${
                  isRadioOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md scale-[1.02]'
                    : 'bg-slate-900/80 text-amber-300 border-amber-500/40 hover:bg-amber-950/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Radio className="w-4 h-4 shrink-0" />
                  <span className="truncate">Aparelho Rádio</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                  {isRadioOpen ? 'Aberto' : 'Oculto'}
                </span>
              </button>
            </>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* 5. MODO GLOBO 3D                                                      */}
      {/* ===================================================================== */}
      {openFlyoutMode === 'globo3d' && (
        <>
          {onGlobeTextureModeChange && (
            <>
              <button
                id="btn-subitem-globo-satellite"
                onClick={() => handleSelectSubitem(() => onGlobeTextureModeChange('nasa_satellite'))}
                {...bindTooltip({
                  title: 'NASA Blue Marble',
                  badge: 'Satélite HD',
                  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
                  description: 'Fotografia orbital de alta precisão capturada pelas missões de satélites da NASA.',
                })}
                className={`btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                  globeTextureMode === 'nasa_satellite'
                    ? 'bg-blue-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-blue-300'
                    : 'text-indigo-200/80 hover:text-indigo-50 hover:bg-indigo-950/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">Satélite NASA HD</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 shrink-0">
                  Dia
                </span>
              </button>

              <button
                id="btn-subitem-globo-night"
                onClick={() => handleSelectSubitem(() => onGlobeTextureModeChange('night_lights'))}
                {...bindTooltip({
                  title: 'Luzes Noturnas da Terra',
                  badge: 'Earth at Night',
                  badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
                  description: 'Metrópoles e polos econômicos iluminados na face noturna do planeta.',
                })}
                className={`btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                  globeTextureMode === 'night_lights'
                    ? 'bg-indigo-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-indigo-300'
                    : 'text-indigo-200/80 hover:text-indigo-50 hover:bg-indigo-950/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Moon className="w-4 h-4 shrink-0" />
                  <span className="truncate">Luzes Noturnas</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 shrink-0">
                  Noite
                </span>
              </button>
            </>
          )}

          <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />

          {onToggleGlobeBorders && (
            <button
              id="btn-subitem-globo-fronteiras"
              onClick={() => handleSelectSubitem(() => onToggleGlobeBorders())}
              {...bindTooltip({
                title: 'Fronteiras Vetoriais Douradas',
                badge: isGlobeBordersActive ? 'Ativo' : 'Inativo',
                description: 'Linhas vetoriais 3D para os 27 estados e América do Sul.',
              })}
              className={`btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                isGlobeBordersActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                  : 'text-indigo-200/80 hover:text-indigo-50 hover:bg-indigo-950/40'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">Fronteiras Ouro</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                {isGlobeBordersActive ? 'Ativo' : 'Off'}
              </span>
            </button>
          )}

          {onToggleGlobeClouds && (
            <button
              id="btn-subitem-globo-nuvens"
              onClick={() => handleSelectSubitem(() => onToggleGlobeClouds())}
              {...bindTooltip({
                title: 'Nuvens Atmosféricas 3D',
                badge: isGlobeCloudsActive ? 'Ativo' : 'Inativo',
                description: 'Massas de nuvens equatoriais e ZCAS em rotação sutil.',
              })}
              className={`btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                isGlobeCloudsActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-cyan-300'
                  : 'text-indigo-200/80 hover:text-indigo-50 hover:bg-indigo-950/40'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Cloud className="w-4 h-4 shrink-0" />
                <span className="truncate">Nuvens 3D</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                {isGlobeCloudsActive ? 'Ativo' : 'Off'}
              </span>
            </button>
          )}

          {onToggleGlobeAutoRotate && (
            <button
              id="btn-subitem-globo-rotacao"
              onClick={() => handleSelectSubitem(() => onToggleGlobeAutoRotate())}
              {...bindTooltip({
                title: 'Rotação Orbital Contínua',
                badge: isGlobeAutoRotateActive ? 'Girando' : 'Pausado',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                description: 'Giro orbital contínuo e suave do Planeta Terra.',
              })}
              className={`btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                isGlobeAutoRotateActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-emerald-300'
                  : 'text-indigo-200/80 hover:text-indigo-50 hover:bg-indigo-950/40'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Activity className="w-4 h-4 shrink-0" />
                <span className="truncate">Auto-Giro</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                {isGlobeAutoRotateActive ? 'Giro' : 'Pausa'}
              </span>
            </button>
          )}

          {onGlobePinModeChange && (
            <button
              id="btn-subitem-globo-brasoes"
              onClick={() =>
                handleSelectSubitem(() =>
                  onGlobePinModeChange(globePinMode === 'all' ? 'compact' : globePinMode === 'compact' ? 'none' : 'all')
                )
              }
              {...bindTooltip({
                title: 'Modo dos Brasões Heráldicos',
                badge: globePinMode === 'all' ? 'Brasões Completos' : globePinMode === 'compact' ? 'Siglas UF' : 'Oculto',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                description: 'Alterna a visualização dos 27 brasões estaduais no globo.',
              })}
              className={`btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                globePinMode === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md scale-[1.02] ring-1 ring-amber-300'
                  : 'text-indigo-200/80 hover:text-indigo-50 hover:bg-indigo-950/40'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="w-4 h-4 shrink-0" />
                <span className="truncate">Brasões Heráldicos</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 shrink-0">
                {globePinMode === 'all' ? 'Completo' : globePinMode === 'compact' ? 'Siglas' : 'Off'}
              </span>
            </button>
          )}

          {onResetGlobeCamera && (
            <>
              <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />
              <button
                id="btn-subitem-globo-reset"
                onClick={() => handleSelectSubitem(() => onResetGlobeCamera())}
                {...bindTooltip({
                  title: 'Centralizar no Brasil',
                  badge: 'Reset Órbita',
                  description: 'Posiciona a câmera orbital centrada na América do Sul e no Brasil.',
                })}
                className="btn-subitem-globo w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl font-medium text-xs text-indigo-300 hover:text-amber-300 hover:bg-indigo-950/60 transition cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Crosshair className="w-4 h-4 shrink-0" />
                  <span className="truncate">Centralizar Brasil</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 shrink-0">
                  Reset
                </span>
              </button>
            </>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* 6. MODO AVENTURA & MAPA (BrQuest & Cartografia)                       */}
      {/* ===================================================================== */}
      {openFlyoutMode === 'aventura' && (
        <>
          {onOpenBrQuestHub && (
            <>
              {/* Prova Geral / Hub */}
              <button
                id="btn-subitem-aventura-brquest-geral"
                onClick={() => handleSelectSubitem(() => onOpenBrQuestHub('nacional'))}
                {...bindTooltip({
                  title: 'Grande Prova do Brasil',
                  badge: '+300 XP • Geral',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                  description: 'Avaliação multidisciplinar com 10 questões sorteadas de todas as regiões e temas do Brasil.',
                })}
                className="btn-subitem-aventura btn-iniciar-brquest w-full flex items-center justify-between gap-2 px-2.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-serif font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition cursor-pointer scale-[1.02] border border-amber-300"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="w-4 h-4 text-slate-950 shrink-0" />
                  <span className="truncate">⚔️ Grande Prova do Brasil</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/30 text-amber-100 shrink-0">
                  Jogar
                </span>
              </button>

              <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />

              {/* 1. Prova Clima & Atmosfera */}
              <button
                id="btn-subitem-aventura-prova-clima"
                onClick={() => handleSelectSubitem(() => onOpenBrQuestHub('clima'))}
                {...bindTooltip({
                  title: 'Prova: Clima & Atmosfera',
                  badge: 'Módulo Clima',
                  badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                  description: 'Avalie seus conhecimentos sobre telemetria ECMWF, frentes frias, Rios Voadores e ZCAS.',
                })}
                className="btn-subitem-aventura w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-teal-200/90 hover:text-cyan-100 hover:bg-cyan-950/40 font-medium text-xs transition cursor-pointer border border-transparent hover:border-cyan-500/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Thermometer className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Prova: Clima & Atmosfera</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 shrink-0">
                  Clima
                </span>
              </button>

              {/* 2. Prova Biodiversidade & Biomas */}
              <button
                id="btn-subitem-aventura-prova-bio"
                onClick={() => handleSelectSubitem(() => onOpenBrQuestHub('biodiversidade'))}
                {...bindTooltip({
                  title: 'Prova: Biodiversidade & Biomas',
                  badge: 'Módulo Bio',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                  description: 'Teste seus conhecimentos sobre a fauna e flora dos 6 biomas brasileiros e espécies ameaçadas do Livro Vermelho.',
                })}
                className="btn-subitem-aventura w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-teal-200/90 hover:text-emerald-100 hover:bg-emerald-950/40 font-medium text-xs transition cursor-pointer border border-transparent hover:border-emerald-500/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Prova: Biodiversidade</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 shrink-0">
                  Biomas
                </span>
              </button>

              {/* 3. Prova Geopolítica & Território */}
              <button
                id="btn-subitem-aventura-prova-geopolitica"
                onClick={() => handleSelectSubitem(() => onOpenBrQuestHub('geopolitica'))}
                {...bindTooltip({
                  title: 'Prova: Geopolítica & Território',
                  badge: 'Módulo IBGE',
                  badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
                  description: 'Desafio sobre dados oficiais do Censo IBGE 2022, IDHM, densidade demográfica e capitais estaduais.',
                })}
                className="btn-subitem-aventura w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-teal-200/90 hover:text-violet-100 hover:bg-violet-950/40 font-medium text-xs transition cursor-pointer border border-transparent hover:border-violet-500/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="truncate">Prova: Geopolítica</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 shrink-0">
                  Censo
                </span>
              </button>

              {/* 4. Prova Arte, Cultura & Sabores */}
              <button
                id="btn-subitem-aventura-prova-cultura"
                onClick={() => handleSelectSubitem(() => onOpenBrQuestHub('cultura_musica'))}
                {...bindTooltip({
                  title: 'Prova: Arte, Cultura & Sabores',
                  badge: 'Módulo Cultura',
                  badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
                  description: 'Perguntas sobre patrimônio material e imaterial tombado pelo IPHAN, culinária típica e ritmos musicais.',
                })}
                className="btn-subitem-aventura w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-teal-200/90 hover:text-rose-100 hover:bg-rose-950/40 font-medium text-xs transition cursor-pointer border border-transparent hover:border-rose-500/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Music className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">Prova: Arte & Cultura</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 shrink-0">
                  Cultura
                </span>
              </button>
            </>
          )}

          <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />

          {/* Filtros Regionais */}
          <div className="p-1 rounded-xl bg-slate-950/40 border border-teal-500/20 flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-teal-300/80 px-1 tracking-wider">
              Filtro Regional
            </span>
            <div className="grid grid-cols-6 gap-1">
              {[
                { id: 'todos', label: 'BR', desc: 'Todo o território brasileiro.' },
                { id: 'norte', label: 'N', desc: 'Região Norte: AC, AP, AM, PA, RO, RR, TO.' },
                { id: 'nordeste', label: 'NE', desc: 'Região Nordeste: AL, BA, CE, MA, PB, PE, PI, RN, SE.' },
                { id: 'centro_oeste', label: 'CO', desc: 'Região Centro-Oeste: DF, GO, MT, MS.' },
                { id: 'sudeste', label: 'SE', desc: 'Região Sudeste: ES, MG, RJ, SP.' },
                { id: 'sul', label: 'S', desc: 'Região Sul: PR, RS, SC.' },
              ].map((reg) => {
                const isSelected = selectedRegionFilter === reg.id;
                return (
                  <button
                    key={reg.id}
                    id={`btn-filtro-regiao-${reg.id}`}
                    onClick={() =>
                      handleSelectSubitem(() => {
                        onSelectRegionFilter?.(reg.id);
                      })
                    }
                    onMouseEnter={() => {
                      onHoverRegionFilter?.(reg.id);
                      setHoveredMenuTooltip({
                        title: `Filtro Regional: ${reg.label}`,
                        description: reg.desc,
                      });
                    }}
                    onMouseLeave={() => {
                      onHoverRegionFilter?.(null);
                      setHoveredMenuTooltip(null);
                    }}
                    className={`btn-filtro-regiao py-1 rounded text-[10px] font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm scale-105'
                        : 'text-teal-200/80 hover:text-teal-50 hover:bg-teal-950/60'
                    }`}
                  >
                    {reg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {onNavigateToSanctuary && (
            <>
              <div className={`w-full h-[1px] ${theme.divider} my-0.5`} />
              <button
                id="btn-subitem-aventura-santuario"
                onClick={() => handleSelectSubitem(() => onNavigateToSanctuary())}
                {...bindTooltip({
                  title: 'Santuário de Insígnias',
                  badge: `Nível ${playerLevel} • ${playerXp} XP`,
                  description: 'Cofre sagrado com as insígnias e relíquias conquistadas em suas jornadas.',
                })}
                className="btn-subitem-aventura w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-500/30 font-medium text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="truncate">Santuário de Insígnias</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/40 text-yellow-300 shrink-0">
                  Nv. {playerLevel}
                </span>
              </button>
            </>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  );
};
