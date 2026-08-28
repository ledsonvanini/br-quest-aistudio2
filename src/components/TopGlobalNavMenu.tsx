import React, { useState } from 'react';
import {
  Compass,
  Thermometer,
  Radio,
  Trophy,
  CloudRain,
  Wind,
  Activity,
  Waves,
  Cloud,
  Droplets,
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
  Eye,
  Flag,
  Globe,
  Telescope,
  MousePointerClick,
  Crosshair,
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
  Landmark,
} from 'lucide-react';
import { audioEngine } from '../lib/audioSynth';
import { ClimateMode } from './map/ClimatePhenomenaLayer';
import { TerrainTileProvider, MapVisualStyle, ChoroplethSubTheme, BiodiversityKingdom, BrazilBiome } from '../types';
import { GeopoliticaMetricKey } from '../types/geopolitica';

export type AppMainMode = 'clima' | 'biodiversidade' | 'geopolitica' | 'globo3d' | 'aventura' | 'musicalidades';

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

interface MenuTooltipInfo {
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  extraDetail?: string;
}

export const TopGlobalNavMenu: React.FC<Props> = ({
  mainMode,
  onSelectMainMode,
  geopoliticaMetric = 'miscigenacao',
  onGeopoliticaMetricChange,
  isGeopoliticaPanelOpen = false,
  onToggleGeopoliticaPanel,
  biodiversityKingdom = 'all',
  onBiodiversityKingdomChange,
  biodiversityBiome = 'all',
  onBiodiversityBiomeChange,
  isBiodiversityThreatenedOnly = false,
  onToggleBiodiversityThreatenedOnly,
  isBiodiversityEndemicOnly = false,
  onToggleBiodiversityEndemicOnly,
  isBiodiversityPanelOpen = false,
  onToggleBiodiversityPanel,
  terrainProvider = 'shaded_relief',
  onTerrainProviderChange,
  visualStyle = 'tiles',
  onVisualStyleChange,
  choroplethSubTheme = 'regions',
  onChoroplethSubThemeChange,
  selectedRegionFilter = 'todos',
  onSelectRegionFilter,
  onHoverRegionFilter,
  showNeighbors = false,
  onToggleNeighbors,
  onNavigateToSanctuary,
  playerLevel = 1,
  playerXp = 0,
  completedStateCount = 0,
  unlockedInsigniaCount = 0,
  climateMode = 'temperaturas_frentes',
  onClimateModeChange,
  isObservatorioOpen = false,
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
  onFocusState,
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
  // Tooltip contextual flutuante
  const [hoveredMenuTooltip, setHoveredMenuTooltip] = useState<MenuTooltipInfo | null>(null);

  const bindTooltip = (info: MenuTooltipInfo) => ({
    onMouseEnter: () => setHoveredMenuTooltip(info),
    onMouseLeave: () =>
      setHoveredMenuTooltip((curr) => (curr?.title === info.title ? null : curr)),
  });

  // Coherent climate mode change with smart presets
  const handleSmartClimateModeChange = (mode: ClimateMode) => {
    audioEngine.playSfx('click');
    onClimateModeChange?.(mode);

    if (mode === 'ventos_aliseos') {
      if (!isCloudsActive) onToggleClouds?.();
      if (!isWavesActive) onToggleWaves?.();
      if (!isAtmosphereActive) onToggleAtmosphere?.();
      if (isRainSimActive) onToggleRainSim?.();
    } else if (mode === 'precipitacao_zcas') {
      if (!isRainSimActive) onToggleRainSim?.();
      if (!isCloudsActive) onToggleClouds?.();
      if (!isWavesActive) onToggleWaves?.();
    } else if (mode === 'temperaturas_frentes') {
      if (isRainSimActive) onToggleRainSim?.();
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* SIDEBAR GLOBAL LATERAL ESQUERDA (FIXA, CRESCIMENTO DO TOPO PARA BAIXO)  */}
      {/* ========================================================================= */}
      <aside
        id="menu-global-sidebar-esquerda"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="menu-global-sidebar-esquerda container-sidebar-navegacao menu-superior-status fixed left-2 sm:left-3 top-2 sm:top-3 z-40 flex flex-col items-start pointer-events-auto select-none"
        aria-label="Barra Lateral de Navegação BR Quest"
      >
        <div className="bg-[#020d24]/65 backdrop-blur-md border border-amber-500/35 rounded-2xl p-1.5 shadow-2xl shadow-black/80 flex flex-col items-center gap-1.5 text-white overflow-visible">
          
          {/* ========================================================================= */}
          {/* 1. LOGO BRQ (TOPO FIXO DA SIDEBAR)                                       */}
          {/* ========================================================================= */}
          <div className="relative group shrink-0">
            <button
              id="btn-sidebar-logo-brq"
              onClick={() => {
                audioEngine.playSfx('click');
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
          {/* 2. MODOS PRINCIPAIS (NA ORDEM SOLICITADA):                                */}
          {/* [Clima, Biodiversidade, Geopolítica, Musicalidade, Globo 3D, Aventura]    */}
          {/* ========================================================================= */}
          <div className="secao-modos-principais flex flex-col items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
            
            {/* 1. CLIMA / TEMPERATURA */}
            <div className="relative">
              <button
                id="btn-modo-clima"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('clima');
                }}
                {...bindTooltip({
                  title: 'Clima & Telemetria',
                  badge: 'Tempo Real',
                  badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
                  description:
                    'Modo Meteorológico: Radares de calor ECMWF (-4°C a 36°C), Ventos Alísios, Rios Voadores e ZCAS.',
                })}
                className={`btn-modo-clima w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'clima'
                    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-amber-300 shadow-md font-black scale-105 ring-2 ring-orange-400/50'
                    : 'text-slate-400 hover:text-orange-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Temperatura e Clima"
              >
                <Thermometer className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 2. BIODIVERSIDADE */}
            <div className="relative">
              <button
                id="btn-modo-biodiversidade"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('biodiversidade');
                }}
                {...bindTooltip({
                  title: 'Biodiversidade Brasileira',
                  badge: 'Fauna • Flora • SisCITES',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                  description:
                    'Exploração biológica dos 6 biomas: fauna nativa, flora, microrganismos, espécies ameaçadas e catálogo IBAMA SisCITES.',
                })}
                className={`btn-modo-biodiversidade w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'biodiversidade'
                    ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-slate-950 border-emerald-300 shadow-md font-black scale-105 ring-2 ring-emerald-400/50'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Biodiversidade Brasileira"
              >
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 3. GEOPOLÍTICA */}
            <div className="relative">
              <button
                id="btn-modo-geopolitica"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('geopolitica');
                }}
                {...bindTooltip({
                  title: 'Geopolítica & Demografia',
                  badge: 'Censo 2022 • IBGE • TSE',
                  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
                  description:
                    'Raio-X do Brasil: Miscigenação, Homens e Mulheres, Partidos Políticos, Densidade, Natalidade, Mortalidade e Alfabetização.',
                })}
                className={`btn-modo-geopolitica w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'geopolitica'
                    ? 'bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 text-slate-950 border-blue-300 shadow-md font-black scale-105 ring-2 ring-blue-400/50'
                    : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Geopolítica e Demografia"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 4. MUSICALIDADE */}
            <div className="relative">
              <button
                id="btn-modo-musicalidades"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('musicalidades');
                }}
                {...bindTooltip({
                  title: 'Musicalidades do Brasil',
                  badge: 'Acervo Sonoro',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                  description:
                    'Acervo histórico com Hinos Oficiais, Top 5 Regionais, Hinos Nacionais e Rádios Vintage de 1920 a 1990.',
                })}
                className={`btn-modo-musicalidades w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'musicalidades'
                    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-slate-950 border-yellow-300 shadow-md font-black scale-105 ring-2 ring-amber-400/50'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Musicalidades do Brasil"
              >
                <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 5. GLOBO 3D */}
            <div className="relative">
              <button
                id="btn-modo-globo3d"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('globo3d');
                }}
                {...bindTooltip({
                  title: 'Globo Terrestre 3D',
                  badge: 'NASA Orbit',
                  badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
                  description:
                    'Planeta Terra em 3D com dados de satélite da NASA, vetores dourados dos 27 estados e brasões heráldicos.',
                })}
                className={`btn-modo-globo3d w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'globo3d'
                    ? 'bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 text-slate-950 border-cyan-300 shadow-md font-black scale-105 ring-2 ring-indigo-400/50'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Globo Terrestre 3D"
              >
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 6. AVENTURA */}
            <div className="relative">
              <button
                id="btn-modo-aventura"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onSelectMainMode('aventura');
                }}
                {...bindTooltip({
                  title: 'Aventura & Navegação',
                  badge: 'Exploração Cívica',
                  badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
                  description:
                    'Navegue pelo relevo sombreado do Brasil, explore os 27 estados e conquiste as Insígnias dos Guardiões.',
                })}
                className={`btn-modo-aventura w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition cursor-pointer border ${
                  mainMode === 'aventura'
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 border-teal-300 shadow-md font-black scale-105 ring-2 ring-teal-400/50'
                    : 'text-slate-400 hover:text-teal-300 hover:bg-slate-800/80 border-transparent'
                }`}
                aria-label="Modo Aventura e Navegação"
              >
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Divisor Horizontal */}
          <div className="w-7 h-[1px] bg-slate-800/80 shrink-0" />

          {/* ========================================================================= */}
          {/* 3. SUBMENU ESPECÍFICO DO MODO ATIVO COM COR DISCRETA DE 30%               */}
          {/* ========================================================================= */}
          <div className="secao-submenu-ativo flex flex-col items-center shrink-0">
            
            {/* 3.A SUBMENU CLIMA (Tonalidade Laranja/Âmbar ~30%) */}
            {mainMode === 'clima' && (
              <div className="painel-submenu-clima flex flex-col items-center gap-1 bg-orange-950/40 border border-orange-500/30 p-1 rounded-xl shadow-[0_0_12px_rgba(249,115,22,0.20)]">
                {/* Temperatura ECMWF */}
                <div className="relative">
                  <button
                    id="btn-clima-temperatura"
                    onClick={() => handleSmartClimateModeChange('temperaturas_frentes')}
                    {...bindTooltip({
                      title: 'Temperatura & Calor (ECMWF)',
                      badge: '-4°C a 36°C',
                      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
                      description:
                        'Mapa térmico coroplético em alta resolução com frentes quentes e frias sobre o Brasil.',
                    })}
                    className={`btn-clima-temperatura w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      climateMode === 'temperaturas_frentes'
                        ? 'bg-orange-500 text-slate-950 font-black shadow-md scale-105 ring-1 ring-orange-300'
                        : 'text-orange-200/70 hover:text-orange-100 hover:bg-orange-900/50'
                    }`}
                    aria-label="Temperatura e Calor"
                  >
                    <Thermometer className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Previsão do Tempo 7 Dias */}
                <div className="relative">
                  <button
                    id="btn-clima-previsao"
                    onClick={() => handleSmartClimateModeChange('previsao_tempo')}
                    {...bindTooltip({
                      title: 'Previsão do Tempo (7 Dias)',
                      badge: 'ECMWF / Open-Meteo',
                      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description:
                        'Prognóstico meteorológico diário, máximas/mínimas previstas e probabilidade de chuva para todos os estados.',
                    })}
                    className={`btn-clima-previsao w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      climateMode === 'previsao_tempo'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105 ring-1 ring-amber-300'
                        : 'text-orange-200/70 hover:text-orange-100 hover:bg-orange-900/50'
                    }`}
                    aria-label="Previsão do Tempo"
                  >
                    <SunMedium className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Ventos Alísios & Rios Voadores */}
                <div className="relative">
                  <button
                    id="btn-clima-ventos"
                    onClick={() => handleSmartClimateModeChange('ventos_aliseos')}
                    {...bindTooltip({
                      title: 'Ventos Alísios & Rios Voadores',
                      badge: 'Vapor Amazônico',
                      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
                      description:
                        'Ativa fluxo de vento, nuvens volumétricas e ondas marinhas pelo continente.',
                    })}
                    className={`btn-clima-ventos w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      climateMode === 'ventos_aliseos'
                        ? 'bg-orange-400 text-slate-950 font-black shadow-md scale-105'
                        : 'text-orange-200/70 hover:text-orange-100 hover:bg-orange-900/50'
                    }`}
                    aria-label="Ventos Alísios e Rios Voadores"
                  >
                    <Wind className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* ZCAS & Chuvas */}
                <div className="relative">
                  <button
                    id="btn-clima-zcas"
                    onClick={() => handleSmartClimateModeChange('precipitacao_zcas')}
                    {...bindTooltip({
                      title: 'ZCAS & Chuvas Continentais',
                      badge: 'Convergência',
                      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description:
                        'Banda diagonal de convergência unindo a Amazônia ao Sudeste com chuva e nuvens carregadas.',
                    })}
                    className={`btn-clima-zcas w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      climateMode === 'precipitacao_zcas'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-orange-200/70 hover:text-orange-100 hover:bg-orange-900/50'
                    }`}
                    aria-label="ZCAS e Chuvas Continentais"
                  >
                    <CloudRain className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* El Niño / La Niña */}
                <div className="relative">
                  <button
                    id="btn-clima-elnino"
                    onClick={() => handleSmartClimateModeChange('el_nino_la_nina')}
                    {...bindTooltip({
                      title: 'El Niño & La Niña (ENSO)',
                      badge: 'Oceano Pacífico',
                      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
                      description:
                        'Variação térmica do Pacífico Equatorial que impacta o Semiárido e o Sul do país.',
                    })}
                    className={`btn-clima-elnino w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      climateMode === 'el_nino_la_nina'
                        ? 'bg-rose-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-orange-200/70 hover:text-orange-100 hover:bg-orange-900/50'
                    }`}
                    aria-label="El Niño e La Niña"
                  >
                    <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Observatório Ambiental */}
                {onToggleObservatorio && (
                  <div className="relative pt-1 border-t border-orange-500/30">
                    <button
                      id="btn-toggle-observatorio-topo"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleObservatorio();
                      }}
                      {...bindTooltip({
                        title: 'Observatório Ambiental',
                        badge: isObservatorioOpen ? 'Aberto' : 'Recolhido',
                        badgeColor: isObservatorioOpen
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700',
                        description:
                          'Painel de monitoramento meteorológico ao vivo, 27 estações das capitais, radar ECMWF e índices oceânicos.',
                      })}
                      className={`btn-toggle-observatorio-topo w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                        isObservatorioOpen
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold scale-105'
                          : 'bg-slate-900/80 text-orange-300 border-orange-500/40 hover:bg-orange-900/60 hover:text-amber-200'
                      }`}
                      aria-label="Observatório Ambiental"
                    >
                      <Telescope className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3.B SUBMENU BIODIVERSIDADE (Tonalidade Verde ~30%) */}
            {mainMode === 'biodiversidade' && (
              <div className="painel-submenu-biodiversidade flex flex-col items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 p-1 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.20)]">
                {/* Fauna */}
                <div className="relative">
                  <button
                    id="btn-bio-reino-fauna"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onBiodiversityKingdomChange?.('fauna');
                    }}
                    {...bindTooltip({
                      title: 'Fauna Brasileira',
                      badge: 'Mamíferos, Aves & Répteis',
                      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description: 'Mamíferos, aves, répteis, anfíbios, peixes e invertebrados nativos e endêmicos.',
                    })}
                    className={`btn-bio-reino-fauna w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      biodiversityKingdom === 'fauna'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
                    }`}
                    aria-label="Fauna Brasileira"
                  >
                    <Bird className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Flora */}
                <div className="relative">
                  <button
                    id="btn-bio-reino-flora"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onBiodiversityKingdomChange?.('flora');
                    }}
                    {...bindTooltip({
                      title: 'Flora do Brasil',
                      badge: 'Árvores, Flores & Plantas',
                      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                      description: 'Árvores monumentais, epífitas, orquídeas, cactáceas e plantas nativas dos biomas.',
                    })}
                    className={`btn-bio-reino-flora w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      biodiversityKingdom === 'flora'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
                    }`}
                    aria-label="Flora do Brasil"
                  >
                    <Trees className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Fungos */}
                <div className="relative">
                  <button
                    id="btn-bio-reino-fungi"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onBiodiversityKingdomChange?.('fungi_micro');
                    }}
                    {...bindTooltip({
                      title: 'Fungos & Microbioma',
                      badge: 'Orelha-de-Pau & Bioluminescentes',
                      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                      description: 'Fungos nativos da floresta tropical, decompositores de matéria orgânica e micélios bioluminescentes.',
                    })}
                    className={`btn-bio-reino-fungi w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      biodiversityKingdom === 'fungi_micro'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
                    }`}
                    aria-label="Fungos e Microrganismos"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                    >
                      <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
                      <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
                      <circle cx="8" cy="8.5" r="1" fill="currentColor" />
                      <circle cx="15.5" cy="9" r="0.8" fill="currentColor" />
                      <circle cx="12" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* Todos os Reinos */}
                <div className="relative">
                  <button
                    id="btn-bio-reino-todos"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onBiodiversityKingdomChange?.('all');
                    }}
                    {...bindTooltip({
                      title: 'Todos os Reinos Biológicos',
                      badge: 'Holístico',
                      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
                      description: 'Exibe múltiplos espécimes reais de fauna, flora e fungos simultaneamente no mapa.',
                    })}
                    className={`btn-bio-reino-todos w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      biodiversityKingdom === 'all'
                        ? 'bg-teal-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
                    }`}
                    aria-label="Todos os Reinos"
                  >
                    <Leaf className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Livro Vermelho */}
                <div className="relative pt-1 border-t border-emerald-500/30">
                  <button
                    id="btn-bio-ameacadas"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onToggleBiodiversityThreatenedOnly?.();
                    }}
                    {...bindTooltip({
                      title: 'Livro Vermelho (Espécies Ameaçadas)',
                      badge: isBiodiversityThreatenedOnly ? 'Filtro Ativo' : 'Todas',
                      badgeColor: isBiodiversityThreatenedOnly
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700',
                      description: 'Filtro oficial de espécies da fauna e flora ameaçadas de extinção segundo o Livro Vermelho do MMA/ICMBio (Categorias CR, EN e VU).',
                    })}
                    className={`btn-bio-ameacadas w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                      isBiodiversityThreatenedOnly
                        ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold shadow-md scale-105'
                        : 'bg-slate-900/80 text-rose-400 border-emerald-500/30 hover:bg-emerald-900/60 hover:text-rose-300'
                    }`}
                    aria-label="Livro Vermelho de Espécies Ameaçadas"
                  >
                    <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Painel de Biodiversidade */}
                {onToggleBiodiversityPanel && (
                  <div className="relative pt-1 border-t border-emerald-500/30">
                    <button
                      id="btn-toggle-painel-biodiversidade"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleBiodiversityPanel();
                      }}
                      {...bindTooltip({
                        title: 'Catálogo de Biodiversidade',
                        badge: isBiodiversityPanelOpen ? 'Aberto' : 'Recolhido',
                        badgeColor: isBiodiversityPanelOpen
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700',
                        description: 'Painel detalhado com 6 biomas, estatísticas por UF, filtros avançados e integração IBAMA SisCITES.',
                      })}
                      className={`btn-toggle-painel-biodiversidade w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                        isBiodiversityPanelOpen
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-bold scale-105'
                          : 'bg-slate-900/80 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60 hover:text-emerald-300'
                      }`}
                      aria-label="Catálogo de Biodiversidade"
                    >
                      <Layers className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3.C SUBMENU GEOPOLÍTICA (Tonalidade Azul/Anil ~30%) */}
            {mainMode === 'geopolitica' && (
              <div className="painel-submenu-geopolitica flex flex-col items-center gap-1 bg-blue-950/40 border border-blue-500/30 p-1 rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.20)]">
                {/* Miscigenação */}
                <div className="relative">
                  <button
                    id="btn-geopol-miscigenacao"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('miscigenacao');
                    }}
                    {...bindTooltip({
                      title: 'Miscigenação & Composição Étnica',
                      badge: 'Censo 2022',
                      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                      description: 'Composição de Pardos (45,3%), Brancos (43,5%), Pretos (10,2%), Indígenas e Amarelos por estado.',
                    })}
                    className={`btn-geopol-miscigenacao w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'miscigenacao' && !showNeighbors
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Miscigenação e Etnias"
                  >
                    <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Homens & Mulheres (Gênero) */}
                <div className="relative">
                  <button
                    id="btn-geopol-genero"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('genero');
                    }}
                    {...bindTooltip({
                      title: 'Distribuição por Sexo & Gênero',
                      badge: '51,5% Mulheres',
                      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
                      description: 'Proporção de mulheres e homens, razão de sexo por UF e pirâmide demográfica.',
                    })}
                    className={`btn-geopol-genero w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'genero' && !showNeighbors
                        ? 'bg-pink-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Gênero e Sexo"
                  >
                    <Percent className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Densidade Demográfica */}
                <div className="relative">
                  <button
                    id="btn-geopol-densidade"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('densidade');
                    }}
                    {...bindTooltip({
                      title: 'Densidade Demográfica & Urbanização',
                      badge: 'hab/km²',
                      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
                      description: 'Concentração de habitantes por quilômetro quadrado e índice de urbanização por estado.',
                    })}
                    className={`btn-geopol-densidade w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'densidade' && !showNeighbors
                        ? 'bg-sky-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Densidade Demográfica"
                  >
                    <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Natalidade */}
                <div className="relative">
                  <button
                    id="btn-geopol-natalidade"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('natalidade');
                    }}
                    {...bindTooltip({
                      title: 'Natalidade & Taxa de Fecundidade',
                      badge: 'Nascimentos ‰',
                      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
                      description: 'Taxa de natalidade por mil habitantes e número médio de filhos por mulher.',
                    })}
                    className={`btn-geopol-natalidade w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'natalidade' && !showNeighbors
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Natalidade e Fecundidade"
                  >
                    <Baby className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Mortalidade & Saúde */}
                <div className="relative">
                  <button
                    id="btn-geopol-mortalidade"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('mortalidade');
                    }}
                    {...bindTooltip({
                      title: 'Saúde, Longevidade & Mortalidade',
                      badge: 'DataSUS',
                      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
                      description: 'Expectativa de vida ao nascer (76,2 anos) e taxas de mortalidade infantil por estado.',
                    })}
                    className={`btn-geopol-mortalidade w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'mortalidade' && !showNeighbors
                        ? 'bg-rose-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Saúde, Longevidade e Mortalidade"
                  >
                    <HeartPulse className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Educação & Alfabetização */}
                <div className="relative">
                  <button
                    id="btn-geopol-analfabetismo"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('analfabetismo');
                    }}
                    {...bindTooltip({
                      title: 'Educação & Alfabetização',
                      badge: 'PNAD / Censo',
                      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                      description: 'Taxa de alfabetização (94,4% nacional), anos médios de estudo e taxas estaduais.',
                    })}
                    className={`btn-geopol-analfabetismo w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'analfabetismo' && !showNeighbors
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Educação e Alfabetização"
                  >
                    <GraduationCap className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Governo & Partidos Políticos */}
                <div className="relative">
                  <button
                    id="btn-geopol-partidos"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (showNeighbors && onToggleNeighbors) onToggleNeighbors();
                      onGeopoliticaMetricChange?.('partidos');
                    }}
                    {...bindTooltip({
                      title: 'Governo & Partidos Políticos',
                      badge: 'TSE Eleições',
                      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
                      description: 'Governadores eleitos, distribuição partidária dos 27 estados e representação.',
                    })}
                    className={`btn-geopol-partidos w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      geopoliticaMetric === 'partidos' && !showNeighbors
                        ? 'bg-purple-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-blue-200/70 hover:text-blue-100 hover:bg-blue-900/50'
                    }`}
                    aria-label="Governo e Partidos Políticos"
                  >
                    <Vote className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Mostrar Vizinhos / América do Sul */}
                {onToggleNeighbors && (
                  <div className="relative pt-1 border-t border-blue-500/30">
                    <button
                      id="btn-toggle-vizinhos"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleNeighbors();
                      }}
                      {...bindTooltip({
                        title: 'Países Vizinhos & América do Sul',
                        badge: showNeighbors ? 'Ativo (Continente)' : 'Oculto (Foco Brasil)',
                        badgeColor: showNeighbors
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700',
                        description:
                          'Abre o enquadramento para todo o continente sul-americano com bandeiras e dados geopolíticos dos 10 países vizinhos.',
                      })}
                      className={`btn-toggle-vizinhos w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                        showNeighbors
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold scale-105 ring-1 ring-amber-400/50'
                          : 'bg-slate-900/80 text-amber-400 border-blue-500/40 hover:bg-blue-900/60 hover:text-amber-300'
                      }`}
                      aria-label="Mostrar Países e Estados Vizinhos"
                    >
                      <Flag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Painel Geopolítico */}
                {onToggleGeopoliticaPanel && (
                  <div className="relative pt-1 border-t border-blue-500/30">
                    <button
                      id="btn-toggle-painel-geopolitica"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleGeopoliticaPanel();
                      }}
                      {...bindTooltip({
                        title: 'Observatório Geopolítico',
                        badge: isGeopoliticaPanelOpen ? 'Aberto' : 'Recolhido',
                        badgeColor: isGeopoliticaPanelOpen
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700',
                        description: 'Painel com visões Nacional, Regional e Estadual com todos os dados socioeconômicos e demográficos.',
                      })}
                      className={`btn-toggle-painel-geopolitica w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                        isGeopoliticaPanelOpen
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md font-bold scale-105'
                          : 'bg-slate-900/80 text-cyan-400 border-blue-500/40 hover:bg-blue-900/60 hover:text-cyan-300'
                      }`}
                      aria-label="Observatório Geopolítico"
                    >
                      <Landmark className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3.D SUBMENU MUSICALIDADES (Tonalidade Âmbar/Laranja ~30%) */}
            {mainMode === 'musicalidades' && (
              <div className="painel-submenu-musicalidades flex flex-col items-center gap-1 bg-amber-950/40 border border-amber-500/30 p-1 rounded-xl shadow-[0_0_12px_rgba(245,158,11,0.20)]">
                {/* Hinos Oficiais */}
                <div className="relative">
                  <button
                    id="btn-musica-hinos"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (!isRadioOpen) onToggleRadio?.();
                      onSelectMusicCategory?.('state_anthems');
                    }}
                    {...bindTooltip({
                      title: 'Hinos Oficiais do Estado',
                      badge: 'Hinos Cívicos',
                      description:
                        'Hino Oficial do Estado e Hino da Capital Municipal com letras e execução orquestrada.',
                    })}
                    className={`btn-musica-hinos w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      activeMusicCategory === 'state_anthems'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/50'
                    }`}
                    aria-label="Hinos Oficiais"
                  >
                    <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Top 5 Clássicos */}
                <div className="relative">
                  <button
                    id="btn-musica-top5"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (!isRadioOpen) onToggleRadio?.();
                      onSelectMusicCategory?.('top5');
                    }}
                    {...bindTooltip({
                      title: 'Top 5 Clássicos Regionais',
                      badge: 'Patrimônio Musical',
                      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
                      description:
                        'As 5 canções e ritmos mais representativos da identidade do estado e seus grandes artistas.',
                    })}
                    className={`btn-musica-top5 w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      activeMusicCategory === 'top5'
                        ? 'bg-orange-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/50'
                    }`}
                    aria-label="Top 5 Clássicos"
                  >
                    <Flame className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Hinos Nacionais */}
                <div className="relative">
                  <button
                    id="btn-musica-nacionais"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      if (!isRadioOpen) onToggleRadio?.();
                      onSelectMusicCategory?.('national');
                    }}
                    {...bindTooltip({
                      title: 'Hinos Cívicos Nacionais',
                      badge: 'Brasil',
                      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
                      description:
                        'Grandes símbolos cívicos do Brasil: Hino à Bandeira, Independência, Proclamação e Canção do Expedicionário.',
                    })}
                    className={`btn-musica-nacionais w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      activeMusicCategory === 'national'
                        ? 'bg-yellow-500 text-slate-950 font-black shadow-md scale-105'
                        : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/50'
                    }`}
                    aria-label="Hinos Cívicos Nacionais"
                  >
                    <Award className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Gabinete do Rádio Retrô */}
                {onToggleRadio && (
                  <div className="relative pt-1 border-t border-amber-500/30">
                    <button
                      id="btn-toggle-radio-gabinete"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleRadio();
                      }}
                      {...bindTooltip({
                        title: 'Gabinete do Rádio Retrô',
                        badge: isRadioOpen ? 'Aberto' : 'Oculto',
                        description:
                          'Exibe ou oculta o aparelho de rádio na tela (com controles de sintonia e eras sonoras).',
                      })}
                      className={`btn-toggle-radio-gabinete w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer border ${
                        isRadioOpen
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold scale-105'
                          : 'bg-slate-900/80 text-amber-400 border-amber-500/40 hover:bg-amber-900/60 hover:text-amber-300'
                      }`}
                      aria-label="Exibir/Ocultar Rádio"
                    >
                      <Radio className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3.E SUBMENU GLOBO 3D (Tonalidade Índigo/Azul ~30%) */}
            {mainMode === 'globo3d' && (
              <div className="painel-submenu-globo3d flex flex-col items-center gap-1 bg-indigo-950/40 border border-indigo-500/30 p-1 rounded-xl shadow-[0_0_12px_rgba(99,102,241,0.20)]">
                {/* NASA Satellite HD */}
                {onGlobeTextureModeChange && (
                  <div className="relative">
                    <button
                      id="btn-globo-textura-satellite"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onGlobeTextureModeChange('nasa_satellite');
                      }}
                      {...bindTooltip({
                        title: 'NASA Blue Marble',
                        badge: 'Satélite HD',
                        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
                        description:
                          'Fotografia orbital de alta precisão capturada pelas missões de satélites da NASA.',
                      })}
                      className={`btn-globo-textura-satellite w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        globeTextureMode === 'nasa_satellite'
                          ? 'bg-blue-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-indigo-200/70 hover:text-indigo-100 hover:bg-indigo-900/50'
                      }`}
                      aria-label="Textura NASA Blue Marble"
                    >
                      <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* NASA Night Lights */}
                {onGlobeTextureModeChange && (
                  <div className="relative">
                    <button
                      id="btn-globo-textura-night"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onGlobeTextureModeChange('night_lights');
                      }}
                      {...bindTooltip({
                        title: 'Luzes Noturnas da Terra',
                        badge: 'NASA Earth at Night',
                        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
                        description:
                          'Visualização das metrópoles e polos econômicos iluminados na face noturna do planeta.',
                      })}
                      className={`btn-globo-textura-night w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        globeTextureMode === 'night_lights'
                          ? 'bg-indigo-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-indigo-200/70 hover:text-indigo-100 hover:bg-indigo-900/50'
                      }`}
                      aria-label="Luzes Noturnas da Terra"
                    >
                      <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Fronteiras Douradas */}
                {onToggleGlobeBorders && (
                  <div className="relative">
                    <button
                      id="btn-globo-fronteiras"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleGlobeBorders();
                      }}
                      {...bindTooltip({
                        title: 'Fronteiras Vetoriais Douradas',
                        badge: isGlobeBordersActive ? 'Ativo' : 'Inativo',
                        description:
                          'Sobrepõe linhas vetoriais tridimensionais em ouro puro para os 27 estados e América do Sul.',
                      })}
                      className={`btn-globo-fronteiras w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        isGlobeBordersActive
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-indigo-200/70 hover:text-indigo-100 hover:bg-indigo-900/50'
                      }`}
                      aria-label="Fronteiras Vetoriais Douradas"
                    >
                      <Layers className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Nuvens 3D */}
                {onToggleGlobeClouds && (
                  <div className="relative">
                    <button
                      id="btn-globo-nuvens"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleGlobeClouds();
                      }}
                      {...bindTooltip({
                        title: 'Nuvens Atmosféricas 3D',
                        badge: isGlobeCloudsActive ? 'Ativo' : 'Inativo',
                        description:
                          'Camada orbital semitransparente de massas de nuvens equatoriais e ZCAS em rotação sutil.',
                      })}
                      className={`btn-globo-nuvens w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        isGlobeCloudsActive
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-indigo-200/70 hover:text-indigo-100 hover:bg-indigo-900/50'
                      }`}
                      aria-label="Nuvens Atmosféricas Orbitais"
                    >
                      <Cloud className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Auto-Rotação */}
                {onToggleGlobeAutoRotate && (
                  <div className="relative">
                    <button
                      id="btn-globo-rotacao"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onToggleGlobeAutoRotate();
                      }}
                      {...bindTooltip({
                        title: 'Rotação Orbital Contínua',
                        badge: isGlobeAutoRotateActive ? 'Girando' : 'Pausado',
                        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
                        description:
                          'Ativa o giro orbital contínuo e suave do Planeta Terra em velocidade cinematográfica.',
                      })}
                      className={`btn-globo-rotacao w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        isGlobeAutoRotateActive
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                          : 'text-indigo-200/70 hover:text-indigo-100 hover:bg-indigo-900/50'
                      }`}
                      aria-label="Rotação Orbital Contínua"
                    >
                      <Activity className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Modo Brasões */}
                {onGlobePinModeChange && (
                  <div className="relative">
                    <button
                      id="btn-globo-brasoes"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onGlobePinModeChange(globePinMode === 'all' ? 'compact' : globePinMode === 'compact' ? 'none' : 'all');
                      }}
                      {...bindTooltip({
                        title: 'Modo dos Brasões Heráldicos',
                        badge: globePinMode === 'all' ? 'Brasões Completos' : globePinMode === 'compact' ? 'Siglas UF' : 'Oculto',
                        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                        description:
                          'Alterna a visualização dos 27 brasões estaduais (40% preto translúcido + borda dourada).',
                      })}
                      className={`btn-globo-brasoes w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        globePinMode === 'all'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                          : 'text-indigo-200/70 hover:text-indigo-100 hover:bg-indigo-900/50'
                      }`}
                      aria-label="Modo de Exibição dos Brasões"
                    >
                      <Eye className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Centralizar Brasil */}
                {onResetGlobeCamera && (
                  <div className="relative pt-1 border-t border-indigo-500/30">
                    <button
                      id="btn-globo-reset-camera"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onResetGlobeCamera();
                      }}
                      {...bindTooltip({
                        title: 'Centralizar no Brasil',
                        badge: 'Reset Órbita',
                        description: 'Posiciona a câmera orbital centrada na América do Sul e nos 27 estados do Brasil.',
                      })}
                      className="btn-globo-reset-camera w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer text-indigo-300 hover:text-amber-300 hover:bg-indigo-900/60"
                      aria-label="Centralizar no Brasil"
                    >
                      <Crosshair className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3.F SUBMENU AVENTURA (Tonalidade Teal/Esmeralda ~30%) */}
            {mainMode === 'aventura' && (
              <div className="painel-submenu-aventura flex flex-col items-center gap-1 bg-teal-950/40 border border-teal-500/30 p-1 rounded-xl shadow-[0_0_12px_rgba(20,184,166,0.20)]">
                {/* Relevo Sombreado */}
                {onTerrainProviderChange && onVisualStyleChange && (
                  <>
                    <div className="relative">
                      <button
                        id="btn-aventura-relevo-sombreado"
                        onClick={() => {
                          audioEngine.playSfx('click');
                          onVisualStyleChange('tiles');
                          onTerrainProviderChange('shaded_relief');
                        }}
                        {...bindTooltip({
                          title: 'Relevo Sombreado Altimétrico',
                          badge: 'Padrão',
                          description:
                            'Relevo topográfico sombreado com curvas de nível e profundidade geomorfológica do Brasil.',
                        })}
                        className={`btn-aventura-relevo-sombreado w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          visualStyle === 'tiles' && terrainProvider === 'shaded_relief'
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                            : 'text-teal-200/70 hover:text-teal-100 hover:bg-teal-900/50'
                        }`}
                        aria-label="Relevo Sombreado"
                      >
                        <Mountain className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        id="btn-aventura-cores-naturais"
                        onClick={() => {
                          audioEngine.playSfx('click');
                          onVisualStyleChange('tiles');
                          onTerrainProviderChange('natural_earth');
                        }}
                        {...bindTooltip({
                          title: 'Cores Naturais da Terra',
                          badge: 'Biomas',
                          description:
                            'Coloração verdejante da Amazônia, Mata Atlântica, Cerrado, Caatinga, Pantanal e Pampa.',
                        })}
                        className={`btn-aventura-cores-naturais w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          visualStyle === 'tiles' && terrainProvider === 'natural_earth'
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                            : 'text-teal-200/70 hover:text-teal-100 hover:bg-teal-900/50'
                        }`}
                        aria-label="Cores Naturais e Biomas"
                      >
                        <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        id="btn-aventura-pergaminho"
                        onClick={() => {
                          audioEngine.playSfx('click');
                          onVisualStyleChange('tiles');
                          onTerrainProviderChange('voyager_parchment');
                        }}
                        {...bindTooltip({
                          title: 'Pergaminho das Grandes Navegações',
                          badge: 'Vintage',
                          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
                          description:
                            'Textura de papel envelhecido, tons sepia e estética das caravelas do século XVI.',
                        })}
                        className={`btn-aventura-pergaminho w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          visualStyle === 'tiles' && terrainProvider === 'voyager_parchment'
                            ? 'bg-amber-600 text-amber-50 font-black shadow-md scale-105'
                            : 'text-teal-200/70 hover:text-teal-100 hover:bg-teal-900/50'
                        }`}
                        aria-label="Pergaminho Histórico Cartográfico"
                      >
                        <Scroll className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        id="btn-aventura-coropletico"
                        onClick={() => {
                          audioEngine.playSfx('click');
                          onVisualStyleChange('choropleth');
                          onTerrainProviderChange('muted_gray');
                        }}
                        {...bindTooltip({
                          title: 'Divisão Político-Administrativa',
                          badge: 'Coroplético',
                          description:
                            'Destaque vetorial nítido das fronteiras dos 27 estados e regiões da federação.',
                        })}
                        className={`btn-aventura-coropletico w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          visualStyle === 'choropleth'
                            ? 'bg-teal-500 text-slate-950 font-black shadow-md scale-105'
                            : 'text-teal-200/70 hover:text-teal-100 hover:bg-teal-900/50'
                        }`}
                        aria-label="Capa Coroplética Temática"
                      >
                        <Layers className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </>
                )}

                {/* Filtros Regionais em Bloco Compacto 2 Colunas */}
                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-teal-500/30">
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
                        onClick={() => {
                          audioEngine.playSfx('click');
                          onSelectRegionFilter?.(reg.id);
                        }}
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
                        className={`btn-filtro-regiao w-7 h-6 sm:w-8 sm:h-7 rounded text-[10px] sm:text-[11px] font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-sm scale-105'
                            : 'text-teal-200/70 hover:text-teal-100 hover:bg-teal-900/50'
                        }`}
                      >
                        {reg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Santuário de Insígnias */}
                {onNavigateToSanctuary && (
                  <div className="relative pt-1 border-t border-teal-500/30">
                    <button
                      id="btn-santuario-insignias"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onNavigateToSanctuary();
                      }}
                      {...bindTooltip({
                        title: 'Santuário de Insígnias',
                        badge: `Nível ${playerLevel} • ${playerXp} XP`,
                        description:
                          'Cofre sagrado com as insígnias e relíquias conquistadas em suas jornadas.',
                      })}
                      className="btn-santuario-insignias w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:bg-amber-500/30 flex items-center justify-center transition cursor-pointer"
                      aria-label="Santuário de Insígnias"
                    >
                      <Trophy className="w-4.5 h-4.5 text-yellow-400" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botão de Configurações Gerais no rodapé da Sidebar */}
          {onOpenSettings && (
            <div className="mt-auto pt-1 shrink-0">
              <button
                id="btn-configuracoes-sidebar"
                onClick={() => {
                  audioEngine.playSfx('click');
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
        {/* BALÃO / TOOLTIP FLUTUANTE À DIREITA DA SIDEBAR                             */}
        {/* ========================================================================= */}
        <div
          id="container-display-labels-sidebar"
          className="container-display-labels-sidebar fixed left-16 sm:left-20 top-4 pointer-events-none z-50 flex flex-col gap-2 max-w-sm sm:max-w-md"
        >
          {/* BALÃO INFORMATIVO */}
          <div
            id="balao-ferramenta-sidebar"
            className={`balao-ferramenta-sidebar flex flex-col gap-1 p-2.5 rounded-xl bg-slate-950/95 backdrop-blur-md border border-amber-400/50 shadow-2xl shadow-black text-white text-xs transition-all duration-200 ease-in-out ${
              hoveredMenuTooltip ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-2 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-300 whitespace-nowrap">
                {hoveredMenuTooltip?.title || ''}
              </span>
              {hoveredMenuTooltip?.badge && (
                <span
                  className={`text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full border shrink-0 ${
                    hoveredMenuTooltip.badgeColor || 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  {hoveredMenuTooltip.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {hoveredMenuTooltip?.description || ''}
            </p>
          </div>

          {/* LEMBRETE DE NAVEGAÇÃO QUANDO SOBRE O MAPA */}
          <div
            id="lembrete-navegacao-wrapper"
            className={`transition-all duration-200 ease-in-out ${
              !hoveredMenuTooltip && hoveredStateId && mainMode === 'aventura'
                ? 'opacity-100 translate-x-0 pointer-events-auto'
                : 'opacity-0 -translate-x-2 pointer-events-none'
            }`}
          >
            <div
              id="lembrete-navegacao-fixo-sidebar"
              className="lembrete-navegacao-fixo-sidebar flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-400/40 shadow-lg shadow-black text-white text-[10px] sm:text-[11px] font-sans shrink-0"
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
          </div>
        </div>
      </aside>
    </>
  );
};
