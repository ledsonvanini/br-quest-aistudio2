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
  SunMoon,
  Moon,
  ChevronDown,
  ChevronUp,
  Settings,
  Flame,
  Award,
  BookOpen,
  Music,
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
  User,
  Building2,
  GraduationCap,
  HeartPulse,
  Baby,
  Vote,
  Percent,
  Gauge,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { audioEngine } from '../lib/audioSynth';
import { apiTracker } from '../services/apiTracker';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { AppMainMode, MenuTooltipInfo, TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme, BiodiversityKingdom, BrazilBiome } from '../types';
import { GeopoliticaMetricKey } from '../types/geopolitica';
import { QuestThemePillar } from '../data/brQuestQuestionsData';
import { NavFlyoutMenu } from './nav/NavFlyoutMenu';
import { SidebarLogoToggle } from './nav/SidebarLogoToggle';
import { Sidebar2DDrawerTerritory } from './nav/Sidebar2DDrawerTerritory';
import { Sidebar3DDrawerOrbital } from './nav/Sidebar3DDrawerOrbital';
import { SidebarUserAndConfigsGroup } from './nav/SidebarUserAndConfigsGroup';
import { CartographyLayerMode } from '../types/cartography';
import { TerritoryInteractiveLegend } from './map/territory/TerritoryInteractiveLegend';

export type { AppMainMode, MenuTooltipInfo };

interface Props {
  // Cartography Layers (Gaveta 2 de Território)
  activeCartographyLayer?: CartographyLayerMode;
  onSelectCartographyLayer?: (layer: CartographyLayerMode) => void;
  selectedTerritorySubitemId?: string | null;
  onSelectTerritorySubitem?: (subitemId: string | null) => void;
  isTerritorySubmenuOpen?: boolean;
  onToggleTerritorySubmenu?: () => void;
  onSelectState?: (stateId: string | null) => void;
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
  isGlobeTelemetryOpen?: boolean;
  onToggleGlobeTelemetry?: () => void;
  onResetGlobeCamera?: () => void;

  // General Settings & System Utilities
  onOpenSettings?: () => void;
  onOpenUserProfile?: () => void;
  onResetView?: () => void;
  onResetViewIfNotCentered?: () => void;
  hoveredStateId?: string | null;
  onOpenBrQuestHub?: (pillar?: QuestThemePillar | 'nacional') => void;
  onOpenAboutInfo?: () => void;
  showFps?: boolean;
  onToggleFps?: () => void;
  onOpenApiStatus?: () => void;
  onOpenDailyTips?: () => void;
  dailyTipsUnreadCount?: number;
}

export const TopGlobalNavMenu: React.FC<Props> = ({
  activeCartographyLayer,
  onSelectCartographyLayer,
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
  onOpenBrQuestHub,
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
  selectedStateId,
  onFocusState,
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
  isGlobeTelemetryOpen,
  onToggleGlobeTelemetry,
  onResetGlobeCamera,
  onOpenSettings,
  onOpenUserProfile,
  onResetView,
  onResetViewIfNotCentered,
  hoveredStateId,
  onOpenAboutInfo,
  showFps = false,
  onToggleFps,
  onOpenApiStatus,
  onOpenDailyTips,
  dailyTipsUnreadCount,
  selectedTerritorySubitemId,
  onSelectTerritorySubitem,
  isTerritorySubmenuOpen,
  onToggleTerritorySubmenu,
  onSelectState,
}) => {
  const activeCelestialMode = timeOverride || celestialTimeOverride;

  // Submenu lateral conectado de Território (fechado por padrão no boot; abre ao selecionar camada de território)
  const [localTerritorySubmenuOpen, setLocalTerritorySubmenuOpen] = useState<boolean>(false);
  const isTerritorySubmenuEffective = isTerritorySubmenuOpen !== undefined ? isTerritorySubmenuOpen : localTerritorySubmenuOpen;

  // Monitoramento reativo das chamadas de APIs hoje
  const [apiCallsCount, setApiCallsCount] = useState<number>(() => apiTracker.getTotalCallsToday());
  useEffect(() => {
    const update = () => setApiCallsCount(apiTracker.getTotalCallsToday());
    const unsub = apiTracker.subscribe(update);
    return () => unsub();
  }, []);

  // Controle de qual submenu/flyout flutuante está aberto no momento (Clima aberto por padrão)
  const [openFlyoutMode, setOpenFlyoutMode] = useState<AppMainMode | null>('clima');

  // Garante exclusividade mútua estrita: se um estado estiver isolado no AppLateral,
  // fecha qualquer flyout ou submenu lateral aberto imediatamente
  useEffect(() => {
    if (selectedStateId) {
      setOpenFlyoutMode(null);
      setLocalTerritorySubmenuOpen(false);
    }
  }, [selectedStateId]);

  // Posição calculada do flyout vertical com seta direcionada ao botão pai
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; arrowTop: number } | null>(null);

  // Tooltip flutuante contextual posicionado exatamente ao lado do botão hovered
  const [hoveredMenuTooltip, setHoveredMenuTooltip] = useState<{
    info: MenuTooltipInfo;
    top: number;
  } | null>(null);

  // Comportamento Accordion Estrito da Sidebar:
  // - Menu Principal: aberto por padrão com Clima selecionado.
  // - Se abrirmos outro menu (Território ou Ambiente), os demais são recolhidos automaticamente.
  const [isToolsSectionExpanded, setIsToolsSectionExpanded] = useState<boolean>(false);
  const [isTerritorySectionExpanded, setIsTerritorySectionExpanded] = useState<boolean>(false);
  const [isGlobeSectionExpanded, setIsGlobeSectionExpanded] = useState<boolean>(false);
  const [isMainMenuExpanded, setIsMainMenuExpanded] = useState<boolean>(true);

  // Camada Cartográfica Ativa (Gaveta 2: Território) - 'none' por padrão para não misturar com Clima
  const [internalCartographyLayer, setInternalCartographyLayer] = useState<CartographyLayerMode>('none');
  const currentCartographyLayer = activeCartographyLayer !== undefined ? activeCartographyLayer : internalCartographyLayer;
  const handleSelectCartographyLayer = (layer: CartographyLayerMode) => {
    if (layer === currentCartographyLayer) {
      setInternalCartographyLayer('none');
      onSelectCartographyLayer?.('none');
      setLocalTerritorySubmenuOpen(false);
      onSelectState?.(null);
      return;
    }

    setInternalCartographyLayer(layer);
    onSelectCartographyLayer?.(layer);
    if (layer !== 'none') {
      // Abre o submenu lateral com os itens da camada
      setLocalTerritorySubmenuOpen(true);
      setOpenFlyoutMode(null);
      // Fecha o AppLateral para não abrir AppLateral + Menu Lateral ao mesmo tempo
      onSelectState?.(null);
      onResetView?.();
    } else {
      setLocalTerritorySubmenuOpen(false);
      onSelectState?.(null);
    }
  };

  // Handlers Accordion: ao abrir uma seção, todas as outras são recolhidas automaticamente
  const handleToggleToolsSection = () => {
    audioEngine.playSfx('click');
    setHoveredMenuTooltip(null);
    const willOpen = !isToolsSectionExpanded;
    setIsToolsSectionExpanded(willOpen);
    if (willOpen) {
      setIsMainMenuExpanded(false);
      setIsTerritorySectionExpanded(false);
      setIsGlobeSectionExpanded(false);
      setOpenFlyoutMode(null);
      handleSelectCartographyLayer('none');
    }
  };

  const handleToggleTerritorySection = () => {
    audioEngine.playSfx('click');
    setHoveredMenuTooltip(null);
    const willOpen = !isTerritorySectionExpanded;
    setIsTerritorySectionExpanded(willOpen);
    if (willOpen) {
      setIsMainMenuExpanded(false);
      setIsToolsSectionExpanded(false);
      setIsGlobeSectionExpanded(false);
      setOpenFlyoutMode(null);
      // Ao expandir a gaveta de Território, o primeiro item (Bacias Hidrográficas) vem ativo por padrão
      if (currentCartographyLayer === 'none') {
        handleSelectCartographyLayer('bacias_hidrograficas');
      }
    } else {
      handleSelectCartographyLayer('none');
    }
  };

  const handleToggleMainMenu = () => {
    audioEngine.playSfx('click');
    setHoveredMenuTooltip(null);
    const willOpen = !isMainMenuExpanded;
    setIsMainMenuExpanded(willOpen);
    if (willOpen) {
      setIsTerritorySectionExpanded(false);
      setIsToolsSectionExpanded(false);
      setIsGlobeSectionExpanded(false);
      // Modos independentes: desativa camadas territoriais
      if (currentCartographyLayer !== 'none') {
        handleSelectCartographyLayer('none');
      }
      setOpenFlyoutMode(mainMode === 'globo3d' ? 'clima' : mainMode);
    } else {
      setOpenFlyoutMode(null);
    }
  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key in AppMainMode]?: HTMLButtonElement | null }>({});
  const territoryButtonRefs = useRef<{ [key in CartographyLayerMode]?: HTMLButtonElement | null }>({});
  const [territoryLegendPos, setTerritoryLegendPos] = useState<{ top: number; arrowTop: number } | null>(null);

  // Recalcula o posicionamento vertical do submenu de Território para alinhar a seta com precisão ao ícone selecionado
  const updateTerritoryLegendPosition = useCallback((targetLayer?: CartographyLayerMode) => {
    const layer = targetLayer || currentCartographyLayer;
    if (!layer || layer === 'none') {
      setTerritoryLegendPos(null);
      return;
    }
    const btn = territoryButtonRefs.current[layer];
    if (!btn) return;
    const btnRect = btn.getBoundingClientRect();
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const viewportHeight = window.innerHeight;
    const legendHeight = 360;
    const margin = 12;

    let targetTop = btnCenterY - 48;
    if (targetTop < margin) {
      targetTop = margin;
    } else if (targetTop + legendHeight > viewportHeight - margin) {
      targetTop = Math.max(margin, viewportHeight - margin - legendHeight);
    }

    let arrowOffset = btnCenterY - targetTop;
    arrowOffset = Math.max(20, Math.min(legendHeight - 20, arrowOffset));

    setTerritoryLegendPos({
      top: Math.round(targetTop),
      arrowTop: Math.round(arrowOffset),
    });
  }, [currentCartographyLayer]);

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
    if (isTerritorySubmenuEffective && currentCartographyLayer !== 'none') {
      updateTerritoryLegendPosition(currentCartographyLayer);
      const timer = setTimeout(() => {
        updateTerritoryLegendPosition(currentCartographyLayer);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isTerritorySubmenuEffective, currentCartographyLayer, updateTerritoryLegendPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (openFlyoutMode) {
        updateFlyoutPosition(openFlyoutMode);
      }
      if (isTerritorySubmenuEffective && currentCartographyLayer !== 'none') {
        updateTerritoryLegendPosition(currentCartographyLayer);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openFlyoutMode, updateFlyoutPosition, isTerritorySubmenuEffective, currentCartographyLayer, updateTerritoryLegendPosition]);

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

    // REGRA DE OURO: Ao clicar na Sidebar, fecha o AppLateral e recentraliza o mapa
    onSelectState?.(null);
    onResetView?.();

    // Accordion: Garante que o Menu Principal permaneça aberto e as demais gavetas recolhidas
    setIsMainMenuExpanded(true);
    setIsTerritorySectionExpanded(false);
    setIsToolsSectionExpanded(false);
    setIsGlobeSectionExpanded(false);

    // MODOS INDEPENDENTES: desativa qualquer camada territorial (ex: Bacias) para nunca combinar com Modos Principais!
    if (currentCartographyLayer !== 'none') {
      handleSelectCartographyLayer('none');
    }
    setLocalTerritorySubmenuOpen(false);

    // Isolar painéis: fecha telemetria do globo se aberta ao interagir com a sidebar
    if (isGlobeTelemetryOpen && onToggleGlobeTelemetry) {
      onToggleGlobeTelemetry();
    }

    // No modo Globo 3D, as ferramentas agora residem no Footer do aplicativo.
    if (mode === 'globo3d') {
      setOpenFlyoutMode(null);
      if (mainMode === 'globo3d') {
        onSelectMainMode('clima');
      } else {
        onSelectMainMode('globo3d');
      }
      return;
    }

    // Se estiver em outro modo, seleciona o modo clicado
    if (mainMode !== mode) {
      onSelectMainMode(mode);
    }

    // Garante que o primeiro subitem venha ativo por padrão para cada modo
    if (mode === 'clima' && !climateMode) {
      onClimateModeChange?.('temperaturas_frentes');
    } else if (mode === 'biodiversidade' && !biodiversityKingdom) {
      onBiodiversityKingdomChange?.('all');
    } else if (mode === 'geopolitica' && !geopoliticaMetric) {
      onGeopoliticaMetricChange?.('miscigenacao');
    } else if (mode === 'musicalidades' && !activeMusicCategory) {
      onSelectMusicCategory?.('state_anthems');
    }

    // Abre o menu flyout do modo selecionado
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
    return <Radio className="w-5 h-5 transition-transform" />;
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
        return 'Hinos & Ritmos do Brasil';
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
    return <Award className="w-5 h-5 transition-transform" />;
  };

  const getAventuraActiveLabel = () => {
    return 'Desafios & Avaliação BrQuest';
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
        <div className="bg-[#020d24]/90 backdrop-blur-xl border border-amber-500/35 rounded-2xl p-1 sm:p-1.5 shadow-2xl shadow-black/80 flex flex-col items-center gap-1 text-white overflow-visible">
          
          {/* ========================================================================= */}
          {/* A. LOGO BRQ + TOGGLE MESTRE DE MUNDO (3 CAMADAS: DIV + LOGO + ANEXO)     */}
          {/* ========================================================================= */}
          <SidebarLogoToggle
            mainMode={mainMode}
            onSelectMainMode={onSelectMainMode}
            onResetView={onResetView}
            onResetViewIfNotCentered={onResetViewIfNotCentered}
            setHoveredMenuTooltip={setHoveredMenuTooltip}
            setOpenFlyoutMode={setOpenFlyoutMode}
            bindTooltip={bindTooltip}
          />

          {/* Divisor Horizontal */}
          <div className="w-6 h-[1px] bg-slate-800/80 shrink-0" />

          {/* ========================================================================= */}
          {/* MUNDO 1: MAPA 2D DO BRASIL (MODOS PRINCIPAIS + GAVETAS 1 E 2)             */}
          {/* ========================================================================= */}
          {mainMode !== 'globo3d' ? (
            <>
              {/* 2. SEÇÃO PRINCIPAL DE MODOS DO SISTEMA BR QUEST (ACCORDION SECTION 1) */}
              <div
                id="secao-modos-principais-sidebar"
                className="secao-modos-principais-sidebar flex flex-col items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-amber-500/30 shrink-0 shadow-lg transition-all duration-300"
              >
                {/* Seta / Toggle do Menu Principal: SÓ APARECE SE UMA DAS GAVETAS ESTIVER EXPANDIDA */}
                {(isToolsSectionExpanded || isTerritorySectionExpanded) && (
                  <button
                    id="btn-toggle-expansao-modos-principais"
                    type="button"
                    onClick={handleToggleMainMenu}
                    {...bindTooltip({
                      title: 'Menu Principal',
                      badge: isMainMenuExpanded ? 'Recolher' : 'Expandir',
                      badgeColor: isMainMenuExpanded
                        ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description: isMainMenuExpanded
                        ? 'Clique para recolher o Menu Principal e focar nas gavetas do sistema.'
                        : 'Clique para expandir o Menu Principal com os modos do BR Quest 2D (Clima, Biodiversidade, Geopolítica, Musicalidades e Aventura).',
                    })}
                    className="btn-toggle-expansao-modos-principais w-9 h-6 sm:w-10 sm:h-6 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label={isMainMenuExpanded ? 'Recolher Modos Principais' : 'Expandir Modos Principais'}
                    aria-expanded={isMainMenuExpanded}
                  >
                    {isMainMenuExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-300 transition-transform" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-amber-300 animate-pulse transition-transform" />
                    )}
                  </button>
                )}

            {/* Quando expandido (padrão): renderiza os 6 modos com botões padronizados */}
            {isMainMenuExpanded && (
              <div className="flex flex-col items-center gap-1 transition-all duration-200">
                {/* 1. CLIMA - Fundo Escuro Sólido de Alto Contraste */}
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
                    className={`btn-modo-clima relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      mainMode === 'clima'
                        ? 'bg-slate-900 border-amber-400 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.6)] scale-105 ring-1 ring-amber-400/80 font-bold'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-amber-300 hover:bg-slate-800 hover:border-amber-500/40'
                    }`}
                    aria-label="Temperatura e Clima"
                  >
                    {getClimaActiveIcon()}
                    {mainMode === 'clima' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-slate-950 shadow-[0_0_8px_#f59e0b] animate-pulse pointer-events-none" />
                    )}
                  </button>
                </div>

                {/* 2. BIODIVERSIDADE - Fundo Escuro Sólido de Alto Contraste */}
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
                    className={`btn-modo-biodiversidade relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      mainMode === 'biodiversidade'
                        ? 'bg-slate-900 border-emerald-400 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.6)] scale-105 ring-1 ring-emerald-400/80 font-bold'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-emerald-300 hover:bg-slate-800 hover:border-emerald-500/40'
                    }`}
                    aria-label="Biodiversidade e Biomas"
                  >
                    {getBiodiversidadeActiveIcon()}
                    {mainMode === 'biodiversidade' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-slate-950 shadow-[0_0_8px_#10b981] animate-pulse pointer-events-none" />
                    )}
                  </button>
                </div>

                {/* 3. GEOPOLÍTICA - Fundo Escuro Sólido de Alto Contraste */}
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
                    className={`btn-modo-geopolitica relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      mainMode === 'geopolitica'
                        ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.6)] scale-105 ring-1 ring-cyan-400/80 font-bold'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40'
                    }`}
                    aria-label="Geopolítica e Demografia"
                  >
                    {getGeopoliticaActiveIcon()}
                    {mainMode === 'geopolitica' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-slate-950 shadow-[0_0_8px_#38bdf8] animate-pulse pointer-events-none" />
                    )}
                  </button>
                </div>

                {/* 4. MUSICALIDADES - Fundo Escuro Sólido de Alto Contraste */}
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
                    className={`btn-modo-musicalidades relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      mainMode === 'musicalidades'
                        ? 'bg-slate-900 border-yellow-400 text-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.6)] scale-105 ring-1 ring-yellow-400/80 font-bold'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-yellow-300 hover:bg-slate-800 hover:border-yellow-500/40'
                    }`}
                    aria-label="Musicalidades e Rádio Retrô"
                  >
                    {getMusicalidadesActiveIcon()}
                    {mainMode === 'musicalidades' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-300 ring-2 ring-slate-950 shadow-[0_0_8px_#facc15] animate-pulse pointer-events-none" />
                    )}
                  </button>
                </div>

                {/* 5. AVENTURA & MAPA - Fundo Escuro Sólido de Alto Contraste */}
                <div className="relative">
                  <button
                    id="btn-modo-aventura"
                    ref={(el) => {
                      buttonRefs.current['aventura'] = el;
                    }}
                    onClick={() => handleModeButtonClick('aventura')}
                    {...bindTooltip({
                      title: `Aventura: ${getAventuraActiveLabel()}`,
                      badge: mainMode === 'aventura' ? 'Modo Ativo' : 'Avaliação BrQuest',
                      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description:
                        'Clique para abrir o menu de Desafios BrQuest: Grande Prova do Brasil, Clima, Biodiversidade, Geopolítica, Arte & Cultura, Filtros Regionais e Santuário.',
                    })}
                    className={`btn-modo-aventura relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      mainMode === 'aventura'
                        ? 'bg-slate-900 border-teal-400 text-teal-300 shadow-[0_0_14px_rgba(20,184,166,0.6)] scale-105 ring-1 ring-teal-400/80 font-bold'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-teal-300 hover:bg-slate-800 hover:border-teal-500/40'
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
            )}
          </div>

          {/* Divisor Horizontal */}
          <div className="w-6 h-[1px] bg-slate-800/80 shrink-0 my-0.5" />

          {/* ========================================================================= */}
          {/* C. TERRITÓRIO E REDES (GAVETA DE CAMADAS CARTOGRÁFICAS EXCLUSIVA 2D)      */}
          {/* ========================================================================= */}
          <Sidebar2DDrawerTerritory
            isExpanded={isTerritorySectionExpanded}
            onToggleExpand={handleToggleTerritorySection}
            activeLayer={currentCartographyLayer}
            onSelectLayer={handleSelectCartographyLayer}
            bindTooltip={bindTooltip}
            onRegisterButtonRef={(layer, el) => {
              territoryButtonRefs.current[layer] = el;
            }}
          />

          {/* Divisor Horizontal */}
          <div className="w-6 h-[1px] bg-slate-800/80 shrink-0 my-0.5" />

          {/* ========================================================================= */}
          {/* D. AMBIENTE E SISTEMA (ACCORDION SECTION 2)                               */}
          {/* ========================================================================= */}
          <div
            id="secao-controles-ambiente-sidebar"
            className="secao-controles-ambiente-sidebar flex flex-col items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-sky-500/30 shrink-0 shadow-lg transition-all duration-300"
          >
            {/* Interruptor / Seta para expandir e retrair a seção de Ambiente & Sistema */}
            <button
              id="btn-toggle-expansao-ambiente"
              type="button"
              onClick={handleToggleToolsSection}
              {...bindTooltip({
                title: 'Ambiente & Sistema',
                badge: isToolsSectionExpanded ? 'Recolher' : 'Expandir',
                badgeColor: isToolsSectionExpanded
                  ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                  : 'bg-sky-500/20 text-sky-300 border-sky-400/40',
                description: isToolsSectionExpanded
                  ? 'Clique para recolher os controles ambientais e utilitários do sistema, reabrindo o Menu Principal.'
                  : 'Clique para expandir os fenômenos climáticos (chuva, nuvens, ondas, astro solar) e utilitários (Saiba +, FPS, APIs).',
              })}
              data-testid="btn-toggle-expansao-atmosfera"
              className="btn-toggle-expansao-ambiente btn-toggle-expansao-atmosfera w-9 h-6 sm:w-10 sm:h-6 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label={isToolsSectionExpanded ? 'Recolher Ambiente & Sistema' : 'Expandir Ambiente & Sistema'}
              aria-expanded={isToolsSectionExpanded}
            >
              {isToolsSectionExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-300 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-sky-300 animate-pulse transition-transform" />
              )}
            </button>

            {/* Controles expansíveis (Chuva, Nuvens, Ondas, Astro) com tamanho padronizado */}
            {isToolsSectionExpanded && (
              <div className="flex flex-col items-center gap-1 transition-all duration-200">
                {/* 1. Simulador de Chuva - Textura de Precipitação com Gotas Diagonais */}
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
                    className={`btn-sidebar-chuva relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      isRainSimActive
                        ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-bold ring-1 ring-cyan-400/80'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 hover:border-cyan-500/40'
                    }`}
                    aria-label="Simulador de Chuva"
                  >
                    <CloudRain className={`w-4 h-4 sm:w-5 sm:h-5 ${isRainSimActive ? 'animate-bounce' : ''}`} />
                  </button>
                )}

                {/* 2. Nuvens Volumétricas - Fundo Escuro Sólido de Alto Contraste */}
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
                    className={`btn-sidebar-nuvens relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      isCloudsActive
                        ? 'bg-slate-900 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.5)] font-bold ring-1 ring-sky-400/80'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-sky-200 hover:bg-slate-800 hover:border-sky-500/40'
                    }`}
                    aria-label="Nuvens Volumétricas"
                  >
                    <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${isCloudsActive ? 'animate-pulse' : ''}`} />
                  </button>
                )}

                {/* 3. Ventos Alísios e Ondas - Fundo Escuro Sólido de Alto Contraste */}
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
                      description: 'Circulação dos Ventos Alísios equatoriais e correntes de ondas marinhas no Atlântico e Pacífico.',
                    })}
                    className={`btn-sidebar-ventos-ondas relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      isWavesActive
                        ? 'bg-slate-900 border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.5)] font-bold ring-1 ring-teal-400/80'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-teal-300 hover:bg-slate-800 hover:border-teal-500/40'
                    }`}
                    aria-label="Ventos Alísios e Ondas"
                  >
                    <Waves className={`w-4 h-4 sm:w-5 sm:h-5 ${isWavesActive ? 'animate-pulse' : ''}`} />
                  </button>
                )}

                {/* 4. Astro e Ciclo Solar/Noturno - Fundo Escuro Sólido de Alto Contraste */}
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
                      badge: activeCelestialMode === 'day' ? 'Dia Fixado' : activeCelestialMode === 'night' ? 'Noite Fixada' : 'Tempo Real (Auto)',
                      badgeColor: activeCelestialMode === 'auto'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description: 'Alterna entre iluminação solar diurna, abóbada celeste noturna e sincronização automática em tempo real com Brasília.',
                    })}
                    className={`btn-sidebar-astro-atmosfera relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      isAtmosphereActive
                        ? activeCelestialMode === 'auto'
                          ? 'bg-slate-900 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.5)] font-bold ring-1 ring-sky-400/80'
                          : 'bg-slate-900 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-bold ring-1 ring-amber-400/80'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-300 hover:text-amber-300 hover:bg-slate-800 hover:border-amber-500/40'
                    }`}
                    aria-label="Astro e Atmosfera"
                  >
                    {activeCelestialMode === 'night' ? (
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300 animate-pulse" />
                    ) : activeCelestialMode === 'day' ? (
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-spin" style={{ animationDuration: '14s' }} />
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <SunMedium className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" />
                        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-sky-400 text-slate-950 px-0.5 rounded leading-none shadow-sm">
                          A
                        </span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* MUNDO 2: GLOBO 3D ORBITAL (GAVETA EXCLUSIVA ORBITAL)                      */
        /* ========================================================================= */
        <Sidebar3DDrawerOrbital
          isExpanded={isGlobeSectionExpanded}
          onToggleExpand={() => {
            audioEngine.playSfx('click');
            setIsGlobeSectionExpanded((prev) => !prev);
          }}
          globeTextureMode={globeTextureMode}
          onGlobeTextureModeChange={onGlobeTextureModeChange}
          isGlobeCloudsActive={isGlobeCloudsActive}
          onToggleGlobeClouds={onToggleGlobeClouds}
          isGlobeAutoRotateActive={isGlobeAutoRotateActive}
          onToggleGlobeAutoRotate={onToggleGlobeAutoRotate}
          isGlobeBordersActive={isGlobeBordersActive}
          onToggleGlobeBorders={onToggleGlobeBorders}
          isGlobeTelemetryOpen={isGlobeTelemetryOpen}
          onToggleGlobeTelemetry={onToggleGlobeTelemetry}
          onResetGlobeCamera={onResetGlobeCamera}
          bindTooltip={bindTooltip}
        />
      )}

      {/* Divisor Horizontal */}
      <div className="w-7 h-[1px] bg-slate-800/80 shrink-0 my-0.5" />

      {/* ========================================================================= */}
      {/* E. GRUPO FIXO INFERIOR: USUÁRIO + CONFIGURAÇÕES                           */}
      {/* ========================================================================= */}
      <SidebarUserAndConfigsGroup
        playerLevel={playerLevel}
        onOpenUserProfile={onOpenUserProfile}
        onOpenSettings={onOpenSettings}
        onOpenAboutInfo={onOpenAboutInfo}
        onToggleFps={onToggleFps}
        showFps={showFps}
        onOpenApiStatus={onOpenApiStatus}
        apiCallsCount={apiCallsCount}
        setHoveredMenuTooltip={setHoveredMenuTooltip}
        setOpenFlyoutMode={setOpenFlyoutMode}
        bindTooltip={bindTooltip}
      />
    </div>

        {/* ========================================================================= */}
        {/* PAINEL FLYOUT VERTICAL FLUTUANTE COM BALÃO DE DIÁLOGO E CLAMPING         */}
        {/* ========================================================================= */}
        {openFlyoutMode && !selectedStateId && (
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
            selectedStateId={selectedStateId}
            onFocusState={onFocusState}
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
            onOpenBrQuestHub={onOpenBrQuestHub}
            playerLevel={playerLevel}
            playerXp={playerXp}
          />
        )}

        {/* ========================================================================= */}
        {/* SUBMENU LATERAL CONECTADO À SIDEBAR: TERRITÓRIO E REDES VIVAS            */}
        {/* ========================================================================= */}
        {isTerritorySubmenuEffective && currentCartographyLayer !== 'none' && !openFlyoutMode && !selectedStateId && (
          <TerritoryInteractiveLegend
            activeLayer={currentCartographyLayer}
            selectedSubitemId={selectedTerritorySubitemId}
            onSelectSubitem={onSelectTerritorySubitem}
            onSelectState={onSelectState}
            targetTop={territoryLegendPos?.top}
            arrowTop={territoryLegendPos?.arrowTop}
            onClose={() => {
              if (onToggleTerritorySubmenu) {
                onToggleTerritorySubmenu();
              } else {
                setLocalTerritorySubmenuOpen(false);
              }
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* BALÃO / TOOLTIP FLUTUANTE CONTEXTUAL ONHOVER (AO LADO DO ITEM)             */}
        {/* ========================================================================= */}
        {hoveredMenuTooltip && !openFlyoutMode && !selectedStateId && (
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
        {!hoveredMenuTooltip && !openFlyoutMode && !selectedStateId && hoveredStateId && mainMode === 'aventura' && (
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

