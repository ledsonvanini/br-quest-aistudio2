import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Compass,
  Thermometer,
  Radio,
  CloudRain,
  Cloud,
  Waves,
  Wind,
  Activity,
  Sun,
  SunMedium,
  Moon,
  Settings,
  Flame,
  Award,
  BookOpen,
  Layers,
  Mountain,
  Scroll,
  Flag,
  Globe,
  MousePointerClick,
  Leaf,
  Bird,
  Trees,
  Users,
  Building2,
  GraduationCap,
  HeartPulse,
  Baby,
  Vote,
  Percent,
} from 'lucide-react';
import { audioEngine } from '../lib/audioSynth';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme, BiodiversityKingdom, BrazilBiome } from '../types';
import { GeopoliticaMetricKey } from '../types/geopolitica';
import { NavFlyoutMenu } from './nav/NavFlyoutMenu';

export type AppMainMode = 'clima' | 'biodiversidade' | 'geopolitica' | 'globo3d' | 'aventura' | 'musicalidades';

export interface MenuTooltipInfo {
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
}

interface Props {
  // Active App Module
  mainMode: AppMainMode;
  onSelectMainMode: (mode: AppMainMode) => void;

  // Geopolítica Module States
  geopoliticaMetric?: GeopoliticaMetricKey;
  onGeopoliticaMetricChange?: (metric: GeopoliticaMetricKey) => void;
  isGeopoliticaPanelOpen?: boolean;
  onToggleGeopoliticaPanel?: () => void;

  // Biodiversity Module States
  biodiversityKingdom?: BiodiversityKingdom | 'all';
  onBiodiversityKingdomChange?: (kingdom: BiodiversityKingdom | 'all') => void;
  biodiversityBiome?: BrazilBiome | 'all';
  onBiodiversityBiomeChange?: (biome: BrazilBiome | 'all') => void;
  isBiodiversityThreatenedOnly?: boolean;
  onToggleBiodiversityThreatenedOnly?: () => void;
  isBiodiversityEndemicOnly?: boolean;
  onToggleBiodiversityEndemicOnly?: () => void;
  isBiodiversityPanelOpen?: boolean;
  onToggleBiodiversityPanel?: () => void;

  // Adventure Module States & Filters & Map Styles
  terrainProvider?: TerrainTileProvider;
  onTerrainProviderChange?: (provider: TerrainTileProvider) => void;
  visualStyle?: MapVisualStyle;
  onVisualStyleChange?: (style: MapVisualStyle) => void;
  choroplethSubTheme?: ChoroplethSubTheme;
  onChoroplethSubThemeChange?: (theme: ChoroplethSubTheme) => void;
  selectedRegionFilter?: string;
  onSelectRegionFilter?: (region: string) => void;
  onHoverRegionFilter?: (region: string | null) => void;
  showNeighbors?: boolean;
  onToggleNeighbors?: () => void;
  onNavigateToSanctuary?: () => void;
  playerLevel?: number;
  playerXp?: number;
  completedStateCount?: number;
  unlockedInsigniaCount?: number;

  // Climate Module States & Engaged Telemetry
  climateMode?: ClimateMode;
  onClimateModeChange?: (mode: ClimateMode) => void;
  isObservatorioOpen?: boolean;
  onToggleObservatorio?: () => void;
  isRainSimActive?: boolean;
  onToggleRainSim?: () => void;
  isCloudsActive?: boolean;
  onToggleClouds?: () => void;
  isWavesActive?: boolean;
  onToggleWaves?: () => void;
  isAtmosphereActive?: boolean;
  onToggleAtmosphere?: () => void;
  celestialTimeOverride?: 'day' | 'night' | 'auto';
  timeOverride?: 'day' | 'night' | 'auto';
  onTimeOverrideChange?: (mode: 'day' | 'night' | 'auto') => void;
  avgTempBrazil?: number;
  maxTempState?: { stateId: string; temp: number };
  minTempState?: { stateId: string; temp: number };
  onFocusState?: (stateId: string) => void;

  // Music Module States
  isRadioOpen?: boolean;
  onToggleRadio?: () => void;
  activeMusicCategory?: 'state_anthems' | 'top5' | 'national';
  onSelectMusicCategory?: (category: 'state_anthems' | 'top5' | 'national') => void;
  selectedRadioEraId?: string;
  onSelectRadioEra?: (eraId: string) => void;
  currentStationName?: string;
  currentTrackTitle?: string;
  selectedStateId?: string | null;
  isRadioPlaying?: boolean;

  // Globe 3D Module States & Tools
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

  // General Settings
  onOpenSettings?: () => void;
  onResetView?: () => void;
  onResetViewIfNotCentered?: () => void;
  hoveredStateId?: string | null;
}

export const TopGlobalNavMenu: React.FC<Props> = ({
  mainMode,
  onSelectMainMode,
  geopoliticaMetric = 'miscigenacao',
  onGeopoliticaMetricChange,
  isGeopoliticaPanelOpen,
  onToggleGeopoliticaPanel,
  biodiversityKingdom = 'all',
  onBiodiversityKingdomChange,
  isBiodiversityThreatenedOnly = false,
  onToggleBiodiversityThreatenedOnly,
  isBiodiversityPanelOpen,
  onToggleBiodiversityPanel,
  terrainProvider = 'shaded_relief',
  onTerrainProviderChange,
  visualStyle = 'tiles',
  onVisualStyleChange,
  selectedRegionFilter = 'todos',
  onSelectRegionFilter,
  onHoverRegionFilter,
  showNeighbors = false,
  onToggleNeighbors,
  onNavigateToSanctuary,
  playerLevel = 1,
  playerXp = 0,
  climateMode = 'temperaturas_frentes',
  onClimateModeChange,
  isObservatorioOpen,
  onToggleObservatorio,
  isRainSimActive = false,
  onToggleRainSim,
  isCloudsActive = true,
  onToggleClouds,
  isWavesActive = true,
  onToggleWaves,
  isAtmosphereActive = true,
  onToggleAtmosphere,
  celestialTimeOverride = 'auto',
  timeOverride,
  onTimeOverrideChange,
  isRadioOpen = true,
  onToggleRadio,
  activeMusicCategory = 'state_anthems',
  onSelectMusicCategory,
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
  onOpenSettings,
  onResetView,
  onResetViewIfNotCentered,
  hoveredStateId,
}) => {
  const activeCelestialMode = timeOverride || celestialTimeOverride;

  // Controle de qual submenu/flyout flutuante está aberto no momento
  const [openFlyoutMode, setOpenFlyoutMode] = useState<AppMainMode | null>(null);

  // Posição calculada do flyout vertical com seta direcionada ao botão pai
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; arrowTop: number } | null>(null);

  // Tooltip flutuante contextual posicionado exatamente ao lado do botão hovered
  const [hoveredMenuTooltip, setHoveredMenuTooltip] = useState<{
    info: MenuTooltipInfo;
    top: number;
  } | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key in AppMainMode]?: HTMLButtonElement | null }>({});

  // Recalcula o posicionamento vertical e a posição da seta de balão para que caiba na tela
  const updateFlyoutPosition = useCallback((targetMode?: AppMainMode | null) => {
    const currentMode = targetMode !== undefined ? targetMode : openFlyoutMode;
    if (!currentMode) {
      setFlyoutPos(null);
      return;
    }

    const btn = buttonRefs.current[currentMode];
    if (!btn) return;

    const btnRect = btn.getBoundingClientRect();
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const viewportHeight = window.innerHeight;
    const flyoutHeight = flyoutRef.current?.offsetHeight || 360;
    const margin = 12;

    let targetTop = btnCenterY - 48;
    if (targetTop < margin) {
      targetTop = margin;
    } else if (targetTop + flyoutHeight > viewportHeight - margin) {
      targetTop = Math.max(margin, viewportHeight - margin - flyoutHeight);
    }

    let arrowOffset = btnCenterY - targetTop;
    arrowOffset = Math.max(20, Math.min(flyoutHeight - 20, arrowOffset));

    setFlyoutPos({
      top: Math.round(targetTop),
      arrowTop: Math.round(arrowOffset),
    });
  }, [openFlyoutMode]);

  // Atualiza posição do flyout quando abre ou quando a janela é redimensionada
  useEffect(() => {
    if (openFlyoutMode) {
      updateFlyoutPosition(openFlyoutMode);
      const timer = setTimeout(() => {
        updateFlyoutPosition(openFlyoutMode);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [openFlyoutMode, updateFlyoutPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (openFlyoutMode) {
        updateFlyoutPosition(openFlyoutMode);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openFlyoutMode, updateFlyoutPosition]);

  // Fecha o flyout se o usuário clicar fora da sidebar e do painel flutuante
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        flyoutRef.current &&
        !flyoutRef.current.contains(target)
      ) {
        setOpenFlyoutMode(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, []);

  // Handler para clique nos botões principais da sidebar
  const handleModeButtonClick = (mode: AppMainMode) => {
    audioEngine.playSfx('click');
    setHoveredMenuTooltip(null);
    if (mainMode !== mode) {
      onSelectMainMode(mode);
    }
    if (openFlyoutMode === mode) {
      setOpenFlyoutMode(null);
    } else {
      setOpenFlyoutMode(mode);
      const btn = buttonRefs.current[mode];
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const initialTop = Math.max(12, Math.min(window.innerHeight - 380, btnCenterY - 48));
        setFlyoutPos({
          top: Math.round(initialTop),
          arrowTop: Math.round(btnCenterY - initialTop),
        });
      }
      setTimeout(() => updateFlyoutPosition(mode), 16);
    }
  };

  // Helper para acionar seleção de subitem, executar transformação e recolher flyout
  const handleSelectSubitem = (action: () => void) => {
    audioEngine.playSfx('click');
    setHoveredMenuTooltip(null);
    action();
    setOpenFlyoutMode(null);
  };

  // Handlers para clima
  const handleSmartClimateModeChange = (mode: ClimateMode) => {
    onClimateModeChange?.(mode);
  };

  // Funções para obter o ícone e label do subitem ativo
  const getClimaActiveIcon = () => {
    switch (climateMode) {
      case 'temperaturas_frentes':
        return <Thermometer className="w-5 h-5 transition-transform" />;
      case 'previsao_tempo':
        return <SunMedium className="w-5 h-5 transition-transform" />;
      case 'ventos_aliseos':
        return <Wind className="w-5 h-5 transition-transform" />;
      case 'precipitacao_zcas':
        return <CloudRain className="w-5 h-5 transition-transform" />;
      case 'el_nino_la_nina':
        return <Activity className="w-5 h-5 transition-transform" />;
      default:
        return <Thermometer className="w-5 h-5 transition-transform" />;
    }
  };

  const getClimaActiveLabel = () => {
    switch (climateMode) {
      case 'temperaturas_frentes':
        return 'Temperatura ECMWF (-4°C a 36°C)';
      case 'previsao_tempo':
        return 'Previsão 7 Dias';
      case 'ventos_aliseos':
        return 'Ventos Alísios & Rios Voadores';
      case 'precipitacao_zcas':
        return 'ZCAS & Chuvas';
      case 'el_nino_la_nina':
        return 'El Niño & La Niña';
      default:
        return 'Temperatura';
    }
  };

  const getBiodiversidadeActiveIcon = () => {
    if (isBiodiversityThreatenedOnly) {
      return <BookOpen className="w-5 h-5 transition-transform text-rose-400" />;
    }
    switch (biodiversityKingdom) {
      case 'fauna':
        return <Bird className="w-5 h-5 transition-transform" />;
      case 'flora':
        return <Trees className="w-5 h-5 transition-transform" />;
      case 'fungi_micro':
        return <Leaf className="w-5 h-5 transition-transform" />;
      case 'all':
      default:
        return <Leaf className="w-5 h-5 transition-transform" />;
    }
  };

  const getBiodiversidadeActiveLabel = () => {
    if (isBiodiversityThreatenedOnly) return 'Livro Vermelho (Espécies Ameaçadas)';
    switch (biodiversityKingdom) {
      case 'fauna':
        return 'Fauna Brasileira';
      case 'flora':
        return 'Flora do Brasil';
      case 'fungi_micro':
        return 'Fungos & Microbioma';
      case 'all':
      default:
        return 'Todos os Reinos Biológicos';
    }
  };

  const getGeopoliticaActiveIcon = () => {
    if (showNeighbors) {
      return <Flag className="w-5 h-5 transition-transform text-amber-300" />;
    }
    switch (geopoliticaMetric) {
      case 'miscigenacao':
        return <Users className="w-5 h-5 transition-transform" />;
      case 'genero':
        return <Percent className="w-5 h-5 transition-transform" />;
      case 'densidade':
        return <Building2 className="w-5 h-5 transition-transform" />;
      case 'natalidade':
        return <Baby className="w-5 h-5 transition-transform" />;
      case 'mortalidade':
        return <HeartPulse className="w-5 h-5 transition-transform" />;
      case 'analfabetismo':
        return <GraduationCap className="w-5 h-5 transition-transform" />;
      case 'partidos':
        return <Vote className="w-5 h-5 transition-transform" />;
      default:
        return <Users className="w-5 h-5 transition-transform" />;
    }
  };

  const getGeopoliticaActiveLabel = () => {
    if (showNeighbors) return 'América do Sul (Países Vizinhos)';
    switch (geopoliticaMetric) {
      case 'miscigenacao':
        return 'Miscigenação & Composição Étnica';
      case 'genero':
        return 'Distribuição por Sexo & Gênero';
      case 'densidade':
        return 'Densidade Demográfica';
      case 'natalidade':
        return 'Natalidade & Fecundidade';
      case 'mortalidade':
        return 'Saúde & Longevidade';
      case 'analfabetismo':
        return 'Educação & Alfabetização';
      case 'partidos':
        return 'Governo & Partidos Políticos';
      default:
        return 'Demografia Censo 2022';
    }
  };

  const getMusicalidadesActiveIcon = () => {
    switch (activeMusicCategory) {
      case 'state_anthems':
        return <BookOpen className="w-5 h-5 transition-transform" />;
      case 'top5':
        return <Flame className="w-5 h-5 transition-transform" />;
      case 'national':
        return <Award className="w-5 h-5 transition-transform" />;
      default:
        return <Radio className="w-5 h-5 transition-transform" />;
    }
  };

  const getMusicalidadesActiveLabel = () => {
    switch (activeMusicCategory) {
      case 'state_anthems':
        return 'Hinos Oficiais do Estado';
      case 'top5':
        return 'Top 5 Clássicos Regionais';
      case 'national':
        return 'Hinos Cívicos Nacionais';
      default:
        return 'Rádio Retrô';
    }
  };

  const getGloboActiveIcon = () => {
    return <Globe className="w-5 h-5 transition-transform" />;
  };

  const getGloboActiveLabel = () => {
    if (globeTextureMode === 'night_lights') return 'Luzes Noturnas da Terra';
    return 'Satélite NASA Blue Marble';
  };

  const getAventuraActiveIcon = () => {
    if (visualStyle === 'choropleth') {
      return <Layers className="w-5 h-5 transition-transform" />;
    }
    if (terrainProvider === 'natural_earth') {
      return <Sun className="w-5 h-5 transition-transform" />;
    }
    if (terrainProvider === 'voyager_parchment') {
      return <Scroll className="w-5 h-5 transition-transform" />;
    }
    return <Mountain className="w-5 h-5 transition-transform" />;
  };

  const getAventuraActiveLabel = () => {
    if (visualStyle === 'choropleth') return 'Divisão Político-Administrativa';
    if (terrainProvider === 'natural_earth') return 'Cores Naturais da Terra';
    if (terrainProvider === 'voyager_parchment') return 'Pergaminho das Grandes Navegações';
    return 'Relevo Sombreado Altimétrico';
  };

  const bindTooltip = (info: MenuTooltipInfo) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      setHoveredMenuTooltip({ info, top: centerY });
    },
    onMouseLeave: () => setHoveredMenuTooltip(null),
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      setHoveredMenuTooltip({ info, top: centerY });
    },
    onBlur: () => setHoveredMenuTooltip(null),
  });

  return (
    <>
      {/* ========================================================================= */}
      {/* SIDEBAR GLOBAL LATERAL ESQUERDA (COMPACTA, FIXA, FLYOUTS FLUTUANTES)     */}
      {/* ========================================================================= */}
      <aside
        id="menu-global-sidebar-esquerda"
        ref={sidebarRef}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="menu-global-sidebar-esquerda container-sidebar-navegacao menu-superior-status fixed left-2 sm:left-3 top-2 sm:top-3 z-40 flex flex-col items-start pointer-events-auto select-none overflow-visible"
        aria-label="Barra Lateral de Navegação BR Quest"
      >
        <div className="bg-[#020d24]/90 backdrop-blur-xl border border-amber-500/35 rounded-2xl p-1.5 shadow-2xl shadow-black/80 flex flex-col items-center gap-1 sm:gap-1.5 text-white overflow-visible">
          
          {/* ========================================================================= */}
          {/* 1. LOGO BRQ (TOPO FIXO DA SIDEBAR)                                       */}
          {/* ========================================================================= */}
          <div className="relative group shrink-0">
            <button
              id="btn-sidebar-logo-brq"
              onClick={() => {
                audioEngine.playSfx('click');
                setHoveredMenuTooltip(null);
                setOpenFlyoutMode(null);
                onResetViewIfNotCentered?.();
                onResetView?.();
              }}
              {...bindTooltip({
                title: 'BR Quest • Guardiões da Cultura',
                badge: 'Mapa do Brasil',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                description:
                  'Clique para restaurar e recentralizar o enquadramento do mapa do Brasil.',
              })}
              className="btn-sidebar-logo-brq w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/60 hover:border-amber-300 flex flex-col items-center justify-center transition-all cursor-pointer shadow-inner group-hover:scale-105"
              aria-label="BR Quest - Centralizar Mapa"
            >
              <span className="text-base sm:text-lg leading-none">🇧🇷</span>
              <span className="font-serif font-black text-[9px] text-amber-300 leading-none mt-0.5 tracking-tight">
                BRQ
              </span>
            </button>
          </div>

          {/* Divisor Horizontal */}
          <div className="w-7 h-[1px] bg-slate-800/80 shrink-0" />

          {/* ========================================================================= */}
          {/* 2. MODOS PRINCIPAIS COM ÍCONE ATIVO E FLYOUT FLUTUANTE AO LADO            */}
          {/* ========================================================================= */}
          <div className="secao-modos-principais flex flex-col items-center gap-1 sm:gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0 overflow-visible">
            
            {/* 1. CLIMA */}
            <div className="relative">
              <button
                id="btn-modo-clima"
                ref={(el) => {
                  buttonRefs.current['clima'] = el;
                }}
                onClick={() => handleModeButtonClick('clima')}
                {...bindTooltip({
                  title: `Clima: ${getClimaActiveLabel()}`,
                  badge: mainMode === 'clima' ? 'Modo Ativo' : 'Tempo Real',
                  badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
                  description:
                    'Clique para abrir o menu flutuante de Clima: Temperatura ECMWF (-4°C a 36°C), Previsão 7 Dias, Ventos Alísios, Rios Voadores, ZCAS e Observatório.',
                })}
                className={`btn-modo-clima relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  mainMode === 'clima'
                    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_16px_rgba(249,115,22,0.6)] font-black scale-105 ring-2 ring-orange-400/80'
                    : 'text-slate-400 hover:text-orange-300 hover:bg-slate-800/80 border-transparent hover:border-orange-500/30'
                }`}
                aria-label="Temperatura e Clima"
              >
                {getClimaActiveIcon()}
                {mainMode === 'clima' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-slate-950 shadow-[0_0_8px_#f59e0b] animate-pulse pointer-events-none" />
                )}
              </button>
            </div>

            {/* 2. BIODIVERSIDADE */}
            <div className="relative">
              <button
                id="btn-modo-biodiversidade"
                ref={(el) => {
                  buttonRefs.current['biodiversidade'] = el;
                }}
                onClick={() => handleModeButtonClick('biodiversidade')}
                {...bindTooltip({
                  title: `Biodiversidade: ${getBiodiversidadeActiveLabel()}`,
                  badge: mainMode === 'biodiversidade' ? 'Modo Ativo' : 'Biomas & Espécies',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                  description:
                    'Clique para abrir o menu flutuante de Biodiversidade: Fauna Nativa, Flora, Fungos, Livro Vermelho MMA e Catálogo de Biomas.',
                })}
                className={`btn-modo-biodiversidade relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  mainMode === 'biodiversidade'
                    ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-slate-950 border-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.6)] font-black scale-105 ring-2 ring-emerald-400/80'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 border-transparent hover:border-emerald-500/30'
                }`}
                aria-label="Biodiversidade e Biomas"
              >
                {getBiodiversidadeActiveIcon()}
                {mainMode === 'biodiversidade' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-slate-950 shadow-[0_0_8px_#10b981] animate-pulse pointer-events-none" />
                )}
              </button>
            </div>

            {/* 3. GEOPOLÍTICA */}
            <div className="relative">
              <button
                id="btn-modo-geopolitica"
                ref={(el) => {
                  buttonRefs.current['geopolitica'] = el;
                }}
                onClick={() => handleModeButtonClick('geopolitica')}
                {...bindTooltip({
                  title: `Geopolítica: ${getGeopoliticaActiveLabel()}`,
                  badge: mainMode === 'geopolitica' ? 'Modo Ativo' : 'IBGE Censo 2022',
                  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
                  description:
                    'Clique para abrir o menu flutuante de Geopolítica: Miscigenação, Sexo/Gênero, Densidade, Natalidade, Saúde, Educação, Partidos e Países Vizinhos.',
                })}
                className={`btn-modo-geopolitica relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  mainMode === 'geopolitica'
                    ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 text-slate-950 border-blue-300 shadow-[0_0_16px_rgba(59,130,246,0.6)] font-black scale-105 ring-2 ring-blue-400/80'
                    : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800/80 border-transparent hover:border-blue-500/30'
                }`}
                aria-label="Geopolítica e Demografia"
              >
                {getGeopoliticaActiveIcon()}
                {mainMode === 'geopolitica' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-slate-950 shadow-[0_0_8px_#38bdf8] animate-pulse pointer-events-none" />
                )}
              </button>
            </div>

            {/* 4. MUSICALIDADES */}
            <div className="relative">
              <button
                id="btn-modo-musicalidades"
                ref={(el) => {
                  buttonRefs.current['musicalidades'] = el;
                }}
                onClick={() => handleModeButtonClick('musicalidades')}
                {...bindTooltip({
                  title: `Musicalidades: ${getMusicalidadesActiveLabel()}`,
                  badge: mainMode === 'musicalidades' ? 'Modo Ativo' : 'Rádio Retrô',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                  description:
                    'Clique para abrir o menu flutuante de Musicalidades: Hinos Oficiais do Estado, Top 5 Clássicos Regionais, Hinos Nacionais e Gabinete do Rádio.',
                })}
                className={`btn-modo-musicalidades relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  mainMode === 'musicalidades'
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.6)] font-black scale-105 ring-2 ring-amber-400/80'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border-transparent hover:border-amber-500/30'
                }`}
                aria-label="Musicalidades e Rádio Retrô"
              >
                {getMusicalidadesActiveIcon()}
                {mainMode === 'musicalidades' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-300 ring-2 ring-slate-950 shadow-[0_0_8px_#facc15] animate-pulse pointer-events-none" />
                )}
              </button>
            </div>

            {/* 5. GLOBO 3D */}
            <div className="relative">
              <button
                id="btn-modo-globo3d"
                ref={(el) => {
                  buttonRefs.current['globo3d'] = el;
                }}
                onClick={() => handleModeButtonClick('globo3d')}
                {...bindTooltip({
                  title: `Globo 3D: ${getGloboActiveLabel()}`,
                  badge: mainMode === 'globo3d' ? 'Modo Ativo' : 'Órbita Terrestre',
                  badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
                  description:
                    'Clique para abrir o menu flutuante do Globo 3D: Satélite NASA HD, Luzes Noturnas, Fronteiras Vetoriais, Nuvens 3D, Rotação e Brasões.',
                })}
                className={`btn-modo-globo3d relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  mainMode === 'globo3d'
                    ? 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-blue-600 text-slate-950 border-indigo-300 shadow-[0_0_16px_rgba(99,102,241,0.6)] font-black scale-105 ring-2 ring-indigo-400/80'
                    : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 border-transparent hover:border-indigo-500/30'
                }`}
                aria-label="Globo 3D Orbital"
              >
                {getGloboActiveIcon()}
                {mainMode === 'globo3d' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-300 ring-2 ring-slate-950 shadow-[0_0_8px_#818cf8] animate-pulse pointer-events-none" />
                )}
              </button>
            </div>

            {/* 6. AVENTURA & MAPA */}
            <div className="relative">
              <button
                id="btn-modo-aventura"
                ref={(el) => {
                  buttonRefs.current['aventura'] = el;
                }}
                onClick={() => handleModeButtonClick('aventura')}
                {...bindTooltip({
                  title: `Aventura: ${getAventuraActiveLabel()}`,
                  badge: mainMode === 'aventura' ? 'Modo Ativo' : 'Jornada Cultural',
                  badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
                  description:
                    'Clique para abrir o menu flutuante de Aventura: Relevo Altimétrico, Cores Naturais, Pergaminho Vintage, Divisão Política, Filtros Regionais e Santuário.',
                })}
                className={`btn-modo-aventura relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  mainMode === 'aventura'
                    ? 'bg-gradient-to-br from-teal-400 via-emerald-500 to-amber-500 text-slate-950 border-teal-300 shadow-[0_0_16px_rgba(20,184,166,0.6)] font-black scale-105 ring-2 ring-teal-400/80'
                    : 'text-slate-400 hover:text-teal-300 hover:bg-slate-800/80 border-transparent hover:border-teal-500/30'
                }`}
                aria-label="Aventura e Exploração"
              >
                {getAventuraActiveIcon()}
                {mainMode === 'aventura' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-slate-950 shadow-[0_0_8px_#f59e0b] animate-pulse pointer-events-none" />
                )}
              </button>
            </div>

          </div>

          {/* Divisor Horizontal */}
          <div className="w-7 h-[1px] bg-slate-800/80 shrink-0 my-0.5" />

          {/* ========================================================================= */}
          {/* 3. CONTROLES DE ATMOSFERA & FENÔMENOS (CHUVA, NUVENS, VENTOS, ASTRO)      */}
          {/* ========================================================================= */}
          <div
            id="secao-controles-atmosfera-sidebar"
            className="secao-controles-atmosfera-sidebar flex flex-col items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 shrink-0"
          >
            {/* 1. Simulador de Chuva */}
            {onToggleRainSim && (
              <button
                id="btn-sidebar-chuva"
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  setHoveredMenuTooltip(null);
                  onToggleRainSim();
                }}
                {...bindTooltip({
                  title: 'Simulador de Chuva',
                  badge: isRainSimActive ? 'Ativo' : 'Desativado',
                  badgeColor: isRainSimActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                  description: 'Simula precipitação de chuvas convectivas e frontais com partículas dinâmicas em tempo real.',
                })}
                className={`btn-sidebar-chuva w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isRainSimActive
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                aria-label="Simulador de Chuva"
              >
                <CloudRain className={`w-4 h-4 ${isRainSimActive ? 'animate-bounce' : ''}`} />
              </button>
            )}

            {/* 2. Nuvens Volumétricas */}
            {onToggleClouds && (
              <button
                id="btn-sidebar-nuvens"
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  setHoveredMenuTooltip(null);
                  onToggleClouds();
                }}
                {...bindTooltip({
                  title: 'Nuvens Volumétricas',
                  badge: isCloudsActive ? 'Visível' : 'Oculto',
                  badgeColor: isCloudsActive ? 'bg-sky-500/20 text-sky-300 border-sky-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                  description: 'Camada de nuvens dinâmicas em alta altitude com turbulência e sombreamento atmosférico.',
                })}
                className={`btn-sidebar-nuvens w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isCloudsActive
                    ? 'bg-sky-500/30 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                aria-label="Nuvens Volumétricas"
              >
                <Cloud className={`w-4 h-4 ${isCloudsActive ? 'animate-pulse' : ''}`} />
              </button>
            )}

            {/* 3. Ventos Alísios e Ondas */}
            {onToggleWaves && (
              <button
                id="btn-sidebar-ventos-ondas"
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  setHoveredMenuTooltip(null);
                  onToggleWaves();
                }}
                {...bindTooltip({
                  title: 'Ventos Alísios & Ondas',
                  badge: isWavesActive ? 'Ativo' : 'Desativado',
                  badgeColor: isWavesActive ? 'bg-teal-500/20 text-teal-300 border-teal-400/40' : 'bg-slate-700/30 text-slate-400 border-slate-600',
                  description: 'Circulação dos Ventos Alísios equatoriais e correntes de ondas marinhas na costa brasileira.',
                })}
                className={`btn-sidebar-ventos-ondas w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isWavesActive
                    ? 'bg-teal-500/30 border-teal-400 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.5)]'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                aria-label="Ventos Alísios e Ondas"
              >
                <Waves className={`w-4 h-4 ${isWavesActive ? 'animate-pulse' : ''}`} />
              </button>
            )}

            {/* 4. Astro e Ciclo Solar/Noturno */}
            {(onToggleAtmosphere || onTimeOverrideChange) && (
              <button
                id="btn-sidebar-astro-atmosfera"
                type="button"
                onClick={() => {
                  audioEngine.playSfx('click');
                  setHoveredMenuTooltip(null);
                  if (onTimeOverrideChange) {
                    const next = activeCelestialMode === 'auto' ? 'day' : activeCelestialMode === 'day' ? 'night' : 'auto';
                    onTimeOverrideChange(next);
                  } else if (onToggleAtmosphere) {
                    onToggleAtmosphere();
                  }
                }}
                {...bindTooltip({
                  title: 'Astro & Ciclo Solar',
                  badge: activeCelestialMode === 'day' ? 'Dia Fixado' : activeCelestialMode === 'night' ? 'Noite Fixada' : 'Tempo Real',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                  description: 'Alterna entre iluminação solar diurna, abóbada celeste noturna e sincronização em tempo real com Brasília.',
                })}
                className={`btn-sidebar-astro-atmosfera w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isAtmosphereActive
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                aria-label="Astro e Atmosfera"
              >
                {activeCelestialMode === 'night' ? (
                  <Moon className="w-4 h-4 text-indigo-300 animate-pulse" />
                ) : activeCelestialMode === 'day' ? (
                  <Sun className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '14s' }} />
                ) : (
                  <SunMedium className="w-4 h-4 text-amber-400" />
                )}
              </button>
            )}
          </div>

          {/* Botão de Configurações Gerais no rodapé da Sidebar */}
          {onOpenSettings && (
            <div className="mt-auto pt-0.5 shrink-0">
              <button
                id="btn-configuracoes-sidebar"
                onClick={() => {
                  audioEngine.playSfx('click');
                  setHoveredMenuTooltip(null);
                  setOpenFlyoutMode(null);
                  onOpenSettings();
                }}
                {...bindTooltip({
                  title: 'Configurações Gerais',
                  description: 'Ajuste volume do áudio, efeitos sonoros e telemetria.',
                })}
                className="btn-configuracoes-sidebar w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 flex items-center justify-center transition cursor-pointer"
                aria-label="Configurações"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PAINEL FLYOUT VERTICAL FLUTUANTE COM BALÃO DE DIÁLOGO E CLAMPING         */}
        {/* ========================================================================= */}
        {openFlyoutMode && (
          <NavFlyoutMenu
            openFlyoutMode={openFlyoutMode}
            flyoutPos={flyoutPos}
            flyoutRef={flyoutRef}
            handleSelectSubitem={handleSelectSubitem}
            bindTooltip={bindTooltip}
            climateMode={climateMode}
            handleSmartClimateModeChange={handleSmartClimateModeChange}
            isObservatorioOpen={isObservatorioOpen}
            onToggleObservatorio={onToggleObservatorio}
            biodiversityKingdom={biodiversityKingdom}
            onBiodiversityKingdomChange={onBiodiversityKingdomChange}
            isBiodiversityThreatenedOnly={isBiodiversityThreatenedOnly}
            onToggleBiodiversityThreatenedOnly={onToggleBiodiversityThreatenedOnly}
            isBiodiversityPanelOpen={isBiodiversityPanelOpen}
            onToggleBiodiversityPanel={onToggleBiodiversityPanel}
            geopoliticaMetric={geopoliticaMetric}
            onGeopoliticaMetricChange={onGeopoliticaMetricChange}
            showNeighbors={showNeighbors}
            onToggleNeighbors={onToggleNeighbors}
            isGeopoliticaPanelOpen={isGeopoliticaPanelOpen}
            onToggleGeopoliticaPanel={onToggleGeopoliticaPanel}
            activeMusicCategory={activeMusicCategory}
            onSelectMusicCategory={onSelectMusicCategory}
            isRadioOpen={isRadioOpen}
            onToggleRadio={onToggleRadio}
            globeTextureMode={globeTextureMode}
            onGlobeTextureModeChange={onGlobeTextureModeChange}
            isGlobeCloudsActive={isGlobeCloudsActive}
            onToggleGlobeClouds={onToggleGlobeClouds}
            isGlobeAutoRotateActive={isGlobeAutoRotateActive}
            onToggleGlobeAutoRotate={onToggleGlobeAutoRotate}
            isGlobeBordersActive={isGlobeBordersActive}
            onToggleGlobeBorders={onToggleGlobeBorders}
            globePinMode={globePinMode}
            onGlobePinModeChange={onGlobePinModeChange}
            onResetGlobeCamera={onResetGlobeCamera}
            visualStyle={visualStyle}
            onVisualStyleChange={onVisualStyleChange}
            terrainProvider={terrainProvider}
            onTerrainProviderChange={onTerrainProviderChange}
            selectedRegionFilter={selectedRegionFilter}
            onSelectRegionFilter={onSelectRegionFilter}
            onHoverRegionFilter={onHoverRegionFilter}
            setHoveredMenuTooltip={(val) => {
              if (typeof val === 'function') {
                setHoveredMenuTooltip((prev) => {
                  const res = val(prev ? prev.info : null);
                  return res ? { info: res, top: prev ? prev.top : 100 } : null;
                });
              } else if (val) {
                setHoveredMenuTooltip({ info: val, top: 100 });
              } else {
                setHoveredMenuTooltip(null);
              }
            }}
            onNavigateToSanctuary={onNavigateToSanctuary}
            playerLevel={playerLevel}
            playerXp={playerXp}
          />
        )}

        {/* ========================================================================= */}
        {/* BALÃO / TOOLTIP FLUTUANTE CONTEXTUAL ONHOVER (AO LADO DO ITEM)             */}
        {/* ========================================================================= */}
        {hoveredMenuTooltip && !openFlyoutMode && (
          <div
            id="balao-ferramenta-sidebar"
            className="balao-ferramenta-sidebar fixed left-[58px] sm:left-[66px] pointer-events-none z-50 flex flex-col gap-1 p-2.5 rounded-xl bg-slate-950/95 backdrop-blur-md border border-amber-400/60 shadow-[0_12px_40px_rgba(0,0,0,0.95)] text-white text-xs max-w-xs sm:max-w-sm animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: Math.max(10, Math.min(window.innerHeight - 130, hoveredMenuTooltip.top - 24)),
            }}
          >
            {/* Setinha apontando para o botão hovered */}
            <div className="absolute -left-1.5 top-5 w-3 h-3 bg-slate-950 border-l border-b border-amber-400/60 rotate-45" />
            
            <div className="flex items-center gap-2 relative z-10">
              <span className="font-serif font-bold text-amber-300 whitespace-nowrap">
                {hoveredMenuTooltip.info.title}
              </span>
              {hoveredMenuTooltip.info.badge && (
                <span
                  className={`text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full border shrink-0 ${
                    hoveredMenuTooltip.info.badgeColor || 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  {hoveredMenuTooltip.info.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans relative z-10">
              {hoveredMenuTooltip.info.description}
            </p>
          </div>
        )}

        {/* LEMBRETE DE NAVEGAÇÃO QUANDO SOBRE O MAPA */}
        {!hoveredMenuTooltip && !openFlyoutMode && hoveredStateId && mainMode === 'aventura' && (
          <div
            id="lembrete-navegacao-fixo-sidebar"
            className="lembrete-navegacao-fixo-sidebar fixed left-[58px] sm:left-[66px] top-4 pointer-events-none z-50 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-400/40 shadow-lg shadow-black text-white text-[10px] sm:text-[11px] font-sans shrink-0 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-1 font-medium">
              <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">
                <strong className="text-emerald-300">Botão Esquerdo:</strong> Focar Estado
              </span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-300 font-medium">
              <kbd className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-mono text-[9px] text-amber-300 font-bold">
                Esc
              </kbd>
              <span>Restaurar</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

